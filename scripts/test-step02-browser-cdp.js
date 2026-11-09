/**
 * Live Browser Verification Suite for Step 02 via Chrome DevTools Protocol
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PORT = 9223;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let chromeProcess = null;
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

function launchChrome() {
  return new Promise((resolve, reject) => {
    const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-cdp-step02-' + Date.now());
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
  console.log('============================================================');
  console.log('STEP 02 BROWSER CDP QA SUITE: LIVE RENDERING & MODAL TESTS');
  console.log('============================================================\n');

  let tmpProfile = '';
  try {
    tmpProfile = await launchChrome();
    console.log('Chrome headless launched successfully.');

    const cdp = await getNewPageCDP();

    const ACADEMIES_TO_TEST = [
      { slug: 'digital-marketing', name: 'Digital Marketing Academy' },
      { slug: 'ai', name: 'AI Academy' },
      { slug: '3d', name: '3D Academy' },
      { slug: 'programming', name: 'Programming Academy' },
      { slug: 'design', name: 'Design Academy' },
      { slug: 'career-freelancing', name: 'Career & Freelancing Academy' },
      { slug: 'kids-tech', name: 'Kids Tech Academy' },
      { slug: 'no-code-web', name: 'No-Code Web Academy' }
    ];

    // TEST 1: Desktop Viewport (1440x900)
    console.log('\n--- 1. Desktop 1440px Layout & Computed Styles ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    for (const acad of ACADEMIES_TO_TEST) {
      console.log(`\nTesting Desktop 1440px: [${acad.slug}]`);
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:8097/academies/${acad.slug}/index.html` });
      await new Promise(r => setTimeout(r, 600));

      const metrics = await cdp.evaluate(`
        (() => {
          const banner = document.querySelector('.academy-demo-banner');
          if (!banner) return null;
          const rect = banner.getBoundingClientRect();
          const icons = Array.from(document.querySelectorAll('.academy-demo-benefit-icon'));
          const svgs = Array.from(document.querySelectorAll('.academy-demo-benefit-icon svg'));
          const btn = document.querySelector('.academy-demo-btn');
          const btnRect = btn ? btn.getBoundingClientRect() : null;
          const leadHeading = document.querySelector('.academy-demo-heading');
          const microcopy = document.querySelector('.academy-demo-microcopy');

          return {
            bannerFound: true,
            bannerWidth: rect.width,
            bannerHeight: rect.height,
            scrollWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
            iconCount: icons.length,
            iconWidths: icons.map(el => Math.round(el.getBoundingClientRect().width)),
            iconHeights: icons.map(el => Math.round(el.getBoundingClientRect().height)),
            svgWidths: svgs.map(el => Math.round(el.getBoundingClientRect().width)),
            svgHeights: svgs.map(el => Math.round(el.getBoundingClientRect().height)),
            btnHeight: btnRect ? Math.round(btnRect.height) : 0,
            btnWidth: btnRect ? Math.round(btnRect.width) : 0,
            headingText: leadHeading ? leadHeading.textContent.trim() : '',
            microcopyText: microcopy ? microcopy.textContent.trim() : ''
          };
        })()
      `);

      assert(metrics && metrics.bannerFound, `Banner element found in DOM`);
      assert(metrics.scrollWidth <= metrics.viewportWidth, `Zero horizontal overflow (scrollWidth=${metrics.scrollWidth} <= viewport=${metrics.viewportWidth})`);
      assert(metrics.iconCount === 2, `Exactly 2 benefit icon wrappers present`);
      assert(metrics.iconWidths.every(w => w === 42), `All icon container widths computed to 42px (${metrics.iconWidths.join(', ')})`);
      assert(metrics.iconHeights.every(h => h === 42), `All icon container heights computed to 42px (${metrics.iconHeights.join(', ')})`);
      assert(metrics.svgWidths.every(w => w === 22), `All SVGs computed width is 22px (${metrics.svgWidths.join(', ')})`);
      assert(metrics.svgHeights.every(h => h === 22), `All SVGs computed height is 22px (${metrics.svgHeights.join(', ')})`);
      assert(metrics.btnHeight >= 48, `CTA button height >= 48px for accessibility (computed: ${metrics.btnHeight}px)`);
      assert(metrics.headingText === 'Explore Your Skills Before You Commit.', `Headline text verified`);
      assert(metrics.microcopyText === 'Free demo booking • No admission commitment', `Microcopy verified`);
    }

    // TEST 2: Mobile Viewport (390px)
    console.log('\n--- 2. Mobile 390px Responsive Layout & Computed Styles ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    for (const acad of ACADEMIES_TO_TEST.slice(0, 4)) {
      console.log(`\nTesting Mobile 390px: [${acad.slug}]`);
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:8097/academies/${acad.slug}/index.html` });
      await new Promise(r => setTimeout(r, 600));

      const metrics = await cdp.evaluate(`
        (() => {
          const banner = document.querySelector('.academy-demo-banner');
          if (!banner) return null;
          const rect = banner.getBoundingClientRect();
          const icons = Array.from(document.querySelectorAll('.academy-demo-benefit-icon'));
          const svgs = Array.from(document.querySelectorAll('.academy-demo-benefit-icon svg'));
          const btn = document.querySelector('.academy-demo-btn');
          const btnRect = btn ? btn.getBoundingClientRect() : null;

          return {
            scrollWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
            bannerWidth: Math.round(rect.width),
            iconWidths: icons.map(el => Math.round(el.getBoundingClientRect().width)),
            iconHeights: icons.map(el => Math.round(el.getBoundingClientRect().height)),
            svgWidths: svgs.map(el => Math.round(el.getBoundingClientRect().width)),
            svgHeights: svgs.map(el => Math.round(el.getBoundingClientRect().height)),
            btnHeight: btnRect ? Math.round(btnRect.height) : 0,
            btnWidth: btnRect ? Math.round(btnRect.width) : 0
          };
        })()
      `);

      assert(metrics.scrollWidth <= metrics.viewportWidth, `Zero horizontal overflow on 390px (scrollWidth=${metrics.scrollWidth} <= viewport=${metrics.viewportWidth})`);
      assert(metrics.iconWidths.every(w => w === 38), `Mobile icon container width computed to 38px (${metrics.iconWidths.join(', ')})`);
      assert(metrics.iconHeights.every(h => h === 38), `Mobile icon container height computed to 38px (${metrics.iconHeights.join(', ')})`);
      assert(metrics.svgWidths.every(w => w === 20), `Mobile SVG width computed to 20px (${metrics.svgWidths.join(', ')})`);
      assert(metrics.svgHeights.every(h => h === 20), `Mobile SVG height computed to 20px (${metrics.svgHeights.join(', ')})`);
      assert(metrics.btnHeight >= 48, `Mobile CTA button height >= 48px touch target (${metrics.btnHeight}px)`);
      assert(metrics.btnWidth >= 300, `Mobile CTA button full width >= 300px (${metrics.btnWidth}px)`);
    }

    // TEST 3: Ultra-Small Viewport (320px)
    console.log('\n--- 3. Ultra-Small Mobile 320px Overflow Test ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 650,
      deviceScaleFactor: 2,
      mobile: true
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:8097/academies/digital-marketing/index.html` });
    await new Promise(r => setTimeout(r, 600));

    const smallMobileMetrics = await cdp.evaluate(`
      (() => {
        const banner = document.querySelector('.academy-demo-banner');
        const rect = banner.getBoundingClientRect();
        return {
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          bannerWidth: Math.round(rect.width)
        };
      })()
    `);
    assert(smallMobileMetrics.scrollWidth <= smallMobileMetrics.viewportWidth, `Zero horizontal scroll on 320px viewport (${smallMobileMetrics.scrollWidth} <= 320)`);
    assert(smallMobileMetrics.bannerWidth <= 320, `Banner bounds fit within 320px width (banner=${smallMobileMetrics.bannerWidth}px)`);

    // TEST 4: CTA Click & Modal Binding Test
    console.log('\n--- 4. CTA Click & Modal Binding Test ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    for (const acad of [
      { slug: 'digital-marketing', name: 'Digital Marketing Academy' },
      { slug: 'ai', name: 'AI Academy' },
      { slug: '3d', name: '3D Academy' },
      { slug: 'programming', name: 'Programming Academy' }
    ]) {
      console.log(`\nTesting CTA Modal Trigger: [${acad.slug}]`);
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:8097/academies/${acad.slug}/index.html` });
      
      // Wait for scripts including components.min.js (which defines openDemoModal) to load
      await cdp.evaluate(`
        new Promise((resolve) => {
          let count = 0;
          const check = () => {
            count++;
            if (typeof window.openDemoModal === 'function' || count > 40) resolve();
            else setTimeout(check, 100);
          };
          check();
        })
      `);

      const modalState = await cdp.evaluate(`
        (() => {
          const btn = document.querySelector('.academy-demo-btn');
          if (!btn) return { error: 'No button found' };
          btn.click();
          
          const modal = document.getElementById('demo-booking-modal');
          const academyIdInput = document.getElementById('demo-academy-id');
          const academyNameInput = document.getElementById('demo-academy-name');
          const isVisible = modal && (modal.classList.contains('active') || modal.style.display !== 'none');

          return {
            modalFound: !!modal,
            modalVisible: isVisible,
            boundAcademyId: academyIdInput ? academyIdInput.value : '',
            boundAcademyName: academyNameInput ? academyNameInput.value : ''
          };
        })()
      `);

      assert(modalState.modalFound, `Modal #demo-booking-modal injected and found`);
      assert(modalState.modalVisible, `Modal opened on CTA click`);
      assert(modalState.boundAcademyId === acad.slug, `Modal received academyId = '${acad.slug}' (got: '${modalState.boundAcademyId}')`);
      assert(modalState.boundAcademyName.includes(acad.name.split(' ')[0]), `Modal received academyName matching '${acad.name}' (got: '${modalState.boundAcademyName}')`);
    }

    cdp.close();

  } catch (err) {
    console.error('Fatal error during CDP browser testing:', err);
    failedCount++;
    failures.push(err.message);
  } finally {
    if (chromeProcess) {
      chromeProcess.kill();
      console.log('Headless Chrome closed.');
    }
    if (tmpProfile && fs.existsSync(tmpProfile)) {
      try {
        fs.rmSync(tmpProfile, { recursive: true, force: true });
      } catch (e) {}
    }
  }

  console.log('\n============================================================');
  console.log(`TOTAL BROWSER CDP CHECKS: ${testCount}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);
  console.log('============================================================');

  if (failedCount > 0) {
    console.error('\n❌ FAILURES:');
    failures.forEach(f => console.error('  - ' + f));
    process.exit(1);
  } else {
    console.log('\n🎉 ALL BROWSER CDP CHECKS PASSED WITH 100% SUCCESS!\n');
  }
}

runBrowserTests();
