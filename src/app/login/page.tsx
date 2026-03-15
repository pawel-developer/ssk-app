"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingRecovery, setSendingRecovery] = useState<"reset" | "generate" | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showChoice, setShowChoice] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/panel";
  const supabase = createClient();

  const formatRecoveryError = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes("brak") && (lower.includes("service_role") || lower.includes("brevo_api"))) {
      return `Błąd konfiguracji serwera: ${message}`;
    }
    if (lower.includes("redirect_to") || lower.includes("redirect") || lower.includes("not allowed")) {
      return "Link resetu jest zablokowany przez konfigurację Redirect URLs w Supabase. Dodaj bieżący adres /reset-password do allowlist.";
    }
    if (lower.includes("smtp") || lower.includes("tls") || lower.includes("ssl")) {
      return "Supabase nie mógł wysłać e-maila przez SMTP. Sprawdź host/port/login/hasło SMTP (dla Brevo zwykle działa port 587 STARTTLS).";
    }
    return `Nie udało się wysłać wiadomości: ${message}`;
  };

  const checkExistingSession = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, first_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.is_admin) {
        setUserName(profile.first_name || user.email || "");
        setShowChoice(true);
        setCheckingSession(false);
        return;
      }
      router.push("/panel");
      return;
    }
    setCheckingSession(false);
  }, [supabase, router]);

  useEffect(() => { checkExistingSession(); }, [checkExistingSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Nieprawidłowy email lub hasło."
          : authError.message
      );
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, first_name")
        .eq("id", user.id)
        .single();

      if (profile?.is_admin) {
        setUserName(profile.first_name || user.email || "");
        setShowChoice(true);
        setLoading(false);
        return;
      }

      router.push(redirect);
    } else {
      router.push(redirect);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowChoice(false);
    setUserName("");
  };

  const sendRecoveryEmail = async (
    mode: "reset" | "generate",
    emailOverride?: string
  ) => {
    setError("");
    setNotice("");

    const trimmedEmail = (emailOverride ?? email).trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Podaj poprawny adres e-mail, aby kontynuować.");
      return;
    }

    setSendingRecovery(mode);
    const redirectTo = `${window.location.origin}/reset-password`;
    const res = await fetch("/api/auth/send-recovery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmedEmail, mode, redirectTo }),
    });
    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(formatRecoveryError(payload?.error || "Nieznany błąd"));
      setSendingRecovery(null);
      return;
    }

    setNotice(
      mode === "generate"
        ? "Jeśli konto istnieje, wysłaliśmy e-mail z linkiem do ustawienia nowego hasła (pierwsze logowanie)."
        : "Jeśli konto istnieje, wysłaliśmy e-mail z linkiem do resetu hasła."
    );
    setSendingRecovery(null);
  };

  const requestRecoveryEmail = async (mode: "reset" | "generate") => {
    const typed = window.prompt("Podaj adres e-mail konta:", email.trim());
    if (typed === null) return;
    const normalized = typed.trim().toLowerCase();
    setEmail(normalized);
    await sendRecoveryEmail(mode, normalized);
  };

  if (checkingSession) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <p style={{ color: "#64748b" }}>Ładowanie...</p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    transition: "border .2s, box-shadow .2s",
    boxSizing: "border-box",
    background: "#f8fafc",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,.3)",
          maxWidth: 420,
          width: "100%",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            padding: "28px 32px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.05, overflow: "hidden" }}>
            <svg viewBox="0 0 600 60" preserveAspectRatio="none" style={{ width: "100%", height: "100%", position: "absolute", bottom: 0 }}>
              <path d="M0,30 L100,30 L110,30 L120,10 L130,50 L140,5 L150,45 L160,30 L300,30 L310,30 L320,10 L330,50 L340,5 L350,45 L360,30 L500,30 L510,30 L520,10 L530,50 L540,5 L550,45 L560,30 L600,30" fill="none" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <Image
            src="/img/ssk-logo-white-md.webp"
            alt="SSK"
            width={52}
            height={52}
            style={{ margin: "0 auto 10px", position: "relative" }}
          />
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              color: "#fff",
              margin: 0,
              fontWeight: 700,
              position: "relative",
            }}
          >
            {showChoice ? `Witaj, ${userName}!` : "Panel SSK"}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: "6px 0 0", position: "relative" }}>
            {showChoice
              ? "Wybierz panel, do którego chcesz przejść"
              : "Zaloguj się do panelu członka lub administracji"}
          </p>
        </div>

        <div style={{ padding: "28px 32px 32px" }}>
          {showChoice ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => router.push("/admin")}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "opacity .15s",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Panel Administracji
                </button>
                <button
                  onClick={() => router.push("/panel")}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    background: "#0f172a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "opacity .15s",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Panel Członka
                </button>
              </div>

              <div style={{ textAlign: "center", marginTop: 18 }}>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Wyloguj się
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 6,
                      fontSize: 13,
                      color: "#475569",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Adres e-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jan.kowalski@gmail.com"
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#dc2626";
                      e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,.1)";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "#f8fafc";
                    }}
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 6,
                      fontSize: 13,
                      color: "#475569",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Hasło
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#dc2626";
                      e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,.1)";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "#f8fafc";
                    }}
                  />
                </div>

                {error && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginBottom: 14,
                    }}
                  >
                    <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 500, margin: 0 }}>
                      {error}
                    </p>
                  </div>
                )}
                {notice && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginBottom: 14,
                    }}
                  >
                    <p style={{ color: "#166534", fontSize: 13, fontWeight: 500, margin: 0 }}>
                      {notice}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: 14,
                    background: loading ? "#94a3b8" : "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    transition: "background .15s",
                  }}
                >
                  {loading ? "Logowanie..." : "Zaloguj się"}
                </button>
              </form>

              <div
                style={{
                  margin: "20px 0 0",
                  padding: "16px 0 0",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => requestRecoveryEmail("reset")}
                  disabled={sendingRecovery !== null}
                  style={{
                    background: "none",
                    border: "none",
                    color: sendingRecovery === "generate" ? "#cbd5e1" : "#64748b",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: sendingRecovery !== null ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                    transition: "color .15s",
                  }}
                >
                  {sendingRecovery === "reset"
                    ? "Wysyłanie linku..."
                    : "Nie pamiętasz hasła?"}
                </button>
                <button
                  type="button"
                  onClick={() => requestRecoveryEmail("generate")}
                  disabled={sendingRecovery !== null}
                  style={{
                    background: "none",
                    border: "none",
                    color: sendingRecovery === "reset" ? "#cbd5e1" : "#94a3b8",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: sendingRecovery !== null ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                    transition: "color .15s",
                  }}
                >
                  {sendingRecovery === "generate"
                    ? "Wysyłanie linku..."
                    : "Pierwsze logowanie? Wygeneruj hasło"}
                </button>
              </div>

              <div style={{ textAlign: "center", marginTop: 14 }}>
                <a
                  href="/"
                  style={{
                    color: "#cbd5e1",
                    fontSize: 12,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  ← Strona główna
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
