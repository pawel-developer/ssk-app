"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";
import ImageUploadWithResize, { type ImageUploadHandle } from "./ImageUploadWithResize";

interface PastEvent {
  href: string;
  img: string;
  alt: string;
  date: string;
  titlePl: string;
  titleEn: string;
  metaPl: string;
  metaEn: string;
  event_mode?: "onsite" | "online";
  prowadzacy?: string;
  desc?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UpcomingEvent = Record<string, any>;
type EventMode = "onsite" | "online";
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
  event_mode: "onsite" as EventMode,
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

const MONTHS_PL = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDatePl(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_PL[m - 1]} ${y}`;
}

function formatDateEn(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS_EN[m - 1]} ${d}, ${y}`;
}

function composeDateDisplay(ev: UpcomingEvent): { pl: string; en: string } {
  const start = String(ev.event_date_start || "").trim();
  if (!start) return { pl: ev.date_pl || "", en: ev.date_en || "" };

  const end = String(ev.event_date_end || "").trim();
  const time = String(ev.event_time_start || "").trim();
  const place = String(ev.event_place || "").trim();
  const isOnline = ev.event_mode === "online";

  let plParts: string[] = [];
  let enParts: string[] = [];

  if (end && end !== start) {
    plParts.push(`${formatDatePl(start)} – ${formatDatePl(end)}`);
    enParts.push(`${formatDateEn(start)} – ${formatDateEn(end)}`);
  } else {
    plParts.push(formatDatePl(start));
    enParts.push(formatDateEn(start));
  }

  if (time) {
    const timeEnd = String(ev.event_time_end || "").trim();
    const timeStr = timeEnd ? `${time}–${timeEnd}` : time;
    plParts.push(timeStr);
    enParts.push(timeStr);
  }

  if (isOnline) {
    plParts.push("Online");
    enParts.push("Online");
  } else if (place) {
    plParts.push(place);
    enParts.push(place);
  }

  const speaker = String(ev.prowadzacy || "").trim();
  if (speaker) {
    plParts.push(speaker);
    enParts.push(speaker);
  }

  return { pl: plParts.join(" · "), en: enParts.join(" · ") };
}

const s = {
  card: { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,.12)", marginBottom: 16 },
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

function upcomingToPastEvent(ev: UpcomingEvent): PastEvent {
  const startDate = String(ev.event_date_start || "").trim();
  const endDate = String(ev.event_date_end || "").trim();
  const isOnline = ev.event_mode === "online";
  const place = String(ev.event_place || "").trim();
  const speaker = String(ev.prowadzacy || "").trim();

  let dateStr = "";
  if (startDate) {
    const [sy, sm, sd] = startDate.split("-");
    dateStr = `${sd}.${sm}.${sy}`;
    if (endDate && endDate !== startDate) {
      const [ey, em, ed] = endDate.split("-");
      dateStr += `–${ed}.${em}.${ey}`;
    }
  } else {
    dateStr = ev.date_pl?.split("·")[0]?.trim() || "";
  }

  let meta = "";
  if (isOnline) {
    meta = "Online";
  } else if (place) {
    meta = place;
  }

  return {
    href: ev.link || "",
    img: ev.img || "",
    alt: ev.title || "",
    date: dateStr,
    titlePl: ev.title || "",
    titleEn: ev.title || "",
    metaPl: meta,
    metaEn: meta,
    event_mode: isOnline ? "online" : "onsite",
    prowadzacy: speaker,
    desc: String(ev.desc_pl || "").trim(),
  };
}

function withEmailOnlyFields(event: UpcomingEvent): UpcomingEvent {
  return {
    ...event,
    event_mode: event.event_mode === "online" ? "online" : "onsite",
    event_date_start: typeof event.event_date_start === "string" ? event.event_date_start : "",
    event_date_end: typeof event.event_date_end === "string" ? event.event_date_end : "",
    event_time_start: typeof event.event_time_start === "string" ? event.event_time_start : "",
    event_time_end: typeof event.event_time_end === "string" ? event.event_time_end : "",
    event_place: typeof event.event_place === "string" ? event.event_place : "",
    prowadzacy: typeof event.prowadzacy === "string" ? event.prowadzacy : "",
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
  const [expandedDetails, setExpandedDetails] = useState<Record<string | number, boolean>>({});
  const imgRefs = useRef<Record<string, ImageUploadHandle | null>>({});
  const [imgPreview, setImgPreview] = useState<{ key: string; src: string } | null>(null);
  const [expandedEmailSections, setExpandedEmailSections] = useState<Record<number, boolean>>({});
  const [creatingGcal, setCreatingGcal] = useState<number | null>(null);
  const [gcalStatus, setGcalStatus] = useState<Record<number, { ok: boolean; text: string }>>({});

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", ["events_upcoming", "events_past"]);
    if (!data || data.length === 0) return;

    let loadedUpcoming: UpcomingEvent[] = [];
    let loadedPast: PastEvent[] = [];

    data.forEach((row) => {
      if (row.id === "events_upcoming") {
        const raw = row.content;
        if (Array.isArray(raw) && raw.length > 0) {
          loadedUpcoming = (raw as UpcomingEvent[]).map(withEmailOnlyFields);
        } else if (raw && typeof raw === "object") {
          loadedUpcoming = [withEmailOnlyFields(raw as UpcomingEvent)];
        }
      }
      if (row.id === "events_past") {
        const arr = row.content as PastEvent[];
        if (arr.length > 0) loadedPast = arr;
      }
    });

    const today = new Date().toISOString().split("T")[0];
    const stillUpcoming: UpcomingEvent[] = [];
    const expired: PastEvent[] = [];

    for (const ev of loadedUpcoming) {
      const endDate = String(ev.event_date_end || ev.event_date_start || "").trim();
      if (endDate && endDate < today) {
        expired.push(upcomingToPastEvent(ev));
      } else {
        stillUpcoming.push(ev);
      }
    }

    if (expired.length > 0) {
      const merged = [...expired, ...loadedPast];
      setUpcomingList(stillUpcoming.length > 0 ? stillUpcoming : [{
        img: "", title: "", date_pl: "", date_en: "", desc_pl: "", desc_en: "",
        badge_pl: "📅 Nadchodzące", badge_en: "📅 Upcoming",
        link: "", btn_pl: "Zobacz na Facebooku", btn_en: "View on Facebook",
        event_mode: "onsite" as EventMode,
        email_desc_pl: "", meeting_link_email: "",
      }]);
      setPast(merged);
      for (const item of [
        { id: "events_upcoming", content: stillUpcoming },
        { id: "events_past", content: merged },
      ]) {
        await supabase.from("site_content").upsert({ id: item.id, content: item.content });
      }
      setMsg(`Przeniesiono ${expired.length} zakończone wydarzeni${expired.length === 1 ? "e" : "a"} do poprzednich.`);
      setTimeout(() => setMsg(""), 4000);
    } else {
      if (loadedUpcoming.length > 0) setUpcomingList(loadedUpcoming);
      if (loadedPast.length > 0) setPast(loadedPast);
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
    setUpcomingList((prev) => prev.map((ev, i) => {
      if (i !== idx) return ev;
      const merged = { ...ev, ...updates };
      const dateFields = ["event_date_start", "event_date_end", "event_time_start", "event_place", "event_mode"];
      if (dateFields.some((f) => f in updates) && merged.event_date_start) {
        const { pl, en } = composeDateDisplay(merged);
        merged.date_pl = pl;
        merged.date_en = en;
      }
      return merged;
    }));
  };

  const addUpcoming = () => {
    setUpcomingList((prev) => [...prev, {
      img: "", title: "", date_pl: "", date_en: "", desc_pl: "", desc_en: "",
      badge_pl: "📅 Nadchodzące", badge_en: "📅 Upcoming",
      link: "", btn_pl: "Zobacz na Facebooku", btn_en: "View on Facebook",
      event_mode: "onsite" as EventMode,
      email_desc_pl: "", meeting_link_email: "",
    }]);
  };

  const removeUpcoming = (idx: number) => {
    if (upcomingList.length <= 1) return;
    setUpcomingList((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveUpcomingToPast = (idx: number) => {
    const ev = upcomingList[idx];
    setPast((prev) => [upcomingToPastEvent(ev), ...prev]);
    if (upcomingList.length > 1) {
      setUpcomingList((prev) => prev.filter((_, i) => i !== idx));
    } else {
      setUpcomingList([{
        img: "", title: "", date_pl: "", date_en: "", desc_pl: "", desc_en: "",
        badge_pl: "📅 Nadchodzące", badge_en: "📅 Upcoming",
        link: "", btn_pl: "Zobacz na Facebooku", btn_en: "View on Facebook",
        event_mode: "onsite" as EventMode,
        email_desc_pl: "", meeting_link_email: "",
      }]);
    }
  };

  const movePastToUpcoming = (idx: number) => {
    const ev = past[idx];
    const mode = ev.event_mode === "online" ? "online" : "onsite";

    let eventDateStart = "";
    const dateMatch = (ev.date || "").match(/^(\d{2})\.(\d{2})\.(\d{4})/);
    if (dateMatch) eventDateStart = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;

    const upcomingEvent: UpcomingEvent = {
      link: ev.href || "",
      img: ev.img || "",
      title: ev.titlePl || "",
      date_pl: "",
      date_en: "",
      desc_pl: ev.desc || "",
      desc_en: ev.desc || "",
      badge_pl: "📅 Nadchodzące", badge_en: "📅 Upcoming",
      btn_pl: "Zobacz na Facebooku", btn_en: "View on Facebook",
      event_mode: mode as EventMode,
      event_date_start: eventDateStart,
      event_date_end: "",
      event_time_start: "",
      event_time_end: "",
      event_place: mode === "online" ? "" : (ev.metaPl || ""),
      prowadzacy: ev.prowadzacy || "",
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

  const createGoogleEvent = async (idx: number) => {
    const ev = upcomingList[idx];
    if (!ev?.title) {
      setMsg("Uzupełnij tytuł wydarzenia przed utworzeniem spotkania.");
      setTimeout(() => setMsg(""), 3500);
      return;
    }
    const date = String(ev.event_date_start || "").trim();
    const startTime = String(ev.event_time_start || "").trim();
    const endTime = String(ev.event_time_end || "").trim();
    if (!date || !startTime || !endTime) {
      setMsg("Uzupełnij datę, godzinę rozpoczęcia i zakończenia wydarzenia.");
      setTimeout(() => setMsg(""), 3500);
      return;
    }

    const confirmed = confirm(
      `Utworzyć wydarzenie Google Calendar z linkiem Meet?\n\n${ev.title}\n${date} ${startTime}–${endTime}`
    );
    if (!confirmed) return;

    setCreatingGcal(idx);
    setGcalStatus((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });

    const isOnline = ev.event_mode === "online";

    try {
      const res = await fetch("/api/events/create-google-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ev.title,
          description: ev.desc_pl || "",
          location: isOnline ? "" : (ev.event_place || ""),
          date,
          startTime,
          endTime,
          withMeet: isOnline,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGcalStatus((prev) => ({ ...prev, [idx]: { ok: false, text: data?.error || "Błąd tworzenia wydarzenia." } }));
        return;
      }
      if (isOnline && data.meetLink) {
        updateUpcoming(idx, { meeting_link_email: data.meetLink });
      }
      setGcalStatus((prev) => ({
        ...prev,
        [idx]: {
          ok: true,
          text: isOnline
            ? `Utworzono! Meet: ${data.meetLink}`
            : `Utworzono wydarzenie w kalendarzu!`,
        },
      }));
    } catch (err) {
      setGcalStatus((prev) => ({
        ...prev,
        [idx]: { ok: false, text: err instanceof Error ? err.message : "Nieznany błąd." },
      }));
    } finally {
      setCreatingGcal(null);
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
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Zarządzaj wydarzeniami na stronie głównej</p>
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
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <div
                onClick={() => {
                  const key = `up-${idx}`;
                  if (ev.img) {
                    const src = ev.img.startsWith("http") || ev.img.startsWith("/") ? ev.img : `/img/${ev.img}.webp`;
                    setImgPreview({ key, src });
                  } else {
                    imgRefs.current[key]?.openCropper();
                  }
                }}
                style={{
                  width: 80, height: 80, borderRadius: 10, flexShrink: 0, cursor: "pointer",
                  background: ev.img ? "none" : "#e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", border: "2px solid #e2e8f0",
                  transition: "border-color .15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#7c3aed"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; }}
                title={ev.img ? "Kliknij, aby zobaczyć / zmienić obraz" : "Kliknij, aby dodać obraz"}
              >
                {ev.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <span style={{ fontSize: 22, color: "#94a3b8" }}>+</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ev.title || `Wydarzenie ${idx + 1}`}
                </div>
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  <button onClick={() => moveUpcomingToPast(idx)} style={{ ...s.btn("#f59e0b", "#fff"), padding: "3px 8px", fontSize: 10 }}>
                    → Poprzednie
                  </button>
                  {upcomingList.length > 1 && (
                    <button onClick={() => removeUpcoming(idx)} style={{ ...s.btn("#fee2e2", "#dc2626"), padding: "3px 8px", fontSize: 10 }}>Usuń</button>
                  )}
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
              <ImageUploadWithResize
                ref={(el) => { imgRefs.current[`up-${idx}`] = el; }}
                value={ev.img || ""}
                onChange={(v) => updateUpcoming(idx, { img: v })}
                suggestedName={ev.title ? `event-${ev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40)}` : undefined}
                outputWidth={800}
                outputHeight={450}
                cropShape="rect"
                aspect={16 / 9}
                showPreview={false}
              />
            </div>
            {/* Essential fields */}
            <FbField label="Tytuł" value={ev.title || ""} onChange={(v) => updateUpcoming(idx, { title: v })} />
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 0, borderRadius: 6, overflow: "hidden", border: "1px solid #e2e8f0", width: "fit-content" }}>
                <button
                  onClick={() => updateUpcoming(idx, { event_mode: "onsite", meeting_link_email: "" })}
                  style={{
                    padding: "5px 12px", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    background: (ev.event_mode || "onsite") === "onsite" ? "#0f172a" : "#f8fafc",
                    color: (ev.event_mode || "onsite") === "onsite" ? "#fff" : "#64748b",
                  }}
                >
                  Stacjonarnie
                </button>
                <button
                  onClick={() => updateUpcoming(idx, { event_mode: "online" })}
                  style={{
                    padding: "5px 12px", border: "none", borderLeft: "1px solid #e2e8f0", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    background: ev.event_mode === "online" ? "#0f172a" : "#f8fafc",
                    color: ev.event_mode === "online" ? "#fff" : "#64748b",
                  }}
                >
                  Online
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 8, padding: 10, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <label style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Od</label>
                <input
                  type="date"
                  style={{ ...s.input, width: "auto", flex: "0 0 auto" }}
                  value={ev.event_date_start || ""}
                  onChange={(e) => updateUpcoming(idx, { event_date_start: e.target.value })}
                />
                <select
                  style={{ ...s.input, width: "auto" }}
                  value={ev.event_time_start ? ev.event_time_start.split(":")[0] : ""}
                  onChange={(e) => {
                    const h = e.target.value;
                    if (!h) {
                      updateUpcoming(idx, { event_time_start: "", event_time_end: "" });
                    } else {
                      const m = ev.event_time_start ? ev.event_time_start.split(":")[1] : "00";
                      const newTime = `${h}:${m}`;
                      const updates: Partial<UpcomingEvent> = { event_time_start: newTime };
                      if (!ev.event_time_end) {
                        const endH = String((Number(h) + 1) % 24).padStart(2, "0");
                        updates.event_time_end = `${endH}:${m}`;
                      }
                      updateUpcoming(idx, updates);
                    }
                  }}
                >
                  <option value="">–</option>
                  {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>:</span>
                <select
                  style={{ ...s.input, width: "auto" }}
                  value={ev.event_time_start ? ev.event_time_start.split(":")[1] : ""}
                  disabled={!ev.event_time_start}
                  onChange={(e) => {
                    const h = ev.event_time_start ? ev.event_time_start.split(":")[0] : "00";
                    updateUpcoming(idx, { event_time_start: `${h}:${e.target.value}` });
                  }}
                >
                  <option value="">–</option>
                  {["00", "15", "30", "45"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                <label style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Do</label>
                <input
                  type="date"
                  style={{ ...s.input, width: "auto", flex: "0 0 auto" }}
                  value={ev.event_date_end || ev.event_date_start || ""}
                  min={ev.event_date_start || ""}
                  onChange={(e) => {
                    updateUpcoming(idx, {
                      event_date_end: e.target.value !== (ev.event_date_start || "") ? e.target.value : "",
                    });
                  }}
                />
                <select
                  style={{ ...s.input, width: "auto" }}
                  value={ev.event_time_end ? ev.event_time_end.split(":")[0] : ""}
                  onChange={(e) => {
                    const h = e.target.value;
                    if (!h) {
                      updateUpcoming(idx, { event_time_end: "" });
                    } else {
                      const m = ev.event_time_end ? ev.event_time_end.split(":")[1] : "00";
                      updateUpcoming(idx, { event_time_end: `${h}:${m}` });
                    }
                  }}
                >
                  <option value="">–</option>
                  {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>:</span>
                <select
                  style={{ ...s.input, width: "auto" }}
                  value={ev.event_time_end ? ev.event_time_end.split(":")[1] : ""}
                  disabled={!ev.event_time_end}
                  onChange={(e) => {
                    const h = ev.event_time_end ? ev.event_time_end.split(":")[0] : "00";
                    updateUpcoming(idx, { event_time_end: `${h}:${e.target.value}` });
                  }}
                >
                  <option value="">–</option>
                  {["00", "15", "30", "45"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              {(ev.event_mode || "onsite") !== "online" && (
                <div style={{ marginTop: 8 }}>
                  <input
                    style={s.input}
                    value={ev.event_place || ""}
                    onChange={(e) => updateUpcoming(idx, { event_place: e.target.value })}
                    placeholder="Miejsce, np. Centrum Symulacji WUM, Warszawa"
                  />
                </div>
              )}
              <div style={{ marginTop: 8 }}>
                <input
                  style={s.input}
                  value={ev.prowadzacy || ""}
                  onChange={(e) => updateUpcoming(idx, { prowadzacy: e.target.value })}
                  placeholder="Prowadzący / organizator (opcjonalnie)"
                />
              </div>
              {ev.date_pl && (
                <div style={{ marginTop: 8, fontSize: 11, color: "#64748b" }}>
                  → {ev.date_pl}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
              <input
                style={{ ...s.input, flex: 1 }}
                value={ev.link || ""}
                onChange={(v) => updateUpcoming(idx, { link: v.target.value })}
                placeholder="Link do wydarzenia (Facebook)"
              />
              <button onClick={() => fetchUpcomingOG(idx)} disabled={fetchingUpcomingIdx === idx || !ev.link} style={s.btn("#1877F2", "#fff")} data-tip="Pobierz z FB">
                {fetchingUpcomingIdx === idx ? "..." : "Pobierz"}
              </button>
            </div>

            {/* Expandable details: description, image */}
            <div style={{ display: "flex", gap: 6, marginTop: 4, marginBottom: 4 }}>
              <button
                onClick={() => setExpandedDetails((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                style={s.btn("#e2e8f0", "#334155")}
              >
                {expandedDetails[idx] ? "Zwiń opis" : "Opis wydarzenia"}
              </button>
              <button
                onClick={() => setExpandedEmailSections((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                style={s.btn("#e2e8f0", "#334155")}
              >
                {expandedEmailSections[idx] ? "Zwiń email / kalendarz" : "Email / kalendarz"}
              </button>
            </div>
            {expandedDetails[idx] && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed #cbd5e1" }}>
                <FbTextAreaField
                  label="Krótki opis"
                  value={ev.desc_pl || ""}
                  onChange={(v) => updateUpcoming(idx, { desc_pl: v, desc_en: v })}
                  placeholder="Wpisz opis wydarzenia (może być dłuższy)."
                />
              </div>
            )}
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
                <div style={{ marginBottom: 12, padding: 10, background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#166534", marginBottom: 6 }}>
                    Google Calendar{ev.event_mode === "online" ? " + Meet" : ""}
                  </div>
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 8 }}>
                    {ev.event_mode === "online"
                      ? `Utworzy wydarzenie z linkiem Google Meet (${ev.event_date_start || "—"}, ${ev.event_time_start || "—"}–${ev.event_time_end || "—"})`
                      : `Utworzy wydarzenie w kalendarzu (${ev.event_date_start || "—"}, ${ev.event_time_start || "—"}–${ev.event_time_end || "—"}${ev.event_place ? `, ${ev.event_place}` : ""})`
                    }
                  </div>
                  <button
                    onClick={() => createGoogleEvent(idx)}
                    disabled={creatingGcal === idx}
                    style={s.btn("#16a34a", "#fff")}
                    data-tip="Utwórz Google Calendar"
                  >
                    {creatingGcal === idx
                      ? "Tworzenie..."
                      : ev.event_mode === "online"
                        ? "Utwórz wydarzenie Google + Meet"
                        : "Utwórz wydarzenie Google Calendar"
                    }
                  </button>
                  {gcalStatus[idx] && (
                    <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: gcalStatus[idx].ok ? "#15803d" : "#b91c1c" }}>
                      {gcalStatus[idx].text}
                    </div>
                  )}
                </div>
                {ev.event_mode === "online" && (
                  <FbField
                    label="Link spotkania (meeting link)"
                    value={ev.meeting_link_email || ""}
                    onChange={(v) => updateUpcoming(idx, { meeting_link_email: v })}
                    placeholder="https://meet.google.com/..."
                  />
                )}
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
                  {ev.event_mode === "online" && (
                    <>
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
                    </>
                  )}
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
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <div
                onClick={() => {
                  const key = `past-${i}`;
                  if (ev.img) {
                    const src = ev.img.startsWith("http") || ev.img.startsWith("/") ? ev.img : `/img/${ev.img}.webp`;
                    setImgPreview({ key, src });
                  } else {
                    imgRefs.current[key]?.openCropper();
                  }
                }}
                style={{
                  width: 80, height: 80, borderRadius: 10, flexShrink: 0, cursor: "pointer",
                  background: ev.img ? "none" : "#e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", border: "2px solid #e2e8f0",
                  transition: "border-color .15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#7c3aed"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; }}
                title={ev.img ? "Kliknij, aby zobaczyć / zmienić obraz" : "Kliknij, aby dodać obraz"}
              >
                {ev.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <span style={{ fontSize: 22, color: "#94a3b8" }}>+</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ev.titlePl || "Nowe wydarzenie"}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{ev.date}{ev.metaPl ? ` · ${ev.metaPl}` : ""}</div>
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  <button onClick={() => movePastToUpcoming(i)} style={{ ...s.btn("#16a34a", "#fff"), padding: "3px 8px", fontSize: 10 }}>← Nadchodzące</button>
                  {i > 0 && <button onClick={() => { const a = [...past]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; setPast(a); }} style={{ ...s.btn("#e2e8f0", "#475569"), padding: "3px 8px", fontSize: 10 }}>↑</button>}
                  {i < past.length - 1 && <button onClick={() => { const a = [...past]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; setPast(a); }} style={{ ...s.btn("#e2e8f0", "#475569"), padding: "3px 8px", fontSize: 10 }}>↓</button>}
                  <button onClick={() => setPast(past.filter((_, j) => j !== i))} style={{ ...s.btn("#fee2e2", "#dc2626"), padding: "3px 8px", fontSize: 10 }}>Usuń</button>
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
              <ImageUploadWithResize
                ref={(el) => { imgRefs.current[`past-${i}`] = el; }}
                value={ev.img || ""}
                onChange={(v) => { const a = [...past]; a[i] = { ...a[i], img: v }; setPast(a); }}
                suggestedName={ev.titlePl ? `event-${ev.titlePl.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40)}` : undefined}
                outputWidth={800}
                outputHeight={450}
                cropShape="rect"
                aspect={16 / 9}
                showPreview={false}
              />
            </div>

            <FbField label="Tytuł" value={ev.titlePl} onChange={(v) => updatePast(i, "titlePl", v)} />
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 0, borderRadius: 6, overflow: "hidden", border: "1px solid #e2e8f0", width: "fit-content" }}>
                <button
                  onClick={() => { const a = [...past]; a[i] = { ...a[i], event_mode: "onsite" }; setPast(a); }}
                  style={{
                    padding: "5px 12px", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    background: (ev.event_mode || "onsite") === "onsite" ? "#0f172a" : "#f8fafc",
                    color: (ev.event_mode || "onsite") === "onsite" ? "#fff" : "#64748b",
                  }}
                >
                  Stacjonarnie
                </button>
                <button
                  onClick={() => { const a = [...past]; a[i] = { ...a[i], event_mode: "online", metaPl: "Online", metaEn: "Online" }; setPast(a); }}
                  style={{
                    padding: "5px 12px", border: "none", borderLeft: "1px solid #e2e8f0", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    background: ev.event_mode === "online" ? "#0f172a" : "#f8fafc",
                    color: ev.event_mode === "online" ? "#fff" : "#64748b",
                  }}
                >
                  Online
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 8, padding: 10, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              {(() => {
                const raw = ev.date || "";
                const rangeMatch = raw.match(/^(\d{2})[\.\-](\d{2})[\.\-](\d{4})\s*[–\-]\s*(\d{2})[\.\-](\d{2})[\.\-](\d{4})$/);
                const shortRangeMatch = !rangeMatch && raw.match(/^(\d{2})[–\-](\d{2})\.(\d{2})\.(\d{4})$/);
                const singleMatch = !rangeMatch && !shortRangeMatch && raw.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

                let startIso = "";
                let endIso = "";
                if (rangeMatch) {
                  startIso = `${rangeMatch[3]}-${rangeMatch[2]}-${rangeMatch[1]}`;
                  endIso = `${rangeMatch[6]}-${rangeMatch[5]}-${rangeMatch[4]}`;
                } else if (shortRangeMatch) {
                  startIso = `${shortRangeMatch[4]}-${shortRangeMatch[3]}-${shortRangeMatch[1]}`;
                  endIso = `${shortRangeMatch[4]}-${shortRangeMatch[3]}-${shortRangeMatch[2]}`;
                } else if (singleMatch) {
                  startIso = `${singleMatch[3]}-${singleMatch[2]}-${singleMatch[1]}`;
                }

                const buildDateStr = (sIso: string, eIso: string) => {
                  if (!sIso) return "";
                  const [sy, sm, sd] = sIso.split("-");
                  let str = `${sd}.${sm}.${sy}`;
                  if (eIso && eIso !== sIso) {
                    const [ey, em, ed] = eIso.split("-");
                    if (sy === ey && sm === em) {
                      str = `${sd}–${ed}.${sm}.${sy}`;
                    } else {
                      str += `–${ed}.${em}.${ey}`;
                    }
                  }
                  return str;
                };

                return (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <label style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Od</label>
                    <input
                      type="date"
                      style={{ ...s.input, width: "auto", flex: "0 0 auto" }}
                      value={startIso}
                      onChange={(e) => {
                        const a = [...past];
                        a[i] = { ...a[i], date: buildDateStr(e.target.value, endIso) };
                        setPast(a);
                      }}
                    />
                    <label style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Do</label>
                    <input
                      type="date"
                      style={{ ...s.input, width: "auto", flex: "0 0 auto" }}
                      value={endIso || startIso}
                      min={startIso}
                      onChange={(e) => {
                        const newEnd = e.target.value !== startIso ? e.target.value : "";
                        const a = [...past];
                        a[i] = { ...a[i], date: buildDateStr(startIso, newEnd) };
                        setPast(a);
                      }}
                    />
                  </div>
                );
              })()}
              {(ev.event_mode || "onsite") !== "online" && (
                <div style={{ marginTop: 8 }}>
                  <input
                    style={s.input}
                    value={ev.metaPl}
                    onChange={(e) => { const a = [...past]; a[i] = { ...a[i], metaPl: e.target.value, metaEn: e.target.value }; setPast(a); }}
                    placeholder="Miejsce, np. Centrum Symulacji WUM, Warszawa"
                  />
                </div>
              )}
              <div style={{ marginTop: 8 }}>
                <input
                  style={s.input}
                  value={ev.prowadzacy || ""}
                  onChange={(e) => { const a = [...past]; a[i] = { ...a[i], prowadzacy: e.target.value }; setPast(a); }}
                  placeholder="Prowadzący / organizator (opcjonalnie)"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
              <input
                style={{ ...s.input, flex: 1 }}
                value={ev.href || ""}
                onChange={(e) => { const a = [...past]; a[i] = { ...a[i], href: e.target.value }; setPast(a); }}
                placeholder="Link do wydarzenia (Facebook)"
              />
              <button onClick={() => fetchPastOG(i)} disabled={fetchingIdx === i || !ev.href} style={s.btn("#1877F2", "#fff")} data-tip="Pobierz z FB">
                {fetchingIdx === i ? "..." : "Pobierz"}
              </button>
            </div>

            <button
              onClick={() => setExpandedDetails((prev) => ({ ...prev, [`past-${i}`]: !prev[`past-${i}`] }))}
              style={s.btn("#e2e8f0", "#334155")}
            >
              {expandedDetails[`past-${i}`] ? "Zwiń opis" : "Opis wydarzenia"}
            </button>
            {expandedDetails[`past-${i}`] && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed #cbd5e1" }}>
                <FbTextAreaField
                  label="Krótki opis"
                  value={ev.desc || ""}
                  onChange={(v) => { const a = [...past]; a[i] = { ...a[i], desc: v }; setPast(a); }}
                  placeholder="Wpisz opis wydarzenia."
                />
              </div>
            )}
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

      {imgPreview && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.55)",
            zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
          onClick={() => setImgPreview(null)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 14, overflow: "hidden",
              maxWidth: 560, width: "100%", boxShadow: "0 12px 40px rgba(0,0,0,.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgPreview.src}
                alt="Podgląd"
                style={{ maxWidth: "100%", maxHeight: 340, borderRadius: 8, objectFit: "contain" }}
                onError={(e) => { (e.target as HTMLImageElement).alt = "Nie udało się załadować obrazu"; }}
              />
            </div>
            <div style={{ padding: "14px 20px", display: "flex", justifyContent: "center", gap: 10, borderTop: "1px solid #e2e8f0" }}>
              <button
                onClick={() => { const ref = imgRefs.current[imgPreview.key]; setImgPreview(null); setTimeout(() => ref?.openCropper(), 50); }}
                style={s.btn("#0369a1", "#fff")}
              >
                Przytnij
              </button>
              <button
                onClick={() => { const ref = imgRefs.current[imgPreview.key]; setImgPreview(null); setTimeout(() => ref?.openFilePicker(), 50); }}
                style={s.btn("#7c3aed", "#fff")}
              >
                Zmień obraz
              </button>
              <button onClick={() => setImgPreview(null)} style={s.btn("#e2e8f0", "#475569")}>
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
