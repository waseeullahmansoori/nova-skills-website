# P1-8 EMPLOYER VERIFICATION REGISTER & PARTNERSHIP STANDARDS

**Project:** Nova Skills  
**Task ID:** P1-8  
**Priority:** P1 — High  
**Document Version:** 1.0.0  
**Effective Date:** November 13, 2026  
**Auditor:** Antigravity Engineering & Legal QA  

---

## 1. Objective & Legal Standard

The objective of this register is to establish strict, evidence-based standards for publishing employer names, partner logos, recruitment networks, and industry relationships across Nova Skills' digital platforms.

Under Indian advertising standards (ASCI Guidelines for Educational Institutions) and Consumer Protection regulations:
1. An educational institute must never claim or imply an employer partnership that is not supported by documented, written authorization.
2. An educational institute must never scrape third-party corporate logos and display them as "Hiring Partners" merely because alumni have applied to or been hired by those organizations independently.
3. An educational institute must clearly distinguish between **Formal Institutional Partners**, an **Active Referral Network**, and general **Employment Sectors**.

---

## 2. Four-Tier Employer Classification Taxonomy

Nova Skills strictly categorizes all employer-related references into one of the four following tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NOVA SKILLS EMPLOYER TAXONOMY                   │
├────────────────────────────────┬───────────────────────────────────────┤
│ Tier A: Formal Hiring Partners  │ Formal MoU / Signed Contract / Logo   │
│                                │ Authorization (0 currently public)    │
├────────────────────────────────┼───────────────────────────────────────┤
│ Tier B: Employer Referral Net   │ Documented candidate-sharing / direct │
│                                │ job vacancy notifications (Admissions)│
├────────────────────────────────┼───────────────────────────────────────┤
│ Tier C: Employment Sectors     │ Approved industry domains preparing   │
│                                │ learners for modern workflows (6)     │
├────────────────────────────────┼───────────────────────────────────────┤
│ Tier D: Potential Employers    │ Open-market employers where graduates │
│                                │ apply independently (No claims made)  │
└────────────────────────────────┴───────────────────────────────────────┘
```

### Detailed Tier Criteria

### Tier A: Formal Hiring Partners
- **Definition:** Organizations that have entered into an executed Memorandum of Understanding (MoU), campus recruitment agreement, or formal talent partnership agreement with Nova Skills Education Institute.
- **Publication Requirement:**
  - Fully executed agreement on file with management.
  - Explicit written consent to display the company's trademarked logo on `novaskills.in`.
  - Specific agreement terms, validity dates, and designated corporate contact.
- **Current Status:** **ZERO (0) formal partners currently approved for public logo display.**
- **Policy Enforcement:** Nova Skills does NOT publish an unverified corporate logo carousel. No logos of multinational tech giants (e.g. Google, Microsoft, Amazon, Meta) may ever be displayed as "Nova Skills Hiring Partners" unless a formal, signed institutional campus hiring partnership exists.

### Tier B: Employer Referral Network
- **Definition:** Regional digital agencies, local technology startups, e-commerce operators, and creative production houses that have shared active openings with Nova Skills' admissions and placement desk, or invited student portfolio submissions.
- **Privacy Standard (Digital Personal Data Protection Act 2023):** Resumes and student portfolios are forwarded to referral connections **only after obtaining explicit student consent** (as mandated under Section 4 of Nova Skills' published Privacy Policy).
- **Public Representation:** Described accurately as:
  > *"Access to relevant job opportunities and referral connections across regional and industry networks for eligible students."*
- **Prohibited Representation:** Must never be advertised as "Exclusive Corporate MoUs" or "Guaranteed Interview Slots".

### Tier C: Employment Sectors (Approved Public Content)
- **Definition:** Specific economic sectors and business models for which Nova Skills' practical, project-based curriculums develop verifiable competencies.
- **Public Representation:** Labeled transparently as:
  > *"Companies & Industries Our Practical Skills Prepare You For"*
- **The 6 Approved Sectors:**
  1. **Digital Marketing Agencies & Media Consultancies:** SEO, Performance Marketing, Social Media Strategy, Paid Media Management.
  2. **Technology Startups & SaaS Companies:** Full Stack Web Applications, API Development, Cloud Deployment, AI Integrations.
  3. **E-Commerce Brands & D2C Enterprises:** Shopify Development, Growth Marketing, Catalog Merchandising, Conversion Optimization.
  4. **Creative Design Studios & Branding Agencies:** Graphic Design, UI/UX Product Design, Brand Identity Systems, Packaging.
  5. **Media Houses & Video Production Studios:** Commercial Video Editing, Motion Graphics, Short-Form Content Production, Color Grading.
  6. **3D Visualization & Architectural Design Firms:** 3D Interior & Exterior Rendering, ArchViz, Blender/3ds Max Asset Pipelines.

### Tier D: Potential Employers
- **Definition:** All enterprise, public sector, and mid-market organizations operating open job portals (e.g. LinkedIn, Naukri, Indeed, Wellfound) where students may apply independently using their skills and portfolio.
- **Public Representation:** Nova Skills makes **zero partnership claims** regarding Tier D employers.

---

## 3. Verification & Publication Register

| Registry ID | Entity / Sector Name | Classification Tier | Relationship Nature | Evidence Source | Logo Display Approved? | Public Representation Scope |
|---|---|---|---|---|---|---|
| `EMP-SEC-01` | Digital Marketing Agencies | Tier C: Employment Sector | Industry Target Domain | Curricula modules for SEO, Meta, Google Ads | No (Sector badge only) | "Industries our practical skills prepare you for" |
| `EMP-SEC-02` | Tech Startups & SaaS | Tier C: Employment Sector | Industry Target Domain | Full Stack, Python, and AI software labs | No (Sector badge only) | "Industries our practical skills prepare you for" |
| `EMP-SEC-03` | E-Commerce Brands | Tier C: Employment Sector | Industry Target Domain | Shopify, WooCommerce, Growth marketing | No (Sector badge only) | "Industries our practical skills prepare you for" |
| `EMP-SEC-04` | Creative Design Studios | Tier C: Employment Sector | Industry Target Domain | Branding, Figma UI/UX, Adobe Photoshop/Illustrator | No (Sector badge only) | "Industries our practical skills prepare you for" |
| `EMP-SEC-05` | Media & Production Houses | Tier C: Employment Sector | Industry Target Domain | Premiere Pro, DaVinci Resolve, After Effects | No (Sector badge only) | "Industries our practical skills prepare you for" |
| `EMP-SEC-06` | 3D ArchViz & Interior Firms | Tier C: Employment Sector | Industry Target Domain | 3ds Max, Blender, Chaos V-Ray, Unreal Engine | No (Sector badge only) | "Industries our practical skills prepare you for" |
| `EMP-REF-REGIONAL` | Regional Employer Referral Network | Tier B: Referral Network | Candidate-sharing connections | Internal placement desk candidate sharing records | No | "Referral connections for eligible graduates" |

---

## 4. Logo Permission & Trademark Protocol

1. **Strict Prohibition on Logo Scraping:** Under no circumstances will SVG or PNG logo files of commercial entities be added to `images/` or `public/assets/` to create a fake "Trusted By / Hired By" logo ribbon.
2. **Typography-Based Sector Badging:** The website uses styled typographic badges (e.g., `<div class="partner-logo-item">Digital Marketing Agencies</div>`) to clearly convey industry exposure without trademark misappropriation.
3. **Future Partner Onboarding Checklist:**
   Before any company name or corporate logo is published on `placements.html` or `index.html`:
   - [ ] Executed partnership agreement signed by Nova Skills director and employer representative.
   - [ ] Explicit written logo usage grant specifying permissible size, background, and duration.
   - [ ] Designated talent acquisition contact at the employer.
   - [ ] Written confirmation of the recruitment mechanism (campus drive, priority referral, or portfolio showcase).
   - [ ] Entry logged into this register with an assigned `EMP-PARTNER-###` identifier.
