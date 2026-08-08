const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('NOVA SKILLS — DEEP COMPREHENSIVE WEBSITE AUDIT');
console.log('====================================================\n');

let issues = [];
let warnings = [];
let passCount = 0;

function reportIssue(category, file, message) {
  issues.push({ category, file, message });
  console.error(`❌ [${category}] ${file}: ${message}`);
}

function reportWarning(category, file, message) {
  warnings.push({ category, file, message });
  console.warn(`⚠️ [${category}] ${file}: ${message}`);
}

function reportPass(category, message) {
  passCount++;
}

// ----------------------------------------------------
// 1. JAVASCRIPT SYNTAX & PARSING CHECK
// ----------------------------------------------------
console.log('--- 1. JavaScript Syntax & Parsing Check ---');
function checkJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkJsFiles(fullPath);
    } else if (entry.name.endsWith('.js')) {
      const relPath = path.relative(ROOT_DIR, fullPath);
      try {
        execSync(`node --check "${fullPath}"`, { stdio: 'pipe' });
        reportPass('JS_SYNTAX', `${relPath} passed syntax check`);
      } catch (err) {
        reportIssue('JS_SYNTAX', relPath, `Syntax error: ${err.message}`);
      }
    }
  }
}
checkJsFiles(ROOT_DIR);

// ----------------------------------------------------
// 2. DATA INTEGRITY CHECK (data.js & js/data.min.js)
// ----------------------------------------------------
console.log('\n--- 2. Data Integrity Check ---');
const dataJsPath = path.join(ROOT_DIR, 'data.js');
const dataMinJsPath = path.join(ROOT_DIR, 'js', 'data.min.js');

if (!fs.existsSync(dataJsPath)) {
  reportIssue('DATA', 'data.js', 'data.js file is missing!');
} else {
  // Load data.js
  const vm = require('vm');
  const context = { window: {}, module: {}, exports: {} };
  vm.createContext(context);
  const dataCode = fs.readFileSync(dataJsPath, 'utf8');
  try {
    vm.runInContext(dataCode, context);
    const NS_COURSES = context.NS_COURSES || context.window.NS_COURSES;
    const NS_ACADEMIES = context.NS_ACADEMIES || context.window.NS_ACADEMIES;
    const NS_BLOG_POSTS = context.NS_BLOG_POSTS || context.window.NS_BLOG_POSTS;
    const NS_ACADEMY_LANDING_DATA = context.NS_ACADEMY_LANDING_DATA || context.window.NS_ACADEMY_LANDING_DATA;

    console.log(`Loaded from data.js: ${NS_COURSES ? NS_COURSES.length : 0} courses, ${NS_ACADEMIES ? NS_ACADEMIES.length : 0} academies, ${NS_BLOG_POSTS ? NS_BLOG_POSTS.length : 0} blog posts`);

    // Check course duplicates and missing fields
    const courseIds = new Set();
    const courseSlugs = new Set();
    const validAcademyIds = new Set(NS_ACADEMIES.map(a => a.id).concat(NS_ACADEMIES.map(a => a.slug)));

    NS_COURSES.forEach((c, idx) => {
      if (!c.id) reportIssue('DATA_COURSE', `Course[${idx}]`, 'Missing course id');
      if (courseIds.has(c.id)) reportIssue('DATA_COURSE', `Course[${c.id}]`, `Duplicate course id: ${c.id}`);
      courseIds.add(c.id);

      if (!c.name) reportIssue('DATA_COURSE', `Course[${c.id}]`, 'Missing course name');
      if (!c.academy) reportIssue('DATA_COURSE', `Course[${c.id}]`, 'Missing academy name');
      if (!c.academyId) reportIssue('DATA_COURSE', `Course[${c.id}]`, 'Missing academyId');
      if (!c.price || typeof c.price !== 'number') reportIssue('DATA_COURSE', `Course[${c.id}]`, `Invalid price: ${c.price}`);
      if (!c.shortDesc) reportIssue('DATA_COURSE', `Course[${c.id}]`, 'Missing shortDesc');
      if (!c.curriculum || !Array.isArray(c.curriculum) || c.curriculum.length === 0) {
        reportWarning('DATA_COURSE', `Course[${c.id}]`, 'Missing or empty curriculum array');
      }
    });

    // Check academy landing data
    NS_ACADEMIES.forEach(a => {
      if (!a.id) reportIssue('DATA_ACADEMY', `Academy`, 'Missing academy id');
      if (!a.slug) reportIssue('DATA_ACADEMY', `Academy[${a.id}]`, 'Missing academy slug');
      if (!a.name) reportIssue('DATA_ACADEMY', `Academy[${a.id}]`, 'Missing academy name');
      
      const landingData = NS_ACADEMY_LANDING_DATA[a.slug] || NS_ACADEMY_LANDING_DATA[a.id];
      if (!landingData) {
        reportIssue('DATA_ACADEMY', `Academy[${a.id}]`, `Missing NS_ACADEMY_LANDING_DATA for slug: ${a.slug} / id: ${a.id}`);
      }
    });

    // Check blog posts
    NS_BLOG_POSTS.forEach(b => {
      if (!b.id && !b.slug) reportIssue('DATA_BLOG', 'BlogPost', 'Missing blog id or slug');
      if (!b.title) reportIssue('DATA_BLOG', `BlogPost[${b.id || b.slug}]`, 'Missing blog title');
      if (!b.content && !b.htmlContent && !b.summary && !b.excerpt) {
        reportWarning('DATA_BLOG', `BlogPost[${b.id || b.slug}]`, 'Missing blog content');
      }
    });

  } catch (err) {
    reportIssue('DATA', 'data.js', `Error running data.js: ${err.message}`);
  }
}

// Compare data.js vs data.min.js
if (fs.existsSync(dataMinJsPath)) {
  const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');
  const dataMinJsContent = fs.readFileSync(dataMinJsPath, 'utf8');
  if (dataJsContent.length !== dataMinJsContent.length) {
    reportWarning('DATA_SYNC', 'js/data.min.js', `data.js (${dataJsContent.length} bytes) and js/data.min.js (${dataMinJsContent.length} bytes) size mismatch!`);
  }
}

// ----------------------------------------------------
// 3. HTML AUDIT: ASSETS, LINKS, PRELOADS, CANONICALS
// ----------------------------------------------------
console.log('\n--- 3. HTML Files & Internal Link Audit ---');

const htmlFiles = [];
function findHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath);
    } else if (entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}
findHtmlFiles(ROOT_DIR);

htmlFiles.forEach(filePath => {
  const relPath = path.relative(ROOT_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check Title
  const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    reportIssue('HTML_SEO', relPath, 'Missing or empty <title> tag');
  }

  // Check Meta Description
  const metaDescMatch = content.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                        content.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  if (!metaDescMatch || !metaDescMatch[1].trim()) {
    reportWarning('HTML_SEO', relPath, 'Missing or empty meta description');
  }

  // Check Canonical
  const canonicalMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  if (!canonicalMatch) {
    reportWarning('HTML_SEO', relPath, 'Missing canonical tag');
  } else {
    const canonical = canonicalMatch[1];
    if (!canonical.startsWith('https://novaskills.in/') && !canonical.startsWith('/')) {
      reportIssue('HTML_SEO', relPath, `Invalid canonical link format: ${canonical}`);
    }
  }

  // Check Open Graph tags
  if (!content.includes('property="og:title"') && !content.includes("property='og:title'")) {
    reportWarning('HTML_OG', relPath, 'Missing og:title');
  }
  if (!content.includes('property="og:description"') && !content.includes("property='og:description'")) {
    reportWarning('HTML_OG', relPath, 'Missing og:description');
  }
  if (!content.includes('property="og:image"') && !content.includes("property='og:image'")) {
    reportWarning('HTML_OG', relPath, 'Missing og:image');
  }

  // Check Linked Assets & Local Files
  // 1) <link rel="preload" href="..."
  // 2) <link rel="stylesheet" href="..."
  // 3) <script src="..."
  // 4) <img src="..."
  const assetRegex = /(?:src|href|poster)=["']([^"']+)["']/gi;
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    let url = match[1];
    if (url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('data:')) {
      continue;
    }
    // External URLs
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      // Check if it is pointing to our own domain with a path
      if (url.startsWith('https://novaskills.in/')) {
        url = url.replace('https://novaskills.in', '');
      } else {
        continue;
      }
    }

    // Strip query string and hash
    const cleanUrl = url.split('?')[0].split('#')[0];
    if (!cleanUrl) continue;

    // Resolve local path
    let localTarget;
    if (cleanUrl.startsWith('/')) {
      localTarget = path.join(ROOT_DIR, cleanUrl.slice(1));
    } else {
      localTarget = path.join(path.dirname(filePath), cleanUrl);
    }

    // If target is a directory, check for index.html
    if (fs.existsSync(localTarget) && fs.statSync(localTarget).isDirectory()) {
      localTarget = path.join(localTarget, 'index.html');
    }

    // URL decode for check
    const decodedTarget = decodeURIComponent(localTarget);

    if (!fs.existsSync(decodedTarget) && !fs.existsSync(localTarget)) {
      // Allow dynamic template endpoints like /course-detail.html?id= or /blog-detail.html?id=
      if (!cleanUrl.includes('course-detail') && !cleanUrl.includes('blog-detail') && !cleanUrl.includes('academy-detail')) {
        reportIssue('BROKEN_LINK', relPath, `Broken reference to local asset or page: ${url} (Resolved: ${localTarget})`);
      }
    }
  }
});

// ----------------------------------------------------
// 4. SITEMAP.XML AUDIT
// ----------------------------------------------------
console.log('\n--- 4. Sitemap.xml Verification ---');
const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  reportIssue('SITEMAP', 'sitemap.xml', 'sitemap.xml is missing!');
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  console.log(`Found ${locMatches.length} URLs in sitemap.xml`);

  const seenSitemapUrls = new Set();
  locMatches.forEach(url => {
    if (seenSitemapUrls.has(url)) {
      reportIssue('SITEMAP', 'sitemap.xml', `Duplicate URL in sitemap: ${url}`);
    }
    seenSitemapUrls.add(url);

    if (!url.startsWith('https://novaskills.in')) {
      reportIssue('SITEMAP', 'sitemap.xml', `Sitemap URL does not use https://novaskills.in: ${url}`);
    }

    // Check if course-detail query ID exists in data.js
    if (url.includes('course-detail.html?id=')) {
      const id = url.split('id=')[1];
      const vm = require('vm');
      const context = { window: {}, module: {}, exports: {} };
      vm.createContext(context);
      vm.runInContext(fs.readFileSync(dataJsPath, 'utf8'), context);
      const NS_COURSES = context.NS_COURSES || context.window.NS_COURSES;
      const course = NS_COURSES.find(c => c.id === id);
      if (!course) {
        reportIssue('SITEMAP', 'sitemap.xml', `Sitemap contains unknown course ID: ${id}`);
      }
    }
  });
}

// ----------------------------------------------------
// 5. REDIRECTS AUDIT
// ----------------------------------------------------
console.log('\n--- 5. Redirects Configuration Audit ---');
const redirectsPath = path.join(ROOT_DIR, '_redirects');
if (!fs.existsSync(redirectsPath)) {
  reportIssue('REDIRECTS', '_redirects', '_redirects file missing!');
} else {
  const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
  const lines = redirectsContent.split('\n');
  const rules = [];

  lines.forEach((line, idx) => {
    const clean = line.trim();
    if (!clean || clean.startsWith('#')) return;
    const parts = clean.split(/\s+/);
    if (parts.length >= 3) {
      rules.push({ lineNum: idx + 1, from: parts[0], to: parts[1], status: parseInt(parts[2], 10) });
    }
  });

  console.log(`Audited ${rules.length} redirect/rewrite rules in _redirects`);

  // Check for loops (A -> B -> A)
  const redirectMap = new Map();
  rules.forEach(r => {
    if (r.status === 301 || r.status === 302) {
      redirectMap.set(r.from, r.to);
    }
  });

  redirectMap.forEach((to, from) => {
    if (redirectMap.has(to)) {
      const nextTo = redirectMap.get(to);
      if (nextTo === from) {
        reportIssue('REDIRECTS', '_redirects', `Direct redirect loop detected between ${from} and ${to}`);
      } else {
        reportWarning('REDIRECTS', '_redirects', `Redirect chain detected: ${from} -> ${to} -> ${nextTo}`);
      }
    }
  });
}

// ----------------------------------------------------
// 6. HEADERS & CSP AUDIT
// ----------------------------------------------------
console.log('\n--- 6. Security Headers & CSP Audit ---');
const headersPath = path.join(ROOT_DIR, '_headers');
if (!fs.existsSync(headersPath)) {
  reportIssue('HEADERS', '_headers', '_headers file missing!');
} else {
  const headersContent = fs.readFileSync(headersPath, 'utf8');
  if (!headersContent.includes('Strict-Transport-Security')) {
    reportIssue('HEADERS', '_headers', 'Missing HSTS header');
  }
  if (!headersContent.includes('X-Content-Type-Options: nosniff')) {
    reportIssue('HEADERS', '_headers', 'Missing X-Content-Type-Options nosniff');
  }
  if (!headersContent.includes('Content-Security-Policy')) {
    reportIssue('HEADERS', '_headers', 'Missing Content-Security-Policy');
  }
}

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`AUDIT RESULTS: ${issues.length} ISSUES, ${warnings.length} WARNINGS, ${passCount} CHECKS PASSED`);
console.log('====================================================');

if (issues.length > 0) {
  console.log('\n--- Summary of Issues to Fix: ---');
  issues.forEach((iss, i) => {
    console.log(`${i + 1}. [${iss.category}] ${iss.file}: ${iss.message}`);
  });
}

if (warnings.length > 0) {
  console.log('\n--- Summary of Warnings: ---');
  warnings.forEach((w, i) => {
    console.log(`${i + 1}. [${w.category}] ${w.file}: ${w.message}`);
  });
}
