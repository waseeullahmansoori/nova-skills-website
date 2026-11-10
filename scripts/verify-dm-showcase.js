const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artDir = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const outDir = path.join(artDir, 'nova-visual-production', '08-previews', 'after-screenshots');
fs.mkdirSync(outDir, { recursive: true });

const ROOT_DIR = path.resolve(__dirname, '..');
const serverScript = path.join(ROOT_DIR, 'scripts', 'serve.js');

console.log('Spawning independent test server...');
const serverProc = spawn('node', [serverScript], { stdio: 'pipe' });

setTimeout(() => {
  try {
    const PORT = 8097;
    const vps = [
      { name: 'desktop-1440', w: 1440, h: 900 },
      { name: 'desktop-1024', w: 1024, h: 768 },
      { name: 'tablet-768', w: 768, h: 1024 },
      { name: 'mobile-390', w: 390, h: 844 },
      { name: 'mobile-320', w: 320, h: 568 }
    ];

    console.log('\n=== CAPTURING DM PROFESSIONAL SHOWCASE SCREENSHOTS ===');
    const courseUrl = `http://127.0.0.1:${PORT}/course-detail.html?id=dm-professional`;
    vps.forEach(vp => {
      const outFile = path.join(outDir, `phaseE-dm-showcase-${vp.name}.png`);
      const cmd = `"${chromePath}" --headless --disable-gpu --window-size=${vp.w},${vp.h} --screenshot="${outFile}" "${courseUrl}"`;
      execSync(cmd);
      console.log(`✓ DM Showcase ${vp.name} (${fs.statSync(outFile).size} bytes): ${outFile}`);
    });

    console.log('\n=== VERIFYING DOM ATTRIBUTES AND GATED SHOWCASE ENGINE ===');
    function checkPage(url) {
      const cmd = `"${chromePath}" --headless --disable-gpu --dump-dom "${url}"`;
      return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    }

    const dmHtml = checkPage(courseUrl);
    console.log('AI Digital Marketing Specialist:');
    console.log('- Has project-showcase-section:', dmHtml.includes('id="project-showcase-section"'));
    console.log('- Has ns-proj-dm-01 featured card:', dmHtml.includes('ns-proj-dm-01'));
    console.log('- Has ns-proj-dm-02 supporting card:', dmHtml.includes('ns-proj-dm-02'));
    console.log('- Has ns-proj-dm-03 supporting card:', dmHtml.includes('ns-proj-dm-03'));
    console.log('- Has showcase CTA buttons:', dmHtml.includes('btn-showcase-demo') && dmHtml.includes('btn-showcase-enroll'));

    const unapprovedUrl = `http://127.0.0.1:${PORT}/course-detail.html?id=shopify-cert`;
    const unapprovedHtml = checkPage(unapprovedUrl);
    console.log('\nUnapproved Course (Shopify Certification - Queued):');
    const hasVisibleShowcase = unapprovedHtml.includes('id="project-showcase-section"') && !unapprovedHtml.includes('id="project-showcase-section" style="display:none;"');
    console.log('- Has visible project showcase (should be false):', hasVisibleShowcase);

    console.log('\n=== STAGE E6 VERIFICATION COMPLETE ===');
  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    console.log('Killing test server...');
    serverProc.kill();
    process.exit(0);
  }
}, 2000);
