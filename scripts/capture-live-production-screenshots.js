const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const QA_DIR = path.join(ARTIFACT_DIR, 'live_production_verified');

fs.mkdirSync(QA_DIR, { recursive: true });

function capture(url, outFile, width, height, virtualTimeMs = 1500) {
  const outPath = path.join(QA_DIR, outFile);
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --virtual-time-budget=${virtualTimeMs} --screenshot="${outPath}" "${url}"`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`📸 Saved live screenshot: ${outFile} (${width}x${height})`);

  // Copy to root artifact dir
  fs.copyFileSync(outPath, path.join(ARTIFACT_DIR, outFile));
}

console.log('=== CAPTURING LIVE PRODUCTION SCREENSHOTS FROM HTTPS://NOVASKILLS.IN ===\n');

const livePages = [
  { url: 'https://novaskills.in/', name: 'live_homepage' },
  { url: 'https://novaskills.in/academies/digital-marketing/', name: 'live_academy_digital_marketing' },
  { url: 'https://novaskills.in/academies/ai/', name: 'live_academy_ai' },
  { url: 'https://novaskills.in/_rendered_courses/archviz-mastery.html', name: 'live_course_archviz_mastery' }
];

for (const p of livePages) {
  capture(p.url, `${p.name}_desktop_1440px.png`, 1440, 950);
  capture(p.url, `${p.name}_mobile_390px.png`, 390, 844);
}

console.log('\n✅ Live production screenshots captured successfully!');
