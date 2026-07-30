# Nova Skills Enterprise Platform — Cloudflare Worker Backend (v1.0.0)

Enterprise Cloudflare Worker backend integration with OpenAI GPT models, Session Memory, Knowledge Base, Lead Capture & Qualification, Google Sheets CRM, Admin Dashboard, Student Authentication & Authorization, Student Portal (LMS), Course Progress Tracking & Learning Engine, Certificate Generation & Verification, and Communication & Automation Hub.

---

## 📡 Communication & Automation Hub (Phase 14)

The Communication Hub (`worker/src/services/communication.js` & `worker/src/repositories/communicationRepository.js`) provides a centralized multi-channel automation engine for Emails, WhatsApp messages, and Student In-App Notifications.

### Core Architecture Components:
1. **Template Engine**: Dynamic placeholder substitution (`{{studentName}}`, `{{courseName}}`, `{{certificateNumber}}`, `{{phone}}`).
2. **Provider Adapter Pattern**: Decoupled `EmailProvider` (SMTP/SendGrid) and `WhatsAppProvider` (Meta WhatsApp Business API).
3. **Automation Rules Engine**: Listens to system triggers (`NEW_LEAD`, `ADMISSION_CONFIRMED`, `ASSIGNMENT_DUE`, `CERTIFICATE_GENERATED`) and automatically executes multi-channel actions.
4. **Communication Repository**: Logs all sent/queued messages and manages student in-app notifications.

---

## 🌐 Communication API Endpoints

### 1. Send Email
- **Endpoint**: `POST /api/email/send`
- **Payload**: `{"to": "student@example.com", "templateKey": "LEAD_RECEIVED", "data": {"name": "Rahul", "courseName": "Digital Marketing"}}`

### 2. Send WhatsApp Message
- **Endpoint**: `POST /api/whatsapp/send`
- **Payload**: `{"toPhone": "9876543210", "templateKey": "ADMISSION_CONFIRMATION", "data": {"name": "Rahul"}}`

### 3. Run Automation Engine
- **Endpoint**: `POST /api/automation/run`
- **Payload**: `{"triggerEvent": "NEW_LEAD", "payload": {"name": "Rahul", "email": "rahul@gmail.com", "phone": "9876543210"}}`

### 4. Student Notifications
- **Endpoint**: `GET /api/notifications?userId=usr_student_demo`

### 5. Communication Logs
- **Endpoint**: `GET /api/communications/logs`

---

## 🚀 How to Run Locally & Deploy

```bash
cd worker
npm run dev     # Local Wrangler dev server
npm run deploy  # Deploy to Cloudflare Workers Network
```
