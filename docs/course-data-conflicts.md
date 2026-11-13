# Nova Skills — Course Data Conflicts & Authority Resolution Log

**Task ID:** P0-1  
**Branch:** `development`  
**Hierarchy Applied:**  
1. Approved Commercial Master Mapping ([scripts/Nova_Skills_109_Course_Master_Mapping.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/scripts/Nova_Skills_109_Course_Master_Mapping.json), `2026-11-09`) for course titles, IDs, regular fees, launch fees, effective fees, and offer status.  
2. Canonical Detail Specifications (`data/courses/<id>.json`) for academic specifications (duration, guided hours, learning outcomes, tools, prerequisites, structured project deliverables).  
3. Legacy `data.js` runtime metadata for catalog display badges (`icon`, `color`, `featured`, `rating`, `reviews`, `students`, `programLevel`, `level`, `mode`, `slug`).  
4. Promotional snippets (Homepage HTML cards, `nova-ai-widget.js`, `components.js`, `worker/` JSON) treated strictly as secondary displays to be refactored rather than treated as authorities.

---

## 1. Specific Mandatory Conflict Checks

### 1.1 `dm-professional` — AI Digital Marketing Specialist
| Field | Canonical Source (`data/courses/dm-professional.json`, `academies/digital-marketing`, `courses.html`, `Master Mapping`) | Conflicting Secondary Display | Resolution & Action |
|---|---|---|---|
| Duration | **3 Months** | [index.html](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/index.html) card badge displayed `4 Months` (while its own enroll CTA passed `'3 Months'`); [nova-ai-widget.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/nova-ai-widget.js) displayed `4 Months` | Standardized everywhere to **3 Months** (`value: 3, unit: "months"`). |
| Guided Hours | **120 Hours** | Missing from homepage card / hardcoded `N/A` in fallbacks | Canonicalized `guidedHours: 120`. |
| Projects | **5 Core Projects** + **1 Final Portfolio Project** (`core_projects`: 5, `final_deliverables`: 5) | [index.html](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/index.html) card displayed `15 Live Projects`; [nova-ai-widget.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/nova-ai-widget.js) had `10` | Canonicalized typed metrics: `5` `core-production` (`5 Core Projects`) + `1` `capstone` (`Final Portfolio Project`). Homepage card refactored to `5 Core Projects`. |
| Pricing | Launch `₹19,900` (Regular `₹24,900`, `20% OFF`) | `nova-ai-widget.js` had `₹17,499` / `₹49,999` and old title `AI Digital Marketing Professional` | Standardized to official title & `2026-11-09` approved pricing. |

---

### 1.2 `ai-assisted-full-stack-web-development` — AI-Assisted Full Stack Web Development
**Root Cause of `3`, `6`, and `8` Project Figures Discovered in `data/courses/ai-assisted-full-stack-web-development.json`:**
1. **`3` (`data.js` `liveProjects: 3`):** Derived erroneously by `scripts/sync-course-catalog.js` counting `final_deliverables` (3 graduation checklist items: production assets/URL, portfolio case study documentation, QR certificate) rather than actual curriculum builds. **Not a project count.**
2. **`8` (`what_you_will_build.length: 8`):** Comprises **4 Common Core Builds** (`build-01`..`build-04`) + **3 mutually exclusive Specialization Options** (`build-05a` Path A Agency, `build-05b` Path B E-commerce, `build-05c` Path C AI SaaS — students pick **1** path) + **1 Integrated Capstone** (`build-06`). Total curriculum blueprints = `8`.
3. **`6` (Canonical Student Portfolio Count, `overview.short_description`):** Every student executes **4 Common Core Builds + 1 Selected Specialization Build + 1 Integrated Capstone Build = 6 Production-Grade Portfolio Projects**!

| Field | Existing Conflicting Values | Authoritative Verification | Migration Model (`projects.metrics`) |
|---|---|---|---|
| Student Portfolio Builds | `3` (catalog), `6` (overview prose), `8` (raw `what_you_will_build` array) | Verified directly from `modules` (1–14) & `what_you_will_build` (`build-01..04`, `build-05a/b/c`, `build-06`) | Typed metrics array cleanly distinguishes:<br>• `portfolio`: `6` (`"6 Production Portfolio Projects per Student"`)<br>• `core-production`: `4` (`"4 Common Core Builds"`)<br>• `specialization`: `1` (`"1 Chosen Specialization Track (3 Options: 05a/05b/05c)"`)<br>• `capstone`: `1` (`"1 Integrated Capstone & Viva Voce"`)<br>• `blueprint-total`: `8` (`"8 Blueprint Specifications Across All Paths"`)<br>• `graduation-deliverables`: `3` (`"3 Graduation Deliverables"`) |
| Fee Prose inside Detail JSON | `overview.specialization_rule` and `specialization_selector_config.tuition` state `"INR 64,900"` | Approved `2026-11-09` Master Mapping (`regular_fee: 64900`, `launch_fee: 44900`, `effective_fee: 44900`, `offer_active: true`) | Numeric canonical pricing uses `44900` / `64900`. Prose discrepancy logged for academic/copy update so `INR 64,900` inside `overview.specialization_rule` is clarified as standard tuition (with `INR 44,900` launch offer active). |

---

## 2. Homepage Featured Cards (`index.html`) Conflicts Discovered

| Course ID | Homepage HTML Defect | Canonical Specification | Resolution |
|---|---|---|---|
| `dm-professional` | Duration badge `4 Months` vs Enroll button `3 Months`; Feature `15 Live Projects` | `3 Months`, `5 Core Projects`, `₹19,900` / `₹24,900` | Driven from `data/courses.json` (`3 Months`, `5 Core Projects`) |
| `creative-design` | Duration badge `6 Months` vs Enroll button `8 Months` | `8 Months`, `₹44,900` / `₹64,900`, `6 Major Portfolio Case Studies` | Driven from `data/courses.json` (`8 Months`) |
| `ai-integrated-video-editing-motion-graphics-professional` | Duration badge `6 Months` vs Enroll button `8 Months` | `8 Months`, `₹49,900` / `₹69,900` | Driven from `data/courses.json` (`8 Months`) |

---

## 3. Project Metric & Key-Facts Conflicts Across Catalog (`17` Courses)

Previously `scripts/sync-course-catalog.js` conflated `final_deliverables` / `student_deliverables_and_evidence` counts with actual project counts (`liveProjects`). Every mismatch below is decomposed into distinct typed metrics or flagged with `projects.reviewRequired: true`:

| Course ID | `data.js` `liveProjects` | Detail JSON `overview.key_facts.project_count` | Raw Curriculum Arrays (`what_you_will_build` / `final_deliverables` / `deliverables`) | Resolution / Status |
|---|---|---|---|---|
| `dm-mastery` | `8` | `"7 Core Projects + 1 Final Capstone"` | `core_projects: 8`, `what_you_will_build: 8`, `final_deliverables: 14` | Verified: `7 Core + 1 Capstone = 8 Projects`; label clarified (`8 Core & Capstone Projects`) |
| `performance-marketing-specialist` | `8` | `"7 Core Projects + 1 Final Capstone"` | `core_projects: 8`, `what_you_will_build: 8`, `final_deliverables: 18` | Verified: `7 Core + 1 Capstone = 8 Projects`; `18` modeled as `graduation-deliverables` |
| `ai-for-business-pro` | `9` | `"4 Major Projects"` | `what_you_will_build: 4`, `final_deliverables: 9` | **Resolved to `4` Major Projects** (`9` was deliverable checklist) |
| `creative-design` | `9` | `"6 Major Portfolio Case Studies"` | `what_you_will_build: 6`, `final_deliverables: 9` | **Resolved to `6` Portfolio Case Studies** (`9` was deliverable checklist) |
| `graphic-design-pro` | `5` | `"4 Major Portfolio Case Studies (Including Integrated Capstone)"` | `what_you_will_build: 4`, `final_deliverables: 5` | **Resolved to `4` Major Portfolio Case Studies** (`5` was deliverable checklist) |
| `uiux-design-pro` | `5` | `"3 Major Portfolio Case Studies + 1 Flagship Capstone"` | `what_you_will_build: 3`, `final_deliverables: 5` | **Flagged `reviewRequired: true`** (Case studies array has 3 vs key fact `"3 Major + 1 Capstone"` = `4`; `5` was deliverable checklist). Public numerical card badge suppressed pending verification (`"Case Studies + Capstone"`). |
| `fullstack-foundation` | `5` | `"3 MAJOR PORTFOLIO PROJECTS + CAPSTONE"` | `what_you_will_build: 3`, `final_deliverables: 5` | **Flagged `reviewRequired: true`** (`3` portfolio builds vs `"3 Major + Capstone"` vs `5` final deliverables). Badge displays verified `"3 Portfolio Builds + Capstone"`. |
| `python-developer` | `6` | `"2 Major Portfolio Projects + Capstone Defense"` | `what_you_will_build: 2`, `student_deliverables_and_evidence: 6`, `final_deliverables: 6` | **Resolved: `2 Major Portfolio Projects + Capstone Defense`** (`6` was student deliverables). |
| `html-css` | `7` | `"2 Assessed Portfolio Websites"` | `projects: 2`, `what_you_will_build: 2`, `final_deliverables: 7` | **Resolved to `2 Assessed Portfolio Websites`** (`7` was deliverable checklist). |
| `javascript-cert` | `7` | `"2 Working Browser Applications"` | `projects: 2`, `what_you_will_build: 2`, `final_deliverables: 7` | **Resolved to `2 Working Browser Applications`** (`7` was deliverable checklist). |
| `ecommerce-mastery` | `3` | `"4 Major Assessed Portfolio Projects"` | `what_you_will_build: 4`, `final_deliverables: 3` | **Resolved to `4 Major Assessed Portfolio Projects`** (`3` was graduation deliverables). |
| `nocode-web-pro` | `4` | `"3 Major Assessed Projects"` | `what_you_will_build: 3`, `final_deliverables: 4` | **Resolved to `3 Major Assessed Projects`** (`4` was graduation deliverables). |
| `youtube-mastery` | `15` | `3` | `what_you_will_build: null`, `final_deliverables: 15` | **Flagged `reviewRequired: true`** (`key_facts: 3` vs `final_deliverables: 15`). Uses `3` (`key_facts`) safely labeled with review note. |
| `content-creator-pro` | `15` | `3` | `what_you_will_build: null`, `final_deliverables: 15` | **Flagged `reviewRequired: true`** (`key_facts: 3` vs `final_deliverables: 15`). Uses `3` (`key_facts`) safely labeled with review note. |
| `biz-productivity` | `1` | `6` | `what_you_will_build: 4`, `final_deliverables: 1` | **Flagged `reviewRequired: true`** (`key_facts: 6` vs `what_you_will_build: 4` vs `final_deliverables: 1`). Suppresses disputed standalone number until academic verification (`"Portfolio & Capstone Builds"`). |

---

## 4. Commercial & GST Policy Ambiguity (Requires Administrative Confirmation)

| Conflicting Sources | Observed Statement | Affected Records | Action Taken |
|---|---|---|---|
| **UI Sidebar vs Detail FAQs** | [course-detail.js:371](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/course-detail.js#L371) & [scripts/build-course-pages.js:432](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/scripts/build-course-pages.js#L432) display `"· 18% GST included"` (which `scripts/test-phase4-trust-audit.js` currently asserts). Conversely, **68** `data/courses/*.json` FAQs (generated by `scripts/sync-all-pricing.js`) state `"(statutory 18% GST extra)"` and quote `price * 1.18` total payable, while lines 365–367 of `course-detail.js` still calculate `totalWithGST = price + price * 0.18`. | All 109 courses (68 explicit `extra` FAQs vs 109 sidebar `included` text vs 41 unspecified FAQs) | Preserved UI GST copy (`"18% GST included"` in sidebar per Section 9 preservation rule #10) while explicitly storing `pricing.gst: { rate: 18, treatment: "requires-admin-confirmation", uiDisplayTreatment: "included", faqProseTreatment: "extra-where-stated" }` in schema and documenting this as an **Administrative Confirmation Required** conflict rather than silently changing commercial terms. |
| **Stale Prose Prices Inside Detail JSON FAQs / Configs** | `ai-mastery.json` (`specialization_selector_config.tuition`: `INR 89,900` / `Total: INR 106,082`), `ai-assisted-full-stack-web-development.json` (`INR 64,900` without noting active launch offer `₹44,900`), `video-pro.json` (`29,900` / `35,282`), `kids-mastery.json` (`29,900` / `35,282`), `young-coders.json` (`14,900` / `17,582`), `youtube-mastery.json`, `content-creator-pro.json`, `biz-productivity.json`, `office-pro.json`, `python-developer.json`. | 15+ JSON prose blocks | Canonical numeric prices strictly follow `2026-11-09` approved Master Mapping; outdated hardcoded rupee strings in static curriculum prose flagged for copy cleanup and detached from numeric pricing fields. |
| **Stale Embedded Prices in Legacy Code & Worker Files** | `nova-ai-widget.js` (`₹13,999`, `₹17,499`, `₹19,999`, `₹31,499`, deleted IDs `motion-mastery`/`freelancing-mastery`/`career-launch`), `components.js` (`COURSE_CATALOG_METADATA`), `worker/src/data/courses.json`, `cloudflare-worker/src/knowledge/knowledgeBase.js`. | 4 files | Eliminated / refactored to consume `NovaCourseData` (`data/courses.json` & `data/academies.json`) directly. |
| **Pre-Existing Title vs Level Badge Flag** | Noted during `test-phase4-trust-audit.js`: `seo-geo` / `local-seo` / other courses where level badge says `"Beginner"` vs `"Advanced"` in description/name. | Catalog level badges | Preserved existing canonical strings per Rule #9; flagged cleanly under `dataQuality.reviewNotes` for academic review. |
