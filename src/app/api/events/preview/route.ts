import { createClient } from "@/lib/supabase-server";
import { loadEmailTemplates, renderEventEmailPreview } from "@/lib/mailer";
import { NextResponse } from "next/server";

type PreviewMailType = "announcement" | "meeting_link";
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

  let body: { mailType?: PreviewMailType; event?: EventPayload };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane wejściowe." }, { status: 400 });
  }

  const mailType = body.mailType;
  const event = body.event || {};
  const eventTitle = String(event.title || "").trim();
  const eventFbUrl = String(event.link || "").trim();
  const eventEmailDescriptionLine = String(event.email_desc_pl || "").trim();
  const eventMeetingLink = String(event.meeting_link_email || "").trim();

  if (mailType !== "announcement" && mailType !== "meeting_link") {
    return NextResponse.json({ error: "Nieobsługiwany typ wiadomości." }, { status: 400 });
  }
  if (!eventTitle) {
    return NextResponse.json({ error: "Brak tytułu wydarzenia." }, { status: 400 });
  }

  const templates = await loadEmailTemplates();
  const preview = renderEventEmailPreview(
    mailType,
    {
      firstName: "Jan",
      eventTitle,
      eventFbUrl,
      eventEmailDescriptionLine:
        eventEmailDescriptionLine || "Tutaj pojawi się opis mailowy wydarzenia.",
      eventMeetingLink:
        eventMeetingLink || "https://meet.google.com/przykladowy-link",
    },
    templates
  );

  return NextResponse.json(preview);
}
