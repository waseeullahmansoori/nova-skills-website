/* ============================================================
   NOVA SKILLS — Course Detail Page Dynamic Loader
   Populates template with course data from data.js
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const course = getTargetCourse();
  if (course) {
    populateCourseDetail(course);
    renderRelatedCourses(course);
    initCurriculumAccordion();
  }
});

function getTargetCourse() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'ai-mastery'; // Fallback default
  return NS_COURSES.find(c => c.id === id || c.slug === id) || NS_COURSES[0];
}

function populateCourseDetail(course) {
  // Title & Head
  const pageTitleText = `${course.name} — Nova Skills`;
  document.title = pageTitleText;
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = pageTitleText;

  const canonicalUrl = `https://novaskills.in/course-detail.html?id=${course.id}`;
  const canonicalEl = document.getElementById('page-canonical') || document.querySelector('link[rel="canonical"]');
  if (canonicalEl) canonicalEl.setAttribute('href', canonicalUrl);

  // Map specific OG / Twitter images for key courses
  const courseImageMap = {
    'dm-professional': 'https://novaskills.in/public/images/seo/og-course-dm-professional.png',
    'dm-mastery': 'https://novaskills.in/public/images/seo/og-course-dm-mastery.png',
    'ai-mastery': 'https://novaskills.in/public/images/seo/og-course-ai-mastery.png',
    'full-stack': 'https://novaskills.in/public/images/seo/og-course-full-stack.png',
    'design-mastery': 'https://novaskills.in/public/images/seo/og-course-design-mastery.png',
    'motion-graphics': 'https://novaskills.in/public/images/seo/og-course-motion-graphics.png'
  };
  const courseImg = courseImageMap[course.id] || 'https://novaskills.in/public/images/seo/og-course-detail.png';

  // Open Graph Updates
  const ogUrl = document.getElementById('og-url') || document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

  const ogTitle = document.getElementById('og-title') || document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', pageTitleText);

  const ogDesc = document.getElementById('og-desc') || document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', course.shortDesc);

  const ogImg = document.getElementById('og-image') || document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', courseImg);

  const ogImgSecure = document.getElementById('og-image-secure') || document.querySelector('meta[property="og:image:secure_url"]');
  if (ogImgSecure) ogImgSecure.setAttribute('content', courseImg);

  const ogImgAlt = document.getElementById('og-image-alt') || document.querySelector('meta[property="og:image:alt"]');
  if (ogImgAlt) ogImgAlt.setAttribute('content', `${course.name} — Nova Skills Course`);

  // Twitter (X) Card Updates
  const twTitle = document.getElementById('tw-title') || document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', pageTitleText);

  const twDesc = document.getElementById('tw-desc') || document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', course.shortDesc);

  const twImg = document.getElementById('tw-image') || document.querySelector('meta[name="twitter:image"]');
  if (twImg) twImg.setAttribute('content', courseImg);

  const twImgAlt = document.getElementById('tw-image-alt') || document.querySelector('meta[name="twitter:image:alt"]');
  if (twImgAlt) twImgAlt.setAttribute('content', `${course.name} — Nova Skills Course`);

  // Inject Schema.org Course JSON-LD
  injectCourseSchema(course, courseImg, canonicalUrl);

  // Breadcrumb & Header
  const bc = document.getElementById('breadcrumb-course-name');
  if (bc) bc.textContent = course.name;

  const tag = document.getElementById('detail-academy-tag');
  if (tag) tag.innerHTML = `${course.icon} ${course.academy}`;

  const title = document.getElementById('detail-title');
  if (title) title.textContent = course.name;

  const desc = document.getElementById('detail-desc');
  if (desc) desc.textContent = course.fullDesc;

  // Meta items
  const meta = document.getElementById('detail-meta');
  if (meta) {
    meta.innerHTML = `
      <div class="course-meta-item"><span class="meta-icon">⏱️</span> Duration: ${course.duration}</div>
      <div class="course-meta-item"><span class="meta-icon">📶</span> Level: ${course.level}</div>
      <div class="course-meta-item"><span class="meta-icon">💻</span> Mode: ${course.mode}</div>
      <div class="course-meta-item"><span class="meta-icon">🚀</span> ${course.liveProjects} Live Projects</div>
      ${course.placementSupport ? '<div class="course-meta-item" style="color:var(--green-light); font-weight:700;"><span class="meta-icon">🎯</span> Placement Support Included</div>' : ''}
    `;
  }

  // Rating row
  const ratingRow = document.getElementById('detail-rating-row');
  if (ratingRow) {
    ratingRow.innerHTML = `
      <span class="rating-stars">★★★★★</span>
      <span class="rating-num">${course.rating}</span>
      <span class="rating-count">(${course.reviews} student reviews)</span>
      <span class="student-count">• ${course.students.toLocaleString('en-IN')}+ students enrolled</span>
    `;
  }

  // Enroll Card
  const thumb = document.getElementById('detail-card-thumb');
  if (thumb) {
    thumb.style.background = course.color;
    thumb.innerHTML = `<span style="font-size:4rem; filter:drop-shadow(0 10px 20px rgba(0,0,0,0.3));">${course.icon}</span>`;
  }

  const price = document.getElementById('detail-price');
  if (price) price.textContent = `₹${course.price.toLocaleString('en-IN')}`;

  const origPrice = document.getElementById('detail-original-price');
  if (origPrice) origPrice.textContent = `₹${course.originalPrice.toLocaleString('en-IN')}`;

  const discount = document.getElementById('detail-discount');
  if (discount) {
    const pct = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
    discount.textContent = `${pct}% OFF`;
  }

  // Mobile sticky price
  const mobPrice = document.getElementById('mobile-price');
  if (mobPrice) mobPrice.textContent = `₹${course.price.toLocaleString('en-IN')}`;
  const mobOrig = document.getElementById('mobile-orig-price');
  if (mobOrig) mobOrig.textContent = `₹${course.originalPrice.toLocaleString('en-IN')}`;

  // Overview
  const overview = document.getElementById('overview-content');
  if (overview) {
    overview.innerHTML = `
      <p style="margin-bottom:16px;">${course.fullDesc}</p>
      <p style="margin-bottom:20px;">Designed and delivered by industry leaders, this program gives you practical hands-on experience through <strong>${course.liveProjects} real-world capstone projects</strong>, live interactive classes, 1-on-1 resume reviews, and direct placement opportunities with top companies across India.</p>
    `;
  }

  // Curriculum Modules
  const curr = document.getElementById('curriculum-container');
  if (curr && course.curriculum) {
    curr.innerHTML = course.curriculum.map((mod, idx) => `
      <div class="curriculum-module ${idx === 0 ? 'open' : ''}">
        <div class="curriculum-module-header">
          <span class="module-label">${mod.module}</span>
          <span class="module-title">${mod.title}</span>
          <span class="module-lessons">${mod.lessons} Lessons</span>
          <span class="module-chevron">⌄</span>
        </div>
        <div class="curriculum-module-body">
          <div class="module-lesson"><span class="lesson-icon">▶</span> Practical Hands-on Session: ${mod.title} Deep Dive</div>
          <div class="module-lesson"><span class="lesson-icon">▶</span> Industry Case Study & Best Practices</div>
          <div class="module-lesson"><span class="lesson-icon">▶</span> Live Assignment & Code / Strategy Review</div>
        </div>
      </div>
    `).join('');
  }

  // Tools
  const tools = document.getElementById('tools-container');
  if (tools && course.tools) {
    tools.innerHTML = course.tools.map(tool => `
      <div class="tool-pill">
        <span class="tool-emoji">🛠️</span>
        <span>${tool}</span>
      </div>
    `).join('');
  }

  // Cert Course Display
  const certDisplay = document.getElementById('cert-course-display');
  if (certDisplay) certDisplay.textContent = course.name;
}

function initCurriculumAccordion() {
  document.querySelectorAll('.curriculum-module-header').forEach(header => {
    header.addEventListener('click', () => {
      const module = header.closest('.curriculum-module');
      module.classList.toggle('open');
    });
  });
}

function renderRelatedCourses(currentCourse) {
  const container = document.getElementById('related-courses-grid');
  if (!container) return;

  const sameAcademyCourses = NS_COURSES.filter(c => c.id !== currentCourse.id && c.academyId === currentCourse.academyId);
  const otherAcademyCourses = NS_COURSES.filter(c => c.id !== currentCourse.id && c.academyId !== currentCourse.academyId);

  const getNormLevel = (c) => typeof normalizeProgramLevel === 'function' ? normalizeProgramLevel(c.programLevel) : c.programLevel;
  const currentNormLevel = getNormLevel(currentCourse);

  let recommendationPool = [];

  if (currentNormLevel === 'Career Program') {
    // 1. Related Professional Programs from same academy
    const profProgs = sameAcademyCourses.filter(c => getNormLevel(c) === 'Professional Program');
    // 2. Related Certification Courses from same academy
    const certCourses = sameAcademyCourses.filter(c => getNormLevel(c) === 'Certification Course');

    recommendationPool = recommendationPool
      .concat(profProgs)
      .concat(certCourses)
      .concat(sameAcademyCourses)
      .concat(otherAcademyCourses);
  } else if (currentNormLevel === 'Professional Program') {
    // 1. Parent Career Program from same academy
    const parentCareer = sameAcademyCourses.filter(c => getNormLevel(c) === 'Career Program');
    // 2. Related Certification Courses from same academy
    const certCourses = sameAcademyCourses.filter(c => getNormLevel(c) === 'Certification Course');
    // 3. Other Professional Programs from same academy
    const sameLevelProgs = sameAcademyCourses.filter(c => getNormLevel(c) === 'Professional Program');

    recommendationPool = recommendationPool
      .concat(parentCareer)
      .concat(certCourses)
      .concat(sameLevelProgs)
      .concat(sameAcademyCourses)
      .concat(otherAcademyCourses);
  } else {
    // Certification Course or other
    const careerProg = sameAcademyCourses.find(c => getNormLevel(c) === 'Career Program');
    const profProg = sameAcademyCourses.find(c => getNormLevel(c) === 'Professional Program');
    const certCourse = sameAcademyCourses.find(c => getNormLevel(c) === 'Certification Course');

    recommendationPool = recommendationPool
      .concat(careerProg ? [careerProg] : [])
      .concat(profProg ? [profProg] : [])
      .concat(certCourse ? [certCourse] : [])
      .concat(sameAcademyCourses)
      .concat(otherAcademyCourses);
  }

  // Filter out duplicates & current course
  const uniqueRelated = [];
  const seenIds = new Set([currentCourse.id]);

  for (const c of recommendationPool) {
    if (c && !seenIds.has(c.id)) {
      seenIds.add(c.id);
      uniqueRelated.push(c);
    }
    if (uniqueRelated.length >= 3) break;
  }

  container.innerHTML = uniqueRelated.map(c => `
    <div class="course-card">
      <div class="course-thumbnail" style="height:150px;">
        <div class="course-thumb-bg" style="background:${c.color}">
          <span style="font-size:2.5rem;">${c.icon}</span>
        </div>
        <div class="course-badge-overlay">
          <span class="course-level-badge" style="background:rgba(1, 23, 49, 0.85); color:#ffffff; font-size:0.75rem; padding:3px 8px; border-radius:4px; font-weight:600;">${c.programLevel || c.level}</span>
        </div>
      </div>
      <div class="course-body">
        <div class="course-academy-tag">${c.icon} ${c.academy}</div>
        <h3 class="course-title" style="font-size:1rem;"><a href="course-detail.html?id=${c.id}">${c.name}</a></h3>
        <div class="course-footer">
          <span class="price-current" style="font-size:1.125rem;">₹${c.price.toLocaleString('en-IN')}</span>
          <a href="course-detail.html?id=${c.id}" class="btn btn-outline btn-sm">View Program</a>
        </div>
      </div>
    </div>
  `).join('');
}

function injectCourseSchema(course, courseImg, canonicalUrl) {
  const existingScript = document.getElementById('ns-dynamic-course-schema');
  if (existingScript) existingScript.remove();

  const teachesSkills = (course.tools && course.tools.length > 0)
    ? course.tools
    : [course.name, course.academy, 'Practical Training', 'Industry Projects'];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.fullDesc || course.shortDesc,
    "url": canonicalUrl,
    "image": courseImg,
    "courseCode": course.id,
    "inLanguage": "en",
    "courseMode": course.mode || "Hybrid",
    "educationalCredentialAwarded": "Professional Certificate of Completion by Nova Skills",
    "teaches": teachesSkills,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Nova Skills Education Institute",
      "url": "https://novaskills.in/",
      "logo": "https://novaskills.in/public/images/seo/og-default.png",
      "sameAs": "https://novaskills.in/"
    },
    "offers": {
      "@type": "Offer",
      "category": "Paid",
      "price": course.price,
      "priceCurrency": "INR",
      "url": canonicalUrl,
      "availability": "https://schema.org/InStock"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": course.mode || "Hybrid",
      "duration": course.duration || "3 Months",
      "instructor": {
        "@type": "Organization",
        "name": "Nova Skills Faculty & Industry Mentors"
      }
    }
  };

  const script = document.createElement('script');
  script.id = 'ns-dynamic-course-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}
