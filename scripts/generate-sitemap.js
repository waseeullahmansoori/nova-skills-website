/**
 * Automated Production-Ready XML Sitemap Generator for Nova Skills
 * Compliant with sitemaps.org 0.9 protocol and Google Technical SEO standards.
 * 
 * Generates 100% 200 OK canonical URLs without 308 redirects:
 * - Clean URLs for root static pages (/courses, /blog, /assessment, etc.)
 * - Pre-rendered Edge Course URLs (/course-detail.html?id=...)
 * - Pre-rendered Academy Directory URLs (/academies/.../)
 * - Canonical Static Blog Article URLs (/blog/.../)
 * - Legal & Contact Directory URLs (/privacy-policy/, etc.)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DOMAIN = 'https://novaskills.in';
const ROOT_DIR = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');

// Excluded HTML routes (non-indexable, templates, private, or error pages)
const EXCLUDED_FILES = new Set([
  '404.html',
  'admin.html',
  'admin-activity.html',
  'admin-settings.html',
  'login.html',
  'student.html',
  'ai-chat.html',
  'course-detail.html',
  'academy-detail.html',
  'blog-detail.html',
  'portal.html',
  'register.html'
]);

function getFormattedDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch (err) {
    return new Date().toISOString().split('T')[0];
  }
}

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const urlEntries = [];

  // 1. Root Homepage
  const indexPath = path.join(ROOT_DIR, 'index.html');
  urlEntries.push({
    loc: `${DOMAIN}/`,
    lastmod: getFormattedDate(indexPath)
  });

  // 2. Standard Public Pages (Clean URLs without .html to prevent Cloudflare 308 redirects)
  const files = fs.readdirSync(ROOT_DIR);
  files.forEach((file) => {
    if (file.endsWith('.html') && file !== 'index.html' && !EXCLUDED_FILES.has(file)) {
      const filePath = path.join(ROOT_DIR, file);
      const cleanSlug = file.replace(/\.html$/, '');
      urlEntries.push({
        loc: `${DOMAIN}/${cleanSlug}`,
        lastmod: getFormattedDate(filePath)
      });
    }
  });

  // 3. Dedicated Legal Policy & Contact directory URLs
  urlEntries.push({
    loc: `${DOMAIN}/privacy-policy/`,
    lastmod: today
  });
  urlEntries.push({
    loc: `${DOMAIN}/refund-policy/`,
    lastmod: today
  });
  urlEntries.push({
    loc: `${DOMAIN}/terms-and-conditions/`,
    lastmod: today
  });
  urlEntries.push({
    loc: `${DOMAIN}/contact/`,
    lastmod: today
  });

  // 4. Canonical Static Blog Article URLs (200 OK directories)
  const blogArticles = [
    'waseeullah-mansoori',
    'ai-skills-future-careers-2027-2030',
    'ai-seo-geo-digital-marketing-2026',
    'high-demand-courses-2027-ai-skills-careers',
    'n8n-ai-automation-beginners'
  ];
  blogArticles.forEach((slug) => {
    const articlePath = path.join(ROOT_DIR, 'blog', slug, 'index.html');
    urlEntries.push({
      loc: `${DOMAIN}/blog/${slug}/`,
      lastmod: getFormattedDate(articlePath)
    });
  });

  // 5. Clean Academy Directory URLs
  urlEntries.push({
    loc: `${DOMAIN}/academies/`,
    lastmod: today
  });

  const academySlugs = [
    'digital-marketing',
    'ai',
    'design',
    'programming',
    'no-code-web',
    'video-motion',
    '3d',
    'career-freelancing',
    'communication',
    'kids-tech',
    'creator',
    'office-productivity'
  ];
  academySlugs.forEach((slug) => {
    const acadPath = path.join(ROOT_DIR, 'academies', slug, 'index.html');
    urlEntries.push({
      loc: `${DOMAIN}/academies/${slug}/`,
      lastmod: getFormattedDate(acadPath)
    });
  });

  // 6. Dynamic Course URLs (All 109 Restructured Courses)
  let courseIds = [];
  try {
    const dataJs = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
    vm.runInThisContext(dataJs);
    if (Array.isArray(NS_COURSES)) {
      courseIds = NS_COURSES.map(c => c.id);
    }
  } catch (err) {
    console.error('Error loading NS_COURSES from data.js:', err);
  }

  const coursePageDate = getFormattedDate(path.join(ROOT_DIR, 'course-detail.html'));
  courseIds.forEach((cId) => {
    urlEntries.push({
      loc: `${DOMAIN}/course-detail.html?id=${cId}`,
      lastmod: coursePageDate
    });
  });

  // Deduplicate and build XML string
  const uniqueMap = new Map();
  urlEntries.forEach((item) => {
    if (!uniqueMap.has(item.loc)) {
      uniqueMap.set(item.loc, item.lastmod);
    }
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const [loc, lastmod] of uniqueMap.entries()) {
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
  console.log(`✅ Successfully generated sitemap.xml with ${uniqueMap.size} URLs at ${SITEMAP_PATH}`);
}

generateSitemap();
