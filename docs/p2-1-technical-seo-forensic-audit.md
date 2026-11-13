# P2-1 Technical SEO Forensic Audit & Architecture Report

**Project:** Nova Skills Education Institute  
**Task ID:** P2-1  
**Category:** Crawlability / Indexability / URL Architecture / Technical SEO  
**Target Branch:** `development`  
**Execution Date:** 2026-11-13  
**Status:** Completed & Validated (450/450 Checks Passed)  

---

## 1. Executive Summary

A forensic technical SEO audit of the Nova Skills repository and live hosting infrastructure was executed to establish an authoritative crawl and indexing baseline. The audit encompassed live HTTP responses, Cloudflare edge middleware, DNS records, XML sitemap generation, root robots configuration, canonical URL tags, and Cloudflare Pages redirect rules.

### Key Discoveries & Resolutions
1. **Live Production Canonical Origin:**
   - Authoritative origin verified as `https://novaskills.in` (HTTPS, non-WWW).
   - DNS resolution confirmed on Cloudflare Anycast IPs (`104.21.52.67`, `172.67.196.83`, IPv6 `2606:4700:3032::6815:3443`, `2606:4700:3033::ac43:c453`).
   - Hostname `www.novaskills.in` permanently redirects (301) to `https://novaskills.in/`.
2. **Search Console & Bing Verification:**
   - Live DNS TXT lookup confirmed active Google Search Console domain verification:
     `google-site-verification=79ZkniXTuWvDpRXaAeun158piQ2cnH44YewXdFdG25E`.
   - Verified that no separate HTML verification file or unverified third-party token is needed in the repository.
3. **XML Sitemap Baseline:**
   - Canonical sitemap contains exactly **175 eligible, indexable public URLs** across 8 distinct page categories.
   - All 109 published course-detail pages retain their unique query parameter `?id=COURSE_ID` (`https://novaskills.in/course-detail.html?id=...`).
   - Replaced fabricated `today` dates with actual filesystem modification dates (`getFormattedDate`) for accurate `lastmod` tracking.
   - Excluded all non-indexable, administrative, student, portal, and conversion confirmation routes.
4. **Cloudflare Clean URLs & Canonical Alignment:**
   - Cloudflare Pages automatically 308-redirects root `.html` files to clean URLs (e.g. `/courses.html` -> `/courses`, `/placements.html` -> `/placements`).
   - Previously, several HTML pages (`placements.html`, `blog.html`, `assessment.html`, `success-stories.html`, `verify.html`) declared canonical URLs containing `.html`, creating a potential canonical-redirect loop.
   - Standardized all canonical tags to point to the final clean URLs (e.g. `https://novaskills.in/placements`).
5. **Edge Middleware Course Canonicalization & Preview Safeguards:**
   - Course detail middleware (`functions/_middleware.js`) was updated to permanently redirect (301) bare requests without a course ID (`/course-detail.html` or `/course-detail`) to the Course Catalog (`https://novaskills.in/courses`).
   - Legacy course query parameters (e.g. `?course=...`) and historical course aliases (e.g. `?id=digital-marketing`) now issue permanent 301 redirects to canonical course IDs (`?id=dm-mastery`).
   - Development and preview deployments (`*.pages.dev`) are programmatically protected with `X-Robots-Tag: noindex, nofollow`, while production requests (`novaskills.in`) serve `X-Robots-Tag: index, follow`.
6. **Robots Exclusion Protocol:**
   - Root `robots.txt` updated to reference `Sitemap: https://novaskills.in/sitemap.xml`, allow general crawling, ensure rendering assets (CSS, JS, images, fonts) are crawlable, and cleanly disallow private administrative routes, student portals, and lead conversion confirmation pages (`/thank-you/`, `/lead-success/`).
   - Legacy singular `/robot.txt` route mapped via 301 redirect in `_redirects`.

---

## 2. Live HTTP Response Probing Matrix

Network probing was performed directly against the live production origin `https://novaskills.in` and its hostname/protocol variants:

| Endpoint Tested | Initial HTTP Status | Final Destination | Final HTTP Status | Headers & Content-Type | Evaluation |
|---|---|---|---|---|---|
| `https://novaskills.in/` | `200 OK` | `https://novaskills.in/` | `200 OK` | `server: cloudflare`, `content-type: text/html; charset=utf-8` | Canonical production homepage |
| `http://novaskills.in/` | `301 Moved Permanently` | `https://novaskills.in/` | `200 OK` | `Location: https://novaskills.in/` | Clean 1-hop HTTPS enforcement |
| `https://www.novaskills.in/` | `301 Moved Permanently` | `https://novaskills.in/` | `200 OK` | `Location: https://novaskills.in/` | Clean 1-hop non-WWW enforcement |
| `http://www.novaskills.in/` | `301 Moved Permanently` | `https://novaskills.in/` | `200 OK` | `Location: https://www.novaskills.in/` -> `https://novaskills.in/` | 2-hop Cloudflare edge redirect chain |
| `https://novaskills.in/sitemap.xml` | `200 OK` | `https://novaskills.in/sitemap.xml` | `200 OK` | `content-type: application/xml; charset=utf-8`, 175 URLs | Valid, accessible XML sitemap |
| `https://novaskills.in/robots.txt` | `200 OK` | `https://novaskills.in/robots.txt` | `200 OK` | `content-type: text/plain; charset=utf-8` | Valid, accessible robots protocol |
| `https://novaskills.in/robot.txt` | `404 Not Found` | N/A | `404 Not Found` | Cloudflare 404 response | Handled via repository `_redirects` 301 |
| `https://novaskills.in/courses` | `200 OK` | `https://novaskills.in/courses` | `200 OK` | Clean URL standard | Canonical course catalog |
| `https://novaskills.in/courses.html` | `308 Permanent Redirect` | `https://novaskills.in/courses` | `200 OK` | Cloudflare Pages Clean URLs | Explicit 301 rule added to `_redirects` |
| `https://novaskills.in/course-detail.html?id=dm-mastery` | `200 OK` | `https://novaskills.in/course-detail.html?id=dm-mastery` | `200 OK` | `X-Robots-Tag: index, follow` | Pre-rendered edge response |
| `https://novaskills.in/course-detail.html?id=invalid-id` | `404 Not Found` | `https://novaskills.in/course-detail.html?id=invalid-id` | `404 Not Found` | `X-Robots-Tag: noindex, follow` | Edge 404 handler |

---

## 3. URL Architecture & Taxonomy

Nova Skills adheres to a strict 4-tier URL hierarchy:

```
https://novaskills.in/ (Homepage)
├── /courses (Catalog - Clean URL)
│   └── /course-detail.html?id={course-slug} (109 published course pages with preserved query param)
├── /academies/ (Directory)
│   └── /academies/{academy-slug}/ (12 Academy Landing Pages with trailing slash)
├── /branches/ (Directory)
│   └── /branches/{city-slug}/ (36 Location Landing Pages with trailing slash)
├── /blog/ (Directory)
│   └── /blog/{article-slug}/ (5 Published Blog Articles with trailing slash)
└── Public Institutional Pages (Clean URLs)
    ├── /placements
    ├── /assessment
    ├── /success-stories
    ├── /verify
    ├── /contact/
    ├── /privacy-policy/
    ├── /refund-policy/
    └── /terms-and-conditions/
```

---

## 4. Modified Files & Components

The following files were modified or created under Task P2-1:

1. `_redirects` — Added `/robot.txt` -> `/robots.txt` 301 rule, clean URL redirects for root HTML files, and academy alias mappings.
2. `robots.txt` — Added explicit disallow directives for private portals (`/admin/`, `/portal.html`, `/register.html`, `/ai-chat.html`) and conversion confirmation routes (`/thank-you/`, `/lead-success/`).
3. `scripts/generate-sitemap.js` — Refactored to dynamically scan blog articles and branches, load published courses from `NovaCourseData`, and output accurate filesystem `lastmod` dates.
4. `sitemap.xml` — Generated fresh, authoritative 175-URL sitemap.
5. `scripts/build-course-pages.js` — Updated `generateNotFoundHtml` to remove misleading canonical tags on 404 pages and updated `functions/_middleware.js` generation with alias redirects, missing ID redirects, and preview `noindex` safeguards.
6. `functions/_middleware.js` — Regenerated with robust edge routing.
7. `course-detail.html` — Updated client fallback canonical to `/courses`.
8. `placements.html` — Updated canonical and `og:url` to `https://novaskills.in/placements`.
9. `blog.html` — Updated canonical and `og:url` to `https://novaskills.in/blog`.
10. `assessment.html` — Updated canonical and `og:url` to `https://novaskills.in/assessment`.
11. `success-stories.html` — Updated canonical and `og:url` to `https://novaskills.in/success-stories`.
12. `verify.html` — Updated canonical and `og:url` to `https://novaskills.in/verify`.
13. `academy-detail.html` — Updated fallback canonical to `/courses`.
14. `blog-detail.html` — Updated fallback canonical to `/blog` and added `noindex, follow`.
15. `404.html` — Added `<meta name="robots" content="noindex, nofollow" />` and removed misleading canonical tag.
16. `package.json` — Registered `"validate:seo": "node scripts/validate-technical-seo.js"`.
17. `scripts/validate-technical-seo.js` — Comprehensive 450-point automated SEO test suite.
