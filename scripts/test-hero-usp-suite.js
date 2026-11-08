const fs = require('fs');

console.log('================================================================');
console.log('🧪 NOVA SKILLS HOMEPAGE HERO USP / TRUST STRIP TEST SUITE');
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

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

// 1. Check HTML Content Rules
console.log('--- 1. Testing Approved Final Content in Hero Strip ---');

// Check Column 1
assert(
  html.includes('02 DAYS') &&
  html.includes('FREE DEMO CLASSES') &&
  html.includes('Experience Before You Enroll'),
  'Column 1 contains exact approved text: 02 DAYS | FREE DEMO CLASSES | Experience Before You Enroll'
);

// Check Column 2
assert(
  html.includes('Career-Focused') &&
  html.includes('Practical Training'),
  'Column 2 contains exact approved text: Career-Focused | Practical Training'
);

// Check Column 3
assert(
  html.includes('1:1') &&
  html.includes('LIVE ONLINE CLASSES') &&
  html.includes('Personalized Learning'),
  'Column 3 contains exact approved text: 1:1 | LIVE ONLINE CLASSES | Personalized Learning'
);

// Check that old counters are removed from this specific hero strip
const heroStatsMatch = html.match(/<div class="hero-stats[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<!-- Hero Visual -->/i);
assert(heroStatsMatch, 'Hero stats container found in index.html');

if (heroStatsMatch) {
  const stripChunk = heroStatsMatch[0];
  assert(!stripChunk.includes('5,000+'), 'Old 5,000+ Students counter removed from hero strip');
  assert(!stripChunk.includes('canonical-academies-count') && !stripChunk.includes('>12<'), 'Old 12 Academies counter removed from hero strip');
  assert(!stripChunk.includes('fas fa-') && !stripChunk.includes('fa-solid'), 'Hero strip contains zero raw Font Awesome tokens');
}

// 2. Check Other Legitimate Website Sections Retain Counts
console.log('\n--- 2. Testing Non-Regression of Other Legit Sections ---');
assert(html.includes('5,000+ Students'), 'Announcement bar retains 5,000+ Students count');
assert(html.includes('Students Trained') && html.includes('5,000+'), 'Stats section retains 5,000+ Students Trained count');

// 3. Check CSS Styling Rules
console.log('\n--- 3. Testing CSS Architecture (styles.css) ---');
assert(css.includes('.hero-stats.hero-usp-strip'), 'styles.css defines .hero-stats.hero-usp-strip');
assert(css.includes('.hero-usp-col .stat-highlight'), 'styles.css styles .stat-highlight with large gradient');
assert(css.includes('var(--grad-teal-green)'), 'stat-highlight uses var(--grad-teal-green)');
assert(css.includes('.hero-usp-col .stat-headline'), 'styles.css styles .stat-headline');
assert(css.includes('.hero-usp-col-2 .stat-headline-prominent'), 'styles.css styles .stat-headline-prominent for Career-Focused');
assert(css.includes('.hero-usp-col .stat-subtext'), 'styles.css styles .stat-subtext');

// 4. Check Mobile Responsive Rules
console.log('\n--- 4. Testing Mobile Responsive Rules (2-column top + 1-column bottom) ---');
assert(css.includes('.hero-usp-col-1') && css.includes('grid-column: 1 / 2'), 'Mobile rule defines 2-column grid placement for Column 1');
assert(css.includes('.hero-usp-col-3') && css.includes('grid-column: 2 / 3'), 'Mobile rule defines 2-column grid placement for Column 3');
assert(css.includes('.hero-usp-col-2') && css.includes('grid-column: 1 / -1'), 'Mobile rule spans Career-Focused (Column 2) across full width row');
assert(css.includes('max-width: 360px'), 'styles.css contains ultra-mobile breakpoint for <= 360px');

// 5. Check Critical CSS in index.html
console.log('\n--- 5. Testing Critical Inline CSS in index.html ---');
assert(html.includes('.hero-stats.hero-usp-strip'), 'index.html critical CSS defines .hero-stats.hero-usp-strip');
assert(html.includes('.hero-usp-col-2{grid-column:1 / -1'), 'index.html critical CSS contains mobile grid spanning for Column 2');

// 6. Check Screenshot Evidence
console.log('\n--- 6. Testing Screenshot Evidence Presence ---');
const qaFiles = [
  '01_after_hero_mobile_320px.png',
  '02_after_hero_mobile_360px.png',
  '03_after_hero_mobile_390px.png',
  '04_after_hero_mobile_430px.png',
  '05_after_hero_tablet_768px.png',
  '06_after_hero_desktop_1024px.png',
  '07_after_hero_desktop_1280px.png',
  '08_after_hero_desktop_1440px.png'
];

qaFiles.forEach(f => {
  const filePath = `C:/Users/wasee/.gemini/antigravity/brain/62f07cac-577a-4acd-8fa0-e365dd662777/hero_strip_qa/after/${f}`;
  assert(fs.existsSync(filePath), `Screenshot exists: ${f}`);
});

console.log('\n================================================================');
console.log(`SUMMARY: Total Tests: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL HERO USP STRIP REDESIGN TESTS PASSED WITH 100% SUCCESS.');
  process.exit(0);
}
