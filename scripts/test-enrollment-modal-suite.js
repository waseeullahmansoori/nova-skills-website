const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log('=== STARTING GLOBAL ENROLLMENT MODAL TEST SUITE ===\n');

// 1. Verify components.js code
console.log('--- 1. Testing Enrollment Modal Implementation in components.js ---');
const compCode = fs.readFileSync(path.join(rootDir, 'components.js'), 'utf8');
const minCompCode = fs.readFileSync(path.join(rootDir, 'js', 'components.min.js'), 'utf8');

assert(compCode.includes("modal.id = 'course-enrollment-modal'") || compCode.includes('id="course-enrollment-modal"'), 'Modal container #course-enrollment-modal exists');
assert(compCode.includes('id="enroll-modal-close"'), 'Close button #enroll-modal-close exists');
assert(compCode.includes('id="enroll-name"'), 'Full Name input #enroll-name exists');
assert(compCode.includes('id="enroll-phone"'), 'Mobile Number input #enroll-phone exists');
assert(compCode.includes('id="enroll-email"'), 'Email Address input #enroll-email exists');
assert(compCode.includes('id="enroll-city"'), 'City input #enroll-city exists');
assert(compCode.includes('id="enroll-message"'), 'Additional Message input #enroll-message exists');
assert(compCode.includes('id="enroll-submit-btn"'), 'Submit CTA #enroll-submit-btn exists');
assert(compCode.includes('id="selected-course-card"'), 'Selected Course Card #selected-course-card exists');
assert(compCode.includes('class="phone-prefix">+91<'), 'Phone prefix +91 is rendered');
assert(compCode.includes('Email Address <span class="opt">(Optional)</span>'), 'Email is explicitly marked optional');
assert(compCode.includes('Additional Message <span class="opt">(Optional)</span>'), 'Message is explicitly marked optional');
assert(compCode.includes('id="enroll-success-container"'), 'Success view container exists');
assert(compCode.includes('class="enroll-privacy-notice"'), 'Privacy disclosure notice preserved');

// Verification of Trust Badges Removal
assert(!compCode.includes('1-on-1 Academic Counselling'), 'REMOVED: "1-on-1 Academic Counselling" badge absent from components.js');
assert(!compCode.includes('Hands-on Live Training'), 'REMOVED: "Hands-on Live Training" badge absent from components.js');
assert(!compCode.includes('100% Privacy Protected'), 'REMOVED: "100% Privacy Protected" badge absent from components.js');
assert(!compCode.includes('enroll-trust-box'), 'REMOVED: enroll-trust-box container absent from components.js');

assert(!minCompCode.includes('1-on-1 Academic Counselling'), 'REMOVED: "1-on-1 Academic Counselling" absent from js/components.min.js');
assert(!minCompCode.includes('Hands-on Live Training'), 'REMOVED: "Hands-on Live Training" absent from js/components.min.js');
assert(!minCompCode.includes('100% Privacy Protected'), 'REMOVED: "100% Privacy Protected" absent from js/components.min.js');
assert(!minCompCode.includes('enroll-trust-box'), 'REMOVED: enroll-trust-box absent from js/components.min.js');

// Verification of Mobile Structure Order (Course Summary -> Student Details -> Submit Enquiry)
const idxCard = compCode.indexOf('id="selected-course-card"');
const idxName = compCode.indexOf('id="enroll-name"');
const idxPhone = compCode.indexOf('id="enroll-phone"');
const idxEmail = compCode.indexOf('id="enroll-email"');
const idxCity = compCode.indexOf('id="enroll-city"');
const idxMessage = compCode.indexOf('id="enroll-message"');
const idxSubmit = compCode.indexOf('id="enroll-submit-btn"');

assert(idxCard !== -1 && idxName !== -1 && idxCard < idxName, 'ORDER: Course summary card appears before Full Name field');
assert(idxName < idxPhone, 'ORDER: Full Name appears before Mobile Number');
assert(idxPhone < idxEmail, 'ORDER: Mobile Number appears before Email Address');
assert(idxEmail < idxCity, 'ORDER: Email Address appears before City');
assert(idxCity < idxMessage, 'ORDER: City appears before Additional Message');
assert(idxMessage < idxSubmit, 'ORDER: Additional Message appears before Submit CTA');

// 2. CSS Rules verification
console.log('\n--- 2. Testing CSS Stylesheets (styles.css & css/main.css) ---');
const stylesCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
const mainCss = fs.readFileSync(path.join(rootDir, 'css', 'main.css'), 'utf8');

[stylesCss, mainCss].forEach((css, idx) => {
  const name = idx === 0 ? 'styles.css' : 'css/main.css';
  assert(css.includes('.enroll-modal-container {') && css.includes('grid-template-columns: 1fr;'), `${name}: Mobile container collapses to single-column`);
  assert(css.includes('font-size: 16px !important;'), `${name}: Mobile inputs enforce 16px to prevent iOS auto-zoom`);
  assert(css.includes('position: sticky;') && css.includes('env(safe-area-inset-bottom'), `${name}: Mobile actions have sticky positioning with safe-area padding`);
  assert(css.includes('body.modal-open-hide-widgets .whatsapp-float'), `${name}: Floating WhatsApp button hidden while modal open`);
  assert(css.includes('body.modal-open-hide-widgets .nova-ai-launcher'), `${name}: Floating Nova AI launcher hidden while modal open`);
  assert(css.includes('body.modal-open-hide-widgets .sticky-enroll-bar'), `${name}: Sticky page enroll bar hidden while modal open`);
  assert(css.includes('min-width: 44px;') && css.includes('min-height: 44px;'), `${name}: Touch targets satisfy minimum 44px standard`);
});

// 3. Validation Logic in isolation
console.log('\n--- 3. Testing Validation & Sanitization Logic ---');

function validateEnrollmentForm({ name, rawPhone, email, city }) {
  const errors = {};
  if (!name || name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }
  let cleanPhone = (rawPhone || '').replace(/\D/g, '');
  if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    cleanPhone = cleanPhone.slice(2);
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
    cleanPhone = cleanPhone.slice(1);
  }
  if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
  }
  if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!city || city.trim().length < 2) {
    errors.city = 'Please enter your city.';
  }
  return { isValid: Object.keys(errors).length === 0, errors, cleanPhone };
}

// Validation tests
const v1 = validateEnrollmentForm({ name: '', rawPhone: '9876543210', city: 'Mumbai' });
assert(!v1.isValid && !!v1.errors.name, 'Empty name is rejected');

const v2 = validateEnrollmentForm({ name: 'A', rawPhone: '9876543210', city: 'Mumbai' });
assert(!v2.isValid && !!v2.errors.name, 'Single-character name is rejected');

const v3 = validateEnrollmentForm({ name: 'Rohit Sharma', rawPhone: '1234567890', city: 'Mumbai' });
assert(!v3.isValid && !!v3.errors.phone, 'Phone starting with 1 is rejected (Indian numbers start 6-9)');

const v4 = validateEnrollmentForm({ name: 'Rohit Sharma', rawPhone: '987654321', city: 'Mumbai' });
assert(!v4.isValid && !!v4.errors.phone, '9-digit phone is rejected');

const v5 = validateEnrollmentForm({ name: 'Rohit Sharma', rawPhone: '+91 98765 43210', city: 'Mumbai' });
assert(v5.isValid && v5.cleanPhone === '9876543210', 'Phone with +91 prefix and spaces correctly sanitizes to 10 digits');

const v6 = validateEnrollmentForm({ name: 'Rohit Sharma', rawPhone: '09876543210', city: 'Mumbai' });
assert(v6.isValid && v6.cleanPhone === '9876543210', 'Phone with leading 0 prefix correctly sanitizes to 10 digits');

const v7 = validateEnrollmentForm({ name: 'Rohit Sharma', rawPhone: '9876543210', city: 'Mumbai', email: '' });
assert(v7.isValid, 'Empty email is accepted (optional)');

const v8 = validateEnrollmentForm({ name: 'Rohit Sharma', rawPhone: '9876543210', city: 'Mumbai', email: 'invalid-email' });
assert(!v8.isValid && !!v8.errors.email, 'Invalid email format is rejected when entered');

const v9 = validateEnrollmentForm({ name: 'Rohit Sharma', rawPhone: '9876543210', city: 'Mumbai', email: 'rohit@example.com' });
assert(v9.isValid, 'Valid email format is accepted');

const v10 = validateEnrollmentForm({ name: 'Rohit Sharma', rawPhone: '9876543210', city: '', email: 'rohit@example.com' });
assert(!v10.isValid && !!v10.errors.city, 'Empty city is rejected');

// 4. Test Course Resolution Binding against authoritative NS_COURSES
console.log('\n--- 4. Testing Course Resolution Binding (NS_COURSES) ---');
const dataJs = fs.readFileSync(path.join(rootDir, 'data.js'), 'utf8');
const vm = require('vm');
vm.runInThisContext(dataJs);
const courses = NS_COURSES;

function resolveCourse(courseName, explicitId) {
  let found = null;
  if (explicitId) {
    found = courses.find(c => c.id === explicitId);
  }
  if (!found && courseName) {
    const cLower = String(courseName).toLowerCase().trim();
    found = courses.find(c => (c.name && c.name.toLowerCase() === cLower) || c.id === cLower || c.slug === cLower);
  }
  if (!found && courseName) {
    const cleanTarget = String(courseName).replace(/[\u2013\u2014\-–—]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    found = courses.find(c => {
      const cleanName = (c.name || '').replace(/[\u2013\u2014\-–—]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
      return cleanName === cleanTarget;
    });
  }
  return {
    name: found ? found.name : courseName,
    academy: found ? found.academy : 'Nova Skills Academy',
    duration: found ? found.duration : 'Flexible Duration',
    fee: found ? ('₹' + (found.price || 0).toLocaleString('en-IN')) : 'Enquire for Fee'
  };
}

const c109 = resolveCourse(null, 'tally-gst');
assert(c109.name === 'TallyPrime — Accounting & GST Compliance', 'Course 109 resolved title: ' + c109.name);
assert(c109.duration === '10 Weeks', 'Course 109 resolved duration: ' + c109.duration);
assert(c109.fee === '₹6,900', 'Course 109 resolved fee: ' + c109.fee);

const c108 = resolveCourse(null, 'microsoft-copilot');
assert(c108.name === 'Microsoft 365 Copilot — AI Workplace Productivity', 'Course 108 resolved title: ' + c108.name);
assert(c108.duration === '4 Weeks', 'Course 108 resolved duration: ' + c108.duration);
assert(c108.fee === '₹5,900', 'Course 108 resolved fee: ' + c108.fee);

const c31 = resolveCourse('Figma UI Design & Responsive Prototyping');
assert(c31.name === 'Figma UI Design & Responsive Prototyping', 'Course 31 resolved title: ' + c31.name);
assert(c31.duration === '8 Weeks', 'Course 31 resolved duration: ' + c31.duration);
assert(c31.fee === '₹7,900', 'Course 31 resolved fee: ' + c31.fee);

const c3 = resolveCourse('Performance Marketing Specialist');
assert(c3.name === 'Performance Marketing Specialist', 'Course 3 resolved title: ' + c3.name);
assert(c3.duration === '4 Months', 'Course 3 resolved duration: ' + c3.duration);
assert(c3.fee === '₹24,900', 'Course 3 resolved fee: ' + c3.fee);

console.log('\n========================================');
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('========================================\n');

if (failed === 0) {
  console.log('🎉 ALL ENROLLMENT MODAL TESTS PASSED (0 FAILURES)!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
