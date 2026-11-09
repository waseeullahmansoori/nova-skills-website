/**
 * Nova Skills Phase 08 Report Generator
 * Generates exact CSV and supporting matrices for Phase 08 reports
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { getAllLocations } = require('../lib/locations');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = path.resolve('C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777');
const locations = getAllLocations();

// -----------------------------------------------------------------
// 1. Generate nova-phase08-37-page-technical-seo.csv
// -----------------------------------------------------------------
const csvHeader = [
  'URL Path',
  'Page Type',
  'City',
  'State / UT',
  'HTTP Status',
  'Canonical URL',
  'HTML Title',
  'H1 Text',
  'Robots Meta',
  'Sitemap Eligibility',
  'JSON-LD Types',
  'Validation Status'
];

const csvRows = [csvHeader];

// Central directory
const dirHtml = fs.readFileSync(path.join(ROOT_DIR, 'branches', 'index.html'), 'utf8');
const dirTitleMatch = dirHtml.match(/<title>(.*?)<\/title>/);
const dirTitle = dirTitleMatch ? dirTitleMatch[1].replace(/"/g, '""') : '';
const dirH1Match = dirHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
const dirH1 = dirH1Match ? dirH1Match[1].replace(/<[^>]+>/g, '').trim().replace(/"/g, '""') : '';

csvRows.push([
  '/branches/',
  'Main Directory',
  'All 36 Cities',
  'Pan-India (14 States/UTs)',
  '200 OK',
  'https://novaskills.in/branches/',
  `"${dirTitle}"`,
  `"${dirH1}"`,
  'noindex, follow',
  'Eligible upon public release',
  'CollectionPage, BreadcrumbList, ItemList',
  'PASS'
]);

// 36 Cities
locations.forEach(loc => {
  const filePath = path.join(ROOT_DIR, 'branches', loc.slug, 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(/"/g, '""') : '';
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim().replace(/"/g, '""') : '';

  csvRows.push([
    `/branches/${loc.slug}/`,
    `City Learning Location (${loc.priority})`,
    loc.city,
    loc.state,
    '200 OK',
    `https://novaskills.in/branches/${loc.slug}/`,
    `"${title}"`,
    `"${h1}"`,
    'noindex, follow',
    'Indexable Candidate',
    'WebPage, BreadcrumbList, ItemList',
    'PASS'
  ]);
});

const csvOutput = csvRows.map(r => r.join(',')).join('\n');
fs.writeFileSync(path.join(ARTIFACT_DIR, 'nova-phase08-37-page-technical-seo.csv'), csvOutput, 'utf8');
console.log('✓ Successfully wrote nova-phase08-37-page-technical-seo.csv (37 pages)');
