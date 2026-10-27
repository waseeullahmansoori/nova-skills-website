# Nova Skills: Career & Communication Academies Production Release Manifest
**Document Identifier:** `NOVA-REL-CAREER-COMM-2026-V1`  
**Generated Date:** 2026-10-28T00:44:00+05:30  
**Target Release Branch:** `release/career-communication-2026`  
**Target Production Branch:** `main` (`origin/main`)  
**Production Baseline Commit:** `7a6a13b92254e758b655e99d43bd5f7f87697769` (`feat(3d-academy): release architectural and product visualization course redesigns`)  
**Source Development Commit:** `f2ac5162afe1cab3e60b7ce6b05754a660e50d30` (`feat(communication-academy): redesign professional spoken english to 90 hours`)  
**Development Branch:** `transformation/nova-course-redesign`

---

## 1. Executive Release Scope

This controlled production release delivers the completed, academically validated, and owner-approved course redesigns for the **Career & Freelancing Academy** (`career`) and the **Communication Academy** (`communication`):

1. **Course 21: Freelancing & Client Acquisition Professional** (`freelancing-client-acquisition-professional`, legacy alias: `freelancing-mastery`)
2. **Course 22: Career Launch & Placement Readiness Professional** (`career-launch-placement-readiness-professional`, legacy alias: `career-launch`)
3. **Course 23: Business English & Personality Development** (`business-english`)
4. **Course 24: Professional Spoken English** (`spoken-english-pro`)

### Scope Summary:
- **Eligible New Courses for Production Release:** **4 Core Courses**
  - `freelancing-client-acquisition-professional`: Redesigned to 4 Months, 160 Guided Hours, 16 Modules, Freelance Business Launch Portfolio (12 Evidence Categories), INR 24,900 (regular: INR 29,900).
  - `career-launch-placement-readiness-professional`: Redesigned to 3 Months, 120 Guided Hours, 12 Modules, Career Launch Portfolio (14 Evidence Categories), INR 14,900 (regular: INR 19,900).
  - `business-english`: Modernized to 6 Months, 144 Guided Hours, 20 Modules, Professional Communication Portfolio (15 Evidence Categories), INR 29,900.
  - `spoken-english-pro`: Redesigned to 3 Months, 90 Guided Hours, 12 Modules, Spoken English Communication Portfolio (15 Evidence Categories), INR 12,900.
- **Preserved Existing Baseline Courses:** **105 Courses**
  - All 8 standalone certification courses in Career & Freelancing Academy (`resume-building`, `linkedin-optimisation`, `interview-preparation`, `client-communication`, `proposal-writing`, `agency-building`, `fiverr-success`, `upwork-success`) remain 100% untouched.
  - All 5 standalone certification courses in Communication Academy (`spoken-english-cert`, `business-communication`, `presentation-skills`, `public-speaking`, `soft-skills`) remain 100% untouched.
  - All 92 courses across the other 10 academies remain 100% untouched and preserved from production baseline `7a6a13b`.
- **Release Strategy:** Isolated Git worktree (`release/career-communication-2026`) branched from `origin/main` at `7a6a13b`.
- **Integration Approach:** Selective semantic record integration into shared files (`data.js`, `nova-skills-109-course-content.json`), dedicated course JSON transfer, routing aliases support, and deterministic rebuild of derived assets (`js/data.min.js`, `courses.html`, `academies/career-freelancing/index.html`, `academies/communication/index.html`, `_rendered_courses/`, `functions/_rendered_courses.js`, `sitemap.xml`).

---

## 2. Approved Course Specifications

| Academic Catalog No. | Course Name | Canonical ID | Legacy Alias | Level | Duration | Guided Hours | Approved Selling Price | Modules | Mandatory Capstone / Portfolio |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Course 21** | **Freelancing & Client Acquisition Professional** | `freelancing-client-acquisition-professional` | `freelancing-mastery` | Professional | 4 Months | 160h | ₹24,900 | 16 | Freelance Business Launch Portfolio (12 Evidence Categories) |
| **Course 22** | **Career Launch & Placement Readiness Professional** | `career-launch-placement-readiness-professional` | `career-launch` | Professional | 3 Months | 120h | ₹14,900 | 12 | Career Launch Portfolio (14 Evidence Categories) |
| **Course 23** | **Business English & Personality Development** | `business-english` | — | Career Mastery | 6 Months | 144h | ₹29,900 | 20 | Professional Communication Portfolio (15 Evidence Categories) |
| **Course 24** | **Professional Spoken English** | `spoken-english-pro` | — | Professional Foundation | 3 Months | 90h | ₹12,900 | 12 | Spoken English Communication Portfolio (15 Evidence Categories) |

---

## 3. Academy Inventories & Classification

### A. Career & Freelancing Academy (`career` / `career-freelancing`) — 10 Courses:
1. `freelancing-client-acquisition-professional` — **READY (Core Redesign Release)**
2. `career-launch-placement-readiness-professional` — **READY (Core Redesign Release)**
3. `resume-building` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**
4. `linkedin-optimisation` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**
5. `interview-preparation` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**
6. `client-communication` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**
7. `proposal-writing` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**
8. `agency-building` — **EXCLUDED (Standalone 2-Month Certification, Preserved)**
9. `fiverr-success` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**
10. `upwork-success` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**

### B. Communication Academy (`communication`) — 7 Courses:
1. `business-english` — **READY (Core Redesign Release)**
2. `spoken-english-pro` — **READY (Core Redesign Release)**
3. `spoken-english-cert` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**
4. `business-communication` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**
5. `presentation-skills` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**
6. `public-speaking` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**
7. `soft-skills` — **EXCLUDED (Standalone 1-Month Certification, Preserved)**

---

## 4. Release File Scope & Inventory

### Authoritative Course Content Files:
1. `data/courses/freelancing-client-acquisition-professional.json` (Transfer complete approved 16-module specification)
2. `data/courses/career-launch-placement-readiness-professional.json` (Transfer complete approved 12-module specification)
3. `data/courses/business-english.json` (Transfer complete approved 20-module specification)
4. `data/courses/spoken-english-pro.json` (Transfer complete approved 12-module specification)

### Academic Specification Files:
5. `docs/course-redesign/career/freelancing-client-acquisition-professional-spec.md`
6. `docs/course-redesign/career/career-launch-placement-readiness-professional-spec.md`
7. `docs/course-redesign/communication/business-english-personality-development-spec.md`
8. `docs/course-redesign/communication/professional-spoken-english-spec.md`
9. `docs/releases/career-communication-production-release.md` (This release manifest)

### Shared Data & Application Logic Files:
10. `data.js` (Selective transfer of target courses in `NS_COURSES` and `NS_ACADEMIES`)
11. `nova-skills-109-course-content.json` (Selective transfer of target course objects)
12. `course-detail.js` (Routing aliases for `freelancing-mastery` and `career-launch`)
13. `scripts/build-course-pages.js` (Edge pre-rendering aliases for `freelancing-mastery` and `career-launch`)
14. `academies/career-freelancing/index.html` (Update links to canonical IDs)

### Derived Assets Rebuilt via Authoritative Tooling:
15. `js/data.min.js` (Built via `node scripts/build_min_js.js`)
16. `js/course-detail.min.js` (Built via `node scripts/build_min_js.js`)
17. `courses.html` (Built via `node scripts/build-courses-page.js`)
18. `academies/career-freelancing/index.html` (Built via `node scripts/build-academy-pages.js`)
19. `academies/communication/index.html` (Built via `node scripts/build-academy-pages.js`)
20. `_rendered_courses/` (109 static HTML files built via `node scripts/build-course-pages.js`)
21. `functions/_rendered_courses.js` (Built via `node scripts/build-course-pages.js`)
22. `sitemap.xml` (Built via `node scripts/generate-sitemap.js`)

---

## 5. Quality & Governance Validation Checklist

- [x] **Academic Hourly Audit:** All 4 courses match exact approved durations (160h, 120h, 144h, 90h).
- [x] **Truth-in-Pricing Audit:** Transparent selling fees, 0% fake discounts, statutory GST notices.
- [x] **Anti-Guarantee Compliance:** No guaranteed job placements, client earnings, or accent elimination claims.
- [x] **Catalog Invariants:** Exactly 109 courses, 109 unique IDs, 12 academies.
- [x] **Backward-Compatible URL Aliases:** `freelancing-mastery` and `career-launch` resolve cleanly.
- [x] **Cloudflare Edge Pre-rendering:** Edge middleware correctly serves pre-rendered HTML for all canonical courses and aliases.
