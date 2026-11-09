/**
 * Nova Skills Location CTA & Conversion Integration Contract
 * Phase 02 — Lead Form Integration & Design System Tokens
 */

'use strict';

/**
 * Design system tokens for future location page components.
 * Adheres strictly to approved Nova Skills brand palette.
 */
const BRAND_TOKENS = {
  colors: {
    primaryBlue: '#004672',
    deepNavy: '#012B46',
    iceBlue: '#EAF3F8',
    white: '#FFFFFF',
    orange: '#EF7F1A',
    surfaceGray: '#F8FAFC',
    borderLight: '#E2E8F0',
    textMain: '#1E293B',
    textMuted: '#64748B'
  },
  typography: {
    fontFamilyHeading: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontFamilyBody: "'Inter', system-ui, -apple-system, sans-serif"
  },
  ctaButtons: {
    enrollPrimary: {
      background: 'linear-gradient(135deg, #004672 0%, #012B46 100%)',
      color: '#FFFFFF',
      borderRadius: '8px',
      padding: '12px 24px'
    },
    demoSecondary: {
      background: 'linear-gradient(135deg, #EF7F1A 0%, #D96B0E 100%)',
      color: '#FFFFFF',
      borderRadius: '8px',
      padding: '12px 24px'
    },
    consultationTertiary: {
      background: 'transparent',
      border: '1px solid #004672',
      color: '#004672',
      borderRadius: '8px',
      padding: '12px 24px'
    }
  }
};

/**
 * Builds the conversion attribution metadata for lead forms.
 * Integrates directly with existing modals without modifying student fields.
 * @param {Object} location
 * @param {Object} [course]
 * @param {string} [ctaSource]
 * @returns {Object}
 */
function buildModalContextPayload(location, course, ctaSource = 'hero_primary') {
  return {
    source_page: 'city_location_page',
    origin_city_slug: location.slug,
    origin_city_name: location.city,
    origin_state_name: location.state,
    delivery_mode: 'Live Interactive Online',
    cta_source: ctaSource,
    course_id: course ? course.id : null,
    course_title: course ? course.title : null,
    academy_id: course ? course.academyId : null,
    target_modal: {
      demo: '#demo-booking-modal',
      consultation: '#consultation-popup',
      enrollment: '#enrollment-modal'
    }
  };
}

module.exports = {
  BRAND_TOKENS,
  buildModalContextPayload
};
