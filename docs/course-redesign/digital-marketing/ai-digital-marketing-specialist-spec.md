# AI Digital Marketing Specialist — Authoritative Academic Specification

**Document Title:** Authoritative Academic & Curriculum Delivery Specification  
**Course Name:** AI Digital Marketing Specialist  
**Previous Course Name:** AI Digital Marketing Professional  
**Course ID:** `dm-professional` *(Strictly Preserved — Permanent Identifier)*  
**Project:** Nova Skills Course Portfolio Transformation  
**Task ID:** NOVA-DMS-01  
**Active Branch:** `transformation/nova-course-redesign`  
**Academy:** Digital Marketing Academy (`digital-marketing`)  
**Document Status:** AUTHORITATIVE SPECIFICATION — READY FOR REVIEW  
**Effective Date:** October 24, 2026  
**Parent Workspace:** `c:\Users\wasee\Desktop\NovaSkillsProject\NovaSkills Website`  

---

## 1. Executive Summary & Codebase Baseline Audit

### 1.1 Course Identity & Strategic Re-Alignment
This document establishes the authoritative, academically rigorous, and operationally feasible curriculum specification for **AI Digital Marketing Specialist** (Course ID: `dm-professional`). 

The course is undergoing a formal redesign from its legacy title **"AI Digital Marketing Professional"** to **"AI Digital Marketing Specialist"** to precisely reflect market expectations for junior-to-mid career-track professionals in modern search, social, paid media, analytics, and AI-assisted marketing workflows. 

The course ID `dm-professional` remains immutable to ensure backward compatibility across all site routing, URL structures (`/course-detail.html?id=dm-professional`), deep JSON endpoints, and analytics tagging.

### 1.2 Baseline Codebase Forensic Audit
Prior to establishing this specification, a forensic audit of the existing codebase was conducted across `data.js`, individual course storage JSONs, and master backup files:

1. **Catalog Entry in `data.js` (lines 98–170 and lines 7455–7527):**
   - Listed Name: `AI Digital Marketing Specialist` (formerly `AI Digital Marketing Professional`)
   - Published Fee: ₹24,900 (Catalog Original: ₹49,999; ~50% discount)
   - Duration Fields: `duration: "3 Months"`, `durationMonths: 3`, `learningHours: 120`
   - Tools Listed: `Google Ads`, `Meta Ads Manager`, `GA4`, `SEMrush`, `Canva`, `ChatGPT`, `Looker Studio`
   - Curriculum: Outdated 5-module summary skeleton (20 lessons) with generic titles.
2. **Deep Course JSON in `data/courses/dm-professional.json`:**
   - Listed Name: `AI Digital Marketing Professional`
   - Duration Fields: `duration: "4 Months"`, `learning_hours: 160` (discrepancy with `data.js` 120h)
   - Content: Repetitive boilerplate text across all lessons (*"Step-by-step breakdown of [Lesson Name]"*).
   - Tool Coverage: Vague tool claims without hands-on lab configurations or student access guidelines.
3. **Master Fallback in `nova-skills-109-course-content.json` (lines 641–720+):**
   - Matches `data/courses/dm-professional.json` exactly.
4. **Architectural Two-Tier Loading Pipeline:**
   - As documented in `website-pilot-plan.md`, `course-detail.js` renders Tier 0 synchronous metadata from `data.js` (both from `NS_COURSES` and `NS_ACADEMIES`), followed by an asynchronous Tier 1 fetch of `/data/courses/dm-professional.json` (falling back to Tier 2 `nova-skills-109-course-content.json`).
5. **No Production Website Files Changed in this Task:**
   - In accordance with the project preflight rules, this specification is strictly contained within `docs/course-redesign/digital-marketing/ai-digital-marketing-specialist-spec.md`. No live HTML, JavaScript, CSS, or production JSON files are modified.

### 1.3 Commercial Pricing & Tuition (Formally Approved)
- **Approved Redesigned Selling Price:** **INR 24,900** before GST (formally approved under TASK: NOVA-DMS-09).
- **Catalog Original Fee:** **INR 49,999** (~50% discount).
- **Payment Terms:** Flexible 3-month no-cost EMI option available; 18% GST extra where applicable.

---

## 2. Positioning & Academy Differentiation Matrix

To eliminate cannibalization and curriculum ambiguity, Nova Skills maintains four distinct programs within the Digital Marketing Academy:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               NOVA SKILLS DIGITAL MARKETING ACADEMY MATRIX                             │
├───────────────────────┬──────────────────────┬─────────────┬──────────────┬────────────────────────────┤
│ Course ID             │ Program Name         │ Level       │ Duration     │ Core Focus & Scope         │
├───────────────────────┼──────────────────────┼─────────────┼──────────────┼────────────────────────────┤
│ digital-marketing-pro │ Digital Marketing    │ Beginner    │ 3 Months     │ Basic digital literacy,    │
│                       │ Standard / Foundation│             │ (88 Hours)   │ local shop setup, organic  │
│                       │                      │             │              │ posting, boosted ads       │
├───────────────────────┼──────────────────────┼─────────────┼──────────────┼────────────────────────────┤
│ dm-professional       │ AI Digital Marketing │ Beginner+ / │ 3 Months     │ Comprehensive career track:│
│ (THIS COURSE)         │ Specialist           │ Career Entry│ (120 Guided  │ multi-channel ads, SEO,    │
│                       │                      │             │ + 40-60h lab)│ GTM/GA4, email automation  │
├───────────────────────┼──────────────────────┼─────────────┼──────────────┼────────────────────────────┤
│ perf-marketing-pro    │ Performance          │ Specialist /│ 3 Months     │ Advanced paid media, ROAS, │
│                       │ Marketing Specialist │ Mid-Level   │ (120 Hours)  │ CAPI, server-side tracking,│
│                       │                      │             │              │ CRO, algorithmic bidding   │
├───────────────────────┼──────────────────────┼─────────────┼──────────────┼────────────────────────────┤
│ dm-mastery            │ AI Digital Marketing │ Advanced /  │ 6 Months     │ Omnichannel leadership,    │
│                       │ Master               │ Strategic   │ (240 Hours)  │ agency retainer growth,    │
│                       │                      │             │              │ full-funnel strategy & ops │
└───────────────────────┴──────────────────────┴─────────────┴──────────────┴────────────────────────────┘
```

### 2.1 Course Boundaries & Explicit Non-Goals
To preserve pedagogical focus and academic integrity, **AI Digital Marketing Specialist** enforces explicit boundaries:
- **NOT an Advanced Full-Funnel Strategist Course:** Focuses on tactical execution, campaign configuration, and channel optimization, not corporate CMO strategy or complex omnichannel revenue modeling (reserved for `dm-mastery`).
- **NOT an Advanced Technical Performance-Marketing Course:** Covers client-ready Google and Meta Ads, standard web Google Tag Manager, and GA4 event tracking, but does **not** cover custom server-side CAPI Docker containers, data warehouse BigQuery pipelines, or algorithmic bidding script development (reserved for `perf-marketing-pro`).
- **NOT a Complete Shopify Growth Course:** Focuses on lead-generation, local business growth, service businesses, and general landing page conversion flows. Does not cover advanced e-commerce catalog feeds, headless Shopify storefronts, or marketplace inventory operations.
- **NOT an Advanced Agentic AI Engineering Course:** AI is taught as an assistive copilot (ideation, persona drafting, ad copy generation, keyword clustering, and visual asset generation). Does **not** include Python scripting, LLM fine-tuning, Model Context Protocol (MCP) server development, or custom multi-agent autonomous framework development.
- **Clear Separation from `digital-marketing-pro` (Foundation):** While `digital-marketing-pro` caters to small business owners seeking basic digital presence, `dm-professional` trains students for full-time agency and corporate roles requiring rigorous keyword mapping, multi-ad-group structures, web tracking implementation, and formal reporting.

---

## 3. Learner Profile, Target Roles & Learning Model

### 3.1 Target Audience
1. **Absolute Beginners & College Students:** Seeking structured, career-launching digital skills to enter the marketing workforce.
2. **Career Switchers:** Professionals from non-marketing domains (sales, BPO, administrative, retail) aiming to transition into agency or in-house marketing positions.
3. **Junior Marketing Executives:** Early-career marketers with 3–12 months of unstructured experience seeking to validate and professionalize their technical competencies.
4. **Entrepreneurs & Business Operators:** Founders needing practical command over customer acquisition, ad budget controls, and analytics to scale their own ventures.

### 3.2 Target Entry-Level Roles
Graduates are trained and assessed for direct employability in the following entry-level roles:
- **Digital Marketing Executive**
- **Junior SEO Executive**
- **Social Media Marketing Executive**
- **Junior Paid Ads Executive**
- **Digital Marketing Assistant**

### 3.3 Dual-Track Workload Model
The program operates on a **3-Month / 12 Teaching Week** schedule with an exact dual-track hourly architecture:

- **Guided Training (Classroom & Supervised Lab):** **Exactly 120 Hours**  
  Paced at **10 guided hours per week** over 12 weeks. Guided training encompasses instructor-led lectures, live tool walkthroughs, guided classroom practicals, and supervised troubleshooting sessions.
- **Independent Practice (Recommended Self-Study & Homework):** **40–60 Additional Hours**  
  Clearly separated from guided instructional hours. Dedicated to self-paced tool navigation, creative variations, independent research, portfolio polishing, and assessment preparation.
- **Total Student Time Investment:** **160–180 Hours** across 12 calendar weeks.

---

## 4. Software & Toolstack Validation (October 2026 Platform Reality)

To maintain academic authenticity and prevent unrealistic promises, the toolstack is strictly segmented into three verified operational tiers:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    TOOLSTACK CLASSIFICATION & PROFICIENCY                              │
├─────────────────────────┬──────────────────────────────────┬───────────────────────────────────────────┤
│ Tier Classification     │ Tools Included                   │ Pedagogical Expectation                   │
├─────────────────────────┼──────────────────────────────────┼───────────────────────────────────────────┤
│ CORE TOOLS              │ 1. Google Ads                    │ Teach to Practical Proficiency:           │
│ (Practical Proficiency) │ 2. Meta Ads Manager              │ Students independently configure accounts,│
│                         │ 3. Google Analytics 4 (GA4)      │ build campaigns in draft/live mode, create│
│                         │ 4. Google Search Console         │ conversion tags, execute audits, and      │
│                         │ 5. Canva                         │ produce commercial assets.                │
│                         │ 6. ChatGPT                       │                                           │
│                         │ 7. Google Gemini                 │                                           │
├─────────────────────────┼──────────────────────────────────┼───────────────────────────────────────────┤
│ SUPPORTING TOOLS        │ 1. Google Keyword Planner        │ Working Proficiency:                      │
│ (Working Proficiency)   │ 2. Google Trends                 │ Students utilize tool functions for data  │
│                         │ 3. Google Business Profile       │ extraction, basic configuration, content  │
│                         │ 4. WordPress                     │ publishing, tag deployment, and automated │
│                         │ 5. Google Tag Manager            │ email sequencing.                         │
│                         │ 6. Looker Studio                 │                                           │
│                         │ 7. Meta Business Suite           │                                           │
│                         │ 8. Brevo                         │                                           │
├─────────────────────────┼──────────────────────────────────┼───────────────────────────────────────────┤
│ EXPOSURE TOOLS          │ 1. Semrush / Ahrefs              │ Introductory Only:                        │
│ (Introductory Only)     │ 2. Microsoft Clarity             │ Students understand tool utility, view    │
│                         │ 3. Adobe Firefly                 │ demonstrations, and analyze sample data   │
│                         │                                  │ without requiring paid master accounts.   │
└─────────────────────────┴──────────────────────────────────┴───────────────────────────────────────────┘
```

### 4.1 Strict Zero-Student-Ad-Spend Policy
No student shall ever be required or pressured to connect personal credit cards or spend personal money on Google or Meta advertising. 
- All campaign creation practicals are conducted using:
  1. Instructor-managed sandbox/test ad accounts.
  2. Free advertiser accounts in draft/paused mode (configured up to the billing step).
  3. Offline offline campaign planning workbooks and JSON export simulations.
- Instructors demonstrate live campaign publishing and performance metrics using pre-funded academy demonstration assets.

### 4.2 Verified October 2026 Platform Feature Matrix
All curriculum modules strictly conform to vendor-verified capabilities as of October 24, 2026:

| Platform / Tool | Verified Feature Status (Oct 2026) | Academic & Delivery Guidance |
|---|---|---|
| **Google Ads** | • **AI Max for Search:** Generally Available (GA). Integrates broad match, dynamic asset creation, and final URL expansion inside Search campaigns.<br>• **Performance Max (PMax):** GA cross-network campaign type.<br>• **Smart Bidding:** GA standard (Target CPA, Target ROAS).<br>• **Conversational Campaign Creation:** GA via Gemini in Google Ads. | Teach foundational manual search ad groups first. Introduce AI Max and PMax as automated extensions with mandatory negative keyword and brand exclusions to prevent wasted spend. |
| **Meta Ads Manager** | • **Advantage+ Campaigns:** GA for shopping and lead generation.<br>• **Advantage+ Creative:** GA dynamic text, visual touches, and aspect-ratio adjustments.<br>• **Instant Forms:** GA native mobile lead capture. | Teach manual campaign structure (Campaign -> Ad Set -> Ad) before introducing Advantage+ automation. Emphasize policy compliance and ad review guidelines. |
| **Google Analytics 4** | • **Key Events:** Replaced legacy conversion terminology. GA.<br>• **Enhanced Measurement:** GA automated event collection.<br>• **Consent Mode v2:** Mandatory framework for Google tags.<br>• **Read-Only Demo Account:** Strictly read-only. | Students must use an authorized staging/sandbox website for hands-on tagging. The Google Merchandise Store demo account is used solely for report navigation. |
| **Google Tag Manager** | • **Web Containers:** GA standard container model.<br>• **Tag Assistant Preview:** GA live debugging tool. | Focus exclusively on client-side web GTM. Server-side GTM is out of scope. |
| **Google Search Console** | • **Core Web Vitals:** INP (Interaction to Next Paint) permanently replaced FID. GA.<br>• **Page Indexing & URL Inspection:** GA. | Students audit verified staging domains or analyze pre-packaged real-world diagnostic exports. |
| **Search AI / GEO / AEO** | • **AI Overviews:** GA in Google Search.<br>• **AI Mode / Conversational Search:** GA in Gemini & Search.<br>• **Evidence-Based Optimization:** Entity clarity, schema markup, and authoritative citation. | **Strict Rule:** Zero tolerance for bogus "guaranteed AI ranking shortcuts". Optimization is grounded in structured data, topical depth, and verified citation patterns. |
| **Looker Studio** | • **GA4 & GSC Connectors:** GA native connectors. | Students link verified test properties or public Google Sheets connectors to build live dashboards. |
| **Brevo** | • **Free Tier:** 300 emails/day, unlimited contacts, visual workflow automation builder. GA. | Compliant test lists only. Strict adherence to CAN-SPAM, GDPR, and opt-in standards. |
| **WordPress** | • **Block Editor (Gutenberg):** Core page editor. GA.<br>• **Lead Form Plugins:** WPForms / Fluent Forms free tier. | Provided via local WordPress environments (LocalWP) or cloud-hosted multi-tenant student sandboxes. |
| **Microsoft Clarity** | • **Heatmaps & Session Recordings:** 100% Free GA product with zero traffic limits. | Demonstrated on sandbox landing pages to observe user scrolling and rage-click behavior. |
| **Adobe Firefly** | • **Generative Fill / Text-to-Image:** Commercial safe generative tool. | Covered at exposure level via web interface free tier credits. |
| **Semrush / Ahrefs** | • **Enterprise SaaS ($130+/mo):** High cost barrier. | Covered via free tier features (Ahrefs Webmaster Tools / Semrush 10 free daily searches) and instructor demonstrations. |

---

## 5. Comprehensive 8-Module Curriculum Specification

### Hour Allocation Summary (Strict Verification)
$$\text{Guided Hours} = 10 + 16 + 16 + 20 + 14 + 12 + 8 + 24 = \mathbf{120\text{ Hours}}$$

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              GUIDED TRAINING HOURLY BREAKDOWN                          │
├──────┬────────────────────────────────────────────────────────────┬────────────────────┤
│ Mod  │ Module Title                                               │ Guided Hours       │
├──────┼────────────────────────────────────────────────────────────┼────────────────────┤
│ 01   │ Marketing Fundamentals & Customer Research                 │ 10 Hours           │
│ 02   │ SEO, Local SEO & AI Search Fundamentals                    │ 16 Hours           │
│ 03   │ Social Media Marketing, Content & AI Creatives             │ 16 Hours           │
│ 04   │ Google Ads & Meta Ads Fundamentals                         │ 20 Hours           │
│ 05   │ Website, Landing Pages & Conversion Basics                 │ 14 Hours           │
│ 06   │ GA4, Analytics, Conversion Tracking & Reporting            │ 12 Hours           │
│ 07   │ Email Marketing & Basic Automation                         │ 8 Hours            │
│ 08   │ Industry Capstone, Portfolio & Final Assessment            │ 24 Hours           │
├──────┴────────────────────────────────────────────────────────────┼────────────────────┤
│ TOTAL GUIDED INSTRUCTIONAL HOURS                                  │ 120 Hours          │
├───────────────────────────────────────────────────────────────────┼────────────────────┤
│ RECOMMENDED INDEPENDENT PRACTICE & LAB WORKLOAD                   │ 40–60 Hours        │
└───────────────────────────────────────────────────────────────────┴────────────────────┘
```

---

### MODULE 01: Marketing Fundamentals & Customer Research
- **Guided Duration:** 10 Hours (Target: Week 1)
- **Pedagogical Level:** Foundational to Applied Strategy
- **Module Purpose:** Establish an empirical, structured understanding of modern digital ecosystems, consumer psychology, market research, and campaign planning before engaging technical ad tools.

#### Topic & Subtopic Map
1. **Digital Marketing Ecosystem & Business Models (2.5h)**
   - Evolution of marketing: Traditional broadcast vs. digital two-way communication.
   - B2B (Business-to-Business) vs. B2C (Business-to-Consumer) mechanics, sales cycles, and decision-maker journeys.
   - Omnichannel vs. multichannel marketing: Owned, earned, and paid media taxonomy.
2. **Customer Psychology, Intent & Journey Mapping (2.5h)**
   - The modern customer journey: Awareness, Consideration, Conversion, Retention, Advocacy.
   - Customer search and social intent: Informational, Navigational, Commercial, and Transactional triggers.
   - Segmentation, Targeting, and Positioning (STP) framework.
   - Ideal Customer Profile (ICP) definitions vs. granular Buyer Persona dossiers.
3. **Competitive Intelligence & Market Research (2.5h)**
   - Direct vs. indirect competitors: Market positioning matrices.
   - Competitor digital footprint analysis: Organic presence, ad transparency libraries (Meta Ad Library, Google Ads Transparency Center).
   - Market demand validation using free research tools (Google Trends, AnswerThePublic).
4. **Campaign Objectives, Funnels & Brief Formulation (2.5h)**
   - Marketing funnels: TOFU (Top of Funnel), MOFU (Middle of Funnel), BOFU (Bottom of Funnel).
   - Establishing quantifiable KPIs: Impressions, Clicks, CTR, Leads, CAC, ROAS.
   - Crafting compelling Value Propositions and Offer Positioning.
   - Developing an industry-standard Creative & Campaign Brief.

#### Delivery Feasibility Specifications
- **Primary & Supporting Software:**
  - *Primary:* ChatGPT (Free Tier), Google Gemini (Free Tier), Google Trends (Free Web Tool).
  - *Supporting:* Meta Ad Library (Public Web Tool), Google Ads Transparency Center (Public Web Tool).
- **Classroom Practical:**
  - Conduct an in-depth market research workshop for a realistic local business (e.g., an independent dental clinic, an organic specialty cafe, or a regional vocational training academy). Formulate 2 distinct buyer personas, map their 5-stage customer journey, and execute a reverse-engineered ad transparency audit on 2 direct competitors.
- **Student Deliverable:**
  - *Deliverable 1.1:* Comprehensive Customer Persona & Competitor Research Dossier (including 2 buyer personas, competitor ad analysis, and funnel map).
- **Assessment Evidence:**
  - Rubric-evaluated strategy document demonstrating clear differentiation between B2B/B2C logic, evidence of real ad library research, and realistic funnel KPI targets.
- **Required Accounts & Permissions:**
  - Free personal Google Account (for Gemini and Trends) and OpenAI account (for ChatGPT). No paid accounts or credit cards required.
- **Free/Paid Access Limitations:**
  - Completely accessible on 100% free web tools.
- **Offline Fallback Exercise:**
  - Provided offline PDF dossiers of competitor marketing assets and printed Customer Persona templates for offline synthesis and manual funnel mapping.
- **Relevant October 2026 Feature Availability:**
  - Gemini 1.5 Flash / 2.0 and GPT-4o free tiers fully capable of synthesizing unstructured market data into structured customer persona tables.

---

### MODULE 02: SEO, Local SEO & AI Search Fundamentals
- **Guided Duration:** 16 Hours (Target: Weeks 2–3)
- **Pedagogical Level:** Technical & Practical Search Optimization
- **Module Purpose:** Impart durable, search-engine-compliant organic optimization skills across on-page, local, and basic technical SEO, alongside an evidence-based introduction to AI Overviews and Search Generative Experience (AEO/GEO).

#### Topic & Subtopic Map
1. **Search Engines, Crawling & Indexing Mechanics (3.0h)**
   - How search engines discover, crawl, render, index, and rank content.
   - Sitemaps (`sitemap.xml`) and robots exclusion protocol (`robots.txt`).
   - Understanding search intent: Navigational, informational, commercial investigation, transactional.
2. **Keyword Research, Intent Clustering & Mapping (4.0h)**
   - Keyword research methodology: Search volume, keyword difficulty, search intent alignment.
   - Long-tail keywords vs. head terms.
   - Keyword clustering using Google Keyword Planner, Google Suggest, and AI assistants.
   - Constructing a hierarchical site Keyword Map (URL-to-Keyword mapping).
3. **On-Page & Content Optimization (3.0h)**
   - Title tag architecture, meta description copywriting, and URL slug optimization.
   - Heading tag hierarchy (`H1`, `H2`, `H3`) and semantic HTML structure.
   - Content optimization: Keyword placement, readability, topical depth, and internal linking strategies.
   - Image SEO: Descriptive filenames, alt text, file compression, and modern formats (WebP).
4. **Google Search Console & Basic Technical SEO (3.0h)**
   - GSC property setup and verification methods (DNS, HTML tag, GA4).
   - Analyzing the GSC Performance Report: Queries, pages, impressions, clicks, average CTR, average position.
   - Diagnosing indexing issues via the Page Indexing report and URL Inspection Tool.
   - Introduction to Core Web Vitals (LCP, INP, CLS) and mobile usability.
5. **Local SEO, Google Business Profile & AI Search Realities (3.0h)**
   - Google Business Profile (GBP) optimization: NAP (Name, Address, Phone) consistency, categories, attributes, and reviews.
   - Local Pack ranking factors: Relevance, distance, prominence. Local business schema (`LocalBusiness` JSON-LD).
   - Evidence-based Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO).
   - How Google AI Overviews and Gemini-powered search surface citations.
   - **Strict Academic Boundary:** Scientific debunking of "guaranteed AI ranking hacks". Focus on entity clarity, factual authority, and structured data.

#### Delivery Feasibility Specifications
- **Primary & Supporting Software:**
  - *Primary:* Google Search Console (Live/Demo Property), Google Keyword Planner (via Free Google Ads Expert Mode), Google Trends.
  - *Supporting:* Google Business Profile interface, Semrush/Ahrefs (Free Tier / Demo), Schema Markup Generator (TechnicalSEO.com).
- **Classroom Practical:**
  - Build a multi-page keyword map (15+ keywords grouped by intent across 5 pages). Execute an on-page SEO optimization plan for 5 key web pages. Run a technical audit checklist and analyze a verified GSC performance dataset. Complete a full local SEO audit and Google Business Profile optimization plan for a local enterprise.
- **Student Deliverable:**
  - *Student Deliverable 1:* Comprehensive SEO Audit & Keyword Map Document (including 5-page on-page optimization, GSC diagnostic findings, and local SEO action plan).
- **Assessment Evidence:**
  - Graded spreadsheet containing URL-to-keyword mappings, optimized title/meta tags, schema markup snippet, and local citation audit.
- **Required Accounts & Permissions:**
  - Google Account. Read/write access to sandbox WordPress site or staging environment; access to a verified GSC property (or instructor-provided verified staging domain).
- **Free/Paid Access Limitations:**
  - Google Search Console and Google Keyword Planner are 100% free. Semrush/Ahrefs limited strictly to free exploratory tier or instructor screen-share demos.
- **Offline Fallback Exercise:**
  - Downloaded CSV exports of Google Search Console performance data and offline HTML/text templates for manual title/meta/heading optimization and schema authoring.
- **Relevant October 2026 Feature Availability:**
  - Interaction to Next Paint (INP) is the permanent Core Web Vital metric in Search Console. Google AI Overviews are fully integrated into search results globally.

---

### MODULE 03: Social Media Marketing, Content & AI Creatives
- **Guided Duration:** 16 Hours (Target: Weeks 3–4)
- **Pedagogical Level:** Creative Production & Channel Strategy
- **Module Purpose:** Develop end-to-end competency in organic social media management, brand visual systems, conversion copywriting, short-form video concepts, and generative AI creative workflows.

#### Topic & Subtopic Map
1. **Platform Architecture & Audience Dynamics (3.0h)**
   - Platform algorithms and user mindsets: Instagram (visual/lifestyle), Facebook (community/local), LinkedIn (professional/B2B).
   - Organic distribution mechanics: Engagement signals, watch time, shares, and saves.
   - Native business tools: Meta Business Suite for centralized scheduling, inbox management, and analytics.
2. **Content Strategy & Editorial Planning (3.0h)**
   - Defining Content Pillars: Educational, Entertaining, Inspiring, and Promotional mixes (e.g., 80/20 rule).
   - Building 14-day and 30-day editorial content calendars.
   - Brand voice consistency, tone adaptation across channels, and crisis response guidelines.
3. **Copywriting, Creative Angles & Hooks (3.0h)**
   - Conversion copywriting frameworks: AIDA (Attention, Interest, Desire, Action), PAS (Problem, Agitate, Solve), BAB (Before, After, Bridge).
   - Hook generation for social feeds and short-form video (first 3 seconds rule).
   - Crafting actionable Calls to Action (CTAs) that drive comments, DMs, or clicks.
4. **Visual Design Systems with Canva (3.0h)**
   - Principles of visual hierarchy, typographic pairing, color contrast, and brand consistency.
   - Canva design systems: Setting up Brand Kits (palettes, fonts, logos).
   - Designing high-CTR static social graphics and multi-slide carousels.
   - Designing ad creative variations (feed square `1:1`, story/reel vertical `9:16`).
5. **Short-Form Video & AI Creative Workflows (4.0h)**
   - Anatomy of viral/high-converting short-form videos (Reels, TikTok/Shorts).
   - Scriptwriting, storyboarding, shot lists, and pacing.
   - Basic mobile video editing and assembly (cuts, text overlays, captions, pacing).
   - AI-assisted ideation using ChatGPT and Google Gemini for content calendars, video scripts, and caption variations.
   - Basic generative image workflows (Adobe Firefly / Canva Magic Studio free features): Prompting, inpainting, style matching.
   - Ethical, copyright, and commercial compliance in generative AI content.

#### Delivery Feasibility Specifications
- **Primary & Supporting Software:**
  - *Primary:* Canva (Free Tier / Education), Meta Business Suite, ChatGPT, Google Gemini.
  - *Supporting:* Adobe Firefly (Free web tier), CapCut / VN Video Editor (Free mobile/desktop versions).
- **Classroom Practical:**
  - Develop a complete 14-day multi-channel social media content calendar. Design 8 production-grade social creatives in Canva (including at least 2 multi-slide carousels and 2 vertical promo stories). Script and storyboard 4 short-form video concepts, producing at least 1 fully edited mobile reel.
- **Student Deliverable:**
  - *Student Deliverable 3:* Multi-Channel Social Media Campaign Portfolio (14-day calendar, 8 polished Canva creatives, and 4 short-form video scripts/reels).
- **Assessment Evidence:**
  - Evaluation of design hierarchy, brand consistency, hook strength, adherence to platform aspect ratios, and responsible commercial AI usage.
- **Required Accounts & Permissions:**
  - Free Canva account, personal Instagram/Facebook account linked to a test Facebook Business Page, free OpenAI and Google accounts.
- **Free/Paid Access Limitations:**
  - Canva Free tier provides comprehensive template and design functionality without requiring Canva Pro.
- **Offline Fallback Exercise:**
  - Printable content calendar grid templates, storyboard sketch sheets, and local open-source image editing (Photopea / GIMP) or offline video editing drills.
- **Relevant October 2026 Feature Availability:**
  - Meta Business Suite cross-posting and Reels A/B testing GA. Generative text and visual expansion tools in Canva and Firefly generally available.

---

### MODULE 04: Google Ads & Meta Ads Fundamentals
- **Guided Duration:** 20 Hours (Target: Weeks 5–6)
- **Pedagogical Level:** Applied Paid Acquisition & Media Buying
- **Module Purpose:** Master the mechanics, architectures, bidding strategies, policy constraints, and execution of paid search (Google Ads) and paid social (Meta Ads) advertising without risking personal student capital.

#### Topic & Subtopic Map
1. **Paid Advertising Foundations & Economics (3.0h)**
   - The paid acquisition ecosystem: Search intent vs. push/interruption social advertising.
   - Advertising auction models: Ad Rank, Quality Score, Expected CTR, Ad Relevance, Landing Page Experience.
   - Core commercial metrics: CPM, CPC, CTR, Conversion Rate, CPL, CPA, and ROAS.
   - Account governance: Google Ads MCC vs. Individual Accounts; Meta Business Manager / Portfolio vs. Personal Ad Accounts.
2. **Google Search Ads Architecture & Campaign Build (5.0h)**
   - Campaign hierarchy: Account -> Campaign -> Ad Groups -> Keywords & Ads.
   - Keyword Match Types: Broad Match, Phrase Match, Exact Match.
   - Negative Keyword Lists: Account-level, campaign-level, and ad-group-level negative keyword hygiene.
   - Responsive Search Ads (RSA): Headline diversity (15 headlines), description variations (4 descriptions), pinning logic.
   - Ad Assets (Extensions): Sitelinks, Callouts, Structured Snippets, Call assets, Lead Form assets.
   - Search Term Report analysis: Mining high-converting queries and pruning budget-wasting terms.
3. **Google Bidding Strategies, Performance Max & AI Max (3.0h)**
   - Bidding fundamentals: Manual CPC vs. Smart Bidding (Maximize Clicks, Maximize Conversions, Target CPA, Target ROAS).
   - Budget controls, daily pacing, and delivery methods.
   - Conversion Actions: Primary vs. Secondary conversion tracking in Google Ads.
   - Introduction to Performance Max (PMax): Cross-network reach (Search, YouTube, Display, Discover, Maps), asset groups, audience signals.
   - Introduction to AI Max for Search: Dynamic headlines/descriptions, final URL expansion, broad match integration, and required brand/URL exclusions.
4. **Meta Ads Manager Structure & Objective Selection (4.0h)**
   - Meta Campaign Hierarchy: Campaign (Objective) -> Ad Set (Audience, Budget, Placement) -> Ad (Creative & Copy).
   - Campaign Objectives under ODAX (Outcome-Driven Ad Experiences): Awareness, Traffic, Engagement, Leads, App Promotion, Sales.
   - Audience targeting taxonomy: Core Audiences (location, demographics, detailed interests/behaviors), Custom Audiences (website visitors, customer lists), Lookalike Audiences.
   - Placement optimization: Advantage+ Placements vs. Manual Placements (Feeds, Stories, Reels, Right Column).
   - Budget allocation: Campaign Budget Optimization (Advantage Campaign Budget) vs. Ad Set Budget Optimization (ABO).
5. **Meta Lead Generation, Advantage+ & Compliance (5.0h)**
   - Building Native Instant Forms (Lead Gen): Intro, questions, prefill logic, privacy policy requirement, completion screen.
   - Creative formats: Single image, carousel, video ads, dynamic creative variations.
   - Advantage+ Creative enhancements and Advantage+ Lead Campaigns overview.
   - Retargeting fundamentals: Custom audience creation from web traffic and page engagement.
   - Platform Advertising Policies: Prohibited content, misleading claims, personal attributes, health/finance restrictions, and account suspension prevention.

#### Delivery Feasibility Specifications
- **Primary & Supporting Software:**
  - *Primary:* Google Ads (Expert Mode - Free Draft/Staging Account), Meta Ads Manager (Sandbox / Draft Mode).
  - *Supporting:* Google Ads Editor (Desktop Software), Meta Business Suite, Google Keyword Planner.
- **Classroom Practical:**
  - Configure one end-to-end Google Search Campaign in draft mode (2 ad groups, tightly clustered keywords, negative keyword list, 1 responsive search ad with 10+ headlines and 4 descriptions, 3 ad assets, and Maximize Conversions bidding).
  - Configure one end-to-end Meta Lead Generation Campaign in draft mode (1 campaign, 2 distinct ad set targetings, 1 native instant lead form with custom qualifying questions, and 2 ad creative variants).
- **Student Deliverable:**
  - *Student Deliverable 4:* Google & Meta Advertising Campaign Project Evidence (comprehensive campaign build workbook, exported ad spreadsheets, draft preview screenshots, and compliance verification checklist).
- **Assessment Evidence:**
  - Rubric grading of campaign structure, match type discipline, negative keyword coverage, ad relevance, copy hook quality, instant form compliance, and adherence to zero-spend policy.
- **Required Accounts & Permissions:**
  - Personal Google account to access Google Ads in Expert Mode (set up without billing info via "Create an account without a campaign"). Personal Facebook account to create a Meta Business Portfolio and access Meta Ads Manager in draft mode.
- **Free/Paid Access Limitations:**
  - Both platforms permit 100% free campaign architecture, draft creation, and previewing without entering credit cards or incurring ad spend.
- **Offline Fallback Exercise:**
  - Google Ads Editor offline database files (`.csv` / `.xml` import) and Meta Ads bulk upload Excel sheets, allowing students to design, audit, and validate complete ad structures entirely offline.
- **Relevant October 2026 Feature Availability:**
  - AI Max features in Search campaigns GA. Meta Advantage+ lead campaign automation and dynamic creative enhancements GA.

---

### MODULE 05: Website, Landing Pages & Conversion Basics
- **Guided Duration:** 14 Hours (Target: Weeks 7–8)
- **Pedagogical Level:** Technical Web Marketing & Conversion Rate Optimization
- **Module Purpose:** Equip learners to design, edit, and optimize conversion-focused campaign landing pages, embed functional lead generation mechanisms, and test end-to-end customer conversion journeys.

#### Topic & Subtopic Map
1. **Web Marketing Fundamentals & Information Architecture (2.5h)**
   - Websites vs. Dedicated Campaign Landing Pages: The 1:1 conversion ratio principle.
   - Anatomy of a high-converting landing page: Above-the-fold elements, value proposition, hero section, visual proof, feature/benefit matrix, social proof, FAQ, and footer CTA.
   - Mobile-first responsive UX: Tap targets, sticky CTAs, readable typography, and page speed impacts.
2. **WordPress Block Editing & Page Construction (3.5h)**
   - WordPress CMS architecture: Pages vs. Posts, themes vs. plugins, block editor (Gutenberg) mechanics.
   - Editing and structuring landing pages using core WordPress blocks (Columns, Groups, Covers, Buttons).
   - Utilizing visual page builders (e.g., Elementor Free / Gutenberg Block Plugins) for rapid responsive layout design.
3. **Conversion Copywriting, CTA Hierarchy & Trust Signals (2.5h)**
   - Formulating benefit-driven headlines and compelling subheadings.
   - Call to Action (CTA) hierarchy: Primary vs. Secondary CTAs, button microcopy, and psychological friction reduction.
   - Trust and credibility architecture: Customer testimonials, case snippets, trust badges, security seals, and clear privacy links.
4. **Lead Capture, Forms & Thank-You Page Funnels (3.0h)**
   - Designing effective lead generation forms: Balancing field count with lead quality (form friction vs. conversion rate).
   - Installing and configuring WordPress form plugins (WPForms / Fluent Forms).
   - Creating custom Thank-You Pages: Confirmation messaging, setting user expectations, and secondary conversion prompts.
   - Lead magnets: Delivery mechanisms via thank-you redirects or immediate automated asset download links.
5. **Campaign Tracking Infrastructure & Journey Testing (2.5h)**
   - UTM parameter fundamentals: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`.
   - Google Campaign URL Builder workflow.
   - Introduction to Conversion Rate Optimization (CRO): Identifying conversion leaks, analyzing bounce rates, and basic A/B testing concepts.
   - End-to-end conversion journey testing: Verifying form submissions, testing lead notification emails, and validating redirect paths.

#### Delivery Feasibility Specifications
- **Primary & Supporting Software:**
  - *Primary:* WordPress CMS (Sandbox / LocalWP / Cloud Staging), WPForms / Fluent Forms (Free), Campaign URL Builder.
  - *Supporting:* Elementor (Free) or Gutenberg Blocks, Microsoft Clarity (Free), Browser Developer Tools (Responsive Design Mode).
- **Classroom Practical:**
  - Build a responsive, standalone campaign landing page on a WordPress sandbox site for a specific marketing campaign. Write all conversion copy, design the layout, embed a working multi-field lead capture form, configure a personalized Thank-You redirect page, append UTM tracking parameters, and execute a live end-to-end test submission.
- **Student Deliverable:**
  - *Student Deliverable 2:* Fully Functional, Optimized Campaign Landing Page (live staging URL or LocalWP export, with working lead form, thank-you page flow, and UTM tracking documentation).
- **Assessment Evidence:**
  - Evaluated on mobile responsiveness, visual hierarchy, clarity of value proposition, working form-to-redirect flow, and error handling.
- **Required Accounts & Permissions:**
  - Admin/Editor access to a designated WordPress sandbox site (provided by academy or installed locally via free LocalWP software).
- **Free/Paid Access Limitations:**
  - LocalWP is 100% free and open-source for local machine hosting. WordPress core and form plugins used are 100% free.
- **Offline Fallback Exercise:**
  - LocalWP desktop software installed on student computers, enabling complete WordPress landing page development, form testing, and styling without internet connectivity.
- **Relevant October 2026 Feature Availability:**
  - Modern WordPress Gutenberg block layout tools and native responsive controls generally available.

---

### MODULE 06: GA4, Analytics, Conversion Tracking & Reporting
- **Guided Duration:** 12 Hours (Target: Weeks 8–9)
- **Pedagogical Level:** Technical Analytics, Tracking Implementation & Business Intelligence
- **Module Purpose:** Provide practical, hands-on mastery over Google Analytics 4 (GA4), web conversion tracking via Google Tag Manager (GTM), data hygiene, and automated executive reporting in Looker Studio.

#### Topic & Subtopic Map
1. **Google Analytics 4 Architecture & Data Models (2.5h)**
   - Evolution from Universal Analytics (session-based) to GA4 (event-driven data model).
   - Account structure: Organizations, Accounts, Properties, and Web/App Data Streams.
   - Enhanced Measurement: Automated collection of pageviews, 90% scrolls, outbound clicks, site search, and file downloads.
   - GA4 Interface navigation: Standard Reports (Acquisition, Engagement, Monetization, Retention).
   - Traffic Acquisition reporting: Default Channel Groups, Source/Medium, and campaign attribution basics.
2. **Google Tag Manager (GTM) Fundamentals & Event Tracking (3.5h)**
   - Why use GTM: Separating measurement configuration from core web code.
   - GTM Hierarchy: Accounts, Containers, Tags, Triggers, and Variables.
   - GTM Built-in Variables (Click URL, Click Classes, Page Path) and custom triggers (All Clicks, Form Submission, Custom Event).
   - Deploying the Google Tag (`gtag.js` / Google Tag in GTM) on a WordPress site.
   - Configuring custom GA4 Event Tags (e.g., `generate_lead`, `button_click`, `form_submit`).
   - Using GTM Preview & Debug Mode (Tag Assistant) to inspect tag firing, trigger conditions, and variable values.
3. **Key Events, Conversion Tracking & Measurement Hygiene (2.0h)**
   - The "Key Events" terminology in GA4 (formerly conversions): Marking high-value events as Key Events.
   - Linking GA4 with Google Ads and Google Search Console.
   - Importing GA4 Key Events into Google Ads for smart bidding optimization.
   - Measurement hygiene: Internal traffic filtering (excluding employee IP addresses) and Consent Mode v2 basics (`ad_storage`, `analytics_storage`).
   - **Crucial Delivery Reality:** The Google Analytics demo account (Google Merchandise Store) is strictly read-only and cannot be used for tagging practice. Tagging must occur on student sandbox sites.
4. **Core Marketing Math, KPIs & Commercial Metrics (2.0h)**
   - Computational formulas and business meaning of:
     $$\text{CTR} = \frac{\text{Clicks}}{\text{Impressions}} \times 100\%$$
     $$\text{CPC} = \frac{\text{Total Cost}}{\text{Clicks}}$$
     $$\text{CPL} = \frac{\text{Total Cost}}{\text{Total Leads Generated}}$$
     $$\text{CPA} = \frac{\text{Total Cost}}{\text{Total Acquisitions}}$$
     $$\text{ROAS} = \frac{\text{Total Revenue from Ads}}{\text{Total Ad Spend}}$$
   - Calculating Break-Even ROAS and Customer Acquisition Cost (CAC) vs. Customer Lifetime Value (LTV).
5. **Dashboard Construction in Looker Studio (2.0h)**
   - Connecting Looker Studio to GA4 and Google Search Console data sources.
   - Visualizing data: Scorecards (Sessions, Key Events, Spend), Time Series charts (daily traffic trends), Tables with Heatmaps (Top Landing Pages, Channel Acquisition), Donut charts (Device breakdown).
   - Date range controls, channel filters, and client-ready layout formatting.
   - Interpreting performance trends and drafting executive summary commentary.

#### Delivery Feasibility Specifications
- **Primary & Supporting Software:**
  - *Primary:* Google Analytics 4, Google Tag Manager, Looker Studio.
  - *Supporting:* Google Search Console, Tag Assistant Companion (Chrome Extension), GA4 Demo Account (for reporting analysis only).
- **Classroom Practical:**
  - Install a GTM container onto the student's sandbox WordPress landing page. In GTM, configure and debug 3 specific tracking events: a outbound phone/WhatsApp click, a custom button click, and a successful lead form submission. Verify event firing in Tag Assistant and GA4 DebugView. Mark the lead event as a GA4 Key Event. Build a clean, single-page marketing performance dashboard in Looker Studio connecting the GA4 property.
- **Student Deliverable:**
  - *Student Deliverable 5:* GA4 & Looker Studio Marketing Dashboard & Tracking Verification Report (including live Looker Studio shareable link, GTM container export, and Tag Assistant debug screenshots).
- **Assessment Evidence:**
  - Verification of functional GTM tags, correct firing triggers, valid GA4 event parameters, correct KPI calculation in reports, and professional dashboard design.
- **Required Accounts & Permissions:**
  - Google Account. Admin access to GTM container, edit access to GA4 sandbox property, and edit access to sandbox WordPress site for tag placement.
- **Free/Paid Access Limitations:**
  - GA4, GTM, and Looker Studio are 100% free enterprise-grade tools provided by Google.
- **Offline Fallback Exercise:**
  - Simulated GTM container JSON inspection, offline event-trigger architecture mapping worksheets, and raw CSV analytics data sets imported into Google Sheets to build offline KPI dashboards.
- **Relevant October 2026 Feature Availability:**
  - GA4 Key Events terminology standard across all interfaces. GTM Tag Assistant debugging tool generally available. Consent Mode v2 standard.

---

### MODULE 07: Email Marketing & Basic Automation
- **Guided Duration:** 8 Hours (Target: Week 10)
- **Pedagogical Level:** Direct Response Marketing & Marketing Automation
- **Module Purpose:** Teach ethical, permission-based email marketing, audience segmentation, conversion-driven copywriting, and automated welcome/nurturing sequences using modern ESP software.

#### Topic & Subtopic Map
1. **Email Marketing Mechanics, Deliverability & Compliance (2.0h)**
   - The strategic value of owned audiences vs. rented platform algorithms.
   - Global compliance and email ethics: Consent mechanisms, double opt-in, unsubscribe requirements (CAN-SPAM, GDPR, DPDP compliance).
   - Email deliverability fundamentals: Sender reputation, domain authentication (SPF, DKIM, DMARC overview), bounce rates (hard vs. soft), and spam trigger avoidance.
2. **Audience Segmentation, Contact Lists & Lead Ingestion (2.0h)**
   - Contact list hygiene: List building, cleaning inactive contacts, and handling unsubscribes.
   - Audience segmentation: Demographic, engagement-based (opens/clicks), and behavioral segmentation.
   - Connecting landing page forms to an Email Service Provider (ESP) via native integrations or webhooks.
3. **Email Copywriting, Design & Subject Line Optimization (2.0h)**
   - Anatomy of a marketing email: Sender name, subject line, preheader text, body copy, visual hero, and primary CTA.
   - Copywriting frameworks for email: The Soap Opera Sequence, problem-solution storytelling, and urgency/scarcity ethics.
   - A/B testing subject lines: Open rate optimization strategies.
   - Designing responsive emails using drag-and-drop template builders.
4. **Brevo Setup & Automated Nurturing Workflows (2.0h)**
   - Overview of Brevo (formerly Sendinblue): Free tier capabilities, contact management, and automation builder.
   - Setting up a 3-part automated Lead Nurturing / Welcome Sequence:
     - *Email 1:* Immediate Lead Magnet Delivery & Welcome (sent instantly upon signup).
     - *Email 2:* Brand Story, Core Problem & Educational Value (sent Day +2).
     - *Email 3:* Social Proof, Case Study & Direct Offer / Call to Action (sent Day +4).
   - Trigger conditions, delay timers, and basic goal exits in automation workflows.

#### Delivery Feasibility Specifications
- **Primary & Supporting Software:**
  - *Primary:* Brevo (Free Tier ESP), ChatGPT / Gemini (Copywriting assistance).
  - *Supporting:* WordPress Form Integration (WPForms / Fluent Forms), Mail-Tester.com (Deliverability testing).
- **Classroom Practical:**
  - Create a free Brevo account. Build a dedicated subscriber list with custom contact attributes. Design a responsive, branded email template. Construct a complete 3-email automated welcome/nurturing sequence with configured delay triggers. Execute a live test by submitting a test email through the landing page form and verifying automated email delivery.
- **Student Deliverable:**
  - *Capstone Component / Module Deliverable:* Complete 3-Part Automated Lead Nurturing Email Sequence (copy deck, responsive Brevo template screenshots, and active automation workflow map).
- **Assessment Evidence:**
  - Graded on compliance (clear unsubscribe and address footer), subject line strength, copy cohesion, template responsiveness, and correct automation workflow logic.
- **Required Accounts & Permissions:**
  - Free Brevo account (requires valid email; free tier allows up to 300 emails/day without credit card).
- **Free/Paid Access Limitations:**
  - Brevo free tier is fully sufficient for training, contact management, template design, and automated workflow triggers.
- **Offline Fallback Exercise:**
  - Email copy deck authored in Google Docs / Word with explicit delay logic annotations, subject line A/B variants, and printed workflow logic diagrams.
- **Relevant October 2026 Feature Availability:**
  - Brevo visual automation builder GA. Strict Google/Yahoo 2024 bulk sender rules (SPF/DKIM/easy unsubscribe) enforced as standard deliverability instruction.

---

### MODULE 08: Industry Capstone, Portfolio & Final Assessment
- **Guided Duration:** 24 Hours (Target: Weeks 11–12)
- **Pedagogical Level:** Integrative Capstone, Industry Defense & Assessment
- **Module Purpose:** Synthesize all course competencies into a comprehensive, multi-channel marketing campaign portfolio for a real or realistic local business, followed by rigorous practical examination and oral viva voce defense.

#### Topic & Subtopic Map
1. **Industry Business Brief Analysis & Campaign Scoping (3.0h)**
   - Selecting an enterprise or realistic local business case study (e.g., healthcare clinic, boutique fitness gym, home services provider, professional services consultancy).
   - Analyzing business objectives, target audience, competitive landscape, and budget allocation (e.g., simulating a ₹50,000 monthly marketing budget across channels).
   - Establishing multi-channel campaign architecture: SEO strategy, Social calendar, Google Search ads, Meta Lead generation, Landing page conversion flow, and Email nurturing.
2. **Integrated Asset Production & Technical Assembly (7.0h)**
   - Executing the complete asset suite under instructor supervision:
     - *SEO Component:* Local SEO audit, GBP optimization plan, and 15-keyword intent map.
     - *Landing Page Component:* Conversion-optimized page on WordPress sandbox with working lead form and thank-you redirect.
     - *Creative Component:* 8 Canva ad creatives and 14-day social editorial schedule.
     - *Paid Media Component:* Fully structured Google Search campaign build (ad groups, RSAs, negative keywords) and Meta Lead Generation ad set build.
     - *Tracking Component:* GTM container configuration with custom event tags and GA4 Key Event marking.
     - *Email Component:* 3-email Brevo nurturing sequence tied to form submission.
     - *Reporting Component:* Integrated Looker Studio dashboard connecting live/sample data.
3. **Data Analysis, Performance Interpretation & Optimization Planning (4.0h)**
   - Simulating 30 days of campaign performance data across channels.
   - Analyzing mock/live campaign data: Identifying winning search terms, diagnosing high CPCs, evaluating landing page conversion drop-offs, and calculating ROAS and CPL.
   - Formulating an executive 30-day Optimization Action Plan based on empirical data findings.
4. **Portfolio Packaging, Documentation & GitHub/Web Showcase (4.0h)**
   - Structuring a professional digital marketing portfolio case study.
   - Documenting the problem statement, strategic rationale, execution evidence, visual assets, and measurable business outcomes.
   - Hosting and formatting portfolio documentation (Notion, LinkedIn Featured, PDF presentation deck, or personal portfolio website).
   - Resume and interview preparation: Articulating digital marketing competencies for target roles.
5. **Practical Examination, Project Presentation & Viva Voce (6.0h)**
   - Individual 15-minute capstone project presentation to faculty/industry panel.
   - Comprehensive practical examination: Live technical troubleshooting drill (e.g., diagnosing a broken GTM trigger, identifying a policy rejection in Meta Ads, or finding indexing errors in Search Console).
   - Oral Viva Voce: Defending strategic decisions, budgeting rationale, attribution methodology, and AI ethical boundaries.

#### Delivery Feasibility Specifications
- **Primary & Supporting Software:**
  - All course tools: Google Ads, Meta Ads Manager, GA4, GTM, Looker Studio, Google Search Console, WordPress, Canva, Brevo, ChatGPT, Google Gemini.
- **Classroom Practical:**
  - Build, assemble, document, and defend the integrated local-business marketing portfolio case study under simulated agency deadline conditions.
- **Student Deliverable:**
  - *Student Deliverable 6 (Final Capstone):* The Integrated AI Digital Marketing Specialist Portfolio Case Study (encompassing all 7 prior module outputs synthesized into an executive presentation deck and live technical assets).
- **Assessment Evidence:**
  - Multi-rubric formal evaluation across: Strategy & Research (15%), Creative & Copywriting (15%), Technical SEO & Web UX (15%), Paid Media Architecture (20%), Analytics & Tracking Implementation (15%), Written Portfolio Presentation (10%), and Oral Viva Voce Defense (10%).
- **Required Accounts & Permissions:**
  - Full access to all student accounts created throughout Modules 01–07.
- **Free/Paid Access Limitations:**
  - Entire capstone executed on free tiers, sandboxes, and student demonstration properties. Zero advertising budget required.
- **Offline Fallback Exercise:**
  - Comprehensive offline presentation deck (PowerPoint / PDF) containing high-resolution screenshots, exported CSV tracking logs, campaign planning spreadsheets, and printed marketing strategy documentation defended in person.
- **Relevant October 2026 Feature Availability:**
  - Current platform interfaces and reporting tools utilized for authentic industry readiness.

---

## 6. Student Deliverables & Portfolio Architecture

To ensure immediate employability, every student must complete and retain **6 Core Tangible Deliverables** forming a cohesive professional hiring portfolio:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE 6 CORE STUDENT PORTFOLIO DELIVERABLES                              │
├─────┬───────────────────────────────────────────┬──────────────┬───────────────────────────────────────┤
│ #   │ Deliverable Title                         │ Lead Module  │ Tangible Student Work Product         │
├─────┼───────────────────────────────────────────┼──────────────┼───────────────────────────────────────┤
│ 1   │ SEO Audit & Keyword Map                   │ Module 02    │ Multi-tab spreadsheet: 15+ clustered  │
│     │                                           │              │ keywords, 5-page on-page SEO plan, GSC│
│     │                                           │              │ technical audit, and Local GBP plan   │
├─────┼───────────────────────────────────────────┼──────────────┼───────────────────────────────────────┤
│ 2   │ Optimized Campaign Landing Page           │ Module 05    │ Live WordPress page: conversion-copy, │
│     │                                           │              │ mobile UX, functional lead form,      │
│     │                                           │              │ thank-you page, and UTM tracking      │
├─────┼───────────────────────────────────────────┼──────────────┼───────────────────────────────────────┤
│ 3   │ Social Media Creative Campaign            │ Module 03    │ 14-day multi-channel editorial grid,  │
│     │                                           │              │ 8 Canva creatives (carousels/stories),│
│     │                                           │              │ and 4 short-form video scripts/reels  │
├─────┼───────────────────────────────────────────┼──────────────┼───────────────────────────────────────┤
│ 4   │ Google & Meta Advertising Project Evidence│ Module 04    │ Verified campaign builds: Search ad   │
│     │                                           │              │ groups with RSAs & negative keywords; │
│     │                                           │              │ Meta lead-gen ad sets & instant forms │
├─────┼───────────────────────────────────────────┼──────────────┼───────────────────────────────────────┤
│ 5   │ GA4 & Looker Studio Reporting Dashboard   │ Module 06    │ Live interactive Looker Studio report │
│     │                                           │              │ connected to GA4, with verified GTM   │
│     │                                           │              │ container export & debug logs         │
├─────┼───────────────────────────────────────────┼──────────────┼───────────────────────────────────────┤
│ 6   │ Integrated Capstone Case Study            │ Module 08    │ Complete end-to-end client portfolio: │
│     │                                           │              │ business strategy, channel execution, │
│     │                                           │              │ performance analysis, and viva defense│
└─────┴───────────────────────────────────────────┴──────────────┴───────────────────────────────────────┘
```

---

## 7. Curriculum Mapping & Synthesis

### 7.1 Tool-to-Module Mapping Matrix
Every software tool taught in the program is strictly mapped to specific instructional modules, ensuring practical lab integration and preventing ungrounded tool claims:

| Tool / Software | Tier Classification | Primary Module(s) | Classroom Lab / Applied Usage |
|---|:---:|:---:|---|
| **Google Ads** | CORE | Module 04, 08 | Search campaign build, RSA creation, negative keywords, AI Max & PMax overview |
| **Meta Ads Manager** | CORE | Module 04, 08 | Lead gen campaign structure, audience targeting, instant forms, Advantage+ creative |
| **Google Analytics 4 (GA4)** | CORE | Module 06, 08 | Property setup, data streams, key event marking, traffic acquisition analysis |
| **Google Search Console** | CORE | Module 02, 06, 08 | Performance reporting, indexing diagnosis, URL inspection, Core Web Vitals |
| **Canva** | CORE | Module 03, 05, 08 | Brand kits, static ad graphics, multi-slide carousels, vertical story/reel assets |
| **ChatGPT** | CORE | Module 01, 03, 07, 08 | Buyer personas, ad copy variation generation, SEO content outlines, email drafts |
| **Google Gemini** | CORE | Module 01, 02, 03, 08 | Market research, search intent clustering, creative hooks, AI Overviews analysis |
| **Google Keyword Planner** | SUPPORTING | Module 02, 04 | Search volume estimation, keyword expansion, intent clustering, bidding benchmarks |
| **Google Trends** | SUPPORTING | Module 01, 02 | Seasonal trend validation, regional interest comparison, brand search share |
| **Google Business Profile** | SUPPORTING | Module 02, 08 | Local pack optimization, NAP consistency audit, business category configuration |
| **WordPress** | SUPPORTING | Module 05, 06, 08 | Landing page block editing, Gutenberg layout styling, lead form plugin integration |
| **Google Tag Manager** | SUPPORTING | Module 06, 08 | Web container deployment, custom click and form triggers, GA4 event tags |
| **Looker Studio** | SUPPORTING | Module 06, 08 | Executive dashboard authoring, GA4 and GSC data connectors, KPI scorecards |
| **Meta Business Suite** | SUPPORTING | Module 03, 04 | Organic content scheduling, cross-posting, unified inbox, organic engagement review |
| **Brevo** | SUPPORTING | Module 07, 08 | Subscriber list management, responsive email builder, automated welcome workflows |
| **Semrush or Ahrefs** | EXPOSURE | Module 02 | Competitive keyword overview, domain authority concept, backlink profile analysis |
| **Microsoft Clarity** | EXPOSURE | Module 05 | Session recording observation, click heatmaps, scroll depth, rage-click identification |
| **Adobe Firefly** | EXPOSURE | Module 03 | Generative text-to-image ideation, generative fill, visual backdrop manipulation |

---

### 7.2 Module-to-Assessment Mapping Matrix

| Module | Formative Assessment (Weekly Lab Checks) | Summative Assessment Evidence | Weighting |
|---|---|---|:---:|
| **MOD 01: Marketing Fundamentals** | Persona worksheet & competitor ad transparency inspection | Deliverable 1.1: Customer Persona & Competitor Dossier | 8% |
| **MOD 02: SEO & Local SEO** | Title/meta tag authoring drill & GSC indexing check | Deliverable 1: Comprehensive SEO Audit & Keyword Map | 14% |
| **MOD 03: Social Media & Content** | Carousel layout check & short-form video hook pitch | Deliverable 3: Social Media Campaign Portfolio (8 assets) | 12% |
| **MOD 04: Google & Meta Ads** | Keyword match type test & instant form setup check | Deliverable 4: Google & Meta Campaign Build Evidence | 18% |
| **MOD 05: Landing Pages & UX** | Mobile responsiveness check & test form submission | Deliverable 2: Live WordPress Campaign Landing Page | 12% |
| **MOD 06: GA4, GTM & Reporting** | GTM Tag Assistant debug check & math formulas quiz | Deliverable 5: Looker Studio Dashboard & GTM Export | 12% |
| **MOD 07: Email & Automation** | Deliverability checklist & subject line A/B test | Deliverable 7.1: 3-Email Automated Sequence in Brevo | 8% |
| **MOD 08: Capstone & Viva** | Milestone check-in & draft portfolio deck review | Deliverable 6: Integrated Capstone + Live Defense & Viva | 16% |
| **TOTAL** | **Continuous Feedback Across 12 Weeks** | **Complete Professional Graduate Portfolio** | **100%** |

---

### 7.3 12-Week Guided Delivery Schedule (10 Guided Hours/Week)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               12-WEEK GUIDED INSTRUCTIONAL ROADMAP                                     │
├──────┬──────────────┬──────────────┬───────────────────────────────────────────────────────────────────┤
│ Week │ Module       │ Guided Hours │ Weekly Instructional Focus & Milestones                           │
├──────┼──────────────┼──────────────┼───────────────────────────────────────────────────────────────────┤
│ W01  │ MODULE 01    │ 10.0 Hours   │ Digital Ecosystem, B2B/B2C, STP, Personas, Competitor Audits      │
│ W02  │ MODULE 02 (A)│ 10.0 Hours   │ Crawling/Indexing, Keyword Clustering, Intent Maps, On-Page SEO   │
│ W03  │ MOD 02/03    │ 10.0 Hours   │ GSC Analysis, Local SEO / GBP (6h) + Social Media Strategy (4h)   │
│ W04  │ MODULE 03 (B)│ 10.0 Hours   │ Copywriting Hooks, Canva Design Systems, Reels & AI Creatives (10h│
│ W05  │ MODULE 04 (A)│ 10.0 Hours   │ Paid Ad Economics, Google Search Hierarchy, RSAs, Negative Lists  │
│ W06  │ MODULE 04 (B)│ 10.0 Hours   │ Smart Bidding, AI Max/PMax, Meta Lead Gen Ads, Policy & Compliance│
│ W07  │ MODULE 05 (A)│ 10.0 Hours   │ Landing Page Architecture, WordPress Gutenberg Layouts, Copy & CTA│
│ W08  │ MOD 05/06    │ 10.0 Hours   │ Forms & UTMs (4h) + GA4 Architecture, Data Streams & GTM Intro (6h│
│ W09  │ MODULE 06 (B)│ 6.0 Hours    │ GTM Event Tracking, Key Events, Marketing Math, Looker Studio     │
│      │ MODULE 07 (A)│ 4.0 Hours    │ Email Deliverability, Compliance, List Hygiene, Copywriting       │
│ W10  │ MODULE 07 (B)│ 4.0 Hours    │ Brevo Template Design & 3-Part Automated Welcome Sequence         │
│      │ MODULE 08 (A)│ 6.0 Hours    │ Capstone Scoping: Client Brief, Objective Formulation, Funnel Plan│
│ W11  │ MODULE 08 (B)│ 10.0 Hours   │ Capstone Asset Production: Multi-channel Build & Tracking Assembly│
│ W12  │ MODULE 08 (C)│ 10.0 Hours   │ Performance Analysis, Optimization Plan, Portfolio Viva & Defense │
├──────┴──────────────┼──────────────┼───────────────────────────────────────────────────────────────────┤
│ TOTAL PROGRAM       │ 120.0 Hours  │ 12 Weeks @ 10 Guided Instructional Hours per Week                 │
└─────────────────────┴──────────────┴───────────────────────────────────────────────────────────────────┘
```

---

## 8. Delivery Feasibility, Operational Risks & Mitigation

### 8.1 Critical Operational Risks & Guardrails
1. **Ad Account Suspension & Billing Traps:**
   - *Risk:* Students entering personal payment methods and incurring unintended ad spend, or triggering immediate account suspension due to suspicious personal ad account activity.
   - *Mitigation:* Strict enforcement of the Zero-Spend Policy. Students operate exclusively in Draft Mode, Google Ads Expert Mode without billing configuration, or offline CSV/Excel planning workbooks. Live demonstrations are conducted solely by faculty using pre-authorized institutional accounts.
2. **GA4 Demo Account Read-Only Restriction:**
   - *Risk:* Instructors attempting to teach GTM and GA4 event creation on Google's public demo account, which fails because the demo property is strictly read-only.
   - *Mitigation:* Explicit curriculum mandate that GTM tagging and GA4 event debugging must occur on the student's designated WordPress sandbox site, where students have full admin permissions to place tags and verify events via GA4 DebugView.
3. **Platform UI Volatility:**
   - *Risk:* Google Ads and Meta Ads regularly alter interface layouts and naming conventions (e.g., Google Ads AI Max updates, Meta Advantage+ renaming).
   - *Mitigation:* Syllabi teach underlying structural principles (bidding algorithms, auction mathematics, audience targeting, match type mechanics) rather than mere button-clicking muscle memory. Regular faculty briefing packs reconcile UI shifts every 6 months.
4. **Third-Party SaaS Cost Barriers (Semrush/Ahrefs):**
   - *Risk:* Syllabi demanding paid subscriptions to enterprise SEO software costing $130+/month.
   - *Mitigation:* Semrush and Ahrefs are classified strictly as **Exposure Tools**. Practical SEO training is 100% grounded in native free utilities (Google Search Console, Google Keyword Planner, Google Trends).

---

## 9. Codebase Implementation Roadmap (Pre-Implementation Plan)

> [!IMPORTANT]
> In strict adherence to project scope, **NO production website files have been modified** during the authoring of this academic specification. Live website data updates will be executed only after formal stakeholder sign-off on this specification.

When authorized, live implementation will follow this precise, error-free staging pipeline:

1. **Step 1: Update Deep Course Data (`data/courses/dm-professional.json`):**
   - Update `course_name` to `"AI Digital Marketing Specialist"`.
   - Update `duration` to `"3 Months"` and `learning_hours` to `120`.
   - Replace legacy 5-module boilerplate with the full 8-module academic syllabus (Modules 01 to 08).
   - Update toolstack arrays into `core_tools`, `supporting_tools`, and `exposure_tools`.
   - Update entry-level roles, deliverables, and assessment structures.
2. **Step 2: Sync Master Fallback JSON (`nova-skills-109-course-content.json`):**
   - Update the matching `dm-professional` object (line 641) with the exact content from `data/courses/dm-professional.json`.
3. **Step 3: Update Website Catalog in `data.js` (Dual Location Update):**
   - Update `name` to `"AI Digital Marketing Specialist"`.
   - Update `duration` to `"3 Months"`, `durationMonths: 3`, `learningHours: 120`.
   - Update the 8-module summary curriculum in `NS_COURSES` (lines 98–170).
   - Simultaneously update the identical record in `NS_ACADEMIES[0].courses` (lines 7455–7527) to maintain absolute catalog consistency.
   - **Hazard Warning:** Do NOT run `scripts/build_data_js.py`.
4. **Step 4: Commercial Price Update (COMPLETED):**
   - Formally approved under TASK: NOVA-DMS-09. Published fee updated to ₹24,900 (Original: ₹49,999; ~50% discount).
5. **Step 5: Visual Verification & Verification Testing:**
   - Verify that `/course-detail.html?id=dm-professional` renders the updated title, 8-module accordion, verified tools, and 120-hour duration seamlessly without CLS or console errors.

---

## 10. Final Authoritative Sign-Off

- **Academic Integrity Verification:** Confirmed that all 8 modules sum to exactly **120 Guided Instructional Hours**.
- **Tool Mapping Verification:** Confirmed that all 7 Core Tools, 8 Supporting Tools, and 3 Exposure Tools are mapped to concrete module practicals.
- **Career Alignment Verification:** Target roles aligned strictly with realistic entry-level marketing positions.
- **Safety & Feasibility Verification:** Zero student ad spend required; free-tier tools verified against October 2026 platform specifications.
- **Target File Created:** [`docs/course-redesign/digital-marketing/ai-digital-marketing-specialist-spec.md`](file:///c:/Users/wasee/Desktop/NovaSkillsProject/NovaSkills%20Website/docs/course-redesign/digital-marketing/ai-digital-marketing-specialist-spec.md)
- **Production Website Files Changed:** **ZERO.** No production code or data modified.
