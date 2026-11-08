const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    testsFailed++;
  }
}

console.log('=== STEP 01 QA TEST SUITE: COURSE-DETAIL PRICING SIDEBAR & DEMO PROMOTION ===\n');

// Test 1: CSS Scoped Rules in css/course-detail.css
console.log('Test 1: Scoped CSS in css/course-detail.css');
const courseDetailCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'course-detail.css'), 'utf8');
assert(courseDetailCss.includes('.demo-benefit-icon-wrap'), 'css/course-detail.css contains .demo-benefit-icon-wrap');
assert(courseDetailCss.includes('.detail-demo-benefit-box'), 'css/course-detail.css contains .detail-demo-benefit-box');
assert(courseDetailCss.includes('.btn-book-demo-secondary'), 'css/course-detail.css contains .btn-book-demo-secondary');
assert(courseDetailCss.includes('38px !important'), 'css/course-detail.css enforces 38px icon container');
assert(courseDetailCss.includes('20px !important'), 'css/course-detail.css enforces 20px icon size');

// Test 2: CSS in styles.css & minified CSS
console.log('\nTest 2: Stylesheets synchronization');
const stylesCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');
const stylesMinCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'styles.min.css'), 'utf8');
assert(stylesCss.includes('.demo-benefit-icon-wrap'), 'styles.css contains .demo-benefit-icon-wrap');
assert(stylesMinCss.includes('demo-benefit-icon-wrap'), 'css/styles.min.css contains demo-benefit-icon-wrap');

// Test 3: HTML Markup in course-detail.html
console.log('\nTest 3: HTML structure in course-detail.html');
const courseDetailHtml = fs.readFileSync(path.join(ROOT_DIR, 'course-detail.html'), 'utf8');
assert(courseDetailHtml.includes('class="demo-benefit-icon-wrap"'), 'course-detail.html has icon wrapper container');
assert(courseDetailHtml.includes('width="20" height="20"'), 'course-detail.html specifies explicit SVG width & height');
assert(courseDetailHtml.includes('style="width:20px;height:20px;max-width:20px;max-height:20px;display:block;"'), 'course-detail.html has inline SVG dimension fallback');
assert(courseDetailHtml.includes('Book Your Free Demo'), 'course-detail.html has updated "Book Your Free Demo" text');
assert(courseDetailHtml.includes('Enroll Now — Book Seat'), 'course-detail.html preserves primary Enroll Now button');
assert(courseDetailHtml.includes('Request Callback / Syllabus'), 'course-detail.html preserves Request Callback button');
assert(courseDetailHtml.includes('course-detail.css?v=2.3.0'), 'course-detail.html has bumped cache query to v=2.3.0');

// Test 4: Verify All 109 Pre-rendered Course Pages
console.log('\nTest 4: Verify All 109 _rendered_courses/*.html files');
const renderedDir = path.join(ROOT_DIR, '_rendered_courses');
const htmlFiles = fs.readdirSync(renderedDir).filter(f => f.endsWith('.html') && f !== '404.html');
assert(htmlFiles.length === 109, `Found exactly 109 pre-rendered course pages (found ${htmlFiles.length})`);

let allHaveIconWrap = true;
let allHaveExplicitSvg = true;
let allHaveBookDemo = true;
let allHaveEnroll = true;
let allHaveCallback = true;
let allHaveZeroOrphan1to1 = true;

for (const f of htmlFiles) {
  const content = fs.readFileSync(path.join(renderedDir, f), 'utf8');
  if (!content.includes('demo-benefit-icon-wrap')) allHaveIconWrap = false;
  if (!content.includes('width="20" height="20"')) allHaveExplicitSvg = false;
  if (!content.includes('Book Your Free Demo')) allHaveBookDemo = false;
  if (!content.includes('Enroll Now — Book Seat')) allHaveEnroll = false;
  if (!content.includes('Request Callback / Syllabus')) allHaveCallback = false;
  
  // Check for orphan duplicate 1:1 items
  const occurrences = (content.match(/detail-1to1-item/g) || []).length;
  if (occurrences > 1) {
    allHaveZeroOrphan1to1 = false;
  }
}

assert(allHaveIconWrap, 'All 109 pre-rendered courses have .demo-benefit-icon-wrap');
assert(allHaveExplicitSvg, 'All 109 pre-rendered courses have explicit SVG dimensions');
assert(allHaveBookDemo, 'All 109 pre-rendered courses have "Book Your Free Demo" secondary CTA');
assert(allHaveEnroll, 'All 109 pre-rendered courses have "Enroll Now — Book Seat" primary CTA');
assert(allHaveCallback, 'All 109 pre-rendered courses have "Request Callback / Syllabus" tertiary CTA');
assert(allHaveZeroOrphan1to1, 'All 109 pre-rendered courses have zero duplicate 1:1 items');

// Test 5: Verify Edge Functions bundle
console.log('\nTest 5: Edge functions bundle');
const edgeBundle = fs.readFileSync(path.join(ROOT_DIR, 'functions', '_rendered_courses.js'), 'utf8');
assert(edgeBundle.includes('demo-benefit-icon-wrap'), 'functions/_rendered_courses.js contains demo-benefit-icon-wrap');
assert(edgeBundle.includes('Book Your Free Demo'), 'functions/_rendered_courses.js contains Book Your Free Demo');

// Test 6: Verify Reference Course archviz-mastery
console.log('\nTest 6: Reference course archviz-mastery integrity');
const archvizHtml = fs.readFileSync(path.join(renderedDir, 'archviz-mastery.html'), 'utf8');
assert(archvizHtml.includes('₹69,900'), 'archviz-mastery displays approved price ₹69,900');
assert(archvizHtml.includes('8 Months (320 Hours)'), 'archviz-mastery displays approved duration 8 Months (320 Hours)');

// Test 7: Verify Course #15 nocode-web-pro
console.log('\nTest 7: Course #15 pricing lock');
const nocodeHtml = fs.readFileSync(path.join(renderedDir, 'nocode-web-pro.html'), 'utf8');
assert(nocodeHtml.includes('₹19,900'), 'nocode-web-pro displays locked price ₹19,900');

console.log('\n========================================');
console.log(`TOTAL TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
console.log('========================================');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL STEP 01 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY!\n');
}
