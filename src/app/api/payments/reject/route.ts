import { createAdminClient } from "@/lib/supabase-admin";
import { sendPaymentRejectedEmail } from "@/lib/mailer";
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

  const { confirmation_id, reason } = await request.json();
  if (!confirmation_id) {
    return NextResponse.json({ error: "Brak ID potwierdzenia" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: confirmationData, error: confirmationError } = await admin
    .from("payment_confirmations")
    .select("member_id")
    .eq("id", confirmation_id)
    .maybeSingle();

  if (confirmationError) {
    return NextResponse.json({ error: confirmationError.message }, { status: 500 });
  }

  const { error } = await admin
    .from("payment_confirmations")
    .update({ status: "rejected", rejection_reason: reason || null })
    .eq("id", confirmation_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (confirmationData?.member_id) {
    const { data: memberProfile } = await admin
      .from("profiles")
      .select("email, first_name")
      .eq("id", confirmationData.member_id)
      .maybeSingle();

    if (memberProfile?.email) {
      try {
        await sendPaymentRejectedEmail(
          memberProfile.email,
          memberProfile.first_name || "Członku SSK",
          reason
        );
      } catch (mailError) {
        console.error("Failed to send payment rejection email:", mailError);
      }
    }
  }

  return NextResponse.json({ success: true });
}
