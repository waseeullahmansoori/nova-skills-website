const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

const targets = [
  { url: 'https://novaskills.in/branches/', name: 'phase09_live_production_branches_directory' },
  { url: 'https://novaskills.in/branches/indore/', name: 'phase09_live_production_indore' },
  { url: 'https://novaskills.in/branches/vadodara/', name: 'phase09_live_production_vadodara' },
  { url: 'https://novaskills.in/branches/leh/', name: 'phase09_live_production_leh' }
];

function takeScreenshot(url, outputPath, width, height) {
  return new Promise((resolve, reject) => {
    const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --screenshot="${outputPath}" "${url}"`;
    exec(cmd, (err) => {
      if (err) return reject(err);
      if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 1000) {
        console.log(`✅ Captured: ${path.basename(outputPath)} (${width}x${height}, ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
        resolve();
      } else {
        reject(new Error(`Screenshot failed or file empty: ${outputPath}`));
      }
    });
  });
}

async function run() {
  console.log('Capturing live production screenshots from https://novaskills.in...');
  for (const t of targets) {
    const desktopPath = path.join(ARTIFACT_DIR, `${t.name}_desktop_1440px.png`);
    const mobilePath = path.join(ARTIFACT_DIR, `${t.name}_mobile_390px.png`);

    await takeScreenshot(t.url, desktopPath, 1440, 950);
    await takeScreenshot(t.url, mobilePath, 390, 844);
  }
  console.log('All live production screenshots captured successfully!');
}

run().catch(console.error);
