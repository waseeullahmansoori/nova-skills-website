/**
 * Nova Skills Pilot City Pages Pre-renderer
 * Phase 04 — Compiles Indore, Jaipur, Rajkot, and Patna City Pages
 * 
 * Rules:
 * - Exactly 4 compulsory courses + 3 approved additional courses per page (7 courses total).
 * - Genuine editorial differentiation across all 4 pilot cities.
 * - Single source of truth: resolves all pricing, duration, and curricula from data.js.
 * - Full 13-section architecture satisfying E-E-A-T, AEO, GEO, and CRO standards.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const {
  getLocationBySlug,
  resolveCoursesForLocation
} = require('../lib/locations');

const ROOT_DIR = path.resolve(__dirname, '..');

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const PILOT_CONFIGS = [
  {
    slug: 'indore',
    title: 'Online Professional Courses in Indore | Nova Skills',
    metaDesc: 'Explore live online professional courses for Indore learners in Full Stack Web Development, Business Intelligence, Digital Marketing, and UI/UX Design.',
    headline: 'Build Technical Skills That Work Together.',
    heroSubtitle: 'Explore live online professional training in Digital Marketing, Graphic Design, Video Editing, and AI, alongside software development, business intelligence, and UI/UX design pathways.',
    editorialTag: 'Technology, Design & Data Pathways',
    decisionHeading: 'Choose Your Technical Direction',
    decisionSubtitle: 'Compare the three core technical tracks available to learners in Indore based on your career interests.',
    decisionTabs: [
      {
        id: 'tab-dev',
        label: '1. Web & Software Development',
        title: 'AI-Assisted Full Stack Web Development',
        desc: 'Focus on building interactive web applications, scalable client architectures, and server APIs using modern JavaScript, React, Node.js, and generative AI coding assistants.',
        focus: 'Frontend & Backend Engineering',
        tools: 'React, Node.js, MongoDB, GitHub, AI Assistants',
        duration: '8 Months (160+ Guided Hours)',
        outcome: '3 Live Enterprise Web Applications',
        courseId: 'ai-assisted-full-stack-web-development'
      },
      {
        id: 'tab-data',
        label: '2. Business Intelligence & Data',
        title: 'MIS & Business Intelligence Professional',
        desc: 'Focus on organizing, analyzing, and transforming corporate raw data into automated executive dashboards, financial forecasts, and KPI tracking models.',
        focus: 'Enterprise Reporting & Automation',
        tools: 'Power BI, Advanced Excel, SQL, Tableau, DAX',
        duration: '6 Months (120+ Guided Hours)',
        outcome: '1 Corporate BI Intelligence Capstone',
        courseId: 'biz-productivity'
      },
      {
        id: 'tab-design',
        label: '3. UI/UX Interface Design',
        title: 'UI/UX Design Professional',
        desc: 'Focus on user research, user journey mapping, high-fidelity wireframing, component design systems, and mobile app prototyping.',
        focus: 'Product & Interaction Design',
        tools: 'Figma, FigJam, Miro, Prototype Labs',
        duration: '5 Months (100+ Guided Hours)',
        outcome: '5 Full-Stack UX Design Case Studies',
        courseId: 'uiux-design-pro'
      }
    ]
  },
  {
    slug: 'jaipur',
    title: 'Graphic Design & Online Professional Courses in Jaipur | Nova Skills',
    metaDesc: 'Master creative digital skills in Jaipur with live online training in Creative Design, UI/UX Design, Video Editing, Content Production, and AI workflows.',
    headline: 'Turn Creative Thinking Into Practical Skills.',
    heroSubtitle: 'Explore professional online learning in design, digital marketing, video editing, and AI, with specialized pathways in creative design, UI/UX, and content creation.',
    editorialTag: 'Creative Skills, Design & Content Production',
    decisionHeading: 'Explore Three Creative Directions',
    decisionSubtitle: 'Distinguish visual brand communication, product interface design, and digital content production workflows.',
    decisionTabs: [
      {
        id: 'tab-creative',
        label: '1. Brand & Visual Design',
        title: 'Creative Design Master',
        desc: 'Master commercial advertising design, corporate brand identity kits, vector typography, packaging design, and high-impact visual campaigns.',
        focus: 'Brand Identity & Commercial Art',
        tools: 'Adobe Photoshop, Illustrator, InDesign, Midjourney',
        duration: '6 Months (140+ Guided Hours)',
        outcome: 'Comprehensive 8-Part Creative Brand Portfolio',
        courseId: 'creative-design'
      },
      {
        id: 'tab-uiux',
        label: '2. Interface & Digital Product',
        title: 'UI/UX Design Professional',
        desc: 'Transition from graphic visuals to interactive digital experiences, usability testing, design systems, and developer handoff workflows.',
        focus: 'App Interfaces & User Experience',
        tools: 'Figma, FigJam, Micro-interactions Lab',
        duration: '5 Months (100+ Guided Hours)',
        outcome: '5 Commercial App & Web UX Case Studies',
        courseId: 'uiux-design-pro'
      },
      {
        id: 'tab-content',
        label: '3. Digital Content Production',
        title: 'Content Creator Professional',
        desc: 'Develop multi-platform video strategies, short-form reels, live studio audio, audience growth tactics, and monetization workflows.',
        focus: 'Studio Production & Creator Strategy',
        tools: 'Premiere Pro, CapCut Pro, Studio Lighting, Analytics',
        duration: '3 Months (80+ Guided Hours)',
        outcome: 'Multi-Channel Content Creator Portfolio',
        courseId: 'content-creator-pro'
      }
    ]
  },
  {
    slug: 'rajkot',
    title: 'Digital Business & Online Professional Courses in Rajkot | Nova Skills',
    metaDesc: 'Launch your digital business from Rajkot with practical live online training in E-Commerce Mastery, Brand Design, Freelancing, and Digital Marketing.',
    headline: 'Build Skills for Digital Business.',
    heroSubtitle: 'Discover live online training in Digital Marketing, Graphic Design, Video Editing, and AI, alongside e-commerce store architecture, brand design, and global client acquisition.',
    editorialTag: 'Business, Commerce & Independent Work',
    decisionHeading: 'From Digital Presence to Client Work',
    decisionSubtitle: 'Understand how digital storefronts, branding assets, and client consulting skills connect to build a sustainable digital enterprise.',
    decisionTabs: [
      {
        id: 'tab-ecom',
        label: '1. Digital Store Architecture',
        title: 'E-Commerce Website Mastery',
        desc: 'Build high-converting online stores, optimize product checkout funnels, integrate payment gateways, and configure inventory management.',
        focus: 'E-Commerce Infrastructure & Stores',
        tools: 'Shopify, WooCommerce, Stripe, Google Analytics',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '2 Fully Functional Live E-Commerce Stores',
        courseId: 'ecommerce-mastery'
      },
      {
        id: 'tab-brand',
        label: '2. Commercial Brand Design',
        title: 'Creative Design Master',
        desc: 'Create professional product packaging, commercial promotional banners, social media ad creatives, and distinctive logo marks.',
        focus: 'Commercial Packaging & Advertising',
        tools: 'Adobe Photoshop, Illustrator, InDesign',
        duration: '6 Months (140+ Guided Hours)',
        outcome: '8 Brand Commercial Design Deliverables',
        courseId: 'creative-design'
      },
      {
        id: 'tab-freelance',
        label: '3. Client Acquisition & Consulting',
        title: 'Freelancing & Client Acquisition Professional',
        desc: 'Master global freelance bidding platforms, contract negotiation, client proposal writing, international payment setups, and portfolio pitches.',
        focus: 'Independent Consulting & Contracts',
        tools: 'Upwork, Fiverr, LinkedIn B2B, Stripe Invoicing',
        duration: '2 Months (60+ Guided Hours)',
        outcome: 'Live Freelance Profile & Client Pipeline',
        courseId: 'freelancing-client-acquisition-professional'
      }
    ]
  },
  {
    slug: 'patna',
    title: 'Online Career-Focused Professional Courses in Patna | Nova Skills',
    metaDesc: 'Build career-ready skills in Patna with live online training in Full Stack Programming Foundations, Professional Spoken English, and Placement Readiness.',
    headline: 'Start With Skills. Move Forward With Confidence.',
    heroSubtitle: 'Explore professional online training and career-focused learning pathways, including programming foundations, spoken English, and placement-readiness skills.',
    editorialTag: 'Career Foundations & Professional Readiness',
    decisionHeading: 'Plan Your Learning Journey',
    decisionSubtitle: 'Choose your starting point based on your immediate career milestones and readiness goals.',
    decisionTabs: [
      {
        id: 'tab-tech',
        label: '1. Technical Coding Foundation',
        title: 'Full Stack Programming Foundation',
        desc: 'Learn core programming logic, algorithms, HTML5/CSS3 semantics, basic JavaScript, and software development methodologies from absolute zero.',
        focus: 'Foundational Coding & Logic',
        tools: 'JavaScript, VS Code, Git, HTML5, CSS3',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '3 Beginner-to-Intermediate Web Projects',
        courseId: 'fullstack-foundation'
      },
      {
        id: 'tab-comm',
        label: '2. Workplace Communication',
        title: 'Professional Spoken English',
        desc: 'Overcome hesitation, master corporate email drafting, participate actively in meetings, and build fluent business English speaking skills.',
        focus: 'Fluency & Corporate Communication',
        tools: 'Speech Labs, Presentation Workshops, Grammar Tools',
        duration: '3 Months (70+ Guided Hours)',
        outcome: 'Fluent Presentation & Interview Speaking Portfolio',
        courseId: 'spoken-english-pro'
      },
      {
        id: 'tab-career',
        label: '3. Career Launch & Placement',
        title: 'Career Launch & Placement Readiness Professional',
        desc: 'Engineer ATS-compliant resumes, master technical and HR mock interview simulations, build an optimized LinkedIn presence, and learn salary negotiation.',
        focus: 'Interview Mastery & Job Search',
        tools: 'ATS Resume Tools, LinkedIn Talent, Mock Panels',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified ATS Resume & Mock Interview Scorecard',
        courseId: 'career-launch-placement-readiness-professional'
      }
    ]
  }
];

function generateCityHtml(config) {
  const loc = getLocationBySlug(config.slug);
  if (!loc) throw new Error('Location not found in registry: ' + config.slug);

  const courseData = resolveCoursesForLocation(config.slug);
  const coreCourses = courseData.coreCourses;
  const additionalCourses = courseData.additionalCourses;
  const allCourses = courseData.allCourses;

  // 1. Generate Course Cards HTML
  function renderCourseCard(course, roleLabel) {
    return `
          <!-- Course Card: ${escapeHtml(course.title)} -->
          <article class="city-course-card">
            <div class="city-card-badge-row">
              <span class="city-badge-academy">${escapeHtml(course.academyName)}</span>
              <span class="city-badge-type">${escapeHtml(roleLabel)}</span>
            </div>
            <h3 class="city-card-title">${escapeHtml(course.title)}</h3>
            <p class="city-card-desc">${escapeHtml(course.shortDescription)}</p>
            <div class="city-card-specs-row">
              <span>⏱ ${escapeHtml(course.duration)}</span>
              <span>•</span>
              <span>📂 ${course.modulesCount} Modules</span>
              
            </div>
            <div class="city-card-price-row">
              <div>
                <span class="city-price-label">Launch Fee:</span>
                <span class="city-price-current">₹${course.pricing.launchPrice.toLocaleString('en-IN')}</span>
              </div>
              ${course.pricing.offerActive ? `<span class="city-price-original">₹${course.pricing.regularPrice.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <div class="city-card-actions">
              <a href="${course.canonicalUrl}" class="city-card-btn-syllabus">Syllabus →</a>
              <button type="button" class="city-card-btn-demo" onclick="window.openCityCourseDemo('${escapeHtml(course.id)}', '${escapeHtml(course.title)}')">Free Demo</button>
            </div>
          </article>`;
  }

  const coreCardsHtml = coreCourses.map(c => renderCourseCard(c, 'Compulsory Professional')).join('\n');
  const additionalCardsHtml = additionalCourses.map(c => renderCourseCard(c, 'Featured Pathway')).join('\n');

  // 2. Decision Explorer Tabs & Panels
  const tabsNavHtml = config.decisionTabs.map((t, idx) => {
    return `<button type="button" class="city-decision-tab-btn ${idx === 0 ? 'active' : ''}" data-tab="${escapeHtml(t.id)}">${escapeHtml(t.label)}</button>`;
  }).join('\n            ');

  const panelsHtml = config.decisionTabs.map((t, idx) => {
    return `
          <!-- Decision Panel: ${escapeHtml(t.id)} -->
          <div class="city-decision-panel ${idx === 0 ? 'active' : ''}" id="${escapeHtml(t.id)}">
            <div class="city-panel-grid">
              <div>
                <h3 class="city-panel-title">${escapeHtml(t.title)}</h3>
                <p class="city-panel-desc">${escapeHtml(t.desc)}</p>
                <div style="display: flex; gap: 12px; margin-top: 20px;">
                  <button type="button" class="city-btn city-btn-primary" onclick="window.openCityCourseDemo('${escapeHtml(t.courseId)}', '${escapeHtml(t.title)}')">Book Free Demo</button>
                  <a href="/course-detail.html?id=${escapeHtml(t.courseId)}" class="city-btn city-btn-secondary" style="color: var(--city-primary); border-color: var(--city-primary); background: transparent;">View Curriculum</a>
                </div>
              </div>
              <div class="city-panel-specs-box">
                <div class="city-panel-spec-row">
                  <span class="city-panel-spec-label">Primary Focus:</span>
                  <span class="city-panel-spec-val">${escapeHtml(t.focus)}</span>
                </div>
                <div class="city-panel-spec-row">
                  <span class="city-panel-spec-label">Tools &amp; Tech:</span>
                  <span class="city-panel-spec-val">${escapeHtml(t.tools)}</span>
                </div>
                <div class="city-panel-spec-row">
                  <span class="city-panel-spec-label">Program Duration:</span>
                  <span class="city-panel-spec-val">${escapeHtml(t.duration)}</span>
                </div>
                <div class="city-panel-spec-row">
                  <span class="city-panel-spec-label">Practical Outcome:</span>
                  <span class="city-panel-spec-val">${escapeHtml(t.outcome)}</span>
                </div>
              </div>
            </div>
          </div>`;
  }).join('\n');

  // 3. Comparison Table Rows
  const tableRowsHtml = allCourses.map(c => {
    return `
              <tr>
                <td>
                  <span class="city-table-course-title">${escapeHtml(c.title)}</span>
                  <small style="color: var(--city-text-muted);">${escapeHtml(c.academyName)}</small>
                </td>
                <td>${escapeHtml(c.duration)}</td>
                <td>${c.modulesCount} Modules</td>
                <td><strong>₹${c.pricing.launchPrice.toLocaleString('en-IN')}</strong></td>
                <td>
                  <button type="button" class="city-card-btn-demo" style="height: 36px; padding: 6px 14px; font-size: 0.75rem;" onclick="window.openCityCourseDemo('${escapeHtml(c.id)}', '${escapeHtml(c.title)}')">Demo</button>
                </td>
              </tr>`;
  }).join('\n');

  // 4. Tools Highlights
  const toolsList = Array.from(new Set(allCourses.flatMap(c => c.softwareCovered))).slice(0, 16);
  const toolPillsHtml = toolsList.map(tool => `<span class="city-tool-pill">${escapeHtml(tool)}</span>`).join('\n              ');

  // 5. JSON-LD Schema
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://novaskills.in/branches/${loc.slug}/#webpage`,
        "url": `https://novaskills.in/branches/${loc.slug}/`,
        "name": config.title,
        "description": config.metaDesc,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://novaskills.in/#website",
          "name": "Nova Skills",
          "url": "https://novaskills.in/"
        }
      },
      {
        "@type": "BreadcrumbList",
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
            "name": "Learning Locations",
            "item": "https://novaskills.in/branches/"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": loc.city,
            "item": `https://novaskills.in/branches/${loc.slug}/`
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": `Featured Professional Courses in ${loc.city}`,
        "numberOfItems": allCourses.length,
        "itemListElement": allCourses.map((c, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": c.title,
          "description": c.shortDescription
        }))
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-9WN9N2KF12"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9WN9N2KF12');
  </script>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(config.title)}</title>
  <meta name="description" content="${escapeHtml(config.metaDesc)}" />
  <link rel="canonical" href="https://novaskills.in/branches/${loc.slug}/" />
  
  <!-- Indexing Guard: Preview mode until full production release signoff -->
  <meta name="robots" content="noindex, follow" />

  <!-- OpenGraph Metadata -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Nova Skills" />
  <meta property="og:url" content="https://novaskills.in/branches/${loc.slug}/" />
  <meta property="og:title" content="${escapeHtml(config.title)}" />
  <meta property="og:description" content="${escapeHtml(config.metaDesc)}" />
  <meta property="og:image" content="https://novaskills.in/public/images/seo/og-banner.png?v=2026" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@novaskills_in" />
  <meta name="twitter:title" content="${escapeHtml(config.title)}" />
  <meta name="twitter:description" content="${escapeHtml(config.metaDesc)}" />
  <meta name="twitter:image" content="https://novaskills.in/public/images/seo/og-banner.png?v=2026" />

  <!-- Favicon & Fonts Preload -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="preload" href="/public/fonts/PlusJakartaSans-700.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/public/fonts/Inter-400.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Base Site Styles & Scoped City Styles -->
  <link rel="stylesheet" href="/css/styles.min.css?v=2.7.4" />
  <link rel="stylesheet" href="/css/locations-city.css" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(schemaJsonLd, null, 2)}
  </script>
</head>
<body class="city-location-page" data-city-slug="${escapeHtml(loc.slug)}" data-city-name="${escapeHtml(loc.city)}">

  <!-- Injected Header Shell -->
  <div id="ns-header"></div>

  <!-- Breadcrumbs -->
  <nav class="city-breadcrumb-wrap" aria-label="Breadcrumb">
    <div class="city-container">
      <ol class="city-breadcrumb-list">
        <li class="city-breadcrumb-item"><a href="/">Home</a></li>
        <li class="city-breadcrumb-sep">/</li>
        <li class="city-breadcrumb-item"><a href="/branches/">Branches &amp; Locations</a></li>
        <li class="city-breadcrumb-sep">/</li>
        <li class="city-breadcrumb-current" aria-current="page">${escapeHtml(loc.city)}</li>
      </ol>
    </div>
  </nav>

  <main id="main-content" class="city-page-main">

    <!-- ============================================================
         SECTION 01: HERO SECTION
         ============================================================ -->
    <section class="city-hero-section" aria-labelledby="city-hero-title">
      <div class="city-container">
        <div class="city-hero-content">
          <div class="city-hero-eyebrow">
            <span>🌐</span> NOVA SKILLS • LIVE ONLINE LEARNING • ${escapeHtml(loc.city.toUpperCase())}
          </div>
          <h1 class="city-hero-title" id="city-hero-title">
            ${escapeHtml(config.headline)}
          </h1>
          <p class="city-hero-subtitle">
            ${escapeHtml(config.heroSubtitle)}
          </p>

          <!-- Single Horizontal Row CTAs (Preserving Academy Hero Rules) -->
          <div class="city-hero-cta-row">
            <button type="button" class="city-btn city-btn-primary" onclick="window.openCityEnrollment()">
              Enroll Now →
            </button>
            <button type="button" class="city-btn city-btn-secondary" onclick="window.openCityConsultation()">
              Free Consultation
            </button>
          </div>

          <div class="city-hero-trust-badge">
            <span>💻 Live Interactive Online Classes for ${escapeHtml(loc.city)} Learners</span>
            <span>•</span>
            <span>📍 Physical Campus: Siddharth Nagar (UP)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 02: DIRECT ANSWER SUMMARY BOX (AEO / GEO / VSO)
         ============================================================ -->
    <section class="city-answer-section" aria-labelledby="answer-title">
      <div class="city-container">
        <div class="city-direct-answer-card">
          <h2 class="city-answer-heading" id="answer-title">
            <span>💡</span> Can I join Nova Skills live online courses from ${escapeHtml(loc.city)}?
          </h2>
          <p class="city-answer-text">
            <strong>Yes.</strong> Prospective students in ${escapeHtml(loc.city)} (${escapeHtml(loc.state)}) can enroll in all 7 featured professional courses via live interactive online batches. Classes feature two-way audio/video, real-time mentor code reviews, recorded lecture archives, and weekend doubt clearance. In-person physical classroom training is conducted exclusively at our official Siddharth Nagar, Uttar Pradesh campus.
          </p>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 03: FOUR MANDATORY PROFESSIONAL PROGRAMS
         ============================================================ -->
    <section class="city-container" style="padding: 70px 0 40px;" aria-labelledby="core-heading">
      <header class="city-section-header">
        <span class="city-section-tag">Core Curriculum</span>
        <h2 class="city-section-title" id="core-heading">Four Compulsory Professional Programs</h2>
        <p class="city-section-subtitle">
          The four cornerstone certification tracks available to learners in ${escapeHtml(loc.city)} with 100% practical live project portfolios.
        </p>
      </header>
      <div class="city-courses-grid">
        ${coreCardsHtml}
      </div>
    </section>

    <!-- ============================================================
         SECTION 04: THREE RECOMMENDED ADDITIONAL PROGRAMS
         ============================================================ -->
    <section class="city-container" style="padding: 40px 0 70px;" aria-labelledby="additional-heading">
      <header class="city-section-header">
        <span class="city-section-tag">${escapeHtml(config.editorialTag)}</span>
        <h2 class="city-section-title" id="additional-heading">Recommended Pathways for ${escapeHtml(loc.city)} Learners</h2>
        <p class="city-section-subtitle">
          Specialized programs selected to align with emerging industry opportunities and career advancement.
        </p>
      </header>
      <div class="city-courses-grid">
        ${additionalCardsHtml}
      </div>
    </section>

    <!-- ============================================================
         SECTION 05: UNIQUE DECISION-SUPPORT MODULE (GATES 05 - 08)
         ============================================================ -->
    <section class="city-decision-section" aria-labelledby="decision-heading">
      <div class="city-container">
        <header class="city-section-header">
          <span class="city-section-tag">Interactive Guidance</span>
          <h2 class="city-section-title" id="decision-heading">${escapeHtml(config.decisionHeading)}</h2>
          <p class="city-section-subtitle">${escapeHtml(config.decisionSubtitle)}</p>
        </header>

        <!-- Tabs Nav -->
        <div class="city-decision-tabs" role="tablist">
          ${tabsNavHtml}
        </div>

        <!-- Panels Container -->
        <div class="city-decision-panels-container">
          ${panelsHtml}
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 06: INTERACTIVE COURSE COMPARISON TABLE
         ============================================================ -->
    <section class="city-comparison-section" aria-labelledby="comparison-heading">
      <div class="city-container">
        <header class="city-section-header">
          <span class="city-section-tag">Program Comparison</span>
          <h2 class="city-section-title" id="comparison-heading">Compare All 7 Programs in ${escapeHtml(loc.city)}</h2>
          <p class="city-section-subtitle">Evaluate course duration, curriculum modules, and verified launch fees.</p>
        </header>

        <div class="city-table-responsive-wrap">
          <table class="city-comparison-table" aria-label="Course comparison table for ${escapeHtml(loc.city)}">
            <thead>
              <tr>
                <th scope="col">Program Title &amp; Academy</th>
                <th scope="col">Duration</th>
                <th scope="col">Curriculum</th>
                <th scope="col">Effective Fee</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 07: REAL PROJECT & TOOL HIGHLIGHTS
         ============================================================ -->
    <section class="city-tools-section" aria-labelledby="tools-heading">
      <div class="city-container">
        <header class="city-section-header">
          <span class="city-section-tag">Industry Stack</span>
          <h2 class="city-section-title" id="tools-heading">Tools &amp; Technologies You Will Master</h2>
          <p class="city-section-subtitle">Practical hands-on training with industry-standard software tools and AI platforms.</p>
        </header>

        <div class="city-tools-grid">
          <div class="city-tool-card" style="grid-column: 1 / -1;">
            <div class="city-tool-header">Verified Software &amp; Frameworks</div>
            <div class="city-tool-tags">
              ${toolPillsHtml}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 08 & 10: METHODOLOGY & E-E-A-T TRUST
         ============================================================ -->
    <section class="city-trust-section" aria-labelledby="method-heading">
      <div class="city-container">
        <header class="city-section-header">
          <span class="city-section-tag">Institutional Transparency</span>
          <h2 class="city-section-title" id="method-heading">How Live Interactive Online Learning Works</h2>
          <p class="city-section-subtitle">Rigorous online training methodology with real-time feedback and structured progression.</p>
        </header>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <div style="background: var(--city-surface); padding: 24px; border-radius: var(--city-radius-md); border: 1px solid var(--city-border);">
            <h3 style="font-family: var(--city-font-heading); font-size: 1.125rem; font-weight: 800; color: var(--city-navy); margin-top: 0;">1. Live Two-Way Classes</h3>
            <p style="font-size: 0.875rem; color: var(--city-text-muted); margin: 0;">Classes are streamed in high definition with two-way voice/screen interaction, ensuring you can ask questions in real time.</p>
          </div>
          <div style="background: var(--city-surface); padding: 24px; border-radius: var(--city-radius-md); border: 1px solid var(--city-border);">
            <h3 style="font-family: var(--city-font-heading); font-size: 1.125rem; font-weight: 800; color: var(--city-navy); margin-top: 0;">2. 1-on-1 Mentor Reviews</h3>
            <p style="font-size: 0.875rem; color: var(--city-text-muted); margin: 0;">Every code assignment, graphic layout, or video edit receives detailed personal feedback from your practitioner instructor.</p>
          </div>
          <div style="background: var(--city-surface); padding: 24px; border-radius: var(--city-radius-md); border: 1px solid var(--city-border);">
            <h3 style="font-family: var(--city-font-heading); font-size: 1.125rem; font-weight: 800; color: var(--city-navy); margin-top: 0;">3. Weekend Doubt Clinics</h3>
            <p style="font-size: 0.875rem; color: var(--city-text-muted); margin: 0;">Dedicated weekend review sessions help you catch up on complex modules, troubleshoot software issues, and refine project portfolios.</p>
          </div>
        </div>

        <div class="city-trust-box" role="note">
          <strong>Physical Campus Notice:</strong> Nova Skills operates its official physical classroom campus and headquarters in Siddharth Nagar, Uttar Pradesh. The ${escapeHtml(loc.city)} location represents an authorized live online learning service area. There are no physical branch offices, walk-in centers, or local staff in ${escapeHtml(loc.city)}.
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 11: CITY-RELEVANT FAQS
         ============================================================ -->
    <section class="city-faq-section" aria-labelledby="faq-title">
      <div class="city-container">
        <header class="city-section-header">
          <span class="city-section-tag">Frequently Asked Questions</span>
          <h2 class="city-section-title" id="faq-title">Questions from Learners in ${escapeHtml(loc.city)}</h2>
          <p class="city-section-subtitle">Direct, factual answers regarding course availability, demo classes, and admissions.</p>
        </header>

        <div class="city-faq-wrap">
          <details class="city-faq-item">
            <summary class="city-faq-question">
              <span>Can I attend classes from ${escapeHtml(loc.city)} while working or studying?</span>
              <svg class="city-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="city-faq-answer">
              <p>Yes. We offer flexible weekday evening and weekend batches specifically designed for college students and working professionals in ${escapeHtml(loc.city)}. All live classes are recorded and archived for 24/7 access.</p>
            </div>
          </details>

          <details class="city-faq-item">
            <summary class="city-faq-question">
              <span>How do I book the 2-Day Free Demo class?</span>
              <svg class="city-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="city-faq-answer">
              <p>Click any 'Free Demo' button on this page to open our dedicated demo booking form. Select your preferred program, and an admissions coordinator will reserve your seat in the next demo batch.</p>
            </div>
          </details>

          <details class="city-faq-item">
            <summary class="city-faq-question">
              <span>Do you provide certificate evaluation and portfolio support?</span>
              <svg class="city-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="city-faq-answer">
              <p>Yes. Upon successfully completing course modules and evaluating your practical capstone projects, you receive an accredited Nova Skills Certificate of Completion along with comprehensive portfolio preparation assistance.</p>
            </div>
          </details>

          <details class="city-faq-item">
            <summary class="city-faq-question">
              <span>Where can I verify the full course syllabus?</span>
              <svg class="city-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="city-faq-answer">
              <p>Each course card links directly to its official course detail page on our website, where complete week-by-week module outlines, software requirements, and project scopes are detailed.</p>
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 12: CONVERSION SECTION
         ============================================================ -->
    <section class="city-conversion-section" aria-labelledby="cta-heading">
      <div class="city-container">
        <div class="city-conversion-content">
          <h2 class="city-conversion-title" id="cta-heading">Advance Your Career in ${escapeHtml(loc.city)} Today.</h2>
          <p class="city-conversion-subtitle">
            Experience our practical teaching methodology firsthand with a 2-day live interactive demo session, or consult with an academic mentor.
          </p>
          <div class="city-conversion-ctas">
            <button type="button" class="city-btn city-btn-primary" onclick="window.openCityCourseDemo()">
              <span>📅</span> Book Your 2-Day Free Demo
            </button>
            <button type="button" class="city-btn city-btn-secondary" onclick="window.openCityConsultation()">
              <span>💬</span> Free Consultation
            </button>
            <a href="/branches/" class="city-btn city-btn-secondary">
              <span>🌐</span> View All 36 Locations
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 13: RELATED LEARNING RESOURCES
         ============================================================ -->
    <section class="city-container" style="padding: 50px 0; border-top: 1px solid var(--city-border); font-size: 0.875rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <span style="font-weight: 700; color: var(--city-navy);">Explore More at Nova Skills:</span>
          <a href="/courses.html" style="color: var(--city-primary); margin-left: 12px; text-decoration: underline;">All Courses (109)</a>
          <span style="color: var(--city-border); margin: 0 8px;">|</span>
          <a href="/branches/" style="color: var(--city-primary); text-decoration: underline;">All Learning Locations (36)</a>
          <span style="color: var(--city-border); margin: 0 8px;">|</span>
          <a href="/contact.html" style="color: var(--city-primary); text-decoration: underline;">Contact &amp; Campus Info</a>
        </div>
        <div style="color: var(--city-text-muted);">
          Location ID: <code>${escapeHtml(loc.id)}</code> • Priority: <code>${escapeHtml(loc.priority)}</code>
        </div>
      </div>
    </section>

  </main>

  <!-- Injected Footer Shell -->
  <div id="ns-footer"></div>

  <!-- Scripts -->
  <script src="/js/data.min.js?v=2.7.4" defer></script>
  <script src="/js/components.min.js?v=2.7.4" defer></script>
  <script src="/js/icon-system.js" defer></script>
  <script src="/js/locations-city.js" defer></script>
</body>
</html>`;
}

function compilePilotCities() {
  console.log('Compiling 4 Pilot City Pages (Indore, Jaipur, Rajkot, Patna)...\n');

  PILOT_CONFIGS.forEach(cfg => {
    const html = generateCityHtml(cfg);
    const targetDir = path.join(ROOT_DIR, 'branches', cfg.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, html, 'utf8');
    console.log(`  ✓ Generated: branches/${cfg.slug}/index.html (${(html.length / 1024).toFixed(2)} KB)`);
  });

  console.log('\nAll 4 pilot pages successfully pre-rendered.');
}

compilePilotCities();
