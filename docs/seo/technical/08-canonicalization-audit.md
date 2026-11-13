# Nova Skills — Layer 56: Canonicalization & URL Hygiene Audit

**Document ID:** TECH-LAYER-56  
**Focus:** Self-Referential Canonical Tags, Course Identity Integrity, Trailing Slash Standardization & 301 Redirect Rules  
**Status:** Approved & Verified  
**Branch:** development  

---

## 1. Architectural Canonical Principles

A single definitive canonical URL must exist for every indexable piece of content to prevent duplicate content dilution, split PageRank, and crawl budget fragmentation.

Nova Skills adheres to strict canonical invariants:
1. **Course Identity Invariant:**  
   Every course is uniquely canonicalized with its explicit query parameter:  
   `https://novaskills.in/course-detail.html?id=[id]`.  
   *CRITICAL INVARIANT:* The query parameter `id` is never stripped or generalized to `/course-detail.html` or redirected to `/courses`. Stripping the ID would collapse 109 distinct courses into a single generic page, destroying search visibility.
2. **Directory & Clean Route Hygiene:**  
   - Dedicated folder-based directories carry a trailing slash: `https://novaskills.in/contact/`, `https://novaskills.in/branches/`, `https://novaskills.in/branches/indore/`.
   - Direct HTML root routes omit the trailing slash and use clean extensionless paths via Cloudflare Pages URL normalization: `https://novaskills.in/courses`, `https://novaskills.in/about`, `https://novaskills.in/placements`.
3. **Protocol & Hostname Enforcement:**  
   - `http://novaskills.in` -> 301 -> `https://novaskills.in` (HSTS enforced).
   - `https://www.novaskills.in` -> 301 -> `https://novaskills.in` (Single apex domain).
4. **Parameter Invariance:**  
   - Tracking parameters (`?utm_source=...`, `?fbclid=...`, `?gclid=...`) have zero impact on canonical tags. The canonical tag always points directly to the clean parameterless URL (or in the case of course detail, strictly retains `?id=[id]`).

---

## 2. Redirect Map Architecture (`_redirects`)

All legacy URLs and extension-based requests are resolved via 1-hop 301 permanent redirects in Cloudflare Pages `_redirects`:
- `/courses.html` -> `/courses` (301)
- `/about.html` -> `/about` (301)
- `/placements.html` -> `/placements` (301)
- `/contact.html` -> `/contact/` (301)
- `/verify.html` -> `/verify-certificate` (301)

Zero redirect chains, zero circular loops, and zero intermediate 302 temporary redirects exist on the site.
