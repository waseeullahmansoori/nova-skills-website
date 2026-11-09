const fs = require('fs');
const path = require('path');

const targetFile = process.argv[2] || 'index.html';
const masterMapping = require('./Nova_Skills_109_Course_Master_Mapping.json');
const mappingById = new Map();
masterMapping.courses.forEach(m => mappingById.set(m.stable_id, m));

const html = fs.readFileSync(path.resolve(__dirname, '..', targetFile), 'utf8');
const startIdx = html.indexOf('id="courses"');
const endIdx = html.indexOf('</section>', startIdx);
const section = html.substring(startIdx, endIdx);

const cardRegex = /<article[\s\S]*?<\/article>/g;
const cards = section.match(cardRegex) || [];
console.log(`Inspecting ${targetFile}: Total course cards = ${cards.length}`);

cards.forEach((c, idx) => {
  const titleMatch = c.match(/<h3 class="course-title"><a[^>]*>([^<]+)<\/a><\/h3>/);
  const hrefMatch = c.match(/href="\/course-detail\.html\?id=([^"]+)"/);
  const currentPriceMatch = c.match(/class="price-current">([^<]+)<\/span>/);
  const origPriceMatch = c.match(/class="price-original">([^<]+)<\/span>/g);
  const offMatch = c.match(/class="price-off">([^<]+)<\/span>/g);
  const modalMatch = c.match(/openEnrollmentModal\(([^)]+)\)/);

  const courseId = hrefMatch ? hrefMatch[1] : null;
  const master = courseId ? mappingById.get(courseId) : null;

  console.log(`\nCard ${idx + 1}:`);
  console.log('  Title:', titleMatch ? titleMatch[1] : 'N/A');
  console.log('  Course ID:', courseId);
  console.log('  Current Price in HTML:', currentPriceMatch ? currentPriceMatch[1] : 'N/A');
  console.log('  Original Price in HTML:', origPriceMatch ? origPriceMatch.join(', ') : 'None');
  console.log('  Discount in HTML:', offMatch ? offMatch.join(', ') : 'None');
  console.log('  Modal call in HTML:', modalMatch ? modalMatch[1] : 'None');
  if (master) {
    console.log(`  MASTER: No=${master.course_number}, Regular=${master.regular_fee}, Launch=${master.launch_fee}, Effective=${master.effective_fee}, OfferActive=${master.offer_active}`);
  } else {
    console.log('  MASTER: NOT FOUND in master mapping!');
  }
});
