#!/usr/bin/env python3
"""
Cleans the SSK member CSV and generates SQL for Supabase import.
Handles: data quality issues, column swaps, date normalization,
duplicate detection, and auth.users + profiles bulk creation.
"""

import csv
import re
import sys
from datetime import datetime

INPUT_CSV = "/Users/pawel.siuciak/Downloads/SSK Masterfile - Lista-Czlonkow.csv"
OUTPUT_SQL = "/Users/pawel.siuciak/Documents/SSK/ssk-app/supabase/seed_members.sql"

def parse_date_dmy(raw: str) -> str | None:
    """Parse DD.MM.YYYY (with optional extra text) → YYYY-MM-DD."""
    if not raw or raw.strip() == "-" or raw.strip() == "":
        return None
    raw = raw.strip().rstrip(".")

    # Handle M/D/YYYY format (American-style dates like 1/19/2026)
    m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})$", raw)
    if m:
        month, day, year = int(m.group(1)), int(m.group(2)), int(m.group(3))
        try:
            return datetime(year, month, day).strftime("%Y-%m-%d")
        except ValueError:
            return None

    # Handle DD.MM.YYYY with optional trailing text
    m = re.match(r"^(\d{1,2})\.(\d{1,2})\.(\d{4})", raw)
    if m:
        day, month, year = int(m.group(1)), int(m.group(2)), int(m.group(3))
        try:
            return datetime(year, month, day).strftime("%Y-%m-%d")
        except ValueError:
            return None

    # Handle YYYY-MM-DD
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})", raw)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    return None


def parse_birth_date(raw: str) -> str | None:
    """Extract birth date from messy field like '28.09.2001, Kraków'."""
    if not raw or raw.strip() == "-":
        return None
    raw = raw.strip()

    # Remove leading/trailing quotes and "r." suffix
    raw = raw.strip('"').strip()

    # Try date patterns
    patterns = [
        r"(\d{1,2})\.(\d{1,2})\.(\d{4})",       # DD.MM.YYYY
        r"(\d{1,2})-(\d{1,2})-(\d{4})",          # DD-MM-YYYY
        r"(\d{1,2})/(\d{1,2})/(\d{4})",          # DD/MM/YYYY or MM/DD/YYYY
        r"(\d{4})-(\d{2})-(\d{2})",              # YYYY-MM-DD
    ]

    # DD.MM.YYYY pattern
    m = re.search(r"(\d{1,2})\.(\d{1,2})\.(\d{4})", raw)
    if m:
        day, month, year = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= month <= 12 and 1 <= day <= 31:
            try:
                return datetime(year, month, day).strftime("%Y-%m-%d")
            except ValueError:
                pass

    # DD/MM/YYYY pattern (e.g. "11/07/2004")
    m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})", raw)
    if m:
        day, month, year = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= month <= 12 and 1 <= day <= 31:
            try:
                return datetime(year, month, day).strftime("%Y-%m-%d")
            except ValueError:
                pass

    # YYYY-MM-DD pattern
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", raw)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    # DD-MM-YYYY pattern
    m = re.search(r"(\d{1,2})-(\d{1,2})-(\d{4})", raw)
    if m:
        day, month, year = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if 1 <= month <= 12:
            try:
                return datetime(year, month, day).strftime("%Y-%m-%d")
            except ValueError:
                pass

    return None


def looks_like_address(val: str) -> bool:
    """Heuristic: does this look like a street address rather than a date?"""
    if not val:
        return False
    addr_keywords = ["ul.", "ul ", "os.", "os ", "al.", "al ", "plac ", "Plac ",
                     "/", "m.", "m ", "osiedle", "Osiedle"]
    for kw in addr_keywords:
        if kw in val:
            return True
    if re.search(r"\d{2}-\d{3}", val):  # Polish postal code
        return True
    return False


def looks_like_date(val: str) -> bool:
    """Heuristic: does this look like a birth date string?"""
    if not val:
        return False
    if re.search(r"\d{1,2}\.\d{1,2}\.\d{4}", val):
        return True
    if re.search(r"\d{4}-\d{2}-\d{2}", val):
        return True
    return False


def normalize_status(raw: str) -> str:
    """Normalize status to match DB constraint."""
    if not raw:
        return "student"
    low = raw.strip().lower()
    if low == "student":
        return "student"
    if "absolwent" in low:
        return "absolwent"
    if "rezydent" in low:
        return "rezydent"
    if "stażyst" in low:
        return "stażysta"
    return "student"


def normalize_phone(raw: str) -> str:
    """Remove spaces and clean phone numbers."""
    if not raw or raw.strip() == "#ERROR!":
        return ""
    return raw.strip().replace(" ", "")


def normalize_bool(raw: str) -> bool:
    """Parse tak/nie to boolean."""
    if not raw:
        return False
    return raw.strip().lower() == "tak"


def sql_str(val: str | None) -> str:
    """Escape a string for SQL, or return NULL."""
    if val is None or val.strip() == "" or val.strip() == "-":
        return "NULL"
    escaped = val.replace("'", "''").strip()
    return f"'{escaped}'"


def sql_date(val: str | None) -> str:
    if val is None:
        return "NULL"
    return f"'{val}'"


def sql_bool(val: bool) -> str:
    return "true" if val else "false"


def main():
    rows = []
    with open(INPUT_CSV, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            if len(row) < 18:
                continue
            if not row[1].strip() and not row[2].strip():
                continue  # skip empty rows
            rows.append(row)

    seen_emails = set()
    members = []

    for row in rows:
        lp = row[0].strip()
        first_name = row[1].strip()
        last_name = row[2].strip()
        email = row[3].strip()
        phone = normalize_phone(row[4])
        university = row[5].strip()
        field_of_study = row[6].strip() if row[6].strip() != "-" else ""
        year_of_study = row[7].strip() if row[7].strip() not in ("-", "Nie dotyczy") else ""
        status = normalize_status(row[8])
        join_date_raw = row[9].strip()
        birth_date_raw = row[10].strip()
        pesel = row[11].strip()
        address_raw = row[12].strip()
        citizenship = row[13].strip()
        rodo = normalize_bool(row[14])
        fee_active = normalize_bool(row[15])
        last_payment_raw = row[16].strip()
        fee_valid_until_raw = row[17].strip()
        password = row[18].strip() if len(row) > 18 else ""

        # Detect and fix swapped birth_date / address columns
        if looks_like_address(birth_date_raw) and looks_like_date(address_raw):
            birth_date_raw, address_raw = address_raw, birth_date_raw
        elif looks_like_address(birth_date_raw) and not looks_like_date(address_raw):
            address_raw = birth_date_raw
            birth_date_raw = ""

        # Handle row 189 type issues (PESEL in birth_date column)
        if birth_date_raw and re.match(r"^\d{10,11}$", birth_date_raw):
            if looks_like_date(pesel):
                birth_date_raw, pesel = pesel, birth_date_raw

        # Handle emails with " / " separator — take the first one
        if " / " in email:
            email = email.split(" / ")[0].strip()

        # Skip if no name
        if not first_name or not last_name:
            continue

        # Skip rows with broken/missing password that look like notes
        if password and ("→" in password or "Wpłata" in password):
            continue

        # Skip duplicates by email (keep first occurrence)
        email_lower = email.lower() if email else ""
        if email_lower and email_lower in seen_emails:
            print(f"  Skipping duplicate email: {email} (LP={lp}, {first_name} {last_name})", file=sys.stderr)
            continue
        if email_lower:
            seen_emails.add(email_lower)

        join_date = parse_date_dmy(join_date_raw)
        birth_date = parse_birth_date(birth_date_raw)
        last_payment = parse_date_dmy(last_payment_raw)
        fee_valid_until = parse_date_dmy(fee_valid_until_raw)

        if not email:
            print(f"  Warning: No email for LP={lp} ({first_name} {last_name}), skipping auth user creation", file=sys.stderr)
            continue

        if not password or len(password) < 4:
            print(f"  Warning: No/short password for LP={lp} ({first_name} {last_name}), using default", file=sys.stderr)
            password = "SSK2024!temp"

        # Clean address
        address = address_raw.strip().strip('"').strip()
        if not looks_like_address(address) and not address:
            address = ""

        members.append({
            "lp": lp,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
            "university": university,
            "field_of_study": field_of_study,
            "year_of_study": year_of_study,
            "status": status,
            "join_date": join_date,
            "birth_date": birth_date,
            "pesel": pesel,
            "address": address,
            "citizenship": citizenship,
            "rodo_consent": rodo,
            "fee_active": fee_active,
            "last_payment_date": last_payment,
            "fee_valid_until": fee_valid_until,
            "password": password,
        })

    print(f"\nProcessed {len(members)} members (from {len(rows)} CSV rows)", file=sys.stderr)

    # Generate SQL
    with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
        f.write("-- =============================================================\n")
        f.write("-- SSK Members Seed Data\n")
        f.write("-- Generated from: SSK Masterfile - Lista-Czlonkow.csv\n")
        f.write(f"-- Members: {len(members)}\n")
        f.write("-- =============================================================\n")
        f.write("-- Run this in Supabase Dashboard → SQL Editor\n")
        f.write("-- IMPORTANT: Run migration.sql FIRST if you haven't already!\n")
        f.write("-- =============================================================\n\n")

        # Step 1: Add missing columns to profiles
        f.write("-- Step 1: Add missing columns to profiles table\n")
        f.write("ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date date;\n")
        f.write("ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pesel text DEFAULT '';\n")
        f.write("ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text DEFAULT '';\n")
        f.write("ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS citizenship text DEFAULT 'polskie';\n")
        f.write("ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rodo_consent boolean DEFAULT false;\n\n")

        # Drop the status constraint temporarily to allow more values if needed
        f.write("-- Step 2: Update status constraint to include all needed values\n")
        f.write("ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_status_check;\n")
        f.write("ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check\n")
        f.write("  CHECK (status IN ('student', 'absolwent', 'rezydent', 'stażysta', 'inny'));\n\n")

        # Step 3: Bulk insert using DO block
        # The on_auth_user_created trigger auto-creates a bare profile (id + email).
        # We INSERT into auth.users, then UPDATE the auto-created profile with full data.
        f.write("-- Step 3: Create auth users → trigger auto-creates profile → update profile\n")
        f.write("DO $$\n")
        f.write("DECLARE\n")
        f.write("  new_uid uuid;\n")
        f.write("BEGIN\n\n")

        for i, m in enumerate(members):
            f.write(f"  -- [{m['lp']}] {m['first_name']} {m['last_name']}\n")

            f.write(f"  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = {sql_str(m['email'])}) THEN\n")

            # Insert into auth.users (trigger creates bare profile automatically)
            f.write(f"    INSERT INTO auth.users (\n")
            f.write(f"      instance_id, id, aud, role, email, encrypted_password,\n")
            f.write(f"      email_confirmed_at, created_at, updated_at,\n")
            f.write(f"      raw_app_meta_data, raw_user_meta_data,\n")
            f.write(f"      confirmation_token, recovery_token, email_change_token_new, email_change\n")
            f.write(f"    ) VALUES (\n")
            f.write(f"      '00000000-0000-0000-0000-000000000000',\n")
            f.write(f"      gen_random_uuid(),\n")
            f.write(f"      'authenticated',\n")
            f.write(f"      'authenticated',\n")
            f.write(f"      {sql_str(m['email'])},\n")
            f.write(f"      crypt({sql_str(m['password'])}, gen_salt('bf')),\n")
            f.write(f"      now(), now(), now(),\n")
            f.write(f"      '{{\"provider\": \"email\", \"providers\": [\"email\"]}}',\n")
            f.write(f"      '{{}}',\n")
            f.write(f"      '', '', '', ''\n")
            f.write(f"    ) RETURNING id INTO new_uid;\n\n")

            # UPDATE the auto-created profile with full member data
            is_admin = m['email'].lower() == 'pawelsiuciak1@gmail.com'
            f.write(f"    UPDATE public.profiles SET\n")
            f.write(f"      first_name = {sql_str(m['first_name'])},\n")
            f.write(f"      last_name = {sql_str(m['last_name'])},\n")
            f.write(f"      phone = {sql_str(m['phone'])},\n")
            f.write(f"      university = {sql_str(m['university'])},\n")
            f.write(f"      field_of_study = {sql_str(m['field_of_study'])},\n")
            f.write(f"      year_of_study = {sql_str(m['year_of_study'])},\n")
            f.write(f"      status = {sql_str(m['status'])},\n")
            f.write(f"      join_date = {sql_date(m['join_date'])},\n")
            f.write(f"      birth_date = {sql_date(m['birth_date'])},\n")
            f.write(f"      pesel = {sql_str(m['pesel'])},\n")
            f.write(f"      address = {sql_str(m['address'])},\n")
            f.write(f"      citizenship = {sql_str(m['citizenship'])},\n")
            f.write(f"      rodo_consent = {sql_bool(m['rodo_consent'])},\n")
            f.write(f"      fee_active = {sql_bool(m['fee_active'])},\n")
            f.write(f"      last_payment_date = {sql_date(m['last_payment_date'])},\n")
            f.write(f"      fee_valid_until = {sql_date(m['fee_valid_until'])},\n")
            f.write(f"      is_admin = {sql_bool(is_admin)}\n")
            f.write(f"    WHERE id = new_uid;\n")
            f.write(f"  END IF;\n\n")

        f.write("END $$;\n\n")

        f.write("-- =============================================================\n")
        f.write("-- Verify: count imported members\n")
        f.write("-- =============================================================\n")
        f.write("SELECT count(*) as total_members FROM public.profiles;\n")
        f.write("SELECT count(*) as total_auth_users FROM auth.users;\n")

    print(f"SQL written to: {OUTPUT_SQL}", file=sys.stderr)


if __name__ == "__main__":
    main()
