# NOVA SKILLS — AUTOMATED SEO VALIDATION & CI/CD PIPELINE (PHASE 8)

**Document ID:** NOVA-SEO-PHASE8-AUTOMATION  
**Status:** Operational & Enforced in CI/CD  
**Date:** November 2026  
**Auditor:** Nova Skills Platform & Quality Engineering Team

---

## 1. PURPOSE & ARCHITECTURAL OVERVIEW

To maintain 100% technical SEO integrity, structured data compliance, and prevent regression across Nova Skills' 190 discovered routes (109 courses, 12 academies, 36 learning locations, 5 blog articles, and core hubs), Nova Skills enforces an automated multi-suite test harness executed before every commit, pull request, and deployment.

```mermaid
flowchart TD
    Git[Git Commit / PR Trigger] --> Suite1[Suite 1: validate:seo (450 tests)]
    Git --> Suite2[Suite 2: validate:courses & pricing]
    Git --> Suite3[Suite 3: validate:contact & credibility]
    Git --> Suite4[Suite 4: validate:costs & refunds]
    Git --> Suite5[Suite 5: validate:placements]
    
    Suite1 --> Build[npm run build: Compilation & Edge Bundling]
    Suite2 --> Build
    Suite3 --> Build
    Suite4 --> Build
    Suite5 --> Build
    
    Build --> Cloudflare[Deploy to Cloudflare Pages Production]
    Cloudflare --> LiveVerify[Live HTTP Header & CF-RAY Verification]
```

---

## 2. AUTOMATED TEST SUITES MATRIX

| Script / Command | Primary SEO Scope | Assertions / Coverage | Failure Action |
| :--- | :--- | :--- | :--- |
| `npm run validate:seo` | Sitemaps, robots.txt, canonicals, 301 redirects, DNS GSC token | 450/450 tests passing | Deployment Blocked |
| `npm run validate:courses` | 109 courses data integrity, slug parity, academy mappings | 109 published courses validated | Deployment Blocked |
| `npm run validate:pricing` | Strict ₹2,900 starting price, GST disclosures, EMI disclosures | Sitewide pricing audit | Deployment Blocked |
| `npm run validate:contact` | Phone +91 9695904440 & WhatsApp 919695904440 CTAs | All buttons, links, floating CTAs | Deployment Blocked |
| `npm run validate:credibility` | Mentors, faculty credentials, Siddharth Nagar single campus | Entity verification | Deployment Blocked |
| `npm run validate:costs` | Mandatory fee breakdown, zero hidden admission charges | Student protection compliance | Deployment Blocked |
| `npm run validate:refunds` | 14-day policy disclosure, batch transfer terms | Consumer protection compliance | Deployment Blocked |
| `npm run validate:placements` | Zero employment guarantees, ethical placement assistance | Truth-in-advertising compliance | Deployment Blocked |
| `npm run test:forms` | Lead capture forms, enquiry modals, source tracking | Lead conversion integrity | Deployment Blocked |
| `npm run test:analytics` | GA4 dataLayer events, lead tracking, conversion signals | Analytics data integrity | Deployment Blocked |
| `npm run test:crm` | Webhook payloads, CRM lead ingestion, error fallbacks | Commercial pipeline integrity | Deployment Blocked |

---

## 3. EDGE PRE-RENDERING & CANONICAL ASSURANCE

1. **Static Edge Pre-rendering:** `scripts/build-course-pages.js` compiles all 109 course detail pages to `_rendered_courses/<id>.html` and a unified Cloudflare Workers/Pages edge bundle (`functions/_rendered_courses.js`).
2. **Title Length Constraints:** Enforced strictly at `<= 60` characters (HTML-safe) to eliminate SERP truncation while appending `| Nova Skills`.
3. **Canonical Self-Referencing:** Every course page declares its self-referential canonical URL `https://novaskills.in/course-detail.html?id=<course-id>`.
4. **Internal Link Invariants:** Automated link graph assertions verify that every sitemap URL maintains at least 1 static inbound internal link (`0 orphans permitted`).

---

## 4. REGRESSION PREVENTION WORKFLOW

Developers working on Nova Skills adhere to the following command pipeline:
```bash
# 1. Rebuild data and compile assets
npm run build

# 2. Run all technical SEO and compliance validations
npm run validate:seo
npm run validate:courses
npm run validate:pricing
npm run validate:contact
npm run validate:credibility
npm run validate:costs
npm run validate:refunds
npm run validate:placements

# 3. Test conversion and telemetry pipelines
npm run test:forms
npm run test:analytics
npm run test:crm
```
