/* ============================================================
   NOVA SKILLS – Phase A4 SEO, Navigation & Schema Engine
   ============================================================ */

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

  if (!isOpen) {
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
  
  if (typeof NS_ACADEMIES === 'undefined' || !Array.isArray(NS_ACADEMIES)) return [];
  
  return targetSlugs
    .map(slug => NS_ACADEMIES.find(a => a.slug === slug || a.id === slug))
    .filter(Boolean)
    .slice(0, 4);
}

function injectAcademySEOAndSchema(academy, totalCoursesCount) {
  const canonicalUrl = `https://novaskills.in/academies/${academy.slug}/`;
  const pageTitle = `${academy.name} — Nova Skills Education Institute`;
  const metaDesc = `Master ${academy.name} with 100% practical training, live client projects, ISO certification & placement support at Nova Skills Institute.`;
  const ogImage = `https://novaskills.in/public/images/seo/og-academies.png`;

  // 1. Title
  document.title = pageTitle;

  // 2. Helpers for Meta & Links
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

  // Open Graph
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDesc);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Nova Skills');

  // Twitter
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
          "url": "https://novaskills.in",
          "sameAs": "https://novaskills.in/"
        },
        "educationalProgramMode": "Hybrid",
        "numberOfCredits": totalCoursesCount
      }
    ]
  };

  schemaScript.textContent = JSON.stringify(schemaData, null, 2);
}

function initAcademyPage() {
  const slug = getAcademySlug();

  let academy = null;
  if (slug && typeof NS_ACADEMIES !== 'undefined' && Array.isArray(NS_ACADEMIES)) {
    academy = NS_ACADEMIES.find(a => 
      (a.slug && a.slug === slug) || 
      (a.id && a.id === slug)
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

function buildCourseCardHTML(course) {
  const safeName = (course.name || '').replace(/'/g, "\\'");
  const safeAcademy = (course.academy || '').replace(/'/g, "\\'");
  const origPrice = course.originalPrice ? `₹${course.originalPrice.toLocaleString('en-IN')}` : '';
  const isFeatured = course.featured || (course.tags && course.tags.includes('popular'));
  const liveProj = course.liveProjects || 2;
  const rating = course.rating || 4.8;
  const reviews = course.reviews || 120;

  return `
    <div class="course-card" data-category="${course.academyId}">
      ${isFeatured ? '<span class="course-hot-tag">🔥 Popular</span>' : ''}
      <div class="course-thumbnail">
        <div class="course-thumb-bg" style="background:${course.color || 'linear-gradient(135deg, #0599a8, #011731)'}">
          <span style="font-size:3.5rem; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.2));">${course.icon || '🎓'}</span>
        </div>
        <div class="course-badge-overlay">
          <span class="course-level-badge">${course.level || 'All Levels'}</span>
        </div>
        <div class="course-duration-badge">⏱️ ${course.duration || 'Flexible'}</div>
      </div>
      <div class="course-body">
        <div class="course-academy-tag">${course.icon || '🎓'} ${course.academy || ''}</div>
        <h3 class="course-title"><a href="/course-detail.html?id=${course.id}">${course.name}</a></h3>
        <p class="course-desc">${course.shortDesc || course.description || ''}</p>
        <div class="course-features">
          <span class="feature-item">💻 ${liveProj}+ Live Projects</span>
          <span class="feature-item">📜 Certificate</span>
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
  // 1. Retrieve Courses & Grouping
  const allCourses = (typeof NS_COURSES !== 'undefined' && Array.isArray(NS_COURSES)) ? NS_COURSES : [];
  const academyCourses = allCourses.filter(c => 
    c.academyId === academy.id || 
    c.academyId === academy.slug
  );

  const careerCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel) === 'Career Program');
  const proCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel) === 'Professional Program');
  const certCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel) === 'Certification Course');
  const totalCourses = academyCourses.length;

  // Inject SEO Meta & JSON-LD Schema (Phase A4 Tasks 1, 2, 6, 7)
  injectAcademySEOAndSchema(academy, totalCourses);

  // 2. Breadcrumb Setup (Phase A4 Task 2)
  const breadcrumbSelected = document.getElementById('breadcrumb-selected-academy');
  if (breadcrumbSelected) {
    breadcrumbSelected.textContent = academy.name;
    breadcrumbSelected.setAttribute('href', `/academies/${academy.slug}/`);
  }

  // Retrieve Landing Data
  const landingData = (typeof NS_ACADEMY_LANDING_DATA !== 'undefined')
    ? (NS_ACADEMY_LANDING_DATA[academy.slug] || NS_ACADEMY_LANDING_DATA[academy.id] || {})
    : {};

  // 3. Hero Section Enhancement
  const iconEl = document.getElementById('academy-icon-display');
  const nameEl = document.getElementById('academy-name-display');
  const descEl = document.getElementById('academy-desc-display');

  if (iconEl) iconEl.textContent = academy.icon || '🎓';
  if (nameEl) nameEl.textContent = academy.name;
  if (descEl) descEl.textContent = academy.description;

  const statsContainer = document.getElementById('academy-stats-pills');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <span class="stats-pill">💼 Career Programs: ${careerCourses.length}</span>
      <span class="stats-pill">⚡ Professional Programs: ${proCourses.length}</span>
      <span class="stats-pill">📜 Certification Courses: ${certCourses.length}</span>
      <span class="stats-pill">⏱️ Total Learning Duration: 1–12 Months</span>
      <span class="stats-pill">📚 Total Courses: ${totalCourses}</span>
    `;
  }

  // Setup Hero Buttons
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

  // 4. Render All Page Sections
  const mainContainer = document.getElementById('academy-sections-container');
  if (!mainContainer) return;

  let html = '';

  // Program & Course Cards
  if (careerCourses.length > 0) {
    html += `
      <section class="section-career-programs" style="padding: 64px 0; background: white; border-bottom: 1px solid #e2e8f0;">
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
      <section class="section-pro-programs" style="padding: 64px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
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
      <section class="section-cert-courses" style="padding: 64px 0; background: white; border-bottom: 1px solid #e2e8f0;">
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

  // Visual Career Roadmap
  html += `
    <section class="section-career-roadmap" style="padding: 80px 0; background: #011731; color: white;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <span class="section-tag" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">CAREER PATHWAY & PROGRESSION</span>
          <h2 class="section-title" style="color: white;">Structured Learning Roadmap</h2>
          <p class="section-subtitle" style="color: #94a3b8; max-width: 680px; margin: 0 auto;">
            Step-by-step career acceleration from fundamental tool skills to high-paying client contracts & employment.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 28px 24px; border-radius: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <span style="background: #0599a8; color: white; padding: 4px 12px; border-radius: 50px; font-weight: 700; font-size: 0.8rem;">STEP 1</span>
              <span style="color: #38bdf8; font-weight: 600; font-size: 0.85rem;">1–2 Months</span>
            </div>
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 10px;">Certification Courses</h3>
            <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.5;">Master core software tools, foundational concepts, and practical assignments.</p>
          </div>

          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 28px 24px; border-radius: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <span style="background: #2563EB; color: white; padding: 4px 12px; border-radius: 50px; font-weight: 700; font-size: 0.8rem;">STEP 2</span>
              <span style="color: #38bdf8; font-weight: 600; font-size: 0.85rem;">3–6 Months</span>
            </div>
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 10px;">Professional Programs</h3>
            <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.5;">Deep-dive skill specialization, live client briefs, and advanced workflows.</p>
          </div>

          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 28px 24px; border-radius: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <span style="background: #8B5CF6; color: white; padding: 4px 12px; border-radius: 50px; font-weight: 700; font-size: 0.8rem;">STEP 3</span>
              <span style="color: #38bdf8; font-weight: 600; font-size: 0.85rem;">6–12 Months</span>
            </div>
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 10px;">Career Programs</h3>
            <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.5;">Complete career transformation, agency training, and placement support.</p>
          </div>

          <div style="background: linear-gradient(135deg, rgba(5,153,168,0.2), rgba(117,215,102,0.2)); border: 1px solid #75d766; padding: 28px 24px; border-radius: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <span style="background: #75d766; color: #011731; padding: 4px 12px; border-radius: 50px; font-weight: 800; font-size: 0.8rem;">GOAL</span>
              <span style="color: #75d766; font-weight: 700; font-size: 0.85rem;">Career Launch</span>
            </div>
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 10px; color: white;">Career Opportunities</h3>
            <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.5;">Full-time job placement, freelance retainers, or agency business launch.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  // Tools You Will Learn
  const toolsList = landingData.tools || [
    { "name": "Industry Software", "icon": "🛠️" },
    { "name": "AI Automation Tools", "icon": "🤖" },
    { "name": "Cloud Platforms", "icon": "☁️" },
    { "name": "Analytics Tools", "icon": "📊" }
  ];

  html += `
    <section class="section-tools" style="padding: 80px 0; background: white; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <span class="section-tag">PRACTICAL TECH STACK</span>
          <h2 class="section-title">Tools & Technologies Covered</h2>
          <p class="section-subtitle">Master 100% hands-on fluency in software and AI platforms used by industry experts.</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; max-width: 900px; margin: 0 auto;">
          ${toolsList.map(t => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 20px; border-radius: 12px; font-weight: 600; font-size: 0.95rem; color: #011731; display: inline-flex; align-items: center; gap: 8px;">
              <span>${t.icon}</span> <span>${t.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Career Opportunities
  const opps = landingData.careerOpps || {
    jobRoles: ["Domain Specialist", "Team Lead", "Consultant"],
    freelancing: ["Global Remote Services", "Monthly Retainer Contracts"],
    business: ["Start Your Agency / Business"],
    salaryRange: "₹4.0 LPA – ₹12.0 LPA",
    demand: "🔥 High Market Demand"
  };

  html += `
    <section class="section-career-opps" style="padding: 80px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <span class="section-tag">CAREER & INDUSTRY OUTLOOK</span>
          <h2 class="section-title">Career Opportunities & Market Demand</h2>
          <p class="section-subtitle">Explore job roles, freelancing potential, and business avenues available after graduation.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
          <div style="background: white; border: 1px solid #e2e8f0; padding: 28px; border-radius: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(5,153,168,0.1); color: #0599a8; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px;">💼</div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: #011731; margin-bottom: 14px;">High-Paying Job Roles</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem; color: #475569;">
              ${(opps.jobRoles || []).map(r => `<li style="display:flex; gap:8px; align-items:center;"><span>✅</span> <span>${r}</span></li>`).join('')}
            </ul>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 28px; border-radius: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(37,99,235,0.1); color: #2563EB; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px;">🌐</div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: #011731; margin-bottom: 14px;">Freelance Opportunities</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem; color: #475569;">
              ${(opps.freelancing || []).map(f => `<li style="display:flex; gap:8px; align-items:center;"><span>⚡</span> <span>${f}</span></li>`).join('')}
            </ul>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; padding: 28px; border-radius: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(139,92,246,0.1); color: #8B5CF6; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px;">🚀</div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: #011731; margin-bottom: 14px;">Business & Agency Paths</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem; color: #475569;">
              ${(opps.business || []).map(b => `<li style="display:flex; gap:8px; align-items:center;"><span>🎯</span> <span>${b}</span></li>`).join('')}
            </ul>
          </div>

          <div style="background: linear-gradient(135deg, #011731, #0a2040); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 28px; border-radius: 16px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="background: rgba(117,215,102,0.2); color: #75d766; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; display: inline-block; margin-bottom: 12px;">SALARY BENCHMARK</span>
              <div style="font-size: 1.6rem; font-weight: 800; color: white; margin-bottom: 16px;">${opps.salaryRange || '₹4.0 – ₹12.0 LPA'}</div>
              <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.5; margin-bottom: 16px;">Approximate salary potential based on experience and portfolio standard.</p>
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; font-weight: 700; color: #38bdf8; font-size: 0.9rem;">
              ${opps.demand || '🔥 High Industry Demand'}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Why Choose Nova Skills
  html += `
    <section class="section-why-choose" style="padding: 80px 0; background: white; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <span class="section-tag">THE NOVA SKILLS ADVANTAGE</span>
          <h2 class="section-title">Why Choose Nova Skills Institute</h2>
          <p class="section-subtitle">We bridge the gap between classroom theory and real-world industry demands.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🚀</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">100% Practical Training</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Learn by executing live projects and real client briefs rather than memorizing slides.</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">👨‍🏫</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Senior Industry Mentors</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Learn directly from senior practitioners with 8+ years of hands-on industry experience.</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🤖</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">AI-Integrated Learning</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Master generative AI productivity workflows to complete client projects 5x faster.</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">📜</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Recognized Certification</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Earn ISO-recognized certificates to validate your skills on LinkedIn and resumes.</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">💼</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Placement Assistance</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">1-on-1 resume reviews, mock technical interviews, and access to 150+ hiring partners.</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">📁</div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">Portfolio Building</h3>
            <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5;">Graduate with a verified GitHub / Behance / Case Study portfolio ready for recruiters.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  // Student Portfolio
  const portfolioList = landingData.portfolio || [
    { "title": "Practical Lab Project 1", "student": "Nova Skills Student", "desc": "Executed real-world lab project under senior mentor review.", "tools": ["Practical Labs"] },
    { "title": "Client Case Study Project 2", "student": "Nova Skills Student", "desc": "Solved real business problem using modern industry tools.", "tools": ["Case Study"] },
    { "title": "Capstone Portfolio Project 3", "student": "Nova Skills Student", "desc": "Built complete end-to-end portfolio project for career placement.", "tools": ["Capstone"] }
  ];

  html += `
    <section class="section-portfolio" style="padding: 80px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <span class="section-tag">STUDENT SHOWCASE</span>
          <h2 class="section-title">Real Projects Built by Our Students</h2>
          <p class="section-subtitle">Explore actual work samples and case studies created during lab sessions.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          ${portfolioList.map(p => `
            <div style="background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 0.8rem; background: rgba(5,153,168,0.1); color: #0599a8; padding: 4px 10px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 12px;">📁 Case Study</span>
                <h3 style="font-size: 1.15rem; font-weight: 700; color: #011731; margin-bottom: 8px;">${p.title}</h3>
                <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5; margin-bottom: 16px;">${p.desc}</p>
              </div>
              <div style="border-top: 1px solid #f1f5f9; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
                <span style="font-size: 0.82rem; color: #94a3b8; font-weight: 600;">👨‍🎓 ${p.student}</span>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  ${(p.tools || []).map(tool => `<span style="background: #f1f5f9; color: #334155; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${tool}</span>`).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Academy FAQs
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
          <p class="section-subtitle">Find key details about admissions, practical training, and placement support.</p>
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

  // Related Academies (Phase A4 Task 4)
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
            ${relatedAcademies.map(rel => `
              <div style="background: white; border: 1px solid #e2e8f0; padding: 28px; border-radius: 16px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="font-size: 2.8rem; margin-bottom: 12px;">${rel.icon || '🎓'}</div>
                  <h3 style="font-size: 1.2rem; font-weight: 700; color: #011731; margin-bottom: 8px;">${rel.name}</h3>
                  <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5; margin-bottom: 20px;">${rel.description}</p>
                </div>
                <a href="/academies/${rel.slug}/" class="btn btn-outline btn-sm" style="text-align: center; justify-content: center;">Explore Academy →</a>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // Strong Call-To-Action (Phase A3 Section 8 + Phase A4 Tasks 3, 5 Internal Links)
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
          <button type="button" class="btn btn-primary btn-lg" style="background: #75d766; color: #011731; font-weight: 800;" onclick="openEnrollmentModal('', '${academy.name.replace(/'/g, "\\'")}')">Enroll Now →</button>
          <button type="button" class="btn btn-outline btn-lg" style="color: white; border-color: rgba(255,255,255,0.5);" onclick="openConsultationPopup()">Book Free Consultation</button>
          <a href="tel:+919695904440" class="btn btn-outline btn-lg" style="color: white; border-color: rgba(255,255,255,0.5);">📞 Call Now</a>
          <a href="https://wa.me/919695904440?text=${waMsg}" target="_blank" rel="noopener" class="btn btn-outline btn-lg" style="color: #75d766; border-color: #75d766;">💬 WhatsApp Us</a>
          <button type="button" class="btn btn-outline btn-lg" style="color: #38bdf8; border-color: #38bdf8;" onclick="openCurriculumNotice('${academy.name.replace(/'/g, "\\'")}')">📥 Download Curriculum</button>
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
