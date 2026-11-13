# Nova Skills — Layer 28: Location-Based Content SEO Strategy

**Document ID:** LOC-LAYER-28  
**Scope:** 36 City Hub Pages across 14 States & Union Territories  
**Physical Anchor:** Nova Skills Institute Campus, Siddharth Nagar, Uttar Pradesh - 272153  
**Status:** Approved & Governance Ready  
**Branch:** development  

---

## 1. Executive Summary & Strategic Rationale

Nova Skills delivers industry-aligned vocational and professional upskilling across India. While physical classroom cohorts are exclusively hosted at the **Siddharth Nagar Campus**, students from tier-1, tier-2, and tier-3 cities across 14 states access interactive, live online instructor-led courses.

Layer 28 (Location-Based Content SEO) optimizes the discovery of these learning hubs without violating Google Search Essentials or engaging in doorway page manipulation. Each city page addresses genuine regional learner demand, provides specific curriculum pathways, and explicitly clarifies the interactive online delivery model.

---

## 2. Content Differentiation & Value Framework

To guarantee high information gain and avoid duplicate doorway page penalties, each city page implements five core content pillars:

1. **Regional Employment & Skill Dynamics:**
   - Highlights local career pathways (e.g. IT services in Indore/Bhopal, digital commerce in Surat/Rajkot, administrative readiness in Lucknow/Dehradun).
   - Demonstrates how practical skill training bridges the gap between academic degrees and industry requirements.

2. **Course Portfolio & Curriculum Pathways:**
   - Features structured links to the 109 courses across 12 academies.
   - Highlights in-demand competencies: Full Stack Web Development, Python Programming, Digital Marketing, AI Automation, Graphic Design, and Spoken English.

3. **Live Interactive Pedagogy vs Recorded Videos:**
   - Clearly contrasts live mentor-led sessions with static recorded platforms.
   - Details real-time doubt clearing, live code reviews, and structured capstone projects.

4. **Transparent Campus & Delivery Model Disclosure:**
   - Explicitly displays the primary campus identity:
     > *"Interactive Live-Online Training across [City Name] with physical campus operations headquartered at Nova Skills Institute Campus, Siddharth Nagar, UP - 272153."*
   - Strictly prohibits representing remote study areas as unstaffed physical branches.

5. **Direct Student Guidance & Admissions Assistance:**
   - WhatsApp counselling line: `+91 9695904440`.
   - Direct link to official campus contact and fee transparency details (starting at ₹2,900 + 18% GST).

---

## 3. Structural & Semantic Blueprint (Per City Page)

Each city page adheres to the following HTML and semantic structure:

```
├── <head>
│   ├── <title>Live Online Professional Courses in [City] | Nova Skills</title>
│   ├── <meta name="description" content="[Unique regional career proposition]..." />
│   ├── <link rel="canonical" href="https://novaskills.in/branches/[slug]/" />
│   └── <script type="application/ld+json"> (WebPage, BreadcrumbList, ItemList)
├── <header> (Global navigation with phone & WhatsApp CTAs)
├── <main>
│   ├── Hero Section (Regional headline + transparent delivery model tag)
│   ├── Campus Transparency Banner (Siddharth Nagar physical base disclosure)
│   ├── Key Skill Tracks & Academies (Curriculum cards with deep links)
│   ├── Interactive Live Class Benefits (Pedagogy, mentors, career readiness)
│   ├── Student Verification & Trust (Verification portal, transparent fees)
│   ├── Regional FAQ Section (Accordion addressing local queries)
│   └── Direct Enrolment CTA (WhatsApp & Phone consultation)
└── <footer> (Universal NAP, legal disclosures, directory links)
```

---

## 4. Schema & Knowledge Graph Integrity

- **Allowed Schemas:**
  - `WebPage` with `about` pointing to `{"@type": "City", "name": "[City Name]"}`.
  - `BreadcrumbList` establishing hierarchy: Home -> Learning Locations -> [City Name].
  - `ItemList` enumerating published professional skill programs.
- **Strictly Prohibited Schemas:**
  - `LocalBusiness` on city hub pages (strictly reserved for `/contact/` and campus pages).
  - Fake physical `PostalAddress` or fake geographic coordinates for virtual/online cities.

---

## 5. Audit Summary of 36 City Hubs

- **Total Inspected Pages:** 36 / 36
- **Physical Campus Disclosures:** 36 / 36 (100% compliant)
- **LocalBusiness Schema Violations:** 0 / 36 (100% compliant - 0 violations)
- **Canonical Self-References:** 36 / 36 (100% accurate)
- **Status Verdict:** 36 / 36 Release-Ready
