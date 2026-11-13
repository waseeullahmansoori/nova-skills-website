# NOVA SKILLS — TECHNICAL SEO AUDIT & INFRASTRUCTURE REPORT
**Task ID:** Phase 2, Layer 4 — Technical SEO Foundation  
**Website:** https://novaskills.in/  
**Environment:** Cloudflare Pages Edge Functions + Static Generation  

---

## 1. DOMAIN & PROTOCOL ARCHITECTURE
- **Protocol:** Strict HTTPS enforced via Cloudflare HSTS (`max-age=31536000; includeSubDomains; preload`).
- **Host Canonicalization:** Single non-WWW canonical hostname (`https://novaskills.in/`). Automatic 308 redirect from `www.novaskills.in` to apex domain.
- **Trailing Slash Standard:**
  - Directory endpoints: `/academies/`, `/branches/`, `/contact/`, `/privacy-policy/` have trailing slashes.
  - Root pages: `/courses`, `/placements`, `/assessment`, `/blog` have no trailing slashes.
  - Course detail URLs: `/course-detail.html?id=<course-id>` preserved without disruption.

## 2. EDGE MIDDLEWARE & CRAWLING DIRECTIVES
- `functions/_middleware.js` handles edge request routing on Cloudflare Pages:
  - Intercepts `/course-detail` and `/course-detail.html` to serve course-specific pre-rendered initial HTML from `functions/_rendered_courses.js`.
  - Redirects missing or blank course IDs to `/courses` (301 Permanent).
  - Automatically resolves course ID aliases and legacy `?course=` query parameters to canonical `?id=` (301 Permanent).
  - Applies environment-aware headers: Production receives `X-Robots-Tag: index, follow`; Preview/Staging receives `X-Robots-Tag: noindex, nofollow`.

## 3. XML SITEMAP & ROBOTS.TXT
- **XML Sitemap:** `https://novaskills.in/sitemap.xml` contains exactly 175 canonical URLs, 0 duplicates, all 200 OK.
- **Robots.txt:** Accessible at `https://novaskills.in/robots.txt`, properly disallows internal/auth paths and references sitemap.

## 4. REDIRECT INTEGRITY
- `_redirects` contains 30 rules; 0 redirect chains, 0 redirect loops.
