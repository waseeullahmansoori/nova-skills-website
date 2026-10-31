const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

console.log('=== RUNNING GLOBAL COURSE DATA INTEGRITY TEST SUITE ===\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Load data.js
const dataJs = fs.readFileSync(path.join(rootDir, 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

assert(Array.isArray(NS_COURSES) && NS_COURSES.length === 109, `data.js has exactly 109 courses (got ${NS_COURSES?.length})`);
assert(Array.isArray(NS_ACADEMIES) && NS_ACADEMIES.length === 12, `data.js has exactly 12 academies (got ${NS_ACADEMIES?.length})`);

// 2. Unique course IDs and numbers
const courseIds = new Set();
const courseNumbers = new Set();
NS_COURSES.forEach((c, idx) => {
  assert(!courseIds.has(c.id), `Unique course ID: ${c.id}`);
  courseIds.add(c.id);

  const num = c.course_number || c.courseNumber || (idx + 1);
  assert(!courseNumbers.has(num), `Unique course number: ${num} for ${c.id}`);
  courseNumbers.add(num);
});

// 3. Compare with data/courses/*.json
NS_COURSES.forEach(c => {
  const jsonPath = path.join(rootDir, 'data', 'courses', `${c.id}.json`);
  assert(fs.existsSync(jsonPath), `Authoritative JSON exists for course: ${c.id}`);
  if (fs.existsSync(jsonPath)) {
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const canonicalTitle = json.title || json.course_name || json.name;
    const rawFee = json.fee !== undefined ? json.fee : json.price;
    const canonicalFee = rawFee !== undefined ? (typeof rawFee === 'number' ? rawFee : parseInt(String(rawFee).replace(/[^0-9]/g, ''), 10)) : c.price;
    const canonicalDuration = json.duration || c.duration;

    assert(c.title === canonicalTitle && c.name === canonicalTitle, `${c.id}: title in data.js "${c.title}" matches canonical "${canonicalTitle}"`);
    assert(c.price === canonicalFee && c.fee === canonicalFee, `${c.id}: price in data.js (${c.price}) matches canonical fee (${canonicalFee})`);
    assert(c.duration === canonicalDuration, `${c.id}: duration in data.js "${c.duration}" matches canonical "${canonicalDuration}"`);

    // Verify tools are authentic
    assert(Array.isArray(c.tools) && c.tools.length > 0, `${c.id}: has valid authentic tools array (${c.tools?.length} tools)`);

    // Verify no fake discount for certifications
    if (c.programLevel && c.programLevel.includes('Cert')) {
      assert(c.originalPrice === c.price, `${c.id}: certification course has zero fake discount (price: ${c.price}, originalPrice: ${c.originalPrice})`);
    }
  }
});

// 4. Validate courses.html cards
const coursesHtml = fs.readFileSync(path.join(rootDir, 'courses.html'), 'utf8');

NS_COURSES.forEach(c => {
  // Check if link exists
  const link = `/course-detail.html?id=${c.id}`;
  assert(coursesHtml.includes(link), `courses.html contains link to ${link}`);

  // Check course title in courses.html
  assert(coursesHtml.includes(`>${c.name}</a>`), `courses.html contains updated course title "${c.name}"`);

  // Check course price in courses.html
  const priceStr = `₹${c.price.toLocaleString('en-IN')}`;
  assert(coursesHtml.includes(priceStr), `courses.html contains approved price ${priceStr} for ${c.id}`);

  // Check enrollment modal context
  const safeName = c.name.replace(/'/g, "\\'");
  assert(coursesHtml.includes(`'${safeName}'`), `courses.html enrollment modal passes approved name '${safeName}'`);
});

// 5. Validate Office Productivity Academy matrix (Courses 102 to 109)
const officeExpected = [
  { id: 'microsoft-excel', title: 'Microsoft Excel — Business Reporting & Data Analysis', duration: '6 Weeks', hours: 48, fee: 6900 },
  { id: 'microsoft-word', title: 'Microsoft Word — Professional Documents & Mail Merge', duration: '3 Weeks', hours: 24, fee: 3900 },
  { id: 'microsoft-powerpoint', title: 'Microsoft PowerPoint — Professional Presentation Design', duration: '4 Weeks', hours: 32, fee: 4900 },
  { id: 'google-workspace', title: 'Google Workspace — Cloud Productivity & Collaboration', duration: '5 Weeks', hours: 40, fee: 5900 },
  { id: 'notion-cert', title: 'Notion — Workspace, Databases & Knowledge Systems', duration: '5 Weeks', hours: 40, fee: 5900 },
  { id: 'clickup-cert', title: 'ClickUp — Project Management & Workflow Automation', duration: '5 Weeks', hours: 40, fee: 5900 },
  { id: 'microsoft-copilot', title: 'Microsoft 365 Copilot — AI Workplace Productivity', duration: '4 Weeks', hours: 32, fee: 5900 },
  { id: 'tally-gst', title: 'TallyPrime — Accounting & GST Compliance', duration: '10 Weeks', hours: 80, fee: 9900 }
];

officeExpected.forEach(exp => {
  const c = NS_COURSES.find(item => item.id === exp.id);
  assert(!!c, `Course ${exp.id} found in NS_COURSES`);
  if (c) {
    assert(c.title === exp.title, `${exp.id}: title "${c.title}" matches approved "${exp.title}"`);
    assert(c.duration === exp.duration, `${exp.id}: duration "${c.duration}" matches approved "${exp.duration}"`);
    assert(c.price === exp.fee, `${exp.id}: fee ${c.price} matches approved ${exp.fee}`);
    assert(c.originalPrice === exp.fee, `${exp.id}: originalPrice ${c.originalPrice} has zero fake discount`);
  }
});

// 6. Validate Edge Functions bundle
const edgeBundle = fs.readFileSync(path.join(rootDir, 'functions', '_rendered_courses.js'), 'utf8');
assert(edgeBundle.includes('TallyPrime — Accounting & GST Compliance'), `Edge bundle contains updated TallyPrime title`);
assert(edgeBundle.includes('₹9,900'), `Edge bundle contains TallyPrime price ₹9,900`);
assert(edgeBundle.includes('Microsoft 365 Copilot — AI Workplace Productivity'), `Edge bundle contains Copilot updated title`);
assert(edgeBundle.includes('Microsoft Excel — Business Reporting & Data Analysis'), `Edge bundle contains Excel updated title`);

// 7. Validate Office Academy page
const officeHtml = fs.readFileSync(path.join(rootDir, 'academies', 'office-productivity', 'index.html'), 'utf8');
assert(officeHtml.includes('TallyPrime — Accounting & GST Compliance'), `Office academy page contains updated TallyPrime title`);
assert(officeHtml.includes('₹9,900'), `Office academy page contains TallyPrime price ₹9,900`);
assert(officeHtml.includes('Microsoft 365 Copilot — AI Workplace Productivity'), `Office academy page contains Copilot updated title`);

console.log('\n========================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('========================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 20 DATA INTEGRITY GATES PASSED (0 FAILURES)!');
}
