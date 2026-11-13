# NOVA SKILLS — PROGRAMMATIC SEO & LARGE-SCALE PAGE AUDIT
**Task ID:** Phase 2, Layer 8 — Programmatic Landing Page Architecture  
**Target:** 109 Course Detail Pages, 36 Location Pages, 12 Academy Hubs  

---

## 1. ARCHITECTURE & BUILD PIPELINE
Nova Skills utilizes structured JavaScript build scripts to generate high-performing, pre-rendered static HTML pages from canonical data sources:
- `scripts/build-course-pages.js` compiles all 109 course-detail HTML payloads.
- `scripts/build-academy-pages.js` compiles the 12 academy landing hubs.
- `scripts/build-all-city-pages-phaseF.js` compiles the 36 location pages.
- `scripts/generate-sitemap.js` compiles `sitemap.xml`.

## 2. UNIQUE CONTENT SAFEGUARDS AGAINST DOORWAY PAGES
- **Course Detail Pages:** Each course has a completely individualized 14-module syllabus, unique software prerequisites, bespoke capstones, and course-specific FAQs.
- **Location Pages:** Location hubs avoid doorway penalties by featuring localized economic context, localized career opportunities, and an explicit disclosure of Live-Online delivery with physical campus in Siddharth Nagar.
