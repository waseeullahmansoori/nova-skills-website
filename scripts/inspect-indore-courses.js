const fs = require('fs');
const html = fs.readFileSync('branches/indore/index.html', 'utf8');
const regex = /href="([^"]*course-detail[^"]*)"/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(m[1]);
}
