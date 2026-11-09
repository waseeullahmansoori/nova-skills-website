/**
 * Comprehensive Automated Test Suite:
 * Sitewide 1:1 LIVE ONLINE CLASSES Replacement & Verification
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const CHROME_PORT = 9230;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_PORT = 8097;

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
console.log('   NOVA SKILLS 1:1 LIVE ONLINE CLASSES REPLACEMENT TEST SUITE   ');
console.log('================================================================\n');

// --- SECTION 1: STATIC MARKUP & TEMPLATES AUDIT ---
console.log('--- SECTION 1: Static HTML & Templates Markup Audit ---');

// 1. All 12 Academy Landing Pages
for (const slug of ACADEMIES) {
  const pagePath = path.join(ROOT_DIR, `academies/${slug}/index.html`);
  assert(fs.existsSync(pagePath), `[${slug}] academy index.html exists`);
  const content = fs.readFileSync(pagePath, 'utf8');

  assert(
    content.includes('<strong>1:1 LIVE ONLINE CLASSES</strong>'),
    `[${slug}] contains '<strong>1:1 LIVE ONLINE CLASSES</strong>'`
  );
  assert(
    !content.includes('1-on-1 Mentorship'),
    `[${slug}] contains zero '1-on-1 Mentorship'`
  );
  assert(
    !content.includes('1:1 Mentorship'),
    `[${slug}] contains zero '1:1 Mentorship'`
  );
}

// 2. course-detail.html master template
const courseDetailPath = path.join(ROOT_DIR, 'course-detail.html');
assert(fs.existsSync(courseDetailPath), 'course-detail.html exists');
const cdContent = fs.readFileSync(courseDetailPath, 'utf8');
assert(
  cdContent.includes('<div class="demo-benefit-heading"><strong>1:1 LIVE ONLINE CLASSES</strong></div>'),
  'course-detail.html contains 1:1 LIVE ONLINE CLASSES demo benefit heading'
);
assert(
  !cdContent.includes('1-on-1 Mentorship'),
  'course-detail.html contains zero promotional 1-on-1 Mentorship'
);

// 3. All 109 Pre-rendered course pages
const renderedDir = path.join(ROOT_DIR, '_rendered_courses');
const courseFiles = fs.readdirSync(renderedDir).filter(f => f.endsWith('.html') && f !== '404.html');
assert(courseFiles.length === 109, `Found exactly 109 pre-rendered course pages (found ${courseFiles.length})`);

let allCoursesHaveBenefit = true;
for (const cf of courseFiles) {
  const cfContent = fs.readFileSync(path.join(renderedDir, cf), 'utf8');
  if (!cfContent.includes('<div class="demo-benefit-heading"><strong>1:1 LIVE ONLINE CLASSES</strong></div>')) {
    allCoursesHaveBenefit = false;
    console.error(`Missing benefit in ${cf}`);
  }
}
assert(allCoursesHaveBenefit, 'All 109 pre-rendered course pages contain 1:1 LIVE ONLINE CLASSES demo heading');

// 4. Edge functions bundle
const edgeBundlePath = path.join(ROOT_DIR, 'functions/_rendered_courses.js');
assert(fs.existsSync(edgeBundlePath), 'functions/_rendered_courses.js exists');
const edgeContent = fs.readFileSync(edgeBundlePath, 'utf8');
assert(
  edgeContent.includes('1:1 LIVE ONLINE CLASSES'),
  'functions/_rendered_courses.js contains 1:1 LIVE ONLINE CLASSES'
);

// 5. scripts/build-academy-pages.js
const buildAcadPath = path.join(ROOT_DIR, 'scripts/build-academy-pages.js');
const buildAcadContent = fs.readFileSync(buildAcadPath, 'utf8');
assert(
  buildAcadContent.includes('<strong>1:1 LIVE ONLINE CLASSES</strong>'),
  'scripts/build-academy-pages.js generates 1:1 LIVE ONLINE CLASSES'
);

// 6. index.html
const indexPath = path.join(ROOT_DIR, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');
assert(
  indexContent.includes('<span class="stat-headline">1:1 LIVE ONLINE CLASSES</span>'),
  'index.html Hero USP contains 1:1 LIVE ONLINE CLASSES'
);
assert(
  indexContent.includes('<h3>1:1 LIVE ONLINE CLASSES</h3>'),
  'index.html Experience section contains <h3>1:1 LIVE ONLINE CLASSES</h3>'
);

// 7. contact/index.html
const contactPath = path.join(ROOT_DIR, 'contact/index.html');
const contactContent = fs.readFileSync(contactPath, 'utf8');
assert(
  contactContent.includes('<h4>1:1 LIVE ONLINE CLASSES</h4>'),
  'contact/index.html contains <h4>1:1 LIVE ONLINE CLASSES</h4>'
);
assert(
  contactContent.includes('<p>Personalized live learning for eligible courses, subject to availability.</p>'),
  'contact/index.html contains accurate supporting copy'
);
assert(
  !contactContent.includes('1-on-1 Expert Mentorship'),
  'contact/index.html contains zero 1-on-1 Expert Mentorship'
);

// 8. courses.html
const coursesPath = path.join(ROOT_DIR, 'courses.html');
const coursesContent = fs.readFileSync(coursesPath, 'utf8');
assert(
  coursesContent.includes('1:1 live online classes'),
  'courses.html subtitle contains 1:1 live online classes'
);
assert(
  !coursesContent.includes('1-on-1 mentorship, and placement support'),
  'courses.html hero subtitle no longer has old 1-on-1 mentorship phrasing'
);

// 9. academy-detail.js and js/academy-detail.min.js
const adPath = path.join(ROOT_DIR, 'academy-detail.js');
const adContent = fs.readFileSync(adPath, 'utf8');
assert(
  adContent.includes('Personalized 1:1 live online guidance to align your learning path with your dream role.'),
  'academy-detail.js contains updated guidance copy'
);
assert(
  !adContent.includes('Personalized 1-on-1 mentorship to align your learning path'),
  'academy-detail.js does not contain old mentorship copy'
);

const adminPath = path.join(ROOT_DIR, 'js/academy-detail.min.js');
const adminContent = fs.readFileSync(adminPath, 'utf8');
assert(
  adminContent.includes('Personalized 1:1 live online guidance to align your learning path with your dream role.'),
  'js/academy-detail.min.js contains updated guidance copy'
);

// --- SECTION 2: BROWSER CDP COMPUTED MEASUREMENTS ACROSS VIEWPORTS ---
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
    const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-1to1-test-' + Date.now());
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
        width: Math.max(10, box.width),
        height: Math.max(10, box.height),
        scale: 1
      }
    });

    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
  }
}

async function runBrowserTests() {
  let tmpProfileDir = null;
  try {
    await startServer();
    tmpProfileDir = await launchChrome();

    const targetsRes = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${CHROME_PORT}/json`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });

    const pageTarget = targetsRes.find(t => t.type === 'page') || targetsRes[0];
    const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');

    const viewports = [
      { name: '1440px (Desktop)', width: 1440, height: 900 },
      { name: '1024px (Laptop)', width: 1024, height: 768 },
      { name: '768px (Tablet)', width: 768, height: 1024 },
      { name: '390px (Mobile)', width: 390, height: 844 },
      { name: '337px (Galaxy Fold)', width: 337, height: 700 },
      { name: '320px (Small Mobile)', width: 320, height: 568 }
    ];

    // 1. Homepage Hero USP 03 & Experience section
    console.log('\n--- Verifying Homepage Hero USP 03 & Experience Section ---');
    for (const vp of viewports) {
      await cdp.setViewport(vp.width, vp.height);
      await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/index.html` });
      await new Promise(r => setTimeout(r, 600));

      const homeData = await cdp.evaluate(`
        (() => {
          const col3 = document.querySelector('.hero-usp-col-3');
          const uspHeadline = col3 ? col3.querySelector('.stat-headline')?.textContent.trim() : '';
          const uspSub = col3 ? col3.querySelector('.stat-subtext')?.textContent.trim() : '';
          const expH3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('1:1 LIVE ONLINE CLASSES'));
          return {
            uspHeadline,
            uspSub,
            hasExpH3: !!expH3,
            docWidth: document.documentElement.scrollWidth,
            winWidth: window.innerWidth
          };
        })()
      `);

      assert(homeData.uspHeadline === '1:1 LIVE ONLINE CLASSES', `[Homepage @ ${vp.name}] USP 03 headline is "1:1 LIVE ONLINE CLASSES" (got "${homeData.uspHeadline}")`);
      assert(homeData.hasExpH3, `[Homepage @ ${vp.name}] Experience section has "1:1 LIVE ONLINE CLASSES" heading`);
      assert(homeData.docWidth <= homeData.winWidth, `[Homepage @ ${vp.name}] Zero horizontal overflow (${homeData.docWidth} <= ${homeData.winWidth})`);
    }

    // Capture Homepage Desktop and Mobile Screenshots
    await cdp.setViewport(1440, 900);
    await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/index.html` });
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureElementScreenshot('.hero-stats.hero-usp-strip', path.join(ARTIFACT_DIR, 'after_1to1_homepage_hero_desktop_1440px.png'));
    console.log('  📸 Screenshot: after_1to1_homepage_hero_desktop_1440px.png');

    await cdp.setViewport(390, 844);
    await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/index.html` });
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureElementScreenshot('.hero-stats.hero-usp-strip', path.join(ARTIFACT_DIR, 'after_1to1_homepage_hero_mobile_390px.png'));
    console.log('  📸 Screenshot: after_1to1_homepage_hero_mobile_390px.png');

    // 2. Academy Demo Banner (Programming & Digital Marketing)
    console.log('\n--- Verifying Academy Demo Promotional Banner ---');
    const testAcademies = ['programming', 'digital-marketing'];
    for (const slug of testAcademies) {
      for (const vp of viewports) {
        await cdp.setViewport(vp.width, vp.height);
        await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/academies/${slug}/index.html` });
        await new Promise(r => setTimeout(r, 600));

        const bannerData = await cdp.evaluate(`
          (() => {
            const banner = document.querySelector('.academy-demo-banner');
            if (!banner) return null;
            const benefits = banner.querySelectorAll('.academy-demo-benefit');
            let b2Headline = '';
            if (benefits.length >= 2) {
              const strong = benefits[1].querySelector('strong');
              b2Headline = strong ? strong.textContent.trim() : '';
            }
            return {
              b2Headline,
              docWidth: document.documentElement.scrollWidth,
              winWidth: window.innerWidth
            };
          })()
        `);

        assert(bannerData !== null, `[${slug} @ ${vp.name}] Academy banner present`);
        assert(bannerData.b2Headline === '1:1 LIVE ONLINE CLASSES', `[${slug} @ ${vp.name}] Benefit 2 headline is "1:1 LIVE ONLINE CLASSES"`);
        assert(bannerData.docWidth <= bannerData.winWidth, `[${slug} @ ${vp.name}] Zero horizontal overflow (${bannerData.docWidth} <= ${bannerData.winWidth})`);
      }
    }

    // Capture Academy Banner Screenshots
    await cdp.setViewport(1440, 900);
    await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/academies/programming/index.html` });
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureElementScreenshot('.academy-demo-banner', path.join(ARTIFACT_DIR, 'after_1to1_academy_banner_desktop_1440px.png'));
    console.log('  📸 Screenshot: after_1to1_academy_banner_desktop_1440px.png');

    await cdp.setViewport(390, 844);
    await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/academies/programming/index.html` });
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureElementScreenshot('.academy-demo-banner', path.join(ARTIFACT_DIR, 'after_1to1_academy_banner_mobile_390px.png'));
    console.log('  📸 Screenshot: after_1to1_academy_banner_mobile_390px.png');

    // 3. Course Detail Demo Sidebar (archviz-mastery)
    console.log('\n--- Verifying Course Detail Demo Sidebar (archviz-mastery) ---');
    for (const vp of viewports) {
      await cdp.setViewport(vp.width, vp.height);
      await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/course-detail.html?id=archviz-mastery` });
      await new Promise(r => setTimeout(r, 600));

      const sidebarData = await cdp.evaluate(`
        (() => {
          const box = document.querySelector('.detail-demo-benefit-box');
          if (!box) return null;
          const items = box.querySelectorAll('.demo-benefit-item');
          let b2Heading = '';
          if (items.length >= 2) {
            const h = items[1].querySelector('.demo-benefit-heading');
            b2Heading = h ? h.textContent.trim() : '';
          }
          return {
            b2Heading,
            docWidth: document.documentElement.scrollWidth,
            winWidth: window.innerWidth
          };
        })()
      `);

      assert(sidebarData !== null, `[archviz-mastery @ ${vp.name}] Detail demo box present`);
      assert(sidebarData.b2Heading === '1:1 LIVE ONLINE CLASSES', `[archviz-mastery @ ${vp.name}] Benefit 2 heading is "1:1 LIVE ONLINE CLASSES"`);
      assert(sidebarData.docWidth <= sidebarData.winWidth, `[archviz-mastery @ ${vp.name}] Zero horizontal overflow (${sidebarData.docWidth} <= ${sidebarData.winWidth})`);
    }

    // Capture Course Detail Sidebar Screenshots
    await cdp.setViewport(1440, 900);
    await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/course-detail.html?id=archviz-mastery` });
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureElementScreenshot('.detail-demo-benefit-box', path.join(ARTIFACT_DIR, 'after_1to1_course_detail_sidebar_desktop_1440px.png'));
    console.log('  📸 Screenshot: after_1to1_course_detail_sidebar_desktop_1440px.png');

    await cdp.setViewport(390, 844);
    await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/course-detail.html?id=archviz-mastery` });
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureElementScreenshot('.detail-demo-benefit-box', path.join(ARTIFACT_DIR, 'after_1to1_course_detail_sidebar_mobile_390px.png'));
    console.log('  📸 Screenshot: after_1to1_course_detail_sidebar_mobile_390px.png');

    // 4. Contact Page Trust Card
    console.log('\n--- Verifying Contact Page Trust Card ---');
    for (const vp of [viewports[0], viewports[3]]) {
      await cdp.setViewport(vp.width, vp.height);
      await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/contact/index.html` });
      await new Promise(r => setTimeout(r, 600));

      const contactData = await cdp.evaluate(`
        (() => {
          const items = Array.from(document.querySelectorAll('.cro-badge-item'));
          const item = items.find(i => i.querySelector('h4') && i.querySelector('h4').textContent.includes('1:1 LIVE ONLINE CLASSES'));
          if (!item) return null;
          return {
            title: item.querySelector('h4').textContent.trim(),
            copy: item.querySelector('p').textContent.trim(),
            docWidth: document.documentElement.scrollWidth,
            winWidth: window.innerWidth
          };
        })()
      `);

      assert(contactData !== null, `[contact @ ${vp.name}] Found 1:1 LIVE ONLINE CLASSES trust badge item`);
      assert(contactData.title === '1:1 LIVE ONLINE CLASSES', `[contact @ ${vp.name}] Title is "1:1 LIVE ONLINE CLASSES" (got "${contactData.title}")`);
      assert(contactData.copy === 'Personalized live learning for eligible courses, subject to availability.', `[contact @ ${vp.name}] Copy matches approved text`);
      assert(contactData.docWidth <= contactData.winWidth, `[contact @ ${vp.name}] Zero horizontal overflow (${contactData.docWidth} <= ${contactData.winWidth})`);
    }

    // Capture Contact Page Screenshots
    await cdp.setViewport(1440, 900);
    await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/contact/index.html` });
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureElementScreenshot('.cro-trust-card', path.join(ARTIFACT_DIR, 'after_1to1_contact_trust_card_desktop_1440px.png'));
    console.log('  📸 Screenshot: after_1to1_contact_trust_card_desktop_1440px.png');

    await cdp.setViewport(390, 844);
    await cdp.send('Page.navigate', { url: `http://localhost:${APP_PORT}/contact/index.html` });
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureElementScreenshot('.cro-trust-card', path.join(ARTIFACT_DIR, 'after_1to1_contact_trust_card_mobile_390px.png'));
    console.log('  📸 Screenshot: after_1to1_contact_trust_card_mobile_390px.png');

  } finally {
    if (chromeProcess) chromeProcess.kill();
    if (serverProcess) serverProcess.kill();
    if (tmpProfileDir && fs.existsSync(tmpProfileDir)) {
      try {
        fs.rmSync(tmpProfileDir, { recursive: true, force: true });
      } catch (e) {
        // ignore
      }
    }
  }
}

async function main() {
  await runBrowserTests();

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${testCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('================================================================\n');

  if (failedCount > 0) {
    console.error('❌ Failures:');
    failures.forEach(f => console.error('  - ' + f));
    process.exit(1);
  } else {
    console.log('🎉 ALL 1:1 LIVE ONLINE CLASSES REPLACEMENT TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal test error:', err);
  if (chromeProcess) chromeProcess.kill();
  if (serverProcess) serverProcess.kill();
  process.exit(1);
});
