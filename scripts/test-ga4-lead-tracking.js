/**
 * GA4 Lead Tracking & Conversion Test Suite for Nova Skills
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Simple DOM Mock for Node testing
class MockElement {
  constructor(tagName, id = '', className = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.className = className;
    this.classList = {
      contains: (cls) => this.className.split(/\s+/).includes(cls),
      add: (cls) => { if (!this.classList.contains(cls)) this.className = (this.className + ' ' + cls).trim(); },
      remove: (cls) => { this.className = this.className.split(/\s+/).filter(c => c !== cls).join(' '); }
    };
    this.attributes = {};
    if (id) this.attributes.id = id;
    if (className) this.attributes.class = className;
    this.dataset = {};
    this.style = {};
    this.children = [];
    this.parentNode = null;
    this.listeners = {};
    this.value = '';
    this.innerHTML = '';
    this.disabled = false;
  }

  setAttribute(name, val) {
    this.attributes[name] = String(val);
    if (name === 'id') this.id = val;
    if (name === 'class') this.className = val;
  }

  getAttribute(name) {
    return this.attributes[name] !== undefined ? this.attributes[name] : null;
  }

  hasAttribute(name) {
    return this.attributes[name] !== undefined;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    this.children = this.children.filter(c => c !== child);
  }

  querySelector(selector) {
    if (selector.startsWith('#')) {
      const targetId = selector.slice(1);
      if (this.id === targetId) return this;
      for (const child of this.children) {
        const found = child.querySelector(selector);
        if (found) return found;
      }
      return null;
    }
    if (selector.startsWith('.')) {
      const cls = selector.slice(1);
      if (this.classList.contains(cls)) return this;
      for (const child of this.children) {
        const found = child.querySelector(selector);
        if (found) return found;
      }
      return null;
    }
    const tag = selector.split('[')[0].toUpperCase();
    if (tag && this.tagName === tag) return this;
    for (const child of this.children) {
      const found = child.querySelector(selector);
      if (found) return found;
    }
    return null;
  }

  querySelectorAll(selector) {
    const results = [];
    if (selector.includes('tel:')) {
      if ((this.attributes.href || '').startsWith('tel:')) results.push(this);
    } else if (selector.includes('wa.me')) {
      if ((this.attributes.href || '').includes('wa.me')) results.push(this);
    }
    for (const child of this.children) {
      results.push(...child.querySelectorAll(selector));
    }
    return results;
  }

  closest(selector) {
    let curr = this;
    const selectors = selector.split(',').map(s => s.trim());
    while (curr) {
      for (const s of selectors) {
        if (s.startsWith('#') && curr.id === s.slice(1)) return curr;
        if (s.startsWith('.') && curr.classList.contains(s.slice(1))) return curr;
        if (curr.tagName === s.toUpperCase()) return curr;
      }
      curr = curr.parentNode;
    }
    return null;
  }

  addEventListener(type, fn, opts) {
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(fn);
  }

  dispatchEvent(event) {
    event.target = this;
    let curr = this;
    while (curr) {
      const list = curr.listeners[event.type] || [];
      for (const fn of list) {
        fn(event);
      }
      curr = curr.parentNode;
    }
  }

  reset() {
    this.value = '';
    for (const child of this.children) {
      child.reset?.();
    }
  }

  focus() {}
}

class MockDocument extends MockElement {
  constructor() {
    super('DOCUMENT');
    this.body = new MockElement('BODY');
    this.head = new MockElement('HEAD');
    this.appendChild(this.head);
    this.appendChild(this.body);
    this.readyState = 'complete';
  }

  createElement(tag) {
    return new MockElement(tag);
  }

  getElementById(id) {
    return this.querySelector('#' + id);
  }
}

// Setup Global Environment
const doc = new MockDocument();
global.document = doc;
global.window = {
  document: doc,
  location: { pathname: '/courses.html', href: 'https://novaskills.in/courses.html' },
  dataLayer: [],
  gtag: function(type, name, params) {
    global.window.dataLayer.push({ type, name, params });
  },
  screen: { width: 1920, height: 1080 },
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.navigator = { userAgent: 'Mozilla/5.0 NodeTest' };
global.screen = { width: 1920, height: 1080 };
global.requestAnimationFrame = fn => setTimeout(fn, 0);
global.sessionStorage = { getItem: () => null, setItem: () => {} };
global.localStorage = { getItem: () => '[]', setItem: () => {} };

// Load components.js
const componentsCode = fs.readFileSync(path.join(__dirname, '..', 'components.js'), 'utf8');
eval(componentsCode);

async function runTests() {
  console.log('🧪 Starting GA4 Lead & Click Tracking Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function test(desc, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${desc}`);
      console.error('    Error:', err.message);
      failed++;
    }
  }

  async function testAsync(desc, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${desc}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${desc}`);
      console.error('    Error:', err.message);
      failed++;
    }
  }

  // --- TEST 1: WhatsApp Click Tracking ---
  test('Clicking floating WhatsApp button triggers click_whatsapp with correct non-PII params', () => {
    window.dataLayer = [];
    const waFloat = new MockElement('A', 'whatsapp-btn', 'whatsapp-float');
    waFloat.setAttribute('href', 'https://wa.me/919695904440?text=Hello');
    doc.body.appendChild(waFloat);

    let defaultPrevented = false;
    const evt = { type: 'click', target: waFloat, preventDefault: () => { defaultPrevented = true; } };
    waFloat.dispatchEvent(evt);

    const waEvent = window.dataLayer.find(e => e.name === 'click_whatsapp');
    assert(waEvent, 'click_whatsapp event must be dispatched');
    assert.strictEqual(waEvent.params.button_id, 'whatsapp-btn');
    assert.strictEqual(waEvent.params.link_type, 'floating_button');
    assert.strictEqual(waEvent.params.page_path, '/courses.html');
    assert.strictEqual(defaultPrevented, false, 'Link navigation must not be prevented');
  });

  // --- TEST 2: Footer WhatsApp Click Tracking ---
  test('Clicking footer WhatsApp link triggers click_whatsapp as footer_link', () => {
    window.dataLayer = [];
    const footer = new MockElement('FOOTER', 'footer');
    const waFooter = new MockElement('A', 'footer-whatsapp-link', 'social-link');
    waFooter.setAttribute('href', 'https://wa.me/919695904440');
    footer.appendChild(waFooter);
    doc.body.appendChild(footer);

    waFooter.dispatchEvent({ type: 'click', target: waFooter, preventDefault: () => {} });

    const waEvent = window.dataLayer.find(e => e.name === 'click_whatsapp');
    assert(waEvent, 'click_whatsapp event must be dispatched');
    assert.strictEqual(waEvent.params.button_id, 'footer-whatsapp-link');
    assert.strictEqual(waEvent.params.link_type, 'footer_link');
  });

  // --- TEST 3: Phone Click Tracking (tel:) ---
  test('Clicking tel: link triggers click_phone and NEVER sends phone number parameter', () => {
    window.dataLayer = [];
    const footer = doc.getElementById('footer') || doc.body.appendChild(new MockElement('FOOTER', 'footer'));
    const phoneLink = new MockElement('A', 'footer-phone-link');
    phoneLink.setAttribute('href', 'tel:+919695904440');
    footer.appendChild(phoneLink);

    let defaultPrevented = false;
    phoneLink.dispatchEvent({ type: 'click', target: phoneLink, preventDefault: () => { defaultPrevented = true; } });

    const phoneEvent = window.dataLayer.find(e => e.name === 'click_phone');
    assert(phoneEvent, 'click_phone event must be dispatched');
    assert.strictEqual(phoneEvent.params.button_id, 'footer-phone-link');
    assert.strictEqual(phoneEvent.params.page_path, '/courses.html');
    assert.strictEqual(phoneEvent.params.phone, undefined, 'Phone number must NOT be in event params');
    assert.strictEqual(phoneEvent.params.tel, undefined, 'Telephone number must NOT be in event params');
    assert.strictEqual(defaultPrevented, false, 'Dialer opening must not be blocked');
  });

  // --- TEST 4: Lead Generation - Failed API submission ---
  await testAsync('Failed backend API response does NOT trigger generate_lead', async () => {
    window.dataLayer = [];
    const form = new MockElement('FORM', 'counselling-form');
    const btn = new MockElement('BUTTON', 'counselling-submit');
    form.appendChild(btn);

    // Mock global fetch to simulate failed response
    global.fetch = async () => ({
      ok: false,
      status: 500,
      json: async () => ({ success: false, message: 'Internal Server Error' })
    });

    const success = await window.submitNovaForm({
      form,
      submitBtn: btn,
      data: { name: 'Test User', mobile: '9876543210', course: 'AI Mastery' }
    });

    assert.strictEqual(success, false, 'submitNovaForm must return false on failed backend');
    const leadEvent = window.dataLayer.find(e => e.name === 'generate_lead');
    assert(!leadEvent, 'generate_lead event MUST NOT be fired when submission fails');
  });

  // --- TEST 5: Lead Generation - Spam / Honeypot blocked ---
  await testAsync('Server-side spam detection (json.success=false) does NOT trigger generate_lead', async () => {
    window.dataLayer = [];
    const form = new MockElement('FORM', 'counselling-form');
    const btn = new MockElement('BUTTON', 'counselling-submit');
    form.appendChild(btn);

    global.fetch = async () => ({
      ok: true,
      json: async () => ({ success: false, message: 'Spam detected.' })
    });

    const success = await window.submitNovaForm({
      form,
      submitBtn: btn,
      data: { name: 'Spam Bot', mobile: '9876543210', website: 'spam-link.com' }
    });

    assert.strictEqual(success, false, 'submitNovaForm must return false when spam detected');
    const leadEvent = window.dataLayer.find(e => e.name === 'generate_lead');
    assert(!leadEvent, 'generate_lead event MUST NOT be fired when spam is detected');
  });

  // --- TEST 6: Lead Generation - Confirmed Backend Success ---
  await testAsync('Confirmed backend success triggers generate_lead exactly once with non-PII params', async () => {
    window.dataLayer = [];
    const form = new MockElement('FORM', 'counselling-form');
    const btn = new MockElement('BUTTON', 'counselling-submit');
    form.appendChild(btn);

    global.fetch = async () => ({
      ok: true,
      json: async () => ({ success: true, leadId: 'NS-2026-001', message: 'Enquiry submitted successfully.' })
    });

    const success = await window.submitNovaForm({
      form,
      submitBtn: btn,
      formName: 'counselling_form',
      submissionMethod: 'inline_counselling_form',
      data: {
        name: 'Rahul Sharma',
        mobile: '9876543210',
        email: 'rahul@example.com',
        course: 'AI Digital Marketing Master'
      }
    });

    assert.strictEqual(success, true, 'submitNovaForm must return true on confirmed success');
    const leadEvents = window.dataLayer.filter(e => e.name === 'generate_lead');
    assert.strictEqual(leadEvents.length, 1, 'generate_lead must fire EXACTLY ONCE');

    const leadEvent = leadEvents[0];
    assert.strictEqual(leadEvent.params.form_name, 'counselling_form');
    assert.strictEqual(leadEvent.params.course_name, 'AI Digital Marketing Master');
    assert.strictEqual(leadEvent.params.submission_method, 'inline_counselling_form');
    assert.strictEqual(leadEvent.params.page_path, '/courses.html');

    // STRICT PII CHECK
    assert.strictEqual(leadEvent.params.name, undefined, 'PII Violation: Name must not be in event');
    assert.strictEqual(leadEvent.params.mobile, undefined, 'PII Violation: Mobile must not be in event');
    assert.strictEqual(leadEvent.params.phone, undefined, 'PII Violation: Phone must not be in event');
    assert.strictEqual(leadEvent.params.email, undefined, 'PII Violation: Email must not be in event');
  });

  // --- TEST 7: Duplicate Submission Protection ---
  await testAsync('Submitting form while in submitting state is blocked and does not fire duplicate event', async () => {
    window.dataLayer = [];
    const form = new MockElement('FORM', 'counselling-form');
    const btn = new MockElement('BUTTON', 'counselling-submit');
    form.appendChild(btn);

    // Simulate already submitting
    form.dataset.submitting = 'true';
    btn.disabled = true;

    const success = await window.submitNovaForm({
      form,
      submitBtn: btn,
      data: { name: 'Rahul', mobile: '9876543210' }
    });

    assert.strictEqual(success, false, 'Concurrent submission must be blocked');
    const leadEvents = window.dataLayer.filter(e => e.name === 'generate_lead');
    assert.strictEqual(leadEvents.length, 0, 'No lead event should be dispatched on blocked submission');
  });

  // --- TEST 8: Course Enrollment Modal Lead Generation ---
  await testAsync('Course enrollment modal triggers generate_lead with course_enrollment form_name', async () => {
    window.dataLayer = [];
    const form = new MockElement('FORM', 'course-enrollment-form');
    const btn = new MockElement('BUTTON', 'enroll-submit');
    form.appendChild(btn);

    global.fetch = async () => ({
      ok: true,
      json: async () => ({ success: true, leadId: 'NS-2026-002', message: 'Enquiry recorded.' })
    });

    const success = await window.submitNovaForm({
      form,
      submitBtn: btn,
      formName: 'course_enrollment',
      submissionMethod: 'enrollment_modal',
      data: {
        name: 'Aman Singh',
        mobile: '9876543211',
        email: 'aman@example.com',
        course: 'Python Full Stack'
      }
    });

    assert.strictEqual(success, true);
    const leadEvents = window.dataLayer.filter(e => e.name === 'generate_lead');
    assert.strictEqual(leadEvents.length, 1);
    assert.strictEqual(leadEvents[0].params.form_name, 'course_enrollment');
    assert.strictEqual(leadEvents[0].params.submission_method, 'enrollment_modal');
    assert.strictEqual(leadEvents[0].params.course_name, 'Python Full Stack');
  });

  // --- TEST 9: Consultation Popup Modal Lead Generation ---
  await testAsync('Consultation popup modal triggers generate_lead with consultation_popup form_name', async () => {
    window.dataLayer = [];
    const form = new MockElement('FORM', 'popup-form');
    const btn = new MockElement('BUTTON', 'popup-submit');
    form.appendChild(btn);

    global.fetch = async () => ({
      ok: true,
      json: async () => ({ success: true, leadId: 'NS-2026-003', message: 'Enquiry recorded.' })
    });

    const success = await window.submitNovaForm({
      form,
      submitBtn: btn,
      data: {
        name: 'Priya',
        mobile: '9876543212',
        course: 'UI/UX Design'
      }
    });

    assert.strictEqual(success, true);
    const leadEvents = window.dataLayer.filter(e => e.name === 'generate_lead');
    assert.strictEqual(leadEvents.length, 1);
    assert.strictEqual(leadEvents[0].params.form_name, 'consultation_popup');
    assert.strictEqual(leadEvents[0].params.submission_method, 'consultation_popup_modal');
    assert.strictEqual(leadEvents[0].params.course_name, 'UI/UX Design');
  });

  // --- TEST 10: Non-lead form (Comment/Newsletter) does not fire generate_lead ---
  await testAsync('Newsletter form does NOT trigger generate_lead', async () => {
    window.dataLayer = [];
    const form = new MockElement('FORM', 'sidebar-newsletter-form');
    const btn = new MockElement('BUTTON', 'newsletter-submit');
    form.appendChild(btn);

    global.fetch = async () => ({
      ok: true,
      json: async () => ({ success: true, message: 'Subscribed.' })
    });

    const success = await window.submitNovaForm({
      form,
      submitBtn: btn,
      data: { email: 'subscriber@example.com' }
    });

    assert.strictEqual(success, true);
    const leadEvents = window.dataLayer.filter(e => e.name === 'generate_lead');
    assert.strictEqual(leadEvents.length, 0, 'Newsletter form must not fire generate_lead');
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
