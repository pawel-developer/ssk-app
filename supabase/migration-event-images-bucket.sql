-- Create public bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Admins can upload event images
CREATE POLICY "admin_upload_event_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'event-images'
    AND public.is_admin()
  );

-- Admins can delete event images
CREATE POLICY "admin_delete_event_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'event-images'
    AND public.is_admin()
  );

-- Anyone can read event images (public bucket)
CREATE POLICY "public_read_event_images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'event-images');
