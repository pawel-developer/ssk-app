import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { buildCertificatePath, renderCertificatePdf } from "@/lib/certificates";
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

type MemberRow = {
  id: string;
  first_name: string;
  last_name: string;
  join_date: string | null;
  fee_valid_until: string | null;
  is_archived: boolean;
};

export async function POST() {
  const serverSupabase = await createClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nie zalogowano" }, { status: 401 });
  }

  const { data: requester } = await serverSupabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!requester?.is_admin) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: members, error: membersError } = await admin
    .from("profiles")
    .select("id, first_name, last_name, join_date, fee_valid_until, is_archived");

  if (membersError) {
    return NextResponse.json({ error: "Nie udało się pobrać członków" }, { status: 500 });
  }

  const activeMembers = (members ?? []).filter(
    (member) => !member.is_archived && isMembershipActiveByDate(member.fee_valid_until)
  ) as MemberRow[];
  const failures: string[] = [];
  let generated = 0;

  for (const member of activeMembers) {
    try {
      const pdfBytes = await renderCertificatePdf({
        firstName: member.first_name,
        lastName: member.last_name,
        joinDate: member.join_date,
      });

      const { error: uploadError } = await admin.storage.from("certificates").upload(buildCertificatePath(member.id), pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

      if (uploadError) {
        failures.push(member.id);
        continue;
      }
      generated += 1;
    } catch {
      failures.push(member.id);
    }
  }

  return NextResponse.json({
    success: true,
    totalActive: activeMembers.length,
    generated,
    failed: failures.length,
    failedMemberIds: failures.slice(0, 20),
  });
}
