/**
 * Nova Skills — Academy Hero Visual A/B Experiment Controller
 * Experiment ID: exp_academy_hero_visual_2026
 * Variant A: Control (Text-only baseline hero)
 * Variant B: Image Enhanced (Phase B approved editorial photography)
 *
 * Strict Compliance:
 * - Inactive in production by default (Gate 12: Do not activate production traffic allocation without explicit approval).
 * - Deterministic manual QA override via ?ab_hero=control or ?ab_hero=variant_b (or ?exp=control / ?exp=variant_b).
 * - Dispatches non-PII events to window.gtag and window.dataLayer.
 */
(function() {
  'use strict';

  var EXP_CONFIG = {
    id: 'exp_academy_hero_visual_2026',
    active: false, // Default inactive per Gate 12
    academy: 'design',
    ratio: 0.5
  };

  // Detect URL parameter override
  var params = new URLSearchParams(window.location.search);
  var override = params.get('ab_hero') || params.get('exp');

  var variant = 'variant_b'; // Default rendered variant (pre-rendered in HTML)

  if (override === 'control' || override === 'a') {
    variant = 'control';
  } else if (override === 'variant_b' || override === 'b') {
    variant = 'variant_b';
  } else if (EXP_CONFIG.active) {
    try {
      var stored = localStorage.getItem('ns_ab_' + EXP_CONFIG.id);
      if (stored === 'control' || stored === 'variant_b') {
        variant = stored;
      } else {
        variant = Math.random() < EXP_CONFIG.ratio ? 'variant_b' : 'control';
        localStorage.setItem('ns_ab_' + EXP_CONFIG.id, variant);
      }
    } catch (e) {
      variant = 'variant_b';
    }
  }

  function applyVariant() {
    var visualCol = document.getElementById('academy-hero-visual-col');
    var heroGrid = document.querySelector('.academy-hero-grid');
    if (!visualCol || !heroGrid) return;

    if (variant === 'control') {
      visualCol.style.display = 'none';
      heroGrid.classList.add('hero-grid-control');
    } else {
      visualCol.style.display = '';
      heroGrid.classList.remove('hero-grid-control');
    }

    trackEvent('academy_hero_experiment_exposure', {
      experiment_id: EXP_CONFIG.id,
      variant_id: variant,
      academy_id: EXP_CONFIG.academy
    });
  }

  function bindCtaTracking() {
    var enrollBtn = document.getElementById('btn-enroll-now');
    var consultBtn = document.getElementById('btn-free-consultation');

    if (enrollBtn && !enrollBtn._expBound) {
      enrollBtn._expBound = true;
      enrollBtn.addEventListener('click', function() {
        trackEvent('academy_hero_enroll_click', {
          experiment_id: EXP_CONFIG.id,
          variant_id: variant,
          academy_id: EXP_CONFIG.academy,
          cta_placement: 'hero_primary'
        });
      });
    }

    if (consultBtn && !consultBtn._expBound) {
      consultBtn._expBound = true;
      consultBtn.addEventListener('click', function() {
        trackEvent('academy_hero_consultation_click', {
          experiment_id: EXP_CONFIG.id,
          variant_id: variant,
          academy_id: EXP_CONFIG.academy,
          cta_placement: 'hero_secondary'
        });
      });
    }
  }

  function trackEvent(name, data) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, data);
      }
      if (Array.isArray(window.dataLayer)) {
        var payload = { event: name };
        for (var k in data) {
          if (Object.prototype.hasOwnProperty.call(data, k)) {
            payload[k] = data[k];
          }
        }
        window.dataLayer.push(payload);
      }
    } catch (e) {
      // Graceful telemetry failure — never block user interaction
    }
  }

  // Public diagnostic API for automated testing and QA
  window.NS_HERO_EXPERIMENT = {
    config: EXP_CONFIG,
    variant: variant,
    setVariant: function(v) {
      if (v === 'control' || v === 'variant_b') {
        variant = v;
        applyVariant();
      }
    },
    trackEvent: trackEvent
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applyVariant();
      bindCtaTracking();
    });
  } else {
    applyVariant();
    bindCtaTracking();
  }
})();
