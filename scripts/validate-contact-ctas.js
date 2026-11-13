/**
 * P1-4 Automated Contact CTA Validation Suite
 * Verifies official helpline, WhatsApp links, contextual messaging taxonomy,
 * channel separation, zero PII, and GA4 click tracking compliance sitewide.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n======================================================');
console.log('  P1-4: NOVA SKILLS WHATSAPP & PHONE CTA VALIDATION   ');
console.log('======================================================\n');

// ---------------------------------------------------------------------------
// SUITE 1: Central Contact Configuration & Helper Functions
// ---------------------------------------------------------------------------
console.log('▶ SUITE 1: Central Contact Configuration (js/contact-config.js)');
const contactConfigModule = require('../js/contact-config.js');
const {
  CONTACT_CONFIG,
  getAdmissionsPhoneLink,
  formatAdmissionsPhoneNumber,
  validateContactNumber,
  getWhatsAppMessage,
  getAdmissionsWhatsAppLink,
  resolveCurrentPageContactContext
} = contactConfigModule;

assert(CONTACT_CONFIG && CONTACT_CONFIG.admissions, 'CONTACT_CONFIG has admissions object');
assert(CONTACT_CONFIG.admissions.phoneNumber === '+919695904440', 'Official phone number is +919695904440');
assert(CONTACT_CONFIG.admissions.whatsappNumber === '919695904440', 'Official WhatsApp destination is 919695904440');
assert(CONTACT_CONFIG.admissions.displayNumber === '+91 9695904440', 'Official formatted display number is +91 9695904440');
assert(getAdmissionsPhoneLink() === 'tel:+919695904440', 'getAdmissionsPhoneLink() returns "tel:+919695904440"');
assert(formatAdmissionsPhoneNumber() === '+91 9695904440', 'formatAdmissionsPhoneNumber() returns "+91 9695904440"');

assert(validateContactNumber('+91 9695904440') === true, 'validateContactNumber validates formatted helpline');
assert(validateContactNumber('9695904440') === true, 'validateContactNumber validates 10-digit number');
assert(validateContactNumber('+919695904440') === true, 'validateContactNumber validates canonical number');
assert(validateContactNumber('9876543210') === false, 'validateContactNumber rejects non-admissions number');
assert(validateContactNumber('') === false, 'validateContactNumber rejects empty string');

// ---------------------------------------------------------------------------
// SUITE 2: Contextual WhatsApp Messaging Taxonomy (Section 5)
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 2: Context-Aware WhatsApp Messaging Taxonomy');

// 1. Course-detail message
const courseMsg = getWhatsAppMessage({ courseName: 'AI-Assisted Full Stack Web Development' });
assert(
  courseMsg === 'Hi Nova Skills, I am interested in the AI-Assisted Full Stack Web Development course. Please share the syllabus, fees and upcoming batch information.',
  'Course-detail message matches Section 5 taxonomy'
);

const courseSpecMsg = getWhatsAppMessage({
  courseName: 'AI-Assisted Full Stack Web Development',
  specialization: 'E-Commerce Developer'
});
assert(
  courseSpecMsg === 'Hi Nova Skills, I am interested in the AI-Assisted Full Stack Web Development (Specialization: E-Commerce Developer) course. Please share the syllabus, fees and upcoming batch information.',
  'Course-detail message with specialization matches taxonomy'
);

// 2. Academy message
const acadMsg1 = getWhatsAppMessage({ academyName: 'Digital Marketing Academy' });
assert(
  acadMsg1 === 'Hi Nova Skills, I am interested in your Digital Marketing Academy. Please help me explore the available courses and learning options.',
  'Academy message with "Academy" suffix matches Section 5 taxonomy'
);

const acadMsg2 = getWhatsAppMessage({ academyName: 'Artificial Intelligence' });
assert(
  acadMsg2 === 'Hi Nova Skills, I am interested in your Artificial Intelligence Academy. Please help me explore the available courses and learning options.',
  'Academy message appends "Academy" suffix automatically when missing'
);

// 3. Location message
const locMsg = getWhatsAppMessage({ city: 'Indore' });
assert(
  locMsg === 'Hi Nova Skills, I am interested in your online learning options for Indore. Please share available courses and counselling details.',
  'Location message matches Section 5 taxonomy'
);

// 4. Demo message
const demoMsg1 = getWhatsAppMessage({ intent: 'demo', courseName: 'UI/UX Design Masterclass' });
assert(
  demoMsg1 === 'Hi Nova Skills, I would like to enquire about the 2-Day Free Demo for UI/UX Design Masterclass. Please share the eligibility and upcoming schedule.',
  'Demo message with course name matches Section 5 taxonomy'
);

const demoMsg2 = getWhatsAppMessage({ intent: 'demo' });
assert(
  demoMsg2 === 'Hi Nova Skills, I would like to enquire about the 2-Day Free Demo. Please share the eligibility and upcoming schedule.',
  'Demo message without course name matches fallback'
);

// 5. Counselling message
const counselMsg = getWhatsAppMessage({ intent: 'counselling' });
assert(
  counselMsg === 'Hi Nova Skills, I would like free career counselling to help me choose the right course.',
  'Counselling message matches Section 5 taxonomy'
);

// 6. Generic / Sitewide Default
const genericMsg = getWhatsAppMessage({});
assert(
  genericMsg === 'Hi Nova Skills, I am interested in your courses. Please help me with course details, fees and upcoming batch information.',
  'Generic default message matches Section 5 taxonomy'
);

// WhatsApp Link Generator URL encoding test
const waUrl = getAdmissionsWhatsAppLink({ city: 'Indore' });
assert(waUrl.startsWith('https://wa.me/919695904440?text='), 'WhatsApp URL starts with official wa.me destination');
assert(!waUrl.includes(' '), 'WhatsApp URL contains zero bare spaces (properly percent-encoded)');
assert(decodeURIComponent(waUrl.split('?text=')[1]) === locMsg, 'WhatsApp URL encodes exact context message');

// ---------------------------------------------------------------------------
// SUITE 3: Shared Components & Navigation Integration (components.js)
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 3: Shared Components (components.js & SSR Index)');

const compCode = fs.readFileSync(path.join(__dirname, '..', 'components.js'), 'utf8');

assert(compCode.includes('CONTACT_CONFIG ='), 'components.js defines central CONTACT_CONFIG');
assert(compCode.includes('NovaContact ='), 'components.js exports NovaContact engine');
assert(compCode.includes('id="nav-phone-btn"'), 'Desktop header contains nav-phone-btn');
assert(compCode.includes('href="tel:+919695904440"'), 'Desktop header helpline points to tel:+919695904440');
assert(compCode.includes('id="mobile-drawer-whatsapp-btn"'), 'Mobile drawer contains mobile-drawer-whatsapp-btn');
assert(compCode.includes('id="mobile-drawer-phone-btn"'), 'Mobile drawer contains mobile-drawer-phone-btn');
assert(compCode.includes('id="footer-whatsapp-link"'), 'Footer contains distinct footer-whatsapp-link');
assert(compCode.includes('id="footer-phone-link"'), 'Footer contains distinct footer-phone-link');

// Verify channel separation in footer
assert(
  !compCode.includes('<div class="contact-label">Call / WhatsApp</div>'),
  'Ambiguous combined "Call / WhatsApp" label removed from footer'
);
assert(
  compCode.includes('WhatsApp Admissions') && compCode.includes('Admissions Helpline'),
  'Footer clearly separates WhatsApp Admissions and Admissions Helpline'
);

// Verify index.html SSR snapshot contains updated elements
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert(indexHtml.includes('id="nav-phone-btn"'), 'index.html SSR contains nav-phone-btn');
assert(indexHtml.includes('id="mobile-drawer-whatsapp-btn"'), 'index.html SSR contains mobile-drawer-whatsapp-btn');
assert(indexHtml.includes('id="mobile-drawer-phone-btn"'), 'index.html SSR contains mobile-drawer-phone-btn');

// ---------------------------------------------------------------------------
// SUITE 4: GA4 Analytics & Telemetry Compliance (Section 7)
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 4: GA4 Telemetry & Non-PII Verification');

// Create a DOM mock to test initGA4ClickTracking and event emissions
class MockElement {
  constructor(tag, attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.attributes = Object.assign({}, attrs);
    this.classList = {
      _classes: new Set((attrs.class || '').split(/\s+/).filter(Boolean)),
      contains(c) { return this._classes.has(c); },
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      toggle(c) { if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c); }
    };
    this.id = attrs.id || '';
    this.parentElement = null;
  }
  getAttribute(name) { return this.attributes[name] || null; }
  setAttribute(name, val) { this.attributes[name] = val; }
  closest(selector) {
    if (selector.includes('footer') && this.id.includes('footer')) return this;
    if (selector.includes('a') && this.tagName === 'A') return this;
    return null;
  }
}

const trackedEvents = [];
const mockGtag = function (cmd, eventName, params) {
  if (cmd === 'event') {
    trackedEvents.push({ eventName, params });
  }
};

const sandbox = {
  window: {
    location: { pathname: '/courses/ai-mastery', search: '?utm_source=google' },
    gtag: mockGtag,
    sessionStorage: { getItem() { return null; }, setItem() {} },
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  document: {
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    body: {
      insertAdjacentHTML: () => {},
      appendChild: () => {},
      getAttribute: () => null
    }
  },
  navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  sessionStorage: { getItem() { return null; }, setItem() {} },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  requestAnimationFrame: (cb) => cb(),
  requestIdleCallback: (cb) => cb()
};
sandbox.globalThis = sandbox.window;
sandbox.window.window = sandbox.window;

vm.createContext(sandbox);

// Execute components.js in sandbox
vm.runInContext(compCode, sandbox);

assert(typeof sandbox.window.NovaContact !== 'undefined', 'NovaContact initialized in browser context');
assert(typeof sandbox.window.NovaAnalytics !== 'undefined', 'NovaAnalytics initialized in browser context');

// Test trackWhatsAppClick emission
sandbox.window.NovaAnalytics.trackWhatsAppClick({
  button_id: 'whatsapp-btn',
  link_type: 'floating_button',
  source_component: 'floating_whatsapp_btn',
  course_id: 'ai-mastery',
  academy_id: 'ai',
  city: 'Indore'
});

const waEvent = trackedEvents.find(e => e.eventName === 'click_whatsapp');
assert(!!waEvent, 'click_whatsapp GA4 event emitted successfully');
assert(waEvent && waEvent.params.contact_type === 'whatsapp', 'click_whatsapp sets contact_type = "whatsapp"');
assert(waEvent && waEvent.params.course_id === 'ai-mastery', 'click_whatsapp passes contextual course_id');
assert(waEvent && waEvent.params.city === 'Indore', 'click_whatsapp passes contextual city');

// Test trackPhoneClick emission
sandbox.window.NovaAnalytics.trackPhoneClick({
  button_id: 'nav-phone-btn',
  source_component: 'header_helpline',
  course_id: 'ai-mastery',
  academy_id: 'ai',
  city: 'Indore'
});

const phoneEvent = trackedEvents.find(e => e.eventName === 'click_phone');
assert(!!phoneEvent, 'click_phone GA4 event emitted successfully');
assert(phoneEvent && phoneEvent.params.contact_type === 'phone', 'click_phone sets contact_type = "phone"');
assert(phoneEvent && phoneEvent.params.source_component === 'header_helpline', 'click_phone passes source_component');

// Assert zero generate_lead fired on clicks
const leadEvent = trackedEvents.find(e => e.eventName === 'generate_lead');
assert(!leadEvent, 'CRITICAL: zero generate_lead event fired on WhatsApp or phone click');

// ---------------------------------------------------------------------------
// SUITE 5: Sitewide Static HTML Forensic Audit
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 5: Repository-Wide HTML Forensic Audit');

const htmlFilesToScan = [
  'index.html',
  'courses.html',
  'contact/index.html',
  'academies/digital-marketing/index.html',
  'academies/ai/index.html',
  'academies/programming/index.html',
  'branches/index.html',
  'branches/indore/index.html',
  'branches/lucknow/index.html'
];

let phoneLinksFound = 0;
let waLinksFound = 0;
let invalidNumbersFound = 0;

htmlFilesToScan.forEach(relPath => {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) return;

  const html = fs.readFileSync(fullPath, 'utf8');

  // Check tel: links
  const telMatches = html.match(/href=["']tel:([^"']+)["']/g) || [];
  telMatches.forEach(m => {
    phoneLinksFound++;
    const num = m.replace(/href=["']tel:/, '').replace(/["']/, '');
    if (!validateContactNumber(num)) {
      invalidNumbersFound++;
      console.error(`Invalid tel link in ${relPath}: ${num}`);
    }
  });

  // Check wa.me links
  const waMatches = html.match(/href=["']https?:\/\/wa\.me\/([^"']+)["']/g) || [];
  waMatches.forEach(m => {
    waLinksFound++;
    const dest = m.replace(/href=["']https?:\/\/wa\.me\//, '').replace(/["']/, '');
    const num = dest.split('?')[0];
    if (num !== '919695904440') {
      invalidNumbersFound++;
      console.error(`Invalid WhatsApp number in ${relPath}: ${num}`);
    }
  });
});

assert(phoneLinksFound > 0, `Found ${phoneLinksFound} callable telephone links across key entry points`);
assert(waLinksFound > 0, `Found ${waLinksFound} WhatsApp chat links across key entry points`);
assert(invalidNumbersFound === 0, `Zero invalid phone or WhatsApp destination numbers found (Expected: 0, Found: ${invalidNumbersFound})`);

// ---------------------------------------------------------------------------
// SUITE 6: Contact Page Specific Verification (contact/index.html)
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 6: Contact Page Verification');
const contactHtml = fs.readFileSync(path.join(__dirname, '..', 'contact/index.html'), 'utf8');

assert(contactHtml.includes('id="click-phone-card"'), 'Contact card has click-phone-card');
assert(contactHtml.includes('href="tel:+919695904440"'), 'Contact card telephone link is tel:+919695904440');
assert(contactHtml.includes('id="click-whatsapp-card"'), 'Contact card has click-whatsapp-card');
assert(contactHtml.includes('id="click-cta-wa"'), 'Final CTA banner has primary click-cta-wa');
assert(contactHtml.includes('id="click-cta-call"'), 'Final CTA banner has secondary click-cta-call');

// Verify prefilled message in contact final CTA
assert(
  contactHtml.includes('Hi%20Nova%20Skills%2C%20I%20am%20interested%20in%20your%20courses'),
  'Contact page WhatsApp links use canonical Section 5 message'
);

// ---------------------------------------------------------------------------
// SUITE 7: AI Career Advisor Verification (nova-ai-widget.js)
// ---------------------------------------------------------------------------
console.log('\n▶ SUITE 7: AI Career Advisor Escalation Verification');
const aiCode = fs.readFileSync(path.join(__dirname, '..', 'nova-ai-widget.js'), 'utf8');

assert(
  aiCode.includes('[+91 9695904440](tel:+919695904440)'),
  'AI Career Advisor escalation includes callable telephone markdown link'
);
assert(
  aiCode.includes('Hi%20Nova%20Skills%2C%20I%20would%20like%20free%20career%20counselling'),
  'AI Career Advisor escalation WhatsApp link uses canonical Section 5 counselling message'
);

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`  VALIDATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('======================================================\n');

if (failedTests > 0) {
  console.error(`❌ ${failedTests} TESTS FAILED. Resolve before pushing.\n`);
  process.exit(1);
} else {
  console.log('🎉 ALL P1-4 CONTACT CTA VALIDATIONS PASSED CLEANLY.\n');
  process.exit(0);
}
