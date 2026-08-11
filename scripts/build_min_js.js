const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const JS_DIR = path.join(BASE_DIR, 'js');
fs.mkdirSync(JS_DIR, { recursive: true });

function simpleJsMinify(code) {
  // Remove block comments /* ... */
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove single line comments // ...
  const lines = code.split('\n');
  const cleaned = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//')) continue;
    if (trimmed.includes('console.log(') && !trimmed.includes('color:')) {
      // remove simple console.log
      cleaned.push(line.replace(/console\.log\([^;]+\);?/g, ''));
    } else {
      cleaned.push(line);
    }
  }
  return cleaned.join('\n').replace(/\n\s*\n/g, '\n').trim();
}

const files = ['data.js', 'components.js', 'main.js', 'nova-ai-widget.js', 'blog.js', 'blog-detail.js'];

files.forEach(f => {
  const srcPath = path.join(BASE_DIR, f);
  if (!fs.existsSync(srcPath)) return;
  const content = fs.readFileSync(srcPath, 'utf8');
  const minified = simpleJsMinify(content);
  const outPath = path.join(JS_DIR, f.replace('.js', '.min.js'));
  fs.writeFileSync(outPath, minified, 'utf8');
  console.log(`✅ Built js/${f.replace('.js', '.min.js')} (${(minified.length/1024).toFixed(1)} KB)`);
});
