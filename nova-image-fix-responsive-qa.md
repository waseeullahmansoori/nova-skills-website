# Nova Skills — 8-Viewport Responsive Image & Performance QA Report

**Branch:** `fix/nova-image-postrelease-qa`  
**Viewports Tested Across All 30 Target Routes:** `320px`, `360px`, `390px`, `414px`, `768px`, `1024px`, `1280px`, `1440px` (`240` viewport checks + fresh mobile `390px`, tablet `768px`, and desktop `1440px` network-captured navigations in headless Chrome CDP with cache disabled).

## 1. Routes Verified

- `/` (Homepage — P0 `"Real Projects by Real Students"` section preserved verbatim)
- `/academies/` (Academies Directory — `IMG-020`)
- All 12 Academy Pages (`/academies/digital-marketing/`, `/academies/ai/`, `/academies/programming/`, `/academies/no-code-web/`, `/academies/design/`, `/academies/video-motion/`, `/academies/creator/`, `/academies/3d/`, `/academies/office-productivity/`, `/academies/communication/`, `/academies/career-freelancing/`, `/academies/kids-tech/` — all preserving exact 2 Hero CTAs `Enroll Now + Free Consultation` and separate Free Demo strip)
- `/courses.html` (`IMG-048` units 01–08)
- `/course-detail.html?id={graphic-design-pro, dm-professional, ai-mastery, 3d-viz-pro, office-pro}`
- `/placements.html`, `/contact/`, `/blog/ai-skills-future-careers-2027-2030/`, `/blog/high-demand-courses-2027-ai-skills-careers/`
- `/branches/` & `/branches/{indore, vadodara, margao, nashik, basti}/`

## 2. Pre-Fix Issues Detected & Corrected

1. **Homepage Hero Double Preload Fetch (`index.html` line 84):**
   - *Before:* `<link rel="preload" as="image" href="/public/images/hero/hero-student-800.avif" media="(min-width: 769px)">` lacked `imagesrcset`/`imagesizes`. At `1440px` (1x DPR), `<picture>` selected `hero-student-600.avif` (`sizes` resolved to `440px`), causing Chrome to fetch **both** `hero-student-800.avif` and `hero-student-600.avif`.
   - *Fix:* Added `imagesrcset` (400w/600w/800w/1200w) and `imagesizes="(max-width: 640px) 300px, (max-width: 1024px) 360px, 440px"` while retaining `href="/public/images/hero/hero-student-800.avif"` for validator parity.
   - *After:* Desktop `1440px` fetches only `['/public/images/hero/hero-student-600.avif']` (zero duplicate preload fetch).
2. **Academies Directory Mobile `4:5` Squash (`academies/index.html` line 312):**
   - *Before:* `@media (max-width: 640px)` forced `.academies-hero-visual img` to `max-height: 280px` at full width, squashing `900×1125` (`4:5`) `mobile/IMG-020.webp` to `348×280` (`skew = 0.356`).
   - *Fix:* Constrained mobile wrapper `.academies-hero-visual` to `max-width: 340px; margin: 0 auto; width: 100%;` and removed `max-height: 280px` with `object-position: 50% 20%`.
   - *After:* At `390px`, `mobile/IMG-020.webp` renders cleanly at `338×423` (`skew = 0.001`).
3. **City Page Tablet `768px` Oversized PNG Fetch & Portrait Headroom (`scripts/build-all-city-pages-phaseF.js`, `css/locations-city.css`):**
   - *Before:* `.city-hero-picture` used `sizes="(max-width: 768px) 100vw, 440px"`, causing `768px` tablets (`~438px` rendered) to download the `1,416 KB` `896w.png` desktop asset instead of `600w.png` (`673 KB`), while center `object-position` risked cropping tall subjects.
   - *Fix:* Updated `sizes` to `(max-width: 640px) 92vw, 440px`, bumped `locations-city.css?v=2.9.1`, and set `object-position: 50% 18%`.
4. **Course Detail Closed Lightbox State & Card Framing (`css/course-detail.css`):**
   - *Before:* Closed `.project-lightbox` relied only on `opacity: 0; pointer-events: none`, leaving empty `<img id="project-lightbox-img">` exposed in visibility checks, and `.project-img-wrap img` used default `50% 50%` crop positioning.
   - *Fix:* Added `visibility: hidden` (`.active { visibility: visible; }`), set `object-position: center 25%` on `.project-img-wrap img`, bumped `course-detail.css?v=2.9.1`, and rebuilt all 109 `_rendered_courses/*.html` + `functions/_rendered_courses.js`.
5. **Branches Directory Thumbnail Crop Framing (`css/locations-directory.css`):**
   - *Fix:* Set `object-position: 50% 18%` on `.loc-pathway-preview-img` and `.loc-discovery-card-thumb img`, bumped `locations-directory.css?v=2.9.1`, and rebuilt `branches/index.html`.
6. **Desktop-Only Hidden Panel Guards Verified:**
   - Verified `#counselling` (`IMG-017` on `/`) and `.contact-editorial-panel` (`IMG-085` on `/contact/`) remain `display: none` under `<1024px` / `<961px` and do **not** download on mobile/tablet (`390px`, `768px`).

## 3. Post-Fix Summary Metrics

- Horizontal overflow (`scrollWidth > innerWidth`) across **all 30 routes × 8 viewports (`320`–`1440px`)**: **0**.
- Broken visible images (`naturalWidth === 0`) across all 30 routes: **0**.
- Mobile `390px` selecting `/nova-images/desktop/`: **0**.
- Desktop `1440px` selecting `/nova-images/mobile/`: **0**.
- Above-the-fold Hero `<img>` with `loading="lazy"`: **0**.
