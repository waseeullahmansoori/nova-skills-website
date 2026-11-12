/**
 * Nova Skills Enterprise Platform — AI Career Advisor & Admissions Agent
 * Version: 4.0.0 (Full Counselling + Sales Engine)
 * Pure JavaScript & Glassmorphism Slide-in Drawer UI Widget
 */

(function () {
  'use strict';

  const WORKER_AI_ENDPOINT = '/api/chat';
  const STORAGE_KEY_HISTORY = 'novaskills_ai_history';
  const STORAGE_KEY_MEMORY = 'novaskills_ai_memory';
  const STORAGE_KEY_USER = 'novaskills_user';

  let chatHistory = [];
  let isPanelOpen = false;
  let isGenerating = false;

  // Multi-Turn Conversational Session Memory
  let sessionMemory = {
    name: null,
    qualification: null,
    userType: null, // 'student' | 'working_professional' | 'fresher' | 'business_owner'
    careerGoal: null, // 'job' | 'freelancing' | 'business' | 'skill_upgrade'
    targetField: null, // 'digital-marketing' | 'ai' | 'design' | 'programming' | 'nocode' | 'video' | '3d' | 'career' | 'communication' | 'kids' | 'creator' | 'office'
    subInterest: null,
    dailyTime: null,
    preferredMode: null, // 'Online' | 'Classroom' | 'Hybrid'
    budget: null,
    lastDiscussedCourse: null,
    lastDiscussedAcademy: null,
    pendingQuestion: null // 'discovery_3q' | 'ai_subgoal' | 'marketing_path' | 'budget_filter' | null
  };

  /* ─────────────────────────────────────────────
     VERIFIED NOVA SKILLS COURSE CATALOGUE
  ───────────────────────────────────────────── */
  const FALLBACK_ACADEMIES = [
    { id: 'digital-marketing', name: 'Digital Marketing Academy', slug: 'digital-marketing', icon: '📊' },
    { id: 'ai', name: 'AI Academy', slug: 'ai', icon: '🤖' },
    { id: 'design', name: 'Design Academy', slug: 'design', icon: '🎨' },
    { id: 'programming', name: 'Programming Academy', slug: 'programming', icon: '💻' },
    { id: 'nocode', name: 'No-Code Web Academy', slug: 'no-code-web', icon: '🌐' },
    { id: 'video', name: 'Video & Motion Academy', slug: 'video-motion', icon: '🎬' },
    { id: '3d', name: '3D Academy', slug: '3d', icon: '🏗️' },
    { id: 'career', name: 'Career & Freelancing Academy', slug: 'career-freelancing', icon: '💼' },
    { id: 'communication', name: 'Communication Academy', slug: 'communication', icon: '💬' },
    { id: 'kids', name: 'Kids Tech Academy', slug: 'kids-tech', icon: '👨‍💻' },
    { id: 'creator', name: 'Creator Academy', slug: 'creator', icon: '🎥' },
    { id: 'office', name: 'Office Productivity Academy', slug: 'office-productivity', icon: '📋' }
  ];

  // Canonical course catalog supplied at runtime by window.NovaCourseData (js/course-data.js)
  const FALLBACK_COURSES = [];

  function getAllCourses() {
    if (typeof window !== 'undefined' && window.NovaCourseData && typeof window.NovaCourseData.getPublishedCourses === 'function') {
      const list = window.NovaCourseData.getPublishedCourses();
      if (Array.isArray(list) && list.length > 0) return list;
    }
    if (typeof window !== 'undefined' && Array.isArray(window.NS_COURSES) && window.NS_COURSES.length > 0) {
      return window.NS_COURSES;
    }
    return FALLBACK_COURSES;
  }

  function getAllAcademies() {
    if (typeof window !== 'undefined' && window.NovaCourseData && typeof window.NovaCourseData.getAllAcademies === 'function') {
      const list = window.NovaCourseData.getAllAcademies();
      if (Array.isArray(list) && list.length > 0) return list;
    }
    if (typeof window !== 'undefined' && Array.isArray(window.NS_ACADEMIES) && window.NS_ACADEMIES.length > 0) {
      return window.NS_ACADEMIES;
    }
    return FALLBACK_ACADEMIES;
  }

  function findCourse(queryStr) {
    if (!queryStr) return null;
    if (typeof window !== 'undefined' && window.NovaCourseData && typeof window.NovaCourseData.getCourseById === 'function') {
      const byCanonical = window.NovaCourseData.getCourseById(queryStr);
      if (byCanonical) return byCanonical;
    }
    const lower = String(queryStr).toLowerCase().trim();
    const courses = getAllCourses();

    // 1. Exact ID or slug match
    let matched = courses.find(c => (c.id && c.id.toLowerCase() === lower) || (c.slug && c.slug.toLowerCase() === lower));
    if (matched) return matched;

    // 2. Exact name match
    matched = courses.find(c => c.name && c.name.toLowerCase() === lower);
    if (matched) return matched;

    // 3. Substring matching in name or slug
    matched = courses.find(c => {
      const nameL = (c.name || '').toLowerCase();
      const slugL = (c.slug || '').toLowerCase();
      return nameL.includes(lower) || lower.includes(nameL) || slugL.includes(lower);
    });
    if (matched) return matched;

    return null;
  }

  function formatFee(amount) {
    if (typeof window !== 'undefined' && window.NovaCourseData && typeof window.NovaCourseData.formatPriceINR === 'function' && typeof amount === 'number') {
      return window.NovaCourseData.formatPriceINR(amount);
    }
    if (typeof amount === 'number') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return amount || 'Enquire for Fee';
  }

  function formatProjectInfo(c) {
    if (!c) return 'Hands-On Projects';
    if (typeof window !== 'undefined' && window.NovaCourseData && typeof window.NovaCourseData.getCourseProjectLabel === 'function') {
      return window.NovaCourseData.getCourseProjectLabel(c);
    }
    return c.projectDisplayLabel || `${c.liveProjects || 2} Projects`;
  }

  function getTrackFeeRange(trackLabel) {
    const courses = getAllCourses().filter(c => (c.programLevel || '').toLowerCase().includes(trackLabel.toLowerCase()) && typeof c.price === 'number');
    if (courses.length === 0) return null;
    const min = Math.min(...courses.map(c => c.price));
    const max = Math.max(...courses.map(c => c.price));
    return `${formatFee(min)} – ${formatFee(max)}`;
  }

  function calculateEMI(priceNum, months = 6) {
    if (!priceNum || isNaN(priceNum)) return 'Installments Available';
    const emi = Math.round(priceNum / (months || 6));
    return `₹${emi.toLocaleString('en-IN')}`;
  }

  function trackEvent(eventName, payload = {}) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try { window.gtag('event', eventName, payload); } catch (e) {}
    }
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: eventName, ...payload });
    }
    console.log(`[Nova AI Analytics] ${eventName}`, payload);
  }

  function getUserProfile() {
    try {
      const u = localStorage.getItem(STORAGE_KEY_USER);
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  }

  function loadSavedMemory() {
    try {
      const m = sessionStorage.getItem(STORAGE_KEY_MEMORY);
      if (m) {
        sessionMemory = { ...sessionMemory, ...JSON.parse(m) };
      }
    } catch (e) {}
  }

  function saveMemory() {
    try {
      sessionStorage.setItem(STORAGE_KEY_MEMORY, JSON.stringify(sessionMemory));
    } catch (e) {}
  }

  /* ─────────────────────────────────────────────
     LIGHTWEIGHT MARKDOWN PARSER (WITH TABLES)
  ───────────────────────────────────────────── */
  function parseMarkdown(text) {
    if (!text) return '';
    let html = text;

    // Escape raw HTML tags
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Code blocks: ```code```
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="nova-ai-code-block"><code>$1</code></pre>');

    // Inline code: `code`
    html = html.replace(/`([^`]+)`/g, '<code class="nova-ai-inline-code">$1</code>');

    // Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italics: *text*
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Links: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="nova-ai-link">$1</a>');

    // Parse Markdown Tables
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = [];
    let resultLines = [];
    let inList = false;
    let listType = 'ul';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check for Table Row: | col1 | col2 |
      if (line.startsWith('|') && line.endsWith('|')) {
        if (inList) {
          resultLines.push(`</${listType}>`);
          inList = false;
        }

        // Table separator row: | :--- | :--- |
        if (/^\|(?:\s*:?-+:?\s*\|)+$/.test(line)) {
          continue; // skip delimiter row
        }

        if (!inTable) {
          inTable = true;
          tableHtml.push('<table class="nova-ai-table">');
          // Treat first row as thead
          const cells = line.split('|').slice(1, -1);
          tableHtml.push('<thead><tr>' + cells.map(c => `<th>${c.trim()}</th>`).join('') + '</tr></thead><tbody>');
        } else {
          const cells = line.split('|').slice(1, -1);
          tableHtml.push('<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>');
        }
        continue;
      } else if (inTable) {
        tableHtml.push('</tbody></table>');
        resultLines.push(tableHtml.join(''));
        tableHtml = [];
        inTable = false;
      }

      // Bullet points & numbered lists
      if (line.startsWith('•') || line.startsWith('-') || (line.startsWith('*') && !line.endsWith('*'))) {
        const content = line.replace(/^[•\-\*]\s*/, '');
        if (!inList) {
          resultLines.push('<ul class="nova-ai-list">');
          inList = true;
          listType = 'ul';
        }
        resultLines.push(`<li>${content}</li>`);
      } else if (/^\d+\.\s+/.test(line)) {
        const content = line.replace(/^\d+\.\s+/, '');
        if (!inList) {
          resultLines.push('<ol class="nova-ai-list">');
          inList = true;
          listType = 'ol';
        }
        resultLines.push(`<li>${content}</li>`);
      } else {
        if (inList) {
          resultLines.push(`</${listType}>`);
          inList = false;
        }
        resultLines.push(line);
      }
    }

    if (inTable) {
      tableHtml.push('</tbody></table>');
      resultLines.push(tableHtml.join(''));
    }
    if (inList) {
      resultLines.push(`</${listType}>`);
    }

    html = resultLines.join('\n');
    html = html.replace(/\n/g, '<br/>');

    return html;
  }

  /* ─────────────────────────────────────────────
     ENTITY & MEMORY EXTRACTION
  ───────────────────────────────────────────── */
  function updateSessionMemory(userText) {
    if (!userText || typeof userText !== 'string') return;
    const lower = userText.toLowerCase();

    // 1. Name extraction
    const nameMatch = userText.match(/(?:my name is|mera naam|i am|naam hai|this is)\s+([a-zA-Z]{2,20})/i);
    if (nameMatch && nameMatch[1]) {
      const candidate = nameMatch[1].trim();
      const blacklist = ['interested', 'looking', 'student', 'fresher', 'graduate', 'here', 'ready', 'confused'];
      if (!blacklist.includes(candidate.toLowerCase())) {
        sessionMemory.name = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }

    // 2. Qualification & Background
    if (/10th|matric/i.test(lower)) sessionMemory.qualification = '10th Pass';
    else if (/12th|intermediate|inter|hsc|senior secondary/i.test(lower)) sessionMemory.qualification = '12th Pass';
    else if (/graduate|b\.?com|bca|bba|b\.?sc|ba|graduation/i.test(lower)) sessionMemory.qualification = 'Graduate';
    else if (/b\.?tech|engineering|b\.?e\b|mca|btech|m\.?tech/i.test(lower)) sessionMemory.qualification = 'B.Tech / Technical Graduate';
    else if (/post\s*graduate|mba|m\.?sc|m\.?com|masters/i.test(lower)) sessionMemory.qualification = 'Post Graduate';

    // 3. User Type
    if (/working professional|job kar|working in|employed|doing job|it professional/i.test(lower)) {
      sessionMemory.userType = 'working_professional';
    } else if (/student|college|school/i.test(lower) && !/working/i.test(lower)) {
      sessionMemory.userType = 'student';
    } else if (/fresher|passed out|jobless|looking for job|beginner|shuruat|zero knowledge/i.test(lower)) {
      sessionMemory.userType = 'fresher';
    } else if (/business|startup|shop|agency owner|entrepreneur/i.test(lower)) {
      sessionMemory.userType = 'business_owner';
    }

    // 4. Career Goal
    if (/freelanc|fiverr|upwork|client|remote work|ghar baithe/i.test(lower)) {
      sessionMemory.careerGoal = 'freelancing';
    } else if (/job|placement|salary|career switch|hiring|company|naukri/i.test(lower) && !/freelanc/i.test(lower)) {
      sessionMemory.careerGoal = 'job';
    } else if (/business|agency|scale|startup|dhandha/i.test(lower)) {
      sessionMemory.careerGoal = 'business';
    } else if (/skill|upgrade|seekhna|productivity|learn/i.test(lower) && !sessionMemory.careerGoal) {
      sessionMemory.careerGoal = 'skill_upgrade';
    }

    // 5. Target Academy / Field
    if (/digital marketing|seo|geo|google ads|meta ads|smm|social media marketing/i.test(lower)) {
      sessionMemory.targetField = 'digital-marketing';
    } else if (/\bai\b|artificial intelligence|prompt engineering|agents|chatgpt|claude|n8n|automation/i.test(lower)) {
      sessionMemory.targetField = 'ai';
    } else if (/graphic design|designing|photoshop|illustrator|figma|ui\s*\/?\s*ux|canva/i.test(lower)) {
      sessionMemory.targetField = 'design';
    } else if (/coding|programming|full\s*stack|python|web development|javascript|react|developer/i.test(lower)) {
      sessionMemory.targetField = 'programming';
    } else if (/video editing|reels editing|premiere pro|after effects|motion graphics|davinci/i.test(lower)) {
      sessionMemory.targetField = 'video';
    } else if (/freelancing|career launch|proposal|fiverr|upwork/i.test(lower)) {
      sessionMemory.targetField = 'career';
    } else if (/kid|child|bachon|young coder|scratch/i.test(lower)) {
      sessionMemory.targetField = 'kids';
    } else if (/3d|blender|3ds max|vray|architectural visual/i.test(lower)) {
      sessionMemory.targetField = '3d';
    } else if (/no\s*code|shopify|wordpress|elementor|webflow/i.test(lower)) {
      sessionMemory.targetField = 'nocode';
    } else if (/english|spoken english|communication|public speaking/i.test(lower)) {
      sessionMemory.targetField = 'communication';
    } else if (/youtube|content creator|podcast|thumbnail/i.test(lower)) {
      sessionMemory.targetField = 'creator';
    } else if (/excel|tally|gst|powerpoint|office productivity/i.test(lower)) {
      sessionMemory.targetField = 'office';
    }

    // 6. Time Availability
    if (/1\s*(?:to|–|-)?\s*2\s*(?:hours|ghante|hr)/i.test(lower)) sessionMemory.dailyTime = '1–2 Hours Daily';
    else if (/2\s*(?:to|–|-)?\s*3\s*(?:hours|ghante|hr)/i.test(lower) || /2\s*(?:hours|ghante)/i.test(lower)) sessionMemory.dailyTime = '2–3 Hours Daily';
    else if (/3\s*(?:to|–|-)?\s*4\s*(?:hours|ghante|hr)/i.test(lower)) sessionMemory.dailyTime = '3–4 Hours Daily';
    else if (/full\s*time|pure din|pura din/i.test(lower)) sessionMemory.dailyTime = 'Full Time';

    // 7. Preferred Mode
    if (/online|ghar se|live class/i.test(lower)) sessionMemory.preferredMode = 'Live Online';
    else if (/offline|classroom|centre|campus|center/i.test(lower)) sessionMemory.preferredMode = 'Classroom';
    else if (/hybrid/i.test(lower)) sessionMemory.preferredMode = 'Hybrid';

    // 8. Budget
    const budgetMatch = lower.match(/(?:budget|fees?|paise?)\s*(?:of|is|hai|around)?\s*(?:₹|rs\.?|inr)?\s*(\d{1,2})k\b/) ||
                        lower.match(/(?:₹|rs\.?|inr)\s*(\d{3,6})/) ||
                        lower.match(/(\d{3,6})\s*(?:ka budget|budget|rupees|rs)/);
    if (budgetMatch && budgetMatch[1]) {
      let bVal = parseInt(budgetMatch[1], 10);
      if (budgetMatch[0].includes('k')) bVal *= 1000;
      sessionMemory.budget = bVal;
    }

    saveMemory();
  }

  /* ─────────────────────────────────────────────
     INTENT DETECTION SYSTEM
  ───────────────────────────────────────────── */
  function detectIntent(userText) {
    const lower = userText.toLowerCase().trim();

    // 1. Human Escalation Intent
    if (/(human|counsellor|counselor|agent|insaan|call me|phone number|contact number|number do|direct baat|telephonic|call chahiye|baat karni hai)/i.test(lower) && !/course|curriculum|module/i.test(lower)) {
      return 'HUMAN_ESCALATION';
    }

    // 2. Course Comparison Intent
    if (/(difference|vs|versus|compare|comparison|bich me farak|antar|me difference|se behtar|dono me se)/i.test(lower)) {
      return 'COURSE_COMPARISON';
    }

    // 3. Budget Queries
    if (/(budget|sasta course|kitne tak ka|afford|paise kam hain|₹5000|₹10000|5000 budget|10000 budget|5k|10k)/i.test(lower) && !/(placement|placement support)/i.test(lower)) {
      return 'BUDGET_QUERY';
    }

    // 4. Pending Discovery Answer (User answering 3 questions)
    if (sessionMemory.pendingQuestion === 'discovery_3q') {
      if (/student|working|job|freelanc|business|ghante|hours|graduate|fresher|12th|1\.|2\.|3\./i.test(lower)) {
        return 'ANSWER_TO_PENDING';
      }
    }

    // 5. Greeting Intent
    if (/^(hello|hi|hey|hii|heyy|namaste|good\s*morning|good\s*afternoon|good\s*evening|halo|hola|salam)\b/i.test(lower) && lower.split(/\s+/).length <= 3) {
      return 'GREETING';
    }

    // 6. Fees & Payment / EMI Intent
    if (/(fees?|fee structure|price|kitne paise|cost|charges|emi|installment|kist|discount|scholarship|gst|payment mode)/i.test(lower)) {
      return 'FEES_PAYMENT';
    }

    // 7. Placement & Jobs Intent
    if (/(placement|job milegi|job support|job assistance|hiring partner|interview|package|salary|lpa|guarantee|placement support|job chahiye|naukri)/i.test(lower)) {
      return 'PLACEMENT';
    }

    // 8. Freelancing & Global Clients Intent
    if (/(freelanc|fiverr|upwork|client kaise|global client|ghar baithe earning|dollar earning|work from home)/i.test(lower)) {
      return 'FREELANCING';
    }

    // 9. Learning Mode & Batches Intent
    if (/(online|offline|classroom|timing|batch|live class|schedule|weekend batch|morning batch|evening batch|center kahan)/i.test(lower)) {
      return 'LEARNING_MODE';
    }

    // 10. Admission & Enrollment Intent
    if (/(admission|enroll|enrolment|join|apply|process|how to take admission|counselling book|seat book|registration)/i.test(lower)) {
      return 'ADMISSION';
    }

    // 11. Specific Field Discovery (High Priority)
    if (/(digital marketing|ai\b|artificial intelligence|graphic design|coding|programming|video editing|motion graphics|3d|kids|child|bachon|excel|tally|shopify|wordpress|english)/i.test(lower)) {
      return 'COURSE_DISCOVERY_FIELD';
    }

    // 12. Academy Discovery Intent (General)
    if (/(academy|academies|all courses|kaun kaun se course|course list|what courses do you have)/i.test(lower)) {
      return 'ACADEMY_DISCOVERY';
    }

    // 13. General Educational Definitions ("Digital Marketing kya hota hai?")
    if (/(kya hota hai|kya hai|what is|meaning of|explain|kaise kaam karta hai)\b/i.test(lower)) {
      return 'GENERAL_DEFINITION';
    }

    // 14. Specific Course Information Query ("AI Digital Marketing Master kya hai?", "course me kya sikhayenge?")
    if (/(master|professional|program|course|curriculum|syllabus|projects|tools|duration|kitne months)\b/i.test(lower) && /(sikhayenge|syllabus|curriculum|module|kya hai|detail|overview|content)/i.test(lower)) {
      return 'COURSE_INFO';
    }

    // 15. Career Guidance / Scope Intent ("after digital marketing", "career scope", "beginner", "which course has best scope")
    if (/(career|scope|future|demand|roadmap|growth|high paying|best field|beginner|zero knowledge|start career)/i.test(lower)) {
      return 'CAREER_GUIDANCE';
    }

    // 16. Services / Business Offerings Intent
    if (/(b2b|corporate training|agency services|client work|business ke liye website|service provide)/i.test(lower)) {
      return 'SERVICES';
    }

    // 17. Vague Course Discovery ("mujhe kaunsa course karna chahiye?", "best course for me", "confused")
    if (/(kaunsa course|which course|suggest|recommend|confused|samajh nahi aa raha|best for me|start kahan se)/i.test(lower)) {
      return 'COURSE_DISCOVERY_VAGUE';
    }

    return 'GENERAL_COUNSELLING';
  }

  /* ─────────────────────────────────────────────
     CONVERSATIONAL COUNSELLING & SALES ENGINE
  ───────────────────────────────────────────── */
  function generateAdvisorResponse(userText) {
    const intent = detectIntent(userText);
    const lower = userText.toLowerCase();

    // 1. GREETING INTENT
    if (intent === 'GREETING') {
      const nameGreeting = sessionMemory.name ? `, ${sessionMemory.name}` : '';
      return {
        text: `Hello${nameGreeting}! 👋 Main **Nova Skills** ka official AI Career Advisor hoon.\n\nAap mujhse course selection, career roadmaps, freelancing, fees, curriculum, batch timings ya admissions ke baare me pooch sakte hain.\n\nAap abhi kis field me interest rakhte hain?\n• **AI & Automation** 🤖\n• **Digital Marketing & Growth** 📊\n• **Graphic & UI/UX Design** 🎨\n• **Full-Stack Programming & Python** 💻\n• **Video Editing & Motion Graphics** 🎬\n• **Freelancing & Global Clients** 💼`,
        recommendedCourse: null
      };
    }

    // 2. HUMAN ESCALATION INTENT
    if (intent === 'HUMAN_ESCALATION') {
      return {
        text: `Bilkul! Main aapko hamari Senior Academic Counselling Team se directly connect kar deta hoon:\n\n📞 **Official Admissions Helpline**: [+91 9695904440](tel:+919695904440)\n💬 **WhatsApp Direct Chat**: [+91 9695904440](https://wa.me/919695904440?text=Hi%20Nova%20Skills,%20I%20want%20to%20talk%20to%20an%20academic%20counsellor)\n✉️ **Admissions Email**: novaskills.official@gmail.com\n\nAap neeche button par click karke direct **Free 1-on-1 Career Counselling Session** bhi schedule kar sakte hain — hamare expert counsellor aapko 15 minutes ke andar call back karenge!`,
        recommendedCourse: null
      };
    }

    // 3. COURSE COMPARISON INTENT
    if (intent === 'COURSE_COMPARISON') {
      // Comparison: AI Mastery vs AI Productivity
      if (/ai/i.test(lower) && (/mastery/i.test(lower) || /productivity/i.test(lower) || /difference/i.test(lower))) {
        const c1 = findCourse('ai-mastery') || getAllCourses()[0];
        const c2 = findCourse('ai-productivity') || findCourse('ai-for-business-pro');
        sessionMemory.lastDiscussedCourse = c1;

        return {
          text: c1 && c2 ? `Nova Skills ke dono flagship AI programs ka direct comparison:\n\n| Feature | **${c1.name}** | **${c2.name}** |\n| :--- | :--- | :--- |\n| **Program Level** | ${c1.programLevel} | ${c2.programLevel} |\n| **Duration** | **${c1.duration}** | **${c2.duration}** |\n| **Core Focus** | ${c1.shortDesc} | ${c2.shortDesc} |\n| **Projects** | **${formatProjectInfo(c1)}** | **${formatProjectInfo(c2)}** |\n| **Placement Support** | ${c1.placementSupport ? '**Dedicated Placement Support**' : 'Portfolio Support'} | ${c2.placementSupport ? '**Dedicated Placement Support**' : 'Career & Freelance Guidance'} |\n| **Fee** | **${formatFee(c1.price)}** (Est. ${calculateEMI(c1.price)}/mo) | **${formatFee(c2.price)}** (Est. ${calculateEMI(c2.price, 3)}/mo) |\n\n💡 **Counsellor Verdict**: Complete career mastery ke liye **${c1.name}** aur fast-track work automation ke liye **${c2.name}** best hai.` : 'Detailed course catalog abhi load ho raha hai — kripya kuch second baad try karein.',
          recommendedCourse: c1
        };
      }

      // Comparison: Digital Marketing Master vs Professional
      if (/digital marketing/i.test(lower) || /dm/i.test(lower) || /marketing/i.test(lower)) {
        const c1 = findCourse('dm-mastery') || getAllCourses()[0];
        const c2 = findCourse('dm-professional');
        sessionMemory.lastDiscussedCourse = c1;

        return {
          text: c1 && c2 ? `Nova Skills Digital Marketing programs ka comparison:\n\n| Feature | **${c1.name}** | **${c2.name}** |\n| :--- | :--- | :--- |\n| **Level** | ${c1.programLevel} | ${c2.programLevel} |\n| **Duration** | **${c1.duration}** (${c1.learningHours} Hours) | **${c2.duration}** (${c2.learningHours} Hours) |\n| **Scope** | ${c1.shortDesc} | ${c2.shortDesc} |\n| **Projects** | **${formatProjectInfo(c1)}** | **${formatProjectInfo(c2)}** |\n| **Placement Support** | ${c1.placementSupport ? '**Dedicated Placement Support**' : 'Portfolio Guidance'} | ${c2.placementSupport ? 'Dedicated Placement Support' : 'Portfolio Guidance'} |\n| **Fee** | **${formatFee(c1.price)}** (Est. ${calculateEMI(c1.price)}/mo) | **${formatFee(c2.price)}** (Est. ${calculateEMI(c2.price, 3)}/mo) |\n\n💡 **Counsellor Verdict**: Complete agency-grade skills aur career track ke liye **${c1.name} (${c1.duration})** best choice hai!` : 'Detailed course catalog load ho raha hai.',
          recommendedCourse: c1
        };
      }

      // General fallback comparison
      return {
        text: `Nova Skills me **Career Programs** comprehensive placement assistance aur portfolio projects ke saath aate hain, jabki **Professional Programs** fast-track practical skills ke liye hote hain.\n\nAap kin do specific courses ko compare karna chahte hain? Main unka exact canonical duration, projects, tools aur fees ka side-by-side comparison bata deta hoon!`,
        recommendedCourse: null
      };
    }

    // 4. VAGUE COURSE DISCOVERY ("mujhe kaunsa course karna chahiye?")
    if (intent === 'COURSE_DISCOVERY_VAGUE') {
      sessionMemory.pendingQuestion = 'discovery_3q';
      saveMemory();

      return {
        text: `Bilkul! Main aapki profile aur career goals ke hisaab se **Nova Skills ka exact matching program** shortlist kar deta hoon.\n\nBas 3 quick baatein bata dijiye:\n1. **Aap student hain ya working professional?** (ya fresher / graduate)\n2. **Aapka main goal kya hai?** (Job, Freelancing, Business, ya Skill Upgrade?)\n3. **Roz approx kitna time de sakte hain?**\n\nAapke answers aate hi main aapke liye best course aur ROI roadmap share karunga!`,
        recommendedCourse: null
      };
    }

    // 5. ANSWER TO PENDING DISCOVERY QUESTIONS / MULTI-TURN RESOLUTION
    if (intent === 'ANSWER_TO_PENDING' || (sessionMemory.qualification && sessionMemory.careerGoal && !sessionMemory.lastDiscussedCourse)) {
      sessionMemory.pendingQuestion = null;
      saveMemory();

      // Case A: Graduate + Freelancing
      if (sessionMemory.careerGoal === 'freelancing' || /freelanc/i.test(lower)) {
        const c = findCourse('freelancing-client-acquisition-professional') || getAllCourses()[0];
        sessionMemory.lastDiscussedCourse = c;
        return {
          text: c ? `Awesome! **Freelancing** target karna bahut rewarding decision hai.\n\n⭐ **Recommended for You: ${c.name}**\n\n• **Duration:** ${c.duration} (${c.learningHours} Hours)\n• **Projects:** ${formatProjectInfo(c)}\n• **Fee:** ${formatFee(c.price)} *(Est. ${calculateEMI(c.price)}/mo)*\n• **Mode:** ${c.mode}\n\nKya aap iska detailed curriculum dekhna chahenge ya 1-on-1 free counselling book karein?` : 'Catalog load ho raha hai.',
          recommendedCourse: c
        };
      }

      // Case B: Job seeker + Digital Marketing / Tech
      if (sessionMemory.careerGoal === 'job' || /job|placement/i.test(lower)) {
        const c = (sessionMemory.targetField === 'ai') ? findCourse('ai-mastery') :
                  (sessionMemory.targetField === 'programming') ? findCourse('fullstack-foundation') :
                  (sessionMemory.targetField === 'design') ? findCourse('creative-design') :
                  (findCourse('dm-mastery') || getAllCourses()[0]);
        sessionMemory.lastDiscussedCourse = c;

        return {
          text: c ? `Perfect! Job aur placement ke liye Nova Skills ke **Career Programs** placement assistance aur live portfolio projects ke saath designed hain.\n\n⭐ **Recommended for You: ${c.name}**\n\n**Why it matches your profile:**\n• **Placement Support**: ${c.placementSupport ? 'Hiring partner network & interview prep' : 'Portfolio guidance'}\n• **Practical Proof of Work**: ${formatProjectInfo(c)}\n• **Duration:** ${c.duration}\n• **Fee:** ${formatFee(c.price)} *(Est. ${calculateEMI(c.price)}/mo)*\n• **Mode:** ${c.mode}\n\nKya aap iska phase-wise curriculum dekhna chahte hain?` : 'Catalog load ho raha hai.',
          recommendedCourse: c
        };
      }
    }

    // 6. BUDGET QUERY INTENT
    if (intent === 'BUDGET_QUERY') {
      const budget = sessionMemory.budget;

      if (budget && budget <= 7000) {
        const certSamples = ['prompt-engineering', 'canva-pro', 'html-css', 'fiverr-success', 'microsoft-excel', 'tally-gst']
          .map(id => findCourse(id)).filter(Boolean);
        const listLines = certSamples.map(sc => `• **${sc.name}** (${formatFee(sc.price)} • ${sc.duration})`).join('\n');
        const certRange = getTrackFeeRange('Certification') || '₹2,900 onwards';

        return {
          text: `Agar aapka one-time budget **₹${budget.toLocaleString('en-IN')}** hai, Nova Skills me practical **Certification Courses (${certRange})** available hain:\n\n${listLines}\n\n💡 **Smart Counsellor Advice**: Aap hamare Career Programs ko flexible monthly installment plans ke saath bhi explore kar sakte hain!`,
          recommendedCourse: certSamples[0] || null
        };
      }

      if (budget && budget <= 20000) {
        const c1 = findCourse('career-launch-placement-readiness-professional');
        const c2 = findCourse('office-pro');
        const c3 = findCourse('spoken-english-pro');
        const c4 = findCourse('ai-productivity');
        const c5 = findCourse('dm-professional');
        const budgetItems = [c1, c2, c3, c4, c5].filter(Boolean)
          .map(item => `• **${item.name}** (${item.duration} • **${formatFee(item.price)}**)`).join('\n');

        return {
          text: `**₹${budget.toLocaleString('en-IN')}** ke budget me Nova Skills ke top practical programs:\n\n${budgetItems}\n\nAap inme se kisi bhi course par click karke poora syllabus dekh sakte hain!`,
          recommendedCourse: c1 || c5 || null
        };
      }

      const certRange = getTrackFeeRange('Certification') || '₹2,900 onwards';
      const proRange = getTrackFeeRange('Professional') || '₹9,900 – ₹34,900';
      const careerRange = getTrackFeeRange('Career') || '₹24,900 – ₹64,900';

      return {
        text: `Nova Skills ke fee plans transparent aur har learner ke goal ke mutabik structured hain:\n\n• **Certification Courses**: ${certRange}\n• **Professional Programs**: ${proRange}\n• **Career Programs**: ${careerRange} *(Dedicated Placement Assistance Included)*\n• **Flexible Monthly Installments**: All Career & Professional tracks par available.\n\nAap apna specific budget ya target skill bata dijiye, main best matching courses shortlist kar dunga!`,
        recommendedCourse: null
      };
    }

    // 7. FIELD SPECIFIC DISCOVERY
    if (intent === 'COURSE_DISCOVERY_FIELD') {
      if (sessionMemory.targetField === 'ai') {
        const cMastery = findCourse('ai-mastery');
        const cProd = findCourse('ai-productivity');
        sessionMemory.lastDiscussedCourse = cMastery;
        return {
          text: cMastery ? `Bilkul! AI me aapka goal kya hai?\n\n⭐ **Flagship Recommendation: ${cMastery.name}** (${cMastery.duration}, ${formatFee(cMastery.price)})\n${cProd ? `⚡ **Fast-Track Alternative**: ${cProd.name} (${cProd.duration}, ${formatFee(cProd.price)})\n` : ''}\nAap inme se kis direction me focus karna chahte hain?` : 'AI courses catalog me available hain.',
          recommendedCourse: cMastery
        };
      }

      if (sessionMemory.targetField === 'digital-marketing') {
        const cDM = findCourse('dm-mastery');
        const cPro = findCourse('dm-professional');
        sessionMemory.lastDiscussedCourse = cDM;
        return {
          text: cDM ? `Great choice! Digital Marketing aaj ke time ka high-demand skill hai.\n\n⭐ **Recommended: ${cDM.name}**\n• **Duration:** ${cDM.duration} (${cDM.learningHours} Hours)${cPro ? ` *(Fast-track option: ${cPro.name} • ${cPro.duration}, ${formatFee(cPro.price)})*` : ''}\n• **Projects:** ${formatProjectInfo(cDM)}\n• **Fee:** ${formatFee(cDM.price)}\n• **Mode:** ${cDM.mode}\n\nKya aap iska phase-wise syllabus dekhna chahenge?` : 'Digital Marketing courses load ho rahe hain.',
          recommendedCourse: cDM
        };
      }

      if (sessionMemory.targetField === 'design') {
        const cDesign = findCourse('creative-design');
        const cGD = findCourse('graphic-design-pro');
        sessionMemory.lastDiscussedCourse = cDesign;
        return {
          text: cDesign ? `Design me freelance aur agency dono me great scope hai!\n\n⭐ **Recommended: ${cDesign.name}**\n• **Tools:** ${(cDesign.tools || []).join(', ')}\n• **Projects:** ${formatProjectInfo(cDesign)}\n• **Duration:** ${cDesign.duration}${cGD ? ` *(Fast-track option: ${cGD.name} • ${cGD.duration}, ${formatFee(cGD.price)})*` : ''}\n• **Fee:** ${formatFee(cDesign.price)}\n\nKya aap creative design me job chahte hain ya freelancing?` : 'Design courses load ho rahe hain.',
          recommendedCourse: cDesign
        };
      }

      if (sessionMemory.targetField === 'programming') {
        const cProg = findCourse('fullstack-foundation');
        const cPy = findCourse('python-developer');
        sessionMemory.lastDiscussedCourse = cProg;
        return {
          text: cProg ? `Software Development aur Full-Stack me strong hiring demand hamesha rehti hai!\n\n⭐ **Recommended: ${cProg.name}**\n• **Tools:** ${(cProg.tools || []).join(', ')}\n• **Projects:** ${formatProjectInfo(cProg)}\n• **Duration:** ${cProg.duration}${cPy ? ` *(Fast-track: ${cPy.name} • ${cPy.duration}, ${formatFee(cPy.price)})*` : ''}\n• **Fee:** ${formatFee(cProg.price)}\n\nKya aap zero coding background se start kar rahe hain ya basic knowledge hai?` : 'Programming courses load ho rahe hain.',
          recommendedCourse: cProg
        };
      }

      if (sessionMemory.targetField === 'video') {
        const cVid = findCourse('ai-integrated-video-editing-motion-graphics-professional');
        const cVP = findCourse('video-pro');
        sessionMemory.lastDiscussedCourse = cVid;
        return {
          text: cVid ? `Content creation aur advertising me video editors aur motion designers ki bhari demand hai!\n\n⭐ **Recommended: ${cVid.name}**\n• **Tools:** ${(cVid.tools || []).join(', ')}\n• **Projects:** ${formatProjectInfo(cVid)}\n• **Duration:** ${cVid.duration}${cVP ? ` *(Fast-track: ${cVP.name} • ${cVP.duration}, ${formatFee(cVP.price)})*` : ''}\n• **Fee:** ${formatFee(cVid.price)}\n\nKya aap iska live practical syllabus dekhna chahte hain?` : 'Video courses load ho rahe hain.',
          recommendedCourse: cVid
        };
      }

      if (sessionMemory.targetField === 'kids') {
        const cKids = findCourse('kids-mastery');
        const cYC = findCourse('young-coders');
        sessionMemory.lastDiscussedCourse = cKids;
        return {
          text: cKids ? `Nova Skills ki dedicated **Kids Tech Academy** young learners ke liye STEM & future tech skills sikhata hai!\n\n⭐ **Recommended: ${cKids.name}**\n• **Duration:** ${cKids.duration}${cYC ? ` *(Fast-track: ${cYC.name} • ${cYC.duration}, ${formatFee(cYC.price)})*` : ''}\n• **Fee:** ${formatFee(cKids.price)}\n\nBachhe ki age aur current class kya hai?` : 'Kids Tech courses load ho rahe hain.',
          recommendedCourse: cKids
        };
      }

      if (sessionMemory.targetField === '3d') {
        const c3D = findCourse('archviz-mastery');
        sessionMemory.lastDiscussedCourse = c3D;
        return {
          text: c3D ? `3D Animation aur Architectural Visualisation me top packages milte hain!\n\n⭐ **Recommended: ${c3D.name}**\n• **Tools:** ${(c3D.tools || []).join(', ')}\n• **Projects:** ${formatProjectInfo(c3D)}\n• **Duration:** ${c3D.duration} | **Fee:** ${formatFee(c3D.price)}\n\nKya aap architecture, interior ya gaming 3D me interested hain?` : '3D courses load ho rahe hain.',
          recommendedCourse: c3D
        };
      }

      if (sessionMemory.targetField === 'nocode') {
        const cNC = findCourse('ecommerce-mastery');
        const cNoCode = findCourse('nocode-web-pro');
        sessionMemory.lastDiscussedCourse = cNC;
        return {
          text: cNC ? `Bina code likhe professional websites aur e-commerce stores banana profitable freelancing skill hai!\n\n⭐ **Recommended: ${cNC.name}**\n• **Tools:** ${(cNC.tools || []).join(', ')}\n• **Projects:** ${formatProjectInfo(cNC)}\n• **Duration:** ${cNC.duration}${cNoCode ? ` *(Fast-track: ${cNoCode.name} • ${cNoCode.duration}, ${formatFee(cNoCode.price)})*` : ''}\n• **Fee:** ${formatFee(cNC.price)}\n\nKya aap freelancing clients ke liye websites banana chahte hain ya apne business ke liye?` : 'No-Code courses load ho rahe hain.',
          recommendedCourse: cNC
        };
      }
    }

    // 8. SPECIFIC COURSE INFO QUERY ("AI Digital Marketing Master kya hai?")
    if (intent === 'COURSE_INFO') {
      const detectedCourse = findCourse(userText) || sessionMemory.lastDiscussedCourse || findCourse('dm-mastery') || getAllCourses()[0];
      sessionMemory.lastDiscussedCourse = detectedCourse;

      const toolsList = (detectedCourse && detectedCourse.tools && detectedCourse.tools.length > 0) ? detectedCourse.tools.join(', ') : 'Industry Standard Tools';

      return {
        text: detectedCourse ? `**${detectedCourse.name}** (${detectedCourse.programLevel || 'Program'})\n\n${detectedCourse.fullDesc || detectedCourse.shortDesc || ''}\n\n📋 **Program Highlights:**\n• **Duration**: ${detectedCourse.duration}${detectedCourse.learningHours ? ` (${detectedCourse.learningHours} Hours)` : ''}\n• **Level**: ${detectedCourse.level}\n• **Projects**: ${formatProjectInfo(detectedCourse)}\n• **Tools Covered**: ${toolsList}\n• **Learning Mode**: ${detectedCourse.mode}\n• **Placement Support**: ${detectedCourse.placementSupport ? '✅ Dedicated Placement Assistance' : 'Skill Upgrade & Freelance Guidance'}\n• **Certification**: ISO 9001:2015 Accredited Certificate + Industry Badges\n• **Fee**: ${formatFee(detectedCourse.price)} *(Est. ${calculateEMI(detectedCourse.price)}/mo)*\n\nKya aap iska detailed curriculum dekhna chahte hain ya counselling call book karein?` : 'Course information load ho rahi hai.',
        recommendedCourse: detectedCourse
      };
    }

    // 9. FEES & PAYMENT INTENT
    if (intent === 'FEES_PAYMENT') {
      if (sessionMemory.lastDiscussedCourse) {
        const c = sessionMemory.lastDiscussedCourse;
        return {
          text: `**${c.name}** ki fee structure:\n\n• **Program Fee**: ${formatFee(c.price)}${c.originalPrice > c.price ? ` *(Regular: ${formatFee(c.originalPrice)})*` : ''}\n• **Flexible Monthly Installments**: Approx ${calculateEMI(c.price)} / month (6 Months)\n• **Fast-Track Installments**: Approx ${calculateEMI(c.price, 3)} / month (3 Months)\n\nKya aap admission process janna chahte hain?`,
          recommendedCourse: c
        };
      }

      const certRange = getTrackFeeRange('Certification') || '₹2,900 onwards';
      const proRange = getTrackFeeRange('Professional') || '₹9,900 – ₹34,900';
      const careerRange = getTrackFeeRange('Career') || '₹24,900 – ₹64,900';

      return {
        text: `Nova Skills me course fees transparent aur flexible installment options ke saath structured hain:\n\n• **Certification Courses**: **${certRange}**\n• **Professional Programs**: **${proRange}**\n• **Career Programs**: **${careerRange}** *(Dedicated Career Support Included)*\n\nAap kis specific course ki exact fee dekhna chahte hain?`,
        recommendedCourse: null
      };
    }

    // 10. PLACEMENT & JOBS INTENT
    if (intent === 'PLACEMENT') {
      return {
        text: `Haan, bilkul! Nova Skills apne sabhi **Career Programs aur Professional Programs** me **Dedicated Placement Support** offer karta hai:\n\n🏢 **Industry Hiring Network**: Digital agencies, tech startups aur brands me interview prep & referrals.\n🛠️ **Live Portfolio**: Real-world assessed capstone projects jo recruiters ko aapka hands-on experience prove karte hain.\n📄 **ATS Resume & LinkedIn Optimization**\n🎤 **1-on-1 Mock Interviews**\n\nKya aap career programs ka curriculum dekhna chahte hain?`,
        recommendedCourse: findCourse('dm-mastery') || getAllCourses()[0]
      };
    }

    // 11. FREELANCING INTENT
    if (intent === 'FREELANCING') {
      const c = findCourse('freelancing-client-acquisition-professional') || getAllCourses()[0];
      sessionMemory.lastDiscussedCourse = c;

      return {
        text: c ? `Freelancing start karne ke liye 3 main pillars hote hain:\n1. **High-Demand Practical Skill**\n2. **Verified Proof-of-Work Portfolio**\n3. **Client Acquisition Strategy** (Fiverr, Upwork, LinkedIn outreach & direct client closing)\n\n⭐ **Recommended Program: ${c.name}**\n• **Duration:** ${c.duration} | **Fee:** ${formatFee(c.price)}\n\nKya aap freelancing kisi specific skill me shuru karna chahte hain?` : 'Freelancing courses load ho rahe hain.',
        recommendedCourse: c
      };
    }

    // 12. LEARNING MODE & BATCHES INTENT
    if (intent === 'LEARNING_MODE') {
      return {
        text: `Nova Skills me aap apne schedule ke mutabik flexible learning mode select kar sakte hain:\n\n• 🌐 **Live Online Classes**: Interactive live sessions with senior mentors, screen sharing, real-time doubt clearing aur LMS recording access.\n• 🏫 **Classroom Training**: Modern lab infrastructure at our Siddharth Nagar campus.\n• 🔄 **Hybrid Learning**: Online flexibility + mentor doubt sessions.\n\nAap Online seekhna pasand karenge ya Classroom?`,
        recommendedCourse: null
      };
    }

    // 13. ADMISSION & ENROLLMENT INTENT
    if (intent === 'ADMISSION') {
      return {
        text: `Nova Skills me admission process simple, fast aur transparent hai:\n\n1. **Step 1: Free Career Counselling** — Counsellor ke saath goal, course aur batch timing finalize karein.\n2. **Step 2: Mode Selection** — Live Online ya Siddharth Nagar Classroom mode choose karein.\n3. **Step 3: Registration & Enrollment** — Upfront ya monthly installment plans ke through seat confirm karein.\n\nAap neeche diye gaye button se direct **Apply Now** kar sakte hain ya **Free Consultation** book kar sakte hain!`,
        recommendedCourse: sessionMemory.lastDiscussedCourse || null
      };
    }

    // 14. ACADEMY DISCOVERY INTENT
    if (intent === 'ACADEMY_DISCOVERY') {
      const academies = getAllAcademies();
      const totalC = getAllCourses().length;
      const lines = academies.map((a, idx) => `${idx + 1}. ${a.icon || ''} **${a.name}** (${a.courseCount || (a.courses && a.courses.length) || 0} Courses)`).join('\n');
      return {
        text: `Nova Skills me total **${academies.length} Specialized Academies** aur **${totalC}+ Practical Programs** hain:\n\n${lines}\n\nAap kis Academy ke courses ki details dekhna chahenge?`,
        recommendedCourse: null
      };
    }

    // 15. GENERAL DEFINITION INTENT ("Digital Marketing kya hota hai?")
    if (intent === 'GENERAL_DEFINITION') {
      if (/digital marketing/i.test(lower)) {
        const c = findCourse('dm-mastery') || getAllCourses()[0];
        return {
          text: c ? `**Digital Marketing** search engines (SEO & GEO), paid ads (Google & Meta), social media aur AI automation ke through business growth drive karne ki modern skill hai.\n\n⭐ **Flagship Program: ${c.name} (${c.duration} • ${formatFee(c.price)})**\nKya aap iska syllabus dekhna chahte hain?` : 'Digital Marketing details load rahi hain.',
          recommendedCourse: c
        };
      }

      if (/ai|artificial intelligence/i.test(lower)) {
        const c = findCourse('ai-mastery') || getAllCourses()[0];
        return {
          text: c ? `**Artificial Intelligence (AI)** prompt engineering, automated workflows (n8n), AI agents aur workplace productivity tools ke through 10x output unlock karta hai.\n\n⭐ **Flagship Program: ${c.name} (${c.duration} • ${formatFee(c.price)})**\nKya aap AI seekhne ke options explore karna chahte hain?` : 'AI course details load ho rahi hain.',
          recommendedCourse: c
        };
      }
    }

    // 16. CAREER GUIDANCE & SCOPE INTENT
    if (intent === 'CAREER_GUIDANCE') {
      const cAI = findCourse('ai-mastery');
      const cDM = findCourse('dm-mastery');
      const cFS = findCourse('fullstack-foundation');
      const cDS = findCourse('creative-design');
      return {
        text: `Aaj ke market me top career-oriented skill tracks:\n\n1. 🤖 **${cAI ? cAI.name : 'AI Solutions Engineering & Agentic AI Mastery'}** (${cAI ? `${cAI.duration} • ${formatFee(cAI.price)}` : ''})\n2. 📊 **${cDM ? cDM.name : 'AI Digital Marketing Strategist'}** (${cDM ? `${cDM.duration} • ${formatFee(cDM.price)}` : ''})\n3. 💻 **${cFS ? cFS.name : 'Full Stack Programming Foundation'}** (${cFS ? `${cFS.duration} • ${formatFee(cFS.price)}` : ''})\n4. 🎨 **${cDS ? cDS.name : 'Creative Design Master'}** (${cDS ? `${cDS.duration} • ${formatFee(cDS.price)}` : ''})\n\nAapko creative side (Design/Marketing) zyada suit karti hai ya tech (AI/Coding)?`,
        recommendedCourse: cAI || getAllCourses()[0]
      };
    }

    // 17. SERVICES / B2B OFFERINGS INTENT
    if (intent === 'SERVICES') {
      return {
        text: `Nova Skills education ke saath-saath corporate aur business growth solutions bhi offer karta hai:\n\n• 🚀 **Corporate Upskilling**: Companies aur teams ke liye customized AI, Advanced Excel aur Digital Marketing corporate workshops.\n• 🌐 **Digital & Web Solutions**: High-converting business websites, Shopify stores aur performance marketing strategy.\n• 🎯 **Talent Hiring & Placement Partnership**: Verified skilled students aur interns hire karne ke liye enterprise recruitment partnerships.\n\nBusiness aur corporate requirements ke liye aap hamari enterprise team se directly connect kar sakte hain: **+91 9695904440** ya novaskills.official@gmail.com.`,
        recommendedCourse: null
      };
    }

    // 18. GENERAL COUNSELLING / FALLBACK
    return {
      text: `Main Nova Skills ka official AI Career Advisor hoon. Main aapko aapki qualification aur career goal ke hisaab se sabse best course, fees, duration aur placement support guide kar sakta hoon.\n\nAap mujhse kisi specific course ka syllabus, No-Cost EMI options, batch timings ya free counselling booking ke baare me pooch sakte hain.\n\nAap kis topic par aage baat karna chahenge?`,
      recommendedCourse: null
    };
  }

  /* ─────────────────────────────────────────────
     INJECT STYLES FOR SLIDE-IN PANEL & UI
  ───────────────────────────────────────────── */
  function injectWidgetStyles() {
    if (document.getElementById('nova-ai-styles')) return;
    const style = document.createElement('style');
    style.id = 'nova-ai-styles';
    style.textContent = `
      /* Floating Trigger Button */
      .nova-ai-float-btn {
        position: fixed;
        bottom: 96px;
        right: 28px;
        z-index: 999980;
        background: linear-gradient(135deg, #0599a8 0%, #011731 100%);
        border: 1px solid rgba(56, 189, 248, 0.4);
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 50px;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 8px 32px rgba(5, 153, 168, 0.4);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        animation: novaFloatPulse 3s ease-in-out infinite;
      }
      .nova-ai-float-btn:hover {
        transform: translateY(-4px) scale(1.04);
        box-shadow: 0 16px 48px rgba(5, 153, 168, 0.6);
        border-color: #38bdf8;
      }
      .nova-ai-pulse-dot {
        width: 8px;
        height: 8px;
        background: #38bdf8;
        border-radius: 50%;
        box-shadow: 0 0 10px #38bdf8;
      }

      /* Slide-in Overlay Backdrop */
      .nova-ai-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(1, 15, 30, 0.65);
        z-index: 999990;
        opacity: 0;
        pointer-events: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .nova-ai-overlay.open {
        opacity: 1;
        pointer-events: auto;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      /* Premium Slide-in Panel (Right Drawer) */
      .nova-ai-panel {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 500px;
        max-width: 100vw;
        height: 100vh;
        z-index: 999995;
        background: rgba(2, 18, 38, 0.98);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-left: 1px solid rgba(56, 189, 248, 0.3);
        box-shadow: -16px 0 48px rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        transform: translateX(100%);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }
      .nova-ai-panel.open {
        transform: translateX(0);
        pointer-events: auto;
      }

      /* Header Bar */
      .nova-ai-header {
        background: rgba(5, 153, 168, 0.12);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        shrink: 0;
      }
      .nova-ai-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .nova-ai-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0599a8, #38bdf8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        position: relative;
        box-shadow: 0 4px 16px rgba(5, 153, 168, 0.3);
      }
      .nova-ai-status-online {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 10px;
        height: 10px;
        background: #4ade80;
        border: 2px solid #011731;
        border-radius: 50%;
        box-shadow: 0 0 6px #4ade80;
      }
      .nova-ai-header-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .nova-ai-header-status {
        font-size: 0.76rem;
        color: #94a3b8;
        margin-top: 2px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .nova-ai-header-status span.dot {
        color: #4ade80;
        font-size: 0.7rem;
      }
      .nova-ai-header-controls {
        display: flex;
        gap: 6px;
      }
      .nova-ai-icon-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        cursor: pointer;
        font-size: 1rem;
        width: 34px;
        height: 34px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .nova-ai-icon-btn:hover {
        color: #ffffff;
        background: rgba(5, 153, 168, 0.4);
        border-color: #38bdf8;
      }

      /* Panel Body & Chat Scroll Area */
      .nova-ai-body {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
        scroll-behavior: smooth;
      }

      /* Welcome Screen Experience */
      .nova-ai-welcome-card {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(56, 189, 248, 0.2);
        border-radius: 16px;
        padding: 20px;
        color: #f1f5f9;
        margin-bottom: 8px;
      }
      .nova-ai-welcome-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .nova-ai-welcome-subtitle {
        font-size: 0.88rem;
        color: #38bdf8;
        font-weight: 600;
        margin-bottom: 12px;
      }
      .nova-ai-welcome-help-title {
        font-size: 0.82rem;
        color: #94a3b8;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }
      .nova-ai-check-list {
        list-style: none;
        padding: 0;
        margin: 0 0 16px 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .nova-ai-check-list li {
        font-size: 0.88rem;
        color: #e2e8f0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .nova-ai-check-list .check-icon {
        color: #38bdf8;
        font-weight: bold;
      }

      /* Section Heading */
      .nova-ai-section-heading {
        font-size: 0.85rem;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 6px;
        margin-bottom: 10px;
      }

      /* Modern 2-Column Action Cards Grid */
      .nova-ai-action-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      .nova-ai-action-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 12px 14px;
        color: #ffffff;
        text-align: left;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        gap: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        width: 100%;
        box-sizing: border-box;
      }
      .nova-ai-action-card:hover {
        background: rgba(5, 153, 168, 0.2);
        border-color: #38bdf8;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(5, 153, 168, 0.25);
      }
      .nova-ai-action-card:active {
        transform: scale(0.98);
      }
      .nova-ai-action-card-icon {
        font-size: 1.2rem;
      }
      .nova-ai-action-card-title {
        font-size: 0.88rem;
        font-weight: 700;
        color: #ffffff;
      }
      .nova-ai-action-card-desc {
        font-size: 0.74rem;
        color: #94a3b8;
        line-height: 1.3;
      }

      /* Message Bubbles */
      .nova-ai-message {
        max-width: 90%;
        padding: 14px 16px;
        border-radius: 16px;
        font-size: 0.9rem;
        line-height: 1.55;
        position: relative;
        word-wrap: break-word;
        animation: novaMessageEnter 0.25s ease-out;
      }
      .nova-ai-message.assistant {
        align-self: flex-start;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #f1f5f9;
        border-bottom-left-radius: 4px;
      }
      .nova-ai-message.user {
        align-self: flex-end;
        background: linear-gradient(135deg, #0599a8, #028491);
        color: #ffffff;
        border-bottom-right-radius: 4px;
        box-shadow: 0 4px 16px rgba(5, 153, 168, 0.3);
      }
      .nova-ai-timestamp {
        font-size: 0.68rem;
        color: rgba(255, 255, 255, 0.45);
        margin-top: 6px;
        text-align: right;
      }

      /* Formatting Inside Message */
      .nova-ai-code-block {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 10px;
        font-family: monospace;
        font-size: 0.82rem;
        overflow-x: auto;
        color: #38bdf8;
        margin: 8px 0;
      }
      .nova-ai-inline-code {
        background: rgba(0, 0, 0, 0.3);
        color: #38bdf8;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.82rem;
      }
      .nova-ai-list {
        margin: 6px 0 6px 18px;
        padding: 0;
      }
      .nova-ai-list li {
        margin-bottom: 4px;
      }
      .nova-ai-link {
        color: #38bdf8;
        text-decoration: underline;
        font-weight: 600;
      }

      /* Markdown Tables Inside Message */
      .nova-ai-table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0;
        font-size: 0.78rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .nova-ai-table th, .nova-ai-table td {
        padding: 8px 10px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .nova-ai-table th {
        background: rgba(5, 153, 168, 0.3);
        color: #38bdf8;
        font-weight: 700;
      }
      .nova-ai-table tr:last-child td {
        border-bottom: none;
      }

      /* Reusable Component: Thinking Typing Indicator */
      .nova-ai-typing-container {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
      }
      .nova-ai-typing-label {
        font-size: 0.82rem;
        color: #94a3b8;
        font-style: italic;
      }
      .nova-ai-typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
      }
      .nova-ai-typing-dots span {
        width: 6px;
        height: 6px;
        background: #38bdf8;
        border-radius: 50%;
        animation: novaTypingBlink 1.4s infinite ease-in-out both;
      }
      .nova-ai-typing-dots span:nth-child(1) { animation-delay: -0.32s; }
      .nova-ai-typing-dots span:nth-child(2) { animation-delay: -0.16s; }

      /* Reusable Component: Recommendation Card */
      .nova-ai-recommendation-card {
        background: linear-gradient(135deg, rgba(5, 153, 168, 0.12), rgba(1, 23, 49, 0.45));
        border: 1px solid rgba(56, 189, 248, 0.35);
        border-radius: 14px;
        padding: 14px 16px;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .nova-ai-rec-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .nova-ai-rec-tag {
        font-size: 0.72rem;
        font-weight: 700;
        color: #38bdf8;
        background: rgba(56, 189, 248, 0.15);
        padding: 3px 8px;
        border-radius: 4px;
        letter-spacing: 0.3px;
      }
      .nova-ai-rec-rating {
        font-size: 0.78rem;
        color: #fbbf24;
        font-weight: 600;
      }
      .nova-ai-rec-title {
        font-size: 0.98rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
      }
      .nova-ai-rec-specs-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
        font-size: 0.78rem;
        color: #cbd5e1;
        background: rgba(0, 0, 0, 0.25);
        padding: 8px 10px;
        border-radius: 8px;
      }
      .nova-ai-rec-salary {
        grid-column: span 2;
        color: #4ade80;
      }
      .nova-ai-rec-actions {
        display: flex;
        gap: 6px;
        margin-top: 4px;
        flex-wrap: wrap;
      }
      .nova-ai-rec-btn {
        flex: 1;
        min-width: 80px;
        text-align: center;
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
        border: none;
      }
      .nova-ai-rec-btn.primary { background: #0599a8; color: #ffffff; }
      .nova-ai-rec-btn.primary:hover { background: #028491; }
      .nova-ai-rec-btn.secondary { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
      .nova-ai-rec-btn.secondary:hover { background: rgba(56, 189, 248, 0.3); }
      .nova-ai-rec-btn.outline { background: transparent; color: #cbd5e1; border: 1px solid rgba(255, 255, 255, 0.2); }
      .nova-ai-rec-btn.outline:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }

      /* Panel Input Footer */
      .nova-ai-footer {
        padding: 14px 18px;
        background: rgba(1, 23, 49, 0.95);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        gap: 8px;
        shrink: 0;
      }
      .nova-ai-input-wrap {
        display: flex;
        align-items: flex-end;
        gap: 10px;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 12px;
        padding: 8px 12px;
        transition: border-color 0.2s;
      }
      .nova-ai-input-wrap:focus-within {
        border-color: #38bdf8;
        box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
      }
      .nova-ai-textarea {
        flex: 1;
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: 0.9rem;
        font-family: inherit;
        resize: none;
        max-height: 120px;
        min-height: 24px;
        line-height: 1.4;
        outline: none;
      }
      .nova-ai-textarea::placeholder {
        color: #64748b;
      }
      .nova-ai-send-btn {
        background: #0599a8;
        color: #ffffff;
        border: none;
        border-radius: 8px;
        padding: 8px 14px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
        shrink: 0;
      }
      .nova-ai-send-btn:hover {
        background: #028491;
        box-shadow: 0 4px 12px rgba(5, 153, 168, 0.4);
      }
      .nova-ai-input-info {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        color: #64748b;
        padding: 0 2px;
      }

      /* Reusable Component: Assessment CTA Card */
      .nova-ai-assessment-card {
        background: linear-gradient(135deg, rgba(5, 153, 168, 0.15), rgba(1, 23, 49, 0.4));
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 14px;
        padding: 14px 16px;
        margin-top: 10px;
      }
      .nova-ai-assessment-badge {
        font-size: 0.72rem;
        font-weight: 700;
        color: #38bdf8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }
      .nova-ai-assessment-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 4px 0;
      }
      .nova-ai-assessment-desc {
        font-size: 0.82rem;
        color: #cbd5e1;
        margin: 0 0 10px 0;
      }
      .nova-ai-assessment-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      /* Buttons Shared */
      .nova-ai-btn {
        display: inline-block;
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
        border: none;
      }
      .nova-ai-btn-primary { background: #0599a8; color: #ffffff; }
      .nova-ai-btn-primary:hover { background: #028491; }
      .nova-ai-btn-secondary { background: rgba(255, 255, 255, 0.1); color: #cbd5e1; }
      .nova-ai-btn-secondary:hover { background: rgba(255, 255, 255, 0.2); color: #fff; }

      @keyframes novaFloatPulse {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      @keyframes novaTypingBlink {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
      @keyframes novaMessageEnter {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* Tablet & Mobile Responsiveness */
      @media (max-width: 1024px) {
        .nova-ai-panel { width: 420px; }
      }
      @media (max-width: 768px) {
        .nova-ai-float-btn {
          bottom: 84px !important;
          right: 16px !important;
          padding: 10px 16px !important;
          font-size: 0.85rem !important;
          z-index: 999980 !important;
        }
        .nova-ai-panel {
          width: 100vw !important;
          max-width: 100vw !important;
          height: 100vh !important;
          border-left: none !important;
        }
        .nova-ai-action-grid { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────────
     INJECT HTML FOR BACKDROP, PANEL & WELCOME UI
  ───────────────────────────────────────────── */
  function injectWidgetHTML() {
    if (document.getElementById('nova-ai-float-btn')) return;

    // 1. Floating Action Button
    const btn = document.createElement('button');
    btn.id = 'nova-ai-float-btn';
    btn.className = 'nova-ai-float-btn';
    btn.setAttribute('aria-label', 'Ask Nova AI — Open Career Advisor');
    btn.innerHTML = `<span class="nova-ai-pulse-dot"></span>🤖 Ask Nova AI`;
    btn.onclick = togglePanel;
    document.body.appendChild(btn);

    // 2. Backdrop Overlay
    const overlay = document.createElement('div');
    overlay.id = 'nova-ai-overlay';
    overlay.className = 'nova-ai-overlay';
    overlay.onclick = togglePanel;
    document.body.appendChild(overlay);

    // 3. Slide-in Right Panel
    const panel = document.createElement('div');
    panel.id = 'nova-ai-panel';
    panel.className = 'nova-ai-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'nova-ai-title');

    const user = getUserProfile();
    const userName = user ? user.name || '' : (sessionMemory.name || '');
    const welcomeHeading = userName ? `👋 Welcome, ${userName}!` : `👋 Welcome to Nova Skills`;

    panel.innerHTML = `
      <!-- Header -->
      <div class="nova-ai-header">
        <div class="nova-ai-header-left">
          <div class="nova-ai-avatar">
            🤖
            <span class="nova-ai-status-online"></span>
          </div>
          <div>
            <div class="nova-ai-header-title" id="nova-ai-title">Nova AI Career Advisor</div>
            <div class="nova-ai-header-status">
              <span class="dot">🟢</span> Online • Official Admissions Agent
            </div>
          </div>
        </div>
        <div class="nova-ai-header-controls">
          <button type="button" class="nova-ai-icon-btn" onclick="NovaAIWidget.startNewChat()" title="Start New Chat">🔄</button>
          <button type="button" class="nova-ai-icon-btn" onclick="NovaAIWidget.togglePanel()" title="Minimize">─</button>
          <button type="button" class="nova-ai-icon-btn" onclick="NovaAIWidget.togglePanel()" title="Close">✕</button>
        </div>
      </div>

      <!-- Chat Body -->
      <div class="nova-ai-body" id="nova-ai-body">
        
        <!-- Welcome Screen Card -->
        <div class="nova-ai-welcome-card" id="nova-ai-welcome-screen">
          <div class="nova-ai-welcome-title">${welcomeHeading}</div>
          <div class="nova-ai-welcome-subtitle">Official Nova Skills AI Career & Admissions Advisor</div>

          <div class="nova-ai-welcome-help-title">I can help you with:</div>
          <ul class="nova-ai-check-list">
            <li><span class="check-icon">✓</span> Course recommendation for your goals</li>
            <li><span class="check-icon">✓</span> Fees, No-Cost EMI & Scholarship details</li>
            <li><span class="check-icon">✓</span> Dedicated Placement Support</li>
            <li><span class="check-icon">✓</span> Freelancing roadmap (Fiverr & Upwork)</li>
            <li><span class="check-icon">✓</span> Live Online & Classroom batch schedules</li>
          </ul>

          <div class="nova-ai-section-heading">How can I assist you today?</div>
          <div class="nova-ai-action-grid">
            
            <button type="button" class="nova-ai-action-card" onclick="NovaAIWidget.sendAction('Find Best Course')">
              <span class="nova-ai-action-card-icon">🎯</span>
              <span class="nova-ai-action-card-title">Find Best Course</span>
              <span class="nova-ai-action-card-desc">Personalized course match for career</span>
            </button>

            <button type="button" class="nova-ai-action-card" onclick="NovaAIWidget.sendAction('AI Academy Courses')">
              <span class="nova-ai-action-card-icon">🤖</span>
              <span class="nova-ai-action-card-title">AI Academy</span>
              <span class="nova-ai-action-card-desc">AI Mastery, Agents & n8n Automation</span>
            </button>

            <button type="button" class="nova-ai-action-card" onclick="NovaAIWidget.sendAction('Digital Marketing')">
              <span class="nova-ai-action-card-icon">📊</span>
              <span class="nova-ai-action-card-title">Digital Marketing</span>
              <span class="nova-ai-action-card-desc">SEO, Ads & Marketing Automation</span>
            </button>

            <button type="button" class="nova-ai-action-card" onclick="NovaAIWidget.sendAction('Fees & EMI')">
              <span class="nova-ai-action-card-icon">💰</span>
              <span class="nova-ai-action-card-title">Fees & EMI</span>
              <span class="nova-ai-action-card-desc">0% Interest EMI & Fee Structure</span>
            </button>

            <button type="button" class="nova-ai-action-card" onclick="NovaAIWidget.sendAction('Placement Support')">
              <span class="nova-ai-action-card-icon">🎓</span>
              <span class="nova-ai-action-card-title">Placement Support</span>
              <span class="nova-ai-action-card-desc">Hiring Partners & Career Support</span>
            </button>

            <button type="button" class="nova-ai-action-card" onclick="NovaAIWidget.sendAction('Book Counselling')">
              <span class="nova-ai-action-card-icon">📞</span>
              <span class="nova-ai-action-card-title">Book Counselling</span>
              <span class="nova-ai-action-card-desc">Talk to Senior Career Counsellor</span>
            </button>

          </div>
        </div>

      </div>

      <!-- Footer & Input Area -->
      <div class="nova-ai-footer">
        <div class="nova-ai-input-wrap">
          <textarea id="nova-ai-textarea" class="nova-ai-textarea" rows="1" maxlength="500" placeholder="Ask anything about courses, fees, EMI, placements or admissions..."></textarea>
          <button type="button" class="nova-ai-send-btn" id="nova-ai-send-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            Send
          </button>
        </div>
        <div class="nova-ai-input-info">
          <span>🔒 100% Confidential • Official Nova Skills AI Advisor</span>
          <span id="nova-ai-char-counter">0/500</span>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    const txtArea = panel.querySelector('#nova-ai-textarea');
    const sendBtn = panel.querySelector('#nova-ai-send-btn');

    if (txtArea) {
      txtArea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
      txtArea.addEventListener('input', function () {
        handleInput(this);
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', function (e) {
        e.preventDefault();
        sendMessage();
      });
    }

    loadSavedMemory();
    loadHistory();
  }

  /* ─────────────────────────────────────────────
     REUSABLE COMPONENT BUILDERS
  ───────────────────────────────────────────── */
  function renderAssessmentCTACardHTML() {
    return `
      <div class="nova-ai-assessment-card">
        <div class="nova-ai-assessment-badge">🧠 Free Career Assessment</div>
        <h4 class="nova-ai-assessment-title">Confused about your ideal skill path?</h4>
        <p class="nova-ai-assessment-desc">Take our 2-minute Career Assessment to match your strengths with high-paying skills.</p>
        <div class="nova-ai-assessment-actions">
          <a href="/assessment.html" class="nova-ai-btn nova-ai-btn-primary">Start Career Assessment →</a>
        </div>
      </div>
    `;
  }

  function renderRecommendationCardHTML(courseData = {}) {
    if (!courseData || !courseData.name) return '';

    const title = courseData.name;
    const rating = courseData.rating || '4.9';
    const reviews = courseData.reviews || '250+';
    const duration = courseData.duration || '6 Months';
    const projects = courseData.liveProjects ? `${courseData.liveProjects} Live Projects` : (courseData.projects || '10+ Projects');
    const feeStr = formatFee(courseData.price);
    const emiStr = calculateEMI(courseData.price, courseData.durationMonths || 6);
    const salary = courseData.salary || '₹4.5 – ₹9.0 LPA';
    const placementBadge = courseData.placementSupport ? '100% Dedicated Placement' : 'Career Mentorship';
    const courseUrl = courseData.slug ? `/course-detail.html?id=${courseData.slug}` : (courseData.id ? `/course-detail.html?id=${courseData.id}` : '/courses.html');

    return `
      <div class="nova-ai-recommendation-card">
        <div class="nova-ai-rec-header">
          <span class="nova-ai-rec-tag">★ Recommended for You</span>
          <span class="nova-ai-rec-rating">★★★★★ ${rating} (${reviews})</span>
        </div>
        <h4 class="nova-ai-rec-title">${title}</h4>
        
        <div class="nova-ai-rec-specs-grid">
          <div class="nova-ai-rec-spec">⏱️ <strong>Duration:</strong> ${duration}</div>
          <div class="nova-ai-rec-spec">💻 <strong>Projects:</strong> ${projects}</div>
          <div class="nova-ai-rec-spec">💰 <strong>Fee:</strong> ${feeStr} <span style="font-size:0.7rem;color:#38bdf8;">(${emiStr}/mo EMI)</span></div>
          <div class="nova-ai-rec-spec">🎓 <strong>Placement:</strong> ${placementBadge}</div>
          <div class="nova-ai-rec-spec nova-ai-rec-salary">💼 <strong>Career Outcome:</strong> ${salary}</div>
        </div>

        <div class="nova-ai-rec-actions">
          <a href="${courseUrl}" class="nova-ai-rec-btn secondary">View Curriculum</a>
          <button type="button" class="nova-ai-rec-btn primary" onclick="NovaAIWidget.triggerCTA('enroll')">Apply Now</button>
          <button type="button" class="nova-ai-rec-btn outline" onclick="NovaAIWidget.triggerCTA('counselling')">Book Counselling</button>
        </div>
      </div>
    `;
  }

  /* ─────────────────────────────────────────────
     PANEL CONTROL & EVENTS
  ───────────────────────────────────────────── */
  function openPanel() {
    isPanelOpen = true;
    const panel = document.getElementById('nova-ai-panel');
    const overlay = document.getElementById('nova-ai-overlay');

    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('open');

    document.body.style.overflow = 'hidden';
    document.body.classList.add('nova-ai-active', 'modal-open');
    document.documentElement.classList.add('nova-ai-active', 'modal-open');

    trackEvent('ai_widget_opened');
    setTimeout(() => document.getElementById('nova-ai-textarea')?.focus(), 300);
  }

  function closePanel() {
    isPanelOpen = false;
    const panel = document.getElementById('nova-ai-panel');
    const overlay = document.getElementById('nova-ai-overlay');

    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');

    document.body.style.overflow = '';
    document.body.classList.remove('nova-ai-active', 'modal-open', 'no-scroll');
    document.documentElement.classList.remove('nova-ai-active', 'modal-open', 'no-scroll');

    trackEvent('ai_widget_closed');
  }

  function togglePanel() {
    if (isPanelOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  function sendAction(title) {
    trackEvent('action_card_clicked', { title });

    if (title === 'Career Assessment') {
      if (window.location.pathname.includes('/assessment.html')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.href = '/assessment.html';
      }
      return;
    }

    const prompts = {
      'Find Best Course': 'mujhe kaunsa course karna chahiye?',
      'AI Academy Courses': 'AI Academy ke courses batao',
      'Digital Marketing': 'Digital Marketing course ki details aur fees batao',
      'Fees & EMI': 'Fees kitni hai aur EMI options kya hain?',
      'Placement Support': 'Nova Skills me placement support aur salary bracket kya hai?',
      'Book Counselling': 'Mujhe academic counsellor se baat karni hai'
    };

    const promptText = prompts[title] || title;
    const textarea = document.getElementById('nova-ai-textarea');
    if (textarea) {
      textarea.value = promptText;
      handleInput(textarea);
      sendMessage();
    }
  }

  function handleInput(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';

    const charCounter = document.getElementById('nova-ai-char-counter');
    if (charCounter) {
      charCounter.textContent = `${textarea.value.length}/500`;
    }
  }

  function getSessionId() {
    let sid = sessionStorage.getItem('novaskills_session_id');
    if (!sid) {
      sid = `nova_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('novaskills_session_id', sid);
    }
    return sid;
  }

  function startNewChat() {
    const newSid = `nova_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('novaskills_session_id', newSid);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      sessionStorage.removeItem(STORAGE_KEY_MEMORY);
    } catch(e) {}

    chatHistory = [];
    sessionMemory = {
      name: null,
      qualification: null,
      userType: null,
      careerGoal: null,
      targetField: null,
      subInterest: null,
      dailyTime: null,
      preferredMode: null,
      budget: null,
      lastDiscussedCourse: null,
      lastDiscussedAcademy: null,
      pendingQuestion: null
    };

    const bodyEl = document.getElementById('nova-ai-body');
    const welcomeScreen = document.getElementById('nova-ai-welcome-screen');
    if (bodyEl) {
      bodyEl.querySelectorAll('.nova-ai-message, .nova-ai-recommendation-card, .nova-ai-assessment-card').forEach(el => el.remove());
      if (welcomeScreen) welcomeScreen.style.display = 'block';
    }

    trackEvent('new_chat_started', { sessionId: newSid });
  }

  function scrollToBottom() {
    const bodyEl = document.getElementById('nova-ai-body');
    if (bodyEl) {
      bodyEl.scrollTop = bodyEl.scrollHeight;
      setTimeout(() => { bodyEl.scrollTop = bodyEl.scrollHeight; }, 50);
    }
  }

  /* ─────────────────────────────────────────────
     MESSAGE SENDING & INTELLIGENT DISPATCH
  ───────────────────────────────────────────── */
  async function sendMessage() {
    if (isGenerating) return;
    const textarea = document.getElementById('nova-ai-textarea');
    const sendBtn = document.getElementById('nova-ai-send-btn') || document.querySelector('.nova-ai-send-btn');
    if (!textarea) return;

    const userText = textarea.value.trim();
    if (!userText) return;

    // Clear textbox & reset height
    textarea.value = '';
    handleInput(textarea);

    // Disable Send button & set state
    isGenerating = true;
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.style.opacity = '0.6';
      sendBtn.style.cursor = 'not-allowed';
    }

    // Hide welcome card on first message
    const welcomeScreen = document.getElementById('nova-ai-welcome-screen');
    if (welcomeScreen) welcomeScreen.style.display = 'none';

    // 1. Update session memory with entities from user message
    updateSessionMemory(userText);

    // 2. Append user message & track
    appendMessage(userText, 'user');
    saveHistory();
    trackEvent('ai_query_received', { query_length: (userText || '').length, query_intent: intent });

    // 3. Show typing animation
    showTypingIndicator();

    // 4. Try Backend Worker API with timeout, fallback to local counselling engine
    let answered = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(WORKER_AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          sessionId: getSessionId(),
          memory: sessionMemory
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      removeTypingIndicator();

      if (res.ok) {
        let data;
        try { data = await res.json(); } catch (e) { data = null; }

        if (data && data.sessionId) {
          sessionStorage.setItem('novaskills_session_id', data.sessionId);
        }

        // Validate backend response is meaningful and not a generic placeholder
        if (data && data.success && data.response &&
            !data.response.includes('Backend ready for GPT') &&
            !data.response.includes('I am currently unable to process') &&
            !data.response.includes('brief connection delay')) {
          
          let recCourse = null;
          if (data.recommendations && data.recommendations.length > 0) {
            recCourse = findCourse(data.recommendations[0].name);
          } else {
            recCourse = sessionMemory.lastDiscussedCourse;
          }
          appendMessage(data.response, 'assistant', recCourse);
          answered = true;
        }
      }
    } catch (err) {
      clearTimeout(timeoutId);
      removeTypingIndicator();
    }

    // 5. If not answered via backend, execute client-side intelligence engine
    if (!answered) {
      removeTypingIndicator();
      const localResult = generateAdvisorResponse(userText);
      appendMessage(localResult.text, 'assistant', localResult.recommendedCourse);
    }

    isGenerating = false;
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.style.opacity = '1';
      sendBtn.style.cursor = 'pointer';
    }

    saveHistory();
  }

  function appendMessage(text, role, recommendedCourse = null) {
    const bodyEl = document.getElementById('nova-ai-body');
    if (!bodyEl) return;

    const welcomeScreen = document.getElementById('nova-ai-welcome-screen');
    if (welcomeScreen && chatHistory.length > 0) {
      welcomeScreen.style.display = 'none';
    }

    const msgEl = document.createElement('div');
    msgEl.className = `nova-ai-message ${role}`;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let html = parseMarkdown(text);
    msgEl.innerHTML = html;

    // Attach verified recommendation card if a specific course was recommended
    if (role === 'assistant' && recommendedCourse) {
      if (typeof NovaAnalytics !== 'undefined' && typeof NovaAnalytics.trackCareerAdvisorComplete === 'function') {
        NovaAnalytics.trackCareerAdvisorComplete({
          recommended_course_id: recommendedCourse.id,
          recommended_academy_id: recommendedCourse.academyId || recommendedCourse.academy || '',
          assessment_type: 'ai_interactive_chat'
        });
      }
      msgEl.insertAdjacentHTML('beforeend', renderRecommendationCardHTML(recommendedCourse));
    }

    const timeEl = document.createElement('div');
    timeEl.className = 'nova-ai-timestamp';
    timeEl.innerText = timestamp;
    msgEl.appendChild(timeEl);

    bodyEl.appendChild(msgEl);
    scrollToBottom();

    chatHistory.push({ role, text, timestamp, recommendedCourse: recommendedCourse ? recommendedCourse.id : null });
  }

  /* ─────────────────────────────────────────────
     TYPING INDICATOR
  ───────────────────────────────────────────── */
  function showTypingIndicator() {
    const bodyEl = document.getElementById('nova-ai-body');
    if (!bodyEl) return;
    const typingEl = document.createElement('div');
    typingEl.id = 'nova-ai-typing-indicator';
    typingEl.className = 'nova-ai-message assistant nova-ai-typing-container';
    typingEl.innerHTML = `
      <span class="nova-ai-typing-label">Nova is thinking</span>
      <div class="nova-ai-typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    bodyEl.appendChild(typingEl);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    document.getElementById('nova-ai-typing-indicator')?.remove();
  }

  function triggerCTA(action) {
    trackEvent('cta_clicked', { action });
    const c = sessionMemory.lastDiscussedCourse;
    if (action === 'demo') {
      if (typeof window.openDemoModal === 'function') {
        window.openDemoModal(c ? {
          courseId: c.id,
          courseName: c.name,
          academyName: c.academy,
          academyId: c.academyId,
          sourceCta: 'ai_career_advisor'
        } : { sourceCta: 'ai_career_advisor' });
        closePanel();
        return;
      }
    }
    if (action === 'counselling') {
      if (typeof window.openCounsellingModal === 'function') {
        window.openCounsellingModal(c ? {
          courseId: c.id,
          courseName: c.name,
          academyName: c.academy,
          academyId: c.academyId,
          sourceCta: 'ai_career_advisor'
        } : { sourceCta: 'ai_career_advisor' });
        closePanel();
        return;
      }
    }
    if (action === 'enroll') {
      if (typeof window.openEnrollmentModal === 'function') {
        window.openEnrollmentModal(c ? c.name : '', c ? c.academy : '', c ? c.duration : '', c ? '₹' + (c.price ? c.price.toLocaleString('en-IN') : '') : '', c ? c.id : '');
        closePanel();
        return;
      }
    }
    if (typeof window.openCounsellingModal === 'function') {
      window.openCounsellingModal(c ? { courseId: c.id, courseName: c.name, sourceCta: 'ai_career_advisor' } : { sourceCta: 'ai_career_advisor' });
      closePanel();
    } else if (typeof window.openConsultationPopup === 'function') {
      window.openConsultationPopup();
      closePanel();
    } else {
      window.location.href = '/contact/';
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(chatHistory.slice(-20)));
    } catch (e) {}
  }

  function loadHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const welcomeScreen = document.getElementById('nova-ai-welcome-screen');
          if (welcomeScreen) welcomeScreen.style.display = 'none';
          
          parsed.forEach(item => {
            const courseObj = item.recommendedCourse ? findCourse(item.recommendedCourse) : null;
            appendMessage(item.text, item.role, courseObj);
          });
        }
      }
    } catch (e) {}
  }

  window.NovaAIWidget = {
    togglePanel,
    openPanel,
    closePanel,
    sendAction,
    sendMessage,
    startNewChat,
    getSessionId,
    handleInput,
    triggerCTA,
    renderAssessmentCTACardHTML,
    renderRecommendationCardHTML,
    generateAdvisorResponse,
    detectIntent,
    updateSessionMemory,
    getSessionMemory: () => sessionMemory
  };

  function init() {
    injectWidgetStyles();
    injectWidgetHTML();

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isPanelOpen) {
        togglePanel();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

