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

  const { member_id } = await request.json();
  if (!member_id) {
    return NextResponse.json({ error: "Brak ID członka" }, { status: 400 });
  }
  if (member_id === auth.adminId) {
    return NextResponse.json({ error: "Nie można zarchiwizować własnego konta admina" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      is_archived: true,
      archived_at: new Date().toISOString(),
      archive_reason: "admin_archived",
      archived_by: auth.adminId,
      fee_active: false,
      fee_valid_until: null,
    })
    .eq("id", member_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthedAdminId();
  if (auth.error) return auth.error;

  const { member_id } = await request.json();
  if (!member_id) {
    return NextResponse.json({ error: "Brak ID członka" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      is_archived: false,
      archived_at: null,
      archive_reason: null,
      archived_by: null,
    })
    .eq("id", member_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
