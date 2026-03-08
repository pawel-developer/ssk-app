"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";

interface TeamMember {
  name: string;
  role_pl?: string;
  role_en?: string;
  img: string;
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
  card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)", marginBottom: 16 },
  groupTitle: { fontSize: 16, fontWeight: 700 as const, color: "#0f172a", marginBottom: 16 },
  row: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" as const },
  input: { padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", flex: 1, minWidth: 120 },
  btn: (bg: string, color: string) => ({ padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600 as const, cursor: "pointer", background: bg, color, transition: "all .15s" }),
  label: { fontSize: 11, color: "#94a3b8", fontWeight: 600 as const, display: "block", marginBottom: 2 },
};

function MemberRow({ m, onChange, onRemove, onMoveUp, onMoveDown, onUploadPhoto, showRole, isFirst, isLast, uploading }: {
  m: TeamMember; onChange: (m: TeamMember) => void; onRemove: () => void;
  onMoveUp: () => void; onMoveDown: () => void; onUploadPhoto: (file: File) => void;
  showRole: boolean; isFirst: boolean; isLast: boolean; uploading: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const imgSrc = resolveImg(m.img);

  return (
    <div style={{ ...s.row, padding: 12, background: "#f8fafc", borderRadius: 8 }}>
      {/* Photo preview + upload */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", overflow: "hidden",
          background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid #e2e8f0",
        }}>
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc} alt={m.name || "foto"} style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <span style={{ fontSize: 24, color: "#94a3b8" }}>👤</span>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadPhoto(f); e.target.value = ""; }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ ...s.btn("#e2e8f0", "#475569"), fontSize: 11, padding: "3px 8px" }}
        >
          {uploading ? "..." : "Zmień"}
        </button>
      </div>

      {/* Fields */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 140 }}>
            <span style={s.label}>Imię i nazwisko</span>
            <input style={s.input} value={m.name} onChange={(e) => onChange({ ...m, name: e.target.value })} placeholder="Jan Kowalski" />
          </div>
        </div>
        {showRole && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <span style={s.label}>Rola (PL)</span>
              <input style={s.input} value={m.role_pl || ""} onChange={(e) => onChange({ ...m, role_pl: e.target.value })} placeholder="Prezes" />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <span style={s.label}>Rola (EN)</span>
              <input style={s.input} value={m.role_en || ""} onChange={(e) => onChange({ ...m, role_en: e.target.value })} placeholder="President" />
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <button onClick={onMoveUp} disabled={isFirst} style={{ ...s.btn(isFirst ? "#f1f5f9" : "#e2e8f0", isFirst ? "#cbd5e1" : "#475569"), fontSize: 14, padding: "4px 8px" }}>↑</button>
        <button onClick={onMoveDown} disabled={isLast} style={{ ...s.btn(isLast ? "#f1f5f9" : "#e2e8f0", isLast ? "#cbd5e1" : "#475569"), fontSize: 14, padding: "4px 8px" }}>↓</button>
        <button onClick={onRemove} style={{ ...s.btn("#fee2e2", "#dc2626"), fontSize: 14, padding: "4px 8px" }}>✕</button>
      </div>
    </div>
  );
}

function TeamGroup({ title, contentKey, members, setMembers, showRole, onUpload, uploadingKey }: {
  title: string; contentKey: string; members: TeamMember[];
  setMembers: (key: string, val: TeamMember[]) => void; showRole: boolean;
  onUpload: (key: string, idx: number, file: File) => void; uploadingKey: string | null;
}) {
  const swap = (i: number, j: number) => {
    const arr = [...members];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setMembers(contentKey, arr);
  };
  return (
    <div style={s.card}>
      <h3 style={s.groupTitle}>{title}</h3>
      {members.map((m, i) => (
        <MemberRow key={i} m={m} showRole={showRole} isFirst={i === 0} isLast={i === members.length - 1}
          uploading={uploadingKey === `${contentKey}-${i}`}
          onChange={(updated) => { const arr = [...members]; arr[i] = updated; setMembers(contentKey, arr); }}
          onRemove={() => setMembers(contentKey, members.filter((_, j) => j !== i))}
          onMoveUp={() => swap(i, i - 1)} onMoveDown={() => swap(i, i + 1)}
          onUploadPhoto={(file) => onUpload(contentKey, i, file)}
        />
      ))}
      <button onClick={() => setMembers(contentKey, [...members, { ...EMPTY_MEMBER }])} style={s.btn("#e0f2fe", "#0369a1")}>
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
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", ["team_board", "team_audit", "team_advisors"]);
    if (data && data.length > 0) {
      data.forEach((row) => {
        const arr = row.content as TeamMember[];
        if (row.id === "team_board" && arr.length > 0) setBoard(arr);
        if (row.id === "team_audit" && arr.length > 0) setAudit(arr);
        if (row.id === "team_advisors" && arr.length > 0) setAdvisors(arr);
      });
    }
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const getMembers = useCallback((key: string) => {
    if (key === "team_board") return board;
    if (key === "team_audit") return audit;
    if (key === "team_advisors") return advisors;
    return [];
  }, [board, audit, advisors]);

  const setMembers = (key: string, val: TeamMember[]) => {
    if (key === "team_board") setBoard(val);
    if (key === "team_audit") setAudit(val);
    if (key === "team_advisors") setAdvisors(val);
  };

  const handleUpload = async (groupKey: string, idx: number, file: File) => {
    const key = `${groupKey}-${idx}`;
    setUploadingKey(key);
    setMsg("");

    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    const fileName = `${groupKey}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("team-photos")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setMsg("Błąd uploadu: " + uploadError.message);
      setUploadingKey(null);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("team-photos")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    const members = getMembers(groupKey);
    const updated = [...members];
    updated[idx] = { ...updated[idx], img: publicUrl };
    setMembers(groupKey, updated);
    setUploadingKey(null);
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    const updates = [
      { id: "team_board", content: board },
      { id: "team_audit", content: audit },
      { id: "team_advisors", content: advisors },
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Edytuj członków zarządu, komisji rewizyjnej i opiekunów. Kliknij &quot;Zmień&quot; aby przesłać zdjęcie.</p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("Błąd") ? "#dc2626" : "#16a34a", fontWeight: 600 }}>{msg}</span>}
          <button onClick={save} disabled={saving} style={s.btn("#16a34a", "#fff")}>
            {saving ? "Zapisywanie..." : "Zapisz wszystko"}
          </button>
        </div>
      </div>
      <TeamGroup title="Zarząd Główny" contentKey="team_board" members={board} setMembers={setMembers} showRole onUpload={handleUpload} uploadingKey={uploadingKey} />
      <TeamGroup title="Komisja Rewizyjna" contentKey="team_audit" members={audit} setMembers={setMembers} showRole onUpload={handleUpload} uploadingKey={uploadingKey} />
      <TeamGroup title="Opiekunowie merytoryczni" contentKey="team_advisors" members={advisors} setMembers={setMembers} showRole={false} onUpload={handleUpload} uploadingKey={uploadingKey} />
    </div>
  );
}
