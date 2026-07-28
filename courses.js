/* ============================================================
   NOVA SKILLS — Courses Page Logic
   Handles: Filtering, Sorting, URL Query Params, Rendering
   ============================================================ */

'use strict';

let currentCourses = [...NS_COURSES];

document.addEventListener('DOMContentLoaded', () => {
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

  container.innerHTML = NS_ACADEMIES.map(acad => {
    const count = NS_COURSES.filter(c => c.academyId === acad.id).length;
    return `
      <label class="filter-option">
        <input type="checkbox" name="academy" value="${acad.id}" />
        <span>${acad.icon} ${acad.name}</span>
        <span class="filter-badge">${count}</span>
      </label>
    `;
  }).join('');
}

/* Parse URL query params (e.g. ?academy=ai or ?search=digital) */
function readUrlParamsAndApply() {
  const params = new URLSearchParams(window.location.search);
  const academy = params.get('academy');
  const search = params.get('search');

  if (academy) {
    const cb = document.querySelector(`input[name="academy"][value="${academy}"]`);
    if (cb) cb.checked = true;
  }
  if (search) {
    const searchInput = document.getElementById('filter-search-input');
    if (searchInput) searchInput.value = search;
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
  const selectedModes = Array.from(document.querySelectorAll('input[name="mode"]:checked')).map(cb => cb.value);
  const selectedLevels = Array.from(document.querySelectorAll('input[name="level"]:checked')).map(cb => cb.value);
  const selectedDurations = Array.from(document.querySelectorAll('input[name="duration"]:checked')).map(cb => parseInt(cb.value,10));
  const maxPrice = parseInt(document.getElementById('filter-price-range')?.value || '50000', 10);
  const placementOnly = document.getElementById('filter-placement')?.checked || false;

  let result = NS_COURSES.filter(c => {
    // Search
    if (searchVal) {
      const matchName = c.name.toLowerCase().includes(searchVal);
      const matchDesc = c.shortDesc.toLowerCase().includes(searchVal);
      const matchAcademy = c.academy.toLowerCase().includes(searchVal);
      const matchTools = c.tools.some(t => t.toLowerCase().includes(searchVal));
      if (!matchName && !matchDesc && !matchAcademy && !matchTools) return false;
    }
    // Academy
    if (selectedAcademies.length > 0 && !selectedAcademies.includes(c.academyId)) return false;
    // Mode
    if (selectedModes.length > 0 && !selectedModes.includes(c.mode)) return false;
    // Level
    if (selectedLevels.length > 0 && !selectedLevels.includes(c.level)) return false;
    // Duration
    if (selectedDurations.length > 0) {
      const dur = Math.round(c.durationMonths);
      if (!selectedDurations.includes(dur)) return false;
    }
    // Price
    if (c.price > maxPrice) return false;
    // Placement
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
}

function resetAllFilters() {
  const search = document.getElementById('filter-search-input');
  if (search) search.value = '';

  document.querySelectorAll('#filters-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);

  const priceRange = document.getElementById('filter-price-range');
  if (priceRange) {
    priceRange.value = 50000;
    const display = document.getElementById('price-max-display');
    if (display) display.textContent = '₹50,000';
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

  document.querySelectorAll('input[name="academy"]:checked').forEach(cb => {
    const name = cb.closest('label').querySelector('span').textContent;
    chips.push({ label: name, clear: () => { cb.checked = false; renderCourses(); } });
  });

  document.querySelectorAll('input[name="mode"]:checked').forEach(cb => {
    chips.push({ label: cb.value, clear: () => { cb.checked = false; renderCourses(); } });
  });

  document.querySelectorAll('input[name="level"]:checked').forEach(cb => {
    chips.push({ label: cb.value, clear: () => { cb.checked = false; renderCourses(); } });
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
      // Rebind events inside mobile drawer
      slot.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('change', renderCourses);
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
