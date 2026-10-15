const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

const ACADEMIES_DATA = {
  'digital-marketing': {
    title: 'Digital Marketing Course & Certification | Nova Skills Academy',
    metaDesc: 'Master Digital Marketing with 100% practical training in SEO, Google Ads, Meta Ads & AI tools. Classroom & live online batches with 100% placement support.',
    h1: 'Digital Marketing Academy: Job-Ready Training & Certification',
    faqs: [
      { q: 'What is covered in the Digital Marketing Course?', a: 'The course covers Search Engine Optimization (SEO), Generative Engine Optimization (GEO), Google Ads, Meta Ads Manager, GA4 Analytics, Content Marketing, and AI marketing workflows.' },
      { q: 'Are classes available online for students outside Siddharth Nagar?', a: 'Yes! We offer live interactive online batches with dedicated doubt-clearing sessions and portfolio reviews for students across Mumbai, Delhi, and Pan-India.' },
      { q: 'Do you provide placement assistance?', a: 'Yes, our career and professional programs include 100% placement assistance, resume preparation, mock interviews, and direct employer hiring connections.' },
      { q: 'Will I receive an industry-recognized certificate?', a: 'Yes, upon completing your live projects and practical assessments, you will receive an official certification from Nova Skills Education Institute.' }
    ]
  },
  '3d': {
    title: '3D Academy — 3ds Max, Blender & V-Ray Courses | Nova Skills',
    metaDesc: 'Master 3D modeling, interior rendering & animation with 3ds Max, Blender, Unreal Engine & V-Ray. Hands-on portfolio projects with career placement support.',
    h1: '3D Academy: Practical 3D Modeling, ArchViz & Animation Training',
    faqs: [
      { q: 'Which software tools will I learn in the 3D Academy?', a: 'You will master Autodesk 3ds Max, Blender 4, Chaos V-Ray 6, and Unreal Engine 5 for architectural visualization and 3D modeling.' },
      { q: 'Can beginners join without previous design experience?', a: 'Yes, our courses begin with foundational 3D coordinate space and modeling logic before advancing to high-end lighting, texturing, and photorealistic rendering.' },
      { q: 'Is this course available in live online mode?', a: 'Yes, you can attend live instructor-led online sessions with screen sharing, project feedback, and recorded access.' },
      { q: 'Do you provide portfolio and placement support?', a: 'Yes, students build a complete architectural or game asset portfolio ready to showcase to animation studios and interior firms.' }
    ]
  },
  'kids-tech': {
    title: 'Kids Tech Academy — Coding, AI & Robotics for Ages 8–16 | Nova Skills',
    metaDesc: 'Empower your child with future tech skills. Hands-on coding, Scratch, Python, game development & AI fundamentals for kids aged 8–16. Safe interactive learning.',
    h1: 'Kids Tech Academy: Coding, AI & Future Skills for Young Innovators',
    faqs: [
      { q: 'What age groups are eligible for Kids Tech Academy?', a: 'Our programs are tailored for young learners aged 8 to 16, divided into junior tracks (ages 8–11) and senior tracks (ages 12–16).' },
      { q: 'What skills will children learn?', a: 'Kids learn computational thinking, Scratch visual programming, Python fundamentals, game design, and safe generative AI tools.' },
      { q: 'Is prior computer programming experience required?', a: 'No prior experience is necessary. Our certified mentors guide students through fun, interactive, and project-based challenges.' }
    ]
  },
  'video-motion': {
    title: 'Video Editing & Motion Graphics Course | Premiere Pro & After Effects',
    metaDesc: 'Learn professional video editing & motion design in Premiere Pro, DaVinci Resolve & After Effects. Build a commercial showreel with 100% placement support.',
    h1: 'Video & Motion Academy: Professional Post-Production & VFX Training',
    faqs: [
      { q: 'What software is taught in Video & Motion Academy?', a: 'You will learn Adobe Premiere Pro, After Effects, DaVinci Resolve Studio, and CapCut Pro for short-form and long-form video editing.' },
      { q: 'Will I build a portfolio or showreel?', a: 'Yes, every student completes a commercial showreel featuring social media video ads, YouTube documentaries, and kinetic typography.' },
      { q: 'Are placement opportunities available for video editors?', a: 'Yes, video editing is one of the highest-demand skills. We connect students with creative agencies, media houses, and freelance client platforms.' }
    ]
  },
  'programming': {
    title: 'Web & App Development Courses — Full-Stack & Python | Nova Skills',
    metaDesc: 'Learn Full-Stack Web Development, Python, and Mobile Apps with live project building. Master HTML, CSS, JavaScript, React & Node.js with placement support.',
    h1: 'Programming Academy: Full-Stack Web & Software Engineering Training',
    faqs: [
      { q: 'What technologies will I learn in Programming Academy?', a: 'Curriculum covers modern HTML5, CSS3, modern JavaScript (ES6+), React.js, Node.js, Express, MongoDB, SQL, and Python software development.' },
      { q: 'Do I get to build real web applications?', a: 'Yes, you will build 3+ production-ready full-stack applications with user authentication, database management, and cloud deployment.' },
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
      { q: 'How does AI automation help in my career?', a: 'Organizations are aggressively adopting AI agents and automated pipelines. Certified AI specialists earn premium salaries and consulting retainers.' }
    ]
  },
  'design': {
    title: 'Graphic Design & UI/UX Academy — Figma & Adobe Suite | Nova Skills',
    metaDesc: 'Master graphic design, brand identity, and UI/UX with Figma, Photoshop & Illustrator. Build a hiring-ready design portfolio with 100% placement support.',
    h1: 'Design Academy: Graphic Design, Branding & UI/UX Training',
    faqs: [
      { q: 'Which design tools are taught?', a: 'You will master Figma, Adobe Photoshop, Adobe Illustrator, and CorelDRAW for branding, UI/UX, and marketing creatives.' },
      { q: 'Will I have a portfolio upon graduation?', a: 'Yes, you will publish a verified Behance and Figma case study portfolio ready for design agency interviews.' },
      { q: 'Are both online and offline classes available?', a: 'Yes, we provide flexible offline studio lab access in Siddharth Nagar and live interactive online cohorts.' }
    ]
  },
  'no-code-web': {
    title: 'No-Code Web Academy — Webflow, WordPress & Shopify | Nova Skills',
    metaDesc: 'Build client websites without code using Webflow, WordPress, Shopify & Framer. Master freelancing and agency web development with practical client projects.',
    h1: 'No-Code Web Academy: Webflow, WordPress & E-Commerce Development',
    faqs: [
      { q: 'Can I really build professional websites without code?', a: 'Yes, modern platforms like Webflow, WordPress, Shopify, and Framer power millions of enterprise websites. You will build responsive, functional sites with zero coding.' },
      { q: 'What career paths are available in No-Code development?', a: 'Graduates work as freelance website builders, Shopify store developers, and digital agency web specialists.' }
    ]
  },
  'creator': {
    title: 'Creator Academy — YouTube, Content Creation & Monetization | Nova Skills',
    metaDesc: 'Learn audience building, YouTube growth, viral content strategy & personal branding. Master content monetization and social media production workflows.',
    h1: 'Creator Academy: Content Strategy, YouTube & Personal Branding',
    faqs: [
      { q: 'What does Creator Academy focus on?', a: 'The program focuses on YouTube channel growth, Instagram Reels scripting, camera confidence, audio/lighting setups, and multi-stream monetization.' },
      { q: 'How will this help me monetize my content?', a: 'You will learn sponsorship pitching, affiliate marketing funnels, digital product launches, and ad revenue optimization.' }
    ]
  },
  'communication': {
    title: 'Communication Academy — Business English & Interview Skills | Nova Skills',
    metaDesc: 'Boost your career with fluent business English, corporate communication, public speaking, and job interview mastery. Practical confidence training.',
    h1: 'Communication Academy: Business English, Public Speaking & Career Confidence',
    faqs: [
      { q: 'Who is Communication Academy designed for?', a: 'It is designed for students, job-seekers, and working professionals seeking to speak fluent English, excel in interviews, and lead meetings with confidence.' },
      { q: 'How are classes conducted?', a: 'Classes are interactive workshops with real-world role-plays, mock interviews, speech practice, and personalized feedback from expert trainers.' }
    ]
  },
  'office-productivity': {
    title: 'Office Productivity Academy — Advanced Excel, MIS & AI Tools | Nova Skills',
    metaDesc: 'Master Advanced Excel, Google Sheets, MIS reporting, PowerPoint presentations, and AI productivity tools for high-efficiency office and corporate work.',
    h1: 'Office Productivity Academy: Advanced Excel, MIS & Workplace Tools',
    faqs: [
      { q: 'What Excel topics are covered in Office Productivity Academy?', a: 'You will master VLOOKUP, XLOOKUP, INDEX-MATCH, Pivot Tables, Power Query, automated macros, and dynamic dashboard design.' },
      { q: 'How do AI tools integrate into this course?', a: 'You will learn how to use ChatGPT and Microsoft Copilot to automate data cleaning, formulas, email drafting, and slide deck generation.' }
    ]
  },
  'career-freelancing': {
    title: 'Career & Freelancing Academy — Upwork, Fiverr & Agency Growth | Nova Skills',
    metaDesc: 'Learn how to get high-paying freelance clients on Upwork, Fiverr, and LinkedIn. Master international client pitching, proposals, pricing, and scaling.',
    h1: 'Career & Freelancing Academy: High-Income Client Acquisition & Agency Growth',
    faqs: [
      { q: 'How will I find international freelance clients?', a: 'You will learn optimized profile creation on Upwork and Fiverr, high-converting proposal writing, international payment setups, and direct LinkedIn outreach.' },
      { q: 'Do you help with contract pricing and negotiation?', a: 'Yes, you will master hourly vs project-based pricing, retainer contracts, and negotiation techniques to close high-ticket clients.' }
    ]
  }
};

let updatedCount = 0;

Object.entries(ACADEMIES_DATA).forEach(([slug, data]) => {
  const filePath = path.join(repoRoot, 'academies', slug, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Update Title
  html = html.replace(/<title>([^<]*)<\/title>/i, `<title>${data.title}</title>`);

  // 2. Update Meta Description
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${data.metaDesc}">`);

  // 3. Update OG Tags
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${data.title}">`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${data.metaDesc}">`);

  // 4. Update Twitter Tags
  html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${data.title}">`);
  html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${data.metaDesc}">`);

  // 5. Update Static H1
  html = html.replace(/<h1 id=["']academy-name-display["'][^>]*>([\s\S]*?)<\/h1>/i, `<h1 id="academy-name-display" class="academy-hero-title">${data.h1}</h1>`);

  // 6. Update Static Hero Description with Delivery Badge
  const deliveryBadgeHtml = `<span class="badge-delivery" style="display:inline-block; background:rgba(117,215,102,0.15); color:#75d766; border:1px solid rgba(117,215,102,0.3); padding:4px 12px; border-radius:50px; font-size:0.85rem; font-weight:700; margin-bottom:12px;">📍 Classroom in Siddharth Nagar • 💻 Live Interactive Online (Pan-India & Mumbai)</span><br>`;
  
  // If delivery badge not already present in static desc
  if (!html.includes('badge-delivery')) {
    html = html.replace(/(<p id=["']academy-desc-display["'][^>]*>)/i, `$1\n          ${deliveryBadgeHtml}`);
  }

  // 7. Inject Structured Data Suite before </head>
  const canonicalUrl = `https://novaskills.in/academies/${slug}/`;
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": data.title,
        "description": data.metaDesc,
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
            "item": "https://novaskills.in/courses.html"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": data.h1.split(':')[0],
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${canonicalUrl}#program`,
        "name": data.h1,
        "description": data.metaDesc,
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Nova Skills Education Institute",
          "url": "https://novaskills.in/",
          "logo": "https://novaskills.in/public/images/seo/og-banner.png?v=2026"
        },
        "educationalProgramMode": "Hybrid"
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": data.faqs.map(f => ({
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

  const schemaScriptTag = `\n  <!-- Structured Data: JSON-LD Suite -->\n  <script type="application/ld+json">\n${JSON.stringify(schemaGraph, null, 2)}\n  </script>\n`;

  // Remove existing static JSON-LD if present, then insert fresh
  html = html.replace(/<!-- Structured Data: JSON-LD Suite -->[\s\S]*?<\/script>/i, '');
  html = html.replace('</head>', `${schemaScriptTag}</head>`);

  fs.writeFileSync(filePath, html, 'utf8');
  updatedCount++;
  console.log(`✅ Updated /academies/${slug}/index.html`);
});

console.log(`\n🎉 Successfully updated ${updatedCount} static Academy pages!`);
