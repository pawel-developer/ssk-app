import { createAdminClient } from "@/lib/supabase-admin";
import { loadEmailTemplates, sendPaymentReminderEmail } from "@/lib/mailer";
import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

function isMembershipActiveByDate(feeValidUntil: string | null) {
  if (!feeValidUntil) return false;
  const validUntil = new Date(feeValidUntil);
  if (Number.isNaN(validUntil.getTime())) return false;
  validUntil.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return validUntil >= today;
}

type MemberForReminder = {
  id: string;
  email: string | null;
  first_name: string | null;
  fee_valid_until: string | null;
  is_archived: boolean;
};

export async function POST() {
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

  const admin = createAdminClient();
  const { data: members, error: membersError } = await admin
    .from("profiles")
    .select("id, email, first_name, fee_valid_until, is_archived");

  if (membersError) {
    return NextResponse.json({ error: membersError.message }, { status: 500 });
  }

  const rows = (members || []) as MemberForReminder[];
  const inactiveMembers = rows.filter(
    (member) => !member.is_archived && !isMembershipActiveByDate(member.fee_valid_until)
  );

  if (inactiveMembers.length === 0) {
    return NextResponse.json({
      success: true,
      sent: 0,
      failed: 0,
      skippedNoEmail: 0,
      inactiveTotal: 0,
    });
  }

  let sent = 0;
  let failed = 0;
  let skippedNoEmail = 0;
  const errors: string[] = [];
  const templates = await loadEmailTemplates();

  for (const member of inactiveMembers) {
    if (!member.email) {
      skippedNoEmail += 1;
      continue;
    }

    try {
      await sendPaymentReminderEmail(
        member.email,
        member.first_name || "Członku SSK",
        member.fee_valid_until,
        templates
      );
      sent += 1;
    } catch (mailError) {
      failed += 1;
      const message =
        mailError instanceof Error ? mailError.message : "Nieznany błąd";
      errors.push(`${member.email}: ${message}`);
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    failed,
    skippedNoEmail,
    inactiveTotal: inactiveMembers.length,
    errors: errors.slice(0, 20),
  });
}
