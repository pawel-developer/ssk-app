import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const filename = (formData.get("filename") as string) || "";
    const widthStr = formData.get("width") as string | null;
    const heightStr = formData.get("height") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Brak pliku" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const width = widthStr ? parseInt(widthStr, 10) : undefined;
    const height = heightStr ? parseInt(heightStr, 10) : undefined;

    let pipeline = sharp(buffer);

    if (width || height) {
      pipeline = pipeline.resize(width || undefined, height || undefined, {
        fit: "cover",
        withoutEnlargement: true,
      });
    }

    const webpBuffer = await pipeline.webp({ quality: 85 }).toBuffer();

    const safeName = filename
      ? filename.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const outputName = `${safeName}.webp`;

    const supabase = createAdminClient();
    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(outputName, webpBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: urlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(outputName);

    return NextResponse.json({ path: urlData.publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Błąd uploadu" },
      { status: 500 },
    );
  }
}
