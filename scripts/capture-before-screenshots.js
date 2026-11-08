const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const BEFORE_DIR = path.join(ARTIFACT_DIR, 'icon_token_fix_qa', 'before');

fs.mkdirSync(BEFORE_DIR, { recursive: true });

function capture(url, outFile, width = 1280, height = 900) {
  const outPath = path.join(BEFORE_DIR, outFile);
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --screenshot="${outPath}" "${url}"`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`Saved: ${outFile} (${width}x${height})`);
}

console.log('Capturing BEFORE screenshots on http://127.0.0.1:8097...');

// 1. Office Academy page desktop
capture('http://127.0.0.1:8097/academies/office-productivity/index.html', 'before_office_academy_desktop_1280px.png', 1280, 1400);

// 2. Office Academy page mobile (390px)
capture('http://127.0.0.1:8097/academies/office-productivity/index.html', 'before_office_academy_mobile_390px.png', 390, 1600);

// 3. Courses page filtered to Office academy desktop
capture('http://127.0.0.1:8097/courses.html?academy=office', 'before_courses_office_desktop_1280px.png', 1280, 1400);

// 4. Courses page filtered to Office academy mobile
capture('http://127.0.0.1:8097/courses.html?academy=office', 'before_courses_office_mobile_390px.png', 390, 1600);

console.log('Finished capturing BEFORE screenshots.');
