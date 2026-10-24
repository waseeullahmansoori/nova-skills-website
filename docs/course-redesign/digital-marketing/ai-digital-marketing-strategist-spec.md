# AI Digital Marketing Strategist — Authoritative Academic Specification

**Document Title:** Academic Curriculum, Toolstack & Technical Specification for AI Digital Marketing Strategist  
**Target Course ID:** `dm-mastery`  
**Current Published Name:** AI Digital Marketing Master  
**Approved Redesigned Name:** AI Digital Marketing Strategist  
**Target Academy:** Digital Marketing Academy (`digital-marketing`)  
**Program Classification:** Flagship Career Mastery (`MASTER` / `Career Program`)  
**Approved Duration:** 6 Months / 24 Teaching Weeks  
**Instructional Volume:** Exactly 240 Guided Instructional Hours (targeting 10 guided hours/week)  
**Recommended Independent Practice:** 80–120 Additional Recommended Hours (3–5 hours/week)  
**Approved Commercial Price:** INR 44,900 (Catalog Original: INR 89,999; ~50% discount; GST extra where applicable)  
**Flexible Payment:** 6-Month No-Cost EMI option available (~₹8,830/month including 18% GST)  
**Active Git Branch:** `transformation/nova-course-redesign`  
**Authoritative Status:** APPROVED ARCHITECTURAL SPECIFICATION — Implementation Blueprint  
**Effective Date:** October 24, 2026  

---

## 1. Executive Summary & Codebase Baseline Audit

### 1.1 Course Identity & Strategic Re-Alignment

The flagship program of the Digital Marketing Academy, currently cataloged as **"AI Digital Marketing Master"** (`dm-mastery`), is being comprehensively redesigned and modernized into **"AI Digital Marketing Strategist"**. 

This redesign transitions the course from a dated, formulaic 6-module curriculum into an authoritative, 11-module strategic mastery program. Where the entry-level **AI Digital Marketing Specialist** (`dm-professional`, 3 Months / 120 Hours / ₹24,900) develops hands-on tactical campaign execution skills, the **AI Digital Marketing Strategist** (`dm-mastery`, 6 Months / 240 Hours / ₹44,900) develops full-funnel strategic architects capable of independently researching, planning, executing, measuring, attributing, and scaling integrated omnichannel growth engines for corporate brands, agencies, and high-growth ventures.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               NOVA SKILLS DIGITAL MARKETING ACADEMY                    │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ AI Digital Marketing          │ 3 Months · 120 Guided Hours · ₹24,900                  │
│ Specialist (dm-professional)  │ Entry-level tactical execution across search, social,  │
│                               │ landing pages, and foundational GA4 reporting.         │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ AI Digital Marketing          │ 6 Months · 240 Guided Hours · ₹44,900                  │
│ Strategist (dm-mastery)       │ Flagship integrated strategy, omnichannel growth       │
│                               │ modeling, attribution, CRO, CRM automation, & agency   │
│                               │ operations.                                            │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

### 1.2 Baseline Codebase Forensic Audit

A forensic inspection of the repository on branch `transformation/nova-course-redesign` reveals the following current baseline state for `dm-mastery`:

1. **Central Catalog Metadata in `data.js` (lines 9–96):**
   - `id`: `"dm-mastery"`
   - `name`: `"AI Digital Marketing Master"` (outdated)
   - `programLevel`: `"Career Program"`
   - `duration`: `"6 Months"`, `durationMonths: 6`, `learningHours: 240` (aligned duration, but outdated title and syllabus)
   - `price`: `31499`, `originalPrice`: `89999` (stale selling price prior to approved ₹44,900 commercial directive)
   - `curriculum`: 6 generic modules (24 lessons) with superficial titles (*"SEO & Keyword Strategy"*, *"Google Ads Campaign Architecture"*, *"Meta Ads Targeting & Creative"*, *"Content Marketing & Funnels"*, *"Analytics & Conversion Tracking"*, *"AI-Powered Marketing Automation"*).
2. **Duplicated Academy Record in `data.js` (`NS_ACADEMIES[0].courses`, lines 7370+):**
   - Exactly mirrors the outdated `NS_COURSES` record with name `"AI Digital Marketing Master"` and price `31499`.
3. **Deep Course Payload in `data/courses/dm-mastery.json`:**
   - Contains identical outdated 6-module skeleton (24 lessons).
   - Lessons contain synthetic placeholder text (*"Step-by-step breakdown of [Lesson Name]"*, *"Essential for mastering the broader [Module Name] strategy"*).
   - `what_you_will_build`: Contains only 3 generic project bullets.
   - `faq`: Contains only 3 generic FAQ items failing to address Zero-Ad-Spend, AI workflows, sandbox tooling, or realistic career progression.
4. **Master Fallback Database in `nova-skills-109-course-content.json` (Index 0, lines 1–640):**
   - Matches `data/courses/dm-mastery.json` line-for-line with the 6-module structure.
5. **Two-Tier Runtime Rendering Engine (`course-detail.js`):**
   - Resolves `dm-mastery` synchronously from `data.js` (Tier 0), followed by an async fetch of `/data/courses/dm-mastery.json` (Tier 1), falling back to `/nova-skills-109-course-content.json` (Tier 2).
   - Sets document title: `AI Digital Marketing Master — Flagship Career Program | Nova Skills` (line 144).
   - Serves as the global default fallback route whenever `course-detail.html` is visited without query parameters (`COURSE_ALIASES` maps `'dm-master'`, `'digital-marketing'` to `'dm-mastery'`, and defaults to `'dm-mastery'`).

### 1.3 Commercial Pricing & Tuition (Formally Approved)

* **Approved Selling Price:** **INR 44,900** before GST.
* **Catalog Original Fee:** **INR 89,999** (representing a ~50% commercial launch discount).
* **Payment Terms:** Flexible 6-month no-cost EMI option available (~₹8,830/month inclusive of 18% GST).
* **GST Treatment:** 18% GST is extra where applicable; clearly distinguished on invoices and fee summaries.
* **Price Governance:** Commercial updates are strictly synchronized across `data.js`, `js/data.min.js`, and documentation.

---

## 2. Positioning & Academy Differentiation Matrix

### 2.1 Four-Course Portfolio Boundary Matrix

To prevent internal portfolio cannibalization, learner confusion, and blurred marketing promises, Nova Skills enforces rigorous structural and competency boundaries across its four core Digital Marketing programs:

| Feature / Dimension | `dm-professional` | `digital-marketing-pro` | `perf-marketing-pro` | `dm-mastery` (THIS SPECIFICATION) |
| :--- | :--- | :--- | :--- | :--- |
| **Course ID** | `dm-professional` | `digital-marketing-pro` | `perf-marketing-pro` | `dm-mastery` |
| **New Course Name** | **AI Digital Marketing Specialist** | **Digital Marketing Professional** | **Performance Marketing Professional** | **AI Digital Marketing Strategist** |
| **Duration / Hours** | 3 Months / 120 Guided Hours | 3 Months / 120 Guided Hours | 3–4 Months / 140 Guided Hours | **6 Months / 240 Guided Hours** |
| **Program Level** | Professional Program | Professional Program | Professional Specialist | **Flagship Career Mastery** |
| **Core Value Prop** | Entry-level AI-assisted multi-channel execution | Foundational digital marketing literacy | Deep engineering of paid acquisition & tracking | **Integrated full-funnel strategy, growth modeling & agency ops** |
| **Target Graduate** | Digital Marketing Executive, Junior Paid/SEO | Digital Marketing Assistant, Coordinator | Performance Marketer, Paid Media Buyer | **Digital Marketing Strategist, Growth Specialist, Agency Lead** |
| **Approved Pricing** | ₹24,900 | ₹11,999 – ₹14,999 | ₹19,999 – ₹24,999 | **₹44,900** |
| **Search Engine Scope**| Foundational on-page, local SEO & basic search | Intro SEO concepts | Excluded (paid search only) | **Advanced Technical SEO, Generative Engine Optimization (GEO), Search Intent Intelligence** |
| **Paid Media Scope** | Draft setup of basic Google Search & Meta Lead ads | Basic boosted posts & Ads Manager intro | Advanced ROAS bidding, custom scripts, Advantage+ scaling | **Multi-channel paid media architecture, cross-platform budget orchestration, B2B/B2C funnel alignment** |
| **Analytics Scope** | GA4 standard reports, basic UTM tagging | Basic GA4 exploration | Blended ROAS, custom explorations, data pipelines | **Multi-touch attribution modeling, LTV/CAC cohort analysis, Looker Studio executive reporting suites** |
| **Tracking Scope** | Basic GTM container, 3 web events | Standard Pixel / GA4 tag | Deep GTM data layers, custom JS events, CAPI | **Server-side tracking principles, omnichannel event taxonomy, cross-domain attribution** |
| **CRM & Lifecycle** | Basic 3-email welcome workflow in Brevo | Intro email concepts | Ad platform retargeting audiences | **HubSpot CRM architecture, lead scoring, automated lifecycle nurture funnels, n8n webhook automation** |
| **CRO & Experiments** | Basic landing page with form | Template landing page | Multivariate statistical split testing | **Full-funnel CRO auditing, behavioral UX analysis (Clarity), heuristic framework testing** |
| **Business / Agency Ops**| ₹50,000 simulated budget | Basic marketing calendar | Ad spend unit economics (ROAS/CPA) | **₹200,000–₹500,000 budget modeling, client pitch proposals, SOWs, retainer management, agency scaling** |

### 2.2 Explicit Non-Goals & Program Boundaries

To protect academic rigor, `dm-mastery` explicitly disclaims the following non-goals:
1. **NOT an All-Tools Encyclopedic Dump:** Students are not subjected to 50+ superficial tool walkthroughs. Tool selection is strictly bounded by professional utility in corporate marketing and growth agency roles.
2. **NOT a High-Budget Live Gambling Course:** Nova Skills strictly prohibits requiring students to spend personal funds on live ad spend. All campaign builds operate in authorized draft modes, developer sandboxes, and verified simulations.
3. **NOT a Software Engineering Bootcamp:** While students build WordPress landing pages and configure Google Tag Manager triggers, this course does not teach full-stack JavaScript application development or backend database administration.
4. **NOT a Guarantee of Senior Executive Employment:** Nova Skills provides rigorous, industry-grade portfolio preparation and career placement support, but strictly prohibits making deceptive claims of guaranteed ₹15+ LPA salaries, instant Chief Marketing Officer appointments, or effortless freelance wealth.

---

## 3. Learner Profile, Target Roles & Dual-Track Learning Model

### 3.1 Target Audience

* **Aspiring Career Marketers & Career Switchers:** Learners seeking an end-to-end, rigorous educational pathway that takes them from first principles to enterprise-grade growth strategy.
* **Junior Marketers & Executives:** Working marketing professionals (1–3 years experience) seeking to upgrade from manual, fragmented tactical tasks to strategic, data-driven growth orchestration.
* **Agency Account Managers & Freelancers:** Independent practitioners seeking to command high-ticket client retainers by offering integrated full-funnel strategy, attribution, and automation rather than commoditized single-service deliverables.
* **Entrepreneurs & Business Founders:** Startup founders, D2C brand creators, and SME owners wanting to systematically architect and scale their own customer acquisition and retention engines.

### 3.2 Target Career Pathways (Evidence-Based & Truthful)

Graduates who successfully complete all 11 modules, pass the practical troubleshooting examination, and defend their capstone portfolio in the viva voce examination are qualified for:

1. **Digital Marketing Strategist** *(subject to verified prior background or progressive post-graduation experience)*
2. **Growth Marketing Specialist / Manager**
3. **Digital Marketing Executive / Senior Executive**
4. **SEO & Growth Content Specialist**
5. **Performance & Paid Media Strategist**
6. **Marketing Automation & CRM Associate**
7. **Digital Marketing Analyst**

> [!IMPORTANT]
> Career positioning in all marketing and catalog materials must emphasize **demonstrated proof-of-work** and **portfolio defense**, avoiding misleading claims of automatic management placement for zero-experience beginners.

### 3.3 Dual-Track Workload Model

To achieve mastery across 11 complex domains, the course adopts a disciplined dual-track structure:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        24-WEEK DUAL-TRACK INSTRUCTIONAL MODEL                          │
├──────────────────────────────────────────────────┬─────────────────────────────────────┤
│ TRACK A: Guided Training (240 Hours)             │ TRACK B: Independent Practice       │
│ • 10 Guided Instructional Hours per Week         │   (80–120 Hours)                    │
│ • Live interactive platform walkthroughs         │ • 3–5 Recommended Hours per Week    │
│ • Supervised laboratory campaign builds          │ • Self-paced tool navigation        │
│ • Architecture and funnel design clinics         │ • Extended persona research         │
│ • Technical troubleshooting practicals           │ • Ad copy & creative variations     │
│ • Capstone synthesis & faculty viva defense      │ • Portfolio documentation & deck    │
└──────────────────────────────────────────────────┴─────────────────────────────────────┘
```

---

## 4. Software & Toolstack Validation (October 2026 Platform Reality)

### 4.1 Strict Zero-Student-Ad-Spend Policy

Nova Skills strictly enforces a **Zero-Student-Ad-Spend Policy**. Students are never required to link personal credit cards or risk personal capital to complete course practicals.
* **Google Ads:** Built within Google Ads Expert Mode in draft status, leveraging Google Ads Editor for offline account structuring, negative keyword hygiene, and responsive ad matrices.
* **Meta Ads Manager:** Built within Meta Business Suite sandbox accounts or draft campaign modes with exportable campaign Blueprints.
* **LinkedIn Ads:** Structured within LinkedIn Campaign Manager in draft status for B2B account-based marketing simulations.
* **Analytics & Tagging:** Evaluated using Google's public GA4 Demonstration Property (Merchandise Store / Flood-It) for enterprise reporting exploration, combined with live student WordPress sandbox sites for GTM container deployment and custom event debugging.

### 4.2 Verified October 2026 Platform Feature Matrix

The curriculum reflects verified platform capabilities as of October 2026:

| Tool / Platform | Category | Version / Environment | Operational Mode | Primary Strategic Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Google Ads** | Core | Expert Mode (Web + Ads Editor v2.8+) | Draft Mode / Zero Spend | Full-funnel search architecture, RSAs, PMax asset groups, Value-Based Bidding strategy |
| **Meta Ads Manager** | Core | Meta Business Suite (v2026) | Draft / Sandbox | ODAX campaign objectives, Advantage+ shopping/creative testing matrices, Instant Lead Forms |
| **Google Analytics 4 (GA4)** | Core | Web + App Data Streams | Live Sandbox + Google Demo | Exploration reports, Funnel journeys, Key Event designation, Data-driven attribution modeling |
| **Google Search Console** | Core | GSC Production / Verification | Student Domain Sandbox | Indexing diagnostics, Core Web Vitals (INP), query cannibalization analysis, XML sitemap hygiene |
| **Google Tag Manager (GTM)**| Core | Web Container (v2) | Live Preview / Tag Assistant | Tag firing rules, custom click/form triggers, GA4 configuration tags, dataLayer event verification |
| **Looker Studio** | Core | Enterprise Cloud (2026) | Live Cloud Connector | Executive multi-channel marketing dashboards, blended GA4/GSC sources, calculated CPA/ROAS fields |
| **HubSpot CRM** | Core | Free Tier / Educational Portal | Live Cloud Sandbox | Lead lifecycle pipeline configuration, contact property management, lead scoring rules |
| **Canva** | Core | Pro / Educational Workspace | Cloud Production | Visual brand systems, multi-slide educational carousels, responsive ad creative sets (1:1, 9:16) |
| **ChatGPT** | Core | GPT-4o / Canvas (2026) | Free / Plus Tier | Multi-angle copywriting frameworks (AIDA, PAS), ICP persona synthesis, search intent clustering |
| **Google Gemini** | Core | Gemini 1.5 Pro / Advanced (2026) | Web Workspace | Competitive intelligence audits, search intent analysis, Generative Engine Optimization (GEO) testing |
| **WordPress** | Supporting | Gutenberg Block Editor (6.7+) | LocalWP / Sandbox Hosting | High-converting campaign landing pages, form embeds, tracking tag deployment, Core Web Vitals |
| **Brevo** | Supporting | Cloud Platform (Free Tier) | Live Sandbox | Multi-stage lifecycle email nurturing sequences, trigger automations, double opt-in lead funnels |
| **n8n** | Supporting | Desktop / Cloud Sandbox | Free / Self-Hosted Community | No-code marketing automation: webhook triggers, CRM-to-email routing, lead notification workflows |
| **Microsoft Clarity** | Supporting | Free Production Workspace | Live Tag Deployment | Behavioral UX auditing: session recording reviews, scroll heatmaps, rage-click drop-off diagnosis |
| **Meta Business Suite** | Supporting | Unified Business Inbox | Cloud Workspace | Multi-channel social content calendar scheduling, cross-platform publishing, audience insights |
| **Google Keyword Planner** | Supporting | Google Ads Tools (Free) | Cloud Tool | Commercial search volume evaluation, CPC bid range modeling, keyword intent clustering |
| **Google Trends** | Supporting | Free Public Tool | Web Exploration | Market demand verification, query seasonality curves, regional geographic interest analysis |
| **Google Business Profile** | Supporting | GBP Manager / Local Dashboard | Live/Simulation | Local 3-Pack optimization, LocalBusiness schema injection, citation audit, review management |
| **Claude** | Supporting | Claude 3.5 Sonnet (Anthropic) | Web Workspace | Long-form strategic content briefs, heuristic CRO landing page copy audits, executive summaries |
| **Notion** | Supporting | Free Workspace | Cloud Workspace | Centralized client growth playbooks, campaign briefs, experimental roadmaps, team SOWs |
| **Semrush** | Exposure | Free Exploratory / Demo Walkthrough | Instructor Demo / Free Tier | Competitive domain authority research, keyword gap analysis, backlink profile evaluation |
| **LinkedIn Ads** | Exposure | Campaign Manager (Draft Mode) | Draft Simulation | B2B Account-Based Marketing (ABM) audience segmentation, Matched Audiences, InMail briefs |
| **VWO / A/B Simulators** | Exposure | Educational Split Testing Sim | Interactive Sandbox | Heuristic CRO test hypothesis design, sample size calculators, statistical significance modeling |
| **Adobe Firefly** | Exposure | Commercial Web Generative AI | Free Credits Tier | Generative ad visual variations, background expansion, commercially compliant creative ideation |
| **Similarweb** | Exposure | Free Public Intelligence Tool | Web Benchmarking | Competitor referral traffic distribution, digital share-of-voice benchmarking |

---

## 5. Comprehensive 11-Module Curriculum Specification

### Hour Allocation Summary (Strict 240 Guided Hours Verification)

```
┌────┬────────────────────────────────────────────────────────┬──────────────┬──────────┐
│ No │ Module Name                                            │ Guided Hours │ Lessons  │
├────┼────────────────────────────────────────────────────────┼──────────────┼──────────┤
│ 01 │ Business & Marketing Strategy                          │ 16 Hours     │ 4 Lessons│
│ 02 │ Advanced SEO, GEO & Search Intelligence                │ 28 Hours     │ 6 Lessons│
│ 03 │ Content, Social & Brand Strategy                       │ 20 Hours     │ 5 Lessons│
│ 04 │ Google Ads Strategy                                    │ 28 Hours     │ 6 Lessons│
│ 05 │ Meta & Multi-channel Advertising                       │ 20 Hours     │ 5 Lessons│
│ 06 │ Marketing Analytics & Attribution                      │ 24 Hours     │ 5 Lessons│
│ 07 │ Conversion Rate Optimization (CRO)                     │ 16 Hours     │ 4 Lessons│
│ 08 │ CRM, Lifecycle & Automation                            │ 20 Hours     │ 5 Lessons│
│ 09 │ AI Marketing Operations                                │ 16 Hours     │ 4 Lessons│
│ 10 │ Budgeting, Growth & Agency Operations                  │ 12 Hours     │ 3 Lessons│
│ 11 │ Integrated Capstone & Assessment                       │ 40 Hours     │ 6 Lessons│
├────┴────────────────────────────────────────────────────────┼──────────────┼──────────┤
│    │ TOTAL GUIDED INSTRUCTIONAL HOURS                       │ 240 Hours    │53 Lessons│
└────┴────────────────────────────────────────────────────────┴──────────────┴──────────┘
```

---

### MODULE 01: Business & Marketing Strategy (16 Guided Hours)
* **Module Purpose:** Establish an empirical, executive foundation in business unit economics, market positioning, competitive moats, omnichannel funnel architecture, and consumer psychology before deploying tactical marketing tools.
* **Key Concepts:** B2B vs B2C sales mechanics, unit economics (CAC, LTV, Payback Period, MER), STP positioning frameworks, Porter's Five Forces, Jobs-to-be-Done (JTBD), TOFU-MOFU-BOFU funnel synchronization.
* **Tools Used:** ChatGPT, Google Gemini, Notion, Google Trends, Meta Ad Library.

#### Topic & Lesson Breakdown:
* **Lesson 1.1: Modern Digital Economics & Marketing Business Models (4h)**
  * *Taught:* Unit economics of digital growth; analyzing CAC, LTV, Gross Margins, and Marketing Efficiency Ratio (MER) across SaaS, E-Commerce, Local Services, and B2B Consultancies; owned vs. earned vs. paid channel economics.
  * *Learner Does:* Calculate CAC, LTV:CAC ratios, and break-even customer acquisition thresholds for two divergent business models using provided financial templates.
  * *Outcome:* Financial Unit Economics & Channel Feasibility Model.
* **Lesson 1.2: Customer Psychology, JTBD & Buyer Persona Dossiers (4h)**
  * *Taught:* Cognitive decision frameworks, Jobs-to-be-Done theory, purchase barrier identification, emotional triggers vs. logical justifications, formulating data-backed Ideal Customer Profiles (ICPs) and complex B2B buying committee personas.
  * *Learner Does:* Conduct persona synthesis using customer review mining and prompt-assisted intelligence to build two comprehensive 360-degree buyer persona dossiers.
  * *Outcome:* Validated ICP & Buying Committee Decision Map.
* **Lesson 1.3: Competitive Moats, Market Intelligence & Ad Transparency (4h)**
  * *Taught:* Reverse-engineering competitor strategies using public transparency registries (Meta Ad Library, Google Ads Transparency Center); identifying positioning blind spots; evaluating digital share-of-voice and market demand curves.
  * *Learner Does:* Audit 3 direct competitors across ad creatives, messaging angles, landing page offers, and seasonal search demand.
  * *Outcome:* Competitive Moat & Strategic Positioning Matrix.
* **Lesson 1.4: Full-Funnel Architecture & Integrated Marketing Playbooks (4h)**
  * *Taught:* Orchestrating top-of-funnel (TOFU) awareness, middle-of-funnel (MOFU) consideration, and bottom-of-funnel (BOFU) conversion; mapping multi-channel touchpoints; authoring an agency-grade Strategic Marketing Brief.
  * *Learner Does:* Synthesize business objectives, audience segments, value propositions, and primary KPIs into an executive Strategic Marketing Brief.
  * *Outcome:* Complete Strategic Marketing Brief & Full-Funnel Touchpoint Blueprint.

---

### MODULE 02: Advanced SEO, GEO & Search Intelligence (28 Guided Hours)
* **Module Purpose:** Master organic search discovery across modern search engines, transitioning from legacy keyword-stuffing to semantic search, topical authority clusters, technical site health, Local 3-Pack domination, and Generative Engine Optimization (GEO) for AI Overviews and conversational answer engines.
* **Key Concepts:** Information Retrieval (IR) algorithms, semantic entity mapping, Google Search Essentials, Topical Authority Graphs, Technical SEO audits (Core Web Vitals, INP, crawl budgets), Schema.org LocalBusiness/Organization markup, Generative Engine Optimization (GEO).
* **Tools Used:** Google Search Console, Google Keyword Planner, Google Trends, Google Business Profile, Semrush (Exploratory), Schema Markup Generator, Screaming Frog (Free mode).

#### Topic & Lesson Breakdown:
* **Lesson 2.1: Semantic Search, Entities & Modern Search Algorithms (4h)**
  * *Taught:* Evolution of Google algorithms from PageRank to RankBrain, MUM, and Gemini-powered search; entity-based search vs. keyword strings; Knowledge Graph mechanics; how search engines understand query context and semantic relationships.
  * *Learner Does:* Map a core industry topic into an entity-relationship graph connecting primary entities, sub-entities, and contextual attributes.
  * *Outcome:* Entity Semantic Graph & Knowledge Association Model.
* **Lesson 2.2: Advanced Keyword Research & Topical Authority Architecture (5h)**
  * *Taught:* Intent classification (Informational, Commercial Investigation, Transactional, Navigational); search intent matching; calculating Keyword Difficulty (KD) and Business Value Scores; building pillar-and-cluster topical authority hubs.
  * *Learner Does:* Build a 30-keyword topical authority cluster spreadsheet grouping queries by intent, search volume, and designated URL architecture.
  * *Outcome:* Comprehensive Topical Authority Pillar-and-Cluster Architecture.
* **Lesson 2.3: On-Page SEO, Content Optimization & Internal Linking Architecture (5h)**
  * *Taught:* Advanced on-page optimization standards; semantic heading hierarchies (H1–H4); title tag and meta description engineering for maximum CTR; internal linking PageRank distribution models; content pruning and cannibalization resolution.
  * *Learner Does:* Perform a comprehensive on-page rewrite for 3 target URLs, optimizing metadata, heading structure, and creating an internal linking distribution map.
  * *Outcome:* On-Page Optimization Blueprint & Internal PageRank Flow Map.
* **Lesson 2.4: Technical SEO Auditing, Indexing & Core Web Vitals (5h)**
  * *Taught:* Technical crawlability, indexation mechanics, XML sitemaps, robots.txt directives, canonicalization hygiene, HTTP status codes (301, 302, 404, 410, 500); Core Web Vitals diagnostics (LCP, CLS, INP); Google Search Console indexing reports.
  * *Learner Does:* Conduct a 25-point technical SEO audit on a student sandbox site, diagnosing broken links, indexation blocks, and performance bottlenecks in GSC.
  * *Outcome:* Technical SEO Diagnostic Audit & Remediation Roadmap.
* **Lesson 2.5: Local SEO Domination & Google Business Profile Architecture (4h)**
  * *Taught:* Local search algorithm mechanics (Proximity, Prominence, Relevance); Google Business Profile optimization; Local 3-Pack ranking factors; citation consistency (NAP); generating LocalBusiness and Product Schema (JSON-LD); local review acquisition workflows.
  * *Learner Does:* Audit a local business profile, construct LocalBusiness JSON-LD structured data, and formulate a local citation and review generation strategy.
  * *Outcome:* Local SEO Blueprint & Verified Schema.org JSON-LD Code.
* **Lesson 2.6: Generative Engine Optimization (GEO) & AI Search Visibility (5h)**
  * *Taught:* The shift from 10 blue links to AI Overviews (Google SGE), Perplexity AI, ChatGPT Search, and Gemini citations; citation factors for large language models; direct answer optimization, structured tables, and authoritative source citation strategies.
  * *Learner Does:* Benchmark brand visibility across Gemini and ChatGPT search, optimizing content formatting to trigger AI answer summaries and citations.
  * *Outcome:* Generative Engine Optimization (GEO) Audit & AI Visibility Action Plan.

---

### MODULE 03: Content, Social & Brand Strategy (20 Guided Hours)
* **Module Purpose:** Engineer high-engagement organic social systems and brand storytelling architectures that build qualified audiences, drive commercial consideration, and fuel paid advertising campaigns with validated creative hooks.
* **Key Concepts:** Brand visual identity systems, multi-platform content pillars, algorithmic distribution mechanics (LinkedIn, Instagram, YouTube, X), direct-response copywriting (AIDA, PAS), short-form video storyboarding, community management.
* **Tools Used:** Canva Pro, Meta Business Suite, ChatGPT, Claude 3.5 Sonnet, Notion, CapCut/Mobile Video Editor.

#### Topic & Lesson Breakdown:
* **Lesson 3.1: Brand Positioning, Visual Systems & Brand Guidelines (4h)**
  * *Taught:* Brand archetypes, tone-of-voice guidelines, visual hierarchy, color psychology, typography systems, and building an agency-grade Brand Style Guide for cross-channel consistency.
  * *Learner Does:* Construct a comprehensive digital Brand Style Guide in Canva including color palettes, font pairings, visual moodboards, and tone rules.
  * *Outcome:* Digital Brand Identity Guide & Visual Asset Kit.
* **Lesson 3.2: Content Pillars, Omnichannel Calendars & Repurposing Engines (4h)**
  * *Taught:* Developing core content pillars (Educational, Inspiring, Commercial, Entertaining); building 30-day multi-channel editorial calendars; hub-and-spoke content repurposing engines (turning long-form video into carousels, threads, and newsletters).
  * *Learner Does:* Build a structured 30-day editorial calendar across LinkedIn and Instagram, detailing hooks, visual formats, and publication schedules.
  * *Outcome:* 30-Day Multi-Platform Editorial Strategy & Repurposing Workflow.
* **Lesson 3.3: High-Converting Social Creatives & Multi-Slide Carousels (4h)**
  * *Taught:* Principles of high-CTR visual design; scroll-stopping feed design; multi-slide carousel storytelling; micro-infographics; typography contrast and tap-target optimization.
  * *Learner Does:* Design 10 production-grade social assets in Canva, including 2 educational carousels (8+ slides) and 4 direct-response feed posts.
  * *Outcome:* 10-Asset Production-Grade Creative Suite.
* **Lesson 3.4: Short-Form Video Strategy, Scripting & Mobile Reels Production (4h)**
  * *Taught:* Short-form video mechanics (Instagram Reels, YouTube Shorts); first 3-second hook design; visual pacing, b-roll selection, and caption optimization; direct-response video scripts.
  * *Learner Does:* Write 4 short-form video scripts utilizing the Hook-Retain-Reward-CTA framework, producing and editing 1 polished mobile vertical video.
  * *Outcome:* 4 Video Script Decks & 1 Finished Vertical Reel Asset.
* **Lesson 3.5: Social Listening, Community Growth & Crisis Management (4h)**
  * *Taught:* Monitoring brand mentions and sentiment; social community management; customer feedback loops; social engagement KPIs; proactive crisis management protocols.
  * *Learner Does:* Draft an agency Community Engagement SOP and an escalation matrix for addressing negative reviews or public relations incidents.
  * *Outcome:* Community Management Standard Operating Procedure (SOP).

---

### MODULE 04: Google Ads Strategy (28 Guided Hours)
* **Module Purpose:** Architect scalable paid search acquisition systems, structuring Google Ads accounts to maximize commercial intent capture, control CPC bidding efficiency, and implement value-based bidding algorithms without budget waste.
* **Key Concepts:** Google Ads Account Hierarchy, Ad Rank mechanics, Quality Score factors, Keyword Match Types (Exact, Phrase, Broad with Smart Bidding), Negative Keyword Hygiene, Responsive Search Ads (RSAs), Ad Assets, Value-Based Bidding (tCPA, tROAS), Performance Max (PMax) architecture.
* **Tools Used:** Google Ads (Expert Draft Mode), Google Ads Editor, Google Keyword Planner.

#### Topic & Lesson Breakdown:
* **Lesson 4.1: Google Ads Architecture, Quality Score & Ad Rank Mechanics (4h)**
  * *Taught:* Google Ads auction mathematics; Ad Rank formula (Bid × Quality Score × Asset Impact); decomposing Quality Score (Expected CTR, Ad Relevance, Landing Page Experience); account structure hierarchies (Campaigns, Ad Groups, Match Types).
  * *Learner Does:* Deconstruct a sample auction scenario, calculating Ad Rank, actual CPC paid, and identifying Quality Score deficiencies.
  * *Outcome:* Ad Rank & Quality Score Optimization Calculation Matrix.
* **Lesson 4.2: High-Intent Search Campaign Structuring & Match Types (5h)**
  * *Taught:* Structuring single-theme ad groups (STAGs); matching query intent to ad groups; exact match vs. phrase match vs. broad match with automated bidding; constructing comprehensive negative keyword lists to prevent wasted ad spend.
  * *Learner Does:* Build a full Google Search campaign blueprint in spreadsheet format containing 3 ad groups, keyword mappings, and a 50+ term negative keyword list.
  * *Outcome:* Google Search Campaign Architecture Blueprint.
* **Lesson 4.3: Responsive Search Ad (RSA) Engineering & Asset Extensions (5h)**
  * *Taught:* RSA copy engineering; writing 15 high-CTR headlines across problem, solution, proof, and urgency angles; writing 4 persuasive descriptions; deploying ad assets (Sitelinks, Callouts, Structured Snippets, Call assets, Lead Form assets).
  * *Learner Does:* Draft an exhaustive RSA matrix with 15 headlines and 4 descriptions, pinning strategic terms and configuring 4 site-level ad assets.
  * *Outcome:* High-Converting RSA Copy & Extension Matrix.
* **Lesson 4.4: Bidding Strategies, Smart Bidding & Value-Based Optimization (5h)**
  * *Taught:* Manual CPC with Enhanced CPC vs. automated Smart Bidding; Maximize Clicks vs. Maximize Conversions; Target CPA (tCPA) vs. Target ROAS (tROAS); minimum conversion volume thresholds for algorithmic stability; Value-Based Bidding strategies.
  * *Learner Does:* Model bidding strategy transitions for an account scaling from zero conversions to 100+ monthly conversions, setting milestone thresholds.
  * *Outcome:* Automated Bidding Strategy Scaling Playbook.
* **Lesson 4.5: Performance Max (PMax) Architecture & Asset Group Strategy (5h)**
  * *Taught:* Deconstructing Google's automated Performance Max campaigns; Asset Group creation; audience signals (first-party data, in-market, custom segments); search themes; URL expansion rules; preventing PMax cannibalization of brand search.
  * *Learner Does:* Build a comprehensive PMax Asset Group Blueprint including visual creatives, headlines, descriptions, video assets, and audience signal definitions.
  * *Outcome:* PMax Asset Group & Audience Signal Specification.
* **Lesson 4.6: Google Ads Troubleshooting, Auditing & Budget Control (4h)**
  * *Taught:* Performing account health audits; diagnosing low impression share (Rank vs. Budget); identifying click fraud and search query leaks; managing daily pacing and shared budgets; Google Ads Editor bulk management.
  * *Learner Does:* Audit a historical Google Ads account export, identifying 5 major budget leaks and compiling an optimization remediation checklist.
  * *Outcome:* Google Ads Comprehensive Account Audit & Remediation Plan.

---

### MODULE 05: Meta & Multi-channel Advertising (20 Guided Hours)
* **Module Purpose:** Engineer full-funnel paid social campaigns across Meta (Facebook & Instagram) and complementary networks (LinkedIn), mastering audience targeting, Advantage+ algorithmic features, creative testing matrices, and direct lead generation forms.
* **Key Concepts:** ODAX campaign objectives, Custom & Lookalike Audiences, Advantage+ campaign mechanics, creative fatigue diagnosis, creative testing matrices, Native Instant Forms, LinkedIn Campaign Manager B2B targeting.
* **Tools Used:** Meta Ads Manager (Draft / Sandbox Mode), Meta Business Suite, Canva, LinkedIn Campaign Manager (Draft).

#### Topic & Lesson Breakdown:
* **Lesson 5.1: Meta Advertising Ecosystem, ODAX & Auction Economics (4h)**
  * *Taught:* The Meta advertising auction; Total Value formula (Bid × Estimated Action Rate × User Value); Outcome-Driven Ad Experience (ODAX) objectives (Awareness, Traffic, Engagement, Leads, App Promotion, Sales); account structure hygiene.
  * *Learner Does:* Map business growth objectives to optimal ODAX campaign types and attribution settings (7-day click, 1-day view).
  * *Outcome:* Meta Campaign Objective & Funnel Architecture Map.
* **Lesson 5.2: Audience Architecture: Custom, Lookalike & Advantage+ (4h)**
  * *Taught:* Audience segmentation across funnel stages; first-party custom audiences (website visitors, customer lists, video viewers); Lookalike audience modeling (1%–5%); broad targeting with Advantage+ audience features; privacy regulations.
  * *Learner Does:* Construct an audience segmentation matrix across Top, Middle, and Bottom of funnel, specifying targeting parameters and exclusion rules.
  * *Outcome:* Meta Full-Funnel Audience Segmentation Blueprint.
* **Lesson 5.3: High-Converting Creative Testing Matrices (4h)**
  * *Taught:* Creative as the new targeting; structuring dynamic creative testing (DCT) campaigns; testing angles (Visual format, Hook, Value Prop, CTA); diagnosing creative fatigue (frequency, CTR drop, rising CPA); iterative creative refresh protocols.
  * *Learner Does:* Build a 3×3 creative testing matrix, pairing 3 distinct visual hooks with 3 copy angles in draft mode.
  * *Outcome:* Meta Creative Testing Matrix & Fatigue Diagnostic SOP.
* **Lesson 5.4: Native Instant Lead Generation Forms & WhatsApp Funnels (4h)**
  * *Taught:* Meta native Instant Forms vs. external landing page conversion; higher-intent form questions; custom qualifying logic; CRM integration protocols; setting up direct Click-to-WhatsApp advertising funnels.
  * *Learner Does:* Build an Instant Lead Form in draft mode with 3 qualifying questions, custom completion screen, and privacy policy integration.
  * *Outcome:* Native Lead Generation Form Blueprint & Qualifying Architecture.
* **Lesson 5.5: Multi-Channel B2B Social: LinkedIn Ads Strategy (4h)**
  * *Taught:* B2B paid social landscape; LinkedIn Campaign Manager architecture; account-based marketing (ABM) targeting by company size, job title, and industry; sponsored content vs. message ads; managing high B2B CPCs through lead magnet offers.
  * *Learner Does:* Draft a complete LinkedIn B2B Sponsored Content campaign plan targeting decision-makers with a gated industry whitepaper.
  * *Outcome:* LinkedIn B2B Account-Based Marketing (ABM) Campaign Blueprint.

---

### MODULE 06: Marketing Analytics & Attribution (24 Guided Hours)
* **Module Purpose:** Establish an empirical measurement infrastructure across web and paid channels, instrumenting custom tracking events in Google Tag Manager, analyzing conversion journeys in GA4, and building executive multi-touch attribution dashboards in Looker Studio.
* **Key Concepts:** Event-based data models, GTM tag/trigger/variable architecture, GA4 Key Event designation, Exploration reports, Multi-touch attribution models (Data-Driven vs. First-Click vs. Last-Click), Looker Studio blended data sources, UTM governance.
* **Tools Used:** Google Analytics 4 (Sandbox + Google Demo Account), Google Tag Manager, Looker Studio, Campaign URL Builder.

#### Topic & Lesson Breakdown:
* **Lesson 6.1: GA4 Architecture, Data Streams & Event-Driven Models (4h)**
  * *Taught:* Contrast between Universal Analytics sessions and GA4 event-based data model; standard vs. custom events; user properties; dimensions and metrics; configuring web data streams; debugging events in DebugView.
  * *Learner Does:* Navigate GA4 interface, configure a student data stream, and verify live events using GA4 DebugView.
  * *Outcome:* GA4 Data Stream Configuration & Event Verification Log.
* **Lesson 6.2: Google Tag Manager (GTM) Deployment & Custom Event Tracking (5h)**
  * *Taught:* GTM container architecture; tags, triggers, and variables; deploying GA4 configuration tags; configuring custom click, button, scroll, and form submission triggers; validating event firing in Tag Assistant Preview mode.
  * *Learner Does:* Build and deploy 4 custom GTM event tags (CTA click, form submit, PDF download, video view) on a sandbox site, exporting the container JSON.
  * *Outcome:* Tested GTM Container Export (JSON) & Tag Assistant Verification Log.
* **Lesson 6.3: Conversion Tracking, Key Events & Audience Building (5h)**
  * *Taught:* Designating events as Key Events (conversions); assigning commercial conversion values; building predictive and behavioral audiences in GA4; linking GA4 with Google Ads for seamless conversion import and audience retargeting.
  * *Learner Does:* Designate 3 Key Events in GA4, create an abandoned funnel audience, and configure the Google Ads conversion import link.
  * *Outcome:* GA4 Key Event Specification & Google Ads Linking Blueprint.
* **Lesson 6.4: Advanced GA4 Exploration Reports & User Journey Analysis (5h)**
  * *Taught:* Building custom GA4 Explorations: Free-form exploration tables, Funnel Exploration (open vs. closed funnels, drop-off rates), Path Exploration (reverse and forward user journey analysis), Cohort Exploration for user retention.
  * *Learner Does:* Build a 4-step Funnel Exploration report in the GA4 Demo Account, analyzing friction points and calculating step-by-step conversion rates.
  * *Outcome:* GA4 Funnel Exploration & User Journey Drop-off Report.
* **Lesson 6.5: Multi-Touch Attribution & Looker Studio Executive Dashboards (5h)**
  * *Taught:* Attribution models (Data-Driven, Last Click, First Click, Linear, Position-Based); cross-channel attribution reporting in GA4; connecting GA4, GSC, and ad platforms to Looker Studio; building interactive executive reporting dashboards with blended data.
  * *Learner Does:* Build a comprehensive single-page Looker Studio dashboard connecting GA4 and GSC data, including KPI scorecards, traffic breakdowns, and conversion charts.
  * *Outcome:* Live Interactive Looker Studio Executive Reporting Dashboard.

---

### MODULE 07: Conversion Rate Optimization (CRO) (16 Guided Hours)
* **Module Purpose:** Systematically increase the percentage of website visitors who convert into leads or paying customers by conducting UX behavioral audits, analyzing friction points, building conversion-focused landing pages, and formulating empirical A/B test hypotheses.
* **Key Concepts:** Conversion heuristics, LIFT model (Value Proposition, Relevance, Clarity, Urgency, Anxiety, Distraction), behavioral analytics (heatmaps, session replays), WordPress Gutenberg/Elementor landing page engineering, A/B split test design, statistical significance.
* **Tools Used:** WordPress (Gutenberg Sandbox), Microsoft Clarity, Google Chrome DevTools, Heuristic Evaluation Rubrics.

#### Topic & Lesson Breakdown:
* **Lesson 7.1: CRO Foundations, Heuristic Frameworks & The LIFT Model (4h)**
  * *Taught:* Conversion rate mathematics; calculating micro and macro conversion rates; heuristic evaluation frameworks; MECLABS conversion heuristic; the LIFT model (Value Proposition, Relevance, Clarity, Urgency vs. Anxiety, Distraction).
  * *Learner Does:* Conduct a heuristic CRO evaluation on an underperforming landing page, scoring each LIFT dimension and documenting 5 prioritized optimization opportunities.
  * *Outcome:* Landing Page Heuristic CRO Audit & Friction Analysis.
* **Lesson 7.2: Behavioral UX Research: Heatmaps, Scroll Depth & Session Replays (4h)**
  * *Taught:* Behavioral analytics deployment; interpreting click heatmaps, scroll depth heatmaps, and move maps in Microsoft Clarity; identifying rage clicks, dead clicks, and excessive scroll fatigue; customer feedback surveys.
  * *Learner Does:* Analyze 10 user session recordings in Microsoft Clarity, mapping behavioral friction patterns and formulating user drop-off hypotheses.
  * *Outcome:* Behavioral UX Research Findings & Session Replay Diagnostic Report.
* **Lesson 7.3: High-Converting Landing Page Design & Copy Architecture (4h)**
  * *Taught:* Above-the-fold visual hierarchy; crafting hero value propositions; social proof integration (reviews, trust badges, client logos); form design optimization (single-step vs. multi-step forms); mobile tap targets and layout responsiveness.
  * *Learner Does:* Build a responsive, conversion-focused campaign landing page on WordPress with lead form, mobile optimization, and thank-you confirmation funnel.
  * *Outcome:* Live WordPress Campaign Landing Page & Lead Funnel.
* **Lesson 7.4: A/B Split Testing Methodology & Statistical Significance (4h)**
  * *Taught:* Scientific A/B testing framework; formulating test hypotheses (If [variable], then [result] because [rationale]); calculating sample size and test duration; understanding statistical significance (p-value < 0.05) and statistical power; test documentation.
  * *Learner Does:* Develop an A/B split testing roadmap containing 3 prioritized test hypotheses with sample size calculations, variant wireframes, and success metrics.
  * *Outcome:* A/B Split Testing Experimentation Roadmap.

---

### MODULE 08: CRM, Lifecycle & Automation (20 Guided Hours)
* **Module Purpose:** Build scalable lead management pipelines and automated customer lifecycle workflows, integrating HubSpot CRM with email marketing platforms (Brevo) and no-code automation engines (n8n) to maximize customer lifetime value (LTV).
* **Key Concepts:** Inbound lead qualification, CRM lifecycle stages (Lead, MQL, SQL, Opportunity, Customer), lead scoring models, automated email nurture sequences, webhook routing, n8n automation workflows, customer retention strategies.
* **Tools Used:** HubSpot CRM (Free/Edu Portal), Brevo, n8n (Community/Desktop Sandbox), Webhooks.

#### Topic & Lesson Breakdown:
* **Lesson 8.1: Inbound Lead Architecture & CRM Pipeline Configuration (4h)**
  * *Taught:* CRM architecture; contact records, deal stages, and company associations; configuring customized deal pipelines; defining lifecycle stage criteria (Subscriber → Lead → MQL → SQL → Opportunity → Customer); pipeline hygiene.
  * *Learner Does:* Set up a complete sales and marketing deal pipeline in HubSpot CRM with custom contact properties and automated deal stage progressions.
  * *Outcome:* Configured HubSpot CRM Lead & Deal Pipeline.
* **Lesson 8.2: Lead Scoring Models & Qualification Frameworks (4h)**
  * *Taught:* Lead qualification frameworks (BANT, MEDDIC, CHAMP); designing explicit (demographic, firmographic) and implicit (behavioral, engagement) lead scoring models; threshold triggers for sales handoff.
  * *Learner Does:* Construct a 100-point lead scoring matrix assigning weighted values to page visits, form fills, email clicks, and job titles.
  * *Outcome:* Weighted Lead Scoring Matrix & Sales Handoff Protocol.
* **Lesson 8.3: Email Marketing Architecture, Deliverability & Compliance (4h)**
  * *Taught:* Modern email marketing infrastructure; domain authentication (SPF, DKIM, DMARC records); sender reputation monitoring; list hygiene; GDPR, CAN-SPAM, and global privacy compliance; designing mobile-responsive email templates.
  * *Learner Does:* Design a responsive branded email newsletter template in Brevo and draft an email deliverability audit checklist.
  * *Outcome:* Branded Responsive Email Template & Deliverability Audit Checklist.
* **Lesson 8.4: Automated Lifecycle Nurture Sequences & Drip Campaigns (4h)**
  * *Taught:* Designing lifecycle email sequences: Welcome series, Lead nurturing drips, Educational email courses, Abandoned funnel re-engagement, Post-purchase onboarding; conditional branching logic based on user engagement.
  * *Learner Does:* Build an automated 5-part email nurture sequence in Brevo with conditional triggers and delay timers.
  * *Outcome:* 5-Stage Automated Lifecycle Email Nurture Workflow.
* **Lesson 8.5: No-Code Marketing Automation with n8n & Webhooks (4h)**
  * *Taught:* Introduction to no-code integration engines (n8n / Make); webhook architecture (payloads, headers, triggers); connecting landing page form webhooks to CRM contact creation and automated Slack/Email lead alerts.
  * *Learner Does:* Build a functional 3-node n8n automation workflow connecting a webhook form trigger to CRM contact creation and automated notification.
  * *Outcome:* Exported n8n Marketing Automation Workflow (JSON).

---

### MODULE 09: AI Marketing Operations (16 Guided Hours)
* **Module Purpose:** Operationalize modern artificial intelligence across marketing workflows, deploying structured prompt engineering, automated content generation pipelines, AI-driven market intelligence, and establishing strict human-in-the-loop ethical governance.
* **Key Concepts:** Prompt engineering frameworks (Role, Task, Context, Constraints, Few-Shot), AI-assisted copywriting (AIDA, PAS), automated research workflows, AI visual concepting, human-in-the-loop verification, AI hallucination management, copyright and data privacy ethics.
* **Tools Used:** ChatGPT (GPT-4o), Google Gemini 1.5 Pro, Claude 3.5 Sonnet, Adobe Firefly, Notion AI prompts.

#### Topic & Lesson Breakdown:
* **Lesson 9.1: Enterprise Prompt Engineering Frameworks for Marketers (4h)**
  * *Taught:* Advanced prompt engineering architecture: System prompts, Role definition, Task decomposition, Few-shot prompting, Chain-of-Thought (CoT) reasoning, Negative constraints; building reusable marketing prompt templates in Notion.
  * *Learner Does:* Author a library of 10 structured, parameterized marketing prompt templates for persona generation, ad angle ideation, and email drafting.
  * *Outcome:* Modular Marketing Prompt Engineering Library.
* **Lesson 9.2: AI-Powered Research, Content Ideation & Copy Drafting (4h)**
  * *Taught:* Conducting automated competitor review mining with LLMs; synthesizing market research data; drafting multi-format copy variations across AIDA and PAS frameworks; tone-of-voice alignment across generative models.
  * *Learner Does:* Use ChatGPT and Claude to analyze 50 customer reviews, extracting core emotional pain points and drafting 5 direct-response ad copy variants.
  * *Outcome:* AI-Assisted Customer Pain Point Analysis & 5-Angle Copy Deck.
* **Lesson 9.3: Generative Visual Ideation & Creative Prototyping (4h)**
  * *Taught:* Generative image and design workflows; prompt crafting for visual concepts; commercially compliant generative tools (Adobe Firefly); background replacement, generative fill, and rapid creative storyboarding for ad campaigns.
  * *Learner Does:* Generate 4 branded concept ad visual variants using Adobe Firefly, applying generative fill and integrating assets into Canva layouts.
  * *Outcome:* Generative AI Creative Visual Concept Suite.
* **Lesson 9.4: Human-in-the-Loop Governance, Fact-Checking & AI Ethics (4h)**
  * *Taught:* Mitigating AI hallucinations and factual inaccuracies; copyright, commercial usage rights, and IP protection; brand safety guidelines; establishing an enterprise Human-in-the-Loop (HITL) review checklist for all AI marketing outputs.
  * *Learner Does:* Draft an agency-grade AI Marketing Usage & Ethical Governance Policy detailing verification steps, human review gates, and prohibited AI uses.
  * *Outcome:* AI Marketing Operational Governance & Compliance SOP.

---

### MODULE 10: Budgeting, Growth & Agency Operations (12 Guided Hours)
* **Module Purpose:** Master the commercial and operational mechanics of high-growth marketing management: modeling multi-channel budgets, managing agency client relationships, authoring statements of work (SOWs), and structuring retainer agreements.
* **Key Concepts:** Top-down vs. bottom-up marketing budgeting, blended ROAS and MER modeling, agency pricing models (Fixed fee, Retainer, Performance + Base), client onboarding workflows, Statements of Work (SOW), executive pitch presentations.
* **Tools Used:** Google Sheets / Financial Models, Notion, Google Slides / Canva Presentation.

#### Topic & Lesson Breakdown:
* **Lesson 10.1: Multi-Channel Budget Allocation & Forecasting (4h)**
  * *Taught:* Modeling multi-channel budget allocations (₹200,000–₹500,000 monthly budgets); top-down business objective modeling vs. bottom-up keyword/audience demand forecasting; channel mix modeling across Search, Social, and Retention; calculating Blended CAC and blended ROAS targets.
  * *Learner Does:* Build a 12-month multi-channel marketing budget spreadsheet allocating ₹300,000/month across search, social, content, and tooling, projecting expected leads and revenue.
  * *Outcome:* 12-Month Multi-Channel Marketing Budget & Forecasting Model.
* **Lesson 10.2: Agency Operations, Pricing Models & Client Retainers (4h)**
  * *Taught:* Agency business models; pricing structures: Hourly vs. Fixed Project vs. Monthly Retainer vs. Performance + Base; scope creep prevention; authoring Statements of Work (SOWs); setting realistic client SLAs and reporting cadence.
  * *Learner Does:* Draft an agency Statement of Work (SOW) and Monthly Retainer Agreement for an integrated digital marketing client, detailing deliverables, timeline, and exclusions.
  * *Outcome:* Agency Client Statement of Work (SOW) & Retainer Contract.
* **Lesson 10.3: Client Discovery, Pitching & Executive Presentations (4h)**
  * *Taught:* Structuring high-impact client pitch presentations; the 10-slide growth deck architecture; presenting complex marketing data to non-technical business executives; handling strategic client objections; post-pitch follow-up protocols.
  * *Learner Does:* Author a 12-slide executive strategic pitch deck presenting an omnichannel growth plan for a prospective enterprise client.
  * *Outcome:* 12-Slide Strategic Growth Pitch Deck.

---

### MODULE 11: Integrated Capstone & Assessment (40 Guided Hours)
* **Module Purpose:** Synthesize all 10 preceding disciplines into an exhaustive, agency-grade digital marketing acquisition and growth strategy for a complex client, followed by a timed technical troubleshooting examination and an oral defense before a faculty review panel.
* **Key Concepts:** Full-funnel synthesis, multi-channel asset compilation, live data tracking verification, technical troubleshooting under timed conditions, oral viva voce defense.
* **Tools Used:** All core and supporting tools across the curriculum.

#### Topic & Lesson Breakdown:
* **Lesson 11.1: Capstone Project Scoping & Client Discovery Brief (6h)**
  * *Taught:* Selecting an approved enterprise capstone client brief (D2C E-Commerce, B2B SaaS, or Multi-Location Healthcare); analyzing market conditions, competitive footprint, historical metrics, and establishing SMART 90-day growth KPIs.
  * *Learner Does:* Conduct client discovery and formulate a formal Capstone Project Charter and KPI Framework.
  * *Outcome:* Capstone Project Charter & Client Scoping Document.
* **Lesson 11.2: Organic Search, GEO & Content Asset Compilation (6h)**
  * *Taught:* Compiling the organic growth suite: Complete 30-keyword topical authority cluster, 3 on-page optimization templates, technical SEO audit remediation plan, LocalBusiness schema JSON-LD, and 30-day organic social calendar with 8 creatives.
  * *Learner Does:* Assemble and cross-link all organic search, GEO, and social assets into the master capstone workspace.
  * *Outcome:* Capstone Organic Search & Content Master Suite.
* **Lesson 11.3: Paid Acquisition Architecture & Landing Page Funnel Build (8h)**
  * *Taught:* Engineering the paid acquisition suite: Google Search campaign architecture (3 ad groups, RSAs, negative lists), Meta lead generation campaign (Instant Form + creative matrix), and publishing a responsive campaign landing page on WordPress with lead forms.
  * *Learner Does:* Build and document all paid campaigns in draft mode, connecting the live WordPress landing page URL and thank-you funnel.
  * *Outcome:* Capstone Paid Media & Conversion Landing Page Suite.
* **Lesson 11.4: Measurement Tagging, GA4 Tracking & Looker Studio Integration (8h)**
  * *Taught:* Instrumenting tracking infrastructure: Deploying GTM container tags, designating GA4 Key Events, configuring UTM links, building the single-page Looker Studio executive dashboard connecting simulated performance data.
  * *Learner Does:* Verify tag firing in Tag Assistant, export GTM container JSON, designate GA4 Key Events, and deliver an interactive Looker Studio dashboard link.
  * *Outcome:* Capstone Tracking Infrastructure & Interactive Executive Dashboard.
* **Lesson 11.5: Practical Technical Troubleshooting Examination (6h)**
  * *Taught:* Timed practical laboratory examination diagnosing broken marketing infrastructure: resolving broken GTM triggers, fixing ad policy disapprovals, repairing 404 indexing errors, diagnosing tracking attribution discrepancies, and correcting email deliverability failures.
  * *Learner Does:* Complete a 3-hour timed diagnostic troubleshooting exam resolving 5 live broken marketing environments, submitting diagnostic logs.
  * *Outcome:* Completed Practical Technical Troubleshooting Exam Record.
* **Lesson 11.6: Final Capstone Portfolio Submission & Oral Viva Voce Defense (6h)**
  * *Taught:* Assembling the complete Master Portfolio Deck; oral presentation standards; defending budget allocation math, attribution methodology, channel selection, and AI ethical boundaries; viva voce examination rubrics.
  * *Learner Does:* Present a 20-minute oral defense of their complete capstone growth plan before a faculty evaluation panel, answering technical and strategic cross-examination questions.
  * *Outcome:* Evaluated Oral Viva Voce Examination Record & Certified Strategist Credential Award.

---

## 6. Projects, Deliverables & Comprehensive Capstone Blueprint

### 6.1 Six Core Modular Projects

Throughout Modules 01 to 10, students build 6 production-grade modular deliverables that form verifiable proof-of-work:

1. **Project 01: Business Intelligence & Market Strategy Dossier (Module 01)**
   * *Brief:* Conduct market footprint research, customer unit economics modeling (CAC/LTV), buyer persona dossier synthesis, and competitor ad transparency audit for an enterprise client.
   * *Deliverable:* Financial unit economics model, 2 comprehensive buyer persona dossiers, competitor ad transparency audit matrix, and strategic campaign brief.
2. **Project 02: Advanced SEO, GEO & Topical Authority Architecture (Module 02)**
   * *Brief:* Architect an organic search domination strategy: 30-keyword topical authority cluster, 3-page on-page SEO optimization plan, technical crawl audit checklist, and LocalBusiness JSON-LD schema.
   * *Deliverable:* Multi-tab search spreadsheet, on-page optimization templates, GSC diagnostic findings, and verified Schema.org code.
3. **Project 03: Multi-Channel Performance Advertising Blueprint (Modules 04 & 05)**
   * *Brief:* Construct an integrated paid acquisition system in draft mode without ad spend: Google Search campaign with RSAs and negative lists, paired with a Meta lead-generation campaign with Instant Forms and a 3×3 creative matrix.
   * *Deliverable:* Google Ads Editor export / campaign build spreadsheet, Meta Instant Form setup preview, copy deck, and 8 production ad creatives.
4. **Project 04: Conversion Landing Page & GTM Measurement Engine (Modules 06 & 07)**
   * *Brief:* Build and deploy a responsive campaign landing page on WordPress, configure GTM container with 4 custom event triggers, verify GA4 Key Events in DebugView, and draft a heuristic CRO audit.
   * *Deliverable:* Live landing page URL, exported GTM container JSON file, Tag Assistant debug screenshots, and CRO friction analysis.
5. **Project 05: Automated CRM Lead Pipeline & Lifecycle Workflow (Module 08)**
   * *Brief:* Set up a complete lead lifecycle system in HubSpot CRM with custom deal stages and lead scoring, paired with an automated 5-stage email nurture sequence in Brevo and an n8n webhook routing workflow.
   * *Deliverable:* HubSpot deal pipeline configuration screenshots, 5-stage email sequence copy deck in Brevo, and exported n8n workflow JSON.
6. **Project 06: Multi-Channel Marketing Budget & Executive Reporting Suite (Modules 06 & 10)**
   * *Brief:* Model a 12-month ₹300,000/month multi-channel marketing budget forecasting blended CAC and ROAS, connected to an interactive single-page Looker Studio executive dashboard.
   * *Deliverable:* 12-month financial forecasting spreadsheet, interactive Looker Studio shareable URL, and 12-slide client growth pitch deck.

### 6.2 Flagship Capstone: The Omnichannel Growth Playbook & Defense

The capstone synthesizes all disciplines into a master growth strategy for a client with an allocated monthly budget of ₹200,000–₹500,000. Students submit a Master Growth Playbook (Notion/PDF) and defend their work in an oral viva examination.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        FLAGSHIP CAPSTONE DELIVERABLE ARCHITECTURE                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Strategic Discovery: Unit economics (CAC/LTV), ICP personas, competitor moats       │
│ 2. Organic Search & GEO: 30-keyword topical cluster, LocalBusiness schema, AI overview │
│ 3. Paid Media Builds: Google Search RSAs + Meta Lead Ads + LinkedIn ABM (Draft Mode)   │
│ 4. Conversion Engine: Live WordPress landing page with working forms & thank-you funnel│
│ 5. Analytics & Tagging: GTM JSON container, GA4 Key Events, Tag Assistant debug logs   │
│ 6. Lifecycle & Automation: HubSpot deal pipeline, 5-part Brevo sequence, n8n workflow │
│ 7. BI Dashboard: Single-page interactive Looker Studio executive dashboard             │
│ 8. Financial Modeling: ₹300,000/mo budget allocation model & 90-day testing roadmap     │
│ 9. Technical Troubleshooting Exam: 3-hour timed diagnostic laboratory test             │
│ 10. Oral Viva Voce: 20-minute live strategic defense before faculty panel              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Assessment Model, Rubrics & Delivery Feasibility

### 7.1 Authoritative Assessment Weighting Model

Certification requires passing all components with an aggregate score of 70% or higher:

| Assessment Component | Weight | Assessment Method | Evaluation Criteria |
| :--- | :--- | :--- | :--- |
| **Modular Projects (6 Core Projects)** | **40%** | Portfolio Artifact Review | Technical accuracy, platform hygiene, strategic alignment, adherence to professional formatting standards. |
| **Integrated Omnichannel Capstone** | **30%** | Comprehensive Project Evaluation | Cross-channel cohesion, financial modeling accuracy, conversion architecture, funnel completeness. |
| **Practical Technical Troubleshooting Exam**| **15%** | Timed Hands-On Laboratory Test | Root-cause diagnosis speed, tag debugging competence, indexing repair, ad policy remediation. |
| **Oral Viva Voce & Strategic Defense** | **15%** | Live Panel Examination (20 min) | Strategic reasoning, clarity of thought, defense of budget/attribution decisions, AI ethical boundaries. |
| **TOTAL** | **100%** | **Dual Portfolio + Exam + Viva** | **Minimum 70% overall (min 65% on Capstone & Viva)** |

### 7.2 Tool-to-Module Mapping Matrix

| Module | Core Production Tools | Supporting & Workflow Tools | Exposure & Specialized Tools |
| :--- | :--- | :--- | :--- |
| **01. Business & Marketing Strategy** | ChatGPT, Google Gemini | Notion, Google Trends, Meta Ad Library | Similarweb |
| **02. Advanced SEO, GEO & Search** | Google Search Console, Keyword Planner | Google Trends, Google Business Profile | Semrush (Demo), Screaming Frog (Free) |
| **03. Content, Social & Brand Strategy**| Canva Pro, ChatGPT | Meta Business Suite, Claude 3.5 Sonnet, Notion | Mobile Video Editor |
| **04. Google Ads Strategy** | Google Ads (Draft), Ads Editor | Google Keyword Planner | — |
| **05. Meta & Multi-channel Advertising**| Meta Ads Manager (Draft), Canva | Meta Business Suite | LinkedIn Campaign Manager (Draft) |
| **06. Marketing Analytics & Attribution**| GA4 (Live + Demo), GTM, Looker Studio | Campaign URL Builder | — |
| **07. Conversion Rate Optimization** | WordPress (Gutenberg Sandbox) | Microsoft Clarity, DevTools | VWO / A/B Simulators |
| **08. CRM, Lifecycle & Automation** | HubSpot CRM (Free/Edu Portal) | Brevo (Free Tier), n8n (Community) | Webhooks |
| **09. AI Marketing Operations** | ChatGPT, Google Gemini | Claude 3.5 Sonnet, Notion | Adobe Firefly |
| **10. Budgeting & Agency Operations** | Looker Studio | Google Sheets Financial Models, Notion | Google Slides / Canva Presentation |
| **11. Integrated Capstone & Assessment**| Google Ads, Meta Ads, GA4, GTM, Looker | WordPress, HubSpot, Brevo, n8n, Canva | All verified tools |

### 7.3 Delivery Feasibility & Operational Guardrails

1. **Zero-Ad-Spend Compliance:** All paid campaigns are built in draft/export modes. Personal credit cards are never required.
2. **Free-Tier / Educational Governance:** HubSpot CRM (Free Portal), Brevo (Free 300 emails/day), n8n (Community self-hosted / desktop app), and LocalWP (Free local WordPress) ensure students incur zero ongoing software subscription costs.
3. **Enterprise Demonstration Access:** High-cost enterprise tools ($130–$300/mo subscriptions such as Semrush, Ahrefs, and LinkedIn Ads) are demonstrated through live instructor walkthroughs and guided free exploratory features.
4. **AI Platform Access:** Students utilize standard free or accessible tiers of ChatGPT (GPT-4o), Google Gemini, and Claude, adhering to daily rate limits through modular prompt distribution.

---

## 8. Codebase Implementation Roadmap (Files Requiring Updates)

When authorized to implement the redesign in subsequent tasks, changes will be restricted to the following exact files:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SUBSEQUENT CODEBASE MODIFICATION MAP                            │
├──────────────────────────────────────┬─────────────────────────────────────────────────┤
│ Target File                          │ Scope of Required Modification                   │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ 1. data.js (NS_COURSES)              │ Update id === "dm-mastery" name, 11-module      │
│                                      │ curriculum, 240 hours, selling price (44900).   │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ 2. data.js (NS_ACADEMIES)            │ Update identical dm-mastery record inside       │
│                                      │ digital-marketing academy courses array.        │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ 3. data/courses/dm-mastery.json      │ Authoritative deep course payload: 11 modules,  │
│                                      │ 53 detailed lessons, 6 projects, 11 FAQs.       │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ 4. nova-skills-109-course-content.   │ Synchronize master catalog at index 0,          │
│    json                              │ preserving identical 32-key schema uniformity.  │
├──────────────────────────────────────┼─────────────────────────────────────────────────┤
│ 5. js/data.min.js                    │ Rebuild minified bundle via build_min_js.js.    │
└──────────────────────────────────────┴─────────────────────────────────────────────────┘
```

> [!CAUTION]
> In accordance with NOVA-DMS-STRAT-01 rules, **NO website production files were modified during this academic specification task**.

---

## 9. Discrepancies Found in Existing Course Content

During the preflight forensic audit, the following legacy defects were identified in the existing `dm-mastery` data store:

1. **Stale Course Title:** Cataloged as *"AI Digital Marketing Master"* across `data.js`, `dm-mastery.json`, and `nova-skills-109-course-content.json`, rather than the approved modern title *"AI Digital Marketing Strategist"*.
2. **Stale Commercial Pricing:** Cataloged at `price: 31499` in `data.js` instead of the approved commercial price of `₹44,900` (Original: `₹89,999`).
3. **Truncated Curriculum Skeleton:** The existing catalog describes only 6 modules (24 lessons total), which is insufficient for a 240-hour 6-month flagship career program. This specification expands the curriculum to 11 comprehensive modules (53 detailed lessons).
4. **Boilerplate Lesson Content:** Lessons in `data/courses/dm-mastery.json` contain repetitive placeholder sentences rather than authentic, verified instructional specifications.
5. **Missing Strategic Domains:** The existing syllabus completely omits critical modern competencies: Generative Engine Optimization (GEO), Conversion Rate Optimization (CRO), n8n no-code automation, multi-touch attribution modeling, and agency business operations.
6. **Inadequate Project & FAQ Coverage:** Contains only 3 generic project bullets and 3 superficial FAQs, failing to address the Zero-Ad-Spend policy, realistic career roles, or independent practice expectations.

---

## 10. Authoritative Sign-Off & Verification

* **Academic Hours Verification:** Exactly 11 modules summing to **240 Guided Instructional Hours** (verified: `16 + 28 + 20 + 28 + 20 + 24 + 16 + 20 + 16 + 12 + 40 = 240`).
* **Tool Stack Realism:** 10 Core Production Tools, 10 Supporting Tools, and 5 Exposure Tools mapped to actual module practicals under zero-ad-spend and educational-tier sandboxes.
* **Preservation of dm-professional:** The recently completed redesign of `dm-professional` (AI Digital Marketing Specialist, 3 Months / 120 Hours / ₹24,900) remains completely preserved and distinct.
* **Production Integrity:** Working tree on `transformation/nova-course-redesign` is clean. Zero production code modified in this task.

**STATUS:** APPROVED & READY FOR IMPLEMENTATION TASKS.
