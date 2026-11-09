const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8097;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PORT = 9268;
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
    const tmpProfile = path.join(ROOT_DIR, 'tmp-chrome-enquiry-suite-' + Date.now());
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
  console.log('=== STARTING ADMISSION ENQUIRY MODAL STATE & BUG FIX TEST SUITE ===\n');

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

    const testUrl = `http://127.0.0.1:${PORT}/course-detail.html?id=archviz-mastery`;
    await cdp.send('Page.navigate', { url: testUrl });
    await new Promise((r) => setTimeout(r, 1200));

    console.log('--- TEST GROUP 1: Idle State & Scrolling Inspection Across 6 Viewports ---');
    const viewports = [
      { name: '1440px (Desktop)', width: 1440, height: 900 },
      { name: '1024px (Laptop)', width: 1024, height: 768 },
      { name: '768px (Tablet)', width: 768, height: 1024 },
      { name: '390px (iPhone 14 Mobile)', width: 390, height: 844 },
      { name: '375px (Compact Mobile)', width: 375, height: 667 },
      { name: '320px (Small Mobile)', width: 320, height: 568 }
    ];

    for (const vp of viewports) {
      await cdp.setViewport(vp.width, vp.height);

      // Open enrollment modal
      await cdp.evaluate(`
        window.openEnrollmentModal({
          courseName: 'Architectural Visualisation Master',
          academyName: '3D Architecture & Engineering Academy',
          duration: '6 Months',
          fee: '₹44,900'
        });
      `);
      await new Promise((r) => setTimeout(r, 300));

      // Inspect idle state
      const idleMetrics = await cdp.evaluate(`(() => {
        const modal = document.getElementById('course-enrollment-modal');
        const formContainer = document.getElementById('enroll-form-container');
        const successContainer = document.getElementById('enroll-success-container');
        const submitBtn = document.getElementById('enroll-submit-btn');
        const modalContainer = modal.querySelector('.enroll-modal-container');

        const successStyles = window.getComputedStyle(successContainer);
        const formStyles = window.getComputedStyle(formContainer);

        return {
          isOpen: modal.classList.contains('open'),
          dataState: modal.getAttribute('data-state'),
          formDisplay: formStyles.display,
          formVisibility: formStyles.visibility,
          formHeight: formContainer.offsetHeight,
          successDisplay: successStyles.display,
          successVisibility: successStyles.visibility,
          successHeight: successContainer.offsetHeight,
          hasHiddenAttr: successContainer.hasAttribute('hidden'),
          submitBtnDisabled: submitBtn.disabled,
          submitBtnText: submitBtn.textContent.trim(),
          containerScrollHeight: modalContainer.scrollHeight,
          containerClientHeight: modalContainer.clientHeight
        };
      })()`);

      assert(idleMetrics.isOpen, `[${vp.name}] Modal opened successfully`);
      assert(idleMetrics.dataState === 'idle', `[${vp.name}] Modal state attribute is 'idle'`);
      assert(idleMetrics.hasHiddenAttr === true, `[${vp.name}] Success container has [hidden] attribute`);
      assert(idleMetrics.successDisplay === 'none', `[${vp.name}] Success container computed display is 'none' (was flex)`);
      assert(idleMetrics.successHeight === 0, `[${vp.name}] Success container rendered height is 0px (was ~321px)`);
      assert(idleMetrics.formDisplay !== 'none', `[${vp.name}] Form container is visible`);

      // SCENARIO B: Scroll modal container to bottom
      await cdp.evaluate(`(() => {
        const modalContainer = document.querySelector('.enroll-modal-container');
        modalContainer.scrollTop = modalContainer.scrollHeight;
      })()`);
      await new Promise((r) => setTimeout(r, 200));

      const scrolledMetrics = await cdp.evaluate(`(() => {
        const successContainer = document.getElementById('enroll-success-container');
        const formContainer = document.getElementById('enroll-form-container');
        const styles = window.getComputedStyle(successContainer);
        const rect = successContainer.getBoundingClientRect();

        return {
          display: styles.display,
          visibility: styles.visibility,
          height: successContainer.offsetHeight,
          rectHeight: rect.height,
          rectWidth: rect.width
        };
      })()`);

      assert(scrolledMetrics.display === 'none', `[${vp.name}] When scrolled to bottom, success container remains display 'none'`);
      assert(scrolledMetrics.height === 0 && scrolledMetrics.rectHeight === 0, `[${vp.name}] When scrolled to bottom, success container occupies 0px layout`);

      // Capture screenshot at mobile & desktop
      if (vp.width === 1440) {
        await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'enquiry_modal_desktop_idle_1440px.png'));
      } else if (vp.width === 390) {
        await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'enquiry_modal_mobile_scrolled_390px.png'));
      }

      // Close modal
      await cdp.evaluate(`window.closeEnrollmentModal();`);
      await new Promise((r) => setTimeout(r, 350));
    }

    console.log('\n--- TEST GROUP 2: State Machine Transitions (Idle, Submitting, Success, Error) ---');

    // Open modal again at desktop
    await cdp.setViewport(1440, 900);
    await cdp.evaluate(`
      window.openEnrollmentModal({
        courseName: 'Architectural Visualisation Master',
        academyName: '3D Architecture & Engineering Academy',
        duration: '6 Months',
        fee: '₹44,900'
      });
    `);
    await new Promise((r) => setTimeout(r, 300));

    // SCENARIO D: Client Validation on Invalid Form
    await cdp.evaluate(`(() => {
      document.getElementById('enroll-name').value = '';
      document.getElementById('enroll-phone').value = '12345';
      document.getElementById('enroll-city').value = '';
      document.getElementById('course-enrollment-form').dispatchEvent(new Event('submit', { cancelable: true }));
    })()`);
    await new Promise((r) => setTimeout(r, 100));

    const invalidState = await cdp.evaluate(`(() => {
      const modal = document.getElementById('course-enrollment-modal');
      const successContainer = document.getElementById('enroll-success-container');
      const nameError = document.getElementById('enroll-name-error');
      const phoneError = document.getElementById('enroll-phone-error');
      const cityError = document.getElementById('enroll-city-error');
      return {
        dataState: modal.getAttribute('data-state'),
        successDisplay: window.getComputedStyle(successContainer).display,
        nameHasError: nameError.textContent.length > 0,
        phoneHasError: phoneError.textContent.length > 0,
        cityHasError: cityError.textContent.length > 0
      };
    })()`);

    assert(invalidState.dataState === 'idle', 'Invalid submit keeps modal in idle state (not success)');
    assert(invalidState.successDisplay === 'none', 'Success container remains strictly hidden on validation failure');
    assert(invalidState.nameHasError && invalidState.phoneHasError && invalidState.cityHasError, 'Field errors displayed for invalid inputs');

    // SCENARIO E: Form Filled With Valid Data & Successful Submission
    await cdp.evaluate(`(() => {
      // Mock submitNovaForm to simulate successful backend confirmation
      window._originalSubmitNovaForm = window.submitNovaForm;
      window.submitNovaForm = async function(opts) {
        // simulate async network delay
        await new Promise(r => setTimeout(r, 150));
        opts.onSuccessCallback();
        return true;
      };

      document.getElementById('enroll-name').value = 'Test Student';
      document.getElementById('enroll-phone').value = '9876543210';
      document.getElementById('enroll-email').value = 'test@example.com';
      document.getElementById('enroll-city').value = 'Mumbai';
      document.getElementById('enroll-message').value = 'Looking for weekend batch timings.';
      document.getElementById('course-enrollment-form').dispatchEvent(new Event('submit', { cancelable: true }));
    })()`);

    // Verify submitting state immediately
    const submittingState = await cdp.evaluate(`(() => {
      const modal = document.getElementById('course-enrollment-modal');
      const form = document.getElementById('course-enrollment-form');
      const submitBtn = document.getElementById('enroll-submit-btn');
      return {
        dataState: modal.getAttribute('data-state'),
        submittingDataset: form.dataset.submitting,
        submitBtnDisabled: submitBtn.disabled
      };
    })()`);

    assert(submittingState.dataState === 'submitting', "During submission, modal state is 'submitting'");
    assert(submittingState.submittingDataset === 'true', "During submission, form dataset.submitting is 'true'");
    assert(submittingState.submitBtnDisabled === true, 'During submission, submit CTA is disabled');

    // Wait for mock network response to resolve
    await new Promise((r) => setTimeout(r, 250));

    const successState = await cdp.evaluate(`(() => {
      const modal = document.getElementById('course-enrollment-modal');
      const formContainer = document.getElementById('enroll-form-container');
      const successContainer = document.getElementById('enroll-success-container');
      const successTitle = document.getElementById('enroll-success-title');
      const successStyles = window.getComputedStyle(successContainer);
      const formStyles = window.getComputedStyle(formContainer);
      const modalContainer = modal.querySelector('.enroll-modal-container');

      return {
        dataState: modal.getAttribute('data-state'),
        formDisplay: formStyles.display,
        formHiddenAttr: formContainer.hasAttribute('hidden'),
        successDisplay: successStyles.display,
        successHiddenAttr: successContainer.hasAttribute('hidden'),
        successHeight: successContainer.offsetHeight,
        scrollTop: modalContainer.scrollTop,
        isTitleFocused: document.activeElement === successTitle
      };
    })()`);

    assert(successState.dataState === 'success', "After backend confirmation, modal state is 'success'");
    assert(successState.formDisplay === 'none' && successState.formHiddenAttr, 'Form container is completely hidden (display: none)');
    assert(successState.successDisplay === 'flex' && !successState.successHiddenAttr, 'Success container is visible with display: flex');
    assert(successState.successHeight > 100, 'Success container rendered with proper height');
    assert(successState.scrollTop === 0, 'Modal scroll position reset to 0 at top');
    assert(successState.isTitleFocused === true, 'Accessibility focus transferred to success title');

    await cdp.captureScreenshot(path.join(ARTIFACT_DIR, 'enquiry_modal_desktop_success_1440px.png'));

    // SCENARIO G: Close and reopen resets to idle state
    await cdp.evaluate(`window.closeEnrollmentModal();`);
    await new Promise((r) => setTimeout(r, 350));

    await cdp.evaluate(`
      window.openEnrollmentModal({
        courseName: 'Creative Design Master',
        academyName: 'Design Academy',
        duration: '8 Months',
        fee: '₹64,900'
      });
    `);
    await new Promise((r) => setTimeout(r, 300));

    const reopenedState = await cdp.evaluate(`(() => {
      const modal = document.getElementById('course-enrollment-modal');
      const formContainer = document.getElementById('enroll-form-container');
      const successContainer = document.getElementById('enroll-success-container');
      const cardCourse = document.getElementById('card-course-name').textContent;
      const nameVal = document.getElementById('enroll-name').value;
      const phoneVal = document.getElementById('enroll-phone').value;

      return {
        dataState: modal.getAttribute('data-state'),
        formDisplay: window.getComputedStyle(formContainer).display,
        successDisplay: window.getComputedStyle(successContainer).display,
        cardCourse,
        nameVal,
        phoneVal
      };
    })()`);

    assert(reopenedState.dataState === 'idle', 'Reopened modal resets to idle state');
    assert(reopenedState.formDisplay !== 'none', 'Form container is visible in reopened modal');
    assert(reopenedState.successDisplay === 'none', 'Success container is strictly hidden in reopened modal');
    assert(reopenedState.cardCourse.includes('Creative Design Master'), 'Updated course name displayed in reopened modal');
    assert(reopenedState.nameVal === '' && reopenedState.phoneVal === '', 'Inputs reset to empty in reopened modal');

    // SCENARIO F: Backend Error Preserves Inputs and Shows Error Message
    await cdp.evaluate(`(() => {
      window.submitNovaForm = async function(opts) {
        await new Promise(r => setTimeout(r, 100));
        return false; // simulate failure
      };

      document.getElementById('enroll-name').value = 'Jane Doe';
      document.getElementById('enroll-phone').value = '9876543210';
      document.getElementById('enroll-city').value = 'Delhi';
      document.getElementById('course-enrollment-form').dispatchEvent(new Event('submit', { cancelable: true }));
    })()`);
    await new Promise((r) => setTimeout(r, 250));

    const errorState = await cdp.evaluate(`(() => {
      const modal = document.getElementById('course-enrollment-modal');
      const formContainer = document.getElementById('enroll-form-container');
      const successContainer = document.getElementById('enroll-success-container');
      const errDiv = document.getElementById('enroll-form-error');
      const nameVal = document.getElementById('enroll-name').value;
      const phoneVal = document.getElementById('enroll-phone').value;
      const cityVal = document.getElementById('enroll-city').value;
      const submitBtn = document.getElementById('enroll-submit-btn');

      return {
        dataState: modal.getAttribute('data-state'),
        formDisplay: window.getComputedStyle(formContainer).display,
        successDisplay: window.getComputedStyle(successContainer).display,
        errVisible: !errDiv.hasAttribute('hidden') && window.getComputedStyle(errDiv).display !== 'none',
        errText: errDiv.textContent,
        inputsPreserved: nameVal === 'Jane Doe' && phoneVal === '9876543210' && cityVal === 'Delhi',
        btnEnabled: !submitBtn.disabled
      };
    })()`);

    assert(errorState.dataState === 'error', "On submission failure, state transitions to 'error'");
    assert(errorState.formDisplay !== 'none', 'Form container remains visible on error');
    assert(errorState.successDisplay === 'none', 'Success container remains strictly hidden on error');
    assert(errorState.errVisible, 'Error banner is visible to user');
    assert(errorState.inputsPreserved, 'User inputs (name, phone, city) are completely PRESERVED on error');
    assert(errorState.btnEnabled, 'Submit button is re-enabled to allow user to retry');

    // SCENARIO J: Stale Async Response Dropped When Modal Closed During Request
    await cdp.evaluate(`(() => {
      window.submitNovaForm = async function(opts) {
        // Slow network: 500ms
        await new Promise(r => setTimeout(r, 500));
        opts.onSuccessCallback();
        return true;
      };

      // Submit
      document.getElementById('course-enrollment-form').dispatchEvent(new Event('submit', { cancelable: true }));
      // Immediately close modal after 50ms
      setTimeout(() => {
        window.closeEnrollmentModal();
      }, 50);
    })()`);

    // Wait for the slow network request (600ms)
    await new Promise((r) => setTimeout(r, 650));

    // Reopen modal - should still be idle, NOT success!
    await cdp.evaluate(`
      window.openEnrollmentModal({
        courseName: 'Python Developer Professional'
      });
    `);
    await new Promise((r) => setTimeout(r, 300));

    const staleProtectionState = await cdp.evaluate(`(() => {
      const modal = document.getElementById('course-enrollment-modal');
      const successContainer = document.getElementById('enroll-success-container');
      const formContainer = document.getElementById('enroll-form-container');
      return {
        dataState: modal.getAttribute('data-state'),
        successDisplay: window.getComputedStyle(successContainer).display,
        formDisplay: window.getComputedStyle(formContainer).display
      };
    })()`);

    assert(staleProtectionState.dataState === 'idle', 'Stale async response was discarded; modal reopened in clean idle state');
    assert(staleProtectionState.successDisplay === 'none', 'Success container was NOT triggered by stale async callback');
    assert(staleProtectionState.formDisplay !== 'none', 'Form container is visible');

  } finally {
    if (chromeProcess) chromeProcess.kill();
    if (serverProcess) serverProcess.kill();
    if (tmpProfile) {
      try {
        fs.rmSync(tmpProfile, { recursive: true, force: true });
      } catch (e) {}
    }
  }

  console.log('\n========================================');
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error during test suite:', err);
  if (chromeProcess) chromeProcess.kill();
  if (serverProcess) serverProcess.kill();
  process.exit(1);
});
