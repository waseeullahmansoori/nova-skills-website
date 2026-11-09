/**
 * Step 02 QA Suite: Headless Chrome Screenshot Capture & Responsive Verification
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const QA_DIR = path.join(ARTIFACT_DIR, 'step02_academy_banner_qa');

fs.mkdirSync(QA_DIR, { recursive: true });

function capture(url, outFile, width, height, virtualTimeMs = 1200) {
  const outPath = path.join(QA_DIR, outFile);
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --virtual-time-budget=${virtualTimeMs} --screenshot="${outPath}" "${url}"`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`📸 Saved: ${outFile} (${width}x${height})`);

  // Also copy to root artifact dir for easy user access
  fs.copyFileSync(outPath, path.join(ARTIFACT_DIR, outFile));
}

console.log('=== CAPTURING STEP 02 ACADEMY BANNER QA SCREENSHOTS ===\n');

const ACADEMIES = [
  'digital-marketing',
  'ai',
  'design',
  'programming',
  'no-code-web',
  'video-motion',
  '3d',
  'career-freelancing',
  'communication',
  'kids-tech',
  'creator',
  'office-productivity'
];

// 1. All 12 Academies: Desktop (1440px) and Mobile (390px)
console.log('--- 1. Capturing All 12 Academies on Desktop (1440px) & Mobile (390px) ---');
for (const a of ACADEMIES) {
  const url = `http://127.0.0.1:8097/academies/${a}/index.html`;
  capture(url, `after_desktop_1440px_${a}.png`, 1440, 950);
  capture(url, `after_mobile_390px_${a}.png`, 390, 844);
}

// 2. Comprehensive Viewports on Representative Academies (Digital Marketing & AI & 3D)
console.log('\n--- 2. Capturing Multi-Viewport Responsive Matrix (320px to 1440px) ---');
const viewports = [
  { name: '320px', w: 320, h: 650 },
  { name: '360px', w: 360, h: 740 },
  { name: '375px', w: 375, h: 667 },
  { name: '390px', w: 390, h: 844 },
  { name: '430px', w: 430, h: 932 },
  { name: '768px', w: 768, h: 1024 },
  { name: '1024px', w: 1024, h: 800 },
  { name: '1440px', w: 1440, h: 950 }
];

for (const vp of viewports) {
  capture(`http://127.0.0.1:8097/academies/digital-marketing/index.html`, `viewport_${vp.name}_digital_marketing.png`, vp.w, vp.h);
}

console.log('\n✅ All Step 02 QA Screenshots captured successfully!');
