/**
 * AUTOMATED QA TEST SUITE: SITEWIDE "PAN-INDIA & MUMBAI" TEXT CORRECTION
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

const EXPECTED_BADGE_TEXT = '📍 Classroom in Siddharth Nagar • 💻 Live Interactive Online (Pan-India)';
const FORBIDDEN_REGEX = /Pan[- ]India\s+(&|&amp;|and)\s+Mumbai/i;

const ACADEMIES = [
  'digital-marketing', 'ai', 'design', 'programming',
  'no-code-web', 'video-motion', '3d', 'career-freelancing',
  'communication', 'kids-tech', 'creator', 'office-productivity'
];

console.log('=== TEST 1: Source and Script Verification ===');

// 1. academy-detail.js
const adJs = fs.readFileSync(path.join(ROOT_DIR, 'academy-detail.js'), 'utf8');
assert(adJs.includes(EXPECTED_BADGE_TEXT), 'academy-detail.js contains approved delivery badge text');
assert(!FORBIDDEN_REGEX.test(adJs), 'academy-detail.js does NOT contain forbidden Pan-India & Mumbai text');

// 2. js/academy-detail.min.js
const adMinJs = fs.readFileSync(path.join(ROOT_DIR, 'js', 'academy-detail.min.js'), 'utf8');
assert(adMinJs.includes(EXPECTED_BADGE_TEXT), 'js/academy-detail.min.js contains approved delivery badge text');
assert(!FORBIDDEN_REGEX.test(adMinJs), 'js/academy-detail.min.js does NOT contain forbidden Pan-India & Mumbai text');

// 3. scripts/build-academy-pages.js
const bap = fs.readFileSync(path.join(ROOT_DIR, 'scripts', 'build-academy-pages.js'), 'utf8');
assert(bap.includes(EXPECTED_BADGE_TEXT), 'scripts/build-academy-pages.js contains approved delivery badge text');
assert(!FORBIDDEN_REGEX.test(bap), 'scripts/build-academy-pages.js does NOT contain forbidden Pan-India & Mumbai text');
assert(bap.includes('for students across Pan-India.'), 'scripts/build-academy-pages.js FAQ text updated to Pan-India');

console.log('\n=== TEST 2: All 12 Pre-rendered Academy Pages ===');
ACADEMIES.forEach(slug => {
  const pagePath = path.join(ROOT_DIR, 'academies', slug, 'index.html');
  assert(fs.existsSync(pagePath), `Page exists: academies/${slug}/index.html`);
  const html = fs.readFileSync(pagePath, 'utf8');
  assert(html.includes(EXPECTED_BADGE_TEXT), `academies/${slug}/index.html renders approved badge text`);
  assert(!FORBIDDEN_REGEX.test(html), `academies/${slug}/index.html has NO forbidden Pan-India & Mumbai text`);
});

// Digital Marketing FAQ check
const dmHtml = fs.readFileSync(path.join(ROOT_DIR, 'academies', 'digital-marketing', 'index.html'), 'utf8');
assert(dmHtml.includes('for students across Pan-India.'), 'Digital Marketing FAQ answer updated to "for students across Pan-India."');

console.log('\n=== TEST 3: Preservation of Legitimate Mumbai References ===');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
assert(indexHtml.includes('Digital Marketing Executive, Mumbai'), 'index.html preserves testimonial role "Digital Marketing Executive, Mumbai"');

const ecomJson = fs.readFileSync(path.join(ROOT_DIR, 'data', 'courses', 'ecommerce-mastery.json'), 'utf8');
assert(ecomJson.includes('buying from a Mumbai store'), 'ecommerce-mastery.json preserves GST industry example referencing Mumbai');

const gdJson = fs.readFileSync(path.join(ROOT_DIR, 'data', 'courses', 'graphic-design-pro.json'), 'utf8');
assert(gdJson.includes('regional hubs (Mumbai, Delhi-NCR'), 'graphic-design-pro.json preserves printing hubs referencing Mumbai');

console.log('\n=== TEST 4: Browser CDP Visual & DOM Verification ===');

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
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.text || 'Runtime.evaluate exception');
    return res.result ? res.result.value : undefined;
  }
  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`  📸 Saved screenshot: ${filePath}`);
  }
  close() {
    if (this.ws) this.ws.close();
  }
}

async function runBrowserTests() {
  // Start local static server
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    let filePath = path.join(ROOT_DIR, reqPath);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      return res.end('Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  const PORT = 8089;
  await new Promise(r => server.listen(PORT, r));

  const CHROME_PORT = 9230;
  const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-pan-india-' + Date.now());
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tmpProfile}`
  ]);

  // Robust poll for Chrome readiness
  let chromeReady = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const v = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/version`);
      if (v.ok) {
        chromeReady = true;
        break;
      }
    } catch (e) {}
  }
  if (!chromeReady) throw new Error('Chrome failed to start on port ' + CHROME_PORT);

  try {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/new`, { method: 'PUT' });
    const target = await res.json();
    const cdp = new CDPClient(target.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    // Desktop 1440px
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/academies/programming/` });
    await new Promise(r => setTimeout(r, 1000));

    const desktopBadge = await cdp.evaluate(`
      (() => {
        const badge = document.querySelector('.badge-delivery');
        return badge ? badge.textContent.trim() : null;
      })()
    `);
    assert(desktopBadge === EXPECTED_BADGE_TEXT, `Browser (1440px) Programming Academy renders badge: "${desktopBadge}"`);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'pan_india_badge_desktop_1440px.png'));

    // Mobile 390px
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/academies/digital-marketing/` });
    await new Promise(r => setTimeout(r, 1000));

    const mobileBadge = await cdp.evaluate(`
      (() => {
        const badge = document.querySelector('.badge-delivery');
        return badge ? badge.textContent.trim() : null;
      })()
    `);
    assert(mobileBadge === EXPECTED_BADGE_TEXT, `Browser (390px) Digital Marketing Academy renders badge: "${mobileBadge}"`);
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'pan_india_badge_mobile_390px.png'));

    cdp.close();
  } finally {
    chromeProcess.kill('SIGKILL');
    server.close();
    try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  }

  console.log('\n======================================================');
  console.log(`TEST SUITE COMPLETE: Passed: ${passed} | Failed: ${failed}`);
  console.log('======================================================');
  if (failed > 0) process.exit(1);
}

runBrowserTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
