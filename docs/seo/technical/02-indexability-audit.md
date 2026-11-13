# Nova Skills — Layer 50: Indexability Optimization Audit

**Document ID:** TECH-LAYER-50  
**Focus:** Search Index Eligibility, Meta Robots Directives & Soft 404 Prevention  
**Status:** Approved & Enforced  
**Branch:** development  

---

## 1. Index Control Segregation

Nova Skills strictly separates crawl control (`robots.txt`) from indexing control (`meta name="robots"` and `X-Robots-Tag`):
- **Indexable Public Content:** Contains `<meta name="robots" content="index, follow" />` and is listed in `sitemap.xml`.
- **Private & Lead Conversion Pages:** Serve `X-Robots-Tag: noindex, follow` via Cloudflare Pages `_headers` to ensure lead privacy and prevent search indexing of post-submission states.
- **Edge Prerendered Courses:** Middleware explicitly returns `noindex, nofollow` when served on non-production hostnames (e.g. `*.pages.dev` or local staging), preventing duplicate staging indexing.

---

## 2. Soft 404 Prevention
- Invalid course IDs request via `/course-detail.html?id=invalid-id` trigger an immediate HTTP 404 Not Found response at the edge middleware level rather than returning a 200 OK with an empty UI.
