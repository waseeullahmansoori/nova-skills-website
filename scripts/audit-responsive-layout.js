'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8097;
const CHROME_PORT = 9222;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = path.join(ROOT_DIR, 'artifacts', 'responsive-audit');

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
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
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
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
    return new Promise((res, rej) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return result.result ? result.result.value : null;
  }

  async captureScreenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
  }

  async close() {
    if (this.ws) this.ws.close();
  }
}

async function getNewTab() {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:${CHROME_PORT}/json/new`, { method: 'PUT' }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const tab = JSON.parse(raw);
          resolve(tab.webSocketDebuggerUrl);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function getPagesInventory() {
  const sitemapXml = fs.readFileSync(path.join(ROOT_DIR, 'sitemap.xml'), 'utf8');
  const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

  return urls.map((canonicalUrl, index) => {
    let localPath = canonicalUrl.replace('https://novaskills.in', '');
    if (localPath === '') localPath = '/';

    let pageType = 'other';
    let template = 'unknown';

    if (localPath === '/') {
      pageType = 'Home';
      template = 'index.html';
    } else if (localPath === '/courses') {
      pageType = 'Course Catalog';
      template = 'courses.html';
    } else if (['/placements', '/assessment', '/blog', '/success-stories', '/verify'].includes(localPath)) {
      pageType = 'Institutional / Tools';
      template = localPath.replace('/', '') + '.html';
    } else if (['/privacy-policy/', '/refund-policy/', '/terms-and-conditions/', '/contact/'].includes(localPath)) {
      pageType = 'Legal & Contact';
      template = localPath.slice(1) + 'index.html';
    } else if (localPath.startsWith('/academies/')) {
      pageType = 'Academy Landing';
      template = localPath === '/academies/' ? 'academies/index.html' : 'scripts/build-academy-pages.js';
    } else if (localPath.startsWith('/branches/')) {
      pageType = 'Learning Locations';
      template = localPath === '/branches/' ? 'scripts/build-branches-directory.js' : 'scripts/build-all-city-pages-phaseF.js';
    } else if (localPath.startsWith('/blog/')) {
      pageType = 'Blog Article';
      template = 'blog-detail.html';
    } else if (localPath.includes('course-detail.html')) {
      pageType = 'Course Detail';
      template = 'course-detail.html';
    }

    return {
      id: `P-${String(index + 1).padStart(3, '0')}`,
      canonicalUrl,
      localUrl: `http://127.0.0.1:${PORT}${localPath}`,
      pageType,
      template
    };
  });
}

const VIEWPORTS = [
  { id: 'mobile_320', width: 320, height: 640, isMobile: true, label: '320px (Mobile Small)' },
  { id: 'mobile_360', width: 360, height: 800, isMobile: true, label: '360px (Mobile Standard)' },
  { id: 'mobile_390', width: 390, height: 844, isMobile: true, label: '390px (Mobile Common)' },
  { id: 'tablet_768', width: 768, height: 1024, isMobile: true, label: '768px (Tablet Portrait)' },
  { id: 'tablet_1024', width: 1024, height: 768, isMobile: false, label: '1024px (Tablet Landscape)' },
  { id: 'desktop_1440', width: 1440, height: 900, isMobile: false, label: '1440px (Desktop Standard)' }
];

async function main() {
  console.log('====================================================');
  console.log('  NOVA SKILLS COMPLETE RESPONSIVE AUDIT & QA SUITE  ');
  console.log('====================================================\n');

  console.log('1. Starting local static server on port ' + PORT + '...');
  const serverProcess = spawn('node', ['scripts/serve.js'], { cwd: ROOT_DIR });
  await new Promise(r => setTimeout(r, 1000));

  console.log('2. Launching headless Chrome CDP...');
  const tempProfile = path.join(ROOT_DIR, 'tmp-chrome-audit-' + Date.now());
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + tempProfile
  ]);

  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${CHROME_PORT}/json/version`, (res) => {
          if (res.statusCode === 200) { ready = true; resolve(); }
          else reject();
        }).on('error', reject);
      });
      if (ready) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (!ready) {
    serverProcess.kill();
    throw new Error('Chrome failed to start within timeout');
  }

  const wsUrl = await getNewTab();
  const cdp = new CDPClient(wsUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const pages = getPagesInventory();
  console.log(`3. Discovered ${pages.length} published routes in sitemap.xml.\n`);

  // Target representative screenshot pages
  const screenshotTargets = new Set([
    'http://127.0.0.1:8097/',
    'http://127.0.0.1:8097/courses',
    'http://127.0.0.1:8097/course-detail.html?id=dm-pro',
    'http://127.0.0.1:8097/course-detail.html?id=ai-prompt-engineering',
    'http://127.0.0.1:8097/academies/digital-marketing/',
    'http://127.0.0.1:8097/branches/indore/',
    'http://127.0.0.1:8097/branches/',
    'http://127.0.0.1:8097/academies/',
    'http://127.0.0.1:8097/placements',
    'http://127.0.0.1:8097/assessment',
    'http://127.0.0.1:8097/contact/',
    'http://127.0.0.1:8097/privacy-policy/',
    'http://127.0.0.1:8097/blog',
    'http://127.0.0.1:8097/blog/ai-seo-geo-digital-marketing-2026/'
  ]);

  const auditResults = [];
  let totalEvaluations = 0;
  let totalFailures = 0;

  const startTime = Date.now();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageResult = {
      id: page.id,
      canonicalUrl: page.canonicalUrl,
      localUrl: page.localUrl,
      pageType: page.pageType,
      template: page.template,
      viewports: {},
      hasDefect: false,
      issues: []
    };

    // Initial navigation at default metrics
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    try {
      await cdp.send('Page.navigate', { url: page.localUrl });
      // Allow dynamic rendering/client scripts to settle
      await new Promise(r => setTimeout(r, 600));

      for (const vp of VIEWPORTS) {
        totalEvaluations++;
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.isMobile
        });
        await new Promise(r => setTimeout(r, 150));

        const metrics = await cdp.evaluate(`
          (() => {
            const docW = document.documentElement.clientWidth;
            const scrollW = document.documentElement.scrollWidth;
            const bodyScrollW = document.body ? document.body.scrollWidth : 0;
            const maxScrollW = Math.max(scrollW, bodyScrollW);
            const hasOverflow = maxScrollW > (docW + 1);

            // Find overflowing elements
            let culprits = [];
            if (hasOverflow) {
              const all = document.querySelectorAll('*');
              for (let el of all) {
                const r = el.getBoundingClientRect();
                const s = window.getComputedStyle(el);
                if (s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' && r.width > 0) {
                  if (r.right > docW + 1.5 || r.left < -1.5) {
                    culprits.push({
                      tag: el.tagName,
                      id: el.id,
                      cls: (el.className || '').toString().slice(0, 40),
                      rect: { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) }
                    });
                  }
                }
              }
            }

            // Check header hamburger
            const hamburger = document.querySelector('.hamburger');
            const hamburgerVisible = hamburger ? (window.getComputedStyle(hamburger).display !== 'none') : false;

            // Check CTA touch targets on mobile
            let smallTouchTargets = 0;
            if (${vp.width} <= 480) {
              const buttons = document.querySelectorAll('button, .btn, .city-btn, .nav-link, a.social-link');
              for (let b of buttons) {
                const r = b.getBoundingClientRect();
                const s = window.getComputedStyle(b);
                if (s.display !== 'none' && s.visibility !== 'hidden' && r.height > 0) {
                  if (r.height < 32 || r.width < 32) {
                    smallTouchTargets++;
                  }
                }
              }
            }

            return {
              docW,
              scrollW,
              bodyScrollW,
              maxScrollW,
              hasOverflow,
              culpritCount: culprits.length,
              culprits: culprits.slice(0, 5),
              hamburgerVisible,
              smallTouchTargets
            };
          })()
        `);

        const vpStatus = {
          viewportId: vp.id,
          label: vp.label,
          docW: metrics ? metrics.docW : vp.width,
          maxScrollW: metrics ? metrics.maxScrollW : vp.width,
          hasOverflow: metrics ? metrics.hasOverflow : false,
          culprits: metrics ? metrics.culprits : [],
          hamburgerVisible: metrics ? metrics.hamburgerVisible : false,
          smallTouchTargets: metrics ? metrics.smallTouchTargets : 0,
          pass: metrics ? !metrics.hasOverflow : false
        };

        if (!vpStatus.pass) {
          totalFailures++;
          pageResult.hasDefect = true;
          pageResult.issues.push({
            viewport: vp.label,
            docW: vpStatus.docW,
            maxScrollW: vpStatus.maxScrollW,
            culprits: vpStatus.culprits
          });
        }

        pageResult.viewports[vp.id] = vpStatus;

        // Screenshot capture for key targets
        if (screenshotTargets.has(page.localUrl) && (vp.id === 'mobile_390' || vp.id === 'desktop_1440' || vp.id === 'mobile_320')) {
          const safeSlug = page.localUrl.replace('http://127.0.0.1:8097', '').replace(/[^a-zA-Z0-9_-]/g, '_') || 'home';
          const filename = `${safeSlug}_${vp.id}.png`;
          const ssPath = path.join(ARTIFACTS_DIR, filename);
          try {
            await cdp.captureScreenshot(ssPath);
            pageResult.screenshot = filename;
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error(`Error auditing ${page.localUrl}:`, err.message);
      pageResult.hasDefect = true;
      pageResult.error = err.message;
    }

    const statusBadge = pageResult.hasDefect ? '❌ DEFECTS' : '✅ PASS';
    const issuesSummary = pageResult.hasDefect ? `(${pageResult.issues.length} viewport issues)` : '';
    console.log(`[${i + 1}/${pages.length}] ${page.id} ${statusBadge} ${page.canonicalUrl} ${issuesSummary}`);
    auditResults.push(pageResult);
  }

  const durationSec = Math.round((Date.now() - startTime) / 1000);
  console.log(`\nAudit completed in ${durationSec}s. Evaluated ${totalEvaluations} viewport assertions. Total failures: ${totalFailures}.`);

  const resultsSummary = {
    timestamp: new Date().toISOString(),
    totalPages: pages.length,
    totalEvaluations,
    totalFailures,
    durationSec,
    passRate: `${(((totalEvaluations - totalFailures) / totalEvaluations) * 100).toFixed(1)}%`,
    pages: auditResults
  };

  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'audit-results.json'), JSON.stringify(resultsSummary, null, 2), 'utf8');
  console.log(`Saved comprehensive audit results to ${path.join(ARTIFACTS_DIR, 'audit-results.json')}`);

  await cdp.close();
  chromeProcess.kill();
  serverProcess.kill();
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  } catch (e) {}
}

main().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
