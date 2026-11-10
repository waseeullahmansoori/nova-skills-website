const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('  GLOBAL HEADER ARCHITECTURE: STATIC & EDGE COVERAGE AUDIT');
console.log('================================================================\n');

const EXCLUDED_ROUTES = new Set([
  'admin.html',
  'admin/login/index.html',
  'admin-activity.html',
  'admin-settings.html',
  'ai-chat.html',
  'portal.html',
  'student.html',
  'login.html',
  'register.html',
  'verify.html'
]);

function walkHtml(dir, results = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.system_generated', 'scratch', 'scripts'].includes(e.name) || e.name.startsWith('tmp-')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(full, results);
    else if (e.name.endsWith('.html')) results.push(full.replace(/\\/g, '/').replace(/^\.\//, ''));
  }
  return results;
}

const allHtml = walkHtml('.');
const publicHtml = allHtml.filter(f => !EXCLUDED_ROUTES.has(f));

let pass = 0;
let fail = 0;
function check(cond, msg) {
  if (cond) { pass++; }
  else { fail++; console.error('  ✗ FAIL:', msg); }
}

for (const f of publicHtml) {
  const c = fs.readFileSync(f, 'utf8');
  check(c.includes('id="ns-header"'), `${f}: has #ns-header global header mount/shell`);
  check(c.includes('/js/components.min.js?v=2.8.0'), `${f}: loads /js/components.min.js?v=2.8.0`);
  check(c.includes('/css/styles.min.css?v=2.8.0'), `${f}: loads /css/styles.min.css?v=2.8.0`);
  check(!c.includes('/* ===== HERO@media '), `${f}: zero malformed HERO comment in critical-css`);
  if (f !== 'index.html') {
    check(!c.includes('id="main-header"'), `${f}: no duplicated static #main-header copy`);
    check(!c.includes('id="announcement-bar"'), `${f}: no duplicated static #announcement-bar copy`);
  }
}

// Check index.html exact SSR sync with components.js buildHeaderHTML('home')
const compCode = fs.readFileSync('components.js', 'utf8');
const bStart = compCode.indexOf('function buildAnnouncementBarHTML');
const bEnd = compCode.indexOf('/* ─────────────────────────────────────────────', compCode.indexOf('function buildHeaderHTML'));
const buildFn = new Function(compCode.substring(bStart, bEnd) + '; return buildHeaderHTML("home");');
const canonicalHeader = buildFn().trim().replace(/\r\n/g, '\n');

const idxHtml = fs.readFileSync('index.html', 'utf8');
const sIdx = idxHtml.indexOf('<div id="ns-header">') + '<div id="ns-header">'.length;
const eIdx = idxHtml.indexOf('</div>\r\n\r\n  <main>') !== -1 ? idxHtml.indexOf('</div>\r\n\r\n  <main>') : idxHtml.indexOf('</div>\n\n  <main>');
const idxHeaderInner = idxHtml.substring(sIdx, eIdx).trim().replace(/\r\n/g, '\n');

check(idxHeaderInner === canonicalHeader, 'index.html #ns-header SSR HTML matches components.js buildHeaderHTML("home") 100% character-for-character');
check(canonicalHeader.includes('Admissions Open for Upcoming Batches'), 'Announcement Slide 0 preserves exact Homepage copy');
check(canonicalHeader.includes('href="/branches/"'), 'Header includes Learning Locations (/branches/)');
check(canonicalHeader.includes('mobile-drawer-action-group'), 'Header includes mobile drawer action buttons');

// Check special routes remain intentionally isolated without marketing header
for (const ex of EXCLUDED_ROUTES) {
  const c = fs.readFileSync(ex, 'utf8');
  check(!c.includes('id="ns-header"') && !c.includes('id="announcement-bar"'), `Special route excluded cleanly: ${ex}`);
}

// Check Cloudflare Edge bundle
const edge = fs.readFileSync('functions/_rendered_courses.js', 'utf8');
const v28Matches = (edge.match(/components\.min\.js\?v=2\.8\.0/g) || []).length;
check(v28Matches >= 110, `functions/_rendered_courses.js updated all 109 courses + 404 with v=2.8.0 (found: ${v28Matches})`);
check(edge.includes('"dm-professional"') && edge.includes('"graphic-design-pro"'), 'Edge course entries intact in functions/_rendered_courses.js');

// Check css/main.css & css/styles.min.css
const mainCss = fs.readFileSync('css/main.css', 'utf8');
const minCss = fs.readFileSync('css/styles.min.css', 'utf8');
check(mainCss.includes('scroll-padding-top: 84px'), 'css/main.css configures scroll-padding-top: 84px');
check(minCss.includes('scroll-padding-top:84px'), 'css/styles.min.css contains minified scroll-padding-top:84px');
check(minCss.includes('overflow-x:clip!important') || minCss.includes('overflow-x:clip !important'), 'css/styles.min.css replaces mobile overflow-x:hidden with overflow-x:clip');

console.log(`  Total Public HTML Routes Audited: ${publicHtml.length}`);
console.log(`  Excluded Special Routes Audited : ${EXCLUDED_ROUTES.size}`);
console.log(`  Checks Passed: ${pass}, Failed: ${fail}`);
if (fail > 0) process.exit(1);
console.log('\n✅ ALL STATIC & EDGE COVERAGE CHECKS PASSED!');
