# Nova Skills — AI Search Visibility & Forensic Website Audit (Phase 0)

**Document ID:** AI-SEO-PHASE-0-AUDIT  
**Website:** https://novaskills.in/  
**Business:** Nova Skills — EdTech & Professional Skills Training  
**Audit Scope:** 175 Discoverable URLs, 109 Canonical Courses, 12 Academies, 36 Online Service Areas, 1 Physical Campus  
**Target AI Ecosystems:** ChatGPT, Perplexity, Gemini, Microsoft Copilot, Claude  
**Branch:** development  
**Execution Timestamp:** 2026-11-13T09:02:20.085Z  

---

## 1. Executive Summary & Repository Architecture

Nova Skills is a modern Indian EdTech institution providing career-focused vocational, technology, design, and digital training.

### Technical & Hosting Stack
- **Architecture:** Static Site Generation (JAMstack) + Cloudflare Pages Serverless Edge Ingress.
- **Dynamic Course Rendering:** Cloudflare Pages Middleware (`functions/_middleware.js`) + Server-Side Pre-rendered Course HTML Dictionary (`functions/_rendered_courses.js`).
- **Core Invariant for Courses:** All 109 canonical courses are accessible via the invariant URL structure: `https://novaskills.in/course-detail.html?id=[id]`. Search engine and AI bots receive fully pre-rendered static HTML with rich metadata, semantic headings, and JSON-LD structured data on the initial HTTP GET response.
- **Physical Campus Invariant:** Exactly **one physical classroom campus** located at Siddharth Nagar, Uttar Pradesh (PIN 272153). Only this campus is marked with Schema.org `LocalBusiness`.
- **Online Learning Coverage Invariant:** The 36 city pages (`/branches/<slug>/`) represent live-interactive online learning service areas. They do NOT represent physical branch offices.
- **Tuition Baseline Invariant:** Approved starting tuition claim is **₹2,900 (+ 18% GST)**.

---

## 2. Source of Truth Register

To prevent data drift and conflicting information across AI search engines:
- **Courses:** `data/courses.json` (Canonical schema, 109 records).
- **Academies:** `data/academies.json` (12 canonical academies).
- **Service Areas (Locations):** `data/locations/locations.json` (36 verified online hubs).
- **Mentors & Faculty:** `data/mentors.json`.
- **Student Projects:** `data/student-projects.json`.
- **Admissions Helpline:** `+91 9695904440` (Single source in `js/contact-config.js`).
- **WhatsApp Admissions:** `919695904440`.

---

## 3. Five-Platform AI Search Assessment Baseline

| AI Platform | Primary Discovery Surface | Target Crawlers | Observed Baseline Status | Readiness Priority |
| :--- | :--- | :--- | :--- | :--- |
| **ChatGPT** | ChatGPT Search, Search-grounded answers | `OAI-SearchBot` (Search), `ChatGPT-User` (Retrieval), `GPTBot` (Training) | Crawlable under global wildcard; needs explicit documentation in robots policy | **P0 (Immediate)** |
| **Perplexity** | Perplexity Search, Source citations | `PerplexityBot` (Search), `Perplexity-User` (Retrieval) | Accessible via Cloudflare edge; zero blocking rules detected | **P0 (Immediate)** |
| **Gemini** | Google AI Overviews, AI Mode, Gemini Apps | `Googlebot` (Search index & AI Overviews), `Google-Extended` (Gemini Apps training/use) | Googlebot receives 100% pre-rendered SSR; Google-Extended policy separate | **P0 (Immediate)** |
| **Microsoft Copilot**| Bing AI Summaries, Copilot Grounding | `Bingbot` (Bing index & Copilot grounding) | Bingbot indexed; eligible for Bing AI Performance telemetry | **P1 (High)** |
| **Claude** | Claude Web Search, User-directed fetching | `Claude-SearchBot` (Search), `Claude-User` (Retrieval), `ClaudeBot` (Training) | Searchbot permitted; machine-readable training signals tracked | **P1 (High)** |

---

## 4. Key AI Readiness Findings

1. **Entity Clarity:** Nova Skills possesses well-structured Schema.org data (`EducationalOrganization`, `Course`, `BreadcrumbList`). To optimize for AEO/GEO, entity connections between academies, courses, and skills must be reinforced with semantic context.
2. **Campus vs. Service Area Disambiguation:** Previous audits successfully sanitized all local schema on city pages. AI models must never hallucinate physical classrooms in cities like Indore or Mumbai; prompt evaluations must explicitly verify that LLMs answer with "Live-Online learning available with physical campus in Siddharth Nagar, UP".
3. **Pre-Rendered Edge SSR:** Because Cloudflare Edge Workers pre-render all 109 course detail pages, AI bots that lack JavaScript execution capability (such as lightweight search crawlers) can extract 100% of the syllabus, project, and fee details without client-side hydration delays.
