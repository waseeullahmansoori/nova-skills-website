'use strict';

/**
 * P0-5 AUTOMATED COURSE PRICING & GST DISCLOSURE VALIDATION SUITE
 * Validates:
 *   1. Canonical Pricing Data Integrity (all 109 courses in data/courses.json & data.js)
 *   2. Shared Pricing Presentation Layer (NovaCourseData methods)
 *   3. Absence of Contradictory GST Claims (Hero vs FAQ vs Catalog)
 *   4. Zero Unsupported Numerical Tax Amounts in Unverified Records
 *   5. Cross-Page Price Agreement (Catalog, Academies, Details, Pre-rendered Edge Bundle)
 *   6. Starting Price Claim Integrity (₹2,900 preserved across all entry points)
 *   7. EMI & Discount Percentage Consistency
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CourseData = require(path.join(ROOT, 'js', 'course-data.js'));

let passed = 0;
let failed = 0;
const errors = [];

function check(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    errors.push(message);
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

console.log('================================================================');
console.log('🧪 P0-5 AUTOMATED COURSE PRICING & GST DISCLOSURE VALIDATION');
console.log('================================================================\n');

// 1. Load canonical data
const coursesMaster = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'courses.json'), 'utf8')).courses;
const runtimeCourses = CourseData.getAllCourses();
const { NS_COURSES: dataJsCourses } = require(path.join(ROOT, 'data.js'));

check(coursesMaster.length === 109, `Master catalog contains exactly 109 courses (found ${coursesMaster.length})`);
check(runtimeCourses.length === 109, `NovaCourseData provides exactly 109 courses (found ${runtimeCourses.length})`);
check(dataJsCourses.length === 109, `data.js exports exactly 109 courses (found ${dataJsCourses.length})`);

// 2. Data Integrity Checks
const courseIdsSeen = new Set();
coursesMaster.forEach(c => {
  // Course ID uniqueness
  check(!courseIdsSeen.has(c.id), `${c.id}: unique course ID`);
  courseIdsSeen.add(c.id);

  const pricing = c.pricing;
  check(Boolean(pricing), `${c.id}: pricing object exists`);
  check(pricing.currency === 'INR', `${c.id}: currency is INR`);
  check(typeof pricing.currentPrice === 'number' && pricing.currentPrice >= 0, `${c.id}: valid currentPrice >= 0`);
  check(typeof pricing.originalPrice === 'number' && pricing.originalPrice >= pricing.currentPrice, `${c.id}: valid originalPrice >= currentPrice`);
  check(typeof pricing.regularPrice === 'number' && pricing.regularPrice === pricing.originalPrice, `${c.id}: regularPrice matches originalPrice`);
  check(typeof pricing.launchPrice === 'number' && pricing.launchPrice === pricing.currentPrice, `${c.id}: launchPrice matches currentPrice`);

  // Discount calculation
  if (pricing.originalPrice > pricing.currentPrice) {
    const expectedDiscount = Math.round(((pricing.originalPrice - pricing.currentPrice) / pricing.originalPrice) * 100);
    check(pricing.discountPercent === expectedDiscount, `${c.id}: discountPercent is accurate (${pricing.discountPercent}% vs expected ${expectedDiscount}%)`);
    check(pricing.discount?.percent === expectedDiscount, `${c.id}: discount.percent object matches`);
    check(pricing.discount?.displayEnabled === true, `${c.id}: discount display enabled`);
  } else {
    check(pricing.discountPercent === 0, `${c.id}: non-discounted course has 0% discount`);
  }

  // Tax treatment metadata
  const tax = pricing.tax || pricing.gst;
  check(Boolean(tax), `${c.id}: tax metadata present`);
  check(tax.rate === 18, `${c.id}: tax rate is 18%`);
  check(['pending-approval', 'requires-admin-confirmation', 'inclusive', 'exclusive'].includes(tax.treatment), `${c.id}: valid tax treatment enum`);

  // Unapproved tax treatment must NOT assert numerical payable or tax totals
  if (tax.treatment === 'pending-approval' || tax.treatment === 'requires-admin-confirmation') {
    check(pricing.payable?.taxAmount === null, `${c.id}: unapproved pricing taxAmount is null`);
    check(pricing.payable?.totalAmount === null, `${c.id}: unapproved pricing totalAmount is null`);
    check(pricing.gst?.totalWithExtraGst === null, `${c.id}: legacy totalWithExtraGst is null`);
  }
});

// 3. Shared Presentation Component Verification
console.log('\n--- Verifying Shared Pricing Presentation Component ---');
const testFullstack = CourseData.getCoursePricing('ai-assisted-full-stack-web-development');
check(testFullstack !== null, 'getCoursePricing resolves Full Stack');
check(testFullstack.currentPrice === 44900, 'Full Stack current price is 44900');
check(testFullstack.originalPrice === 64900, 'Full Stack original price is 64900');
check(testFullstack.discountPercent === 31, 'Full Stack discount is 31%');
check(testFullstack.tax.disclosure === CourseData.NEUTRAL_TAX_DISCLOSURE, 'Full Stack tax disclosure is neutral interim disclosure');

// Test calculation logic for hypothetical inclusive and exclusive treatments
const incTest = CourseData.calculateCourseTax({ launchPrice: 10000, tax: { treatment: 'inclusive', rate: 18 } });
check(incTest.totalPayable === 10000, 'Inclusive tax total payable equals advertised fee');
check(incTest.taxAmount === Math.round(10000 * 18 / 118), 'Inclusive tax amount computed via 18/118 integer rounding');

const excTest = CourseData.calculateCourseTax({ launchPrice: 10000, tax: { treatment: 'exclusive', rate: 18 } });
check(excTest.totalPayable === 11800, 'Exclusive tax total payable equals launchPrice + 18%');
check(excTest.taxAmount === 1800, 'Exclusive tax amount computed via fee * 0.18');

const pendingTest = CourseData.calculateCourseTax({ launchPrice: 10000, tax: { treatment: 'pending-approval', rate: 18 } });
check(pendingTest.totalPayable === null, 'Pending tax total payable is null');
check(pendingTest.taxAmount === null, 'Pending tax amount is null');

// 4. Absence of Contradictory GST Statements
console.log('\n--- Verifying Zero Contradictory GST Statements Across All 109 Courses ---');
coursesMaster.forEach(c => {
  const detailPaths = [
    path.join(ROOT, 'data', 'courses', c.id + '.json'),
    path.join(ROOT, 'data', 'curricula', c.id + '.json')
  ];

  detailPaths.forEach(dp => {
    if (!fs.existsSync(dp)) return;
    const detail = JSON.parse(fs.readFileSync(dp, 'utf8'));
    (detail.faq || []).forEach(f => {
      const text = (f.question || '') + ' ' + (f.answer || '');
      check(!/statutory 18% gst extra/i.test(text), `${c.id} (${path.basename(dp)}): zero "statutory 18% GST extra" claims in FAQ`);
      check(!/total payable fee is ₹[\d,]+/i.test(text), `${c.id} (${path.basename(dp)}): zero contradictory "total payable fee is ₹..." calculations`);
      check(!/bringing the total payable amount to/i.test(text), `${c.id} (${path.basename(dp)}): zero contradictory "bringing the total payable amount to..." calculations`);
    });
  });

  // Pre-rendered HTML check
  const renderedHtmlPath = path.join(ROOT, '_rendered_courses', c.id + '.html');
  if (fs.existsSync(renderedHtmlPath)) {
    const html = fs.readFileSync(renderedHtmlPath, 'utf8');
    check(!html.includes('18% GST included'), `${c.id}: pre-rendered HTML does not assert "18% GST included"`);
    check(!html.includes('18% GST extra'), `${c.id}: pre-rendered HTML does not assert "18% GST extra"`);
    check(!html.includes('76,582') && !html.includes('52,982') && !html.includes('32,922') && !html.includes('17,582'),
      `${c.id}: pre-rendered HTML does not contain conflicting unapproved total amounts`);
  }
});

// 5. Four Mandatory Regression Cases
console.log('\n--- Verifying 4 Mandatory Regression Cases ---');
const mandatoryCases = [
  { id: 'ai-mastery', regular: 89900, launch: 64900, discount: 28 },
  { id: 'ai-assisted-full-stack-web-development', regular: 64900, launch: 44900, discount: 31 },
  { id: 'ecommerce-growth-marketing-specialist', regular: 34900, launch: 27900, discount: 20 },
  { id: 'career-launch-placement-readiness-professional', regular: 19900, launch: 14900, discount: 25 }
];

mandatoryCases.forEach(mc => {
  const c = CourseData.getCourseById(mc.id);
  check(c !== null, `${mc.id}: course exists in canonical registry`);
  check(c.price === mc.launch, `${mc.id}: launch fee is ₹${mc.launch.toLocaleString('en-IN')}`);
  check(c.originalPrice === mc.regular, `${mc.id}: regular fee is ₹${mc.regular.toLocaleString('en-IN')}`);
  check(c.discount === mc.discount, `${mc.id}: discount is ${mc.discount}%`);

  const pricing = CourseData.getCoursePricing(mc.id);
  check(pricing.tax.disclosure.includes('clearly displayed before payment'), `${mc.id}: pricing disclosure is neutral`);

  const renderedHtml = fs.readFileSync(path.join(ROOT, '_rendered_courses', mc.id + '.html'), 'utf8');
  check(renderedHtml.includes(`₹${mc.launch.toLocaleString('en-IN')}`), `${mc.id}: pre-rendered page contains launch price ₹${mc.launch.toLocaleString('en-IN')}`);
  check(renderedHtml.includes(`₹${mc.regular.toLocaleString('en-IN')}`), `${mc.id}: pre-rendered page contains regular price ₹${mc.regular.toLocaleString('en-IN')}`);
  check(renderedHtml.includes('The final payable amount, including any applicable taxes, will be clearly displayed before payment.'), `${mc.id}: pre-rendered page contains neutral tax disclosure`);
});

// 6. Starting Price Claim Integrity (₹2,900)
console.log('\n--- Verifying Starting Price Claim Integrity ---');
check(CourseData.APPROVED_STARTING_PRICE === 2900, 'NovaCourseData APPROVED_STARTING_PRICE is 2900');
check(CourseData.getCanonicalStartingPrice() === 2900, 'getCanonicalStartingPrice returns 2900');

const coursesHtml = fs.readFileSync(path.join(ROOT, 'courses.html'), 'utf8');
check(coursesHtml.includes('₹2,900') || coursesHtml.includes('2900'), 'courses.html preserves starting price ₹2,900');

console.log('\n================================================================');
console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================\n');

if (failed > 0) {
  console.error(`Total failures: ${failed}`);
  process.exit(1);
} else {
  console.log('✅ ALL COURSE PRICING AND GST DISCLOSURE CHECKS PASSED PERFECTLY!');
}
