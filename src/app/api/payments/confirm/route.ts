import { createAdminClient } from "@/lib/supabase-admin";
import { buildCertificatePath, renderCertificatePdf } from "@/lib/certificates";
import { sendPaymentConfirmedEmail } from "@/lib/mailer";
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
    .select("join_date, fee_valid_until, first_name, last_name, email, is_archived")
    .eq("id", member_id)
    .maybeSingle();

  if (memberProfile?.is_archived) {
    return NextResponse.json({ error: "Nie można aktywować składki dla byłego członka" }, { status: 400 });
  }

  const currentValidUntil = memberProfile?.fee_valid_until
    ? new Date(memberProfile.fee_valid_until)
    : null;

  const baseDate =
    currentValidUntil && currentValidUntil > now ? currentValidUntil : now;

  const validUntil = new Date(baseDate);
  validUntil.setFullYear(validUntil.getFullYear() + 1);

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

  try {
    const pdfBytes = await renderCertificatePdf({
      firstName: memberProfile?.first_name,
      lastName: memberProfile?.last_name,
      joinDate: memberProfile?.join_date || now.toISOString().split("T")[0],
    });
    await admin.storage.from("certificates").upload(buildCertificatePath(member_id), pdfBytes, {
      contentType: "application/pdf",
      upsert: true,
    });
  } catch (certificateError) {
    console.error("Certificate pre-generation failed:", certificateError);
  }

  if (memberProfile?.email) {
    try {
      await sendPaymentConfirmedEmail(
        memberProfile.email,
        memberProfile.first_name || "Członku SSK",
        validUntil.toISOString().split("T")[0]
      );
    } catch (mailError) {
      console.error("Failed to send payment confirmation email:", mailError);
    }
  }

  return NextResponse.json({ success: true });
}
