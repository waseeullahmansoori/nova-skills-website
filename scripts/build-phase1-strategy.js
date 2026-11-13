/**
 * ============================================================
 * NOVA SKILLS — PHASE 1: KEYWORD TO URL MAPPING ENGINE
 * ============================================================
 * Maps search intent, primary keywords, supporting keywords,
 * semantic entities, and conversion goals for every canonical URL.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SEO_DOCS_DIR = path.join(ROOT_DIR, 'docs', 'seo');
const COURSES_JSON_PATH = path.join(ROOT_DIR, 'data', 'courses.json');
const LOCATIONS_REGISTRY_PATH = path.join(ROOT_DIR, 'lib', 'locations');

const coursesData = JSON.parse(fs.readFileSync(COURSES_JSON_PATH, 'utf8'));
const publishedCourses = coursesData.courses || [];
const locationsRegistry = require(LOCATIONS_REGISTRY_PATH);
const allLocations = locationsRegistry.getAllLocations();

console.log(`Phase 1 Engine: Loading ${publishedCourses.length} courses and ${allLocations.length} locations...`);

const mappingRows = [
  [
    'Keyword',
    'Search intent',
    'Audience',
    'Search volume (Verified)',
    'Keyword difficulty',
    'Competition',
    'Business relevance',
    'Priority',
    'Target URL',
    'Primary keyword',
    'Supporting keywords',
    'Semantic entities',
    'Conversion goal',
    'Cannibalization risk',
    'Data source and date'
  ]
];

// Helper to escape CSV
function escapeCsv(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// 1. Homepage & Core Hubs
mappingRows.push([
  'nova skills',
  'Navigational / Brand',
  'Students, working professionals, career switchers in India',
  'Verified Brand Search',
  'Low (Brand)',
  'Low',
  'High',
  'P0',
  'https://novaskills.in/',
  'Nova Skills',
  'nova skills institute, nova skills courses, nova skills certification, nova skills review',
  'Nova Skills, EdTech India, Skill Development, Professional Certification, Siddharth Nagar',
  'Free Demo Request / Course Exploration',
  'None',
  'Internal Registry (Nov 2026)'
]);

mappingRows.push([
  'professional certification courses online india',
  'Commercial Investigation',
  'Working professionals, fresh graduates seeking certified career upskilling',
  'High Intent Non-Branded',
  'High',
  'High',
  'High',
  'P0',
  'https://novaskills.in/courses',
  'professional certification courses online india',
  'job ready skills courses, online tech certifications, modular skills training india, best online courses with certificate',
  'Course Catalog, Certification Programs, Modular Learning, Industry Upskilling',
  'Course Selection / Free Demo Booking',
  'Low (Differentiated from individual course pages via catalog intent)',
  'Internal Registry (Nov 2026)'
]);

mappingRows.push([
  'courses with placement support in india',
  'Career Guidance / Commercial',
  'Job seekers, career changers, fresh graduates requiring employment assistance',
  'High Intent Non-Branded',
  'Medium-High',
  'High',
  'High',
  'P1',
  'https://novaskills.in/placements',
  'courses with placement support in india',
  'job assistance programs, career transition courses, 100% placement support criteria, hiring partners referral network',
  'Placement Support, Career Services, Hiring Partners, Mock Interviews, Resume Preparation',
  'Career Counselling Booking',
  'None (Dedicated institutional career hub)',
  'Internal Registry (Nov 2026)'
]);

mappingRows.push([
  'free tech career skill assessment test',
  'Diagnostic / Informational',
  'Learners unsure which digital career matches their strengths',
  'High Engagement',
  'Medium',
  'Medium',
  'High',
  'P1',
  'https://novaskills.in/assessment',
  'free tech career skill assessment test',
  'career suitability test, tech skills quiz, digital marketing vs programming assessment, which course to choose quiz',
  'Skill Assessment, Career Diagnostic, AI Advisor, Learning Pathway',
  'Skill Assessment Completion / Lead Submission',
  'None',
  'Internal Registry (Nov 2026)'
]);

mappingRows.push([
  'verify nova skills certificate online',
  'Transactional / Informational',
  'Employers, background verification agencies, alumni validating credentials',
  'Targeted Query',
  'Low (Direct)',
  'Low',
  'High',
  'P2',
  'https://novaskills.in/verify',
  'verify certificate online',
  'certificate verification portal, credential check nova skills, validate student certificate id',
  'Credential Verification, Certificate Security, Student Validation, Institutional Integrity',
  'Credential Lookup Verification',
  'None',
  'Internal Registry (Nov 2026)'
]);

// 2. 12 Academy Landing Pages
const academyKeywordMap = {
  'digital-marketing': {
    keyword: 'digital marketing courses online india',
    intent: 'Commercial Investigation',
    primary: 'digital marketing courses online india',
    supporting: 'ai digital marketing training, performance marketing certification, seo course, meta ads course india',
    entities: 'Digital Marketing, SEO, Paid Advertising, Meta Ads, Google Ads, GA4, E-Commerce Growth',
    conversion: 'Book Free Demo / Explore Marketing Courses'
  },
  'ai': {
    keyword: 'applied ai and automation courses india',
    intent: 'Commercial Investigation',
    primary: 'applied ai and automation courses india',
    supporting: 'ai agents course, prompt engineering certification, n8n automation training, generative ai for business',
    entities: 'Artificial Intelligence, LLMs, AI Agents, n8n, Prompt Engineering, ChatGPT, OpenAI API',
    conversion: 'Book Free Demo / Explore AI Courses'
  },
  'design': {
    keyword: 'ui ux design and graphic design courses online',
    intent: 'Commercial Investigation',
    primary: 'ui ux design course online india',
    supporting: 'graphic design certification, figma course, adobe photoshop illustrator course, visual branding training',
    entities: 'UI/UX Design, Figma, Graphic Design, Brand Identity, Visual Design, Adobe Suite',
    conversion: 'Book Free Demo / Explore Design Courses'
  },
  'programming': {
    keyword: 'full stack web development and python courses india',
    intent: 'Commercial Investigation',
    primary: 'full stack web development course online',
    supporting: 'python developer course, nextjs full stack training, backend development course, rest api course',
    entities: 'Full Stack Development, Next.js, React, Node.js, Python, PostgreSQL, REST APIs',
    conversion: 'Book Free Demo / Explore Coding Courses'
  },
  'no-code-web': {
    keyword: 'no code website development courses',
    intent: 'Commercial Investigation',
    primary: 'no code website development course',
    supporting: 'webflow course india, shopify store development, wordpress elementor certification, framer website design',
    entities: 'No-Code Development, Webflow, Shopify, WordPress, Elementor, Framer, E-Commerce CMS',
    conversion: 'Book Free Demo / Explore No-Code Courses'
  },
  'video-motion': {
    keyword: 'video editing and motion graphics courses online india',
    intent: 'Commercial Investigation',
    primary: 'video editing course online india',
    supporting: 'premiere pro course, after effects motion graphics, davinci resolve color grading, reels editing course',
    entities: 'Video Production, Premiere Pro, After Effects, DaVinci Resolve, Motion Design, YouTube Post-Production',
    conversion: 'Book Free Demo / Explore Video Courses'
  },
  '3d': {
    keyword: '3d architectural visualization and blender courses',
    intent: 'Commercial Investigation',
    primary: '3d visualization course india',
    supporting: 'blender 3d course, 3ds max architectural rendering, vray lumion training, unreal engine archviz',
    entities: '3D Modeling, Blender, 3ds Max, V-Ray, Unreal Engine, Architectural Visualization, CGI',
    conversion: 'Book Free Demo / Explore 3D Courses'
  },
  'career-freelancing': {
    keyword: 'freelancing client acquisition and career launch course',
    intent: 'Career Guidance / Commercial',
    primary: 'freelancing client acquisition course',
    supporting: 'upwork fiverr success course, client communication training, proposal writing skills, remote work guide',
    entities: 'Freelancing, Client Acquisition, Upwork, Fiverr, Contract Negotiation, Remote Work, International Clients',
    conversion: 'Book Free Counselling / Explore Career Courses'
  },
  'communication': {
    keyword: 'business communication and spoken english courses',
    intent: 'Commercial Investigation',
    primary: 'business communication course online',
    supporting: 'spoken english professional course, executive presentation skills, public speaking training india',
    entities: 'Business Communication, Spoken English, Public Speaking, Executive Presentation, Interview Preparation',
    conversion: 'Book Free Demo / Explore Communication Courses'
  },
  'kids-tech': {
    keyword: 'coding and ai courses for kids online',
    intent: 'Commercial Investigation',
    primary: 'coding and ai courses for kids',
    supporting: 'scratch programming for children, python for kids, robotics basics, young creators tech camp',
    entities: 'Kids Coding, STEM Education, Scratch Programming, Python for Kids, Robotics, Computational Thinking',
    conversion: 'Book Free Demo with Guardian Consent'
  },
  'creator': {
    keyword: 'content creator and youtube growth courses',
    intent: 'Commercial Investigation',
    primary: 'content creator course online india',
    supporting: 'youtube mastery course, short form video strategy, podcast production training, personal branding course',
    entities: 'Content Creation, YouTube Growth, Monetization, Podcasting, Personal Branding, Short-Form Video',
    conversion: 'Book Free Demo / Explore Creator Courses'
  },
  'office-productivity': {
    keyword: 'advanced excel copilot and office productivity courses',
    intent: 'Commercial Investigation',
    primary: 'office productivity courses online',
    supporting: 'advanced microsoft excel course, microsoft copilot training, notion productivity certification, tally prime gst course',
    entities: 'Office Productivity, Microsoft Excel, Microsoft 365 Copilot, Google Workspace, Notion, Tally Prime GST',
    conversion: 'Book Free Demo / Explore Office Courses'
  }
};

for (const [slug, data] of Object.entries(academyKeywordMap)) {
  mappingRows.push([
    data.keyword,
    data.intent,
    'Aspiring learners and professionals seeking academy-wide skill mastery',
    'High Category Intent',
    'Medium',
    'Medium',
    'High',
    'P1',
    `https://novaskills.in/academies/${slug}/`,
    data.primary,
    data.supporting,
    data.entities,
    data.conversion,
    'Low (Serves as hub for constituent course landing pages)',
    'Internal Registry (Nov 2026)'
  ]);
}

// 3. 109 Individual Course Detail Pages
for (const c of publishedCourses) {
  const courseId = c.id;
  const courseName = c.title || c.name || c.id;
  const academySlug = c.academyId || c.academySlug || 'skills';
  const duration = c.duration?.displayLabel || (typeof c.duration === 'string' ? c.duration : 'Certification');
  
  // Primary keyword formula
  const primaryKw = `${courseName.toLowerCase()} course online`;
  const supportingKws = `${courseName.toLowerCase()} certification, learn ${courseName.toLowerCase()}, ${courseName.toLowerCase()} training india, ${courseName.toLowerCase()} syllabus fees`;
  const entities = `${courseName}, ${academySlug}, Certification, Practical Projects, Nova Skills`;

  mappingRows.push([
    primaryKw,
    'Transactional / Commercial Investigation',
    'Individual career upskillers, students, freelancers, professionals',
    'Targeted Course Query',
    'Medium',
    'Medium',
    'High',
    'P1',
    `https://novaskills.in/course-detail.html?id=${courseId}`,
    primaryKw,
    supportingKws,
    entities,
    'Book 2-Day Free Demo / Request Admissions Enquiry',
    'Low (Individualized course canonical ID prevents cannibalization)',
    'Internal Registry (Nov 2026)'
  ]);
}

// 4. 36 Learning Location Pages
for (const loc of allLocations) {
  const citySlug = loc.slug;
  const cityName = loc.city || loc.name || loc.slug;
  const state = loc.state || 'India';
  const localKw = `online skills and professional courses in ${cityName.toLowerCase()}`;
  const suppKw = `digital marketing course in ${cityName.toLowerCase()}, web development training ${cityName.toLowerCase()}, ai courses ${cityName.toLowerCase()}, tech courses ${cityName.toLowerCase()}`;
  const entities = `${cityName}, ${state}, Live-Online Education, Nova Skills, Skill Development`;

  mappingRows.push([
    localKw,
    'Local Intent / Commercial Investigation',
    `Students and professionals residing in ${cityName} seeking live-online interactive mentorship`,
    'Regional Intent Non-Branded',
    'Low-Medium',
    'Low-Medium',
    'High',
    'P2',
    `https://novaskills.in/branches/${citySlug}/`,
    localKw,
    suppKw,
    entities,
    'Request Free Demo / Book 1:1 Live Online Counselling',
    'None (Explicitly localized regional hubs with Live-Online disclosure)',
    'Internal Registry (Nov 2026)'
  ]);
}

// 5. 5 Published Blog Articles
const blogArticles = [
  {
    slug: 'waseeullah-mansoori',
    kw: 'waseeullah mansoori nova skills founder',
    intent: 'Informational / Brand Entity',
    primary: 'waseeullah mansoori biography and career',
    supp: 'nova skills founder, waseeullah mansoori educational leadership, tech education visionary india',
    entities: 'Waseeullah Mansoori, Founder, Nova Skills, EdTech Leadership, India',
    conversion: 'Brand Credibility / Institutional Trust'
  },
  {
    slug: 'ai-skills-future-careers-2027-2030',
    kw: 'high demand ai skills for future careers 2027 to 2030',
    intent: 'Informational / Career Guidance',
    primary: 'ai skills future careers 2027 to 2030',
    supp: 'ai career transition roadmap, future tech skills in demand india, ai automation job market outlook',
    entities: 'AI Skills, Career Transition, Future of Work, Automation, Applied AI',
    conversion: 'Read Guide / Explore AI Academy Courses'
  },
  {
    slug: 'ai-seo-geo-digital-marketing-2026',
    kw: 'ai seo and geo generative engine optimization 2026 guide',
    intent: 'Informational / Technical',
    primary: 'ai seo and generative engine optimization',
    supp: 'geo strategies 2026, answer engine optimization guide, chatgpt search optimization, perplexity citations',
    entities: 'Generative Engine Optimization, GEO, AI Search, Searchgpt, Perplexity, AEO, Digital Marketing 2026',
    conversion: 'Read Editorial / Explore Digital Marketing Specialist Course'
  },
  {
    slug: 'high-demand-courses-2027-ai-skills-careers',
    kw: 'best high demand courses for 2027 ai skills and careers',
    intent: 'Informational / Comparison',
    primary: 'high demand courses for 2027 tech careers',
    supp: 'top certified skills to learn, high salary tech skills without engineering degree, career upskilling comparison 2027',
    entities: 'High-Demand Skills, Tech Careers 2027, Upskilling, Job Market Trends India',
    conversion: 'Take Skill Assessment / Explore Courses'
  },
  {
    slug: 'n8n-ai-automation-beginners',
    kw: 'n8n ai automation for beginners step by step guide',
    intent: 'Informational / How-To Tutorial',
    primary: 'n8n ai automation for beginners',
    supp: 'n8n workflow tutorial, open source ai automation, building ai agents with n8n, n8n vs zapier for ai',
    entities: 'n8n, Workflow Automation, AI Agents, OpenAI Integration, No-Code Automation',
    conversion: 'Explore AI Automation with n8n Course'
  }
];

for (const b of blogArticles) {
  mappingRows.push([
    b.kw,
    b.intent,
    'Learners, industry researchers, and professionals seeking practical actionable tech guidance',
    'Editorial Informational',
    'Medium',
    'Medium',
    'High',
    'P2',
    `https://novaskills.in/blog/${b.slug}/`,
    b.primary,
    b.supp,
    b.entities,
    b.conversion,
    'None (Deep long-form educational guides supporting parent academies)',
    'Internal Registry (Nov 2026)'
  ]);
}

const csvOutput = mappingRows.map(r => r.map(escapeCsv).join(',')).join('\r\n');
const mapPath = path.join(SEO_DOCS_DIR, '01-keyword-to-url-map.csv');
fs.writeFileSync(mapPath, csvOutput, 'utf8');
console.log(`Generated Keyword to URL Map: ${mapPath} (${mappingRows.length - 1} target keywords mapped)`);
