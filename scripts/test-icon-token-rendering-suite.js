const fs = require('fs');
const path = require('path');
const { NS_COURSES, NS_ACADEMIES } = require('../data.js');
const { getAcademyIcon, renderCourseIcon, renderAcademyTagHtml } = require('../js/icon-system.js');

console.log('================================================================');
console.log('🔬 NOVA SKILLS GLOBAL ICON TOKEN RENDERING & ARCHITECTURE SUITE');
console.log('================================================================\n');

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

// -------------------------------------------------------------
// TEST SUITE 1: SOURCE DATA INTEGRITY & RAW TOKEN SANITIZATION
// -------------------------------------------------------------
console.log('--- SUITE 1: Source Course & Academy Data Integrity ---');

assert(NS_COURSES && NS_COURSES.length === 109, `Master course catalog contains exactly 109 courses (found: ${NS_COURSES.length})`);
assert(NS_ACADEMIES && NS_ACADEMIES.length === 12, `Master registry contains exactly 12 academies (found: ${NS_ACADEMIES.length})`);

// Check Course #15
const c15 = NS_COURSES.find(c => c.id === 'nocode-web-pro' || c.number === 15);
assert(c15 && c15.price === 19900, `Course #15 (No-Code Website Professional) fee is strictly ₹19,900 (found: ₹${c15?.price})`);

// Check zero Font Awesome class tokens in data.js
const faCoursesInData = NS_COURSES.filter(c => typeof c.icon === 'string' && /fa[sbrl]?\s+fa-[a-z0-9-]+|fa-[a-z0-9-]+/i.test(c.icon));
assert(faCoursesInData.length === 0, `ZERO courses in NS_COURSES contain raw Font Awesome class strings (found: ${faCoursesInData.length})`);

// Check all 5 reported courses have valid clean semantic icons in data.js
const copilot = NS_COURSES.find(c => c.id === 'microsoft-copilot');
const tally = NS_COURSES.find(c => c.id === 'tally-gst');
const notion = NS_COURSES.find(c => c.id === 'notion-cert');
const clickup = NS_COURSES.find(c => c.id === 'clickup-cert');
const gworkspace = NS_COURSES.find(c => c.id === 'google-workspace');

assert(copilot && copilot.icon === '🤖', `microsoft-copilot has valid robot visual (found: '${copilot?.icon}')`);
assert(tally && tally.icon === '🧮', `tally-gst has valid calculator visual (found: '${tally?.icon}')`);
assert(notion && notion.icon === '🧊', `notion-cert has valid cubes visual (found: '${notion?.icon}')`);
assert(clickup && clickup.icon === '☑️', `clickup-cert has valid tasks visual (found: '${clickup?.icon}')`);
assert(gworkspace && gworkspace.icon === '☁️', `google-workspace has valid cloud visual (found: '${gworkspace?.icon}')`);

// -------------------------------------------------------------
// TEST SUITE 2: SAFE ICON RESOLVER & ACADEMY TAG ARCHITECTURE
// -------------------------------------------------------------
console.log('\n--- SUITE 2: Safe Icon Resolver & Registry ---');

// Test that passing raw Font Awesome class strings NEVER leaks raw text
const rawTokens = ['fas fa-robot', 'fas fa-calculator', 'fas fa-cubes', 'fas fa-tasks', 'fas fa-cloud', 'fa-solid fa-briefcase'];
rawTokens.forEach(token => {
  const rendered = renderCourseIcon(token);
  assert(!rendered.includes(`>${token}<`) && !rendered.endsWith(`>${token}`), `renderCourseIcon('${token}') does NOT expose raw class string as visible text`);
  assert(rendered.includes('<svg') || rendered.includes('course-banner-emoji'), `renderCourseIcon('${token}') safely renders SVG or styled emoji visual`);
});

// Test academy tag separation: Office Productivity Academy MUST use 📋
const officeAcadTag = renderAcademyTagHtml('office');
assert(officeAcadTag.includes('📋') && officeAcadTag.includes('Office Productivity Academy'), `renderAcademyTagHtml('office') yields official office icon '📋' (found: '${officeAcadTag}')`);
assert(!officeAcadTag.includes('🤖') && !officeAcadTag.includes('fas fa-robot'), `renderAcademyTagHtml('office') never inherits course-specific robot token`);

// Verify all 12 academies have their official icons
const expectedAcademyIcons = {
  'digital-marketing': '📊',
  'ai': '🤖',
  'design': '🎨',
  'programming': '💻',
  'nocode': '🌐',
  'video': '🎬',
  '3d': '🏗️',
  'career': '💼',
  'communication': '💬',
  'kids': '👨‍💻',
  'creator': '🎥',
  'office': '📋'
};

for (const [acadId, expectedIcon] of Object.entries(expectedAcademyIcons)) {
  const actualIcon = getAcademyIcon(acadId);
  assert(actualIcon === expectedIcon, `Academy '${acadId}' official icon is '${expectedIcon}' (found: '${actualIcon}')`);
}

// -------------------------------------------------------------
// TEST SUITE 3: STATIC HTML AUDIT ACROSS ALL CATALOGUES & PAGES
// -------------------------------------------------------------
console.log('\n--- SUITE 3: Static HTML Raw Token Audit ---');

const filesToAudit = [
  'courses.html',
  'index.html',
  'course-detail.html',
  'academies/office-productivity/index.html',
  'academies/digital-marketing/index.html',
  'academies/ai/index.html',
  'academies/design/index.html',
  'academies/programming/index.html',
  'academies/no-code-web/index.html',
  'academies/video-motion/index.html',
  'academies/3d/index.html',
  'academies/career-freelancing/index.html',
  'academies/communication/index.html',
  'academies/kids-tech/index.html',
  'academies/creator/index.html'
];

const RAW_TOKEN_PATTERNS = [
  />\s*fas\s+fa-[a-z0-9-]+\s*</i,
  />\s*fa-solid\s+fa-[a-z0-9-]+\s*</i,
  />\s*fa-brands\s+fa-[a-z0-9-]+\s*</i,
  />\s*fa-[a-z0-9-]+\s*</i,
  /fas fa-robot/i,
  /fas fa-calculator/i,
  /fas fa-cubes/i,
  /fas fa-tasks/i,
  /fas fa-cloud/i
];

filesToAudit.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    let hasLeak = false;
    let leakedMatch = '';
    for (const pattern of RAW_TOKEN_PATTERNS) {
      const match = content.match(pattern);
      if (match) {
        hasLeak = true;
        leakedMatch = match[0];
        break;
      }
    }
    assert(!hasLeak, `${file} contains ZERO raw Font Awesome class tokens (match: '${leakedMatch}')`);
  }
});

// -------------------------------------------------------------
// TEST SUITE 4: SPECIFIC CARD VERIFICATION (REPORTED DEFECTS)
// -------------------------------------------------------------
console.log('\n--- SUITE 4: Verification of 5 Reported Course Cards ---');

const coursesHtml = fs.readFileSync('courses.html', 'utf8');
const officeHtml = fs.readFileSync('academies/office-productivity/index.html', 'utf8');

const reportedCourses = [
  { id: 'microsoft-copilot', name: 'Microsoft 365 Copilot', expectedIcon: '🤖' },
  { id: 'tally-gst', name: 'TallyPrime', expectedIcon: '🧮' },
  { id: 'notion-cert', name: 'Notion', expectedIcon: '🧊' },
  { id: 'clickup-cert', name: 'ClickUp', expectedIcon: '☑️' },
  { id: 'google-workspace', name: 'Google Workspace', expectedIcon: '☁️' }
];

reportedCourses.forEach(c => {
  // Check in courses.html
  const inCourses = coursesHtml.includes(c.id);
  assert(inCourses, `courses.html includes ${c.name} (${c.id})`);
  
  // Check in office-productivity academy
  const inOffice = officeHtml.includes(c.id);
  assert(inOffice, `office-productivity academy includes ${c.name} (${c.id})`);
  
  // Check banner icon in office-productivity academy
  const cardStart = officeHtml.lastIndexOf('<div class="course-card', officeHtml.indexOf(c.id));
  const cardEnd = officeHtml.indexOf('</div>\n    </div>', officeHtml.indexOf(c.id));
  const cardChunk = officeHtml.substring(cardStart, cardEnd + 20);
  
  assert(cardChunk.includes(c.expectedIcon), `${c.name} card displays expected visual '${c.expectedIcon}'`);
  assert(cardChunk.includes('Office Productivity Academy') && cardChunk.includes('📋'), `${c.name} card displays official academy tag '📋 Office Productivity Academy'`);
  assert(!cardChunk.includes('fas fa-') && !cardChunk.includes('fa-solid'), `${c.name} card contains ZERO raw class names`);
});

// -------------------------------------------------------------
// TEST SUITE 5: 109 COURSE BANNER & ACADEMY TAG AUDIT
// -------------------------------------------------------------
console.log('\n--- SUITE 5: Global 109-Course Catalogue Card Audit ---');

let validBannersCount = 0;
let validAcademyTagsCount = 0;
let zeroRawClassCount = 0;

NS_COURSES.forEach(course => {
  const cardIdx = coursesHtml.lastIndexOf(course.id);
  if (cardIdx !== -1) {
    const cardStart = coursesHtml.lastIndexOf('<div class="course-card"', cardIdx);
    const cardEnd = coursesHtml.indexOf('</div>\n    </div>', cardIdx);
    if (cardStart !== -1 && cardEnd !== -1) {
      const card = coursesHtml.substring(cardStart, cardEnd + 20);
      
      const hasThumb = card.includes('class="course-thumb-bg"');
      const hasTag = card.includes('class="course-academy-tag"');
      const hasRawClass = /fas\s+fa-|fa-solid|fa-brands/i.test(card);
      
      if (hasThumb) validBannersCount++;
      if (hasTag) validAcademyTagsCount++;
      if (!hasRawClass) zeroRawClassCount++;
    }
  }
});

assert(validBannersCount === 109, `All 109 course cards in courses.html have valid thumbnail banners (found: ${validBannersCount}/109)`);
assert(validAcademyTagsCount === 109, `All 109 course cards in courses.html have valid academy tags (found: ${validAcademyTagsCount}/109)`);
assert(zeroRawClassCount === 109, `All 109 course cards in courses.html have ZERO raw class tokens (found: ${zeroRawClassCount}/109)`);

// -------------------------------------------------------------
// TEST SUMMARY
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`SUMMARY: Total Tests: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ICON RENDERING & ARCHITECTURE TESTS PASSED WITH 100% SUCCESS.');
  process.exit(0);
}
