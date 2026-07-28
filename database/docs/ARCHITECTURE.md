# 📐 Nova Skills Operational Backend MVP Architecture

Version: **1.0.0 (MVP)**  
Target Database: **Supabase PostgreSQL 15+**  
Gateway: **Cloudflare Worker API Gateway**

---

## 🏛️ System Architecture

```text
Browser (Client)
  ↓
Cloudflare Pages (Static Frontend)
  ↓
Cloudflare Worker (API Gateway & Service Role Key Holder)
  ↓
Supabase Operational Backend
  ├── PostgreSQL Tables (users, students, courses, enrollments, files)
  ├── Storage Buckets (profile-images, documents, certificates)
  └── Supabase Auth (Email / Password)
  ↓
Google Apps Script CRM & Google Sheets (Independent Lead Ingestion)
```

---

## 🗄️ Database Tables (5 MVP Tables)

1. `users`: System users with `Admin` or `Student` role.
2. `students`: Enrolled student profiles linked to `users(id)`.
3. `courses`: Academy course master data (fee, duration, status).
4. `enrollments`: Student course enrollment and batch records.
5. `files`: File metadata and upload records.

---

## 🔐 Security & RLS Policies

- **Service Role Key**: Isolated strictly within Cloudflare Worker Secrets.
- **Students**: Restricted to SELECT only their own user, student, enrollment, and file records via `auth.uid()`.
- **Admins**: Granted full CRUD access across all MVP tables and storage objects.

---

## 📁 Storage Buckets

- `profile-images`: Public read access for avatars.
- `documents`: Private RLS access for student identity & submission documents.
- `certificates`: Public read access for course completion certificates.
