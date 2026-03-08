"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";

interface TeamMember {
  name: string;
  role_pl?: string;
  role_en?: string;
  img: string;
}

const EMPTY_MEMBER: TeamMember = { name: "", role_pl: "", role_en: "", img: "" };

const s = {
  card: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)", marginBottom: 16 },
  groupTitle: { fontSize: 16, fontWeight: 700 as const, color: "#0f172a", marginBottom: 16 },
  row: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" as const },
  input: { padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", flex: 1, minWidth: 120 },
  inputSmall: { padding: "8px 10px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", width: 140 },
  btn: (bg: string, color: string) => ({ padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600 as const, cursor: "pointer", background: bg, color, transition: "all .15s" }),
  label: { fontSize: 11, color: "#94a3b8", fontWeight: 600 as const, display: "block", marginBottom: 2 },
};

function MemberRow({ m, onChange, onRemove, onMoveUp, onMoveDown, showRole, isFirst, isLast }: {
  m: TeamMember; onChange: (m: TeamMember) => void; onRemove: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
  showRole: boolean; isFirst: boolean; isLast: boolean;
}) {
  return (
    <div style={{ ...s.row, padding: 12, background: "#f8fafc", borderRadius: 8 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 140 }}>
            <span style={s.label}>Imię i nazwisko</span>
            <input style={s.input} value={m.name} onChange={(e) => onChange({ ...m, name: e.target.value })} placeholder="Jan Kowalski" />
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <span style={s.label}>Klucz zdjęcia</span>
            <input style={s.input} value={m.img} onChange={(e) => onChange({ ...m, img: e.target.value })} placeholder="team-jan" />
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
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <button onClick={onMoveUp} disabled={isFirst} style={{ ...s.btn(isFirst ? "#f1f5f9" : "#e2e8f0", isFirst ? "#cbd5e1" : "#475569"), fontSize: 14, padding: "4px 8px" }}>↑</button>
        <button onClick={onMoveDown} disabled={isLast} style={{ ...s.btn(isLast ? "#f1f5f9" : "#e2e8f0", isLast ? "#cbd5e1" : "#475569"), fontSize: 14, padding: "4px 8px" }}>↓</button>
        <button onClick={onRemove} style={{ ...s.btn("#fee2e2", "#dc2626"), fontSize: 14, padding: "4px 8px" }}>✕</button>
      </div>
    </div>
  );
}

function TeamGroup({ title, contentKey, members, setMembers, showRole }: {
  title: string; contentKey: string; members: TeamMember[];
  setMembers: (key: string, val: TeamMember[]) => void; showRole: boolean;
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
          onChange={(updated) => { const arr = [...members]; arr[i] = updated; setMembers(contentKey, arr); }}
          onRemove={() => setMembers(contentKey, members.filter((_, j) => j !== i))}
          onMoveUp={() => swap(i, i - 1)} onMoveDown={() => swap(i, i + 1)}
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
  const [board, setBoard] = useState<TeamMember[]>([]);
  const [audit, setAudit] = useState<TeamMember[]>([]);
  const [advisors, setAdvisors] = useState<TeamMember[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*").in("id", ["team_board", "team_audit", "team_advisors"]);
    data?.forEach((row) => {
      if (row.id === "team_board") setBoard(row.content as TeamMember[]);
      if (row.id === "team_audit") setAudit(row.content as TeamMember[]);
      if (row.id === "team_advisors") setAdvisors(row.content as TeamMember[]);
    });
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const setMembers = (key: string, val: TeamMember[]) => {
    if (key === "team_board") setBoard(val);
    if (key === "team_audit") setAudit(val);
    if (key === "team_advisors") setAdvisors(val);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Edytuj członków zarządu, komisji rewizyjnej i opiekunów. Zdjęcia: <code>/public/img/[klucz].webp</code></p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("Błąd") ? "#dc2626" : "#16a34a", fontWeight: 600 }}>{msg}</span>}
          <button onClick={save} disabled={saving} style={s.btn("#16a34a", "#fff")}>
            {saving ? "Zapisywanie..." : "Zapisz wszystko"}
          </button>
        </div>
      </div>
      <TeamGroup title="Zarząd Główny" contentKey="team_board" members={board} setMembers={setMembers} showRole />
      <TeamGroup title="Komisja Rewizyjna" contentKey="team_audit" members={audit} setMembers={setMembers} showRole />
      <TeamGroup title="Opiekunowie merytoryczni" contentKey="team_advisors" members={advisors} setMembers={setMembers} showRole={false} />
    </div>
  );
}
