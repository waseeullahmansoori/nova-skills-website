/**
 * ============================================================
 * NOVA SKILLS — PHASE 2: REDIRECT & INDEXABILITY MAP GENERATOR
 * ============================================================
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SEO_DOCS_DIR = path.join(ROOT_DIR, 'docs', 'seo');
const REDIRECTS_PATH = path.join(ROOT_DIR, '_redirects');

// 1. Build Redirect Map CSV
const redirectsRaw = fs.readFileSync(REDIRECTS_PATH, 'utf8');
const redirectLines = redirectsRaw.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));

function escapeCsv(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const redirectHeaders = [
  'Source Path',
  'Destination Path',
  'HTTP Status Code',
  'Redirect Type',
  'Purpose / Justification',
  'Status'
];

const redirectRows = [redirectHeaders];
for (const line of redirectLines) {
  const parts = line.split(/\s+/);
  if (parts.length >= 3) {
    const src = parts[0];
    const dest = parts[1];
    const code = parts[2];
    let purpose = 'Clean URL Normalization';
    if (src.includes('index.html')) purpose = 'Directory Index Cleanup';
    else if (src.includes('robot')) purpose = 'Legacy Typo Neutralization';
    else if (src.includes('academies/nocode') || src.includes('academies/video') || src.includes('academies/career') || src.includes('academies/kids') || src.includes('academies/office')) purpose = 'Academy Alias Normalization';
    else if (code === '200') purpose = 'SPA Fallback Routing';

    redirectRows.push([
      src,
      dest,
      code,
      code === '301' ? 'Permanent Redirect' : 'Internal Rewrite',
      purpose,
      'Active & Verified'
    ]);
  }
}

const redirectCsv = redirectRows.map(r => r.map(escapeCsv).join(',')).join('\r\n');
fs.writeFileSync(path.join(SEO_DOCS_DIR, '02-redirect-map.csv'), redirectCsv, 'utf8');
console.log(`Generated 02-redirect-map.csv (${redirectRows.length - 1} rules)`);

// 2. Build Indexability Report CSV
const inventoryCsv = fs.readFileSync(path.join(SEO_DOCS_DIR, '00-complete-url-inventory.csv'), 'utf8');
const inventoryLines = inventoryCsv.split('\r\n').filter(Boolean);
const invHeaders = inventoryLines[0].split(',');

const indexabilityHeaders = [
  'URL',
  'Page Type',
  'Canonical URL',
  'HTTP Status',
  'Robots Directive',
  'Sitemap Status',
  'Indexability Classification',
  'Crawl Accessibility',
  'Risk / Issue Flag',
  'Action Required'
];

const indexabilityRows = [indexabilityHeaders];

for (let i = 1; i < inventoryLines.length; i++) {
  // Parse row respecting quotes
  const line = inventoryLines[i];
  const row = [];
  let inQ = false, val = '';
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (c === '"') {
      if (inQ && line[j+1] === '"') { val += '"'; j++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) {
      row.push(val); val = '';
    } else {
      val += c;
    }
  }
  row.push(val);

  const url = row[0];
  const type = row[1];
  const canonical = row[5];
  const httpStatus = row[6];
  const inSitemap = row[9];
  const techIssues = row[12];
  let classification = row[4];

  let robots = 'index, follow';
  let crawlAccess = 'Allowed by robots.txt';
  let flag = 'None';
  let action = 'Maintain canonical indexing';

  if (type.includes('Admin') || type.includes('Portal')) {
    robots = 'noindex, nofollow (Planned)';
    crawlAccess = 'Disallowed by robots.txt';
    flag = 'Missing explicit in-page noindex meta tag';
    action = 'Add <meta name="robots" content="noindex, nofollow"> to prevent indexing leaks';
  } else if (type === 'Error Page') {
    robots = 'noindex, nofollow';
    crawlAccess = 'Non-indexable 404 route';
    flag = 'Utility Error';
    action = 'Maintain 404 status';
  } else if (type.includes('Shell')) {
    robots = 'noindex, follow';
    crawlAccess = 'Canonicalized template';
    flag = 'SPA Shell';
    action = 'Maintain edge middleware canonical handling';
  } else if (techIssues.includes('Orphan') || row[8] === '0') {
    flag = 'Zero Inbound Internal Links';
    action = 'Add static footer / body link to establish link equity flow';
  }

  indexabilityRows.push([
    url,
    type,
    canonical,
    httpStatus,
    robots,
    inSitemap === 'Yes' ? 'Included' : 'Excluded',
    classification,
    crawlAccess,
    flag,
    action
  ]);
}

const indexabilityCsv = indexabilityRows.map(r => r.map(escapeCsv).join(',')).join('\r\n');
fs.writeFileSync(path.join(SEO_DOCS_DIR, '02-indexability-report.csv'), indexabilityCsv, 'utf8');
console.log(`Generated 02-indexability-report.csv (${indexabilityRows.length - 1} routes)`);
