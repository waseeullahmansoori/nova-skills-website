/**
 * Nova Skills Centralized Icon System & Safe Icon Registry
 * 
 * Provides safe resolution and rendering for:
 * - Course Banner Visuals (SVG vector icons and verified emojis)
 * - Academy Badges and Description Labels (Strict separation: always uses Academy's official icon)
 * 
 * Security: Prevents raw icon class tokens (e.g. 'fas fa-robot') from ever appearing as visible text.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js CommonJS
    module.exports = factory();
  } else {
    // Browser global
    root.NovaIcons = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // 1. Academy Official Icons Registry (Strictly 12 Academies)
  const ACADEMY_REGISTRY = {
    'digital-marketing': { id: 'digital-marketing', name: 'Digital Marketing Academy', icon: '📊' },
    'ai': { id: 'ai', name: 'AI Academy', icon: '🤖' },
    'design': { id: 'design', name: 'Design Academy', icon: '🎨' },
    'programming': { id: 'programming', name: 'Programming Academy', icon: '💻' },
    'nocode': { id: 'nocode', name: 'No-Code Web Academy', icon: '🌐' },
    'video': { id: 'video', name: 'Video & Motion Academy', icon: '🎬' },
    '3d': { id: '3d', name: '3D Academy', icon: '🏗️' },
    'career': { id: 'career', name: 'Career & Freelancing Academy', icon: '💼' },
    'communication': { id: 'communication', name: 'Communication Academy', icon: '💬' },
    'kids': { id: 'kids', name: 'Kids Tech Academy', icon: '👨‍💻' },
    'creator': { id: 'creator', name: 'Creator Academy', icon: '🎥' },
    'office': { id: 'office', name: 'Office Productivity Academy', icon: '📋' }
  };

  // Name to ID normalization
  const ACADEMY_NAME_MAP = {
    'digital marketing academy': 'digital-marketing',
    'ai academy': 'ai',
    'design academy': 'design',
    'programming academy': 'programming',
    'no-code web academy': 'nocode',
    'video & motion academy': 'video',
    '3d academy': '3d',
    'career & freelancing academy': 'career',
    'communication academy': 'communication',
    'kids tech academy': 'kids',
    'creator academy': 'creator',
    'office productivity academy': 'office'
  };

  /**
   * Safely resolves the official icon for an Academy.
   * NEVER uses course-specific tokens for an academy label.
   */
  function getAcademyIcon(academyIdOrName) {
    if (!academyIdOrName) return '🎓';
    const raw = String(academyIdOrName).trim().toLowerCase();
    
    // Check direct ID
    if (ACADEMY_REGISTRY[raw]) return ACADEMY_REGISTRY[raw].icon;
    
    // Check Name map
    if (ACADEMY_NAME_MAP[raw]) return ACADEMY_REGISTRY[ACADEMY_NAME_MAP[raw]].icon;
    
    // Check partial matches
    for (const [key, item] of Object.entries(ACADEMY_REGISTRY)) {
      if (raw.includes(key) || raw.includes(item.name.toLowerCase())) {
        return item.icon;
      }
    }
    return '🎓';
  }

  // 2. High-Quality Vector SVG Registry for Course Visuals
  // Designed with viewBox="0 0 24 24" and clean stroke/fill for crisp display
  const SAFE_ICON_SVGS = {
    // Robot / AI Assistant (for microsoft-copilot, fas fa-robot, ai)
    'robot': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="3"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8.01" y2="16" stroke-width="2.5"></line><line x1="16" y1="16" x2="16.01" y2="16" stroke-width="2.5"></line><path d="M9 19h6"></path><path d="M2 15h1"></path><path d="M21 15h1"></path></svg>`,
    'fas fa-robot': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="3"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8.01" y2="16" stroke-width="2.5"></line><line x1="16" y1="16" x2="16.01" y2="16" stroke-width="2.5"></line><path d="M9 19h6"></path><path d="M2 15h1"></path><path d="M21 15h1"></path></svg>`,
    'fa-solid fa-robot': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="3"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8.01" y2="16" stroke-width="2.5"></line><line x1="16" y1="16" x2="16.01" y2="16" stroke-width="2.5"></line><path d="M9 19h6"></path><path d="M2 15h1"></path><path d="M21 15h1"></path></svg>`,

    // Calculator / Accounting (for tally-gst, fas fa-calculator)
    'calculator': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path></svg>`,
    'fas fa-calculator': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path></svg>`,
    'fa-solid fa-calculator': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path></svg>`,

    // Cubes / Database / Notion (for notion-cert, fas fa-cubes)
    'cubes': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    'fas fa-cubes': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    'fa-solid fa-shapes': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    'fa-solid fa-cube': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,

    // Tasks / Checklist / Workflow (for clickup-cert, fas fa-tasks)
    'tasks': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path><line x1="7" y1="8" x2="11" y2="8"></line><line x1="7" y1="12" x2="9" y2="12"></line><line x1="7" y1="16" x2="15" y2="16"></line></svg>`,
    'fas fa-tasks': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path><line x1="7" y1="8" x2="11" y2="8"></line><line x1="7" y1="12" x2="9" y2="12"></line><line x1="7" y1="16" x2="15" y2="16"></line></svg>`,
    'fa-solid fa-tasks': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path><line x1="7" y1="8" x2="11" y2="8"></line><line x1="7" y1="12" x2="9" y2="12"></line><line x1="7" y1="16" x2="15" y2="16"></line></svg>`,

    // Cloud / Collaboration (for google-workspace, fas fa-cloud)
    'cloud': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>`,
    'fas fa-cloud': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>`,
    'fa-solid fa-cloud': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>`,

    // Briefcase / Freelancing
    'briefcase': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    'fa-solid fa-briefcase': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,

    // Sun / Lighting / V-Ray
    'sun': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    'fa-solid fa-sun': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,

    // Document / Resume
    'file-lines': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    'fa-solid fa-file-lines': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,

    // LinkedIn
    'linkedin': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="currentColor" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
    'fa-brands fa-linkedin': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="currentColor" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,

    // User Tie / Interview
    'user-tie': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><polyline points="12 11 11 15 13 18 12 21"></polyline></svg>`,
    'fa-solid fa-user-tie': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><polyline points="12 11 11 15 13 18 12 21"></polyline></svg>`,

    // Handshake
    'handshake': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-3-3a1 1 0 0 0-1.4 0l-1.3 1.3"></path><path d="m14 6 5.3 5.3a1 1 0 0 1 0 1.4l-1.3 1.3"></path><path d="m3 11 5.3-5.3a1 1 0 0 1 1.4 0l1.3 1.3"></path><path d="m6 14-3-3a1 1 0 0 1 0-1.4l4.3-4.3a1 1 0 0 1 1.4 0l2 2"></path></svg>`,
    'fa-solid fa-handshake': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-3-3a1 1 0 0 0-1.4 0l-1.3 1.3"></path><path d="m14 6 5.3 5.3a1 1 0 0 1 0 1.4l-1.3 1.3"></path><path d="m3 11 5.3-5.3a1 1 0 0 1 1.4 0l1.3 1.3"></path><path d="m6 14-3-3a1 1 0 0 1 0-1.4l4.3-4.3a1 1 0 0 1 1.4 0l2 2"></path></svg>`,

    // Proposal / File Signature
    'file-signature': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>`,
    'fa-solid fa-file-signature': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>`,

    // Store / Fiverr
    'store': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path></svg>`,
    'fa-solid fa-store': `<svg class="course-icon-svg" viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path></svg>`
  };

  // Safe fallback emoji mapping if SVG not desired
  const TOKEN_TO_EMOJI_FALLBACK = {
    'fas fa-robot': '🤖',
    'fa-solid fa-robot': '🤖',
    'robot': '🤖',
    'fas fa-calculator': '🧮',
    'fa-solid fa-calculator': '🧮',
    'calculator': '🧮',
    'fas fa-cubes': '🧊',
    'fa-solid fa-shapes': '🧊',
    'fa-solid fa-cube': '🧊',
    'cubes': '🧊',
    'fas fa-tasks': '☑️',
    'fa-solid fa-tasks': '☑️',
    'tasks': '☑️',
    'fas fa-cloud': '☁️',
    'fa-solid fa-cloud': '☁️',
    'cloud': '☁️',
    'fa-solid fa-briefcase': '💼',
    'briefcase': '💼',
    'fa-solid fa-sun': '☀️',
    'sun': '☀️',
    'fa-solid fa-file-lines': '📄',
    'file-lines': '📄',
    'fa-brands fa-linkedin': '💼',
    'linkedin': '💼',
    'fa-solid fa-user-tie': '👔',
    'user-tie': '👔',
    'fa-solid fa-handshake': '🤝',
    'handshake': '🤝',
    'fa-solid fa-file-signature': '✍️',
    'file-signature': '✍️',
    'fa-solid fa-store': '🏪',
    'store': '🏪'
  };

  /**
   * Safe Course Banner Visual Renderer.
   * NEVER outputs a raw class name as visible text.
   * If token is an SVG or maps to SVG, outputs SVG.
   * If token is an emoji, outputs styled emoji span.
   */
  function renderCourseIcon(tokenOrCourse, options = {}) {
    const rawToken = (typeof tokenOrCourse === 'object' && tokenOrCourse !== null)
      ? (tokenOrCourse.icon || '')
      : String(tokenOrCourse || '').trim();

    const fontSize = options.fontSize || '3.5rem';
    const filter = options.filter || 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))';

    // 1. Check if token maps to safe vector SVG
    const svgMatch = SAFE_ICON_SVGS[rawToken] || SAFE_ICON_SVGS[rawToken.toLowerCase()];
    if (svgMatch) {
      return `<span class="course-banner-icon-wrap" style="display:inline-flex; align-items:center; justify-content:center; filter:${filter};" aria-hidden="true">${svgMatch}</span>`;
    }

    // 2. Check if token is a Font Awesome class string (prevent text leakage at all costs!)
    if (/fa[sbrl]?\s+fa-[a-z0-9-]+|fa-[a-z0-9-]+/i.test(rawToken)) {
      const fallbackEmoji = TOKEN_TO_EMOJI_FALLBACK[rawToken.toLowerCase()] || '🎓';
      return `<span class="course-banner-emoji" style="font-size:${fontSize}; line-height:1; filter:${filter};" aria-hidden="true">${fallbackEmoji}</span>`;
    }

    // 3. If token is already an inline SVG string
    if (rawToken.startsWith('<svg') && rawToken.endsWith('</svg>')) {
      return `<span class="course-banner-icon-wrap" style="display:inline-flex; align-items:center; justify-content:center; filter:${filter};" aria-hidden="true">${rawToken}</span>`;
    }

    // 4. Standard verified emoji or symbol
    const finalIcon = rawToken || '🎓';
    return `<span class="course-banner-emoji" style="font-size:${fontSize}; line-height:1; filter:${filter};" aria-hidden="true">${finalIcon}</span>`;
  }

  /**
   * Safe Academy Label Tag Renderer.
   * Strictly separates course visuals from the academy description.
   * Outputs: [Official Academy Icon] [Academy Name]
   */
  function renderAcademyTagHtml(academyIdOrName) {
    const icon = getAcademyIcon(academyIdOrName);
    const resolvedName = (ACADEMY_REGISTRY[academyIdOrName] && ACADEMY_REGISTRY[academyIdOrName].name)
      || academyIdOrName
      || 'Academy';
    return `<span class="academy-tag-icon" aria-hidden="true">${icon}</span> ${resolvedName}`;
  }

  return {
    ACADEMY_REGISTRY,
    getAcademyIcon,
    renderCourseIcon,
    renderAcademyTagHtml,
    SAFE_ICON_SVGS,
    TOKEN_TO_EMOJI_FALLBACK
  };
}));
