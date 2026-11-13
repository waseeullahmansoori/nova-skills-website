# Nova Skills — Layer 34: Content Refresh & Decay Management Strategy

**Document ID:** CNT-LAYER-34  
**Focus:** Continuous Content Accuracy, Tech Stack Currency & Stale Content Prevention  
**Status:** Approved & Enforced  
**Branch:** development  

---

## 1. Principles of Content Freshness

In technology and vocational education, content decays rapidly as software tools, operating systems, and industry standards evolve. Nova Skills enforces a proactive **Content Refresh Protocol**:

1. **Editorial Integrity Over Artificial Dates:**
   - Publication dates and `dateModified` schema attributes are updated **only** when substantial technical revisions, curriculum refreshes, or factual corrections occur.
   - Changing dates on unedited articles is strictly prohibited as a manipulative practice under Google Search Essentials.
2. **Scheduled Audit Cycles:**
   - **Quarterly Technical Review:** Software versions, tool interfaces, and API standards (e.g. n8n releases, Claude/ChatGPT model updates, Figma features) are reviewed every 90 days.
   - **Semi-Annual Pricing & Regulatory Check:** Tuition rates, GST compliance (18%), and placement eligibility conditions are reconciled with admissions management.
   - **Annual Catalog Realignment:** Course offerings are reviewed against live job market demand in India.

---

## 2. Content Decay Identification Triggers

Content is marked for mandatory refresh when any of the following triggers occur:
- **Deprecated Software / UI:** Screenshots or tutorials reference software versions over 12 months out of date.
- **Search Intent Drift:** Queries driving traffic to a page show learners expect newer technologies (e.g. transition from Universal Analytics to GA4, or GPT-3 to GPT-4o).
- **Broken Outbound References:** Citations or tool URLs return 404 or point to discontinued services.
- **Cannibalization:** A newer blog article begins splitting organic impressions with an established academy or course page.

---

## 3. Refresh Execution Playbook

When refreshing a page:
1. Retain existing canonical URLs to preserve accumulated backlink authority.
2. Add genuine new value (updated workflows, modern code snippets, fresh project briefs).
3. Update metadata and JSON-LD structured data to reflect the enhanced content.
4. Execute full automated regression validation (`npm run validate:courses`, `npm run validate:seo`).
