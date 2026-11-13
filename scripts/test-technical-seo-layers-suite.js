const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TECH_SEO_DIR = path.join(ROOT_DIR, 'docs', 'seo', 'technical');

console.log('================================================================');
console.log('NOVA SKILLS — TECHNICAL SEO LAYERS 49-60 TEST SUITE');
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

// 1. Verify all 44 Technical SEO Deliverables
const requiredFiles = [
  '00-complete-technical-url-inventory.csv',
  '00-technical-issue-register.csv',
  '01-crawl-errors.csv',
  '01-crawlability-audit.md',
  '01-robots-validation.md',
  '01-sitemap-validation.csv',
  '02-indexability-audit.md',
  '02-indexability-matrix.csv',
  '02-search-console-issues.csv',
  '03-core-web-vitals-report.csv',
  '03-performance-baseline.md',
  '03-performance-fix-register.csv',
  '04-mobile-issues.csv',
  '04-mobile-route-test-matrix.csv',
  '04-mobile-seo-audit.md',
  '05-schema-audit.md',
  '05-schema-implementation-map.csv',
  '05-schema-validation-report.csv',
  '06-schema-entity-architecture.md',
  '06-schema-entity-register.csv',
  '06-schema-relationship-validation.csv',
  '07-internal-link-audit.md',
  '07-internal-link-map.csv',
  '07-orphan-page-register.csv',
  '08-canonical-url-map.csv',
  '08-canonicalization-audit.md',
  '08-redirect-map.csv',
  '09-javascript-error-register.csv',
  '09-javascript-seo-audit.md',
  '09-rendered-content-comparison.csv',
  '10-navigation-issue-register.csv',
  '10-site-hierarchy-map.md',
  '10-website-architecture-audit.md',
  '11-crawl-error-analysis.csv',
  '11-crawler-request-analysis.csv',
  '11-log-access-limitation.md',
  '11-log-file-seo-audit.md',
  '12-hreflang-validation.csv',
  '12-international-technical-seo-audit.md',
  '12-regional-url-map.csv',
  '13-complete-technical-qa-report.md',
  '13-regression-test-register.csv',
  '13-route-validation.csv',
  '14-production-release-report.md'
];

console.log('Group 1: Deliverables Verification (Layers 49–60 Docs & Registers)');
assert(requiredFiles.length === 44, 'Deliverable checklist contains exactly 44 technical files');
for (const file of requiredFiles) {
  const filePath = path.join(TECH_SEO_DIR, file);
  const exists = fs.existsSync(filePath);
  const size = exists ? fs.statSync(filePath).size : 0;
  assert(exists && size > 50, `Deliverable ${file} exists and is non-empty (${size} bytes)`);
}

// 2. Robots & Sitemap Integrity
console.log('\nGroup 2: Robots.txt & Sitemap Integrity (Layer 49 Crawlability)');
const robotsPath = path.join(ROOT_DIR, 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt exists at repository root');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
assert(robotsContent.includes('Sitemap: https://novaskills.in/sitemap.xml'), 'robots.txt points to canonical sitemap.xml');
assert(robotsContent.includes('User-agent: *'), 'robots.txt contains global crawler directives');

const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists at repository root');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
assert(sitemapContent.includes('<urlset') && sitemapContent.includes('https://novaskills.in/'), 'sitemap.xml is valid XML urlset');

// 3. HTTP Header & Edge Redirect Integrity (Layer 50 & 56)
console.log('\nGroup 3: Edge Headers & Redirect Rules (Layer 50 & 56)');
const headersPath = path.join(ROOT_DIR, '_headers');
assert(fs.existsSync(headersPath), '_headers file exists for Cloudflare Pages');
const headersContent = fs.readFileSync(headersPath, 'utf8');
assert(headersContent.includes('X-Robots-Tag: noindex, follow'), '_headers enforces noindex on conversion routes');

const redirectsPath = path.join(ROOT_DIR, '_redirects');
assert(fs.existsSync(redirectsPath), '_redirects file exists for Cloudflare Pages');
const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
assert(redirectsContent.includes('/courses.html') && redirectsContent.includes('/courses'), '_redirects maps legacy .html routes to clean URLs');

// 4. Edge Pre-Rendering & JavaScript SEO (Layer 57)
console.log('\nGroup 4: Edge Pre-Rendering & JavaScript SEO (Layer 57)');
const middlewarePath = path.join(ROOT_DIR, 'functions', '_middleware.js');
assert(fs.existsSync(middlewarePath), 'Edge middleware functions/_middleware.js exists');

const renderedCoursesPath = path.join(ROOT_DIR, 'functions', '_rendered_courses.js');
assert(fs.existsSync(renderedCoursesPath), 'Pre-rendered course SSR functions/_rendered_courses.js exists');
const renderedCoursesContent = fs.readFileSync(renderedCoursesPath, 'utf8');
assert(renderedCoursesContent.includes('course-detail.html?id='), 'SSR templates retain course query identity invariant');

// 5. Single Physical Campus & Service Area Semantics (Layer 54 & 60)
console.log('\nGroup 5: Campus Invariant & Regional Semantics (Layer 54 & 60)');
const contactPath = path.join(ROOT_DIR, 'contact', 'index.html');
assert(fs.existsSync(contactPath), 'contact/index.html exists');
const contactContent = fs.readFileSync(contactPath, 'utf8');
assert(contactContent.includes('Siddharth Nagar') && contactContent.includes('272153'), 'contact/index.html explicitly discloses Siddharth Nagar physical campus');

const branchesIndexPath = path.join(ROOT_DIR, 'branches', 'index.html');
assert(fs.existsSync(branchesIndexPath), 'branches/index.html exists');
const branchesIndexContent = fs.readFileSync(branchesIndexPath, 'utf8');
assert(!branchesIndexContent.includes('hreflang="en-IN-Indore"'), 'Prohibited fake city hreflang tags absent from branches directory');

// 6. Pricing & Course Invariant Checks
console.log('\nGroup 6: Tuition Invariant & Course Catalog Sync');
const courseDataPath = path.join(ROOT_DIR, 'js', 'course-data.js');
assert(fs.existsSync(courseDataPath), 'js/course-data.js exists');
const courseDataContent = fs.readFileSync(courseDataPath, 'utf8');
assert(courseDataContent.includes('2,900') || courseDataContent.includes('2900'), 'Approved starting tuition ₹2,900 present in course data');

console.log('\n================================================================');
console.log(`TEST SUITE RESULTS: ${passedTests} / ${totalTests} ASSERTIONS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  console.log('🎉 ALL TECHNICAL SEO ASSERTIONS PASSED! SYSTEM READY FOR RELEASE.\n');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED. CHECK LOGS ABOVE.\n');
  process.exit(1);
}
