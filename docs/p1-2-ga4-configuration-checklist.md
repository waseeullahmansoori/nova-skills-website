# P1-2 GA4 PROPERTY CONFIGURATION CHECKLIST

**Project:** Nova Skills Education Institute  
**Measurement ID:** `G-9WN9N2KF12`  
**Property Configuration Type:** Manual Administrative Action Guide  
**Purpose:** Required steps for GA4 Property Administrators in Google Analytics Console to complete reporting enablement.  

---

## 1. Confirm Property & Web Data Stream

1. Navigate to [Google Analytics Console](https://analytics.google.com/).
2. In the Property Selector, select the official **Nova Skills** GA4 Property.
3. Open **Admin** (gear icon in lower left corner) → **Data Streams** → **Web**.
4. Confirm that the stream's **Measurement ID** matches exactly:
   ```
   G-9WN9N2KF12
   ```
5. Confirm Stream URL: `https://novaskills.in/`.

---

## 2. Mark Key Events (Conversions)

In GA4, conversion actions are designated as **Key Events**:

1. Under **Admin**, navigate to **Data Display** → **Key Events**.
2. Locate the event:
   ```
   generate_lead
   ```
3. Toggle the switch to **Mark as key event** (ON).
4. **Important Reporting Guardrail:** Do **NOT** mark secondary engagement events (`click_whatsapp`, `click_phone`, `click_email`, `view_course`, `select_course`, or `form_start`) as key events unless explicitly directed by marketing management. Keeping `generate_lead` as the sole primary key event ensures clean ROI and CPA calculations in ad platforms.

---

## 3. Register Event-Scoped Custom Dimensions

To view course, form, and attribution metadata in standard GA4 exploration reports and report builder, register the following custom dimensions:

Navigate to **Admin** → **Data Display** → **Custom definitions** → **Custom dimensions** → **Create custom dimension**:

| Dimension Name | Scope | Event Parameter | Description |
|---|---|---|---|
| **Course ID** | Event | `course_id` | Canonical course identifier (e.g. `ai-mastery`, `dm-professional`) |
| **Course Name** | Event | `course_name` | Full canonical course title |
| **Academy ID** | Event | `academy_id` | Academy identifier (e.g. `digital-marketing`, `programming`) |
| **Form Type** | Event | `form_type` | Funnel type (`demo_booking`, `career_counselling`, `contact_enquiry`) |
| **Form ID** | Event | `form_id` | DOM form identifier (`demo-booking-form`, `counselling-booking-form`) |
| **Source Component** | Event | `source_component` | CTA or modal component triggering the action |
| **Source Page** | Event | `source_page` | Path where the interaction occurred |
| **Selection Source** | Event | `selection_source` | Catalog card, explorer, or form select trigger |
| **Learning Mode** | Event | `learning_mode` | Candidate's chosen delivery format (`online-live`, `classroom`) |
| **Contact Type** | Event | `contact_type` | Channel identifier (`whatsapp`, `phone`, `email`) |
| **AI Platform** | Event | `ai_platform` | Referring AI chat platform (`ChatGPT`, `Claude`, `Perplexity`, `Gemini`) |

---

## 4. Configure Developer / Internal Traffic Filtering

To keep automated test suites, QA sessions, and local development from distorting production metrics:

1. Under **Admin** → **Data streams** → Click `novaskills.in` web data stream.
2. Click **Configure tag settings** → **Show all** → **Define internal traffic**.
3. Create a rule named `Developer & Internal Traffic`:
   - Set `traffic_type` to `developer`.
   - Add campus / office IP addresses if static.
4. Under **Admin** → **Data Display** → **Data Filters**:
   - Locate the `Developer Traffic` or `Internal Traffic` filter.
   - Set status to **Testing** to verify in Realtime reports, then toggle to **Active** to exclude from standard reports.

---

## 5. Verification via Realtime & DebugView

1. **Verify Realtime Stream:**
   - Open a live browser session on `https://novaskills.in/`.
   - Navigate to **Reports** → **Realtime**.
   - Confirm active users and event stream showing `page_view`.
2. **Verify DebugView:**
   - Open developer tools console on `https://novaskills.in/` or run locally on `localhost`.
   - In console: `window.NovaAnalytics.trackEvent('test_ping', { test: true });`
   - In GA4 Console, open **Admin** → **DebugView**.
   - Verify the event appears immediately on the debug device timeline with parameter details.
