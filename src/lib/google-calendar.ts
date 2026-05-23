import { google } from "googleapis";
import { randomUUID } from "crypto";

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing Google OAuth2 credentials. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN."
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

type CreateEventParams = {
  title: string;
  description?: string;
  location?: string;
  startDateTime: string;
  endDateTime: string;
  timeZone?: string;
  withMeet?: boolean;
};

type CreateEventResult = {
  eventId: string;
  htmlLink: string;
  meetLink: string;
};

export async function createCalendarEvent(
  params: CreateEventParams
): Promise<CreateEventResult> {
  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth });
  const tz = params.timeZone || "Europe/Warsaw";
  const withMeet = params.withMeet ?? true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestBody: Record<string, any> = {
    summary: params.title,
    description: params.description || "",
    start: { dateTime: params.startDateTime, timeZone: tz },
    end: { dateTime: params.endDateTime, timeZone: tz },
  };

  if (params.location) {
    requestBody.location = params.location;
  }

  if (withMeet) {
    requestBody.conferenceData = {
      createRequest: {
        requestId: randomUUID(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    };
  }

  const response = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: withMeet ? 1 : 0,
    requestBody,
  });

  const event = response.data;
  const meetLink = withMeet
    ? event.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
      )?.uri || ""
    : "";

  if (withMeet && !meetLink) {
    throw new Error(
      "Google Calendar event created but no Meet link was generated. Check that Google Meet is enabled for this account."
    );
  }

  return {
    eventId: event.id || "",
    htmlLink: event.htmlLink || "",
    meetLink,
  };
}
