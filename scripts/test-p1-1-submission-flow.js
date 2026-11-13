/**
 * P1-1 End-to-End Submission Flow Verification
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('================================================================');
console.log('🧪 P1-1 LEAD FORMS SUBMISSION FLOW TEST');
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
      toggle(c, force) { if (force !== undefined) force ? this.add(c) : this.remove(c); else this._classes.has(c) ? this.remove(c) : this.add(c); },
      contains(c) { return this._classes.has(c); }
    };
    this.value = '';
    this.innerHTML = '';
    this.textContent = '';
    this.listeners = {};
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
  trigger(evt, eventObj = {}) {
    if (this.listeners[evt]) {
      this.listeners[evt].forEach(fn => fn(eventObj));
    }
  }
  querySelector(sel) {
    if (sel.includes('input[name="website"]')) return new MockElement('input', 'website');
    return null;
  }
  querySelectorAll() { return []; }
  appendChild(el) { this.children.push(el); }
  insertAdjacentHTML() {}
  reset() {}
  focus() {}
  setAttribute(k, v) { this[k] = v; }
  getAttribute(k) { return this[k] || null; }
  removeAttribute(k) { delete this[k]; }
}

const mockDoc = {
  readyState: 'complete',
  addEventListener: () => {},
  removeEventListener: () => {},
  createElement: (tag) => new MockElement(tag),
  getElementById: (id) => new MockElement('div', id),
  querySelector: () => new MockElement('div'),
  querySelectorAll: () => [],
  body: new MockElement('body'),
  documentElement: new MockElement('html')
};

let capturedLeadPayload = null;
let capturedGA4Events = [];

const sandbox = {
  window: {},
  document: mockDoc,
  navigator: { userAgent: 'NodeTest' },
  location: { pathname: '/courses.html', search: '?utm_source=test&utm_medium=cpc', hostname: 'novaskills.in', href: 'https://novaskills.in/courses.html' },
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
    if (cmd === 'event') capturedGA4Events.push({ event: name, params });
  },
  URLSearchParams: URLSearchParams,
  console: console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  requestAnimationFrame: (cb) => cb(),
  requestIdleCallback: (cb) => cb(),
  fetch: (url, opts) => {
    capturedLeadPayload = JSON.parse(opts.body);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, lead_id: 'TEST-123' })
    });
  },
  addEventListener: () => {},
  removeEventListener: () => {}
};
sandbox.window = sandbox;

const componentsJs = fs.readFileSync(path.join(__dirname, '..', 'components.js'), 'utf8');
vm.createContext(sandbox);
vm.runInContext(componentsJs, sandbox);

async function runTests() {
  console.log('--- Testing Form A (Free Demo) Submission ---');
  const demoForm = new MockElement('form', 'demo-booking-form');
  const demoBtn = new MockElement('button', 'demo-submit-btn');

  const demoData = {
    name: 'Vikram Singh',
    mobile: '9876543210',
    email: 'vikram@example.com',
    course: 'AI Digital Marketing Specialist',
    course_id: 'dm-professional',
    academy: 'Digital Marketing Academy',
    city: 'Siddharth Nagar',
    learning_mode: 'Classroom',
    lead_type: 'free_demo',
    message: '[2-DAY FREE DEMO] Preferred Batch: Morning',
    website: ''
  };

  const demoSuccess = await sandbox.window.submitNovaForm({
    form: demoForm,
    submitBtn: demoBtn,
    data: demoData,
    formName: 'free_demo',
    submissionMethod: 'demo_modal',
    loadingText: 'Submitting Demo Request...'
  });

  assert.strictEqual(demoSuccess, true, 'Form A submitNovaForm returned true');
  assert.strictEqual(capturedLeadPayload.lead_type, 'free_demo', 'Payload lead_type is free_demo');
  assert.strictEqual(capturedLeadPayload.course_id, 'dm-professional', 'Payload course_id is dm-professional');
  assert.strictEqual(capturedLeadPayload.learning_mode, 'Classroom', 'Payload learning_mode is Classroom');
  assert.strictEqual(sandbox.localStorage.getItem('novaskills_demo_requests'), null, 'Zero PII stored in localStorage');

  const demoGA4 = capturedGA4Events.find(e => e.event === 'generate_lead' && e.params.form_name === 'free_demo');
  assert(demoGA4, 'GA4 generate_lead fired for free_demo');
  assert.strictEqual(demoGA4.params.submission_method, 'demo_modal', 'GA4 submission_method is demo_modal');
  assert.strictEqual(demoGA4.params.phone, undefined, 'GA4 does not leak phone number');
  assert.strictEqual(demoGA4.params.name, undefined, 'GA4 does not leak candidate name');
  console.log('  ✅ PASS: Form A submits with lead_type=free_demo, correct fields, and safe GA4');

  console.log('\n--- Testing Form B (Career Counselling) Submission ---');
  capturedLeadPayload = null;
  const counselForm = new MockElement('form', 'counselling-booking-form');
  const counselBtn = new MockElement('button', 'counselling-submit-btn');

  const counselData = {
    name: 'Pooja Verma',
    mobile: '9123456789',
    email: '',
    course: 'Not Sure — Help Me Choose a Course',
    lead_type: 'free_consultation',
    learning_mode: 'Flexible / Need Advice',
    city: 'Lucknow',
    message: '[CAREER COUNSELLING] Need advice on non-tech career shift',
    website: ''
  };

  const counselSuccess = await sandbox.window.submitNovaForm({
    form: counselForm,
    submitBtn: counselBtn,
    data: counselData,
    formName: 'career_counselling',
    submissionMethod: 'counselling_modal',
    loadingText: 'Booking Counselling Session...'
  });

  assert.strictEqual(counselSuccess, true, 'Form B submitNovaForm returned true');
  assert.strictEqual(capturedLeadPayload.lead_type, 'free_consultation', 'Payload lead_type is free_consultation');
  assert.strictEqual(capturedLeadPayload.course, 'Not Sure — Help Me Choose a Course', 'Payload course preserved as Not Sure');
  assert.strictEqual(capturedLeadPayload.email, '', 'Optional empty email accepted');

  const counselGA4 = capturedGA4Events.find(e => e.event === 'generate_lead' && e.params.form_name === 'career_counselling');
  assert(counselGA4, 'GA4 generate_lead fired for career_counselling');
  assert.strictEqual(counselGA4.params.submission_method, 'counselling_modal', 'GA4 submission_method is counselling_modal');
  assert.strictEqual(counselGA4.params.phone, undefined, 'GA4 does not leak phone number');
  console.log('  ✅ PASS: Form B submits with lead_type=free_consultation, Not Sure course, and safe GA4');

  console.log('\n================================================================');
  console.log('🎉 ALL FORM SUBMISSION FLOW CHECKS PASSED PERFECTLY!');
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
