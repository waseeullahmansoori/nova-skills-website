require("dns").setDefaultResultOrder("ipv4first");
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_PORT = 9272;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let chromeProcess = null;

function assert(cond, msg) {
  if (!cond) {
    console.error(`  ❌ LIVE FAIL: ${msg}`);
    throw new Error(msg);
  }
  console.log(`  ✅ LIVE PASS: ${msg}`);
}

function launchChrome() {
  return new Promise((resolve, reject) => {
    const tmpProfile = path.join(require('os').tmpdir(), 'tmp-chrome-live-' + Date.now());
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
            reject(new Error('No target page available'));
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
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const httpReq = http.request(this.wsUrl.replace('ws://', 'http://'), {
        headers: {
          'Connection': 'Upgrade',
          'Upgrade': 'websocket',
          'Sec-WebSocket-Version': '13',
          'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ=='
        }
      });

      httpReq.on('upgrade', (res, socket, head) => {
        this.socket = socket;
        this.initSocket();
        resolve();
      });

      httpReq.on('error', reject);
      httpReq.end();
    });
  }

  initSocket() {
    let buffer = Buffer.alloc(0);
    this.socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 2) {
        const firstByte = buffer[0];
        const secondByte = buffer[1];
        let payloadLen = secondByte & 0x7f;
        let offset = 2;

        if (payloadLen === 126) {
          if (buffer.length < 4) break;
          payloadLen = buffer.readUInt16BE(2);
          offset = 4;
        } else if (payloadLen === 127) {
          if (buffer.length < 10) break;
          payloadLen = Number(buffer.readBigUInt64BE(2));
          offset = 10;
        }

        if (buffer.length < offset + payloadLen) break;

        const payload = buffer.slice(offset, offset + payloadLen);
        buffer = buffer.slice(offset + payloadLen);

        if ((firstByte & 0x0f) === 1) { // Text frame
          try {
            const msg = JSON.parse(payload.toString('utf8'));
            if (msg.id && this.callbacks.has(msg.id)) {
              const cb = this.callbacks.get(msg.id);
              this.callbacks.delete(msg.id);
              if (msg.error) {
                cb.reject(new Error(msg.error.message || JSON.stringify(msg.error)));
              } else {
                cb.resolve(msg.result);
              }
            }
          } catch (e) {}
        }
      }
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { resolve, reject });
      const str = JSON.stringify({ id: msgId, method, params });
      const payloadBuf = Buffer.from(str, 'utf8');
      const len = payloadBuf.length;

      let header;
      if (len < 126) {
        header = Buffer.alloc(6);
        header[0] = 0x81;
        header[1] = 0x80 | len;
        header.writeUInt32BE(0x12345678, 2);
      } else if (len < 65536) {
        header = Buffer.alloc(8);
        header[0] = 0x81;
        header[1] = 0x80 | 126;
        header.writeUInt16BE(len, 2);
        header.writeUInt32BE(0x12345678, 4);
      } else {
        header = Buffer.alloc(14);
        header[0] = 0x81;
        header[1] = 0x80 | 127;
        header.writeBigUInt64BE(BigInt(len), 2);
        header.writeUInt32BE(0x12345678, 10);
      }

      const mask = header.slice(header.length - 4);
      const masked = Buffer.alloc(len);
      for (let i = 0; i < len; i++) {
        masked[i] = payloadBuf[i] ^ mask[i % 4];
      }

      this.socket.write(Buffer.concat([header, masked]));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(`CDP Eval Error: ${res.exceptionDetails.text || JSON.stringify(res.exceptionDetails)}`);
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
    await this.send('Emulation.setVisibleSize', { width, height });
  }

  async captureScreenshot(filepath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filepath, buf);
    console.log(`  📸 Saved screenshot: ${path.basename(filepath)}`);
  }
}

async function verifyLiveAssets() {
  console.log('\n--- 1. VERIFY LIVE ASSETS ON CLOUDFLARE PAGES (https://novaskills.in) ---');

  const fetchLive = async (url) => {
    const res = await fetch(url + '?_t=' + Date.now(), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    return res.text();
  };

  // Verify components.js
  let compJs = '';
  for (let i = 0; i < 15; i++) {
    compJs = await fetchLive('https://novaskills.in/components.js');
    if (compJs.includes('isManagedModalForm')) {
      break;
    }
    console.log(`  Waiting for Cloudflare cache to invalidate components.js (attempt ${i + 1}/15)...`);
    await new Promise(r => setTimeout(r, 4000));
  }

  assert(compJs.includes('isManagedModalForm'), 'Live components.js contains isManagedModalForm fix');
  assert(compJs.includes('const formId = form.id'), 'Live components.js contains top-level formId initialization');
  assert(compJs.includes('json.success === true'), 'Live components.js contains truth-in-response check');

  // Verify js/components.min.js
  const compMinJs = await fetchLive('https://novaskills.in/js/components.min.js');
  assert(compMinJs.includes('isManagedModalForm'), 'Live js/components.min.js contains isManagedModalForm fix');

  // Verify css/styles.min.css
  const stylesMinCss = await fetchLive('https://novaskills.in/css/styles.min.css');
  assert(stylesMinCss.includes('64px !important'), 'Live css/styles.min.css contains padding-left: 64px !important');
  assert(stylesMinCss.includes('.phone-prefix'), 'Live css/styles.min.css contains .phone-prefix');
}

async function verifyLiveBrowserInteractions() {
  console.log('\n--- 2. LIVE PRODUCTION BROWSER VERIFICATION (Chrome CDP) ---');

  let tmpProfile = null;
  try {
    tmpProfile = await launchChrome();
    const wsUrl = await getDebuggerUrl();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');

    await cdp.send('Page.navigate', { url: 'https://novaskills.in/' });
    await new Promise(r => setTimeout(r, 3000));

    // A. Verify Free Demo Phone Layout on 390px Mobile
    await cdp.setViewport(390, 844);
    await cdp.evaluate(`window.openDemoModal && window.openDemoModal()`);
    await new Promise(r => setTimeout(r, 600));

    const mobileMetrics = await cdp.evaluate(`
      (() => {
        const prefix = document.querySelector('#group-demo-phone .phone-prefix');
        const input = document.getElementById('demo-phone');
        if (!prefix || !input) return null;

        const pRect = prefix.getBoundingClientRect();
        const iRect = input.getBoundingClientRect();
        const style = window.getComputedStyle(input);

        return {
          paddingLeft: parseFloat(style.paddingLeft),
          fontSize: parseFloat(style.fontSize),
          prefixRightRel: (pRect.left - iRect.left) + pRect.width,
          gap: parseFloat(style.paddingLeft) - ((pRect.left - iRect.left) + pRect.width)
        };
      })()
    `);

    assert(mobileMetrics !== null, '[Live 390px Mobile] Free demo phone input and prefix rendered');
    assert(mobileMetrics.paddingLeft >= 58, `[Live 390px Mobile] Padding-left >= 58px (actual: ${mobileMetrics.paddingLeft}px)`);
    assert(mobileMetrics.gap > 0, `[Live 390px Mobile] ZERO OVERLAP with +91 prefix (gap: ${mobileMetrics.gap.toFixed(1)}px)`);
    assert(mobileMetrics.fontSize >= 16, `[Live 390px Mobile] Font-size >= 16px (actual: ${mobileMetrics.fontSize}px)`);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_production_demo_form_mobile_390px.png'));

    // B. Verify Galaxy Fold 337px Folded
    await cdp.setViewport(337, 720);
    await new Promise(r => setTimeout(r, 400));
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_production_demo_form_mobile_337px.png'));

    // C. Verify Desktop 1440px
    await cdp.setViewport(1440, 900);
    await new Promise(r => setTimeout(r, 400));
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_production_demo_form_desktop_1440px.png'));

    // D. LIVE FREE DEMO FORM SUBMISSION (Tagged Verification Lead)
    console.log('\n--- 3. LIVE FORM SUBMISSION VERIFICATIONS ---');
    await cdp.evaluate(`
      document.getElementById('demo-name').value = '[QA LIVE VERIFICATION] System Health Check';
      document.getElementById('demo-phone').value = '9999999999';
      const cSelect = document.getElementById('demo-course-select');
      cSelect.selectedIndex = 1;
      cSelect.dispatchEvent(new Event('change'));
      document.getElementById('demo-mode-select').value = 'Live Online';
      document.getElementById('demo-city').value = 'Kanpur';
      document.getElementById('demo-email').value = 'qa-verify@novaskills.in';
      document.getElementById('demo-message').value = '[QA AUTOMATED VERIFICATION LEAD - DO NOT CALL] Live P0 Recovery Check';
    `);

    await cdp.evaluate(`document.getElementById('demo-submit-btn').click()`);
    console.log('  Submitted live Free Demo form, awaiting backend confirmation...');
    await new Promise(r => setTimeout(r, 3500));

    const liveDemoState = await cdp.evaluate(`document.getElementById('demo-booking-modal').getAttribute('data-state')`);
    assert(liveDemoState === 'success', `[Live Production] Free Demo Form successfully submitted & transitioned to state: ${liveDemoState}`);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_production_demo_success_desktop_1440px.png'));

    // Close demo modal
    await cdp.evaluate(`window.closeDemoModal()`);
    await new Promise(r => setTimeout(r, 500));

    // E. LIVE CONSULTATION FORM VERIFICATION
    await cdp.evaluate(`window.openConsultationPopup && window.openConsultationPopup()`);
    await new Promise(r => setTimeout(r, 500));
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_production_consultation_form_desktop_1440px.png'));

    await cdp.evaluate(`
      document.getElementById('popup-name').value = '[QA LIVE VERIFICATION] Consultation Check';
      document.getElementById('popup-phone').value = '9999999999';
      document.getElementById('popup-email').value = 'qa-verify@novaskills.in';
      document.getElementById('popup-interest').value = 'programming';
    `);

    await cdp.evaluate(`document.getElementById('popup-submit').click()`);
    console.log('  Submitted live Consultation form, awaiting confirmation...');
    await new Promise(r => setTimeout(r, 3500));

    const liveToast = await cdp.evaluate(`
      document.querySelector('.ns-toast.ns-toast-success')?.textContent || document.querySelector('.ns-toast')?.textContent || ''
    `);
    assert(liveToast.includes('Consultation Booked Successfully'), `[Live Production] Consultation toast received: "${liveToast.replace(/\\s+/g, ' ').trim()}"`);

    // F. LIVE COURSE ENROLLMENT MODAL VERIFICATION
    await cdp.setViewport(390, 844);
    await cdp.evaluate(`window.openEnrollmentModal && window.openEnrollmentModal({ courseName: 'Full Stack Web Development', academy: 'Programming & Web Dev' })`);
    await new Promise(r => setTimeout(r, 600));
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'live_production_enrollment_form_mobile_390px.png'));

    await cdp.evaluate(`
      document.getElementById('enroll-name').value = '[QA LIVE VERIFICATION] Enrollment Check';
      document.getElementById('enroll-phone').value = '9999999999';
      document.getElementById('enroll-city').value = 'Kanpur';
      document.getElementById('enroll-email').value = 'qa-verify@novaskills.in';
      document.getElementById('enroll-message').value = '[QA AUTOMATED VERIFICATION LEAD - DO NOT CALL] Live P0 Recovery Check';
    `);

    await cdp.evaluate(`document.getElementById('enroll-submit-btn').click()`);
    console.log('  Submitted live Enrollment form, awaiting backend confirmation...');
    await new Promise(r => setTimeout(r, 3500));

    const liveEnrollState = await cdp.evaluate(`document.getElementById('course-enrollment-modal').getAttribute('data-state')`);
    assert(liveEnrollState === 'success', `[Live Production] Enrollment Form successfully submitted & transitioned to state: ${liveEnrollState}`);

  } finally {
    if (chromeProcess) {
      chromeProcess.kill();
    }
    if (tmpProfile && fs.existsSync(tmpProfile)) {
      try {
        fs.rmSync(tmpProfile, { recursive: true, force: true });
      } catch (e) {}
    }
  }
}

async function main() {
  console.log('================================================================');
  console.log('🚀 NOVA SKILLS — LIVE PRODUCTION DEPLOYMENT & VERIFICATION');
  console.log('================================================================');

  try {
    await verifyLiveAssets();
    await verifyLiveBrowserInteractions();
    console.log('\n================================================================');
    console.log('🎉 ALL LIVE PRODUCTION VERIFICATIONS PASSED WITH 100% SUCCESS!');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ LIVE PRODUCTION VERIFICATION FAILED:', err.message);
    process.exit(1);
  }
}

main();
