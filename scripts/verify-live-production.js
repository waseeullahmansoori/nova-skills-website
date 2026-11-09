const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NovaSkillsVerification/1.0',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
    req.end();
  });
}

async function verifyLive() {
  console.log('=== NOVA SKILLS PHASE 09 LIVE PRODUCTION VERIFICATION ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);

  const urlsToTest = [
    { type: 'sitemap', url: 'https://novaskills.in/sitemap.xml' },
    { type: 'directory', url: 'https://novaskills.in/branches/' },
    { type: 'city_p1', url: 'https://novaskills.in/branches/indore/' },
    { type: 'city_p1', url: 'https://novaskills.in/branches/surat/' },
    { type: 'city_p2', url: 'https://novaskills.in/branches/vadodara/' },
    { type: 'city_p2', url: 'https://novaskills.in/branches/ludhiana/' },
    { type: 'city_p3', url: 'https://novaskills.in/branches/muzaffarpur/' },
    { type: 'city_p3', url: 'https://novaskills.in/branches/leh/' },
    { type: 'baseline_home', url: 'https://novaskills.in/' },
    { type: 'baseline_courses', url: 'https://novaskills.in/courses.html' },
    { type: 'baseline_academy', url: 'https://novaskills.in/academies/digital-marketing/' }
  ];

  const results = [];

  for (const item of urlsToTest) {
    try {
      const res = await fetchUrl(item.url);
      const is200 = res.statusCode === 200;
      let checkDetails = '';

      if (item.type === 'sitemap') {
        const urlMatches = (res.body.match(/<loc>/g) || []).length;
        const hasBranches = res.body.includes('https://novaskills.in/branches/');
        const hasIndore = res.body.includes('https://novaskills.in/branches/indore/');
        checkDetails = `URLs found: ${urlMatches}, hasBranches: ${hasBranches}, hasIndore: ${hasIndore}`;
      } else if (item.type === 'directory') {
        const hasRobots = res.body.includes('content="index, follow"');
        const has36 = res.body.includes('36');
        const hasCards = (res.body.match(/class="branch-card/g) || []).length;
        checkDetails = `index/follow: ${hasRobots}, 36 mentioned: ${has36}, cards rendered: ${hasCards}`;
      } else if (item.type.startsWith('city_')) {
        const hasRobots = res.body.includes('content="index, follow"');
        const hasSchema = res.body.includes('application/ld+json');
        const hasDemoModal = res.body.includes('demoModal') || res.body.includes('free_demo');
        const hasConsultation = res.body.includes('openConsultationPopup') || res.body.includes('free_consultation');
        checkDetails = `index/follow: ${hasRobots}, schema: ${hasSchema}, demoModal: ${hasDemoModal}, consult: ${hasConsultation}`;
      } else if (item.type.startsWith('baseline_')) {
        checkDetails = `Content length: ${res.body.length} bytes`;
      }

      console.log(`[HTTP ${res.statusCode}] ${item.url} -> ${checkDetails} (cf-ray: ${res.headers['cf-ray'] || 'n/a'})`);
      results.push({ ...item, statusCode: res.statusCode, checkDetails, headers: res.headers });
    } catch (err) {
      console.error(`[ERROR] ${item.url}: ${err.message}`);
      results.push({ ...item, statusCode: 0, error: err.message });
    }
  }

  return results;
}

verifyLive();
