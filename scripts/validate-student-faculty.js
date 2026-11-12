/**
 * Nova Skills Credibility & Faculty Verification Suite (P1-5)
 * Validates Student Projects, Authentic Testimonials, and Faculty Mentors across all 109 courses and the homepage.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const { NS_COURSES, NS_ACADEMIES } = require(path.join(ROOT_DIR, 'data.js'));
const credibility = require(path.join(ROOT_DIR, 'js', 'credibility-data.js'));

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('============================================================');
console.log('🧪 P1-5 TEST SUITE: STUDENT SHOWCASE & FACULTY CREDIBILITY');
console.log('============================================================\n');

// 1. DATA INTEGRITY: MENTORS REGISTRY
console.log('▶ [1/6] Auditing Academic Mentors Registry (data/mentors.json)...');
const mentorsFile = path.join(ROOT_DIR, 'data', 'mentors.json');
assert(fs.existsSync(mentorsFile), 'data/mentors.json exists');
const mentorsData = JSON.parse(fs.readFileSync(mentorsFile, 'utf8'));
assert(Array.isArray(mentorsData.mentors) && mentorsData.mentors.length >= 12, 'Mentors registry contains at least 12 published domain mentors');

mentorsData.mentors.forEach(m => {
  assert(m.mentorId && m.displayName && m.designation && m.initials, `Mentor ${m.mentorId} has basic identity fields`);
  assert(m.bio && m.bio.length >= 20, `Mentor ${m.mentorId} has substantial academic bio`);
  assert(m.verification && m.verification.identityVerified === true, `Mentor ${m.mentorId} identity is verified`);
  assert(Array.isArray(m.assignedAcademyIds) && m.assignedAcademyIds.length > 0, `Mentor ${m.mentorId} has assigned academies`);
});

// 2. UNIVERSAL ACADEMY MAPPING (ASSERT ZERO FALLBACK BUGS)
console.log('\n▶ [2/6] Verifying Mentor Resolution Across All 109 Courses...');
let fallbackCount = 0;
let correctCount = 0;

NS_COURSES.forEach(course => {
  const mentor = credibility.getMentorByAcademyId(course.academyId);
  if (!mentor || !mentor.assignedAcademyIds.includes(course.academyId)) {
    fallbackCount++;
    console.error(`  ❌ Course ${course.id} (${course.academyId}) failed mentor resolution! Resolved: ${mentor ? mentor.displayName : 'NONE'}`);
  } else {
    correctCount++;
  }
});

assert(fallbackCount === 0, `Zero fallback errors across all 109 courses (Passed: ${correctCount}/${NS_COURSES.length})`);

// Specific check: programming, ai, design, 3d, video, office must NEVER resolve to digital marketing
const nonDMCourses = NS_COURSES.filter(c => c.academyId !== 'digital-marketing');
let wrongDMCount = 0;
nonDMCourses.forEach(c => {
  const m = credibility.getMentorByAcademyId(c.academyId);
  if (m.displayName.includes('Digital Marketing') || m.designation.includes('Performance Marketing')) {
    wrongDMCount++;
    console.error(`  ❌ Non-DM course ${c.id} (${c.academyId}) got DM mentor!`);
  }
});
assert(wrongDMCount === 0, `Assert zero non-DM courses resolve to Digital Marketing mentor (Verified: ${nonDMCourses.length} non-DM courses)`);

// 3. STUDENT PROJECTS DATA & ASSET INTEGRITY
console.log('\n▶ [3/6] Auditing Student Projects & Media Assets (data/student-projects.json)...');
const projectsFile = path.join(ROOT_DIR, 'data', 'student-projects.json');
assert(fs.existsSync(projectsFile), 'data/student-projects.json exists');
const projectsData = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
assert(Array.isArray(projectsData.projects) && projectsData.projects.length >= 4, 'Contains sample portfolio projects');

let missingAssets = 0;
projectsData.projects.forEach(p => {
  assert(p.projectId && p.title && p.caseStudy && p.caseStudy.problem && p.caseStudy.solution && p.caseStudy.deliverables, `Project ${p.projectId} has complete case study`);
  assert(p.status === 'published-as-sample', `Project ${p.projectId} is clearly marked published-as-sample`);
  assert(p.displayLabel === 'Example Portfolio Project', `Project ${p.projectId} has explicit non-deceptive label`);

  // Verify media asset files exist on disk
  if (p.media) {
    if (p.media.cardImage) {
      const diskPath = path.join(ROOT_DIR, p.media.cardImage.replace(/^\//, ''));
      if (!fs.existsSync(diskPath)) {
        missingAssets++;
        console.error(`  ❌ Missing card image: ${diskPath}`);
      }
    }
    if (p.media.desktopImage) {
      const diskPath = path.join(ROOT_DIR, p.media.desktopImage.replace(/^\//, ''));
      if (!fs.existsSync(diskPath)) {
        missingAssets++;
        console.error(`  ❌ Missing desktop image: ${diskPath}`);
      }
    }
  }
});
assert(missingAssets === 0, 'All referenced project image files exist on disk');

// 4. STUDENT TESTIMONIALS & AUTHENTICITY AUDIT
console.log('\n▶ [4/6] Auditing Student Testimonials (data/student-testimonials.json)...');
const testimonialsFile = path.join(ROOT_DIR, 'data', 'student-testimonials.json');
assert(fs.existsSync(testimonialsFile), 'data/student-testimonials.json exists');
const testimonialsData = JSON.parse(fs.readFileSync(testimonialsFile, 'utf8'));
assert(Array.isArray(testimonialsData.testimonials) && testimonialsData.testimonials.length >= 8, 'Contains verified student testimonials');

testimonialsData.testimonials.forEach(t => {
  assert(t.testimonialId && t.student && t.student.displayName && t.testimonial.quote, `Testimonial ${t.testimonialId} has required fields`);
  assert(t.verification && t.verification.identityVerified === true, `Testimonial ${t.testimonialId} identity is verified`);
  assert(t.permission && t.permission.quotePublicationApproved === true, `Testimonial ${t.testimonialId} publication is approved`);

  if (t.scope === 'course-specific') {
    assert(t.student.courseId, `Course-specific testimonial ${t.testimonialId} references valid courseId`);
    const courseExists = NS_COURSES.some(c => c.id === t.student.courseId);
    assert(courseExists, `Course ${t.student.courseId} exists in Nova Skills catalog`);
  }
});

// 5. PRE-RENDERED STATIC COURSE PAGES FORENSIC CHECK
console.log('\n▶ [5/6] Verifying Pre-rendered Static Pages (_rendered_courses/*.html)...');
const staticDir = path.join(ROOT_DIR, '_rendered_courses');
assert(fs.existsSync(staticDir), '_rendered_courses directory exists');

const renderedFiles = fs.readdirSync(staticDir).filter(f => f.endsWith('.html') && f !== '404.html');
assert(renderedFiles.length === 109, `All 109 pre-rendered course HTML pages exist (Found: ${renderedFiles.length})`);

let bogusRatingFound = 0;
let staticFallbackFound = 0;

renderedFiles.forEach(file => {
  const content = fs.readFileSync(path.join(staticDir, file), 'utf8');
  const courseId = file.replace('.html', '');
  const course = NS_COURSES.find(c => c.id === courseId);
  if (!course) return;

  // Check that rating row does NOT have manufactured strings
  if (content.includes('student reviews) •') && !content.includes('Verified Course Review')) {
    bogusRatingFound++;
    console.error(`  ❌ Fabricated rating row found in ${file}`);
  }

  // Check mentors
  const expectedMentor = credibility.getMentorByAcademyId(course.academyId);
  if (course.academyId !== 'digital-marketing' && content.includes('Growth & Ads Lead Mentor')) {
    staticFallbackFound++;
    console.error(`  ❌ Obsolete mentor fallback found in ${file}`);
  }
});

assert(bogusRatingFound === 0, 'Zero fabricated review counts in pre-rendered rating rows');
assert(staticFallbackFound === 0, 'Zero pre-rendered pages have obsolete mentor fallback bug');

// 6. HOMEPAGE INTEGRATION & MODAL SYSTEM
console.log('\n▶ [6/6] Verifying Homepage & Component System Integration...');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
assert(indexHtml.includes('Student Portfolio <span class="gradient-text">Showcase</span>'), 'Homepage has authentic Student Portfolio Showcase header');
assert(indexHtml.includes('Meet Our Mentors &amp;<br /><span class="gradient-text">Academic Experts</span>'), 'Homepage has Meet Our Mentors & Academic Experts header');
assert(indexHtml.includes("openProjectModal('proj-dm-01')"), 'Homepage project card 1 links to project modal');
assert(indexHtml.includes("openProjectModal('proj-fs-01')"), 'Homepage project card 2 links to project modal');
assert(indexHtml.includes("openProjectModal('proj-gd-01')"), 'Homepage project card 3 links to project modal');
assert(indexHtml.includes("openProjectModal('proj-nc-01')"), 'Homepage project card 4 links to project modal');
assert(indexHtml.includes('/courses.html?academy=digital-marketing'), 'Homepage mentor card 1 links to academy courses');
assert(indexHtml.includes('/courses.html?academy=ai'), 'Homepage mentor card 2 links to academy courses');
assert(indexHtml.includes('/courses.html?academy=design'), 'Homepage mentor card 3 links to academy courses');
assert(indexHtml.includes('/courses.html?academy=video'), 'Homepage mentor card 4 links to academy courses');
assert(indexHtml.includes('/js/credibility-data.min.js'), 'Homepage loads credibility-data.min.js');

const componentsJs = fs.readFileSync(path.join(ROOT_DIR, 'components.js'), 'utf8');
assert(componentsJs.includes('function injectProjectModalHTML'), 'components.js defines injectProjectModalHTML');
assert(componentsJs.includes('function openProjectModal'), 'components.js defines openProjectModal');
assert(componentsJs.includes('function closeProjectModal'), 'components.js defines closeProjectModal');

const mainCss = fs.readFileSync(path.join(ROOT_DIR, 'css', 'main.css'), 'utf8');
assert(mainCss.includes('.project-modal-backdrop'), 'css/main.css contains .project-modal-backdrop styles');
assert(mainCss.includes('.project-modal-dialog'), 'css/main.css contains .project-modal-dialog styles');

console.log('\n============================================================');
console.log(`📊 FINAL SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('============================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL P1-5 CREDIBILITY & FACULTY CHECKS PASSED PERFECTLY!\n');
  process.exit(0);
}
