const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const files = fs.readdirSync(path.join(ROOT_DIR, '_rendered_courses')).filter(f => f.endsWith('.html') && f !== '404.html');

let missingCourseSchema = 0;
let missingFaqSchema = 0;
let missingBreadcrumbSchema = 0;
let schemaParseErrors = 0;

for (const file of files) {
  const html = fs.readFileSync(path.join(ROOT_DIR, '_rendered_courses', file), 'utf8');
  const matches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let hasCourse = false;
  let hasFaq = false;
  let hasBreadcrumb = false;

  for (const m of matches) {
    try {
      const parsed = JSON.parse(m[1]);
      const types = [];
      if (parsed['@graph']) {
        parsed['@graph'].forEach(item => types.push(item['@type']));
      } else if (parsed['@type']) {
        if (Array.isArray(parsed['@type'])) types.push(...parsed['@type']);
        else types.push(parsed['@type']);
      }
      if (types.includes('Course')) hasCourse = true;
      if (types.includes('FAQPage')) hasFaq = true;
      if (types.includes('BreadcrumbList')) hasBreadcrumb = true;
    } catch (e) {
      schemaParseErrors++;
    }
  }

  if (!hasCourse) missingCourseSchema++;
  if (!hasFaq) missingFaqSchema++;
  if (!hasBreadcrumb) missingBreadcrumbSchema++;
}

console.log('Courses audit across all 109 courses:');
console.log('  Missing Course schema:', missingCourseSchema);
console.log('  Missing FAQPage schema:', missingFaqSchema);
console.log('  Missing BreadcrumbList schema:', missingBreadcrumbSchema);
console.log('  Schema parse errors:', schemaParseErrors);
