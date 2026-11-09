const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const EXPECTED_BADGE_TEXT = '📍 Classroom in Siddharth Nagar • 💻 Live Interactive Online (Pan-India)';

async function pollDeployment() {
  console.log('Polling Cloudflare Pages deployment...');
  for (let i = 0; i < 30; i++) {
    const res = await fetch('https://novaskills.in/academies/programming/?_cf_bust=' + Date.now(), {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const html = await res.text();
    const hasPanIndia = html.includes('Live Interactive Online (Pan-India)</span>');
    const hasOld = html.includes('Live Interactive Online (Pan-India & Mumbai)</span>');
    console.log(`[Attempt ${i + 1}] Live status - New Text: ${hasPanIndia} | Old Text: ${hasOld}`);
    if (hasPanIndia && !hasOld) {
      console.log('🎉 Cloudflare deployment of commit 82c4b90 is LIVE!');
      return true;
    }
    await new Promise(r => setTimeout(r, 4000));
  }
  return false;
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 0;
    this.callbacks = new Map();
  }
  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const { res, rej } = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) rej(new Error(data.error.message));
          else res(data.result);
        }
      };
    });
  }
  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { res: resolve, rej: reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.text || 'Runtime.evaluate exception');
    return res.result ? res.result.value : undefined;
  }
  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`  📸 Saved screenshot: ${filePath}`);
  }
  close() {
    if (this.ws) this.ws.close();
  }
}

async function verifyLiveBrowser() {
  const isDeployed = await pollDeployment();
  if (!isDeployed) {
    console.error('Cloudflare deployment timed out.');
    process.exit(1);
  }

  console.log('\n--- Live Browser Verification on https://novaskills.in ---');
  const CHROME_PORT = 9231;
  const tmpProfile = path.join(__dirname, '..', 'tmp-chrome-live-' + Date.now());
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tmpProfile}`
  ]);

  let chromeReady = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const v = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/version`);
      if (v.ok) {
        chromeReady = true;
        break;
      }
    } catch (e) {}
  }
  if (!chromeReady) throw new Error('Chrome failed to start');

  try {
    const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/new`, { method: 'PUT' });
    const target = await res.json();
    const cdp = new CDPClient(target.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    // Desktop 1440px on Live Site
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    console.log('Navigating to live Programming Academy...');
    await cdp.send('Page.navigate', { url: 'https://novaskills.in/academies/programming/' });
    await new Promise(r => setTimeout(r, 5000));

    const liveDesktopBadge = await cdp.evaluate(`
      (() => {
        const badge = document.querySelector('.badge-delivery');
        return badge ? badge.textContent.trim() : null;
      })()
    `);
    console.log('Live Desktop Badge:', liveDesktopBadge);
    if (liveDesktopBadge === EXPECTED_BADGE_TEXT) {
      console.log('  ✅ PASS: Live Desktop (1440px) renders exact approved badge text!');
    } else {
      console.error(`  ❌ FAIL: Live Desktop badge mismatch: "${liveDesktopBadge}"`);
    }
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'live_production_pan_india_badge_1440px.png'));

    // Mobile 390px on Live Site
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    console.log('Navigating to live Digital Marketing Academy...');
    await cdp.send('Page.navigate', { url: 'https://novaskills.in/academies/digital-marketing/' });
    await new Promise(r => setTimeout(r, 5000));

    const liveMobileBadge = await cdp.evaluate(`
      (() => {
        const badge = document.querySelector('.badge-delivery');
        return badge ? badge.textContent.trim() : null;
      })()
    `);
    console.log('Live Mobile Badge:', liveMobileBadge);
    if (liveMobileBadge === EXPECTED_BADGE_TEXT) {
      console.log('  ✅ PASS: Live Mobile (390px) renders exact approved badge text!');
    } else {
      console.error(`  ❌ FAIL: Live Mobile badge mismatch: "${liveMobileBadge}"`);
    }
    await cdp.screenshot(path.join(ARTIFACT_DIR, 'live_production_pan_india_badge_390px.png'));

    cdp.close();
  } finally {
    chromeProcess.kill('SIGKILL');
    try { fs.rmSync(tmpProfile, { recursive: true, force: true }); } catch (e) {}
  }
}

verifyLiveBrowser().catch(err => {
  console.error('Live verification error:', err);
  process.exit(1);
});
