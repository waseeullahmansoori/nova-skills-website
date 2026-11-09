const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 8098; // Unique port for this suite
const CHROME_PORT = 9270; // Unique CDP port
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let serverProcess = null;
let chromeProcess = null;
let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (!condition) {
    failedCount++;
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(message);
  }
  passedCount++;
  console.log(`  ✅ PASS: ${message}`);
}

function startCustomServer() {
  return new Promise((resolve) => {
    const MIME_TYPES = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.woff2': 'font/woff2'
    };

    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath === '/') reqPath = '/index.html';
      let filePath = path.join(ROOT_DIR, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    serverProcess = server.listen(PORT, () => {
      resolve();
    });
  });
}

function launchChrome() {
  return new Promise((resolve, reject) => {
    const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-p0-' + Date.now());
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
    this.eventListeners = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const WebSocket = require('child_process');
      const wsNode = new (require('stream').Duplex)();
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
        const opcode = firstByte & 0x0f;
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

        if (opcode === 1) { // Text frame
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
            } else if (msg.method && this.eventListeners.has(msg.method)) {
              this.eventListeners.get(msg.method)(msg.params);
            }
          } catch (e) {}
        } else if (opcode === 8) { // Close
          this.socket.end();
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

  on(method, handler) {
    this.eventListeners.set(method, handler);
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

async function runStaticInspections() {
  console.log('\n--- 1. STATIC CODE ARCHITECTURE & SCOPING AUDIT ---');

  const componentsSrc = fs.readFileSync(path.join(ROOT_DIR, 'components.js'), 'utf8');
  const componentsMinSrc = fs.readFileSync(path.join(ROOT_DIR, 'js', 'components.min.js'), 'utf8');
  const stylesSrc = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf8');
  const mainCssSrc = fs.readFileSync(path.join(ROOT_DIR, 'css', 'main.css'), 'utf8');
  const stylesMinSrc = fs.readFileSync(path.join(ROOT_DIR, 'css', 'styles.min.css'), 'utf8');

  // Verify formId is defined at the beginning of submitNovaForm
  const submitFnIdx = componentsSrc.indexOf('async function submitNovaForm(');
  assert(submitFnIdx !== -1, 'submitNovaForm exists in components.js');

  const submitFnEnd = componentsSrc.indexOf('window.submitNovaForm = submitNovaForm;', submitFnIdx);
  const submitFnSnippet = componentsSrc.slice(submitFnIdx, submitFnEnd);
  const formIdDeclIdx = submitFnSnippet.indexOf('const formId = form.id || \'\';');
  const payloadIdx = submitFnSnippet.indexOf('const payload = {');
  assert(formIdDeclIdx !== -1, 'formId is declared in submitNovaForm');
  assert(formIdDeclIdx < payloadIdx, 'formId is declared BEFORE payload construction (no TDZ ReferenceError)');

  // Verify minified JS has formId declared before payload
  const minSubmitIdx = componentsMinSrc.indexOf('submitNovaForm');
  assert(minSubmitIdx !== -1, 'submitNovaForm exists in js/components.min.js');
  assert(componentsMinSrc.includes('formId=form.id') || componentsMinSrc.includes('formId = form.id'),
    'js/components.min.js contains top-level formId initialization');

  // Verify lead_type resolution covers free_demo, enrollment_enquiry, free_consultation
  assert(submitFnSnippet.includes("lead_type: data.lead_type || (formId === 'demo-booking-form' ? 'free_demo' : formId === 'course-enrollment-form' ? 'enrollment_enquiry' : 'free_consultation')"),
    'lead_type resolves accurately based on formId fallback');

  // Verify truth-in-response check
  assert(submitFnSnippet.includes('isSuccess = false') &&
         submitFnSnippet.includes('json.success === true') &&
         submitFnSnippet.includes('json.success === false'),
    'Truth-in-response verification: checks explicit json.success and does not blindly assume HTTP 200');

  // Verify CSS phone prefix and input padding rules
  for (const [name, css] of [['styles.css', stylesSrc], ['css/main.css', mainCssSrc], ['css/styles.min.css', stylesMinSrc]]) {
    assert(css.includes('.phone-input-wrap'), `${name} contains .phone-input-wrap`);
    assert(css.includes('.phone-prefix'), `${name} contains .phone-prefix`);
    assert(css.includes('#demo-phone') && css.includes('64px !important'), `${name} enforces padding-left: 64px !important for #demo-phone`);
    assert(css.includes('#enroll-phone') && css.includes('64px !important'), `${name} enforces padding-left: 64px !important for #enroll-phone`);
  }
}

async function runDirectBackendCheck() {
  console.log('\n--- 2. BACKEND INTEGRATION & TRUTH-IN-RESPONSE TEST ---');

  const NS_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzRHK2n1D0WjWw4NxcwtH7FQb7eRsZxVagFnYtiz5quAFec2BLfwgJ26C0OG6FTKcPB/exec';

  const testPayload = {
    name: '[TEST - AUTOMATED QA VERIFICATION] Admissions Recovery Health Check',
    mobile: '9999999999',
    email: 'qa-verification@novaskills.in',
    course: 'Admissions Automation System Health Check',
    city: 'Kanpur',
    message: '[TEST - AUTOMATED QA VERIFICATION - DO NOT CALL] Form Recovery P0 Verification',
    lead_type: 'free_demo',
    learning_mode: 'Live Online',
    course_id: 'qa-system-test',
    academy: 'QA Testing',
    website: '' // honeypot empty
  };

  let response = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await fetch(NS_SCRIPT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(testPayload)
      });
      if (response && response.ok) break;
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  assert(response.ok, `Google Apps Script endpoint returned HTTP 200 OK (status: ${response.status})`);
  const json = await response.json();
  assert(json && json.success === true, `Backend confirmed persisted lead: json.success === true (message: "${json.message}")`);
}

async function runBrowserTests() {
  console.log('\n--- 3. CHROME CDP: PHONE PREFIX LAYOUT & GEOMETRY (9 VIEWPORTS) ---');

  let tmpProfile = null;
  try {
    await startCustomServer();
    tmpProfile = await launchChrome();
    const wsUrl = await getDebuggerUrl();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 1200));

    const viewports = [
      { name: 'Ultra-Narrow Mobile (320px)', width: 320, height: 640 },
      { name: 'Galaxy Fold Folded (337px)', width: 337, height: 720 },
      { name: 'Standard Android (360px)', width: 360, height: 740 },
      { name: 'Compact iPhone (375px)', width: 375, height: 667 },
      { name: 'iPhone 14 (390px)', width: 390, height: 844 },
      { name: 'iPhone Pro Max (430px)', width: 430, height: 932 },
      { name: 'iPad Portrait (768px)', width: 768, height: 1024 },
      { name: 'Laptop (1024px)', width: 1024, height: 768 },
      { name: 'Desktop (1440px)', width: 1440, height: 900 }
    ];

    // Test Free Demo Phone Prefix Layout across all 9 viewports
    for (const vp of viewports) {
      await cdp.setViewport(vp.width, vp.height);
      await cdp.evaluate(`window.openDemoModal && window.openDemoModal({ courseName: 'Full Stack Web Development' })`);
      await new Promise(r => setTimeout(r, 300));

      const phoneMetrics = await cdp.evaluate(`
        (() => {
          const prefix = document.querySelector('#group-demo-phone .phone-prefix');
          const input = document.getElementById('demo-phone');
          if (!prefix || !input) return null;

          const pRect = prefix.getBoundingClientRect();
          const iRect = input.getBoundingClientRect();
          const style = window.getComputedStyle(input);
          const pStyle = window.getComputedStyle(prefix);

          const pCenterY = pRect.top + pRect.height / 2;
          const iCenterY = iRect.top + iRect.height / 2;

          return {
            paddingLeft: parseFloat(style.paddingLeft),
            fontSize: parseFloat(style.fontSize),
            prefixLeftRel: pRect.left - iRect.left,
            prefixWidth: pRect.width,
            prefixRightRel: (pRect.left - iRect.left) + pRect.width,
            verticalDiff: Math.abs(pCenterY - iCenterY),
            inputHeight: iRect.height
          };
        })()
      `);

      assert(phoneMetrics !== null, `[${vp.name}] Demo phone input and prefix elements rendered`);
      assert(phoneMetrics.paddingLeft >= 58, `[${vp.name}] Demo phone input padding-left is >= 58px (actual: ${phoneMetrics.paddingLeft}px)`);
      assert(phoneMetrics.paddingLeft > phoneMetrics.prefixRightRel,
        `[${vp.name}] ZERO OVERLAP: text start (${phoneMetrics.paddingLeft}px) > prefix right edge (${phoneMetrics.prefixRightRel.toFixed(1)}px), gap = ${(phoneMetrics.paddingLeft - phoneMetrics.prefixRightRel).toFixed(1)}px`);
      assert(phoneMetrics.verticalDiff <= 2.5,
        `[${vp.name}] Vertical alignment: prefix is centered within input (diff: ${phoneMetrics.verticalDiff.toFixed(2)}px)`);

      if (vp.width <= 768) {
        assert(phoneMetrics.fontSize >= 16, `[${vp.name}] Mobile font-size >= 16px to prevent iOS auto-zoom (actual: ${phoneMetrics.fontSize}px)`);
      }

      if (vp.width === 1440) {
        await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'p0_form_demo_desktop_1440px.png'));
      } else if (vp.width === 390) {
        await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'p0_form_demo_mobile_390px.png'));
      } else if (vp.width === 337) {
        await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'p0_form_demo_mobile_337px.png'));
      }

      // Close modal
      await cdp.evaluate(`window.closeDemoModal && window.closeDemoModal()`);
      await new Promise(r => setTimeout(r, 200));
    }

    // Test Enrollment Modal Phone Prefix Layout on Mobile
    await cdp.setViewport(390, 844);
    await cdp.evaluate(`window.openEnrollmentModal && window.openEnrollmentModal({ courseName: 'AI Digital Marketing Professional' })`);
    await new Promise(r => setTimeout(r, 300));

    const enrollMetrics = await cdp.evaluate(`
      (() => {
        const prefix = document.querySelector('#group-enroll-phone .phone-prefix');
        const input = document.getElementById('enroll-phone');
        if (!prefix || !input) return null;

        const pRect = prefix.getBoundingClientRect();
        const iRect = input.getBoundingClientRect();
        const style = window.getComputedStyle(input);

        return {
          paddingLeft: parseFloat(style.paddingLeft),
          fontSize: parseFloat(style.fontSize),
          prefixRightRel: (pRect.left - iRect.left) + pRect.width
        };
      })()
    `);

    assert(enrollMetrics !== null, '[390px Mobile] Enroll phone input and prefix rendered');
    assert(enrollMetrics.paddingLeft >= 58, `[390px Mobile] Enroll phone padding-left >= 58px (actual: ${enrollMetrics.paddingLeft}px)`);
    assert(enrollMetrics.paddingLeft > enrollMetrics.prefixRightRel, `[390px Mobile] Enroll phone ZERO OVERLAP with prefix`);
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'p0_form_enroll_mobile_390px.png'));
    await cdp.evaluate(`window.closeEnrollmentModal && window.closeEnrollmentModal()`);
    await new Promise(r => setTimeout(r, 200));

    console.log('\n--- 4. FULL SUBMISSION LIFECYCLE & INTEGRATION AUDIT ---');

    // TEST FORM A: Free Consultation Popup Submission
    await cdp.setViewport(1440, 900);
    await cdp.evaluate(`
      window.submittedPayloads = [];
      window.originalFetch = window.fetch;
      window.fetch = async function(url, opts) {
        const u = typeof url === 'string' ? url : (url && url.url) || '';
        if (u.includes('api.ipify.org') || u.includes('ipapi.co')) {
          return { ok: true, status: 200, json: async () => ({ ip: '127.0.0.1' }) };
        }
        if (u.includes('script.google.com')) {
          const body = JSON.parse(opts.body);
          window.submittedPayloads.push(body);
          return {
            ok: true,
            status: 200,
            json: async () => ({ success: true, message: 'Lead saved successfully.' })
          };
        }
        return window.originalFetch(url, opts);
      };
    `);

    // Open Consultation popup
    await cdp.evaluate(`window.openConsultationPopup && window.openConsultationPopup()`);
    await new Promise(r => setTimeout(r, 300));
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'p0_form_consultation_desktop_1440px.png'));

    // Fill Consultation popup form
    await cdp.evaluate(`
      document.getElementById('popup-name').value = 'Rahul Verma';
      document.getElementById('popup-phone').value = '9876543210';
      document.getElementById('popup-email').value = 'rahul@example.com';
      document.getElementById('popup-interest').value = 'programming';
    `);

    // Submit consultation
    await cdp.evaluate(`
      document.getElementById('popup-submit').click();
    `);
    await new Promise(r => setTimeout(r, 800));

    const consultationSubmission = await cdp.evaluate(`window.submittedPayloads[0]`);
    assert(consultationSubmission !== undefined, 'Form A (Consultation) successfully dispatched fetch to backend');
    assert(consultationSubmission.name === 'Rahul Verma', 'Form A payload contains correct student name');
    assert(consultationSubmission.mobile === '9876543210', 'Form A payload contains sanitized mobile number');
    assert(consultationSubmission.lead_type === 'free_consultation', 'Form A payload resolved lead_type: "free_consultation"');

    const toastText = await cdp.evaluate(`
      document.querySelector('.ns-toast.ns-toast-success')?.textContent || document.querySelector('.ns-toast')?.textContent || ''
    `);
    assert(toastText.includes('Consultation Booked Successfully'), 'Form A displayed success toast notification without TDZ error');

    // TEST FORM B: Free Demo Modal Submission
    await cdp.evaluate(`window.submittedPayloads = []`);
    await cdp.evaluate(`window.openDemoModal && window.openDemoModal({
      courseId: 'archviz-mastery',
      courseName: 'Architectural Visualisation Master',
      academyId: '3d',
      academyName: '3D Architecture & Engineering Academy'
    })`);
    await new Promise(r => setTimeout(r, 300));

    await cdp.evaluate(`
      document.getElementById('demo-name').value = 'Ananya Sharma';
      document.getElementById('demo-phone').value = '9123456789';
      const cSelect = document.getElementById('demo-course-select');
      if (cSelect && cSelect.options && cSelect.options.length > 1) {
        cSelect.options[1].selected = true;
        cSelect.value = cSelect.options[1].value;
        cSelect.dispatchEvent(new Event('change'));
      }
      document.getElementById('demo-mode-select').value = 'Live Online';
      document.getElementById('demo-city').value = 'Lucknow';
      document.getElementById('demo-email').value = 'ananya@example.com';
    `);

    await cdp.evaluate(`
      document.getElementById('demo-submit-btn').click();
    `);
    await new Promise(r => setTimeout(r, 800));

    const demoDebug = await cdp.evaluate(`(() => {
      return {
        nameErr: document.getElementById('demo-name-error')?.textContent,
        phoneErr: document.getElementById('demo-phone-error')?.textContent,
        courseErr: document.getElementById('demo-course-select-error')?.textContent,
        modeErr: document.getElementById('demo-mode-select-error')?.textContent,
        cityErr: document.getElementById('demo-city-error')?.textContent,
        formErr: document.getElementById('demo-form-error')?.textContent,
        submitting: document.getElementById('demo-booking-form')?.dataset?.submitting,
        courseVal: document.getElementById('demo-course-select')?.value,
        submittedLen: window.submittedPayloads ? window.submittedPayloads.length : -1
      };
    })()`);
        const demoSubmission = await cdp.evaluate(`window.submittedPayloads[0]`);
    assert(demoSubmission !== undefined, 'Form B (Free Demo) successfully dispatched fetch to backend');
    assert(demoSubmission.name === 'Ananya Sharma', 'Form B payload contains student name');
    assert(demoSubmission.mobile === '9123456789', 'Form B payload contains mobile number');
    assert(demoSubmission.lead_type === 'free_demo', 'Form B payload strictly resolved lead_type: "free_demo"');
    assert(demoSubmission.learning_mode === 'Live Online', 'Form B payload contains learning_mode');

    const demoModalState = await cdp.evaluate(`document.getElementById('demo-booking-modal').dataset.state`);
    assert(demoModalState === 'success', 'Form B transitioned to "success" state upon backend confirmation');

    const demoStorageLead = await cdp.evaluate(`
      JSON.parse(localStorage.getItem('novaskills_demo_requests') || '[]')[0]
    `);
    assert(demoStorageLead && demoStorageLead.lead_type === 'free_demo', 'Form B stored demo request in CRM queue with lead_type: free_demo');

    // Close demo modal
    await cdp.evaluate(`window.closeDemoModal()`);
    await new Promise(r => setTimeout(r, 200));

    // TEST FORM C: Course Enrollment Modal Submission
    await cdp.evaluate(`window.submittedPayloads = []`);
    await cdp.evaluate(`window.openEnrollmentModal && window.openEnrollmentModal({ courseName: 'AI Solutions Engineering & Agentic AI Mastery', academy: 'AI & Machine Learning' })`);
    await new Promise(r => setTimeout(r, 300));

    await cdp.evaluate(`
      document.getElementById('enroll-name').value = 'Vikram Singh';
      document.getElementById('enroll-phone').value = '9988776655';
      document.getElementById('enroll-city').value = 'Kanpur';
      document.getElementById('enroll-email').value = 'vikram@example.com';
    `);

    await cdp.evaluate(`
      document.getElementById('enroll-submit-btn').click();
    `);
    await new Promise(r => setTimeout(r, 800));

    const enrollSubmission = await cdp.evaluate(`window.submittedPayloads[0]`);
    assert(enrollSubmission !== undefined, 'Form C (Course Enrollment) successfully dispatched fetch to backend');
    assert(enrollSubmission.name === 'Vikram Singh', 'Form C payload contains student name');
    assert(enrollSubmission.mobile === '9988776655', 'Form C payload contains mobile number');
    assert(enrollSubmission.lead_type === 'enrollment_enquiry', 'Form C payload strictly resolved lead_type: "enrollment_enquiry"');

    const enrollModalState = await cdp.evaluate(`document.getElementById('course-enrollment-modal').dataset.state`);
    assert(enrollModalState === 'success', 'Form C transitioned to "success" state upon backend confirmation');

    const enrollStorageLead = await cdp.evaluate(`
      JSON.parse(localStorage.getItem('novaskills_enquiries') || '[]')[0]
    `);
    assert(enrollStorageLead && enrollStorageLead.name === 'Vikram Singh', 'Form C stored enquiry in CRM queue');

    // Close enroll modal
    await cdp.evaluate(`window.closeEnrollmentModal()`);
    await new Promise(r => setTimeout(r, 200));

    console.log('\n--- 5. DOUBLE-CLICK PREVENT & ERROR PRESERVATION TESTS ---');

    // Test Double-Click Prevention on Demo Form
    await cdp.evaluate(`window.submittedPayloads = []`);
    await cdp.evaluate(`window.openDemoModal({ courseName: 'Full Stack Web Development' })`);
    await new Promise(r => setTimeout(r, 300));

    await cdp.evaluate(`
      document.getElementById('demo-name').value = 'Double Click Test';
      document.getElementById('demo-phone').value = '9111122222';
      document.getElementById('demo-mode-select').value = 'Live Online';
      document.getElementById('demo-city').value = 'Delhi';
    `);

    // Simulate two rapid clicks
    await cdp.evaluate(`
      const f = document.getElementById('demo-booking-form');
      f.dispatchEvent(new Event('submit', { cancelable: true }));
      f.dispatchEvent(new Event('submit', { cancelable: true }));
    `);
    await new Promise(r => setTimeout(r, 500));

    const submittedCount = await cdp.evaluate(`window.submittedPayloads.length`);
    assert(submittedCount === 1, `Double click prevention: exactly 1 network call dispatched (actual: ${submittedCount})`);

    // Clean Reopen State
    await cdp.evaluate(`window.closeDemoModal()`);
    await new Promise(r => setTimeout(r, 200));
    await cdp.evaluate(`window.openDemoModal({ courseName: 'Graphic Design Professional' })`);
    await new Promise(r => setTimeout(r, 200));

    const reopenedDemoState = await cdp.evaluate(`
      (() => {
        const modal = document.getElementById('demo-booking-modal');
        const formWrap = document.getElementById('demo-form-container');
        const successWrap = document.getElementById('demo-success-container');
        const submitBtn = document.getElementById('demo-submit-btn');
        return {
          state: modal.dataset.state,
          formHidden: formWrap.hasAttribute('hidden'),
          successHidden: successWrap.hasAttribute('hidden'),
          btnDisabled: submitBtn.disabled
        };
      })()
    `);

    assert(reopenedDemoState.state === 'idle', 'Reopened demo modal resets state to "idle"');
    assert(!reopenedDemoState.formHidden, 'Form container is visible in reopened modal');
    assert(reopenedDemoState.successHidden, 'Success container is strictly hidden in reopened modal');
    assert(!reopenedDemoState.btnDisabled, 'Submit button is re-enabled');

  } finally {
    if (chromeProcess) {
      chromeProcess.kill();
    }
    if (serverProcess) {
      serverProcess.close();
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
  console.log('🧪 NOVA SKILLS — P0 CRITICAL FORM RECOVERY AUTOMATED TEST SUITE');
  console.log('================================================================');

  try {
    await runStaticInspections();
    await runDirectBackendCheck();
    await runBrowserTests();

    console.log('\n================================================================');
    console.log(`TOTAL TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
    console.log('================================================================');
    console.log('🎉 ALL P0 FORM RECOVERY TESTS PASSED (0 FAILURES)!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED:', err.message);
    console.log(`PASSED: ${passedCount} | FAILED: ${failedCount + 1}`);
    process.exit(1);
  }
}

main();
