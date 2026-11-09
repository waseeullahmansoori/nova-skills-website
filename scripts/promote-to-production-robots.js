/**
 * Transition robots meta tag from development preview guard (noindex, follow)
 * to production indexable directive (index, follow) across all 37 pages
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { getAllLocations } = require('../lib/locations');

const ROOT_DIR = path.resolve(__dirname, '..');
const locations = getAllLocations();

let updatedCount = 0;

// 1. Directory
const dirPath = path.join(ROOT_DIR, 'branches', 'index.html');
let dirHtml = fs.readFileSync(dirPath, 'utf8');
if (dirHtml.includes('<meta name="robots" content="noindex, follow" />')) {
  dirHtml = dirHtml.replace('<meta name="robots" content="noindex, follow" />', '<meta name="robots" content="index, follow" />');
  fs.writeFileSync(dirPath, dirHtml, 'utf8');
  updatedCount++;
}

// 2. 36 Cities
locations.forEach(loc => {
  const cityPath = path.join(ROOT_DIR, 'branches', loc.slug, 'index.html');
  let html = fs.readFileSync(cityPath, 'utf8');
  if (html.includes('<meta name="robots" content="noindex, follow" />')) {
    html = html.replace('<meta name="robots" content="noindex, follow" />', '<meta name="robots" content="index, follow" />');
    fs.writeFileSync(cityPath, html, 'utf8');
    updatedCount++;
  }
});

console.log(`✓ Updated robots meta tag to "index, follow" on ${updatedCount} pages`);
