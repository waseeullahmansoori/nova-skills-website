/**
 * Nova Skills Location Route Resolver
 * Phase 02 — URL Path Normalization, Cloudflare Pages Routing & Publication Controls
 */

'use strict';

const { getAllLocations, getLocationBySlug } = require('./location-registry');

const BASE_DOMAIN = 'https://novaskills.in';
const DIRECTORY_PATH = '/branches/';

/**
 * Normalizes any route path to a deterministic canonical path.
 * Ensures leading slash, trailing slash, lower-case, and no duplicate slashes.
 * @param {string} pathname
 * @returns {string}
 */
function normalizeRoutePath(pathname) {
  if (!pathname) return DIRECTORY_PATH;
  let clean = String(pathname).trim().toLowerCase();
  clean = clean.replace(/\/+/g, '/');
  if (!clean.startsWith('/')) clean = '/' + clean;
  if (!clean.endsWith('/')) clean = clean + '/';
  return clean;
}

/**
 * Returns all 37 planned routes for the nationwide locations project:
 * - 1 Central Directory Route (/branches/)
 * - 36 City Location Routes (/branches/{slug}/)
 * @returns {Array<string>}
 */
function getAllRoutes() {
  const cityRoutes = getAllLocations().map(loc => loc.route);
  return [DIRECTORY_PATH, ...cityRoutes];
}

/**
 * Generates the Cloudflare Pages filesystem route mapping.
 * Cloudflare Pages serves /branches/ from /branches/index.html
 * and /branches/{slug}/ from /branches/{slug}/index.html.
 * @returns {Array<{ route: string, fsPath: string, canonicalUrl: string, type: string, publishable: boolean }>}
 */
function getCloudflareRouteManifest() {
  const manifest = [
    {
      route: DIRECTORY_PATH,
      fsPath: 'branches/index.html',
      canonicalUrl: `${BASE_DOMAIN}${DIRECTORY_PATH}`,
      type: 'directory',
      publishable: false // Gated until Phase 03 approval
    }
  ];

  getAllLocations().forEach(loc => {
    manifest.push({
      route: loc.route,
      fsPath: `branches/${loc.slug}/index.html`,
      canonicalUrl: `${BASE_DOMAIN}${loc.route}`,
      type: 'city',
      slug: loc.slug,
      city: loc.city,
      priority: loc.priority,
      publishable: loc.publicationStatus === 'published' // Phase 02: all 'draft'
    });
  });

  return manifest;
}

/**
 * Resolves an incoming pathname to its location entity or 404.
 * Prevents unintended redirects to homepage.
 * @param {string} pathname
 * @returns {{ matched: boolean, statusCode: number, type: 'directory'|'city'|'unknown', location: Object|null, canonicalUrl: string|null }}
 */
function resolveRoute(pathname) {
  const normalized = normalizeRoutePath(pathname);

  if (normalized === DIRECTORY_PATH) {
    return {
      matched: true,
      statusCode: 200,
      type: 'directory',
      location: null,
      canonicalUrl: `${BASE_DOMAIN}${DIRECTORY_PATH}`
    };
  }

  const cityMatch = normalized.match(/^\/branches\/([a-z0-9-]+)\/$/);
  if (cityMatch) {
    const slug = cityMatch[1];
    const location = getLocationBySlug(slug);
    if (location) {
      return {
        matched: true,
        statusCode: 200,
        type: 'city',
        slug: slug,
        location: location,
        canonicalUrl: `${BASE_DOMAIN}${location.route}`
      };
    }
  }

  // Explicit 404 for unknown branches paths — Never fallback to homepage
  return {
    matched: false,
    statusCode: 404,
    type: 'unknown',
    location: null,
    canonicalUrl: null
  };
}

/**
 * Checks whether a given city route is approved for live public output.
 * Safeguards that no unfinished placeholder page is rendered.
 * @param {string} slug
 * @returns {boolean}
 */
function isRoutePublishable(slug) {
  const loc = getLocationBySlug(slug);
  return loc ? loc.publicationStatus === 'published' : false;
}

/**
 * Checks whether a given city route is eligible for search engine indexing.
 * @param {string} slug
 * @returns {boolean}
 */
function isRouteIndexable(slug) {
  const loc = getLocationBySlug(slug);
  return loc ? loc.indexingStatus === 'indexable' : false;
}

module.exports = {
  BASE_DOMAIN,
  DIRECTORY_PATH,
  normalizeRoutePath,
  getAllRoutes,
  getCloudflareRouteManifest,
  resolveRoute,
  isRoutePublishable,
  isRouteIndexable
};
