# Performance Marketing Specialist — Authoritative Academic Specification

**Document Title:** Academic Curriculum, Toolstack & Technical Specification for Performance Marketing Specialist
**Target Course ID:** `performance-marketing-specialist`
**Former Course ID:** `perf-marketing-pro`
**Published Catalog Name (Former):** Performance Marketing Professional
**Approved Redesigned Name:** Performance Marketing Specialist
**Target Academy:** Digital Marketing Academy (`digital-marketing`)
**Program Classification:** Professional Specialization (`SPECIALIZATION` / `Professional Program`)
**Approved Duration:** 4 Months / 16 Teaching Weeks
**Instructional Volume:** Exactly 160 Guided Instructional Hours (10 guided hours/week)
**Recommended Independent Practice:** 60–80 Additional Lab Hours (4–5 hours/week)
**Approved Commercial Fee:** INR 34,900 before applicable GST (18% GST extra where applicable)
**Flexible Payment:** 4-Month No-Cost EMI option available (~₹10,296/month inclusive of 18% GST)
**Active Development Branch:** `transformation/nova-course-redesign`
**Authoritative Status:** APPROVED ARCHITECTURAL SPECIFICATION — Implementation Blueprint
**Effective Date:** October 2026

---

## 1. Executive Summary & Program Identity

### 1.1 Course Positioning & Purpose

The **Performance Marketing Specialist** program (`performance-marketing-specialist`) is an industry-calibrated, advanced technical specialization engineered to bridge the critical talent gap between surface-level social media advertising and quantitative, data-driven paid customer acquisition.

Modern commercial organizations, high-growth Direct-to-Consumer (D2C) brands, B2B enterprises, and performance marketing agencies require practitioners who do not merely "boost posts" or set up basic ad campaigns, but who understand the mathematics of media buying, conversion tracking architecture, full-funnel attribution, first-party data engineering, landing page conversion rate optimization (CRO), and algorithmic bidding mechanics.

This program transitions the legacy 3-month/80-hour `perf-marketing-pro` record into a rigorous 4-month/160-hour professional specialization. Graduates emerge equipped to manage multi-channel paid media budgets, instrument complex client-side and server-side tracking pipelines, diagnose attribution discrepancies, and scale return on ad spend (ROAS) and profit on ad spend (POAS) across Google Ads, Meta Ads, and auxiliary ad platforms.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                    NOVA SKILLS PERFORMANCE MARKETING SPECIALIZATION                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ • 4 Months (16 Weeks) | 160 Guided Hours | 60–80 Independent Practice Hours            │
│ • Core Focus: Paid Search, Paid Social, Shopping/PMax, Tracking & Attribution Engine   │
│ • Tuition Fee: INR 34,900 (GST Extra) | Zero Student Ad Spend Guarantee                │
│ • Key Output: 8 Production-Grade Portfolio Deliverables + 1 Multi-Channel Capstone     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Target Audience & Employment Personas

The program is engineered specifically for career-focused individuals seeking quantitative marketing roles:

1. **Aspiring Paid Media Professionals & Career Switchers:** Analytical graduates and professionals from technical, quantitative, or marketing backgrounds transitioning into paid media buying.
2. **Junior Digital Marketers & Agency Executives:** Early-career practitioners (0–2 years) seeking to move away from low-margin organic social media posting and into high-compensation performance marketing roles.
3. **In-House Media Buyers & Performance Marketers:** Marketing staff responsible for managing company ad budgets who need to upgrade their tracking, bidding, and scaling capabilities.
4. **Freelancers & Independent Growth Consultants:** Practitioners seeking to manage high-spend client ad accounts (₹100,000–₹1,000,000/month) and charge monthly performance or retainer fees.

### 1.3 Verified Target Career Roles

Graduates who fulfill the 160 guided training hours, complete all laboratory exercises, and defend their capstone paid media portfolio qualify for the following entry-to-mid level roles:

* **Junior Performance Marketing Specialist**
* **Paid Media Executive**
* **PPC Executive / Paid Search Associate**
* **Google Ads Specialist (Junior)**
* **Meta Ads Specialist (Junior)**
* **Media Buying Associate**
* **Paid Acquisition Executive**

> [!NOTE]
> Career positioning explicitly emphasizes **Junior to Mid-Level Specialist** roles. Nova Skills avoids misleading guarantees of immediate Senior Director appointments or instant multi-crore ad management for zero-experience beginners.

---

## 2. Academy Differentiation & Course Boundary Matrix

### 2.1 The Four-Course Digital Marketing Architecture

To prevent curriculum overlap, student confusion, and internal cannibalization, Nova Skills enforces clear boundaries across its four core Digital Marketing offerings:

| Dimension / Feature | AI Digital Marketing Specialist (`dm-professional`) | E-Commerce & Growth Marketing Specialist (`ecommerce-growth-marketing-specialist`) | Performance Marketing Specialist (`performance-marketing-specialist`) [THIS SPEC] | AI Digital Marketing Strategist (`dm-mastery`) |
| :--- | :--- | :--- | :--- | :--- |
| **Course ID** | `dm-professional` | `ecommerce-growth-marketing-specialist` | `performance-marketing-specialist` | `dm-mastery` |
| **Duration / Hours** | 3 Months / 120 Hours | 4 Months / 160 Hours | **4 Months / 160 Hours** | 6 Months / 240 Hours |
| **Program Level** | Foundational Professional | Retail & E-Com Vertical | **Quantitative Paid Media Specialization** | Flagship Career Mastery |
| **Selling Price** | ₹24,900 | ₹34,900 | **₹34,900** | ₹44,900 |
| **Target Graduate** | Digital Marketing Executive | D2C Brand Growth Lead, Shopify Marketer | **Paid Media Executive, Performance Specialist** | Digital Marketing Strategist, Agency Director |
| **Core Value Prop** | Broad, foundational multi-channel execution | End-to-end online store scaling & catalog ads | **Deep paid advertising, tracking & media buying** | Omnichannel growth architecture & agency leadership |
| **Organic Search / SEO** | Basic on-page SEO & local SEO | E-Commerce collection & product SEO | **EXCLUDED (Paid search only)** | Advanced Technical SEO, GEO, Search Intelligence |
| **Content & Social** | Social media posting, Canva, copy | UGC creator briefing for retail products | **EXCLUDED (Ad creative matrices only)** | Brand strategy, omnichannel content ecosystems |
| **Paid Advertising** | Basic Search & Meta lead generation | Shopping, PMax, Meta Catalog, DPA | **Google Search, AI Max, Shopping, PMax, Meta Ads, Demand Gen** | Enterprise full-funnel media orchestration |
| **Tracking & Measurement** | Basic GTM container, GA4 standard tags | Standard e-commerce dataLayer (view_item, purchase) | **Server-side GTM, CAPI, Offline Data Manager, Enhanced Conversions** | Enterprise multi-touch attribution & custom ETL |
| **Store / Web Dev** | Basic WordPress landing page | Complete Shopify 2.0 theme architecture & apps | **High-converting landing pages & CRO testing** | Multi-CMS architecture & custom API funnels |
| **Lifecycle / Retention** | Basic 3-email welcome workflow in Brevo | Klaviyo RFM flows, SMS marketing, churn control | **EXCLUDED (Paid retargeting only)** | HubSpot CRM pipelines, lead scoring, n8n automation |

### 2.2 Explicit Non-Goals & Program Boundaries

* **NOT a General Digital Marketing Course:** This course does not cover organic social media management, organic search engine optimization (SEO), community management, or viral influencer marketing.
* **NOT an E-Commerce Store Building Course:** Students do not build Shopify themes, configure shipping tables, or manage warehouse logistics (covered in `ecommerce-growth-marketing-specialist`).
* **NOT a Full-Stack Coding Bootcamp:** While students configure GTM data layers and inspect JavaScript event triggers, this course does not teach frontend web development or backend software engineering.
* **NOT a Live Financial Gambling Course:** Students never spend their own personal funds on advertising campaigns. All campaigns are structured in draft modes, sandbox accounts, and offline editors.

---

## 3. Commercial Pricing & Tuition Structure

* **Approved Selling Price:** **INR 34,900** before applicable taxes.
* **Catalog Original Price:** **INR 34,900** (Set to equal selling price in catalog stores to prevent artificial, misleading strike-through discounts).
* **Taxation (GST):** 18% Goods and Services Tax (GST) is applicable extra (Total: ₹41,182).
* **Flexible EMI Facility:**
  - 4-Month No-Cost EMI: ₹10,296 / month (inclusive of 18% GST).
  - 6-Month Flexible Financing: ~₹6,864 / month.
* **Commercial Transparency:** Invoices, enrollment modals, and website detail cards explicitly display ₹34,900 with clear GST notices. No deceptive "90% off" countdown timers or unverified inflated prices.

---

## 4. Software & Tool Stack Validation (October 2026 Platform Reality)

### 4.1 Strict Zero-Student-Ad-Spend Policy

Nova Skills strictly prohibits requiring students to spend personal money on ad platforms. Performance marketing is learned through architectural mastery, rigorous offline build tools, developer sandboxes, and enterprise demo datasets:

1. **Google Ads & Ads Editor:** Students build full campaign architectures, keyword groupings, responsive search ads, and negative lists using **Google Ads Editor** and draft modes within Google Ads sandbox accounts.
2. **Meta Ads Manager:** Students construct full-funnel campaigns, 3x3 creative matrices, and Advantage+ campaign blueprints in draft mode within Meta Business Suite sandbox accounts.
3. **Google Tag Manager & GA4:** Students deploy tags, triggers, and custom data layers on dedicated student sandbox websites using **GTM Preview Mode / Tag Assistant** and analyze data via the official **Google Merchandise Store GA4 Demo Property**.
4. **Data Manager & Offline Feeds:** Students construct and validate Customer Match and Offline Conversion Measurement feeds using CSV/Sheets schemas validated through Google Ads Data Manager and Meta Events Manager upload validators.

### 4.2 Tool Classification & Operational Availability Matrix

All tools and platform capabilities have been verified against official vendor documentation as of October 2026:

| Tool / Platform | Category | Feature / Workflow | October 2026 Status | Operational Mode in Course |
| :--- | :--- | :--- | :--- | :--- |
| **Google Ads** | Primary | Search, PMax, Demand Gen, Smart Bidding | **Generally Available (GA)** | Draft Mode / Sandbox (Zero Spend) |
| **Google Ads Editor** | Primary | Offline campaign build, bulk management | **Generally Available (GA)** (v2.8+) | Local Desktop Application |
| **Google Ads Data Manager** | Primary | First-party data connectors, Customer Match | **Generally Available (GA)** | Cloud Console / Sandbox Mapping |
| **Meta Ads Manager** | Primary | ODAX, Advantage+ campaigns, ad sets | **Generally Available (GA)** | Draft Mode / Meta Sandbox |
| **Meta Events Manager** | Primary | Pixel diagnostics, CAPI Gateway, Aggregated Event Measurement | **Generally Available (GA)** | Sandbox Property & Test Event Tool |
| **Google Analytics 4 (GA4)** | Primary | Funnels, Key Events, Attribution Exploration | **Generally Available (GA)** | Google Demo Property + Student Sandbox |
| **Google Tag Manager (GTM)** | Primary | Web Container: dataLayer, triggers, variables | **Generally Available (GA)** | Live Student Sandbox + Tag Assistant |
| **Google Merchant Center** | Primary | Product feeds, supplemental feeds, GMC Next | **Generally Available (GA)** | Test Account / Feed Validator |
| **Looker Studio** | Primary | Cross-channel performance reporting dashboards | **Generally Available (GA)** | Cloud Studio / Live Connectors |
| **Google Sheets** | Primary | Budget pacing, unit economics, bid modeling | **Generally Available (GA)** | Cloud Workspace |
| **Keyword Planner** | Supporting | Search volume forecasting, CPC bid ranges | **Generally Available (GA)** | Google Ads Tools Console |
| **Microsoft Clarity** | Supporting | Session replays, click heatmaps, rage clicks | **Generally Available (GA)** | Live Tag Deployment on Sandbox |
| **Meta Commerce Manager** | Supporting | Catalog sets, product data feeds, DPA setup | **Generally Available (GA)** | Test Catalog Environment |
| **WordPress / Landing Page** | Supporting | Conversion-focused landing pages, form embeds | **Generally Available (GA)** | Student Cloud / Local Sandbox |
| **Shopify Demo** | Supporting | E-commerce checkout funnel inspection | **Generally Available (GA)** | Partner Sandbox Store |
| **Canva** | Supporting | Ad creative production, aspect ratio variants | **Generally Available (GA)** | Free / Educational Workspace |
| **ChatGPT (GPT-4o)** | Supporting | Ad copy angles, customer objections, RSA copy | **Generally Available (GA)** | Free / Plus Tier |
| **Google Gemini** | Supporting | Competitor ad research, intent analysis | **Generally Available (GA)** | Web Workspace |
| **GTM Server-Side** | Advanced Exposure| Server container, Cloud Run proxying | **Generally Available (GA) / Paid** | Conceptual Lab & Instructor Demo |
| **Meta Conversions API (CAPI)**| Advanced Exposure| Direct API event stream, deduplication | **Generally Available (GA)** | GTM Web/CAPI Partner Integration Demo |
| **LinkedIn Campaign Manager** | Advanced Exposure| B2B Lead Gen, Matched Audiences | **Generally Available (GA)** | Draft Mode Simulation |
| **Microsoft Ads** | Advanced Exposure| Search & Audience Network sync | **Generally Available (GA)** | Google Ads Import Simulation |
| **ChatGPT Ads** | Advanced Exposure| Sponsored prompts, conversational ad formats | **Beta / Experimental** | Analytical Case Study & Format Review |
| **n8n Automation** | Advanced Exposure| Webhook-triggered budget alerts & reporting | **Generally Available (GA)** | Desktop / Cloud Sandbox Walkthrough |
| **BigQuery / SQL Basics** | Advanced Exposure| Exporting GA4 raw event data, basic queries | **Generally Available (GA)** | Public Sandbox Dataset |
| **Incrementality / MMM** | Advanced Exposure| Geo-lift testing, Media Mix Modeling | **Methodological / Concept** | Case Study Analysis & Calculation Models |

---

## 5. Comprehensive 9-Module Curriculum Specification

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│               PERFORMANCE MARKETING SPECIALIST — 160-HOUR CURRICULUM                   │
├─────────┬───────────────────────────────────────────────────────────────┬──────────────┤
│ Module  │ Title                                                         │ Guided Hours │
├─────────┼───────────────────────────────────────────────────────────────┼──────────────┤
│ Mod 01  │ Performance Marketing Fundamentals                            │   12 Hours   │
│ Mod 02  │ Google Search Ads & AI Max                                    │   24 Hours   │
│ Mod 03  │ Shopping, PMax, Demand Gen & YouTube                          │   16 Hours   │
│ Mod 04  │ Meta Ads Mastery                                              │   24 Hours   │
│ Mod 05  │ Tracking & Conversion Engineering                             │   24 Hours   │
│ Mod 06  │ Landing Pages & CRO                                           │   12 Hours   │
│ Mod 07  │ Campaign Optimization, Reporting & Budgeting                  │   16 Hours   │
│ Mod 08  │ AI Advertising & Media Operations                             │    8 Hours   │
│ Mod 09  │ Paid Media Industry Capstone                                  │   24 Hours   │
├─────────┴───────────────────────────────────────────────────────────────┼──────────────┤
│ TOTAL GUIDED INSTRUCTIONAL HOURS                                        │  160 Hours   │
└─────────────────────────────────────────────────────────────────────────┴──────────────┘
```

---

### Module 01: Performance Marketing Fundamentals
* **Duration:** 12 Guided Instructional Hours (plus 5–6 hours independent practice)
* **Core Tools:** Google Sheets, Calculator, Miro / Funnel Mapping Tools
* **Supporting Tools:** ChatGPT, Industry Benchmark Databases (WordStream, Statista)

#### Learning Objectives
1. Deconstruct the quantitative unit economics governing modern digital media buying.
2. Calculate and model commercial acquisition metrics (CPC, CPM, CTR, CPL, CPA, CAC, ROAS, MER, POAS, LTV).
3. Architect multi-stage performance marketing funnels (TOFU awareness, MOFU consideration, BOFU acquisition).
4. Build a dynamic media budget allocation model in Google Sheets forecasting pipeline revenue.

#### Detailed Main Topics & Subtopics
1. **The Performance Marketing Operating System:**
   - Evolution from direct response print/mail to algorithmic digital auctions.
   - Core distinction between brand awareness advertising and performance-driven direct response.
   - Auction dynamics: Vickrey-Clarke-Groves (VCG) auction mechanics, Second-Price Auctions, and eCPM bidding formulas.
2. **Performance Metrics & Commercial Mathematics:**
   - Front-end delivery metrics: Impressions, Reach, Frequency, CPM (Cost Per Mille), CPC (Cost Per Click), CTR (Click-Through Rate).
   - Mid-funnel conversion metrics: Landing Page View Rate, Lead Rate, CPL (Cost Per Lead), Cart-to-Checkout conversion rates.
   - Back-end commercial metrics: CPA (Cost Per Acquisition), CAC (Customer Acquisition Cost), ROAS (Return On Ad Spend).
   - Advanced financial metrics: Marketing Efficiency Ratio (MER / Blended ROAS), Profit on Ad Spend (POAS), Contribution Margin 1/2/3, Customer Lifetime Value (LTV), and LTV:CAC payback period ratios.
3. **Audience Research, Offer Engineering & Funnel Mechanics:**
   - Quantitative audience sizing: Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM).
   - High-converting direct response offers: lead magnets, tripwires, self-liquidating offers (SLOs), bundles, and value stacking.
   - Funnel mapping: Mapping paid traffic temperature (Cold prospecting, Warm evaluation, Hot retargeting) to ad messaging.
4. **Budget Modeling & Scenario Forecasting:**
   - Top-down vs. bottom-up media budget planning.
   - Developing 3-tier financial projection models (Conservative, Realistic, Aggressive) in Google Sheets.
   - Factoring in refund rates, cash collection lags, and payment gateway processing fees.

#### Practical Classroom Exercises
* **Exercise 1.1:** Deconstructing a live business P&L: Given gross margin and fulfillment costs, calculate the maximum allowable CPA and break-even ROAS for a SaaS product and a D2C retail brand.
* **Exercise 1.2:** Funnel Drop-Off Audit: Analyze simulated funnel data with 10,000 clicks to diagnose whether poor CAC is driven by high CPC, low landing page conversion, or poor checkout velocity.

#### Independent Assignments
* **Assignment 1:** Build a fully automated Multi-Channel Performance Budget Calculator in Google Sheets with variable sliders for CPC, conversion rate, and AOV.

#### Expected Deliverables
* Completed Google Sheets Performance Media Financial Model with verified formulas and scenario forecasts.

#### Competency Assessment & Rubric
* **Scoring Rubric (100 pts):** Mathematical accuracy of metrics (40 pts), Depth of unit economic modeling (30 pts), Scenario flexibility (20 pts), Clarity of executive summary (10 pts).

#### Software Access & Fallback
* Standard Google Sheets workspace. Zero paid software required.

---

### Module 02: Google Search Ads & AI Max
* **Duration:** 24 Guided Instructional Hours (plus 10–12 hours independent practice)
* **Core Tools:** Google Ads (Expert Mode / Drafts), Google Ads Editor (Desktop), Keyword Planner
* **Supporting Tools:** ChatGPT, Gemini, Google Search Console

#### Learning Objectives
1. Architect high-intent Google Search account structures adhering to industry best practices.
2. Master keyword intent taxonomy, match type mechanics, search term sculpting, and negative keyword governance.
3. Write high-converting Responsive Search Ads (RSAs) leveraging direct-response copywriting frameworks and ad assets.
4. Configure, evaluate, and control Google AI Max Search features, smart bidding algorithms, and search experiments.

#### Detailed Main Topics & Subtopics
1. **Google Ads Account Hierarchy & Architecture:**
   - Account, Campaign, Ad Group, Keyword, and Ad structural relationships.
   - Campaign structuring paradigms: Single-Theme Ad Groups (STAGs) vs. intent-based clusters vs. Alpha/Beta structures.
   - Network settings: Search Network vs. Search Partners vs. Display Select risks and budget cannibalization.
2. **Keyword Intent Intelligence & Negative Keyword Sculpting:**
   - Intent classification: Informational, Navigational, Commercial Investigation, and High-Intent Transactional queries.
   - Modern match type behavior (October 2026): Exact Match with close variants, Phrase Match semantic expansion, and Broad Match algorithmic signals.
   - Negative keyword hierarchies: Account-level negative lists, campaign-level negatives, and ad-group cross-negatives to prevent internal cannibalization.
   - Search Terms Report (STR) mining: Identifying wasted ad spend and discovering high-converting long-tail keyword opportunities.
3. **Responsive Search Ads (RSAs) & Asset Extensions:**
   - RSA mechanics: 15 headlines, 4 descriptions, ad strength score realities vs. actual conversion performance.
   - Asset ecosystem: Sitelinks, Callouts, Structured Snippets, Call Assets, Lead Form Assets, Promotion Assets, and Image Assets.
   - Ad copy frameworks: Problem-Agitate-Solve (PAS), Features-Advantages-Benefits (FAB), and direct-response urgency triggers.
4. **Ad Rank, Quality Score & Smart Bidding Mechanics:**
   - Deconstructing Ad Rank: Max CPC bid x Quality Score (Expected CTR, Ad Relevance, Landing Page Experience) + Asset impact.
   - Smart Bidding algorithms: Maximize Clicks (prospecting), Maximize Conversions (volume), Target CPA (cost control), and Target ROAS (value-driven).
   - Bid strategy learning periods, bid adjustments (device, location, schedule), and portfolio bid strategies with shared budgets.
5. **Google AI Max & Automated Controls:**
   - Google AI Max features in Search: Generative search assets, automatically created assets (ACA), and search themes.
   - Maintaining human-in-the-loop governance: Brand exclusions, negative keyword enforcement, and headline pinning constraints.
   - Google Ads Experiments: Setting up A/B split tests with 50/50 cookie-based traffic splits to evaluate automated bidding vs. manual control.
6. **Offline Account Management & Audit Protocols:**
   - Google Ads Editor mastery: Bulk keyword insertion, mass text replacement, URL parameter appending, and CSV exports/imports.
   - 25-Point Google Search Account Audit Framework: Identifying budget leaks, low Quality Score outliers, and conversion tracking hygiene.

#### Practical Classroom Exercises
* **Exercise 2.1:** Google Ads Editor Build Sprint: Build an entire 5-campaign Search account in Google Ads Editor with 15 ad groups, 60 mapped keywords, and 30 RSAs without touching the web browser.
* **Exercise 2.2:** Search Term Sculpting Lab: Given a 1,000-row raw search terms export, isolate irrelevant queries, build negative keyword lists, and extract profitable exact-match keywords.

#### Independent Assignments
* **Assignment 2:** Author a comprehensive Google Search Campaign Architecture Workbook (.xlsx) and exportable Google Ads Editor archive (.csv) for a competitive service or B2B enterprise.

#### Expected Deliverables
* Validated Google Ads Editor archive file (.csv/.aea) ready for client import with zero structural errors.
* 25-Point Google Search Audit Report diagnosing weaknesses in a sample account.

#### Competency Assessment & Rubric
* **Scoring Rubric (100 pts):** Account structural hierarchy (30 pts), Negative keyword & match type rigor (25 pts), RSA copy quality & asset completeness (25 pts), Bid strategy logic (20 pts).

#### Software Access & Fallback
* Google Ads free account in Expert Mode (in draft status, zero spend). Free Google Ads Editor desktop software (Windows/Mac).

---

### Module 03: Shopping, PMax, Demand Gen & YouTube
* **Duration:** 16 Guided Instructional Hours (plus 6–8 hours independent practice)
* **Core Tools:** Google Ads, Google Merchant Center (GMC), Google Ads Editor
* **Supporting Tools:** Shopify Demo Environment, Canva, YouTube Video Ad Studio

#### Learning Objectives
1. Configure and troubleshoot Google Merchant Center accounts, tax/shipping settings, and product feed data streams.
2. Structure and optimize Performance Max (PMax) campaigns with category-specific Asset Groups and Audience Signals.
3. Master Standard Shopping campaign priority tiering and query sculpting.
4. Deploy visual Demand Gen and YouTube advertising campaigns for visual mid-funnel customer discovery.

#### Detailed Main Topics & Subtopics
1. **Google Merchant Center (GMC) & Product Feed Architecture:**
   - Account setup, domain claiming, business verification, and store policy compliance.
   - Product feed delivery: Google Content API vs. scheduled XML/TSV fetches vs. Google Sheets feeds.
   - Mandatory feed attributes: `id`, `title`, `description`, `link`, `image_link`, `price`, `availability`, `brand`, `gtin` / `mpn`, and `google_product_category`.
   - Title engineering formulas: [Brand + Product Type + Key Features + Gender + Color + Size].
   - Supplemental feeds: Applying custom labels (0–4) for profit margin segmentation (High/Med/Low) and inventory clearance.
   - Resolving GMC diagnostic errors: Policy disapprovals, price/inventory mismatches, and account warning resolution.
2. **Standard Shopping Campaigns & Priority Sculpting:**
   - 3-tier campaign priority structure: High, Medium, and Low priority campaigns with shared budgets.
   - Negative keyword sculpting: Forcing generic category searches, brand searches, and SKU-level searches into designated priority tiers.
   - Product group subdivision and bid management.
3. **Performance Max (PMax) Deep-Dive & Optimization:**
   - PMax multi-channel ecosystem: Search, Shopping, YouTube, Display, Discover, and Maps.
   - Asset Group structuring: Organizing asset groups strictly by product line rather than mixing unrelated SKUs.
   - Creative asset specifications: Landscape, square, and portrait images, logos, headlines, long headlines, descriptions, and video assets.
   - Audience Signals: First-party customer lists, website converters, custom search intent segments, and competitor URL themes.
   - PMax controls and exclusions: Account-level negative keywords, brand exclusions, placement exclusions, and Final URL Expansion controls.
   - Using Google Ads PMax scripts to extract channel-level spend breakdowns (Shopping vs. Search vs. Video).
4. **Demand Gen & YouTube Video Ad Campaigns:**
   - Demand Gen fundamentals: Reaching mid-funnel shoppers across YouTube Shorts, Discover Feed, and Gmail.
   - Video ad formats: In-stream skippable, non-skippable, bumper ads, and vertical YouTube Shorts ads.
   - Product feed integration in video ads: Interactive product carousels displayed below video creatives.
   - Bidding strategies for video and Demand Gen: Target CPA, Target ROAS, and Maximize Conversions.

#### Practical Classroom Exercises
* **Exercise 3.1:** Feed Data Engineering Clinic: Cleanse a 50-item product feed with missing GTINs, poor titles, and unmapped taxonomy into an approved TSV feed with custom margin labels.
* **Exercise 3.2:** PMax Asset Group & Audience Signal Build: Design a complete Performance Max campaign specification for a multi-category retail brand with complete copy, visual asset links, and audience signals.

#### Independent Assignments
* **Assignment 3:** Build a complete PMax & Standard Shopping Master Campaign Blueprint workbook detailing campaign priorities, negative lists, asset matrices, and budget allocations.

#### Expected Deliverables
* Error-free TSV product feed file passing Google Merchant Center validation checks.
* Completed Performance Max Asset Matrix workbook ready for deployment.

#### Competency Assessment & Rubric
* **Scoring Rubric (100 pts):** Feed optimization and attribute accuracy (30 pts), PMax asset group relevancy and copy (25 pts), Audience signal depth (25 pts), Shopping priority tiering logic (20 pts).

#### Software Access & Fallback
* Google Merchant Center free test account. Google Ads draft mode. Canva free tier for video/image mockups.

---

### Module 04: Meta Ads Mastery
* **Duration:** 24 Guided Instructional Hours (plus 10–12 hours independent practice)
* **Core Tools:** Meta Ads Manager, Meta Events Manager, Meta Commerce Manager
* **Supporting Tools:** Canva, ChatGPT, CapCut / Short-Form Video Editors

#### Learning Objectives
1. Navigate Meta Business Suite, Business Accounts, Ad Accounts, and asset access governance.
2. Architect full-funnel paid social campaigns using the Outcome-Driven Ad Experience (ODAX) framework.
3. Build, scale, and control Advantage+ Shopping Campaigns (ASC) and Advantage+ Lead Campaigns with customer caps.
4. Construct a structured 3x3 Creative Testing Matrix to systematically identify winning video and static ad angles.

#### Detailed Main Topics & Subtopics
1. **Meta Business Infrastructure & Asset Governance:**
   - Meta Business Portfolio setup: Business Accounts, Pages, Ad Accounts, Pixels/Datasets, and Catalogs.
   - Two-factor authentication, employee vs. agency partner access sharing, and payment threshold management.
   - Policy compliance: Prohibited content, restricted categories, Special Ad Categories (Credit, Employment, Housing, Politics), and account quality recovery.
2. **ODAX Campaign Objectives & Auction Mechanics:**
   - The Outcome-Driven Ad Experience (ODAX) structure: Awareness, Traffic, Engagement, Leads, App Promotion, and Sales.
   - Meta auction formula: Total Value = [Advertiser Bid] x [Estimated Action Rate] + [Ad Quality Score].
   - Understanding user experience factors: Fast loading speed, low negative feedback, and high engagement duration.
3. **Audience Architecture & Segmentation Strategy:**
   - Broad targeting: Letting Meta's machine learning algorithm identify prospective buyers via creative resonance.
   - Custom Audiences: Customer list uploads (hashing mechanics), website visitors, engagement audiences (IG/FB video viewers, page engagers), and Instant Form openers.
   - Lookalike Audiences: 1% to 10% lookalike tiers, high-value customer seed lists, and international lookalikes.
   - Audience exclusions: Preventing budget waste by excluding 30/60/90-day purchasers from prospecting ad sets.
4. **Advantage+ Automation & Scaling Frameworks:**
   - Advantage+ Shopping Campaigns (ASC): Full automation across audience, placement, and creative.
   - Setting existing customer budget caps (10–20%) to enforce incremental new customer acquisition.
   - Advantage+ Creative: Standard enhancements, image expansion, text variations, and dynamic music overlays.
   - Advantage+ Placements vs. manual placement exclusions (avoiding low-quality Audience Network clicks).
5. **Dynamic Product Ads (DPA) & Catalog Integration:**
   - Connecting Meta Commerce Manager catalogs with Meta Pixel events.
   - Dynamic Ads for Broad Audiences (DABA) for prospecting vs. Dynamic Product Ads (DPA) for 7/14/30-day abandoned cart retargeting.
   - Catalog creative customizations: Dynamic price badges, percentage-off overlays, and customized catalog cards.
6. **The 3x3 Creative Testing Engine & Direct-Response Video Hooks:**
   - The 3x3 Creative Matrix: 3 marketing angles (Problem/Agitation, Social Proof/Reviews, Us vs. Them) across 3 visual formats (UGC short-form video, Carousel with badges, Static feature-callout).
   - Deconstructing winning short-form video ads: The 3-second hook, the visual demonstration, objection handling, and clear single CTA.
   - Diagnosing ad fatigue: Tracking Frequency, First-Time Impression Ratio (FTIR), and Outbound CTR degradation.
   - Budget scaling frameworks: Vertical scaling (20% budget increases every 48-72h) vs. Horizontal scaling (duplicating into new creative angles/campaigns).

#### Practical Classroom Exercises
* **Exercise 4.1:** Meta Draft Campaign Build Sprint: Within Meta Ads Manager, construct a full-funnel campaign structure consisting of 1 ASC prospecting campaign and 1 DPA retargeting campaign with proper exclusions.
* **Exercise 4.2:** 3x3 Creative Testing Deck Development: Author 3 complete video hook scripts, 3 static image concepts, and 3 carousel storylines for a given direct-to-consumer product.

#### Independent Assignments
* **Assignment 4:** Author an exportable Meta Ads Master Campaign Build Document detailing ODAX objectives, audience rules, Advantage+ settings, and complete 3x3 creative assets.

#### Expected Deliverables
* Meta Ads Campaign Blueprint document with verified targeting parameters, customer caps, and complete ad copy decks.
* 3x3 Creative Asset Deck with visual mockups and production briefs.

#### Competency Assessment & Rubric
* **Scoring Rubric (100 pts):** Campaign architecture & exclusions (30 pts), Creative matrix depth & hook quality (30 pts), Advantage+ configuration compliance (20 pts), Budget allocation logic (20 pts).

#### Software Access & Fallback
* Meta Ads Manager in sandbox/draft mode (zero spend required). Canva for visual creative mockups.

---

### Module 05: Tracking & Conversion Engineering
* **Duration:** 24 Guided Instructional Hours (plus 10–12 hours independent practice)
* **Core Tools:** Google Tag Manager (GTM), Google Analytics 4 (GA4), Meta Events Manager, Google Ads Data Manager
* **Supporting Tools:** Chrome DevTools, GTM Tag Assistant, Meta Pixel Helper, Postman / Webhook Testers

#### Learning Objectives
1. Master client-side measurement architecture using Google Tag Manager tags, triggers, variables, and dataLayer events.
2. Deploy, verify, and troubleshoot GA4 e-commerce events and designated Key Events.
3. Configure Google Ads Enhanced Conversions and Google Ads Data Manager for first-party data integration.
4. Implement Meta Pixel and Conversions API (CAPI) with event deduplication and understand server-side tracking principles.

#### Detailed Main Topics & Subtopics
1. **The Measurement Ecosystem & Privacy Shifts:**
   - Third-party cookie deprecation, Apple App Tracking Transparency (ATT), and privacy regulations (GDPR, CCPA, India DPDP Act).
   - The browser measurement breakdown: ITP (Intelligent Tracking Prevention), ad blockers, and lost conversion attribution.
   - First-party data strategy: Why modern performance marketing requires server-assisted and first-party identity resolution.
2. **Google Tag Manager (GTM) Architecture:**
   - Container hierarchy, workspaces, versions, environments, and user permissions.
   - Variables: Built-in variables, User-Defined variables (Data Layer Variable, Custom JavaScript, DOM Element, URL Variable).
   - Triggers: Page View, DOM Ready, Window Loaded, Click (All Elements vs. Just Links), Form Submission, Element Visibility, and Custom Events.
   - Tags: GA4 Configuration Tag, GA4 Event Tag, Google Ads Conversion Tracking, Google Ads Remarketing, and Custom HTML.
   - The `dataLayer`: Understanding JavaScript object pushes, push syntax, event timing, and variable persistence.
3. **GA4 Event Measurement & Key Events:**
   - The GA4 event-driven data model: Automatically collected events, enhanced measurement, recommended events, and custom events.
   - Designation of Key Events (formerly conversions) and modeling conversion values.
   - E-commerce event taxonomy: `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, and `purchase`.
   - Passing items arrays, transaction IDs, currency, and value parameters.
4. **Google Ads Enhanced Conversions & Data Manager:**
   - Enhanced Conversions for Web: Capturing, hashing (SHA-256), and transmitting first-party user data (email, phone, address) to Google Ads.
   - Configuring Enhanced Conversions via GTM using JavaScript variables or automatic user-provided data.
   - Google Ads Data Manager (October 2026 GA feature): Connecting first-party data sources (CRM, Google Sheets, Cloud Storage) for Customer Match and offline sales imports.
   - Offline Conversion Tracking (OCT): Uploading conversion adjustments, qualifying lead status changes (MQL -> SQL -> Closed Won) with GCLID / WBRAID / GBRAID.
5. **Meta Pixel, Conversions API (CAPI) & Event Deduplication:**
   - Meta Pixel architecture: Base code, standard events (`ViewContent`, `Lead`, `AddToCart`, `Purchase`), and custom parameters.
   - Meta Conversions API (CAPI): Server-to-server event pipeline bypassing browser ad blockers and network restrictions.
   - Event Deduplication mechanics: Transmitting matching `event_name` and `event_id` across both browser Pixel and server CAPI to prevent double-counting.
   - Meta Event Quality: Optimizing Event Match Quality (EMQ) scores (target 8.0+) via hashed user parameters.
6. **Debugging, Verification & Server-Side Tracking Principles:**
   - Debugging tools: Chrome DevTools Network Tab, GTM Preview Mode / Tag Assistant, Meta Pixel Helper extension, and GA4 DebugView.
   - Consent-aware tracking: Google Consent Mode v2 (Analytics Storage, Ad Storage, Ad User Data, Ad Personalization).
   - Server-Side GTM (sGTM) architecture: How client requests hit a first-party cloud server container (Cloud Run / Stape) before forwarding to vendor endpoints.

#### Practical Classroom Exercises
* **Exercise 5.1:** GTM Container Build & dataLayer Push: On a sandbox website, configure a custom `dataLayer.push()` for lead form submissions and capture custom form values into GA4 and Google Ads tags.
* **Exercise 5.2:** Meta Pixel & CAPI Deduplication Setup: Configure matching `event_id` generators in GTM to fire browser and simulated webhook server events without duplicate conversion counts.

#### Independent Assignments
* **Assignment 5:** Build, debug, and export a complete GTM Container JSON file instrumenting Google Ads, GA4, and Meta Pixel tracking with Enhanced Conversions and verify it via Tag Assistant logs.

#### Expected Deliverables
* Exported GTM Container JSON file ready for production deployment.
* Comprehensive Tracking Architecture & Debugging Log Document with annotated screenshots from GTM Preview and GA4 DebugView.

#### Competency Assessment & Rubric
* **Scoring Rubric (100 pts):** dataLayer variable configuration (30 pts), Enhanced conversions implementation (25 pts), Deduplication and CAPI architecture (25 pts), Verification and debugging rigor (20 pts).

#### Software Access & Fallback
* Google Tag Manager free account. Google Analytics 4 free account. Free student sandbox website. Zero paid tracking licenses required.

---

### Module 06: Landing Pages & CRO
* **Duration:** 12 Guided Instructional Hours (plus 5–6 hours independent practice)
* **Core Tools:** WordPress / Page Builder Sandbox, Microsoft Clarity
* **Supporting Tools:** Canva, Google Forms / Form Plugins, ChatGPT

#### Learning Objectives
1. Deconstruct the conversion anatomy of high-performing paid advertising landing pages.
2. Conduct heuristic Conversion Rate Optimization (CRO) audits using the LIFT Model.
3. Analyze user behavior using session replays, click heatmaps, and rage-click drop-offs in Microsoft Clarity.
4. Formulate rigorous, testable A/B split-testing hypotheses with statistical sample size modeling.

#### Detailed Main Topics & Subtopics
1. **The Paid Traffic Landing Page Architecture:**
   - The Message Match principle: Aligning ad hook, headline, imagery, and offer with landing page hero section.
   - Page anatomy: Sticky navigation, above-the-fold value proposition, hero visual, social proof ribbons, feature/benefit modules, FAQ accordions, and frictionless form placement.
   - Dedicated landing pages vs. website homepages: Why driving paid traffic to homepages incinerates ad budget.
2. **Mobile UX & Friction Reduction:**
   - Mobile thumb-zone ergonomics: Placing primary CTAs within natural reach, sticky bottom action bars.
   - Form design psychology: Single-column vs. multi-step forms, micro-copy, progressive disclosure, and reducing required input fields.
   - Page speed and Core Web Vitals: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and visual layout shifts.
3. **Heuristic Auditing & The LIFT Model:**
   - The 6-factor LIFT Model: Value Proposition, Relevance, Clarity, Urgency, Anxiety, and Distraction.
   - Performing a structured heuristic walkthrough of competitor and client landing pages.
   - Prioritizing optimization ideas using the PIE framework (Potential, Importance, Ease).
4. **Behavioral Analytics with Microsoft Clarity:**
   - Installing and verifying Microsoft Clarity via Google Tag Manager.
   - Analyzing click heatmaps, scroll maps, and attention maps across desktop and mobile.
   - Filtering session replays: Identifying dead clicks, rage clicks, quick backs, and form abandonment points.
5. **A/B Testing Methodology & Statistical Significance:**
   - Formulating scientific hypotheses: "If we [change X], then [metric Y will improve], because of [behavioral insight Z]".
   - Calculating sample sizes, minimum detectable effect (MDE), baseline conversion rates, and test duration requirements.
   - Statistical confidence (95% standard), false positives, and seasonal testing pitfalls.

#### Practical Classroom Exercises
* **Exercise 6.1:** 20-Point Heuristic CRO Audit: Audit a live B2B or D2C landing page using the LIFT model, annotating 10 high-friction conversion blockers.
* **Exercise 6.2:** Microsoft Clarity Session Analysis: Review 10 live session recordings to pinpoint the exact field causing user abandonment in a lead generation form.

#### Independent Assignments
* **Assignment 6:** Design and wireframe a high-converting desktop and mobile landing page concept in Figma or Canva and author 2 detailed A/B test experiment specification briefs.

#### Expected Deliverables
* Annotated Heuristic CRO Audit Report (PDF).
* Two complete A/B Experiment Design Documents with before/after wireframes and sample size calculations.

#### Competency Assessment & Rubric
* **Scoring Rubric (100 pts):** Depth of heuristic analysis (35 pts), Clarity session behavior diagnosis (25 pts), A/B hypothesis scientific rigor (25 pts), Wireframe UX clarity (15 pts).

#### Software Access & Fallback
* Free Microsoft Clarity account. WordPress / LocalWP or Canva wireframe builder.

---

### Module 07: Campaign Optimization, Reporting & Budgeting
* **Duration:** 16 Guided Instructional Hours (plus 6–8 hours independent practice)
* **Core Tools:** Looker Studio, Google Sheets, Google Ads, Meta Ads Manager
* **Supporting Tools:** GA4 Exploration Reports, Calculator

#### Learning Objectives
1. Implement standard operating procedures (SOPs) for daily, weekly, and monthly campaign pacing and optimization.
2. Build interactive, multi-channel performance reporting dashboards in Looker Studio.
3. Diagnose attribution discrepancies between ad platforms, GA4, and internal client CRM databases.
4. Model cross-channel budget pacing, marginal ROAS thresholds, and media forecasting.

#### Detailed Main Topics & Subtopics
1. **The Performance Marketing Optimization Operating Cadence:**
   - Daily optimization routines: Spend pacing checks, sudden CTR/CPA spikes, budget cap enforcement, and ad approval status.
   - Weekly optimization routines: Search term harvesting, negative keyword additions, creative fatigue rotation, ad set bid adjustments.
   - Monthly strategic routines: Channel mix re-allocation, seasonal trend alignment, audience saturation checks, and holistic POAS review.
   - Avoid over-optimization: Allowing machine learning algorithms to complete learning phases before making premature changes.
2. **Cross-Channel Performance Reporting in Looker Studio:**
   - Connecting data sources: Google Ads, GA4, Search Console, and Google Sheets connectors.
   - Data blending: Merging multi-channel spend data with revenue data using date and campaign naming keys.
   - Creating executive scorecards: Blended spend, Blended CAC, MER, Total Revenue, and Net Contribution Margin.
   - Visualizing conversion funnels, geographic heatmaps, device breakdowns, and dayparting performance.
3. **Attribution Modeling & Data Discrepancy Diagnostics:**
   - Platform attribution windows: Google Ads (Data-Driven / 30-day click) vs. Meta Ads (7-day click / 1-day view).
   - Why ad platform numbers never match GA4: Cross-device tracking differences, view-through attribution inflation, and privacy blockers.
   - First-click, Last-click, Linear, Time-decay, and Data-Driven Attribution (DDA) comparisons.
   - Introduction to Incrementality Testing: Geo-lift split testing concepts and Marketing Mix Modeling (MMM) fundamentals.
4. **Financial Budget Pacing & Marginal Efficiency:**
   - The law of diminishing returns in paid media: Why doubling ad budget does not double conversions.
   - Calculating Marginal ROAS and Marginal CPA to identify the exact inflection point where scaling becomes unprofitable.
   - Managing budget re-allocation between prospecting (70–80%) and retargeting (20–30%).

#### Practical Classroom Exercises
* **Exercise 7.1:** Multi-Channel Looker Studio Dashboard Build: Build an executive single-page dashboard connecting Google Ads and Google Sheets spend data to visualize blended ROAS.
* **Exercise 7.2:** Attribution Discrepancy Reconciliation: Analyze a simulated dataset where Meta reports 150 purchases, Google reports 120 purchases, but Shopify reports only 200 total orders, reconciling the overlap.

#### Independent Assignments
* **Assignment 7:** Build a live, interactive Single-Page Executive Performance Dashboard in Looker Studio and author a monthly client performance review presentation deck.

#### Expected Deliverables
* Live Looker Studio Dashboard URL and annotated PDF export.
* Monthly Client Performance Analysis & Budget Recommendation Deck.

#### Competency Assessment & Rubric
* **Scoring Rubric (100 pts):** Dashboard visual clarity and metric selection (35 pts), Reconciliation of attribution discrepancies (25 pts), Pacing and marginal ROAS modeling (25 pts), Client communication quality (15 pts).

#### Software Access & Fallback
* Free Looker Studio workspace. Google Sheets.

---

### Module 08: AI Advertising & Media Operations
* **Duration:** 8 Guided Instructional Hours (plus 4–5 hours independent practice)
* **Core Tools:** Google Ads AI Max, Meta Advantage+, ChatGPT (GPT-4o), Google Gemini
* **Supporting Tools:** Midjourney / Ideogram, CapCut, n8n Automation (Demo)

#### Learning Objectives
1. Evaluate and control generative AI tools across ad copywriting, creative iteration, and market research.
2. Understand the operational mechanics of Google AI Max, Meta Advantage+ automation, and emerging conversational ad formats (ChatGPT Ads).
3. Build AI-assisted reporting synthesis workflows while enforcing rigorous human-in-the-loop governance.
4. Navigate platform advertising policies, automated compliance flags, and algorithmic account suspension mitigation.

#### Detailed Main Topics & Subtopics
1. **Generative AI in Paid Media Workflows:**
   - Prompt engineering for performance media: Role, Task, Context, Target Persona, Constraints, and Output Format.
   - Generating 10 distinct RSA headline variants clustered by emotional angle (Fear of Missing Out, Authority, Direct Proof, Urgency).
   - Mining customer reviews and forum discussions using LLMs to extract raw voice-of-customer (VoC) hooks.
   - Generative image expansion and background replacement for ad creative asset sets.
2. **Algorithmic Platform Features & Autonomous Media Buying:**
   - Google AI Max: Generative search assets, conversational campaign creation, and automated asset generation controls.
   - Meta Advantage+ Creative and Generative Backgrounds: When to enable auto-enhancements and when they degrade brand trust.
   - Emerging ad frontiers (October 2026): Overview of sponsored conversational prompt placements (ChatGPT Ads, Perplexity sponsored follow-ups).
3. **Media Operations & Automation Workflows:**
   - Automated rules in Google Ads: Pausing high-CPA keywords, sending email alerts for budget exhaustion, increasing bids on top-performing search terms.
   - Automated rules in Meta Ads Manager: Capping frequency, decreasing budgets on fatigue triggers, notifying buyers on ad set anomalies.
   - Introduction to no-code reporting automation: Using n8n or Make webhooks to post daily spend digests into team Slack channels.
4. **Policy Governance & Account Health Safeguards:**
   - Avoiding automated policy rejections: Misleading claims, unverified superlatives, before-and-after imagery, and prohibited landing page patterns.
   - Managing account suspensions: Documentation requirements, appeal submission protocols, and recovering restricted assets.
   - The Human-in-the-Loop Imperative: Why autonomous AI tools require continuous human strategic guidance and ethical verification.

#### Practical Classroom Exercises
* **Exercise 8.1:** Automated Rules Construction: Configure 4 automated monitoring rules in Google Ads and Meta Ads Manager to safeguard ad spend against runaway CPAs.
* **Exercise 8.2:** AI Ad Copy Matrix Generation: Use advanced structured prompting in ChatGPT to generate a 15-headline, 4-description RSA deck mapped to specific consumer emotional triggers.

#### Independent Assignments
* **Assignment 8:** Author an AI-Powered Media Operations & Quality Assurance Playbook detailing automated rule parameters, prompt libraries, and policy compliance checklists.

#### Expected Deliverables
* Complete Performance Marketing AI Prompt Library and Automated Rules Configuration Document.

#### Competency Assessment & Rubric
* **Scoring Rubric (100 pts):** Prompt specificity and copy quality (35 pts), Automated rule logic and safety thresholds (30 pts), Policy risk mitigation depth (20 pts), Strategic clarity (15 pts).

#### Software Access & Fallback
* Free ChatGPT (GPT-4o) / Google Gemini web tools. Ad platforms in draft mode.

---

### Module 09: Paid Media Industry Capstone
* **Duration:** 24 Guided Instructional Hours (plus 15–20 hours independent practice)
* **Core Tools:** Google Ads Editor, Meta Ads Manager, GTM, GA4, Looker Studio, Google Sheets
* **Supporting Tools:** Canva, WordPress, Microsoft Clarity, Loom

#### Learning Objectives
1. Synthesize all performance marketing disciplines into a comprehensive, production-ready paid acquisition engine for a real-world enterprise or brand.
2. Architect full-funnel Google Search, PMax, and Meta ad campaign blueprints with verified tracking containers.
3. Model a multi-channel budget allocation (₹300,000–₹1,000,000/month) with unit economics and projected revenue.
4. Defend campaign architectures, attribution choices, and CRO recommendations before an expert evaluation panel.

#### Detailed Main Topics & Subtopics
1. **Capstone Brief Selection & Business Diagnostic:**
   - Selection of specialized capstone vertical: D2C E-Commerce Brand, B2B SaaS Enterprise, or High-Ticket Local Service Business.
   - Baseline diagnostic audit: Analyzing unit economics, historical ad spend data, customer personas, and competitive landscape.
   - Defining Key Performance Indicators (KPIs): Target CPA, Target ROAS, Pipeline Volume, and Payback Milestones.
2. **Integrated Multi-Channel Architecture Build:**
   - **Google Ads:** Full search campaign hierarchy in Google Ads Editor, negative keyword lists, PMax asset groups, and audience signals.
   - **Meta Ads:** Complete full-funnel ODAX build, Advantage+ Shopping/Lead setup, 3x3 creative testing matrix, and audience exclusions.
   - **Tracking & GTM:** Exported GTM Container JSON file with custom dataLayer triggers, GA4 e-commerce/lead events, and Enhanced Conversions.
   - **CRO & Landing Page:** High-converting landing page wireframe with message match alignment and heuristic friction analysis.
3. **Commercial Financial Modeling & Budget Pacing:**
   - Modeling a 90-day phased media budget (Month 1: Foundation & Baseline, Month 2: Scale & Creative Iteration, Month 3: Profit Optimization).
   - Forecasting blended CAC, MER, contribution margin, and projected revenue across 3 scenarios.
4. **Executive Reporting & Agency Presentation:**
   - Constructing an interactive Looker Studio dashboard connecting simulated campaign metrics.
   - Authoring a formal Agency Statement of Work (SOW) defining scope of work, monthly retainer fees, and performance bonuses.
   - Creating a 25-slide executive-ready Client Pitch Deck.
5. **Capstone Defense & Viva Voce Examination:**
   - Delivering a 15-minute recorded video presentation defending strategic media choices, bidding algorithms, and tracking setups.
   - Answering technical questions regarding attribution, budget pacing, and tracking diagnostics.

#### Practical Classroom Exercises
* **Exercise 9.1:** Live Capstone Architecture Clinic: Peer review and instructor diagnostic audit of campaign architectures in Google Ads Editor and Meta Ads Manager.
* **Exercise 9.2:** Mock Client Defense: Defending strategic media choices and handling simulated client objections regarding ad spend waste and attribution mismatches.

#### Independent Assignments
* **Assignment 9:** Execute the complete, integrated Paid Media Capstone Project across all 8 technical assets and record the final video defense walkthrough.

#### Expected Deliverables
1. **Google Ads Master Campaign Archive:** Exported Google Ads Editor (.csv/.aea) file with STAG architectures, RSAs, and negative lists.
2. **Meta Ads Master Campaign Build Document:** Blueprint detailing ODAX campaigns, ASC setups, and 3x3 creative decks.
3. **Production GTM Container JSON File:** Complete tracking container with triggers, tags, and Enhanced Conversions.
4. **90-Day Financial & Budget Allocation Model:** Google Sheets model forecasting CAC, ROAS, and contribution margins.
5. **Heuristic Landing Page CRO Audit & Wireframe Deck:** Annotated friction analysis and mobile-first landing page design.
6. **Executive Looker Studio Dashboard:** Interactive multi-channel dashboard URL and PDF export.
7. **25-Slide Executive Client Pitch Deck:** Commercial proposal and operational roadmap.
8. **15-Minute Recorded Video Defense Walkthrough:** Oral defense demonstrating professional technical mastery.

#### Competency Assessment & Rubric
* **Comprehensive Capstone Evaluation Rubric (100 pts):**
  - Technical Media Architecture (Google & Meta rigor) — **25 pts**
  - Tracking, Measurement & GTM Container Integrity — **25 pts**
  - Financial Modeling, Unit Economics & Budget Pacing — **20 pts**
  - Landing Page CRO & Creative Matrix Quality — **15 pts**
  - Professional Presentation & Oral Viva Defense — **15 pts**

#### Software Access & Fallback
* Standard course tool suite in draft/sandbox modes. Zero personal ad spend required.

---

## 6. Curricular & Competency Matrices

### 6.1 Software Competency Matrix

| Software / Tool | Target Competency Level | Primary Workflows Learned | Verifiable Student Output |
| :--- | :--- | :--- | :--- |
| **Google Ads** | **Advanced Execution** | Search campaigns, PMax, Demand Gen, Smart Bidding, experiments | Exported campaign blueprints & live draft structures |
| **Google Ads Editor** | **Advanced Mastery** | Bulk editing, STAG architecture, mass negative lists, offline management | Validated .csv/.aea export files |
| **Google Ads Data Manager** | **Working Knowledge** | First-party data connectors, Customer Match, offline sales mapping | Data schema mapping sheets & connection logs |
| **Meta Ads Manager** | **Advanced Execution** | ODAX funnels, Advantage+ campaigns, custom audiences, scaling rules | Meta campaign build documents & draft setups |
| **Meta Events Manager** | **Intermediate Technical** | Pixel diagnostics, CAPI pairing, Event Match Quality, test events | Verified test event logs & EMQ audit scorecards |
| **Google Analytics 4** | **Intermediate Analysis** | E-commerce funnels, Key Events, exploration reports, attribution models | GA4 exploration funnel reports & audit logs |
| **Google Tag Manager** | **Advanced Technical** | Web containers, dataLayer variables, triggers, Enhanced Conversions | Exported GTM container JSON file (production-ready) |
| **Google Merchant Center** | **Intermediate Working** | Product feeds, attribute optimization, diagnostic troubleshooting | Clean TSV product feed & GMC error resolution sheet |
| **Looker Studio** | **Advanced Reporting** | Cross-channel dashboard builds, data blending, calculated metrics | Interactive multi-channel executive dashboard URL |
| **Google Sheets** | **Advanced Modeling** | Unit economics, budget pacing, marginal ROAS, scenario models | Dynamic 90-day financial model with active formulas |
| **Microsoft Clarity** | **Intermediate Analysis** | Heatmaps, scroll maps, session recordings, rage click diagnostics | Behavioral UX audit report with annotated heatmaps |
| **Canva / Visual Tools** | **Working Knowledge** | 3x3 ad creative sets, visual aspect ratio variants (1:1, 9:16) | 3x3 Creative Testing Deck with visual ad mockups |
| **ChatGPT / Gemini** | **Advanced Prompting** | RSA copy matrices, VoC research, automated monitoring rules | Structured performance marketing prompt library |

### 6.2 Module-to-Topic Matrix

| Module | Core Domains Covered | Key Mathematical / Technical Formulas |
| :--- | :--- | :--- |
| **Mod 01: Fundamentals** | Unit economics, funnel stages, media metrics, budgeting | CPC, CPM, CTR, CPL, CPA, CAC, ROAS, MER, POAS, LTV |
| **Mod 02: Google Search & AI Max** | Account hierarchy, keyword match types, RSAs, Quality Score, AI Max | Ad Rank = Bid x Quality Score; STAG architectures; negative lists |
| **Mod 03: Shopping, PMax & YouTube** | GMC feeds, PMax asset groups, audience signals, Demand Gen | Title formulas: [Brand + Type + Feature + Color + Size]; priority tiers |
| **Mod 04: Meta Ads Mastery** | ODAX objectives, Advantage+ Shopping, custom audiences, 3x3 matrix | Total Value = Bid x Estimated Action Rate + Quality; FTIR; frequency |
| **Mod 05: Tracking Engineering** | GTM containers, dataLayer, GA4 Key Events, Enhanced Conversions, CAPI | SHA-256 user data hashing; event_id deduplication; dataLayer.push() |
| **Mod 06: Landing Pages & CRO** | Message match, mobile UX, LIFT model, Clarity, A/B split testing | Sample size formulas; MDE; 95% statistical significance; PIE scoring |
| **Mod 07: Reporting & Optimization** | Daily/weekly SOPs, Looker Studio dashboards, attribution, pacing | Marginal ROAS = ΔRevenue / ΔAdSpend; DDA vs. last-touch models |
| **Mod 08: AI & Media Operations** | Generative ad copy, automated rules, policy safeguards, compliance | Automated rule conditional logic; prompt frameworks; policy protocols |
| **Mod 09: Industry Capstone** | Full synthesis: Search, PMax, Meta, GTM, Looker Studio, budget model | 90-Day integrated multi-channel media engine; oral defense |

### 6.3 Module-to-Tool Matrix

| Module | Google Ads | Ads Editor | Data Manager | Meta Ads | Events Mgr | GA4 | GTM | GMC | Looker Studio | Sheets | Clarity | AI Tools |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Mod 01** | | | | | | | | | | ● | | ● |
| **Mod 02** | ● | ● | | | | | | | | ● | | ● |
| **Mod 03** | ● | ● | | | | | | ● | | ● | | ● |
| **Mod 04** | | | | ● | ● | | | | | ● | | ● |
| **Mod 05** | ● | | ● | | ● | ● | ● | | | | | |
| **Mod 06** | | | | | | | ● | | | | ● | ● |
| **Mod 07** | ● | | | ● | | ● | | | ● | ● | | |
| **Mod 08** | ● | | | ● | | | | | | | | ● |
| **Mod 09** | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |

---

## 7. Practical Access, Licensing & Authorized Simulation Fallback Matrix

Nova Skills guarantees that every student can successfully complete 100% of practical assignments without purchasing paid software licenses or spending personal money on ads:

| Tool / System | Primary Access Method | Authorized Simulation Fallback (If Blocked) | Cost to Student |
| :--- | :--- | :--- | :---: |
| **Google Ads** | Free Google Account -> Expert Mode -> Pause / Draft Status | Google Ads Editor offline database (.csv/.aea imports) | **₹0** |
| **Google Ads Editor** | Free desktop download from Google (Windows/Mac) | Direct spreadsheet upload template | **₹0** |
| **Meta Ads Manager** | Personal Facebook Profile -> Meta Business Suite Sandbox | Offline Meta Campaign Blueprint spreadsheet + creative deck | **₹0** |
| **Meta Events Manager** | Sandbox Dataset inside Meta Business Suite | Test Events Tool simulation + GTM preview verification | **₹0** |
| **Google Tag Manager** | Free Google account -> Web container creation | Local GTM container import/export (.json) | **₹0** |
| **Google Analytics 4** | Official Google Merchandise Store GA4 Demo Property | Student sandbox GA4 property in DebugView mode | **₹0** |
| **Google Merchant Center** | Free GMC account -> Test Feed upload | Local TSV Feed Validator & Google Sheets Feed Template | **₹0** |
| **Looker Studio** | Free Google Cloud account -> Direct connectors | Public sample Google Ads & GA4 datasets | **₹0** |
| **Microsoft Clarity** | Free Microsoft account -> Instant project setup | Pre-recorded session replay archive & heatmap exports | **₹0** |
| **Landing Page Sandbox** | Free WordPress / LocalWP or Canva builder | Static HTML/CSS template or Figma wireframe | **₹0** |
| **Generative AI** | Free ChatGPT (GPT-4o) & Google Gemini tiers | Structured prompt templates & instructor swipe files | **₹0** |

---

## 8. Student Portfolio & Capstone Requirements

To graduate and earn the **Nova Skills Certified Performance Marketing Specialist** credential, students must compile and present a comprehensive 8-asset professional portfolio:

1. **Asset 1: Multi-Channel Performance Budget & Unit Economics Model (Sheets)**
   - Dynamic Google Sheets workbook modeling CAC, ROAS, POAS, MER, and 90-day cash flow projections for 3 scenarios.
2. **Asset 2: Google Search Campaign Architecture Archive (Ads Editor .csv/.aea)**
   - Complete Google Ads Editor archive containing STAG campaign hierarchies, 60+ mapped keywords, negative lists, and RSAs.
3. **Asset 3: Performance Max Campaign Blueprint & Asset Group Matrix (Sheets/Doc)**
   - Segmented PMax asset groups with 15 headlines, descriptions, creative asset links, and layered audience signals.
4. **Asset 4: Meta Ads Master Campaign Build Document & 3x3 Creative Deck**
   - Full-funnel ODAX blueprint with Advantage+ Shopping setup, customer caps, audience exclusions, and 9 production ad mockups.
5. **Asset 5: Production-Ready Google Tag Manager Container (.json)**
   - Exported GTM container file instrumenting GA4 e-commerce events, Google Ads Enhanced Conversions, and Meta Pixel tags.
6. **Asset 6: Landing Page Heuristic CRO Audit & Wireframe Specification Deck**
   - 20-point LIFT model heuristic audit, Microsoft Clarity session analysis, and mobile-first landing page wireframe.
7. **Asset 7: Interactive Executive Performance Dashboard (Looker Studio)**
   - Live single-page Looker Studio dashboard connecting multi-channel ad spend and revenue metrics with custom calculated fields.
8. **Asset 8: Final Capstone Client Pitch Deck & 15-Minute Video Defense**
   - 25-slide commercial agency proposal and recorded Loom/video walkthrough defending technical and strategic media decisions.

---

## 9. Comprehensive Assessment Plan & Grading Rubrics

Assessment is continuous, quantitative, and centered on demonstrated technical capability:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          PERFORMANCE SPECIALIST GRADING SCHEME                         │
├───────────────────────────────────────────────────────┬────────────────────────────────┤
│ Assessment Component                                  │ Weightage                      │
├───────────────────────────────────────────────────────┼────────────────────────────────┤
│ 1. Continuous Lab Practicals & Assignments (Mod 01–08) │ 40% (5% per module assignment) │
│ 2. Technical Tracking & Tagging Practical Exam        │ 20% (Timed GTM/GA4 challenge)  │
│ 3. Final Multi-Channel Capstone Portfolio (Mod 09)    │ 30% (8 Technical Assets)       │
│ 4. Oral Viva Voce & Strategy Defense                  │ 10% (15-min panel defense)     │
├───────────────────────────────────────────────────────┴────────────────────────────────┤
│ MINIMUM PASSING BENCHMARK: 75% Overall Aggregate Score                                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Timed Technical Tracking Practical Exam (20%)
* Conducted at the end of Module 05.
* Students are provided a broken sandbox e-commerce website and a raw GTM container.
* **Challenge:** Within a 3-hour timed window, students must diagnose and fix 5 intentional tracking bugs (e.g., missing dataLayer variable, duplicate transaction firing, unhashed enhanced conversion parameters, missing sitewide conversion linker, and unverified CAPI event ID).

### 9.2 Capstone Portfolio & Viva Voce Evaluation (40%)
* Evaluated by an expert panel of senior media buyers and agency directors.
* Students present their 25-slide strategy deck and defend media budget allocations, bidding strategy transitions, and attribution models under rigorous cross-examination.

---

## 10. Academic Risk Register & Mitigation Controls

| Risk ID | Risk Description | Probability | Impact | Mitigation Strategy & Operational Safeguard |
| :--- | :--- | :---: | :---: | :--- |
| **R-01** | Student accidentally spends personal funds on ad platforms. | Low | Critical | **Strict Zero-Spend Protocol:** Account creation conducted in Expert Mode without billing activation, or using offline Google Ads Editor and Meta Sandbox accounts. Billing entry is strictly prohibited. |
| **R-02** | Ad platform interface updates (Meta/Google UI changes). | High | Medium | Teaching focuses on **underlying auction principles and data schemas** rather than brittle click-paths. Monthly curriculum reviews update button location guides. |
| **R-03** | Ad account or Business Manager disabled by automated bot. | Medium | High | Students utilize isolated test business portfolios. If flagged, immediate fallback to Google Ads Editor archives and offline Meta blueprint spreadsheets ensures zero learning disruption. |
| **R-04** | Third-party cookie deprecation disrupts traditional tracking. | High | High | Curriculum is engineered from Day 1 around **first-party data, Enhanced Conversions, server-side tracking concepts, and Conversions API (CAPI)**. |
| **R-05** | Students treat platform ROAS as net profit. | High | High | Unit economics in Module 01 and Module 07 explicitly drill **POAS (Profit on Ad Spend), MER, Contribution Margin, and fulfillment/return costs**. |
| **R-06** | Excessive reliance on unverified AI copy generators. | Medium | Medium | Module 08 enforces strict **human-in-the-loop review, brand voice guidelines, and advertising policy compliance checks**. |

---

## 11. Implementation & Transition Plan

Following approval of this authoritative specification, the website implementation will proceed in the following structured sequence:

1. **Central Catalog Update (`data.js`):**
   - Update `NS_COURSES` and `NS_ACADEMIES[0].courses` records:
     - `id`: `"performance-marketing-specialist"`
     - `name`: `"Performance Marketing Specialist"`
     - `duration`: `"4 Months"`, `durationMonths: 4`, `learningHours: 160`
     - `price: 34900`, `originalPrice: 34900`
     - 9 summary curriculum modules (160h total).
     - 10 primary tools.
2. **Backward-Compatible Routing (`course-detail.js`):**
   - Add `'perf-marketing-pro': 'performance-marketing-specialist'` to `COURSE_ALIASES`.
3. **Course Payload Migration (`data/courses/`):**
   - Git-move `data/courses/perf-marketing-pro.json` -> `data/courses/performance-marketing-specialist.json` and populate full 9-module, 8-project payload.
4. **Consolidated Master Catalog Sync (`nova-skills-109-course-content.json`):**
   - Synchronize record at Index 2, maintaining 108 other course entries byte-for-byte identical.
5. **Asset Regeneration & Validation:**
   - Run `node scripts/build_min_js.js` and `node scripts/generate-sitemap.js`.
   - Run validation suites (`test-ga4-lead-tracking.js`, `validate-seo-implementation.js`).

---

**END OF ACADEMIC SPECIFICATION**
*Document Version: 1.0.0 (October 2026 Authoritative Release)*
*Prepared for: Nova Skills Academic Council & Engineering Team*
