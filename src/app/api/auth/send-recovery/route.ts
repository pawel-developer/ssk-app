import { createAdminClient } from "@/lib/supabase-admin";
import { sendBrevoEmail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";

function safeOriginFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return null;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const mode = body?.mode === "generate" ? "generate" : "reset";
  const requestedRedirect = typeof body?.redirectTo === "string" ? body.redirectTo : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const appOrigin = appUrl ? safeOriginFromUrl(appUrl) : null;
  const requestOrigin = request.headers.get("origin");
  const allowedOrigin = appOrigin || requestOrigin || null;
  const fallbackRedirect = allowedOrigin ? `${allowedOrigin}/reset-password` : "";
  const redirectTo = requestedRedirect || fallbackRedirect;

  if (!redirectTo) {
    return NextResponse.json(
      { error: "Brak poprawnego adresu redirect dla resetu hasła." },
      { status: 500 }
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (error || !data?.properties?.action_link) {
    return NextResponse.json(
      {
        error: error?.message || "Nie udało się wygenerować linku resetu hasła.",
      },
      { status: 500 }
    );
  }

  const link = data.properties.action_link;
  const subject =
    mode === "generate"
      ? "SSK — ustaw hasło (pierwsze logowanie)"
      : "SSK — reset hasła";

  const intro =
    mode === "generate"
      ? "Kliknij poniższy przycisk, aby ustawić hasło do konta SSK."
      : "Kliknij poniższy przycisk, aby zresetować hasło do konta SSK.";

  try {
    await sendBrevoEmail({
      to: [{ email }],
      subject,
      htmlContent: `
        <p>${escapeHtml(intro)}</p>
        <p>
          <a href="${escapeHtml(link)}" style="display:inline-block;padding:10px 14px;background:#dc2626;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">
            Otwórz link resetu hasła
          </a>
        </p>
        <p>Jeśli przycisk nie działa, skopiuj ten link:</p>
        <p><a href="${escapeHtml(link)}">${escapeHtml(link)}</a></p>
      `,
    });
  } catch (mailError) {
    return NextResponse.json(
      {
        error:
          mailError instanceof Error
            ? mailError.message
            : "Nie udało się wysłać e-maila przez Brevo.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
