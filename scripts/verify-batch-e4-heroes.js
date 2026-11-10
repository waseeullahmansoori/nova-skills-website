const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const brainDir = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const previewDir = path.join(brainDir, 'nova-visual-production', '08-previews', 'after-screenshots');
fs.mkdirSync(previewDir, { recursive: true });

console.log('Spawning independent test server...');
const serverProcess = spawn('node', ['scripts/serve.js'], {
  stdio: 'inherit'
});

setTimeout(() => {
  try {
    const viewports = [
      { name: 'desktop-1440', width: 1440, height: 900 },
      { name: 'desktop-1024', width: 1024, height: 768 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'mobile-390', width: 390, height: 844 },
      { name: 'mobile-320', width: 320, height: 640 }
    ];

    console.log('\n=== CAPTURING CREATOR ACADEMY HERO SCREENSHOTS ===');
    viewports.forEach(vp => {
      const outPath = path.join(previewDir, `phaseE-creator-hero-${vp.name}.png`);
      const cmd = `"${CHROME_PATH}" --headless=new --screenshot="${outPath}" --window-size=${vp.width},${vp.height} --hide-scrollbars --disable-gpu --no-sandbox "http://127.0.0.1:8097/academies/creator/index.html"`;
      execSync(cmd, { stdio: 'pipe' });
      const stats = fs.statSync(outPath);
      console.log(`✓ Creator Hero ${vp.name} (${stats.size} bytes): ${outPath}`);
    });

    console.log('\n=== CAPTURING KIDS TECH ACADEMY HERO SCREENSHOTS ===');
    viewports.forEach(vp => {
      const outPath = path.join(previewDir, `phaseE-kids-hero-${vp.name}.png`);
      const cmd = `"${CHROME_PATH}" --headless=new --screenshot="${outPath}" --window-size=${vp.width},${vp.height} --hide-scrollbars --disable-gpu --no-sandbox "http://127.0.0.1:8097/academies/kids-tech/index.html"`;
      execSync(cmd, { stdio: 'pipe' });
      const stats = fs.statSync(outPath);
      console.log(`✓ Kids Tech Hero ${vp.name} (${stats.size} bytes): ${outPath}`);
    });

    console.log('\n=== VERIFYING DOM ATTRIBUTES AND HERO ARCHITECTURE ===');
    // Read and verify HTML files directly
    const creatorHtml = fs.readFileSync('academies/creator/index.html', 'utf8');
    const kidsHtml = fs.readFileSync('academies/kids-tech/index.html', 'utf8');

    console.log('Creator Academy:');
    console.log('- Has academy-hero-visual-col:', creatorHtml.includes('id="academy-hero-visual-col"'));
    console.log('- Has NS-ACAD-CREATOR-MASTER schema:', creatorHtml.includes('Creator Academy Professional Studio Workspace'));
    console.log('- Has 896w desktop picture source:', creatorHtml.includes('ns-academy-creator-hero-desktop-896w.png'));
    console.log('- Has 600w tablet picture source:', creatorHtml.includes('ns-academy-creator-hero-tablet-600w.png'));
    console.log('- Has 400w mobile picture source:', creatorHtml.includes('ns-academy-creator-hero-mobile-400w.png'));

    console.log('\nKids Tech Academy:');
    console.log('- Has academy-hero-visual-col:', kidsHtml.includes('id="academy-hero-visual-col"'));
    console.log('- Has NS-ACAD-KIDS-MASTER schema:', kidsHtml.includes('Interactive Coding, AI & Physical Robotics Maker Studio'));
    console.log('- Has 896w desktop picture source:', kidsHtml.includes('ns-academy-kids-hero-desktop-896w.png'));
    console.log('- Has 600w tablet picture source:', kidsHtml.includes('ns-academy-kids-hero-tablet-600w.png'));
    console.log('- Has 400w mobile picture source:', kidsHtml.includes('ns-academy-kids-hero-mobile-400w.png'));

    console.log('\n=== BATCH E4 VERIFICATION COMPLETE ===');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    console.log('Killing test server...');
    serverProcess.kill('SIGTERM');
  }
}, 2500);
