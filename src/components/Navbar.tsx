"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const navItems = [
  { href: "#about", pl: "O nas", en: "About" },
  { href: "#events", pl: "Wydarzenia", en: "Events" },
  { href: "#team", pl: "Zespół", en: "Team" },
  { href: "#join", pl: "Dołącz", en: "Join" },
  { href: "#faq", pl: "FAQ", en: "FAQ" },
  { href: "#contact", pl: "Kontakt", en: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"pl" | "en">("pl");

  useEffect(() => {
    const saved = localStorage.getItem("ssk-lang");
    if (saved === "en") setLang("en");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem("ssk-lang", lang);
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-pl][data-en]").forEach((el) => {
      const value = el.getAttribute(`data-${lang}`);
      if (value) el.textContent = value;
    });
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "pl" ? "en" : "pl"));

  const toggleMobile = () => {
    setMobileOpen((o) => !o);
    document.body.style.overflow = !mobileOpen ? "hidden" : "";
  };

  const closeMobile = () => {
    setMobileOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
        <div className="nav-container">
          <a href="#hero" className="nav-logo">
            <Image
              src="/img/ssk-logo-sm.webp"
              alt="SSK Logo"
              width={48}
              height={48}
              className="nav-logo-big"
              priority
            />
          </a>
          <ul className={`nav-links${mobileOpen ? " active" : ""}`}>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMobile}>
                  {lang === "pl" ? item.pl : item.en}
                </a>
              </li>
            ))}
            <li className="nav-link-mobile-panel">
              <a href="/login" onClick={closeMobile}>
                {lang === "pl" ? "Panel" : "Panel"}
              </a>
            </li>
          </ul>
          <div className="nav-actions">
            <a
              href="/login"
              className="btn btn-primary btn-sm"
              style={{ padding: "6px 16px", fontSize: 13, borderRadius: 8 }}
            >
              {lang === "pl" ? "Panel" : "Panel"}
            </a>
            <button className="lang-toggle" onClick={toggleLang}>
              <span className="lang-flag">{lang === "pl" ? "🇬🇧" : "🇵🇱"}</span>
              <span className="lang-label">{lang === "pl" ? "EN" : "PL"}</span>
            </button>
            <button
              className="nav-toggle"
              onClick={toggleMobile}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
      <div
        className={`nav-overlay${mobileOpen ? " active" : ""}`}
        onClick={closeMobile}
      />
    </>
  );
}
