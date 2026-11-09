const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NovaBaselineQA' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, len: data.length }));
    }).on('error', reject);
  });
}

async function verifyBaselines() {
  console.log('=== BASELINE VERIFICATION AUDIT ===');
  const urls = [
    'https://novaskills.in/',
    'https://novaskills.in/courses',
    'https://novaskills.in/academies/digital-marketing/',
    'https://novaskills.in/academies/ai/',
    'https://novaskills.in/academies/no-code-web/',
    'https://novaskills.in/course-detail.html?id=2',
    'https://novaskills.in/course-detail.html?id=dm-mastery',
    'https://novaskills.in/sitemap.xml'
  ];

  for (const u of urls) {
    const res = await fetch(u);
    console.log(`[HTTP ${res.status}] ${u} (${res.len} bytes, cf-ray: ${res.headers['cf-ray']})`);
  }
}

verifyBaselines();
