"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)", marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 700 as const, color: "#0f172a", marginBottom: 16 },
  label: { display: "block" as const, fontWeight: 600 as const, fontSize: 13, marginBottom: 4, color: "#475569" },
  input: { width: "100%", padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const },
  btn: (bg: string, color: string) => ({ padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600 as const, cursor: "pointer", background: bg, color }),
  row: { display: "flex" as const, gap: 12, marginBottom: 12 },
  col: { flex: 1, minWidth: 0 },
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
    <div style={{ marginBottom: 12 }}>
      <label style={s.label}>{label}</label>
      <input style={s.input} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ImageUploadField({ label, value, onChange, supabase }: {
  label: string; value: string; onChange: (v: string) => void;
  supabase: ReturnType<typeof createClient>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from("event-images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      alert("Błąd przesyłania: " + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(fileName);
    onChange(urlData.publicUrl);
    setUploading(false);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={s.label}>{label}</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          style={{ ...s.input, flex: 1 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/img/event-cover.webp lub URL"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={s.btn(uploading ? "#94a3b8" : "#7c3aed", "#fff")}
        >
          {uploading ? "..." : "Prześlij"}
        </button>
      </div>
      {value && (
        <div style={{ marginTop: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="podgląd"
            style={{ maxWidth: 200, maxHeight: 120, borderRadius: 8, objectFit: "cover", border: "1px solid #e2e8f0" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            onLoad={(e) => { (e.target as HTMLImageElement).style.display = "block"; }}
          />
        </div>
      )}
    </div>
  );
}

export default function EventsEditor() {
  const supabase = createClient();
  const [upcomingList, setUpcomingList] = useState<UpcomingEvent[]>([DEFAULT_UPCOMING]);
  const [past, setPast] = useState<PastEvent[]>(DEFAULT_PAST);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [fetchingUpcomingIdx, setFetchingUpcomingIdx] = useState<number | null>(null);
  const [fetchingIdx, setFetchingIdx] = useState<number | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", ["events_upcoming", "events_past"]);
    if (data && data.length > 0) {
      data.forEach((row) => {
        if (row.id === "events_upcoming") {
          const raw = row.content;
          if (Array.isArray(raw)) {
            if (raw.length > 0) setUpcomingList(raw as UpcomingEvent[]);
          } else if (raw && typeof raw === "object") {
            setUpcomingList([raw as UpcomingEvent]);
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
      }]);
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
    const newIdx = past.length;
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
          <button onClick={save} disabled={saving} style={s.btn("#16a34a", "#fff")}>
            {saving ? "Zapisywanie..." : "Zapisz wszystko"}
          </button>
        </div>
      </div>

      {/* Upcoming */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ ...s.title, marginBottom: 0 }}>Nadchodzące wydarzenia ({upcomingList.length})</h3>
          <button onClick={addUpcoming} style={s.btn("#16a34a", "#fff")}>+ Dodaj nadchodzące</button>
        </div>

        {upcomingList.map((ev, idx) => (
          <div key={idx} style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
                {ev.title || `Wydarzenie ${idx + 1}`}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => moveUpcomingToPast(idx)} style={s.btn("#f59e0b", "#fff")} title="Przenieś do poprzednich">
                  → Poprzednie
                </button>
                {upcomingList.length > 1 && (
                  <button onClick={() => removeUpcoming(idx)} style={s.btn("#fee2e2", "#dc2626")}>Usuń</button>
                )}
              </div>
            </div>
            <FbField label="Link (Facebook)" value={ev.link || ""} onChange={(v) => updateUpcoming(idx, { link: v })} placeholder="https://www.facebook.com/events/..." />
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => fetchUpcomingOG(idx)} disabled={fetchingUpcomingIdx === idx || !ev.link} style={s.btn("#1877F2", "#fff")}>
                {fetchingUpcomingIdx === idx ? "Pobieranie..." : "Pobierz dane z Facebooka"}
              </button>
            </div>
            <FbField label="Tytuł" value={ev.title || ""} onChange={(v) => updateUpcoming(idx, { title: v })} />
            <FbField label="Data i miejsce" value={ev.date_pl || ""} onChange={(v) => updateUpcoming(idx, { date_pl: v, date_en: v })} placeholder="8 marca 2026 · Warszawa" />
            <FbField label="Krótki opis" value={ev.desc_pl || ""} onChange={(v) => updateUpcoming(idx, { desc_pl: v, desc_en: v })} />
            <ImageUploadField label="Obraz" value={ev.img || ""} onChange={(v) => updateUpcoming(idx, { img: v })} supabase={supabase} />
          </div>
        ))}
      </div>

      {/* Past events */}
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ ...s.title, marginBottom: 0 }}>Poprzednie wydarzenia</h3>
          <button onClick={addPastFromLink} style={s.btn("#1877F2", "#fff")}>
            + Dodaj z linku Facebook
          </button>
        </div>

        {past.map((ev, i) => (
          <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {ev.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.img} alt="" style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{ev.titlePl || "Nowe wydarzenie"}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{ev.date}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {i > 0 && <button onClick={() => { const a = [...past]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; setPast(a); }} style={s.btn("#e2e8f0", "#475569")}>↑</button>}
                {i < past.length - 1 && <button onClick={() => { const a = [...past]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; setPast(a); }} style={s.btn("#e2e8f0", "#475569")}>↓</button>}
                <button onClick={() => setPast(past.filter((_, j) => j !== i))} style={s.btn("#fee2e2", "#dc2626")}>Usuń</button>
              </div>
            </div>

            <div style={s.row}>
              <div style={{ ...s.col, flex: 2 }}>
                <FbField label="Link Facebook" value={ev.href} onChange={(v) => updatePast(i, "href", v)} placeholder="https://www.facebook.com/events/..." />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 12 }}>
                <button onClick={() => fetchPastOG(i)} disabled={fetchingIdx === i || !ev.href} style={s.btn("#1877F2", "#fff")}>
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
            <ImageUploadField label="Obraz" value={ev.img} onChange={(v) => updatePast(i, "img", v)} supabase={supabase} />
          </div>
        ))}

        <button onClick={() => setPast([...past, { href: "", img: "", alt: "", date: "", titlePl: "", titleEn: "", metaPl: "", metaEn: "" }])} style={s.btn("#e0f2fe", "#0369a1")}>
          + Dodaj ręcznie
        </button>
      </div>
    </div>
  );
}
