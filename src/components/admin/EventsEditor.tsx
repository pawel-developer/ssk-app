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
  const [upcoming, setUpcoming] = useState<UpcomingEvent>({});
  const [past, setPast] = useState<PastEvent[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", ["events_upcoming", "events_past"]);
    data?.forEach((row) => {
      if (row.id === "events_upcoming") setUpcoming(row.content as UpcomingEvent);
      if (row.id === "events_past") setPast(row.content as PastEvent[]);
    });
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
