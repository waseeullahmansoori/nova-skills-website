const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Audit dm-professional rendered HTML vs canonical courses.json
const coursesData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'courses.json'), 'utf8'));
const dmProCourse = coursesData.courses.find(c => c.id === 'dm-professional');
const dmProHtml = fs.readFileSync(path.join(ROOT_DIR, '_rendered_courses', 'dm-professional.html'), 'utf8');

console.log('=== DIGITAL MARKETING SPECIALIST (dm-professional) ===');
console.log('Canonical Duration:', dmProCourse.duration);
console.log('Canonical Guided Hours:', dmProCourse.hours);
console.log('Canonical Capstones:', dmProCourse.capstoneProjects);

const dmMentions = [];
if (dmProHtml.includes('3 Month') || dmProHtml.includes('3-Month') || dmProHtml.includes('3 month')) dmMentions.push('Contains 3 Month');
if (dmProHtml.includes('6 Month') || dmProHtml.includes('6-Month') || dmProHtml.includes('6 month')) dmMentions.push('Contains 6 Month');
if (dmProHtml.includes('120 Hour') || dmProHtml.includes('120 hour') || dmProHtml.includes('120 guided')) dmMentions.push('Contains 120 Hours');
if (dmProHtml.includes('240 Hour') || dmProHtml.includes('240 hour') || dmProHtml.includes('240 guided')) dmMentions.push('Contains 240 Hours');
console.log('Rendered HTML duration/hours mentions:', dmMentions);

// 2. Audit Full Stack Web Development capstones
const fsCourse = coursesData.courses.find(c => c.id === 'ai-assisted-full-stack-web-development');
const fsHtml = fs.readFileSync(path.join(ROOT_DIR, '_rendered_courses', 'ai-assisted-full-stack-web-development.html'), 'utf8');

console.log('\n=== FULL STACK WEB DEVELOPMENT (ai-assisted-full-stack-web-development) ===');
console.log('Canonical Duration:', fsCourse.duration);
console.log('Canonical Guided Hours:', fsCourse.hours);
console.log('Canonical Capstone Projects:', fsCourse.capstoneProjects);

const fsMentions = [];
if (fsHtml.includes('8 Capstone') || fsHtml.includes('8 capstone') || fsHtml.includes('8 Major') || fsHtml.includes('8 major')) fsMentions.push('Mentions 8 Capstones');
if (fsHtml.includes('14 Capstone') || fsHtml.includes('14 capstone') || fsHtml.includes('14 project')) fsMentions.push('Mentions 14 Capstones');
console.log('Rendered HTML capstone mentions:', fsMentions);

// 3. Audit Indore location page guided hours
const indoreHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'indore', 'index.html'), 'utf8');
console.log('\n=== INDORE LOCATION PAGE ===');
const indoreMentions = [];
if (indoreHtml.includes('160 guided') || indoreHtml.includes('160 Guided') || indoreHtml.includes('160 hour') || indoreHtml.includes('160 Hours')) indoreMentions.push('Mentions 160 guided hours');
if (indoreHtml.includes('120 guided') || indoreHtml.includes('120 hour')) indoreMentions.push('Mentions 120 guided hours');
console.log('Indore HTML guided hours mentions:', indoreMentions);

// 4. Audit Location Pages Physical vs Live-Online clarity
const locationsRegistry = require(path.join(ROOT_DIR, 'lib', 'locations'));
const locs = locationsRegistry.getAllLocations();
let locationDisclaimerPassed = 0;
let locationDisclaimerFailed = 0;
const failingLocations = [];

for (const loc of locs) {
  const locHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', loc.slug, 'index.html'), 'utf8');
  const hasOnlineMention = locHtml.includes('Live-Online') || locHtml.includes('live-online') || locHtml.includes('online interactive') || locHtml.includes('live online');
  const hasCampusMention = locHtml.includes('Siddharth Nagar') || locHtml.includes('physical campus') || locHtml.includes('headquarters');
  if (hasOnlineMention && hasCampusMention) {
    locationDisclaimerPassed++;
  } else {
    locationDisclaimerFailed++;
    failingLocations.push({ slug: loc.slug, hasOnlineMention, hasCampusMention });
  }
}
console.log(`\n=== 36 LOCATION PAGES MODALITY AUDIT ===`);
console.log(`Passed (Online + Siddharth Nagar physical campus clarified): ${locationDisclaimerPassed}/36`);
console.log(`Failed / Incomplete: ${locationDisclaimerFailed}/36`);
if (failingLocations.length > 0) {
  console.log('Failing locations:', failingLocations);
}

// 5. Pricing and GST sitewide audit
console.log('\n=== PRICING & GST AUDIT ===');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
console.log('Homepage starting price mentions:');
const hpStartingPrice = [...indexHtml.matchAll(/(?:starts?|starting|from|₹)\s*(?:at\s*)?(?:₹\s*)?([0-9,]+)/gi)].map(m => m[0]);
console.log('  Matches:', hpStartingPrice.slice(0, 10));

const coursesWithStartingPrice = [];
for (const c of coursesData.courses) {
  if (c.price === 2900 || c.pricing?.basePrice === 2900) {
    coursesWithStartingPrice.push(c.id);
  }
}
console.log(`Courses priced at ₹2,900: ${coursesWithStartingPrice.length} (${coursesWithStartingPrice.join(', ')})`);
console.log('Canonical approved starting price:', coursesData.approvedStartingPrice);
console.log('Computed minimum published price:', coursesData.computedMinimumPublishedPrice);
