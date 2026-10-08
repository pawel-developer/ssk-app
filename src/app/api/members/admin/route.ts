import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

async function getAuthedAdminId() {
  const serverSupabase = await createClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Nie zalogowano" }, { status: 401 }) };
  }

  const { data: profile } = await serverSupabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return { error: NextResponse.json({ error: "Brak uprawnień" }, { status: 403 }) };
  }

  return { adminId: user.id };
}

export async function POST(request: NextRequest) {
  const auth = await getAuthedAdminId();
  if (auth.error) return auth.error;

  const { member_id, is_admin } = await request.json();
  if (!member_id) {
    return NextResponse.json({ error: "Brak ID członka" }, { status: 400 });
  }
  if (typeof is_admin !== "boolean") {
    return NextResponse.json({ error: "Nieprawidłowa wartość is_admin" }, { status: 400 });
  }
  if (member_id === auth.adminId && !is_admin) {
    return NextResponse.json({ error: "Nie można odebrać uprawnień admina samemu sobie" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update({ is_admin, updated_at: new Date().toISOString() })
    .eq("id", member_id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Nie znaleziono członka" }, { status: 404 });
  }

  return NextResponse.json({ success: true, is_admin });
}
