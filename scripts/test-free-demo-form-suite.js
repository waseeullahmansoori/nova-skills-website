const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8097;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PORT = 9269; // Use unique debug port
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let serverProcess = null;
let chromeProcess = null;

function startServer() {
  return new Promise((resolve) => {
    const serverScript = path.join(ROOT_DIR, 'scripts', 'serve.js');
    serverProcess = spawn('node', [serverScript]);
    setTimeout(resolve, 800);
  });
}

function launchChrome() {
  return new Promise((resolve, reject) => {
    const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-demo-suite-' + Date.now());
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

async function runTests() {
  console.log('=== STARTING DEDICATED 2-DAY FREE DEMO REQUEST FORM TEST SUITE ===\n');

  let tmpProfile = null;
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

  try {
    await startServer();
    tmpProfile = await launchChrome();
    const wsUrl = await getDebuggerUrl();
    const cdp = new CDPClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Runtime.enable');

    const testUrl = `http://127.0.0.1:${PORT}/index.html`;
    await cdp.send('Page.navigate', { url: testUrl });
    await new Promise((r) => setTimeout(r, 1200));

    console.log('--- TEST GROUP 1: Three Distinct Forms Coexistence & Isolation ---');

    // 1. Free Consultation popup
    await cdp.evaluate(`window.openConsultationPopup();`);
    await new Promise((r) => setTimeout(r, 200));
    const consultPopupState = await cdp.evaluate(`(() => {
      const overlay = document.getElementById('popup-overlay');
      const form = document.getElementById('popup-form');
      const demoModal = document.getElementById('demo-booking-modal');
      const enrollModal = document.getElementById('course-enrollment-modal');
      return {
        overlayOpen: overlay ? overlay.classList.contains('active') || window.getComputedStyle(overlay).display !== 'none' : false,
        demoHidden: demoModal ? (demoModal.hidden || window.getComputedStyle(demoModal).display === 'none') : true,
        enrollHidden: enrollModal ? (enrollModal.hidden || window.getComputedStyle(enrollModal).display === 'none') : true
      };
    })()`);
    assert(consultPopupState.overlayOpen, 'Form A (Free Consultation) opens when openConsultationPopup() is called');
    assert(consultPopupState.demoHidden, 'Form B (Free Demo) remains hidden when Consultation popup opens');
    assert(consultPopupState.enrollHidden, 'Form C (Enrollment) remains hidden when Consultation popup opens');

    // Close Consultation popup
    await cdp.evaluate(`window.closeConsultationPopup();`);
    await new Promise((r) => setTimeout(r, 200));

    // 2. Enrollment modal
    await cdp.evaluate(`window.openEnrollmentModal({ courseName: 'Python Mastery', academyName: 'Programming' });`);
    await new Promise((r) => setTimeout(r, 200));
    const enrollModalState = await cdp.evaluate(`(() => {
      const enrollModal = document.getElementById('course-enrollment-modal');
      const demoModal = document.getElementById('demo-booking-modal');
      const consultOverlay = document.getElementById('popup-overlay');
      return {
        enrollOpen: enrollModal ? !enrollModal.hidden : false,
        demoHidden: demoModal ? (demoModal.hidden || window.getComputedStyle(demoModal).display === 'none') : true,
        consultHidden: consultOverlay ? (!consultOverlay.classList.contains('active')) : true
      };
    })()`);
    assert(enrollModalState.enrollOpen, 'Form C (Enrollment Modal) opens when openEnrollmentModal() is called');
    assert(enrollModalState.demoHidden, 'Form B (Free Demo) remains hidden when Enrollment modal opens');
    assert(enrollModalState.consultHidden, 'Form A (Consultation) remains hidden when Enrollment modal opens');

    // Close Enrollment modal
    await cdp.evaluate(`window.closeEnrollmentModal();`);
    await new Promise((r) => setTimeout(r, 300));

    // 3. Free Demo modal
    await cdp.evaluate(`window.openDemoModal();`);
    await new Promise((r) => setTimeout(r, 200));
    const demoModalState = await cdp.evaluate(`(() => {
      const demoModal = document.getElementById('demo-booking-modal');
      const enrollModal = document.getElementById('course-enrollment-modal');
      const consultOverlay = document.getElementById('popup-overlay');
      return {
        demoOpen: demoModal ? (!demoModal.hidden && demoModal.classList.contains('open')) : false,
        enrollHidden: enrollModal ? (enrollModal.hidden || window.getComputedStyle(enrollModal).display === 'none') : true,
        consultHidden: consultOverlay ? (!consultOverlay.classList.contains('active')) : true
      };
    })()`);
    assert(demoModalState.demoOpen, 'Form B (Free Demo Modal) opens when openDemoModal() is called');
    assert(demoModalState.enrollHidden, 'Form C (Enrollment) remains hidden when Free Demo modal opens');
    assert(demoModalState.consultHidden, 'Form A (Consultation) remains hidden when Free Demo modal opens');

    await cdp.evaluate(`window.closeDemoModal();`);
    await new Promise((r) => setTimeout(r, 300));

    console.log('\n--- TEST GROUP 2: Free Demo Form UI Structure & Required Fields ---');
    await cdp.evaluate(`window.openDemoModal();`);
    await new Promise((r) => setTimeout(r, 200));

    const fieldsAudit = await cdp.evaluate(`(() => {
      const modal = document.getElementById('demo-booking-modal');
      const title = document.getElementById('demo-modal-title');
      const badge = modal.querySelector('.demo-modal-badge');
      const subtitle = modal.querySelector('.demo-modal-subtitle');
      
      const name = document.getElementById('demo-name');
      const phone = document.getElementById('demo-phone');
      const courseSelect = document.getElementById('demo-course-select');
      const modeSelect = document.getElementById('demo-mode-select');
      const city = document.getElementById('demo-city');
      const email = document.getElementById('demo-email');
      const slot = document.getElementById('demo-slot-select');
      const message = document.getElementById('demo-message');
      const submitBtn = document.getElementById('demo-submit-btn');

      return {
        hasTitle: title && title.textContent.includes('Book Your') && title.textContent.includes('2-Day Free Demo'),
        hasBadge: badge && badge.textContent.includes('02 DAYS • 100% FREE'),
        hasSubtitle: subtitle && subtitle.textContent.includes('Experience practical training before choosing your course'),
        hasName: !!name && name.required,
        hasPhone: !!phone && phone.required && phone.maxLength === 10,
        hasCourseSelect: !!courseSelect && courseSelect.required,
        courseOptionsCount: courseSelect ? courseSelect.querySelectorAll('option').length : 0,
        hasModeSelect: !!modeSelect && modeSelect.required,
        modeOptions: modeSelect ? Array.from(modeSelect.options).map(o => o.value) : [],
        hasCity: !!city && city.required,
        hasEmail: !!email && !email.required,
        hasSlot: !!slot,
        hasMessage: !!message,
        hasSubmitBtn: !!submitBtn,
        submitBtnText: submitBtn ? submitBtn.textContent.trim() : ''
      };
    })()`);

    assert(fieldsAudit.hasTitle, 'Modal title contains "Book Your 2-Day Free Demo"');
    assert(fieldsAudit.hasBadge, 'Header badge displays "02 DAYS • 100% FREE"');
    assert(fieldsAudit.hasSubtitle, 'Subtitle displays practical training guidance');
    assert(fieldsAudit.hasName, 'Full Name field is present and required');
    assert(fieldsAudit.hasPhone, 'Mobile Number field is present and required with 10-digit limit');
    assert(fieldsAudit.hasCourseSelect, 'Interested Course dropdown is present and required');
    assert(fieldsAudit.courseOptionsCount > 50, `Course dropdown populated with courses (found ${fieldsAudit.courseOptionsCount})`);
    assert(fieldsAudit.hasModeSelect, 'Preferred Learning Mode dropdown is present and required');
    assert(fieldsAudit.modeOptions.includes('Live Online') && fieldsAudit.modeOptions.includes('Classroom'), 'Learning Mode offers "Live Online" and "Classroom" options');
    assert(fieldsAudit.hasCity, 'City field is present and required');
    assert(fieldsAudit.hasEmail, 'Email Address is present and marked optional');
    assert(fieldsAudit.hasSlot, 'Preferred Day/Time Window dropdown is present');
    assert(fieldsAudit.hasMessage, 'Additional Message textarea is present');
    assert(fieldsAudit.submitBtnText.includes('Request Free Demo'), 'Submit button text is "Request Free Demo →"');

    await cdp.evaluate(`window.closeDemoModal();`);
    await new Promise((r) => setTimeout(r, 300));

    console.log('\n--- TEST GROUP 3: Course & Academy Context Handling ---');

    // Context Test 3A: Launch with Course Context
    await cdp.evaluate(`window.openDemoModal({
      courseId: 'archviz-mastery',
      courseName: 'Architectural Visualisation Master',
      academyId: '3d',
      academyName: '3D Architecture & Engineering Academy'
    });`);
    await new Promise((r) => setTimeout(r, 200));

    const courseCtx = await cdp.evaluate(`(() => {
      const select = document.getElementById('demo-course-select');
      const opt = select.selectedOptions[0];
      const pill = document.getElementById('demo-selected-context');
      const pillText = document.getElementById('demo-context-text');
      const hiddenCourseId = document.getElementById('demo-course-id').value;
      const hiddenCourseName = document.getElementById('demo-course-name').value;
      return {
        selectedVal: opt ? opt.value : '',
        selectedId: opt ? opt.dataset.id : '',
        pillVisible: pill && window.getComputedStyle(pill).display !== 'none',
        pillText: pillText ? pillText.textContent : '',
        hiddenCourseId,
        hiddenCourseName
      };
    })()`);

    assert(courseCtx.selectedVal.includes('Architectural Visualisation Master'), 'Preselected exact course in dropdown');
    assert(courseCtx.pillVisible, 'Context pill is visible at top of modal');
    assert(courseCtx.pillText.includes('Architectural Visualisation Master'), 'Context pill displays course name');
    assert(courseCtx.hiddenCourseId === 'archviz-mastery', 'Hidden course ID correctly synced');

    // Context Test 3B: Dynamic Change of Course Select
    await cdp.evaluate(`(() => {
      const select = document.getElementById('demo-course-select');
      // Find an option for another course
      const targetOpt = Array.from(select.querySelectorAll('option')).find(o => o.value.includes('Python') || o.value.includes('AI'));
      if (targetOpt) {
        select.value = targetOpt.value;
        select.dispatchEvent(new Event('change'));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 100));

    const dynCtx = await cdp.evaluate(`(() => {
      const select = document.getElementById('demo-course-select');
      const opt = select.selectedOptions[0];
      const pillText = document.getElementById('demo-context-text');
      const hiddenCourseName = document.getElementById('demo-course-name').value;
      return {
        selectedVal: opt ? opt.value : '',
        pillText: pillText ? pillText.textContent : '',
        hiddenCourseName
      };
    })()`);
    assert(dynCtx.pillText.includes(dynCtx.selectedVal), 'Context pill dynamically updated when user chose another course');
    assert(dynCtx.hiddenCourseName === dynCtx.selectedVal, 'Hidden courseName input updated on select change');

    await cdp.evaluate(`window.closeDemoModal();`);
    await new Promise((r) => setTimeout(r, 300));

    // Context Test 3C: Launch with Academy Context
    await cdp.evaluate(`window.openDemoModal({
      academyId: 'programming',
      academyName: 'Programming & Web Dev Academy'
    });`);
    await new Promise((r) => setTimeout(r, 200));

    const acadCtx = await cdp.evaluate(`(() => {
      const select = document.getElementById('demo-course-select');
      const optgroups = Array.from(select.querySelectorAll('optgroup')).map(og => og.label);
      const pill = document.getElementById('demo-selected-context');
      const pillText = document.getElementById('demo-context-text');
      return {
        optgroups,
        pillVisible: pill && window.getComputedStyle(pill).display !== 'none',
        pillText: pillText ? pillText.textContent : ''
      };
    })()`);
    assert(acadCtx.optgroups.length === 1 && acadCtx.optgroups[0].includes('Programming'), 'Dropdown filtered to only the specified academy');
    assert(acadCtx.pillVisible && acadCtx.pillText.includes('Programming'), 'Context pill reflects Academy context');

    await cdp.evaluate(`window.closeDemoModal();`);
    await new Promise((r) => setTimeout(r, 300));

    console.log('\n--- TEST GROUP 4: Validation Engine & Real-Time Feedback ---');
    await cdp.evaluate(`window.openDemoModal();`);
    await new Promise((r) => setTimeout(r, 200));

    // Submit empty form
    await cdp.evaluate(`document.getElementById('demo-booking-form').dispatchEvent(new Event('submit', { cancelable: true }));`);
    await new Promise((r) => setTimeout(r, 100));

    const valEmpty = await cdp.evaluate(`(() => {
      const nameErr = document.getElementById('demo-name-error')?.textContent;
      const phoneErr = document.getElementById('demo-phone-error')?.textContent;
      const courseErr = document.getElementById('demo-course-error')?.textContent;
      const modeErr = document.getElementById('demo-mode-error')?.textContent;
      const cityErr = document.getElementById('demo-city-error')?.textContent;
      const nameInvalid = document.getElementById('demo-name')?.classList.contains('has-error');
      const focusedId = document.activeElement ? document.activeElement.id : '';
      return { nameErr, phoneErr, courseErr, modeErr, cityErr, nameInvalid, focusedId };
    })()`);

    assert(valEmpty.nameErr.includes('full name'), 'Validation caught missing Name');
    assert(valEmpty.phoneErr.includes('10-digit'), 'Validation caught missing Phone');
    assert(valEmpty.courseErr.includes('select a course'), 'Validation caught unselected Course');
    assert(valEmpty.modeErr.includes('learning mode'), 'Validation caught unselected Learning Mode');
    assert(valEmpty.cityErr.includes('city'), 'Validation caught missing City');
    assert(valEmpty.nameInvalid, 'First invalid input marked with has-error class');
    assert(valEmpty.focusedId === 'demo-name', 'First invalid input received focus');

    // Phone validation specifics (Invalid phone: 12345)
    await cdp.evaluate(`(() => {
      document.getElementById('demo-name').value = 'Test Student';
      document.getElementById('demo-phone').value = '12345';
      document.getElementById('demo-booking-form').dispatchEvent(new Event('submit', { cancelable: true }));
    })()`);
    await new Promise((r) => setTimeout(r, 100));

    const phoneValErr = await cdp.evaluate(`document.getElementById('demo-phone-error')?.textContent`);
    assert(phoneValErr.includes('10-digit Indian mobile number'), 'Validation rejects invalid phone number (too short / wrong prefix)');

    // Real-time error clearing on input
    await cdp.evaluate(`(() => {
      const phone = document.getElementById('demo-phone');
      phone.value = '9876543210';
      phone.dispatchEvent(new Event('input'));
    })()`);
    await new Promise((r) => setTimeout(r, 100));

    const phoneCleared = await cdp.evaluate(`(() => {
      const phone = document.getElementById('demo-phone');
      const err = document.getElementById('demo-phone-error')?.textContent;
      return !phone.classList.contains('has-error') && !err;
    })()`);
    assert(phoneCleared, 'Error cleared in real-time when user typed valid phone');

    // Optional email validation
    await cdp.evaluate(`(() => {
      document.getElementById('demo-email').value = 'notanemail';
      document.getElementById('demo-booking-form').dispatchEvent(new Event('submit', { cancelable: true }));
    })()`);
    await new Promise((r) => setTimeout(r, 100));

    const emailErr = await cdp.evaluate(`document.getElementById('demo-email-error')?.textContent`);
    assert(emailErr.includes('valid email'), 'Validation checks email format if entered');

    await cdp.evaluate(`window.closeDemoModal();`);
    await new Promise((r) => setTimeout(r, 300));

    console.log('\n--- TEST GROUP 5: State Machine, Async Submission & CRM Sync ---');
    await cdp.evaluate(`window.openDemoModal();`);
    await new Promise((r) => setTimeout(r, 200));

    // Fill valid data
    await cdp.evaluate(`(() => {
      document.getElementById('demo-name').value = 'Aditi Sharma';
      document.getElementById('demo-phone').value = '9876543210';
      const cSelect = document.getElementById('demo-course-select');
      cSelect.selectedIndex = 1;
      cSelect.dispatchEvent(new Event('change'));
      document.getElementById('demo-mode-select').value = 'Live Online';
      document.getElementById('demo-city').value = 'Bengaluru';
      document.getElementById('demo-email').value = 'aditi.sharma@example.com';
      document.getElementById('demo-slot-select').value = 'Weekend Special Batch';
      document.getElementById('demo-message').value = 'Interested in career transition support.';

      // Intercept window.submitNovaForm to simulate backend confirmation
      window._originalSubmitNovaForm = window.submitNovaForm;
      window._capturedNovaPayload = null;
      window.submitNovaForm = async function(opts) {
        window._capturedNovaPayload = opts;
        // Simulate network latency of 300ms
        await new Promise(r => setTimeout(r, 300));
        if (typeof opts.onSuccessCallback === 'function') {
          opts.onSuccessCallback();
        }
        return true;
      };
    })()`);

    // Submit form
    await cdp.evaluate(`document.getElementById('demo-booking-form').dispatchEvent(new Event('submit', { cancelable: true }));`);
    await new Promise((r) => setTimeout(r, 50));

    // Check Submitting State
    const submittingState = await cdp.evaluate(`(() => {
      const modal = document.getElementById('demo-booking-modal');
      const submitBtn = document.getElementById('demo-submit-btn');
      return {
        dataState: modal.getAttribute('data-state'),
        btnDisabled: submitBtn.disabled,
        btnHtml: submitBtn.innerHTML
      };
    })()`);
    assert(submittingState.dataState === 'submitting', 'Modal entered "submitting" state immediately');
    assert(submittingState.btnDisabled, 'Submit button disabled during submission');
    assert(submittingState.btnHtml.includes('btn-spinner') && submittingState.btnHtml.includes('Requesting Free Demo...'), 'Submit button displays active spinner and loading text');

    // Await async resolution
    await new Promise((r) => setTimeout(r, 450));

    // Check Success State
    const successState = await cdp.evaluate(`(() => {
      const modal = document.getElementById('demo-booking-modal');
      const formContainer = document.getElementById('demo-form-container');
      const successContainer = document.getElementById('demo-success-container');
      const successTitle = document.getElementById('demo-success-title');
      const successDesc = successContainer.querySelector('.success-desc');
      const exploreBtn = successContainer.querySelector('a.btn-primary');

      const formHidden = formContainer.hasAttribute('hidden') || window.getComputedStyle(formContainer).display === 'none';
      const successVisible = !successContainer.hasAttribute('hidden') && window.getComputedStyle(successContainer).display !== 'none';

      return {
        dataState: modal.getAttribute('data-state'),
        formHidden,
        successVisible,
        titleText: successTitle ? successTitle.textContent : '',
        descHtml: successDesc ? successDesc.innerHTML : '',
        exploreHref: exploreBtn ? exploreBtn.getAttribute('href') : ''
      };
    })()`);

    assert(successState.dataState === 'success', 'Modal transitioned to "success" state after backend confirmation');
    assert(successState.formHidden, 'Form container is strictly hidden in success state');
    assert(successState.successVisible, 'Success view container is strictly visible in success state');
    assert(successState.titleText.includes('Demo Request Received!'), 'Success heading displays "Demo Request Received!"');
    assert(successState.descHtml.includes('Aditi Sharma') && successState.descHtml.includes('Live Online'), 'Success description is personalized with student name & learning mode');
    assert(successState.exploreHref.includes('courses.html'), 'Explore CTA links to /courses.html');

    // Verify CRM sync in localStorage
    const localCRM = await cdp.evaluate(`(() => {
      const records = JSON.parse(localStorage.getItem('novaskills_demo_requests') || '[]');
      return records.length > 0 ? records[0] : null;
    })()`);
    assert(localCRM && localCRM.name === 'Aditi Sharma' && localCRM.learningMode === 'Live Online' && localCRM.city === 'Bengaluru', 'Lead correctly stored in novaskills_demo_requests local queue');

    // Verify submitNovaForm payload
    const capturedPayload = await cdp.evaluate(`window._capturedNovaPayload`);
    assert(capturedPayload.formName === 'free_demo', 'submitNovaForm received formName: "free_demo"');
    assert(capturedPayload.data.lead_type === 'free_demo', 'Payload contains lead_type: "free_demo"');
    assert(capturedPayload.data.learning_mode === 'Live Online', 'Payload contains learning_mode');
    assert(capturedPayload.data.city === 'Bengaluru', 'Payload contains city');
    assert(capturedPayload.data.message.includes('LEAD TYPE: free_demo'), 'Encoded CRM message contains detailed lead attributes');

    // Verify close and reopen resets to idle
    await cdp.evaluate(`window.closeDemoModal();`);
    await new Promise((r) => setTimeout(r, 350));
    await cdp.evaluate(`window.openDemoModal();`);
    await new Promise((r) => setTimeout(r, 200));

    const resetState = await cdp.evaluate(`(() => {
      const modal = document.getElementById('demo-booking-modal');
      const formContainer = document.getElementById('demo-form-container');
      const successContainer = document.getElementById('demo-success-container');
      const nameVal = document.getElementById('demo-name').value;
      const phoneVal = document.getElementById('demo-phone').value;
      const submitBtn = document.getElementById('demo-submit-btn');

      return {
        dataState: modal.getAttribute('data-state'),
        formVisible: !formContainer.hasAttribute('hidden') && window.getComputedStyle(formContainer).display !== 'none',
        successHidden: successContainer.hasAttribute('hidden') || window.getComputedStyle(successContainer).display === 'none',
        nameVal,
        phoneVal,
        btnDisabled: submitBtn.disabled
      };
    })()`);
    assert(resetState.dataState === 'idle', 'Reopened modal is in "idle" state');
    assert(resetState.formVisible, 'Form view visible again');
    assert(resetState.successHidden, 'Success view hidden again');
    assert(resetState.nameVal === '' && resetState.phoneVal === '', 'Input fields reset to pristine state');
    assert(!resetState.btnDisabled, 'Submit button re-enabled');

    // Test Error State & Input Preservation
    await cdp.evaluate(`(() => {
      document.getElementById('demo-name').value = 'Rohan Verma';
      document.getElementById('demo-phone').value = '9123456789';
      document.getElementById('demo-mode-select').value = 'Classroom';
      document.getElementById('demo-city').value = 'Delhi';
      document.getElementById('demo-course-select').selectedIndex = 2;

      // Mock failure
      window.submitNovaForm = async function(opts) {
        await new Promise(r => setTimeout(r, 200));
        return false; // Submission failed
      };
    })()`);

    await cdp.evaluate(`document.getElementById('demo-booking-form').dispatchEvent(new Event('submit', { cancelable: true }));`);
    await new Promise((r) => setTimeout(r, 300));

    const errorState = await cdp.evaluate(`(() => {
      const modal = document.getElementById('demo-booking-modal');
      const formContainer = document.getElementById('demo-form-container');
      const errDiv = document.getElementById('demo-form-error');
      const nameVal = document.getElementById('demo-name').value;
      const submitBtn = document.getElementById('demo-submit-btn');

      return {
        dataState: modal.getAttribute('data-state'),
        formVisible: !formContainer.hasAttribute('hidden'),
        errVisible: !errDiv.hasAttribute('hidden') && window.getComputedStyle(errDiv).display !== 'none',
        errText: errDiv.textContent,
        nameVal,
        btnEnabled: !submitBtn.disabled
      };
    })()`);
    assert(errorState.dataState === 'error', 'Modal entered "error" state on backend failure');
    assert(errorState.formVisible, 'Form remained visible so user does NOT lose work');
    assert(errorState.nameVal === 'Rohan Verma', 'User input was strictly PRESERVED on error');
    assert(errorState.errVisible && errorState.errText.includes('Unable to submit demo request'), 'Error banner clearly displayed to user');
    assert(errorState.btnEnabled, 'Submit button re-enabled to allow user to retry');

    // Restore submitNovaForm
    await cdp.evaluate(`window.submitNovaForm = window._originalSubmitNovaForm;`);
    await cdp.evaluate(`window.closeDemoModal();`);
    await new Promise((r) => setTimeout(r, 300));

    console.log('\n--- TEST GROUP 6: Responsive Layout & Zero Horizontal Overflow ---');
    const viewports = [
      { name: '1440px (Desktop)', width: 1440, height: 900 },
      { name: '1024px (Laptop)', width: 1024, height: 768 },
      { name: '768px (Tablet)', width: 768, height: 1024 },
      { name: '390px (iPhone 14 Mobile)', width: 390, height: 844 },
      { name: '375px (Compact Mobile)', width: 375, height: 667 },
      { name: '337px (Galaxy Fold Folded)', width: 337, height: 700 },
      { name: '320px (Ultra-Narrow Mobile)', width: 320, height: 568 }
    ];

    for (const vp of viewports) {
      await cdp.setViewport(vp.width, vp.height);
      await cdp.evaluate(`window.openDemoModal({
        courseName: 'Architectural Visualisation Master',
        academyName: '3D Architecture & Engineering Academy'
      });`);
      await new Promise((r) => setTimeout(r, 200));

      const layoutMetrics = await cdp.evaluate(`(() => {
        const modal = document.getElementById('demo-booking-modal');
        const dialog = modal.querySelector('.demo-modal-dialog');
        const submitBtn = document.getElementById('demo-submit-btn');
        const inputs = Array.from(modal.querySelectorAll('.form-input'));
        const docScrollWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;

        let minInputFontSize = 999;
        inputs.forEach(inp => {
          const fs = parseFloat(window.getComputedStyle(inp).fontSize);
          if (fs < minInputFontSize) minInputFontSize = fs;
        });

        return {
          dialogWidth: dialog.clientWidth,
          dialogScrollWidth: dialog.scrollWidth,
          dialogOverflow: dialog.scrollWidth > dialog.clientWidth + 1,
          docOverflow: docScrollWidth > winWidth,
          minInputFontSize,
          winWidth,
          docScrollWidth
        };
      })()`);

      assert(!layoutMetrics.docOverflow, `[${vp.name}] Zero document horizontal overflow (${layoutMetrics.docScrollWidth}px <= ${layoutMetrics.winWidth}px)`);
      assert(!layoutMetrics.dialogOverflow, `[${vp.name}] Zero dialog horizontal overflow (${layoutMetrics.dialogScrollWidth}px <= ${layoutMetrics.dialogWidth}px)`);

      if (vp.width <= 640) {
        assert(layoutMetrics.minInputFontSize >= 16, `[${vp.name}] Mobile form input font-size >= 16px to prevent iOS auto-zoom (actual: ${layoutMetrics.minInputFontSize}px)`);
      }

      // Capture screenshots for 1440px and 390px
      if (vp.width === 1440) {
        await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'demo_modal_desktop_idle_1440px.png'));
      } else if (vp.width === 390) {
        await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'demo_modal_mobile_idle_390px.png'));

        // Scroll dialog down and capture scrolled screenshot
        await cdp.evaluate(`document.querySelector('.demo-modal-dialog').scrollTop = 300;`);
        await new Promise((r) => setTimeout(r, 100));
        await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'demo_modal_mobile_scrolled_390px.png'));

        // Transition to success state and capture screenshot
        await cdp.evaluate(`setDemoModalState('success');`);
        await new Promise((r) => setTimeout(r, 100));
        await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'demo_modal_mobile_success_390px.png'));

        // Reset back to idle
        await cdp.evaluate(`setDemoModalState('idle');`);
      }

      await cdp.evaluate(`window.closeDemoModal();`);
      await new Promise((r) => setTimeout(r, 200));
    }

    // Capture Desktop Success Screenshot at 1440px
    await cdp.setViewport(1440, 900);
    await cdp.evaluate(`window.openDemoModal();`);
    await new Promise((r) => setTimeout(r, 200));
    await cdp.evaluate(`setDemoModalState('success');`);
    await new Promise((r) => setTimeout(r, 100));
    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'demo_modal_desktop_success_1440px.png'));
    await cdp.evaluate(`window.closeDemoModal();`);
    await new Promise((r) => setTimeout(r, 200));

    console.log('\n--- TEST GROUP 7: Homepage Hero USP 01 & Announcement Bar Trigger Check ---');
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    await new Promise((r) => setTimeout(r, 1000));

    const triggerCheck = await cdp.evaluate(`(() => {
      const usp01 = document.querySelector('.hero-usp-col-1');
      const ctaBtn = document.getElementById('hero-cta-primary');
      const announceLink = document.querySelector('.announcement-text + a[onclick*="openDemoModal"]');
      const footerLink = document.querySelector('footer a[onclick*="openDemoModal"]');

      return {
        usp01Onclick: usp01 ? usp01.getAttribute('onclick') : '',
        ctaBtnOnclick: ctaBtn ? ctaBtn.getAttribute('onclick') : '',
        announceOnclick: announceLink ? announceLink.getAttribute('onclick') : '',
        footerOnclick: footerLink ? footerLink.getAttribute('onclick') : ''
      };
    })()`);

    assert(triggerCheck.usp01Onclick.includes('openDemoModal'), 'Homepage Hero USP 01 onclick wires directly to openDemoModal');
    assert(triggerCheck.ctaBtnOnclick.includes('openDemoModal'), 'Homepage Hero CTA button onclick wires directly to openDemoModal');
    assert(triggerCheck.announceOnclick.includes('openDemoModal'), 'Homepage Announcement bar wires to openDemoModal');
    assert(triggerCheck.footerOnclick.includes('openDemoModal'), 'Homepage Footer quick link wires to openDemoModal');

    // Click USP 01 and verify modal opens
    await cdp.evaluate(`document.querySelector('.hero-usp-col-1').click();`);
    await new Promise((r) => setTimeout(r, 200));
    const uspModalOpened = await cdp.evaluate(`(() => {
      const modal = document.getElementById('demo-booking-modal');
      const srcCta = document.getElementById('demo-source-cta')?.value;
      return !modal.hidden && srcCta === 'hero_usp_demo';
    })()`);
    assert(uspModalOpened, 'Clicking Hero USP 01 successfully opens demo modal with sourceCta: "hero_usp_demo"');
    await cdp.evaluate(`window.closeDemoModal();`);
    await new Promise((r) => setTimeout(r, 200));

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    if (chromeProcess) {
      chromeProcess.kill();
    }
    if (serverProcess) {
      serverProcess.kill();
    }
  }

  console.log(`\n========================================`);
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
