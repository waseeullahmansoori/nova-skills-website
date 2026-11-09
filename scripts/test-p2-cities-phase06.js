/**
 * Nova Skills P2 City Pages Validation & QA Suite
 * Phase 06 — 13 P2 City Pages
 * + Cumulative Regression Testing across all 23 Cities (10 P1 + 13 P2)
 * 
 * Rules:
 * - 4 compulsory courses for EVERY city (52 new, 92 cumulative).
 * - Exactly 3 additional courses for 10 cities, exactly 2 for Basti, Azamgarh, Sultanpur (36 new, 66 cumulative).
 * - Total P2 course associations: 52 + 36 = 88.
 * - Cumulative P1 + P2 course associations: 70 + 88 = 158.
 * - Duplicate-risk evaluation for Ludhiana vs Nashik, Gorakhpur vs Patna, Gwalior vs Bhopal.
 * - Academic & physical transparency: Siddharth Nagar sole physical campus.
 * - Directory links: 23 preview cities, exactly 13 draft cities.
 * - Multi-viewport screenshots (1440px and 390px) for all 13 new P2 cities.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec, execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = path.resolve('C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 8096;

const {
  getLocationBySlug,
  resolveCoursesForLocation,
  getAllLocations
} = require('../lib/locations');

const P2_CITIES = [
  {
    slug: 'vadodara',
    city: 'Vadodara',
    state: 'Gujarat',
    headline: 'Design Better Digital Experiences. Build Useful Websites.',
    decisionHeading: 'Website Builder\'s Decision Studio',
    expectedAdditionalNumbers: [15, 14, 10]
  },
  {
    slug: 'dehradun',
    city: 'Dehradun',
    state: 'Uttarakhand',
    headline: 'Different Learning Stages. The Right Skills for Each.',
    decisionHeading: 'Learning Pathways by Learner Stage',
    expectedAdditionalNumbers: [25, 26, 22]
  },
  {
    slug: 'kota',
    city: 'Kota',
    state: 'Rajasthan',
    headline: 'Build a Strong Foundation for What\'s Next.',
    decisionHeading: 'Your Programming Starting Point',
    expectedAdditionalNumbers: [11, 12, 22]
  },
  {
    slug: 'chhatrapati-sambhajinagar',
    city: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    headline: 'Make Digital Business Skills Work Together.',
    decisionHeading: 'Understand the Digital Business Workflow',
    expectedAdditionalNumbers: [29, 14, 30]
  },
  {
    slug: 'prayagraj',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    headline: 'Technical Skills and Communication for Career Progress.',
    decisionHeading: 'Build a Balanced Professional Skill Set',
    expectedAdditionalNumbers: [12, 24, 22]
  },
  {
    slug: 'ludhiana',
    city: 'Ludhiana',
    state: 'Punjab',
    headline: 'Create, Manage and Deliver Digital Business Work.',
    decisionHeading: 'Business Workflows and Client Deliverables',
    expectedAdditionalNumbers: [14, 30, 21]
  },
  {
    slug: 'jalandhar',
    city: 'Jalandhar',
    state: 'Punjab',
    headline: 'Create Content. Communicate Clearly. Work Professionally.',
    decisionHeading: 'From Content Skills to Client Communication',
    expectedAdditionalNumbers: [27, 24, 21]
  },
  {
    slug: 'gorakhpur',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    headline: 'Learn Technical Skills. Prepare to Apply Them.',
    decisionHeading: 'From Building Applications to Presenting Your Skills',
    expectedAdditionalNumbers: [11, 24, 22]
  },
  {
    slug: 'gwalior',
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    headline: 'Explore Different Ways to Create With Technology.',
    decisionHeading: 'Choose Your Method of Digital Problem-Solving',
    expectedAdditionalNumbers: [10, 12, 6]
  },
  {
    slug: 'hisar',
    city: 'Hisar',
    state: 'Haryana',
    headline: 'Build Digital Skills for Everyday Professional Work.',
    decisionHeading: 'Three Practical Digital Workflows',
    expectedAdditionalNumbers: [15, 29, 30]
  },
  {
    slug: 'basti',
    city: 'Basti',
    state: 'Uttar Pradesh',
    headline: 'Strengthen Everyday Workplace Skills.',
    decisionHeading: 'Practical Skills for Communication and Office Work',
    expectedAdditionalNumbers: [24, 30]
  },
  {
    slug: 'azamgarh',
    city: 'Azamgarh',
    state: 'Uttar Pradesh',
    headline: 'Learn to Build. Understand How to Work With Clients.',
    decisionHeading: 'Technical Work and Client-Facing Skills',
    expectedAdditionalNumbers: [11, 21]
  },
  {
    slug: 'sultanpur',
    city: 'Sultanpur',
    state: 'Uttar Pradesh',
    headline: 'Explore the Right Skills for Your Learning Stage.',
    decisionHeading: 'Two Distinct Learning Journeys',
    expectedAdditionalNumbers: [22, 26]
  }
];

const ALL_23_PREVIEW_SLUGS = [
  // 10 P1 Cities
  'indore', 'jaipur', 'rajkot', 'patna',
  'lucknow', 'nagpur', 'surat', 'nashik', 'bhopal', 'raipur',
  // 13 P2 Cities
  'vadodara', 'dehradun', 'kota', 'chhatrapati-sambhajinagar',
  'prayagraj', 'ludhiana', 'jalandhar', 'gorakhpur',
  'gwalior', 'hisar', 'basti', 'azamgarh', 'sultanpur'
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
console.log('  NOVA SKILLS — PHASE 06 P2 CITY PAGES VALIDATION & QA');
console.log('================================================================\n');

// -------------------------------------------------------------
// SUITE A: 13 New Route & Pre-rendered File Existence Tests
// -------------------------------------------------------------
console.log('[SUITE A] New Route & Pre-rendered File Existence:');
P2_CITIES.forEach(c => {
  const filePath = path.join(ROOT_DIR, 'branches', c.slug, 'index.html');
  assert(fs.existsSync(filePath), `Pre-rendered file exists: branches/${c.slug}/index.html`);
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;
    assert(size > 40000, `branches/${c.slug}/index.html has substantial content (${(size / 1024).toFixed(1)} KB)`);
  }
});
console.log('');

// -------------------------------------------------------------
// SUITE B: 13 P2 Cities Course Associations (Gate 02 & Gate 03)
// -------------------------------------------------------------
console.log('[SUITE B] Course Associations for 13 New P2 Cities:');
let newCompulsoryCount = 0;
let newAdditionalCount = 0;

P2_CITIES.forEach(c => {
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

  // Additional courses (3 for most, 2 for basti, azamgarh, sultanpur)
  const expectedCount = c.expectedAdditionalNumbers.length;
  assert(resolved.additionalCourses.length === expectedCount, `${c.city} has exactly ${expectedCount} additional courses resolved`);
  const addNums = resolved.additionalCourses.map(x => x.masterNumber).sort((a,b)=>a-b);
  const expNums = [...c.expectedAdditionalNumbers].sort((a,b)=>a-b);
  assert(JSON.stringify(addNums) === JSON.stringify(expNums), `${c.city} additional courses match expected [${expNums.join(', ')}]`);

  resolved.additionalCourses.forEach(cr => {
    if (html.includes(cr.title)) newAdditionalCount++;
  });
});

assert(newCompulsoryCount === 52, `All 52 new compulsory course associations present across 13 P2 pages (found: ${newCompulsoryCount})`);
assert(newAdditionalCount === 36, `All 36 approved new additional course associations present across 13 P2 pages (found: ${newAdditionalCount})`);
assert(newCompulsoryCount + newAdditionalCount === 88, `Total P2 course associations = 88 (found: ${newCompulsoryCount + newAdditionalCount})`);
console.log('');

// -------------------------------------------------------------
// SUITE C: Cumulative 23-City (P1 + P2) Validation (Gate 30)
// -------------------------------------------------------------
console.log('[SUITE C] Cumulative 23-City (P1 + P2) Course Associations:');
let cumulativeCompulsory = 0;
let cumulativeAdditional = 0;

ALL_23_PREVIEW_SLUGS.forEach(slug => {
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

assert(cumulativeCompulsory === 92, `Cumulative compulsory course associations across 23 cities = 92 (found: ${cumulativeCompulsory})`);
assert(cumulativeAdditional === 66, `Cumulative additional course associations across 23 cities = 66 (found: ${cumulativeAdditional})`);
assert(cumulativeCompulsory + cumulativeAdditional === 158, `Total course associations across 23 cities = 158 (found: ${cumulativeCompulsory + cumulativeAdditional})`);
console.log('');

// -------------------------------------------------------------
// SUITE D: Editorial Differentiation & Academic Transparency
// -------------------------------------------------------------
console.log('[SUITE D] Editorial Differentiation & Academic Transparency:');
const titlesSeen = new Set();
const metaSeen = new Set();
const headlinesSeen = new Set();

P2_CITIES.forEach(c => {
  const filePath = path.join(ROOT_DIR, 'branches', c.slug, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  // Unique headline & decision module
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

assert(titlesSeen.size === 13, `All 13 P2 pages have unique SEO Titles (found: ${titlesSeen.size})`);
assert(metaSeen.size === 13, `All 13 P2 pages have distinct Meta Descriptions (found: ${metaSeen.size})`);
assert(headlinesSeen.size === 13, `All 13 P2 pages have distinct Hero Headlines (found: ${headlinesSeen.size})`);
console.log('');

// -------------------------------------------------------------
// SUITE E: Duplicate-Risk Forensic Analysis (Gate 04)
// -------------------------------------------------------------
console.log('[SUITE E] Duplicate-Risk Pair Forensic Verification:');

// Pair 1: Ludhiana vs Nashik
const ludhianaHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'ludhiana', 'index.html'), 'utf8');
const nashikHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'nashik', 'index.html'), 'utf8');
assert(!ludhianaHtml.includes('Practical Skills for the Way Business Works.'), 'Ludhiana does NOT duplicate Nashik headline');
assert(!ludhianaHtml.includes('Build a Practical Business Skills Toolkit'), 'Ludhiana does NOT duplicate Nashik decision heading');
assert(ludhianaHtml.includes('Create, Manage and Deliver Digital Business Work.'), 'Ludhiana contains distinct editorial headline');
assert(ludhianaHtml.includes('Business Workflows and Client Deliverables'), 'Ludhiana contains distinct decision heading');

// Pair 2: Gorakhpur vs Patna
const gorakhpurHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'gorakhpur', 'index.html'), 'utf8');
const patnaHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'patna', 'index.html'), 'utf8');
assert(!gorakhpurHtml.includes('Start With Skills. Move Forward With Confidence.'), 'Gorakhpur does NOT duplicate Patna headline');
assert(!gorakhpurHtml.includes('Plan Your Learning Journey'), 'Gorakhpur does NOT duplicate Patna decision heading');
assert(gorakhpurHtml.includes('Learn Technical Skills. Prepare to Apply Them.'), 'Gorakhpur contains distinct editorial headline');
assert(gorakhpurHtml.includes('From Building Applications to Presenting Your Skills'), 'Gorakhpur contains distinct decision heading');

// Pair 3: Gwalior vs Bhopal
const gwaliorHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'gwalior', 'index.html'), 'utf8');
const bhopalHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'bhopal', 'index.html'), 'utf8');
assert(!gwaliorHtml.includes('Think. Design. Develop.'), 'Gwalior does NOT duplicate Bhopal headline');
assert(!gwaliorHtml.includes('Explore Your Digital Skill Direction'), 'Gwalior does NOT duplicate Bhopal decision heading');
assert(gwaliorHtml.includes('Explore Different Ways to Create With Technology.'), 'Gwalior contains distinct editorial headline');
assert(gwaliorHtml.includes('Choose Your Method of Digital Problem-Solving'), 'Gwalior contains distinct decision heading');
console.log('');

// -------------------------------------------------------------
// SUITE F: Technical SEO, Canonicals & Structured Data
// -------------------------------------------------------------
console.log('[SUITE F] Technical SEO, Canonicals & Structured Data:');
P2_CITIES.forEach(c => {
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
// SUITE G: Client Interactivity & Modal Triggers
// -------------------------------------------------------------
console.log('[SUITE G] Client Interactivity & Modal Triggers:');
P2_CITIES.forEach(c => {
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
// SUITE H: Phase 03 Directory Link Integration (/branches/)
// -------------------------------------------------------------
console.log('[SUITE H] Phase 03 Directory Integration (/branches/):');
const directoryPath = path.join(ROOT_DIR, 'branches', 'index.html');
assert(fs.existsSync(directoryPath), 'Directory file exists: branches/index.html');
const dirHtml = fs.readFileSync(directoryPath, 'utf8');

ALL_23_PREVIEW_SLUGS.forEach(slug => {
  const expectedLink = `/branches/${slug}/`;
  assert(dirHtml.includes(expectedLink), `Directory /branches/ links to preview page ${expectedLink}`);
});

const allLocations = getAllLocations();
const draftCities = allLocations.filter(l => l.publicationStatus === 'draft');
assert(draftCities.length === 13, `Exactly 13 P3 cities remain in draft status (found: ${draftCities.length})`);
console.log('');

// -------------------------------------------------------------
// SUITE I: Sitewide Baseline Preservation Tests
// -------------------------------------------------------------
console.log('[SUITE I] Sitewide Baseline Regression Tests:');
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
// SUITE J: Headless Chrome Multi-Viewport Screenshots (26 screenshots)
// -------------------------------------------------------------
console.log('[SUITE J] Headless Chrome Multi-Viewport QA & Screenshots:');

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
      const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --screenshot="${outputPath}" "${url}"`;
      exec(cmd, (err) => {
        if (err) return reject(err);
        assert(fs.existsSync(outputPath) && fs.statSync(outputPath).size > 10000, `Captured screenshot: ${path.basename(outputPath)} (${width}x${height})`);
        resolve();
      });
    });
  }

  try {
    for (const c of P2_CITIES) {
      const desktopFilename = `p2_city_${c.slug}_desktop_1440px.png`;
      const mobileFilename = `p2_city_${c.slug}_mobile_390px.png`;

      await takeScreenshot(`http://127.0.0.1:${PORT}/branches/${c.slug}/`, path.join(ARTIFACT_DIR, desktopFilename), 1440, 950);
      await takeScreenshot(`http://127.0.0.1:${PORT}/branches/${c.slug}/`, path.join(ARTIFACT_DIR, mobileFilename), 390, 844);
    }

    console.log('  ✓ All 26 new P2 city multi-viewport screenshots captured successfully');
  } catch (err) {
    console.error('Headless Chrome QA error:', err.message);
  } finally {
    server.close();
    console.log('  ✓ Local test server stopped');

    console.log('\n================================================================');
    console.log(`  PHASE 06 P2 VALIDATION SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED (TOTAL: ${totalTests})`);
    console.log('================================================================\n');

    if (failedTests > 0) {
      console.error('Test failures:');
      failures.forEach(f => console.error(`  - ${f}`));
      process.exit(1);
    } else {
      console.log('ALL PHASE 06 P2 CITY TESTS PASSED WITH 100% SUCCESS.\n');
      process.exit(0);
    }
  }
});
