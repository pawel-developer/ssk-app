"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const init = async () => {
      const hashParams = new URLSearchParams(
        window.location.hash.substring(1)
      );
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!sessionError) {
          window.history.replaceState({}, "", "/reset-password");
          setHasRecoverySession(true);
          setCheckingSession(false);
          return;
        }
      }

      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: codeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (!codeError) {
          window.history.replaceState({}, "", "/reset-password");
          setHasRecoverySession(true);
          setCheckingSession(false);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setHasRecoverySession(true);
      } else {
        setError(
          "Link jest nieaktywny lub wygasł. Wróć do logowania i wyślij nowy link."
        );
      }
      setCheckingSession(false);
    };

    init();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Hasła nie są identyczne.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("Nie udało się ustawić hasła. Spróbuj ponownie z nowym linkiem.");
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setSuccess("Hasło zostało ustawione. Możesz się teraz zalogować.");
    setPassword("");
    setPasswordConfirm("");
    setLoading(false);
  };

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
          src="/img/ssk-logo-md.webp"
          alt="SSK"
          width={64}
          height={64}
          style={{ margin: "0 auto 16px" }}
        />
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 24,
            marginBottom: 4,
            color: "#0f172a",
          }}
        >
          Ustaw nowe hasło
        </h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
          Ustaw hasło do logowania w panelu SSK.
        </p>

        {checkingSession ? (
          <p style={{ color: "#64748b", fontSize: 14 }}>Weryfikacja linku...</p>
        ) : success ? (
          <>
            <div style={{ margin: "8px 0 24px" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 12px", display: "block" }}>
                <circle cx="12" cy="12" r="10" fill="#dcfce7" />
                <path d="M8 12.5l2.5 2.5L16 9" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p style={{ color: "#166534", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                Hasło zostało ustawione!
              </p>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                Możesz się teraz zalogować nowym hasłem.
              </p>
            </div>
            <Link
              href="/login"
              style={{
                display: "inline-block",
                width: "100%",
                padding: 14,
                background: "#dc2626",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              Przejdź do logowania
            </Link>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
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
                  Nowe hasło
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 znaków"
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
                  Powtórz hasło
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Powtórz hasło"
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

              <button
                type="submit"
                disabled={loading || !hasRecoverySession}
                style={{
                  width: "100%",
                  padding: 14,
                  background: loading || !hasRecoverySession ? "#94a3b8" : "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading || !hasRecoverySession ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  marginTop: 8,
                }}
              >
                {loading ? "Zapisywanie..." : "Ustaw hasło"}
              </button>
            </form>

            <Link
              href="/login"
              style={{
                display: "inline-block",
                marginTop: 20,
                color: "#64748b",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              ← Wróć do logowania
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
