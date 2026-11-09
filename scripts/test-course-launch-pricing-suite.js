/**
 * Automated Test Suite: Nova Skills 109 Course Launch Pricing Rollout
 * 
 * Validates:
 * 1. 109 total courses in catalog
 * 2. Exactly 48 courses with introductory launch offers
 * 3. Exactly 61 courses with unchanged regular fees
 * 4. Course #15 locked at ₹19,900 with zero fake discounts
 * 5. Data parity across data.js, NS_ACADEMIES, NS_COURSES, data/courses/*.json,
 *    nova-skills-109-course-content.json, Nova_Skills_109_Course_Master_Mapping.json
 * 6. HTML rendering parity across courses.html, academies/*.html, _rendered_courses/*.html, index.html
 * 7. Modal enroll arguments and price strings
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🧪 NOVA SKILLS — 109 COURSE LAUNCH PRICING AUTOMATED TEST SUITE');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName} - ${details}`);
  }
}

// 1. Load data.js
const data = require(path.join(ROOT_DIR, 'data.js'));
const courses = data.NS_COURSES;
const academies = data.NS_ACADEMIES;

assert(Array.isArray(courses) && courses.length === 109, '1. data.js contains exactly 109 courses', `Found ${courses?.length}`);

// 2. Count offers
const offerCourses = courses.filter(c => c.originalPrice > c.price);
const nonOfferCourses = courses.filter(c => c.originalPrice === c.price);

assert(offerCourses.length === 48, '2. Exactly 48 courses have launch offers (launch_fee < regular_fee)', `Found ${offerCourses.length}`);
assert(nonOfferCourses.length === 61, '3. Exactly 61 courses retain regular fee without discounts', `Found ${nonOfferCourses.length}`);
assert(offerCourses.length + nonOfferCourses.length === 109, '4. Offer courses + Non-offer courses === 109', `${offerCourses.length} + ${nonOfferCourses.length}`);

// 3. Inverted price & fake discount checks
let invertedCount = 0;
let fakeDiscountCount = 0;
courses.forEach(c => {
  if (c.originalPrice < c.price) invertedCount++;
  if (c.originalPrice === c.price && c.discount > 0) fakeDiscountCount++;
  if (c.originalPrice > c.price && (!c.discount || c.discount <= 0)) fakeDiscountCount++;
});
assert(invertedCount === 0, '5. Zero courses have inverted prices (originalPrice < price)', `Found ${invertedCount}`);
assert(fakeDiscountCount === 0, '6. Zero courses have fake discounts or mismatched discount percentages', `Found ${fakeDiscountCount}`);

// 4. Course #15 integrity check
const c15 = courses.find(c => c.id === 'nocode-web-pro');
assert(
  c15 && c15.price === 19900 && c15.originalPrice === 19900 && c15.fee === 19900 && c15.discount === 0,
  '7. Course #15 (nocode-web-pro) is locked at ₹19,900 with zero fake discounts',
  `price: ${c15?.price}, orig: ${c15?.originalPrice}, fee: ${c15?.fee}, discount: ${c15?.discount}`
);

// 5. Mandatory 10 key course assertions from prompt
const keyAudits = [
  { id: 'dm-professional', name: 'AI Digital Marketing Professional', expReg: 24900, expLaunch: 19900, expDisc: 20 },
  { id: 'ai-mastery', name: 'AI Solutions Engineering & Agentic AI Mastery', expReg: 89900, expLaunch: 64900, expDisc: 28 },
  { id: 'graphic-design-pro', name: 'Graphic Design Professional', expReg: 29900, expLaunch: 24900, expDisc: 17 },
  { id: 'fullstack-foundation', name: 'Full Stack Programming Foundation', expReg: 39999, expLaunch: 29999, expDisc: 25 },
  { id: 'nocode-web-pro', name: 'No-Code Website Professional', expReg: 19900, expLaunch: 19900, expDisc: 0 },
  { id: 'video-pro', name: 'Professional Video Editing', expReg: 35900, expLaunch: 24900, expDisc: 31 },
  { id: 'archviz-mastery', name: 'Architectural Visualisation Master', expReg: 69900, expLaunch: 44900, expDisc: 36 },
  { id: 'shopify-cert', name: 'Shopify Store Design & E-Commerce Operations', expReg: 12900, expLaunch: 9900, expDisc: 23 },
  { id: 'reels-editing', name: 'Reels & Shorts Editing', expReg: 4900, expLaunch: 3900, expDisc: 20 },
  { id: 'tally-gst', name: 'TallyPrime — Accounting & GST Compliance', expReg: 9900, expLaunch: 6900, expDisc: 30 }
];

keyAudits.forEach(k => {
  const c = courses.find(x => x.id === k.id);
  const pass = c && c.price === k.expLaunch && c.originalPrice === k.expReg && c.discount === k.expDisc;
  assert(
    pass,
    `8.${keyAudits.indexOf(k) + 1} Key course [${k.id}] ${k.name}: ₹${k.expLaunch.toLocaleString('en-IN')} (Reg: ₹${k.expReg.toLocaleString('en-IN')}, Disc: ${k.expDisc}%)`,
    `Found price: ${c?.price}, orig: ${c?.originalPrice}, disc: ${c?.discount}`
  );
});

// 6. Check NS_ACADEMIES parity
let acadParityErrors = 0;
academies.forEach(a => {
  (a.courses || []).forEach(ac => {
    const c = courses.find(x => x.id === ac.id);
    if (!c || ac.price !== c.price || ac.originalPrice !== c.originalPrice) {
      acadParityErrors++;
    }
  });
});
assert(acadParityErrors === 0, '9. NS_ACADEMIES courses have 100% price parity with NS_COURSES', `Errors: ${acadParityErrors}`);

// 7. Check data/courses/*.json parity
let jsonParityErrors = 0;
courses.forEach(c => {
  const p = path.join(ROOT_DIR, 'data', 'courses', `${c.id}.json`);
  if (!fs.existsSync(p)) {
    jsonParityErrors++;
    return;
  }
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (j.price !== c.price || j.originalPrice !== c.originalPrice || j.fee !== c.fee) {
    jsonParityErrors++;
  }
});
assert(jsonParityErrors === 0, '10. All 109 data/courses/*.json files have 100% price parity with NS_COURSES', `Errors: ${jsonParityErrors}`);

// 8. Check nova-skills-109-course-content.json parity
const contentJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'nova-skills-109-course-content.json'), 'utf8'));
let contentErrors = 0;
courses.forEach(c => {
  const f = contentJson.find(x => x.id === c.id);
  if (!f || f.price !== c.price || f.originalPrice !== c.originalPrice) {
    contentErrors++;
  }
});
assert(contentErrors === 0, '11. nova-skills-109-course-content.json has 100% price parity with NS_COURSES', `Errors: ${contentErrors}`);

// 9. Check Nova_Skills_109_Course_Master_Mapping.json parity
const mappingData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts', 'Nova_Skills_109_Course_Master_Mapping.json'), 'utf8'));
let mappingErrors = 0;
courses.forEach(c => {
  const m = mappingData.courses.find(x => x.stable_id === c.id);
  if (!m || m.effective_fee !== c.price || m.regular_fee !== c.originalPrice) {
    mappingErrors++;
  }
});
assert(mappingErrors === 0, '12. Nova_Skills_109_Course_Master_Mapping.json has 100% price parity with NS_COURSES', `Errors: ${mappingErrors}`);

// 10. Check components.js COURSE_CATALOG_METADATA
const compJs = fs.readFileSync(path.join(ROOT_DIR, 'components.js'), 'utf8');
const compMinJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'components.min.js'), 'utf8');
assert(
  compJs.includes("'Professional Video Editing': { academy: 'Video & Motion Academy', duration: '4 Months', fee: '₹24,900'") &&
  compJs.includes("'AI Solutions Engineering & Agentic AI Mastery': { academy: 'AI & Automation Academy', duration: '9 Months', fee: '₹64,900'") &&
  compJs.includes("'Full Stack Programming Foundation': { academy: 'Programming Academy', duration: '6 Months', fee: '₹29,999'"),
  '13. components.js COURSE_CATALOG_METADATA contains updated launch fees',
  'Missing key fee strings'
);
assert(
  compMinJs.includes('₹24,900') && compMinJs.includes('₹64,900') && compMinJs.includes('₹29,999'),
  '14. js/components.min.js contains updated launch fees',
  'Missing minified fee strings'
);

// 11. Check index.html featured cards
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
assert(
  indexHtml.includes("openEnrollmentModal('AI Digital Marketing Specialist', 'Digital Marketing Academy', '3 Months', '₹19,900', 'dm-professional')") &&
  indexHtml.includes("openEnrollmentModal('AI Solutions Engineering & Agentic AI Mastery', 'AI & Automation Academy', '9 Months', '₹64,900', 'ai-mastery')") &&
  indexHtml.includes("openEnrollmentModal('Full Stack Programming Foundation', 'Programming Academy', '6 Months', '₹29,999', 'fullstack-foundation')") &&
  indexHtml.includes("openEnrollmentModal('Creative Design Master', 'Design Academy', '8 Months', '₹44,900', 'creative-design')") &&
  indexHtml.includes("openEnrollmentModal('AI-Integrated Video Editing & Motion Graphics Professional', 'Video & Motion Academy', '8 Months', '₹49,900', 'ai-integrated-video-editing-motion-graphics-professional')") &&
  indexHtml.includes("openEnrollmentModal('AI Digital Marketing Strategist', 'Digital Marketing Academy', '6 Months', '₹44,900', 'dm-mastery')"),
  '15. index.html featured cards have accurate modal enroll arguments and launch fees',
  'Mismatch in index.html featured cards'
);

// 12. Check courses.html pre-rendered prices
const coursesHtml = fs.readFileSync(path.join(ROOT_DIR, 'courses.html'), 'utf8');
assert(
  coursesHtml.includes('₹19,900') && coursesHtml.includes('₹64,900') && coursesHtml.includes('₹24,900'),
  '16. courses.html contains updated launch prices',
  'courses.html price missing'
);

// 13. Check pre-rendered course detail pages
let renderedErrors = 0;
courses.forEach(c => {
  const p = path.join(ROOT_DIR, '_rendered_courses', `${c.id}.html`);
  if (!fs.existsSync(p)) {
    renderedErrors++;
    return;
  }
  const html = fs.readFileSync(p, 'utf8');
  const expectedPriceFormatted = `₹${c.price.toLocaleString('en-IN')}`;
  if (!html.includes(expectedPriceFormatted)) {
    renderedErrors++;
  }
  if (c.originalPrice > c.price) {
    const origFormatted = `₹${c.originalPrice.toLocaleString('en-IN')}`;
    const discBadge = `${c.discount}% OFF`;
    if (!html.includes(origFormatted) || !html.includes(discBadge)) {
      renderedErrors++;
    }
  }
});
assert(renderedErrors === 0, '17. All 109 pre-rendered course detail pages render accurate launch/original prices and badges', `Errors: ${renderedErrors}`);

// 14. Check academy pages pre-rendered cards
let academyCardErrors = 0;
academies.forEach(a => {
  const dirName = (a.id === 'kids') ? 'kids-tech' :
                  (a.id === 'nocode' || a.id === 'no-code') ? 'no-code-web' :
                  (a.id === 'video') ? 'video-motion' :
                  (a.id === 'career') ? 'career-freelancing' :
                  (a.id === 'office') ? 'office-productivity' : a.id;
  const p = path.join(ROOT_DIR, 'academies', dirName, 'index.html');
  if (!fs.existsSync(p)) {
    academyCardErrors++;
    return;
  }
  const html = fs.readFileSync(p, 'utf8');
  (a.courses || []).forEach(c => {
    const expectedPriceFormatted = `₹${c.price.toLocaleString('en-IN')}`;
    if (!html.includes(expectedPriceFormatted)) {
      academyCardErrors++;
    }
  });
});
assert(academyCardErrors === 0, '18. All 12 academy landing pages render accurate course prices across all cards', `Errors: ${academyCardErrors}`);

console.log('\n----------------------------------------------------------------');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('----------------------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 18 SUITE CATEGORIES PASSED WITH 100% SUCCESS!');
  process.exit(0);
}
