/**
 * scripts/build-phase8-9-docs.js
 * Generates docs/seo/22-automated-seo-validation.md and docs/seo/23-monthly-seo-performance-framework.md
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SEO_DIR = path.join(ROOT_DIR, 'docs', 'seo');

const doc22 = `# NOVA SKILLS — AUTOMATED SEO VALIDATION & CI/CD PIPELINE (PHASE 8)

**Document ID:** NOVA-SEO-PHASE8-AUTOMATION  
**Status:** Operational & Enforced in CI/CD  
**Date:** November 2026  
**Auditor:** Nova Skills Platform & Quality Engineering Team

---

## 1. PURPOSE & ARCHITECTURAL OVERVIEW

To maintain 100% technical SEO integrity, structured data compliance, and prevent regression across Nova Skills' 190 discovered routes (109 courses, 12 academies, 36 learning locations, 5 blog articles, and core hubs), Nova Skills enforces an automated multi-suite test harness executed before every commit, pull request, and deployment.

\`\`\`mermaid
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
\`\`\`

---

## 2. AUTOMATED TEST SUITES MATRIX

| Script / Command | Primary SEO Scope | Assertions / Coverage | Failure Action |
| :--- | :--- | :--- | :--- |
| \`npm run validate:seo\` | Sitemaps, robots.txt, canonicals, 301 redirects, DNS GSC token | 450/450 tests passing | Deployment Blocked |
| \`npm run validate:courses\` | 109 courses data integrity, slug parity, academy mappings | 109 published courses validated | Deployment Blocked |
| \`npm run validate:pricing\` | Strict ₹2,900 starting price, GST disclosures, EMI disclosures | Sitewide pricing audit | Deployment Blocked |
| \`npm run validate:contact\` | Phone +91 9695904440 & WhatsApp 919695904440 CTAs | All buttons, links, floating CTAs | Deployment Blocked |
| \`npm run validate:credibility\` | Mentors, faculty credentials, Siddharth Nagar single campus | Entity verification | Deployment Blocked |
| \`npm run validate:costs\` | Mandatory fee breakdown, zero hidden admission charges | Student protection compliance | Deployment Blocked |
| \`npm run validate:refunds\` | 14-day policy disclosure, batch transfer terms | Consumer protection compliance | Deployment Blocked |
| \`npm run validate:placements\` | Zero employment guarantees, ethical placement assistance | Truth-in-advertising compliance | Deployment Blocked |
| \`npm run test:forms\` | Lead capture forms, enquiry modals, source tracking | Lead conversion integrity | Deployment Blocked |
| \`npm run test:analytics\` | GA4 dataLayer events, lead tracking, conversion signals | Analytics data integrity | Deployment Blocked |
| \`npm run test:crm\` | Webhook payloads, CRM lead ingestion, error fallbacks | Commercial pipeline integrity | Deployment Blocked |

---

## 3. EDGE PRE-RENDERING & CANONICAL ASSURANCE

1. **Static Edge Pre-rendering:** \`scripts/build-course-pages.js\` compiles all 109 course detail pages to \`_rendered_courses/<id>.html\` and a unified Cloudflare Workers/Pages edge bundle (\`functions/_rendered_courses.js\`).
2. **Title Length Constraints:** Enforced strictly at \`<= 60\` characters (HTML-safe) to eliminate SERP truncation while appending \`| Nova Skills\`.
3. **Canonical Self-Referencing:** Every course page declares its self-referential canonical URL \`https://novaskills.in/course-detail.html?id=<course-id>\`.
4. **Internal Link Invariants:** Automated link graph assertions verify that every sitemap URL maintains at least 1 static inbound internal link (\`0 orphans permitted\`).

---

## 4. REGRESSION PREVENTION WORKFLOW

Developers working on Nova Skills adhere to the following command pipeline:
\`\`\`bash
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
\`\`\`
`;

const doc23 = `# NOVA SKILLS — MONTHLY SEO PERFORMANCE & MEASUREMENT FRAMEWORK (PHASE 9)

**Document ID:** NOVA-SEO-PHASE9-MEASUREMENT  
**Frequency:** Monthly Cadence + Weekly Health Checks  
**Date:** November 2026  
**Auditor:** Nova Skills Organic Growth & Search Analytics Team

---

## 1. PERFORMANCE TRACKING OBJECTIVES

To monitor the organic growth, keyword rankings, technical health, conversion rates, and AI search visibility resulting from the 20-Layer SEO Transformation across Nova Skills' 190 URLs.

\`\`\`mermaid
flowchart LR
    GSC[Google Search Console: Impressions, Clicks, Avg Position] --> Engine[Monthly SEO Health Scorecard]
    GA4[Google Analytics 4: Sessions, Lead Enquiries, Demo Bookings] --> Engine
    Bing[Bing Webmaster Tools: Indexation & Crawl Health] --> Engine
    AIVis[AI Search Platforms: SearchGPT, Perplexity, Gemini, Claude] --> Engine
    Engine --> Actions[Optimization Backlog & Content Sprints]
\`\`\`

---

## 2. CORE KPI FRAMEWORK

| Domain | Primary KPI | Measurement Source | Target / Benchmark |
| :--- | :--- | :--- | :--- |
| **Traditional Search** | Organic Search Impressions | Google Search Console | +25% MoM during initial rollout |
| **Traditional Search** | Non-Branded Organic Clicks | Google Search Console | >60% of total organic traffic |
| **Traditional Search** | Average SERP Position (Priority Keywords) | GSC Search Performance | Top 10 for primary category clusters |
| **Technical Health** | Valid Sitemaps & Zero 404/500 Errors | GSC Page Indexing Report | 100% indexed, 0 crawl errors |
| **Structured Data** | Valid Course & FAQ Rich Results | GSC Enhancements Report | 100% valid, 0 critical issues |
| **Conversion Funnel** | Demo Booking Conversion Rate | GA4 Event \`demo_booking_submitted\` | 3.5% - 5.0% of course visitors |
| **Conversion Funnel** | Admissions Enquiry Form Submissions | GA4 Event \`lead_form_submitted\` | >150 qualified enquiries/mo |
| **AI Search & GEO** | AI Brand Citations & Mentions | Observation Log (\`17-ai-visibility\`) | Featured in Perplexity & SearchGPT |
| **Local / Regional** | Siddhartha Nagar Physical Campus Inquiries | Google Business Profile Insights | Consistent local presence growth |

---

## 3. MONTHLY REPORTING TEMPLATE & CADENCE

### First Monday of Every Month:
1. **Google Search Console Review:**
   - Total clicks, impressions, CTR, and average position across branded vs. non-branded queries.
   - Top 20 performing course URLs and academy landing hubs.
   - Query-level gainers and losers.
2. **Page Indexing & Crawl Audit:**
   - Verify that all 175 sitemap URLs remain successfully indexed.
   - Confirm that admin, auth, and student portal pages remain unindexed (\`noindex, nofollow\`).
3. **Core Web Vitals & Page Experience:**
   - LCP (Largest Contentful Paint) < 2.5s.
   - INP (Interaction to Next Paint) < 200ms.
   - CLS (Cumulative Layout Shift) < 0.1.
4. **AI Search Observation Sprint:**
   - Query SearchGPT, Perplexity AI, Google Gemini, and Claude using the 20-query test library (\`17-ai-visibility-test-library.csv\`).
   - Log citation presence, domain attribution, and sentiment in \`17-ai-visibility-observation-log.csv\`.

---

## 4. ACTIONABLE REMEDIATION PROTOCOLS

- **If Organic CTR < 2.0% for Top 5 Ranked Keywords:** Refactor meta titles and snippets to increase commercial intrigue and emphasize practical projects or starting tuition (₹2,900 + GST).
- **If Course Page Bounce Rate > 65%:** Inspect mobile UX, hero visual clarity, demo modal responsiveness, and WhatsApp CTA engagement.
- **If AI Engine Hallucinates Unverified Claims:** Update semantic entity schema, publish clarifying editorial research, and request citation refresh.
`;

fs.writeFileSync(path.join(SEO_DIR, '22-automated-seo-validation.md'), doc22);
fs.writeFileSync(path.join(SEO_DIR, '23-monthly-seo-performance-framework.md'), doc23);

console.log('Generated 22-automated-seo-validation.md and 23-monthly-seo-performance-framework.md');
