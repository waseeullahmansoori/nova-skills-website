const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PORT = 9235;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';

let passCount = 0;
let failCount = 0;
const failures = [];

function assert(cond, msg) {
  if (cond) {
    passCount++;
    console.log(`  ✓ PASS: ${msg}`);
  } else {
    failCount++;
    console.error(`  ✗ FAIL: ${msg}`);
    failures.push(msg);
  }
}

async function launchChrome(tmpProfile) {
  const proc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tmpProfile}`
  ]);
  for (let i = 0; i < 40; i++) {
    try {
      await new Promise((res, rej) => {
        http.get(`http://127.0.0.1:${CHROME_PORT}/json/version`, r => r.statusCode === 200 ? res() : rej()).on('error', rej);
      });
      return proc;
    } catch (e) { await new Promise(r => setTimeout(r, 200)); }
  }
  throw new Error('Failed to start Chrome on port ' + CHROME_PORT);
}

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.cbs = new Map();
  }
  async connect() {
    await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
    this.ws.onmessage = m => {
      const d = JSON.parse(m.data);
      if (d.id && this.cbs.has(d.id)) {
        const { res, rej } = this.cbs.get(d.id);
        this.cbs.delete(d.id);
        if (d.error) rej(new Error(d.error.message));
        else res(d.result);
      }
    };
  }
  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = ++this.id;
      this.cbs.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ': ' + JSON.stringify(r.exceptionDetails));
    return r.result ? r.result.value : undefined;
  }
  async setVP(w, h) {
    await this.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w <= 768 });
    await new Promise(r => setTimeout(r, 250));
  }
  async nav(url) {
    await this.send('Page.navigate', { url });
    for (let i = 0; i < 40; i++) {
      const ok = await this.eval('document.readyState === "complete" && !!document.getElementById("main-header") && !!document.getElementById("announcement-bar")');
      if (ok) break;
      await new Promise(r => setTimeout(r, 150));
    }
    await new Promise(r => setTimeout(r, 300));
  }
  async snap(file) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, file), Buffer.from(data, 'base64'));
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

async function run() {
  console.log('================================================================');
  console.log('  GLOBAL HEADER LIVE CHROME QA: PARITY, RESPONSIVE & FUNCTIONAL');
  console.log('================================================================\n');

  const tmp = path.join(process.cwd(), 'tmp-gh-qa-' + Date.now());
  let proc, cdp;
  try {
    proc = await launchChrome(tmp);
    const tgt = await new Promise((res, rej) => {
      const req = http.request(`http://127.0.0.1:${CHROME_PORT}/json/new`, { method: 'PUT' }, r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      });
      req.on('error', rej); req.end();
    });
    cdp = new CDP(tgt.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Input.setIgnoreInputEvents', { ignore: false });

    // SUITE A: 18 Representative Routes Parity + Active Navigation + Sticky + Font @ 1440px
    console.log('[SUITE A] 18 Public Route Parity, Active State, Sticky & Font QA (1440px)');
    const expectedRoutes = [
      { name: 'homepage', url: 'http://127.0.0.1:8097/', active: 'Home', snap: 'after_header_homepage_1440px.png' },
      { name: 'courses', url: 'http://127.0.0.1:8097/courses.html', active: 'Courses', snap: 'after_header_courses_1440px.png' },
      { name: 'academies_index', url: 'http://127.0.0.1:8097/academies/', active: 'Courses' },
      { name: 'academy_design', url: 'http://127.0.0.1:8097/academies/design/', active: 'Courses', snap: 'after_header_academy_design_1440px.png' },
      { name: 'academy_programming', url: 'http://127.0.0.1:8097/academies/programming/', active: 'Courses' },
      { name: 'course_graphic_design', url: 'http://127.0.0.1:8097/_rendered_courses/graphic-design-pro.html', active: 'Courses', snap: 'after_header_course_graphic_design_1440px.png' },
      { name: 'course_video_pro', url: 'http://127.0.0.1:8097/_rendered_courses/video-pro.html', active: 'Courses' },
      { name: 'course_detail_dyn', url: 'http://127.0.0.1:8097/course-detail.html?id=dm-professional', active: 'Courses' },
      { name: 'assessment', url: 'http://127.0.0.1:8097/assessment.html', active: '✨ AI Career Advisor', snap: 'after_header_assessment_1440px.png' },
      { name: 'placements', url: 'http://127.0.0.1:8097/placements.html', active: 'Placements', snap: 'after_header_placements_1440px.png' },
      { name: 'contact', url: 'http://127.0.0.1:8097/contact/', active: 'Contact' },
      { name: 'blog_list', url: 'http://127.0.0.1:8097/blog.html', active: 'About' },
      { name: 'blog_post_ai', url: 'http://127.0.0.1:8097/blog/ai-skills-future-careers-2027-2030/', active: 'About', snap: 'after_header_blog_post_ai_1440px.png' },
      { name: 'blog_post_n8n', url: 'http://127.0.0.1:8097/blog/n8n-ai-automation-beginners/', active: 'About', snap: 'after_header_blog_post_n8n_1440px.png' },
      { name: 'branches_dir', url: 'http://127.0.0.1:8097/branches/', active: 'Learning Locations' },
      { name: 'city_indore_p1', url: 'http://127.0.0.1:8097/branches/indore/', active: 'Learning Locations', snap: 'after_header_city_indore_1440px.png' },
      { name: 'city_vadodara_p2', url: 'http://127.0.0.1:8097/branches/vadodara/', active: 'Learning Locations' },
      { name: 'city_basti_p3', url: 'http://127.0.0.1:8097/branches/basti/', active: 'Learning Locations' },
      { name: 'privacy_policy', url: 'http://127.0.0.1:8097/privacy-policy/', active: '' },
      { name: '404_page', url: 'http://127.0.0.1:8097/404.html', active: '' }
    ];

    await cdp.setVP(1440, 900);
    for (const r of expectedRoutes) {
      await cdp.nav(r.url);
      if (r.snap) await cdp.snap(r.snap);

      // Scroll test for sticky header
      await cdp.eval('window.scrollTo(0, 600)');
      await new Promise(res => setTimeout(res, 250));

      const stats = await cdp.eval(`(() => {
        const ann = document.getElementById('announcement-bar');
        const hdr = document.getElementById('main-header');
        const topLinks = Array.from(document.querySelectorAll('#nav-links > li:not(.mobile-drawer-action-group) > a'));
        const activeLinks = topLinks.filter(a => a.classList.contains('active'));
        const megaCount = document.querySelectorAll('.mega-menu .mega-item').length;
        return {
          annCount: document.querySelectorAll('.announcement-bar').length,
          hdrCount: document.querySelectorAll('.header').length,
          slide0: document.querySelector('.announcement-slide[data-index="0"] .announcement-text')?.textContent.trim(),
          topTexts: topLinks.map(a => a.textContent.replace(/⌄/g, '').trim()),
          activeTexts: activeLinks.map(a => a.textContent.replace(/⌄/g, '').trim()),
          ariaCurrents: activeLinks.map(a => a.getAttribute('aria-current')),
          hdrFont: hdr ? getComputedStyle(hdr).fontFamily.split(',')[0].replace(/"/g, '') : null,
          hdrPos: hdr ? getComputedStyle(hdr).position : null,
          hdrTopScrolled: hdr ? Math.round(hdr.getBoundingClientRect().top) : -999,
          hdrScrolledCls: hdr ? hdr.classList.contains('scrolled') : false,
          megaCount,
          overflowX: document.documentElement.scrollWidth > window.innerWidth
        };
      })()`);

      assert(stats.annCount === 1 && stats.hdrCount === 1, `[${r.name}] Single global announcement + header container (zero duplicates)`);
      assert(stats.slide0 && stats.slide0.includes('Admissions Open for Upcoming Batches'), `[${r.name}] Announcement Slide 0 matches Homepage copy`);
      assert(JSON.stringify(stats.topTexts) === JSON.stringify(['Home', 'Courses', 'Learning Locations', '✨ AI Career Advisor', 'Placements', 'About', 'Contact']), `[${r.name}] Exact 7-item top-nav hierarchy`);
      assert(stats.megaCount === 8, `[${r.name}] Courses mega-menu includes all 8 Homepage items`);
      const expActive = r.active ? [r.active] : [];
      assert(JSON.stringify(stats.activeTexts) === JSON.stringify(expActive), `[${r.name}] Active state === [${expActive.join(',')}] (got [${stats.activeTexts.join(',')}])`);
      if (r.active) {
        assert(stats.ariaCurrents[0] === 'page', `[${r.name}] Active link has aria-current="page"`);
      }
      assert(stats.hdrFont === 'Plus Jakarta Sans', `[${r.name}] Header font is Plus Jakarta Sans`);
      assert(stats.hdrTopScrolled === 0 && stats.hdrScrolledCls, `[${r.name}] Sticky header pins to top=0 with .scrolled class on desktop scroll`);
      assert(!stats.overflowX, `[${r.name}] Zero horizontal overflow at 1440px`);
    }

    // SUITE B: All 10 Viewport Breakpoints (320, 360, 375, 390, 414, 768, 1024, 1050, 1280, 1440) + Mobile Sticky + Mobile Drawer
    console.log('\n[SUITE B] All 10 Screen Widths Responsive, Mobile Sticky & Mobile Drawer QA');
    const widths = [320, 360, 375, 390, 414, 768, 1024, 1050, 1280, 1440];
    const vpTestPages = [
      { name: 'homepage', url: 'http://127.0.0.1:8097/' },
      { name: 'academy_design', url: 'http://127.0.0.1:8097/academies/design/' },
      { name: 'course_graphic_design', url: 'http://127.0.0.1:8097/_rendered_courses/graphic-design-pro.html' },
      { name: 'city_indore', url: 'http://127.0.0.1:8097/branches/indore/' }
    ];

    for (const pg of vpTestPages) {
      for (const w of widths) {
        await cdp.setVP(w, 844);
        await cdp.nav(pg.url);
        await cdp.eval('window.scrollTo(0, 600)');
        await new Promise(res => setTimeout(res, 250));

        const m = await cdp.eval(`(() => {
          const hdr = document.getElementById('main-header');
          const hamb = document.getElementById('hamburger');
          const navLinks = document.getElementById('nav-links');
          const links = Array.from(document.querySelectorAll('#nav-links > li > a'));
          const maxLinkH = Math.max(...links.map(a => Math.round(a.getBoundingClientRect().height)));
          return {
            overflow: document.documentElement.scrollWidth > window.innerWidth,
            scrollW: document.documentElement.scrollWidth,
            hdrTop: Math.round(hdr.getBoundingClientRect().top),
            hambVisible: getComputedStyle(hamb).display !== 'none',
            maxLinkH
          };
        })()`);

        assert(!m.overflow, `[${pg.name} @ ${w}px] Zero horizontal overflow (scrollW=${m.scrollW})`);
        assert(m.hdrTop === 0, `[${pg.name} @ ${w}px] Sticky header stays top=0 on scroll (got ${m.hdrTop})`);
        if (w <= 1024) {
          assert(m.hambVisible, `[${pg.name} @ ${w}px] Mobile hamburger button visible`);
        } else {
          assert(!m.hambVisible && m.maxLinkH <= 44, `[${pg.name} @ ${w}px] Desktop links single-line (maxHeight=${m.maxLinkH}px)`);
        }
      }
    }

    // Mobile interactive drawer test on Homepage & Course Detail @ 390px and 320px
    for (const target of [
      { name: 'homepage', url: 'http://127.0.0.1:8097/', snap390: 'after_mobile_drawer_homepage_390px.png' },
      { name: 'course_graphic_design', url: 'http://127.0.0.1:8097/_rendered_courses/graphic-design-pro.html', snap390: 'after_mobile_drawer_course_390px.png' },
      { name: 'city_indore', url: 'http://127.0.0.1:8097/branches/indore/', snap390: 'after_mobile_drawer_city_390px.png' }
    ]) {
      await cdp.setVP(390, 844);
      await cdp.nav(target.url);
      await cdp.eval('document.getElementById("hamburger").click()');
      await new Promise(res => setTimeout(res, 350));

      // Open Courses accordion inside mobile drawer
      await cdp.eval('document.querySelector(".mega-dropdown .dropdown-toggle").click()');
      await new Promise(res => setTimeout(res, 200));

      const drawer = await cdp.eval(`(() => {
        const nav = document.getElementById('nav-links');
        const megaMenu = document.querySelector('.mega-menu');
        const mobLogin = document.getElementById('mobile-drawer-auth-btn');
        const mobPhone = document.getElementById('mobile-drawer-phone-btn');
        const coursesToggle = document.querySelector('.mega-dropdown .dropdown-toggle');
        return {
          navOpen: nav.classList.contains('open'),
          bodyLocked: document.body.style.overflow === 'hidden',
          coursesExpanded: coursesToggle.getAttribute('aria-expanded') === 'true',
          megaVisible: getComputedStyle(megaMenu).display !== 'none',
          megaPointer: getComputedStyle(megaMenu).pointerEvents,
          hasMobLogin: !!mobLogin && getComputedStyle(mobLogin).display !== 'none',
          hasMobPhone: !!mobPhone && getComputedStyle(mobPhone).display !== 'none'
        };
      })()`);

      assert(drawer.navOpen && drawer.bodyLocked, `[${target.name} @ 390px] Mobile drawer opens & locks body scroll`);
      assert(drawer.coursesExpanded && drawer.megaVisible && drawer.megaPointer === 'auto', `[${target.name} @ 390px] Mobile Courses submenu toggles open & pointer-events=auto`);
      assert(drawer.hasMobLogin && drawer.hasMobPhone, `[${target.name} @ 390px] Mobile drawer includes Login/Sign Up + Call CTA`);
      await cdp.snap(target.snap390);

      // Test Escape closes mobile drawer
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
      await new Promise(res => setTimeout(res, 200));
      const closed = await cdp.eval('!document.getElementById("nav-links").classList.contains("open") && document.body.style.overflow === ""');
      assert(closed, `[${target.name} @ 390px] Escape key closes mobile drawer cleanly & unlocks scroll`);
    }

    // SUITE C: Announcement Carousel Controls, Dismiss Persistence & Nested Auth Path Check
    console.log('\n[SUITE C] Announcement Controls, Dismiss Persistence & Nested Login Redirect Check');
    await cdp.setVP(1440, 900);
    await cdp.nav('http://127.0.0.1:8097/branches/indore/');
    const annTest = await cdp.eval(`(() => {
      document.getElementById('announcement-next').click();
      return sessionStorage.getItem('ns_announcement_index');
    })()`);
    assert(annTest === '1', 'Announcement Next button advances slide index cleanly');

    await cdp.eval('document.getElementById("close-announcement").click()');
    await new Promise(res => setTimeout(res, 400));
    await cdp.nav('http://127.0.0.1:8097/academies/design/');
    const dismissed = await cdp.eval('getComputedStyle(document.getElementById("announcement-bar")).display === "none" && localStorage.getItem("ns_announcement_closed") === "true"');
    assert(dismissed, 'Announcement dismissal persists across navigation');
    await cdp.eval('localStorage.removeItem("ns_announcement_closed"); sessionStorage.removeItem("ns_announcement_index");');

    // Check tight desktop header screenshot at 1050px on course page
    await cdp.setVP(1050, 900);
    await cdp.nav('http://127.0.0.1:8097/_rendered_courses/graphic-design-pro.html');
    await cdp.snap('after_header_course_1050px.png');

    // Check Login / Sign Up onclick uses root-absolute '/login.html' on nested city route
    const loginFnStr = await cdp.eval('window.handleNavAuthClick.toString()');
    assert(loginFnStr.includes("'/login.html'") && loginFnStr.includes("'/admin.html'") && loginFnStr.includes("'/student.html'"), 'handleNavAuthClick navigates cleanly with root-absolute paths from nested routes');

    console.log('\n================================================================');
    console.log(`  GLOBAL HEADER BROWSER QA SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
    console.log('================================================================\n');

    if (failCount > 0) {
      console.error('Failures:', failures);
      process.exitCode = 1;
    }
  } finally {
    if (cdp) cdp.close();
    if (proc) proc.kill();
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
  }
}

run();
