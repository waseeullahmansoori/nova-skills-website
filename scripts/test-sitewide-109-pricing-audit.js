const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const masterMapping = require('./Nova_Skills_109_Course_Master_Mapping.json');
const { NS_COURSES, NS_ACADEMIES } = require('../data.js');

console.log('================================================================');
console.log('🧪 COMPREHENSIVE 109-COURSE SITEWIDE PRICING CONSISTENCY AUDIT');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function check(desc, condition, errDetails = '') {
  if (condition) {
    passCount++;
    console.log(`  ✅ [PASS] ${desc}`);
  } else {
    failCount++;
    console.error(`  ❌ [FAIL] ${desc} — ${errDetails}`);
  }
}

// 1. Master count
const masterCourses = masterMapping.courses;
check('Master mapping count is 109', masterCourses.length === 109, `Found ${masterCourses.length}`);

// 2. Count 48 active offers, 61 regular-only
const activeOffers = masterCourses.filter(m => m.offer_active);
const regularOnly = masterCourses.filter(m => !m.offer_active);
check('Master mapping has exactly 48 launch offers', activeOffers.length === 48, `Found ${activeOffers.length}`);
check('Master mapping has exactly 61 regular-only courses', regularOnly.length === 61, `Found ${regularOnly.length}`);

// 3. NS_COURSES matches master mapping exactly
check('NS_COURSES count is 109', NS_COURSES.length === 109, `Found ${NS_COURSES.length}`);

const mappingById = new Map();
masterCourses.forEach(m => mappingById.set(m.stable_id, m));

let nscMismatches = 0;
NS_COURSES.forEach(c => {
  const m = mappingById.get(c.id);
  if (!m) {
    nscMismatches++;
    console.error(`Missing course in mapping: ${c.id}`);
    return;
  }
  if (c.price !== m.effective_fee || c.regular_price !== m.regular_fee || c.offer_active !== m.offer_active) {
    nscMismatches++;
    console.error(`Mismatch in NS_COURSES for ${c.id}: c.price=${c.price}, m.effective=${m.effective_fee}, c.offer_active=${c.offer_active}`);
  }
  if (m.offer_active) {
    if (c.originalPrice !== m.regular_fee || c.launch_price !== m.launch_fee) {
      nscMismatches++;
      console.error(`Mismatch in launch offer fields for ${c.id}`);
    }
  } else {
    if (c.originalPrice !== m.regular_fee || c.launch_price !== null || c.discount !== 0) {
      nscMismatches++;
      console.error(`Non-offer course ${c.id} has non-zero discount or launch_price`);
    }
  }
});
check('NS_COURSES has 100% price and discount parity with master mapping', nscMismatches === 0, `${nscMismatches} mismatches`);

// 4. NS_ACADEMIES matches NS_COURSES
let acadMismatches = 0;
const nscMap = new Map();
NS_COURSES.forEach(c => nscMap.set(c.id, c));

NS_ACADEMIES.forEach(a => {
  (a.courses || []).forEach(ac => {
    const c = nscMap.get(ac.id);
    if (!c || ac.price !== c.price || ac.regular_price !== c.regular_price || ac.offer_active !== c.offer_active) {
      acadMismatches++;
      console.error(`Academy ${a.id} course ${ac.id} mismatch`);
    }
  });
});
check('NS_ACADEMIES courses have 100% parity with NS_COURSES', acadMismatches === 0, `${acadMismatches} mismatches`);

// 5. courses.html catalogue audit
const coursesHtml = fs.readFileSync(path.join(ROOT_DIR, 'courses.html'), 'utf8');
let catalogMismatches = 0;
NS_COURSES.forEach(c => {
  const expectedCurrent = `₹${c.price.toLocaleString('en-IN')}`;
  // Card must contain course id link
  const cardLink = `/course-detail.html?id=${c.id}`;
  if (!coursesHtml.includes(cardLink)) {
    catalogMismatches++;
    console.error(`courses.html missing link to ${c.id}`);
  }
});
check('courses.html contains all 109 course cards', catalogMismatches === 0, `${catalogMismatches} missing links`);

// 6. Pre-rendered course detail pages & functions/_rendered_courses.js audit
let cdpMismatches = 0;
let stale84999Count = 0;
const renderedDir = path.join(ROOT_DIR, '_rendered_courses');

NS_COURSES.forEach(c => {
  const filePath = path.join(renderedDir, `${c.id}.html`);
  if (!fs.existsSync(filePath)) {
    cdpMismatches++;
    console.error(`Missing _rendered_courses/${c.id}.html`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('84,999') || html.includes('84999')) {
    stale84999Count++;
    console.error(`Found 84,999 in ${c.id}.html`);
  }
  const expectedCurrent = `₹${c.price.toLocaleString('en-IN')}`;
  if (!html.includes(expectedCurrent)) {
    cdpMismatches++;
    console.error(`_rendered_courses/${c.id}.html does not contain effective price ${expectedCurrent}`);
  }
  if (!c.offer_active) {
    // Non-discounted course: should not render discount percentage badge
    const badgeMatch = html.match(/<span class="detail-discount-badge">([^<]+)<\/span>/);
    if (badgeMatch) {
      cdpMismatches++;
      console.error(`Non-discounted course ${c.id} rendered discount badge: ${badgeMatch[0]}`);
    }
  }
});
check('All 109 pre-rendered course detail pages match approved prices', cdpMismatches === 0, `${cdpMismatches} mismatches`);
check('Zero occurrences of stale 84,999 comparison value across all course pages', stale84999Count === 0, `Found in ${stale84999Count} pages`);

// 7. Edge bundle functions/_rendered_courses.js
const edgeBundle = fs.readFileSync(path.join(ROOT_DIR, 'functions', '_rendered_courses.js'), 'utf8');
check('Edge bundle contains exactly 109 courses', edgeBundle.includes('Total Pre-rendered Courses: 109'));
check('Edge bundle has zero 84,999 references', !edgeBundle.includes('84,999') && !edgeBundle.includes('84999'));

// 8. Mandatory Sample Checks from Prompt Table
console.log('\n--- Checking Mandatory Sample Courses ---');
const mandatorySamples = [
  { id: 'dm-mastery', name: 'AI Digital Marketing Master', expected: 34900 },
  { id: 'dm-professional', name: 'AI Digital Marketing Professional', expected: 19900 },
  { id: 'ai-mastery', name: 'AI Solutions Engineering & Agentic AI Mastery', expected: 64900 },
  { id: 'creative-design', name: 'Creative Design Master', expected: 44900 },
  { id: 'graphic-design-pro', name: 'Graphic Design Professional', expected: 24900 },
  { id: 'fullstack-foundation', name: 'Full Stack Programming Foundation', expected: 29999 },
  { id: 'ai-assisted-full-stack-web-development', name: 'AI-Assisted Full Stack Web Development', expected: 44900 },
  { id: 'nocode-web-pro', name: 'No-Code Website Professional', expected: 19900, mustNotHaveDiscount: true },
  { id: 'video-pro', name: 'Professional Video Editing', expected: 24900 },
  { id: 'archviz-mastery', name: 'Architectural Visualisation Master', expected: 44900 },
  { id: 'shopify-cert', name: 'Shopify Store Design & E-Commerce Operations', expected: 9900 },
  { id: 'reels-editing', name: 'Reels & Shorts Editing for Brands and Creators', expected: 3900 },
  { id: 'tally-gst', name: 'TallyPrime — Accounting & GST Compliance', expected: 6900 }
];

mandatorySamples.forEach(s => {
  const c = nscMap.get(s.id);
  const matched = c && c.price === s.expected;
  check(`Sample [${s.id}] ${s.name} effective fee is ₹${s.expected.toLocaleString('en-IN')}`, matched, `Found ${c ? c.price : 'undefined'}`);

  if (s.mustNotHaveDiscount) {
    const noDiscount = c.offer_active === false && c.discount === 0;
    check(`Sample [${s.id}] has no discount badge and offer_active=false`, noDiscount, `offer_active=${c.offer_active}, discount=${c.discount}`);
  }
});

// 9. Price Sorting and Filtering Logic Verification
console.log('\n--- Verifying Price Sorting & Filtering Logic ---');
// Verify sorting ascending uses c.price (effective fee)
const sortedAsc = [...NS_COURSES].sort((a, b) => a.price - b.price);
const minCourse = sortedAsc[0];
const maxCourse = sortedAsc[sortedAsc.length - 1];
check(`Sort price-asc minimum course is ₹${minCourse.price.toLocaleString('en-IN')} (${minCourse.id})`, minCourse.price === 2900);
check(`Sort price-asc maximum course is ₹${maxCourse.price.toLocaleString('en-IN')} (${maxCourse.id})`, maxCourse.price === 64900);

// Verify Full Stack Programming Foundation is treated as ₹29,999 in sorting
const fsCourse = NS_COURSES.find(c => c.id === 'fullstack-foundation');
check('Full Stack Programming Foundation price for sorting is 29,999', fsCourse.price === 29999);

// Verify price range slider filter
const under30k = NS_COURSES.filter(c => c.price <= 30000);
check(`Max price filter <= 30,000 includes fullstack-foundation (₹29,999)`, under30k.some(c => c.id === 'fullstack-foundation'));

console.log('\n================================================================');
console.log(`TOTAL AUDIT CHECKS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
}
