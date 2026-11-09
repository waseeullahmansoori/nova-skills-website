const https = require('https');
const locations = require('../lib/locations');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NovaSkillsVerification/1.0',
        'Cache-Control': 'no-cache'
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

async function verifyAll37() {
  console.log('================================================================');
  console.log('NOVA SKILLS: COMPREHENSIVE 37-PAGE LIVE PRODUCTION AUDIT');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('Target Domain: https://novaskills.in');
  console.log('================================================================\n');

  const allLocs = locations.getAllLocations();
  const pagesToTest = [
    { type: 'directory', slug: '', url: 'https://novaskills.in/branches/' },
    ...allLocs.map(l => ({ type: 'city', slug: l.slug, name: l.name, state: l.state, tier: l.tier, priority: l.priority, url: `https://novaskills.in/branches/${l.slug}/` }))
  ];

  let passed = 0;
  let failed = 0;
  const issues = [];
  const auditResults = [];

  for (let i = 0; i < pagesToTest.length; i++) {
    const p = pagesToTest[i];
    try {
      const res = await fetchUrl(p.url);
      const is200 = res.statusCode === 200;
      const body = res.body;

      // Checks
      const hasIndexFollow = /<meta\s+name=["']robots["']\s+content=["'][^"']*index,\s*follow[^"']*["']/i.test(body);
      const hasCanonical = body.includes(`<link rel="canonical" href="${p.url}" />`) || body.includes(`<link rel="canonical" href="${p.url}">`);
      const hasSchema = body.includes('application/ld+json');
      const hasPhysicalCampus = body.includes('Siddharth Nagar') || body.includes('Siddharthnagar');
      const hasCdnRay = Boolean(res.headers['cf-ray']);

      let pageOk = is200 && hasIndexFollow && hasCanonical && hasSchema && hasPhysicalCampus;

      if (p.type === 'city') {
        const hasCourse2 = body.includes('id=dm-professional') || body.includes('id=2');
        const hasCourse7 = body.includes('id=graphic-design-pro') || body.includes('id=7');
        const hasCourse9 = body.includes('id=video-pro') || body.includes('id=9');
        const hasCourse17 = body.includes('id=ai-for-business-pro') || body.includes('id=17');
        const hasAllCompulsory = hasCourse2 && hasCourse7 && hasCourse9 && hasCourse17;
        pageOk = pageOk && hasAllCompulsory;

        if (!hasAllCompulsory) {
          issues.push(`${p.slug}: Missing compulsory courses (c2:${hasCourse2}, c7:${hasCourse7}, c9:${hasCourse9}, c17:${hasCourse17})`);
        }
      }

      if (pageOk) {
        passed++;
        console.log(`[PASS ${i + 1}/37] ${p.url} (200 OK | robots: index,follow | canonical: OK | schema: OK | cf-ray: ${res.headers['cf-ray']})`);
      } else {
        failed++;
        console.log(`[FAIL ${i + 1}/37] ${p.url} (Status: ${res.statusCode}, indexFollow: ${hasIndexFollow}, canonical: ${hasCanonical}, schema: ${hasSchema}, campus: ${hasPhysicalCampus})`);
        issues.push(`${p.url}: Status ${res.statusCode}, indexFollow: ${hasIndexFollow}`);
      }

      auditResults.push({
        url: p.url,
        slug: p.slug || 'directory',
        statusCode: res.statusCode,
        indexFollow: hasIndexFollow,
        canonical: hasCanonical,
        schema: hasSchema,
        physicalCampus: hasPhysicalCampus,
        cfRay: res.headers['cf-ray'],
        pageOk
      });
    } catch (err) {
      failed++;
      console.log(`[ERROR ${i + 1}/37] ${p.url} -> ${err.message}`);
      issues.push(`${p.url}: Error ${err.message}`);
    }
  }

  console.log('\n================================================================');
  console.log(`AUDIT COMPLETE: ${passed} PASSED / ${failed} FAILED (Total: ${pagesToTest.length})`);
  console.log(`Success Rate: ${((passed / pagesToTest.length) * 100).toFixed(1)}%`);
  console.log('================================================================\n');

  if (issues.length > 0) {
    console.log('Issues identified:');
    issues.forEach(iss => console.log(' - ' + iss));
  } else {
    console.log('ALL 37 PRODUCTION ENDPOINTS ARE LIVE, VERIFIED, AND 100% HEALTHY.');
  }

  return { passed, failed, auditResults, issues };
}

verifyAll37();
