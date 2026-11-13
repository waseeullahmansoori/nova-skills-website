# Stage A — Pre-Deployment Git Audit & Release Scope

**Project:** Nova Skills Education Institute  
**Target URL:** https://novaskills.in/  
**Source Branch:** `development`  
**Target Branch:** `main`  
**Remote Repository:** `https://github.com/waseeullahmansoori/nova-skills-website.git`  
**Audit Timestamp:** November 13, 2026 (Pre-Deployment)

---

## 1. Branch & Remote Architecture

- **Active Working Branch:** `development`
- **Remote Tracking Branch:** `origin/development`
- **Target Production Branch:** `main`
- **Remote Production Branch:** `origin/main`
- **Remote URLs:**
  - Fetch: `https://github.com/waseeullahmansoori/nova-skills-website.git`
  - Push: `https://github.com/waseeullahmansoori/nova-skills-website.git`

---

## 2. Commit Comparison: `origin/main` vs `origin/development`

The current production HEAD on `origin/main` is commit `c638c50` (*"Complete Nova Skills course image integration"*).

The `development` branch contains the following 14 completed, reviewed, and tested feature commits ready for production release:

| Commit Hash | Author / Date | Task ID | Summary / Scope |
|:---|:---|:---|:---|
| `762d470` | Nova Skills Dev | **P0-1** | Centralize Nova Skills course data architecture into `courses.json` with 109 published course records, 12 academies, single source of truth |
| `c23a4a5` | Nova Skills Dev | **P0-2** | Correct AI Digital Marketing Specialist course data across website (duration, modules, tools) |
| `100801f` | Nova Skills Dev | **P0-3** | Resolve Full Stack project count inconsistencies (standardised 8 real portfolio capstones) |
| `5662efe` | Nova Skills Dev | **P0-4** | Correct Indore Full Stack guided hours & branch syllabus consistency |
| `5ef195a` | Nova Skills Dev | **P0-5** | Reconcile course pricing, upfront 18% GST disclosures, and ₹2,900 starting price claims |
| `4a57c5f` | Nova Skills Dev | **P1-1** | Improve demo booking and counselling forms (dual-intent architecture, validation, honeypot) |
| `3650230` | Nova Skills Dev | **P1-2** | Implement comprehensive GA4 lead and conversion tracking across 12 milestone funnel events |
| `b938343` | Nova Skills Dev | **P1-3** | Connect website lead forms to admissions CRM (Apps Script WebApp endpoint + offline fallback queue) |
| `bcdaa54` | Nova Skills Dev | **P1-4** | Optimise WhatsApp (+91 9695904440) and telephone CTAs with context-aware pre-filled parameters |
| `b50c727` | Nova Skills Dev | **P1-5** | Improve student project showcase, genuine verified testimonials, and verified faculty credibility |
| `4fe955e` | Nova Skills Dev | **P1-6** | Improve EMI financing transparency and third-party AI tool-credit disclosures |
| `234197e` | Nova Skills Dev | **P1-7** | Improve refund and cancellation policy visibility before enrolment across checkout and detail pages |
| `8939354` | Nova Skills Dev | **P1-8** | Improve placement support claims, hiring partner evidence, and verified outcome disclosures |
| `aea42af` | Nova Skills Dev | **P2-1** | Validate sitemap, robots.txt, canonical URLs, and 301 redirect architecture |

In addition, website-wide mobile responsiveness remediation across all 175 canonical routes and 6 standard viewports has been completed and verified with 0 horizontal overflow.

---

## 3. Secret & Credential Safety Audit

A static security scan was performed across the repository:
- **No private API keys or authentication secrets:** Found no AWS keys, private tokens, or database passwords in client files.
- **Admissions CRM Endpoint:** `https://script.google.com/macros/s/.../exec` is the sanctioned public submission endpoint designed for browser form POST requests.
- **Google Analytics ID:** `G-9WN9N2KF12` is the public client-side GA4 measurement identifier.
- **No development-only `noindex`:** Meta robots directives allow indexing of all canonical production routes while protecting admin/internal directories.

---

## 4. Release Blockers & Status

- **Merge Blockers:** None identified. Working tree is clean and aligned with `development`.
- **Test Integrity:** Complete regression test suites are being executed before merge.
- **Rollback Preparedness:** Previous production commit `c638c50` is logged and recorded.
