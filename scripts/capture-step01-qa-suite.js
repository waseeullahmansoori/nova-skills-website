const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const QA_DIR = path.join(ARTIFACT_DIR, 'step01_pricing_sidebar_qa');

fs.mkdirSync(QA_DIR, { recursive: true });

function capture(url, outFile, width, height, virtualTimeMs = 1000) {
  const outPath = path.join(QA_DIR, outFile);
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --virtual-time-budget=${virtualTimeMs} --screenshot="${outPath}" "${url}"`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`📸 Saved: ${outFile} (${width}x${height})`);

  // Also copy to artifact root
  fs.copyFileSync(outPath, path.join(ARTIFACT_DIR, outFile));
}

console.log('=== CAPTURING STEP 01 QA SCREENSHOTS & COMPUTED MEASUREMENTS ===\n');

// Viewports to test
const viewports = [
  { name: '01_desktop_1440px_archviz.png', w: 1440, h: 950 },
  { name: '02_desktop_1280px_archviz.png', w: 1280, h: 900 },
  { name: '03_desktop_1024px_archviz.png', w: 1024, h: 900 },
  { name: '04_tablet_768px_archviz.png', w: 768, h: 1024 },
  { name: '05_mobile_430px_archviz.png', w: 430, h: 932 },
  { name: '06_mobile_390px_archviz.png', w: 390, h: 844 },
  { name: '07_mobile_360px_archviz.png', w: 360, h: 800 },
  { name: '08_mobile_337px_archviz.png', w: 337, h: 700 },
  { name: '09_mobile_320px_archviz.png', w: 320, h: 650 }
];

const targetUrl = 'http://127.0.0.1:8097/_rendered_courses/archviz-mastery.html';

for (const vp of viewports) {
  capture(targetUrl, vp.name, vp.w, vp.h);
}

// Also capture representative academy course details
const reps = [
  { id: 'dm-mastery', file: '10_rep_digital_marketing_dm_mastery.png' },
  { id: 'ai-mastery', file: '11_rep_ai_academy_ai_mastery.png' },
  { id: 'python-developer', file: '12_rep_programming_python_dev.png' },
  { id: 'nocode-web-pro', file: '13_rep_nocode_web_pro.png' }
];

for (const r of reps) {
  capture(`http://127.0.0.1:8097/_rendered_courses/${r.id}.html`, r.file, 1440, 950);
}

console.log('\n✅ All screenshots captured successfully!');
