const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LOCAL_SEO_DIR = path.join(ROOT_DIR, 'docs', 'seo', 'local');

const planMd = `# Nova Skills — Layer 29: Local Citation & Reputation Management Plan

**Document ID:** LOC-LAYER-29  
**Focus:** Local Off-Page Authority, High-Trust Citations & Ethical Student Review Governance  
**Campus Base:** Siddharth Nagar, Uttar Pradesh - 272153  
**Status:** Approved & Ready for Operations  
**Branch:** development  

---

## 1. Objective & Governance Mandate

Off-page local authority is anchored in **trust, verification, and authenticity**. As an edtech institution with a physical campus in Siddharth Nagar and nationwide online students across 36 cities, Nova Skills maintains a zero-tolerance policy against deceptive citation schemes, virtual office registrations, and fabricated reviews.

All off-page presence must reinforce a single, unified entity representation in the Google Knowledge Graph and educational indexes.

---

## 2. Master NAP Baseline (Canonical Identity)

To prevent citation fragmentation and knowledge graph entity splitting, all external directory entries must precisely duplicate these attributes:

| Entity Attribute | Canonical Specification | Permitted Minor Variation |
| :--- | :--- | :--- |
| **Legal / Brand Name** | Nova Skills | Nova Skills Institute |
| **Physical Campus Address** | Nova Skills Institute Campus, Siddharth Nagar, Uttar Pradesh - 272153, India | Siddharth Nagar, UP 272153 |
| **Primary Phone Number** | +91 9695904440 | 096959 04440 |
| **Helpline / WhatsApp** | +91 9695904440 | +91-9695904440 |
| **Primary Canonical URL** | https://novaskills.in/ | https://novaskills.in |
| **Official Email** | info@novaskills.in | admissions@novaskills.in |
| **Primary Category** | Educational Institution / Vocational Training Center | Computer Training Institute |
| **Coordinates** | 27.2713° N, 83.0722° E | 27.2713, 83.0722 |

---

## 3. High-Authority Directory Roster (Priority Tiers)

External citations are grouped into verified educational and local directories:

### Tier 1: Search Engine Core Ecosystem
1. **Google Business Profile (GBP):**
   - Verified profile at Siddharth Nagar campus.
   - Primary category: *Vocational Training School* / *Educational Institution*.
   - Service area added: 36 target cities (designated as service areas, NOT physical branches).
2. **Bing Places for Business:**
   - Synced with verified GBP profile to power Microsoft Copilot and Bing Search local packs.
3. **Apple Business Connect (Apple Maps):**
   - Direct registration for iOS Spotlight and Siri location intelligence.

### Tier 2: Major Indian Education & Vocational Portals
1. **Shiksha.com:** Profile under Computer Science, IT & Vocational Training in Uttar Pradesh.
2. **Sulekha:** Verified listing under Computer Training Institutes (Siddharth Nagar & Purvanchal).
3. **Justdial:** Verified single-campus listing with verified telephone number.
4. **IndiaMART:** Verified business profile for corporate & professional upskilling.
5. **CollegeDunia / Careers360:** Directory references for vocational and skill certifications.

---

## 4. Prohibited Tactics & Non-Compliance Penalties

The following tactics are strictly banned across all Nova Skills marketing operations:

- **NO Virtual Offices or Fake Addresses:** Never register addresses in Indore, Lucknow, Jaipur, etc., using shared mailboxes or co-working addresses.
- **NO Multiple GBP Profiles for Remote Cities:** Google strictly terminates accounts creating fake GBP profiles without physical staff.
- **NO Automated Citation Blasting:** Reject third-party automated tools (Fiverr gigs, automated link generators) that distribute NAP across link farms and low-quality scraper sites.
- **NO Incentivized or Fabricated Reviews:** Bribing students, offering discounts in exchange for 5-star ratings, or writing fake testimonials is illegal under ASCI (Advertising Standards Council of India) and violates Google review policies.

---

## 5. Ethical Student Review Generation Framework

Student reviews are a critical ranking factor for Google Maps and local 3-pack prominence. Nova Skills follows a structured, transparent post-course feedback process:

### Step 1: Milestone-Based Feedback Timing
- **Mid-course survey (Internal):** Sent at 50% completion to resolve learning hurdles or mentor mismatches privately.
- **Capstone / Certificate completion:** Official invitation sent 48 hours after successful capstone project verification and certificate issuance.

### Step 2: Direct GBP Short-URL Deployment
- Use the verified short-link: \`https://g.page/r/[CID_SHORT_URL]/review\` in graduation communications.

### Step 3: Transparent WhatsApp Outreach Script
\`\`\`text
Dear [Student Name],

Congratulations on successfully graduating from the [Course Name] program at Nova Skills!

Your mentor team is proud of your portfolio work. If you found our live training, mentorship, and project support valuable, could you take 60 seconds to share your authentic experience on our official Google Campus profile?

Review Link: https://g.page/r/[CID_SHORT_URL]/review

Your feedback helps fellow learners make informed decisions about their career upskilling.

Warm regards,
Admissions & Student Success Team
Nova Skills Campus, Siddharth Nagar
\`\`\`

### Step 4: Negative / Constructive Review SLA
- **Response SLA:** Within 24 business hours.
- **Protocol:**
  1. Acknowledge the student's specific feedback empathetically.
  2. Avoid defensive arguments or disclosing private enrollment information.
  3. Provide direct campus leadership escalation: \`support@novaskills.in\` or \`+91 9695904440\`.
  4. Work offline to rectify grievances (e.g. additional doubt clearing sessions, batch flexibility).

---

## 6. Audit & Citation Maintenance Cadence

- **Quarterly NAP Audit:** Check top 20 directory profiles for accidental changes, phone number mismatches, or duplicate submissions.
- **Monthly Review Sentiment Analysis:** Monitor review themes to improve curriculum, mentor responsiveness, and platform reliability.
`;

fs.writeFileSync(path.join(LOCAL_SEO_DIR, '29-local-citation-and-reputation-plan.md'), planMd, 'utf8');
console.log('Generated 29-local-citation-and-reputation-plan.md');
console.log('🎉 Phase 9 Deliverable Complete!');
