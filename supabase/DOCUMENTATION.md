# 🚀 Nova Skills Enterprise Supabase Architecture & Database Specification

Version: **1.0.0**  
Target Database: **Supabase PostgreSQL 15+**  
Gateway Layer: **Cloudflare Worker (`cloudflare-worker/`)**

---

## 🏛️ Target Enterprise Architecture

```text
Browser (Desktop / Mobile PWA)
  ↓
Cloudflare Pages
  ↓
Cloudflare Worker (Sole API Gateway with Service Role Key)
  ↓
┌─────────────────────────────────────────────────────────┐
│                      SUPABASE                           │
│  - PostgreSQL Operational DB (Users, Students, Fees)    │
│  - Storage Buckets (Certificates, Receipts, Projects)   │
│  - Row Level Security (RLS) & Role-Based Access (RBAC)  │
└─────────────────────────────────────────────────────────┘
  ↓ (Sync / Staged Lead Ingestion)
Google Apps Script CRM & Google Sheets (Historical Lead CRM & Lightweight Analytics)
```

---

## 🔒 Security Model & Key Rules

1. **Zero Public Service Role Exposure**:
   The `SUPABASE_SERVICE_ROLE_KEY` is isolated inside **Cloudflare Worker Secrets**. No browser or frontend client EVER communicates directly with Supabase using elevated credentials.

2. **Row Level Security (RLS)**:
   All PostgreSQL tables have RLS enabled:
   - **Students**: Only allowed to SELECT their own records and assignments.
   - **Counsellors**: Allowed to SELECT & UPDATE assigned leads.
   - **Admins & Super Admins**: Full management access controlled by the RBAC matrix.

3. **Soft Delete Policy**:
   All core tables include `deleted_at TIMESTAMPTZ` columns to prevent accidental data loss.

---

## 📊 Database Schema Overview (22 Tables)

### 1. Auth & RBAC
- `roles` (Super Admin, Admin, Admission Manager, Counsellor, Trainer, Student, etc.)
- `permissions` (code-based granular permissions)
- `role_permissions` (junction matrix table)
- `users` (mapped to `auth.users`)

### 2. Academy & Batches
- `courses` (Digital Marketing, Web Dev, Python & AI, Graphic Design, Video Editing)
- `course_modules` (Order, title, description, duration)
- `batches` (Trainer, schedule, start/end dates, max capacity)

### 3. Students & Admissions
- `students` (Student code, contact info, city, emergency contact, education)
- `admissions` (Linked student, course, batch, total fee, discount, final fee)

### 4. Academics & Progress
- `attendance` (Present, Absent, Leave logs)
- `assignments` (Due dates, total marks)
- `assignment_submissions` (Submission URLs, marks obtained, feedback)
- `certificates` (Unique certificate codes, PDF URLs, QR hashes)

### 5. Finance & Communications
- `payments` (Receipt numbers, payment modes, amounts, transaction refs)
- `whatsapp_messages` (WAMID logs, template names, status tracking)
- `audit_logs` (User actions, table names, IPs, timestamps)

---

## 📁 Storage Buckets Created

| Bucket Name | Access Level | Purpose |
| :--- | :--- | :--- |
| `profile-photos` | Public | Student & staff avatar images |
| `assignments` | Private (RLS) | Student assignment file uploads |
| `projects` | Private (RLS) | Student capstone project assets |
| `certificates` | Public | Official course certificates (PDF / Images) |
| `receipts` | Private (RLS) | Fee payment receipts |
| `marketing-assets` | Public | Website & social ad creative assets |
| `course-resources` | Private (RLS) | Course ebooks, source code, templates |
| `documents` | Private (RLS) | Student identity & admission documents |

---

## 🔄 Staged Migration Strategy

1. **Google Sheets Compatibility**:
   - Google Apps Script continues collecting incoming website form leads into Google Sheets (`Leads` sheet).

2. **Staged Sync Utility**:
   - Cloudflare Worker invokes `POST /api/supabase/sync` to read leads from Google Sheets and stage them into Supabase `students` and `admissions` tables without deleting or corrupting historical Google Sheets data.

3. **Verification**:
   - Dual-write & verification step ensures zero lead loss during transition.

---

## 🐙 Deployment Instructions

1. Execute `supabase/schema.sql` in your Supabase SQL Editor.
2. Store environment secrets in Cloudflare Worker:
   ```bash
   cd cloudflare-worker
   npx wrangler secret put SUPABASE_URL
   npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   ```
