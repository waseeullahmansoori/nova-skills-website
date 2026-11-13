# Nova Skills — Layer 38: Knowledge Graph SEO Strategy

**Document ID:** CNT-LAYER-38  
**Focus:** Entity Relationships, Semantic Web Triples & Knowledge Graph Grounding  
**Status:** Approved & Enforced  
**Branch:** development  

---

## 1. Principles of Educational Knowledge Graph SEO

Modern search engines build semantic knowledge graphs representing real-world entities and the relationships between them. For an edtech institution, search engines map:
- **Who is the entity?** Nova Skills (EducationalOrganization & LocalBusiness).
- **Where is it physically based?** Siddharth Nagar, Uttar Pradesh - 272153.
- **What does it teach?** 12 specific academies covering 109 technical courses.
- **Who teaches it?** Verified faculty mentors and curriculum leadership.
- **What tools are taught?** Industry software (Figma, Python, n8n, Premiere Pro).

---

## 2. Structured Data Triples & Schema Graph Architecture

Nova Skills embeds connected JSON-LD graphs linking:
```
EducationalOrganization (#organization)
   ├── hasOfferCatalog (#catalog)
   │     └── offers -> Course (#course)
   │           ├── provider -> #organization
   │           ├── isPartOf -> Academy (#academy)
   │           └── teaches -> Competency / Tool
   └── location -> PostalAddress (Siddharth Nagar)
```

By maintaining consistent, interconnected schema graphs, Nova Skills facilitates accurate indexing in Google Knowledge Panels, Bing entity indexes, and AI search citation pipelines.
