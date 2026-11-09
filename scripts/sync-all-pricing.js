const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const masterMapping = require('./Nova_Skills_109_Course_Master_Mapping.json');

const masterCourses = masterMapping.courses;
console.log(`Loaded ${masterCourses.length} courses from master mapping.`);

const mappingById = new Map();
masterCourses.forEach(m => mappingById.set(m.stable_id, m));

// -------------------------------------------------------------
// STEP 1: Synchronize data.js
// -------------------------------------------------------------
console.log('\n--- STEP 1: Synchronizing data.js ---');
const dataJsPath = path.join(ROOT_DIR, 'data.js');
let { NS_ACADEMIES, NS_COURSES } = require(dataJsPath);

function syncCourseObject(c) {
  const m = mappingById.get(c.id);
  if (!m) {
    throw new Error(`Course not found in master mapping: ${c.id}`);
  }

  c.regular_price = m.regular_fee;
  c.regular_fee = m.regular_fee;
  c.regularPrice = m.regular_fee;
  c.originalFee = m.regular_fee;
  c.effective_price = m.effective_fee;
  c.price = m.effective_fee;
  c.fee = m.effective_fee;
  c.offer_active = m.offer_active;

  if (m.offer_active) {
    c.originalPrice = m.regular_fee;
    c.launch_price = m.launch_fee;
    c.launch_fee = m.launch_fee;
    c.launchBatchFee = m.launch_fee;
    c.discount = Math.round(((m.regular_fee - m.launch_fee) / m.regular_fee) * 100);
  } else {
    c.originalPrice = m.regular_fee;
    c.launch_price = null;
    c.launch_fee = null;
    c.launchBatchFee = null;
    c.discount = 0;
  }
}

NS_COURSES.forEach(c => syncCourseObject(c));
NS_ACADEMIES.forEach(acad => {
  (acad.courses || []).forEach(c => syncCourseObject(c));
});

const dataJsContent = `// Nova Skills Master Course Data & Academy Registry
const NS_ACADEMIES = ${JSON.stringify(NS_ACADEMIES, null, 2)};

const NS_COURSES = ${JSON.stringify(NS_COURSES, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NS_ACADEMIES, NS_COURSES };
}
`;

fs.writeFileSync(dataJsPath, dataJsContent, 'utf8');
console.log('✅ data.js synchronized successfully.');

// -------------------------------------------------------------
// STEP 2: Synchronize nova-skills-109-course-content.json
// -------------------------------------------------------------
console.log('\n--- STEP 2: Synchronizing nova-skills-109-course-content.json ---');
const contentJsonPath = path.join(ROOT_DIR, 'nova-skills-109-course-content.json');
if (fs.existsSync(contentJsonPath)) {
  const contentData = JSON.parse(fs.readFileSync(contentJsonPath, 'utf8'));
  const list = Array.isArray(contentData) ? contentData : (contentData.courses || []);
  list.forEach(c => {
    const id = c.course_id || c.id;
    const m = mappingById.get(id);
    if (!m) return;

    c.regular_price = m.regular_fee;
    c.regular_fee = m.regular_fee;
    c.regularPrice = m.regular_fee;
    c.originalFee = m.regular_fee;
    c.originalPrice = m.regular_fee;
    c.original_price = m.regular_fee;
    c.effective_price = m.effective_fee;
    c.price = m.effective_fee;
    c.fee = m.effective_fee;
    c.offer_active = m.offer_active;

    if (m.offer_active) {
      c.launch_price = m.launch_fee;
      c.launch_fee = m.launch_fee;
      c.discount = Math.round(((m.regular_fee - m.launch_fee) / m.regular_fee) * 100);
    } else {
      c.launch_price = null;
      c.launch_fee = null;
      c.discount = 0;
    }
  });

  fs.writeFileSync(contentJsonPath, JSON.stringify(contentData, null, 2), 'utf8');
  console.log('✅ nova-skills-109-course-content.json synchronized.');
}

// -------------------------------------------------------------
// STEP 3: Synchronize data/courses/*.json and fix FAQs
// -------------------------------------------------------------
console.log('\n--- STEP 3: Synchronizing data/courses/*.json & FAQs ---');
const coursesDir = path.join(ROOT_DIR, 'data', 'courses');
const courseFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('.json'));

let updatedFaqCount = 0;

courseFiles.forEach(file => {
  const courseId = file.replace('.json', '');
  const m = mappingById.get(courseId);
  if (!m) return;

  const filePath = path.join(coursesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.regular_price = m.regular_fee;
  data.regular_fee = m.regular_fee;
  data.originalPrice = m.regular_fee;
  data.originalFee = m.regular_fee;
  data.original_price = m.regular_fee;
  data.effective_price = m.effective_fee;
  data.price = m.effective_fee;
  data.fee = m.effective_fee;
  data.offer_active = m.offer_active;

  if (m.offer_active) {
    data.launch_price = m.launch_fee;
    data.launch_fee = m.launch_fee;
    data.discount = Math.round(((m.regular_fee - m.launch_fee) / m.regular_fee) * 100);
  } else {
    data.launch_price = null;
    data.launch_fee = null;
    data.discount = 0;
  }

  // Synchronize FAQs
  const faqs = data.faqs || data.faq;
  if (Array.isArray(faqs)) {
    faqs.forEach(faq => {
      const q = faq.q || faq.question || '';
      let a = faq.a || faq.answer || '';
      const isFeeFaq = (
        q.toLowerCase().includes('fee') ||
        q.toLowerCase().includes('tuition') ||
        q.toLowerCase().includes('cost') ||
        q.toLowerCase().includes('price') ||
        q.toLowerCase().includes('emi')
      );

      // Remove any outdated 84,999 reference
      if (a.includes('84,999') || a.includes('84999')) {
        a = a.replace(/84,999/g, m.regular_fee.toLocaleString('en-IN')).replace(/84999/g, String(m.regular_fee));
        updatedFaqCount++;
      }

      if (isFeeFaq) {
        const regFormatted = '₹' + m.regular_fee.toLocaleString('en-IN');
        const launchFormatted = m.offer_active ? ('₹' + m.launch_fee.toLocaleString('en-IN')) : null;
        const gstLaunch = m.offer_active ? Math.round(m.launch_fee * 0.18) : Math.round(m.regular_fee * 0.18);
        const totalWithGst = m.offer_active ? (m.launch_fee + gstLaunch) : (m.regular_fee + gstLaunch);
        const gstLaunchFormatted = '₹' + gstLaunch.toLocaleString('en-IN');
        const totalWithGstFormatted = '₹' + totalWithGst.toLocaleString('en-IN');

        if (m.offer_active) {
          // If the answer only mentions regular fee or wrong prices, rewrite it cleanly
          if (!a.includes(launchFormatted) || a.includes('0% fake discount') || a.includes('zero fabricated discount') || a.includes('0% artificial discount') || a.includes('flat, transparent')) {
            const courseName = data.course_name || data.name || m.final_course_name;
            a = `The approved regular tuition fee for ${courseName} is ${regFormatted} (statutory 18% GST extra). Under our current introductory launch offer, an approved launch fee of ${launchFormatted} is available. With statutory 18% GST (${gstLaunchFormatted}), the total payable fee is ${totalWithGstFormatted}. Flexible monthly installment (EMI) options are available through approved academic banking partners.`;
            updatedFaqCount++;
          }
        } else {
          // Non-discounted course
          if (!a.includes(regFormatted)) {
            const courseName = data.course_name || data.name || m.final_course_name;
            a = `The approved transparent course fee for ${courseName} is ${regFormatted} (statutory 18% GST extra). Nova Skills maintains absolute pricing integrity with zero hidden administrative fees. Flexible installment options are available.`;
            updatedFaqCount++;
          }
        }

        if (faq.a !== undefined) faq.a = a;
        if (faq.answer !== undefined) faq.answer = a;
      }
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log(`✅ All ${courseFiles.length} course JSON files synchronized. Updated ${updatedFaqCount} FAQ entries.`);

// -------------------------------------------------------------
// STEP 4: Synchronize components.js COURSE_CATALOG_METADATA
// -------------------------------------------------------------
console.log('\n--- STEP 4: Synchronizing components.js COURSE_CATALOG_METADATA ---');
const componentsJsPath = path.join(ROOT_DIR, 'components.js');
let compContent = fs.readFileSync(componentsJsPath, 'utf8');

// Build a clean metadata table for the courses in COURSE_CATALOG_METADATA
const metaMap = {
  'No-Code Website Professional': '₹19,900',
  'E-Commerce Website Mastery': '₹49,900',
  'Professional Video Editing': '₹24,900',
  'AI-Integrated Video Editing & Motion Graphics Professional': '₹49,900',
  'Generative AI Video Production Professional': '₹24,900',
  'AI-Assisted Full Stack Web Development': '₹44,900',
  'AI Web Development Professional': '₹44,900',
  'Full Stack Programming Foundation': '₹29,999',
  'Python Developer Professional': '₹14,999',
  'Creative Design Master': '₹44,900',
  'Creative Design Mastery': '₹44,900',
  'Graphic Design Professional': '₹24,900',
  'UI/UX Design Professional': '₹34,900',
  'AI Solutions Engineering & Agentic AI Mastery': '₹64,900',
  'AI Productivity Professional': '₹14,900',
  'AI for Business Professional': '₹29,900',
  'AI Digital Marketing Professional': '₹19,900',
  'AI Digital Marketing Specialist': '₹19,900',
  'AI Mastery Program': '₹64,900',
  'Motion Graphics Mastery': '₹39,999',
  'AI Digital Marketing Mastery': '₹34,900',
  'AI Digital Marketing Strategist': '₹34,900'
};

for (const [name, fee] of Object.entries(metaMap)) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`('${escapedName}'\\s*:\\s*{[^}]*fee:\\s*')[^']+(')`);
  if (regex.test(compContent)) {
    compContent = compContent.replace(regex, `$1${fee}$2`);
  }
}

fs.writeFileSync(componentsJsPath, compContent, 'utf8');
console.log('✅ components.js updated with accurate launch prices.');

// -------------------------------------------------------------
// STEP 5: Synchronize index.html Featured Courses Section
// -------------------------------------------------------------
console.log('\n--- STEP 5: Synchronizing index.html Featured Course Cards ---');
const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Fix Card 2: ai-mastery (remove duplicate original/off spans, fix current to ₹64,900, orig to ₹89,900, off to 28% OFF)
const aiMasteryOldRegex = /<span class="price-current">₹44,900<\/span>\s*<span class="price-original">₹64,900<\/span>\s*<span class="price-off">31% OFF<\/span>\s*<span class="price-original">₹89,900<\/span>\s*<span class="price-off">28% OFF<\/span>/;
if (aiMasteryOldRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(
    aiMasteryOldRegex,
    '<span class="price-current">₹64,900</span>\n                    <span class="price-original">₹89,900</span>\n                    <span class="price-off">28% OFF</span>'
  );
  console.log('  Fixed ai-mastery pricing card in index.html');
}

// Fix Card 4: creative-design (add original ₹64,900 and 31% OFF, set current to ₹44,900)
// Search for creative-design section
const cdOld = `<span class="price-current">₹64,900</span>
                  </div>
                </div>
                <div class="course-card-actions">
                  <a href="/course-detail.html?id=creative-design" class="btn btn-outline btn-sm">View Syllabus</a>
                  <button type="button" class="btn btn-primary btn-sm btn-enroll" onclick="openEnrollmentModal('Creative Design Master', 'Design Academy', '8 Months', '₹44,900', 'creative-design')">`;

const cdNew = `<span class="price-current">₹44,900</span>
                    <span class="price-original">₹64,900</span>
                    <span class="price-off">31% OFF</span>
                  </div>
                </div>
                <div class="course-card-actions">
                  <a href="/course-detail.html?id=creative-design" class="btn btn-outline btn-sm">View Syllabus</a>
                  <button type="button" class="btn btn-primary btn-sm btn-enroll" onclick="openEnrollmentModal('Creative Design Master', 'Design Academy', '8 Months', '₹44,900', 'creative-design')">`;

if (indexHtml.includes(cdOld)) {
  indexHtml = indexHtml.replace(cdOld, cdNew);
  console.log('  Fixed creative-design card in index.html');
}

// Fix Card 5: href="motion-mastery" -> href="ai-integrated-video-editing-motion-graphics-professional"
if (indexHtml.includes('href="/course-detail.html?id=motion-mastery"')) {
  indexHtml = indexHtml.replace('href="/course-detail.html?id=motion-mastery"', 'href="/course-detail.html?id=ai-integrated-video-editing-motion-graphics-professional"');
  console.log('  Fixed motion-mastery href in index.html');
}

// Fix Card 6: dm-mastery (current: ₹34,900, orig: ₹44,900, off: 22% OFF, modal: '₹34,900')
const dmMastOld = `<span class="price-current">₹44,900</span>
                  </div>
                </div>
                <div class="course-card-actions">
                  <a href="/course-detail.html?id=dm-mastery" class="btn btn-outline btn-sm">View Syllabus</a>
                  <button type="button" class="btn btn-primary btn-sm btn-enroll" onclick="openEnrollmentModal('AI Digital Marketing Strategist', 'Digital Marketing Academy', '6 Months', '₹44,900', 'dm-mastery')">`;

const dmMastNew = `<span class="price-current">₹34,900</span>
                    <span class="price-original">₹44,900</span>
                    <span class="price-off">22% OFF</span>
                  </div>
                </div>
                <div class="course-card-actions">
                  <a href="/course-detail.html?id=dm-mastery" class="btn btn-outline btn-sm">View Syllabus</a>
                  <button type="button" class="btn btn-primary btn-sm btn-enroll" onclick="openEnrollmentModal('AI Digital Marketing Strategist', 'Digital Marketing Academy', '6 Months', '₹34,900', 'dm-mastery')">`;

if (indexHtml.includes(dmMastOld)) {
  indexHtml = indexHtml.replace(dmMastOld, dmMastNew);
  console.log('  Fixed dm-mastery card in index.html');
}

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✅ index.html updated.');

// -------------------------------------------------------------
// STEP 6: Update test-course-launch-pricing-suite.js line 120
// -------------------------------------------------------------
console.log('\n--- STEP 6: Updating test-course-launch-pricing-suite.js ---');
const testSuitePath = path.join(ROOT_DIR, 'scripts', 'test-course-launch-pricing-suite.js');
let testSuiteContent = fs.readFileSync(testSuitePath, 'utf8');
if (testSuiteContent.includes("'AI Digital Marketing Strategist', 'Digital Marketing Academy', '6 Months', '₹44,900', 'dm-mastery'")) {
  testSuiteContent = testSuiteContent.replace(
    "'AI Digital Marketing Strategist', 'Digital Marketing Academy', '6 Months', '₹44,900', 'dm-mastery'",
    "'AI Digital Marketing Strategist', 'Digital Marketing Academy', '6 Months', '₹34,900', 'dm-mastery'"
  );
  fs.writeFileSync(testSuitePath, testSuiteContent, 'utf8');
  console.log('✅ Updated test expectation for dm-mastery to ₹34,900.');
}

console.log('\n🎉 ALL SYNCHRONIZATION STEPS COMPLETED SUCCESSFULLY.');
