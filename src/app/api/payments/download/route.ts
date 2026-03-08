import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

  const { file_url } = await request.json();
  if (!file_url) {
    return NextResponse.json({ error: "Brak ścieżki pliku" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data } = await admin.storage.from("payment-proofs").createSignedUrl(file_url, 300);

  if (!data?.signedUrl) {
    return NextResponse.json({ error: "Nie udało się wygenerować linku" }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl });
}
