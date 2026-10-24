const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('=== RUNNING SEO IMPLEMENTATION VALIDATION SUITE ===\n');

// 1. Validate All 12 Academies
console.log('--- 1. Validating 12 Static Academy Pages ---');
const academySlugs = [
  'digital-marketing', 'ai', 'design', 'programming',
  'no-code-web', 'video-motion', '3d', 'career-freelancing',
  'communication', 'kids-tech', 'creator', 'office-productivity'
];

academySlugs.forEach(slug => {
  const filePath = path.join(ROOT_DIR, 'academies', slug, 'index.html');
  assert(fs.existsSync(filePath), `/academies/${slug}/index.html exists`);
  const html = fs.readFileSync(filePath, 'utf8');

  // Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  assert(titleMatch && !titleMatch[1].includes('Nova Skills Education Institute'), `${slug} has unique targeted title: "${titleMatch ? titleMatch[1] : 'NONE'}"`);

  // Meta description
  const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  assert(metaMatch && !metaMatch[1].includes('Master ' + slug) && !metaMatch[1].includes('ISO certification'), `${slug} has non-boilerplate meta description`);

  // Canonical
  const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  assert(canonMatch && canonMatch[1] === `https://novaskills.in/academies/${slug}/`, `${slug} has accurate canonical`);

  // H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  assert(h1Match && h1Match[1].trim().length > 5, `${slug} has H1 heading`);

  // Delivery badge
  assert(html.includes('badge-delivery'), `${slug} has localized delivery mode badge`);

  // JSON-LD Schema
  const schemaMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  let hasValidSchema = false;
  if (schemaMatch) {
    try {
      const parsed = JSON.parse(schemaMatch[1]);
      hasValidSchema = parsed['@graph'] && parsed['@graph'].some(e => e['@type'] === 'FAQPage');
    } catch(e) {}
  }
  assert(hasValidSchema, `${slug} has valid JSON-LD @graph with FAQPage`);
});

// 2. Validate course-detail.html
console.log('\n--- 2. Validating course-detail.html ---');
const cdHtml = fs.readFileSync(path.join(ROOT_DIR, 'course-detail.html'), 'utf8');
assert(cdHtml.includes('<meta name="robots" id="page-robots" content="index, follow'), 'course-detail.html default robots is index, follow');
assert(!cdHtml.includes('content="noindex, follow"'), 'course-detail.html has no static noindex');
assert(cdHtml.includes('canUrl = \'https://novaskills.in/course-detail.html?id='), 'course-detail.html has synchronous canonical updater');

// 3. Validate courses.html
console.log('\n--- 3. Validating courses.html ---');
const cHtml = fs.readFileSync(path.join(ROOT_DIR, 'courses.html'), 'utf8');
assert(cHtml.includes('<title>109+ Job-Oriented Courses Across 12 Academies | Nova Skills</title>'), 'courses.html title updated to 109+ standard');
assert(cHtml.includes('<link rel="canonical" href="https://novaskills.in/courses" />') || cHtml.includes('<link rel="canonical" href="https://novaskills.in/courses.html" />'), 'courses.html has strict canonical');

// 4. Validate n8n static blog post
console.log('\n--- 4. Validating /blog/n8n-ai-automation-beginners/ ---');
const n8nPath = path.join(ROOT_DIR, 'blog', 'n8n-ai-automation-beginners', 'index.html');
assert(fs.existsSync(n8nPath), 'Static blog/n8n-ai-automation-beginners/index.html exists');
const n8nHtml = fs.readFileSync(n8nPath, 'utf8');
assert(n8nHtml.includes('<link rel="canonical" href="https://novaskills.in/blog/n8n-ai-automation-beginners/" />'), 'n8n blog has correct canonical');
assert(n8nHtml.includes('"@type": "BlogPosting"'), 'n8n blog has BlogPosting schema');
assert(n8nHtml.includes('"@type": "FAQPage"'), 'n8n blog has FAQPage schema');

// 4b. Validate ai-skills-future-careers-2027-2030 static blog post
console.log('\n--- 4b. Validating /blog/ai-skills-future-careers-2027-2030/ ---');
const aiPostPath = path.join(ROOT_DIR, 'blog', 'ai-skills-future-careers-2027-2030', 'index.html');
assert(fs.existsSync(aiPostPath), 'Static blog/ai-skills-future-careers-2027-2030/index.html exists');
const aiPostHtml = fs.readFileSync(aiPostPath, 'utf8');
assert(aiPostHtml.includes('<link rel="canonical" href="https://novaskills.in/blog/ai-skills-future-careers-2027-2030/" />'), 'Research blog has correct canonical');
assert(aiPostHtml.includes('"@type": "BlogPosting"'), 'Research blog has BlogPosting schema');
assert(aiPostHtml.includes('"@type": "FAQPage"'), 'Research blog has FAQPage schema');
assert(aiPostHtml.includes('"@type": "BreadcrumbList"'), 'Research blog has BreadcrumbList schema');
const h1Match = aiPostHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
assert(h1Match && h1Match[1].includes('Will Your Skills Still Be Valuable'), 'Research blog has correct H1 heading');
assert(aiPostHtml.includes('id="quick-answers-future-skills"'), 'Research blog has Quick Answers section');
assert(aiPostHtml.includes('Waseeullah Mansoori'), 'Research blog attributes author Waseeullah Mansoori');

// 5. Validate components.js announcement bar
console.log('\n--- 5. Validating components.js & Minified Bundles ---');
const compJs = fs.readFileSync(path.join(ROOT_DIR, 'components.js'), 'utf8');
assert(!compJs.includes('August 2026'), 'components.js has removed outdated August 2026 announcement');
assert(compJs.includes('Admissions Open for New Batches'), 'components.js has active evergreen admissions announcement');

// 6. Validate sitemap.xml
console.log('\n--- 6. Validating sitemap.xml ---');
const sitemap = fs.readFileSync(path.join(ROOT_DIR, 'sitemap.xml'), 'utf8');
assert(sitemap.includes('<loc>https://novaskills.in/blog/n8n-ai-automation-beginners/</loc>'), 'sitemap.xml includes static n8n blog post');
assert(sitemap.includes('<loc>https://novaskills.in/blog/ai-skills-future-careers-2027-2030/</loc>'), 'sitemap.xml includes static ai-skills-future-careers-2027-2030 blog post');
assert(sitemap.includes('<loc>https://novaskills.in/academies/digital-marketing/</loc>'), 'sitemap.xml includes digital-marketing academy');
assert(!sitemap.includes('blog-detail.html?id=n8n-ai-automation-beginners'), 'sitemap.xml excludes obsolete dynamic n8n url');

console.log(`\n========================================`);
console.log(`TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL TESTS PASSED! SEO IMPLEMENTATION VERIFIED SUCCESSFULLY.');
}
