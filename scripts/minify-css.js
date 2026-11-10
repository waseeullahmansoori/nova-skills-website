const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');

function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*\{\s*/g, '{')
    .replace(/\s*\}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',')
    .trim();
}

// 1. Minify css/main.css -> css/styles.min.css
const mainCssPath = path.join(baseDir, 'css', 'main.css');
const cssStylesMinPath = path.join(baseDir, 'css', 'styles.min.css');
if (fs.existsSync(mainCssPath)) {
  const mainCss = fs.readFileSync(mainCssPath, 'utf8');
  const minified = minify(mainCss);
  fs.writeFileSync(cssStylesMinPath, minified, 'utf8');
  console.log('✅ Successfully minified css/main.css -> css/styles.min.css');
}

// 2. Minify css/critical.css -> css/critical.min.css
const criticalCssPath = path.join(baseDir, 'css', 'critical.css');
const criticalMinPath = path.join(baseDir, 'css', 'critical.min.css');
if (fs.existsSync(criticalCssPath)) {
  const critCss = fs.readFileSync(criticalCssPath, 'utf8');
  const minifiedCrit = minify(critCss);
  fs.writeFileSync(criticalMinPath, minifiedCrit, 'utf8');
  console.log('✅ Successfully minified css/critical.css -> css/critical.min.css');
}

// 3. Minify styles.css -> styles.min.css
const stylesPath = path.join(baseDir, 'styles.css');
const stylesMinPath = path.join(baseDir, 'styles.min.css');
if (fs.existsSync(stylesPath)) {
  const stylesCss = fs.readFileSync(stylesPath, 'utf8');
  const minified = minify(stylesCss);
  fs.writeFileSync(stylesMinPath, minified, 'utf8');
  console.log('✅ Successfully minified styles.css -> styles.min.css');
}
