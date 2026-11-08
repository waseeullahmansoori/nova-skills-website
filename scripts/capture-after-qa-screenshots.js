const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const QA_DIR = path.join(ARTIFACT_DIR, 'icon_token_fix_qa', 'after');

fs.mkdirSync(QA_DIR, { recursive: true });

function capture(url, outFile, width = 1280, height = 900) {
  const outPath = path.join(QA_DIR, outFile);
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --screenshot="${outPath}" "${url}"`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`📸 Saved: ${outFile} (${width}x${height})`);

  // Also copy key ones to artifact root for direct markdown embedding
  const rootCopy = path.join(ARTIFACT_DIR, outFile);
  try {
    fs.copyFileSync(outPath, rootCopy);
  } catch (e) {}
}

console.log('Capturing AFTER screenshots on http://127.0.0.1:8097...\n');

// 1. Office Academy page desktop (showing all 5 fixed cards)
capture('http://127.0.0.1:8097/academies/office-productivity/index.html', '01_after_office_academy_desktop_1280px.png', 1280, 1600);

// 2. Office Academy page mobile (390px)
capture('http://127.0.0.1:8097/academies/office-productivity/index.html', '02_after_office_academy_mobile_390px.png', 390, 1800);

// 3. Courses Catalogue filtered to Office desktop
capture('http://127.0.0.1:8097/courses.html?academy=office', '03_after_courses_office_desktop_1280px.png', 1280, 1600);

// 4. Courses Catalogue filtered to Office mobile (390px)
capture('http://127.0.0.1:8097/courses.html?academy=office', '04_after_courses_office_mobile_390px.png', 390, 1800);

// 5. Courses Catalogue mobile (ultra-narrow 320px)
capture('http://127.0.0.1:8097/courses.html?academy=office', '05_after_courses_office_mobile_320px.png', 320, 1800);

// 6. Microsoft Copilot detail page desktop
capture('http://127.0.0.1:8097/course-detail.html?id=microsoft-copilot', '06_after_copilot_detail_desktop_1280px.png', 1280, 1200);

// 7. Microsoft Copilot detail page mobile (390px)
capture('http://127.0.0.1:8097/course-detail.html?id=microsoft-copilot', '07_after_copilot_detail_mobile_390px.png', 390, 1200);

// 8. TallyPrime detail page mobile (390px)
capture('http://127.0.0.1:8097/course-detail.html?id=tally-gst', '08_after_tally_detail_mobile_390px.png', 390, 1200);

// 9. Digital Marketing Academy desktop (representative other academy)
capture('http://127.0.0.1:8097/academies/digital-marketing/index.html', '09_after_digital_marketing_academy_desktop.png', 1280, 1400);

// 10. AI Academy desktop (representative other academy)
capture('http://127.0.0.1:8097/academies/ai/index.html', '10_after_ai_academy_desktop.png', 1280, 1400);

// 11. Homepage desktop (feature cards verification)
capture('http://127.0.0.1:8097/index.html', '11_after_homepage_desktop_1280px.png', 1280, 1400);

console.log('\nFinished capturing all AFTER screenshots.');
