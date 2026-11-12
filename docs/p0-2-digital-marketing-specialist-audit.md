# P0-2 Forensic Audit — AI Digital Marketing Specialist (`dm-professional`)

**Project:** Nova Skills  
**Task ID:** P0-2  
**Branch:** `development`  
**Audit Date:** 2026-11-12  

---

## 1. Repository & Architecture Status (`P0-1` Check)

P0-1 (Centralised Canonical Course Data Architecture) is **already implemented on `development`** (commit `762d470`):
- Single authoritative record store: [data/courses.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/courses.json)
- Curriculum & showcase store: [data/curricula/dm-professional.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/curricula/dm-professional.json) (derived from [data/courses/dm-professional.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/courses/dm-professional.json))
- Universal API adapter: [js/course-data.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/js/course-data.js) (`window.NovaCourseData` / `NovaSkillsData`)
- Compiled browser bundle: [data.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data.js) & [js/data.min.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/js/data.min.js)

---

## 2. Complete Repository Inventory of `dm-professional` References

| File / Consumer | Role | Observed Values (`dm-professional`) |
|---|---|---|
| [data/courses.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/courses.json) | Canonical store | `title`: `"AI Digital Marketing Specialist"`, `duration`: `"3 Months"` (`3`, `months`), `guidedHours`: `120`, `pricing`: `₹19,900` launch / `₹24,900` regular (`20% OFF`), `projects.displayLabel`: `"5 Core Projects"` |
| [data/courses/dm-professional.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/courses/dm-professional.json) & [data/curricula/dm-professional.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/curricula/dm-professional.json) | Academic curriculum source | `course_name`: `"AI Digital Marketing Specialist"`, `duration`: `"3 Months"`, `learning_hours`: `120`, `project_count`: `"5 Core Projects"`, `capstone`: `"Final Portfolio Project"`, `8` modules (`10+16+16+20+14+12+8+24 = 120 Hours`), `38` lessons, `8` module assignments, `5` `core_projects`, `5` `what_you_will_build`, `5` `final_deliverables`. |
| [data.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data.js) & [js/data.min.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/js/data.min.js) | Compiled runtime bundle | Matches `data/courses.json` (`3 Months`, `120` hours, `5 Core Projects`, `₹19,900`). |
| [index.html](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/index.html) & [scripts/build-homepage-featured.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/scripts/build-homepage-featured.js) | Consumer A — Homepage | Featured card `#course-dm-pro` shows `3 Months`, `5 Core Projects`, `₹19,900` (`₹24,900`, `20% OFF`), `IMG-003.webp`; **does not yet display `120 Guided Hours`**; testimonial `#testimonial-1` line 1584 still displays legacy name `"AI Digital Marketing Professional"`. |
| [courses.html](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/courses.html) & [courses.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/courses.js) | Consumer B — All Courses Catalog | Card & JSON-LD display `"AI Digital Marketing Specialist"`, `"3 Months"`, `"💻 5 Core Projects"`, `₹19,900`, `/course-detail.html?id=dm-professional`, `IMG-048.webp` (`unit-01`). |
| [academies/digital-marketing/index.html](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/academies/digital-marketing/index.html) & [scripts/build-academy-pages.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/scripts/build-academy-pages.js) | Consumer C — Digital Marketing Academy | Appears in both **Professional Programs** and **Explorer Grid** with `"AI Digital Marketing Specialist"`, `"3 Months"`, `"💻 5 Core Projects"`, `₹19,900`. |
| [_rendered_courses/dm-professional.html](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/_rendered_courses/dm-professional.html), [course-detail.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/course-detail.js), [functions/_rendered_courses.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/functions/_rendered_courses.js) | Consumer D/H — Course Detail & Edge SSR | Displays `Duration: 3 Months (120 Hours)`, `5 Core Projects`, all 8 modules, 5 builds, 12 FAQs, canonical `?id=dm-professional` URL, JSON-LD `courseWorkload: "120 Hours"`. |
| [data/locations/location-course-mapping.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/locations/location-course-mapping.json), [lib/locations/location-course-resolver.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/lib/locations/location-course-resolver.js), `branches/*/index.html` (36 cities) | Consumer E — Location Pages | Master `#2` mapped cleanly across all 36 city pages (`AI Digital Marketing Specialist`, `3 Months`, `8 Modules`, `₹19,900`). |
| [nova-ai-widget.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/nova-ai-widget.js), [worker/src/data/courses.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/worker/src/data/courses.json), [cloudflare-worker/src/knowledge/knowledgeBase.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/cloudflare-worker/src/knowledge/knowledgeBase.js) | Consumer F — AI Career Advisor | Resolves dynamically via `NovaCourseData`; Worker datasets hold `"AI Digital Marketing Specialist"`, `"3 Months"`, `120` guided hours, `"5 Core Projects"`, `₹19,900`. |
| [components.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/components.js) | Consumer G — Enrollment & Demo Modals | Resolves `"dm-professional"` via `NovaCourseData.getCourseById()`; fallback `COURSE_CATALOG_METADATA` matches `3 Months`, `₹19,900` for both `'AI Digital Marketing Specialist'` and legacy alias `'AI Digital Marketing Professional'`. |

---

## 3. Root Cause Analysis of Conflicting Values & Curriculum Verification

### 3.1 Origin of `"4 Months"` and `"15 Live Projects"`
- **Pre-P0-1 Drift:** Prior to P0-1, [index.html](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/index.html) held a hardcoded featured card `#course-dm-pro` showing a `4 Months` duration badge and `✅ 15 Live Projects` bullet (while its own enroll CTA button simultaneously passed `'3 Months'`), and [nova-ai-widget.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/nova-ai-widget.js) previously contained a hardcoded `4 Months`, `10 Practical Projects`, `₹17,499` fallback entry under the old name `"AI Digital Marketing Professional"`.
- **Current Post-P0-1 Verification:** P0-1 eliminated both `"4 Months"` and `"15 Live Projects"` from [index.html](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/index.html) and [nova-ai-widget.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/nova-ai-widget.js). Repository-wide grep confirms **zero** remaining `"4 Months"` or `"15 Live Projects"` claims attached to `dm-professional`. (Existing occurrences of `"4 Months"` in Digital Marketing belong strictly to `performance-marketing-specialist` and `ecommerce-growth-marketing-specialist`; existing `"15 Projects"` belongs to `spoken-english-pro`.)

### 3.2 Curriculum Verification of `5` vs `15` Projects
Full module-by-module inspection of [data/courses/dm-professional.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/courses/dm-professional.json):
- **Duration:** Explicitly `"3 Months"` across `overview.key_facts.duration` and `duration`.
- **Guided Hours:** Exactly **`120 Hours`**, mathematically backed by the 8 module durations:
  - Module 1: 10 Hours (4 lessons, 1 assignment)
  - Module 2: 16 Hours (5 lessons, 1 assignment)
  - Module 3: 16 Hours (5 lessons, 1 assignment)
  - Module 4: 20 Hours (5 lessons, 1 assignment)
  - Module 5: 14 Hours (5 lessons, 1 assignment)
  - Module 6: 12 Hours (5 lessons, 1 assignment)
  - Module 7: 8 Hours (4 lessons, 1 assignment)
  - Module 8: 24 Hours (5 lessons, 1 assignment)
  - **Total = 10 + 16 + 16 + 20 + 14 + 12 + 8 + 24 = 120 Hours** across **8 modules / 38 lessons / 8 module assignments**.
- **Projects:** Exactly **5** core production builds (plus 5 practical deliverables mapped 1-to-1):
  1. `Project 01`: SEO Audit & Keyword Research Project
  2. `Project 02`: Social Media Content Campaign
  3. `Project 03`: Google & Meta Advertising Setup
  4. `Project 04`: Conversion Landing Page & Tracking Exercise
  5. `Project 05`: Integrated Local Business Digital Marketing Capstone
- **Substantiation Check for `15`:** The number `15` only appears in unrelated specifications inside `dm-professional.json` (`"15-keyword intent map"`, `"15 diverse headlines"` for RSAs, `"15%"` exam/viva grading weights, `"15-minute capstone presentation"`). It does **not** represent 15 practical exercises or 15 live projects. Therefore, the `"15 Live Projects"` claim was **unsubstantiated promotional drift** and must remain removed.

---

## 4. Source of Truth & Remaining P0-2 Refinement Plan

- **Selected Source of Truth:** [data/courses.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/courses.json) (`id: "dm-professional"`) + [data/curricula/dm-professional.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/curricula/dm-professional.json).
- **Specific P0-2 Updates Required:**
  1. **Standardize Project Label to Explicit Academic Wording:** Update `dm-professional` in [scripts/migrate-course-data.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/scripts/migrate-course-data.js) -> [data/courses.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/courses.json) so `projects.metrics[0].displayLabel` and `projects.displayLabel` state **`"5 Core Production Projects"`** (aligning verbatim across Homepage, Catalog, Academy, Course Detail, and AI Career Advisor).
  2. **Display `120 Guided Hours` on Homepage Featured Card:** Update [scripts/build-homepage-featured.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/scripts/build-homepage-featured.js) so `#course-dm-pro` explicitly displays **`120 Guided Hours`** alongside **`5 Core Production Projects`**, **`3 Months`**, and **`₹19,900`**.
  3. **Normalize Homepage Testimonial Course Title:** Update [index.html](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/index.html) `#testimonial-1` label from legacy `"AI Digital Marketing Professional"` to canonical `"AI Digital Marketing Specialist"` (preserving student name/city).
  4. **Rebuild & Validate Full Pipeline:** Execute `npm run build` and `npm run validate:courses` plus targeted P0-2 regression tests across all consumers, then commit and push strictly to `development`.

---

## 5. Unresolved Discrepancies Flagged Without Mutation

- **GST Display Policy:** Preserved per Task Preservation Rule #4 — sidebar & pre-rendered detail pages show `"18% GST included"` while detail FAQ item in `dm-professional.json` mentions statutory 18% GST applicability on invoicing (`totalWithExtraGst: 23482` logged in canonical GST metadata for administrative clarification).
- **Historical Legacy Test Fixtures:** Certain historical repo test scripts (e.g., `scripts/test-phase2.js:270`) still contain snapshot assertions written prior to the 2026-11-09 catalog alignment and are left untouched unless outside scope of production code.
