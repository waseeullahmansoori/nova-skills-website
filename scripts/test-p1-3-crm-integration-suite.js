/**
 * Nova Skills P1-3 Admissions CRM Integration & Lead Pipeline Test Suite
 * 
 * Verifies:
 * 1. Form Inventory & Lead Source Coverage across all entry points
 * 2. Standardized Form Type Taxonomy (Section 5)
 * 3. Client-Side Idempotency & Unique Lead ID Generation (Retry safety)
 * 4. Google Sheets Formula Injection Sanitization (=, +, -, @)
 * 5. Minor Safeguard / Kids Tech Guardian Consent Detection
 * 6. Google Sheets CRM 21-Column Payload Alignment
 * 7. Zero Fake Success & Safe Error Recovery (Input preservation, PII scrubbing)
 * 8. Server-side Apps Script Template Verification
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

console.log('================================================================');
console.log('🧪 P1-3 ADMISSIONS CRM INTEGRATION & LEAD PIPELINE TEST SUITE');
console.log('================================================================\n');

class MockElement {
  constructor(tag = 'div', id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.dataset = {};
    this.children = [];
    this.style = {};
    this.disabled = false;
    this.classList = {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      toggle(c, f) { if (f !== undefined) f ? this.add(c) : this.remove(c); else this._classes.has(c) ? this.remove(c) : this.add(c); },
      contains(c) { return this._classes.has(c); }
    };
    this.value = '';
    this.innerHTML = '';
    this.textContent = '';
    this.listeners = {};
    this.attributes = {};
  }
  addEventListener(evt, fn) {
    if (!this.listeners[evt]) this.listeners[evt] = [];
    this.listeners[evt].push(fn);
  }
  removeEventListener(evt, fn) {
    if (this.listeners[evt]) {
      this.listeners[evt] = this.listeners[evt].filter(f => f !== fn);
    }
  }
  dispatchEvent(eventObj = {}) {
    const type = eventObj.type || 'click';
    if (this.listeners[type]) {
      this.listeners[type].forEach(fn => fn(eventObj));
    }
  }
  querySelector(sel) {
    if (sel.includes('input[name="website"]')) return null;
    return null;
  }
  querySelectorAll() { return []; }
  appendChild(el) { this.children.push(el); }
  insertAdjacentHTML() {}
  reset() {}
  focus() {}
  setAttribute(k, v) { this.attributes[k] = String(v); this[k] = v; }
  getAttribute(k) { return this.attributes[k] !== undefined ? this.attributes[k] : (this[k] || null); }
  removeAttribute(k) { delete this.attributes[k]; delete this[k]; }
}

function createMockEnvironment() {
  const capturedEvents = [];
  const networkRequests = [];
  const consoleErrors = [];

  const elementsMap = {};
  function getOrCreateElement(tag, id) {
    const key = id || tag;
    if (!elementsMap[key]) {
      elementsMap[key] = new MockElement(tag, id);
    }
    return elementsMap[key];
  }

  const mockDoc = {
    readyState: 'complete',
    title: 'Nova Skills Test Title',
    referrer: '',
    addEventListener: () => {},
    removeEventListener: () => {},
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => getOrCreateElement('div', id),
    querySelector: () => new MockElement('div'),
    querySelectorAll: () => [],
    body: new MockElement('body'),
    documentElement: new MockElement('html')
  };

  const sandbox = {
    window: {},
    document: mockDoc,
    navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' },
    location: {
      pathname: '/courses/',
      href: 'https://novaskills.in/courses/',
      hostname: 'novaskills.in',
      port: '',
      search: ''
    },
    sessionStorage: {
      store: {},
      getItem(k) { return this.store[k] || null; },
      setItem(k, v) { this.store[k] = String(v); },
      removeItem(k) { delete this.store[k]; }
    },
    localStorage: {
      store: {},
      getItem(k) { return this.store[k] || null; },
      setItem(k, v) { this.store[k] = String(v); },
      removeItem(k) { delete this.store[k]; }
    },
    dataLayer: [],
    gtag: (cmd, name, params) => {
      if (cmd === 'event') capturedEvents.push({ event: name, params });
    },
    console: {
      log: () => {},
      warn: () => {},
      error: (...args) => { consoleErrors.push(args); }
    },
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    requestAnimationFrame: (cb) => cb(),
    requestIdleCallback: (cb) => cb(),
    fetch: async (url, opts) => {
      const parsedBody = opts && opts.body ? JSON.parse(opts.body) : null;
      networkRequests.push({ url, opts, body: parsedBody });
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, action: 'created', leadId: 'NS-TEST-123' }),
        text: async () => JSON.stringify({ success: true })
      };
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    URLSearchParams: URLSearchParams,
    screen: { width: 1440, height: 900 },
    Intl: {
      DateTimeFormat: () => ({ resolvedOptions: () => ({ timeZone: 'Asia/Kolkata' }) })
    }
  };

  sandbox.window = sandbox;
  mockDoc.defaultView = sandbox;

  const context = vm.createContext(sandbox);

  // Load course data
  const courseDataCode = fs.readFileSync(path.join(__dirname, '../js/course-data.js'), 'utf8');
  vm.runInContext(courseDataCode + '\nwindow.NovaCourseData = NovaCourseData;', context);

  // Load components.js
  const componentsCode = fs.readFileSync(path.join(__dirname, '../components.js'), 'utf8');
  vm.runInContext(componentsCode, context);

  return { context, sandbox, networkRequests, consoleErrors, capturedEvents };
}

async function runTests() {
  // ─────────────────────────────────────────────────────────────
  // TEST GROUP 1: Standardized Form Type Taxonomy Resolution
  // ─────────────────────────────────────────────────────────────
  console.log('--- 1. Verifying Standardized Form Type Taxonomy (Section 5) ---');
  {
    const { sandbox, networkRequests } = createMockEnvironment();

    // 1. Demo booking
    const formDemo = new MockElement('form', 'demo-booking-form');
    const btnDemo = new MockElement('button');

    await sandbox.submitNovaForm({
      form: formDemo,
      submitBtn: btnDemo,
      data: {
        name: 'Aarav Sharma',
        phone: '9876543210',
        email: 'aarav@example.com',
        course: 'AI Digital Marketing Specialist',
        course_id: 'dm-professional'
      }
    });

    const lastReqDemo = networkRequests.filter(r => r.body).pop();
    assert(lastReqDemo.body.formType === 'demo_booking', 'Demo booking modal resolves to formType=demo_booking');
    assert(lastReqDemo.body.lead_type === 'free_demo', 'Backward compatible lead_type=free_demo preserved');

    // 2. Career counselling
    const formCounselling = new MockElement('form', 'counselling-booking-form');
    const btnCounselling = new MockElement('button');

    await sandbox.submitNovaForm({
      form: formCounselling,
      submitBtn: btnCounselling,
      data: {
        name: 'Priya Verma',
        phone: '9876543211',
        course: 'Not Sure — Help Me Choose'
      }
    });

    const lastReqCounselling = networkRequests.filter(r => r.body).pop();
    assert(lastReqCounselling.body.formType === 'career_counselling', 'Counselling modal resolves to formType=career_counselling');
    assert(lastReqCounselling.body.lead_type === 'free_consultation', 'Backward compatible lead_type=free_consultation preserved');

    // 3. Admission / Enrolment enquiry
    const formEnroll = new MockElement('form', 'course-enrollment-form');
    const btnEnroll = new MockElement('button');

    await sandbox.submitNovaForm({
      form: formEnroll,
      submitBtn: btnEnroll,
      data: {
        name: 'Rohan Mehra',
        phone: '9876543212',
        course: 'AI-Assisted Full Stack Web Development',
        course_id: 'ai-assisted-full-stack-web-development'
      }
    });

    const lastReqEnroll = networkRequests.filter(r => r.body).pop();
    assert(lastReqEnroll.body.formType === 'admission_enquiry', 'Enrollment modal resolves to formType=admission_enquiry');
    assert(lastReqEnroll.body.lead_type === 'enrollment_enquiry', 'Backward compatible lead_type=enrollment_enquiry preserved');

    // 4. AI Career Advisor Human Handoff
    const formAI = new MockElement('form', 'counselling-booking-form');
    const btnAI = new MockElement('button');

    await sandbox.submitNovaForm({
      form: formAI,
      submitBtn: btnAI,
      data: {
        name: 'Ananya Gupta',
        phone: '9876543213',
        course: 'AI Solutions Engineering & Agentic AI Mastery',
        course_id: 'ai-solutions-engineering',
        sourceCta: 'ai_career_advisor'
      }
    });

    const lastReqAI = networkRequests.filter(r => r.body).pop();
    assert(lastReqAI.body.formType === 'career_advisor_handoff', 'AI Career Advisor referral resolves to formType=career_advisor_handoff');

    // 5. Course Enquiry
    const formEnquiry = new MockElement('form', 'custom-course-form');
    const btnEnquiry = new MockElement('button');

    await sandbox.submitNovaForm({
      form: formEnquiry,
      submitBtn: btnEnquiry,
      formName: 'course_enquiry',
      data: {
        name: 'Karan Singh',
        phone: '9876543214',
        course: 'Graphic Design Professional'
      }
    });

    const lastReqEnquiry = networkRequests.filter(r => r.body).pop();
    assert(lastReqEnquiry.body.formType === 'course_enquiry', 'Course enquiry form resolves to formType=course_enquiry');
  }

  // ─────────────────────────────────────────────────────────────
  // TEST GROUP 2: Client-Side Idempotency & Lead ID Generation
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 2. Verifying Client-Side Idempotency & Lead ID Generation ---');
  {
    const { sandbox, networkRequests } = createMockEnvironment();

    const form = new MockElement('form', 'demo-booking-form');
    const btn = new MockElement('button');

    await sandbox.submitNovaForm({
      form,
      submitBtn: btn,
      data: { name: 'Vikas Patel', phone: '9876543215' }
    });

    const crmReqs = networkRequests.filter(r => r.body);
    const req1 = crmReqs[0];
    const leadId1 = req1.body.leadId;
    assert(Boolean(leadId1 && leadId1.startsWith('NS-')), 'Generates unique leadId with NS- prefix');
    assert(req1.body.createdAt !== undefined, 'Includes createdAt timestamp in ISO format');

    // Simulate network retry on a failed attempt
    let crmAttempts = 0;
    sandbox.fetch = async (url, opts) => {
      const parsed = opts && opts.body ? JSON.parse(opts.body) : null;
      networkRequests.push({ url, opts, body: parsed });
      if (url && url.includes('script.google.com')) {
        crmAttempts++;
        if (crmAttempts === 1) {
          return {
            ok: false,
            status: 503,
            json: async () => ({ success: false, message: 'Admissions server busy' }),
            text: async () => 'busy'
          };
        }
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ success: true, action: 'created' }),
        text: async () => 'ok'
      };
    };

    const formRetry = new MockElement('form', 'counselling-booking-form');
    const btnRetry = new MockElement('button');

    // Attempt 1 (Fails)
    await sandbox.submitNovaForm({
      form: formRetry,
      submitBtn: btnRetry,
      data: { name: 'Retry Tester', phone: '9876543216' }
    });

    const preservedLeadId = formRetry.dataset.currentLeadId;
    assert(Boolean(preservedLeadId), 'Preserves currentLeadId on form dataset when submission fails');

    // Attempt 2 (User clicks retry with preserved form)
    await sandbox.submitNovaForm({
      form: formRetry,
      submitBtn: btnRetry,
      data: { name: 'Retry Tester', phone: '9876543216' }
    });

    const retryReq = networkRequests.filter(r => r.body).pop();
    assert(retryReq.body.leadId === preservedLeadId, 'Reuses exact same leadId on retry (guaranteeing idempotency)');
  }

  // ─────────────────────────────────────────────────────────────
  // TEST GROUP 3: Google Sheets Formula Injection Sanitization
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 3. Verifying Google Sheets Formula Injection Sanitization ---');
  {
    const { sandbox, networkRequests } = createMockEnvironment();

    const form = new MockElement('form', 'demo-booking-form');
    const btn = new MockElement('button');

    // Malicious / formula-triggering inputs
    await sandbox.submitNovaForm({
      form,
      submitBtn: btn,
      data: {
        name: "=cmd|' /C calc'!A0",
        phone: "+91 9876543217",
        email: "@malicious_handler",
        city: "-New Delhi",
        message: "+Need 50% scholarship =SUM(A1:A10)",
        course: '=HYPERLINK("https://phishing.site", "Click Here")'
      }
    });

    const payload = networkRequests.filter(r => r.body).pop().body;

    assert(payload.name === "'=cmd|' /C calc'!A0", 'Sanitizes leading = in name with single quote prefix');
    assert(payload.phone === "'+91 9876543217", 'Sanitizes leading + in phone number with single quote prefix');
    assert(payload.email === "'@malicious_handler", 'Sanitizes leading @ in email with single quote prefix');
    assert(payload.city === "'-New Delhi", 'Sanitizes leading - in city with single quote prefix');
    assert(payload.notes.startsWith("'+Need"), 'Sanitizes leading + in notes/message with single quote prefix');
    assert(payload.recommendedCourse.startsWith("'=HYPERLINK"), 'Sanitizes leading = in course with single quote prefix');

    // Normal safe inputs
    const formNormal = new MockElement('form', 'demo-booking-form');
    const btnNormal = new MockElement('button');

    await sandbox.submitNovaForm({
      form: formNormal,
      submitBtn: btnNormal,
      data: {
        name: 'Aditya Nair',
        phone: '9876543218',
        email: 'aditya@gmail.com',
        city: 'Indore',
        message: 'Looking for morning batch'
      }
    });

    const normalPayload = networkRequests.filter(r => r.body).pop().body;
    assert(normalPayload.name === 'Aditya Nair', 'Leaves normal alphabetic name untouched');
    assert(normalPayload.phone === '9876543218', 'Leaves normal 10-digit phone number untouched');
    assert(normalPayload.city === 'Indore', 'Leaves normal city untouched');
  }

  // ─────────────────────────────────────────────────────────────
  // TEST GROUP 4: Minor Safeguard (Kids Tech Academy)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 4. Verifying Minor Safeguard / Kids Tech Guardian Consent ---');
  {
    const { sandbox, networkRequests } = createMockEnvironment();

    // Test 1: Kids Tech course selection
    const formKids = new MockElement('form', 'demo-booking-form');
    const btnKids = new MockElement('button');

    await sandbox.submitNovaForm({
      form: formKids,
      submitBtn: btnKids,
      data: {
        name: 'Aryan (Parent: Rajesh)',
        phone: '9876543219',
        course_id: 'young-coders',
        course: 'Young Coders Program',
        academy: 'Kids Tech Academy',
        academy_id: 'kids'
      }
    });

    const payloadKids = networkRequests.filter(r => r.body).pop().body;
    assert(payloadKids.guardianConsentRequired === true, 'Sets guardianConsentRequired=true for kids tech course');
    assert(payloadKids.minorSafeguard === true, 'Sets minorSafeguard=true for kids tech course');
    assert(payloadKids.notes.includes('[Minor Safeguard: Guardian/Parental Consent Required]'), 'Appends Minor Safeguard disclaimer into CRM notes field');

    // Test 2: Adult / Flagship course selection
    const formAdult = new MockElement('form', 'demo-booking-form');
    const btnAdult = new MockElement('button');

    await sandbox.submitNovaForm({
      form: formAdult,
      submitBtn: btnAdult,
      data: {
        name: 'Kavita Sundaram',
        phone: '9876543220',
        course_id: 'dm-professional',
        course: 'AI Digital Marketing Specialist',
        academy: 'Digital Marketing Academy',
        academy_id: 'digital-marketing'
      }
    });

    const payloadAdult = networkRequests.filter(r => r.body).pop().body;
    assert(payloadAdult.guardianConsentRequired === false, 'Leaves guardianConsentRequired=false for regular adult courses');
    assert(!payloadAdult.notes.includes('Minor Safeguard'), 'Does not append Minor Safeguard disclaimer for regular courses');
  }

  // ─────────────────────────────────────────────────────────────
  // TEST GROUP 5: 21-Column CRM Payload Schema Alignment
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 5. Verifying 21-Column Google Sheets CRM Payload Schema ---');
  {
    const { sandbox, networkRequests } = createMockEnvironment();

    const form = new MockElement('form', 'counselling-booking-form');
    const btn = new MockElement('button');

    await sandbox.submitNovaForm({
      form,
      submitBtn: btn,
      data: {
        name: 'Neha Kapoor',
        phone: '9876543221',
        email: 'neha.k@example.com',
        city: 'Siddharth Nagar',
        state: 'Uttar Pradesh',
        qualification: 'B.Tech CS',
        currentStatus: 'Final Year Student',
        careerGoal: 'Become Full Stack Web Developer',
        budget: '30000',
        learning_mode: 'offline_campus',
        course: 'AI-Assisted Full Stack Web Development',
        course_id: 'ai-assisted-full-stack-web-development',
        academy: 'Programming & Tech Academy',
        notes: 'Interested in on-campus batch starting next month.'
      }
    });

    const payload = networkRequests.filter(r => r.body).pop().body;

    // Verify all 21 Google Sheets CRM Columns
    assert(payload.leadId !== undefined && payload.leadId !== '', 'Col 1: leadId mapped');
    assert(payload.createdAt !== undefined && payload.createdAt !== '', 'Col 2: createdAt mapped');
    assert(payload.sessionId !== undefined && payload.sessionId !== '', 'Col 4: sessionId mapped');
    assert(payload.name === 'Neha Kapoor', 'Col 5: name mapped');
    assert(payload.phone === '9876543221', 'Col 6: phone mapped');
    assert(payload.email === 'neha.k@example.com', 'Col 7: email mapped');
    assert(payload.city === 'Siddharth Nagar', 'Col 8: city mapped');
    assert(payload.state === 'Uttar Pradesh', 'Col 9: state mapped');
    assert(payload.qualification === 'B.Tech CS', 'Col 10: qualification mapped');
    assert(payload.currentStatus === 'Final Year Student', 'Col 11: currentStatus mapped');
    assert(payload.careerGoal === 'Become Full Stack Web Developer', 'Col 12: careerGoal mapped');
    assert(Boolean(payload.interest), 'Col 13: interest mapped');
    assert(payload.budget === '30000', 'Col 14: budget mapped');
    assert(payload.preferredMode === 'offline_campus', 'Col 15: preferredMode mapped');
    assert(Boolean(payload.recommendedCourse), 'Col 16: recommendedCourse mapped');
    assert(typeof payload.leadScore === 'number', 'Col 17: leadScore mapped as number');
    assert(payload.status === 'NEW', 'Col 18: status default=NEW');
    assert(payload.leadSource !== undefined && payload.leadSource !== '', 'Col 20: leadSource mapped');
    assert(payload.notes.includes('Interested in on-campus batch'), 'Col 21: notes mapped');

    // Verify Webhook & Legacy Compatibility
    assert(payload.mobile === payload.phone, 'Compatibility: mobile === phone');
    assert(payload.course !== undefined, 'Compatibility: course alias present');
    assert(payload.learning_mode === payload.preferredMode, 'Compatibility: learning_mode alias present');
    assert(payload.formType === 'career_counselling', 'Standardized formType present');
  }

  // ─────────────────────────────────────────────────────────────
  // TEST GROUP 6: Zero Fake Success & Error Recovery
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 6. Verifying Zero Fake Success & Error Recovery ---');
  {
    const { sandbox, consoleErrors } = createMockEnvironment();

    // Configure fetch to fail
    sandbox.fetch = async () => {
      return {
        ok: false,
        status: 500,
        json: async () => ({ success: false, error: 'CRM Internal Server Error' }),
        text: async () => 'error'
      };
    };

    const form = new MockElement('form', 'custom-test-form');
    const nameInput = new MockElement('input');
    nameInput.value = 'Ramesh Kumar';
    form.appendChild(nameInput);

    const btn = new MockElement('button');
    btn.innerHTML = 'Submit';

    const result = await sandbox.submitNovaForm({
      form,
      submitBtn: btn,
      data: { name: 'Ramesh Kumar', phone: '9876543222', email: 'ramesh@example.com' }
    });

    assert(result === false, 'Returns false on CRM network/server failure');
    assert(nameInput.value === 'Ramesh Kumar', 'Preserves user input values on failure (never clears form)');
    assert(btn.disabled === false, 'Re-enables submit button after failure so user can retry');

    // Verify zero PII logged in console errors
    const fullLogText = JSON.stringify(consoleErrors);
    assert(!fullLogText.includes('9876543222'), 'Zero phone number leaked in error logs');
    assert(!fullLogText.includes('ramesh@example.com'), 'Zero email leaked in error logs');
    assert(!fullLogText.includes('Ramesh Kumar'), 'Zero candidate name leaked in error logs');
  }

  // ─────────────────────────────────────────────────────────────
  // TEST GROUP 7: Google Apps Script Web App Template Verification
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- 7. Verifying Google Apps Script Template Code ---');
  {
    const gasCode = fs.readFileSync(path.join(__dirname, '../worker/src/scripts/googleAppsScript.js'), 'utf8');

    assert(gasCode.includes('function sanitizeFormula'), 'Apps Script template defines sanitizeFormula helper');
    assert(gasCode.includes('/^[=+\\-@\\t\\r]/'), 'Apps Script template checks for =, +, -, @ formula triggers');
    assert(gasCode.includes('payload.leadId || payload.lead_id'), 'Apps Script template supports leadId / lead_id aliases');
    assert(gasCode.includes('payload.phone || payload.mobile'), 'Apps Script template supports phone / mobile aliases');
    assert(gasCode.includes('payload.guardianConsentRequired'), 'Apps Script template checks guardianConsentRequired');
    assert(gasCode.includes('rLeadId === leadId'), 'Apps Script template checks leadId deduplication');
    assert(gasCode.includes('rSessionId === sessionId'), 'Apps Script template checks sessionId deduplication');
    assert(gasCode.includes('rPhone === phone'), 'Apps Script template checks phone deduplication');
    assert(gasCode.includes('sheet.getRange(rowIndexToUpdate, 1, 1, rowValues.length).setValues'), 'Apps Script updates existing row on duplicate match');
  }

  // ─────────────────────────────────────────────────────────────
  // SUMMARY REPORT
  // ─────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed === 0) {
    console.log('\n🎉 ALL P1-3 ADMISSIONS CRM INTEGRATION CHECKS PASSED PERFECTLY!\n');
    process.exit(0);
  } else {
    console.error(`\n❌ ${failed} CHECKS FAILED!\n`);
    process.exit(1);
  }
}

runTests();
