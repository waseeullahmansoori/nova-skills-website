const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
const NS_COURSES = new Function(code + '; return NS_COURSES;')();

console.log('=== PHASE 4: TRUST & CREDIBILITY AUDIT ===\n');

// 1. Audit ISO 9001:2015 claims across _rendered_courses
const isoCourses = [];
const renderedDir = path.join(ROOT_DIR, '_rendered_courses');
const files = fs.readdirSync(renderedDir).filter(f => f.endsWith('.html') && f !== '404.html');

for (const file of files) {
  const content = fs.readFileSync(path.join(renderedDir, file), 'utf8');
  if (content.includes('ISO 9001:2015') || content.includes('ISO-certified credential')) {
    isoCourses.push(file.replace('.html', ''));
  }
}
console.log(`[Claim 1 - ISO Certification]: Found ISO claims in ${isoCourses.length}/${files.length} rendered courses.`);

// 2. Audit Placement Support Claims
const placementCourses = NS_COURSES.filter(c => c.placementSupport === true);
const noPlacementCourses = NS_COURSES.filter(c => !c.placementSupport);
console.log(`[Claim 2 - Placement Support]: ${placementCourses.length} courses claim placement support, ${noPlacementCourses.length} courses explicitly exclude it.`);

// 3. Audit Student Counts and Reviews
let minReviews = Infinity, maxReviews = -Infinity;
let minStudents = Infinity, maxStudents = -Infinity;
let totalLearnersClaimed = 0;

NS_COURSES.forEach(c => {
  if (c.reviews) {
    if (c.reviews < minReviews) minReviews = c.reviews;
    if (c.reviews > maxReviews) maxReviews = c.reviews;
  }
  if (c.students) {
    if (c.students < minStudents) minStudents = c.students;
    if (c.students > maxStudents) maxStudents = c.students;
    totalLearnersClaimed += c.students;
  }
});
console.log(`[Claim 3 - Ratings & Counts]: Reviews range: ${minReviews} - ${maxReviews}. Enrolled students range: ${minStudents} - ${maxStudents}. Total claimed alumni/learners: ${totalLearnersClaimed.toLocaleString('en-IN')}.`);

// 4. Audit Testimonials
let testimonialCardsFound = 0;
for (const file of files) {
  const content = fs.readFileSync(path.join(renderedDir, file), 'utf8');
  if (content.includes('Rohit M.') && content.includes('Nova Skills Alumnus')) {
    testimonialCardsFound++;
  }
}
console.log(`[Claim 4 - Testimonials]: Found hardcoded 'Rohit M.' placeholder testimonial in ${testimonialCardsFound}/${files.length} rendered courses.`);

// 5. Audit Title vs Level Contradictions
const titleLevelContradictions = [];
NS_COURSES.forEach(c => {
  const nameLower = c.name.toLowerCase();
  const levelLower = (c.level || '').toLowerCase();
  if (nameLower.includes('advanced') && levelLower === 'beginner') {
    titleLevelContradictions.push({ id: c.id, name: c.name, level: c.level, issue: 'Title states "Advanced" but Level badge states "Beginner"' });
  }
});
console.log(`[Claim 5 - Title vs Level]: Found ${titleLevelContradictions.length} direct contradictions:`);
titleLevelContradictions.forEach(t => console.log(`   - [${t.id}] "${t.name}" | Level: "${t.level}"`));

// 6. Audit Financing & GST wording in all rendered pages
let unneutralizedEmi = 0;
let gstMissing = 0;
for (const file of files) {
  const content = fs.readFileSync(path.join(renderedDir, file), 'utf8');
  if (content.includes('No-Cost EMI')) {
    unneutralizedEmi++;
  }
  if (!content.includes('18% GST included')) {
    gstMissing++;
  }
}
console.log(`[Claim 6 - Financing & GST]: Unneutralized "No-Cost EMI" occurrences: ${unneutralizedEmi}. Missing "18% GST included": ${gstMissing}.`);

console.log('\n--- AUDIT SUMMARY COMPLETE ---');
