import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { buildCertificateFileName, buildCertificatePath, renderCertificatePdf } from "@/lib/certificates";
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

export async function POST() {
  const serverSupabase = await createClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nie zalogowano" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, first_name, last_name, join_date, fee_valid_until, is_archived")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Nie znaleziono profilu członka" }, { status: 404 });
  }

  if (profile.is_archived) {
    return NextResponse.json({ error: "Byli członkowie nie mogą pobierać certyfikatu" }, { status: 403 });
  }

  if (!isMembershipActiveByDate(profile.fee_valid_until)) {
    return NextResponse.json({ error: "Certyfikat jest dostępny tylko dla aktywnych członków" }, { status: 403 });
  }

  const filePath = buildCertificatePath(profile.id);
  const fileName = buildCertificateFileName(profile.first_name, profile.last_name);

  const { data: existingFile } = await admin.storage.from("certificates").list(profile.id, {
    search: "certificate.pdf",
    limit: 1,
  });

  if (!existingFile || existingFile.length === 0) {
    const pdfBytes = await renderCertificatePdf({
      firstName: profile.first_name,
      lastName: profile.last_name,
      joinDate: profile.join_date,
    });

    const { error: uploadError } = await admin.storage.from("certificates").upload(filePath, pdfBytes, {
      contentType: "application/pdf",
      upsert: true,
    });

    if (uploadError) {
      return NextResponse.json({ error: "Nie udało się wygenerować certyfikatu" }, { status: 500 });
    }
  }

  const { data: signedUrlData } = await admin.storage.from("certificates").createSignedUrl(filePath, 300, {
    download: fileName,
  });

  if (!signedUrlData?.signedUrl) {
    return NextResponse.json({ error: "Nie udało się wygenerować linku do pobrania" }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: signedUrlData.signedUrl, fileName });
}
