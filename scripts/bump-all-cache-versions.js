const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const targetFiles = [
  path.join(ROOT_DIR, 'index.html'),
  path.join(ROOT_DIR, 'courses.html'),
  path.join(ROOT_DIR, 'course-detail.html')
];

targetFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/data\.min\.js\?v=[0-9.]+/g, 'data.min.js?v=2.6.0');
  content = content.replace(/components\.min\.js\?v=[0-9.]+/g, 'components.min.js?v=2.6.0');
  content = content.replace(/courses\.min\.js\?v=[0-9.]+/g, 'courses.min.js?v=2.6.0');
  content = content.replace(/course-detail\.min\.js\?v=[0-9.]+/g, 'course-detail.min.js?v=2.6.0');
  content = content.replace(/academy-detail\.min\.js\?v=[0-9.]+/g, 'academy-detail.min.js?v=2.6.0');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Bumped versions in ${path.basename(filePath)}`);
});
