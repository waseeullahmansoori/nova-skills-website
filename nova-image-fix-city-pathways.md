# Nova Skills — City Page `IMG-092` Pathway Relevance Correction Report

**Branch:** `fix/nova-image-postrelease-qa`  
**Audit Companion:** [`nova-city-image-relevance-audit.csv`](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/nova-city-image-relevance-audit.csv)

## 1. Root Cause Identified

In `scripts/build-all-city-pages-phaseF.js`, Section 04 (*Recommended Pathways for `<City>` Learners*) previously injected `<div class="city-pathway-spotlight">` unconditionally across all 36 city pages (`branches/*/index.html`), rendering `/public/assets/nova-images/desktop/IMG-092.webp` (`1200×800`) and `/public/assets/nova-images/mobile/IMG-092.webp` (`900×600`).

Visual inspection of `IMG-092.webp` confirmed it depicts an architectural 3D spatial house model alongside a floor-plan tablet schematic, paired with hardcoded copy claiming learners could specialize in Architectural & 3D Visualization, even on cities whose canonical recommended pathways cover unrelated tracks (for example: Indore recommends `ai-assisted-full-stack-web-development`, `biz-productivity`, `uiux-design-pro`; Vadodara recommends `nocode-web-pro`, `ecommerce-mastery`, `uiux-design-pro`; Margao recommends `youtube-mastery`, `content-creator-pro`).

## 2. Canonical 36-City Pathway Audit

All 36 city records in `data/locations/locations.json`, `data/locations/location-course-mapping.json`, and `P1_CONFIGS` / `P2_CONFIGS` / `P3_CONFIGS` (`10` P1 + `13` P2 + `13` P3) were audited against canonical course IDs in `data.js`:
- **Compulsory Core Programs (all 36 cities):** `dm-professional`, `graphic-design-pro`, `video-pro`, `ai-for-business-pro`
- **3D / Architectural Visualization Courses (`ARCH_3D_COURSE_IDS`):** `3d-viz-pro`, `blender-cert`, `3ds-max-cert`, `v-ray-cert`, `twinmotion-cert`, `cinema-4d-cert`, `unreal-engine-basics`
- **Result:** **0 of 36** cities include any architectural or 3D visualization course in either `additionalCourses` or `decisionTabs`.

## 3. Correction Implemented

1. Updated `scripts/build-all-city-pages-phaseF.js` to add `ARCH_3D_COURSE_IDS` and `resolvePathwaySpotlightHtml(loc, additionalCourses, decisionTabs)`:
   - Renders `.city-pathway-spotlight` (`IMG-092`) **only** when a city's canonical recommended pathways or decision tabs include a 3D/architectural visualization course.
   - Cleanly omits the spotlight container (zero empty wrapper, zero placeholder gaps, zero misleading 3D copy) across all 36 current city pages while keeping all canonical course cards, descriptions, pricing, links, and `decisionTabs` completely unchanged.
2. Preserved `public/assets/nova-images/desktop/IMG-092.webp` and `public/assets/nova-images/mobile/IMG-092.webp` intact on disk in the asset repository (`conditionally_omitted` in `data/visual-assets/nova-image-registry.json`).
3. Also fixed `.city-hero-picture` `sizes` from `(max-width: 768px) 100vw, 440px` to `(max-width: 640px) 92vw, 440px` and set `object-position: 50% 18%` in `css/locations-city.css` (`?v=2.9.1`) so portrait student heroes preserve headroom and `768px` tablets no longer fetch `1.4 MB` desktop PNGs (`896w`) when displaying at `~438px`.
4. Rebuilt all 36 city pages (`node scripts/build-all-city-pages-phaseF.js`) and verified `IMG-092` / `.city-pathway-spotlight` count is `0` across all 36 `branches/*/index.html` files.
