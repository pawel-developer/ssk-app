"use client";

import { Suspense, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/panel";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      router.push(profile?.is_admin ? "/admin" : "/panel");
    } else {
      router.push(redirect);
    }
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
          src="/img/logo.webp"
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
      </div>
    </div>
  );
}
