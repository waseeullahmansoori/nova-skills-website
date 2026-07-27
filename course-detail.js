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
  document.title = `${course.name} — Nova Skills`;
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = `${course.name} — Nova Skills`;

  const ogTitle = document.getElementById('og-title');
  if (ogTitle) ogTitle.content = course.name;
  const ogDesc = document.getElementById('og-desc');
  if (ogDesc) ogDesc.content = course.shortDesc;

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

  const related = NS_COURSES
    .filter(c => c.id !== currentCourse.id && c.academyId === currentCourse.academyId)
    .concat(NS_COURSES.filter(c => c.id !== currentCourse.id && c.academyId !== currentCourse.academyId))
    .slice(0, 3);

  container.innerHTML = related.map(c => `
    <div class="course-card">
      <div class="course-thumbnail" style="height:150px;">
        <div class="course-thumb-bg" style="background:${c.color}">
          <span style="font-size:2.5rem;">${c.icon}</span>
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
