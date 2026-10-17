/**
 * Technical SEO Phase 1 Pilot Audit Script
 * Validates pre-rendered HTML, SEO metadata, JSON-LD schema, and hydration compatibility
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PILOT_HTML_PATH = path.join(ROOT_DIR, 'courses', 'digital-marketing-pro', 'index.html');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('=== TECHNICAL SEO PHASE 1 PILOT AUDIT ===\n');

// 1. File existence
assert(fs.existsSync(PILOT_HTML_PATH), 'Static pilot file courses/digital-marketing-pro/index.html exists');

const html = fs.readFileSync(PILOT_HTML_PATH, 'utf8');

// 2. Title & H1
const titleMatch = html.match(/<title id="page-title">([^<]+)<\/title>/i);
assert(titleMatch && titleMatch[1].includes('Advanced Digital Marketing Professional'), `Page title contains correct course name: "${titleMatch ? titleMatch[1] : 'NONE'}"`);

const h1Match = html.match(/<h1[^>]*id="detail-title"[^>]*>([\s\S]*?)<\/h1>/i);
assert(h1Match && h1Match[1].trim() === 'Advanced Digital Marketing Professional', `H1 is exact: "${h1Match ? h1Match[1].trim() : 'NONE'}"`);

// 3. Meta Description & Canonical
const metaDescMatch = html.match(/<meta\s+name="description"\s+id="page-meta-desc"\s+content="([^"]+)"/i);
assert(metaDescMatch && metaDescMatch[1].includes('Advanced Digital Marketing Professional'), `Meta description populated: "${metaDescMatch ? metaDescMatch[1] : 'NONE'}"`);

const canonMatch = html.match(/<link\s+rel="canonical"\s+id="page-canonical"\s+href="([^"]+)"/i);
assert(canonMatch && canonMatch[1] === 'https://novaskills.in/courses/digital-marketing-pro/', `Canonical URL is exact: "${canonMatch ? canonMatch[1] : 'NONE'}"`);

// 4. Meta tags for course-id and prerendered
assert(html.includes('<meta name="course-id" content="digital-marketing-pro" />'), 'Meta course-id is digital-marketing-pro');
assert(html.includes('<meta name="prerendered" content="true" />'), 'Meta prerendered is true');

// 5. Open Graph & Twitter
assert(html.includes('<meta property="og:url" id="og-url" content="https://novaskills.in/courses/digital-marketing-pro/" />'), 'OG URL points to clean directory');
assert(html.includes('<meta property="og:title" id="og-title" content="Advanced Digital Marketing Professional'), 'OG title is course-specific');
assert(html.includes('<meta name="twitter:title" id="tw-title" content="Advanced Digital Marketing Professional'), 'Twitter title is course-specific');

// 6. Pricing & Commercial Values
assert(html.includes('₹11,999'), 'Price ₹11,999 is pre-rendered in HTML');
assert(html.includes('₹29,999'), 'Original Price ₹29,999 is pre-rendered in HTML');
assert(html.includes('60% OFF'), 'Discount badge 60% OFF is pre-rendered in HTML');
assert(html.includes('3 Months (88 Hours)'), 'Duration 3 Months (88 Hours) is pre-rendered');

// 7. Curriculum & Lessons
assert(html.includes('Digital Marketing Foundations, Personas & Strategy'), 'Module 1 title pre-rendered');
assert(html.includes('Content Strategy, Canva Design & Organic Social Media'), 'Module 2 title pre-rendered');
assert(html.includes('Local Business Presence, Google Business Profile & Website UX'), 'Module 3 title pre-rendered');
assert(html.includes('Introductory Paid Advertising: Google Search & Meta Ads'), 'Module 4 title pre-rendered');
assert(html.includes('Lead Capture, Customer Follow-Up & AI Productivity'), 'Module 5 title pre-rendered');
assert(html.includes('Campaign Measurement, GA4 Analytics & Performance Reporting'), 'Module 6 title pre-rendered');

// 8. Projects & Tools
assert(html.includes('Local Business Marketing Strategy &amp; Buyer Persona Blueprint') || html.includes('Local Business Marketing Strategy & Buyer Persona Blueprint'), 'Core Project 1 pre-rendered');
assert(html.includes('Google Search &amp; Meta Paid Ads Campaign Architecture Blueprint') || html.includes('Google Search & Meta Paid Ads Campaign Architecture Blueprint'), 'Core Project 4 pre-rendered');
assert(html.includes('Google Ads'), 'Core tool Google Ads pre-rendered');
assert(html.includes('Meta Ads Manager'), 'Core tool Meta Ads Manager pre-rendered');
assert(html.includes('GA4'), 'Core tool GA4 pre-rendered');

// 9. Structured Data JSON-LD Schema
const schemaMatch = html.match(/<script type="application\/ld\+json" id="ns-dynamic-course-schema">([\s\S]*?)<\/script>/i);
assert(!!schemaMatch, 'Schema.org JSON-LD script is present in raw HTML');

if (schemaMatch) {
  try {
    const schema = JSON.parse(schemaMatch[1]);
    const graph = schema['@graph'] || [];
    assert(graph.some(e => e['@type'] === 'EducationalOrganization'), 'Schema has EducationalOrganization');
    assert(graph.some(e => e['@type'] === 'BreadcrumbList'), 'Schema has BreadcrumbList');
    
    const courseItem = graph.find(e => e['@type'] === 'Course');
    assert(!!courseItem, 'Schema has Course entity');
    if (courseItem) {
      assert(courseItem.name === 'Advanced Digital Marketing Professional', `Course schema name is exact: "${courseItem.name}"`);
      assert(courseItem.offers && courseItem.offers.price === 11999, `Course schema offers price is ₹11,999`);
      assert(courseItem.hasCourseInstance && courseItem.hasCourseInstance.courseWorkload === '88 Hours', `Course schema workload is 88 Hours`);
      assert(courseItem.syllabusSections && courseItem.syllabusSections.length === 6, `Course schema has 6 syllabus sections`);
    }

    const faqItem = graph.find(e => e['@type'] === 'FAQPage');
    assert(!!faqItem, 'Schema has FAQPage entity');
    if (faqItem) {
      assert(faqItem.mainEntity && faqItem.mainEntity.length >= 3, `FAQPage schema has ${faqItem.mainEntity.length} Q&As`);
    }
  } catch (err) {
    assert(false, `Schema JSON parsing failed: ${err.message}`);
  }
}

// 10. Check that NO skeleton placeholder classes remain
const skeletonCount = (html.match(/course-skeleton/g) || []).length;
assert(skeletonCount === 0, `Raw HTML contains ZERO skeleton placeholder classes (found ${skeletonCount})`);

// 11. Breadcrumbs Home link is root-relative
assert(html.includes('<a href="/">Home</a>'), 'Breadcrumbs Home link points to root "/"');

console.log(`\n========================================`);
console.log(`PILOT AUDIT RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 STATIC PILOT AUDIT PASSED 100%!');
}
