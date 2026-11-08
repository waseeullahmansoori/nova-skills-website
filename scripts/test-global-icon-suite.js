const fs = require('fs');
const path = require('path');

console.log('=== STARTING GLOBAL ICON & CHARACTER RENDERING TEST SUITE ===\n');

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

// 1. Check index.html Feature Cards
console.log('--- 1. Testing Homepage Feature Cards (Why Highlights) ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');

// Check Card 1: Target / Bullseye
assert(
  /<div class="highlight-item">[\s\S]*?<circle cx="12" cy="12" r="10"><\/circle>[\s\S]*?Industry Relevant Curriculum/i.test(indexHtml),
  'Card 1 (Industry Relevant Curriculum) displays Bullseye / Target SVG'
);

// Check Card 2: Zap / Lightning
assert(
  /<div class="highlight-item">[\s\S]*?<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"><\/polygon>[\s\S]*?Fast-Track Learning/i.test(indexHtml),
  'Card 2 (Fast-Track Learning) displays Lightning / Zap SVG'
);

// Check Card 3: Monitor / Laptop
assert(
  /<div class="highlight-item">[\s\S]*?<rect x="2" y="3" width="20" height="14" rx="2" ry="2"><\/rect>[\s\S]*?Online & Offline Options/i.test(indexHtml),
  'Card 3 (Online & Offline Options) displays Monitor / Laptop SVG'
);

// Check Card 4: Users / Community
assert(
  /<div class="highlight-item">[\s\S]*?<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"><\/path>[\s\S]*?Lifetime Community Access/i.test(indexHtml),
  'Card 4 (Lifetime Community Access) displays Users / Community SVG'
);

// Check that no corrupted characters remain in Why Highlights
const whyHighlightsIdx = indexHtml.indexOf('<div class="why-highlights">');
const whyHighlightsEnd = indexHtml.indexOf('</div>\n          </div>\n        </div>\n      </div>\n    </section>', whyHighlightsIdx);
const whyHighlightsChunk = indexHtml.substring(whyHighlightsIdx, whyHighlightsIdx + 3000);

assert(
  !/š¡|Œ|’¬|“š|›\u00A0|†|\uFFFD|dYZ_|dYs\?/.test(whyHighlightsChunk),
  'Why Highlights contains ZERO corrupted characters or mojibake'
);

// Check highlight items count
const highlightItems = indexHtml.match(/<div class="highlight-item">/g) || [];
assert(highlightItems.length === 4, `Why Highlights contains exactly 4 feature cards (got ${highlightItems.length})`);

// 2. Check Learning Journey Steps
console.log('\n--- 2. Testing Learning Journey Steps ---');
const journeyMatch = indexHtml.match(/<div class="journey-steps">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/);
assert(
  journeyMatch && !/š¡|Œ|’¬|“š|›\u00A0|†|\uFFFD|dYZ_|dYs\?/.test(journeyMatch[1]),
  'Learning Journey contains ZERO corrupted characters or mojibake'
);
const journeySvgs = journeyMatch ? (journeyMatch[1].match(/<svg/g) || []).length : 0;
assert(journeySvgs === 5, `Learning Journey contains exactly 5 vector SVGs (got ${journeySvgs})`);

// 3. Check Hero Floating Cards
console.log('\n--- 3. Testing Hero Floating Cards ---');
assert(
  !/<div class="card-icon">[^<]*[š¡Œ’¬“š›†\uFFFD]/.test(indexHtml),
  'Hero Floating Cards contain ZERO corrupted glyphs'
);
assert(
  /Learn Your Way — Anytime, Anywhere/.test(indexHtml),
  'Hero Floating Card 3 subtext has proper em-dash'
);

// 4. Check Trust Section
console.log('\n--- 4. Testing Trust Section ---');
const trustMatch = indexHtml.match(/<div class="trust-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/);
assert(
  trustMatch && !/š¡|Œ|’¬|“š|›\u00A0|†|\uFFFD|dYZ_|dYs\?/.test(trustMatch[1]),
  'Trust section contains ZERO corrupted characters'
);
const trustSvgs = trustMatch ? (trustMatch[1].match(/<svg/g) || []).length : 0;
assert(trustSvgs === 6, `Trust section contains exactly 6 vector SVGs (got ${trustSvgs})`);

// 5. Check Footer Contact Section
console.log('\n--- 5. Testing Footer Contact Section ---');
const footerContactMatch = indexHtml.match(/<div class="footer-contact">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);
assert(
  footerContactMatch && !/š¡|Œ|’¬|“š|›\u00A0|†|\uFFFD|dYZ_|dYs\?/.test(footerContactMatch[1]),
  'Footer Contact section contains ZERO corrupted characters'
);
const contactSvgs = footerContactMatch ? (footerContactMatch[1].match(/<svg/g) || []).length : 0;
assert(contactSvgs === 3, `Footer Contact section contains exactly 3 vector SVGs (got ${contactSvgs})`);

// 6. Check CSS Architecture & Responsive Rules
console.log('\n--- 6. Testing CSS Architecture (styles.css & css/main.css) ---');
const stylesCss = fs.readFileSync('styles.css', 'utf8');
const mainCss = fs.readFileSync('css/main.css', 'utf8');
const stylesMinCss = fs.readFileSync('styles.min.css', 'utf8');

assert(
  stylesCss.includes('.highlight-icon svg') && stylesCss.includes('width: 24px') && stylesCss.includes('height: 24px'),
  'styles.css enforces 24x24px dimensions for .highlight-icon svg'
);
assert(
  mainCss.includes('.highlight-icon svg') && mainCss.includes('width: 24px') && mainCss.includes('height: 24px'),
  'css/main.css enforces 24x24px dimensions for .highlight-icon svg'
);
assert(
  stylesMinCss.includes('.highlight-icon svg'),
  'styles.min.css contains .highlight-icon svg rules'
);
assert(
  stylesCss.includes('.step-icon svg') && stylesCss.includes('width: 26px'),
  'styles.css enforces vector dimensions for .step-icon svg'
);
assert(
  stylesCss.includes('.trust-icon svg') && stylesCss.includes('width: 18px'),
  'styles.css enforces vector dimensions for .trust-icon svg'
);
assert(
  stylesCss.includes('.card-icon svg') && stylesCss.includes('width: 22px'),
  'styles.css enforces vector dimensions for .card-icon svg'
);

// 7. Check Global Corpus for Mojibake
console.log('\n--- 7. Testing Global Codebase for Mojibake & Encoding Corruption ---');
const allHtmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let globalCorruptions = 0;

allHtmlFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  if (/š¡|Œ|’¬|“š|›\u00A0|†|\uFFFD|dYZ_|dYs\?/.test(c)) {
    console.error(`Found corruption in ${f}`);
    globalCorruptions++;
  }
});
assert(globalCorruptions === 0, `All ${allHtmlFiles.length} root HTML files have ZERO mojibake (got ${globalCorruptions})`);

// 8. Check That Approved Data & Text Remains Preserved
console.log('\n--- 8. Testing Preservation of Approved Text & Course Data ---');
const { NS_COURSES } = require('../data.js');
assert(NS_COURSES.length === 109, `data.js retains all 109 courses (got ${NS_COURSES.length})`);
const course15 = NS_COURSES.find(c => c.id === 'nocode-web-pro' || c.stable_id === 'nocode-web-pro');
assert(course15 && course15.price === 19900, `Course #15 fee preserved at ₹19,900 (got ${course15 ? course15.price : 'null'})`);

// 9. Check That Primary QA Screenshots Exist on Disk
console.log('\n--- 9. Testing QA Screenshots Presence ---');
const expectedShots = [
  '01_homepage_features_mobile_390px.png',
  '02_homepage_features_mobile_320px.png',
  '03_homepage_features_desktop_1280px.png',
  '04_learning_journey_mobile_390px.png',
  '05_hero_floating_cards_mobile.png',
  '06_trust_badges_mobile.png',
  '07_contact_footer_mobile.png',
  '08_course_catalogue_mobile.png',
  '09_academy_page_mobile.png',
  '10_course_detail_mobile.png'
];

let foundShots = 0;
const QA_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777\\icon_fix_qa';
expectedShots.forEach(s => {
  const p = path.join(QA_DIR, s);
  if (fs.existsSync(p) && fs.statSync(p).size > 10000) {
    foundShots++;
  } else {
    console.error(`Missing or empty screenshot: ${s}`);
  }
});
assert(foundShots === 10, `All 10 high-resolution CDP visual QA screenshots exist (got ${foundShots}/10)`);

// Check root artifacts
const rootMobile = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777\\homepage_feature_cards_mobile_390px.png';
const rootDesktop = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777\\homepage_feature_cards_desktop_1280px.png';
assert(fs.existsSync(rootMobile) && fs.statSync(rootMobile).size > 10000, 'Primary mobile artifact exists in artifact root');
assert(fs.existsSync(rootDesktop) && fs.statSync(rootDesktop).size > 10000, 'Primary desktop artifact exists in artifact root');

console.log('\n========================================');
console.log(`TOTAL ICON SUITE TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('========================================\n');

if (failedTests === 0) {
  console.log('🎉 ALL GLOBAL ICON & CHARACTER RENDERING TESTS PASSED (0 FAILURES)!');
  process.exit(0);
} else {
  console.error(`💥 ${failedTests} TESTS FAILED!`);
  process.exit(1);
}
