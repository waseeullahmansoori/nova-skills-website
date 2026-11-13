# Nova Skills — Layer 35: Search Intent Optimization & Cannibalization Audit

**Document ID:** CNT-LAYER-35  
**Focus:** Intent Taxonomy, User Expectation Matching & Zero Cannibalization Governance  
**Status:** Approved & Enforced  
**Branch:** development  

---

## 1. Search Intent Taxonomy Applied to Nova Skills

Every URL in the Nova Skills architecture belongs to one of four strict intent classifications:

| Intent Category | Primary URL Patterns | Content Format Expectations | Conversion KPI |
| :--- | :--- | :--- | :--- |
| **Informational (Know)** | `/blog/*`, Guides, Tutorials | In-depth explanations, code snippets, visual workflow diagrams | Internal link click to related course |
| **Commercial Investigation (Compare)** | `/academies/*`, `/placements`, `/courses` | Curricula grids, skill tracks, prerequisite checklists, faculty credentials | Free Demo booking or Syllabus download |
| **Transactional (Do / Buy)** | `/course-detail.html?id=*`, Demo Modals | Transparent tuition (₹2,900+), module lists, batch dates, enrollment forms | Verified lead submission |
| **Navigational & Geographic (Locate)** | `/contact/`, `/branches/*`, Homepage | Campus address, admissions helpline, live online cohort availability | Phone call or WhatsApp consultation |

---

## 2. Preventing Keyword Cannibalization

Cannibalization occurs when multiple URLs on the same domain compete for identical search queries, diluting PageRank and confusing search algorithms. Nova Skills enforces three non-negotiable architectural boundaries:

1. **Blog vs Course Separation:**
   - A blog article answers questions starting with *How*, *What*, *Why*, and *Compare*.
   - A course page answers questions starting with *Cost of*, *Syllabus for*, *Duration of*, and *Certification in*.
2. **Academy vs Course Detail Separation:**
   - An Academy Hub page introduces the discipline and links downward to courses.
   - An individual Course Detail page focuses strictly on a single specialized credential.
3. **Physical Campus vs 36 Online Cities Separation:**
   - The Siddharth Nagar campus page (`/contact/`) targets local physical classroom queries.
   - The 36 city pages (`/branches/<city>/`) target regional remote-learning queries with explicit live-online disclosures.
