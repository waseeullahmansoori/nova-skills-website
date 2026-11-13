const fs = require('fs');
const content = fs.readFileSync('components.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<footer') || l.includes('footer class=')) console.log((i+1) + ':', l.slice(0, 80));
});
