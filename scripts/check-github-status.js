const https = require('https');

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NovaSkillsReleaseQA' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const commits = await getJson('https://api.github.com/repos/waseeullahmansoori/nova-skills-website/commits?per_page=10');
  for (const c of commits) {
    const runs = await getJson(`https://api.github.com/repos/waseeullahmansoori/nova-skills-website/commits/${c.sha}/check-runs`);
    const runSummary = (runs.check_runs || []).map(r => `${r.name}: status=${r.status}, conclusion=${r.conclusion}`).join(' | ');
    console.log(`${c.sha.slice(0, 7)} - ${c.commit.message.split('\n')[0].slice(0, 50)} -> [${runSummary}]`);
  }
}

run().catch(console.error);
