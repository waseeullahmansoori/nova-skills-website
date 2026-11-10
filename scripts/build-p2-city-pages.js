/**
 * Nova Skills P2 City Pages Pre-renderer
 * Phase 06 — Compiles 13 P2 City Pages:
 *   1. Vadodara
 *   2. Dehradun
 *   3. Kota
 *   4. Chhatrapati Sambhajinagar
 *   5. Prayagraj
 *   6. Ludhiana
 *   7. Jalandhar
 *   8. Gorakhpur
 *   9. Gwalior
 *   10. Hisar
 *   11. Basti (2 additional courses)
 *   12. Azamgarh (2 additional courses)
 *   13. Sultanpur (2 additional courses)
 * 
 * Rules:
 * - 4 compulsory courses for EVERY city.
 * - Exactly 3 additional courses for 10 cities, exactly 2 additional for Basti, Azamgarh, Sultanpur.
 * - Genuine editorial differentiation across all 13 P2 cities.
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

const P2_CONFIGS = [
  // 1. VADODARA (Gate 06)
  {
    slug: 'vadodara',
    title: 'Website Systems, Design & Online Courses in Vadodara | Nova Skills',
    metaDesc: 'Explore live online professional courses for Vadodara learners in No-Code Web Development, E-Commerce Store Architecture, and UI/UX Design.',
    headline: 'Design Better Digital Experiences. Build Useful Websites.',
    heroSubtitle: 'Explore online training in digital marketing, graphic design, video editing and AI, with additional pathways in no-code websites, e-commerce and UI/UX.',
    editorialTag: 'Website Systems, E-Commerce & User Experience',
    decisionHeading: 'Website Builder\'s Decision Studio',
    decisionSubtitle: 'Determine whether your digital objective requires rapid no-code web deployment, e-commerce store architecture, or product user experience design.',
    decisionTabs: [
      {
        id: 'tab-nocode',
        label: '1. No-Code Web Creation',
        title: 'No-Code Website Professional',
        desc: 'Build responsive client websites, landing pages, and interactive web portfolios without writing complex code.',
        focus: 'Visual Web Development & Landing Pages',
        tools: 'Webflow, WordPress, Elementor, Figma Handoff',
        duration: '3 Months (60+ Guided Hours)',
        outcome: '3 Production-Ready Client Web Portfolios',
        courseId: 'nocode-web-pro'
      },
      {
        id: 'tab-ecom',
        label: '2. E-Commerce Storefronts',
        title: 'E-Commerce Website Mastery',
        desc: 'Architect multi-product online storefronts, integrate payment gateways, configure product catalogs, and streamline checkout operations.',
        focus: 'Store Infrastructure & Conversion Funnels',
        tools: 'Shopify, WooCommerce, Stripe, Razorpay, Google Analytics 4',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '2 Operational Online Retail Stores',
        courseId: 'ecommerce-mastery'
      },
      {
        id: 'tab-uiux',
        label: '3. UI/UX Interface Design',
        title: 'UI/UX Design Professional',
        desc: 'Conduct user research, design wireframes, build scalable Figma component libraries, and validate prototypes with user testing.',
        focus: 'User Research & Interface Systems',
        tools: 'Figma, FigJam, Miro, Prototype Labs',
        duration: '5 Months (100+ Guided Hours)',
        outcome: '5 Comprehensive Product UI/UX Case Studies',
        courseId: 'uiux-design-pro'
      }
    ]
  },

  // 2. DEHRADUN (Gate 07)
  {
    slug: 'dehradun',
    title: 'Live Online Learning Pathways in Dehradun | Nova Skills',
    metaDesc: 'Discover age-appropriate live online learning pathways in Dehradun spanning young learner tech exploration, student coding foundations, and adult career launch.',
    headline: 'Different Learning Stages. The Right Skills for Each.',
    heroSubtitle: 'Explore live online training in digital marketing, design, and AI, alongside clearly separated pathways for young tech explorers, student coders, and career-launching graduates.',
    editorialTag: 'Learning Pathways for Different Stages & Careers',
    decisionHeading: 'Learning Pathways by Learner Stage',
    decisionSubtitle: 'Choose an age-appropriate educational track designed specifically for young learners, foundational student coders, or early-career professionals.',
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
      },
      {
        id: 'tab-career',
        label: '3. Early-Career Professional Readiness',
        title: 'Career Launch & Placement Readiness Professional',
        desc: 'Engineer ATS-compliant resumes, master technical and HR mock interview simulations, build an optimized LinkedIn presence, and prepare for corporate placement rounds.',
        focus: 'Interview Readiness & Application Strategy',
        tools: 'ATS Resume Tools, LinkedIn Talent, Mock Panels',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified ATS Resume & Mock Interview Scorecard',
        courseId: 'career-launch-placement-readiness-professional'
      }
    ]
  },

  // 3. KOTA (Gate 08)
  {
    slug: 'kota',
    title: 'Programming Foundations & Online Courses in Kota | Nova Skills',
    metaDesc: 'Build strong software engineering fundamentals in Kota with live online training in Full Stack Programming, Python Development, and Career Readiness.',
    headline: 'Build a Strong Foundation for What\'s Next.',
    heroSubtitle: 'Explore live online training in programming foundations, Python development, and placement readiness, alongside creative marketing, design, and AI tracks.',
    editorialTag: 'Programming Skills & Technical Progression',
    decisionHeading: 'Your Programming Starting Point',
    decisionSubtitle: 'Compare broad web development foundations, specialized Python programming, and structured career placement preparation.',
    decisionTabs: [
      {
        id: 'tab-fullstack',
        label: '1. Web Development Foundations',
        title: 'Full Stack Programming Foundation',
        desc: 'Learn programming logic, algorithms, semantic HTML5, modern CSS layouts, JavaScript, and backend APIs from the ground up.',
        focus: 'Web Architecture & Frontend/Backend Logic',
        tools: 'JavaScript, Node.js, HTML5, CSS3, VS Code, Git',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '3 Functional Full-Stack Web Applications',
        courseId: 'fullstack-foundation'
      },
      {
        id: 'tab-python',
        label: '2. Python Programming & Logic',
        title: 'Python Developer Professional',
        desc: 'Master Python syntax, object-oriented principles, modular architecture, REST APIs, and database scripting.',
        focus: 'Algorithmic Logic & Backend Scripts',
        tools: 'Python 3, VS Code, Git, SQLite, Requests',
        duration: '3 Months (80+ Guided Hours)',
        outcome: '3 Production Python Automation Projects',
        courseId: 'python-developer'
      },
      {
        id: 'tab-career',
        label: '3. Placement & Career Preparation',
        title: 'Career Launch & Placement Readiness Professional',
        desc: 'Prepare for technical rounds, behavioral interviews, LinkedIn networking, and ATS-optimized resume submission.',
        focus: 'Interview Panels & Professional Resumes',
        tools: 'ATS Analyzers, Mock Interview Rubrics, LinkedIn Strategy',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified ATS Resume & Mock Interview Evaluation',
        courseId: 'career-launch-placement-readiness-professional'
      }
    ]
  },

  // 4. CHHATRAPATI SAMBHAJINAGAR (Gate 09)
  {
    slug: 'chhatrapati-sambhajinagar',
    title: 'Business Systems & Online Courses in Chhatrapati Sambhajinagar | Nova Skills',
    metaDesc: 'Advance your digital business capabilities in Chhatrapati Sambhajinagar with live online training in MIS & BI, E-Commerce Store Architecture, and Office Productivity.',
    headline: 'Make Digital Business Skills Work Together.',
    heroSubtitle: 'Discover live online professional courses in Digital Marketing, Graphic Design, Video Editing and AI, alongside business intelligence, e-commerce, and modern office workflows.',
    editorialTag: 'Business Operations, Digital Commerce & Reporting',
    decisionHeading: 'Understand the Digital Business Workflow',
    decisionSubtitle: 'Examine how retail storefronts, business data reporting, and administrative productivity connect into an operational workflow.',
    decisionTabs: [
      {
        id: 'tab-ops',
        label: '1. OPERATIONS — E-Commerce Retail',
        title: 'E-Commerce Website Mastery',
        desc: 'Configure digital store catalogs, checkout funnels, automated order notifications, and payment processing.',
        focus: 'Online Store Operations & Fulfillment',
        tools: 'Shopify, WooCommerce, Meta Pixel, Inventory Trackers',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '2 Operational Online Retail Stores',
        courseId: 'ecommerce-mastery'
      },
      {
        id: 'tab-rep',
        label: '2. REPORTING — Business Intelligence',
        title: 'MIS & Business Intelligence Professional',
        desc: 'Transform transactional data into automated management dashboards, financial summaries, and actionable operational KPIs.',
        focus: 'Executive Reporting & Performance Dashboards',
        tools: 'Power BI, Advanced Excel, SQL, DAX, Pivot Dashboards',
        duration: '6 Months (120+ Guided Hours)',
        outcome: '1 Complete Corporate MIS Dashboard Capstone',
        courseId: 'biz-productivity'
      },
      {
        id: 'tab-prod',
        label: '3. PRODUCTIVITY — Office Systems',
        title: 'Office Productivity Professional',
        desc: 'Streamline day-to-day office administrative workflows, collaborative spreadsheets, executive slide decks, and team calendars.',
        focus: 'Digital Collaboration & Daily Operations',
        tools: 'Microsoft 365, Google Workspace, Excel Formulas, Slack',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified Office Systems & Operations Toolkit',
        courseId: 'office-pro'
      }
    ]
  },

  // 5. PRAYAGRAJ (Gate 10)
  {
    slug: 'prayagraj',
    title: 'Programming, English & Online Courses in Prayagraj | Nova Skills',
    metaDesc: 'Build a balanced career skill set in Prayagraj with live online training in Python Development, Professional Spoken English, and Placement Readiness.',
    headline: 'Technical Skills and Communication for Career Progress.',
    heroSubtitle: 'Explore live online training in Digital Marketing, Graphic Design, Video Editing and AI, combined with Python programming, spoken English, and job-application readiness.',
    editorialTag: 'Programming, Communication & Career Preparation',
    decisionHeading: 'Build a Balanced Professional Skill Set',
    decisionSubtitle: 'Compare developing software code, building corporate spoken English confidence, and preparing for job application interviews.',
    decisionTabs: [
      {
        id: 'tab-logic',
        label: '1. Technical Software Logic',
        title: 'Python Developer Professional',
        desc: 'Master Python programming syntax, data structures, modular logic, API integrations, and database operations.',
        focus: 'Software Programming & Automation',
        tools: 'Python 3, VS Code, Git, SQLite, Requests',
        duration: '3 Months (80+ Guided Hours)',
        outcome: '3 Practical Python Scripting Projects',
        courseId: 'python-developer'
      },
      {
        id: 'tab-comm',
        label: '2. Corporate Spoken English',
        title: 'Professional Spoken English',
        desc: 'Overcome hesitation, master corporate email etiquette, participate effectively in technical meetings, and speak fluent business English.',
        focus: 'Workplace Fluency & Articulation',
        tools: 'Speech Practice Labs, Business Writing Kits, Voice Rubrics',
        duration: '3 Months (70+ Guided Hours)',
        outcome: 'Corporate Business Communication Portfolio',
        courseId: 'spoken-english-pro'
      },
      {
        id: 'tab-career',
        label: '3. Job Application Readiness',
        title: 'Career Launch & Placement Readiness Professional',
        desc: 'Craft ATS-optimized resumes, prepare for technical and behavioral interviews, optimize your LinkedIn profile, and navigate salary negotiation.',
        focus: 'ATS Resumes & Mock Interview Panels',
        tools: 'ATS Analyzers, Mock Interview Rubrics, LinkedIn Strategy',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified ATS Resume & Mock Interview Scorecard',
        courseId: 'career-launch-placement-readiness-professional'
      }
    ]
  },

  // 6. LUDHIANA (Gate 11)
  {
    slug: 'ludhiana',
    title: 'Digital Commerce & Freelancing Courses in Ludhiana | Nova Skills',
    metaDesc: 'Advance your digital commerce, business productivity, and global client consulting skills from Ludhiana with live online certified programs.',
    headline: 'Create, Manage and Deliver Digital Business Work.',
    heroSubtitle: 'Explore live online training in Digital Marketing, Graphic Design, Video Editing and AI, alongside e-commerce store architecture, office systems, and international freelance client acquisition.',
    editorialTag: 'Digital Business Operations & Client Deliverables',
    decisionHeading: 'Business Workflows and Client Deliverables',
    decisionSubtitle: 'Understand the tangible deliverables taught across e-commerce retail, modern workplace productivity, and client-facing freelancing.',
    decisionTabs: [
      {
        id: 'tab-ecom',
        label: '1. E-Commerce Store Architecture',
        title: 'E-Commerce Website Mastery',
        desc: 'Build scalable multi-product online retail stores, configure automated invoicing, set up payment gateways, and optimize product sales pages.',
        focus: 'Store Infrastructure & Catalog Deliverables',
        tools: 'Shopify, WooCommerce, Stripe, Razorpay, Google Analytics 4',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '2 Operational Online Retail Stores',
        courseId: 'ecommerce-mastery'
      },
      {
        id: 'tab-office',
        label: '2. Corporate Office Systems',
        title: 'Office Productivity Professional',
        desc: 'Organize business documents, automate spreadsheet calculations, produce executive presentations, and coordinate team operations.',
        focus: 'Workflow Documentation & Collaboration',
        tools: 'Microsoft 365, Google Workspace, Excel Formulas, Slack',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified Office Systems & Operations Toolkit',
        courseId: 'office-pro'
      },
      {
        id: 'tab-client',
        label: '3. Freelance Client Deliverables',
        title: 'Freelancing & Client Acquisition Professional',
        desc: 'Structure freelance service packages, craft winning client proposals, negotiate contract terms, and build a recurring international client base.',
        focus: 'International Bidding & Client Contracts',
        tools: 'Upwork, Freelancer, LinkedIn InMail, Stripe Invoicing',
        duration: '2 Months (60+ Guided Hours)',
        outcome: 'Live Freelance Profile & Client Onboarding System',
        courseId: 'freelancing-client-acquisition-professional'
      }
    ]
  },

  // 7. JALANDHAR (Gate 12)
  {
    slug: 'jalandhar',
    title: 'Content Creation & Freelancing Courses in Jalandhar | Nova Skills',
    metaDesc: 'Master video content strategy, professional spoken English, and international client acquisition from Jalandhar with live online training.',
    headline: 'Create Content. Communicate Clearly. Work Professionally.',
    heroSubtitle: 'Discover live online professional programs in Digital Marketing, Graphic Design, Video Editing and AI, alongside YouTube channel growth, spoken English, and global freelancing.',
    editorialTag: 'Content Strategy, English Fluency & Freelancing',
    decisionHeading: 'From Content Skills to Client Communication',
    decisionSubtitle: 'Connect digital content production with clear verbal communication and independent client service delivery.',
    decisionTabs: [
      {
        id: 'tab-content',
        label: '1. Video Content & Channel Strategy',
        title: 'YouTube Growth & Content Strategy Professional',
        desc: 'Plan channel content calendars, produce engaging video content, understand platform algorithms, and configure ethical monetization streams.',
        focus: 'Channel Programming & Audience Growth',
        tools: 'YouTube Studio, Premiere Pro, TubeBuddy, Analytics Dashboards',
        duration: '3 Months (80+ Guided Hours)',
        outcome: 'Channel Growth Roadmap & Video Portfolio',
        courseId: 'youtube-mastery'
      },
      {
        id: 'tab-english',
        label: '2. Professional Spoken English',
        title: 'Professional Spoken English',
        desc: 'Master conversational fluency, participate actively in cross-border client discussions, and present technical concepts without hesitation.',
        focus: 'Verbal Fluency & Cross-Border Discussions',
        tools: 'Speech Practice Labs, Business Writing Kits, Voice Rubrics',
        duration: '3 Months (70+ Guided Hours)',
        outcome: 'Fluent Presentation & Interview Speaking Portfolio',
        courseId: 'spoken-english-pro'
      },
      {
        id: 'tab-freelance',
        label: '3. Global Client Acquisition',
        title: 'Freelancing & Client Acquisition Professional',
        desc: 'Package creative or technical skills into high-converting service offerings, bid on international freelance platforms, and manage client relations.',
        focus: 'Freelance Strategy & Remote Contracts',
        tools: 'Upwork, Fiverr, LinkedIn Outreach, Invoicing Gateways',
        duration: '2 Months (60+ Guided Hours)',
        outcome: 'Verified Freelance Profile & Client Acquisition Pipeline',
        courseId: 'freelancing-client-acquisition-professional'
      }
    ]
  },

  // 8. GORAKHPUR (Gate 13)
  {
    slug: 'gorakhpur',
    title: 'Full Stack Web Dev & Career Courses in Gorakhpur | Nova Skills',
    metaDesc: 'Build certified web development and career communication skills in Gorakhpur with live online training in Full Stack Foundations, Spoken English, and Placement Readiness.',
    headline: 'Learn Technical Skills. Prepare to Apply Them.',
    heroSubtitle: 'Explore live online professional training in Digital Marketing, Graphic Design, Video Editing and AI, combined with full-stack programming foundations, spoken English, and career launch skills.',
    editorialTag: 'Developer Foundations & Professional Communication',
    decisionHeading: 'From Building Applications to Presenting Your Skills',
    decisionSubtitle: 'Understand how foundational coding logic connects with spoken articulation and career placement execution.',
    decisionTabs: [
      {
        id: 'tab-code',
        label: '1. Code Construction & Logic',
        title: 'Full Stack Programming Foundation',
        desc: 'Build functional web applications from scratch using modern JavaScript, semantic HTML5, CSS layout principles, and server APIs.',
        focus: 'Software Syntax & Web Architecture',
        tools: 'JavaScript, Node.js, HTML5, CSS3, VS Code, Git',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '3 Beginner-to-Intermediate Web Projects',
        courseId: 'fullstack-foundation'
      },
      {
        id: 'tab-expression',
        label: '2. Professional Expression & English',
        title: 'Professional Spoken English',
        desc: 'Develop fluency in technical meetings, practice clear sentence construction, master professional vocabulary, and overcome conversational hesitation.',
        focus: 'Workplace Articulation & Interview Speaking',
        tools: 'Speech Practice Labs, Dialogue Frameworks, Listening Labs',
        duration: '3 Months (70+ Guided Hours)',
        outcome: 'Fluent Presentation & Interview Speaking Portfolio',
        courseId: 'spoken-english-pro'
      },
      {
        id: 'tab-placement',
        label: '3. Placement Execution & Resumes',
        title: 'Career Launch & Placement Readiness Professional',
        desc: 'Engineer ATS-compliant resumes, participate in technical and behavioral mock interview panels, optimize LinkedIn profiles, and master salary negotiation.',
        focus: 'ATS Resumes & Mock Interview Panels',
        tools: 'ATS Resume Tools, LinkedIn Talent, Mock Panels',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified ATS Resume & Mock Interview Scorecard',
        courseId: 'career-launch-placement-readiness-professional'
      }
    ]
  },

  // 9. GWALIOR (Gate 14)
  {
    slug: 'gwalior',
    title: 'UI/UX, Python & Online Courses in Gwalior | Nova Skills',
    metaDesc: 'Explore problem-solving methods through technology in Gwalior with live online training in UI/UX Product Design, Python Development, and AI Productivity.',
    headline: 'Explore Different Ways to Create With Technology.',
    heroSubtitle: 'Build certified capabilities in Digital Marketing, Graphic Design, Video Editing and AI, alongside product interface design, Python programming, and AI workflow tools.',
    editorialTag: 'Interface Thinking, Python Logic & Practical AI',
    decisionHeading: 'Choose Your Method of Digital Problem-Solving',
    decisionSubtitle: 'Determine whether your creative strengths lean toward designing digital interfaces, writing Python backend scripts, or applying generative AI tools.',
    decisionTabs: [
      {
        id: 'tab-ui',
        label: '1. Interface Thinking & User Flow',
        title: 'UI/UX Design Professional',
        desc: 'Conduct user interviews, design responsive wireframes, build scalable Figma component libraries, and validate prototypes with user testing.',
        focus: 'User Research & Interface Architecture',
        tools: 'Figma, FigJam, Miro, Prototype Labs',
        duration: '5 Months (100+ Guided Hours)',
        outcome: '5 Comprehensive Product UI/UX Case Studies',
        courseId: 'uiux-design-pro'
      },
      {
        id: 'tab-python',
        label: '2. Python Algorithmic Logic',
        title: 'Python Developer Professional',
        desc: 'Master Python programming syntax, data structures, modular logic, API integrations, and database operations.',
        focus: 'Software Programming & Data Handling',
        tools: 'Python 3, VS Code, Git, SQLite, Requests',
        duration: '3 Months (80+ Guided Hours)',
        outcome: '3 Practical Python Scripting Projects',
        courseId: 'python-developer'
      },
      {
        id: 'tab-ai',
        label: '3. Generative AI Workflows',
        title: 'AI Productivity Professional',
        desc: 'Apply prompt design frameworks, automate recurring communication drafts, synthesize market research, and streamline professional workflows with AI.',
        focus: 'Generative Prompt Engineering & Synthesis',
        tools: 'ChatGPT, Claude, Notion AI, Prompt Craft Labs',
        duration: '2 Months (40+ Guided Hours)',
        outcome: 'Personalized AI Automation Suite',
        courseId: 'ai-productivity'
      }
    ]
  },

  // 10. HISAR (Gate 15)
  {
    slug: 'hisar',
    title: 'Websites, Business Data & Online Courses in Hisar | Nova Skills',
    metaDesc: 'Build practical digital skills for modern workplace operations in Hisar with live online training in No-Code Websites, MIS & BI, and Office Productivity.',
    headline: 'Build Digital Skills for Everyday Professional Work.',
    heroSubtitle: 'Discover live online professional programs in Digital Marketing, Graphic Design, Video Editing and AI, alongside no-code website building, business intelligence, and office software.',
    editorialTag: 'Website Systems, Business Data & Office Productivity',
    decisionHeading: 'Three Practical Digital Workflows',
    decisionSubtitle: 'Compare the core deliverables of rapid website creation, business data analysis, and digital office management.',
    decisionTabs: [
      {
        id: 'tab-web',
        label: '1. Rapid Website Creation',
        title: 'No-Code Website Professional',
        desc: 'Build responsive client websites, landing pages, and interactive client portfolios using modern visual builders without manual coding.',
        focus: 'Visual Web Builders & Landing Pages',
        tools: 'Webflow, WordPress, Elementor, Figma Handoff',
        duration: '3 Months (60+ Guided Hours)',
        outcome: '3 Production-Ready Client Web Portfolios',
        courseId: 'nocode-web-pro'
      },
      {
        id: 'tab-data',
        label: '2. Business Data Analysis',
        title: 'MIS & Business Intelligence Professional',
        desc: 'Transform business metrics into clear visual insights, executive dashboards, automated spreadsheets, and relational data queries.',
        focus: 'Corporate Data Analysis & Dashboards',
        tools: 'Advanced Excel, Power BI, SQL Queries, PivotTables, DAX',
        duration: '6 Months (120+ Guided Hours)',
        outcome: '1 Complete Corporate MIS Dashboard Capstone',
        courseId: 'biz-productivity'
      },
      {
        id: 'tab-office',
        label: '3. Office Administration & Tools',
        title: 'Office Productivity Professional',
        desc: 'Streamline day-to-day office administration, automated spreadsheet reporting, team documentation, calendar workflows, and digital collaboration.',
        focus: 'Digital Workplace Operations',
        tools: 'Microsoft 365, Google Workspace, Excel Formulas, Slack',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified Office Systems & Operations Toolkit',
        courseId: 'office-pro'
      }
    ]
  },

  // 11. BASTI (Gate 16 - EXACTLY 2 ADDITIONAL COURSES)
  {
    slug: 'basti',
    title: 'English & Office Skills Online Courses in Basti | Nova Skills',
    metaDesc: 'Strengthen practical communication and workplace software capabilities in Basti with live online training in Professional Spoken English and Office Productivity.',
    headline: 'Strengthen Everyday Workplace Skills.',
    heroSubtitle: 'Explore live online professional programs in Digital Marketing, Graphic Design, Video Editing and AI, with foundational training in spoken English and modern office productivity.',
    editorialTag: 'Communication & Office Skills Foundations',
    decisionHeading: 'Practical Skills for Communication and Office Work',
    decisionSubtitle: 'Choose your focus between building spoken English communication fluency and mastering everyday workplace software.',
    decisionTabs: [
      {
        id: 'tab-spoken',
        label: '1. "Improve My Spoken Communication"',
        title: 'Professional Spoken English',
        desc: 'Overcome speaking hesitation, practice professional email drafting, participate actively in group discussions, and build clear English communication skills.',
        focus: 'Spoken Fluency & Professional Expression',
        tools: 'Speech Practice Labs, Business Writing Kits, Dialogue Rubrics',
        duration: '3 Months (70+ Guided Hours)',
        outcome: 'Fluent Presentation & Interview Speaking Portfolio',
        courseId: 'spoken-english-pro'
      },
      {
        id: 'tab-office',
        label: '2. "Improve My Workplace Software Skills"',
        title: 'Office Productivity Professional',
        desc: 'Master document formatting, collaborative cloud spreadsheets, presentation templates, team communication channels, and office calendar scheduling.',
        focus: 'Digital Office Applications & Spreadsheets',
        tools: 'Microsoft 365, Google Workspace, Excel Formulas, Teams',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Modern Digital Workplace Operations Blueprint',
        courseId: 'office-pro'
      }
    ]
  },

  // 12. AZAMGARH (Gate 17 - EXACTLY 2 ADDITIONAL COURSES)
  {
    slug: 'azamgarh',
    title: 'Programming & Freelancing Online Courses in Azamgarh | Nova Skills',
    metaDesc: 'Learn foundational coding and global freelance client acquisition from Azamgarh with live online certified programs in Full Stack Foundations and Freelancing.',
    headline: 'Learn to Build. Understand How to Work With Clients.',
    heroSubtitle: 'Discover live online professional programs in Digital Marketing, Graphic Design, Video Editing and AI, alongside foundational web development and global freelance client acquisition.',
    editorialTag: 'Programming Foundations & Independent Project Work',
    decisionHeading: 'Technical Work and Client-Facing Skills',
    decisionSubtitle: 'Compare developing practical software applications with understanding client briefs, contract negotiations, and freelance workflows.',
    decisionTabs: [
      {
        id: 'tab-fullstack',
        label: '1. Full Stack Coding Foundations',
        title: 'Full Stack Programming Foundation',
        desc: 'Build functional web applications from scratch using modern JavaScript, semantic HTML5, modern CSS layouts, and backend APIs.',
        focus: 'Web Architecture & Software Logic',
        tools: 'JavaScript, Node.js, HTML5, CSS3, VS Code, Git',
        duration: '4 Months (90+ Guided Hours)',
        outcome: '3 Functional Full-Stack Web Applications',
        courseId: 'fullstack-foundation'
      },
      {
        id: 'tab-freelance',
        label: '2. Freelancing & Client Consulting',
        title: 'Freelancing & Client Acquisition Professional',
        desc: 'Structure freelance service offerings, bid on international talent platforms, write compelling project proposals, manage milestone deliverables, and issue invoices.',
        focus: 'Contract Negotiation & Global Client Bidding',
        tools: 'Upwork, Freelancer, LinkedIn InMail, Stripe Invoicing',
        duration: '2 Months (60+ Guided Hours)',
        outcome: 'Live Freelance Profile & Client Onboarding System',
        courseId: 'freelancing-client-acquisition-professional'
      }
    ]
  },

  // 13. SULTANPUR (Gate 18 - EXACTLY 2 ADDITIONAL COURSES)
  {
    slug: 'sultanpur',
    title: 'Coding & Career-Focused Online Courses in Sultanpur | Nova Skills',
    metaDesc: 'Explore live online education in Sultanpur tailored to distinct learner stages: foundational coding for youth and career placement readiness for graduates.',
    headline: 'Explore the Right Skills for Your Learning Stage.',
    heroSubtitle: 'Discover live online professional programs in Digital Marketing, Graphic Design, Video Editing and AI, alongside dedicated pathways for student coders and career-launching graduates.',
    editorialTag: 'Career Preparation & Young Learner Coding',
    decisionHeading: 'Two Distinct Learning Journeys',
    decisionSubtitle: 'Choose between structured coding fundamentals for school learners or intensive career placement preparation for college graduates.',
    decisionTabs: [
      {
        id: 'tab-grad',
        label: '1. Career Launch for Graduates',
        title: 'Career Launch & Placement Readiness Professional',
        desc: 'Engineer ATS-compliant resumes, master technical and HR mock interview simulations, build an optimized LinkedIn presence, and learn salary negotiation.',
        focus: 'ATS Resumes & Mock Interview Panels',
        tools: 'ATS Resume Tools, LinkedIn Talent, Mock Panels',
        duration: '2 Months (50+ Guided Hours)',
        outcome: 'Verified ATS Resume & Mock Interview Scorecard',
        courseId: 'career-launch-placement-readiness-professional'
      },
      {
        id: 'tab-youth',
        label: '2. Coding Foundations for Youth (Ages 12-18)',
        title: 'Young Coders Program',
        desc: 'Develop real programming confidence through Python fundamentals, interactive game creation, algorithmic problem solving, and basic web building blocks.',
        focus: 'Algorithmic Thinking & Software Syntax',
        tools: 'Python, Pygame, VS Code, HTML5 Basics',
        duration: '3 Months (50+ Guided Hours)',
        outcome: '3 Interactive Python Games & Projects',
        courseId: 'young-coders'
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
         SECTION 04: RECOMMENDED ADDITIONAL PROGRAMS
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
         SECTION 05: UNIQUE DECISION-SUPPORT MODULE (GATES 06 - 18)
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
  <script src="/js/components.min.js?v=2.8.0" defer></script>
  <script src="/js/icon-system.js" defer></script>
  <script src="/js/locations-city.js" defer></script>
</body>
</html>`;
}

function compileP2Cities(targetCities = null) {
  const configsToBuild = targetCities 
    ? P2_CONFIGS.filter(c => targetCities.includes(c.slug))
    : P2_CONFIGS;

  console.log(`Compiling ${configsToBuild.length} P2 City Pages...\n`);

  configsToBuild.forEach(cfg => {
    const html = generateCityHtml(cfg);
    const targetDir = path.join(ROOT_DIR, 'branches', cfg.slug);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, html, 'utf8');
    console.log(`  ✓ Generated: branches/${cfg.slug}/index.html (${(html.length / 1024).toFixed(2)} KB)`);
  });

  console.log(`\nSuccessfully pre-rendered ${configsToBuild.length} P2 city pages.`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const targets = args.length > 0 ? args : null;
  compileP2Cities(targets);
}

module.exports = {
  P2_CONFIGS,
  generateCityHtml,
  compileP2Cities
};
