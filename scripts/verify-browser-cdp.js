const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PORT = 9225;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let chromeProcess = null;
let testCount = 0;
let passedCount = 0;
let failedCount = 0;
const failures = [];

function assert(condition, message) {
  testCount++;
  if (condition) {
    passedCount++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedCount++;
    console.error(`  ✗ FAIL: ${message}`);
    failures.push(message);
  }
}

function launchChrome() {
  return new Promise((resolve, reject) => {
    const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-qa-' + Date.now());
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
      throw new Error(res.exceptionDetails.text + ': ' + JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    for (let i = 0; i < 40; i++) {
      const ready = await this.evaluate('document.readyState === "complete" && !!document.querySelector("#nav-links > li > a") && !!document.querySelector(".footer-links a")');
      if (ready) break;
      await new Promise(r => setTimeout(r, 200));
    }
    await new Promise(r => setTimeout(r, 300));
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width <= 768
    });
    await new Promise(r => setTimeout(r, 300));
  }

  async screenshot(filename) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log(`    📸 Captured: ${filename}`);
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

async function runTests() {
  console.log('================================================================');
  console.log('  LIVE HEADLESS CHROME QA: RESPONSIVE NAV & CITY PAGES');
  console.log('================================================================\n');

  let tmpProfile = '';
  let cdp = null;
  try {
    tmpProfile = await launchChrome();
    cdp = await getNewPageCDP();

    // 1. TEST HOMEPAGE DESKTOP (1440px)
    console.log('[TEST 1] Homepage Desktop (1440px)');
    await cdp.setViewport(1440, 900);
    await cdp.navigate('http://127.0.0.1:8097/');
    const homeDesktop = await cdp.evaluate(`(() => {
      const links = Array.from(document.querySelectorAll('#nav-links > li > a'));
      const texts = links.map(a => a.innerText.trim());
      const locIdx = texts.findIndex(t => t === 'Learning Locations');
      const coursesIdx = texts.findIndex(t => t.startsWith('Courses'));
      const aiIdx = texts.findIndex(t => t.includes('AI Career Advisor'));
      const locEl = links[locIdx];
      const rect = locEl ? locEl.getBoundingClientRect() : null;
      const footerLink = Array.from(document.querySelectorAll('.footer-links a')).find(a => a.innerText.trim() === 'Learning Locations');
      return {
        locIdx,
        coursesIdx,
        aiIdx,
        href: locEl ? locEl.getAttribute('href') : null,
        height: rect ? rect.height : 0,
        footerExists: !!footerLink,
        footerHref: footerLink ? footerLink.getAttribute('href') : null,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`);

    assert(homeDesktop.locIdx === homeDesktop.coursesIdx + 1, 'Learning Locations is directly after Courses in desktop nav');
    assert(homeDesktop.locIdx === homeDesktop.aiIdx - 1, 'Learning Locations is directly before AI Career Advisor in desktop nav');
    assert(homeDesktop.href === '/branches/', 'Learning Locations desktop nav href is /branches/');
    assert(homeDesktop.height <= 44, 'Learning Locations desktop nav link does not wrap vertically (' + homeDesktop.height + 'px)');
    assert(homeDesktop.footerExists && homeDesktop.footerHref === '/branches/', 'Footer contains Learning Locations link to /branches/');
    assert(!homeDesktop.overflow, 'No horizontal overflow on homepage desktop 1440px');
    await cdp.screenshot('qa_home_header_1440px.png');

    // Scroll to footer and capture
    await cdp.evaluate('document.querySelector(".footer-links").scrollIntoView({block: "center"})');
    await new Promise(r => setTimeout(r, 400));
    await cdp.screenshot('qa_home_footer_1440px.png');

    // 2. TEST HOMEPAGE MEDIUM (1050px)
    console.log('\n[TEST 2] Homepage Medium Viewport (1050px)');
    await cdp.setViewport(1050, 900);
    await cdp.evaluate('window.scrollTo(0, 0)');
    await new Promise(r => setTimeout(r, 300));
    const homeMedium = await cdp.evaluate(`(() => {
      const links = Array.from(document.querySelectorAll('#nav-links > li > a'));
      const heights = links.map(a => a.getBoundingClientRect().height);
      const maxH = Math.max(...heights);
      return {
        maxHeight: maxH,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`);
    assert(homeMedium.maxHeight <= 44, 'Nav links stay single-line at 1050px viewport (max height: ' + homeMedium.maxHeight + 'px)');
    assert(!homeMedium.overflow, 'No horizontal overflow at 1050px');
    await cdp.screenshot('qa_home_header_1050px.png');

    // 3. TEST HOMEPAGE MOBILE DRAWER (390px)
    console.log('\n[TEST 3] Homepage Mobile Drawer (390px & 320px)');
    await cdp.setViewport(390, 844);
    await cdp.evaluate('document.getElementById("hamburger").click()');
    await new Promise(r => setTimeout(r, 400));
    const mobileDrawer = await cdp.evaluate(`(() => {
      const nav = document.getElementById('nav-links');
      const locEl = Array.from(nav.querySelectorAll('a')).find(a => a.innerText.trim() === 'Learning Locations');
      const rect = locEl ? locEl.getBoundingClientRect() : null;
      return {
        isOpen: nav.classList.contains('open'),
        locExists: !!locEl,
        width: rect ? rect.width : 0,
        height: rect ? rect.height : 0,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`);
    assert(mobileDrawer.isOpen, 'Mobile drawer opens on hamburger click');
    assert(mobileDrawer.locExists, 'Learning Locations present inside mobile drawer');
    assert(mobileDrawer.height >= 40, 'Touch target height adequate (' + mobileDrawer.height + 'px)');
    assert(!mobileDrawer.overflow, 'No horizontal overflow on 390px mobile drawer');
    await cdp.screenshot('qa_mobile_drawer_390px.png');

    // Close menu via overlay or click
    await cdp.evaluate('document.getElementById("hamburger").click()');
    await new Promise(r => setTimeout(r, 300));

    // Check 320px
    await cdp.setViewport(320, 640);
    await cdp.evaluate('document.getElementById("hamburger").click()');
    await new Promise(r => setTimeout(r, 400));
    const mobile320Overflow = await cdp.evaluate('document.documentElement.scrollWidth > window.innerWidth');
    assert(!mobile320Overflow, 'No horizontal overflow on 320px mobile drawer');
    await cdp.screenshot('qa_mobile_drawer_320px.png');

    // 4. TEST DIRECTORY PAGE (/branches/)
    console.log('\n[TEST 4] Locations Directory (/branches/)');
    await cdp.setViewport(1440, 900);
    await cdp.navigate('http://127.0.0.1:8097/branches/');
    const dirChecks = await cdp.evaluate(`(() => {
      const locNav = Array.from(document.querySelectorAll('#nav-links > li > a')).find(a => a.textContent.trim() === 'Learning Locations');
      const bodyText = document.body.innerText;
      const footerLoc = Array.from(document.querySelectorAll('.footer-links a')).find(a => a.textContent.trim() === 'Learning Locations');
      return {
        hasActiveClass: locNav ? locNav.classList.contains('active') : false,
        hasAriaCurrent: locNav ? locNav.getAttribute('aria-current') === 'page' : false,
        has0LiveProjects: bodyText.includes('0 Live Projects'),
        footerHasLoc: !!footerLoc,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`);
    assert(dirChecks.hasActiveClass, 'Learning Locations nav item has .active class on /branches/');
    assert(dirChecks.hasAriaCurrent, 'Learning Locations nav item has aria-current="page" on /branches/');
    assert(!dirChecks.has0LiveProjects, 'Directory page does not contain "0 Live Projects"');
    assert(dirChecks.footerHasLoc, 'Directory page footer contains Learning Locations');
    assert(!dirChecks.overflow, 'No horizontal overflow on Directory 1440px');
    await cdp.evaluate('document.querySelector(".loc-pathway-card") && document.querySelector(".loc-pathway-card").scrollIntoView({block: "center"})');
    await new Promise(r => setTimeout(r, 400));
    await cdp.screenshot('qa_directory_cards_1440px.png');

    await cdp.evaluate('document.querySelector(".footer-links").scrollIntoView({block: "center"})');
    await new Promise(r => setTimeout(r, 400));
    await cdp.screenshot('qa_directory_footer_1440px.png');

    // 5. TEST CITY PAGE (/branches/indore/) - DESKTOP, TABLET, MOBILE
    console.log('\n[TEST 5] City Page (/branches/indore/)');
    await cdp.setViewport(1440, 900);
    await cdp.navigate('http://127.0.0.1:8097/branches/indore/');
    const indoreChecks = await cdp.evaluate(`(() => {
      const locNav = Array.from(document.querySelectorAll('#nav-links > li > a')).find(a => a.innerText.trim() === 'Learning Locations');
      const bodyText = document.body.innerText;
      const ths = Array.from(document.querySelectorAll('.city-comparison-table th')).map(th => th.innerText.trim());
      const firstRowTds = Array.from(document.querySelectorAll('.city-comparison-table tbody tr:first-child td')).length;
      return {
        hasActiveClass: locNav ? locNav.classList.contains('active') : false,
        has0Projects: bodyText.includes('0 Projects'),
        hasLiveProjects: bodyText.includes('Live Projects'),
        ths,
        firstRowTds,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`);
    assert(indoreChecks.hasActiveClass, 'Learning Locations nav item has .active class on city page');
    assert(!indoreChecks.has0Projects, 'City page body text has 0 occurrences of "0 Projects"');
    assert(!indoreChecks.hasLiveProjects, 'City page body text has 0 occurrences of "Live Projects"');
    assert(indoreChecks.ths.length === 5 && !indoreChecks.ths.includes('Live Projects'), 'Comparison table has 5 columns without Live Projects');
    assert(indoreChecks.firstRowTds === 5, 'Comparison table row has 5 cells matching headers');
    assert(!indoreChecks.overflow, 'No horizontal overflow on Indore 1440px');

    // Screenshot course cards & table at 1440px
    await cdp.evaluate('document.querySelector(".city-courses-grid").scrollIntoView({block: "start"})');
    await new Promise(r => setTimeout(r, 300));
    await cdp.screenshot('qa_indore_cards_1440px.png');

    await cdp.evaluate('document.querySelector(".city-comparison-table").scrollIntoView({block: "center"})');
    await new Promise(r => setTimeout(r, 300));
    await cdp.screenshot('qa_indore_table_1440px.png');

    // Check Tablet 768px
    await cdp.setViewport(768, 1024);
    await cdp.evaluate('document.querySelector(".city-courses-grid").scrollIntoView({block: "start"})');
    await new Promise(r => setTimeout(r, 300));
    const tabletOverflow = await cdp.evaluate('document.documentElement.scrollWidth > window.innerWidth');
    assert(!tabletOverflow, 'No horizontal overflow on Indore 768px tablet');
    await cdp.screenshot('qa_indore_cards_768px.png');

    // Check Mobile 390px
    await cdp.setViewport(390, 844);
    await cdp.evaluate('document.querySelector(".city-courses-grid").scrollIntoView({block: "start"})');
    await new Promise(r => setTimeout(r, 300));
    const mobile390Overflow = await cdp.evaluate('document.documentElement.scrollWidth > window.innerWidth');
    assert(!mobile390Overflow, 'No horizontal overflow on Indore 390px mobile');
    await cdp.screenshot('qa_indore_cards_390px.png');

    // Check Mobile 320px
    await cdp.setViewport(320, 640);
    await cdp.evaluate('document.querySelector(".city-courses-grid").scrollIntoView({block: "start"})');
    await new Promise(r => setTimeout(r, 300));
    const mobile320CityOverflow = await cdp.evaluate('document.documentElement.scrollWidth > window.innerWidth');
    assert(!mobile320CityOverflow, 'No horizontal overflow on Indore 320px mobile');
    await cdp.screenshot('qa_indore_cards_320px.png');

    // 6. TEST TEXT-FIRST CITY PAGE (/branches/basti/)
    console.log('\n[TEST 6] Text-First City Page (/branches/basti/)');
    await cdp.setViewport(1440, 900);
    await cdp.navigate('http://127.0.0.1:8097/branches/basti/');
    const bastiChecks = await cdp.evaluate(`(() => {
      const bodyText = document.body.innerText;
      const ths = Array.from(document.querySelectorAll('.city-comparison-table th')).length;
      return {
        has0Projects: bodyText.includes('0 Projects'),
        hasLiveProjects: bodyText.includes('Live Projects'),
        ths,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`);
    assert(!bastiChecks.has0Projects, 'Basti city page has 0 occurrences of "0 Projects"');
    assert(!bastiChecks.hasLiveProjects, 'Basti city page has 0 occurrences of "Live Projects"');
    assert(bastiChecks.ths === 5, 'Basti comparison table has 5 columns');
    assert(!bastiChecks.overflow, 'No horizontal overflow on Basti 1440px');

    console.log('\n================================================================');
    console.log(`  BROWSER QA RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log('================================================================\n');

    if (failedCount > 0) {
      console.error('Failures:', failures);
      process.exitCode = 1;
    }
  } finally {
    if (cdp) cdp.close();
    if (chromeProcess) chromeProcess.kill();
    if (tmpProfile && fs.existsSync(tmpProfile)) {
      try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
    }
  }
}

runTests();
