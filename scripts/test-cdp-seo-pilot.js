/**
 * Chrome DevTools Protocol (CDP) Automated Test Suite for Technical SEO Pilot
 * Tests desktop (1440px) & mobile (390px), JS-enabled & JS-disabled,
 * interactive accordion/FAQ/CTA behaviors, and backward compatibility.
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8099;
const CHROME_PORT = 9222;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

let server = null;
let chromeProcess = null;
let testCount = 0;
let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  testCount++;
  if (condition) {
    passedCount++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedCount++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Static HTTP Server
function startServer() {
  return new Promise((resolve) => {
    server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(req.url.split('?')[0]);
      if (reqPath.endsWith('/')) {
        reqPath += 'index.html';
      }

      let filePath = path.join(ROOT_DIR, reqPath);
      if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found: ' + reqPath);
      }
    });

    server.listen(PORT, () => {
      console.log(`Local test server running at http://localhost:${PORT}`);
      resolve();
    });
  });
}

// 2. Launch Chrome
function launchChrome() {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      `--remote-debugging-port=${CHROME_PORT}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=' + path.join(ROOT_DIR, 'tmp-chrome-profile-' + Date.now())
    ];

    chromeProcess = spawn(CHROME_PATH, args);

    let attempts = 0;
    const checkReady = () => {
      attempts++;
      http.get(`http://127.0.0.1:${CHROME_PORT}/json/version`, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(checkReady, 200);
        }
      }).on('error', () => {
        if (attempts > 30) {
          reject(new Error('Chrome failed to start within 6 seconds'));
        } else {
          setTimeout(checkReady, 200);
        }
      });
    };
    checkReady();
  });
}

// 3. Simple CDP Client
class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 0;
    this.callbacks = new Map();
    this.events = new Map();
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
        } else if (data.method && this.events.has(data.method)) {
          this.events.get(data.method)(data.params);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(event, handler) {
    this.events.set(event, handler);
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return result.result.value;
  }

  async close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function getNewTab() {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:${CHROME_PORT}/json/new`, { method: 'PUT' }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const tab = JSON.parse(raw);
          resolve(tab.webSocketDebuggerUrl);
        } catch (e) {
          reject(new Error(`Failed to parse /json/new response: ${raw} (${e.message})`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// 4. Run Tests
async function runTests() {
  console.log('=== STARTING CHROME CDP BROWSER AUTOMATION SUITE ===\n');

  await startServer();
  console.log('Starting headless Chrome...');
  await launchChrome();
  console.log('Connected to Chrome DevTools Protocol.');

  // ==========================================
  // SCENARIO 1: JAVASCRIPT DISABLED (Search Engine Crawler & Non-JS Fallback)
  // ==========================================
  console.log('\n--- SCENARIO 1: /courses/digital-marketing-pro/ [JS DISABLED] ---');
  {
    const wsUrl = await getNewTab();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    // Disable JavaScript execution
    await cdp.send('Emulation.setScriptExecutionDisabled', { value: true });

    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/courses/digital-marketing-pro/` });
    await delay(1200);

    // Verify Title
    const title = await cdp.evaluate('document.title');
    assert(title && title.includes('Advanced Digital Marketing Professional'), `JS-Disabled Title: "${title}"`);

    // Verify H1
    const h1 = await cdp.evaluate('document.querySelector("h1#detail-title")?.textContent.trim()');
    assert(h1 === 'Advanced Digital Marketing Professional', `JS-Disabled H1: "${h1}"`);

    // Verify Meta Canonical
    const canonical = await cdp.evaluate('document.querySelector("link#page-canonical")?.getAttribute("href")');
    assert(canonical === 'https://novaskills.in/courses/digital-marketing-pro/', `JS-Disabled Canonical: "${canonical}"`);

    // Verify Meta Description
    const metaDesc = await cdp.evaluate('document.querySelector("meta#page-meta-desc")?.getAttribute("content")');
    assert(metaDesc && metaDesc.includes('Advanced Digital Marketing Professional'), `JS-Disabled Meta Desc: "${metaDesc?.substring(0, 70)}..."`);

    // Verify Pricing & Discount
    const price = await cdp.evaluate('document.querySelector("#detail-price")?.textContent.trim()');
    assert(price === '₹11,999', `JS-Disabled Price: "${price}"`);

    const origPrice = await cdp.evaluate('document.querySelector("#detail-original-price")?.textContent.trim()');
    assert(origPrice === '₹29,999', `JS-Disabled Original Price: "${origPrice}"`);

    const discount = await cdp.evaluate('document.querySelector("#detail-discount")?.textContent.trim()');
    assert(discount === '60% OFF', `JS-Disabled Discount: "${discount}"`);

    // Verify Curriculum Modules (1 to 6)
    const moduleCount = await cdp.evaluate('document.querySelectorAll(".curriculum-module").length');
    assert(moduleCount === 6, `JS-Disabled has 6 pre-rendered curriculum modules (found ${moduleCount})`);

    // Verify Module 1 is open by default
    const mod1Open = await cdp.evaluate('document.querySelector(".curriculum-module")?.classList.contains("open")');
    assert(mod1Open === true, 'JS-Disabled Module 1 is open and accessible by default');

    // Verify FAQs are in raw HTML
    const faqCount = await cdp.evaluate('document.querySelectorAll("#course-faq-grid .faq-item").length');
    assert(faqCount >= 3, `JS-Disabled has ${faqCount} pre-rendered FAQs in raw DOM`);

    // Verify Schema.org JSON-LD Script
    const schemaContent = await cdp.evaluate('document.querySelector("script#ns-dynamic-course-schema")?.textContent');
    assert(schemaContent && schemaContent.includes('"Course"') && schemaContent.includes('"offers"'), 'JS-Disabled has pre-rendered Schema.org JSON-LD in head');

    // Verify no skeletons left
    const skeletonCount = await cdp.evaluate('document.querySelectorAll(".course-skeleton-text, .course-skeleton-dark").length');
    assert(skeletonCount === 0, `JS-Disabled has zero skeletons visible in DOM (${skeletonCount})`);

    await cdp.close();
  }

  // ==========================================
  // SCENARIO 2: JAVASCRIPT ENABLED (Desktop 1440px - Interactive Hydration)
  // ==========================================
  console.log('\n--- SCENARIO 2: /courses/digital-marketing-pro/ [JS ENABLED - DESKTOP 1440px] ---');
  {
    const wsUrl = await getNewTab();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    const consoleErrors = [];
    cdp.on('Runtime.consoleAPICalled', (params) => {
      if (params.type === 'error') {
        consoleErrors.push(params.args.map(a => a.value || a.description).join(' '));
      }
    });

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/courses/digital-marketing-pro/` });
    await delay(1500);

    // Verify console errors
    assert(consoleErrors.length === 0, `Zero browser console errors during hydration (errors: ${consoleErrors.join(', ') || 'none'})`);

    // Verify H1 and Price preserved after hydration
    const h1 = await cdp.evaluate('document.querySelector("h1#detail-title")?.textContent.trim()');
    assert(h1 === 'Advanced Digital Marketing Professional', `Rendered H1: "${h1}"`);

    const price = await cdp.evaluate('document.querySelector("#detail-price")?.textContent.trim()');
    assert(price === '₹11,999', `Rendered Price: "${price}"`);

    // Interactive Test 1: Accordion toggle
    const mod2InitiallyOpen = await cdp.evaluate('document.querySelectorAll(".curriculum-module")[1]?.classList.contains("open")');
    assert(mod2InitiallyOpen === false, 'Module 2 is initially closed');

    await cdp.evaluate('document.querySelectorAll(".curriculum-module-header")[1]?.click()');
    await delay(200);

    const mod2AfterClick = await cdp.evaluate('document.querySelectorAll(".curriculum-module")[1]?.classList.contains("open")');
    assert(mod2AfterClick === true, 'Module 2 opens on user click via progressive hydration');

    // Interactive Test 2: FAQ toggle
    const faq2InitialExpanded = await cdp.evaluate('document.querySelectorAll(".faq-question")[1]?.getAttribute("aria-expanded")');
    assert(faq2InitialExpanded === 'false', 'FAQ 2 is initially collapsed');

    await cdp.evaluate('document.querySelectorAll(".faq-question")[1]?.click()');
    await delay(200);

    const faq2AfterClick = await cdp.evaluate('document.querySelectorAll(".faq-question")[1]?.getAttribute("aria-expanded")');
    assert(faq2AfterClick === 'true', 'FAQ 2 expands on click via progressive hydration');

    // Interactive Test 3: CTA trigger
    const ctaWorking = await cdp.evaluate(`
      (function() {
        var clicked = false;
        var btn = document.querySelector('.btn-enroll-full');
        return typeof btn?.onclick === 'function';
      })()
    `);
    assert(ctaWorking === true, 'Hero "Enroll Now" CTA button has active click handler attached');

    await cdp.close();
  }

  // ==========================================
  // SCENARIO 3: MOBILE (390px Viewport)
  // ==========================================
  console.log('\n--- SCENARIO 3: /courses/digital-marketing-pro/ [MOBILE 390px VIEWPORT] ---');
  {
    const wsUrl = await getNewTab();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });

    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/courses/digital-marketing-pro/` });
    await delay(1500);

    // Verify Sticky Mobile Bar
    const mobileBarVisible = await cdp.evaluate(`
      (function() {
        var el = document.getElementById('sticky-mobile-bar');
        if (!el) return false;
        var style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })()
    `);
    assert(mobileBarVisible === true, 'Mobile sticky bar is rendered and visible at 390px');

    const mobilePrice = await cdp.evaluate('document.getElementById("mobile-price")?.textContent.trim()');
    assert(mobilePrice === '₹11,999', `Mobile sticky price displays: "${mobilePrice}"`);

    const mobileBtnHandler = await cdp.evaluate('typeof document.querySelector("#sticky-mobile-bar .btn-primary")?.onclick === "function"');
    assert(mobileBtnHandler === true, 'Mobile sticky "Enroll Now" button has active click handler attached');

    await cdp.close();
  }

  // ==========================================
  // SCENARIO 4: BACKWARD COMPATIBILITY REDIRECTION
  // ==========================================
  console.log('\n--- SCENARIO 4: BACKWARD COMPATIBILITY (/course-detail.html?id=digital-marketing-pro) ---');
  {
    const wsUrl = await getNewTab();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/course-detail.html?id=digital-marketing-pro` });
    await delay(1500);

    const finalUrl = await cdp.evaluate('window.location.href');
    assert(finalUrl.includes('/courses/digital-marketing-pro/'), `Query URL forward redirected to: "${finalUrl}"`);

    const h1 = await cdp.evaluate('document.querySelector("h1#detail-title")?.textContent.trim()');
    assert(h1 === 'Advanced Digital Marketing Professional', `Redirected page renders correct course: "${h1}"`);

    await cdp.close();
  }

  // ==========================================
  // SCENARIO 5: SIBLING COURSES PRESERVATION (108 other courses)
  // ==========================================
  console.log('\n--- SCENARIO 5: SIBLING COURSES NON-REGRESSION (Dynamic Shared Template) ---');
  {
    const wsUrl = await getNewTab();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    // Test dm-professional
    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/course-detail.html?id=dm-professional` });
    await delay(1500);

    const dmProTitle = await cdp.evaluate('document.querySelector("h1#detail-title")?.textContent.trim()');
    const dmProPrice = await cdp.evaluate('document.querySelector("#detail-price")?.textContent.trim()');
    assert(dmProTitle === 'AI Digital Marketing Professional', `dm-professional renders title: "${dmProTitle}"`);
    assert(dmProPrice === '₹17,499', `dm-professional price remains approved: "${dmProPrice}"`);

    // Test dm-mastery
    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/course-detail.html?id=dm-mastery` });
    await delay(1500);

    const dmMastTitle = await cdp.evaluate('document.querySelector("h1#detail-title")?.textContent.trim()');
    const dmMastPrice = await cdp.evaluate('document.querySelector("#detail-price")?.textContent.trim()');
    assert(dmMastTitle === 'AI Digital Marketing Master', `dm-mastery renders title: "${dmMastTitle}"`);
    assert(dmMastPrice === '₹31,499', `dm-mastery price remains approved: "${dmMastPrice}"`);

    await cdp.close();
  }

  // ==========================================
  // SCENARIO 6: CATALOG LINKING (/courses.html)
  // ==========================================
  console.log('\n--- SCENARIO 6: CATALOG CARD LINKING (/courses.html) ---');
  {
    const wsUrl = await getNewTab();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/courses.html` });
    await delay(1500);

    const pilotCardLink = await cdp.evaluate(`
      (function() {
        var card = Array.from(document.querySelectorAll('.course-card')).find(c => c.textContent.includes('Advanced Digital Marketing Professional'));
        var link = card ? card.querySelector('.course-title a')?.getAttribute('href') : null;
        var btnLink = card ? card.querySelector('a.btn-outline')?.getAttribute('href') : null;
        return { link: link, btnLink: btnLink };
      })()
    `);

    assert(pilotCardLink.link === '/courses/digital-marketing-pro/', `Catalog title link points to clean directory: "${pilotCardLink.link}"`);
    assert(pilotCardLink.btnLink === '/courses/digital-marketing-pro/', `Catalog View Syllabus button points to clean directory: "${pilotCardLink.btnLink}"`);

    await cdp.close();
  }

  // Teardown
  console.log('\nClosing Chrome and stopping local server...');
  if (chromeProcess) chromeProcess.kill();
  if (server) server.close();

  console.log(`\n========================================`);
  console.log(`CDP AUTOMATION TEST RESULTS: ${passedCount}/${testCount} Passed (${failedCount} Failed)`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL CDP BROWSER TESTS PASSED 100%!');
  }
}

runTests().catch(err => {
  console.error('Fatal error during CDP test execution:', err);
  if (chromeProcess) chromeProcess.kill();
  if (server) server.close();
  process.exit(1);
});
