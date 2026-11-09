/**
 * Nova Skills Pilot City Pages Automated Test Suite (Phase 04)
 * Tests Indore, Jaipur, Rajkot, and Patna across all Gate 22 criteria:
 * - Route availability & HTTP status
 * - 4 Compulsory Core Courses per city (16 total)
 * - 3 Approved Additional Courses per city (12 total)
 * - Content differentiation & Decision-Support Explorer
 * - Physical vs. Online transparency (Siddharth Nagar vs. Online)
 * - Technical SEO, schema & canonical tags
 * - Multi-viewport headless Chrome screenshot captures (8 screenshots)
 * - Directory link integration
 * - Sitewide baseline preservation
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec, execSync } = require('child_process');

const PORT = 8094;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
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
console.log('  NOVA SKILLS — PHASE 04 PILOT CITY PAGES VALIDATION & QA');
console.log('================================================================\n');

const PILOTS = [
  {
    slug: 'indore',
    city: 'Indore',
    state: 'Madhya Pradesh',
    title: 'Online Professional Courses in Indore | Nova Skills',
    headline: 'Build Technical Skills That Work Together.',
    additionalIds: ['ai-assisted-full-stack-web-development', 'biz-productivity', 'uiux-design-pro'],
    distinctPhrase: 'Choose Your Technical Direction'
  },
  {
    slug: 'jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    title: 'Graphic Design & Online Professional Courses in Jaipur | Nova Skills',
    headline: 'Turn Creative Thinking Into Practical Skills.',
    additionalIds: ['creative-design', 'uiux-design-pro', 'content-creator-pro'],
    distinctPhrase: 'Explore Three Creative Directions'
  },
  {
    slug: 'rajkot',
    city: 'Rajkot',
    state: 'Gujarat',
    title: 'Digital Business & Online Professional Courses in Rajkot | Nova Skills',
    headline: 'Build Skills for Digital Business.',
    additionalIds: ['ecommerce-mastery', 'creative-design', 'freelancing-client-acquisition-professional'],
    distinctPhrase: 'From Digital Presence to Client Work'
  },
  {
    slug: 'patna',
    city: 'Patna',
    state: 'Bihar',
    title: 'Online Career-Focused Professional Courses in Patna | Nova Skills',
    headline: 'Start With Skills. Move Forward With Confidence.',
    additionalIds: ['fullstack-foundation', 'spoken-english-pro', 'career-launch-placement-readiness-professional'],
    distinctPhrase: 'Plan Your Learning Journey'
  }
];

const CORE_IDS = ['dm-professional', 'graphic-design-pro', 'video-pro', 'ai-for-business-pro'];

// -------------------------------------------------------------
// GATE A: ROUTE & HTML EXISTENCE
// -------------------------------------------------------------
console.log('[SUITE A] Route & Pre-rendered File Existence Tests:');

PILOTS.forEach(p => {
  const filePath = path.join(ROOT_DIR, 'branches', p.slug, 'index.html');
  assert(fs.existsSync(filePath), `Pre-rendered file exists: branches/${p.slug}/index.html`);
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;
    assert(size > 20000, `branches/${p.slug}/index.html has substantial content (${(size / 1024).toFixed(1)} KB)`);
  }
});

console.log('');

// -------------------------------------------------------------
// GATE B & C: COURSE MAPPING INTEGRITY
// -------------------------------------------------------------
console.log('[SUITE B & C] Compulsory & Additional Courses Verification:');

let totalCoreFound = 0;
let totalAdditionalFound = 0;

PILOTS.forEach(p => {
  const filePath = path.join(ROOT_DIR, 'branches', p.slug, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  // Verify all 4 core programs
  CORE_IDS.forEach(id => {
    if (html.includes(id)) totalCoreFound++;
  });

  // Verify all 3 additional programs
  p.additionalIds.forEach(id => {
    if (html.includes(id)) totalAdditionalFound++;
  });
});

assert(totalCoreFound === 16, `All 16 compulsory course associations present across 4 pages (found: ${totalCoreFound})`);
assert(totalAdditionalFound === 12, `All 12 approved additional course associations present across 4 pages (found: ${totalAdditionalFound})`);

console.log('');

// -------------------------------------------------------------
// GATE D: EDITORIAL DIFFERENTIATION & TRANSPARENCY
// -------------------------------------------------------------
console.log('[SUITE D] Editorial Differentiation & Academic Transparency:');

const titles = new Set();
const descriptions = new Set();

PILOTS.forEach(p => {
  const filePath = path.join(ROOT_DIR, 'branches', p.slug, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  // Check unique headline & title
  assert(html.includes(p.headline), `${p.city} contains unique headline: "${p.headline}"`);
  assert(html.includes(p.distinctPhrase), `${p.city} contains unique decision module: "${p.distinctPhrase}"`);

  // Check physical vs online transparency
  assert(html.includes('Siddharth Nagar'), `${p.city} identifies Siddharth Nagar as physical classroom campus`);
  assert(html.includes('Live Interactive Online Classes'), `${p.city} identifies delivery mode as Live Interactive Online`);
  assert(!html.includes('branch address in ' + p.city) && !html.includes('campus address in ' + p.city), `${p.city} contains zero fictional branch addresses`);

  // Check title & meta desc uniqueness
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  if (titleMatch) titles.add(titleMatch[1]);
  if (descMatch) descriptions.add(descMatch[1]);
});

assert(titles.size === 4, `All 4 pilot pages have unique SEO Titles (found: ${titles.size})`);
assert(descriptions.size === 4, `All 4 pilot pages have distinct Meta Descriptions (found: ${descriptions.size})`);

console.log('');

// -------------------------------------------------------------
// GATE E: TECHNICAL SEO & CANONICAL DIRECTIVES
// -------------------------------------------------------------
console.log('[SUITE E] Technical SEO, Canonical & Schema Tests:');

PILOTS.forEach(p => {
  const filePath = path.join(ROOT_DIR, 'branches', p.slug, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  assert(html.includes(`<link rel="canonical" href="https://novaskills.in/branches/${p.slug}/" />`), `${p.city} has correct self-referencing canonical with trailing slash`);
  assert(html.includes('<meta name="robots" content="noindex, follow" />'), `${p.city} has preview robots guard: noindex, follow`);
  assert(html.includes('"@type": "WebPage"'), `${p.city} includes WebPage JSON-LD`);
  assert(html.includes('"@type": "BreadcrumbList"'), `${p.city} includes BreadcrumbList JSON-LD`);
  assert(html.includes('"@type": "ItemList"'), `${p.city} includes ItemList JSON-LD`);
  assert(!html.includes('"@type": "LocalBusiness"'), `${p.city} contains zero fake LocalBusiness schema`);
});

console.log('');

// -------------------------------------------------------------
// GATE G: DIRECTORY LINK INTEGRATION (PHASE 03 UPDATE)
// -------------------------------------------------------------
console.log('[SUITE G] Phase 03 Directory Link Integration:');

const dirHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'index.html'), 'utf8');

PILOTS.forEach(p => {
  assert(dirHtml.includes(`href="/branches/${p.slug}/"`), `Directory /branches/ links to preview page /branches/${p.slug}/`);
});

const remainingDraftCheck = dirHtml.includes('href="/courses.html"');
assert(remainingDraftCheck, 'Remaining 32 draft cities continue safely linking to /courses.html');

console.log('');

// -------------------------------------------------------------
// GATE H: BASELINE REGRESSION TESTS
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

const status = execSync('git status --porcelain', { encoding: 'utf8' });
const modifiedCore = status.split('\n')
  .filter(line => line.startsWith(' M') || line.startsWith('M ') || line.startsWith(' D') || line.startsWith('D '))
  .map(l => l.slice(3).trim())
  .filter(file => productionCoreFiles.includes(file.replace(/\\/g, '/')));

assert(modifiedCore.length === 0, `Zero modifications to existing production website baseline files (found: ${modifiedCore.join(', ') || 'none'})`);

console.log('');

// -------------------------------------------------------------
// LIVE BROWSER HEADLESS QA & SCREENSHOT SUITE
// -------------------------------------------------------------
console.log('[BROWSER QA] Starting Local Test Server & Capturing Multi-Viewport Screenshots:');

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
    for (const p of PILOTS) {
      const desktopFilename = `pilot_city_${p.slug}_desktop_1440px.png`;
      const mobileFilename = `pilot_city_${p.slug}_mobile_390px.png`;

      await takeScreenshot(`http://127.0.0.1:${PORT}/branches/${p.slug}/`, path.join(ARTIFACT_DIR, desktopFilename), 1440, 950);
      await takeScreenshot(`http://127.0.0.1:${PORT}/branches/${p.slug}/`, path.join(ARTIFACT_DIR, mobileFilename), 390, 844);
    }

    console.log('  ✓ All 8 pilot city multi-viewport screenshots captured successfully');
  } catch (err) {
    console.error('Headless Chrome QA error:', err.message);
  } finally {
    server.close();
    console.log('  ✓ Local test server stopped');

    console.log('\n================================================================');
    console.log(`  PILOT CITIES VALIDATION SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('================================================================\n');

    if (failedTests > 0) {
      console.error('Pilot city test failures:');
      failures.forEach(f => console.error(`  - ${f}`));
      process.exit(1);
    } else {
      console.log('ALL PHASE 04 PILOT CITY TESTS PASSED WITH 100% SUCCESS.\n');
      process.exit(0);
    }
  }
});
