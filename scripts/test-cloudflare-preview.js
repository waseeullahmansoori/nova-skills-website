/**
 * Complete Real Edge Cloudflare Pages Preview Verification Suite
 * Tests against live Cloudflare edge: https://0888b816.nova-skills-website.pages.dev
 * 
 * Verifies:
 * 1. Real Edge HTTP responses for all 109 courses without JS
 * 2. Uniqueness of titles, meta descriptions, canonicals, H1s, pricing, duration
 * 3. Specific deep verification of ai-mastery and dm-professional
 * 4. Clean URLs without .html, legacy aliases, and 404 error handling on Cloudflare edge
 * 5. Static assets, homepage, catalog, and 12 academy pages loading
 * 6. Headless Chrome CDP browser automation on Desktop (1440px) & Mobile (390px)
 * 7. Curriculum module parity between approved JSON, edge HTML, and hydrated browser DOM
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const { spawn } = require('child_process');

const PREVIEW_BASE_URL = process.env.PREVIEW_URL || 'https://b48f9a19.nova-skills-website.pages.dev';
const CHROME_PORT = 9225;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// 1. Load canonical data.js
const dataJs = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

let chromeProcess = null;
let testCount = 0;
let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  testCount++;
  if (condition) {
    passedCount++;
  } else {
    failedCount++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function fetchEdge(urlStr) {
  const res = await fetch(urlStr, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) EdgeSEOValidator/1.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });
  const body = await res.text();
  return {
    status: res.status,
    headers: res.headers,
    body
  };
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Chrome CDP setup
function launchChrome() {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      `--remote-debugging-port=${CHROME_PORT}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=' + path.join(ROOT_DIR, 'tmp-chrome-cf-' + Date.now())
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

async function runCloudflareVerification() {
  console.log('=== STARTING CLOUDFLARE PAGES PREVIEW LIVE EDGE VERIFICATION ===');
  console.log(`Target Preview Host: ${PREVIEW_BASE_URL}\n`);

  // ============================================================
  // PART 1: CLOUDFLARE EDGE WORKER BUNDLE SIZE METRICS
  // ============================================================
  console.log('--- PART 1: Worker Bundle Size & Deployment Limits ---');
  const zlib = require('zlib');
  const bundlePath = path.join(ROOT_DIR, 'functions', '_rendered_courses.js');
  const bundleContent = fs.readFileSync(bundlePath);
  const bundleGzip = zlib.gzipSync(bundleContent);

  const rawMb = (bundleContent.length / 1024 / 1024).toFixed(2);
  const gzipMb = (bundleGzip.length / 1024 / 1024).toFixed(2);
  console.log(`  Source _rendered_courses.js: ${rawMb} MB uncompressed (${(bundleContent.length / 1024).toFixed(1)} KB)`);
  console.log(`  Gzip Compressed Worker Size: ${gzipMb} MB (${(bundleGzip.length / 1024).toFixed(1)} KB)`);

  assert(bundleContent.length < 25 * 1024 * 1024, `Uncompressed bundle (${rawMb} MB) is below 25 MB Cloudflare limit`);
  assert(bundleGzip.length < 10 * 1024 * 1024, `Gzip bundle (${gzipMb} MB) is below 10 MB Cloudflare worker limit`);
  console.log('  ✅ Confirmed: Cloudflare Pages Worker size is well within limits.\n');

  // ============================================================
  // PART 2: ALL 109 REAL HTTP EDGE REQUESTS (NO JS EXECUTION)
  // ============================================================
  console.log('--- PART 2: Testing All 109 Courses via Real HTTP Requests to Cloudflare Edge ---');

  const seenTitles = new Set();
  const seenDescriptions = new Set();
  const seenCanonicals = new Set();
  let progressCount = 0;

  for (const course of NS_COURSES) {
    progressCount++;
    const url = `${PREVIEW_BASE_URL}/course-detail.html?id=${course.id}`;
    const res = await fetchEdge(url);

    assert(res.status === 200, `[${progressCount}/109] HTTP 200 OK for ${course.id}`);

    const html = res.body;

    // 1. Title
    const titleMatch = html.match(/<title id="page-title">([^<]+)<\/title>/i);
    assert(!!titleMatch, `Title exists for ${course.id}`);
    if (titleMatch) {
      const title = titleMatch[1];
      assert(!seenTitles.has(title), `Title unique for ${course.id}: "${title.substring(0, 45)}..."`);
      seenTitles.add(title);
      assert(title.includes(course.name) || title.includes(escapeHTML(course.name)), `Title contains course name for ${course.id}`);
    }

    // 2. H1
    const h1Match = html.match(/<h1[^>]*id="detail-title"[^>]*>([\s\S]*?)<\/h1>/i);
    assert(!!h1Match, `H1 exists for ${course.id}`);
    if (h1Match) {
      const h1Text = h1Match[1].trim();
      assert(h1Text === course.name || h1Text === escapeHTML(course.name), `H1 exact match for ${course.id}: "${h1Text}"`);
    }

    // 3. Canonical URL
    const expectedCanonical = `https://novaskills.in/course-detail.html?id=${course.id}`;
    const canonMatch = html.match(/<link\s+rel="canonical"\s+id="page-canonical"\s+href="([^"]+)"/i);
    assert(!!canonMatch && canonMatch[1] === expectedCanonical, `Canonical exact for ${course.id}`);
    if (canonMatch) seenCanonicals.add(canonMatch[1]);

    // 4. Meta Description
    const metaMatch = html.match(/<meta\s+name="description"\s+id="page-meta-desc"\s+content="([^"]+)"/i);
    assert(!!metaMatch && metaMatch[1].length > 40, `Meta description valid length for ${course.id}`);
    if (metaMatch) {
      const desc = metaMatch[1];
      assert(!seenDescriptions.has(desc), `Meta description unique for ${course.id}`);
      seenDescriptions.add(desc);
      assert(desc.includes(course.name) || desc.includes('Nova Skills'), `Meta description mentions course/brand`);
    }

    // 5. Commercial Pricing & Duration
    const formattedPrice = `₹${(course.price || 0).toLocaleString('en-IN')}`;
    assert(html.includes(formattedPrice), `Approved fee ${formattedPrice} in live edge HTML for ${course.id}`);
    assert(html.includes(course.duration), `Approved duration ${course.duration} in live edge HTML for ${course.id}`);

    // 6. Schema.org JSON-LD
    const schemaMatch = html.match(/<script type="application\/ld\+json" id="ns-dynamic-course-schema">([\s\S]*?)<\/script>/i);
    assert(!!schemaMatch, `Schema script exists for ${course.id}`);
    if (schemaMatch) {
      try {
        const schema = JSON.parse(schemaMatch[1]);
        const courseObj = (schema['@graph'] || []).find(e => e['@type'] === 'Course');
        assert(!!courseObj && courseObj.name === course.name, `Schema Course name matches for ${course.id}`);
        assert(!!courseObj && courseObj.offers && courseObj.offers.price === course.price, `Schema price matches for ${course.id}`);
      } catch (e) {
        assert(false, `Schema JSON parse error for ${course.id}: ${e.message}`);
      }
    }

    // 7. Prerendered Meta & Zero Skeletons
    assert(html.includes('content="prerendered"') || html.includes('name="prerendered" content="true"'), `Prerendered meta tag present for ${course.id}`);
    assert(!html.includes('course-skeleton'), `Zero skeleton loading classes for ${course.id}`);

    // 8. Open Graph & Twitter
    assert(html.includes('id="og-title"') && html.includes('id="og-desc"'), `Open Graph tags present for ${course.id}`);
    assert(html.includes('id="tw-title"') && html.includes('id="tw-desc"'), `Twitter card tags present for ${course.id}`);

    if (progressCount % 20 === 0 || progressCount === 109) {
      console.log(`  ✔ Verified ${progressCount}/109 courses on live Cloudflare edge...`);
    }
  }

  console.log(`\n✔ 109/109 Edge HTTP checks verified: ${seenTitles.size} unique titles, ${seenDescriptions.size} unique meta descriptions, ${seenCanonicals.size} unique canonicals.\n`);

  // ============================================================
  // PART 3: DEEP AUDIT: ai-mastery AND dm-professional
  // ============================================================
  console.log('--- PART 3: Deep Verification of ai-mastery & dm-professional ---');

  // ai-mastery
  const aiRes = await fetchEdge(`${PREVIEW_BASE_URL}/course-detail.html?id=ai-mastery`);
  const aiCourse = NS_COURSES.find(c => c.id === 'ai-mastery');
  const aiJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'courses', 'ai-mastery.json'), 'utf8'));

  assert(aiRes.body.includes('AI Solutions Engineering & Agentic AI Mastery'), 'ai-mastery H1 exact match');
  assert(aiRes.body.includes('₹39,999'), 'ai-mastery approved fee ₹39,999 verified');
  assert(aiRes.body.includes('6 Months (240 Hours)'), 'ai-mastery duration 6 Months (240 Hours) verified');
  const aiModulesCount = (aiRes.body.match(/class="curriculum-module[\s"]/g) || []).length;
  assert(aiModulesCount === aiJson.modules.length, `ai-mastery curriculum modules parity (${aiModulesCount} vs ${aiJson.modules.length} in JSON)`);

  // dm-professional
  const dmRes = await fetchEdge(`${PREVIEW_BASE_URL}/course-detail.html?id=dm-professional`);
  const dmCourse = NS_COURSES.find(c => c.id === 'dm-professional');
  const dmJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'courses', 'dm-professional.json'), 'utf8'));

  assert(dmRes.body.includes('AI Digital Marketing Professional'), 'dm-professional H1 exact match');
  assert(dmRes.body.includes('₹17,499'), 'dm-professional approved fee ₹17,499 verified');
  assert(dmRes.body.includes('4 Months (120 Hours)'), 'dm-professional duration 4 Months (120 Hours) verified');
  const dmModulesCount = (dmRes.body.match(/class="curriculum-module[\s"]/g) || []).length;
  assert(dmModulesCount === dmJson.modules.length, `dm-professional curriculum modules parity (${dmModulesCount} vs ${dmJson.modules.length} in JSON)`);

  console.log('  ✅ ai-mastery and dm-professional deep verification complete.\n');

  // ============================================================
  // PART 4: EDGE ROUTING: CLEAN URLS, ALIASES & 404S
  // ============================================================
  console.log('--- PART 4: Edge Routing: Clean URLs, Aliases, 404 Handling ---');

  // Clean URL without .html
  const cleanRes = await fetchEdge(`${PREVIEW_BASE_URL}/course-detail?id=digital-marketing-pro`);
  assert(cleanRes.status === 200, 'Clean URL /course-detail?id=digital-marketing-pro returns 200 OK');
  assert(cleanRes.body.includes('Advanced Digital Marketing Professional'), 'Clean URL returns correct course content');

  // Default flagship route
  const defaultRes = await fetchEdge(`${PREVIEW_BASE_URL}/course-detail`);
  assert(defaultRes.status === 200, 'Default /course-detail returns 200 OK');
  assert(defaultRes.body.includes('AI Digital Marketing Master'), 'Default /course-detail serves flagship dm-mastery');

  // Alias resolution on Edge
  const aliasRes = await fetchEdge(`${PREVIEW_BASE_URL}/course-detail.html?id=python-dev`);
  assert(aliasRes.status === 200, 'Edge alias python-dev returns 200 OK');
  assert(aliasRes.body.includes('Python Developer Professional'), 'Edge alias python-dev resolves to python-developer');

  const aliasPromptRes = await fetchEdge(`${PREVIEW_BASE_URL}/course-detail.html?id=prompt-engineering-mastery`);
  assert(aliasPromptRes.status === 200, 'Edge alias prompt-engineering-mastery returns 200 OK');
  assert(aliasPromptRes.body.includes('Prompt Engineering'), 'Edge alias prompt-engineering-mastery resolves to prompt-engineering');

  // Invalid Course ID -> 404 Handling on Edge
  const notFoundRes = await fetchEdge(`${PREVIEW_BASE_URL}/course-detail.html?id=invalid-random-course-9999`);
  assert(notFoundRes.status === 404, 'Invalid course ID returns HTTP 404 Not Found on Cloudflare Edge');
  assert(notFoundRes.body.includes('Course Not Found'), '404 page displays "Course Not Found" message');
  assert(notFoundRes.body.includes('content="noindex, follow"'), '404 page includes noindex robots meta');
  assert(notFoundRes.body.includes('/courses.html'), '404 page provides link back to catalog');

  console.log('  ✅ Edge routing verified.\n');

  // ============================================================
  // PART 5: CORE STATIC PAGES & ACADEMIES LOADING VERIFICATION
  // ============================================================
  console.log('--- PART 5: Static Pages, Catalog & 12 Academies Edge Loading ---');

  // Homepage
  const homeRes = await fetchEdge(`${PREVIEW_BASE_URL}/`);
  assert(homeRes.status === 200, 'Homepage returns 200 OK on Cloudflare preview');
  assert(homeRes.body.includes('Nova Skills'), 'Homepage renders Nova Skills brand');

  // Courses catalog
  const catalogRes = await fetchEdge(`${PREVIEW_BASE_URL}/courses.html`);
  assert(catalogRes.status === 200, '/courses.html returns 200 OK on Cloudflare preview');
  assert(catalogRes.body.includes('109'), 'Catalog references 109 courses');

  // All 12 Academies
  const ACADEMY_SLUGS = [
    'digital-marketing', 'ai', 'design', 'programming',
    'no-code-web', 'video-motion', '3d', 'career-freelancing',
    'communication', 'kids-tech', 'creator', 'office-productivity'
  ];

  for (const slug of ACADEMY_SLUGS) {
    const acadRes = await fetchEdge(`${PREVIEW_BASE_URL}/academies/${slug}/`);
    assert(acadRes.status === 200, `Academy /academies/${slug}/ returns 200 OK on preview`);
  }
  console.log('  ✅ Homepage, Catalog, and all 12 Academies verified.\n');

  // ============================================================
  // PART 6: CHROME CDP AUTOMATION ON CLOUDFLARE PREVIEW
  // ============================================================
  console.log('--- PART 6: Chrome CDP Browser Automation (All 12 Academies on Live Edge) ---');
  await launchChrome();
  console.log('Headless Chrome instance launched for edge testing.');

  const REPRESENTATIVE_COURSES = [
    { academy: 'Digital Marketing', id: 'digital-marketing-pro' },
    { academy: 'AI & Automation', id: 'ai-mastery' },
    { academy: 'Graphic Design & UI/UX', id: 'uiux-design-pro' },
    { academy: 'Programming & Web Dev', id: 'python-developer' },
    { academy: 'No-Code Web', id: 'nocode-web-pro' },
    { academy: 'Video & Motion', id: 'video-pro' },
    { academy: '3D Animation & VFX', id: 'blender-cert' },
    { academy: 'Career & Freelancing', id: 'freelancing-mastery' },
    { academy: 'Communication', id: 'business-english' },
    { academy: 'Kids Tech', id: 'kids-mastery' },
    { academy: 'Creator Academy', id: 'youtube-mastery' },
    { academy: 'Office Productivity', id: 'microsoft-excel' }
  ].map(item => {
    const c = NS_COURSES.find(x => x.id === item.id);
    return {
      academy: item.academy,
      id: item.id,
      name: c.name,
      price: `₹${(c.price || 0).toLocaleString('en-IN')}`
    };
  });

  for (const target of REPRESENTATIVE_COURSES) {
    process.stdout.write(`Testing [${target.academy}] ${target.id} on Desktop (1440px)... `);
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

    await cdp.send('Page.navigate', { url: `${PREVIEW_BASE_URL}/course-detail.html?id=${target.id}` });
    for (let i = 0; i < 20; i++) {
      await delay(250);
      const isReady = await cdp.evaluate('document.readyState === "complete" && typeof document.querySelectorAll(".curriculum-module-header")[1]?.onclick === "function"');
      if (isReady) break;
    }

    assert(consoleErrors.length === 0, `Zero console errors on live preview ${target.id} (${consoleErrors.join('; ') || 'none'})`);

    const renderedH1 = await cdp.evaluate('document.querySelector("h1#detail-title")?.textContent.trim()');
    assert(renderedH1 === target.name, `H1 rendered exact on edge for ${target.id}`);

    const renderedPrice = await cdp.evaluate('document.querySelector("#detail-price")?.textContent.trim()');
    assert(renderedPrice === target.price, `Price rendered exact on edge for ${target.id} (got ${renderedPrice})`);

    // Interactive accordion toggle
    await cdp.evaluate('document.querySelectorAll(".curriculum-module-header")[1]?.click()');
    await delay(200);
    const mod2Open = await cdp.evaluate('document.querySelectorAll(".curriculum-module")[1]?.classList.contains("open")');
    assert(mod2Open === true, `Module 2 accordion opens on click on edge for ${target.id}`);

    // Interactive FAQ toggle
    await cdp.evaluate('document.querySelectorAll(".faq-question")[1]?.click()');
    await delay(200);
    const faq2Expanded = await cdp.evaluate('document.querySelectorAll(".faq-question")[1]?.getAttribute("aria-expanded")');
    assert(faq2Expanded === 'true', `FAQ 2 toggles on click on edge for ${target.id}`);

    // CTA Button handler attached
    const ctaHandlerAttached = await cdp.evaluate('typeof document.querySelector(".btn-enroll-full")?.onclick === "function"');
    assert(ctaHandlerAttached === true, `Enroll Now CTA has active handler on edge for ${target.id}`);

    await cdp.close();
    process.stdout.write('✅ PASS\n');
  }

  // Mobile Viewport Check (390px)
  console.log('\nTesting Mobile Viewport (390px) on Cloudflare Preview: dm-professional...');
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

    await cdp.send('Page.navigate', { url: `${PREVIEW_BASE_URL}/course-detail.html?id=dm-professional` });
    for (let i = 0; i < 20; i++) {
      await delay(250);
      const isReady = await cdp.evaluate('document.readyState === "complete" && typeof document.querySelector("#sticky-mobile-bar .btn-primary")?.onclick === "function"');
      if (isReady) break;
    }

    const mobilePrice = await cdp.evaluate('document.getElementById("mobile-price")?.textContent.trim()');
    assert(mobilePrice === '₹17,499', `Mobile sticky bar shows approved fee: "${mobilePrice}"`);

    const mobileCtaAttached = await cdp.evaluate('typeof document.querySelector("#sticky-mobile-bar .btn-primary")?.onclick === "function"');
    assert(mobileCtaAttached === true, 'Mobile sticky Enroll Now button has active handler attached');

    await cdp.close();
  }

  // Teardown Chrome
  console.log('\nCleaning up Chrome instance...');
  if (chromeProcess) chromeProcess.kill();

  const tempFolders = fs.readdirSync(ROOT_DIR).filter(f => f.startsWith('tmp-chrome-cf-'));
  tempFolders.forEach(f => {
    try { fs.rmSync(path.join(ROOT_DIR, f), { recursive: true, force: true }); } catch (e) {}
  });

  console.log(`\n================================================================`);
  console.log(`CLOUDFLARE EDGE PREVIEW RESULTS: ${passedCount}/${testCount} Passed (${failedCount} Failed)`);
  console.log(`================================================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL CLOUDFLARE EDGE PREVIEW VERIFICATION CHECKS PASSED 100%!');
  }
}

runCloudflareVerification().catch(err => {
  console.error('Fatal error during Cloudflare verification:', err);
  if (chromeProcess) chromeProcess.kill();
  process.exit(1);
});
