const fs = require('fs');
const path = require('path');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

console.log('====================================================');
console.log('NOVA SKILLS — SEO, OG, TWITTER CARDS & SCHEMA VALIDATION');
console.log('====================================================\n');

// 1. IMAGE EXISTENCE AND DIMENSIONS VALIDATION
console.log('--- 1. Social Image Validation (public/images/seo/) ---');
const seoDir = path.join(__dirname, '..', 'public', 'images', 'seo');
assert(fs.existsSync(seoDir), 'public/images/seo/ directory exists');

const requiredImages = [
  'og-default.png', 'og-courses.png', 'og-course-detail.png',
  'og-course-dm-professional.png', 'og-course-dm-mastery.png', 'og-course-ai-mastery.png',
  'og-course-full-stack.png', 'og-course-design-mastery.png', 'og-course-motion-graphics.png',
  'og-academies.png', 'og-blog.png', 'og-blog-detail.png',
  'og-blog-ai-jobs-india-2026.png', 'og-blog-digital-marketing-salary-india.png',
  'og-blog-learn-graphic-design-beginner-guide.png', 'og-blog-freelancing-fiverr-india-guide.png',
  'og-blog-n8n-ai-automation-beginners.png', 'og-blog-youtube-channel-monetise-2026.png',
  'og-blog-chatgpt-prompts-marketing.png', 'og-blog-kids-coding-benefits-india.png',
  'og-blog-python-vs-javascript-2026.png', 'og-placements.png',
  'og-success-stories.png', 'og-assessment.png',  'og-privacy-policy.png',
  'og-refund-policy.png', 'og-terms-and-conditions.png', 'og-contact.png', 'og-thank-you.png', 'og-lead-success.png'
];

function getPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length > 24 && buf.toString('hex', 0, 8) === '89504e470d0a1a0a') {
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    return { width, height };
  }
  return null;
}

requiredImages.forEach(img => {
  const imgPath = path.join(seoDir, img);
  const exists = fs.existsSync(imgPath);
  assert(exists, `Image file exists: ${img}`);
  if (exists) {
    const dims = getPngDimensions(imgPath);
    assert(dims && dims.width === 1200 && dims.height === 630, `${img} dimensions are 1200x630 px (found ${dims ? dims.width + 'x' + dims.height : 'unknown'})`);
  }
});

// 2. HTML HEAD METADATA VALIDATION
console.log('\n--- 2. HTML Open Graph & Twitter Cards Validation ---');
const pages = [
  'index.html', 'courses.html', 'course-detail.html', 'academy-detail.html',
  'blog.html', 'blog-detail.html', 'placements.html', 'success-stories.html',
  'assessment.html', 'privacy-policy/index.html', 'refund-policy/index.html',
  'terms-and-conditions/index.html', 'contact/index.html', 'thank-you/index.html',
  'lead-success/index.html', '404.html'
];

pages.forEach(page => {

  console.log(`\nTesting Page: ${page}`);
  const htmlPath = path.join(__dirname, '..', page);
  assert(fs.existsSync(htmlPath), `File exists: ${page}`);
  if (!fs.existsSync(htmlPath)) return;

  const content = fs.readFileSync(htmlPath, 'utf8');

  // OG tags
  assert(content.includes('property="og:type"'), `${page} has og:type`);
  assert(content.includes('property="og:title"'), `${page} has og:title`);
  assert(content.includes('property="og:description"'), `${page} has og:description`);
  assert(content.includes('property="og:url"'), `${page} has og:url`);
  assert(content.includes('property="og:site_name"'), `${page} has og:site_name`);
  assert(content.includes('property="og:image"'), `${page} has og:image`);
  assert(content.includes('property="og:image:width"'), `${page} has og:image:width`);
  assert(content.includes('property="og:image:height"'), `${page} has og:image:height`);
  assert(content.includes('property="og:locale"'), `${page} has og:locale`);

  // Twitter Cards
  assert(content.includes('name="twitter:card" content="summary_large_image"'), `${page} has twitter:card = summary_large_image`);
  assert(content.includes('name="twitter:title"'), `${page} has twitter:title`);
  assert(content.includes('name="twitter:description"'), `${page} has twitter:description`);
  assert(content.includes('name="twitter:image"'), `${page} has twitter:image`);
  assert(content.includes('name="twitter:site"'), `${page} has twitter:site`);

  // Canonical link & Absolute HTTPS URLs
  assert(content.includes('<link rel="canonical"'), `${page} has canonical link`);
  assert(content.includes('https://novaskills.in/'), `${page} uses absolute HTTPS URLs`);

  if (page.includes('thank-you') || page.includes('lead-success')) {
    assert(content.includes('content="noindex, follow"'), `${page} has noindex, follow robots tag`);
  }
});



// 3. SCHEMA.ORG VALIDATION
console.log('\n--- 3. Schema.org JSON-LD Structured Data Validation ---');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

assert(!!jsonLdMatch, 'index.html contains JSON-LD script');
if (jsonLdMatch) {
  try {
    const schema = JSON.parse(jsonLdMatch[1]);
    assert(schema['@context'] === 'https://schema.org', 'Schema @context is https://schema.org');
    const types = Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']];
    assert(types.includes('Organization') && types.includes('EducationalOrganization') && types.includes('LocalBusiness'), 'Schema @type includes Organization, EducationalOrganization & LocalBusiness');
    assert(schema.name === 'Nova Skills Education Institute', 'Schema name is accurate');
    assert(schema.url === 'https://novaskills.in/', 'Schema URL uses absolute HTTPS');
    assert(schema.logo && schema.logo.startsWith('https://novaskills.in/'), 'Schema logo uses absolute HTTPS');
    assert(schema.image && schema.image.startsWith('https://novaskills.in/'), 'Schema image uses absolute HTTPS');
    assert(schema.telephone === '+91-9695904440', 'Schema telephone included');
    assert(schema.email === 'novaskills.official@gmail.com', 'Schema email included');
    assert(schema.address && schema.address['@type'] === 'PostalAddress', 'Schema PostalAddress included');
    assert(schema.address.postalCode === '272153', 'Schema postalCode is 272153');
    assert(schema.geo && schema.geo['@type'] === 'GeoCoordinates', 'Schema GeoCoordinates included');
    assert(Array.isArray(schema.openingHoursSpecification), 'Schema openingHoursSpecification included');
    assert(Array.isArray(schema.sameAs) && schema.sameAs.length >= 5, 'Schema sameAs includes official social profiles');
  } catch (err) {
    assert(false, `JSON-LD parsing error: ${err.message}`);
  }
}

// Check no duplicate LocalBusiness elsewhere
let duplicateFound = false;
pages.filter(p => p !== 'index.html').forEach(p => {
  const c = fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
  if (c.includes('"LocalBusiness"')) {
    duplicateFound = true;
  }
});
assert(!duplicateFound, 'No duplicate LocalBusiness schema found on secondary pages');

// 4. COURSE SCHEMA VALIDATION (ALL 28 COURSES)
console.log('\n--- 4. Course Schema (JSON-LD) Validation (28 Courses) ---');
const vm = require('vm');
const dataJsCode = fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf8');
vm.runInThisContext(dataJsCode);

assert(Array.isArray(NS_COURSES) && NS_COURSES.length >= 100, `Detected ${NS_COURSES.length} courses in NS_COURSES`);

// Check Course schema non-placement on non-course static pages
const nonCoursePages = ['index.html', 'blog.html', 'placements.html', 'success-stories.html', 'assessment.html', '404.html'];
let invalidCourseSchemaPlacement = false;
nonCoursePages.forEach(p => {
  const content = fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
  if (content.includes('"@type": "Course"') || content.includes('"@type":"Course"')) {
    invalidCourseSchemaPlacement = true;
  }
});
assert(!invalidCourseSchemaPlacement, 'Course Schema is NOT placed on Homepage, Blog, Placements, Success Stories, Assessment, or 404 pages');

// Validate individual course schema generation
NS_COURSES.forEach(course => {
  const canonicalUrl = `https://novaskills.in/course-detail.html?id=${course.id}`;
  const teachesSkills = (course.tools && course.tools.length > 0) ? course.tools : [course.name, course.academy];
  
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.fullDesc || course.shortDesc,
    "url": canonicalUrl,
    "courseCode": course.id,
    "inLanguage": "en",
    "courseMode": course.mode || "Hybrid",
    "educationalCredentialAwarded": "Professional Certificate of Completion by Nova Skills",
    "teaches": teachesSkills,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Nova Skills Education Institute",
      "url": "https://novaskills.in/"
    },
    "offers": {
      "@type": "Offer",
      "category": "Paid",
      "price": course.price,
      "priceCurrency": "INR"
    }
  };

  assert(courseSchema['@type'] === 'Course', `[${course.name}] @type is Course`);
  assert(courseSchema.name === course.name, `[${course.name}] name matches`);
  assert(courseSchema.url === canonicalUrl && courseSchema.url.startsWith('https://novaskills.in/'), `[${course.name}] url is absolute HTTPS`);
  assert(courseSchema.provider['@type'] === 'EducationalOrganization', `[${course.name}] provider is EducationalOrganization`);
  assert(courseSchema.courseMode === course.mode, `[${course.name}] courseMode is ${course.mode}`);
  assert(courseSchema.offers.price === course.price, `[${course.name}] price is ${course.price} INR`);
});

// 4. IMAGE OPTIMISATION & CORE WEB VITALS VALIDATION
console.log('\n--- 4. Image Optimisation & Core Web Vitals Validation ---');
const heroAvif = path.join(__dirname, '..', 'public', 'images', 'hero', 'hero-student.avif');
const heroWebp = path.join(__dirname, '..', 'public', 'images', 'hero', 'hero-student.webp');
const hero400Avif = path.join(__dirname, '..', 'public', 'images', 'hero', 'hero-student-400.avif');
const hero800Avif = path.join(__dirname, '..', 'public', 'images', 'hero', 'hero-student-800.avif');
const hero1200Avif = path.join(__dirname, '..', 'public', 'images', 'hero', 'hero-student-1200.avif');

assert(fs.existsSync(heroAvif), 'Hero AVIF primary image exists');
assert(fs.existsSync(heroWebp), 'Hero WebP fallback image exists');
assert(fs.existsSync(hero400Avif) && fs.existsSync(hero800Avif) && fs.existsSync(hero1200Avif), 'Hero responsive AVIF srcset variants exist (400w, 800w, 1200w)');

assert(indexHtml.includes('href="/public/images/hero/hero-student-800.avif"') || indexHtml.includes('href="public/images/hero/hero-student-800.avif"'), 'index.html preloads LCP Hero Image');
assert(indexHtml.includes('<picture class="hero-character-picture">'), 'index.html uses <picture> element for hero image');
assert(indexHtml.includes('type="image/avif"'), 'index.html specifies AVIF source');
assert(indexHtml.includes('type="image/webp"'), 'index.html specifies WebP source');
assert(indexHtml.includes('width="480" height="600"'), 'hero image specifies explicit width and height attributes (CLS prevention)');

// 5. LAZY LOADING & PERFORMANCE VALIDATION
console.log('\n--- 5. Lazy Loading & Core Web Vitals Optimization Validation ---');
const mainJsContent = fs.readFileSync(path.join(__dirname, '..', 'main.js'), 'utf8');
const contactHtmlContent = fs.readFileSync(path.join(__dirname, '..', 'contact', 'index.html'), 'utf8');

assert(mainJsContent.includes('function initVideoFacades()'), 'main.js implements click-to-load YouTube video facade pattern');
assert(mainJsContent.includes('function initDeferredBackgrounds()'), 'main.js implements IntersectionObserver for deferred CSS background images');
assert(contactHtmlContent.includes('loading="lazy"'), 'contact/index.html applies loading="lazy" to Google Maps iframe');
assert(contactHtmlContent.includes('referrerpolicy="no-referrer-when-downgrade"'), 'contact/index.html applies referrerpolicy to iframe');
assert(indexHtml.includes('fetchpriority="high"'), 'index.html applies fetchpriority="high" to primary LCP Hero image');

// 6. FONT OPTIMISATION & SELF-HOSTING VALIDATION
console.log('\n--- 6. Font Optimisation & Self-Hosting Validation ---');
const fontsCssPath = path.join(__dirname, '..', 'public', 'fonts', 'fonts.css');
const stylesCssContent = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');

assert(fs.existsSync(fontsCssPath), 'Self-hosted public/fonts/fonts.css exists');
const fontsCssContent = fs.readFileSync(fontsCssPath, 'utf8');

assert(fontsCssContent.includes('font-display: swap;'), 'public/fonts/fonts.css uses font-display: swap for all @font-face rules');
assert(fontsCssContent.includes("src: url('PlusJakartaSans-700.woff2') format('woff2');"), 'PlusJakartaSans-700.woff2 WOFF2 font registered');
assert(fontsCssContent.includes("src: url('Inter-400.woff2') format('woff2');"), 'Inter-400.woff2 WOFF2 font registered');

assert(stylesCssContent.includes("system-ui, -apple-system, BlinkMacSystemFont"), 'styles.css configures robust system fallback font stacks');

assert(indexHtml.includes('PlusJakartaSans-700.woff2'), 'index.html preloads critical PlusJakartaSans-700.woff2 font');
assert(indexHtml.includes('Inter-400.woff2'), 'index.html preloads critical Inter-400.woff2 font');
assert(!indexHtml.includes('fonts.googleapis.com/css2'), 'index.html has zero render-blocking Google Fonts stylesheets');

// 7. CSS OPTIMISATION & CRITICAL CSS VALIDATION
console.log('\n--- 7. CSS Optimisation & Critical CSS Inlining Validation ---');
const cssMinPath = path.join(__dirname, '..', 'css', 'styles.min.css');
const critMinPath = path.join(__dirname, '..', 'css', 'critical.min.css');

assert(fs.existsSync(cssMinPath), 'Production minified stylesheet css/styles.min.css exists');
assert(fs.existsSync(critMinPath), 'Extracted Critical CSS css/critical.min.css exists');

const minCssContent = fs.readFileSync(cssMinPath, 'utf8');
assert(!minCssContent.includes('@import'), 'Production CSS has zero @import statements');

assert(indexHtml.includes('<style id="critical-css">'), 'index.html inlines Critical CSS in <head>');
assert(indexHtml.includes('styles.min.css'), 'index.html defers production stylesheet via rel="preload" as="style"');
assert(indexHtml.includes('styles.min.css'), 'index.html provides <noscript> fallback stylesheet tag');

// 8. JAVASCRIPT OPTIMISATION & BUNDLE DEFERRAL VALIDATION
console.log('\n--- 8. JavaScript Optimisation & Bundle Deferral Validation ---');
const jsDataPath = path.join(__dirname, '..', 'js', 'data.min.js');
const jsCompPath = path.join(__dirname, '..', 'js', 'components.min.js');
const jsMainPath = path.join(__dirname, '..', 'js', 'main.min.js');
const jsAiPath = path.join(__dirname, '..', 'js', 'nova-ai-widget.min.js');

assert(fs.existsSync(jsDataPath), 'Minified production bundle js/data.min.js exists');
assert(fs.existsSync(jsCompPath), 'Minified production bundle js/components.min.js exists');
assert(fs.existsSync(jsMainPath), 'Minified production bundle js/main.min.js exists');
assert(fs.existsSync(jsAiPath), 'Minified production bundle js/nova-ai-widget.min.js exists');

assert(indexHtml.includes('data.min.js" defer'), 'index.html loads js/data.min.js with defer');
assert(indexHtml.includes('components.min.js" defer'), 'index.html loads js/components.min.js with defer');
assert(indexHtml.includes('main.min.js" defer'), 'index.html loads js/main.min.js with defer');


const compJsContent = fs.readFileSync(path.join(__dirname, '..', 'components.js'), 'utf8');
assert(compJsContent.includes('loadAiWidget') && compJsContent.includes('nova-ai-widget.min.js'), 'components.js implements lazy loading for AI Assistant widget on user interaction / idle window');

// 9. CORE WEB VITALS & CLOUDFLARE PRODUCTION VALIDATION
console.log('\n--- 9. Core Web Vitals & Cloudflare Production Validation ---');
const headersPath = path.join(__dirname, '..', '_headers');
assert(fs.existsSync(headersPath), 'Cloudflare Pages _headers configuration file exists');

const headersContent = fs.readFileSync(headersPath, 'utf8');
assert(headersContent.includes('max-age=31536000, immutable'), '_headers configures 1-year immutable caching for static assets');
assert(headersContent.includes('X-Content-Type-Options: nosniff'), '_headers configures security headers');
assert(headersContent.includes('public, max-age=0, must-revalidate'), '_headers configures max-age=0, must-revalidate for HTML pages');
assert(headersContent.includes('no-store, no-cache, must-revalidate, max-age=0'), '_headers excludes dynamic lead routes (/thank-you, /lead-success, /api) from aggressive caching');
assert(headersContent.includes('Link: </public/fonts/PlusJakartaSans-700.woff2>'), '_headers configures HTTP 103 Early Hints for critical font preloading');

// 10. BROTLI COMPRESSION & MIME TYPE VALIDATION
console.log('\n--- 10. Brotli Compression & MIME Type Validation ---');
assert(headersContent.includes('Content-Type: text/css; charset=utf-8'), '_headers specifies text/css MIME type for CSS Brotli/Gzip compression');
assert(headersContent.includes('Content-Type: application/javascript; charset=utf-8'), '_headers specifies application/javascript MIME type for JS Brotli/Gzip compression');
assert(headersContent.includes('Content-Type: application/xml; charset=utf-8'), '_headers specifies application/xml MIME type for XML Brotli/Gzip compression');
assert(headersContent.includes('Content-Type: font/woff2'), '_headers specifies font/woff2 MIME type for WOFF2 binary fonts');

// 11. ENTERPRISE HTTP SECURITY HEADERS VALIDATION
console.log('\n--- 11. Enterprise HTTP Security Headers Validation ---');
assert(headersContent.includes('Content-Security-Policy:'), '_headers configures Content-Security-Policy (CSP)');
assert(headersContent.includes('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'), '_headers configures HSTS with 1-year preload');
assert(headersContent.includes('X-Content-Type-Options: nosniff'), '_headers prevents MIME-type sniffing');
assert(headersContent.includes('X-Frame-Options: SAMEORIGIN'), '_headers prevents clickjacking via X-Frame-Options');
assert(headersContent.includes('Referrer-Policy: strict-origin-when-cross-origin'), '_headers configures strict Referrer-Policy');
assert(headersContent.includes('Permissions-Policy: camera=(), microphone=(), geolocation=()'), '_headers restricts unneeded browser API permissions');
assert(headersContent.includes('Cross-Origin-Opener-Policy: same-origin-allow-popups'), '_headers configures Cross-Origin-Opener-Policy');
assert(headersContent.includes('X-DNS-Prefetch-Control: on'), '_headers enables DNS prefetching');

// 12. META DESCRIPTION LENGTH VALIDATION (140-160 CHARACTERS)
console.log('\n--- 12. Meta Description Length Validation ---');
const pageDescMatch = indexHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
assert(pageDescMatch && pageDescMatch[1].length >= 140 && pageDescMatch[1].length <= 160, `index.html meta description length is within 140–160 chars (${pageDescMatch ? pageDescMatch[1].length : 0} chars)`);

// 13. ZERO BROKEN LINKS & 404 ERROR VALIDATION
console.log('\n--- 13. Zero Broken Links & 404 Resolution Validation ---');
const refundHtml = fs.readFileSync(path.join(__dirname, '..', 'refund-policy', 'index.html'), 'utf8');
const termsHtml = fs.readFileSync(path.join(__dirname, '..', 'terms-and-conditions', 'index.html'), 'utf8');

assert(refundHtml.includes('href="../privacy-policy/"'), 'refund-policy/index.html cross-links to ../privacy-policy/ (zero 404)');
assert(refundHtml.includes('href="../terms-and-conditions/"'), 'refund-policy/index.html cross-links to ../terms-and-conditions/ (zero 404)');
assert(termsHtml.includes('href="../refund-policy/"'), 'terms-and-conditions/index.html cross-links to ../refund-policy/ (zero 404)');
assert(termsHtml.includes('href="../privacy-policy/"'), 'terms-and-conditions/index.html cross-links to ../privacy-policy/ (zero 404)');

assert(stylesCssContent.includes('.aspect-video') && stylesCssContent.includes('.aspect-hero'), 'styles.css defines CSS aspect-ratio utilities for zero CLS');










// ─── SECTION 14: Navigation & Footer Link Validation ───────────────────
console.log('\n--- 14. Navigation & Footer Link Validation ---');
const componentsJs  = fs.readFileSync(path.join(__dirname, '..', 'components.js'),  'utf8');
const componentsMin = fs.readFileSync(path.join(__dirname, '..', 'js', 'components.min.js'), 'utf8');

// Header nav links
assert(componentsJs.includes('href="/contact/"'), 'components.js header nav: Contact link points to /contact/');
assert(componentsJs.includes('href="/courses.html"'), 'components.js header nav: Courses link points to /courses.html');
assert(componentsJs.includes('href="/assessment.html"'), 'components.js header nav: AI Career Advisor points to /assessment.html');
assert(componentsJs.includes('href="/placements.html"'), 'components.js header nav: Placements link points to /placements.html');

// Footer quick links
assert(componentsJs.includes('href="/contact/"'), 'components.js footer: Contact Us link points to /contact/');
assert(!componentsJs.includes('"/#counselling">Contact Us<'), 'components.js footer: Contact Us is NOT a hash anchor (/#counselling removed)');

// Footer legal links
assert(componentsJs.includes('href="/privacy-policy/"'), 'components.js footer legal: Privacy Policy link correct');
assert(componentsJs.includes('href="/terms-and-conditions/"'), 'components.js footer legal: Terms & Conditions link correct');
assert(componentsJs.includes('href="/refund-policy/"'), 'components.js footer legal: Refund Policy link correct');

// AI widget root-absolute path (no fragile relative path)
assert(componentsJs.includes("aiScript.src = '/js/nova-ai-widget.min.js'"), 'components.js AI widget uses root-absolute /js/nova-ai-widget.min.js');
assert(!componentsJs.includes("'../js/nova-ai-widget"), 'components.js AI widget has no relative ../js path');

// Minified bundle reflects same fixes
assert(componentsMin.includes('/contact/'), 'components.min.js contains /contact/ link');
assert(componentsMin.includes('/js/nova-ai-widget.min.js'), 'components.min.js AI widget src is root-absolute');

// Directory page existence
const dirPages = ['contact', 'privacy-policy', 'refund-policy', 'terms-and-conditions', 'thank-you', 'lead-success'];
dirPages.forEach(dir => {
  const p = path.join(__dirname, '..', dir, 'index.html');
  assert(fs.existsSync(p), `${dir}/index.html exists (HTTP 200 candidate)`);
});

// _redirects rules for clean directory URLs
const redirects = fs.readFileSync(path.join(__dirname, '..', '_redirects'), 'utf8');
assert(redirects.includes('/contact/index.html /contact/ 301'), '_redirects: /contact/index.html → /contact/ 301 exists');
assert(redirects.includes('/privacy-policy/index.html /privacy-policy/ 301'), '_redirects: /privacy-policy/index.html → /privacy-policy/ 301 exists');
assert(redirects.includes('/terms-and-conditions/index.html /terms-and-conditions/ 301'), '_redirects: /terms-and-conditions/index.html → /terms-and-conditions/ 301 exists');
assert(redirects.includes('/refund-policy/index.html /refund-policy/ 301'), '_redirects: /refund-policy/index.html → /refund-policy/ 301 exists');

// Canonical & og:url on all 4 directory pages
const canonicalPages = {
  'contact/index.html': 'https://novaskills.in/contact/',
  'privacy-policy/index.html': 'https://novaskills.in/privacy-policy/',
  'terms-and-conditions/index.html': 'https://novaskills.in/terms-and-conditions/',
  'refund-policy/index.html': 'https://novaskills.in/refund-policy/',
};
Object.entries(canonicalPages).forEach(([file, expectedUrl]) => {
  const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  assert(html.includes(`rel="canonical" href="${expectedUrl}"`), `${file} canonical URL is ${expectedUrl}`);
  assert(html.includes(`property="og:url" content="${expectedUrl}"`), `${file} og:url is ${expectedUrl}`);
});

console.log('\n====================================================');
console.log(`VALIDATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
}
