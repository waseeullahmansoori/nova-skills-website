# P1-6 Tool, Software Subscription & AI Tool-Credit Audit

**Project:** Nova Skills  
**Task ID:** P1-6  
**Date:** November 13, 2026  
**Auditor:** Antigravity Engineering & Academic Tooling Audit  
**Scope:** Repository-wide audit of all 109 published courses across 12 academies.

---

## 1. Executive Summary

A core principle of consumer transparency in modern technical training is that students must not face unexpected, post-enrollment financial friction. If a curriculum requires paid third-party software licenses (e.g., Adobe Creative Cloud, 3ds Max), commercial AI generation credits (e.g., Midjourney, Runway, ElevenLabs), or usage-based API billing (e.g., OpenAI API, Anthropic Claude API), this responsibility must be explicitly disclosed prior to enrollment.

This audit evaluates the 531 unique software tools and platforms taught across Nova Skills' 109 courses and establishes a standardized taxonomy of tool access models and cost responsibilities.

---

## 2. Standardized Tool Access Model Taxonomy

Every tool and service utilized in Nova Skills curricula is classified into one of ten definitive access models:

| Access Model | Commercial & Academic Meaning | Student Cost Responsibility |
|---|---|---|
| **Institute Provided** | Nova Skills directly supplies software licenses, campus lab workstations, or supervised platform access. | Included in Tuition ($₹0$ extra) |
| **Included Licensed Access** | An individual student license is bundled and paid for within the course tuition. | Included in Tuition ($₹0$ extra) |
| **Free Tier / Zero-Cost Student Policy** | Software operates on a permanent free tier or open-source license sufficient to complete 100% of assessed coursework. | Free ($₹0$ extra) |
| **Student Subscription Required** | Student must personally purchase a commercial software plan before commencing assessed coursework. | Student-Borne Mandatory Expense |
| **Optional Premium** | A commercial paid tier exists (e.g., Cursor Pro, ChatGPT Plus, Claude Pro), but is completely optional; course completion and portfolio defense are achievable using free tiers. | Student-Borne Optional Expense |
| **Usage-Based API** | Charges scale directly with token consumption, API calls, or cloud compute. Clear rate-limiting and free-credit optimizations are provided. | Student-Borne Usage Expense (Controlled) |
| **Shared Classroom Access** | Premium or enterprise software is accessed exclusively on managed campus lab machines during supervised sessions. | Included for On-Campus Batches |
| **Trial Access** | Tool is demonstrated or utilized during an official vendor free trial period (e.g., 7-day or 14-day evaluation). | Free for Trial Duration |
| **No Additional Cost** | Verified zero-cost execution pathway for all required exercises and portfolio projects. | Verified $₹0$ |
| **Pending Verification** | Official institutional licensing agreement or student discount partnership is under review. | Disclosed as Pending |

---

## 3. Academy-by-Academy Tool & Cost Audit

### 3.1 AI Academy (10 Courses, 85 Unique Tools)
- **Frontier LLM Interfaces (ChatGPT, Claude, Gemini):** Taught extensively. Accessible via standard free tiers (ChatGPT GPT-4o free tier, Claude free tier, Google Gemini free tier). Paid subscriptions (`ChatGPT Plus` at \$20/mo, `Claude Pro` at \$20/mo) are explicitly **Optional Premium** and never required for graduation.
- **AI Model APIs (OpenAI API, Anthropic Claude API, Google Gemini API):**
  - **Google AI Studio / Gemini API:** Verified **Free Tier** (generous free rate limits for Gemini 1.5 Flash / Pro with zero billing requirement).
  - **OpenAI & Anthropic APIs:** **Usage-Based API**. Taught with local token caching, mock test runners, and rate limiting. Exercises are structured so that total optional student API consumption across a multi-month program is estimated at ₹1,500–₹2,500 total, with zero mandatory minimums.
  - **Local Open-Source AI (Ollama, Hugging Face, Qdrant, pgvector):** 100% **Free Tier / Open Source**. Runs on student development machines or inside local Docker containers with zero external API fees.
- **Workflow & Automation Tools (n8n, LangGraph):**
  - **n8n Community Edition:** Verified **Free Tier / Open Source** (self-hosted via Docker or n8n desktop).
  - **LangGraph & FastAPI:** 100% open-source Python libraries.
- **Knowledge Systems (Gemini Notebook / NotebookLM):** 100% **Free Tier** by Google.

### 3.2 Programming & Web Development Academy (10 Courses, 76 Unique Tools)
- **Core Stacks (React 19, Next.js 15, Node.js, Python, PostgreSQL):** 100% **Free Tier / Open Source**.
- **AI Coding Assistants (Cursor, Claude Code, Google Antigravity, GitHub Copilot):**
  - Cursor free tier (2,000 completions + 50 slow premium requests).
  - Claude Code and Google Antigravity demonstrated within governed educational workflows.
  - Cursor Pro (\$20/mo) is explicitly classified as **Optional Premium**.
- **Deployment & Cloud Infrastructure (Vercel, Supabase, Cloudflare, GitHub Pages):**
  - All student portfolio applications are engineered to deploy within generous permanent **Free Tiers** (Vercel hobby plan, Supabase free tier with 500MB DB, free Cloudflare SSL, GitHub public repositories).
- **Custom Domains:** Optional student purchase; all projects include working `.vercel.app` or `.github.io` subdomains with free SSL.

### 3.3 Design & Visual UI/UX Academy (10 Courses, 44 Unique Tools)
- **Figma:** Taught using **Figma Free Tier / Figma for Education** (unlimited drafts, 3 collaborative files). Figma Professional is optional.
- **Adobe Creative Cloud (Photoshop, Illustrator, InDesign):**
  - Campus students receive **Shared Classroom Access** on lab workstations.
  - Online learners utilize student plans or free trial periods, with zero-cost open-source vector/raster alternatives (Photopea, Inkscape, Figma) introduced for conceptual parity.
- **Canva:** Taught using **Canva Free Tier**; Canva Pro features are demonstrated but not mandatory.

### 3.4 Video & Motion Academy (8 Courses, 35 Unique Tools)
- **Video Editing Suites (Premiere Pro, After Effects, DaVinci Resolve):**
  - **DaVinci Resolve:** Fully featured **Free Tier** (Blackmagic Design offers industry-grade non-linear editing, Fairlight audio, and Fusion VFX at ₹0 cost).
  - **Adobe Premiere Pro & After Effects:** Demonstrated in studio labs; commercial CC subscriptions are disclosed as student-borne if working remotely outside campus hours.
- **Generative AI Video (Runway, Kling, Luma, Adobe Firefly):**
  - Utilizes platform free signup credits for student exercises. Extensive high-volume commercial rendering is classified as **Usage-Based / Optional Premium**.

### 3.5 No-Code Web Academy (8 Courses, 29 Unique Tools)
- **Shopify:** Utilizes **Shopify Partner Development Stores**, which are 100% free and fully functional without time limits until commercial client handoff.
- **Webflow:** Utilizes **Webflow Starter / Free Plan** (2 unhosted projects with full CMS capabilities) and free Webflow for Education access where eligible.
- **WordPress:** Taught using **LocalWP** (Local by Flywheel), an entirely free local development environment requiring zero paid hosting or domain purchases.

### 3.6 3D & Technical Visualization Academy (8 Courses, 30 Unique Tools)
- **Blender:** 100% **Open Source / Free** forever (complete modeling, sculpting, UV, shading, Cycles/EEVEE rendering).
- **Unreal Engine 5:** 100% **Free Tier** for learning and development (Epic Games charges royalties only after \$1M in commercial revenue).
- **3ds Max, V-Ray, Cinema 4D:** Campus lab access provided. Independent student licenses are subject to Autodesk/Chaos student verification programs.

### 3.7 Digital Marketing, Creator & Business Academies (49 Courses)
- **Google & Meta Ads:** Campaign planning, ad group architecture, and conversion tracking are taught using live sandbox structures. Live ad budget spend is **Optional**; real student money is never forcibly spent to graduate.
- **Analytics & SEO (GA4, Google Search Console, Looker Studio):** 100% **Free Tier** provided by Google.
- **Office Productivity (Excel, Power BI Desktop, Google Sheets):** Power BI Desktop is 100% free; Google Sheets is free; Microsoft Office utilizes free online or student web access.

---

## 4. Preservation of Existing High-Integrity Disclosures

Two course pages had previously established rigorous, transparent cost disclosures. These are explicitly preserved:

1. **AI-Assisted Full Stack Web Development (`ai-assisted-full-stack-web-development`):**
   - *Preserved Statement:* Coursework operates on a Zero-Cost Student Policy (VS Code, Git, Supabase, Vercel free tiers). Optional subscriptions (Cursor Pro, ChatGPT Plus, Claude Pro) are not required for graduation. API labs utilize Google AI Studio free tier. Custom domains are optional.
2. **AI Productivity Professional (`ai-productivity`):**
   - *Preserved Statement:* Paid Microsoft Copilot and ChatGPT Plus subscriptions are not required. Zero-cost alternatives (ChatGPT free, Claude free, Gemini Notebook 100% free, free Office Online, Windows Power Automate Desktop) allow full completion.

---

## 5. Course Cost Transparency Grid Specification

To ensure prospective students can review software requirements at a glance, every course detail page will feature a structured **Software, Subscriptions & Additional Costs** component with 4 transparent categories:
1. **Included in Tuition:** All instruction, mentor code reviews, project specifications, and credentialing.
2. **Free Student Access (₹0):** Verified free tiers, partner development accounts, or open-source software.
3. **Optional Premium Upgrades:** Advanced subscriptions that students may explore but do not need to purchase.
4. **Usage-Based / External Costs:** Details on token consumption, cloud overages, or ad budgets, with typical ranges and free alternatives clearly specified.
