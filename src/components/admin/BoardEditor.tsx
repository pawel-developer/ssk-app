"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";
import ImageUploadWithResize, { type ImageUploadHandle } from "./ImageUploadWithResize";

interface TeamMember {
  name: string;
  role_pl?: string;
  role_en?: string;
  img: string;
}

interface CustomSection {
  id: string;
  title: string;
  showRole: boolean;
  members: TeamMember[];
}

const EMPTY_MEMBER: TeamMember = { name: "", role_pl: "", role_en: "", img: "" };

const DEFAULT_BOARD: TeamMember[] = [
  { name: "Adrian Bednarek", role_pl: "Prezes Zarządu Głównego", role_en: "President", img: "team-adrian" },
  { name: "lek. Paweł Siuciak", role_pl: "Zastępca Prezesa", role_en: "Vice President", img: "team-pawel" },
  { name: "lek. Marta Mazur", role_pl: "Sekretarz", role_en: "Secretary", img: "team-marta-m" },
  { name: "lek. Marta Chamera", role_pl: "Skarbnik", role_en: "Treasurer", img: "team-marta-c" },
  { name: "lek. Patryk Pindlowski", role_pl: "Członek Zarządu", role_en: "Board Member", img: "team-patryk" },
  { name: "Emil Brociek", role_pl: "Członek Zarządu", role_en: "Board Member", img: "team-emil" },
  { name: "Aniela Zaboklicka", role_pl: "Członek Zarządu", role_en: "Board Member", img: "team-aniela" },
  { name: "Natan Adamów", role_pl: "Członek Zarządu", role_en: "Board Member", img: "team-natan" },
];

const DEFAULT_AUDIT: TeamMember[] = [
  { name: "lek. Alicja Skrobucha", role_pl: "Przewodnicząca Komisji Rewizyjnej", role_en: "Chair of Audit Committee", img: "team-alicja" },
  { name: "lek. Olga Wiśniewska", role_pl: "Członek Komisji Rewizyjnej", role_en: "Audit Committee Member", img: "team-olga" },
  { name: "lek. Magdalena Synak", role_pl: "Członek Komisji Rewizyjnej", role_en: "Audit Committee Member", img: "team-magdalena" },
];

const DEFAULT_ADVISORS: TeamMember[] = [
  { name: "Prof. Miłosz Jaguszewski", img: "advisor-jaguszewski" },
  { name: "Prof. Mariusz Tomaniak", img: "advisor-tomaniak" },
  { name: "Prof. Paweł Balsam", img: "advisor-balsam" },
  { name: "Prof. Piotr Buszman", img: "advisor-buszman" },
  { name: "Prof. Paweł Gąsior", img: "advisor-gasior" },
  { name: "Prof. Marcin Grabowski", img: "advisor-grabowski" },
];

function resolveImg(img: string): string {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) return img;
  return `/img/${img}.webp`;
}

const s = {
  card: { background: "#fff", borderRadius: 10, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,.06)", marginBottom: 12 },
  groupTitle: { fontSize: 14, fontWeight: 700 as const, color: "#0f172a", marginBottom: 10 },
  membersGrid: { display: "grid" as const, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 },
  input: { padding: "3px 6px", border: "1px solid #e2e8f0", borderRadius: 4, fontSize: 11, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" as const },
  btn: (bg: string, color: string) => ({ padding: "4px 10px", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600 as const, cursor: "pointer", background: bg, color, transition: "all .15s" }),
  label: { fontSize: 9, color: "#94a3b8", fontWeight: 600 as const, display: "block", marginBottom: 0 },
};

function MemberRow({ m, onChange, onRemove, onMoveUp, onMoveDown, showRole, isFirst, isLast }: {
  m: TeamMember; onChange: (m: TeamMember) => void; onRemove: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
  showRole: boolean; isFirst: boolean; isLast: boolean;
}) {
  const imgSrc = resolveImg(m.img);
  const uploadRef = useRef<ImageUploadHandle>(null);
  const suggestedName = m.name
    ? m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 8, background: "#f8fafc", borderRadius: 6, gap: 4, minWidth: 0 }}>
      {/* Photo + Zmień/Przytnij */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <div
          onClick={() => imgSrc && uploadRef.current?.openCropper()}
          title={imgSrc ? "Kliknij, aby przyciąć" : undefined}
          style={{
            width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
            background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid #e2e8f0", cursor: imgSrc ? "pointer" : "default",
            transition: "border-color .15s",
          }}
          onMouseEnter={(e) => { if (imgSrc) (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; }}
        >
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc} alt={m.name || "foto"} style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <span style={{ fontSize: 28, color: "#94a3b8" }}>👤</span>
          )}
        </div>
        <ImageUploadWithResize
          ref={uploadRef}
          value={m.img}
          onChange={(path) => onChange({ ...m, img: path })}
          suggestedName={suggestedName ? `team-${suggestedName}` : undefined}
          outputWidth={400}
          outputHeight={400}
          cropShape="round"
          showPreview={false}
          compact
        />
      </div>
      <div style={{ marginTop: 2 }}>
        <span style={s.label}>Imię i nazwisko</span>
        <input style={s.input} value={m.name} onChange={(e) => onChange({ ...m, name: e.target.value })} placeholder="Jan Kowalski" />
      </div>
      {showRole && (
        <>
          <div>
            <span style={s.label}>Rola (PL)</span>
            <input style={s.input} value={m.role_pl || ""} onChange={(e) => onChange({ ...m, role_pl: e.target.value })} placeholder="Prezes" />
          </div>
          <div>
            <span style={s.label}>Rola (EN)</span>
            <input style={s.input} value={m.role_en || ""} onChange={(e) => onChange({ ...m, role_en: e.target.value })} placeholder="President" />
          </div>
        </>
      )}
      <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", marginTop: 2 }}>
        <button data-tip="W górę" onClick={onMoveUp} disabled={isFirst} style={{ ...s.btn(isFirst ? "#f1f5f9" : "#e2e8f0", isFirst ? "#cbd5e1" : "#475569"), padding: "2px 6px", fontSize: 11 }}>↑</button>
        <button data-tip="W dół" onClick={onMoveDown} disabled={isLast} style={{ ...s.btn(isLast ? "#f1f5f9" : "#e2e8f0", isLast ? "#cbd5e1" : "#475569"), padding: "2px 6px", fontSize: 11 }}>↓</button>
        <button data-tip="Usuń" onClick={onRemove} style={{ ...s.btn("#fee2e2", "#dc2626"), padding: "2px 6px", fontSize: 11 }}>✕</button>
      </div>
    </div>
  );
}

function TeamGroup({ title, contentKey, members, setMembers, showRole, editable, onRename, onRemove, onToggleRole }: {
  title: string; contentKey: string; members: TeamMember[];
  setMembers: (key: string, val: TeamMember[]) => void; showRole: boolean;
  editable?: boolean; onRename?: (name: string) => void; onRemove?: () => void; onToggleRole?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const swap = (i: number, j: number) => {
    const arr = [...members];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setMembers(contentKey, arr);
  };
  return (
    <div style={s.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {editing && editable ? (
          <input autoFocus style={{ ...s.input, fontSize: 14, fontWeight: 700, padding: "4px 8px", maxWidth: 300 }} value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => { if (draft.trim()) onRename?.(draft.trim()); setEditing(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") { if (draft.trim()) onRename?.(draft.trim()); setEditing(false); } }}
          />
        ) : (
          <h3 style={{ ...s.groupTitle, marginBottom: 0, cursor: editable ? "pointer" : "default" }}
            onClick={() => { if (editable) { setDraft(title); setEditing(true); } }}
            title={editable ? "Kliknij aby zmienić nazwę" : undefined}
          >{title}</h3>
        )}
        {editable && (
          <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
            <button data-tip="Pokaż/ukryj role" onClick={onToggleRole} style={{ ...s.btn("#f1f5f9", "#475569"), padding: "2px 8px", fontSize: 10 }}>
              {showRole ? "Ukryj role" : "Pokaż role"}
            </button>
            <button data-tip="Usuń sekcję" onClick={onRemove} style={{ ...s.btn("#fee2e2", "#dc2626"), padding: "2px 8px", fontSize: 10 }}>Usuń sekcję</button>
          </div>
        )}
      </div>
      <div style={s.membersGrid}>
        {members.map((m, i) => (
          <MemberRow key={i} m={m} showRole={showRole} isFirst={i === 0} isLast={i === members.length - 1}
            onChange={(updated) => { const arr = [...members]; arr[i] = updated; setMembers(contentKey, arr); }}
            onRemove={() => setMembers(contentKey, members.filter((_, j) => j !== i))}
            onMoveUp={() => swap(i, i - 1)} onMoveDown={() => swap(i, i + 1)}
          />
        ))}
      </div>
      <button data-tip="Dodaj osobę" onClick={() => setMembers(contentKey, [...members, { ...EMPTY_MEMBER }])} style={{ ...s.btn("#e0f2fe", "#0369a1"), marginTop: 8 }}>
        + Dodaj osobę
      </button>
    </div>
  );
}

export default function BoardEditor() {
  const supabase = createClient();
  const [board, setBoard] = useState<TeamMember[]>(DEFAULT_BOARD);
  const [audit, setAudit] = useState<TeamMember[]>(DEFAULT_AUDIT);
  const [advisors, setAdvisors] = useState<TeamMember[]>(DEFAULT_ADVISORS);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [newSectionName, setNewSectionName] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", ["team_board", "team_audit", "team_advisors", "team_custom_sections"]);
    if (data && data.length > 0) {
      data.forEach((row) => {
        if (row.id === "team_custom_sections") {
          setCustomSections(row.content as CustomSection[]);
          return;
        }
        const arr = row.content as TeamMember[];
        if (row.id === "team_board" && arr.length > 0) setBoard(arr);
        if (row.id === "team_audit" && arr.length > 0) setAudit(arr);
        if (row.id === "team_advisors" && arr.length > 0) setAdvisors(arr);
      });
    }
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const setMembers = (key: string, val: TeamMember[]) => {
    if (key === "team_board") setBoard(val);
    else if (key === "team_audit") setAudit(val);
    else if (key === "team_advisors") setAdvisors(val);
    else {
      setCustomSections((prev) => prev.map((sec) => sec.id === key ? { ...sec, members: val } : sec));
    }
  };

  const addCustomSection = () => {
    const name = newSectionName.trim();
    if (!name) return;
    const id = "custom_" + Date.now();
    setCustomSections((prev) => [...prev, { id, title: name, showRole: true, members: [{ ...EMPTY_MEMBER }] }]);
    setNewSectionName("");
  };

  const removeCustomSection = (id: string) => {
    setCustomSections((prev) => prev.filter((sec) => sec.id !== id));
  };

  const renameCustomSection = (id: string, title: string) => {
    setCustomSections((prev) => prev.map((sec) => sec.id === id ? { ...sec, title } : sec));
  };

  const toggleCustomSectionRole = (id: string) => {
    setCustomSections((prev) => prev.map((sec) => sec.id === id ? { ...sec, showRole: !sec.showRole } : sec));
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    const updates = [
      { id: "team_board", content: board },
      { id: "team_audit", content: audit },
      { id: "team_advisors", content: advisors },
      { id: "team_custom_sections", content: customSections },
    ];
    for (const u of updates) {
      const { error } = await supabase.from("site_content").upsert({ id: u.id, content: u.content });
      if (error) { setMsg("Błąd: " + error.message); setSaving(false); return; }
    }
    setMsg("Zapisano!");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div style={{ padding: "0 24px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <p style={{ color: "#64748b", fontSize: 13 }}>Edytuj członków zarządu, komisji rewizyjnej i opiekunów. Kliknij &quot;Zmień&quot; aby przesłać zdjęcie.</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("Błąd") ? "#dc2626" : "#16a34a", fontWeight: 600 }}>{msg}</span>}
          <button data-tip="Zapisz" onClick={save} disabled={saving} style={s.btn("#16a34a", "#fff")}>
            {saving ? "Zapisywanie..." : "Zapisz wszystko"}
          </button>
        </div>
      </div>

      <TeamGroup title="Zarząd Główny" contentKey="team_board" members={board} setMembers={setMembers} showRole />
      <TeamGroup title="Komisja Rewizyjna" contentKey="team_audit" members={audit} setMembers={setMembers} showRole />
      <TeamGroup title="Opiekunowie merytoryczni" contentKey="team_advisors" members={advisors} setMembers={setMembers} showRole={false} />

      {customSections.map((sec) => (
        <TeamGroup
          key={sec.id}
          title={sec.title}
          contentKey={sec.id}
          members={sec.members}
          setMembers={setMembers}
          showRole={sec.showRole}
          editable
          onRename={(name) => renameCustomSection(sec.id, name)}
          onRemove={() => removeCustomSection(sec.id)}
          onToggleRole={() => toggleCustomSectionRole(sec.id)}
        />
      ))}

      <div style={{ ...s.card, display: "flex", alignItems: "center", gap: 8, padding: 12 }}>
        <input
          style={{ ...s.input, maxWidth: 280, fontSize: 13, padding: "6px 10px" }}
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          placeholder="Nazwa nowej sekcji, np. Koordynatorzy"
          onKeyDown={(e) => { if (e.key === "Enter") addCustomSection(); }}
        />
        <button data-tip="Nowa sekcja" onClick={addCustomSection} disabled={!newSectionName.trim()} style={s.btn("#7c3aed", "#fff")}>
          + Dodaj sekcję
        </button>
      </div>
    </div>
  );
}
