const fs = require('fs');
const path = require('path');
const ROOT_DIR = path.resolve(__dirname, '..');

const pages = [
  'index.html',
  'courses.html',
  'placements.html',
  'assessment.html',
  'blog.html',
  'success-stories.html',
  'verify.html',
  'contact/index.html'
];

for (const p of pages) {
  const full = path.join(ROOT_DIR, p);
  if (!fs.existsSync(full)) continue;
  const html = fs.readFileSync(full, 'utf8');
  const imgs = [...html.matchAll(/<img([^>]*)>/gi)];
  let missing = 0;
  let empty = 0;
  for (const im of imgs) {
    const altM = im[1].match(/alt=["']([^"']*)["']/i);
    if (!altM) missing++;
    else if (altM[1].trim() === '') empty++;
  }
  console.log(`${p}: Total images = ${imgs.length}, Missing alt = ${missing}, Empty alt = ${empty}`);
}
