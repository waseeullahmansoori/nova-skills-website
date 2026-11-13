
function isCourseDemoEligible(course) {
  if (!course) return false;
  if (typeof course.demo_available === 'boolean') return course.demo_available;
  const type = (course.course_type || course.type || course.programLevel || '').toUpperCase();
  if (['MASTER', 'PROFESSIONAL', 'SPECIALIZATION', 'FOUNDATION', 'CAREER'].some(t => type.includes(t))) {
    return true;
  }
  const price = Math.max(
    typeof course.originalPrice === 'number' ? course.originalPrice : 0,
    typeof course.price === 'number' ? course.price : parseInt(String(course.price || '').replace(/\D/g, ''), 10) || 0
  );
  if (price >= 12000) return true;
  return false;
}

function escapeHTML(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build Static Pre-rendered Course Catalog for courses.html
 * 
 * Pre-renders all 109 courses into initial HTML so crawlers without JavaScript
 * (OAI-SearchBot, Googlebot, Perplexity) see full course listings, links, titles,
 * prices, and structured data instead of 0 programs.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const { renderCourseIcon, renderAcademyTagHtml } = require(path.join(ROOT_DIR, 'js', 'icon-system.js'));
const NovaCourseData = require(path.join(ROOT_DIR, 'js', 'course-data.js'));

// 1. Load canonical course data
const PUBLISHED_COURSES = NovaCourseData.getPublishedCourses();
const ACADEMIES = NovaCourseData.getAllAcademies();

if (!Array.isArray(PUBLISHED_COURSES) || PUBLISHED_COURSES.length === 0) {
  console.error('❌ Failed to load canonical courses from NovaCourseData');
  process.exit(1);
}

console.log(`Loaded ${PUBLISHED_COURSES.length} courses from NovaCourseData`);

function renderCourseCardMediaHtml(course, bannerIconHtml, cardIndex = 0) {
  const rec = course && course.images && course.images.card ? course.images.card : null;
  if (!rec) {
    return {
      hasVisualClass: '',
      innerHtml: bannerIconHtml
    };
  }
  const loadingAttr = cardIndex < 3 ? 'eager' : 'lazy';
  return {
    hasVisualClass: ' has-course-visual',
    innerHtml: `<picture class="course-thumb-picture"><source media="(min-width: 768px)" srcset="${escapeHTML(rec.desktop)}" type="${escapeHTML(rec.mimeType || 'image/webp')}" width="${rec.width || 800}" height="${rec.height || 600}" /><img src="${escapeHTML(rec.mobile)}" alt="${escapeHTML(rec.alt || course.name)}" class="course-thumb-img" width="${rec.mobileWidth || 600}" height="${rec.mobileHeight || 450}" loading="${loadingAttr}" decoding="async" /></picture>`
  };
}

function buildCourseCardHTML(course, cardIndex = 0) {
  const courseUrl = NovaCourseData.getCourseDetailUrl(course);
  
  let trackClass = 'track-cert';
  const progLevel = course.programLevel || 'Certification Course';
  if (progLevel.includes('Career')) trackClass = 'track-career';
  else if (progLevel.includes('Professional')) trackClass = 'track-pro';

  const toolsHTML = (course.tools && course.tools.length > 0)
    ? `<div class="course-tools-preview"><span class="tools-label">Key Tools:</span><div class="tools-tag-list">${course.tools.slice(0, 3).map(t => `<span class="tool-tag">${t}</span>`).join(' ')}</div></div>`
    : '';

  const safeName = (course.name || '').replace(/'/g, "\\'");
  const safeAcademy = (course.academy || '').replace(/'/g, "\\'");
  const safeDuration = course.duration || '';
  const safePrice = `₹${(course.price || 0).toLocaleString('en-IN')}`;
  const safeId = course.id;
  const projectLabel = NovaCourseData.getCourseProjectLabel(course);
  const demoEligible = NovaCourseData.isCourseDemoEligible(course);

  const cardMedia = renderCourseCardMediaHtml(course, renderCourseIcon(course.icon || course), cardIndex);
  const hasVisualClass = cardMedia.hasVisualClass;
  const thumbInnerHtml = cardMedia.innerHtml;

  return `
    <div class="course-card" data-category="${course.academyId}">
      ${course.featured ? '<span class="course-hot-tag">🔥 Popular</span>' : ''}
      <div class="course-thumbnail${hasVisualClass}">
        <div class="course-thumb-bg${hasVisualClass}" style="background:${course.color}">
          ${thumbInnerHtml}
        </div>
        <div class="course-badge-overlay">
          <span class="course-level-badge">${course.level}</span>
        </div>
        <div class="course-duration-badge">⏱️ ${course.duration}</div>
      </div>
      <div class="course-body">
        <div class="course-meta-header">
          <div class="course-academy-tag">${renderAcademyTagHtml(course.academyId || course.academy)}</div>
          <span class="course-track-pill ${trackClass}">${progLevel}</span>
        </div>
        <h3 class="course-title"><a href="${courseUrl}">${course.name}</a></h3>
        <p class="course-desc">${course.shortDesc}</p>
        ${toolsHTML}
        <div class="course-features">
          <span class="feature-item">💻 ${projectLabel}</span>
          <span class="feature-item">📜 Verified Certificate</span>
          ${course.placementSupport ? '<span class="feature-item" style="color:var(--green); font-weight:700;">🎯 Placement Support</span>' : '<span class="feature-item">💼 Capstone Portfolio</span>'}
          <span class="feature-item">⭐ ${course.rating} (${course.reviews})</span>
        </div>
        <div class="course-footer course-footer-stack">
          ${demoEligible ? `
          <div class="course-demo-indicator">
            <button type="button" class="course-demo-chip" onclick="if(typeof openDemoModal==='function'){openDemoModal({courseId:'${course.id}', courseName:'${safeName}', academyName:'${safeAcademy}', sourceCta:'catalogue_card_demo'});}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="m9 16 2 2 4-4"></path></svg>
              <span class="demo-chip-text">2-Day Free Demo Available</span>
            </button>
          </div>` : ''}
          <div class="course-pricing course-pricing-row">
            <div>
              <span class="price-current">₹${(course.price || 0).toLocaleString('en-IN')}</span>
              ${(course.originalPrice && course.originalPrice > course.price) ? `<span class="price-original">₹${(course.originalPrice || 0).toLocaleString('en-IN')}</span>` : ''}
            </div>
            ${(course.originalPrice && course.originalPrice > course.price) ? `<span class="price-off">${Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF</span>` : ''}
          </div>
          <div class="course-card-actions">
            <a href="${courseUrl}" class="btn btn-outline btn-sm">View Syllabus</a>
            <button type="button" class="btn btn-primary btn-sm" onclick="openEnrollmentModal('${safeName}', '${safeAcademy}', '${safeDuration}', '${safePrice}', '${safeId}')">Enroll Now →</button>
          </div>
        </div>
      </div>
    </div>`;
}

function generateCatalogSchema(courses) {
  const itemList = courses.map((c, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "item": {
      "@type": "Course",
      "@id": `https://novaskills.in/course-detail.html?id=${c.id}#course`,
      "name": c.name,
      "description": c.shortDesc || c.fullDesc || c.name,
      "url": `https://novaskills.in/course-detail.html?id=${c.id}`,
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Nova Skills Education Institute",
        "url": "https://novaskills.in"
      },
      "offers": {
        "@type": "Offer",
        "price": c.price,
        "priceCurrency": "INR",
        "category": c.programLevel || "Certification Course",
        "availability": "https://schema.org/InStock"
      }
    }
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://novaskills.in/courses#webpage",
        "url": "https://novaskills.in/courses",
        "name": "109+ Job-Oriented Courses Across 12 Academies | Nova Skills",
        "description": "Explore 109+ job-oriented courses across 12 academies at Nova Skills — Digital Marketing, Coding, AI, Design, and Video Editing with placement assistance.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "@id": "https://novaskills.in/courses#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://novaskills.in/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Courses",
              "item": "https://novaskills.in/courses"
            }
          ]
        },
        "mainEntity": {
          "@type": "ItemList",
          "name": "Nova Skills Complete Course Catalog",
          "numberOfItems": courses.length,
          "itemListElement": itemList
        }
      }
    ]
  };

  return `<script type="application/ld+json" id="courses-catalog-jsonld">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

function updateCoursesPage() {
  const coursesPath = path.join(ROOT_DIR, 'courses.html');
  let html = fs.readFileSync(coursesPath, 'utf8');

  // 1. Update canonical & og:url to clean URL
  html = html.replace(/<link rel="canonical" href="[^"]*courses(\.html)?" \/>/g, '<link rel="canonical" href="https://novaskills.in/courses" />');
  html = html.replace(/<meta property="og:url" content="[^"]*courses(\.html)?" \/>/g, '<meta property="og:url" content="https://novaskills.in/courses" />');

  // 2. Update dynamic canonical counts
  html = html.replace(/<strong id="courses-showing-count">\d+<\/strong>/g, `<strong id="courses-showing-count">${PUBLISHED_COURSES.length}</strong>`);
  html = html.replace(/<strong id="mobile-results-number">\d+<\/strong>/g, `<strong id="mobile-results-number">${PUBLISHED_COURSES.length}</strong>`);
  html = html.replace(/<span id="sheet-preview-count">\d+<\/span>/g, `<span id="sheet-preview-count">${PUBLISHED_COURSES.length}</span>`);
  html = html.replace(/<span class="canonical-courses-count">[^<]+<\/span>/g, `<span class="canonical-courses-count">${PUBLISHED_COURSES.length}+</span>`);
  html = html.replace(/<span class="canonical-academies-count">[^<]+<\/span>/g, `<span class="canonical-academies-count">${ACADEMIES.length}</span>`);
  html = html.replace(/All Programs \(\d+\)/g, `All Programs (${PUBLISHED_COURSES.length})`);

  // 3. Inject JSON-LD schema into <head>
  const schemaTag = generateCatalogSchema(PUBLISHED_COURSES);
  if (html.includes('id="courses-catalog-jsonld"')) {
    html = html.replace(/<script type="application\/ld\+json" id="courses-catalog-jsonld">[\s\S]*?<\/script>/, schemaTag);
  } else {
    html = html.replace('</head>', `  ${schemaTag}\n</head>`);
  }

    // 4. Critical CSS injection for Course Card Demo Badge & CSS cache busting
  const badgeCriticalCss = `
.course-demo-indicator{display:block;width:100%;margin:10px 0 8px 0;box-sizing:border-box}
.course-demo-chip{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;background:rgba(5,153,168,0.08)!important;border:1px solid rgba(5,153,168,0.22)!important;border-radius:6px!important;padding:7px 12px!important;font-family:inherit!important;font-size:0.8125rem!important;font-weight:600!important;color:#012B46!important;text-align:left!important;line-height:1.25!important;cursor:pointer;transition:background .15s ease,border-color .15s ease,transform .15s ease;white-space:nowrap!important;text-decoration:none!important}
.course-demo-chip:hover,.course-demo-chip:focus-visible{background:rgba(5,153,168,0.14)!important;border-color:rgba(5,153,168,0.45)!important;color:#012B46!important;outline:none!important}
.course-demo-chip svg{width:15px!important;height:15px!important;min-width:15px!important;min-height:15px!important;max-width:15px!important;max-height:15px!important;color:#0599a8!important;stroke:#0599a8!important;fill:none!important;flex-shrink:0!important;display:block!important}
.course-demo-chip span,.course-demo-chip .demo-chip-text{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#012B46!important;font-weight:600!important}
`;
  if (!html.includes('.course-demo-chip')) {
    html = html.replace('</style>', badgeCriticalCss + '\n</style>');
  }
  html = html.replace(/styles\.min\.css\?v=[0-9.]+/g, 'styles.min.css?v=2.9.0');
  html = html.replace(/data\.min\.js\?v=[0-9.]+/g, 'data.min.js?v=3.1.0');
  html = html.replace(/components\.min\.js\?v=[0-9.]+/g, 'components.min.js?v=3.2.0');
  html = html.replace(/courses\.min\.js\?v=[0-9.]+/g, 'courses.min.js?v=3.1.0');
  html = html.replace(/courses\.js\?v=[0-9.]+/g, 'courses.js?v=3.1.0');

  // 5. Pre-render course cards inside #courses-grid-page
  const cardsHtml = PUBLISHED_COURSES.map((c, idx) => buildCourseCardHTML(c, idx)).join('\n');
  const gridRegex = /<div class="courses-grid-page" id="courses-grid-page">[\s\S]*?(?=\s*<!-- No results container -->)/;
  const replacementGrid = `<div class="courses-grid-page" id="courses-grid-page">\n${cardsHtml}\n        </div>`;

  if (!gridRegex.test(html)) {
    console.error('❌ Could not find <div class="courses-grid-page" id="courses-grid-page"> in courses.html');
    process.exit(1);
  }

  html = html.replace(gridRegex, replacementGrid);
  if (!html.includes('/js/icon-system.js')) {
    html = html.replace('<script src="/js/courses.min.js?v=3.1.0', '<script src="/js/icon-system.js?v=2.2.0" defer></script>\n  <script src="/js/courses.min.js?v=3.1.0');
  }

  fs.writeFileSync(coursesPath, html, 'utf8');
  console.log(`✅ Successfully updated courses.html with ${PUBLISHED_COURSES.length} pre-rendered course cards, clean canonical & CollectionPage schema.`);
}

updateCoursesPage();
