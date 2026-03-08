-- =============================================================
-- SSK Members Seed Data
-- Generated from: SSK Masterfile - Lista-Czlonkow.csv
-- Members: 185
-- =============================================================
-- Run this in Supabase Dashboard → SQL Editor
-- IMPORTANT: Run migration.sql FIRST if you haven't already!
-- =============================================================

-- Step 1: Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pesel text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS citizenship text DEFAULT 'polskie';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rodo_consent boolean DEFAULT false;

-- Step 2: Update status constraint to include all needed values
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check
  CHECK (status IN ('student', 'absolwent', 'rezydent', 'stażysta', 'inny'));

-- Step 3: Create auth users → trigger auto-creates profile → update profile
DO $$
DECLARE
  new_uid uuid;
BEGIN

  -- [1] Krzysztof Badura
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'chrbad0@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'chrbad0@gmail.com',
      crypt('GL2sh9q6', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Krzysztof',
      last_name = 'Badura',
      phone = '504840974',
      university = 'Uniwersytet Medyczny w Łodzi',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-11-06',
      birth_date = '2001-09-28',
      pesel = '1292812032',
      address = 'ul. Morelowa 6/18 30-222 Kraków',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-05',
      fee_valid_until = '2026-11-06',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [2] Adrian Norbert Bednarek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'adikbednarek@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'adikbednarek@gmail.com',
      crypt('91aEX8ny', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Adrian Norbert',
      last_name = 'Bednarek',
      phone = '530265230',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-06',
      birth_date = '2003-01-28',
      pesel = '3212803456',
      address = 'ul. Rajska 5/32, 02-645 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-01',
      fee_valid_until = '2026-11-06',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [3] Mikołaj Jan Broncel
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mikolajbroncel@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'mikolajbroncel@gmail.com',
      crypt('Fs25v5Zs', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Mikołaj Jan',
      last_name = 'Broncel',
      phone = '517621063',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-07',
      birth_date = '2002-11-08',
      pesel = '2310804752',
      address = 'ul. Przyszłości 37 42-470 Żelisławice',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-27',
      fee_valid_until = '2026-11-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [4] Zuzanna Głowacka
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'zuzanna.glowacka12@onet.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'zuzanna.glowacka12@onet.pl',
      crypt('4Q9bEc3b', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Zuzanna',
      last_name = 'Głowacka',
      phone = '735983133',
      university = 'Collegium Medicum Uniwersytet Mikołaja Kopernika w Toruniu',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-07',
      birth_date = '2000-08-28',
      pesel = '282810209',
      address = 'ul Księży Młyn 2/3, 90-345 Łódź',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-07',
      fee_valid_until = '2025-11-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [5] Karolina Ignaczak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'k.ignaczak@interia.eu') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'k.ignaczak@interia.eu',
      crypt('36V7Iuvp', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Karolina',
      last_name = 'Ignaczak',
      phone = '796512005',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2024-11-07',
      birth_date = '2005-04-29',
      pesel = '5242903283',
      address = 'ul. Mołdawska 4/129, 02-127 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-26',
      fee_valid_until = '2026-11-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [6] Konrad Bogdan Jabłoński
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'konrad.b.jablonski@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'konrad.b.jablonski@gmail.com',
      crypt('48cdm4SP', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Konrad Bogdan',
      last_name = 'Jabłoński',
      phone = '784699622',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-07',
      birth_date = '1999-04-15',
      pesel = '99041510210',
      address = 'ul. Marcina Kasprzaka 29/1035 01-234 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-07',
      fee_valid_until = '2025-11-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [7] Marcel Kurek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marcel.kurek333@onet.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'marcel.kurek333@onet.pl',
      crypt('2A3Gnlb4', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Marcel',
      last_name = 'Kurek',
      phone = '665926826',
      university = 'Uniwersytet medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2024-11-07',
      birth_date = '2003-08-27',
      pesel = '3282700873',
      address = 'ul. Żnińska 5      62-110 Damasławek',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-15',
      fee_valid_until = '2026-11-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [8] Jakub Kacper Lewiński
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jakublewinski1506@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'jakublewinski1506@gmail.com',
      crypt('bG8oP6x8', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Jakub Kacper',
      last_name = 'Lewiński',
      phone = '721646092',
      university = 'Collegium Medicum Uniwersytet Mikołaja Kopernika w Toruniu',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-11-07',
      birth_date = '2000-06-15',
      pesel = '261500556',
      address = 'ul. Lipowa 2        77-300 Rychnowy',
      citizenship = 'polskie',
      rodo_consent = false,
      fee_active = true,
      last_payment_date = '2025-11-26',
      fee_valid_until = '2026-11-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [9] Julia Musiał
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'julmusi2003@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'julmusi2003@gmail.com',
      crypt('L4P3dw9b', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Julia',
      last_name = 'Musiał',
      phone = '534791064',
      university = 'Śląski Uniwersytet Medyczny w Katowicach',
      field_of_study = 'lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2024-11-07',
      birth_date = '2003-11-05',
      pesel = '3310502862',
      address = 'ul. Gliwicka 105A/5.1 40-855 Katowice',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-07',
      fee_valid_until = '2025-11-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [10] Jakub Zabłocki
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kuba.zablocki@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'kuba.zablocki@wp.pl',
      crypt('6ix7ALh5', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Jakub',
      last_name = 'Zabłocki',
      phone = '721082001',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-11-07',
      birth_date = '2001-08-22',
      pesel = '1282204755',
      address = 'ul. Karolkowa 28/5 01-207 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-07',
      fee_valid_until = '2026-11-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [11] Martyna Świerkowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'm.swierku2@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'm.swierku2@gmail.com',
      crypt('PO9z5k3s', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Martyna',
      last_name = 'Świerkowska',
      phone = '692185927',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2024-11-07',
      birth_date = '2005-03-02',
      pesel = '5230210384',
      address = 'ul. Ludwisarska 9/71 04-210 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-07',
      fee_valid_until = '2026-11-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [12] Natan Adamów
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'natan.adamow@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'natan.adamow@gmail.com',
      crypt('RJ516mld', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Natan',
      last_name = 'Adamów',
      phone = '881080720',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-08',
      birth_date = '2002-08-18',
      pesel = '2281800652',
      address = 'ul. Kopernika 12a/7 73-155 Węgorzyno',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-08',
      fee_valid_until = '2026-11-08',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [13] Hubert Armin Cielica
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hubertcielica@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'hubertcielica@gmail.com',
      crypt('R42s3Omx', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Hubert Armin',
      last_name = 'Cielica',
      phone = '510737313',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2024-11-08',
      birth_date = '2003-06-22',
      pesel = '(brak)',
      address = 'ul. Leszczynowa 58B/14, 80-175 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-28',
      fee_valid_until = '2026-11-08',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [14] Maria Karolina Łuszczyn
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marialuszczyn1@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'marialuszczyn1@gmail.com',
      crypt('Qyka20O0', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Maria Karolina',
      last_name = 'Łuszczyn',
      phone = '507223085',
      university = 'Collegium Medicum Uniwesytetu Zielonogórskiego',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-08',
      birth_date = '2002-03-23',
      pesel = '2232308543',
      address = 'ul Łężyca-Ciesielska 10B/3 66-016 Zielona Góra',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-26',
      fee_valid_until = '2026-11-08',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [15] Marta Kamila Chamera
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marta.chamera@op.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'marta.chamera@op.pl',
      crypt('Pc2a53sH', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Marta Kamila',
      last_name = 'Chamera',
      phone = '693656760',
      university = 'Górnośląskie Centrum Medyczne im. prof. Leszka Gieca, ŚUM Katowice',
      field_of_study = NULL,
      year_of_study = 'absolwent (2 lata po)',
      status = 'absolwent',
      join_date = '2024-11-12',
      birth_date = '1999-03-13',
      pesel = '99031304681',
      address = 'ul. Ziębia 14/5,   43-190 Mikołów',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-05',
      fee_valid_until = '2026-11-12',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [16] Iga Kałka
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'igakkal@icloud.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'igakkal@icloud.com',
      crypt('6a8FcfV4', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Iga',
      last_name = 'Kałka',
      phone = '532153079',
      university = 'Uniwersytet Andrzeja Frycza Modrzewskiego w Krakowie',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-12',
      birth_date = '2000-01-24',
      pesel = '212408483',
      address = 'ul. Gądzio-Kosa 6, 28-300 Jędrzejów',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-12',
      fee_valid_until = '2025-11-12',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [17] Weronika Anna Słomiana
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'weronika.slomiana@onet.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'weronika.slomiana@onet.pl',
      crypt('glv723MU', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Weronika Anna',
      last_name = 'Słomiana',
      phone = '794330139',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-11-12',
      birth_date = '2000-07-30',
      pesel = '273003126',
      address = '(brak adresu) (z przelewu: ul. Partyzantów 23 99-400 Łowicz)',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-15',
      fee_valid_until = '2026-11-12',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [18] Dominika Tomkiel
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'd.tomkiel@interia.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'd.tomkiel@interia.pl',
      crypt('383ClTuw', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Dominika',
      last_name = 'Tomkiel',
      phone = '531430290',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-13',
      birth_date = '2002-10-30',
      pesel = '2303005722',
      address = 'ul. Wołoska 82/41, 02-507 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-09',
      fee_valid_until = '2026-11-13',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [19] Alicja Róża Adamska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aalicja.adamska@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'aalicja.adamska@gmail.com',
      crypt('71gzK1Pv', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Alicja Róża',
      last_name = 'Adamska',
      phone = '662181915',
      university = 'Collegium Medicum Uniwersytet Mikołaja Kopernika w Toruniu',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-15',
      birth_date = '2001-07-31',
      pesel = '1273105566',
      address = 'ul. Na Wzgórzu 2, 85-327 Bydgoszcz',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-15',
      fee_valid_until = '2025-11-15',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [20] Maria Karolina Kurek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mkkurek2000@interia.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'mkkurek2000@interia.pl',
      crypt('oLe710sC', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Maria Karolina',
      last_name = 'Kurek',
      phone = '664391258',
      university = 'Uniwersytet Jagielloński',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-15',
      birth_date = '2000-10-26',
      pesel = '302601222',
      address = 'ul. Jastrzębia 6a, 30-622 Kraków',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-08',
      fee_valid_until = '2026-11-15',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [21] Małgorzata Anna Leśnik
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'malgorzatalesnik2002@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'malgorzatalesnik2002@gmail.com',
      crypt('O11uzmT6', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Małgorzata Anna',
      last_name = 'Leśnik',
      phone = '506968820',
      university = 'Śląski Uniwersytet Medyczny w Katowicach',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-15',
      birth_date = '2002-04-11',
      pesel = '2241104806',
      address = 'ul. Czmnu Społecznego 4a, 44-237 Stanowice',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-15',
      fee_valid_until = '2026-11-15',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [22] Patryk Rafał Macuk
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'patryk.macuk@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'patryk.macuk@gmail.com',
      crypt('0FwEz7i6', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Patryk Rafał',
      last_name = 'Macuk',
      phone = '733387882',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (2 lata po)',
      status = 'absolwent',
      join_date = '2024-11-15',
      birth_date = '1999-06-24',
      pesel = '99062409135',
      address = 'ul. Focha 13/6, 80-156 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-15',
      fee_valid_until = '2025-11-15',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [23] Karolina Jadwiga Nowak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'karolinajuraszek4@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'karolinajuraszek4@gmail.com',
      crypt('01OoAp2e', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Karolina Jadwiga',
      last_name = 'Nowak',
      phone = '797233310',
      university = 'Akademia Śląska',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-15',
      birth_date = NULL,
      pesel = '96021907448',
      address = 'ul. Zielona 80, 34-350 Węgierska Górka',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-15',
      fee_valid_until = '2025-11-15',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [24] Małgorzata Agnieszka Przybytkowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'malgorzata.przybytkowska@poczta.onet.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'malgorzata.przybytkowska@poczta.onet.pl',
      crypt('4rS5qL1t', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Małgorzata Agnieszka',
      last_name = 'Przybytkowska',
      phone = '797349323',
      university = 'Uniwersytet Medyczny w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2024-11-15',
      birth_date = '2003-04-24',
      pesel = '3242405668',
      address = 'ul. Głuszyna 210/1, 61-329 Poznań',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-15',
      fee_valid_until = '2025-11-15',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [25] Paweł Siuciak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pawelsiuciak1@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'pawelsiuciak1@gmail.com',
      crypt('Ai0Ko31v', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Paweł',
      last_name = 'Siuciak',
      phone = '690430483',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-15',
      birth_date = '1999-04-19',
      pesel = '99041900734',
      address = 'ul. Kartuska 34/10, Gdynia 81-002',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-15',
      fee_valid_until = '2026-11-15',
      is_admin = true
    WHERE id = new_uid;
  END IF;

  -- [26] Alicja Skrobucha
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'alicja.skrobucha.student@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'alicja.skrobucha.student@gmail.com',
      crypt('eG6s29Am', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Alicja',
      last_name = 'Skrobucha',
      phone = '723296206',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = NULL,
      year_of_study = 'absolwent (3 lata po)',
      status = 'absolwent',
      join_date = '2024-11-15',
      birth_date = '1998-02-11',
      pesel = '98021100760',
      address = 'ul. 1 Maja 6/61, 02-495 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-05',
      fee_valid_until = '2026-11-15',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [27] Karolina Springer
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'karolcix2000@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'karolcix2000@gmail.com',
      crypt('q7Hxh35U', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Karolina',
      last_name = 'Springer',
      phone = '609230312',
      university = 'Uniewesytet Medyczny w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-11-15',
      birth_date = '2000-02-21',
      pesel = '222101448',
      address = 'Bydgoska 28c/12, 59-220 Legnica',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-15',
      fee_valid_until = '2025-11-15',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [28] Mateusz Kazimierz Dźwil
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mdzwilu@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'mdzwilu@gmail.com',
      crypt('0oo0EE6b', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Mateusz Kazimierz',
      last_name = 'Dźwil',
      phone = '724656051',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-11-18',
      birth_date = '2001-09-17',
      pesel = '1291703614',
      address = 'ul. Wielkopolska 66/29, 80-180 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-28',
      fee_valid_until = '2026-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [29] Krzysztof Jakub Gołacki
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'krzysztofgolacki@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'krzysztofgolacki@gmail.com',
      crypt('Qm0o45Ro', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Krzysztof Jakub',
      last_name = 'Gołacki',
      phone = '782001907',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2024-11-18',
      birth_date = '1991-05-30',
      pesel = '91053012197',
      address = 'ul. Focha 2/32,   80-156 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-18',
      fee_valid_until = '2025-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [30] Aleksandra Karcińska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aleksandrakarcinska@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'aleksandrakarcinska@gmail.com',
      crypt('K7fqW34v', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksandra',
      last_name = 'Karcińska',
      phone = '739792996',
      university = 'Uniwersytet Jagielloński',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-18',
      birth_date = '2000-07-21',
      pesel = '272100428',
      address = 'ul. Bobrzyńskiego 45/76, 30-348 Kraków',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-18',
      fee_valid_until = '2025-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [31] Inga Komorowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'inga.komorowska3@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'inga.komorowska3@gmail.com',
      crypt('5l5HXx0i', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Inga',
      last_name = 'Komorowska',
      phone = '605578978',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2024-11-18',
      birth_date = '2003-03-02',
      pesel = '3230203144',
      address = 'ul. Jastrzębinowa 15, 62-002 Suchy Las',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-14',
      fee_valid_until = '2026-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [32] Ali Jan Kraziński
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'alikrazinski@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'alikrazinski@gmail.com',
      crypt('U7Z1jyc4', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Ali Jan',
      last_name = 'Kraziński',
      phone = '661163896',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-18',
      birth_date = '1999-06-07',
      pesel = '99060704898',
      address = 'ul. Rachcinek 59, 87-617 Bobrowniki',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-05',
      fee_valid_until = '2026-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [33] Anna Maria Lemańska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ania2000l@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ania2000l@wp.pl',
      crypt('698LooWa', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Anna Maria',
      last_name = 'Lemańska',
      phone = '506167345',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-18',
      birth_date = '2000-09-20',
      pesel = '292005923',
      address = 'ul. Batalionu Parasol 4, 09-410 Płock',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-15',
      fee_valid_until = '2026-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [34] Marta Kamila Mazur
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'martamazur@onet.eu') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'martamazur@onet.eu',
      crypt('s1dHQc93', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Marta Kamila',
      last_name = 'Mazur',
      phone = '515128190',
      university = 'American Heart of Poland',
      field_of_study = NULL,
      year_of_study = 'absolwent (3 lata po)',
      status = 'absolwent',
      join_date = '2024-11-18',
      birth_date = '1996-03-21',
      pesel = '96032103288',
      address = 'ul. Jana Pawła II 36, 42-300 Myszków',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-18',
      fee_valid_until = '2025-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [35] Wiktoria Jadwiga Mistarz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'wik.mistarz@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'wik.mistarz@wp.pl',
      crypt('Y9W1cjz3', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Wiktoria Jadwiga',
      last_name = 'Mistarz',
      phone = '693740500',
      university = 'Akademia Śląska',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-18',
      birth_date = '2002-08-31',
      pesel = '2283105281',
      address = 'ul. Szkolna 34, 43-173 Łaziska Górne',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-18',
      fee_valid_until = '2025-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [36] Magdalena Daniela Synak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'maag.syn@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'maag.syn@gmail.com',
      crypt('csQ7N46h', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Magdalena Daniela',
      last_name = 'Synak',
      phone = '512733987',
      university = 'Krakowska Akademia im. Andrzeja Frycza Modrzewskiego',
      field_of_study = NULL,
      year_of_study = 'absolwent (2 lata po)',
      status = 'absolwent',
      join_date = '2024-11-18',
      birth_date = '1992-09-25',
      pesel = '92092507066',
      address = 'ul. Altanowa 26, 43-300 Bielsko-Biała',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-18',
      fee_valid_until = '2026-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [37] Alicja Anna Tkaczyk
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ala.tkaczyk11@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ala.tkaczyk11@gmail.com',
      crypt('UYbn571p', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Alicja Anna',
      last_name = 'Tkaczyk',
      phone = '504455304',
      university = 'Śląski Uniwersytet Medyczny w Katowicach',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-18',
      birth_date = '2002-06-30',
      pesel = '2263005886',
      address = 'ul. Torfowa 13/18, 30-384 Kraków',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-26',
      fee_valid_until = '2026-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [38] Alicja Undro
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'alicja.undro@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'alicja.undro@gmail.com',
      crypt('Uyi0O41i', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Alicja',
      last_name = 'Undro',
      phone = '734196576',
      university = 'Akademia Śląska',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-18',
      birth_date = '2002-07-16',
      pesel = '2271606622',
      address = 'ul. Bukowa 9, Radwanice 59-160',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-18',
      fee_valid_until = '2026-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [39] Olga Anna Wiśniewska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'olga.wisniewska333@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'olga.wisniewska333@gmail.com',
      crypt('5xXNtu14', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Olga Anna',
      last_name = 'Wiśniewska',
      phone = '501172902',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = NULL,
      year_of_study = 'absolwent (2 lata po)',
      status = 'absolwent',
      join_date = '2024-11-18',
      birth_date = '1998-01-17',
      pesel = '98011704307',
      address = 'ul. Stachury 1/44, Gdańsk 80-280',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-29',
      fee_valid_until = '2026-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [40] Aniela Zaboklicka
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aniela.zaboklicka@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'aniela.zaboklicka@gmail.com',
      crypt('10f0aDcH', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aniela',
      last_name = 'Zaboklicka',
      phone = '693941840',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-18',
      birth_date = '2002-11-08',
      pesel = '2310808305',
      address = 'ul. Racławicka 1/3 Gdańsk, 80-406',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-18',
      fee_valid_until = '2025-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [41] Weronika Anna Ziółkowska-Żygas
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'weronika.ziolkow@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'weronika.ziolkow@gmail.com',
      crypt('5Rd5E7vr', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Weronika Anna',
      last_name = 'Ziółkowska-Żygas',
      phone = '724376268',
      university = 'CM UMK w Bydgoszczy',
      field_of_study = 'lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2024-11-18',
      birth_date = '1997-07-01',
      pesel = '97070107148',
      address = 'ul. Fordońska 4B/16, 85-085 Bydgoszcz',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-18',
      fee_valid_until = '2026-11-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [42] Filip Baszkowski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'baszkowskifilip@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'baszkowskifilip@gmail.com',
      crypt('Cj57uU9k', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Filip',
      last_name = 'Baszkowski',
      phone = '533412185',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-19',
      birth_date = '2000-08-16',
      pesel = '281605277',
      address = 'ul. Wojskowa 25/1, 60-802 Poznań',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-09',
      fee_valid_until = '2026-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [43] Mikołaj Jan Bańkowski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mbankowski41@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'mbankowski41@gmail.com',
      crypt('8dUJ5sj0', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Mikołaj Jan',
      last_name = 'Bańkowski',
      phone = '660291389',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2024-11-19',
      birth_date = '2003-10-25',
      pesel = '3302502555',
      address = 'ul. Wyzwolenia 127A, 20-368 Lublin',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-26',
      fee_valid_until = '2026-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [44] Szymon Biegała
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'szymon.biegala@student.umw.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'szymon.biegala@student.umw.edu.pl',
      crypt('YMphx857', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Szymon',
      last_name = 'Biegała',
      phone = '518493183',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-19',
      birth_date = '2002-07-20',
      pesel = '2272002878',
      address = 'ul. Łaziska 10B, 59-700 Bolesławiec',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-12',
      fee_valid_until = '2026-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [45] Emil Marek Brociek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'emil.brociek@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'emil.brociek@gmail.com',
      crypt('jeXK3x48', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Emil Marek',
      last_name = 'Brociek',
      phone = '600477971',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-11-19',
      birth_date = '2001-03-21',
      pesel = '1232109796',
      address = 'ul. Nowoursynowska 143D, 02-776 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-26',
      fee_valid_until = '2026-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [46] Julia Kościanek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'julia.koscianek00@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'julia.koscianek00@gmail.com',
      crypt('iD8iS67c', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Julia',
      last_name = 'Kościanek',
      phone = '721770780',
      university = 'Uniwersytet Jagielloński',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2024-11-19',
      birth_date = '2003-07-16',
      pesel = '3271608126',
      address = 'ul. Erazma Jerzmanowskiego 37/118, 30-836 Kraków',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-05',
      fee_valid_until = '2026-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [47] Natalia Krajewska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nataliakrjwsk@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'nataliakrjwsk@gmail.com',
      crypt('82LpHsg6', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Natalia',
      last_name = 'Krajewska',
      phone = '696091664',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-19',
      birth_date = '2001-01-31',
      pesel = '1213105683',
      address = 'ul. Taneczna 59H/7, 02-829 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-19',
      fee_valid_until = '2025-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [48] Ewa Alina Lewandowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ewa.alew@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ewa.alew@gmail.com',
      crypt('q8Xg2S1t', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Ewa Alina',
      last_name = 'Lewandowska',
      phone = '510431068',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-11-19',
      birth_date = '2001-11-21',
      pesel = '1312107689',
      address = 'ul Tczewska 2C/130, 01-674 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-19',
      fee_valid_until = '2025-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [49] Aleksandra Maria Matusiak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'a.matusiak@gumed.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'a.matusiak@gumed.edu.pl',
      crypt('wS0x5F0r', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksandra Maria',
      last_name = 'Matusiak',
      phone = '730568686',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-19',
      birth_date = '2002-07-22',
      pesel = '2272202360',
      address = 'ul. Obrońców Wybrzeża 25B/135, 80-398 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-19',
      fee_valid_until = '2025-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [50] Zofia Marianna Płonka
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'zplonka.zpo@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'zplonka.zpo@gmail.com',
      crypt('7c9xQLb7', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Zofia Marianna',
      last_name = 'Płonka',
      phone = '507025992',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2024-11-19',
      birth_date = '2004-05-04',
      pesel = '4250401145',
      address = 'ul. Podkomorska 14/1, 60-326 Poznań',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-19',
      fee_valid_until = '2025-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [51] Aleksandra Soloch
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ola.soloch@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ola.soloch@gmail.com',
      crypt('6AvYu2x0', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksandra',
      last_name = 'Soloch',
      phone = '790255554',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-19',
      birth_date = '2000-04-30',
      pesel = '243006744',
      address = 'ul. Cicha 10,      62-002 Złotniki',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-19',
      fee_valid_until = '2025-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [52] Julianna Klaudia Stachaczyk
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'julianna.stachaczyk@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'julianna.stachaczyk@gmail.com',
      crypt('7I0zQ6lu', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Julianna Klaudia',
      last_name = 'Stachaczyk',
      phone = '504872222',
      university = 'Śląski Uniwersytet Medyczny w Katowicach',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-19',
      birth_date = '2001-01-06',
      pesel = '1210602862',
      address = 'ul. Tunelowa 9, 40-676 Katowice',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-26',
      fee_valid_until = '2026-11-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [53] Gabriela Bołoz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'gabriela.boloz@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'gabriela.boloz@gmail.com',
      crypt('sd70Ps7P', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Gabriela',
      last_name = 'Bołoz',
      phone = '501157883',
      university = 'Śląski Uniwersytet Medyczny w Katowicach',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2024-11-20',
      birth_date = '2003-01-11',
      pesel = '3211107926',
      address = 'Żegiestoń 175B, 33-370 Muszyna',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-20',
      fee_valid_until = '2025-11-20',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [54] Michał Fonferek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'michal.fonferek@gumed.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'michal.fonferek@gumed.edu.pl',
      crypt('bo45N2cH', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Michał',
      last_name = 'Fonferek',
      phone = '532317964',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-11-20',
      birth_date = '2002-12-26',
      pesel = '2322604351',
      address = 'ul. Braniewska 64, 82-300 Elbląg',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-01',
      fee_valid_until = '2026-11-20',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [55] Natalia Kicińska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nataliakicinska1@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'nataliakicinska1@wp.pl',
      crypt('02zdlRY4', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Natalia',
      last_name = 'Kicińska',
      phone = '797549611',
      university = 'CM UMK w Bydgoszczy',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-11-21',
      birth_date = '2001-01-22',
      pesel = '1212200785',
      address = 'ul. Sciegiennego 4/12, Bydgoszcz',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-27',
      fee_valid_until = '2026-11-21',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [56] Yassine Motaouakkil
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ymotaouakkil@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ymotaouakkil@gmail.com',
      crypt('92hP7cgR', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Yassine',
      last_name = 'Motaouakkil',
      phone = '504629391',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = NULL,
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-21',
      birth_date = '1996-09-09',
      pesel = '96090914675',
      address = NULL,
      citizenship = 'marokańskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-21',
      fee_valid_until = '2026-11-21',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [57] Anastazja Murawska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'murawska.anastazja09@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'murawska.anastazja09@gmail.com',
      crypt('vzI490Mu', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Anastazja',
      last_name = 'Murawska',
      phone = '783086510',
      university = 'Uniwersytet Opolski',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-11-21',
      birth_date = '2000-01-07',
      pesel = '210703207',
      address = 'ul. Sadowa 3, 16-515 Puńsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-05',
      fee_valid_until = '2026-11-21',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [58] Julia Urbańska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'juula522@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'juula522@gmail.com',
      crypt('43lX7fCr', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Julia',
      last_name = 'Urbańska',
      phone = '603855028',
      university = 'Szpital Wolski im. dr Anny Gostyńskiej Sp. z o.o.',
      field_of_study = NULL,
      year_of_study = 'absolwent (2 lata po)',
      status = 'absolwent',
      join_date = '2024-11-22',
      birth_date = '1999-07-29',
      pesel = '99072903401',
      address = 'ul. Słowackiego 2/91, 05-250 Radzymin',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-22',
      fee_valid_until = '2025-11-22',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [59] Paulina Barbara Lewandowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'plewandowska111@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'plewandowska111@gmail.com',
      crypt('4h5E8rcB', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Paulina Barbara',
      last_name = 'Lewandowska',
      phone = '662066686',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-11-28',
      birth_date = '2000-09-30',
      pesel = '293010265',
      address = 'ul. Stefana Baleya 8/32, 02-132 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-08',
      fee_valid_until = '2026-11-28',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [60] Anna Weronika Olejniczak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'a.olejniczak66@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'a.olejniczak66@gmail.com',
      crypt('KO2ur8v3', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Anna Weronika',
      last_name = 'Olejniczak',
      phone = '690013184',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2024-11-28',
      birth_date = '2004-12-08',
      pesel = '4320802946',
      address = 'ul. Domaniewska 24/110, 02-672 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-11-28',
      fee_valid_until = '2025-11-28',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [61] Klaudia Maria Porębska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'k.porebska22@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'k.porebska22@gmail.com',
      crypt('eDar98G5', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Klaudia Maria',
      last_name = 'Porębska',
      phone = '666860771',
      university = 'Akademia Śląska',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-12-04',
      birth_date = '1995-04-22',
      pesel = '95042206107',
      address = 'ul. Klonowa 7/53, 41-800 Zabrze',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-12-04',
      fee_valid_until = '2025-12-04',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [62] Agnieszka Mariowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'agnieszkamarkowska18@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'agnieszkamarkowska18@gmail.com',
      crypt('83j0cZcA', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Agnieszka',
      last_name = 'Mariowska',
      phone = '733211463',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2024-12-05',
      birth_date = '1999-04-09',
      pesel = '99040908221',
      address = 'ul. Jugosłowiańska 52B/5, 60-149 Poznań',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-12-05',
      fee_valid_until = '2025-12-05',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [63] Antonina Ewa Gajda-Janiak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'antoninagajdajaniak@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'antoninagajdajaniak@gmail.com',
      crypt('jG3qW12m', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Antonina Ewa',
      last_name = 'Gajda-Janiak',
      phone = '883643468',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2024-12-09',
      birth_date = '2002-03-09',
      pesel = '2230906286',
      address = 'ul. Pugeta 13/2, 51-628 Wrocław',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-05',
      fee_valid_until = '2026-12-09',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [64] Nela Martyna Wiśniewska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nelawisniewska.01@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'nelawisniewska.01@gmail.com',
      crypt('4kieG3S8', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Nela Martyna',
      last_name = 'Wiśniewska',
      phone = '668878788',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2024-12-09',
      birth_date = '2001-11-11',
      pesel = '1311103808',
      address = 'ul. Stanisława Barańczaka 1/24, 60-537 Poznań',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-12-09',
      fee_valid_until = '2025-12-09',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [65] Julia Wróbel
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'julia.wrobel84@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'julia.wrobel84@gmail.com',
      crypt('P95a3sZl', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Julia',
      last_name = 'Wróbel',
      phone = '516846747',
      university = 'Uniwersytet Medyczny w Lublinie',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2024-12-09',
      birth_date = '2001-08-04',
      pesel = '1280401703',
      address = 'Jedlanka Stara 60, 27-100 Iłża',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-12-09',
      fee_valid_until = '2025-12-09',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [66] Patryk Pindlowski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ppindlowski@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ppindlowski@gmail.com',
      crypt('wv5WZ02o', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Patryk',
      last_name = 'Pindlowski',
      phone = '664694544',
      university = 'I Katedra i Klinika Kardiologii WUM',
      field_of_study = NULL,
      year_of_study = 'absolwent (2 lata po)',
      status = 'absolwent',
      join_date = '2024-12-16',
      birth_date = '1998-08-30',
      pesel = '98083004976',
      address = 'ul. Geodetów 4/42, 02-396 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2024-12-16',
      fee_valid_until = '2025-12-16',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [67] Mikołaj Czerwonka
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'czerwonka.mikolaj88@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'czerwonka.mikolaj88@gmail.com',
      crypt('pFa27Ai8', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Mikołaj',
      last_name = 'Czerwonka',
      phone = '535576222',
      university = 'Uniwersytet Medyczny w Lublinie',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-01-17',
      birth_date = '2003-04-20',
      pesel = '3242000078',
      address = 'ul. Ciepła 6/18, 22-400 Zamość',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-19',
      fee_valid_until = '2027-01-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [68] Szymon Warkocz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'szymek.warkocz@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'szymek.warkocz@gmail.com',
      crypt('4aB9Qz7c', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Szymon',
      last_name = 'Warkocz',
      phone = '605550866',
      university = 'Pomorski Uniwersytet Medyczny w Szczecinie',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-01-21',
      birth_date = '2002-04-17',
      pesel = '2241705755',
      address = 'al. Piastów 2/5, 70-325 Szczecin',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-01-21',
      fee_valid_until = '2026-01-21',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [69] Sebastian Wiśniewski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sebastian.wisniewski333@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'sebastian.wisniewski333@gmail.com',
      crypt('8ZpbB83s', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Sebastian',
      last_name = 'Wiśniewski',
      phone = '795943679',
      university = 'Uniwersytet Medyczny w Lublinie',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-01-23',
      birth_date = '2002-05-01',
      pesel = '2250102455',
      address = 'ul. Głęboka 18/18, 20-612 Lublin',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-01-23',
      fee_valid_until = NULL,
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [70] Beniamin Mariusz Mańkowski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'beniamin.mankowski1@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'beniamin.mankowski1@gmail.com',
      crypt('2U31Dphk', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Beniamin Mariusz',
      last_name = 'Mańkowski',
      phone = '604273722',
      university = 'CM UMK w Bydgoszczy',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-02-10',
      birth_date = '2000-08-07',
      pesel = '280705930',
      address = 'ul. Kozietulskiego 22/1m20 Bydgoszcz',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-02-10',
      fee_valid_until = '2026-02-10',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [71] Mateusz Sypniewski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'm.sypniewski@gumed.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'm.sypniewski@gumed.edu.pl',
      crypt('qWs243Xj', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Mateusz',
      last_name = 'Sypniewski',
      phone = '692691476',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-02-12',
      birth_date = '2001-11-04',
      pesel = '1310401730',
      address = 'ul. Zakopiańska 41/1 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = false,
      fee_active = false,
      last_payment_date = '2025-02-12',
      fee_valid_until = '2026-02-12',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [72] Hanna Nowak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hanmar2001@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'hanmar2001@gmail.com',
      crypt('q6vZ20tR', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Hanna',
      last_name = 'Nowak',
      phone = '669527738',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2025-02-17',
      birth_date = '2001-08-25',
      pesel = '1282502587',
      address = 'ul. Krobska 60/3, 63-860 Pogorzela',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-02-17',
      fee_valid_until = '2026-02-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [73] Izabela Magdalena Staniszewska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'staniszewskaiza28@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'staniszewskaiza28@gmail.com',
      crypt('U5v7Kkc9', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Izabela Magdalena',
      last_name = 'Staniszewska',
      phone = '724085113',
      university = 'UCK WUM, Warszawski Uniwersytet Medyczny',
      field_of_study = NULL,
      year_of_study = 'absolwent (2 lata po)',
      status = 'absolwent',
      join_date = '2025-02-17',
      birth_date = NULL,
      pesel = '99022808466',
      address = 'ul. 1 Maja 28, 07-130 Łochów',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-02-17',
      fee_valid_until = '2026-02-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [74] Miłosz Piotr Woźniak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'miloszw2003@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'miloszw2003@wp.pl',
      crypt('s9f9HeQ6', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Miłosz Piotr',
      last_name = 'Woźniak',
      phone = '695549220',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-02-17',
      birth_date = '2003-12-16',
      pesel = '3321601059',
      address = 'Niedźwiedź 30D, 63-500 Ostrzeszów',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-02-17',
      fee_valid_until = '2026-02-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [75] Arian Jakub Darwish
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ekipachojnice@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ekipachojnice@gmail.com',
      crypt('Y59eskM2', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Arian Jakub',
      last_name = 'Darwish',
      phone = '796010407',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-02-19',
      birth_date = '2001-04-04',
      pesel = '1240401334',
      address = 'ul. Barańczaka 1a/56, 60-537 Poznań',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-02-19',
      fee_valid_until = '2026-02-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [76] Jakub Bereś
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kuba.beres@onet.eu') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'kuba.beres@onet.eu',
      crypt('5f9DV4vy', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Jakub',
      last_name = 'Bereś',
      phone = '667613522',
      university = 'Uniwersytet Medyczny w Lublinie',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-02-21',
      birth_date = '2002-06-21',
      pesel = '2262109253',
      address = 'ul. Kolorowa 14B, 35-235 Rzeszów',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-02-21',
      fee_valid_until = '2026-02-21',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [77] Anna Aleksandra Kurek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'annaaleksandrakurek@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'annaaleksandrakurek@gmail.com',
      crypt('8kZLs2n7', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Anna Aleksandra',
      last_name = 'Kurek',
      phone = '666160166',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-02-24',
      birth_date = '2003-02-25',
      pesel = '3222508628',
      address = 'ul. Powstańców Śląskich 87/254, 01-355 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-02-24',
      fee_valid_until = '2026-02-24',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [78] Adam Tomasz Wójcikiewicz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'adamwojcikiewicz32@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'adamwojcikiewicz32@gmail.com',
      crypt('0eC0Yt5v', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Adam Tomasz',
      last_name = 'Wójcikiewicz',
      phone = '609011020',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-02-26',
      birth_date = '2000-12-09',
      pesel = '320904077',
      address = 'ul. Królowej Jadwigi 137E/15, 80-034 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-02-26',
      fee_valid_until = '2026-02-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [79] Julia Maria Dzierla
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'julia.dzierla@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'julia.dzierla@wp.pl',
      crypt('a1kSLw34', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Julia Maria',
      last_name = 'Dzierla',
      phone = '883033356',
      university = 'Oddział Kardiologiczny ZZOZ w Ostrowie Wielkopolskim',
      field_of_study = NULL,
      year_of_study = 'absolwent (2 lata po)',
      status = 'absolwent',
      join_date = '2025-03-03',
      birth_date = '1999-12-26',
      pesel = '99122603064',
      address = 'ul. Chwaliszewska 13, 63-700 Krotoszyn',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-16',
      fee_valid_until = '2027-03-03',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [80] Joanna Kud
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'joanna.kud@gumed.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'joanna.kud@gumed.edu.pl',
      crypt('3iAdCk82', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Joanna',
      last_name = 'Kud',
      phone = '601947150',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-03-07',
      birth_date = '2003-07-18',
      pesel = '3271803262',
      address = 'ul. Kartuska 70/18, 80-104 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = '2025-03-07',
      fee_valid_until = '2026-03-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [81] Karolina Gutkowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'karolina.gutkowska4@onet.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'karolina.gutkowska4@onet.pl',
      crypt('4x9IfoU8', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Karolina',
      last_name = 'Gutkowska',
      phone = '511248148',
      university = 'Collegium Medicum UJ',
      field_of_study = 'lekarski',
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2025-03-11',
      birth_date = '2000-08-04',
      pesel = '280406145',
      address = 'ul. Słomczyńskiego 12/9, 31-234 Kraków',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-11',
      fee_valid_until = '2026-03-11',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [82] Ewa Anna Borowiak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ewa.anna.borowiak@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ewa.anna.borowiak@gmail.com',
      crypt('A857Unpp', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Ewa Anna',
      last_name = 'Borowiak',
      phone = '782164636',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-03-13',
      birth_date = '2001-01-06',
      pesel = '1210604949',
      address = 'ul. Trzech Budrysów 31/3, 02-381 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-13',
      fee_valid_until = '2026-03-13',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [83] Szymon Leonard Glanowski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'zamiedzaidalej@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'zamiedzaidalej@gmail.com',
      crypt('O10E0aie', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Szymon Leonard',
      last_name = 'Glanowski',
      phone = '796020812',
      university = 'Collegium Medicum UJ',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-03-13',
      birth_date = '2002-08-12',
      pesel = '2281210431',
      address = 'ul. Jabłonkowska 17/18, 30-139 Kraków',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-13',
      fee_valid_until = '2026-03-13',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [84] Julia Dźwinacka
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jdzwinacka@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'jdzwinacka@wp.pl',
      crypt('0S6orr8C', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Julia',
      last_name = 'Dźwinacka',
      phone = '739500419',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-03-17',
      birth_date = '2001-07-11',
      pesel = '1271105186',
      address = 'ul. Mołdawska 5/38, 02-127 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-17',
      fee_valid_until = '2026-03-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [85] Aleksandra Joanna Małek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'malek.ola401@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'malek.ola401@gmail.com',
      crypt('48vAAmd1', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksandra Joanna',
      last_name = 'Małek',
      phone = '533700405',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-03-17',
      birth_date = '2003-01-04',
      pesel = '3210402800',
      address = 'ul. Nadrzeczna 25, 33-133 Zabawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-17',
      fee_valid_until = '2026-03-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [86] Bartosz Nikodem Sierant
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'bartoszsierant@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'bartoszsierant@wp.pl',
      crypt('272puYqJ', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Bartosz Nikodem',
      last_name = 'Sierant',
      phone = '609727719',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-03-17',
      birth_date = '2002-06-03',
      pesel = '2260304971',
      address = 'Plac Jana Pawła II 11, 66-200 Swiebodzin',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-17',
      fee_valid_until = '2026-03-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [87] Karol Sadowski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'karol.sadowski@wum.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'karol.sadowski@wum.edu.pl',
      crypt('1Z1kG1dd', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Karol',
      last_name = 'Sadowski',
      phone = '604143799',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-03-21',
      birth_date = '2001-09-01',
      pesel = '1280102031',
      address = 'ul. Grójecka 77/30, 02-094 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-21',
      fee_valid_until = '2026-03-21',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [88] Aleksander Baszowski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aleksander.baszkowski@student.umed.lodz.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'aleksander.baszkowski@student.umed.lodz.pl',
      crypt('Rj86Zw3q', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksander',
      last_name = 'Baszowski',
      phone = '669913454',
      university = 'Łódzki Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-03-24',
      birth_date = '2003-07-17',
      pesel = '3271706879',
      address = 'Gołębia 4/18, 90-340 Łódź',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-24',
      fee_valid_until = '2026-03-24',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [89] Alicja Fiedorowicz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fiedorowicz.alicja@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'fiedorowicz.alicja@wp.pl',
      crypt('K0aj49dZ', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Alicja',
      last_name = 'Fiedorowicz',
      phone = '723556934',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-03-25',
      birth_date = '2003-04-24',
      pesel = '3242403482',
      address = 'Łupstych 127, 11-041 Łupstych',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-25',
      fee_valid_until = '2026-03-25',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [90] Jan Falana
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jan.falana3@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'jan.falana3@gmail.com',
      crypt('4rJpe70L', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Jan',
      last_name = 'Falana',
      phone = '793877229',
      university = 'Uniwersytet Medyczny we Wrocławiu',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-03-26',
      birth_date = '2003-04-25',
      pesel = '3242508934',
      address = 'ul. Trzebowiańska 19, 54-153 Wrocław',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-26',
      fee_valid_until = '2026-03-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [91] Marta Karolina Guzy
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marta.guzy24@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'marta.guzy24@gmail.com',
      crypt('1i05tRHh', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Marta Karolina',
      last_name = 'Guzy',
      phone = '507443487',
      university = 'Śląski Uniwersytet Medyczny w Katowicach',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-03-26',
      birth_date = '2000-05-24',
      pesel = '252400564',
      address = 'ul. Norblina 35B, 40-748 Katowice',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-03-26',
      fee_valid_until = '2026-03-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [92] Adrian Pyzia
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pyziaadrian@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'pyziaadrian@wp.pl',
      crypt('6nrk8JS5', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Adrian',
      last_name = 'Pyzia',
      phone = '536994571',
      university = 'Uniwersytet Medyczny w Lublinie',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-04-01',
      birth_date = '2002-03-11',
      pesel = '2231102513',
      address = 'ul. Czwartek 22/2a, 20-400 Lublin',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-04-01',
      fee_valid_until = '2026-04-01',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [93] Paulina Wójcik
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'paulinawojcik00@icloud.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'paulinawojcik00@icloud.com',
      crypt('Lvi2l56I', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Paulina',
      last_name = 'Wójcik',
      phone = '795524793',
      university = 'Uniwersytet Opolski',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-04-03',
      birth_date = '2000-08-03',
      pesel = '280300524',
      address = 'ul. Piotra Wysockiego 5/17, 27-200 Starachowice',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-04-03',
      fee_valid_until = '2026-04-03',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [94] Katarzyna Zuzanna Nowak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = '108691@g.elearn.uz.zgora.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      '108691@g.elearn.uz.zgora.pl',
      crypt('0v70NcYz', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Katarzyna Zuzanna',
      last_name = 'Nowak',
      phone = '510797325',
      university = 'Uniwersytet Zielonogórski',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-04-24',
      birth_date = '2001-09-26',
      pesel = '1292606701',
      address = 'ul. Osiedle Śląskie 17b/18 65-547 Zielona Góra',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-04-24',
      fee_valid_until = '2026-04-24',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [95] Mateusz Grzybowski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mateusz.grzybowski1111@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'mateusz.grzybowski1111@gmail.com',
      crypt('uKfy00A3', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Mateusz',
      last_name = 'Grzybowski',
      phone = '692585218',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-04-25',
      birth_date = '2003-04-22',
      pesel = '3242207231',
      address = 'ul. Dzieci Polskich 25/18 97-200 Tomaszów Mazowiecki',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-04-25',
      fee_valid_until = '2026-04-25',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [96] Adriana Jóźwik
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'adoks14@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'adoks14@wp.pl',
      crypt('8f6SPwq9', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Adriana',
      last_name = 'Jóźwik',
      phone = '666560584',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-05-06',
      birth_date = '2003-06-13',
      pesel = '3261306184',
      address = 'ul. Żwirki i Wigury 53a/10 02-091 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-05-06',
      fee_valid_until = '2026-05-06',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [97] Aleksandra Natalia Kita
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aleksandrakita14@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'aleksandrakita14@gmail.com',
      crypt('an69k1TX', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksandra Natalia',
      last_name = 'Kita',
      phone = '883613225',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-05-09',
      birth_date = '2003-09-24',
      pesel = '4292409220',
      address = 'ul. Focha 42a/34 42-217 Częstochowa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-05-09',
      fee_valid_until = '2026-05-09',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [98] Emilia Szeliga
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'emiszeliga@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'emiszeliga@gmail.com',
      crypt('x3k9YCk2', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Emilia',
      last_name = 'Szeliga',
      phone = '696604579',
      university = 'Uniwersytet Medyczny w Lublinie',
      field_of_study = 'lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2025-05-26',
      birth_date = '2002-09-21',
      pesel = '5292109103',
      address = 'ul. Słoneczna 35G 39-100 Ropczyce',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-05-26',
      fee_valid_until = '2026-05-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [99] Wiktoria Mazepa
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'wiktoriamazepaa@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'wiktoriamazepaa@gmail.com',
      crypt('jR79n3Am', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Wiktoria',
      last_name = 'Mazepa',
      phone = '662770515',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-06-04',
      birth_date = '2003-04-24',
      pesel = '3242408906',
      address = 'ul. Minerska 29/4 04-506 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-04',
      fee_valid_until = '2026-06-04',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [100] Hanna Drobińska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'drobinskahania@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'drobinskahania@gmail.com',
      crypt('53V1Pqev', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Hanna',
      last_name = 'Drobińska',
      phone = '784840555',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-06-11',
      birth_date = '2003-10-13',
      pesel = '3301305005',
      address = 'ul. ks.Damrota 33a/13 50-306 Wrocław',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-11',
      fee_valid_until = '2026-06-11',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [101] Nina Karolina Jaworska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nina0106@gumed.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'nina0106@gumed.edu.pl',
      crypt('XvNza823', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Nina Karolina',
      last_name = 'Jaworska',
      phone = '725725543',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-06-11',
      birth_date = '2002-06-01',
      pesel = '2260106740',
      address = 'ul. Hemara 5/19 80-280 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-11',
      fee_valid_until = '2026-06-11',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [102] Oliwia Angelika Kożuchowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kozuchowskaoliwia@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'kozuchowskaoliwia@gmail.com',
      crypt('8pEQ54di', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Oliwia Angelika',
      last_name = 'Kożuchowska',
      phone = '603196989',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-06-12',
      birth_date = '2004-12-10',
      pesel = '4321008341',
      address = 'ul. Łukowska 5/298, Warszawa 04-113',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-12',
      fee_valid_until = '2026-06-12',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [103] Sebastian Krzosek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sebastian.krzosek@icloud.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'sebastian.krzosek@icloud.com',
      crypt('xbP34G7p', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Sebastian',
      last_name = 'Krzosek',
      phone = '664723309',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-06-12',
      birth_date = '2004-05-20',
      pesel = '4252005859',
      address = 'Wielogóra, ul.Długa 62',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-12',
      fee_valid_until = '2026-06-12',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [104] Maria Julia Bednarz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'maria.bednarz@stud.umed.lodz.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'maria.bednarz@stud.umed.lodz.pl',
      crypt('913jDbMm', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Maria Julia',
      last_name = 'Bednarz',
      phone = '730867719',
      university = 'Uniwersytet Medyczny w Łodzi',
      field_of_study = 'lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-06-13',
      birth_date = '2005-01-28',
      pesel = '5122803085',
      address = 'ul. Niestachowska 11 25-362 Kielce',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-13',
      fee_valid_until = '2026-06-13',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [105] Ewelina Weronika Bilska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ewelinabilska027@gumed.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ewelinabilska027@gumed.edu.pl',
      crypt('3d2KhwT1', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Ewelina Weronika',
      last_name = 'Bilska',
      phone = '733062171',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-06-16',
      birth_date = '2003-02-07',
      pesel = '3220700480',
      address = 'ul. Goska 15/31, 80-177 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-16',
      fee_valid_until = '2026-06-16',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [106] Natalia Dziuba
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'janek.bianko.herc@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'janek.bianko.herc@gmail.com',
      crypt('xIKnv023', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Natalia',
      last_name = 'Dziuba',
      phone = NULL,
      university = 'Uniwersytet Medyczny w Lublinie',
      field_of_study = 'Lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-06-16',
      birth_date = NULL,
      pesel = '1220908860',
      address = 'Godziszów Trzeci 107, 23-302 Godziszów',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-16',
      fee_valid_until = '2026-06-16',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [107] Oliwia Julia Miotke
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hubertm2002@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'hubertm2002@gmail.com',
      crypt('endZ49O1', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Oliwia Julia',
      last_name = 'Miotke',
      phone = '504363414',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-06-16',
      birth_date = '2002-05-17',
      pesel = '2251704380',
      address = 'Rumia, ul. Źródlana 7',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-16',
      fee_valid_until = '2026-06-16',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [108] Zuzanna Nogaj
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'zuzannanogaj@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'zuzannanogaj@gmail.com',
      crypt('96hB0gtC', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Zuzanna',
      last_name = 'Nogaj',
      phone = '662875311',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-06-16',
      birth_date = '2001-07-26',
      pesel = '1272605081',
      address = 'Fiołkowa 23, 85-361 Bydgoszcz',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-16',
      fee_valid_until = '2026-06-16',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [109] Kamil Górecki
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kamilgorecki12@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'kamilgorecki12@gmail.com',
      crypt('ZY9g6n4o', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Kamil',
      last_name = 'Górecki',
      phone = '601689454',
      university = 'Uniwersytet Medyczny w Lublinie',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2025-06-17',
      birth_date = '2001-09-14',
      pesel = '1291402018',
      address = 'os. Zielone 20/32 33-100 Tarnów',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-17',
      fee_valid_until = '2026-06-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [110] Veronika Kobylianska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kobylianskaveronika@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'kobylianskaveronika@gmail.com',
      crypt('Fa9A00rs', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Veronika',
      last_name = 'Kobylianska',
      phone = '785759854',
      university = 'Uniwersytet Medyczny w Lublinie',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-06-17',
      birth_date = '2003-10-05',
      pesel = '3300509288',
      address = 'Poli Gdawiczyńskiej 17/1, 20-854 Lublin',
      citizenship = 'ukraińskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-17',
      fee_valid_until = '2026-06-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [111] Hubert Mączka
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'a.majewska640@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'a.majewska640@gmail.com',
      crypt('p43eyLM8', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Hubert',
      last_name = 'Mączka',
      phone = '512907391',
      university = 'Collegium Medicum Uniwersytetu Jagiellońskiego',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-06-17',
      birth_date = '2002-04-29',
      pesel = '2242905192',
      address = 'Rodzinna 62 ,Kraków',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-17',
      fee_valid_until = '2026-06-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [114] Małgorzata Wójtowicz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mwojtowicz@gumed.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'mwojtowicz@gumed.pl',
      crypt('9RVfr6n0', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Małgorzata',
      last_name = 'Wójtowicz',
      phone = '795035595',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-06-18',
      birth_date = '2001-05-04',
      pesel = '4250408883',
      address = 'Dobrowolskiego 27, 83-000 Pruszcz Gdański',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-18',
      fee_valid_until = '2026-06-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [115] Filip Lewandowski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'filip.lewandowski.2018@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'filip.lewandowski.2018@gmail.com',
      crypt('76p8BhrB', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Filip',
      last_name = 'Lewandowski',
      phone = '723966902',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-06-20',
      birth_date = '2003-07-27',
      pesel = '3272709239',
      address = 'Wichrowe Wzgórze 99, 80-293 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-20',
      fee_valid_until = '2026-06-20',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [116] Marta Maria Nowak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marta-nowak424@wp.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'marta-nowak424@wp.pl',
      crypt('VbCgjE3P', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Marta Maria',
      last_name = 'Nowak',
      phone = '884015323',
      university = 'Akademia Śląska',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-06-24',
      birth_date = '2001-08-19',
      pesel = '1281907222',
      address = 'Żuków 14, 27-650 Samborzec',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-06-24',
      fee_valid_until = '2026-06-24',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [117] Zuzanna Wójtewicz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'zuzanna.wojtewicz@stud.umed.lodz.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'zuzanna.wojtewicz@stud.umed.lodz.pl',
      crypt('scz99DD4', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Zuzanna',
      last_name = 'Wójtewicz',
      phone = '506103949',
      university = 'Uniwersytet Medyczny w Łodzi',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-09-08',
      birth_date = '2002-01-27',
      pesel = '2212704163',
      address = 'Rzeszowska 15, 87-100 Toruń',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-09-08',
      fee_valid_until = '2026-09-08',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [118] Barbara Bilnik
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'basiabilnik@interia.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'basiabilnik@interia.pl',
      crypt('6Q7sW1si', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Barbara',
      last_name = 'Bilnik',
      phone = '600378229',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-09-23',
      birth_date = '2004-01-16',
      pesel = '4211605902',
      address = 'Jasna 16B/6 57-200 Ząbkowice Śląskie',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-09-23',
      fee_valid_until = '2026-09-23',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [119] Julia Krawczyk
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'julia.krawczyk56@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'julia.krawczyk56@gmail.com',
      crypt('2ZpO29tq', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Julia',
      last_name = 'Krawczyk',
      phone = '883857805',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-09-26',
      birth_date = NULL,
      pesel = '3221207528',
      address = 'ul. Odrowąża 54, Marki 05-270',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-09-26',
      fee_valid_until = '2026-09-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [120] Karolina Babik
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'Karolinababik02@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'Karolinababik02@gmail.com',
      crypt('89aFtq3Y', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Karolina',
      last_name = 'Babik',
      phone = '662021303',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-09-29',
      birth_date = '2002-02-20',
      pesel = '2222009641',
      address = 'Batorego 38c 05-530 Góra Kalwaria',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-09-29',
      fee_valid_until = '2026-09-29',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [121] Magdalena Warych
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mwarych9@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'mwarych9@gmail.com',
      crypt('9kmbK8O3', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Magdalena',
      last_name = 'Warych',
      phone = '576266116',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-10-01',
      birth_date = '2001-02-08',
      pesel = '1220807886',
      address = 'W. Rzymowskiego 36/105, 02-697 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-01',
      fee_valid_until = '2026-10-01',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [122] Aleksandra Michalina Gnyp
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aleksandragnyp03@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'aleksandragnyp03@gmail.com',
      crypt('Q9edS98e', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksandra Michalina',
      last_name = 'Gnyp',
      phone = '570506008',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-10-13',
      birth_date = '2003-11-23',
      pesel = '3312300642',
      address = 'Szczęśliwicka 25/38 Warszawa',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-13',
      fee_valid_until = '2026-10-13',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [123] Emilia Wilkowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'wilkowskaxe@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'wilkowskaxe@gmail.com',
      crypt('j5y8KN3l', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Emilia',
      last_name = 'Wilkowska',
      phone = '515739923',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-10-14',
      birth_date = '2004-06-12',
      pesel = '4261205589',
      address = 'Kownaty 12 06-415 Czernice Borowe',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-14',
      fee_valid_until = '2026-10-14',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [124] Paulina Jędrusik
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'paulina.jedrusik22@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'paulina.jedrusik22@gmail.com',
      crypt('13hTK5zh', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Paulina',
      last_name = 'Jędrusik',
      phone = '530859390',
      university = 'Uniwersytet Medyczny w Białymstoku',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-10-15',
      birth_date = '2002-02-01',
      pesel = '2220105424',
      address = 'Piłsudzkiego 20/35; 19-300 Ełk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-15',
      fee_valid_until = '2026-10-15',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [125] Zuzanna Kowalczyk
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'zuzannakowalczyk237@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'zuzannakowalczyk237@gmail.com',
      crypt('G02Kz8af', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Zuzanna',
      last_name = 'Kowalczyk',
      phone = '695049529',
      university = 'Uczelnia Łazarskiego',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-10-15',
      birth_date = '2002-08-18',
      pesel = '2281804786',
      address = 'ul. Obrzeżna 7a/122 , 02-691 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-15',
      fee_valid_until = '2026-10-15',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [126] Amelia Morawska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'amelia_morawska@o2.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'amelia_morawska@o2.pl',
      crypt('9g5yrU7K', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Amelia',
      last_name = 'Morawska',
      phone = '515052995',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-10-22',
      birth_date = '2003-07-30',
      pesel = '3273001583',
      address = 'Lema 4A/102 80-126 Gdansk',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-22',
      fee_valid_until = '2026-10-22',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [127] Jagoda Szczebiot
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jszczebiot@gumed.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'jszczebiot@gumed.edu.pl',
      crypt('u1CM92ig', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Jagoda',
      last_name = 'Szczebiot',
      phone = '607447046',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-10-22',
      birth_date = '2004-06-17',
      pesel = '4261703643',
      address = 'u. prof. S. Szpora 7/18, 80-8009 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-22',
      fee_valid_until = '2026-10-22',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [128] Milana Zavalnaya
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'milana.zavalnaya@student.umw.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'milana.zavalnaya@student.umw.edu.pl',
      crypt('SjwUg5f9', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Milana',
      last_name = 'Zavalnaya',
      phone = '502967954',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-10-22',
      birth_date = '2005-01-04',
      pesel = '5210413426',
      address = 'Poznań, ul Teofila Mateckiego 20',
      citizenship = 'Białoruskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-22',
      fee_valid_until = '2026-10-22',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [129] Wojciech Olszewski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'wolszewski2002@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'wolszewski2002@gmail.com',
      crypt('1h5M8qYd', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Wojciech',
      last_name = 'Olszewski',
      phone = '506275510',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-10-23',
      birth_date = NULL,
      pesel = '2253109459',
      address = 'ul. Katalońska 7, Warszawa',
      citizenship = 'Polska',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-23',
      fee_valid_until = '2026-10-23',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [130] Milana Zavalnaya
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'yuoson2011@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'yuoson2011@gmail.com',
      crypt('hIO4m64z', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Milana',
      last_name = 'Zavalnaya',
      phone = '48502967954',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-10-23',
      birth_date = '2005-01-04',
      pesel = '5210413426',
      address = 'Ul. Teofila Mateckiego 20/28, Poznań',
      citizenship = 'Białoruskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-23',
      fee_valid_until = '2026-10-23',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [131] Magdalena Wiśniewska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'elomagdaelomagda@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'elomagdaelomagda@gmail.com',
      crypt('WK7HdqaB', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Magdalena',
      last_name = 'Wiśniewska',
      phone = '512572716',
      university = 'Uniwersytet Medyczny w Poznaniu UMP',
      field_of_study = 'Lekarski',
      year_of_study = NULL,
      status = 'absolwent',
      join_date = '2025-10-24',
      birth_date = '1997-02-15',
      pesel = '97021504406',
      address = 'Obrońców Wybrzeża 17/404 Gdańsk',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-24',
      fee_valid_until = '2026-10-24',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [132] Monika Bajsert
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'monika.bajsert@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'monika.bajsert@gmail.com',
      crypt('va5U5K2d', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Monika',
      last_name = 'Bajsert',
      phone = '725467715',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-10-27',
      birth_date = '2002-07-12',
      pesel = '2271206365',
      address = 'ul. Wyszyńskiego 24, 64-100 Leszno',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-27',
      fee_valid_until = '2026-10-27',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [133] Julia Brzostowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'Julia.brzostowskaa@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'Julia.brzostowskaa@gmail.com',
      crypt('k31JotN7', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Julia',
      last_name = 'Brzostowska',
      phone = '535877377',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-10-30',
      birth_date = '2003-09-26',
      pesel = '3292610726',
      address = 'Olbrachtów 30a',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-30',
      fee_valid_until = '2026-10-30',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [134] Oliwia Rożek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'oliwiarozek2003@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'oliwiarozek2003@gmail.com',
      crypt('3O6p3xJi', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Oliwia',
      last_name = 'Rożek',
      phone = '697988983',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-10-30',
      birth_date = '2003-10-23',
      pesel = '3302306166',
      address = 'Leskiego 32/11, 80-180 Gdańsk',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-10-30',
      fee_valid_until = '2026-10-30',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [135] Aleksandra Putyrska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ola.putyrska@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ola.putyrska@gmail.com',
      crypt('78RGuaj6', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksandra',
      last_name = 'Putyrska',
      phone = '784851052',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-11-03',
      birth_date = '2005-07-10',
      pesel = '5271008340',
      address = 'ul. Leśna 41/15, Gdynia 81-549',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-03',
      fee_valid_until = '2026-11-03',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [136] Maja Wróbel
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'majawrobel2003@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'majawrobel2003@gmail.com',
      crypt('xK319Qcl', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Maja',
      last_name = 'Wróbel',
      phone = '48663015865',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-11-03',
      birth_date = '2003-07-27',
      pesel = '3272705761',
      address = 'Gdybnia Radosna 5b/2',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-03',
      fee_valid_until = '2026-11-03',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [137] Jakub Łukomski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'jakublukom@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'jakublukom@gmail.com',
      crypt('3xq3zCT3', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Jakub',
      last_name = 'Łukomski',
      phone = '507925472',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2025-11-03',
      birth_date = '2003-08-06',
      pesel = '3280603994',
      address = 'ul. Lelewela 6F/7, 80-442 Gdańsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-03',
      fee_valid_until = '2026-11-03',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [138] Hanna Goc
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hania.goc@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'hania.goc@gmail.com',
      crypt('46xI8erF', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Hanna',
      last_name = 'Goc',
      phone = '510074410',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2025-11-04',
      birth_date = '2002-07-31',
      pesel = '2173102921',
      address = 'Różana 28, 80-180 Borkowa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-04',
      fee_valid_until = '2026-11-04',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [139] Nikola Łuczak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'oliwiamiotke@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'oliwiamiotke@gmail.com',
      crypt('46D9pmiU', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Nikola',
      last_name = 'Łuczak',
      phone = '728763826',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'Lekarski',
      year_of_study = '1',
      status = 'student',
      join_date = '2025-11-04',
      birth_date = '2006-11-10',
      pesel = '6311008061',
      address = 'Jaworek 69 57-200 Ząbkowice Śląskie',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-05',
      fee_valid_until = '2026-11-04',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [140] Tomasz Jan Piasecki
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'natalia.dziuba@icloud.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'natalia.dziuba@icloud.com',
      crypt('82aWx9Gg', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Tomasz Jan',
      last_name = 'Piasecki',
      phone = '883327542',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-11-23',
      birth_date = '2003-03-28',
      pesel = '3233802051',
      address = 'M Kopernika 5/71, 88-100 Inowrocław',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-11-24',
      fee_valid_until = '2026-11-23',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [142] Paweł Pawłowicz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tomass.piasecki@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'tomass.piasecki@gmail.com',
      crypt('1a1gB3jR', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Paweł',
      last_name = 'Pawłowicz',
      phone = '791956005',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-12-08',
      birth_date = '2003-07-09',
      pesel = '3270900854',
      address = 'Narwik 24/14, Warszawa',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-08',
      fee_valid_until = '2026-12-08',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [143] Natalia Szczypowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'natali.szczypkowska@onet.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'natali.szczypkowska@onet.pl',
      crypt('M3d3bHj8', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Natalia',
      last_name = 'Szczypowska',
      phone = '697860237',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2025-12-11',
      birth_date = '2001-02-01',
      pesel = '1220105809',
      address = 'ul. Polonisz 63, 62-620 Babiak',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2025-12-11',
      fee_valid_until = '2026-12-11',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [144] Martyna Pniaczek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nikolaluczakx@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'nikolaluczakx@gmail.com',
      crypt('0U5uY5zr', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Martyna',
      last_name = 'Pniaczek',
      phone = '881095477',
      university = 'Collegium Medicum Uniwersytetu Jagiellońskiego',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-12',
      birth_date = '2002-07-19',
      pesel = '2271911041',
      address = 'ul. Myśliwska 68/103; 30-718 Kraków',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-13',
      fee_valid_until = '2027-01-12',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [145] Marta Maria Jóźwik
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pniaczek.martyna@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'pniaczek.martyna@gmail.com',
      crypt('Ya9uS2t0', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Marta Maria',
      last_name = 'Jóźwik',
      phone = '690028141',
      university = 'Uniwersytet Medyczny w Łodzi',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2026-01-14',
      birth_date = '2003-11-16',
      pesel = '3311600569',
      address = 'Maćka Z Bogdanca 16/24 Łódź',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-14',
      fee_valid_until = '2027-01-14',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [146] Pola Ochocka
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pawel.pawlowicz777@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'pawel.pawlowicz777@gmail.com',
      crypt('hyU6a55Y', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Pola',
      last_name = 'Ochocka',
      phone = '602479668',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '1',
      status = 'student',
      join_date = '2026-01-14',
      birth_date = '2005-09-19',
      pesel = '5291908109',
      address = 'Franciszka Klimczaka 5/44, 02-797 Warszawa',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-15',
      fee_valid_until = '2027-01-14',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [147] Barbara Ziobrzyńska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fifik1610@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'fifik1610@gmail.com',
      crypt('oZ2G4q3a', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Barbara',
      last_name = 'Ziobrzyńska',
      phone = '517730909',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2026-01-14',
      birth_date = '2006-06-26',
      pesel = '6262602266',
      address = 'Zelwerowicza 8',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-15',
      fee_valid_until = '2027-01-14',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [148] Karolina Jania
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'polaochocka@yahoo.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'polaochocka@yahoo.pl',
      crypt('b52Wo1Ab', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Karolina',
      last_name = 'Jania',
      phone = '609740915',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2026-01-16',
      birth_date = '2003-01-22',
      pesel = '3212204660',
      address = 'Krochmalna 58/28 00-864 Warszawa',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-19',
      fee_valid_until = '2027-01-16',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [149] Kalina Wiśniewska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'barbara.ziobrzynska@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'barbara.ziobrzynska@gmail.com',
      crypt('i2QW9q9m', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Kalina',
      last_name = 'Wiśniewska',
      phone = '506383211',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2026-01-16',
      birth_date = '2001-02-17',
      pesel = '1221702708',
      address = 'ul. Dywizjonu 303 5b/13',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-16',
      fee_valid_until = '2027-01-16',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [150] Mateusz Mazurczak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'martajozwik03@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'martajozwik03@gmail.com',
      crypt('2fbB44Iq', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Mateusz',
      last_name = 'Mazurczak',
      phone = '502089715',
      university = 'Uniwersytet Medyczny w Białymstoku',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2026-01-17',
      birth_date = '2002-09-18',
      pesel = '2291802471',
      address = 'Ale Józefa Piłsudskiego 17',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-19',
      fee_valid_until = '2027-01-17',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [151] Szymon Piotr Kuś
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kalina.wisniewska@gumed.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'kalina.wisniewska@gumed.edu.pl',
      crypt('oT9sD6l0', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Szymon Piotr',
      last_name = 'Kuś',
      phone = '691307902',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2026-01-18',
      birth_date = '2005-06-03',
      pesel = '5260308310',
      address = 'ul. Toruńska 15/198, 80-747, Gdańsk',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-19',
      fee_valid_until = '2027-01-18',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [152] Nikola Klaudia Chyła
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nikolachyla18@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'nikolachyla18@gmail.com',
      crypt('VXt64nrd', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Nikola Klaudia',
      last_name = 'Chyła',
      phone = '515210150',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2026-01-20',
      birth_date = '2005-04-11',
      pesel = '5241102560',
      address = 'ul.Czeredowa 7 37-450 Pilchów',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-20',
      fee_valid_until = '2027-01-20',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [153] Tytus Korzeniewicz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tytuskorzeniewicz@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'tytuskorzeniewicz@gmail.com',
      crypt('Lmb7jasK', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Tytus',
      last_name = 'Korzeniewicz',
      phone = '665546052',
      university = 'Uniwersytet medyczny im Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-21',
      birth_date = '2004-09-21',
      pesel = '4292105218',
      address = 'Zielątkowo, Moraczewskich 11',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-21',
      fee_valid_until = '2027-01-21',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [154] Amelia Anna Kalista
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'amelia.kalista@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'amelia.kalista@gmail.com',
      crypt('VXzpR4Zb', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Amelia Anna',
      last_name = 'Kalista',
      phone = '530955065',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-22',
      birth_date = '2003-11-20',
      pesel = '3312006289',
      address = 'Dzieci Warszawy 40B/6, 02-495 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-22',
      fee_valid_until = '2027-01-22',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [155] Aleksandra Zielińska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'aleksandrazieli05@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'aleksandrazieli05@gmail.com',
      crypt('7pmZkndt', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksandra',
      last_name = 'Zielińska',
      phone = '884845131',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2026-01-22',
      birth_date = '2005-04-14',
      pesel = '5241408642',
      address = 'Busy Niemianowskie 75, 26-634 Gózd',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-22',
      fee_valid_until = '2027-01-22',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [156] Paweł Kosiorek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pako602573707@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'pako602573707@gmail.com',
      crypt('TmCxuhAj', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Paweł',
      last_name = 'Kosiorek',
      phone = '602573707',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2026-01-25',
      birth_date = NULL,
      pesel = '2311303557',
      address = 'Bogusławskiego 18/169 01-923 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-25',
      fee_valid_until = '2027-01-25',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [157] Dominika Woronko
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dworonko28@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'dworonko28@gmail.com',
      crypt('59wEtjU4', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Dominika',
      last_name = 'Woronko',
      phone = '728512606',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-25',
      birth_date = '2003-10-28',
      pesel = '3302808767',
      address = 'Malborska 16 m.23 03-286 Warszawa',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-25',
      fee_valid_until = '2027-01-25',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [158] Marta Żywica
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'martazywica9172@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'martazywica9172@gmail.com',
      crypt('W3HjgC7S', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Marta',
      last_name = 'Żywica',
      phone = '570520334',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-25',
      birth_date = '2004-11-17',
      pesel = '4311702404',
      address = 'Ul.Czarnieckiego 18a Ostrów Wielkopolski',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-25',
      fee_valid_until = '2027-01-25',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [159] Oliwia Jakubowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'oliwkajakubowska@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'oliwkajakubowska@gmail.com',
      crypt('umZzbUTF', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Oliwia',
      last_name = 'Jakubowska',
      phone = '530042445',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2004-01-02',
      pesel = '4210201581',
      address = 'Szerominek, ul. Letnia 2, 09-100 Płońsk',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [160] Magdalena Klimkiewicz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'Magda.a.klimkiewicz@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'Magda.a.klimkiewicz@gmail.com',
      crypt('zqbu7AM6', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Magdalena',
      last_name = 'Klimkiewicz',
      phone = '789675016',
      university = 'UKSW',
      field_of_study = 'Lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '1992-10-28',
      pesel = '92102813848',
      address = 'Chudoby 95, 03-287 Warszawa',
      citizenship = 'Polska',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [161] Filip Korczak
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'filkorczak100@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'filkorczak100@gmail.com',
      crypt('Lyp8WVjZ', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Filip',
      last_name = 'Korczak',
      phone = '500678933',
      university = 'UMMSC',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2000-09-30',
      pesel = '293000675',
      address = 'Bluszczańska 14a',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [162] Piotr Kordowski
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pk90163@stud.uws.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'pk90163@stud.uws.edu.pl',
      crypt('p8BwPB3y', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Piotr',
      last_name = 'Kordowski',
      phone = '660902912',
      university = 'Uniwersytet w Siedlcach',
      field_of_study = 'Lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2002-05-22',
      pesel = '2252206010',
      address = 'Powstańców Wielkopolskich 5/12, 06-400 Ciechanów',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [163] Aleksandra Weronika Kowalczyk
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kowalczykal@gumed.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'kowalczykal@gumed.edu.pl',
      crypt('sjT3VsSc', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksandra Weronika',
      last_name = 'Kowalczyk',
      phone = '883002801',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2004-04-28',
      pesel = '4242800484',
      address = 'Polska',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [164] Kamila Krzemińska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kml.krzem@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'kml.krzem@gmail.com',
      crypt('VZtpTuLC', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Kamila',
      last_name = 'Krzemińska',
      phone = '601957360',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'Lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2001-09-06',
      pesel = '1290604169',
      address = 'ul. Zwierzyniecka 30B/9 60-814 Poznań',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [165] Maja Lurbecka
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'majusialurbecka@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'majusialurbecka@gmail.com',
      crypt('RHPfxU8E', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Maja',
      last_name = 'Lurbecka',
      phone = '516472758',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = NULL,
      pesel = '3232203401',
      address = '22-03-2003 wyszkow',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [166] Ewa Nakoniecznik
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ewanakoniecznik@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ewanakoniecznik@gmail.com',
      crypt('j4dTPaWt', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Ewa',
      last_name = 'Nakoniecznik',
      phone = '791743823',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2004-09-17',
      pesel = '4291707022',
      address = 'Zenona 28, Pruszków 05-800',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [167] Martyna Niemiec
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'Martyna.niemiec@jaszek.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'Martyna.niemiec@jaszek.pl',
      crypt('qKnY64V8', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Martyna',
      last_name = 'Niemiec',
      phone = '502539037',
      university = 'Collegium Medicum Uniwersytetu Zielonogórskiego',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2002-01-11',
      pesel = '2211108203',
      address = 'Leopolda Staffa 2/21 65-436 Zielona Góra',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [168] Maria Nowakowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nowakowskamary@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'nowakowskamary@gmail.com',
      crypt('VSWYUd4k', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Maria',
      last_name = 'Nowakowska',
      phone = '534773030',
      university = 'Uniwersytet Medyczny w Lublinie',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2002-09-18',
      pesel = '2291804564',
      address = 'Wyzynna 17/45 Lublin',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [169] Anna Putyrska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'ania.putyrska@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'ania.putyrska@gmail.com',
      crypt('S57QkqsR', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Anna',
      last_name = 'Putyrska',
      phone = '784851061',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2005-07-10',
      pesel = '5271008364',
      address = 'Leśna 41/15 Gdynia 81-549',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [170] Konrad Ruciński
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kon.ruc.03@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'kon.ruc.03@gmail.com',
      crypt('QYaeAEe4', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Konrad',
      last_name = 'Ruciński',
      phone = '792066384',
      university = 'Pomorski Uniwersytet Medyczny w Szczecinie',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2003-05-03',
      pesel = '3250308476',
      address = 'Kraszewskiego 6/1 87-100 Toruń',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [171] Iryna Samoilava
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'iryna.samojlava@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'iryna.samojlava@gmail.com',
      crypt('XYt7xKUd', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Iryna',
      last_name = 'Samoilava',
      phone = NULL,
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2005-10-01',
      pesel = '5300110721',
      address = 'Warszawa, ul. Grójecka 194/90A',
      citizenship = 'Białoruś',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [172] Aleksandra Sikorska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'Aleksandra.sikorska@autograf.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'Aleksandra.sikorska@autograf.pl',
      crypt('9aCEBfTE', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Aleksandra',
      last_name = 'Sikorska',
      phone = '516750370',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2003-09-10',
      pesel = '3291008126',
      address = 'Kłonówek 23 88-200 Radziejów',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [173] Wojciech Stępień
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'wojciech.franciszek.stepien@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'wojciech.franciszek.stepien@gmail.com',
      crypt('252G9w7Y', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Wojciech',
      last_name = 'Stępień',
      phone = '609350729',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2002-07-04',
      pesel = '2270405192',
      address = 'Płouszowice Kolonia 128A',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [174] Wiktoria Wiśniewska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'wiktoriawisniewskax@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'wiktoriawisniewskax@gmail.com',
      crypt('r7DzCKyw', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Wiktoria',
      last_name = 'Wiśniewska',
      phone = '690436712',
      university = 'Uniwersytet Medyczny im. Karola Marcinkowskiego w Poznaniu',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2004-03-25',
      pesel = '4232505609',
      address = 'ul. Jana Pawła II 58d, 66-470 Kostrzyn nad Odrą',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [175] Maria Wojtaszek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marysiawoj10@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'marysiawoj10@gmail.com',
      crypt('ycMeekys', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Maria',
      last_name = 'Wojtaszek',
      phone = '795476606',
      university = 'Uniwersytet Medyczny im. Piastów Śląskich we Wrocławiu',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-26',
      birth_date = '2003-08-10',
      pesel = '3281005627',
      address = 'Nowa 33, 63-430 Odolanów',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-26',
      fee_valid_until = '2027-01-26',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [176] Patryk Piszcz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'piszczpatryk90@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'piszczpatryk90@gmail.com',
      crypt('An2j2Q6U', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Patryk',
      last_name = 'Piszcz',
      phone = '517029903',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2026-01-27',
      birth_date = '2003-01-03',
      pesel = '3210311478',
      address = 'Kotłówka 17, 08-430 Żelechów',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-27',
      fee_valid_until = '2027-01-27',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [177] Julita Kinga Klag
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 's91402@365.sum.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      's91402@365.sum.edu.pl',
      crypt('YBYkQXrm', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Julita Kinga',
      last_name = 'Klag',
      phone = '501873834',
      university = 'Śląski Uniwersytet Medyczny (Zabrze)',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-28',
      birth_date = '1998-07-08',
      pesel = '98070811042',
      address = 'Ul. Graniczna 57, m 19',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-28',
      fee_valid_until = '2027-01-28',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [178] Kornelia Zdziech
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'korneliazdziech@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'korneliazdziech@gmail.com',
      crypt('gcAGJQT3', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Kornelia',
      last_name = 'Zdziech',
      phone = '535219116',
      university = 'Collegium Medicum - UJK Kielce',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2026-01-29',
      birth_date = '2002-03-20',
      pesel = '2232009963',
      address = 'Ul. Szkolna 16B Chlewiska 26-510',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-29',
      fee_valid_until = '2027-01-29',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [179] Michał Garwoliński
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'garwol52@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'garwol52@gmail.com',
      crypt('qzJjjxxH', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Michał',
      last_name = 'Garwoliński',
      phone = '798777350',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2026-02-03',
      birth_date = '2005-08-15',
      pesel = '5281507178',
      address = 'Bora-Komorowskiego 14/88 03-982 Warszawa',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-02-03',
      fee_valid_until = '2027-02-03',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [180] Zofia Łukasiewicz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 's090669@student.wum.edu.pl') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      's090669@student.wum.edu.pl',
      crypt('Kv46zBDf', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Zofia',
      last_name = 'Łukasiewicz',
      phone = '604259999',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-02-03',
      birth_date = '2004-07-11',
      pesel = '4271105705',
      address = 'Sągi 9c 02-995 Warszawa',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-02-03',
      fee_valid_until = '2027-02-03',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [181] Oliwia Potrzebska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'oliwiapotrzebska@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'oliwiapotrzebska@gmail.com',
      crypt('bmTdp7fF', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Oliwia',
      last_name = 'Potrzebska',
      phone = '500452415',
      university = 'Collegium Medicum Uniwersytetu Jana Kochanowskiego w Kielcach',
      field_of_study = 'Lekarski',
      year_of_study = '2',
      status = 'student',
      join_date = '2026-03-07',
      birth_date = '2003-01-17',
      pesel = '3211705001',
      address = 'Prądocin Leśna 19 86-060',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-03-07',
      fee_valid_until = '2027-03-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [182] Hanna Rojek
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'hannarojek1@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'hannarojek1@gmail.com',
      crypt('stj6EanK', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Hanna',
      last_name = 'Rojek',
      phone = '530193713',
      university = 'Pomorski Uniwersytet Medyczny w Szczecinie',
      field_of_study = 'Lekarski',
      year_of_study = '4',
      status = 'student',
      join_date = '2026-03-07',
      birth_date = '2003-11-27',
      pesel = '3312702567',
      address = 'Chmielewskiego 18e/26, 70-028 Szczecin',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-03-07',
      fee_valid_until = '2027-03-07',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [183] Emilia Wioletta Figura
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'efigura1@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'efigura1@gmail.com',
      crypt('1sC0vSq2', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Emilia Wioletta',
      last_name = 'Figura',
      phone = '532899762',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '5',
      status = 'student',
      join_date = NULL,
      birth_date = '2001-04-17',
      pesel = '1241705222',
      address = 'Czwartaków 42a 04-440 Warszawa',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = NULL,
      fee_valid_until = NULL,
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [184] Agnieszka Mariowska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'matimaz.mm@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'matimaz.mm@gmail.com',
      crypt('oiLt62B7', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Agnieszka',
      last_name = 'Mariowska',
      phone = '733211463',
      university = 'Szpital w Puszczykowie',
      field_of_study = NULL,
      year_of_study = 'absolwent (1 rok po)',
      status = 'absolwent',
      join_date = '2026-01-19',
      birth_date = '1999-04-09',
      pesel = '99040908221',
      address = 'ul. Jugosłowiańska 52B/5, 60-149 Poznań',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-20',
      fee_valid_until = '2027-01-19',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [185] Małgorzata Pałucka
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'goskapalucka2@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'goskapalucka2@gmail.com',
      crypt('bY4iS1t3', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Małgorzata',
      last_name = 'Pałucka',
      phone = '505829655',
      university = 'Gdański Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '6',
      status = 'student',
      join_date = NULL,
      birth_date = '2001-12-06',
      pesel = '1320602989',
      address = 'Podlaska 13, Gdynia',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = NULL,
      fee_valid_until = NULL,
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [186] Jagoda Rink
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'karolinajania03@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'karolinajania03@gmail.com',
      crypt('QgZfj215', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Jagoda',
      last_name = 'Rink',
      phone = '662561509',
      university = 'Gdański uniwersytet Medyczny',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = '2026-01-21',
      birth_date = '2004-03-12',
      pesel = '4231209184',
      address = 'ul. Storczykowa 7B/4, 80-177 Gdańsk',
      citizenship = 'Polskie',
      rodo_consent = true,
      fee_active = true,
      last_payment_date = '2026-01-22',
      fee_valid_until = '2027-01-21',
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [187] Patrycja Siebiatyńska
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'patisiebiatynska@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'patisiebiatynska@gmail.com',
      crypt('Ma748Blp', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Patrycja',
      last_name = 'Siebiatyńska',
      phone = '515256226',
      university = 'Uniwersytet Medyczny w Białymstoku',
      field_of_study = 'Lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = NULL,
      birth_date = '2002-05-12',
      pesel = '2251203520',
      address = 'Osowicze 21C 16-010 Wasilków',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = NULL,
      fee_valid_until = NULL,
      is_admin = false
    WHERE id = new_uid;
  END IF;

  -- [188] Zofia Łukasiewicz
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'zofialukasiewiczcz@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'zofialukasiewiczcz@gmail.com',
      crypt('a62Vk7Yi', gen_salt('bf')),
      now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      '', '', '', ''
    ) RETURNING id INTO new_uid;

    UPDATE public.profiles SET
      first_name = 'Zofia',
      last_name = 'Łukasiewicz',
      phone = '604259999',
      university = 'Warszawski Uniwersytet Medyczny',
      field_of_study = 'lekarski',
      year_of_study = '3',
      status = 'student',
      join_date = NULL,
      birth_date = NULL,
      pesel = '4271105705',
      address = 'Warszawa, 11/07/2004',
      citizenship = 'polskie',
      rodo_consent = true,
      fee_active = false,
      last_payment_date = NULL,
      fee_valid_until = NULL,
      is_admin = false
    WHERE id = new_uid;
  END IF;

END $$;

-- =============================================================
-- Verify: count imported members
-- =============================================================
SELECT count(*) as total_members FROM public.profiles;
SELECT count(*) as total_auth_users FROM auth.users;
