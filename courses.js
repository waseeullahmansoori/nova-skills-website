/* ============================================================
   NOVA SKILLS — Courses Page Logic
   Handles: Filtering, Sorting, URL Query Params, Rendering
   ============================================================ */

'use strict';

let currentCourses = [];

function normalizeProgramLevel(level) {
  if (!level) return '';
  const str = String(level).trim().toLowerCase();
  if (str.includes('career')) return 'Career Program';
  if (str.includes('pro')) return 'Professional Program';
  if (str.includes('cert')) return 'Certification Course';
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
  console.log("Total courses loaded:", currentCourses.length);
  initAcademyFilterOptions();
  readUrlParamsAndApply();
  renderCourses();
  bindFilterEvents();
  initMobileFilters();
});

/* Dynamically build academy filter checkboxes */
function initAcademyFilterOptions() {
  const container = document.getElementById('filter-academy-options');
  if (!container) return;
  const academies = getAcademiesData();
  const courses = getCoursesData();

  container.innerHTML = academies.map(acad => {
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
  const countEl = document.getElementById('courses-showing-count');
  const noResults = document.getElementById('no-results');

  const filtered = filterAndSortCourses();

  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    if (grid) grid.innerHTML = '';
    if (noResults) noResults.removeAttribute('hidden');
    return;
  }

  if (noResults) noResults.setAttribute('hidden', '');

  if (grid) {
    grid.innerHTML = filtered.map(c => buildCourseCardHTML(c)).join('');
  }

  updateActiveFilterChips();
}

function buildCourseCardHTML(course) {
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
        <div class="course-academy-tag">${course.icon} ${course.academy}</div>
        <h3 class="course-title"><a href="course-detail.html?id=${course.id}">${course.name}</a></h3>
        <p class="course-desc">${course.shortDesc}</p>
        <div class="course-features">
          <span class="feature-item">💻 ${course.liveProjects} Projects</span>
          <span class="feature-item">📜 ISO Certificate</span>
          ${course.placementSupport ? '<span class="feature-item" style="color:var(--green); font-weight:700;">🎯 Placement Support</span>' : ''}
          <span class="feature-item">⭐ ${course.rating} (${course.reviews})</span>
        </div>
        <div class="course-footer">
          <div class="course-pricing">
            <span class="price-current">₹${course.price.toLocaleString('en-IN')}</span>
            <span class="price-original">₹${course.originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <button type="button" class="btn btn-primary btn-sm" onclick="openEnrollmentModal('${course.name.replace(/'/g, "\\'")}', '${course.academy.replace(/'/g, "\\'")}')">Enroll Now →</button>
        </div>
      </div>
    </div>
  `;
}

/* Filter and Sort Logic */
function filterAndSortCourses() {
  const searchVal = document.getElementById('filter-search-input')?.value.toLowerCase().trim() || '';
  const selectedAcademies = Array.from(document.querySelectorAll('input[name="academy"]:checked')).map(cb => cb.value);
  const selectedProgramLevels = Array.from(document.querySelectorAll('input[name="programLevel"]:checked')).map(cb => normalizeProgramLevel(cb.value));
  const selectedModes = Array.from(document.querySelectorAll('input[name="mode"]:checked')).map(cb => cb.value);
  const selectedLevels = Array.from(document.querySelectorAll('input[name="level"]:checked')).map(cb => cb.value);
  const selectedDurations = Array.from(document.querySelectorAll('input[name="duration"]:checked')).map(cb => cb.value);
  const maxPrice = parseInt(document.getElementById('filter-price-range')?.value || '90000', 10);
  const placementOnly = document.getElementById('filter-placement')?.checked || false;

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

    // Program Level filter (ultra-robust matching)
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
    if (selectedLevels.length > 0 && !selectedLevels.includes(c.level)) return false;

    // Duration filter
    if (selectedDurations.length > 0) {
      const dur = Math.round(c.durationMonths || 3);
      const matchDur = selectedDurations.some(val => {
        if (val === '1-2' || val === '2') return dur <= 2;
        if (val === '3-6' || val === '3') return dur >= 3 && dur <= 6;
        if (val === '6-12' || val === '6') return dur >= 6;
        return parseInt(val, 10) === dur;
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
  const sortVal = document.getElementById('sort-select')?.value || 'popular';
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
  document.getElementById('sort-select')?.addEventListener('change', renderCourses);

  document.querySelectorAll('#filters-sidebar input, #mobile-filters-slot input').forEach(input => {
    input.addEventListener('change', () => {
      if (input.name && input.value) {
        document.querySelectorAll(`input[name="${input.name}"][value="${input.value}"]`).forEach(other => {
          other.checked = input.checked;
        });
      }
      if (input.id === 'filter-price-range') {
        const display = document.getElementById('price-max-display');
        if (display) display.textContent = `₹${parseInt(input.value,10).toLocaleString('en-IN')}`;
      }
      renderCourses();
    });
  });

  document.getElementById('clear-all-filters')?.addEventListener('click', resetAllFilters);
}

function resetAllFilters() {
  const search = document.getElementById('filter-search-input');
  if (search) search.value = '';

  document.querySelectorAll('#filters-sidebar input[type="checkbox"], #mobile-filters-slot input[type="checkbox"]').forEach(cb => cb.checked = false);

  const priceRange = document.getElementById('filter-price-range');
  if (priceRange) {
    priceRange.value = 90000;
    const display = document.getElementById('price-max-display');
    if (display) display.textContent = '₹90,000';
  }

  renderCourses();
}

window.resetAllFilters = resetAllFilters;

/* Active Filter Chips */
function updateActiveFilterChips() {
  const bar = document.getElementById('active-filters-bar');
  if (!bar) return;

  const chips = [];
  const searchVal = document.getElementById('filter-search-input')?.value.trim();
  if (searchVal) chips.push({ label: `"${searchVal}"`, clear: () => { document.getElementById('filter-search-input').value = ''; renderCourses(); } });

  document.querySelectorAll('#filters-sidebar input[name="academy"]:checked').forEach(cb => {
    const name = cb.closest('label').querySelector('span')?.textContent || cb.value;
    chips.push({ label: name, clear: () => { uncheckAllWithNameAndValue('academy', cb.value); renderCourses(); } });
  });

  document.querySelectorAll('#filters-sidebar input[name="programLevel"]:checked').forEach(cb => {
    const labelText = cb.closest('label')?.textContent.trim() || cb.value;
    chips.push({ label: labelText, clear: () => { uncheckAllWithNameAndValue('programLevel', cb.value); renderCourses(); } });
  });

  document.querySelectorAll('#filters-sidebar input[name="mode"]:checked').forEach(cb => {
    chips.push({ label: cb.value, clear: () => { uncheckAllWithNameAndValue('mode', cb.value); renderCourses(); } });
  });

  document.querySelectorAll('#filters-sidebar input[name="level"]:checked').forEach(cb => {
    chips.push({ label: cb.value, clear: () => { uncheckAllWithNameAndValue('level', cb.value); renderCourses(); } });
  });

  document.querySelectorAll('#filters-sidebar input[name="duration"]:checked').forEach(cb => {
    const labelText = cb.closest('label')?.textContent.trim() || cb.value;
    chips.push({ label: labelText, clear: () => { uncheckAllWithNameAndValue('duration', cb.value); renderCourses(); } });
  });

  if (chips.length === 0) {
    bar.innerHTML = '';
    bar.setAttribute('hidden', '');
  } else {
    bar.removeAttribute('hidden');
    bar.innerHTML = chips.map((c, i) => `
      <span class="filter-chip">
        ${c.label}
        <span class="filter-chip-remove" onclick="removeChip(${i})">✕</span>
      </span>
    `).join('');
    window._activeChips = chips;
  }

  // Update mobile filter badge
  const badge = document.getElementById('filter-count-badge');
  if (badge) {
    if (chips.length > 0) {
      badge.textContent = chips.length;
      badge.removeAttribute('hidden');
    } else {
      badge.setAttribute('hidden', '');
    }
  }
}

function uncheckAllWithNameAndValue(name, val) {
  document.querySelectorAll(`input[name="${name}"][value="${val}"]`).forEach(cb => {
    cb.checked = false;
  });
}

window.removeChip = (index) => {
  if (window._activeChips && window._activeChips[index]) {
    window._activeChips[index].clear();
  }
};

/* Mobile Filter Drawer */
function initMobileFilters() {
  const openBtn = document.getElementById('open-mobile-filters');
  const closeBtn = document.getElementById('close-mobile-filters');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('mobile-drawer');
  const slot = document.getElementById('mobile-filters-slot');

  if (!openBtn || !drawer) return;

  openBtn.addEventListener('click', () => {
    // Copy sidebar contents to mobile drawer slot if empty
    const sidebarBody = document.querySelector('.filters-body');
    if (sidebarBody && slot && slot.children.length === 0) {
      slot.appendChild(sidebarBody.cloneNode(true));
      // Sync events inside mobile drawer
      slot.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('change', () => {
          // Sync desktop sidebar checkbox state
          if (inp.name && inp.value) {
            const sidebarInp = document.querySelector(`#filters-sidebar input[name="${inp.name}"][value="${inp.value}"]`);
            if (sidebarInp) sidebarInp.checked = inp.checked;
          }
          renderCourses();
        });
      });
    }
    backdrop?.classList.add('open');
    drawer.classList.add('open');
  });

  const closeDrawer = () => {
    backdrop?.classList.remove('open');
    drawer.classList.remove('open');
  };

  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
}
