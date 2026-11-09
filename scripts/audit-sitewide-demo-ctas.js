const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Regex patterns to match demo buttons/links
const demoTextRegex = /(?:book(?:\s+your)?\s+(?:2-day\s+)?free\s+demo|free\s+demo(?:\s+classes)?|schedule\s+free\s+demo|request\s+free\s+demo|try\s+free\s+demo|book\s+demo)/i;

function auditFile(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return [];

  const content = fs.readFileSync(fullPath, 'utf8');
  const results = [];

  // Match <a> and <button> tags
  const tagRegex = /<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    const [fullTag, tagType, attrs, innerText] = match;
    const cleanText = innerText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    // Check if inner text or attributes match demo
    const isDemoCTA = demoTextRegex.test(cleanText) ||
                      attrs.includes('openDemoModal') ||
                      attrs.includes('openFreeDemo') ||
                      (attrs.includes('href="#demo"') || attrs.includes('href="/#demo"'));

    if (isDemoCTA) {
      // Determine existing behavior
      let behavior = 'UNKNOWN';
      let callsDemoModal = attrs.includes('openDemoModal') || attrs.includes('openFreeDemo');
      let callsConsultation = attrs.includes('openConsultationModal') || attrs.includes('consultation');
      let callsEnrollment = attrs.includes('openEnrollmentModal') || attrs.includes('btn-enroll');
      let href = (attrs.match(/href="([^"]*)"/) || [])[1] || '';

      if (callsDemoModal) {
        behavior = 'OPENS_DEMO_MODAL';
      } else if (callsConsultation) {
        behavior = 'OPENS_CONSULTATION_MODAL_BUG';
      } else if (callsEnrollment) {
        behavior = 'OPENS_ENROLLMENT_MODAL_BUG';
      } else if (href.startsWith('#') || href.startsWith('/#')) {
        behavior = 'ANCHOR_HASH_ONLY';
      } else if (href) {
        behavior = `NAVIGATES_TO_${href}`;
      } else {
        behavior = 'NO_ACTION';
      }

      const fixRequired = (behavior !== 'OPENS_DEMO_MODAL');

      results.push({
        file: relPath,
        tag: tagType,
        text: cleanText,
        href,
        onclick: (attrs.match(/onclick="([^"]*)"/) || [])[1] || '',
        behavior,
        fixRequired
      });
    }
  }

  return results;
}

const filesToAudit = [
  'index.html',
  'courses.html',
  'course-detail.html',
  'about.html',
  'contact.html',
  'blog.html',
  'academies/digital-marketing/index.html',
  'academies/ai/index.html',
  'academies/design/index.html',
  'academies/programming/index.html',
  'academies/no-code-web/index.html',
  'academies/video-motion/index.html',
  'academies/3d/index.html',
  'academies/career-freelancing/index.html',
  'academies/communication/index.html',
  'academies/kids-tech/index.html',
  'academies/creator/index.html',
  'academies/office-productivity/index.html',
  '_rendered_courses/dm-mastery.html',
  '_rendered_courses/fullstack-foundation.html',
  '_rendered_courses/ai-mastery.html',
  '_rendered_courses/nocode-web-pro.html',
  'components.js',
  'scripts/build-academy-pages.js',
  'scripts/build-course-pages.js',
  'scripts/build-courses-page.js',
  'courses.js',
  'course-detail.js'
];

console.log('================================================================');
console.log('🔍 PHASE 1: SITEWIDE FREE DEMO CTA AUDIT');
console.log('================================================================\n');

let totalCtas = 0;
let workingCtas = 0;
let brokenCtas = 0;

filesToAudit.forEach(f => {
  const ctas = auditFile(f);
  if (ctas.length > 0) {
    console.log(`\n📄 ${f} (${ctas.length} Demo CTAs found):`);
    ctas.forEach((c, idx) => {
      totalCtas++;
      if (c.fixRequired) {
        brokenCtas++;
        console.log(`  ❌ [FIX REQUIRED] #${idx+1}: "${c.text}" | Behavior: ${c.behavior} | Href: ${c.href}`);
      } else {
        workingCtas++;
        console.log(`  ✅ [WORKING] #${idx+1}: "${c.text}" | Onclick: ${c.onclick.substring(0, 60)}...`);
      }
    });
  }
});

console.log('\n================================================================');
console.log(`AUDIT SUMMARY: Total: ${totalCtas} | Working: ${workingCtas} | Broken/Unlinked: ${brokenCtas}`);
console.log('================================================================');
