# 📜 Nova Skills Audit Log System Specification

Version: **1.0.0**  
Target Database: **Supabase PostgreSQL (`audit_logs` table)**  
API Route: **`GET /api/admin/activity`**

---

## 🏛️ System Architecture & Automatic Hooks

```text
Admin Action / System Event
  ↓
logAuditEvent() Hook (src/services/auditLogger.js)
  ↓
Supabase PostgreSQL `audit_logs` Table
  ↓
GET /api/admin/activity (Admin Activity Dashboard: admin-activity.html)
```

---

## 📋 Tracked Events Matrix

The audit system records only key operational and administrative actions:

| Action Name | Module | Description Example |
| :--- | :--- | :--- |
| `Login` | Auth | Admin / User logged in |
| `Logout` | Auth | User logged out |
| `Student Created` | Student | Created student profile for STU-1001 |
| `Student Updated` | Student | Updated mobile number for STU-1001 |
| `Student Disabled` | Student | Deactivated student account |
| `Course Created` | Course | Created course Full Stack Web Dev |
| `Course Updated` | Course | Updated fee for Python AI |
| `Course Archived` | Course | Archived course program |
| `Settings Updated` | Settings | Updated platform tagline or contact details |

---

## 🗄️ Database Table Schema (`audit_logs`)

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID PK` | Auto-generated UUID |
| `user_id` | `UUID` | ID of performing user |
| `user_role` | `VARCHAR(50)` | Role of performing user (`Admin`, etc.) |
| `action` | `VARCHAR(100)` | Event action name |
| `entity_type` | `VARCHAR(50)` | Module/Entity (`Student`, `Course`, `Settings`, `Auth`) |
| `entity_id` | `UUID` | Target entity UUID |
| `description` | `TEXT` | Human-readable log details |
| `ip_address` | `VARCHAR(50)` | IP Address |
| `user_agent` | `TEXT` | Browser User-Agent |
| `created_at` | `TIMESTAMPTZ` | Timestamp of event |

---

## 🔒 Security & Access Control

- **Admin Only**: Only authenticated Admin users can invoke `GET /api/admin/activity` or view `admin-activity.html`.
- **Students Denied**: Students are strictly blocked from accessing audit log endpoints or views.
