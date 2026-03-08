import { NextRequest, NextResponse } from "next/server";

/**
 * Translation API: PL↔EN.
 * - With OPENAI_API_KEY in env: uses GPT-4o-mini with SSK landing-page context (better, consistent terminology).
 * - Without: falls back to MyMemory (free, ~450 chars/request).
 */
const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

const SSK_CONTEXT = `You are translating content for the SSK website (Studenckie Stowarzyszenie Kardiologiczne — Polish Student Cardiology Association).
SSK is a nationwide association for medical and science students (and graduates up to 3 years) interested in cardiology. They run workshops (ECHO, ECG, simulations), summer schools, conferences, and cooperate with student scientific circles (SKN) and universities (WUM, GUMed, UJ, etc.).
Rules: Keep "SSK" unchanged. Use clear, formal but friendly British English. Preserve Polish university/city names in standard form (e.g. Gdańsk, Wrocław, Warszawa). For medical/student terms use standard UK English. Return ONLY the translated text, no quotes or explanation.`;

type TranslateContext = {
  section?: string;
  fieldLabel?: string;
  /** Other text from the same section (e.g. other lines) for consistency */
  surroundingText?: string;
};

function buildOpenAIPrompt(
  text: string,
  context: TranslateContext | undefined,
  from: string,
  to: string
): string {
  const dir = from === "pl" && to === "en" ? "Polish to English" : "English to Polish";
  let user = `Translate the following from ${dir}.\n\nText to translate:\n${text}`;
  if (context?.section || context?.fieldLabel) {
    user = `Context on our landing page: ${[context.section, context.fieldLabel].filter(Boolean).join(" — ")}\n\n` + user;
  }
  if (context?.surroundingText) {
    user += `\n\nOther content in this section (for consistency):\n${context.surroundingText}`;
  }
  return user;
}

async function translateWithOpenAI(
  text: string,
  context: TranslateContext | undefined,
  from: string,
  to: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return "";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SSK_CONTEXT },
        { role: "user", content: buildOpenAIPrompt(text, context, from, to) },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI ${res.status}`);
  }

  const data = await res.json();
  const translated = data.choices?.[0]?.message?.content?.trim();
  if (!translated) throw new Error("Empty translation");
  return translated;
}

async function translateWithMyMemory(text: string, from: string, to: string): Promise<string> {
  const params = new URLSearchParams({
    q: text,
    langpair: `${from}|${to}`,
  });
  const res = await fetch(`${MYMEMORY_URL}?${params}`, {
    headers: { "User-Agent": "SSK-Admin/1.0" },
  });
  if (!res.ok) return "";
  const data = await res.json();
  if (data.responseStatus !== 200) return "";
  return data.responseData?.translatedText || text;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, from = "pl", to = "en", context } = body as {
    text?: string;
    from?: string;
    to?: string;
    context?: TranslateContext;
  };

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Brak tekstu do tłumaczenia" }, { status: 400 });
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return NextResponse.json({ translated: "" });
  }

  // MyMemory limit ~500 bytes; OpenAI supports longer
  const useOpenAI = !!process.env.OPENAI_API_KEY;
  if (!useOpenAI && trimmed.length > 450) {
    return NextResponse.json({ error: "Tekst zbyt długi (max ~450 znaków). Ustaw OPENAI_API_KEY dla dłuższych tekstów." }, { status: 400 });
  }

  try {
    let translated: string;
    if (useOpenAI) {
      translated = await translateWithOpenAI(trimmed, context, from, to);
    } else {
      translated = await translateWithMyMemory(trimmed, from, to);
    }
    if (!translated) {
      return NextResponse.json({ error: "Błąd tłumaczenia" }, { status: 502 });
    }
    return NextResponse.json({ translated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Błąd tłumaczenia" },
      { status: 502 }
    );
  }
}
