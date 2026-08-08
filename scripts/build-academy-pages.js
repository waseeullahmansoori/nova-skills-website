/**
 * Build Static SEO HTML Pages for all 12 Academy Directory Routes
 * Nova Skills V1.1 Phase A4
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const dataJs = fs.readFileSync(path.join(rootDir, 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

console.log('Generating static SEO HTML files for 12 academies...');

NS_ACADEMIES.forEach(acad => {
  const slug = acad.slug;
  const canonicalUrl = `https://novaskills.in/academies/${slug}/`;
  const pageTitle = `${acad.name} — Nova Skills Education Institute`;
  const metaDesc = `Master ${acad.name} with 100% practical training, live client projects, ISO certification & placement support at Nova Skills Institute.`;
  const ogImage = `https://novaskills.in/public/images/seo/og-banner.png?v=2026`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:site_name" content="Nova Skills">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">

  <!-- Preload Fonts -->
  <link rel="preload" href="/public/fonts/PlusJakartaSans-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/public/fonts/Inter-400.woff2" as="font" type="font/woff2" crossorigin>

  <style>
    :root {
      --navy: #011731;
      --teal: #0599a8;
      --green: #75d766;
    }
    body {
      margin: 0;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #f8fafc;
      color: #011731;
    }
    .academy-hero-section {
      background: linear-gradient(135deg, #011731 0%, #0599a8 100%);
      color: white;
      padding: 60px 0 80px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .breadcrumb {
      display: flex;
      gap: 8px;
      font-size: 0.9rem;
      color: rgba(255,255,255,0.7);
      margin-bottom: 24px;
    }
    .breadcrumb a {
      color: rgba(255,255,255,0.9);
      text-decoration: none;
    }
    .academy-hero-title {
      font-size: clamp(2.2rem, 4vw, 3.5rem);
      font-weight: 800;
      margin: 0 0 16px;
    }
    .academy-hero-desc {
      font-size: 1.15rem;
      max-width: 720px;
      line-height: 1.6;
      color: rgba(255,255,255,0.9);
      margin-bottom: 28px;
    }
    .academy-stats-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 32px;
    }
    .stats-pill {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      border: none;
      cursor: pointer;
    }
    .btn-primary {
      background: #75d766;
      color: #011731;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid currentColor;
    }
  </style>

  <link rel="stylesheet" href="/css/styles.min.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/css/styles.min.css"></noscript>
</head>
<body>

  <!-- Header Slot -->
  <div id="ns-header"></div>

  <!-- Main Content -->
  <main id="main-content">
    
    <!-- Hero Banner Section -->
    <section id="academy-hero-section" class="academy-hero-section">
      <div class="container">
        <!-- Breadcrumb Navigation -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <a href="/courses.html">Academies</a>
          <span>›</span>
          <span id="breadcrumb-selected-academy" style="color:white;">${acad.name}</span>
        </nav>

        <!-- Hero Content -->
        <div id="academy-icon-display" class="academy-icon-badge" style="font-size: 3rem; margin-bottom: 12px;">${acad.icon || '🎓'}</div>
        <h1 id="academy-name-display" class="academy-hero-title">${acad.name}</h1>
        <p id="academy-desc-display" class="academy-hero-desc">
          ${acad.description}
        </p>

        <!-- Dynamic Stats Pills -->
        <div class="academy-stats-pills" id="academy-stats-pills">
          <span id="stat-career-programs" class="stats-pill">💼 Career Programs: Loading...</span>
          <span id="stat-pro-programs" class="stats-pill">⚡ Professional Programs: Loading...</span>
          <span id="stat-cert-courses" class="stats-pill">📜 Certification Courses: Loading...</span>
          <span id="stat-total-courses" class="stats-pill">📚 Total Courses: Loading...</span>
        </div>

        <!-- Action CTAs -->
        <div class="academy-actions" style="display:flex; gap:12px; flex-wrap:wrap;">
          <button id="btn-enroll-now" class="btn btn-primary btn-lg">Enroll Now →</button>
          <button id="btn-free-consultation" class="btn btn-outline btn-lg" style="color:white; border-color:rgba(255,255,255,0.4);">Free Consultation</button>
        </div>
      </div>
    </section>

    <!-- Dynamic Academy Program & Course Sections Container -->
    <div id="academy-sections-container"></div>

    <!-- 404 Academy Not Found Section -->
    <section id="academy-404-container" class="academy-404-container" style="display:none;">
      <div class="container">
        <div style="background:white; padding:48px; border-radius:24px; text-align:center;">
          <div style="font-size:3.5rem; margin-bottom:16px;">⚠️</div>
          <h2 style="font-size:2rem; font-weight:800; color:#011731; margin-bottom:12px;">404 — Academy Not Found</h2>
          <p style="color:#64748b; font-size:1.05rem; margin-bottom:24px;">
            The academy page you requested does not exist or may have been renamed.
          </p>
          <div style="display:flex; justify-content:center; gap:12px;">
            <a href="/" class="btn btn-primary">Return Home →</a>
            <a href="/courses.html" class="btn btn-outline">Explore All Academies</a>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- Footer Slot -->
  <div id="ns-footer"></div>

  <!-- JavaScript Bundles -->
  <script src="/js/data.min.js" defer></script>
  <script src="/js/components.min.js" defer></script>
  <script src="/nova-ai-widget.js?v=3.0" defer></script>
  <script src="/academy-detail.js" defer></script>
</body>
</html>
`;

  const targetDir = path.join(rootDir, 'academies', slug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, htmlContent, 'utf8');
  console.log(`✅ Generated customized static SEO page: ${slug}/index.html`);
});

// Update master template academies/index.html
const masterFile = path.join(rootDir, 'academies', 'index.html');
fs.copyFileSync(path.join(rootDir, 'academies', 'digital-marketing', 'index.html'), masterFile);
console.log('✅ Updated master template academies/index.html');
