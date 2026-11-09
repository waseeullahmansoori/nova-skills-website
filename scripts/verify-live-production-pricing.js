const https = require('https');
const { execSync } = require('child_process');

function fetchLive(urlPath) {
  try {
    const url = `https://novaskills.in${urlPath}`;
    const out = execSync(`curl.exe -s -L "${url}"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return out;
  } catch(e) {
    console.error(`Error fetching ${urlPath}:`, e.message);
    return '';
  }
}

async function verifyLive() {
  console.log('================================================================');
  console.log('🌐 LIVE PRODUCTION POST-DEPLOYMENT VERIFICATION: https://novaskills.in');
  console.log('================================================================\n');

  let checksPassed = 0;
  let checksFailed = 0;

  function assertLive(desc, condition, errInfo = '') {
    if (condition) {
      checksPassed++;
      console.log(`  ✅ [PASS] ${desc}`);
    } else {
      checksFailed++;
      console.error(`  ❌ [FAIL] ${desc} — ${errInfo}`);
    }
  }

  // 1. Homepage
  console.log('Testing Live Homepage (https://novaskills.in/)...');
  const homeHtml = fetchLive('/');
  assertLive('Homepage served HTTP response', homeHtml.length > 50000, `Length: ${homeHtml.length}`);
  assertLive('Homepage has updated data.min.js?v=2.6.0 cache query string', homeHtml.includes('data.min.js?v=2.6.0'));
  assertLive('Homepage Card 2 (ai-mastery) has effective price ₹64,900', homeHtml.includes('openEnrollmentModal(\'AI Solutions Engineering & Agentic AI Mastery\', \'AI & Automation Academy\', \'9 Months\', \'₹64,900\', \'ai-mastery\')'));
  assertLive('Homepage Card 2 (ai-mastery) has single original price ₹89,900 and 28% OFF', homeHtml.includes('₹64,900</span>\n                    <span class="price-original">₹89,900</span>\n                    <span class="price-off">28% OFF</span>') || homeHtml.includes('price-original">₹89,900</span>'));
  assertLive('Homepage Card 4 (creative-design) has effective price ₹44,900', homeHtml.includes('openEnrollmentModal(\'Creative Design Master\', \'Design Academy\', \'8 Months\', \'₹44,900\', \'creative-design\')'));
  assertLive('Homepage Card 5 has correct href ai-integrated-video-editing-motion-graphics-professional', homeHtml.includes('href="/course-detail.html?id=ai-integrated-video-editing-motion-graphics-professional"'));
  assertLive('Homepage Card 6 (dm-mastery) has effective launch price ₹34,900', homeHtml.includes('openEnrollmentModal(\'AI Digital Marketing Strategist\', \'Digital Marketing Academy\', \'6 Months\', \'₹34,900\', \'dm-mastery\')'));
  assertLive('Homepage has zero 84,999 references', !homeHtml.includes('84,999') && !homeHtml.includes('84999'));

  // 2. Full Stack Programming Foundation
  console.log('\nTesting Live Full Stack Programming Foundation (/course-detail.html?id=fullstack-foundation)...');
  const fsHtml = fetchLive('/course-detail.html?id=fullstack-foundation');
  assertLive('Full Stack CDP served HTTP response', fsHtml.length > 50000);
  assertLive('Full Stack CDP has effective price ₹29,999', fsHtml.includes('₹29,999'));
  assertLive('Full Stack CDP has original comparison fee ₹39,999', fsHtml.includes('₹39,999'));
  assertLive('Full Stack CDP has zero 84,999 references', !fsHtml.includes('84,999') && !fsHtml.includes('84999'));

  // 3. AI Digital Marketing Strategist (dm-mastery)
  console.log('\nTesting Live AI Digital Marketing Strategist (/course-detail.html?id=dm-mastery)...');
  const dmMastHtml = fetchLive('/course-detail.html?id=dm-mastery');
  assertLive('dm-mastery CDP served HTTP response', dmMastHtml.length > 50000);
  assertLive('dm-mastery CDP has effective price ₹34,900 in sidebar', dmMastHtml.includes('₹34,900'));
  assertLive('dm-mastery CDP has regular fee ₹44,900 in sidebar', dmMastHtml.includes('₹44,900'));
  assertLive('dm-mastery FAQ mentions both approved regular fee (₹44,900) and launch fee (₹34,900)', dmMastHtml.includes('₹34,900') && dmMastHtml.includes('₹44,900'));

  // 4. No-Code Website Professional (nocode-web-pro) - Course #15
  console.log('\nTesting Live No-Code Website Professional (/course-detail.html?id=nocode-web-pro)...');
  const ncHtml = fetchLive('/course-detail.html?id=nocode-web-pro');
  assertLive('nocode-web-pro CDP served HTTP response', ncHtml.length > 50000);
  assertLive('nocode-web-pro has flat price ₹19,900', ncHtml.includes('₹19,900'));
  assertLive('nocode-web-pro has NO discount badge', !ncHtml.includes('class="detail-discount-badge"'));

  // 5. Courses Catalogue (/courses)
  console.log('\nTesting Live Courses Catalogue (/courses)...');
  const coursesHtml = fetchLive('/courses');
  assertLive('courses.html served HTTP response', coursesHtml.length > 50000);
  assertLive('courses.html has updated data.min.js?v=2.6.0 cache query string', coursesHtml.includes('data.min.js?v=2.6.0'));
  assertLive('courses.html contains launch fee ₹29,999', coursesHtml.includes('₹29,999'));
  assertLive('courses.html contains launch fee ₹64,900', coursesHtml.includes('₹64,900'));
  assertLive('courses.html contains launch fee ₹34,900', coursesHtml.includes('₹34,900'));
  assertLive('courses.html has zero 84,999 references', !coursesHtml.includes('84,999') && !coursesHtml.includes('84999'));

  console.log('\n================================================================');
  console.log(`LIVE PRODUCTION RESULTS: ${checksPassed} PASSED | ${checksFailed} FAILED`);
  console.log('================================================================');

  if (checksFailed > 0) {
    process.exit(1);
  }
}

verifyLive().catch(console.error);
