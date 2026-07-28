-- ============================================================
-- NOVA SKILLS ENTERPRISE PLATFORM — SUPABASE POSTGRESQL SCHEMA
-- Version: 1.0.0
-- Description: Production-ready enterprise database schema with RLS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. CORE AUTH & RBAC TABLES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- References auth.users(id)
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    mobile VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'Student',
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

-- ------------------------------------------------------------
-- 2. ACADEMY & COURSE TABLES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    duration_months NUMERIC(3,1) NOT NULL,
    fee_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    module_order INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    duration_hours INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id),
    name VARCHAR(100) NOT NULL,
    trainer_name VARCHAR(100),
    timing_schedule VARCHAR(100),
    start_date DATE,
    end_date DATE,
    max_capacity INT DEFAULT 30,
    status VARCHAR(20) DEFAULT 'Upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. STUDENTS & ADMISSIONS TABLES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    student_code VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    city VARCHAR(100),
    address TEXT,
    emergency_contact VARCHAR(20),
    education_level VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Enrolled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id),
    batch_id UUID REFERENCES public.batches(id),
    lead_id VARCHAR(50),
    total_fee NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    final_fee NUMERIC(10,2) NOT NULL,
    admission_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. ACADEMICS & PROGRESS TABLES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES public.batches(id),
    class_date DATE NOT NULL,
    status VARCHAR(15) NOT NULL CHECK (status IN ('Present', 'Absent', 'Leave')),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    max_marks INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    submission_url TEXT,
    marks_obtained INT,
    feedback TEXT,
    status VARCHAR(20) DEFAULT 'Submitted',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    evaluated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_code VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id),
    issue_date DATE DEFAULT CURRENT_DATE,
    pdf_url TEXT,
    qr_code_hash VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Issued',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 5. FINANCE & PAYMENTS TABLES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id UUID REFERENCES public.admissions(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_mode VARCHAR(30) NOT NULL, -- UPI, Cash, Card, NetBanking
    payment_date DATE DEFAULT CURRENT_DATE,
    transaction_ref VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Paid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 6. COMMUNICATIONS & LOGS TABLES
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wamid VARCHAR(100) UNIQUE,
    recipient VARCHAR(20) NOT NULL,
    template_name VARCHAR(100),
    message_body TEXT,
    status VARCHAR(20) DEFAULT 'Sent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow Users to read their own profile
CREATE POLICY "Users view self profile" ON public.users 
    FOR SELECT USING (auth.uid() = auth_id OR role = 'Super Admin');

-- Allow Students to view their own record
CREATE POLICY "Students view self record" ON public.students 
    FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Service Role Full Access
CREATE POLICY "Service Role full access users" ON public.users FOR ALL USING (true);
CREATE POLICY "Service Role full access students" ON public.students FOR ALL USING (true);

-- ------------------------------------------------------------
-- INDEXES FOR OPTIMIZED PERFORMANCE
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_students_mobile ON public.students(mobile);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_admissions_student ON public.admissions(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_admission ON public.payments(admission_id);

-- ------------------------------------------------------------
-- STORAGE BUCKETS INITIALIZATION
-- ------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public) VALUES 
('profile-photos', 'profile-photos', true),
('assignments', 'assignments', false),
('projects', 'projects', false),
('certificates', 'certificates', true),
('receipts', 'receipts', false),
('marketing-assets', 'marketing-assets', true),
('course-resources', 'course-resources', false),
('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;
