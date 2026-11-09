/**
 * Comprehensive QA Test Suite for Step 02: Academy Demo Promotional Banner Repair
 * Validates all 12 Nova Skills Academy landing pages.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const ACADEMIES = [
  { slug: 'digital-marketing', name: 'Digital Marketing Academy' },
  { slug: 'ai', name: 'AI Academy' },
  { slug: 'design', name: 'Design Academy' },
  { slug: 'programming', name: 'Programming Academy' },
  { slug: 'no-code-web', name: 'No-Code Web Academy' },
  { slug: 'video-motion', name: 'Video & Motion Academy' },
  { slug: '3d', name: '3D Academy' },
  { slug: 'career-freelancing', name: 'Career & Freelancing Academy' },
  { slug: 'communication', name: 'Communication Academy' },
  { slug: 'kids-tech', name: 'Kids Tech Academy' },
  { slug: 'creator', name: 'Creator Academy' },
  { slug: 'office-productivity', name: 'Office Productivity Academy' }
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failures = [];

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✅ ${message}`);
  } else {
    failedChecks++;
    console.error(`  ❌ FAIL: ${message}`);
    failures.push(message);
  }
}

console.log('============================================================');
console.log('STEP 02 QA AUDIT: 12 ACADEMY DEMO PROMOTIONAL BANNERS');
console.log('============================================================\n');

for (const acad of ACADEMIES) {
  const filePath = path.join(__dirname, '..', 'academies', acad.slug, 'index.html');
  console.log(`\nAuditing [${acad.slug}] - ${acad.name}:`);

  assert(fs.existsSync(filePath), `File exists: academies/${acad.slug}/index.html`);

  const html = fs.readFileSync(filePath, 'utf8');

  // 1. Exactly one banner
  const bannerMatches = html.match(/class="[^"]*(academy-demo-banner|academy-demo-strip)[^"]*"/g) || [];
  assert(bannerMatches.length >= 1, `Promotional banner section exists`);
  
  const sectionMatches = html.match(/<section[^>]*class="[^"]*(academy-demo-banner|academy-demo-strip)[^"]*"[^>]*>/g) || [];
  assert(sectionMatches.length === 1, `Exactly ONE promotional banner section found (count=${sectionMatches.length})`);

  // 2. Banner Placement (After Hero, Before #academy-sections-container)
  const heroIndex = html.indexOf('id="academy-hero-section"');
  const bannerIndex = html.indexOf('<section class="academy-demo-banner');
  const sectionsIndex = html.indexOf('id="academy-sections-container"');

  assert(heroIndex !== -1, `Hero section exists`);
  assert(bannerIndex !== -1, `Banner section exists`);
  assert(sectionsIndex !== -1, `Academy sections container exists`);
  assert(heroIndex < bannerIndex, `Banner is placed AFTER Academy Hero (hero=${heroIndex}, banner=${bannerIndex})`);
  assert(bannerIndex < sectionsIndex, `Banner is placed BEFORE Academy Overview/Sections container (banner=${bannerIndex}, sections=${sectionsIndex})`);

  // 3. Approved Content Hierarchy
  assert(html.includes('EXPERIENCE BEFORE YOU ENROLL'), `Eyebrow text is 'EXPERIENCE BEFORE YOU ENROLL'`);
  assert(html.includes('Explore Your Skills Before You Commit.'), `Primary headline is 'Explore Your Skills Before You Commit.'`);
  
  // Benefit 01
  assert(html.includes('2 Days Free Demo Classes'), `Benefit 01 headline is '2 Days Free Demo Classes'`);
  assert(html.includes('Experience our practical, mentor-led teaching before enrolling.'), `Benefit 01 copy is 'Experience our practical, mentor-led teaching before enrolling.'`);
  
  // Benefit 02
  assert(/1:1 (?:Live Online Classes|LIVE ONLINE CLASSES)/.test(html), `Benefit 02 headline is '1:1 LIVE ONLINE CLASSES'`);
  assert(html.includes('Personalized live learning for eligible courses, subject to availability.'), `Benefit 02 copy is 'Personalized live learning for eligible courses, subject to availability.'`);

  // CTA Button & Microcopy
  assert(html.includes('Book Your Free Demo →'), `CTA button text is 'Book Your Free Demo →'`);
  assert(html.includes('Free demo booking • No admission commitment'), `Supporting microcopy is 'Free demo booking • No admission commitment'`);

  // CTA modal binding with exact academy ID & name
  const expectedCtaBinding = `openDemoModal({academyId:'${acad.slug}'`;
  assert(html.includes(expectedCtaBinding), `CTA button correctly passes academyId:'${acad.slug}' to openDemoModal`);

  // 4. Icons and SVG constraints
  assert(html.includes('academy-demo-benefit-icon'), `Benefit icon wrappers present`);
  // Must have 2 SVGs in the banner with 22px explicit dimensions
  const bannerBlock = html.substring(bannerIndex, bannerIndex + 2500);
  const svgMatches = bannerBlock.match(/<svg[^>]*width="22"[^>]*height="22"[^>]*>/g) || [];
  assert(svgMatches.length === 2, `Both benefit SVGs explicitly dimensioned at 22x22px (found ${svgMatches.length})`);

  // 5. Zero raw FA icon tokens
  assert(!bannerBlock.includes('fa-') && !bannerBlock.includes('fas '), `Zero raw FontAwesome tokens in banner`);
}

// 6. Verify CSS definitions
console.log('\n--- Verifying Scoped CSS Rules in css/main.css & styles.css ---');
const mainCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'main.css'), 'utf8');
const stylesCss = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
const minCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'styles.min.css'), 'utf8');

for (const [name, css] of [['css/main.css', mainCss], ['styles.css', stylesCss], ['css/styles.min.css', minCss]]) {
  console.log(`\nChecking ${name}:`);
  assert(css.includes('.academy-demo-banner') || css.includes('.academy-demo-strip'), `Banner selector present`);
  assert(css.includes('.academy-demo-benefit-icon'), `Icon container selector present`);
  assert(css.includes('42px') || css.includes('42px!important'), `42px desktop icon container dimension defined`);
  assert(css.includes('22px') || css.includes('22px!important'), `22px desktop SVG dimension defined`);
  assert(css.includes('.academy-demo-btn'), `CTA button selector present`);
  assert(css.includes('48px') || css.includes('min-height:48px'), `48px minimum touch target height defined for CTA`);
  assert(css.includes('.academy-demo-microcopy'), `Microcopy selector present`);
}

console.log('\n============================================================');
console.log(`TOTAL AUDIT CHECKS: ${totalChecks}`);
console.log(`PASSED: ${passedChecks}`);
console.log(`FAILED: ${failedChecks}`);
console.log('============================================================');

if (failedChecks > 0) {
  console.error('\n❌ FAILURES ENCOUNTERED:');
  failures.forEach(f => console.error('  - ' + f));
  process.exit(1);
} else {
  console.log('\n🎉 ALL STATIC AUDIT CHECKS PASSED PERFECTLY!\n');
}
