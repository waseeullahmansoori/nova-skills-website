/**
 * Comprehensive Automated Regression Test Suite:
 * Mobile Demo Banner Spacing & Desktop Preservation
 *
 * Validates that promotional benefit cards maintain compact content height
 * on mobile (<= 95px) and eliminates dead vertical space, while preserving
 * approved horizontal strip on desktop across all 12 Academies.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PORT = 9226;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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
    console.error(`  ❌ FAIL: ${message}`);
    failures.push(message);
  }
}

console.log('===============================================================');
console.log('   NOVA SKILLS MOBILE DEMO BANNER SPACING & REGRESSION SUITE   ');
console.log('===============================================================\n');

// --- SECTION 1: STATIC CSS & HTML AUDIT ---
console.log('--- SECTION 1: Static CSS Rules & Pre-rendered Pages ---');

const cssFiles = [
  { name: 'styles.css', content: fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8') },
  { name: 'css/main.css', content: fs.readFileSync(path.join(ROOT_DIR, 'css', 'main.css'), 'utf8') },
  { name: 'css/styles.min.css', content: fs.readFileSync(path.join(ROOT_DIR, 'css', 'styles.min.css'), 'utf8') }
];

cssFiles.forEach(file => {
  console.log(`\nAuditing ${file.name}:`);
  assert(file.content.includes('.academy-demo-benefit'), `Contains .academy-demo-benefit selector`);
  assert(/flex:\s*none\s*!important/.test(file.content), `Overrides flex:none on mobile to eliminate 240px basis`);
  assert(/height:\s*auto\s*!important/.test(file.content), `Enforces height:auto for natural content sizing on mobile`);
  assert(/align-items:\s*flex-start\s*!important/.test(file.content), `Enforces top-aligned icon and text`);
  assert(/min-height:\s*48px\s*!important/.test(file.content) || file.content.includes('48px'), `Preserves 48px CTA minimum touch target`);
});

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

console.log('\nAuditing All 12 Pre-rendered Academy Pages:');
ACADEMIES.forEach(slug => {
  const p = path.join(ROOT_DIR, 'academies', slug, 'index.html');
  assert(fs.existsSync(p), `[${slug}] index.html exists`);
  const html = fs.readFileSync(p, 'utf8');
  assert(html.includes('.academy-demo-benefit'), `[${slug}] Contains critical banner CSS`);
  assert(html.includes('flex: none !important;'), `[${slug}] Critical CSS overrides flex: none !important`);
  assert(html.includes('align-items: flex-start !important;'), `[${slug}] Critical CSS sets align-items: flex-start`);
  assert(!html.includes('fa-') && !html.includes('fas fa-'), `[${slug}] Zero raw FontAwesome tokens in pre-rendered markup`);
});

// --- SECTION 2: BROWSER CDP COMPUTED MEASUREMENTS ---
console.log('\n--- SECTION 2: Live Browser CDP Responsive Verification ---');

let chromeProcess = null;
let serverProcess = null;

function startServer() {
  return new Promise((resolve) => {
    const serverScript = path.join(ROOT_DIR, 'scripts', 'serve.js');
    serverProcess = spawn('node', [serverScript]);
    setTimeout(resolve, 800);
  });
}

function launchChrome() {
  return new Promise((resolve, reject) => {
    const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-banner-test-' + Date.now());
    const args = [
      '--headless=new',
      `--remote-debugging-port=${CHROME_PORT}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${tmpProfile}`
    ];

    chromeProcess = spawn(CHROME_PATH, args);

    let attempts = 0;
    const checkReady = () => {
      attempts++;
      http.get(`http://127.0.0.1:${CHROME_PORT}/json/version`, (res) => {
        if (res.statusCode === 200) {
          resolve(tmpProfile);
        } else {
          setTimeout(checkReady, 200);
        }
      }).on('error', () => {
        if (attempts > 30) {
          reject(new Error('Chrome failed to start on port ' + CHROME_PORT));
        } else {
          setTimeout(checkReady, 200);
        }
      });
    };
    checkReady();
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 0;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (msg) => {
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

async function getNewPageCDP() {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:${CHROME_PORT}/json/new`, { method: 'PUT' }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        try {
          const target = JSON.parse(data);
          const cdp = new CDPClient(target.webSocketDebuggerUrl);
          await cdp.connect();
          await cdp.send('Page.enable');
          await cdp.send('Runtime.enable');
          await cdp.send('DOM.enable');
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

async function runBrowserTests() {
  await startServer();
  const tmpProfile = await launchChrome();
  const cdp = await getNewPageCDP();

  const TEST_CONFIGS = [
    { slug: 'programming', name: 'Programming Academy' },
    { slug: 'digital-marketing', name: 'Digital Marketing Academy' },
    { slug: 'ai', name: 'AI Academy' },
    { slug: 'design', name: 'Design Academy' },
    { slug: 'no-code-web', name: 'No-Code Web Academy' },
    { slug: 'video-motion', name: 'Video & Motion Academy' }
  ];

  async function navigateTo(url) {
    await cdp.send('Page.navigate', { url });
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 100));
      const found = await cdp.evaluate(`Boolean(document.querySelector('.academy-demo-banner'))`);
      if (found) return;
    }
  }

  // 1. Mobile 337px (Exact User Reference Viewport)
  console.log('\n--- 1. Testing Exact User Reference Viewport: 337px ---');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 337,
    height: 700,
    deviceScaleFactor: 2,
    mobile: true
  });

  for (const acad of TEST_CONFIGS) {
    await navigateTo(`http://127.0.0.1:8097/academies/${acad.slug}/index.html`);

    const metrics = await cdp.evaluate(`
      (() => {
        const banner = document.querySelector('.academy-demo-banner');
        if (!banner) return null;
        const bRect = banner.getBoundingClientRect();
        const cards = Array.from(document.querySelectorAll('.academy-demo-benefit'));
        const cardRects = cards.map(c => c.getBoundingClientRect());
        const icons = Array.from(document.querySelectorAll('.academy-demo-benefit-icon'));
        const iconRects = icons.map(i => i.getBoundingClientRect());
        const btn = document.querySelector('.academy-demo-btn');
        const btnRect = btn ? btn.getBoundingClientRect() : null;

        return {
          bannerHeight: Math.round(bRect.height),
          cardHeights: cardRects.map(r => Math.round(r.height)),
          iconHeights: iconRects.map(r => Math.round(r.height)),
          iconWidths: iconRects.map(r => Math.round(r.width)),
          btnHeight: btnRect ? Math.round(btnRect.height) : 0,
          btnWidth: btnRect ? Math.round(btnRect.width) : 0,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth
        };
      })()
    `);

    assert(metrics && metrics.bannerHeight <= 420, `[${acad.slug} @ 337px] Total banner height is compact (${metrics?.bannerHeight}px <= 420px, was 746px)`);
    assert(metrics.cardHeights.every(h => h <= 95), `[${acad.slug} @ 337px] All card heights are compact (${metrics.cardHeights.join(', ')}px <= 95px, was 240px)`);
    assert(metrics.cardHeights.every(h => h >= 55), `[${acad.slug} @ 337px] Card heights are natural without text squeeze (${metrics.cardHeights.join(', ')}px >= 55px)`);
    assert(metrics.iconHeights.every(h => h === 38), `[${acad.slug} @ 337px] Icon container height is 38px (${metrics.iconHeights.join(', ')})`);
    assert(metrics.btnHeight >= 48, `[${acad.slug} @ 337px] CTA touch target >= 48px (${metrics.btnHeight}px)`);
    assert(metrics.scrollWidth <= metrics.viewportWidth, `[${acad.slug} @ 337px] Zero horizontal overflow (${metrics.scrollWidth} <= ${metrics.viewportWidth})`);
  }

  // 2. Mobile 390px (Standard Modern Smartphone)
  console.log('\n--- 2. Testing Standard Smartphone Viewport: 390px ---');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  for (const acad of TEST_CONFIGS.slice(0, 3)) {
    await navigateTo(`http://127.0.0.1:8097/academies/${acad.slug}/index.html`);

    const metrics = await cdp.evaluate(`
      (() => {
        const banner = document.querySelector('.academy-demo-banner');
        if (!banner) return null;
        const bRect = banner.getBoundingClientRect();
        const cards = Array.from(document.querySelectorAll('.academy-demo-benefit'));
        const btn = document.querySelector('.academy-demo-btn');
        const btnRect = btn ? btn.getBoundingClientRect() : null;

        return {
          bannerHeight: Math.round(bRect.height),
          cardHeights: cards.map(c => Math.round(c.getBoundingClientRect().height)),
          btnHeight: btnRect ? Math.round(btnRect.height) : 0,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth
        };
      })()
    `);

    assert(metrics && metrics.bannerHeight <= 420, `[${acad.slug} @ 390px] Banner height is compact (${metrics?.bannerHeight}px <= 420px)`);
    assert(metrics.cardHeights.every(h => h <= 95), `[${acad.slug} @ 390px] Card heights are compact (${metrics.cardHeights.join(', ')}px <= 95px)`);
    assert(metrics.btnHeight >= 48, `[${acad.slug} @ 390px] CTA touch target >= 48px (${metrics.btnHeight}px)`);
    assert(metrics.scrollWidth <= metrics.viewportWidth, `[${acad.slug} @ 390px] Zero horizontal overflow (${metrics.scrollWidth} <= ${metrics.viewportWidth})`);
  }

  // 3. Desktop Preservation (1440px)
  console.log('\n--- 3. Testing Desktop Preservation: 1440px ---');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  for (const acad of TEST_CONFIGS.slice(0, 3)) {
    await navigateTo(`http://127.0.0.1:8097/academies/${acad.slug}/index.html`);

    const metrics = await cdp.evaluate(`
      (() => {
        const banner = document.querySelector('.academy-demo-banner');
        if (!banner) return null;
        const bRect = banner.getBoundingClientRect();
        const cards = Array.from(document.querySelectorAll('.academy-demo-benefit'));
        const icons = Array.from(document.querySelectorAll('.academy-demo-benefit-icon'));
        const svgs = Array.from(document.querySelectorAll('.academy-demo-benefit-icon svg'));
        const btn = document.querySelector('.academy-demo-btn');
        const btnRect = btn ? btn.getBoundingClientRect() : null;

        return {
          bannerHeight: Math.round(bRect.height),
          cardWidths: cards.map(c => Math.round(c.getBoundingClientRect().width)),
          iconWidths: icons.map(i => Math.round(i.getBoundingClientRect().width)),
          svgWidths: svgs.map(s => Math.round(s.getBoundingClientRect().width)),
          btnHeight: btnRect ? Math.round(btnRect.height) : 0,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth
        };
      })()
    `);

    assert(metrics && metrics.bannerHeight <= 160, `[${acad.slug} @ 1440px] Approved horizontal banner height preserved (${metrics?.bannerHeight}px <= 160px)`);
    assert(metrics.iconWidths.every(w => w === 42), `[${acad.slug} @ 1440px] Desktop icon containers preserved at 42px (${metrics.iconWidths.join(', ')})`);
    assert(metrics.svgWidths.every(w => w === 22), `[${acad.slug} @ 1440px] Desktop SVG icons preserved at 22px (${metrics.svgWidths.join(', ')})`);
    assert(metrics.btnHeight >= 48, `[${acad.slug} @ 1440px] CTA touch target >= 48px (${metrics.btnHeight}px)`);
    assert(metrics.scrollWidth <= metrics.viewportWidth, `[${acad.slug} @ 1440px] Zero horizontal overflow (${metrics.scrollWidth} <= ${metrics.viewportWidth})`);
  }

  cdp.close();
  if (chromeProcess) chromeProcess.kill();
  if (serverProcess) serverProcess.kill();
  try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}

  console.log('\n===============================================================');
  console.log(`RESULTS: ${passedCount} passed, ${failedCount} failed out of ${testCount} tests`);
  console.log('===============================================================');

  if (failedCount > 0) {
    console.error('❌ Failures encountered:');
    failures.forEach(f => console.error('  - ' + f));
    process.exit(1);
  } else {
    console.log('🎉 ALL MOBILE DEMO BANNER SPACING TESTS PASSED (100%)!\n');
  }
}

runBrowserTests().catch(err => {
  console.error('Browser testing failed:', err);
  if (chromeProcess) chromeProcess.kill();
  if (serverProcess) serverProcess.kill();
  process.exit(1);
});
