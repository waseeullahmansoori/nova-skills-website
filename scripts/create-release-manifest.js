/**
 * Nova Skills Phase 09 Release Manifest Generator
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { getAllLocations } = require('../lib/locations');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARTIFACT_DIR = path.resolve('C:\\Users\\wasee\\.gemini\\antigravity\\brain\\62f07cac-577a-4acd-8fa0-e365dd662777');
const locations = getAllLocations();

const cityUrls = locations.map(l => 'https://novaskills.in/branches/' + l.slug + '/');
const cityRoutes = locations.map(l => '/branches/' + l.slug + '/');

const manifest = {
  releaseId: 'nova-36-locations-production-v1.0.0',
  timestamp: new Date().toISOString(),
  environment: 'production',
  productionDomain: 'https://novaskills.in',
  git: {
    productionBaseCommit: 'da1b66a',
    releaseCandidateCommit: '016dfb6',
    targetBranch: 'main',
    releaseBranch: 'release/nova-36-locations-phase09'
  },
  scope: {
    directoryRoute: '/branches/',
    totalCityRoutes: locations.length,
    totalPlannedPages: 37,
    approvedPublicPages: 37,
    approvedIndexablePages: 37,
    noindexPages: [],
    withheldPages: []
  },
  geographicIntegrity: {
    totalLocations: 36,
    totalStatesAndUTs: 14,
    deliveryMode: 'live_interactive_online',
    solePhysicalCampus: 'Siddharth Nagar, Uttar Pradesh',
    fictionalBranchesCount: 0
  },
  courseIntegrity: {
    compulsoryCoreReferences: 144,
    additionalReferences: 92,
    totalCourseAssociations: 236,
    canonicalCatalogueCourses: 109,
    canonicalAcademies: 12
  },
  leadWorkflows: [
    { name: 'Free Demo', leadType: 'free_demo', formId: 'demo-booking-form', modalId: 'demo-booking-modal' },
    { name: 'Free Consultation', leadType: 'free_consultation', formId: 'popup-form', modalId: 'popup-overlay' },
    { name: 'Course Enrollment', leadType: 'enrollment_enquiry', formId: 'course-enrollment-form', modalId: 'course-enrollment-modal' }
  ],
  analytics: {
    measurementId: 'G-9WN9N2KF12',
    dispatcher: 'window.sendGA4Event',
    piiLeakage: false,
    idempotentLeadConversions: true
  },
  routes: {
    directory: 'https://novaskills.in/branches/',
    cities: cityUrls
  },
  rollbackTarget: {
    commit: 'da1b66a',
    deploymentRollbackReady: true
  },
  approvalReference: 'nova-phase08-phase09-go-no-go.md'
};

fs.writeFileSync(path.join(ARTIFACT_DIR, 'nova-phase09-production-release-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, 'nova-phase09-production-release-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log('✓ Successfully created nova-phase09-production-release-manifest.json in artifact dir and workspace');
