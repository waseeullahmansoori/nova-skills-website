# Nova Skills Website — Final 93-ID Image Integration & Production Release Report

**Website:** https://novaskills.in  
**Repository:** `waseeullahmansoori/nova-skills-website`  
**Baseline `main`:** `0d6aabd13a52a83b16caec383355e850af012147`  
**Integration Branch:** `release/nova-final-image-integration`  
**Production Release Commits on `main`:**
- `501317cbd6d2f08eb620c99c6731d7c6d31753d2` — Initial 7-package consolidated image integration & build rollout (Cloudflare Pages Deployment `a2ff6fc7-73af-4f41-99df-bfe121212380`, Check Run `130583116638`: `success`)
- `1073cf8c3b01adb2af04365ab0926bbbe94ea379` — Course Detail static SSR injection into `_rendered_courses/*.html` & `functions/_rendered_courses.js` + `?v=2.9.0` CDN cache-busting (Cloudflare Pages Deployment `bf78fa26-1728-4722-9902-543bbcc0e182`, Check Run `130633420612`: `success`, Preview URL: `https://bf78fa26.nova-skills-website.pages.dev`)

---

## 1. Authoritative Package Inventory Reconciliation

Source package: `Nova-Skills-Final-7-Packages-Antigravity.zip`  
Non-public audit metadata preserved in: `docs/visual-assets/`  
Public WebP binaries deployed to: `public/assets/nova-images/desktop/` & `public/assets/nova-images/mobile/` (exact `unit-XX/` structure preserved; zero ZIPs, PNG masters, or contact sheets in public paths)  
Central integration registry: `data/visual-assets/nova-image-registry.json` & `data/visual-assets/course-visuals.json`

| Metric | Expected / Declared | Verified Count |
|---|---:|---:|
| Total Excel Placement IDs | 93 | 93 |
| IDs with Included Visuals | 75 | 75 |
| Existing-Source Verification Pending IDs | 10 | 10 |
| No New Image Required IDs | 8 | 8 |
| Reconciliation Check (`75 + 10 + 8`) | 93 | **93** |
| Included Visual Units | 114 | 114 |
| Desktop WebP Files (`RIFF/WEBP`, SHA-256 matched) | 114 | 114 |
| Mobile WebP Files (`RIFF/WEBP`, SHA-256 matched) | 114 | 114 |
| Total Consolidated WebP Files (`114 × 2`) | 228 | **228** |
| Safely Integrated Visual Units (Live DOM / SSR) | — | **102 units (69 IDs)** |
| Excluded Visual Units (Authenticity / Accessibility Policy) | — | **12 units (6 IDs)** |

---

## 2. Authenticity, Accuracy & Integrity Policy Summary

- **Strict Exclusions Enforced (12 visual units across 6 IDs):**
  - `IMG-011` (1 unit): Excluded duplicate text-in-image diagram on Homepage `#journey` in favor of accessible semantic HTML steps.
  - `IMG-013` (4 units): Excluded AI-generated portrait concepts from mentor cards (`#mentors` preserves initials `DM`, `AI`, `DS`, `VM`).
  - `IMG-014` (4 units): Excluded AI-generated graduate portraits from named student testimonials (`#testimonials` preserves initials).
  - `IMG-055` (1 unit): Excluded generated Course Detail mentor portrait to avoid fabricated instructor identities.
  - `IMG-077` (1 unit): Excluded generated mock interview photo from Placements Step 2 (`"No fabricated interviewers or candidates"`).
  - `IMG-084` (1 unit): Excluded AI-generated mock building exterior from Contact (`"Never use mock campus photo"` for Siddharth Nagar Campus).
- **Non-Documentary Editorial Framing:** All AI-generated editorial concept illustrations used in `#why-nova` (`IMG-009`, `IMG-010`), Counselling panels (`IMG-017`, `IMG-085`), Academies (`IMG-022`–`045`), Course Demonstrations (`IMG-056`–`075`), and Placements (`IMG-076`, `IMG-078`, `IMG-079`) use descriptive alt text and truthful conceptual/curriculum-demonstration labels without fabricating student outcomes or real campus claims.
- **Zero Canonical Course Data Changes:** `git diff origin/main -- data/courses/ data.js js/data.js` confirmed zero changes to the 109 courses' prices, durations, titles, modules, or metadata.
- **Zero Academy Hero Regressions:** All 12 Academies preserve exact 2-button CTAs (`Enroll Now →` and `Free Consultation`), zero hero Demo button, and Pan-India live online badges.
- **Zero City Page Regressions:** All 36 `branches/*/index.html` pages preserve `index, follow`, Siddharth Nagar physical campus notices, existing 26 visual / 10 text-first hero split, and zero `Live Projects: 0`.

---

## 3. Build & QA Verification Results

1. **Master Synchronization & Academy Integrity Suites (post-build):**
   - `scripts/verify-109-course-master-sync.js`: **PASSED (0 failures)**
   - `scripts/test-academy-demo-banner.js`: **All 12 Academies PASSED**
   - `scripts/test-sitewide-109-pricing-audit.js`: **29/29 PASSED**
   - `scripts/test-pan-india-mumbai-correction.js`: **49/49 PASSED**
2. **Pre-Push Local Full Suite (`qa_full_visual_suite.js` after SSR fix & `?v=2.9.0` cache-busting):**
   - Static Registry, File Presence & Authenticity Exclusion Audit: **546/546 PASSED**
   - Headless Chrome CDP across 16 representative routes × 5 responsive viewports (`320px`, `390px`, `768px`, `1024px`, `1440px`): **709 PASSED, 0 FAILED** (zero horizontal overflow, zero broken images, interactive lightbox verified, 2-button Academy hero constraint verified).
3. **Edge Functions Bundle Check:**
   - `functions/_rendered_courses.js`: `20.188 MB` raw / `3.382 MB` gzipped (baseline was `20.034 MB` raw / `3.355 MB` gzipped).
4. **Live Production Verification on `https://novaskills.in` (post-deploy of `1073cf8`):**
   - `30/30` live HTML pages returned `HTTP 200`, including Cloudflare Edge middleware pre-rendered courses (`graphic-design-pro` SSR `IMG-057`, `IMG-050`, `IMG-051`, `IMG-053`, `IMG-054`; `ai-mastery` SSR `IMG-059`).
   - `228/228` consolidated WebP assets returned `HTTP 200`, `content-type: image/webp`, and `cache-control: public, max-age=31536000, immutable`.
   - Live Headless Chrome DOM audit on `https://novaskills.in`: **300 PASSED, 0 FAILED** across Homepage (`novaLoaded=10, broken=0`), Digital Marketing Academy (`novaLoaded=2, broken=0`), Communication Academy (`novaLoaded=2, broken=0`), Course Detail `graphic-design-pro` (`novaLoaded=9, broken=0`), Branches Directory (`novaLoaded=1, broken=0`), and Indore City page (`novaLoaded=1, broken=0`).

---

## 4. Complete 93-ID Reconciliation Ledger

| ID | CSV Status | Included Units | Page Group | Excel Placement | Final Outcome | Notes / Policy |
|---|---|---:|---|---|---|---|
| `IMG-001` | Existing-source verification/optimization pending | 0 | Homepage | Hero — 'Build Real Skills, Launch Your Career' | Existing-source verification/optimization pending | KEEP / OPTIMIZE |
| `IMG-002` | Existing-source verification/optimization pending | 0 | Homepage | Choose Your Learning Path — Academy grid | Existing-source verification/optimization pending | REUSE |
| `IMG-003` | Included | 1 | Homepage | Featured Courses — AI Digital Marketing Specialist card | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-004` | Included | 1 | Homepage | Featured Courses — AI Solutions Engineering & Agentic AI Mastery card | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-005` | Included | 1 | Homepage | Featured Courses — Full Stack Programming Foundation card | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-006` | Included | 1 | Homepage | Featured Courses — Creative Design Master card | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-007` | Included | 1 | Homepage | Featured Courses — AI-Integrated Video Editing & Motion Graphics Professional card | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-008` | Included | 1 | Homepage | Featured Courses — AI Digital Marketing Strategist card | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-009` | Included | 1 | Homepage | Why Nova Skills — 1:1 Live Online Classes | INTEGRATED | Integrated as non-documentary editorial concept in #why-nova. |
| `IMG-010` | Included | 1 | Homepage | Why Nova Skills — Practical Projects | INTEGRATED | Integrated as non-documentary editorial concept in #why-nova. |
| `IMG-011` | Included | 1 | Homepage | The Nova Skills Learning Journey | SKIPPED_DUPLICATE_ACCESSIBLE_HTML | Accessibility & semantics rule: Learning Journey already rendered with accessible HTML steps in index.html (#journey). |
| `IMG-012` | Existing-source verification/optimization pending | 0 | Homepage | Real Projects by Real Students — four existing previews | Existing-source verification/optimization pending | KEEP / VERIFY |
| `IMG-013` | Included | 4 | Homepage | Learn From Industry Experts — four mentor cards | SKIPPED_AUTHENTICITY | Authenticity policy: AI-generated portrait concepts excluded from instructor/mentor cards (#mentors keeps verified initials). |
| `IMG-014` | Included | 4 | Homepage | Real Students, Real Transformations — testimonial cards | SKIPPED_AUTHENTICITY | Authenticity policy: AI-generated graduate portraits excluded from named student testimonials (#testimonials keeps initials). |
| `IMG-015` | Existing-source verification/optimization pending | 0 | Homepage | Our Certificates — QR certificate preview | Existing-source verification/optimization pending | KEEP / OPTIMIZE |
| `IMG-016` | Included | 1 | Homepage | How We Get You Hired — ATS resume/portfolio | INTEGRATED | Integrated below placement process steps; no fake hiring or offer claims. |
| `IMG-017` | Included | 1 | Homepage | Free Career Counselling — before form | INTEGRATED | Desktop-only optional side visual (>=1024px) beside counselling CTA; hidden on mobile. |
| `IMG-018` | No new image required | 0 | Homepage | AI Career Advisor — score preview | No new image required | KEEP UI |
| `IMG-019` | No new image required | 0 | Homepage | Our Impact counters | No new image required | NO IMAGE |
| `IMG-020` | Included | 1 | Academy Directory | Top Hero — 12 Academies | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-021` | Existing-source verification/optimization pending | 0 | Academy Directory | 12 Academy category cards | Existing-source verification/optimization pending | REUSE |
| `IMG-022` | Included | 1 | Academy Hero | Digital Marketing — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-023` | Included | 1 | Academy Project Proof | Digital Marketing — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-024` | Included | 1 | Academy Hero | AI & Automation — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-025` | Included | 1 | Academy Project Proof | AI & Automation — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-026` | Included | 1 | Academy Hero | Design — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-027` | Included | 1 | Academy Project Proof | Design — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-028` | Included | 1 | Academy Hero | Programming — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-029` | Included | 1 | Academy Project Proof | Programming — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-030` | Included | 1 | Academy Hero | No-Code Web — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-031` | Included | 1 | Academy Project Proof | No-Code Web — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-032` | Included | 1 | Academy Hero | Video & Motion — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-033` | Included | 1 | Academy Project Proof | Video & Motion — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-034` | Included | 1 | Academy Hero | 3D — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-035` | Included | 1 | Academy Project Proof | 3D — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-036` | Included | 1 | Academy Hero | Career & Freelancing — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-037` | Included | 1 | Academy Project Proof | Career & Freelancing — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-038` | Included | 1 | Academy Hero | Communication — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-039` | Included | 1 | Academy Project Proof | Communication — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-040` | Included | 1 | Academy Hero | Kids Tech — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-041` | Included | 1 | Academy Project Proof | Kids Tech — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-042` | Included | 1 | Academy Hero | Creator — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-043` | Included | 1 | Academy Project Proof | Creator — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-044` | Included | 1 | Academy Hero | Office Productivity — Hero editorial image | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-045` | Included | 1 | Academy Project Proof | Office Productivity — Practical outcome / project strip | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-046` | No new image required | 0 | Academy Shared Template | Visual Career Roadmap (all 12) | No new image required | KEEP UI / OPTIONAL |
| `IMG-047` | No new image required | 0 | Course Catalogue | Catalogue Hero and filters | No new image required | NO IMAGE |
| `IMG-048` | Included | 8 | Course Catalogue | Priority program cards — first 6–8 only | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-049` | No new image required | 0 | Course Catalogue | Category quick filters and badges | No new image required | NO IMAGE |
| `IMG-050` | Included | 1 | Course Detail Shared | Hero beneath title / alongside overview | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-051` | Included | 3 | Course Detail Shared | What You Will Be Able to Build | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-052` | Included | 2 | Course Detail Shared | Detailed Curriculum & Labs (selected modules) | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-053` | Included | 3 | Course Detail Shared | Production Projects & Deliverables | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-054` | Included | 1 | Course Detail Shared | Tools & Modern Toolchains | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-055` | Included | 1 | Course Detail Shared | Mentors & Student Experience | SKIPPED_AUTHENTICITY | Authenticity policy: Course Detail mentor portrait excluded to avoid fabricated trainer personas. |
| `IMG-056` | Included | 2 | Course-Specific Proof | AI Digital Marketing Specialist — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-057` | Included | 2 | Course-Specific Proof | Graphic Design Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-058` | Included | 2 | Course-Specific Proof | Professional Video Editing — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-059` | Included | 2 | Course-Specific Proof | AI Solutions Engineering & Agentic AI Mastery — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-060` | Included | 2 | Course-Specific Proof | AI for Business Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-061` | Included | 2 | Course-Specific Proof | UI/UX Design Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-062` | Included | 2 | Course-Specific Proof | Full Stack Programming Foundation — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-063` | Included | 2 | Course-Specific Proof | Python Developer Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-064` | Included | 2 | Course-Specific Proof | No-Code Website Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-065` | Included | 2 | Course-Specific Proof | E-Commerce Website Mastery — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-066` | Included | 2 | Course-Specific Proof | Creative Design Master — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-067` | Included | 2 | Course-Specific Proof | AI Productivity Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-068` | Included | 2 | Course-Specific Proof | Architectural Visualisation Master — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-069` | Included | 2 | Course-Specific Proof | 3D Visualisation Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-070` | Included | 2 | Course-Specific Proof | Content Creator Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-071` | Included | 2 | Course-Specific Proof | MIS & Business Intelligence Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-072` | Included | 2 | Course-Specific Proof | Future Tech Kids Mastery — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-073` | Included | 2 | Course-Specific Proof | Business English & Personality Development — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-074` | Included | 2 | Course-Specific Proof | Freelancing & Client Acquisition Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-075` | Included | 2 | Course-Specific Proof | Office Productivity Professional — 'See What You'll Build' | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-076` | Included | 1 | Placements | 4-Step Placement Process — ATS Resume & Portfolio | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-077` | Included | 1 | Placements | 1:1 Mock Interviews | SKIPPED_AUTHENTICITY | Authenticity policy: Generated mock interview photograph excluded ("No fabricated interviewers or candidates"). |
| `IMG-078` | Included | 1 | Placements | Hiring Referrals / Career Transition | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-079` | Included | 1 | Placements | Offer & Onboarding | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-080` | Existing-source verification/optimization pending | 0 | Blog | Featured Founder Story | Existing-source verification/optimization pending | KEEP / OPTIMIZE |
| `IMG-081` | Existing-source verification/optimization pending | 0 | Blog | Article listing thumbnail templates | Existing-source verification/optimization pending | KEEP / STANDARDIZE |
| `IMG-082` | Included | 1 | Blog Articles | Long-form career research — skill transition roadmap | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-083` | Included | 2 | Blog Articles | Comparison-style blog inline graphics | INTEGRATED | Integrated safely in responsive <picture> element. |
| `IMG-084` | Included | 1 | Contact | Campus Visit information | SKIPPED_AUTHENTICITY | Authenticity policy: Mock building exterior excluded for real physical Siddharth Nagar campus notice. |
| `IMG-085` | Included | 1 | Contact | Counselling form side-panel | INTEGRATED | Desktop-only optional panel at top of .cro-sidebar (>=961px); omitted on mobile and never obscures inputs. |
| `IMG-086` | No new image required | 0 | Contact | Map / contact route | No new image required | NO IMAGE |
| `IMG-087` | Included | 1 | Locations Directory | Directory Hero: 'Your Next Skill Has No City Limits' | INTEGRATED | Compact 2-column desktop hero visual alongside prominent #city-explorer CTA. |
| `IMG-088` | Existing-source verification/optimization pending | 0 | Locations Directory | Core Professional Programs summary | Existing-source verification/optimization pending | REUSE |
| `IMG-089` | No new image required | 0 | Locations Directory | Find Your Learning Location city cards | No new image required | NO IMAGE |
| `IMG-090` | Existing-source verification/optimization pending | 0 | City Page Template | City Hero — online learning service area | Existing-source verification/optimization pending | KEEP / AUDIT |
| `IMG-091` | Existing-source verification/optimization pending | 0 | City Page Template | Four compulsory program cards | Existing-source verification/optimization pending | REUSE / SELECTIVE |
| `IMG-092` | Included | 1 | City Page Template | Recommended Pathways comparison | INTEGRATED | Compact preview card in Section 04 Recommended Pathways across all 36 city pages; tabs remain uncluttered. |
| `IMG-093` | No new image required | 0 | City Page Template | City stats / 'Live Projects: 0' | No new image required | NO IMAGE |

---

## 5. Complete 114 Visual-Unit Placement Registry

| Composite Key | Page Group | Resolved Canonical Route | Dimensions (Desktop / Mobile) | Desktop WebP Path | Provenance | Status | Target Source Component |
|---|---|---|---|---|---|---|---|
| `IMG-003#unit-01` | Homepage | `/` | 960x720 / 720x540 | `/public/assets/nova-images/desktop/IMG-003.webp` | AI-generated editorial concept | `integrated` | `index.html (#course-dm-pro)` |
| `IMG-004#unit-01` | Homepage | `/` | 960x720 / 720x540 | `/public/assets/nova-images/desktop/IMG-004.webp` | AI-generated editorial concept | `integrated` | `index.html (#course-ai-mastery)` |
| `IMG-005#unit-01` | Homepage | `/` | 960x720 / 720x540 | `/public/assets/nova-images/desktop/IMG-005.webp` | AI-generated editorial concept | `integrated` | `index.html (#course-fullstack)` |
| `IMG-006#unit-01` | Homepage | `/` | 960x720 / 720x540 | `/public/assets/nova-images/desktop/IMG-006.webp` | AI-generated editorial concept | `integrated` | `index.html (#course-design)` |
| `IMG-007#unit-01` | Homepage | `/` | 960x720 / 720x540 | `/public/assets/nova-images/desktop/IMG-007.webp` | AI-generated editorial concept | `integrated` | `index.html (#course-video)` |
| `IMG-008#unit-01` | Homepage | `/` | 960x720 / 720x540 | `/public/assets/nova-images/desktop/IMG-008.webp` | AI-generated editorial concept | `integrated` | `index.html (#course-dm-mastery)` |
| `IMG-009#unit-01` | Homepage | `/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-009.webp` | AI-generated editorial concept | `integrated` | `index.html (#why-nova .why-editorial-grid)` |
| `IMG-010#unit-01` | Homepage | `/` | 1400x1050 / 900x1125 | `/public/assets/nova-images/desktop/IMG-010.webp` | AI-generated editorial concept | `integrated` | `index.html (#why-nova .why-editorial-grid)` |
| `IMG-011#unit-01` | Homepage | `/` | 1600x900 / 800x1400 | `/public/assets/nova-images/desktop/IMG-011.webp` | AI-generated editorial concept | `skipped_duplicate_accessible_html` | `excluded_by_policy` |
| `IMG-013#unit-01` | Homepage | `/` | 800x1000 / 640x800 | `/public/assets/nova-images/desktop/unit-01/IMG-013.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-013#unit-02` | Homepage | `/` | 800x1000 / 640x800 | `/public/assets/nova-images/desktop/unit-02/IMG-013.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-013#unit-03` | Homepage | `/` | 800x1000 / 640x800 | `/public/assets/nova-images/desktop/unit-03/IMG-013.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-013#unit-04` | Homepage | `/` | 800x1000 / 640x800 | `/public/assets/nova-images/desktop/unit-04/IMG-013.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-014#unit-01` | Homepage | `/` | 800x1000 / 640x800 | `/public/assets/nova-images/desktop/unit-01/IMG-014.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-014#unit-02` | Homepage | `/` | 800x1000 / 640x800 | `/public/assets/nova-images/desktop/unit-02/IMG-014.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-014#unit-03` | Homepage | `/` | 800x1000 / 640x800 | `/public/assets/nova-images/desktop/unit-03/IMG-014.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-014#unit-04` | Homepage | `/` | 800x1000 / 640x800 | `/public/assets/nova-images/desktop/unit-04/IMG-014.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-016#unit-01` | Homepage | `/` | 1400x1050 / 800x600 | `/public/assets/nova-images/desktop/IMG-016.webp` | AI-generated editorial concept | `integrated` | `index.html (#placement-process .placement-editorial-preview)` |
| `IMG-017#unit-01` | Homepage | `/` | 1200x900 / 600x800 | `/public/assets/nova-images/desktop/IMG-017.webp` | AI-generated editorial concept | `integrated` | `index.html (#counselling .cta-editorial-panel)` |
| `IMG-020#unit-01` | Academy Directory | `/academies/` | 1600x900 / 900x1125 | `/public/assets/nova-images/desktop/IMG-020.webp` | AI-generated editorial concept | `integrated` | `academies/index.html (.hero .academies-hero-visual)` |
| `IMG-022#unit-01` | Academy Hero | `/academies/digital-marketing/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-022.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/digital-marketing/index.html (#academy-hero-visual-col)` |
| `IMG-023#unit-01` | Academy Project Proof | `/academies/digital-marketing/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-023.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/digital-marketing/index.html (.academy-outcome-strip)` |
| `IMG-024#unit-01` | Academy Hero | `/academies/ai/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-024.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/ai/index.html (#academy-hero-visual-col)` |
| `IMG-025#unit-01` | Academy Project Proof | `/academies/ai/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-025.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/ai/index.html (.academy-outcome-strip)` |
| `IMG-026#unit-01` | Academy Hero | `/academies/design/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-026.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/design/index.html (#academy-hero-visual-col)` |
| `IMG-027#unit-01` | Academy Project Proof | `/academies/design/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-027.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/design/index.html (.academy-outcome-strip)` |
| `IMG-028#unit-01` | Academy Hero | `/academies/programming/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-028.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/programming/index.html (#academy-hero-visual-col)` |
| `IMG-029#unit-01` | Academy Project Proof | `/academies/programming/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-029.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/programming/index.html (.academy-outcome-strip)` |
| `IMG-030#unit-01` | Academy Hero | `/academies/no-code-web/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-030.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/no-code-web/index.html (#academy-hero-visual-col)` |
| `IMG-031#unit-01` | Academy Project Proof | `/academies/no-code-web/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-031.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/no-code-web/index.html (.academy-outcome-strip)` |
| `IMG-032#unit-01` | Academy Hero | `/academies/video-motion/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-032.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/video-motion/index.html (#academy-hero-visual-col)` |
| `IMG-033#unit-01` | Academy Project Proof | `/academies/video-motion/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-033.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/video-motion/index.html (.academy-outcome-strip)` |
| `IMG-034#unit-01` | Academy Hero | `/academies/3d/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-034.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/3d/index.html (#academy-hero-visual-col)` |
| `IMG-035#unit-01` | Academy Project Proof | `/academies/3d/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-035.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/3d/index.html (.academy-outcome-strip)` |
| `IMG-036#unit-01` | Academy Hero | `/academies/career-freelancing/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-036.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/career-freelancing/index.html (#academy-hero-visual-col)` |
| `IMG-037#unit-01` | Academy Project Proof | `/academies/career-freelancing/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-037.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/career-freelancing/index.html (.academy-outcome-strip)` |
| `IMG-038#unit-01` | Academy Hero | `/academies/communication/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-038.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/communication/index.html (#academy-hero-visual-col)` |
| `IMG-039#unit-01` | Academy Project Proof | `/academies/communication/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-039.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/communication/index.html (.academy-outcome-strip)` |
| `IMG-040#unit-01` | Academy Hero | `/academies/kids-tech/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-040.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/kids-tech/index.html (#academy-hero-visual-col)` |
| `IMG-041#unit-01` | Academy Project Proof | `/academies/kids-tech/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-041.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/kids-tech/index.html (.academy-outcome-strip)` |
| `IMG-042#unit-01` | Academy Hero | `/academies/creator/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-042.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/creator/index.html (#academy-hero-visual-col)` |
| `IMG-043#unit-01` | Academy Project Proof | `/academies/creator/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-043.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/creator/index.html (.academy-outcome-strip)` |
| `IMG-044#unit-01` | Academy Hero | `/academies/office-productivity/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-044.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/office-productivity/index.html (#academy-hero-visual-col)` |
| `IMG-045#unit-01` | Academy Project Proof | `/academies/office-productivity/` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-045.webp` | AI-generated editorial concept | `integrated` | `scripts/build-academy-pages.js -> academies/office-productivity/index.html (.academy-outcome-strip)` |
| `IMG-048#unit-01` | Course Catalogue | `/courses.html` | 800x600 / 600x450 | `/public/assets/nova-images/desktop/unit-01/IMG-048.webp` | AI-generated editorial concept | `integrated` | `courses.js & scripts/build-courses-page.js -> courses.html (card: dm-professional)` |
| `IMG-048#unit-02` | Course Catalogue | `/courses.html` | 800x600 / 600x450 | `/public/assets/nova-images/desktop/unit-02/IMG-048.webp` | AI-generated editorial concept | `integrated` | `courses.js & scripts/build-courses-page.js -> courses.html (card: ai-mastery)` |
| `IMG-048#unit-03` | Course Catalogue | `/courses.html` | 800x600 / 600x450 | `/public/assets/nova-images/desktop/unit-03/IMG-048.webp` | AI-generated editorial concept | `integrated` | `courses.js & scripts/build-courses-page.js -> courses.html (card: graphic-design-pro)` |
| `IMG-048#unit-04` | Course Catalogue | `/courses.html` | 800x600 / 600x450 | `/public/assets/nova-images/desktop/unit-04/IMG-048.webp` | AI-generated editorial concept | `integrated` | `courses.js & scripts/build-courses-page.js -> courses.html (card: fullstack-foundation)` |
| `IMG-048#unit-05` | Course Catalogue | `/courses.html` | 800x600 / 600x450 | `/public/assets/nova-images/desktop/unit-05/IMG-048.webp` | AI-generated editorial concept | `integrated` | `courses.js & scripts/build-courses-page.js -> courses.html (card: uiux-design-pro)` |
| `IMG-048#unit-06` | Course Catalogue | `/courses.html` | 800x600 / 600x450 | `/public/assets/nova-images/desktop/unit-06/IMG-048.webp` | AI-generated editorial concept | `integrated` | `courses.js & scripts/build-courses-page.js -> courses.html (card: video-pro)` |
| `IMG-048#unit-07` | Course Catalogue | `/courses.html` | 800x600 / 600x450 | `/public/assets/nova-images/desktop/unit-07/IMG-048.webp` | AI-generated editorial concept | `integrated` | `courses.js & scripts/build-courses-page.js -> courses.html (card: ecommerce-mastery)` |
| `IMG-048#unit-08` | Course Catalogue | `/courses.html` | 800x600 / 600x450 | `/public/assets/nova-images/desktop/unit-08/IMG-048.webp` | AI-generated editorial concept | `integrated` | `courses.js & scripts/build-courses-page.js -> courses.html (card: 3d-viz-pro)` |
| `IMG-050#unit-01` | Course Detail Shared | `/course-detail.html?id=graphic-design-pro` | 1200x750 / 800x600 | `/public/assets/nova-images/desktop/IMG-050.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (graphic-design-pro #overview-section)` |
| `IMG-051#unit-01` | Course Detail Shared | `/course-detail.html?id=graphic-design-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-01/IMG-051.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (graphic-design-pro #build-outcomes-section unit-1)` |
| `IMG-051#unit-02` | Course Detail Shared | `/course-detail.html?id=uiux-design-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-02/IMG-051.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (uiux-design-pro #build-outcomes-section)` |
| `IMG-051#unit-03` | Course Detail Shared | `/course-detail.html?id=graphic-design-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-03/IMG-051.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (graphic-design-pro #build-outcomes-section unit-3)` |
| `IMG-052#unit-01` | Course Detail Shared | `/course-detail.html?id=3d-viz-pro` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-052.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (3d-viz-pro #curriculum-section lab preview)` |
| `IMG-052#unit-02` | Course Detail Shared | `/course-detail.html?id=nocode-web-pro` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-052.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (nocode-web-pro #curriculum-section lab preview)` |
| `IMG-053#unit-01` | Course Detail Shared | `/course-detail.html?id=graphic-design-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-01/IMG-053.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (graphic-design-pro #projects-section unit-1)` |
| `IMG-053#unit-02` | Course Detail Shared | `/course-detail.html?id=graphic-design-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-02/IMG-053.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (graphic-design-pro #projects-section unit-2)` |
| `IMG-053#unit-03` | Course Detail Shared | `/course-detail.html?id=graphic-design-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-03/IMG-053.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (graphic-design-pro #projects-section unit-3)` |
| `IMG-054#unit-01` | Course Detail Shared | `/course-detail.html?id=graphic-design-pro` | 1200x800 / 900x600 | `/public/assets/nova-images/desktop/IMG-054.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (graphic-design-pro #tools-section preview)` |
| `IMG-055#unit-01` | Course Detail Shared | `/course-detail.html?id=graphic-design-pro` | 800x1000 / 640x800 | `/public/assets/nova-images/desktop/IMG-055.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-056#unit-01` | Course-Specific Proof | `/course-detail.html?id=dm-professional` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-056.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (dm-professional #project-showcase-section unit-1)` |
| `IMG-056#unit-02` | Course-Specific Proof | `/course-detail.html?id=dm-professional` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-056.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (dm-professional #project-showcase-section unit-2)` |
| `IMG-057#unit-01` | Course-Specific Proof | `/course-detail.html?id=graphic-design-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-01/IMG-057.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (graphic-design-pro #project-showcase-section unit-1)` |
| `IMG-057#unit-02` | Course-Specific Proof | `/course-detail.html?id=graphic-design-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-02/IMG-057.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (graphic-design-pro #project-showcase-section unit-2)` |
| `IMG-058#unit-01` | Course-Specific Proof | `/course-detail.html?id=video-pro` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-058.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (video-pro #project-showcase-section unit-1)` |
| `IMG-058#unit-02` | Course-Specific Proof | `/course-detail.html?id=video-pro` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-058.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (video-pro #project-showcase-section unit-2)` |
| `IMG-059#unit-01` | Course-Specific Proof | `/course-detail.html?id=ai-mastery` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-059.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (ai-mastery #project-showcase-section unit-1)` |
| `IMG-059#unit-02` | Course-Specific Proof | `/course-detail.html?id=ai-mastery` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-059.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (ai-mastery #project-showcase-section unit-2)` |
| `IMG-060#unit-01` | Course-Specific Proof | `/course-detail.html?id=ai-for-business-pro` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-060.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (ai-for-business-pro #project-showcase-section unit-1)` |
| `IMG-060#unit-02` | Course-Specific Proof | `/course-detail.html?id=ai-for-business-pro` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-060.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (ai-for-business-pro #project-showcase-section unit-2)` |
| `IMG-061#unit-01` | Course-Specific Proof | `/course-detail.html?id=uiux-design-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-01/IMG-061.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (uiux-design-pro #project-showcase-section unit-1)` |
| `IMG-061#unit-02` | Course-Specific Proof | `/course-detail.html?id=uiux-design-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-02/IMG-061.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (uiux-design-pro #project-showcase-section unit-2)` |
| `IMG-062#unit-01` | Course-Specific Proof | `/course-detail.html?id=fullstack-foundation` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-062.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (fullstack-foundation #project-showcase-section unit-1)` |
| `IMG-062#unit-02` | Course-Specific Proof | `/course-detail.html?id=fullstack-foundation` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-062.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (fullstack-foundation #project-showcase-section unit-2)` |
| `IMG-063#unit-01` | Course-Specific Proof | `/course-detail.html?id=python-developer` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-063.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (python-developer #project-showcase-section unit-1)` |
| `IMG-063#unit-02` | Course-Specific Proof | `/course-detail.html?id=python-developer` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-063.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (python-developer #project-showcase-section unit-2)` |
| `IMG-064#unit-01` | Course-Specific Proof | `/course-detail.html?id=nocode-web-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-01/IMG-064.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (nocode-web-pro #project-showcase-section unit-1)` |
| `IMG-064#unit-02` | Course-Specific Proof | `/course-detail.html?id=nocode-web-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-02/IMG-064.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (nocode-web-pro #project-showcase-section unit-2)` |
| `IMG-065#unit-01` | Course-Specific Proof | `/course-detail.html?id=ecommerce-mastery` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-01/IMG-065.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (ecommerce-mastery #project-showcase-section unit-1)` |
| `IMG-065#unit-02` | Course-Specific Proof | `/course-detail.html?id=ecommerce-mastery` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-02/IMG-065.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (ecommerce-mastery #project-showcase-section unit-2)` |
| `IMG-066#unit-01` | Course-Specific Proof | `/course-detail.html?id=creative-design` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-01/IMG-066.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (creative-design #project-showcase-section unit-1)` |
| `IMG-066#unit-02` | Course-Specific Proof | `/course-detail.html?id=creative-design` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-02/IMG-066.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (creative-design #project-showcase-section unit-2)` |
| `IMG-067#unit-01` | Course-Specific Proof | `/course-detail.html?id=ai-productivity` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-067.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (ai-productivity #project-showcase-section unit-1)` |
| `IMG-067#unit-02` | Course-Specific Proof | `/course-detail.html?id=ai-productivity` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-067.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (ai-productivity #project-showcase-section unit-2)` |
| `IMG-068#unit-01` | Course-Specific Proof | `/course-detail.html?id=archviz-mastery` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-01/IMG-068.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (archviz-mastery #project-showcase-section unit-1)` |
| `IMG-068#unit-02` | Course-Specific Proof | `/course-detail.html?id=archviz-mastery` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-02/IMG-068.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (archviz-mastery #project-showcase-section unit-2)` |
| `IMG-069#unit-01` | Course-Specific Proof | `/course-detail.html?id=3d-viz-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-01/IMG-069.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (3d-viz-pro #project-showcase-section unit-1)` |
| `IMG-069#unit-02` | Course-Specific Proof | `/course-detail.html?id=3d-viz-pro` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-02/IMG-069.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (3d-viz-pro #project-showcase-section unit-2)` |
| `IMG-070#unit-01` | Course-Specific Proof | `/course-detail.html?id=content-creator-pro` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-070.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (content-creator-pro #project-showcase-section unit-1)` |
| `IMG-070#unit-02` | Course-Specific Proof | `/course-detail.html?id=content-creator-pro` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-070.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (content-creator-pro #project-showcase-section unit-2)` |
| `IMG-071#unit-01` | Course-Specific Proof | `/course-detail.html?id=biz-productivity` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-071.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (biz-productivity #project-showcase-section unit-1)` |
| `IMG-071#unit-02` | Course-Specific Proof | `/course-detail.html?id=biz-productivity` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-071.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (biz-productivity #project-showcase-section unit-2)` |
| `IMG-072#unit-01` | Course-Specific Proof | `/course-detail.html?id=kids-mastery` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-01/IMG-072.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (kids-mastery #project-showcase-section unit-1)` |
| `IMG-072#unit-02` | Course-Specific Proof | `/course-detail.html?id=kids-mastery` | 1600x1000 / 900x675 | `/public/assets/nova-images/desktop/unit-02/IMG-072.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (kids-mastery #project-showcase-section unit-2)` |
| `IMG-073#unit-01` | Course-Specific Proof | `/course-detail.html?id=business-english` | 1400x1050 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-073.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (business-english #project-showcase-section unit-1)` |
| `IMG-073#unit-02` | Course-Specific Proof | `/course-detail.html?id=business-english` | 1400x1050 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-073.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (business-english #project-showcase-section unit-2)` |
| `IMG-074#unit-01` | Course-Specific Proof | `/course-detail.html?id=freelancing-client-acquisition-professional` | 1400x1050 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-074.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (freelancing-client-acquisition-professional #project-showcase-section unit-1)` |
| `IMG-074#unit-02` | Course-Specific Proof | `/course-detail.html?id=freelancing-client-acquisition-professional` | 1400x1050 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-074.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (freelancing-client-acquisition-professional #project-showcase-section unit-2)` |
| `IMG-075#unit-01` | Course-Specific Proof | `/course-detail.html?id=office-pro` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-01/IMG-075.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (office-pro #project-showcase-section unit-1)` |
| `IMG-075#unit-02` | Course-Specific Proof | `/course-detail.html?id=office-pro` | 1600x900 / 960x540 | `/public/assets/nova-images/desktop/unit-02/IMG-075.webp` | AI-generated editorial concept | `integrated` | `course-detail.js & scripts/build-course-pages.js (office-pro #project-showcase-section unit-2)` |
| `IMG-076#unit-01` | Placements | `/placements.html` | 1400x1050 / 900x675 | `/public/assets/nova-images/desktop/IMG-076.webp` | AI-generated editorial concept | `integrated` | `placements.html (.placement-visual-grid step-1)` |
| `IMG-077#unit-01` | Placements | `/placements` | 1400x1050 / 900x1125 | `/public/assets/nova-images/desktop/IMG-077.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-078#unit-01` | Placements | `/placements.html` | 1400x900 / 800x1100 | `/public/assets/nova-images/desktop/IMG-078.webp` | AI-generated editorial concept | `integrated` | `placements.html (.placement-visual-grid step-3)` |
| `IMG-079#unit-01` | Placements | `/placements.html` | 1200x900 / 800x600 | `/public/assets/nova-images/desktop/IMG-079.webp` | AI-generated editorial concept | `integrated` | `placements.html (.placement-visual-grid step-4)` |
| `IMG-082#unit-01` | Blog Articles | `/blog/ai-skills-future-careers-2027-2030/` | 1400x900 / 900x1100 | `/public/assets/nova-images/desktop/IMG-082.webp` | Original educational diagram | `integrated` | `blog/ai-skills-future-careers-2027-2030/index.html (#11-a-90-day-roadmap-for-beginners-and-career-switchers)` |
| `IMG-083#unit-01` | Blog Articles | `/blog/high-demand-courses-2027-ai-skills-careers/` | 1400x900 / 900x1100 | `/public/assets/nova-images/desktop/unit-01/IMG-083.webp` | Original educational diagram | `integrated` | `blog/high-demand-courses-2027-ai-skills-careers/index.html (#master-comparison)` |
| `IMG-083#unit-02` | Blog Articles | `/blog/high-demand-courses-2027-ai-skills-careers/` | 1400x900 / 900x1100 | `/public/assets/nova-images/desktop/unit-02/IMG-083.webp` | Original educational diagram | `integrated` | `blog/high-demand-courses-2027-ai-skills-careers/index.html (#hybrid-skill-stacks)` |
| `IMG-084#unit-01` | Contact | `/contact/` | 1400x1050 / 900x1125 | `/public/assets/nova-images/desktop/IMG-084.webp` | AI-generated editorial concept | `skipped_authenticity` | `excluded_by_policy` |
| `IMG-085#unit-01` | Contact | `/contact/` | 1200x900 / 900x1125 | `/public/assets/nova-images/desktop/IMG-085.webp` | AI-generated editorial concept | `integrated` | `contact/index.html (.cro-sidebar .contact-editorial-panel)` |
| `IMG-087#unit-01` | Locations Directory | `/branches/` | 1600x1000 / 900x1125 | `/public/assets/nova-images/desktop/IMG-087.webp` | AI-generated editorial concept | `integrated` | `scripts/build-branches-directory.js -> branches/index.html (.loc-hero-grid)` |
| `IMG-092#unit-01` | City Page Template | `/branches/<city-slug>/` | 1200x800 / 900x600 | `/public/assets/nova-images/desktop/IMG-092.webp` | AI-generated editorial concept | `integrated` | `scripts/build-all-city-pages-phaseF.js -> branches/*/index.html (Section 04 Recommended Pathways)` |
