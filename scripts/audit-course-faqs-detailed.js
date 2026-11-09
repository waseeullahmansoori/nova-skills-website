const fs = require('fs');
const path = require('path');

const masterMapping = require('./Nova_Skills_109_Course_Master_Mapping.json');
const mappingById = new Map();
masterMapping.courses.forEach(m => mappingById.set(m.stable_id, m));

const coursesDir = path.join(__dirname, '..', 'data', 'courses');
const files = fs.readdirSync(coursesDir).filter(f => f.endsWith('.json'));

let totalFaqDiscrepancies = 0;
const report = [];

files.forEach(file => {
  const courseId = file.replace('.json', '');
  const m = mappingById.get(courseId);
  if (!m) return;

  const data = JSON.parse(fs.readFileSync(path.join(coursesDir, file), 'utf8'));
  const faqs = data.faqs || data.faq || [];

  faqs.forEach((faq, idx) => {
    const q = (faq.q || faq.question || '');
    const a = (faq.a || faq.answer || '');
    const full = q + ' ' + a;

    // Check if FAQ mentions fee or price or tuition
    if (full.toLowerCase().includes('fee') || full.toLowerCase().includes('tuition') || full.includes('₹') || full.toLowerCase().includes('inr')) {
      const regFormatted = m.regular_fee.toLocaleString('en-IN');
      const launchFormatted = m.offer_active ? m.launch_fee.toLocaleString('en-IN') : null;

      const mentionsReg = full.includes(regFormatted) || full.includes(String(m.regular_fee));
      const mentionsLaunch = launchFormatted ? (full.includes(launchFormatted) || full.includes(String(m.launch_fee))) : false;

      // Also check for any mention of old comparison prices (e.g. 84,999)
      const hasOldOutdatedNumber = full.includes('84,999') || full.includes('84999');

      if (hasOldOutdatedNumber) {
        totalFaqDiscrepancies++;
        report.push({
          courseId,
          courseNo: m.course_number,
          reason: 'OUTDATED_COMPARISON_84999',
          offerActive: m.offer_active,
          regFee: m.regular_fee,
          launchFee: m.launch_fee,
          faqIndex: idx,
          question: q,
          answer: a
        });
        return;
      }

      if (m.offer_active) {
        // If course has active launch offer, but FAQ only mentions regular price or doesn't mention launch fee
        // Check if question is asking about fee/tuition/cost
        if ((q.toLowerCase().includes('fee') || q.toLowerCase().includes('cost') || q.toLowerCase().includes('price') || q.toLowerCase().includes('tuition')) && !mentionsLaunch) {
          totalFaqDiscrepancies++;
          report.push({
            courseId,
            courseNo: m.course_number,
            reason: 'OFFER_ACTIVE_BUT_NO_LAUNCH_FEE_IN_FAQ',
            offerActive: true,
            regFee: m.regular_fee,
            launchFee: m.launch_fee,
            faqIndex: idx,
            question: q,
            answer: a
          });
        }
      } else {
        // Non-discounted course: If question asks about fee/cost/tuition, does answer mention wrong price?
        if (q.toLowerCase().includes('fee') || q.toLowerCase().includes('cost') || q.toLowerCase().includes('price') || q.toLowerCase().includes('tuition')) {
          if (!mentionsReg) {
            totalFaqDiscrepancies++;
            report.push({
              courseId,
              courseNo: m.course_number,
              reason: 'REGULAR_COURSE_NO_MATCH_REG_FEE',
              offerActive: false,
              regFee: m.regular_fee,
              launchFee: null,
              faqIndex: idx,
              question: q,
              answer: a
            });
          }
        }
      }
    }
  });
});

console.log(`Total FAQ price discrepancies found: ${totalFaqDiscrepancies}`);
report.forEach(r => {
  console.log(`\n[Course #${r.courseNo} ${r.courseId}] (${r.reason} | Reg: ${r.regFee}, Launch: ${r.launchFee}) FAQ #${r.faqIndex + 1}:`);
  console.log(`  Q: ${r.question}`);
  console.log(`  A: ${r.answer}`);
});
