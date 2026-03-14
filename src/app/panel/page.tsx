"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  university: string;
  field_of_study: string;
  year_of_study: string;
  status: string;
  join_date: string;
  fee_active: boolean;
  fee_valid_until: string | null;
  last_payment_date: string | null;
  is_admin: boolean;
  is_archived: boolean;
  archived_at: string | null;
  archive_reason: string | null;
  birth_date: string | null;
  pesel: string | null;
  address: string | null;
  citizenship: string | null;
  studies_start_date: string | null;
  studies_end_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface PaymentConfirmation {
  id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
  status: string;
  rejection_reason: string | null;
}

type EditableFieldKey = "email" | "phone" | "university" | "field_of_study" | "status" | "year_of_study";

type EditingField = {
  key: EditableFieldKey;
  value: string;
};

function isMembershipActiveByDate(feeValidUntil: string | null) {
  if (!feeValidUntil) return false;
  const validUntil = new Date(feeValidUntil);
  if (Number.isNaN(validUntil.getTime())) return false;
  validUntil.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return validUntil >= today;
}

const MEMBER_LABELS: Record<string, string> = {
  first_name: "Imię",
  last_name: "Nazwisko",
  email: "Email",
  phone: "Telefon",
  pesel: "PESEL",
  birth_date: "Data urodzenia",
  address: "Adres",
  citizenship: "Obywatelstwo",
  university: "Uczelnia",
  field_of_study: "Kierunek",
  year_of_study: "Rok studiów",
  studies_start_date: "Start studiów",
  studies_end_date: "Koniec studiów",
  status: "Status",
  join_date: "Data dołączenia",
  fee_active: "Składka aktywna",
  fee_valid_until: "Składka ważna do",
  last_payment_date: "Ostatnia wpłata",
  is_archived: "Status członkostwa",
  archived_at: "Data archiwizacji",
  archive_reason: "Powód archiwizacji",
  created_at: "Utworzono profil",
  updated_at: "Ostatnia aktualizacja",
};

function isDateLikeKey(key: string) {
  return key.endsWith("_date") || key.endsWith("_until") || key.endsWith("_at");
}

function formatMemberValue(key: string, value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Tak" : "Nie";
  if (key === "is_archived") return value ? "Były członek" : "Obecny członek";
  if (typeof value === "string" && isDateLikeKey(key)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleDateString("pl-PL");
  }
  return String(value);
}

const STATUS_OPTIONS = [
  { value: "student", label: "Student/ka" },
  { value: "absolwent", label: "Absolwent/ka" },
] as const;
const YEAR_OPTIONS_STUDENT = ["1", "2", "3", "4", "5", "6"] as const;
const YEAR_OPTIONS_ABSOLWENT = ["rok po", "dwa lata po", "trzy lata po"] as const;

function normalizeStatus(rawStatus: string) {
  const val = rawStatus.toLowerCase();
  if (val.includes("absolwent")) return "absolwent";
  return "student";
}

function normalizeYear(rawYear: string, status: "student" | "absolwent") {
  if (status === "absolwent") {
    const val = rawYear.toLowerCase();
    if (val.includes("trzy")) return "trzy lata po";
    if (val.includes("dwa")) return "dwa lata po";
    if (val.includes("rok po") || val === "1") return "rok po";
    return "rok po";
  }
  const match = rawYear.match(/[1-6]/);
  return match ? match[0] : "1";
}

export default function MemberPanel() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [confirmations, setConfirmations] = useState<PaymentConfirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateMsg, setCertificateMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [resigning, setResigning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [savingField, setSavingField] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setError("Błąd ładowania profilu: " + profileError.message + ". Upewnij się, że migracja SQL została uruchomiona w Supabase.");
        setLoading(false);
        return;
      }

      if (!profileData) {
        setError("Brak profilu dla tego konta. Uruchom w Supabase SQL Editor:\n\ninsert into public.profiles (id, email, first_name, last_name, is_admin)\nselect id, email, 'Imię', 'Nazwisko', true\nfrom auth.users\nwhere email = '" + user.email + "'\non conflict (id) do update set is_admin = true;");
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: confs } = await supabase
        .from("payment_confirmations")
        .select("*")
        .eq("member_id", user.id)
        .order("uploaded_at", { ascending: false });

      if (confs) setConfirmations(confs);
      setLoading(false);
    } catch (err: unknown) {
      setError("Nieoczekiwany błąd: " + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !profile) return;

    setUploading(true);
    setUploadMsg(null);

    const ext = selectedFile.name.split(".").pop();
    const filePath = `${profile.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, selectedFile);

    if (uploadError) {
      setUploadMsg({ type: "err", text: "Błąd przesyłania pliku: " + uploadError.message });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from("payment_confirmations")
      .insert({
        member_id: profile.id,
        file_url: filePath,
        file_name: selectedFile.name,
        status: "pending",
      });

    if (insertError) {
      setUploadMsg({ type: "err", text: "Błąd zapisywania: " + insertError.message });
    } else {
      setUploadMsg({ type: "ok", text: "Potwierdzenie przesłane! Zarząd zweryfikuje je w ciągu kilku dni." });
      setSelectedFile(null);
      loadData();
    }
    setUploading(false);
  };

  const handleDownloadCertificate = async () => {
    setCertificateLoading(true);
    setCertificateMsg(null);
    try {
      const res = await fetch("/api/certificates/download", {
        method: "POST",
      });
      const data: { signedUrl?: string; error?: string } = await res.json();
      if (!res.ok || !data.signedUrl) {
        setCertificateMsg({ type: "err", text: data.error || "Nie udało się pobrać certyfikatu." });
        setCertificateLoading(false);
        return;
      }

      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.target = "_blank";
      a.click();
      setCertificateMsg({ type: "ok", text: "Certyfikat gotowy do pobrania." });
    } catch {
      setCertificateMsg({ type: "err", text: "Wystąpił błąd podczas generowania certyfikatu." });
    }
    setCertificateLoading(false);
  };

  const handleResign = async () => {
    if (!confirm("Czy na pewno chcesz zrezygnować ze stowarzyszenia?\n\nTo działanie zapisze Twoje konto jako byłego członka i wyłączy aktywne członkostwo. Aby wrócić, potrzebny będzie kontakt z administratorem.")) return;
    setResigning(true);
    try {
      const res = await fetch("/api/members/resign", { method: "POST" });
      const data: { error?: string } = await res.json();
      if (!res.ok) {
        alert("Błąd rezygnacji: " + (data.error || "Nieznany błąd"));
        setResigning(false);
        return;
      }
      await loadData();
      alert("Twoja rezygnacja została zapisana. Masz teraz status byłego członka.");
    } catch (err) {
      alert("Błąd rezygnacji: " + (err instanceof Error ? err.message : "Nieznany błąd"));
    }
    setResigning(false);
  };

  const openFieldEdit = (key: EditableFieldKey) => {
    if (!profile) return;
    if (key === "status") {
      setEditingField({ key, value: normalizeStatus(profile.status || "") });
      return;
    }
    if (key === "year_of_study") {
      const status = normalizeStatus(profile.status || "");
      setEditingField({ key, value: normalizeYear(profile.year_of_study || "", status) });
      return;
    }
    const current = profile[key];
    setEditingField({ key, value: typeof current === "string" ? current : (current ? String(current) : "") });
  };

  const saveFieldEdit = async () => {
    if (!profile || !editingField) return;
    const key = editingField.key;
    const value = editingField.value.trim();

    if ((key === "email" || key === "status" || key === "year_of_study") && !value) {
      alert("To pole nie może być puste.");
      return;
    }

    setSavingField(true);

    if (key === "email") {
      const nextEmail = value;
      const emailChanged = nextEmail !== (profile.email || "");
      if (emailChanged) {
        const { error: authError } = await supabase.auth.updateUser({ email: nextEmail });
        if (authError) {
          setSavingField(false);
          alert("Nie udało się zaktualizować adresu email: " + authError.message);
          return;
        }
      }
      const { error: updateError } = await supabase.from("profiles").update({ email: nextEmail }).eq("id", profile.id);
      setSavingField(false);
      if (updateError) {
        alert("Nie udało się zapisać zmian: " + updateError.message);
        return;
      }
      setProfile((prev) => (prev ? { ...prev, email: nextEmail } : prev));
      setEditingField(null);
      if (emailChanged) {
        alert("Email zaktualizowany. Supabase może wymagać potwierdzenia nowego adresu przez link email.");
      }
      return;
    }

    if (key === "phone") {
      const { error: updateError } = await supabase.from("profiles").update({ phone: value || null }).eq("id", profile.id);
      setSavingField(false);
      if (updateError) {
        alert("Nie udało się zapisać zmian: " + updateError.message);
        return;
      }
      setProfile((prev) => (prev ? { ...prev, phone: value || null } : prev));
      setEditingField(null);
      return;
    }

    if (key === "status") {
      const nextStatus = value as "student" | "absolwent";
      const normalizedYear = normalizeYear(profile.year_of_study || "", nextStatus);
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ status: nextStatus, year_of_study: normalizedYear })
        .eq("id", profile.id);
      setSavingField(false);
      if (updateError) {
        alert("Nie udało się zapisać zmian: " + updateError.message);
        return;
      }
      setProfile((prev) => (prev ? { ...prev, status: nextStatus, year_of_study: normalizedYear } : prev));
      setEditingField(null);
      return;
    }

    if (key === "year_of_study") {
      const { error: updateError } = await supabase.from("profiles").update({ year_of_study: value }).eq("id", profile.id);
      setSavingField(false);
      if (updateError) {
        alert("Nie udało się zapisać zmian: " + updateError.message);
        return;
      }
      setProfile((prev) => (prev ? { ...prev, year_of_study: value } : prev));
      setEditingField(null);
      return;
    }

    const payload = { [key]: value || null } as Partial<Profile>;
    const { error: updateError } = await supabase.from("profiles").update(payload).eq("id", profile.id);
    setSavingField(false);
    if (updateError) {
      alert("Nie udało się zapisać zmian: " + updateError.message);
      return;
    }
    setProfile((prev) => (prev ? { ...prev, ...payload } : prev));
    setEditingField(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <p style={{ color: "#64748b" }}>Ładowanie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 40, boxShadow: "0 4px 24px rgba(0,0,0,.08)", maxWidth: 500, textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>⚠️</p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#0f172a", marginBottom: 12 }}>Błąd</h2>
          <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 20 }}>{error}</p>
          <a href="/login" style={{ color: "#64748b", fontSize: 14 }}>← Wróć do logowania</a>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.email;
  const isArchived = Boolean(profile.is_archived);
  const isExpired = !isMembershipActiveByDate(profile.fee_valid_until);
  const hasPending = confirmations.some((c) => c.status === "pending");
  const isAdmin = Boolean(profile.is_admin);
  const profileSections = (() => {
    const sections = [
      {
        key: "personal",
        label: "Dane osobowe",
        rows: [
          ["first_name", profile.first_name],
          ["last_name", profile.last_name],
          ["email", profile.email],
          ["phone", profile.phone],
        ],
      },
      {
        key: "studies",
        label: "Studia",
        rows: [
          ["university", profile.university],
          ["field_of_study", profile.field_of_study],
          ["status", profile.status],
          ["year_of_study", profile.year_of_study],
          ["studies_start_date", profile.studies_start_date],
          ["studies_end_date", profile.studies_end_date],
        ],
      },
      {
        key: "membership",
        label: "Członkostwo",
        rows: [
          ["join_date", profile.join_date],
          ["fee_active", profile.fee_active],
          ["fee_valid_until", profile.fee_valid_until],
          ["last_payment_date", profile.last_payment_date],
          ["archived_at", profile.archived_at],
          ["archive_reason", profile.archive_reason],
        ],
      },
    ] as const;

    return sections
      .map((section) => ({
        ...section,
        rows: section.rows.filter(([, value]) => value !== null && value !== undefined && value !== ""),
      }))
      .filter((section) => section.rows.length > 0);
  })();
  const currentSection = activeSection === "payments"
    ? null
    : (profileSections.find((section) => section.key === activeSection) || profileSections[0]);
  const editableKeys = new Set(["email", "phone", "university", "field_of_study", "status", "year_of_study"]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <div style={{ background: "#fff", padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <a
            href="/"
            style={{
              padding: "8px 14px",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: "#e2e8f0",
              color: "#475569",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            ← Strona główna
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Image src="/img/logo.webp" alt="SSK" width={36} height={36} />
          <h1 style={{ fontSize: 20, color: "#0f172a", margin: 0 }}>Panel członka</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              style={{ padding: "8px 14px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#0ea5e9", color: "#fff", fontFamily: "inherit" }}
            >
              Panel admina
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{ padding: "8px 14px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#e2e8f0", color: "#475569", fontFamily: "inherit" }}
          >
            Wyloguj
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "48px auto", padding: "0 20px", flex: 1, width: "100%" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,.08)", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <span style={{ fontSize: 40 }}>{isExpired ? "⚠️" : "✅"}</span>
            <div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "#0f172a", margin: 0 }}>{name}</h2>
              <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{profile.university || "—"}</p>
            </div>
          </div>

          {/* Membership banner */}
          <div style={{
            padding: 16, borderRadius: 10, marginBottom: 20, textAlign: "center",
            background: isArchived ? "#e5e7eb" : isExpired ? "#fee2e2" : "#dcfce7",
            border: `2px solid ${isArchived ? "#9ca3af" : isExpired ? "#fca5a5" : "#86efac"}`,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: isArchived ? "#374151" : isExpired ? "#dc2626" : "#16a34a" }}>
              {isArchived ? "Były członek stowarzyszenia" : isExpired ? "Składka wygasła" : "Członkostwo aktywne"}
            </div>
            {!isArchived && profile.fee_valid_until && (
              <div style={{ fontSize: 13, color: "#64748b" }}>
                Ważne do: {new Date(profile.fee_valid_until).toLocaleDateString("pl-PL")}
              </div>
            )}
            {isArchived && profile.archived_at && (
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                Rezygnacja/archiwizacja: {new Date(profile.archived_at).toLocaleDateString("pl-PL")}
              </div>
            )}
          </div>

          {/* Member details with section navigation */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 12, boxShadow: "0 2px 10px rgba(15,23,42,.05)", display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {profileSections.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                style={{
                  border: "none",
                  borderRadius: 10,
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  background: currentSection?.key === section.key ? "#dbeafe" : "#f8fafc",
                  color: currentSection?.key === section.key ? "#1d4ed8" : "#64748b",
                }}
              >
                {section.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveSection("payments")}
              style={{
                border: "none",
                borderRadius: 10,
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "inherit",
                background: activeSection === "payments" ? "#dbeafe" : "#f8fafc",
                color: activeSection === "payments" ? "#1d4ed8" : "#64748b",
              }}
            >
              Płatności
            </button>
          </div>

          {activeSection === "payments" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
              {!isArchived ? (
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "#0f172a", textAlign: "center", margin: "0 0 16px" }}>
                    Prześlij potwierdzenie wpłaty
                  </h3>

                  <div style={{ background: "#fff", borderRadius: 10, padding: 16, textAlign: "center", marginBottom: 20 }}>
                    <p style={{ fontSize: 14, color: "#475569", margin: "4px 0" }}>Numer konta:</p>
                    <p style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#0f172a", letterSpacing: 1 }}>
                      43 1600 1462 1710 3081 5000 0001
                    </p>
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
                      Tytuł przelewu: „Składka członkowska Imię Nazwisko Uczelnia"
                    </p>
                  </div>

                  {hasPending && (
                    <div style={{ background: "#fef3c7", border: "2px solid #fde68a", borderRadius: 10, padding: 16, textAlign: "center", marginBottom: 16 }}>
                      <p style={{ color: "#92400e", fontSize: 14, fontWeight: 600 }}>
                        Masz potwierdzenie oczekujące na weryfikację
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleUpload}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        border: "2px dashed #cbd5e1", borderRadius: 10, padding: 24, cursor: "pointer",
                        transition: "border-color .2s", textAlign: "center", background: "#fff",
                      }}>
                        <span style={{ fontSize: 24 }}>📎</span>
                        <span style={{ color: "#64748b", fontSize: 14 }}>
                          {selectedFile ? `✅ ${selectedFile.name}` : "Kliknij lub przeciągnij plik (JPG, PNG, PDF, max 5 MB)"}
                        </span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          style={{ display: "none" }}
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>

                    {uploadMsg && (
                      <p style={{ color: uploadMsg.type === "ok" ? "#16a34a" : "#dc2626", fontSize: 14, fontWeight: 500, marginBottom: 12, textAlign: "center" }}>
                        {uploadMsg.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={uploading || !selectedFile}
                      style={{
                        width: "100%", padding: 14,
                        background: uploading || !selectedFile ? "#94a3b8" : "#dc2626",
                        color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600,
                        cursor: uploading || !selectedFile ? "not-allowed" : "pointer", fontFamily: "inherit",
                      }}
                    >
                      {uploading ? "Wysyłam..." : "Wyślij potwierdzenie"}
                    </button>
                  </form>
                </div>
              ) : (
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16 }}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: 14, textAlign: "center" }}>
                    Konto jest zarchiwizowane. Wysyłanie nowych potwierdzeń jest niedostępne.
                  </p>
                </div>
              )}

              <div style={{ background: "#f8fafc", borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "#0f172a", textAlign: "center", margin: "0 0 16px" }}>
                  Historia potwierdzeń
                </h3>
                {confirmations.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: 14, textAlign: "center", margin: 0 }}>
                    Brak przesłanych potwierdzeń.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {confirmations.map((c) => (
                      <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#fff", borderRadius: 10 }}>
                        <div>
                          <p style={{ fontSize: 14, color: "#0f172a", fontWeight: 600, margin: 0 }}>{c.file_name || "Plik"}</p>
                          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                            {new Date(c.uploaded_at).toLocaleDateString("pl-PL")}
                          </p>
                          {c.rejection_reason && (
                            <p style={{ fontSize: 12, color: "#b91c1c", margin: "4px 0 0" }}>
                              Powód odrzucenia: {c.rejection_reason}
                            </p>
                          )}
                        </div>
                        <span style={{
                          padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                          background: c.status === "confirmed" ? "#dcfce7" : c.status === "rejected" ? "#fee2e2" : "#fef3c7",
                          color: c.status === "confirmed" ? "#16a34a" : c.status === "rejected" ? "#dc2626" : "#d97706",
                        }}>
                          {c.status === "confirmed" ? "Zatwierdzone" : c.status === "rejected" ? "Odrzucone" : "Oczekuje"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            currentSection && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 }}>
              {currentSection.rows.map(([key, value]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#f8fafc", borderRadius: 10 }}>
                  <span style={{ fontSize: 14, color: "#64748b" }}>{MEMBER_LABELS[String(key)] || String(key)}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", textAlign: "right", marginLeft: 12 }}>
                      {formatMemberValue(String(key), value)}
                    </span>
                    {editableKeys.has(String(key)) && (
                      <button
                        type="button"
                        onClick={() => openFieldEdit(String(key) as EditableFieldKey)}
                        style={{
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 10px",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "inherit",
                          background: "#dbeafe",
                          color: "#1d4ed8",
                        }}
                      >
                        Edytuj
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )
          )}

          {activeSection === "membership" && (
            <div style={{ marginBottom: 16 }}>
              <button
                onClick={handleDownloadCertificate}
                disabled={isExpired || isArchived || certificateLoading}
                style={{
                  width: "100%",
                  padding: 14,
                  background: isExpired || isArchived || certificateLoading ? "#94a3b8" : "#0369a1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: isExpired || isArchived || certificateLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {certificateLoading ? "Przygotowuję certyfikat..." : "Pobierz certyfikat członkostwa"}
              </button>
              {certificateMsg && (
                <p style={{ marginTop: 10, marginBottom: 0, fontSize: 13, textAlign: "center", color: certificateMsg.type === "ok" ? "#16a34a" : "#dc2626" }}>
                  {certificateMsg.text}
                </p>
              )}
              {(isExpired || isArchived) && (
                <p style={{ marginTop: 8, marginBottom: 0, fontSize: 12, textAlign: "center", color: "#64748b" }}>
                  Certyfikat jest dostępny wyłącznie dla aktywnych, obecnych członków.
                </p>
              )}
            </div>
          )}

          {!isArchived && activeSection === "membership" && (
            <button
              onClick={handleResign}
              disabled={resigning}
              style={{ width: "100%", marginTop: 10, padding: 14, background: "#fff", color: "#b91c1c", border: "2px solid #fecaca", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: resigning ? "not-allowed" : "pointer", fontFamily: "inherit" }}
            >
              {resigning ? "Przetwarzanie..." : "Zrezygnuj ze stowarzyszenia"}
            </button>
          )}
        </div>
      </div>

      {editingField && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 120, display: "flex", justifyContent: "center", alignItems: "center", padding: 16 }} onClick={() => setEditingField(null)}>
          <div style={{ background: "#fff", borderRadius: 16, maxWidth: 560, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "24px 24px 12px" }}>
              <h3 style={{ fontSize: 18, margin: 0, color: "#0f172a" }}>
                Edytuj {MEMBER_LABELS[editingField.key] || editingField.key}
              </h3>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>Zmieniasz jedno pole na raz.</p>
            </div>
            <div style={{ padding: "0 24px 16px", overflowY: "auto" }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>
                  {MEMBER_LABELS[editingField.key] || editingField.key}
                </label>
                {editingField.key === "status" ? (
                  <select
                    style={{ width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                    value={editingField.value}
                    onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : editingField.key === "year_of_study" ? (
                  <select
                    style={{ width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                    value={editingField.value}
                    onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                  >
                    {(normalizeStatus(profile.status || "") === "absolwent" ? YEAR_OPTIONS_ABSOLWENT : YEAR_OPTIONS_STUDENT).map((y) => (
                      <option key={y} value={y}>
                        {normalizeStatus(profile.status || "") === "absolwent" ? y : `${y}. rok`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={editingField.key === "email" ? "email" : "text"}
                    style={{ width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                    value={editingField.value}
                    onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                  />
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", padding: 16, borderTop: "1px solid #e2e8f0" }}>
              <button onClick={() => setEditingField(null)} style={{ padding: "8px 12px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#e2e8f0", color: "#475569" }}>
                Anuluj
              </button>
              <button onClick={saveFieldEdit} disabled={savingField} style={{ padding: "8px 12px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#16a34a", color: "#fff" }}>
                {savingField ? "Zapisywanie..." : "Zapisz"}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 12 }}>
        © 2026 Studenckie Stowarzyszenie Kardiologiczne
      </footer>
    </div>
  );
}
