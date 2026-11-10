/**
 * Nova Skills 36 City Pages Pre-renderer — Phase F Master Engine
 * 
 * Rules:
 * - Compiles all 36 city pages (P1: 10, P2: 13, P3: 13).
 * - Implements verified, responsive Hero visual cards on 26 VISUAL_READY cities.
 * - Preserves pure editorial text-first layout on 10 TEXT_FIRST_PREFERRED cities.
 * - Enhances course cards with authentic Phase D/E project demonstration thumbnails where approved.
 * - Preserves production indexation status: <meta name="robots" content="index, follow" />
 * - Single source of truth: resolves all pricing, duration, and curricula from canonical data.js.
 * - Preserves strict physical vs. online disclosure: Siddharth Nagar is sole physical campus.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const {
  getLocationBySlug,
  resolveCoursesForLocation
} = require('../lib/locations');

const { P1_CONFIGS } = require('./build-p1-city-pages');
const { P2_CONFIGS } = require('./build-p2-city-pages');
const { P3_CONFIGS } = require('./build-p3-city-pages');

const ROOT_DIR = path.resolve(__dirname, '..');

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const COURSE_PREVIEW_IMAGES = {
  'dm-professional': {
    desktop: '/images/projects/dm-professional/ns-proj-dm-analytics-dashboard-desktop-960w.png',
    card: '/images/projects/dm-professional/ns-proj-dm-analytics-dashboard-card-640w.png',
    mobile: '/images/projects/dm-professional/ns-proj-dm-analytics-dashboard-mobile-400w.png',
    alt: 'Live Performance Marketing & GA4 Analytics Project Capstone'
  },
  'graphic-design-pro': {
    desktop: '/images/projects/graphic-design-pro/ns-proj-gd-brand-identity-desktop-960w.png',
    card: '/images/projects/graphic-design-pro/ns-proj-gd-brand-identity-card-640w.png',
    mobile: '/images/projects/graphic-design-pro/ns-proj-gd-brand-identity-mobile-400w.png',
    alt: 'Commercial Vector Brand Identity System and Stationery Capstone'
  },
  'fullstack-foundation': {
    desktop: '/images/projects/fullstack-foundation/ns-proj-fs-saas-capstone-desktop-960w.png',
    card: '/images/projects/fullstack-foundation/ns-proj-fs-saas-capstone-card-640w.png',
    mobile: '/images/projects/fullstack-foundation/ns-proj-fs-saas-capstone-mobile-400w.png',
    alt: 'Enterprise Multi-Tenant Cloud SaaS Web Architecture'
  },
  'nocode-web-pro': {
    desktop: '/images/projects/nocode-web-pro/ns-proj-nc-webflow-clientfirst-desktop-960w.png',
    card: '/images/projects/nocode-web-pro/ns-proj-nc-webflow-clientfirst-card-640w.png',
    mobile: '/images/projects/nocode-web-pro/ns-proj-nc-webflow-clientfirst-mobile-400w.png',
    alt: 'Webflow Client-First Directory and Dynamic CMS Architecture'
  }
};

const CITY_VISUAL_MAP = {
  // P1 Cities (10)
  'indore': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-PROG-MASTER',
    imagePath: '/images/academies/programming/ns-academy-programming-hero-desktop-896w.png',
    tabletPath: '/images/academies/programming/ns-academy-programming-hero-tablet-600w.png',
    mobilePath: '/images/academies/programming/ns-academy-programming-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online programming classroom workstation for Indore learners',
    badge: 'Live Interactive Online • Programming & Web Systems'
  },
  'jaipur': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-DESIGN-MASTER',
    imagePath: '/images/academies/design/ns-academy-design-hero-desktop-896w.png',
    tabletPath: '/images/academies/design/ns-academy-design-hero-tablet-600w.png',
    mobilePath: '/images/academies/design/ns-academy-design-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online creative design workstation for Jaipur learners',
    badge: 'Live Interactive Online • Creative Design & UI/UX'
  },
  'lucknow': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-OFFICE-MASTER',
    imagePath: '/images/academies/office-productivity/ns-academy-office-hero-desktop-896w.png',
    tabletPath: '/images/academies/office-productivity/ns-academy-office-hero-tablet-600w.png',
    mobilePath: '/images/academies/office-productivity/ns-academy-office-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online professional productivity workstation for Lucknow learners',
    badge: 'Live Interactive Online • Business & Workplace Communication'
  },
  'nagpur': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-PROG-MASTER',
    imagePath: '/images/academies/programming/ns-academy-programming-hero-desktop-896w.png',
    tabletPath: '/images/academies/programming/ns-academy-programming-hero-tablet-600w.png',
    mobilePath: '/images/academies/programming/ns-academy-programming-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online full stack programming workstation for Nagpur learners',
    badge: 'Live Interactive Online • Full Stack & Data Intelligence'
  },
  'surat': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-NOCODE-MASTER',
    imagePath: '/images/academies/no-code-web/ns-academy-nocode-hero-desktop-896w.png',
    tabletPath: '/images/academies/no-code-web/ns-academy-nocode-hero-tablet-600w.png',
    mobilePath: '/images/academies/no-code-web/ns-academy-nocode-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online no-code web and e-commerce workstation for Surat learners',
    badge: 'Live Interactive Online • E-Commerce & Web Systems'
  },
  'patna': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-PROG-MASTER',
    imagePath: '/images/academies/programming/ns-academy-programming-hero-desktop-896w.png',
    tabletPath: '/images/academies/programming/ns-academy-programming-hero-tablet-600w.png',
    mobilePath: '/images/academies/programming/ns-academy-programming-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online web development workstation for Patna learners',
    badge: 'Live Interactive Online • Software Development & Python'
  },
  'nashik': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-3D-MASTER',
    imagePath: '/images/academies/3d/ns-academy-3d-hero-desktop-896w.png',
    tabletPath: '/images/academies/3d/ns-academy-3d-hero-tablet-600w.png',
    mobilePath: '/images/academies/3d/ns-academy-3d-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online 3D animation workstation for Nashik learners',
    badge: 'Live Interactive Online • 3D Animation & Motion Graphics'
  },
  'rajkot': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-NOCODE-MASTER',
    imagePath: '/images/academies/no-code-web/ns-academy-nocode-hero-desktop-896w.png',
    tabletPath: '/images/academies/no-code-web/ns-academy-nocode-hero-tablet-600w.png',
    mobilePath: '/images/academies/no-code-web/ns-academy-nocode-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online web building workstation for Rajkot learners',
    badge: 'Live Interactive Online • No-Code Web & Commerce'
  },
  'bhopal': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-OFFICE-MASTER',
    imagePath: '/images/academies/office-productivity/ns-academy-office-hero-desktop-896w.png',
    tabletPath: '/images/academies/office-productivity/ns-academy-office-hero-tablet-600w.png',
    mobilePath: '/images/academies/office-productivity/ns-academy-office-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online business intelligence workstation for Bhopal learners',
    badge: 'Live Interactive Online • Data Analysis & Workplace Skills'
  },
  'raipur': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-PROG-MASTER',
    imagePath: '/images/academies/programming/ns-academy-programming-hero-desktop-896w.png',
    tabletPath: '/images/academies/programming/ns-academy-programming-hero-tablet-600w.png',
    mobilePath: '/images/academies/programming/ns-academy-programming-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online full stack programming workstation for Raipur learners',
    badge: 'Live Interactive Online • Full Stack & UI/UX Pathways'
  },

  // P2 Cities (13)
  'vadodara': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-NOCODE-MASTER',
    imagePath: '/images/academies/no-code-web/ns-academy-nocode-hero-desktop-896w.png',
    tabletPath: '/images/academies/no-code-web/ns-academy-nocode-hero-tablet-600w.png',
    mobilePath: '/images/academies/no-code-web/ns-academy-nocode-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online website systems workstation for Vadodara learners',
    badge: 'Live Interactive Online • Website Systems & E-Commerce'
  },
  'dehradun': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-PROG-MASTER',
    imagePath: '/images/academies/programming/ns-academy-programming-hero-desktop-896w.png',
    tabletPath: '/images/academies/programming/ns-academy-programming-hero-tablet-600w.png',
    mobilePath: '/images/academies/programming/ns-academy-programming-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online programming workstation for Dehradun learners',
    badge: 'Live Interactive Online • Multi-Stage Coding Pathways'
  },
  'kota': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-3D-MASTER',
    imagePath: '/images/academies/3d/ns-academy-3d-hero-desktop-896w.png',
    tabletPath: '/images/academies/3d/ns-academy-3d-hero-tablet-600w.png',
    mobilePath: '/images/academies/3d/ns-academy-3d-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online 3D visualization workstation for Kota learners',
    badge: 'Live Interactive Online • 3D Design & Python'
  },
  'chhatrapati-sambhajinagar': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-3D-MASTER',
    imagePath: '/images/academies/3d/ns-academy-3d-hero-desktop-896w.png',
    tabletPath: '/images/academies/3d/ns-academy-3d-hero-tablet-600w.png',
    mobilePath: '/images/academies/3d/ns-academy-3d-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online 3D animation workstation for Chhatrapati Sambhajinagar learners',
    badge: 'Live Interactive Online • 3D Animation & Product UI/UX'
  },
  'prayagraj': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-OFFICE-MASTER',
    imagePath: '/images/academies/office-productivity/ns-academy-office-hero-desktop-896w.png',
    tabletPath: '/images/academies/office-productivity/ns-academy-office-hero-tablet-600w.png',
    mobilePath: '/images/academies/office-productivity/ns-academy-office-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online career launch workstation for Prayagraj learners',
    badge: 'Live Interactive Online • Career Launch & Fluency'
  },
  'ludhiana': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-NOCODE-MASTER',
    imagePath: '/images/academies/no-code-web/ns-academy-nocode-hero-desktop-896w.png',
    tabletPath: '/images/academies/no-code-web/ns-academy-nocode-hero-tablet-600w.png',
    mobilePath: '/images/academies/no-code-web/ns-academy-nocode-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online e-commerce workstation for Ludhiana learners',
    badge: 'Live Interactive Online • E-Commerce & Commercial Growth'
  },
  'jalandhar': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-CREATOR-MASTER',
    imagePath: '/images/academies/creator/ns-academy-creator-hero-desktop-896w.png',
    tabletPath: '/images/academies/creator/ns-academy-creator-hero-tablet-600w.png',
    mobilePath: '/images/academies/creator/ns-academy-creator-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online video editing & creator workstation for Jalandhar learners',
    badge: 'Live Interactive Online • Video Production & Content Growth'
  },
  'gorakhpur': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-OFFICE-MASTER',
    imagePath: '/images/academies/office-productivity/ns-academy-office-hero-desktop-896w.png',
    tabletPath: '/images/academies/office-productivity/ns-academy-office-hero-tablet-600w.png',
    mobilePath: '/images/academies/office-productivity/ns-academy-office-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online office productivity workstation for Gorakhpur learners',
    badge: 'Live Interactive Online • Office Skills & Python'
  },
  'gwalior': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-PROG-MASTER',
    imagePath: '/images/academies/programming/ns-academy-programming-hero-desktop-896w.png',
    tabletPath: '/images/academies/programming/ns-academy-programming-hero-tablet-600w.png',
    mobilePath: '/images/academies/programming/ns-academy-programming-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online software development workstation for Gwalior learners',
    badge: 'Live Interactive Online • Full Stack & Data Intelligence'
  },
  'hisar': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-NOCODE-MASTER',
    imagePath: '/images/academies/no-code-web/ns-academy-nocode-hero-desktop-896w.png',
    tabletPath: '/images/academies/no-code-web/ns-academy-nocode-hero-tablet-600w.png',
    mobilePath: '/images/academies/no-code-web/ns-academy-nocode-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online e-commerce website workstation for Hisar learners',
    badge: 'Live Interactive Online • E-Commerce & Python'
  },
  'basti': {
    status: 'TEXT_FIRST_PREFERRED',
    reason: 'Pure editorial typography optimized for low-latency bandwidth and focused clarity.'
  },
  'azamgarh': {
    status: 'TEXT_FIRST_PREFERRED',
    reason: 'Pure editorial typography optimized for low-latency bandwidth and focused clarity.'
  },
  'sultanpur': {
    status: 'TEXT_FIRST_PREFERRED',
    reason: 'Pure editorial typography optimized for low-latency bandwidth and focused clarity.'
  },

  // P3 Cities (13)
  'muzaffarpur': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-OFFICE-MASTER',
    imagePath: '/images/academies/office-productivity/ns-academy-office-hero-desktop-896w.png',
    tabletPath: '/images/academies/office-productivity/ns-academy-office-hero-tablet-600w.png',
    mobilePath: '/images/academies/office-productivity/ns-academy-office-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online career readiness workstation for Muzaffarpur learners',
    badge: 'Live Interactive Online • Python & Career Launch'
  },
  'jammu': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-NOCODE-MASTER',
    imagePath: '/images/academies/no-code-web/ns-academy-nocode-hero-desktop-896w.png',
    tabletPath: '/images/academies/no-code-web/ns-academy-nocode-hero-tablet-600w.png',
    mobilePath: '/images/academies/no-code-web/ns-academy-nocode-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online web design workstation for Jammu learners',
    badge: 'Live Interactive Online • Web Design & AI Productivity'
  },
  'solan': {
    status: 'TEXT_FIRST_PREFERRED',
    reason: 'Pure editorial typography optimized for low-latency bandwidth and focused clarity.'
  },
  'margao': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-DESIGN-MASTER',
    imagePath: '/images/academies/design/ns-academy-design-hero-desktop-896w.png',
    tabletPath: '/images/academies/design/ns-academy-design-hero-tablet-600w.png',
    mobilePath: '/images/academies/design/ns-academy-design-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online creative design workstation for Margao learners',
    badge: 'Live Interactive Online • Creative Design & Video Editing'
  },
  'leh': {
    status: 'TEXT_FIRST_PREFERRED',
    reason: 'High-altitude remote corridor; pure editorial typography prioritized for zero data waste.'
  },
  'bahraich': {
    status: 'TEXT_FIRST_PREFERRED',
    reason: 'Pure editorial typography optimized for low-latency bandwidth and focused clarity.'
  },
  'wardha': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-OFFICE-MASTER',
    imagePath: '/images/academies/office-productivity/ns-academy-office-hero-desktop-896w.png',
    tabletPath: '/images/academies/office-productivity/ns-academy-office-hero-tablet-600w.png',
    mobilePath: '/images/academies/office-productivity/ns-academy-office-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online MIS and programming workstation for Wardha learners',
    badge: 'Live Interactive Online • Python & MIS Data Systems'
  },
  'jagdalpur': {
    status: 'TEXT_FIRST_PREFERRED',
    reason: 'Pure editorial typography optimized for low-latency bandwidth and focused clarity.'
  },
  'kaithal': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-NOCODE-MASTER',
    imagePath: '/images/academies/no-code-web/ns-academy-nocode-hero-desktop-896w.png',
    tabletPath: '/images/academies/no-code-web/ns-academy-nocode-hero-tablet-600w.png',
    mobilePath: '/images/academies/no-code-web/ns-academy-nocode-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online no-code web workstation for Kaithal learners',
    badge: 'Live Interactive Online • No-Code Web & Communication'
  },
  'anantnag': {
    status: 'TEXT_FIRST_PREFERRED',
    reason: 'Pure editorial typography optimized for low-latency bandwidth and focused clarity.'
  },
  'mandi': {
    status: 'TEXT_FIRST_PREFERRED',
    reason: 'Pure editorial typography optimized for low-latency bandwidth and focused clarity.'
  },
  'ponda': {
    status: 'VISUAL_READY',
    assetId: 'NS-ACAD-DESIGN-MASTER',
    imagePath: '/images/academies/design/ns-academy-design-hero-desktop-896w.png',
    tabletPath: '/images/academies/design/ns-academy-design-hero-tablet-600w.png',
    mobilePath: '/images/academies/design/ns-academy-design-hero-mobile-400w.png',
    alt: 'Nova Skills live interactive online creative design workstation for Ponda learners',
    badge: 'Live Interactive Online • Creative Design & Video Editing'
  },
  'kargil': {
    status: 'TEXT_FIRST_PREFERRED',
    reason: 'High-altitude remote corridor; pure editorial typography prioritized for zero data waste.'
  }
};

function generateCityHtml(config) {
  const loc = getLocationBySlug(config.slug);
  if (!loc) throw new Error('Location not found in registry: ' + config.slug);

  const courseData = resolveCoursesForLocation(config.slug);
  const coreCourses = courseData.coreCourses;
  const additionalCourses = courseData.additionalCourses;
  const allCourses = courseData.allCourses;

  const visualCfg = CITY_VISUAL_MAP[config.slug] || { status: 'TEXT_FIRST_PREFERRED' };
  const isVisualReady = visualCfg.status === 'VISUAL_READY';

  // 1. Render Course Card with preview image if available
  function renderCourseCard(course, roleLabel) {
    const preview = COURSE_PREVIEW_IMAGES[course.id];
    const previewHtml = preview ? `
            <div class="city-card-preview-thumb">
              <picture>
                <source type="image/png" srcset="${preview.mobile} 400w, ${preview.card} 640w" sizes="(max-width: 640px) 100vw, 360px" />
                <img src="${preview.card}" alt="${escapeHtml(preview.alt)}" width="360" height="202" loading="lazy" decoding="async" />
              </picture>
            </div>` : '';

    return `
          <!-- Course Card: ${escapeHtml(course.title)} -->
          <article class="city-course-card">
            ${previewHtml}
            <div class="city-card-badge-row">
              <span class="city-badge-academy">${escapeHtml(course.academyName)}</span>
              <span class="city-badge-type">${escapeHtml(roleLabel)}</span>
            </div>
            <h3 class="city-card-title">${escapeHtml(course.title)}</h3>
            <p class="city-card-desc">${escapeHtml(course.shortDescription)}</p>
            <div class="city-card-specs-row">
              <span>⏱ ${escapeHtml(course.duration)}</span>
              <span>•</span>
              <span>📂 ${course.modulesCount} Modules</span>
              <span>•</span>
              <span>🚀 ${course.projectsCount} Projects</span>
            </div>
            <div class="city-card-price-row">
              <div>
                <span class="city-price-label">Launch Fee:</span>
                <span class="city-price-current">₹${course.pricing.launchPrice.toLocaleString('en-IN')}</span>
              </div>
              ${course.pricing.offerActive ? `<span class="city-price-original">₹${course.pricing.regularPrice.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <div class="city-card-actions">
              <a href="${course.canonicalUrl}" class="city-card-btn-syllabus">Syllabus →</a>
              <button type="button" class="city-card-btn-demo" onclick="window.openCityCourseDemo('${escapeHtml(course.id)}', '${escapeHtml(course.title)}')">Free Demo</button>
            </div>
          </article>`;
  }

  const coreCardsHtml = coreCourses.map(c => renderCourseCard(c, 'Compulsory Professional')).join('\n');
  const additionalCardsHtml = additionalCourses.map(c => renderCourseCard(c, 'Featured Pathway')).join('\n');

  // 2. Decision Explorer Tabs & Panels
  const tabsNavHtml = config.decisionTabs.map((t, idx) => {
    return `<button type="button" class="city-decision-tab-btn ${idx === 0 ? 'active' : ''}" data-tab="${escapeHtml(t.id)}">${escapeHtml(t.label)}</button>`;
  }).join('\n            ');

  const panelsHtml = config.decisionTabs.map((t, idx) => {
    return `
          <!-- Decision Panel: ${escapeHtml(t.id)} -->
          <div class="city-decision-panel ${idx === 0 ? 'active' : ''}" id="${escapeHtml(t.id)}">
            <div class="city-panel-grid">
              <div>
                <h3 class="city-panel-title">${escapeHtml(t.title)}</h3>
                <p class="city-panel-desc">${escapeHtml(t.desc)}</p>
                <div style="display: flex; gap: 12px; margin-top: 20px;">
                  <button type="button" class="city-btn city-btn-primary" onclick="window.openCityCourseDemo('${escapeHtml(t.courseId)}', '${escapeHtml(t.title)}')">Book Free Demo</button>
                  <a href="/course-detail.html?id=${escapeHtml(t.courseId)}" class="city-btn city-btn-secondary" style="color: var(--city-primary); border-color: var(--city-primary); background: transparent;">View Curriculum</a>
                </div>
              </div>
              <div class="city-panel-specs-box">
                <div class="city-panel-spec-row">
                  <span class="city-panel-spec-label">Primary Focus:</span>
                  <span class="city-panel-spec-val">${escapeHtml(t.focus)}</span>
                </div>
                <div class="city-panel-spec-row">
                  <span class="city-panel-spec-label">Tools &amp; Tech:</span>
                  <span class="city-panel-spec-val">${escapeHtml(t.tools)}</span>
                </div>
                <div class="city-panel-spec-row">
                  <span class="city-panel-spec-label">Program Duration:</span>
                  <span class="city-panel-spec-val">${escapeHtml(t.duration)}</span>
                </div>
                <div class="city-panel-spec-row">
                  <span class="city-panel-spec-label">Practical Outcome:</span>
                  <span class="city-panel-spec-val">${escapeHtml(t.outcome)}</span>
                </div>
              </div>
            </div>
          </div>`;
  }).join('\n');

  // 3. Comparison Table Rows
  const tableRowsHtml = allCourses.map(c => {
    return `
              <tr>
                <td>
                  <span class="city-table-course-title">${escapeHtml(c.title)}</span>
                  <small style="color: var(--city-text-muted);">${escapeHtml(c.academyName)}</small>
                </td>
                <td>${escapeHtml(c.duration)}</td>
                <td>${c.modulesCount} Modules</td>
                <td>${c.projectsCount} Projects</td>
                <td><strong>₹${c.pricing.launchPrice.toLocaleString('en-IN')}</strong></td>
                <td>
                  <button type="button" class="city-card-btn-demo" style="height: 36px; padding: 6px 14px; font-size: 0.75rem;" onclick="window.openCityCourseDemo('${escapeHtml(c.id)}', '${escapeHtml(c.title)}')">Demo</button>
                </td>
              </tr>`;
  }).join('\n');

  // 4. Tools Highlights
  const toolsList = Array.from(new Set(allCourses.flatMap(c => c.softwareCovered))).slice(0, 16);
  const toolPillsHtml = toolsList.map(tool => `<span class="city-tool-pill">${escapeHtml(tool)}</span>`).join('\n              ');

  // 5. JSON-LD Schema
  const schemaGraph = [
    {
      "@type": "WebPage",
      "@id": `https://novaskills.in/branches/${loc.slug}/#webpage`,
      "url": `https://novaskills.in/branches/${loc.slug}/`,
      "name": config.title,
      "description": config.metaDesc,
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://novaskills.in/#website",
        "name": "Nova Skills",
        "url": "https://novaskills.in/"
      }
    },
    {
      "@type": "BreadcrumbList",
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
          "name": "Learning Locations",
          "item": "https://novaskills.in/branches/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": loc.city,
          "item": `https://novaskills.in/branches/${loc.slug}/`
        }
      ]
    },
    {
      "@type": "ItemList",
      "name": `Featured Professional Courses in ${loc.city}`,
      "numberOfItems": allCourses.length,
      "itemListElement": allCourses.map((c, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": c.title,
        "description": c.shortDescription
      }))
    }
  ];

  if (isVisualReady) {
    schemaGraph.push({
      "@type": "ImageObject",
      "@id": `https://novaskills.in/branches/${loc.slug}/#hero-image`,
      "name": visualCfg.alt,
      "contentUrl": `https://novaskills.in${visualCfg.imagePath}`,
      "thumbnailUrl": `https://novaskills.in${visualCfg.mobilePath}`,
      "caption": visualCfg.badge,
      "license": "https://novaskills.in/terms-and-conditions.html",
      "acquireLicensePage": "https://novaskills.in/contact.html",
      "creditText": "Nova Skills Education Institute",
      "creator": {
        "@type": "Organization",
        "name": "Nova Skills"
      }
    });
  }

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": schemaGraph
  };

  // Hero HTML (2-column for VISUAL_READY, 1-column for TEXT_FIRST_PREFERRED)
  let heroSectionHtml = '';
  if (isVisualReady) {
    heroSectionHtml = `
    <!-- ============================================================
         SECTION 01: HERO SECTION (VISUAL ENHANCED)
         ============================================================ -->
    <section class="city-hero-section" aria-labelledby="city-hero-title">
      <div class="city-container">
        <div class="city-hero-grid has-visual">
          <div class="city-hero-content">
            <div class="city-hero-eyebrow">
              <span>🌐</span> NOVA SKILLS • LIVE ONLINE LEARNING • ${escapeHtml(loc.city.toUpperCase())}
            </div>
            <h1 class="city-hero-title" id="city-hero-title">
              ${escapeHtml(config.headline)}
            </h1>
            <p class="city-hero-subtitle">
              ${escapeHtml(config.heroSubtitle)}
            </p>

            <!-- Single Horizontal Row CTAs (Preserving Academy Hero Rules) -->
            <div class="city-hero-cta-row">
              <button type="button" class="city-btn city-btn-primary" onclick="window.openCityEnrollment()">
                Enroll Now →
              </button>
              <button type="button" class="city-btn city-btn-secondary" onclick="window.openCityConsultation()">
                Free Consultation
              </button>
            </div>

            <div class="city-hero-trust-badge">
              <span>💻 Live Interactive Online Classes for ${escapeHtml(loc.city)} Learners</span>
              <span>•</span>
              <span>📍 Physical Campus: Siddharth Nagar (UP)</span>
            </div>
          </div>

          <div class="city-hero-visual-col" id="city-hero-visual-col">
            <div class="city-hero-card">
              <picture class="city-hero-picture">
                <source type="image/png" srcset="${visualCfg.mobilePath} 400w, ${visualCfg.tabletPath} 600w, ${visualCfg.imagePath} 896w" sizes="(max-width: 768px) 100vw, 440px" />
                <img src="${visualCfg.tabletPath}" alt="${escapeHtml(visualCfg.alt)}" class="city-hero-img" width="440" height="340" loading="eager" fetchpriority="high" />
              </picture>
              <div class="city-hero-card-badge">
                <span class="city-hero-badge-dot"></span>
                <span>${escapeHtml(visualCfg.badge)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  } else {
    heroSectionHtml = `
    <!-- ============================================================
         SECTION 01: HERO SECTION (TEXT-FIRST EDITORIAL)
         ============================================================ -->
    <section class="city-hero-section" aria-labelledby="city-hero-title">
      <div class="city-container">
        <div class="city-hero-grid">
          <div class="city-hero-content">
            <div class="city-hero-eyebrow">
              <span>🌐</span> NOVA SKILLS • LIVE ONLINE LEARNING • ${escapeHtml(loc.city.toUpperCase())}
            </div>
            <h1 class="city-hero-title" id="city-hero-title">
              ${escapeHtml(config.headline)}
            </h1>
            <p class="city-hero-subtitle">
              ${escapeHtml(config.heroSubtitle)}
            </p>

            <!-- Single Horizontal Row CTAs (Preserving Academy Hero Rules) -->
            <div class="city-hero-cta-row">
              <button type="button" class="city-btn city-btn-primary" onclick="window.openCityEnrollment()">
                Enroll Now →
              </button>
              <button type="button" class="city-btn city-btn-secondary" onclick="window.openCityConsultation()">
                Free Consultation
              </button>
            </div>

            <div class="city-hero-trust-badge">
              <span>💻 Live Interactive Online Classes for ${escapeHtml(loc.city)} Learners</span>
              <span>•</span>
              <span>📍 Physical Campus: Siddharth Nagar (UP)</span>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-9WN9N2KF12"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9WN9N2KF12');
  </script>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(config.title)}</title>
  <meta name="description" content="${escapeHtml(config.metaDesc)}" />
  <link rel="canonical" href="https://novaskills.in/branches/${loc.slug}/" />
  
  <!-- Indexing Guard: Production indexing preserved -->
  <meta name="robots" content="index, follow" />

  <!-- OpenGraph Metadata -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Nova Skills" />
  <meta property="og:url" content="https://novaskills.in/branches/${loc.slug}/" />
  <meta property="og:title" content="${escapeHtml(config.title)}" />
  <meta property="og:description" content="${escapeHtml(config.metaDesc)}" />
  <meta property="og:image" content="https://novaskills.in/public/images/seo/og-banner.png?v=2026" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@novaskills_in" />
  <meta name="twitter:title" content="${escapeHtml(config.title)}" />
  <meta name="twitter:description" content="${escapeHtml(config.metaDesc)}" />
  <meta name="twitter:image" content="https://novaskills.in/public/images/seo/og-banner.png?v=2026" />

  <!-- Favicon & Fonts Preload -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="preload" href="/public/fonts/PlusJakartaSans-700.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/public/fonts/Inter-400.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Base Site Styles & Scoped City Styles -->
  <link rel="stylesheet" href="/css/styles.min.css?v=2.7.4" />
  <link rel="stylesheet" href="/css/locations-city.css" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(schemaJsonLd, null, 2)}
  </script>
</head>
<body class="city-location-page" data-city-slug="${escapeHtml(loc.slug)}" data-city-name="${escapeHtml(loc.city)}">

  <!-- Injected Header Shell -->
  <div id="ns-header"></div>

  <!-- Breadcrumbs -->
  <nav class="city-breadcrumb-wrap" aria-label="Breadcrumb">
    <div class="city-container">
      <ol class="city-breadcrumb-list">
        <li class="city-breadcrumb-item"><a href="/">Home</a></li>
        <li class="city-breadcrumb-sep">/</li>
        <li class="city-breadcrumb-item"><a href="/branches/">Branches &amp; Locations</a></li>
        <li class="city-breadcrumb-sep">/</li>
        <li class="city-breadcrumb-current" aria-current="page">${escapeHtml(loc.city)}</li>
      </ol>
    </div>
  </nav>

  <main id="main-content" class="city-page-main">
${heroSectionHtml}

    <!-- ============================================================
         SECTION 02: DIRECT ANSWER SUMMARY BOX (AEO / GEO / VSO)
         ============================================================ -->
    <section class="city-answer-section" aria-labelledby="answer-title">
      <div class="city-container">
        <div class="city-direct-answer-card">
          <h2 class="city-answer-heading" id="answer-title">
            <span>💡</span> Can I join Nova Skills live online courses from ${escapeHtml(loc.city)}?
          </h2>
          <p class="city-answer-text">
            <strong>Yes.</strong> Prospective students in ${escapeHtml(loc.city)} (${escapeHtml(loc.state)}) can enroll in all ${allCourses.length} featured professional courses via live interactive online batches. Classes feature two-way audio/video, real-time mentor code reviews, recorded lecture archives, and weekend doubt clearance. In-person physical classroom training is conducted exclusively at our official Siddharth Nagar, Uttar Pradesh campus.
          </p>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 03: FOUR MANDATORY PROFESSIONAL PROGRAMS
         ============================================================ -->
    <section class="city-container" style="padding: 70px 0 40px;" aria-labelledby="core-heading">
      <header class="city-section-header">
        <span class="city-section-tag">Core Curriculum</span>
        <h2 class="city-section-title" id="core-heading">Four Compulsory Professional Programs</h2>
        <p class="city-section-subtitle">
          The four cornerstone certification tracks available to learners in ${escapeHtml(loc.city)} with 100% practical live project portfolios.
        </p>
      </header>
      <div class="city-courses-grid">
        ${coreCardsHtml}
      </div>
    </section>

    <!-- ============================================================
         SECTION 04: RECOMMENDED ADDITIONAL PROGRAMS
         ============================================================ -->
    <section class="city-container" style="padding: 40px 0 70px;" aria-labelledby="additional-heading">
      <header class="city-section-header">
        <span class="city-section-tag">${escapeHtml(config.editorialTag)}</span>
        <h2 class="city-section-title" id="additional-heading">Recommended Pathways for ${escapeHtml(loc.city)} Learners</h2>
        <p class="city-section-subtitle">
          Specialized programs selected to align with emerging industry opportunities and career advancement.
        </p>
      </header>
      <div class="city-courses-grid">
        ${additionalCardsHtml}
      </div>
    </section>

    <!-- ============================================================
         SECTION 05: UNIQUE DECISION-SUPPORT MODULE
         ============================================================ -->
    <section class="city-decision-section" aria-labelledby="decision-heading">
      <div class="city-container">
        <header class="city-section-header">
          <span class="city-section-tag">Interactive Guidance</span>
          <h2 class="city-section-title" id="decision-heading">${escapeHtml(config.decisionHeading)}</h2>
          <p class="city-section-subtitle">${escapeHtml(config.decisionSubtitle)}</p>
        </header>

        <!-- Tabs Nav -->
        <div class="city-decision-tabs" role="tablist">
          ${tabsNavHtml}
        </div>

        <!-- Panels Container -->
        <div class="city-decision-panels-container">
          ${panelsHtml}
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 06: INTERACTIVE COURSE COMPARISON TABLE
         ============================================================ -->
    <section class="city-comparison-section" aria-labelledby="comparison-heading">
      <div class="city-container">
        <header class="city-section-header">
          <span class="city-section-tag">Program Comparison</span>
          <h2 class="city-section-title" id="comparison-heading">Compare All ${allCourses.length} Programs in ${escapeHtml(loc.city)}</h2>
          <p class="city-section-subtitle">Evaluate course duration, curriculum modules, project counts, and verified launch fees.</p>
        </header>

        <div class="city-table-responsive-wrap">
          <table class="city-comparison-table" aria-label="Course comparison table for ${escapeHtml(loc.city)}">
            <thead>
              <tr>
                <th scope="col">Program Title &amp; Academy</th>
                <th scope="col">Duration</th>
                <th scope="col">Curriculum</th>
                <th scope="col">Live Projects</th>
                <th scope="col">Effective Fee</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 07: REAL PROJECT & TOOL HIGHLIGHTS
         ============================================================ -->
    <section class="city-tools-section" aria-labelledby="tools-heading">
      <div class="city-container">
        <header class="city-section-header">
          <span class="city-section-tag">Industry Stack</span>
          <h2 class="city-section-title" id="tools-heading">Tools &amp; Technologies You Will Master</h2>
          <p class="city-section-subtitle">Practical hands-on training with industry-standard software tools and AI platforms.</p>
        </header>

        <div class="city-tools-grid">
          <div class="city-tool-card" style="grid-column: 1 / -1;">
            <div class="city-tool-header">Verified Software &amp; Frameworks</div>
            <div class="city-tool-tags">
              ${toolPillsHtml}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 08 & 10: METHODOLOGY & E-E-A-T TRUST
         ============================================================ -->
    <section class="city-trust-section" aria-labelledby="method-heading">
      <div class="city-container">
        <header class="city-section-header">
          <span class="city-section-tag">Institutional Transparency</span>
          <h2 class="city-section-title" id="method-heading">How Live Interactive Online Learning Works</h2>
          <p class="city-section-subtitle">Rigorous online training methodology with real-time feedback and structured progression.</p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <div style="background: var(--city-surface); padding: 24px; border-radius: var(--city-radius-md); border: 1px solid var(--city-border);">
            <h3 style="font-family: var(--city-font-heading); font-size: 1.125rem; font-weight: 800; color: var(--city-navy); margin-top: 0;">1. Live Two-Way Classes</h3>
            <p style="font-size: 0.875rem; color: var(--city-text-muted); margin: 0;">Classes are streamed in high definition with two-way voice/screen interaction, ensuring you can ask questions in real time.</p>
          </div>
          <div style="background: var(--city-surface); padding: 24px; border-radius: var(--city-radius-md); border: 1px solid var(--city-border);">
            <h3 style="font-family: var(--city-font-heading); font-size: 1.125rem; font-weight: 800; color: var(--city-navy); margin-top: 0;">2. 1-on-1 Mentor Reviews</h3>
            <p style="font-size: 0.875rem; color: var(--city-text-muted); margin: 0;">Every code assignment, graphic layout, or video edit receives detailed personal feedback from your practitioner instructor.</p>
          </div>
          <div style="background: var(--city-surface); padding: 24px; border-radius: var(--city-radius-md); border: 1px solid var(--city-border);">
            <h3 style="font-family: var(--city-font-heading); font-size: 1.125rem; font-weight: 800; color: var(--city-navy); margin-top: 0;">3. Weekend Doubt Clinics</h3>
            <p style="font-size: 0.875rem; color: var(--city-text-muted); margin: 0;">Dedicated weekend review sessions help you catch up on complex modules, troubleshoot software issues, and refine project portfolios.</p>
          </div>
        </div>

        <div class="city-trust-box" role="note">
          <strong>Physical Campus Notice:</strong> Nova Skills operates its official physical classroom campus and headquarters in Siddharth Nagar, Uttar Pradesh. The ${escapeHtml(loc.city)} location represents an authorized live online learning service area. There are no physical branch offices, walk-in centers, or local staff in ${escapeHtml(loc.city)}.
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 11: CITY-RELEVANT FAQS
         ============================================================ -->
    <section class="city-faq-section" aria-labelledby="faq-title">
      <div class="city-container">
        <header class="city-section-header">
          <span class="city-section-tag">Frequently Asked Questions</span>
          <h2 class="city-section-title" id="faq-title">Questions from Learners in ${escapeHtml(loc.city)}</h2>
          <p class="city-section-subtitle">Direct, factual answers regarding course availability, demo classes, and admissions.</p>
        </header>

        <div class="city-faq-wrap">
          <details class="city-faq-item">
            <summary class="city-faq-question">
              <span>Can I attend classes from ${escapeHtml(loc.city)} while working or studying?</span>
              <svg class="city-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="city-faq-answer">
              <p>Yes. We offer flexible weekday evening and weekend batches specifically designed for college students and working professionals in ${escapeHtml(loc.city)}. All live classes are recorded and archived for 24/7 access.</p>
            </div>
          </details>

          <details class="city-faq-item">
            <summary class="city-faq-question">
              <span>How do I book the 2-Day Free Demo class for ${escapeHtml(loc.city)} batches?</span>
              <svg class="city-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="city-faq-answer">
              <p>Click any 'Free Demo' button on this page to open our dedicated demo booking form. Select your preferred program, and an admissions coordinator will reserve your seat in the next demo batch.</p>
            </div>
          </details>

          <details class="city-faq-item">
            <summary class="city-faq-question">
              <span>Do you provide certificate evaluation and portfolio support?</span>
              <svg class="city-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="city-faq-answer">
              <p>Yes. Upon successfully completing course modules and evaluating your practical capstone projects, you receive an accredited Nova Skills Certificate of Completion along with comprehensive portfolio preparation assistance.</p>
            </div>
          </details>

          <details class="city-faq-item">
            <summary class="city-faq-question">
              <span>Where can I verify the full course syllabus for these ${allCourses.length} programs?</span>
              <svg class="city-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="city-faq-answer">
              <p>Each course card links directly to its official course detail page on our website, where complete week-by-week module outlines, software requirements, and project scopes are detailed.</p>
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 12: CONVERSION SECTION
         ============================================================ -->
    <section class="city-conversion-section" aria-labelledby="cta-heading">
      <div class="city-container">
        <div class="city-conversion-content">
          <h2 class="city-conversion-title" id="cta-heading">Advance Your Career in ${escapeHtml(loc.city)} Today.</h2>
          <p class="city-conversion-subtitle">
            Experience our practical teaching methodology firsthand with a 2-day live interactive demo session, or consult with an academic mentor.
          </p>
          <div class="city-conversion-ctas">
            <button type="button" class="city-btn city-btn-primary" onclick="window.openCityCourseDemo()">
              <span>📅</span> Book Your 2-Day Free Demo
            </button>
            <button type="button" class="city-btn city-btn-secondary" onclick="window.openCityConsultation()">
              <span>💬</span> Free Consultation
            </button>
            <a href="/branches/" class="city-btn city-btn-secondary">
              <span>🌐</span> View All 36 Locations
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 13: RELATED LEARNING RESOURCES
         ============================================================ -->
    <section class="city-container" style="padding: 50px 0; border-top: 1px solid var(--city-border); font-size: 0.875rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <span style="font-weight: 700; color: var(--city-navy);">Explore More at Nova Skills:</span>
          <a href="/courses.html" style="color: var(--city-primary); margin-left: 12px; text-decoration: underline;">All Courses (109)</a>
          <span style="color: var(--city-border); margin: 0 8px;">|</span>
          <a href="/branches/" style="color: var(--city-primary); text-decoration: underline;">All Learning Locations (36)</a>
          <span style="color: var(--city-border); margin: 0 8px;">|</span>
          <a href="/contact.html" style="color: var(--city-primary); text-decoration: underline;">Contact &amp; Campus Info</a>
        </div>
        <div style="color: var(--city-text-muted);">
          Location ID: <code>${escapeHtml(loc.id)}</code> • Priority: <code>${escapeHtml(loc.priority)}</code>
        </div>
      </div>
    </section>

  </main>

  <!-- Injected Footer Shell -->
  <div id="ns-footer"></div>

  <!-- Scripts -->
  <script src="/js/data.min.js?v=2.7.4" defer></script>
  <script src="/js/components.min.js?v=2.7.4" defer></script>
  <script src="/js/icon-system.js" defer></script>
  <script src="/js/locations-city.js" defer></script>
</body>
</html>`;
}

function compileAllCities() {
  const allConfigs = [...P1_CONFIGS, ...P2_CONFIGS, ...P3_CONFIGS];
  console.log(`====================================================`);
  console.log(`  COMPILING ALL 36 NOVA SKILLS CITY PAGES (PHASE F) `);
  console.log(`====================================================\n`);

  let visualCount = 0;
  let textFirstCount = 0;

  allConfigs.forEach(cfg => {
    const visualCfg = CITY_VISUAL_MAP[cfg.slug] || { status: 'TEXT_FIRST_PREFERRED' };
    const html = generateCityHtml(cfg);
    const targetDir = path.join(ROOT_DIR, 'branches', cfg.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, html, 'utf8');

    if (visualCfg.status === 'VISUAL_READY') {
      visualCount++;
      console.log(`  ✓ [VISUAL_READY] branches/${cfg.slug}/index.html (${(html.length / 1024).toFixed(2)} KB) -> ${visualCfg.assetId}`);
    } else {
      textFirstCount++;
      console.log(`  ✓ [TEXT_FIRST_PREFERRED] branches/${cfg.slug}/index.html (${(html.length / 1024).toFixed(2)} KB) -> Pure Editorial`);
    }
  });

  console.log(`\n====================================================`);
  console.log(`Compilation Complete: ${allConfigs.length} total cities`);
  console.log(`  - Visual Ready (Enhanced 2-Col Hero): ${visualCount}`);
  console.log(`  - Text First Preferred (Pure Editorial): ${textFirstCount}`);
  console.log(`====================================================\n`);
}

if (require.main === module) {
  compileAllCities();
}

module.exports = {
  CITY_VISUAL_MAP,
  generateCityHtml,
  compileAllCities
};
