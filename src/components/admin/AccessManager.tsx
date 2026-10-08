"use client";

import { useState } from "react";

export interface AccessMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  is_archived: boolean;
}

interface Props {
  members: AccessMember[];
  currentUserId: string | null;
  onAdminChange: (memberId: string, isAdmin: boolean) => void;
  onOpenProfile: (memberId: string) => void;
}

const card = { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,.12)" };
const th = { background: "#f8fafc", padding: "12px 16px", textAlign: "left" as const, fontWeight: 600, color: "#475569", borderBottom: "2px solid #e2e8f0", fontSize: 13 };
const td = { padding: "10px 16px", borderBottom: "1px solid #f1f5f9", color: "#1e293b", fontSize: 14 };
const btn = (bg: string, color: string) => ({ padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: bg, color, fontFamily: "inherit" });

function fullName(m: AccessMember) {
  return [m.first_name, m.last_name].filter(Boolean).join(" ") || "—";
}

export default function AccessManager({ members, currentUserId, onAdminChange, onOpenProfile }: Props) {
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const admins = members
    .filter((m) => m.is_admin)
    .sort((a, b) => (a.last_name || "").localeCompare(b.last_name || "", "pl"));

  const q = search.trim().toLowerCase();
  const candidates = q
    ? members
        .filter((m) => !m.is_admin && !m.is_archived)
        .filter((m) =>
          m.first_name?.toLowerCase().includes(q) ||
          m.last_name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q)
        )
        .slice(0, 10)
    : [];

  const setAdmin = async (member: AccessMember, isAdmin: boolean) => {
    const question = isAdmin
      ? `Nadać uprawnienia admina użytkownikowi ${fullName(member)}? Uzyska pełny dostęp do panelu administratora.`
      : `Odebrać uprawnienia admina użytkownikowi ${fullName(member)}?`;
    if (!confirm(question)) return;
    setSavingId(member.id);
    const res = await fetch("/api/members/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_id: member.id, is_admin: isAdmin }),
    });
    const data = await res.json().catch(() => ({}));
    setSavingId(null);
    if (!res.ok) {
      alert("Nie udało się zmienić uprawnień: " + (data.error || "Nieznany błąd"));
      return;
    }
    onAdminChange(member.id, isAdmin);
    if (isAdmin) setSearch("");
  };

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, maxWidth: 960 }}>
      <div style={card}>
        <h3 style={{ margin: "0 0 4px", color: "#0f172a", fontSize: 16 }}>Dodaj admina</h3>
        <p style={{ margin: "0 0 12px", color: "#64748b", fontSize: 13 }}>
          Wyszukaj obecnego członka po imieniu, nazwisku lub emailu. Osoba musi mieć konto na stronie.
        </p>
        <input
          placeholder="Szukaj członka..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
        />
        {q && (
          <div style={{ marginTop: 8 }}>
            {candidates.length === 0 ? (
              <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 13 }}>Brak pasujących członków (albo już są adminami).</p>
            ) : (
              candidates.map((m) => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{fullName(m)}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{m.email}</div>
                  </div>
                  <button onClick={() => setAdmin(m, true)} disabled={savingId === m.id} style={btn("#0f766e", "#fff")}>
                    {savingId === m.id ? "Zapisywanie..." : "Nadaj admina"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px" }}>
          <h3 style={{ margin: 0, color: "#0f172a", fontSize: 16 }}>Admini ({admins.length})</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Imię i nazwisko</th>
              <th style={th}>Email</th>
              <th style={th}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((m) => {
              const isSelf = m.id === currentUserId;
              return (
                <tr key={m.id}>
                  <td style={td}>
                    <button
                      type="button"
                      onClick={() => onOpenProfile(m.id)}
                      style={{ padding: 0, border: "none", background: "none", color: "#0f172a", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}
                    >
                      {fullName(m)}
                    </button>
                    {isSelf && <span style={{ marginLeft: 8, color: "#64748b", fontSize: 12 }}>(Ty)</span>}
                    {m.is_archived && <span style={{ marginLeft: 8, color: "#6b7280", fontSize: 12 }}>(były członek)</span>}
                  </td>
                  <td style={td}>{m.email}</td>
                  <td style={td}>
                    {isSelf ? (
                      <span style={{ color: "#94a3b8", fontSize: 12 }}>Nie możesz usunąć siebie</span>
                    ) : (
                      <button onClick={() => setAdmin(m, false)} disabled={savingId === m.id} style={btn("#fee2e2", "#b91c1c")}>
                        {savingId === m.id ? "Zapisywanie..." : "Usuń admina"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
