# P1-3 CRM INTEGRATION ARCHITECTURE — NOVA SKILLS CENTRAL ADMISSIONS CRM

**Project:** Nova Skills Education Platform  
**Document:** System Integration & Technical Architecture  
**Task ID:** P1-3  
**Status:** Implemented & Verified  
**Target Environment:** Development Branch (`development`)  

---

## 1. Architectural Overview

The Nova Skills Admissions CRM Architecture establishes a unified, reliable, secure pipeline connecting every lead generation form on the website directly to the central Google Apps Script CRM infrastructure and its underlying Google Sheets repository (`"Leads"` worksheet).

```mermaid
flowchart TD
    subgraph Frontend ["Frontend Lead Entry Points"]
        A["Form A: 2-Day Free Demo<br/>#demo-booking-form"]
        B["Form B: Free Career Counselling<br/>#counselling-booking-form"]
        C["Homepage Inline Counselling<br/>#counselling-form"]
        D["Contact Page Enquiry<br/>#contact-enquiry-form"]
        E["Course Enrollment Modal<br/>#course-enrollment-form"]
        F["Consultation Popup<br/>#popup-form"]
        G["AI Career Advisor Handoff<br/>nova-ai-widget.js"]
        H["Location Page CTAs<br/>locations-city.js & directory"]
    end

    subgraph CentralDispatcher ["Central Submission Pipeline (components.js)"]
        V["NovaFormValidator<br/>• Strict 10-digit Indian Mobile<br/>• Full Name Validation<br/>• Spam & Honeypot Check"]
        I["Client-Side Idempotency Controller<br/>• Unique leadId (NS-LEAD-*)<br/>• Preserved on form.dataset across retries"]
        T["Taxonomy Resolver (Section 5)<br/>• demo_booking<br/>• career_counselling<br/>• admission_enquiry<br/>• course_enquiry<br/>• career_advisor_handoff<br/>• general_enquiry"]
        M["Minor Safeguard Engine<br/>• Kids Tech Academy detection<br/>• guardianConsentRequired: true<br/>• Parental consent tag in notes"]
        S["OWASP Formula Injection Sanitizer<br/>• Prefix =, +, -, @, \t, \r with single quote"]
        Attr["Multi-Touch Attribution Resolver<br/>• First-touch (source, medium, landing page)<br/>• Latest-touch (UTMs, referrer, pageUrl)<br/>• AI Platform identification"]
    end

    subgraph Backend ["Admissions Backend & Storage"]
        GAS["Google Apps Script Web App<br/>exec endpoint (doPost)"]
        DEDUP["Deduplication & Merge Engine<br/>Matches: leadId | sessionId | phone | email"]
        SHEET[("Google Sheets CRM<br/>Worksheet: 'Leads'<br/>21 Canonical Columns")]
        CFW["Cloudflare Worker CRM Gateway<br/>(Optional enterprise proxy)"]
    end

    subgraph Analytics ["Analytics & Telemetry"]
        GA4["Google Analytics 4<br/>Recommended Event: generate_lead<br/>Zero PII payload"]
    end

    A --> V
    B --> V
    C --> V
    D --> V
    E --> V
    F --> V
    G --> V
    H --> V

    V --> I --> T --> M --> S --> Attr
    Attr -->|POST JSON Payload| GAS
    Attr -.->|Optional API Gateway| CFW
    CFW -.-> GAS
    GAS --> DEDUP
    DEDUP -->|Row Update or Append| SHEET

    GAS -->|HTTP 200 {success: true}| CentralDispatcher
    CentralDispatcher -->|Backend Confirmed Success Only| GA4
    CentralDispatcher -->|Clear currentLeadId & Show Toast| Frontend
```

---

## 2. End-to-End Submission Sequence

The following sequence diagram details the complete lifecycle of a lead submission, demonstrating how idempotency, formula sanitization, error resilience, and verified success tracking interact:

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student / Candidate
    participant Form as Lead Form (DOM)
    participant Dispatcher as submitNovaForm (components.js)
    participant Validator as NovaFormValidator
    participant CRM as Google Apps Script CRM
    participant Sheet as Google Sheets ("Leads")
    participant GA4 as Google Analytics 4

    Student->>Form: Enters Name, Mobile, Email, Course, City
    Student->>Form: Clicks Submit / Request CTA
    Form->>Dispatcher: submitNovaForm({ form, submitBtn, data })
    Dispatcher->>Validator: Validate inputs (Name, Phone, Email, Honeypot)
    alt Validation Fails
        Validator-->>Form: Render inline error & focus first invalid field
    else Validation Passes
        Dispatcher->>Form: Set button to loading spinner & set dataset.isFetching
        Dispatcher->>Dispatcher: Retrieve or generate idempotency leadId ('NS-LEAD-*')
        Dispatcher->>Dispatcher: Resolve standardized formType (Section 5 taxonomy)
        Dispatcher->>Dispatcher: Detect Kids Tech Academy -> tag guardianConsentRequired
        Dispatcher->>Dispatcher: Sanitize all string fields against formula injection (=, +, -, @)
        Dispatcher->>Dispatcher: Enrich payload with first-touch and latest-touch attribution
        Dispatcher->>CRM: fetch(NS_SCRIPT_ENDPOINT, { method: 'POST', body: JSON.stringify(payload) })
        alt Network Failure / CRM 500 Error
            CRM-->>Dispatcher: Network error or HTTP 500
            Dispatcher->>Form: Re-enable submit button, keep user inputs intact
            Dispatcher->>Form: Retain form.dataset.currentLeadId for retry
            Dispatcher->>Student: Show error notification toast / modal error banner
            Note over Dispatcher,Student: Zero fake success; user can click retry without retyping!
        else Backend Confirmed Success (HTTP 200 { success: true })
            CRM->>Sheet: Deduplicate (by leadId, sessionId, phone, email)
            Sheet-->>CRM: Row updated or new row appended
            CRM-->>Dispatcher: JSON response { success: true, action: 'created'|'updated', leadId }
            Dispatcher->>Form: Delete form.dataset.currentLeadId (reset idempotency key)
            Dispatcher->>Form: Reset form inputs (or close modal)
            Dispatcher->>GA4: NovaAnalytics.trackLeadGenerated(eventData) [Zero PII]
            Dispatcher->>Student: Display authoritative success notification toast
        end
    end
```

---

## 3. Standardized Form Type Taxonomy (Section 5)

In compliance with project specifications, all form submissions are classified into an unambiguous 6-type taxonomy:

| Standardized `formType` | Form Name / Description | Entry Points | Legacy `lead_type` Alias |
|---|---|---|---|
| `demo_booking` | 2-Day Free Demo Booking | `#demo-booking-form`, `openDemoModal`, catalog cards, hero demo CTAs | `free_demo` |
| `career_counselling` | 1-on-1 Academic & Career Guidance | `#counselling-booking-form`, `openCounsellingModal`, `#counselling-form`, `#contact-enquiry-form`, `#popup-form` | `free_consultation` |
| `admission_enquiry` | Official Course Enrollment Enquiry | `#course-enrollment-form`, `openEnrollmentModal`, course detail enrollment CTAs | `enrollment_enquiry` |
| `course_enquiry` | Course Syllabus & Curriculum Enquiry | Syllabus download triggers, course inquiry popups | `course_enquiry` |
| `career_advisor_handoff` | AI Career Advisor Human Counsellor Handoff | `nova-ai-widget.js` recommendation CTA buttons (`sourceCta: 'ai_career_advisor'`) | `career_advisor_handoff` |
| `general_enquiry` | General Institute Admissions Contact | Unspecified general admission forms, campus visit requests | `general_enquiry` |

---

## 4. Security & Compliance Protections

### 4.1. OWASP Spreadsheet Formula Injection (CSV Injection) Prevention
Google Sheets evaluates cell values beginning with `=`, `+`, `-`, `@`, `\t` (tab), or `\r` (carriage return) as spreadsheet formulas or dynamic data exchange (DDE) commands.
- **Client-Side Sanitization:** Every string field passed in `submitNovaForm` passes through `sanitizeSheetFormula(val)`. Any string starting with an active character is automatically prefixed with a single quotation mark (`'`), forcing Google Sheets to interpret the value strictly as plain text.
- **Server-Side Redundancy:** The `worker/src/scripts/googleAppsScript.js` template independently runs `sanitizeFormula(val)` before writing to cells, providing defense-in-depth even for third-party or webhook integrations.

### 4.2. Minor Safeguard (Kids Tech Academy)
For courses in the Kids Tech Academy (`kids` / `kids-tech` slug, e.g. *Young Coders*, *Scratch Programming*, *Python for Kids*):
- The frontend automatically detects minor enrollment eligibility.
- Sets `guardianConsentRequired: true` and `minorSafeguard: true` in the CRM payload.
- Automatically appends `[Minor Safeguard: Guardian/Parental Consent Required]` to the CRM notes column so the admissions team verifies parental consent before scheduling sessions.

### 4.3. Zero PII Leakage in Error & Diagnostic Logs
To comply with the Digital Personal Data Protection (DPDP) Act:
- Console error handlers never dump raw payload objects or unscrubbed error strings.
- Mobile numbers and email addresses are dynamically masked via regex pattern replacement:
  `err.message.replace(/([0-9]{10}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, '[REDACTED]')`.
- GA4 conversion tracking contains strictly non-PII operational dimensions (`form_type`, `form_name`, `course_id`, `academy_id`, `learning_mode`, `source_component`, `traffic_source`).

---

## 5. Idempotency & Retry Architecture

Network fluctuations or server latency can cause students to click submit multiple times:
1. When `submitNovaForm` initiates, it checks `form.dataset.currentLeadId`. If absent, it generates a unique identifier: `NS-LEAD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}` and stores it on the form element.
2. If the request times out or returns an error, `form.dataset.currentLeadId` is **retained**.
3. When the student clicks "Try Again", the second submission carries the **exact same `leadId`**.
4. The Google Apps Script deduplication logic matches column 1 (`Lead ID`). If a record already exists, it updates the existing row in-place rather than generating a duplicate lead record.
5. Only upon authoritative confirmation (`success: true`) is `form.dataset.currentLeadId` deleted.

---

## 6. Zero Fake Success Guarantee

Previous website iterations risked displaying false success notifications on HTTP 500 errors or failed webhook calls:
- In the P1-3 architecture, `submitNovaForm` strictly awaits HTTP 200 response with validated JSON `{ success: true }`.
- If the server returns non-200, `{ success: false }`, or network failure, an exception is thrown.
- The catch block ensures:
  1. No success toast is rendered.
  2. The form inputs are **never cleared**, preserving the student's typed responses.
  3. The submit button is restored from its spinner back to its enabled state.
  4. An informative error banner is displayed with admissions WhatsApp contact details (`+91 9695904440`) as a direct fallback.
