-- Storage policies for all buckets
-- Allow authenticated users to upload, update, delete
-- Allow public (anon) to read/download

-- Gallery bucket
CREATE POLICY "Allow public read on gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Allow authenticated upload to gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Allow authenticated update in gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery');
CREATE POLICY "Allow authenticated delete from gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');

-- Team bucket
CREATE POLICY "Allow public read on team" ON storage.objects FOR SELECT USING (bucket_id = 'team');
CREATE POLICY "Allow authenticated upload to team" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'team');
CREATE POLICY "Allow authenticated update in team" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'team');
CREATE POLICY "Allow authenticated delete from team" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'team');

-- Partners bucket
CREATE POLICY "Allow public read on partners" ON storage.objects FOR SELECT USING (bucket_id = 'partners');
CREATE POLICY "Allow authenticated upload to partners" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'partners');
CREATE POLICY "Allow authenticated update in partners" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'partners');
CREATE POLICY "Allow authenticated delete from partners" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'partners');

-- Hero bucket
CREATE POLICY "Allow public read on hero" ON storage.objects FOR SELECT USING (bucket_id = 'hero');
CREATE POLICY "Allow authenticated upload to hero" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero');
CREATE POLICY "Allow authenticated update in hero" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'hero');
CREATE POLICY "Allow authenticated delete from hero" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'hero');

-- Services bucket
CREATE POLICY "Allow public read on services" ON storage.objects FOR SELECT USING (bucket_id = 'services');
CREATE POLICY "Allow authenticated upload to services" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'services');
CREATE POLICY "Allow authenticated update in services" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'services');
CREATE POLICY "Allow authenticated delete from services" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'services');

-- General bucket
CREATE POLICY "Allow public read on general" ON storage.objects FOR SELECT USING (bucket_id = 'general');
CREATE POLICY "Allow authenticated upload to general" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'general');
CREATE POLICY "Allow authenticated update in general" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'general');
CREATE POLICY "Allow authenticated delete from general" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'general');
