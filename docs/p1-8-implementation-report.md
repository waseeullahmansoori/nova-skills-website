# P1-8 IMPLEMENTATION REPORT: PLACEMENT SUPPORT, HIRING PARTNER VERIFICATION & CAREER OUTCOMES

**Project:** Nova Skills  
**Task ID:** P1-8  
**Priority:** P1 — High  
**Document Version:** 1.0.0  
**Release Date:** November 13, 2026  
**Git Branch:** `development`  
**Deployment:** Development branch only. Zero production deployment.  

---

## 1. Executive Summary & Objective Realisation

Nova Skills previously described career services using broad, marketing-heavy terms such as *"How We Get You Hired"*, *"No Cold Applications"*, and hardcoded AI widget salary estimates (`₹4.5 – ₹9.0 LPA`). In static HTML, all courses displayed identical *"Placement Support & Interviews"* checklist items, regardless of whether a student enrolled in a 3-week introductory software module or an 8-month intensive engineering career program.

Under the P1-8 mandate, we completed an end-to-end audit and remediation of Nova Skills' placement-support representations:
1. **Preserved Statutory Non-Guarantee Legal Standard:** Enforced the core protection defined in **Section 8 (Academic Curriculum & Certification)** of Nova Skills' published **Terms & Conditions**:
   > *"While Nova Skills provides extensive career support—including resume building, portfolio guidance, mock interviews, and access to industry hiring connections—enrolment does not guarantee a job offer, specific salary package, or employment outcome. Placement success depends on student performance, merit, and interview clearing."*
2. **Reclassified All 109 Courses into 4 Transparent Tiers:**
   - **Tier A (10 Career Programs, 6–9 Months):** Full Placement Assistance & Direct Referral Drives.
   - **Tier B (14 Professional Programs, 3–5 Months):** Dedicated Career Preparation & Portfolio Review.
   - **Tier C (83 Modular Certifications, 3–8 Weeks):** Practical Portfolio & Capstone Support (No corporate placement referrals).
   - **Tier D (2 Kids Tech Programs, Ages 8–16):** Young Creator Showcase & Minor Safeguards (Strictly zero placement).
3. **Eliminated Unverified Salary & Partner Claims:**
   - Scrubbed unverified fallback salary (`'₹4.5 – ₹9.0 LPA'`) from `nova-ai-widget.js`.
   - Scrubbed unverified static LPA brackets (`₹3.5 LPA`, `₹15+ LPA`, etc.) from `worker/src/data/career_paths.json`.
   - Scrubbed promissory `"Guaranteed Internship Included"` string from `worker/src/services/prompt.js`.
   - Fixed 5 anomalous modular certification courses (`microsoft-word`, `microsoft-powerpoint`, `microsoft-excel`, `logo-design`, `packaging-design`) that had errantly inherited `placementSupport: true`.
4. **Upgraded `placements.html` to an 8-Section Comprehensive Architecture:**
   - Section 1: Career Preparation & Placement Assistance Overview + Legal Disclaimer Banner.
   - Section 2: Who Is Eligible? (4-Tier Course Breakdown & 6 Student Academic Criteria).
   - Section 3: The 6-Stage Career Preparation Journey (Visual concepts retained).
   - Section 4: Verified Referral Network & Candidate Sharing (DPDP Act 2023 privacy notice).
   - Section 5: Target Opportunities Across 6 Approved Employment Sectors.
   - Section 6: Authentic Alumni Outcomes (Salaried Agency vs Freelance separation).
   - Section 7: Comprehensive Career Support FAQ (9 core audit questions answered).
   - Section 8: Free Career Counselling CTA Panel.

---

## 2. Employer Relationship Verification Summary

| Classification Tier | Definition & Standard | Public Count | Representation Policy |
|---|---|---|---|
| **Tier A: Formal Hiring Partners** | Documented MoU / Signed Campus Recruitment Contract | **0 Approved** | Zero corporate logos scraped or published. No multinational logos (Google, Amazon, etc.) shown without executed campus agreements. |
| **Tier B: Employer Referral Network** | Regional agencies and tech startups sharing active vacancies | **Active Regional Network** | Accurately described as candidate-sharing referral connections. Resumes forwarded only with explicit student consent. |
| **Tier C: Employment Sectors** | The 6 industry domains prepared for by curriculum tools | **6 Verified Sectors** | Displayed as industry sectors (Digital Marketing, Tech Startups/SaaS, E-Commerce/D2C, Creative Design, Media/Production, 3D/ArchViz). |
| **Tier D: Potential Employers** | Open-market employers on LinkedIn/Naukri | **Uncounted** | Zero partnership claims made. |

---

## 3. Course Placement Support Classification (All 109 Courses)

### The 24 Eligible Programs (Tiers A & B)

```
TIER A: CAREER PROGRAMS (10 Courses) — 6 to 9 Months
├── dm-mastery (6 Mos) — AI Digital Marketing Strategist
├── ai-mastery (9 Mos) — AI Solutions Engineering & Agentic AI Mastery
├── creative-design (8 Mos) — Creative Design Master
├── fullstack-foundation (6 Mos) — Full Stack Programming Foundation
├── ai-assisted-full-stack-web-development (8 Mos) — AI-Assisted Full Stack Web Development
├── ecommerce-mastery (6 Mos) — E-Commerce Website Mastery
├── ai-integrated-video-editing-motion-graphics-professional (8 Mos) — AI-Integrated Video Editing
├── archviz-mastery (8 Mos) — Architectural Visualisation Master
├── business-english (6 Mos) — Business English & Personality Development
└── biz-productivity (6 Mos) — MIS & Business Intelligence Professional

TIER B: PROFESSIONAL PROGRAMS (14 Courses) — 3 to 5 Months
├── dm-professional (3 Mos) — AI Digital Marketing Specialist
├── performance-marketing-specialist (4 Mos) — Performance Marketing Specialist
├── ecommerce-growth-marketing-specialist (4 Mos) — E-Commerce & Growth Marketing Specialist
├── ai-productivity (3 Mos) — AI Productivity Professional
├── ai-for-business-pro (4 Mos) — AI for Business Professional
├── graphic-design-pro (4 Mos) — Graphic Design Professional
├── uiux-design-pro (5 Mos) — UI/UX Design Professional
├── python-developer (3 Mos) — Python Developer Professional
├── nocode-web-pro (3 Mos) — No-Code Website Professional
├── video-pro (4 Mos) — Professional Video Editing
├── generative-ai-video-production-professional (5 Mos) — Generative AI Video Production Professional
├── 3d-viz-pro (5 Mos) — 3D Visualisation Professional
├── freelancing-client-acquisition-professional (4 Mos) — Freelancing & Client Acquisition
└── career-launch-placement-readiness-professional (3 Mos) — Career Launch & Placement Readiness

TIER C: MODULAR CERTIFICATIONS (83 Courses) — 3 to 8 Weeks
└── All remaining 83 tool certifications (Portfolio & Capstone Support only, no placement desk)

TIER D: KIDS TECH ACADEMY (2 Programs + 5 Certs) — Ages 8 to 16
└── kids-mastery, young-coders, etc. (Young Creator Showcase; strictly zero placement)
```

---

## 4. Summary of Code & Page Changes

| File | Nature of Change |
|---|---|
| `data/placement-support.json` | **New File:** Canonical single-source-of-truth registry specifying policy notices, 4 course tiers, 7 eligibility criteria, 6 employer sectors, and 12-stage CRM placement lifecycle. |
| `docs/p1-8-placement-forensic-audit.md` | **New File:** Exhaustive audit analyzing 15 required questions, legacy claims, and course anomalies. |
| `docs/p1-8-employer-verification-register.md` | **New File:** Rigorous classification and trademark guidelines for corporate relationships. |
| `docs/p1-8-course-placement-eligibility.md` | **New File:** Detailed specifications for student eligibility and service boundaries. |
| `docs/p1-8-placement-outcome-methodology.md` | **New File:** Mathematical definitions and non-deceptive career outcome reporting rules. |
| `scripts/validate-placement-claims.js` | **New File:** Comprehensive 151-point automated test suite registered as `validate:placements`. |
| `data/courses.json` & individual course JSONs | Removed anomalous `delivery.placementSupport: true` from `microsoft-word`, `microsoft-powerpoint`, `microsoft-excel`, `logo-design`, and `packaging-design`. |
| `data.js` & `js/data.min.js` | Recompiled canonical data bundle; exactly 24 courses have `placementSupport: true`. |
| `placements.html` | Fully upgraded into 8 transparent sections with legal disclaimer, program tiers, eligibility cards, 6-stage roadmap, verified testimonials, and comprehensive FAQs. |
| `index.html` | Replaced promissory *"How We Get You Hired"* with *"Your Career Preparation Journey"*; qualified referral statements; added discoverable placement support legal notice. |
| `course-detail.html` | Updated sidebar static fallback to *"Placement Assistance (Eligible Programs)"*. |
| `course-detail.js` | Updated `populateEnrollIncludes` to output *"Placement Assistance & Interview Prep"*; added career transparency disclaimer note to `careerContainer`. |
| `scripts/build-course-pages.js` | Updated pre-rendering logic to generate tier-specific includes items and meta items. |
| `scripts/build-academy-pages.js` | Corrected Kids Tech Academy template to show *"Showcase (Junior Portfolio & Certificate)"* instead of *"Placement"*. |
| `nova-ai-widget.js` | Scrubbed hardcoded fallback salary (`'₹4.5 – ₹9.0 LPA'`) and promissory badge (`'100% Dedicated Placement'`). |
| `worker/src/services/prompt.js` | Scrubbed `"Guaranteed Internship Included"` string; qualified placement assistance. |
| `worker/src/data/career_paths.json` | Updated target course IDs to canonical values; replaced static starting/senior salaries with role progressions. |
| `worker/src/data/placements.json` | Updated terminology to emphasize transparent employer referral network and legal notices. |
| `package.json` | Registered `"validate:placements": "node scripts/validate-placement-claims.js"`. |

---

## 5. Automated Validation & Test Suite Results

All 11 automated test scripts executed cleanly with 0 errors:

1. `npm run validate:placements` — **151/151 Passed** (Canonical registry, 109 courses tier audit, placements page compliance, homepage copy, AI safety, legal notices).
2. `npm run validate:refunds` — **Passed** (P1-7 pre-enrolment refund transparency).
3. `npm run validate:costs` — **Passed** (P1-6 financing, EMI, third-party tool disclosures).
4. `npm run validate:credibility` — **149/149 Passed** (P1-5 mentor registry, student projects, authentic testimonials).
5. `npm run validate:pricing` — **16,494/16,494 Passed** (P0-5 pricing and neutral GST disclosures).
6. `npm run validate:courses` — **6,344/6,344 Passed** (P0-1 canonical course data validation).
7. `npm run validate:contact` — **57/57 Passed** (P1-4 official telephone and WhatsApp links).
8. `npm run test:attribution` — **9/9 Passed** (First-touch attribution and UTM preservation).
9. `npm run test:forms` — **55/55 Passed** (Lead forms validation and submission flow).
10. `npm run test:analytics` — **44/44 Passed** (GA4 events and non-PII telemetry).
11. `npm run test:crm` — **64/64 Passed** (Admissions CRM payload schema and sanitization).
12. `npm run build` — **Passed** (Complete project build across 109 courses, 12 academies, 36 city pages, and sitemap).
