/**
 * Nova Skills Pilot City Pages Interactive Controller
 * Phase 04 — Decision-Support Explorer, Tab Switching & Modal Lead Attribution
 */

'use strict';

(function () {
  document.addEventListener('DOMContentLoaded', initCityPageInteractivity);

  function initCityPageInteractivity() {
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
        });
      });
    }
  }

  // Global helper for Course Free Demo trigger from city cards
  window.openCityCourseDemo = function (courseId, courseTitle) {
    try {
      const citySlug = document.body.getAttribute('data-city-slug') || '';
      const cityName = document.body.getAttribute('data-city-name') || '';
      sessionStorage.setItem('nova_last_city_slug', citySlug);
      sessionStorage.setItem('nova_last_city_name', cityName);
      if (courseId) sessionStorage.setItem('nova_last_course_id', courseId);
    } catch (e) {}

    if (typeof window.openFreeDemoModal === 'function') {
      window.openFreeDemoModal(courseId);
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
    try {
      const citySlug = document.body.getAttribute('data-city-slug') || '';
      const cityName = document.body.getAttribute('data-city-name') || '';
      sessionStorage.setItem('nova_last_city_slug', citySlug);
      sessionStorage.setItem('nova_last_city_name', cityName);
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

  // Global helper for Enrollment trigger from city pages
  window.openCityEnrollment = function (courseId) {
    try {
      const citySlug = document.body.getAttribute('data-city-slug') || '';
      const cityName = document.body.getAttribute('data-city-name') || '';
      sessionStorage.setItem('nova_last_city_slug', citySlug);
      sessionStorage.setItem('nova_last_city_name', cityName);
      if (courseId) sessionStorage.setItem('nova_last_course_id', courseId);
    } catch (e) {}

    if (typeof window.openEnrollmentModal === 'function') {
      window.openEnrollmentModal(courseId);
    } else {
      window.location.href = courseId ? `/course-detail.html?id=${courseId}` : '/courses.html';
    }
  };
})();
