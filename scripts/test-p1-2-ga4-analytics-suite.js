/**
 * P1-2 GA4 Analytics & Conversion Measurement Acceptance Test Suite
 * 
 * Verifies:
 * 1. NovaAnalytics unified module API.
 * 2. view_course dispatch on canonical course resolution.
 * 3. select_course dispatch across catalog, academy, and form triggers.
 * 4. career_advisor_complete dispatch with non-PII parameters.
 * 5. form_start dispatch (fires once on first interaction, not on load).
 * 6. generate_lead authoritative lead conversion with full attribution.
 * 7. Deduplication (zero secondary duplicate conversion events).
 * 8. click_whatsapp, click_phone, click_email contact interactions.
 * 9. Absolute PII-scrubbing (names, phones, emails, queries stripped).
 * 10. Developer environment traffic tagging (debug_mode, traffic_type=developer).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

let passedTests = 0;
let failedTests = 0;

function testAssert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
    failedTests++;
  }
}

console.log('================================================================');
console.log('🧪 P1-2 GA4 ANALYTICS & MEASUREMENT ACCEPTANCE TEST SUITE');
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

const capturedEvents = [];

const mockDoc = {
  readyState: 'complete',
  title: 'Nova Skills Test Title',
  addEventListener: () => {},
  removeEventListener: () => {},
  createElement: (tag) => new MockElement(tag),
  getElementById: (id) => new MockElement('div', id),
  querySelector: () => new MockElement('div'),
  querySelectorAll: () => [],
  body: new MockElement('body'),
  documentElement: new MockElement('html')
};

const sandbox = {
  window: {},
  document: mockDoc,
  navigator: { userAgent: 'NodeTest' },
  location: {
    pathname: '/courses.html',
    href: 'https://novaskills.in/courses.html',
    hostname: 'novaskills.in',
    port: '',
    search: '?utm_source=google&utm_medium=cpc&utm_campaign=winter2026'
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
  console: console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  requestAnimationFrame: (cb) => cb(),
  requestIdleCallback: (cb) => cb(),
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, lead_id: 'TEST-1' }) }),
  addEventListener: () => {},
  removeEventListener: () => {},
  URLSearchParams: URLSearchParams
};
sandbox.window = sandbox;

const componentsJs = fs.readFileSync(path.join(__dirname, '..', 'components.js'), 'utf8');
vm.createContext(sandbox);
vm.runInContext(componentsJs, sandbox);

const analytics = sandbox.window.NovaAnalytics;

async function runSuite() {
  console.log('--- 1. Verifying NovaAnalytics Module Export & Interface ---');
  testAssert(typeof analytics === 'object' && analytics !== null, 'NovaAnalytics is exported to window');
  testAssert(typeof analytics.trackEvent === 'function', 'trackEvent method exists');
  testAssert(typeof analytics.trackCourseView === 'function', 'trackCourseView method exists');
  testAssert(typeof analytics.trackCourseSelect === 'function', 'trackCourseSelect method exists');
  testAssert(typeof analytics.trackFormStart === 'function', 'trackFormStart method exists');
  testAssert(typeof analytics.trackLeadGenerated === 'function', 'trackLeadGenerated method exists');
  testAssert(typeof analytics.trackWhatsAppClick === 'function', 'trackWhatsAppClick method exists');
  testAssert(typeof analytics.trackPhoneClick === 'function', 'trackPhoneClick method exists');
  testAssert(typeof analytics.trackEmailClick === 'function', 'trackEmailClick method exists');
  testAssert(typeof analytics.trackCareerAdvisorComplete === 'function', 'trackCareerAdvisorComplete method exists');

  console.log('\n--- 2. Verifying view_course Tracking ---');
  capturedEvents.length = 0;
  const sampleCourse = {
    id: 'ai-mastery',
    name: 'Generative AI & Automation Mastery',
    academy: 'AI & Automation Academy',
    academyId: 'ai'
  };

  analytics.trackCourseView(sampleCourse);
  const vcEvent = capturedEvents.find(e => e.event === 'view_course');
  testAssert(vcEvent !== undefined, 'view_course event is dispatched');
  testAssert(vcEvent.params.course_id === 'ai-mastery', 'view_course carries correct course_id');
  testAssert(vcEvent.params.course_name === 'Generative AI & Automation Mastery', 'view_course carries course_name');
  testAssert(vcEvent.params.academy_id === 'ai', 'view_course carries academy_id');
  testAssert(vcEvent.params.page_type === 'course_detail', 'view_course carries page_type=course_detail');

  // Verify deduplication (does not re-fire on same page for same course)
  const countBefore = capturedEvents.filter(e => e.event === 'view_course').length;
  analytics.trackCourseView(sampleCourse);
  const countAfter = capturedEvents.filter(e => e.event === 'view_course').length;
  testAssert(countBefore === countAfter, 'view_course is deduplicated per course view');

  console.log('\n--- 3. Verifying select_course Tracking ---');
  capturedEvents.length = 0;
  analytics.trackCourseSelect({ id: 'dm-professional', name: 'AI Digital Marketing Specialist', academyId: 'digital-marketing' }, 'catalog_card');
  const scEvent = capturedEvents.find(e => e.event === 'select_course');
  testAssert(scEvent !== undefined, 'select_course event is dispatched');
  testAssert(scEvent.params.course_id === 'dm-professional', 'select_course carries correct course_id');
  testAssert(scEvent.params.selection_source === 'catalog_card', 'select_course carries selection_source');

  console.log('\n--- 4. Verifying career_advisor_complete Tracking & PII Safety ---');
  capturedEvents.length = 0;
  analytics.trackCareerAdvisorComplete({
    recommended_course_id: 'fullstack-foundation',
    recommended_academy_id: 'programming',
    assessment_type: 'ai_interactive_chat'
  });
  const advisorEvent = capturedEvents.find(e => e.event === 'career_advisor_complete');
  testAssert(advisorEvent !== undefined, 'career_advisor_complete event is dispatched');
  testAssert(advisorEvent.params.recommended_course_id === 'fullstack-foundation', 'carries recommended_course_id');
  testAssert(advisorEvent.params.query === undefined, 'Zero query or user input in advisor parameters');

  console.log('\n--- 5. Verifying form_start Tracking (Fires once on first interaction) ---');
  capturedEvents.length = 0;
  const testForm = new MockElement('form', 'demo-booking-form');
  analytics.attachFormStartListener(testForm, 'demo_booking', { course_id: 'dm-professional', academy_id: 'digital-marketing' });

  // Firing focusin triggers form_start
  testForm.dispatchEvent({ type: 'focusin' });
  const fsEvent = capturedEvents.find(e => e.event === 'form_start');
  testAssert(fsEvent !== undefined, 'form_start event fires upon first form field interaction');
  testAssert(fsEvent.params.form_id === 'demo-booking-form', 'form_start carries form_id');
  testAssert(fsEvent.params.form_type === 'demo_booking', 'form_start carries form_type=demo_booking');
  testAssert(fsEvent.params.source_component === 'demo_modal', 'form_start carries source_component');

  // Verify form_start does not fire a second time on subsequent typing
  const fsCountBefore = capturedEvents.filter(e => e.event === 'form_start').length;
  testForm.dispatchEvent({ type: 'input' });
  testForm.dispatchEvent({ type: 'focusin' });
  const fsCountAfter = capturedEvents.filter(e => e.event === 'form_start').length;
  testAssert(fsCountBefore === fsCountAfter, 'form_start does not fire repeatedly on subsequent field interactions');

  console.log('\n--- 6. Verifying click_email Tracking ---');
  capturedEvents.length = 0;
  analytics.trackEmailClick({ button_id: 'footer-email-link', source_component: 'footer_email' });
  const emailEvent = capturedEvents.find(e => e.event === 'click_email');
  testAssert(emailEvent !== undefined, 'click_email event is dispatched');
  testAssert(emailEvent.params.contact_type === 'email', 'click_email carries contact_type=email');
  testAssert(emailEvent.params.email === undefined, 'click_email NEVER carries candidate email address');

  console.log('\n--- 7. Verifying PII Scrubbing in Central Dispatcher ---');
  capturedEvents.length = 0;
  analytics.trackEvent('test_pii_scrub', {
    name: 'Rahul Sharma',
    phone: '9876543210',
    mobile: '9876543210',
    email: 'rahul@gmail.com',
    message: 'I want to join the morning batch',
    query: 'What is the fee?',
    safe_param: 'valid_data'
  });
  const piiTestEvent = capturedEvents.find(e => e.event === 'test_pii_scrub');
  testAssert(piiTestEvent !== undefined, 'test_pii_scrub event is dispatched');
  testAssert(piiTestEvent.params.name === undefined, 'Name is scrubbed from parameters');
  testAssert(piiTestEvent.params.phone === undefined, 'Phone is scrubbed from parameters');
  testAssert(piiTestEvent.params.mobile === undefined, 'Mobile is scrubbed from parameters');
  testAssert(piiTestEvent.params.email === undefined, 'Email is scrubbed from parameters');
  testAssert(piiTestEvent.params.message === undefined, 'Message text is scrubbed from parameters');
  testAssert(piiTestEvent.params.query === undefined, 'Query text is scrubbed from parameters');
  testAssert(piiTestEvent.params.safe_param === 'valid_data', 'Safe non-PII parameters are retained');

  console.log('\n--- 8. Verifying Developer Environment Tagging ---');
  capturedEvents.length = 0;
  sandbox.location.hostname = 'localhost';
  analytics.trackEvent('dev_env_test', { action: 'test' });
  const devEvent = capturedEvents.find(e => e.event === 'dev_env_test');
  testAssert(devEvent.params.traffic_type === 'developer', 'Localhost traffic automatically tagged with traffic_type=developer');
  testAssert(devEvent.params.debug_mode === true, 'Localhost traffic automatically tagged with debug_mode=true');

  console.log('\n--- 9. Verifying Zero Duplicate Secondary Events ---');
  capturedEvents.length = 0;
  const leadSubmitForm = new MockElement('form', 'demo-booking-form');
  const leadSubmitBtn = new MockElement('button', 'demo-submit');

  await sandbox.window.submitNovaForm({
    form: leadSubmitForm,
    submitBtn: leadSubmitBtn,
    data: {
      name: 'Aman Kumar',
      mobile: '9876543210',
      course: 'AI Digital Marketing Specialist',
      course_id: 'dm-professional',
      lead_type: 'free_demo'
    },
    formName: 'free_demo',
    submissionMethod: 'demo_modal'
  });

  const generateLeadEvents = capturedEvents.filter(e => e.event === 'generate_lead');
  testAssert(generateLeadEvents.length === 1, 'generate_lead fired exactly once on backend confirmation');
  testAssert(generateLeadEvents[0].params.form_type === 'demo_booking', 'generate_lead carries standardized form_type=demo_booking');
  testAssert(generateLeadEvents[0].params.course_id === 'dm-professional', 'generate_lead carries course_id');

  const duplicateEvents = capturedEvents.filter(e => e.event === 'free_demo_request_success' || e.event === 'career_counselling_request_success');
  testAssert(duplicateEvents.length === 0, 'Zero secondary duplicate conversion events emitted');

  console.log('\n================================================================');
  console.log(`SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('================================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('\n🎉 ALL P1-2 GA4 ANALYTICS ACCEPTANCE CHECKS PASSED!\n');
  }
}

runSuite().catch(err => {
  console.error('Test suite execution error:', err);
  process.exit(1);
});
