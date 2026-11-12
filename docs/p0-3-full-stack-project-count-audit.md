# P0-3 FORENSIC AUDIT & IMPLEMENTATION REPORT
## Resolution of Project-Count & Numbering Inconsistencies for AI-Assisted Full Stack Web Development

**Course ID:** `ai-assisted-full-stack-web-development`  
**Course Title:** AI-Assisted Full Stack Web Development  
**Academy:** Programming Academy  
**Task ID:** P0-3  
**Priority:** P0 — Critical  
**Target Branch:** `development` (Strictly NO production deployment)  
**Date of Audit:** November 12, 2026  

---

## 1. Executive Summary & Root Cause Analysis

### Forensic Finding
The AI-Assisted Full Stack Web Development program has an explicitly documented academic structure comprising:
- **4 Common Core Production Projects** (Modules 01–12)
- **1 Specialization Production Project** selected from 3 mutually exclusive tracks (Module 10)
- **1 Integrated Enterprise Commercial Capstone Project & Viva Voce Defense** (Modules 13–14)

Under this structure, **each enrolled student completes exactly 6 production portfolio deliverables**:
$$\text{Required Per-Student Deliverables} = 4 \text{ (Common)} + 1 \text{ (Selected Specialization)} + 1 \text{ (Capstone)} = 6$$

### Root Cause of Public Inconsistencies
The conflicting public representations arose because:
1. **Specialization Tracks Miscounted as Mandatory Projects (The "8" Discrepancy):**  
   The course curriculum includes three alternative specialization paths (Path A: Agency CMS, Path B: Shopify Store, Path C: AI SaaS). The original course generator and rendered HTML naively flattened all 8 build options into a single sequential list:
   - Items 1–4 were labeled "Production Project 1" through "Production Project 4".
   - Item 5 (Path A: Agency CMS) was labeled "Production Project 5".
   - Item 6 (Path B: Shopify Store) was mislabeled "Production Project 6" (**Shopify was never project 6!**).
   - Item 7 (Path C: AI SaaS) was mislabeled "Production Project 7".
   - Item 8 (Capstone) was labeled "Enterprise Capstone Project".  
   This caused the course hero and overview in pre-P0-1 snapshots to claim "8 Core Production Projects" and "8 major production portfolio projects", erroneously treating 3 alternative choices as 3 separate mandatory requirements ($4 + 3 + 1 = 8$).

2. **Legacy "3 Projects" Fallback Badge:**  
   Before P0-1 established the canonical data model, client-side rendering templates (`courses.js` / `course-data.js`) evaluated `course.liveProjects || 2` or legacy fallbacks when a course lacked explicit primary counts, resulting in transient "3 Projects" badges in un-hydrated or legacy views.

3. **Inconsistent Section Grouping in UI:**  
   The "Production Projects & Deliverables" section failed to visually group the projects, confusing students into believing all 7 builds plus capstone were mandatory.

---

## 2. Table of Discrepancies & Required Corrections

| Location | Pre-Audit / Legacy Claim | Authoritative Academic Truth | Corrective Action |
|---|---|---|---|
| **All Courses Catalog Description** | 6 production-grade portfolio projects | 6 portfolio projects per student | Preserved in catalog description and JSON-LD schema |
| **All Courses Card Badge** | "3 Projects" (legacy fallback) | "6 Portfolio Projects" | Canonical data binds `projects.displayLabel: '6 Portfolio Projects'` |
| **Detail-Page Hero Badge** | "8 Core Production Projects" | "6 Portfolio Projects" | Hero meta badge displays `6 Portfolio Projects` (never "8" or "Core") |
| **Detail-Page Overview Paragraph 1** | 6 production-grade portfolio projects | 6 portfolio projects per student | Preserved: 6 production portfolio deliverables |
| **Detail-Page Overview Paragraph 2** | "8 major production portfolio projects" | 4 Common + 1 Specialization + 1 Capstone = 6 | Reconciled: explicitly explains 4 common + 1 specialization + 1 capstone = 6 |
| **Learning Outcomes (#8)** | "6 verified production portfolio projects" | 6 verified portfolio projects | Preserved: verified 6 graduation deliverables |
| **Course FAQ (#7, #21)** | "6 production-grade projects" | 4 common + 1 specialization + 1 capstone | Preserved and reinforced: explicitly clarifies paths are mutually exclusive |
| **Curriculum Module 14 Deliverable** | Portfolio Project 06 / Six deliverables | Portfolio Project 06 Capstone | Preserved: Module 14 maps to Portfolio Project 06 |
| **Projects Section UI (Cards 5, 6, 7)** | Flat list (Shopify as P6, SaaS as P7) | 3 alternative specialization choices | Refactored UI into 3 distinct sections (Common 1–4, Track Option A/B/C, Capstone 6) |

---

## 3. Verified Per-Student Academic Project Architecture

### Group 1: Common Core Projects (Required for Every Student)
- **Project 1 (Module 03):** *Responsive Developer Portfolio & Identity Hub*  
  - **Deliverable:** Production-deployed responsive portfolio website on Vercel with 95+ Lighthouse score, semantic HTML5, fluid typography, dark mode, accessible contact form, and clean GitHub repository.
- **Project 2 (Module 07):** *High-Conversion Business Lead Generation Website*  
  - **Deliverable:** Multi-page Next.js 15 App Router web application with Server Actions, Zod form validation, appointment/lead capture simulation, responsive Tailwind styling, and live deployment.
- **Project 3 (Module 08):** *Full-Stack Multi-Role Admin Dashboard*  
  - **Deliverable:** Production Next.js 15 + Supabase application with user authentication, role-based access control, PostgreSQL Row-Level Security (RLS), real-time data tables, and security audit report.
- **Project 4 (Module 11):** *AI-Powered Business Assistant with Streaming & RAG*  
  - **Deliverable:** Full-stack AI application integrating Vercel AI SDK, OpenAI/Gemini APIs, real-time token streaming, tool calling, and semantic search via pgvector vector embeddings.

### Group 2: Specialization Project (Students Select Exactly ONE Track)
*Each track includes 20 guided instructional hours. Paths are mutually exclusive; exactly one track deliverable counts toward graduation.*
- **Option A (Path A — Agency Website Developer):**  
  *Commercial Agency Client Website with Dynamic CMS*  
  - **Stack:** Framer, WordPress CMS, Advanced Custom Fields (ACF), Webhooks.  
  - **Deliverable:** Fully functional agency client portal and dynamic CMS website with responsive animations and client editorial controls.
- **Option B (Path B — E-Commerce Developer):**  
  *Production Shopify Storefront with Custom Liquid Architecture*  
  - **Stack:** Shopify Online Store 2.0, Liquid templating language, Shopify CLI, Dawn Theme, GA4 E-commerce.  
  - **Deliverable:** Published Shopify development store with custom Liquid sections, slide-out Ajax cart, variant selectors, and verified sandbox checkout.
- **Option C (Path C — AI Web App & SaaS Developer):**  
  *Production-Grade AI SaaS MVP with Multi-Tenancy & Stripe*  
  - **Stack:** Next.js 15, PostgreSQL, Supabase RLS, Stripe Checkout & Webhooks, AI token quotas.  
  - **Deliverable:** Production-deployed SaaS web application featuring multi-tenant organization workspaces, subscription billing, and gated AI features.

### Group 3: Final Integrated Capstone (Required for Every Student)
- **Project 6 (Modules 13–14):** *Integrated Enterprise Capstone & Oral Viva Voce Defense*  
  - **Deliverable:** End-to-end commercial software product synthesized with the student's chosen specialization stack, featuring automated Playwright test suite, GitHub Actions CI/CD pipeline, comprehensive architecture documentation (Mermaid diagrams, PRD, runbook), production deployment, and passing score on a mandatory 15-minute live oral viva voce technical examination before an Examination Board panel.

---

## 4. Canonical Project Data Model

The canonical schema incorporates the formal `portfolioStructure`:

```json
{
  "courseId": "ai-assisted-full-stack-web-development",
  "portfolioStructure": {
    "commonProjects": [
      {
        "projectId": "fullstack-project-01",
        "sequence": 1,
        "title": "Responsive Developer Portfolio & Identity Hub",
        "type": "common-core",
        "moduleNumber": 3,
        "required": true
      },
      {
        "projectId": "fullstack-project-02",
        "sequence": 2,
        "title": "High-Conversion Business Lead Generation Website",
        "type": "common-core",
        "moduleNumber": 7,
        "required": true
      },
      {
        "projectId": "fullstack-project-03",
        "sequence": 3,
        "title": "Full-Stack Multi-Role Admin Dashboard",
        "type": "common-core",
        "moduleNumber": 8,
        "required": true
      },
      {
        "projectId": "fullstack-project-04",
        "sequence": 4,
        "title": "AI-Powered Business Assistant with Streaming & RAG",
        "type": "common-core",
        "moduleNumber": 11,
        "required": true
      }
    ],
    "specialization": {
      "requiredSelection": 1,
      "availableOptions": [
        {
          "id": "path-a",
          "trackCode": "Path A",
          "projectId": "fullstack-project-05a",
          "title": "Commercial Agency Client Website with Dynamic CMS",
          "moduleNumber": 10
        },
        {
          "id": "path-b",
          "trackCode": "Path B",
          "projectId": "fullstack-project-05b",
          "title": "Production Shopify Storefront with Custom Liquid Architecture",
          "moduleNumber": 10
        },
        {
          "id": "path-c",
          "trackCode": "Path C",
          "projectId": "fullstack-project-05c",
          "title": "Production-Grade AI SaaS MVP with Multi-Tenancy & Stripe",
          "moduleNumber": 10
        }
      ]
    },
    "capstone": {
      "projectId": "fullstack-project-06",
      "sequence": 6,
      "title": "Client-Style Commercial Capstone & Viva Voce Showcase",
      "moduleNumber": 14,
      "required": true
    },
    "requiredPortfolioCount": 6
  }
}
```

### Counting Formula:
$$\text{Per-Student Total} = \text{commonProjects.length} (4) + \text{requiredSelection} (1) + \text{capstoneCount} (1) = 6$$

---

## 5. UI Presentation Refactoring (Section 5E)

In `scripts/build-course-pages.js`, `course-detail.js`, and the rendered pages, the projects section is refactored from a flat 8-card grid into three visually and semantically distinct groups:

```html
<!-- Group 1 -->
<div class="project-group-block">
  <div class="project-group-heading">
    <span class="project-group-badge">MANDATORY CORE</span>
    <h3>Common Projects — Required for Every Student</h3>
    <p>Completed across Modules 01–12 of the core full-stack curriculum.</p>
  </div>
  <div class="projects-suite-grid">
    <!-- Production Projects 1, 2, 3, 4 -->
  </div>
</div>

<!-- Group 2 -->
<div class="project-group-block" style="margin-top:36px;">
  <div class="project-group-heading">
    <span class="project-group-badge" style="background:rgba(5, 153, 168, 0.15); color:var(--teal);">SPECIALIZATION TRACK (SELECT ONE)</span>
    <h3>Specialization Project — Select ONE Commercial Pathway</h3>
    <p>Each student selects exactly ONE 20-hour commercial specialization track. Included in standard tuition; all three options are presented below for comparison.</p>
  </div>
  <div class="projects-suite-grid">
    <!-- Option A (Path A), Option B (Path B), Option C (Path C) -->
  </div>
</div>

<!-- Group 3 -->
<div class="project-group-block" style="margin-top:36px;">
  <div class="project-group-heading">
    <span class="project-group-badge" style="background:rgba(16, 185, 129, 0.15); color:var(--green);">FINAL CAPSTONE</span>
    <h3>Final Project — Required for Every Student</h3>
    <p>Culminating enterprise commercial engagement synthesized with your chosen specialization stack.</p>
  </div>
  <div class="projects-suite-grid">
    <!-- Portfolio Project 6 — Enterprise Capstone -->
  </div>
</div>
```

---

## 6. Scope Protection & Invariants Verified

- **Course Duration:** 8 Months (strictly unchanged).
- **Guided Hours:** 320 Hours (300 Core + 20 Specialization = 320 total, strictly unchanged).
- **Course Fee:** ₹44,900 launch price / ₹64,900 regular fee (strictly unchanged).
- **Course ID & URL:** `ai-assisted-full-stack-web-development` & `/course-detail.html?id=ai-assisted-full-stack-web-development` (strictly unchanged).
- **Images:** Card images (`/images/projects/fullstack-foundation/ns-proj-fs-saas-capstone-card-640w.png`) strictly unchanged.
- **Specialization Selector:** Interactive 3-way radio selector in `course-detail.js` and `course-detail.html` continues to function seamlessly, preserving Path A, Path B, and Path C selection and passing selection to the enrollment modal.
- **Git Target:** `development` branch only. No push or deployment to `main` or production.

---

## 7. Modified Files & Validation Results

### Files Modified:
1. `data/courses/ai-assisted-full-stack-web-development.json` (Canonical detail record: added `portfolioStructure`, updated `what_you_will_build` badges to 1–4, 5A–5C, 6, and updated overview description).
2. `data/curricula/ai-assisted-full-stack-web-development.json` (Curriculum definition: synchronized with canonical structure).
3. `data/courses.json` (Canonical master courses database: attached `portfolioStructure` to `ai-assisted-full-stack-web-development`).
4. `scripts/migrate-course-data.js` (Canonical generator: propagates `portfolioStructure`).
5. `scripts/build-course-pages.js` (Course detail SSR builder: generates 3 distinct project groups for structured courses).
6. `course-detail.js` & `js/course-detail.min.js` (Client-side interactive course detail renderer: renders 3 distinct project groups).
7. `_rendered_courses/ai-assisted-full-stack-web-development.html` (Edge pre-rendered HTML: updated with grouped projects and 4+1+1=6 explanation).
8. `functions/_rendered_courses.js` (Cloudflare edge worker bundle: synced pre-rendered HTML).
9. `scripts/validate-course-data.js` (Extended automated validation suite with 10+ mathematical assertions for P0-3).
10. `docs/p0-3-full-stack-project-count-audit.md` (Forensic audit documentation).

### Validation Results:
- `validate-course-data.js`: **6,344 / 6,344 checks passed (0 failures)**.
- `verify-109-course-master-sync.js`: **100% passed (0 mismatches)**.
- `test-sitewide-109-pricing-audit.js`: **29 / 29 checks passed**.
- `test-academy-demo-banner.js`: **261 / 261 checks passed**.
- `test-pan-india-mumbai-correction.js`: **49 / 49 checks passed**.
- `test-phase4-trust-audit.js`: **Passed (0 missing GST)**.
- `qa_p0_3_browser_e2e.js` (Headless Chrome CDP E2E): **43 / 43 checks passed (100%)**.
  - Verified desktop (1440px) & mobile (390px) rendering.
  - Verified interactive Path A, Path B, and Path C radio switching, status bar updates, Module 10 dynamic syllabus switching, and modal opening.
