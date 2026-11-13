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

// Also minify js/contact-config.js
const contactCfgSrc = path.join(JS_DIR, 'contact-config.js');
if (fs.existsSync(contactCfgSrc)) {
  const cfgContent = fs.readFileSync(contactCfgSrc, 'utf8');
  const minified = simpleJsMinify(cfgContent);
  fs.writeFileSync(path.join(JS_DIR, 'contact-config.min.js'), minified, 'utf8');
  console.log(`✅ Built js/contact-config.min.js (${(minified.length/1024).toFixed(1)} KB)`);
}

files.forEach(f => {
  const srcPath = path.join(BASE_DIR, f);
  if (!fs.existsSync(srcPath)) return;
  let minified = '';
  if (f === 'data.js') {
    // Compact canonical data safely via AST/runtime evaluation instead of regex comment stripping (preserves string literals like "/*")
    const loaded = require(srcPath);
    const metaMeta = JSON.stringify(loaded.NS_CANONICAL_META || {});
    const coursesCompact = JSON.stringify(loaded.NS_COURSES || []);
    const acadsCompact = JSON.stringify((loaded.NS_ACADEMIES || []).map(a => {
      const copy = Object.assign({}, a);
      delete copy.courses;
      return copy;
    }));
    const dataCompact = [
      `var NS_CANONICAL_META=${metaMeta};`,
      `var NS_COURSES=${coursesCompact};`,
      `var NS_ACADEMIES=${acadsCompact};`,
      `NS_ACADEMIES.forEach(function(a){a.courses=NS_COURSES.filter(function(c){return c.academyId===a.id});});`,
      `if(typeof window!=='undefined'){window.NS_CANONICAL_META=NS_CANONICAL_META;window.NS_COURSES=NS_COURSES;window.NS_ACADEMIES=NS_ACADEMIES;}`
    ].join('\n');
    const cdPath = path.join(JS_DIR, 'course-data.js');
    const cdMin = fs.existsSync(cdPath) ? ('\n' + simpleJsMinify(fs.readFileSync(cdPath, 'utf8'))) : '';
    minified = dataCompact + cdMin;
  } else {
    const content = fs.readFileSync(srcPath, 'utf8');
    minified = simpleJsMinify(content);
  }
  const outPath = path.join(JS_DIR, f.replace('.js', '.min.js'));
  fs.writeFileSync(outPath, minified, 'utf8');
  console.log(`✅ Built js/${f.replace('.js', '.min.js')} (${(minified.length/1024).toFixed(1)} KB)`);
});

// Also minify standalone js/course-data.js
const courseDataSrc = path.join(JS_DIR, 'course-data.js');
if (fs.existsSync(courseDataSrc)) {
  const cdMin = simpleJsMinify(fs.readFileSync(courseDataSrc, 'utf8'));
  fs.writeFileSync(path.join(JS_DIR, 'course-data.min.js'), cdMin, 'utf8');
  console.log(`✅ Built js/course-data.min.js (${(cdMin.length/1024).toFixed(1)} KB)`);
}

// Also minify js/icon-system.js
const iconSysSrc = path.join(JS_DIR, 'icon-system.js');
if (fs.existsSync(iconSysSrc)) {
  const iconContent = fs.readFileSync(iconSysSrc, 'utf8');
  const minified = simpleJsMinify(iconContent);
  fs.writeFileSync(path.join(JS_DIR, 'icon-system.min.js'), minified, 'utf8');
  console.log(`✅ Built js/icon-system.min.js (${(minified.length/1024).toFixed(1)} KB)`);
}

// Also minify js/credibility-data.js with embedded data for zero-latency client usage (P1-5)
const credSrc = path.join(JS_DIR, 'credibility-data.js');
if (fs.existsSync(credSrc)) {
  const projectsJson = fs.readFileSync(path.join(BASE_DIR, 'data', 'student-projects.json'), 'utf8');
  const testimonialsJson = fs.readFileSync(path.join(BASE_DIR, 'data', 'student-testimonials.json'), 'utf8');
  const mentorsJson = fs.readFileSync(path.join(BASE_DIR, 'data', 'mentors.json'), 'utf8');
  const credCode = fs.readFileSync(credSrc, 'utf8');
  const embeddedBundle = [
    `var NS_STUDENT_PROJECTS = ${JSON.stringify(JSON.parse(projectsJson))};`,
    `var NS_STUDENT_TESTIMONIALS = ${JSON.stringify(JSON.parse(testimonialsJson))};`,
    `var NS_MENTORS = ${JSON.stringify(JSON.parse(mentorsJson))};`,
    `if(typeof window !== 'undefined'){ window.NS_STUDENT_PROJECTS = NS_STUDENT_PROJECTS; window.NS_STUDENT_TESTIMONIALS = NS_STUDENT_TESTIMONIALS; window.NS_MENTORS = NS_MENTORS; }`,
    simpleJsMinify(credCode)
  ].join('\n');
  fs.writeFileSync(path.join(JS_DIR, 'credibility-data.min.js'), embeddedBundle, 'utf8');
  console.log(`✅ Built js/credibility-data.min.js (${(embeddedBundle.length/1024).toFixed(1)} KB)`);
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
      const cleanHeader = renderedHeader.replace(/[ \t]+$/gm, '');
      const replacement = `${slotStartTag}${eol}${cleanHeader.replace(/\r?\n/g, eol)}${eol}  </div>`;
      indexHtml = indexHtml.substring(0, startIdx) + replacement + indexHtml.substring(slotEndIdx + '</div>'.length);
      indexHtml = indexHtml.replace(/[ \t]+$/gm, '');
      fs.writeFileSync(indexPath, indexHtml, 'utf8');
      console.log('✅ Synced index.html #ns-header SSR snapshot from single source components.js');
    }
  }
}
