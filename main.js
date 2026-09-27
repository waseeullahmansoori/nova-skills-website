/* ============================================================
   NOVA SKILLS – Main & Homepage Interactive Controller
   2026 | Premium Education Institute
   ============================================================ */

'use strict';

// ===== INITIALIZATION =====
function initInteractiveModules() {
  initCanonicalCounts();
  initCourseFilter();
  initFAQ();
  initFormSubmission();
  initMarquee();
  initVideoFacades();
  initDeferredBackgrounds();
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(initInteractiveModules, { timeout: 2500 });
} else {
  setTimeout(initInteractiveModules, 300);
}

// ===== DYNAMIC CANONICAL COUNTS HYDRATION =====
function initCanonicalCounts() {
  if (typeof window.NovaSkillsData === 'undefined') return;

  window.NovaSkillsData.hydrateDOM();

  const academiesCount = window.NovaSkillsData.getTotalAcademiesCount();
  const coursesCount = window.NovaSkillsData.getTotalCoursesCount();

  const academiesCard = document.querySelector('.stat-card #stat-academies')?.closest('.stat-card') || 
                        document.querySelector('.stat-card[data-count="12"]');
  if (academiesCard) {
    academiesCard.setAttribute('data-count', academiesCount);
  }

  const coursesCard = document.querySelector('.stat-card #stat-courses')?.closest('.stat-card') || 
                      document.querySelector('.stat-card[data-count="100"]') || 
                      document.querySelector('.stat-card[data-count="109"]');
  if (coursesCard) {
    coursesCard.setAttribute('data-count', coursesCount);
  }

  // Hydrate academy cards badges
  document.querySelectorAll('[data-academy-course-badge]').forEach(el => {
    const acadId = el.getAttribute('data-academy-course-badge');
    if (acadId) {
      const count = window.NovaSkillsData.getAcademyCourseCount(acadId);
      el.textContent = `${count} Courses`;
    }
  });

  // Update view all courses button if present
  const viewAllBtn = document.getElementById('view-all-courses');
  if (viewAllBtn) {
    viewAllBtn.textContent = `View All ${coursesCount}+ Courses`;
  }
}

// ===== COURSE FILTER =====
function initCourseFilter() {
  const tabs = document.querySelectorAll('.course-tab');
  const courseCards = document.querySelectorAll('.course-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      courseCards.forEach((card, index) => {
        const category = card.dataset.category;
        const matches = filter === 'all' || category === filter;

        if (matches) {
          card.style.display = 'flex';
          card.style.flexDirection = 'column';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95) translateY(10px)';
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, index * 60);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

// ===== FAQ ACCORDION =====
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherQuestion = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');

          if (otherQuestion && otherAnswer) {
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherAnswer.hidden = true;
          }
        }
      });

      if (isExpanded) {
        question.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        answer.style.animation = 'fadeInUp 0.3s ease forwards';
      }
    });
  });
}

// ===== COUNSELLING FORM SUBMISSION =====
function initFormSubmission() {
  const form = document.getElementById('counselling-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('#counselling-submit');
    const nameEl = document.getElementById('full-name');
    const phoneEl = document.getElementById('phone');
    const emailEl = document.getElementById('email');
    const courseEl = document.getElementById('course-interest');

    const name = nameEl ? nameEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';

    if (!name) {
      showFormError('full-name', 'Please enter your full name');
      return;
    }

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      showFormError('phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    const course = courseEl ? (courseEl.options[courseEl.selectedIndex]?.text || courseEl.value) : '';

    if (typeof submitNovaForm === 'function') {
      await submitNovaForm({
        form,
        submitBtn,
        loadingText: 'Booking...',
        data: {
          name,
          mobile: phone,
          email: emailEl ? emailEl.value.trim() : '',
          course
        }
      });
    }
  });
}

function showFormError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.style.borderColor = 'rgba(239, 68, 68, 0.7)';
  field.focus();

  field.addEventListener('input', () => {
    field.style.borderColor = '';
  }, { once: true });
}

// ===== MARQUEE PAUSE ON HOVER =====
function initMarquee() {
  const track = document.querySelector('.partners-track');
  const wrapper = document.querySelector('.partners-marquee-wrapper');

  if (!track || !wrapper) return;

  wrapper.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  wrapper.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

// ===== CLICK-TO-LOAD YOUTUBE VIDEO FACADE =====
function initVideoFacades() {
  const videoContainers = document.querySelectorAll('.youtube-facade, [data-youtube-id]');
  videoContainers.forEach(container => {
    const videoId = container.dataset.youtubeId;
    if (!videoId) return;

    container.style.position = 'relative';
    container.style.cursor = 'pointer';
    container.style.overflow = 'hidden';
    container.setAttribute('role', 'button');
    container.setAttribute('tabindex', '0');
    container.setAttribute('aria-label', 'Play video');

    const posterUrl = container.dataset.poster || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    container.innerHTML = `
      <img src="${posterUrl}" alt="Video Thumbnail" class="video-facade-poster" style="width:100%; height:100%; object-fit:cover; display:block;" loading="lazy" decoding="async" />
      <div class="video-play-btn" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:68px; height:48px; background:rgba(1,23,49,0.85); border-radius:14px; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 24px rgba(0,0,0,0.3); transition:transform 0.2s, background 0.2s;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><path d="M8 5v14l11-7z"/></svg>
      </div>
    `;

    const loadVideo = () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = container.dataset.title || 'Nova Skills Course Video Preview';
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      container.innerHTML = '';
      container.appendChild(iframe);
    };

    container.addEventListener('click', loadVideo);
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadVideo();
      }
    });
  });
}

// ===== INTERSECTION OBSERVER DEFERRED BACKGROUND IMAGES =====
function initDeferredBackgrounds() {
  const bgElements = document.querySelectorAll('[data-bg-src], .defer-bg');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const bgSrc = el.dataset.bgSrc;
          if (bgSrc) {
            el.style.backgroundImage = `url('${bgSrc}')`;
          }
          obs.unobserve(el);
        }
      });
    }, { rootMargin: '200px' });

    bgElements.forEach(el => observer.observe(el));
  } else {
    bgElements.forEach(el => {
      if (el.dataset.bgSrc) {
        el.style.backgroundImage = `url('${el.dataset.bgSrc}')`;
      }
    });
  }
}
