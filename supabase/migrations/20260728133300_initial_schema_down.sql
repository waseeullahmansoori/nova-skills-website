-- ============================================================
-- NOVA SKILLS INITIAL SUPABASE SCHEMA ROLLBACK (DOWN)
-- Version: 20260728133300
-- ============================================================

DROP INDEX IF EXISTS idx_courses_course_name;
DROP INDEX IF EXISTS idx_students_student_code;
DROP INDEX IF EXISTS idx_users_email;

DROP TABLE IF EXISTS public.files CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
