/**
 * ============================================================
 * NOVA SKILLS — CLAIM VERIFICATION REGISTER GENERATOR (PHASE 0)
 * ============================================================
 * Audits all public claims across Homepage, Catalog, Academies,
 * Courses, Locations, Placements, FAQs, and Legal pages.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SEO_DOCS_DIR = path.join(ROOT_DIR, 'docs', 'seo');

const claims = [
  {
    id: 'CLM-001',
    category: 'Course & Academy Count',
    claimStatement: 'Nova Skills offers 109 professional certification courses across 12 academies',
    surfacesFound: 'Homepage, /courses, /academies/, sitemap.xml, site footer',
    canonicalSource: 'data/courses.json (109 published courses), data.js (12 academies)',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'None. All 12 academies and 109 courses match canonical data.',
    riskSeverity: 'Low',
    recommendedAction: 'Preserve 109/12 metric consistency site-wide.'
  },
  {
    id: 'CLM-002',
    category: 'Tuition Starting Price',
    claimStatement: 'Modular professional courses start from ₹2,900 (+ 18% GST)',
    surfacesFound: 'Homepage hero badge, course catalog filter, fee disclosures',
    canonicalSource: 'data/courses.json (approvedStartingPrice: 2900)',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'Legacy crawl occasionally observed ₹2,999 due to old promotional copy; canonical registry enforces ₹2,900.',
    riskSeverity: 'Medium',
    recommendedAction: 'Ensure no residual ₹2,999 marketing copy remains on any landing page or ad campaign.'
  },
  {
    id: 'CLM-003',
    category: 'Tax & GST Disclosure',
    claimStatement: 'All displayed tuition fees exclude 18% GST; GST is computed transparently at checkout',
    surfacesFound: 'Course detail pricing tables, catalog cards, checkout/admissions modal',
    canonicalSource: 'data/courses.json, scripts/validate-course-pricing.js',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'None. All pricing displays explicitly indicate "+ 18% GST" or "excl. GST" with no contradictory tax claims.',
    riskSeverity: 'Low',
    recommendedAction: 'Maintain strict 18% GST notation across all new course landing pages.'
  },
  {
    id: 'CLM-004',
    category: 'Course Duration & Hours (DM Specialist)',
    claimStatement: 'AI Digital Marketing Specialist (dm-professional) is 3 Months (12 teaching weeks, 120 guided hours)',
    surfacesFound: '/course-detail.html?id=dm-professional, academies/digital-marketing/',
    canonicalSource: 'data/courses/dm-professional.json, data/courses.json',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'Resolved. Previous crawl noted 4 months / 15 projects on legacy homepage text; now standardized to 3 Months / 120 hrs across all files.',
    riskSeverity: 'Low',
    recommendedAction: 'Preserve 3-month (120 guided hours) specification.'
  },
  {
    id: 'CLM-005',
    category: 'Full Stack Capstone Hierarchy',
    claimStatement: 'AI-Assisted Full Stack Web Development includes 8 evaluated projects (4 core, 1 specialization, 1 enterprise capstone with Viva Voce)',
    surfacesFound: '/course-detail.html?id=ai-assisted-full-stack-web-development',
    canonicalSource: 'data/courses/ai-assisted-full-stack-web-development.json, docs/p0-3-full-stack-project-count-audit.md',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'Resolved. Previous marketing text claimed "14 Capstones" by counting alternative elective modules; now standardized to 8 evaluated projects.',
    riskSeverity: 'Low',
    recommendedAction: 'Ensure admissions advisors explain the 4+1+1 project structure consistently.'
  },
  {
    id: 'CLM-006',
    category: 'Indore Learning Location Guided Hours',
    claimStatement: 'Full Stack Web Development in Indore represents 8 Months (320 Guided Hours)',
    surfacesFound: 'branches/indore/index.html',
    canonicalSource: 'lib/locations/location-course-resolver.js, data/courses.json',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'Resolved. Indore page previously cited 160 hours due to a legacy syllabus template; updated to 320 hours.',
    riskSeverity: 'Low',
    recommendedAction: 'Preserve canonical 320 guided hours across all city hubs.'
  },
  {
    id: 'CLM-007',
    category: 'Physical Campus vs Online Locations',
    claimStatement: 'Nova Skills operates one physical classroom campus in Siddharth Nagar, UP; 36 city pages represent Live-Online learning areas',
    surfacesFound: 'Homepage footer, contact/index.html, branches/ directory, 36 city pages',
    canonicalSource: 'contact/index.html, lib/locations/location-seo-contract.js',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'City pages clearly specify Live-Online interactive delivery with single Siddharth Nagar physical campus. No fake LocalBusiness schemas on city pages.',
    riskSeverity: 'High (if violated)',
    recommendedAction: 'Strictly prohibit creating Google Business Profiles or LocalBusiness structured data for the 36 online-only city hubs.'
  },
  {
    id: 'CLM-008',
    category: 'Student Testimonials & Attribution',
    claimStatement: 'Student reviews and testimonials reflect authentic course graduates',
    surfacesFound: '_rendered_courses/*.html (104 course pages)',
    canonicalSource: 'js/credibility-data.js, data/mentors.json',
    verificationStatus: 'Discrepancy / Action Required (P0)',
    discrepancyObserved: 'CRITICAL AUDIT FINDING: "Rohit M." and "Pooja S." testimonials are duplicated identically across 104 course pages regardless of discipline.',
    riskSeverity: 'Critical (E-E-A-T & Trust)',
    recommendedAction: 'Implement Phase 6 credibility enhancement: replace duplicated reviews with domain-specific testimonials from real cohorts or show academy-level proof.'
  },
  {
    id: 'CLM-009',
    category: 'Placement Support Claims',
    claimStatement: 'Placement assistance is provided for eligible Career and Professional programs under 4-tier criteria; no 100% job guarantees',
    surfacesFound: 'placements.html, homepage placement section, course-detail.html',
    canonicalSource: 'data/placement-support.json, terms-and-conditions/index.html (Section 8)',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'Resolved. Absolute "100% Guaranteed Placement" wording has been neutralized to "Dedicated Placement Assistance with 7 Eligibility Criteria".',
    riskSeverity: 'Medium',
    recommendedAction: 'Maintain legal disclaimer banner on /placements and ensure marketing never re-introduces promissory placement claims.'
  },
  {
    id: 'CLM-010',
    category: 'Student Enrolment Numbers',
    claimStatement: 'Promotional claims of "5,000+ Students Trained" or "India\'s #1 Skills Institute"',
    surfacesFound: 'Homepage hero badges, marketing banners',
    canonicalSource: 'Institutional student records (Admissions)',
    verificationStatus: 'Requires Business Approval',
    discrepancyObserved: 'Superlative claims ("#1 Skills Institute", "5,000+ Students") lack third-party audit citations or verified registry backing in the public repository.',
    riskSeverity: 'High (ASCI / Consumer Protection)',
    recommendedAction: 'Replace unverified superlatives with factual evidence-based statements: "Comprehensive 109-course curriculum", "12 specialized academies", "Live mentor feedback".'
  },
  {
    id: 'CLM-011',
    category: 'Free Demo & Trial Classes',
    claimStatement: 'Students can request a 2-Day Free Live Demo to experience teaching methodology before enrolling',
    surfacesFound: 'Homepage CTAs, course detail hero, admissions modal',
    canonicalSource: 'js/components.js (openDemoModal), data/courses.json',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'Non-promissory booking flow: confirmation text clearly explains demo scheduling without false automated seat reservation claims.',
    riskSeverity: 'Low',
    recommendedAction: 'Maintain current transparent demo booking workflow.'
  },
  {
    id: 'CLM-012',
    category: 'EMI & Financing Terms',
    claimStatement: 'Flexible monthly installment plans and financing options are available subject to partner approval; no universal 0% claims',
    surfacesFound: 'course-detail.html, data/financing-options.json',
    canonicalSource: 'data/financing-options.json, docs/p1-6-course-cost-disclosure-schema.md',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'Neutralized. Promissory "No-Cost EMI for All" claims replaced with transparent 3-tier financing disclosure with partner NBFC terms.',
    riskSeverity: 'Medium',
    recommendedAction: 'Preserve financing options disclaimer across all course enrollment touchpoints.'
  },
  {
    id: 'CLM-013',
    category: 'Software & AI Tool Subscriptions',
    claimStatement: 'Courses specify whether software tools are free, student-trial, or require separate third-party subscription/API credits',
    surfacesFound: 'course-detail.html (#cost-transparency-section), data/tools-and-services.json',
    canonicalSource: 'data/tools-and-services.json, data/courses/*.json',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'Transparent disclosure active across all 109 courses: clearly distinguishes included platform access from third-party tools (Adobe, Figma, OpenAI API).',
    riskSeverity: 'Low',
    recommendedAction: 'Preserve tool cost breakdown schema on all course pages.'
  },
  {
    id: 'CLM-014',
    category: 'Refund Policy & Pre-Enrolment Advisory',
    claimStatement: 'Enrolments are subject to a transparent cooling-off period (Section 3A) with promotional discount exclusions (Section 3B)',
    surfacesFound: 'refund-policy/index.html, course-detail.html, admissions modals',
    canonicalSource: 'refund-policy/index.html, data/refund-disclosure.json',
    verificationStatus: 'Verified & Accurate',
    discrepancyObserved: 'Pre-enrolment refund advisories are prominently linked directly above every payment and admissions CTA.',
    riskSeverity: 'Low',
    recommendedAction: 'Maintain active links to /refund-policy/ on all conversion touchpoints.'
  }
];

function escapeCsv(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const headers = [
  'Claim ID',
  'Category',
  'Claim Statement',
  'Surfaces Found',
  'Canonical Source',
  'Verification Status',
  'Discrepancy / Observed Finding',
  'Risk Severity',
  'Recommended Action'
];

const rows = [
  headers,
  ...claims.map(c => [
    c.id,
    c.category,
    c.claimStatement,
    c.surfacesFound,
    c.canonicalSource,
    c.verificationStatus,
    c.discrepancyObserved,
    c.riskSeverity,
    c.recommendedAction
  ])
];

const csvContent = rows.map(r => r.map(escapeCsv).join(',')).join('\r\n');
const outputPath = path.join(SEO_DOCS_DIR, '00-claim-verification-register.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');
console.log(`Generated Claim Verification Register: ${outputPath} (${claims.length} claims recorded)`);
