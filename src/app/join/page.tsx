"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const UNIVERSITIES = [
  "Warszawski Uniwersytet Medyczny",
  "Gdański Uniwersytet Medyczny",
  "Uniwersytet Jagielloński — Collegium Medicum",
  "Uniwersytet Medyczny w Łodzi",
  "Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu",
  "Uniwersytet Medyczny w Poznaniu",
  "Uniwersytet Medyczny w Lublinie",
  "Pomorski Uniwersytet Medyczny w Szczecinie",
  "Śląski Uniwersytet Medyczny w Katowicach",
  "Uniwersytet Medyczny w Białymstoku",
  "Collegium Medicum UMK w Bydgoszczy",
  "Collegium Medicum UWM w Olsztynie",
  "Uniwersytet Opolski — WNoZ",
  "Collegium Medicum UZ w Zielonej Górze",
  "Krakowska Akademia im. A. Frycza Modrzewskiego",
  "Uczelnia Łazarskiego",
  "Inna",
];

const STATUSES = [
  { value: "student", label: "Student/ka" },
  { value: "absolwent", label: "Absolwent/ka (do 3 lat)" },
  { value: "rezydent", label: "Rezydent/ka" },
  { value: "stażysta", label: "Stażysta/ka" },
  { value: "inny", label: "Inny" },
];

const s = {
  label: { display: "block" as const, fontWeight: 600, fontSize: 14, marginBottom: 6, color: "#1e293b" },
  input: {
    width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 10,
    fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const,
    transition: "border-color .2s",
  },
  row: { display: "flex" as const, gap: 16, marginBottom: 20 },
  col: { flex: 1, minWidth: 0 },
  required: { color: "#dc2626", marginLeft: 2 },
  section: {
    background: "#fff", borderRadius: 16, padding: "28px 32px",
    boxShadow: "0 1px 4px rgba(0,0,0,.06)", marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: 700 as const, color: "#0f172a", marginBottom: 20,
    paddingBottom: 12, borderBottom: "2px solid #f1f5f9",
  },
};

export default function JoinPage() {
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    birth_date: "", university: "", university_other: "",
    field_of_study: "", year_of_study: "", status: "student",
    address: "", citizenship: "polskie",
    password: "", password_confirm: "",
    rodo_consent: false,
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#dc2626");
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#e2e8f0");

  const validateStep1 = () => {
    if (!form.first_name.trim()) return "Podaj imię";
    if (!form.last_name.trim()) return "Podaj nazwisko";
    if (!form.email.trim() || !form.email.includes("@")) return "Podaj poprawny adres e-mail";
    return null;
  };

  const validateStep2 = () => {
    const uni = form.university === "Inna" ? form.university_other : form.university;
    if (!uni.trim()) return "Wybierz uczelnię";
    if (!form.field_of_study.trim()) return "Podaj kierunek studiów";
    if (!form.year_of_study.trim()) return "Podaj rok studiów";
    return null;
  };

  const validateStep3 = () => {
    if (form.password.length < 6) return "Hasło musi mieć co najmniej 6 znaków";
    if (form.password !== form.password_confirm) return "Hasła nie są identyczne";
    if (!form.rodo_consent) return "Wymagana zgoda na przetwarzanie danych";
    return null;
  };

  const handleNext = () => {
    setError("");
    const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : null;
    if (err) { setError(err); return; }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setError("");
    const err = validateStep3();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone: form.phone.trim(),
          birth_date: form.birth_date || null,
          university: (form.university === "Inna" ? form.university_other : form.university).trim(),
          field_of_study: form.field_of_study.trim(),
          year_of_study: form.year_of_study.trim(),
          status: form.status,
          address: form.address.trim(),
          citizenship: form.citizenship.trim(),
          rodo_consent: form.rodo_consent,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Wystąpił błąd");
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError("Błąd połączenia z serwerem");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "48px 40px", boxShadow: "0 4px 24px rgba(0,0,0,.08)", maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>
            ✓
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "#0f172a", marginBottom: 8 }}>
            Konto utworzone!
          </h2>
          <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
            Witaj w Studenckim Stowarzyszeniu Kardiologicznym, <strong>{form.first_name}</strong>!
          </p>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            Teraz opłać składkę członkowską (50 zł/rok) i prześlij potwierdzenie wpłaty
            w panelu członka. Po weryfikacji Twoje członkostwo będzie aktywne.
          </p>
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "left" }}>
            <p style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", marginBottom: 8 }}>Dane do przelewu:</p>
            <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.8 }}>
              <strong>Nr konta:</strong> 43 1600 1462 1710 3081 5000 0001<br />
              <strong>Odbiorca:</strong> Studenckie Stowarzyszenie Kardiologiczne<br />
              <strong>Adres:</strong> ul. 1 Maja 6/61, 02-495 Warszawa<br />
              <strong>Tytuł:</strong> Składka członkowska {form.first_name} {form.last_name} {form.university === "Inna" ? form.university_other : form.university}
            </p>
          </div>
          <Link
            href="/login"
            style={{
              display: "inline-block", padding: "14px 32px", background: "#dc2626", color: "#fff",
              borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}
          >
            Zaloguj się do panelu
          </Link>
          <br />
          <Link href="/" style={{ display: "inline-block", marginTop: 16, color: "#64748b", fontSize: 14 }}>
            ← Strona główna
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px 20px" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/">
            <Image src="/img/logo.webp" alt="SSK" width={56} height={56} style={{ margin: "0 auto 12px" }} />
          </Link>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "#0f172a", margin: "0 0 4px" }}>
            Dołącz do SSK
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Wypełnij formularz i zostań członkiem Studenckiego Stowarzyszenia Kardiologicznego
          </p>
        </div>

        {/* Steps indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700,
                background: step >= n ? "#dc2626" : "#e2e8f0",
                color: step >= n ? "#fff" : "#94a3b8",
                transition: "all .2s",
              }}>
                {step > n ? "✓" : n}
              </div>
              {n < 3 && <div style={{ width: 40, height: 2, background: step > n ? "#dc2626" : "#e2e8f0", borderRadius: 1, transition: "all .2s" }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Personal info */}
        {step === 1 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Dane osobowe</h3>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Imię<span style={s.required}>*</span></label>
                <input style={s.input} value={form.first_name} onChange={f("first_name")} placeholder="Jan" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={s.col}>
                <label style={s.label}>Nazwisko<span style={s.required}>*</span></label>
                <input style={s.input} value={form.last_name} onChange={f("last_name")} placeholder="Kowalski" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Adres e-mail<span style={s.required}>*</span></label>
              <input type="email" style={s.input} value={form.email} onChange={f("email")} placeholder="jan.kowalski@gmail.com" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Telefon</label>
                <input style={s.input} value={form.phone} onChange={f("phone")} placeholder="500 600 700" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={s.col}>
                <label style={s.label}>Data urodzenia</label>
                <input type="date" style={s.input} value={form.birth_date} onChange={f("birth_date")} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: University */}
        {step === 2 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Uczelnia i kierunek</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Uczelnia<span style={s.required}>*</span></label>
              <select style={s.input} value={form.university} onChange={f("university")} onFocus={focusStyle} onBlur={blurStyle}>
                <option value="">— Wybierz uczelnię —</option>
                {UNIVERSITIES.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            {form.university === "Inna" && (
              <div style={{ marginBottom: 20 }}>
                <label style={s.label}>Nazwa uczelni<span style={s.required}>*</span></label>
                <input style={s.input} value={form.university_other} onChange={f("university_other")} placeholder="Nazwa Twojej uczelni" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            )}
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Kierunek studiów<span style={s.required}>*</span></label>
                <input style={s.input} value={form.field_of_study} onChange={f("field_of_study")} placeholder="np. lekarski, pielęgniarstwo" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={s.col}>
                <label style={s.label}>Rok studiów<span style={s.required}>*</span></label>
                <input style={s.input} value={form.year_of_study} onChange={f("year_of_study")} placeholder="np. 3" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Status<span style={s.required}>*</span></label>
              <select style={s.input} value={form.status} onChange={f("status")} onFocus={focusStyle} onBlur={blurStyle}>
                {STATUSES.map((st) => <option key={st.value} value={st.value}>{st.label}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Adres zamieszkania</label>
              <input style={s.input} value={form.address} onChange={f("address")} placeholder="ul. Przykładowa 1, 00-000 Warszawa" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={s.label}>Obywatelstwo</label>
              <input style={s.input} value={form.citizenship} onChange={f("citizenship")} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>
        )}

        {/* Step 3: Account */}
        {step === 3 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Utwórz konto</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Hasło<span style={s.required}>*</span></label>
              <input type="password" style={s.input} value={form.password} onChange={f("password")} placeholder="Min. 6 znaków" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Powtórz hasło<span style={s.required}>*</span></label>
              <input type="password" style={s.input} value={form.password_confirm} onChange={f("password_confirm")} placeholder="Powtórz hasło" onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            {/* Summary */}
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", marginBottom: 8 }}>Podsumowanie:</p>
              <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.8 }}>
                <strong>{form.first_name} {form.last_name}</strong><br />
                {form.email}<br />
                {form.university === "Inna" ? form.university_other : form.university} — {form.field_of_study}, rok {form.year_of_study}
              </p>
            </div>

            <div style={{ marginBottom: 0 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.rodo_consent}
                  onChange={(e) => setForm({ ...form, rodo_consent: e.target.checked })}
                  style={{ width: 20, height: 20, marginTop: 2, accentColor: "#dc2626" }}
                />
                <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                  Wyrażam zgodę na przetwarzanie moich danych osobowych przez Studenckie
                  Stowarzyszenie Kardiologiczne w celach statutowych, zgodnie z RODO.<span style={s.required}>*</span>
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ color: "#dc2626", fontSize: 14, fontWeight: 500, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
          {step > 1 ? (
            <button onClick={() => { setStep(step - 1); setError(""); }} style={{
              padding: "14px 28px", background: "#e2e8f0", color: "#475569", border: "none",
              borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              ← Wstecz
            </button>
          ) : (
            <Link href="/#join" style={{
              padding: "14px 28px", background: "#e2e8f0", color: "#475569", border: "none",
              borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center",
            }}>
              ← Strona główna
            </Link>
          )}

          {step < 3 ? (
            <button onClick={handleNext} style={{
              padding: "14px 28px", background: "#dc2626", color: "#fff", border: "none",
              borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              Dalej →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{
              padding: "14px 28px", background: loading ? "#94a3b8" : "#16a34a", color: "#fff", border: "none",
              borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            }}>
              {loading ? "Tworzenie konta..." : "Utwórz konto"}
            </button>
          )}
        </div>

        {/* Login link */}
        <p style={{ textAlign: "center", marginTop: 24, color: "#64748b", fontSize: 14 }}>
          Masz już konto?{" "}
          <Link href="/login" style={{ color: "#dc2626", fontWeight: 600 }}>Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}
