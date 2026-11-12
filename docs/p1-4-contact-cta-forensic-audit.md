# P1-4 FORENSIC AUDIT — WHATSAPP & TELEPHONE CONTACT CTAS

**Project:** Nova Skills Education Platform  
**Task ID:** P1-4  
**Category:** Contact UX / Lead Conversion / WhatsApp / Telephone Integration  
**Target Environment:** Development Branch (`development`)  
**Audit Date:** November 2026  
**Status:** Completed  

---

## 1. Executive Summary & Approved Contact Identity

A comprehensive repository-wide forensic audit of all WhatsApp and telephone contact touchpoints, URLs, `tel:` protocols, prefilled messages, and event trackers was conducted across the Nova Skills website.

### Approved Admissions Contact Identity:
* **Display Helpline:** `+91 9695904440`
* **Callable Telephone Protocol:** `tel:+919695904440`
* **WhatsApp Destination Number:** `919695904440` (International E.164 without leading `+` for `wa.me`)
* **Standard WhatsApp Endpoint:** `https://wa.me/919695904440?text=...`
* **Operating Schedule:** Monday to Saturday, 09:00 – 19:00 IST (`Asia/Kolkata`)
* **Physical Campus:** Nova Skills Institute, Siddharth Nagar, Uttar Pradesh - 272153

### Audit Findings Summary:
1. **Phone Number Uniformity:** The approved number `+91 9695904440` is consistently referenced across active admissions channels. No conflicting, secondary, or obsolete admissions phone numbers exist on the website.
2. **Callable `tel:` Link Coverage:** The shared footer, mobile navigation drawer, Contact page cards, and Academy page CTA bars correctly use `tel:+919695904440`. However, the desktop header `nav-actions` container currently lacks a dedicated phone CTA pill.
3. **WhatsApp Link Standardization:** The majority of WhatsApp links target `https://wa.me/919695904440`. However, prefilled messages are largely generic (`"Hi, I'm interested in Nova Skills courses. Can you help me?"`) and fail to adapt when users navigate between course-detail pages, academy hubs, and city pages.
4. **Decentralized Contact Utilities:** Contact links and prefilled strings are duplicated across templates (`scripts/build-academy-pages.js`, `course-detail.js`, `contact/index.html`, and `components.js`) rather than consuming one single source of truth (`CONTACT_CONFIG`).

---

## 2. Comprehensive Contact CTA Inventory Across 20 Key Components

The following inventory details every contact action across the website's templates, components, and pages:

| # | Component / Page Type | Current Displayed Number | Actual Link / Href | Current Behaviour / Message | Target & Rel | Context Awareness | Required Remediation |
|---|---|---|---|---|---|---|---|
| **1** | **Homepage Header (`components.js`)** | Not displayed | No call link in `.nav-actions` (repurposed for Login) | Opens login page | — | None | Add callable `tel:+919695904440` CTA in `.nav-actions`. |
| **2** | **Homepage Navigation (Desktop)** | Not displayed | Menu items only | Dropdowns | — | None | Retain clean menu; rely on header phone pill. |
| **3** | **Homepage Hero (`index.html`)** | Not displayed | Focuses on Demo & Explore Courses | Opens demo modal or scrolls to courses | — | None | Maintain primary demo/course focus; no change needed. |
| **4** | **Homepage Footer (`components.js`)** | `+91 9695904440` | `tel:+919695904440` (Phone) & `https://wa.me/919695904440` (WA) | Dials phone; WA link lacks prefilled text | `_blank`, `noopener noreferrer` | Generic | Add standard general enquiry message to footer WhatsApp link. |
| **5** | **Floating WhatsApp Button** | None (Icon) | `https://wa.me/919695904440?text=Hi%2C%20I%27m...` | Generic message | `_blank`, `noopener noreferrer` | Generic (only course-detail updates it) | Dynamically update prefilled text based on active page context (course, academy, city). |
| **6** | **Contact Page Cards (`contact/index.html`)** | `+91 9695904440 ↗` | `tel:+919695904440` | Callable dialler | — | General | Retain callable `tel:` link; consume `CONTACT_CONFIG`. |
| **7** | **Contact Page WhatsApp Card** | `Chat on WhatsApp ↗` | `https://wa.me/919695904440?text=Hi%2C%20I%27m...` | Generic enquiry | `_blank`, `noopener noreferrer` | General | Standardize to canonical general enquiry text. |
| **8** | **Contact Page Final CTA Banner** | `📞 Call +91 9695904440` | `tel:+919695904440` & `https://wa.me/919695904440?text=Hi%2C%20I%27m%20ready...` | Dialler & generic chat | `_blank`, `noopener noreferrer` | General | Standardize button hierarchy (Primary: WhatsApp, Secondary: Call). |
| **9** | **All 12 Academy Pages (Final CTA)** | None (Label: `📞 Call Now`) | `tel:+919695904440` & `https://wa.me/919695904440?text=...` | Dials phone & sends `"Hi Nova Skills, I want to know more about admission & fees for [Academy]"` | `_blank`, `noopener` | Academy-specific | Update prefilled message to exact Section 5 specification; use central generator. |
| **10** | **Course-Detail Pages (Sidebar/Hero)** | None | Only Demo & Counselling form modals wired | Modals | — | Course-specific | Ensure course-specific admissions WhatsApp & phone CTAs are accessible. |
| **11** | **Course-Detail Pages (Floating Button)** | None | `updateWhatsAppCourseLink(courseName, pathTitle)` | Custom message string | `_blank`, `noopener noreferrer` | Course-specific | Standardize message format to Section 5 canonical specification. |
| **12** | **All Courses Catalog (`courses.html`)** | In Footer | Footer links only | Global footer | — | General | Ensure floating WhatsApp button reflects catalog exploration. |
| **13** | **Learning Locations Directory (`branches/index.html`)** | In Footer | Footer links only | Global footer | — | General | Ensure floating WhatsApp button reflects location exploration. |
| **14** | **Individual City Pages (36 Cities)** | In Footer | Footer links only; section 12 has demo & consultation buttons | Modals | — | City-specific | Add context-aware WhatsApp CTA in city conversion section and update floating button. |
| **15** | **Placement Page (`placements.html`)** | In Footer | Footer links only | Global footer | — | General | Ensure floating WhatsApp button and footer are fully active. |
| **16** | **AI Career Advisor (`nova-ai-widget.js`)** | `+91 9695904440` | `tel:+919695904440` & `https://wa.me/919695904440?text=...` | Markdown links in human escalation reply | — | Generic counsellor chat | Update WhatsApp handoff link to include recommended course when discussed. |
| **17** | **Demo-Booking Forms (`components.js`)** | In fallback error text | None (Form only; error banner mentions `+91 9695904440`) | Form submission | — | Form context | Ensure error banner provides clickable WhatsApp link. |
| **18** | **Counselling Forms (`components.js`)** | In fallback error text | None (Form only; error banner mentions `+91 9695904440`) | Form submission | — | Form context | Ensure error banner provides clickable WhatsApp link. |
| **19** | **Mobile Navigation Drawer (`components.js`)** | `+91 9695904440` | `tel:+919695904440` (`#mobile-drawer-phone-btn`) | Callable dialler | — | General | Add corresponding "Chat on WhatsApp" action alongside Call Admissions. |
| **20** | **Sticky Mobile Enroll Bar (`course-detail.html`)** | Not displayed | Enroll button only | Opens enrollment modal | — | Course-specific | Keep clean; ensure floating WhatsApp button lifts above sticky bar without collision. |

---

## 3. Detailed Forensic Findings & Critical Deficiencies

### 3.1. Verification of Callable `tel:` Links
* **Finding:** The website uses valid `tel:+919695904440` attributes on all existing phone buttons. No pseudo-buttons (`href="#"` or unlinked spans) masquerade as call links.
* **Deficiency:** On desktop, there is no direct helpline link in the main navigation header; prospective students must scroll to the footer or visit `/contact/` to find the callable number.
* **Resolution:** Introduce a compact `.nav-phone` action pill in `buildHeaderHTML()` in [components.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/components.js) displaying `+91 9695904440` with `href="tel:+919695904440"`.

### 3.2. WhatsApp Click-to-Chat Format & Redundancy
* **Finding:** All WhatsApp links use the official `https://wa.me/` endpoint format with international country code `91` followed by the 10-digit number `9695904440`. No duplicate country codes (e.g. `9191...` or `+91...`) were found in `wa.me` destinations.
* **Deficiency:** WhatsApp messages are constructed via string concatenation across multiple files without central encoding or escaping rules.
* **Resolution:** Centralize all WhatsApp link generation inside `CONTACT_CONFIG` / `NovaContact` helpers using `encodeURIComponent()`.

### 3.3. Context-Aware WhatsApp Messaging Discrepancy
* **Finding:** When navigating across different academies or city pages, the floating WhatsApp button remains locked to the initial generic message: `"Hi, I'm interested in Nova Skills courses. Can you help me?"`.
* **Deficiency:** Students who explore specific academies (e.g., *Digital Marketing Academy*) or location pages (e.g., *Indore*) must manually type their interest.
* **Resolution:** Implement a dynamic context observer that inspects active page attributes on load and dynamically updates `#whatsapp-btn.href` with the specific message dictated by Section 5 of P1-4.

### 3.4. Analytics Alignment
* **Finding:** Central click listeners in `components.js` correctly capture `click_whatsapp` and `click_phone` events via `NovaAnalytics`.
* **Deficiency:** In some cases, `source_component`, `course_id`, `academy_id`, and `city` are left empty because links lack data attributes.
* **Resolution:** Enhance the central click tracking handler to automatically resolve page context from `NovaContact.resolveCurrentPageContactContext()` when element attributes are absent.

---

## 4. Remediation Architecture & Central Module Plan

1. **Create `CONTACT_CONFIG` & `NovaContact` Helper Module:**
   - Define canonical contact properties (`displayNumber`, `phoneNumber`, `whatsappNumber`, `operatingHours`).
   - Implement `getAdmissionsPhoneLink()`, `getAdmissionsWhatsAppLink(context)`, `getWhatsAppMessage(context)`, `formatAdmissionsPhoneNumber()`, and `validateContactNumber(num)`.
2. **Inject Contact CTAs in Header & Navigation:**
   - Add callable desktop header helpline pill in `components.js`.
   - Add WhatsApp direct action in mobile navigation drawer.
3. **Harmonize Academy & Course Page Messages:**
   - Update `scripts/build-academy-pages.js` and `academy-detail.js` to consume `NovaContact.getAdmissionsWhatsAppLink()`.
   - Update `course-detail.js` to consume canonical course message templates.
4. **Automate Context Updates on Page Navigation:**
   - Bind dynamic updater to DOM ready to keep floating WhatsApp button context-aware sitewide.
5. **Develop Automated Test Suite:**
   - Create `scripts/validate-contact-ctas.js` testing every link, phone protocol, WhatsApp destination, contextual message, and analytics payload.
