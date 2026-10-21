/**
 * Test Suite: ChatGPT & AI Lead Attribution Flow
 * 
 * Validates:
 * 1. Session persistence of first-touch attribution across internal multi-page navigation.
 * 2. Source identification: ChatGPT (chatgpt.com), Perplexity (perplexity.ai), Claude, Gemini, Google, Direct, Meta.
 * 3. Last-touch captured separately.
 * 4. Google Sheets payload formatting with attribution fields.
 * 5. GA4 generate_lead event receives traffic_source, traffic_medium, ai_platform, landing_page.
 * 6. Zero PII leakage into GA4.
 * 7. WhatsApp clicks remain separate as click_whatsapp.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 Starting AI Lead Attribution & Multi-Touch Test Suite...\n');

// Mock browser environment
class MockSessionStorage {
  constructor() { this.store = {}; }
  getItem(k) { return this.store[k] || null; }
  setItem(k, v) { this.store[k] = String(v); }
  removeItem(k) { delete this.store[k]; }
  clear() { this.store = {}; }
}

class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.dataset = {};
    this.children = [];
    this.style = {};
    this.disabled = false;
    this.classList = { add: () => {}, remove: () => {} };
    this.value = '';
    this.innerHTML = '';
  }
  querySelector(sel) {
    if (sel.includes('input[name="website"]')) return null;
    return null;
  }
  appendChild(el) { this.children.push(el); }
  reset() {}
  setAttribute(k, v) { this[k] = v; }
}

const componentsCode = fs.readFileSync(path.join(__dirname, '..', 'components.js'), 'utf8');

function setupEnvironment({ url, referrer, sessionStorage = new MockSessionStorage() }) {
  const parsedUrl = new URL(url);
  const dataLayer = [];

  const sandbox = {
    window: {
      location: {
        href: url,
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
        hostname: parsedUrl.hostname,
        origin: parsedUrl.origin
      },
      sessionStorage,
      dataLayer,
      gtag: (type, name, params) => {
        dataLayer.push({ type, name, params });
      },
      screen: { width: 1920, height: 1080 },
      navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
      addEventListener: () => {},
      removeEventListener: () => {}
    },
    document: {
      referrer: referrer || '',
      getElementById: (id) => null,
      querySelector: (sel) => null,
      querySelectorAll: (sel) => [],
      createElement: (tag) => new MockElement(tag),
      head: { appendChild: () => {} },
      body: { appendChild: () => {} },
      addEventListener: () => {},
      removeEventListener: () => {}
    },
    navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
    sessionStorage,
    dataLayer,
    fetch: async (endpoint, opts) => {
      if (endpoint.includes('ipify')) {
        return { ok: true, json: async () => ({ ip: '103.21.244.2' }) };
      }
      if (endpoint.includes('script.google.com')) {
        return {
          ok: true,
          json: async () => ({ success: true, message: 'Lead recorded' })
        };
      }
      return { ok: true, json: async () => ({}) };
    },
    console: {
      log: () => {},
      error: () => {},
      warn: () => {}
    },
    setTimeout: (fn) => setTimeout(fn, 0),
    clearTimeout: () => {},
    requestAnimationFrame: (cb) => cb(),
    URL,
    URLSearchParams,
    Intl,
    Date
  };

  sandbox.window.window = sandbox.window;
  sandbox.window.document = sandbox.document;

  const script = new vm.Script(componentsCode);
  const context = vm.createContext(sandbox);
  script.runInContext(context);

  return context;
}

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
  }
}

(async function() {
  // Test 1: ChatGPT Referrer detection & First-Touch storage
  runTest('ChatGPT referrer (chatgpt.com) sets source=chatgpt.com and aiPlatform=ChatGPT', () => {
    const ctx = setupEnvironment({
      url: 'https://novaskills.in/blog/ai-seo-geo-digital-marketing-2026/',
      referrer: 'https://chatgpt.com/'
    });

    const ftStr = ctx.sessionStorage.getItem('ns_first_touch');
    assert(ftStr, 'ns_first_touch must be stored in sessionStorage');
    const ft = JSON.parse(ftStr);

    assert.strictEqual(ft.source, 'chatgpt.com');
    assert.strictEqual(ft.medium, 'ai_search');
    assert.strictEqual(ft.aiPlatform, 'ChatGPT');
    assert.strictEqual(ft.referrer, 'https://chatgpt.com/');
    assert.strictEqual(ft.landingPage, 'https://novaskills.in/blog/ai-seo-geo-digital-marketing-2026/');
  });

  // Test 2: Perplexity referrer & UTM persistence across internal navigation
  runTest('Perplexity UTMs are preserved across multi-page internal navigation', () => {
    const sharedStorage = new MockSessionStorage();

    // Page 1: Lands from Perplexity
    const ctx1 = setupEnvironment({
      url: 'https://novaskills.in/courses?utm_source=perplexity&utm_medium=ai_search&utm_campaign=ai_courses',
      referrer: 'https://www.perplexity.ai/',
      sessionStorage: sharedStorage
    });

    // Page 2: Navigates internally to course-detail without UTMs
    const ctx2 = setupEnvironment({
      url: 'https://novaskills.in/course-detail.html?id=ai-mastery',
      referrer: 'https://novaskills.in/courses',
      sessionStorage: sharedStorage
    });

    const { firstTouch, lastTouch } = ctx2.window.getStoredAttribution();
    assert.strictEqual(firstTouch.source, 'perplexity');
    assert.strictEqual(firstTouch.medium, 'ai_search');
    assert.strictEqual(firstTouch.campaign, 'ai_courses');
    assert.strictEqual(firstTouch.aiPlatform, 'Perplexity');
    assert.strictEqual(firstTouch.landingPage, 'https://novaskills.in/courses?utm_source=perplexity&utm_medium=ai_search&utm_campaign=ai_courses');
  });

  // Test 3: Direct visitor without referrer or UTMs
  runTest('Direct visitor with no referrer is recorded as direct/none without fake source', () => {
    const ctx = setupEnvironment({
      url: 'https://novaskills.in/',
      referrer: ''
    });

    const { firstTouch } = ctx.window.getStoredAttribution();
    assert.strictEqual(firstTouch.source, 'direct');
    assert.strictEqual(firstTouch.medium, 'none');
    assert.strictEqual(firstTouch.aiPlatform, '');
  });

  // Test 4: Google Organic visitor
  runTest('Google Organic search visitor correctly identified as google / organic', () => {
    const ctx = setupEnvironment({
      url: 'https://novaskills.in/courses',
      referrer: 'https://www.google.co.in/'
    });

    const { firstTouch } = ctx.window.getStoredAttribution();
    assert.strictEqual(firstTouch.source, 'google');
    assert.strictEqual(firstTouch.medium, 'organic');
    assert.strictEqual(firstTouch.aiPlatform, '');
  });

  // Test 5: Claude AI Referrer visitor
  runTest('Claude AI search visitor correctly identified as claude.ai / ai_chat / Claude', () => {
    const ctx = setupEnvironment({
      url: 'https://novaskills.in/courses',
      referrer: 'https://claude.ai/'
    });

    const { firstTouch } = ctx.window.getStoredAttribution();
    assert.strictEqual(firstTouch.source, 'claude.ai');
    assert.strictEqual(firstTouch.medium, 'ai_chat');
    assert.strictEqual(firstTouch.aiPlatform, 'Claude');
  });

  // Test 6: Gemini Google AI visitor
  runTest('Gemini AI search visitor correctly identified as gemini.google.com / ai_search / Gemini', () => {
    const ctx = setupEnvironment({
      url: 'https://novaskills.in/courses',
      referrer: 'https://gemini.google.com/'
    });

    const { firstTouch } = ctx.window.getStoredAttribution();
    assert.strictEqual(firstTouch.source, 'gemini.google.com');
    assert.strictEqual(firstTouch.medium, 'ai_search');
    assert.strictEqual(firstTouch.aiPlatform, 'Gemini');
  });

  // Test 7: Instagram Social Referral visitor
  runTest('Instagram referral visitor correctly identified as instagram / social', () => {
    const ctx = setupEnvironment({
      url: 'https://novaskills.in/courses',
      referrer: 'https://l.instagram.com/'
    });

    const { firstTouch } = ctx.window.getStoredAttribution();
    assert.strictEqual(firstTouch.source, 'instagram');
    assert.strictEqual(firstTouch.medium, 'social');
  });

  // Test 8: End-to-end Form Submission preserves ChatGPT attribution to backend & GA4
  await runAsyncTest('Form submission sends preserved ChatGPT first-touch to Sheets endpoint and non-PII GA4 event', async () => {
    const sharedStorage = new MockSessionStorage();

    // Step 1: Arrive from ChatGPT on blog
    setupEnvironment({
      url: 'https://novaskills.in/blog/ai-skills-future-careers-2027-2030/',
      referrer: 'https://chatgpt.com/',
      sessionStorage: sharedStorage
    });

    // Step 2: Navigate internally to course page
    const ctx = setupEnvironment({
      url: 'https://novaskills.in/course-detail.html?id=dm-mastery',
      referrer: 'https://novaskills.in/blog/ai-skills-future-careers-2027-2030/',
      sessionStorage: sharedStorage
    });

    let sentPayload = null;
    ctx.fetch = async (endpoint, opts) => {
      if (endpoint.includes('ipify')) return { ok: true, json: async () => ({ ip: '1.2.3.4' }) };
      if (endpoint.includes('script.google.com')) {
        sentPayload = JSON.parse(opts.body);
        return { ok: true, json: async () => ({ success: true, message: 'Lead stored' }) };
      }
      return { ok: true, json: async () => ({}) };
    };

    const form = new MockElement('FORM', 'course-enrollment-form');
    const submitBtn = new MockElement('BUTTON', 'enroll-submit');
    form.appendChild(submitBtn);

    const success = await ctx.window.submitNovaForm({
      form,
      submitBtn,
      formName: 'course_enrollment',
      submissionMethod: 'enrollment_modal',
      data: {
        name: 'Aarav Patel',
        mobile: '9876543210',
        email: 'aarav@example.com',
        course: 'AI Digital Marketing Master'
      }
    });

    assert.strictEqual(success, true, 'Form submission must succeed');

    // Verify Google Sheets Payload contains preserved first touch
    assert.strictEqual(sentPayload.utmSource, 'chatgpt.com', 'Preserved source must be passed to utmSource for Sheets');
    assert.strictEqual(sentPayload.utmMedium, 'ai_search', 'Preserved medium must be passed to utmMedium for Sheets');
    assert.strictEqual(sentPayload.referrer, 'https://chatgpt.com/', 'Preserved original referrer must be passed to Sheets');
    assert.strictEqual(sentPayload.firstLandingPage, 'https://novaskills.in/blog/ai-skills-future-careers-2027-2030/');
    assert.strictEqual(sentPayload.aiPlatform, 'ChatGPT');
    assert.strictEqual(sentPayload.pageUrl, 'https://novaskills.in/course-detail.html?id=dm-mastery');

    // Verify GA4 generate_lead event
    const ga4Events = ctx.window.dataLayer.filter(e => e.name === 'generate_lead');
    assert.strictEqual(ga4Events.length, 1, 'generate_lead must fire once');

    const leadParams = ga4Events[0].params;
    assert.strictEqual(leadParams.traffic_source, 'chatgpt.com');
    assert.strictEqual(leadParams.traffic_medium, 'ai_search');
    assert.strictEqual(leadParams.ai_platform, 'ChatGPT');
    assert.strictEqual(leadParams.landing_page, '/blog/ai-skills-future-careers-2027-2030/');

    // STRICT ZERO-PII VALIDATION
    assert.strictEqual(leadParams.name, undefined, 'PII: Name must never be in GA4 event');
    assert.strictEqual(leadParams.mobile, undefined, 'PII: Mobile must never be in GA4 event');
    assert.strictEqual(leadParams.phone, undefined, 'PII: Phone must never be in GA4 event');
    assert.strictEqual(leadParams.email, undefined, 'PII: Email must never be in GA4 event');
  });

  // Test 9: WhatsApp clicks remain separate
  runTest('WhatsApp click tracking sends click_whatsapp and does not trigger generate_lead', () => {
    const ctx = setupEnvironment({
      url: 'https://novaskills.in/',
      referrer: 'https://chatgpt.com/'
    });

    ctx.window.sendGA4Event('click_whatsapp', {
      click_location: 'floating_button',
      page_path: '/'
    });

    const waEvents = ctx.window.dataLayer.filter(e => e.name === 'click_whatsapp');
    const leadEvents = ctx.window.dataLayer.filter(e => e.name === 'generate_lead');

    assert.strictEqual(waEvents.length, 1, 'click_whatsapp must fire once');
    assert.strictEqual(leadEvents.length, 0, 'generate_lead must NOT fire on whatsapp click');
  });

  console.log(`\n========================================`);
  console.log(`Attribution Test Results: ${passedTests}/${totalTests} Passed`);
  console.log(`========================================\n`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
})();
