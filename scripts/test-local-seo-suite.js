/**
 * ==============================================================================
 * NOVA SKILLS — LOCAL & GEOGRAPHIC SEO AUTOMATED TEST SUITE (LAYERS 21-28)
 * ==============================================================================
 * Validates Google Search Essentials, Knowledge Graph integrity, and policy
 * compliance across Siddharth Nagar physical campus and 36 online learning hubs.
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BRANCHES_DIR = path.join(ROOT_DIR, 'branches');
const CONTACT_PATH = path.join(ROOT_DIR, 'contact', 'index.html');
const DIRECTORY_PATH = path.join(ROOT_DIR, 'branches', 'index.html');
const COMPONENTS_PATH = path.join(ROOT_DIR, 'components.js');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');
const LOCAL_SEO_DIR = path.join(ROOT_DIR, 'docs', 'seo', 'local');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function pass(msg) {
  totalTests++;
  passedTests++;
  console.log(`  ✅ PASS: ${msg}`);
}

function fail(msg) {
  totalTests++;
  failedTests++;
  console.error(`  ❌ FAIL: ${msg}`);
}

console.log('\n============================================================');
console.log('▶ SUITE 1: PHYSICAL CAMPUS KNOWLEDGE GRAPH & SCHEMA (/contact/)');
console.log('============================================================');

if (fs.existsSync(CONTACT_PATH)) {
  const contactHtml = fs.readFileSync(CONTACT_PATH, 'utf8');

  // Verify EducationalOrganization schema
  if (/"@type":\s*\[\s*"EducationalOrganization",\s*"LocalBusiness"\s*\]/i.test(contactHtml) ||
      (/"@type":\s*"EducationalOrganization"/i.test(contactHtml) && /"@type":\s*"LocalBusiness"/i.test(contactHtml))) {
    pass('Contact page contains EducationalOrganization & LocalBusiness schema');
  } else {
    fail('Contact page missing EducationalOrganization or LocalBusiness schema');
  }

  // Verify PostalAddress
  if (/"addressLocality":\s*"Siddharth Nagar"/i.test(contactHtml) && /"postalCode":\s*"272153"/i.test(contactHtml)) {
    pass('PostalAddress explicitly specifies Siddharth Nagar, UP - 272153');
  } else {
    fail('PostalAddress missing or inaccurate in contact page schema');
  }

  // Verify GeoCoordinates
  if (/27\.2713/.test(contactHtml) && /83\.0722/.test(contactHtml)) {
    pass('GeoCoordinates match exact Siddharth Nagar campus location (27.2713° N, 83.0722° E)');
  } else {
    fail('GeoCoordinates missing or incorrect in contact page schema');
  }

  // Verify Google Maps CID link
  if (/8727532038814819533/.test(contactHtml)) {
    pass('Schema links directly to verified Google Business Profile CID: 8727532038814819533');
  } else {
    fail('GBP CID reference missing in contact schema');
  }

  // Verify ContactPoint
  if (/\+91-9695904440/.test(contactHtml) && /"contactType":\s*"admissions"/i.test(contactHtml)) {
    pass('ContactPoint provides official admissions helpline +91-9695904440');
  } else {
    fail('ContactPoint admissions telephone missing or malformed');
  }
} else {
  fail('contact/index.html not found');
}

console.log('\n============================================================');
console.log('▶ SUITE 2: 36 CITY PAGES GOOGLE MAPS POLICY INVARIANTS');
console.log('============================================================');

const cityDirs = fs.readdirSync(BRANCHES_DIR).filter(item => {
  return fs.statSync(path.join(BRANCHES_DIR, item)).isDirectory();
});

if (cityDirs.length === 36) {
  pass(`Exact city directory count verified: 36 cities found`);
} else {
  fail(`Expected 36 city directories in /branches/, found ${cityDirs.length}`);
}

let allCitiesFreeOfLocalBusiness = true;
let allCitiesHaveCampusNotice = true;
let allCitiesHaveValidCanonical = true;
let allCitiesHaveAccurateTitle = true;

cityDirs.forEach(slug => {
  const cityPath = path.join(BRANCHES_DIR, slug, 'index.html');
  if (!fs.existsSync(cityPath)) {
    fail(`Missing index.html for city ${slug}`);
    return;
  }

  const content = fs.readFileSync(cityPath, 'utf8');

  // Policy check 1: Zero LocalBusiness schema
  if (/"LocalBusiness"/i.test(content)) {
    allCitiesFreeOfLocalBusiness = false;
    fail(`City ${slug} contains forbidden LocalBusiness schema!`);
  }

  // Policy check 2: Campus disclosure
  if (!/Siddharth Nagar/i.test(content) || !/online/i.test(content)) {
    allCitiesHaveCampusNotice = false;
    fail(`City ${slug} missing transparent Siddharth Nagar physical campus disclosure`);
  }

  // Canonical check
  const expectedCanonical = `https://novaskills.in/branches/${slug}/`;
  if (!content.includes(expectedCanonical)) {
    allCitiesHaveValidCanonical = false;
    fail(`City ${slug} has incorrect canonical URL (expected ${expectedCanonical})`);
  }

  // Title check
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !/Nova Skills/i.test(titleMatch[1])) {
    allCitiesHaveAccurateTitle = false;
    fail(`City ${slug} has invalid title tag`);
  }
});

if (allCitiesFreeOfLocalBusiness) {
  pass('All 36 city pages are 100% free of LocalBusiness schema (Google Policy Compliant)');
}
if (allCitiesHaveCampusNotice) {
  pass('All 36 city pages explicitly disclose Siddharth Nagar physical campus & live online delivery');
}
if (allCitiesHaveValidCanonical) {
  pass('All 36 city pages have valid self-referential canonical URLs');
}
if (allCitiesHaveAccurateTitle) {
  pass('All 36 city pages have branded, location-targeted title tags');
}

console.log('\n============================================================');
console.log('▶ SUITE 3: LEARNING LOCATIONS DIRECTORY (/branches/index.html)');
console.log('============================================================');

if (fs.existsSync(DIRECTORY_PATH)) {
  const dirHtml = fs.readFileSync(DIRECTORY_PATH, 'utf8');

  if (/<title>Learning Locations &amp; Nationwide Online Learning Hubs \| Nova Skills<\/title>/i.test(dirHtml)) {
    pass('Directory title explicitly distinguishes learning hubs: "Learning Locations & Nationwide Online Learning Hubs"');
  } else {
    fail('Directory title ambiguous or outdated');
  }

  if (!/"LocalBusiness"/i.test(dirHtml)) {
    pass('Directory is 100% free of deceptive LocalBusiness schema');
  } else {
    fail('Directory contains forbidden LocalBusiness schema');
  }

  let allCitiesLinked = true;
  cityDirs.forEach(slug => {
    if (!dirHtml.includes(`/branches/${slug}/`)) {
      allCitiesLinked = false;
      fail(`Directory missing link to city hub: /branches/${slug}/`);
    }
  });

  if (allCitiesLinked) {
    pass('Directory contains crawlable internal links to all 36 city hub pages');
  }

  if (/Siddharth Nagar/i.test(dirHtml) && /Headquarters/i.test(dirHtml)) {
    pass('Directory features dedicated Siddharth Nagar Physical Campus Headquarters callout');
  } else {
    fail('Directory missing Siddharth Nagar campus headquarters block');
  }
} else {
  fail('branches/index.html not found');
}

console.log('\n============================================================');
console.log('▶ SUITE 4: SEMANTIC NAP MICRODATA (FOOTER & COMPONENTS)');
console.log('============================================================');

if (fs.existsSync(COMPONENTS_PATH)) {
  const compJs = fs.readFileSync(COMPONENTS_PATH, 'utf8');
  if (/<address[\s\S]*?Siddharth Nagar[\s\S]*?272153[\s\S]*?<\/address>/i.test(compJs)) {
    pass('components.js footer wraps campus address in semantic <address> microdata');
  } else {
    fail('components.js missing semantic <address> microdata for campus');
  }
}

if (fs.existsSync(INDEX_PATH)) {
  const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');
  if (/<address[\s\S]*?Siddharth Nagar[\s\S]*?272153[\s\S]*?<\/address>/i.test(indexHtml)) {
    pass('index.html footer wraps campus address in semantic <address> microdata');
  } else {
    fail('index.html missing semantic <address> microdata for campus');
  }
}

console.log('\n============================================================');
console.log('▶ SUITE 5: DOCUMENTATION & AUDIT ARTIFACT INTEGRITY');
console.log('============================================================');

const requiredDocs = [
  '00-local-seo-forensic-audit.md',
  '00-geographic-url-inventory.csv',
  '00-campus-information-audit.csv',
  '00-location-page-audit.csv',
  '00-local-competitor-audit.md',
  '00-local-issue-register.csv',
  '21-local-seo-strategy.md',
  '22-hyperlocal-opportunity-report.md',
  '23-geographic-keyword-map.csv',
  '24-google-business-profile-audit.md',
  '24-google-business-profile-change-register.csv',
  '25-map-seo-report.md',
  '26-multi-location-audit.md',
  '27-local-entity-audit.md',
  '27-entity-consistency-register.csv',
  '28-location-content-strategy.md',
  '28-location-page-quality-register.csv',
  '28-geographic-internal-link-map.csv',
  '29-local-citation-and-reputation-plan.md'
];

let allDocsExist = true;
requiredDocs.forEach(docName => {
  const docPath = path.join(LOCAL_SEO_DIR, docName);
  if (!fs.existsSync(docPath)) {
    allDocsExist = false;
    fail(`Required local SEO artifact missing: docs/seo/local/${docName}`);
  }
});

if (allDocsExist) {
  pass(`All ${requiredDocs.length} Local SEO audit artifacts & strategy registers verified present`);
}

console.log('\n============================================================');
console.log(`VALIDATION SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
if (failedTests > 0) {
  console.error(`❌ ${failedTests} TESTS FAILED. Resolve issues before deployment.`);
  process.exit(1);
} else {
  console.log('🎉 ALL LOCAL & GEOGRAPHIC SEO QUALITY INVARIANTS PASSED CLEANLY.');
  process.exit(0);
}
