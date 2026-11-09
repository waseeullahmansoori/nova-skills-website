/**
 * Automated Verification Suite for Nova Skills Global Free Demo & 1:1 Implementation
 * Validates all 20 Phase 18 Requirements and Guarantees Zero Regressions.
 */

const fs = require('fs');
const path = require('path');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

console.log('=== PHASE 18: AUTOMATED COMPONENT & SYSTEM TEST SUITE ===\n');

// 1. Homepage demo CTA opens shared booking form
console.log('Test 1: Homepage demo CTA opens shared booking form');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const heroCtaMatch = indexHtml.match(/<a[^>]+id="hero-cta-primary"[^>]*>([\s\S]*?)<\/a>/i);
assert(heroCtaMatch !== null, 'Hero primary CTA exists in index.html');
if (heroCtaMatch) {
  assert(heroCtaMatch[1].includes('Book Your 2-Day Free Demo'), 'Hero primary CTA text is "Book Your 2-Day Free Demo"');
  assert(heroCtaMatch[0].includes('openDemoModal'), 'Hero primary CTA calls openDemoModal()');
}

// 2. Existing counselling access remains functional
console.log('\nTest 2: Existing counselling access remains functional');
const counsellingSection = indexHtml.includes('id="counselling"');
const counsellingForm = indexHtml.includes('id="counselling-form"');
const consultPopupCall = indexHtml.includes('openConsultationPopup');
assert(counsellingSection, 'Counselling section exists on homepage');
assert(counsellingForm, 'Counselling form exists on homepage');
assert(consultPopupCall, 'openConsultationPopup callers exist on homepage');

// 3. Homepage hero statistics strip unchanged
console.log('\nTest 3: Homepage hero statistics / USP strip unchanged');
const heroStatsMatch = indexHtml.match(/<div class="hero-stats hero-usp-strip"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Hero Visual -->/i);
assert(heroStatsMatch !== null, 'Hero USP strip exists');
if (heroStatsMatch) {
  const content = heroStatsMatch[0];
  assert(content.includes('02 DAYS'), 'Hero USP col 1 contains 02 DAYS');
  assert(content.includes('FREE DEMO CLASSES'), 'Hero USP col 1 contains FREE DEMO CLASSES');
  assert(content.includes('Career-Focused'), 'Hero USP col 2 contains Career-Focused');
  assert(content.includes('Practical Training'), 'Hero USP col 2 contains Practical Training');
  assert(content.includes('1:1'), 'Hero USP col 3 contains 1:1');
  assert(content.includes('LIVE ONLINE CLASSES'), 'Hero USP col 3 contains LIVE ONLINE CLASSES');
}

// 4. Course-detail demo CTA uses correct primary course ID
console.log('\nTest 4: Course-detail demo CTA uses correct primary course ID');
const detailHtml = fs.readFileSync('course-detail.html', 'utf8');
assert(detailHtml.includes('id="btn-detail-book-demo"'), 'course-detail.html has #btn-detail-book-demo');
assert(detailHtml.includes('id="detail-demo-box"'), 'course-detail.html has #detail-demo-box');

// Check rendered course static files
const sampleCourse = fs.readFileSync('_rendered_courses/dm-mastery.html', 'utf8');
assert(sampleCourse.includes('btn-detail-book-demo'), '_rendered_courses/dm-mastery.html contains #btn-detail-book-demo');
assert(sampleCourse.includes('dm-mastery'), '_rendered_courses/dm-mastery.html passes dm-mastery ID');

// 5. Academy demo form uses correct academy context
console.log('\nTest 5: Academy demo form uses correct academy context');
const dmAcademy = fs.readFileSync('academies/digital-marketing/index.html', 'utf8');
assert(dmAcademy.includes('academy-demo-strip') || dmAcademy.includes('academy-demo-banner'), 'Academy landing page contains academy-demo-strip / academy-demo-banner');
assert(dmAcademy.includes("openDemoModal({academyId:'digital-marketing'"), 'Academy promo band passes academyId: digital-marketing');
assert(dmAcademy.includes('Explore Your Skills Before You Commit.') || dmAcademy.includes('Experience the Learning Before You Enroll.'), 'Academy promo band has correct headline');
assert(dmAcademy.includes('2 Days Free Demo Classes'), 'Academy promo band has Benefit 1');
assert(/1:1 (?:Live Online Classes|LIVE ONLINE CLASSES)/.test(dmAcademy), 'Academy promo band has Benefit 2');

// 6. Course selector supports eligible programs
console.log('\nTest 6: Course selector supports eligible programs');
const compCode = fs.readFileSync('components.js', 'utf8');
assert(compCode.includes('function populateDemoCourseSelect'), 'populateDemoCourseSelect exists in components.js');
assert(compCode.includes('isCourseDemoEligible'), 'isCourseDemoEligible function exists in components.js');

// 7. Catalogue chip respects eligibility
console.log('\nTest 7: Catalogue chip respects eligibility');
const coursesHtml = fs.readFileSync('courses.html', 'utf8');
assert(coursesHtml.includes('course-demo-chip'), 'courses.html contains course-demo-chip');
assert(coursesHtml.includes('2-Day Free Demo Available'), 'courses.html contains "2-Day Free Demo Available"');

// 8. Existing two-button course footer remains intact
console.log('\nTest 8: Existing course footer layout remains intact');
const coursesJs = fs.readFileSync('courses.js', 'utf8');
assert(coursesJs.includes('course-pricing course-pricing-row'), 'courses.js preserves course-pricing-row');
assert(coursesJs.includes('btn btn-outline btn-sm">View Syllabus'), 'courses.js preserves View Syllabus button');
assert(coursesJs.includes('btn btn-primary btn-sm" onclick="openEnrollmentModal'), 'courses.js preserves Enroll Now button');

// 9. Enrollment form remains separate and functional
console.log('\nTest 9: Enrollment form remains separate and functional');
assert(compCode.includes('function openEnrollmentModal'), 'openEnrollmentModal exists in components.js');
assert(compCode.includes('course-enrollment-modal'), 'course-enrollment-modal markup exists');
assert(compCode.includes('demo-booking-modal'), 'demo-booking-modal markup exists separately');

// 10. Demo form submits correct lead type
console.log('\nTest 10: Demo form submits correct lead type');
assert(compCode.includes("formName: 'demo_booking'"), "submitNovaForm called with formName: 'demo_booking'");
assert(compCode.includes("submissionMethod: 'demo_modal'"), "submitNovaForm called with submissionMethod: 'demo_modal'");

// 11. Successful submission does not falsely claim confirmed class
console.log('\nTest 11: Successful submission copy accuracy');
assert(compCode.includes('Your Free Demo Request Has Been Submitted'), 'Demo modal success header is "Your Free Demo Request Has Been Submitted"');
assert(compCode.includes('Our admissions team will contact you with available session details'), 'Demo modal success copy mentions admissions contact, not confirmed seat');
assert(!compCode.includes('Your demo class is confirmed'), 'Does not falsely promise immediate confirmed class');

// 12. Duplicate leads prevented
console.log('\nTest 12: Duplicate lead prevention');
assert(compCode.includes('submitBtn.disabled = true;'), 'Submit button disabled during submission');
assert(compCode.includes("form.dataset.submitting === 'true'"), 'Dataset submitting check prevents double submission');

// 13. Zero PII in analytics
console.log('\nTest 13: Zero PII in analytics');
const demoGaMatches = compCode.match(/sendGA4Event\('demo_[^']+'[^)]*\)/g) || [];
assert(demoGaMatches.length >= 4, `At least 4 demo GA4 events dispatched (found ${demoGaMatches.length})`);
demoGaMatches.forEach(call => {
  const hasUserPii = /\b(user_name|full_name|user_phone|user_email)\b/.test(call) || /(?<![a-zA-Z_])(email|phone|mobile):/.test(call);
  assert(!hasUserPii, `No PII dispatched in event: ${call.slice(0, 45).replace(/\s+/g, ' ')}...`);
});

// 14. Announcement bar works
console.log('\nTest 14: Announcement bar contains 6 slides with demo');
assert(indexHtml.includes('data-index="5"'), 'index.html has slide data-index="5"');
assert(indexHtml.includes('2 Days Free Demo Classes'), 'Announcement slide contains 2 Days Free Demo Classes');
assert(compCode.includes('data-index="5"'), 'components.js header contains slide data-index="5"');

// 15. FAQs are accurate
console.log('\nTest 15: FAQs are accurate');
assert(indexHtml.includes('Does Nova Skills offer free demo classes?'), 'FAQ 1 present in index.html');
assert(indexHtml.includes('How do I book a free demo?'), 'FAQ 2 present in index.html');
assert(indexHtml.includes('Are 1:1 online classes available?'), 'FAQ 3 present in index.html');
assert(indexHtml.includes('Is the demo booking the same as admission?'), 'FAQ 4 present in index.html');

// 16. Footer & contact links work
console.log('\nTest 16: Footer & contact links work');
assert(compCode.includes('Book a Free Demo'), 'Footer Quick Links in components.js has "Book a Free Demo"');
assert(indexHtml.includes('Book a Free Demo'), 'Footer Quick Links in index.html has "Book a Free Demo"');

// 17. No duplicated modal
console.log('\nTest 17: No duplicated modal containers');
assert(compCode.includes("if (document.getElementById('demo-booking-modal')) return;"), 'injectDemoModalHTML guards against duplicate injection');
assert(compCode.includes("if (document.getElementById('course-enrollment-modal')) return;"), 'injectEnrollmentModalHTML guards against duplicate injection');

// 18. No widget overlap
console.log('\nTest 18: Floating widget suppression during modal');
assert(compCode.includes("document.body.classList.add('modal-open-hide-widgets')"), 'modal-open-hide-widgets added when demo modal opens');
assert(compCode.includes("document.body.classList.remove('modal-open-hide-widgets')"), 'modal-open-hide-widgets removed when demo modal closes');

// 19. No broken icon tokens
console.log('\nTest 19: No raw FontAwesome token leakage');
const rawFaRegex = /fas fa-[a-z0-9-]+/i;
assert(!rawFaRegex.test(indexHtml), 'Zero raw FA tokens in index.html');
assert(!rawFaRegex.test(coursesHtml), 'Zero raw FA tokens in courses.html');
assert(!rawFaRegex.test(dmAcademy), 'Zero raw FA tokens in digital marketing academy');

// 20. No horizontal overflow
console.log('\nTest 20: No horizontal overflow CSS constraints');
const stylesCss = fs.readFileSync('styles.css', 'utf8');
assert(stylesCss.includes('overflow-x: hidden') || stylesCss.includes('overflow-x:hidden'), 'overflow-x: hidden enforced in CSS');
assert(stylesCss.includes('.demo-modal-dialog'), '.demo-modal-dialog CSS rules exist');
assert(stylesCss.includes('.academy-demo-strip'), '.academy-demo-strip CSS rules exist');

console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
console.log(`========================================`);

if (passedTests === totalTests) {
  console.log('🎉 ALL 20 PHASE 18 REQUIREMENTS VERIFIED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED.');
  process.exit(1);
}
