# P1-7 Refund Policy Transparency & Pre-Enrolment Disclosure — Forensic Audit

**Project:** Nova Skills  
**Task ID:** P1-7  
**Date:** November 13, 2026  
**Auditor:** Antigravity Engineering & Legal Compliance Audit  
**Scope:** Repository-wide audit of refund policy visibility, course-page pricing components, enrolment modals, payment entry points, and legal consistency across all 109 published courses.

---

## 1. Executive Summary

A critical consumer protection and educational trust requirement is that prospective students must understand applicable cancellation and refund terms *before* making an enrolment decision or paying fees.

This forensic audit evaluated:
1. The official Nova Skills Refund Policy published at `https://novaskills.in/refund-policy/`.
2. Pricing and enrolment CTAs across all 109 course-detail pages, catalog pages, and academy hubs.
3. The actual enrolment submission mechanism (`course-enrollment-modal` in `components.js`).
4. Payment gateway integrations and checkout architecture.
5. Inconsistencies and ambiguities within the existing legal text.

### Key Audit Finding
While Nova Skills maintains a comprehensive, 10-section legal Refund Policy page (`refund-policy/index.html`), **zero course-detail pages currently expose refund disclosures or policy links near course pricing or the "Enroll Now" CTA**. Furthermore, the enrolment modal (`course-enrollment-modal`) previously provided zero notice regarding refund conditions, leaving prospective students uninformed about cooling-off periods or promotional non-refundable terms at the primary conversion moment.

---

## 2. Published Legal Refund Policy Inventory

- **Canonical URL:** `https://novaskills.in/refund-policy/`
- **Published Effective Date:** July 29, 2026
- **Policy Version:** Version 1.0 (Student Trust & Gateway Compliant)
- **Status:** Active Public Document

### Summary of Published Policy Clauses

| Section | Title | Key Provisions & Thresholds |
|---|---|---|
| **Section 1** | Introduction & Scope | Applies to all 12 academies and both Live Online & Classroom training modes. |
| **Section 2** | Course Registration & Fees | Identifies non-refundable initial seat-booking fee (typically 10% to 15% or up to ₹1,000) and tuition fee balance. Identifies payment channels (offline desk cash/cheque/NEFT, online UPI/card/gateways). |
| **Section 3A** | Requests ≥ 7 Days Before Batch | 100% Tuition Fee refund minus nominal administrative registration fee (capped at ₹1,000 or 10% of total fee, whichever is lower). |
| **Section 3B** | Requests < 7 Days Before Batch | 48-Hour Cooling-Off window from exact timestamp of enrolment, provided 1st class has not commenced. Eligible requests receive 90% of total fees paid. |
| **Section 3C** | Personal Emergencies | Free one-time batch transfer to any upcoming cohort within 6 months. |
| **Section 4** | Non-Refundable Situations | Strictly non-refundable after: (1) batch launch/attendance, (2) LMS/materials activation, (3) voluntary absence/withdrawal, (4) code of conduct violations, (5) discounted/promotional/scholarship enrolments, (6) post-launch change of mind. |
| **Section 5** | Institute Cancellation / Delay | If Nova Skills cancels or delays a batch start by > 14 calendar days: Option 1 = 100% full refund with zero deductions; Option 2 = Priority transfer. |
| **Section 6** | Request Process | Written email required to `novaskills.official@gmail.com` with student details, transaction receipt, reason, and bank details. |
| **Section 7** | Processing Timelines | Acknowledgement: 24–48 business hours; Audit phase: 3–5 business days; Disbursement: 7–10 working days upon approval. |
| **Section 8** | Disbursement Method | Online payments refunded to original source card/UPI/net-banking account; offline refunded via NEFT/IMPS or cheque. |
| **Section 9** | Legal Terms & Cross-Links | Integrated with Privacy Policy (`privacy-policy/`) and Terms & Conditions (`terms-and-conditions/`). |
| **Section 10** | Contact Support Desk | Admissions & Refund Desk at Siddharth Nagar campus and official email. |

---

## 3. Forensic Analysis: Inconsistencies & Ambiguities

### Forensic Issue 1: Policy Precedence Conflict (Section 3 vs Section 4)
- **Conflict:** Sections 3A and 3B describe standard refund eligibility (100% tuition refund $\ge 7$ days before batch; 90% refund within 48-hour cooling-off window). However, Section 4 explicitly lists *"Discounted / Promotional / Scholarship Enrollments"* as strictly non-refundable.
- **Risk:** Almost all published courses currently offer an introductory launch fee (e.g. ₹64,900 launch vs ₹89,900 regular on `ai-mastery`). If every launch-priced enrolment is legally treated as an excluded "promotional enrolment", the cooling-off window in Section 3B would be rendered illusory for 100% of current students.
- **Auditor Assessment:** The interaction between promotional pricing and cooling-off rights requires formal management and legal determination. Frontend code must not fabricate a legal ruling; it must transparently state that promotional restrictions apply as specified in the published policy.

### Forensic Issue 2: Registration Deposit Calculation Discrepancy
- **Conflict:** Section 2 defines the registration deposit as *"typically 10% to 15% of the total course fee or up to ₹1,000"*. Section 3A defines the deduction as *"nominal administrative registration fee (capped at ₹1,000 or 10% of total fee, whichever is lower)"*.
- **Risk:** For a ₹64,900 course, 10% is ₹6,490, whereas "capped at ₹1,000" would limit the deduction to ₹1,000.
- **Auditor Assessment:** An automatic client-side refund calculator must not be implemented until management formalizes the exact mathematical formula.

### Forensic Issue 3: Zero Course-Detail Refund Visibility
- **Pre-Audit State:**
  - `course-detail.html`: 0 references or links to `refund-policy`.
  - All 109 pre-rendered course HTML pages (`_rendered_courses/*.html`): 0 refund policy links near the pricing display or enroll cards.
  - Sticky enroll card: displays price, discount, and GST disclosure, but provides zero notice that refund conditions exist.
- **Impact:** Prospective students reached the point of booking or enquiring without any indication that cancellations are subject to strict cut-offs or non-refundable clauses.

---

## 4. Enrolment & Payment Architecture Audit

### Current Enrolment Mechanism
1. **No Live Gateway Active:** The website contains no live client-side payment gateway SDK (no active Razorpay checkout modal, no Stripe Elements tokenization script).
2. **Real Enrolment Flow:** The "Enroll Now" and "Book Seat" buttons trigger `openEnrollmentModal(...)`, injecting `#course-enrollment-modal` (`components.js`).
3. **Intent Classification:**
   - **Free Demo Modal (`#demo-modal`):** Information / consultation request. Must NOT have mandatory refund agreement checkboxes.
   - **Career Counselling Modal (`#counsel-modal`):** Consultation request. Must NOT have mandatory refund agreement checkboxes.
   - **Admission Enquiry Modal (`#course-enrollment-modal`):** Pre-enrolment application. Requires prominent pre-enrolment disclosure link advising students to review the Refund & Cancellation Policy before fee remittance.
4. **Future Payment Gateway Requirements:** If and when live checkout (Razorpay/Stripe) is activated, an explicit, unchecked checkbox (`"I have read and agree to the Refund & Cancellation Policy"`) must be enforced before payment initiation, and the accepted policy version (`1.0`) and server timestamp logged in the payment record.

---

## 5. Scope of Corrective Implementations (P1-7)

| Location | Pre-Audit Status | P1-7 Corrective Action |
|---|---|---|
| `course-detail.html` | No refund information | Add dedicated **Refund & Cancellation Information** block in `#cost-transparency-section` and an accessible disclosure link inside the sticky enroll card. |
| `course-detail.js` | No refund logic | Implement dynamic rendering of the refund disclosure summary and link within the course detail renderer. |
| `scripts/build-course-pages.js` | No static refund HTML | Inject standardized refund disclosure card into all 109 pre-rendered course detail pages. |
| `components.js` (`course-enrollment-modal`) | Generic privacy notice only | Add pre-enrolment refund advisory text with direct link to `/refund-policy/` above submit action. |
| `components.js` (Footer) | Labeled "Refund Policy" | Update label to standardized **Refund & Cancellation Policy** for consistency. |
| `data/refund-disclosure.json` | Missing | Create canonical data registry defining policy URL, version, clauses, and disclosure snippets. |
| `docs/` | Missing legal docs | Create `p1-7-refund-disclosure-forensic-audit.md`, `p1-7-refund-policy-legal-approval-required.md`, and `p1-7-refund-disclosure-implementation-report.md`. |
| `scripts/validate-refund-disclosures.js` | Missing | Create comprehensive automated test suite verifying all 109 courses and form journeys. |
