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

console.log('=== P1-6 COURSE COST & FINANCING TRANSPARENCY VALIDATION ===\n');

// 1. Verify data/financing-options.json exists and has required structure
const financingPath = path.join(ROOT_DIR, 'data', 'financing-options.json');
if (!fs.existsSync(financingPath)) {
  logError('Missing data/financing-options.json');
} else {
  try {
    const finData = JSON.parse(fs.readFileSync(financingPath, 'utf8'));
    if (!finData.policies || !finData.policies.tier1ShortCourses || !finData.policies.tier2MediumPrograms || !finData.policies.tier3MasteryPrograms) {
      logError('data/financing-options.json missing required tier policies');
    } else {
      logPass('data/financing-options.json is valid with all 3 duration tiers');
    }
  } catch (e) {
    logError(`data/financing-options.json JSON parse error: ${e.message}`);
  }
}

// 2. Verify data/tools-and-services.json exists and has required structure
const toolsPath = path.join(ROOT_DIR, 'data', 'tools-and-services.json');
if (!fs.existsSync(toolsPath)) {
  logError('Missing data/tools-and-services.json');
} else {
  try {
    const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
    if (!toolsData.accessModels || !toolsData.fourPillarFramework || !toolsData.toolsRegistry) {
      logError('data/tools-and-services.json missing required sections (accessModels, fourPillarFramework, toolsRegistry)');
    } else {
      logPass(`data/tools-and-services.json is valid with ${Object.keys(toolsData.toolsRegistry).length} registered tools`);
    }
  } catch (e) {
    logError(`data/tools-and-services.json JSON parse error: ${e.message}`);
  }
}

// 3. Verify sitewide files do not contain unqualified blanket "0% EMI" promises
const sitewideChecks = [
  { file: 'index.html', prohibited: /0%\s*emi\s*options\s*through\s*our\s*banking/i },
  { file: 'contact/index.html', prohibited: /easy\s*zero-cost\s*installment/i },
  { file: 'worker/src/data/faq.json', prohibited: /0%\s*interest\s*to\s*ensure\s*affordable/i },
  { file: 'worker/src/services/prompt.js', prohibited: /0%\s*Interest\s*No-Cost\s*EMI/i }
];

sitewideChecks.forEach(({ file, prohibited }) => {
  const fullPath = path.join(ROOT_DIR, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (prohibited.test(content)) {
      logError(`${file} contains unqualified/blanket 0% EMI claim: match "${content.match(prohibited)[0]}"`);
    } else {
      logPass(`${file} has compliant financing copy`);
    }
  }
});

// 4. Verify all 109 courses in data/courses and data/curricula
const coursesDir = path.join(ROOT_DIR, 'data', 'courses');
const curriculaDir = path.join(ROOT_DIR, 'data', 'curricula');

const courseFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('.json'));
if (courseFiles.length !== 109) {
  logError(`Expected 109 courses in data/courses, found ${courseFiles.length}`);
} else {
  logPass(`Found all 109 courses in data/courses`);
}

function getTier(durationStr, durationMonths) {
  if (durationMonths) {
    if (durationMonths <= 1.5) return 'tier1';
    if (durationMonths <= 4) return 'tier2';
    return 'tier3';
  }
  const str = (durationStr || '').toLowerCase();
  const mMatch = str.match(/(\d+)\s*month/);
  if (mMatch) {
    const m = parseInt(mMatch[1]);
    if (m <= 1) return 'tier1';
    if (m <= 4) return 'tier2';
    return 'tier3';
  }
  const wMatch = str.match(/(\d+)\s*week/);
  if (wMatch) {
    const w = parseInt(wMatch[1]);
    if (w <= 6) return 'tier1';
    return 'tier2';
  }
  return 'tier1';
}

let tierCounts = { tier1: 0, tier2: 0, tier3: 0 };
let checkedCourses = 0;

courseFiles.forEach(f => {
  const cId = f.replace('.json', '');
  const course = JSON.parse(fs.readFileSync(path.join(coursesDir, f), 'utf8'));
  const tier = getTier(course.duration, course.duration_months);
  tierCounts[tier]++;
  checkedCourses++;

  const currFile = path.join(curriculaDir, f);
  if (fs.existsSync(currFile)) {
    const curr = JSON.parse(fs.readFileSync(currFile, 'utf8'));
    (curr.faq || []).forEach((faq, idx) => {
      const q = faq.question || faq.q || '';
      const a = faq.answer || faq.a || '';

      // Check Tier 1 short courses for prohibited "₹X/mo" EMI promises
      if (tier === 'tier1') {
        if (/₹\s*[\d,]+\s*\/\s*mo(nth)?/i.test(a)) {
          logError(`[${cId}] Short course FAQ #${idx} advertises numerical monthly EMI: "${a.substring(0, 80)}"`);
        }
      }

      // Check that non-fee questions were not overwritten with tuition fee text
      if (/prerequisite|workflow|knowledge|difference|what is gemini|merchant center|feedback|editorial backbone|connects and platform|client pushback/i.test(q)) {
        if (a.startsWith('The approved regular tuition fee for') || a.startsWith('The launch fee for')) {
          logError(`[${cId}] Technical question FAQ #${idx} "${q}" has generic fee boilerplate`);
        }
      }

      // Check GST accuracy if GST is calculated
      if (a.includes('Goods and Services Tax (GST) applies') && a.includes('base launch fee is ₹')) {
        const launchFee = course.launch_fee || course.price;
        const expectedGst = Math.round(launchFee * 0.18);
        const expectedTotal = launchFee + expectedGst;
        if (!a.includes(`₹${expectedGst.toLocaleString('en-IN')}`)) {
          logError(`[${cId}] GST calculation in FAQ #${idx} mismatch: expected ₹${expectedGst.toLocaleString('en-IN')}`);
        }
        if (!a.includes(`₹${expectedTotal.toLocaleString('en-IN')}`)) {
          logError(`[${cId}] Total calculation in FAQ #${idx} mismatch: expected ₹${expectedTotal.toLocaleString('en-IN')}`);
        }
      }
    });
  }
});

logPass(`Checked ${checkedCourses} courses: Tier 1 = ${tierCounts.tier1}, Tier 2 = ${tierCounts.tier2}, Tier 3 = ${tierCounts.tier3}`);

// 5. Check course-detail.html has cost-transparency-section
const cdHtml = fs.readFileSync(path.join(ROOT_DIR, 'course-detail.html'), 'utf8');
if (!cdHtml.includes('id="cost-transparency-section"')) {
  logError('course-detail.html missing id="cost-transparency-section"');
} else {
  logPass('course-detail.html contains #cost-transparency-section container');
}

// Summary
console.log('\n=== VALIDATION SUMMARY ===');
console.log(`Passed with ${errors} errors, ${warnings} warnings.\n`);

if (errors > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
