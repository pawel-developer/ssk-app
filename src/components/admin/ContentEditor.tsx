"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";

interface FaqItem {
  questionPl: string;
  questionEn: string;
  answerPl: string;
  answerEn: string;
}

const s = {
  card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)", marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 700 as const, color: "#0f172a", marginBottom: 12, cursor: "pointer", display: "flex" as const, justifyContent: "space-between" as const, alignItems: "center" as const },
  fieldRow: { display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" as const },
  fieldCol: { flex: 1, minWidth: 240 },
  label: { display: "block", fontWeight: 600 as const, fontSize: 13, marginBottom: 4, color: "#475569" },
  input: { width: "100%", padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const },
  textarea: { width: "100%", padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const, minHeight: 60, resize: "vertical" as const },
  btn: (bg: string, color: string) => ({ padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600 as const, cursor: "pointer", background: bg, color }),
};

function PairField({ label, valuePl, valueEn, onChangePl, onChangeEn, multiline }: {
  label: string; valuePl: string; valueEn: string;
  onChangePl: (v: string) => void; onChangeEn: (v: string) => void;
  multiline?: boolean;
}) {
  const Input = multiline ? "textarea" : "input";
  return (
    <div style={s.fieldRow}>
      <div style={s.fieldCol}>
        <label style={s.label}>{label} (PL)</label>
        <Input style={multiline ? s.textarea : s.input} value={valuePl} onChange={(e) => onChangePl(e.target.value)} />
      </div>
      <div style={s.fieldCol}>
        <label style={s.label}>{label} (EN)</label>
        <Input style={multiline ? s.textarea : s.input} value={valueEn} onChange={(e) => onChangeEn(e.target.value)} />
      </div>
    </div>
  );
}

function SingleField({ label, value, onChange, style: extraStyle }: {
  label: string; value: string; onChange: (v: string) => void; style?: React.CSSProperties;
}) {
  return (
    <div style={{ marginBottom: 12, ...extraStyle }}>
      <label style={s.label}>{label}</label>
      <input style={s.input} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div style={s.card}>
      <div style={s.sectionTitle} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span style={{ fontSize: 14, color: "#94a3b8" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div style={{ paddingTop: 8 }}>{children}</div>}
    </div>
  );
}

const DEFAULT_HERO = {
  title_line1_pl: "Studenckie", title_line1_en: "Student",
  title_line2_pl: "Stowarzyszenie", title_line2_en: "Cardiology",
  title_line3_pl: "Kardiologiczne", title_line3_en: "Association",
  subtitle_pl: "Łączymy studentów wszystkich kierunków medycznych i ścisłych, połączonych wspólną pasją do kardiologii. Zrzeszamy osoby do 3 lat od ukończenia studiów.",
  subtitle_en: "We unite students of all medical and science fields, connected by a shared passion for cardiology. Open to graduates up to 3 years after completing their studies.",
  btn1_pl: "Dołącz do nas", btn1_en: "Join Us",
  btn2_pl: "Dowiedz się więcej", btn2_en: "Learn more",
  stat1_number: "200+", stat1_pl: "Członków", stat1_en: "Members",
  stat2_number: "15+", stat2_pl: "Uczelni medycznych", stat2_en: "Medical universities",
};

const DEFAULT_ABOUT = {
  tag_pl: "Kim jesteśmy", tag_en: "Who we are",
  title_pl: "Więcej niż koło naukowe", title_en: "More than a student club",
  desc_pl: "SSK to ogólnopolska sieć studentów, którzy nie czekają na dyplom, żeby zacząć robić rzeczy w kardiologii. Organizujemy to, czego brakuje na uczelniach — praktyczne warsztaty, dostęp do ekspertów i środowisko ludzi, którzy chcą więcej.",
  desc_en: "SSK is a nationwide network of students who don\u2019t wait for a diploma to get involved in cardiology. We organize what universities lack \u2014 hands-on workshops, access to experts, and a community of people who want more.",
  cards: [
    { icon: "\uD83E\uDEC0", title_pl: "Ręce na ECHO i EKG", title_en: "Hands on ECHO & ECG", desc_pl: "Nie tylko teoria. Warsztaty echokardiografii, EKG, symulacje medyczne, cewnikowanie \u2014 uczysz się na sprzęcie, nie ze slajdów.", desc_en: "Not just theory. Echocardiography workshops, ECG, medical simulations, catheterization \u2014 you learn on real equipment, not from slides." },
    { icon: "\uD83C\uDF0D", title_pl: "Sieć z 15+ uczelni", title_en: "Network from 15+ universities", desc_pl: "Studenci z WUM, GUMed, UJ, UM Wrocław i wielu innych. Szkoły letnie w Gdańsku, konferencje w Warszawie, spotkania online z całej Polski.", desc_en: "Students from WUM, GUMed, UJ, UM Wrocław and many more. Summer schools in Gdańsk, conferences in Warsaw, online meetings from across Poland." },
    { icon: "\uD83C\uDF93", title_pl: "Eksperci jako mentorzy", title_en: "Experts as mentors", desc_pl: "Prof. Jaguszewski, prof. Balsam, prof. Buszman i inni \u2014 nasi opiekunowie merytoryczni to liderzy polskiej kardiologii, którzy prowadzą wykłady i warsztaty specjalnie dla nas.", desc_en: "Prof. Jaguszewski, Prof. Balsam, Prof. Buszman and others \u2014 our academic advisors are leaders of Polish cardiology who give lectures and workshops exclusively for us." },
  ],
};

const DEFAULT_JOIN = {
  tag_pl: "Członkostwo", tag_en: "Membership",
  title_pl: "Dołącz do nas", title_en: "Join Us",
  form_url: "/join",
  step1_title_pl: "Wypełnij formularz", step1_title_en: "Fill out the form",
  step1_desc_pl: "Kliknij poniższy przycisk i wypełnij formularz zgłoszeniowy \u2014 zajmie to tylko kilka minut.",
  step1_desc_en: "Click the button below and fill out the application form \u2014 it only takes a few minutes.",
  step1_btn_pl: "Otwórz formularz", step1_btn_en: "Open form",
  step2_title_pl: "Opłać składkę", step2_title_en: "Pay membership fee",
  step2_desc_pl: "Składka członkowska wynosi 50 zł rocznie.", step2_desc_en: "The annual membership fee is 50 PLN.",
  account_number: "43 1600 1462 1710 3081 5000 0001",
  recipient: "Studenckie Stowarzyszenie Kardiologiczne",
  recipient_address: "ul. 1 Maja 6/61, 02-495 Warszawa",
  fee_title_pl: "Składka członkowska Imię Nazwisko Uczelnia", fee_title_en: "Membership fee First-Name Last-Name University",
  step3_title_pl: "Czekaj na potwierdzenie", step3_title_en: "Wait for confirmation",
  step3_desc_pl: "Po zaksięgowaniu wpłaty i weryfikacji formularza otrzymasz potwierdzenie członkostwa. Jeśli masz pytania, napisz do nas:",
  step3_desc_en: "After the payment is registered and your form is verified, you will receive membership confirmation. If you have questions, contact us:",
  contact_email: "studenckiestowarzyszeniekardio@gmail.com",
  info_pl: "Jeśli nie otrzymasz potwierdzenia w ciągu kilku dni, sprawdź folder spam lub napisz do nas na powyższy adres e-mail.",
  info_en: "If you don\u2019t receive confirmation within a few days, check your spam folder or email us at the address above.",
};

const DEFAULT_COOP = {
  title_pl: "Współpraca z SKN", title_en: "Cooperation with Student Scientific Circles",
  desc_pl: "Studenckie Koła Naukowe mogą nawiązać z nami współpracę. Wypełnij formularze partnerskie i wyślij na nasz adres e-mail. Propozycja zostanie rozpatrzona na najbliższym posiedzeniu Zarządu Głównego.",
  desc_en: "Student Scientific Circles can partner with us. Fill out the partnership forms and send them to our email. The proposal will be reviewed at the next Main Board meeting.",
  btn_pl: "Skontaktuj się", btn_en: "Get in touch",
  email: "studenckiestowarzyszeniekardio@gmail.com",
};

const DEFAULT_FAQ: FaqItem[] = [
  { questionPl: "Dlaczego stowarzyszenie, a nie koło naukowe?", questionEn: "Why an association and not a scientific circle?", answerPl: "Stowarzyszenie daje nam niezależność prawną i możliwość działania międzyuczelnianego. Jako zarejestrowany podmiot w KRS, możemy formalnie współpracować z ośrodkami akademickimi, pozyskiwać sponsorów i organizować ogólnopolskie wydarzenia.", answerEn: "An association gives us legal independence and the ability to operate across universities. As a registered entity in the National Court Register (KRS), we can formally collaborate with academic centers, attract sponsors, and organize nationwide events." },
  { questionPl: "Kto może dołączyć do SSK?", questionEn: "Who can join SSK?", answerPl: "Studenci wszystkich kierunków medycznych i ścisłych oraz osoby do 3 lat od ukończenia studiów. Nie musisz studiować medycyny \u2014 wystarczy pasja do kardiologii!", answerEn: "Students of all medical and science fields, and graduates up to 3 years after completing their studies. You don\u2019t have to study medicine \u2014 a passion for cardiology is enough!" },
  { questionPl: "Ile kosztuje członkostwo?", questionEn: "How much does membership cost?", answerPl: "Roczna składka członkowska wynosi 50 zł. Zapewnia ona dostęp do wszystkich wydarzeń, warsztatów i materiałów edukacyjnych.", answerEn: "The annual membership fee is 50 PLN. It provides access to all events, workshops, and educational materials." },
  { questionPl: "Jak się zapisać?", questionEn: "How do I sign up?", answerPl: "Wypełnij formularz zgłoszeniowy online (link w sekcji \u201EDołącz do nas\u201D), opłać składkę członkowską (50 zł/rok) i czekaj na potwierdzenie. Cały proces zajmuje kilka minut.", answerEn: "Fill out the online application form (link in the \u2018Join Us\u2019 section), pay the membership fee (50 PLN/year), and wait for confirmation. The whole process takes just a few minutes." },
];

export default function ContentEditor() {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hero, setHero] = useState<any>(DEFAULT_HERO);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [about, setAbout] = useState<any>(DEFAULT_ABOUT);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [join, setJoin] = useState<any>(DEFAULT_JOIN);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [coop, setCoop] = useState<any>(DEFAULT_COOP);
  const [faq, setFaq] = useState<FaqItem[]>(DEFAULT_FAQ);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", [
      "page_hero", "page_about", "page_join", "page_cooperation", "faq",
    ]);
    if (data && data.length > 0) {
      data.forEach((row) => {
        if (row.id === "page_hero") setHero(row.content);
        if (row.id === "page_about") setAbout(row.content);
        if (row.id === "page_join") setJoin(row.content);
        if (row.id === "page_cooperation") setCoop(row.content);
        if (row.id === "faq") setFaq(row.content as FaqItem[]);
      });
    }
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const h = (setter: (v: any) => void, obj: any) => (key: string) => (val: string) => setter({ ...obj, [key]: val });
  const hHero = h(setHero, hero);
  const hAbout = h(setAbout, about);
  const hJoin = h(setJoin, join);
  const hCoop = h(setCoop, coop);

  const saveAll = async () => {
    setSaving(true);
    setMsg("");
    const updates = [
      { id: "page_hero", content: hero },
      { id: "page_about", content: about },
      { id: "page_join", content: join },
      { id: "page_cooperation", content: coop },
      { id: "faq", content: faq },
    ];
    for (const u of updates) {
      const { error } = await supabase.from("site_content").upsert({ id: u.id, content: u.content });
      if (error) { setMsg("Błąd: " + error.message); setSaving(false); return; }
    }
    setMsg("Zapisano!");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateAboutCard = (idx: number, field: string, val: string) => {
    const cards = [...(about.cards || [])];
    cards[idx] = { ...cards[idx], [field]: val };
    setAbout({ ...about, cards });
  };

  const updateFaq = (idx: number, field: string, val: string) => {
    const items = [...faq];
    items[idx] = { ...items[idx], [field]: val };
    setFaq(items);
  };

  return (
    <div style={{ padding: "0 24px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Edytuj treści strony głównej (PL + EN)</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("Błąd") ? "#dc2626" : "#16a34a", fontWeight: 600 }}>{msg}</span>}
          <button onClick={saveAll} disabled={saving} style={s.btn("#16a34a", "#fff")}>
            {saving ? "Zapisywanie..." : "Zapisz wszystko"}
          </button>
        </div>
      </div>

      {/* HERO */}
      <CollapsibleSection title="Sekcja Hero" defaultOpen>
        <PairField label="Tytuł — linia 1" valuePl={hero.title_line1_pl || ""} valueEn={hero.title_line1_en || ""} onChangePl={hHero("title_line1_pl")} onChangeEn={hHero("title_line1_en")} />
        <PairField label="Tytuł — linia 2" valuePl={hero.title_line2_pl || ""} valueEn={hero.title_line2_en || ""} onChangePl={hHero("title_line2_pl")} onChangeEn={hHero("title_line2_en")} />
        <PairField label="Tytuł — linia 3 (accent)" valuePl={hero.title_line3_pl || ""} valueEn={hero.title_line3_en || ""} onChangePl={hHero("title_line3_pl")} onChangeEn={hHero("title_line3_en")} />
        <PairField label="Podtytuł" valuePl={hero.subtitle_pl || ""} valueEn={hero.subtitle_en || ""} onChangePl={hHero("subtitle_pl")} onChangeEn={hHero("subtitle_en")} multiline />
        <PairField label="Przycisk 1" valuePl={hero.btn1_pl || ""} valueEn={hero.btn1_en || ""} onChangePl={hHero("btn1_pl")} onChangeEn={hHero("btn1_en")} />
        <PairField label="Przycisk 2" valuePl={hero.btn2_pl || ""} valueEn={hero.btn2_en || ""} onChangePl={hHero("btn2_pl")} onChangeEn={hHero("btn2_en")} />
        <div style={s.fieldRow}>
          <SingleField label="Statystyka 1 — liczba" value={hero.stat1_number || ""} onChange={hHero("stat1_number")} />
        </div>
        <PairField label="Statystyka 1 — etykieta" valuePl={hero.stat1_pl || ""} valueEn={hero.stat1_en || ""} onChangePl={hHero("stat1_pl")} onChangeEn={hHero("stat1_en")} />
        <div style={s.fieldRow}>
          <SingleField label="Statystyka 2 — liczba" value={hero.stat2_number || ""} onChange={hHero("stat2_number")} />
        </div>
        <PairField label="Statystyka 2 — etykieta" valuePl={hero.stat2_pl || ""} valueEn={hero.stat2_en || ""} onChangePl={hHero("stat2_pl")} onChangeEn={hHero("stat2_en")} />
      </CollapsibleSection>

      {/* ABOUT */}
      <CollapsibleSection title="Sekcja O nas">
        <PairField label="Tag" valuePl={about.tag_pl || ""} valueEn={about.tag_en || ""} onChangePl={hAbout("tag_pl")} onChangeEn={hAbout("tag_en")} />
        <PairField label="Tytuł" valuePl={about.title_pl || ""} valueEn={about.title_en || ""} onChangePl={hAbout("title_pl")} onChangeEn={hAbout("title_en")} />
        <PairField label="Opis" valuePl={about.desc_pl || ""} valueEn={about.desc_en || ""} onChangePl={hAbout("desc_pl")} onChangeEn={hAbout("desc_en")} multiline />
        {(about.cards || []).map((card: Record<string, string>, i: number) => (
          <div key={i} style={{ background: "#f8fafc", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Karta {i + 1}</div>
            <SingleField label="Ikona (emoji)" value={card.icon || ""} onChange={(v) => updateAboutCard(i, "icon", v)} />
            <PairField label="Tytuł karty" valuePl={card.title_pl || ""} valueEn={card.title_en || ""} onChangePl={(v) => updateAboutCard(i, "title_pl", v)} onChangeEn={(v) => updateAboutCard(i, "title_en", v)} />
            <PairField label="Opis karty" valuePl={card.desc_pl || ""} valueEn={card.desc_en || ""} onChangePl={(v) => updateAboutCard(i, "desc_pl", v)} onChangeEn={(v) => updateAboutCard(i, "desc_en", v)} multiline />
          </div>
        ))}
      </CollapsibleSection>

      {/* JOIN */}
      <CollapsibleSection title="Sekcja Dołącz">
        <PairField label="Tag" valuePl={join.tag_pl || ""} valueEn={join.tag_en || ""} onChangePl={hJoin("tag_pl")} onChangeEn={hJoin("tag_en")} />
        <PairField label="Tytuł" valuePl={join.title_pl || ""} valueEn={join.title_en || ""} onChangePl={hJoin("title_pl")} onChangeEn={hJoin("title_en")} />
        <SingleField label="URL formularza zgłoszeniowego" value={join.form_url || ""} onChange={hJoin("form_url")} />
        <PairField label="Krok 1 — tytuł" valuePl={join.step1_title_pl || ""} valueEn={join.step1_title_en || ""} onChangePl={hJoin("step1_title_pl")} onChangeEn={hJoin("step1_title_en")} />
        <PairField label="Krok 1 — opis" valuePl={join.step1_desc_pl || ""} valueEn={join.step1_desc_en || ""} onChangePl={hJoin("step1_desc_pl")} onChangeEn={hJoin("step1_desc_en")} multiline />
        <PairField label="Krok 1 — przycisk" valuePl={join.step1_btn_pl || ""} valueEn={join.step1_btn_en || ""} onChangePl={hJoin("step1_btn_pl")} onChangeEn={hJoin("step1_btn_en")} />
        <PairField label="Krok 2 — tytuł" valuePl={join.step2_title_pl || ""} valueEn={join.step2_title_en || ""} onChangePl={hJoin("step2_title_pl")} onChangeEn={hJoin("step2_title_en")} />
        <PairField label="Krok 2 — opis" valuePl={join.step2_desc_pl || ""} valueEn={join.step2_desc_en || ""} onChangePl={hJoin("step2_desc_pl")} onChangeEn={hJoin("step2_desc_en")} multiline />
        <SingleField label="Numer konta" value={join.account_number || ""} onChange={hJoin("account_number")} />
        <SingleField label="Odbiorca" value={join.recipient || ""} onChange={hJoin("recipient")} />
        <SingleField label="Adres odbiorcy" value={join.recipient_address || ""} onChange={hJoin("recipient_address")} />
        <PairField label="Tytuł przelewu" valuePl={join.fee_title_pl || ""} valueEn={join.fee_title_en || ""} onChangePl={hJoin("fee_title_pl")} onChangeEn={hJoin("fee_title_en")} />
        <PairField label="Krok 3 — tytuł" valuePl={join.step3_title_pl || ""} valueEn={join.step3_title_en || ""} onChangePl={hJoin("step3_title_pl")} onChangeEn={hJoin("step3_title_en")} />
        <PairField label="Krok 3 — opis" valuePl={join.step3_desc_pl || ""} valueEn={join.step3_desc_en || ""} onChangePl={hJoin("step3_desc_pl")} onChangeEn={hJoin("step3_desc_en")} multiline />
        <SingleField label="Email kontaktowy" value={join.contact_email || ""} onChange={hJoin("contact_email")} />
        <PairField label="Tekst informacyjny" valuePl={join.info_pl || ""} valueEn={join.info_en || ""} onChangePl={hJoin("info_pl")} onChangeEn={hJoin("info_en")} multiline />
      </CollapsibleSection>

      {/* COOPERATION */}
      <CollapsibleSection title="Sekcja Współpraca">
        <PairField label="Tytuł" valuePl={coop.title_pl || ""} valueEn={coop.title_en || ""} onChangePl={hCoop("title_pl")} onChangeEn={hCoop("title_en")} />
        <PairField label="Opis" valuePl={coop.desc_pl || ""} valueEn={coop.desc_en || ""} onChangePl={hCoop("desc_pl")} onChangeEn={hCoop("desc_en")} multiline />
        <PairField label="Przycisk" valuePl={coop.btn_pl || ""} valueEn={coop.btn_en || ""} onChangePl={hCoop("btn_pl")} onChangeEn={hCoop("btn_en")} />
        <SingleField label="Email" value={coop.email || ""} onChange={hCoop("email")} />
      </CollapsibleSection>

      {/* FAQ */}
      <CollapsibleSection title="FAQ">
        {faq.map((item, i) => (
          <div key={i} style={{ background: "#f8fafc", borderRadius: 8, padding: 12, marginBottom: 8, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Pytanie {i + 1}</span>
              <button onClick={() => setFaq(faq.filter((_, j) => j !== i))} style={s.btn("#fee2e2", "#dc2626")}>Usuń</button>
            </div>
            <PairField label="Pytanie" valuePl={item.questionPl} valueEn={item.questionEn} onChangePl={(v) => updateFaq(i, "questionPl", v)} onChangeEn={(v) => updateFaq(i, "questionEn", v)} />
            <PairField label="Odpowiedź" valuePl={item.answerPl} valueEn={item.answerEn} onChangePl={(v) => updateFaq(i, "answerPl", v)} onChangeEn={(v) => updateFaq(i, "answerEn", v)} multiline />
          </div>
        ))}
        <button onClick={() => setFaq([...faq, { questionPl: "", questionEn: "", answerPl: "", answerEn: "" }])} style={s.btn("#e0f2fe", "#0369a1")}>
          + Dodaj pytanie
        </button>
      </CollapsibleSection>
    </div>
  );
}
