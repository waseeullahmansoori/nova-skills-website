/**
 * Nova Skills Location SEO Contract & Structured Data Generator
 * Phase 02 — Search Engine Optimization, Schema & Indexability Controls
 * 
 * Rules:
 * - Zero fabricated physical branch addresses or fake LocalBusiness schema.
 * - Uses valid BreadcrumbList and ItemList (Course) JSON-LD.
 * - Enforces explicit indexing gates (noindex for pending_review).
 */

'use strict';

const BASE_DOMAIN = 'https://novaskills.in';

/**
 * Builds the SEO metadata specification for a city location.
 * @param {Object} location
 * @param {Array<Object>} resolvedCourses
 * @returns {Object}
 */
function buildCitySeoMetadata(location, resolvedCourses) {
  const city = location.city;
  const state = location.state;
  const canonicalUrl = `${BASE_DOMAIN}${location.route}`;

  const title = `Professional Courses & Tech Training in ${city} | Live Interactive Online — Nova Skills`;
  const description = `Accelerate your career in ${city} with Nova Skills. Industry-led live online certification courses in Digital Marketing, Graphic Design, Video Editing & AI. 2-Day Free Demo available.`;
  const h1 = `Industry-Led Professional Courses for Learners in ${city}`;

  const robots = location.indexingStatus === 'indexable'
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, follow';

  return {
    title,
    description,
    canonicalUrl,
    h1,
    cityEntity: {
      name: city,
      state: state,
      stateCode: location.stateCode,
      country: 'India',
      serviceType: 'Live Interactive Online Learning Location'
    },
    robots,
    publicationStatus: location.publicationStatus,
    indexingStatus: location.indexingStatus,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      image: `${BASE_DOMAIN}/assets/images/og-nova-skills-learning-locations.jpg`,
      siteName: 'Nova Skills Academy'
    },
    twitterCard: {
      card: 'summary_large_image',
      title,
      description,
      image: `${BASE_DOMAIN}/assets/images/og-nova-skills-learning-locations.jpg`
    },
    structuredData: {
      breadcrumbList: buildBreadcrumbSchema(location),
      itemListCourses: buildCourseItemListSchema(location, resolvedCourses)
    }
  };
}

/**
 * Generates JSON-LD BreadcrumbList schema.
 * @param {Object} location
 * @returns {Object}
 */
function buildBreadcrumbSchema(location) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_DOMAIN
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Learning Locations',
        item: `${BASE_DOMAIN}/branches/`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${location.city}`,
        item: `${BASE_DOMAIN}${location.route}`
      }
    ]
  };
}

/**
 * Generates JSON-LD ItemList with nested Course schemas.
 * @param {Object} location
 * @param {Array<Object>} resolvedCourses
 * @returns {Object}
 */
function buildCourseItemListSchema(location, resolvedCourses) {
  const items = (resolvedCourses || []).map((course, index) => {
    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: course.title,
        description: course.shortDescription || `Professional live interactive training in ${course.title}.`,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Nova Skills Academy',
          sameAs: BASE_DOMAIN
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: course.duration,
          instructor: {
            '@type': 'Person',
            name: 'Nova Skills Industry Practitioner Mentors'
          }
        },
        offers: {
          '@type': 'Offer',
          category: 'TuitionFee',
          price: course.pricing.effectivePrice,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          validFrom: '2026-11-09'
        }
      }
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Featured Professional Certification Courses in ${location.city}`,
    numberOfItems: items.length,
    itemListElement: items
  };
}

module.exports = {
  buildCitySeoMetadata,
  buildBreadcrumbSchema,
  buildCourseItemListSchema
};
