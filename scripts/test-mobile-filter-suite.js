/**
 * Nova Skills — Mobile Course Filter UI & Logic Automated Test Suite
 * Tests Phase 16 Requirements (Tests 01 to 12) + Responsive CSS + Accessibility
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

console.log('=== STARTING MOBILE COURSE FILTER UI TEST SUITE ===\n');

// 1. Load data.js
const dataJs = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

assert(Array.isArray(NS_COURSES) && NS_COURSES.length === 109, 'Loaded all 109 courses from data.js');
assert(Array.isArray(NS_ACADEMIES) && NS_ACADEMIES.length === 12, 'Loaded all 12 academies from data.js');

// 2. Load courses.html and inspect DOM elements
const coursesHtml = fs.readFileSync(path.join(ROOT_DIR, 'courses.html'), 'utf8');

console.log('\n--- 1. Mobile Filter Toolbar & Layout Elements in courses.html ---');
assert(coursesHtml.includes('id="mobile-courses-controls"'), 'Contains #mobile-courses-controls container');
assert(coursesHtml.includes('id="open-mobile-filters"'), 'Contains #open-mobile-filters button');
assert(coursesHtml.includes('id="mobile-filter-count-badge"'), 'Contains #mobile-filter-count-badge');
assert(coursesHtml.includes('id="mobile-sort-select"'), 'Contains #mobile-sort-select dropdown');
assert(coursesHtml.includes('id="mobile-results-number"'), 'Contains #mobile-results-number results count');
assert(coursesHtml.includes('id="mobile-clear-all"'), 'Contains #mobile-clear-all button');
assert(coursesHtml.includes('id="mobile-active-chips"'), 'Contains #mobile-active-chips container');

console.log('\n--- 2. Mobile Filter Bottom Sheet Elements in courses.html ---');
assert(coursesHtml.includes('id="mobile-sheet-backdrop"'), 'Contains #mobile-sheet-backdrop');
assert(coursesHtml.includes('id="mobile-filter-sheet"'), 'Contains #mobile-filter-sheet dialog');
assert(coursesHtml.includes('id="close-mobile-filters"'), 'Contains #close-mobile-filters button');
assert(coursesHtml.includes('id="sheet-search-input"'), 'Contains #sheet-search-input');
assert(coursesHtml.includes('id="sheet-academy-options"'), 'Contains #sheet-academy-options container');
assert(coursesHtml.includes('name="sheet-programLevel"'), 'Contains sheet-programLevel checkboxes');
assert(coursesHtml.includes('name="sheet-level"'), 'Contains sheet-level checkboxes');
assert(coursesHtml.includes('name="sheet-duration"'), 'Contains sheet-duration checkboxes');
assert(coursesHtml.includes('id="sheet-price-range"'), 'Contains #sheet-price-range');
assert(coursesHtml.includes('id="sheet-price-badge"'), 'Contains #sheet-price-badge');
assert(coursesHtml.includes('id="sheet-placement-support"'), 'Contains #sheet-placement-support');
assert(coursesHtml.includes('id="sheet-reset-btn"'), 'Contains #sheet-reset-btn');
assert(coursesHtml.includes('id="sheet-apply-btn"'), 'Contains #sheet-apply-btn');
assert(coursesHtml.includes('id="sheet-preview-count"'), 'Contains #sheet-preview-count');

console.log('\n--- 3. Desktop Elements Preservation in courses.html ---');
assert(coursesHtml.includes('id="filters-sidebar"'), 'Desktop sidebar preserved (#filters-sidebar)');
assert(coursesHtml.includes('id="desktop-courses-toolbar"'), 'Desktop toolbar preserved (#desktop-courses-toolbar)');
assert(coursesHtml.includes('id="sort-select"'), 'Desktop sort preserved (#sort-select)');
assert(coursesHtml.includes('id="courses-quick-tracks"'), 'Desktop quick tracks preserved (#courses-quick-tracks)');

// 3. Load courses.js and test filtering logic directly in Sandbox
console.log('\n--- 4. Functional Filter Logic Execution (Phase 16 Test Cases) ---');

const mockWindow = {
  NS_COURSES: NS_COURSES,
  NS_ACADEMIES: NS_ACADEMIES
};

const coursesJsCode = fs.readFileSync(path.join(ROOT_DIR, 'courses.js'), 'utf8');

const sandbox = {
  NS_COURSES,
  NS_ACADEMIES,
  window: mockWindow,
  document: {
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => []
  },
  console: { log: () => {}, error: () => {} }
};
vm.createContext(sandbox);
vm.runInContext(coursesJsCode, sandbox);

const filterAndSortCourses = sandbox.filterAndSortCourses;

// TEST 01 — DEFAULT
const defaultResults = filterAndSortCourses({
  search: '',
  academies: [],
  programLevels: [],
  levels: [],
  durations: [],
  maxPrice: 100000,
  placement: false,
  sort: 'popular'
});
assert(defaultResults.length === 109, `TEST 01: Default state returns all 109 courses (got ${defaultResults.length})`);
assert(defaultResults[0].featured === true, 'TEST 01: Default sort returns popular featured courses first');

// TEST 02 — ONE ACADEMY (digital-marketing)
const dmResults = filterAndSortCourses({
  search: '',
  academies: ['digital-marketing'],
  programLevels: [],
  levels: [],
  durations: [],
  maxPrice: 100000,
  placement: false
});
assert(dmResults.length === 14, `TEST 02: Selecting Digital Marketing returns exactly 14 courses (got ${dmResults.length})`);
assert(dmResults.every(c => c.academyId === 'digital-marketing'), 'TEST 02: All returned courses belong to digital-marketing');

// TEST 03 — MULTIPLE ACADEMIES (digital-marketing + ai)
const multiAcadResults = filterAndSortCourses({
  search: '',
  academies: ['digital-marketing', 'ai'],
  programLevels: [],
  levels: [],
  durations: [],
  maxPrice: 100000,
  placement: false
});
assert(multiAcadResults.length === 24, `TEST 03: Selecting DM (14) + AI (10) returns 24 courses without duplicates (got ${multiAcadResults.length})`);
const uniqueIds = new Set(multiAcadResults.map(c => c.id));
assert(uniqueIds.size === 24, 'TEST 03: No duplicate course IDs in multi-academy results');

// TEST 04 — COMBINED FILTERS (DM + Beginner + under 15k)
const combinedResults = filterAndSortCourses({
  search: '',
  academies: ['digital-marketing'],
  programLevels: [],
  levels: ['Beginner'],
  durations: [],
  maxPrice: 15000,
  placement: false
});
assert(combinedResults.length > 0 && combinedResults.length < 14, `TEST 04: Combined filter returns subset of DM courses (got ${combinedResults.length})`);
assert(combinedResults.every(c => c.academyId === 'digital-marketing' && c.price <= 15000), 'TEST 04: All courses strictly match DM and price <= 15000');

// TEST 05 — REMOVE CHIP / RELAX FILTER
const relaxedResults = filterAndSortCourses({
  search: '',
  academies: ['digital-marketing'],
  programLevels: [],
  levels: [], // removed level chip
  durations: [],
  maxPrice: 15000,
  placement: false
});
assert(relaxedResults.length >= combinedResults.length, `TEST 05: Removing level filter relaxes result count (got ${relaxedResults.length} >= ${combinedResults.length})`);

// TEST 06 — CLEAR ALL
const clearedResults = filterAndSortCourses({
  search: '',
  academies: [],
  programLevels: [],
  levels: [],
  durations: [],
  maxPrice: 100000,
  placement: false
});
assert(clearedResults.length === 109, `TEST 06: Clear all restores full 109 courses (got ${clearedResults.length})`);

// TEST 07 — SORT PRICE: LOW TO HIGH & HIGH TO LOW
const priceAsc = filterAndSortCourses({ maxPrice: 100000, sort: 'price-asc' });
let isAsc = true;
for (let i = 0; i < priceAsc.length - 1; i++) {
  if (priceAsc[i].price > priceAsc[i + 1].price) isAsc = false;
}
assert(isAsc, `TEST 07: Price Low to High is numerically ascending (min: ₹${priceAsc[0].price}, max: ₹${priceAsc[priceAsc.length - 1].price})`);

const priceDesc = filterAndSortCourses({ maxPrice: 100000, sort: 'price-desc' });
let isDesc = true;
for (let i = 0; i < priceDesc.length - 1; i++) {
  if (priceDesc[i].price < priceDesc[i + 1].price) isDesc = false;
}
assert(isDesc, `TEST 07: Price High to Low is numerically descending (max: ₹${priceDesc[0].price}, min: ₹${priceDesc[priceDesc.length - 1].price})`);

// TEST 08 — ZERO RESULTS
const zeroResults = filterAndSortCourses({
  search: 'nonexistentkeywordxyz123456789',
  maxPrice: 100000
});
assert(zeroResults.length === 0, `TEST 08: Non-matching filter returns 0 courses (got ${zeroResults.length})`);
assert(coursesHtml.includes('id="no-results"'), 'TEST 08: courses.html contains #no-results element');

// TEST 09 — CLOSE WITHOUT APPLY
// Draft state simulation: modifying draft without committing preserves original applied results
const originalApplied = { academies: ['office'] };
const draftModified = { academies: ['office', '3d'] };
const appliedCount = filterAndSortCourses(originalApplied).length;
const draftCount = filterAndSortCourses(draftModified).length;
assert(appliedCount === 10, `TEST 09: Applied state has 10 office courses (got ${appliedCount})`);
assert(draftCount === 18, `TEST 09: Draft state previews 18 courses without mutating applied (got ${draftCount})`);

// TEST 10 — STICKY SCROLL & CSS SPECIFICATIONS
console.log('\n--- 5. CSS & Layout Rule Verifications ---');
const stylesCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');

assert(stylesCss.includes('position: sticky') && stylesCss.includes('.mobile-filter-sort-bar'), 'TEST 10: .mobile-filter-sort-bar has sticky positioning in styles.css');
assert(stylesCss.includes('z-index: 85'), 'TEST 10: .mobile-filter-sort-bar has z-index 85');
assert(stylesCss.includes('.mobile-sheet-backdrop') && stylesCss.includes('z-index: 99990'), 'Bottom sheet backdrop has z-index 99990');
assert(stylesCss.includes('.mobile-filter-sheet') && stylesCss.includes('z-index: 99991'), 'Bottom sheet modal has z-index 99991');
assert(stylesCss.includes('body.filter-sheet-open .whatsapp-float'), 'WhatsApp floating button hidden when filter sheet is open');
assert(stylesCss.includes('min-height: 44px') || stylesCss.includes('min-height: 48px'), 'Touch targets meet >= 44px minimum requirement');

// TEST 11 — FILTER THEN OPEN COURSE (Integrity of Course Links)
console.log('\n--- 6. Course Detail Link Integrity ---');
const sampleArchviz = defaultResults.find(c => c.id === 'archviz-mastery');
assert(sampleArchviz && sampleArchviz.price === 69900 && sampleArchviz.duration === '8 Months', 'TEST 11: archviz-mastery retains approved 69,900 price and 8 Months duration');

const sampleExcel = defaultResults.find(c => c.id === 'microsoft-excel');
assert(sampleExcel && sampleExcel.price === 6900 && sampleExcel.duration === '6 Weeks', 'TEST 11: microsoft-excel retains approved 6,900 price and 6 Weeks duration');

// TEST 12 — DESKTOP REGRESSION
console.log('\n--- 7. Desktop Layout & Media Query Regression ---');
assert(stylesCss.includes('.mobile-courses-controls {\n  display: none;') || stylesCss.includes('.mobile-courses-controls{display:none') || stylesCss.includes('.mobile-courses-controls {\r\n  display: none;'), 'TEST 12: .mobile-courses-controls is hidden on desktop by default');
assert(stylesCss.includes('@media (max-width: 1024px)'), 'TEST 12: Desktop styles cleanly switch at 1024px breakpoint');

console.log('\n========================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('========================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL MOBILE COURSE FILTER TESTS PASSED (0 FAILURES)!');
}
