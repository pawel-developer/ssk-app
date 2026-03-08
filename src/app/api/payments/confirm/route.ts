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

  const { confirmation_id, member_id } = await request.json();
  if (!confirmation_id || !member_id) {
    return NextResponse.json({ error: "Brak wymaganych pól" }, { status: 400 });
  }

  const admin = createAdminClient();
  const now = new Date();

  const { data: memberProfile } = await admin
    .from("profiles")
    .select("join_date, fee_valid_until")
    .eq("id", member_id)
    .maybeSingle();

  let validUntil: Date;

  if (memberProfile?.join_date) {
    const joinDate = new Date(memberProfile.join_date);
    const currentValidUntil = memberProfile.fee_valid_until
      ? new Date(memberProfile.fee_valid_until)
      : new Date(0);
    const baseDate = currentValidUntil > now ? currentValidUntil : now;

    const anniversary = new Date(joinDate);
    anniversary.setFullYear(baseDate.getFullYear());
    if (anniversary <= baseDate) {
      anniversary.setFullYear(anniversary.getFullYear() + 1);
    }
    validUntil = anniversary;
  } else {
    validUntil = new Date(now);
    validUntil.setFullYear(validUntil.getFullYear() + 1);
  }

  const { error: updateError } = await admin
    .from("payment_confirmations")
    .update({
      status: "confirmed",
      confirmed_by: user.id,
      confirmed_at: now.toISOString(),
    })
    .eq("id", confirmation_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const profileUpdate: Record<string, unknown> = {
    fee_active: true,
    fee_valid_until: validUntil.toISOString().split("T")[0],
    last_payment_date: now.toISOString().split("T")[0],
  };

  if (!memberProfile?.join_date) {
    profileUpdate.join_date = now.toISOString().split("T")[0];
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update(profileUpdate)
    .eq("id", member_id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
