-- Performance indexes for admin/member listing queries
-- Minimal-risk DB-only change (no UI logic changes)

CREATE INDEX IF NOT EXISTS idx_profiles_last_name
  ON public.profiles (last_name);

CREATE INDEX IF NOT EXISTS idx_payment_confirmations_status_uploaded_at
  ON public.payment_confirmations (status, uploaded_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_confirmations_member_id_uploaded_at
  ON public.payment_confirmations (member_id, uploaded_at DESC);
