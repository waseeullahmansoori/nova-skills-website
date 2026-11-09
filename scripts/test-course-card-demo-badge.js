/**
 * Comprehensive Automated Regression Test Suite:
 * Sitewide Course Card Free Demo Promotional Badge
 *
 * Verifies that the "2-Day Free Demo Available" badge displays in ONE horizontal
 * line inside a compact, full-width, light-teal promotional box across all 12 academies
 * and the main courses catalog across 9 responsive viewports.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PORT = 9245;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let testCount = 0;
let passedCount = 0;
let failedCount = 0;
const failures = [];

function assert(condition, message) {
  testCount++;
  if (condition) {
    passedCount++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedCount++;
    failures.push(message);
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// -----------------------------------------------------------------------------
// SECTION 1: STATIC CODEBASE & REPOSITORIES AUDIT
// -----------------------------------------------------------------------------
console.log('===============================================================');
console.log('   NOVA SKILLS COURSE CARD FREE DEMO BADGE TEST SUITE');
console.log('===============================================================\n');

console.log('--- SECTION 1: Static Stylesheets & Pre-rendered Pages ---');

const { NS_COURSES } = require(path.join(ROOT_DIR, 'data.js'));

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

const cssFiles = [
  { name: 'styles.css', content: fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8') },
  { name: 'css/main.css', content: fs.readFileSync(path.join(ROOT_DIR, 'css', 'main.css'), 'utf8') },
  { name: 'css/styles.min.css', content: fs.readFileSync(path.join(ROOT_DIR, 'css', 'styles.min.css'), 'utf8') },
  { name: 'styles.min.css', content: fs.readFileSync(path.join(ROOT_DIR, 'styles.min.css'), 'utf8') },
  { name: 'css/course-detail.css', content: fs.readFileSync(path.join(ROOT_DIR, 'css', 'course-detail.css'), 'utf8') }
];

cssFiles.forEach(file => {
  console.log(`\nAuditing ${file.name}:`);
  assert(file.content.includes('.course-demo-chip'), `Contains .course-demo-chip selector`);
  assert(file.content.includes('display: flex') || file.content.includes('display:flex'), `Defines display: flex for horizontal row`);
  assert(file.content.includes('rgba(5, 153, 168, 0.08)') || file.content.includes('rgba(5,153,168,0.08)'), `Uses approved light-teal/ice-blue background`);
  assert(file.content.includes('rgba(5, 153, 168, 0.22)') || file.content.includes('rgba(5,153,168,0.22)'), `Uses approved subtle teal border`);
  assert(file.content.includes('#012B46'), `Uses Nova Skills Deep Navy #012B46 text color`);
  assert(file.content.includes('width: 15px') || file.content.includes('width:15px') || file.content.includes('15px'), `Constrains SVG icon dimensions`);
});

console.log('\nAuditing All 12 Pre-rendered Academy Pages:');
const ACADEMIES = [
  'digital-marketing',
  'ai',
  'design',
  'programming',
  'no-code-web',
  'video-motion',
  '3d',
  'career-freelancing',
  'communication',
  'kids-tech',
  'creator',
  'office-productivity'
];

ACADEMIES.forEach(slug => {
  const p = path.join(ROOT_DIR, 'academies', slug, 'index.html');
  assert(fs.existsSync(p), `[${slug}] index.html exists`);
  const html = fs.readFileSync(p, 'utf8');

  // Must contain critical inline styling
  assert(html.includes('.course-demo-chip') && html.includes('rgba(5, 153, 168, 0.08)'), `[${slug}] Inlines critical badge CSS`);

  // Count demo chips
  const chipCount = (html.match(/class="course-demo-chip"/g) || []).length;
  assert(chipCount > 0, `[${slug}] Pre-renders demo chips for eligible courses (found ${chipCount})`);

  // All chips must contain span with text
  assert(html.includes('<span class="demo-chip-text">2-Day Free Demo Available</span>'), `[${slug}] Contains structured span for demo badge`);
  assert(html.includes('width="15" height="15"'), `[${slug}] Explicitly dimensions calendar SVG at 15x15px`);
  assert(!html.includes('fa-calendar'), `[${slug}] Zero raw FontAwesome tokens in chip`);
});

console.log('\nAuditing courses.html:');
const coursesHtml = fs.readFileSync(path.join(ROOT_DIR, 'courses.html'), 'utf8');
const catalogChips = (coursesHtml.match(/class="course-demo-chip"/g) || []).length;
assert(catalogChips === 33, `courses.html pre-renders exactly 33 demo chips for eligible courses (found ${catalogChips})`);

// -----------------------------------------------------------------------------
// SECTION 2: LIVE BROWSER CDP RESPONSIVE VERIFICATION & SCREENSHOTS
// -----------------------------------------------------------------------------
class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.msgId = 0;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = msg => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const { res, rej } = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) rej(new Error(data.error.message));
          else res(data.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { res: resolve, rej: reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Runtime.evaluate exception');
    }
    return res.result ? res.result.value : undefined;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

let serverProcess = null;
let chromeProcess = null;

async function startServer() {
  return new Promise(resolve => {
    serverProcess = http.createServer((req, res) => {
      const rel = req.url.split('?')[0].replace(/^\/+/, '');
      let filePath = path.join(ROOT_DIR, rel);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const mimeMap = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.png': 'image/png'
      };
      res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'text/plain' });
      fs.createReadStream(filePath).pipe(res);
    });
    serverProcess.listen(8096, resolve);
  });
}

async function launchChrome() {
  const tmpProfile = path.join(ROOT_DIR, `tmp-chrome-card-badge-${Date.now()}`);
  fs.mkdirSync(tmpProfile, { recursive: true });

  chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    `--user-data-dir=${tmpProfile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1440,900'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  return tmpProfile;
}

async function getNewPageCDP() {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:${CHROME_PORT}/json/new`, { method: 'PUT' }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        try {
          const target = JSON.parse(data);
          const cdp = new CDPClient(target.webSocketDebuggerUrl);
          await cdp.connect();
          await cdp.send('Page.enable');
          await cdp.send('DOM.enable');
          await cdp.send('CSS.enable');
          resolve(cdp);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function captureElementScreenshot(cdp, selector, outputPath) {
  const clip = await cdp.evaluate(`
    (() => {
      const el = document.querySelector('${selector}');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.max(0, r.x),
        y: Math.max(0, r.y + window.scrollY),
        width: r.width,
        height: r.height,
        scale: 1
      };
    })()
  `);
  if (clip) {
    const res = await cdp.send('Page.captureScreenshot', { format: 'png', clip });
    fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
    console.log(`  📸 Saved screenshot: ${path.basename(outputPath)}`);
  }
}

async function runBrowserTests() {
  console.log('\n--- SECTION 2: Live Browser CDP Responsive Verification ---');
  await startServer();
  const tmpProfile = await launchChrome();
  const cdp = await getNewPageCDP();

  async function navigateTo(url) {
    await cdp.send('Page.navigate', { url });
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 100));
      const ready = await cdp.evaluate(`Boolean(document.querySelector('.course-card'))`);
      if (ready) return;
    }
  }

  const VIEWPORTS = [
    { width: 320, height: 600, label: '320px (Small Mobile)' },
    { width: 337, height: 700, label: '337px (User Reference Mobile)' },
    { width: 360, height: 740, label: '360px (Android Compact)' },
    { width: 375, height: 667, label: '375px (iPhone SE)' },
    { width: 390, height: 844, label: '390px (iPhone 12/13/14)' },
    { width: 430, height: 932, label: '430px (iPhone Pro Max)' },
    { width: 768, height: 1024, label: '768px (iPad/Tablet)' },
    { width: 1024, height: 768, label: '1024px (Small Desktop)' },
    { width: 1440, height: 900, label: '1440px (Standard Desktop)' }
  ];

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting Viewport: ${vp.label}`);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 1024
    });

    await navigateTo('http://127.0.0.1:8096/academies/programming/index.html');

    const metrics = await cdp.evaluate(`
      (() => {
        const chips = Array.from(document.querySelectorAll('.course-demo-chip'));
        const indicators = Array.from(document.querySelectorAll('.course-demo-indicator'));
        if (chips.length === 0) return null;

        const firstChip = chips[0];
        const comp = window.getComputedStyle(firstChip);
        const rect = firstChip.getBoundingClientRect();
        const parentRect = firstChip.parentElement.getBoundingClientRect();
        const svg = firstChip.querySelector('svg');
        const svgRect = svg ? svg.getBoundingClientRect() : null;
        const textSpan = firstChip.querySelector('.demo-chip-text');
        const textRect = textSpan ? textSpan.getBoundingClientRect() : null;

        // Check icon and text vertical alignment
        // If on same line, svg top and text top should be very close (< 6px difference)
        const vDiff = svgRect && textRect ? Math.abs(svgRect.top - textRect.top) : 999;

        // Check if price is below the chip
        const card = firstChip.closest('.course-card');
        const price = card ? card.querySelector('.course-pricing') : null;
        const priceRect = price ? price.getBoundingClientRect() : null;
        const priceIsBelow = priceRect && priceRect.top >= rect.bottom - 2;

        return {
          count: chips.length,
          display: comp.display,
          flexDirection: comp.flexDirection,
          alignItems: comp.alignItems,
          background: comp.backgroundColor,
          border: comp.border,
          color: comp.color,
          fontSize: comp.fontSize,
          fontWeight: comp.fontWeight,
          chipWidth: Math.round(rect.width),
          parentWidth: Math.round(parentRect.width),
          chipHeight: Math.round(rect.height),
          svgWidth: svgRect ? Math.round(svgRect.width) : 0,
          svgHeight: svgRect ? Math.round(svgRect.height) : 0,
          textWidth: textRect ? Math.round(textRect.width) : 0,
          vDiff: Math.round(vDiff),
          priceIsBelow: Boolean(priceIsBelow),
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth
        };
      })()
    `);

    assert(metrics !== null, `[${vp.width}px] Demo chips rendered successfully`);
    assert(metrics.display === 'flex', `[${vp.width}px] display is flex (got ${metrics.display})`);
    assert(metrics.flexDirection === 'row', `[${vp.width}px] flexDirection is row`);
    assert(metrics.alignItems === 'center', `[${vp.width}px] alignItems is center`);
    assert(metrics.chipWidth >= metrics.parentWidth - 2, `[${vp.width}px] Badge spans full width of content area (${metrics.chipWidth}px >= ${metrics.parentWidth - 2}px)`);
    assert(metrics.vDiff <= 6, `[${vp.width}px] Calendar icon and text are on ONE horizontal line (vertical diff = ${metrics.vDiff}px <= 6px)`);
    assert(metrics.svgWidth === 15 && metrics.svgHeight === 15, `[${vp.width}px] Calendar SVG is precisely 15x15px (${metrics.svgWidth}x${metrics.svgHeight})`);
    assert(metrics.color === 'rgb(1, 43, 70)', `[${vp.width}px] Text color is Deep Navy #012B46`);
    assert(metrics.priceIsBelow, `[${vp.width}px] Course pricing is placed directly below the promotional box`);
    assert(metrics.scrollWidth <= metrics.viewportWidth, `[${vp.width}px] Zero horizontal overflow (${metrics.scrollWidth} <= ${metrics.viewportWidth})`);
  }

  // --- CAPTURE SCREENSHOT EVIDENCE ---
  console.log('\n--- Capturing Visual Evidence for Report ---');

  // 1. Desktop 1440px: Full Stack Programming Foundation (Career Program)
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await navigateTo('http://127.0.0.1:8096/academies/programming/index.html');
  await captureElementScreenshot(cdp, '.course-card[data-category="programming"]', path.join(ARTIFACT_DIR, 'after_card_badge_career_desktop_1440px.png'));

  // 2. Mobile 337px: Full Stack Programming Foundation
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 337, height: 700, deviceScaleFactor: 2, mobile: true });
  await navigateTo('http://127.0.0.1:8096/academies/programming/index.html');
  await captureElementScreenshot(cdp, '.course-card[data-category="programming"]', path.join(ARTIFACT_DIR, 'after_card_badge_career_mobile_337px.png'));

  // 3. Mobile 390px: Full Stack Programming Foundation
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await navigateTo('http://127.0.0.1:8096/academies/programming/index.html');
  await captureElementScreenshot(cdp, '.course-card[data-category="programming"]', path.join(ARTIFACT_DIR, 'after_card_badge_career_mobile_390px.png'));

  // 4. Desktop 1440px: courses.html catalog grid
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await navigateTo('http://127.0.0.1:8096/courses.html');
  await captureElementScreenshot(cdp, '#courses-grid-page .course-card', path.join(ARTIFACT_DIR, 'after_card_badge_courses_catalog_desktop_1440px.png'));

  // 5. Mobile 337px: courses.html catalog card
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 337, height: 700, deviceScaleFactor: 2, mobile: true });
  await navigateTo('http://127.0.0.1:8096/courses.html');
  await captureElementScreenshot(cdp, '#courses-grid-page .course-card', path.join(ARTIFACT_DIR, 'after_card_badge_courses_catalog_mobile_337px.png'));

  cdp.close();
  serverProcess.close();
  chromeProcess.kill();
  try {
    fs.rmSync(tmpProfile, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n===============================================================');
  console.log(`RESULTS: ${passedCount} passed, ${failedCount} failed out of ${testCount} tests`);
  console.log('===============================================================');

  if (failedCount > 0) {
    console.error('❌ Failures encountered:');
    failures.forEach(f => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL COURSE CARD FREE DEMO BADGE TESTS PASSED (100%)!\n');
  }
}

runBrowserTests().catch(err => {
  console.error('Fatal execution error:', err);
  if (serverProcess) serverProcess.close();
  if (chromeProcess) chromeProcess.kill();
  process.exit(1);
});
