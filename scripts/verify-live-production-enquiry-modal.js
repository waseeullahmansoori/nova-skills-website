const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PORT = 9279;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let chromeProcess = null;

function launchChrome() {
  return new Promise((resolve, reject) => {
    const tmpProfile = path.join(__dirname, '..', 'tmp-chrome-live-test-' + Date.now());
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
  console.log('=== VERIFYING LIVE PRODUCTION ENQUIRY MODAL (https://novaskills.in) ===\n');

  let tmpProfile = null;
  try {
    tmpProfile = await launchChrome();
    const wsUrl = await getDebuggerUrl();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Runtime.enable');

    // 1. Mobile verification (iPhone 14 @ 390px)
    await cdp.setViewport(390, 844);

    const liveUrl = 'https://novaskills.in/course-detail.html?id=archviz-mastery';
    console.log(`Navigating to ${liveUrl}...`);
    await cdp.send('Page.navigate', { url: liveUrl });

    // Wait for page and scripts to load
    await new Promise(r => setTimeout(r, 3500));

    // Verify whether production has deployed the new version
    const hasStateManager = await cdp.evaluate(`typeof window.setEnrollModalState === 'function'`);
    console.log(`Production has setEnrollModalState: ${hasStateManager}`);

    // Open enrollment modal
    await cdp.evaluate(`
      window.openEnrollmentModal({
        courseName: 'Architectural Visualisation Master',
        academyName: '3D Architecture & Engineering Academy',
        duration: '6 Months',
        fee: '₹44,900'
      });
    `);
    await new Promise(r => setTimeout(r, 500));

    // Measure idle state on mobile
    const liveMobileIdle = await cdp.evaluate(`(() => {
      const modal = document.getElementById('course-enrollment-modal');
      const formContainer = document.getElementById('enroll-form-container');
      const successContainer = document.getElementById('enroll-success-container');
      const submitBtn = document.getElementById('enroll-submit-btn');
      const modalContainer = modal ? modal.querySelector('.enroll-modal-container') : null;

      const successStyles = successContainer ? window.getComputedStyle(successContainer) : {};
      const formStyles = formContainer ? window.getComputedStyle(formContainer) : {};

      return {
        isOpen: modal ? modal.classList.contains('open') : false,
        dataState: modal ? modal.getAttribute('data-state') : null,
        formDisplay: formStyles.display,
        successDisplay: successStyles.display,
        successVisibility: successStyles.visibility,
        successHeight: successContainer ? successContainer.offsetHeight : null,
        hasHiddenAttr: successContainer ? successContainer.hasAttribute('hidden') : null,
        containerScrollHeight: modalContainer ? modalContainer.scrollHeight : null
      };
    })()`);

    console.log('Live Mobile Idle State:', JSON.stringify(liveMobileIdle, null, 2));

    // Scroll to bottom
    await cdp.evaluate(`(() => {
      const modalContainer = document.querySelector('.enroll-modal-container');
      if (modalContainer) modalContainer.scrollTop = modalContainer.scrollHeight;
    })()`);
    await new Promise(r => setTimeout(r, 400));

    const liveMobileScrolled = await cdp.evaluate(`(() => {
      const successContainer = document.getElementById('enroll-success-container');
      const styles = window.getComputedStyle(successContainer);
      const rect = successContainer.getBoundingClientRect();
      return {
        display: styles.display,
        visibility: styles.visibility,
        height: successContainer.offsetHeight,
        rectHeight: rect.height
      };
    })()`);

    console.log('Live Mobile Scrolled State:', JSON.stringify(liveMobileScrolled, null, 2));

    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_enquiry_modal_mobile_scrolled_390px.png'));

    // 2. Desktop verification (1440px)
    await cdp.setViewport(1440, 900);
    await new Promise(r => setTimeout(r, 300));
    await cdp.evaluate(`
      window.openEnrollmentModal({
        courseName: 'Architectural Visualisation Master',
        academyName: '3D Architecture & Engineering Academy',
        duration: '6 Months',
        fee: '₹44,900'
      });
    `);
    await new Promise(r => setTimeout(r, 400));

    const liveDesktopIdle = await cdp.evaluate(`(() => {
      const successContainer = document.getElementById('enroll-success-container');
      const styles = window.getComputedStyle(successContainer);
      return {
        display: styles.display,
        visibility: styles.visibility,
        height: successContainer.offsetHeight
      };
    })()`);

    console.log('Live Desktop Idle State:', JSON.stringify(liveDesktopIdle, null, 2));

    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_enquiry_modal_desktop_idle_1440px.png'));

    console.log('\n✅ Live production verification completed successfully!');
  } finally {
    if (chromeProcess) chromeProcess.kill();
    if (tmpProfile) {
      try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
    }
  }
}

verifyLive().catch(err => {
  console.error('Error during live verification:', err);
  if (chromeProcess) chromeProcess.kill();
  process.exit(1);
});
