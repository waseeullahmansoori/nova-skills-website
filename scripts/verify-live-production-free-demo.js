const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_PORT = 9270;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let chromeProcess = null;

function launchChrome() {
  return new Promise((resolve, reject) => {
    const tmpProfile = path.join(__dirname, '..', 'tmp-chrome-live-demo-' + Date.now());
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

function getDebuggerUrl() {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${CHROME_PORT}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const list = JSON.parse(data);
          const page = list.find(t => t.type === 'page');
          if (page && page.webSocketDebuggerUrl) {
            resolve(page.webSocketDebuggerUrl);
          } else if (list.length > 0 && list[0].webSocketDebuggerUrl) {
            resolve(list[0].webSocketDebuggerUrl);
          } else {
            reject(new Error('No valid WebSocket debug target found'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
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
    if (res && res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || 'Evaluation error');
    }
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

  async captureScreenshot(outPath) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log(`  📸 Saved screenshot: ${path.basename(outPath)}`);
  }
}

async function verifyLive() {
  console.log('=== VERIFYING LIVE PRODUCTION: https://novaskills.in ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  let tmpProfile = null;
  try {
    tmpProfile = await launchChrome();
    const wsUrl = await getDebuggerUrl();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Runtime.enable');

    // 1. Check Homepage Live
    console.log('1. Checking Homepage Live (https://novaskills.in)...');
    await cdp.setViewport(1440, 900);
    await cdp.send('Page.navigate', { url: 'https://novaskills.in?nocache=' + Date.now() });
    await new Promise((r) => setTimeout(r, 3500));

    const hpLiveAudit = await cdp.evaluate(`(() => {
      const script = document.querySelector('script[src*="components.min.js"]');
      const usp01 = document.querySelector('.hero-usp-col-1');
      const ctaBtn = document.getElementById('hero-cta-primary');
      return {
        scriptSrc: script ? script.getAttribute('src') : '',
        usp01Onclick: usp01 ? usp01.getAttribute('onclick') : '',
        ctaOnclick: ctaBtn ? ctaBtn.getAttribute('onclick') : ''
      };
    })()`);

    console.log('  Live script query:', hpLiveAudit.scriptSrc);
    assert(hpLiveAudit.usp01Onclick.includes('openDemoModal'), 'Live Hero USP 01 onclick wires to openDemoModal');
    assert(hpLiveAudit.ctaOnclick.includes('openDemoModal'), 'Live Hero CTA button wires to openDemoModal');

    // Open Free Demo Modal on Live Homepage
    await cdp.evaluate(`window.openDemoModal();`);
    await new Promise((r) => setTimeout(r, 600));

    const liveDemoAudit = await cdp.evaluate(`(() => {
      const modal = document.getElementById('demo-booking-modal');
      const formContainer = document.getElementById('demo-form-container');
      const successContainer = document.getElementById('demo-success-container');
      const nameInp = document.getElementById('demo-name');
      const phoneInp = document.getElementById('demo-phone');
      const courseSelect = document.getElementById('demo-course-select');
      const modeSelect = document.getElementById('demo-mode-select');
      const cityInp = document.getElementById('demo-city');
      const emailInp = document.getElementById('demo-email');
      const slotSelect = document.getElementById('demo-slot-select');
      const msgInp = document.getElementById('demo-message');
      const submitBtn = document.getElementById('demo-submit-btn');

      return {
        modalExists: !!modal,
        isOpen: modal && !modal.hidden && modal.classList.contains('open'),
        state: modal ? modal.getAttribute('data-state') : '',
        formVisible: formContainer && !formContainer.hasAttribute('hidden') && window.getComputedStyle(formContainer).display !== 'none',
        successHidden: successContainer && (successContainer.hasAttribute('hidden') || window.getComputedStyle(successContainer).display === 'none'),
        hasName: !!nameInp && nameInp.required,
        hasPhone: !!phoneInp && phoneInp.required,
        hasCourse: !!courseSelect && courseSelect.required,
        coursesCount: courseSelect ? courseSelect.querySelectorAll('option').length : 0,
        hasMode: !!modeSelect && modeSelect.required,
        modeOptions: modeSelect ? Array.from(modeSelect.options).map(o => o.value) : [],
        hasCity: !!cityInp && cityInp.required,
        hasEmail: !!emailInp && !emailInp.required,
        hasSlot: !!slotSelect,
        hasMsg: !!msgInp,
        submitText: submitBtn ? submitBtn.textContent.trim() : ''
      };
    })()`);

    assert(liveDemoAudit.modalExists && liveDemoAudit.isOpen, 'Live Demo modal successfully rendered and opened');
    assert(liveDemoAudit.state === 'idle', 'Live Demo modal initial state is "idle"');
    assert(liveDemoAudit.formVisible, 'Form view is visible');
    assert(liveDemoAudit.successHidden, 'Success view is strictly hidden on idle');
    assert(liveDemoAudit.hasName, 'Live modal contains required Name field');
    assert(liveDemoAudit.hasPhone, 'Live modal contains required Phone field');
    assert(liveDemoAudit.hasCourse && liveDemoAudit.coursesCount > 50, `Live modal contains Course select with ${liveDemoAudit.coursesCount} courses`);
    assert(liveDemoAudit.hasMode && liveDemoAudit.modeOptions.includes('Live Online') && liveDemoAudit.modeOptions.includes('Classroom'), 'Live modal contains required Learning Mode (Live Online & Classroom)');
    assert(liveDemoAudit.hasCity, 'Live modal contains required City field');
    assert(liveDemoAudit.hasEmail, 'Live modal contains optional Email field');
    assert(liveDemoAudit.hasSlot, 'Live modal contains optional Day/Time Window select');
    assert(liveDemoAudit.hasMsg, 'Live modal contains optional Message textarea');
    assert(liveDemoAudit.submitText.includes('Request Free Demo'), 'Live modal submit button text is "Request Free Demo →"');

    // Capture Live Desktop Idle Screenshot
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_demo_modal_desktop_idle_1440px.png'));

    // Test Mobile Viewport on Live Site
    console.log('\n2. Checking Mobile Viewport on Live Site (390px)...');
    await cdp.setViewport(390, 844);
    await new Promise((r) => setTimeout(r, 400));

    const mobileMetrics = await cdp.evaluate(`(() => {
      const modal = document.getElementById('demo-booking-modal');
      const dialog = modal.querySelector('.demo-modal-dialog');
      const docScrollWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const inputs = Array.from(modal.querySelectorAll('.form-input'));
      let minFs = 999;
      inputs.forEach(i => {
        const fs = parseFloat(window.getComputedStyle(i).fontSize);
        if (fs < minFs) minFs = fs;
      });
      return {
        docScrollWidth,
        winWidth,
        dialogWidth: dialog.clientWidth,
        dialogScrollWidth: dialog.scrollWidth,
        minFs
      };
    })()`);

    assert(mobileMetrics.docScrollWidth <= mobileMetrics.winWidth, `Live mobile zero horizontal overflow (${mobileMetrics.docScrollWidth}px <= ${mobileMetrics.winWidth}px)`);
    assert(mobileMetrics.dialogScrollWidth <= mobileMetrics.dialogWidth, 'Live dialog zero horizontal overflow');
    assert(mobileMetrics.minFs >= 16, `Live mobile form inputs enforce font-size >= 16px to prevent iOS auto-zoom (actual: ${mobileMetrics.minFs}px)`);

    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_demo_modal_mobile_idle_390px.png'));

    // Scroll dialog down
    await cdp.evaluate(`document.querySelector('.demo-modal-dialog').scrollTop = 300;`);
    await new Promise((r) => setTimeout(r, 200));
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_demo_modal_mobile_scrolled_390px.png'));

    // Check course-detail page on live site
    console.log('\n3. Checking Course Detail Page Live (https://novaskills.in/course-detail.html?id=archviz-mastery)...');
    await cdp.setViewport(1440, 900);
    await cdp.send('Page.navigate', { url: 'https://novaskills.in/course-detail.html?id=archviz-mastery&nocache=' + Date.now() });
    await new Promise((r) => setTimeout(r, 3500));

    // Click secondary demo CTA on sidebar
    await cdp.evaluate(`(() => {
      const demoBtn = document.getElementById('btn-detail-book-demo') || document.querySelector('.btn-book-demo-secondary');
      if (demoBtn) demoBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    const courseDetailLive = await cdp.evaluate(`(() => {
      const modal = document.getElementById('demo-booking-modal');
      const select = document.getElementById('demo-course-select');
      const pill = document.getElementById('demo-selected-context');
      const pillText = document.getElementById('demo-context-text');
      return {
        isOpen: modal && !modal.hidden,
        selectedVal: select ? select.value : '',
        pillVisible: pill && window.getComputedStyle(pill).display !== 'none',
        pillText: pillText ? pillText.textContent : ''
      };
    })()`);

    assert(courseDetailLive.isOpen, 'Free Demo modal opened from Course Detail page sidebar');
    assert(courseDetailLive.selectedVal.includes('Architectural Visualisation'), `Course Detail correctly preselected "${courseDetailLive.selectedVal}"`);
    assert(courseDetailLive.pillVisible && courseDetailLive.pillText.includes('Architectural Visualisation'), 'Context pill reflects course name on live site');

    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_demo_modal_course_context_1440px.png'));

    await cdp.evaluate(`window.closeDemoModal();`);
    await new Promise((r) => setTimeout(r, 300));

  } catch (err) {
    console.error('Live verification error:', err);
    failed++;
  } finally {
    if (chromeProcess) {
      chromeProcess.kill();
    }
  }

  console.log(`\n========================================`);
  console.log(`LIVE VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

verifyLive();
