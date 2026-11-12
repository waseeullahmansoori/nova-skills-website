# P1-5 Forensic Audit Report: Student Showcase, Testimonials & Faculty Credibility

**Task ID:** P1-5  
**Priority:** P1 — High  
**Date of Audit:** November 2026  
**Auditor:** Nova Skills Engineering Team  
**Scope:** Repository-wide audit of student projects, testimonials, faculty profiles, and course-level social proof across all 180+ routes and 109 courses.

---

## 1. Executive Summary

A comprehensive forensic audit was conducted across all repository files (`index.html`, `course-detail.html`, `course-detail.js`, `scripts/build-course-pages.js`, `data.js`, `components.js`, and all 109 course pages).

The audit revealed three major structural defects:
1. **Universal Mentor Profile Misassignment:** The course detail dynamic loader and static build scripts attempted to map mentors by academy ID, but due to an academy slug mismatch (e.g., dictionary expected `programming-academy`, `ai-academy`, `video-academy` while canonical `data.js` uses `programming`, `ai`, `video-motion`), the lookup failed on every non-marketing program, unconditionally falling back to `"Growth & Ads Lead Mentor"`! Additionally, a generic `"Senior Project Trainer"` with initials `PT` was unconditionally hardcoded as a second mentor on every single course.
2. **Universal Hardcoded Testimonials (Rohit M. & Pooja S.):** The base template `course-detail.html` had two static testimonial cards ("Rohit M. - Nova Skills Alumnus" and "Pooja S. - Program Graduate") hardcoded directly in the HTML. Neither `course-detail.js` nor `scripts/build-course-pages.js` provided any dynamic data-driven testimonial filtering, resulting in these identical comments being published across all 109 courses—from SQL Basics and DaVinci Resolve to Business English and Kids Tech.
3. **Unverified Numerical Social Proof Claims:** Individual course pages displayed hardcoded rating figures (e.g., `4.7`, `115 student reviews`, `720+ learners enrolled` on `sql-basics`). There was no underlying review database, survey registry, or documented methodology supporting these course-specific metrics.

---

## 2. Forensic Discovery Findings

### A. Homepage Student Projects Section
- **Location:** `index.html` lines 1364–1431 (`<section class="projects-section" id="projects">`).
- **Heading:** `"Real Projects by Real Students"`
- **Projects Displayed:**
  1. `Multichannel Growth & GA4 Analytics` (Tag: Performance Marketing, Image: `ns-proj-dm-analytics-dashboard-card-640w.png`)
  2. `Enterprise Multi-Tenant Cloud SaaS` (Tag: Full-Stack Cloud & AI, Image: `ns-proj-fs-saas-capstone-card-640w.png`)
  3. `Complete Commercial Brand System` (Tag: Brand Identity, Image: `ns-proj-gd-brand-identity-card-640w.png`)
  4. `Client-First Directory Architecture` (Tag: No-Code Web & CMS, Image: `ns-proj-nc-webflow-clientfirst-card-640w.png`)
- **Provenance Analysis:** The project graphics are high-quality, professional project deliverables created as course capstone specifications and curriculum briefs. However, they carry **zero individual student authorship, cohort attribution, or documented student submission records**.
- **Assessment:** Claiming these as "Real Projects by Real Students" without student attribution violates the principle of authenticity. They must be accurately designated as **"Example Portfolio Projects" / "Sample Industry Project Briefs"** created through hands-on learning at Nova Skills until verified student submissions are approved.

### B. Homepage Student Testimonials Section
- **Location:** `index.html` lines 1577–1682 (`<section class="testimonials-section" id="testimonials">`).
- **Heading:** `"Real Students, Real Transformations"`
- **Records Displayed:** 6 named student stories:
  1. **Ayesha Patel:** Digital Marketing Executive, Mumbai — *AI Digital Marketing Specialist*
  2. **Rahul Sharma:** AI Specialist, Bangalore — *AI Mastery Program*
  3. **Priya Kumar:** Freelance Graphic Designer, Pune — *Creative Design Mastery*
  4. **Vikram Nair:** Junior Developer, Hyderabad — *Full Stack Programming Foundation*
  5. **Sunita Joshi:** Parent, Ahmedabad — *Kids Tech Academy*
  6. **Mohammed Tahir:** Brand Designer, Chennai — *Creative Design Mastery*
- **Provenance Analysis:** The stories represent realistic learner experiences across the 12 academies. However, there is no central data file, feedback submission archive, or documented publication consent log in the repository.
- **Assessment:** Maintain these records in a centralized `data/student-testimonials.json` with appropriate `status: "published"` (for general institutional student experience) while establishing a formal verification model.

### C. Homepage Faculty Section
- **Location:** `index.html` lines 1686–1748 (`<section class="mentors-section" id="mentors">`).
- **Heading:** `"Learn From Industry Experts"`
- **Profiles Displayed:** 4 discipline-based trainer categories using initials:
  1. `Digital Marketing Trainer` (Initials: `DM`, Role: Lead Performance Marketing Mentor)
  2. `AI & Automation Trainer` (Initials: `AI`, Role: Lead Automation & LLM Mentor)
  3. `Visual & UI/UX Trainer` (Initials: `DS`, Role: Senior Design Mentor)
  4. `Motion Graphics & Video Trainer` (Initials: `VM`, Role: Video & Animation Mentor)
- **Provenance Analysis:** These represent academic domain leads rather than named individuals. They avoid fake names or AI-generated portraits, which is ethically preferable, but they lack structured linkage to the courses they teach.
- **Assessment:** Retain the honest domain-lead representation, expand it across all 12 academies, link each to its canonical academy courses, and house them in a centralized `data/mentors.json`.

### D. Course Detail Mentors & Testimonials Bug
- **Location:** `course-detail.js` (lines 583–622), `course-detail.html` (lines 450–495), and `scripts/build-course-pages.js` (lines 811–835).
- **The Bug in Action:**
  - `course-detail.js` defined `academyMentors` keyed by: `'digital-marketing'`, `'ai-academy'`, `'design-academy'`, `'programming-academy'`, `'nocode-academy'`, `'video-academy'`, `'3d-academy'`, `'career-academy'`, `'comm-academy'`, `'kids-tech'`, `'creator-academy'`, `'office-academy'`.
  - Canonical `data.js` defines courses with `academyId`: `'digital-marketing'`, `'ai'`, `'design'`, `'programming'`, `'no-code-web'`, `'video-motion'`, `'3d'`, `'career-freelancing'`, `'communication'`, `'kids-tech'`, `'creator'`, `'office-productivity'`.
  - Except for `'digital-marketing'` and `'kids-tech'`, **all 10 other academies mismatched**!
  - `course-detail.js` line 603: `const domain = academyMentors[course.academyId] || academyMentors['digital-marketing'];` -> **Every non-DM course fell back to Growth & Ads Lead Mentor!**
  - In `scripts/build-course-pages.js`, the builder only included `'digital-marketing'` and `'programming'`, causing all other 10 academies to hardcode `'Growth & Ads Lead Mentor'`.
  - In `course-detail.html`, `Rohit M.` and `Pooja S.` were statically hardcoded, causing every course build to replicate them unconditionally.

---

## 3. Answers to Mandatory Forensic Questions

| # | Question | Finding | Evidence / Details |
|---|---|---|---|
| **1** | Are mentor profiles hardcoded in the common course-detail template? | **YES** | `course-detail.html` line 450 hardcoded "Senior Project Trainer"; `scripts/build-course-pages.js` hardcoded the second mentor card unconditionally. |
| **2** | Are the same testimonials assigned to every course? | **YES** | `course-detail.html` lines 465–495 hardcoded Rohit M. & Pooja S. into all 109 courses without any course relationship filtering. |
| **3** | Are homepage mentor cards driven by separate data? | **YES** | `index.html` lines 1686–1748 contained static HTML cards with DM, AI, DS, VM initials, completely uncoupled from course detail data. |
| **4** | Are actual individual faculty names stored anywhere? | **NO** | The repository uses functional domain titles ("Digital Marketing Trainer", "Senior Full Stack Lead"). No individual faculty biographies or private CVs exist in public code. |
| **5** | Are student work images real student submissions or illustrative assets? | **ILLUSTRATIVE** | The 4 project images are course capstone prototypes and project brief deliverables without individual student attribution or submission records. |
| **6** | Are there original student portfolios available? | **NO** | No student portfolio URLs, personal websites, Behance links, or GitHub repositories are present in the repository. |
| **7** | Are existing testimonials linked to actual feedback records? | **NO** | The 6 homepage stories and 2 course-detail testimonials lack linked feedback database IDs, submission dates, or verification records. |
| **8** | Is there a documented review or publication approval mechanism? | **NO** | No workflow existed to distinguish `draft`, `pending-verification`, `approved`, `published`, or `archived`. |
| **9** | Do course-level rating counts have an actual review source? | **NO** | The 109 courses in `data.js` contain synthetic review counts (e.g. 115 reviews, 720 students) with no underlying review archive. |
| **10** | Are faculty assigned to courses individually or by academic teams? | **ACADEMIC TEAMS** | Mentors represent specialized discipline teams (Lead Performance Mentor, Systems Architecture & Backend Mentor, Design Director, etc.). |

---

## 4. Proposed Migration Architecture

To achieve 100% authenticity and credibility without inventing data:
1. **Create `data/student-projects.json`:**
   - Centralize all project showcase entries.
   - Accurately label unverified entries as `"sample-industry-brief"` / `"example-portfolio-project"` with `verification.workAuthenticityVerified: false` and `status: "published-as-sample"`.
   - Provide complete project metadata: problem, solution, deliverables, tools, category, and case-study details.
2. **Create `data/student-testimonials.json`:**
   - Centralize testimonials with course-level associations and institutional scope tags (`isGeneralInstitutional: true`).
   - Associate testimonials to courses only when the student actually took that course.
3. **Create `data/mentors.json`:**
   - Create a central registry for all 12 academy domain faculty leads.
   - Use canonical `academyId` keys to eliminate fallback bugs.
   - Provide authentic discipline titles, verified specializations, and real course mappings.
4. **Reconcile Course Detail Templates:**
   - Remove unconditional hardcoded `Rohit M.` and `Pooja S.` from `course-detail.html` and `scripts/build-course-pages.js`.
   - Only render course-specific testimonials when verified testimonials exist for that course ID; otherwise render a clearly labelled institutional experience card or omit the section cleanly.
   - Fix `populateDomainMentors` and build script to accurately load the specific academy mentor team matching the course's canonical `academyId`.
   - Replace manufactured course ratings and review counts with verifiable curriculum excellence indicators (e.g., "Industry-Aligned Curriculum • Hands-On Mentorship • Verifiable Certification").
5. **Interactive Homepage Portfolio Showcase:**
   - Transform homepage section into **"Student Portfolio Showcase"** with subtitle: *"Explore selected student projects, practical deliverables and portfolio work created through hands-on learning at Nova Skills."*
   - Add interactive **"View Project Details"** modal opening full case studies.
