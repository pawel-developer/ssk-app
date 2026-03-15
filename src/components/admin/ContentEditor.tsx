"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";

interface FaqItem {
  questionPl: string;
  questionEn: string;
  answerPl: string;
  answerEn: string;
}

interface EmailTemplateEditor {
  subject: string;
  body: string;
}

interface EmailTemplatesEditor {
  welcome: EmailTemplateEditor;
  payment_confirmed: EmailTemplateEditor;
  payment_rejected: EmailTemplateEditor;
  payment_reminder: EmailTemplateEditor;
  birthday: EmailTemplateEditor;
  event_announcement: EmailTemplateEditor;
  event_meeting_link: EmailTemplateEditor;
}

const s = {
  card: { background: "#fff", borderRadius: 10, padding: 16, boxShadow: "0 4px 24px rgba(0,0,0,.12)", marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: 700 as const, color: "#0f172a", marginBottom: 8, cursor: "pointer", display: "flex" as const, justifyContent: "space-between" as const, alignItems: "center" as const },
  label: { display: "block", fontWeight: 600 as const, fontSize: 12, marginBottom: 3, color: "#475569" },
  input: { width: "100%", padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const },
  textarea: { width: "100%", padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const, minHeight: 48, resize: "vertical" as const },
  btn: (bg: string, color: string) => ({ padding: "4px 10px", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600 as const, cursor: "pointer", background: bg, color }),
};

type TranslateContext = { section?: string; fieldLabel?: string; surroundingText?: string };

async function translateText(
  text: string,
  from: string,
  to: string,
  context?: TranslateContext
): Promise<string> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, from, to, context }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Błąd tłumaczenia");
  return data.translated || "";
}

/** Human-readable field label from key e.g. title_line1_pl -> Title line 1 */
function fieldLabelFromKey(key: string): string {
  const k = key.replace(/_pl$/, "").replace(/_en$/, "");
  return k
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Translate all PL→EN pairs in a record; returns new record with _en keys filled. Uses section context for better translation. */
async function translateSection(
  plEnPairs: { plKey: string; enKey: string }[],
  getPl: (key: string) => string,
  sectionName?: string
): Promise<Record<string, string>> {
  const updates: Record<string, string> = {};
  const allPlValues = plEnPairs.map(({ plKey }) => (getPl(plKey) || "").trim()).filter(Boolean);
  const surroundingSnippet = allPlValues.slice(0, 3).join(" | ");
  for (const { plKey, enKey } of plEnPairs) {
    const text = (getPl(plKey) || "").trim();
    if (!text) continue;
    try {
      const context: TranslateContext = {
        section: sectionName,
        fieldLabel: fieldLabelFromKey(plKey),
        surroundingText: surroundingSnippet.length > 200 ? surroundingSnippet.slice(0, 200) + "…" : surroundingSnippet,
      };
      const translated = await translateText(text, "pl", "en", context);
      updates[enKey] = translated;
    } catch {
      // leave EN unchanged on error
    }
  }
  return updates;
}

function PairField({ label, valuePl, valueEn, onChangePl, onChangeEn, multiline, section, editLang = "pl" }: {
  label: string; valuePl: string; valueEn: string;
  onChangePl: (v: string) => void; onChangeEn: (v: string) => void;
  multiline?: boolean;
  section?: string;
  editLang?: "pl" | "en";
}) {
  const [translating, setTranslating] = useState(false);
  const Input = multiline ? "textarea" : "input";
  const isPl = editLang === "pl";
  const value = isPl ? valuePl : valueEn;
  const onChange = isPl ? onChangePl : onChangeEn;

  const handleTranslate = async () => {
    if (!valuePl.trim()) return;
    setTranslating(true);
    try {
      const context: TranslateContext | undefined = section ? { section, fieldLabel: label } : undefined;
      const translated = await translateText(valuePl, "pl", "en", context);
      onChangeEn(translated);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Nie udało się przetłumaczyć");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
        <label style={s.label}>{label}</label>
        {!isPl && (
          <button data-tip="Tłumacz PL→EN" type="button" onClick={handleTranslate} disabled={translating || !valuePl.trim()} style={{ ...s.btn("#e0f2fe", "#0369a1"), padding: "1px 6px", fontSize: 9 }}>
            {translating ? "..." : "PL→EN"}
          </button>
        )}
      </div>
      <Input style={multiline ? s.textarea : s.input} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function EditLangToggle({ lang, setLang, onTranslateAll, translating }: {
  lang: "pl" | "en"; setLang: (l: "pl" | "en") => void;
  onTranslateAll?: () => void; translating?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Edycja:</span>
      <button data-tip="Wersja PL" type="button" onClick={() => setLang("pl")} style={{ ...s.btn(lang === "pl" ? "#1e293b" : "#e2e8f0", lang === "pl" ? "#fff" : "#475569"), padding: "3px 10px" }}>PL</button>
      <button data-tip="Wersja EN" type="button" onClick={() => setLang("en")} style={{ ...s.btn(lang === "en" ? "#1e293b" : "#e2e8f0", lang === "en" ? "#fff" : "#475569"), padding: "3px 10px" }}>EN</button>
      {lang === "en" && onTranslateAll && (
        <button data-tip="Tłumacz całość" type="button" onClick={onTranslateAll} disabled={translating} style={{ ...s.btn("#0369a1", "#fff"), padding: "3px 10px", fontSize: 11 }}>
          {translating ? "Tłumaczę..." : "Przetłumacz wszystko PL→EN"}
        </button>
      )}
    </div>
  );
}

function SingleField({ label, value, onChange, style: extraStyle }: {
  label: string; value: string; onChange: (v: string) => void; style?: React.CSSProperties;
}) {
  return (
    <div style={{ marginBottom: 8, ...extraStyle }}>
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
      {open && <div style={{ paddingTop: 4 }}>{children}</div>}
    </div>
  );
}

const HERO_PL_EN_KEYS = [
  { plKey: "title_line1_pl", enKey: "title_line1_en" },
  { plKey: "title_line2_pl", enKey: "title_line2_en" },
  { plKey: "title_line3_pl", enKey: "title_line3_en" },
  { plKey: "subtitle_pl", enKey: "subtitle_en" },
  { plKey: "btn1_pl", enKey: "btn1_en" },
  { plKey: "btn2_pl", enKey: "btn2_en" },
  { plKey: "stat1_pl", enKey: "stat1_en" },
  { plKey: "stat2_pl", enKey: "stat2_en" },
];

const ABOUT_PL_EN_KEYS = [
  { plKey: "tag_pl", enKey: "tag_en" },
  { plKey: "title_pl", enKey: "title_en" },
  { plKey: "desc_pl", enKey: "desc_en" },
];

const JOIN_PL_EN_KEYS = [
  { plKey: "tag_pl", enKey: "tag_en" },
  { plKey: "title_pl", enKey: "title_en" },
  { plKey: "step1_title_pl", enKey: "step1_title_en" },
  { plKey: "step1_desc_pl", enKey: "step1_desc_en" },
  { plKey: "step1_btn_pl", enKey: "step1_btn_en" },
  { plKey: "step2_title_pl", enKey: "step2_title_en" },
  { plKey: "step2_desc_pl", enKey: "step2_desc_en" },
  { plKey: "fee_title_pl", enKey: "fee_title_en" },
  { plKey: "step3_title_pl", enKey: "step3_title_en" },
  { plKey: "step3_desc_pl", enKey: "step3_desc_en" },
  { plKey: "info_pl", enKey: "info_en" },
];

const COOP_PL_EN_KEYS = [
  { plKey: "title_pl", enKey: "title_en" },
  { plKey: "desc_pl", enKey: "desc_en" },
  { plKey: "btn_pl", enKey: "btn_en" },
];

function HeroPreview({ hero, lang }: { hero: Record<string, string>; lang: "pl" | "en" }) {
  const suf = lang === "pl" ? "_pl" : "_en";
  const t = (key: string) => hero[key + suf] || hero[key] || "";
  return (
    <div
      className="hero"
      style={{ minHeight: 320, padding: "24px 16px", margin: 0 }}
    >
      <div className="hero-bg" />
      <div className="hero-content" style={{ maxWidth: "100%" }}>
        <h1 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", marginBottom: 12 }}>
          <span>{t("title_line1") || "—"}</span>
          <br />
          <span>{t("title_line2") || "—"}</span>
          <br />
          <span className="text-accent">{t("title_line3") || "—"}</span>
        </h1>
        <p className="hero-subtitle" style={{ fontSize: "0.85rem", marginBottom: 16 }}>
          {t("subtitle") || "—"}
        </p>
        <div className="hero-buttons" style={{ marginBottom: 24 }}>
          <span className="btn btn-primary" style={{ pointerEvents: "none" }}>{t("btn1") || "—"}</span>
          <span className="btn btn-outline" style={{ pointerEvents: "none" }}>{t("btn2") || "—"}</span>
        </div>
        <div className="hero-stats" style={{ paddingTop: 16, gap: 16 }}>
          <div className="stat">
            <span className="stat-number">{hero.stat1_number || "—"}</span>
            <span className="stat-label">{t("stat1") || "—"}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">{hero.stat2_number || "—"}</span>
            <span className="stat-label">{t("stat2") || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPreview({ about, lang }: { about: Record<string, unknown>; lang: "pl" | "en" }) {
  const suf = lang === "pl" ? "_pl" : "_en";
  const t = (key: string) => (about[key + suf] as string) || (about[key] as string) || "";
  const cards = (about.cards || []) as Array<Record<string, string>>;
  return (
    <div className="section about" style={{ padding: "20px 12px", margin: 0 }}>
      <div className="section-header" style={{ marginBottom: 16 }}>
        <span className="section-tag">{t("tag") || "—"}</span>
        <h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>{t("title") || "—"}</h2>
        <p className="section-desc about-mission" style={{ fontSize: "0.8rem" }}>{t("desc") || "—"}</p>
      </div>
      <div className="about-grid" style={{ display: "grid", gap: 10, gridTemplateColumns: `repeat(${Math.min(cards.length, 3)}, 1fr)` }}>
        {cards.map((card: Record<string, string>, i: number) => (
          <div key={i} className="about-card" style={{ padding: 10 }}>
            <div className="about-icon" style={{ fontSize: "1.4rem" }}>{card.icon || "—"}</div>
            <h3 style={{ fontSize: "0.8rem", marginBottom: 4 }}>{lang === "pl" ? (card.title_pl || "—") : (card.title_en || card.title_pl || "—")}</h3>
            <p style={{ fontSize: "0.65rem", lineHeight: 1.4 }}>{lang === "pl" ? (card.desc_pl || "—") : (card.desc_en || card.desc_pl || "—")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function JoinPreview({ join, lang }: { join: Record<string, string>; lang: "pl" | "en" }) {
  const suf = lang === "pl" ? "_pl" : "_en";
  const t = (key: string) => join[key + suf] || join[key] || "";
  return (
    <div className="section join" style={{ padding: "20px 12px", margin: 0 }}>
      <div className="section-header" style={{ marginBottom: 12 }}>
        <span className="section-tag">{t("tag") || "—"}</span>
        <h2 style={{ fontSize: "1.25rem" }}>{t("title") || "—"}</h2>
      </div>
      <div className="join-content">
        <div className="join-steps" style={{ gap: 12 }}>
          <div className="join-step">
            <div className="step-number" style={{ width: 28, height: 28, fontSize: "0.85rem" }}>1</div>
            <div className="step-content">
              <h3 style={{ fontSize: "0.9rem" }}>{t("step1_title") || "—"}</h3>
              <p style={{ fontSize: "0.75rem" }}>{t("step1_desc") || "—"}</p>
              <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>{t("step1_btn") || "—"}</span>
            </div>
          </div>
          <div className="join-step">
            <div className="step-number" style={{ width: 28, height: 28, fontSize: "0.85rem" }}>2</div>
            <div className="step-content">
              <h3 style={{ fontSize: "0.9rem" }}>{t("step2_title") || "—"}</h3>
              <p style={{ fontSize: "0.75rem" }}>{t("step2_desc") || "—"}</p>
              <div style={{ fontSize: "0.7rem", marginTop: 4 }}><code>{join.account_number || "—"}</code></div>
            </div>
          </div>
          <div className="join-step">
            <div className="step-number" style={{ width: 28, height: 28, fontSize: "0.85rem" }}>3</div>
            <div className="step-content">
              <h3 style={{ fontSize: "0.9rem" }}>{t("step3_title") || "—"}</h3>
              <p style={{ fontSize: "0.75rem" }}>{t("step3_desc") || "—"}</p>
            </div>
          </div>
        </div>
        <div className="join-info-box" style={{ marginTop: 12, padding: 8 }}>
          <p style={{ fontSize: "0.75rem" }}>{t("info") || "—"}</p>
        </div>
      </div>
    </div>
  );
}

function CoopPreview({ coop, lang }: { coop: Record<string, string>; lang: "pl" | "en" }) {
  const suf = lang === "pl" ? "_pl" : "_en";
  const t = (key: string) => coop[key + suf] || coop[key] || "";
  return (
    <div className="section cooperation" style={{ padding: "20px 12px", margin: 0 }}>
      <div className="coop-card" style={{ gridTemplateColumns: "1fr", padding: 16 }}>
        <div className="coop-content" style={{ padding: 0 }}>
          <h2 style={{ fontSize: "1.15rem", marginBottom: 8 }}>{t("title") || "—"}</h2>
          <p style={{ fontSize: "0.8rem", marginBottom: 12 }}>{t("desc") || "—"}</p>
          <span className="btn btn-primary" style={{ pointerEvents: "none" }}>{t("btn") || "—"}</span>
        </div>
      </div>
    </div>
  );
}

function FaqPreview({ faq, lang }: { faq: FaqItem[]; lang: "pl" | "en" }) {
  return (
    <div className="section faq" style={{ padding: "20px 12px", margin: 0 }}>
      <div className="section-header" style={{ marginBottom: 12 }}>
        <span className="section-tag">FAQ</span>
        <h2 style={{ fontSize: "1.25rem" }}>{lang === "pl" ? "Najczęściej zadawane pytania" : "Frequently Asked Questions"}</h2>
      </div>
      <div className="faq-list">
        {faq.map((item, i) => (
          <div key={i} className="faq-item" style={{ marginBottom: 6 }}>
            <div className="faq-question" style={{ padding: "8px 12px", fontSize: "0.8rem", cursor: "default" }}>
              {lang === "pl" ? (item.questionPl || "—") : (item.questionEn || item.questionPl || "—")}
            </div>
            <div className="faq-answer" style={{ maxHeight: "none" }}>
              <p style={{ padding: "0 12px 8px", fontSize: "0.75rem" }}>
                {lang === "pl" ? (item.answerPl || "—") : (item.answerEn || item.answerPl || "—")}
              </p>
            </div>
          </div>
        ))}
      </div>
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

const DEFAULT_EMAIL_TEMPLATES: EmailTemplatesEditor = {
  welcome: {
    subject: "Witamy w SSK",
    body: "Cześć {{firstName}},\n\nDziękujemy za rejestrację w Studenckim Stowarzyszeniu Kardiologicznym.\nTwoje konto zostało utworzone i możesz się już zalogować.\n\nPozdrawiamy,\nSSK",
  },
  payment_confirmed: {
    subject: "Składka członkowska została potwierdzona",
    body: "Cześć {{firstName}},\n\nTwoja płatność składki członkowskiej została potwierdzona.\nSkładka jest aktywna do: {{feeValidUntil}}.\n\nDziękujemy,\nSSK",
  },
  payment_rejected: {
    subject: "Weryfikacja płatności wymaga poprawy",
    body: "Cześć {{firstName}},\n\nNie udało się potwierdzić przesłanego potwierdzenia płatności.\n{{reasonLine}}\n\nMożesz przesłać nowe potwierdzenie w panelu członka.\nPozdrawiamy,\nSSK",
  },
  payment_reminder: {
    subject: "Przypomnienie o składce członkowskiej SSK",
    body: "Cześć {{firstName}},\n\nPrzypominamy o opłaceniu składki członkowskiej SSK.\n{{feeValidUntilLine}}\n\nPo opłaceniu składki prześlij potwierdzenie w panelu członka.\n\nPozdrawiamy,\nSSK",
  },
  birthday: {
    subject: "Najlepsze życzenia urodzinowe od SSK",
    body: "Cześć {{firstName}},\n\nW dniu Twoich urodzin życzymy Ci dużo zdrowia, sukcesów i satysfakcji z rozwoju w kardiologii.\n\nWszystkiego najlepszego!\nSSK",
  },
  event_announcement: {
    subject: "Nowe wydarzenie SSK: {{eventTitle}}",
    body: "Cześć {{firstName}},\n\nZapraszamy na wydarzenie: {{eventTitle}}.\n{{eventEmailDescriptionLine}}\n\nLink do Facebooka: {{eventFbUrl}}\n\nDo zobaczenia,\nSSK",
  },
  event_meeting_link: {
    subject: "Link do spotkania: {{eventTitle}}",
    body: "Cześć {{firstName}},\n\nPoniżej znajdziesz link do spotkania dla wydarzenia: {{eventTitle}}.\n\nLink do spotkania: {{eventMeetingLink}}\n\nDo zobaczenia,\nSSK",
  },
};

function mergeEmailTemplates(raw: unknown): EmailTemplatesEditor {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const merged: EmailTemplatesEditor = { ...DEFAULT_EMAIL_TEMPLATES };

  (Object.keys(DEFAULT_EMAIL_TEMPLATES) as Array<keyof EmailTemplatesEditor>).forEach((key) => {
    const value = src[key];
    if (!value || typeof value !== "object") return;
    const template = value as Record<string, unknown>;
    merged[key] = {
      subject:
        typeof template.subject === "string" && template.subject.trim()
          ? template.subject
          : DEFAULT_EMAIL_TEMPLATES[key].subject,
      body:
        typeof template.body === "string" && template.body.trim()
          ? template.body
          : DEFAULT_EMAIL_TEMPLATES[key].body,
    };
  });

  return merged;
}

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
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplatesEditor>(DEFAULT_EMAIL_TEMPLATES);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [heroTranslating, setHeroTranslating] = useState(false);
  const [heroLang, setHeroLang] = useState<"pl" | "en">("pl");
  const [aboutLang, setAboutLang] = useState<"pl" | "en">("pl");
  const [joinLang, setJoinLang] = useState<"pl" | "en">("pl");
  const [coopLang, setCoopLang] = useState<"pl" | "en">("pl");
  const [faqLang, setFaqLang] = useState<"pl" | "en">("pl");
  const [sectionTranslating, setSectionTranslating] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", [
      "page_hero", "page_about", "page_join", "page_cooperation", "faq", "email_templates",
    ]);
    if (data && data.length > 0) {
      data.forEach((row) => {
        if (row.id === "page_hero") setHero(row.content);
        if (row.id === "page_about") setAbout(row.content);
        if (row.id === "page_join") setJoin(row.content);
        if (row.id === "page_cooperation") setCoop(row.content);
        if (row.id === "faq") setFaq(row.content as FaqItem[]);
        if (row.id === "email_templates") setEmailTemplates(mergeEmailTemplates(row.content));
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
      { id: "email_templates", content: emailTemplates },
    ];
    for (const u of updates) {
      const { error } = await supabase.from("site_content").upsert({ id: u.id, content: u.content });
      if (error) { setMsg("Błąd: " + error.message); setSaving(false); return; }
    }
    setMsg("Zapisano!");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

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

  const updateEmailTemplate = (
    key: keyof EmailTemplatesEditor,
    field: keyof EmailTemplateEditor,
    value: string
  ) => {
    setEmailTemplates((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const translateHeroSection = async () => {
    setHeroTranslating(true);
    try {
      const updates = await translateSection(HERO_PL_EN_KEYS, (key) => hero[key] || "", "Hero");
      setHero((prev: Record<string, string>) => ({ ...prev, ...updates }));
      setMsg("Sekcja Hero: przetłumaczono PL→EN");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Błąd: " + (err instanceof Error ? err.message : "Tłumaczenie nie powiodło się"));
      setTimeout(() => setMsg(""), 4000);
    } finally {
      setHeroTranslating(false);
    }
  };

  const translateSectionGeneric = async (
    sectionId: string,
    pairs: { plKey: string; enKey: string }[],
    getPl: (key: string) => string,
    setter: (updates: Record<string, string>) => void
  ) => {
    setSectionTranslating(sectionId);
    try {
      const updates = await translateSection(pairs, getPl, sectionId);
      setter(updates);
      setMsg(`Sekcja ${sectionId}: przetłumaczono PL→EN`);
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Błąd: " + (err instanceof Error ? err.message : "Tłumaczenie nie powiodło się"));
      setTimeout(() => setMsg(""), 4000);
    } finally {
      setSectionTranslating(null);
    }
  };

  const translateAboutSection = async () => {
    setSectionTranslating("O nas");
    try {
      const updates = await translateSection(ABOUT_PL_EN_KEYS, (key) => about[key] || "", "O nas");
      const cards = (about.cards || []) as Array<Record<string, string>>;
      const cardsTranslated = await Promise.all(
        cards.map(async (card, i) => {
          const cardCtx: TranslateContext = { section: "O nas", fieldLabel: `Card ${i + 1} title` };
          const titleEn = card.title_pl?.trim() ? await translateText(card.title_pl, "pl", "en", cardCtx).catch(() => card.title_en) : (card.title_en || "");
          const descCtx: TranslateContext = { section: "O nas", fieldLabel: `Card ${i + 1} description` };
          const descEn = card.desc_pl?.trim() ? await translateText(card.desc_pl, "pl", "en", descCtx).catch(() => card.desc_en) : (card.desc_en || "");
          return { ...card, title_en: titleEn, desc_en: descEn };
        })
      );
      setAbout((prev: Record<string, unknown>) => ({ ...prev, ...updates, cards: cardsTranslated }));
      setMsg("Sekcja O nas: przetłumaczono PL→EN");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Błąd: " + (err instanceof Error ? err.message : "Tłumaczenie nie powiodło się"));
      setTimeout(() => setMsg(""), 4000);
    } finally {
      setSectionTranslating(null);
    }
  };

  const translateFaqSection = async () => {
    setSectionTranslating("faq");
    try {
      const faqContext: TranslateContext = { section: "FAQ" };
      const translated = await Promise.all(
        faq.map(async (item) => {
          const questionEn = item.questionPl?.trim()
            ? await translateText(item.questionPl, "pl", "en", { ...faqContext, fieldLabel: "Question" }).catch(() => item.questionEn)
            : item.questionEn;
          const answerEn = item.answerPl?.trim()
            ? await translateText(item.answerPl, "pl", "en", { ...faqContext, fieldLabel: "Answer" }).catch(() => item.answerEn)
            : item.answerEn;
          return { ...item, questionEn, answerEn };
        })
      );
      setFaq(translated);
      setMsg("FAQ: przetłumaczono PL→EN");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Błąd: " + (err instanceof Error ? err.message : "Tłumaczenie nie powiodło się"));
      setTimeout(() => setMsg(""), 4000);
    } finally {
      setSectionTranslating(null);
    }
  };

  return (
    <div style={{ padding: "0 24px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <p style={{ color: "#94a3b8", fontSize: 13 }}>Edytuj treści strony głównej (PL + EN)</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("Błąd") ? "#dc2626" : "#16a34a", fontWeight: 600 }}>{msg}</span>}
          <button data-tip="Zapisz" onClick={saveAll} disabled={saving} style={s.btn("#16a34a", "#fff")}>
            {saving ? "Zapisywanie..." : "Zapisz wszystko"}
          </button>
        </div>
      </div>

      <CollapsibleSection title="Automatyczne e-maile">
        <p style={{ margin: "0 0 10px", color: "#64748b", fontSize: 12 }}>
          Te treści są używane przez automatyczne e-maile (rejestracja, płatności, przypomnienia, urodziny, wydarzenia). Dostępne placeholdery:
          <code> {"{{firstName}}"}</code>, <code>{"{{feeValidUntil}}"}</code>, <code>{"{{reasonLine}}"}</code>, <code>{"{{feeValidUntilLine}}"}</code>, <code>{"{{eventTitle}}"}</code>, <code>{"{{eventFbUrl}}"}</code>, <code>{"{{eventEmailDescriptionLine}}"}</code>, <code>{"{{eventMeetingLink}}"}</code>.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {([
            { key: "welcome", label: "Powitanie po rejestracji" },
            { key: "payment_confirmed", label: "Potwierdzenie składki" },
            { key: "payment_rejected", label: "Odrzucenie płatności" },
            { key: "payment_reminder", label: "Przypomnienie o składce" },
            { key: "birthday", label: "Życzenia urodzinowe" },
            { key: "event_announcement", label: "Informacja o wydarzeniu" },
            { key: "event_meeting_link", label: "Link do spotkania (wydarzenie)" },
          ] as const).map((item) => (
            <div key={item.key} style={{ background: "#f8fafc", borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 8 }}>{item.label}</div>
              <div style={{ marginBottom: 8 }}>
                <label style={s.label}>Temat</label>
                <input
                  style={s.input}
                  value={emailTemplates[item.key].subject}
                  onChange={(e) => updateEmailTemplate(item.key, "subject", e.target.value)}
                />
              </div>
              <div>
                <label style={s.label}>Treść</label>
                <textarea
                  style={{ ...s.textarea, minHeight: 110 }}
                  value={emailTemplates[item.key].body}
                  onChange={(e) => updateEmailTemplate(item.key, "body", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* HERO */}
      <CollapsibleSection title="Sekcja Hero" defaultOpen>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <EditLangToggle lang={heroLang} setLang={setHeroLang} onTranslateAll={translateHeroSection} translating={heroTranslating} />
            <PairField section="Hero" editLang={heroLang} label="Tytuł — linia 1" valuePl={hero.title_line1_pl || ""} valueEn={hero.title_line1_en || ""} onChangePl={hHero("title_line1_pl")} onChangeEn={hHero("title_line1_en")} />
            <PairField section="Hero" editLang={heroLang} label="Tytuł — linia 2" valuePl={hero.title_line2_pl || ""} valueEn={hero.title_line2_en || ""} onChangePl={hHero("title_line2_pl")} onChangeEn={hHero("title_line2_en")} />
            <PairField section="Hero" editLang={heroLang} label="Tytuł — linia 3 (accent)" valuePl={hero.title_line3_pl || ""} valueEn={hero.title_line3_en || ""} onChangePl={hHero("title_line3_pl")} onChangeEn={hHero("title_line3_en")} />
            <PairField section="Hero" editLang={heroLang} label="Podtytuł" valuePl={hero.subtitle_pl || ""} valueEn={hero.subtitle_en || ""} onChangePl={hHero("subtitle_pl")} onChangeEn={hHero("subtitle_en")} multiline />
            <PairField section="Hero" editLang={heroLang} label="Przycisk 1" valuePl={hero.btn1_pl || ""} valueEn={hero.btn1_en || ""} onChangePl={hHero("btn1_pl")} onChangeEn={hHero("btn1_en")} />
            <PairField section="Hero" editLang={heroLang} label="Przycisk 2" valuePl={hero.btn2_pl || ""} valueEn={hero.btn2_en || ""} onChangePl={hHero("btn2_pl")} onChangeEn={hHero("btn2_en")} />
            <SingleField label="Statystyka 1 — liczba" value={hero.stat1_number || ""} onChange={hHero("stat1_number")} />
            <PairField section="Hero" editLang={heroLang} label="Statystyka 1 — etykieta" valuePl={hero.stat1_pl || ""} valueEn={hero.stat1_en || ""} onChangePl={hHero("stat1_pl")} onChangeEn={hHero("stat1_en")} />
            <SingleField label="Statystyka 2 — liczba" value={hero.stat2_number || ""} onChange={hHero("stat2_number")} />
            <PairField section="Hero" editLang={heroLang} label="Statystyka 2 — etykieta" valuePl={hero.stat2_pl || ""} valueEn={hero.stat2_en || ""} onChangePl={hHero("stat2_pl")} onChangeEn={hHero("stat2_en")} />
          </div>
          <div style={{ flex: 1, minWidth: 0, position: "sticky", top: 16 }}>
            <div style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,.15)" }}>
              <HeroPreview hero={hero} lang={heroLang} />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ABOUT */}
      <CollapsibleSection title="Sekcja O nas">
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <EditLangToggle lang={aboutLang} setLang={setAboutLang} onTranslateAll={translateAboutSection} translating={sectionTranslating === "O nas"} />
            <PairField section="O nas" editLang={aboutLang} label="Tag" valuePl={about.tag_pl || ""} valueEn={about.tag_en || ""} onChangePl={hAbout("tag_pl")} onChangeEn={hAbout("tag_en")} />
            <PairField section="O nas" editLang={aboutLang} label="Tytuł" valuePl={about.title_pl || ""} valueEn={about.title_en || ""} onChangePl={hAbout("title_pl")} onChangeEn={hAbout("title_en")} />
            <PairField section="O nas" editLang={aboutLang} label="Opis" valuePl={about.desc_pl || ""} valueEn={about.desc_en || ""} onChangePl={hAbout("desc_pl")} onChangeEn={hAbout("desc_en")} multiline />
            {(about.cards || []).map((card: Record<string, string>, i: number) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 6, padding: 10, marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Karta {i + 1}</div>
                <SingleField label="Ikona (emoji)" value={card.icon || ""} onChange={(v) => updateAboutCard(i, "icon", v)} />
                <PairField section="O nas" editLang={aboutLang} label="Tytuł karty" valuePl={card.title_pl || ""} valueEn={card.title_en || ""} onChangePl={(v) => updateAboutCard(i, "title_pl", v)} onChangeEn={(v) => updateAboutCard(i, "title_en", v)} />
                <PairField section="O nas" editLang={aboutLang} label="Opis karty" valuePl={card.desc_pl || ""} valueEn={card.desc_en || ""} onChangePl={(v) => updateAboutCard(i, "desc_pl", v)} onChangeEn={(v) => updateAboutCard(i, "desc_en", v)} multiline />
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0, position: "sticky", top: 16 }}>
            <div style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,.1)", background: "var(--gray-50)" }}>
              <AboutPreview about={about} lang={aboutLang} />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* JOIN */}
      <CollapsibleSection title="Sekcja Dołącz">
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <EditLangToggle lang={joinLang} setLang={setJoinLang} onTranslateAll={() => translateSectionGeneric("Dołącz", JOIN_PL_EN_KEYS, (k) => join[k] || "", (updates) => setJoin((prev: Record<string, unknown>) => ({ ...prev, ...updates })))} translating={sectionTranslating === "Dołącz"} />
            <PairField section="Dołącz" editLang={joinLang} label="Tag" valuePl={join.tag_pl || ""} valueEn={join.tag_en || ""} onChangePl={hJoin("tag_pl")} onChangeEn={hJoin("tag_en")} />
            <PairField section="Dołącz" editLang={joinLang} label="Tytuł" valuePl={join.title_pl || ""} valueEn={join.title_en || ""} onChangePl={hJoin("title_pl")} onChangeEn={hJoin("title_en")} />
            <SingleField label="URL formularza zgłoszeniowego" value={join.form_url || ""} onChange={hJoin("form_url")} />
            <PairField section="Dołącz" editLang={joinLang} label="Krok 1 — tytuł" valuePl={join.step1_title_pl || ""} valueEn={join.step1_title_en || ""} onChangePl={hJoin("step1_title_pl")} onChangeEn={hJoin("step1_title_en")} />
            <PairField section="Dołącz" editLang={joinLang} label="Krok 1 — opis" valuePl={join.step1_desc_pl || ""} valueEn={join.step1_desc_en || ""} onChangePl={hJoin("step1_desc_pl")} onChangeEn={hJoin("step1_desc_en")} multiline />
            <PairField section="Dołącz" editLang={joinLang} label="Krok 1 — przycisk" valuePl={join.step1_btn_pl || ""} valueEn={join.step1_btn_en || ""} onChangePl={hJoin("step1_btn_pl")} onChangeEn={hJoin("step1_btn_en")} />
            <PairField section="Dołącz" editLang={joinLang} label="Krok 2 — tytuł" valuePl={join.step2_title_pl || ""} valueEn={join.step2_title_en || ""} onChangePl={hJoin("step2_title_pl")} onChangeEn={hJoin("step2_title_en")} />
            <PairField section="Dołącz" editLang={joinLang} label="Krok 2 — opis" valuePl={join.step2_desc_pl || ""} valueEn={join.step2_desc_en || ""} onChangePl={hJoin("step2_desc_pl")} onChangeEn={hJoin("step2_desc_en")} multiline />
            <SingleField label="Numer konta" value={join.account_number || ""} onChange={hJoin("account_number")} />
            <SingleField label="Odbiorca" value={join.recipient || ""} onChange={hJoin("recipient")} />
            <SingleField label="Adres odbiorcy" value={join.recipient_address || ""} onChange={hJoin("recipient_address")} />
            <PairField section="Dołącz" editLang={joinLang} label="Tytuł przelewu" valuePl={join.fee_title_pl || ""} valueEn={join.fee_title_en || ""} onChangePl={hJoin("fee_title_pl")} onChangeEn={hJoin("fee_title_en")} />
            <PairField section="Dołącz" editLang={joinLang} label="Krok 3 — tytuł" valuePl={join.step3_title_pl || ""} valueEn={join.step3_title_en || ""} onChangePl={hJoin("step3_title_pl")} onChangeEn={hJoin("step3_title_en")} />
            <PairField section="Dołącz" editLang={joinLang} label="Krok 3 — opis" valuePl={join.step3_desc_pl || ""} valueEn={join.step3_desc_en || ""} onChangePl={hJoin("step3_desc_pl")} onChangeEn={hJoin("step3_desc_en")} multiline />
            <SingleField label="Email kontaktowy" value={join.contact_email || ""} onChange={hJoin("contact_email")} />
            <PairField section="Dołącz" editLang={joinLang} label="Tekst informacyjny" valuePl={join.info_pl || ""} valueEn={join.info_en || ""} onChangePl={hJoin("info_pl")} onChangeEn={hJoin("info_en")} multiline />
          </div>
          <div style={{ flex: 1, minWidth: 0, position: "sticky", top: 16 }}>
            <div style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,.1)", background: "#fff" }}>
              <JoinPreview join={join} lang={joinLang} />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* COOPERATION */}
      <CollapsibleSection title="Sekcja Współpraca">
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <EditLangToggle lang={coopLang} setLang={setCoopLang} onTranslateAll={() => translateSectionGeneric("Współpraca", COOP_PL_EN_KEYS, (k) => coop[k] || "", (updates) => setCoop((prev: Record<string, unknown>) => ({ ...prev, ...updates })))} translating={sectionTranslating === "Współpraca"} />
            <PairField section="Współpraca" editLang={coopLang} label="Tytuł" valuePl={coop.title_pl || ""} valueEn={coop.title_en || ""} onChangePl={hCoop("title_pl")} onChangeEn={hCoop("title_en")} />
            <PairField section="Współpraca" editLang={coopLang} label="Opis" valuePl={coop.desc_pl || ""} valueEn={coop.desc_en || ""} onChangePl={hCoop("desc_pl")} onChangeEn={hCoop("desc_en")} multiline />
            <PairField section="Współpraca" editLang={coopLang} label="Przycisk" valuePl={coop.btn_pl || ""} valueEn={coop.btn_en || ""} onChangePl={hCoop("btn_pl")} onChangeEn={hCoop("btn_en")} />
            <SingleField label="Email" value={coop.email || ""} onChange={hCoop("email")} />
          </div>
          <div style={{ flex: 1, minWidth: 0, position: "sticky", top: 16 }}>
            <div style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,.1)", background: "#fff" }}>
              <CoopPreview coop={coop} lang={coopLang} />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* FAQ */}
      <CollapsibleSection title="FAQ">
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <EditLangToggle lang={faqLang} setLang={setFaqLang} onTranslateAll={translateFaqSection} translating={sectionTranslating === "faq"} />
            {faq.map((item, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 6, padding: 10, marginBottom: 6, position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Pytanie {i + 1}</span>
                  <button data-tip="Usuń" onClick={() => setFaq(faq.filter((_, j) => j !== i))} style={s.btn("#fee2e2", "#dc2626")}>Usuń</button>
                </div>
                <PairField section="FAQ" editLang={faqLang} label="Pytanie" valuePl={item.questionPl} valueEn={item.questionEn} onChangePl={(v) => updateFaq(i, "questionPl", v)} onChangeEn={(v) => updateFaq(i, "questionEn", v)} />
                <PairField section="FAQ" editLang={faqLang} label="Odpowiedź" valuePl={item.answerPl} valueEn={item.answerEn} onChangePl={(v) => updateFaq(i, "answerPl", v)} onChangeEn={(v) => updateFaq(i, "answerEn", v)} multiline />
              </div>
            ))}
            <button data-tip="Nowe pytanie" onClick={() => setFaq([...faq, { questionPl: "", questionEn: "", answerPl: "", answerEn: "" }])} style={s.btn("#e0f2fe", "#0369a1")}>
              + Dodaj pytanie
            </button>
          </div>
          <div style={{ flex: 1, minWidth: 0, position: "sticky", top: 16 }}>
            <div style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,.1)", background: "#fff" }}>
              <FaqPreview faq={faq} lang={faqLang} />
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
