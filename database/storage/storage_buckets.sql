-- ============================================================
-- STORAGE BUCKETS & RLS POLICIES FOR SUPABASE MVP
-- Buckets: profile-images, documents, certificates
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES 
('profile-images', 'profile-images', true),
('documents', 'documents', false),
('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Read Profile Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Public Read Certificates" ON storage.objects
    FOR SELECT USING (bucket_id = 'certificates');

CREATE POLICY "Authenticated Upload Documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
