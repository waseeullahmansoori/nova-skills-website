/* ============================================================
   NOVA SKILLS – Academy Landing Engine (2026 Premium Edition)
   ============================================================ */

let initRetryCount = 0;

const ALIAS_MAP = {
  'nocode': 'no-code-web',
  'video': 'video-motion',
  'office': 'office-productivity',
  'career': 'career-freelancing',
  'kids': 'kids-tech'
};

document.addEventListener('DOMContentLoaded', () => {
  initAcademyPage();
});

function getAcademySlug() {
  const path = window.location.pathname.replace(/\/$/, '');
  const parts = path.split('/').filter(Boolean);
  
  if (parts.length >= 2 && parts[0] === 'academies') {
    const slug = parts[1];
    if (slug !== 'index.html') {
      return decodeURIComponent(slug).toLowerCase().trim();
    }
  }

  const params = new URLSearchParams(window.location.search);
  const paramSlug = params.get('academy') || params.get('id');
  if (paramSlug) {
    return decodeURIComponent(paramSlug).toLowerCase().trim();
  }

  return null;
}

function normalizeProgramLevel(level) {
  if (!level) return '';
  const str = String(level).trim().toLowerCase();
  if (str.includes('career')) return 'Career Program';
  if (str.includes('professional')) return 'Professional Program';
  if (str.includes('cert')) return 'Certification Course';
  return level;
}

function toggleFaq(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector('.faq-toggle-icon');
  const isOpen = content.style.display === 'block';
  
  const allContents = document.querySelectorAll('.faq-answer-block');
  const allIcons = document.querySelectorAll('.faq-toggle-icon');
  allContents.forEach(c => c.style.display = 'none');
  allIcons.forEach(i => i.textContent = '+');

  if (!isOpen && content) {
    content.style.display = 'block';
    if (icon) icon.textContent = '−';
  }
}
window.toggleFaq = toggleFaq;

function openCurriculumNotice(academyName) {
  if (typeof openConsultationPopup === 'function') {
    openConsultationPopup();
  } else {
    alert(`Curriculum syllabus request received for ${academyName}! Our counsellor will share the detailed PDF on your phone.`);
  }
}
window.openCurriculumNotice = openCurriculumNotice;

function filterExplorerCourses(targetLevel, btnElement) {
  const tabs = document.querySelectorAll('.explorer-tab-btn');
  tabs.forEach(t => {
    t.style.background = '#f1f5f9';
    t.style.color = '#334155';
    t.style.borderColor = '#e2e8f0';
  });

  if (btnElement) {
    btnElement.style.background = '#011731';
    btnElement.style.color = '#ffffff';
    btnElement.style.borderColor = '#011731';
  }

  const cards = document.querySelectorAll('.explorer-course-item');
  cards.forEach(card => {
    const cardLevel = card.getAttribute('data-level') || '';
    if (targetLevel === 'all' || cardLevel === targetLevel) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}
window.filterExplorerCourses = filterExplorerCourses;

function searchExplorerCourses(query) {
  const searchTerm = (query || '').toLowerCase().trim();
  const cards = document.querySelectorAll('.explorer-course-item');
  
  cards.forEach(card => {
    const title = (card.getAttribute('data-title') || '').toLowerCase();
    const desc = (card.getAttribute('data-desc') || '').toLowerCase();
    
    if (!searchTerm || title.includes(searchTerm) || desc.includes(searchTerm)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}
window.searchExplorerCourses = searchExplorerCourses;

function getSmartRelatedAcademies(currentSlug) {
  const smartMap = {
    'digital-marketing': ['ai', 'creator', 'no-code-web', 'communication'],
    'ai': ['programming', 'digital-marketing', 'no-code-web', '3d'],
    'design': ['video-motion', 'creator', '3d', 'no-code-web'],
    'programming': ['ai', 'no-code-web', '3d', 'office-productivity'],
    'no-code-web': ['digital-marketing', 'programming', 'design', 'ai'],
    'video-motion': ['creator', 'design', '3d', 'digital-marketing'],
    '3d': ['design', 'video-motion', 'programming', 'ai'],
    'career-freelancing': ['communication', 'office-productivity', 'digital-marketing', 'ai'],
    'communication': ['career-freelancing', 'office-productivity', 'digital-marketing', 'creator'],
    'kids-tech': ['programming', 'ai', 'design', 'video-motion'],
    'creator': ['video-motion', 'digital-marketing', 'design', 'communication'],
    'office-productivity': ['communication', 'career-freelancing', 'digital-marketing', 'programming']
  };

  const targetSlugs = smartMap[currentSlug] || ['ai', 'digital-marketing', 'design', 'programming'];
  
  let academiesList = (typeof NS_ACADEMIES !== 'undefined' && Array.isArray(NS_ACADEMIES))
    ? NS_ACADEMIES
    : ((typeof window !== 'undefined' && Array.isArray(window.NS_ACADEMIES)) ? window.NS_ACADEMIES : []);

  if (!academiesList || academiesList.length === 0) return [];
  
  return targetSlugs
    .map(slug => academiesList.find(a => a.slug === slug || a.id === slug))
    .filter(Boolean)
    .slice(0, 4);
}

function injectAcademySEOAndSchema(academy, landingData, totalCoursesCount) {
  const canonicalUrl = `https://novaskills.in/academies/${academy.slug}/`;
  const pageTitle = `${academy.name} — Nova Skills Education Institute`;
  const metaDesc = `Master ${academy.name} with 100% practical training, live client projects, ISO certification & placement support at Nova Skills Institute.`;
  const ogImage = `https://novaskills.in/public/images/seo/og-academies.png`;

  // 1. Page Title
  document.title = pageTitle;

  // 2. Helpers for Meta & Link Tags
  const setMetaTag = (selector, attr, attrVal, content) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const setLinkTag = (rel, href) => {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // SEO & Indexing Meta
  setMetaTag('meta[name="description"]', 'name', 'description', metaDesc);
  setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setLinkTag('canonical', canonicalUrl);

  // Open Graph Meta
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDesc);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Nova Skills');

  // Twitter Meta
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metaDesc);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

  // 3. Structured Data JSON-LD
  let schemaScript = document.getElementById('academy-jsonld-schema');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'academy-jsonld-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  const faqs = landingData.faqs || [];
  const faqSchema = faqs.length > 0 ? {
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  } : null;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": pageTitle,
        "description": metaDesc,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://novaskills.in/#website",
          "name": "Nova Skills",
          "url": "https://novaskills.in/"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
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
            "name": "Academies",
            "item": "https://novaskills.in/courses.html"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": academy.name,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${canonicalUrl}#program`,
        "name": academy.name,
        "description": academy.description,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Nova Skills Education Institute",
          "url": "https://novaskills.in"
        },
        "educationalProgramMode": "Hybrid",
        "numberOfCredits": totalCoursesCount
      },
      ...(faqSchema ? [faqSchema] : [])
    ]
  };

  schemaScript.textContent = JSON.stringify(schemaData, null, 2);
}

function initAcademyPage() {
  const slug = getAcademySlug();

  let academiesList = (typeof NS_ACADEMIES !== 'undefined' && Array.isArray(NS_ACADEMIES))
    ? NS_ACADEMIES
    : ((typeof window !== 'undefined' && Array.isArray(window.NS_ACADEMIES)) ? window.NS_ACADEMIES : null);

  if (!academiesList && initRetryCount < 30) {
    initRetryCount++;
    setTimeout(initAcademyPage, 50);
    return;
  }

  let academy = null;
  if (slug && academiesList && academiesList.length > 0) {
    const targetSlug = ALIAS_MAP[slug] || slug;
    academy = academiesList.find(a => 
      (a.slug && a.slug.toLowerCase() === targetSlug) || 
      (a.id && a.id.toLowerCase() === targetSlug) ||
      (a.slug && a.slug.toLowerCase() === slug) || 
      (a.id && a.id.toLowerCase() === slug) ||
      (a.slug && a.slug.toLowerCase().replace(/-/g, '') === slug.replace(/-/g, '')) ||
      (a.id && a.id.toLowerCase().replace(/-/g, '') === slug.replace(/-/g, ''))
    );
  }

  const heroSection = document.getElementById('academy-hero-section');
  const sectionsContainer = document.getElementById('academy-sections-container');
  const notFoundSection = document.getElementById('academy-404-container');

  if (!academy) {
    if (heroSection) heroSection.style.display = 'none';
    if (sectionsContainer) sectionsContainer.style.display = 'none';
    if (notFoundSection) notFoundSection.style.display = 'block';
    document.title = 'Academy Not Found — Nova Skills Institute';
    return;
  }

  if (notFoundSection) notFoundSection.style.display = 'none';
  if (heroSection) heroSection.style.display = 'block';
  if (sectionsContainer) sectionsContainer.style.display = 'block';

  renderAcademyLandingPage(academy);
}

function buildCourseCardHTML(course, extraClass = '') {
  const safeName = (course.name || '').replace(/'/g, "\\'");
  const safeAcademy = (course.academy || '').replace(/'/g, "\\'");
  const origPrice = course.originalPrice ? `₹${course.originalPrice.toLocaleString('en-IN')}` : '';
  const isFeatured = course.featured || (course.tags && course.tags.includes('popular'));
  const liveProj = course.liveProjects || 2;
  const rating = course.rating || 4.8;
  const reviews = course.reviews || 120;
  const normLevel = normalizeProgramLevel(course.programLevel || course.level);

  return `
    <div class="course-card ${extraClass}" data-category="${course.academyId}" data-level="${normLevel}" data-title="${(course.name || '').replace(/"/g, '&quot;')}" data-desc="${(course.shortDesc || '').replace(/"/g, '&quot;')}">
      ${isFeatured ? '<span class="course-hot-tag">🔥 Popular</span>' : ''}
      <div class="course-thumbnail">
        <div class="course-thumb-bg" style="background:${course.color || 'linear-gradient(135deg, #0599a8, #011731)'}">
          <span style="font-size:3.5rem; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.2));">${course.icon || '🎓'}</span>
        </div>
        <div class="course-badge-overlay">
          <span class="course-level-badge">${normLevel || course.level || 'All Levels'}</span>
        </div>
        <div class="course-duration-badge">⏱️ ${course.duration || 'Flexible'}</div>
      </div>
      <div class="course-body">
        <div class="course-academy-tag">${course.icon || '🎓'} ${course.academy || ''}</div>
        <h3 class="course-title"><a href="/course-detail.html?id=${course.id}">${course.name}</a></h3>
        <p class="course-desc">${course.shortDesc || course.description || ''}</p>
        <div class="course-features">
          <span class="feature-item">💻 ${liveProj}+ Live Projects</span>
          <span class="feature-item">📜 ISO Certificate</span>
          ${course.placementSupport ? '<span class="feature-item" style="color:var(--green); font-weight:700;">🎯 Placement Support</span>' : ''}
          <span class="feature-item">⭐ ${rating} (${reviews})</span>
        </div>
        <div class="course-footer" style="flex-direction:column; gap:12px; align-items:stretch;">
          <div class="course-pricing" style="display:flex; justify-content:space-between; align-items:baseline;">
            <span class="price-current">₹${course.price ? course.price.toLocaleString('en-IN') : 'Free'}</span>
            ${origPrice ? `<span class="price-original">${origPrice}</span>` : ''}
          </div>
          <div style="display:flex; gap:10px; width:100%; margin-top:8px;">
            <a href="/course-detail.html?id=${course.id}" class="btn btn-outline btn-sm" style="flex:1; text-align:center; justify-content:center;">View Details</a>
            <button type="button" class="btn btn-primary btn-sm" style="flex:1; justify-content:center;" onclick="openEnrollmentModal('${safeName}', '${safeAcademy}')">Enroll Now →</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAcademyLandingPage(academy) {
  // 1. Retrieve Courses & Filter for Academy
  const allCourses = (typeof NS_COURSES !== 'undefined' && Array.isArray(NS_COURSES)) ? NS_COURSES : [];
  const academyCourses = allCourses.filter(c => 
    c.academyId === academy.id || 
    c.academyId === academy.slug
  );

  const careerCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel || c.level) === 'Career Program');
  const proCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel || c.level) === 'Professional Program');
  const certCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel || c.level) === 'Certification Course');
  const totalCourses = academyCourses.length;

  const durationMonthsArr = academyCourses
    .map(c => c.durationMonths || parseInt(c.duration, 10))
    .filter(n => !isNaN(n) && n > 0);

  let learningDuration = '1–12 Months';
  if (durationMonthsArr.length > 0) {
    const minM = Math.min(...durationMonthsArr);
    const maxM = Math.max(...durationMonthsArr);
    if (minM === maxM) {
      learningDuration = `${minM} Month${minM > 1 ? 's' : ''}`;
    } else {
      learningDuration = `${minM}–${maxM} Months`;
    }
  }

  // Retrieve Landing Data
  const landingData = (typeof NS_ACADEMY_LANDING_DATA !== 'undefined')
    ? (NS_ACADEMY_LANDING_DATA[academy.slug] || NS_ACADEMY_LANDING_DATA[academy.id] || {})
    : {};

  // Inject SEO Meta & JSON-LD Schema
  injectAcademySEOAndSchema(academy, landingData, totalCourses);

  // Update Breadcrumb
  const breadcrumbSelected = document.getElementById('breadcrumb-selected-academy');
  if (breadcrumbSelected) {
    breadcrumbSelected.textContent = academy.name;
    breadcrumbSelected.setAttribute('href', `/academies/${academy.slug}/`);
  }

  // ----------------------------------------------------
  // 1. Hero Section Setup
  // ----------------------------------------------------
  const iconEl = document.getElementById('academy-icon-display');
  const nameEl = document.getElementById('academy-name-display');
  const descEl = document.getElementById('academy-desc-display');

  if (iconEl) iconEl.textContent = academy.icon || '🎓';
  if (nameEl) nameEl.textContent = academy.name;
  if (descEl) {
    const headline = landingData.headline ? `<strong style="display:block; font-size:1.25rem; color:#75d766; margin-bottom:8px;">${landingData.headline}</strong>` : '';
    descEl.innerHTML = `${headline}${academy.description}`;
  }

  const statsContainer = document.getElementById('academy-stats-pills');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <span class="stats-pill">💼 Career Programs: ${careerCourses.length}</span>
      <span class="stats-pill">⚡ Professional Programs: ${proCourses.length}</span>
      <span class="stats-pill">📜 Certification Courses: ${certCourses.length}</span>
      <span class="stats-pill">📚 Total Courses: ${totalCourses}</span>
      <span class="stats-pill">⏱️ Learning Duration: ${learningDuration}</span>
    `;
  }

  const enrollBtn = document.getElementById('btn-enroll-now');
  const consultationBtn = document.getElementById('btn-free-consultation');

  if (enrollBtn) {
    enrollBtn.onclick = () => {
      if (typeof openEnrollmentModal === 'function') openEnrollmentModal('', academy.name);
      else if (typeof openConsultationPopup === 'function') openConsultationPopup();
    };
  }
  if (consultationBtn) {
    consultationBtn.onclick = () => {
      if (typeof openConsultationPopup === 'function') openConsultationPopup();
    };
  }

  const mainContainer = document.getElementById('academy-sections-container');
  if (!mainContainer) return;

  let html = '';

  // ----------------------------------------------------
  // 2. Academy Overview
  // ----------------------------------------------------
  const overview = landingData.overview || {
    intro: `${academy.name} provides end-to-end practical skills training to launch and scale high-growth careers in modern industry.`,
    benefits: ["100% Practical Training on Real Projects", "Live Mentor Guidance & Code Reviews", "ISO-Recognized Industry Certification", "Dedicated Placement & Freelance Support"],
    outcomes: ["Build verifiable portfolio projects", "Gain mastery in modern industry software tools", "Qualify for high-paying job opportunities", "Launch freelance or agency business paths"]
  };

  const skillsList = landingData.skills || [
    "Practical Tool Skills", "Industry Best Practices", "AI-Powered Workflows", "Portfolio Building",
    "Client Project Delivery", "Technical Problem Solving", "Career Strategy", "Professional Certification"
  ];

  const toolsList = landingData.tools || [
    { "name": "Industry Software", "icon": "🛠️" },
    { "name": "AI Productivity Tools", "icon": "🤖" },
    { "name": "Cloud & Analytics Platforms", "icon": "☁️" },
    { "name": "Collaboration Tools", "icon": "⚡" }
  ];

  html += `
    <section class="section-academy-overview" style="padding: 72px 0; background: #ffffff; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <span class="section-tag" style="background: rgba(1, 23, 49, 0.08); color: #011731;">ACADEMY OVERVIEW & OUTCOMES</span>
          <h2 class="section-title">Master ${academy.name}</h2>
          <p class="section-subtitle" style="max-width: 760px; margin: 0 auto; color: #475569; font-size: 1.05rem;">
            ${overview.intro}
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px;">
          <!-- Industry Benefits -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 32px; border-radius: 18px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px;">
              <span style="font-size:1.8rem; background:rgba(5,153,168,0.1); width:48px; height:48px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; color:#0599a8;">🏆</span>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #011731; margin: 0;">Industry Benefits</h3>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
              ${(overview.benefits || []).map(b => `<li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#0599a8; font-weight:800;">✓</span> <span>${b}</span></li>`).join('')}
            </ul>
          </div>

          <!-- Career Outcomes -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 32px; border-radius: 18px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px;">
              <span style="font-size:1.8rem; background:rgba(117,215,102,0.15); width:48px; height:48px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; color:#2e7d32;">🎯</span>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #011731; margin: 0;">Career Outcomes</h3>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
              ${(overview.outcomes || []).map(o => `<li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#75d766; font-weight:800;">🎯</span> <span>${o}</span></li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 3. Career Roadmap
  // ----------------------------------------------------
  html += `
    <section class="section-career-roadmap" style="padding: 80px 0; background: #011731; color: white;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 56px;">
          <span class="section-tag" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">STRUCTURED LEARNING JOURNEY</span>
          <h2 class="section-title" style="color: white;">Visual Career Roadmap</h2>
          <p class="section-subtitle" style="color: #94a3b8; max-width: 680px; margin: 0 auto;">
            Step-by-step career progression from tool fundamentals to high-paying employment & client retainers.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; align-items: stretch;">
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">🌱</div>
            <span style="font-size: 0.75rem; background: rgba(56,189,248,0.2); color: #38bdf8; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 1</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Beginner</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Tool Orientation & Basics</p>
          </div>

          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">🏛️</div>
            <span style="font-size: 0.75rem; background: rgba(5,153,168,0.2); color: #0599a8; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 2</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Foundation</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Core Concepts & Practical Drills</p>
          </div>

          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">💻</div>
            <span style="font-size: 0.75rem; background: rgba(37,99,235,0.2); color: #60a5fa; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 3</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Projects</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Real Client Case Studies</p>
          </div>

          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">💼</div>
            <span style="font-size: 0.75rem; background: rgba(139,92,246,0.2); color: #c084fc; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 4</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Internship</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Agency & Live Lab Training</p>
          </div>

          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">📜</div>
            <span style="font-size: 0.75rem; background: rgba(234,179,8,0.2); color: #facc15; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 5</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Certification</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">ISO Recognized Verification</p>
          </div>

          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">🎯</div>
            <span style="font-size: 0.75rem; background: rgba(16,185,129,0.2); color: #34d399; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 6</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Placement</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Job Referrals & Freelance</p>
          </div>

          <div style="background: linear-gradient(135deg, rgba(5,153,168,0.3), rgba(117,215,102,0.3)); border: 1px solid #75d766; padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">🚀</div>
            <span style="font-size: 0.75rem; background: #75d766; color: #011731; padding: 2px 8px; border-radius: 50px; font-weight: 800; display: inline-block; margin-bottom: 8px;">GOAL</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Advanced Career</h4>
            <p style="font-size: 0.8rem; color: #e2e8f0; margin: 0;">Senior Lead & Agency Scale</p>
          </div>
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 4. Programs Offered
  // ----------------------------------------------------
  if (careerCourses.length > 0) {
    html += `
      <section class="section-career-programs" style="padding: 72px 0; background: white; border-bottom: 1px solid #e2e8f0;">
        <div class="container">
          <div class="section-header" style="text-align: left; margin-bottom: 36px;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
              <div>
                <span class="section-tag" style="background: rgba(1, 23, 49, 0.08); color: var(--navy);">6–12 MONTH TRANSFORMATION</span>
                <h2 class="section-title" style="margin-bottom: 0;">Career Programs</h2>
              </div>
              <span style="background: rgba(5, 153, 168, 0.1); color: #0599a8; padding: 6px 16px; border-radius: 50px; font-weight: 700; font-size: 0.9rem;">
                ${careerCourses.length} ${careerCourses.length === 1 ? 'Program' : 'Programs'}
              </span>
            </div>
          </div>
          <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
            ${careerCourses.map(c => buildCourseCardHTML(c)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  if (proCourses.length > 0) {
    html += `
      <section class="section-pro-programs" style="padding: 72px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
        <div class="container">
          <div class="section-header" style="text-align: left; margin-bottom: 36px;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
              <div>
                <span class="section-tag" style="background: rgba(5, 153, 168, 0.1); color: var(--teal);">3–6 MONTH SKILL MASTERY</span>
                <h2 class="section-title" style="margin-bottom: 0;">Professional Programs</h2>
              </div>
              <span style="background: rgba(5, 153, 168, 0.1); color: #0599a8; padding: 6px 16px; border-radius: 50px; font-weight: 700; font-size: 0.9rem;">
                ${proCourses.length} ${proCourses.length === 1 ? 'Program' : 'Programs'}
              </span>
            </div>
          </div>
          <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
            ${proCourses.map(c => buildCourseCardHTML(c)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  if (certCourses.length > 0) {
    html += `
      <section class="section-cert-courses" style="padding: 72px 0; background: white; border-bottom: 1px solid #e2e8f0;">
        <div class="container">
          <div class="section-header" style="text-align: left; margin-bottom: 36px;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
              <div>
                <span class="section-tag" style="background: rgba(117, 215, 102, 0.15); color: #2e7d32;">1–2 MONTH FOCUSED SKILLS</span>
                <h2 class="section-title" style="margin-bottom: 0;">Certification Courses</h2>
              </div>
              <span style="background: rgba(5, 153, 168, 0.1); color: #0599a8; padding: 6px 16px; border-radius: 50px; font-weight: 700; font-size: 0.9rem;">
                ${certCourses.length} ${certCourses.length === 1 ? 'Course' : 'Courses'}
              </span>
            </div>
          </div>
          <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
            ${certCourses.map(c => buildCourseCardHTML(c)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ----------------------------------------------------
  // 5. Course Explorer (Interactive Tabbed Filter Grid)
  // ----------------------------------------------------
  html += `
    <section class="section-course-explorer" style="padding: 80px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <span class="section-tag">DYNAMIC COURSE EXPLORER</span>
          <h2 class="section-title">Explore All ${academy.name} Offerings</h2>
          <p class="section-subtitle">Filter programs by duration and career depth to find your ideal learning track.</p>
        </div>

        <!-- Filter Controls & Search -->
        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; margin-bottom: 32px; background: white; padding: 16px 20px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <button type="button" class="explorer-tab-btn" onclick="filterExplorerCourses('all', this)" style="background: #011731; color: white; border: 1px solid #011731; padding: 8px 18px; border-radius: 50px; font-weight: 700; cursor: pointer; font-size: 0.9rem;">All (${totalCourses})</button>
            <button type="button" class="explorer-tab-btn" onclick="filterExplorerCourses('Career Program', this)" style="background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 50px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">Career Programs (${careerCourses.length})</button>
            <button type="button" class="explorer-tab-btn" onclick="filterExplorerCourses('Professional Program', this)" style="background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 50px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">Professional Programs (${proCourses.length})</button>
            <button type="button" class="explorer-tab-btn" onclick="filterExplorerCourses('Certification Course', this)" style="background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 50px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">Certification Courses (${certCourses.length})</button>
          </div>
          <div style="flex: 1; max-width: 300px; min-width: 200px;">
            <input type="text" placeholder="🔍 Search courses..." onkeyup="searchExplorerCourses(this.value)" style="width: 100%; padding: 10px 16px; border-radius: 50px; border: 1px solid #cbd5e1; font-size: 0.9rem; outline: none;">
          </div>
        </div>

        <div id="explorer-courses-grid" class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
          ${academyCourses.map(c => buildCourseCardHTML(c, 'explorer-course-item')).join('')}
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 6. Tools You'll Master
  // ----------------------------------------------------
  html += `
    <section class="section-tools" style="padding: 80px 0; background: white; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <span class="section-tag">HANDS-ON SOFTWARE FLUENCY</span>
          <h2 class="section-title">Tools & Software You'll Master</h2>
          <p class="section-subtitle">Get 100% practical fluency in industry-standard software tools and modern AI platforms.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; max-width: 1000px; margin: 0 auto;">
          ${toolsList.map(t => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px 20px; border-radius: 14px; font-weight: 600; font-size: 0.95rem; color: #011731; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 1.6rem; width: 40px; height: 40px; border-radius: 10px; background: white; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">${t.icon || '🛠️'}</span>
              <span>${t.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 7. Skills You'll Gain
  // ----------------------------------------------------
  html += `
    <section class="section-skills" style="padding: 80px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <span class="section-tag">VERIFIED COMPETENCIES</span>
          <h2 class="section-title">Skills You'll Gain</h2>
          <p class="section-subtitle">Acquire high-demand technical and strategic capabilities validated by industry projects.</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; max-width: 900px; margin: 0 auto;">
          ${skillsList.map(s => `
            <div style="background: white; border: 1px solid #cbd5e1; padding: 10px 18px; border-radius: 50px; font-weight: 600; font-size: 0.92rem; color: #011731; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <span style="color: #0599a8; font-weight: 800;">✓</span> <span>${s}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 8. Real Projects
  // ----------------------------------------------------
  const portfolioList = landingData.portfolio || [
    { "title": "Practical Lab Project 1", "student": "Nova Skills Student", "desc": "Executed real-world lab project under senior mentor review.", "tools": ["Practical Labs"] },
    { "title": "Client Case Study Project 2", "student": "Nova Skills Student", "desc": "Solved real business problem using modern industry tools.", "tools": ["Case Study"] },
    { "title": "Capstone Portfolio Project 3", "student": "Nova Skills Student", "desc": "Built complete end-to-end portfolio project for career placement.", "tools": ["Capstone"] }
  ];

  html += `
    <section class="section-portfolio" style="padding: 80px 0; background: white; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <span class="section-tag">STUDENT SHOWCASE</span>
          <h2 class="section-title">Real Projects Students Build</h2>
          <p class="section-subtitle">Explore verified portfolio work samples created during guided practical lab sessions.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          ${portfolioList.map(p => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 28px; border-radius: 16px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 0.8rem; background: rgba(5,153,168,0.1); color: #0599a8; padding: 4px 10px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 12px;">📁 Portfolio Case Study</span>
                <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">${p.title}</h3>
                <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5; margin-bottom: 16px;">${p.desc}</p>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
                <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">👨‍🎓 ${p.student}</span>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  ${(p.tools || []).map(tool => `<span style="background: #e2e8f0; color: #334155; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${tool}</span>`).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 9. Career Opportunities
  // ----------------------------------------------------
  const opps = landingData.careerOpps || {
    jobRoles: ["Domain Specialist", "Team Lead", "Senior Practitioner", "Consultant"],
    freelancing: ["Global Remote Services", "Monthly Retainer Contracts"],
    business: ["Start Your Agency / Business Studio"],
    salaryRange: "₹4.0 LPA – ₹12.0 LPA",
    demand: "🔥 High Market Demand"
  };

  html += `
    <section class="section-career-opps" style="padding: 80px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <span class="section-tag">CAREER PATHWAYS</span>
          <h2 class="section-title">Career Opportunities & Market Outlook</h2>
          <p class="section-subtitle">Discover diverse avenues across corporate employment, international freelancing, and agency launch.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
          <div style="background: white; border: 1px solid #e2e8f0; padding: 28px; border-radius: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(5,153,168,0.1); color: #0599a8; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px;">💼</div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: #011731; margin-bottom: 14px;">Full-Time Job Roles</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem; color: #475569;">
              ${(opps.jobRoles || []).map(r => `<li style="display:flex; gap:8px; align-items:center;"><span>✅</span> <span>${r}</span></li>`).join('')}
            </ul>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 28px; border-radius: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(37,99,235,0.1); color: #2563EB; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px;">🌐</div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: #011731; margin-bottom: 14px;">Freelance & Remote</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem; color: #475569;">
              ${(opps.freelancing || []).map(f => `<li style="display:flex; gap:8px; align-items:center;"><span>⚡</span> <span>${f}</span></li>`).join('')}
            </ul>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 28px; border-radius: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(139,92,246,0.1); color: #8B5CF6; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px;">🚀</div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: #011731; margin-bottom: 14px;">Agency & Business</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem; color: #475569;">
              ${(opps.business || []).map(b => `<li style="display:flex; gap:8px; align-items:center;"><span>🎯</span> <span>${b}</span></li>`).join('')}
            </ul>
          </div>

          <div style="background: linear-gradient(135deg, #011731, #0a2040); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 28px; border-radius: 16px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="background: rgba(117,215,102,0.2); color: #75d766; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; display: inline-block; margin-bottom: 12px;">INDUSTRY SALARY BENCHMARK</span>
              <div style="font-size: 1.6rem; font-weight: 800; color: white; margin-bottom: 12px;">${opps.salaryRange || '₹4.0 – ₹12.0 LPA'}</div>
              <p style="color: #94a3b8; font-size: 0.88rem; line-height: 1.5; margin-bottom: 16px;">Expected starting to senior salary spectrum based on verified skills.</p>
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; font-weight: 700; color: #38bdf8; font-size: 0.9rem;">
              ${opps.demand || '🔥 High Industry Demand'}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 10. Salary Insights
  // ----------------------------------------------------
  const salaryData = landingData.salaryInsights || {
    entry: "₹3.5 – ₹5.0 LPA",
    mid: "₹6.0 – ₹9.5 LPA",
    senior: "₹10.0 – ₹18.0+ LPA",
    freelancing: "₹40k – ₹1.5L / month",
    entrepreneurship: "₹2.0L – ₹8.0L+ / month"
  };

  html += `
    <section class="section-salary-insights" style="padding: 80px 0; background: white; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <span class="section-tag">FINANCIAL PROGRESSION</span>
          <h2 class="section-title">Salary Insights & Earning Progression</h2>
          <p class="section-subtitle">Track your career earnings trajectory from entry-level role to senior practitioner and business owner.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; text-align: center;">
            <span style="font-size: 0.8rem; background: rgba(5,153,168,0.1); color: #0599a8; padding: 4px 10px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 12px;">0–2 YEARS</span>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Entry Level</h4>
            <div style="font-size: 1.35rem; font-weight: 800; color: #0599a8;">${salaryData.entry}</div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; text-align: center;">
            <span style="font-size: 0.8rem; background: rgba(37,99,235,0.1); color: #2563EB; padding: 4px 10px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 12px;">2–5 YEARS</span>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Mid Level</h4>
            <div style="font-size: 1.35rem; font-weight: 800; color: #2563EB;">${salaryData.mid}</div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; text-align: center;">
            <span style="font-size: 0.8rem; background: rgba(139,92,246,0.1); color: #8B5CF6; padding: 4px 10px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 12px;">5+ YEARS</span>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Senior Level</h4>
            <div style="font-size: 1.35rem; font-weight: 800; color: #8B5CF6;">${salaryData.senior}</div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; text-align: center;">
            <span style="font-size: 0.8rem; background: rgba(234,179,8,0.15); color: #ca8a04; padding: 4px 10px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 12px;">RETAINERS</span>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Freelancing</h4>
            <div style="font-size: 1.35rem; font-weight: 800; color: #ca8a04;">${salaryData.freelancing}</div>
          </div>

          <div style="background: linear-gradient(135deg, rgba(1,23,49,0.05), rgba(117,215,102,0.15)); border: 1px solid #75d766; padding: 24px; border-radius: 16px; text-align: center;">
            <span style="font-size: 0.8rem; background: #75d766; color: #011731; padding: 4px 10px; border-radius: 50px; font-weight: 800; display: inline-block; margin-bottom: 12px;">AGENCY / BIZ</span>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Entrepreneurship</h4>
            <div style="font-size: 1.35rem; font-weight: 800; color: #2e7d32;">${salaryData.entrepreneurship}</div>
          </div>
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 11. Hiring Industries
  // ----------------------------------------------------
  const industriesList = landingData.hiringIndustries || [
    "Digital & IT Agencies", "E-Commerce Enterprises", "Corporate Consultancies",
    "SaaS & Tech Startups", "Global Remote Client Networks"
  ];

  html += `
    <section class="section-hiring-industries" style="padding: 80px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <span class="section-tag">EMPLOYER NETWORK</span>
          <h2 class="section-title">Industries Hiring ${academy.name} Graduates</h2>
          <p class="section-subtitle">Connect with top hiring sectors actively recruiting trained talent from Nova Skills.</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; max-width: 960px; margin: 0 auto;">
          ${industriesList.map(ind => `
            <div style="background: white; border: 1px solid #e2e8f0; padding: 14px 22px; border-radius: 14px; font-weight: 700; font-size: 0.95rem; color: #011731; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <span style="color: #0599a8; font-size: 1.2rem;">🏢</span> <span>${ind}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 12. Student Learning Journey Timeline
  // ----------------------------------------------------
  html += `
    <section class="section-learning-journey" style="padding: 80px 0; background: white; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 56px;">
          <span class="section-tag">END-TO-END METHODOLOGY</span>
          <h2 class="section-title">Student Learning Journey</h2>
          <p class="section-subtitle">Our proven 7-stage learning framework ensuring 100% skill mastery and job readiness.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 14px; text-align: center;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px 12px; border-radius: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #011731; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; margin-bottom: 10px;">1</div>
            <h4 style="font-size: 0.9rem; font-weight: 700; color: #011731; margin: 0 0 4px;">Admission</h4>
            <p style="font-size: 0.78rem; color: #64748b; margin: 0;">Roadmap Alignment</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px 12px; border-radius: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #0599a8; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; margin-bottom: 10px;">2</div>
            <h4 style="font-size: 0.9rem; font-weight: 700; color: #011731; margin: 0 0 4px;">Training</h4>
            <p style="font-size: 0.78rem; color: #64748b; margin: 0;">Live Tool Masterclass</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px 12px; border-radius: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #2563EB; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; margin-bottom: 10px;">3</div>
            <h4 style="font-size: 0.9rem; font-weight: 700; color: #011731; margin: 0 0 4px;">Assignments</h4>
            <p style="font-size: 0.78rem; color: #64748b; margin: 0;">Practical Lab Drills</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px 12px; border-radius: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #8B5CF6; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; margin-bottom: 10px;">4</div>
            <h4 style="font-size: 0.9rem; font-weight: 700; color: #011731; margin: 0 0 4px;">Projects</h4>
            <p style="font-size: 0.78rem; color: #64748b; margin: 0;">Live Client Briefs</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px 12px; border-radius: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #ca8a04; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; margin-bottom: 10px;">5</div>
            <h4 style="font-size: 0.9rem; font-weight: 700; color: #011731; margin: 0 0 4px;">Internship</h4>
            <p style="font-size: 0.78rem; color: #64748b; margin: 0;">Agency Simulation</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px 12px; border-radius: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #059669; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; margin-bottom: 10px;">6</div>
            <h4 style="font-size: 0.9rem; font-weight: 700; color: #011731; margin: 0 0 4px;">Certification</h4>
            <p style="font-size: 0.78rem; color: #64748b; margin: 0;">ISO Verification</p>
          </div>

          <div style="background: rgba(117,215,102,0.2); border: 1px solid #75d766; padding: 20px 12px; border-radius: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #75d766; color: #011731; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; margin-bottom: 10px;">7</div>
            <h4 style="font-size: 0.9rem; font-weight: 800; color: #011731; margin: 0 0 4px;">Placement</h4>
            <p style="font-size: 0.78rem; color: #1e293b; margin: 0; font-weight: 600;">Job Launch</p>
          </div>
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 13. Why Nova Skills
  // ----------------------------------------------------
  html += `
    <section class="section-why-choose" style="padding: 80px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <span class="section-tag">THE NOVA SKILLS ADVANTAGE</span>
          <h2 class="section-title">Why Choose Nova Skills Institute</h2>
          <p class="section-subtitle">We bridge the gap between classroom theory and real-world industry demands.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
          <div style="background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🚀</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">100% Practical Focus</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Learn by executing live projects and real client briefs rather than memorizing slides.</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🤖</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">AI Integrated Learning</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Master generative AI productivity workflows to complete client projects 5x faster.</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">💻</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Live Projects</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Work on actual live advertising budgets and verified business case studies.</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">👨‍🏫</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Industry Mentors</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Learn directly from senior practitioners with 8+ years of hands-on industry experience.</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">💼</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Placement Assistance</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">1-on-1 resume reviews, mock technical interviews, and access to 150+ hiring partners.</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🎯</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Interview Preparation</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Rigorous mock technical interviews, domain Q&A prep, and confidence coaching.</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🧭</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Career Guidance</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Personalized 1-on-1 mentorship to align your learning path with your dream role.</p>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">📁</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Portfolio Building</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Graduate with a verified GitHub / Behance / Case Study portfolio ready for recruiters.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 14. Frequently Asked Questions
  // ----------------------------------------------------
  const faqsList = landingData.faqs || [
    { "q": `What are the eligibility criteria for ${academy.name}?`, "a": "Anyone with a passion for learning can join. We start from foundational concepts and build up to advanced professional levels." },
    { "q": "Do you provide placement assistance?", "a": "Yes! Our Career and Professional Programs include 100% placement support, resume reviews, mock interviews, and hiring partner access." },
    { "q": "Are classes available in online or hybrid modes?", "a": "Both! You can choose interactive live online sessions or hybrid classroom learning." },
    { "q": "Will I receive a certificate after completing the course?", "a": "Yes, you will earn an official ISO-recognized certificate from Nova Skills Education Institute upon course completion." }
  ];

  html += `
    <section class="section-faqs" style="padding: 80px 0; background: white; border-bottom: 1px solid #e2e8f0;">
      <div class="container" style="max-width: 860px;">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <span class="section-tag">FREQUENTLY ASKED QUESTIONS</span>
          <h2 class="section-title">Got Questions? We Have Answers</h2>
          <p class="section-subtitle">Find key details about admissions, practical training, and placement support for ${academy.name}.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${faqsList.map(faq => `
            <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #f8fafc;">
              <button type="button" onclick="toggleFaq(this)" style="width: 100%; padding: 20px 24px; text-align: left; background: none; border: none; font-size: 1.05rem; font-weight: 700; color: #011731; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span>${faq.q}</span>
                <span class="faq-toggle-icon" style="font-size: 1.3rem; color: #0599a8; font-weight: 800; margin-left: 12px;">+</span>
              </button>
              <div class="faq-answer-block" style="display: none; padding: 0 24px 20px; color: #475569; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid #e2e8f0; background: white;">
                ${faq.a}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // ----------------------------------------------------
  // 15. Related Skill Academies
  // ----------------------------------------------------
  const relatedAcademies = getSmartRelatedAcademies(academy.slug);
  if (relatedAcademies.length > 0) {
    html += `
      <section class="section-related-academies" style="padding: 80px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 44px;">
            <span class="section-tag">EXPLORE SPECIALISATIONS</span>
            <h2 class="section-title">Related Skill Academies</h2>
            <p class="section-subtitle">Discover complementary academies to expand your professional career skill set.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px;">
            ${relatedAcademies.map(rel => {
              const relSlug = rel.slug || rel.id;
              return `
                <div style="background: white; border: 1px solid #e2e8f0; padding: 28px; border-radius: 16px; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="font-size: 2.8rem; margin-bottom: 12px;">${rel.icon || '🎓'}</div>
                    <h3 style="font-size: 1.2rem; font-weight: 700; color: #011731; margin-bottom: 8px;">${rel.name}</h3>
                    <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5; margin-bottom: 20px;">${rel.description}</p>
                  </div>
                  <a href="/academies/${relSlug}/" class="btn btn-outline btn-sm" style="text-align: center; justify-content: center;">Explore Academy →</a>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ----------------------------------------------------
  // 16. Final Call To Action
  // ----------------------------------------------------
  const waMsg = encodeURIComponent(`Hi Nova Skills, I want to know more about admission & fees for ${academy.name}.`);

  html += `
    <section class="section-final-cta" style="padding: 80px 0; background: linear-gradient(135deg, #0599a8 0%, #011731 100%); color: white; text-align: center;">
      <div class="container" style="max-width: 860px;">
        <span class="section-tag" style="background: rgba(255,255,255,0.2); color: white;">START YOUR TRANSFORMATION TODAY</span>
        <h2 style="font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; margin: 16px 0;">Ready to Become a Master in ${academy.name}?</h2>
        <p style="font-size: 1.1rem; color: #e2e8f0; margin-bottom: 32px; line-height: 1.6;">
          Speak with our senior academic counsellors today to get custom roadmap guidance, scholarship details, and reserve your seat.
        </p>

        <div style="display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; align-items: center; margin-bottom: 24px;">
          <button type="button" class="btn btn-primary btn-lg" style="background: #75d766; color: #011731; font-weight: 800;" onclick="openEnrollmentModal('', '${(academy.name || '').replace(/'/g, "\\'")}')">Enroll Now →</button>
          <button type="button" class="btn btn-outline btn-lg" style="color: white; border-color: rgba(255,255,255,0.5);" onclick="openConsultationPopup()">Free Career Counselling</button>
          <a href="tel:+919695904440" class="btn btn-outline btn-lg" style="color: white; border-color: rgba(255,255,255,0.5);">📞 Call Now</a>
          <a href="https://wa.me/919695904440?text=${waMsg}" target="_blank" rel="noopener" class="btn btn-outline btn-lg" style="color: #75d766; border-color: #75d766;">💬 WhatsApp Us</a>
          <button type="button" class="btn btn-outline btn-lg" style="color: #38bdf8; border-color: #38bdf8;" onclick="openCurriculumNotice('${(academy.name || '').replace(/'/g, "\\'")}')">📥 Download Curriculum</button>
        </div>

        <div style="display: flex; gap: 20px; justify-content: center; font-size: 0.92rem; opacity: 0.9; flex-wrap: wrap;">
          <a href="/courses.html" style="color: white; text-decoration: underline;">Explore All 100+ Courses →</a>
          <span>•</span>
          <a href="/contact/" style="color: white; text-decoration: underline;">Contact Admissions →</a>
        </div>
      </div>
    </section>
  `;

  mainContainer.innerHTML = html;
}
