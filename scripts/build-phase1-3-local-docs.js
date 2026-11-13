/**
 * scripts/build-phase1-3-local-docs.js
 * Generates Phase 1, 2, and 3 Local & Geographic SEO Deliverables:
 *  1. docs/seo/local/21-local-seo-strategy.md (Layer 21: Local SEO)
 *  2. docs/seo/local/22-hyperlocal-opportunity-report.md (Layer 22: Hyperlocal SEO)
 *  3. docs/seo/local/23-geographic-keyword-map.csv (Layer 23: Geo SEO Keyword Map)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LOCAL_SEO_DIR = path.join(ROOT_DIR, 'docs', 'seo', 'local');
const locations = require(path.join(ROOT_DIR, 'data', 'locations', 'locations.json'));

// ============================================================================
// 1. GENERATE docs/seo/local/21-local-seo-strategy.md
// ============================================================================
const localSeoStrategyMd = `# NOVA SKILLS — LOCAL SEARCH VISIBILITY STRATEGY (LAYER 21)

**Document ID:** NOVA-LOCAL-SEO-LAYER21-STRATEGY  
**Primary Focus:** Dual-Intent Local Search Architecture (Campus In-Person vs. Nationwide Live-Online)  
**Date:** November 2026  
**Auditor:** Nova Skills Local SEO & Strategic Search Team

---

## 1. STRATEGIC PURPOSE & DUAL-INTENT FRAMEWORK

Local SEO at Nova Skills must address two distinct consumer search intents without creating confusion or algorithmic penalties:

\`\`\`mermaid
flowchart TD
    Searcher[Prospective Student Search] --> IntentCheck{Search Intent Classification}
    
    IntentCheck -->|Physical In-Person Intent| Campus[Group A: Physical Campus Intent]
    Campus --> TargetA[Siddharth Nagar & District Catchment Area]
    TargetA --> ServicesA[Classroom batches, lab access, walk-in career desk]
    TargetA --> PageA[contact/index.html & index.html Campus Section]
    TargetA --> GBP[Google Business Profile & Google Maps Pin]
    
    IntentCheck -->|Online Learning Intent| Online[Group B: Geographic Online Intent]
    Online --> TargetB[36 Target Cities across 14 States/UTs]
    TargetB --> ServicesB[Live interactive 2-way online batches, 1-on-1 reviews]
    TargetB --> PageB[branches/{city}/ City Landing Hubs]
    TargetB --> SchemaB[schema.org/ItemList & schema.org/WebPage strictly]
\`\`\`

---

## 2. KEYWORD TAXONOMY: GROUP A (CAMPUS) VS. GROUP B (ONLINE)

### Group A: Physical Campus Intent (Siddharth Nagar Catchment)
These queries represent students seeking an actual physical institute, computer lab, or face-to-face mentorship within Siddharth Nagar and neighboring towns:

| Priority Query | Target Audience | Search Intent | Target URL | Primary Conversion Goal |
| :--- | :--- | :--- | :--- | :--- |
| \`nova skills siddharth nagar\` | Branded local seekers | Navigational / Campus info | \`https://novaskills.in/contact/\` | Campus Visit / Phone Call |
| \`computer institute in siddharth nagar\` | Students seeking tech skills | Transactional / Classroom | \`https://novaskills.in/contact/\` | Walk-in Counselling Desk |
| \`digital marketing course siddharth nagar\` | Career switchers & marketers | Commercial / Classroom | \`https://novaskills.in/academies/digital-marketing/\` | Free Demo Booking |
| \`graphic design training institute siddharth nagar\` | Creative learners & designers | Commercial / Lab training | \`https://novaskills.in/academies/design/\` | Lab Tour / Counselling |
| \`ai course in siddharth nagar\` | Early tech adopters | Commercial / Modern skills | \`https://novaskills.in/academies/ai/\` | Free Demo Booking |
| \`web development coaching near me siddharth nagar\` | College coders & engineers | Transactional / Classroom | \`https://novaskills.in/academies/programming/\` | Syllabus Download / Demo |

### Group B: Online-Learning Geographic Intent (36 Target Cities)
These queries represent learners in target Indian cities searching for high-quality online courses while specifying their city:

| Priority Query Pattern | Example Target Query | Search Intent | Target URL | Primary Conversion Goal |
| :--- | :--- | :--- | :--- | :--- |
| \`online digital marketing course in [City]\` | \`online digital marketing course in indore\` | Commercial / Live-Online | \`https://novaskills.in/branches/indore/\` | Free Demo Registration |
| \`live graphic design classes in [City]\` | \`live graphic design classes in lucknow\` | Commercial / Live-Online | \`https://novaskills.in/branches/lucknow/\` | Free Consultation Call |
| \`full stack developer course online in [City]\` | \`full stack developer course online in jaipur\` | Transactional / Live-Online | \`https://novaskills.in/branches/jaipur/\` | Curriculum Inspection |
| \`ai automation course online in [City]\` | \`ai automation course online in nagpur\` | Informational / Commercial | \`https://novaskills.in/branches/nagpur/\` | Free Demo Registration |
| \`video editing training online in [City]\` | \`video editing training online in patna\` | Commercial / Live-Online | \`https://novaskills.in/branches/patna/\` | Free Consultation Call |

---

## 3. PHYSICAL CAMPUS LANDING PAGE ENHANCEMENT

The primary local landing page is \`https://novaskills.in/contact/\`. To maximize local search visibility and map pack rankings, the following enhancements are specified:
1. **Prominent Campus Identity:** Highlighting the physical facilities: high-spec multimedia computer labs, audio/video editing studio suites, and walk-in career counselling desk.
2. **Standardized NAP Display:**
   - **Name:** Nova Skills Education Institute
   - **Address:** Nova Skills Institute Campus, Siddharth Nagar, Uttar Pradesh - 272153, India
   - **Helpline:** +91 9695904440
   - **Hours:** Monday – Saturday: 9:00 AM – 7:00 PM IST (Sunday Closed)
3. **Structured Data Implementation:** Injecting complete \`LocalBusiness\` and \`EducationalOrganization\` schema with \`geo\` coordinates (\`27.2713° N, 83.0722° E\`) and \`hasMap\` link.

---

## 4. LOCAL CITATION & NAP INTEGRITY STANDARDS

To reinforce local search authority, Nova Skills adheres to a strict single-record NAP policy:
- **Zero Inconsistent Variations:** The address format \`Nova Skills Institute Campus, Siddharth Nagar, Uttar Pradesh - 272153\` must be uniformly maintained across all verified directories and profiles.
- **Selective High-Quality Directories Only:** Citations are limited to recognized educational portals (e.g., Shiksha, Sulekha Education, IndiaMART Education, Justdial Education, Google Business Profile).
- **Prohibition on Automated Directory Blasters:** Mass submissions to low-tier citation farms are strictly prohibited.
`;

fs.writeFileSync(path.join(LOCAL_SEO_DIR, '21-local-seo-strategy.md'), localSeoStrategyMd);
console.log('Generated 21-local-seo-strategy.md.');

// ============================================================================
// 2. GENERATE docs/seo/local/22-hyperlocal-opportunity-report.md
// ============================================================================
const hyperlocalReportMd = `# NOVA SKILLS — HYPERLOCAL OPPORTUNITY & CATCHMENT AUDIT (LAYER 22)

**Document ID:** NOVA-HYPERLOCAL-SEO-LAYER22-REPORT  
**Catchment Area:** Siddharth Nagar District, Bansi, Naugarh, Shohratgarh, Domariyaganj, and Adjacent Border Zones  
**Date:** November 2026  
**Auditor:** Nova Skills Hyperlocal Search Intelligence Team

---

## 1. PURPOSE & BOUNDARY RULES

Hyperlocal SEO optimizes search visibility for specific neighborhoods, transit hubs, and municipal zones surrounding an actual operating physical business.

### Critical Operational Boundary:
> **Rule:** Hyperlocal SEO applies **EXCLUSIVELY** to the genuine physical campus in Siddharth Nagar and its verifiable daily commuting catchment area. It is **STRICTLY PROHIBITED** from being applied to create fake neighborhood pages in the 36 online-learning cities (e.g. creating fake "Nova Skills Campus in Vijay Nagar, Indore" or "Gomti Nagar, Lucknow").

---

## 2. SIDDHARTH NAGAR CATCHMENT LOCALITIES & TRANSIT ACCESS

\`\`\`mermaid
flowchart TD
    Campus[Nova Skills Campus: Siddharth Nagar Headquarters]
    
    Campus --- Loc1[Naugarh / Siddharthnagar Municipal Area - 0-3 km]
    Campus --- Loc2[Tetari Bazar Commercial Zone - 1-4 km]
    Campus --- Loc3[Uska Bazar Block - 12-15 km]
    Campus --- Loc4[Birdpur Educational Corridor - 14-18 km]
    Campus --- Loc5[Bansi Tehsil & Market - 28-32 km]
    Campus --- Loc6[Shohratgarh Border Town - 22-26 km]
    Campus --- Loc7[Itwa / Domariyaganj Catchment - 40-50 km]
    
    Campus --- Rail[Transit: Siddharthnagar Railway Station - 2.5 km]
    Campus --- Road[Transit: State Highway 81 / Bansi Road Access]
\`\`\`

### Catchment Locality Inventory:
| Locality / Zone | Geographic Type | Distance from Campus | Target Learner Profile | Commute Method |
| :--- | :--- | :---: | :--- | :--- |
| **Naugarh (Siddharth Nagar)** | District Administrative HQ | 0 – 3 km | College students, school leavers, job seekers | Walking, E-Rickshaw, 2-Wheeler |
| **Tetari Bazar** | Major Commercial Hub | 1 – 4 km | Business owners, retail staff, youth | E-Rickshaw, Auto, 2-Wheeler |
| **Uska Bazar** | Market Town / Railway node | 12 – 15 km | Polytechnic students, graduates | Train, Local Bus, 2-Wheeler |
| **Birdpur** | Educational & Rural Cluster | 14 – 18 km | Rural youth, high school graduates | State Bus, Auto |
| **Shohratgarh** | Municipal Town & Rail Station | 22 – 26 km | Career pivoters, diploma holders | Intercity Train, Bus |
| **Bansi** | Historic Tehsil & River Hub | 28 – 32 km | Higher secondary & college students | Regular Bus Service, Shared Auto |
| **Domariyaganj / Itwa** | Western District Catchment | 40 – 55 km | Professional certification seekers | Express Bus, Weekend Cohorts |

---

## 3. HYPERLOCAL SEARCH INTENT & QUERIES

Legitimate search terms exhibiting proven geographic intent in the catchment:
1. \`computer training center in naugarh\`
2. \`computer institute tetari bazar siddharth nagar\`
3. \`graphic design classes near bansi siddharth nagar\`
4. \`tally and accounting coaching shohratgarh\`
5. \`digital marketing training near me siddharth nagar\`
6. \`best computer center near siddharthnagar railway station\`

---

## 4. HYPERLOCAL ARCHITECTURAL DECISION MATRIX

To prevent thin-content doorway page penalties, Nova Skills enforces a strict classification model:

| Proposed Geographic Unit | Strategic Classification | Recommended Action | Technical Justification |
| :--- | :--- | :--- | :--- |
| **Siddharth Nagar / Naugarh** | Core Campus Hub | **Improve Existing Campus Page** | \`contact/index.html\` serves as the primary indexed hub for the district; enrich with transit & directions. |
| **Tetari Bazar** | Commercial Sub-locality | **Consolidate into Campus Hub** | Located within 2–4 km; separate landing page would create keyword cannibalization and thin content. |
| **Bansi / Shohratgarh / Uska Bazar** | Catchment Towns | **Consolidate with Transit Directions** | Documented on \`contact/index.html\` under "How to Reach Campus" and regional transport FAQ. |
| **Neighbourhoods in 36 Online Cities** | Non-Campus Service Areas | **DO NOT CREATE (STRICT)** | Zero physical presence; creating neighborhood pages in Indore or Jaipur violates Google Spam Policies. |

### Conclusion:
Consolidate all catchment transit directions and regional locality guidance directly onto the enriched \`contact/index.html\` page and the verified Google Business Profile. Do not create thin doorway pages.
`;

fs.writeFileSync(path.join(LOCAL_SEO_DIR, '22-hyperlocal-opportunity-report.md'), hyperlocalReportMd);
console.log('Generated 22-hyperlocal-opportunity-report.md.');

// ============================================================================
// 3. GENERATE docs/seo/local/23-geographic-keyword-map.csv
// ============================================================================
const geoKeywordHeader = [
  'Keyword ID',
  'Country',
  'State/UT',
  'City',
  'Area/Catchment',
  'Target Query',
  'Search Intent',
  'Course / Academy Focus',
  'Delivery Type',
  'Physical Presence Status',
  'Target URL',
  'Search Demand',
  'Priority',
  'Business Relevance',
  'Content Gap',
  'Approval Status'
].join(',');

const geoKeywordRows = [geoKeywordHeader];
let kwId = 1;

// 1. Campus Physical Keywords (Group A)
const campusQueries = [
  { q: 'nova skills siddharth nagar', intent: 'Navigational', academy: 'Brand / Campus', delivery: 'Classroom & Online', p: 'P0', gap: 'NAP Reinforcement' },
  { q: 'computer institute in siddharth nagar', intent: 'Commercial / Transactional', academy: 'Office Productivity / Programming', delivery: 'Classroom', p: 'P1', gap: 'Campus Facilities Content' },
  { q: 'digital marketing course in siddharth nagar', intent: 'Commercial', academy: 'Digital Marketing Academy', delivery: 'Classroom', p: 'P1', gap: 'Course Page Link' },
  { q: 'graphic design training in siddharth nagar', intent: 'Commercial', academy: 'Design Academy', delivery: 'Classroom', p: 'P1', gap: 'Lab Equipment Highlight' },
  { q: 'ai training center siddharth nagar', intent: 'Informational / Commercial', academy: 'AI Academy', delivery: 'Classroom', p: 'P1', gap: 'Modern Syllabus Proof' },
  { q: 'computer classes in naugarh', intent: 'Commercial', academy: 'Office Productivity', delivery: 'Classroom', p: 'P2', gap: 'Transit Direction Section' },
  { q: 'video editing institute near bansi', intent: 'Commercial', academy: 'Video & Motion Academy', delivery: 'Classroom', p: 'P2', gap: 'Studio Facilities Section' },
  { q: 'best it training institute in siddharth nagar', intent: 'Commercial', academy: 'Institution Wide', delivery: 'Classroom', p: 'P1', gap: 'Accreditation & Mentors' }
];

campusQueries.forEach(cq => {
  geoKeywordRows.push([
    `GEO-KW-${String(kwId++).padStart(3, '0')}`,
    'India',
    'Uttar Pradesh',
    'Siddharth Nagar',
    'District Catchment',
    `"${cq.q}"`,
    `"${cq.intent}"`,
    `"${cq.academy}"`,
    `"${cq.delivery}"`,
    'YES - Physical Campus',
    'https://novaskills.in/contact/',
    'High Local Intent',
    cq.p,
    'Core Headquarters Revenue',
    `"${cq.gap}"`,
    'APPROVED'
  ].join(','));
});

// 2. 36 Online Learning Cities Keywords (Group B)
locations.forEach(loc => {
  // Query 1: Digital Marketing
  geoKeywordRows.push([
    `GEO-KW-${String(kwId++).padStart(3, '0')}`,
    'India',
    `"${loc.state}"`,
    `"${loc.city}"`,
    'Metropolitan Area',
    `"online digital marketing course in ${loc.city.toLowerCase()}"`,
    'Commercial / Live-Online',
    'Digital Marketing Academy',
    'Live Interactive Online',
    'NO - Live Online Service Area',
    loc.canonicalUrl,
    'Medium-High Online Demand',
    loc.priority,
    'High Enrolment Potential',
    'City Curriculum Specifics',
    'APPROVED'
  ].join(','));

  // Query 2: Graphic Design / Creative
  geoKeywordRows.push([
    `GEO-KW-${String(kwId++).padStart(3, '0')}`,
    'India',
    `"${loc.state}"`,
    `"${loc.city}"`,
    'Metropolitan Area',
    `"live graphic design classes in ${loc.city.toLowerCase()}"`,
    'Commercial / Live-Online',
    'Design Academy',
    'Live Interactive Online',
    'NO - Live Online Service Area',
    loc.canonicalUrl,
    'Medium Online Demand',
    loc.priority,
    'High Enrolment Potential',
    'Portfolio Showcase Integration',
    'APPROVED'
  ].join(','));

  // Query 3: Programming / Full Stack
  geoKeywordRows.push([
    `GEO-KW-${String(kwId++).padStart(3, '0')}`,
    'India',
    `"${loc.state}"`,
    `"${loc.city}"`,
    'Metropolitan Area',
    `"full stack web development course online ${loc.city.toLowerCase()}"`,
    'Transactional / Live-Online',
    'Programming Academy',
    'Live Interactive Online',
    'NO - Live Online Service Area',
    loc.canonicalUrl,
    'High Online Demand',
    loc.priority,
    'Core Flagship Program',
    'Live Code Review Highlights',
    'APPROVED'
  ].join(','));

  // Query 4: AI & Automation
  geoKeywordRows.push([
    `GEO-KW-${String(kwId++).padStart(3, '0')}`,
    'India',
    `"${loc.state}"`,
    `"${loc.city}"`,
    'Metropolitan Area',
    `"ai automation certification online ${loc.city.toLowerCase()}"`,
    'Commercial / Live-Online',
    'AI Academy',
    'Live Interactive Online',
    'NO - Live Online Service Area',
    loc.canonicalUrl,
    'Emerging High-Growth Intent',
    loc.priority,
    'Strategic Growth Program',
    'Agentic Workflow Demo Details',
    'APPROVED'
  ].join(','));
});

fs.writeFileSync(path.join(LOCAL_SEO_DIR, '23-geographic-keyword-map.csv'), geoKeywordRows.join('\n'));
console.log(`Generated 23-geographic-keyword-map.csv (${geoKeywordRows.length - 1} mapped geo-keywords).`);
console.log('🎉 Phase 1, 2, and 3 Local & Geographic SEO Deliverables Complete!');
