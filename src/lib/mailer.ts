import { createAdminClient } from "@/lib/supabase-admin";

type BrevoRecipient = {
  email: string;
  name?: string;
};

type SendBrevoEmailParams = {
  to: BrevoRecipient[];
  subject: string;
  htmlContent: string;
};

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

type EmailTemplate = {
  subject: string;
  body: string;
};

type EventPreviewVars = {
  firstName: string;
  eventTitle: string;
  eventFbUrl: string;
  eventEmailDescriptionLine: string;
  eventMeetingLink: string;
};

export type EmailTemplatesContent = {
  welcome: EmailTemplate;
  payment_confirmed: EmailTemplate;
  payment_rejected: EmailTemplate;
  payment_reminder: EmailTemplate;
  birthday: EmailTemplate;
  event_announcement: EmailTemplate;
  event_meeting_link: EmailTemplate;
};

const DEFAULT_EMAIL_TEMPLATES: EmailTemplatesContent = {
  welcome: {
    subject: "Witamy w SSK",
    body: "Cześć {{firstName}},\n\nDziękujemy za rejestrację w Studenckim Stowarzyszeniu Kardiologicznym.\nTwoje konto zostało utworzone i możesz się już zalogować.\n\nPozdrawiamy,\nSSK",
  },
  payment_confirmed: {
    subject: "Składka członkowska została potwierdzona",
    body: "Cześć {{firstName}},\n\nTwoja płatność składki członkowskiej została potwierdzona.\nSkładka jest aktywna do: {{feeValidUntil}}.\n\nDziękujemy,\nSSK",
  },
  payment_rejected: {
    subject: "Weryfikacja płatności wymaga poprawy",
    body: "Cześć {{firstName}},\n\nNie udało się potwierdzić przesłanego potwierdzenia płatności.\n{{reasonLine}}\n\nMożesz przesłać nowe potwierdzenie w panelu członka.\nPozdrawiamy,\nSSK",
  },
  payment_reminder: {
    subject: "Przypomnienie o składce członkowskiej SSK",
    body: "Cześć {{firstName}},\n\nPrzypominamy o opłaceniu składki członkowskiej SSK.\n{{feeValidUntilLine}}\n\nJak opłacić składkę przez panel członka:\n1) Zaloguj się do panelu członka.\n2) Przejdź do zakładki: Płatności.\n3) Wykonaj przelew na numer konta widoczny w panelu.\n4) Wgraj potwierdzenie przelewu (JPG/PNG/PDF) i kliknij \"Wyślij potwierdzenie\".\n\nPo weryfikacji przez zarząd status składki zostanie zaktualizowany.\n\nPozdrawiamy,\nSSK",
  },
  birthday: {
    subject: "Najlepsze życzenia urodzinowe od SSK",
    body: "Cześć {{firstName}},\n\nW dniu Twoich urodzin życzymy Ci dużo zdrowia, sukcesów i satysfakcji z rozwoju w kardiologii.\n\nWszystkiego najlepszego!\nSSK",
  },
  event_announcement: {
    subject: "🫀 Zaproszenie na wydarzenie SSK: {{eventTitle}}",
    body: "Cześć {{firstName}},\n\nMamy przyjemność zaprosić Cię na wydarzenie organizowane przez Studenckie Stowarzyszenie Kardiologiczne: {{eventTitle}}.\n{{eventEmailDescriptionLine}}\n\nWięcej informacji znajdziesz tutaj: {{eventFbUrl}}\n\nMamy nadzieję, że dołączysz do nas!\n\nPozdrawiamy,\nZespół SSK",
  },
  event_meeting_link: {
    subject: "🫀 Link do spotkania: {{eventTitle}}",
    body: "Cześć {{firstName}},\n\nPrzesyłamy link do spotkania dotyczącego wydarzenia: {{eventTitle}}.\n\nLink do spotkania: {{eventMeetingLink}}\n\nDo zobaczenia!\n\nPozdrawiamy,\nZespół SSK",
  },
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSender() {
  const email = process.env.BREVO_FROM_EMAIL;
  const name = process.env.BREVO_FROM_NAME || "SSK";
  return { email, name };
}

function toPlainObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeTemplate(
  value: unknown,
  fallback: EmailTemplate
): EmailTemplate {
  const obj = toPlainObject(value);
  const subject = typeof obj.subject === "string" && obj.subject.trim()
    ? obj.subject
    : fallback.subject;
  const body = typeof obj.body === "string" && obj.body.trim()
    ? obj.body
    : fallback.body;
  return { subject, body };
}

function mergeTemplates(content: unknown): EmailTemplatesContent {
  const obj = toPlainObject(content);
  return {
    welcome: normalizeTemplate(obj.welcome, DEFAULT_EMAIL_TEMPLATES.welcome),
    payment_confirmed: normalizeTemplate(
      obj.payment_confirmed,
      DEFAULT_EMAIL_TEMPLATES.payment_confirmed
    ),
    payment_rejected: normalizeTemplate(
      obj.payment_rejected,
      DEFAULT_EMAIL_TEMPLATES.payment_rejected
    ),
    payment_reminder: normalizeTemplate(
      obj.payment_reminder,
      DEFAULT_EMAIL_TEMPLATES.payment_reminder
    ),
    birthday: normalizeTemplate(obj.birthday, DEFAULT_EMAIL_TEMPLATES.birthday),
    event_announcement: normalizeTemplate(
      obj.event_announcement,
      DEFAULT_EMAIL_TEMPLATES.event_announcement
    ),
    event_meeting_link: normalizeTemplate(
      obj.event_meeting_link,
      DEFAULT_EMAIL_TEMPLATES.event_meeting_link
    ),
  };
}

export async function loadEmailTemplates(): Promise<EmailTemplatesContent> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("site_content")
      .select("content")
      .eq("id", "email_templates")
      .maybeSingle();
    return mergeTemplates(data?.content);
  } catch {
    return DEFAULT_EMAIL_TEMPLATES;
  }
}

function renderTemplate(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    return vars[key] ?? "";
  });
}

function textToParagraphHtml(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function renderTemplateToHtml(text: string, vars: Record<string, string>) {
  const rendered = renderTemplate(text, vars);
  return textToParagraphHtml(escapeHtml(rendered));
}

const LOGO_URL = "https://studenckiekardio.pl/img/ssk-logo-sm.png";
const ORG_NAME = "Studenckie Stowarzyszenie Kardiologiczne";

export function wrapInBrandedLayout(innerHtml: string, options?: { ctaLabel?: string; ctaUrl?: string }) {
  const ctaBlock = options?.ctaUrl && options?.ctaLabel
    ? `<div style="text-align:center;margin:24px 0;">
        <a href="${options.ctaUrl}" style="display:inline-block;padding:14px 28px;background:#dc2626;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">${options.ctaLabel}</a>
      </div>`
    : "";

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;padding:40px 16px;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
    <div style="background:#0f172a;padding:24px;text-align:center;">
      <img src="${LOGO_URL}" alt="SSK" width="48" height="48" style="display:inline-block;" />
      <div style="color:#ffffff;font-size:16px;font-weight:700;margin-top:8px;">${ORG_NAME}</div>
    </div>
    <div style="padding:32px 24px;color:#0f172a;font-size:14px;line-height:1.6;">
      ${innerHtml}
      ${ctaBlock}
    </div>
    <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} ${ORG_NAME}</p>
    </div>
  </div>
</div>`;
}

export async function sendBrevoEmail(params: SendBrevoEmailParams) {
  const apiKey = process.env.BREVO_API_KEY;
  const sender = getSender();

  if (!apiKey || !sender.email) {
    throw new Error("Missing BREVO_API_KEY or BREVO_FROM_EMAIL");
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender,
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo send failed (${response.status}): ${body}`);
  }
}

export async function sendWelcomeEmail(
  toEmail: string,
  firstName: string,
  templates?: EmailTemplatesContent
) {
  const currentTemplates = templates ?? (await loadEmailTemplates());
  const tpl = currentTemplates.welcome;

  await sendBrevoEmail({
    to: [{ email: toEmail, name: firstName }],
    subject: tpl.subject,
    htmlContent: wrapInBrandedLayout(renderTemplateToHtml(tpl.body, { firstName })),
  });
}

export async function sendPaymentConfirmedEmail(
  toEmail: string,
  firstName: string,
  feeValidUntil: string,
  templates?: EmailTemplatesContent
) {
  const currentTemplates = templates ?? (await loadEmailTemplates());
  const tpl = currentTemplates.payment_confirmed;

  await sendBrevoEmail({
    to: [{ email: toEmail, name: firstName }],
    subject: tpl.subject,
    htmlContent: wrapInBrandedLayout(renderTemplateToHtml(tpl.body, { firstName, feeValidUntil })),
  });
}

export async function sendPaymentRejectedEmail(
  toEmail: string,
  firstName: string,
  reason?: string | null,
  templates?: EmailTemplatesContent
) {
  const currentTemplates = templates ?? (await loadEmailTemplates());
  const tpl = currentTemplates.payment_rejected;
  const reasonLine = reason?.trim()
    ? `Powód odrzucenia: ${reason.trim()}`
    : "W razie pytań skontaktuj się z nami, aby wyjaśnić szczegóły.";

  await sendBrevoEmail({
    to: [{ email: toEmail, name: firstName }],
    subject: tpl.subject,
    htmlContent: wrapInBrandedLayout(renderTemplateToHtml(tpl.body, { firstName, reasonLine })),
  });
}

export async function sendPaymentReminderEmail(
  toEmail: string,
  firstName: string,
  feeValidUntil: string | null,
  templates?: EmailTemplatesContent
) {
  const currentTemplates = templates ?? (await loadEmailTemplates());
  const tpl = currentTemplates.payment_reminder;
  const feeValidUntilLine = feeValidUntil
    ? `Obecna składka była ważna do: ${feeValidUntil}.`
    : "Nie mamy odnotowanej aktywnej składki w Twoim profilu.";

  await sendBrevoEmail({
    to: [{ email: toEmail, name: firstName }],
    subject: tpl.subject,
    htmlContent: wrapInBrandedLayout(renderTemplateToHtml(tpl.body, { firstName, feeValidUntilLine })),
  });
}

export async function sendEventAnnouncementEmail(
  toEmail: string,
  firstName: string,
  eventTitle: string,
  eventFbUrl: string,
  eventEmailDescription: string,
  templates?: EmailTemplatesContent
) {
  const currentTemplates = templates ?? (await loadEmailTemplates());
  const tpl = currentTemplates.event_announcement;
  const eventEmailDescriptionLine = eventEmailDescription.trim()
    ? eventEmailDescription.trim()
    : "Szczegóły wydarzenia znajdziesz pod poniższym linkiem.";

  await sendBrevoEmail({
    to: [{ email: toEmail, name: firstName }],
    subject: renderTemplate(tpl.subject, {
      eventTitle,
      eventFbUrl,
      eventEmailDescriptionLine,
      firstName,
    }),
    htmlContent: wrapInBrandedLayout(
      renderTemplateToHtml(tpl.body, {
        eventTitle,
        eventFbUrl,
        eventEmailDescriptionLine,
        firstName,
      }),
      eventFbUrl ? { ctaLabel: "Zobacz wydarzenie", ctaUrl: eventFbUrl } : undefined
    ),
  });
}

export async function sendEventMeetingLinkEmail(
  toEmail: string,
  firstName: string,
  eventTitle: string,
  eventMeetingLink: string,
  templates?: EmailTemplatesContent
) {
  const currentTemplates = templates ?? (await loadEmailTemplates());
  const tpl = currentTemplates.event_meeting_link;

  await sendBrevoEmail({
    to: [{ email: toEmail, name: firstName }],
    subject: renderTemplate(tpl.subject, {
      eventTitle,
      eventMeetingLink,
      firstName,
    }),
    htmlContent: wrapInBrandedLayout(
      renderTemplateToHtml(tpl.body, {
        eventTitle,
        eventMeetingLink,
        firstName,
      }),
      eventMeetingLink ? { ctaLabel: "Dołącz do spotkania", ctaUrl: eventMeetingLink } : undefined
    ),
  });
}

export function renderEventEmailPreview(
  mailType: "announcement" | "meeting_link",
  vars: EventPreviewVars,
  templates: EmailTemplatesContent
) {
  const tpl =
    mailType === "announcement"
      ? templates.event_announcement
      : templates.event_meeting_link;

  return {
    subject: renderTemplate(tpl.subject, vars),
    body: renderTemplate(tpl.body, vars),
  };
}
