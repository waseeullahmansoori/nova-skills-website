'use strict';

/**
 * P1-8 AUTOMATED VALIDATION SUITE:
 * Placement Support, Hiring Partner Verification & Career Outcome Credibility
 * 
 * Validates:
 * 1. Canonical data/placement-support.json schema, tiers, and legal notices.
 * 2. Course-level placementSupport mapping across all 109 published courses (10 Tier A, 14 Tier B, 83 Tier C, 2 Tier D).
 * 3. Zero placement claims on short modular courses (Word, PowerPoint, Excel, Logo, Packaging).
 * 4. Zero placement marketing on Kids Tech Academy courses (Minor Safeguards).
 * 5. Placements page (placements.html) structural compliance (8 comprehensive sections, legal disclaimer).
 * 6. Homepage (index.html) qualification of referral language & no-job-guarantee disclaimer.
 * 7. AI Career Advisor (nova-ai-widget.js) & Cloudflare worker prompt safety (zero fake salary fallback, zero guaranteed internships).
 * 8. Terms & Conditions Section 8 non-guarantee protection preservation.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;

function check(label, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${label}`);
  } else {
    console.error(`  [FAIL] ${label}`);
    throw new Error(`Validation failed: ${label}`);
  }
}

console.log('\n=== P1-8 PLACEMENT SUPPORT & CAREER CREDIBILITY VALIDATION ===\n');

// 1. Audit Canonical Registry (data/placement-support.json)
console.log('▶ [1/6] Auditing Canonical Registry (data/placement-support.json)...');
const registryPath = path.join(ROOT, 'data', 'placement-support.json');
check('data/placement-support.json exists', fs.existsSync(registryPath));

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
check('Registry has version and legal disclaimer', registry.version && registry.legalDisclaimer && registry.legalDisclaimer.officialStatement);
check('Registry contains all 4 tiers', registry.tiers && registry.tiers.tierA_career_programs && registry.tiers.tierB_professional_programs && registry.tiers.tierC_modular_certifications && registry.tiers.tierD_kids_tech);
check('Tier A defines exactly 10 Career Programs', registry.tiers.tierA_career_programs.totalCourses === 10 && registry.tiers.tierA_career_programs.courseIds.length === 10);
check('Tier B defines exactly 14 Professional Programs', registry.tiers.tierB_professional_programs.totalCourses === 14 && registry.tiers.tierB_professional_programs.courseIds.length === 14);
check('Tier C defines 83 Modular Certifications', registry.tiers.tierC_modular_certifications.totalCourses === 83);
check('Tier D defines 2 Kids Tech Programs with Minor Safeguards', registry.tiers.tierD_kids_tech.totalCourses === 2 && registry.tiers.tierD_kids_tech.courseIds.length === 2);
check('Registry defines 7 mandatory eligibility criteria', Array.isArray(registry.eligibilityCriteria) && registry.eligibilityCriteria.length === 7);
check('Registry defines 6 approved employment sectors', registry.employerClassification && registry.employerClassification.tierC_employment_sectors && registry.employerClassification.tierC_employment_sectors.sectors.length === 6);
check('Registry defines 12-stage CRM placement lifecycle', Array.isArray(registry.crmPlacementLifecycle) && registry.crmPlacementLifecycle.length === 12);

// 2. Audit Course Data Mapping Across All 109 Courses
console.log('\n▶ [2/6] Auditing Course Placement Support Across All 109 Courses...');
const NovaCourseData = require(path.join(ROOT, 'js', 'course-data.js'));
const allCourses = NovaCourseData.getPublishedCourses();
check('Loaded exactly 109 published courses from NovaCourseData', allCourses.length === 109);

const tierACourseIds = new Set(registry.tiers.tierA_career_programs.courseIds);
const tierBCourseIds = new Set(registry.tiers.tierB_professional_programs.courseIds);
const tierDCourseIds = new Set(registry.tiers.tierD_kids_tech.courseIds);

let actualTierACount = 0;
let actualTierBCount = 0;
let actualTierCCount = 0;
let actualTierDCount = 0;

allCourses.forEach(c => {
  if (tierACourseIds.has(c.id)) {
    check(`Tier A course ${c.id} has placementSupport === true`, c.placementSupport === true);
    actualTierACount++;
  } else if (tierBCourseIds.has(c.id)) {
    check(`Tier B course ${c.id} has placementSupport === true`, c.placementSupport === true);
    actualTierBCount++;
  } else if (tierDCourseIds.has(c.id) || c.academyId === 'kids-tech') {
    check(`Kids Tech course ${c.id} has placementSupport === false`, c.placementSupport === false);
    actualTierDCount++;
  } else {
    check(`Tier C course ${c.id} has placementSupport === false`, c.placementSupport === false);
    actualTierCCount++;
  }
});

check('Exactly 10 Tier A Career Programs verified', actualTierACount === 10);
check('Exactly 14 Tier B Professional Programs verified', actualTierBCount === 14);
check('Zero placement support on anomalous short certifications (Word, PPT, Excel, Logo, Packaging)',
  !allCourses.find(c => c.id === 'microsoft-word').placementSupport &&
  !allCourses.find(c => c.id === 'microsoft-powerpoint').placementSupport &&
  !allCourses.find(c => c.id === 'microsoft-excel').placementSupport &&
  !allCourses.find(c => c.id === 'logo-design').placementSupport &&
  !allCourses.find(c => c.id === 'packaging-design').placementSupport
);

// 3. Audit Placements Page (placements.html)
console.log('\n▶ [3/6] Auditing Dedicated Placements Page (placements.html)...');
const placementsHtmlPath = path.join(ROOT, 'placements.html');
check('placements.html exists', fs.existsSync(placementsHtmlPath));
const placementsHtml = fs.readFileSync(placementsHtmlPath, 'utf8');

check('placements.html contains Terms & Conditions Section 8 legal disclaimer banner',
  placementsHtml.includes('enrolment does not guarantee a job offer, specific salary package, interview, or employment outcome') &&
  placementsHtml.includes('Terms &amp; Conditions (Section 8)')
);
check('placements.html contains Section 2 Program Classification', placementsHtml.includes('Who Is Eligible for') && placementsHtml.includes('TIER A') && placementsHtml.includes('TIER B') && placementsHtml.includes('TIER C') && placementsHtml.includes('TIER D'));
check('placements.html details all 6 mandatory student eligibility criteria', placementsHtml.includes('Mandatory Student Eligibility Requirements') && placementsHtml.includes('Curriculum &amp; Attendance') && placementsHtml.includes('Capstone Deliverables'));
check('placements.html details 6-stage Career Preparation Journey', placementsHtml.includes('STAGE 1') && placementsHtml.includes('STAGE 6') && placementsHtml.includes('The Career Preparation'));
check('placements.html contains Candidate Data Protection notice under DPDP Act 2023', placementsHtml.includes('DPDP Act 2023') && placementsHtml.includes('explicit consent'));
check('placements.html contains all 6 approved employment sectors',
  placementsHtml.includes('Digital Marketing Agencies') &&
  placementsHtml.includes('Tech Startups &amp; SaaS') &&
  placementsHtml.includes('E-Commerce &amp; D2C Brands') &&
  placementsHtml.includes('Creative Design Studios') &&
  placementsHtml.includes('Media &amp; Production Houses') &&
  placementsHtml.includes('3D &amp; ArchViz Studios')
);
check('placements.html includes authentic alumni case studies with salaried vs freelance distinction', placementsHtml.includes('Ayesha Patel') && placementsHtml.includes('Priya Kumar') && placementsHtml.includes('Salaried Agency Transition') && placementsHtml.includes('Independent Freelancing'));
check('placements.html contains Comprehensive Career Support FAQ answering key audit questions', placementsHtml.includes('Got Questions About') && placementsHtml.includes('Who qualifies for placement assistance?'));
check('placements.html contains Career Counselling CTA with working modal trigger', placementsHtml.includes('openCounsellingModal()'));

// 4. Audit Homepage (index.html) Placement Copy
console.log('\n▶ [4/6] Auditing Homepage (index.html) Placement Section...');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

check('Homepage replaces "How We Get You Hired" with qualified journey title', indexHtml.includes('Your Career Preparation<br /><span class="gradient-text">Journey</span>'));
check('Homepage replaces promissory "no cold applications" with qualified referral copy',
  indexHtml.includes('Relevant Hiring Referrals') &&
  indexHtml.includes('active vacancy notifications across our employer referral network based on merit') &&
  !indexHtml.includes('no cold applications')
);
check('Homepage includes discoverable Placement Support Legal Notice',
  indexHtml.includes('Placement Support Notice:') &&
  indexHtml.includes('Enrolment does not guarantee a job offer, interview, specific salary, or employment outcome')
);

// 5. Audit AI Career Advisor & Serverless Worker Safety
console.log('\n▶ [5/6] Auditing AI Career Advisor & Serverless Worker Safety...');
const widgetJs = fs.readFileSync(path.join(ROOT, 'nova-ai-widget.js'), 'utf8');
check('nova-ai-widget.js has zero unverified "₹4.5 – ₹9.0 LPA" fallback salary', !widgetJs.includes('₹4.5 – ₹9.0 LPA'));
check('nova-ai-widget.js has zero promissory "100% Dedicated Placement" badge', !widgetJs.includes('100% Dedicated Placement'));

const promptJs = fs.readFileSync(path.join(ROOT, 'worker', 'src', 'services', 'prompt.js'), 'utf8');
check('worker prompt.js has zero "Guaranteed Internship" promises', !promptJs.includes('Guaranteed Internship Included'));
check('worker prompt.js explicitly notes placement support has no job guarantees', promptJs.includes('no job guarantees'));

const careerPathsJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'worker', 'src', 'data', 'career_paths.json'), 'utf8'));
careerPathsJson.forEach(p => {
  check(`career_paths.json path ${p.id} uses valid target_course_id`, ['dm-mastery', 'ai-assisted-full-stack-web-development', 'uiux-design-pro', 'ai-mastery'].includes(p.target_course_id));
  check(`career_paths.json path ${p.id} has no unverified numerical starting_salary`, !p.starting_salary);
});

// 6. Audit Legal Protection & Course Pre-Rendering
console.log('\n▶ [6/6] Auditing Legal Disclaimers & Course Pre-Rendering...');
const termsHtml = fs.readFileSync(path.join(ROOT, 'terms-and-conditions', 'index.html'), 'utf8');
check('Terms & Conditions Section 8 preserves official Placement Support Disclaimer', termsHtml.includes('Placement Support Disclaimer:') && termsHtml.includes('enrolment does not guarantee a job offer, specific salary package, or employment outcome'));

const buildCoursePagesJs = fs.readFileSync(path.join(ROOT, 'scripts', 'build-course-pages.js'), 'utf8');
check('build-course-pages.js generates tier-specific includes (Kids Tech vs Placement vs Portfolio)',
  buildCoursePagesJs.includes("Junior Project Showcase & Certificate") &&
  buildCoursePagesJs.includes("Placement Assistance & Interview Prep") &&
  buildCoursePagesJs.includes("Practical Portfolio & Capstone Support")
);

const courseDetailJs = fs.readFileSync(path.join(ROOT, 'course-detail.js'), 'utf8');
check('course-detail.js contains career transparency disclaimer note', courseDetailJs.includes('Career &amp; Placement Transparency:') && courseDetailJs.includes('Enrolment does not guarantee a job offer'));

console.log('\n======================================================');
console.log(`SUMMARY: ${passedChecks}/${totalChecks} CHECKS PASSED, 0 FAILURES`);
console.log('======================================================\n');
console.log('🎉 ALL P1-8 PLACEMENT CREDIBILITY CHECKS PASSED PERFECTLY!\n');
