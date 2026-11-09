/**
 * Comprehensive Automated Test Suite:
 * Homepage Hero USP Typography, Spacing, Hierarchy & Responsive Verification
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const CHROME_PORT = 9228;
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

console.log('================================================================');
console.log('  NOVA SKILLS HOMEPAGE HERO USP TYPOGRAPHY & RESPONSIVE SUITE   ');
console.log('================================================================\n');

// --- SECTION 1: STATIC SOURCE CODE AUDIT ---
console.log('--- SECTION 1: Static HTML & CSS Markup Audit ---');

const indexPath = path.join(ROOT_DIR, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

assert(indexHtml.includes('02 DAYS FREE DEMO CLASSES'), 'USP 01 heading is "02 DAYS FREE DEMO CLASSES"');
assert(indexHtml.includes('Experience Before You Enroll'), 'USP 01 subtext is "Experience Before You Enroll"');
assert(indexHtml.includes('Career-Focused'), 'USP 02 heading is "Career-Focused"');
assert(indexHtml.includes('Practical Training'), 'USP 02 subtext is "Practical Training"');
assert(indexHtml.includes('1:1 LIVE ONLINE CLASSES'), 'USP 03 heading is "1:1 LIVE ONLINE CLASSES"');
assert(indexHtml.includes('Personalized Learning'), 'USP 03 subtext is "Personalized Learning"');
assert(indexHtml.includes('stat-note-mark'), 'USP 03 contains asterisk note mark element');
assert(!/<span class="stat-highlight">/.test(indexHtml.slice(indexHtml.indexOf('hero-usp-strip'), indexHtml.indexOf('hero-visual'))), 'No .stat-highlight in hero USP markup');

const stylesCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');
const mainCss = fs.readFileSync(path.join(ROOT_DIR, 'css/main.css'), 'utf8');
const stylesMinCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.min.css'), 'utf8');

[
  { name: 'styles.css', content: stylesCss },
  { name: 'css/main.css', content: mainCss },
  { name: 'styles.min.css', content: stylesMinCss }
].forEach(({ name, content }) => {
  console.log(`\nAuditing ${name}:`);
  assert(content.includes('.hero-stats.hero-usp-strip'), `${name} contains .hero-stats.hero-usp-strip`);
  assert(content.includes('0.875rem') || content.includes('14px'), `${name} defines 0.875rem heading font-size`);
  assert(content.includes('0.625rem') || content.includes('10px'), `${name} defines 0.625rem supporting text font-size`);
  assert(content.includes('gap: 5px') || content.includes('gap:5px'), `${name} defines 5px gap between heading and supporting text`);
});

// --- SECTION 2: BROWSER CDP LIVE COMPUTED VERIFICATION ---
console.log('\n--- SECTION 2: Browser CDP Computed Measurements across Viewports ---');

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
    const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-hero-test-' + Date.now());
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
    return res.result ? res.result.value : undefined;
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width <= 768
    });
  }

  async captureElementScreenshot(selector, outPath) {
    const box = await this.evaluate(`
      (() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: Math.max(0, rect.left - 10),
          y: Math.max(0, rect.top - 10),
          width: rect.width + 20,
          height: rect.height + 20
        };
      })()
    `);

    if (!box) {
      console.warn(`Could not find ${selector} for screenshot`);
      return;
    }

    const { data } = await this.send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        scale: 1
      }
    });

    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log(`  📸 Screenshot saved: ${path.basename(outPath)}`);
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
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

async function runTests() {
  let tmpProfile = null;
  let client = null;
  try {
    await startServer();
    tmpProfile = await launchChrome();
    client = await getNewPageCDP();

    console.log('Navigating to http://localhost:8097/...');
    await client.send('Page.navigate', { url: 'http://localhost:8097/' });
    
    // Wait for hero element to be rendered
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 100));
      const found = await client.evaluate(`Boolean(document.querySelector('.hero-stats.hero-usp-strip'))`);
      if (found) break;
    }

    const VIEWPORTS = [
      { name: 'Desktop-1440px', width: 1440, height: 900, isDesktop: true },
      { name: 'Laptop-1024px', width: 1024, height: 768, isDesktop: true },
      { name: 'Tablet-768px', width: 768, height: 1024, isDesktop: false },
      { name: 'Mobile-390px', width: 390, height: 844, isDesktop: false },
      { name: 'Mobile-375px', width: 375, height: 667, isDesktop: false },
      { name: 'Mobile-320px', width: 320, height: 568, isDesktop: false }
    ];

    for (const vp of VIEWPORTS) {
      console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      await client.setViewport(vp.width, vp.height);
      await new Promise(r => setTimeout(r, 300));

      const metrics = await client.evaluate(`
        (() => {
          const strip = document.querySelector('.hero-stats.hero-usp-strip');
          if (!strip) return { error: 'Hero strip not found' };

          const rect = strip.getBoundingClientRect();
          const compStrip = window.getComputedStyle(strip);
          const cols = Array.from(strip.querySelectorAll('.hero-usp-col'));

          const colData = cols.map((col, idx) => {
            const h = col.querySelector('.stat-headline');
            const s = col.querySelector('.stat-subtext');
            const hComp = h ? window.getComputedStyle(h) : null;
            const sComp = s ? window.getComputedStyle(s) : null;
            const hRect = h ? h.getBoundingClientRect() : null;
            const sRect = s ? s.getBoundingClientRect() : null;
            const colRect = col.getBoundingClientRect();

            return {
              idx: idx + 1,
              headingText: h ? h.innerText.trim() : '',
              subText: s ? s.innerText.trim() : '',
              headingWeight: hComp ? hComp.fontWeight : '',
              headingSize: hComp ? hComp.fontSize : '',
              headingColor: hComp ? hComp.color : '',
              headingLineHeight: hComp ? hComp.lineHeight : '',
              headingHeight: hRect ? hRect.height : 0,
              subWeight: sComp ? sComp.fontWeight : '',
              subSize: sComp ? sComp.fontSize : '',
              subColor: sComp ? sComp.color : '',
              subLineHeight: sComp ? sComp.lineHeight : '',
              subHeight: sRect ? sRect.height : 0,
              gap: (hRect && sRect) ? (sRect.top - hRect.bottom) : 0,
              colHeight: colRect.height,
              colWidth: colRect.width
            };
          });

          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const hasHorizontalOverflow = docWidth > winWidth;

          const dividers = Array.from(strip.querySelectorAll('.stat-divider'));
          const dividerVisible = dividers.map(d => window.getComputedStyle(d).display !== 'none');

          return {
            stripRect: { width: rect.width, height: rect.height, top: rect.top },
            stripDisplay: compStrip.display,
            cols: colData,
            hasHorizontalOverflow,
            docWidth,
            winWidth,
            dividerVisible
          };
        })()
      `);

      assert(!metrics.error, `[${vp.name}] Hero strip found in DOM`);
      assert(!metrics.hasHorizontalOverflow, `[${vp.name}] Zero horizontal overflow (docWidth=${metrics.docWidth} <= winWidth=${metrics.winWidth})`);

      if (vp.isDesktop) {
        // Desktop assertions
        assert(metrics.stripDisplay === 'flex', `[${vp.name}] Strip display is flex on desktop`);
        assert(metrics.dividerVisible.every(v => v === true), `[${vp.name}] Subtle vertical dividers are visible`);

        metrics.cols.forEach(col => {
          assert(col.headingWeight === '700', `[${vp.name} Col ${col.idx}] Heading weight is 700 (got ${col.headingWeight})`);
          assert(col.headingSize === '14px', `[${vp.name} Col ${col.idx}] Heading size is 14px / 0.875rem (got ${col.headingSize})`);
          assert(col.headingColor === 'rgb(255, 255, 255)', `[${vp.name} Col ${col.idx}] Heading color is white (got ${col.headingColor})`);
          assert(col.subWeight === '400', `[${vp.name} Col ${col.idx}] Subtext weight is 400 (got ${col.subWeight})`);
          assert(col.subSize === '10px', `[${vp.name} Col ${col.idx}] Subtext size is 10px / 0.625rem (got ${col.subSize})`);
          assert(col.gap >= 3 && col.gap <= 8, `[${vp.name} Col ${col.idx}] Gap between heading and subtext is ~5px (got ${Math.round(col.gap)}px)`);
          assert(col.colHeight <= 75, `[${vp.name} Col ${col.idx}] Total column height is compact (got ${Math.round(col.colHeight)}px)`);
        });

        // Screenshot capture for desktop
        if (vp.width === 1440) {
          await client.captureElementScreenshot('.hero-stats.hero-usp-strip', path.join(ARTIFACT_DIR, 'after_hero_usp_desktop_1440px.png'));
        }
      } else {
        // Mobile assertions
        assert(metrics.stripDisplay === 'grid', `[${vp.name}] Strip display is grid on mobile`);
        assert(metrics.dividerVisible.every(v => v === false), `[${vp.name}] Vertical dividers are hidden on mobile`);

        // Screenshot capture for mobile
        if (vp.width === 390) {
          await client.captureElementScreenshot('.hero-stats.hero-usp-strip', path.join(ARTIFACT_DIR, 'after_hero_usp_mobile_390px.png'));
        } else if (vp.width === 320) {
          await client.captureElementScreenshot('.hero-stats.hero-usp-strip', path.join(ARTIFACT_DIR, 'after_hero_usp_mobile_320px.png'));
        }
      }
    }

    client.close();

  } catch (err) {
    console.error('Fatal error during test run:', err);
    assert(false, `Test run completed without unhandled error: ${err.message}`);
  } finally {
    if (chromeProcess) {
      chromeProcess.kill();
    }
    if (serverProcess) {
      serverProcess.kill();
    }
    if (tmpProfile && fs.existsSync(tmpProfile)) {
      try {
        fs.rmSync(tmpProfile, { recursive: true, force: true });
      } catch (e) {}
    }
  }

  console.log('\n================================================================');
  console.log(`TEST SUMMARY: ${passedCount} PASSED / ${failedCount} FAILED (${testCount} TOTAL)`);
  console.log('================================================================');

  if (failedCount > 0) {
    console.error('\nFailures encountered:');
    failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}`));
    process.exit(1);
  } else {
    console.log('\n🎉 ALL HERO USP TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  }
}

runTests();
