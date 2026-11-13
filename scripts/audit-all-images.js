const fs = require('fs');
const path = require('path');
const ROOT_DIR = path.resolve(__dirname, '..');

function auditDirImages(dirName) {
  const dirPath = path.join(ROOT_DIR, dirName);
  if (!fs.existsSync(dirPath)) return { total: 0, missing: 0, empty: 0 };
  const files = fs.readdirSync(dirPath);
  let total = 0, missing = 0, empty = 0;
  for (const file of files) {
    const full = path.join(dirPath, file);
    if (fs.statSync(full).isDirectory()) {
      const sub = auditDirImages(path.join(dirName, file));
      total += sub.total; missing += sub.missing; empty += sub.empty;
    } else if (file.endsWith('.html') && file !== '404.html') {
      const html = fs.readFileSync(full, 'utf8');
      const imgs = [...html.matchAll(/<img([^>]*)>/gi)];
      total += imgs.length;
      for (const im of imgs) {
        const altM = im[1].match(/alt=["']([^"']*)["']/i);
        if (!altM) missing++;
        else if (altM[1].trim() === '') empty++;
      }
    }
  }
  return { total, missing, empty };
}

console.log('Academies images:', auditDirImages('academies'));
console.log('Branches images:', auditDirImages('branches'));
console.log('Rendered Courses images:', auditDirImages('_rendered_courses'));
console.log('Blog images:', auditDirImages('blog'));
