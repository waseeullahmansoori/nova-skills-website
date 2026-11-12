'use strict';

/**
 * Syncs course-image-map.json into client runtime bundles (courses.js and academy-detail.js)
 * so course-image-map.json remains the single authoritative source for both SSR and CSR.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const manifestPath = path.join(ROOT, 'course-image-map.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const compactMap = {};
for (const rec of manifest.courses) {
  compactMap[rec.courseId] = {
    desktop: rec.image.desktop,
    mobile: rec.image.mobile,
    mimeType: rec.image.mimeType,
    width: rec.image.width,
    height: rec.image.height,
    mobileWidth: rec.image.mobileWidth,
    mobileHeight: rec.image.mobileHeight,
    alt: rec.image.alt
  };
}

const generatedBlock = `// BEGIN GENERATED COURSE_IMAGE_MAP\nconst COURSE_IMAGE_MAP = ${JSON.stringify(compactMap, null, 2)};\n// END GENERATED COURSE_IMAGE_MAP`;

function syncFile(relPath) {
  const absPath = path.join(ROOT, relPath);
  const src = fs.readFileSync(absPath, 'utf8');
  const blockRegex = /\/\/ BEGIN GENERATED COURSE_IMAGE_MAP[\s\S]*?\/\/ END GENERATED COURSE_IMAGE_MAP/;
  if (!blockRegex.test(src)) {
    throw new Error(`Missing GENERATED COURSE_IMAGE_MAP markers in ${relPath}`);
  }
  const updated = src.replace(blockRegex, generatedBlock);
  fs.writeFileSync(absPath, updated, 'utf8');
  console.log(`Synced ${Object.keys(compactMap).length} course thumbnails into ${relPath}`);
}

syncFile('courses.js');
syncFile('academy-detail.js');
