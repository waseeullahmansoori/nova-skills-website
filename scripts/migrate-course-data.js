'use strict';

/**
 * P0-1 Migration Script: Generates Canonical Data Sources from Audited Repository Inputs
 * Produces:
 *   1. data/academies.json        (12 academies, metadata only — no duplicated course objects)
 *   2. data/courses.json          (109 canonical courses adhering to course-data-schema.json)
 *   3. data/curricula/<id>.json   (109 structured per-course curriculum/academic detail stores)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

// Load legacy inputs for one-time normalized migration
const sandbox = { module: { exports: {} } };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8'), sandbox);
const { NS_ACADEMIES, NS_COURSES } = sandbox.module.exports;

const masterMapping = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'scripts', 'Nova_Skills_109_Course_Master_Mapping.json'), 'utf8')
);
const masterById = new Map(masterMapping.courses.map(m => [m.stable_id, m]));

const imageMap = JSON.parse(fs.readFileSync(path.join(ROOT, 'course-image-map.json'), 'utf8'));
const visualAssets = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'visual-assets', 'course-visuals.json'), 'utf8'));

const ACADEMY_DIR_SLUGS = {
  'digital-marketing': 'digital-marketing',
  'ai': 'ai',
  'design': 'design',
  'programming': 'programming',
  'nocode': 'no-code-web',
  'video': 'video-motion',
  '3d': '3d',
  'career': 'career-freelancing',
  'communication': 'communication',
  'kids': 'kids-tech',
  'creator': 'creator',
  'office': 'office-productivity'
};

function parseDuration(displayLabel, legacyObj) {
  const raw = String(displayLabel || '').trim();
  const wkMatch = raw.match(/(\d+(?:\.\d+)?)\s*Week/i);
  if (wkMatch) {
    const val = parseFloat(wkMatch[1]);
    return {
      value: val,
      unit: 'weeks',
      displayLabel: raw,
      weeksEquivalent: val,
      monthsEquivalent: Math.max(1, Math.round((val / 4.33) * 10) / 10)
    };
  }
  const dyMatch = raw.match(/(\d+(?:\.\d+)?)\s*Day/i);
  if (dyMatch) {
    const val = parseFloat(dyMatch[1]);
    return {
      value: val,
      unit: 'days',
      displayLabel: raw,
      weeksEquivalent: Math.round((val / 7) * 10) / 10,
      monthsEquivalent: 1
    };
  }
  const moMatch = raw.match(/(\d+(?:\.\d+)?)\s*Month/i);
  if (moMatch) {
    const val = parseFloat(moMatch[1]);
    return {
      value: val,
      unit: 'months',
      displayLabel: raw,
      weeksEquivalent: val * 4,
      monthsEquivalent: val
    };
  }
  const fallbackVal = legacyObj.durationMonths || 1;
  return {
    value: fallbackVal,
    unit: 'months',
    displayLabel: raw || `${fallbackVal} Month${fallbackVal > 1 ? 's' : ''}`,
    weeksEquivalent: fallbackVal * 4,
    monthsEquivalent: fallbackVal
  };
}

function classifyProgram(legacyObj, detailJson) {
  const pl = String(legacyObj.programLevel || detailJson.course_type || 'Certification Course');
  if (pl.toLowerCase().includes('career')) {
    return {
      programType: 'career',
      programLevel: 'Career Program',
      level: legacyObj.level || detailJson.level || 'Beginner to Advanced',
      category: 'career-program',
      courseRole: detailJson.course_role || 'Career Program'
    };
  }
  if (pl.toLowerCase().includes('professional')) {
    return {
      programType: 'professional',
      programLevel: 'Professional Program',
      level: legacyObj.level || detailJson.level || 'Intermediate',
      category: 'professional-program',
      courseRole: detailJson.course_role || 'Professional Program'
    };
  }
  return {
    programType: 'certification',
    programLevel: 'Certification Course',
    level: legacyObj.level || detailJson.level || 'Beginner',
    category: 'certification-course',
    courseRole: detailJson.course_role || 'Skill Certification'
  };
}

function parseDelivery(legacyObj, progClass, price) {
  const rawMode = String(legacyObj.mode || 'Hybrid').trim();
  let modes = ['online-live', 'classroom'];
  if (/hybrid/i.test(rawMode)) {
    modes = ['hybrid', 'online-live', 'classroom'];
  } else if (/online/i.test(rawMode) && !/classroom/i.test(rawMode)) {
    modes = ['online-live'];
  } else if (/classroom/i.test(rawMode) && !/online/i.test(rawMode)) {
    modes = ['classroom'];
  }
  const typeStr = `${progClass.programLevel} ${progClass.courseRole}`.toUpperCase();
  const freeDemo =
    ['MASTER', 'PROFESSIONAL', 'SPECIALIZATION', 'FOUNDATION', 'CAREER'].some(t => typeStr.includes(t)) ||
    price >= 12000;

  return {
    modes,
    displayMode: rawMode,
    placementSupport: Boolean(legacyObj.placementSupport),
    freeDemo
  };
}

function parseEligibility(detailJson, courseId, academyId) {
  const pre = detailJson.prerequisites || {};
  const prereqList = [];
  if (typeof pre.required === 'string' && pre.required.trim()) prereqList.push(pre.required.trim());
  if (Array.isArray(pre.required)) prereqList.push(...pre.required);

  const recList = [];
  if (typeof pre.recommended === 'string' && pre.recommended.trim()) recList.push(pre.recommended.trim());
  if (Array.isArray(pre.recommended)) recList.push(...pre.recommended);

  const bestFor = Array.isArray(detailJson.target_audience?.best_for)
    ? detailJson.target_audience.best_for
    : [];

  let minimumAge = null;
  let maximumAge = null;
  if (academyId === 'kids') {
    minimumAge = 8;
    maximumAge = 16;
  }

  return {
    minimumAge,
    maximumAge,
    prerequisites: prereqList,
    recommendedBackground: recList,
    bestFor,
    notRequired: pre.not_required || null,
    systemRequirements: pre.system_requirements || null
  };
}

function buildProjectsModel(c, detailJson) {
  const kf = detailJson.overview?.key_facts?.project_count;
  const wywb = Array.isArray(detailJson.what_you_will_build) ? detailJson.what_you_will_build.length : 0;
  const coreArr = Array.isArray(detailJson.core_projects) ? detailJson.core_projects.length : 0;
  const finalDeliv = Array.isArray(detailJson.final_deliverables) ? detailJson.final_deliverables.length : 0;
  const stuDeliv = Array.isArray(detailJson.hands_on_tech?.student_deliverables_and_evidence)
    ? detailJson.hands_on_tech.student_deliverables_and_evidence.length
    : 0;
  const projFieldNum = typeof detailJson.projects === 'number'
    ? detailJson.projects
    : (Array.isArray(detailJson.projects) ? detailJson.projects.length : 0);

  const metrics = [];
  let primaryCount = null;
  let displayLabel = '';
  let suppressNumericBadge = false;
  let reviewRequired = false;
  const reviewNotes = [];

  if (c.id === 'ai-assisted-full-stack-web-development') {
    metrics.push(
      { type: 'portfolio', count: 6, displayLabel: '6 Production Portfolio Projects per Student' },
      { type: 'core-production', count: 4, displayLabel: '4 Common Core Builds (Modules 01–12)' },
      { type: 'specialization', count: 1, displayLabel: '1 Selected Specialization Build (from 3 Track Options)' },
      { type: 'capstone', count: 1, displayLabel: '1 Integrated Commercial Capstone & Viva Voce' },
      { type: 'blueprint-total', count: wywb, displayLabel: `${wywb} Curriculum Build Blueprints Across Paths` },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Graduation Deliverable Artifacts` }
    );
    primaryCount = 6;
    displayLabel = '6 Portfolio Projects';
  } else if (c.id === 'dm-professional') {
    metrics.push(
      { type: 'core-production', count: 5, displayLabel: '5 Core Projects' },
      { type: 'capstone', count: 1, displayLabel: '1 Final Portfolio Project' },
      { type: 'graduation-deliverables', count: finalDeliv || 5, displayLabel: `${finalDeliv || 5} Practical Deliverables` }
    );
    primaryCount = 5;
    displayLabel = '5 Core Projects';
  } else if (c.id === 'dm-mastery' || c.id === 'performance-marketing-specialist') {
    metrics.push(
      { type: 'core-production', count: 7, displayLabel: '7 Core Projects' },
      { type: 'capstone', count: 1, displayLabel: '1 Final Capstone' },
      { type: 'portfolio', count: 8, displayLabel: '8 Core & Capstone Projects' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Final Deliverables` }
    );
    primaryCount = 8;
    displayLabel = '8 Core & Capstone Projects';
  } else if (c.id === 'ai-for-business-pro') {
    metrics.push(
      { type: 'core-production', count: 4, displayLabel: '4 Major Projects' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Deliverable Artifacts` }
    );
    primaryCount = 4;
    displayLabel = '4 Major Projects';
  } else if (c.id === 'creative-design') {
    metrics.push(
      { type: 'portfolio', count: 6, displayLabel: '6 Major Portfolio Case Studies' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Deliverable Artifacts` }
    );
    primaryCount = 6;
    displayLabel = '6 Portfolio Case Studies';
  } else if (c.id === 'graphic-design-pro') {
    metrics.push(
      { type: 'portfolio', count: 4, displayLabel: '4 Major Portfolio Case Studies (Including Integrated Capstone)' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Deliverable Artifacts` }
    );
    primaryCount = 4;
    displayLabel = '4 Portfolio Case Studies';
  } else if (c.id === 'python-developer') {
    metrics.push(
      { type: 'portfolio', count: 2, displayLabel: '2 Major Portfolio Projects' },
      { type: 'capstone', count: 1, displayLabel: '1 Capstone Defense' },
      { type: 'graduation-deliverables', count: stuDeliv || finalDeliv, displayLabel: `${stuDeliv || finalDeliv} Portfolio Deliverables` }
    );
    primaryCount = 2;
    displayLabel = '2 Portfolio Projects + Capstone';
  } else if (c.id === 'html-css') {
    metrics.push(
      { type: 'portfolio', count: 2, displayLabel: '2 Assessed Portfolio Websites' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Course Deliverables` }
    );
    primaryCount = 2;
    displayLabel = '2 Portfolio Websites';
  } else if (c.id === 'javascript-cert') {
    metrics.push(
      { type: 'portfolio', count: 2, displayLabel: '2 Working Browser Applications' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Course Deliverables` }
    );
    primaryCount = 2;
    displayLabel = '2 Browser Applications';
  } else if (c.id === 'ecommerce-mastery') {
    metrics.push(
      { type: 'portfolio', count: 4, displayLabel: '4 Major Assessed Portfolio Projects' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Graduation Deliverables` }
    );
    primaryCount = 4;
    displayLabel = '4 Portfolio Projects';
  } else if (c.id === 'nocode-web-pro') {
    metrics.push(
      { type: 'portfolio', count: 3, displayLabel: '3 Major Assessed Projects' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Graduation Deliverables` }
    );
    primaryCount = 3;
    displayLabel = '3 Assessed Projects';
  } else if (c.id === 'uiux-design-pro') {
    metrics.push(
      { type: 'portfolio', count: 3, displayLabel: '3 Major Portfolio Case Studies' },
      { type: 'capstone', count: 1, displayLabel: '1 Flagship Capstone' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Deliverable Checklist Items` }
    );
    primaryCount = null;
    suppressNumericBadge = true;
    reviewRequired = true;
    reviewNotes.push('uiux-design-pro: data.js previously listed 5 (from final_deliverables) vs detail JSON "3 Major Portfolio Case Studies + 1 Flagship Capstone".');
    displayLabel = 'Portfolio Case Studies + Capstone';
  } else if (c.id === 'fullstack-foundation') {
    metrics.push(
      { type: 'portfolio', count: 3, displayLabel: '3 Major Portfolio Projects' },
      { type: 'capstone', count: 1, displayLabel: '1 Capstone Project' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Final Deliverables` }
    );
    primaryCount = null;
    suppressNumericBadge = true;
    reviewRequired = true;
    reviewNotes.push('fullstack-foundation: data.js previously listed 5 (from final_deliverables) vs detail JSON "3 MAJOR PORTFOLIO PROJECTS + CAPSTONE".');
    displayLabel = 'Portfolio Projects + Capstone';
  } else if (c.id === 'youtube-mastery' || c.id === 'content-creator-pro') {
    metrics.push(
      { type: 'core-production', count: 3, displayLabel: '3 Assessed Channel/Creator Projects (overview key_facts)' },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Practical Checklist Deliverables` }
    );
    primaryCount = null;
    suppressNumericBadge = true;
    reviewRequired = true;
    reviewNotes.push(`${c.id}: data.js previously listed 15 (final_deliverables) vs overview.key_facts.project_count=3; requires academic confirmation.`);
    displayLabel = 'Hands-On Creator Projects';
  } else if (c.id === 'biz-productivity') {
    metrics.push(
      { type: 'live-practical', count: wywb, displayLabel: `${wywb} Build Specs (what_you_will_build)` },
      { type: 'graduation-deliverables', count: finalDeliv, displayLabel: `${finalDeliv} Final Deliverable Entry` }
    );
    primaryCount = null;
    suppressNumericBadge = true;
    reviewRequired = true;
    reviewNotes.push('biz-productivity: overview.key_facts.project_count=6 vs what_you_will_build=4 vs legacy data.js=1; requires academic confirmation.');
    displayLabel = 'MIS & BI Portfolio Projects';
  } else {
    const resolvedCount = c.liveProjects || coreArr || wywb || projFieldNum || 2;
    metrics.push({
      type: 'live-practical',
      count: resolvedCount,
      displayLabel: `${resolvedCount} Practical Project${resolvedCount === 1 ? '' : 's'}`
    });
    if (finalDeliv > 0 && finalDeliv !== resolvedCount) {
      metrics.push({
        type: 'graduation-deliverables',
        count: finalDeliv,
        displayLabel: `${finalDeliv} Course Deliverables`
      });
    }
    primaryCount = resolvedCount;
    displayLabel = `${resolvedCount} Project${resolvedCount === 1 ? '' : 's'}`;
  }

  return {
    metrics,
    primaryCount,
    displayLabel,
    suppressNumericBadge,
    reviewRequired,
    reviewNotes
  };
}

function normalizeAcademyRecord(a) {
  const dirSlug = ACADEMY_DIR_SLUGS[a.id] || a.slug || a.id;
  return {
    id: a.id,
    slug: dirSlug,
    routePath: `/academies/${dirSlug}/`,
    name: a.name,
    icon: a.icon,
    color: a.color,
    description: a.description,
    status: a.status || 'active'
  };
}

// 1. Build data/academies.json
const academiesOut = {
  version: '2.0.0',
  generatedAt: '2026-11-12T00:00:00Z',
  totalAcademies: NS_ACADEMIES.length,
  academies: NS_ACADEMIES.map(normalizeAcademyRecord)
};
fs.writeFileSync(path.join(ROOT, 'data', 'academies.json'), JSON.stringify(academiesOut, null, 2) + '\n', 'utf8');

// 2. Build data/courses.json + data/curricula/<id>.json
const curriculaDir = path.join(ROOT, 'data', 'curricula');
fs.mkdirSync(curriculaDir, { recursive: true });

const coursesList = [];
const visualLookup = new Map();
for (const c of NS_COURSES) {
  const m = masterById.get(c.id);
  const detailPath = path.join(ROOT, 'data', 'courses', `${c.id}.json`);
  const detailJson = JSON.parse(fs.readFileSync(detailPath, 'utf8'));
  const imgEntry = imageMap.byId[c.id];
  const showcaseEntry = visualAssets.showcaseByCourse?.[c.id] || null;
  const stripEntry = visualAssets.sectionStrips?.[c.id] || null;

  const officialTitle = m?.final_course_name || c.name;
  const regPrice = m ? m.regular_fee : (c.regular_price || c.originalPrice || c.price);
  const launchPrice = m && m.offer_active ? m.launch_fee : null;
  const currentPrice = m ? m.effective_fee : c.price;
  const offerActive = m ? Boolean(m.offer_active) : Boolean(c.offer_active);
  const discountPercent = offerActive && regPrice > 0
    ? Math.round(((regPrice - currentPrice) / regPrice) * 100)
    : 0;

  const progClass = classifyProgram(c, detailJson);
  const dur = parseDuration(detailJson.duration || c.duration, c);
  const rawHours = detailJson.learning_hours || detailJson.guided_hours || detailJson.hours || c.learningHours || c.hours || null;
  const guidedHours = typeof rawHours === 'number'
    ? rawHours
    : (rawHours ? (parseInt(String(rawHours).match(/\d+/)?.[0] || '', 10) || null) : null);
  const delivery = parseDelivery(c, progClass, regPrice);
  const projects = buildProjectsModel(c, detailJson);

  const reviewNotes = [...projects.reviewNotes];
  reviewNotes.push('GST Policy Note: Detail sidebar displays "18% GST included" per Phase 4 audit, whereas 68 curriculum FAQ responses state "statutory 18% GST extra"; requires administrative confirmation.');
  if (c.id === 'ai-assisted-full-stack-web-development') {
    reviewNotes.push('overview.specialization_rule prose mentions INR 64,900 standard tuition while approved 2026-11-09 launch offer is INR 44,900.');
  }

  // Extract gallery from approved visual assets
  const gallery = [];
  if (showcaseEntry && Array.isArray(showcaseEntry.projects)) {
    for (const p of showcaseEntry.projects) {
      if (p.image) gallery.push({ kind: 'project-showcase', title: p.title, ...p.image });
    }
  }

  const cardDesc =
    (typeof detailJson.overview?.short_description === 'string' && detailJson.overview.short_description.trim()) ||
    c.shortDesc ||
    c.fullDesc ||
    '';
  const overviewDesc =
    (typeof detailJson.overview?.positioning === 'string' && detailJson.overview.positioning.trim()) ||
    c.fullDesc ||
    cardDesc;

  const certDesc =
    (typeof detailJson.certification?.credential_name === 'string' && detailJson.certification.credential_name) ||
    (typeof detailJson.certification?.description === 'string' && detailJson.certification.description) ||
    'QR-Code Verifiable Nova Skills Completion Certificate';

  const acadDirSlug = ACADEMY_DIR_SLUGS[c.academyId] || c.academyId;
  const seoTitle = `${officialTitle} Course | ${dur.displayLabel}, ₹${currentPrice.toLocaleString('en-IN')} | Nova Skills`;
  const seoDesc = `Learn ${officialTitle} at Nova Skills. ${dur.displayLabel}${guidedHours ? ` (${guidedHours} hrs)` : ''} practical training with projects, tools, and placement-oriented portfolio guidance.`;

  const rawModules = Array.isArray(detailJson.modules) ? detailJson.modules : (Array.isArray(c.curriculum) ? c.curriculum : []);
  const modulesSummary = rawModules.map((mod, idx) => ({
    module: mod.module || mod.module_number || `Module ${String(idx + 1).padStart(2, '0')}`,
    title: mod.title || mod.module_title || `Module ${idx + 1}`,
    lessons: typeof mod.lessons === 'number'
      ? mod.lessons
      : (Array.isArray(mod.lessons) ? mod.lessons.length : (Array.isArray(mod.topics) ? mod.topics.length : 4))
  }));

  const canonicalCourse = {
    id: c.id,
    slug: c.slug || c.id,
    status: 'published',
    courseNumber: m ? m.course_number : c.courseNumber,
    academyId: c.academyId,
    academySlug: acadDirSlug,
    academyName: c.academy,
    title: officialTitle,
    shortTitle: officialTitle,
    description: {
      card: c.shortDesc || cardDesc,
      overview: overviewDesc,
      full: c.fullDesc || cardDesc
    },
    classification: progClass,
    duration: dur,
    guidedHours,
    delivery,
    pricing: {
      currency: 'INR',
      currentPrice,
      originalPrice: regPrice,
      launchPrice,
      offerActive,
      discountPercent,
      gst: {
        rate: 18,
        treatment: 'requires-admin-confirmation',
        uiDisplayLabel: '18% GST included',
        faqProseNote: 'Detail FAQ prose on 68 courses states statutory 18% GST extra',
        totalWithExtraGst: Math.round(currentPrice * 1.18)
      },
      installment: {
        available: true,
        note: 'Flexible monthly installment options available'
      }
    },
    projects,
    tools: Array.isArray(c.tools) && c.tools.length > 0 ? c.tools : [],
    eligibility: parseEligibility(detailJson, c.id, c.academyId),
    learningOutcomes: Array.isArray(detailJson.learning_outcomes) ? detailJson.learning_outcomes : [],
    certificate: {
      type: progClass.programLevel,
      description: certDesc
    },
    images: {
      card: {
        desktop: imgEntry.image.desktop,
        mobile: imgEntry.image.mobile,
        mimeType: imgEntry.image.mimeType,
        alt: imgEntry.image.alt,
        width: imgEntry.image.width,
        height: imgEntry.image.height,
        mobileWidth: imgEntry.image.mobileWidth,
        mobileHeight: imgEntry.image.mobileHeight,
        imageId: imgEntry.imageId,
        imageSource: imgEntry.imageSource
      },
      hero: imgEntry.image.desktop,
      gallery
    },
    curriculumRef: `curricula/${c.id}.json`,
    modulesSummary,
    seo: {
      title: seoTitle,
      description: seoDesc,
      canonicalUrl: `https://novaskills.in/course-detail.html?id=${c.id}`,
      ogImage: 'https://novaskills.in/public/images/seo/og-banner.png?v=2026'
    },
    dataQuality: {
      status: projects.reviewRequired ? 'review-required' : 'verified',
      reviewRequired: projects.reviewRequired,
      reviewNotes
    },
    ui: {
      icon: c.icon,
      color: c.color,
      featured: Boolean(c.featured),
      rating: c.rating || 4.8,
      reviews: c.reviews || 120,
      students: c.students || 500,
      tags: Array.isArray(c.tags) ? c.tags : [],
      approvalStatus: m ? m.approval_status : 'APPROVED'
    }
  };

  coursesList.push(canonicalCourse);

  // Build compact structured curriculum document linked by courseId
  // Preserves canonical academic keys expected by course-detail.js and build-course-pages.js
  const curriculumDoc = {
    courseId: c.id,
    schemaVersion: '1.0.0',
    curriculumRef: `curricula/${c.id}.json`,
    guidedHours,
    learning_hours: detailJson.learning_hours || guidedHours,
    course_type: detailJson.course_type || progClass.courseType,
    seo_title: detailJson.seo_title || seoTitle,
    seo_description: detailJson.seo_description || seoDesc,
    overview: detailJson.overview || null,
    why_now: detailJson.why_now || null,
    learning_journey: detailJson.learning_journey || null,
    prerequisites: detailJson.prerequisites || null,
    target_audience: detailJson.target_audience || null,
    learning_outcomes: detailJson.learning_outcomes || [],
    hands_on_tech: detailJson.hands_on_tech || null,
    modules: rawModules,
    what_you_will_build: detailJson.what_you_will_build || [],
    final_deliverables: detailJson.final_deliverables || [],
    student_deliverables_and_evidence: detailJson.student_deliverables_and_evidence || [],
    assessment: detailJson.assessment || null,
    certification: detailJson.certification || null,
    career_paths: detailJson.career_paths || [],
    freelance_applications: detailJson.freelance_applications || [],
    business_use_cases: detailJson.business_use_cases || [],
    industry_workflow: detailJson.industry_workflow || [],
    best_practices: detailJson.best_practices || [],
    common_mistakes: detailJson.common_mistakes || [],
    not_covered: detailJson.not_covered || [],
    next_learning_path: detailJson.next_learning_path || [],
    faq: detailJson.faq || [],
    specialization_selector_config: detailJson.specialization_selector_config || null,
    visualShowcase: showcaseEntry,
    visualStrips: stripEntry
  };

  fs.writeFileSync(path.join(curriculaDir, `${c.id}.json`), JSON.stringify(curriculumDoc, null, 2) + '\n', 'utf8');
}

const minPublishedPrice = Math.min(...coursesList.map(c => c.pricing.currentPrice));
const coursesOut = {
  version: '2.0.0',
  schemaVersion: '1.0.0',
  generatedAt: '2026-11-12T00:00:00Z',
  totalCourses: coursesList.length,
  approvedStartingPrice: 2900,
  computedMinimumPublishedPrice: minPublishedPrice,
  courses: coursesList
};

fs.writeFileSync(path.join(ROOT, 'data', 'courses.json'), JSON.stringify(coursesOut, null, 2) + '\n', 'utf8');
console.log(`✅ Generated data/academies.json (${academiesOut.totalAcademies} academies)`);
console.log(`✅ Generated data/courses.json (${coursesOut.totalCourses} courses, minPrice=₹${minPublishedPrice})`);
console.log(`✅ Generated ${coursesList.length} curriculum files under data/curricula/`);
