const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

// 1. Load current data.js
const dataJsPath = path.join(rootDir, 'data.js');
const dataJsContent = fs.readFileSync(dataJsPath, 'utf8');
vm.runInThisContext(dataJsContent);

console.log(`Loaded NS_COURSES (${NS_COURSES.length}) and NS_ACADEMIES (${NS_ACADEMIES.length}) from data.js`);

function parsePrice(val) {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return val;
  const num = parseInt(String(val).replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

function extractTools(json) {
  if (Array.isArray(json.tools) && json.tools.length > 0) {
    return json.tools.map(t => typeof t === 'string' ? t : (t.name || t.tool || JSON.stringify(t)));
  }
  if (Array.isArray(json.primary_software) && json.primary_software.length > 0) {
    return json.primary_software.map(t => typeof t === 'string' ? t : (t.name || t.tool || JSON.stringify(t)));
  }
  if (Array.isArray(json.software) && json.software.length > 0) {
    return json.software.map(t => typeof t === 'string' ? t : (t.name || t.tool || JSON.stringify(t)));
  }
  if (json.hands_on_tech) {
    const ht = json.hands_on_tech;
    const tools = [];
    if (Array.isArray(ht.core_tools)) tools.push(...ht.core_tools.map(t => t.tool || t.name || t));
    if (Array.isArray(ht.primary_tools)) tools.push(...ht.primary_tools.map(t => t.tool || t.name || t));
    if (Array.isArray(ht.primary_assessed_mastery)) tools.push(...ht.primary_assessed_mastery.map(t => t.tool || t.name || t));
    if (Array.isArray(ht.core_working_proficiency)) tools.push(...ht.core_working_proficiency.map(t => t.tool || t.name || t));
    if (Array.isArray(ht.primary_software_and_platforms)) tools.push(...ht.primary_software_and_platforms.map(t => t.tool || t.name || t));
    if (Array.isArray(ht.supporting_tools)) tools.push(...ht.supporting_tools.map(t => t.tool || t.name || t));
    const clean = tools.filter(Boolean).map(t => typeof t === 'string' ? t : (t.tool || t.name || ''));
    if (clean.filter(Boolean).length > 0) return clean.filter(Boolean);
  }
  if (Array.isArray(json.technologies)) {
    return json.technologies.map(t => typeof t === 'string' ? t : (t.name || t.tool));
  }
  return [];
}

function extractProjectCount(j, existingCount) {
  if (Array.isArray(j.portfolio) && j.portfolio.length > 0) return j.portfolio.length;
  if (Array.isArray(j.portfolio_projects) && j.portfolio_projects.length > 0) return j.portfolio_projects.length;
  if (Array.isArray(j.core_projects) && j.core_projects.length > 0) return j.core_projects.length;
  if (j.hands_on_tech && Array.isArray(j.hands_on_tech.student_deliverables_and_evidence)) return j.hands_on_tech.student_deliverables_and_evidence.length;
  if (Array.isArray(j.final_deliverables) && j.final_deliverables.length > 0) return j.final_deliverables.length;
  if (Array.isArray(j.what_you_will_build) && j.what_you_will_build.length > 0) return j.what_you_will_build.length;
  if (Array.isArray(j.projects) && j.projects.length > 0) return j.projects.length;
  if (typeof j.liveProjects === 'number' && j.liveProjects > 0) return j.liveProjects;
  if (typeof j.projects === 'number' && j.projects > 0) return j.projects;
  return existingCount || 2;
}

function parseDurationWeeks(durStr) {
  if (!durStr) return 4;
  const wMatch = durStr.match(/(\d+)\s*Week/i);
  if (wMatch) return parseInt(wMatch[1], 10);
  const mMatch = durStr.match(/(\d+)\s*Month/i);
  if (mMatch) return parseInt(mMatch[1], 10) * 4;
  return 4;
}

function parseDurationMonths(durStr) {
  if (!durStr) return 1;
  const mMatch = durStr.match(/(\d+)\s*Month/i);
  if (mMatch) return parseInt(mMatch[1], 10);
  const wMatch = durStr.match(/(\d+)\s*Week/i);
  if (wMatch) {
    const weeks = parseInt(wMatch[1], 10);
    return Math.max(1, Math.round(weeks / 4.33));
  }
  return 1;
}

function extractShortDesc(json, fallback) {
  if (typeof json.short_description === 'string' && json.short_description.trim()) return json.short_description.trim();
  if (typeof json.shortDesc === 'string' && json.shortDesc.trim()) return json.shortDesc.trim();
  if (typeof json.description === 'string' && json.description.trim()) return json.description.trim();
  if (json.overview) {
    if (typeof json.overview === 'string' && json.overview.trim()) return json.overview.trim();
    if (typeof json.overview.short_description === 'string' && json.overview.short_description.trim()) return json.overview.short_description.trim();
    if (typeof json.overview.description === 'string' && json.overview.description.trim()) return json.overview.description.trim();
    if (typeof json.overview.headline === 'string' && json.overview.headline.trim()) return json.overview.headline.trim();
  }
  return fallback || '';
}

function extractFullDesc(json, fallback) {
  if (typeof json.full_description === 'string' && json.full_description.trim()) return json.full_description.trim();
  if (typeof json.fullDesc === 'string' && json.fullDesc.trim()) return json.fullDesc.trim();
  if (typeof json.description === 'string' && json.description.trim()) return json.description.trim();
  if (json.overview) {
    if (typeof json.overview === 'string' && json.overview.trim()) return json.overview.trim();
    if (typeof json.overview.description === 'string' && json.overview.description.trim()) return json.overview.description.trim();
    if (typeof json.overview.short_description === 'string' && json.overview.short_description.trim()) return json.overview.short_description.trim();
  }
  return fallback || '';
}

// Update each course in NS_COURSES
NS_COURSES.forEach((course, idx) => {
  const jsonPath = path.join(rootDir, 'data', 'courses', `${course.id}.json`);
  if (!fs.existsSync(jsonPath)) return;

  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const approvedTitle = json.title || json.course_name || json.name || course.title;
  const approvedPrice = parsePrice(json.fee !== undefined ? json.fee : json.price) || course.price;
  const approvedDuration = json.duration || course.duration;
  const approvedHours = parsePrice(json.learning_hours || json.learningHours || json.hours) || parsePrice(course.learning_hours);
  const approvedTools = extractTools(json);
  const approvedProjects = extractProjectCount(json, course.liveProjects);

  // Synchronize essential course fields
  course.name = approvedTitle;
  course.title = approvedTitle;
  course.course_name = approvedTitle;
  course.price = approvedPrice;
  course.fee = approvedPrice;
  course.regular_fee = approvedPrice;

  // Zero-discount policy for certifications
  const isCertification = (course.programLevel || '').includes('Cert') || (json.course_type || '').includes('Cert');
  if (isCertification || !json.original_price || parsePrice(json.original_price) === approvedPrice) {
    course.originalPrice = approvedPrice;
    course.originalFee = approvedPrice;
    course.discount = 0;
  } else {
    course.originalPrice = parsePrice(json.original_price || json.originalPrice || course.originalPrice || approvedPrice);
    course.originalFee = course.originalPrice;
  }

  course.duration = approvedDuration;
  course.duration_weeks = parseDurationWeeks(approvedDuration);
  course.durationMonths = parseDurationMonths(approvedDuration);

  if (approvedHours > 0) {
    course.learning_hours = approvedHours;
    course.learningHours = approvedHours;
    course.hours = approvedHours;
  }

  if (approvedTools.length > 0) {
    course.tools = approvedTools;
  }

  course.liveProjects = approvedProjects;
  course.projects = approvedProjects;

  if (json.level) course.level = json.level;
  if (json.course_type) {
    course.programLevel = json.course_type.includes('CAREER') ? 'Career Program' : (json.course_type.includes('PROFESSIONAL') ? 'Professional Program' : 'Certification Course');
  }

  const cleanShortDesc = extractShortDesc(json, course.shortDesc);
  course.shortDesc = cleanShortDesc;
  course.short_description = cleanShortDesc;

  const cleanFullDesc = extractFullDesc(json, course.fullDesc);
  course.fullDesc = cleanFullDesc;
  course.full_description = cleanFullDesc;
});

// Update each academy's courses array in NS_ACADEMIES
NS_ACADEMIES.forEach(acad => {
  if (Array.isArray(acad.courses)) {
    acad.courses = acad.courses.map(ac => {
      const full = NS_COURSES.find(c => c.id === ac.id);
      if (!full) return ac;
      return {
        ...ac,
        name: full.name,
        title: full.title,
        price: full.price,
        originalPrice: full.originalPrice,
        duration: full.duration,
        durationMonths: full.durationMonths,
        level: full.level,
        programLevel: full.programLevel,
        shortDesc: full.shortDesc,
        fullDesc: full.fullDesc,
        tools: (full.tools || []).slice(0, 5),
        liveProjects: full.liveProjects
      };
    });
  }
});

// Update nova-skills-109-course-content.json
const catalogPath = path.join(rootDir, 'nova-skills-109-course-content.json');
let catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
catalog = catalog.map(item => {
  const cId = item.id || item.course_id;
  const full = NS_COURSES.find(c => c.id === cId);
  if (full) {
    return {
      ...item,
      id: full.id,
      course_id: full.id,
      name: full.name,
      title: full.title,
      course_name: full.name,
      price: full.price,
      fee: full.fee,
      original_price: full.originalPrice,
      originalPrice: full.originalPrice,
      duration: full.duration,
      duration_weeks: full.duration_weeks,
      duration_months: full.durationMonths,
      durationMonths: full.durationMonths,
      learning_hours: full.learning_hours,
      learningHours: full.learning_hours,
      level: full.level,
      programLevel: full.programLevel,
      tools: full.tools,
      liveProjects: full.liveProjects,
      projects: full.projects,
      short_description: full.shortDesc,
      shortDesc: full.shortDesc
    };
  }
  return item;
});
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`✅ Synchronized 109 items in nova-skills-109-course-content.json.`);

// Write back data.js
const newDataJsContent = `// Nova Skills Master Course Data & Academy Registry
const NS_ACADEMIES = ${JSON.stringify(NS_ACADEMIES, null, 2)};

const NS_COURSES = ${JSON.stringify(NS_COURSES, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NS_ACADEMIES, NS_COURSES };
}
`;

fs.writeFileSync(dataJsPath, newDataJsContent, 'utf8');
console.log(`✅ Successfully updated data.js (${(newDataJsContent.length / 1024).toFixed(1)} KB).`);
