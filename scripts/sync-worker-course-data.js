/**
 * P0-1 Worker & AI Advisor Knowledge Sync
 * Generates worker/src/data/courses.json and cloudflare-worker/src/knowledge/knowledgeBase.js
 * directly from canonical data/courses.json and data/academies.json.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NovaCourseData = require(path.join(ROOT, 'js', 'course-data.js'));

const courses = NovaCourseData.getPublishedCourses();
const academies = NovaCourseData.getAllAcademies();
const acadMap = new Map(academies.map(a => [a.id, a]));

// Group siblings for related_courses
const byAcad = new Map();
for (const c of courses) {
  if (!byAcad.has(c.academyId)) byAcad.set(c.academyId, []);
  byAcad.get(c.academyId).push(c.id);
}

// 1. Build worker/src/data/courses.json (all 109 canonical courses)
const workerCourses = courses.map(c => {
  const acad = acadMap.get(c.academyId);
  const siblings = (byAcad.get(c.academyId) || []).filter(id => id !== c.id).slice(0, 3);
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    academy: acad ? acad.name : c.academy,
    level: c.programLevel || 'Certification Course',
    category: c.academyId,
    description: c.shortDesc || c.fullDesc || '',
    duration: c.duration || 'Flexible',
    fees: `₹${(c.price || 0).toLocaleString('en-IN')}`,
    fee_numeric: c.price || 0,
    mode: c.mode || 'Live Interactive Online',
    eligibility: c.eligibility || 'Beginners, Students & Working Professionals',
    difficulty: c.level || 'Beginner to Intermediate',
    career_outcomes: (c.learningOutcomes && c.learningOutcomes.length > 0)
      ? c.learningOutcomes.slice(0, 4)
      : [`Practical portfolio readiness in ${c.academy}`],
    salary_range: c.placementSupport ? 'Career & Placement Portfolio Ready' : 'Skill & Freelance Portfolio Ready',
    skills: (c.tools && c.tools.length > 0) ? c.tools : [c.academy],
    software: (c.tools && c.tools.length > 0) ? c.tools : [],
    projects: NovaCourseData.getCourseProjectLabel(c),
    internship: Boolean(c.placementSupport),
    placement_support: Boolean(c.placementSupport),
    certification: (c.certificate && c.certificate.type)
      ? `ISO 9001:2015 Verified Nova Skills ${c.certificate.type} Certificate`
      : 'ISO 9001:2015 Verified Nova Skills Certificate',
    curriculum: Array.isArray(c.curriculum)
      ? c.curriculum.map(m => ({ title: m.title, hours: m.hours || null }))
      : [],
    related_courses: siblings
  };
});

fs.writeFileSync(
  path.join(ROOT, 'worker', 'src', 'data', 'courses.json'),
  JSON.stringify(workerCourses, null, 2) + '\n',
  'utf8'
);
console.log(`✅ Synced worker/src/data/courses.json (${workerCourses.length} canonical courses)`);

// 2. Build cloudflare-worker/src/knowledge/knowledgeBase.js
const kbCourses = courses.map(c => ({
  id: c.id,
  name: c.name,
  academy: c.academy,
  programLevel: c.programLevel,
  duration: c.duration,
  guidedHours: c.guidedHours,
  fee: `₹${(c.price || 0).toLocaleString('en-IN')}`,
  originalFee: c.originalPrice > c.price ? `₹${c.originalPrice.toLocaleString('en-IN')}` : null,
  projects: NovaCourseData.getCourseProjectLabel(c),
  highlights: (c.tools && c.tools.length > 0) ? c.tools.slice(0, 5) : [c.programLevel, c.mode],
  targetAudience: c.eligibility || 'Beginners, Students & Working Professionals',
  url: `https://novaskills.in/course-detail.html?id=${c.id}`
}));

const kbObj = {
  instituteName: 'Nova Skills Academy',
  website: 'https://novaskills.in',
  contactNumber: '9695904440',
  approvedStartingPrice: 2900,
  totalCourses: courses.length,
  totalAcademies: academies.length,
  academies: academies.map(a => ({
    id: a.id,
    name: a.name,
    courseCount: NovaCourseData.getAcademyCourseCount(a.id),
    startingPrice: NovaCourseData.getAcademyStartingPrice(a.id)
  })),
  courses: kbCourses,
  policies: {
    admissionProcess: 'Online application -> Counselling call -> Token fee payment -> Enrollment confirmation & Batch allocation.',
    demoClass: 'Free 2-day live demo or trial session available on eligible Career & Professional programs.',
    installmentPlan: '2 or 3 easy monthly installment options available.',
    refundPolicy: 'Full refund available within first 3 days of class commencement.'
  }
};

const kbContent = `/**
 * Official Knowledge Base for Nova Skills AI Student Assistant
 * Auto-synced from canonical data/courses.json and data/academies.json (P0-1).
 */

export const KNOWLEDGE_BASE = ${JSON.stringify(kbObj, null, 2)};
`;

fs.writeFileSync(
  path.join(ROOT, 'cloudflare-worker', 'src', 'knowledge', 'knowledgeBase.js'),
  kbContent,
  'utf8'
);
console.log(`✅ Synced cloudflare-worker/src/knowledge/knowledgeBase.js (${kbCourses.length} canonical courses)`);
