/**
 * Nova Skills Central Admissions Contact Configuration & Utilities
 * Single Source of Truth for Helpline, WhatsApp, and Contact Protocols
 * Version: 1.0.0 (P1-4 Release)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exports = factory();
    root.CONTACT_CONFIG = exports.CONTACT_CONFIG;
    root.NovaContact = exports;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const CONTACT_CONFIG = {
    admissions: {
      displayNumber: "+91 9695904440",
      phoneNumber: "+919695904440",
      whatsappNumber: "919695904440",
      email: "novaskills.official@gmail.com",
      campusAddress: "Nova Skills Institute, Siddharth Nagar, Uttar Pradesh - 272153",

      operatingHours: {
        days: "Monday to Saturday",
        opening: "09:00",
        closing: "19:00",
        timezone: "Asia/Kolkata"
      }
    }
  };

  /**
   * Returns official callable telephone link
   * @returns {string} e.g. "tel:+919695904440"
   */
  function getAdmissionsPhoneLink() {
    return `tel:${CONTACT_CONFIG.admissions.phoneNumber}`;
  }

  /**
   * Formats official helpline for human-readable display
   * @returns {string} e.g. "+91 9695904440"
   */
  function formatAdmissionsPhoneNumber() {
    return CONTACT_CONFIG.admissions.displayNumber;
  }

  /**
   * Validates whether a provided number matches the official admissions contact number
   * @param {string} num
   * @returns {boolean}
   */
  function validateContactNumber(num) {
    if (!num || typeof num !== 'string') return false;
    const clean = num.replace(/\D/g, '');
    return clean === '919695904440' || clean === '9695904440';
  }

  /**
   * Generates context-aware prefilled WhatsApp message adhering to Section 5 taxonomy
   * @param {Object|string} [context={}]
   * @returns {string}
   */
  function getWhatsAppMessage(context = {}) {
    if (typeof context === 'string') {
      if (context === 'counselling') {
        return 'Hi Nova Skills, I would like free career counselling to help me choose the right course.';
      }
      if (context === 'demo') {
        return 'Hi Nova Skills, I would like to enquire about the 2-Day Free Demo. Please share the eligibility and upcoming schedule.';
      }
      context = { courseName: context };
    }

    // 1. Demo-related message
    if (context.intent === 'demo') {
      const courseName = context.courseName || context.courseTitle;
      if (courseName) {
        return `Hi Nova Skills, I would like to enquire about the 2-Day Free Demo for ${courseName}. Please share the eligibility and upcoming schedule.`;
      }
      return 'Hi Nova Skills, I would like to enquire about the 2-Day Free Demo. Please share the eligibility and upcoming schedule.';
    }

    // 2. Counselling-related message
    if (context.intent === 'counselling') {
      if (context.courseName || context.courseTitle) {
        return `Hi Nova Skills, I would like free career counselling for the ${context.courseName || context.courseTitle} course.`;
      }
      return 'Hi Nova Skills, I would like free career counselling to help me choose the right course.';
    }

    // 3. Course-detail message
    if (context.courseName || context.courseTitle) {
      const courseName = (context.courseName || context.courseTitle).trim();
      const spec = context.specialization ? ` (Specialization: ${context.specialization.trim()})` : '';
      return `Hi Nova Skills, I am interested in the ${courseName}${spec} course. Please share the syllabus, fees and upcoming batch information.`;
    }

    // 4. Academy-page message
    if (context.academyName) {
      const acadName = context.academyName.includes('Academy')
        ? context.academyName.trim()
        : `${context.academyName.trim()} Academy`;
      return `Hi Nova Skills, I am interested in your ${acadName}. Please help me explore the available courses and learning options.`;
    }

    // 5. Location-page message
    if (context.city) {
      return `Hi Nova Skills, I am interested in your online learning options for ${context.city.trim()}. Please share available courses and counselling details.`;
    }

    // 6. Standard general enquiry fallback
    return 'Hi Nova Skills, I am interested in your courses. Please help me with course details, fees and upcoming batch information.';
  }

  /**
   * Generates official WhatsApp click-to-chat URL with URL-encoded message
   * @param {Object|string} [context={}]
   * @returns {string} e.g. "https://wa.me/919695904440?text=..."
   */
  function getAdmissionsWhatsAppLink(context = {}) {
    const message = getWhatsAppMessage(context);
    return `https://wa.me/${CONTACT_CONFIG.admissions.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Resolves current page context from DOM or URL parameters
   * @returns {Object}
   */
  function resolveCurrentPageContactContext() {
    if (typeof window === 'undefined') return { pageType: 'general' };

    // Check window.currentCourse
    if (window.currentCourse && window.currentCourse.name) {
      return {
        courseId: window.currentCourse.id || '',
        courseName: window.currentCourse.name,
        academyName: window.currentCourse.academy || '',
        academyId: window.currentCourse.academyId || '',
        pageType: 'course_detail'
      };
    }

    // Check URL search param ?id=...
    try {
      const urlParams = new URLSearchParams(window.location.search || '');
      const courseId = urlParams.get('id');
      if (courseId && window.NovaCourseData && typeof window.NovaCourseData.getCourseById === 'function') {
        const c = window.NovaCourseData.getCourseById(courseId);
        if (c) {
          return {
            courseId: c.id,
            courseName: c.name,
            academyName: c.academy || '',
            academyId: c.academyId || '',
            pageType: 'course_detail'
          };
        }
      }
    } catch (e) {}

    // Check Academy from DOM or URL
    if (window.currentAcademy && window.currentAcademy.name) {
      return {
        academyName: window.currentAcademy.name,
        academyId: window.currentAcademy.id || '',
        pageType: 'academy_detail'
      };
    }

    const path = (window.location.pathname || '').toLowerCase();
    if (path.includes('/academies/')) {
      const parts = path.split('/').filter(Boolean);
      const acadSlug = parts[1];
      if (acadSlug && window.NovaCourseData && typeof window.NovaCourseData.getAcademyById === 'function') {
        const a = window.NovaCourseData.getAcademyById(acadSlug);
        if (a) {
          return {
            academyName: a.name,
            academyId: a.id,
            pageType: 'academy_detail'
          };
        }
      }
    }

    // Check City from DOM or URL
    const bodyCity = typeof document !== 'undefined' && document.body && typeof document.body.getAttribute === 'function' && document.body.getAttribute('data-city-name');
    if (bodyCity) {
      return {
        city: bodyCity,
        pageType: 'city_location'
      };
    }

    if (path.includes('/branches/')) {
      const parts = path.split('/').filter(Boolean);
      const citySlug = parts[1];
      if (citySlug && citySlug !== 'index.html') {
        const cityName = citySlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        return {
          city: cityName,
          pageType: 'city_location'
        };
      }
    }

    return { pageType: 'general' };
  }

  /**
   * Updates floating WhatsApp and footer contact links sitewide based on page context
   */
  function updateDynamicContactLinks() {
    if (typeof document === 'undefined') return;

    const ctx = resolveCurrentPageContactContext();
    const waUrl = getAdmissionsWhatsAppLink(ctx);

    // 1. Floating WhatsApp Button
    const waBtn = document.getElementById('whatsapp-btn') || document.querySelector('.whatsapp-float');
    if (waBtn) {
      waBtn.href = waUrl;
      waBtn.setAttribute('data-course-id', ctx.courseId || '');
      waBtn.setAttribute('data-academy-id', ctx.academyId || '');
      waBtn.setAttribute('data-city', ctx.city || '');
      waBtn.setAttribute('data-source-component', 'floating_whatsapp_btn');
    }

    // 2. Footer WhatsApp Link
    const footerWa = document.getElementById('footer-whatsapp-link');
    if (footerWa) {
      footerWa.href = waUrl;
      footerWa.setAttribute('data-course-id', ctx.courseId || '');
      footerWa.setAttribute('data-academy-id', ctx.academyId || '');
      footerWa.setAttribute('data-city', ctx.city || '');
      footerWa.setAttribute('data-source-component', 'footer_whatsapp_link');
    }

    // 3. Footer Phone Link
    const footerPhone = document.getElementById('footer-phone-link');
    if (footerPhone) {
      footerPhone.href = getAdmissionsPhoneLink();
    }

    // 4. Mobile Drawer Phone Link
    const drawerPhone = document.getElementById('mobile-drawer-phone-btn');
    if (drawerPhone) {
      drawerPhone.href = getAdmissionsPhoneLink();
    }

    // 5. Mobile Drawer WhatsApp Link
    const drawerWa = document.getElementById('mobile-drawer-whatsapp-btn');
    if (drawerWa) {
      drawerWa.href = waUrl;
      drawerWa.setAttribute('data-course-id', ctx.courseId || '');
      drawerWa.setAttribute('data-academy-id', ctx.academyId || '');
      drawerWa.setAttribute('data-city', ctx.city || '');
      drawerWa.setAttribute('data-source-component', 'mobile_drawer_whatsapp');
    }
  }

  return {
    CONTACT_CONFIG,
    getAdmissionsPhoneLink,
    formatAdmissionsPhoneNumber,
    validateContactNumber,
    getWhatsAppMessage,
    getAdmissionsWhatsAppLink,
    resolveCurrentPageContactContext,
    updateDynamicContactLinks
  };
});
