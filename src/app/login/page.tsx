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
    if (lower.includes("redirect_to") || lower.includes("redirect") || lower.includes("not allowed")) {
      return "Link resetu jest zablokowany przez konfigurację Redirect URLs w Supabase. Dodaj bieżący adres /reset-password do allowlist.";
    }
    if (lower.includes("smtp") || lower.includes("mail") || lower.includes("connect") || lower.includes("tls") || lower.includes("ssl")) {
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
    const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(
      trimmedEmail,
      { redirectTo }
    );

    if (recoveryError) {
      console.error("resetPasswordForEmail failed:", recoveryError);
      setError(formatRecoveryError(recoveryError.message || "Nieznany błąd"));
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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 40,
          boxShadow: "0 4px 24px rgba(0,0,0,.08)",
          maxWidth: 440,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Image
          src="/img/logo.webp"
          alt="SSK"
          width={64}
          height={64}
          style={{ margin: "0 auto 16px" }}
        />

        {showChoice ? (
          <>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 24,
                marginBottom: 4,
                color: "#0f172a",
              }}
            >
              Witaj, {userName}!
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
              Wybierz panel, do którego chcesz przejść
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => router.push("/admin")}
                style={{
                  width: "100%",
                  padding: "16px 20px",
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
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Panel Administracji
              </button>
              <button
                onClick={() => router.push("/panel")}
                style={{
                  width: "100%",
                  padding: "16px 20px",
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
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Panel Członka
              </button>
            </div>

            <button
              onClick={handleLogout}
              style={{
                marginTop: 20,
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Wyloguj się
            </button>
          </>
        ) : (
          <>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 24,
                marginBottom: 4,
                color: "#0f172a",
              }}
            >
              Panel SSK
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
              Zaloguj się do panelu członka lub administracji
            </p>

            <form onSubmit={handleLogin}>
              <div style={{ textAlign: "left", marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 6,
                    fontSize: 14,
                    color: "#1e293b",
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
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "border .2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
              <div style={{ textAlign: "left", marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: 6,
                    fontSize: 14,
                    color: "#1e293b",
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
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "border .2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              {error && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 12,
                  }}
                >
                  {error}
                </p>
              )}
              {notice && (
                <p
                  style={{
                    color: "#166534",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 12,
                  }}
                >
                  {notice}
                </p>
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
                  marginTop: 8,
                }}
              >
                {loading ? "Logowanie..." : "Zaloguj się"}
              </button>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
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
                    color: sendingRecovery === "generate" ? "#94a3b8" : "#dc2626",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: sendingRecovery !== null ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    padding: 0,
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
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: sendingRecovery === "reset" ? "#94a3b8" : "#334155",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: sendingRecovery !== null ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    padding: "8px 12px",
                  }}
                >
                  {sendingRecovery === "generate"
                    ? "Wysyłanie linku..."
                    : "Pierwsze logowanie? Wygeneruj hasło"}
                </button>
              </div>
            </form>

            <a
              href="/"
              style={{
                display: "inline-block",
                marginTop: 20,
                color: "#64748b",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              ← Strona główna
            </a>
          </>
        )}
      </div>
    </div>
  );
}
