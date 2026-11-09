/**
 * Nova Skills Course Content Resolver
 * Phase 02 — Central Course Content Resolution from Canonical Sources
 * 
 * Rules:
 * - Does NOT duplicate complete course records in location registries.
 * - Retrieves verified course information directly from data.js & master mapping.
 * - Enforces single source of truth for pricing, durations, and curriculum.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const DATA_JS_PATH = path.join(ROOT_DIR, 'data.js');
const MASTER_MAPPING_PATH = path.join(ROOT_DIR, 'scripts', 'Nova_Skills_109_Course_Master_Mapping.json');

let _coursesCache = null;
let _academiesCache = null;
let _masterMappingCache = null;

function loadCanonicalData() {
  if (!_coursesCache || !_academiesCache) {
    if (!fs.existsSync(DATA_JS_PATH)) {
      throw new Error(`Canonical data.js not found at: ${DATA_JS_PATH}`);
    }
    const dataJsCode = fs.readFileSync(DATA_JS_PATH, 'utf8');
    const sandbox = { module: { exports: {} } };
    vm.createContext(sandbox);
    vm.runInContext(dataJsCode, sandbox);

    if (sandbox.module.exports && sandbox.module.exports.NS_COURSES) {
      _coursesCache = sandbox.module.exports.NS_COURSES;
      _academiesCache = sandbox.module.exports.NS_ACADEMIES || [];
    } else if (sandbox.NS_COURSES) {
      _coursesCache = sandbox.NS_COURSES;
      _academiesCache = sandbox.NS_ACADEMIES || [];
    } else {
      throw new Error('Unable to extract NS_COURSES from data.js');
    }
  }

  if (!_masterMappingCache) {
    if (!fs.existsSync(MASTER_MAPPING_PATH)) {
      throw new Error(`Master mapping JSON not found at: ${MASTER_MAPPING_PATH}`);
    }
    const raw = fs.readFileSync(MASTER_MAPPING_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    _masterMappingCache = parsed.courses || [];
  }

  return {
    courses: _coursesCache,
    academies: _academiesCache,
    masterMapping: _masterMappingCache
  };
}

/**
 * Checks if a course is eligible for the Free 2-Day Demo.
 * Matches sitewide criteria: all professional, master, specialization, or career tracks >= ₹12,000.
 * @param {Object} course
 * @returns {boolean}
 */
function isCourseDemoEligible(course) {
  if (!course) return false;
  if (typeof course.demo_available === 'boolean') return course.demo_available;
  const type = (course.course_type || course.type || course.programLevel || '').toUpperCase();
  if (['MASTER', 'PROFESSIONAL', 'SPECIALIZATION', 'FOUNDATION', 'CAREER'].some(t => type.includes(t))) {
    return true;
  }
  const price = Math.max(
    typeof course.originalFee === 'number' ? course.originalFee : 0,
    typeof course.regular_price === 'number' ? course.regular_price : 0,
    typeof course.fee === 'number' ? course.fee : parseInt(String(course.fee || '').replace(/\D/g, ''), 10) || 0
  );
  if (price >= 12000) return true;
  return false;
}

/**
 * Extracts normalized pricing from canonical course record.
 * Preserves 109-course launch offer pricing approved on 2026-11-09.
 * @param {Object} course
 * @param {Object} [mappingEntry]
 * @returns {{ regularPrice: number, launchPrice: number, effectivePrice: number, offerActive: boolean, savingsAmount: number }}
 */
function getCoursePricing(course, mappingEntry) {
  const regular = mappingEntry?.regular_fee ??
    course.originalFee ??
    course.regular_price ??
    course.regularPrice ??
    course.fee ??
    0;

  const launch = mappingEntry?.launch_fee ??
    course.launch_price ??
    course.launch_fee ??
    course.launchBatchFee ??
    course.launchOffer?.launchFee ??
    regular;

  const offerActive = mappingEntry ? Boolean(mappingEntry.offer_active) :
    (Boolean(course.offer_active) || Boolean(course.launchOffer?.active));

  const effective = offerActive ? launch : regular;
  const savings = Math.max(0, regular - effective);

  return {
    regularPrice: regular,
    launchPrice: launch,
    effectivePrice: effective,
    offerActive: offerActive,
    savingsAmount: savings
  };
}

/**
 * Resolves canonical public URL for course.
 * @param {Object} course
 * @returns {string}
 */
function getCourseCanonicalUrl(course) {
  if (!course) return '/courses.html';
  if (course.seo?.canonical) return course.seo.canonical;
  if (course.canonical) return course.canonical;
  if (course.academy_slug && course.slug) {
    return `https://novaskills.in/academies/${course.academy_slug}/courses/${course.slug}/`;
  }
  return `https://novaskills.in/course-detail.html?id=${course.id}`;
}

/**
 * Finds academy name by ID or slug.
 * @param {string} academyId
 * @returns {string}
 */
function getAcademyName(academyId) {
  const { academies } = loadCanonicalData();
  const found = academies.find(a => a.id === academyId || a.slug === academyId);
  return found ? found.name : 'Nova Skills Academy';
}

/**
 * Resolves course by Master Course Number (1 to 109).
 * @param {number} masterNumber
 * @returns {Object|null}
 */
function resolveCourseByMasterNumber(masterNumber) {
  const { courses, masterMapping } = loadCanonicalData();
  const num = parseInt(masterNumber, 10);
  const mappingEntry = masterMapping.find(m => m.course_number === num);
  if (!mappingEntry) return null;

  const course = courses.find(c => c.id === mappingEntry.stable_id);
  if (!course) return null;

  return buildCourseView(course, mappingEntry);
}

/**
 * Resolves course by stable course ID.
 * @param {string} courseId
 * @returns {Object|null}
 */
function resolveCourseById(courseId) {
  if (!courseId) return null;
  const { courses, masterMapping } = loadCanonicalData();
  const normalized = String(courseId).trim().toLowerCase();
  const course = courses.find(c => c.id.toLowerCase() === normalized);
  if (!course) return null;

  const mappingEntry = masterMapping.find(m => m.stable_id.toLowerCase() === normalized);
  return buildCourseView(course, mappingEntry);
}

/**
 * Builds a standardized, read-only course view for location consumption.
 * @param {Object} course
 * @param {Object} [mappingEntry]
 * @returns {Object}
 */
function buildCourseView(course, mappingEntry) {
  const pricing = getCoursePricing(course, mappingEntry);
  const academyName = course.academy_name || getAcademyName(course.academy_id || course.academy);

  const modulesCount = Array.isArray(course.curriculum) ? course.curriculum.length :
    (Array.isArray(course.modules) ? course.modules.length : 0);

  const projectsCount = Array.isArray(course.projects) ? course.projects.length :
    (Array.isArray(course.liveProjects) ? course.liveProjects.length : (course.live_projects || 0));

  const tools = Array.isArray(course.tools) ? course.tools :
    (Array.isArray(course.softwareCovered) ? course.softwareCovered : []);

  return {
    id: course.id,
    masterNumber: mappingEntry ? mappingEntry.course_number : null,
    title: course.title || mappingEntry?.final_course_name || course.name,
    slug: course.slug || course.id,
    academyId: course.academy_id || course.academy || 'general',
    academyName: academyName,
    courseType: course.course_type || course.type || 'Professional Certification',
    level: course.level || course.programLevel || 'Beginner to Advanced',
    shortDescription: course.short_description || course.description || '',
    duration: course.duration || '3 Months',
    trainingHours: course.hours || course.guidedHours || course.trainingHours || '80+ Hours',
    pricing: pricing,
    modulesCount: modulesCount,
    projectsCount: projectsCount,
    softwareCovered: tools,
    thumbnail: course.thumbnail || course.image || `/assets/images/courses/${course.id}.jpg`,
    onlineAvailable: true,
    demoEligible: isCourseDemoEligible(course),
    canonicalUrl: getCourseCanonicalUrl(course)
  };
}

/**
 * Resolves all assigned courses (core + additional) for a given location.
 * @param {Object|string} locationOrSlug
 * @returns {{ coreCourses: Array<Object>, additionalCourses: Array<Object>, allCourses: Array<Object> }}
 */
function resolveCoursesForLocation(locationOrSlug) {
  const { getLocationById, getLocationBySlug } = require('./location-registry');
  const loc = typeof locationOrSlug === 'object' ? locationOrSlug :
    (getLocationById(locationOrSlug) || getLocationBySlug(locationOrSlug));

  if (!loc) {
    throw new Error(`Location not found: ${locationOrSlug}`);
  }

  const coreCourses = (loc.coreCourseNumbers || []).map(num => {
    const resolved = resolveCourseByMasterNumber(num);
    if (!resolved) {
      throw new Error(`Failed to resolve compulsory core course #${num} for ${loc.city}`);
    }
    return { ...resolved, role: 'compulsory_core' };
  });

  const additionalCourses = (loc.additionalCourseNumbers || []).map(num => {
    const resolved = resolveCourseByMasterNumber(num);
    if (!resolved) {
      throw new Error(`Failed to resolve additional course #${num} for ${loc.city}`);
    }
    return { ...resolved, role: 'recommended_additional' };
  });

  return {
    locationId: loc.id,
    city: loc.city,
    slug: loc.slug,
    coreCourses,
    additionalCourses,
    allCourses: [...coreCourses, ...additionalCourses]
  };
}

module.exports = {
  loadCanonicalData,
  isCourseDemoEligible,
  getCoursePricing,
  getCourseCanonicalUrl,
  resolveCourseByMasterNumber,
  resolveCourseById,
  resolveCoursesForLocation
};
