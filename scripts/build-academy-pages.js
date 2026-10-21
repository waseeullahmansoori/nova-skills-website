/**
 * Enhanced Static HTML Generator for All 12 Nova Skills Academies
 * Pre-renders full course cards, links, accurate counts, and SEO schemas.
 * Nova Skills V1.2 Technical SEO Remediation
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const dataJs = fs.readFileSync(path.join(rootDir, 'data.js'), 'utf8');
vm.runInThisContext(dataJs);

const ACADEMIES_DATA = {
  'digital-marketing': {
    title: 'Digital Marketing Course & Certification | Nova Skills Academy',
    metaDesc: 'Master Digital Marketing with 100% practical training in SEO, Google Ads, Meta Ads & AI tools. Classroom & live online batches with dedicated placement assistance.',
    h1: 'Digital Marketing Academy: Job-Ready Training & Certification',
    faqs: [
      { q: 'What is covered in the Digital Marketing Course?', a: 'The curriculum covers Search Engine Optimization (SEO), Generative Engine Optimization (GEO), Google Ads, Meta Ads Manager, GA4 Analytics, Content Marketing, and AI marketing workflows.' },
      { q: 'Are classes available online for students outside Siddharth Nagar?', a: 'Yes! We offer live interactive online batches with dedicated doubt-clearing sessions and portfolio reviews for students across Pan-India and Mumbai.' },
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
  if (str.includes('professional') || str.includes('pro')) return 'Professional Program';
  if (str.includes('cert')) return 'Certification Course';
  return level;
}

function buildCourseCardHTML(course, extraClass = '') {
  const safeName = (course.name || '').replace(/'/g, "\\'");
  const safeAcademy = (course.academy || '').replace(/'/g, "\\'");
  const origPrice = course.originalPrice ? `₹${course.originalPrice.toLocaleString('en-IN')}` : '';
  const isFeatured = course.featured || (course.tags && course.tags.includes('popular'));
  const liveProj = course.liveProjects || 2;
  const rating = course.rating || 4.8;
  const reviews = course.reviews || 120;
  const normLevel = normalizeProgramLevel(course.programLevel || course.level);
  const courseUrl = `/course-detail.html?id=${course.id}`;

  return `
    <div class="course-card ${extraClass}" data-category="${course.academyId}" data-level="${normLevel}" data-title="${(course.name || '').replace(/"/g, '&quot;')}" data-desc="${(course.shortDesc || '').replace(/"/g, '&quot;')}">
      ${isFeatured ? '<span class="course-hot-tag">🔥 Popular</span>' : ''}
      <div class="course-thumbnail">
        <div class="course-thumb-bg" style="background:${course.color || 'linear-gradient(135deg, #0599a8, #011731)'}">
          <span style="font-size:3.5rem; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.2));">${course.icon || '🎓'}</span>
        </div>
        <div class="course-badge-overlay">
          <span class="course-level-badge">${normLevel || course.level || 'All Levels'}</span>
        </div>
        <div class="course-duration-badge">⏱️ ${course.duration || 'Flexible'}</div>
      </div>
      <div class="course-body">
        <div class="course-academy-tag">${course.icon || '🎓'} ${course.academy || ''}</div>
        <h3 class="course-title"><a href="${courseUrl}">${course.name}</a></h3>
        <p class="course-desc">${course.shortDesc || course.description || ''}</p>
        <div class="course-features">
          <span class="feature-item">💻 ${liveProj}+ Live Projects</span>
          <span class="feature-item">📜 ISO Certificate</span>
          ${course.placementSupport ? '<span class="feature-item" style="color:var(--green); font-weight:700;">🎯 Placement Support</span>' : ''}
          <span class="feature-item">⭐ ${rating} (${reviews})</span>
        </div>
        <div class="course-footer" style="flex-direction:column; gap:12px; align-items:stretch;">
          <div class="course-pricing" style="display:flex; justify-content:space-between; align-items:baseline;">
            <span class="price-current">₹${course.price ? course.price.toLocaleString('en-IN') : 'Free'}</span>
            ${origPrice ? `<span class="price-original">${origPrice}</span>` : ''}
          </div>
          <div style="display:flex; gap:10px; width:100%; margin-top:8px;">
            <a href="${courseUrl}" class="btn btn-outline btn-sm" style="flex:1; text-align:center; justify-content:center;">View Details</a>
            <button type="button" class="btn btn-primary btn-sm" style="flex:1; justify-content:center;" onclick="openEnrollmentModal('${safeName}', '${safeAcademy}')">Enroll Now →</button>
          </div>
        </div>
      </div>
    </div>
  `;
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
    .map(slug => NS_ACADEMIES.find(a => a.slug === slug || a.id === slug))
    .filter(Boolean)
    .slice(0, 4);
}

function generateAcademySectionsHTML(academy, academyCourses, seoData) {
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
              <li style="display:flex; gap:10px; font-size:0.95rem; color:#334155; align-items:flex-start;"><span style="color:#0599a8; font-weight:800;">✓</span> <span>Dedicated Placement Support & Interview Prep</span></li>
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
            <h4 style="font-size: 0.95rem; font-weight: 700; color: white; margin: 0 0 6px;">Placement</h4>
            <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Job Referrals & Freelance</p>
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
          <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
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
          <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
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
          <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
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

        <div id="explorer-courses-grid" class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
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
  const waMsg = encodeURIComponent(`Hi Nova Skills, I want to know more about admission & fees for ${academy.name}.`);
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
          <a href="tel:+919695904440" class="btn btn-outline btn-lg" style="color: white; border-color: rgba(255,255,255,0.5);">📞 Call Now</a>
          <a href="https://wa.me/919695904440?text=${waMsg}" target="_blank" rel="noopener" class="btn btn-outline btn-lg" style="color: #75d766; border-color: #75d766;">💬 WhatsApp Us</a>
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

NS_ACADEMIES.forEach(acad => {
  const slug = acad.slug;
  const canonicalUrl = `https://novaskills.in/academies/${slug}/`;
  const seoConfig = ACADEMIES_DATA[slug] || {};
  const pageTitle = seoConfig.title || `${acad.name} — Nova Skills Education Institute`;
  const metaDesc = seoConfig.metaDesc || `Master ${acad.name} with 100% practical training, live client projects, and placement assistance at Nova Skills Institute.`;
  const heroH1 = seoConfig.h1 || `${acad.name}: Job-Ready Practical Training & Certification`;
  const ogImage = `https://novaskills.in/public/images/seo/og-banner.png?v=2026`;

  const academyCourses = NS_COURSES.filter(c => c.academyId === acad.id || c.academyId === acad.slug);
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
      min-height: 112px;
    }
    @media (max-width: 1024px) {
      #ns-header:empty {
        min-height: 104px;
      }
    }
    .academy-hero-section {
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
  </style>

  <link rel="stylesheet" href="/css/styles.min.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/css/styles.min.css"></noscript>

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
    <section id="academy-hero-section" class="academy-hero-section">
      <div class="container">
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
          <span class="badge-delivery" style="display:inline-block; background:rgba(117,215,102,0.15); color:#75d766; border:1px solid rgba(117,215,102,0.3); padding:4px 12px; border-radius:50px; font-size:0.85rem; font-weight:700; margin-bottom:12px;">📍 Classroom in Siddharth Nagar • 💻 Live Interactive Online (Pan-India & Mumbai)</span><br>
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
        <div class="academy-actions" style="display:flex; gap:12px; flex-wrap:wrap;">
          <button id="btn-enroll-now" class="btn btn-primary btn-lg" onclick="openEnrollmentModal('', '${(acad.name || '').replace(/'/g, "\\'")}')">Enroll Now →</button>
          <button id="btn-free-consultation" class="btn btn-outline btn-lg" style="color:white; border-color:rgba(255,255,255,0.4);" onclick="openConsultationPopup()">Free Consultation</button>
        </div>
      </div>
    </section>

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
  <script src="/js/data.min.js" defer></script>
  <script src="/js/components.min.js" defer></script>
  <script src="/nova-ai-widget.js?v=3.0" defer></script>
  <script src="/academy-detail.js" defer></script>
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
