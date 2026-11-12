# Nova Skills — P0-1 Course Data Forensic Audit

**Task ID:** P0-1 — Centralise All Nova Skills Course Data  
**Branch:** `development`  
**Audit Date:** 2026-11-12  
**Audited Scope:** Complete repository (`data.js`, `data/courses/*.json`, `scripts/Nova_Skills_109_Course_Master_Mapping.json`, `course-image-map.json`, `data/locations/*`, `index.html`, `courses.html`, `academies/*`, `course-detail.html`, `branches/*`, client & build JS, Cloudflare Worker files).

---

## 1. Existing Course Data Sources

| Source | Type / Role | Record Count | Findings |
|---|---:|---:|---|
| [data.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data.js) (`NS_COURSES` + `NS_ACADEMIES[].courses`) | Monolithic JS registry (36,725 lines / ~1.6 MB minified) | 109 × 2 (218) | Duplicates every course twice (`NS_ACADEMIES[i].courses` and top-level `NS_COURSES`), AND embeds full lesson-by-lesson `curriculum` arrays (~1.65 MB). Across all **109** courses, extra properties (`tools`, `projects`, `course_name`, `duration_weeks`, `learning_hours`, `hours`, `short_description`, `full_description`) already diverged between `NS_ACADEMIES[].courses` and `NS_COURSES`. |
| `data/courses/<id>.json` | Individual detail JSON specifications | 109 files | Deep academic specs (`learning_hours`, `prerequisites`, `overview`, `learning_outcomes`, `hands_on_tech`, `modules`, `what_you_will_build`, `final_deliverables`, `faq`). Uses heterogeneous schemas (`core_tools` vs `primary_tools` vs `primary_assessed_mastery`; `project_count` strings; outdated tuition figures inside FAQ/overview prose on 16+ files). |
| [scripts/Nova_Skills_109_Course_Master_Mapping.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/scripts/Nova_Skills_109_Course_Master_Mapping.json) | Commercial pricing & naming ledger (2026-11-09 launch pricing) | 109 records | Authoritative source for `course_number` (1–109), `stable_id`, `final_course_name`, `regular_fee`, `launch_fee`, `effective_fee`, `offer_active`, `approval_status` (48 active launch offers + 61 regular-only). |
| [nova-skills-109-course-content.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/nova-skills-109-course-content.json) | Bulk fallback JSON bundle | 109 records | Legacy merged dump synced for pricing only by `scripts/sync-all-pricing.js` and fetched as a fallback in `course-detail.js`. |
| [course-image-map.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/course-image-map.json) | Canonical course-card image registry | 109 records | Authoritative P0 desktop/mobile `<picture>` mappings across supplied assets (`IMG-048`, `IMG-006/007/008`, `IMG-060..075`), existing project PNGs, generated WebPs, and bespoke SVGs. |
| [data/locations/location-course-mapping.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/data/locations/location-course-mapping.json) & `locations.json` | 36-city online recommendation index | 36 cities / 236 links | Already references courses by `stableId` and `masterNumber` cleanly without duplicating pricing/curricula. |
| [nova-ai-widget.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/nova-ai-widget.js) | Client AI Career Advisor drawer (`FALLBACK_COURSES` + reply copy) | 22 fallback records + prose | Contains deleted legacy IDs (`motion-mastery`, `freelancing-mastery`, `career-launch`) and 19 stale price/duration/title/project mismatches (e.g. `₹31,499`, `₹89,999`, `₹17,499`, `₹13,999`, `"4 Months"`, `"20 Live Projects"`). |
| [components.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/components.js) | Shared header, modals, lead forms (`COURSE_CATALOG_METADATA` + `COURSE_ID_ALIASES`) | 14 hardcoded metadata entries | `COURSE_CATALOG_METADATA` still stores stale fees/durations (`Python Developer Professional` at `₹14,999` / `3 Months` instead of `₹17,999` / `4 Months`; `UI/UX Design Professional` at `₹34,900` vs `₹24,900`; `E-Commerce Website Mastery` at `₹49,900` vs `₹34,900`). |
| [worker/src/data/courses.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/worker/src/data/courses.json) & [cloudflare-worker/src/knowledge/knowledgeBase.js](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/cloudflare-worker/src/knowledge/knowledgeBase.js) | Worker AI knowledge payloads | 5 legacy summary items | Obsolete mock catalog (`course-dm-career`, `₹25,000`, `₹45,000`, `12 Months`, `"100% Dedicated Placement Support"`). |

---

## 2. All Files Consuming Course Data

1. **Homepage (`index.html`, `main.js`):**
   - 6 featured course `<article>` cards (`dm-professional`, `ai-mastery`, `fullstack-foundation`, `creative-design`, `ai-integrated-video-editing-motion-graphics-professional`, `dm-mastery`) hardcoded statically in HTML with conflicting badge vs modal values.
   - 12 Academy overview cards linking to `/academies/<slug>/`.
   - `₹2,900` starting-price claim (consistent with lowest published course `resume-building` at `₹2,900`).
   - Hardcoded `109+` / `109` catalogue count labels.
2. **Global Courses Catalogue (`courses.html`, `courses.js`, `scripts/build-courses-page.js`):**
   - Pre-renders all 109 cards and JSON-LD `CollectionPage` in `courses.html`; client-side filters/search/sorting run via `courses.js`.
   - Currently loads the entire 1.65 MB `js/data.min.js` (including all 109 detailed curricula).
3. **12 Individual Academy Pages (`academies/*/index.html`, `academies/index.html`, `academy-detail.js`, `academy-detail.html`, `scripts/build-academy-pages.js`):**
   - Repeats the same courses per academy in Career / Professional / Certification track sections AND in the Complete Academy Offerings Explorer (`228` total rendered cards across 12 pages), plus `totalCourses` counts and lowest academy price calculations.
4. **Course Detail Pages (`course-detail.html`, `course-detail.js`, `_rendered_courses/*.html`, `functions/_rendered_courses.js`, `scripts/build-course-pages.js`):**
   - Resolves by `meta[name="course-id"]`, `/courses/<slug>/`, or `?id=<course-id>` (`COURSE_ALIASES`).
   - Fetches `/data/courses/<id>.json` dynamically (fallback `/nova-skills-109-course-content.json`).
   - Renders hardcoded `projectLabel` (`courseType === 'MASTER' ? '3 Major Portfolio Projects' : '2 Production Projects'`) in `populateCourseDetail` (`course-detail.js:312`) and hardcoded `"18% GST included"` (`line 371`) directly below an extra-GST calculation (`totalWithGST = price * 1.18`).
5. **36 Location / City Pages (`branches/index.html`, `branches/*/index.html`, `lib/locations/location-course-resolver.js`, `scripts/build-all-city-pages-phaseF.js`):**
   - Resolves city core + additional course recommendations through `location-course-resolver.js`.
   - Bug discovered in `location-course-resolver.js:193`: `Array.isArray(course.liveProjects) ? course.liveProjects.length : (course.live_projects || 0)` evaluates to `0` because `liveProjects` is numeric (`5`), and thumbnail fallback points to non-existent `/assets/images/courses/<id>.jpg` instead of `course-image-map.json`.
6. **AI Career Advisor (`nova-ai-widget.js`, `ai-chat.html`, `ai-chat.js`, `worker/src/data/courses.json`, `cloudflare-worker/src/knowledge/knowledgeBase.js`):**
   - Mixes dynamic lookups in `NS_COURSES` with stale `FALLBACK_COURSES` and inline text prices/durations/project counts (`₹13,999`, `₹17,499`, `4 Months`, `20 Live Projects`, `18 Live Client Projects`).
7. **Enquiry, Demo & Admissions Forms (`components.js`):**
   - `openEnrollmentModal()` dynamically resolves against `NS_COURSES` with fallback to stale `COURSE_CATALOG_METADATA`.
   - `populateDemoCourseSelect()` populates `#demo-course-select` `<optgroup>` options from `NS_COURSES` using duplicated `isCourseDemoEligible()`.
   - Inline consultation popup `#book-consult-academy` offers the 12 academy choices + `"Not sure yet"`.

---

## 3. Canonical ID-to-Course & Academy-to-Course Mapping Summary

Total published courses: **109** across **12** academies (unique `id`, unique `slug`, unique `course_number` 1–109):

| Academy ID | Directory Slug | Academy Name | Course Count | Min Effective Fee |
|---|---|---|---:|---:|
| `digital-marketing` | `digital-marketing` | Digital Marketing Academy | 14 | ₹3,900 |
| `ai` | `ai` | AI Academy | 10 | ₹4,900 |
| `design` | `design` | Design Academy | 10 | ₹4,900 |
| `programming` | `programming` | Programming Academy | 10 | ₹3,900 |
| `nocode` | `no-code-web` | No-Code Web Academy | 8 | ₹5,900 |
| `video` | `video-motion` | Video & Motion Academy | 8 | ₹3,900 |
| `3d` | `3d` | 3D Academy | 8 | ₹6,900 |
| `career` | `career-freelancing` | Career & Freelancing Academy | 10 | ₹2,900 (`resume-building`) |
| `communication` | `communication` | Communication Academy | 7 | ₹3,900 |
| `kids` | `kids-tech` | Kids Tech Academy | 7 | ₹4,900 |
| `creator` | `creator` | Creator Academy | 7 | ₹4,900 |
| `office` | `office-productivity` | Office Productivity Academy | 10 | ₹3,900 |
| **Total** | | **12 Academies** | **109** | **₹2,900** |

All 109 course IDs already match 1:1 with `data/courses/<id>.json` and [course-image-map.json](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/course-image-map.json).

---

## 4. Root Causes of Historical Drift

1. **Dual array storage in `data.js`**: Maintaining `NS_ACADEMIES[].courses` and `NS_COURSES` separately caused 109 object divergences whenever scripts patched only one array.
2. **Naive deliverable counting in `scripts/sync-course-catalog.js`**: Promoting `student_deliverables_and_evidence.length` or `final_deliverables.length` ahead of `what_you_will_build.length` and `overview.key_facts.project_count` introduced `17` numerical project conflicts (e.g., setting `ai-assisted-full-stack-web-development` to `3` from 3 graduation deliverables, `youtube-mastery` to `15`, `biz-productivity` to `1`).
3. **Static HTML & widget copy snapshots**: `index.html`, `nova-ai-widget.js`, `components.js`, `worker/src/data/courses.json`, and `cloudflare-worker/src/knowledge/knowledgeBase.js` hardcoded course prices, durations, and project counts instead of querying a central API.
4. **Heavy coupled curricula**: Bundling 109 full curricula inside `data.js` / `js/data.min.js` bloated catalog downloads to 1.65 MB while still requiring `/data/courses/<id>.json` on course detail pages.

---

## 5. Proposed Canonical Migration Architecture

```
data/
├── course-data-schema.json      # JSON Schema contract for all canonical course records
├── academies.json               # 12 canonical academy metadata records (NO duplicated course arrays)
├── courses.json                 # Single authoritative collection of all 109 courses (catalog/summary fields + refs)
├── curricula/<course-id>.json   # 109 lazy-loaded full curriculum & academic detail records keyed by courseId
└── locations/                   # 36-city mapping strictly referencing canonical course IDs

js/
├── course-data.js               # Universal (Node + Browser UMD) Course Data Access Layer (NovaCourseData)
└── data.js / js/data.min.js     # Slim generated runtime artifact compiled from data/courses.json + data/academies.json (curricula omitted from catalog payload; NS_ACADEMIES[].courses references NS_COURSES objects dynamically)
```

### Target Files for Modification / Addition
- New canonical schema & stores: `data/course-data-schema.json`, `data/academies.json`, `data/courses.json`, `data/curricula/<109 ids>.json`
- New data access & validation layers: `js/course-data.js`, `js/course-data.min.js`, `scripts/migrate-course-data.js`, `scripts/build-canonical-data.js`, `scripts/validate-course-data.js`, `scripts/build-homepage-featured.js`
- Refactored runtime & SSR consumers: `data.js`, `index.html`, `main.js`, `courses.html`, `courses.js`, `academy-detail.html`, `academy-detail.js`, `academies/*/index.html`, `course-detail.html`, `course-detail.js`, `_rendered_courses/*.html`, `functions/_rendered_courses.js`, `components.js`, `nova-ai-widget.js`, `lib/locations/location-course-resolver.js`, `branches/*/index.html`, `branches/index.html`, `worker/src/data/courses.json`, `cloudflare-worker/src/knowledge/knowledgeBase.js`, plus updated `scripts/build-*.js`, `scripts/build_min_js.js`, `package.json`.
