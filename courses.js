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
      grid.innerHTML = filtered.map(c => buildCourseCardHTML(c)).join('');
    }
  }

  updateActiveFilterChips();
  syncQuickTrackTabState();
}

function getCourseUrl(course) {
  return `/course-detail.html?id=${course.id}`;
}

function buildCourseCardHTML(course) {
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

const COURSE_CATALOGUE_THUMBNAILS = {
  'dm-professional': {
    unit: 'unit-01',
    alt: 'AI Digital Marketing Specialist campaign planning workspace and analytics dashboard preview'
  },
  'ai-mastery': {
    unit: 'unit-02',
    alt: 'AI Solutions Engineering and Agentic AI workflow architecture preview'
  },
  'graphic-design-pro': {
    unit: 'unit-03',
    alt: 'Graphic Design Professional brand identity and typography layout preview'
  },
  'fullstack-foundation': {
    unit: 'unit-04',
    alt: 'Full Stack Programming Foundation responsive web application and code preview'
  },
  'uiux-design-pro': {
    unit: 'unit-05',
    alt: 'UI/UX Design Professional wireframe-to-interface mobile checkout flow preview'
  },
  'video-pro': {
    unit: 'unit-06',
    alt: 'Professional Video Editing cinema timeline and motion graphics sequence preview'
  },
  'ecommerce-mastery': {
    unit: 'unit-07',
    alt: 'E-Commerce Website Mastery storefront product and checkout layout preview'
  },
  '3d-viz-pro': {
    unit: 'unit-08',
    alt: '3D Visualisation Professional viewport modeling and material shader preview'
  }
};

function renderCourseCardMediaHtml(course, bannerIconHtml) {
  const thumbCfg = COURSE_CATALOGUE_THUMBNAILS[course.id];
  if (!thumbCfg) {
    return {
      wrapperClass: '',
      bgClass: '',
      innerHtml: bannerIconHtml
    };
  }
  return {
    wrapperClass: ' has-course-visual',
    bgClass: ' has-course-visual',
    innerHtml: `<picture class="course-thumb-picture"><source media="(min-width: 768px)" srcset="/public/assets/nova-images/desktop/${thumbCfg.unit}/IMG-048.webp" type="image/webp" width="800" height="600" /><img src="/public/assets/nova-images/mobile/${thumbCfg.unit}/IMG-048.webp" alt="${thumbCfg.alt}" class="course-thumb-img" width="600" height="450" loading="lazy" decoding="async" /></picture>`
  };
}

  const academyTagHtml = (typeof NovaIcons !== 'undefined' && NovaIcons.renderAcademyTagHtml)
    ? NovaIcons.renderAcademyTagHtml(course.academyId || course.academy)
    : `${course.academy || 'Academy'}`;

  const cardMedia = renderCourseCardMediaHtml(course, bannerIconHtml);

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
