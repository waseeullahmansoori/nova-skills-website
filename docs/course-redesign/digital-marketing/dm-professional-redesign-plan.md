# AI Digital Marketing Professional — Course Redesign Specification & Plan

**Course ID:** `dm-professional`  
**Current Published Name:** AI Digital Marketing Professional  
**Positioning Tier:** Career Professional Program  
**Branch:** `transformation/nova-course-redesign`  
**Target Fee:** ₹17,499 (Catalog Original: ₹49,999) *(Strictly Unchanged)*  
**Target Duration:** 4 Months / 160 Total Hours (Supervised + Practicals) *(Strictly Unchanged)*  
**Authoring Phase:** Step 14 Architecture & Planning Specification  

---

## 1. Executive Summary & Existing Course Audit

### 1.1 Course Baseline & Identity
- **Course ID:** `dm-professional`
- **Course Name:** `AI Digital Marketing Professional`
- **Current Fee:** ₹17,499 (Original: ₹49,999; 65% discount) — **Preserved exactly**
- **Duration / Workload:** 4 Months (160 Hours: ~80 Hours Supervised Guided Training + ~80 Hours Guided Lab Exercises & Portfolio Projects) — **Preserved exactly**
- **Catalog Entry in `data.js`:** Currently lists 5 modules (20 lessons), `learningHours: 120` in `data.js` vs. `160` in JSON, 2 live projects, tools: `Google Ads`, `Meta Ads Manager`, `GA4`, `SEMrush`, `Canva`, `ChatGPT`, `Looker Studio`.

### 1.2 Critical Audit of Existing Curriculum Weaknesses
A rigorous line-by-line inspection of `data/courses/dm-professional.json` reveals significant structural gaps and generic boilerplate:

1. **Repetitive Boilerplate Across All Lessons:**
   - Every single lesson description uses generic placeholder strings: *"Step-by-step breakdown of [Lesson Name]"*, *"Essential for mastering the broader Digital Marketing Strategy & AI strategy"*, and *"A tangible asset or configuration related to the lesson."*
   - There are zero concrete subtopics, real-world examples, or specific platform exercise guides.
2. **Missing Essential Professional Domains:**
   - **Google Tag Manager (GTM):** Entirely absent from the lessons, even though modern hiring for Digital Marketing Executives and Paid Media Associates requires understanding web event firing and tags.
   - **Lead Capture & Basic CRM Operations:** No coverage of lead routing, webhook bridges (Make/Zapier), or CRM hygiene (HubSpot Free / Google Sheets lead automation).
   - **Client Reporting Decks & Dashboards:** Module 05 lists "Client Reporting with Data" in a generic way with no Looker Studio dashboard construction or client presentation deck frameworks.
   - **Ad Account Safety & Compliance:** No training on Meta ad policy rejections, Google Ads trademark/policy compliance, or managing client ad accounts via Business Manager / MCC without risking personal assets.
3. **Unrealistic & Unvalidated Tool Declarations:**
   - `data.js` lists `SEMrush`, which costs over \$130/month per seat. Forcing or assuming paid SEMrush accounts creates severe friction for learners. The course must prioritize native tools (`Google Search Console`, `Google Keyword Planner`, `Google Trends`, `UberSuggest/Ahrefs Webmaster Tools free tier`) with optional SEMrush demo overviews.
4. **Vague AI Integration:**
   - AI is mentioned in Module 01 and 02, but lacks concrete workflows: structured prompt engineering for persona creation, ad copy angle matrices, search intent mapping, and creative variation generation.

---

## 2. Positioning & Educational Boundaries

The Nova Skills Digital Marketing Academy has 4 distinct, non-overlapping programs:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   NOVA SKILLS DM ACADEMY MATRIX                        │
├────────────────────────────┬───────────────────────────────────────────┤
│ 1. digital-marketing-pro   │ Digital Marketing Standard / Foundation   │
│    (₹11,999 | 3 Mos / 88h) │ Basic digital literacy, local shop owners │
├────────────────────────────┼───────────────────────────────────────────┤
│ 2. dm-professional         │ AI Digital Marketing Professional         │
│    (₹17,499 | 4 Mos / 160h)│ Career-track, agency/in-house hireable    │
├────────────────────────────┼───────────────────────────────────────────┤
│ 3. perf-marketing-pro      │ Performance Marketing Specialist          │
│    (₹12,999 | 3 Mos / 120h)│ Advanced paid acquisition, ROAS, CRO, GTM │
├────────────────────────────┼───────────────────────────────────────────┤
│ 4. dm-mastery              │ AI Digital Marketing Master               │
│    (₹31,499 | 6 Mos / 240h)│ Omnichannel leadership, agency growth     │
└────────────────────────────┴───────────────────────────────────────────┘
```

### Educational Independence Principle
`dm-professional` is a self-contained, career-launching program. While it goes significantly deeper into hireable execution than `digital-marketing-pro` (Foundation), it **must teach foundational concepts from scratch** (marketing funnels, consumer psychology, channel taxonomy) so that learners who did not take the Foundation course can succeed without prerequisites.

### Clear Boundary Definitions
- **Above Foundation (`digital-marketing-pro`):**
  - Foundation focuses on small business setup, organic posting, and basic boosted/search ads.
  - `dm-professional` trains learners for **agency and corporate employment**: multi-ad-group search architectures, custom and lookalike audiences, Google Tag Manager event firing, multi-page SEO audits, CRM lead management, and client pitch decks.
- **Below Performance Marketing (`perf-marketing-pro`):**
  - Performance Marketing dives deeply into programmatic media buying, custom server-side CAPI tagging, advanced data layers, statistical multivariate CRO, and aggressive algorithmic ROAS bidding scripts.
  - `dm-professional` covers standard web GTM, standard Meta Pixel, and client-ready paid campaigns without complex server-side infrastructure.
- **Below Mastery (`dm-mastery`):**
  - Mastery teaches cross-channel growth architecture, agency management retainers, and enterprise marketing operations.
  - `dm-professional` focuses on tactical, employable mastery of channel execution and reporting.

---

## 3. Target Audience & Realistic Career Outcomes

### 3.1 Target Profiles
1. **College Graduates & Job Seekers:** Aiming for their first full-time role in a marketing agency or in-house marketing department.
2. **Career Switchers:** Professionals from sales, customer service, or administrative backgrounds transitioning into digital marketing.
3. **Junior Marketing Associates:** Marketers with 6–12 months experience who want to formalize their knowledge across paid media, SEO, tracking, and AI.
4. **Independent Freelancers:** Freelancers who want to charge professional retainers for managing Google/Meta ads and client growth.

### 3.2 Realistic Employment Roles
- **Digital Marketing Executive / Associate**
- **PPC / Paid Search Specialist (Junior to Mid)**
- **Paid Social Media Buyer (Junior to Mid)**
- **SEO & Content Specialist (Junior to Mid)**
- **Digital Marketing Coordinator / Campaign Specialist**

*(Note: Explicitly excludes senior roles such as "Head of Growth", "Performance Marketing Director", or "Chief Marketing Officer".)*

---

## 4. Software & Toolstack Validation (Zero-Student-Ad-Spend Policy)

To ensure student accessibility without hidden costs:
- **No Required Ad Spend:** All campaign builds, ad group setups, extensions, and bidding configurations are built in live Google Ads and Meta Ads Manager accounts in draft/paused mode or test sandboxes.
- **No High-Cost Paid Tools Required:** We do not require paid SEMrush/Ahrefs subscriptions. We utilize native tools, free tiers, and verified student-accessible platforms.

| Tool / Platform | Category | Access Model | Role in Course |
| :--- | :--- | :--- | :--- |
| **Google Ads** | Core Platform | Free (Expert Mode Account) | Search campaigns, ad groups, keyword planner, negative lists, extensions, smart bidding |
| **Meta Ads Manager** | Core Platform | Free (Meta Business Suite) | Campaign objectives, Advantage+ audience setup, custom audiences, Instant Lead Forms |
| **Google Analytics (GA4)** | Core Analytics | Free + Google Demo Account | Traffic acquisition, user journeys, custom conversions, explorations, UTM analysis |
| **Google Tag Manager (GTM)** | Core Tracking | Free | Web container, GA4 config tag, click/form submission triggers, standard event tags |
| **Google Search Console** | Core SEO | Free (Live Site / Sandboxed) | Indexing status, sitemaps, search queries, click-through rates, technical issues |
| **Canva (Free / Pro Trial)** | Creative Design | Free Tier Sufficient | Ad creative matrices, social carousel decks, landing page mockups, brand kits |
| **ChatGPT / Claude Free** | AI Productivity | Free Tier | Personas, ad copy angle matrices, SEO briefs, scriptwriting, customer review replies |
| **Looker Studio** | Reporting | Free | Building automated client performance dashboards connected to GA4 & Google Sheets |
| **HubSpot CRM (Free Tier)** | Lead Operations | Free Tier | Contact lifecycle stages, lead status management, basic pipeline tracking |
| **Google Sheets & Drive** | Project Mgt | Free | Editorial calendars, UTM builder spreadsheets, client audit sheets |

---

## 5. Recommended 8-Module Curriculum Architecture (160 Hours)

To provide exhaustive, job-ready training across all 10 mandated competency domains while preserving an organized 4-month structure (8 modules, 32 comprehensive lessons, ~5 hours per lesson including lecture, supervised lab, and assignments):

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                  AI DIGITAL MARKETING PROFESSIONAL SYLLABUS                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ Month 1: Strategic Foundations, AI Workflows & Organic Visibility            │
│   • Module 01: Marketing Fundamentals, Consumer Psychology & AI Strategy     │
│   • Module 02: Content Marketing, Social Strategy & AI Creative Production   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Month 2: Organic Search Dominance & Conversion Landing Pages                 │
│   • Module 03: Professional Search Engine Optimization (SEO) & Local Search  │
│   • Module 04: High-Converting Landing Pages, UX & Offer Architecture         │
├──────────────────────────────────────────────────────────────────────────────┤
│ Month 3: Paid Acquisition Mastery (Google & Meta Ads)                        │
│   • Module 05: Google Ads Search Campaign Architecture & Bidding             │
│   • Module 06: Meta Ads Manager, Audience Funnels & Paid Social Scaling      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Month 4: Tracking, Conversion Infrastructure & Client Operations             │
│   • Module 07: GA4 Analytics, Google Tag Manager & Conversion Tracking       │
│   • Module 08: Lead Automation, CRM Operations, Client Reporting & Capstone  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Module Breakdown & Lesson Blueprints

#### Module 01: Marketing Fundamentals, Consumer Psychology & AI Strategy (4 Lessons | 20 Hours)
- **1.1 The Modern Digital Ecosystem & Customer Journey:** Traditional vs. digital channels, the full-funnel model (TOFU, MOFU, BOFU), multi-touch attribution concepts, customer lifecycle marketing.
- **1.2 Market Research, ICP & AI Persona Generation:** Defining Ideal Customer Profiles (ICPs), pain points, objections, using ChatGPT for deep persona dossiers, empathy mapping.
- **1.3 Value Proposition & Competitor Benchmarking:** Unique Selling Propositions (USP), positioning maps, competitor ad transparency audits (Meta Ad Library, Google Ads Transparency Center).
- **1.4 AI-Powered Strategic Marketing Plan:** Structuring a complete digital go-to-market plan, channel selection matrix, budget allocation across organic vs. paid channels.

#### Module 02: Content Marketing, Social Strategy & AI Creative Production (4 Lessons | 20 Hours)
- **2.1 Content Pillars & Editorial Calendar Systems:** Audience-first content strategy, building a 60-day content calendar in Google Sheets, content repurposing workflows.
- **2.2 Organic Social Strategy (LinkedIn, Instagram, YouTube):** Algorithm mechanics, hooks, storytelling, carousel design, engagement hacking, community management.
- **2.3 AI Copywriting & Angle Matrix Generation:** Prompting frameworks for ad hooks, direct-response copywriting (AIDA, PAS), headline generation, tone-of-voice alignment.
- **2.4 High-Impact Creative Production with Canva:** Designing high-converting social graphics, ad creative variations (1:1, 9:16, 16:9), typography hierarchy, brand kit consistency.

#### Module 03: Professional Search Engine Optimization (SEO) & Local Search (4 Lessons | 20 Hours)
- **3.1 Modern Keyword Research & Search Intent Mapping:** Keyword research with Google Keyword Planner, Trends, and free tools; search intent classification (Informational, Commercial, Transactional).
- **3.2 On-Page SEO & Content Optimization:** Title tags, meta descriptions, semantic header hierarchy (H1-H4), internal linking structures, AI-assisted content briefs.
- **3.3 Technical SEO Fundamentals & Google Search Console:** Crawling, indexing, XML sitemaps, robots.txt, Core Web Vitals basics, diagnosing coverage errors in Google Search Console.
- **3.4 Local SEO & Google Business Profile (GBP) Mastery:** GBP setup, category optimization, local citation building, review acquisition systems, ranking in the Local 3-Pack.

#### Module 04: High-Converting Landing Pages, UX & Offer Architecture (4 Lessons | 20 Hours)
- **4.1 Landing Page Psychology & Wireframing:** Anatomy of a high-converting landing page, above-the-fold elements, social proof placement, reducing visual friction.
- **4.2 Irresistible Offers, Lead Magnets & Call-to-Actions:** Designing compelling lead magnets (checklists, guides, calculators), crafting high-converting CTA copy and placement.
- **4.3 Mobile UX & Friction Auditing:** Mobile responsiveness checks, form field optimization, page load speed impact, user behavior auditing principles.
- **4.4 Conversion Rate Optimization (CRO) Fundamentals:** A/B testing hypotheses, qualitative feedback analysis, micro-conversions vs. macro-conversions.

#### Module 05: Google Ads Search Campaign Architecture & Bidding (4 Lessons | 20 Hours)
- **5.1 Account Hierarchy & Campaign Setup:** Google Ads MCC vs. standard account structure, campaign objectives, network settings, location and language targeting.
- **5.2 Keyword Match Types & Search Intent Structuring:** Broad, phrase, and exact match types in modern Google Ads; Single-Theme Ad Groups (STAGs); negative keyword lists.
- **5.3 Responsive Search Ads (RSAs) & Ad Assets:** Writing high-ad-strength RSAs, headline/description pinning strategies, callout assets, sitelinks, structured snippets, call assets.
- **5.4 Smart Bidding Strategies & Search Term Optimization:** Maximize Clicks vs. Maximize Conversions vs. Target CPA; mining search terms reports to eliminate wasted ad spend.

#### Module 06: Meta Ads Manager, Audience Funnels & Paid Social Scaling (4 Lessons | 20 Hours)
- **6.1 Meta Business Suite & Ads Manager Architecture:** Business Manager setup, partner access, ad account management, Meta Pixel and dataset pairing.
- **6.2 Audience Segmentation (Core, Custom & Lookalike):** Demographics, detailed interests, behaviors, custom audiences from customer lists/website visitors, 1% lookalike audiences.
- **6.3 Creative Strategy & Full-Funnel Ad Formats:** Single image, video ads, carousel ads, Instagram Stories/Reels format specs, testing 3x3 creative matrices.
- **6.4 Campaign Optimization, Metrics & Scaling Rules:** Analyzing ROAS, Cost Per Lead (CPL), Click-Through Rate (CTR), Frequency, diagnosing ad fatigue, vertical vs. horizontal scaling.

#### Module 07: GA4 Analytics, Google Tag Manager & Conversion Tracking (4 Lessons | 20 Hours)
- **7.1 Google Analytics 4 (GA4) Architecture:** Data streams, event-based measurement model, standard reports (Acquisition, Engagement, Monetization).
- **7.2 UTM Tagging Architecture & Campaign Attribution:** Google Campaign URL Builder, UTM naming conventions, cross-channel traffic source attribution.
- **7.3 Google Tag Manager (GTM) Fundamentals:** GTM container structure, installing tags, understanding triggers and variables, configuring the GA4 configuration tag.
- **7.4 Practical Event & Conversion Setup:** Setting up custom button click triggers, form submission events, marking key events as conversions in GA4.

#### Module 08: Lead Automation, CRM Operations, Client Reporting & Capstone (4 Lessons | 20 Hours)
- **8.1 Lead Generation Funnels & Instant Forms:** Building native Meta Instant Lead Forms, qualifying questions, privacy policy integration.
- **8.2 Lead Routing & Basic CRM Operations:** Routing leads to Google Sheets and HubSpot CRM (Free), lead status pipelines, automated follow-up notification workflows.
- **8.3 Automated Client Dashboards with Looker Studio:** Connecting Looker Studio to GA4 and Google Sheets, designing a professional one-page executive client marketing dashboard.
- **8.4 Client Delivery, Pitch Deck & Comprehensive Capstone Defense:** Structuring a 10-slide monthly marketing performance review deck, presenting findings, defending optimization decisions.

---

## 6. Practical Portfolio Projects & Assessments

Students graduate with 4 comprehensive, tangible, and employable portfolio artifacts:

### Deliverable 1: AI-Powered Multi-Channel Go-To-Market Plan
- **Scope:** Complete market and competitive analysis for a chosen business (B2B SaaS, E-commerce, or Local Healthcare/Services).
- **Components:** ICP personas, competitor ad analysis (Meta Ad Library), keyword intent map, 60-day content calendar, and channel budget allocation.
- **Format:** Professional PDF strategy dossier.

### Deliverable 2: Production-Ready Google Ads & Meta Ads Architecture
- **Scope:** Complete buildout of a dual-platform acquisition funnel.
- **Components:**
  - Google Ads Search campaign structure with 3 STAG ad groups, 15+ negative keywords, and responsive search ads with all extensions.
  - Meta Ads Manager full-funnel campaign build (TOFU video/carousel, MOFU lead generation, BOFU retargeting) with creative visual assets designed in Canva.
- **Format:** Live account inspection / exported campaign build workbook.

### Deliverable 3: Verified Web Analytics & Conversion Tracking Architecture
- **Scope:** End-to-end tracking deployment.
- **Components:** Fully documented GTM container with GA4 tags, click triggers, lead form submission triggers, and verified UTM campaign URLs.
- **Format:** GTM container export + Google Analytics live event debug verification log.

### Deliverable 4: Executive Looker Studio Dashboard & Monthly Client Review Deck
- **Scope:** Professional client reporting deliverable.
- **Components:**
  - Interactive Looker Studio dashboard tracking CPL, CPA, CTR, channel breakdown, and conversion trends.
  - 10-slide executive slide deck summarizing campaign performance, budget pacing, insights, and optimization recommendations.
- **Format:** Live Looker Studio link + PDF slide presentation.

---

## 7. Teaching-Hour Feasibility & Workload Verification

Total Course Workload: **160 Hours (4 Months)**
- **Supervised Training (80 Hours):** 8 Modules $\times$ 4 Lessons = 32 Lessons $\times$ 2.5 hours per class (Lecture + live guided tool walkthrough).
- **Independent Guided Labs & Projects (80 Hours):** 8 Modules $\times$ 10 hours practical work (Hands-on platform build, copywriting, asset design, tracking configuration, and capstone presentation).
- **Pacing:** 10 Hours / week over 16 weeks (4 months). Perfectly feasible for working professionals and college graduates.

---

## 8. Summary of Major Curriculum Improvements Over Legacy

| Dimension | Legacy Course (`dm-professional.json`) | Redesigned Course (`dm-professional-redesign-plan.md`) |
| :--- | :--- | :--- |
| **Modules / Lessons** | 5 Modules / 20 Generic Lessons | 8 Structured Modules / 32 Job-Ready Lessons |
| **Lesson Descriptions** | Repeated boilerplate placeholder text | Specific subtopics, tools, and hands-on deliverables |
| **Google Tag Manager** | Zero mention / Omitted | Complete Module on GTM web containers and triggers |
| **Lead Operations & CRM** | Zero mention | Dedicated lesson on Meta Instant Forms & HubSpot CRM |
| **Reporting & Dashboards**| Generic "Client Reporting with Data" | Interactive Looker Studio dashboard build |
| **Tool Accessibility** | Unrealistic expensive tools (`SEMrush`) | Native, free-tier, and zero-ad-spend platforms |
| **AI Integration** | Vague high-level mentions | Explicit prompt engineering for personas, copy & briefs |
| **Portfolio Deliverables** | 3 vague bullet points | 4 verifiable, client-ready portfolio assets |

---

## 9. Git & Workspace Status

- **Branch:** `transformation/nova-course-redesign`
- **Tracked Code/Data Files Modified:** **NONE** (Strictly Read-Only).
- **Artifact Created:** `docs/course-redesign/digital-marketing/dm-professional-redesign-plan.md`
- **Repository Integrity:** Published course data (`data.js`, `data/courses/`, `nova-skills-109-course-content.json`) remains 100% untouched. No commits or pushes made.
