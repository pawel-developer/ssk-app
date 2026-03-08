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

export default function ContentEditor() {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hero, setHero] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [about, setAbout] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [join, setJoin] = useState<any>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [coop, setCoop] = useState<any>({});
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", [
      "page_hero", "page_about", "page_join", "page_cooperation", "faq",
    ]);
    data?.forEach((row) => {
      if (row.id === "page_hero") setHero(row.content);
      if (row.id === "page_about") setAbout(row.content);
      if (row.id === "page_join") setJoin(row.content);
      if (row.id === "page_cooperation") setCoop(row.content);
      if (row.id === "faq") setFaq(row.content as FaqItem[]);
    });
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
