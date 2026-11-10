const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const rootDir = path.resolve(__dirname, '..');
const brainDir = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

const webDir = path.join(rootDir, 'images', 'projects', 'dm-professional');
const publicDir = path.join(rootDir, 'public', 'images', 'projects', 'dm-professional');
const brainWebOpt = path.join(brainDir, 'nova-visual-production', '04-web-optimized');

fs.mkdirSync(webDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(brainWebOpt, { recursive: true });

const projects = [
  {
    id: 'ns-proj-dm-01',
    htmlPath: path.join(__dirname, 'canvases', 'dm', 'dm-analytics-canvas.html'),
    baseName: 'ns-proj-dm-analytics-dashboard'
  },
  {
    id: 'ns-proj-dm-02',
    htmlPath: path.join(__dirname, 'canvases', 'dm', 'dm-seo-canvas.html'),
    baseName: 'ns-proj-dm-technical-seo-blueprint'
  },
  {
    id: 'ns-proj-dm-03',
    htmlPath: path.join(__dirname, 'canvases', 'dm', 'dm-funnel-canvas.html'),
    baseName: 'ns-proj-dm-paid-ads-funnel'
  }
];

function capture(url, outPath, width, height) {
  const cmd = `"${CHROME_PATH}" --headless=new --screenshot="${outPath}" --window-size=${width},${height} --hide-scrollbars --disable-gpu --no-sandbox "${url}"`;
  execSync(cmd, { stdio: 'pipe' });
  const stats = fs.statSync(outPath);
  console.log(`✓ Generated ${path.basename(outPath)} (${width}x${height}, ${stats.size} bytes)`);
}

console.log('=== GENERATING AI DIGITAL MARKETING SPECIALIST SHOWCASE ASSETS ===');

projects.forEach(p => {
  console.log(`\nProcessing ${p.id} (${p.baseName})...`);
  const fileUrl = 'file:///' + p.htmlPath.replace(/\\/g, '/');

  // Desktop: 960x540
  const deskName = `${p.baseName}-desktop-960w.png`;
  const deskWeb = path.join(webDir, deskName);
  capture(fileUrl, deskWeb, 960, 540);
  fs.copyFileSync(deskWeb, path.join(publicDir, deskName));
  fs.copyFileSync(deskWeb, path.join(brainWebOpt, deskName));

  // Card: 640x360
  const cardName = `${p.baseName}-card-640w.png`;
  const cardWeb = path.join(webDir, cardName);
  capture(fileUrl, cardWeb, 640, 360);
  fs.copyFileSync(cardWeb, path.join(publicDir, cardName));
  fs.copyFileSync(cardWeb, path.join(brainWebOpt, cardName));

  // Mobile: 400x225
  const mobName = `${p.baseName}-mobile-400w.png`;
  const mobWeb = path.join(webDir, mobName);
  capture(fileUrl, mobWeb, 400, 225);
  fs.copyFileSync(mobWeb, path.join(publicDir, mobName));
  fs.copyFileSync(mobWeb, path.join(brainWebOpt, mobName));
});

console.log('\n=== AI DIGITAL MARKETING SPECIALIST SHOWCASE ASSETS GENERATED ===');
