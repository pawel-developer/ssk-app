"use client";

import { useEffect, useState, useCallback } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_published: boolean;
  sort_order: number;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  is_published: boolean;
  sort_order: number;
}

interface VideoClip {
  id?: string;
  material_id?: string;
  title: string;
  youtube_url: string;
  youtube_id: string;
  duration: string;
  sort_order: number;
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
  sort_order: number;
}

type ModalMode = "create_category" | "edit_category" | "create_subcategory" | "edit_subcategory" | "create_material" | "edit_material" | null;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ąà]/g, "a").replace(/[ćč]/g, "c").replace(/[ęè]/g, "e")
    .replace(/[łl]/g, "l").replace(/[ńñ]/g, "n").replace(/[óò]/g, "o")
    .replace(/[śš]/g, "s").replace(/[źżž]/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractYoutubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return "";
}

const st = {
  btn: (bg: string, color: string) => ({
    padding: "8px 16px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600 as const,
    cursor: "pointer", background: bg, color, fontFamily: "inherit", transition: "opacity .15s",
  }),
  input: {
    width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8,
    fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const,
  },
  label: {
    display: "block" as const, fontWeight: 600 as const, fontSize: 13, marginBottom: 4, color: "#1e293b",
  },
};

export default function EducationEditor() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [videos, setVideos] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formVideos, setFormVideos] = useState<VideoClip[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/education");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
        setSubcategories(data.subcategories || []);
        setMaterials(data.materials || []);
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.error("Failed to load education data:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const apiAction = async (action: string, payload: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Błąd: " + (data.error || "Nieznany błąd"));
        setSaving(false);
        return null;
      }
      await loadData();
      setSaving(false);
      return data;
    } catch (err) {
      alert("Błąd sieci: " + (err instanceof Error ? err.message : "Nieznany"));
      setSaving(false);
      return null;
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormTitle("");
    setFormNotes("");
    setFormAuthor("");
    setFormTags("");
    setFormVideos([]);
    setEditingId(null);
  };

  const openModal = (mode: ModalMode) => {
    resetForm();
    setModalMode(mode);
  };

  const closeModal = () => {
    setModalMode(null);
    resetForm();
  };

  const openEditCategory = (cat: Category) => {
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || "");
    setEditingId(cat.id);
    setModalMode("edit_category");
  };

  const openEditSubcategory = (sub: Subcategory) => {
    setFormName(sub.name);
    setFormSlug(sub.slug);
    setFormDescription(sub.description || "");
    setEditingId(sub.id);
    setModalMode("edit_subcategory");
  };

  const togglePublish = async (type: "category" | "subcategory" | "material", id: string, currentlyPublished: boolean) => {
    const action = type === "category" ? "update_category"
      : type === "subcategory" ? "update_subcategory"
      : "update_material";
    const item = type === "category" ? categories.find((c) => c.id === id)
      : type === "subcategory" ? subcategories.find((s) => s.id === id)
      : materials.find((m) => m.id === id);
    if (!item) return;

    const payload: Record<string, unknown> = { id, is_published: !currentlyPublished };
    if (type === "category") {
      const cat = item as Category;
      payload.name = cat.name;
      payload.slug = cat.slug;
    } else if (type === "subcategory") {
      const sub = item as Subcategory;
      payload.name = sub.name;
      payload.slug = sub.slug;
    } else {
      const mat = item as Material;
      payload.title = mat.title;
      const matVids = videos.filter((v) => v.material_id === id);
      payload.videos = matVids.map((v) => ({
        title: v.title, youtube_url: v.youtube_url, youtube_id: v.youtube_id, duration: v.duration,
      }));
    }
    await apiAction(action, payload);
  };

  const openEditMaterial = (mat: Material) => {
    setFormTitle(mat.title);
    setFormDescription(mat.description || "");
    setFormNotes(mat.notes || "");
    setFormAuthor(mat.author || "");
    setFormTags((mat.tags || []).join(", "));
    setEditingId(mat.id);
    const materialVideos = videos
      .filter((v) => v.material_id === mat.id)
      .sort((a, b) => a.sort_order - b.sort_order);
    setFormVideos(materialVideos);
    setModalMode("edit_material");
  };

  const handleSaveCategory = async () => {
    if (!formName.trim()) { alert("Nazwa jest wymagana"); return; }
    const slug = formSlug.trim() || slugify(formName);
    if (modalMode === "create_category") {
      await apiAction("create_category", { name: formName.trim(), slug, description: formDescription.trim() || null });
    } else {
      await apiAction("update_category", { id: editingId, name: formName.trim(), slug, description: formDescription.trim() || null });
    }
    closeModal();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Usunąć kategorię i wszystkie materiały w niej? To działanie jest nieodwracalne.")) return;
    await apiAction("delete_category", { id });
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
      setSelectedSubcategoryId(null);
    }
  };

  const handleSaveSubcategory = async () => {
    if (!formName.trim()) { alert("Nazwa jest wymagana"); return; }
    const slug = formSlug.trim() || slugify(formName);
    if (modalMode === "create_subcategory") {
      await apiAction("create_subcategory", { category_id: selectedCategoryId, name: formName.trim(), slug, description: formDescription.trim() || null });
    } else {
      await apiAction("update_subcategory", { id: editingId, name: formName.trim(), slug, description: formDescription.trim() || null });
    }
    closeModal();
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm("Usunąć podkategorię i wszystkie materiały? To działanie jest nieodwracalne.")) return;
    await apiAction("delete_subcategory", { id });
    if (selectedSubcategoryId === id) setSelectedSubcategoryId(null);
  };

  const addVideoSlot = () => {
    setFormVideos([...formVideos, { title: "", youtube_url: "", youtube_id: "", duration: "", sort_order: formVideos.length }]);
  };

  const updateVideoSlot = (index: number, field: keyof VideoClip, value: string) => {
    const updated = [...formVideos];
    if (field === "youtube_url") {
      updated[index] = { ...updated[index], youtube_url: value, youtube_id: extractYoutubeId(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setFormVideos(updated);
  };

  const removeVideoSlot = (index: number) => {
    setFormVideos(formVideos.filter((_, i) => i !== index));
  };

  const handleSaveMaterial = async () => {
    if (!formTitle.trim()) { alert("Tytuł jest wymagany"); return; }
    const validVideos = formVideos.filter((v) => v.youtube_url.trim() && v.youtube_id);
    if (validVideos.length === 0) { alert("Dodaj przynajmniej jeden film z poprawnym linkiem YouTube"); return; }

    const vids = validVideos.map((v, i) => ({
      title: v.title.trim() || `Film ${i + 1}`,
      youtube_url: v.youtube_url.trim(),
      youtube_id: v.youtube_id,
      duration: v.duration.trim() || null,
    }));

    const tags = formTags.split(",").map((t) => t.trim()).filter(Boolean);

    if (modalMode === "create_material") {
      await apiAction("create_material", {
        subcategory_id: selectedSubcategoryId,
        title: formTitle.trim(),
        description: formDescription.trim() || null,
        notes: formNotes.trim() || null,
        author: formAuthor.trim() || null,
        tags,
        videos: vids,
      });
    } else {
      await apiAction("update_material", {
        id: editingId,
        title: formTitle.trim(),
        description: formDescription.trim() || null,
        notes: formNotes.trim() || null,
        author: formAuthor.trim() || null,
        tags,
        videos: vids,
      });
    }
    closeModal();
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm("Usunąć materiał i powiązane filmy?")) return;
    await apiAction("delete_material", { id });
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const categorySubcategories = subcategories.filter((s) => s.category_id === selectedCategoryId);
  const selectedSubcategory = subcategories.find((s) => s.id === selectedSubcategoryId);
  const subcategoryMaterials = materials.filter((m) => m.subcategory_id === selectedSubcategoryId);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p style={{ color: "#94a3b8" }}>Ładowanie materiałów edukacyjnych...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 24px 24px" }}>
      {/* Breadcrumb navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button
          onClick={() => { setSelectedCategoryId(null); setSelectedSubcategoryId(null); }}
          style={{
            ...st.btn(selectedCategoryId ? "rgba(255,255,255,.08)" : "#dc2626", selectedCategoryId ? "#cbd5e1" : "#fff"),
            border: selectedCategoryId ? "1px solid rgba(255,255,255,.12)" : "none",
          }}
        >
          Kategorie
        </button>
        {selectedCategory && (
          <>
            <span style={{ color: "#64748b", fontSize: 14 }}>/</span>
            <button
              onClick={() => setSelectedSubcategoryId(null)}
              style={{
                ...st.btn(selectedSubcategoryId ? "rgba(255,255,255,.08)" : "#0369a1", selectedSubcategoryId ? "#cbd5e1" : "#fff"),
                border: selectedSubcategoryId ? "1px solid rgba(255,255,255,.12)" : "none",
              }}
            >
              {selectedCategory.name}
            </button>
          </>
        )}
        {selectedSubcategory && (
          <>
            <span style={{ color: "#64748b", fontSize: 14 }}>/</span>
            <button style={st.btn("#0369a1", "#fff")} disabled>
              {selectedSubcategory.name}
            </button>
          </>
        )}
      </div>

      {/* ====== LEVEL 1: Categories ====== */}
      {!selectedCategoryId && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "#fff", fontSize: 18, margin: 0 }}>
              Kategorie ({categories.length})
            </h3>
            <button onClick={() => openModal("create_category")} style={st.btn("#16a34a", "#fff")}>
              + Dodaj kategorię
            </button>
          </div>
          {categories.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center" }}>
              <p style={{ color: "#94a3b8", fontSize: 16 }}>Brak kategorii. Dodaj pierwszą kategorię, np. &quot;EKG&quot; lub &quot;ECHO&quot;.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {categories.map((cat) => {
                const subCount = subcategories.filter((s) => s.category_id === cat.id).length;
                const matCount = materials.filter((m) =>
                  subcategories.filter((s) => s.category_id === cat.id).some((s) => s.id === m.subcategory_id)
                ).length;
                return (
                  <div
                    key={cat.id}
                    style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,.12)", cursor: "pointer", transition: "transform .15s" }}
                    onClick={() => { setSelectedCategoryId(cat.id); setSelectedSubcategoryId(null); }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <h4 style={{ margin: 0, fontSize: 16, color: "#0f172a" }}>{cat.name}</h4>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 700, background: cat.is_published ? "#dcfce7" : "#fee2e2", color: cat.is_published ? "#16a34a" : "#dc2626" }}>
                            {cat.is_published ? "Opublikowana" : "Ukryta"}
                          </span>
                        </div>
                        {cat.description && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{cat.description}</p>}
                        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#94a3b8" }}>
                          {subCount} podkategorii · {matCount} materiałów
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => togglePublish("category", cat.id, cat.is_published)} style={st.btn(cat.is_published ? "#fef3c7" : "#dcfce7", cat.is_published ? "#92400e" : "#16a34a")}>
                          {cat.is_published ? "Ukryj" : "Opublikuj"}
                        </button>
                        <button onClick={() => openEditCategory(cat)} style={st.btn("#e2e8f0", "#475569")}>Edytuj</button>
                        <button onClick={() => handleDeleteCategory(cat.id)} style={st.btn("#fee2e2", "#dc2626")}>Usuń</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ====== LEVEL 2: Subcategories ====== */}
      {selectedCategoryId && !selectedSubcategoryId && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "#fff", fontSize: 18, margin: 0 }}>
              Podkategorie w &quot;{selectedCategory?.name}&quot; ({categorySubcategories.length})
            </h3>
            <button onClick={() => openModal("create_subcategory")} style={st.btn("#16a34a", "#fff")}>
              + Dodaj podkategorię
            </button>
          </div>
          {categorySubcategories.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center" }}>
              <p style={{ color: "#94a3b8", fontSize: 16 }}>Brak podkategorii. Dodaj pierwszą, np. &quot;Arytmie&quot; lub &quot;Zastawka aortalna&quot;.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {categorySubcategories.map((sub) => {
                const matCount = materials.filter((m) => m.subcategory_id === sub.id).length;
                return (
                  <div
                    key={sub.id}
                    style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,.12)", cursor: "pointer" }}
                    onClick={() => setSelectedSubcategoryId(sub.id)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <h4 style={{ margin: 0, fontSize: 16, color: "#0f172a" }}>{sub.name}</h4>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 700, background: sub.is_published ? "#dcfce7" : "#fee2e2", color: sub.is_published ? "#16a34a" : "#dc2626" }}>
                            {sub.is_published ? "Opublikowana" : "Ukryta"}
                          </span>
                        </div>
                        {sub.description && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{sub.description}</p>}
                        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#94a3b8" }}>{matCount} materiałów</p>
                      </div>
                      <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => togglePublish("subcategory", sub.id, sub.is_published)} style={st.btn(sub.is_published ? "#fef3c7" : "#dcfce7", sub.is_published ? "#92400e" : "#16a34a")}>
                          {sub.is_published ? "Ukryj" : "Opublikuj"}
                        </button>
                        <button onClick={() => openEditSubcategory(sub)} style={st.btn("#e2e8f0", "#475569")}>Edytuj</button>
                        <button onClick={() => handleDeleteSubcategory(sub.id)} style={st.btn("#fee2e2", "#dc2626")}>Usuń</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ====== LEVEL 3: Materials ====== */}
      {selectedSubcategoryId && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "#fff", fontSize: 18, margin: 0 }}>
              Materiały w &quot;{selectedSubcategory?.name}&quot; ({subcategoryMaterials.length})
            </h3>
            <button onClick={() => { openModal("create_material"); addVideoSlot(); }} style={st.btn("#16a34a", "#fff")}>
              + Dodaj materiał
            </button>
          </div>
          {subcategoryMaterials.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center" }}>
              <p style={{ color: "#94a3b8", fontSize: 16 }}>Brak materiałów. Dodaj pierwszy film lub przypadek kliniczny.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {subcategoryMaterials.map((mat) => {
                const matVideos = (videos as (VideoClip & { material_id?: string })[]).filter((v) => v.material_id === mat.id);
                return (
                  <div key={mat.id} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,.12)", display: "flex", gap: 16, alignItems: "flex-start" }}>
                    {mat.thumbnail_url && (
                      <img
                        src={mat.thumbnail_url}
                        alt={mat.title}
                        style={{ width: 160, height: 90, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: "0 0 4px", fontSize: 15, color: "#0f172a" }}>{mat.title}</h4>
                      {mat.author && <p style={{ margin: 0, fontSize: 13, color: "#0369a1" }}>{mat.author}</p>}
                      {mat.description && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>{mat.description}</p>}
                      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{matVideos.length} {matVideos.length === 1 ? "film" : "filmów"}</span>
                        {mat.notes && <span style={{ fontSize: 11, padding: "2px 6px", background: "#dbeafe", color: "#1d4ed8", borderRadius: 4, fontWeight: 600 }}>Notatki</span>}
                        {mat.tags?.map((tag) => (
                          <span key={tag} style={{ fontSize: 11, padding: "2px 6px", background: "#f1f5f9", color: "#64748b", borderRadius: 4 }}>{tag}</span>
                        ))}
                        <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, fontWeight: 600, background: mat.is_published ? "#dcfce7" : "#fee2e2", color: mat.is_published ? "#16a34a" : "#dc2626" }}>
                          {mat.is_published ? "Opublikowany" : "Ukryty"}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0, flexDirection: "column" }}>
                      <button onClick={() => togglePublish("material", mat.id, mat.is_published)} style={st.btn(mat.is_published ? "#fef3c7" : "#dcfce7", mat.is_published ? "#92400e" : "#16a34a")}>
                        {mat.is_published ? "Ukryj" : "Opublikuj"}
                      </button>
                      <button onClick={() => openEditMaterial(mat)} style={st.btn("#e2e8f0", "#475569")}>Edytuj</button>
                      <button onClick={() => handleDeleteMaterial(mat.id)} style={st.btn("#fee2e2", "#dc2626")}>Usuń</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ====== MODAL ====== */}
      {modalMode && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 16px", overflowY: "auto" }} onClick={closeModal}>
          <div style={{ background: "#fff", borderRadius: 16, maxWidth: 640, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>
                {modalMode === "create_category" && "Nowa kategoria"}
                {modalMode === "edit_category" && "Edytuj kategorię"}
                {modalMode === "create_subcategory" && "Nowa podkategoria"}
                {modalMode === "edit_subcategory" && "Edytuj podkategorię"}
                {modalMode === "create_material" && "Nowy materiał"}
                {modalMode === "edit_material" && "Edytuj materiał"}
              </h3>
            </div>

            <div style={{ padding: "16px 24px", overflowY: "auto", flex: 1 }}>
              {/* Category / Subcategory form */}
              {(modalMode.includes("category")) && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={st.label}>Nazwa *</label>
                    <input
                      style={st.input}
                      value={formName}
                      onChange={(e) => { setFormName(e.target.value); if (!editingId) setFormSlug(slugify(e.target.value)); }}
                      placeholder="np. EKG, ECHO, Farmakologia..."
                    />
                  </div>
                  <div>
                    <label style={st.label}>Slug (URL)</label>
                    <input style={st.input} value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="auto-generowany" />
                  </div>
                  <div>
                    <label style={st.label}>Opis (opcjonalny)</label>
                    <textarea
                      style={{ ...st.input, minHeight: 80, resize: "vertical" as const }}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Krótki opis kategorii..."
                    />
                  </div>
                </div>
              )}

              {/* Material form */}
              {(modalMode === "create_material" || modalMode === "edit_material") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={st.label}>Tytuł *</label>
                    <input style={st.input} value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="np. Podstawy interpretacji EKG..." />
                  </div>
                  <div>
                    <label style={st.label}>Krótki opis</label>
                    <textarea
                      style={{ ...st.input, minHeight: 60, resize: "vertical" as const }}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Widoczny na liście materiałów..."
                    />
                  </div>
                  <div>
                    <label style={st.label}>Autor / prowadzący</label>
                    <input style={st.input} value={formAuthor} onChange={(e) => setFormAuthor(e.target.value)} placeholder="np. Prof. Kowalski" />
                  </div>
                  <div>
                    <label style={st.label}>Tagi (oddzielone przecinkiem)</label>
                    <input style={st.input} value={formTags} onChange={(e) => setFormTags(e.target.value)} placeholder="np. case, beginner, ESC2025" />
                  </div>

                  {/* Videos */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <label style={{ ...st.label, marginBottom: 0 }}>Filmy *</label>
                      <button onClick={addVideoSlot} style={st.btn("#dbeafe", "#1d4ed8")} type="button">+ Dodaj film</button>
                    </div>
                    {formVideos.map((v, i) => (
                      <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: 12, marginBottom: 8, position: "relative" }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                          <div style={{ flex: 1 }}>
                            <input
                              style={{ ...st.input, fontSize: 13 }}
                              value={v.title}
                              onChange={(e) => updateVideoSlot(i, "title", e.target.value)}
                              placeholder={`Tytuł klipu ${i + 1}`}
                            />
                          </div>
                          <div style={{ width: 80 }}>
                            <input
                              style={{ ...st.input, fontSize: 13 }}
                              value={v.duration}
                              onChange={(e) => updateVideoSlot(i, "duration", e.target.value)}
                              placeholder="12:34"
                            />
                          </div>
                          <button onClick={() => removeVideoSlot(i)} style={{ ...st.btn("#fee2e2", "#dc2626"), padding: "6px 10px" }} type="button">
                            X
                          </button>
                        </div>
                        <input
                          style={{ ...st.input, fontSize: 13 }}
                          value={v.youtube_url}
                          onChange={(e) => updateVideoSlot(i, "youtube_url", e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... lub https://youtu.be/..."
                        />
                        {v.youtube_id && (
                          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                            <img
                              src={`https://img.youtube.com/vi/${v.youtube_id}/default.jpg`}
                              alt="thumbnail"
                              style={{ width: 60, height: 45, objectFit: "cover", borderRadius: 4 }}
                            />
                            <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>ID: {v.youtube_id}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Notes (optional) */}
                  <div>
                    <label style={st.label}>Notatki / opis przypadku (opcjonalne, Markdown)</label>
                    <textarea
                      style={{ ...st.input, minHeight: 120, resize: "vertical" as const, fontFamily: "monospace", fontSize: 13 }}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder={"Kluczowe parametry:\n- AVA 0.7 cm²\n- Mean PG 48 mmHg\n\nWnioski:\n1. Klasyczna triada objawów...\n2. Kryteria ESC 2024..."}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", padding: "16px 24px", borderTop: "1px solid #e2e8f0" }}>
              <button onClick={closeModal} style={st.btn("#e2e8f0", "#475569")}>Anuluj</button>
              <button
                onClick={() => {
                  if (modalMode === "create_subcategory" || modalMode === "edit_subcategory") handleSaveSubcategory();
                  else if (modalMode?.includes("category")) handleSaveCategory();
                  else if (modalMode?.includes("material")) handleSaveMaterial();
                }}
                disabled={saving}
                style={st.btn("#16a34a", "#fff")}
              >
                {saving ? "Zapisywanie..." : "Zapisz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
