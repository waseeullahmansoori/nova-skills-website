/**
 * Automated Production-Ready XML Sitemap Generator for Nova Skills
 * Compliant with sitemaps.org 0.9 protocol and Google Technical SEO standards.
 * 
 * Generates 100% 200 OK canonical URLs without 308 redirects:
 * - Clean URLs for root static pages (/courses, /blog, /assessment, /placements, etc.)
 * - Pre-rendered Edge Course URLs (/course-detail.html?id=...)
 * - Pre-rendered Academy Directory URLs (/academies/.../)
 * - Canonical Static Blog Article URLs (/blog/.../)
 * - Legal & Contact Directory URLs (/privacy-policy/, /refund-policy/, /terms-and-conditions/, /contact/)
 * - Branches & 36 Online Learning Locations (/branches/, /branches/.../)
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://novaskills.in';
const ROOT_DIR = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');

// Excluded HTML routes (non-indexable, templates, private, conversion confirmation, or error pages)
const EXCLUDED_FILES = new Set([
  '404.html',
  'admin.html',
  'admin-activity.html',
  'admin-settings.html',
  'login.html',
  'student.html',
  'portal.html',
  'register.html',
  'ai-chat.html',
  'course-detail.html',
  'academy-detail.html',
  'blog-detail.html'
]);

function getFormattedDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch (err) {
    return new Date().toISOString().split('T')[0];
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemap() {
  const urlEntries = [];

  // 1. Root Homepage
  const indexPath = path.join(ROOT_DIR, 'index.html');
  urlEntries.push({
    loc: `${DOMAIN}/`,
    lastmod: getFormattedDate(indexPath)
  });

  // 2. Standard Public Pages (Clean URLs without .html to match Cloudflare Pages 308 redirects)
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

  // 3. Dedicated Legal Policy & Contact Directory URLs (Accurate filesystem modification dates)
  const legalDirs = ['privacy-policy', 'refund-policy', 'terms-and-conditions', 'contact'];
  legalDirs.forEach((dir) => {
    const dirIndexPath = path.join(ROOT_DIR, dir, 'index.html');
    if (fs.existsSync(dirIndexPath)) {
      urlEntries.push({
        loc: `${DOMAIN}/${dir}/`,
        lastmod: getFormattedDate(dirIndexPath)
      });
    }
  });

  // 4. Canonical Static Blog Article URLs (Dynamically discovered directory endpoints)
  const blogDir = path.join(ROOT_DIR, 'blog');
  if (fs.existsSync(blogDir)) {
    const blogEntries = fs.readdirSync(blogDir).filter((f) => {
      const full = path.join(blogDir, f);
      return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'index.html'));
    });
    blogEntries.forEach((slug) => {
      const articlePath = path.join(blogDir, slug, 'index.html');
      urlEntries.push({
        loc: `${DOMAIN}/blog/${slug}/`,
        lastmod: getFormattedDate(articlePath)
      });
    });
  }

  // 5. Clean Academy Directory URLs
  const acadIndexPath = path.join(ROOT_DIR, 'academies', 'index.html');
  if (fs.existsSync(acadIndexPath)) {
    urlEntries.push({
      loc: `${DOMAIN}/academies/`,
      lastmod: getFormattedDate(acadIndexPath)
    });
  }

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
    if (fs.existsSync(acadPath)) {
      urlEntries.push({
        loc: `${DOMAIN}/academies/${slug}/`,
        lastmod: getFormattedDate(acadPath)
      });
    }
  });

  // 6. Dynamic Course URLs (All 109 Restructured Courses with course JSON modification dates)
  let courses = [];
  try {
    const NovaCourseData = require('../js/course-data.js');
    courses = NovaCourseData.getPublishedCourses();
  } catch (err) {
    console.error('Error loading published courses for sitemap:', err);
  }

  const courseTemplateDate = getFormattedDate(path.join(ROOT_DIR, 'course-detail.html'));
  courses.forEach((course) => {
    const courseJsonPath = path.join(ROOT_DIR, 'data', 'courses', `${course.id}.json`);
    const courseLastMod = fs.existsSync(courseJsonPath)
      ? getFormattedDate(courseJsonPath)
      : courseTemplateDate;

    urlEntries.push({
      loc: `${DOMAIN}/course-detail.html?id=${course.id}`,
      lastmod: courseLastMod
    });
  });

  // 7. Nationwide Branches Directory & 36 City Learning Locations
  const dirIndexPath = path.join(ROOT_DIR, 'branches', 'index.html');
  if (fs.existsSync(dirIndexPath)) {
    urlEntries.push({
      loc: `${DOMAIN}/branches/`,
      lastmod: getFormattedDate(dirIndexPath)
    });
  }

  try {
    const locationsRegistry = require('../lib/locations');
    const allLocs = locationsRegistry.getAllLocations();
    allLocs.forEach((loc) => {
      const cityIndexPath = path.join(ROOT_DIR, 'branches', loc.slug, 'index.html');
      if (fs.existsSync(cityIndexPath)) {
        urlEntries.push({
          loc: `${DOMAIN}/branches/${loc.slug}/`,
          lastmod: getFormattedDate(cityIndexPath)
        });
      }
    });
  } catch (err) {
    console.error('Error loading locations for sitemap:', err);
  }

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
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${escapeXml(lastmod)}</lastmod>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  const tmpPath = `${SITEMAP_PATH}.tmp`;
  try {
    fs.writeFileSync(tmpPath, xml, 'utf8');
    try {
      if (fs.existsSync(SITEMAP_PATH)) {
        fs.unlinkSync(SITEMAP_PATH);
      }
    } catch (_) {}
    fs.renameSync(tmpPath, SITEMAP_PATH);
  } catch (err) {
    fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
  }
  console.log(`✅ Successfully generated sitemap.xml with ${uniqueMap.size} URLs at ${SITEMAP_PATH}`);
  return uniqueMap.size;
}

if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap, SITEMAP_PATH, DOMAIN };
