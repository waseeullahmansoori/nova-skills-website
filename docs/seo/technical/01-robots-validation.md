# Nova Skills — Layer 49: Robots.txt Validation Report

**Document ID:** TECH-LAYER-49-ROBOTS  
**Target File:** `https://novaskills.in/robots.txt`  
**Compliance Standard:** RFC 9309 (Robots Exclusion Protocol)  
**Status:** 100% VALIDATED  
**Branch:** development  

---

## 1. Directive Breakdown & Verification

| Directive | Target Pattern | Purpose & Rationale | Status |
| :--- | :--- | :--- | :--- |
| `User-agent: *` | Global | Universal application across all compliant search bots | ✅ PASS |
| `Allow: /` | Global Public Root | Explicitly permits crawling of all standard public routes | ✅ PASS |
| `Disallow: /admin*` | Admin files & folders | Prevents crawling of unauthenticated or administrative scripts | ✅ PASS |
| `Disallow: /login.html` | Auth Gateway | Protects private authentication portal from indexing | ✅ PASS |
| `Disallow: /portal.html` | Student Portal | Protects internal student portal from search crawler access | ✅ PASS |
| `Disallow: /thank-you/` | Conversion Route | Prevents indexing of conversion confirmation pages | ✅ PASS |
| `Disallow: /lead-success/`| Conversion Route | Prevents indexing of lead generation confirmation pages | ✅ PASS |
| `Disallow: /scripts/` | Internal Code | Prevents crawling of build and maintenance scripts | ✅ PASS |
| `Disallow: /.git/` | Version Control | Shields source repository control metadata | ✅ PASS |
| `Sitemap: ...` | https://novaskills.in/sitemap.xml | Directs search engine crawlers to the authoritative XML sitemap | ✅ PASS |

---

## 2. Legacy Redirect Compatibility
- `/robot.txt` (common typo) is permanently 301-redirected to `/robots.txt` via `_redirects`.
