const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('================================================================');
console.log('  VERIFYING TARGETED WEBSITE CORRECTIONS (TASK 01 & TASK 02)');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    -> ${err.message}`);
    failCount++;
  }
}

// SUITE 1: TASK 01 - Header & Footer Navigation
console.log('[SUITE 1] Task 01: Header and Footer Navigation Verification');

const componentsJs = fs.readFileSync('components.js', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const componentsMinJs = fs.readFileSync('js/components.min.js', 'utf8');

test('components.js getCurrentPage() detects /branches as locations', () => {
  assert(componentsJs.includes("if (path.includes('/branches')) return 'locations';"), 'Route detection for /branches missing');
});

test('components.js header nav contains Learning Locations link to /branches/', () => {
  assert(componentsJs.includes('<li><a href="/branches/" class="${activeClass(\'locations\')}"'), 'Learning Locations link missing in components.js header');
  // Verify order: after Courses (mega menu) and before AI Career Advisor
  const coursesIdx = componentsJs.indexOf('<!-- 2. COURSES (MEGA MENU) -->');
  const locIdx = componentsJs.indexOf('<!-- 2b. LEARNING LOCATIONS -->');
  const aiIdx = componentsJs.indexOf('<!-- 3. ✨ AI CAREER ADVISOR -->');
  assert(coursesIdx !== -1 && locIdx !== -1 && aiIdx !== -1, 'All nav items must exist');
  assert(coursesIdx < locIdx && locIdx < aiIdx, 'Learning Locations must be immediately after Courses and before AI Career Advisor');
});

test('components.js footer contains Learning Locations under Quick Links', () => {
  const quickLinksIdx = componentsJs.indexOf('<h3 class="footer-heading">Quick Links</h3>');
  const locFooterIdx = componentsJs.indexOf('<li><a href="/branches/">Learning Locations</a></li>', quickLinksIdx);
  assert(locFooterIdx !== -1, 'Learning Locations link missing in components.js footer');
});

test('index.html header nav contains Learning Locations link to /branches/', () => {
  assert(indexHtml.includes('<li><a href="/branches/" class="nav-link">Learning Locations</a></li>'), 'Learning Locations link missing in index.html header');
  const coursesIdx = indexHtml.indexOf('<!-- 2. COURSES (MEGA MENU) -->');
  const locIdx = indexHtml.indexOf('<!-- 2b. LEARNING LOCATIONS -->');
  const aiIdx = indexHtml.indexOf('<!-- 3. ✨ AI CAREER ADVISOR -->');
  assert(coursesIdx < locIdx && locIdx < aiIdx, 'In index.html, Learning Locations must be after Courses and before AI Career Advisor');
});

test('index.html footer contains Learning Locations under Quick Links', () => {
  const quickLinksIdx = indexHtml.indexOf('<h3 class="footer-heading">Quick Links</h3>');
  const locFooterIdx = indexHtml.indexOf('<li><a href="/branches/">Learning Locations</a></li>', quickLinksIdx);
  assert(locFooterIdx !== -1, 'Learning Locations link missing in index.html footer');
});

test('js/components.min.js includes Learning Locations', () => {
  assert(componentsMinJs.includes('/branches/'), 'js/components.min.js missing /branches/');
  assert(componentsMinJs.includes('Learning Locations'), 'js/components.min.js missing Learning Locations');
});

// SUITE 2: TASK 02 - Removal of "Live Projects" Statistic Across All 36 City Pages
console.log('\n[SUITE 2] Task 02: 36 City Pages Statistic Removal & Layout Verification');

const { getAllLocations } = require('../lib/locations');
const registry = getAllLocations();
assert(registry.length === 36, 'Expected 36 locations in registry');

let total0ProjectsAcross36 = 0;
let totalLiveProjectsAcross36 = 0;

for (const loc of registry) {
  const cityPath = path.join('branches', loc.slug, 'index.html');
  test(`City page [${loc.city}] (${loc.slug}) exists and is valid`, () => {
    assert(fs.existsSync(cityPath), `File does not exist: ${cityPath}`);
    const html = fs.readFileSync(cityPath, 'utf8');

    // Check for "0 Projects"
    const count0Projects = (html.match(/0 Projects/g) || []).length;
    total0ProjectsAcross36 += count0Projects;
    assert.strictEqual(count0Projects, 0, `Found ${count0Projects} occurrences of "0 Projects" in ${cityPath}`);

    // Check for "Live Projects"
    const countLiveProjects = (html.match(/Live Projects/g) || []).length;
    totalLiveProjectsAcross36 += countLiveProjects;
    assert.strictEqual(countLiveProjects, 0, `Found ${countLiveProjects} occurrences of "Live Projects" in ${cityPath}`);

    // Check table headers: must have exactly 5 columns
    const theadMatch = html.match(/<thead>[\s\S]*?<\/thead>/);
    assert(theadMatch, 'Comparison table <thead> not found');
    const thCount = (theadMatch[0].match(/<th\b/g) || []).length;
    assert.strictEqual(thCount, 5, `Expected 5 <th> columns, got ${thCount} in ${cityPath}`);

    // Check all table rows in <tbody>: each row must have exactly 5 <td> cells
    const tbodyMatch = html.match(/<tbody>[\s\S]*?<\/tbody>/);
    assert(tbodyMatch, 'Comparison table <tbody> not found');
    const rowMatches = tbodyMatch[0].match(/<tr>[\s\S]*?<\/tr>/g) || [];
    assert(rowMatches.length >= 6, `Expected at least 6 course rows, got ${rowMatches.length}`);
    for (let r = 0; r < rowMatches.length; r++) {
      const tdCount = (rowMatches[r].match(/<td\b/g) || []).length;
      assert.strictEqual(tdCount, 5, `Row ${r + 1} has ${tdCount} cells instead of 5 in ${cityPath}`);
    }

    // Check that specs-row has no dangling dots or empty elements
    assert(!html.includes('<span>•</span>\n            </div>'), `Dangling bullet in specs-row in ${cityPath}`);
    assert(!html.includes('<span>•</span>\r\n            </div>'), `Dangling bullet in specs-row in ${cityPath}`);

    // Verify legitimate project showcases are preserved (for visual ready cities)
    if (html.includes('class="city-hero-picture"')) {
      assert(html.includes('images/academies/'), `Legitimate hero visual preserved in ${cityPath}`);
    }
  });
}

test('Directory page (branches/index.html) has 0 occurrences of "0 Live Projects"', () => {
  const dirHtml = fs.readFileSync('branches/index.html', 'utf8');
  const count = (dirHtml.match(/0 Live Projects/g) || []).length;
  assert.strictEqual(count, 0, `Found ${count} occurrences of "0 Live Projects" in branches/index.html`);
  assert(!dirHtml.includes('<span>•</span>\n            </div>'), 'Dangling bullet in directory pathway specs');
  assert(!dirHtml.includes('<span>•</span>\r\n            </div>'), 'Dangling bullet in directory pathway specs');
});

// SUITE 3: System Preservation & Integrity Tests
console.log('\n[SUITE 3] System Preservation & Integrity Tests');

test('Physical campus disclosure intact across all 36 city pages', () => {
  for (const loc of registry) {
    const cityPath = path.join('branches', loc.slug, 'index.html');
    const html = fs.readFileSync(cityPath, 'utf8');
    assert(html.includes('Siddharth Nagar'), `Campus disclosure missing in ${cityPath}`);
  }
});

test('Indexing guard (<meta name="robots" content="index, follow" />) intact across all 36 city pages', () => {
  for (const loc of registry) {
    const cityPath = path.join('branches', loc.slug, 'index.html');
    const html = fs.readFileSync(cityPath, 'utf8');
    assert(html.includes('<meta name="robots" content="index, follow" />'), `Robots meta tag missing in ${cityPath}`);
  }
});

console.log('\n================================================================');
console.log(`  VERIFICATION RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
