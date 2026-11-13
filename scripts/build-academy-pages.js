
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const { renderCourseIcon, renderAcademyTagHtml } = require(path.join(rootDir, 'js', 'icon-system.js'));
const NovaCourseData = require(path.join(rootDir, 'js', 'course-data.js'));

const ACADEMIES_LIST = NovaCourseData.getAllAcademies();
const COURSES_LIST = NovaCourseData.getPublishedCourses();

function isCourseDemoEligible(course) {
  return NovaCourseData.isCourseDemoEligible(course);
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

/**
 * Enhanced Static HTML Generator for All 12 Nova Skills Academies
 * Pre-renders full course cards, links, accurate counts, and SEO schemas
 * directly from the canonical course data layer (NovaCourseData).
 */

// Final Consolidated 93-ID Package Academy Hero Visual Registry (All 12 Academies)
const ACADEMY_HERO_VISUALS = {
  'digital-marketing': {
    enabled: true,
    assetId: 'IMG-022',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-022.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-022.webp',
    alt: 'Editorial workspace illustration depicting Digital Marketing campaign planning and analytics dashboards.',
    caption: 'Performance Marketing, SEO & Campaign Analytics Workflow',
    outcomeId: 'IMG-023',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'Campaign Planning & GA4 Analytics Architecture',
    outcomeDesc: 'Explore how modules combine funnel strategy, search optimization, paid ad experimentation, and sanitized performance reporting.',
    outcomeAlt: 'Sanitized digital marketing funnel and channel analytics preview'
  },
  'ai': {
    enabled: true,
    assetId: 'IMG-024',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-024.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-024.webp',
    alt: 'Editorial workspace illustration showing n8n node automation pipelines and agentic AI architecture planning.',
    caption: 'Practical AI Workflow Orchestration & Automation Lab',
    outcomeId: 'IMG-025',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'Multi-Step AI Agent & Evaluation Pipelines',
    outcomeDesc: 'Build structured automation graphs with validation checks, human-in-the-loop oversight, and measurable reliability criteria.',
    outcomeAlt: 'AI workflow diagram showing retrieval, evaluation checkpoints, and automation orchestration'
  },
  'design': {
    enabled: true,
    assetId: 'IMG-026',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-026.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-026.webp',
    alt: 'Editorial design studio illustration featuring brand identity boards, typography grids, and Figma interface layouts.',
    caption: 'Brand Identity Systems, Typography & UI/UX Studio',
    outcomeId: 'IMG-027',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'Brand Guidelines & Interactive UI Systems',
    outcomeDesc: 'Move from grid theory and color tokens to multi-platform identity packages and clickable Figma prototypes.',
    outcomeAlt: 'Brand style guide and Figma interface layout curriculum preview'
  },
  'programming': {
    enabled: true,
    assetId: 'IMG-028',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-028.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-028.webp',
    alt: 'Editorial software development workstation showing application code, responsive previews, and debugging panes.',
    caption: 'Full-Stack Engineering & Applied Coding Studio',
    outcomeId: 'IMG-029',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'Full-Stack Application Architecture & Testing',
    outcomeDesc: 'Train on structured front-end components, API endpoints, database models, and automated verification checks.',
    outcomeAlt: 'Full-stack code editor and responsive interface testing preview'
  },
  'no-code-web': {
    enabled: true,
    assetId: 'IMG-030',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-030.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-030.webp',
    alt: 'Editorial visual web studio showing no-code storefront builder, responsive breakpoints, and CMS blocks.',
    caption: 'Visual Web Design, Webflow & Storefront Production',
    outcomeId: 'IMG-031',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'E-Commerce Storefront & CMS Systems',
    outcomeDesc: 'Design responsive WordPress, Webflow, Framer, and Shopify sites built for real conversion performance.',
    outcomeAlt: 'No-code storefront and responsive CMS builder preview'
  },
  'video-motion': {
    enabled: true,
    assetId: 'IMG-032',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-032.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-032.webp',
    alt: 'Editorial post-production workstation displaying multi-track editing timeline and color-grading scopes.',
    caption: 'Video Editing Timeline & Motion Graphics Studio',
    outcomeId: 'IMG-033',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'Storytelling Cuts, Color Grading & Motion',
    outcomeDesc: 'Practice pacing, LUT calibration, typography animation, and audio mastering across commercial timelines.',
    outcomeAlt: 'Video editing multi-track timeline and before-after color grading frames preview'
  },
  '3d': {
    enabled: true,
    assetId: 'IMG-034',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-034.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-034.webp',
    alt: 'Editorial 3D artist workspace showing architectural mesh geometry, lighting rigs, and rendered interior view.',
    caption: 'Architectural Visualization & 3D Production Lab',
    outcomeId: 'IMG-035',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'Wireframe Geometry to Photoreal Renders',
    outcomeDesc: 'Progress through clean quad topology, physically-based materials, camera staging, and realistic lighting.',
    outcomeAlt: '3D wireframe topology transitioning to finished interior render preview'
  },
  'career-freelancing': {
    enabled: true,
    assetId: 'IMG-036',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-036.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-036.webp',
    alt: 'Editorial workspace illustrating freelance client proposals, portfolio case studies, and scope timelines.',
    caption: 'Portfolio Positioning & Client Consulting Suite',
    outcomeId: 'IMG-037',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'ATS Resume & Client Proposal Systems',
    outcomeDesc: 'Structure compelling proposals, redacted case studies, pricing tiers, and career-readiness portfolios.',
    outcomeAlt: 'Structured resume and client proposal template preview'
  },
  'communication': {
    enabled: true,
    assetId: 'IMG-038',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-038.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-038.webp',
    alt: 'Editorial concept illustration of structured interactive workplace speaking and presentation practice.',
    caption: 'Structured Communication & Workplace Readiness',
    outcomeId: 'IMG-039',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'Scenario Role-Play & Presentation Confidence',
    outcomeDesc: 'Develop fluency through guided workplace dialogues, active listening rubrics, and presentation practice.',
    outcomeAlt: 'Editorial illustration depicting guided workplace communication role-play practice'
  },
  'kids-tech': {
    enabled: true,
    assetId: 'IMG-040',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-040.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-040.webp',
    alt: 'Editorial illustration showcasing supervised youth coding workspace with Scratch visual blocks and micro:bit kits.',
    caption: 'Supervised Youth Coding & Computational Maker Lab',
    outcomeId: 'IMG-041',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'Visual Block Logic & Guided Mini-Games',
    outcomeDesc: 'Age-appropriate guided lessons turning foundational logic blocks into interactive animations and safe hardware tasks.',
    outcomeAlt: 'Visual Scratch block coding and youth project logic preview'
  },
  'creator': {
    enabled: true,
    assetId: 'IMG-042',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-042.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-042.webp',
    alt: 'Editorial studio concept featuring camera rig, key lighting, audio mic, and digital content creation workspace.',
    caption: 'Creator Production, Scripting & Channel Workflow',
    outcomeId: 'IMG-043',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'Content Strategy, Thumbnails & Channel Packaging',
    outcomeDesc: 'Plan retention-focused scripts, structured thumbnails, and consistent publishing systems across modern platforms.',
    outcomeAlt: 'Content planning board and YouTube channel packaging preview'
  },
  'office-productivity': {
    enabled: true,
    assetId: 'IMG-044',
    approvalStatus: 'approved',
    desktopSrc: '/public/assets/nova-images/desktop/IMG-044.webp',
    mobileSrc: '/public/assets/nova-images/mobile/IMG-044.webp',
    alt: 'Editorial workstation illustrating structured spreadsheet modeling, executive reports, and office workflow automation.',
    caption: 'Business Data Reporting, Excel & MIS Operations',
    outcomeId: 'IMG-045',
    outcomeTag: 'SKILLS & WORKFLOW PREVIEW',
    outcomeTitle: 'MIS Reporting, Power Query & Executive Decks',
    outcomeDesc: 'Master clean data normalization, formula logic, pivot summaries, and stakeholder-ready slide decks.',
    outcomeAlt: 'Power BI data reporting and Excel business modeling dashboard preview'
  }
};

const ACADEMIES_DATA = {
  'digital-marketing': {
    title: 'Digital Marketing Course & Certification | Nova Skills Academy',
    metaDesc: 'Master Digital Marketing with 100% practical training in SEO, Google Ads, Meta Ads & AI tools. Classroom & live online batches with dedicated placement assistance.',
    h1: 'Digital Marketing Academy: Job-Ready Training & Certification',
    faqs: [
      { q: 'What is covered in the Digital Marketing Course?', a: 'The curriculum covers Search Engine Optimization (SEO), Generative Engine Optimization (GEO), Google Ads, Meta Ads Manager, GA4 Analytics, Content Marketing, and AI marketing workflows.' },
      { q: 'Are classes available online for students outside Siddharth Nagar?', a: 'Yes! We offer live interactive online batches with dedicated doubt-clearing sessions and portfolio reviews for students across Pan-India.' },
      { q: 'Do you provide placement assistance?', a: 'Yes, our career and professional programs include dedicated placement assistance, resume preparation, mock interviews, and industry hiring connections.' },
      { q: 'Will I receive an industry-recognized certificate?', a: 'Yes, upon completing your live projects and practical assessments, you will receive an official certification from Nova Skills Education Institute.' }
    ]
  },
  '3d': {
    title: '3D Academy — 3ds Max, Blender & V-Ray Courses | Nova Skills',
    metaDesc: 'Master 3D modeling, interior rendering & animation with 3ds Max, Blender, Unreal Engine & V-Ray. Hands-on portfolio projects with career guidance & placement assistance.',
    h1: '3D Academy: Practical 3D Modeling, ArchViz & Animation Training',
    faqs: [
      { q: 'Which software tools will I learn in the 3D Academy?', a: 'You will master Autodesk 3ds Max, Blender 4, Chaos V-Ray 6, and Unreal Engine 5 for architectural visualization and 3D modeling.' },
      { q: 'Can beginners join without previous design experience?', a: 'Yes, our courses begin with foundational 3D coordinate space and modeling logic before advancing to lighting, texturing, and photorealistic rendering.' },
      { q: 'Is this course available in live online mode?', a: 'Yes, you can attend live instructor-led online sessions with screen sharing, project feedback, and recorded access.' },
      { q: 'Do you provide portfolio and placement support?', a: 'Yes, students build a complete architectural or game asset portfolio ready to showcase to animation studios and interior design firms.' }
    ]
  },
  'kids-tech': {
    title: 'Kids Tech Academy — Coding, AI & Robotics for Ages 8–16 | Nova Skills',
    metaDesc: 'Empower your child with future tech skills. Hands-on coding, Scratch, Python, game development & AI fundamentals for kids aged 8–16. Safe interactive learning.',
    h1: 'Kids Tech Academy: Coding, AI & Future Skills for Young Innovators',
    faqs: [
      { q: 'What age groups are eligible for Kids Tech Academy?', a: 'Our programs are tailored for young learners aged 8 to 16, divided into junior tracks (ages 8–11) and senior tracks (ages 12–16).' },
      { q: 'What skills will children learn?', a: 'Kids learn computational thinking, Scratch visual programming, Python fundamentals, game design, and safe generative AI tools.' },
      { q: 'Is prior computer programming experience required?', a: 'No prior experience is necessary. Our mentors guide students through fun, interactive, and project-based challenges.' }
    ]
  },
  'video-motion': {
    title: 'Video Editing & Motion Graphics Course | Premiere Pro & After Effects',
    metaDesc: 'Learn professional video editing & motion design in Premiere Pro, DaVinci Resolve & After Effects. Build a commercial showreel with placement assistance.',
    h1: 'Video & Motion Academy: Professional Post-Production & VFX Training',
    faqs: [
      { q: 'What software is taught in Video & Motion Academy?', a: 'You will learn Adobe Premiere Pro, After Effects, DaVinci Resolve Studio, and CapCut Pro for short-form and long-form video editing.' },
      { q: 'Will I build a portfolio or showreel?', a: 'Yes, every student completes a commercial showreel featuring social media video ads, YouTube documentaries, and kinetic typography.' },
      { q: 'Are placement opportunities available for video editors?', a: 'Yes, video editing is in high demand. We connect students with creative agencies, media houses, and freelance client platforms.' }
    ]
  },
  'programming': {
    title: 'Web & App Development Courses — Full-Stack & Python | Nova Skills',
    metaDesc: 'Learn Full-Stack Web Development, Python, and Mobile Apps with live project building. Master HTML, CSS, JavaScript, React & Node.js with placement assistance.',
    h1: 'Programming Academy: Full-Stack Web & Software Engineering Training',
    faqs: [
      { q: 'What technologies will I learn in Programming Academy?', a: 'Curriculum covers modern HTML5, CSS3, JavaScript (ES6+), React.js, Node.js, Express, MongoDB, SQL, and Python software development.' },
      { q: 'Do I get to build real web applications?', a: 'Yes, you will build production-ready full-stack applications with user authentication, database management, and cloud deployment.' },
      { q: 'Is there placement assistance for software developers?', a: 'Yes, our team provides technical mock interviews, GitHub code review sessions, and resume forwarding to tech hiring partners.' }
    ]
  },
  'ai': {
    title: 'AI & Automation Academy — n8n, AI Agents & Prompt Engineering | Nova Skills',
    metaDesc: 'Master Generative AI, prompt engineering, n8n automated workflows, and custom AI agents. Practical hands-on training using ChatGPT, Claude, and OpenAI APIs.',
    h1: 'AI Academy: Generative AI, Workflow Automation & Agentic Systems',
    faqs: [
      { q: 'What tools and models are taught in AI Academy?', a: 'You will master prompt engineering with ChatGPT and Claude, n8n webhook automation, OpenAI APIs, vector databases, and multi-agent systems.' },
      { q: 'Do I need coding knowledge to learn AI automation?', a: 'We offer specialized tracks for both non-coders (using no-code platforms like n8n and Make.com) and technical developers (using APIs and Python).' },
      { q: 'How does AI automation help in my career?', a: 'Organizations are actively adopting AI agents and automated pipelines. Certified AI specialists earn premium salaries and consulting retainers.' }
    ]
  },
  'design': {
    title: 'Graphic Design & UI/UX Academy — Figma & Adobe Suite | Nova Skills',
    metaDesc: 'Master graphic design, brand identity, and UI/UX with Figma, Photoshop & Illustrator. Build a hiring-ready design portfolio with placement assistance.',
    h1: 'Design Academy: Graphic Design, Branding & UI/UX Training',
    faqs: [
      { q: 'What is the focus of the Design Academy?', a: 'We combine visual graphic design fundamentals (typography, color theory, layout in Photoshop & Illustrator) with modern UI/UX design in Figma.' },
      { q: 'Will I have a portfolio by the end of the course?', a: 'Yes, every student graduates with a published portfolio on Behance and Figma containing real brand identity projects and mobile app prototypes.' },
      { q: 'Can non-artists learn graphic design?', a: 'Absolutely. Design is a structured problem-solving discipline with clear principles that anyone can master through practice.' }
    ]
  },
  'no-code-web': {
    title: 'No-Code Web Academy — Webflow, WordPress & Shopify | Nova Skills',
    metaDesc: 'Build client websites without code using Webflow, WordPress, Shopify & Framer. Master freelancing and agency web development with practical client projects.',
    h1: 'No-Code Web Academy: Webflow, WordPress & E-Commerce Development',
    faqs: [
      { q: 'What platforms are covered in No-Code Web Academy?', a: 'You will build real production websites using Webflow, WordPress & Elementor, Shopify for e-commerce, and Framer for high-conversion landing pages.' },
      { q: 'How fast can I start taking client projects?', a: 'Most students complete their first client-ready website in 30 days and start bidding for freelance gigs by month two.' },
      { q: 'Is hosting and domain setup taught?', a: 'Yes, DNS configuration, SSL setup, custom domains, and client CMS handoff are thoroughly covered in practical labs.' }
    ]
  },
  'creator': {
    title: 'Creator Academy — YouTube, Content Creation & Monetization | Nova Skills',
    metaDesc: 'Learn audience building, YouTube growth, viral content strategy & personal branding. Master content monetization and social media production workflows.',
    h1: 'Creator Academy: Content Strategy, YouTube & Personal Branding',
    faqs: [
      { q: 'Who is the Creator Academy designed for?', a: 'Aspiring YouTubers, influencers, business founders, and marketers looking to build a personal brand and monetize digital content.' },
      { q: 'What practical skills will I develop?', a: 'Scriptwriting, smartphone & camera cinematography, lighting setup, thumbnail design psychology, YouTube SEO, and brand collaboration pitching.' },
      { q: 'Do you cover monetization strategies?', a: 'Yes, AdSense, affiliate marketing, digital product sales, sponsorships, and agency retainer models are covered in detail.' }
    ]
  },
  'communication': {
    title: 'Communication Academy — Business English & Interview Skills | Nova Skills',
    metaDesc: 'Boost your career with fluent business English, corporate communication, public speaking, and job interview mastery. Practical confidence training.',
    h1: 'Communication Academy: Business English, Public Speaking & Career Confidence',
    faqs: [
      { q: 'How will this academy improve my spoken English?', a: 'Through daily interactive speaking drills, vocabulary expansion sessions, impromptu speeches, and real-time pronunciation corrections.' },
      { q: 'Is corporate email and memo writing included?', a: 'Yes, you will master professional email etiquette, executive presentation design, and cross-cultural business communication.' },
      { q: 'Do you conduct mock job interviews?', a: 'Yes, every student undergoes simulated HR and managerial interview rounds with feedback on tone, body language, and answer structuring.' }
    ]
  },
  'office-productivity': {
    title: 'Office Productivity Academy — Advanced Excel, MIS & AI Tools | Nova Skills',
    metaDesc: 'Master Advanced Excel, Google Sheets, MIS reporting, PowerPoint presentations, and AI productivity tools for high-efficiency office and corporate work.',
    h1: 'Office Productivity Academy: Advanced Excel, MIS & Workplace Tools',
    faqs: [
      { q: 'What level of Excel is covered?', a: 'From foundational formulas (VLOOKUP, XLOOKUP, INDEX/MATCH) to dynamic arrays, Pivot Tables, interactive dashboards, Power Query, and basic VBA/Macros.' },
      { q: 'How are AI tools integrated into office work?', a: 'You learn how to use ChatGPT and Microsoft Copilot to automate formula generation, summarize long spreadsheets, and draft slide decks in seconds.' },
      { q: 'Is this suitable for working professionals?', a: 'Yes, weekend and evening batch options are specifically tailored for working professionals looking to increase productivity and get promoted.' }
    ]
  },
  'career-freelancing': {
    title: 'Career & Freelancing Academy — Upwork, Fiverr & Agency Growth | Nova Skills',
    metaDesc: 'Learn how to get high-paying freelance clients on Upwork, Fiverr, and LinkedIn. Master international client pitching, proposals, pricing, and scaling.',
    h1: 'Career & Freelancing Academy: High-Income Client Acquisition & Agency Growth',
    faqs: [
      { q: 'How does this academy help me earn online?', a: 'We teach you how to build a 5-star profile on Upwork and Fiverr, write winning proposals, conduct client discovery calls, and receive international payments.' },
      { q: 'Can I scale from a solo freelancer to an agency?', a: 'Yes, our advanced modules cover hiring subcontractors, SOP development, client retainer contracts, and agency project management.' },
      { q: 'Do you review my proposals before sending?', a: 'Yes, our freelance mentors provide personalized feedback on your initial client proposals to maximize response rates.' }
    ]
  }
};

function normalizeProgramLevel(level) {
  if (!level) return '';
  const str = String(level).trim().toLowerCase();
  if (str.includes('career')) return 'Career Program';
  if (str.includes('cert')) return 'Certification Course';
  if (str.includes('professional') || str.includes('pro')) return 'Professional Program';
  return level;
}

function renderAcademyCourseMediaHtml(course, bannerIconHtml) {
  const rec = course && course.images && course.images.card ? course.images.card : null;
  if (!rec) {
    return {
      wrapperClass: '',
      bgClass: '',
      innerHtml: bannerIconHtml
    };
  }
  return {
    wrapperClass: ' has-course-visual',
    bgClass: ' has-course-visual',
    innerHtml: `<picture class="course-thumb-picture"><source media="(min-width: 768px)" srcset="${escapeHTML(rec.desktop)}" type="${escapeHTML(rec.mimeType || 'image/webp')}" width="${rec.width || 800}" height="${rec.height || 600}" /><img src="${escapeHTML(rec.mobile)}" alt="${escapeHTML(rec.alt || course.name)}" class="course-thumb-img" width="${rec.mobileWidth || 600}" height="${rec.mobileHeight || 450}" loading="lazy" decoding="async" /></picture>`
  };
}

function buildCourseCardHTML(course, extraClass = '') {
  const safeName = (course.name || '').replace(/'/g, "\\'");
  const safeAcademy = (course.academy || '').replace(/'/g, "\\'");
  const safeDuration = course.duration || '';
  const safePrice = `₹${(course.price || 0).toLocaleString('en-IN')}`;
  const safeId = course.id;
  const isFeatured = course.featured || (course.tags && course.tags.includes('popular'));
  const projectLabel = NovaCourseData.getCourseProjectLabel(course);
  const rating = course.rating || 4.8;
  const reviews = course.reviews || 120;
  const normLevel = normalizeProgramLevel(course.programLevel || course.level);
  const courseUrl = NovaCourseData.getCourseDetailUrl(course);

  let trackClass = 'track-cert';
  const progLevel = course.programLevel || normLevel || 'Certification Course';
  if (progLevel.includes('Career')) trackClass = 'track-career';
  else if (progLevel.includes('Professional')) trackClass = 'track-pro';

  const toolsHTML = (course.tools && course.tools.length > 0)
    ? `<div class="course-tools-preview"><span class="tools-label">Key Tools:</span><div class="tools-tag-list">${course.tools.slice(0, 3).map(t => `<span class="tool-tag">${t}</span>`).join(' ')}</div></div>`
    : '';

  const cardMedia = renderAcademyCourseMediaHtml(course, renderCourseIcon(course.icon || course));

  return `
    <div class="course-card ${extraClass}" data-category="${course.academyId}" data-level="${normLevel}" data-title="${(course.name || '').replace(/"/g, '&quot;')}" data-desc="${(course.shortDesc || '').replace(/"/g, '&quot;')}">
      ${isFeatured ? '<span class="course-hot-tag">🔥 Popular</span>' : ''}
      <div class="course-thumbnail${cardMedia.wrapperClass}">
        <div class="course-thumb-bg${cardMedia.bgClass}" style="background:${course.color || 'linear-gradient(135deg, #0599a8, #011731)'}">
          ${cardMedia.innerHtml}
        </div>
        <div class="course-badge-overlay">
          <span class="course-level-badge">${normLevel || course.level || 'All Levels'}</span>
        </div>
        <div class="course-duration-badge">⏱️ ${course.duration || 'Flexible'}</div>
      </div>
      <div class="course-body">
        <div class="course-meta-header">
          <div class="course-academy-tag">${renderAcademyTagHtml(course.academyId || course.academy || acad.name)}</div>
          <span class="course-track-pill ${trackClass}">${progLevel}</span>
        </div>
        <h3 class="course-title"><a href="${courseUrl}">${course.name}</a></h3>
        <p class="course-desc">${course.shortDesc || course.description || ''}</p>
        ${toolsHTML}
        <div class="course-features">
          <span class="feature-item">💻 ${projectLabel}</span>
          <span class="feature-item">📜 Verified Certificate</span>
          ${course.placementSupport ? '<span class="feature-item" style="color:var(--green); font-weight:700;">🎯 Placement Support</span>' : '<span class="feature-item">💼 Capstone Portfolio</span>'}
          <span class="feature-item">⭐ ${rating} (${reviews})</span>
        </div>
        <div class="course-footer course-footer-stack">
          ${isCourseDemoEligible(course) ? `
          <div class="course-demo-indicator">
            <button type="button" class="course-demo-chip" onclick="if(typeof openDemoModal==='function'){openDemoModal({courseId:'${safeId}', courseName:'${safeName}', academyName:'${safeAcademy}', sourceCta:'academy_card_demo'});}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="m9 16 2 2 4-4"></path></svg>
              <span class="demo-chip-text">2-Day Free Demo Available</span>
            </button>
          </div>` : ''}
          <div class="course-pricing course-pricing-row">
            <div>
              <span class="price-current">₹${(course.price || 0).toLocaleString('en-IN')}</span>
              ${(course.originalPrice && course.originalPrice > course.price) ? `<span class="price-original">₹${(course.originalPrice || 0).toLocaleString('en-IN')}</span>` : ''}
            </div>
            ${(course.originalPrice && course.originalPrice > course.price) ? `<span class="price-off">${Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF</span>` : ''}
          </div>
          <div class="course-card-actions">
            <a href="${courseUrl}" class="btn btn-outline btn-sm">View Syllabus</a>
            <button type="button" class="btn btn-primary btn-sm" onclick="openEnrollmentModal('${safeName}', '${safeAcademy}', '${safeDuration}', '${safePrice}', '${safeId}')">Enroll Now →</button>
          </div>
        </div>
      </div>
    </div>`;
}

function getSmartRelatedAcademies(currentSlug) {
  const smartMap = {
    'digital-marketing': ['ai', 'creator', 'no-code-web', 'communication'],
    'ai': ['programming', 'digital-marketing', 'no-code-web', '3d'],
    'design': ['video-motion', 'creator', '3d', 'no-code-web'],
    'programming': ['ai', 'no-code-web', '3d', 'office-productivity'],
    'no-code-web': ['digital-marketing', 'programming', 'design', 'ai'],
    'video-motion': ['creator', 'design', '3d', 'digital-marketing'],
    '3d': ['design', 'video-motion', 'programming', 'ai'],
    'career-freelancing': ['communication', 'office-productivity', 'digital-marketing', 'ai'],
    'communication': ['career-freelancing', 'office-productivity', 'digital-marketing', 'creator'],
    'kids-tech': ['programming', 'ai', 'design', 'video-motion'],
    'creator': ['video-motion', 'digital-marketing', 'design', 'communication'],
    'office-productivity': ['communication', 'career-freelancing', 'digital-marketing', 'programming']
  };

  const targetSlugs = smartMap[currentSlug] || ['ai', 'digital-marketing', 'design', 'programming'];
  return targetSlugs
    .map(slug => ACADEMIES_LIST.find(a => a.slug === slug || a.id === slug))
    .filter(Boolean)
    .slice(0, 4);
}

function generateAcademySectionsHTML(academy, academyCourses, seoData) {
  const slug = academy.id || academy.slug || '';
  const careerCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel || c.level) === 'Career Program');
  const proCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel || c.level) === 'Professional Program');
  const certCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel || c.level) === 'Certification Course');
  const totalCourses = academyCourses.length;

  const faqs = (seoData && seoData.faqs && seoData.faqs.length > 0) ? seoData.faqs : [
    { q: `What courses are offered in ${academy.name}?`, a: `We offer ${totalCourses} practical, job-ready programs ranging from foundational certifications to 6-month career mastery tracks.` },
    { q: "Are courses available in online and offline classroom modes?", a: "Yes, we offer both in-person classroom training at our Siddharth Nagar campus and live interactive online batches across India." },
    { q: "Do you provide placement assistance?", a: "Yes, our career and professional programs include dedicated placement assistance, resume preparation, and mock interviews." },
    { q: "Will I receive an industry certificate upon completion?", a: "Yes, every graduate receives an official Nova Skills Certificate of Completion along with verified portfolio projects." }
  ];

  let html = '';

  // 1. Overview & Outcomes
  html += `
    <section class="section-academy-overview" style="padding: 72px 0; background: #ffffff; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <span class="section-tag" style="background: rgba(1, 23, 49, 0.08); color: #011731;">ACADEMY OVERVIEW & OUTCOMES</span>
          <h2 class="section-title">Master ${academy.name}</h2>
          <p class="section-subtitle" style="max-width: 760px; margin: 0 auto; color: #475569; font-size: 1.05rem;">
            ${academy.description} Our curriculum combines hands-on live project labs, code/design critiques, and industry-standard commercial tools.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 32px; border-radius: 18px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px;">
              <span style="font-size:1.8rem; background:rgba(5,153,168,0.1); width:48px; height:48px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; color:#0599a8;">🏆</span>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #011731; margin: 0;">Industry Benefits</h3>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
              <li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#0599a8; font-weight:800;">✓</span> <span>100% Practical Training on Real Projects</span></li>
              <li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#0599a8; font-weight:800;">✓</span> <span>Live Mentor Guidance & Code/Design Reviews</span></li>
              <li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#0599a8; font-weight:800;">✓</span> <span>Industry-Recognized Professional Certification</span></li>
              ${slug === 'kids-tech'
                ? '<li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#0599a8; font-weight:800;">✓</span> <span>Young Creator Showcase & Safe Mentorship</span></li>'
                : '<li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#0599a8; font-weight:800;">✓</span> <span>Dedicated Placement Support & Interview Prep (Career Tracks)</span></li>'}
            </ul>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 32px; border-radius: 18px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px;">
              <span style="font-size:1.8rem; background:rgba(117,215,102,0.15); width:48px; height:48px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; color:#2e7d32;">🎯</span>
              <h3 style="font-size: 1.25rem; font-weight: 700; color: #011731; margin: 0;">Career Outcomes</h3>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
              <li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#75d766; font-weight:800;">🎯</span> <span>Build verifiable client-ready portfolio projects</span></li>
              <li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#75d766; font-weight:800;">🎯</span> <span>Gain fluent mastery in modern software & AI tools</span></li>
              <li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#75d766; font-weight:800;">🎯</span> <span>Qualify for high-demand agency and corporate roles</span></li>
              <li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#75d766; font-weight:800;">🎯</span> <span>Launch freelance services on Upwork, Fiverr & LinkedIn</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;

  // 2. Career Roadmap
  html += `
    <section class="section-career-roadmap" style="padding: 80px 0; background: #011731; color: white;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 56px;">
          <span class="section-tag" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">STRUCTURED LEARNING JOURNEY</span>
          <h2 class="section-title" style="color: white;">Visual Career Roadmap</h2>
          <p class="section-subtitle" style="color: #94a3b8; max-width: 680px; margin: 0 auto;">
            Step-by-step career progression from tool fundamentals to high-paying employment & client retainers.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; align-items: stretch;">
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">🌱</div>
            <span style="font-size: 0.75rem; background: rgba(56,189,248,0.2); color: #38bdf8; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 1</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Beginner</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Tool Orientation & Basics</p>
          </div>
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">🏛️</div>
            <span style="font-size: 0.75rem; background: rgba(5,153,168,0.2); color: #0599a8; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 2</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Foundation</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Core Concepts & Drills</p>
          </div>
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">💻</div>
            <span style="font-size: 0.75rem; background: rgba(37,99,235,0.2); color: #60a5fa; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 3</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Projects</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Real Client Case Studies</p>
          </div>
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">💼</div>
            <span style="font-size: 0.75rem; background: rgba(139,92,246,0.2); color: #c084fc; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 4</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Internship</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Agency & Live Lab</p>
          </div>
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">📜</div>
            <span style="font-size: 0.75rem; background: rgba(234,179,8,0.2); color: #facc15; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 5</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Certification</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">ISO Verified Credential</p>
          </div>
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">🎯</div>
            <span style="font-size: 0.75rem; background: rgba(16,185,129,0.2); color: #34d399; padding: 2px 8px; border-radius: 50px; font-weight: 700; display: inline-block; margin-bottom: 8px;">STEP 6</span>
            ${slug === 'kids-tech'
              ? '<h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Showcase</h4><p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Junior Portfolio & Certificate</p>'
              : '<h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Career Support</h4><p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Job Referrals & Freelance</p>'}
          </div>
          <div style="background: linear-gradient(135deg, rgba(5,153,168,0.3), rgba(117,215,102,0.3)); border: 1px solid #75d766; padding: 20px; border-radius: 14px; text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">🚀</div>
            <span style="font-size: 0.75rem; background: #75d766; color: #011731; padding: 2px 8px; border-radius: 50px; font-weight: 800; display: inline-block; margin-bottom: 8px;">GOAL</span>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Advanced Career</h4>
            <p style="font-size: 0.8rem; color: #e2e8f0; margin: 0;">Senior Lead & Scale</p>
          </div>
        </div>
      </div>
    </section>
  `;

  // 3. Career Programs
  if (careerCourses.length > 0) {
    html += `
      <section class="section-career-programs" style="padding: 72px 0; background: white; border-bottom: 1px solid #e2e8f0;">
        <div class="container">
          <div class="section-header" style="text-align: left; margin-bottom: 36px;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
              <div>
                <span class="section-tag" style="background: rgba(1, 23, 49, 0.08); color: var(--navy);">6–12 MONTH TRANSFORMATION</span>
                <h2 class="section-title" style="margin-bottom: 0;">Career Programs</h2>
              </div>
              <span style="background: rgba(5, 153, 168, 0.1); color: #0599a8; padding: 6px 16px; border-radius: 50px; font-weight: 700; font-size: 0.9rem;">
                ${careerCourses.length} ${careerCourses.length === 1 ? 'Program' : 'Programs'}
              </span>
            </div>
          </div>
          <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 24px;">
            ${careerCourses.map(c => buildCourseCardHTML(c)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // 4. Professional Programs
  if (proCourses.length > 0) {
    html += `
      <section class="section-pro-programs" style="padding: 72px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
        <div class="container">
          <div class="section-header" style="text-align: left; margin-bottom: 36px;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
              <div>
                <span class="section-tag" style="background: rgba(5, 153, 168, 0.1); color: var(--teal);">3–6 MONTH SKILL MASTERY</span>
                <h2 class="section-title" style="margin-bottom: 0;">Professional Programs</h2>
              </div>
              <span style="background: rgba(5, 153, 168, 0.1); color: #0599a8; padding: 6px 16px; border-radius: 50px; font-weight: 700; font-size: 0.9rem;">
                ${proCourses.length} ${proCourses.length === 1 ? 'Program' : 'Programs'}
              </span>
            </div>
          </div>
          <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 24px;">
            ${proCourses.map(c => buildCourseCardHTML(c)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // 5. Certification Courses
  if (certCourses.length > 0) {
    html += `
      <section class="section-cert-courses" style="padding: 72px 0; background: white; border-bottom: 1px solid #e2e8f0;">
        <div class="container">
          <div class="section-header" style="text-align: left; margin-bottom: 36px;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
              <div>
                <span class="section-tag" style="background: rgba(117, 215, 102, 0.15); color: #2e7d32;">1–2 MONTH FOCUSED SKILLS</span>
                <h2 class="section-title" style="margin-bottom: 0;">Certification Courses</h2>
              </div>
              <span style="background: rgba(5, 153, 168, 0.1); color: #0599a8; padding: 6px 16px; border-radius: 50px; font-weight: 700; font-size: 0.9rem;">
                ${certCourses.length} ${certCourses.length === 1 ? 'Course' : 'Courses'}
              </span>
            </div>
          </div>
          <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 24px;">
            ${certCourses.map(c => buildCourseCardHTML(c)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // 6. Dynamic Course Explorer
  html += `
    <section class="section-course-explorer" style="padding: 80px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <span class="section-tag">DYNAMIC COURSE EXPLORER</span>
          <h2 class="section-title">Explore All ${academy.name} Offerings</h2>
          <p class="section-subtitle">Filter programs by duration and career depth to find your ideal learning track.</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; margin-bottom: 32px; background: white; padding: 16px 20px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <button type="button" class="explorer-tab-btn" onclick="filterExplorerCourses('all', this)" style="background: #011731; color: white; border: 1px solid #011731; padding: 8px 18px; border-radius: 50px; font-weight: 700; cursor: pointer; font-size: 0.9rem;">All (${totalCourses})</button>
            <button type="button" class="explorer-tab-btn" onclick="filterExplorerCourses('Career Program', this)" style="background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 50px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">Career Programs (${careerCourses.length})</button>
            <button type="button" class="explorer-tab-btn" onclick="filterExplorerCourses('Professional Program', this)" style="background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 50px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">Professional Programs (${proCourses.length})</button>
            <button type="button" class="explorer-tab-btn" onclick="filterExplorerCourses('Certification Course', this)" style="background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 50px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">Certification Courses (${certCourses.length})</button>
          </div>
          <div style="flex: 1; max-width: 300px; min-width: 200px;">
            <input type="text" placeholder="🔍 Search courses..." onkeyup="searchExplorerCourses(this.value)" style="width: 100%; padding: 10px 16px; border-radius: 50px; border: 1px solid #cbd5e1; font-size: 0.9rem; outline: none;">
          </div>
        </div>

        <div id="explorer-courses-grid" class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 24px;">
          ${academyCourses.map(c => buildCourseCardHTML(c, 'explorer-course-item')).join('')}
        </div>
      </div>
    </section>
  `;

  // 7. FAQs
  html += `
    <section class="section-faqs" style="padding: 80px 0; background: white; border-bottom: 1px solid #e2e8f0;">
      <div class="container" style="max-width: 860px;">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <span class="section-tag">FREQUENTLY ASKED QUESTIONS</span>
          <h2 class="section-title">Got Questions? We Have Answers</h2>
          <p class="section-subtitle">Find key details about admissions, practical training, and placement support for ${academy.name}.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${faqs.map(faq => `
            <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #f8fafc;">
              <button type="button" onclick="toggleFaq(this)" style="width: 100%; padding: 20px 24px; text-align: left; background: none; border: none; font-size: 1.05rem; font-weight: 700; color: #011731; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span>${faq.q}</span>
                <span class="faq-toggle-icon" style="font-size: 1.3rem; color: #0599a8; font-weight: 800; margin-left: 12px;">+</span>
              </button>
              <div class="faq-answer-block" style="display: none; padding: 0 24px 20px; color: #475569; font-size: 0.95rem; line-height: 1.6; border-top: 1px solid #e2e8f0; background: white;">
                ${faq.a}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // 8. Related Academies
  const relatedAcademies = getSmartRelatedAcademies(academy.slug);
  if (relatedAcademies.length > 0) {
    html += `
      <section class="section-related-academies" style="padding: 80px 0; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 44px;">
            <span class="section-tag">EXPLORE SPECIALISATIONS</span>
            <h2 class="section-title">Related Skill Academies</h2>
            <p class="section-subtitle">Discover complementary academies to expand your professional career skill set.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px;">
            ${relatedAcademies.map(rel => {
              const relSlug = rel.slug || rel.id;
              return `
                <div style="background: white; border: 1px solid #e2e8f0; padding: 28px; border-radius: 16px; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="font-size: 2.8rem; margin-bottom: 12px;">${rel.icon || '🎓'}</div>
                    <h3 style="font-size: 1.2rem; font-weight: 700; color: #011731; margin-bottom: 8px;">${rel.name}</h3>
                    <p style="color: #64748b; font-size: 0.88rem; line-height: 1.5; margin-bottom: 20px;">${rel.description}</p>
                  </div>
                  <a href="/academies/${relSlug}/" class="btn btn-outline btn-sm" style="text-align: center; justify-content: center;">Explore Academy →</a>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // 9. Final CTA
  const acadNameText = academy.name.includes('Academy') ? academy.name : `${academy.name} Academy`;
  const waMsg = encodeURIComponent(`Hi Nova Skills, I am interested in your ${acadNameText}. Please help me explore the available courses and learning options.`);
  html += `
    <section class="section-final-cta" style="padding: 80px 0; background: linear-gradient(135deg, #0599a8 0%, #011731 100%); color: white; text-align: center;">
      <div class="container" style="max-width: 860px;">
        <span class="section-tag" style="background: rgba(255,255,255,0.2); color: white;">START YOUR TRANSFORMATION TODAY</span>
        <h2 style="font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; margin: 16px 0;">Ready to Become a Master in ${academy.name}?</h2>
        <p style="font-size: 1.1rem; color: #e2e8f0; margin-bottom: 32px; line-height: 1.6;">
          Speak with our senior academic counsellors today to get custom roadmap guidance, scholarship details, and reserve your seat.
        </p>

        <div style="display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; align-items: center; margin-bottom: 24px;">
          <button type="button" class="btn btn-primary btn-lg" style="background: #75d766; color: #011731; font-weight: 800;" onclick="openEnrollmentModal('', '${(academy.name || '').replace(/'/g, "\\'")}')">Enroll Now →</button>
          <button type="button" class="btn btn-outline btn-lg" style="color: white; border-color: rgba(255,255,255,0.5);" onclick="openConsultationPopup()">Free Career Counselling</button>
          <a href="https://wa.me/919695904440?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="background: #25D366; color: #ffffff; font-weight: 700; border: none;" data-academy-id="${academy.id}" data-source-component="academy_final_cta_whatsapp">💬 Chat on WhatsApp</a>
          <a href="tel:+919695904440" class="btn btn-outline btn-lg" style="color: white; border-color: rgba(255,255,255,0.7);" data-academy-id="${academy.id}" data-source-component="academy_final_cta_call">📞 Call Admissions</a>
        </div>

        <div style="display: flex; gap: 20px; justify-content: center; font-size: 0.92rem; opacity: 0.9; flex-wrap: wrap;">
          <a href="/courses" style="color: white; text-decoration: underline;">Explore All 109 Courses →</a>
          <span>•</span>
          <a href="/contact/" style="color: white; text-decoration: underline;">Contact Admissions →</a>
        </div>
      </div>
    </section>
  `;

  return html;
}

console.log('Generating pre-rendered SEO HTML files for all 12 academies...');

ACADEMIES_LIST.forEach(acad => {
  const slug = acad.slug;
  const canonicalUrl = `https://novaskills.in/academies/${slug}/`;
  const seoConfig = ACADEMIES_DATA[slug] || {};
  const pageTitle = seoConfig.title || `${acad.name} — Nova Skills Education Institute`;
  const metaDesc = seoConfig.metaDesc || `Master ${acad.name} with 100% practical training, live client projects, and placement assistance at Nova Skills Institute.`;
  const heroH1 = seoConfig.h1 || `${acad.name}: Job-Ready Practical Training & Certification`;
  const ogImage = `https://novaskills.in/public/images/seo/og-banner.png?v=2026`;

  const academyCourses = NovaCourseData.getCoursesByAcademy(acad.id);
  const careerCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel || c.level) === 'Career Program');
  const proCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel || c.level) === 'Professional Program');
  const certCourses = academyCourses.filter(c => normalizeProgramLevel(c.programLevel || c.level) === 'Certification Course');
  const totalCourses = academyCourses.length;

  // Build JSON-LD Suite
  const faqs = (seoConfig.faqs && seoConfig.faqs.length > 0) ? seoConfig.faqs : [
    { q: `What courses are offered in ${acad.name}?`, a: `We offer ${totalCourses} practical, job-ready programs ranging from foundational certifications to 6-month career mastery tracks.` },
    { q: "Are courses available in online and offline classroom modes?", a: "Yes, we offer both in-person classroom training at our Siddharth Nagar campus and live interactive online batches across India." },
    { q: "Do you provide placement assistance?", a: "Yes, our career and professional programs include dedicated placement assistance, resume preparation, and mock interviews." },
    { q: "Will I receive an industry certificate upon completion?", a: "Yes, every graduate receives an official Nova Skills Certificate of Completion along with verified portfolio projects." }
  ];

  const heroVisual = ACADEMY_HERO_VISUALS[slug];
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": pageTitle,
        "description": metaDesc,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://novaskills.in/#website",
          "name": "Nova Skills",
          "url": "https://novaskills.in/"
        }
      },
      {
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
            "name": "Academies",
            "item": "https://novaskills.in/courses"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": acad.name,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${canonicalUrl}#program`,
        "name": heroH1,
        "description": metaDesc,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Nova Skills Education Institute",
          "url": "https://novaskills.in/",
          "logo": "https://novaskills.in/public/images/seo/og-banner.png?v=2026",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Nova Skills Institute Campus",
            "addressLocality": "Siddharth Nagar",
            "addressRegion": "Uttar Pradesh",
            "postalCode": "272153",
            "addressCountry": "IN"
          }
        },
        "educationalProgramMode": "Hybrid",
        "numberOfCredits": totalCourses
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  };

  const sectionsContent = generateAcademySectionsHTML(acad, academyCourses, seoConfig);
  const safeAcademyName = (acad.name || '').replace(/'/g, "\\'");

    if (heroVisual && heroVisual.enabled) {
    schemaGraph["@graph"][0]["primaryImageOfPage"] = {
      "@id": `${canonicalUrl}#heroimage`
    };
    schemaGraph["@graph"].push({
      "@type": "ImageObject",
      "@id": `${canonicalUrl}#heroimage`,
      "url": `https://novaskills.in${heroVisual.desktopSrc}`,
      "contentUrl": `https://novaskills.in${heroVisual.desktopSrc}`,
      "name": `${acad.name} Professional Studio Workspace`,
      "description": heroVisual.alt,
      "caption": heroVisual.caption,
      "width": heroVisual.width,
      "height": heroVisual.height,
      "creator": {
        "@type": "Organization",
        "name": "Nova Skills",
        "url": "https://novaskills.in/"
      },
      "license": "https://novaskills.in/terms-and-conditions/",
      "acquireLicensePage": canonicalUrl
    });
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:site_name" content="Nova Skills">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">

  <!-- Preload Fonts -->
  <link rel="preload" href="/public/fonts/PlusJakartaSans-700.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/public/fonts/Inter-400.woff2" as="font" type="font/woff2" crossorigin>

  <style>
    :root {
      --navy: #011731;
      --teal: #0599a8;
      --green: #75d766;
    }
    body {
      margin: 0;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #f8fafc;
      color: #011731;
    }
    #ns-header {
      display: contents;
    }
    #ns-header:empty {
      display: block;
      min-height: 125px;
    }
    @media (max-width: 1024px) {
      #ns-header:empty {
        min-height: 116px;
      }
    }
${heroVisual && heroVisual.enabled ? `
    /* Hero Visual Grid & Responsive Enhancements (Phase C) */
    .academy-hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 48px;
      align-items: center;
    }
    .academy-hero-grid.hero-grid-control {
      grid-template-columns: 1fr !important;
    }
    .academy-hero-content {
      min-width: 0;
    }
    .academy-hero-visual-col {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 0;
    }
    .academy-hero-visual-frame {
      position: relative;
      width: 100%;
      max-width: 520px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px -15px rgba(1, 23, 49, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.14);
      background-color: #011731;
    }
    .academy-hero-picture {
      display: block;
      width: 100%;
    }
    .academy-hero-img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      object-position: center 20%;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .academy-hero-visual-frame:hover .academy-hero-img {
      transform: scale(1.02);
    }
    .academy-hero-visual-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px 16px;
      background: linear-gradient(180deg, transparent 0%, rgba(1, 23, 49, 0.92) 100%);
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.78rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(4px);
    }
    .academy-hero-visual-caption .caption-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #75d766;
      flex-shrink: 0;
    }
    .academy-hero-visual-caption .caption-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Academy Practical Outcome Strip (Odd IDs IMG-023..IMG-045) */
    .academy-outcome-strip {
      padding: 28px 0 8px;
      background: #f8fafc;
    }
    .academy-outcome-card {
      background: #ffffff;
      border: 1px solid rgba(5, 153, 168, 0.16);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(1, 23, 49, 0.05);
      display: grid;
      grid-template-columns: 0.92fr 1.08fr;
      align-items: center;
    }
    .academy-outcome-media {
      background: #011731;
      height: 100%;
    }
    .academy-outcome-media img {
      display: block;
      width: 100%;
      height: 100%;
      max-height: 290px;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      object-position: center 20%;
    }
    .academy-outcome-body {
      padding: 24px 32px;
    }
    .academy-outcome-tag {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #0599a8;
      background: rgba(5, 153, 168, 0.1);
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 10px;
    }
    .academy-outcome-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #011731;
      margin: 0 0 8px;
    }
    .academy-outcome-desc {
      font-size: 0.94rem;
      color: #475569;
      margin: 0;
      line-height: 1.6;
    }

    /* Tablet Responsive (641px - 1023px) */
    @media (max-width: 1023px) {
      .academy-hero-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      .academy-hero-visual-frame {
        max-width: 520px;
        margin: 0 auto;
      }
      .academy-hero-img {
        max-height: 340px;
        object-position: center 20%;
      }
      .academy-outcome-card {
        grid-template-columns: 1fr;
      }
      .academy-outcome-body {
        padding: 20px 22px;
      }
    }

    /* Mobile Responsive (<= 640px) */
    @media (max-width: 640px) {
      .academy-hero-grid {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .academy-hero-visual-frame {
        max-width: 100%;
        border-radius: 12px;
        margin-top: 4px;
      }
      .academy-hero-img {
        max-height: 290px;
        aspect-ratio: 4 / 5;
        object-position: center 20%;
      }
      .academy-hero-visual-caption {
        font-size: 0.72rem;
        padding: 6px 12px;
      }
    }
` : ''}    .academy-hero-section {
      background: linear-gradient(135deg, #011731 0%, #0599a8 100%);
      color: white;
      padding: 60px 0 80px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .breadcrumb {
      display: flex;
      gap: 8px;
      font-size: 0.9rem;
      color: rgba(255,255,255,0.7);
      margin-bottom: 24px;
    }
    .breadcrumb a {
      color: rgba(255,255,255,0.9);
      text-decoration: none;
    }
    .academy-hero-title {
      font-size: clamp(2.2rem, 4vw, 3.5rem);
      font-weight: 800;
      margin: 0 0 16px;
    }
    .academy-hero-desc {
      font-size: 1.15rem;
      max-width: 720px;
      line-height: 1.6;
      color: rgba(255,255,255,0.9);
      margin-bottom: 28px;
    }
    .academy-stats-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 32px;
    }
    .stats-pill {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.25);
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      border: none;
      cursor: pointer;
    }
    .btn-primary {
      background: #75d766;
      color: #011731;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid currentColor;
    }
    /* Academy Hero Action CTAs — Enforce Single Horizontal Row */
    .academy-hero-section .academy-actions {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      align-items: center !important;
      gap: 14px !important;
      width: 100% !important;
      max-width: 440px !important;
      box-sizing: border-box !important;
      margin-top: 4px !important;
    }
    .academy-hero-section .academy-actions .btn {
      flex: 1 1 0 !important;
      min-width: 0 !important;
      height: 48px !important;
      min-height: 48px !important;
      padding: 0 20px !important;
      font-size: 0.95rem !important;
      font-weight: 700 !important;
      white-space: nowrap !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      box-sizing: border-box !important;
      border-radius: 9999px !important;
      transition: all 0.2s ease !important;
    }
    .academy-hero-section .academy-actions .btn-primary {
      background: #75d766 !important;
      color: #011731 !important;
      border: none !important;
    }
    .academy-hero-section .academy-actions .btn-outline {
      background: transparent !important;
      color: #ffffff !important;
      border: 1.5px solid rgba(255, 255, 255, 0.45) !important;
    }
    .academy-hero-section .academy-actions .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(117, 215, 102, 0.4) !important;
    }
    .academy-hero-section .academy-actions .btn-outline:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.8) !important;
      transform: translateY(-2px);
    }
    .academy-hero-section .academy-actions .btn:focus-visible {
      outline: 2px solid #75d766 !important;
      outline-offset: 2px !important;
    }
    @media (max-width: 768px) {
      .academy-hero-section .academy-actions {
        gap: 10px !important;
        max-width: 100% !important;
      }
      .academy-hero-section .academy-actions .btn {
        padding: 0 12px !important;
        font-size: 0.875rem !important;
        height: 46px !important;
        min-height: 46px !important;
      }
    }
    @media (max-width: 480px) {
      .academy-hero-section .academy-actions {
        gap: 8px !important;
      }
      .academy-hero-section .academy-actions .btn {
        padding: 0 8px !important;
        font-size: 0.85rem !important;
        height: 44px !important;
        min-height: 44px !important;
        letter-spacing: -0.01em !important;
      }
    }
    @media (max-width: 360px) {
      .academy-hero-section .container {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      .academy-hero-section .academy-actions {
        gap: 6px !important;
      }
      .academy-hero-section .academy-actions .btn {
        padding: 0 4px !important;
        font-size: 0.775rem !important;
        height: 44px !important;
        min-height: 44px !important;
        letter-spacing: -0.02em !important;
      }
    }
    /* Critical Above-the-fold Demo Banner Styles */
    .academy-demo-banner, .academy-demo-strip {
      background: linear-gradient(135deg, #EAF3F8 0%, #FFFFFF 100%);
      border-top: 1px solid rgba(5,153,168,0.22);
      border-bottom: 1px solid #d0e2ee;
      padding: 24px 0;
      color: #011731;
      box-sizing: border-box;
    }
    .academy-demo-banner .container, .academy-demo-strip-container, .academy-demo-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      box-sizing: border-box;
    }
    .academy-demo-lead {
      flex: 0 1 340px;
      min-width: 260px;
      box-sizing: border-box;
    }
    .academy-demo-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #004672;
      background: rgba(0,70,114,0.08);
      border: 1px solid rgba(0,70,114,0.15);
      padding: 3px 10px;
      border-radius: 4px;
      margin-bottom: 6px;
      line-height: 1.25;
    }
    .academy-demo-heading {
      font-size: 1.25rem;
      font-weight: 800;
      color: #012B46;
      line-height: 1.28;
      margin: 0;
      letter-spacing: -0.015em;
    }
    .academy-demo-benefits {
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1 1 auto;
      justify-content: center;
      box-sizing: border-box;
    }
    .academy-demo-benefit {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1 1 240px;
      max-width: 320px;
      box-sizing: border-box;
    }
    .academy-demo-benefit-icon {
      width: 42px !important;
      height: 42px !important;
      min-width: 42px !important;
      max-width: 42px !important;
      min-height: 42px !important;
      max-height: 42px !important;
      border-radius: 10px;
      background: rgba(5,153,168,0.12);
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #0599a8 !important;
      stroke: #0599a8 !important;
      flex-shrink: 0 !important;
      flex-grow: 0 !important;
      box-sizing: border-box !important;
      overflow: hidden;
    }
    .academy-demo-benefit-icon svg {
      width: 22px !important;
      height: 22px !important;
      min-width: 22px !important;
      max-width: 22px !important;
      min-height: 22px !important;
      max-height: 22px !important;
      color: #0599a8 !important;
      stroke: #0599a8 !important;
      stroke-width: 2;
      display: block !important;
      flex-shrink: 0 !important;
      flex-grow: 0 !important;
    }
    .academy-demo-benefit-text {
      flex: 1;
      min-width: 0;
      box-sizing: border-box;
    }
    .academy-demo-benefit-text strong {
      display: block;
      font-size: 0.9rem;
      font-weight: 700;
      color: #012B46;
      line-height: 1.25;
      margin: 0 0 2px 0;
      letter-spacing: -0.01em;
    }
    .academy-demo-benefit-text span {
      display: block;
      font-size: 0.775rem;
      color: #475569;
      line-height: 1.35;
      margin: 0;
    }
    .academy-demo-cta-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      box-sizing: border-box;
    }
    .academy-demo-btn {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      min-height: 48px !important;
      padding: 13px 24px !important;
      background: linear-gradient(135deg, #012B46 0%, #004672 100%) !important;
      color: #FFFFFF !important;
      font-family: inherit !important;
      font-weight: 700 !important;
      font-size: 0.9375rem !important;
      letter-spacing: 0.01em !important;
      border-radius: 10px !important;
      border: 1px solid rgba(255,255,255,0.15) !important;
      cursor: pointer !important;
      white-space: nowrap !important;
      box-shadow: 0 4px 14px rgba(1,43,70,0.22) !important;
      transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease !important;
      box-sizing: border-box !important;
      text-decoration: none !important;
    }
    .academy-demo-btn:hover, .academy-demo-btn:focus-visible {
      background: linear-gradient(135deg, #003658 0%, #00568c 100%) !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 18px rgba(1,43,70,0.3) !important;
      outline: none !important;
    }
    .academy-demo-btn:active {
      transform: translateY(0) !important;
      box-shadow: 0 2px 8px rgba(1,43,70,0.2) !important;
    }
    .academy-demo-microcopy {
      font-size: 0.75rem;
      color: #64748B;
      font-weight: 500;
      margin-top: 6px;
      text-align: center;
      white-space: nowrap;
      line-height: 1.3;
    }
    @media (max-width: 1199px) {
      .academy-demo-container, .academy-demo-strip-container {
        gap: 20px;
        flex-wrap: wrap;
      }
      .academy-demo-lead {
        flex: 1 1 100%;
        max-width: 100%;
      }
      .academy-demo-benefits {
        flex: 1 1 auto;
        justify-content: flex-start;
      }
      .academy-demo-cta-wrap {
        align-items: flex-start;
      }
    }
        /* Mobile & Small Tablet (< 768px) */
    @media (max-width: 768px) {
      .academy-demo-banner,
      .academy-demo-strip {
        padding: 20px 0 !important;
      }
      .academy-demo-container,
      .academy-demo-strip-container {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 16px !important;
        padding: 0 18px !important;
      }
      .academy-demo-lead {
        flex: none !important;
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
      }
      .academy-demo-badge {
        margin-bottom: 6px !important;
      }
      .academy-demo-heading {
        font-size: 1.2rem !important;
        line-height: 1.3 !important;
        margin: 0 !important;
      }
      .academy-demo-benefits {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 12px !important;
        width: 100% !important;
        flex: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .academy-demo-benefit {
        flex: none !important;
        height: auto !important;
        min-height: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        gap: 12px !important;
        background: rgba(255, 255, 255, 0.72) !important;
        border: 1px solid rgba(5, 153, 168, 0.18) !important;
        border-radius: 12px !important;
        padding: 12px 14px !important;
        box-sizing: border-box !important;
      }
      .academy-demo-benefit-icon {
        width: 40px !important;
        height: 40px !important;
        min-width: 40px !important;
        max-width: 40px !important;
        min-height: 40px !important;
        max-height: 40px !important;
        margin-top: 2px !important;
        flex-shrink: 0 !important;
        border-radius: 10px !important;
      }
      .academy-demo-benefit-icon svg {
        width: 22px !important;
        height: 22px !important;
        min-width: 22px !important;
        max-width: 22px !important;
        min-height: 22px !important;
        max-height: 22px !important;
      }
      .academy-demo-benefit-text {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .academy-demo-benefit-text strong {
        display: block !important;
        font-size: 0.9375rem !important;
        font-weight: 700 !important;
        color: #012B46 !important;
        line-height: 1.3 !important;
        margin: 0 0 3px 0 !important;
        letter-spacing: -0.01em !important;
      }
      .academy-demo-benefit-text span {
        display: block !important;
        font-size: 0.8125rem !important;
        color: #475569 !important;
        line-height: 1.4 !important;
        margin: 0 !important;
      }
      .academy-demo-cta-wrap {
        width: 100% !important;
        align-items: stretch !important;
        flex: none !important;
        margin-top: 2px !important;
      }
      .academy-demo-btn {
        width: 100% !important;
        min-height: 48px !important;
        height: auto !important;
        padding: 13px 20px !important;
        font-size: 0.9375rem !important;
        font-weight: 700 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        white-space: normal !important;
      }
      .academy-demo-microcopy {
        white-space: normal !important;
        text-align: center !important;
        font-size: 0.75rem !important;
        color: #64748B !important;
        margin-top: 6px !important;
        line-height: 1.3 !important;
      }
    }

    /* Very Small Mobile (< 480px down to 320px) */
    @media (max-width: 480px) {
      .academy-demo-banner,
      .academy-demo-strip {
        padding: 18px 0 !important;
      }
      .academy-demo-container,
      .academy-demo-strip-container {
        padding: 0 16px !important;
        gap: 14px !important;
      }
      .academy-demo-heading {
        font-size: 1.125rem !important;
        line-height: 1.28 !important;
      }
      .academy-demo-benefits {
        gap: 10px !important;
      }
      .academy-demo-benefit {
        padding: 10px 12px !important;
        gap: 10px !important;
        border-radius: 10px !important;
      }
      .academy-demo-benefit-icon {
        width: 38px !important;
        height: 38px !important;
        min-width: 38px !important;
        max-width: 38px !important;
        min-height: 38px !important;
        max-height: 38px !important;
        border-radius: 8px !important;
        margin-top: 1px !important;
      }
      .academy-demo-benefit-icon svg {
        width: 20px !important;
        height: 20px !important;
        min-width: 20px !important;
        max-width: 20px !important;
        min-height: 20px !important;
        max-height: 20px !important;
      }
      .academy-demo-benefit-text strong {
        font-size: 0.875rem !important;
        line-height: 1.25 !important;
        margin-bottom: 2px !important;
      }
      .academy-demo-benefit-text span {
        font-size: 0.775rem !important;
        line-height: 1.35 !important;
      }
      .academy-demo-btn {
        min-height: 48px !important;
        font-size: 0.9rem !important;
        padding: 12px 18px !important;
      }
      .academy-demo-microcopy {
        font-size: 0.7rem !important;
        margin-top: 5px !important;
      }
    }
  
    /* Course Card 2-Day Free Demo Promotional Badge (Step 03 Approved Standard) */
.course-demo-indicator {
  display: block;
  width: 100%;
  margin: 10px 0 8px 0;
  box-sizing: border-box;
}

.course-demo-chip {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px !important;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  background: rgba(5, 153, 168, 0.08) !important;
  border: 1px solid rgba(5, 153, 168, 0.22) !important;
  border-radius: 6px !important;
  padding: 7px 12px !important;
  font-family: inherit !important;
  font-size: 0.8125rem !important;
  font-weight: 600 !important;
  color: #012B46 !important;
  text-align: left !important;
  line-height: 1.25 !important;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  white-space: nowrap !important;
  text-decoration: none !important;
}

.course-demo-chip:hover,
.course-demo-chip:focus-visible {
  background: rgba(5, 153, 168, 0.14) !important;
  border-color: rgba(5, 153, 168, 0.45) !important;
  color: #012B46 !important;
  transform: translateY(-1px);
  outline: none !important;
}

.course-demo-chip:active {
  transform: translateY(0);
}

.course-demo-chip svg {
  width: 15px !important;
  height: 15px !important;
  min-width: 15px !important;
  min-height: 15px !important;
  max-width: 15px !important;
  max-height: 15px !important;
  color: #0599a8 !important;
  stroke: #0599a8 !important;
  fill: none !important;
  flex-shrink: 0 !important;
  display: block !important;
}

.course-demo-chip span,
.course-demo-chip .demo-chip-text {
  flex: 1 1 auto;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #012B46 !important;
  font-weight: 600 !important;
}

/* Critical 2-Day Free Demo Modal Styles */
.demo-modal-backdrop {
  position: fixed !important;
  inset: 0 !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  height: 100dvh !important;
  z-index: 999999 !important;
  background: rgba(1, 23, 49, 0.88) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 16px !important;
  box-sizing: border-box !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
  transition: opacity 0.25s ease, visibility 0.25s ease !important;
}
.demo-modal-backdrop.open {
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
}
.demo-modal-dialog {
  background: #011731 !important;
  border: 1px solid rgba(5, 153, 168, 0.35) !important;
  border-radius: 20px !important;
  width: 100% !important;
  max-width: 580px !important;
  max-height: 90vh !important;
  max-height: 90dvh !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  position: relative !important;
  padding: 32px 28px !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6) !important;
  box-sizing: border-box !important;
  color: #ffffff !important;
  animation: demoModalPop 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
}
@keyframes demoModalPop {
  from { transform: scale(0.94); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@media (max-width: 640px) {
  .demo-modal-backdrop {
    padding: 8px !important;
    align-items: flex-end !important;
  }
  .demo-modal-dialog {
    max-height: 94vh !important;
    max-height: 94dvh !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    padding: 24px 18px !important;
  }
}
  </style>

  <link rel="stylesheet" href="/css/styles.min.css?v=2.9.0">
  <noscript><link rel="stylesheet" href="/css/styles.min.css?v=2.9.0"></noscript>

  <!-- Structured Data: JSON-LD Suite -->
  <script type="application/ld+json">
${JSON.stringify(schemaGraph, null, 2)}
  </script>
</head>
<body>

  <!-- Header Slot -->
  <div id="ns-header"></div>

  <!-- Main Content -->
  <main id="main-content">
    
    <!-- Hero Banner Section -->
    <section id="academy-hero-section" class="academy-hero-section${heroVisual && heroVisual.enabled ? ' academy-hero-with-visual' : ''}">
      <div class="container">
${heroVisual && heroVisual.enabled ? `        <div class="academy-hero-grid">
          <div class="academy-hero-content">
            <!-- Breadcrumb Navigation -->
            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span>›</span>
              <a href="/courses">Academies</a>
              <span>›</span>
              <span id="breadcrumb-selected-academy" style="color:white;">${acad.name}</span>
            </nav>

            <!-- Hero Content -->
            <div id="academy-icon-display" class="academy-icon-badge" style="font-size: 3rem; margin-bottom: 12px;">${acad.icon || '🎓'}</div>
            <h1 id="academy-name-display" class="academy-hero-title">${heroH1}</h1>
            <p id="academy-desc-display" class="academy-hero-desc">
              <span class="badge-delivery" style="display:inline-block; background:rgba(117,215,102,0.15); color:#75d766; border:1px solid rgba(117,215,102,0.3); padding:4px 12px; border-radius:50px; font-size:0.85rem; font-weight:700; margin-bottom:12px;">📍 Classroom in Siddharth Nagar • 💻 Live Interactive Online (Pan-India)</span><br>
              ${acad.description}
            </p>

            <!-- Accurate Dynamic Stats Pills -->
            <div class="academy-stats-pills" id="academy-stats-pills">
              <span id="stat-career-programs" class="stats-pill">💼 Career Programs: ${careerCourses.length}</span>
              <span id="stat-pro-programs" class="stats-pill">⚡ Professional Programs: ${proCourses.length}</span>
              <span id="stat-cert-courses" class="stats-pill">📜 Certification Courses: ${certCourses.length}</span>
              <span id="stat-total-courses" class="stats-pill">📚 Total Courses: ${totalCourses}</span>
            </div>

            <!-- Action CTAs (Enforce Single Horizontal Row) -->
            <div class="academy-actions">
              <button type="button" id="btn-enroll-now" class="btn btn-primary btn-lg" onclick="openEnrollmentModal('', '${(acad.name || '').replace(/'/g, "\\'")}')">Enroll Now →</button>
              <button type="button" id="btn-free-consultation" class="btn btn-outline btn-lg" onclick="openConsultationPopup()">Free Consultation</button>
            </div>
          </div>

          <!-- Hero Visual Column -->
          <div class="academy-hero-visual-col" id="academy-hero-visual-col">
            <div class="academy-hero-visual-frame">
              <picture class="academy-hero-picture">
                <source
                  media="(min-width: 768px)"
                  srcset="${heroVisual.desktopSrc}"
                  type="image/webp"
                  width="1600"
                  height="1000">
                <img
                  src="${heroVisual.mobileSrc}"
                  alt="${heroVisual.alt}"
                  width="900"
                  height="1125"
                  class="academy-hero-img"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  onerror="this.closest('.academy-hero-visual-col').style.display='none'">
              </picture>
              <div class="academy-hero-visual-caption">
                <span class="caption-dot"></span>
                <span class="caption-text">${heroVisual.caption}</span>
              </div>
            </div>
          </div>
        </div>` : `        <!-- Breadcrumb Navigation -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <a href="/courses">Academies</a>
          <span>›</span>
          <span id="breadcrumb-selected-academy" style="color:white;">${acad.name}</span>
        </nav>

        <!-- Hero Content -->
        <div id="academy-icon-display" class="academy-icon-badge" style="font-size: 3rem; margin-bottom: 12px;">${acad.icon || '🎓'}</div>
        <h1 id="academy-name-display" class="academy-hero-title">${heroH1}</h1>
        <p id="academy-desc-display" class="academy-hero-desc">
          <span class="badge-delivery" style="display:inline-block; background:rgba(117,215,102,0.15); color:#75d766; border:1px solid rgba(117,215,102,0.3); padding:4px 12px; border-radius:50px; font-size:0.85rem; font-weight:700; margin-bottom:12px;">📍 Classroom in Siddharth Nagar • 💻 Live Interactive Online (Pan-India)</span><br>
          ${acad.description}
        </p>

        <!-- Accurate Dynamic Stats Pills -->
        <div class="academy-stats-pills" id="academy-stats-pills">
          <span id="stat-career-programs" class="stats-pill">💼 Career Programs: ${careerCourses.length}</span>
          <span id="stat-pro-programs" class="stats-pill">⚡ Professional Programs: ${proCourses.length}</span>
          <span id="stat-cert-courses" class="stats-pill">📜 Certification Courses: ${certCourses.length}</span>
          <span id="stat-total-courses" class="stats-pill">📚 Total Courses: ${totalCourses}</span>
        </div>

        <!-- Action CTAs -->
        <div class="academy-actions">
          <button type="button" id="btn-enroll-now" class="btn btn-primary btn-lg" onclick="openEnrollmentModal('', '${(acad.name || '').replace(/'/g, "\\'")}')">Enroll Now →</button>
          <button type="button" id="btn-free-consultation" class="btn btn-outline btn-lg" onclick="openConsultationPopup()">Free Consultation</button>
        </div>`}
      </div>
    </section>

        <!-- Compact Promotional Band: 2-Day Free Demo & 1:1 Live Online Classes -->
    <section class="academy-demo-banner academy-demo-strip" aria-label="Free Demo and Personalized Online Classes">
      <div class="container academy-demo-container academy-demo-strip-container">
        <div class="academy-demo-lead">
          <span class="academy-demo-badge">EXPERIENCE BEFORE YOU ENROLL</span>
          <h2 class="academy-demo-heading">Explore Your Skills Before You Commit.</h2>
        </div>
        <div class="academy-demo-benefits">
          <div class="academy-demo-benefit">
            <div class="academy-demo-benefit-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="m9 16 2 2 4-4"></path></svg>
            </div>
            <div class="academy-demo-benefit-text">
              <strong>2 Days Free Demo Classes</strong>
              <span>Experience our practical, mentor-led teaching before enrolling.</span>
            </div>
          </div>
          <div class="academy-demo-benefit">
            <div class="academy-demo-benefit-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2"></rect></svg>
            </div>
            <div class="academy-demo-benefit-text">
              <strong>1:1 LIVE ONLINE CLASSES</strong>
              <span>Personalized live learning for eligible courses, subject to availability.</span>
            </div>
          </div>
        </div>
        <div class="academy-demo-cta-wrap">
          <button type="button" class="academy-demo-btn" onclick="if(typeof openDemoModal==='function'){openDemoModal({academyId:'${slug}', academyName:'${safeAcademyName}', sourceCta:'academy_demo_banner'});}">
            Book Your Free Demo →
          </button>
          <div class="academy-demo-microcopy">Free demo booking • No admission commitment</div>
        </div>
      </div>
    </section>

    ${heroVisual && heroVisual.outcomeId ? `<!-- Practical Skills & Workflow Preview Strip (${heroVisual.outcomeId}) -->
    <section class="academy-outcome-strip" aria-label="Academy curriculum workflow preview">
      <div class="container">
        <div class="academy-outcome-card">
          <div class="academy-outcome-media">
            <picture>
              <source media="(min-width: 768px)" srcset="/public/assets/nova-images/desktop/${heroVisual.outcomeId}.webp" type="image/webp" width="1400" height="1050">
              <img src="/public/assets/nova-images/mobile/${heroVisual.outcomeId}.webp" alt="${heroVisual.outcomeAlt}" width="900" height="675" loading="lazy" decoding="async">
            </picture>
          </div>
          <div class="academy-outcome-body">
            <span class="academy-outcome-tag">${heroVisual.outcomeTag}</span>
            <h2 class="academy-outcome-title">${heroVisual.outcomeTitle}</h2>
            <p class="academy-outcome-desc">${heroVisual.outcomeDesc}</p>
          </div>
        </div>
      </div>
    </section>
` : ''}
    <!-- Pre-rendered Semantic Academy Programs & Course Sections -->
    <div id="academy-sections-container" data-prerendered="true">
${sectionsContent}
    </div>

    <!-- 404 Academy Container (Populated via JS only on invalid route) -->
    <section id="academy-404-container" class="academy-404-container" style="display:none;"></section>

  </main>

  <!-- Footer Slot -->
  <div id="ns-footer"></div>

  <!-- JavaScript Bundles -->
  <script src="/js/data.min.js?v=3.1.0" defer></script>
  <script src="/js/components.min.js?v=3.1.0" defer></script>
  <script src="/nova-ai-widget.js?v=3.1.0" defer></script>
  <script src="/js/icon-system.js" defer></script>
  <script src="/js/academy-detail.min.js?v=3.1.0" defer></script>${heroVisual && heroVisual.enabled ? `\n  <script src="/js/academy-hero-experiment.js?v=1.0" defer></script>` : ''}
</body>
</html>
`;

  const targetDir = path.join(rootDir, 'academies', slug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, htmlContent, 'utf8');
  console.log(`✅ Pre-rendered static SEO academy page: academies/${slug}/index.html (${totalCourses} courses)`);
});

console.log('🎉 All 12 individual academy pages built with pre-rendered course cards, links, and real counts.');
