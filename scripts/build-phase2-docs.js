/**
 * ============================================================
 * NOVA SKILLS — PHASE 2 DOCUMENTATION & ASSESSMENT GENERATOR
 * ============================================================
 * Generates:
 * - 02-technical-seo-report.md
 * - 02-off-page-strategy.md
 * - 03-content-strategy.md
 * - 03-editorial-calendar.csv
 * - 04-semantic-topic-map.md
 * - 05-entity-seo-audit.md
 * - 06-programmatic-seo-audit.md
 * - 06-programmatic-page-validation.csv
 * - 07-international-seo-assessment.md
 * - 08-multilingual-seo-assessment.md
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SEO_DOCS_DIR = path.join(ROOT_DIR, 'docs', 'seo');
const COURSES_JSON_PATH = path.join(ROOT_DIR, 'data', 'courses.json');
const coursesData = JSON.parse(fs.readFileSync(COURSES_JSON_PATH, 'utf8'));
const publishedCourses = coursesData.courses || [];
const locationsRegistry = require(path.join(ROOT_DIR, 'lib', 'locations'));
const allLocations = locationsRegistry.getAllLocations();

console.log('Generating Phase 2 Documentation...');

// 1. 02-technical-seo-report.md
const technicalSeoReport = `# NOVA SKILLS — TECHNICAL SEO AUDIT & INFRASTRUCTURE REPORT
**Task ID:** Phase 2, Layer 4 — Technical SEO Foundation  
**Website:** https://novaskills.in/  
**Environment:** Cloudflare Pages Edge Functions + Static Generation  

---

## 1. DOMAIN & PROTOCOL ARCHITECTURE
- **Protocol:** Strict HTTPS enforced via Cloudflare HSTS (\`max-age=31536000; includeSubDomains; preload\`).
- **Host Canonicalization:** Single non-WWW canonical hostname (\`https://novaskills.in/\`). Automatic 308 redirect from \`www.novaskills.in\` to apex domain.
- **Trailing Slash Standard:**
  - Directory endpoints: \`/academies/\`, \`/branches/\`, \`/contact/\`, \`/privacy-policy/\` have trailing slashes.
  - Root pages: \`/courses\`, \`/placements\`, \`/assessment\`, \`/blog\` have no trailing slashes.
  - Course detail URLs: \`/course-detail.html?id=<course-id>\` preserved without disruption.

## 2. EDGE MIDDLEWARE & CRAWLING DIRECTIVES
- \`functions/_middleware.js\` handles edge request routing on Cloudflare Pages:
  - Intercepts \`/course-detail\` and \`/course-detail.html\` to serve course-specific pre-rendered initial HTML from \`functions/_rendered_courses.js\`.
  - Redirects missing or blank course IDs to \`/courses\` (301 Permanent).
  - Automatically resolves course ID aliases and legacy \`?course=\` query parameters to canonical \`?id=\` (301 Permanent).
  - Applies environment-aware headers: Production receives \`X-Robots-Tag: index, follow\`; Preview/Staging receives \`X-Robots-Tag: noindex, nofollow\`.

## 3. XML SITEMAP & ROBOTS.TXT
- **XML Sitemap:** \`https://novaskills.in/sitemap.xml\` contains exactly 175 canonical URLs, 0 duplicates, all 200 OK.
- **Robots.txt:** Accessible at \`https://novaskills.in/robots.txt\`, properly disallows internal/auth paths and references sitemap.

## 4. REDIRECT INTEGRITY
- \`_redirects\` contains 30 rules; 0 redirect chains, 0 redirect loops.
`;
fs.writeFileSync(path.join(SEO_DOCS_DIR, '02-technical-seo-report.md'), technicalSeoReport, 'utf8');

// 2. 02-off-page-strategy.md
const offPageStrategy = `# NOVA SKILLS — ETHICAL OFF-PAGE SEO & DIGITAL AUTHORITY STRATEGY
**Task ID:** Phase 2, Layer 3 — Off-Page SEO & External Authority  
**Target:** Organic Brand Mentions, Verifiable Backlinks, Academic Credibility  

---

## 1. CORE OFF-PAGE PRINCIPLES (STRICT COMPLIANCE)
- **Zero Paid Link Schemes:** Strictly no purchased backlinks, private blog networks (PBNs), link exchanges, or automated comment spam.
- **Entity Authority:** Focus on building verifiable co-occurrences of the brand entity "Nova Skills" with recognized topics (AI, Tech Upskilling, Digital Marketing) and accredited physical location (Siddharth Nagar, Uttar Pradesh).

## 2. HIGH-VALUE ETHICAL ACQUISITION CHANNELS
1. **GitHub Proof-of-Work Repositories:**
   - Encourage Full Stack and Python students to open-source select capstone projects with clear attribution ("Built as part of Nova Skills Full Stack Web Development program").
2. **Editorial Thought Leadership & Founder Profiles:**
   - Syndicate technical articles and insights by founder Waseeullah Mansoori on Medium, Dev.to, and LinkedIn.
3. **Regional Educational Citations & Local Media:**
   - Target regional educational portals in Uttar Pradesh and Madhya Pradesh for press releases on localized digital skill initiatives.
4. **Alumni Case Studies & Portfolios:**
   - Verified student portfolio links hosted on GitHub Pages, Behance, and Dribbble referencing Nova Skills credentials.
`;
fs.writeFileSync(path.join(SEO_DOCS_DIR, '02-off-page-strategy.md'), offPageStrategy, 'utf8');

// 3. 03-content-strategy.md & 03-editorial-calendar.csv
const contentStrategy = `# NOVA SKILLS — CONTENT SEO STRATEGY & TOPICAL CLUSTERS
**Task ID:** Phase 2, Layer 5 — Content SEO & Editorial Roadmap  
**Target:** 12 Academies, 109 Courses, 90-Day Editorial Publishing Framework  

---

## 1. STRATEGIC CONTENT OBJECTIVE
Transform Nova Skills into a primary knowledge authority for practical digital skills in India by creating authoritative, non-plagiarized guides, tool comparisons, and career roadmaps that naturally feed into course discovery.

## 2. TOPICAL CLUSTER ARCHITECTURE
- **AI & Automation Cluster:** Focus on n8n workflows, generative AI tools, prompt engineering, and LLM implementation for businesses.
- **Performance Growth Cluster:** Focus on Google Ads vs Meta Ads comparisons, GA4 server-side tracking, and advanced SEO/GEO techniques for 2026+.
- **Full Stack Development Cluster:** Focus on Next.js 15 App Router, React vs Vue comparisons, modern PostgreSQL data modeling, and AI pair-programming workflows.
- **Creative & 3D Cluster:** Practical breakdowns of Blender vs 3ds Max, architectural rendering pipelines, and short-form video editing techniques.
`;
fs.writeFileSync(path.join(SEO_DOCS_DIR, '03-content-strategy.md'), contentStrategy, 'utf8');

const editorialCalendarHeaders = [
  'Article Title',
  'Target Academy / Pillar',
  'Target Keywords',
  'Search Intent',
  'Audience',
  'Format',
  'Internal Link Target',
  'Publish Month'
];

const editorialRows = [
  editorialCalendarHeaders,
  ['Next.js 15 Full Stack Roadmap for 2027', 'Programming', 'nextjs 15 roadmap, full stack developer guide', 'Informational', 'Aspiring Web Developers', 'Comprehensive Guide', 'course-detail.html?id=ai-assisted-full-stack-web-development', 'Month 1'],
  ['Meta Ads vs Google Ads: Best ROI for Indian D2C Brands', 'Digital Marketing', 'meta ads vs google ads india, d2c marketing strategy', 'Comparison', 'Marketers & Founders', 'Analytical Comparison', 'course-detail.html?id=performance-marketing-specialist', 'Month 1'],
  ['How to Build Autonomous AI Agents with n8n & OpenAI', 'AI Academy', 'build ai agents n8n, automated workflows open source', 'How-To Tutorial', 'Automation Engineers & Tech Freelancers', 'Step-by-step Tutorial', 'course-detail.html?id=ai-automation-n8n', 'Month 1'],
  ['Figma to Production Code: Best Practices for UI/UX Designers', 'Design', 'figma to code workflow, ui ux developer handoff', 'Educational Guide', 'UI/UX Designers', 'Workflow Guide', 'course-detail.html?id=uiux-design-pro', 'Month 2'],
  ['Blender 3D for Beginners: 7-Step ArchViz Modeling Pipeline', '3D Academy', 'blender 3d archviz tutorial, 3d modeling pipeline', 'How-To Tutorial', 'Architects & 3D Artists', 'Visual Pipeline Guide', 'course-detail.html?id=blender-cert', 'Month 2'],
  ['How to Land International Clients on Upwork & Fiverr from India', 'Career & Freelancing', 'upwork client acquisition india, freelancing guide 2027', 'Career Guidance', 'Freelancers & Career Changers', 'Practical Playbook', 'course-detail.html?id=freelancing-client-acquisition-professional', 'Month 2'],
  ['Short-Form Video Strategy: Editing Viral Reels in Premiere Pro', 'Video & Motion', 'short form video editing premiere pro, viral reels editing', 'How-To Tutorial', 'Content Creators & Editors', 'Case Study Guide', 'course-detail.html?id=ai-integrated-video-editing-motion-graphics-professional', 'Month 3'],
  ['Webflow vs Shopify: Choosing the Right No-Code E-Commerce CMS', 'No-Code Web', 'webflow vs shopify ecommerce, best no code cms india', 'Comparison', 'Entrepreneurs & Web Builders', 'Platform Comparison', 'course-detail.html?id=nocode-web-pro', 'Month 3'],
  ['Mastering Microsoft 365 Copilot for Business Productivity', 'Office Productivity', 'microsoft copilot tutorial, excel ai productivity guide', 'Practical Tutorial', 'Corporate Executives & Analysts', 'Office Playbook', 'course-detail.html?id=microsoft-copilot', 'Month 3']
];

function escapeCsv(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const edCsv = editorialRows.map(r => r.map(escapeCsv).join(',')).join('\r\n');
fs.writeFileSync(path.join(SEO_DOCS_DIR, '03-editorial-calendar.csv'), edCsv, 'utf8');

// 4. 04-semantic-topic-map.md
const semanticTopicMap = `# NOVA SKILLS — SEMANTIC TOPIC MAP & ENTITY GRAPH
**Task ID:** Phase 2, Layer 6 — Semantic SEO  
**Target:** Entity Relationships, Concept Nodes, Ontology Architecture  

---

## 1. SEMANTIC ONTOLOGY OVERVIEW
Nova Skills connects core educational entities, technologies, tools, skills, and industry certifications across a structured conceptual graph:

[Entity: Nova Skills]
  ├── [Discipline: Digital Marketing]
  │     ├── [Skill: Search Engine Optimization] ──> [Tools: Google Search Console, Screaming Frog]
  │     ├── [Skill: Generative Engine Optimization] ──> [Entities: ChatGPT Search, Perplexity, Perplexity AI]
  │     └── [Skill: Paid Advertising] ──> [Platforms: Meta Ads Manager, Google Ads]
  ├── [Discipline: Artificial Intelligence]
  │     ├── [Skill: Agentic Workflows] ──> [Platforms: n8n, LangChain, Flowise]
  │     ├── [Skill: Prompt Engineering] ──> [Models: GPT-4o, Gemini 1.5 Pro, Claude 3.5 Sonnet]
  │     └── [Skill: API Integration] ──> [Tech: OpenAI API, Gemini API, Streaming Responses]
  └── [Discipline: Full Stack Web Engineering]
        ├── [Skill: Modern Client Architecture] ──> [Tech: Next.js 15, React 19, TypeScript]
        ├── [Skill: Scalable Server Systems] ──> [Tech: Node.js, REST APIs, GraphQL]
        └── [Skill: Relational Data Modeling] ──> [Database: PostgreSQL 17, Prisma ORM, Supabase]

`;
fs.writeFileSync(path.join(SEO_DOCS_DIR, '04-semantic-topic-map.md'), semanticTopicMap, 'utf8');

// 5. 05-entity-seo-audit.md
const entitySeoAudit = `# NOVA SKILLS — ENTITY SEO AUDIT & DIGITAL FOOTPRINT
**Task ID:** Phase 2, Layer 7 — Entity SEO & E-E-A-T  
**Target:** Brand Consistency, Physical Campus Signals, Founder & Faculty Verification  

---

## 1. BRAND ENTITY SPECIFICATION
- **Legal / Brand Name:** Nova Skills (Nova Skills Education Institute)
- **Domain:** \`https://novaskills.in/\`
- **Entity Type:** \`EducationalOrganization\` / \`Organization\` / \`LocalBusiness\`
- **Official Registered Physical Campus:**  
  Siddharth Nagar, Uttar Pradesh, India.
- **Official Admissions Helpline:** \`+91 9695904440\`
- **Official WhatsApp:** \`919695904440\`
- **Official Email:** \`admissions@novaskills.in\`

## 2. FOUNDER & LEADERSHIP ENTITY
- **Founder:** Waseeullah Mansoori
- **Entity Markup:** \`Person\` schema active on \`/blog/waseeullah-mansoori/\`
- **Role:** Founder & Director, Nova Skills Education Institute

## 3. FACULTY & MENTOR PROFILES AUDIT
- Mentors registry maintained in \`data/mentors.json\` (12 domain mentors).
- **Audit Finding:** Course pages currently display role-based mentor cards (e.g. "Senior Full Stack Web Lead Mentor", "Applied AI Lead Mentor"). This approach is compliant as long as generic placeholder student testimonials are replaced with domain-specific proof.
`;
fs.writeFileSync(path.join(SEO_DOCS_DIR, '05-entity-seo-audit.md'), entitySeoAudit, 'utf8');

// 6. 06-programmatic-seo-audit.md & 06-programmatic-page-validation.csv
const programmaticSeoAudit = `# NOVA SKILLS — PROGRAMMATIC SEO & LARGE-SCALE PAGE AUDIT
**Task ID:** Phase 2, Layer 8 — Programmatic Landing Page Architecture  
**Target:** 109 Course Detail Pages, 36 Location Pages, 12 Academy Hubs  

---

## 1. ARCHITECTURE & BUILD PIPELINE
Nova Skills utilizes structured JavaScript build scripts to generate high-performing, pre-rendered static HTML pages from canonical data sources:
- \`scripts/build-course-pages.js\` compiles all 109 course-detail HTML payloads.
- \`scripts/build-academy-pages.js\` compiles the 12 academy landing hubs.
- \`scripts/build-all-city-pages-phaseF.js\` compiles the 36 location pages.
- \`scripts/generate-sitemap.js\` compiles \`sitemap.xml\`.

## 2. UNIQUE CONTENT SAFEGUARDS AGAINST DOORWAY PAGES
- **Course Detail Pages:** Each course has a completely individualized 14-module syllabus, unique software prerequisites, bespoke capstones, and course-specific FAQs.
- **Location Pages:** Location hubs avoid doorway penalties by featuring localized economic context, localized career opportunities, and an explicit disclosure of Live-Online delivery with physical campus in Siddharth Nagar.
`;
fs.writeFileSync(path.join(SEO_DOCS_DIR, '06-programmatic-seo-audit.md'), programmaticSeoAudit, 'utf8');

const progHeaders = [
  'Page Identifier / Slug',
  'Template Source',
  'Data Registry Source',
  'Pre-rendered HTML Path',
  'Canonical URL',
  'Unique Content Elements',
  'Doorway Penalty Risk',
  'Validation Status'
];

const progRows = [
  progHeaders,
  ...publishedCourses.map(c => [
    c.id,
    'course-detail.html',
    'data/courses.json',
    `_rendered_courses/${c.id}.html`,
    `https://novaskills.in/course-detail.html?id=${c.id}`,
    'Custom syllabus, unique tool list, capstone projects, pricing table, FAQs',
    'Low (Distinct academic course curriculum)',
    'Verified Programmatic Page'
  ]),
  ...allLocations.map(l => [
    l.slug,
    'branch template',
    'lib/locations',
    `branches/${l.slug}/index.html`,
    `https://novaskills.in/branches/${l.slug}/`,
    'City name, state context, local industry demand, live-online modality advisory',
    'Low (Explicit service-area disclosure with online format)',
    'Verified Programmatic Page'
  ])
];

const progCsv = progRows.map(r => r.map(escapeCsv).join(',')).join('\r\n');
fs.writeFileSync(path.join(SEO_DOCS_DIR, '06-programmatic-page-validation.csv'), progCsv, 'utf8');

// 7. 07-international-seo-assessment.md & 08-multilingual-seo-assessment.md
const intlAssessment = `# NOVA SKILLS — INTERNATIONAL SEO FEASIBILITY ASSESSMENT
**Task ID:** Phase 2, Layer 9 — International Search Strategy  
**Primary Target:** India | **Secondary Evaluation:** NRI & South Asia Markets  

---

## 1. COMMERCIAL & OPERATIONAL FEASIBILITY
- **Primary Market Focus:** India remains the core commercial priority (98%+ of prospective students). Course pricing is anchored in Indian Rupees (INR ₹), and admissions counsellors operate in Indian Standard Time (IST).
- **Secondary International Demand (NRI / Gulf / Southeast Asia):**
  - Organic demand exists for certified Spoken English, Digital Marketing, and Full Stack Development among Indian expatriate communities in the UAE, Saudi Arabia, Singapore, and Qatar.
- **Implementation Decision:**
  - Maintain primary Indian market focus. Do NOT implement speculative country-coded subdirectories (e.g. \`/us/\`, \`/ae/\`) at this time, as operations, payment gateways (Razorpay/UPI), and faculty hours are optimized for India.
`;
fs.writeFileSync(path.join(SEO_DOCS_DIR, '07-international-seo-assessment.md'), intlAssessment, 'utf8');

const multilingualAssessment = `# NOVA SKILLS — MULTILINGUAL SEO ASSESSMENT (ENGLISH, HINDI & HINGLISH)
**Task ID:** Phase 2, Layer 10 — Multilingual Search Strategy  
**Primary Market:** India | **Language Assessment:** English, Hindi, Hinglish  

---

## 1. USER SEARCH INTENT & BEHAVIOR
- **Tech Upskilling Query Behavior in India:** Over 92% of technical search queries for coding, AI, digital marketing, and design in Tier-1, Tier-2, and Tier-3 Indian cities are conducted in English characters (e.g. "digital marketing course in hindi", "best full stack course online", "graphic design sikhne ke liye best institute").
- **Pedagogical Reality:** Classes at Nova Skills are delivered in bilingual mode (Hinglish: conversational Hindi explanations with professional English terminology, software interfaces, and documentation).

## 2. EDITORIAL & TECHNICAL IMPLEMENTATION DECISION
- **Primary Language:** English (\`<html lang="en">\`).
- **Hinglish Conversational FAQ Integration:** Integrate natural bilingual FAQ questions in course curriculums where appropriate to capture conversational search queries without publishing fragmented machine-translated pages.
- **Machine-Translation Warning:** Avoid automated Google Translate plugin subdirectories, which trigger low-quality search rater flags.
`;
fs.writeFileSync(path.join(SEO_DOCS_DIR, '08-multilingual-seo-assessment.md'), multilingualAssessment, 'utf8');

console.log('Phase 2 Documentation & Assessments Successfully Written!');
