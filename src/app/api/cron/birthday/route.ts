import { createAdminClient } from "@/lib/supabase-admin";
import { loadEmailTemplates, sendBirthdayEmail } from "@/lib/mailer";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type MemberForBirthday = {
  email: string | null;
  first_name: string | null;
  birth_date: string | null;
  is_archived: boolean;
};

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");

  const admin = createAdminClient();
  const { data: members, error: membersError } = await admin
    .from("profiles")
    .select("email, first_name, birth_date, is_archived")
    .eq("is_archived", false)
    .not("birth_date", "is", null)
    .not("email", "is", null);

  if (membersError) {
    return NextResponse.json({ error: membersError.message }, { status: 500 });
  }

  const birthdayMembers = (members || [])
    .filter((m: MemberForBirthday) => {
      if (!m.birth_date) return false;
      const [, mm, dd] = m.birth_date.split("-");
      return mm === monthStr && dd === dayStr;
    });

  if (birthdayMembers.length === 0) {
    return NextResponse.json({ success: true, sent: 0, failed: 0 });
  }

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  const templates = await loadEmailTemplates();

  for (const member of birthdayMembers) {
    if (!member.email) continue;

    try {
      await sendBirthdayEmail(
        member.email,
        member.first_name || "Członku SSK",
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
    total: birthdayMembers.length,
    errors: errors.slice(0, 20),
  });
}
