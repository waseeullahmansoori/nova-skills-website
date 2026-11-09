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

console.log('===============================================================');
console.log('   NOVA SKILLS COURSE TAXONOMY & ACADEMY CLASSIFICATION SUITE  ');
console.log('===============================================================\n');

// 1. Expected Academy Mapping Table
const EXPECTED_ACADEMY_COUNTS = {
  'digital-marketing': { name: 'Digital Marketing Academy', career: 1, pro: 3, cert: 10, total: 14 },
  'ai': { name: 'AI & Automation Academy', career: 1, pro: 2, cert: 7, total: 10 },
  'design': { name: 'Design Academy', career: 1, pro: 2, cert: 7, total: 10 },
  'programming': { name: 'Programming Academy', career: 2, pro: 1, cert: 7, total: 10 },
  'no-code-web': { name: 'No-Code Web Academy', career: 1, pro: 1, cert: 6, total: 8 },
  'video-motion': { name: 'Video & Motion Academy', career: 1, pro: 2, cert: 5, total: 8 },
  '3d': { name: '3D Academy', career: 1, pro: 1, cert: 6, total: 8 },
  'career-freelancing': { name: 'Career & Freelancing Academy', career: 0, pro: 2, cert: 8, total: 10 },
  'communication': { name: 'Communication Academy', career: 1, pro: 1, cert: 5, total: 7 },
  'kids-tech': { name: 'Kids Tech Academy', career: 1, pro: 1, cert: 5, total: 7 },
  'creator': { name: 'Creator Academy', career: 0, pro: 2, cert: 5, total: 7 },
  'office-productivity': { name: 'Office Productivity Academy', career: 1, pro: 1, cert: 8, total: 10 }
};

const EXPECTED_CAREER_IDS = [
  'dm-mastery',
  'ai-mastery',
  'creative-design',
  'fullstack-foundation',
  'ai-assisted-full-stack-web-development',
  'ecommerce-mastery',
  'ai-integrated-video-editing-motion-graphics-professional',
  'archviz-mastery',
  'business-english',
  'kids-mastery',
  'biz-productivity'
];

const EXPECTED_PRO_IDS = [
  'dm-professional',
  'performance-marketing-specialist',
  'ecommerce-growth-marketing-specialist',
  'ai-productivity',
  'ai-for-business-pro',
  'graphic-design-pro',
  'uiux-design-pro',
  'python-developer',
  'nocode-web-pro',
  'video-pro',
  'generative-ai-video-production-professional',
  '3d-viz-pro',
  'freelancing-client-acquisition-professional',
  'career-launch-placement-readiness-professional',
  'spoken-english-pro',
  'young-coders',
  'youtube-mastery',
  'content-creator-pro',
  'office-pro'
];

const FORMER_MISCLASSIFIED_CERTS = [
  'adobe-photoshop',
  'adobe-illustrator',
  'react-cert',
  'node-js',
  'sql-basics',
  'wordpress-cert',
  'woocommerce-cert',
  'shopify-cert'
];

// --- TEST SECTION 1: data.js VERIFICATION ---
console.log('--- TEST SECTION 1: data.js Taxonomy Verification ---');

const { NS_COURSES: courses, NS_ACADEMIES: academies } = require(path.join(ROOT_DIR, 'data.js'));

assert(Array.isArray(courses) && courses.length === 109, `data.js contains exactly 109 courses (found ${courses?.length})`);
assert(Array.isArray(academies) && academies.length === 12, `data.js contains exactly 12 academies (found ${academies?.length})`);

const careerInCourses = courses.filter(c => c.programLevel === 'Career Program');
const proInCourses = courses.filter(c => c.programLevel === 'Professional Program');
const certInCourses = courses.filter(c => c.programLevel === 'Certification Course');

assert(careerInCourses.length === 11, `data.js has exactly 11 Career Programs (found ${careerInCourses.length})`);
assert(proInCourses.length === 19, `data.js has exactly 19 Professional Programs (found ${proInCourses.length})`);
assert(certInCourses.length === 79, `data.js has exactly 79 Certification Courses (found ${certInCourses.length})`);
assert(careerInCourses.length + proInCourses.length + certInCourses.length === 109, 'Sum of all categories equals 109');

// Verify all 11 Career IDs
EXPECTED_CAREER_IDS.forEach(id => {
  const match = courses.find(c => c.id === id);
  assert(match && match.programLevel === 'Career Program', `Course ${id} classified as Career Program in NS_COURSES`);
});

// Verify all 19 Pro IDs
EXPECTED_PRO_IDS.forEach(id => {
  const match = courses.find(c => c.id === id);
  assert(match && match.programLevel === 'Professional Program', `Course ${id} classified as Professional Program in NS_COURSES`);
});

// Verify former misclassified certs
FORMER_MISCLASSIFIED_CERTS.forEach(id => {
  const match = courses.find(c => c.id === id);
  assert(match && match.programLevel === 'Certification Course', `Course ${id} classified as Certification Course in NS_COURSES`);
});

// Verify Course 15 integrity
const c15 = courses.find(c => c.id === 'nocode-web-pro');
assert(c15 && c15.price === 19900 && c15.originalPrice === 19900, 'Course 15 price is exactly ₹19,900 with zero fake discount');

// --- TEST SECTION 2: js/data.min.js VERIFICATION ---
console.log('\n--- TEST SECTION 2: js/data.min.js Bundle Verification ---');
const { NS_COURSES: minCourses } = require(path.join(ROOT_DIR, 'js', 'data.min.js'));
const minCareer = minCourses.filter(c => c.programLevel === 'Career Program');
const minPro = minCourses.filter(c => c.programLevel === 'Professional Program');
const minCert = minCourses.filter(c => c.programLevel === 'Certification Course');

assert(minCourses && minCourses.length === 109, `js/data.min.js contains exactly 109 courses (found ${minCourses?.length})`);
assert(minCareer.length === 11, `js/data.min.js has exactly 11 Career Programs (found ${minCareer.length})`);
assert(minPro.length === 19, `js/data.min.js has exactly 19 Professional Programs (found ${minPro.length})`);
assert(minCert.length === 79, `js/data.min.js has exactly 79 Certification Courses (found ${minCert.length})`);

// --- TEST SECTION 3: ALL 12 ACADEMY LANDING PAGES HTML VERIFICATION ---
console.log('\n--- TEST SECTION 3: All 12 Academy Landing Pages HTML Verification ---');

Object.entries(EXPECTED_ACADEMY_COUNTS).forEach(([slug, expected]) => {
  const pagePath = path.join(ROOT_DIR, 'academies', slug, 'index.html');
  assert(fs.existsSync(pagePath), `Academy page exists: academies/${slug}/index.html`);
  
  if (fs.existsSync(pagePath)) {
    const html = fs.readFileSync(pagePath, 'utf8');

    // 1. Stats Pills in Hero
    const careerPill = `💼 Career Programs: ${expected.career}`;
    const proPill = `⚡ Professional Programs: ${expected.pro}`;
    const certPill = `📜 Certification Courses: ${expected.cert}`;
    const totalPill = `📚 Total Courses: ${expected.total}`;

    assert(html.includes(careerPill), `[${slug}] Contains accurate Career Programs stat pill: "${careerPill}"`);
    assert(html.includes(proPill), `[${slug}] Contains accurate Professional Programs stat pill: "${proPill}"`);
    assert(html.includes(certPill), `[${slug}] Contains accurate Certification Courses stat pill: "${certPill}"`);
    assert(html.includes(totalPill), `[${slug}] Contains accurate Total Courses stat pill: "${totalPill}"`);

    // 2. Explorer Filter Buttons
    const expCareerBtn = `Career Programs (${expected.career})`;
    const expProBtn = `Professional Programs (${expected.pro})`;
    const expCertBtn = `Certification Courses (${expected.cert})`;
    const expTotalBtn = `All (${expected.total})`;

    assert(html.includes(expCareerBtn), `[${slug}] Explorer tab button matches Career count: "${expCareerBtn}"`);
    assert(html.includes(expProBtn), `[${slug}] Explorer tab button matches Professional count: "${expProBtn}"`);
    assert(html.includes(expCertBtn), `[${slug}] Explorer tab button matches Certification count: "${expCertBtn}"`);
    assert(html.includes(expTotalBtn), `[${slug}] Explorer tab button matches Total count: "${expTotalBtn}"`);

    // 3. Section Presence
    if (expected.career > 0) {
      assert(html.includes('class="section-career-programs"'), `[${slug}] section-career-programs present for ${expected.career} courses`);
    } else {
      assert(!html.includes('class="section-career-programs"'), `[${slug}] section-career-programs omitted since career count is 0`);
    }

    if (expected.pro > 0) {
      assert(html.includes('class="section-pro-programs"'), `[${slug}] section-pro-programs present for ${expected.pro} courses`);
    } else {
      assert(!html.includes('class="section-pro-programs"'), `[${slug}] section-pro-programs omitted since pro count is 0`);
    }

    if (expected.cert > 0) {
      assert(html.includes('class="section-cert-courses"'), `[${slug}] section-cert-courses present for ${expected.cert} courses`);
    } else {
      assert(!html.includes('class="section-cert-courses"'), `[${slug}] section-cert-courses omitted since cert count is 0`);
    }
  }
});

// --- TEST SECTION 4: courses.html CATALOG PRE-RENDER VERIFICATION ---
console.log('\n--- TEST SECTION 4: courses.html Pre-render Track Badges Verification ---');
const coursesHtml = fs.readFileSync(path.join(ROOT_DIR, 'courses.html'), 'utf8');

const careerBadgeCount = (coursesHtml.match(/class="course-track-pill track-career">Career Program<\/span>/g) || []).length;
const proBadgeCount = (coursesHtml.match(/class="course-track-pill track-pro">Professional Program<\/span>/g) || []).length;
const certBadgeCount = (coursesHtml.match(/class="course-track-pill track-cert">Certification Course<\/span>/g) || []).length;

assert(careerBadgeCount === 11, `courses.html contains exactly 11 track-career badges (found ${careerBadgeCount})`);
assert(proBadgeCount === 19, `courses.html contains exactly 19 track-pro badges (found ${proBadgeCount})`);
assert(certBadgeCount === 79, `courses.html contains exactly 79 track-cert badges (found ${certBadgeCount})`);

// --- SUMMARY ---
console.log('\n===============================================================');
console.log(`RESULTS: ${passedTests} passed, ${failedTests} failed out of ${totalTests} tests`);
console.log('===============================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL COURSE CLASSIFICATION & ACADEMY TESTS PASSED (100%)!\n');
}
