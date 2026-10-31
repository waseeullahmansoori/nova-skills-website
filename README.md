# Nova Skills — Official Website

Official website repository for Nova Skills, an education and professional skills development institute.

🌐 Website: https://novaskills.in

---

## 1. Project Overview

Nova Skills is a premier skill development and professional training institute based in India. The institute delivers career-aligned, practical education designed to equip students and working professionals with modern, in-demand capabilities across technology, design, business operations, and creative media.

This repository powers the official web platform (`https://novaskills.in`), presenting:
- **Comprehensive Training Programs:** Professional diplomas, bootcamps, and foundational certifications.
- **12 Academy Learning Pathways:** Specialized course progressions spanning Digital Marketing, AI & Automation, Design, Programming, No-Code, Video & Motion, 3D Visualization, Career & Freelancing, Communication, Kids Tech, Creator Economy, and Office Productivity.
- **Detailed Curricula & Outcomes:** Module-by-module syllabus breakdowns, evaluated software proficiencies, hands-on capstone project specifications, and assessment standards.
- **Transparent Course Schedules & Fees:** Verified program durations, learning hours, and honest, upfront fee structures with zero artificial discount inflation.
- **Admissions & Student Inquiries:** Direct course enrollment flows, contact routing, and verification portals.

All curriculum information is rigorously verified to represent genuine learning outcomes without unverified claims or exaggerated placement guarantees.

---

## 2. Key Website Features

- **Responsive Multi-Device Layout:** Mobile-first, responsive interface engineered with modern CSS variables, Flexbox, and CSS Grid for fast rendering across smartphones, tablets, laptops, and ultra-wide displays.
- **12 Academy Landing Pages:** Dedicated discovery hubs (`/academies/<academy>/`) with academy-specific value propositions, localized delivery indicators, structured FAQs, and curated course collections.
- **Main Course Catalogue (`/courses`):** High-performance course index featuring 109 pre-rendered course cards, instant search, and real-time multi-attribute filtering (by Academy, Skill Level, Normalized Duration, and Fee Slider).
- **Edge-Rendered Course Detail Architecture (`/course-detail.html?id=<id>`):** Server-side pre-rendered HTML snapshots served via Cloudflare Pages edge middleware with seamless client-side JavaScript hydration for optimal search engine indexability and instant first paint.
- **Transparent & Honest Pricing:** Clear, flat fee displays on certification courses with automated conditional logic that prevents deceptive strikethrough pricing when no genuine discount exists.
- **Structured Lead & Enrollment Routing:** Client-side form validation, modal integration, and direct lead dispatch to Supabase backend services.
- **Advanced Technical SEO, GEO & AEO:** Complete JSON-LD schema graph implementation (`Course`, `CollectionPage`, `BreadcrumbList`, `FAQPage`, `BlogPosting`), canonical URL integrity, automated XML sitemaps, and optimized Open Graph sharing metadata.
- **Editorial & Research Blog Engine:** Static, pre-rendered research publications covering AI workflow trends, practical automation, and future workforce skills (e.g., `/blog/n8n-ai-automation-beginners/` and `/blog/ai-skills-future-careers-2027-2030/`).

---

## 3. Course Catalogue & Data Architecture

Nova Skills maintains a structured curriculum catalog of **109 numbered courses** organized under 12 professional academies:

| Academy | Course ID Range | Focus & Core Tools |
| :--- | :---: | :--- |
| **Digital Marketing Academy** | Courses 1–14 | Performance Marketing, SEO/GEO, Social Media, Google Ads, Meta Ads, GA4 |
| **AI & Automation Academy** | Courses 15–24 | AI Productivity, Prompt Engineering, n8n, Make, AI Agents, LLM Workflows |
| **Design Academy** | Courses 25–34 | Graphic Design, UI/UX, Adobe Photoshop, Illustrator, Figma, Canva Pro |
| **Programming Academy** | Courses 35–44 | Full-Stack Web Dev, Python, JavaScript ES6+, React, Node.js, REST APIs |
| **No-Code & Web Development** | Courses 45–52 | Webflow, WordPress, Shopify, Framer, Elementor Pro, WooCommerce |
| **Video & Motion Graphics** | Courses 53–60 | Premiere Pro, After Effects, DaVinci Resolve, Short-Form Video, GenAI Video |
| **3D & Visualization Academy** | Courses 61–68 | 3ds Max, Blender 3D, V-Ray, Corona, Twinmotion, Unreal Engine 5 |
| **Career & Freelancing** | Courses 69–76 | Upwork, Fiverr, Agency Building, LinkedIn Client Acquisition, Proposals |
| **Communication Academy** | Courses 77–83 | Business English, Spoken Fluency, Public Speaking, Workplace Soft Skills |
| **Kids Tech Academy** | Courses 84–90 | Scratch 3.0, Python for Kids, Robotics, Web Design, AI for Kids |
| **Creator Academy** | Courses 91–97 | YouTube Channel Growth, Content Creation, Thumbnails, Podcasting |
| **Office Productivity Academy** | Courses 98–109 | Advanced Excel, Word, PowerPoint, Google Workspace, Notion, ClickUp, Copilot, TallyPrime |

### The Data Consistency Rule

> **One Course ID → One Approved Course Record → Consistent Data Across the Website.**

The repository enforces a strict single-source-of-truth architecture:
1. **Canonical Source:** `data/courses/<id>.json` contains the verified curriculum specification, syllabus, fees, duration, and tools.
2. **Stable ID Invariant:** Course IDs (e.g., `tally-gst`, `microsoft-excel`, `react-cert`) are permanent canonical keys. Course titles or descriptions must never be used to alter or regenerate a course's stable ID or URL.
3. **Automated Synchronization:** Build scripts compile the runtime registries (`data.js`, `js/data.min.js`), static catalog (`courses.html`), academy pages (`academies/*/index.html`), pre-rendered course HTML (`_rendered_courses/*.html`), and Cloudflare edge function bundles (`functions/_rendered_courses.js`) directly from these canonical records.

---

## 4. Technology Stack

The website is engineered for speed, reliability, and low latency using a modern Jamstack architecture without heavy framework runtime overhead:

- **Frontend Core:** Semantic HTML5, Vanilla CSS3 (Custom CSS Properties, Responsive Grid & Flexbox), Vanilla ECMAScript 6+ JavaScript.
- **Edge & Serverless Infrastructure:** Cloudflare Pages, Cloudflare Pages Edge Functions (`functions/_middleware.js`), custom edge routing (`_routes.json`), cache control headers (`_headers`), and canonical redirect rules (`_redirects`).
- **Database & Lead Backend:** Supabase (PostgreSQL with Row Level Security, Secure Authentication, Lead Intake).
- **Build Tooling & Automation:** Node.js automation scripts located in `scripts/` for static HTML compilation, catalog data synchronization, minification, and sitemap generation.
- **Package Management:** npm (`package.json`).
- **Version Control & CI/CD:** Git, GitHub (`waseeullahmansoori/nova-skills-website`), and Cloudflare Pages Git-integrated continuous deployment.

---

## 5. Project Structure

```text
nova-skills-website/
├── README.md                      # Project documentation and developer guide
├── LICENSE                        # Proprietary software license notice
├── package.json                   # Project metadata and build scripts
├── wrangler.jsonc                 # Cloudflare Pages / Workers configuration
├── _headers                       # Cloudflare HTTP security and caching headers
├── _redirects                     # Cloudflare canonical redirects and URL rewrites
├── _routes.json                   # Cloudflare Pages edge function routing configuration
├── index.html                     # Homepage
├── courses.html                   # Main 109-course searchable catalogue
├── courses.js                     # Client-side catalogue search, filter & modal logic
├── data.js                        # Master client-side course and academy data registry
├── course-detail.html             # Dynamic / hydrated course detail shell
├── course-detail.js               # Client-side hydration script for course pages
├── academy-detail.html            # Academy detail shell
├── academy-detail.js              # Academy client-side logic
├── about.html                     # About Nova Skills
├── contact.html                   # Contact and campus inquiry page
├── placements.html                # Career placement support and partner networks
├── success-stories.html           # Student testimonials and project showcases
├── verify.html                    # Certificate verification portal
├── portal.html                    # Student portal access
├── 404.html                       # Custom 404 error page
├── robots.txt                     # Crawler directives and sitemap declaration
├── sitemap.xml                    # Canonical search engine sitemap
├── styles.css                     # Primary stylesheet
├── styles.min.css                 # Production minified stylesheet
├── academies/                     # Pre-rendered static academy landing pages
│   ├── 3d/index.html
│   ├── ai/index.html
│   ├── career-freelancing/index.html
│   ├── communication/index.html
│   ├── creator/index.html
│   ├── design/index.html
│   ├── digital-marketing/index.html
│   ├── kids-tech/index.html
│   ├── no-code-web/index.html
│   ├── office-productivity/index.html
│   ├── programming/index.html
│   └── video-motion/index.html
├── _rendered_courses/             # Static pre-rendered HTML for all 109 courses
├── blog/                          # Static blog articles and research guides
├── branding content/              # Official Nova Skills SVG vectors and logos
├── css/                           # Supporting component stylesheets
├── data/                          # Authoritative course specifications
│   └── courses/                   # Individual canonical JSON records (<id>.json)
├── functions/                     # Cloudflare Pages edge middleware and bundles
│   ├── _middleware.js             # Edge router intercepting course requests
│   └── _rendered_courses.js       # Pre-rendered course dictionary bundle
├── images/                        # Optimized images, icons, and course thumbnails
├── js/                            # Minified client runtime bundles
│   ├── courses.min.js
│   ├── data.min.js
│   ├── main.min.js
│   └── components.min.js
├── scripts/                       # Build automation, sync scripts, and QA test suites
│   ├── build-academy-pages.js     # Compiles 12 static academy landing pages
│   ├── build-course-pages.js      # Compiles 109 static course pages & edge bundle
│   ├── build-courses-page.js      # Compiles pre-rendered courses.html catalogue
│   ├── build_min_js.js            # Compiles and minifies production JavaScript
│   ├── generate-sitemap.js        # Generates canonical sitemap.xml
│   ├── sync-course-catalog.js     # Synchronizes data.js from data/courses/*.json
│   ├── test-course-data-integrity.js  # 20-gate course data integrity test suite
│   └── validate-seo-implementation.js # 107-point technical SEO validation suite
└── supabase/                      # Database configuration, schema, and migrations
```

---

## 6. Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
- [Git](https://git-scm.com/)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/waseeullahmansoori/nova-skills-website.git
   cd nova-skills-website
   ```

2. Because the application is a high-performance native Jamstack application, no heavy third-party npm package installations are required for standard serving.

3. Start a local development server:
   ```bash
   # Using npx serve (recommended)
   npx serve .

   # Or using Python 3
   python -m http.server 8080

   # Or using Cloudflare Wrangler for full edge function emulation
   npx wrangler pages dev .
   ```

4. Open `http://localhost:3000` (or `http://localhost:8080`) in your browser.

---

## 7. Build and Automation Commands

The project provides npm and Node.js automation scripts defined in [`package.json`](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/package.json):

```bash
# Full Production Build (compiles minified JS and regenerates sitemap)
npm run build

# Minify Client JavaScript Bundles
npm run build:js

# Rebuild 12 Static Academy Landing Pages
npm run build:academies

# Rebuild Main Courses Catalogue Page (courses.html)
npm run build:courses-catalog

# Rebuild All 109 Static Course Pages and Cloudflare Edge Bundle
npm run build:courses-edge

# Regenerate Sitemap (sitemap.xml)
npm run generate:sitemap

# Synchronize Master Runtime Catalog from data/courses/*.json
node scripts/sync-course-catalog.js
```

---

## 8. Course Data Management Workflow

When updating or introducing course information, follow the strict synchronization workflow:

1. **Edit Canonical Specification:** Make all content, fee, duration, or syllabus changes exclusively in the course's canonical JSON file:
   ```text
   data/courses/<course-id>.json
   ```
2. **Preserve Stable ID:** Never rename the file or change the `id` property. The `id` forms the immutable query key for `/course-detail.html?id=<id>`.
3. **Synchronize Catalog:** Run the automated synchronizer to update `data.js` and `nova-skills-109-course-content.json`:
   ```bash
   node scripts/sync-course-catalog.js
   ```
4. **Recompile Static & Edge Assets:**
   ```bash
   node scripts/build-courses-page.js
   node scripts/build-academy-pages.js
   node scripts/build-course-pages.js
   node scripts/build_min_js.js
   ```
5. **Run Quality Assurance Tests:**
   ```bash
   node scripts/test-course-data-integrity.js
   node scripts/validate-seo-implementation.js
   ```

---

## 9. Quality Assurance & Testing

The repository includes comprehensive automated test suites to ensure zero data regressions:

- **Course Data Integrity Suite (`scripts/test-course-data-integrity.js`):**
  Executes **1,336 automated assertions** across 20 validation gates:
  - Verifies exact 109-course count across all registries without missing or duplicate IDs.
  - Enforces exact title, fee, duration, and tool consistency between `data/courses/*.json`, `data.js`, and `courses.html`.
  - Verifies honest pricing rules (zero artificial strikethroughs on flat certifications).
  - Validates pre-rendered HTML files, JSON-LD Course schema, and Cloudflare edge function bundles.
  ```bash
  node scripts/test-course-data-integrity.js
  ```

- **Technical SEO Validation Suite (`scripts/validate-seo-implementation.js`):**
  Executes **107 automated tests** across SEO infrastructure:
  - Validates meta descriptions, canonical URLs, and H1 tags across all 12 academy landing pages.
  - Confirms synchronous canonical updater logic on course detail pages.
  - Validates JSON-LD schema (@graph with FAQPage, Course, BlogPosting, BreadcrumbList).
  - Confirms sitemap completeness and robots directives.
  ```bash
  node scripts/validate-seo-implementation.js
  ```

- **Attribution & AI Search Remediation Tests:**
  ```bash
  npm run test:remediation
  npm run test:attribution
  ```

---

## 10. Git Branching Strategy & Workflow

The repository adheres to a controlled release management process:

### Established Branches

- **`main` (Production):** The production branch directly mapped to Cloudflare Pages. Code on `main` is live at `https://novaskills.in`.
- **`transformation/nova-course-redesign` (Development):** The active development branch for comprehensive curriculum modernizations, major structural refactors, and feature staging.

### Release Discipline

1. **Development & Isolation:** Work is performed on dedicated feature or release branches branched from `main`.
2. **Pre-Release Validation:** All automated tests (`test-course-data-integrity.js`, `validate-seo-implementation.js`) must pass with 0 failures prior to release.
3. **Controlled Integration:** Production releases are executed via clean, non-destructive fast-forward merges or reviewed pull requests to `main`.
4. **No Force-Pushing:** Force-pushing (`git push --force`) to `main` is strictly prohibited.
5. **Post-Release Smoke Testing:** Every production deployment must be verified live on `https://novaskills.in` using cache-busted HTTP requests.

---

## 11. Deployment

- **Hosting Provider:** [Cloudflare Pages](https://pages.cloudflare.com/)
- **Production URL:** `https://novaskills.in`
- **Deployment Trigger:** Automated CI/CD deployment on every Git push to `origin/main`.
- **Build Output Directory:** Root directory (`.`) with serverless edge functions in `functions/`.
- **Routing & Rewrites:** Managed via `_routes.json`, `_headers`, and `_redirects`.
- **Cache Management:** Edge responses utilize strict Cache-Control headers with automated Cloudflare cache purging upon new deployments.

---

## 12. Branding & Visual Identity

The website follows the official Nova Skills brand design guidelines:

| Palette Role | Hex Code | Visual Application |
| :--- | :---: | :--- |
| **Primary Blue** | `#004672` | Primary brand identity, header elements, main calls-to-action |
| **Deep Navy** | `#012B46` | Deep backgrounds, hero sections, high-contrast typography, footers |
| **Ice Blue** | `#EAF3F8` | Light section backgrounds, subtle card containers, border accents |
| **White** | `#FFFFFF` | Core card surfaces, clean content backgrounds, contrast typography |
| **Accent Orange** | `#EF7F1A` | Conversion highlights, badge callouts, high-priority indicators |

Official SVG and PNG logo assets are maintained in the [`branding content/`](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/branding%20content/) directory.

---

## 13. Security & Data Protection

- **No Secrets in Source Control:** Private API keys, database connection strings, service-role secrets, and `.env` files must never be committed. Follow `.gitignore` rules at all times.
- **Database Row Level Security (RLS):** All Supabase database tables use strict RLS policies to restrict unauthorized client access.
- **Student Data Privacy:** Lead capture and enrollment forms sanitize input and transmit records securely via encrypted HTTPS endpoints.
- **Third-Party Resource Auditing:** External scripts and CDNs are strictly evaluated for performance, privacy compliance, and integrity.

---

## 14. License

This repository contains proprietary website source code, course curricula, design assets, and educational materials owned by Nova Skills.

Except where expressly permitted by applicable law or authorized in writing by Nova Skills, unauthorized copying, modification, redistribution, or commercial exploitation is strictly prohibited.

For complete terms, refer to the [`LICENSE`](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/LICENSE) file in the root directory.

---

## 15. Contact & Support

**Nova Skills Institute**  
Campus Location: Siddharth Nagar, Uttar Pradesh - 272153, India  
🌐 Website: https://novaskills.in  
📞 Call / WhatsApp: [+91 9695904440](tel:+919695904440)  
📧 Email: [novaskills.official@gmail.com](mailto:novaskills.official@gmail.com)  
📍 [View Campus on Google Maps](https://maps.app.goo.gl/tgHGkJ2NXf1ckZwS8)
