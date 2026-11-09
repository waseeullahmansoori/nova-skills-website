/**
 * Nova Skills City Pages Interactive Controller
 * Phase 08 — Decision-Support Explorer, Tab Switching, Modal Lead Attribution & GA4 Analytics
 */

'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', initCityPageInteractivity);

  function initCityPageInteractivity() {
    const citySlug = document.body.getAttribute('data-city-slug') || '';
    const cityName = document.body.getAttribute('data-city-name') || '';

    // Fire location page view event (non-PII)
    if (typeof window.sendGA4Event === 'function') {
      window.sendGA4Event('location_page_view', {
        location_slug: citySlug,
        location_name: cityName,
        page_type: 'city_learning_location'
      });
    }

    // 1. Decision-Support Explorer Tabs
    const tabButtons = Array.from(document.querySelectorAll('.city-decision-tab-btn'));
    const tabPanels = Array.from(document.querySelectorAll('.city-decision-panel'));

    if (tabButtons.length > 0 && tabPanels.length > 0) {
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTabId = btn.getAttribute('data-tab');

          tabButtons.forEach(b => b.classList.remove('active'));
          tabPanels.forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          const targetPanel = document.getElementById(targetTabId);
          if (targetPanel) {
            targetPanel.classList.add('active');
          }

          // Track course tab exploration
          if (typeof window.sendGA4Event === 'function') {
            window.sendGA4Event('location_course_select', {
              location_slug: citySlug,
              tab_id: targetTabId
            });
          }
        });
      });
    }
  }

  // Global helper for Course Free Demo trigger from city cards
  window.openCityCourseDemo = function (courseId, courseTitle) {
    const citySlug = document.body.getAttribute('data-city-slug') || '';
    const cityName = document.body.getAttribute('data-city-name') || '';

    try {
      sessionStorage.setItem('nova_last_city_slug', citySlug);
      sessionStorage.setItem('nova_last_city_name', cityName);
      if (courseId) sessionStorage.setItem('nova_last_course_id', courseId);
    } catch (e) {}

    // Track demo modal open
    if (typeof window.sendGA4Event === 'function') {
      window.sendGA4Event('location_demo_open', {
        location_slug: citySlug,
        course_id: courseId || '',
        cta_placement: 'city_course_card'
      });
    }

    if (typeof window.openFreeDemoModal === 'function') {
      window.openFreeDemoModal(courseId);
    } else if (typeof window.openDemoModal === 'function') {
      window.openDemoModal(courseId);
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

  // Global helper for Consultation trigger from city pages
  window.openCityConsultation = function () {
    const citySlug = document.body.getAttribute('data-city-slug') || '';
    const cityName = document.body.getAttribute('data-city-name') || '';

    try {
      sessionStorage.setItem('nova_last_city_slug', citySlug);
      sessionStorage.setItem('nova_last_city_name', cityName);
    } catch (e) {}

    // Track consultation open
    if (typeof window.sendGA4Event === 'function') {
      window.sendGA4Event('location_consultation_open', {
        location_slug: citySlug,
        cta_placement: 'city_hero_cta'
      });
    }

    if (typeof window.openConsultationPopup === 'function') {
      window.openConsultationPopup();
    } else if (typeof window.openConsultationModal === 'function') {
      window.openConsultationModal();
    } else {
      const consultModal = document.getElementById('popup-overlay') || document.getElementById('consultation-popup') || document.querySelector('.consultation-modal');
      if (consultModal) {
        consultModal.removeAttribute('hidden');
        consultModal.classList.add('visible');
      } else {
        window.location.href = '/contact.html';
      }
    }
  };

  // Global helper for Enrollment trigger from city pages
  window.openCityEnrollment = function (courseId) {
    const citySlug = document.body.getAttribute('data-city-slug') || '';
    const cityName = document.body.getAttribute('data-city-name') || '';

    try {
      sessionStorage.setItem('nova_last_city_slug', citySlug);
      sessionStorage.setItem('nova_last_city_name', cityName);
      if (courseId) sessionStorage.setItem('nova_last_course_id', courseId);
    } catch (e) {}

    // Track enrollment modal open
    if (typeof window.sendGA4Event === 'function') {
      window.sendGA4Event('location_enrollment_open', {
        location_slug: citySlug,
        course_id: courseId || '',
        cta_placement: 'city_hero_cta'
      });
    }

    if (typeof window.openEnrollmentModal === 'function') {
      window.openEnrollmentModal(courseId);
    } else {
      window.location.href = courseId ? `/course-detail.html?id=${courseId}` : '/courses.html';
    }
  };
})();
