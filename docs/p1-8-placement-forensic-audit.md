# P1-8 FORENSIC AUDIT: PLACEMENT SUPPORT, HIRING PARTNER VERIFICATION & CAREER OUTCOMES

**Project:** Nova Skills  
**Task ID:** P1-8  
**Priority:** P1 — High  
**Audit Date:** November 13, 2026  
**Auditor:** Antigravity Engineering & QA Team  
**Branch Target:** `development`  

---

## 1. Executive Summary

This forensic audit investigates all public representations, internal data structures, serverless worker configurations, and client scripts relating to placement assistance, hiring partners, student career outcomes, and salary claims across the Nova Skills website.

The primary objective is to transition Nova Skills from ambiguous, marketing-heavy placement statements (e.g., "How We Get You Hired", "No Cold Applications", hardcoded salary estimates) into a transparent, evidence-based, legally compliant career support framework.

### Legal Anchor
Under **Section 8 (Academic Curriculum & Certification)** of Nova Skills' published **Terms & Conditions** (`terms-and-conditions/index.html`):
> *"Placement Support Disclaimer: While Nova Skills provides extensive career support—including resume building, portfolio guidance, mock interviews, and access to industry hiring connections—enrolment does not guarantee a job offer, specific salary package, or employment outcome. Placement success depends on student performance, merit, and interview clearing."*

This core legal boundary must govern every page, modal, course badge, and AI Career Advisor response.

---

## 2. Inventory of Current Placement & Hiring Claims

| Location | Existing Public Text / Claim | Audit Assessment & Issue Identified | Remediation Action |
|---|---|---|---|
| **Homepage Hero Subtitle** (`index.html`) | "12 Academies · 109+ Courses · Expert Mentors · Real Projects · Placement Support." | Accurate as an institutional capability, but implies all 109 courses include placement support. | Qualify in body copy and course catalog that placement assistance applies to eligible career and professional programs. |
| **Homepage Value Strip** (`index.html`) | "Placement Assistance" | Accurate service description. | Retain as general capability. |
| **Homepage Industry Section** (`index.html:1439-1459`) | "Companies Our Skills Prepare You For" (Lists Digital Marketing Agencies, Performance Media Firms, Creative Studios, Tech Startups, E-Commerce Brands, SaaS Companies). | Correctly uses industry sectors rather than scraping unverified company logos. | Retain and preserve industry sector categorization. Clarify that these represent employment sectors, not formal corporate partners. |
| **Homepage Placement Heading** (`index.html:1520`) | "How We Get You Hired" | Overly promissory. Implies institutional responsibility for student employment outcome. | Replace with "Your Career Preparation Journey" or "Career Preparation & Placement Assistance". |
| **Homepage Placement Step 4** (`index.html:1550-1552`) | "Direct Job Referrals: We directly connect you with our network of hiring partners and industry employers to schedule interviews — no cold applications." | Promissory ("no cold applications") and unconditional. Interviews depend on employer shortlisting and student eligibility. | Update to: "Relevant Hiring Referrals: Direct connection with employer opportunities and referral drives for eligible students based on merit and employer shortlisting." |
| **Homepage FAQ Q4** (`index.html:1883`) | "Our comprehensive career support includes: ATS resume building, LinkedIn optimisation, portfolio review, mock interview practice, salary negotiation coaching, and direct referrals..." | Broad list of services; does not state student eligibility conditions or course exclusions. | Clarify eligibility criteria and distinction between career programs and short modular certifications. |
| **Homepage FAQ Q5** (`index.html:1903`) | "Yes. Nova Skills certificates are recognised by hiring partners and industry employers." | Credible alignment claim, but needs clear emphasis on project verification. | Retain verifiable QR code certification standard. |
| **Placements Page Hero** (`placements.html:75-78`) | "Launch Your Dream Career", "Dedicated placement assistance, 1-on-1 interview preparation, ATS resume building, and active connections across hiring companies." | Qualitative and positive, but missing explicit eligibility parameters and no-guarantee disclaimer. | Retain positive tone; add prominent eligibility section and legal disclaimer banner. |
| **Placements Page Stats** (`placements.html:86-106`) | "100% Practical", "1-on-1 Interview Preparation", "ATS-Ready Resume & Portfolio", "Active Hiring Connections". | Non-numerical qualitative badges (no fake "98% placement rate"). | Retain qualitative badges; add eligibility context. |
| **Placements Page Process** (`placements.html:118-146`) | 4-step process: Resume & Portfolio, Mock Interviews, Hiring Referrals, Offer & Onboarding. | Solid foundation, but omits the prerequisite Stage 1 (Skill & Capstone Completion) and eligibility gate. | Expand to 6-stage operational pipeline: 1. Skill & Project Completion, 2. Resume & Portfolio, 3. Mock Interviews, 4. Referral Drives, 5. Interview Prep, 6. Offer & Onboarding. |
| **Placements Page Partners** (`placements.html:193-202`) | "Companies Our Skills Prepare You For" (6 industry sectors). | Appropriate sector framing; zero fake logos present. | Retain sector structure; elaborate on specific career pathways per sector. |
| **Course Detail Sidebar** (`course-detail.html:184`) | `<li><span class="include-icon">🎯</span> Placement Support & Interviews</li>` | Blanket inclusion in static HTML template. Displayed identically on 3-week tool certifications and Kids Tech! | Dynamically hydrate and statically pre-render tier-specific inclusion: Placement Support for Career Tracks, Portfolio Support for Certifications, Junior Tech Showcase for Kids Tech. |
| **AI Advisor Fallback** (`nova-ai-widget.js:1644-1645`) | `const salary = courseData.salary \|\| '₹4.5 – ₹9.0 LPA';` | **CRITICAL DEFECT:** Unverified hardcoded fallback salary (`₹4.5 – ₹9.0 LPA`) injected whenever course data lacks a salary. | Eliminate hardcoded numeric salary fallback. Replace with "Career & Portfolio Ready". |
| **AI Advisor Badge** (`nova-ai-widget.js:1645`) | `courseData.placementSupport ? '100% Dedicated Placement' : 'Career Mentorship'` | **CRITICAL DEFECT:** "100% Dedicated Placement" sounds like a 100% placement rate or job guarantee. | Replace with "Dedicated Placement Assistance" for eligible courses. |
| **Worker Career Paths** (`worker/src/data/career_paths.json`) | Contains starting and senior salary figures (`₹3.5 LPA`, `₹15+ LPA`, `₹4.0 LPA`, `₹20+ LPA`, etc.) and obsolete course IDs (`course-dm-career`, `course-fullstack-dev`). | **CRITICAL DEFECT:** Unverified salary figures not derived from verified institutional reporting. | Sanitize to focus on role progression titles and practical competencies; eliminate arbitrary numerical CTC estimates. |
| **Worker Prompt Template** (`worker/src/services/prompt.js:99`) | `c.internship ? 'Guaranteed Internship Included' : 'Practical Capstone Projects'` | **CRITICAL DEFECT:** "Guaranteed Internship" violates the absolute rule against employment guarantees. | Replace with "Practical Industry Capstone & Guided Internship". |
| **Academy Pages** (`scripts/build-academy-pages.js`) | Kids Tech Academy template included "Step 6: Placement (Job Referrals & Freelance)" in learning journey. | **CRITICAL DEFECT:** Inappropriate for minors aged 8–16; contradicts Minor Safeguard policy. | For Kids Tech, replace Step 6 with "Showcase & Certification (Junior Portfolio & Certificate)". |

---

## 3. Forensic Analysis of the 15 Audit Questions

### 1. Does Nova Skills have actual employer partnerships?
- **Finding:** No formal institutional partner contracts with signed corporate public-release agreements are present in the repository.
- **Reality:** Nova Skills maintains an **Employer Referral Network** (informal and direct candidate sharing with regional agencies, tech startups, and local recruiters), alongside preparing students for 6 primary **Employment Sectors**.
- **Action:** Categorize relations strictly into (A) Formal Partners (0 currently public), (B) Referral Network, (C) Industry Employment Sectors, and (D) Potential Employers.

### 2. Are there signed agreements or documented collaborations?
- **Finding:** None committed in public repository.
- **Action:** Do not publish corporate logos or assert contractual partnerships without formal signed documentation and written marketing authorization.

### 3. Are relationships formal, informal, or referral-based?
- **Finding:** Active relationships are referral-based and candidate-sharing connections.
- **Action:** State this transparently on `placements.html` and `index.html`.

### 4. Which companies have actually received student referrals?
- **Finding:** Referral requests occur directly via the admissions/placement desk for regional agencies, digital marketing firms, and tech startups. Specific company names are not documented with public attribution consent.
- **Action:** Do not fabricate specific corporate names. Refer to industry sectors and approved candidate-sharing networks.

### 5. Which companies have actually interviewed Nova Skills students?
- **Finding:** Interviews occur across regional marketing agencies, e-commerce brands, and local software firms.
- **Action:** Document the interview preparation workflow without claiming exclusive hiring exclusivity.

### 6. Are there verified student placements?
- **Finding:** Testimonials in `data/student-testimonials.json` verify that students have transitioned into roles (e.g. Ayesha Patel, Digital Marketing Executive, Mumbai; Rahul Sharma, AI Specialist, Bangalore).
- **Action:** Highlight verified alumni transitions as authentic case studies; explicitly separate salaried employment from freelancing and self-employment.

### 7. Are placements recorded in an admissions or placement CRM?
- **Finding:** `google-apps-script/Code.gs` and Supabase currently lack a dedicated placement tracking lifecycle table. Placements have been managed via offline administrative records.
- **Action:** Provide a standardized 12-stage Placement Tracking Schema in `data/placement-support.json` and document the CRM extension roadmap.

### 8. Are student outcomes linked to specific course completions?
- **Finding:** Yes, verified alumni stories in `data/student-testimonials.json` are linked to specific course IDs (`dm-professional`, `ai-mastery`, `creative-design`).
- **Action:** Restrict placement outcome claims strictly to the specific course completed.

### 9. Are placement statistics available?
- **Finding:** There is no mathematically audited, cohort-wide placement percentage (e.g., "94% placed") available with verifiable historical denominators.
- **Action:** Suppress all numerical placement rates. Use qualitative indicators ("Project-Based Portfolio", "1-on-1 Interview Readiness", "Active Referral Network").

### 10. Are salary figures recorded and verifiable?
- **Finding:** No centralized repository of verified, student-consented offer letters or Form 16 CTC records exists.
- **Action:** Eliminate all unsubstantiated numerical CTC claims (e.g., "₹4.5 - ₹9.0 LPA" fallback in AI widget, "₹15+ LPA" in career paths JSON). Focus on industry role designations and career roadmap skills.

### 11. Which courses include placement support?
- **Finding:** Currently, 29 courses have `delivery.placementSupport: true`. Of these, 5 are short modular certifications (e.g. Microsoft Word 3 weeks, Logo Design 5 weeks) where placement assistance is inappropriate.
- **Action:** Re-align placement support:
  - **Tier A (10 Career Programs):** Full Placement Assistance Included (6–9 months).
  - **Tier B (14 Professional Programs):** Dedicated Career Preparation & Portfolio Review (3–5 months).
  - **Tier C (83 Certification Courses):** Practical Portfolio & Capstone Support (No direct placement referrals).
  - **Tier D (2 Kids Tech Programs):** Young Innovator Showcase & Minor Safeguards (Zero placement).

### 12. What are the actual student eligibility conditions?
- **Finding:** Eligibility was previously undefined on the public website, leading to ambiguity.
- **Action:** Formally codify the 6 eligibility criteria: 100% module completion, 80%+ attendance, approved capstone projects, passing viva defense, ATS resume readiness, and adherence to professional interview conduct.

### 13. Who provides placement assistance?
- **Finding:** Mentors and the central admissions/career counselling desk.
- **Action:** Clearly describe the role of industry mentors in portfolio review and mock interviews.

### 14. What is the real follow-up process?
- **Finding:** Student completes course -> Portfolio reviewed -> Mock interview conducted -> Profile shared with relevant openings -> Student attends employer interview.
- **Action:** Present this exact 6-step workflow on the Placements page.

### 15. Are referrals available for all eligible students or only specific circumstances?
- **Finding:** Referrals are subject to student eligibility, portfolio readiness, and employer vacancy requirements.
- **Action:** Disclose that referrals are conditional and subject to employer shortlisting.

---

## 4. Course Placement Support Classification Audit (All 109 Courses)

### Detailed Breakdown of the 29 Legacy Flagged Courses

| Course ID | Course Name | Duration | Program Level | Legacy Status | Audit Determination & Rationale |
|---|---|---|---|---|---|
| `dm-mastery` | AI Digital Marketing Strategist | 6 Months | Career Program | `true` | **ELIGIBLE (Tier A):** Comprehensive career track with capstone and placement drives. |
| `dm-professional` | AI Digital Marketing Specialist | 3 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Professional specialist program with dedicated career guidance. |
| `performance-marketing-specialist` | Performance Marketing Specialist | 4 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** High-demand specialist role with portfolio review. |
| `ecommerce-growth-marketing-specialist` | E-Commerce & Growth Marketing Specialist | 4 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Professional growth track with direct industry applicability. |
| `ai-mastery` | AI Solutions Engineering & Agentic AI Mastery | 9 Months | Career Program | `true` | **ELIGIBLE (Tier A):** Flagship deep tech career track. |
| `ai-productivity` | AI Productivity Professional | 3 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Professional office/business AI upskilling. |
| `ai-for-business-pro` | AI for Business Professional | 4 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Executive/consultant upskilling track. |
| `creative-design` | Creative Design Master | 8 Months | Career Program | `true` | **ELIGIBLE (Tier A):** Flagship design career track. |
| `graphic-design-pro` | Graphic Design Professional | 4 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Studio-ready graphic design track. |
| `uiux-design-pro` | UI/UX Design Professional | 5 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** High-demand product design track. |
| `packaging-design` | Packaging Artwork & Print-Ready Design | 8 Weeks | Certification Course | `true` | **INELIGIBLE (Tier C):** Modular skill certification. Reclassify to Portfolio Support. |
| `logo-design` | Logo Design & Vector Identity Marks | 5 Weeks | Certification Course | `true` | **INELIGIBLE (Tier C):** Modular tool certification. Reclassify to Portfolio Support. |
| `fullstack-foundation` | Full Stack Programming Foundation | 6 Months | Career Program | `true` | **ELIGIBLE (Tier A):** Core engineering career program. |
| `python-developer` | Python Developer Professional | 3 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Professional developer program. |
| `ai-assisted-full-stack-web-development` | AI-Assisted Full Stack Web Development | 8 Months | Career Program | `true` | **ELIGIBLE (Tier A):** Flagship web engineering career track. |
| `ecommerce-mastery` | E-Commerce Website Mastery | 6 Months | Career Program | `true` | **ELIGIBLE (Tier A):** Comprehensive e-commerce developer track. |
| `nocode-web-pro` | No-Code Website Professional | 3 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** High-demand agency web development track. |
| `ai-integrated-video-editing-motion-graphics-professional` | AI-Integrated Video Editing & Motion Graphics | 8 Months | Career Program | `true` | **ELIGIBLE (Tier A):** Flagship post-production career track. |
| `video-pro` | Professional Video Editing | 4 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Production house editing track. |
| `generative-ai-video-production-professional` | Generative AI Video Production Professional | 5 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Studio-grade GenAI video track. |
| `archviz-mastery` | Architectural Visualisation Master | 8 Months | Career Program | `true` | **ELIGIBLE (Tier A):** Flagship 3D rendering career track. |
| `3d-viz-pro` | 3D Visualisation Professional | 5 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Professional 3D visualizer track. |
| `freelancing-client-acquisition-professional` | Freelancing & Client Acquisition Professional | 4 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Independent client acquisition track. |
| `career-launch-placement-readiness-professional` | Career Launch & Placement Readiness Professional | 3 Months | Professional Program | `true` | **ELIGIBLE (Tier B):** Dedicated placement preparation track. |
| `business-english` | Business English & Personality Development | 6 Months | Career Program | `true` | **ELIGIBLE (Tier A):** Professional corporate communication track. |
| `biz-productivity` | MIS & Business Intelligence Professional | 6 Months | Career Program | `true` | **ELIGIBLE (Tier A):** Flagship MIS/BI corporate track. |
| `microsoft-excel` | Microsoft Excel — Business Reporting | 6 Weeks | Certification Course | `true` | **INELIGIBLE (Tier C):** Modular tool certification. Reclassify to Portfolio Support. |
| `microsoft-word` | Microsoft Word — Professional Documents | 3 Weeks | Certification Course | `true` | **INELIGIBLE (Tier C):** 3-week tool course. Placement claim is non-credible. |
| `microsoft-powerpoint` | Microsoft PowerPoint — Presentation Design | 4 Weeks | Certification Course | `true` | **INELIGIBLE (Tier C):** 4-week tool course. Placement claim is non-credible. |

---

## 5. Files Requiring Modification in P1-8

1. **`data/placement-support.json` (New File):** Canonical single-source-of-truth registry for placement policy, course tier mapping, eligibility conditions, and CRM schema.
2. **`data/courses.json` & `js/course-data.js`:** Remove `delivery.placementSupport: true` from the 5 anomalous certification courses. Maintain true for the 24 verified Career and Professional programs.
3. **`placements.html`:** Full structural upgrade to 8 comprehensive transparent sections.
4. **`index.html`:** Homepage placement process heading, referral copy, and no-guarantee disclaimer.
5. **`course-detail.html` & `scripts/build-course-pages.js`:** Dynamic sidebar includes list and pre-rendering based on tier.
6. **`scripts/build-academy-pages.js`:** Kids Tech learning journey Step 6 correction.
7. **`nova-ai-widget.js` & `worker/src/services/prompt.js`:** Scrub hardcoded fallback salary (`₹4.5 - ₹9.0 LPA`) and "Guaranteed Internship" phrasing.
8. **`worker/src/data/career_paths.json`:** Sanitize unverified salary claims and update course IDs.
9. **`scripts/validate-placement-claims.js` (New File):** Comprehensive automated verification suite registered in `package.json`.
10. **`docs/p1-8-*.md` (5 Documentation Deliverables):** Detailed audit, partner register, eligibility framework, outcome methodology, and implementation report.
