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
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const { member_id } = await request.json();

  if (!member_id) {
    return NextResponse.json({ error: "Brak ID członka" }, { status: 400 });
  }

  if (member_id === user.id) {
    return NextResponse.json({ error: "Nie można usunąć własnego konta" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error: deleteError } = await admin.auth.admin.deleteUser(member_id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Nie udało się usunąć: " + deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
