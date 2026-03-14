import {
  loadEmailTemplates,
  sendEventAnnouncementEmail,
  sendEventMeetingLinkEmail,
} from "@/lib/mailer";
import { createAdminClient } from "@/lib/supabase-admin";
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

type MemberForBroadcast = {
  email: string | null;
  first_name: string | null;
  fee_valid_until: string | null;
  is_archived: boolean;
};

type BroadcastMailType = "announcement" | "meeting_link";

type EventPayload = {
  title?: string;
  link?: string;
  email_desc_pl?: string;
  meeting_link_email?: string;
};

export async function POST(request: Request) {
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

  let body: { mailType?: BroadcastMailType; event?: EventPayload };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane wejściowe." }, { status: 400 });
  }

  const mailType = body.mailType;
  const event = body.event || {};
  const eventTitle = String(event.title || "").trim();
  const eventFacebookLink = String(event.link || "").trim();
  const eventEmailDescription = String(event.email_desc_pl || "").trim();
  const eventMeetingLink = String(event.meeting_link_email || "").trim();

  if (mailType !== "announcement" && mailType !== "meeting_link") {
    return NextResponse.json({ error: "Nieobsługiwany typ wiadomości." }, { status: 400 });
  }
  if (!eventTitle) {
    return NextResponse.json({ error: "Brak tytułu wydarzenia." }, { status: 400 });
  }
  if (mailType === "announcement" && !eventFacebookLink) {
    return NextResponse.json({ error: "Brak linku Facebook dla announcement." }, { status: 400 });
  }
  if (mailType === "meeting_link" && !eventMeetingLink) {
    return NextResponse.json({ error: "Brak linku spotkania." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: members, error: membersError } = await admin
    .from("profiles")
    .select("email, first_name, fee_valid_until, is_archived");

  if (membersError) {
    return NextResponse.json({ error: membersError.message }, { status: 500 });
  }

  const rows = (members || []) as MemberForBroadcast[];
  const activeMembers = rows.filter(
    (member) => !member.is_archived && isMembershipActiveByDate(member.fee_valid_until)
  );

  if (activeMembers.length === 0) {
    return NextResponse.json({
      success: true,
      sent: 0,
      failed: 0,
      skippedNoEmail: 0,
      activeTotal: 0,
    });
  }

  const templates = await loadEmailTemplates();
  let sent = 0;
  let failed = 0;
  let skippedNoEmail = 0;
  const errors: string[] = [];

  for (const member of activeMembers) {
    if (!member.email) {
      skippedNoEmail += 1;
      continue;
    }

    try {
      if (mailType === "announcement") {
        await sendEventAnnouncementEmail(
          member.email,
          member.first_name || "Członku SSK",
          eventTitle,
          eventFacebookLink,
          eventEmailDescription,
          templates
        );
      } else {
        await sendEventMeetingLinkEmail(
          member.email,
          member.first_name || "Członku SSK",
          eventTitle,
          eventMeetingLink,
          templates
        );
      }
      sent += 1;
    } catch (mailError) {
      failed += 1;
      const message = mailError instanceof Error ? mailError.message : "Nieznany błąd";
      errors.push(`${member.email}: ${message}`);
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    failed,
    skippedNoEmail,
    activeTotal: activeMembers.length,
    errors: errors.slice(0, 20),
  });
}
