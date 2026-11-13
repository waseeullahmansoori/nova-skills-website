const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

// Get the new minified announcement CSS
const critMinPath = path.join(baseDir, 'css', 'critical.min.css');
const critMinContent = fs.readFileSync(critMinPath, 'utf8');
const s = critMinContent.indexOf('html.ns-announcement-hidden');
const e = critMinContent.indexOf('#ns-header', s);
const newBarCss = critMinContent.substring(s, e);

console.log('New Bar CSS length:', newBarCss.length);

const regex = /\.announcement-bar\{font-family:var\(--font-primary\);background:var\(--grad-brand\)[\s\S]*?\.announcement-close:hover\{color:white;background:rgba\(255,255,255,0\.15\);?\}/g;

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'brain') {
        results = results.concat(getHtmlFiles(full));
      }
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const htmls = getHtmlFiles(baseDir);
console.log('Total HTML files to process:', htmls.length);

let updatedCount = 0;
let alreadyUpdatedCount = 0;
let notFoundCount = 0;

htmls.forEach(h => {
  let content = fs.readFileSync(h, 'utf8');
  let changed = false;

  if (regex.test(content)) {
    content = content.replace(regex, newBarCss);
    changed = true;
    updatedCount++;
  } else if (content.includes('html.ns-announcement-hidden #announcement-bar')) {
    alreadyUpdatedCount++;
  } else {
    notFoundCount++;
  }

  if (changed) {
    fs.writeFileSync(h, content, 'utf8');
  }
});

console.log(`Summary:
- Updated with new Critical Bar CSS: ${updatedCount}
- Already had new CSS: ${alreadyUpdatedCount}
- Files without old CSS: ${notFoundCount}`);
