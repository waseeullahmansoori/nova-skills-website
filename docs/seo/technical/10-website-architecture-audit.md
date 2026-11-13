# Nova Skills — Layer 58: Website Architecture & Information Taxonomy Audit

**Document ID:** TECH-LAYER-58  
**Focus:** Information Architecture, Content Siloing, Taxonomy Hierarchy, URL Path Ergonomics & Navigation Usability  
**Status:** Approved & Verified  
**Branch:** development  

---

## 1. Taxonomic Hierarchy & Information Architecture

Nova Skills employs a **semantic hub-and-spoke hierarchical architecture** designed to maximize topical authority clustering and crawler traversal efficiency:

```
Level 0: Homepage (https://novaskills.in/)
│
├── Level 1: Institutional Core & Catalogs
│   ├── /courses (Comprehensive Filterable Catalog)
│   ├── /about (Institutional Profile & Mission)
│   ├── /contact/ (Siddharth Nagar Physical Campus & Helpline)
│   ├── /placements (Hiring Partners & Career Assistance)
│   ├── /verify-certificate (Credential Verification Engine)
│   ├── /branches/ (National Service Areas Directory)
│   └── /blog/ (Topical Authority Knowledge Base)
│
├── Level 1: Academy Pillars (Thematic Category Hubs)
│   ├── /academies/digital-marketing/
│   ├── /academies/artificial-intelligence/
│   ├── /academies/data-analytics/
│   ├── /academies/programming-tech/
│   └── [8 Additional Academy Pillars]
│
├── Level 2: Canonical Course Pages (Educational Leaf Nodes)
│   ├── /course-detail.html?id=dm-pro
│   ├── /course-detail.html?id=ai-prompt-eng
│   └── [107 Additional Canonical Courses]
│
├── Level 2: City Service Area Hubs (Live-Online Training Verticals)
│   ├── /branches/indore/
│   ├── /branches/mumbai/
│   └── [34 Additional City Hubs]
│
└── Level 2: Educational Blog Articles
    ├── /blog/top-digital-marketing-skills-2026/
    └── [Published Editorial Guides]
```

---

## 2. Architectural Design Rules & Content Siloing

1. **Strict Topical Siloing (No Theme Bleed):**
   - Courses within an Academy strictly belong to that Academy's taxonomic cluster.
   - Cross-linking between unrelated academies is prohibited in primary navigation, preserving topical distinctness for search engine entity clustering.
2. **Predictable URL Schemes:**
   - Institutional and academy pages use clean, kebab-case slugs without redundant trailing subfolders.
   - Canonical course pages use the invariant query parameter architecture (`/course-detail.html?id=[id]`).
   - City service areas strictly reside under `/branches/<slug>/`.
3. **Flat Depth Constraint:**
   - 100% of indexable pages reside at depth ≤ 2 from the root homepage, ensuring search crawlers expend minimal crawl budget to reach leaf nodes.

---

## 3. Navigation System Usability & Accessibility

- **Desktop Header Navigation:** Structured mega-menu dropdowns for Academies with explicit semantic HTML `<nav>` and `<ul>/<li>` lists.
- **Mobile Navigation Drawer:** Off-canvas responsive drawer activated by a lightweight hamburger toggle; features keyboard accessibility (`aria-expanded`, focus trapping) and touch target size ≥ 48px.
- **Footer Hierarchy:** 4 distinct columns grouping: (1) About & Institutional Credentials, (2) 12 Academies, (3) City Learning Hubs, (4) Legal, Student Support & Physical Campus Details.
