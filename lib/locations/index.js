/**
 * Nova Skills Nationwide Locations Library
 * Phase 02 — Central Module Entry Point
 */

'use strict';

const registry = require('./location-registry');
const courseResolver = require('./location-course-resolver');
const routeResolver = require('./location-route-resolver');
const seoContract = require('./location-seo-contract');
const ctaContract = require('./location-cta-contract');

module.exports = {
  ...registry,
  ...courseResolver,
  ...routeResolver,
  ...seoContract,
  ...ctaContract
};
