import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const serverSupabase = await createClient();
  const { data: { user } } = await serverSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nie zalogowano" }, { status: 401 });
  }

  const { data: profile } = await serverSupabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const admin = createAdminClient();

  const { data: pending, error } = await admin
    .from("payment_confirmations")
    .select("*, profiles!payment_confirmations_member_id_fkey(first_name, last_name, email)")
    .eq("status", "pending")
    .order("uploaded_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  }

  return NextResponse.json({ pending });
}
