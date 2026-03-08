import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Brak URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1",
        "Accept": "text/html",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json({ error: `HTTP ${res.status}` }, { status: 502 });
    }

    const html = await res.text();

    const extract = (property: string): string | null => {
      const patterns = [
        new RegExp(`<meta\\s+property=["']${property}["']\\s+content=["']([^"']+)["']`, "i"),
        new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${property}["']`, "i"),
      ];
      for (const re of patterns) {
        const m = html.match(re);
        if (m) return m[1];
      }
      return null;
    };

    const title = extract("og:title");
    const image = extract("og:image");
    const description = extract("og:description");

    let date: string | null = null;
    const dateMatch = html.match(/"startTimestamp"\s*:\s*(\d+)/);
    if (dateMatch) {
      const d = new Date(parseInt(dateMatch[1]) * 1000);
      date = d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
    }

    return NextResponse.json({ title, image, description, date });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fetch failed" },
      { status: 502 }
    );
  }
}
