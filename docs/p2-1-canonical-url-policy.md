# P2-1 Canonical URL Policy & Architecture Specification

**Website:** Nova Skills (`https://novaskills.in`)  
**Standard:** RFC 6596 (`<link rel="canonical">` Specification)  
**Preferred Origin:** `https://novaskills.in` (HTTPS, non-WWW)  
**Audit Date:** 2026-11-13  
**Status:** Validated & Standardized Across All 191 Website HTML Pages  

---

## 1. Core Principles of Nova Skills Canonical Policy

1. **One Authoritative Origin:**
   - Every canonical tag across every page must use `https://novaskills.in`.
   - Never use `http://`, `www.novaskills.in`, relative URLs (`/courses`), or temporary preview domains (`*.pages.dev`).
2. **Exactly One Canonical Tag Per Indexable Page:**
   - Duplicate or conflicting canonical link tags in the `<head>` are strictly forbidden.
3. **No Canonical to 3xx Redirects or 4xx Errors:**
   - Canonical URLs must always point directly to the final 200 OK destination.
4. **Preserve Content Identifiers / Strip Attribution Parameters:**
   - Query parameters that define page content identity (specifically `?id=COURSE_ID` for course details) are mandatory and preserved.
   - Transient marketing and tracking parameters (`utm_source`, `utm_medium`, `utm_campaign`, `fbclid`, `gclid`) are excluded from canonical URLs.

---

## 2. Page Group Canonical URL Matrix

| Page Classification | URL Convention | Example Canonical Link | Status Code |
|---|---|---|---|
| **Root Homepage** | Clean root with trailing slash | `<link rel="canonical" href="https://novaskills.in/" />` | `200 OK` |
| **Course Catalog** | Clean URL without extension | `<link rel="canonical" href="https://novaskills.in/courses" />` | `200 OK` |
| **Course Details (109 Courses)** | Specific Course ID query preserved | `<link rel="canonical" href="https://novaskills.in/course-detail.html?id=dm-mastery" />` | `200 OK` |
| **Academy Directories** | Directory with trailing slash | `<link rel="canonical" href="https://novaskills.in/academies/digital-marketing/" />` | `200 OK` |
| **Academies Index** | Clean directory root | `<link rel="canonical" href="https://novaskills.in/academies/" />` | `200 OK` |
| **Location Pages (36 Cities)** | Directory with trailing slash | `<link rel="canonical" href="https://novaskills.in/branches/indore/" />` | `200 OK` |
| **Branches Index** | Clean directory root | `<link rel="canonical" href="https://novaskills.in/branches/" />` | `200 OK` |
| **Blog Articles (5 Published)** | Directory with trailing slash | `<link rel="canonical" href="https://novaskills.in/blog/ai-seo-geo-digital-marketing-2026/" />` | `200 OK` |
| **Blog Index** | Clean URL without extension | `<link rel="canonical" href="https://novaskills.in/blog" />` | `200 OK` |
| **Institutional Pages** | Clean URLs without extension | `<link rel="canonical" href="https://novaskills.in/placements" />` | `200 OK` |
| **Interactive Tools** | Clean URLs without extension | `<link rel="canonical" href="https://novaskills.in/assessment" />` | `200 OK` |
| **Legal & Contact Pages** | Directory with trailing slash | `<link rel="canonical" href="https://novaskills.in/privacy-policy/" />` | `200 OK` |
| **404 Error Pages** | Omit canonical tag; send `noindex` | *(Canonical tag removed; `<meta name="robots" content="noindex, nofollow" />`)* | `404 Not Found` |

---

## 3. Critical Course-Detail Canonicalization Mechanics

### The Core Problem
The Nova Skills website serves 109 distinct, restructured courses via a single pre-rendered template route:
`https://novaskills.in/course-detail.html?id={course-id}`

If canonical tags on these pages were collapsed to `https://novaskills.in/course-detail.html` (stripping the `id` parameter), search engine crawlers would treat all 109 individual courses as duplicates of a single page. This would eliminate course-level organic keyword visibility across all search engines.

### The Architectural Solution
1. **Pre-rendered HTML Generation (`scripts/build-course-pages.js`):**
   Every course file in `_rendered_courses/{id}.html` is generated with an immutable canonical tag:
   ```html
   <link rel="canonical" id="page-canonical" href="https://novaskills.in/course-detail.html?id=COURSE_ID" />
   ```
2. **Dynamic Script Stripping:**
   The pre-renderer removes the client-side dynamic canonical script to prevent any post-load race condition or URL corruption.
3. **Missing ID Redirection:**
   If a client or crawler visits `/course-detail.html` or `/course-detail` without an `id` query parameter, Cloudflare Edge middleware issues an immediate HTTP 301 redirect to `https://novaskills.in/courses`.
4. **Client-Side Fallback:**
   In the dynamic template (`course-detail.html`), if JavaScript executes with an ID, it constructs the course-specific canonical; if no ID is present, it points to `/courses`.

---

## 4. Remediation of Canonical-Redirect Loops

During the forensic audit, a subtle loop was identified between Cloudflare Pages Clean URLs and static canonical tags:
- Cloudflare Pages automatically issues an HTTP 308 Permanent Redirect for requests ending in `.html` for root pages (`/placements.html` -> `/placements`).
- The page `placements.html` previously declared `<link rel="canonical" href="https://novaskills.in/placements.html" />`.
- This caused search engine spiders requesting `/placements.html` to be redirected to `/placements`, where the canonical tag pointed back to `/placements.html`.

### Remediation
All static HTML pages in the repository were corrected to point to the clean 200 OK URL:
- `placements.html` -> `https://novaskills.in/placements`
- `blog.html` -> `https://novaskills.in/blog`
- `assessment.html` -> `https://novaskills.in/assessment`
- `success-stories.html` -> `https://novaskills.in/success-stories`
- `verify.html` -> `https://novaskills.in/verify`
- `academy-detail.html` -> `https://novaskills.in/courses`
- `blog-detail.html` -> `https://novaskills.in/blog`

All canonical tags and sitemap entries now match 100% with zero redirect hops.
