"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";

type ProfileRow = Record<string, unknown>;
type PaymentDocument = {
  id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
  status: string;
  rejection_reason: string | null;
};
type EditableProfile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  university: string;
  field_of_study: string;
  year_of_study: string;
  status: string;
  fee_active: boolean;
  fee_valid_until: string | null;
  last_payment_date: string | null;
};

const LABELS: Record<string, string> = {
  id: "ID",
  email: "Email",
  first_name: "Imię",
  last_name: "Nazwisko",
  phone: "Telefon",
  pesel: "PESEL",
  birth_date: "Data urodzenia",
  address: "Adres",
  citizenship: "Obywatelstwo",
  university: "Uczelnia",
  field_of_study: "Kierunek",
  year_of_study: "Rok studiów",
  studies_start_date: "Data rozpoczęcia studiów",
  studies_end_date: "Data zakończenia studiów",
  status: "Status",
  join_date: "Data dołączenia",
  fee_active: "Składka aktywna",
  fee_valid_until: "Składka ważna do",
  last_payment_date: "Ostatnia wpłata",
  is_admin: "Admin",
  created_at: "Utworzono",
  updated_at: "Zaktualizowano",
};

const HIDDEN_KEYS = new Set(["birth_place", "statute_consent", "rodo_consent"]);

function isDateLikeKey(key: string) {
  return key.endsWith("_date") || key === "created_at" || key === "updated_at" || key.endsWith("_until");
}

function formatValue(key: string, value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Tak" : "Nie";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string" && isDateLikeKey(key)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleDateString("pl-PL");
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function renderInfoRow(key: string, value: unknown) {
  return (
    <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ color: "#64748b", fontSize: 13 }}>{LABELS[key] || key}</span>
      <span style={{ color: "#0f172a", fontSize: 14, fontWeight: 700, textAlign: "right", overflowWrap: "anywhere" }}>{formatValue(key, value)}</span>
    </div>
  );
}

function sectionCard(title: string, rows: Array<[string, unknown]>) {
  if (rows.length === 0) return null;
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 10px rgba(15,23,42,.05)" }}>
      <h3 style={{ margin: "0 0 8px", color: "#0f172a", fontSize: 16 }}>{title}</h3>
      <div>{rows.map(([key, value]) => renderInfoRow(key, value))}</div>
    </div>
  );
}

function toStringValue(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function isMembershipActiveByDate(feeValidUntil: string | null) {
  if (!feeValidUntil) return false;
  const validUntil = new Date(feeValidUntil);
  if (Number.isNaN(validUntil.getTime())) return false;
  validUntil.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return validUntil >= today;
}

function buildValidityFromJoinDate(joinDate: string | null, year: number): string | null {
  if (!joinDate) return null;
  const parsedJoin = new Date(joinDate);
  if (Number.isNaN(parsedJoin.getTime())) return null;
  const month = String(parsedJoin.getMonth() + 1).padStart(2, "0");
  const day = String(parsedJoin.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

export default function AdminMemberDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [member, setMember] = useState<ProfileRow | null>(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [paymentDocs, setPaymentDocs] = useState<PaymentDocument[]>([]);
  const [openingDocId, setOpeningDocId] = useState<string | null>(null);
  const [paymentDocsLoaded, setPaymentDocsLoaded] = useState(false);
  const [editing, setEditing] = useState<EditableProfile | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editSection, setEditSection] = useState<"personal" | "membership">("personal");
  const [sendingReminder, setSendingReminder] = useState(false);

  const memberId = params?.id;

  const loadData = useCallback(async () => {
    if (!memberId) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: viewer, error: viewerError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (viewerError || !viewer?.is_admin) {
        router.push("/panel");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", memberId)
        .maybeSingle();

      if (profileError) {
        setError("Nie udało się wczytać profilu: " + profileError.message);
      } else if (!profileData) {
        setError("Nie znaleziono profilu dla wskazanego członka.");
      } else {
        setMember(profileData as ProfileRow);
      }

    } catch (err: unknown) {
      setError("Nieoczekiwany błąd: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }, [memberId, router, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const loadPaymentDocs = async () => {
      if (!memberId || activeSection !== "payments" || paymentDocsLoaded) return;
      const { data: docsData, error: docsError } = await supabase
        .from("payment_confirmations")
        .select("id, file_url, file_name, uploaded_at, status, rejection_reason")
        .eq("member_id", memberId)
        .order("uploaded_at", { ascending: false });

      if (!docsError && docsData) {
        setPaymentDocs(docsData as PaymentDocument[]);
      }
      setPaymentDocsLoaded(true);
    };

    loadPaymentDocs();
  }, [activeSection, memberId, paymentDocsLoaded, supabase]);

  const groupedEntries = useMemo(() => {
    if (!member) return [];
    const map = new Map<string, unknown>(
      Object.entries(member).filter(([key]) => !HIDDEN_KEYS.has(key))
    );

    const take = (keys: string[]) =>
      keys
        .filter((key) => map.has(key))
        .map((key) => {
          const value = map.get(key);
          map.delete(key);
          return [key, value] as [string, unknown];
        });

    const personal = take(["email", "phone", "pesel", "birth_date", "address", "citizenship"]);
    const membership = take(["status", "join_date", "fee_active", "fee_valid_until", "last_payment_date"]);
    const studies = take(["university", "field_of_study", "year_of_study", "studies_start_date", "studies_end_date"]);
    const system = take(["is_admin", "id", "created_at", "updated_at"]);

    return [personal, membership, studies, system];
  }, [member]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
        <p style={{ color: "#64748b" }}>Ładowanie profilu...</p>
      </div>
    );
  }

  const fullName = [member?.first_name, member?.last_name].filter(Boolean).join(" ") || "Profil";
  const initials = `${String(member?.first_name || "").slice(0, 1)}${String(member?.last_name || "").slice(0, 1)}`.toUpperCase() || "U";
  const activeFee = isMembershipActiveByDate(toStringValue(member?.fee_valid_until) || null);
  const [personal, membership, studies, system] = groupedEntries as Array<Array<[string, unknown]>>;
  const openPaymentDocument = async (doc: PaymentDocument) => {
    setOpeningDocId(doc.id);
    const { data, error: signedUrlError } = await supabase.storage
      .from("payment-proofs")
      .createSignedUrl(doc.file_url, 600);
    setOpeningDocId(null);
    if (signedUrlError || !data?.signedUrl) {
      alert("Nie udało się otworzyć dokumentu.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };
  const openEditModal = () => {
    if (!member) return;
    const joinDate = toStringValue(member.join_date) || null;
    const existingUntil = toStringValue(member.fee_valid_until) || null;
    const baseYear = existingUntil ? new Date(existingUntil).getFullYear() : new Date().getFullYear();
    const normalizedUntil = joinDate ? (buildValidityFromJoinDate(joinDate, baseYear) || existingUntil) : existingUntil;
    const normalizedStatus = normalizeStatus(toStringValue(member.status));
    const normalizedYear = normalizeYear(toStringValue(member.year_of_study), normalizedStatus);
    setEditSection("personal");
    setEditing({
      first_name: toStringValue(member.first_name),
      last_name: toStringValue(member.last_name),
      email: toStringValue(member.email),
      phone: toStringValue(member.phone),
      university: toStringValue(member.university),
      field_of_study: toStringValue(member.field_of_study),
      year_of_study: normalizedYear,
      status: normalizedStatus,
      fee_active: isMembershipActiveByDate(normalizedUntil),
      fee_valid_until: normalizedUntil,
      last_payment_date: toStringValue(member.last_payment_date) || null,
    });
  };
  const saveEdit = async () => {
    if (!editing || !memberId) return;
    setSavingEdit(true);
    const computedFeeActive = isMembershipActiveByDate(editing.fee_valid_until);
    const payload = {
      first_name: editing.first_name,
      last_name: editing.last_name,
      phone: editing.phone,
      university: editing.university,
      field_of_study: editing.field_of_study,
      year_of_study: editing.year_of_study,
      status: editing.status,
      fee_active: computedFeeActive,
      fee_valid_until: editing.fee_valid_until,
      last_payment_date: editing.last_payment_date,
    };
    const { error: updateError } = await supabase.from("profiles").update(payload).eq("id", memberId);
    setSavingEdit(false);
    if (updateError) {
      alert("Nie udało się zapisać zmian: " + updateError.message);
      return;
    }
    setMember((prev) => (prev ? { ...prev, ...payload, fee_active: computedFeeActive } : prev));
    setEditing(null);
  };
  const sections = [
    { key: "personal", label: "Kontakt i dane osobowe", rows: personal },
    { key: "membership", label: "Członkostwo", rows: membership },
    { key: "studies", label: "Studia", rows: studies },
    { key: "system", label: "System", rows: system },
  ].filter((section) => section.rows.length > 0);
  const currentSection = sections.find((section) => section.key === activeSection) || sections[0];
  const sendPaymentReminder = async () => {
    if (!memberId) return;
    if (!confirm("Wysłać przypomnienie o składce do tego członka?")) return;
    setSendingReminder(true);
    const res = await fetch("/api/payments/remind", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_id: memberId }),
    });
    const data = await res.json();
    setSendingReminder(false);
    if (!res.ok) {
      alert("Nie udało się wysłać przypomnienia: " + (data.error || "Nieznany błąd"));
      return;
    }
    alert("Przypomnienie zostało wysłane.");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" }}>
      <div style={{ background: "#fff", padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button onClick={() => router.push("/admin")} style={{ padding: "8px 14px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#e2e8f0", color: "#475569" }}>
            ← Powrót do listy
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Image src="/img/logo.webp" alt="SSK" width={36} height={36} />
          <h1 style={{ fontSize: 20, color: "#0f172a", margin: 0 }}>Profil członka</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
          <button onClick={sendPaymentReminder} disabled={sendingReminder || activeFee} style={{ padding: "8px 14px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: sendingReminder || activeFee ? "not-allowed" : "pointer", background: sendingReminder || activeFee ? "#cbd5e1" : "#f59e0b", color: "#fff" }}>
            {sendingReminder ? "Wysyłanie..." : activeFee ? "Składka aktywna" : "Przypomnij o składce"}
          </button>
          <button onClick={openEditModal} style={{ padding: "8px 14px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#2563eb", color: "#fff" }}>
            Edytuj profil
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "24px auto", padding: "0 16px 24px" }}>
        {error ? (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <p style={{ margin: 0, color: "#dc2626", fontWeight: 600 }}>{error}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 10px rgba(15,23,42,.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ width: 66, height: 66, borderRadius: "50%", background: "#dbeafe", color: "#1d4ed8", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 24 }}>
                  {initials}
                </div>
                <div>
                  <h2 style={{ margin: 0, color: "#0f172a", fontSize: 24 }}>{fullName}</h2>
                  <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>{String(member?.email || "—")}</p>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ background: activeFee ? "#dcfce7" : "#fee2e2", color: activeFee ? "#15803d" : "#b91c1c", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 700 }}>
                    {activeFee ? "Składka aktywna" : "Składka nieaktywna"}
                  </span>
                  <span style={{ background: "#e0f2fe", color: "#0369a1", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 700 }}>
                    {String(member?.status || "Status nieustawiony")}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 12, boxShadow: "0 2px 10px rgba(15,23,42,.05)", display: "flex", gap: 8, flexWrap: "wrap" }}>
              {sections.map((section) => (
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
                Dokumenty płatności
              </button>
            </div>

            {activeSection === "payments" ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 10px rgba(15,23,42,.05)" }}>
                <h3 style={{ margin: "0 0 8px", color: "#0f172a", fontSize: 16 }}>Dokumenty płatności</h3>
                {paymentDocs.length === 0 ? (
                  <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: 14 }}>Brak przesłanych dokumentów.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", marginTop: 8 }}>
                    {paymentDocs.map((doc) => (
                      <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ color: "#0f172a", fontSize: 14, fontWeight: 700 }}>{doc.file_name || "Plik"}</div>
                          <div style={{ color: "#64748b", fontSize: 12 }}>
                            {new Date(doc.uploaded_at).toLocaleDateString("pl-PL")}
                          </div>
                          {doc.rejection_reason && (
                            <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 4 }}>
                              Powód odrzucenia: {doc.rejection_reason}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              borderRadius: 999,
                              padding: "4px 10px",
                              fontSize: 12,
                              fontWeight: 700,
                              background: doc.status === "confirmed" ? "#dcfce7" : doc.status === "rejected" ? "#fee2e2" : "#fef3c7",
                              color: doc.status === "confirmed" ? "#15803d" : doc.status === "rejected" ? "#b91c1c" : "#b45309",
                            }}
                          >
                            {doc.status === "confirmed" ? "Zatwierdzony" : doc.status === "rejected" ? "Odrzucony" : "Oczekuje"}
                          </span>
                          <button
                            type="button"
                            onClick={() => openPaymentDocument(doc)}
                            disabled={openingDocId === doc.id}
                            style={{ border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit", background: "#e0f2fe", color: "#0369a1" }}
                          >
                            {openingDocId === doc.id ? "Otwieram..." : "Podgląd"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              currentSection && sectionCard(currentSection.label, currentSection.rows)
            )}
          </div>
        )}
      </div>
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 120, display: "flex", justifyContent: "center", alignItems: "center", padding: 16 }} onClick={() => setEditing(null)}>
          <div style={{ background: "#fff", borderRadius: 16, maxWidth: 640, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "24px 24px 12px" }}>
              <h3 style={{ fontSize: 18, margin: 0, color: "#0f172a" }}>
                Edytuj: {editing.first_name} {editing.last_name}
              </h3>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>Wybierz sekcję i wprowadź zmiany.</p>
            </div>
            <div style={{ padding: "0 24px 12px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setEditSection("personal")}
                style={{ border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", background: editSection === "personal" ? "#dbeafe" : "#f8fafc", color: editSection === "personal" ? "#1d4ed8" : "#64748b" }}
              >
                Dane osobowe i studia
              </button>
              <button
                type="button"
                onClick={() => setEditSection("membership")}
                style={{ border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", background: editSection === "membership" ? "#dbeafe" : "#f8fafc", color: editSection === "membership" ? "#1d4ed8" : "#64748b" }}
              >
                Członkostwo
              </button>
            </div>
            <div style={{ padding: 24, overflowY: "auto" }}>
              {editSection === "personal" ? (
                <>
                  {([
                    { key: "first_name", label: "Imię" },
                    { key: "last_name", label: "Nazwisko" },
                    { key: "email", label: "Email", disabled: true },
                    { key: "phone", label: "Telefon" },
                    { key: "university", label: "Uczelnia" },
                    { key: "field_of_study", label: "Kierunek" },
                  ] as const).map((f) => (
                    <div key={f.key} style={{ marginBottom: 12 }}>
                      <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>{f.label}</label>
                      <input
                        style={{ width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                        value={editing[f.key]}
                        onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                        disabled={"disabled" in f && f.disabled}
                      />
                    </div>
                  ))}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>
                      {editing.status === "absolwent" ? "Lata po studiach" : "Rok studiów"}
                    </label>
                    <select
                      style={{ width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                      value={editing.year_of_study}
                      onChange={(e) => setEditing({ ...editing, year_of_study: e.target.value })}
                    >
                      {(editing.status === "absolwent" ? YEAR_OPTIONS_ABSOLWENT : YEAR_OPTIONS_STUDENT).map((y) => (
                        <option key={y} value={y}>
                          {editing.status === "absolwent" ? y : `${y}. rok`}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>Status</label>
                    <select
                      style={{ width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                      value={editing.status}
                      onChange={(e) => {
                        const nextStatus = e.target.value as "student" | "absolwent";
                        const nextYear = nextStatus === "absolwent" ? "rok po" : "1";
                        setEditing({ ...editing, status: nextStatus, year_of_study: nextYear });
                      }}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b", marginBottom: 4 }}>Składka aktywna</div>
                    <div style={{ padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, background: "#f8fafc", fontSize: 14, color: isMembershipActiveByDate(editing.fee_valid_until) ? "#15803d" : "#b91c1c", fontWeight: 700 }}>
                      {isMembershipActiveByDate(editing.fee_valid_until) ? "Tak (wyliczane z daty ważności)" : "Nie (wyliczane z daty ważności)"}
                    </div>
                  </div>
                  {toStringValue(member?.join_date) ? (
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>Rok ważności składki</label>
                      <select
                        style={{ width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                        value={editing.fee_valid_until ? String(new Date(editing.fee_valid_until).getFullYear()) : String(new Date().getFullYear())}
                        onChange={(e) => {
                          const selectedYear = Number(e.target.value);
                          const nextDate = buildValidityFromJoinDate(toStringValue(member?.join_date) || null, selectedYear);
                          setEditing({ ...editing, fee_valid_until: nextDate });
                        }}
                      >
                        {Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - 1 + i).map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <div style={{ marginTop: 8, padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, background: "#f8fafc", fontSize: 13, color: "#475569" }}>
                        Składka ważna do: <strong>{editing.fee_valid_until ? formatValue("fee_valid_until", editing.fee_valid_until) : "—"}</strong> (dzień i miesiąc z daty dołączenia)
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>Składka ważna do</label>
                      <input
                        type="date"
                        style={{ width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                        value={editing.fee_valid_until || ""}
                        onChange={(e) => setEditing({ ...editing, fee_valid_until: e.target.value || null })}
                      />
                    </div>
                  )}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>Ostatnia wpłata</label>
                    <input
                      type="date"
                      style={{ width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                      value={editing.last_payment_date || ""}
                      onChange={(e) => setEditing({ ...editing, last_payment_date: e.target.value || null })}
                    />
                  </div>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", padding: 16, borderTop: "1px solid #e2e8f0" }}>
              <button onClick={() => setEditing(null)} style={{ padding: "8px 12px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#e2e8f0", color: "#475569" }}>
                Anuluj
              </button>
              <button onClick={saveEdit} disabled={savingEdit} style={{ padding: "8px 12px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "#16a34a", color: "#fff" }}>
                {savingEdit ? "Zapisywanie..." : "Zapisz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
