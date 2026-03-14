"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import ImageUploadWithResize from "./ImageUploadWithResize";

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
type MailType = "announcement" | "meeting_link";
type PreviewModalState = {
  title: string;
  subject: string;
  body: string;
} | null;

const DEFAULT_UPCOMING: UpcomingEvent = {
  img: "/img/event1_wiosenna2-cover.webp",
  title: "Wiosenna Szko\u0142a Kardiologiczna \u2014 II Edycja",
  date_pl: "8 marca 2026 \u00B7 8:30 \u00B7 Centrum Symulacji WUM, Warszawa",
  date_en: "March 8, 2026 \u00B7 8:30 AM \u00B7 WUM Simulation Center, Warsaw",
  desc_pl: "Ca\u0142odniowe warsztaty umiej\u0119tno\u015Bci praktycznych. II edycja we wsp\u00F3\u0142pracy ze SKN przy I Katedrze i Klinice Kardiologii WUM.",
  desc_en: "Full-day hands-on skills workshops. 2nd edition in collaboration with the Student Scientific Circle at the 1st Department of Cardiology, WUM.",
  badge_pl: "\uD83D\uDCC5 Nadchodz\u0105ce", badge_en: "\uD83D\uDCC5 Upcoming",
  link: "https://www.facebook.com/events/3237057496601991/",
  btn_pl: "Zobacz na Facebooku", btn_en: "View on Facebook",
  email_desc_pl: "",
  meeting_link_email: "",
};

const DEFAULT_PAST: PastEvent[] = [
  { href: "https://www.facebook.com/events/1600367001002973/", img: "/img/event2_lipidy-cover.webp", alt: "Zaburzenia lipidowe 2026", date: "23.02.2026", titlePl: "Wytyczne diagnostyki zaburze\u0144 lipidowych 2026", titleEn: "Lipid Disorder Diagnostic Guidelines 2026", metaPl: "Online \u00B7 Prof. Maciej Banach", metaEn: "Online \u00B7 Prof. Maciej Banach" },
  { href: "https://www.facebook.com/events/1180004167648593/", img: "/img/event3_zastawka-cover.webp", alt: "Zastawka aortalna", date: "27.01.2026", titlePl: "Zastawka aortalna \u2014 diagnostyka i leczenie zabiegowe", titleEn: "Aortic Valve \u2014 Diagnostics & Interventional Treatment", metaPl: "Online", metaEn: "Online" },
  { href: "https://www.facebook.com/events/1776803796342665", img: "/img/event-1776803796342665.webp", alt: "Warsztaty Kardiologii Interwencyjnej", date: "24.01.2026", titlePl: "Warsztaty Kardiologii Interwencyjnej", titleEn: "Interventional Cardiology Workshops", metaPl: "Gda\u0144sk \u00B7 SKN Hemodynamiki GUMed", metaEn: "Gda\u0144sk \u00B7 SKN Hemodynamiki GUMed" },
  { href: "https://www.facebook.com/events/2385544128564083", img: "/img/event-2385544128564083.webp", alt: "Amyloidoza serca", date: "08.12.2025", titlePl: "Amyloidoza serca \u2014 cichy kameleon w kardiologii", titleEn: "Cardiac Amyloidosis \u2014 The Silent Chameleon", metaPl: "Online \u00B7 Prof. Alicja D\u0105browska-Kugacka", metaEn: "Online \u00B7 Prof. Alicja D\u0105browska-Kugacka" },
  { href: "https://www.facebook.com/events/1842680213344407/", img: "/img/event4_warsztaty-cover.webp", alt: "Pacjent-lek-zesp\u00F3\u0142", date: "11.10.2025", titlePl: "Pacjent \u2014 lek \u2014 zesp\u00F3\u0142: wyzwania opieki kardiologicznej", titleEn: "Patient \u2014 Drug \u2014 Team: Cardiology Care Challenges", metaPl: "Warszawa \u00B7 Warsztaty stacjonarne", metaEn: "Warsaw \u00B7 In-person workshops" },
  { href: "https://www.facebook.com/events/2129639964128688", img: "/img/event-2129639964128688.webp", alt: "II Edycja Kardiologicznej Szko\u0142y Letniej", date: "08\u201312.08.2025", titlePl: "II Edycja Kardiologicznej Szko\u0142y Letniej", titleEn: "2nd Cardiology Summer School", metaPl: "Gda\u0144sk \u00B7 SKN Hemodynamiki GUMed", metaEn: "Gda\u0144sk \u00B7 SKN Hemodynamiki GUMed" },
  { href: "https://www.facebook.com/events/1607813013172743", img: "/img/event-1607813013172743.webp", alt: "Wiosenna Szko\u0142a Kardiologiczna I", date: "16.03.2025", titlePl: "Wiosenna Szko\u0142a Kardiologiczna \u2014 I Edycja", titleEn: "Spring Cardiology School \u2014 1st Edition", metaPl: "Warszawa \u00B7 Centrum Symulacji WUM", metaEn: "Warsaw \u00B7 WUM Simulation Center" },
];

const s = {
  card: { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06)", marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 700 as const, color: "#0f172a", marginBottom: 12 },
  label: { display: "block" as const, fontWeight: 600 as const, fontSize: 12, marginBottom: 3, color: "#475569" },
  input: { width: "100%", padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const },
  btn: (bg: string, color: string) => ({ padding: "4px 10px", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600 as const, cursor: "pointer", background: bg, color }),
  row: { display: "flex" as const, gap: 8, marginBottom: 8 },
  col: { flex: 1, minWidth: 0 },
  eventsGrid: { display: "grid" as const, gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 },
  eventCard: { background: "#f8fafc", borderRadius: 8, padding: 12, minWidth: 0 },
};

async function fetchOG(url: string): Promise<{ title?: string; image?: string; date?: string } | null> {
  try {
    const res = await fetch("/api/fetch-og", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function FbField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={s.label}>{label}</label>
      <input style={s.input} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function FbTextAreaField({ label, value, onChange, placeholder, minHeight = 88 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; minHeight?: number;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={s.label}>{label}</label>
      <textarea
        style={{
          ...s.input,
          minHeight,
          resize: "vertical",
          lineHeight: 1.45,
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function buildAutoEmailDescription(event: UpcomingEvent): string {
  const shortDesc = String(event.desc_pl || "").trim();
  if (shortDesc) {
    const normalized = shortDesc.replace(/\s+/g, " ").trim();
    if (normalized.length <= 220) return normalized;
    return `${normalized.slice(0, 217).trimEnd()}...`;
  }

  const title = String(event.title || "").trim();
  if (title) {
    return `Krótka informacja o spotkaniu dotyczącym: ${title}.`;
  }

  return "Krótka informacja o nadchodzącym spotkaniu SSK.";
}

function withEmailOnlyFields(event: UpcomingEvent): UpcomingEvent {
  return {
    ...event,
    email_desc_pl: typeof event.email_desc_pl === "string" ? event.email_desc_pl : "",
    meeting_link_email: typeof event.meeting_link_email === "string" ? event.meeting_link_email : "",
  };
}

export default function EventsEditor() {
  const supabase = createClient();
  const [upcomingList, setUpcomingList] = useState<UpcomingEvent[]>([DEFAULT_UPCOMING]);
  const [past, setPast] = useState<PastEvent[]>(DEFAULT_PAST);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [fetchingUpcomingIdx, setFetchingUpcomingIdx] = useState<number | null>(null);
  const [fetchingIdx, setFetchingIdx] = useState<number | null>(null);
  const [sendingKey, setSendingKey] = useState<string | null>(null);
  const [previewingKey, setPreviewingKey] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<PreviewModalState>(null);
  const [sendStatus, setSendStatus] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [expandedEmailSections, setExpandedEmailSections] = useState<Record<number, boolean>>({});

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", ["events_upcoming", "events_past"]);
    if (data && data.length > 0) {
      data.forEach((row) => {
        if (row.id === "events_upcoming") {
          const raw = row.content;
          if (Array.isArray(raw)) {
            if (raw.length > 0) {
              setUpcomingList((raw as UpcomingEvent[]).map((event) => withEmailOnlyFields(event)));
            }
          } else if (raw && typeof raw === "object") {
            setUpcomingList([withEmailOnlyFields(raw as UpcomingEvent)]);
          }
        }
        if (row.id === "events_past") {
          const arr = row.content as PastEvent[];
          if (arr.length > 0) setPast(arr);
        }
      });
    }
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    setMsg("");
    for (const item of [
      { id: "events_upcoming", content: upcomingList },
      { id: "events_past", content: past },
    ]) {
      const { error } = await supabase.from("site_content").upsert({ id: item.id, content: item.content });
      if (error) { setMsg("Błąd: " + error.message); setSaving(false); return; }
    }
    setMsg("Zapisano!");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const updateUpcoming = (idx: number, updates: Partial<UpcomingEvent>) => {
    setUpcomingList((prev) => prev.map((ev, i) => i === idx ? { ...ev, ...updates } : ev));
  };

  const addUpcoming = () => {
    setUpcomingList((prev) => [...prev, {
      img: "", title: "", date_pl: "", date_en: "", desc_pl: "", desc_en: "",
      badge_pl: "📅 Nadchodzące", badge_en: "📅 Upcoming",
      link: "", btn_pl: "Zobacz na Facebooku", btn_en: "View on Facebook",
      email_desc_pl: "", meeting_link_email: "",
    }]);
  };

  const removeUpcoming = (idx: number) => {
    if (upcomingList.length <= 1) return;
    setUpcomingList((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveUpcomingToPast = (idx: number) => {
    const ev = upcomingList[idx];
    const pastEvent: PastEvent = {
      href: ev.link || "",
      img: ev.img || "",
      alt: ev.title || "",
      date: ev.date_pl?.split("·")[0]?.trim() || "",
      titlePl: ev.title || "",
      titleEn: ev.title || "",
      metaPl: ev.desc_pl || ev.date_pl || "",
      metaEn: ev.desc_en || ev.date_en || "",
    };
    setPast((prev) => [pastEvent, ...prev]);
    if (upcomingList.length > 1) {
      setUpcomingList((prev) => prev.filter((_, i) => i !== idx));
    } else {
      setUpcomingList([{
        img: "", title: "", date_pl: "", date_en: "", desc_pl: "", desc_en: "",
        badge_pl: "📅 Nadchodzące", badge_en: "📅 Upcoming",
        link: "", btn_pl: "Zobacz na Facebooku", btn_en: "View on Facebook",
        email_desc_pl: "", meeting_link_email: "",
      }]);
    }
  };

  const movePastToUpcoming = (idx: number) => {
    const ev = past[idx];
    const upcomingEvent: UpcomingEvent = {
      link: ev.href || "",
      img: ev.img || "",
      title: ev.titlePl || "",
      date_pl: ev.date ? `${ev.date} · ${ev.metaPl || ""}`.trim() : (ev.metaPl || ""),
      date_en: ev.date ? `${ev.date} · ${ev.metaEn || ""}`.trim() : (ev.metaEn || ""),
      desc_pl: ev.metaPl || "",
      desc_en: ev.metaEn || "",
      badge_pl: "📅 Nadchodzące", badge_en: "📅 Upcoming",
      btn_pl: "Zobacz na Facebooku", btn_en: "View on Facebook",
      email_desc_pl: "",
      meeting_link_email: "",
    };
    setUpcomingList((prev) => [...prev, upcomingEvent]);
    setPast((prev) => prev.filter((_, i) => i !== idx));
  };

  const sendToActiveMembers = async (idx: number, mailType: MailType) => {
    const ev = upcomingList[idx];
    if (!ev?.title) {
      setMsg("Uzupełnij tytuł wydarzenia przed wysyłką.");
      setTimeout(() => setMsg(""), 3500);
      return;
    }
    if (mailType === "announcement" && !ev.link) {
      setMsg("Uzupełnij link do Facebooka przed wysyłką announcement.");
      setTimeout(() => setMsg(""), 3500);
      return;
    }
    if (mailType === "meeting_link" && !ev.meeting_link_email) {
      setMsg("Uzupełnij pole 'Link spotkania (tylko email)' przed wysyłką.");
      setTimeout(() => setMsg(""), 3500);
      return;
    }

    const confirmed = confirm(
      mailType === "announcement"
        ? "Wysłać announcement o wydarzeniu do wszystkich aktywnych członków?"
        : "Wysłać link do spotkania do wszystkich aktywnych członków?"
    );
    if (!confirmed) return;

    const key = `${idx}:${mailType}`;
    setSendingKey(key);
    setSendStatus((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    try {
      const res = await fetch("/api/events/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mailType,
          event: {
            title: String(ev.title || ""),
            date_pl: String(ev.date_pl || ""),
            link: String(ev.link || ""),
            email_desc_pl: String(ev.email_desc_pl || ""),
            meeting_link_email: String(ev.meeting_link_email || ""),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.error || "Nie udało się wysłać e-maili.";
        setSendStatus((prev) => ({ ...prev, [key]: { ok: false, text: message } }));
        return;
      }
      const summary = `Wysłano: ${data.sent} · Błędy: ${data.failed} · Bez e-maila: ${data.skippedNoEmail} · Aktywni: ${data.activeTotal}`;
      setSendStatus((prev) => ({ ...prev, [key]: { ok: true, text: summary } }));
    } catch (err) {
      setSendStatus((prev) => ({
        ...prev,
        [key]: {
          ok: false,
          text: err instanceof Error ? err.message : "Nieznany błąd wysyłki.",
        },
      }));
    } finally {
      setSendingKey(null);
    }
  };

  const openEmailPreview = async (idx: number, mailType: MailType) => {
    const ev = upcomingList[idx];
    if (!ev?.title) {
      setMsg("Uzupełnij tytuł wydarzenia, aby zobaczyć podgląd.");
      setTimeout(() => setMsg(""), 3500);
      return;
    }

    const key = `${idx}:${mailType}`;
    setPreviewingKey(key);

    try {
      const res = await fetch("/api/events/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mailType,
          event: {
            title: String(ev.title || ""),
            link: String(ev.link || ""),
            email_desc_pl: String(ev.email_desc_pl || ""),
            meeting_link_email: String(ev.meeting_link_email || ""),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.error || "Nie udało się pobrać podglądu e-maila.");
        setTimeout(() => setMsg(""), 3500);
        return;
      }
      setPreviewModal({
        title: mailType === "announcement" ? "Podgląd: announcement email" : "Podgląd: link email",
        subject: String(data.subject || ""),
        body: String(data.body || ""),
      });
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Nieznany błąd podglądu.");
      setTimeout(() => setMsg(""), 3500);
    } finally {
      setPreviewingKey(null);
    }
  };

  const fetchUpcomingOG = async (idx: number) => {
    const ev = upcomingList[idx];
    if (!ev.link) return;
    setFetchingUpcomingIdx(idx);
    const og = await fetchOG(ev.link);
    if (og) {
      updateUpcoming(idx, {
        title: og.title || ev.title,
        img: og.image || ev.img,
        date_pl: og.date || ev.date_pl,
      });
    } else {
      setMsg("Nie udało się pobrać danych z Facebooka");
      setTimeout(() => setMsg(""), 3000);
    }
    setFetchingUpcomingIdx(null);
  };

  const fetchPastOG = async (idx: number) => {
    const ev = past[idx];
    if (!ev.href) return;
    setFetchingIdx(idx);
    const og = await fetchOG(ev.href);
    if (og) {
      const arr = [...past];
      arr[idx] = {
        ...arr[idx],
        titlePl: og.title || arr[idx].titlePl,
        titleEn: og.title || arr[idx].titleEn,
        alt: og.title || arr[idx].alt,
        img: og.image || arr[idx].img,
        date: og.date || arr[idx].date,
      };
      setPast(arr);
    } else {
      setMsg("Nie uda\u0142o si\u0119 pobra\u0107 danych z Facebooka");
      setTimeout(() => setMsg(""), 3000);
    }
    setFetchingIdx(null);
  };

  const addPastFromLink = async () => {
    const link = prompt("Wklej link do wydarzenia na Facebooku:");
    if (!link) return;

    const newEvent: PastEvent = {
      href: link, img: "", alt: "", date: "",
      titlePl: "", titleEn: "", metaPl: "", metaEn: "",
    };
    setPast([newEvent, ...past]);

    setFetchingIdx(0);
    const og = await fetchOG(link);
    if (og) {
      setPast((prev) => {
        const arr = [...prev];
        arr[0] = {
          ...arr[0],
          titlePl: og.title || "",
          titleEn: og.title || "",
          alt: og.title || "",
          img: og.image || "",
          date: og.date || "",
        };
        return arr;
      });
    }
    setFetchingIdx(null);
  };

  const updatePast = (idx: number, field: string, val: string) => {
    const arr = [...past];
    arr[idx] = { ...arr[idx], [field]: val };
    if (field === "titlePl") arr[idx].titleEn = val;
    if (field === "titlePl") arr[idx].alt = val;
    setPast(arr);
  };

  return (
    <div style={{ padding: "0 24px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Zarządzaj wydarzeniami na stronie głównej</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("B") ? "#dc2626" : "#16a34a", fontWeight: 600 }}>{msg}</span>}
          <button onClick={save} disabled={saving} style={s.btn("#16a34a", "#fff")} data-tip="Zapisz">
            {saving ? "Zapisywanie..." : "Zapisz wszystko"}
          </button>
        </div>
      </div>

      {/* Upcoming */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ ...s.title, marginBottom: 0 }}>Nadchodzące wydarzenia ({upcomingList.length})</h3>
          <button onClick={addUpcoming} style={s.btn("#16a34a", "#fff")} data-tip="Nowe wydarzenie">+ Dodaj nadchodzące</button>
        </div>

        <div style={s.eventsGrid}>
        {upcomingList.map((ev, idx) => (
          <div key={idx} style={s.eventCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", flex: 1, minWidth: 0 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{ev.title || `Wydarzenie ${idx + 1}`}</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => moveUpcomingToPast(idx)} style={s.btn("#f59e0b", "#fff")} data-tip="Do poprzednich">
                  → Poprzednie
                </button>
                {upcomingList.length > 1 && (
                  <button onClick={() => removeUpcoming(idx)} style={s.btn("#fee2e2", "#dc2626")} data-tip="Usuń">Usuń</button>
                )}
              </div>
            </div>
            <FbField label="Link (Facebook)" value={ev.link || ""} onChange={(v) => updateUpcoming(idx, { link: v })} placeholder="https://www.facebook.com/events/..." />
            <div style={{ marginBottom: 8 }}>
              <button onClick={() => fetchUpcomingOG(idx)} disabled={fetchingUpcomingIdx === idx || !ev.link} style={s.btn("#1877F2", "#fff")} data-tip="Pobierz z FB">
                {fetchingUpcomingIdx === idx ? "Pobieranie..." : "Pobierz dane z Facebooka"}
              </button>
            </div>
            <FbField label="Tytuł" value={ev.title || ""} onChange={(v) => updateUpcoming(idx, { title: v })} />
            <FbField label="Data i miejsce" value={ev.date_pl || ""} onChange={(v) => updateUpcoming(idx, { date_pl: v, date_en: v })} placeholder="8 marca 2026 · Warszawa" />
            <FbTextAreaField
              label="Krótki opis"
              value={ev.desc_pl || ""}
              onChange={(v) => updateUpcoming(idx, { desc_pl: v, desc_en: v })}
              placeholder="Wpisz opis wydarzenia (może być dłuższy)."
            />
            <ImageUploadWithResize
              label="Obraz"
              value={ev.img || ""}
              onChange={(v) => updateUpcoming(idx, { img: v })}
              suggestedName={ev.title ? `event-${ev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40)}` : undefined}
              outputWidth={800}
              outputHeight={450}
              cropShape="rect"
              aspect={16 / 9}
            />
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => setExpandedEmailSections((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                style={s.btn("#e2e8f0", "#334155")}
                data-tip="Rozwiń wysyłkę email"
              >
                {expandedEmailSections[idx] ? "Zwiń wysyłkę email" : "Rozwiń wysyłkę email"}
              </button>
            </div>
            {expandedEmailSections[idx] && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed #cbd5e1" }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <label style={s.label}>Opis do maila (announcement)</label>
                    <button
                      onClick={() => updateUpcoming(idx, { email_desc_pl: buildAutoEmailDescription(ev) })}
                      style={{ ...s.btn("#e0f2fe", "#0369a1"), padding: "3px 8px", fontSize: 10 }}
                      data-tip="Auto-generuj opis"
                    >
                      Auto-generuj opis
                    </button>
                  </div>
                  <textarea
                    style={{
                      ...s.input,
                      minHeight: 96,
                      resize: "vertical",
                      lineHeight: 1.45,
                    }}
                    value={ev.email_desc_pl || ""}
                    onChange={(e) => updateUpcoming(idx, { email_desc_pl: e.target.value })}
                    placeholder="Tu wpisz dłuższy opis do maila announcement."
                  />
                </div>
                <FbField
                  label="Link spotkania (meeting link)"
                  value={ev.meeting_link_email || ""}
                  onChange={(v) => updateUpcoming(idx, { meeting_link_email: v })}
                  placeholder="https://meet.google.com/..."
                />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  <button
                    onClick={() => sendToActiveMembers(idx, "announcement")}
                    disabled={sendingKey === `${idx}:announcement`}
                    style={s.btn("#7c3aed", "#fff")}
                    data-tip="Wyślij announcement"
                  >
                    {sendingKey === `${idx}:announcement` ? "Wysyłanie..." : "Wyślij announcement email"}
                  </button>
                  <button
                    onClick={() => openEmailPreview(idx, "announcement")}
                    disabled={previewingKey === `${idx}:announcement`}
                    style={{ ...s.btn("#e2e8f0", "#475569"), padding: "3px 8px", fontSize: 10 }}
                    data-tip="Podgląd announcement"
                  >
                    {previewingKey === `${idx}:announcement` ? "..." : "Podgląd"}
                  </button>
                  <button
                    onClick={() => sendToActiveMembers(idx, "meeting_link")}
                    disabled={sendingKey === `${idx}:meeting_link`}
                    style={s.btn("#0ea5e9", "#fff")}
                    data-tip="Wyślij link spotkania"
                  >
                    {sendingKey === `${idx}:meeting_link` ? "Wysyłanie..." : "Wyślij link email"}
                  </button>
                  <button
                    onClick={() => openEmailPreview(idx, "meeting_link")}
                    disabled={previewingKey === `${idx}:meeting_link`}
                    style={{ ...s.btn("#e2e8f0", "#475569"), padding: "3px 8px", fontSize: 10 }}
                    data-tip="Podgląd link email"
                  >
                    {previewingKey === `${idx}:meeting_link` ? "..." : "Podgląd"}
                  </button>
                </div>
                {(() => {
                  const announcementStatus = sendStatus[`${idx}:announcement`];
                  const meetingStatus = sendStatus[`${idx}:meeting_link`];
                  const status = meetingStatus || announcementStatus;
                  if (!status) return null;
                  return (
                    <div style={{ marginBottom: 8, color: status.ok ? "#15803d" : "#b91c1c", fontSize: 12, fontWeight: 600 }}>
                      {status.text}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      {/* Past events */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ ...s.title, marginBottom: 0 }}>Poprzednie wydarzenia</h3>
          <button onClick={addPastFromLink} style={s.btn("#1877F2", "#fff")} data-tip="Dodaj z FB">
            + Dodaj z linku Facebook
          </button>
        </div>

        <div style={s.eventsGrid}>
        {past.map((ev, i) => (
          <div key={i} style={s.eventCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {ev.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.img} alt="" style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.titlePl || "Nowe wydarzenie"}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{ev.date}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => movePastToUpcoming(i)} style={s.btn("#16a34a", "#fff")} data-tip="Do nadchodzących">← Nadchodzące</button>
                {i > 0 && <button onClick={() => { const a = [...past]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; setPast(a); }} style={s.btn("#e2e8f0", "#475569")} data-tip="W górę">↑</button>}
                {i < past.length - 1 && <button onClick={() => { const a = [...past]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; setPast(a); }} style={s.btn("#e2e8f0", "#475569")} data-tip="W dół">↓</button>}
                <button onClick={() => setPast(past.filter((_, j) => j !== i))} style={s.btn("#fee2e2", "#dc2626")} data-tip="Usuń">Usuń</button>
              </div>
            </div>

            <div style={s.row}>
              <div style={{ ...s.col, flex: 2 }}>
                <FbField label="Link Facebook" value={ev.href} onChange={(v) => updatePast(i, "href", v)} placeholder="https://www.facebook.com/events/..." />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 8 }}>
                <button onClick={() => fetchPastOG(i)} disabled={fetchingIdx === i || !ev.href} style={s.btn("#1877F2", "#fff")} data-tip="Pobierz z FB">
                  {fetchingIdx === i ? "..." : "Pobierz"}
                </button>
              </div>
            </div>
            <div style={s.row}>
              <div style={{ ...s.col, flex: 2 }}>
                <FbField label="Tytuł" value={ev.titlePl} onChange={(v) => updatePast(i, "titlePl", v)} />
              </div>
              <div style={s.col}>
                <FbField label="Data" value={ev.date} onChange={(v) => updatePast(i, "date", v)} placeholder="DD.MM.YYYY" />
              </div>
            </div>
            <FbField label="Miejsce / prowadzący" value={ev.metaPl} onChange={(v) => { const a = [...past]; a[i] = { ...a[i], metaPl: v, metaEn: v }; setPast(a); }} placeholder="Online · Prof. ..." />
            <ImageUploadWithResize
              label="Obraz"
              value={ev.img}
              onChange={(v) => updatePast(i, "img", v)}
              suggestedName={ev.titlePl ? `event-${ev.titlePl.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40)}` : undefined}
              outputWidth={800}
              outputHeight={450}
              cropShape="rect"
              aspect={16 / 9}
            />
          </div>
        ))}
        </div>

        <button onClick={() => setPast([...past, { href: "", img: "", alt: "", date: "", titlePl: "", titleEn: "", metaPl: "", metaEn: "" }])} style={{ ...s.btn("#e0f2fe", "#0369a1"), marginTop: 12 }} data-tip="Dodaj ręcznie">
          + Dodaj ręcznie
        </button>
      </div>
      {previewModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,.45)",
            zIndex: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setPreviewModal(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 740,
              maxHeight: "85vh",
              overflow: "auto",
              background: "#fff",
              borderRadius: 14,
              padding: 20,
              boxShadow: "0 12px 28px rgba(0,0,0,.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, color: "#0f172a", fontSize: 16 }}>{previewModal.title}</h3>
              <button onClick={() => setPreviewModal(null)} style={s.btn("#e2e8f0", "#475569")} data-tip="Zamknij">Zamknij</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Temat</label>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 10, fontSize: 13, color: "#0f172a", fontWeight: 700 }}>
                {previewModal.subject || "—"}
              </div>
            </div>
            <div>
              <label style={s.label}>Treść</label>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 13,
                  color: "#334155",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                }}
              >
                {previewModal.body || "—"}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
