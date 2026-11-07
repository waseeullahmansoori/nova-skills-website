const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

console.log('=== VERIFYING 109-COURSE MASTER SYNCHRONIZATION ===\n');

// 1. Load data.js
const dataJs = fs.readFileSync(path.join(rootDir, 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

if (!Array.isArray(NS_COURSES) || NS_COURSES.length !== 109) {
  console.error(`❌ Expected 109 courses in data.js, found ${NS_COURSES?.length}`);
  process.exit(1);
}

// 2. Load mapping
const mappingPath = path.join(rootDir, 'scripts', 'Nova_Skills_109_Course_Master_Mapping.json');
const mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
const mapping = Array.isArray(mappingData) ? mappingData : mappingData.courses;

if (!Array.isArray(mapping) || mapping.length !== 109) {
  console.error(`❌ Expected 109 courses in mapping, found ${mapping?.length}`);
  process.exit(1);
}
console.log(`✅ Loaded ${mapping.length} master courses from mapping`);

// 3. Verify Course #15
const c15 = NS_COURSES.find(c => c.id === 'nocode-web-pro');
if (!c15) {
  console.error('❌ Course #15 (nocode-web-pro) not found in NS_COURSES');
  process.exit(1);
}

if (c15.price !== 19900 || c15.originalPrice !== 19900 || c15.fee !== 19900) {
  console.error(`❌ Course #15 price mismatch: price=${c15.price}, originalPrice=${c15.originalPrice}, fee=${c15.fee}`);
  process.exit(1);
}
console.log('✅ Course #15 (nocode-web-pro) verified at ₹19,900 (USER_CONFIRMED_2026-11-07)');

// 4. Verify all 109 courses have zero fake discount
let fakeDiscountCount = 0;
NS_COURSES.forEach(c => {
  if (c.originalPrice && c.originalPrice < c.price) {
    console.error(`❌ Inverted discount on ${c.id}: originalPrice ${c.originalPrice} < price ${c.price}`);
    fakeDiscountCount++;
  }
  if (c.discount === 0 && c.originalPrice !== c.price) {
    console.error(`❌ Fake strikethrough on ${c.id}: discount is 0 but originalPrice (${c.originalPrice}) !== price (${c.price})`);
    fakeDiscountCount++;
  }
});

if (fakeDiscountCount > 0) {
  console.error(`❌ Found ${fakeDiscountCount} fake discount violations!`);
  process.exit(1);
}
console.log('✅ All 109 courses verified for strict zero fake discount compliance');

// 5. Verify courses.html
const coursesHtml = fs.readFileSync(path.join(rootDir, 'courses.html'), 'utf8');
if (!coursesHtml.includes('₹19,900') || !coursesHtml.includes('nocode-web-pro')) {
  console.error('❌ courses.html does not contain ₹19,900 for nocode-web-pro');
  process.exit(1);
}
console.log('✅ courses.html verified with ₹19,900 for nocode-web-pro');

// 6. Verify components.js and components.min.js
const compJs = fs.readFileSync(path.join(rootDir, 'components.js'), 'utf8');
const compMinJs = fs.readFileSync(path.join(rootDir, 'js', 'components.min.js'), 'utf8');
if (!compJs.includes("'No-Code Website Professional': { academy: 'No-Code Web Academy', duration: '3 Months', fee: '₹19,900', category: 'no-code' }")) {
  console.error('❌ components.js missing ₹19,900 entry for No-Code Website Professional');
  process.exit(1);
}
if (!compMinJs.includes('₹19,900')) {
  console.error('❌ js/components.min.js missing ₹19,900');
  process.exit(1);
}
console.log('✅ components.js and js/components.min.js verified');

console.log('\n🎉 ALL 109-COURSE MASTER SYNCHRONIZATION CHECKS PASSED (0 FAILURES)!');
