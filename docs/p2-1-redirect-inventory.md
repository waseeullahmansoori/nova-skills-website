# P2-1 Technical SEO Redirect Inventory & Rule Register

**Website:** Nova Skills (`https://novaskills.in`)  
**Configuration Layers:** Cloudflare Pages `_redirects` & Cloudflare Pages Functions (`functions/_middleware.js`)  
**Audit Date:** 2026-11-13  
**Status:** 100% Tested & Verified (Zero Loops, Zero Multi-hop Chains)  

---

## 1. Cloudflare Pages Static Redirect Rules (`_redirects`)

All rules in `_redirects` use permanent status codes (301) to consolidate link equity to the preferred canonical destinations.

| Source URL | Destination URL | Status | Reason / Need | Tested Result | SEO Impact |
|---|---|---|---|---|---|
| `/robot.txt` | `/robots.txt` | `301` | Resolves legacy singular robots request | `301 -> 200 OK` (0 hops) | Consolidates crawler traffic |
| `/contact/index.html` | `/contact/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Prevents directory index duplication |
| `/privacy-policy/index.html` | `/privacy-policy/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Prevents directory index duplication |
| `/refund-policy/index.html` | `/refund-policy/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Prevents directory index duplication |
| `/terms-and-conditions/index.html` | `/terms-and-conditions/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Prevents directory index duplication |
| `/thank-you/index.html` | `/thank-you/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Canonical URL cleanliness |
| `/lead-success/index.html` | `/lead-success/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Canonical URL cleanliness |
| `/admin/login/index.html` | `/admin/login/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Canonical URL cleanliness |
| `/blog/waseeullah-mansoori/index.html` | `/blog/waseeullah-mansoori/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Eliminates index.html query variant |
| `/blog/ai-skills-future-careers-2027-2030/index.html` | `/blog/ai-skills-future-careers-2027-2030/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Eliminates index.html query variant |
| `/blog/ai-seo-geo-digital-marketing-2026/index.html` | `/blog/ai-seo-geo-digital-marketing-2026/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Eliminates index.html query variant |
| `/blog/high-demand-courses-2027-ai-skills-careers/index.html` | `/blog/high-demand-courses-2027-ai-skills-careers/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Eliminates index.html query variant |
| `/blog/n8n-ai-automation-beginners/index.html` | `/blog/n8n-ai-automation-beginners/` | `301` | Clean directory URL standard | `301 -> 200 OK` (0 hops) | Eliminates index.html query variant |
| `/courses.html` | `/courses` | `301` | Clean URL standard for root HTML | `301 -> 200 OK` (0 hops) | Eliminates .html duplicate URL |
| `/placements.html` | `/placements` | `301` | Clean URL standard for root HTML | `301 -> 200 OK` (0 hops) | Eliminates .html duplicate URL |
| `/assessment.html` | `/assessment` | `301` | Clean URL standard for root HTML | `301 -> 200 OK` (0 hops) | Eliminates .html duplicate URL |
| `/blog.html` | `/blog` | `301` | Clean URL standard for root HTML | `301 -> 200 OK` (0 hops) | Eliminates .html duplicate URL |
| `/success-stories.html` | `/success-stories` | `301` | Clean URL standard for root HTML | `301 -> 200 OK` (0 hops) | Eliminates .html duplicate URL |
| `/verify.html` | `/verify` | `301` | Clean URL standard for root HTML | `301 -> 200 OK` (0 hops) | Eliminates .html duplicate URL |
| `/academies/nocode` | `/academies/no-code-web/` | `301` | Academy short ID alias migration | `301 -> 200 OK` (0 hops) | Passes equity to full canonical slug |
| `/academies/nocode/` | `/academies/no-code-web/` | `301` | Academy short ID alias migration | `301 -> 200 OK` (0 hops) | Passes equity to full canonical slug |
| `/academies/video` | `/academies/video-motion/` | `301` | Academy short ID alias migration | `301 -> 200 OK` (0 hops) | Passes equity to full canonical slug |
| `/academies/video/` | `/academies/video-motion/` | `301` | Academy short ID alias migration | `301 -> 200 OK` (0 hops) | Passes equity to full canonical slug |
| `/academies/career` | `/academies/career-freelancing/` | `301` | Academy short ID alias migration | `301 -> 200 OK` (0 hops) | Passes equity to full canonical slug |
| `/academies/career/` | `/academies/career-freelancing/` | `301` | Academy short ID alias migration | `301 -> 200 OK` (0 hops) | Passes equity to full canonical slug |
| `/academies/kids` | `/academies/kids-tech/` | `301` | Academy short ID alias migration | `301 -> 200 OK` (0 hops) | Passes equity to full canonical slug |
| `/academies/kids/` | `/academies/kids-tech/` | `301` | Academy short ID alias migration | `301 -> 200 OK` (0 hops) | Passes equity to full canonical slug |
| `/academies/office` | `/academies/office-productivity/` | `301` | Academy short ID alias migration | `301 -> 200 OK` (0 hops) | Passes equity to full canonical slug |
| `/academies/office/` | `/academies/office-productivity/` | `301` | Academy short ID alias migration | `301 -> 200 OK` (0 hops) | Passes equity to full canonical slug |
| `/academies/*` | `/academies/index.html` | `200` | Fallback SPA rewrite for unknown slugs | `200 OK` | Prevents hard 404 on edge routing |

---

## 2. Cloudflare Pages Functions Dynamic Edge Rules (`functions/_middleware.js`)

Edge middleware intercepts all requests on `/course-detail` and `/course-detail.html` before client JavaScript executes:

### A. Missing Course ID Redirection
- **Incoming Request:** `/course-detail.html` or `/course-detail` (without `id` or `course` param)
- **Status Code:** `301 Moved Permanently`
- **Destination:** `https://novaskills.in/courses`
- **Reason:** Users requesting course details without specifying a program belong on the Course Catalog where they can select from all 109 programs. Eliminates duplicate indexation of a generic template.

### B. Extensionless Path Normalization
- **Incoming Request:** `/course-detail?id=dm-mastery`
- **Status Code:** `301 Moved Permanently`
- **Destination:** `https://novaskills.in/course-detail.html?id=dm-mastery`
- **Reason:** Canonical course URLs use the `.html` route. Directs traffic to the canonical URL in a single 301 hop.

### C. Legacy Parameter Migration (`?course=` -> `?id=`)
- **Incoming Request:** `/course-detail.html?course=dm-mastery`
- **Status Code:** `301 Moved Permanently`
- **Destination:** `https://novaskills.in/course-detail.html?id=dm-mastery`
- **Reason:** Unifies query parameter taxonomy on `id`.

### D. Historical Course Alias Migration (19 Aliases)
All historical course slugs are permanently redirected to their canonical course IDs:

| Legacy Course Alias | Canonical Course Target | Status |
|---|---|---|
| `digital-marketing-pro` | `ecommerce-growth-marketing-specialist` | `301` |
| `perf-marketing-pro` | `performance-marketing-specialist` | `301` |
| `dm-master` | `dm-mastery` | `301` |
| `full-stack` | `fullstack-foundation` | `301` |
| `design-mastery` | `creative-design` | `301` |
| `video-editing` | `video-pro` | `301` |
| `digital-marketing` | `dm-mastery` | `301` |
| `ai-master` | `ai-mastery` | `301` |
| `python-dev` | `python-developer` | `301` |
| `ai-web-dev-pro` | `ai-assisted-full-stack-web-development` | `301` |
| `prompt-engineering-mastery` | `prompt-engineering` | `301` |
| `freelance-agency-master` | `agency-building` | `301` |
| `freelance-agency-mastery` | `agency-building` | `301` |
| `freelance-mastery` | `freelancing-client-acquisition-professional` | `301` |
| `freelancing-mastery` | `freelancing-client-acquisition-professional` | `301` |
| `career-launch` | `career-launch-placement-readiness-professional` | `301` |
| `career-launch-program` | `career-launch-placement-readiness-professional` | `301` |
| `motion-mastery` | `ai-integrated-video-editing-motion-graphics-professional` | `301` |
| `ai-video-pro` | `generative-ai-video-production-professional` | `301` |

### E. Attribution Parameter Preservation
When redirects occur in edge middleware, marketing attribution parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) are explicitly preserved and transferred to the destination URL so marketing analytics never loses attribution.

---

## 3. Redirect Graph Verification

- **Total Static Rules:** 30 rules in `_redirects`
- **Redirect Loops Detected:** 0
- **Intermediate Chains (Hops > 1):** 0
- **Automated Verification:** Verified programmatically via `npm run validate:seo` (Suite 5).
