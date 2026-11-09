const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 NovaSkills-Release-Verification' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function verifyLive() {
  console.log('=== VERIFYING LIVE PRODUCTION (https://novaskills.in) ===\n');

  try {
    // 1. Homepage
    console.log('1. Checking Homepage (https://novaskills.in)...');
    const home = await fetchUrl('https://novaskills.in/');
    console.log(`  HTTP Status: ${home.statusCode}`);
    console.log(`  CF-Ray: ${home.headers['cf-ray'] || 'N/A'}`);
    console.log(`  Hero USP Column 1: ${home.body.includes('02 DAYS') && home.body.includes('FREE DEMO CLASSES') ? '✅ Present' : '❌ Missing'}`);
    console.log(`  Hero USP Column 2: ${home.body.includes('Career-Focused') && home.body.includes('Practical Training') ? '✅ Present' : '❌ Missing'}`);
    console.log(`  Hero USP Column 3: ${home.body.includes('1:1') && home.body.includes('LIVE ONLINE CLASSES') ? '✅ Present' : '❌ Missing'}`);

    // 2. Academy Page (Digital Marketing)
    console.log('\n2. Checking Digital Marketing Academy (https://novaskills.in/academies/digital-marketing/)...');
    const acad = await fetchUrl('https://novaskills.in/academies/digital-marketing/');
    console.log(`  HTTP Status: ${acad.statusCode}`);
    console.log(`  Banner Eyebrow (EXPERIENCE BEFORE YOU ENROLL): ${acad.body.includes('EXPERIENCE BEFORE YOU ENROLL') ? '✅ Present' : '❌ Missing'}`);
    console.log(`  Banner Headline (Explore Your Skills Before You Commit.): ${acad.body.includes('Explore Your Skills Before You Commit.') ? '✅ Present' : '❌ Missing'}`);
    console.log(`  Benefit 01 (2 Days Free Demo Classes): ${acad.body.includes('2 Days Free Demo Classes') ? '✅ Present' : '❌ Missing'}`);
    console.log(`  Benefit 02 (1:1 Live Online Classes): ${acad.body.includes('1:1 Live Online Classes') ? '✅ Present' : '❌ Missing'}`);
    console.log(`  Primary CTA (Book Your Free Demo →): ${acad.body.includes('Book Your Free Demo →') ? '✅ Present' : '❌ Missing'}`);
    console.log(`  Microcopy (Free demo booking • No admission commitment): ${acad.body.includes('Free demo booking • No admission commitment') ? '✅ Present' : '❌ Missing'}`);

    // 3. AI Academy
    console.log('\n3. Checking AI Academy (https://novaskills.in/academies/ai/)...');
    const aiAcad = await fetchUrl('https://novaskills.in/academies/ai/');
    console.log(`  HTTP Status: ${aiAcad.statusCode}`);
    console.log(`  Banner Headline: ${aiAcad.body.includes('Explore Your Skills Before You Commit.') ? '✅ Present' : '❌ Missing'}`);
    console.log(`  Microcopy: ${aiAcad.body.includes('Free demo booking • No admission commitment') ? '✅ Present' : '❌ Missing'}`);

    // 4. Course Detail Page (archviz-mastery)
    console.log('\n4. Checking Course Detail (https://novaskills.in/course-detail.html?id=archviz-mastery)...');
    const course = await fetchUrl('https://novaskills.in/course-detail.html?id=archviz-mastery');
    console.log(`  HTTP Status: ${course.statusCode}`);
    console.log(`  Demo Benefit Box: ${course.body.includes('detail-demo-benefit-box') ? '✅ Present' : '❌ Missing'}`);
    console.log(`  Book Your Free Demo CTA: ${course.body.includes('Book Your Free Demo') ? '✅ Present' : '❌ Missing'}`);

    console.log('\n✅ Live production verification checks complete.');
  } catch (err) {
    console.error('Error during live production verification:', err);
  }
}

verifyLive();
