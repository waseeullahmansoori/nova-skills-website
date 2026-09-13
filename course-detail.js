/* ============================================================
   NOVA SKILLS — Course Detail Page Dynamic Controller (Step 7 QA Hardened)
   Supports Templates A, B, C · Real-Time Modular Loading
   JSON-LD Schema.org (@graph) · Domain Mentors · Truthful Claims
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const course = getTargetCourse();
  if (course) {
    populateCourseDetail(course);
    renderRelatedCourses(course);
    loadDetailedCourseData(course);
  }
});

const COURSE_ALIASES = {
  'dm-master': 'dm-mastery',
  'full-stack': 'fullstack-foundation',
  'design-mastery': 'creative-design',
  'video-editing': 'video-pro',
  'digital-marketing': 'dm-mastery',
  'ai-master': 'ai-mastery',
  'python-dev': 'python-developer',
  'prompt-engineering': 'prompt-engineering-mastery',
  'freelance-agency-master': 'freelance-agency-mastery',
  'freelance-mastery': 'freelancing-mastery'
};

function getTargetCourse() {
  const params = new URLSearchParams(window.location.search);
  const rawId = (params.get('id') || params.get('course') || '').trim();
  const id = COURSE_ALIASES[rawId] || rawId || 'dm-mastery';

  const courses = (typeof NS_COURSES !== 'undefined' && Array.isArray(NS_COURSES))
    ? NS_COURSES
    : (typeof window !== 'undefined' && Array.isArray(window.NS_COURSES) ? window.NS_COURSES : []);

  return courses.find(c => c.id === id || c.slug === id) ||
         courses.find(c => c.id === rawId || c.slug === rawId) ||
         courses.find(c => c.id === 'dm-mastery') ||
         courses[0];
}

/* ============================================================
   1. SEO / GEO DYNAMIC METADATA ENGINE & IMMEDIATE RENDER
   ============================================================ */
function getCourseSeoTitle(course) {
  const type = (course.courseType || course.course_type || course.type || '').toUpperCase();
  const name = course.name || course.course_name;
  
  if (type === 'MASTER') {
    return `${name} — Flagship Career Program | Nova Skills`;
  } else if (type === 'PROFESSIONAL') {
    return `${name} — Professional Certification Course | Nova Skills`;
  } else if (type === 'SPECIALIZATION') {
    return `${name} Specialization Course | Hands-on Labs | Nova Skills`;
  } else if (type === 'MICRO') {
    return `${name} Practical Certification | Live Projects | Nova Skills`;
  } else if (type === 'MODULE') {
    return `${name} Practical Skill Module | Guided Labs | Nova Skills`;
  } else if (type === 'REPOSITION') {
    return `${name} Training — Industry Aligned Course | Nova Skills`;
  } else if (type === 'MERGE') {
    return `${name} Course | Practical Curriculum Module | Nova Skills`;
  } else if (type === 'RETIRE') {
    return `${name} Training | Modernized Curriculum Advisory | Nova Skills`;
  }
  return `${name} — Professional Certification Course | Nova Skills`;
}

function getCourseMetaDescription(course, detailData = null) {
  let tools = '';
  if (detailData && detailData.hands_on_tech && Array.isArray(detailData.hands_on_tech.core_tools)) {
    tools = detailData.hands_on_tech.core_tools.map(t => (t.tool || t.name || t)).slice(0, 3).join(', ');
  } else if (course.tools && Array.isArray(course.tools)) {
    tools = course.tools.slice(0, 3).join(', ');
  }
  const toolClause = tools ? ` using ${tools}` : '';
  const duration = course.duration || 'flexible duration';
  const hours = (detailData && detailData.learning_hours) || course.learningHours;
  const hoursClause = hours ? ` (${hours} hrs)` : '';
  const rawAudience = (detailData && detailData.target_audience && detailData.target_audience.best_for && detailData.target_audience.best_for[0]) || 'aspiring professionals';
  const role = rawAudience.replace(/\.$/, '').split(' seeking ')[0].split(' wanting ')[0].split(' aiming ')[0].trim();
  const name = course.name || course.course_name;

  let desc = `Learn ${name} at Nova Skills${toolClause}. ${duration}${hoursClause} practical training for ${role} with live projects and certification.`;
  if (desc.length > 160) {
    desc = `Master ${name} at Nova Skills${toolClause}. ${duration} training for ${role} with live portfolio projects.`;
  }
  if (desc.length > 160) {
    desc = `Learn ${name} at Nova Skills. ${duration}${hoursClause} practical training for ${role} with live projects and certification.`;
  }
  if (desc.length > 160) {
    desc = desc.substring(0, 157) + '...';
  }
  return desc;
}

function populateCourseDetail(course) {
  const pageTitleText = getCourseSeoTitle(course);
  document.title = pageTitleText;
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = pageTitleText;

  const canonicalUrl = `https://novaskills.in/course-detail.html?id=${encodeURIComponent(course.id)}`;
  const canonicalEl = document.getElementById('page-canonical') || document.querySelector('link[rel="canonical"]');
  if (canonicalEl) canonicalEl.setAttribute('href', canonicalUrl);

  const robotsMeta = document.getElementById('page-robots') || document.querySelector('meta[name="robots"]');
  if (robotsMeta) robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  const metaDescText = getCourseMetaDescription(course);
  const metaDesc = document.getElementById('page-meta-desc') || document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', metaDescText);

  const courseImg = 'https://novaskills.in/public/images/seo/og-banner.png?v=2026';

  // Open Graph Updates
  const ogUrl = document.getElementById('og-url') || document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  const ogTitle = document.getElementById('og-title') || document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', pageTitleText);
  const ogDesc = document.getElementById('og-desc') || document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', metaDescText);
  const ogImg = document.getElementById('og-image') || document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', courseImg);

  // Twitter (X) Card Updates
  const twTitle = document.getElementById('tw-title') || document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', pageTitleText);
  const twDesc = document.getElementById('tw-desc') || document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', metaDescText);
  const twImg = document.getElementById('tw-image') || document.querySelector('meta[name="twitter:image"]');
  if (twImg) twImg.setAttribute('content', courseImg);

  // Breadcrumb & Hero Silo Linking
  const bcAcademy = document.getElementById('breadcrumb-academy-link') || document.querySelector('.course-detail-breadcrumb a:nth-of-type(2)');
  if (bcAcademy) {
    bcAcademy.textContent = course.academy || 'Courses';
    bcAcademy.setAttribute('href', `/courses.html?academy=${encodeURIComponent(course.academyId || '')}`);
  }

  const bc = document.getElementById('breadcrumb-course-name');
  if (bc) bc.textContent = course.name;

  const tag = document.getElementById('detail-academy-tag');
  if (tag) {
    tag.innerHTML = `<a href="/courses.html?academy=${encodeURIComponent(course.academyId || '')}" style="color:inherit; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">${course.icon || '🎓'} ${course.academy || 'Academy'}</a>`;
  }

  const title = document.getElementById('detail-title');
  if (title) title.textContent = course.name;

  const desc = document.getElementById('detail-desc');
  if (desc) desc.textContent = course.positioning || course.shortDesc || course.fullDesc;

  // Meta Badges
  const meta = document.getElementById('detail-meta');
  if (meta) {
    const hours = course.learningHours ? `${course.learningHours} Hours` : (course.duration || 'Flexible');
    const projectLabel = course.courseType === 'MASTER' ? '3 Major Portfolio Projects' : '2 Production Projects';
    meta.innerHTML = `
      <div class="course-meta-item"><span class="meta-icon">⏱️</span> Duration: ${course.duration || 'Flexible'} (${hours})</div>
      <div class="course-meta-item"><span class="meta-icon">📶</span> Level: ${course.level || 'All Levels'}</div>
      <div class="course-meta-item"><span class="meta-icon">💻</span> Mode: ${course.mode || 'Hybrid'}</div>
      <div class="course-meta-item"><span class="meta-icon">🚀</span> ${projectLabel}</div>
      ${course.placementSupport ? '<div class="course-meta-item" style="color:var(--green-light); font-weight:700;"><span class="meta-icon">🎯</span> Placement Support Included</div>' : ''}
    `;
  }

  // Rating Row
  const ratingRow = document.getElementById('detail-rating-row');
  if (ratingRow) {
    ratingRow.innerHTML = `
      <span class="rating-stars">★★★★★</span>
      <span class="rating-num">${course.rating || 4.8}</span>
      <span class="rating-count">(${course.reviews || 120} student reviews)</span>
      <span class="student-count">• ${(course.students || 500).toLocaleString('en-IN')}+ learners enrolled</span>
    `;
  }

  // Enroll Card
  const thumb = document.getElementById('detail-card-thumb');
  if (thumb) {
    thumb.style.background = course.color || 'var(--grad-hero)';
    thumb.innerHTML = `<span style="font-size:4rem; filter:drop-shadow(0 10px 20px rgba(0,0,0,0.3));">${course.icon || '🎓'}</span>`;
  }

  const price = document.getElementById('detail-price');
  if (price) price.textContent = `₹${(course.price || 0).toLocaleString('en-IN')}`;

  const origPrice = document.getElementById('detail-original-price');
  if (origPrice) origPrice.textContent = `₹${(course.originalPrice || course.price * 2 || 0).toLocaleString('en-IN')}`;

  const discount = document.getElementById('detail-discount');
  if (discount && course.originalPrice && course.originalPrice > course.price) {
    const pct = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
    discount.textContent = `${pct}% OFF`;
  }

  // Dynamic EMI with 18% GST
  const durationMonths = (typeof course.durationMonths === 'number' && course.durationMonths > 0)
    ? course.durationMonths
    : (parseInt(course.duration, 10) || 1);
  const gstAmount = (course.price || 0) * 0.18;
  const totalWithGST = (course.price || 0) + gstAmount;
  const monthlyInstallment = Math.round(totalWithGST / durationMonths);

  const emiEl = document.getElementById('detail-emi');
  if (emiEl) {
    emiEl.innerHTML = `💳 Easy No-Cost EMI starting at <strong>₹${monthlyInstallment.toLocaleString('en-IN')}/month</strong> · 18% GST included`;
  }

  // Mobile sticky price
  const mobPrice = document.getElementById('mobile-price');
  if (mobPrice) mobPrice.textContent = `₹${(course.price || 0).toLocaleString('en-IN')}`;
  const mobOrig = document.getElementById('mobile-orig-price');
  if (mobOrig) mobOrig.textContent = `₹${(course.originalPrice || 0).toLocaleString('en-IN')}`;

  // Cert Course Display Name
  const certDisplay = document.getElementById('cert-course-display');
  if (certDisplay) certDisplay.textContent = course.name;

  // Dynamically populate Enroll Card "This Course Includes" Checklist based on course type & placementSupport
  populateEnrollIncludes(course);

  // Bind High-Conversion CTAs to pre-fill enrollment modal with course & academy
  const enrollBtn = document.querySelector('.btn-enroll-full');
  if (enrollBtn) {
    enrollBtn.onclick = () => {
      if (typeof openEnrollmentModal === 'function') {
        openEnrollmentModal(course.name, course.academy);
      } else if (typeof openConsultationPopup === 'function') {
        openConsultationPopup();
      }
    };
  }

  const consultBtn = document.querySelector('.btn-consult-full');
  if (consultBtn) {
    consultBtn.onclick = () => {
      if (typeof openConsultationPopup === 'function') {
        openConsultationPopup();
      }
    };
  }

  const mobileEnrollBtn = document.querySelector('#sticky-mobile-bar .btn-primary');
  if (mobileEnrollBtn) {
    mobileEnrollBtn.onclick = () => {
      if (typeof openEnrollmentModal === 'function') {
        openEnrollmentModal(course.name, course.academy);
      } else if (typeof openConsultationPopup === 'function') {
        openConsultationPopup();
      }
    };
  }

  // Initial Curriculum rendering while fetch loads
  const curr = document.getElementById('curriculum-container');
  if (curr && course.curriculum && Array.isArray(course.curriculum)) {
    curr.innerHTML = course.curriculum.map((mod, idx) => `
      <div class="curriculum-module ${idx === 0 ? 'open' : ''}">
        <div class="curriculum-module-header" role="button" tabindex="0">
          <span class="module-label">${mod.module || `Phase ${idx+1}`}</span>
          <span class="module-title">${mod.title}</span>
          <span class="module-lessons-count">${mod.lessons || 4} Lessons</span>
          <span class="module-chevron">⌄</span>
        </div>
        <div class="curriculum-module-body">
          <div class="module-purpose-box">Comprehensive practical training session and hands-on lab.</div>
          <div class="lessons-timeline">
            <div class="lesson-card">
              <div class="lesson-card-header">
                <span class="lesson-num-badge">Lesson 1</span>
                <span class="lesson-title-text">${mod.title} Core Fundamentals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    bindAccordionEvents();
  }

  // Initial Tools rendering
  const tools = document.getElementById('tools-container');
  if (tools && course.tools && Array.isArray(course.tools)) {
    tools.innerHTML = `
      <div class="tool-pills-row">
        ${course.tools.map(t => `<span class="tool-pill-badge">🛠️ ${escapeHTML(t)}</span>`).join('')}
      </div>
    `;
  }

  // Tailor Mentors and Testimonials based on Academy
  populateDomainMentors(course);

  // Inject Base Schema.org
  injectCourseSchema(course, courseImg, canonicalUrl);
}

/* Dynamically tailor the "This Course Includes" checklist without unsupported placement promises */
function populateEnrollIncludes(course) {
  const includesList = document.getElementById('detail-includes-list');
  if (!includesList) return;

  if (course.academyId === 'kids-tech') {
    includesList.innerHTML = `
      <li><span class="include-icon">🎥</span> Interactive Live Mentorship</li>
      <li><span class="include-icon">💻</span> Fun Creative Hands-on Projects</li>
      <li><span class="include-icon">👤</span> 1-on-1 Dedicated Support</li>
      <li><span class="include-icon">📜</span> Young Creator Certificate</li>
      <li><span class="include-icon">🛡️</span> Safe, Supervised Learning Environment</li>
      <li><span class="include-icon">♾️</span> Access to Playground Projects</li>
    `;
  } else if (course.placementSupport) {
    includesList.innerHTML = `
      <li><span class="include-icon">🎥</span> Live Interactive Classes & Labs</li>
      <li><span class="include-icon">💻</span> Real Commercial Client Projects</li>
      <li><span class="include-icon">👤</span> 1-on-1 Senior Mentor Reviews</li>
      <li><span class="include-icon">📜</span> ISO 9001:2015 Verified Certificate</li>
      <li><span class="include-icon">🎯</span> Placement Support & Interviews</li>
      <li><span class="include-icon">♾️</span> Lifetime Practitioner Community Access</li>
    `;
  } else {
    includesList.innerHTML = `
      <li><span class="include-icon">🎥</span> Practical Interactive Labs</li>
      <li><span class="include-icon">💻</span> Production Asset Deliverables</li>
      <li><span class="include-icon">👤</span> Mentor Code & Strategy Critiques</li>
      <li><span class="include-icon">📜</span> Verifiable Professional Credential</li>
      <li><span class="include-icon">🛠️</span> Modern Toolchain Prompts & Templates</li>
      <li><span class="include-icon">♾️</span> Lifetime Community Access</li>
    `;
  }
}

/* Dynamically tailor Domain Mentors based on Academy */
function populateDomainMentors(course) {
  const mentorsContainer = document.getElementById('mentors-container');
  if (!mentorsContainer) return;

  const academyMentors = {
    'digital-marketing': { lead: 'Growth & Ads Lead Mentor', role: 'Head of Performance & GEO Strategy', bio: 'Specialist in omnichannel growth funnels, AI search optimization (GEO), and programmatic ad architecture.' },
    'ai-academy': { lead: 'Principal AI Architect', role: 'Applied Generative AI & Agents Lead', bio: 'Specialist in multi-agent orchestration, LLM application pipelines, workflow automation, and enterprise deployment.' },
    'design-academy': { lead: 'Design Director & UI Lead', role: 'Product Design & Brand Architect', bio: 'Specialist in design systems, micro-interactions, commercial packaging, and user experience psychology.' },
    'programming-academy': { lead: 'Senior Full Stack Lead', role: 'Systems Architecture & Backend Mentor', bio: 'Specialist in cloud architectures, modern React/Node toolchains, database scaling, and production code reviews.' },
    'nocode-academy': { lead: 'Lead No-Code Architect', role: 'Enterprise Webflow & Shopify Lead', bio: 'Specialist in scalable headless web systems, e-commerce conversion pipelines, and workflow automation.' },
    'video-academy': { lead: 'Post-Production Director', role: 'Senior Video Editor & Motion Lead', bio: 'Specialist in high-retention commercial storytelling, color grading, dynamic motion graphics, and audio mastering.' },
    '3d-academy': { lead: 'Senior 3D & Technical Artist', role: 'Real-Time Pipeline & ArchViz Lead', bio: 'Specialist in Blender, Unreal Engine 5 Lumen/Nanite workflows, architectural visualization, and photorealistic asset creation.' },
    'career-academy': { lead: 'Agency Strategist & Founder', role: 'Freelance & Retainer Monetization Mentor', bio: 'Specialist in international client acquisition, proposal engineering, high-ticket packaging, and business operations.' },
    'comm-academy': { lead: 'Executive Voice Coach', role: 'Leadership Communication & Pitch Specialist', bio: 'Specialist in executive presence, persuasive presentations, high-stakes stakeholder meetings, and corporate dialogue.' },
    'kids-tech': { lead: 'Certified STEM Educator', role: 'Creative Computing & Logic Mentor', bio: 'Dedicated educator specializing in gamified algorithmic thinking, beginner Python, and interactive digital creation.' },
    'creator-academy': { lead: 'Creator Economy Strategist', role: 'YouTube Production & Distribution Lead', bio: 'Specialist in audience analytics, algorithmic retention optimization, content monetization, and personal branding.' },
    'office-academy': { lead: 'Business Intelligence Lead', role: 'Data Analytics & Copilot Specialist', bio: 'Specialist in automated spreadsheet models, executive dashboards, power automation, and enterprise Copilot integration.' }
  };

  const domain = academyMentors[course.academyId] || academyMentors['digital-marketing'];

  mentorsContainer.innerHTML = `
    <div class="mentor-card">
      <div class="mentor-avatar" style="background:var(--grad-hero);"><span class="mentor-initials">${domain.lead.slice(0, 2).toUpperCase()}</span></div>
      <h3 class="mentor-name">${escapeHTML(domain.lead)}</h3>
      <div class="mentor-role">${escapeHTML(domain.role)}</div>
      <span class="mentor-exp">Industry Practitioner Mentorship</span>
      <p class="mentor-bio">${escapeHTML(domain.bio)}</p>
    </div>

    <div class="mentor-card">
      <div class="mentor-avatar" style="background:var(--grad-teal-green);"><span class="mentor-initials">PT</span></div>
      <h3 class="mentor-name">Senior Project Trainer</h3>
      <div class="mentor-role">Hands-On Lab & Critique Mentor</div>
      <span class="mentor-exp">Live Project Mentorship</span>
      <p class="mentor-bio">Dedicated to portfolio asset building, iterative project critiques, industry toolchains, and commercial quality assurance.</p>
    </div>
  `;
}

/* ============================================================
   2. ASYNCHRONOUS DEEP DATA LOADER
   ============================================================ */
async function loadDetailedCourseData(baseCourse) {
  let detailData = null;

  try {
    const res = await fetch(`/data/courses/${encodeURIComponent(baseCourse.id)}.json`);
    if (res.ok) {
      detailData = await res.json();
    }
  } catch (e) {
    console.warn('Individual course file fetch failed, falling back to master content', e);
  }

  if (!detailData) {
    try {
      const res = await fetch('/nova-skills-109-course-content.json');
      if (res.ok) {
        const all = await res.json();
        detailData = all.find(c => c.course_id === baseCourse.id);
      }
    } catch (e) {
      console.warn('Master content fetch failed, using base data', e);
    }
  }

  if (detailData) {
    renderEnrichedCourseDetail(baseCourse, detailData);
  }
}

/* ============================================================
   3. RENDER ENRICHED COURSE DETAIL (TEMPLATES A, B, C)
   ============================================================ */
function renderEnrichedCourseDetail(baseCourse, data) {
  const courseType = (data.course_type || baseCourse.courseType || '').toUpperCase();
  const isMaster = courseType === 'MASTER';
  const isProOrSpec = courseType === 'PROFESSIONAL' || courseType === 'SPECIALIZATION' || courseType === 'REPOSITION' || courseType === 'MERGE';
  const isTemplateA = courseType === 'MICRO' || courseType === 'MODULE';

  // --- Advisory Banner (Merge / Retire) ---
  const advisoryContainer = document.getElementById('course-advisory-container');
  if (advisoryContainer) {
    if (courseType === 'MERGE') {
      const parentId = data.next_learning_path?.recommended_next?.match(/id=([a-z0-9-]+)/)?.[1] || 'dm-mastery';
      advisoryContainer.innerHTML = `
        <div class="course-advisory-banner">
          <span class="advisory-icon">🔄</span>
          <div class="advisory-content">
            <h4>Curriculum Integration Pathway Notice</h4>
            <p>
              This program is an integrated specialization module. If you are seeking complete career mastery, 
              this entire curriculum is also included in our flagship career track:
              <a href="/course-detail.html?id=${parentId}" class="advisory-link">Explore Parent Career Program →</a>
            </p>
          </div>
        </div>
      `;
    } else if (courseType === 'RETIRE') {
      advisoryContainer.innerHTML = `
        <div class="course-advisory-banner retire">
          <span class="advisory-icon">⚠️</span>
          <div class="advisory-content">
            <h4>Modernization & Successor Notice</h4>
            <p>
              This curriculum is scheduled for modernization to reflect 2026/27 workplace standards. 
              We recommend reviewing our modernized flagship alternatives for maximum job market impact.
            </p>
          </div>
        </div>
      `;
    } else {
      advisoryContainer.innerHTML = '';
    }
  }

  // --- Overview & Positioning ---
  const overviewEl = document.getElementById('overview-content');
  if (overviewEl && data.overview) {
    const projectCount = data.what_you_will_build ? data.what_you_will_build.length : (baseCourse.liveProjects || 2);
    overviewEl.innerHTML = `
      <p style="font-size:1.15rem; font-weight:700; color:var(--navy); margin-bottom:14px; line-height:1.5;">
        ${escapeHTML(data.overview.positioning || '')}
      </p>
      <p style="margin-bottom:16px;">${escapeHTML(data.overview.short_description || '')}</p>
      <p style="margin-bottom:0;">
        Designed and delivered by senior practitioners, this curriculum delivers deep practical execution through 
        <strong>${projectCount} major production portfolio projects</strong>, live interactive labs, 
        code/design critiques, and commercial delivery standards.
      </p>
    `;
  }

  // --- Why Learn This Now (Templates B & C) ---
  const whyNowContainer = document.getElementById('why-now-container');
  if (whyNowContainer) {
    if ((isMaster || isProOrSpec) && data.why_now) {
      whyNowContainer.style.display = 'block';
      whyNowContainer.innerHTML = `
        <div class="why-now-card">
          <div class="why-now-header">
            <span>⚡</span>
            <span>Why Learn This Now?</span>
            <span class="why-now-badge">2026/27 Industry Shift</span>
          </div>
          <p class="why-now-text">${escapeHTML(data.why_now.industry_shift || '')}</p>
          <div style="font-size:0.9rem; color:var(--teal); font-weight:600; margin-top:4px;">
            ${escapeHTML(data.why_now.ai_impact || data.why_now.business_demand || 'Industry toolchains and modern workflows drive high career demand.')}
          </div>
        </div>
      `;
    } else {
      whyNowContainer.style.display = 'none';
    }
  }

  // --- Target Audience & Prerequisites ---
  const audienceContainer = document.getElementById('audience-container');
  if (audienceContainer && data.target_audience) {
    const bestFor = data.target_audience.best_for || [];
    const notFor = data.target_audience.not_for || data.target_audience.who_is_this_not_for || [];
    audienceContainer.innerHTML = `
      <div class="audience-grid">
        <div class="audience-card best-for">
          <h3><span style="color:var(--green)">✓</span> Ideal For (Best For)</h3>
          <ul class="audience-list">
            ${bestFor.map(item => `<li><span class="bullet-icon">✓</span><span>${escapeHTML(item)}</span></li>`).join('')}
          </ul>
        </div>
        ${(isMaster || isProOrSpec) && notFor.length > 0 ? `
          <div class="audience-card not-for">
            <h3><span style="color:var(--orange)">✕</span> Who Is This NOT For</h3>
            <ul class="audience-list">
              ${notFor.map(item => `<li><span class="bullet-icon">✕</span><span>${escapeHTML(item)}</span></li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  // --- Prerequisites ---
  const prereqContainer = document.getElementById('prerequisites-container');
  if (prereqContainer && data.prerequisites) {
    prereqContainer.innerHTML = `
      <div class="prerequisites-box">
        <div class="prereq-item">
          <h4>Required Prerequisites</h4>
          <p>${escapeHTML(data.prerequisites.required || 'Basic computer literacy and internet access.')}</p>
        </div>
        <div class="prereq-item">
          <h4>Recommended Background</h4>
          <p>${escapeHTML(data.prerequisites.recommended || 'Curiosity and enthusiasm for hands-on project creation.')}</p>
        </div>
      </div>
    `;
  }

  // --- Learning Outcomes ---
  const outcomesContainer = document.getElementById('outcomes-container');
  if (outcomesContainer && data.learning_outcomes) {
    outcomesContainer.innerHTML = `
      <div class="outcomes-grid">
        ${data.learning_outcomes.map(outcome => {
          const colonIdx = outcome.indexOf(':');
          let verb = 'ACHIEVE';
          let rest = outcome;
          if (colonIdx > 0 && colonIdx < 15) {
            verb = outcome.substring(0, colonIdx).trim();
            rest = outcome.substring(colonIdx + 1).trim();
          }
          return `
            <div class="outcome-item">
              <span class="outcome-verb-badge">${escapeHTML(verb)}</span>
              <p class="outcome-text">${escapeHTML(rest)}</p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // --- Learning Journey (Template C: Master Programs) ---
  const journeySection = document.getElementById('journey-section');
  const journeyContainer = document.getElementById('journey-container');
  if (journeySection && journeyContainer) {
    if (isMaster && data.learning_journey && data.learning_journey.stages) {
      journeySection.style.display = 'block';
      journeyContainer.innerHTML = `
        <div class="workflow-stages-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
          ${data.learning_journey.stages.map((stage, sIdx) => `
            <div class="workflow-step-card" style="border-top: 3px solid var(--teal);">
              <div class="workflow-step-badge">${sIdx + 1}</div>
              <div class="workflow-step-name">${escapeHTML(stage.stage || `Stage ${sIdx+1}`)}</div>
              <p class="workflow-step-desc">${escapeHTML(stage.focus || stage.description || '')}</p>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      journeySection.style.display = 'none';
    }
  }

  // --- Step-by-Step Modules & Lessons Accordion ---
  const currContainer = document.getElementById('curriculum-container');
  if (currContainer && data.modules && Array.isArray(data.modules)) {
    currContainer.innerHTML = data.modules.map((mod, idx) => `
      <div class="curriculum-module ${idx === 0 ? 'open' : ''}">
        <div class="curriculum-module-header" role="button" tabindex="0" aria-expanded="${idx === 0}">
          <span class="module-label">${String(mod.module_number || 'Module ' + (idx + 1)).replace(/^Module\s*/i, 'Module ')}</span>
          <span class="module-title">${escapeHTML(mod.module_title || 'Module Overview')}</span>
          <span class="module-lessons-count">${mod.lessons ? mod.lessons.length : 4} Lessons</span>
          <span class="module-chevron">⌄</span>
        </div>
        <div class="curriculum-module-body">
          <div class="module-purpose-box">
            <strong>Module Focus:</strong> ${escapeHTML(mod.module_purpose || mod.what_you_will_learn || 'Practical implementation and commercial standards.')}
          </div>

          <div class="lessons-timeline">
            ${(mod.lessons || []).map(lesson => `
              <div class="lesson-card">
                <div class="lesson-card-header">
                  <span class="lesson-num-badge">${escapeHTML(lesson.lesson_number || 'Lab')}</span>
                  <span class="lesson-title-text">${escapeHTML(lesson.lesson_title || '')}</span>
                </div>
                <div class="lesson-meta-grid">
                  <div class="lesson-meta-item"><strong>Taught:</strong> ${escapeHTML(lesson.what_is_taught || '')}</div>
                  <div class="lesson-meta-item"><strong>Learner Lab:</strong> ${escapeHTML(lesson.what_learner_does || '')}</div>
                  <div class="lesson-meta-item"><strong>Why It Matters:</strong> ${escapeHTML(lesson.why_it_matters || '')}</div>
                  <div class="lesson-meta-item"><strong>Expected Deliverable:</strong> ${escapeHTML(lesson.expected_outcome || '')}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="module-footer-meta">
            ${mod.hands_on_practice ? `<div><strong>🛠️ Hands-on Lab:</strong> ${escapeHTML(mod.hands_on_practice)}</div>` : ''}
            ${mod.assignment ? `<div><strong>📝 Practical Assignment:</strong> ${escapeHTML(mod.assignment)}</div>` : ''}
            ${mod.expected_outcome ? `<div><strong>🎯 Expected Outcome:</strong> ${escapeHTML(mod.expected_outcome)}</div>` : ''}
          </div>
        </div>
      </div>
    `).join('');
    bindAccordionEvents();
  }

  // --- Hands-on Tech Categorized ---
  const toolsContainer = document.getElementById('tools-container');
  if (toolsContainer && data.hands_on_tech) {
    const core = data.hands_on_tech.core_tools || [];
    const supp = data.hands_on_tech.supporting_tools || [];
    const emerging = data.hands_on_tech.emerging_tools || [];

    toolsContainer.innerHTML = `
      <div class="tools-ecosystem-wrapper">
        ${core.length > 0 ? `
          <div class="tool-category-block">
            <div class="tool-category-title">
              <span class="tool-tier-badge tier-core">Core Software</span>
              <span>Industry-Standard Production Toolchain</span>
            </div>
            <div class="tools-cards-grid">
              ${core.map(t => `
                <div class="tool-item-card">
                  <div class="tool-item-name">🛠️ ${escapeHTML(t.tool || t)}</div>
                  <p class="tool-item-desc">${escapeHTML(t.purpose || 'Primary software used for core project deliverables.')}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${supp.length > 0 ? `
          <div class="tool-category-block">
            <div class="tool-category-title">
              <span class="tool-tier-badge tier-supporting">Supporting Stack</span>
              <span>Workflow Accelerators & Libraries</span>
            </div>
            <div class="tool-pills-row">
              ${supp.map(t => `<span class="tool-pill-badge">⚡ ${escapeHTML(t.tool || t)}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${emerging.length > 0 ? `
          <div class="tool-category-block">
            <div class="tool-category-title">
              <span class="tool-tier-badge tier-emerging">2026/27 Emerging Tech</span>
              <span>Next-Gen AI & Automation Tools</span>
            </div>
            <div class="tool-pills-row">
              ${emerging.map(t => `<span class="tool-pill-badge">🚀 ${escapeHTML(t.tool || t)}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // --- 10-Step Industry Workflow Pipeline (Templates B & C) ---
  const workflowSection = document.getElementById('workflow-section');
  const workflowContainer = document.getElementById('workflow-container');
  if (workflowSection && workflowContainer) {
    if ((isMaster || isProOrSpec) && data.industry_workflow && data.industry_workflow.stages) {
      workflowSection.style.display = 'block';
      workflowContainer.innerHTML = `
        <div class="workflow-pipeline-container">
          <p class="course-section-intro">${escapeHTML(data.industry_workflow.overview || 'How senior practitioners execute client deliverables in 2026/27:')}</p>
          <div class="workflow-stages-grid">
            ${data.industry_workflow.stages.map(step => `
              <div class="workflow-step-card">
                <div class="workflow-step-badge">${step.step || '•'}</div>
                <div class="workflow-step-name">${escapeHTML(step.name || '')}</div>
                <p class="workflow-step-desc">${escapeHTML(step.desc || '')}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      workflowSection.style.display = 'none';
    }
  }

  // --- Business Use Cases (Templates B & C) ---
  const usecasesSection = document.getElementById('usecases-section');
  const usecasesContainer = document.getElementById('usecases-container');
  if (usecasesSection && usecasesContainer) {
    if ((isMaster || isProOrSpec) && data.business_use_cases && data.business_use_cases.length > 0) {
      usecasesSection.style.display = 'block';
      usecasesContainer.innerHTML = `
        <div class="usecases-grid">
          ${data.business_use_cases.map(uc => `
            <div class="usecase-card">
              <span class="usecase-sector-badge">${escapeHTML(uc.sector || 'Commercial Sector')}</span>
              <div class="usecase-problem">Problem: ${escapeHTML(uc.business_problem || '')}</div>
              <div class="usecase-detail-row"><strong>Approach:</strong> ${escapeHTML(uc.approach || '')}</div>
              <div class="usecase-detail-row"><strong>Toolset:</strong> ${escapeHTML(uc.toolset || '')}</div>
              <div class="usecase-detail-row"><strong>Output:</strong> ${escapeHTML(uc.output || '')}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      usecasesSection.style.display = 'none';
    }
  }

  // --- Practical Assignments, Projects & Capstone ---
  const projectsContainer = document.getElementById('projects-container');
  if (projectsContainer) {
    const builds = data.what_you_will_build || [];
    const deliverables = data.final_deliverables || [];

    projectsContainer.innerHTML = `
      <div class="projects-suite-grid">
        ${builds.map((b, bIdx) => {
          const isCapstone = b.toLowerCase().includes('capstone');
          return `
            <div class="portfolio-project-card ${isCapstone ? 'capstone' : ''}">
              <span class="project-tag-badge">${isCapstone ? 'Enterprise Capstone Project' : `Production Project ${bIdx + 1}`}</span>
              <div class="project-card-title">${escapeHTML(b)}</div>
              <p class="project-card-desc">
                ${escapeHTML(data.modules?.[bIdx]?.assignment || data.modules?.[bIdx]?.hands_on_practice || 'Built to professional standards, verified through peer critique and mentor review.')}
              </p>
              <div class="project-deliverable-badge">
                <span>📁</span> Deliverable: ${escapeHTML(deliverables[bIdx] || 'Production ready asset in student portfolio')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // --- AI Integration Matrix (Templates B & C) ---
  const aiSection = document.getElementById('ai-integration-section');
  const aiContainer = document.getElementById('ai-integration-container');
  if (aiSection && aiContainer) {
    if ((isMaster || isProOrSpec) && data.ai_integration) {
      aiSection.style.display = 'block';
      const ai = data.ai_integration;
      aiContainer.innerHTML = `
        <div class="ai-integration-card">
          <div class="ai-role-badge-row">
            <span class="ai-role-badge">${escapeHTML(ai.role_classification || 'AI-AUGMENTED')}</span>
            <span style="font-size:0.92rem; color:var(--text-secondary); font-weight:600;">Rigorous integration guidelines balancing automation speed with human domain judgment.</span>
          </div>
          <div class="ai-matrix-grid">
            <div class="ai-matrix-item">
              <h4>⚡ What AI Can Assist With</h4>
              <p>${escapeHTML(ai.ai_can_assist_with || 'Drafting variations, error diagnostics, and preliminary formatting.')}</p>
            </div>
            <div class="ai-matrix-item">
              <h4>🤖 What AI Can Automate</h4>
              <p>${escapeHTML(ai.ai_can_automate || 'Repetitive boilerplate generation, syntax linting, and initial scaffolding.')}</p>
            </div>
            <div class="ai-matrix-item">
              <h4>🧠 Human Expertise Required</h4>
              <p>${escapeHTML(ai.human_expertise_required || 'Architectural judgment, brand taste, commercial empathy, and final QA.')}</p>
            </div>
            <div class="ai-matrix-item">
              <h4>🛡️ Validation & QA Protocol</h4>
              <p>${escapeHTML(ai.validation_protocol || 'All AI outputs must be verified against security, performance, and brand guidelines.')}</p>
            </div>
          </div>
        </div>
      `;
    } else {
      aiSection.style.display = 'none';
    }
  }

  // --- Career Paths & Freelance Applications (Templates B & C) ---
  const careerSection = document.getElementById('career-section');
  const careerContainer = document.getElementById('career-container');
  if (careerSection && careerContainer) {
    if ((isMaster || isProOrSpec) && (data.career_paths || data.freelance_applications)) {
      careerSection.style.display = 'block';
      const cp = data.career_paths || {};
      const fa = data.freelance_applications || {};
      careerContainer.innerHTML = `
        <div class="career-freelance-grid">
          <div class="career-card">
            <h3><span>💼</span> Target Employment Roles</h3>
            <div class="roles-stack">
              ${cp.entry_roles ? `<div class="role-tier"><strong>Entry-Level:</strong> ${escapeHTML(cp.entry_roles)}</div>` : ''}
              ${cp.mid_roles ? `<div class="role-tier"><strong>Mid-Level:</strong> ${escapeHTML(cp.mid_roles)}</div>` : ''}
              ${cp.specialist_roles ? `<div class="role-tier"><strong>Specialist Roles:</strong> ${escapeHTML(cp.specialist_roles)}</div>` : ''}
            </div>
          </div>
          <div class="career-card">
            <h3><span>🌐</span> Freelance & Client Monetization</h3>
            <div class="roles-stack">
              ${fa.services_offered && Array.isArray(fa.services_offered) ? `
                <div class="role-tier">
                  <strong>Services You Can Offer:</strong>
                  <ul style="list-style:disc; margin-left:20px; margin-top:6px;">
                    ${fa.services_offered.map(s => `<li>${escapeHTML(s)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    } else {
      careerSection.style.display = 'none';
    }
  }

  // --- Certification ---
  const certDesc = document.getElementById('cert-desc');
  if (certDesc && data.certification) {
    certDesc.innerHTML = `
      Upon completing this program and defending your portfolio projects, you earn the 
      <strong>${escapeHTML(data.certification.title || baseCourse.name)}</strong> credential from Nova Skills — 
      ISO 9001:2015 verified with permanent online QR-code validation.
    `;
  }

  // --- Course Boundaries ---
  const boundariesContainer = document.getElementById('boundaries-container');
  if (boundariesContainer && data.not_covered) {
    boundariesContainer.innerHTML = `
      <div class="course-boundaries-card">
        <div class="boundaries-header">
          <span>🎯</span>
          <span>Clear Boundaries: What This Course Focuses On & What Is NOT Covered</span>
        </div>
        <p class="boundaries-text">${escapeHTML(data.not_covered)}</p>
      </div>
    `;
  }

  // --- Course-Specific FAQs (Enriched with project names) ---
  const faqGrid = document.getElementById('course-faq-grid');
  if (faqGrid && data.faq && Array.isArray(data.faq) && data.faq.length > 0) {
    const builds = data.what_you_will_build || [];
    faqGrid.innerHTML = data.faq.map((item, fIdx) => {
      let answer = item.answer || (builds.length > 0 ? `You will build production-grade projects: ${builds.slice(0, 2).join(' and ')}, resulting in portfolio-ready case studies.` : '');
      return `
        <div class="faq-item">
          <button class="faq-question" aria-expanded="${fIdx === 0 ? 'true' : 'false'}">
            <span>${escapeHTML(item.question)}</span>
            <span class="faq-icon">${fIdx === 0 ? '−' : '+'}</span>
          </button>
          <div class="faq-answer" ${fIdx === 0 ? '' : 'hidden'}>
            <p>${escapeHTML(answer)}</p>
          </div>
        </div>
      `;
    }).join('');
    bindFaqEvents();
  }

  // --- Next Learning Path Roadmap (with alias resolution & terminal milestone handling) ---
  const nextPathContainer = document.getElementById('next-path-container');
  if (nextPathContainer && data.next_learning_path) {
    const nextText = data.next_learning_path.recommended_next || '';
    
    // Find potential course ID
    const words = nextText.match(/[a-z0-9]+-[a-z0-9-]+/gi) || [];
    let nextCourseId = null;
    const courses = (typeof NS_COURSES !== 'undefined' && Array.isArray(NS_COURSES))
      ? NS_COURSES
      : (typeof window !== 'undefined' && Array.isArray(window.NS_COURSES) ? window.NS_COURSES : []);
    const validIds = new Set(courses.map(c => c.id));

    for (const w of words) {
      const clean = w.toLowerCase().replace(/[^a-z0-9-]/g, '');
      const resolved = COURSE_ALIASES[clean] || clean;
      if (validIds.has(resolved) && resolved !== baseCourse.id) {
        nextCourseId = resolved;
        break;
      }
    }

    const isTerminal = nextText.toLowerCase().includes('none') || !nextCourseId;

    nextPathContainer.innerHTML = `
      <div class="next-path-card">
        <div style="font-weight:700; color:var(--navy); font-size:1.05rem;">
          Your Progressive Learning Journey
        </div>
        <div class="next-path-flow">
          <div class="flow-node active">${escapeHTML(baseCourse.name)} (Current)</div>
          <span class="flow-arrow">→</span>
          <div class="flow-node target">
            ${isTerminal ? '🎓 Career Milestone (Ready for Direct Industry Practice)' : escapeHTML(nextText)}
          </div>
        </div>
        <div class="next-path-actions">
          ${nextCourseId ? `
            <a href="/course-detail.html?id=${encodeURIComponent(nextCourseId)}" class="btn btn-primary btn-sm">
              Advance to Next Program →
            </a>
          ` : `
            <a href="/courses.html?academy=${encodeURIComponent(baseCourse.academyId)}" class="btn btn-outline btn-sm">
              Explore Advanced Programs in ${escapeHTML(baseCourse.academy)} →
            </a>
          `}
        </div>
      </div>
    `;
  }

  // Refresh meta description with specific hands-on tools & target audience from deep curriculum data
  const updatedDesc = getCourseMetaDescription(baseCourse, data);
  const metaDesc = document.getElementById('page-meta-desc') || document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', updatedDesc);
  const ogDesc = document.getElementById('og-desc') || document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', updatedDesc);
  const twDesc = document.getElementById('tw-desc') || document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', updatedDesc);

  // Update Dynamic JSON-LD with Schema.org @graph
  injectCourseSchema(baseCourse, 'https://novaskills.in/public/images/seo/og-banner.png?v=2026', `https://novaskills.in/course-detail.html?id=${encodeURIComponent(baseCourse.id)}`, data);
}

/* ============================================================
   4. EVENT HANDLERS & ACCORDIONS
   ============================================================ */
function bindAccordionEvents() {
  document.querySelectorAll('.curriculum-module-header').forEach(header => {
    header.onclick = () => {
      const module = header.closest('.curriculum-module');
      const isOpen = module.classList.contains('open');
      module.classList.toggle('open');
      header.setAttribute('aria-expanded', !isOpen);
    };
    header.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    };
  });
}

function bindFaqEvents() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.onclick = () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);
      const answer = btn.nextElementSibling;
      if (answer) {
        if (isExpanded) {
          answer.hidden = true;
          btn.querySelector('.faq-icon').textContent = '+';
        } else {
          answer.hidden = false;
          btn.querySelector('.faq-icon').textContent = '−';
        }
      }
    };
  });
}

/* ============================================================
   5. RELATED COURSES ALGORITHM
   ============================================================ */
function renderRelatedCourses(currentCourse) {
  const container = document.getElementById('related-courses-grid');
  if (!container) return;

  const courses = (typeof NS_COURSES !== 'undefined' && Array.isArray(NS_COURSES))
    ? NS_COURSES
    : (typeof window !== 'undefined' && Array.isArray(window.NS_COURSES) ? window.NS_COURSES : []);

  const sameAcademyCourses = courses.filter(c => c.id !== currentCourse.id && c.academyId === currentCourse.academyId);
  const otherAcademyCourses = courses.filter(c => c.id !== currentCourse.id && c.academyId !== currentCourse.academyId);

  const recommendationPool = [...sameAcademyCourses, ...otherAcademyCourses];
  const uniqueRelated = [];
  const seenIds = new Set([currentCourse.id]);

  for (const c of recommendationPool) {
    if (c && !seenIds.has(c.id)) {
      seenIds.add(c.id);
      uniqueRelated.push(c);
    }
    if (uniqueRelated.length >= 3) break;
  }

  container.innerHTML = uniqueRelated.map(c => `
    <div class="course-card">
      <div class="course-thumbnail" style="height:150px;">
        <div class="course-thumb-bg" style="background:${c.color || 'var(--grad-hero)'}">
          <span style="font-size:2.5rem;">${c.icon || '🎓'}</span>
        </div>
        <div class="course-badge-overlay">
          <span class="course-level-badge" style="background:rgba(1, 23, 49, 0.85); color:#ffffff; font-size:0.75rem; padding:3px 8px; border-radius:4px; font-weight:600;">
            ${c.programLevel || c.courseType || c.level || 'Program'}
          </span>
        </div>
      </div>
      <div class="course-body">
        <div class="course-academy-tag">${c.icon || '🎓'} ${c.academy}</div>
        <h3 class="course-title" style="font-size:1rem;"><a href="/course-detail.html?id=${encodeURIComponent(c.id)}">${escapeHTML(c.name)}</a></h3>
        <div class="course-footer">
          <span class="price-current" style="font-size:1.125rem;">₹${(c.price || 0).toLocaleString('en-IN')}</span>
          <a href="/course-detail.html?id=${encodeURIComponent(c.id)}" class="btn btn-outline btn-sm">View Program</a>
        </div>
      </div>
    </div>
  `).join('');
}

/* ============================================================
   6. JSON-LD STRUCTURED DATA INJECTION (@graph)
   ============================================================ */
function injectCourseSchema(course, courseImg, canonicalUrl, detailData = null) {
  const existingScript = document.getElementById('ns-dynamic-course-schema');
  if (existingScript) existingScript.remove();

  const orgSchema = {
    "@type": "EducationalOrganization",
    "@id": "https://novaskills.in/#organization",
    "name": "Nova Skills",
    "url": "https://novaskills.in/",
    "logo": "https://novaskills.in/public/images/seo/og-banner.png?v=2026",
    "sameAs": [
      "https://novaskills.in/"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    }
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://novaskills.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": course.academy || "Academy",
        "item": `https://novaskills.in/courses.html?academy=${encodeURIComponent(course.academyId || '')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": course.name,
        "item": canonicalUrl
      }
    ]
  };

  let teachesSkills = [];
  if (detailData && detailData.hands_on_tech && Array.isArray(detailData.hands_on_tech.core_tools)) {
    teachesSkills = detailData.hands_on_tech.core_tools.map(t => (t.tool || t.name || t));
  } else if (course.tools && course.tools.length > 0) {
    teachesSkills = course.tools;
  } else {
    teachesSkills = [course.name, course.academy, 'Practical Training', 'Industry Projects'];
  }

  const courseSchema = {
    "@type": "Course",
    "@id": `${canonicalUrl}#course`,
    "name": course.name,
    "description": course.shortDesc || course.fullDesc,
    "url": canonicalUrl,
    "image": courseImg,
    "courseCode": course.id,
    "inLanguage": "en",
    "courseMode": course.mode || "Hybrid",
    "educationalCredentialAwarded": "Professional Certificate of Completion by Nova Skills",
    "teaches": teachesSkills,
    "provider": {
      "@type": "EducationalOrganization",
      "@id": "https://novaskills.in/#organization",
      "name": "Nova Skills",
      "url": "https://novaskills.in/"
    },
    "offers": {
      "@type": "Offer",
      "category": "Paid",
      "price": course.price || 0,
      "priceCurrency": "INR",
      "url": canonicalUrl,
      "availability": "https://schema.org/InStock"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": course.mode || "Hybrid",
      "duration": course.duration || "3 Months",
      "instructor": {
        "@type": "Organization",
        "name": "Nova Skills Faculty & Industry Mentors"
      }
    }
  };

  if (detailData && detailData.modules && Array.isArray(detailData.modules)) {
    courseSchema.hasCourseInstance.courseWorkload = `${detailData.learning_hours || 40} Hours`;
    courseSchema.syllabusSections = detailData.modules.map(m => ({
      "@type": "Syllabus",
      "name": m.module_title,
      "description": m.module_purpose || m.what_you_will_learn
    }));
  }

  const graphItems = [orgSchema, breadcrumbSchema, courseSchema];

  // Ingest FAQPage Schema if FAQs exist
  if (detailData && detailData.faq && Array.isArray(detailData.faq) && detailData.faq.length > 0) {
    const builds = detailData.what_you_will_build || [];
    const faqSchema = {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      "mainEntity": detailData.faq.map((item, fIdx) => {
        let ans = item.answer;
        if (fIdx === 1 && builds.length > 0) {
          ans = `You will build production-grade projects: ${builds.slice(0, 2).join(' and ')}, resulting in portfolio-ready case studies rather than trivial homework exercises.`;
        }
        return {
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": ans
          }
        };
      })
    };
    graphItems.push(faqSchema);
  }

  const rootSchema = {
    "@context": "https://schema.org",
    "@graph": graphItems
  };

  const scriptTag = document.createElement('script');
  scriptTag.id = 'ns-dynamic-course-schema';
  scriptTag.type = 'application/ld+json';
  scriptTag.textContent = JSON.stringify(rootSchema, null, 2);
  document.head.appendChild(scriptTag);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
