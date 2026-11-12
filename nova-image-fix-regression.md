# Nova Skills — Regression & Strict Exclusion Verification Report

**Branch:** `fix/nova-image-postrelease-qa`

## 1. Strict Exclusion Compliance (P0 Project Authenticity Untouched)

- `git diff origin/main -- index.html` confirms **zero** modifications to Homepage `#projects` (*"Real Projects by Real Students"*), student testimonials (`#testimonials`), faculty/mentor cards (`#mentors`), or existing student project labels/galleries.
- No authenticity disclaimers were added and no existing student project media were deleted.
- Previously excluded authenticity/accessibility assets (`IMG-011`, `IMG-013`, `IMG-014`, `IMG-055`, `IMG-077`, `IMG-084`) remain completely excluded from the DOM/JS bundles while staying safely stored on disk.

## 2. Canonical Course, Pricing & Location Data Parity

- `git diff -- data/courses/ data.js js/data.js`: **0 lines changed** (100% byte-for-byte identical to `origin/main`).
- `node scripts/verify-109-course-master-sync.js`: **PASSED (0 failures)** across all 109 courses and `Course #15` (`nocode-web-pro` at ₹19,900).
- `node scripts/test-sitewide-109-pricing-audit.js`: **29/29 PASSED (0 failures)** across all 48 launch offers, 61 regular-only courses, `_rendered_courses/*.html`, and `functions/_rendered_courses.js`.
- `node scripts/test-academy-demo-banner.js`: **261/261 PASSED (0 failures)** across all 12 academy pages (exact 2 Hero CTAs `Enroll Now + Free Consultation` and separate demo promotional strip preserved).
- `node scripts/test-pan-india-mumbai-correction.js`: **49/49 PASSED (0 failures)** across all 12 academies + desktop/mobile browser CDP verification.
- `node scripts/generate-sitemap.js`: **175 URLs** compiled cleanly with zero errors.
- **City Page Canonical Fee Display Guard (`scripts/build-all-city-pages-phaseF.js`):** Fixed non-offer `nocode-web-pro` (`Course #15`, `offerActive: false`) rendering blank `₹` across 5 cities (`surat`, `vadodara`, `hisar`, `solan`, `kaithal`) by resolving `(effectivePrice || regularPrice || launchPrice)` (`Course Fee: ₹19,900`); verified zero `₹<` matches across all 36 city pages.

## 3. Baseline SEO & Directory Validation Notes (No Regressions Introduced)

- `node scripts/validate-seo.js`: **1086 PASSED, 10 pre-existing baseline failures** (identical to pre-change `main` baseline: `courseMode` undefined on 6 legacy Office courses, `hero` explicit `width`/`height` regex quirk despite `width="440" height="520"` present, `defer` script matcher on `data.min.js`/`components.min.js`, and `_headers` HTTP 103 Early Hints string check). Zero new failures introduced.
- `node scripts/test-locations-directory-phase03.js`: **30 PASSED, 3 pre-existing Phase 03 preview-mode assertions** (Phase 03 checked `noindex, follow` draft guards and zero `/branches/{slug}/` links prior to Phase F production publication; production intentionally uses `index, follow` and live `/branches/{slug}/` links).

## 4. Legacy Assets & 228-File Manifest Reconciliation

- **`nova-image-fix-legacy-assets.csv` (362 non-`nova-images` rows):**
  - `57` `KEEP — VALID EXISTING ASSET`
  - `21` `KEEP — HIGH-QUALITY ORIGINAL`
  - `19` `OPTIMIZE — OVERSIZED ASSET` (documented without destructive regeneration)
  - `6` `REPLACED — LEGACY REFERENCE SUPERSEDED`
  - `47` `UNUSED — VERIFIED NOT REFERENCED` (`7` unreferenced root dev scratch files removed via `git rm`; `0` folders bulk-deleted)
  - `212` `DUPLICATE — IDENTICAL OR REDUNDANT ASSET` (retained safely without bulk directory deletion)
- **`nova-image-fix-228-file-manifest.csv` (228 WebP files):**
  - Stage A Disk SHA-256 & Pixel Verification: **228/228 PASS** (`75` IDs, `114` visual units × 2 = `228` WebPs)
  - Stage C Placement: **202** `RENDERED_IN_DOM` (`68` active IDs / `101` units) + **24** `EXCLUDED_BY_POLICY` (`6` IDs / `12` units) + **2** `CONDITIONALLY_OMITTED_ON_CURRENT_CITIES` (`IMG-092` desktop+mobile).
