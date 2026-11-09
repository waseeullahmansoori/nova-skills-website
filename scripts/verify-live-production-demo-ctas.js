/**
 * LIVE PRODUCTION VERIFICATION SUITE FOR SITEWIDE FREE DEMO CTA INTEGRATION
 * Target: https://novaskills.in
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PORT = 9226;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let chromeProcess = null;
let passed = 0;
let failed = 0;
const results = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', message });
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    results.push({ status: 'FAIL', message });
    console.error(`  ❌ FAIL: ${message}`);
  }
}

function launchChrome() {
  return new Promise((resolve, reject) => {
    const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-live-' + Date.now());
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

  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`  📸 Saved screenshot: ${filePath}`);
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

async function navigateAndWait(cdp, url) {
  console.log(`Navigating to ${url}...`);
  await cdp.send('Page.navigate', { url });
  
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const ready = await cdp.evaluate(`
        (() => {
          return typeof window.openDemoModal === 'function' && typeof window.closeDemoModal === 'function';
        })()
      `);
      if (ready) {
        console.log(`  Page scripts fully ready after ${(i + 1) * 250}ms.`);
        return;
      }
    } catch (e) {}
  }
  console.warn('Timed out waiting for openDemoModal, proceeding...');
}

async function runLiveVerification() {
  console.log('================================================================');
  console.log('STARTING LIVE PRODUCTION VERIFICATION (https://novaskills.in)');
  console.log('================================================================\n');

  const tmpProfile = await launchChrome();
  const cdp = await getNewPageCDP();

  try {
    // -------------------------------------------------------------
    // 1. LIVE HOMEPAGE VERIFICATION (Desktop 1440px)
    // -------------------------------------------------------------
    console.log('--- 1. Live Homepage CTAs (Desktop 1440px) ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await navigateAndWait(cdp, 'https://novaskills.in/');

    // Announcement CTA
    const ann = await cdp.evaluate(`
      (async () => {
        const cta = document.querySelector('a.announcement-cta[href="#demo"]');
        if (!cta) return { found: false };
        cta.click();
        await new Promise(r => setTimeout(r, 150));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        const optCount = document.querySelectorAll('#demo-course-select option:not([value=""])').length;
        closeDemoModal();
        return { found: true, isOpen, sourceCta, optCount };
      })()
    `);
    assert(ann.found && ann.isOpen && ann.sourceCta === 'announcement_bar', 'Live Homepage Announcement Demo CTA opens Demo form with sourceCta: announcement_bar');
    assert(ann.optCount === 33, `Live Announcement CTA dropdown lists all 33 demo-eligible programs (found: ${ann.optCount})`);

    await new Promise(r => setTimeout(r, 400));

    // Hero Primary CTA
    const hero = await cdp.evaluate(`
      (async () => {
        const btn = document.getElementById('hero-cta-primary');
        if (!btn) return { found: false };
        btn.click();
        await new Promise(r => setTimeout(r, 150));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        closeDemoModal();
        return { found: true, isOpen, sourceCta };
      })()
    `);
    assert(hero.found && hero.isOpen && hero.sourceCta === 'hero_primary', 'Live Hero Primary CTA opens Demo form with sourceCta: hero_primary');

    await new Promise(r => setTimeout(r, 400));

    // Learning Journey Step 02 CTA
    const journey = await cdp.evaluate(`
      (async () => {
        const jBtn = document.querySelector('.journey-demo-cta');
        if (!jBtn) return { found: false };
        jBtn.click();
        await new Promise(r => setTimeout(r, 150));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        closeDemoModal();
        return { found: true, isOpen, sourceCta };
      })()
    `);
    assert(journey.found && journey.isOpen && journey.sourceCta === 'learning_journey_step02', 'Live Learning Journey Step 02 CTA opens Demo form with sourceCta: learning_journey_step02');

    await new Promise(r => setTimeout(r, 400));

    // Featured Card Demo Chip
    const card = await cdp.evaluate(`
      (async () => {
        const chip = document.querySelector('#course-dm-pro .course-demo-chip');
        if (!chip) return { found: false };
        chip.click();
        await new Promise(r => setTimeout(r, 150));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const courseId = document.getElementById('demo-course-id')?.value;
        const courseName = document.getElementById('demo-course-name')?.value;
        const academyName = document.getElementById('demo-academy-name')?.value;
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        closeDemoModal();
        return { found: true, isOpen, courseId, courseName, academyName, sourceCta };
      })()
    `);
    assert(card.found && card.isOpen && card.courseId === 'dm-professional', 'Live Homepage Featured card preselects course ID: dm-professional');
    assert(card.courseName === 'AI Digital Marketing Specialist', 'Live Homepage Featured card preselects correct course name');

    await new Promise(r => setTimeout(r, 400));

    // Footer Demo Link
    const footer = await cdp.evaluate(`
      (async () => {
        const footerLinks = Array.from(document.querySelectorAll('.footer-links a'));
        const link = footerLinks.find(a => a.textContent.includes('Book a Free Demo'));
        if (!link) return { found: false };
        link.click();
        await new Promise(r => setTimeout(r, 150));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        closeDemoModal();
        return { found: true, isOpen, sourceCta };
      })()
    `);
    assert(footer.found && footer.isOpen && footer.sourceCta === 'footer_quick_link', 'Live Footer Book a Free Demo link opens Demo form with sourceCta: footer_quick_link');

    await new Promise(r => setTimeout(r, 400));

    // Strict Form Separation
    const sep = await cdp.evaluate(`
      (async () => {
        openConsultationPopup();
        await new Promise(r => setTimeout(r, 150));
        const consultOverlay = document.getElementById('popup-overlay');
        const demoModal = document.getElementById('demo-booking-modal');
        const consultVisible = consultOverlay && window.getComputedStyle(consultOverlay).display !== 'none';
        const demoHidden = !demoModal || demoModal.hidden;
        closeConsultationPopup();
        await new Promise(r => setTimeout(r, 200));

        openEnrollmentModal('Test', 'Test Academy', '3 Months', '₹19,900', 'test');
        await new Promise(r => setTimeout(r, 150));
        const enrollModal = document.getElementById('course-enrollment-modal');
        const enrollVisible = enrollModal && !enrollModal.hidden && enrollModal.classList.contains('open');
        const demoStillHidden = !demoModal || demoModal.hidden;
        closeEnrollmentModal();

        return { consultVisible, demoHidden, enrollVisible, demoStillHidden };
      })()
    `);
    assert(sep.consultVisible && sep.demoHidden, 'Live Consultation CTA strictly opens Consultation popup only');
    assert(sep.enrollVisible && sep.demoStillHidden, 'Live Enrollment CTA strictly opens Enrollment modal only');

    // Screenshot of Live Demo Form on Desktop
    await cdp.evaluate(`openDemoModal({ courseId: 'dm-professional', courseName: 'AI Digital Marketing Specialist', academyName: 'Digital Marketing Academy', sourceCta: 'live_verification_desktop' });`);
    await new Promise(r => setTimeout(r, 300));
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'live_production_sitewide_demo_modal_1440px.png'));
    await cdp.evaluate(`closeDemoModal();`);
    await new Promise(r => setTimeout(r, 400));

    // -------------------------------------------------------------
    // 2. LIVE ACADEMY ENTRY POINTS (Programming & No-Code)
    // -------------------------------------------------------------
    console.log('\n--- 2. Live Academy Pages Verification ---');
    await navigateAndWait(cdp, 'https://novaskills.in/academies/programming/');

    const progHero = await cdp.evaluate(`
      (async () => {
        const btn = document.getElementById('btn-academy-hero-demo');
        if (!btn) return { found: false };
        btn.click();
        await new Promise(r => setTimeout(r, 150));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        const academyName = document.getElementById('demo-academy-name')?.value;
        const options = Array.from(document.querySelectorAll('#demo-course-select option:not([value=""])')).map(o => o.value);
        closeDemoModal();
        return { found: true, isOpen, sourceCta, academyName, optionsCount: options.length };
      })()
    `);
    assert(progHero.found && progHero.isOpen && progHero.sourceCta === 'academy_hero', 'Live Programming Academy Hero CTA opens Demo modal with sourceCta: academy_hero');
    assert(progHero.optionsCount === 3, `Live Programming Academy filters dropdown to 3 eligible courses (found: ${progHero.optionsCount})`);

    await new Promise(r => setTimeout(r, 400));

    // No-Code Web Academy (Slug Parity)
    await navigateAndWait(cdp, 'https://novaskills.in/academies/no-code-web/');
    const nocodeBanner = await cdp.evaluate(`
      (async () => {
        const btn = document.querySelector('.academy-demo-btn');
        if (!btn) return { found: false };
        btn.click();
        await new Promise(r => setTimeout(r, 150));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        const options = Array.from(document.querySelectorAll('#demo-course-select option:not([value=""])')).map(o => o.value);
        closeDemoModal();
        return { found: true, isOpen, sourceCta, optionsCount: options.length };
      })()
    `);
    assert(nocodeBanner.found && nocodeBanner.isOpen && nocodeBanner.sourceCta === 'academy_demo_banner', 'Live No-Code Web Academy Promotional Banner opens Demo modal with sourceCta: academy_demo_banner');
    assert(nocodeBanner.optionsCount === 3, `Live No-Code Academy filters dropdown to 3 eligible courses (found: ${nocodeBanner.optionsCount})`);

    // -------------------------------------------------------------
    // 3. LIVE COURSE DETAIL PAGE (Eligible vs Ineligible)
    // -------------------------------------------------------------
    console.log('\n--- 3. Live Course Detail Pages (Eligible vs Ineligible) ---');
    await navigateAndWait(cdp, 'https://novaskills.in/courses/dm-professional/');

    const liveCdpEligible = await cdp.evaluate(`
      (async () => {
        const btn = document.getElementById('btn-detail-book-demo');
        if (!btn) return { found: false };
        const isVisible = window.getComputedStyle(btn).display !== 'none';
        btn.click();
        await new Promise(r => setTimeout(r, 150));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const courseId = document.getElementById('demo-course-id')?.value;
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        closeDemoModal();
        return { found: true, isVisible, isOpen, courseId, sourceCta };
      })()
    `);
    assert(liveCdpEligible.found && liveCdpEligible.isVisible && liveCdpEligible.courseId === 'dm-professional', 'Live Eligible Course Detail (dm-professional) renders visible Demo button with course preselection');
    assert(liveCdpEligible.sourceCta === 'course_detail_sidebar', 'Live Sidebar Demo CTA passes sourceCta: course_detail_sidebar');

    await new Promise(r => setTimeout(r, 400));

    // Ineligible course: html-css
    await navigateAndWait(cdp, 'https://novaskills.in/courses/html-css/');
    const liveCdpIneligible = await cdp.evaluate(`
      (() => {
        const btn = document.getElementById('btn-detail-book-demo');
        const demoItem = document.getElementById('detail-demo-item');
        const hasVisibleBtn = btn && window.getComputedStyle(btn).display !== 'none';
        const isDemoItemHidden = !demoItem || window.getComputedStyle(demoItem).display === 'none';
        return { hasVisibleBtn, isDemoItemHidden };
      })()
    `);
    assert(!liveCdpIneligible.hasVisibleBtn, 'Live Ineligible Course Detail (html-css) does NOT offer Book Free Demo button');
    assert(liveCdpIneligible.isDemoItemHidden, 'Live Ineligible Course Detail hides 2-Day Free Demo benefit item');

    // -------------------------------------------------------------
    // 4. LIVE MOBILE RESPONSIVE VERIFICATION (390px iPhone 14)
    // -------------------------------------------------------------
    console.log('\n--- 4. Live Mobile 390px Responsive Verification ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await navigateAndWait(cdp, 'https://novaskills.in/');
    await cdp.evaluate(`openDemoModal({ courseId: 'dm-professional', courseName: 'AI Digital Marketing Specialist', academyName: 'Digital Marketing Academy', sourceCta: 'live_verification_mobile' });`);
    await new Promise(r => setTimeout(r, 300));
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'live_production_sitewide_demo_modal_390px.png'));

    const mobileCheck = await cdp.evaluate(`
      (() => {
        const modal = document.getElementById('demo-booking-modal');
        const dialog = modal?.querySelector('.demo-modal-dialog');
        const submitBtn = document.getElementById('demo-submit-btn');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const submitReachable = submitBtn && submitBtn.offsetHeight > 0;
        closeDemoModal();
        return { isOpen, submitReachable };
      })()
    `);
    assert(mobileCheck.isOpen && mobileCheck.submitReachable, 'Live Mobile 390px: Free Demo modal opens and submit button is reachable');

  } finally {
    cdp.close();
    if (chromeProcess) chromeProcess.kill('SIGKILL');
    try {
      fs.rmSync(tmpProfile, { recursive: true, force: true });
    } catch (e) {}
  }

  console.log('\n================================================================');
  console.log(`LIVE PRODUCTION VERIFICATION COMPLETE: Passed: ${passed} | Failed: ${failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runLiveVerification().catch(err => {
  console.error('Live verification error:', err);
  if (chromeProcess) chromeProcess.kill('SIGKILL');
  process.exit(1);
});
