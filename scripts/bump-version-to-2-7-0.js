const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Update index.html, courses.html, course-detail.html
const htmlFiles = [
  path.join(ROOT_DIR, 'index.html'),
  path.join(ROOT_DIR, 'courses.html'),
  path.join(ROOT_DIR, 'course-detail.html')
];

htmlFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let html = fs.readFileSync(f, 'utf8');
  html = html.replace(/data\.min\.js(\?v=[^"']*)?/g, 'data.min.js?v=2.7.0');
  html = html.replace(/components\.min\.js(\?v=[^"']*)?/g, 'components.min.js?v=2.7.0');
  html = html.replace(/courses\.min\.js(\?v=[^"']*)?/g, 'courses.min.js?v=2.7.0');
  html = html.replace(/course-detail\.min\.js(\?v=[^"']*)?/g, 'course-detail.min.js?v=2.7.0');
  html = html.replace(/academy-detail\.min\.js(\?v=[^"']*)?/g, 'academy-detail.min.js?v=2.7.0');
  fs.writeFileSync(f, html, 'utf8');
  console.log(`Updated cache versions in ${path.basename(f)}`);
});

// 2. Update scripts/build-academy-pages.js
let bap = fs.readFileSync(path.join(ROOT_DIR, 'scripts', 'build-academy-pages.js'), 'utf8');
bap = bap.replace(/\/js\/data\.min\.js(\?v=[^"']*)?/g, '/js/data.min.js?v=2.7.0');
bap = bap.replace(/\/js\/components\.min\.js(\?v=[^"']*)?/g, '/js/components.min.js?v=2.7.0');
bap = bap.replace(/\/academy-detail\.js(\?v=[^"']*)?/g, '/js/academy-detail.min.js?v=2.7.0');
bap = bap.replace(/\/js\/academy-detail\.min\.js(\?v=[^"']*)?/g, '/js/academy-detail.min.js?v=2.7.0');
fs.writeFileSync(path.join(ROOT_DIR, 'scripts', 'build-academy-pages.js'), bap, 'utf8');
console.log('Updated scripts/build-academy-pages.js script tags');

// 3. Update scripts/build-courses-page.js
let bcp = fs.readFileSync(path.join(ROOT_DIR, 'scripts', 'build-courses-page.js'), 'utf8');
bcp = bcp.replace(/data\.min\.js(\?v=[^"']*)?/g, 'data.min.js?v=2.7.0');
bcp = bcp.replace(/components\.min\.js(\?v=[^"']*)?/g, 'components.min.js?v=2.7.0');
bcp = bcp.replace(/courses\.min\.js(\?v=[^"']*)?/g, 'courses.min.js?v=2.7.0');
fs.writeFileSync(path.join(ROOT_DIR, 'scripts', 'build-courses-page.js'), bcp, 'utf8');
console.log('Updated scripts/build-courses-page.js script tags');

// 4. Update scripts/build-course-pages.js
let bcdp = fs.readFileSync(path.join(ROOT_DIR, 'scripts', 'build-course-pages.js'), 'utf8');
bcdp = bcdp.replace(/data\.min\.js(\?v=[^"']*)?/g, 'data.min.js?v=2.7.0');
bcdp = bcdp.replace(/components\.min\.js(\?v=[^"']*)?/g, 'components.min.js?v=2.7.0');
bcdp = bcdp.replace(/course-detail\.min\.js(\?v=[^"']*)?/g, 'course-detail.min.js?v=2.7.0');
fs.writeFileSync(path.join(ROOT_DIR, 'scripts', 'build-course-pages.js'), bcdp, 'utf8');
console.log('Updated scripts/build-course-pages.js script tags');
