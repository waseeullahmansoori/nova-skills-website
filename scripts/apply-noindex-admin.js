const fs = require('fs');
const path = require('path');

const files = [
  'login.html',
  'register.html',
  'student.html',
  'portal.html',
  'admin.html',
  'admin-activity.html',
  'admin-settings.html',
  'ai-chat.html',
  'admin/login/index.html'
];

let updatedCount = 0;

for (const file of files) {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) continue;
  let html = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // Check robots
  if (!html.includes('meta name="robots"') && !html.includes('name="robots"')) {
    html = html.replace(/<head>/i, '<head>\n  <meta name="robots" content="noindex, nofollow" />');
    changed = true;
  } else if (!html.includes('noindex')) {
    html = html.replace(/<meta[^>]*name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex, nofollow" />');
    changed = true;
  }

  // Check canonical
  if (!html.includes('rel="canonical"') && !html.includes('rel=\'canonical\'')) {
    const cleanUrl = `https://novaskills.in/${file.replace(/index\.html$/, '').replace(/\.html$/, '')}`;
    html = html.replace(/<\/head>/i, `  <link rel="canonical" href="${cleanUrl}" />\n</head>`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, html, 'utf8');
    updatedCount++;
    console.log(`Updated noindex/canonical in: ${file}`);
  }
}

console.log(`Finished updating ${updatedCount} admin/portal files.`);
