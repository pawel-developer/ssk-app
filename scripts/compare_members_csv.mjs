#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadDotenv(dotenvPath) {
  if (!fs.existsSync(dotenvPath)) return;
  const content = fs.readFileSync(dotenvPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    let value = line.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseCsv(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const commaCount = (firstLine.match(/,/g) ?? []).length;
  const semicolonCount = (firstLine.match(/;/g) ?? []).length;
  const delimiter = semicolonCount > commaCount ? ";" : ",";

  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === delimiter && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }
    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((r) => {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = (r[idx] ?? "").trim();
      });
      return obj;
    });
}

function cleanText(value) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" || trimmed === "-" ? null : trimmed;
}

function parseBoolean(value) {
  if (value == null) return null;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return null;
  if (["true", "1", "tak", "yes", "y"].includes(normalized)) return true;
  if (["false", "0", "nie", "no", "n"].includes(normalized)) return false;
  return null;
}

function parseDate(value, { monthOnly = false } = {}) {
  if (value == null) return null;
  const raw = String(value).trim();
  if (!raw || raw === "-") return null;

  if (monthOnly) {
    const m = raw.match(/^(\d{1,2})[./-](\d{4})$/);
    if (m) {
      const month = String(Number(m[1])).padStart(2, "0");
      return `${m[2]}-${month}-01`;
    }
  }

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const dmyOrMdy = raw.match(/^(\d{1,2})([./-])(\d{1,2})\2(\d{4})$/);
  if (dmyOrMdy) {
    const first = Number(dmyOrMdy[1]);
    const sep = dmyOrMdy[2];
    const second = Number(dmyOrMdy[3]);
    const year = Number(dmyOrMdy[4]);

    let day = first;
    let month = second;
    if (sep === "/") {
      if (second > 12 && first <= 12) {
        month = first;
        day = second;
      } else if (first > 12 && second <= 12) {
        day = first;
        month = second;
      }
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const dt = new Date(Date.UTC(year, month - 1, day));
    if (
      dt.getUTCFullYear() !== year ||
      dt.getUTCMonth() !== month - 1 ||
      dt.getUTCDate() !== day
    ) return null;

    return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  return null;
}

function normalizeProfileDate(val) {
  if (!val) return null;
  return String(val).slice(0, 10);
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    throw new Error("Usage: node scripts/compare_members_csv.mjs \"/path/to/file.csv\"");
  }

  loadDotenv(path.join(process.cwd(), ".env.local"));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  }

  const csvRows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  if (csvRows.length === 0) throw new Error("CSV is empty or invalid.");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: profilesData, error } = await supabase.from("profiles").select("*");
  if (error) throw error;
  const profilesByEmail = new Map();
  for (const p of profilesData ?? []) {
    if (p.email) profilesByEmail.set(String(p.email).toLowerCase(), p);
  }

  const csvToProfileColumn = {
    email: "email",
    first_name: "first_name",
    last_name: "last_name",
    phone: "phone",
    university: "university",
    field_of_study: "field_of_study",
    year_of_study: "year_of_study",
    status: "status",
    join_date: "join_date",
    birth_date: "birth_date",
    birth_place: "birth_place",
    fee_active: "fee_active",
    last_payment_date: "last_payment_date",
    fee_valid_until: "fee_valid_until",
    is_admin: "is_admin",
    study_start_date: "studies_start_date",
    study_end_date: "studies_end_date",
    pesel: "pesel",
    address: "address",
    citizenship: "citizenship",
    rodo_declaration: "rodo_consent",
  };
  const booleanColumns = new Set(["fee_active", "is_admin", "rodo_consent"]);
  const dateColumns = new Set(["join_date", "birth_date", "last_payment_date", "fee_valid_until"]);
  const monthOnlyDateColumns = new Set(["studies_start_date", "studies_end_date"]);

  const summary = {
    csv_rows: csvRows.length,
    compared_rows: 0,
    missing_email_rows: 0,
    missing_profiles: 0,
    exact_rows: 0,
    rows_with_mismatches: 0,
    compared_fields: 0,
    mismatched_fields: 0,
  };

  const mismatches = [];
  const missingProfiles = [];

  for (const row of csvRows) {
    const emailRaw = cleanText(row.email);
    const email = emailRaw?.toLowerCase();
    if (!email) {
      summary.missing_email_rows += 1;
      continue;
    }

    const profile = profilesByEmail.get(email);
    if (!profile) {
      summary.missing_profiles += 1;
      if (missingProfiles.length < 20) missingProfiles.push(email);
      continue;
    }

    summary.compared_rows += 1;
    const rowDiffs = [];

    for (const [csvKey, profileCol] of Object.entries(csvToProfileColumn)) {
      if (!(csvKey in row)) continue;
      if (!(profileCol in profile)) continue;

      let expected;
      if (booleanColumns.has(profileCol)) {
        expected = parseBoolean(row[csvKey]);
      } else if (dateColumns.has(profileCol)) {
        expected = parseDate(row[csvKey]);
      } else if (monthOnlyDateColumns.has(profileCol)) {
        expected = parseDate(row[csvKey], { monthOnly: true });
      } else {
        expected = cleanText(row[csvKey]);
      }
      if (profileCol === "email" && typeof expected === "string") expected = expected.toLowerCase();

      let actual = profile[profileCol];
      if (dateColumns.has(profileCol) || monthOnlyDateColumns.has(profileCol)) {
        actual = normalizeProfileDate(actual);
      }
      if (typeof actual === "string") {
        actual = cleanText(actual);
      }

      summary.compared_fields += 1;
      if (expected !== actual) {
        summary.mismatched_fields += 1;
        if (rowDiffs.length < 15) {
          rowDiffs.push({
            field: profileCol,
            csv: expected,
            db: actual,
          });
        }
      }
    }

    if (rowDiffs.length === 0) {
      summary.exact_rows += 1;
    } else {
      summary.rows_with_mismatches += 1;
      if (mismatches.length < 15) {
        mismatches.push({ email, diffs: rowDiffs });
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        summary,
        sample_missing_profiles: missingProfiles,
        sample_rows_with_mismatches: mismatches,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
