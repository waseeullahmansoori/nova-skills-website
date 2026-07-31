const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const mainCssPath = path.join(baseDir, 'css', 'main.css');
const stylesMinPath = path.join(baseDir, 'css', 'styles.min.css');

if (!fs.existsSync(mainCssPath)) {
  console.error('❌ main.css does not exist at:', mainCssPath);
  process.exit(1);
}

const mainCss = fs.readFileSync(mainCssPath, 'utf8');

// Safe minification: remove comments and collapse extra spaces around symbols
let minified = mainCss
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*\{ \s*/g, '{')
  .replace(/\s*\} \s*/g, '}')
  .replace(/\s*; \s*/g, ';')
  .replace(/\s*: \s*/g, ':')
  .replace(/\s*, \s*/g, ',')
  .trim();

fs.writeFileSync(stylesMinPath, minified, 'utf8');
console.log('✅ Successfully minified css/main.css -> css/styles.min.css');
console.log('   Original size:', mainCss.length, 'bytes');
console.log('   Minified size:', minified.length, 'bytes');
