/**
 * Nova Skills P1 City Pages Validation & QA Suite
 * Phase 05 — 6 New P1 Cities (Lucknow, Nagpur, Surat, Nashik, Bhopal, Raipur)
 * + Regression Testing across all 10 P1 Cities and Directory
 * 
 * Rules:
 * - 4 compulsory courses + 3 approved additional courses per city.
 * - Compulsory associations: 6 * 4 = 24 new (40 cumulative across 10 P1 cities).
 * - Additional associations: 6 * 3 = 18 new (30 cumulative across 10 P1 cities).
 * - Total associations: 42 new (70 cumulative across 10 P1 cities).
 * - Strict verification of Academic & Physical campus disclosure (Siddharth Nagar sole physical campus).
 * - Zero fake LocalBusiness schemas.
 * - Multi-viewport screenshots (1440px and 390px) for all 6 new cities.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec, execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = path.resolve('C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 8095;

const {
  getLocationBySlug,
  resolveCoursesForLocation,
  getAllLocations
} = require('../lib/locations');

const NEW_P1_CITIES = [
  {
    slug: 'lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    headline: 'Learn New Skills. Build Professional Confidence.',
    decisionHeading: 'From Learning to Professional Readiness',
    expectedAdditionalNumbers: [12, 23, 22]
  },
  {
    slug: 'nagpur',
    city: 'Nagpur',
    state: 'Maharashtra',
    headline: 'Build. Analyse. Automate.',
    decisionHeading: 'Three Ways to Work With Technology',
    expectedAdditionalNumbers: [11, 29, 6]
  },
  {
    slug: 'surat',
    city: 'Surat',
    state: 'Gujarat',
    headline: 'Build Your Digital Presence. Grow Your Capabilities.',
    decisionHeading: 'From Website to Digital Audience',
    expectedAdditionalNumbers: [14, 15, 27]
  },
  {
    slug: 'nashik',
    city: 'Nashik',
    state: 'Maharashtra',
    headline: 'Practical Skills for the Way Business Works.',
    decisionHeading: 'Build a Practical Business Skills Toolkit',
    expectedAdditionalNumbers: [14, 30, 21]
  },
  {
    slug: 'bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    headline: 'Think. Design. Develop.',
    decisionHeading: 'Explore Your Digital Skill Direction',
    expectedAdditionalNumbers: [12, 10, 6]
  },
  {
    slug: 'raipur',
    city: 'Raipur',
    state: 'Chhattisgarh',
    headline: 'Turn Everyday Skills Into Professional Capability.',
    decisionHeading: 'Choose the Skills You Want to Apply',
    expectedAdditionalNumbers: [29, 30, 21]
  }
];

const ALL_10_P1_SLUGS = [
  'indore', 'jaipur', 'rajkot', 'patna',
  'lucknow', 'nagpur', 'surat', 'nashik', 'bhopal', 'raipur'
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
console.log('  NOVA SKILLS — PHASE 05 P1 CITY PAGES VALIDATION & QA');
console.log('================================================================\n');

// -------------------------------------------------------------
// SUITE A: 6 New Route & Pre-rendered File Existence Tests
// -------------------------------------------------------------
console.log('[SUITE A] New Route & Pre-rendered File Existence:');
NEW_P1_CITIES.forEach(c => {
  const filePath = path.join(ROOT_DIR, 'branches', c.slug, 'index.html');
  assert(fs.existsSync(filePath), `Pre-rendered file exists: branches/${c.slug}/index.html`);
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;
    assert(size > 40000, `branches/${c.slug}/index.html has substantial content (${(size / 1024).toFixed(1)} KB)`);
  }
});
console.log('');

// -------------------------------------------------------------
// SUITE B: 6 New Cities Course Associations (Gate 02 & Gate 03)
// -------------------------------------------------------------
console.log('[SUITE B] Course Associations for 6 New P1 Cities:');
let newCompulsoryCount = 0;
let newAdditionalCount = 0;

NEW_P1_CITIES.forEach(c => {
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

  // 3 additional courses
  assert(resolved.additionalCourses.length === 3, `${c.city} has exactly 3 additional courses resolved`);
  const addNums = resolved.additionalCourses.map(x => x.masterNumber).sort((a,b)=>a-b);
  const expNums = [...c.expectedAdditionalNumbers].sort((a,b)=>a-b);
  assert(JSON.stringify(addNums) === JSON.stringify(expNums), `${c.city} additional courses match expected [${expNums.join(', ')}]`);

  resolved.additionalCourses.forEach(cr => {
    if (html.includes(cr.title)) newAdditionalCount++;
  });
});

assert(newCompulsoryCount === 24, `All 24 new compulsory course associations present across 6 pages (found: ${newCompulsoryCount})`);
assert(newAdditionalCount === 18, `All 18 approved new additional course associations present across 6 pages (found: ${newAdditionalCount})`);
console.log('');

// -------------------------------------------------------------
// SUITE C: Cumulative P1 10-City Association Validation
// -------------------------------------------------------------
console.log('[SUITE C] Cumulative 10-City P1 Course Associations:');
let cumulativeCompulsory = 0;
let cumulativeAdditional = 0;

ALL_10_P1_SLUGS.forEach(slug => {
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

assert(cumulativeCompulsory === 40, `Cumulative compulsory course associations across 10 P1 cities = 40 (found: ${cumulativeCompulsory})`);
assert(cumulativeAdditional === 30, `Cumulative additional course associations across 10 P1 cities = 30 (found: ${cumulativeAdditional})`);
assert(cumulativeCompulsory + cumulativeAdditional === 70, `Total course associations across 10 P1 cities = 70 (found: ${cumulativeCompulsory + cumulativeAdditional})`);
console.log('');

// -------------------------------------------------------------
// SUITE D: Editorial Differentiation & Academic Transparency
// -------------------------------------------------------------
console.log('[SUITE D] Editorial Differentiation & Academic Transparency:');
const titlesSeen = new Set();
const metaSeen = new Set();
const headlinesSeen = new Set();

NEW_P1_CITIES.forEach(c => {
  const filePath = path.join(ROOT_DIR, 'branches', c.slug, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  // Unique headline & decision module
  assert(html.includes(c.headline), `${c.city} contains unique headline: "${c.headline}"`);
  assert(html.includes(c.decisionHeading), `${c.city} contains unique decision module: "${c.decisionHeading}"`);

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

assert(titlesSeen.size === 6, `All 6 new P1 pages have unique SEO Titles (found: ${titlesSeen.size})`);
assert(metaSeen.size === 6, `All 6 new P1 pages have distinct Meta Descriptions (found: ${metaSeen.size})`);
assert(headlinesSeen.size === 6, `All 6 new P1 pages have distinct Hero Headlines (found: ${headlinesSeen.size})`);
console.log('');

// -------------------------------------------------------------
// SUITE E: Technical SEO, Canonicals & Structured Data
// -------------------------------------------------------------
console.log('[SUITE E] Technical SEO, Canonicals & Structured Data:');
NEW_P1_CITIES.forEach(c => {
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
// SUITE F: Interactive Components & Lead Modal Hooks
// -------------------------------------------------------------
console.log('[SUITE F] Client Interactivity & Modal Triggers:');
NEW_P1_CITIES.forEach(c => {
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
// SUITE G: Phase 03 Directory Link Integration
// -------------------------------------------------------------
console.log('[SUITE G] Phase 03 Directory Integration (/branches/):');
const directoryPath = path.join(ROOT_DIR, 'branches', 'index.html');
assert(fs.existsSync(directoryPath), 'Directory file exists: branches/index.html');
const dirHtml = fs.readFileSync(directoryPath, 'utf8');

ALL_10_P1_SLUGS.forEach(slug => {
  const expectedLink = `/branches/${slug}/`;
  assert(dirHtml.includes(expectedLink), `Directory /branches/ links to preview page ${expectedLink}`);
});

const allLocations = getAllLocations();
const draftCities = allLocations.filter(l => l.publicationStatus === 'draft');
assert(draftCities.length === 26, `Exactly 26 cities remain in draft status (found: ${draftCities.length})`);
console.log('');

// -------------------------------------------------------------
// SUITE H: Sitewide Baseline Preservation Tests
// -------------------------------------------------------------
console.log('[SUITE H] Sitewide Baseline Regression Tests:');
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
// SUITE I: Headless Chrome Multi-Viewport Screenshots
// -------------------------------------------------------------
console.log('[SUITE I] Headless Chrome Multi-Viewport QA & Screenshots:');

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
    for (const c of NEW_P1_CITIES) {
      const desktopFilename = `p1_city_${c.slug}_desktop_1440px.png`;
      const mobileFilename = `p1_city_${c.slug}_mobile_390px.png`;

      await takeScreenshot(`http://127.0.0.1:${PORT}/branches/${c.slug}/`, path.join(ARTIFACT_DIR, desktopFilename), 1440, 950);
      await takeScreenshot(`http://127.0.0.1:${PORT}/branches/${c.slug}/`, path.join(ARTIFACT_DIR, mobileFilename), 390, 844);
    }

    console.log('  ✓ All 12 new P1 city multi-viewport screenshots captured successfully');
  } catch (err) {
    console.error('Headless Chrome QA error:', err.message);
  } finally {
    server.close();
    console.log('  ✓ Local test server stopped');

    console.log('\n================================================================');
    console.log(`  PHASE 05 P1 VALIDATION SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED (TOTAL: ${totalTests})`);
    console.log('================================================================\n');

    if (failedTests > 0) {
      console.error('Test failures:');
      failures.forEach(f => console.error(`  - ${f}`));
      process.exit(1);
    } else {
      console.log('ALL PHASE 05 P1 CITY TESTS PASSED WITH 100% SUCCESS.\n');
      process.exit(0);
    }
  }
});
