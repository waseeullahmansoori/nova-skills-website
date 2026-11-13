# Nova Skills — Layer 30: Topic Cluster Architecture

**Document ID:** CNT-LAYER-30  
**Focus:** Spoke-and-Hub Link Topology, Semantic Content Organization & Discovery  
**Status:** Approved & Enforced  
**Branch:** development  

---

## 1. Topic Cluster Design Principles

Topic clusters organize related educational content into structured semantic networks. Instead of treating each page as an isolated ranking attempt, clusters establish a hierarchical and peer-to-peer linking relationship:

```
       ┌──────────────────────────────────────────────┐
       │             MAIN PILLAR / ACADEMY HUB        │
       │       https://novaskills.in/academies/[slug]/ │
       └──────────────────────┬───────────────────────┘
                              │
         ▲                    │                     ▲
         │                    ▼                     │
┌────────┴───────────┐ ┌───────────────┐ ┌──────────┴───────────┐
│  SUPPORTING BLOG   │ │ COMMERCIAL    │ │  PRACTICAL TUTORIAL   │
│  & CAREER GUIDES   │ │ COURSE DETAIL │ │  & CAPSTONE BRIEF     │
│  (Informational)   │ │ (Transactional)│ │  (E-E-A-T Demonstration)│
└────────────────────┘ └───────────────┘ └───────────────────────┘
```

---

## 2. Cluster Architecture Components

Every topic cluster across the 12 academies consists of five interconnected tiers:

1. **The Topic Pillar (Academy Hub):**
   - Serves as the canonical overview for the domain (e.g. `/academies/digital-marketing/`, `/academies/ai/`, `/academies/programming/`).
   - Explains what the industry requires, key technologies, learning curves, and available certification tracks.
2. **Commercial Course Detail Pages (The Transactional Core):**
   - 109 individual course pages (`/course-detail.html?id=[id]`).
   - Clear syllabus, prerequisites, project specifications, fee schedules (₹2,900+ base), and 2-Day Free Demo booking.
3. **Supporting Informational Guides:**
   - Articles addressing long-tail informational questions (e.g. AI SEO architecture, n8n webhook setup, future high-income career roadmaps).
4. **Practical Capstone Project Showcases:**
   - Real student portfolio case studies detailing problems solved, tools used, and deliverables built.
5. **Career & Placement Outcome Resources:**
   - Transparent placement assistance guidelines, eligibility rules, and interview preparation resources.

---

## 3. Internal Linking Rules & Guardrails

- **Upward Links:** Every supporting blog post and practical guide must link back to its parent Academy Hub using descriptive anchor text (e.g., *"Explore the Nova Skills AI Academy curriculum"*).
- **Sideward Links:** Related courses within the same academy link to each other as prerequisite or follow-up recommendations (e.g., *Python Foundation* linking to *Python Developer Professional*).
- **Downward Links:** Academy Hubs link to every course in their curriculum grid and to relevant foundational blog guides.
- **Strictly Prohibited:** Forced exact-match keyword stuffing in body text; cross-linking unrelated academies (e.g., Kids Tech Scratch programming linking to corporate Tally GST accounting).
