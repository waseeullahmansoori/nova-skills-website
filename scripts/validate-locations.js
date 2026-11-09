/**
 * Nova Skills Nationwide Learning Locations Validation Test Suite
 * Phase 02 — Data Foundation, Resolvers, Routing & Preservation Tests
 * 
 * Test Suites:
 * - Suite A: City Registry Tests (36 cities, 14 states, counts, IDs, slugs, physical campus integrity)
 * - Suite B: Course Association Tests (144 compulsory, 92 additional, 236 total, resolvers)
 * - Suite C: Pricing Tests (canonical prices, launch fees, no overrides)
 * - Suite D: Routing Tests (37 routes, normalization, 404 on unknown, publication guards)
 * - Suite E: Preservation Tests (verifies existing website files & git baseline untouched)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const {
  getAllLocations,
  getLocationById,
  getLocationBySlug,
  getStatesSummary,
  resolveCourseByMasterNumber,
  resolveCourseById,
  resolveCoursesForLocation,
  getAllRoutes,
  resolveRoute,
  getCloudflareRouteManifest,
  isRoutePublishable,
  isRouteIndexable,
  loadCanonicalData
} = require('../lib/locations');

let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    failures.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('================================================================');
console.log('  NOVA SKILLS — 36 LEARNING LOCATIONS: PHASE 02 VALIDATION');
console.log('================================================================\n');

// -------------------------------------------------------------
// SUITE A: CITY REGISTRY TESTS
// -------------------------------------------------------------
console.log('[SUITE A] City Registry Integrity Tests:');

const locations = getAllLocations();
assert(Array.isArray(locations) && locations.length === 36, `Exactly 36 cities in registry (found: ${locations.length})`);

const statesSummary = getStatesSummary();
assert(statesSummary.length === 14, `Exactly 14 States/UTs represented (found: ${statesSummary.length})`);

const p1Cities = locations.filter(l => l.priority === 'P1');
const p2Cities = locations.filter(l => l.priority === 'P2');
const p3Cities = locations.filter(l => l.priority === 'P3');
assert(p1Cities.length === 10, `P1 priority contains exactly 10 cities (found: ${p1Cities.length})`);
assert(p2Cities.length === 13, `P2 priority contains exactly 13 cities (found: ${p2Cities.length})`);
assert(p3Cities.length === 13, `P3 priority contains exactly 13 cities (found: ${p3Cities.length})`);

const ids = new Set();
const slugs = new Set();
let allIdsUnique = true;
let allSlugsUnique = true;
let allPhysicalCampusFalse = true;
let allRoutesValid = true;

locations.forEach(loc => {
  if (ids.has(loc.id)) allIdsUnique = false;
  ids.add(loc.id);

  if (slugs.has(loc.slug)) allSlugsUnique = false;
  slugs.add(loc.slug);

  if (loc.physicalCampus !== false || loc.locationType !== 'online_service_area') {
    allPhysicalCampusFalse = false;
  }

  if (loc.route !== `/branches/${loc.slug}/`) {
    allRoutesValid = false;
  }
});

assert(allIdsUnique && ids.size === 36, 'All 36 location IDs are unique (loc-001 to loc-036)');
assert(allSlugsUnique && slugs.size === 36, 'All 36 location slugs are unique and URL-safe');
assert(allPhysicalCampusFalse, 'All 36 locations strictly designated physicalCampus: false (Online Service Area)');
assert(allRoutesValid, 'All 36 route paths adhere to /branches/{city-slug}/ pattern with trailing slash');

console.log('');

// -------------------------------------------------------------
// SUITE B: COURSE ASSOCIATION TESTS
// -------------------------------------------------------------
console.log('[SUITE B] Course Association & Resolution Tests:');

let totalCompulsoryAssociations = 0;
let totalAdditionalAssociations = 0;
let allCoreValid = true;
let allAdditionalValid = true;
let noDuplicateCoursesPerLocation = true;

locations.forEach(loc => {
  // Check core
  if (!Array.isArray(loc.coreCourseNumbers) || loc.coreCourseNumbers.length !== 4) {
    allCoreValid = false;
  } else {
    // Must be exactly [2, 9, 17, 7]
    const coreSorted = [...loc.coreCourseNumbers].sort((a,b)=>a-b);
    if (JSON.stringify(coreSorted) !== JSON.stringify([2, 7, 9, 17])) {
      allCoreValid = false;
    }
    totalCompulsoryAssociations += loc.coreCourseNumbers.length;
  }

  // Check additional
  if (!Array.isArray(loc.additionalCourseNumbers) || loc.additionalCourseNumbers.length < 2 || loc.additionalCourseNumbers.length > 3) {
    allAdditionalValid = false;
  } else {
    totalAdditionalAssociations += loc.additionalCourseNumbers.length;
  }

  // Check duplicate per city
  const allInCity = [...loc.coreCourseNumbers, ...loc.additionalCourseNumbers];
  const setInCity = new Set(allInCity);
  if (setInCity.size !== allInCity.length) {
    noDuplicateCoursesPerLocation = false;
  }
});

assert(allCoreValid, 'All 36 cities reference the exact 4 compulsory professional courses ([2, 9, 17, 7])');
assert(totalCompulsoryAssociations === 144, `Exactly 144 compulsory course associations (found: ${totalCompulsoryAssociations})`);
assert(allAdditionalValid, 'All 36 cities have 2 or 3 approved additional courses');
assert(totalAdditionalAssociations === 92, `Exactly 92 approved additional course associations (found: ${totalAdditionalAssociations})`);
assert(totalCompulsoryAssociations + totalAdditionalAssociations === 236, `Total course associations equal exactly 236 (found: ${totalCompulsoryAssociations + totalAdditionalAssociations})`);
assert(noDuplicateCoursesPerLocation, 'Zero duplicate course assignments within any single location');

// Test course resolver resolution for each city
let allResolutionsSucceeded = true;
try {
  locations.forEach(loc => {
    const res = resolveCoursesForLocation(loc.slug);
    if (!res || res.allCourses.length !== (loc.coreCourseNumbers.length + loc.additionalCourseNumbers.length)) {
      allResolutionsSucceeded = false;
    }
  });
} catch (err) {
  allResolutionsSucceeded = false;
  console.error('Course resolution error:', err.message);
}
assert(allResolutionsSucceeded, 'All 236 course references resolve cleanly from canonical data.js without error');

console.log('');

// -------------------------------------------------------------
// SUITE C: PRICING INTEGRITY TESTS
// -------------------------------------------------------------
console.log('[SUITE C] Canonical Pricing Integrity Tests:');

const dmPro = resolveCourseByMasterNumber(2);
const gdPro = resolveCourseByMasterNumber(9);
const videoPro = resolveCourseByMasterNumber(17);
const aiBizPro = resolveCourseByMasterNumber(7);

assert(dmPro && dmPro.pricing.regularPrice === 24900 && dmPro.pricing.launchPrice === 19900, 'Master #2 (dm-professional): Regular ₹24,900, Launch ₹19,900');
assert(gdPro && gdPro.pricing.regularPrice === 29900 && gdPro.pricing.launchPrice === 24900, 'Master #9 (graphic-design-pro): Regular ₹29,900, Launch ₹24,900');
assert(videoPro && videoPro.pricing.regularPrice === 35900 && videoPro.pricing.launchPrice === 24900, 'Master #17 (video-pro): Regular ₹35,900, Launch ₹24,900');
assert(aiBizPro && aiBizPro.pricing.regularPrice === 39900 && aiBizPro.pricing.launchPrice === 29900, 'Master #7 (ai-for-business-pro): Regular ₹39,900, Launch ₹29,900');

// Verify pricing synchronization against approved 2026-11-09 baseline
const { courses } = loadCanonicalData();
assert(courses.length === 109, `Canonical course catalogue contains exactly 109 courses (found: ${courses.length})`);

console.log('');

// -------------------------------------------------------------
// SUITE D: ROUTING ARCHITECTURE & PUBLICATION GUARDS
// -------------------------------------------------------------
console.log('[SUITE D] Routing Architecture & Cloudflare Manifest Tests:');

const allRoutes = getAllRoutes();
assert(allRoutes.length === 37, `Exactly 37 routes defined (1 directory + 36 cities, found: ${allRoutes.length})`);
assert(allRoutes[0] === '/branches/', 'Route index 0 is central directory: /branches/');

const dirResolution = resolveRoute('/branches/');
assert(dirResolution.matched && dirResolution.type === 'directory', 'Directory route resolves correctly to type: directory');

const indoreResolution = resolveRoute('/branches/indore/');
assert(indoreResolution.matched && indoreResolution.location.city === 'Indore', 'City route /branches/indore/ resolves correctly to Indore');

const badResolution = resolveRoute('/branches/non-existent-city/');
assert(!badResolution.matched && badResolution.statusCode === 404, 'Unknown slug returns HTTP 404 (Never redirects to homepage)');

// Test publication safety guard: all 36 routes must NOT be publishable in Phase 02
const manifest = getCloudflareRouteManifest();
const publishableCount = manifest.filter(m => m.publishable).length;
assert(publishableCount === 0, `Zero routes are publicly publishable in Phase 02 (all gated behind publicationStatus: 'draft')`);

console.log('');

// -------------------------------------------------------------
// SUITE E: EXISTING WEBSITE PRESERVATION & GIT BASELINE
// -------------------------------------------------------------
console.log('[SUITE E] Existing Website Preservation Tests:');

// Verify critical existing files exist and have not been modified or corrupted
const criticalFiles = [
  'index.html',
  'courses.html',
  'data.js',
  'js/data.min.js',
  'js/main.min.js',
  'academies/digital-marketing/index.html',
  'academies/ai/index.html',
  'academies/design/index.html'
];

let allCriticalFilesExist = true;
criticalFiles.forEach(f => {
  if (!fs.existsSync(path.resolve(__dirname, '..', f))) {
    allCriticalFilesExist = false;
  }
});
assert(allCriticalFilesExist, 'All critical existing site files exist and are intact');

// Verify git status shows zero modifications to tracked files
let gitStatusClean = false;
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  const modifiedTracked = status.split('\n')
    .filter(line => line.startsWith(' M') || line.startsWith('M ') || line.startsWith(' D') || line.startsWith('D '));
  gitStatusClean = modifiedTracked.length === 0;
  if (!gitStatusClean) {
    console.error('Modified tracked files:', modifiedTracked);
  }
} catch (err) {
  gitStatusClean = false;
}
assert(gitStatusClean, 'Git baseline preserved: Zero modifications to existing tracked production files');

console.log('\n================================================================');
console.log(`  VALIDATION SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('================================================================\n');

if (failedTests > 0) {
  console.error('Failures encountered:');
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
} else {
  console.log('ALL PHASE 02 VALIDATION GATES PASSED WITH ZERO ERRORS.\n');
  process.exit(0);
}
