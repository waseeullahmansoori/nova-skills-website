/**
 * Automated Production-Ready XML Sitemap Generator for Nova Skills
 * Compliant with sitemaps.org 0.9 protocol and Google Technical SEO standards.
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://novaskills.in';
const ROOT_DIR = path.resolve(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');

// Excluded HTML routes (non-indexable, private, or error pages)
const EXCLUDED_FILES = new Set([
  '404.html',
  'admin.html',
  'admin-activity.html',
  'admin-settings.html',
  'login.html',
  'student.html',
  'ai-chat.html'
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

  // 3. Dynamic Academy Detail URLs
  const academyIds = [
    'digital-marketing',
    'ai',
    'kids',
    'design',
    'video',
    '3d',
    'nocode',
    'programming',
    'creator',
    'office',
    'communication',
    'career'
  ];
  const academyPageDate = getFormattedDate(path.join(ROOT_DIR, 'academy-detail.html'));
  academyIds.forEach((acad) => {
    urlEntries.push({
      loc: `${DOMAIN}/academy-detail.html?academy=${acad}`,
      lastmod: academyPageDate
    });
  });

  // 4. Dynamic Featured Course URLs
  const courseIds = [
    'dm-professional',
    'dm-mastery',
    'ai-mastery',
    'full-stack',
    'design-mastery',
    'motion-graphics'
  ];
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
