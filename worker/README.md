# Nova Skills Enterprise Platform — Cloudflare Worker Backend (v1.0.0)

Enterprise Cloudflare Worker backend integration with OpenAI GPT models, Session Memory, Knowledge Base, Lead Capture & Qualification, Google Sheets CRM, Admin Dashboard, Admin Authentication & Role Authorization, Student Authentication & Authorization, Student Portal (LMS), Course Progress Tracking & Learning Engine, Certificate Generation & Verification, and Communication & Automation Hub.

---

## 🔑 Admin Authentication & Authorization

The Admin Auth System (`worker/src/services/auth.js` & `worker/src/routes/auth.js`) provides dedicated administrator authentication completely separate from student credentials.

### Access & Role Rules:
1. **Admin Login Portal**: Hosted at `/admin/login/`.
2. **Backend API Endpoint**: `POST /api/admin/login`.
3. **Role Authorization**: Access to `admin.html` is strictly restricted to `role = "Admin"` or `role = "SuperAdmin"` (or `"admin"` / `"super_admin"` / `"counsellor"`).
4. **Student Access**: Users with `role = "Student"` are denied access with `403 Forbidden` ("Access denied. Administrator privileges required.") and redirected away from admin routes.

---

## 🌐 API Endpoints

### 1. Admin Login
- **Endpoint**: `POST /api/admin/login`
- **Payload**: `{"email": "admin@novaskills.in", "password": "AdminPass123!"}`
- **Response**:
```json
{
  "success": true,
  "token": "ns_admin_token_1785420000",
  "user": {
    "userId": "usr_admin_master",
    "firstName": "Admin",
    "lastName": "Director",
    "email": "admin@novaskills.in",
    "role": "Admin",
    "status": "ACTIVE"
  }
}
```

### 2. Student Authentication
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Logout**: `POST /api/auth/logout`

---

## 🚀 How to Run Locally & Deploy

```bash
cd worker
npm run dev     # Local Wrangler dev server
npm run deploy  # Deploy to Cloudflare Workers Network
```
