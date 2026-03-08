"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  university: string;
  field_of_study: string;
  year_of_study: string;
  status: string;
  join_date: string;
  fee_active: boolean;
  fee_valid_until: string | null;
  last_payment_date: string | null;
  is_admin: boolean;
}

interface PaymentConfirmation {
  id: string;
  member_id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
  status: string;
  rejection_reason: string | null;
  profiles?: { first_name: string; last_name: string; email: string };
}

type Tab = "members" | "pending";

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("members");
  const [members, setMembers] = useState<Profile[]>([]);
  const [pending, setPending] = useState<PaymentConfirmation[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [editing, setEditing] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const loadData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setError("Błąd ładowania profilu: " + profileError.message + ". Upewnij się, że migracja SQL została uruchomiona w Supabase.");
        setLoading(false);
        return;
      }

      if (!profile) {
        setError("Brak profilu dla tego konta. Uruchom w Supabase SQL Editor:\n\ninsert into public.profiles (id, email, first_name, last_name, is_admin)\nselect id, email, 'Paweł', 'Siuciak', true\nfrom auth.users\nwhere email = '" + user.email + "'\non conflict (id) do update set is_admin = true;");
        setLoading(false);
        return;
      }

      if (!profile.is_admin) { router.push("/panel"); return; }
      setIsAdmin(true);

      const { data: membersData } = await supabase
        .from("profiles")
        .select("*")
        .order("last_name", { ascending: true });

      if (membersData) setMembers(membersData);

      const { data: pendingData } = await supabase
        .from("payment_confirmations")
        .select("*, profiles(first_name, last_name, email)")
        .eq("status", "pending")
        .order("uploaded_at", { ascending: false });

      if (pendingData) setPending(pendingData as PaymentConfirmation[]);
      setLoading(false);
    } catch (err: unknown) {
      setError("Nieoczekiwany błąd: " + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleConfirm = async (conf: PaymentConfirmation) => {
    setActionLoading(conf.id);
    const { data: { user } } = await supabase.auth.getUser();

    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setFullYear(validUntil.getFullYear() + 1);

    await supabase
      .from("payment_confirmations")
      .update({
        status: "confirmed",
        confirmed_by: user?.id,
        confirmed_at: now.toISOString(),
      })
      .eq("id", conf.id);

    await supabase
      .from("profiles")
      .update({
        fee_active: true,
        fee_valid_until: validUntil.toISOString().split("T")[0],
        last_payment_date: now.toISOString().split("T")[0],
      })
      .eq("id", conf.member_id);

    setActionLoading(null);
    loadData();
  };

  const handleReject = async (conf: PaymentConfirmation) => {
    const reason = prompt("Powód odrzucenia (opcjonalnie):");
    setActionLoading(conf.id);

    await supabase
      .from("payment_confirmations")
      .update({ status: "rejected", rejection_reason: reason || null })
      .eq("id", conf.id);

    setActionLoading(null);
    loadData();
  };

  const handleDownload = async (fileUrl: string) => {
    const { data } = await supabase.storage
      .from("payment-proofs")
      .createSignedUrl(fileUrl, 300);

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setActionLoading(editing.id);

    await supabase.from("profiles").update({
      first_name: editing.first_name,
      last_name: editing.last_name,
      phone: editing.phone,
      university: editing.university,
      field_of_study: editing.field_of_study,
      year_of_study: editing.year_of_study,
      status: editing.status,
      fee_active: editing.fee_active,
      fee_valid_until: editing.fee_valid_until,
      last_payment_date: editing.last_payment_date,
    }).eq("id", editing.id);

    setEditing(null);
    setActionLoading(null);
    loadData();
  };

  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      m.first_name?.toLowerCase().includes(q) ||
      m.last_name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.university?.toLowerCase().includes(q);

    const now = new Date();
    const isExpired = !m.fee_active || (m.fee_valid_until && new Date(m.fee_valid_until) < now);
    const matchFilter = filter === "all" || (filter === "active" && !isExpired) || (filter === "expired" && isExpired);

    return matchSearch && matchFilter;
  });

  if (loading || (!isAdmin && !error)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
        <p style={{ color: "#64748b" }}>Ładowanie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 40, boxShadow: "0 4px 24px rgba(0,0,0,.08)", maxWidth: 500, textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>⚠️</p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#0f172a", marginBottom: 12 }}>Błąd</h2>
          <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 20 }}>{error}</p>
          <a href="/login" style={{ color: "#64748b", fontSize: 14 }}>← Wróć do logowania</a>
        </div>
      </div>
    );
  }

  const s = {
    th: { background: "#f8fafc", padding: "12px 16px", textAlign: "left" as const, fontWeight: 600, color: "#475569", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" as const, fontSize: 13 },
    td: { padding: "10px 16px", borderBottom: "1px solid #f1f5f9", color: "#1e293b", fontSize: 14 },
    badge: (color: string, bg: string) => ({ display: "inline-block", padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: bg, color }),
    btn: (bg: string, color: string) => ({ padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: bg, color, transition: "all .15s" }),
    input: { width: "100%", padding: "10px 12px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image src="/img/logo.webp" alt="SSK" width={36} height={36} />
          <h1 style={{ fontSize: 20, color: "#0f172a", margin: 0 }}>Panel Admina SSK</h1>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="/" style={{ ...s.btn("#e2e8f0", "#475569"), textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Strona główna</a>
          <button onClick={handleLogout} style={s.btn("#dc2626", "#fff")}>Wyloguj</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, padding: "0 24px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        {([
          { key: "members" as Tab, label: `Lista członków (${members.length})` },
          { key: "pending" as Tab, label: `Potwierdzenia (${pending.length})` },
        ]).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "14px 24px", border: "none", background: "none", cursor: "pointer",
            fontWeight: 600, fontSize: 14, fontFamily: "inherit",
            color: tab === t.key ? "#dc2626" : "#64748b",
            borderBottom: tab === t.key ? "3px solid #dc2626" : "3px solid transparent",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{members.length}</div>
          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Wszystkich członków</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#16a34a" }}>{members.filter((m) => m.fee_active).length}</div>
          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Aktywne składki</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#dc2626" }}>{members.filter((m) => !m.fee_active).length}</div>
          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Wygasłe</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#f59e0b" }}>{pending.length}</div>
          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Oczekujące potwierdzenia</div>
        </div>
      </div>

      {/* Members tab */}
      {tab === "members" && (
        <div style={{ padding: "0 24px 24px" }}>
          {/* Controls */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <input
              placeholder="Szukaj po nazwisku, emailu, uczelni..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, minWidth: 280, outline: "none", fontFamily: "inherit" }}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} style={{ padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none" }}>
              <option value="all">Wszystkie</option>
              <option value="active">Aktywne składki</option>
              <option value="expired">Wygasłe</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.06)", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={s.th}>Imię i nazwisko</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Uczelnia</th>
                  <th style={s.th}>Data dołączenia</th>
                  <th style={s.th}>Składka</th>
                  <th style={s.th}>Ważna do</th>
                  <th style={s.th}>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => {
                  const expired = !m.fee_active || (m.fee_valid_until && new Date(m.fee_valid_until) < new Date());
                  return (
                    <tr key={m.id} style={{ cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")} onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                      <td style={s.td}>{[m.first_name, m.last_name].filter(Boolean).join(" ") || "—"}</td>
                      <td style={s.td}>{m.email}</td>
                      <td style={s.td}>{m.university || "—"}</td>
                      <td style={s.td}>{m.join_date ? new Date(m.join_date).toLocaleDateString("pl-PL") : "—"}</td>
                      <td style={s.td}>
                        <span style={expired ? s.badge("#dc2626", "#fee2e2") : s.badge("#16a34a", "#dcfce7")}>
                          {expired ? "Wygasła" : "Aktywna"}
                        </span>
                      </td>
                      <td style={s.td}>{m.fee_valid_until ? new Date(m.fee_valid_until).toLocaleDateString("pl-PL") : "—"}</td>
                      <td style={s.td}>
                        <button onClick={() => setEditing({ ...m })} style={s.btn("#2563eb", "#fff")}>Edytuj</button>
                      </td>
                    </tr>
                  );
                })}
                {filteredMembers.length === 0 && (
                  <tr><td colSpan={7} style={{ ...s.td, textAlign: "center", color: "#94a3b8" }}>Brak wyników</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending confirmations tab */}
      {tab === "pending" && (
        <div style={{ padding: "0 24px 24px" }}>
          {pending.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
              <p style={{ color: "#94a3b8", fontSize: 16 }}>Brak oczekujących potwierdzeń</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {pending.map((c) => (
                <div key={c.id} style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <p style={{ fontWeight: 700, color: "#0f172a", margin: 0, fontSize: 15 }}>
                      {c.profiles?.first_name} {c.profiles?.last_name}
                    </p>
                    <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 13 }}>{c.profiles?.email}</p>
                    <p style={{ color: "#94a3b8", margin: "4px 0 0", fontSize: 12 }}>
                      Przesłano: {new Date(c.uploaded_at).toLocaleDateString("pl-PL")} · {c.file_name || "Plik"}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => handleDownload(c.file_url)} style={s.btn("#e2e8f0", "#475569")}>
                      Pobierz
                    </button>
                    <button
                      onClick={() => handleConfirm(c)}
                      disabled={actionLoading === c.id}
                      style={s.btn("#16a34a", "#fff")}
                    >
                      {actionLoading === c.id ? "..." : "Zatwierdź"}
                    </button>
                    <button
                      onClick={() => handleReject(c)}
                      disabled={actionLoading === c.id}
                      style={s.btn("#dc2626", "#fff")}
                    >
                      Odrzuć
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: 16 }} onClick={() => setEditing(null)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 560, width: "100%", maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, marginBottom: 16, fontFamily: "var(--font-serif)", color: "#0f172a" }}>
              Edytuj: {editing.first_name} {editing.last_name}
            </h3>

            {([
              { key: "first_name", label: "Imię" },
              { key: "last_name", label: "Nazwisko" },
              { key: "email", label: "Email", disabled: true },
              { key: "phone", label: "Telefon" },
              { key: "university", label: "Uczelnia" },
              { key: "field_of_study", label: "Kierunek" },
              { key: "year_of_study", label: "Rok studiów" },
            ] as const).map((f) => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>{f.label}</label>
                <input
                  style={s.input}
                  value={(editing as unknown as Record<string, string>)[f.key] || ""}
                  onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                  disabled={"disabled" in f && f.disabled}
                />
              </div>
            ))}

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>Status</label>
              <select
                style={s.input}
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="absolwent">Absolwent</option>
                <option value="rezydent">Rezydent</option>
                <option value="stażysta">Stażysta</option>
                <option value="inny">Inny</option>
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 14, color: "#1e293b", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={editing.fee_active}
                  onChange={(e) => setEditing({ ...editing, fee_active: e.target.checked })}
                  style={{ width: 18, height: 18 }}
                />
                Składka aktywna
              </label>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>Składka ważna do</label>
              <input
                type="date"
                style={s.input}
                value={editing.fee_valid_until || ""}
                onChange={(e) => setEditing({ ...editing, fee_valid_until: e.target.value || null })}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#1e293b" }}>Ostatnia wpłata</label>
              <input
                type="date"
                style={s.input}
                value={editing.last_payment_date || ""}
                onChange={(e) => setEditing({ ...editing, last_payment_date: e.target.value || null })}
              />
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setEditing(null)} style={s.btn("#e2e8f0", "#475569")}>Anuluj</button>
              <button onClick={handleSaveEdit} disabled={actionLoading === editing.id} style={s.btn("#16a34a", "#fff")}>
                {actionLoading === editing.id ? "Zapisywanie..." : "Zapisz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
