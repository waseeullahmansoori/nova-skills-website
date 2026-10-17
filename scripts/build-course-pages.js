/**
 * Build Static Pre-rendered Course Pages for Cloudflare Edge & Local Serving
 * Controlled Expansion: 4 Target Representative Courses
 * 
 * 1. digital-marketing-pro (Advanced Digital Marketing Professional)
 * 2. dm-professional (AI Digital Marketing Professional)
 * 3. dm-mastery (AI Digital Marketing Master)
 * 4. python-developer (Python Developer Professional)
 * 
 * Preserves existing canonical public URLs: /course-detail.html?id=COURSE_ID
 * Outputs:
 * - functions/_rendered_courses.js (in-memory bundle for Cloudflare Pages Functions)
 * - functions/_middleware.js (Cloudflare Pages edge middleware)
 * - _rendered_courses/<id>.html (static audit files)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Load data.js (NS_COURSES, NS_ACADEMIES)
const dataJs = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

const TARGET_COURSES = [
  'digital-marketing-pro',
  'dm-professional',
  'dm-mastery',
  'python-developer'
];

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

const ACADEMY_SLUG_MAP = {
  'digital-marketing': 'digital-marketing',
  'ai': 'ai',
  'ai-academy': 'ai',
  'design': 'design',
  'design-academy': 'design',
  'programming': 'programming',
  'programming-academy': 'programming',
  'nocode': 'no-code-web',
  'nocode-academy': 'no-code-web',
  'no-code-web': 'no-code-web',
  'video': 'video-motion',
  'video-academy': 'video-motion',
  'video-motion': 'video-motion',
  '3d': '3d',
  '3d-academy': '3d',
  'career': 'career-freelancing',
  'career-academy': 'career-freelancing',
  'career-freelancing': 'career-freelancing',
  'communication': 'communication',
  'comm-academy': 'communication',
  'kids': 'kids-tech',
  'kids-tech': 'kids-tech',
  'creator': 'creator',
  'creator-academy': 'creator',
  'office': 'office-productivity',
  'office-academy': 'office-productivity',
  'office-productivity': 'office-productivity'
};

function getAcademySlug(id) {
  return ACADEMY_SLUG_MAP[id] || id || '';
}

function escapeHTML(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCourseSeoTitle(course) {
  const type = (course.courseType || course.course_type || course.type || '').toUpperCase();
  const name = course.name || course.course_name;
  
  if (type === 'MASTER') {
    return `${name} — Flagship Career Program | Nova Skills`;
  } else if (type === 'PROFESSIONAL' || type === 'MERGE') {
    return `${name} — Professional Certification Course | Nova Skills`;
  } else if (type === 'SPECIALIZATION') {
    return `${name} Specialization Course | Hands-on Labs | Nova Skills`;
  } else if (type === 'MICRO') {
    return `${name} Practical Certification | Live Projects | Nova Skills`;
  } else if (type === 'MODULE') {
    return `${name} Practical Skill Module | Guided Labs | Nova Skills`;
  } else if (type === 'REPOSITION') {
    return `${name} Training — Industry Aligned Course | Nova Skills`;
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
  const hours = course.learningHours || (detailData && detailData.learning_hours);
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

function buildCourseSchema(course, canonicalUrl, detailData) {
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
        "item": `https://novaskills.in/academies/${getAcademySlug(course.academyId)}/`
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
    "image": "https://novaskills.in/public/images/seo/og-banner.png?v=2026",
    "courseCode": course.id,
    "inLanguage": "en",
    "courseMode": course.mode || "Online",
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
      "courseMode": course.mode || "Online",
      "duration": course.duration || "3 Months",
      "instructor": {
        "@type": "Organization",
        "name": "Nova Skills Faculty & Industry Mentors"
      }
    }
  };

  if (detailData && detailData.modules && Array.isArray(detailData.modules)) {
    courseSchema.hasCourseInstance.courseWorkload = `${course.learningHours || (detailData && detailData.learning_hours) || 40} Hours`;
    courseSchema.syllabusSections = detailData.modules.map(m => ({
      "@type": "Syllabus",
      "name": m.module_title,
      "description": m.module_purpose || (Array.isArray(m.what_you_will_learn) ? m.what_you_will_learn.join(', ') : m.what_you_will_learn)
    }));
  }

  const graphItems = [orgSchema, breadcrumbSchema, courseSchema];

  // Ingest FAQPage Schema if FAQs exist
  if (detailData && detailData.faq && Array.isArray(detailData.faq) && detailData.faq.length > 0) {
    const faqSchema = {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      "mainEntity": detailData.faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
    graphItems.push(faqSchema);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graphItems
  };
}

function generateStaticCourseHtml(courseId, templateHtml) {
  const baseCourse = NS_COURSES.find(c => c.id === courseId);
  if (!baseCourse) {
    throw new Error(`Course not found in NS_COURSES: ${courseId}`);
  }

  let detailData = null;
  const detailPath = path.join(ROOT_DIR, 'data', 'courses', `${courseId}.json`);
  if (fs.existsSync(detailPath)) {
    detailData = JSON.parse(fs.readFileSync(detailPath, 'utf8'));
  }

  // Preserve existing canonical public URL
  const canonicalUrl = `https://novaskills.in/course-detail.html?id=${encodeURIComponent(courseId)}`;
  const pageTitleText = (detailData && detailData.seo_title) || getCourseSeoTitle(baseCourse);
  const metaDescText = (detailData && detailData.seo_description) || getCourseMetaDescription(baseCourse, detailData);

  // Compute pricing values
  const priceFormatted = `₹${(baseCourse.price || 0).toLocaleString('en-IN')}`;
  const origPriceFormatted = baseCourse.originalPrice ? `₹${baseCourse.originalPrice.toLocaleString('en-IN')}` : '';
  const discountPct = (baseCourse.originalPrice && baseCourse.originalPrice > baseCourse.price)
    ? `${Math.round(((baseCourse.originalPrice - baseCourse.price) / baseCourse.originalPrice) * 100)}% OFF`
    : '';

  const durationMonths = (typeof baseCourse.durationMonths === 'number' && baseCourse.durationMonths > 0)
    ? baseCourse.durationMonths
    : (parseInt(baseCourse.duration, 10) || 1);
  const gstAmount = (baseCourse.price || 0) * 0.18;
  const totalWithGST = (baseCourse.price || 0) + gstAmount;
  const monthlyInstallment = Math.round(totalWithGST / durationMonths);
  const emiText = `💳 Easy No-Cost EMI starting at <strong>₹${monthlyInstallment.toLocaleString('en-IN')}/month</strong> · 18% GST included`;

  const acadSlug = getAcademySlug(baseCourse.academyId);
  const acadUrl = acadSlug ? `/academies/${acadSlug}/` : '/academies/';

  // Hours and project count
  const hours = baseCourse.learningHours || (detailData && detailData.learning_hours) || 40;
  const projectCount = (detailData && detailData.what_you_will_build) ? detailData.what_you_will_build.length : (baseCourse.projects || baseCourse.liveProjects || 2);
  const projectLabel = `${projectCount} Core Production Projects`;

  // Render Meta Badges
  const metaBadgesHtml = `
    <div class="course-meta-item"><span class="meta-icon">⏱️</span> Duration: ${baseCourse.duration || 'Flexible'} (${hours} Hours)</div>
    <div class="course-meta-item"><span class="meta-icon">📶</span> Level: ${baseCourse.level || 'Beginner'}</div>
    <div class="course-meta-item"><span class="meta-icon">💻</span> Mode: ${baseCourse.mode || 'Online'}</div>
    <div class="course-meta-item"><span class="meta-icon">🚀</span> ${projectLabel}</div>
    ${baseCourse.placementSupport ? '<div class="course-meta-item" style="color:var(--green-light); font-weight:700;"><span class="meta-icon">🎯</span> Placement Support Included</div>' : ''}
  `.trim();

  // Render Rating Row
  const ratingRowHtml = `
    <span class="rating-stars">★★★★★</span>
    <span class="rating-num">${baseCourse.rating || 4.7}</span>
    <span class="rating-count">(${baseCourse.reviews || 165} student reviews)</span>
    <span class="student-count">• ${(baseCourse.students || 710).toLocaleString('en-IN')}+ learners enrolled</span>
  `.trim();

  // Render Thumb
  const thumbHtml = `<span style="font-size:4rem; filter:drop-shadow(0 10px 20px rgba(0,0,0,0.3));">${baseCourse.icon || '🎓'}</span>`;

  // Advisory Banner (MERGE notice)
  let advisoryHtml = '';
  if (baseCourse.courseType === 'MERGE' || (detailData && detailData.course_type === 'MERGE')) {
    advisoryHtml = `
      <div class="course-advisory-banner">
        <span class="advisory-icon">🔄</span>
        <div class="advisory-content">
          <h4>Curriculum Integration Pathway Notice</h4>
          <p>
            This program is an integrated specialization module. If you are seeking complete career mastery, 
            this entire curriculum is also included in our flagship career track:
            <a href="/course-detail.html?id=dm-mastery" class="advisory-link">Explore Parent Career Program →</a>
          </p>
        </div>
      </div>
    `.trim();
  }

  // Program Overview
  let overviewHtml = '';
  if (detailData && detailData.overview) {
    overviewHtml = `
      <p style="font-size:1.15rem; font-weight:700; color:var(--navy); margin-bottom:14px; line-height:1.5;">
        ${escapeHTML(detailData.overview.positioning || baseCourse.positioning || '')}
      </p>
      <p style="margin-bottom:16px;">${escapeHTML(detailData.overview.short_description || baseCourse.shortDesc || '')}</p>
      <p style="margin-bottom:0;">
        Designed and delivered by senior practitioners, this curriculum delivers deep practical execution through 
        <strong>${projectCount} major production portfolio projects</strong>, live interactive labs, 
        code/design critiques, and commercial delivery standards.
      </p>
    `.trim();
  }

  // Why Learn Now
  let whyNowHtml = '';
  if (detailData && detailData.why_now) {
    whyNowHtml = `
      <div class="why-now-card">
        <div class="why-now-header">
          <span>⚡</span>
          <span>Why Learn This Now?</span>
          <span class="why-now-badge">2026/27 Industry Shift</span>
        </div>
        <p class="why-now-text">${escapeHTML(detailData.why_now.industry_shift || '')}</p>
        <div style="font-size:0.9rem; color:var(--teal); font-weight:600; margin-top:4px;">
          ${escapeHTML(detailData.why_now.ai_impact || detailData.why_now.business_demand || 'Industry toolchains and modern workflows drive high career demand.')}
        </div>
      </div>
    `.trim();
  }

  // Target Audience & Prerequisites
  let audienceHtml = '';
  if (detailData && detailData.target_audience) {
    const bestFor = detailData.target_audience.best_for || [];
    const notFor = detailData.target_audience.not_for || [];
    audienceHtml = `
      <div class="audience-grid">
        <div class="audience-card best-for">
          <h3><span style="color:var(--green)">✓</span> Ideal For (Best For)</h3>
          <ul class="audience-list">
            ${bestFor.map(item => `<li><span class="bullet-icon">✓</span><span>${escapeHTML(item)}</span></li>`).join('')}
          </ul>
        </div>
        ${notFor.length > 0 ? `
          <div class="audience-card not-for">
            <h3><span style="color:var(--orange)">✕</span> Who Is This NOT For</h3>
            <ul class="audience-list">
              ${notFor.map(item => `<li><span class="bullet-icon">✕</span><span>${escapeHTML(item)}</span></li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `.trim();
  }

  let prereqHtml = '';
  if (detailData && detailData.prerequisites) {
    prereqHtml = `
      <div class="prerequisites-box">
        <div class="prereq-item">
          <h4>Required Prerequisites</h4>
          <p>${escapeHTML(detailData.prerequisites.required || 'Basic computer literacy and internet access.')}</p>
        </div>
        <div class="prereq-item">
          <h4>Recommended Background</h4>
          <p>${escapeHTML(detailData.prerequisites.recommended || 'Curiosity and enthusiasm for hands-on project creation.')}</p>
        </div>
      </div>
    `.trim();
  }

  // Learning Outcomes
  let outcomesHtml = '';
  if (detailData && detailData.learning_outcomes) {
    outcomesHtml = `
      <div class="outcomes-grid">
        ${detailData.learning_outcomes.map(outcome => {
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
    `.trim();
  }

  // Curriculum Accordion
  let curriculumHtml = '';
  if (detailData && detailData.modules && Array.isArray(detailData.modules)) {
    curriculumHtml = detailData.modules.map((mod, idx) => `
      <div class="curriculum-module ${idx === 0 ? 'open' : ''}">
        <div class="curriculum-module-header" role="button" tabindex="0" aria-expanded="${idx === 0}">
          <span class="module-label">${String(mod.module_number || 'Module ' + (idx + 1)).replace(/^Module\s*/i, 'Module ')}</span>
          <span class="module-title">${escapeHTML(mod.module_title || 'Module Overview')}</span>
          <span class="module-lessons-count">${mod.lessons ? mod.lessons.length : 4} Lessons</span>
          <span class="module-chevron">⌄</span>
        </div>
        <div class="curriculum-module-body">
          <div class="module-purpose-box">
            <strong>Module Focus:</strong> ${escapeHTML(typeof mod.module_purpose === 'string' ? mod.module_purpose : (typeof mod.what_you_will_learn === 'string' ? mod.what_you_will_learn : 'Practical implementation and commercial standards.'))}
            ${Array.isArray(mod.what_you_will_learn) && mod.what_you_will_learn.length > 0 ? `
              <ul style="margin: 8px 0 0 18px; padding: 0; list-style-type: disc; font-size: 0.88rem; line-height: 1.5; color: var(--text-secondary);">
                ${mod.what_you_will_learn.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
              </ul>
            ` : ''}
            ${Array.isArray(mod.key_concepts) && mod.key_concepts.length > 0 ? `
              <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--navy);">Key Concepts:</span>
                ${mod.key_concepts.map(k => `<span style="background: rgba(5, 153, 168, 0.08); color: var(--teal); border: 1px solid rgba(5, 153, 168, 0.2); font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: var(--radius-full);">${escapeHTML(k)}</span>`).join('')}
              </div>
            ` : ''}
          </div>

          <div class="lessons-timeline">
            ${(mod.lessons || []).map(lesson => `
              <div class="lesson-card">
                <div class="lesson-card-header">
                  <span class="lesson-num-badge">${escapeHTML(lesson.lesson_number || 'Lab')}</span>
                  <span class="lesson-title-text">${escapeHTML(lesson.lesson_title || '')}</span>
                </div>
                <div class="lesson-meta-grid">
                  <div class="lesson-meta-item">
                    <strong>Taught:</strong> ${escapeHTML(lesson.what_is_taught || '')}
                    ${Array.isArray(lesson.subtopics) && lesson.subtopics.length > 0 ? `
                      <ul style="margin: 6px 0 0 16px; padding: 0; list-style-type: disc; font-size: 0.8rem; line-height: 1.45; color: var(--text-secondary);">
                        ${lesson.subtopics.map(st => `<li>${escapeHTML(st)}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                  <div class="lesson-meta-item"><strong>Learner Lab:</strong> ${escapeHTML(lesson.what_learner_does || '')}</div>
                  <div class="lesson-meta-item"><strong>Why It Matters:</strong> ${escapeHTML(lesson.why_it_matters || '')}</div>
                  <div class="lesson-meta-item"><strong>Expected Deliverable:</strong> ${escapeHTML(lesson.expected_outcome || '')}</div>
                  ${lesson.example ? `<div class="lesson-meta-item" style="grid-column: 1 / -1;"><strong>Industry Example:</strong> ${escapeHTML(lesson.example)}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="module-footer-meta">
            ${mod.hands_on_practice ? `<div><strong>🛠️ Hands-on Lab:</strong> ${escapeHTML(mod.hands_on_practice)}</div>` : ''}
            ${mod.assignment ? `<div><strong>📝 Practical Assignment:</strong> ${escapeHTML(mod.assignment)}</div>` : ''}
            ${mod.business_application ? `<div><strong>💼 Commercial Application:</strong> ${escapeHTML(mod.business_application)}</div>` : ''}
            ${mod.expected_outcome ? `<div><strong>🎯 Expected Outcome:</strong> ${escapeHTML(mod.expected_outcome)}</div>` : ''}
          </div>
        </div>
      </div>
    `).join('').trim();
  }

  // Tools
  let toolsHtml = '';
  if (detailData && detailData.hands_on_tech) {
    const core = detailData.hands_on_tech.core_tools || [];
    const supp = detailData.hands_on_tech.supporting_tools || [];
    const emerging = detailData.hands_on_tech.emerging_tools || [];
    toolsHtml = `
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
    `.trim();
  }

  // Projects
  let projectsHtml = '';
  if (detailData && detailData.what_you_will_build) {
    const builds = detailData.what_you_will_build || [];
    const deliverables = detailData.final_deliverables || [];
    projectsHtml = `
      <div class="projects-suite-grid">
        ${builds.map((b, bIdx) => {
          const isCapstone = b.toLowerCase().includes('capstone');
          return `
            <div class="portfolio-project-card ${isCapstone ? 'capstone' : ''}">
              <span class="project-tag-badge">${isCapstone ? 'Enterprise Capstone Project' : `Production Project ${bIdx + 1}`}</span>
              <div class="project-card-title">${escapeHTML(b)}</div>
              <p class="project-card-desc">
                ${escapeHTML(detailData.modules?.[bIdx]?.assignment || detailData.modules?.[bIdx]?.hands_on_practice || 'Built to professional standards, verified through peer critique and mentor review.')}
              </p>
              <div class="project-deliverable-badge">
                <span>📁</span> Deliverable: ${escapeHTML(deliverables[bIdx] || 'Production ready asset in student portfolio')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `.trim();
  }

  // Domain Mentors
  const academyMentors = {
    'digital-marketing': { lead: 'Growth & Ads Lead Mentor', role: 'Head of Performance & GEO Strategy', bio: 'Specialist in omnichannel growth funnels, AI search optimization (GEO), and programmatic ad architecture.', initials: 'GA' },
    'programming': { lead: 'Senior Full Stack Lead', role: 'Systems Architecture & Backend Mentor', bio: 'Specialist in cloud architectures, modern React/Node toolchains, database scaling, and production code reviews.', initials: 'FS' },
    'programming-academy': { lead: 'Senior Full Stack Lead', role: 'Systems Architecture & Backend Mentor', bio: 'Specialist in cloud architectures, modern React/Node toolchains, database scaling, and production code reviews.', initials: 'FS' }
  };
  const mentorData = academyMentors[baseCourse.academyId] || academyMentors['digital-marketing'];
  const mentorsHtml = `
    <div class="mentor-card">
      <div class="mentor-avatar" style="background:var(--grad-hero);"><span class="mentor-initials">${mentorData.initials}</span></div>
      <h3 class="mentor-name">${escapeHTML(mentorData.lead)}</h3>
      <div class="mentor-role">${escapeHTML(mentorData.role)}</div>
      <span class="mentor-exp">Industry Practitioner Mentorship</span>
      <p class="mentor-bio">${escapeHTML(mentorData.bio)}</p>
    </div>

    <div class="mentor-card">
      <div class="mentor-avatar" style="background:var(--grad-teal-green);"><span class="mentor-initials">PT</span></div>
      <h3 class="mentor-name">Senior Project Trainer</h3>
      <div class="mentor-role">Hands-On Lab &amp; Critique Mentor</div>
      <span class="mentor-exp">Live Project Mentorship</span>
      <p class="mentor-bio">Dedicated to portfolio asset building, iterative project critiques, industry toolchains, and commercial quality assurance.</p>
    </div>
  `.trim();

  // Boundaries
  let boundariesHtml = '';
  if (detailData && detailData.not_covered) {
    boundariesHtml = `
      <div class="course-boundaries-card">
        <div class="boundaries-header">
          <span>🎯</span>
          <span>Clear Boundaries: What This Course Focuses On &amp; What Is NOT Covered</span>
        </div>
        <p class="boundaries-text">${escapeHTML(detailData.not_covered)}</p>
      </div>
    `.trim();
  }

  // FAQs
  let faqHtml = '';
  if (detailData && detailData.faq && Array.isArray(detailData.faq)) {
    const builds = detailData.what_you_will_build || [];
    faqHtml = detailData.faq.map((item, fIdx) => {
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
    }).join('').trim();
  }

  // Related Courses (3 courses)
  const relatedCourses = NS_COURSES.filter(c => c.id !== baseCourse.id && c.academyId === baseCourse.academyId).slice(0, 3);
  let relatedHtml = relatedCourses.map(c => `
    <div class="course-card">
      <div class="course-thumbnail" style="height:150px;">
        <div class="course-thumb-bg" style="background:${c.color || 'var(--grad-hero)'}">
          <span style="font-size:3rem;">${c.icon || '🎓'}</span>
        </div>
        <div class="course-badge-overlay"><span class="course-level-badge">${c.level || 'All Levels'}</span></div>
      </div>
      <div class="course-body">
        <h4 style="font-size:1.05rem; font-weight:700; margin-bottom:8px;">
          <a href="/course-detail.html?id=${c.id}">${escapeHTML(c.name)}</a>
        </h4>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px;">${escapeHTML(c.shortDesc || '')}</p>
        <div class="course-footer" style="padding-top:12px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; color:var(--navy);">₹${(c.price || 0).toLocaleString('en-IN')}</span>
          <a href="/course-detail.html?id=${c.id}" class="btn btn-outline btn-sm">View Program →</a>
        </div>
      </div>
    </div>
  `).join('').trim();

  // Build JSON-LD Schema
  const schemaObj = buildCourseSchema(baseCourse, canonicalUrl, detailData);
  const schemaScriptTag = `<script type="application/ld+json" id="ns-dynamic-course-schema">\n${JSON.stringify(schemaObj, null, 2)}\n  </script>`;

  // Perform DOM replacements in master template using robust regex
  let html = templateHtml;

  // Title
  html = html.replace(/<title id="page-title">[\s\S]*?<\/title>/i, `<title id="page-title">${escapeHTML(pageTitleText)}</title>`);

  // Meta Description
  html = html.replace(/<meta\s+name="description"\s+id="page-meta-desc"\s+content="[\s\S]*?"\s*\/>/i, `<meta name="description" id="page-meta-desc" content="${escapeHTML(metaDescText)}" />`);

  // Canonical
  html = html.replace(/<link\s+rel="canonical"\s+id="page-canonical"\s+href="[\s\S]*?"\s*\/>/i, `<link rel="canonical" id="page-canonical" href="${canonicalUrl}" />`);

  // Remove the dynamic canonical script in pre-rendered page to prevent URL overriding
  html = html.replace(/<script>\s*\(function\(\)\s*\{\s*try\s*\{\s*var params = new URLSearchParams[\s\S]*?<\/script>/i, '');

  // Meta tags for Course ID and Pre-rendered flag
  const metaCourseTags = `  <meta name="course-id" content="${escapeHTML(courseId)}" />\n  <meta name="prerendered" content="true" />`;
  html = html.replace(/<!-- Canonical Link -->/i, `<!-- Canonical Link -->\n${metaCourseTags}`);

  // Open Graph
  html = html.replace(/<meta\s+property="og:url"\s+id="og-url"\s+content="[\s\S]*?"\s*\/>/i, `<meta property="og:url" id="og-url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+id="og-title"\s+content="[\s\S]*?"\s*\/>/i, `<meta property="og:title" id="og-title" content="${escapeHTML(pageTitleText)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+id="og-desc"\s+content="[\s\S]*?"\s*\/>/i, `<meta property="og:description" id="og-desc" content="${escapeHTML(metaDescText)}" />`);
  html = html.replace(/<meta\s+property="og:image:alt"\s+id="og-image-alt"\s+content="[\s\S]*?"\s*\/>/i, `<meta property="og:image:alt" id="og-image-alt" content="${escapeHTML(pageTitleText)}" />`);

  // Twitter
  html = html.replace(/<meta\s+name="twitter:title"\s+id="tw-title"\s+content="[\s\S]*?"\s*\/>/i, `<meta name="twitter:title" id="tw-title" content="${escapeHTML(pageTitleText)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+id="tw-desc"\s+content="[\s\S]*?"\s*\/>/i, `<meta name="twitter:description" id="tw-desc" content="${escapeHTML(metaDescText)}" />`);
  html = html.replace(/<meta\s+name="twitter:image:alt"\s+id="tw-image-alt"\s+content="[\s\S]*?"\s*\/>/i, `<meta name="twitter:image:alt" id="tw-image-alt" content="${escapeHTML(pageTitleText)}" />`);

  // Inject Schema.org JSON-LD before </head>
  html = html.replace('</head>', `  ${schemaScriptTag}\n</head>`);

  // Breadcrumbs: Fix Home link to root '/'
  html = html.replace(/<a\s+href="index\.html">Home<\/a>/i, '<a href="/">Home</a>');
  html = html.replace(/<a\s+href="\/courses\.html"\s+id="breadcrumb-academy-link">Courses<\/a>/i, `<a href="${acadUrl}" id="breadcrumb-academy-link">${escapeHTML(baseCourse.academy)}</a>`);
  html = html.replace(/<span\s+id="breadcrumb-course-name">[\s\S]*?<\/span>/i, `<span id="breadcrumb-course-name">${escapeHTML(baseCourse.name)}</span>`);

  // Academy Tag
  html = html.replace(/<div\s+class="course-detail-academy-tag"\s+id="detail-academy-tag">[\s\S]*?<\/div>/i, `<div class="course-detail-academy-tag" id="detail-academy-tag">\n            <a href="${acadUrl}" style="color:inherit; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">${baseCourse.icon || '🎓'} ${escapeHTML(baseCourse.academy)}</a>\n          </div>`);

  // Detail Title (H1)
  html = html.replace(/<h1\s+class="course-detail-title"\s+id="detail-title">[\s\S]*?<\/h1>/i, `<h1 class="course-detail-title" id="detail-title">${escapeHTML(baseCourse.name)}</h1>`);

  // Detail Desc
  html = html.replace(/<p\s+class="course-detail-desc"\s+id="detail-desc">[\s\S]*?<\/p>/i, `<p class="course-detail-desc" id="detail-desc">${escapeHTML(baseCourse.positioning || baseCourse.shortDesc)}</p>`);

  // Detail Meta
  html = html.replace(/<div\s+class="course-detail-meta"\s+id="detail-meta">[\s\S]*?<\/div>/i, `<div class="course-detail-meta" id="detail-meta">\n            ${metaBadgesHtml}\n          </div>`);

  // Rating Row
  html = html.replace(/<div\s+class="course-rating-row"\s+id="detail-rating-row">[\s\S]*?<\/div>/i, `<div class="course-rating-row" id="detail-rating-row">\n            ${ratingRowHtml}\n          </div>`);

  // Enroll Card Thumb
  html = html.replace(/<div\s+class="course-card-thumb"\s+id="detail-card-thumb">[\s\S]*?<\/div>/i, `<div class="course-card-thumb" id="detail-card-thumb" style="background:${baseCourse.color || 'var(--grad-hero)'};">\n            ${thumbHtml}\n          </div>`);

  // Enroll Card Pricing
  html = html.replace(/<span\s+class="enroll-price"\s+id="detail-price">[\s\S]*?<\/span>/i, `<span class="enroll-price" id="detail-price">${priceFormatted}</span>`);
  if (origPriceFormatted) {
    html = html.replace(/<span\s+class="enroll-original"\s+id="detail-original-price"[\s\S]*?<\/span>/i, `<span class="enroll-original" id="detail-original-price">${origPriceFormatted}</span>`);
  }
  if (discountPct) {
    html = html.replace(/<span\s+class="enroll-discount"\s+id="detail-discount"[\s\S]*?<\/span>/i, `<span class="enroll-discount" id="detail-discount">${discountPct}</span>`);
  }
  html = html.replace(/<p\s+class="enroll-emi"\s+id="detail-emi">[\s\S]*?<\/p>/i, `<p class="enroll-emi" id="detail-emi">${emiText}</p>`);

  // Advisory Banner
  if (advisoryHtml) {
    html = html.replace(/<div\s+class="container"\s+id="course-advisory-container"><\/div>/i, `<div class="container" id="course-advisory-container">\n      ${advisoryHtml}\n    </div>`);
  }

  // Overview
  if (overviewHtml) {
    html = html.replace(/<div\s+id="overview-content"[\s\S]*?<\/div>/i, `<div id="overview-content" style="font-size:1.0625rem; line-height:1.8; color:var(--text-secondary); max-width:860px; margin-bottom:24px;">\n        ${overviewHtml}\n      </div>`);
  }

  // Why Learn Now
  if (whyNowHtml) {
    html = html.replace(/<div\s+id="why-now-container"[\s\S]*?<\/div>/i, `<div id="why-now-container" style="max-width:860px; display:block;">\n        ${whyNowHtml}\n      </div>`);
  }

  // Target Audience & Prerequisites
  if (audienceHtml) {
    html = html.replace(/<div\s+id="audience-container"[\s\S]*?<\/div>/i, `<div id="audience-container" style="max-width:860px;">\n        ${audienceHtml}\n      </div>`);
  }
  if (prereqHtml) {
    html = html.replace(/<div\s+id="prerequisites-container"[\s\S]*?<\/div>/i, `<div id="prerequisites-container" style="max-width:860px;">\n        ${prereqHtml}\n      </div>`);
  }

  // Outcomes
  if (outcomesHtml) {
    html = html.replace(/<div\s+id="outcomes-container"[\s\S]*?<\/div>/i, `<div id="outcomes-container" style="max-width:860px;">\n        ${outcomesHtml}\n      </div>`);
  }

  // Curriculum
  if (curriculumHtml) {
    html = html.replace(/<div\s+class="curriculum-modules"\s+id="curriculum-container"[\s\S]*?<\/div>/i, `<div class="curriculum-modules" id="curriculum-container" style="max-width:860px;">\n        ${curriculumHtml}\n      </div>`);
  }

  // Tools
  if (toolsHtml) {
    html = html.replace(/<div\s+id="tools-container"[\s\S]*?<\/div>/i, `<div id="tools-container" style="max-width:860px;">\n        ${toolsHtml}\n      </div>`);
  }

  // Projects
  if (projectsHtml) {
    html = html.replace(/<div\s+id="projects-container"[\s\S]*?<\/div>/i, `<div id="projects-container" style="max-width:860px;">\n        ${projectsHtml}\n      </div>`);
  }

  // Mentors
  html = html.replace(/<div\s+class="mentors-grid"\s+id="mentors-container">[\s\S]*?<\/div>/i, `<div class="mentors-grid" id="mentors-container">\n        ${mentorsHtml}\n      </div>`);

  // Boundaries
  if (boundariesHtml) {
    html = html.replace(/<div\s+id="boundaries-container"[\s\S]*?<\/div>/i, `<div id="boundaries-container" style="max-width:860px;">\n        ${boundariesHtml}\n      </div>`);
  }

  // FAQs
  if (faqHtml) {
    html = html.replace(/<div\s+class="faq-grid"[\s\S]*?id="course-faq-grid">[\s\S]*?<\/div>/i, `<div class="faq-grid" style="max-width:860px; margin:0;" id="course-faq-grid">\n        ${faqHtml}\n      </div>`);
  }

  // Related Courses
  if (relatedHtml) {
    html = html.replace(/<div\s+class="related-grid"\s+id="related-courses-grid">[\s\S]*?<\/div>/i, `<div class="related-grid" id="related-courses-grid">\n        ${relatedHtml}\n      </div>`);
  }

  // Sticky Mobile Bar
  html = html.replace(/<span\s+class="price-current"\s+id="mobile-price">[\s\S]*?<\/span>/i, `<span class="price-current" id="mobile-price">${priceFormatted}</span>`);
  if (origPriceFormatted) {
    html = html.replace(/<span\s+class="price-original"\s+id="mobile-orig-price"[\s\S]*?<\/span>/i, `<span class="price-original" id="mobile-orig-price">${origPriceFormatted}</span>`);
  }

  // Cert Course Display Name
  html = html.replace(/<div\s+class="cert-course-name"\s+id="cert-course-display"[\s\S]*?<\/div>/i, `<div class="cert-course-name" id="cert-course-display" style="font-size:0.8rem; padding:4px 12px;">${escapeHTML(baseCourse.name)}</div>`);

  return html;
}

function generateNotFoundHtml(templateHtml) {
  let html = templateHtml;
  html = html.replace(/<title id="page-title">[\s\S]*?<\/title>/i, '<title id="page-title">Course Not Found — Nova Skills</title>');
  html = html.replace(/<meta\s+name="robots"[\s\S]*?\/>/i, '<meta name="robots" id="page-robots" content="noindex, follow" />');
  html = html.replace(/<main id="course-detail-main">[\s\S]*?<\/main>/i, `
    <main id="course-detail-main">
      <div class="container" style="padding-top:40px; padding-bottom:80px;">
        <div class="course-error-state" style="text-align:center; padding:60px 20px; background:white; border-radius:24px; max-width:640px; margin:40px auto; box-shadow:var(--shadow-md);">
          <div style="font-size:3.5rem; margin-bottom:16px;">🔍</div>
          <h1 style="font-size:2rem; font-weight:800; color:var(--navy); margin-bottom:12px;">Course Not Found</h1>
          <p style="color:var(--text-muted); font-size:1.05rem; margin-bottom:24px; line-height:1.6;">
            The program you are looking for may have been modernized, renamed, or relocated. 
            Explore our catalog of 109+ industry-standard career courses across 12 academies.
          </p>
          <div class="course-error-actions" style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
            <a href="/courses.html" class="btn btn-primary">Browse All Courses →</a>
            <a href="/" class="btn btn-outline">Back to Home</a>
          </div>
        </div>
      </div>
    </main>
  `);
  html = html.replace(/<div class="sticky-enroll-bar"[\s\S]*?<\/div>/i, '');
  return html;
}

function runBuild() {
  console.log('=== BUILDING CONTROLLED COURSE RENDERING (4 COURSES) ===\n');

  const templateHtml = fs.readFileSync(path.join(ROOT_DIR, 'course-detail.html'), 'utf8');
  const renderedMap = {};

  const staticOutDir = path.join(ROOT_DIR, '_rendered_courses');
  fs.mkdirSync(staticOutDir, { recursive: true });

  TARGET_COURSES.forEach(courseId => {
    console.log(`Pre-rendering course: "${courseId}"...`);
    const html = generateStaticCourseHtml(courseId, templateHtml);
    renderedMap[courseId] = html;

    const outFile = path.join(staticOutDir, `${courseId}.html`);
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`  ✅ Written static file: _rendered_courses/${courseId}.html (${(html.length / 1024).toFixed(1)} KB)`);
  });

  const notFoundHtml = generateNotFoundHtml(templateHtml);
  fs.writeFileSync(path.join(staticOutDir, '404.html'), notFoundHtml, 'utf8');

  // Build functions/ directory for Cloudflare Pages Functions
  const functionsDir = path.join(ROOT_DIR, 'functions');
  fs.mkdirSync(functionsDir, { recursive: true });

  const allValidCourseIds = NS_COURSES.map(c => c.id);

  // Write functions/_rendered_courses.js
  const renderedJsPath = path.join(functionsDir, '_rendered_courses.js');
  const renderedJsContent = `/**
 * Pre-rendered Course HTML Dictionary for Cloudflare Pages Edge Middleware
 * Generated at ${new Date().toISOString()}
 */

export const RENDERED_COURSES = ${JSON.stringify(renderedMap)};

export const ALL_VALID_COURSE_IDS = new Set(${JSON.stringify(allValidCourseIds)});

export const COURSE_ALIASES = ${JSON.stringify(COURSE_ALIASES)};

export const COURSE_NOT_FOUND_HTML = ${JSON.stringify(notFoundHtml)};
`;
  fs.writeFileSync(renderedJsPath, renderedJsContent, 'utf8');
  console.log(`\n✅ Generated Edge Functions bundle: functions/_rendered_courses.js (${(renderedJsContent.length / 1024).toFixed(1)} KB)`);

  // Write functions/_middleware.js
  const middlewarePath = path.join(functionsDir, '_middleware.js');
  const middlewareContent = `/**
 * Cloudflare Pages Edge Middleware for Course-Specific Initial HTML
 * Intercepts /course-detail and /course-detail.html to serve course-specific initial HTML
 * before client JavaScript execution, preserving existing public URLs.
 */

import { RENDERED_COURSES, ALL_VALID_COURSE_IDS, COURSE_ALIASES, COURSE_NOT_FOUND_HTML } from './_rendered_courses.js';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\\/$/, '');

  // Intercept /course-detail and /course-detail.html
  if (pathname === '/course-detail' || pathname === '/course-detail.html') {
    const rawId = (url.searchParams.get('id') || url.searchParams.get('course') || '').trim();

    if (rawId) {
      const id = COURSE_ALIASES[rawId] || rawId;

      // 1. If pre-rendered, return course-specific HTML with status 200 OK
      if (RENDERED_COURSES[id]) {
        return new Response(RENDERED_COURSES[id], {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'X-Robots-Tag': 'index, follow'
          }
        });
      }

      // 2. If unknown/invalid course ID, return 404 Not Found response
      if (!ALL_VALID_COURSE_IDS.has(id)) {
        return new Response(COURSE_NOT_FOUND_HTML, {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Robots-Tag': 'noindex, follow'
          }
        });
      }
    } else {
      // If no ID is specified, default flagship course: dm-mastery
      if (RENDERED_COURSES['dm-mastery']) {
        return new Response(RENDERED_COURSES['dm-mastery'], {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'X-Robots-Tag': 'index, follow'
          }
        });
      }
    }

    // 3. For any other course ID, pass through to shared client template
    return context.next();
  }

  return context.next();
}
`;
  fs.writeFileSync(middlewarePath, middlewareContent, 'utf8');
  console.log(`✅ Generated Cloudflare Pages Middleware: functions/_middleware.js`);
  console.log(`\n🎉 BUILD COMPLETE FOR 4 TARGET COURSES.`);
}

runBuild();
