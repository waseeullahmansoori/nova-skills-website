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

const files = ['data.js', 'components.js', 'main.js', 'nova-ai-widget.js', 'blog.js', 'blog-detail.js', 'academy-detail.js', 'course-detail.js', 'courses.js'];

files.forEach(f => {
  const srcPath = path.join(BASE_DIR, f);
  if (!fs.existsSync(srcPath)) return;
  const content = fs.readFileSync(srcPath, 'utf8');
  const minified = simpleJsMinify(content);
  const outPath = path.join(JS_DIR, f.replace('.js', '.min.js'));
  fs.writeFileSync(outPath, minified, 'utf8');
  console.log(`✅ Built js/${f.replace('.js', '.min.js')} (${(minified.length/1024).toFixed(1)} KB)`);
});

// Also minify js/icon-system.js
const iconSysSrc = path.join(JS_DIR, 'icon-system.js');
if (fs.existsSync(iconSysSrc)) {
  const iconContent = fs.readFileSync(iconSysSrc, 'utf8');
  const minified = simpleJsMinify(iconContent);
  fs.writeFileSync(path.join(JS_DIR, 'icon-system.min.js'), minified, 'utf8');
  console.log(`✅ Built js/icon-system.min.js (${(minified.length/1024).toFixed(1)} KB)`);
}

// Sync Homepage SSR Header Shell (<div id="ns-header">...</div>) directly from components.js (Single Source of Truth)
const compPath = path.join(BASE_DIR, 'components.js');
const indexPath = path.join(BASE_DIR, 'index.html');
if (fs.existsSync(compPath) && fs.existsSync(indexPath)) {
  const compCode = fs.readFileSync(compPath, 'utf8');
  const bStart = compCode.indexOf('function buildAnnouncementBarHTML');
  const bEnd = compCode.indexOf('/* ─────────────────────────────────────────────', compCode.indexOf('function buildHeaderHTML'));
  if (bStart !== -1 && bEnd !== -1) {
    const buildHeaderFn = new Function(compCode.substring(bStart, bEnd) + '; return buildHeaderHTML("home");');
    const renderedHeader = buildHeaderFn().trim();
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    const eol = indexHtml.includes('\r\n') ? '\r\n' : '\n';
    const slotStartTag = '<div id="ns-header">';
    const startIdx = indexHtml.indexOf(slotStartTag);
    const closeHeaderIdx = indexHtml.indexOf('</header>', startIdx);
    const slotEndIdx = indexHtml.indexOf('</div>', closeHeaderIdx);
    if (startIdx !== -1 && closeHeaderIdx !== -1 && slotEndIdx !== -1) {
      const replacement = `${slotStartTag}${eol}${renderedHeader.replace(/\r?\n/g, eol)}${eol}  </div>`;
      indexHtml = indexHtml.substring(0, startIdx) + replacement + indexHtml.substring(slotEndIdx + '</div>'.length);
      fs.writeFileSync(indexPath, indexHtml, 'utf8');
      console.log('✅ Synced index.html #ns-header SSR snapshot from single source components.js');
    }
  }
}
