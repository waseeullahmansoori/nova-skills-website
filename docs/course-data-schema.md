# Nova Skills Canonical Course Data Architecture & Schema Guide

**Task:** P0-1 Canonical Course Data Layer  
**Schema Definition:** `data/course-data-schema.json`  
**Authoritative Stores:** `data/courses.json`, `data/academies.json`, `data/curricula/<course-id>.json`  
**Runtime Adapter & Bundle:** `js/course-data.js`, `data.js`, `js/data.min.js`

---

## 1. Architecture Overview

The Nova Skills website maintains **one single source of truth** for all 109 published courses across 12 specialized academies:

1. **`data/academies.json`** — Authoritative academy metadata (IDs, slugs, names, icons, SEO descriptions, course counts, computed minimum fees). Contains **no duplicated course objects**.
2. **`data/courses.json`** — Canonical array of 109 published courses (`version: "2.0.0"`, `approvedStartingPrice: 2900`, `computedMinimumPublishedPrice: 2900`), conforming to `data/course-data-schema.json`.
3. **`data/curricula/<id>.json`** — 109 lazily loaded per-course syllabus & showcase files referenced by `course.curriculumRef` (`curricula/<id>.json`), preventing catalog/academy pages from loading all 109 full syllabi upfront.
4. **`js/course-data.js` (`window.NovaCourseData` / `window.NovaSkillsData`)** — Universal UMD (Browser + Node.js) accessor library used identically by runtime pages, edge pre-renderers, city resolvers, AI advisor widgets, and lead capture modals.
5. **`data.js` & `js/data.min.js`** — Compiled synchronous browser data bundle built from `data/academies.json` + `data/courses.json`, with `NS_ACADEMIES[].courses` referencing canonical `NS_COURSES` dynamically in memory (zero duplicate course serialization), bundled together with `js/course-data.js` into `js/data.min.js`.

---

## 2. Canonical Course Record Structure (`data/courses.json`)

Every course entry adheres to `data/course-data-schema.json`:

- **Identifiers:** `id`, `slug`, `status` (`published` | `draft` | `archived`), `courseNumber` (`1`–`109`), `academyId`
- **Copy:** `title`, `shortTitle`, `description: { card, overview, full }`
- **Classification:** `classification: { programType, programLevel, level, category, courseRole }`
  - `Career Program`: 11 courses (`₹19,900` – `₹64,900`)
  - `Professional Program`: 19 courses (`₹9,900` – `₹34,900`)
  - `Certification Course`: 79 courses (`₹2,900` – `₹10,900`)
- **Duration & Effort:** `duration: { value, unit, displayLabel, weeksEquivalent, monthsEquivalent }`, `guidedHours`
- **Delivery:** `delivery: { modes, displayMode, placementSupport, freeDemo }`
- **Pricing:** `pricing: { currency: "INR", currentPrice, originalPrice, launchPrice, offerActive, discountPercent, gst, installment }`
  - Canonical approved starting fee floor: `₹2,900` (`resume-building`, `linkedin-optimisation`, `google-search-console`)
- **Projects:** `projects: { metrics[], primaryCount, displayLabel, suppressNumericBadge, reviewRequired, reviewNotes }`
  - Distinguishes `portfolio`, `core-production`, `capstone`, and `graduation-deliverables` metrics instead of flattening deliverable checklist lengths into project counts.
- **Media:** `images: { card: { desktop, mobile, mimeType, alt, width, height, mobileWidth, mobileHeight, imageId, imageSource }, hero, gallery }` synced to `course-image-map.json`.
- **Syllabus & SEO:** `curriculumRef`, `modulesSummary`, `seo: { title, description, canonicalUrl, ogImage }` (`https://novaskills.in/course-detail.html?id=<id>`)
- **Audit State:** `dataQuality: { status, reviewRequired, reviewNotes }`

---

## 3. Public Accessor API (`js/course-data.js`)

Exposed globally in browser as `window.NovaCourseData` (aliased as `window.NovaSkillsData`) and in Node via `require('./js/course-data.js')`:

| Method | Purpose |
|---|---|
| `getPublishedCourses()` / `getAllCourses()` | Return canonical published courses |
| `getCourseById(idOrAlias)` / `getCourseBySlug(slug)` | Resolve canonical course, including legacy alias redirects (`digital-marketing-pro`, `motion-mastery`, `freelancing-mastery`, `career-launch`, etc.) |
| `getCoursesByAcademy(academyId)` | Return published courses for a given academy |
| `getAcademyCourseCount(academyId)` / `getAcademyStartingPrice(academyId)` | Derive live count and lowest fee per academy |
| `getGlobalCourseCount()` / `getTotalAcademiesCount()` | Return verified published totals (`109` / `12`) |
| `getCanonicalStartingPrice()` | Returns approved `2900` floor (`₹2,900`) |
| `isCourseDemoEligible(course)` | Central 2-day free demo eligibility resolver |
| `getCourseDetailUrl(courseOrId)` | Preserves `/course-detail.html?id=<id>` |
| `getCourseProjectLabel(course)` | Returns canonical typed project label without misleading counts |
| `loadCourseCurriculum(courseId)` | Lazily loads `/data/curricula/<id>.json` (with `/data/courses/<id>.json` fallback) |
| `hydrateDOM()` | Populates `[data-course-id]`, `.canonical-courses-count`, `.canonical-academies-count`, `.canonical-starting-price` |

---

## 4. How to Update or Add a Course Safely

1. Update the canonical record in **`data/courses.json`** (and corresponding syllabus JSON in **`data/curricula/<id>.json`** if modules/outcomes changed).
2. Run the automated build & sync pipeline:
   ```bash
   npm run build
   ```
   This single pipeline compiles:
   - `data.js` (`scripts/build-canonical-data.js`)
   - `worker/src/data/courses.json` & `cloudflare-worker/src/knowledge/knowledgeBase.js` (`scripts/sync-worker-course-data.js`)
   - Homepage featured cards & academy badges in `index.html` (`scripts/build-homepage-featured.js`)
   - Minified bundles in `js/*.min.js` (`scripts/build_min_js.js`)
   - Pre-rendered `/courses` catalogue (`scripts/build-courses-page.js`)
   - Pre-rendered 12 `/academies/<slug>/` pages (`scripts/build-academy-pages.js`)
   - Pre-rendered 109 `_rendered_courses/*.html` & Cloudflare Edge bundle `functions/_rendered_courses.js` (`scripts/build-course-pages.js`)
   - All 36 city pages `/branches/<city>/` & `/branches/` directory (`scripts/build-all-city-pages-phaseF.js`, `scripts/build-branches-directory.js`)
   - XML sitemap (`scripts/generate-sitemap.js`)
3. Run the canonical validation suite:
   ```bash
   npm run validate:courses
   ```
   Ensure **0 failed checks** before committing any changes.
