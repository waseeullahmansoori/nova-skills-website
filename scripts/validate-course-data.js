'use strict';

/**
 * Automated Canonical Course Data Integrity Validator (P0-1 Section 8)
 * Read-only validation: inspects data/courses.json, data/academies.json,
 * data/course-data-schema.json, data/curricula/*.json, data/locations/location-course-mapping.json,
 * course-image-map.json, Nova_Skills_109_Course_Master_Mapping.json, and runtime data.js.
 * Does NOT silently rewrite or mutate any records.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const CourseData = require(path.join(ROOT, 'js', 'course-data.js'));

const EXPECTED_ACADEMY_COUNTS = {
  'digital-marketing': 14,
  'ai': 10,
  'design': 10,
  'programming': 10,
  'video': 8,
  '3d': 8,
  'nocode': 8,
  'career': 10,
  'communication': 7,
  'kids': 7,
  'creator': 7,
  'office': 10
};

let passed = 0;
let failed = 0;
const warnings = [];

function check(condition, msg) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ [FAIL] ${msg}`);
  }
}

console.log('================================================================');
console.log('🧪 P0-1 CANONICAL COURSE DATA VALIDATION SUITE');
console.log('================================================================\n');

const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'course-data-schema.json'), 'utf8'));
const coursesDoc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'courses.json'), 'utf8'));
const academiesDoc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'academies.json'), 'utf8'));
const masterMapping = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'Nova_Skills_109_Course_Master_Mapping.json'), 'utf8'));
const imageMap = JSON.parse(fs.readFileSync(path.join(ROOT, 'course-image-map.json'), 'utf8'));
const locMapping = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'locations', 'location-course-mapping.json'), 'utf8'));

const courses = coursesDoc.courses || [];
const academies = academiesDoc.academies || [];
const academyIds = new Set(academies.map(a => a.id));
const masterById = new Map(masterMapping.courses.map(m => [m.stable_id, m]));

// 1. Inventory Validation
check(courses.length === 109, `Total courses in data/courses.json is 109 (found ${courses.length})`);
const published = courses.filter(c => c.status === 'published');
check(published.length === 109, `Published courses count is 109 (found ${published.length})`);
check(academies.length === 12, `Total academies in data/academies.json is 12 (found ${academies.length})`);

for (const [aid, expCount] of Object.entries(EXPECTED_ACADEMY_COUNTS)) {
  const actual = published.filter(c => c.academyId === aid).length;
  check(actual === expCount, `Academy "${aid}" course count is ${expCount} (found ${actual})`);
}

// 2. Structural & Schema Validation
const seenIds = new Set();
const seenSlugs = new Set();
const seenNumbers = new Set();
const expectedCurriculumFiles = new Set();
const requiredKeys = schema.required || [];
const allowedMetricTypes = new Set(['core-production', 'live-practical', 'portfolio', 'capstone', 'specialization', 'blueprint-total', 'graduation-deliverables']);

for (const c of courses) {
  for (const rk of requiredKeys) {
    check(c[rk] !== undefined && c[rk] !== null, `${c.id}: required field "${rk}" present`);
  }
  check(typeof c.id === 'string' && /^[a-z0-9-]+$/.test(c.id), `${c.id}: valid ID format`);
  check(!seenIds.has(c.id), `Unique ID: ${c.id}`);
  seenIds.add(c.id);

  check(typeof c.slug === 'string' && /^[a-z0-9-]+$/.test(c.slug), `${c.id}: valid slug "${c.slug}"`);
  check(!seenSlugs.has(c.slug), `Unique slug: ${c.slug} (${c.id})`);
  seenSlugs.add(c.slug);

  check(!seenNumbers.has(c.courseNumber), `Unique courseNumber ${c.courseNumber} (${c.id})`);
  seenNumbers.add(c.courseNumber);

  check(academyIds.has(c.academyId), `${c.id}: valid academyId "${c.academyId}"`);
  check(typeof c.title === 'string' && c.title.trim().length >= 3, `${c.id}: non-empty official title`);
  check(typeof c.duration?.value === 'number' && c.duration.value > 0, `${c.id}: valid duration.value (${c.duration?.value})`);
  check(['days', 'weeks', 'months'].includes(c.duration?.unit), `${c.id}: valid duration.unit (${c.duration?.unit})`);
  check(typeof c.guidedHours === 'number' && c.guidedHours > 0, `${c.id}: valid guidedHours (${c.guidedHours})`);
  check(Array.isArray(c.tools) && c.tools.length > 0, `${c.id}: non-empty tools array`);

  // Curriculum reference check
  const curRel = c.curriculumRef;
  check(typeof curRel === 'string' && /^curricula\/[a-z0-9-]+\.json$/.test(curRel), `${c.id}: valid curriculumRef "${curRel}"`);
  const curAbs = path.join(ROOT, 'data', curRel);
  check(fs.existsSync(curAbs), `${c.id}: curriculum file exists at data/${curRel}`);
  if (fs.existsSync(curAbs)) {
    expectedCurriculumFiles.add(path.basename(curRel));
    const curDoc = JSON.parse(fs.readFileSync(curAbs, 'utf8'));
    check(curDoc.courseId === c.id, `${c.id}: curriculum file courseId matches (${curDoc.courseId})`);
  }

  // Image asset checks (must match course-image-map.json and exist on disk)
  const imgRec = imageMap.byId[c.id];
  check(!!imgRec, `${c.id}: entry exists in course-image-map.json`);
  if (imgRec) {
    check(c.images?.card?.desktop === imgRec.image.desktop, `${c.id}: desktop card image matches course-image-map.json`);
    check(c.images?.card?.mobile === imgRec.image.mobile, `${c.id}: mobile card image matches course-image-map.json`);
  }
  const dAbs = path.join(ROOT, String(c.images?.card?.desktop || '').replace(/^\//, ''));
  const mAbs = path.join(ROOT, String(c.images?.card?.mobile || '').replace(/^\//, ''));
  check(fs.existsSync(dAbs) && fs.statSync(dAbs).size > 0, `${c.id}: desktop card asset exists (${c.images?.card?.desktop})`);
  check(fs.existsSync(mAbs) && fs.statSync(mAbs).size > 0, `${c.id}: mobile card asset exists (${c.images?.card?.mobile})`);

  // Commercial validation
  const m = masterById.get(c.id);
  check(!!m, `${c.id}: exists in Master Mapping`);
  if (m) {
    check(c.title === m.final_course_name, `${c.id}: title matches Master Mapping`);
    check(c.pricing.currentPrice === m.effective_fee, `${c.id}: currentPrice (${c.pricing.currentPrice}) === Master effective_fee (${m.effective_fee})`);
    check(c.pricing.originalPrice === m.regular_fee, `${c.id}: originalPrice (${c.pricing.originalPrice}) === Master regular_fee (${m.regular_fee})`);
    check(c.pricing.offerActive === Boolean(m.offer_active), `${c.id}: offerActive parity`);
  }
  check(c.pricing.currency === 'INR' && c.pricing.currentPrice >= 0 && c.pricing.originalPrice >= c.pricing.currentPrice, `${c.id}: valid non-negative INR pricing & no inverted discount`);
  if (!c.pricing.offerActive) {
    check(c.pricing.currentPrice === c.pricing.originalPrice && c.pricing.discountPercent === 0, `${c.id}: regular-only course has zero discount`);
  }
  check(c.pricing.gst && c.pricing.gst.rate === 18 && ['included', 'extra', 'requires-admin-confirmation'].includes(c.pricing.gst.treatment), `${c.id}: explicit GST policy metadata`);

  // Project validation
  check(Array.isArray(c.projects?.metrics) && c.projects.metrics.length > 0, `${c.id}: explicit projects.metrics array`);
  for (const pm of (c.projects?.metrics || [])) {
    check(allowedMetricTypes.has(pm.type), `${c.id}: valid project metric type "${pm.type}"`);
    check(Number.isInteger(pm.count) && pm.count >= 0, `${c.id}: integer project metric count (${pm.count})`);
    check(typeof pm.displayLabel === 'string' && pm.displayLabel.length >= 2, `${c.id}: non-empty project metric label`);
  }
  if (c.projects?.reviewRequired) {
    warnings.push(`${c.id}: projects flagged reviewRequired (${(c.projects.reviewNotes || []).join('; ')})`);
  }

  // SEO validation
  check(typeof c.seo?.canonicalUrl === 'string' && c.seo.canonicalUrl === `https://novaskills.in/course-detail.html?id=${c.id}`, `${c.id}: exact canonical course URL preserved`);
}

// Check for orphaned curriculum files
const actualCurriculumFiles = fs.readdirSync(path.join(ROOT, 'data', 'curricula')).filter(f => f.endsWith('.json'));
for (const cf of actualCurriculumFiles) {
  check(expectedCurriculumFiles.has(cf), `No orphaned curriculum file: data/curricula/${cf}`);
}

// 3. Location Recommendation Validation
const locCourses = new Set();
for (const loc of (locMapping.mappings || [])) {
  for (const cid of (loc.allCourseIds || [])) {
    locCourses.add(cid);
    const resolved = CourseData.getCourseById(cid);
    check(!!resolved, `Location "${loc.slug}" course ID "${cid}" resolves cleanly`);
  }
}
check(locCourses.size > 0, `Validated ${locCourses.size} unique recommended courses across ${locMapping.mappings.length} cities`);

// 4. Approved ₹2,900 Starting Price Validation
const minPublished = Math.min(...published.map(c => c.pricing.currentPrice));
check(coursesDoc.approvedStartingPrice === 2900, `Canonical approvedStartingPrice is ₹2,900`);
check(minPublished === 2900, `Minimum published course fee matches ₹2,900 (found ₹${minPublished})`);

// 5. Runtime data.js + NovaCourseData Accessor Verification
const dataJsPath = path.join(ROOT, 'data.js');
const sandbox = { module: { exports: {} } };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(dataJsPath, 'utf8'), sandbox);
const { NS_COURSES, NS_ACADEMIES } = sandbox.module.exports;

check(Array.isArray(NS_COURSES) && NS_COURSES.length === 109, `Runtime data.js exports 109 NS_COURSES`);
check(Array.isArray(NS_ACADEMIES) && NS_ACADEMIES.length === 12, `Runtime data.js exports 12 NS_ACADEMIES`);
for (const a of NS_ACADEMIES) {
  const expectedCount = EXPECTED_ACADEMY_COUNTS[a.id];
  check(Array.isArray(a.courses) && a.courses.length === expectedCount, `Runtime NS_ACADEMIES[${a.id}].courses length matches ${expectedCount}`);
}

// Accessor API checks
check(CourseData.getGlobalCourseCount() === 109, `NovaCourseData.getGlobalCourseCount() === 109`);
check(CourseData.getCanonicalStartingPrice() === 2900, `NovaCourseData.getCanonicalStartingPrice() === 2900`);
check(CourseData.getCourseById('dm-professional')?.duration === '3 Months', `NovaCourseData.getCourseById('dm-professional').duration === '3 Months'`);
check(CourseData.getCourseById('dm-professional')?.guidedHours === 120, `NovaCourseData.getCourseById('dm-professional').guidedHours === 120`);
check(CourseData.getCourseById('dm-professional')?.liveProjects === 5, `NovaCourseData.getCourseById('dm-professional').liveProjects === 5`);
check(CourseData.getCourseProjectLabel(CourseData.getCourseById('dm-professional')) === '5 Core Production Projects', `dm-professional projectDisplayLabel === '5 Core Production Projects'`);
check(CourseData.getCourseById('ai-assisted-full-stack-web-development')?.liveProjects === 6, `NovaCourseData.getCourseById('ai-assisted-full-stack-web-development').liveProjects === 6`);
check(CourseData.getCourseById('nonexistent-id-xyz') === null, `NovaCourseData.getCourseById safely returns null on invalid ID`);
check(CourseData.getAcademyCourseCount('no-code-web') === 8, `NovaCourseData.getAcademyCourseCount('no-code-web') alias resolves to 8`);
check(CourseData.getAcademyStartingPrice('career') === 2900, `NovaCourseData.getAcademyStartingPrice('career') === 2900`);
check(CourseData.getCoursesByProgramType('career').length > 0, `NovaCourseData.getCoursesByProgramType('career') works`);

console.log(`Passed checks: ${passed}`);
console.log(`Failed checks: ${failed}`);
if (warnings.length > 0) {
  console.log(`\nReview-flagged items (${warnings.length}, documented in docs/course-data-conflicts.md):`);
  warnings.forEach(w => console.log(`  ⚠️  ${w}`));
}

if (failed > 0) {
  console.error('\n❌ CANONICAL COURSE DATA VALIDATION FAILED');
  process.exit(1);
}
console.log('\n✅ ALL CANONICAL COURSE DATA VALIDATION CHECKS PASSED (0 FAILURES)!');
