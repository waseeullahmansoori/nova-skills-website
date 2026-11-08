const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const QA_DIR = path.join(ARTIFACT_DIR, 'demo_conversion_qa');

fs.mkdirSync(QA_DIR, { recursive: true });

function capture(url, outFile, width = 1280, height = 900, virtualTimeMs = 2500) {
  const outPath = path.join(QA_DIR, outFile);
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --virtual-time-budget=${virtualTimeMs} --screenshot="${outPath}" "${url}"`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`📸 Saved: ${outFile} (${width}x${height})`);

  // Copy to artifact root for direct markdown embedding
  const rootCopy = path.join(ARTIFACT_DIR, outFile);
  try {
    fs.copyFileSync(outPath, rootCopy);
  } catch (e) {}
}

console.log('Capturing ALL 15 REQUIRED DEMO & 1:1 CONVERSION SCREENSHOTS on http://127.0.0.1:8097...\n');

// 1. Homepage hero CTA — desktop
capture('http://127.0.0.1:8097/index.html', '01_homepage_hero_cta_desktop.png', 1440, 900);

// 2. Homepage hero CTA — mobile
capture('http://127.0.0.1:8097/index.html', '02_homepage_hero_cta_mobile.png', 390, 844);

// 3. Homepage hero statistics strip unchanged
capture('http://127.0.0.1:8097/index.html', '03_homepage_hero_statistics_strip_unchanged.png', 1280, 850);

// 4. Course-detail demo area — desktop
capture('http://127.0.0.1:8097/course-detail.html?id=dm-mastery', '04_course_detail_demo_area_desktop.png', 1440, 950);

// 5. Course-detail demo area — mobile
capture('http://127.0.0.1:8097/course-detail.html?id=dm-mastery', '05_course_detail_demo_area_mobile.png', 390, 844);

// 6. Academy promotional band — desktop
capture('http://127.0.0.1:8097/academies/digital-marketing/index.html', '06_academy_promotional_band_desktop.png', 1440, 900);

// 7. Academy promotional band — mobile
capture('http://127.0.0.1:8097/academies/digital-marketing/index.html', '07_academy_promotional_band_mobile.png', 390, 844);

// 8. Main catalogue eligible-course indicator
capture('http://127.0.0.1:8097/courses.html', '08_main_catalogue_eligible_indicator.png', 1440, 950);

// 9. Demo form opened from homepage
capture('http://127.0.0.1:8097/index.html#demo', '09_demo_form_opened_homepage.png', 1280, 900, 3000);

// 10. Demo form opened from course detail
capture('http://127.0.0.1:8097/course-detail.html?id=dm-mastery#demo', '10_demo_form_opened_course_detail.png', 1280, 900, 3000);

// 11. Demo form opened from academy page
capture('http://127.0.0.1:8097/academies/digital-marketing/index.html#demo', '11_demo_form_opened_academy_page.png', 1280, 900, 3000);

// 12. Why Nova Skills benefit cards
capture('http://127.0.0.1:8097/index.html#why-nova', '12_why_nova_skills_benefit_cards.png', 1280, 900);

// 13. Announcement-bar demo slide
capture('http://127.0.0.1:8097/index.html', '13_announcement_bar_demo_slide.png', 1280, 600);

// 14. Footer demo link
capture('http://127.0.0.1:8097/index.html#footer', '14_footer_demo_link.png', 1280, 650);

// 15. Existing Enroll Now form still functioning
capture('http://127.0.0.1:8097/course-detail.html?id=dm-mastery#enroll', '15_enroll_now_form_functioning.png', 1280, 950, 3000);

console.log('\n🎉 ALL 15 REQUIRED SCREENSHOTS CAPTURED SUCCESSFULLY!');
