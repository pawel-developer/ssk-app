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
  university: string;
  field_of_study: string;
  year_of_study: string;
  status: string;
  join_date: string;
  fee_active: boolean;
  fee_valid_until: string | null;
  last_payment_date: string | null;
}

interface PaymentConfirmation {
  id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
  status: string;
  rejection_reason: string | null;
}

export default function MemberPanel() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [confirmations, setConfirmations] = useState<PaymentConfirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
  const isExpired = !profile.fee_active || (profile.fee_valid_until && new Date(profile.fee_valid_until) < new Date());
  const hasPending = confirmations.some((c) => c.status === "pending");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ background: "#fff", padding: "12px 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #e2e8f0" }}>
        <Image src="/img/logo.webp" alt="SSK" width={40} height={40} />
        <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 16 }}>Panel Członka</span>
        <a href="/" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 500, marginLeft: "auto" }}>
          ← Strona główna
        </a>
      </nav>

      <div style={{ maxWidth: 560, margin: "48px auto", padding: "0 20px", flex: 1, width: "100%" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,.08)", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <span style={{ fontSize: 40 }}>✅</span>
            <div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "#0f172a", margin: 0 }}>{name}</h2>
              <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{profile.university || "—"}</p>
            </div>
          </div>

          {/* Membership banner */}
          <div style={{
            padding: 16, borderRadius: 10, marginBottom: 20, textAlign: "center",
            background: isExpired ? "#fee2e2" : "#dcfce7",
            border: `2px solid ${isExpired ? "#fca5a5" : "#86efac"}`,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: isExpired ? "#dc2626" : "#16a34a" }}>
              {isExpired ? "Składka wygasła" : "Członkostwo aktywne"}
            </div>
            {profile.fee_valid_until && (
              <div style={{ fontSize: 13, color: "#64748b" }}>
                Ważne do: {new Date(profile.fee_valid_until).toLocaleDateString("pl-PL")}
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Data dołączenia", value: profile.join_date ? new Date(profile.join_date).toLocaleDateString("pl-PL") : "—" },
              { label: "Ostatnia wpłata", value: profile.last_payment_date ? new Date(profile.last_payment_date).toLocaleDateString("pl-PL") : "—" },
              { label: "Składka ważna do", value: profile.fee_valid_until ? new Date(profile.fee_valid_until).toLocaleDateString("pl-PL") : "—" },
              { label: "Rok studiów", value: profile.year_of_study || "—" },
              { label: "Status", value: profile.status || "—" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#f8fafc", borderRadius: 10 }}>
                <span style={{ fontSize: 14, color: "#64748b" }}>{s.label}</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{s.value}</span>
              </div>
            ))}
          </div>

          <button onClick={handleLogout} style={{ width: "100%", padding: 14, background: "transparent", color: "#475569", border: "2px solid #e2e8f0", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            ← Wyloguj
          </button>
        </div>

        {/* Payment upload */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,.08)", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "#0f172a", textAlign: "center", marginBottom: 16 }}>
            Prześlij potwierdzenie wpłaty
          </h3>

          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, textAlign: "center", marginBottom: 20 }}>
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
                transition: "border-color .2s", textAlign: "center",
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

        {/* Previous confirmations */}
        {confirmations.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,.08)" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "#0f172a", textAlign: "center", marginBottom: 16 }}>
              Historia potwierdzeń
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {confirmations.map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#f8fafc", borderRadius: 10 }}>
                  <div>
                    <p style={{ fontSize: 14, color: "#0f172a", fontWeight: 600, margin: 0 }}>{c.file_name || "Plik"}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                      {new Date(c.uploaded_at).toLocaleDateString("pl-PL")}
                    </p>
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
          </div>
        )}
      </div>

      <footer style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 12 }}>
        © 2026 Studenckie Stowarzyszenie Kardiologiczne
      </footer>
    </div>
  );
}
