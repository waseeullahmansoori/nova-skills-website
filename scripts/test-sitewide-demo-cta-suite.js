const fs = require('fs');
const path = require('path');
const { NS_COURSES, NS_ACADEMIES } = require('../data.js');

function isCourseDemoEligible(course) {
  if (!course) return false;
  if (typeof course.demo_available === 'boolean') return course.demo_available;
  const type = (course.course_type || course.type || course.programLevel || '').toUpperCase();
  if (['MASTER', 'PROFESSIONAL', 'SPECIALIZATION', 'FOUNDATION', 'CAREER'].some(t => type.includes(t))) {
    return true;
  }
  const price = Math.max(
    typeof course.originalPrice === 'number' ? course.originalPrice : 0,
    typeof course.price === 'number' ? course.price : parseInt(String(course.price || '').replace(/\D/g, ''), 10) || 0
  );
  if (price >= 12000) return true;
  return false;
}

const ACADEMY_SLUG_MAP = {
  'digital-marketing': 'digital-marketing',
  'ai': 'ai',
  'design': 'design',
  'programming': 'programming',
  'no-code-web': 'nocode',
  'video-motion': 'video',
  '3d': '3d',
  'career-freelancing': 'career',
  'communication': 'communication',
  'kids-tech': 'kids',
  'creator': 'creator',
  'office-productivity': 'office'
};

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function assert(condition, message) {
  if (condition) {
    results.passed++;
    results.tests.push({ status: 'PASS', message });
    console.log(`  ✅ PASS: ${message}`);
  } else {
    results.failed++;
    results.tests.push({ status: 'FAIL', message });
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('=== RUNNING SITEWIDE FREE DEMO CTA VERIFICATION SUITE ===\n');

// TEST GROUP 1: HOMEPAGE (index.html)
console.log('--- TEST GROUP 1: Homepage (index.html) ---');
const homeHtml = fs.readFileSync('index.html', 'utf8');

// 1.1 Announcement bar
assert(
  homeHtml.includes("openDemoModal({sourceCta:'announcement_bar'})"),
  'Homepage Announcement bar Demo CTA has correct onclick and sourceCta'
);

// 1.2 Hero primary CTA
assert(
  homeHtml.includes("id=\"hero-cta-primary\"") && homeHtml.includes("openDemoModal({sourceCta:'hero_primary'})"),
  'Homepage Hero primary Demo CTA has correct onclick and sourceCta'
);

// 1.3 Hero USP
assert(
  homeHtml.includes("openDemoModal({sourceCta:'hero_usp_demo'})"),
  'Homepage Hero USP item 01 has correct onclick and sourceCta'
);

// 1.4 Learning Journey Step 02
assert(
  homeHtml.includes("learning_journey_step02") && homeHtml.includes("Book Free Demo →"),
  'Homepage Learning Journey Step 02 has actionable Book Free Demo link'
);

// 1.5 FAQ links
assert(
  homeHtml.includes("faq_booking_link") && homeHtml.includes("faq_general_demo"),
  'Homepage FAQ questions link to openDemoModal'
);

// 1.6 Footer link
assert(
  homeHtml.includes("openDemoModal({sourceCta:'footer_quick_link'})"),
  'Homepage Footer has actionable Book a Free Demo link'
);

// 1.7 Featured course cards (all 6 must have demo chip)
const homeCardMatches = homeHtml.match(/course-demo-chip/g) || [];
assert(
  homeCardMatches.length >= 6,
  `Homepage has at least 6 demo chips on featured cards (found: ${homeCardMatches.length})`
);

// TEST GROUP 2: ALL 12 ACADEMY PAGES
console.log('\n--- TEST GROUP 2: All 12 Academy Pages ---');
const academySlugs = Object.keys(ACADEMY_SLUG_MAP);

academySlugs.forEach(slug => {
  const acadPath = path.join('academies', slug, 'index.html');
  assert(fs.existsSync(acadPath), `Academy page exists: ${acadPath}`);
  
  const acadHtml = fs.readFileSync(acadPath, 'utf8');

  // Hero CTA
  assert(
    acadHtml.includes('btn-academy-hero-demo') && acadHtml.includes(`academyId:'${slug}'`) && acadHtml.includes("sourceCta:'academy_hero'"),
    `Academy ${slug} Hero has Book Free Demo CTA with academy context`
  );

  // Promotional Banner CTA
  assert(
    acadHtml.includes('academy-demo-btn') && acadHtml.includes(`academyId:'${slug}'`) && acadHtml.includes("sourceCta:'academy_demo_banner'"),
    `Academy ${slug} Promotional Banner has Book Your Free Demo CTA with academy context`
  );

  // Cards parity
  const acadId = ACADEMY_SLUG_MAP[slug];
  const acadCourses = NS_COURSES.filter(c => c.academyId === acadId);
  const eligibleCourses = acadCourses.filter(isCourseDemoEligible);
  const eligibleCount = eligibleCourses.length;
  
  // Count chips
  const chipCount = (acadHtml.match(/class="course-demo-chip"/g) || []).length;
  assert(
    chipCount >= eligibleCount && chipCount % eligibleCount === 0,
    `Academy ${slug} renders demo chips for eligible courses (found: ${chipCount}, eligible courses: ${eligibleCount})`
  );
});

// TEST GROUP 3: COURSES CATALOGUE (courses.html)
console.log('\n--- TEST GROUP 3: Main Courses Catalogue (courses.html) ---');
const coursesHtml = fs.readFileSync('courses.html', 'utf8');
const totalEligibleCourses = NS_COURSES.filter(isCourseDemoEligible).length;
const catalogueChips = (coursesHtml.match(/class="course-demo-chip"/g) || []).length;

assert(
  catalogueChips === totalEligibleCourses,
  `courses.html renders exactly ${totalEligibleCourses} demo chips matching all eligible courses (found: ${catalogueChips})`
);

// TEST GROUP 4: ALL 109 COURSE DETAIL PAGES
console.log('\n--- TEST GROUP 4: All 109 Course Detail Pages ---');
let eligibleCdpWithDemo = 0;
let ineligibleCdpWithoutDemo = 0;

NS_COURSES.forEach(course => {
  const cdpPath = path.join('_rendered_courses', `${course.id}.html`);
  if (!fs.existsSync(cdpPath)) {
    assert(false, `Course detail pre-rendered file missing: ${cdpPath}`);
    return;
  }
  const cdpHtml = fs.readFileSync(cdpPath, 'utf8');
  const eligible = isCourseDemoEligible(course);

  const hasDemoBtn = cdpHtml.includes('id="btn-detail-book-demo"');
  const demoItemHidden = cdpHtml.includes('id="detail-demo-item" style="display:none;"') || !cdpHtml.includes('id="detail-demo-item"');

  if (eligible) {
    if (hasDemoBtn && cdpHtml.includes(`courseId:'${course.id}'`)) {
      eligibleCdpWithDemo++;
    }
  } else {
    if (!hasDemoBtn && demoItemHidden) {
      ineligibleCdpWithoutDemo++;
    }
  }
});

assert(
  eligibleCdpWithDemo === totalEligibleCourses,
  `All ${totalEligibleCourses} eligible course detail pages render dedicated Book Free Demo button with preselected courseId (verified: ${eligibleCdpWithDemo})`
);

const totalIneligible = NS_COURSES.length - totalEligibleCourses;
assert(
  ineligibleCdpWithoutDemo === totalIneligible,
  `All ${totalIneligible} ineligible course detail pages omit the Demo button and hide demo benefit item (verified: ${ineligibleCdpWithoutDemo})`
);

// TEST GROUP 5: STRICT FORM SEPARATION
console.log('\n--- TEST GROUP 5: Strict Form Separation ---');
assert(
  homeHtml.includes("openConsultationPopup()") && !homeHtml.includes("openConsultationPopup('free_demo')"),
  'Consultation form strictly separated from Free Demo'
);
assert(
  homeHtml.includes("openEnrollmentModal(") && !homeHtml.includes("openEnrollmentModal('free_demo')"),
  'Enrollment form strictly separated from Free Demo'
);
const compJs = fs.readFileSync('components.js', 'utf8');
assert(
  compJs.includes("lead_type: 'free_demo'"),
  "Free Demo submission uses lead_type: 'free_demo'"
);

// TEST GROUP 6: CONTEXT AND DROPDOWN LOGIC
console.log('\n--- TEST GROUP 6: Context Normalization and Dropdown Logic ---');
assert(
  compJs.includes('ACADEMY_SLUG_TO_ID_MAP') && compJs.includes('normalizeDemoAcademyId'),
  'components.js contains normalizeDemoAcademyId supporting all academy slugs and IDs'
);
assert(
  compJs.includes('isEligible(c)'),
  'components.js filters dropdown options to only demo-eligible courses'
);

console.log('\n======================================================');
console.log(`SUITE RESULTS: Passed: ${results.passed} | Failed: ${results.failed}`);
console.log('======================================================');

if (results.failed > 0) {
  process.exit(1);
}
