const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const rootDir = path.resolve(__dirname, '..');
const brainDir = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

const targets = [
  {
    name: 'creator',
    assetId: 'NS-ACAD-CREATOR-MASTER',
    htmlPath: path.join(__dirname, 'canvases', 'creator-hero-canvas.html'),
    webDir: path.join(rootDir, 'images', 'academies', 'creator'),
    publicDir: path.join(rootDir, 'public', 'images', 'academies', 'creator'),
    masterDest: path.join(brainDir, 'nova-visual-production', '03-approved-masters', 'ns-acad-creator-master.png'),
    desktopName: 'ns-academy-creator-hero-desktop-896w.png',
    tabletName: 'ns-academy-creator-hero-tablet-600w.png',
    mobileName: 'ns-academy-creator-hero-mobile-400w.png'
  },
  {
    name: 'kids-tech',
    assetId: 'NS-ACAD-KIDS-MASTER',
    htmlPath: path.join(__dirname, 'canvases', 'kids-hero-canvas.html'),
    webDir: path.join(rootDir, 'images', 'academies', 'kids-tech'),
    publicDir: path.join(rootDir, 'public', 'images', 'academies', 'kids-tech'),
    masterDest: path.join(brainDir, 'nova-visual-production', '03-approved-masters', 'ns-acad-kids-master.png'),
    desktopName: 'ns-academy-kids-hero-desktop-896w.png',
    tabletName: 'ns-academy-kids-hero-tablet-600w.png',
    mobileName: 'ns-academy-kids-hero-mobile-400w.png'
  }
];

function capture(url, outPath, width, height) {
  const cmd = `"${CHROME_PATH}" --headless=new --screenshot="${outPath}" --window-size=${width},${height} --hide-scrollbars --disable-gpu --no-sandbox "${url}"`;
  execSync(cmd, { stdio: 'pipe' });
  const stats = fs.statSync(outPath);
  console.log(`✓ Generated ${path.basename(outPath)} (${width}x${height}, ${stats.size} bytes)`);
}

console.log('=== GENERATING BATCH E4 ACADEMY HERO ASSETS ===');

targets.forEach(t => {
  console.log(`\nProcessing ${t.assetId} (${t.name})...`);
  const fileUrl = 'file:///' + t.htmlPath.replace(/\\/g, '/');

  // Ensure directories exist
  fs.mkdirSync(t.webDir, { recursive: true });
  fs.mkdirSync(t.publicDir, { recursive: true });
  fs.mkdirSync(path.dirname(t.masterDest), { recursive: true });

  const webOptDir = path.join(brainDir, 'nova-visual-production', '04-web-optimized');
  fs.mkdirSync(webOptDir, { recursive: true });

  // 1. Desktop (896x1200) - Also acts as master asset
  const desktopPath = path.join(t.webDir, t.desktopName);
  capture(fileUrl, desktopPath, 896, 1200);

  // Copy to public and brain master
  fs.copyFileSync(desktopPath, path.join(t.publicDir, t.desktopName));
  fs.copyFileSync(desktopPath, t.masterDest);
  fs.copyFileSync(desktopPath, path.join(webOptDir, t.desktopName));

  // 2. Tablet (600x800)
  const tabletPath = path.join(t.webDir, t.tabletName);
  capture(fileUrl, tabletPath, 600, 800);
  fs.copyFileSync(tabletPath, path.join(t.publicDir, t.tabletName));
  fs.copyFileSync(tabletPath, path.join(webOptDir, t.tabletName));

  // 3. Mobile (400x533)
  const mobilePath = path.join(t.webDir, t.mobileName);
  capture(fileUrl, mobilePath, 400, 533);
  fs.copyFileSync(mobilePath, path.join(t.publicDir, t.mobileName));
  fs.copyFileSync(mobilePath, path.join(webOptDir, t.mobileName));
});

console.log('\n=== BATCH E4 ASSETS SUCCESSFULLY GENERATED ===');
