import { createCalendarEvent } from "@/lib/google-calendar";
import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

type RequestBody = {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  withMeet?: boolean;
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

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe dane wejściowe." },
      { status: 400 }
    );
  }

  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const location = String(body.location || "").trim();
  const date = String(body.date || "").trim();
  const startTime = String(body.startTime || "").trim();
  const endTime = String(body.endTime || "").trim();
  const withMeet = body.withMeet !== false;

  if (!title) {
    return NextResponse.json(
      { error: "Brak tytułu wydarzenia." },
      { status: 400 }
    );
  }
  if (!date || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Podaj datę, godzinę rozpoczęcia i zakończenia." },
      { status: 400 }
    );
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!dateRegex.test(date) || !timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return NextResponse.json(
      { error: "Nieprawidłowy format daty (YYYY-MM-DD) lub godziny (HH:MM)." },
      { status: 400 }
    );
  }

  const startDateTime = `${date}T${startTime}:00`;
  const endDateTime = `${date}T${endTime}:00`;

  try {
    const result = await createCalendarEvent({
      title,
      description,
      location: location || undefined,
      startDateTime,
      endDateTime,
      timeZone: "Europe/Warsaw",
      withMeet,
    });

    return NextResponse.json({
      success: true,
      meetLink: result.meetLink,
      calendarLink: result.htmlLink,
      eventId: result.eventId,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Nie udało się utworzyć wydarzenia.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
