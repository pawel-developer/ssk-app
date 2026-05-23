"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";
import Link from "next/link";

export default function EducationPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
        <p style={{ color: "#94a3b8" }}>Ładowanie materiałów...</p>
      </div>
    }>
      <EducationBrowse />
    </Suspense>
  );
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_published: boolean;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  is_published: boolean;
}

interface Material {
  id: string;
  subcategory_id: string;
  title: string;
  description: string | null;
  notes: string | null;
  author: string | null;
  tags: string[];
  thumbnail_url: string | null;
  is_published: boolean;
}

interface VideoClip {
  id: string;
  material_id: string;
  title: string;
  youtube_url: string;
  youtube_id: string;
  duration: string | null;
  sort_order: number;
}

function EducationBrowse() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [videos, setVideos] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    try {
      const res = await fetch("/api/education");
      if (res.ok) {
        const data = await res.json();
        setCategories((data.categories || []).filter((c: Category) => c.is_published));
        setSubcategories((data.subcategories || []).filter((s: Subcategory) => s.is_published));
        setMaterials((data.materials || []).filter((m: Material) => m.is_published));
        setVideos(data.videos || []);
      }
    } catch {
      // Non-critical
    }
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const catSlug = searchParams.get("category");
    if (catSlug) setSelectedCategorySlug(catSlug);
  }, [searchParams]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const selectedCategory = categories.find((c) => c.slug === selectedCategorySlug);
  const catSubcategories = selectedCategory
    ? subcategories.filter((s) => s.category_id === selectedCategory.id)
    : [];
  const selectedSubcategory = subcategories.find((s) => s.id === selectedSubcategoryId);
  const subMaterials = selectedSubcategoryId
    ? materials.filter((m) => m.subcategory_id === selectedSubcategoryId)
    : [];
  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId);
  const materialVideos = selectedMaterial
    ? videos.filter((v) => v.material_id === selectedMaterial.id).sort((a, b) => a.sort_order - b.sort_order)
    : [];
  const activeVideo = materialVideos.find((v) => v.id === activeVideoId) || materialVideos[0];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
        <p style={{ color: "#94a3b8" }}>Ładowanie materiałów...</p>
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
          <h1 style={{ fontSize: 20, color: "#fff", margin: 0 }}>Materiały edukacyjne</h1>
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

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px", flex: 1, width: "100%" }}>
        {/* ====== MATERIAL DETAIL VIEW ====== */}
        {selectedMaterial ? (
          <div>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              <button onClick={() => { setSelectedMaterialId(null); setActiveVideoId(null); }} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>
                ← Wróć
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: selectedMaterial.notes ? "1fr 360px" : "1fr", gap: 24 }}>
              {/* Video player */}
              <div>
                {activeVideo && (
                  <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden", marginBottom: 16, background: "#000" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?rel=0`}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "#fff", margin: "0 0 8px" }}>
                  {selectedMaterial.title}
                </h2>
                {selectedMaterial.author && (
                  <p style={{ color: "#0ea5e9", fontSize: 14, margin: "0 0 8px" }}>{selectedMaterial.author}</p>
                )}
                {selectedMaterial.description && (
                  <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 16px", lineHeight: 1.6 }}>
                    {selectedMaterial.description}
                  </p>
                )}

                {/* Clip selector (if multiple) */}
                {materialVideos.length > 1 && (
                  <div style={{ marginTop: 8 }}>
                    <h4 style={{ color: "#cbd5e1", fontSize: 14, fontWeight: 600, margin: "0 0 10px" }}>
                      Klipy ({materialVideos.length})
                    </h4>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {materialVideos.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setActiveVideoId(v.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 10, padding: 10,
                            background: activeVideo?.id === v.id ? "rgba(14,165,233,.15)" : "rgba(255,255,255,.06)",
                            border: activeVideo?.id === v.id ? "2px solid #0ea5e9" : "2px solid rgba(255,255,255,.1)",
                            borderRadius: 10, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                            minWidth: 180,
                          }}
                        >
                          <img
                            src={`https://img.youtube.com/vi/${v.youtube_id}/default.jpg`}
                            alt={v.title}
                            style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
                          />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{v.title}</div>
                            {v.duration && <div style={{ fontSize: 11, color: "#94a3b8" }}>{v.duration}</div>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedMaterial.tags && selectedMaterial.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 16, flexWrap: "wrap" }}>
                    {selectedMaterial.tags.map((tag) => (
                      <span key={tag} style={{ padding: "4px 10px", background: "rgba(255,255,255,.08)", color: "#94a3b8", borderRadius: 6, fontSize: 12 }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes panel (right side) */}
              {selectedMaterial.notes && (
                <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 12, padding: 24, border: "1px solid rgba(255,255,255,.1)", alignSelf: "start", position: "sticky", top: 20 }}>
                  <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>📋</span> Notatki
                  </h3>
                  <div style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                    {selectedMaterial.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : selectedSubcategoryId ? (
          /* ====== MATERIALS LIST ====== */
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <button onClick={() => setSelectedSubcategoryId(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>
                ← {selectedCategory?.name || "Wróć"}
              </button>
              <span style={{ color: "#475569" }}>/</span>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{selectedSubcategory?.name}</span>
            </div>

            {subMaterials.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 12, padding: 40, textAlign: "center" }}>
                <p style={{ color: "#94a3b8", fontSize: 16 }}>Brak materiałów w tej podkategorii.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {subMaterials.map((mat) => {
                  const matVids = videos.filter((v) => v.material_id === mat.id);
                  const hasNotes = !!mat.notes;
                  const isRichCase = hasNotes || matVids.length > 1;
                  return (
                    <div
                      key={mat.id}
                      style={{
                        display: "flex", gap: 16, padding: 16, background: "rgba(255,255,255,.06)",
                        borderRadius: 12, cursor: "pointer", border: "1px solid rgba(255,255,255,.08)",
                        transition: "background .15s, border-color .15s",
                      }}
                      onClick={() => { setSelectedMaterialId(mat.id); setActiveVideoId(null); }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.15)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; }}
                    >
                      {mat.thumbnail_url ? (
                        <img src={mat.thumbnail_url} alt={mat.title} style={{ width: 180, height: 100, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 180, height: 100, background: "rgba(255,255,255,.1)", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 32, opacity: 0.5 }}>▶</span>
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>{isRichCase ? "📋" : "▶"}</span>
                          <div>
                            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>{mat.title}</h4>
                            {mat.author && <p style={{ margin: "2px 0 0", fontSize: 13, color: "#0ea5e9" }}>{mat.author}</p>}
                          </div>
                        </div>
                        {mat.description && (
                          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
                            {mat.description.length > 120 ? mat.description.slice(0, 120) + "..." : mat.description}
                          </p>
                        )}
                        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: 12, color: "#64748b" }}>
                            {matVids.length} {matVids.length === 1 ? "film" : "filmów"}
                          </span>
                          {hasNotes && (
                            <span style={{ fontSize: 11, padding: "2px 6px", background: "rgba(59,130,246,.2)", color: "#60a5fa", borderRadius: 4, fontWeight: 600 }}>
                              Notatki
                            </span>
                          )}
                          {mat.tags?.map((tag) => (
                            <span key={tag} style={{ fontSize: 11, padding: "2px 6px", background: "rgba(255,255,255,.08)", color: "#94a3b8", borderRadius: 4 }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : selectedCategorySlug && selectedCategory ? (
          /* ====== SUBCATEGORIES VIEW ====== */
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <button onClick={() => setSelectedCategorySlug(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>
                ← Wszystkie kategorie
              </button>
              <span style={{ color: "#475569" }}>/</span>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{selectedCategory.name}</span>
            </div>

            {selectedCategory.description && (
              <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>{selectedCategory.description}</p>
            )}

            {catSubcategories.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 12, padding: 40, textAlign: "center" }}>
                <p style={{ color: "#94a3b8", fontSize: 16 }}>Brak podkategorii w tej kategorii.</p>
              </div>
            ) : (
              <div>
                {catSubcategories.map((sub) => {
                  const subMats = materials.filter((m) => m.subcategory_id === sub.id);
                  if (subMats.length === 0) return null;
                  return (
                    <div key={sub.id} style={{ marginBottom: 32 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>{sub.name}</h3>
                        <button
                          onClick={() => setSelectedSubcategoryId(sub.id)}
                          style={{ background: "none", border: "none", color: "#0ea5e9", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                        >
                          Zobacz wszystkie →
                        </button>
                      </div>

                      {/* Horizontal scroll */}
                      <HorizontalScroll>
                        {subMats.map((mat) => {
                          const matVids = videos.filter((v) => v.material_id === mat.id);
                          return (
                            <div
                              key={mat.id}
                              style={{
                                minWidth: 260, maxWidth: 260, cursor: "pointer",
                                transition: "transform .2s",
                                flexShrink: 0,
                              }}
                              onClick={() => { setSelectedMaterialId(mat.id); setActiveVideoId(null); }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
                            >
                              <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 10, overflow: "hidden", marginBottom: 8, background: "rgba(255,255,255,.08)" }}>
                                {mat.thumbnail_url ? (
                                  <img
                                    src={mat.thumbnail_url}
                                    alt={mat.title}
                                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                ) : (
                                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: 36, opacity: 0.4 }}>▶</span>
                                  </div>
                                )}
                                {matVids.length > 1 && (
                                  <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.7)", color: "#fff", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                                    {matVids.length} klipów
                                  </div>
                                )}
                                {mat.notes && (
                                  <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(59,130,246,.8)", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                                    📋 Case
                                  </div>
                                )}
                              </div>
                              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                                {mat.title.length > 60 ? mat.title.slice(0, 60) + "..." : mat.title}
                              </h4>
                              {mat.author && (
                                <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b" }}>{mat.author}</p>
                              )}
                            </div>
                          );
                        })}
                      </HorizontalScroll>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ====== ALL CATEGORIES (HOME) ====== */
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "#fff", margin: "0 0 24px", textAlign: "center" }}>
              Przeglądaj materiały edukacyjne
            </h2>

            {categories.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 12, padding: 40, textAlign: "center" }}>
                <p style={{ color: "#94a3b8", fontSize: 16 }}>Materiały edukacyjne pojawią się wkrótce.</p>
              </div>
            ) : (
              <div>
                {categories.map((cat) => {
                  const catSubs = subcategories.filter((s) => s.category_id === cat.id);
                  const catMats = materials.filter((m) => catSubs.some((s) => s.id === m.subcategory_id));
                  if (catMats.length === 0) return null;

                  return (
                    <div key={cat.id} style={{ marginBottom: 36 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>{cat.name}</h3>
                        <button
                          onClick={() => setSelectedCategorySlug(cat.slug)}
                          style={{ background: "none", border: "none", color: "#0ea5e9", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                        >
                          Więcej →
                        </button>
                      </div>

                      <HorizontalScroll>
                        {catMats.slice(0, 10).map((mat) => {
                          const matVids = videos.filter((v) => v.material_id === mat.id);
                          return (
                            <div
                              key={mat.id}
                              style={{ minWidth: 260, maxWidth: 260, cursor: "pointer", transition: "transform .2s", flexShrink: 0 }}
                              onClick={() => { setSelectedCategorySlug(cat.slug); setSelectedMaterialId(mat.id); setActiveVideoId(null); }}
                              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
                            >
                              <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 10, overflow: "hidden", marginBottom: 8, background: "rgba(255,255,255,.08)" }}>
                                {mat.thumbnail_url ? (
                                  <img src={mat.thumbnail_url} alt={mat.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: 36, opacity: 0.4 }}>▶</span>
                                  </div>
                                )}
                                {matVids.length > 1 && (
                                  <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.7)", color: "#fff", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                                    {matVids.length} klipów
                                  </div>
                                )}
                              </div>
                              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                                {mat.title.length > 60 ? mat.title.slice(0, 60) + "..." : mat.title}
                              </h4>
                              {mat.author && <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b" }}>{mat.author}</p>}
                            </div>
                          );
                        })}
                      </HorizontalScroll>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <footer style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 12 }}>
        © 2026 Studenckie Stowarzyszenie Kardiologiczne
      </footer>
    </div>
  );
}

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, children]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative" }}>
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          style={{
            position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: "rgba(15,23,42,.8)", color: "#fff", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.3)",
          }}
        >
          ‹
        </button>
      )}
      <div
        ref={scrollRef}
        style={{
          display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          style={{
            position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: "rgba(15,23,42,.8)", color: "#fff", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.3)",
          }}
        >
          ›
        </button>
      )}
    </div>
  );
}
