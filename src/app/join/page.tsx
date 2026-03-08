"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const UNIVERSITIES = [
  "Uniwersytet Medyczny w Białymstoku",
  "Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu",
  "Pomorski Uniwersytet Medyczny w Szczecinie",
  "Gdański Uniwersytet Medyczny",
  "Warszawski Uniwersytet Medyczny",
  "Śląski Uniwersytet Medyczny (Katowice)",
  "Śląski Uniwersytet Medyczny (Zabrze)",
  "Uniwersytet Medyczny w Lublinie",
  "Uniwersytet Medyczny w Łodzi",
  "Collegium Medicum Uniwersytetu Jagiellońskiego",
  "Collegium Medicum Uniwersytetu Mikołaja Kopernika w Bydgoszczy",
  "Collegium Medicum Uniwersytetu Zielonogórskiego",
  "Uniwersytet Opolski",
  "Akademia Śląska",
  "Uniwersytet Andrzeja Frycza Modrzewskiego w Krakowie",
  "Inna",
];

const FIELDS_OF_STUDY = [
  "Lekarski",
  "Lekarsko-dentystyczny",
  "Farmacja",
  "Analityka medyczna",
  "Pielęgniarstwo",
  "Ratownictwo medyczne",
  "Fizjoterapia",
  "Zdrowie publiczne",
  "Elektroradiologia",
  "Inny",
];


const STATUSES = [
  { value: "student_1", label: "Student/ka — 1. rok" },
  { value: "student_2", label: "Student/ka — 2. rok" },
  { value: "student_3", label: "Student/ka — 3. rok" },
  { value: "student_4", label: "Student/ka — 4. rok" },
  { value: "student_5", label: "Student/ka — 5. rok" },
  { value: "student_6", label: "Student/ka — 6. rok" },
  { value: "absolwent_1", label: "Absolwent/ka — 1. rok po ukończeniu" },
  { value: "absolwent_2", label: "Absolwent/ka — 2. rok po ukończeniu" },
  { value: "absolwent_3", label: "Absolwent/ka — 3. rok po ukończeniu" },
  { value: "inny", label: "Inny" },
];

const STATUTE_URL = "https://drive.google.com/file/d/1xMIOn-B4PW6x1xN2YYAa5sVj8xysr4a4/view?usp=drive_link";

const RODO_TEXT = `Studenckie Stowarzyszenie Kardiologiczne z siedzibą w Warszawie, ul. 1 Maja 6/61, 02–495 Warszawa wpisanego do rejestru stowarzyszeń Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy dla m.st. Warszawy, XIV Wydział Gospodarczy Krajowego Rejestru Gospodarczego pod numerem KRS 0001130618 (dalej jako: „Administrator") na podstawie art. 13 Rozporządzenia Parlamentu Rady (UE) 2016/679 z 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (Dz. U. UE. L. z 2016 r. Nr 119, str. 1 ze zm., dalej jako: „RODO") informuje, że jest Administrator przetwarza Pani/Pana dane osobowe.

Podanie przez Panią/Pana danych osobowych jest dobrowolne, ale brak podania danych osobowych uniemożliwi przyjęcie Pani/Pana w poczet członków Stowarzyszenia.

Pani/Pana dane osobowe są przetwarzane w celu:
1) rozpatrzenia deklaracji członkowskiej, prowadzenia ewidencji członków oraz realizacji stosunku członkostwa tj. na podstawie art. 6 ust. 1 lit. b RODO;
2) realizacji obowiązków Stowarzyszenia wynikających z przepisów ustawy o rachunkowości związanych z ewidencjonowaniem składek członkowskich tj. na podstawie art. 6 ust. 1 lit. c RODO;
3) ochrony prawnie uzasadnionego interesu Stowarzyszenia polegającego na dochodzeniu, ustaleniu i obronie przed roszczeniami wynikających ze stosunku członkostwa w Stowarzyszeniu, tj. na podstawie art. 6 ust. 1 lit. f RODO.

Zakres przetwarzanych przez Administratora danych osobowych obejmuje: imię, nazwisko, adres kontaktowy, adres e-mail, pesel, status, uczelnia/afiliacja, rok studiów, kierunek studiów, data i miejsce urodzenia, obywatelstwo, data rozpoczęcia studiów, data ukończenia studiów.

Administrator będzie przetwarzał Pani/Pana dane osobowe nie dłużej niż będzie to niezbędne dla realizacji celów przetwarzania danych osobowych, a w szczególności:
· przez okres członkostwa w Stowarzyszeniu, a po jego ustaniu przez okres przedawnienia roszczeń, tj. przez okres 3 lat w odniesieniu do zaległych składek członkowskich lub przez 6 lat w odniesieniu do pozostałych roszczeń wynikających ze stosunku członkostwa w Stowarzyszeniu;
· dla celów podatkowych, co do zasady przez okres 5 lat od końca roku kalendarzowego, w którym upłynął okres płatności podatku, chyba, że przepisy szczególne wskazują inny okres;
· przez okres wynikający z przepisów ustawy o rachunkowości, tj. 5 lat od początku roku następującego po roku obrotowym, którego dotyczą właściwe dane, chyba, że przepisy szczególne wskazują inny okres.

Jako osobie, której dane dotyczą przysługują Pani/Panu następujące uprawnienia: prawo do żądania dostępu do swoich danych osobowych i uzyskania informacji na temat ich przetwarzania, a w przypadku, gdyby były nieprawidłowe prawo do żądania ich sprostowania, zgodnie z art. 15 i 16 RODO; prawo do żądania usunięcia danych zgodnie z art. 17 RODO („prawo do bycia zapomnianym"); prawo do żądania ograniczenia przetwarzania danych w sytuacjach i na zasadach wskazanych w art. 18 RODO; prawo do złożenia skargi do organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych, zgodnie z art. 77 RODO.

Pani/Pana dane osobowe nie będą przekazywane do państw trzecich, tj. poza terytorium Unii Europejskiej.

Administrator nie będzie stosował wobec Pani/Pana zautomatyzowanego podejmowania decyzji.

Odbiorcami Pani/Pana danych osobowych będą podmioty, z którymi współpracuje Administrator, a w szczególności podmioty świadczące na rzecz Administratora usługi przechowywania danych, usługi administrowania systemami informatycznymi, usługi księgowe, usługi prawne.

Dane kontaktowe Administratora: Studenckie Stowarzyszenie Kardiologiczne z siedzibą w Warszawie, ul. 1 Maja 6/61, 02–495 Warszawa; adres e-mail: studenckiestowarzyszeniekardio@gmail.com`;

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
    pesel: "", birth_date: "", birth_place: "",
    address: "", citizenship: "polskie",
    university: "", university_other: "",
    field_of_study: "", field_of_study_other: "",
    status: "", status_other: "",
    studies_start_date: "", studies_end_date: "",
    password: "", password_confirm: "",
    statute_consent: false, rodo_consent: false,
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showRodoFull, setShowRodoFull] = useState(false);

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "#dc2626");
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "#e2e8f0");

  const validateStep1 = () => {
    if (!form.statute_consent) return "Akceptacja Statutu SSK jest wymagana";
    return null;
  };

  const validateStep2 = () => {
    if (!form.first_name.trim()) return "Podaj imię";
    if (!form.last_name.trim()) return "Podaj nazwisko";
    if (!form.pesel.trim()) return "Podaj PESEL";
    if (!/^\d{11}$/.test(form.pesel.trim())) return "PESEL musi zawierać 11 cyfr";
    if (!form.birth_date) return "Podaj datę urodzenia";
    if (!form.birth_place.trim()) return "Podaj miejsce urodzenia";
    if (!form.citizenship.trim()) return "Podaj obywatelstwo";
    if (!form.address.trim()) return "Podaj adres zamieszkania";
    return null;
  };

  const validateStep3 = () => {
    if (!form.email.trim() || !form.email.includes("@")) return "Podaj poprawny adres e-mail";
    if (!form.phone.trim()) return "Podaj numer telefonu";
    return null;
  };

  const validateStep4 = () => {
    if (!form.status) return "Wybierz status";
    if (form.status === "inny" && !form.status_other.trim()) return "Podaj status";
    const uni = form.university === "Inna" ? form.university_other : form.university;
    if (!uni.trim()) return "Wybierz uczelnię";
    const field = form.field_of_study === "Inny" ? form.field_of_study_other : form.field_of_study;
    if (!field.trim()) return "Wybierz kierunek studiów";
    if (!form.studies_start_date) return "Podaj datę rozpoczęcia studiów";
    return null;
  };

  const validateStep5 = () => {
    if (!form.rodo_consent) return "Akceptacja RODO jest wymagana";
    return null;
  };

  const validateStep6 = () => {
    if (form.password.length < 6) return "Hasło musi mieć co najmniej 6 znaków";
    if (form.password !== form.password_confirm) return "Hasła nie są identyczne";
    return null;
  };

  const validators: Record<number, () => string | null> = {
    1: validateStep1, 2: validateStep2, 3: validateStep3,
    4: validateStep4, 5: validateStep5, 6: validateStep6,
  };

  const handleNext = () => {
    setError("");
    const err = validators[step]?.();
    if (err) { setError(err); return; }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setError("");
    const err = validateStep6();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const university = (form.university === "Inna" ? form.university_other : form.university).trim();
      const field_of_study = (form.field_of_study === "Inny" ? form.field_of_study_other : form.field_of_study).trim();
      const status = form.status === "inny" ? (form.status_other.trim() || "inny") : form.status;

      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone: form.phone.trim(),
          pesel: form.pesel.trim(),
          birth_date: form.birth_date || null,
          birth_place: form.birth_place.trim(),
          university,
          field_of_study,
          status,
          address: form.address.trim(),
          citizenship: form.citizenship.trim(),
          studies_start_date: form.studies_start_date || null,
          studies_end_date: form.studies_end_date || null,
          statute_consent: form.statute_consent,
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

  const totalSteps = 6;
  const stepLabels = [
    "Statut", "Dane osobowe", "Kontakt",
    "Uczelnia", "Zgody RODO", "Konto",
  ];

  if (success) {
    const university = (form.university === "Inna" ? form.university_other : form.university).trim();
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
              <strong>Tytuł:</strong> Składka członkowska – {form.first_name} {form.last_name} – {university}
            </p>
          </div>
          <Link href="/login" style={{
            display: "inline-block", padding: "14px 32px", background: "#dc2626", color: "#fff",
            borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: "none",
          }}>
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
            Wypełnij formularz rejestracyjny i zostań członkiem Studenckiego Stowarzyszenia Kardiologicznego
          </p>
        </div>

        {/* Steps indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 28, flexWrap: "wrap" }}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700,
                  background: step >= n ? "#dc2626" : "#e2e8f0",
                  color: step >= n ? "#fff" : "#94a3b8",
                  transition: "all .2s",
                }}>
                  {step > n ? "✓" : n}
                </div>
                <span style={{ fontSize: 10, color: step >= n ? "#dc2626" : "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {stepLabels[n - 1]}
                </span>
              </div>
              {n < totalSteps && <div style={{ width: 20, height: 2, background: step > n ? "#dc2626" : "#e2e8f0", borderRadius: 1, transition: "all .2s", marginBottom: 18 }} />}
            </div>
          ))}
        </div>

        {/* ===== Step 1: Statute acceptance ===== */}
        {step === 1 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Akceptacja Statutu</h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
              Przed przystąpieniem do Studenckiego Stowarzyszenia Kardiologicznego zapoznaj się z treścią Statutu.
            </p>
            <a
              href={STATUTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 20px", background: "#f1f5f9", borderRadius: 10,
                color: "#0369a1", fontSize: 14, fontWeight: 600, textDecoration: "none",
                marginBottom: 24, border: "1px solid #e2e8f0",
              }}
            >
              📄 Otwórz Statut SSK (PDF)
            </a>
            <div style={{ marginTop: 8 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.statute_consent}
                  onChange={(e) => setForm({ ...form, statute_consent: e.target.checked })}
                  style={{ width: 20, height: 20, marginTop: 2, accentColor: "#dc2626" }}
                />
                <span style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.6 }}>
                  Akceptuję Statut Studenckiego Stowarzyszenia Kardiologicznego<span style={s.required}>*</span>
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ===== Step 2: Personal data ===== */}
        {step === 2 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Dane osobowe</h3>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Imię/imiona<span style={s.required}>*</span></label>
                <input style={s.input} value={form.first_name} onChange={f("first_name")} placeholder="Jan" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={s.col}>
                <label style={s.label}>Nazwisko<span style={s.required}>*</span></label>
                <input style={s.input} value={form.last_name} onChange={f("last_name")} placeholder="Kowalski" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>PESEL<span style={s.required}>*</span></label>
              <input style={s.input} value={form.pesel} onChange={f("pesel")} placeholder="12345678901" maxLength={11} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Data urodzenia<span style={s.required}>*</span></label>
                <input type="date" style={s.input} value={form.birth_date} onChange={f("birth_date")} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={s.col}>
                <label style={s.label}>Miejsce urodzenia<span style={s.required}>*</span></label>
                <input style={s.input} value={form.birth_place} onChange={f("birth_place")} placeholder="Warszawa" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Obywatelstwo<span style={s.required}>*</span></label>
              <input style={s.input} value={form.citizenship} onChange={f("citizenship")} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={s.label}>Adres zamieszkania<span style={s.required}>*</span></label>
              <input style={s.input} value={form.address} onChange={f("address")} placeholder="ul. Przykładowa 1, 00-000 Warszawa" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>
        )}

        {/* ===== Step 3: Contact data ===== */}
        {step === 3 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Dane kontaktowe</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Adres e-mail<span style={s.required}>*</span></label>
              <input type="email" style={s.input} value={form.email} onChange={f("email")} placeholder="jan.kowalski@gmail.com" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={s.label}>Numer telefonu<span style={s.required}>*</span></label>
              <input style={s.input} value={form.phone} onChange={f("phone")} placeholder="500 600 700" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>
        )}

        {/* ===== Step 4: Academic info ===== */}
        {step === 4 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Informacje akademickie</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Status<span style={s.required}>*</span></label>
              <select style={s.input} value={form.status} onChange={f("status")} onFocus={focusStyle} onBlur={blurStyle}>
                <option value="">— Wybierz status —</option>
                {STATUSES.map((st) => <option key={st.value} value={st.value}>{st.label}</option>)}
              </select>
            </div>
            {form.status === "inny" && (
              <div style={{ marginBottom: 20 }}>
                <label style={s.label}>Podaj status<span style={s.required}>*</span></label>
                <input style={s.input} value={form.status_other} onChange={f("status_other")} placeholder="np. rezydent, stażysta" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Uczelnia / Afiliacja<span style={s.required}>*</span></label>
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
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Kierunek studiów<span style={s.required}>*</span></label>
              <select style={s.input} value={form.field_of_study} onChange={f("field_of_study")} onFocus={focusStyle} onBlur={blurStyle}>
                <option value="">— Wybierz kierunek —</option>
                {FIELDS_OF_STUDY.map((fos) => <option key={fos} value={fos}>{fos}</option>)}
              </select>
            </div>
            {form.field_of_study === "Inny" && (
              <div style={{ marginBottom: 20 }}>
                <label style={s.label}>Podaj kierunek<span style={s.required}>*</span></label>
                <input style={s.input} value={form.field_of_study_other} onChange={f("field_of_study_other")} placeholder="Nazwa kierunku" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            )}
            <div style={s.row}>
              <div style={s.col}>
                <label style={s.label}>Data rozpoczęcia studiów<span style={s.required}>*</span></label>
                <input type="date" style={s.input} value={form.studies_start_date} onChange={f("studies_start_date")} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={s.col}>
                <label style={s.label}>Data ukończenia studiów</label>
                <input type="date" style={s.input} value={form.studies_end_date} onChange={f("studies_end_date")} onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
          </div>
        )}

        {/* ===== Step 5: RODO consent ===== */}
        {step === 5 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Zgody i potwierdzenia</h3>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>Deklaracja RODO</p>
              <div style={{
                background: "#f8fafc", borderRadius: 10, padding: 16, border: "1px solid #e2e8f0",
                maxHeight: showRodoFull ? "none" : 200, overflow: "hidden", position: "relative",
                transition: "max-height .3s",
              }}>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
                  {RODO_TEXT}
                </p>
                {!showRodoFull && (
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
                    background: "linear-gradient(transparent, #f8fafc)",
                  }} />
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowRodoFull(!showRodoFull)}
                style={{
                  background: "none", border: "none", color: "#0369a1", fontSize: 13,
                  fontWeight: 600, cursor: "pointer", padding: "8px 0", fontFamily: "inherit",
                }}
              >
                {showRodoFull ? "Zwiń ▲" : "Rozwiń pełną treść ▼"}
              </button>
            </div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.rodo_consent}
                onChange={(e) => setForm({ ...form, rodo_consent: e.target.checked })}
                style={{ width: 20, height: 20, marginTop: 2, accentColor: "#dc2626" }}
              />
              <span style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.6 }}>
                Zapoznałem/am się i akceptuję warunki przetwarzania danych osobowych zgodnie z RODO.<span style={s.required}>*</span>
              </span>
            </label>
          </div>
        )}

        {/* ===== Step 6: Account creation ===== */}
        {step === 6 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Utwórz konto</h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 20 }}>
              Ustaw hasło do panelu członkowskiego. Będziesz mógł/mogła się nim logować, sprawdzać status składki i przesyłać potwierdzenia wpłat.
            </p>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Hasło<span style={s.required}>*</span></label>
              <input type="password" style={s.input} value={form.password} onChange={f("password")} placeholder="Min. 6 znaków" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Powtórz hasło<span style={s.required}>*</span></label>
              <input type="password" style={s.input} value={form.password_confirm} onChange={f("password_confirm")} placeholder="Powtórz hasło" onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            {/* Summary */}
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 0 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", marginBottom: 8 }}>Podsumowanie:</p>
              <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.8 }}>
                <strong>{form.first_name} {form.last_name}</strong><br />
                {form.email}<br />
                {form.university === "Inna" ? form.university_other : form.university} — {form.field_of_study === "Inny" ? form.field_of_study_other : form.field_of_study}
              </p>
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

          {step < totalSteps ? (
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
