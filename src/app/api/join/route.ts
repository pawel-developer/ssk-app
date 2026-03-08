import { createAdminClient } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    email, password, first_name, last_name, phone,
    university, field_of_study, year_of_study, status,
    birth_date, address, citizenship, rodo_consent,
  } = body;

  if (!email || !password || !first_name || !last_name) {
    return NextResponse.json(
      { error: "Wymagane pola: email, hasło, imię, nazwisko" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Hasło musi mieć co najmniej 6 znaków" },
      { status: 400 }
    );
  }

  if (!rodo_consent) {
    return NextResponse.json(
      { error: "Wymagana zgoda na przetwarzanie danych osobowych" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: existingUsers } = await admin.auth.admin.listUsers();
  if (existingUsers?.users?.some((u) => u.email?.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json(
      { error: "Konto z tym adresem e-mail już istnieje. Jeśli to Twoje konto, zaloguj się." },
      { status: 409 }
    );
  }

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email: email.toLowerCase().trim(),
    password,
    email_confirm: true,
  });

  if (createError || !newUser.user) {
    return NextResponse.json(
      { error: createError?.message || "Nie udało się utworzyć konta" },
      { status: 500 }
    );
  }

  const profileData: Record<string, unknown> = {
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    phone: phone?.trim() || "",
    university: university?.trim() || "",
    field_of_study: field_of_study?.trim() || "",
    year_of_study: year_of_study?.trim() || "",
    status: status || "student",
    rodo_consent: !!rodo_consent,
    join_date: new Date().toISOString().split("T")[0],
  };

  if (birth_date) profileData.birth_date = birth_date;
  if (address) profileData.address = address.trim();
  if (citizenship) profileData.citizenship = citizenship.trim();

  const { error: updateError } = await admin
    .from("profiles")
    .update(profileData)
    .eq("id", newUser.user.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Konto utworzone, ale nie udało się zapisać profilu: " + updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
