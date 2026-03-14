import { createAdminClient } from "@/lib/supabase-admin";
import { loadEmailTemplates, sendPaymentReminderEmail } from "@/lib/mailer";
import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

function isMembershipActiveByDate(feeValidUntil: string | null) {
  if (!feeValidUntil) return false;
  const validUntil = new Date(feeValidUntil);
  if (Number.isNaN(validUntil.getTime())) return false;
  validUntil.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return validUntil >= today;
}

export async function POST(request: NextRequest) {
  const serverSupabase = await createClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

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

  const { member_id } = await request.json();
  if (!member_id) {
    return NextResponse.json({ error: "Brak ID członka" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: memberProfile, error: memberError } = await admin
    .from("profiles")
    .select("email, first_name, fee_valid_until, is_archived")
    .eq("id", member_id)
    .maybeSingle();

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  if (memberProfile?.is_archived) {
    return NextResponse.json(
      { error: "Członek jest zarchiwizowany (były członek)" },
      { status: 400 }
    );
  }

  if (!memberProfile?.email) {
    return NextResponse.json(
      { error: "Członek nie ma ustawionego adresu e-mail" },
      { status: 400 }
    );
  }

  if (isMembershipActiveByDate(memberProfile.fee_valid_until)) {
    return NextResponse.json(
      { error: "Składka jest aktywna — przypomnienie nie zostało wysłane" },
      { status: 400 }
    );
  }

  try {
    const templates = await loadEmailTemplates();
    await sendPaymentReminderEmail(
      memberProfile.email,
      memberProfile.first_name || "Członku SSK",
      memberProfile.fee_valid_until,
      templates
    );
  } catch (mailError) {
    return NextResponse.json(
      {
        error:
          mailError instanceof Error
            ? mailError.message
            : "Nie udało się wysłać przypomnienia",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
