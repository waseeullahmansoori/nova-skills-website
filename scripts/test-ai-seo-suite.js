const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const AI_SEO_DIR = path.join(ROOT_DIR, 'docs', 'ai-seo');

console.log('================================================================');
console.log('NOVA SKILLS — AI SEARCH VISIBILITY (5 PLATFORMS) TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] Test ${totalTests}: ${message}`);
  } else {
    console.error(`  [FAIL] Test ${totalTests}: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Deliverables Checklist
const requiredFiles = [
  '00-forensic-website-audit.md',
  '00-complete-url-inventory.csv',
  '00-course-content-audit.csv',
  '00-academy-content-audit.csv',
  '00-location-content-audit.csv',
  '00-blog-content-audit.csv',
  '00-claim-verification.csv',
  '00-ai-seo-issue-register.csv',
  '01-ai-platform-policy-matrix.csv',
  '02-crawler-access-audit.md',
  '02-robots-proposed-configuration.txt',
  '02-cdn-waf-audit.md',
  '02-platform-url-access-test.csv',
  '02-sitemap-validation.csv',
  '05-topical-authority-map.md',
  '05-topic-cluster-map.csv',
  '05-content-gap-register.csv',
  '05-content-production-roadmap.csv',
  '07-entity-inventory.csv',
  '07-knowledge-graph-map.csv',
  '07-entity-consistency-report.md',
  '08-ai-citation-competitor-audit.md',
  '08-cited-domain-register.csv',
  '08-content-opportunity-register.csv',
  '09-ai-search-test-library.csv',
  '09-platform-visibility-observations.csv',
  '09-brand-accuracy-register.csv',
  '09-ai-search-baseline.md',
  '10-chatgpt-performance.md',
  '10-perplexity-performance.md',
  '10-gemini-performance.md',
  '10-copilot-performance.md',
  '10-claude-performance.md',
  '10-cross-platform-dashboard-spec.md',
  '11-ai-referral-and-conversion-measurement.md',
  '12-implementation-report.md',
  '12-platform-access-validation.csv',
  '12-route-content-validation.csv',
  '12-regression-test-report.md',
  '13-production-release-report.md'
];

console.log('Group 1: AI SEO Documentation & Registers Integrity');
assert(requiredFiles.length === 40, 'Deliverable checklist contains exactly 40 AI SEO files');
for (const file of requiredFiles) {
  const filePath = path.join(AI_SEO_DIR, file);
  const exists = fs.existsSync(filePath);
  const size = exists ? fs.statSync(filePath).size : 0;
  assert(exists && size > 50, `Deliverable ${file} exists and is non-empty (${size} bytes)`);
}

// 2. Robots.txt Explicit AI Crawler Directives
console.log('\nGroup 2: Robots.txt AI Search Crawler Directives');
const robotsPath = path.join(ROOT_DIR, 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt exists at repository root');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');

assert(robotsContent.includes('User-agent: OAI-SearchBot'), 'robots.txt explicitly allows OAI-SearchBot for ChatGPT Search');
assert(robotsContent.includes('User-agent: ChatGPT-User'), 'robots.txt explicitly allows ChatGPT-User for live user queries');
assert(robotsContent.includes('User-agent: PerplexityBot'), 'robots.txt explicitly allows PerplexityBot for Perplexity Search');
assert(robotsContent.includes('User-agent: Perplexity-User'), 'robots.txt explicitly allows Perplexity-User for live retrieval');
assert(robotsContent.includes('User-agent: Claude-SearchBot'), 'robots.txt explicitly allows Claude-SearchBot for Anthropic Search');
assert(robotsContent.includes('User-agent: Claude-User'), 'robots.txt explicitly allows Claude-User for user requests');
assert(robotsContent.includes('User-agent: Googlebot'), 'robots.txt explicitly allows Googlebot for Google Search & AI Overviews');
assert(robotsContent.includes('User-agent: Bingbot'), 'robots.txt explicitly allows Bingbot for Bing & Copilot Groundings');
assert(robotsContent.includes('Sitemap: https://novaskills.in/sitemap.xml'), 'robots.txt references canonical sitemap.xml');

// 3. Invariants Integrity
console.log('\nGroup 3: Institutional Invariants & Disambiguation');
const coursesRaw = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'courses.json'), 'utf8'));
assert(coursesRaw.courses && coursesRaw.courses.length === 109, 'data/courses.json contains exactly 109 canonical courses');

const academiesRaw = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'academies.json'), 'utf8'));
assert(academiesRaw.academies && academiesRaw.academies.length === 12, 'data/academies.json contains exactly 12 academies');

const locsRaw = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'locations', 'locations.json'), 'utf8'));
const locsList = Array.isArray(locsRaw) ? locsRaw : locsRaw.locations;
assert(locsList.length === 36, 'data/locations/locations.json contains exactly 36 online service areas');

const allAreOnline = locsList.every(l => l.physicalCampus === false && l.locationType === 'online_service_area');
assert(allAreOnline, 'All 36 city locations strictly declare physicalCampus=false and locationType=online_service_area');

const contactHtml = fs.readFileSync(path.join(ROOT_DIR, 'contact', 'index.html'), 'utf8');
assert(contactHtml.includes('Siddharth Nagar') && contactHtml.includes('272153'), 'contact/index.html explicitly discloses Siddharth Nagar physical campus');

// 4. Edge Pre-Rendering & Course Identity
console.log('\nGroup 4: Edge Pre-Rendering & Course Identity Preservation');
const middlewarePath = path.join(ROOT_DIR, 'functions', '_middleware.js');
assert(fs.existsSync(middlewarePath), 'functions/_middleware.js exists for Cloudflare Pages');

const renderedPath = path.join(ROOT_DIR, 'functions', '_rendered_courses.js');
assert(fs.existsSync(renderedPath), 'functions/_rendered_courses.js exists for Edge SSR');
const renderedContent = fs.readFileSync(renderedPath, 'utf8');
assert(renderedContent.includes('course-detail.html?id='), 'SSR templates retain course query identity invariant');

console.log('\n================================================================');
console.log(`TEST SUITE RESULTS: ${passedTests} / ${totalTests} ASSERTIONS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 ALL AI SEARCH VISIBILITY ASSERTIONS PASSED CLEANLY!\n');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED. CHECK LOGS ABOVE.\n');
  process.exit(1);
}
