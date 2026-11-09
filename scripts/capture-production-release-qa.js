const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const QA_DIR = path.join(ARTIFACT_DIR, 'production_release_qa');

fs.mkdirSync(QA_DIR, { recursive: true });

function capture(url, outFile, width, height, virtualTimeMs = 1200) {
  const outPath = path.join(QA_DIR, outFile);
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --virtual-time-budget=${virtualTimeMs} --screenshot="${outPath}" "${url}"`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`📸 Saved: ${outFile} (${width}x${height})`);

  // Copy to root artifact dir
  fs.copyFileSync(outPath, path.join(ARTIFACT_DIR, outFile));
}

console.log('=== CAPTURING PRODUCTION RELEASE VALIDATION SCREENSHOTS ===\n');

const pages = [
  { url: 'http://127.0.0.1:8097/index.html', prefix: 'prod_homepage' },
  { url: 'http://127.0.0.1:8097/academies/digital-marketing/index.html', prefix: 'prod_academy_digital_marketing' },
  { url: 'http://127.0.0.1:8097/academies/ai/index.html', prefix: 'prod_academy_ai' },
  { url: 'http://127.0.0.1:8097/_rendered_courses/archviz-mastery.html', prefix: 'prod_course_archviz_mastery' },
  { url: 'http://127.0.0.1:8097/_rendered_courses/dm-mastery.html', prefix: 'prod_course_dm_mastery' },
  { url: 'http://127.0.0.1:8097/courses.html', prefix: 'prod_courses_catalog' }
];

const viewports = [
  { name: '1440px_desktop', w: 1440, h: 950 },
  { name: '768px_tablet', w: 768, h: 1024 },
  { name: '390px_mobile', w: 390, h: 844 }
];

for (const p of pages) {
  for (const vp of viewports) {
    capture(p.url, `${p.prefix}_${vp.name}.png`, vp.w, vp.h);
  }
}

console.log('\n✅ All production release screenshots captured successfully!');
