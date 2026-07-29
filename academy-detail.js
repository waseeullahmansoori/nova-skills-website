/* ============================================================
   NOVA SKILLS – Academy Detail & Smart Recommendation System
   Handles dynamic rendering of 12 Academies & "Explore Other Academies"
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initAcademyPage();
});

function getAcademySlug() {
  const params = new URLSearchParams(window.location.search);
  let slug = params.get('academy') || params.get('id');
  if (!slug) {
    // Default fallback to digital-marketing
    slug = 'digital-marketing';
  }
  return slug.toLowerCase().trim();
}

function initAcademyPage() {
  const slug = getAcademySlug();

  // Find academy metadata from NS_ACADEMIES or build default dictionary
  const academy = NS_ACADEMIES.find(a => a.id === slug) || {
    id: slug,
    name: formatAcademyName(slug),
    icon: getAcademyIcon(slug),
    color: 'linear-gradient(135deg, #0599a8, #011731)'
  };

  // Find courses belonging to this academy
  const academyCourses = NS_COURSES.filter(c => c.academyId === academy.id || c.academy.toLowerCase().includes(academy.name.toLowerCase().replace(' academy', '')));

  // Render Page Content
  renderAcademyHero(academy, academyCourses);
  renderAcademyOverview(academy, academyCourses);
  renderAcademyCourses(academyCourses, academy);
  renderOtherAcademiesRecommendations(academy.id);
  injectSEOMetadata(academy, academyCourses);
}

function formatAcademyName(slug) {
  const map = {
    'digital-marketing': 'Digital Marketing Academy',
    'ai': 'AI Academy',
    'kids': 'Kids Tech Academy',
    'design': 'Design Academy',
    'video': 'Video & Motion Academy',
    '3d': '3D Academy',
    'nocode': 'No-Code Web Academy',
    'programming': 'Programming Academy',
    'creator': 'Creator Academy',
    'office': 'Office Productivity Academy',
    'communication': 'Communication Academy',
    'career': 'Career Academy'
  };
  return map[slug] || (slug.charAt(0).toUpperCase() + slug.slice(1) + ' Academy');
}

function getAcademyIcon(slug) {
  const icons = {
    'digital-marketing': '📊',
    'ai': '🤖',
    'kids': '👨‍💻',
    'design': '🎨',
    'video': '🎬',
    '3d': '🏗️',
    'nocode': '🌐',
    'programming': '💻',
    'creator': '🎥',
    'office': '📋',
    'communication': '💬',
    'career': '💼'
  };
  return icons[slug] || '🎓';
}

/* Smart Recommendation Logic Map */
function getSmartRelatedAcademyIds(currentId) {
  const smartMap = {
    'ai': ['programming', 'digital-marketing', 'nocode', '3d'],
    'design': ['video', 'creator', '3d', 'nocode'],
    'digital-marketing': ['ai', 'creator', 'nocode', 'communication'],
    'programming': ['ai', 'nocode', '3d', 'office'],
    'video': ['creator', 'design', '3d', 'digital-marketing'],
    '3d': ['design', 'video', 'programming', 'ai'],
    'nocode': ['digital-marketing', 'programming', 'design', 'ai'],
    'kids': ['programming', 'ai', 'design', 'video'],
    'creator': ['video', 'digital-marketing', 'design', 'communication'],
    'office': ['communication', 'career', 'digital-marketing', 'programming'],
    'communication': ['career', 'office', 'digital-marketing', 'creator'],
    'career': ['communication', 'office', 'digital-marketing', 'ai']
  };

  const related = smartMap[currentId] || ['ai', 'digital-marketing', 'design', 'programming'];
  // Ensure current ID is never in recommendations
  return related.filter(id => id !== currentId).slice(0, 4);
}

function renderAcademyHero(academy, courses) {
  const titleEl = document.getElementById('academy-hero-title');
  const descEl = document.getElementById('academy-hero-desc');
  const breadcrumbEl = document.getElementById('breadcrumb-academy-name');
  const pillsEl = document.getElementById('academy-stats-pills');

  if (titleEl) titleEl.textContent = academy.name;
  if (breadcrumbEl) breadcrumbEl.textContent = academy.name;

  const descMap = {
    'digital-marketing': 'Master SEO, Google Ads, Meta Ads, Performance Marketing, Social Media & AI-powered marketing automation with 100% practical training.',
    'ai': 'ChatGPT, Prompt Engineering, LLM Fine-Tuning, AI Automation with n8n, AI Agents & cutting-edge AI tools for modern careers.',
    'design': 'Photoshop, Illustrator, Figma, UI/UX Design, Typography, Branding and complete Graphic & Product Design mastery.',
    'programming': 'Python, Full Stack Development, JavaScript, Web Development, Databases and complete software engineering foundations.',
    'video': 'Premiere Pro, After Effects, Motion Graphics, Color Grading, Cinematography & DaVinci Resolve video production.',
    '3d': '3ds Max, Blender, Cinema 4D, V-Ray, Architectural Visualisation & 3D Motion Graphics.',
    'nocode': 'WordPress, Shopify, Webflow, Framer, E-Commerce & Building Web Applications without writing code.',
    'kids': 'Scratch, Python for Kids, Robotics, AI Basics & future-ready STEM tech skills for young learners.',
    'creator': 'YouTube Growth, Instagram Reels, Podcasting, Personal Branding & Monetising Content Creation.',
    'office': 'Advanced Excel, Power BI, Google Sheets, Automation & Productivity Tools for modern professionals.',
    'communication': 'Spoken English, Business Communication, Public Speaking, Soft Skills & Interview Preparation.',
    'career': 'Resume Building, LinkedIn Profiling, Interview Coaching, Portfolio Design & Placement Strategy.'
  };

  if (descEl) {
    descEl.textContent = descMap[academy.id] || `Comprehensive hands-on training and career growth in ${academy.name}.`;
  }

  // Pills calculation
  const courseCount = courses.length || 6;
  const startingPrice = courses.length > 0 
    ? Math.min(...courses.map(c => c.price)) 
    : 4999;

  if (pillsEl) {
    pillsEl.innerHTML = `
      <span class="stats-pill">📚 ${courseCount}+ Practical Courses</span>
      <span class="stats-pill">🏷️ Starting From ₹${startingPrice.toLocaleString('en-IN')}</span>
      <span class="stats-pill">🌐 Online & Offline Modes</span>
      <span class="stats-pill">⭐ 4.8 / 5 Rating (500+ Reviews)</span>
      <span class="stats-pill">💼 100% Placement Support</span>
    `;
  }
}

function renderAcademyOverview(academy, courses) {
  const overviewTitle = document.getElementById('overview-academy-title');
  const overviewDesc = document.getElementById('academy-full-overview');
  const toolsList = document.getElementById('academy-tools-list');

  if (overviewTitle) overviewTitle.textContent = academy.name;
  if (overviewDesc) {
    overviewDesc.textContent = `At ${academy.name}, our curriculum is updated every quarter to match 2026 industry standards. You learn by building real projects, managing live budgets, and creating a professional portfolio that impresses recruiters.`;
  }

  // Extract all unique tools from academy courses
  let allTools = [];
  courses.forEach(c => {
    if (c.tools && Array.isArray(c.tools)) {
      allTools.push(...c.tools);
    }
  });

  if (allTools.length === 0) {
    const defaultTools = {
      'digital-marketing': ['Google Ads', 'Meta Ads', 'SEMrush', 'GA4', 'ChatGPT', 'Canva', 'HubSpot'],
      'ai': ['ChatGPT', 'Claude 3.5', 'Midjourney', 'n8n', 'Python', 'LangChain', 'OpenAI API'],
      'design': ['Adobe Photoshop', 'Illustrator', 'Figma', 'InDesign', 'Canva', 'UI/UX'],
      'programming': ['Python', 'HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
      'video': ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Audition', 'Photoshop'],
      '3d': ['3ds Max', 'Blender', 'V-Ray', 'Cinema 4D', 'Substance Painter'],
      'nocode': ['WordPress', 'Shopify', 'Webflow', 'Framer', 'Elementor', 'Zapier'],
      'kids': ['Scratch', 'Python', 'MIT App Inventor', 'Robotics Basics', 'AI Fun'],
      'creator': ['YouTube Studio', 'OBS Studio', 'CapCut', 'Canva Pro', 'Descript'],
      'office': ['MS Excel', 'Power BI', 'Google Sheets', 'PowerPoint', 'VBA'],
      'communication': ['Spoken English', 'Business Pitching', 'Presentation Skills', 'Grammar'],
      'career': ['LinkedIn', 'Canva Resume', 'Portfolio Builder', 'Mock Interviews']
    };
    allTools = defaultTools[academy.id] || ['Industry Standard Tools', 'AI Assistants', 'Live Platforms'];
  }

  const uniqueTools = [...new Set(allTools)].slice(0, 10);

  if (toolsList) {
    toolsList.innerHTML = uniqueTools.map(tool => `<span class="tool-badge">🔧 ${tool}</span>`).join('');
  }
}

function renderAcademyCourses(courses, academy) {
  const container = document.getElementById('academy-courses-container');
  const title = document.getElementById('courses-section-title');
  if (title) title.textContent = academy.name;

  if (!container) return;

  if (courses.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 40px; background: white; border-radius:16px;">
        <p style="font-size:1.1rem; color:#64748b;">Specialised courses for ${academy.name} are currently updating for the new batch. Book counselling to reserve early bird seats!</p>
        <button class="btn btn-primary" onclick="openConsultationPopup()" style="margin-top:16px;">Book Counselling →</button>
      </div>
    `;
    return;
  }

  container.innerHTML = courses.map(course => `
    <div class="course-card" style="background:white; border-radius:16px; border:1px solid #e2e8f0; padding:24px; display:flex; flex-direction:column; justify-between; box-shadow:0 4px 20px rgba(0,0,0,0.04); transition:transform 0.3s ease;">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="background:rgba(5, 153, 168, 0.1); color:#0599a8; padding:4px 10px; border-radius:50px; font-weight:600; font-size:0.8rem;">${course.level || 'All Levels'}</span>
          <span style="color:#eab308; font-weight:700; font-size:0.9rem;">⭐ ${course.rating || 4.8} (${course.reviews || 120})</span>
        </div>
        <h3 style="font-size:1.2rem; font-weight:700; color:#011731; margin-bottom:8px;">${course.name}</h3>
        <p style="color:#64748b; font-size:0.9rem; line-height:1.5; margin-bottom:16px;">${course.shortDesc}</p>
      </div>

      <div style="border-top:1px solid #f1f5f9; pt:16px; margin-top:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <span style="font-size:0.8rem; color:#94a3b8;">Course Fee</span>
            <div style="font-size:1.25rem; font-weight:800; color:#011731;">₹${course.price.toLocaleString('en-IN')}</div>
          </div>
          <span style="font-size:0.85rem; color:#475569; background:#f1f5f9; padding:4px 10px; border-radius:6px; font-weight:500;">⏱️ ${course.duration}</span>
        </div>
        <a href="course-detail.html?id=${course.slug}" class="btn btn-outline" style="width:100%; text-align:center; font-weight:600; display:block;">View Course Details →</a>
      </div>
    </div>
  `).join('');
}

/* Reusable Component: Render Other Academies Recommendations */
function renderOtherAcademiesRecommendations(currentAcademyId) {
  const container = document.getElementById('other-academies-grid');
  if (!container) return;

  const relatedIds = getSmartRelatedAcademyIds(currentAcademyId);

  // Retrieve recommendation card objects from NS_ACADEMIES
  const recommendedAcademies = relatedIds.map(id => {
    const found = NS_ACADEMIES.find(a => a.id === id);
    if (found) return found;
    return {
      id: id,
      name: formatAcademyName(id),
      icon: getAcademyIcon(id),
      color: 'linear-gradient(135deg,#0599a8,#75d766)'
    };
  });

  container.innerHTML = recommendedAcademies.map(acad => {
    const count = getAcademyCourseCount(acad.id);
    const startPrice = getAcademyStartingPrice(acad.id);

    return `
      <div class="rec-card" onclick="window.location.href='academy-detail.html?academy=${acad.id}'">
        <div>
          <div style="width:52px; height:52px; border-radius:14px; background:${acad.color}; display:flex; align-items:center; justify-content:center; font-size:1.6rem; margin-bottom:16px;">
            ${acad.icon}
          </div>
          <h3 style="font-size:1.15rem; font-weight:700; color:white; margin-bottom:8px;">${acad.name}</h3>
          <p style="color:#94a3b8; font-size:0.875rem; line-height:1.5; margin-bottom:16px;">
            Comprehensive practical training & certification in ${acad.name.replace(' Academy', '')}.
          </p>
        </div>

        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:16px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.8rem; color:#38bdf8; font-weight:600;">${count} Courses · From ₹${startPrice.toLocaleString('en-IN')}</span>
          <span style="color:#38bdf8; font-weight:700; font-size:0.9rem;">Explore →</span>
        </div>
      </div>
    `;
  }).join('');
}

function getAcademyCourseCount(academyId) {
  const count = NS_COURSES.filter(c => c.academyId === academyId).length;
  return count > 0 ? count : 8;
}

function getAcademyStartingPrice(academyId) {
  const matches = NS_COURSES.filter(c => c.academyId === academyId);
  if (matches.length > 0) {
    return Math.min(...matches.map(c => c.price));
  }
  const defaultPrices = {
    '3d': 9999, 'kids': 3999, 'design': 4999, 'programming': 4999
  };
  return defaultPrices[academyId] || 5999;
}

function injectSEOMetadata(academy, courses) {
  const titleEl = document.getElementById('page-title');
  const metaDescEl = document.getElementById('page-meta-desc');
  const canonicalEl = document.getElementById('page-canonical');
  const ogTitleEl = document.getElementById('og-title');
  const ogDescEl = document.getElementById('og-desc');
  const ogUrlEl = document.getElementById('og-url');
  const ogImgEl = document.getElementById('og-image');
  const ogImgAltEl = document.getElementById('og-image-alt');
  const twTitleEl = document.getElementById('tw-title');
  const twDescEl = document.getElementById('tw-desc');
  const twImgEl = document.getElementById('tw-image');
  const twImgAltEl = document.getElementById('tw-image-alt');

  const titleText = `${academy.name} — Nova Skills Institute`;
  const descText = `Master ${academy.name} with 100% practical projects, live expert mentorship, and placement support at Nova Skills.`;
  const canonicalUrl = `https://novaskills.in/academy-detail.html?academy=${academy.id}`;
  const academyImg = 'https://novaskills.in/public/images/seo/og-academies.png';

  document.title = titleText;
  if (titleEl) titleEl.textContent = titleText;
  if (metaDescEl) metaDescEl.setAttribute('content', descText);
  if (canonicalEl) canonicalEl.setAttribute('href', canonicalUrl);
  if (ogTitleEl) ogTitleEl.setAttribute('content', titleText);
  if (ogDescEl) ogDescEl.setAttribute('content', descText);
  if (ogUrlEl) ogUrlEl.setAttribute('content', canonicalUrl);
  if (ogImgEl) ogImgEl.setAttribute('content', academyImg);
  if (ogImgAltEl) ogImgAltEl.setAttribute('content', titleText);

  if (twTitleEl) twTitleEl.setAttribute('content', titleText);
  if (twDescEl) twDescEl.setAttribute('content', descText);
  if (twImgEl) twImgEl.setAttribute('content', academyImg);
  if (twImgAltEl) twImgAltEl.setAttribute('content', titleText);

  // Inject EducationalOccupationalProgram JSON-LD Schema
  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": academy.name,
    "description": descText,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Nova Skills Institute",
      "sameAs": "https://novaskills.in"
    },
    "hasCourse": courses.map(c => ({
      "@type": "Course",
      "name": c.name,
      "description": c.shortDesc,
      "provider": "Nova Skills Institute"
    }))
  });
  document.head.appendChild(schemaScript);
}
