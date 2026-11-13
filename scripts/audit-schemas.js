const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

function analyzeSchemas(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const html = fs.readFileSync(filePath, 'utf8');
  const matches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const found = [];
  for (const m of matches) {
    try {
      const parsed = JSON.parse(m[1]);
      if (parsed['@graph']) {
        parsed['@graph'].forEach(item => found.push(item['@type']));
      } else if (parsed['@type']) {
        found.push(parsed['@type']);
      }
    } catch (e) {
      found.push('ERROR: ' + e.message);
    }
  }
  return found;
}

console.log('--- Homepage Schemas ---');
console.log(analyzeSchemas(path.join(ROOT_DIR, 'index.html')));

console.log('\n--- Courses Catalog Schemas ---');
console.log(analyzeSchemas(path.join(ROOT_DIR, 'courses.html')));

console.log('\n--- Sample Academy (Digital Marketing) Schemas ---');
console.log(analyzeSchemas(path.join(ROOT_DIR, 'academies', 'digital-marketing', 'index.html')));

console.log('\n--- Sample Course (dm-mastery) Schemas ---');
console.log(analyzeSchemas(path.join(ROOT_DIR, '_rendered_courses', 'dm-mastery.html')));

console.log('\n--- Sample Course (ai-assisted-full-stack-web-development) Schemas ---');
console.log(analyzeSchemas(path.join(ROOT_DIR, '_rendered_courses', 'ai-assisted-full-stack-web-development.html')));

console.log('\n--- Sample City Page (Indore) Schemas ---');
console.log(analyzeSchemas(path.join(ROOT_DIR, 'branches', 'indore', 'index.html')));

console.log('\n--- Sample Blog (waseeullah-mansoori) Schemas ---');
console.log(analyzeSchemas(path.join(ROOT_DIR, 'blog', 'waseeullah-mansoori', 'index.html')));
