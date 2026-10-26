# Nova Skills: All Finished Courses Production Release Manifest
**Document Version:** 1.0.0
**Generated Date:** 2026-10-26T20:07:00+05:30
**Target Release Branch:** `release/all-finished-courses-production-2026`
**Target Production Branch:** `main` (`origin/main`)
**Production Baseline Commit:** `d5b305df54e968aaa9923a713d98d16db6c1f5d3`
**Source Development Branch:** `transformation/nova-course-redesign` (`56371228c5013583dd6575e7b9c3d21065c4e971`)

---

## 1. Executive Release Scope

This release manifest audits all 109 courses across all 12 academies on `transformation/nova-course-redesign` against current production `origin/main`.

### Scope Summary:
- **Eligible New Courses for Production Release:** **5 Courses**
  - No-Code Web Academy: 2 courses (`ecommerce-mastery`, `nocode-web-pro`)
  - Video & Motion Academy: 3 courses (`ai-integrated-video-editing-motion-graphics-professional`, `video-pro`, `generative-ai-video-production-professional`)
- **Already Live on Production Main:** **13 Redesigned Courses**
  - AI & Automation Academy: 3 courses (`ai-mastery`, `ai-productivity`, `ai-for-business-pro`)
  - Digital Marketing Academy: 4 courses (`dm-mastery`, `dm-professional`, `performance-marketing-specialist`, `ecommerce-growth-marketing-specialist`)
  - Design Academy: 3 courses (`creative-design`, `graphic-design-pro`, `uiux-design-pro`)
  - Programming Academy: 3 courses (`fullstack-foundation`, `python-developer`, `ai-assisted-full-stack-web-development`)
- **Preserved Existing Baseline Courses:** **91 Courses** (including 71 single-month certificate reconciliations and Blender tools fix previously committed on `main`).

---

## 2. Eligible Courses for Production Release

| Academy | Course Name | Canonical ID (Old ID) | Duration | Guided Hours | Selling Price (Regular) | Modules | Portfolio Projects | Development Commit |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **No-Code Web** | E-Commerce Website Mastery | `ecommerce-mastery` | 6 Months | 240h | ₹49,900 (₹49,900) | 12 | 4 Projects | `de164e0` |
| **No-Code Web** | No-Code Website Professional | `nocode-web-pro` | 3 Months | 120h | ₹12,999 (₹12,999) | 9 | 3 Projects | `a0fbc1f` |
| **Video & Motion**| AI-Integrated Video Editing & Motion Graphics Professional | `ai-integrated-video-editing-motion-graphics-professional` (`motion-mastery`) | 8 Months | 320h | ₹69,900 (₹69,900) | 26 | 7 Projects + Showreel | `f763538` |
| **Video & Motion**| Professional Video Editing | `video-pro` | 4 Months | 160h | ₹29,900 (₹35,900) | 11 | 3 Projects | `af48c52` |
| **Video & Motion**| Generative AI Video Production Professional | `generative-ai-video-production-professional` (`ai-video-pro`) | 5 Months | 200h | ₹34,900 (₹39,900) | 13 | 5 Projects + Showreel | `5637122` |

---

## 3. Detailed Course Eligibility Verification

### Course 01: E-Commerce Website Mastery
- **Academy:** No-Code Web Academy (`no-code`)
- **Canonical ID:** `ecommerce-mastery`
- **Old ID:** None
- **Duration:** 6 Months (24 Academic Weeks)
- **Guided Hours:** 240 Guided Hours (Module sum: 12 + 20 + 32 + 32 + 20 + 24 + 20 + 18 + 16 + 18 + 12 + 16 = 240h)
- **Selling Price:** INR 49,900 (Approved catalog selling price; originalPrice = 49900; 0% fake discount)
- **Curriculum Spec:** `docs/course-redesign/no-code/ecommerce-website-mastery-spec.md`
- **Data Source Files:**
  - `data/courses/ecommerce-mastery.json`
  - `data.js` (target record updated)
  - `nova-skills-109-course-content.json` (target record updated)
- **Projects:** 4 full enterprise builds (Shopify Plus D2C, WooCommerce Wholesale B2B, Custom Subscriptions, Headless Storefront)
- **Eligibility Decision:** **COMPLETED — ELIGIBLE FOR RELEASE**

### Course 02: No-Code Website Professional
- **Academy:** No-Code Web Academy (`no-code`)
- **Canonical ID:** `nocode-web-pro`
- **Old ID:** None
- **Duration:** 3 Months (12 Academic Weeks)
- **Guided Hours:** 120 Guided Hours (Module sum: 8 + 10 + 24 + 24 + 24 + 10 + 8 + 6 + 6 = 120h)
- **Selling Price:** INR 12,999 (Existing working selling price strictly preserved; unapproved 24,900 rejected)
- **Curriculum Spec:** `docs/course-redesign/no-code/no-code-website-professional-spec.md`
- **Data Source Files:**
  - `data/courses/nocode-web-pro.json`
  - `data.js` (target record updated)
  - `nova-skills-109-course-content.json` (target record updated)
- **Projects:** 3 complete builds (Modern Agency in Webflow, High-Converting Business in Framer, Dynamic CMS Portal)
- **Eligibility Decision:** **COMPLETED — ELIGIBLE FOR RELEASE**

### Course 03: AI-Integrated Video Editing & Motion Graphics Professional
- **Academy:** Video & Motion Academy (`video`)
- **Canonical ID:** `ai-integrated-video-editing-motion-graphics-professional`
- **Old ID (Alias):** `motion-mastery`
- **Duration:** 8 Months (32 Academic Weeks)
- **Guided Hours:** 320 Guided Hours (Module sum: 26 modules = 320h)
- **Selling Price:** Regular fee INR 69,900 (Proposed unverified 59,900 excluded per rules; 0% fake discount)
- **Curriculum Spec:** `docs/course-redesign/video-motion/ai-integrated-video-editing-motion-graphics-professional-spec.md`
- **Data Source Files:**
  - `data/courses/ai-integrated-video-editing-motion-graphics-professional.json`
  - Deletion of `data/courses/motion-mastery.json`
  - `data.js` (target record updated)
  - `nova-skills-109-course-content.json` (target record updated)
- **Projects:** 7 comprehensive portfolio deliverables + 60–90s commercial motion showreel
- **URL Migration:** Alias `?id=motion-mastery` maps to `?id=ai-integrated-video-editing-motion-graphics-professional`
- **Eligibility Decision:** **COMPLETED — ELIGIBLE FOR RELEASE**

### Course 04: Professional Video Editing
- **Academy:** Video & Motion Academy (`video`)
- **Canonical ID:** `video-pro`
- **Old ID:** None
- **Duration:** 4 Months (16 Academic Weeks)
- **Guided Hours:** 160 Guided Hours (Module sum: 12 + 24 + 20 + 16 + 24 + 16 + 16 + 10 + 8 + 6 + 8 = 160h)
- **Selling Price:** Active launch-batch selling fee INR 29,900; proposed regular fee INR 35,900
- **Curriculum Spec:** `docs/course-redesign/video-motion/professional-video-editing-spec.md`
- **Data Source Files:**
  - `data/courses/video-pro.json`
  - `data.js` (target record updated)
  - `nova-skills-109-course-content.json` (target record updated)
- **Projects:** 3 assessed portfolio projects (30s D2C Commercial, YouTube Narrative Documentary, Multi-Cam Fiction Scene)
- **Eligibility Decision:** **COMPLETED — ELIGIBLE FOR RELEASE**

### Course 05: Generative AI Video Production Professional
- **Academy:** Video & Motion Academy (`video`)
- **Canonical ID:** `generative-ai-video-production-professional`
- **Old ID (Alias):** `ai-video-pro`
- **Duration:** 5 Months (20 Academic Weeks)
- **Guided Hours:** 200 Guided Hours (Module sum: 10 + 10 + 20 + 12 + 16 + 12 + 28 + 12 + 24 + 16 + 14 + 6 + 20 = 200h)
- **Selling Price:** Introductory launch-batch selling fee INR 34,900; proposed regular fee INR 39,900
- **Curriculum Spec:** `docs/course-redesign/video-motion/generative-ai-video-production-professional-spec.md`
- **Data Source Files:**
  - `data/courses/generative-ai-video-production-professional.json`
  - Deletion of `data/courses/ai-video-pro.json`
  - `data.js` (target record updated)
  - `nova-skills-109-course-content.json` (target record updated)
- **Projects:** 5 mandatory portfolio projects + 60–90s commercial showreel
- **URL Migration:** Alias `?id=ai-video-pro` maps to `?id=generative-ai-video-production-professional`
- **Eligibility Decision:** **COMPLETED — ELIGIBLE FOR RELEASE**

---

## 4. Already-Live Redesigned Courses (Skipped / Preserved)

| Academy | Course Name | Canonical ID | Duration | Guided Hours | Selling Fee | Deployed Commit |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **AI & Automation** | AI Solutions Engineering & Agentic AI Mastery | `ai-mastery` | 9 Months | 360h | ₹89,900 | `5e5b724` |
| **AI & Automation** | AI Productivity Professional | `ai-productivity` | 3 Months | 120h | ₹19,900 | `5e5b724` |
| **AI & Automation** | AI for Business Professional | `ai-for-business-pro` | 4 Months | 160h | ₹39,900 | `5e5b724` |
| **Digital Marketing** | AI Digital Marketing Strategist | `dm-mastery` | 6 Months | 240h | ₹44,900 | `14c77bb` |
| **Digital Marketing** | AI Digital Marketing Specialist | `dm-professional` | 3 Months | 120h | ₹24,900 | `14c77bb` |
| **Digital Marketing** | Performance Marketing Specialist | `performance-marketing-specialist` | 4 Months | 160h | ₹34,900 | `14c77bb` |
| **Digital Marketing** | E-Commerce Growth Marketing Specialist | `ecommerce-growth-marketing-specialist` | 4 Months | 160h | ₹34,900 | `14c77bb` |
| **Design Academy** | Creative Design Master | `creative-design` | 8 Months | 320h | ₹64,900 | `d9f2c38` |
| **Design Academy** | Graphic Design Professional | `graphic-design-pro` | 4 Months | 160h | ₹29,900 | `d9f2c38` |
| **Design Academy** | UI/UX Design Professional | `uiux-design-pro` | 5 Months | 200h | ₹44,900 | `d9f2c38` |
| **Programming** | Full Stack Programming Foundation | `fullstack-foundation` | 6 Months | 240h | ₹39,999 | `d9f2c38` |
| **Programming** | Python Developer Professional | `python-developer` | 3 Months | 120h | ₹19,999 | `d9f2c38` |
| **Programming** | AI-Assisted Full Stack Web Development | `ai-assisted-full-stack-web-development` | 8 Months | 320h | ₹64,900 | `d9f2c38`, `d5b305d` |

---

## 5. Excluded Changes & Unapproved Overrides

1. **Unapproved Price Hike for `nocode-web-pro`:**
   - INR 24,900 rejected; existing approved price INR 12,999 preserved.
2. **Unapproved Launch Price for `ai-integrated-video-editing-motion-graphics-professional`:**
   - INR 59,900 rejected; approved regular fee INR 69,900 preserved.
3. **Wholesale Overwrite of `data.js` or `nova-skills-109-course-content.json`:**
   - Production fixes (e.g. 71 single-month duration reconciliations, Blender software stack fix) preserved from `origin/main`.
4. **Unreleased / Incomplete Academy Changes:**
   - None. All other 6 academies are certificate offerings preserved in their production state.

---

## 6. Pre-Rendered Edge & Derived Assets Plan
- `scripts/build-course-pages.js`: Add `motion-mastery` and `ai-video-pro` aliases to `COURSE_ALIASES`.
- Run authoritative build script to generate static pre-rendered HTML in `_rendered_courses/` and dictionary in `functions/_rendered_courses.js`.
- Rebuild minified script assets: `js/data.min.js`, `js/components.min.js`, `js/course-detail.min.js`.
