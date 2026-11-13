# P0-4 FORENSIC AUDIT & IMPLEMENTATION REPORT
## Correction of Indore Full Stack Guided Hours Discrepancy

**Course ID:** `ai-assisted-full-stack-web-development`  
**Course Title:** AI-Assisted Full Stack Web Development  
**Academy:** Programming Academy  
**Affected URL:** `https://novaskills.in/branches/indore/` (`branches/indore/index.html`)  
**Canonical Course Detail URL:** `https://novaskills.in/course-detail.html?id=ai-assisted-full-stack-web-development`  
**Task ID:** P0-4  
**Priority:** P0 — Critical  
**Target Branch:** `development` (Strictly NO production deployment)  
**Date of Audit & Implementation:** November 13, 2026  

---

## 1. Executive Summary & Root Cause Analysis

### Discrepancy Identified
On the Indore online-learning location page (`https://novaskills.in/branches/indore/`), the flagship course **AI-Assisted Full Stack Web Development** displayed two conflicting guided-hour representations:

1. **Section 04 (Recommended Pathways for Indore Learners):**
   - Correctly states: *"This flagship 8-month, 320-guided-hour professional program combines 300 hours of rigorous core full-stack web development with 20 hours of focused commercial specialization. Students build 6 production-grade portfolio projects under the direct mentorship of senior practitioners."*
   - Displays duration badge: `⏱ 8 Months`, modules badge: `📂 14 Modules`.
2. **Section 05 (Interactive Guidance — Choose Your Technical Direction):**
   - In tab `tab-dev` ("1. Web & Software Development"), the Program Duration specification row incorrectly stated:
     `Program Duration: 8 Months (160+ Guided Hours)`

### Root Cause Analysis
A systematic forensic audit of the repository identified the exact origin of the erroneous `160+ Guided Hours` string:
- **Originating Configuration Files:**
  - `scripts/build-p1-city-pages.js` (line 56): Configuration object for Indore `tab-dev` had `duration: '8 Months (160+ Guided Hours)'`.
  - `scripts/build-pilot-city-pages.js` (line 52): Historical configuration object for Indore pilot build had `duration: '8 Months (160+ Guided Hours)'`.
- **Rendered Output File:**
  - `branches/indore/index.html` (line 516): Rendered HTML contained `<span class="city-panel-spec-val">8 Months (160+ Guided Hours)</span>`.
- **Sitewide Scope Verification:**
  - An exhaustive regex search across all 36 branch directories (`branches/*/*.html`), all build scripts (`scripts/*.js`), and canonical data files (`data/*.json`) confirmed that `160+ Guided Hours` existed **exclusively in these three locations**. No other city page or course contained this error.

---

## 2. Forensic Audit of Indore Page References

Every reference to `ai-assisted-full-stack-web-development` on `branches/indore/index.html` was audited:

| Section | Element / Context | Pre-Audit Information | Canonical Status | Post-Audit Status |
|---|---|---|---|---|
| **Section 04: Recommended Pathways** | Course card description (line 398) | 8-month, 320-guided-hour professional program (300 core + 20 specialization) | ✅ Canonical | Preserved intact |
| **Section 04: Recommended Pathways** | Course card badges (lines 400–402) | ⏱ 8 Months • 📂 14 Modules | ✅ Canonical | Preserved intact |
| **Section 04: Recommended Pathways** | Course card pricing (lines 407–409) | Launch Fee: ₹44,900 (Original: ₹64,900) | ✅ Canonical | Preserved intact |
| **Section 04: Recommended Pathways** | Syllabus link (line 412) | `https://novaskills.in/course-detail.html?id=ai-assisted-full-stack-web-development` | ✅ Canonical | Preserved intact |
| **Section 04: Recommended Pathways** | Demo button (line 413) | `window.openCityCourseDemo('ai-assisted-full-stack-web-development', ...)` | ✅ Canonical | Preserved intact |
| **Section 05: Interactive Guidance** | Tab Button (`data-tab="tab-dev"`, line 486) | 1. Web & Software Development | ✅ Canonical | Preserved intact |
| **Section 05: Interactive Guidance** | Panel Title (line 498) | AI-Assisted Full Stack Web Development | ✅ Canonical | Preserved intact |
| **Section 05: Interactive Guidance** | Panel Description (line 499) | Focus on building interactive web applications... | ⚠️ Lacked hours breakdown | Enhanced with 300h core + 20h specialization breakdown |
| **Section 05: Interactive Guidance** | Program Duration spec (line 516) | `8 Months (160+ Guided Hours)` | ❌ Conflicting & Incorrect | Corrected to `8 Months (320 Guided Hours)` |
| **Section 05: Interactive Guidance** | Practical Outcome spec (line 520) | `3 Live Enterprise Web Applications` | ✅ Valid Outcome Metric | Evaluated & preserved (see Section 4) |
| **Section 07: Program Comparison** | Row 2 (lines 669–680) | 8 Months, 14 Modules, ₹44,900 | ✅ Canonical | Preserved intact |

---

## 3. Authoritative Academic Source Verification

The approved academic structure is verified directly against canonical data sources established in P0-1 (`data/courses.json` and `data/courses/ai-assisted-full-stack-web-development.json`):

### Module-by-Module Guided Hours Breakdown
```
Module 01: Web Development & Product Foundations       —  8 Hours
Module 02: AI-Assisted Development & Agentic Coding      — 16 Hours
Module 03: HTML, CSS & Responsive Web Design            — 32 Hours
Module 04: JavaScript & TypeScript Development          — 40 Hours
Module 05: UI/UX & AI Design-to-Code                    — 20 Hours
Module 06: Modern Frontend with React                   — 30 Hours
Module 07: Full-Stack Development with Next.js          — 30 Hours
Module 08: Backend, Database & Authentication           — 36 Hours
Module 09: AI Website & App Builders                    — 20 Hours
Module 10: Selected Commercial Specialization (Path A/B/C) — 20 Hours (Specialization)
Module 11: AI Features, API Integration & Automation    — 20 Hours
Module 12: Testing, Security, SEO & Performance         — 20 Hours
Module 13: Git, Deployment & Production Operations      — 12 Hours
Module 14: Client Project, Portfolio & Career Readiness — 16 Hours
──────────────────────────────────────────────────────────────────
Common Core Curriculum Total (Modules 01–09, 11–14)      : 300 Hours
Selected Specialization Track Total (Module 10)         :  20 Hours
──────────────────────────────────────────────────────────────────
Total Guided Instructional Hours                        : 320 Hours
```

$$\text{Total Guided Instructional Hours} = 300\text{ (Core)} + 20\text{ (Specialization)} = 320\text{ Hours}$$

The duration is strictly 8 Months across all documentation.

---

## 4. Evaluation of the "3 Live Enterprise Web Applications" Practical Outcome

The Interactive Guidance specification box lists:
- `Practical Outcome: 3 Live Enterprise Web Applications`

Per task instructions, this claim was inspected separately to avoid conflation with portfolio project counts:
- In the P0-3 audit, the per-student portfolio structure was verified as **6 Portfolio Deliverables**:
  1. Responsive Developer Portfolio & Business Landing Page (Module 03)
  2. Business Lead Generation Web Application (Module 06/07)
  3. Multi-Role Admin Dashboard with Supabase Auth & RLS (Module 08)
  4. AI Assistant Web Application with RAG Semantic Search (Module 11)
  5. Selected Commercial Track Build: Agency Client CMS / Shopify E-Commerce Store / Multi-Tenant SaaS App (Module 10)
  6. Final Commercial Client Capstone Project & Viva Voce Defense (Module 14)
- Among these 6 portfolio deliverables, **3 are full-scale, multi-tier Live Enterprise Web Applications** (Projects 3, 4, and 5/6: Admin Dashboard, AI Assistant RAG App, and the Enterprise Client Capstone).
- Therefore, the headline "3 Live Enterprise Web Applications" in the compact decision-support box accurately communicates the enterprise-tier software outcome of the track without conflicting with the total 6 portfolio projects. It is preserved without modification.

---

## 5. Scope & Delivery Model Preservation

The following non-negotiable boundaries were strictly verified and maintained:
1. **Physical Campus vs. Online Learning Disclosure:**
   - The Indore page explicitly informs prospective students that courses are delivered via **Live Interactive Online Learning** with live instructor mentorship and hands-on laboratory workshops.
   - The page explicitly identifies that Nova Skills' sole physical classroom campus is located in **Siddharth Nagar, Uttar Pradesh**.
   - No fictional Indore branch address or physical campus claim exists or was introduced.
2. **Pricing & Commercial Terms:**
   - Launch Fee remains ₹44,900.
   - Original Price remains ₹64,900.
   - GST policy note preserved.
3. **Course Identifiers & Links:**
   - Course ID remains `ai-assisted-full-stack-web-development`.
   - Syllabus URL remains `https://novaskills.in/course-detail.html?id=ai-assisted-full-stack-web-development`.
   - Free demo trigger callbacks remain `window.openCityCourseDemo('ai-assisted-full-stack-web-development', 'AI-Assisted Full Stack Web Development')`.
4. **Zero Unintended Sitewide Modifications:**
   - No changes were made to other city pages or unrelated course files.

---

## 6. Files Modified

1. `scripts/build-p1-city-pages.js`:
   - Updated Indore `tab-dev` `duration` to `'8 Months (320 Guided Hours)'`.
   - Updated Indore `tab-dev` `desc` to explicitly mention `(300 hours core curriculum + 20 hours selected commercial specialization)`.
2. `scripts/build-pilot-city-pages.js`:
   - Updated Indore `tab-dev` `duration` to `'8 Months (320 Guided Hours)'`.
   - Updated Indore `tab-dev` `desc` to explicitly mention `(300 hours core curriculum + 20 hours selected commercial specialization)`.
3. `branches/indore/index.html`:
   - Updated line 499 (`city-panel-desc`) to include the `(300 hours core curriculum + 20 hours selected commercial specialization)` breakdown.
   - Updated line 516 (`city-panel-spec-val`) from `8 Months (160+ Guided Hours)` to `8 Months (320 Guided Hours)`.
4. `docs/p0-4-indore-guided-hours-audit.md`:
   - Authored this forensic audit and implementation report.
