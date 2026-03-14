"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";
import BoardEditor from "@/components/admin/BoardEditor";
import ContentEditor from "@/components/admin/ContentEditor";
import EventsEditor from "@/components/admin/EventsEditor";

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
  birth_date: string | null;
  birth_place: string | null;
  is_archived: boolean;
  archived_at: string | null;
  archive_reason: string | null;
}

interface PaymentConfirmation {
  id: string;
  member_id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
  status: string;
  rejection_reason: string | null;
  profiles?: { first_name: string; last_name: string; email: string; fee_active: boolean; fee_valid_until: string | null; join_date: string | null; status: string | null };
}

type Tab = "members" | "past_members" | "pending" | "board" | "content" | "events";

function isMembershipActiveByDate(feeValidUntil: string | null) {
  if (!feeValidUntil) return false;
  const validUntil = new Date(feeValidUntil);
  if (Number.isNaN(validUntil.getTime())) return false;
  validUntil.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return validUntil >= today;
}

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("members");
  const [members, setMembers] = useState<Profile[]>([]);
  const [pending, setPending] = useState<PaymentConfirmation[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [importModal, setImportModal] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; updated: number; skipped: number; errors: string[] } | null>(null);
  const [importing, setImporting] = useState(false);
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [sortKey, setSortKey] = useState<string>("last_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [generatingCertificates, setGeneratingCertificates] = useState(false);
  const [remindingAll, setRemindingAll] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const loadPendingPayments = useCallback(async () => {
    try {
      const res = await fetch("/api/payments");
      const paymentResult = await res.json();
      if (res.ok && paymentResult.pending) {
        setPending(paymentResult.pending as PaymentConfirmation[]);
      } else {
        console.error("Błąd ładowania potwierdzeń:", JSON.stringify(paymentResult));
      }
    } catch (err) {
      console.error("Błąd fetch /api/payments:", err);
    }
  }, []);

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
        .select("id, email, first_name, last_name, phone, university, field_of_study, year_of_study, status, join_date, fee_active, fee_valid_until, last_payment_date, is_admin, birth_date, birth_place, is_archived, archived_at, archive_reason")
        .order("last_name", { ascending: true });

      if (membersData) setMembers(membersData);
      setLoading(false);
      loadPendingPayments();
    } catch (err: unknown) {
      setError("Nieoczekiwany błąd: " + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  }, [supabase, router, loadPendingPayments]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleConfirm = async (conf: PaymentConfirmation) => {
    setActionLoading(conf.id);
    const res = await fetch("/api/payments/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation_id: conf.id, member_id: conf.member_id }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert("Błąd zatwierdzania: " + (data.error || "Nieznany błąd"));
    }
    setActionLoading(null);
    loadData();
  };

  const handleReject = async (conf: PaymentConfirmation) => {
    const reason = prompt("Powód odrzucenia (opcjonalnie):");
    setActionLoading(conf.id);
    const res = await fetch("/api/payments/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation_id: conf.id, reason: reason || null }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert("Błąd odrzucania: " + (data.error || "Nieznany błąd"));
    }
    setActionLoading(null);
    loadData();
  };

  const handlePreview = async (fileUrl: string, fileName: string) => {
    setPreviewLoading(true);
    setPreviewFileName(fileName || "Plik");
    const { data } = await supabase.storage.from("payment-proofs").createSignedUrl(fileUrl, 600);
    if (data?.signedUrl) {
      setPreviewUrl(data.signedUrl);
    }
    setPreviewLoading(false);
  };

  const handleDownloadFromPreview = () => {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = previewFileName;
    a.target = "_blank";
    a.click();
  };

  const handleDelete = async (member: Profile) => {
    const name = [member.first_name, member.last_name].filter(Boolean).join(" ") || member.email;
    if (!confirm(`Czy na pewno chcesz usunąć członka "${name}"?\n\nTa operacja jest nieodwracalna — konto i profil zostaną trwale usunięte.`)) return;

    setActionLoading(member.id);
    const res = await fetch("/api/members/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_id: member.id }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert("Błąd: " + (data.error || "Nie udało się usunąć członka"));
    }

    setActionLoading(null);
    loadData();
  };

  const handleArchive = async (member: Profile) => {
    const name = [member.first_name, member.last_name].filter(Boolean).join(" ") || member.email;
    if (!confirm(`Zarchiwizować członka "${name}"?\n\nCzłonek pozostanie w bazie jako były członek.`)) return;
    setActionLoading(member.id);
    const res = await fetch("/api/members/archive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_id: member.id }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert("Błąd archiwizacji: " + (data.error || "Nieznany błąd"));
    }
    setActionLoading(null);
    loadData();
  };

  const handleRestore = async (member: Profile) => {
    const name = [member.first_name, member.last_name].filter(Boolean).join(" ") || member.email;
    if (!confirm(`Przywrócić członka "${name}"?`)) return;
    setActionLoading(member.id);
    const res = await fetch("/api/members/archive", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_id: member.id }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert("Błąd przywracania: " + (data.error || "Nieznany błąd"));
    }
    setActionLoading(null);
    loadData();
  };

  const openMemberProfile = (memberId: string) => {
    router.push(`/admin/member/${memberId}`);
  };

  const downloadCsv = (rows: string[][], filename: string) => {
    const csvContent = rows.map((r) =>
      r.map((val) =>
        val.includes(",") || val.includes('"') || val.includes("\n") ? `"${val.replace(/"/g, '""')}"` : val
      ).join(",")
    ).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (members.length === 0) {
      downloadCsv([[]], `ssk-czlonkowie-pelna-baza-${new Date().toISOString().split("T")[0]}.csv`);
      return;
    }

    const preferredOrder = [
      "id",
      "email",
      "first_name",
      "last_name",
      "phone",
      "university",
      "field_of_study",
      "year_of_study",
      "status",
      "join_date",
      "birth_date",
      "birth_place",
      "pesel",
      "address",
      "citizenship",
      "rodo_consent",
      "statute_consent",
      "studies_start_date",
      "studies_end_date",
      "fee_active",
      "last_payment_date",
      "fee_valid_until",
      "is_admin",
      "created_at",
      "updated_at",
    ];

    const allKeys = new Set<string>();
    for (const member of members) {
      Object.keys(member as unknown as Record<string, unknown>).forEach((key) => allKeys.add(key));
    }

    const extraKeys = Array.from(allKeys)
      .filter((key) => !preferredOrder.includes(key))
      .sort((a, b) => a.localeCompare(b));

    const headers = [...preferredOrder.filter((key) => allKeys.has(key)), ...extraKeys];
    const rows = [headers, ...members.map((m) =>
      headers.map((h) => String((m as unknown as Record<string, unknown>)[h] ?? ""))
    )];
    downloadCsv(rows, `ssk-czlonkowie-pelna-baza-${new Date().toISOString().split("T")[0]}.csv`);
  };

  const handleExportBasic = () => {
    const headers = ["Imię/imiona", "Nazwisko", "Data i miejsce urodzenia", "E-mail"];
    const rows = [headers, ...members.map((m) => {
      const rec = m as unknown as Record<string, string | null>;
      const birthDate = rec.birth_date ? new Date(rec.birth_date).toLocaleDateString("pl-PL") : "";
      const birthPlace = rec.birth_place || "";
      const birthInfo = [birthDate, birthPlace].filter(Boolean).join(", ");
      return [rec.first_name || "", rec.last_name || "", birthInfo, rec.email || ""];
    })];
    downloadCsv(rows, `ssk-czlonkowie-podstawowe-${new Date().toISOString().split("T")[0]}.csv`);
  };

  const handleImport = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/members/import", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setImportResult(data);
        loadData();
      } else {
        setImportResult({ created: 0, updated: 0, skipped: 0, errors: [data.error || "Nieznany błąd"] });
      }
    } catch (err) {
      setImportResult({ created: 0, updated: 0, skipped: 0, errors: [err instanceof Error ? err.message : "Błąd sieci"] });
    }
    setImporting(false);
  };

  const handleGenerateCertificates = async () => {
    setGeneratingCertificates(true);
    try {
      const res = await fetch("/api/certificates/generate-all", { method: "POST" });
      const data: { totalActive?: number; generated?: number; failed?: number; error?: string } = await res.json();
      if (!res.ok) {
        alert("Błąd generowania certyfikatów: " + (data.error || "Nieznany błąd"));
        setGeneratingCertificates(false);
        return;
      }
      alert(
        `Wygenerowano certyfikaty: ${data.generated ?? 0}/${data.totalActive ?? 0}.` +
        ((data.failed ?? 0) > 0 ? ` Nieudane: ${data.failed}.` : "")
      );
    } catch (err) {
      alert("Błąd generowania certyfikatów: " + (err instanceof Error ? err.message : "Nieznany błąd"));
    }
    setGeneratingCertificates(false);
  };

  const handleRemindAllInactive = async () => {
    const inactiveCount = members.filter((m) => !isMembershipActiveByDate(m.fee_valid_until)).length;
    if (inactiveCount === 0) {
      alert("Brak nieaktywnych członków do przypomnienia.");
      return;
    }

    if (!confirm(`Wysłać przypomnienie o składce do wszystkich nieaktywnych członków (${inactiveCount})?`)) {
      return;
    }

    setRemindingAll(true);
    try {
      const res = await fetch("/api/payments/remind-all", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert("Błąd wysyłki przypomnień: " + (data.error || "Nieznany błąd"));
        setRemindingAll(false);
        return;
      }
      alert(
        `Wysłano: ${data.sent ?? 0}, nieudane: ${data.failed ?? 0}, bez e-maila: ${data.skippedNoEmail ?? 0}.`
      );
    } catch (err) {
      alert("Błąd wysyłki przypomnień: " + (err instanceof Error ? err.message : "Nieznany błąd"));
    }
    setRemindingAll(false);
  };

  const filteredMembers = members.filter((m) => {
    const matchTabCategory = tab === "past_members" ? m.is_archived : !m.is_archived;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      m.first_name?.toLowerCase().includes(q) ||
      m.last_name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.university?.toLowerCase().includes(q);
    if (!matchTabCategory || !matchSearch) return false;
    if (tab === "past_members") return true;
    const isExpired = !isMembershipActiveByDate(m.fee_valid_until);
    return filter === "all" || (filter === "active" && !isExpired) || (filter === "expired" && isExpired);
  });

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    let valA: string | number | boolean | null = null;
    let valB: string | number | boolean | null = null;

    switch (sortKey) {
      case "name":
        valA = `${a.last_name ?? ""} ${a.first_name ?? ""}`.toLowerCase();
        valB = `${b.last_name ?? ""} ${b.first_name ?? ""}`.toLowerCase();
        break;
      case "fee_status": {
        const expA = !isMembershipActiveByDate(a.fee_valid_until);
        const expB = !isMembershipActiveByDate(b.fee_valid_until);
        valA = expA ? 1 : 0;
        valB = expB ? 1 : 0;
        break;
      }
      case "archive_status":
        valA = a.is_archived ? 1 : 0;
        valB = b.is_archived ? 1 : 0;
        break;
      default:
        valA = (a as unknown as Record<string, string | null>)[sortKey] ?? "";
        valB = (b as unknown as Record<string, string | null>)[sortKey] ?? "";
    }

    if (valA == null) valA = "";
    if (valB == null) valB = "";
    if (valA < valB) return -1 * dir;
    if (valA > valB) return 1 * dir;
    return 0;
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

  const st = {
    th: { background: "#f8fafc", padding: "12px 16px", textAlign: "left" as const, fontWeight: 600, color: "#475569", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" as const, fontSize: 13, cursor: "pointer", userSelect: "none" as const },
    td: { padding: "10px 16px", borderBottom: "1px solid #f1f5f9", color: "#1e293b", fontSize: 14 },
    badge: (color: string, bg: string) => ({ display: "inline-block", padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: bg, color }),
    btn: (bg: string, color: string) => ({ padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: bg, color, transition: "all .15s" }),
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "members", label: `Członkowie (${members.filter((m) => !m.is_archived).length})` },
    { key: "past_members", label: `Byli członkowie (${members.filter((m) => m.is_archived).length})` },
    { key: "pending", label: `Płatności (${pending.length})` },
    { key: "board", label: "Zarząd" },
    { key: "content", label: "Treści strony" },
    { key: "events", label: "Wydarzenia" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image src="/img/logo.webp" alt="SSK" width={36} height={36} />
          <h1 style={{ fontSize: 20, color: "#0f172a", margin: 0 }}>Panel Admina SSK</h1>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button data-tip-b="Odśwież dane" onClick={() => { setLoading(true); loadData(); }} style={st.btn("#0369a1", "#fff")}>Odśwież</button>
          <button data-tip-b="Przejdź do panelu członka" onClick={() => router.push("/panel")} style={st.btn("#0ea5e9", "#fff")}>Panel członka</button>
          <a data-tip-b="Idź na stronę" href="/" style={{ ...st.btn("#e2e8f0", "#475569"), textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Strona główna</a>
          <button data-tip-b="Wyloguj" onClick={handleLogout} style={st.btn("#dc2626", "#fff")}>Wyloguj</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, padding: "0 24px", background: "#fff", borderBottom: "1px solid #e2e8f0", overflowX: "auto" }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "14px 24px", border: "none", background: "none", cursor: "pointer",
            fontWeight: 600, fontSize: 14, fontFamily: "inherit", whiteSpace: "nowrap",
            color: tab === t.key ? "#dc2626" : "#64748b",
            borderBottom: tab === t.key ? "3px solid #dc2626" : "3px solid transparent",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats — only on members/pending tabs */}
      {(tab === "members" || tab === "pending" || tab === "past_members") && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{members.filter((m) => !m.is_archived).length}</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Obecnych członków</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#16a34a" }}>{members.filter((m) => !m.is_archived && isMembershipActiveByDate(m.fee_valid_until)).length}</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Aktywne składki</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#dc2626" }}>{members.filter((m) => !m.is_archived && !isMembershipActiveByDate(m.fee_valid_until)).length}</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Wygasłe</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#f59e0b" }}>{pending.length}</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Oczekujące potwierdzenia</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#6b7280" }}>{members.filter((m) => m.is_archived).length}</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Byli członkowie</div>
          </div>
        </div>
      )}

      {/* ==================== MEMBERS TAB ==================== */}
      {(tab === "members" || tab === "past_members") && (
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <input
              placeholder="Szukaj po nazwisku, emailu, uczelni..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, minWidth: 280, outline: "none", fontFamily: "inherit" }}
            />
            {tab === "members" && (
              <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} style={{ padding: "10px 14px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none" }}>
                <option value="all">Wszystkie</option>
                <option value="active">Aktywne składki</option>
                <option value="expired">Wygasłe</option>
              </select>
            )}
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              {tab === "members" && <button data-tip="Kopiuj emaile aktywnych" onClick={() => {
                const activeEmails = members.filter((m) => !m.is_archived && isMembershipActiveByDate(m.fee_valid_until)).map((m) => m.email).filter(Boolean);
                navigator.clipboard.writeText(activeEmails.join(", "));
                setCopiedEmails(true);
                setTimeout(() => setCopiedEmails(false), 2000);
              }} style={st.btn("#16a34a", "#fff")}>
                {copiedEmails ? "Skopiowano!" : `Kopiuj emaile aktywnych (${members.filter((m) => !m.is_archived && isMembershipActiveByDate(m.fee_valid_until)).length})`}
              </button>}
              {tab === "members" && <button data-tip="CSV: imię, nazwisko, email" onClick={handleExportBasic} style={st.btn("#0369a1", "#fff")}>Eksport podstawowy</button>}
              {tab === "members" && <button data-tip="CSV ze wszystkimi polami" onClick={handleExport} style={st.btn("#475569", "#fff")}>Eksport pełny CSV</button>}
              {tab === "members" && <button data-tip="Import z CSV" onClick={() => { setImportModal(true); setImportResult(null); }} style={st.btn("#7c3aed", "#fff")}>Import CSV</button>}
              {tab === "members" && <button data-tip="Generuj certyfikaty dla aktywnych członków" onClick={handleGenerateCertificates} disabled={generatingCertificates} style={st.btn("#0f766e", "#fff")}>
                {generatingCertificates ? "Generowanie..." : "Generuj certyfikaty aktywnych"}
              </button>}
              {tab === "members" && <button data-tip="Wyślij przypomnienia do nieaktywnych" onClick={handleRemindAllInactive} disabled={remindingAll} style={st.btn("#f59e0b", "#fff")}>
                {remindingAll ? "Wysyłanie..." : "Przypomnij wszystkim nieaktywnym"}
              </button>}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.06)", fontSize: 14 }}>
              <thead>
                <tr>
                  {([
                    { key: "name", label: "Imię i nazwisko" },
                    { key: "email", label: "Email" },
                    { key: "university", label: "Uczelnia" },
                    { key: "join_date", label: "Data dołączenia" },
                    { key: "archive_status", label: "Członkostwo" },
                    { key: "fee_status", label: "Składka" },
                    { key: "fee_valid_until", label: "Ważna do" },
                  ] as const).map((col) => (
                    <th key={col.key} style={st.th} onClick={() => toggleSort(col.key)}>
                      {col.label} {sortKey === col.key ? (sortDir === "asc" ? "▲" : "▼") : ""}
                    </th>
                  ))}
                  <th style={{ ...st.th, cursor: "default" }}>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((m) => {
                  const expired = !isMembershipActiveByDate(m.fee_valid_until);
                  return (
                    <tr
                      key={m.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => openMemberProfile(m.id)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                    >
                      <td style={st.td}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openMemberProfile(m.id); }}
                          style={{ padding: 0, border: "none", background: "none", color: "#0f172a", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}
                        >
                          {[m.first_name, m.last_name].filter(Boolean).join(" ") || "—"}
                        </button>
                      </td>
                      <td style={st.td}>{m.email}</td>
                      <td style={st.td}>{m.university || "—"}</td>
                      <td style={st.td}>{m.join_date ? new Date(m.join_date).toLocaleDateString("pl-PL") : "—"}</td>
                      <td style={st.td}>
                        <span style={m.is_archived ? st.badge("#6b7280", "#e5e7eb") : st.badge("#1d4ed8", "#dbeafe")}>
                          {m.is_archived ? "Były członek" : "Obecny członek"}
                        </span>
                      </td>
                      <td style={st.td}>
                        <span style={expired ? st.badge("#dc2626", "#fee2e2") : st.badge("#16a34a", "#dcfce7")}>
                          {m.is_archived ? "—" : expired ? "Wygasła" : "Aktywna"}
                        </span>
                      </td>
                      <td style={st.td}>{m.is_archived ? "—" : m.fee_valid_until ? new Date(m.fee_valid_until).toLocaleDateString("pl-PL") : "—"}</td>
                      <td style={{ ...st.td, whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {m.is_archived ? (
                            <button data-tip="Przywróć członka" onClick={(e) => { e.stopPropagation(); handleRestore(m); }} disabled={actionLoading === m.id} style={st.btn("#2563eb", "#fff")}>
                              {actionLoading === m.id ? "..." : "Przywróć"}
                            </button>
                          ) : (
                            <button data-tip="Archiwizuj członka" onClick={(e) => { e.stopPropagation(); handleArchive(m); }} disabled={actionLoading === m.id} style={st.btn("#64748b", "#fff")}>
                              {actionLoading === m.id ? "..." : "Archiwizuj"}
                            </button>
                          )}
                          <button data-tip="Usuń konto" onClick={(e) => { e.stopPropagation(); handleDelete(m); }} disabled={actionLoading === m.id} style={st.btn("#dc2626", "#fff")}>
                            {actionLoading === m.id ? "..." : "Usuń"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {sortedMembers.length === 0 && (
                  <tr><td colSpan={8} style={{ ...st.td, textAlign: "center", color: "#94a3b8" }}>Brak wyników</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== PENDING TAB ==================== */}
      {tab === "pending" && (
        <div style={{ padding: "0 24px 24px" }}>
          {pending.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
              <p style={{ color: "#94a3b8", fontSize: 16 }}>Brak oczekujących potwierdzeń</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {pending.map((c) => {
                const prof = c.profiles;
                const memberExpired = prof ? !isMembershipActiveByDate(prof.fee_valid_until) : null;
                return (
                  <div key={c.id} style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ minWidth: 200 }}>
                      <p style={{ fontWeight: 700, color: "#0f172a", margin: 0, fontSize: 15 }}>
                        {prof?.first_name} {prof?.last_name}
                      </p>
                      <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 13 }}>{prof?.email}</p>
                      <p style={{ color: "#94a3b8", margin: "4px 0 0", fontSize: 12 }}>
                        Przesłano: {new Date(c.uploaded_at).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 13, color: "#475569", flexWrap: "wrap" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>Status</div>
                        <span style={memberExpired === null ? st.badge("#64748b", "#f1f5f9") : memberExpired ? st.badge("#dc2626", "#fee2e2") : st.badge("#16a34a", "#dcfce7")}>
                          {memberExpired === null ? "—" : memberExpired ? "Nieaktywny" : "Aktywny"}
                        </span>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>Dołączył/a</div>
                        <span style={{ fontWeight: 600 }}>{prof?.join_date ? new Date(prof.join_date).toLocaleDateString("pl-PL") : "—"}</span>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>Składka do</div>
                        <span style={{ fontWeight: 600 }}>{prof?.fee_valid_until ? new Date(prof.fee_valid_until).toLocaleDateString("pl-PL") : "—"}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button data-tip="Podgląd pliku" onClick={() => handlePreview(c.file_url, c.file_name)} style={st.btn("#e2e8f0", "#475569")}>Podgląd</button>
                      <button data-tip="Aktywuj składkę" onClick={() => handleConfirm(c)} disabled={actionLoading === c.id} style={st.btn("#16a34a", "#fff")}>
                        {actionLoading === c.id ? "..." : "Zatwierdź"}
                      </button>
                      <button data-tip="Odrzuć wpłatę" onClick={() => handleReject(c)} disabled={actionLoading === c.id} style={st.btn("#dc2626", "#fff")}>Odrzuć</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== BOARD TAB ==================== */}
      {tab === "board" && <BoardEditor />}

      {/* ==================== CONTENT TAB ==================== */}
      {tab === "content" && <ContentEditor />}

      {/* ==================== EVENTS TAB ==================== */}
      {tab === "events" && <EventsEditor />}

      {/* ==================== IMPORT MODAL ==================== */}
      {importModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: 16 }} onClick={() => setImportModal(false)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 500, width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, marginBottom: 8, fontFamily: "var(--font-serif)", color: "#0f172a" }}>Import członków z CSV</h3>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>
              Plik CSV powinien zawierać nagłówki: <code>email, first_name, last_name, phone, university, field_of_study, year_of_study, status, join_date, fee_active, fee_valid_until, last_payment_date</code>.
              Nowi członkowie (nieistniejący email) zostaną utworzeni z tymczasowym hasłem. Istniejący zostaną zaktualizowani.
            </p>
            <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ marginBottom: 16, fontSize: 14 }} />

            {importResult && (
              <div style={{ background: importResult.errors.length > 0 ? "#fef2f2" : "#f0fdf4", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13 }}>
                <p style={{ margin: 0, fontWeight: 600 }}>Utworzono: {importResult.created} · Zaktualizowano: {importResult.updated} · Pominięto: {importResult.skipped}</p>
                {importResult.errors.length > 0 && (
                  <div style={{ marginTop: 8, color: "#dc2626" }}>
                    <p style={{ fontWeight: 600, margin: "0 0 4px" }}>Błędy:</p>
                    {importResult.errors.slice(0, 10).map((e, i) => <p key={i} style={{ margin: 0, fontSize: 12 }}>{e}</p>)}
                    {importResult.errors.length > 10 && <p style={{ margin: 0, fontSize: 12 }}>...i {importResult.errors.length - 10} więcej</p>}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button data-tip="Zamknij" onClick={() => setImportModal(false)} style={st.btn("#e2e8f0", "#475569")}>Zamknij</button>
              <button data-tip="Importuj plik" onClick={handleImport} disabled={importing} style={st.btn("#7c3aed", "#fff")}>
                {importing ? "Importowanie..." : "Importuj"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ==================== FILE PREVIEW MODAL ==================== */}
      {(previewUrl || previewLoading) && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 200, display: "flex", justifyContent: "center", alignItems: "center", padding: 16 }} onClick={() => { setPreviewUrl(null); setPreviewFileName(""); }}>
          <div style={{ background: "#fff", borderRadius: 16, maxWidth: 900, width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: 0, fontSize: 16, color: "#0f172a", fontFamily: "var(--font-serif)" }}>Podgląd: {previewFileName}</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleDownloadFromPreview} style={st.btn("#0369a1", "#fff")}>Pobierz</button>
                <button onClick={() => { setPreviewUrl(null); setPreviewFileName(""); }} style={st.btn("#e2e8f0", "#475569")}>Zamknij</button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center", alignItems: "center", padding: 24, minHeight: 400, background: "#f8fafc" }}>
              {previewLoading ? (
                <p style={{ color: "#64748b" }}>Ładowanie...</p>
              ) : previewUrl && (previewFileName.toLowerCase().endsWith(".pdf") ? (
                <iframe src={previewUrl} style={{ width: "100%", height: "70vh", border: "none", borderRadius: 8 }} />
              ) : previewFileName.match(/\.(jpe?g|png|gif|webp|bmp)$/i) ? (
                <img src={previewUrl} alt={previewFileName} style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 8 }} />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#64748b", marginBottom: 16 }}>Podgląd niedostępny dla tego typu pliku.</p>
                  <button onClick={handleDownloadFromPreview} style={st.btn("#0369a1", "#fff")}>Pobierz plik</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
