# P0-1 Migration Report — Centralised Canonical Course Data Architecture

**Branch:** `development` (strictly isolated from `main` / production)  
**Scope:** Full Nova Skills course metadata unification across all **109** published courses and **12** academies.

---

## 1. Executive Summary

- Established a single canonical data architecture rooted in `data/courses.json`, `data/academies.json`, `data/curricula/<id>.json`, and the UMD accessor layer `js/course-data.js` (`NovaCourseData` / `NovaSkillsData`).
- Eliminated duplicate, drifted, or stale course metadata across Homepage, Global Catalog (`/courses`), All 12 Academy Pages, All 109 Course Detail pages & Edge Middleware, All 36 City Location pages, AI Career Advisor widget & Cloudflare Worker knowledge bases, and Enrollment/Demo modal forms.
- Preserved all existing course IDs, `/course-detail.html?id=<id>` canonical URLs, `course-image-map.json` image assignments & visual layout, AI Advisor scoring/recommendation logic, `"18% GST included"` sidebar UI disclosure, and approved `₹2,900` starting-price claim.

---

## 2. Canonical Course Inventory & Pricing Summary

- **Total Published Courses:** 109 across 12 Academies
- **Academy Distribution & Verified Starting Fees:**
  - `digital-marketing` (Digital Marketing Academy): 14 courses, starting from ₹3,900
  - `ai` (AI Academy): 10 courses, starting from ₹4,900
  - `design` (Design Academy): 10 courses, starting from ₹4,900
  - `programming` (Programming Academy): 10 courses, starting from ₹3,900
  - `nocode` (No-Code Web Academy): 8 courses, starting from ₹5,900
  - `video` (Video & Motion Academy): 8 courses, starting from ₹3,900
  - `3d` (3D Academy): 8 courses, starting from ₹6,900
  - `career` (Career & Freelancing Academy): 10 courses, starting from ₹2,900
  - `communication` (Communication Academy): 7 courses, starting from ₹3,900
  - `kids` (Kids Tech Academy): 7 courses, starting from ₹4,900
  - `creator` (Creator Academy): 7 courses, starting from ₹4,900
  - `office` (Office Productivity Academy): 10 courses, starting from ₹3,900
- **Program Tracks:**
  - **Career Programs:** 11 courses (`₹19,900` – `₹64,900`)
  - **Professional Programs:** 19 courses (`₹9,900` – `₹34,900`)
  - **Certification Courses:** 79 courses (`₹2,900` – `₹10,900`)

---

## 3. Refactored Consumers (`A`–`H`)

| Consumer | Files Migrated | Key Corrections Applied |
|---|---|---|
| **A. Homepage** | `index.html`, `main.js`, `scripts/build-homepage-featured.js` | Synced `dm-professional` (`3 Months`, `5 Core Projects`, `₹19,900`), `creative-design` (`8 Months`), and `ai-integrated-video-editing-motion-graphics-professional` (`8 Months`) cards; synced all 12 academy card course counts & starting fees; wired `NovaCourseData.hydrateDOM()`. Preserved `IMG-003`..`IMG-008` thumbnails and `₹2,900` minimum fee claim. |
| **B. All Courses Catalog** | `courses.html`, `courses.js`, `scripts/build-courses-page.js` | Reads courses/academies dynamically from `NovaCourseData`; removed duplicate 1,093-line `COURSE_IMAGE_MAP` block from `courses.js`; uses `getCourseProjectLabel()` and `course.images.card`; updates dynamic counts (`109`) on load. |
| **C. Academies & 12 Academy Pages** | `academies/index.html`, `academy-detail.html`, `academy-detail.js`, `scripts/build-academy-pages.js` | Consolidated all 12 academy generators & runtime detail rendering onto `NovaCourseData`; removed duplicate 1,093-line `COURSE_IMAGE_MAP` block from `academy-detail.js`; replaced stale `${liveProj}+ Live Projects` labels with `getCourseProjectLabel()`. |
| **D. Course Detail & Edge Pre-render** | `course-detail.html`, `course-detail.js`, `scripts/build-course-pages.js`, `_rendered_courses/*.html`, `functions/_rendered_courses.js` | Replaced hardcoded `courseType === 'MASTER' ? '3 Major Portfolio Projects' : '2 Production Projects'` and `${projectCount} Core Production Projects` with canonical `getCourseProjectLabel()`; lazy-loads `/data/curricula/<id>.json` (`curriculumRef`) instead of reading full curriculum upfront across other pages. |
| **E. Location / 36 City Pages** | `lib/locations/location-course-resolver.js`, `scripts/build-all-city-pages-phaseF.js`, `scripts/build-branches-directory.js`, `branches/*/index.html`, `branches/index.html` | Fixed numeric `liveProjects` check bug in `buildCourseView()`; replaced nonexistent `/assets/images/courses/${id}.jpg` fallback with `course.images.card.desktop`; wired `NovaCourseData.isCourseDemoEligible` & `getCourseProjectLabel`. |
| **F. AI Career Advisor & Workers** | `nova-ai-widget.js`, `worker/src/data/courses.json`, `cloudflare-worker/src/knowledge/knowledgeBase.js`, `scripts/sync-worker-course-data.js` | Eliminated stale `FALLBACK_COURSES` and inline wrong fee strings (`₹13,999`, `₹17,499`, etc.) and obsolete IDs (`motion-mastery`, `freelancing-mastery`, `career-launch`); advisor now resolves all recommendations dynamically from `NovaCourseData` while keeping scoring & UX intact. Synced Worker datasets to all 109 canonical courses. |
| **G. Enquiry & Demo Forms** | `components.js` | Updated `openEnrollmentModal`, `populateDemoCourseSelect`, and `openDemoModal` to resolve via `NovaCourseData.getCourseById()` & `getPublishedCourses()` first; aligned `COURSE_CATALOG_METADATA` fallback prices/durations with `data/courses.json`. |
| **H. SEO & JSON-LD Metadata** | `scripts/build-courses-page.js`, `scripts/build-academy-pages.js`, `scripts/build-course-pages.js`, `scripts/generate-sitemap.js` | Preserved canonical `?id=` URLs, accurate `price`/`duration`/`courseWorkload` schema values, and regenerated `sitemap.xml` (175 URLs). |

---

## 4. Validation & Remaining Review Flags

- **Canonical Validation Suite (`scripts/validate-course-data.js`):** `6,326 / 6,326` checks passing (`0` failures).
- **Flagged Items Documented in `docs/course-data-conflicts.md` (Preserved Pending Confirmation):**
  - **GST Policy Wording:** Detail UI sidebar/pre-renderers display `"18% GST included"` while detail FAQs in `data/courses/*.json` mention statutory 18% GST extra and client calculation uses `price * 1.18`; UI text preserved unchanged pending administrative confirmation.
  - **5 Course Project Metrics Flagged `reviewRequired`:** `uiux-design-pro`, `fullstack-foundation`, `youtube-mastery`, `content-creator-pro`, and `biz-productivity` exhibit ambiguous source project vs deliverable counts across legacy files and carry typed `Hands-On Portfolio Projects` / `Portfolio Case Studies + Capstone` labels cleanly until academic sign-off.
