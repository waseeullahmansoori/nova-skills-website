/**
 * Nova Skills P3 City Pages Pre-renderer
 * Phase 07 — Compiles Final 13 P3 City Pages:
 *   1. Muzaffarpur
 *   2. Jammu
 *   3. Solan
 *   4. Margao
 *   5. Leh
 *   6. Bahraich
 *   7. Wardha
 *   8. Jagdalpur
 *   9. Kaithal
 *   10. Anantnag
 *   11. Mandi
 *   12. Ponda
 *   13. Kargil
 * 
 * Rules:
 * - 4 compulsory courses for EVERY city.
 * - Exactly 2 additional courses for every P3 city (6 courses total per city).
 * - Genuine editorial differentiation across all 13 P3 cities.
 * - Resolves all pricing, duration, and curricula from canonical data.js.
 * - Full 13-section layout satisfying E-E-A-T, AEO, GEO, and CRO standards.
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

const P3_CONFIGS = [
  // 1. MUZAFFARPUR (Gate 05)
  {
    slug: 'muzaffarpur',
    city: 'Muzaffarpur',
    state: 'Bihar',
    title: 'Python & Career-Focused Online Courses in Muzaffarpur | Nova Skills',
    metaDesc: 'Build programming logic and career placement readiness in Muzaffarpur with live online courses in Python Developer Pro and Career Launch.',
    headline: 'Build Technical Skills. Prepare for Your Next Opportunity.',
    heroSubtitle: 'Explore live online professional training in Digital Marketing, Graphic Design, Video Editing and AI, alongside Python development and structured career placement preparation.',
    editorialTag: 'Programming Skills & Career Preparation',
    decisionHeading: 'From Python Skills to Career Preparation',
    decisionSubtitle: 'Compare developing technical programming competence with preparing for corporate interview rounds and job applications.',
    decisionTabs: [
      {
        id: 'tab-python',
        label: '1. Python Software Development',
        title: 'Python Developer Professional',
        desc: 'Master Python programming syntax, algorithmic problem solving, REST API integrations, and database operations.',
        focus: 'Software Logic & Python Scripting',
        tools: 'Python 3, VS Code, Git, SQLite, Requests',
        duration: '3 Months (80+ Guided Hours)',
        outcome: '3 Practical Python Scripting & Automation Projects',
        courseId: 'python-developer'
      },
      {
        id: 'tab-career',
        label: '2. Career Launch & Placement Readiness',
        title: 'Career Launch & Placement Readiness Professional',
        desc: 'Engineer ATS-compliant resumes, practice technical and HR mock interview simulations, optimize LinkedIn profiles, and prepare for corporate placement rounds.',
        focus: 'ATS Resumes & Mock Interview Panels',
        tools: 'ATS Resume Tools, LinkedIn Talent, Mock Panels',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified ATS Resume & Mock Interview Scorecard',
        courseId: 'career-launch-placement-readiness-professional'
      }
    ]
  },

  // 2. JAMMU (Gate 06)
  {
    slug: 'jammu',
    city: 'Jammu',
    state: 'Jammu & Kashmir',
    title: 'Full Stack & AI Productivity Online Courses in Jammu | Nova Skills',
    metaDesc: 'Develop software applications or accelerate daily professional tasks in Jammu with live online certified programs in Full Stack and AI Productivity.',
    headline: 'Learn to Build. Learn to Work Smarter.',
    heroSubtitle: 'Explore live online professional training in creative, marketing and AI skills alongside full-stack programming foundations and AI-assisted workplace productivity.',
    editorialTag: 'Software Architecture & AI Productivity',
    decisionHeading: 'Create Technology or Improve Existing Workflows?',
    decisionSubtitle: 'Determine whether your goal is to build digital software applications from scratch or apply generative AI tools to accelerate daily work.',
    decisionTabs: [
      {
        id: 'tab-build',
        label: '1. BUILD DIGITAL SOLUTIONS — Full Stack Foundations',
        title: 'Full Stack Programming Foundation',
        desc: 'Build interactive web applications from scratch using modern JavaScript, semantic HTML5, modern CSS layouts, and backend APIs.',
        focus: 'Web Architecture & Software Logic',
        tools: 'JavaScript, Node.js, HTML5, CSS3, VS Code, Git',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '3 Functional Full-Stack Web Applications',
        courseId: 'fullstack-foundation'
      },
      {
        id: 'tab-work-smart',
        label: '2. IMPROVE EVERYDAY WORK — AI Productivity',
        title: 'AI Productivity Professional',
        desc: 'Integrate approved generative AI tools and prompt workflows to automate reports, content research, email summaries, and daily task management.',
        focus: 'Generative AI Workflows & Task Automation',
        tools: 'ChatGPT, Claude, Notion AI, Prompt Craft Labs',
        duration: '2 Months (40+ Guided Hours)',
        outcome: 'Enterprise Personal AI Productivity System',
        courseId: 'ai-productivity'
      }
    ]
  },

  // 3. SOLAN (Gate 07)
  {
    slug: 'solan',
    city: 'Solan',
    state: 'Himachal Pradesh',
    title: 'Kids Tech & No-Code Website Courses in Solan | Nova Skills',
    metaDesc: 'Explore age-appropriate live online learning in Solan spanning youth technology exploration and practical adult no-code website development.',
    headline: 'Explore Digital Skills for Different Learning Goals.',
    heroSubtitle: 'Discover live online certified training in creative and AI skills, with clearly separated pathways for young technology explorers and adult no-code website creators.',
    editorialTag: 'Technology Learning Across Different Stages',
    decisionHeading: 'Technology Learning for Young Learners and Adult Beginners',
    decisionSubtitle: 'Choose between an engaging digital creativity program for young school students or practical no-code web development for adult professionals.',
    decisionTabs: [
      {
        id: 'tab-kids',
        label: '1. Young Tech Explorers (Ages 8-14)',
        title: 'Future Tech Kids Mastery',
        desc: 'Introduce young learners to visual logic, digital storytelling, safe online tools, and interactive creative media in an engaging, age-appropriate environment.',
        focus: 'Creative Technology & Digital Curiosity',
        tools: 'Scratch, Block Coding, Canva for Education, Interactive Labs',
        duration: '4 Months (60+ Guided Hours)',
        outcome: 'Creative Digital Storytelling & Coding Portfolio',
        courseId: 'kids-mastery'
      },
      {
        id: 'tab-nocode',
        label: '2. No-Code Website Building (Adults & Professionals)',
        title: 'No-Code Website Professional',
        desc: 'Create responsive business websites, landing pages, and interactive client portfolios using modern visual builders without manual coding.',
        focus: 'Visual Web Development & Landing Pages',
        tools: 'Webflow, WordPress, Elementor, Figma Handoff',
        duration: '3 Months (60+ Guided Hours)',
        outcome: '3 Production-Ready Client Web Portfolios',
        courseId: 'nocode-web-pro'
      }
    ]
  },

  // 4. MARGAO (Gate 08)
  {
    slug: 'margao',
    city: 'Margao',
    state: 'Goa',
    title: 'YouTube & Content Creation Online Courses in Margao | Nova Skills',
    metaDesc: 'Master video content planning, channel strategy, and studio production from Margao with live online programs in YouTube Growth and Content Creation.',
    headline: 'Create Content With a Clear Purpose.',
    heroSubtitle: 'Build professional capabilities in Digital Marketing, Graphic Design, Video Editing and AI, alongside specialized training in YouTube channel strategy and multi-platform content production.',
    editorialTag: 'Creator Production & Content Strategy',
    decisionHeading: 'Content Production vs Channel Strategy',
    decisionSubtitle: 'Understand the distinct roles of strategic channel audience growth and high-fidelity video production craft.',
    decisionTabs: [
      {
        id: 'tab-strategy',
        label: '1. Channel Strategy & Audience Growth',
        title: 'YouTube Growth & Content Strategy Professional',
        desc: 'Plan channel content calendars, produce engaging long-form video programming, understand platform algorithms, and build monetization streams.',
        focus: 'Channel Programming & Algorithm Growth',
        tools: 'YouTube Studio, Premiere Pro, TubeBuddy, Analytics Dashboards',
        duration: '3 Months (80+ Guided Hours)',
        outcome: 'Channel Growth Roadmap & Video Portfolio',
        courseId: 'youtube-mastery'
      },
      {
        id: 'tab-craft',
        label: '2. Studio Production & Content Craft',
        title: 'Content Creator Professional',
        desc: 'Develop short-form reels, multi-camera shooting techniques, live studio audio, lighting setups, and audience retention workflows.',
        focus: 'Multi-Platform Video & Short-Form Craft',
        tools: 'Premiere Pro, CapCut Pro, Studio Lighting, Audio Kits',
        duration: '3 Months (80+ Guided Hours)',
        outcome: 'Multi-Channel Content Creator Portfolio',
        courseId: 'content-creator-pro'
      }
    ]
  },

  // 5. LEH (Gate 09)
  {
    slug: 'leh',
    city: 'Leh',
    state: 'Ladakh',
    title: 'Office Productivity & AI Online Courses in Leh | Nova Skills',
    metaDesc: 'Build certified digital workplace skills in Leh with live online training in Microsoft 365, Google Workspace, and Generative AI Productivity tools.',
    headline: 'Build Practical Skills for Modern Digital Work.',
    heroSubtitle: 'Discover live online professional programs in Digital Marketing, Graphic Design, Video Editing and AI, alongside everyday office software and AI productivity tools.',
    editorialTag: 'Digital Workplace & AI-Assisted Productivity',
    decisionHeading: 'Everyday Office Tools vs AI-Assisted Workflows',
    decisionSubtitle: 'Compare foundational digital office documentation with emerging generative AI workplace assistants.',
    decisionTabs: [
      {
        id: 'tab-office',
        label: '1. Core Digital Office Systems',
        title: 'Office Productivity Professional',
        desc: 'Streamline day-to-day office administrative workflows, collaborative spreadsheets, executive slide decks, and team calendars.',
        focus: 'Document Operations & Cloud Spreadsheets',
        tools: 'Microsoft 365, Google Workspace, Excel Formulas, Slack',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified Office Systems & Operations Toolkit',
        courseId: 'office-pro'
      },
      {
        id: 'tab-ai',
        label: '2. Generative AI Workplace Assistants',
        title: 'AI Productivity Professional',
        desc: 'Apply prompt design frameworks, automate recurring communication drafts, synthesize market research, and streamline professional workflows with AI.',
        focus: 'Prompt Engineering & Synthesis',
        tools: 'ChatGPT, Claude, Notion AI, Prompt Craft Labs',
        duration: '2 Months (40+ Guided Hours)',
        outcome: 'Personalized AI Automation Suite',
        courseId: 'ai-productivity'
      }
    ]
  },

  // 6. BAHRAICH (Gate 10)
  {
    slug: 'bahraich',
    city: 'Bahraich',
    state: 'Uttar Pradesh',
    title: 'Spoken English & Office Skills Online in Bahraich | Nova Skills',
    metaDesc: 'Strengthen spoken communication and office software capabilities in Bahraich with live online training in Professional Spoken English and Office Productivity.',
    headline: 'Strengthen the Skills You Use at Work.',
    heroSubtitle: 'Explore live online training in Digital Marketing, Graphic Design, Video Editing and AI, with foundational training in corporate spoken English and digital office productivity.',
    editorialTag: 'Communication & Everyday Office Readiness',
    decisionHeading: 'Communication Tasks and Digital Office Tasks',
    decisionSubtitle: 'Distinguish between verbal workplace articulation exercises and digital spreadsheet/document administration.',
    decisionTabs: [
      {
        id: 'tab-spoken',
        label: '1. Spoken Communication Fluency',
        title: 'Professional Spoken English',
        desc: 'Overcome conversational hesitation, practice professional email drafting, participate actively in meetings, and speak fluent business English.',
        focus: 'Verbal Articulation & Workplace Confidence',
        tools: 'Speech Practice Labs, Business Writing Kits, Voice Rubrics',
        duration: '3 Months (70+ Guided Hours)',
        outcome: 'Fluent Presentation & Interview Speaking Portfolio',
        courseId: 'spoken-english-pro'
      },
      {
        id: 'tab-office',
        label: '2. Digital Office Productivity',
        title: 'Office Productivity Professional',
        desc: 'Master document formatting, collaborative cloud spreadsheets, presentation templates, team communication channels, and office calendar scheduling.',
        focus: 'Document Operations & Spreadsheets',
        tools: 'Microsoft 365, Google Workspace, Excel Formulas, Teams',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Modern Digital Workplace Operations Blueprint',
        courseId: 'office-pro'
      }
    ]
  },

  // 7. WARDHA (Gate 11)
  {
    slug: 'wardha',
    city: 'Wardha',
    state: 'Maharashtra',
    title: 'Python & Business Intelligence Online in Wardha | Nova Skills',
    metaDesc: 'Master software coding and data analysis from Wardha with live online certified training in Python Development and MIS & Business Intelligence.',
    headline: 'Understand Code. Work With Data.',
    heroSubtitle: 'Build verified skills in Digital Marketing, Graphic Design, Video Editing and AI, alongside Python programming logic and enterprise business intelligence reporting.',
    editorialTag: 'Programming & Business Data Skills',
    decisionHeading: 'Programming Applications vs Business Reporting',
    decisionSubtitle: 'Examine the distinct methodologies of software application development and corporate data visualization.',
    decisionTabs: [
      {
        id: 'tab-python',
        label: '1. Software Logic & Python Scripting',
        title: 'Python Developer Professional',
        desc: 'Master Python programming fundamentals, backend scripts, algorithmic data handling, API integration, and database operations.',
        focus: 'Algorithmic Logic & Backend Scripts',
        tools: 'Python 3, VS Code, Git, SQLite, Requests',
        duration: '3 Months (80+ Guided Hours)',
        outcome: '3 Practical Python Scripting Projects',
        courseId: 'python-developer'
      },
      {
        id: 'tab-mis',
        label: '2. Corporate MIS & Data Dashboards',
        title: 'MIS & Business Intelligence Professional',
        desc: 'Transform business metrics into clear visual insights, executive dashboards, automated spreadsheets, and relational data queries.',
        focus: 'Executive Reporting & Analytics',
        tools: 'Power BI, Advanced Excel, SQL Queries, PivotTables, DAX',
        duration: '6 Months (120+ Guided Hours)',
        outcome: '1 Complete Corporate MIS Dashboard Capstone',
        courseId: 'biz-productivity'
      }
    ]
  },

  // 8. JAGDALPUR (Gate 12)
  {
    slug: 'jagdalpur',
    city: 'Jagdalpur',
    state: 'Chhattisgarh',
    title: 'Office Productivity & Freelance Courses in Jagdalpur | Nova Skills',
    metaDesc: 'Develop practical workplace administration and global freelance consulting capabilities from Jagdalpur with live online certified programs.',
    headline: 'Build Skills for Productive and Independent Work.',
    heroSubtitle: 'Discover live online professional courses in Digital Marketing, Graphic Design, Video Editing and AI, alongside office administration tools and independent freelance client acquisition.',
    editorialTag: 'Workplace Tools & Professional Client Work',
    decisionHeading: 'Managing Work vs Managing Client Relationships',
    decisionSubtitle: 'Compare internal administrative office coordination with independent international client acquisition.',
    decisionTabs: [
      {
        id: 'tab-office',
        label: '1. Office Systems & Internal Productivity',
        title: 'Office Productivity Professional',
        desc: 'Organize business documents, automate spreadsheet calculations, produce executive presentations, and coordinate team operations.',
        focus: 'Workplace Administration & Collaboration',
        tools: 'Microsoft 365, Google Workspace, Excel Formulas, Slack',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified Office Systems & Operations Toolkit',
        courseId: 'office-pro'
      },
      {
        id: 'tab-freelance',
        label: '2. Client Acquisition & Independent Consulting',
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

  // 9. KAITHAL (Gate 13)
  {
    slug: 'kaithal',
    city: 'Kaithal',
    state: 'Haryana',
    title: 'E-Commerce & No-Code Website Courses in Kaithal | Nova Skills',
    metaDesc: 'Build functional client websites and high-converting e-commerce stores from Kaithal with live online training in E-Commerce Mastery and No-Code Web Pro.',
    headline: 'Create Websites. Understand Online Commerce.',
    heroSubtitle: 'Explore live online professional training in Digital Marketing, Graphic Design, Video Editing and AI, with dedicated pathways in e-commerce storefronts and no-code business websites.',
    editorialTag: 'Websites & Online Store Development',
    decisionHeading: 'Business Website or Online Store?',
    decisionSubtitle: 'Determine whether your venture needs transactional retail cart capabilities or informative visual business pages.',
    decisionTabs: [
      {
        id: 'tab-ecom',
        label: '1. E-Commerce Online Storefront',
        title: 'E-Commerce Website Mastery',
        desc: 'Build scalable multi-product online stores, integrate domestic and international payment gateways, configure product variants, and optimize checkout funnels.',
        focus: 'Store Infrastructure & Conversion Funnels',
        tools: 'Shopify, WooCommerce, Stripe, Razorpay, Google Analytics 4',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '2 Live E-Commerce Store Deployments',
        courseId: 'ecommerce-mastery'
      },
      {
        id: 'tab-nocode',
        label: '2. General Business Website (No-Code)',
        title: 'No-Code Website Professional',
        desc: 'Create responsive business websites, landing pages, and interactive client portfolios using modern visual builders without manual coding.',
        focus: 'Rapid Visual Development & Portfolios',
        tools: 'Webflow, WordPress, Elementor, Figma Handoff',
        duration: '3 Months (60+ Guided Hours)',
        outcome: '3 Production-Ready Client Web Portfolios',
        courseId: 'nocode-web-pro'
      }
    ]
  },

  // 10. ANANTNAG (Gate 14)
  {
    slug: 'anantnag',
    city: 'Anantnag',
    state: 'Jammu & Kashmir',
    title: 'Python & Spoken English Online in Anantnag | Nova Skills',
    metaDesc: 'Build programming ability and spoken corporate communication in Anantnag with live online training in Python Developer Pro and Professional Spoken English.',
    headline: 'Develop Technical Ability and Communicate With Confidence.',
    heroSubtitle: 'Explore live online certified programs in Digital Marketing, Graphic Design, Video Editing and AI, alongside Python software logic and fluent workplace spoken English.',
    editorialTag: 'Technical Skills & Professional Communication',
    decisionHeading: 'Technical Problem Solving and Spoken Communication',
    decisionSubtitle: 'Compare learning Python software coding logic with building spoken English communication fluency.',
    decisionTabs: [
      {
        id: 'tab-python',
        label: '1. Technical Programming & Logic',
        title: 'Python Developer Professional',
        desc: 'Master Python programming fundamentals, backend scripts, algorithmic data handling, API integration, and database operations.',
        focus: 'Software Programming & Data Handling',
        tools: 'Python 3, VS Code, Git, SQLite, Requests',
        duration: '3 Months (80+ Guided Hours)',
        outcome: '3 Practical Python Scripting Projects',
        courseId: 'python-developer'
      },
      {
        id: 'tab-spoken',
        label: '2. Corporate Spoken English Fluency',
        title: 'Professional Spoken English',
        desc: 'Overcome speaking hesitation, practice professional email drafting, participate actively in group discussions, and build clear English communication skills.',
        focus: 'Conversational Fluency & Professional Expression',
        tools: 'Speech Practice Labs, Business Writing Kits, Voice Rubrics',
        duration: '3 Months (70+ Guided Hours)',
        outcome: 'Fluent Presentation & Interview Speaking Portfolio',
        courseId: 'spoken-english-pro'
      }
    ]
  },

  // 11. MANDI (Gate 15)
  {
    slug: 'mandi',
    city: 'Mandi',
    state: 'Himachal Pradesh',
    title: 'Kids Coding & Tech Education Online in Mandi | Nova Skills',
    metaDesc: 'Explore structured age-appropriate coding and digital creativity programs in Mandi for young learners through Future Tech Kids and Young Coders.',
    headline: 'Explore Technology Through Age-Appropriate Learning.',
    heroSubtitle: 'Discover live online certified training in creative and AI skills, with specialized age-appropriate technology and coding programs for school students.',
    editorialTag: 'Coding & Technology Education for Youth',
    decisionHeading: 'Compare Two Young Learner Technology Programs',
    decisionSubtitle: 'Choose the appropriate technology curriculum designed specifically for exploratory elementary students or intermediate foundational coders.',
    decisionTabs: [
      {
        id: 'tab-kids',
        label: '1. Young Tech Explorers (Ages 8-14)',
        title: 'Future Tech Kids Mastery',
        desc: 'Introduce young learners to visual logic, digital storytelling, safe online tools, and interactive creative media in an engaging, age-appropriate environment.',
        focus: 'Creative Technology & Digital Curiosity',
        tools: 'Scratch, Block Coding, Canva for Education, Interactive Labs',
        duration: '4 Months (60+ Guided Hours)',
        outcome: 'Creative Digital Storytelling & Coding Portfolio',
        courseId: 'kids-mastery'
      },
      {
        id: 'tab-youth',
        label: '2. Foundational Coding (Ages 12-18)',
        title: 'Young Coders Program',
        desc: 'Develop real programming confidence through Python fundamentals, interactive game creation, algorithmic problem solving, and basic web building blocks.',
        focus: 'Algorithmic Thinking & Software Syntax',
        tools: 'Python, Pygame, VS Code, HTML5 Basics',
        duration: '3 Months (50+ Guided Hours)',
        outcome: '3 Interactive Python Games & Projects',
        courseId: 'young-coders'
      }
    ]
  },

  // 12. PONDA (Gate 16)
  {
    slug: 'ponda',
    city: 'Ponda',
    state: 'Goa',
    title: 'E-Commerce & YouTube Strategy Online in Ponda | Nova Skills',
    metaDesc: 'Build scalable online storefronts and video channel programming from Ponda with live online training in E-Commerce Mastery and YouTube Growth.',
    headline: 'Explore Digital Commerce and Content Skills.',
    heroSubtitle: 'Explore live online professional training in Digital Marketing, Graphic Design, Video Editing and AI, alongside e-commerce store architecture and YouTube channel strategy.',
    editorialTag: 'E-Commerce & YouTube Content Strategy',
    decisionHeading: 'Building Online Stores vs Building Content Channels',
    decisionSubtitle: 'Compare the technical and commercial operations of managing an online store with growing a digital video audience.',
    decisionTabs: [
      {
        id: 'tab-ecom',
        label: '1. E-Commerce Store Architecture',
        title: 'E-Commerce Website Mastery',
        desc: 'Build scalable multi-product online stores, integrate payment gateways, configure product catalogs, and streamline checkout operations.',
        focus: 'Store Infrastructure & Conversion Funnels',
        tools: 'Shopify, WooCommerce, Stripe, Razorpay, Google Analytics 4',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '2 Operational Online Retail Stores',
        courseId: 'ecommerce-mastery'
      },
      {
        id: 'tab-youtube',
        label: '2. Video Content & Channel Strategy',
        title: 'YouTube Growth & Content Strategy Professional',
        desc: 'Plan channel content calendars, produce engaging video content, understand platform algorithms, and configure ethical monetization streams.',
        focus: 'Channel Programming & Audience Growth',
        tools: 'YouTube Studio, Premiere Pro, TubeBuddy, Analytics Dashboards',
        duration: '3 Months (80+ Guided Hours)',
        outcome: 'Channel Growth Roadmap & Video Portfolio',
        courseId: 'youtube-mastery'
      }
    ]
  },

  // 13. KARGIL (Gate 17)
  {
    slug: 'kargil',
    city: 'Kargil',
    state: 'Ladakh',
    title: 'AI Productivity & Spoken English Online in Kargil | Nova Skills',
    metaDesc: 'Build modern generative AI workflow and English speaking skills in Kargil with live online certified programs in AI Productivity and Spoken English.',
    headline: 'Learn Practical Skills for Digital Communication and Work.',
    heroSubtitle: 'Discover live online certified training in creative, marketing and AI skills, combined with practical generative AI workplace tools and professional spoken English.',
    editorialTag: 'AI-Assisted Work & Communication Skills',
    decisionHeading: 'Professional Communication and AI-Assisted Productivity',
    decisionSubtitle: 'Choose your learning focus between building workplace spoken English fluency and mastering practical generative AI productivity tools.',
    decisionTabs: [
      {
        id: 'tab-ai',
        label: '1. Generative AI Workplace Productivity',
        title: 'AI Productivity Professional',
        desc: 'Apply prompt design frameworks, automate recurring communication drafts, synthesize market research, and streamline professional workflows with AI.',
        focus: 'Prompt Engineering & Synthesis',
        tools: 'ChatGPT, Claude, Notion AI, Prompt Craft Labs',
        duration: '2 Months (40+ Guided Hours)',
        outcome: 'Personalized AI Automation Suite',
        courseId: 'ai-productivity'
      },
      {
        id: 'tab-spoken',
        label: '2. Corporate Spoken English Fluency',
        title: 'Professional Spoken English',
        desc: 'Overcome speaking hesitation, practice professional email drafting, participate actively in meetings, and speak fluent business English.',
        focus: 'Conversational Fluency & Confidence',
        tools: 'Speech Practice Labs, Business Writing Kits, Voice Rubrics',
        duration: '3 Months (70+ Guided Hours)',
        outcome: 'Fluent Presentation & Interview Speaking Portfolio',
        courseId: 'spoken-english-pro'
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
            <strong>Yes.</strong> Prospective students in ${escapeHtml(loc.city)} (${escapeHtml(loc.state)}) can enroll in all featured professional courses via live interactive online batches. Classes feature two-way audio/video, real-time mentor code reviews, recorded lecture archives, and weekend doubt clearance. In-person physical classroom training is conducted exclusively at our official Siddharth Nagar, Uttar Pradesh campus.
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
         SECTION 04: RECOMMENDED ADDITIONAL PROGRAMS (EXACTLY TWO)
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
         SECTION 05: UNIQUE DECISION-SUPPORT MODULE (GATES 05 - 17)
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
          <h2 class="city-section-title" id="comparison-heading">Compare All ${allCourses.length} Programs in ${escapeHtml(loc.city)}</h2>
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
              <span>Where can I verify the full course syllabus for these ${allCourses.length} programs?</span>
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

function compileP3Cities(targetCities = null) {
  const configsToBuild = targetCities 
    ? P3_CONFIGS.filter(c => targetCities.includes(c.slug))
    : P3_CONFIGS;

  console.log(`Compiling ${configsToBuild.length} P3 City Pages...\n`);

  configsToBuild.forEach(cfg => {
    const html = generateCityHtml(cfg);
    const targetDir = path.join(ROOT_DIR, 'branches', cfg.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, html, 'utf8');
    console.log(`  ✓ Generated: branches/${cfg.slug}/index.html (${(html.length / 1024).toFixed(2)} KB)`);
  });

  console.log(`\nSuccessfully pre-rendered ${configsToBuild.length} P3 city pages.`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args : null;
  compileP3Cities(targets);
}

module.exports = {
  P3_CONFIGS,
  generateCityHtml,
  compileP3Cities
};
