/**
 * Nova Skills P1 City Pages Pre-renderer
 * Phase 05 — Compiles All 10 P1 City Pages:
 *   Pilots (4): Indore, Jaipur, Rajkot, Patna
 *   Rollout (6): Lucknow, Nagpur, Surat, Nashik, Bhopal, Raipur
 * 
 * Rules:
 * - Exactly 4 compulsory courses + 3 approved additional courses per page (7 courses total).
 * - Genuine editorial differentiation across all 10 P1 cities.
 * - Single source of truth: resolves all pricing, duration, and curricula from data.js.
 * - Full 13-section architecture satisfying E-E-A-T, AEO, GEO, and CRO standards.
 * - Strict Physical vs. Online disclosure: Siddharth Nagar is sole physical campus.
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

const P1_CONFIGS = [
  // --- PILOT 4 CITIES (Preserved from Phase 04) ---
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
  },

  // --- PHASE 05 NEW P1 CITIES (6 CITIES) ---

  // 1. LUCKNOW (Gate 05)
  {
    slug: 'lucknow',
    title: 'Live Online Professional Courses in Lucknow | Nova Skills',
    metaDesc: 'Build professional career confidence in Lucknow with live online training in Python development, business communication, career readiness, digital marketing, and design.',
    headline: 'Learn New Skills. Build Professional Confidence.',
    heroSubtitle: 'Explore live online professional training in Digital Marketing, Graphic Design, Video Editing and AI, with additional pathways in Python development, business communication and career preparation.',
    editorialTag: 'Professional Skills, Communication & Career Readiness',
    decisionHeading: 'From Learning to Professional Readiness',
    decisionSubtitle: 'Compare technical skills, workplace communication, and job-application readiness to choose your career trajectory.',
    decisionTabs: [
      {
        id: 'tab-technical',
        label: '1. "I want to become more technical"',
        title: 'Python Developer Professional',
        desc: 'Master Python programming syntax, data structures, object-oriented principles, API integration, and automation scripts.',
        focus: 'Software Logic & Python Development',
        tools: 'Python 3, VS Code, Git, GitHub, Pandas, Requests',
        duration: '3 Months (80+ Guided Hours)',
        outcome: '3 Practical Python Scripting & Automation Projects',
        courseId: 'python-developer'
      },
      {
        id: 'tab-communication',
        label: '2. "I want to communicate professionally"',
        title: 'Business English & Personality Development',
        desc: 'Develop fluency in corporate presentations, client correspondence, active listening, and workplace personality development.',
        focus: 'Corporate Fluency & Business Writing',
        tools: 'Speech Practice Labs, Business Writing Kits, Presentation Frameworks',
        duration: '3 Months (70+ Guided Hours)',
        outcome: 'Corporate Business Communication Portfolio',
        courseId: 'business-english'
      },
      {
        id: 'tab-readiness',
        label: '3. "I want to prepare for job applications"',
        title: 'Career Launch & Placement Readiness Professional',
        desc: 'Build ATS-optimized resumes, practice technical and behavioral mock interview panels, optimize LinkedIn profiles, and prepare for placement rounds.',
        focus: 'Interview Readiness & Application Strategy',
        tools: 'ATS Resume Optimizers, Mock Interview Rubrics, LinkedIn Strategy',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified ATS Resume & Mock Interview Evaluation',
        courseId: 'career-launch-placement-readiness-professional'
      }
    ]
  },

  // 2. NAGPUR (Gate 06)
  {
    slug: 'nagpur',
    title: 'Programming, AI & Online Courses in Nagpur | Nova Skills',
    metaDesc: 'Advance your technical workflow in Nagpur with live online training in Full Stack Programming, MIS & Business Intelligence, AI Productivity, and Digital Marketing.',
    headline: 'Build. Analyse. Automate.',
    heroSubtitle: 'Discover live online training in creative, marketing and AI skills alongside full stack programming, business intelligence and AI-assisted productivity.',
    editorialTag: 'Development, Business Intelligence & AI Productivity',
    decisionHeading: 'Three Ways to Work With Technology',
    decisionSubtitle: 'Compare developing software applications, organizing business intelligence, and automating daily workflows with AI.',
    decisionTabs: [
      {
        id: 'tab-build',
        label: '1. BUILD — Application Development',
        title: 'Full Stack Programming Foundation',
        desc: 'Build interactive web applications from scratch using modern JavaScript, HTML5 semantic structure, modern CSS layouts, and backend APIs.',
        focus: 'Frontend & Backend Logic',
        tools: 'JavaScript, Node.js, HTML5, CSS3, VS Code, Git',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '3 Functional Full-Stack Web Applications',
        courseId: 'fullstack-foundation'
      },
      {
        id: 'tab-analyse',
        label: '2. ANALYSE — Business Intelligence',
        title: 'MIS & Business Intelligence Professional',
        desc: 'Transform business metrics into clear visual insights, executive dashboards, automated spreadsheets, and relational data queries.',
        focus: 'Data Analysis & Corporate Dashboards',
        tools: 'Advanced Excel, Power BI, SQL Queries, PivotTables, DAX',
        duration: '6 Months (120+ Guided Hours)',
        outcome: '1 Complete Corporate MIS Dashboard Capstone',
        courseId: 'biz-productivity'
      },
      {
        id: 'tab-automate',
        label: '3. AUTOMATE — AI Productivity',
        title: 'AI Productivity Professional',
        desc: 'Integrate approved generative AI tools and prompt workflows to automate reports, content research, email summaries, and daily task management.',
        focus: 'Workflow Automation & Generative Assistants',
        tools: 'ChatGPT, Claude, Notion AI, Prompt Engineering Labs',
        duration: '2 Months (40+ Guided Hours)',
        outcome: 'Enterprise Personal AI Productivity System',
        courseId: 'ai-productivity'
      }
    ]
  },

  // 3. SURAT (Gate 07)
  {
    slug: 'surat',
    title: 'E-Commerce, Design & Online Courses in Surat | Nova Skills',
    metaDesc: 'Establish your digital commerce presence from Surat with live online training in E-Commerce Store Architecture, No-Code Web Development, and YouTube Content Strategy.',
    headline: 'Build Your Digital Presence. Grow Your Capabilities.',
    heroSubtitle: 'Explore professional live online learning in Digital Marketing, Graphic Design, Video Editing and AI, with additional programs in e-commerce websites, no-code development and YouTube content strategy.',
    editorialTag: 'E-Commerce, Website Creation & Content-Led Growth',
    decisionHeading: 'From Website to Digital Audience',
    decisionSubtitle: 'Distinguish between building e-commerce stores, crafting no-code business websites, and growing a digital video audience.',
    decisionTabs: [
      {
        id: 'tab-store',
        label: '1. "I want to launch an online store"',
        title: 'E-Commerce Website Mastery',
        desc: 'Build scalable multi-product online stores, integrate domestic and international payment gateways, configure product variants, and optimize checkout funnels.',
        focus: 'Store Architecture & Conversion Funnels',
        tools: 'Shopify, WooCommerce, Stripe, Razorpay, Google Analytics 4',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '2 Live E-Commerce Store Deployments',
        courseId: 'ecommerce-mastery'
      },
      {
        id: 'tab-website',
        label: '2. "I want to build websites"',
        title: 'No-Code Website Professional',
        desc: 'Create responsive business websites, landing pages, and interactive client portfolios using modern visual builders without manual coding.',
        focus: 'Rapid Web Design & Visual Development',
        tools: 'Webflow, WordPress, Elementor, Figma Handoff',
        duration: '3 Months (60+ Guided Hours)',
        outcome: '3 Production-Ready Client Web Portfolios',
        courseId: 'nocode-web-pro'
      },
      {
        id: 'tab-audience',
        label: '3. "I want to develop video content and channel strategy"',
        title: 'YouTube Growth & Content Strategy Professional',
        desc: 'Plan channel content architectures, produce engaging long-form and short-form video programming, understand the YouTube algorithm, and build monetization streams.',
        focus: 'Video Strategy & Channel Growth',
        tools: 'YouTube Studio, Premiere Pro, TubeBuddy, Analytics Dashboards',
        duration: '3 Months (80+ Guided Hours)',
        outcome: 'Channel Growth Roadmap & Video Portfolio',
        courseId: 'youtube-mastery'
      }
    ]
  },

  // 4. NASHIK (Gate 08)
  {
    slug: 'nashik',
    title: 'Business Skills & Online Courses in Nashik | Nova Skills',
    metaDesc: 'Master modern business operations from Nashik with live online programs in E-Commerce Architecture, Office Productivity, and Freelance Client Acquisition.',
    headline: 'Practical Skills for the Way Business Works.',
    heroSubtitle: 'Discover live online programs in professional creative, marketing and AI skills, together with e-commerce, office productivity and freelancing learning pathways.',
    editorialTag: 'Business Operations, Digital Tools & Independent Work',
    decisionHeading: 'Build a Practical Business Skills Toolkit',
    decisionSubtitle: 'Understand the key operational differences between managing an online selling platform, running daily office workflows, and acquiring freelance clients.',
    decisionTabs: [
      {
        id: 'tab-ecom-ops',
        label: '1. Online Selling Platform',
        title: 'E-Commerce Website Mastery',
        desc: 'Configure digital catalog management, shopping cart operations, automated inventory notifications, and transactional checkout flows.',
        focus: 'Digital Retail & Online Orders',
        tools: 'Shopify, WooCommerce, Meta Pixel, Inventory Trackers',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '2 Operational Online Retail Stores',
        courseId: 'ecommerce-mastery'
      },
      {
        id: 'tab-office-ops',
        label: '2. Business Workflows & Office Tools',
        title: 'Office Productivity Professional',
        desc: 'Streamline day-to-day office administration, automated spreadsheet reporting, team documentation, calendar workflows, and digital collaboration.',
        focus: 'Digital Workplace Operations',
        tools: 'Microsoft 365, Google Workspace, Excel Formulas, Slack',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified Office Systems & Operations Toolkit',
        courseId: 'office-pro'
      },
      {
        id: 'tab-client-ops',
        label: '3. Client-Facing Freelance Processes',
        title: 'Freelancing & Client Acquisition Professional',
        desc: 'Structure freelance service offerings, bid on international talent platforms, write compelling project proposals, manage milestone deliverables, and issue invoices.',
        focus: 'Contract Negotiation & Global Outreach',
        tools: 'Upwork, Freelancer, LinkedIn InMail, Stripe Invoicing',
        duration: '2 Months (60+ Guided Hours)',
        outcome: 'Live Freelance Profile & Client Onboarding System',
        courseId: 'freelancing-client-acquisition-professional'
      }
    ]
  },

  // 5. BHOPAL (Gate 09)
  {
    slug: 'bhopal',
    title: 'Python, UI/UX & Online Courses in Bhopal | Nova Skills',
    metaDesc: 'Advance your technical, design, and AI productivity skills from Bhopal with live online courses in Python Programming, UI/UX Design, and AI Productivity.',
    headline: 'Think. Design. Develop.',
    heroSubtitle: 'Build professional skills through live online learning in Digital Marketing, Graphic Design, Video Editing and AI, alongside Python development, UI/UX design and productivity-focused AI programs.',
    editorialTag: 'Programming, User Experience & AI Productivity',
    decisionHeading: 'Explore Your Digital Skill Direction',
    decisionSubtitle: 'Determine whether your professional strengths lean toward writing software code, architecting user interfaces, or accelerating operations with AI.',
    decisionTabs: [
      {
        id: 'tab-code',
        label: '1. WRITE CODE — Python Programming',
        title: 'Python Developer Professional',
        desc: 'Master Python programming fundamentals, backend scripts, algorithmic data handling, API integration, and database operations.',
        focus: 'Software Logic & Application Engineering',
        tools: 'Python, VS Code, Git, SQLite, Requests, Jupyter',
        duration: '3 Months (80+ Guided Hours)',
        outcome: '3 Production Python Backend & Automation Projects',
        courseId: 'python-developer'
      },
      {
        id: 'tab-design-ui',
        label: '2. DESIGN INTERFACES — UI/UX Product Design',
        title: 'UI/UX Design Professional',
        desc: 'Conduct user interviews, design responsive wireframes, build scalable Figma design systems, and test interactive prototypes.',
        focus: 'User Experience & Interface Architecture',
        tools: 'Figma, FigJam, Miro, Prototype Labs',
        duration: '5 Months (100+ Guided Hours)',
        outcome: '5 Comprehensive Product UI/UX Case Studies',
        courseId: 'uiux-design-pro'
      },
      {
        id: 'tab-accelerate',
        label: '3. ACCELERATE WORK — AI Productivity',
        title: 'AI Productivity Professional',
        desc: 'Apply prompt design frameworks, automate recurring communication drafts, synthesize market research, and streamline professional workflows with AI.',
        focus: 'AI-Assisted Workplace Optimization',
        tools: 'ChatGPT, Claude, Notion AI, Prompt Craft Labs',
        duration: '2 Months (40+ Guided Hours)',
        outcome: 'Personalized AI Automation Suite',
        courseId: 'ai-productivity'
      }
    ]
  },

  // 6. RAIPUR (Gate 10)
  {
    slug: 'raipur',
    title: 'Business Intelligence & Online Courses in Raipur | Nova Skills',
    metaDesc: 'Transform everyday analytical and office skills in Raipur into high-value professional capabilities with live online training in MIS & BI, Office Systems, and Freelancing.',
    headline: 'Turn Everyday Skills Into Professional Capability.',
    heroSubtitle: 'Explore live online professional programs in Digital Marketing, Graphic Design, Video Editing and AI, with additional learning pathways in business intelligence, office productivity and freelancing.',
    editorialTag: 'Business Intelligence, Office Skills & Independent Services',
    decisionHeading: 'Choose the Skills You Want to Apply',
    decisionSubtitle: 'Compare the depth and workplace focus of business data reporting, modern office administration, and independent client consulting.',
    decisionTabs: [
      {
        id: 'tab-data-rep',
        label: '1. DATA & REPORTING',
        title: 'MIS & Business Intelligence Professional',
        desc: 'Analyze sales volumes, compile weekly and monthly operational reports, design interactive management dashboards, and automate Excel data cleansing.',
        focus: 'Corporate Data Analysis & Reporting Systems',
        tools: 'Power BI, Advanced Excel, SQL, DAX, Pivot Dashboards',
        duration: '6 Months (120+ Guided Hours)',
        outcome: '1 Complete Corporate MIS Dashboard Capstone',
        courseId: 'biz-productivity'
      },
      {
        id: 'tab-office-skills',
        label: '2. OFFICE & PRODUCTIVITY',
        title: 'Office Productivity Professional',
        desc: 'Master document formatting, collaborative cloud spreadsheets, presentation templates, team communication channels, and office calendar scheduling.',
        focus: 'Administrative Efficiency & Office Tools',
        tools: 'Microsoft 365, Google Workspace, Excel Formulas, Teams',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Modern Digital Workplace Operations Blueprint',
        courseId: 'office-pro'
      },
      {
        id: 'tab-freelance-serv',
        label: '3. CLIENTS & INDEPENDENT WORK',
        title: 'Freelancing & Client Acquisition Professional',
        desc: 'Package your technical or administrative skills into distinct service packages, win client contracts on global freelance platforms, and manage client relations.',
        focus: 'Freelance Strategy & Client Contracts',
        tools: 'Upwork, Fiverr, LinkedIn Outreach, Invoicing Gateways',
        duration: '2 Months (60+ Guided Hours)',
        outcome: 'Verified Freelance Profile & Client Acquisition Pipeline',
        courseId: 'freelancing-client-acquisition-professional'
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
  <link rel="stylesheet" href="/css/styles.min.css?v=2.8.0" />
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
         SECTION 05: UNIQUE DECISION-SUPPORT MODULE (GATES 05 - 10)
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
              <span>How do I book the 2-Day Free Demo class for ${escapeHtml(loc.city)} batches?</span>
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
              <span>Where can I verify the full course syllabus for these 7 programs?</span>
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
  <script src="/js/components.min.js?v=2.8.0" defer></script>
  <script src="/js/icon-system.js" defer></script>
  <script src="/js/locations-city.js" defer></script>
</body>
</html>`;
}

function compileP1Cities(targetCities = null) {
  const configsToBuild = targetCities 
    ? P1_CONFIGS.filter(c => targetCities.includes(c.slug))
    : P1_CONFIGS;

  console.log(`Compiling ${configsToBuild.length} P1 City Pages...\n`);

  configsToBuild.forEach(cfg => {
    const html = generateCityHtml(cfg);
    const targetDir = path.join(ROOT_DIR, 'branches', cfg.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, html, 'utf8');
    console.log(`  ✓ Generated: branches/${cfg.slug}/index.html (${(html.length / 1024).toFixed(2)} KB)`);
  });

  console.log(`\nSuccessfully pre-rendered ${configsToBuild.length} P1 city pages.`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args : null;
  compileP1Cities(targets);
}

module.exports = {
  P1_CONFIGS,
  generateCityHtml,
  compileP1Cities
};
