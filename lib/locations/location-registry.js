/**
 * Nova Skills Nationwide Learning Locations Registry
 * Phase 02 — Data Foundation & Location Accessors
 */

'use strict';

const fs = require('fs');
const path = require('path');

const LOCATIONS_DATA_PATH = path.resolve(__dirname, '..', '..', 'data', 'locations', 'locations.json');

let _locationsCache = null;

function loadLocations() {
  if (!_locationsCache) {
    if (!fs.existsSync(LOCATIONS_DATA_PATH)) {
      throw new Error(`Locations data file not found at: ${LOCATIONS_DATA_PATH}`);
    }
    const raw = fs.readFileSync(LOCATIONS_DATA_PATH, 'utf8');
    _locationsCache = JSON.parse(raw);
  }
  return _locationsCache;
}

/**
 * Returns all 36 approved learning location records.
 * @returns {Array<Object>}
 */
function getAllLocations() {
  return loadLocations();
}

/**
 * Finds location by stable internal ID (e.g. 'loc-001').
 * @param {string} id
 * @returns {Object|null}
 */
function getLocationById(id) {
  if (!id) return null;
  const normalized = String(id).toLowerCase().trim();
  return getAllLocations().find(loc => loc.id.toLowerCase() === normalized) || null;
}

/**
 * Finds location by URL slug (e.g. 'indore', 'lucknow', 'chhatrapati-sambhajinagar').
 * @param {string} slug
 * @returns {Object|null}
 */
function getLocationBySlug(slug) {
  if (!slug) return null;
  const normalized = String(slug).toLowerCase().trim();
  return getAllLocations().find(loc => loc.slug.toLowerCase() === normalized) || null;
}

/**
 * Retrieves all locations in a given State/UT.
 * @param {string} stateName
 * @returns {Array<Object>}
 */
function getLocationsByState(stateName) {
  if (!stateName) return [];
  const normalized = String(stateName).toLowerCase().trim();
  return getAllLocations().filter(loc => loc.state.toLowerCase() === normalized);
}

/**
 * Retrieves locations by internal marketing priority ('P1', 'P2', 'P3').
 * @param {string} priority
 * @returns {Array<Object>}
 */
function getLocationsByPriority(priority) {
  if (!priority) return [];
  const normalized = String(priority).toUpperCase().trim();
  return getAllLocations().filter(loc => loc.priority === normalized);
}

/**
 * Retrieves locations by publication status ('draft', 'content_review', 'ready_for_qa', 'approved', 'published').
 * @param {string} status
 * @returns {Array<Object>}
 */
function getLocationsByPublicationStatus(status) {
  if (!status) return [];
  const normalized = String(status).toLowerCase().trim();
  return getAllLocations().filter(loc => loc.publicationStatus.toLowerCase() === normalized);
}

/**
 * Returns an aggregated summary of all 14 represented States/UTs.
 * @returns {Array<{ state: string, stateCode: string, count: number, cities: string[] }>}
 */
function getStatesSummary() {
  const map = new Map();
  getAllLocations().forEach(loc => {
    if (!map.has(loc.state)) {
      map.set(loc.state, {
        state: loc.state,
        stateCode: loc.stateCode,
        count: 0,
        cities: []
      });
    }
    const item = map.get(loc.state);
    item.count++;
    item.cities.push(loc.city);
  });
  return Array.from(map.values()).sort((a, b) => a.state.localeCompare(b.state));
}

/**
 * Checks physical campus status for any city.
 * Always returns false for all 36 learning locations (strictly online service areas).
 * @param {string} idOrSlug
 * @returns {boolean}
 */
function isPhysicalCampus(idOrSlug) {
  const loc = getLocationById(idOrSlug) || getLocationBySlug(idOrSlug);
  return loc ? Boolean(loc.physicalCampus) : false;
}

module.exports = {
  loadLocations,
  getAllLocations,
  getLocationById,
  getLocationBySlug,
  getLocationsByState,
  getLocationsByPriority,
  getLocationsByPublicationStatus,
  getStatesSummary,
  isPhysicalCampus
};
