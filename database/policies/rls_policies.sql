-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE MVP
-- Roles: Admin, Student
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- 1. Users RLS Policies
CREATE POLICY "Students view own user record" ON public.users
    FOR SELECT USING (auth.uid() = id OR role = 'Admin');

-- 2. Students RLS Policies
CREATE POLICY "Students view own student record" ON public.students
    FOR SELECT USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
    ));

-- 3. Courses RLS Policies (Public Read for Active Courses)
CREATE POLICY "Anyone view active courses" ON public.courses
    FOR SELECT USING (status = 'Active');

-- 4. Enrollments RLS Policies
CREATE POLICY "Students view own enrollments" ON public.enrollments
    FOR SELECT USING (student_id IN (
        SELECT id FROM public.students WHERE user_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
    ));

-- 5. Files RLS Policies
CREATE POLICY "Students view own files" ON public.files
    FOR SELECT USING (student_id IN (
        SELECT id FROM public.students WHERE user_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'Admin'
    ));
