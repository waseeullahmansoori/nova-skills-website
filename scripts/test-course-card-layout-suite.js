const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== STARTING GLOBAL COURSE CARD PRICE & CTA LAYOUT TEST SUITE ===\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Load data.js
const dataJs = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

assert(Array.isArray(NS_COURSES) && NS_COURSES.length === 109, 'Loaded all 109 courses from data.js');
assert(Array.isArray(NS_ACADEMIES) && NS_ACADEMIES.length === 12, 'Loaded all 12 academies from data.js');

// 2. CSS Stylesheets Inspection
console.log('\n--- 1. Testing CSS Architecture (styles.css & css/main.css) ---');
const stylesCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');
const mainCss = fs.readFileSync(path.join(ROOT_DIR, 'css/main.css'), 'utf8');
const minStylesCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.min.css'), 'utf8');
const minMainCss = fs.readFileSync(path.join(ROOT_DIR, 'css/styles.min.css'), 'utf8');

// Check that 340px column-stack rule is eliminated
assert(!stylesCss.includes('.course-card-actions{flex-direction:column') && !stylesCss.includes('.course-card-actions { flex-direction: column'), 
  'styles.css: Mobile <=340px flex-direction: column rule REMOVED');
assert(!mainCss.includes('.course-card-actions{flex-direction:column') && !mainCss.includes('.course-card-actions { flex-direction: column'), 
  'css/main.css: Mobile <=340px flex-direction: column rule REMOVED');
assert(!minStylesCss.includes('.course-card-actions{flex-direction:column'), 
  'styles.min.css: Mobile <=340px column rule absent from minified CSS');

// Check course-footer flex-direction: column
assert(stylesCss.includes('.course-footer') && stylesCss.includes('flex-direction: column !important'), 
  'styles.css: .course-footer enforces flex-direction: column (dedicated price row on top)');
assert(stylesCss.includes('.course-footer-stack') && stylesCss.includes('.course-card-footer'), 
  'styles.css: .course-footer-stack and .course-card-footer unified');

// Check course-card-actions 2-column grid
assert(stylesCss.includes('.course-card-actions') && stylesCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr)) !important'), 
  'styles.css: .course-card-actions enforces 2-column grid');
assert(mainCss.includes('.course-card-actions') && mainCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr)) !important'), 
  'css/main.css: .course-card-actions enforces 2-column grid');

// Check identical heights and responsive padding
assert(stylesCss.includes('height: 42px !important'), 'styles.css: Buttons enforce identical 42px height');
assert(stylesCss.includes('clamp('), 'styles.css: Buttons use responsive clamp padding & font size');

// 3. Main Catalogue (courses.html) - All 109 Cards
console.log('\n--- 2. Testing Main Catalogue (courses.html) - All 109 Cards ---');
const coursesHtml = fs.readFileSync(path.join(ROOT_DIR, 'courses.html'), 'utf8');

let all109CataloguePassed = true;
NS_COURSES.forEach((c) => {
  if (!coursesHtml.includes(`id=${c.id}`) && !coursesHtml.includes(`id="${c.id}"`)) {
    all109CataloguePassed = false;
    console.error(`Course ${c.id} link missing in courses.html`);
  }
  
  const expectedPriceStr = `₹${(c.price || 0).toLocaleString('en-IN')}`;
  if (!coursesHtml.includes(expectedPriceStr)) {
    all109CataloguePassed = false;
    console.error(`Course ${c.id} expected price ${expectedPriceStr} missing in courses.html`);
  }
});

assert(all109CataloguePassed, 'courses.html contains all 109 course cards with correct prices and IDs');

// Check footer classes in courses.html
const catalogueFooters = coursesHtml.match(/<div class="course-footer course-footer-stack">/g) || [];
assert(catalogueFooters.length === 109, `courses.html has exactly 109 standardized .course-footer.course-footer-stack footers (got ${catalogueFooters.length})`);

const catalogueActionRows = coursesHtml.match(/<div class="course-card-actions">/g) || [];
assert(catalogueActionRows.length === 109, `courses.html has exactly 109 .course-card-actions CTA rows (got ${catalogueActionRows.length})`);

const syllabusLinks = coursesHtml.match(/<a [^>]*class="btn btn-outline btn-sm">View Syllabus<\/a>/g) || [];
assert(syllabusLinks.length === 109, `courses.html has exactly 109 View Syllabus buttons (got ${syllabusLinks.length})`);

const enrollBtns = coursesHtml.match(/<button [^>]*class="btn btn-primary btn-sm"[^>]*>Enroll Now →<\/button>/g) || [];
assert(enrollBtns.length === 109, `courses.html has exactly 109 Enroll Now → buttons (got ${enrollBtns.length})`);

// 4. Academy Pages (All 12 Academies)
console.log('\n--- 3. Testing 12 Academy Pages ---');
const ACADEMY_DIR_MAP = {
  'digital-marketing': 'digital-marketing',
  'ai': 'ai',
  'design': 'design',
  'programming': 'programming',
  'nocode': 'no-code-web',
  'video': 'video-motion',
  '3d': '3d',
  'career': 'career-freelancing',
  'communication': 'communication',
  'kids': 'kids-tech',
  'creator': 'creator',
  'office': 'office-productivity'
};

let allAcademiesPassed = true;
let totalAcademyCards = 0;
NS_ACADEMIES.forEach(acad => {
  const dirName = ACADEMY_DIR_MAP[acad.id] || acad.id;
  const acadPath = path.join(ROOT_DIR, 'academies', dirName, 'index.html');
  if (fs.existsSync(acadPath)) {
    const content = fs.readFileSync(acadPath, 'utf8');
    const footers = content.match(/<div class="course-footer course-footer-stack">/g) || [];
    const actions = content.match(/<div class="course-card-actions">/g) || [];
    const syllabi = content.match(/>View Syllabus<\/a>/g) || [];
    const enrolls = content.match(/>Enroll Now →<\/button>/g) || [];
    totalAcademyCards += footers.length;
    if (footers.length === 0 || footers.length !== actions.length || actions.length !== syllabi.length || enrolls.length < footers.length) {
      allAcademiesPassed = false;
      console.error(`Academy ${acad.id} card counts mismatch: footers=${footers.length}, actions=${actions.length}, syllabi=${syllabi.length}, enrolls=${enrolls.length}`);
    }
  } else {
    allAcademiesPassed = false;
    console.error(`Academy file missing: ${acadPath}`);
  }
});

assert(allAcademiesPassed, `All 12 academy landing pages verified with standardized footer layout (${totalAcademyCards} cards total)`);

// 5. Course Detail Related Courses (All 109 Course Detail Pages)
console.log('\n--- 4. Testing Course Detail Related Courses (functions/_rendered_courses.js & course-detail.js) ---');
const cdJs = fs.readFileSync(path.join(ROOT_DIR, 'course-detail.js'), 'utf8');
assert(cdJs.includes('course-footer course-footer-stack'), 'course-detail.js related cards render .course-footer.course-footer-stack');
assert(cdJs.includes('course-pricing course-pricing-row'), 'course-detail.js related cards render .course-pricing.course-pricing-row');
assert(cdJs.includes('course-card-actions'), 'course-detail.js related cards render .course-card-actions');
assert(cdJs.includes('View Syllabus'), 'course-detail.js related cards render View Syllabus button');
assert(cdJs.includes('Enroll Now →'), 'course-detail.js related cards render Enroll Now → button');

const renderedCoursesJs = fs.readFileSync(path.join(ROOT_DIR, 'functions/_rendered_courses.js'), 'utf8');
const edgeFooters = renderedCoursesJs.match(/course-footer course-footer-stack/g) || [];
assert(edgeFooters.length >= 327, `Edge pre-rendered bundle contains ${edgeFooters.length} standardized course-footer-stack instances (>=327 expected for 109 courses x 3 related)`);

// 6. Homepage Featured Courses (index.html)
console.log('\n--- 5. Testing Homepage Featured Courses (index.html) ---');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

const expectedHomeCourses = [
  { id: 'course-dm-pro', courseId: 'dm-professional', price: '₹24,900', name: 'AI Digital Marketing Specialist' },
  { id: 'course-ai-mastery', courseId: 'ai-mastery', price: '₹89,900', name: 'AI Solutions Engineering & Agentic AI Mastery' },
  { id: 'course-fullstack', courseId: 'fullstack-foundation', price: '₹39,999', name: 'Full Stack Programming Foundation' },
  { id: 'course-design', courseId: 'creative-design', price: '₹64,900', name: 'Creative Design Master' },
  { id: 'course-video', courseId: 'ai-integrated-video-editing-motion-graphics-professional', price: '₹69,900', name: 'AI-Integrated Video Editing & Motion Graphics Professional' },
  { id: 'course-dm-mastery', courseId: 'dm-mastery', price: '₹44,900', name: 'AI Digital Marketing Strategist' }
];

let allHomeCardsPassed = true;
expectedHomeCourses.forEach(c => {
  if (!indexHtml.includes(`id="${c.id}"`)) {
    allHomeCardsPassed = false;
    console.error(`index.html missing ${c.id}`);
  }
  if (!indexHtml.includes(c.price)) {
    allHomeCardsPassed = false;
    console.error(`index.html missing approved price ${c.price} for ${c.id}`);
  }
  if (!indexHtml.includes(c.name)) {
    allHomeCardsPassed = false;
    console.error(`index.html missing canonical title ${c.name} for ${c.id}`);
  }
});
assert(allHomeCardsPassed, 'index.html all 6 featured courses have canonical titles and approved fees');

const homeFooters = indexHtml.match(/<div class="course-footer course-footer-stack">/g) || [];
assert(homeFooters.length === 6, `index.html has exactly 6 standardized .course-footer.course-footer-stack footers (got ${homeFooters.length})`);

const homeActions = indexHtml.match(/<div class="course-card-actions">/g) || [];
assert(homeActions.length === 6, `index.html has exactly 6 .course-card-actions CTA rows (got ${homeActions.length})`);

// 7. Course #15 Pricing Integrity Check
console.log('\n--- 6. Testing Course #15 Data Integrity (No-Code Website Professional) ---');
const c15 = NS_COURSES.find(c => c.id === 'nocode-web-pro');
assert(c15 && c15.fee === 19900 && c15.price === 19900, 'Course #15 (nocode-web-pro) fee strictly preserved at ₹19,900');
assert(coursesHtml.includes('₹19,900'), 'courses.html renders ₹19,900 for Course #15');

console.log('\n========================================');
console.log(`TOTAL CARD LAYOUT TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL GLOBAL COURSE CARD LAYOUT TESTS PASSED (0 FAILURES)!');
}
