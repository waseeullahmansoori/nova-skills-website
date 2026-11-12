function escapeHTML(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   NOVA SKILLS — Courses Page Logic
   Handles: Filtering, Sorting, URL Query Params, Rendering,
            Mobile Filter Toolbar & Bottom Sheet UI (2026/2027)
   ============================================================ */

'use strict';

let currentCourses = [];
window._activeChips = [];

function normalizeProgramLevel(level) {
  if (!level) return '';
  const str = String(level).trim().toLowerCase();
  if (str.includes('career')) return 'Career Program';
  if (str.includes('cert')) return 'Certification Course';
  if (str.includes('professional') || str.includes('pro')) return 'Professional Program';
  return level;
}
window.normalizeProgramLevel = normalizeProgramLevel;

function getCoursesData() {
  if (typeof NS_COURSES !== 'undefined' && Array.isArray(NS_COURSES)) return NS_COURSES;
  if (typeof window !== 'undefined' && Array.isArray(window.NS_COURSES)) return window.NS_COURSES;
  return [];
}

function getAcademiesData() {
  if (typeof NS_ACADEMIES !== 'undefined' && Array.isArray(NS_ACADEMIES)) return NS_ACADEMIES;
  if (typeof window !== 'undefined' && Array.isArray(window.NS_ACADEMIES)) return window.NS_ACADEMIES;
  return [];
}

document.addEventListener('DOMContentLoaded', () => {
  currentCourses = [...getCoursesData()];
  initAcademyFilterOptions();
  readUrlParamsAndApply();
  initQuickTrackTabs();
  initMobileSortSync();
  initMobileFilterSheet();
  bindFilterEvents();
  renderCourses();
});

/* Dynamically build academy filter checkboxes for desktop & mobile bottom sheet */
function initAcademyFilterOptions() {
  const desktopContainer = document.getElementById('filter-academy-options');
  const sheetContainer = document.getElementById('sheet-academy-options');
  const academies = getAcademiesData();
  const courses = getCoursesData();

  if (desktopContainer) {
    desktopContainer.innerHTML = academies.map(acad => {
      const count = courses.filter(c => c.academyId === acad.id).length;
      return `
        <label class="filter-option">
          <input type="checkbox" name="academy" value="${acad.id}" />
          <span>${acad.icon} ${acad.name}</span>
          <span class="filter-badge">${count}</span>
        </label>
      `;
    }).join('');
  }

  if (sheetContainer) {
    sheetContainer.innerHTML = academies.map(acad => {
      const count = courses.filter(c => c.academyId === acad.id).length;
      return `
        <label class="sheet-academy-item">
          <input type="checkbox" name="sheet-academy" value="${acad.id}" />
          <span class="sheet-academy-box">
            <span class="sheet-acad-icon">${acad.icon}</span>
            <span class="sheet-acad-name">${acad.name}</span>
            <span class="sheet-acad-badge">${count}</span>
          </span>
        </label>
      `;
    }).join('');
  }
}

/* Parse URL query params (e.g. ?academy=ai or ?search=digital or ?programLevel=Career Program) */
function readUrlParamsAndApply() {
  const params = new URLSearchParams(window.location.search);
  const academy = params.get('academy');
  const search = params.get('search');
  const levelParam = params.get('programLevel') || params.get('program_level') || params.get('level');
  const duration = params.get('duration');

  if (academy) {
    const cb = document.querySelector(`input[name="academy"][value="${academy}"]`);
    if (cb) cb.checked = true;
  }
  if (search) {
    const searchInput = document.getElementById('filter-search-input');
    if (searchInput) searchInput.value = search;
  }
  if (levelParam) {
    const norm = normalizeProgramLevel(levelParam);
    document.querySelectorAll('input[name="programLevel"]').forEach(cb => {
      const cbNorm = normalizeProgramLevel(cb.value);
      if (cbNorm === norm) cb.checked = true;
    });
  }
  if (duration) {
    const durCb = document.querySelector(`input[name="duration"][value="${duration}"]`);
    if (durCb) durCb.checked = true;
  }
}

/* Render Course Cards */
function renderCourses() {
  const grid = document.getElementById('courses-grid-page');
  const countDesktop = document.getElementById('courses-showing-count');
  const countMobile = document.getElementById('mobile-results-number');
  const noResults = document.getElementById('no-results');

  const filtered = filterAndSortCourses();

  if (countDesktop) countDesktop.textContent = filtered.length;
  if (countMobile) countMobile.textContent = filtered.length;

  if (filtered.length === 0) {
    if (grid) grid.innerHTML = '';
    if (noResults) noResults.removeAttribute('hidden');
  } else {
    if (noResults) noResults.setAttribute('hidden', '');
    if (grid) {
      grid.innerHTML = filtered.map((c, idx) => buildCourseCardHTML(c, idx)).join('');
    }
  }

  updateActiveFilterChips();
  syncQuickTrackTabState();
}

function getCourseUrl(course) {
  return `/course-detail.html?id=${course.id}`;
}

// BEGIN GENERATED COURSE_IMAGE_MAP
const COURSE_IMAGE_MAP = {
  "dm-mastery": {
    "desktop": "/public/assets/nova-images/desktop/IMG-008.webp",
    "mobile": "/public/assets/nova-images/mobile/IMG-008.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI Digital Marketing Strategist — strategic digital marketing growth planning and performance executive dashboard"
  },
  "dm-professional": {
    "desktop": "/public/assets/nova-images/desktop/unit-01/IMG-048.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-01/IMG-048.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI Digital Marketing Specialist — campaign planning, analytics and paid acquisition workspace"
  },
  "performance-marketing-specialist": {
    "desktop": "/images/projects/dm-professional/ns-proj-dm-paid-ads-funnel-card-640w.png",
    "mobile": "/images/projects/dm-professional/ns-proj-dm-paid-ads-funnel-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "Performance Marketing Specialist — project workflow and practical capstone preview"
  },
  "ecommerce-growth-marketing-specialist": {
    "desktop": "/public/assets/course-cards/desktop/ecommerce-growth-marketing-specialist.webp",
    "mobile": "/public/assets/course-cards/mobile/ecommerce-growth-marketing-specialist.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "E-Commerce & Growth Marketing Specialist — custom workspace and practical curriculum preview"
  },
  "google-ads": {
    "desktop": "/public/assets/course-cards/desktop/google-ads.webp",
    "mobile": "/public/assets/course-cards/mobile/google-ads.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Google Ads Performance Specialist — custom workspace and practical curriculum preview"
  },
  "meta-ads": {
    "desktop": "/public/assets/course-cards/svg/meta-ads.svg",
    "mobile": "/public/assets/course-cards/svg/meta-ads.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Meta Ads & Lead Generation Specialist — bespoke interactive workflow and software preview"
  },
  "seo-geo": {
    "desktop": "/public/assets/course-cards/svg/seo-geo.svg",
    "mobile": "/public/assets/course-cards/svg/seo-geo.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "SEO & AI Search Optimization (AEO/GEO) — bespoke interactive workflow and software preview"
  },
  "social-media-marketing": {
    "desktop": "/public/assets/course-cards/svg/social-media-marketing.svg",
    "mobile": "/public/assets/course-cards/svg/social-media-marketing.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Social Media Marketing & Growth — bespoke interactive workflow and software preview"
  },
  "content-marketing": {
    "desktop": "/public/assets/course-cards/svg/content-marketing.svg",
    "mobile": "/public/assets/course-cards/svg/content-marketing.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI-Powered Content Marketing — bespoke interactive workflow and software preview"
  },
  "email-marketing": {
    "desktop": "/public/assets/course-cards/svg/email-marketing.svg",
    "mobile": "/public/assets/course-cards/svg/email-marketing.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Email Marketing & Automation — bespoke interactive workflow and software preview"
  },
  "google-analytics-ga4": {
    "desktop": "/images/projects/dm-professional/ns-proj-dm-analytics-dashboard-card-640w.png",
    "mobile": "/images/projects/dm-professional/ns-proj-dm-analytics-dashboard-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "Google Analytics 4 & GTM — project workflow and practical capstone preview"
  },
  "google-search-console": {
    "desktop": "/images/projects/dm-professional/ns-proj-dm-technical-seo-blueprint-card-640w.png",
    "mobile": "/images/projects/dm-professional/ns-proj-dm-technical-seo-blueprint-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "Google Search Console & SEO Reporting — project workflow and practical capstone preview"
  },
  "local-seo": {
    "desktop": "/public/assets/course-cards/svg/local-seo.svg",
    "mobile": "/public/assets/course-cards/svg/local-seo.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Local SEO & Google Business Profile — bespoke interactive workflow and software preview"
  },
  "youtube-marketing": {
    "desktop": "/public/assets/course-cards/svg/youtube-marketing.svg",
    "mobile": "/public/assets/course-cards/svg/youtube-marketing.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "YouTube Marketing & Channel Growth — bespoke interactive workflow and software preview"
  },
  "ai-mastery": {
    "desktop": "/public/assets/nova-images/desktop/unit-02/IMG-048.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-02/IMG-048.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI Solutions Engineering & Agentic AI Mastery — AI solutions engineering, multi-agent systems and LLM workflows"
  },
  "ai-productivity": {
    "desktop": "/public/assets/nova-images/desktop/unit-01/IMG-067.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-01/IMG-067.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI Productivity Professional — practical workstation and applied training visual"
  },
  "ai-for-business-pro": {
    "desktop": "/public/assets/nova-images/desktop/unit-01/IMG-060.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-01/IMG-060.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI for Business Professional — practical workstation and applied training visual"
  },
  "prompt-engineering": {
    "desktop": "/public/assets/course-cards/svg/prompt-engineering.svg",
    "mobile": "/public/assets/course-cards/svg/prompt-engineering.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Prompt Engineering & AI Output Evaluation — bespoke interactive workflow and software preview"
  },
  "ai-automation-n8n": {
    "desktop": "/public/assets/course-cards/svg/ai-automation-n8n.svg",
    "mobile": "/public/assets/course-cards/svg/ai-automation-n8n.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI Automation with n8n & Business Workflows — bespoke interactive workflow and software preview"
  },
  "ai-agents-fundamentals": {
    "desktop": "/public/assets/course-cards/svg/ai-agents-fundamentals.svg",
    "mobile": "/public/assets/course-cards/svg/ai-agents-fundamentals.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI Agents Fundamentals: Design, Tools & Safety — bespoke interactive workflow and software preview"
  },
  "chatgpt-mastery": {
    "desktop": "/public/assets/course-cards/svg/chatgpt-mastery.svg",
    "mobile": "/public/assets/course-cards/svg/chatgpt-mastery.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "ChatGPT for Work, Research & Data Analysis — bespoke interactive workflow and software preview"
  },
  "gemini-mastery": {
    "desktop": "/public/assets/course-cards/svg/gemini-mastery.svg",
    "mobile": "/public/assets/course-cards/svg/gemini-mastery.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Gemini & Google Workspace AI — bespoke interactive workflow and software preview"
  },
  "claude-productivity": {
    "desktop": "/public/assets/course-cards/svg/claude-productivity.svg",
    "mobile": "/public/assets/course-cards/svg/claude-productivity.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Claude for Productivity, Skills & Artifacts — bespoke interactive workflow and software preview"
  },
  "ai-research-tools": {
    "desktop": "/public/assets/course-cards/svg/ai-research-tools.svg",
    "mobile": "/public/assets/course-cards/svg/ai-research-tools.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI Research & Evidence Verification — bespoke interactive workflow and software preview"
  },
  "creative-design": {
    "desktop": "/public/assets/nova-images/desktop/IMG-006.webp",
    "mobile": "/public/assets/nova-images/mobile/IMG-006.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Creative Design Master — creative design studio visual brand system and multi-format artwork"
  },
  "graphic-design-pro": {
    "desktop": "/public/assets/nova-images/desktop/unit-03/IMG-048.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-03/IMG-048.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Graphic Design Professional — graphic design, visual hierarchy and layout composition"
  },
  "uiux-design-pro": {
    "desktop": "/public/assets/nova-images/desktop/unit-05/IMG-048.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-05/IMG-048.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "UI/UX Design Professional — UI/UX wireframing, mobile user flows and interactive design"
  },
  "adobe-photoshop": {
    "desktop": "/public/assets/course-cards/desktop/adobe-photoshop.webp",
    "mobile": "/public/assets/course-cards/mobile/adobe-photoshop.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Adobe Photoshop — Commercial Image Editing & Design — custom workspace and practical curriculum preview"
  },
  "adobe-illustrator": {
    "desktop": "/public/assets/course-cards/svg/adobe-illustrator.svg",
    "mobile": "/public/assets/course-cards/svg/adobe-illustrator.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Adobe Illustrator — Vector Graphics & Print Design — bespoke interactive workflow and software preview"
  },
  "canva-pro": {
    "desktop": "/public/assets/course-cards/svg/canva-pro.svg",
    "mobile": "/public/assets/course-cards/svg/canva-pro.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Canva Professional — Brand & Marketing Design — bespoke interactive workflow and software preview"
  },
  "figma-ui-design": {
    "desktop": "/public/assets/course-cards/svg/figma-ui-design.svg",
    "mobile": "/public/assets/course-cards/svg/figma-ui-design.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Figma UI Design & Responsive Prototyping — bespoke interactive workflow and software preview"
  },
  "brand-identity-design": {
    "desktop": "/images/projects/graphic-design-pro/ns-proj-gd-brand-identity-card-640w.png",
    "mobile": "/images/projects/graphic-design-pro/ns-proj-gd-brand-identity-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "Brand Identity Design & Visual Systems — project workflow and practical capstone preview"
  },
  "packaging-design": {
    "desktop": "/images/projects/graphic-design-pro/ns-proj-gd-packaging-capstone-card-640w.png",
    "mobile": "/images/projects/graphic-design-pro/ns-proj-gd-packaging-capstone-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "Packaging Artwork & Print-Ready Design — project workflow and practical capstone preview"
  },
  "logo-design": {
    "desktop": "/public/assets/course-cards/svg/logo-design.svg",
    "mobile": "/public/assets/course-cards/svg/logo-design.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Logo Design & Vector Identity Marks — bespoke interactive workflow and software preview"
  },
  "fullstack-foundation": {
    "desktop": "/public/assets/nova-images/desktop/unit-04/IMG-048.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-04/IMG-048.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Full Stack Programming Foundation — full stack software engineering and web application code"
  },
  "python-developer": {
    "desktop": "/public/assets/nova-images/desktop/unit-02/IMG-063.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-02/IMG-063.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Python Developer Professional — practical workstation and applied training visual"
  },
  "ai-assisted-full-stack-web-development": {
    "desktop": "/images/projects/fullstack-foundation/ns-proj-fs-saas-capstone-card-640w.png",
    "mobile": "/images/projects/fullstack-foundation/ns-proj-fs-saas-capstone-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "AI-Assisted Full Stack Web Development — project workflow and practical capstone preview"
  },
  "html-css": {
    "desktop": "/images/projects/fullstack-foundation/ns-proj-fs-responsive-standards-card-640w.png",
    "mobile": "/images/projects/fullstack-foundation/ns-proj-fs-responsive-standards-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "HTML, CSS & Responsive Web Design — project workflow and practical capstone preview"
  },
  "javascript-cert": {
    "desktop": "/public/assets/course-cards/svg/javascript-cert.svg",
    "mobile": "/public/assets/course-cards/svg/javascript-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Modern JavaScript & TypeScript Foundations — bespoke interactive workflow and software preview"
  },
  "react-cert": {
    "desktop": "/public/assets/course-cards/svg/react-cert.svg",
    "mobile": "/public/assets/course-cards/svg/react-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "React.js Frontend Development — bespoke interactive workflow and software preview"
  },
  "node-js": {
    "desktop": "/public/assets/course-cards/svg/node-js.svg",
    "mobile": "/public/assets/course-cards/svg/node-js.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Node.js Backend Development with Express — bespoke interactive workflow and software preview"
  },
  "sql-basics": {
    "desktop": "/public/assets/course-cards/svg/sql-basics.svg",
    "mobile": "/public/assets/course-cards/svg/sql-basics.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "SQL & Relational Database Fundamentals — bespoke interactive workflow and software preview"
  },
  "git-github": {
    "desktop": "/public/assets/course-cards/svg/git-github.svg",
    "mobile": "/public/assets/course-cards/svg/git-github.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Git & GitHub — bespoke interactive workflow and software preview"
  },
  "rest-apis": {
    "desktop": "/images/projects/fullstack-foundation/ns-proj-fs-api-multitier-card-640w.png",
    "mobile": "/images/projects/fullstack-foundation/ns-proj-fs-api-multitier-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "REST APIs — project workflow and practical capstone preview"
  },
  "ecommerce-mastery": {
    "desktop": "/public/assets/nova-images/desktop/unit-07/IMG-048.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-07/IMG-048.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "E-Commerce Website Mastery — e-commerce storefront architecture and product merchandising"
  },
  "nocode-web-pro": {
    "desktop": "/public/assets/nova-images/desktop/unit-01/IMG-064.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-01/IMG-064.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "No-Code Website Professional — practical workstation and applied training visual"
  },
  "wordpress-cert": {
    "desktop": "/images/projects/nocode-web-pro/ns-proj-nc-wordpress-elementor-card-640w.png",
    "mobile": "/images/projects/nocode-web-pro/ns-proj-nc-wordpress-elementor-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "WordPress Website Design & Management — project workflow and practical capstone preview"
  },
  "woocommerce-cert": {
    "desktop": "/public/assets/course-cards/svg/woocommerce-cert.svg",
    "mobile": "/public/assets/course-cards/svg/woocommerce-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "WooCommerce Store Development & Operations — bespoke interactive workflow and software preview"
  },
  "shopify-cert": {
    "desktop": "/public/assets/course-cards/svg/shopify-cert.svg",
    "mobile": "/public/assets/course-cards/svg/shopify-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Shopify Store Design & E-Commerce Operations — bespoke interactive workflow and software preview"
  },
  "elementor-cert": {
    "desktop": "/public/assets/course-cards/svg/elementor-cert.svg",
    "mobile": "/public/assets/course-cards/svg/elementor-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Elementor Website Design & Landing Pages — bespoke interactive workflow and software preview"
  },
  "webflow-cert": {
    "desktop": "/images/projects/nocode-web-pro/ns-proj-nc-webflow-clientfirst-card-640w.png",
    "mobile": "/images/projects/nocode-web-pro/ns-proj-nc-webflow-clientfirst-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "Webflow Website Design & CMS Development — project workflow and practical capstone preview"
  },
  "framer-cert": {
    "desktop": "/images/projects/nocode-web-pro/ns-proj-nc-framer-saas-card-640w.png",
    "mobile": "/images/projects/nocode-web-pro/ns-proj-nc-framer-saas-mobile-400w.png",
    "mimeType": "image/png",
    "width": 640,
    "height": 360,
    "mobileWidth": 400,
    "mobileHeight": 225,
    "alt": "Framer Website Design & Interactive Experiences — project workflow and practical capstone preview"
  },
  "ai-integrated-video-editing-motion-graphics-professional": {
    "desktop": "/public/assets/nova-images/desktop/IMG-007.webp",
    "mobile": "/public/assets/nova-images/mobile/IMG-007.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI-Integrated Video Editing & Motion Graphics Professional — AI-integrated video editing suite, motion graphics timeline and color workspace"
  },
  "video-pro": {
    "desktop": "/public/assets/nova-images/desktop/unit-06/IMG-048.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-06/IMG-048.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Professional Video Editing — professional video editing workstation and camera production"
  },
  "generative-ai-video-production-professional": {
    "desktop": "/public/assets/course-cards/svg/generative-ai-video-production-professional.svg",
    "mobile": "/public/assets/course-cards/svg/generative-ai-video-production-professional.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Generative AI Video Production Professional — bespoke interactive workflow and software preview"
  },
  "adobe-premiere-pro": {
    "desktop": "/public/assets/course-cards/svg/adobe-premiere-pro.svg",
    "mobile": "/public/assets/course-cards/svg/adobe-premiere-pro.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Adobe Premiere Pro — Professional Video Editing — bespoke interactive workflow and software preview"
  },
  "after-effects": {
    "desktop": "/public/assets/course-cards/svg/after-effects.svg",
    "mobile": "/public/assets/course-cards/svg/after-effects.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Adobe After Effects — Motion Design & Compositing — bespoke interactive workflow and software preview"
  },
  "davinci-resolve": {
    "desktop": "/public/assets/course-cards/svg/davinci-resolve.svg",
    "mobile": "/public/assets/course-cards/svg/davinci-resolve.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "DaVinci Resolve — Colour Grading & Video Finishing — bespoke interactive workflow and software preview"
  },
  "reels-editing": {
    "desktop": "/public/assets/course-cards/svg/reels-editing.svg",
    "mobile": "/public/assets/course-cards/svg/reels-editing.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Reels & Shorts Editing for Brands and Creators — bespoke interactive workflow and software preview"
  },
  "motion-graphics-essentials": {
    "desktop": "/public/assets/course-cards/svg/motion-graphics-essentials.svg",
    "mobile": "/public/assets/course-cards/svg/motion-graphics-essentials.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Motion Graphics Essentials — 2D Animation & Typography — bespoke interactive workflow and software preview"
  },
  "archviz-mastery": {
    "desktop": "/public/assets/nova-images/desktop/unit-01/IMG-068.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-01/IMG-068.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Architectural Visualisation Master — practical workstation and applied training visual"
  },
  "3d-viz-pro": {
    "desktop": "/public/assets/nova-images/desktop/unit-08/IMG-048.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-08/IMG-048.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "3D Visualisation Professional — 3D visualization viewport modeling, lighting and rendering"
  },
  "blender-cert": {
    "desktop": "/public/assets/course-cards/svg/blender-cert.svg",
    "mobile": "/public/assets/course-cards/svg/blender-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Blender 3D Modeling, Materials & Rendering — bespoke interactive workflow and software preview"
  },
  "3ds-max-cert": {
    "desktop": "/public/assets/course-cards/svg/3ds-max-cert.svg",
    "mobile": "/public/assets/course-cards/svg/3ds-max-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "3ds Max Architectural Modeling & Visualization — bespoke interactive workflow and software preview"
  },
  "v-ray-cert": {
    "desktop": "/public/assets/course-cards/svg/v-ray-cert.svg",
    "mobile": "/public/assets/course-cards/svg/v-ray-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "V-Ray Photorealistic Rendering & Lighting — bespoke interactive workflow and software preview"
  },
  "twinmotion-cert": {
    "desktop": "/public/assets/course-cards/svg/twinmotion-cert.svg",
    "mobile": "/public/assets/course-cards/svg/twinmotion-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Twinmotion Real-Time Architectural Visualization — bespoke interactive workflow and software preview"
  },
  "cinema-4d-cert": {
    "desktop": "/public/assets/course-cards/svg/cinema-4d-cert.svg",
    "mobile": "/public/assets/course-cards/svg/cinema-4d-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Cinema 4D Motion Graphics & Product Animation — bespoke interactive workflow and software preview"
  },
  "unreal-engine-basics": {
    "desktop": "/public/assets/course-cards/svg/unreal-engine-basics.svg",
    "mobile": "/public/assets/course-cards/svg/unreal-engine-basics.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Unreal Engine 5 Real-Time 3D Fundamentals — bespoke interactive workflow and software preview"
  },
  "freelancing-client-acquisition-professional": {
    "desktop": "/public/assets/nova-images/desktop/unit-01/IMG-074.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-01/IMG-074.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Freelancing & Client Acquisition Professional — practical workstation and applied training visual"
  },
  "career-launch-placement-readiness-professional": {
    "desktop": "/public/assets/course-cards/svg/career-launch-placement-readiness-professional.svg",
    "mobile": "/public/assets/course-cards/svg/career-launch-placement-readiness-professional.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Career Launch & Placement Readiness Professional — bespoke interactive workflow and software preview"
  },
  "resume-building": {
    "desktop": "/public/assets/course-cards/svg/resume-building.svg",
    "mobile": "/public/assets/course-cards/svg/resume-building.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "ATS-Friendly Resume & Job Application Essentials — bespoke interactive workflow and software preview"
  },
  "linkedin-optimisation": {
    "desktop": "/public/assets/course-cards/svg/linkedin-optimisation.svg",
    "mobile": "/public/assets/course-cards/svg/linkedin-optimisation.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "LinkedIn Profile Optimisation & Professional Branding — bespoke interactive workflow and software preview"
  },
  "interview-preparation": {
    "desktop": "/public/assets/course-cards/svg/interview-preparation.svg",
    "mobile": "/public/assets/course-cards/svg/interview-preparation.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Interview Preparation & Professional Communication — bespoke interactive workflow and software preview"
  },
  "client-communication": {
    "desktop": "/public/assets/course-cards/svg/client-communication.svg",
    "mobile": "/public/assets/course-cards/svg/client-communication.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Professional Client Communication & Project Coordination — bespoke interactive workflow and software preview"
  },
  "proposal-writing": {
    "desktop": "/public/assets/course-cards/svg/proposal-writing.svg",
    "mobile": "/public/assets/course-cards/svg/proposal-writing.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Freelance Proposal Writing & Client Pitching — bespoke interactive workflow and software preview"
  },
  "agency-building": {
    "desktop": "/public/assets/course-cards/svg/agency-building.svg",
    "mobile": "/public/assets/course-cards/svg/agency-building.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Digital Agency Building & Operations — bespoke interactive workflow and software preview"
  },
  "fiverr-success": {
    "desktop": "/public/assets/course-cards/svg/fiverr-success.svg",
    "mobile": "/public/assets/course-cards/svg/fiverr-success.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Fiverr Freelancing & Gig Management — bespoke interactive workflow and software preview"
  },
  "upwork-success": {
    "desktop": "/public/assets/course-cards/svg/upwork-success.svg",
    "mobile": "/public/assets/course-cards/svg/upwork-success.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Upwork Freelancing & Client Acquisition — bespoke interactive workflow and software preview"
  },
  "business-english": {
    "desktop": "/public/assets/nova-images/desktop/unit-01/IMG-073.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-01/IMG-073.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Business English & Personality Development — practical workstation and applied training visual"
  },
  "spoken-english-pro": {
    "desktop": "/public/assets/course-cards/svg/spoken-english-pro.svg",
    "mobile": "/public/assets/course-cards/svg/spoken-english-pro.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Professional Spoken English — bespoke interactive workflow and software preview"
  },
  "spoken-english-cert": {
    "desktop": "/public/assets/course-cards/svg/spoken-english-cert.svg",
    "mobile": "/public/assets/course-cards/svg/spoken-english-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Spoken English Foundations & Everyday Conversation — bespoke interactive workflow and software preview"
  },
  "business-communication": {
    "desktop": "/public/assets/course-cards/svg/business-communication.svg",
    "mobile": "/public/assets/course-cards/svg/business-communication.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Business Communication & Workplace Writing — bespoke interactive workflow and software preview"
  },
  "presentation-skills": {
    "desktop": "/public/assets/course-cards/svg/presentation-skills.svg",
    "mobile": "/public/assets/course-cards/svg/presentation-skills.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Presentation Skills & Business Storytelling — bespoke interactive workflow and software preview"
  },
  "public-speaking": {
    "desktop": "/public/assets/course-cards/svg/public-speaking.svg",
    "mobile": "/public/assets/course-cards/svg/public-speaking.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Public Speaking & Audience Engagement — bespoke interactive workflow and software preview"
  },
  "soft-skills": {
    "desktop": "/public/assets/course-cards/svg/soft-skills.svg",
    "mobile": "/public/assets/course-cards/svg/soft-skills.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Workplace Soft Skills & Professional Effectiveness — bespoke interactive workflow and software preview"
  },
  "kids-mastery": {
    "desktop": "/public/assets/nova-images/desktop/unit-02/IMG-072.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-02/IMG-072.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Future Tech Kids Mastery — practical workstation and applied training visual"
  },
  "young-coders": {
    "desktop": "/public/assets/course-cards/svg/young-coders.svg",
    "mobile": "/public/assets/course-cards/svg/young-coders.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Young Coders Program — bespoke interactive workflow and software preview"
  },
  "scratch-programming": {
    "desktop": "/public/assets/course-cards/svg/scratch-programming.svg",
    "mobile": "/public/assets/course-cards/svg/scratch-programming.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Scratch Programming & Game Creation — bespoke interactive workflow and software preview"
  },
  "python-for-kids": {
    "desktop": "/public/assets/course-cards/svg/python-for-kids.svg",
    "mobile": "/public/assets/course-cards/svg/python-for-kids.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Python for Kids — Coding & Creative Projects — bespoke interactive workflow and software preview"
  },
  "ai-for-kids": {
    "desktop": "/public/assets/course-cards/svg/ai-for-kids.svg",
    "mobile": "/public/assets/course-cards/svg/ai-for-kids.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "AI Literacy & Creative Machine Learning for Kids — bespoke interactive workflow and software preview"
  },
  "robotics-basics": {
    "desktop": "/public/assets/course-cards/svg/robotics-basics.svg",
    "mobile": "/public/assets/course-cards/svg/robotics-basics.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Robotics & Physical Computing with micro:bit — bespoke interactive workflow and software preview"
  },
  "web-design-for-kids": {
    "desktop": "/public/assets/course-cards/svg/web-design-for-kids.svg",
    "mobile": "/public/assets/course-cards/svg/web-design-for-kids.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Web Design for Kids — HTML & CSS Foundations — bespoke interactive workflow and software preview"
  },
  "youtube-mastery": {
    "desktop": "/public/assets/course-cards/svg/youtube-mastery.svg",
    "mobile": "/public/assets/course-cards/svg/youtube-mastery.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "YouTube Growth & Content Strategy Professional — bespoke interactive workflow and software preview"
  },
  "content-creator-pro": {
    "desktop": "/public/assets/nova-images/desktop/unit-02/IMG-070.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-02/IMG-070.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Content Creator Professional — practical workstation and applied training visual"
  },
  "youtube-seo": {
    "desktop": "/public/assets/course-cards/svg/youtube-seo.svg",
    "mobile": "/public/assets/course-cards/svg/youtube-seo.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "YouTube SEO, Discovery & Channel Analytics — bespoke interactive workflow and software preview"
  },
  "thumbnail-design": {
    "desktop": "/public/assets/course-cards/svg/thumbnail-design.svg",
    "mobile": "/public/assets/course-cards/svg/thumbnail-design.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "YouTube Thumbnail Design & Creative Testing — bespoke interactive workflow and software preview"
  },
  "podcast-production": {
    "desktop": "/public/assets/course-cards/svg/podcast-production.svg",
    "mobile": "/public/assets/course-cards/svg/podcast-production.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Podcast Production & Distribution — bespoke interactive workflow and software preview"
  },
  "personal-branding": {
    "desktop": "/public/assets/course-cards/svg/personal-branding.svg",
    "mobile": "/public/assets/course-cards/svg/personal-branding.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Personal Branding & Thought Leadership — bespoke interactive workflow and software preview"
  },
  "short-video-strategy": {
    "desktop": "/public/assets/course-cards/svg/short-video-strategy.svg",
    "mobile": "/public/assets/course-cards/svg/short-video-strategy.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Short-Form Video Strategy & Content Growth — bespoke interactive workflow and software preview"
  },
  "biz-productivity": {
    "desktop": "/public/assets/nova-images/desktop/unit-02/IMG-071.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-02/IMG-071.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "MIS & Business Intelligence Professional — practical workstation and applied training visual"
  },
  "office-pro": {
    "desktop": "/public/assets/nova-images/desktop/unit-02/IMG-075.webp",
    "mobile": "/public/assets/nova-images/mobile/unit-02/IMG-075.webp",
    "mimeType": "image/webp",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Office Productivity Professional — practical workstation and applied training visual"
  },
  "microsoft-excel": {
    "desktop": "/public/assets/course-cards/svg/microsoft-excel.svg",
    "mobile": "/public/assets/course-cards/svg/microsoft-excel.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Microsoft Excel — Business Reporting & Data Analysis — bespoke interactive workflow and software preview"
  },
  "microsoft-word": {
    "desktop": "/public/assets/course-cards/svg/microsoft-word.svg",
    "mobile": "/public/assets/course-cards/svg/microsoft-word.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Microsoft Word — Professional Documents & Mail Merge — bespoke interactive workflow and software preview"
  },
  "microsoft-powerpoint": {
    "desktop": "/public/assets/course-cards/svg/microsoft-powerpoint.svg",
    "mobile": "/public/assets/course-cards/svg/microsoft-powerpoint.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Microsoft PowerPoint — Professional Presentation Design — bespoke interactive workflow and software preview"
  },
  "google-workspace": {
    "desktop": "/public/assets/course-cards/svg/google-workspace.svg",
    "mobile": "/public/assets/course-cards/svg/google-workspace.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Google Workspace — Cloud Productivity & Collaboration — bespoke interactive workflow and software preview"
  },
  "notion-cert": {
    "desktop": "/public/assets/course-cards/svg/notion-cert.svg",
    "mobile": "/public/assets/course-cards/svg/notion-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Notion — Workspace, Databases & Knowledge Systems — bespoke interactive workflow and software preview"
  },
  "clickup-cert": {
    "desktop": "/public/assets/course-cards/svg/clickup-cert.svg",
    "mobile": "/public/assets/course-cards/svg/clickup-cert.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "ClickUp — Project Management & Workflow Automation — bespoke interactive workflow and software preview"
  },
  "microsoft-copilot": {
    "desktop": "/public/assets/course-cards/svg/microsoft-copilot.svg",
    "mobile": "/public/assets/course-cards/svg/microsoft-copilot.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "Microsoft 365 Copilot — AI Workplace Productivity — bespoke interactive workflow and software preview"
  },
  "tally-gst": {
    "desktop": "/public/assets/course-cards/svg/tally-gst.svg",
    "mobile": "/public/assets/course-cards/svg/tally-gst.svg",
    "mimeType": "image/svg+xml",
    "width": 800,
    "height": 600,
    "mobileWidth": 600,
    "mobileHeight": 450,
    "alt": "TallyPrime — Accounting & GST Compliance — bespoke interactive workflow and software preview"
  }
};
// END GENERATED COURSE_IMAGE_MAP

function renderCourseCardMediaHtml(course, bannerIconHtml, cardIndex) {
  const rec = course && COURSE_IMAGE_MAP[course.id];
  if (!rec) {
    return {
      wrapperClass: '',
      bgClass: '',
      innerHtml: bannerIconHtml
    };
  }
  const loadingAttr = typeof cardIndex === 'number' && cardIndex < 3 ? 'eager' : 'lazy';
  return {
    wrapperClass: ' has-course-visual',
    bgClass: ' has-course-visual',
    innerHtml: `<picture class="course-thumb-picture"><source media="(min-width: 768px)" srcset="${escapeHTML(rec.desktop)}" type="${escapeHTML(rec.mimeType)}" width="${rec.width}" height="${rec.height}" /><img src="${escapeHTML(rec.mobile)}" alt="${escapeHTML(rec.alt)}" class="course-thumb-img" width="${rec.mobileWidth}" height="${rec.mobileHeight}" loading="${loadingAttr}" decoding="async" /></picture>`
  };
}

function buildCourseCardHTML(course, cardIndex = 0) {
  const courseUrl = getCourseUrl(course);
  
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

  const bannerIconHtml = (typeof NovaIcons !== 'undefined' && NovaIcons.renderCourseIcon)
    ? NovaIcons.renderCourseIcon(course.icon || course)
    : `<span style="font-size:3.5rem; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.2));">${course.icon || '🎓'}</span>`;

  const academyTagHtml = (typeof NovaIcons !== 'undefined' && NovaIcons.renderAcademyTagHtml)
    ? NovaIcons.renderAcademyTagHtml(course.academyId || course.academy)
    : `${course.academy || 'Academy'}`;

  const cardMedia = renderCourseCardMediaHtml(course, bannerIconHtml, cardIndex);

  return `
    <div class="course-card" data-category="${course.academyId}">
      ${course.featured ? '<span class="course-hot-tag">🔥 Popular</span>' : ''}
      <div class="course-thumbnail${cardMedia.wrapperClass}">
        <div class="course-thumb-bg${cardMedia.bgClass}" style="background:${course.color}">
          ${cardMedia.innerHtml}
        </div>
        <div class="course-badge-overlay">
          <span class="course-level-badge">${course.level}</span>
        </div>
        <div class="course-duration-badge">⏱️ ${course.duration}</div>
      </div>
      <div class="course-body">
        <div class="course-meta-header">
          <div class="course-academy-tag">${academyTagHtml}</div>
          <span class="course-track-pill ${trackClass}">${progLevel}</span>
        </div>
        <h3 class="course-title"><a href="${courseUrl}">${course.name}</a></h3>
        <p class="course-desc">${course.shortDesc}</p>
        ${toolsHTML}
        <div class="course-features">
          <span class="feature-item">💻 ${course.liveProjects} Projects</span>
          <span class="feature-item">📜 Verified Certificate</span>
          ${course.placementSupport ? '<span class="feature-item" style="color:var(--green); font-weight:700;">🎯 Placement Support</span>' : '<span class="feature-item">💼 Capstone Portfolio</span>'}
          <span class="feature-item">⭐ ${course.rating} (${course.reviews})</span>
        </div>
        <div class="course-footer course-footer-stack">
          ${(typeof isCourseDemoEligible === 'function' ? isCourseDemoEligible(course) : true) ? `
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

/* Filter and Sort Logic supporting optional draft state override */
function filterAndSortCourses(overrideState) {
  let searchVal = '';
  let selectedAcademies = [];
  let selectedProgramLevels = [];
  let selectedModes = [];
  let selectedLevels = [];
  let selectedDurations = [];
  let maxPrice = 100000;
  let placementOnly = false;
  let sortVal = 'popular';

  if (overrideState) {
    searchVal = (overrideState.search || '').toLowerCase().trim();
    selectedAcademies = overrideState.academies || [];
    selectedProgramLevels = (overrideState.programLevels || []).map(normalizeProgramLevel);
    selectedModes = overrideState.modes || [];
    selectedLevels = overrideState.levels || [];
    selectedDurations = overrideState.durations || [];
    maxPrice = (overrideState.maxPrice >= 85000) ? 100000 : (overrideState.maxPrice || 100000);
    placementOnly = !!overrideState.placement;
    sortVal = overrideState.sort || 'popular';
  } else {
    searchVal = document.getElementById('filter-search-input')?.value.toLowerCase().trim() || '';
    selectedAcademies = Array.from(document.querySelectorAll('#filters-sidebar input[name="academy"]:checked')).map(cb => cb.value);
    selectedProgramLevels = Array.from(document.querySelectorAll('#filters-sidebar input[name="programLevel"]:checked')).map(cb => normalizeProgramLevel(cb.value));
    selectedModes = Array.from(document.querySelectorAll('#filters-sidebar input[name="mode"]:checked')).map(cb => cb.value);
    selectedLevels = Array.from(document.querySelectorAll('#filters-sidebar input[name="level"]:checked')).map(cb => cb.value);
    selectedDurations = Array.from(document.querySelectorAll('#filters-sidebar input[name="duration"]:checked')).map(cb => cb.value);
    const priceInput = document.getElementById('filter-price-range');
    maxPrice = (priceInput && parseInt(priceInput.value, 10) >= 85000)
      ? 100000
      : parseInt(priceInput?.value || '100000', 10);
    placementOnly = document.getElementById('filter-placement')?.checked || false;
    sortVal = document.getElementById('sort-select')?.value || document.getElementById('mobile-sort-select')?.value || 'popular';
  }

  let result = getCoursesData().filter(c => {
    const courseLevelNorm = normalizeProgramLevel(c.programLevel);

    // Search across name, shortDesc, fullDesc, academy, tools, programLevel, curriculum titles
    if (searchVal) {
      const matchName = c.name.toLowerCase().includes(searchVal);
      const matchDesc = (c.shortDesc || '').toLowerCase().includes(searchVal) || (c.fullDesc || '').toLowerCase().includes(searchVal);
      const matchAcademy = (c.academy || '').toLowerCase().includes(searchVal);
      const matchLevel = (c.programLevel || '').toLowerCase().includes(searchVal);
      const matchTools = (c.tools || []).some(t => t.toLowerCase().includes(searchVal));
      const matchCurriculum = (c.curriculum || []).some(m => (m.title || '').toLowerCase().includes(searchVal));
      if (!matchName && !matchDesc && !matchAcademy && !matchLevel && !matchTools && !matchCurriculum) return false;
    }
    // Academy filter
    if (selectedAcademies.length > 0 && !selectedAcademies.includes(c.academyId)) return false;

    // Program Level filter
    if (selectedProgramLevels.length > 0) {
      const matchLevel = selectedProgramLevels.some(selectedNorm => {
        return selectedNorm === courseLevelNorm ||
               (c.programLevel && c.programLevel.toLowerCase().includes(selectedNorm.toLowerCase())) ||
               (selectedNorm && selectedNorm.toLowerCase().includes((c.programLevel || '').toLowerCase()));
      });
      if (!matchLevel) return false;
    }

    // Mode filter
    if (selectedModes.length > 0 && !selectedModes.includes(c.mode)) return false;

    // Skill Level filter
    if (selectedLevels.length > 0) {
      const courseLevelLower = (c.level || '').toLowerCase();
      const matchSkill = selectedLevels.some(lvl => {
        const selLower = lvl.toLowerCase();
        if (selLower.includes('begin')) {
          return courseLevelLower.includes('begin') || courseLevelLower.includes('found') || courseLevelLower.includes('basic') || courseLevelLower.includes('junior');
        }
        if (selLower.includes('inter')) {
          return courseLevelLower.includes('inter') || courseLevelLower.includes('applied') || courseLevelLower.includes('specialist');
        }
        if (selLower.includes('adv')) {
          return courseLevelLower.includes('adv') || courseLevelLower.includes('pro') || courseLevelLower.includes('master') || courseLevelLower.includes('career');
        }
        return courseLevelLower.includes(selLower);
      });
      if (!matchSkill) return false;
    }

    // Duration filter
    if (selectedDurations.length > 0) {
      const weeks = c.duration_weeks || (c.durationMonths ? Math.round(c.durationMonths * 4.33) : 4);
      const months = c.durationMonths || Math.round(weeks / 4.33);
      const matchDur = selectedDurations.some(val => {
        if (val === '1-2' || val === '2') {
          return weeks <= 10 || months <= 2;
        }
        if (val === '3-6' || val === '3') {
          return (weeks >= 8 && weeks <= 26) || (months >= 2 && months <= 6);
        }
        if (val === '6-12' || val === '6') {
          return weeks >= 24 || months >= 6;
        }
        return parseInt(val, 10) === months;
      });
      if (!matchDur) return false;
    }

    // Price filter
    if (c.price > maxPrice) return false;

    // Placement support filter
    if (placementOnly && !c.placementSupport) return false;

    return true;
  });

  // Sorting
  if (sortVal === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortVal === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortVal === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortVal === 'latest') {
    result.sort((a, b) => b.id.localeCompare(a.id));
  } else {
    // Popular (default)
    result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.students - a.students);
  }

  return result;
}

/* Event listeners for inputs */
function bindFilterEvents() {
  document.getElementById('filter-search-input')?.addEventListener('input', renderCourses);
  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    const mobSort = document.getElementById('mobile-sort-select');
    if (mobSort) mobSort.value = e.target.value;
    renderCourses();
  });

  document.querySelectorAll('#filters-sidebar input').forEach(input => {
    input.addEventListener('change', () => {
      if (input.id === 'filter-price-range') {
        const display = document.getElementById('price-max-display');
        if (display) display.textContent = `₹${parseInt(input.value,10).toLocaleString('en-IN')}`;
      }
      renderCourses();
    });
  });

  document.getElementById('clear-all-filters')?.addEventListener('click', resetAllFilters);
  document.getElementById('mobile-clear-all')?.addEventListener('click', resetAllFilters);
}

/* Synchronize Mobile and Desktop Sort Selects */
function initMobileSortSync() {
  const mobSort = document.getElementById('mobile-sort-select');
  const deskSort = document.getElementById('sort-select');

  if (mobSort) {
    mobSort.addEventListener('change', () => {
      if (deskSort) deskSort.value = mobSort.value;
      renderCourses();
    });
  }
}

function resetAllFilters() {
  const search = document.getElementById('filter-search-input');
  if (search) search.value = '';

  const sheetSearch = document.getElementById('sheet-search-input');
  if (sheetSearch) sheetSearch.value = '';

  document.querySelectorAll('#filters-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('#mobile-filter-sheet input[type="checkbox"]').forEach(cb => cb.checked = false);

  const priceRange = document.getElementById('filter-price-range');
  if (priceRange) {
    priceRange.value = 90000;
    const display = document.getElementById('price-max-display');
    if (display) display.textContent = '₹90,000';
  }

  const sheetPrice = document.getElementById('sheet-price-range');
  if (sheetPrice) {
    sheetPrice.value = 90000;
    const sheetBadge = document.getElementById('sheet-price-badge');
    if (sheetBadge) sheetBadge.textContent = 'Up to ₹90,000+';
  }

  const placement = document.getElementById('filter-placement');
  if (placement) placement.checked = false;

  const quickTracks = document.getElementById('courses-quick-tracks');
  if (quickTracks) {
    quickTracks.querySelectorAll('.quick-track-btn').forEach(b => b.classList.remove('active'));
    quickTracks.querySelector('.quick-track-btn[data-track="all"]')?.classList.add('active');
  }

  renderCourses();
}
window.resetAllFilters = resetAllFilters;

/* Active Filter Chips for Desktop and Mobile */
function updateActiveFilterChips() {
  const desktopBar = document.getElementById('active-filters-bar');
  const mobileBar = document.getElementById('mobile-active-chips');
  const mobileClearBtn = document.getElementById('mobile-clear-all');
  const badge = document.getElementById('mobile-filter-count-badge');

  const chips = [];
  const searchVal = document.getElementById('filter-search-input')?.value.trim();
  if (searchVal) {
    chips.push({
      label: `"${searchVal}"`,
      clear: () => {
        const s1 = document.getElementById('filter-search-input');
        if (s1) s1.value = '';
        renderCourses();
      }
    });
  }

  document.querySelectorAll('#filters-sidebar input[name="academy"]:checked').forEach(cb => {
    const name = cb.closest('label').querySelector('span')?.textContent || cb.value;
    chips.push({
      label: name,
      clear: () => {
        cb.checked = false;
        renderCourses();
      }
    });
  });

  document.querySelectorAll('#filters-sidebar input[name="programLevel"]:checked').forEach(cb => {
    const labelText = cb.closest('label')?.textContent.trim() || cb.value;
    chips.push({
      label: labelText,
      clear: () => {
        cb.checked = false;
        renderCourses();
      }
    });
  });

  document.querySelectorAll('#filters-sidebar input[name="mode"]:checked').forEach(cb => {
    chips.push({
      label: cb.value,
      clear: () => {
        cb.checked = false;
        renderCourses();
      }
    });
  });

  document.querySelectorAll('#filters-sidebar input[name="level"]:checked').forEach(cb => {
    chips.push({
      label: cb.value,
      clear: () => {
        cb.checked = false;
        renderCourses();
      }
    });
  });

  document.querySelectorAll('#filters-sidebar input[name="duration"]:checked').forEach(cb => {
    const labelText = cb.closest('label')?.textContent.trim() || cb.value;
    chips.push({
      label: labelText,
      clear: () => {
        cb.checked = false;
        renderCourses();
      }
    });
  });

  const priceInput = document.getElementById('filter-price-range');
  if (priceInput && parseInt(priceInput.value, 10) < 85000) {
    const valFormatted = parseInt(priceInput.value, 10).toLocaleString('en-IN');
    chips.push({
      label: `Under ₹${valFormatted}`,
      clear: () => {
        priceInput.value = 90000;
        const display = document.getElementById('price-max-display');
        if (display) display.textContent = '₹90,000';
        renderCourses();
      }
    });
  }

  const placementCb = document.getElementById('filter-placement');
  if (placementCb && placementCb.checked) {
    chips.push({
      label: '🎯 Placement Support',
      clear: () => {
        placementCb.checked = false;
        renderCourses();
      }
    });
  }

  window._activeChips = chips;

  // Update Desktop Chips
  if (desktopBar) {
    if (chips.length === 0) {
      desktopBar.innerHTML = '';
      desktopBar.setAttribute('hidden', '');
    } else {
      desktopBar.removeAttribute('hidden');
      desktopBar.innerHTML = chips.map((c, i) => `
        <span class="filter-chip">
          ${c.label}
          <button type="button" class="filter-chip-remove" onclick="removeChip(${i})" aria-label="Remove filter ${c.label}">✕</button>
        </span>
      `).join('');
    }
  }

  // Update Mobile Chips
  if (mobileBar) {
    if (chips.length === 0) {
      mobileBar.innerHTML = '';
      mobileBar.style.display = 'none';
    } else {
      mobileBar.style.display = 'flex';
      mobileBar.innerHTML = chips.map((c, i) => `
        <span class="mobile-chip">
          <span>${c.label}</span>
          <button type="button" class="mobile-chip-remove" onclick="removeChip(${i})" aria-label="Remove filter ${c.label}">✕</button>
        </span>
      `).join('');
    }
  }

  // Update Mobile Results Clear All Button
  if (mobileClearBtn) {
    mobileClearBtn.style.display = chips.length > 0 ? 'inline-block' : 'none';
  }

  // Update Mobile Filter Badge
  if (badge) {
    if (chips.length > 0) {
      badge.textContent = chips.length;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

window.removeChip = (index) => {
  if (window._activeChips && window._activeChips[index]) {
    window._activeChips[index].clear();
  }
};

/* ============================================================
   MOBILE FILTER BOTTOM SHEET CONTROLLER
   Draft state management, live preview count, apply, reset, trap focus
   ============================================================ */
function initMobileFilterSheet() {
  const openBtn = document.getElementById('open-mobile-filters');
  const closeBtn = document.getElementById('close-mobile-filters');
  const backdrop = document.getElementById('mobile-sheet-backdrop');
  const sheet = document.getElementById('mobile-filter-sheet');
  const resetBtn = document.getElementById('sheet-reset-btn');
  const applyBtn = document.getElementById('sheet-apply-btn');
  const previewCountEl = document.getElementById('sheet-preview-count');
  const sheetSearch = document.getElementById('sheet-search-input');
  const sheetSearchClear = document.getElementById('sheet-search-clear');
  const sheetPriceRange = document.getElementById('sheet-price-range');
  const sheetPriceBadge = document.getElementById('sheet-price-badge');

  if (!openBtn || !sheet) return;

  function computeDraftStateFromSheet() {
    const academies = Array.from(sheet.querySelectorAll('input[name="sheet-academy"]:checked')).map(cb => cb.value);
    const programLevels = Array.from(sheet.querySelectorAll('input[name="sheet-programLevel"]:checked')).map(cb => cb.value);
    const levels = Array.from(sheet.querySelectorAll('input[name="sheet-level"]:checked')).map(cb => cb.value);
    const durations = Array.from(sheet.querySelectorAll('input[name="sheet-duration"]:checked')).map(cb => cb.value);
    const priceVal = parseInt(sheetPriceRange?.value || '90000', 10);
    const placement = document.getElementById('sheet-placement-support')?.checked || false;
    const search = sheetSearch?.value.trim() || '';

    return {
      search,
      academies,
      programLevels,
      levels,
      durations,
      maxPrice: priceVal,
      placement
    };
  }

  function updateSheetPreviewCount() {
    if (!previewCountEl) return;
    const draft = computeDraftStateFromSheet();
    const matches = filterAndSortCourses(draft);
    previewCountEl.textContent = matches.length;
  }

  function syncDraftFromApplied() {
    // 1. Search
    const appliedSearch = document.getElementById('filter-search-input')?.value || '';
    if (sheetSearch) {
      sheetSearch.value = appliedSearch;
      if (sheetSearchClear) sheetSearchClear.style.display = appliedSearch ? 'flex' : 'none';
    }

    // 2. Academies
    const appliedAcademies = Array.from(document.querySelectorAll('#filters-sidebar input[name="academy"]:checked')).map(cb => cb.value);
    sheet.querySelectorAll('input[name="sheet-academy"]').forEach(cb => {
      cb.checked = appliedAcademies.includes(cb.value);
    });

    // 3. Program Levels
    const appliedLevels = Array.from(document.querySelectorAll('#filters-sidebar input[name="programLevel"]:checked')).map(cb => normalizeProgramLevel(cb.value));
    sheet.querySelectorAll('input[name="sheet-programLevel"]').forEach(cb => {
      cb.checked = appliedLevels.includes(normalizeProgramLevel(cb.value));
    });

    // 4. Skill Levels
    const appliedSkills = Array.from(document.querySelectorAll('#filters-sidebar input[name="level"]:checked')).map(cb => cb.value);
    sheet.querySelectorAll('input[name="sheet-level"]').forEach(cb => {
      cb.checked = appliedSkills.includes(cb.value);
    });

    // 5. Durations
    const appliedDurs = Array.from(document.querySelectorAll('#filters-sidebar input[name="duration"]:checked')).map(cb => cb.value);
    sheet.querySelectorAll('input[name="sheet-duration"]').forEach(cb => {
      cb.checked = appliedDurs.includes(cb.value);
    });

    // 6. Price
    const appliedPrice = parseInt(document.getElementById('filter-price-range')?.value || '90000', 10);
    if (sheetPriceRange) sheetPriceRange.value = appliedPrice;
    if (sheetPriceBadge) {
      sheetPriceBadge.textContent = appliedPrice >= 85000 ? 'Up to ₹90,000+' : `Up to ₹${appliedPrice.toLocaleString('en-IN')}`;
    }

    // 7. Placement
    const appliedPlacement = document.getElementById('filter-placement')?.checked || false;
    const sheetPlacement = document.getElementById('sheet-placement-support');
    if (sheetPlacement) sheetPlacement.checked = appliedPlacement;

    updateSheetPreviewCount();
  }

  function openSheet() {
    syncDraftFromApplied();
    backdrop?.classList.add('open');
    sheet?.classList.add('open');
    openBtn.setAttribute('aria-expanded', 'true');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('filter-sheet-open');

    // Focus first interactive element in sheet
    setTimeout(() => {
      const first = sheet.querySelector('input, button');
      first?.focus();
    }, 100);
  }

  function closeSheet() {
    backdrop?.classList.remove('open');
    sheet?.classList.remove('open');
    openBtn.setAttribute('aria-expanded', 'false');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.classList.remove('filter-sheet-open');
    openBtn.focus();
  }

  function applyDraftFilters() {
    const draft = computeDraftStateFromSheet();

    // 1. Sync Search to Desktop
    const deskSearch = document.getElementById('filter-search-input');
    if (deskSearch) deskSearch.value = draft.search;

    // 2. Sync Academies
    document.querySelectorAll('#filters-sidebar input[name="academy"]').forEach(cb => {
      cb.checked = draft.academies.includes(cb.value);
    });

    // 3. Sync Program Levels
    document.querySelectorAll('#filters-sidebar input[name="programLevel"]').forEach(cb => {
      cb.checked = draft.programLevels.includes(cb.value);
    });

    // 4. Sync Skill Levels
    document.querySelectorAll('#filters-sidebar input[name="level"]').forEach(cb => {
      cb.checked = draft.levels.includes(cb.value);
    });

    // 5. Sync Durations
    document.querySelectorAll('#filters-sidebar input[name="duration"]').forEach(cb => {
      cb.checked = draft.durations.includes(cb.value);
    });

    // 6. Sync Price
    const deskPrice = document.getElementById('filter-price-range');
    if (deskPrice) {
      deskPrice.value = draft.maxPrice;
      const display = document.getElementById('price-max-display');
      if (display) display.textContent = `₹${draft.maxPrice.toLocaleString('en-IN')}`;
    }

    // 7. Sync Placement
    const deskPlacement = document.getElementById('filter-placement');
    if (deskPlacement) deskPlacement.checked = draft.placement;

    closeSheet();
    renderCourses();
  }

  function resetDraftFilters() {
    sheet.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (cb.id === 'sheet-verified-certificate') cb.checked = true;
      else cb.checked = false;
    });
    if (sheetPriceRange) {
      sheetPriceRange.value = 90000;
      if (sheetPriceBadge) sheetPriceBadge.textContent = 'Up to ₹90,000+';
    }
    if (sheetSearch) {
      sheetSearch.value = '';
      if (sheetSearchClear) sheetSearchClear.style.display = 'none';
    }
    updateSheetPreviewCount();
  }

  // Event Listeners for Sheet controls
  openBtn.addEventListener('click', openSheet);
  closeBtn?.addEventListener('click', closeSheet);
  backdrop?.addEventListener('click', closeSheet);
  resetBtn?.addEventListener('click', resetDraftFilters);
  applyBtn?.addEventListener('click', applyDraftFilters);

  // Live input changes in sheet
  sheet.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateSheetPreviewCount);
  });

  sheetPriceRange?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    if (sheetPriceBadge) {
      sheetPriceBadge.textContent = val >= 85000 ? 'Up to ₹90,000+' : `Up to ₹${val.toLocaleString('en-IN')}`;
    }
    updateSheetPreviewCount();
  });

  sheetSearch?.addEventListener('input', (e) => {
    if (sheetSearchClear) {
      sheetSearchClear.style.display = e.target.value ? 'flex' : 'none';
    }
    updateSheetPreviewCount();
  });

  sheetSearchClear?.addEventListener('click', () => {
    if (sheetSearch) sheetSearch.value = '';
    sheetSearchClear.style.display = 'none';
    updateSheetPreviewCount();
    sheetSearch?.focus();
  });

  // Keyboard accessibility (ESC closes, focus trap)
  document.addEventListener('keydown', (e) => {
    if (!sheet.classList.contains('open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeSheet();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = Array.from(sheet.querySelectorAll('button, input, [tabindex="0"]')).filter(el => !el.disabled && el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
}

/* Quick Program Track Tabs logic (Desktop) */
function initQuickTrackTabs() {
  const container = document.getElementById('courses-quick-tracks');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-track-btn');
    if (!btn) return;

    container.querySelectorAll('.quick-track-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const track = btn.dataset.track;

    document.querySelectorAll('#filters-sidebar input[name="programLevel"]').forEach(cb => cb.checked = false);
    const placementCb = document.getElementById('filter-placement');
    if (placementCb) placementCb.checked = false;

    if (track === 'all') {
      // Nothing checked -> shows all 109 programs
    } else if (track === 'placement') {
      if (placementCb) placementCb.checked = true;
    } else {
      const matchCb = Array.from(document.querySelectorAll('#filters-sidebar input[name="programLevel"]')).find(cb => cb.value.includes(track) || track.includes(cb.value));
      if (matchCb) matchCb.checked = true;
    }

    renderCourses();
  });
}

function syncQuickTrackTabState() {
  const container = document.getElementById('courses-quick-tracks');
  if (!container) return;

  const checkedLevels = Array.from(document.querySelectorAll('#filters-sidebar input[name="programLevel"]:checked')).map(cb => cb.value);
  const placementChecked = document.getElementById('filter-placement')?.checked || false;

  container.querySelectorAll('.quick-track-btn').forEach(b => b.classList.remove('active'));

  if (placementChecked && checkedLevels.length === 0) {
    container.querySelector('.quick-track-btn[data-track="placement"]')?.classList.add('active');
  } else if (checkedLevels.length === 1) {
    const lvl = checkedLevels[0];
    const matchBtn = Array.from(container.querySelectorAll('.quick-track-btn')).find(b => b.dataset.track && (lvl.includes(b.dataset.track) || b.dataset.track.includes(lvl)));
    if (matchBtn) matchBtn.classList.add('active');
    else container.querySelector('.quick-track-btn[data-track="all"]')?.classList.add('active');
  } else {
    container.querySelector('.quick-track-btn[data-track="all"]')?.classList.add('active');
  }
}
