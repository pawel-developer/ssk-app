"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";
import Link from "next/link";
import { changelog, type ChangelogEntry } from "@/data/changelog";

const MEMBER_AREAS: Set<string> = new Set(["panel", "landing"]);

function getMemberChangelog(): ChangelogEntry[] {
  return changelog
    .map((entry) => ({
      ...entry,
      sections: entry.sections.filter((s) => MEMBER_AREAS.has(s.area)),
    }))
    .filter((entry) => entry.sections.length > 0);
}

const AREA_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  panel: { bg: "rgba(14,165,233,.15)", color: "#38bdf8", label: "Panel członka" },
  landing: { bg: "rgba(244,114,182,.12)", color: "#f472b6", label: "Strona główna" },
};

export default function PanelChangelogPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
      else setAuthenticated(true);
    });
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const entries = getMemberChangelog();

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
        <p style={{ color: "#94a3b8" }}>Ładowanie...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <div style={{ background: "rgba(15,23,42,.6)", backdropFilter: "blur(12px)", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Link
            href="/panel"
            style={{ padding: "8px 14px", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,.06)", color: "#94a3b8", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
          >
            ← Panel członka
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Image src="/img/ssk-logo-white-sm.webp" alt="SSK" width={36} height={36} />
          <h1 style={{ fontSize: 20, color: "#fff", margin: 0 }}>Co nowego?</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleLogout}
            style={{ padding: "8px 14px", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "rgba(255,255,255,.06)", color: "#94a3b8", fontFamily: "inherit" }}
          >
            Wyloguj
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px", flex: 1, width: "100%" }}>
        <p style={{ color: "#64748b", fontSize: 13, textAlign: "center", marginBottom: 32 }}>
          Historia zmian dotyczących strony i panelu członka
        </p>

        <div style={{ position: "relative", paddingLeft: 28 }}>
          {/* Timeline line */}
          <div style={{ position: "absolute", left: 9, top: 8, bottom: 8, width: 2, background: "rgba(255,255,255,.08)", borderRadius: 1 }} />

          {entries.map((entry, i) => (
            <div key={i} style={{ position: "relative", marginBottom: 28 }}>
              {/* Timeline dot */}
              <div style={{ position: "absolute", left: -28, top: 6, width: 20, height: 20, borderRadius: "50%", background: "#0f172a", border: "2px solid #0ea5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0ea5e9" }} />
              </div>

              <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 14, padding: 22, border: "1px solid rgba(255,255,255,.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>
                    {entry.titlePl}
                  </h3>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {new Date(entry.date).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>

                {entry.sections.map((section, si) => {
                  const badge = AREA_BADGE[section.area];
                  if (!badge) return null;
                  return (
                    <div key={si} style={{ marginBottom: si < entry.sections.length - 1 ? 14 : 0 }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, marginBottom: 8,
                        background: badge.bg, color: badge.color,
                      }}>
                        {badge.label}
                      </span>
                      <ul style={{ margin: 0, paddingLeft: 18, listStyle: "none" }}>
                        {section.items.map((item, j) => (
                          <li key={j} style={{ fontSize: 13, color: "#cbd5e1", padding: "4px 0", lineHeight: 1.6, position: "relative", paddingLeft: 14 }}>
                            <span style={{ position: "absolute", left: 0, top: "4px", color: "#0ea5e9" }}>•</span>
                            {item.pl}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 12 }}>
        © 2026 Studenckie Stowarzyszenie Kardiologiczne
      </footer>
    </div>
  );
}
