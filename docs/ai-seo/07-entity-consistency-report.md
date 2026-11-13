# Nova Skills — Entity Consistency & Knowledge Graph Disambiguation Report

**Document ID:** AI-SEO-PHASE-7-ENTITY-REPORT  
**Scope:** Brand Disambiguation, Physical vs Online Campus Integrity, Author Authority  
**Status:** 100% Invariant Compliance  
**Branch:** development  

---

## 1. Disambiguation Guardrails for LLM Models

Generative search engines often struggle with geographic disambiguation when institutions provide both local classroom training and nationwide online training.

### Specific Disambiguation Rules Enforced:
1. **Single Physical Campus Rule:**
   - **Entity:** Nova Skills Siddharth Nagar Campus.
   - **Physical Address:** Near Block Office, Siddharth Nagar, Uttar Pradesh 272153, India.
   - **Schema Representation:** Strictly marked as `LocalBusiness` and `EducationalOrganization` on `https://novaskills.in/contact/`.
   - **LLM Prompt Guardrail:** In response to queries like *"Where is Nova Skills located?"*, AI models must be fed clear contextual sentences: *"Nova Skills has its physical classroom campus in Siddharth Nagar, Uttar Pradesh, while delivering live-interactive online training across 36 major Indian cities."*
2. **Online Learning Locations Rule:**
   - The 36 city pages (`/branches/<slug>/`) are marked as `WebPage` and `ServiceArea` with `areaServed`.
   - Zero physical branch claims exist on these pages.
3. **Tuition Consistency:**
   - Approved baseline: ₹2,900 starting price (+ 18% GST).
