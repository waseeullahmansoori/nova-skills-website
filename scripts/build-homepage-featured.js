'use strict';

/**
 * Generates Homepage Featured Course Cards & Academy Card Counts/Starting Prices in index.html
 * Consumes ONLY canonical Course Data via js/course-data.js.
 * Preserves existing homepage layout, styles, and IMG-003..IMG-008 featured visuals cleanly.
 */

const fs = require('fs');
const path = require('path');
const CourseData = require('../js/course-data.js');

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');

const FEATURED_CARD_SPECS = [
  {
    courseId: 'dm-professional',
    articleId: 'course-dm-pro',
    thumbBg: 'linear-gradient(135deg, #FF6B00 0%, #FF9A3C 50%, #FFC300 100%)',
    imgUnit: 'IMG-003',
    imgAlt: 'Curriculum workflow illustration showing multi-channel digital marketing campaign analytics',
    levelBadge: 'Beginner Friendly',
    hotTag: null,
    featureBullets: (c) => [
      `✅ ${CourseData.getCourseProjectLabel(c)}`,
      '✅ Industry Certificate',
      '✅ Placement Support',
      '✅ Lifetime Access'
    ]
  },
  {
    courseId: 'ai-mastery',
    articleId: 'course-ai-mastery',
    featuredClass: ' course-featured-card',
    thumbBg: 'linear-gradient(135deg, #0599a8 0%, #011731 50%, #75d766 100%)',
    imgUnit: 'IMG-004',
    imgAlt: 'Conceptual architecture preview showing AI agent orchestration and knowledge workflow stages',
    levelBadge: 'Beginner to Applied AI Engineer',
    hotTag: '⭐ Flagship Career',
    featureBullets: (c) => [
      `✅ ${c.curriculum.length} Modules & ${c.guidedHours} Guided Hours`,
      `✅ ${c.liveProjects} Canonical Portfolio Builds`,
      '✅ ISO Verified Credential',
      '✅ Dedicated Placement Support'
    ]
  },
  {
    courseId: 'fullstack-foundation',
    articleId: 'course-fullstack',
    thumbBg: 'linear-gradient(135deg, #2563EB 0%, #0599a8 100%)',
    imgUnit: 'IMG-005',
    imgAlt: 'Full-stack programming workstation illustration with code editor and responsive web app preview',
    levelBadge: 'Beginner Friendly',
    hotTag: null,
    featureBullets: (c) => [
      `✅ ${CourseData.getCourseProjectLabel(c)}`,
      '✅ Industry Certificate',
      '✅ Placement Support',
      '✅ Code Reviews'
    ]
  },
  {
    courseId: 'creative-design',
    articleId: 'course-design',
    thumbBg: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    imgUnit: 'IMG-006',
    imgAlt: 'Brand identity system and packaging design showcase boards in navy, teal, and amber',
    levelBadge: 'Beginner Friendly',
    hotTag: null,
    featureBullets: (c) => [
      `✅ ${CourseData.getCourseProjectLabel(c)}`,
      '✅ Industry Certificate',
      '✅ Placement Support',
      '✅ Portfolio Building'
    ]
  },
  {
    courseId: 'ai-integrated-video-editing-motion-graphics-professional',
    articleId: 'course-video',
    thumbBg: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
    imgUnit: 'IMG-007',
    imgAlt: 'Non-linear video editing timeline and color-grading preview interface illustration',
    levelBadge: 'Intermediate',
    hotTag: null,
    featureBullets: (c) => [
      `✅ ${CourseData.getCourseProjectLabel(c)}`,
      '✅ Industry Certificate',
      '✅ Placement Support',
      '✅ Showreel Building'
    ]
  },
  {
    courseId: 'dm-mastery',
    articleId: 'course-dm-mastery',
    thumbBg: 'linear-gradient(135deg, #FF6B00 0%, #8B5CF6 100%)',
    imgUnit: 'IMG-008',
    imgAlt: 'Omnichannel digital marketing strategy and performance reporting dashboard illustration',
    levelBadge: 'Advanced',
    hotTag: null,
    featureBullets: (c) => [
      `✅ ${CourseData.getCourseProjectLabel(c)}`,
      '✅ Industry Certificate',
      '✅ Placement Support',
      '✅ Freelancing Module'
    ]
  }
];

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escJsStr(str) {
  return String(str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function renderFeaturedCard(spec) {
  const c = CourseData.getCourseById(spec.courseId);
  if (!c) throw new Error(`Missing canonical course for homepage featured card: ${spec.courseId}`);
  const acad = CourseData.getAcademyById(c.academyId);
  const academyLabel = acad ? acad.name : c.academy;
  const academyIcon = (acad && acad.icon) || c.icon || '🎓';
  const curFormatted = CourseData.formatPriceINR(c.price);
  const origFormatted = c.offer_active && c.originalPrice > c.price ? CourseData.formatPriceINR(c.originalPrice) : null;
  const bullets = spec.featureBullets(c);

  return `          <!-- ${escHtml(c.name)} (${c.id}) -->
          <article class="course-card${spec.featuredClass || ''}" data-category="${escHtml(c.academyId)}" data-course-id="${escHtml(c.id)}" id="${escHtml(spec.articleId)}">
${spec.hotTag ? `            <div class="course-hot-tag">${spec.hotTag}</div>\n` : ''}            <div class="course-thumbnail has-course-visual">
              <div class="course-thumb-bg has-course-visual" style="background: ${spec.thumbBg};">
                <picture class="course-thumb-picture">
                  <source media="(min-width: 768px)" srcset="/public/assets/nova-images/desktop/${spec.imgUnit}.webp" type="image/webp" width="960" height="720" />
                  <img src="/public/assets/nova-images/mobile/${spec.imgUnit}.webp" alt="${escHtml(spec.imgAlt)}" class="course-thumb-img" width="720" height="540" loading="lazy" decoding="async" />
                </picture>
              </div>
              <div class="course-badge-overlay">
                <span class="course-level-badge">${escHtml(spec.levelBadge)}</span>
              </div>
              <div class="course-duration-badge">${escHtml(c.duration)}</div>
            </div>
            <div class="course-body">
              <div class="course-academy-tag">${academyIcon} ${escHtml(academyLabel)}</div>
              <h3 class="course-title"><a href="/course-detail.html?id=${encodeURIComponent(c.id)}">${escHtml(c.name)}</a></h3>
              <p class="course-desc">${escHtml(c.shortDesc)}</p>
              <div class="course-features">
${bullets.map(b => `                <span class="feature-item">${escHtml(b)}</span>`).join('\n')}
              </div>
              <div class="course-footer course-footer-stack">
                ${CourseData.isCourseDemoEligible(c) ? `<div class="course-demo-indicator">
                  <button type="button" class="course-demo-chip" onclick="if(typeof openDemoModal==='function'){openDemoModal({courseId:'${escJsStr(c.id)}', courseName:'${escJsStr(c.name)}', academyName:'${escJsStr(academyLabel)}', sourceCta:'home_featured_card'});}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>2-Day Free Demo Available</span>
                  </button>
                </div>` : ''}
                <div class="course-pricing course-pricing-row">
                  <div>
                    <span class="price-current">${curFormatted}</span>
                    ${origFormatted ? `<span class="price-original">${origFormatted}</span>
                    <span class="price-off">${c.discount}% OFF</span>` : ''}
                  </div>
                </div>
                <div class="course-card-actions">
                  <a href="/course-detail.html?id=${encodeURIComponent(c.id)}" class="btn btn-outline btn-sm">View Syllabus</a>
                  <button type="button" class="btn btn-primary btn-sm btn-enroll" onclick="openEnrollmentModal('${escJsStr(c.name)}', '${escJsStr(academyLabel)}', '${escJsStr(c.duration)}', '${curFormatted}', '${escJsStr(c.id)}')">Enroll Now →</button>
                </div>
              </div>
            </div>
          </article>`;
}

function updateHomepage() {
  let html = fs.readFileSync(INDEX_PATH, 'utf8');
  const eol = html.includes('\r\n') ? '\r\n' : '\n';

  // 1. Sync all 12 academy cards counts + starting prices dynamically
  for (const acad of CourseData.getAllAcademies()) {
    const count = CourseData.getAcademyCourseCount(acad.id);
    const minFee = CourseData.getAcademyStartingPrice(acad.id);
    const countRegex = new RegExp(`(<span class="meta-badge"[^>]*data-academy-course-badge="${acad.id}"[^>]*>)[^<]*(<\\/span>\\s*\\r?\\n\\s*<span class="meta-badge"[^>]*>)[^<]*(<\\/span>)`, 'g');
    html = html.replace(countRegex, `$1${count} Courses</span>${eol}              <span class="meta-badge" data-academy-price-badge="${acad.id}">From ${CourseData.formatPriceINR(minFee)}$3`);
    // Also handle if data-academy-price-badge already exists
    const existingPriceRegex = new RegExp(`(<span class="meta-badge"[^>]*data-academy-price-badge="${acad.id}"[^>]*>)[^<]*(<\\/span>)`, 'g');
    html = html.replace(existingPriceRegex, `$1From ${CourseData.formatPriceINR(minFee)}$2`);
  }

  // 2. Sync all 6 Featured Course cards from canonical records
  const cardsHtml = FEATURED_CARD_SPECS.map(renderFeaturedCard).join('\n\n');
  const gridRegex = /(<div class="courses-grid" id="courses-grid">)[\s\S]*?(?=\s*<\/div>\s*\r?\n\s*<!-- View All CTA -->)/;
  if (!gridRegex.test(html)) {
    throw new Error('Could not locate #courses-grid inside index.html');
  }
  html = html.replace(gridRegex, `$1\n\n${cardsHtml}\n        `);

  // 3. Sync canonical global count spans + View All link
  const totalCount = CourseData.getGlobalCourseCount();
  html = html.replace(/(<div class="stat-card" data-stat="courses" data-count=")[^"]+(")/g, `$1${totalCount}$2`);
  html = html.replace(/(<span class="canonical-courses-count">)[^<]*(<\/span>)/g, `$1${totalCount}+$2`);
  html = html.replace(/(<span class="canonical-academies-count">)[^<]*(<\/span>)/g, `$1${CourseData.getTotalAcademiesCount()}$2`);

  fs.writeFileSync(INDEX_PATH, html, 'utf8');
  console.log(`✅ Updated index.html (${totalCount} canonical courses, 12 academy starting prices, 6 featured cards synced)`);
}

updateHomepage();
