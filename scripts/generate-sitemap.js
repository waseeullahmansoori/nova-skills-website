/**
 * Automated Production-Ready XML Sitemap Generator for Nova Skills
 * Compliant with sitemaps.org 0.9 protocol and Google Technical SEO standards.
 */

const fs = require('fs');
const path = require('path');

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

  // 2. Standard Public HTML Pages
  const files = fs.readdirSync(ROOT_DIR);
  files.forEach((file) => {
    if (file.endsWith('.html') && file !== 'index.html' && !EXCLUDED_FILES.has(file)) {
      const filePath = path.join(ROOT_DIR, file);
      urlEntries.push({
        loc: `${DOMAIN}/${file}`,
        lastmod: getFormattedDate(filePath)
      });
    }
  });

  // Dedicated Legal Policy directory URLs (Only indexable canonical directories)
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

  // 3. Clean Academy Directory URLs
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

  // 4. Dynamic Course URLs (All Restructured Courses)
  let courseIds = [];
  try {
    const { NS_COURSES } = require('../data.js');
    courseIds = NS_COURSES.map(c => c.id);
  } catch (err) {
    courseIds = [
      'dm-professional', 'dm-mastery', 'ai-mastery', 'fullstack-foundation',
      'creative-design', 'motion-mastery', 'archviz-mastery', 'ecommerce-mastery',
      'youtube-mastery', 'biz-productivity', 'business-english', 'freelancing-mastery'
    ];
  }
  const coursePageDate = getFormattedDate(path.join(ROOT_DIR, 'course-detail.html'));
  courseIds.forEach((cId) => {
    urlEntries.push({
      loc: `${DOMAIN}/course-detail.html?id=${cId}`,
      lastmod: coursePageDate
    });
  });

  // 5. Dynamic Blog Article URLs
  const blogSlugs = [
    'ai-jobs-india-2026',
    'digital-marketing-salary-india',
    'learn-graphic-design-beginner-guide',
    'freelancing-fiverr-india-guide',
    'n8n-ai-automation-beginners',
    'youtube-channel-monetise-2026',
    'chatgpt-prompts-marketing',
    'kids-coding-benefits-india',
    'python-vs-javascript-2026'
  ];
  const blogPageDate = getFormattedDate(path.join(ROOT_DIR, 'blog-detail.html'));
  blogSlugs.forEach((slug) => {
    urlEntries.push({
      loc: `${DOMAIN}/blog-detail.html?id=${slug}`,
      lastmod: blogPageDate
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
