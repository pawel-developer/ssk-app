"use client";

import { useState } from "react";
import Image from "next/image";

const pastEventsVisible = [
  {
    href: "https://www.facebook.com/events/1600367001002973/",
    img: "/img/event2_lipidy-cover.webp",
    alt: "Zaburzenia lipidowe 2026",
    date: "23.02.2026",
    titlePl: "Wytyczne diagnostyki zaburzeń lipidowych 2026",
    titleEn: "Lipid Disorder Diagnostic Guidelines 2026",
    metaPl: "Online · Prof. Maciej Banach",
    metaEn: "Online · Prof. Maciej Banach",
  },
  {
    href: "https://www.facebook.com/events/1180004167648593/",
    img: "/img/event3_zastawka-cover.webp",
    alt: "Zastawka aortalna",
    date: "27.01.2026",
    titlePl: "Zastawka aortalna — diagnostyka i leczenie zabiegowe",
    titleEn: "Aortic Valve — Diagnostics & Interventional Treatment",
    metaPl: "Online",
    metaEn: "Online",
  },
  {
    href: "https://www.facebook.com/events/1776803796342665",
    img: "/img/event-1776803796342665.webp",
    alt: "Warsztaty Kardiologii Interwencyjnej",
    date: "24.01.2026",
    titlePl: "Warsztaty Kardiologii Interwencyjnej",
    titleEn: "Interventional Cardiology Workshops",
    metaPl: "Gdańsk · SKN Hemodynamiki GUMed",
    metaEn: "Gdańsk · SKN Hemodynamiki GUMed",
  },
];

const pastEventsHidden = [
  {
    href: "https://www.facebook.com/events/2385544128564083",
    img: "/img/event-2385544128564083.webp",
    alt: "Amyloidoza serca",
    date: "08.12.2025",
    titlePl: "Amyloidoza serca — cichy kameleon w kardiologii",
    titleEn: "Cardiac Amyloidosis — The Silent Chameleon",
    metaPl: "Online · Prof. Alicja Dąbrowska-Kugacka",
    metaEn: "Online · Prof. Alicja Dąbrowska-Kugacka",
  },
  {
    href: "https://www.facebook.com/events/1842680213344407/",
    img: "/img/event4_warsztaty-cover.webp",
    alt: "Pacjent-lek-zespół",
    date: "11.10.2025",
    titlePl: "Pacjent — lek — zespół: wyzwania opieki kardiologicznej",
    titleEn: "Patient — Drug — Team: Cardiology Care Challenges",
    metaPl: "Warszawa · Warsztaty stacjonarne",
    metaEn: "Warsaw · In-person workshops",
  },
  {
    href: "https://www.facebook.com/events/2129639964128688",
    img: "/img/event-2129639964128688.webp",
    alt: "II Edycja Kardiologicznej Szkoły Letniej",
    date: "08–12.08.2025",
    titlePl: "II Edycja Kardiologicznej Szkoły Letniej",
    titleEn: "2nd Cardiology Summer School",
    metaPl: "Gdańsk · SKN Hemodynamiki GUMed",
    metaEn: "Gdańsk · SKN Hemodynamiki GUMed",
  },
  {
    href: "https://www.facebook.com/events/1607813013172743",
    img: "/img/event-1607813013172743.webp",
    alt: "Wiosenna Szkoła Kardiologiczna I",
    date: "16.03.2025",
    titlePl: "Wiosenna Szkoła Kardiologiczna — I Edycja",
    titleEn: "Spring Cardiology School — 1st Edition",
    metaPl: "Warszawa · Centrum Symulacji WUM",
    metaEn: "Warsaw · WUM Simulation Center",
  },
];

function EventCard({
  event,
}: {
  event: (typeof pastEventsVisible)[number];
}) {
  return (
    <a
      href={event.href}
      target="_blank"
      rel="noopener"
      className="event-card"
    >
      <div className="event-card-img">
        <Image
          src={event.img}
          alt={event.alt}
          width={400}
          height={160}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="event-card-body">
        <span className="event-date">{event.date}</span>
        <h4 data-pl={event.titlePl} data-en={event.titleEn}>
          {event.titlePl}
        </h4>
        <p className="event-card-meta" data-pl={event.metaPl} data-en={event.metaEn}>
          {event.metaPl}
        </p>
      </div>
    </a>
  );
}

export default function EventsSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="section events" id="events">
      <div className="container">
        <div className="section-header">
          <span
            className="section-tag"
            data-pl="Nasze wydarzenia"
            data-en="Our events"
          >
            Nasze wydarzenia
          </span>
          <h2
            data-pl="Co się dzieje w SSK"
            data-en="What's happening at SSK"
          >
            Co się dzieje w SSK
          </h2>
        </div>

        {/* Upcoming highlight */}
        <div className="event-highlight">
          <div className="event-highlight-img">
            <Image
              src="/img/event1_wiosenna2-cover.webp"
              alt="Wiosenna Szkoła Kardiologiczna II Edycja"
              width={600}
              height={400}
              style={{ width: "100%", height: "100%", objectFit: "contain", background: "#f0f2f5" }}
            />
          </div>
          <div className="event-highlight-content">
            <span
              className="event-badge upcoming"
              data-pl="📅 Nadchodzące"
              data-en="📅 Upcoming"
            >
              📅 Nadchodzące
            </span>
            <h3>Wiosenna Szkoła Kardiologiczna — II Edycja</h3>
            <p className="event-meta">
              <span
                data-pl="8 marca 2026 · 8:30 · Centrum Symulacji WUM, Warszawa"
                data-en="March 8, 2026 · 8:30 AM · WUM Simulation Center, Warsaw"
              >
                8 marca 2026 · 8:30 · Centrum Symulacji WUM, Warszawa
              </span>
            </p>
            <p
              data-pl="Całodniowe warsztaty umiejętności praktycznych. II edycja we współpracy ze SKN przy I Katedrze i Klinice Kardiologii WUM."
              data-en="Full-day hands-on skills workshops. 2nd edition in collaboration with the Student Scientific Circle at the 1st Department of Cardiology, WUM."
            >
              Całodniowe warsztaty umiejętności praktycznych. II edycja we
              współpracy ze SKN przy I Katedrze i Klinice Kardiologii WUM.
            </p>
            <a
              href="https://www.facebook.com/events/3237057496601991/"
              target="_blank"
              rel="noopener"
              className="btn btn-primary"
              data-pl="Zobacz na Facebooku"
              data-en="View on Facebook"
            >
              Zobacz na Facebooku
            </a>
          </div>
        </div>

        {/* Past events */}
        <h3
          className="events-subtitle"
          data-pl="Poprzednie wydarzenia"
          data-en="Past events"
        >
          Poprzednie wydarzenia
        </h3>
        <div className="events-grid">
          {pastEventsVisible.map((e, i) => (
            <EventCard key={i} event={e} />
          ))}
        </div>

        {showMore && (
          <div className="events-grid" style={{ marginTop: "1.5rem" }}>
            {pastEventsHidden.map((e, i) => (
              <EventCard key={i} event={e} />
            ))}
          </div>
        )}

        <div className="events-cta">
          <button className="btn" onClick={() => setShowMore((s) => !s)}>
            <span
              data-pl={showMore ? "Zwiń ↑" : "Pokaż więcej wydarzeń ↓"}
              data-en={showMore ? "Collapse ↑" : "Show more events ↓"}
            >
              {showMore ? "Zwiń ↑" : "Pokaż więcej wydarzeń ↓"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
