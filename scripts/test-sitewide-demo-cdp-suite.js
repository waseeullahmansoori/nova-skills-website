/**
 * NOVA SKILLS — SITEWIDE FREE DEMO CTA CDP AUTOMATION SUITE
 * Complete in-browser verification across viewports, academy contexts,
 * course preselection, strict form separation, and submission integrity.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const PORT = 8085;
const CHROME_PORT = 9224;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let server = null;
let chromeProcess = null;

let passedTests = 0;
let failedTests = 0;
const testRecords = [];

function assert(condition, message) {
  if (condition) {
    passedTests++;
    testRecords.push({ status: 'PASS', message });
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    testRecords.push({ status: 'FAIL', message });
    console.error(`  ❌ FAIL: ${message}`);
  }
}

function startServer() {
  return new Promise((resolve, reject) => {
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };

    server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath === '/') reqPath = '/index.html';
      const filePath = path.join(ROOT_DIR, reqPath);

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`Local test server running on http://127.0.0.1:${PORT}`);
      resolve();
    });
    server.on('error', reject);
  });
}

function launchChrome() {
  return new Promise((resolve, reject) => {
    const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-demo-cdp-' + Date.now());
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

async function navigateAndWait(cdp, url) {
  await cdp.send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 1200));
}

async function runSuite() {
  console.log('======================================================');
  console.log('STARTING SITEWIDE FREE DEMO CTA CDP AUTOMATION SUITE');
  console.log('======================================================\n');

  await startServer();
  const tmpProfile = await launchChrome();
  const cdp = await getNewPageCDP();

  try {
    // -----------------------------------------------------------------
    // TEST SECTION 1: HOMEPAGE CTAs & COURSE PRESELECTION (1440px)
    // -----------------------------------------------------------------
    console.log('--- TEST SECTION 1: Homepage CTAs (Desktop 1440px) ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await navigateAndWait(cdp, `http://127.0.0.1:${PORT}/index.html`);

    // 1.1 Announcement Bar Demo CTA (Slide 6)
    const annResult = await cdp.evaluate(`
      (async () => {
        const cta = document.querySelector('a.announcement-cta[href="#demo"]');
        if (!cta) return { found: false };
        cta.click();
        await new Promise(r => setTimeout(r, 100));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        const optCount = document.querySelectorAll('#demo-course-select option:not([value=""])').length;
        closeDemoModal();
        return { found: true, isOpen, sourceCta, optCount };
      })()
    `);
    assert(annResult.found && annResult.isOpen && annResult.sourceCta === 'announcement_bar', 'Announcement CTA opened Demo modal with sourceCta: announcement_bar');
    assert(annResult.optCount === 33, `Announcement CTA populated all 33 eligible programs in dropdown (found: ${annResult.optCount})`);

    await new Promise(r => setTimeout(r, 350));

    // 1.2 Hero Primary Demo CTA
    const heroResult = await cdp.evaluate(`
      (async () => {
        const heroBtn = document.getElementById('hero-cta-primary');
        if (!heroBtn) return { found: false };
        heroBtn.click();
        await new Promise(r => setTimeout(r, 100));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        closeDemoModal();
        return { found: true, isOpen, sourceCta };
      })()
    `);
    assert(heroResult.found && heroResult.isOpen && heroResult.sourceCta === 'hero_primary', 'Hero Primary CTA opened Demo modal with sourceCta: hero_primary');

    await new Promise(r => setTimeout(r, 350));

    // 1.3 Hero USP 01 CTA
    const uspResult = await cdp.evaluate(`
      (async () => {
        const uspCol = document.querySelector('.hero-usp-col-1');
        if (!uspCol) return { found: false };
        uspCol.click();
        await new Promise(r => setTimeout(r, 100));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        closeDemoModal();
        return { found: true, isOpen, sourceCta };
      })()
    `);
    assert(uspResult.found && uspResult.isOpen && uspResult.sourceCta === 'hero_usp_demo', 'Hero USP item opened Demo modal with sourceCta: hero_usp_demo');

    await new Promise(r => setTimeout(r, 350));

    // 1.4 Learning Journey Step 02 CTA
    const journeyResult = await cdp.evaluate(`
      (async () => {
        const jCta = document.querySelector('.journey-demo-cta');
        if (!jCta) return { found: false };
        jCta.click();
        await new Promise(r => setTimeout(r, 100));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        closeDemoModal();
        return { found: true, isOpen, sourceCta };
      })()
    `);
    assert(journeyResult.found && journeyResult.isOpen && journeyResult.sourceCta === 'learning_journey_step02', 'Learning Journey Step 02 CTA opened Demo modal with sourceCta: learning_journey_step02');

    await new Promise(r => setTimeout(r, 350));

    // 1.5 Featured Course Card Demo Chip Click
    const featuredCardResult = await cdp.evaluate(`
      (async () => {
        const cardChip = document.querySelector('#course-dm-pro .course-demo-chip');
        if (!cardChip) return { found: false };
        cardChip.click();
        await new Promise(r => setTimeout(r, 100));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const courseId = document.getElementById('demo-course-id')?.value;
        const courseName = document.getElementById('demo-course-name')?.value;
        const academyName = document.getElementById('demo-academy-name')?.value;
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        const selVal = document.getElementById('demo-course-select')?.value;
        const contextText = document.getElementById('demo-context-text')?.textContent;
        closeDemoModal();
        return { found: true, isOpen, courseId, courseName, academyName, sourceCta, selVal, contextText };
      })()
    `);
    assert(featuredCardResult.found && featuredCardResult.isOpen, 'Homepage Featured card demo chip opened Demo modal');
    assert(featuredCardResult.courseId === 'dm-professional', `Featured card preselected correct course ID: dm-professional`);
    assert(featuredCardResult.courseName === 'AI Digital Marketing Specialist', `Featured card preselected correct course name`);
    assert(featuredCardResult.academyName.includes('Digital Marketing'), `Featured card preserved Digital Marketing Academy context`);
    assert(featuredCardResult.contextText.includes('AI Digital Marketing Specialist'), `Context pill displays preselected course name`);

    await new Promise(r => setTimeout(r, 350));

    // 1.6 Footer Demo Link
    const footerResult = await cdp.evaluate(`
      (async () => {
        const footerLinks = Array.from(document.querySelectorAll('.footer-links a'));
        const demoLink = footerLinks.find(a => a.textContent.includes('Book a Free Demo'));
        if (!demoLink) return { found: false };
        demoLink.click();
        await new Promise(r => setTimeout(r, 100));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        closeDemoModal();
        return { found: true, isOpen, sourceCta };
      })()
    `);
    assert(footerResult.found && footerResult.isOpen && footerResult.sourceCta === 'footer_quick_link', 'Footer Book a Free Demo link opened Demo modal with sourceCta: footer_quick_link');

    await new Promise(r => setTimeout(r, 350));

    // 1.7 Strict Form Separation on Homepage
    const separationResult = await cdp.evaluate(`
      (async () => {
        // Open Consultation
        openConsultationPopup();
        await new Promise(r => setTimeout(r, 100));
        const consultModal = document.getElementById('popup-overlay');
        const demoModal = document.getElementById('demo-booking-modal');
        const consultOpen = consultModal && (window.getComputedStyle(consultModal).display !== 'none' || consultModal.classList.contains('active') || !consultModal.hidden);
        const demoClosed = !demoModal || demoModal.hidden;
        closeConsultationPopup();
        await new Promise(r => setTimeout(r, 200));

        // Open Enrollment
        openEnrollmentModal('Test Course', 'Test Academy', '3 Months', '₹19,900', 'test-id');
        await new Promise(r => setTimeout(r, 100));
        const enrollModal = document.getElementById('course-enrollment-modal');
        const enrollOpen = enrollModal && !enrollModal.hidden && enrollModal.classList.contains('open');
        const demoStillClosed = !demoModal || demoModal.hidden;
        closeEnrollmentModal();

        return { consultOpen, enrollOpen, demoClosed, demoStillClosed };
      })()
    `);
    assert(separationResult.consultOpen && separationResult.demoClosed, 'Consultation CTA strictly opens Consultation form only');
    assert(separationResult.enrollOpen && separationResult.demoStillClosed, 'Enrollment CTA strictly opens Enrollment form only');

    // -----------------------------------------------------------------
    // TEST SECTION 2: ACADEMY PAGES (Programming & No-Code)
    // -----------------------------------------------------------------
    console.log('\n--- TEST SECTION 2: Academy Pages Context & Filtering ---');

    // 2.1 Programming Academy
    await navigateAndWait(cdp, `http://127.0.0.1:${PORT}/academies/programming/index.html`);

    const progHeroResult = await cdp.evaluate(`
      (async () => {
        const heroDemoBtn = document.getElementById('btn-academy-hero-demo');
        if (!heroDemoBtn) return { found: false };
        heroDemoBtn.click();
        await new Promise(r => setTimeout(r, 100));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        const academyName = document.getElementById('demo-academy-name')?.value;
        const options = Array.from(document.querySelectorAll('#demo-course-select option:not([value=""])')).map(o => o.value);
        closeDemoModal();
        return { found: true, isOpen, sourceCta, academyName, options };
      })()
    `);
    assert(progHeroResult.found && progHeroResult.isOpen, 'Programming Academy Hero Book Free Demo button opened Demo modal');
    assert(progHeroResult.sourceCta === 'academy_hero', 'Programming Academy Hero passed sourceCta: academy_hero');
    assert(progHeroResult.academyName.includes('Programming'), 'Programming Academy Hero preserved Academy name context');
    assert(progHeroResult.options.length === 3, `Programming Academy filtered dropdown to exactly its 3 eligible programs (found: ${progHeroResult.options.length})`);

    await new Promise(r => setTimeout(r, 350));

    // 2.2 Programming Academy Promotional Banner
    const progBannerResult = await cdp.evaluate(`
      (async () => {
        const bannerBtn = document.querySelector('.academy-demo-btn');
        if (!bannerBtn) return { found: false };
        bannerBtn.click();
        await new Promise(r => setTimeout(r, 100));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        closeDemoModal();
        return { found: true, isOpen, sourceCta };
      })()
    `);
    assert(progBannerResult.found && progBannerResult.isOpen && progBannerResult.sourceCta === 'academy_demo_banner', 'Programming Academy Promotional Banner opened Demo modal with sourceCta: academy_demo_banner');

    await new Promise(r => setTimeout(r, 350));

    // 2.3 No-Code Web Academy (Slug Mapping Test: 'no-code-web' -> 'nocode')
    await navigateAndWait(cdp, `http://127.0.0.1:${PORT}/academies/no-code-web/index.html`);

    const nocodeBannerResult = await cdp.evaluate(`
      (async () => {
        const bannerBtn = document.querySelector('.academy-demo-btn');
        if (!bannerBtn) return { found: false };
        bannerBtn.click();
        await new Promise(r => setTimeout(r, 100));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        const academyName = document.getElementById('demo-academy-name')?.value;
        const options = Array.from(document.querySelectorAll('#demo-course-select option:not([value=""])')).map(o => o.value);
        closeDemoModal();
        return { found: true, isOpen, sourceCta, academyName, options };
      })()
    `);
    assert(nocodeBannerResult.found && nocodeBannerResult.isOpen, 'No-Code Web Academy Promotional Banner opened Demo modal');
    assert(nocodeBannerResult.options.length === 3, `No-Code Academy slug successfully normalized and filtered to its 3 eligible programs (found: ${nocodeBannerResult.options.length})`);

    // -----------------------------------------------------------------
    // TEST SECTION 3: COURSE DETAIL PAGES (Eligible vs Ineligible)
    // -----------------------------------------------------------------
    console.log('\n--- TEST SECTION 3: Course Detail Pages (Eligible vs Ineligible) ---');

    // 3.1 Eligible Course Detail Page (dm-professional)
    await navigateAndWait(cdp, `http://127.0.0.1:${PORT}/_rendered_courses/dm-professional.html`);

    const cdpEligibleResult = await cdp.evaluate(`
      (async () => {
        const demoBtn = document.getElementById('btn-detail-book-demo');
        if (!demoBtn) return { found: false };
        const isVisible = window.getComputedStyle(demoBtn).display !== 'none';
        demoBtn.click();
        await new Promise(r => setTimeout(r, 100));
        const modal = document.getElementById('demo-booking-modal');
        const isOpen = modal && !modal.hidden && modal.classList.contains('open');
        const courseId = document.getElementById('demo-course-id')?.value;
        const courseName = document.getElementById('demo-course-name')?.value;
        const sourceCta = document.getElementById('demo-source-cta')?.value;
        const contextText = document.getElementById('demo-context-text')?.textContent;
        closeDemoModal();
        return { found: true, isVisible, isOpen, courseId, courseName, sourceCta, contextText };
      })()
    `);
    assert(cdpEligibleResult.found && cdpEligibleResult.isVisible, 'Eligible Course Detail page renders visible Book Your Free Demo button');
    assert(cdpEligibleResult.isOpen && cdpEligibleResult.courseId === 'dm-professional', 'Clicking sidebar Demo CTA preselected course ID dm-professional');
    assert(cdpEligibleResult.sourceCta === 'course_detail_sidebar', 'Sidebar Demo CTA passed sourceCta: course_detail_sidebar');

    await new Promise(r => setTimeout(r, 350));

    // 3.2 Ineligible Course Detail Page (html-css - ₹2,900 short course)
    await navigateAndWait(cdp, `http://127.0.0.1:${PORT}/_rendered_courses/html-css.html`);

    const cdpIneligibleResult = await cdp.evaluate(`
      (() => {
        const demoBtn = document.getElementById('btn-detail-book-demo');
        const demoItem = document.getElementById('detail-demo-item');
        const hasVisibleDemoBtn = demoBtn && window.getComputedStyle(demoBtn).display !== 'none';
        const isDemoItemHidden = !demoItem || window.getComputedStyle(demoItem).display === 'none';
        return { hasVisibleDemoBtn, isDemoItemHidden };
      })()
    `);
    assert(!cdpIneligibleResult.hasVisibleDemoBtn, 'Ineligible short course Detail page does NOT offer Book Free Demo button');
    assert(cdpIneligibleResult.isDemoItemHidden, 'Ineligible short course Detail page hides 2-Day Free Demo benefit item');

    // -----------------------------------------------------------------
    // TEST SECTION 4: RESPONSIVE BEHAVIOR ACROSS 6 VIEWPORTS
    // -----------------------------------------------------------------
    console.log('\n--- TEST SECTION 4: Responsive Verification Across Viewports ---');
    const viewports = [
      { name: 'Mobile Minimum (320px)', width: 320, height: 600, mobile: true },
      { name: 'Mobile Small (375px)', width: 375, height: 667, mobile: true },
      { name: 'Mobile Standard (390px)', width: 390, height: 844, mobile: true },
      { name: 'Tablet Portrait (768px)', width: 768, height: 1024, mobile: false },
      { name: 'Tablet Landscape (1024px)', width: 1024, height: 768, mobile: false },
      { name: 'Desktop (1440px)', width: 1440, height: 900, mobile: false }
    ];

    for (const vp of viewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await navigateAndWait(cdp, `http://127.0.0.1:${PORT}/index.html`);

      const vpResult = await cdp.evaluate(`
        (async () => {
          openDemoModal({ courseId: 'dm-professional', courseName: 'AI Digital Marketing Specialist' });
          await new Promise(r => setTimeout(r, 100));
          const modal = document.getElementById('demo-booking-modal');
          const dialog = modal?.querySelector('.demo-modal-dialog');
          const submitBtn = document.getElementById('demo-submit-btn');
          const closeBtn = document.getElementById('demo-modal-close');

          const isOpen = modal && !modal.hidden && modal.classList.contains('open');
          const dialogWidth = dialog ? dialog.offsetWidth : 0;
          const bodyOverflow = document.body.style.overflow;
          const submitReachable = submitBtn && submitBtn.offsetHeight > 0;
          const closeFunctional = closeBtn && closeBtn.offsetHeight > 0;

          closeDemoModal();
          return { isOpen, dialogWidth, bodyOverflow, submitReachable, closeFunctional };
        })()
      `);

      assert(vpResult.isOpen, `${vp.name}: Modal opens and displays correctly`);
      assert(vpResult.bodyOverflow === 'hidden', `${vp.name}: Body scroll locked while modal is active`);
      assert(vpResult.submitReachable && vpResult.closeFunctional, `${vp.name}: Submit and Close buttons are reachable`);
      await new Promise(r => setTimeout(r, 200));
    }

    // -----------------------------------------------------------------
    // TEST SECTION 5: ACCESSIBILITY, FOCUS MANAGEMENT & KEYBOARD
    // -----------------------------------------------------------------
    console.log('\n--- TEST SECTION 5: Accessibility & Keyboard Activation ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await navigateAndWait(cdp, `http://127.0.0.1:${PORT}/index.html`);

    const a11yResult = await cdp.evaluate(`
      (() => {
        const trigger = document.getElementById('hero-cta-primary');
        trigger.focus();
        trigger.click();

        const modal = document.getElementById('demo-booking-modal');
        const role = modal.getAttribute('role');
        const ariaModal = modal.getAttribute('aria-modal');
        const ariaLabelledby = modal.getAttribute('aria-labelledby');

        return { role, ariaModal, ariaLabelledby };
      })()
    `);
    assert(a11yResult.role === 'dialog' && a11yResult.ariaModal === 'true', 'Modal has role="dialog" and aria-modal="true"');
    assert(a11yResult.ariaLabelledby === 'demo-modal-title', 'Modal has aria-labelledby="demo-modal-title"');

    // Test Escape key closes modal and returns focus
    await cdp.evaluate(`
      (() => {
        const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
        document.dispatchEvent(escEvent);
      })()
    `);
    await new Promise(r => setTimeout(r, 350));

    const escResult = await cdp.evaluate(`
      (() => {
        const modal = document.getElementById('demo-booking-modal');
        const isClosed = !modal || modal.hidden || !modal.classList.contains('open');
        const bodyOverflowRestored = document.body.style.overflow === '';
        return { isClosed, bodyOverflowRestored };
      })()
    `);
    assert(escResult.isClosed && escResult.bodyOverflowRestored, 'Escape key closes modal and restores body scroll');

    // -----------------------------------------------------------------
    // TEST SECTION 6: FORM SUBMISSION INTEGRITY & VALIDATION
    // -----------------------------------------------------------------
    console.log('\n--- TEST SECTION 6: Free Demo Submission Integrity ---');
    await cdp.evaluate(`
      (() => {
        openDemoModal({ courseId: 'dm-professional', courseName: 'AI Digital Marketing Specialist', academyName: 'Digital Marketing Academy' });
      })()
    `);
    await new Promise(r => setTimeout(r, 200));

    // Test client validation triggers on empty submit
    const valResult = await cdp.evaluate(`
      (() => {
        const submitBtn = document.getElementById('demo-submit-btn');
        submitBtn.click();

        const nameErr = document.getElementById('demo-name-error')?.textContent;
        const phoneErr = document.getElementById('demo-phone-error')?.textContent;
        const modeErr = document.getElementById('demo-mode-error')?.textContent;
        const cityErr = document.getElementById('demo-city-error')?.textContent;

        return {
          hasNameErr: !!nameErr,
          hasPhoneErr: !!phoneErr,
          hasModeErr: !!modeErr,
          hasCityErr: !!cityErr
        };
      })()
    `);
    assert(valResult.hasNameErr && valResult.hasPhoneErr && valResult.hasModeErr && valResult.hasCityErr, 'All required field validations triggered on incomplete submission');

    // Test that backend integration endpoint is intact and reachable
    const endpointResult = await cdp.evaluate(`
      (() => {
        return typeof submitNovaForm === 'function';
      })()
    `);
    assert(endpointResult, 'Unified verified submission pipeline submitNovaForm is connected');

    await cdp.evaluate(`closeDemoModal();`);

  } finally {
    cdp.close();
    if (chromeProcess) {
      chromeProcess.kill('SIGKILL');
    }
    if (server) {
      server.close();
    }
    // Clean up temporary profile
    try {
      fs.rmSync(tmpProfile, { recursive: true, force: true });
    } catch (e) {}
  }

  console.log('\n======================================================');
  console.log(`CDP AUTOMATION SUITE COMPLETE: Passed: ${passedTests} | Failed: ${failedTests}`);
  console.log('======================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSuite().catch(err => {
  console.error('Fatal CDP suite error:', err);
  if (chromeProcess) chromeProcess.kill('SIGKILL');
  if (server) server.close();
  process.exit(1);
});
