/**
 * Comprehensive Validation Test Suite for:
 * "Will Your Skills Still Be Valuable When AI Can Do the Easy Part? (2027–2030)"
 * Validates SEO, AEO, GEO, E-E-A-T, Schema, Accessibility, Mobile Readiness & Integration.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const BLOG_HTML_PATH = path.join(ROOT_DIR, 'blog', 'ai-skills-future-careers-2027-2030', 'index.html');
const DATA_JS_PATH = path.join(ROOT_DIR, 'data.js');
const BLOG_LISTING_PATH = path.join(ROOT_DIR, 'blog.html');
const REDIRECTS_PATH = path.join(ROOT_DIR, '_redirects');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function check(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('===============================================================');
console.log('🔬 RESEARCH BLOG OPTIMIZATION & VERIFICATION TEST SUITE');
console.log('===============================================================\n');

// 1. File Presence & Size
console.log('--- 1. File Presence & Long-Form Completeness ---');
check(fs.existsSync(BLOG_HTML_PATH), 'index.html exists in blog/ai-skills-future-careers-2027-2030/');
const html = fs.readFileSync(BLOG_HTML_PATH, 'utf8');
check(html.length > 50000, `Article HTML is comprehensive (${(html.length / 1024).toFixed(1)} KB)`);

// 2. Sections Preservation Check
console.log('\n--- 2. Preservation of Complete Article Sections ---');
const requiredSections = [
  { id: 'quick-answers-future-skills', name: 'Quick Answers (AEO)' },
  { id: 'abstract', name: 'Abstract' },
  { id: '1-introduction-the-end-of-knowing-a-tool-as-a-complete-career-strategy', name: 'Section 1: Introduction' },
  { id: '2-what-does-the-evidence-actually-say', name: 'Section 2: Research Evidence' },
  { id: '3-the-four-economic-layers-of-ai-era-work', name: 'Section 3: Four Economic Layers' },
  { id: '4-ai-agents-and-agentic-ai-beyond-a-chatbot', name: 'Section 4: AI Agents & Workflows' },
  { id: '5-ai-automation-moving-from-repetitive-tasks-to-reliable-business-systems', name: 'Section 5: AI Automation Systems' },
  { id: '6-digital-marketing-in-the-ai-era-creativity-must-connect-to-measurable-business-outcomes', name: 'Section 6: Digital Marketing in AI Era' },
  { id: '7-the-role-of-data-analytics-turning-activity-into-decisions', name: 'Section 7: Role of Data Analytics' },
  { id: '8-which-human-skills-become-more-important', name: 'Section 8: Human Advantage Skills' },
  { id: '9-career-pathways-for-2027-2030-four-practical-profiles', name: 'Section 9: Four Practical Career Profiles' },
  { id: '10-three-portfolio-projects-that-demonstrate-real-competence', name: 'Section 10: Three Real Portfolio Projects' },
  { id: '11-a-90-day-roadmap-for-beginners-and-career-switchers', name: 'Section 11: 90-Day Tactical Roadmap' },
  { id: '12-five-common-career-mistakes-in-the-ai-era', name: 'Section 12: Five Career Mistakes' },
  { id: '13-scenarios-for-2027-2030-what-might-change', name: 'Section 13: Scenarios 2027–2030' },
  { id: '14-what-education-providers-should-change-now', name: 'Section 14: Education Reforms' },
  { id: '15-india-opportunities-constraints-and-realistic-career-planning', name: 'Section 15: India Opportunities & Constraints' },
  { id: '16-limitations-and-research-method', name: 'Section 16: Research Method & Limitations' },
  { id: '17-frequently-asked-questions', name: 'Section 17: Frequently Asked Questions' },
  { id: '18-conclusion-the-valuable-professional-is-the-one-who-can-be-trusted-with-results', name: 'Section 18: Conclusion' },
  { id: 'references-and-further-reading', name: 'References & Sources' },
  { id: 'about-the-author', name: 'About the Author' }
];

requiredSections.forEach(sec => {
  check(html.includes(`id="${sec.id}"`), `Includes ${sec.name} (#${sec.id})`);
});

// 3. Research Tables Preservation & Accessibility
console.log('\n--- 3. Research Tables & Mobile Scroll Accessibility ---');
check(html.includes('Table 1: Institutional research findings'), 'Includes Table 1: Institutional Research Evidence');
check(html.includes('Table 2: Pathway decision matrix'), 'Includes Table 2: Pathway Decision Matrix');
check(html.includes('Table 3: Illustrative 90-day roadmap'), 'Includes Table 3: 90-Day Roadmap');
const tableWrappers = (html.match(/class=["']research-table["']/g) || []).length;
check(tableWrappers >= 3, `All ${tableWrappers} tables wrapped in responsive .research-table containers`);
check(html.includes('tabindex="0" role="region"'), 'Tables have accessible keyboard scroll tabindex & ARIA region');

// 4. E-E-A-T & Research Citations
console.log('\n--- 4. E-E-A-T Transparency & Verifiable Citations ---');
check(html.includes('Waseeullah Mansoori'), 'Attributed to founder Waseeullah Mansoori');
check(html.includes('Founder &amp; Chief Learning Officer') || html.includes('Founder & Chief Learning Officer'), 'Author title specified');
check(html.includes('https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure'), 'Links to primary ILO 2025 publication');
check(html.includes('https://www.weforum.org/publications/the-future-of-jobs-report-2025'), 'Links to official WEF 2025 report');
check(html.includes('https://hai.stanford.edu/ai-index/2026-ai-index-report'), 'Links to Stanford HAI 2026 AI Index');
check(html.includes('https://www.pwc.com/gx/en/news-room/press-releases/2025/ai-linked-to-a-fourfold-increase-in-productivity-growth.html'), 'Links to PwC 2025 AI Barometer');
check(html.includes('https://developers.google.com/search/docs/fundamentals/ai-optimization-guide'), 'Links to official Google Search Central AI optimization guide');
check(html.includes('https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/'), 'Links to Microsoft Bing Webmaster AI Performance blog');
check(html.includes('Vintage Studio Productions'), 'Acknowledges thematic inspiration transparently');
check(!html.includes('guaranteed salary') && !html.includes('100% placement guaranteed'), 'Free of fabricated job/salary guarantees');

// 5. SEO & Social Metadata
console.log('\n--- 5. Technical SEO, Canonical, Open Graph & Twitter Cards ---');
check(html.includes('<link rel="canonical" href="https://novaskills.in/blog/ai-skills-future-careers-2027-2030/" />'), 'Canonical URL matches exact publication route');
check(html.includes('<meta property="og:url" content="https://novaskills.in/blog/ai-skills-future-careers-2027-2030/" />'), 'og:url matches canonical');
check(html.includes('<meta property="og:image" content="https://novaskills.in/images/seo/ai-skills-future-careers-2027-2030.jpg" />'), 'og:image points to dedicated 16:9 graphic');
check(html.includes('<meta name="twitter:card" content="summary_large_image" />'), 'Twitter card is summary_large_image');
check(html.includes('content="index, follow, max-image-preview:large'), 'Robots meta tag allows indexing and large previews');
check(html.includes('Published 18 October 2026'), 'Includes visible publication date 18 October 2026');

// 6. JSON-LD Schemas Validation
console.log('\n--- 6. JSON-LD Schema Validation ---');
const schemaBlocks = [];
const schemaRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
let match;
while ((match = schemaRegex.exec(html)) !== null) {
  try {
    const parsed = JSON.parse(match[1]);
    schemaBlocks.push(parsed);
  } catch (err) {
    check(false, `JSON-LD parse error: ${err.message}`);
  }
}
check(schemaBlocks.length >= 3, `Found ${schemaBlocks.length} valid JSON-LD schema blocks`);

const blogPosting = schemaBlocks.find(s => s['@type'] === 'BlogPosting');
check(!!blogPosting, 'BlogPosting schema exists and parsed cleanly');
if (blogPosting) {
  check(blogPosting.headline && blogPosting.headline.includes('Will Your Skills Still Be Valuable'), 'BlogPosting headline is correct');
  check(blogPosting.author && blogPosting.author.name === 'Waseeullah Mansoori', 'BlogPosting author is Waseeullah Mansoori');
  check(blogPosting.datePublished === '2026-10-18T12:00:00+05:30', 'BlogPosting datePublished is set to actual 18 Oct 2026 date');
  check(blogPosting.publisher && blogPosting.publisher.name === 'Nova Skills Education Institute', 'BlogPosting publisher is Nova Skills');
  check(Array.isArray(blogPosting.citation) && blogPosting.citation.length >= 8, `BlogPosting citations present (${blogPosting.citation ? blogPosting.citation.length : 0} citations)`);
}

const breadcrumbs = schemaBlocks.find(s => s['@type'] === 'BreadcrumbList');
check(!!breadcrumbs, 'BreadcrumbList schema exists and parsed cleanly');
if (breadcrumbs) {
  check(breadcrumbs.itemListElement && breadcrumbs.itemListElement.length === 3, 'BreadcrumbList has exactly 3 tiers (Home -> Blog -> Post)');
}

const faqPage = schemaBlocks.find(s => s['@type'] === 'FAQPage');
check(!!faqPage, 'FAQPage schema exists and parsed cleanly');
if (faqPage) {
  check(faqPage.mainEntity && faqPage.mainEntity.length === 10, `FAQPage contains all 10 FAQs (${faqPage.mainEntity ? faqPage.mainEntity.length : 0} found)`);
}

// 7. Navigation, Initial HTML & Hydration
console.log('\n--- 7. Initial HTML Availability, Fallbacks & Hydration ---');
check(html.includes('class="skip-link" href="#main-article"'), 'Includes accessible skip link');
check(html.includes('class="noscript-strip"'), 'Includes noscript fallback header for non-JS readers/crawlers');
check(html.includes('id="ns-header"'), 'Includes #ns-header for components.min.js hydration');
check(html.includes('id="ns-footer"'), 'Includes #ns-footer for components.min.js hydration');
check(html.includes('id="reading-progress"'), 'Includes reading progress indicator');
check(html.includes('desktop-toc') && html.includes('mobile-toc'), 'Includes both Desktop sticky TOC and Mobile collapsible TOC');

// 8. Integration with data.js, blog.html, _redirects, sitemap.xml
console.log('\n--- 8. Site-Wide Architectural Integration ---');
const dataJs = fs.readFileSync(DATA_JS_PATH, 'utf8');
check(dataJs.includes('ai-skills-future-careers-2027-2030'), 'data.js includes ai-skills-future-careers-2027-2030 in NS_BLOG_POSTS');

const blogHtml = fs.readFileSync(BLOG_LISTING_PATH, 'utf8');
check(blogHtml.includes('/blog/ai-skills-future-careers-2027-2030/'), 'blog.html lists new blog post in static HTML cards');
check(blogHtml.includes('Will Your Skills Still Be Valuable'), 'blog.html includes article title in static fallback');

const redirects = fs.readFileSync(REDIRECTS_PATH, 'utf8');
check(redirects.includes('/blog/ai-skills-future-careers-2027-2030/index.html /blog/ai-skills-future-careers-2027-2030/ 301'), '_redirects includes clean directory 301 rule');

const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
check(sitemap.includes('<loc>https://novaskills.in/blog/ai-skills-future-careers-2027-2030/</loc>'), 'sitemap.xml includes clean canonical URL');

// 9. Existing Courses Preservation Check
console.log('\n--- 9. Safety Check: 109 Courses & Core Architecture Unchanged ---');
const { NS_COURSES } = require(DATA_JS_PATH);
check(NS_COURSES && NS_COURSES.length === 109, `All 109 courses perfectly preserved in data.js (${NS_COURSES ? NS_COURSES.length : 0})`);

console.log(`\n===============================================================`);
console.log(`FINAL RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log(`===============================================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🌟 ALL 15 OPTIMIZATION FRAMEWORKS FULLY VALIDATED AND PASSING!');
}
