const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'docs', 'seo', '00-complete-url-inventory.csv');
const raw = fs.readFileSync(csvPath, 'utf8');

// Parse CSV lines respecting quotes
function parseCsv(text) {
  const lines = text.split('\r\n').filter(Boolean);
  const rows = [];
  for (const line of lines) {
    const row = [];
    let insideQuote = false;
    let entry = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuote && line[i + 1] === '"') {
          entry += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        row.push(entry);
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry);
    rows.push(row);
  }
  return rows;
}

const rows = parseCsv(raw);
const headers = rows[0];
console.log('Headers:', headers);
console.log('Total URLs recorded:', rows.length - 1);

const issuesFound = [];
const orphanPages = [];
const thinContentPages = [];

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const url = r[0];
  const type = r[1];
  const title = r[2];
  const h1 = r[3];
  const indexability = r[4];
  const canonical = r[5];
  const rel = r[7];
  const inboundLinks = parseInt(r[8], 10);
  const inSitemap = r[9];
  const metaStatus = r[10];
  const contentQuality = r[11];
  const techIssues = r[12];
  const priority = r[13];

  if (techIssues !== 'None detected') {
    issuesFound.push({ url, type, techIssues, priority });
  }
  if (inboundLinks === 0 && inSitemap === 'Yes') {
    orphanPages.push({ url, type });
  }
  if (contentQuality.includes('Thin')) {
    thinContentPages.push({ url, type, contentQuality });
  }
}

console.log(`\n=== PAGES WITH DETECTED ISSUES (${issuesFound.length}) ===`);
issuesFound.forEach(item => {
  console.log(`[${item.priority}] ${item.type} | ${item.url}`);
  console.log(`  Issues: ${item.techIssues}`);
});

console.log(`\n=== SITEMAP ORPHAN PAGES (${orphanPages.length}) ===`);
orphanPages.forEach(item => {
  console.log(`  ${item.type} | ${item.url}`);
});

console.log(`\n=== THIN CONTENT PAGES (${thinContentPages.length}) ===`);
thinContentPages.forEach(item => {
  console.log(`  ${item.type} | ${item.url} (${item.contentQuality})`);
});
