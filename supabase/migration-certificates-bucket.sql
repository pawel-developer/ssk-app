-- Certificate storage bucket for generated membership certificates
-- Run after fix-rls-v3.sql (or any migration that creates public.profiles)

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'certificates_member_read_own'
  ) THEN
    CREATE POLICY "certificates_member_read_own"
      ON storage.objects FOR SELECT TO authenticated
      USING (
        bucket_id = 'certificates'
        AND (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'certificates_admin_read_all'
  ) THEN
    CREATE POLICY "certificates_admin_read_all"
      ON storage.objects FOR SELECT TO authenticated
      USING (
        bucket_id = 'certificates'
        AND EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid() AND p.is_admin = true
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'certificates_admin_insert'
  ) THEN
    CREATE POLICY "certificates_admin_insert"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (
        bucket_id = 'certificates'
        AND EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid() AND p.is_admin = true
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'certificates_admin_update'
  ) THEN
    CREATE POLICY "certificates_admin_update"
      ON storage.objects FOR UPDATE TO authenticated
      USING (
        bucket_id = 'certificates'
        AND EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid() AND p.is_admin = true
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'certificates_admin_delete'
  ) THEN
    CREATE POLICY "certificates_admin_delete"
      ON storage.objects FOR DELETE TO authenticated
      USING (
        bucket_id = 'certificates'
        AND EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid() AND p.is_admin = true
        )
      );
  END IF;
END $$;
