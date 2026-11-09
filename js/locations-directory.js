/**
 * Nova Skills Nationwide Learning Locations Directory Client Script
 * Phase 03 — Fast Search, State Filtering, Live Count & Modal Integration
 */

'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', initLocationsDirectory);

  function initLocationsDirectory() {
    const searchInput = document.getElementById('city-search-input');
    const clearSearchBtn = document.getElementById('search-clear-btn');
    const stateSelect = document.getElementById('state-filter-select');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const resetEmptyBtn = document.getElementById('reset-empty-btn');
    const countBadge = document.getElementById('cities-count');
    const citiesGrid = document.getElementById('cities-grid');
    const emptyState = document.getElementById('empty-state');
    const liveAnnouncer = document.getElementById('filter-live-announcer');

    if (!citiesGrid) return;

    const cards = Array.from(citiesGrid.querySelectorAll('.loc-city-card'));
    const totalCities = cards.length;

    // Filter state handler
    function filterLocations() {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      const selectedState = (stateSelect ? stateSelect.value : 'all').trim().toLowerCase();

      // Show/hide clear search button
      if (clearSearchBtn) {
        clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';
      }

      let visibleCount = 0;

      cards.forEach(card => {
        const cityName = (card.getAttribute('data-city') || '').toLowerCase();
        const stateName = (card.getAttribute('data-state') || '').toLowerCase();
        const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();

        const matchesQuery = !query ||
          cityName.includes(query) ||
          stateName.includes(query) ||
          keywords.includes(query);

        const matchesState = selectedState === 'all' || stateName === selectedState;

        if (matchesQuery && matchesState) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update count badge
      if (countBadge) {
        countBadge.textContent = visibleCount;
      }

      // Empty state toggle
      if (visibleCount === 0) {
        citiesGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
      } else {
        citiesGrid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';
      }

      // Screen reader announcement
      if (liveAnnouncer) {
        liveAnnouncer.textContent = `Showing ${visibleCount} of ${totalCities} learning locations.`;
      }
    }

    // Debounced search
    let debounceTimer = null;
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filterLocations, 100);
      });
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          filterLocations();
        }
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (searchInput) searchInput.focus();
        filterLocations();
      });
    }

    if (stateSelect) {
      stateSelect.addEventListener('change', filterLocations);
    }

    function resetAllFilters() {
      if (searchInput) searchInput.value = '';
      if (stateSelect) stateSelect.value = 'all';
      filterLocations();
      if (searchInput) searchInput.focus();
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', resetAllFilters);
    }
    if (resetEmptyBtn) {
      resetEmptyBtn.addEventListener('click', resetAllFilters);
    }

    // Smooth scroll for hero anchor
    const findCityBtn = document.getElementById('hero-find-city-btn');
    if (findCityBtn) {
      findCityBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('city-explorer');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (searchInput) {
            setTimeout(() => searchInput.focus(), 500);
          }
        }
      });
    }
  }

  // Global helper for city demo booking modal trigger
  window.openLocationDemo = function (citySlug, cityName) {
    try {
      sessionStorage.setItem('nova_last_city_slug', citySlug || '');
      sessionStorage.setItem('nova_last_city_name', cityName || '');
    } catch (e) {}

    if (typeof window.openFreeDemoModal === 'function') {
      window.openFreeDemoModal();
    } else {
      const demoModal = document.getElementById('demo-booking-modal') || document.querySelector('.free-demo-modal');
      if (demoModal) {
        demoModal.classList.add('active');
        demoModal.setAttribute('aria-hidden', 'false');
      } else {
        window.location.href = '/courses.html';
      }
    }
  };

  // Global helper for city consultation modal trigger
  window.openLocationConsultation = function (citySlug, cityName) {
    try {
      sessionStorage.setItem('nova_last_city_slug', citySlug || '');
      sessionStorage.setItem('nova_last_city_name', cityName || '');
    } catch (e) {}

    if (typeof window.openConsultationModal === 'function') {
      window.openConsultationModal();
    } else {
      const consultModal = document.getElementById('consultation-popup') || document.querySelector('.consultation-modal');
      if (consultModal) {
        consultModal.classList.add('active');
      } else {
        window.location.href = '/contact.html';
      }
    }
  };
})();
