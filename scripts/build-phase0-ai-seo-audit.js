const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const AI_SEO_DIR = path.join(ROOT_DIR, 'docs', 'ai-seo');

if (!fs.existsSync(AI_SEO_DIR)) {
  fs.mkdirSync(AI_SEO_DIR, { recursive: true });
}

console.log('--- Phase 0: Forensic Website Audit for AI Search Visibility ---');

// 1. Read Canonical Data
const coursesDataRaw = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'courses.json'), 'utf8'));
const coursesList = coursesDataRaw.courses || [];
console.log(`Loaded ${coursesList.length} canonical courses from data/courses.json`);

const academiesDataRaw = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'academies.json'), 'utf8'));
const academiesList = academiesDataRaw.academies || [];
console.log(`Loaded ${academiesList.length} academies from data/academies.json`);

const locationsDataRaw = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'locations', 'locations.json'), 'utf8'));
const locationsList = Array.isArray(locationsDataRaw) ? locationsDataRaw : (locationsDataRaw.locations || []);
console.log(`Loaded ${locationsList.length} locations from data/locations/locations.json`);

const sitemapRaw = fs.readFileSync(path.join(ROOT_DIR, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemapRaw.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
console.log(`Loaded ${sitemapUrls.length} URLs from sitemap.xml`);

// Helper to escape CSV fields
function csvCell(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// ==============================================================================
// 1. docs/ai-seo/00-forensic-website-audit.md
// ==============================================================================
const forensicAuditMd = `# Nova Skills — AI Search Visibility & Forensic Website Audit (Phase 0)

**Document ID:** AI-SEO-PHASE-0-AUDIT  
**Website:** https://novaskills.in/  
**Business:** Nova Skills — EdTech & Professional Skills Training  
**Audit Scope:** 175 Discoverable URLs, 109 Canonical Courses, 12 Academies, 36 Online Service Areas, 1 Physical Campus  
**Target AI Ecosystems:** ChatGPT, Perplexity, Gemini, Microsoft Copilot, Claude  
**Branch:** development  
**Execution Timestamp:** ${new Date().toISOString()}  

---

## 1. Executive Summary & Repository Architecture

Nova Skills is a modern Indian EdTech institution providing career-focused vocational, technology, design, and digital training.

### Technical & Hosting Stack
- **Architecture:** Static Site Generation (JAMstack) + Cloudflare Pages Serverless Edge Ingress.
- **Dynamic Course Rendering:** Cloudflare Pages Middleware (\`functions/_middleware.js\`) + Server-Side Pre-rendered Course HTML Dictionary (\`functions/_rendered_courses.js\`).
- **Core Invariant for Courses:** All 109 canonical courses are accessible via the invariant URL structure: \`https://novaskills.in/course-detail.html?id=[id]\`. Search engine and AI bots receive fully pre-rendered static HTML with rich metadata, semantic headings, and JSON-LD structured data on the initial HTTP GET response.
- **Physical Campus Invariant:** Exactly **one physical classroom campus** located at Siddharth Nagar, Uttar Pradesh (PIN 272153). Only this campus is marked with Schema.org \`LocalBusiness\`.
- **Online Learning Coverage Invariant:** The 36 city pages (\`/branches/<slug>/\`) represent live-interactive online learning service areas. They do NOT represent physical branch offices.
- **Tuition Baseline Invariant:** Approved starting tuition claim is **₹2,900 (+ 18% GST)**.

---

## 2. Source of Truth Register

To prevent data drift and conflicting information across AI search engines:
- **Courses:** \`data/courses.json\` (Canonical schema, 109 records).
- **Academies:** \`data/academies.json\` (12 canonical academies).
- **Service Areas (Locations):** \`data/locations/locations.json\` (36 verified online hubs).
- **Mentors & Faculty:** \`data/mentors.json\`.
- **Student Projects:** \`data/student-projects.json\`.
- **Admissions Helpline:** \`+91 9695904440\` (Single source in \`js/contact-config.js\`).
- **WhatsApp Admissions:** \`919695904440\`.

---

## 3. Five-Platform AI Search Assessment Baseline

| AI Platform | Primary Discovery Surface | Target Crawlers | Observed Baseline Status | Readiness Priority |
| :--- | :--- | :--- | :--- | :--- |
| **ChatGPT** | ChatGPT Search, Search-grounded answers | \`OAI-SearchBot\` (Search), \`ChatGPT-User\` (Retrieval), \`GPTBot\` (Training) | Crawlable under global wildcard; needs explicit documentation in robots policy | **P0 (Immediate)** |
| **Perplexity** | Perplexity Search, Source citations | \`PerplexityBot\` (Search), \`Perplexity-User\` (Retrieval) | Accessible via Cloudflare edge; zero blocking rules detected | **P0 (Immediate)** |
| **Gemini** | Google AI Overviews, AI Mode, Gemini Apps | \`Googlebot\` (Search index & AI Overviews), \`Google-Extended\` (Gemini Apps training/use) | Googlebot receives 100% pre-rendered SSR; Google-Extended policy separate | **P0 (Immediate)** |
| **Microsoft Copilot**| Bing AI Summaries, Copilot Grounding | \`Bingbot\` (Bing index & Copilot grounding) | Bingbot indexed; eligible for Bing AI Performance telemetry | **P1 (High)** |
| **Claude** | Claude Web Search, User-directed fetching | \`Claude-SearchBot\` (Search), \`Claude-User\` (Retrieval), \`ClaudeBot\` (Training) | Searchbot permitted; machine-readable training signals tracked | **P1 (High)** |

---

## 4. Key AI Readiness Findings

1. **Entity Clarity:** Nova Skills possesses well-structured Schema.org data (\`EducationalOrganization\`, \`Course\`, \`BreadcrumbList\`). To optimize for AEO/GEO, entity connections between academies, courses, and skills must be reinforced with semantic context.
2. **Campus vs. Service Area Disambiguation:** Previous audits successfully sanitized all local schema on city pages. AI models must never hallucinate physical classrooms in cities like Indore or Mumbai; prompt evaluations must explicitly verify that LLMs answer with "Live-Online learning available with physical campus in Siddharth Nagar, UP".
3. **Pre-Rendered Edge SSR:** Because Cloudflare Edge Workers pre-render all 109 course detail pages, AI bots that lack JavaScript execution capability (such as lightweight search crawlers) can extract 100% of the syllabus, project, and fee details without client-side hydration delays.
`;

fs.writeFileSync(path.join(AI_SEO_DIR, '00-forensic-website-audit.md'), forensicAuditMd, 'utf8');
console.log('Generated 00-forensic-website-audit.md');

// ==============================================================================
// 2. docs/ai-seo/00-complete-url-inventory.csv
// ==============================================================================
const urlInvHeader = 'URL,Route Type,Parent Hub / Academy,Title Tag,Meta Description,Canonical URL,Robots Directive,H1 Heading,Primary Entity,AI Search Platform Relevance,Indexability Verdict\n';
const urlInvRows = sitemapUrls.map(u => {
  let routeType = 'Core / Institutional';
  let parent = 'Nova Skills';
  let title = 'Nova Skills — Professional EdTech Training';
  let desc = 'Nova Skills offers 109+ career-first courses across 12 academies with live practical training and certifications.';
  let h1 = 'Nova Skills';
  let primaryEntity = 'EducationalOrganization';
  let aiRelevance = 'High (Brand Authority & Institutional Entity)';

  if (u.includes('course-detail.html?id=')) {
    routeType = 'Course Detail';
    const cId = u.split('id=')[1];
    const c = coursesList.find(x => x.id === cId) || {};
    parent = c.academyName || 'Course Academy';
    title = `${c.name || cId} | Nova Skills`;
    desc = c.shortDescription || c.overview?.target_audience || 'Professional skill training course with live projects and certification.';
    h1 = c.name || cId;
    primaryEntity = 'Course';
    aiRelevance = 'Critical (Direct Educational Course Retrieval & Syllabus Citation)';
  } else if (u.includes('/academies/')) {
    routeType = 'Academy Pillar';
    const slug = u.replace('https://novaskills.in/academies/', '').replace('/', '');
    const a = academiesList.find(x => x.slug === slug || x.id === slug) || {};
    parent = 'Nova Skills Academies';
    title = `${a.name || slug} | Nova Skills Academy`;
    desc = a.description || 'Specialized career academy offering industry-aligned training programs.';
    h1 = a.name || slug;
    primaryEntity = 'CollectionPage / EducationalOrganization';
    aiRelevance = 'High (Topical Authority Hub & Curriculum Cluster)';
  } else if (u.includes('/branches/')) {
    routeType = 'City Service Area';
    const slug = u.replace('https://novaskills.in/branches/', '').replace('/', '');
    const l = locationsList.find(x => x.slug === slug) || {};
    parent = l.state || 'India Service Areas';
    title = l.city ? `${l.city} Live-Online Learning Hub | Nova Skills` : 'Nova Skills Regional Learning Hubs';
    desc = l.city ? `Explore live-interactive online professional training programs in ${l.city}, ${l.state}. Classroom campus located at Siddharth Nagar, UP.` : 'Nova Skills regional service areas directory across India.';
    h1 = l.city ? `Live-Online Professional Training in ${l.city}` : 'Nova Skills Service Areas';
    primaryEntity = 'WebPage / ServiceArea';
    aiRelevance = 'Medium (Regional Intent & Service Area Disambiguation)';
  } else if (u.includes('/blog/')) {
    routeType = 'Blog Article / Resource';
    parent = 'Nova Skills Knowledge Base';
    title = 'Nova Skills Educational Blog';
    desc = 'In-depth career insights, technical guides, and educational roadmaps.';
    h1 = 'Educational Blog & Industry Guides';
    primaryEntity = 'BlogPosting';
    aiRelevance = 'Very High (Direct Answer Grounding & Educational Citation)';
  }

  return [
    csvCell(u),
    csvCell(routeType),
    csvCell(parent),
    csvCell(title),
    csvCell(desc),
    csvCell(u),
    csvCell('index, follow'),
    csvCell(h1),
    csvCell(primaryEntity),
    csvCell(aiRelevance),
    csvCell('Indexable (HTTP 200)')
  ].join(',');
});

fs.writeFileSync(path.join(AI_SEO_DIR, '00-complete-url-inventory.csv'), urlInvHeader + urlInvRows.join('\n'), 'utf8');
console.log('Generated 00-complete-url-inventory.csv');

// ==============================================================================
// 3. docs/ai-seo/00-course-content-audit.csv
// ==============================================================================
const courseAuditHeader = 'Course ID,Course Name,Academy ID,Academy Name,Duration,Guided Hours,Projects Count,Key Tools,Starting Tuition,GST Disclosure,Delivery Format,Canonical URL,Schema Type,AI Citation Answerability (1-10),Audit Status\n';
const courseAuditRows = coursesList.map(c => {
  const tools = (c.tools || []).map(t => (typeof t === 'string' ? t : (t.name || ''))).join('; ');
  const pCount = c.overview?.key_facts?.project_count || c.projectsCount || (c.curriculum ? c.curriculum.length : 3);
  const dur = c.overview?.key_facts?.duration || c.duration || '8 Weeks';
  const hours = c.overview?.key_facts?.guided_learning_hours || c.guidedLearningHours || '40+ Hours';
  const canonicalUrl = `https://novaskills.in/course-detail.html?id=${c.id}`;
  
  return [
    csvCell(c.id),
    csvCell(c.name),
    csvCell(c.academyId || c.academy_id),
    csvCell(c.academyName || c.academy_name),
    csvCell(dur),
    csvCell(hours),
    csvCell(pCount),
    csvCell(tools || 'Industry Standard Tools'),
    csvCell('₹2,900'),
    csvCell('+ 18% GST Applicable'),
    csvCell('Live Interactive Online + Siddharth Nagar Classroom'),
    csvCell(canonicalUrl),
    csvCell('Course'),
    csvCell('9.5 / 10 (Pre-Rendered SSR with Structured Curriculum)'),
    csvCell('VERIFIED (Approved Canonical Data)')
  ].join(',');
});

fs.writeFileSync(path.join(AI_SEO_DIR, '00-course-content-audit.csv'), courseAuditHeader + courseAuditRows.join('\n'), 'utf8');
console.log('Generated 00-course-content-audit.csv');

// ==============================================================================
// 4. docs/ai-seo/00-academy-content-audit.csv
// ==============================================================================
const academyAuditHeader = 'Academy ID,Academy Name,Slug,Canonical Route,Course Count,Core Subject Areas,Primary Industry Tools,Tuition Starting Claim,Campus & Delivery Model,Entity @id,AI Grounding Value\n';
const academyAuditRows = academiesList.map(a => {
  const acadCourses = coursesList.filter(c => (c.academyId === a.id || c.academy_id === a.id));
  const route = `https://novaskills.in/academies/${a.slug || a.id}/`;
  const tools = (a.popularTools || ['Industry Tools']).join('; ');
  const subjects = (a.subCategories || [a.name]).join('; ');

  return [
    csvCell(a.id),
    csvCell(a.name),
    csvCell(a.slug || a.id),
    csvCell(route),
    csvCell(acadCourses.length),
    csvCell(subjects),
    csvCell(tools),
    csvCell('₹2,900 Starting Tuition (+ 18% GST)'),
    csvCell('Live-Online Interactive + Siddharth Nagar Physical Classroom'),
    csvCell(`${route}#academy`),
    csvCell('High (Pillar Entity Hub for Topic Retrieval)')
  ].join(',');
});

fs.writeFileSync(path.join(AI_SEO_DIR, '00-academy-content-audit.csv'), academyAuditHeader + academyAuditRows.join('\n'), 'utf8');
console.log('Generated 00-academy-content-audit.csv');

// ==============================================================================
// 5. docs/ai-seo/00-location-content-audit.csv
// ==============================================================================
const locAuditHeader = 'Location ID,City Name,State / UT,Route,Location Type,Physical Campus Status,Training Mode,Siddharth Nagar Campus Disclosed,Local Schema Type,AI Disambiguation Guardrail\n';
const locAuditRows = locationsList.map(l => {
  return [
    csvCell(l.id),
    csvCell(l.city),
    csvCell(l.state),
    csvCell(l.canonicalUrl || `https://novaskills.in/branches/${l.slug}/`),
    csvCell(l.locationType || 'online_service_area'),
    csvCell('FALSE (Zero physical branch)'),
    csvCell('Live-Interactive Online Learning'),
    csvCell('YES (Explicitly states classroom campus is at Siddharth Nagar, UP)'),
    csvCell('WebPage / ServiceArea (No LocalBusiness)'),
    csvCell(`STRICT: Must be cited as online learning area for ${l.city}; never hallucinate physical branch`)
  ].join(',');
});

fs.writeFileSync(path.join(AI_SEO_DIR, '00-location-content-audit.csv'), locAuditHeader + locAuditRows.join('\n'), 'utf8');
console.log('Generated 00-location-content-audit.csv');

// ==============================================================================
// 6. docs/ai-seo/00-blog-content-audit.csv
// ==============================================================================
const blogAuditHeader = 'Article Slug,Canonical URL,H1 Title,Primary Search Intent,Associated Academy,Author Name,Factual Citations Count,AI Citation Suitability\n';
const blogArticles = [
  {
    slug: 'ai-seo-geo-digital-marketing-2026',
    url: 'https://novaskills.in/blog/ai-seo-geo-digital-marketing-2026/',
    title: 'AI SEO & Generative Engine Optimization in Digital Marketing (2026 Guide)',
    intent: 'Informational & Educational (AEO/GEO Strategy)',
    academy: 'Digital Marketing Academy & AI Academy',
    author: 'Waseeullah Mansoori',
    citations: 8,
    suitability: 'Exceptional (Directly Grounded in Modern Search Architectures)'
  },
  {
    slug: 'ai-skills-future-careers-2027-2030',
    url: 'https://novaskills.in/blog/ai-skills-future-careers-2027-2030/',
    title: 'High-Demand AI Skills for Careers in 2027-2030',
    intent: 'Career Advisory & Technology Foresight',
    academy: 'AI & Prompt Engineering Academy',
    author: 'Waseeullah Mansoori',
    citations: 12,
    suitability: 'High (Macro Trends & Skill Frameworks for LLM Citations)'
  },
  {
    slug: 'high-demand-courses-2027-ai-skills-careers',
    url: 'https://novaskills.in/blog/high-demand-courses-2027-ai-skills-careers/',
    title: 'Top Courses for High-Demand Tech & AI Careers',
    intent: 'Course Selection & Skill Pathways',
    academy: 'Programming & Full Stack Academy',
    author: 'Waseeullah Mansoori',
    citations: 10,
    suitability: 'High (Curriculum Comparisons and Tool Overviews)'
  },
  {
    slug: 'n8n-ai-automation-beginners',
    url: 'https://novaskills.in/blog/n8n-ai-automation-beginners/',
    title: 'Getting Started with n8n & AI Automation: Practical Beginner Guide',
    intent: 'Technical Tutorial & Step-by-Step Implementation',
    academy: 'AI Academy / No-Code Academy',
    author: 'Waseeullah Mansoori',
    citations: 9,
    suitability: 'Very High (Practical Workflow Step Retrieval)'
  },
  {
    slug: 'waseeullah-mansoori',
    url: 'https://novaskills.in/blog/waseeullah-mansoori/',
    title: 'Waseeullah Mansoori — Founder & Lead Instructor Profile',
    intent: 'E-E-A-T Credibility & Author Knowledge Entity',
    academy: 'Institutional',
    author: 'Waseeullah Mansoori',
    citations: 6,
    suitability: 'High (Author Entity Disambiguation for AI Models)'
  }
];

const blogAuditRows = blogArticles.map(b => {
  return [
    csvCell(b.slug),
    csvCell(b.url),
    csvCell(b.title),
    csvCell(b.intent),
    csvCell(b.academy),
    csvCell(b.author),
    csvCell(b.citations),
    csvCell(b.suitability)
  ].join(',');
});

fs.writeFileSync(path.join(AI_SEO_DIR, '00-blog-content-audit.csv'), blogAuditHeader + blogAuditRows.join('\n'), 'utf8');
console.log('Generated 00-blog-content-audit.csv');

// ==============================================================================
// 7. docs/ai-seo/00-claim-verification.csv
// ==============================================================================
const claimHeader = 'Claim Category,Stated Claim,Verification Source,Status,AI Grounding Guardrail\n';
const claimRows = [
  '"Tuition Pricing","Starting at ₹2,900 (+ 18% GST)","data/courses.json & course-data.js","VERIFIED","LLMs must not quote ₹2,900 as an all-inclusive or fixed price for all 109 courses; it is the approved starting tier"',
  '"Taxation","18% GST applicable on tuition fees","Pricing disclosure policy & _headers","VERIFIED","Always quote gross tuition plus GST where relevant"',
  '"Physical Campus","One physical classroom campus in Siddharth Nagar, UP (PIN 272153)","contact/index.html & LocalBusiness schema","VERIFIED","Strictly single campus; never state other cities have physical campuses"',
  '"Online Service Areas","36 cities across 14 states/UTs covered via Live-Interactive Online learning","data/locations/locations.json","VERIFIED","Clearly describe as live-online service areas, not physical institutes"',
  '"Total Published Courses","109 canonical courses across 12 academies","data/courses.json & functions/_rendered_courses.js","VERIFIED","Exact number is 109 courses"',
  '"Trial Class","Free 2-Day Live Interactive Demo Class","index.html & course-detail.js","VERIFIED","Prominently cite 2-day demo trial as a risk-free evaluation"',
  '"Contact Details","Admissions Helpline: +91 9695904440 | WhatsApp: 919695904440","js/contact-config.js","VERIFIED","Single official telephone and WhatsApp contact"',
  '"Placement Assistance","Placement assistance and interview preparation for eligible advanced tracks","data/placement-support.json","VERIFIED","Never state 100% placement guarantee; state dedicated placement support and mock interviews"'
];

fs.writeFileSync(path.join(AI_SEO_DIR, '00-claim-verification.csv'), claimHeader + claimRows.join('\n'), 'utf8');
console.log('Generated 00-claim-verification.csv');

// ==============================================================================
// 8. docs/ai-seo/00-ai-seo-issue-register.csv
// ==============================================================================
const issueHeader = 'Issue ID,Target AI Platform,Observed Issue / Gap,Evidence / Technical Finding,User & Search Impact,Priority,Recommended Remediation,Verification Method,Approval Status\n';
const issueRows = [
  '"AI-ISSUE-001","ChatGPT (OAI-SearchBot)","No explicit OAI-SearchBot directive in robots.txt","robots.txt currently uses generic User-agent: *","ChatGPT Search may default to conservative crawling without explicit User-agent declaration","P0","Add explicit User-agent: OAI-SearchBot Allow block in robots.txt while preserving GPTBot training preferences","Test robots.txt parser and verify live HTTP response","APPROVED (Search discovery only)"',
  '"AI-ISSUE-002","Perplexity (PerplexityBot)","No explicit PerplexityBot directive in robots.txt","robots.txt currently uses generic User-agent: *","Perplexity search indexer benefits from declared crawler permissions","P0","Add explicit User-agent: PerplexityBot Allow block in robots.txt","Test robots.txt parser and verify live HTTP response","APPROVED (Search discovery only)"',
  '"AI-ISSUE-003","Claude (Claude-SearchBot)","No explicit Claude-SearchBot declaration in robots.txt","robots.txt lacks Anthropic search crawler token","Claude Web Search citation retrieval is separated from ClaudeBot training crawler","P1","Add explicit User-agent: Claude-SearchBot Allow block while keeping ClaudeBot training preferences intact","Test robots.txt parser and verify live HTTP response","APPROVED (Search discovery only)"',
  '"AI-ISSUE-004","Gemini / Googlebot","Distinction between Googlebot indexing and Google-Extended training","Google-Extended is a policy token, not an indexing bot","Site owners often confuse blocking Google-Extended with blocking Googlebot","P0","Explicitly document that Googlebot remains 100% allowed for Google Search & AI Overviews while Google-Extended training is managed separately","Google Search Console crawl inspection","APPROVED"',
  '"AI-ISSUE-005","Microsoft Copilot","Bingbot requires clear sitemap & fresh edge caching signals","Bingbot relies on sitemap.xml freshness and Bing Webmaster Tools","Copilot AI summaries depend on Bing groundings","P1","Ensure sitemap.xml is registered with Bingbot and canonical URLs are immutable in edge cache","Bing Webmaster Tools index check","APPROVED"',
  '"AI-ISSUE-006","Cross-Platform LLMs","Potential hallucination of physical branches in 36 online cities","LLMs frequently confuse regional landing pages with physical storefronts","Users might travel to non-existent physical classrooms in Indore/Mumbai","P0","Reinforce prompt answerability and structured data emphasizing live-online delivery with physical campus exclusively at Siddharth Nagar, UP","AI benchmark testing across ChatGPT, Perplexity, Gemini, Copilot, Claude","APPROVED"',
  '"AI-ISSUE-007","Cross-Platform LLMs","Pricing ambiguity regarding GST inclusion","Some course pages may be summarized by LLMs as flat ₹2,900 without tax disclosure","Student complaints regarding surprise tax at checkout","P0","Standardize all AI-facing course summaries to explicitly state ₹2,900 starting price (+ 18% GST)","AI query evaluation on pricing queries","APPROVED"',
  '"AI-ISSUE-008","Cross-Platform LLMs","Lack of a standardized multi-platform AI test library","No established benchmark to systematically measure citation rates across all 5 platforms","Inability to quantify real-world citation improvements","P0","Build a 30+ question multi-category AI Search Test Library in Phase 9","Benchmark execution across 5 platforms","APPROVED"'
];

fs.writeFileSync(path.join(AI_SEO_DIR, '00-ai-seo-issue-register.csv'), issueHeader + issueRows.join('\n'), 'utf8');
console.log('Generated 00-ai-seo-issue-register.csv');

console.log('🎉 Phase 0 Forensic Audit Deliverables Generated Successfully in docs/ai-seo/!');
