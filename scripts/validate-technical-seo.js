/**
 * ============================================================
 * NOVA SKILLS — TECHNICAL SEO AUTOMATED VALIDATION SUITE (P2-1)
 * ============================================================
 * Validates:
 * 1. XML Sitemap syntax, namespace, integrity, URL completeness (175 URLs)
 * 2. Robots.txt rules, disallow paths, asset accessibility, sitemap directive
 * 3. Canonical URLs across all pages (109 courses, 12 academies, 36 branches, 5 blog articles, root pages)
 * 4. Redirect rules (_redirects & functions/_middleware.js), loops, and chains
 * 5. Environment-specific SEO configurations (production vs preview)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');
const DOMAIN = 'https://novaskills.in';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName} ${details ? '— ' + details : ''}`);
  }
}

// ────────────────────────────────────────────────────────────
// SUITE 1: XML Sitemap Validation (sitemap.xml)
// ────────────────────────────────────────────────────────────
console.log('\n============================================================');
console.log('▶ SUITE 1: XML SITEMAP VALIDATION (sitemap.xml)');
console.log('============================================================');

const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists in repository root');

const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

assert(
  sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>'),
  'XML sitemap has valid UTF-8 XML declaration'
);
assert(
  sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'),
  'XML sitemap uses official sitemaps.org 0.9 namespace'
);
assert(sitemapContent.trim().endsWith('</urlset>'), 'XML sitemap has closing urlset tag');

// Extract URLs and lastmod entries
const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const lastmodMatches = [...sitemapContent.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map(m => m[1]);

assert(locMatches.length > 0, `Sitemap contains loc tags (found: ${locMatches.length})`);
assert(locMatches.length === lastmodMatches.length, 'Every loc entry has a corresponding lastmod tag');

// Check URL uniqueness
const uniqueLocs = new Set(locMatches);
assert(uniqueLocs.size === locMatches.length, `Zero duplicate URLs in sitemap (unique: ${uniqueLocs.size}, total: ${locMatches.length})`);

// Check URL protocol and origin
const allHttps = locMatches.every(u => u.startsWith('https://novaskills.in/'));
assert(allHttps, 'All sitemap URLs use preferred HTTPS non-WWW origin (https://novaskills.in/)');

// Check lastmod formatting (YYYY-MM-DD)
const validLastmod = lastmodMatches.every(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
assert(validLastmod, 'All lastmod dates follow ISO 8601 YYYY-MM-DD format');

// Core public pages
assert(locMatches.includes('https://novaskills.in/'), 'Homepage (https://novaskills.in/) is in sitemap');
assert(locMatches.includes('https://novaskills.in/courses'), 'Courses catalog (/courses) is in sitemap');
assert(locMatches.includes('https://novaskills.in/placements'), 'Placements (/placements) is in sitemap');
assert(locMatches.includes('https://novaskills.in/assessment'), 'Assessment (/assessment) is in sitemap');
assert(locMatches.includes('https://novaskills.in/blog'), 'Blog index (/blog) is in sitemap');
assert(locMatches.includes('https://novaskills.in/success-stories'), 'Success stories (/success-stories) is in sitemap');
assert(locMatches.includes('https://novaskills.in/verify'), 'Verify tool (/verify) is in sitemap');

// Legal & Contact pages
assert(locMatches.includes('https://novaskills.in/privacy-policy/'), 'Privacy policy (/privacy-policy/) is in sitemap');
assert(locMatches.includes('https://novaskills.in/refund-policy/'), 'Refund policy (/refund-policy/) is in sitemap');
assert(locMatches.includes('https://novaskills.in/terms-and-conditions/'), 'Terms & Conditions (/terms-and-conditions/) is in sitemap');
assert(locMatches.includes('https://novaskills.in/contact/'), 'Contact (/contact/) is in sitemap');

// Academies directory and all 12 academies
assert(locMatches.includes('https://novaskills.in/academies/'), 'Academies directory (/academies/) is in sitemap');
const expectedAcademies = [
  'digital-marketing', 'ai', 'design', 'programming', 'no-code-web', 'video-motion',
  '3d', 'career-freelancing', 'communication', 'kids-tech', 'creator', 'office-productivity'
];
expectedAcademies.forEach(slug => {
  assert(locMatches.includes(`https://novaskills.in/academies/${slug}/`), `Academy in sitemap: /academies/${slug}/`);
});

// Blog articles
const expectedBlogs = [
  'waseeullah-mansoori',
  'ai-skills-future-careers-2027-2030',
  'ai-seo-geo-digital-marketing-2026',
  'high-demand-courses-2027-ai-skills-careers',
  'n8n-ai-automation-beginners'
];
expectedBlogs.forEach(slug => {
  assert(locMatches.includes(`https://novaskills.in/blog/${slug}/`), `Blog article in sitemap: /blog/${slug}/`);
});

// Branches directory and all 36 locations
assert(locMatches.includes('https://novaskills.in/branches/'), 'Branches directory (/branches/) is in sitemap');
const locationsRegistry = require('../lib/locations');
const allLocations = locationsRegistry.getAllLocations();
assert(allLocations.length === 36, `Locations registry contains 36 cities (found: ${allLocations.length})`);
allLocations.forEach(loc => {
  assert(locMatches.includes(`https://novaskills.in/branches/${loc.slug}/`), `Branch location in sitemap: /branches/${loc.slug}/`);
});

// All 109 courses with course ID parameter
const NovaCourseData = require('../js/course-data.js');
const publishedCourses = NovaCourseData.getPublishedCourses();
assert(publishedCourses.length === 109, `Published course master has 109 courses (found: ${publishedCourses.length})`);
publishedCourses.forEach(course => {
  const expectedUrl = `https://novaskills.in/course-detail.html?id=${course.id}`;
  assert(locMatches.includes(expectedUrl), `Course in sitemap: ?id=${course.id}`);
});

// Total expected URLs: 1 + 6 + 4 + 1 + 12 + 5 + 1 + 36 + 109 = 175
assert(locMatches.length === 175, `Total sitemap URL inventory matches exactly 175 pages (found: ${locMatches.length})`);

// Negative assertion: Excluded routes
const excludedRoutes = [
  '404.html', 'admin.html', 'admin-activity.html', 'admin-settings.html',
  'login.html', 'student.html', 'portal.html', 'register.html', 'ai-chat.html',
  'thank-you', 'lead-success', 'academy-detail.html', 'blog-detail.html'
];
excludedRoutes.forEach(r => {
  const hasExcluded = locMatches.some(u => u.includes(r));
  assert(!hasExcluded, `Excluded route not in sitemap: ${r}`);
});

// ────────────────────────────────────────────────────────────
// SUITE 2: Robots.txt Protocol Validation (robots.txt)
// ────────────────────────────────────────────────────────────
console.log('\n============================================================');
console.log('▶ SUITE 2: ROBOTS.TXT POLICY & SYNTAX VALIDATION');
console.log('============================================================');

const robotsPath = path.join(ROOT_DIR, 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt exists at root');

const robotsContent = fs.readFileSync(robotsPath, 'utf8');

assert(robotsContent.includes('User-agent: *'), 'Robots.txt declares User-agent: *');
assert(robotsContent.includes('Allow: /'), 'Robots.txt allows public crawling with Allow: /');
assert(robotsContent.includes('Sitemap: https://novaskills.in/sitemap.xml'), 'Robots.txt references canonical sitemap URL');

// Public and asset paths must NOT be disallowed
const forbiddenDisallows = [
  'Disallow: /courses',
  'Disallow: /course-detail',
  'Disallow: /academies',
  'Disallow: /branches',
  'Disallow: /blog',
  'Disallow: /css',
  'Disallow: /js',
  'Disallow: /public',
  'Disallow: /images'
];
forbiddenDisallows.forEach(rule => {
  assert(!robotsContent.includes(rule), `Robots.txt does NOT block public path: ${rule}`);
});

// Private routes must be disallowed
const requiredDisallows = [
  'Disallow: /admin.html',
  'Disallow: /admin-activity.html',
  'Disallow: /admin-settings.html',
  'Disallow: /admin/',
  'Disallow: /login.html',
  'Disallow: /student.html',
  'Disallow: /portal.html',
  'Disallow: /register.html',
  'Disallow: /ai-chat.html',
  'Disallow: /thank-you/',
  'Disallow: /lead-success/',
  'Disallow: /scripts/',
  'Disallow: /.git/'
];
requiredDisallows.forEach(rule => {
  assert(robotsContent.includes(rule), `Robots.txt disallows private/internal path: ${rule}`);
});

// ────────────────────────────────────────────────────────────
// SUITE 3: Canonical URL Implementation Across Templates
// ────────────────────────────────────────────────────────────
console.log('\n============================================================');
console.log('▶ SUITE 3: CANONICAL URL IMPLEMENTATION AUDIT');
console.log('============================================================');

function checkCanonical(filePath, expectedCanonical) {
  const fullPath = path.join(ROOT_DIR, filePath);
  if (!fs.existsSync(fullPath)) {
    assert(false, `File exists for canonical check: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const match = content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  if (!match) {
    // Also check href before rel
    const match2 = content.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
    if (match2) {
      assert(match2[1] === expectedCanonical, `${filePath} canonical matches ${expectedCanonical}`, `Found: ${match2[1]}`);
      return;
    }
    assert(false, `${filePath} contains canonical tag`, 'No canonical found');
    return;
  }
  assert(match[1] === expectedCanonical, `${filePath} canonical matches ${expectedCanonical}`, `Found: ${match[1]}`);
}

// 1. Root & Institutional Pages
checkCanonical('index.html', 'https://novaskills.in/');
checkCanonical('courses.html', 'https://novaskills.in/courses');
checkCanonical('placements.html', 'https://novaskills.in/placements');
checkCanonical('blog.html', 'https://novaskills.in/blog');
checkCanonical('assessment.html', 'https://novaskills.in/assessment');
checkCanonical('success-stories.html', 'https://novaskills.in/success-stories');
checkCanonical('verify.html', 'https://novaskills.in/verify');

// 2. Legal & Contact Pages
checkCanonical('contact/index.html', 'https://novaskills.in/contact/');
checkCanonical('privacy-policy/index.html', 'https://novaskills.in/privacy-policy/');
checkCanonical('refund-policy/index.html', 'https://novaskills.in/refund-policy/');
checkCanonical('terms-and-conditions/index.html', 'https://novaskills.in/terms-and-conditions/');

// 3. Academies
checkCanonical('academies/index.html', 'https://novaskills.in/academies/');
expectedAcademies.forEach(slug => {
  checkCanonical(`academies/${slug}/index.html`, `https://novaskills.in/academies/${slug}/`);
});

// 4. Branches
checkCanonical('branches/index.html', 'https://novaskills.in/branches/');
allLocations.forEach(loc => {
  checkCanonical(`branches/${loc.slug}/index.html`, `https://novaskills.in/branches/${loc.slug}/`);
});

// 5. Blog Articles
expectedBlogs.forEach(slug => {
  checkCanonical(`blog/${slug}/index.html`, `https://novaskills.in/blog/${slug}/`);
});

// 6. Pre-rendered 109 Courses
publishedCourses.forEach(course => {
  const p = `_rendered_courses/${course.id}.html`;
  const expectedUrl = `https://novaskills.in/course-detail.html?id=${course.id}`;
  checkCanonical(p, expectedUrl);
});

// 7. 404 page does NOT have indexable canonical and HAS noindex
const fourOhFourContent = fs.readFileSync(path.join(ROOT_DIR, '404.html'), 'utf8');
const fourOhFourCan = fourOhFourContent.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i);
assert(!fourOhFourCan, '404.html has no canonical tag');
assert(fourOhFourContent.includes('noindex, nofollow'), '404.html has meta robots noindex, nofollow');

// 8. Dynamic template fallback
const courseDetailContent = fs.readFileSync(path.join(ROOT_DIR, 'course-detail.html'), 'utf8');
assert(
  courseDetailContent.includes("'https://novaskills.in/courses'"),
  'course-detail.html client fallback points to clean /courses'
);

// ────────────────────────────────────────────────────────────
// SUITE 4: Redirect Rules & Edge Middleware Validation
// ────────────────────────────────────────────────────────────
console.log('\n============================================================');
console.log('▶ SUITE 4: REDIRECT RULES & EDGE MIDDLEWARE AUDIT');
console.log('============================================================');

const redirectsPath = path.join(ROOT_DIR, '_redirects');
assert(fs.existsSync(redirectsPath), '_redirects exists');

const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
assert(redirectsContent.includes('/robot.txt  /robots.txt  301'), '_redirects includes 301 redirect for legacy /robot.txt -> /robots.txt');
assert(redirectsContent.includes('/courses.html          /courses          301'), '_redirects includes clean URL redirect for /courses.html');
assert(redirectsContent.includes('/placements.html       /placements       301'), '_redirects includes clean URL redirect for /placements.html');
assert(redirectsContent.includes('/blog.html             /blog             301'), '_redirects includes clean URL redirect for /blog.html');
assert(redirectsContent.includes('/assessment.html       /assessment       301'), '_redirects includes clean URL redirect for /assessment.html');
assert(redirectsContent.includes('/academies/nocode/  /academies/no-code-web/        301'), '_redirects maps academy alias /nocode/');
assert(redirectsContent.includes('/academies/*  /academies/index.html  200'), '_redirects preserves SPA fallback rewrite for unknown academy slugs');

// Check edge middleware
const middlewarePath = path.join(ROOT_DIR, 'functions', '_middleware.js');
assert(fs.existsSync(middlewarePath), 'functions/_middleware.js exists');

const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
assert(
  middlewareContent.includes("Response.redirect('https://novaskills.in/courses', 301)"),
  'Middleware redirects missing course ID to /courses with 301'
);
assert(
  middlewareContent.includes("redirectUrl.searchParams.set('id', id)"),
  'Middleware normalizes course aliases and legacy course param to canonical id'
);
assert(
  middlewareContent.includes("url.hostname === 'novaskills.in'"),
  'Middleware detects production origin vs preview deployments'
);
assert(
  middlewareContent.includes("const robotsTag = isProduction ? 'index, follow' : 'noindex, nofollow'"),
  'Middleware applies noindex, nofollow on preview/development hostnames'
);
assert(
  middlewareContent.includes('COURSE_NOT_FOUND_HTML'),
  'Middleware serves 404 response for invalid course IDs'
);

// ────────────────────────────────────────────────────────────
// SUITE 5: Redirect Graph Integrity (Zero Loops & Chains)
// ────────────────────────────────────────────────────────────
console.log('\n============================================================');
console.log('▶ SUITE 5: REDIRECT GRAPH INTEGRITY & LOOP PREVENTION');
console.log('============================================================');

// Parse _redirects lines
const redirectRules = [];
redirectsContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 3) {
    redirectRules.push({
      from: parts[0],
      to: parts[1],
      status: parseInt(parts[2], 10)
    });
  }
});

assert(redirectRules.length > 0, `Parsed redirect rules from _redirects (count: ${redirectRules.length})`);

// Check for loops (A -> B -> A)
let loopDetected = false;
const redirectMap = new Map();
redirectRules.forEach(r => {
  if (r.status === 301 || r.status === 302 || r.status === 308) {
    redirectMap.set(r.from, r.to);
  }
});

for (const [from, to] of redirectMap.entries()) {
  let curr = to;
  const visited = new Set([from]);
  let hops = 0;
  while (redirectMap.has(curr) && hops < 10) {
    hops++;
    if (visited.has(curr)) {
      loopDetected = true;
      console.error(`  ❌ LOOP: ${from} -> ${curr}`);
      break;
    }
    visited.add(curr);
    curr = redirectMap.get(curr);
  }
  assert(hops <= 1, `Direct redirect without intermediate chain: ${from} -> ${to} (hops: ${hops})`);
}
assert(!loopDetected, 'Zero redirect loops detected in _redirects');

// ────────────────────────────────────────────────────────────
// SUITE 6: Live DNS & Verification Checks (Non-blocking)
// ────────────────────────────────────────────────────
console.log('\n============================================================');
console.log('▶ SUITE 6: LIVE DNS & VERIFICATION FORENSIC CHECKS');
console.log('============================================================');

const { execSync } = require('child_process');
try {
  const dnsTxt = execSync('nslookup -type=txt novaskills.in', { encoding: 'utf8', timeout: 5000 });
  const hasGsc = dnsTxt.includes('google-site-verification=79ZkniXTuWvDpRXaAeun158piQ2cnH44YewXdFdG25E');
  assert(hasGsc, 'DNS TXT record contains verified Google Search Console token');
} catch (err) {
  console.log(`  ℹ️  DNS check skipped or timed out: ${err.message}`);
}

// ────────────────────────────────────────────────────────────
// SUMMARY
// ────────────────────────────────────────────────────────────
console.log('\n============================================================');
console.log(`VALIDATION SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
if (failedTests > 0) {
  console.error(`❌ FAILED: ${failedTests} tests failed.`);
  process.exit(1);
} else {
  console.log('🎉 ALL TECHNICAL SEO CHECKS PASSED CLEANLY.');
  console.log('============================================================\n');
}
