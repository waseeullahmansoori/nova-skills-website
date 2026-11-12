/**
 * P1-1 Automated Lead Forms Acceptance & Regression Test Suite
 * 
 * Verifies Form A (2-Day Free Demo) and Form B (Free Career Counselling)
 * validation, payloads, UI copy, campus delivery distinctions, non-promissory confirmations,
 * zero PII in localStorage, and all entry point triggers.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
    failedTests++;
  }
}

console.log('================================================================');
console.log('🧪 P1-1 LEAD FORMS ACCEPTANCE TEST SUITE');
console.log('================================================================\n');

// 1. Static Content & Architecture Audit
console.log('--- 1. Verifying Form Copy, Non-Promissory Confirmation & PII Safety ---');

const componentsJs = fs.readFileSync(path.join(__dirname, '..', 'components.js'), 'utf8');

// Check Form A copy
assert(/Book Your\s*<span class="gradient-text">2-Day Free Demo<\/span>/i.test(componentsJs), 'Form A modal contains heading "Book Your 2-Day Free Demo"');
assert(componentsJs.includes('Experience our practical teaching methodology'), 'Form A modal contains supporting text explaining practical teaching methodology');
assert(componentsJs.includes('Request My Free Demo'), 'Form A modal CTA is "Request My Free Demo"');
assert(componentsJs.includes('admissions team will contact you to confirm course eligibility, batch availability'), 'Form A modal contains non-promissory seat confirmation copy');
assert(!componentsJs.includes("localStorage.setItem('novaskills_demo_requests'"), 'Zero PII in localStorage: novaskills_demo_requests is eliminated');

// Check Form B copy
assert(/Book a Free\s*<span class="gradient-text">Career Counselling Session<\/span>/i.test(componentsJs), 'Form B modal contains heading "Book a Free Career Counselling Session"');
assert(componentsJs.includes('Speak with our academic counsellors'), 'Form B modal contains supporting text');
assert(componentsJs.includes('Book My Free Counselling Session'), 'Form B modal CTA is "Book My Free Counselling Session"');
assert(componentsJs.includes('Not Sure — Help Me Choose a Course'), 'Form B includes "Not Sure — Help Me Choose a Course"');
assert(componentsJs.includes('In-person classroom training is available exclusively at our Siddharth Nagar campus'), 'Form modal explicitly clarifies Siddharth Nagar campus vs nationwide Live Online');

// 2. Unit Testing NovaFormValidator in Mock DOM
console.log('\n--- 2. Verifying NovaFormValidator Utilities ---');

class MockElement {
  constructor(tag = 'div', id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.dataset = {};
    this.children = [];
    this.style = {};
    this.disabled = false;
    this.classList = { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false };
    this.value = '';
    this.innerHTML = '';
  }
  addEventListener() {}
  removeEventListener() {}
  querySelector() { return null; }
  querySelectorAll() { return []; }
  appendChild(el) { this.children.push(el); }
  insertAdjacentHTML() {}
  reset() {}
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

const sandbox = {
  window: {},
  document: mockDoc,
  navigator: { userAgent: 'NodeTest' },
  location: { pathname: '/', search: '', hostname: 'novaskills.in', href: 'https://novaskills.in/' },
  sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console: console,
  setTimeout: () => {},
  clearTimeout: () => {},
  requestIdleCallback: (cb) => cb(),
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) }),
  addEventListener: () => {},
  removeEventListener: () => {}
};
sandbox.window = sandbox;

vm.createContext(sandbox);
vm.runInContext(componentsJs, sandbox);
const validator = sandbox.window.NovaFormValidator;

assert(typeof validator === 'object' && validator !== null, 'NovaFormValidator is exported to window');

// Name validation
assert(validator.validateFullName('Rahul Sharma').valid === true, 'Valid name "Rahul Sharma" passes');
assert(validator.validateFullName('R').valid === false, 'Single letter name fails');
assert(validator.validateFullName('').valid === false, 'Empty name fails');
assert(validator.validateFullName('   ').valid === false, 'Whitespace name fails');
assert(validator.validateFullName('Rahul123').valid === false, 'Name with numbers fails');

// Mobile validation
assert(validator.validateMobile('9876543210').valid === true, 'Standard 10-digit mobile passes');
assert(validator.validateMobile('+919876543210').cleanValue === '9876543210' && validator.validateMobile('+919876543210').valid === true, 'Mobile with +91 prefix normalizes and passes');
assert(validator.validateMobile('09876543210').cleanValue === '9876543210' && validator.validateMobile('09876543210').valid === true, 'Mobile with leading 0 normalizes and passes');
assert(validator.validateMobile('98765-43210').cleanValue === '9876543210' && validator.validateMobile('98765-43210').valid === true, 'Mobile with hyphen normalizes and passes');
assert(validator.validateMobile('5876543210').valid === false, 'Mobile starting with 5 fails (must start with 6-9)');
assert(validator.validateMobile('1111111111').valid === false, 'Dummy repeating mobile (1111111111) fails');
assert(validator.validateMobile('9999999999').valid === false, 'Dummy repeating mobile (9999999999) fails');
assert(validator.validateMobile('98765').valid === false, 'Short mobile number fails');

// Email validation
assert(validator.validateEmail('user@novaskills.in', true).valid === true, 'Valid email passes');
assert(validator.validateEmail('user@test', true).valid === false, 'Invalid email fails');
assert(validator.validateEmail('', false).valid === true, 'Optional empty email passes');
assert(validator.validateEmail('', true).valid === false, 'Required empty email fails');

// Course validation
assert(validator.validateCourse('ai-digital-marketing', false).valid === true, 'Specific course passes');
assert(validator.validateCourse('not-sure', true).valid === true, 'Not Sure course passes Form B when allowNotSure=true');
assert(validator.validateCourse('not-sure', false).valid === false, 'Not Sure course fails Form A when allowNotSure=false');
assert(validator.validateCourse('', true).valid === true, 'Empty course passes Form B (counselling allows general guidance)');
assert(validator.validateCourse('', false).valid === false, 'Empty course fails Form A (demo requires course)');

// City validation
assert(validator.validateCity('Siddharth Nagar', false).valid === true, 'Specific city passes');
assert(validator.validateCity('', false).valid === true, 'Optional empty city passes');
assert(validator.validateCity('', true).valid === false, 'Required empty city fails');

// 3. Verifying Form B Functions & Backward Compatibility Aliases
console.log('\n--- 3. Verifying Modal Functions & Aliases ---');

assert(typeof sandbox.window.openDemoModal === 'function', 'openDemoModal is globally exposed');
assert(typeof sandbox.window.openCounsellingModal === 'function', 'openCounsellingModal is globally exposed');
assert(typeof sandbox.window.openConsultationPopup === 'function', 'openConsultationPopup is aliased');
assert(typeof sandbox.window.openConsultationModal === 'function', 'openConsultationModal is aliased');
assert(typeof sandbox.window.openCareerCounsellingModal === 'function', 'openCareerCounsellingModal is aliased');
assert(typeof sandbox.window.openFreeDemoModal === 'function', 'openFreeDemoModal is aliased');

// 4. Verifying Entry Points in Codebase
console.log('\n--- 4. Verifying Entry Points Across All Pages ---');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert(indexHtml.includes('not-sure') && indexHtml.includes('🎯 Not Sure — Help Me Choose a Course'), 'Homepage counselling form contains "Not Sure" option');
assert(indexHtml.includes('Book My Free Counselling Session'), 'Homepage counselling form CTA updated');

const contactHtml = fs.readFileSync(path.join(__dirname, '..', 'contact', 'index.html'), 'utf8');
assert(contactHtml.includes('🎯 Not Sure — Help Me Choose a Course'), 'Contact page contains "Not Sure" option');
assert(contactHtml.includes('(Optional)'), 'Contact page marks Email and City as Optional');
assert(contactHtml.includes('formName: \'career_counselling\''), 'Contact page submits as career_counselling');

const courseDetailJs = fs.readFileSync(path.join(__dirname, '..', 'course-detail.js'), 'utf8');
assert(courseDetailJs.includes('openDemoModal'), 'Course detail binds demo button to openDemoModal');
assert(courseDetailJs.includes('openCounsellingModal'), 'Course detail binds consultation button to openCounsellingModal');

const academyDetailJs = fs.readFileSync(path.join(__dirname, '..', 'academy-detail.js'), 'utf8');
assert(academyDetailJs.includes('openCounsellingModal'), 'Academy detail binds consultation CTA to openCounsellingModal');

const locationsCityJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'locations-city.js'), 'utf8');
assert(locationsCityJs.includes('openCounsellingModal'), 'City locations script routes consultation to openCounsellingModal');
assert(locationsCityJs.includes('openDemoModal'), 'City locations script routes demo to openDemoModal');

const locationsDirJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'locations-directory.js'), 'utf8');
assert(locationsDirJs.includes('openCounsellingModal'), 'Directory locations script routes consultation to openCounsellingModal');
assert(locationsDirJs.includes('openDemoModal'), 'Directory locations script routes demo to openDemoModal');

const aiWidgetJs = fs.readFileSync(path.join(__dirname, '..', 'nova-ai-widget.js'), 'utf8');
assert(aiWidgetJs.includes('openDemoModal') && aiWidgetJs.includes('openCounsellingModal'), 'AI Career Advisor routes demo and counselling to respective modals with context');

console.log('\n================================================================');
console.log(`SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL P1-1 LEAD FORMS ACCEPTANCE CHECKS PASSED!\n');
}
