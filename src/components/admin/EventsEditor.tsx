"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";

interface PastEvent {
  href: string;
  img: string;
  alt: string;
  date: string;
  titlePl: string;
  titleEn: string;
  metaPl: string;
  metaEn: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpcomingEvent = Record<string, any>;

const EMPTY_PAST: PastEvent = { href: "", img: "", alt: "", date: "", titlePl: "", titleEn: "", metaPl: "", metaEn: "" };

const DEFAULT_UPCOMING: UpcomingEvent = {
  img: "/img/event1_wiosenna2-cover.webp",
  title: "Wiosenna Szkoła Kardiologiczna \u2014 II Edycja",
  date_pl: "8 marca 2026 \u00B7 8:30 \u00B7 Centrum Symulacji WUM, Warszawa",
  date_en: "March 8, 2026 \u00B7 8:30 AM \u00B7 WUM Simulation Center, Warsaw",
  desc_pl: "Całodniowe warsztaty umiejętności praktycznych. II edycja we współpracy ze SKN przy I Katedrze i Klinice Kardiologii WUM.",
  desc_en: "Full-day hands-on skills workshops. 2nd edition in collaboration with the Student Scientific Circle at the 1st Department of Cardiology, WUM.",
  badge_pl: "\uD83D\uDCC5 Nadchodzące", badge_en: "\uD83D\uDCC5 Upcoming",
  link: "https://www.facebook.com/events/3237057496601991/",
  btn_pl: "Zobacz na Facebooku", btn_en: "View on Facebook",
};

const DEFAULT_PAST: PastEvent[] = [
  { href: "https://www.facebook.com/events/1600367001002973/", img: "/img/event2_lipidy-cover.webp", alt: "Zaburzenia lipidowe 2026", date: "23.02.2026", titlePl: "Wytyczne diagnostyki zaburzeń lipidowych 2026", titleEn: "Lipid Disorder Diagnostic Guidelines 2026", metaPl: "Online \u00B7 Prof. Maciej Banach", metaEn: "Online \u00B7 Prof. Maciej Banach" },
  { href: "https://www.facebook.com/events/1180004167648593/", img: "/img/event3_zastawka-cover.webp", alt: "Zastawka aortalna", date: "27.01.2026", titlePl: "Zastawka aortalna \u2014 diagnostyka i leczenie zabiegowe", titleEn: "Aortic Valve \u2014 Diagnostics & Interventional Treatment", metaPl: "Online", metaEn: "Online" },
  { href: "https://www.facebook.com/events/1776803796342665", img: "/img/event-1776803796342665.webp", alt: "Warsztaty Kardiologii Interwencyjnej", date: "24.01.2026", titlePl: "Warsztaty Kardiologii Interwencyjnej", titleEn: "Interventional Cardiology Workshops", metaPl: "Gdańsk \u00B7 SKN Hemodynamiki GUMed", metaEn: "Gdańsk \u00B7 SKN Hemodynamiki GUMed" },
  { href: "https://www.facebook.com/events/2385544128564083", img: "/img/event-2385544128564083.webp", alt: "Amyloidoza serca", date: "08.12.2025", titlePl: "Amyloidoza serca \u2014 cichy kameleon w kardiologii", titleEn: "Cardiac Amyloidosis \u2014 The Silent Chameleon", metaPl: "Online \u00B7 Prof. Alicja Dąbrowska-Kugacka", metaEn: "Online \u00B7 Prof. Alicja Dąbrowska-Kugacka" },
  { href: "https://www.facebook.com/events/1842680213344407/", img: "/img/event4_warsztaty-cover.webp", alt: "Pacjent-lek-zesp\u00F3ł", date: "11.10.2025", titlePl: "Pacjent \u2014 lek \u2014 zesp\u00F3ł: wyzwania opieki kardiologicznej", titleEn: "Patient \u2014 Drug \u2014 Team: Cardiology Care Challenges", metaPl: "Warszawa \u00B7 Warsztaty stacjonarne", metaEn: "Warsaw \u00B7 In-person workshops" },
  { href: "https://www.facebook.com/events/2129639964128688", img: "/img/event-2129639964128688.webp", alt: "II Edycja Kardiologicznej Szkoły Letniej", date: "08\u201312.08.2025", titlePl: "II Edycja Kardiologicznej Szkoły Letniej", titleEn: "2nd Cardiology Summer School", metaPl: "Gdańsk \u00B7 SKN Hemodynamiki GUMed", metaEn: "Gdańsk \u00B7 SKN Hemodynamiki GUMed" },
  { href: "https://www.facebook.com/events/1607813013172743", img: "/img/event-1607813013172743.webp", alt: "Wiosenna Szkoła Kardiologiczna I", date: "16.03.2025", titlePl: "Wiosenna Szkoła Kardiologiczna \u2014 I Edycja", titleEn: "Spring Cardiology School \u2014 1st Edition", metaPl: "Warszawa \u00B7 Centrum Symulacji WUM", metaEn: "Warsaw \u00B7 WUM Simulation Center" },
];

const s = {
  card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)", marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 700 as const, color: "#0f172a", marginBottom: 16 },
  fieldRow: { display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" as const },
  fieldCol: { flex: 1, minWidth: 240 },
  label: { display: "block", fontWeight: 600 as const, fontSize: 13, marginBottom: 4, color: "#475569" },
  input: { width: "100%", padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const },
  textarea: { width: "100%", padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const, minHeight: 60, resize: "vertical" as const },
  btn: (bg: string, color: string) => ({ padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600 as const, cursor: "pointer", background: bg, color }),
};

function Field({ label, value, onChange, multiline }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={s.label}>{label}</label>
      <Tag style={multiline ? s.textarea : s.input} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function PairField({ label, valuePl, valueEn, onChangePl, onChangeEn, multiline }: {
  label: string; valuePl: string; valueEn: string;
  onChangePl: (v: string) => void; onChangeEn: (v: string) => void; multiline?: boolean;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div style={s.fieldRow}>
      <div style={s.fieldCol}>
        <label style={s.label}>{label} (PL)</label>
        <Tag style={multiline ? s.textarea : s.input} value={valuePl} onChange={(e) => onChangePl(e.target.value)} />
      </div>
      <div style={s.fieldCol}>
        <label style={s.label}>{label} (EN)</label>
        <Tag style={multiline ? s.textarea : s.input} value={valueEn} onChange={(e) => onChangeEn(e.target.value)} />
      </div>
    </div>
  );
}

export default function EventsEditor() {
  const supabase = createClient();
  const [upcoming, setUpcoming] = useState<UpcomingEvent>(DEFAULT_UPCOMING);
  const [past, setPast] = useState<PastEvent[]>(DEFAULT_PAST);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", ["events_upcoming", "events_past"]);
    if (data && data.length > 0) {
      data.forEach((row) => {
        if (row.id === "events_upcoming") setUpcoming(row.content as UpcomingEvent);
        if (row.id === "events_past") {
          const arr = row.content as PastEvent[];
          if (arr.length > 0) setPast(arr);
        }
      });
    }
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const u = (key: string) => (val: string) => setUpcoming({ ...upcoming, [key]: val });

  const updatePast = (idx: number, field: string, val: string) => {
    const arr = [...past];
    arr[idx] = { ...arr[idx], [field]: val };
    setPast(arr);
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    for (const item of [
      { id: "events_upcoming", content: upcoming },
      { id: "events_past", content: past },
    ]) {
      const { error } = await supabase.from("site_content").upsert({ id: item.id, content: item.content });
      if (error) { setMsg("Błąd: " + error.message); setSaving(false); return; }
    }
    setMsg("Zapisano!");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div style={{ padding: "0 24px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Zarządzaj wydarzeniami na stronie głównej</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("Błąd") ? "#dc2626" : "#16a34a", fontWeight: 600 }}>{msg}</span>}
          <button onClick={save} disabled={saving} style={s.btn("#16a34a", "#fff")}>
            {saving ? "Zapisywanie..." : "Zapisz wszystko"}
          </button>
        </div>
      </div>

      {/* Upcoming */}
      <div style={s.card}>
        <h3 style={s.title}>Nadchodzące wydarzenie</h3>
        <Field label="Tytuł" value={upcoming.title || ""} onChange={u("title")} />
        <PairField label="Data i miejsce" valuePl={upcoming.date_pl || ""} valueEn={upcoming.date_en || ""} onChangePl={u("date_pl")} onChangeEn={u("date_en")} />
        <PairField label="Opis" valuePl={upcoming.desc_pl || ""} valueEn={upcoming.desc_en || ""} onChangePl={u("desc_pl")} onChangeEn={u("desc_en")} multiline />
        <PairField label="Etykieta badge" valuePl={upcoming.badge_pl || ""} valueEn={upcoming.badge_en || ""} onChangePl={u("badge_pl")} onChangeEn={u("badge_en")} />
        <Field label="Ścieżka obrazu" value={upcoming.img || ""} onChange={u("img")} />
        <Field label="Link (Facebook)" value={upcoming.link || ""} onChange={u("link")} />
        <PairField label="Tekst przycisku" valuePl={upcoming.btn_pl || ""} valueEn={upcoming.btn_en || ""} onChangePl={u("btn_pl")} onChangeEn={u("btn_en")} />
      </div>

      {/* Past events */}
      <div style={s.card}>
        <h3 style={s.title}>Poprzednie wydarzenia</h3>
        {past.map((ev, i) => (
          <div key={i} style={{ background: "#f8fafc", borderRadius: 8, padding: 12, marginBottom: 12, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Wydarzenie {i + 1}</span>
              <div style={{ display: "flex", gap: 4 }}>
                {i > 0 && <button onClick={() => { const a = [...past]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; setPast(a); }} style={s.btn("#e2e8f0", "#475569")}>↑</button>}
                {i < past.length - 1 && <button onClick={() => { const a = [...past]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; setPast(a); }} style={s.btn("#e2e8f0", "#475569")}>↓</button>}
                <button onClick={() => setPast(past.filter((_, j) => j !== i))} style={s.btn("#fee2e2", "#dc2626")}>Usuń</button>
              </div>
            </div>
            <div style={s.fieldRow}>
              <div style={s.fieldCol}><Field label="Data" value={ev.date} onChange={(v) => updatePast(i, "date", v)} /></div>
              <div style={s.fieldCol}><Field label="Alt tekst" value={ev.alt} onChange={(v) => updatePast(i, "alt", v)} /></div>
            </div>
            <PairField label="Tytuł" valuePl={ev.titlePl} valueEn={ev.titleEn} onChangePl={(v) => updatePast(i, "titlePl", v)} onChangeEn={(v) => updatePast(i, "titleEn", v)} />
            <PairField label="Meta (miejsce, prowadzący)" valuePl={ev.metaPl} valueEn={ev.metaEn} onChangePl={(v) => updatePast(i, "metaPl", v)} onChangeEn={(v) => updatePast(i, "metaEn", v)} />
            <Field label="Link (Facebook)" value={ev.href} onChange={(v) => updatePast(i, "href", v)} />
            <Field label="Ścieżka obrazu" value={ev.img} onChange={(v) => updatePast(i, "img", v)} />
          </div>
        ))}
        <button onClick={() => setPast([...past, { ...EMPTY_PAST }])} style={s.btn("#e0f2fe", "#0369a1")}>
          + Dodaj wydarzenie
        </button>
      </div>
    </div>
  );
}
