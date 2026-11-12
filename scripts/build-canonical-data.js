'use strict';

/**
 * Compiles canonical data/courses.json + data/academies.json into runtime data.js
 * Guarantees:
 *   1. ZERO duplicated course objects inside NS_ACADEMIES (academies link to NS_COURSES objects by reference).
 *   2. ZERO bloated lesson-by-lesson curriculum payloads in catalog downloads (curricula stay in data/curricula/).
 *   3. 100% compatibility with existing globals NS_COURSES, NS_ACADEMIES, and NovaCourseData.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const courseDataLayer = require(path.join(ROOT, 'js', 'course-data.js'));

const canonicalMeta = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'courses.json'), 'utf8'));
const academiesJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'academies.json'), 'utf8'));

const runtimeCourses = courseDataLayer.getAllCourses();
const academyMetaList = (academiesJson.academies || []).map(a => ({ ...a }));

const headerComment = `// ============================================================================
// AUTO-GENERATED RUNTIME DATA BUNDLE (DO NOT EDIT MANUALLY)
// Source of Truth: data/courses.json + data/academies.json + data/curricula/*.json
// Rebuild via: node scripts/build-canonical-data.js
// ============================================================================
`;

const output = `${headerComment}
const NS_CANONICAL_META = ${JSON.stringify({
  version: canonicalMeta.version,
  schemaVersion: canonicalMeta.schemaVersion,
  totalCourses: runtimeCourses.length,
  approvedStartingPrice: canonicalMeta.approvedStartingPrice
})};

const NS_COURSES = ${JSON.stringify(runtimeCourses, null, 2)};

const NS_ACADEMIES = ${JSON.stringify(academyMetaList, null, 2)};

// Derive NS_ACADEMIES[].courses dynamically by reference from NS_COURSES (zero duplication)
NS_ACADEMIES.forEach(function (academy) {
  academy.courses = NS_COURSES.filter(function (c) {
    return c.academyId === academy.id;
  });
});

if (typeof window !== 'undefined') {
  window.NS_CANONICAL_META = NS_CANONICAL_META;
  window.NS_COURSES = NS_COURSES;
  window.NS_ACADEMIES = NS_ACADEMIES;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NS_ACADEMIES: NS_ACADEMIES, NS_COURSES: NS_COURSES, NS_CANONICAL_META: NS_CANONICAL_META };
}
`;

fs.writeFileSync(path.join(ROOT, 'data.js'), output, 'utf8');
const kb = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(1);
console.log(`✅ Built canonical data.js (${runtimeCourses.length} courses, ${academyMetaList.length} academies, zero duplicate courses, ${kb} KB)`);
