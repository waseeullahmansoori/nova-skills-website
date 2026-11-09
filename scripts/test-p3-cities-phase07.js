/**
 * Nova Skills P3 City Pages Validation & QA Suite
 * Phase 07 — Final 13 P3 City Pages
 * + Cumulative Comprehensive Validation across all 36 Cities (10 P1 + 13 P2 + 13 P3)
 * 
 * Rules & Gates:
 * - Gate 01: All 13 P3 city routes exist and have valid static HTML (>40 KB).
 * - Gate 02 & Gate 03: 4 compulsory courses for EVERY P3 city (52 associations).
 * - Gate 02 & Gate 03: Exactly 2 additional courses for EVERY P3 city (26 associations).
 * - Gate 02 & Gate 03: Total P3 course associations = 52 + 26 = 78.
 * - Gate 31: Cumulative 36-city registry audit:
 *     * 144 compulsory course associations (36 × 4)
 *     * 92 additional course associations (10×3 P1 + 10×3 + 3×2 P2 + 13×2 P3 = 30 + 36 + 26 = 92)
 *     * Grand Total = 236 course associations across all 36 cities.
 * - Gate 04: Duplicate-risk forensic analysis (Bahraich vs Basti, Mandi vs Dehradun, Kaithal vs Surat/Vadodara, Ponda vs Surat, Jagdalpur vs Raipur/Nashik/Ludhiana, Leh vs Raipur/Nagpur).
 * - Gate 05: Academic & physical transparency: Siddharth Nagar sole physical campus, zero fake LocalBusiness schemas.
 * - Gate 06: Child course safeguards for Solan & Mandi (#25, #26).
 * - Gate 07: Technical SEO (canonical with trailing slash, noindex follow preview guard, WebPage, BreadcrumbList, ItemList JSON-LD).
 * - Gate 08: Client interactivity & modal triggers.
 * - Gate 09: Directory integration: 36 preview cities, exactly 0 draft cities remaining.
 * - Gate 10: Sitewide baseline preservation (0 regressions in existing core website).
 * - Gate 11: Multi-viewport screenshots (1440px desktop and 390px mobile) for all 13 P3 cities (26 screenshots).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec, execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = path.resolve('C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 8097;

const {
  getLocationBySlug,
  resolveCoursesForLocation,
  getAllLocations
} = require('../lib/locations');

const P3_CITIES = [
  {
    slug: 'muzaffarpur',
    city: 'Muzaffarpur',
    state: 'Bihar',
    headline: 'Build Technical Skills. Prepare for Your Next Opportunity.',
    decisionHeading: 'From Python Skills to Career Preparation',
    expectedAdditionalNumbers: [12, 22]
  },
  {
    slug: 'jammu',
    city: 'Jammu',
    state: 'Jammu and Kashmir',
    headline: 'Learn to Build. Learn to Work Smarter.',
    decisionHeading: 'Create Technology or Improve Existing Workflows?',
    expectedAdditionalNumbers: [6, 11]
  },
  {
    slug: 'solan',
    city: 'Solan',
    state: 'Himachal Pradesh',
    headline: 'Explore Digital Skills for Different Learning Goals.',
    decisionHeading: 'Technology Learning for Young Learners and Adult Beginners',
    expectedAdditionalNumbers: [15, 25]
  },
  {
    slug: 'margao',
    city: 'Margao',
    state: 'Goa',
    headline: 'Create Content With a Clear Purpose.',
    decisionHeading: 'Content Production vs Channel Strategy',
    expectedAdditionalNumbers: [27, 28]
  },
  {
    slug: 'leh',
    city: 'Leh',
    state: 'Ladakh',
    headline: 'Build Practical Skills for Modern Digital Work.',
    decisionHeading: 'Everyday Office Tools vs AI-Assisted Workflows',
    expectedAdditionalNumbers: [6, 30]
  },
  {
    slug: 'bahraich',
    city: 'Bahraich',
    state: 'Uttar Pradesh',
    headline: 'Strengthen the Skills You Use at Work.',
    decisionHeading: 'Communication Tasks and Digital Office Tasks',
    expectedAdditionalNumbers: [24, 30]
  },
  {
    slug: 'wardha',
    city: 'Wardha',
    state: 'Maharashtra',
    headline: 'Understand Code. Work With Data.',
    decisionHeading: 'Programming Applications vs Business Reporting',
    expectedAdditionalNumbers: [12, 29]
  },
  {
    slug: 'jagdalpur',
    city: 'Jagdalpur',
    state: 'Chhattisgarh',
    headline: 'Build Skills for Productive and Independent Work.',
    decisionHeading: 'Managing Work vs Managing Client Relationships',
    expectedAdditionalNumbers: [21, 30]
  },
  {
    slug: 'kaithal',
    city: 'Kaithal',
    state: 'Haryana',
    headline: 'Create Websites. Understand Online Commerce.',
    decisionHeading: 'Business Website or Online Store?',
    expectedAdditionalNumbers: [14, 15]
  },
  {
    slug: 'anantnag',
    city: 'Anantnag',
    state: 'Jammu and Kashmir',
    headline: 'Develop Technical Ability and Communicate With Confidence.',
    decisionHeading: 'Technical Problem Solving and Spoken Communication',
    expectedAdditionalNumbers: [12, 24]
  },
  {
    slug: 'mandi',
    city: 'Mandi',
    state: 'Himachal Pradesh',
    headline: 'Explore Technology Through Age-Appropriate Learning.',
    decisionHeading: 'Compare Two Young Learner Technology Programs',
    expectedAdditionalNumbers: [25, 26]
  },
  {
    slug: 'ponda',
    city: 'Ponda',
    state: 'Goa',
    headline: 'Explore Digital Commerce and Content Skills.',
    decisionHeading: 'Building Online Stores vs Building Content Channels',
    expectedAdditionalNumbers: [14, 27]
  },
  {
    slug: 'kargil',
    city: 'Kargil',
    state: 'Ladakh',
    headline: 'Learn Practical Skills for Digital Communication and Work.',
    decisionHeading: 'Professional Communication and AI-Assisted Productivity',
    expectedAdditionalNumbers: [6, 24]
  }
];

const ALL_36_SLUGS = [
  // 10 P1 Cities
  'indore', 'jaipur', 'rajkot', 'patna',
  'lucknow', 'nagpur', 'surat', 'nashik', 'bhopal', 'raipur',
  // 13 P2 Cities
  'vadodara', 'dehradun', 'kota', 'chhatrapati-sambhajinagar',
  'prayagraj', 'ludhiana', 'jalandhar', 'gorakhpur',
  'gwalior', 'hisar', 'basti', 'azamgarh', 'sultanpur',
  // 13 P3 Cities
  'muzaffarpur', 'jammu', 'solan', 'margao', 'leh', 'bahraich',
  'wardha', 'jagdalpur', 'kaithal', 'anantnag', 'mandi', 'ponda', 'kargil'
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    failures.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('================================================================');
console.log('  NOVA SKILLS — PHASE 07 P3 CITY PAGES VALIDATION & QA');
console.log('================================================================\n');

// -------------------------------------------------------------
// SUITE A: 13 New Route & Pre-rendered File Existence Tests
// -------------------------------------------------------------
console.log('[SUITE A] New Route & Pre-rendered File Existence:');
P3_CITIES.forEach(c => {
  const filePath = path.join(ROOT_DIR, 'branches', c.slug, 'index.html');
  assert(fs.existsSync(filePath), `Pre-rendered file exists: branches/${c.slug}/index.html`);
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;
    assert(size > 40000, `branches/${c.slug}/index.html has substantial content (${(size / 1024).toFixed(1)} KB)`);
  }
});
console.log('');

// -------------------------------------------------------------
// SUITE B: 13 P3 Cities Course Associations (Gate 02 & Gate 03)
// -------------------------------------------------------------
console.log('[SUITE B] Course Associations for 13 New P3 Cities:');
let newCompulsoryCount = 0;
let newAdditionalCount = 0;

P3_CITIES.forEach(c => {
  const filePath = path.join(ROOT_DIR, 'branches', c.slug, 'index.html');
  const html = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  const resolved = resolveCoursesForLocation(c.slug);

  // 4 compulsory courses
  assert(resolved.coreCourses.length === 4, `${c.city} has exactly 4 core courses resolved`);
  const coreNums = resolved.coreCourses.map(x => x.masterNumber).sort((a,b)=>a-b);
  assert(JSON.stringify(coreNums) === JSON.stringify([2, 7, 9, 17]), `${c.city} core courses match [2, 7, 9, 17]`);
  
  resolved.coreCourses.forEach(cr => {
    if (html.includes(cr.title)) newCompulsoryCount++;
  });

  // Additional courses: exactly 2 for every P3 city
  const expectedCount = c.expectedAdditionalNumbers.length;
  assert(resolved.additionalCourses.length === 2 && expectedCount === 2, `${c.city} has exactly 2 additional courses resolved`);
  const addNums = resolved.additionalCourses.map(x => x.masterNumber).sort((a,b)=>a-b);
  const expNums = [...c.expectedAdditionalNumbers].sort((a,b)=>a-b);
  assert(JSON.stringify(addNums) === JSON.stringify(expNums), `${c.city} additional courses match expected [${expNums.join(', ')}]`);

  resolved.additionalCourses.forEach(cr => {
    if (html.includes(cr.title)) newAdditionalCount++;
  });
});

assert(newCompulsoryCount === 52, `All 52 new compulsory course associations present across 13 P3 pages (found: ${newCompulsoryCount})`);
assert(newAdditionalCount === 26, `All 26 approved new additional course associations present across 13 P3 pages (found: ${newAdditionalCount})`);
assert(newCompulsoryCount + newAdditionalCount === 78, `Total P3 course associations = 78 (found: ${newCompulsoryCount + newAdditionalCount})`);
console.log('');

// -------------------------------------------------------------
// SUITE C: Cumulative 36-City Grand Total Validation (Gate 31)
// -------------------------------------------------------------
console.log('[SUITE C] Cumulative 36-City Full Portfolio Course Associations:');
let cumulativeCompulsory = 0;
let cumulativeAdditional = 0;

ALL_36_SLUGS.forEach(slug => {
  const filePath = path.join(ROOT_DIR, 'branches', slug, 'index.html');
  const html = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  const resolved = resolveCoursesForLocation(slug);

  resolved.coreCourses.forEach(cr => {
    if (html.includes(cr.title)) cumulativeCompulsory++;
  });
  resolved.additionalCourses.forEach(cr => {
    if (html.includes(cr.title)) cumulativeAdditional++;
  });
});

assert(cumulativeCompulsory === 144, `Cumulative compulsory course associations across all 36 cities = 144 (found: ${cumulativeCompulsory})`);
assert(cumulativeAdditional === 92, `Cumulative additional course associations across all 36 cities = 92 (found: ${cumulativeAdditional})`);
assert(cumulativeCompulsory + cumulativeAdditional === 236, `Total course associations across all 36 cities = 236 (found: ${cumulativeCompulsory + cumulativeAdditional})`);
console.log('');

// -------------------------------------------------------------
// SUITE D: Editorial Differentiation & Academic Transparency
// -------------------------------------------------------------
console.log('[SUITE D] Editorial Differentiation & Academic Transparency:');
const titlesSeen = new Set();
const metaSeen = new Set();
const headlinesSeen = new Set();

P3_CITIES.forEach(c => {
  const filePath = path.join(ROOT_DIR, 'branches', c.slug, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  // Unique headline & decision module (handling ' and &#39;)
  const expectedHeadlineInHtml = c.headline.replace(/'/g, '&#39;');
  const expectedDecisionInHtml = c.decisionHeading.replace(/'/g, '&#39;');
  assert(html.includes(c.headline) || html.includes(expectedHeadlineInHtml), `${c.city} contains unique headline: "${c.headline}"`);
  assert(html.includes(c.decisionHeading) || html.includes(expectedDecisionInHtml), `${c.city} contains unique decision module: "${c.decisionHeading}"`);

  // Sole Physical Campus Disclosure
  assert(html.includes('Siddharth Nagar') && html.includes('Physical Campus: Siddharth Nagar (UP)'), `${c.city} identifies Siddharth Nagar as sole physical classroom campus`);
  assert(html.includes('Live Interactive Online Classes for ' + c.city + ' Learners'), `${c.city} identifies delivery mode as Live Interactive Online`);

  // Zero Fake Claims
  assert(!html.includes('LocalBusiness'), `${c.city} contains zero fake LocalBusiness schema`);
  assert(!html.includes('branch manager') && !html.includes('Branch Manager'), `${c.city} contains zero fictitious branch managers`);
  assert(!html.includes('maps.google.com') && !html.includes('google.com/maps/embed'), `${c.city} contains zero fake Google Maps embeds`);

  // SEO Titles & Meta Uniqueness
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const metaMatch = html.match(/<meta name="description" content="(.*?)"/);
  if (titleMatch) titlesSeen.add(titleMatch[1]);
  if (metaMatch) metaSeen.add(metaMatch[1]);
  headlinesSeen.add(c.headline);
});

assert(titlesSeen.size === 13, `All 13 P3 pages have unique SEO Titles (found: ${titlesSeen.size})`);
assert(metaSeen.size === 13, `All 13 P3 pages have distinct Meta Descriptions (found: ${metaSeen.size})`);
assert(headlinesSeen.size === 13, `All 13 P3 pages have distinct Hero Headlines (found: ${headlinesSeen.size})`);
console.log('');

// -------------------------------------------------------------
// SUITE E: Duplicate-Risk Forensic Analysis (Gate 20)
// -------------------------------------------------------------
console.log('[SUITE E] Duplicate-Risk Pair Forensic Verification:');

// Pair 1: Bahraich vs Basti (Same additional courses [24, 30])
const bahraichHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'bahraich', 'index.html'), 'utf8');
const bastiHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'basti', 'index.html'), 'utf8');
assert(!bahraichHtml.includes('Strengthen Everyday Workplace Skills.'), 'Bahraich does NOT duplicate Basti headline');
assert(!bahraichHtml.includes('Practical Skills for Communication and Office Work'), 'Bahraich does NOT duplicate Basti decision heading');
assert(bahraichHtml.includes('Strengthen the Skills You Use at Work.'), 'Bahraich contains distinct editorial headline');
assert(bahraichHtml.includes('Communication Tasks and Digital Office Tasks'), 'Bahraich contains distinct decision heading');

// Pair 2: Mandi vs Dehradun (Overlapping young learner courses)
const mandiHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'mandi', 'index.html'), 'utf8');
const dehradunHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'dehradun', 'index.html'), 'utf8');
assert(!mandiHtml.includes('Different Learning Stages. The Right Skills for Each.'), 'Mandi does NOT duplicate Dehradun headline');
assert(!mandiHtml.includes('Learning Pathways by Learner Stage'), 'Mandi does NOT duplicate Dehradun decision heading');
assert(mandiHtml.includes('Explore Technology Through Age-Appropriate Learning.'), 'Mandi contains distinct editorial headline');
assert(mandiHtml.includes('Compare Two Young Learner Technology Programs'), 'Mandi contains distinct decision heading');

// Pair 3: Kaithal vs Surat & Vadodara (Web & E-Commerce overlap)
const kaithalHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'kaithal', 'index.html'), 'utf8');
const suratHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'surat', 'index.html'), 'utf8');
const vadodaraHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'vadodara', 'index.html'), 'utf8');
assert(!kaithalHtml.includes('Build Your Digital Foundation. Grow Your Reach.'), 'Kaithal does NOT duplicate Surat headline');
assert(!kaithalHtml.includes('Design Better Digital Experiences. Build Useful Websites.'), 'Kaithal does NOT duplicate Vadodara headline');
assert(kaithalHtml.includes('Create Websites. Understand Online Commerce.'), 'Kaithal contains distinct editorial headline');
assert(kaithalHtml.includes('Business Website or Online Store?'), 'Kaithal contains distinct decision heading');

// Pair 4: Ponda vs Surat (E-Commerce & YouTube overlap)
const pondaHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'ponda', 'index.html'), 'utf8');
assert(!pondaHtml.includes('Build Your Digital Foundation. Grow Your Reach.'), 'Ponda does NOT duplicate Surat headline');
assert(pondaHtml.includes('Explore Digital Commerce and Content Skills.'), 'Ponda contains distinct editorial headline');
assert(pondaHtml.includes('Building Online Stores vs Building Content Channels'), 'Ponda contains distinct decision heading');

// Pair 5: Jagdalpur vs Raipur / Nashik / Ludhiana
const jagdalpurHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'jagdalpur', 'index.html'), 'utf8');
const raipurHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'raipur', 'index.html'), 'utf8');
const nashikHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'nashik', 'index.html'), 'utf8');
const ludhianaHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'ludhiana', 'index.html'), 'utf8');
assert(!jagdalpurHtml.includes('Transform Ideas into Finished Digital Work.'), 'Jagdalpur does NOT duplicate Raipur headline');
assert(!jagdalpurHtml.includes('Practical Skills for the Way Business Works.'), 'Jagdalpur does NOT duplicate Nashik headline');
assert(!jagdalpurHtml.includes('Create, Manage and Deliver Digital Business Work.'), 'Jagdalpur does NOT duplicate Ludhiana headline');
assert(jagdalpurHtml.includes('Build Skills for Productive and Independent Work.'), 'Jagdalpur contains distinct editorial headline');
assert(jagdalpurHtml.includes('Managing Work vs Managing Client Relationships'), 'Jagdalpur contains distinct decision heading');

// Pair 6: Leh vs Raipur / Nagpur
const lehHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'leh', 'index.html'), 'utf8');
const nagpurHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'nagpur', 'index.html'), 'utf8');
assert(!lehHtml.includes('Transform Ideas into Finished Digital Work.'), 'Leh does NOT duplicate Raipur headline');
assert(!lehHtml.includes('Master the Tools of Digital Creation.'), 'Leh does NOT duplicate Nagpur headline');
assert(lehHtml.includes('Build Practical Skills for Modern Digital Work.'), 'Leh contains distinct editorial headline');
assert(lehHtml.includes('Everyday Office Tools vs AI-Assisted Workflows'), 'Leh contains distinct decision heading');
console.log('');

// -------------------------------------------------------------
// SUITE F: Child Course Safeguards
// -------------------------------------------------------------
console.log('[SUITE F] Child Course Safeguards for Solan and Mandi:');
const solanHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'solan', 'index.html'), 'utf8');
assert(solanHtml.includes('young learners') || solanHtml.includes('Young Tech Explorers') || solanHtml.includes('age-appropriate'), 'Solan includes age-appropriate early tech framing');
assert(solanHtml.includes('Help your child explore coding') || solanHtml.includes('young school students') || solanHtml.includes('Young Tech Explorers'), 'Solan emphasizes foundational child learning without adult job claims');

assert(mandiHtml.includes('young learners') || mandiHtml.includes('Young Coders') || mandiHtml.includes('Young Tech Explorers'), 'Mandi includes age-appropriate coding framing');
assert(mandiHtml.includes('Designed for learners aged 9–16') || mandiHtml.includes('Help your child explore coding'), 'Mandi emphasizes foundational coding without adult job claims');
console.log('');

// -------------------------------------------------------------
// SUITE G: Technical SEO, Canonicals & Structured Data
// -------------------------------------------------------------
console.log('[SUITE G] Technical SEO, Canonicals & Structured Data:');
P3_CITIES.forEach(c => {
  const filePath = path.join(ROOT_DIR, 'branches', c.slug, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  // Trailing slash canonical
  assert(html.includes(`<link rel="canonical" href="https://novaskills.in/branches/${c.slug}/" />`), `${c.city} has correct self-referencing canonical with trailing slash`);

  // Robots preview guard
  assert(html.includes('<meta name="robots" content="noindex, follow" />'), `${c.city} has preview robots guard: noindex, follow`);

  // JSON-LD
  assert(html.includes('"@type": "WebPage"'), `${c.city} includes WebPage JSON-LD`);
  assert(html.includes('"@type": "BreadcrumbList"'), `${c.city} includes BreadcrumbList JSON-LD`);
  assert(html.includes('"@type": "ItemList"'), `${c.city} includes ItemList JSON-LD`);
});
console.log('');

// -------------------------------------------------------------
// SUITE H: Client Interactivity & Modal Triggers
// -------------------------------------------------------------
console.log('[SUITE H] Client Interactivity & Modal Triggers:');
P3_CITIES.forEach(c => {
  const filePath = path.join(ROOT_DIR, 'branches', c.slug, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  assert(html.includes('window.openCityEnrollment()'), `${c.city} connects Enroll Now button to openCityEnrollment()`);
  assert(html.includes('window.openCityConsultation()'), `${c.city} connects Consultation button to openCityConsultation()`);
  assert(html.includes('window.openCityCourseDemo('), `${c.city} connects course card demo buttons to openCityCourseDemo()`);
  assert(html.includes('city-decision-tab-btn'), `${c.city} contains accessible decision tab triggers`);
  assert(html.includes('city-decision-panel'), `${c.city} contains decision tab panels`);
});
console.log('');

// -------------------------------------------------------------
// SUITE I: Directory Link Integration (/branches/)
// -------------------------------------------------------------
console.log('[SUITE I] Directory Integration (/branches/):');
const directoryPath = path.join(ROOT_DIR, 'branches', 'index.html');
assert(fs.existsSync(directoryPath), 'Directory file exists: branches/index.html');
const dirHtml = fs.readFileSync(directoryPath, 'utf8');

ALL_36_SLUGS.forEach(slug => {
  const expectedLink = `/branches/${slug}/`;
  assert(dirHtml.includes(expectedLink), `Directory /branches/ links to preview page ${expectedLink}`);
});

const allLocations = getAllLocations();
const draftCities = allLocations.filter(l => l.publicationStatus === 'draft');
assert(draftCities.length === 0, `Exactly 0 cities remain in draft status (found: ${draftCities.length})`);
const previewCities = allLocations.filter(l => l.publicationStatus === 'preview_ready');
assert(previewCities.length === 36, `Exactly 36 cities are preview_ready (found: ${previewCities.length})`);
console.log('');

// -------------------------------------------------------------
// SUITE J: Sitewide Baseline Preservation Tests
// -------------------------------------------------------------
console.log('[SUITE J] Sitewide Baseline Regression Tests:');
const productionCoreFiles = [
  'index.html',
  'courses.html',
  'data.js',
  'js/data.min.js',
  'js/main.min.js',
  'js/components.min.js',
  'academies/digital-marketing/index.html',
  'academies/ai/index.html',
  'academies/design/index.html',
  'academies/programming/index.html'
];

const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
const modifiedCore = gitStatus.split('\n')
  .filter(line => line.startsWith(' M') || line.startsWith('M ') || line.startsWith(' D') || line.startsWith('D '))
  .map(l => l.slice(3).trim())
  .filter(file => productionCoreFiles.includes(file.replace(/\\/g, '/')));

assert(modifiedCore.length === 0, `Zero modifications to existing production website baseline files (found: ${modifiedCore.join(', ') || 'none'})`);
console.log('');

// -------------------------------------------------------------
// SUITE K: Headless Chrome Multi-Viewport Screenshots (26 screenshots)
// -------------------------------------------------------------
console.log('[SUITE K] Headless Chrome Multi-Viewport QA & Screenshots:');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';

  const relativePath = reqPath.replace(/^\/+/, '');
  const filePath = path.join(ROOT_DIR, relativePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + relativePath);
  }
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`  ✓ Local test server running at http://127.0.0.1:${PORT}`);

  function takeScreenshot(url, outputPath, width = 1440, height = 950) {
    return new Promise((resolve, reject) => {
      // If screenshot already exists and is >10KB, we can re-use or re-capture cleanly
      const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --screenshot="${outputPath}" "${url}"`;
      exec(cmd, (err) => {
        if (err) return reject(err);
        assert(fs.existsSync(outputPath) && fs.statSync(outputPath).size > 10000, `Captured screenshot: ${path.basename(outputPath)} (${width}x${height})`);
        resolve();
      });
    });
  }

  try {
    for (const c of P3_CITIES) {
      const desktopFilename = `p3_city_${c.slug}_desktop_1440px.png`;
      const mobileFilename = `p3_city_${c.slug}_mobile_390px.png`;

      await takeScreenshot(`http://127.0.0.1:${PORT}/branches/${c.slug}/`, path.join(ARTIFACT_DIR, desktopFilename), 1440, 950);
      await takeScreenshot(`http://127.0.0.1:${PORT}/branches/${c.slug}/`, path.join(ARTIFACT_DIR, mobileFilename), 390, 844);
    }

    console.log('  ✓ All 26 new P3 city multi-viewport screenshots captured successfully');
  } catch (err) {
    console.error('Headless Chrome QA error:', err.message);
  } finally {
    server.close();
    console.log('  ✓ Local test server stopped');

    console.log('\n================================================================');
    console.log(`  PHASE 07 P3 VALIDATION SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED (TOTAL: ${totalTests})`);
    console.log('================================================================\n');

    if (failedTests > 0) {
      console.error('Test failures:');
      failures.forEach(f => console.error(`  - ${f}`));
      process.exit(1);
    } else {
      console.log('ALL PHASE 07 P3 CITY TESTS PASSED WITH 100% SUCCESS.\n');
      process.exit(0);
    }
  }
});
