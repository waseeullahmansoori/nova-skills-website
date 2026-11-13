# Nova Skills — Layer 55: Internal Linking SEO Audit

**Document ID:** TECH-LAYER-55  
**Focus:** Link Architecture, Click Depth, PageRank Distribution, In-Content Anchor Text & Orphan Page Mitigation  
**Status:** Approved & Verified  
**Branch:** development  

---

## 1. Executive Summary

Internal linking is the primary mechanism through which search crawlers discover content, establish thematic relationships, and distribute topical authority (PageRank) across the Nova Skills domain. 

This audit evaluates the internal linking structure across all 175 canonical URLs of Nova Skills:
- **Global Header Navigation:** 6 primary hub links + 12 academy dropdown links.
- **Global Footer Navigation:** 12 academy links, core institutional pages, 3 legal policy pages, physical campus disclosure, and social profiles.
- **Contextual In-Content Linking:** Academy-to-course links, course-to-academy links, related-course link grids, blog-to-course citations, and city-to-academy exploration links.
- **Hierarchical Breadcrumbs:** 100% coverage across course detail, academy, city hub, and blog pages with structured JSON-LD `BreadcrumbList`.
- **Maximum Click Depth:** Restricted to **≤ 3 clicks** from the homepage for every single indexable course and city hub.
- **Orphan Page Status:** **0 orphan pages** identified across all 175 indexable URLs.

---

## 2. Click Depth Distribution

| Click Depth | Page Count | Page Types Included | Discovery Path |
| :--- | :--- | :--- | :--- |
| **Depth 0** | 1 | Homepage (`/`) | Root entry point |
| **Depth 1** | 21 | 12 Academies, `/courses`, `/about`, `/contact/`, `/placements`, `/verify-certificate`, `/blog/`, 3 Legal Pages | Main navigation bar, primary footer columns |
| **Depth 2** | 145 | 109 Canonical Course Pages (`/course-detail.html?id=...`), 36 City Hubs (`/branches/<slug>/`) | Academy Hub -> Course Detail; Directory -> City Hub |
| **Depth 3** | 8 | Individual In-Depth Blog Posts, Deep Paginated Guides | Blog Directory -> Article; City Hub -> Specific Localized Track |

**Key Finding:** 100% of the 109 canonical course pages are accessible within **2 clicks** from the homepage via either the Academy dropdowns in the primary header or the `/courses` catalog filter interface.

---

## 3. Anchor Text Distribution & Best Practices

1. **Descriptive, Subject-Specific Anchors:**
   - Links avoid ambiguous anchors like *"Click Here"*, *"Learn More"*, or *"Read More"*.
   - Instead, all internal anchors incorporate specific educational entities: e.g., *"Explore Full Stack Python Development"*, *"View AI & Prompt Engineering Curriculum"*, *"Admissions for Executive Digital Marketing"*.
2. **Breadcrumb Standardization:**
   - Course detail breadcrumbs follow: `Home > [Academy Name] > [Course Title]`.
   - City hub breadcrumbs follow: `Home > Locations & Service Areas > [City Name] Online Learning`.
3. **Cross-Silo Linking Guardrails:**
   - Academies strictly cross-link to relevant, complementary academies (e.g., *Digital Marketing Academy* links to *Generative AI & Tech Academy* for AI-assisted marketing tools) while avoiding spammy sitewide cross-linking.

---

## 4. Internal Link Equity (PageRank) Preservation

- **NoFollow Usage:** Internal links do not waste internal PageRank on `rel="nofollow"`. All editorial and navigation links are fully followable by Googlebot.
- **Controlled Non-Indexable Exclusions:** Lead conversion destinations (`/thank-you`, `/lead-success`) receive minimal internal link equity and enforce `X-Robots-Tag: noindex, follow` at the edge headers level.
