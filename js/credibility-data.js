/**
 * Nova Skills Credibility Data Engine (P1-5)
 * Central manager for Student Project Showcases, Verified Testimonials, and Domain Mentors.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('../data/student-projects.json'),
      require('../data/student-testimonials.json'),
      require('../data/mentors.json')
    );
  } else {
    // In browser, will be initialized with embedded or fetched data
    root.NovaCredibility = factory(
      root.NS_STUDENT_PROJECTS || null,
      root.NS_STUDENT_TESTIMONIALS || null,
      root.NS_MENTORS || null
    );
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function (projectsData, testimonialsData, mentorsData) {
  'use strict';

  let _projects = projectsData && projectsData.projects ? projectsData.projects : [];
  let _testimonials = testimonialsData && testimonialsData.testimonials ? testimonialsData.testimonials : [];
  let _mentors = mentorsData && mentorsData.mentors ? mentorsData.mentors : [];

  function initData(p, t, m) {
    if (p && p.projects) _projects = p.projects;
    else if (Array.isArray(p)) _projects = p;

    if (t && t.testimonials) _testimonials = t.testimonials;
    else if (Array.isArray(t)) _testimonials = t;

    if (m && m.mentors) _mentors = m.mentors;
    else if (Array.isArray(m)) _mentors = m;
  }

  // --- PROJECTS API ---

  function getProjects(filter = {}) {
    let list = _projects.slice();
    if (filter.academyId) {
      list = list.filter(p => p.academyId === filter.academyId);
    }
    if (filter.courseId) {
      list = list.filter(p => p.courseId === filter.courseId);
    }
    if (filter.status) {
      list = list.filter(p => p.status === filter.status);
    }
    return list;
  }

  function getProjectById(projectId) {
    if (!projectId) return null;
    const aliases = {
      'proj-dm-01': 'proj-dm-multichannel-growth',
      'proj-fs-01': 'proj-fs-cloud-saas',
      'proj-gd-01': 'proj-gd-brand-system',
      'proj-nc-01': 'proj-nc-webflow-directory'
    };
    const targetId = aliases[projectId] || projectId;
    return _projects.find(p => p.projectId === targetId || p.projectId === projectId) || null;
  }

  function getProjectsByAcademyId(academyId) {
    return getProjects({ academyId });
  }

  function getProjectsByCourseId(courseId) {
    return getProjects({ courseId });
  }

  // --- TESTIMONIALS API ---

  function getTestimonials(filter = {}) {
    let list = _testimonials.slice();
    if (filter.academyId) {
      list = list.filter(t => t.student && t.student.academyId === filter.academyId);
    }
    if (filter.courseId) {
      list = list.filter(t => t.student && t.student.courseId === filter.courseId);
    }
    if (filter.scope) {
      list = list.filter(t => t.scope === filter.scope);
    }
    return list;
  }

  function getCourseTestimonials(courseId) {
    if (!courseId) return [];
    return _testimonials.filter(t => t.student && t.student.courseId === courseId && t.status === 'published');
  }

  function getInstitutionalTestimonials() {
    return _testimonials.filter(t => (t.scope === 'general-institutional' || (t.verification && t.verification.isGeneralInstitutional)) && t.status === 'published');
  }

  // --- MENTORS API ---

  function getMentors(filter = {}) {
    let list = _mentors.slice();
    if (filter.academyId) {
      list = list.filter(m => m.assignedAcademyIds && m.assignedAcademyIds.includes(filter.academyId));
    }
    return list;
  }

  function getMentorByAcademyId(academyId) {
    if (!academyId) return _mentors[0] || null;
    // Canonical match
    let match = _mentors.find(m => m.assignedAcademyIds && m.assignedAcademyIds.includes(academyId));
    if (match) return match;

    // Normalised match without '-academy'
    const cleanId = academyId.replace(/-academy$/, '');
    match = _mentors.find(m => m.assignedAcademyIds && m.assignedAcademyIds.includes(cleanId));
    if (match) return match;

    // Fallback to digital marketing
    return _mentors.find(m => m.assignedAcademyIds.includes('digital-marketing')) || _mentors[0] || null;
  }

  function getMentorByCourseId(courseId, courseDataList) {
    if (!courseId) return null;
    let academyId = '';
    if (courseDataList && Array.isArray(courseDataList)) {
      const c = courseDataList.find(x => x.id === courseId);
      if (c) academyId = c.academyId;
    }
    return getMentorByAcademyId(academyId);
  }

  // --- HTML RENDER HELPERS ---

  function escapeHTML(str) {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderMentorCardsForCourse(academyId) {
    const mentor = getMentorByAcademyId(academyId);
    if (!mentor) {
      return `
        <div class="mentor-card">
          <div class="mentor-avatar" style="background:var(--grad-hero);"><span class="mentor-initials">NS</span></div>
          <h3 class="mentor-name">Academic &amp; Practical Training Team</h3>
          <div class="mentor-role">Domain Instruction &amp; Portfolio Review Mentors</div>
          <span class="mentor-exp">Industry Practitioner Mentorship</span>
          <p class="mentor-bio">Guided project feedback, modern industry toolchains, code &amp; asset reviews, and structured career preparation.</p>
        </div>
      `;
    }

    const academySpecificMentorship = {
      'digital-marketing': { title: 'Campaign Lab & Ad Budget Reviewer', bio: 'Specialist in ad spend optimization, conversion event debugging, search intent mapping, and ROAS strategy.' },
      'marketing': { title: 'Campaign Lab & Ad Budget Reviewer', bio: 'Specialist in ad spend optimization, conversion event debugging, search intent mapping, and ROAS strategy.' },
      'ai': { title: 'AI Engineering & Workflow Lab Mentor', bio: 'Specialist in custom agent pipelines, API keys integration, n8n webhook nodes, and prompt security testing.' },
      'ai-academy': { title: 'AI Engineering & Workflow Lab Mentor', bio: 'Specialist in custom agent pipelines, API keys integration, n8n webhook nodes, and prompt security testing.' },
      'design': { title: 'Design Critique & Asset Review Mentor', bio: 'Specialist in typography hierarchy, Figma component architecture, print dieline precision, and UI micro-interactions.' },
      'design-academy': { title: 'Design Critique & Asset Review Mentor', bio: 'Specialist in typography hierarchy, Figma component architecture, print dieline precision, and UI micro-interactions.' },
      'programming': { title: 'Full Stack Code Review & Architecture Mentor', bio: 'Specialist in clean code standards, database schema reviews, API security, and deployment pipeline debugging.' },
      'programming-academy': { title: 'Full Stack Code Review & Architecture Mentor', bio: 'Specialist in clean code standards, database schema reviews, API security, and deployment pipeline debugging.' },
      'nocode': { title: 'No-Code E-Commerce & CMS Reviewer', bio: 'Specialist in Shopify checkout flows, Webflow responsive interactions, database relational linking, and page speed.' },
      'no-code-web': { title: 'No-Code E-Commerce & CMS Reviewer', bio: 'Specialist in Shopify checkout flows, Webflow responsive interactions, database relational linking, and page speed.' },
      'nocode-academy': { title: 'No-Code E-Commerce & CMS Reviewer', bio: 'Specialist in Shopify checkout flows, Webflow responsive interactions, database relational linking, and page speed.' },
      'video': { title: 'Video Editing & Timeline Critique Mentor', bio: 'Specialist in pacing, dynamic kinetic typography, color grading profiles, and audio normalization.' },
      'video-motion': { title: 'Video Editing & Timeline Critique Mentor', bio: 'Specialist in pacing, dynamic kinetic typography, color grading profiles, and audio normalization.' },
      'video-academy': { title: 'Video Editing & Timeline Critique Mentor', bio: 'Specialist in pacing, dynamic kinetic typography, color grading profiles, and audio normalization.' },
      '3d': { title: '3D Render & Asset Topology Reviewer', bio: 'Specialist in polygon efficiency, photorealistic texture shading, lighting setups, and real-time engine integration.' },
      '3d-academy': { title: '3D Render & Asset Topology Reviewer', bio: 'Specialist in polygon efficiency, photorealistic texture shading, lighting setups, and real-time engine integration.' },
      'career': { title: 'Proposal & Client Pitch Reviewer', bio: 'Specialist in proposal teardowns, rate negotiation structures, Upwork profile positioning, and contract terms.' },
      'career-freelancing': { title: 'Proposal & Client Pitch Reviewer', bio: 'Specialist in proposal teardowns, rate negotiation structures, Upwork profile positioning, and contract terms.' },
      'career-academy': { title: 'Proposal & Client Pitch Reviewer', bio: 'Specialist in proposal teardowns, rate negotiation structures, Upwork profile positioning, and contract terms.' },
      'communication': { title: 'Executive Voice & Speech Critique Coach', bio: 'Specialist in vocal cadence, persuasive rhetoric, slide deck narrative flow, and high-stakes interview roleplays.' },
      'comm-academy': { title: 'Executive Voice & Speech Critique Coach', bio: 'Specialist in vocal cadence, persuasive rhetoric, slide deck narrative flow, and high-stakes interview roleplays.' },
      'kids': { title: 'Youth Computing & Gamified Lab Mentor', bio: 'Specialist in patient algorithmic guidance, creative bug solving, visual logic reinforcement, and friendly project feedback.' },
      'kids-tech': { title: 'Youth Computing & Gamified Lab Mentor', bio: 'Specialist in patient algorithmic guidance, creative bug solving, visual logic reinforcement, and friendly project feedback.' },
      'creator': { title: 'Channel Analytics & Thumbnail Reviewer', bio: 'Specialist in thumbnail click-through optimization, video retention hook analysis, and YouTube metadata strategy.' },
      'creator-academy': { title: 'Channel Analytics & Thumbnail Reviewer', bio: 'Specialist in thumbnail click-through optimization, video retention hook analysis, and YouTube metadata strategy.' },
      'office': { title: 'Spreadsheet Model & Dashboard Reviewer', bio: 'Specialist in complex nested formula auditing, dynamic pivot automation, Power BI data modeling, and Copilot workflows.' },
      'office-productivity': { title: 'Spreadsheet Model & Dashboard Reviewer', bio: 'Specialist in complex nested formula auditing, dynamic pivot automation, Power BI data modeling, and Copilot workflows.' },
      'office-academy': { title: 'Spreadsheet Model & Dashboard Reviewer', bio: 'Specialist in complex nested formula auditing, dynamic pivot automation, Power BI data modeling, and Copilot workflows.' }
    };

    const cleanId = (academyId || '').replace(/-academy$/, '');
    const secondMentor = academySpecificMentorship[cleanId] || academySpecificMentorship['digital-marketing'];

    return `
      <div class="mentor-card">
        <div class="mentor-avatar" style="background:${mentor.avatarGradient || 'var(--grad-hero)'};"><span class="mentor-initials">${mentor.initials}</span></div>
        <h3 class="mentor-name">${escapeHTML(mentor.displayName)}</h3>
        <div class="mentor-role">${escapeHTML(mentor.designation)}</div>
        <span class="mentor-exp">${escapeHTML(mentor.experience.summary)}</span>
        <p class="mentor-bio">${escapeHTML(mentor.bio)}</p>
      </div>

      <div class="mentor-card">
        <div class="mentor-avatar" style="background:var(--grad-teal-green);"><span class="mentor-initials">PR</span></div>
        <h3 class="mentor-name">${escapeHTML(secondMentor.title)}</h3>
        <div class="mentor-role">Hands-On Lab &amp; Portfolio Review Mentor</div>
        <span class="mentor-exp">Live Project Mentorship</span>
        <p class="mentor-bio">${escapeHTML(secondMentor.bio)}</p>
      </div>
    `;
  }

  function renderTestimonialsSectionForCourse(courseId, courseName) {
    const courseSpecific = getCourseTestimonials(courseId);
    let itemsToDisplay = [];
    let isGeneralExperience = false;

    if (courseSpecific.length > 0) {
      itemsToDisplay = courseSpecific;
    } else {
      // Use general institutional feedback
      itemsToDisplay = getInstitutionalTestimonials().slice(0, 2);
      isGeneralExperience = true;
    }

    if (itemsToDisplay.length === 0) {
      return ''; // Clean suppression: zero blank cards
    }

    const sectionTag = isGeneralExperience ? 'STUDENT EXPERIENCE AT NOVA SKILLS' : 'COURSE TESTIMONIALS';
    const sectionTitle = isGeneralExperience
      ? 'Learner Experience <span class="gradient-text">at Nova Skills</span>'
      : `What Learners Say <span class="gradient-text">About This Course</span>`;

    const cardsHtml = itemsToDisplay.map(t => {
      const student = t.student || {};
      const ratingStars = '★'.repeat(t.testimonial.rating || 5);
      return `
        <div class="testimonial-card">
          <div class="testimonial-quote">“</div>
          <p class="testimonial-text">"${escapeHTML(t.testimonial.quote)}"</p>
          <div class="testimonial-footer">
            <div class="testimonial-avatar" style="background:${student.avatarGradient || 'var(--teal)'};">${student.initials || 'NS'}</div>
            <div>
              <div class="testimonial-name">${escapeHTML(student.displayName)}</div>
              <div class="testimonial-role">${escapeHTML(student.currentRole || 'Nova Skills Alumnus')}</div>
              ${student.courseName && !isGeneralExperience ? `<div class="testimonial-course" style="font-size:0.75rem; color:var(--teal); font-weight:600; margin-top:2px;">${escapeHTML(student.courseName)}</div>` : ''}
            </div>
            <div class="testimonial-stars" aria-label="${t.testimonial.rating || 5} out of 5 stars">${ratingStars}</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <section class="container course-body-section" id="testimonials-section">
        <div class="section-header" style="text-align:left; margin-bottom:32px;">
          <span class="section-tag">${sectionTag}</span>
          <h2 class="section-title">${sectionTitle}</h2>
          ${isGeneralExperience ? '<p style="color:var(--text-secondary); font-size:0.95rem; margin-top:4px;">Verified reflections from alumni who developed their practical portfolios with Nova Skills mentors.</p>' : ''}
        </div>

        <div class="testimonials-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
          ${cardsHtml}
        </div>
      </section>
    `;
  }

  return {
    initData,
    getProjects,
    getProjectById,
    getProjectsByAcademyId,
    getProjectsByCourseId,
    getTestimonials,
    getCourseTestimonials,
    getInstitutionalTestimonials,
    getMentors,
    getMentorByAcademyId,
    getMentorByCourseId,
    renderMentorCardsForCourse,
    renderTestimonialsSectionForCourse
  };
});
