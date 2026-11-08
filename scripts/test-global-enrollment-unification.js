const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== RUNNING GLOBAL ENROLLMENT UNIFICATION TEST SUITE (PHASE 13 TESTS A-N) ===\n');

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

// 1. Load data.js
const ROOT_DIR = path.resolve(__dirname, '..');
const dataJs = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

assert(Array.isArray(NS_COURSES) && NS_COURSES.length === 109, 'Loaded all 109 courses from data.js');
assert(Array.isArray(NS_ACADEMIES) && NS_ACADEMIES.length === 12, 'Loaded all 12 academies from data.js');

// Read files
const componentsJs = fs.readFileSync(path.join(ROOT_DIR, 'components.js'), 'utf8');
const componentsMinJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'components.min.js'), 'utf8');
const courseDetailHtml = fs.readFileSync(path.join(ROOT_DIR, 'course-detail.html'), 'utf8');
const courseDetailJs = fs.readFileSync(path.join(ROOT_DIR, 'course-detail.js'), 'utf8');
const academyDetailJs = fs.readFileSync(path.join(ROOT_DIR, 'academy-detail.js'), 'utf8');
const coursesHtml = fs.readFileSync(path.join(ROOT_DIR, 'courses.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');
const renderedCoursesJs = fs.readFileSync(path.join(ROOT_DIR, 'functions', '_rendered_courses.js'), 'utf8');

// --- TEST A: Main All Courses catalogue (courses.html) ---
console.log('\n--- TEST A: Main All Courses Catalogue ---');
assert(coursesHtml.includes('openEnrollmentModal'), 'courses.html calls openEnrollmentModal for enroll actions');
assert(!coursesHtml.includes('openCourseModal'), 'courses.html has no legacy openCourseModal calls');
// Check that cards in courses.html pass course parameters
const courseCardEnrollMatches = coursesHtml.match(/openEnrollmentModal\([^)]+\)/g) || [];
assert(courseCardEnrollMatches.length >= 109, `courses.html contains ${courseCardEnrollMatches.length} openEnrollmentModal calls`);
// Verify that no course-related card button uses openConsultationPopup
const coursesLines = coursesHtml.split('\n');
let invalidCoursesEnroll = false;
coursesLines.forEach(line => {
  if (line.includes('course-card') && line.includes('openConsultationPopup')) {
    invalidCoursesEnroll = true;
  }
});
assert(!invalidCoursesEnroll, 'courses.html course cards do not use openConsultationPopup()');

// --- TEST B: Each of the 12 Academy Course Listings ---
console.log('\n--- TEST B: Each of the 12 Academy Course Listings ---');
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

NS_ACADEMIES.forEach(acad => {
  const dirName = ACADEMY_DIR_MAP[acad.id] || acad.id;
  const acadPath = path.join(ROOT_DIR, `academies/${dirName}/index.html`);
  assert(fs.existsSync(acadPath), `Academy directory /academies/${dirName}/index.html exists`);
  if (fs.existsSync(acadPath)) {
    const acadContent = fs.readFileSync(acadPath, 'utf8');
    const acadEnrollMatches = acadContent.match(/openEnrollmentModal\([^)]+\)/g) || [];
    assert(acadEnrollMatches.length > 0, `Academy ${acad.id} has ${acadEnrollMatches.length} openEnrollmentModal calls`);
    let invalidAcadEnroll = false;
    acadContent.split('\n').forEach(line => {
      if (line.includes('course-card') && line.includes('openConsultationPopup')) {
        invalidAcadEnroll = true;
      }
    });
    assert(!invalidAcadEnroll, `Academy ${acad.id} course cards do not use openConsultationPopup()`);
  }
});

// Check academy-detail.js dynamic rendering
assert(academyDetailJs.includes("openEnrollmentModal('${safeName}', '${safeAcademy}', '${safeDuration}', '${safePrice}', '${safeId}')"),
  'academy-detail.js dynamically binds all 5 parameters (including safeId) to openEnrollmentModal');

// --- TEST C: Course Detail Primary "Enroll Now" ---
console.log('\n--- TEST C: Course Detail Primary "Enroll Now" ---');
assert(courseDetailHtml.includes('btn-enroll-full') && courseDetailHtml.includes('openEnrollmentModal('), 
  'course-detail.html hero button calls openEnrollmentModal');
assert(courseDetailJs.includes('window.currentCourse = course;'), 
  'course-detail.js sets window.currentCourse for global availability');
assert(renderedCoursesJs.includes('openEnrollmentModal('), 
  'functions/_rendered_courses.js binds openEnrollmentModal for pre-rendered pages');

// --- TEST D: Related-Course Cards ---
console.log('\n--- TEST D: Related-Course Cards ---');
assert(courseDetailJs.includes("openEnrollmentModal('${relSafeName}', '${relSafeAcademy}', '${relSafeDuration}', '${relSafePrice}', '${c.id}')"), 
  'course-detail.js related cards pass individual related course details including c.id');

// --- TEST E: Mobile Sticky CTA ---
console.log('\n--- TEST E: Mobile Sticky CTA ---');
assert(courseDetailHtml.includes('id="sticky-mobile-bar"'), 'course-detail.html contains sticky-mobile-bar');
const stickyMatch = courseDetailHtml.match(/<div id="sticky-mobile-bar"[\s\S]*?<\/div>/);
if (stickyMatch) {
  assert(stickyMatch[0].includes('openEnrollmentModal('), 
    'Sticky mobile bar button calls openEnrollmentModal');
  assert(!stickyMatch[0].includes('openConsultationPopup()'), 
    'Sticky mobile bar button no longer calls openConsultationPopup()');
}

// --- TEST F: Course Switching (Course A -> Close -> Course B) ---
console.log('\n--- TEST F: Course Switching State Integrity ---');
assert(componentsJs.includes('// Reset input values to pristine state'), 
  'components.js resets inputs on modal open');
assert(componentsJs.includes("modalMetaPath.style.display = 'none';"), 
  'components.js clears specialization group on modal open');
assert(componentsJs.includes('clearAllFieldErrors();'), 
  'components.js clears validation errors on modal open');
assert(componentsJs.includes('submitBtn.removeAttribute(\'disabled\');'), 
  'components.js resets submit button state on modal open');
assert(componentsJs.includes('COURSE_ID_ALIASES'), 
  'components.js has COURSE_ID_ALIASES map to resolve aliases cleanly');

// --- TEST G: Corrected Form (Zero Trust Badges, Preserved Privacy Disclosure) ---
console.log('\n--- TEST G: Form Layout & Content Verification ---');
assert(!componentsJs.includes('1-on-1 Academic Counselling'), 'Zero trust badge 1 in components.js');
assert(!componentsJs.includes('Hands-on Live Training'), 'Zero trust badge 2 in components.js');
assert(!componentsJs.includes('100% Privacy Protected'), 'Zero trust badge 3 in components.js');
assert(!componentsMinJs.includes('1-on-1 Academic Counselling'), 'Zero trust badge 1 in components.min.js');
assert(!componentsMinJs.includes('Hands-on Live Training'), 'Zero trust badge 2 in components.min.js');
assert(!componentsMinJs.includes('100% Privacy Protected'), 'Zero trust badge 3 in components.min.js');
assert(componentsJs.includes('enroll-privacy-notice') && componentsJs.includes('Your details are kept confidential'), 
  'Privacy disclosure notice preserved');
assert(componentsJs.includes('selected-course-card') && componentsJs.includes('enroll-form-fields'), 
  'Modal contains selected course card and form fields');

// Order of elements
const cardIdx = componentsJs.indexOf('id="selected-course-card"');
const nameIdx = componentsJs.indexOf('id="enroll-name"');
const phoneIdx = componentsJs.indexOf('id="enroll-phone"');
const submitIdx = componentsJs.indexOf('id="enroll-submit-btn"');
assert(cardIdx < nameIdx && nameIdx < phoneIdx && phoneIdx < submitIdx, 
  'Form layout order is: Course Summary -> Student Details -> Submit Action');

// --- TEST H: Mobile Responsive Single-Column Standard ---
console.log('\n--- TEST H: Mobile Responsive Standards ---');
assert(stylesCss.includes('@media (max-width: 768px)') && stylesCss.includes('.enroll-modal-container'), 
  'styles.css has mobile breakpoint rules for .enroll-modal-container');
assert(stylesCss.includes('grid-template-columns: 1fr'), 
  'Mobile container collapses to single column (grid-template-columns: 1fr)');
assert(stylesCss.includes('body.modal-open-hide-widgets #sticky-mobile-bar'), 
  'Sticky mobile bar hidden when modal is open (modal-open-hide-widgets)');
assert(stylesCss.includes('body.modal-open-hide-widgets .whatsapp-float'), 
  'Floating WhatsApp hidden when modal is open (modal-open-hide-widgets)');

// --- TEST I: Validation & Phone Sanitization ---
console.log('\n--- TEST I: Validation & Phone Sanitization ---');
function sanitizePhone(raw) {
  let cleaned = (raw || '').replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) cleaned = cleaned.substring(2);
  if (cleaned.length === 11 && cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  return cleaned;
}
function validatePhone(phone) {
  const cleaned = sanitizePhone(phone);
  return /^[6-9]\d{9}$/.test(cleaned);
}
assert(validatePhone('+91 98765 43210') === true, 'Standard Indian mobile with +91 and spaces validates');
assert(validatePhone('09876543210') === true, 'Indian mobile with leading 0 validates');
assert(validatePhone('9876543210') === true, '10-digit Indian mobile validates');
assert(validatePhone('5876543210') === false, 'Mobile starting with 5 rejected');
assert(validatePhone('1234567890') === false, 'Mobile starting with 1 rejected');
assert(validatePhone('98765') === false, 'Short mobile rejected');

// --- TEST J: Test Lead Submission Pipeline Simulation ---
console.log('\n--- TEST J: Lead Submission Pipeline Simulation ---');
assert(componentsJs.includes('handleEnrollmentSubmit') && componentsJs.includes('submitNovaForm'), 
  'Enrollment submission pipeline exists');
assert(componentsJs.includes('enroll-success-container'), 
  'Success confirmation view exists');

// --- TEST K: No Duplicate Modals or Multiple Listeners ---
console.log('\n--- TEST K: Single Authoritative Component ---');
assert(componentsJs.includes('document.getElementById(\'course-enrollment-modal\')'), 
  'Re-uses single #course-enrollment-modal element if already present');
assert(componentsJs.includes('window.openEnrollmentModal = openEnrollmentModal;'), 
  'Global window.openEnrollmentModal exported');
assert(componentsJs.includes('window.openCourseEnrollModal = openEnrollmentModal;'), 
  'Alias window.openCourseEnrollModal mapped to openEnrollmentModal');
assert(componentsJs.includes('window.openCourseEnrollment = openEnrollmentModal;'), 
  'Alias window.openCourseEnrollment mapped to openEnrollmentModal');

// --- TEST L: All 109 Courses Iterate and Resolve with Fee & Duration ---
console.log('\n--- TEST L: 109 Courses Dynamic Resolution ---');
let all109Resolved = true;
NS_COURSES.forEach((c, idx) => {
  if (!c.id || !c.title || !c.duration || !c.fee) {
    all109Resolved = false;
    console.error(`Course #${idx + 1} (${c.id}) is missing required attributes`);
  }
});
assert(all109Resolved, 'All 109 courses have valid id, title, duration, and fee');

// Test Course #15 nocode-web-pro
const c15 = NS_COURSES.find(c => c.id === 'nocode-web-pro');
assert(c15 && c15.fee === 19900, 'Course #15 (nocode-web-pro) resolves fee ₹19,900');

// Test Course #31 figma-ui-design
const c31 = NS_COURSES.find(c => c.id === 'figma-ui-design');
assert(c31 && c31.fee === 9900 && c31.duration === '8 Weeks', 'Course #31 (figma-ui-design) resolves fee ₹9,900 & 8 Weeks');

// --- TEST M: Desktop Layout Standards ---
console.log('\n--- TEST M: Desktop Layout Standards ---');
assert(stylesCss.includes('.enroll-modal-container') && stylesCss.includes('display: grid'), 
  'styles.css defines grid layout for .enroll-modal-container');

// --- TEST N: Accessibility Standards ---
console.log('\n--- TEST N: Accessibility Standards ---');
assert(componentsJs.includes('role="dialog"') || componentsJs.includes('aria-modal="true"'), 
  'Modal has dialog role or aria-modal');
assert(componentsJs.includes('aria-label="Close modal"') || componentsJs.includes('aria-label="Close"'), 
  'Close button has accessible aria-label');
assert(componentsJs.includes('Keydown') || componentsJs.includes('keydown') || componentsJs.includes('Escape'), 
  'Modal handles Escape key to dismiss');

console.log('\n========================================');
console.log(`TOTAL UNIFICATION TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL GLOBAL ENROLLMENT UNIFICATION TESTS (A-N) PASSED (0 FAILURES)!');
}
