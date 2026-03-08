import { createAdminClient } from "@/lib/supabase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    email, password, first_name, last_name, phone, pesel,
    university, field_of_study, status,
    birth_date, birth_place, address, citizenship,
    studies_start_date, studies_end_date,
    statute_consent, rodo_consent,
  } = body;

  if (!email || !password || !first_name || !last_name) {
    return NextResponse.json(
      { error: "Wymagane pola: email, hasło, imię, nazwisko" },
      { status: 400 }
    );
  }

  if (!pesel || !/^\d{11}$/.test(pesel)) {
    return NextResponse.json(
      { error: "PESEL musi zawierać 11 cyfr" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Hasło musi mieć co najmniej 6 znaków" },
      { status: 400 }
    );
  }

  if (!statute_consent) {
    return NextResponse.json(
      { error: "Wymagana akceptacja Statutu SSK" },
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
    pesel: pesel?.trim() || "",
    university: university?.trim() || "",
    field_of_study: field_of_study?.trim() || "",
    status: status || "",
    statute_consent: !!statute_consent,
    rodo_consent: !!rodo_consent,
    join_date: new Date().toISOString().split("T")[0],
  };

  if (birth_date) profileData.birth_date = birth_date;
  if (birth_place) profileData.birth_place = birth_place.trim();
  if (address) profileData.address = address.trim();
  if (citizenship) profileData.citizenship = citizenship.trim();
  if (studies_start_date) profileData.studies_start_date = studies_start_date;
  if (studies_end_date) profileData.studies_end_date = studies_end_date;

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
