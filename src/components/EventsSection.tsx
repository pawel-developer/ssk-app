"use client";

import { useState } from "react";
import Image from "next/image";

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

const DEFAULT_PAST: PastEvent[] = [
  { href: "https://www.facebook.com/events/1600367001002973/", img: "/img/event2_lipidy-cover.webp", alt: "Zaburzenia lipidowe 2026", date: "23.02.2026", titlePl: "Wytyczne diagnostyki zaburzeń lipidowych 2026", titleEn: "Lipid Disorder Diagnostic Guidelines 2026", metaPl: "Online · Prof. Maciej Banach", metaEn: "Online · Prof. Maciej Banach" },
  { href: "https://www.facebook.com/events/1180004167648593/", img: "/img/event3_zastawka-cover.webp", alt: "Zastawka aortalna", date: "27.01.2026", titlePl: "Zastawka aortalna — diagnostyka i leczenie zabiegowe", titleEn: "Aortic Valve — Diagnostics & Interventional Treatment", metaPl: "Online", metaEn: "Online" },
  { href: "https://www.facebook.com/events/1776803796342665", img: "/img/event-1776803796342665.webp", alt: "Warsztaty Kardiologii Interwencyjnej", date: "24.01.2026", titlePl: "Warsztaty Kardiologii Interwencyjnej", titleEn: "Interventional Cardiology Workshops", metaPl: "Gdańsk · SKN Hemodynamiki GUMed", metaEn: "Gdańsk · SKN Hemodynamiki GUMed" },
  { href: "https://www.facebook.com/events/2385544128564083", img: "/img/event-2385544128564083.webp", alt: "Amyloidoza serca", date: "08.12.2025", titlePl: "Amyloidoza serca — cichy kameleon w kardiologii", titleEn: "Cardiac Amyloidosis — The Silent Chameleon", metaPl: "Online · Prof. Alicja Dąbrowska-Kugacka", metaEn: "Online · Prof. Alicja Dąbrowska-Kugacka" },
  { href: "https://www.facebook.com/events/1842680213344407/", img: "/img/event4_warsztaty-cover.webp", alt: "Pacjent-lek-zespół", date: "11.10.2025", titlePl: "Pacjent — lek — zespół: wyzwania opieki kardiologicznej", titleEn: "Patient — Drug — Team: Cardiology Care Challenges", metaPl: "Warszawa · Warsztaty stacjonarne", metaEn: "Warsaw · In-person workshops" },
  { href: "https://www.facebook.com/events/2129639964128688", img: "/img/event-2129639964128688.webp", alt: "II Edycja Kardiologicznej Szkoły Letniej", date: "08–12.08.2025", titlePl: "II Edycja Kardiologicznej Szkoły Letniej", titleEn: "2nd Cardiology Summer School", metaPl: "Gdańsk · SKN Hemodynamiki GUMed", metaEn: "Gdańsk · SKN Hemodynamiki GUMed" },
  { href: "https://www.facebook.com/events/1607813013172743", img: "/img/event-1607813013172743.webp", alt: "Wiosenna Szkoła Kardiologiczna I", date: "16.03.2025", titlePl: "Wiosenna Szkoła Kardiologiczna — I Edycja", titleEn: "Spring Cardiology School — 1st Edition", metaPl: "Warszawa · Centrum Symulacji WUM", metaEn: "Warsaw · WUM Simulation Center" },
];

const DEFAULT_UPCOMING: UpcomingEvent = {
  img: "/img/event1_wiosenna2-cover.webp",
  title: "Wiosenna Szkoła Kardiologiczna — II Edycja",
  date_pl: "8 marca 2026 · 8:30 · Centrum Symulacji WUM, Warszawa",
  date_en: "March 8, 2026 · 8:30 AM · WUM Simulation Center, Warsaw",
  desc_pl: "Całodniowe warsztaty umiejętności praktycznych. II edycja we współpracy ze SKN przy I Katedrze i Klinice Kardiologii WUM.",
  desc_en: "Full-day hands-on skills workshops. 2nd edition in collaboration with the Student Scientific Circle at the 1st Department of Cardiology, WUM.",
  badge_pl: "📅 Nadchodzące",
  badge_en: "📅 Upcoming",
  link: "https://www.facebook.com/events/3237057496601991/",
  btn_pl: "Zobacz na Facebooku",
  btn_en: "View on Facebook",
};

function EventCard({ event }: { event: PastEvent }) {
  return (
    <a href={event.href} target="_blank" rel="noopener" className="event-card">
      <div className="event-card-img">
        <Image src={event.img} alt={event.alt} width={400} height={160} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div className="event-card-body">
        <span className="event-date">{event.date}</span>
        <h4 data-pl={event.titlePl} data-en={event.titleEn}>{event.titlePl}</h4>
        <p className="event-card-meta" data-pl={event.metaPl} data-en={event.metaEn}>{event.metaPl}</p>
      </div>
    </a>
  );
}

export default function EventsSection({ upcomingEvent, pastEvents }: {
  upcomingEvent?: UpcomingEvent;
  pastEvents?: PastEvent[];
}) {
  const [showMore, setShowMore] = useState(false);

  const upcoming = upcomingEvent && Object.keys(upcomingEvent).length > 0 ? upcomingEvent : DEFAULT_UPCOMING;
  const allPast = pastEvents && pastEvents.length > 0 ? pastEvents : DEFAULT_PAST;
  const visibleCount = 3;
  const pastVisible = allPast.slice(0, visibleCount);
  const pastHidden = allPast.slice(visibleCount);

  return (
    <section className="section events" id="events">
      <div className="container">
        <div className="section-header">
          <span className="section-tag" data-pl="Nasze wydarzenia" data-en="Our events">Nasze wydarzenia</span>
          <h2 data-pl="Co się dzieje w SSK" data-en="What's happening at SSK">Co się dzieje w SSK</h2>
        </div>

        {/* Upcoming highlight */}
        <div className="event-highlight">
          <div className="event-highlight-img">
            <Image
              src={upcoming.img || "/img/event1_wiosenna2-cover.webp"}
              alt={upcoming.title || "Upcoming event"}
              width={600} height={400}
              style={{ width: "100%", height: "100%", objectFit: "contain", background: "#f0f2f5" }}
            />
          </div>
          <div className="event-highlight-content">
            <span className="event-badge upcoming"
              data-pl={upcoming.badge_pl || "📅 Nadchodzące"}
              data-en={upcoming.badge_en || "📅 Upcoming"}>
              {upcoming.badge_pl || "📅 Nadchodzące"}
            </span>
            <h3>{upcoming.title || "Nadchodzące wydarzenie"}</h3>
            <p className="event-meta">
              <span data-pl={upcoming.date_pl || ""} data-en={upcoming.date_en || ""}>
                {upcoming.date_pl || ""}
              </span>
            </p>
            <p data-pl={upcoming.desc_pl || ""} data-en={upcoming.desc_en || ""}>
              {upcoming.desc_pl || ""}
            </p>
            {upcoming.link && (
              <a href={upcoming.link} target="_blank" rel="noopener" className="btn btn-primary"
                data-pl={upcoming.btn_pl || "Zobacz na Facebooku"}
                data-en={upcoming.btn_en || "View on Facebook"}>
                {upcoming.btn_pl || "Zobacz na Facebooku"}
              </a>
            )}
          </div>
        </div>

        {/* Past events */}
        <h3 className="events-subtitle" data-pl="Poprzednie wydarzenia" data-en="Past events">Poprzednie wydarzenia</h3>
        <div className="events-grid">
          {pastVisible.map((e, i) => (
            <EventCard key={i} event={e} />
          ))}
        </div>

        {showMore && pastHidden.length > 0 && (
          <div className="events-grid" style={{ marginTop: "1.5rem" }}>
            {pastHidden.map((e, i) => (
              <EventCard key={i} event={e} />
            ))}
          </div>
        )}

        {pastHidden.length > 0 && (
          <div className="events-cta">
            <button className="btn" onClick={() => setShowMore((s) => !s)}>
              <span
                data-pl={showMore ? "Zwiń ↑" : "Pokaż więcej wydarzeń ↓"}
                data-en={showMore ? "Collapse ↑" : "Show more events ↓"}>
                {showMore ? "Zwiń ↑" : "Pokaż więcej wydarzeń ↓"}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
