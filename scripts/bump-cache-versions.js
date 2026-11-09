const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function bumpFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('components.min.js?v=2.5.0')) {
    content = content.replace(/components\.min\.js\?v=2\.5\.0/g, 'components.min.js?v=2.5.1');
    changed = true;
  }
  if (content.includes('styles.min.css?v=2.4.0')) {
    content = content.replace(/styles\.min\.css\?v=2\.4\.0/g, 'styles.min.css?v=2.4.1');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

// 1. Root HTML files
['index.html', 'courses.html'].forEach(f => bumpFile(path.join(rootDir, f)));

// 2. Rendered courses
const renderedDir = path.join(rootDir, '_rendered_courses');
if (fs.existsSync(renderedDir)) {
  fs.readdirSync(renderedDir).forEach(f => {
    if (f.endsWith('.html')) {
      bumpFile(path.join(renderedDir, f));
    }
  });
}

// 3. Add ipv4first to test scripts
['scripts/test-p0-form-recovery-suite.js', 'scripts/verify-live-production-p0-recovery.js'].forEach(file => {
  const p = path.join(rootDir, file);
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('setDefaultResultOrder')) {
      c = 'require("dns").setDefaultResultOrder("ipv4first");\r\n' + c;
      fs.writeFileSync(p, c, 'utf8');
      console.log('Added ipv4first to ' + file);
    }
  }
});

console.log('✅ Bumped cache query strings and updated test scripts');
