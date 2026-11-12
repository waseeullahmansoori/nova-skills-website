# P1-2 FORENSIC AUDIT — GA4 ANALYTICS & LEAD CONVERSION TRACKING

**Project:** Nova Skills Education Institute  
**Task ID:** P1-2  
**Audit Date:** November 2026  
**Audited Target:** Entire Git Repository (`development` branch)  

---

## 1. Executive Summary & Measurement Infrastructure

A comprehensive forensic audit of all tracking scripts, analytics configurations, HTML templates, and conversion handlers was performed across the Nova Skills codebase.

### Primary Measurement Infrastructure:
- **GA4 Measurement ID:** `G-9WN9N2KF12` is the single, authoritative, approved Google Analytics 4 Measurement ID deployed across all 178+ HTML pages.
- **Google Tag Manager (GTM):** No active GTM web container is deployed on the website. References to `GTM-` in the repository exist exclusively inside curriculum syllabus data files (e.g. `google-analytics-ga4.json`) as educational course content.
- **Implementation Mechanism:** Direct `gtag.js` with an asynchronous, non-blocking bootstrap architecture in `<head>`:
  ```html
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9WN9N2KF12', { 'send_page_view': true });
  </script>
  ```
  The gtag external script (`https://www.googletagmanager.com/gtag/js?id=G-9WN9N2KF12`) is lazily loaded upon initial user interaction (e.g., scroll, pointerdown, touchstart) or idle timeout (5–7 seconds), optimizing Core Web Vitals while guaranteeing event queuing via `window.dataLayer`.

---

## 2. Discovered Measurement IDs & Configurations

| Identified String | File Context | Type / Status |
|---|---|---|
| `G-9WN9N2KF12` | `index.html`, `course-detail.html`, `courses.html`, `contact/index.html`, `branches/*`, `academies/*` | **Production & Development GA4 Measurement ID** (Active & Authoritative) |
| `G-SPECIALIST`, `G-JAVASCRIPT`, etc. | `data/courses/*.json` | Course curriculum taxonomy codes; NOT analytics IDs |
| `G-XXXXXXXXXX` | `data/curricula/google-analytics-ga4.json` | Sample placeholder in GA4 course syllabus |
| `GTM-XXXXXXX` / `GTM-NS2026` | `data/courses/google-analytics-ga4.json`, test canvases | Course curriculum case studies; NOT active GTM containers |

**Audit Conclusion:** There is exactly one GA4 property configured (`G-9WN9N2KF12`). Zero competing Measurement IDs or duplicate GTM containers exist.

---

## 3. Audit of Existing Event Implementations

| Event Name | Current File(s) | Trigger Mechanism | Current Parameters & Risks |
|---|---|---|---|
| `generate_lead` | `components.js:680` | Confirmed backend response (`json.success === true`) in `submitNovaForm` | Carries `form_name`, `course_name`, `submission_method`, `page_path`, `traffic_source`, `traffic_medium`, `ai_platform`, `landing_page`. Zero PII. |
| `free_demo_request_success` | `components.js:3593` | Inside `handleDemoSubmit` callback after `submitNovaForm` | **Duplicate Event Risk:** Emits an additional custom conversion event alongside `generate_lead`, causing inflation if both are marked as Key Events. |
| `career_counselling_request_success` | `components.js:4227` | Inside `handleCounsellingSubmit` callback after `submitNovaForm` | **Duplicate Event Risk:** Emits an additional custom conversion event alongside `generate_lead`. |
| `click_whatsapp` | `components.js:1666` | Global click listeners on `a[href*="wa.me"]`, floating WhatsApp pill, footer links | Carries `source_component`, `source_page`, `destination_phone`. Safe. |
| `click_phone` | `components.js:1681` | Global click listeners on `a[href^="tel:"]` | Carries `source_component`, `source_page`. Strips phone numbers (Zero PII). |
| `email_click` | `contact/index.html:1035` | Local click listeners on `a[href^="mailto:"]` on contact page only | **Inconsistency:** Non-standard event name (`email_click` vs `click_email`); missing across other site pages (e.g. footer email link). |
| `map_click` | `contact/index.html:1042` | Clicks on campus Google Maps link | Local to contact page. |
| `project_preview_zoom` | `course-detail.js:2455` | Click on capstone project lightbox preview | UI engagement tracking. |
| `user_ai_query` | `nova-ai-widget.js:1841` | Dispatched on chat input submission | **CRITICAL PII RISK:** Sends raw `query: userText` to GA4. If user provides personal info, it leaks into GA4 event parameters! |
| `location_*` | `js/locations-city.js`, `js/locations-directory.js` | Location directory page interactions (`location_page_view`, `location_city_search`, etc.) | Location explorer metrics. |

---

## 4. Gap Analysis: Missing Standardized Events

The following mandatory events required by the GA4 Measurement Specification are currently missing or incomplete:

1. **`view_course` (Mandatory):**
   - **Current State:** Missing. When a student visits a course detail page (e.g. `/course-detail.html?id=ai-mastery`), only a generic page view is captured; no structured `view_course` event is dispatched.
   - **Requirement:** Fire once per resolved course detail view with `course_id`, `course_name`, `academy_id`, and `page_type: 'course_detail'`.
2. **`select_course` (Mandatory):**
   - **Current State:** Missing in courses catalog (`courses.html`), academy detail explorers (`academies/*`), and lead forms.
   - **Requirement:** Track course selection in catalog search/filter, academy explorer, and form dropdowns with `course_id`, `course_name`, `academy_id`, and `selection_source`.
3. **`form_start` (Mandatory):**
   - **Current State:** Completely missing. No tracking exists for candidate form initiation.
   - **Requirement:** Fire once on the candidate's first meaningful field interaction (`focus` / `input`) across Form A (`#demo-booking-form`), Form B (`#counselling-booking-form`), Homepage `#counselling-form`, and Contact `#contact-enquiry-form`.
4. **`career_advisor_complete` (Mandatory):**
   - **Current State:** AI widget tracks `ai_widget_opened`, `action_card_clicked`, `user_ai_query`, `cta_clicked`, but does NOT track assessment completion with structured recommendations.
   - **Requirement:** Dispatch `career_advisor_complete` with `recommended_academy_id`, `recommended_course_id`, `assessment_type`, and eliminate raw query PII.
5. **`click_email` (Standardization):**
   - **Current State:** Only tracked on `contact/index.html` under legacy name `email_click`.
   - **Requirement:** Unify across all pages as `click_email` with `{ source_page, source_component, contact_type: 'email' }`.
6. **Unified `NovaAnalytics` Module:**
   - **Current State:** Dispersed ad-hoc helpers (`sendGA4Event`, `trackEvent`, `trackConversion`).
   - **Requirement:** Establish a single authoritative, deduplicated `NovaAnalytics` API on `window.NovaAnalytics`.

---

## 5. Existing Form-Tracking & Conversion Integrity

- **Backend Submission Requirement:** Currently, `submitNovaForm` in `components.js` correctly delays `generate_lead` until `res.ok && json.success === true`.
- **Deduplication:** A `form.dataset.submitting` guard exists during flight. However, secondary success events (`free_demo_request_success`, `career_counselling_request_success`) create duplicate conversion signals.
- **Form Intent Separation:** Form A (`free_demo` / `demo_booking`) and Form B (`career_counselling`) are cleanly distinguished in payloads, but parameters need strict standardization to match GA4 Key Event specifications.

---

## 6. Attribution & Marketing Campaign Integrity

- **Current Architecture:** `components.js` captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, and referrer domain, storing them in `sessionStorage.nova_attribution`.
- **Multi-Touch & AI Search Attribution:** Preserves first-touch landing pages and detects AI search engines (ChatGPT, Claude, Perplexity, Gemini).
- **Preservation:** Session storage correctly survives multi-page internal navigation from homepage to academy to course detail and modal forms.

---

## 7. Consent, Privacy & PII Audit

- **Consent Framework:** Nova Skills does not deploy a third-party cookie blocking CMP. Google Consent Mode is configured by default with analytics storage enabled.
- **PII Leakage Vectors Identified:**
  1. `nova-ai-widget.js:1841`: `trackEvent('user_ai_query', { query: userText })` — transmits un-sanitized user chat inputs.
  2. Phone click tracking was verified in P1-1 to ensure phone numbers are NOT sent in GA4 parameters.
  3. Form fields (Name, Phone, Email, Message) are correctly excluded from `sendGA4Event`.

---

## 8. Payment & Checkout Availability

- **Audit Findings:** Exhaustive inspection of the entire repository confirms that **no online payment gateway (Razorpay, Stripe, Cashfree, etc.) is integrated**.
- **Enrolment Flow:** Course enrolment is handled exclusively through academic counselling and direct admissions onboarding.
- **Protocol:** `begin_checkout` and `purchase` events must NOT be fabricated. They are formally documented as future integrations once a payment gateway is implemented.

---

## 9. Development vs. Production Tracking

- **Traffic Contamination Risk:** All environments currently point to `G-9WN9N2KF12`.
- **Mitigation:**
  - Add `traffic_type: 'developer'` or `debug_mode: true` when running on `localhost`, `127.0.0.1`, or development preview domains.
  - Implement GA4 internal/developer traffic tagging so developers and QA do not pollute production conversion aggregates.

---

## 10. Exact Files Requiring Modification

1. `components.js`:
   - Create unified `window.NovaAnalytics` module with standardized API:
     `trackEvent`, `trackPageView`, `trackCourseView`, `trackCourseSelect`, `trackFormStart`, `trackLeadGenerated`, `trackWhatsAppClick`, `trackPhoneClick`, `trackEmailClick`, `trackCareerAdvisorComplete`.
   - Implement deduplication cache preventing duplicate event emission within the same session/window.
   - Standardize `generate_lead` payload parameters (`form_id`, `form_type`, `course_id`, `academy_id`, `course_name`, `source_page`, `source_component`, `learning_mode`).
   - Remove redundant secondary success events (`free_demo_request_success`, `career_counselling_request_success`).
   - Add global click listener for `click_email` on all `mailto:` anchors.
   - Add environment detection for `debug_mode` / `traffic_type` on non-production hosts.
2. `course-detail.js`:
   - Fire `trackCourseView(course)` once canonical course is resolved.
   - Fire `trackCourseSelect` when candidate clicks related course recommendations.
3. `courses.js` & `courses.html`:
   - Fire `trackCourseSelect` when candidate clicks a course card or applies catalog filter.
4. `academy-detail.js`:
   - Fire `trackCourseSelect` when candidate clicks course cards in the academy curriculum explorer.
5. `nova-ai-widget.js`:
   - Eliminate raw `user_ai_query` PII parameter.
   - Fire `trackCareerAdvisorComplete` when recommendation card is rendered.
6. `index.html` & `contact/index.html`:
   - Bind `trackFormStart` on first field focus.
   - Unify `click_email` tracking.
7. Minified scripts (`js/*.min.js`):
   - Recompile via `scripts/build_min_js.js`.
