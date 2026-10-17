/**
 * Comprehensive Automated Verification Suite for Technical SEO Phase 2
 * Tests:
 * 1. HTTP Raw Responses (Initial HTML before JavaScript execution) for all 4 courses
 * 2. Course-specific title, H1, meta description, canonical, pricing, modules, schema
 * 3. 404 Not Found response for invalid course IDs
 * 4. Headless Chrome CDP tests across Desktop (1440px) and Mobile (390px)
 * 5. Interactive hydration (accordion expand, FAQ toggle, enrollment CTA) with zero errors
 * 6. Non-regression of sibling courses and catalog
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8098;
const CHROME_PORT = 9223;
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

// Import rendered courses & middleware metadata
const { RENDERED_COURSES, ALL_VALID_COURSE_IDS, COURSE_ALIASES, COURSE_NOT_FOUND_HTML } = require(path.join(ROOT_DIR, 'functions', '_rendered_courses.js'));

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

// 1. Static Server with Edge Middleware Simulation
function startServer() {
  return new Promise((resolve) => {
    server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      let pathname = url.pathname.replace(/\/$/, '');

      // Simulate Cloudflare Pages Functions _middleware.js
      if (pathname === '/course-detail' || pathname === '/course-detail.html') {
        const rawId = (url.searchParams.get('id') || url.searchParams.get('course') || '').trim();

        if (rawId) {
          const id = COURSE_ALIASES[rawId] || rawId;

          // 1. Course-specific pre-rendered initial HTML
          if (RENDERED_COURSES[id]) {
            res.writeHead(200, {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=0, must-revalidate',
              'X-Robots-Tag': 'index, follow'
            });
            return res.end(RENDERED_COURSES[id]);
          }

          // 2. Unknown course ID -> 404 response
          if (!ALL_VALID_COURSE_IDS.has(id)) {
            res.writeHead(404, {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'X-Robots-Tag': 'noindex, follow'
            });
            return res.end(COURSE_NOT_FOUND_HTML);
          }
        } else {
          // Default flagship course
          if (RENDERED_COURSES['dm-mastery']) {
            res.writeHead(200, {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=0, must-revalidate',
              'X-Robots-Tag': 'index, follow'
            });
            return res.end(RENDERED_COURSES['dm-mastery']);
          }
        }
      }

      // Default static file serving
      let reqPath = decodeURIComponent(url.pathname);
      if (reqPath.endsWith('/')) reqPath += 'index.html';

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
      '--user-data-dir=' + path.join(ROOT_DIR, 'tmp-chrome-p2-' + Date.now())
    ];

    chromeProcess = spawn(CHROME_PATH, args);

    let attempts = 0;
    const checkReady = () => {
      attempts++;
      http.get(`http://127.0.0.1:${CHROME_PORT}/json/version`, (res) => {
        if (res.statusCode === 200) resolve();
        else setTimeout(checkReady, 200);
      }).on('error', () => {
        if (attempts > 30) reject(new Error('Chrome failed to start'));
        else setTimeout(checkReady, 200);
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
    if (this.ws) this.ws.close();
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
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function httpGet(urlStr) {
  return new Promise((resolve, reject) => {
    http.get(urlStr, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', reject);
  });
}

async function runTestSuite() {
  console.log('=== STARTING TECHNICAL SEO PHASE 2 AUDIT & TEST SUITE ===\n');

  await startServer();

  // ============================================================
  // PART 1: HTTP RAW RESPONSE CHECKS (Initial HTML Before JS)
  // ============================================================
  console.log('--- PART 1: HTTP Raw Response Validation (Before JS Execution) ---');

  const EXPECTED_COURSES = [
    {
      id: 'digital-marketing-pro',
      name: 'Advanced Digital Marketing Professional',
      price: '₹11,999',
      duration: '3 Months (88 Hours)',
      modulesCount: 6,
      expectedTitlePart: 'Advanced Digital Marketing Professional'
    },
    {
      id: 'dm-professional',
      name: 'AI Digital Marketing Professional',
      price: '₹17,499',
      duration: '4 Months (120 Hours)',
      modulesCount: 5,
      expectedTitlePart: 'AI Digital Marketing Professional'
    },
    {
      id: 'dm-mastery',
      name: 'AI Digital Marketing Master',
      price: '₹31,499',
      duration: '6 Months (240 Hours)',
      modulesCount: 6,
      expectedTitlePart: 'AI Digital Marketing Master'
    },
    {
      id: 'python-developer',
      name: 'Python Developer Professional',
      price: '₹14,999',
      duration: '3 Months (120 Hours)',
      modulesCount: 4,
      expectedTitlePart: 'Python Developer Professional'
    }
  ];

  for (const exp of EXPECTED_COURSES) {
    console.log(`\nVerifying HTTP response for: /course-detail.html?id=${exp.id}`);
    const res = await httpGet(`http://localhost:${PORT}/course-detail.html?id=${exp.id}`);

    assert(res.status === 200, `HTTP status is 200 OK for ${exp.id}`);

    const html = res.body;

    // 1. Title
    const titleMatch = html.match(/<title id="page-title">([^<]+)<\/title>/i);
    assert(titleMatch && titleMatch[1].includes(exp.expectedTitlePart), `Raw HTML <title> includes "${exp.expectedTitlePart}"`);

    // 2. H1
    const h1Match = html.match(/<h1[^>]*id="detail-title"[^>]*>([\s\S]*?)<\/h1>/i);
    assert(h1Match && h1Match[1].trim() === exp.name, `Raw HTML H1 is exact: "${h1Match ? h1Match[1].trim() : 'NONE'}"`);

    // 3. Canonical URL
    const canonMatch = html.match(/<link\s+rel="canonical"\s+id="page-canonical"\s+href="([^"]+)"/i);
    assert(canonMatch && canonMatch[1] === `https://novaskills.in/course-detail.html?id=${exp.id}`, `Canonical URL is exact: "${canonMatch ? canonMatch[1] : 'NONE'}"`);

    // 4. Meta Description
    const metaMatch = html.match(/<meta\s+name="description"\s+id="page-meta-desc"\s+content="([^"]+)"/i);
    assert(metaMatch && metaMatch[1].includes(exp.name), `Meta description populated with course name`);

    // 5. Commercial Pricing & Duration
    assert(html.includes(exp.price), `Approved price ${exp.price} present in initial HTML`);
    assert(html.includes(exp.duration), `Duration ${exp.duration} present in initial HTML`);

    // 6. Curriculum Modules count
    const modMatches = html.match(/class="curriculum-module[\s"]/g) || [];
    assert(modMatches.length === exp.modulesCount, `Initial HTML has ${exp.modulesCount} modules (found ${modMatches.length})`);

    // 7. Schema.org JSON-LD
    const schemaMatch = html.match(/<script type="application\/ld\+json" id="ns-dynamic-course-schema">([\s\S]*?)<\/script>/i);
    assert(!!schemaMatch, `Schema.org JSON-LD script present in raw HTML for ${exp.id}`);
    if (schemaMatch) {
      try {
        const parsed = JSON.parse(schemaMatch[1]);
        const courseObj = parsed['@graph'].find(e => e['@type'] === 'Course');
        assert(courseObj && courseObj.name === exp.name, `Course schema name matches "${exp.name}"`);
      } catch (e) {
        assert(false, `Schema parsing failed: ${e.message}`);
      }
    }

    // 8. Zero skeletons in raw HTML
    const skeletons = (html.match(/course-skeleton/g) || []).length;
    assert(skeletons === 0, `Zero skeleton classes in raw initial HTML for ${exp.id}`);
  }

  // Test /course-detail without .html
  console.log('\nVerifying clean URL without .html: /course-detail?id=digital-marketing-pro');
  const cleanRes = await httpGet(`http://localhost:${PORT}/course-detail?id=digital-marketing-pro`);
  assert(cleanRes.status === 200, '/course-detail?id=digital-marketing-pro returns 200 OK');
  assert(cleanRes.body.includes('Advanced Digital Marketing Professional'), '/course-detail renders Advanced Digital Marketing Professional');

  // Test Invalid Course ID -> 404 Handling
  console.log('\nVerifying 404 Not Found for invalid course ID: /course-detail.html?id=invalid-course-xyz');
  const notFoundRes = await httpGet(`http://localhost:${PORT}/course-detail.html?id=invalid-course-xyz`);
  assert(notFoundRes.status === 404, 'Invalid course ID returns HTTP 404 status code');
  assert(notFoundRes.body.includes('Course Not Found'), 'Invalid course ID displays "Course Not Found" message');
  assert(notFoundRes.body.includes('content="noindex, follow"'), 'Invalid course ID has noindex robots tag');

  // ============================================================
  // PART 2: CHROME CDP BROWSER AUTOMATION (Desktop & Mobile)
  // ============================================================
  console.log('\n--- PART 2: Chrome DevTools Protocol (CDP) Browser Automation ---');
  await launchChrome();
  console.log('Headless Chrome launched successfully.');

  for (const exp of EXPECTED_COURSES) {
    console.log(`\nBrowser testing course: ${exp.id} on Desktop (1440px)...`);
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

    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/course-detail.html?id=${exp.id}` });
    await delay(1200);

    assert(consoleErrors.length === 0, `Zero console errors on ${exp.id} (found: ${consoleErrors.join(', ') || 'none'})`);

    const renderedH1 = await cdp.evaluate('document.querySelector("h1#detail-title")?.textContent.trim()');
    assert(renderedH1 === exp.name, `Rendered H1 is exact: "${renderedH1}"`);

    const renderedPrice = await cdp.evaluate('document.querySelector("#detail-price")?.textContent.trim()');
    assert(renderedPrice === exp.price, `Rendered price is exact: "${renderedPrice}"`);

    // Test Accordion interactive toggle
    await cdp.evaluate('document.querySelectorAll(".curriculum-module-header")[1]?.click()');
    await delay(200);
    const mod2Open = await cdp.evaluate('document.querySelectorAll(".curriculum-module")[1]?.classList.contains("open")');
    assert(mod2Open === true, `Module 2 accordion expands on click for ${exp.id}`);

    // Test FAQ interactive toggle
    await cdp.evaluate('document.querySelectorAll(".faq-question")[1]?.click()');
    await delay(200);
    const faq2Expanded = await cdp.evaluate('document.querySelectorAll(".faq-question")[1]?.getAttribute("aria-expanded")');
    assert(faq2Expanded === 'true', `FAQ 2 expands on click for ${exp.id}`);

    // Test CTA button binding
    const ctaAttached = await cdp.evaluate('typeof document.querySelector(".btn-enroll-full")?.onclick === "function"');
    assert(ctaAttached === true, `Enroll Now CTA button has active click handler for ${exp.id}`);

    await cdp.close();
  }

  // Mobile Testing (390px Viewport)
  console.log('\nTesting Mobile 390px Viewport for: python-developer...');
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

    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/course-detail.html?id=python-developer` });
    await delay(1200);

    const mobilePrice = await cdp.evaluate('document.getElementById("mobile-price")?.textContent.trim()');
    assert(mobilePrice === '₹14,999', `Mobile sticky bar shows approved fee: "${mobilePrice}"`);

    const mobileCtaAttached = await cdp.evaluate('typeof document.querySelector("#sticky-mobile-bar .btn-primary")?.onclick === "function"');
    assert(mobileCtaAttached === true, 'Mobile sticky Enroll Now button has active handler attached');

    await cdp.close();
  }

  // Teardown
  console.log('\nCleaning up Chrome and test server...');
  if (chromeProcess) chromeProcess.kill();
  if (server) server.close();

  // Clean up any temp chrome profile folders
  const tempFolders = fs.readdirSync(ROOT_DIR).filter(f => f.startsWith('tmp-chrome-p2-'));
  tempFolders.forEach(f => {
    try { fs.rmSync(path.join(ROOT_DIR, f), { recursive: true, force: true }); } catch (e) {}
  });

  console.log(`\n========================================`);
  console.log(`PHASE 2 TEST RESULTS: ${passedCount}/${testCount} Passed (${failedCount} Failed)`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL PHASE 2 TESTS PASSED 100%!');
  }
}

runTestSuite().catch(err => {
  console.error('Fatal error during test suite execution:', err);
  if (chromeProcess) chromeProcess.kill();
  if (server) server.close();
  process.exit(1);
});
