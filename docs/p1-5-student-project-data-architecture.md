# P1-5 Architecture Specification: Student Project Showcase & Portfolio Registry

**Document:** Student Project Data Architecture  
**Task ID:** P1-5  
**Canonical File:** `data/student-projects.json`  
**Engine Interface:** `js/credibility-data.js` (`NovaCredibility`)  

---

## 1. Overview & Data Schema

The student project registry centralizes practical capstone projects and curriculum briefs developed within Nova Skills programs. It provides prospective students with tangible, evidence-based previews of what learners actually build.

### JSON Schema

```json
{
  "projectId": "string (unique kebab-case identifier)",
  "status": "published-as-sample | approved | pending-verification | archived",
  "title": "string (production project title)",
  "courseId": "string (canonical course identifier)",
  "courseName": "string (full course name)",
  "academyId": "string (canonical academy identifier)",
  "academyName": "string (full academy name)",
  "category": "string (discipline category)",
  "badge": "string (visual highlight label)",
  "summary": "string (concise 1-line description)",
  "problem": "string (commercial or technical problem solved)",
  "solution": "string (architecture and methodology applied)",
  "deliverables": ["array of specific production assets built"],
  "tools": ["array of software and technologies used"],
  "outcome": "string (measurable learning or portfolio result)",
  "media": {
    "thumbnail": "string (relative path to 640w card webp/png)",
    "mobile": "string (relative path to 400w mobile webp/png)",
    "desktop": "string (relative path to 960w desktop webp/png)"
  },
  "verification": {
    "isRealStudentSubmission": "boolean",
    "displayLabel": "Example Portfolio Project | Verified Student Work",
    "verificationStatus": "curriculum-capstone-spec | student-verified | pending",
    "workAuthenticityVerified": "boolean"
  },
  "permission": {
    "publicationApproved": "boolean",
    "displayAsSampleBrief": "boolean"
  }
}
```

---

## 2. Authenticity Classification

To ensure 100% truth in advertising:
- **Verified Student Work:** Projects submitted by authenticated learners with written publication consent.
- **Example Portfolio Projects:** Professional capstone project specifications, industry briefs, and prototype assets designed by faculty as course deliverables. These are explicitly tagged with `displayLabel: "Example Portfolio Project"` to distinguish curriculum prototypes from individual student submissions.

---

## 3. Initial Portfolio Registry (12 Core Projects)

| Project ID | Title | Academy | Course | Category | Status |
|---|---|---|---|---|---|
| `proj-dm-multichannel-growth` | Multichannel Growth & GA4 Analytics | Digital Marketing | `dm-professional` | Performance Marketing | `published-as-sample` |
| `proj-fs-cloud-saas` | Enterprise Multi-Tenant Cloud SaaS | Programming | `ai-assisted-full-stack-web-development` | Full-Stack Cloud & AI | `published-as-sample` |
| `proj-gd-brand-system` | Complete Commercial Brand System | Design | `graphic-design-pro` | Brand Identity | `published-as-sample` |
| `proj-nc-webflow-directory` | Client-First Directory Architecture | No-Code Web | `nocode-web-pro` | No-Code Web & CMS | `published-as-sample` |
| `proj-dm-paid-ads-funnel` | Omnichannel Paid Acquisition Funnel | Digital Marketing | `performance-marketing-specialist` | Paid Advertising | `published-as-sample` |
| `proj-dm-technical-seo` | Technical SEO & GEO Architecture | Digital Marketing | `seo-geo` | Organic Search & AI | `published-as-sample` |
| `proj-fs-api-multitier` | Multi-Tier RESTful API Architecture | Programming | `rest-apis` | Backend Engineering | `published-as-sample` |
| `proj-fs-responsive-standards` | Design System & Component Library | Programming | `frontend-dev` | Frontend Engineering | `published-as-sample` |
| `proj-gd-packaging-capstone` | Luxury FMCG Packaging & Print Dielines | Design | `creative-design` | Packaging & Print | `published-as-sample` |
| `proj-gd-advertising-kv` | Commercial Advertising Key Visual | Design | `creative-design` | Creative Direction | `published-as-sample` |
| `proj-nc-framer-saas` | High-Converting Framer SaaS Landing Page | No-Code Web | `nocode-web-pro` | Interactive Landing Pages | `published-as-sample` |
| `proj-nc-wordpress-elementor` | Corporate WordPress & Elementor Portal | No-Code Web | `nocode-web-pro` | Corporate Web Dev | `published-as-sample` |

---

## 4. Client-Side API & Component Integration

Exposed through `NovaCredibility` in `js/credibility-data.js`:
- `getProjects(filter)`: Returns filtered projects by `academyId`, `courseId`, or `status`.
- `getProjectById(projectId)`: Returns full project record for modal case studies.
- `openProjectModal(projectId)`: Opens interactive project case study view.
