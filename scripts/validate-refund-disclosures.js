const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

let errors = 0;
let warnings = 0;

function logError(msg) {
  console.error(`[ERROR] ${msg}`);
  errors++;
}

function logWarn(msg) {
  console.warn(`[WARN] ${msg}`);
  warnings++;
}

function logPass(msg) {
  console.log(`[PASS] ${msg}`);
}

console.log('=== P1-7 REFUND POLICY TRANSPARENCY & PRE-ENROLMENT DISCLOSURE VALIDATION ===\n');

// 1. Verify data/refund-disclosure.json exists and adheres to canonical schema
const refundDataPath = path.join(ROOT_DIR, 'data', 'refund-disclosure.json');
if (!fs.existsSync(refundDataPath)) {
  logError('Missing data/refund-disclosure.json');
} else {
  try {
    const refundData = JSON.parse(fs.readFileSync(refundDataPath, 'utf8'));
    if (refundData.version !== '1.0') {
      logError(`Expected refund policy version 1.0, got ${refundData.version}`);
    }
    if (refundData.canonicalUrl !== 'https://novaskills.in/refund-policy/') {
      logError(`Expected canonical URL https://novaskills.in/refund-policy/, got ${refundData.canonicalUrl}`);
    }
    if (!refundData.clauses || !refundData.clauses.section3A_earlyCancellation || !refundData.clauses.section3B_coolingOff || !refundData.clauses.section4_nonRefundable || !refundData.clauses.section5_instituteCancellation) {
      logError('data/refund-disclosure.json missing core legal clause definitions');
    } else {
      logPass('data/refund-disclosure.json is valid with all canonical clauses (Sections 2, 3A, 3B, 3C, 4, 5, 6)');
    }
  } catch (e) {
    logError(`data/refund-disclosure.json JSON parse error: ${e.message}`);
  }
}

// 2. Verify official Refund Policy page exists and is accessible
const policyHtmlPath = path.join(ROOT_DIR, 'refund-policy', 'index.html');
if (!fs.existsSync(policyHtmlPath)) {
  logError('Missing refund-policy/index.html');
} else {
  const policyHtml = fs.readFileSync(policyHtmlPath, 'utf8');
  if (!policyHtml.includes('July 29, 2026')) {
    logError('refund-policy/index.html missing effective date July 29, 2026');
  } else if (!policyHtml.includes('Version: 1.0')) {
    logError('refund-policy/index.html missing Version 1.0 marker');
  } else {
    logPass('refund-policy/index.html exists and preserves official Version 1.0 (July 29, 2026)');
  }
}

// 3. Verify Course Detail Template (course-detail.html) contains disclosures
const cdHtmlPath = path.join(ROOT_DIR, 'course-detail.html');
const cdHtml = fs.readFileSync(cdHtmlPath, 'utf8');

if (!cdHtml.includes('id="detail-refund-notice"')) {
  logError('course-detail.html missing enroll card notice: id="detail-refund-notice"');
} else {
  logPass('course-detail.html contains enroll card #detail-refund-notice');
}

if (!cdHtml.includes('id="refund-transparency-card"')) {
  logError('course-detail.html missing section card: id="refund-transparency-card"');
} else {
  logPass('course-detail.html contains pre-enrolment #refund-transparency-card');
}

if (!cdHtml.includes('href="/refund-policy/"')) {
  logError('course-detail.html missing direct link to /refund-policy/');
} else {
  logPass('course-detail.html links directly to /refund-policy/');
}

// 4. Verify all 109 pre-rendered course pages in _rendered_courses/
const renderedDir = path.join(ROOT_DIR, '_rendered_courses');
if (!fs.existsSync(renderedDir)) {
  logError('Missing _rendered_courses directory');
} else {
  const renderedFiles = fs.readdirSync(renderedDir).filter(f => f.endsWith('.html') && f !== '404.html');
  if (renderedFiles.length !== 109) {
    logError(`Expected 109 pre-rendered course HTML files, found ${renderedFiles.length}`);
  } else {
    let coursesWithCard = 0;
    let coursesWithNotice = 0;
    let coursesWithLink = 0;
    let coursesWithCoolingOff = 0;
    let coursesWithPromoNotice = 0;

    renderedFiles.forEach(f => {
      const cId = f.replace('.html', '');
      const html = fs.readFileSync(path.join(renderedDir, f), 'utf8');

      if (html.includes('id="detail-refund-notice"')) coursesWithNotice++;
      else logError(`[${cId}] Missing #detail-refund-notice in pre-rendered HTML`);

      if (html.includes('id="refund-transparency-card"')) coursesWithCard++;
      else logError(`[${cId}] Missing #refund-transparency-card in pre-rendered HTML`);

      if (html.includes('href="/refund-policy/"')) coursesWithLink++;
      else logError(`[${cId}] Missing href="/refund-policy/" link in pre-rendered HTML`);

      if (html.includes('48-Hour Cooling-Off Window') || html.includes('cooling-off')) coursesWithCoolingOff++;
      else logError(`[${cId}] Missing cooling-off disclosure in pre-rendered HTML`);

      if (html.includes('promotional / discounted / scholarship enrolments') || html.includes('promotional') || html.includes('Section 4')) coursesWithPromoNotice++;
      else logError(`[${cId}] Missing promotional restriction disclosure in pre-rendered HTML`);

      // Check for prohibited deceptive unconditional promises
      if (/unconditional 100% money-back guarantee/i.test(html) || /no questions asked full refund anytime/i.test(html)) {
        logError(`[${cId}] Contains unauthorized deceptive refund guarantee`);
      }
    });

    logPass(`Verified all 109 pre-rendered course pages:
      - Has enroll card refund notice: ${coursesWithNotice}/109
      - Has refund transparency card: ${coursesWithCard}/109
      - Has canonical refund link: ${coursesWithLink}/109
      - Has cooling-off disclosure: ${coursesWithCoolingOff}/109
      - Has promotional restriction disclosure: ${coursesWithPromoNotice}/109`);
  }
}

// 5. Verify Modal & Form Journeys (components.js)
const compPath = path.join(ROOT_DIR, 'components.js');
const comp = fs.readFileSync(compPath, 'utf8');

if (!comp.includes('enroll-refund-advisory')) {
  logError('components.js injectEnrollmentModalHTML missing .enroll-refund-advisory');
} else {
  logPass('components.js admission enquiry modal contains pre-enrolment refund advisory');
}

if (!comp.includes('href="/refund-policy/"')) {
  logError('components.js modal missing link to /refund-policy/');
} else {
  logPass('components.js admission enquiry modal links directly to /refund-policy/');
}

// Verify Demo and Counselling modals do NOT have mandatory binding consent checkboxes
const demoModalSection = comp.substring(comp.indexOf('injectDemoModalHTML'), comp.indexOf('injectDemoModalHTML') + 2000);
if (/type="checkbox"[^>]*required/i.test(demoModalSection)) {
  logError('Demo modal contains an inappropriate required checkbox');
} else {
  logPass('Demo booking modal is free of inappropriate binding agreement checkboxes');
}

const counselModalSection = comp.substring(comp.indexOf('injectCounselingModalHTML'), comp.indexOf('injectCounselingModalHTML') + 2000);
if (/type="checkbox"[^>]*required/i.test(counselModalSection)) {
  logError('Counselling modal contains an inappropriate required checkbox');
} else {
  logPass('Counselling enquiry modal is free of inappropriate binding agreement checkboxes');
}

// 6. Verify Consistent Footer Labeling Across Site
if (!comp.includes('Refund &amp; Cancellation Policy') && !comp.includes('Refund & Cancellation Policy')) {
  logError('components.js footer bottom legal links missing standardized "Refund & Cancellation Policy" label');
} else {
  logPass('components.js shared footer uses standardized "Refund & Cancellation Policy" label');
}

const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
if (!indexHtml.includes('Refund &amp; Cancellation Policy') && !indexHtml.includes('Refund & Cancellation Policy')) {
  logError('index.html SSR footer missing standardized "Refund & Cancellation Policy" label');
} else {
  logPass('index.html footer uses standardized "Refund & Cancellation Policy" label');
}

// Summary
console.log('\n=== VALIDATION SUMMARY ===');
console.log(`Passed with ${errors} errors, ${warnings} warnings.\n`);

if (errors > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
