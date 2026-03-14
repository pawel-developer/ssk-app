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
        i++;
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
      if (ch === "\r" && next === "\n") i++;
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
  return rows.slice(1).filter((r) => r.some((c) => c.trim() !== "")).map((r) => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (r[idx] ?? "").trim();
    });
    return obj;
  });
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

    // Slash-separated dates in CSV can be MM/DD/YYYY; detect by impossible month/day.
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

function cleanText(value) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" || trimmed === "-" ? null : trimmed;
}

async function listAllUsers(adminClient) {
  const users = [];
  let page = 1;
  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const batch = data?.users ?? [];
    users.push(...batch);
    if (batch.length < 1000) break;
    page += 1;
  }
  return users;
}

async function verifyProfiles(adminClient) {
  const { count, error } = await adminClient
    .from("profiles")
    .select("*", { count: "exact", head: true });
  if (error) throw error;

  const { count: noEmailCount, error: noEmailErr } = await adminClient
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .or("email.is.null,email.eq.");
  if (noEmailErr) throw noEmailErr;

  const { data: sample, error: sampleErr } = await adminClient
    .from("profiles")
    .select("id,email,first_name,last_name,join_date,fee_active,fee_valid_until,last_payment_date")
    .order("join_date", { ascending: false, nullsFirst: false })
    .limit(10);
  if (sampleErr) throw sampleErr;

  console.log(
    JSON.stringify(
      {
        total_profiles: count,
        profiles_without_email: noEmailCount,
        sample_latest_join_date: sample,
      },
      null,
      2
    )
  );
}

async function main() {
  const arg = process.argv[2];
  const verifyOnly = arg === "--verify";
  const csvPath = verifyOnly ? null : arg;
  if (!verifyOnly && !csvPath) {
    throw new Error("Usage: node scripts/import_members_csv.mjs \"/path/to/file.csv\" OR --verify");
  }

  const projectRoot = process.cwd();
  loadDotenv(path.join(projectRoot, ".env.local"));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  if (verifyOnly) {
    await verifyProfiles(adminClient);
    return;
  }

  const rawCsv = fs.readFileSync(csvPath, "utf8");
  const csvRows = parseCsv(rawCsv);
  if (csvRows.length === 0) {
    throw new Error("CSV is empty or invalid.");
  }

  const { data: existingProfiles, error: profilesError } = await adminClient
    .from("profiles")
    .select("id,email");
  if (profilesError) throw profilesError;

  const profilesByEmail = new Map();
  for (const profile of existingProfiles ?? []) {
    if (profile.email) profilesByEmail.set(profile.email.toLowerCase(), profile.id);
  }

  const allUsers = await listAllUsers(adminClient);
  const usersByEmail = new Map();
  for (const user of allUsers) {
    if (user.email) usersByEmail.set(user.email.toLowerCase(), user.id);
  }

  const { data: sampleProfile } = await adminClient.from("profiles").select("*").limit(1).maybeSingle();
  const profileColumns = new Set(Object.keys(sampleProfile ?? {}));

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

  const stats = {
    rows: csvRows.length,
    updated: 0,
    createdUsers: 0,
    skipped: 0,
    errors: 0,
    ignoredColumns: new Set(),
  };

  for (const row of csvRows) {
    try {
      const emailRaw = cleanText(row.email);
      const email = emailRaw?.toLowerCase();
      if (!email) {
        stats.skipped += 1;
        continue;
      }

      let userId = profilesByEmail.get(email) ?? usersByEmail.get(email);

      if (!userId) {
        const passwordFromCsv = cleanText(row.password);
        const password = passwordFromCsv && passwordFromCsv.length >= 8
          ? passwordFromCsv
          : `SSK${Date.now()}!temp`;

        const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (createErr || !created?.user?.id) {
          stats.errors += 1;
          console.error(`createUser failed for ${email}: ${createErr?.message ?? "unknown error"}`);
          continue;
        }
        userId = created.user.id;
        usersByEmail.set(email, userId);
        stats.createdUsers += 1;
      }

      const updateData = {};
      for (const [csvKey, profileCol] of Object.entries(csvToProfileColumn)) {
        if (!(csvKey in row)) continue;
        if (!profileColumns.has(profileCol)) {
          stats.ignoredColumns.add(profileCol);
          continue;
        }

        let value;
        if (booleanColumns.has(profileCol)) {
          value = parseBoolean(row[csvKey]);
        } else if (dateColumns.has(profileCol)) {
          value = parseDate(row[csvKey]);
        } else if (monthOnlyDateColumns.has(profileCol)) {
          value = parseDate(row[csvKey], { monthOnly: true });
        } else {
          value = cleanText(row[csvKey]);
        }

        if (profileCol === "email" && typeof value === "string") value = value.toLowerCase();
        updateData[profileCol] = value;
      }

      updateData.id = userId;
      if (!updateData.email) updateData.email = email;

      const { error: upsertErr } = await adminClient
        .from("profiles")
        .upsert(updateData, { onConflict: "id" });
      if (upsertErr) {
        stats.errors += 1;
        console.error(`upsert failed for ${email}: ${upsertErr.message}`);
        continue;
      }

      profilesByEmail.set(email, userId);
      stats.updated += 1;
    } catch (err) {
      stats.errors += 1;
      console.error(`row failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log("Import complete.");
  console.log(`Rows: ${stats.rows}`);
  console.log(`Updated/Upserted profiles: ${stats.updated}`);
  console.log(`Created auth users: ${stats.createdUsers}`);
  console.log(`Skipped rows: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  if (stats.ignoredColumns.size > 0) {
    console.log(`Ignored missing profile columns: ${Array.from(stats.ignoredColumns).sort().join(", ")}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
