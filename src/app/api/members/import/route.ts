import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase-admin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.is_admin ? user : null;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row;
  });
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Brak pliku" }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCSV(text);
  if (rows.length === 0) {
    return NextResponse.json({ error: "Plik jest pusty lub nieprawidłowy" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const results = { created: 0, updated: 0, skipped: 0, errors: [] as string[] };

  for (const row of rows) {
    const email = row.email?.toLowerCase().trim();
    if (!email) {
      results.skipped++;
      continue;
    }

    try {
      const { data: existingUsers } = await adminClient.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === email
      );

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const tempPassword = `SSK${Date.now()}!temp`;
        const { data: newUser, error: createError } =
          await adminClient.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
          });

        if (createError || !newUser.user) {
          results.errors.push(`${email}: ${createError?.message || "Nie udało się utworzyć"}`);
          continue;
        }
        userId = newUser.user.id;
        results.created++;
      }

      const profileData: Record<string, unknown> = {};
      if (row.first_name) profileData.first_name = row.first_name;
      if (row.last_name) profileData.last_name = row.last_name;
      if (row.phone) profileData.phone = row.phone;
      if (row.university) profileData.university = row.university;
      if (row.field_of_study) profileData.field_of_study = row.field_of_study;
      if (row.year_of_study) profileData.year_of_study = row.year_of_study;
      if (row.status) profileData.status = row.status;
      if (row.join_date) profileData.join_date = row.join_date;
      if (row.fee_active !== undefined) profileData.fee_active = row.fee_active === "true" || row.fee_active === "1";
      if (row.fee_valid_until) profileData.fee_valid_until = row.fee_valid_until;
      if (row.last_payment_date) profileData.last_payment_date = row.last_payment_date;

      if (Object.keys(profileData).length > 0) {
        const { error: updateError } = await adminClient
          .from("profiles")
          .update(profileData)
          .eq("id", userId);

        if (updateError) {
          results.errors.push(`${email}: ${updateError.message}`);
          continue;
        }
      }

      if (existingUser) results.updated++;
    } catch (err) {
      results.errors.push(`${email}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return NextResponse.json(results);
}
