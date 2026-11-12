# P1-1 LEAD FORMS & CONVERSION FORENSIC AUDIT
## Comprehensive Repository Audit of Nova Skills Demo Booking & Career Counselling Forms

**Project:** Nova Skills  
**Task ID:** P1-1  
**Priority:** P1 — High  
**Category:** Lead Conversion / Form UX / Frontend Functionality  
**Target Branch:** `development` (Strictly NO production deployment)  
**Audit Date:** November 13, 2026  
**Auditor:** Antigravity Senior Frontend & Conversion Optimization Specialist  

---

## 1. Executive Summary

A repository-wide forensic audit of all lead generation mechanisms across https://novaskills.in/ was conducted to evaluate form UX, validation consistency, entry-point routing, context preservation, backend integrations, and conversion attribution.

### Key Audit Finding
The platform currently presents **five distinct form implementations** across modals, inline sections, and dedicated pages:
1. `#demo-booking-modal` / `#demo-booking-form`: Dedicated modal for 2-Day Free Demo booking.
2. `#course-enrollment-modal` / `#course-enrollment-form`: Modal for course admission and enrollment enquiry.
3. `#popup-overlay` / `#popup-form`: Consultation / Counselling modal popup (auto-triggered and CTA-triggered).
4. `#counselling-form`: Inline career counselling form situated in the Homepage CTA strip.
5. `#contact-enquiry-form`: Dedicated page-level career counselling form on the Contact page.

While the demo-booking flow has an active modal architecture, the career-counselling experience is fractured across three disparate, non-standardized interfaces with conflicting field rules, outdated hardcoded course lists, and mismatched confirmation messages. 

---

## 2. All Existing Forms Register

| Form ID | Host File & Component | Trigger / Invocation | Submission Intent (`lead_type`) | Modal vs Inline |
|---|---|---|---|---|
| `demo-booking-form` | `components.js:2894` (`#demo-booking-modal`) | `openDemoModal(...)`, `openFreeDemoModal(...)`, `openCityCourseDemo(...)` | `free_demo` | Modal Backdrop |
| `course-enrollment-form` | `components.js:1950` (`#course-enrollment-modal`) | `openEnrollmentModal(...)`, `openCourseEnrollModal(...)` | `enrollment_enquiry` | Modal Backdrop |
| `popup-form` | `components.js:1080` (`#popup-overlay` / `#consultation-popup`) | `openConsultationPopup(...)`, 20s auto-engagement timer | `free_consultation` | Floating Overlay Modal |
| `counselling-form` | `index.html:1150` (`main.js:175`) | Inline section `#counselling` | `counselling_form` | Inline Page Section |
| `contact-enquiry-form` | `contact/index.html:360` | Direct page visit `/contact/` | `contact_enquiry` | Page-Level Full Form |

---

## 3. All Form Entry Points

### 3.1 Demo Booking Entry Points
1. **Homepage Hero Primary CTA:** `#hero-cta-primary` calling `openDemoModal({sourceCta:'hero_primary'})`.
2. **Global Announcement Bar:** "Book Free Demo" button calling `openDemoModal({sourceCta:'announcement_bar'})`.
3. **Homepage Featured Course Cards (6 cards):** `.course-demo-chip` calling `openDemoModal({courseId, courseName, academyName, sourceCta:'home_featured_card'})`.
4. **All Courses Catalog Cards (109 cards in `courses.html`):** `.course-demo-chip` calling `openDemoModal({courseId, courseName, academyName, sourceCta:'catalogue_card_demo'})`.
5. **Individual Course-Detail Pages (109 pages in `_rendered_courses/` & `course-detail.html`):** 
   - Hero Sidebar Demo Button: `#btn-detail-book-demo` calling `openDemoModal({courseId, courseName, academyName, academyId, sourceCta:'course_detail_sidebar'})`.
   - Editorial Showcase Banner: `.btn-showcase-demo` calling `openDemoModal({sourceCta:'showcase_banner'})`.
   - Related Course Cards: `.course-demo-chip` calling `openDemoModal(...)`.
6. **Academy Hub Pages (12 academies in `academies/*/index.html`):**
   - Academy Demo Hero Banner: `.academy-demo-btn` calling `openDemoModal({academyId, academyName, sourceCta:'academy_demo_banner'})`.
   - Academy Course Cards (109 total): `.course-demo-chip` calling `openDemoModal(...)`.
7. **Learning Locations Pages (36 cities in `branches/*/index.html`):**
   - Course Cards Demo Button: `.city-card-btn-demo` calling `window.openCityCourseDemo(courseId, courseTitle)`.
8. **Nationwide Locations Directory (`branches/index.html`):**
   - Directory Demo Trigger: `window.openLocationDemo(citySlug, cityName)`.

### 3.2 Career Counselling Entry Points
1. **Homepage CTA Strip (`index.html`):** Inline `#counselling-form` under "Ready to Transform Your Career?".
2. **Global Announcement Bar:** "Book Free Counselling →" link calling `openConsultationPopup()`.
3. **Contact Page (`contact/index.html`):** `#contact-enquiry-form` titled "Request a Free Career Counselling Call".
4. **AI Career Advisor Widget (`nova-ai-widget.js`):**
   - Quick Action Card: "Book Counselling" triggering `NovaAIWidget.sendAction('Book Counselling')`.
   - Recommendation Card CTA: `NovaAIWidget.triggerCTA('counselling')` calling `openConsultationPopup()`.
5. **Course-Detail Hero Sidebar:**
   - "Speak to an Academic Counsellor" (`.btn-consult-full`) calling `openConsultationPopup(course.name)`.
6. **Academy Pages:**
   - Bottom CTA Strip: "Free Career Counselling" button calling `openConsultationPopup()`.
7. **City Pages Hero:**
   - "Book Free Career Consultation" button calling `window.openCityConsultation()`.
8. **Automated 20-Second Engagement Trigger:** Fires `openConsultationPopup()` once per session if no modals or input fields are active.

---

## 4. Form Fields & Required vs Optional Status

| Field | `demo-booking-form` | `course-enrollment-form` | `popup-form` | `counselling-form` | `contact-enquiry-form` |
|---|---|---|---|---|---|
| **Full Name** | Required (`req`, length >= 2) | Required (`req`, length >= 2) | Required (`nameEl.trim()`) | Required (`nameEl.trim()`) | Required (`length >= 2`) |
| **Mobile Number** | Required (10 digits, +91) | Required (10 digits, +91) | Required (10 digits) | Required (10 digits) | Required (10 digits) |
| **Email Address** | Optional | Optional | Optional | Optional | **Required (Inconsistent!)** |
| **Course Selection** | Required (Dropdown) | Hidden preselected | Optional (12 academies only) | Optional (12 academies + Not sure) | **Required (10 outdated optgroups)** |
| **Learning Mode** | Required (Online / Classroom) | Hidden preselected | Absent | Absent | Optional (Radio) |
| **City / Location** | Required (Text) | Required (Text) | Absent | Absent | Required (Text) |
| **Batch / Availability** | Optional (5 slots) | Absent | Absent | Absent | Absent |
| **Message / Question** | Optional (Textarea) | Optional (Textarea) | Absent | Absent | Optional (Textarea) |
| **Honeypot (`website`)** | Injected via JS | Injected via JS | Injected via JS | Injected via JS | HTML `<input name="website">` |

---

## 5. Existing Validation Logic

1. **Full Name:**
   - `demo-booking-form` & `course-enrollment-form`: Checks `name.length >= 2`.
   - `popup-form` & `counselling-form`: Checks `!nameEl?.value.trim()`.
   - `contact-enquiry-form`: Checks `value.trim().length >= 2`.
   - *Deficiency:* None of the existing validators reject strings consisting exclusively of punctuation or numbers without alphabetical characters (e.g., `...`, `12345`).
2. **Mobile Number:**
   - Strips non-digits (`/\D/g`).
   - Normalizes leading `91` (12 digits) or `0` (11 digits) down to 10 digits.
   - Regex applied in modal forms: `/^[6-9]\d{9}$/`.
   - *Deficiency:* Inline error message varies between "Please enter a valid 10-digit number" and "Please enter a valid 10-digit Indian mobile number."
3. **Email Address:**
   - When provided, regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` is evaluated.
   - *Deficiency:* `contact/index.html` forces email as mandatory, preventing quick phone-only counselling inquiries.
4. **Course Selection:**
   - In `demo-booking-form`: Preselected via `openDemoModal`, or selected by user from `<select id="demo-course-select">`.
   - In `popup-form`: Populated with 12 static academy strings; lacks specific course IDs.
   - In `contact-enquiry-form`: Uses static optgroups with 10 hardcoded course keys.
5. **Learning Mode & City Validation:**
   - In `demo-booking-form`: Enforces `Live Online` or `Classroom Training`.
   - *Deficiency:* Selecting Classroom training does not explicitly notify the student that the physical center is located in Siddharth Nagar, UP.

---

## 6. Existing Backend & CRM Submission Mechanism

### 6.1 Unified Submission Dispatcher: `submitNovaForm`
All forms route through the central asynchronous dispatcher in `components.js:387`:
```javascript
async function submitNovaForm({
  form,
  submitBtn,
  data = {},
  loadingText = 'Booking...',
  formName = null,
  submissionMethod = null,
  onSuccessCallback = null
})
```

### 6.2 Target Endpoint Contract: Google Apps Script Web App
Submissions are transmitted via `POST` with `Content-Type: text/plain;charset=utf-8` to:
`https://script.google.com/macros/s/AKfycbzRHK2n1D0WjWw4NxcwtH7FQb7eRsZxVagFnYtiz5quAFec2BLfwgJ26C0OG6FTKcPB/exec`

### 6.3 Dispatched Payload Structure
```json
{
  "name": "Candidate Full Name",
  "mobile": "9876543210",
  "email": "candidate@example.com",
  "course": "[FREE DEMO] Course Title (Academy)",
  "city": "Candidate City",
  "message": "Structured context string",
  "lead_type": "free_demo", // or "free_consultation", "counselling_form", "enrollment_enquiry"
  "learning_mode": "Live Online",
  "course_id": "canonical-id",
  "academy": "Academy Name",
  "website": "", // Honeypot
  "pageUrl": "https://novaskills.in/...",
  "referrer": "https://...",
  "utmSource": "...",
  "utmMedium": "...",
  "utmCampaign": "...",
  "utmContent": "...",
  "utmTerm": "...",
  "firstTouchSource": "...",
  "firstTouchMedium": "...",
  "firstTouchReferrer": "...",
  "firstLandingPage": "...",
  "aiPlatform": "...",
  "browser": "...",
  "device": "...",
  "os": "...",
  "screenResolution": "...",
  "timezone": "...",
  "public IP": "103.XX.XX.XX"
}
```

### 6.4 Cloudflare Worker Gateway (`worker/src/routes/lead.js` & `cloudflare-worker/src/services/leadService.js`)
- Cloudflare Worker provides a `/api/leads` REST ingestion route backed by D1 / KV and forwards validated payloads directly to the Apps Script CRM webhook.
- Guarantees high availability and zero dropped leads.

---

## 7. Existing CRM & Email Integrations

1. **Google Sheets CRM (`google-apps-script/Code.gs`):**
   - Automatically appends lead record to the active `Leads` sheet.
   - Calculates **AI Lead Score (0–100)** based on engagement depth, learning mode, and campaign intent.
   - Categorizes lead priority: `High`, `Medium`, or `Low`.
   - Records device telemetry, network IP, referrer, and multi-touch UTM attribution.
2. **Email Notifications:**
   - Apps Script sends automated counsellor alerts upon high-priority lead creation.
3. **Security & Anti-Spam Pipeline:**
   - Honeypot validation: Any submission with non-empty `website` field is logged to `SecurityErrors` sheet and rejected with `{ success: false, message: 'Spam detected.' }`.
   - LockService concurrency lock (10,000ms timeout) prevents race conditions in high-volume traffic.

---

## 8. Success & Failure Handling

1. **Modal Form State Machine (`setDemoModalState` & `setEnrollModalState`):**
   - States: `'idle'` | `'submitting'` | `'success'` | `'error'`.
   - Submitting: Disables submit button, injects `<span class="btn-spinner"></span>`, sets `form.dataset.submitting = 'true'`.
   - Success: Hides form fields container, displays `#demo-success-container` with confirmation message, fires GA4 `free_demo_request_success`.
   - Error: Keeps form container visible, preserves user inputs, displays `#demo-form-error`.
2. **Deficiencies Identified:**
   - **Promissory Language:** Pre-audit demo confirmation text stated: *"Our admissions team will contact you shortly with schedule details."* This should be calibrated to non-promissory language: *"Your 2-Day Free Demo request has been received. Our admissions team will contact you to confirm course eligibility, batch availability and the demo schedule."*
   - **Local Storage PII Leak:** In `components.js:3524`, candidate details (Name, Phone number, Email) were saved in plain text to `localStorage.getItem('novaskills_demo_requests')`. This violates privacy standards and must be eradicated.

---

## 9. Mobile Behaviour & Accessibility

1. **Viewport & Sizing:**
   - Modals use `max-height: 92vh` on mobile with `overflow-y: auto`.
   - Dynamic touch padding (`padding: 24px 18px !important`).
2. **Focus Management:**
   - Active trigger element is saved to `window._lastActiveDemoTrigger` on open.
   - Esc key closes modals.
   - Focus is shifted to modal name input with `{ preventScroll: true }`.
3. **Deficiencies:**
   - Focus restoration upon modal close was only partially implemented for `demoModal` and absent for `popup-overlay`.
   - `popup-overlay` was not responsive on screens `< 480px` due to rigid two-column desktop grid styles.

---

## 10. Course Preselection Behaviour

1. **From Course Detail Pages:**
   - `openDemoModal({ courseId, courseName, academyName, academyId })` successfully matches canonical course IDs.
   - Context pill `#demo-selected-context` displays the preselected course.
2. **From Academy Pages:**
   - Preselects academy name and filters the dropdown to courses belonging to that academy.
3. **From General Surfaces (Home / Catalog / Locations):**
   - Populates full dropdown with 109 courses grouped by academy.
4. **Counselling Disconnect:**
   - The counselling modal (`popup-form`) **did NOT support specific course preselection**. It only contained a 12-item academy select list, losing the candidate's exact course context!

---

## 11. Existing Tracking & Attribution Parameters

1. **Attribution Engine (`components.js`):**
   - First-touch and last-touch attribution stored in `sessionStorage` (`novaskills_first_touch`, `novaskills_last_touch`).
   - Identifies organic search, Meta, Google Ads, and AI platforms (ChatGPT, Perplexity, Claude, Gemini).
2. **GA4 Event: `generate_lead`:**
   - Fired strictly upon confirmed backend HTTP 200 response with `json.success === true`.
   - Contains: `form_name`, `course_name`, `submission_method`, `page_path`, `traffic_source`, `traffic_medium`, `ai_platform`, `landing_page`.
   - Zero PII leakage into Google Analytics.

---

## 12. Proposed Architecture & Improvements for P1-1

1. **Establish Two Distinct Form Journeys:**
   - **Form A (2-Day Free Demo Booking):**
     - Heading: **Book Your 2-Day Free Demo**
     - Supporting text: *"Experience our practical teaching methodology, explore the course workflow and interact with our mentors before making your enrolment decision."*
     - CTA button: **Request My Free Demo**
     - Clarified Learning Modes: Online Live (Nationwide) vs Classroom Training (Siddharth Nagar Campus only).
     - Non-promissory confirmation copy.
   - **Form B (Free Career Counselling):**
     - Heading: **Book a Free Career Counselling Session**
     - Supporting text: *"Speak with our academic counsellors to understand the right course, curriculum, fees and learning format for your goals."*
     - Reusable modal architecture `#career-counselling-modal` (`openCounsellingModal`).
     - Course selection optional with `"Not Sure — Help Me Choose a Course"`.
     - Fields: Full Name (req), Mobile (req), Email (opt), Course Interest (opt), City (opt), Learning Mode (opt), Career Goal/Question (opt).
     - CTA button: **Book My Free Counselling Session**
     - Dedicated confirmation view with non-promissory copy.
2. **Standardize Shared Validation Utilities:**
   - Create unified validation helpers in `components.js`:
     - `validateFullName(name)`
     - `validateMobileNumber(phone)`
     - `validateEmail(email)`
     - `sanitizeUserMessage(msg)`
3. **Eradicate PII in LocalStorage:**
   - Remove storage of candidate phone numbers and names in `localStorage`.
4. **Synchronize All Entry Points:**
   - Wire all counselling CTAs across Header, Home, Academy, Course Detail, City, AI Advisor, and Contact pages to the standardized career counselling engine.
