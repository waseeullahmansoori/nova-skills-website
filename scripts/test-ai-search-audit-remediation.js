/**
 * Master Verification Suite: AI Search & ChatGPT Visibility Remediation
 * 
 * Comprehensive validation across Phase 1 (Crawlability), Phase 2 (Technical SEO),
 * and Phase 3 (Lead Attribution).
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🚀 MASTER AUDIT VERIFICATION: AI SEARCH & CHATGPT VISIBILITY');
console.log('================================================================\n');

let passCount = 0;
let totalChecks = 0;

function check(desc, fn) {
  totalChecks++;
  try {
    fn();
    console.log(`  ✅ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${desc}`);
    console.error(`     Error: ${err.message}`);
  }
}

// ----------------------------------------------------------------
// PHASE 1: CRAWLABILITY VERIFICATION
// ----------------------------------------------------------------
console.log('--- PHASE 1: CRAWLABILITY & INITIAL HTML AUDIT ---');

const academySlugs = [
  'digital-marketing', 'ai', 'design', 'programming', 'no-code-web',
  'video-motion', '3d', 'career-freelancing', 'communication',
  'kids-tech', 'creator', 'office-productivity'
];

check('All 12 academy pages exist with pre-rendered content', () => {
  academySlugs.forEach(slug => {
    const p = path.join(ROOT_DIR, 'academies', slug, 'index.html');
    assert(fs.existsSync(p), `Missing academy index.html for ${slug}`);
    const html = fs.readFileSync(p, 'utf8');
    assert(html.includes('data-prerendered="true"'), `${slug} missing data-prerendered attribute`);
    assert(!html.includes('Loading Course...'), `${slug} contains placeholder "Loading Course..."`);
    assert(!html.includes('404 — Academy Not Found'), `${slug} contains static 404 placeholder`);
  });
});

check('All 12 academy pages contain semantic course cards and links', () => {
  academySlugs.forEach(slug => {
    const p = path.join(ROOT_DIR, 'academies', slug, 'index.html');
    const html = fs.readFileSync(p, 'utf8');
    const links = html.match(/href="\/course-detail\.html\?id=[a-zA-Z0-9_-]+"/g) || [];
    assert(links.length > 0, `${slug} must contain course links (found: ${links.length})`);
  });
});

check('courses.html contains 109 pre-rendered courses, count 109, and CollectionPage schema', () => {
  const p = path.join(ROOT_DIR, 'courses.html');
  const html = fs.readFileSync(p, 'utf8');
  assert(html.includes('<strong id="courses-showing-count">109</strong>'), 'Must show 109 programs count in static HTML');
  assert(html.includes('CollectionPage'), 'Must have CollectionPage schema');
  assert(html.includes('<link rel="canonical" href="https://novaskills.in/courses" />'), 'Must have clean canonical URL');
  const links = html.match(/href="\/course-detail\.html\?id=[a-zA-Z0-9_-]+"/g) || [];
  assert(links.length >= 109, `courses.html must contain at least 109 course links (found: ${links.length})`);
});

check('index.html featured courses contain semantic links and Details buttons', () => {
  const p = path.join(ROOT_DIR, 'index.html');
  const html = fs.readFileSync(p, 'utf8');
  const expectedCourses = ['dm-professional', 'ai-mastery', 'fullstack-foundation', 'creative-design', 'motion-mastery', 'dm-mastery'];
  expectedCourses.forEach(id => {
    assert(html.includes(`/course-detail.html?id=${id}`), `index.html must link to course ${id}`);
  });
});

// ----------------------------------------------------------------
// PHASE 2: TECHNICAL SEO & EDGE AUDIT
// ----------------------------------------------------------------
console.log('\n--- PHASE 2: TECHNICAL SEO, SCHEMAS & EDGE ROUTING ---');

check('All 109 rendered courses have institutional address in Siddharth Nagar, UP', () => {
  const renderedDir = path.join(ROOT_DIR, '_rendered_courses');
  const files = fs.readdirSync(renderedDir).filter(f => f.endsWith('.html') && f !== '404.html');
  assert.strictEqual(files.length, 109, `Must have exactly 109 rendered course files (found: ${files.length})`);

  files.forEach(f => {
    const html = fs.readFileSync(path.join(renderedDir, f), 'utf8');
    assert(html.includes('Siddharth Nagar'), `${f} missing Siddharth Nagar in schema`);
    assert(html.includes('Uttar Pradesh'), `${f} missing Uttar Pradesh in schema`);
    assert(html.includes('272153'), `${f} missing 272153 postal code in schema`);
    assert(!html.includes('addressLocality": "Hyderabad'), `${f} contains obsolete Hyderabad addressLocality`);
  });
});

check('functions/_rendered_courses.js contains Siddharth Nagar and zero Hyderabad schemas', () => {
  const js = fs.readFileSync(path.join(ROOT_DIR, 'functions', '_rendered_courses.js'), 'utf8');
  assert(js.includes('Siddharth Nagar'), 'Edge bundle missing Siddharth Nagar');
  assert(!js.includes('addressLocality": "Hyderabad'), 'Edge bundle contains obsolete Hyderabad schema');
});

check('sitemap.xml is clean, canonical, and has zero 308-redirecting URLs', () => {
  const xml = fs.readFileSync(path.join(ROOT_DIR, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.strictEqual(locs.length, 138, `Sitemap must have exactly 138 URLs (found: ${locs.length})`);

  const badHtml = locs.filter(u => u.endsWith('.html') && !u.includes('course-detail.html'));
  assert.strictEqual(badHtml.length, 0, `Sitemap contains non-course .html URLs: ${badHtml.join(', ')}`);

  const badBlogParams = locs.filter(u => u.includes('blog-detail.html'));
  assert.strictEqual(badBlogParams.length, 0, `Sitemap contains blog-detail.html URLs: ${badBlogParams.join(', ')}`);

  const courses = locs.filter(u => u.includes('course-detail.html?id='));
  assert.strictEqual(courses.length, 109, `Sitemap must include all 109 courses (found: ${courses.length})`);
});

check('100% of 109 courses are reachable via static HTML anchor links', () => {
  const dataJs = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
  vm.runInThisContext(dataJs);
  const allCourseIds = new Set(NS_COURSES.map(c => c.id));
  const linkedCourses = new Set();

  function scanLinks(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(/\/course-detail\.html\?id=([a-zA-Z0-9_-]+)/g) || [];
    for (const m of matches) {
      const id = m.split('id=')[1];
      if (allCourseIds.has(id)) linkedCourses.add(id);
    }
  }

  scanLinks(path.join(ROOT_DIR, 'courses.html'));
  scanLinks(path.join(ROOT_DIR, 'index.html'));
  academySlugs.forEach(slug => {
    scanLinks(path.join(ROOT_DIR, 'academies', slug, 'index.html'));
  });

  assert.strictEqual(linkedCourses.size, allCourseIds.size, `Expected 109 linked courses, got ${linkedCourses.size}`);
});

// ----------------------------------------------------------------
// PHASE 3: LEAD ATTRIBUTION AUDIT
// ----------------------------------------------------------------
console.log('\n--- PHASE 3: CHATGPT LEAD ATTRIBUTION & GA4 SAFETY ---');

check('components.js exports initAttribution and getStoredAttribution', () => {
  const code = fs.readFileSync(path.join(ROOT_DIR, 'components.js'), 'utf8');
  assert(code.includes('function initAttribution'), 'components.js must declare initAttribution');
  assert(code.includes('function getStoredAttribution'), 'components.js must declare getStoredAttribution');
  assert(code.includes('ns_first_touch'), 'components.js must reference ns_first_touch');
  assert(code.includes('ns_last_touch'), 'components.js must reference ns_last_touch');
});

check('submitNovaForm includes first-touch attribution in Google Sheets payload', () => {
  const code = fs.readFileSync(path.join(ROOT_DIR, 'components.js'), 'utf8');
  assert(code.includes('firstTouchSource:'), 'Payload must include firstTouchSource');
  assert(code.includes('firstTouchMedium:'), 'Payload must include firstTouchMedium');
  assert(code.includes('firstTouchReferrer:'), 'Payload must include firstTouchReferrer');
  assert(code.includes('firstLandingPage:'), 'Payload must include firstLandingPage');
  assert(code.includes('aiPlatform:'), 'Payload must include aiPlatform');
});

check('GA4 generate_lead event includes non-PII attribution parameters', () => {
  const code = fs.readFileSync(path.join(ROOT_DIR, 'components.js'), 'utf8');
  assert(code.includes("traffic_source: resolvedUtmSource || 'direct'"), 'GA4 event must include traffic_source');
  assert(code.includes("traffic_medium: resolvedUtmMedium || 'none'"), 'GA4 event must include traffic_medium');
  assert(code.includes("ai_platform: detectedAi || 'none'"), 'GA4 event must include ai_platform');
  assert(code.includes("landing_page: landingPagePath"), 'GA4 event must include landing_page');
});

console.log('\n================================================================');
console.log(`FINAL RESULTS: ${passCount} / ${totalChecks} Checks Passed`);
console.log('================================================================\n');

if (passCount !== totalChecks) {
  process.exit(1);
} else {
  console.log('🎉 ALL AUDIT REMEDIATION REQUIREMENTS VALIDATED AND PASSING!\n');
}
