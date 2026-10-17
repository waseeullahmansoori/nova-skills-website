const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
const NS_COURSES = new Function(code + '; return NS_COURSES;')();

console.log(`Auditing all ${NS_COURSES.length} courses for content anomalies and data mismatches...\n`);

const anomalies = [];

for (const course of NS_COURSES) {
  const jsonPath = path.join(ROOT_DIR, 'data', 'courses', `${course.id}.json`);
  if (!fs.existsSync(jsonPath)) {
    anomalies.push({ id: course.id, issue: 'Missing individual JSON file' });
    continue;
  }

  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // 1. Duration check
  const dataJsMonths = course.durationMonths || parseInt(course.duration, 10) || 1;
  const jsonMonths = parseInt(json.duration, 10) || 1;
  if (dataJsMonths !== jsonMonths) {
    anomalies.push({ id: course.id, issue: `Duration mismatch: data.js="${course.duration}" (${dataJsMonths}m) vs JSON="${json.duration}" (${jsonMonths}m)` });
  }

  // 2. Learning hours check
  if (course.learningHours && json.learning_hours && course.learningHours !== json.learning_hours) {
    anomalies.push({ id: course.id, issue: `Hours mismatch: data.js=${course.learningHours} vs JSON=${json.learning_hours}` });
  }

  // 3. Tool relevance check (e.g. 3D tools in a coding course or vice-versa)
  const faqStr = JSON.stringify(json.faq || []).toLowerCase();
  const descStr = (json.overview?.positioning || '' + json.overview?.short_description || '').toLowerCase();

  // Specifically check Blender vs ArchViz / V-Ray
  if (course.id === 'blender-cert') {
    if (faqStr.includes('v-ray') || faqStr.includes('3ds max')) {
      anomalies.push({ id: course.id, category: 'CURRICULUM_COPY_PASTE', issue: 'Blender course FAQ references V-Ray, Twinmotion, and 3ds Max from ArchViz' });
    }
  }

  // Check if any other course has suspected copy-pasted FAQs or tools
  if (course.academyId === 'programming' && (faqStr.includes('v-ray') || faqStr.includes('photoshop'))) {
    anomalies.push({ id: course.id, category: 'TOOL_MISMATCH', issue: 'Programming course references 3D/Design tools in FAQ' });
  }
}

console.log(`Found ${anomalies.length} potential anomalies across 109 courses:`);
anomalies.forEach((a, i) => {
  console.log(`${i + 1}. [${a.id}] ${a.category || 'MISMATCH'}: ${a.issue}`);
});
