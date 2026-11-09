const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const QA_DIR = path.join(ARTIFACT_DIR, 'step02_academy_banner_qa', 'before');

fs.mkdirSync(QA_DIR, { recursive: true });

function capture(url, outFile, width, height) {
  const outPath = path.join(QA_DIR, outFile);
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --virtual-time-budget=1000 --screenshot="${outPath}" "${url}"`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`📸 Saved: ${outFile}`);
  // Also copy to root artifact dir for easy user access
  fs.copyFileSync(outPath, path.join(ARTIFACT_DIR, outFile));
}

const academies = ['digital-marketing', 'ai', 'design', 'programming', '3d'];
for (const a of academies) {
  capture(`http://127.0.0.1:8097/academies/${a}/index.html`, `before_desktop_1440px_${a}.png`, 1440, 900);
  capture(`http://127.0.0.1:8097/academies/${a}/index.html`, `before_mobile_390px_${a}.png`, 390, 844);
}
console.log('✅ Baseline before screenshots complete');
