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

// 1. Load data.js
const dataJs = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

if (!Array.isArray(NS_COURSES) || NS_COURSES.length === 0) {
  console.error('❌ Failed to load NS_COURSES from data.js');
  process.exit(1);
}

console.log(`Loaded ${NS_COURSES.length} courses from data.js`);

function buildCourseCardHTML(course) {
  const courseUrl = `/course-detail.html?id=${course.id}`;
  
  let trackClass = 'track-cert';
  const progLevel = course.programLevel || 'Certification Course';
  if (progLevel.includes('Career')) trackClass = 'track-career';
  else if (progLevel.includes('Professional')) trackClass = 'track-pro';

  const toolsHTML = (course.tools && course.tools.length > 0)
    ? `<div class="course-tools-preview"><span class="tools-label">Key Tools:</span> ${course.tools.slice(0, 3).map(t => `<span class="tool-tag">${t}</span>`).join('')}</div>`
    : '';

  const safeName = (course.name || '').replace(/'/g, "\\'");
  const safeAcademy = (course.academy || '').replace(/'/g, "\\'");
  const safeDuration = course.duration || '';
  const safePrice = `₹${(course.price || 0).toLocaleString('en-IN')}`;
  const safeId = course.id;

  return `
    <div class="course-card" data-category="${course.academyId}">
      ${course.featured ? '<span class="course-hot-tag">🔥 Popular</span>' : ''}
      <div class="course-thumbnail">
        <div class="course-thumb-bg" style="background:${course.color}">
          <span style="font-size:3.5rem; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.2));">${course.icon}</span>
        </div>
        <div class="course-badge-overlay">
          <span class="course-level-badge">${course.level}</span>
        </div>
        <div class="course-duration-badge">⏱️ ${course.duration}</div>
      </div>
      <div class="course-body">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:8px;">
          <div class="course-academy-tag" style="margin-bottom:0;">${course.icon} ${course.academy}</div>
          <span class="course-track-pill ${trackClass}">${progLevel}</span>
        </div>
        <h3 class="course-title"><a href="${courseUrl}">${course.name}</a></h3>
        <p class="course-desc">${course.shortDesc}</p>
        ${toolsHTML}
        <div class="course-features">
          <span class="feature-item">💻 ${course.liveProjects} Projects</span>
          <span class="feature-item">📜 ISO Certificate</span>
          ${course.placementSupport ? '<span class="feature-item" style="color:var(--green); font-weight:700;">🎯 Placement Support</span>' : '<span class="feature-item">💼 Capstone Portfolio</span>'}
          <span class="feature-item">⭐ ${course.rating} (${course.reviews})</span>
        </div>
        <div class="course-footer course-footer-stack">
          <div class="course-pricing course-pricing-row">
            <div>
              <span class="price-current">₹${(course.price || 0).toLocaleString('en-IN')}</span>
              <span class="price-original">₹${(course.originalPrice || 0).toLocaleString('en-IN')}</span>
            </div>
            ${course.originalPrice > course.price ? `<span class="price-off">${Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF</span>` : ''}
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

  // 2. Update count from 0 to 109
  html = html.replace(/<strong id="courses-showing-count">\d+<\/strong>/g, `<strong id="courses-showing-count">${NS_COURSES.length}</strong>`);

  // 3. Inject JSON-LD schema into <head>
  const schemaTag = generateCatalogSchema(NS_COURSES);
  if (html.includes('id="courses-catalog-jsonld"')) {
    html = html.replace(/<script type="application\/ld\+json" id="courses-catalog-jsonld">[\s\S]*?<\/script>/, schemaTag);
  } else {
    html = html.replace('</head>', `  ${schemaTag}\n</head>`);
  }

  // 4. Pre-render course cards inside #courses-grid-page
  const cardsHtml = NS_COURSES.map(c => buildCourseCardHTML(c)).join('\n');
  const gridRegex = /<div class="courses-grid-page" id="courses-grid-page">[\s\S]*?<\/div>/;
  const replacementGrid = `<div class="courses-grid-page" id="courses-grid-page">\n${cardsHtml}\n        </div>`;

  if (!gridRegex.test(html)) {
    console.error('❌ Could not find <div class="courses-grid-page" id="courses-grid-page"> in courses.html');
    process.exit(1);
  }

  html = html.replace(gridRegex, replacementGrid);

  fs.writeFileSync(coursesPath, html, 'utf8');
  console.log(`✅ Successfully updated courses.html with ${NS_COURSES.length} pre-rendered course cards, clean canonical & CollectionPage schema.`);
}

updateCoursesPage();
