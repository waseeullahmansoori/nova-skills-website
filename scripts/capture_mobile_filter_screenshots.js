const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 8089;
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'screenshots');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

// 1. Start HTTP Server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '/courses') reqPath = '/courses.html';

  const filePath = path.join(ROOT_DIR, decodeURIComponent(reqPath));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, async () => {
  console.log(`Local QA test server running at http://localhost:${PORT}`);

  try {
    // Helper to capture screenshot via headless Chrome
    function takeScreenshot(url, outputPath, width = 390, height = 844) {
      const cmd = `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${width},${height} --screenshot="${outputPath}" "${url}"`;
      execSync(cmd, { stdio: 'ignore' });
      console.log(`📸 Captured: ${path.basename(outputPath)} (${width}x${height})`);
    }

    // State 1: Mobile default — no filters (390x844)
    takeScreenshot(`http://localhost:${PORT}/courses.html`, path.join(SCREENSHOT_DIR, '01_mobile_default_no_filters.png'), 390, 844);

    // State 2: Mobile with filters selected (via query param ?academy=digital-marketing)
    takeScreenshot(`http://localhost:${PORT}/courses.html?academy=digital-marketing`, path.join(SCREENSHOT_DIR, '02_mobile_filters_selected.png'), 390, 844);

    // State 3: Open filter bottom sheet (via temporary query trigger or simulated open)
    // We can pass a small script or test page that opens the sheet automatically on load
    const tempHtmlPath = path.join(ROOT_DIR, '_temp_sheet_open.html');
    let coursesContent = fs.readFileSync(path.join(ROOT_DIR, 'courses.html'), 'utf8');
    const autoOpenScript = `<script>
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          const btn = document.getElementById('open-mobile-filters');
          if (btn) btn.click();
        }, 300);
      });
    </script>`;
    fs.writeFileSync(tempHtmlPath, coursesContent.replace('</body>', `${autoOpenScript}\n</body>`), 'utf8');
    takeScreenshot(`http://localhost:${PORT}/_temp_sheet_open.html`, path.join(SCREENSHOT_DIR, '03_mobile_bottom_sheet_open.png'), 390, 844);
    fs.unlinkSync(tempHtmlPath);

    // State 4: Mobile sorted results (Price: Low to High)
    const tempSortPath = path.join(ROOT_DIR, '_temp_sort.html');
    const autoSortScript = `<script>
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          const sortSel = document.getElementById('mobile-sort-select');
          if (sortSel) {
            sortSel.value = 'price-asc';
            sortSel.dispatchEvent(new Event('change'));
          }
        }, 300);
      });
    </script>`;
    fs.writeFileSync(tempSortPath, coursesContent.replace('</body>', `${autoSortScript}\n</body>`), 'utf8');
    takeScreenshot(`http://localhost:${PORT}/_temp_sort.html`, path.join(SCREENSHOT_DIR, '04_mobile_sorted_results.png'), 390, 844);
    fs.unlinkSync(tempSortPath);

    // State 5: Zero-results state
    takeScreenshot(`http://localhost:${PORT}/courses.html?search=xyznonexistentterm`, path.join(SCREENSHOT_DIR, '05_mobile_zero_results.png'), 390, 844);

    // State 6: Desktop filters preserved (1280x800)
    takeScreenshot(`http://localhost:${PORT}/courses.html`, path.join(SCREENSHOT_DIR, '06_desktop_filters_preserved.png'), 1280, 800);

    console.log('🎉 All 6 visual verification screenshots captured successfully!');
  } catch (err) {
    console.error('Error taking screenshots:', err.message);
  } finally {
    server.close();
    console.log('Local server stopped.');
  }
});
