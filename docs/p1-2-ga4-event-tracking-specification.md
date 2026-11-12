# P1-2 GA4 EVENT TRACKING SPECIFICATION — NOVA SKILLS

**Project:** Nova Skills Education Institute  
**Measurement ID:** `G-9WN9N2KF12`  
**Architecture:** Direct `gtag.js` through `window.NovaAnalytics`  
**Git Branch:** `development`  
**Status:** Approved & Implemented  

---

## 1. Architecture & Dispatch Protocol

All client-side analytics events are processed through the centralized `NovaAnalytics` module (`components.js`), exposed globally on `window.NovaAnalytics` with an alias on `window.sendGA4Event`.

### Dispatch Principles:
1. **Deduplication:** High-frequency events (e.g. `view_course`, `career_advisor_complete`, `form_start`) maintain in-memory lifecycle caches to prevent repeated firing during a single session or user interaction.
2. **Strict PII Elimination:** The dispatcher inspects all incoming payloads against a blacklist (`name`, `phone`, `mobile`, `tel`, `email`, `message`, `query`, `address`, `password`). Any parameter matching this list is purged before transmission.
3. **Environment Tagging:** In local (`localhost`, `127.0.0.1`), preview (`*.pages.dev`), or non-standard port environments, `traffic_type: 'developer'` and `debug_mode: true` are appended automatically, enabling GA4 DebugView while preventing contamination of production reports.
4. **Resilient Queuing:** If the external `gtag.js` library has not finished loading when an event is triggered, the event object is safely queued in `window.dataLayer`.

---

## 2. Event Taxonomy Specification

### A. Lead Generation (Primary Key Event)

#### Event: `generate_lead`
- **Business Significance:** The primary conversion metric for Nova Skills. Measures validated, confirmed candidate enquiries across all admissions funnels.
- **Trigger Rule:** Fires **ONLY** after confirmed backend API response (`res.ok && json.success === true`). Never fires on button click, form input, or client-side validation failure.
- **Parameters:**
  ```json
  {
    "form_id": "demo-booking-form | counselling-booking-form | contact-enquiry-form | course-enrollment-form | counselling-form",
    "form_type": "demo_booking | career_counselling | contact_enquiry | course_enrollment",
    "course_id": "canonical-course-id",
    "academy_id": "academy-id",
    "course_name": "Official Course Title",
    "source_page": "/course-detail.html | /contact/ | / | ...",
    "source_component": "demo_modal | counselling_modal | contact_page_form | enrollment_modal | inline_counselling_form",
    "learning_mode": "online-live | classroom | hybrid",
    "traffic_source": "google | chatgpt.com | direct | ...",
    "traffic_medium": "cpc | organic | referral | none",
    "traffic_campaign": "campaign-name | none",
    "ai_platform": "ChatGPT | Claude | Perplexity | Gemini | none",
    "landing_page": "/original-landing-page-path"
  }
  ```
- **Key Event Designation:** **Yes (Primary)**.

---

### B. Form Discovery & Engagement

#### Event: `form_start`
- **Business Significance:** Measures funnel drop-off by comparing candidates who begin interacting with an enquiry form vs those who complete it.
- **Trigger Rule:** Fires on the candidate's **first meaningful field interaction** (`focusin` or `input`) inside a lead form. Fires strictly once per form instance per session.
- **Parameters:**
  ```json
  {
    "form_id": "demo-booking-form | counselling-booking-form | contact-enquiry-form | course-enrollment-form | counselling-form",
    "form_type": "demo_booking | career_counselling | contact_enquiry | course_enrollment",
    "course_id": "canonical-course-id (if preselected)",
    "academy_id": "academy-id (if preselected)",
    "source_page": "window.location.pathname",
    "source_component": "demo_modal | counselling_modal | homepage_inline | contact_page | enrollment_modal"
  }
  ```
- **Key Event Designation:** No (Standard Funnel Metric).

---

### C. Course Discovery & Exploration

#### Event: `view_course`
- **Business Significance:** Measures genuine candidate interest across Nova Skills' 109 published courses.
- **Trigger Rule:** Fires once per resolved course detail view (`course-detail.html?id=...` or static edge course page). Does not fire on 404 or missing course lookup.
- **Parameters:**
  ```json
  {
    "course_id": "canonical-course-id",
    "course_name": "Official Canonical Course Title",
    "academy_id": "academy-id",
    "page_type": "course_detail"
  }
  ```
- **Key Event Designation:** No (Content Discovery Metric).

#### Event: `select_course`
- **Business Significance:** Tracks candidate course selection actions across global catalogs, academy explorers, related course grids, and form selectors.
- **Trigger Rule:** Fires when a user activates a course card or selects a course option in a form dropdown.
- **Parameters:**
  ```json
  {
    "course_id": "canonical-course-id",
    "course_name": "Course Title",
    "academy_id": "academy-id",
    "selection_source": "catalog_card | academy_explorer | related_course_card | demo_form_select | counselling_form_select"
  }
  ```
- **Key Event Designation:** No (Engagement Metric).

---

### D. AI Career Advisor Interactions

#### Event: `career_advisor_complete`
- **Business Significance:** Measures completion of the AI interactive consultation workflow resulting in a course/academy recommendation.
- **Trigger Rule:** Fires when the AI advisor appends a recommendation card to the dialogue.
- **Parameters:**
  ```json
  {
    "recommended_course_id": "canonical-course-id",
    "recommended_academy_id": "academy-id",
    "assessment_type": "ai_interactive_chat"
  }
  ```
- **Privacy Rule:** Free-text query contents and student answers are strictly excluded.

---

### E. Direct Contact Channel Interactions

#### Event: `click_whatsapp`
- **Trigger Rule:** Candidate clicks any official WhatsApp link (`wa.me`, `whatsapp.com`, floating widget, footer, hero).
- **Parameters:**
  ```json
  {
    "contact_type": "whatsapp",
    "button_id": "whatsapp-float-btn | footer-whatsapp-link | cta-whatsapp-btn",
    "link_type": "floating_button | footer_link | cta_button",
    "source_component": "floating_button | footer_link | cta_button",
    "source_page": "window.location.pathname",
    "page_path": "window.location.pathname"
  }
  ```

#### Event: `click_phone`
- **Trigger Rule:** Candidate clicks a `tel:` link (header telephone, mobile sticky bar, campus card).
- **Parameters:**
  ```json
  {
    "contact_type": "phone",
    "button_id": "header-phone-link | footer-phone-link | cta-phone-btn",
    "source_component": "header-phone-link | footer-phone-link | cta-phone-btn",
    "source_page": "window.location.pathname",
    "page_path": "window.location.pathname"
  }
  ```
- **Privacy Rule:** Phone numbers are strictly scrubbed.

#### Event: `click_email`
- **Trigger Rule:** Candidate clicks a `mailto:` link (contact page, footer).
- **Parameters:**
  ```json
  {
    "contact_type": "email",
    "button_id": "footer-email-link | contact-card-email | email-link",
    "source_component": "footer-email-link | contact-card-email | email-link",
    "source_page": "window.location.pathname",
    "page_path": "window.location.pathname"
  }
  ```

---

### F. Enrolment & E-Commerce Transactions

#### Events: `begin_checkout` & `purchase`
- **Audit Status:** Not implemented in website code.
- **Reason:** Nova Skills does not process credit card or direct payment gateway transactions on novaskills.in. Admissions are finalized through direct counselling.
- **Integrity Rule:** In accordance with prompt instructions, fictitious `purchase` or `begin_checkout` events are **NOT** fabricated.

---

## 3. Attribution Architecture & Parameter Vocabulary

| Parameter Name | Data Type | Scope | Example Value |
|---|---|---|---|
| `form_id` | String | Event | `demo-booking-form` |
| `form_type` | String | Event | `demo_booking` |
| `course_id` | String | Event | `ai-mastery` |
| `course_name` | String | Event | `Generative AI & Automation Mastery` |
| `academy_id` | String | Event | `ai` |
| `source_page` | String | Event | `/course-detail.html` |
| `source_component` | String | Event | `demo_modal` |
| `selection_source` | String | Event | `catalog_card` |
| `learning_mode` | String | Event | `online-live` |
| `traffic_source` | String | Event | `google` |
| `traffic_medium` | String | Event | `cpc` |
| `traffic_campaign` | String | Event | `ai_launch_2026` |
| `ai_platform` | String | Event | `ChatGPT` |
| `contact_type` | String | Event | `whatsapp` |
| `traffic_type` | String | Event | `developer` |
| `debug_mode` | Boolean | Event | `true` |
