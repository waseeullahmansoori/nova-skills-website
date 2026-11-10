/**
 * Nova Skills Nationwide Learning Locations Directory Page Builder
 * Phase 03 — Production-Grade Static Pre-renderer for /branches/
 * 
 * Rules:
 * - Consumes Phase 02 shared registry (data/locations/locations.json)
 * - Pre-renders all 36 city cards and 14 state options into semantic HTML
 * - Respects publicationStatus: 'draft' (zero links to 404s)
 * - Injects shared site shell (#ns-header, #ns-footer)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const {
  getAllLocations,
  getStatesSummary,
  resolveCoursesForLocation,
  resolveCourseByMasterNumber
} = require('../lib/locations');

const OUTPUT_PATH = path.resolve(__dirname, '..', 'branches', 'index.html');

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildDirectoryHtml() {
  const locations = getAllLocations();
  const statesSummary = getStatesSummary();

  // Core 4 courses data
  const coreCourses = [
    resolveCourseByMasterNumber(2),
    resolveCourseByMasterNumber(9),
    resolveCourseByMasterNumber(17),
    resolveCourseByMasterNumber(7)
  ];

  // 1. Generate State Options
  const stateOptionsHtml = statesSummary.map(s => {
    return `<option value="${escapeHtml(s.state.toLowerCase())}">${escapeHtml(s.state)} (${s.count} ${s.count === 1 ? 'City' : 'Cities'})</option>`;
  }).join('\n                ');

  // 2. Generate 36 City Cards
  const cityCardsHtml = locations.map(loc => {
    const courseRes = resolveCoursesForLocation(loc.slug);
    const additionalTitles = courseRes.additionalCourses.map(c => c.title).slice(0, 3);
    const keywords = [loc.city, loc.state, loc.stateCode, ...additionalTitles].join(' ').toLowerCase();

    // Publication check (Gate 05 & Gate 19): Link verified preview/published city pages to /branches/{slug}/
    const isPublished = loc.publicationStatus === 'published' || loc.publicationStatus === 'preview_ready';
    const exploreHref = isPublished ? `/branches/${loc.slug}/` : '/courses.html';
    const exploreLabel = isPublished ? 'View City Page →' : 'Explore Courses';

    const additionalTagsHtml = additionalTitles.map(t => {
      return `<span class="loc-pathway-tag">${escapeHtml(t)}</span>`;
    }).join('\n                    ');

    return `
          <!-- City Card: ${escapeHtml(loc.city)} -->
          <article class="loc-city-card" data-city="${escapeHtml(loc.city.toLowerCase())}" data-state="${escapeHtml(loc.state.toLowerCase())}" data-slug="${escapeHtml(loc.slug)}" data-keywords="${escapeHtml(keywords)}">
            <header class="loc-city-card-header">
              <div class="loc-city-title-group">
                <h3 class="loc-city-name">${escapeHtml(loc.city)}</h3>
                <span class="loc-city-state">${escapeHtml(loc.state)}</span>
              </div>
              <span class="loc-city-mode-badge" title="Live Interactive Online Training">💻 Live Online</span>
            </header>

            <div class="loc-city-divider"></div>

            <div class="loc-city-courses-block">
              <div class="loc-courses-label">Core Professional Programs</div>
              <div class="loc-core-programs-list">
                Digital Marketing • Graphic Design • Video Editing • AI &amp; Automation
              </div>

              <div class="loc-courses-label" style="margin-top: 10px;">Recommended Pathways</div>
              <div class="loc-additional-pathways-wrap">
                ${additionalTagsHtml}
              </div>
            </div>

            <div class="loc-city-card-actions">
              <a href="${exploreHref}" class="loc-card-btn-explore" aria-label="Explore courses for ${escapeHtml(loc.city)}">${exploreLabel}</a>
              <button type="button" class="loc-card-btn-demo" onclick="window.openLocationDemo('${escapeHtml(loc.slug)}', '${escapeHtml(loc.city)}')" aria-label="Book Free Demo for ${escapeHtml(loc.city)}">Free Demo</button>
            </div>
          </article>`;
  }).join('\n');

  // 3. Schema JSON-LD
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://novaskills.in/branches/#webpage",
        "url": "https://novaskills.in/branches/",
        "name": "Branches & Online Learning Locations Across India | Nova Skills",
        "description": "Explore Nova Skills live online professional courses across 36 Indian cities. Find your location, compare learning paths and request a 2-Day Free Demo.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://novaskills.in/#website",
          "name": "Nova Skills",
          "url": "https://novaskills.in/"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://novaskills.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Branches & Learning Locations",
            "item": "https://novaskills.in/branches/"
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Nova Skills 36 Nationwide Online Learning Locations",
        "numberOfItems": 36,
        "itemListElement": locations.map((loc, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": `${loc.city}, ${loc.state}`,
          "description": `Live interactive online certification training for students in ${loc.city}, ${loc.state}.`
        }))
      }
    ]
  };

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-9WN9N2KF12"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9WN9N2KF12');
  </script>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Branches &amp; Online Learning Locations Across India | Nova Skills</title>
  <meta name="description" content="Explore Nova Skills live online professional courses across 36 Indian cities. Find your location, compare learning paths and request a 2-Day Free Demo." />
  <meta name="keywords" content="Nova Skills branches, Nova Skills locations, live online classes India, digital marketing course, graphic design course, video editing course, AI training India" />
  <link rel="canonical" href="https://novaskills.in/branches/" />
  
  <!-- Indexing Guard: Previews gated until Phase 09 release signoff -->
  <meta name="robots" content="index, follow" />

  <!-- OpenGraph Metadata -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Nova Skills" />
  <meta property="og:url" content="https://novaskills.in/branches/" />
  <meta property="og:title" content="Branches &amp; Online Learning Locations Across India | Nova Skills" />
  <meta property="og:description" content="Explore Nova Skills live online professional courses across 36 Indian cities. Find your location, compare learning paths and request a 2-Day Free Demo." />
  <meta property="og:image" content="https://novaskills.in/public/images/seo/og-banner.png?v=2026" />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@novaskills_in" />
  <meta name="twitter:title" content="Branches &amp; Online Learning Locations Across India | Nova Skills" />
  <meta name="twitter:description" content="Explore Nova Skills live online professional courses across 36 Indian cities. Find your location, compare learning paths and request a 2-Day Free Demo." />
  <meta name="twitter:image" content="https://novaskills.in/public/images/seo/og-banner.png?v=2026" />

  <!-- Favicon & Fonts Preload -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="preload" href="/public/fonts/PlusJakartaSans-700.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/public/fonts/Inter-400.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Base Site Styles & Scoped Directory Styles -->
  <link rel="stylesheet" href="/css/styles.min.css?v=2.7.4" />
  <link rel="stylesheet" href="/css/locations-directory.css" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(schemaJsonLd, null, 2)}
  </script>
</head>
<body class="locations-directory-page">

  <!-- Injected Header Shell -->
  <div id="ns-header"></div>

  <main id="main-content" class="loc-directory-main">

    <!-- ============================================================
         SECTION 01: PREMIUM EDITORIAL HERO
         ============================================================ -->
    <section class="loc-hero-section" id="hero" aria-labelledby="hero-title">
      <div class="loc-container">
        <div class="loc-hero-content">
          <div class="loc-hero-eyebrow">
            <span>🌐</span> NOVA SKILLS • PAN-INDIA ONLINE LEARNING
          </div>
          <h1 class="loc-hero-title" id="hero-title">
            Your Next Skill <span class="loc-hero-title-accent">Has No City Limits.</span>
          </h1>
          <p class="loc-hero-subtitle">
            Discover professional courses and live interactive online learning opportunities across 36 selected Indian cities. Practical skills, direct mentor reviews, and career-first portfolios.
          </p>

          <div class="loc-hero-metrics" aria-label="Nationwide Coverage Overview">
            <div class="loc-metric-pill">
              <strong>36</strong> Selected Cities
            </div>
            <div class="loc-metric-pill">
              <strong>14</strong> States &amp; UTs
            </div>
            <div class="loc-metric-pill">
              <strong>12</strong> Professional Academies
            </div>
          </div>

          <div class="loc-hero-ctas">
            <a href="#city-explorer" class="loc-btn loc-btn-primary" id="hero-find-city-btn">
              <span>🔍</span> Find Your City
            </a>
            <a href="#core-pathways" class="loc-btn loc-btn-secondary">
              <span>🎓</span> Explore Professional Courses
            </a>
          </div>

          <div>
            <div class="loc-hero-trust-strip">
              <span>📍 Physical Classroom Campus in Siddharth Nagar (UP)</span>
              <span>•</span>
              <span>💻 Live Interactive Online Classes (Pan-India)</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 02 & 03: INTELLIGENT CITY EXPLORER & 36 CITY CARDS
         ============================================================ -->
    <section class="loc-explorer-section" id="city-explorer" aria-labelledby="explorer-heading">
      <div class="loc-container">
        
        <header class="loc-section-header">
          <span class="loc-section-tag">Interactive Directory</span>
          <h2 class="loc-section-title" id="explorer-heading">Find Your Learning Location</h2>
          <p class="loc-section-subtitle">
            Search your city or explore live online learning locations by state. Live two-way classes, dedicated mentorship, and real capstones.
          </p>
        </header>

        <!-- Filter Card Controls -->
        <div class="loc-filter-card" role="search" aria-label="City search and state filters">
          <div class="loc-filter-controls-row">
            
            <!-- Search Input -->
            <div class="loc-search-box">
              <span class="loc-search-icon" aria-hidden="true">🔍</span>
              <input 
                type="text" 
                id="city-search-input" 
                class="loc-search-input" 
                placeholder="Search by city (e.g. Indore, Jaipur, Lucknow, Patna)..." 
                aria-label="Search learning locations by city or state"
                autocomplete="off"
              />
              <button type="button" id="search-clear-btn" class="loc-search-clear-btn" aria-label="Clear search input">×</button>
            </div>

            <!-- State Dropdown Filter -->
            <div class="loc-select-box">
              <select id="state-filter-select" class="loc-select-input" aria-label="Filter locations by State or Union Territory">
                <option value="all">All States &amp; UTs (36 Cities)</option>
                ${stateOptionsHtml}
              </select>
            </div>

            <!-- Reset Action -->
            <button type="button" id="reset-filters-btn" class="loc-reset-filter-btn">
              Reset Filters
            </button>
          </div>

          <!-- Filter Live Status Row -->
          <div class="loc-filter-status-row">
            <span class="loc-result-badge">
              Showing <strong id="cities-count">${locations.length}</strong> of ${locations.length} Learning Locations
            </span>
            <span id="filter-live-announcer" class="sr-only" aria-live="polite">Showing all 36 learning locations.</span>
            <span>Delivery Format: <strong>Live Interactive Online</strong></span>
          </div>
        </div>

        <!-- 36 City Cards Grid -->
        <div class="loc-cities-grid" id="cities-grid">
          ${cityCardsHtml}
        </div>

        <!-- Empty State Message -->
        <div class="loc-empty-state" id="empty-state" role="alert">
          <div class="loc-empty-icon" aria-hidden="true">📍</div>
          <h3 class="loc-empty-title">No matching location found</h3>
          <p class="loc-empty-desc">
            We couldn't find a learning location matching your query. Try searching another city or clear your filters to view all 36 locations.
          </p>
          <button type="button" id="reset-empty-btn" class="loc-btn loc-btn-primary">
            Clear Filters &amp; View All Locations
          </button>
        </div>

      </div>
    </section>

    <!-- ============================================================
         SECTION 06: FOUR CORE PROFESSIONAL LEARNING PATHWAYS
         ============================================================ -->
    <section class="loc-pathways-section" id="core-pathways" aria-labelledby="pathways-heading">
      <div class="loc-container">
        
        <header class="loc-section-header">
          <span class="loc-section-tag">Flagship Curriculum</span>
          <h2 class="loc-section-title" id="pathways-heading">Four Skills. Multiple Career Directions.</h2>
          <p class="loc-section-subtitle">
            The four compulsory professional programs available to learners across all 36 cities via live interactive online batches.
          </p>
        </header>

        <div class="loc-pathways-grid">
          
          <!-- Core 1: Digital Marketing -->
          <article class="loc-pathway-card">
            <div class="loc-pathway-preview-wrap">
              <picture>
                <source type="image/png" srcset="/images/projects/dm-professional/ns-proj-dm-analytics-dashboard-mobile-400w.png 400w, /images/projects/dm-professional/ns-proj-dm-analytics-dashboard-card-640w.png 640w" sizes="(max-width: 640px) 100vw, 360px" />
                <img src="/images/projects/dm-professional/ns-proj-dm-analytics-dashboard-card-640w.png" alt="Live GA4 &amp; Multichannel Marketing Analytics Capstone" width="360" height="202" class="loc-pathway-preview-img" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div class="loc-pathway-badge-row">
              <div class="loc-pathway-icon-wrap" aria-hidden="true">📊</div>
              <span class="loc-pathway-role-badge">Core Program 01</span>
            </div>
            <h3 class="loc-pathway-title">${escapeHtml(coreCourses[0].title)}</h3>
            <p class="loc-pathway-desc">
              Master SEO, Generative AI Search (GEO), Google Ads, Meta Ads Manager, GA4 Analytics, and multi-channel campaign architectures.
            </p>
            <div class="loc-pathway-specs">
              <span>⏱ ${escapeHtml(coreCourses[0].duration)}</span>
              <span>•</span>
              <span>📂 ${coreCourses[0].modulesCount} Modules</span>
              <span>•</span>
              <span>🚀 ${coreCourses[0].projectsCount} Live Projects</span>
            </div>
            <div class="loc-pathway-fee-row">
              <span class="loc-pathway-fee-label">Launch Batch Fee:</span>
              <span class="loc-pathway-fee-val">₹${coreCourses[0].pricing.launchPrice.toLocaleString('en-IN')}</span>
            </div>
            <a href="${coreCourses[0].canonicalUrl}" class="loc-pathway-link-btn">
              View Complete Syllabus →
            </a>
          </article>

          <!-- Core 2: Graphic Design -->
          <article class="loc-pathway-card">
            <div class="loc-pathway-preview-wrap">
              <picture>
                <source type="image/png" srcset="/images/projects/graphic-design-pro/ns-proj-gd-brand-identity-mobile-400w.png 400w, /images/projects/graphic-design-pro/ns-proj-gd-brand-identity-card-640w.png 640w" sizes="(max-width: 640px) 100vw, 360px" />
                <img src="/images/projects/graphic-design-pro/ns-proj-gd-brand-identity-card-640w.png" alt="Commercial Vector Brand Identity System and Stationery Capstone" width="360" height="202" class="loc-pathway-preview-img" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div class="loc-pathway-badge-row">
              <div class="loc-pathway-icon-wrap" aria-hidden="true">🎨</div>
              <span class="loc-pathway-role-badge">Core Program 02</span>
            </div>
            <h3 class="loc-pathway-title">${escapeHtml(coreCourses[1].title)}</h3>
            <p class="loc-pathway-desc">
              Develop high-impact brand identities, packaging, advertising visuals, and commercial graphic assets using Photoshop, Illustrator, and Midjourney.
            </p>
            <div class="loc-pathway-specs">
              <span>⏱ ${escapeHtml(coreCourses[1].duration)}</span>
              <span>•</span>
              <span>📂 ${coreCourses[1].modulesCount} Modules</span>
              <span>•</span>
              <span>🚀 ${coreCourses[1].projectsCount} Live Projects</span>
            </div>
            <div class="loc-pathway-fee-row">
              <span class="loc-pathway-fee-label">Launch Batch Fee:</span>
              <span class="loc-pathway-fee-val">₹${coreCourses[1].pricing.launchPrice.toLocaleString('en-IN')}</span>
            </div>
            <a href="${coreCourses[1].canonicalUrl}" class="loc-pathway-link-btn">
              View Complete Syllabus →
            </a>
          </article>

          <!-- Core 3: Video Editing -->
          <article class="loc-pathway-card">
            <div class="loc-pathway-preview-wrap">
              <picture>
                <source type="image/png" srcset="/images/academies/creator/ns-academy-creator-hero-mobile-400w.png 400w, /images/academies/creator/ns-academy-creator-hero-tablet-600w.png 600w" sizes="(max-width: 640px) 100vw, 360px" />
                <img src="/images/academies/creator/ns-academy-creator-hero-tablet-600w.png" alt="Professional 4K Video Editing and Motion Timeline Production" width="360" height="202" class="loc-pathway-preview-img" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div class="loc-pathway-badge-row">
              <div class="loc-pathway-icon-wrap" aria-hidden="true">🎬</div>
              <span class="loc-pathway-role-badge">Core Program 03</span>
            </div>
            <h3 class="loc-pathway-title">${escapeHtml(coreCourses[2].title)}</h3>
            <p class="loc-pathway-desc">
              Learn cinematic video editing, storytelling pacing, motion graphics, color grading, and sound engineering in Premiere Pro and After Effects.
            </p>
            <div class="loc-pathway-specs">
              <span>⏱ ${escapeHtml(coreCourses[2].duration)}</span>
              <span>•</span>
              <span>📂 ${coreCourses[2].modulesCount} Modules</span>
              <span>•</span>
              <span>🚀 ${coreCourses[2].projectsCount} Live Projects</span>
            </div>
            <div class="loc-pathway-fee-row">
              <span class="loc-pathway-fee-label">Launch Batch Fee:</span>
              <span class="loc-pathway-fee-val">₹${coreCourses[2].pricing.launchPrice.toLocaleString('en-IN')}</span>
            </div>
            <a href="${coreCourses[2].canonicalUrl}" class="loc-pathway-link-btn">
              View Complete Syllabus →
            </a>
          </article>

          <!-- Core 4: AI for Business -->
          <article class="loc-pathway-card">
            <div class="loc-pathway-preview-wrap">
              <picture>
                <source type="image/png" srcset="/images/projects/fullstack-foundation/ns-proj-fs-saas-capstone-mobile-400w.png 400w, /images/projects/fullstack-foundation/ns-proj-fs-saas-capstone-card-640w.png 640w" sizes="(max-width: 640px) 100vw, 360px" />
                <img src="/images/projects/fullstack-foundation/ns-proj-fs-saas-capstone-card-640w.png" alt="Autonomous Enterprise Workflows &amp; AI Intelligence Platform" width="360" height="202" class="loc-pathway-preview-img" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div class="loc-pathway-badge-row">
              <div class="loc-pathway-icon-wrap" aria-hidden="true">🤖</div>
              <span class="loc-pathway-role-badge">Core Program 04</span>
            </div>
            <h3 class="loc-pathway-title">${escapeHtml(coreCourses[3].title)}</h3>
            <p class="loc-pathway-desc">
              Automate enterprise workflows, deploy autonomous AI agents, and engineer business pipelines using GPT-4o, Claude 3.5, n8n, and Make.
            </p>
            <div class="loc-pathway-specs">
              <span>⏱ ${escapeHtml(coreCourses[3].duration)}</span>
              <span>•</span>
              <span>📂 ${coreCourses[3].modulesCount} Modules</span>
              <span>•</span>
              <span>🚀 ${coreCourses[3].projectsCount} Live Projects</span>
            </div>
            <div class="loc-pathway-fee-row">
              <span class="loc-pathway-fee-label">Launch Batch Fee:</span>
              <span class="loc-pathway-fee-val">₹${coreCourses[3].pricing.launchPrice.toLocaleString('en-IN')}</span>
            </div>
            <a href="${coreCourses[3].canonicalUrl}" class="loc-pathway-link-btn">
              View Complete Syllabus →
            </a>
          </article>

        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 07: LEARNING PATH DISCOVERY
         ============================================================ -->
    <section class="loc-discovery-section" id="career-discovery" aria-labelledby="discovery-heading">
      <div class="loc-container">
        
        <header class="loc-section-header">
          <span class="loc-section-tag">Career Guidance</span>
          <h2 class="loc-section-title" id="discovery-heading">Find the Skills That Fit Your Goals</h2>
          <p class="loc-section-subtitle">
            Explore structured learning tracks tailored for career starters, freelancing professionals, and business owners.
          </p>
        </header>

        <div class="loc-discovery-grid">
          
          <!-- Track 1: Creative & Visual Arts -->
          <div class="loc-discovery-card">
            <div class="loc-discovery-card-thumb">
              <picture>
                <source type="image/png" srcset="/images/academies/design/ns-academy-design-hero-mobile-400w.png 400w, /images/academies/design/ns-academy-design-hero-tablet-600w.png 600w" sizes="(max-width: 640px) 100vw, 300px" />
                <img src="/images/academies/design/ns-academy-design-hero-tablet-600w.png" alt="Creative Design and Visual Arts Studio" width="300" height="169" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div class="loc-discovery-card-header">Creative &amp; Visual Arts</div>
            <div class="loc-discovery-card-body">
              Ideal for visual thinkers, graphic artists, content creators, and future UI/UX designers looking to build commercial client portfolios.
            </div>
            <ul class="loc-discovery-tags-list">
              <li class="loc-discovery-tag-item">Graphic Design Professional</li>
              <li class="loc-discovery-tag-item">Professional Video Editing</li>
              <li class="loc-discovery-tag-item">UI/UX Design Professional</li>
            </ul>
            <a href="/academies/design/" class="loc-discovery-card-action">Explore Design Academy →</a>
          </div>

          <!-- Track 2: Marketing & Growth -->
          <div class="loc-discovery-card">
            <div class="loc-discovery-card-thumb">
              <picture>
                <source type="image/png" srcset="/images/projects/dm-professional/ns-proj-dm-analytics-dashboard-mobile-400w.png 400w, /images/projects/dm-professional/ns-proj-dm-analytics-dashboard-card-640w.png 640w" sizes="(max-width: 640px) 100vw, 300px" />
                <img src="/images/projects/dm-professional/ns-proj-dm-analytics-dashboard-card-640w.png" alt="Digital Marketing and Performance Growth Analytics" width="300" height="169" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div class="loc-discovery-card-header">Marketing &amp; Growth</div>
            <div class="loc-discovery-card-body">
              Tailored for marketing professionals, media buyers, and brand strategists managing enterprise ad spend and organic search reach.
            </div>
            <ul class="loc-discovery-tags-list">
              <li class="loc-discovery-tag-item">AI Digital Marketing Specialist</li>
              <li class="loc-discovery-tag-item">Performance Marketing Specialist</li>
              <li class="loc-discovery-tag-item">YouTube Growth &amp; Content Strategy</li>
            </ul>
            <a href="/academies/digital-marketing/" class="loc-discovery-card-action">Explore Marketing Academy →</a>
          </div>

          <!-- Track 3: Technology & Development -->
          <div class="loc-discovery-card">
            <div class="loc-discovery-card-thumb">
              <picture>
                <source type="image/png" srcset="/images/academies/programming/ns-academy-programming-hero-mobile-400w.png 400w, /images/academies/programming/ns-academy-programming-hero-tablet-600w.png 600w" sizes="(max-width: 640px) 100vw, 300px" />
                <img src="/images/academies/programming/ns-academy-programming-hero-tablet-600w.png" alt="Software Engineering and Full Stack Programming Studio" width="300" height="169" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div class="loc-discovery-card-header">Technology &amp; Development</div>
            <div class="loc-discovery-card-body">
              Engineered for future software developers, full-stack engineers, and python programmers building scalable web applications.
            </div>
            <ul class="loc-discovery-tags-list">
              <li class="loc-discovery-tag-item">AI Full Stack Web Development</li>
              <li class="loc-discovery-tag-item">Python Developer Professional</li>
              <li class="loc-discovery-tag-item">E-Commerce Website Mastery</li>
            </ul>
            <a href="/academies/programming/" class="loc-discovery-card-action">Explore Programming Academy →</a>
          </div>

          <!-- Track 4: AI & Business Operations -->
          <div class="loc-discovery-card">
            <div class="loc-discovery-card-thumb">
              <picture>
                <source type="image/png" srcset="/images/academies/office-productivity/ns-academy-office-hero-mobile-400w.png 400w, /images/academies/office-productivity/ns-academy-office-hero-tablet-600w.png 600w" sizes="(max-width: 640px) 100vw, 300px" />
                <img src="/images/academies/office-productivity/ns-academy-office-hero-tablet-600w.png" alt="Office Productivity and Business Automation Studio" width="300" height="169" loading="lazy" decoding="async" />
              </picture>
            </div>
            <div class="loc-discovery-card-header">AI &amp; Operations</div>
            <div class="loc-discovery-card-body">
              Focused on modern business managers, operational leads, and analysts looking to automate repetitive tasks and optimize data reporting.
            </div>
            <ul class="loc-discovery-tags-list">
              <li class="loc-discovery-tag-item">AI for Business Professional</li>
              <li class="loc-discovery-tag-item">MIS &amp; Business Intelligence</li>
              <li class="loc-discovery-tag-item">Office Productivity Professional</li>
            </ul>
            <a href="/academies/ai/" class="loc-discovery-card-action">Explore AI Academy →</a>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 08: HOW LIVE ONLINE LEARNING WORKS
         ============================================================ -->
    <section class="loc-how-section" id="how-it-works" aria-labelledby="how-heading">
      <div class="loc-container">
        
        <header class="loc-section-header">
          <span class="loc-section-tag">Learning Methodology</span>
          <h2 class="loc-section-title" id="how-heading">Learn Live. Build Skills. Progress From Anywhere.</h2>
          <p class="loc-section-subtitle">
            A transparent, 5-step learning methodology designed to deliver real classroom discipline in an accessible online format.
          </p>
        </header>

        <div class="loc-steps-grid">
          
          <div class="loc-step-card">
            <span class="loc-step-num">01</span>
            <h3 class="loc-step-title">Explore a Program</h3>
            <p class="loc-step-desc">
              Browse our verified 109-course catalogue, compare curriculum modules, software tools, and practical project requirements.
            </p>
          </div>

          <div class="loc-step-card">
            <span class="loc-step-num">02</span>
            <h3 class="loc-step-title">Book Free Demo</h3>
            <p class="loc-step-desc">
              Reserve your seat in a 2-day live interactive demonstration batch to experience our mentor teaching style firsthand.
            </p>
          </div>

          <div class="loc-step-card">
            <span class="loc-step-num">03</span>
            <h3 class="loc-step-title">Discuss Goals</h3>
            <p class="loc-step-desc">
              Connect with an admissions advisor to review your schedule, choose weekday or weekend batches, and map career milestones.
            </p>
          </div>

          <div class="loc-step-card">
            <span class="loc-step-num">04</span>
            <h3 class="loc-step-title">Live Interactive Classes</h3>
            <p class="loc-step-desc">
              Attend live two-way virtual classrooms featuring screen-shares, collaborative code and design reviews, and live Q&amp;A.
            </p>
          </div>

          <div class="loc-step-card">
            <span class="loc-step-num">05</span>
            <h3 class="loc-step-title">Build Real Portfolio</h3>
            <p class="loc-step-desc">
              Complete capstone client projects, build industry-ready case studies, and receive your verified course certification.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 09: REAL CAMPUS VS ONLINE LOCATIONS
         ============================================================ -->
    <section class="loc-campus-vs-online-section" id="campus-vs-online" aria-labelledby="comparison-heading">
      <div class="loc-container">
        
        <header class="loc-section-header">
          <span class="loc-section-tag">Transparency &amp; Trust</span>
          <h2 class="loc-section-title" id="comparison-heading">One Learning Community. Different Ways to Learn.</h2>
          <p class="loc-section-subtitle">
            We believe in complete transparency regarding our delivery formats and physical presence.
          </p>
        </header>

        <div class="loc-comparison-grid">
          
          <!-- Physical Classroom Campus -->
          <div class="loc-comparison-card highlight-campus">
            <span class="loc-comparison-badge">🏛 Physical Classroom Campus</span>
            <h3 class="loc-comparison-title">Siddharth Nagar Headquarters</h3>
            <p class="loc-comparison-desc">
              Our official physical learning campus and administrative center is situated in Siddharth Nagar, Uttar Pradesh.
            </p>
            <ul class="loc-comparison-features">
              <li class="loc-comparison-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Dedicated on-campus workstation and high-speed design labs.</span>
              </li>
              <li class="loc-comparison-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Face-to-face instruction and local peer group study cohorts.</span>
              </li>
              <li class="loc-comparison-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Walk-in admissions counselling and in-person orientation sessions.</span>
              </li>
            </ul>
          </div>

          <!-- Live Interactive Online -->
          <div class="loc-comparison-card highlight-online">
            <span class="loc-comparison-badge">💻 Live Online Learning Locations</span>
            <h3 class="loc-comparison-title">36 Cities Across 14 States &amp; UTs</h3>
            <p class="loc-comparison-desc">
              All 36 locations in this directory operate as live interactive online service areas, allowing students to learn without relocating.
            </p>
            <ul class="loc-comparison-features">
              <li class="loc-comparison-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Live two-way video instruction with real-time screen sharing.</span>
              </li>
              <li class="loc-comparison-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>1-on-1 mentor code and design reviews on digital submissions.</span>
              </li>
              <li class="loc-comparison-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Complete lecture video archives and weekend doubt clearance rooms.</span>
              </li>
            </ul>
          </div>

        </div>

        <!-- Strict Consumer Disclosure Box -->
        <div class="loc-transparency-box" role="note">
          <strong>Important Institutional Note:</strong> The 36 locations listed in this directory designate authorized online learning service areas and regional student cohorts. Nova Skills does not operate brick-and-mortar branch campuses or franchise offices in these cities. Classroom training is conducted exclusively at our official Siddharth Nagar, Uttar Pradesh campus.
        </div>

      </div>
    </section>

    <!-- ============================================================
         SECTION 10: FOCUSED CONVERSION SECTION
         ============================================================ -->
    <section class="loc-conversion-section" id="cta-conversion" aria-labelledby="conversion-heading">
      <div class="loc-container">
        <div class="loc-conversion-content">
          <h2 class="loc-conversion-title" id="conversion-heading">Explore Your Options Before You Enroll.</h2>
          <p class="loc-conversion-subtitle">
            Experience our interactive teaching format with a 2-day live demo session, or speak with an admissions mentor for personalized course and batch guidance.
          </p>
          <div class="loc-conversion-ctas">
            <button type="button" class="loc-btn loc-btn-primary" onclick="window.openFreeDemoModal ? window.openFreeDemoModal() : window.openLocationDemo('general', 'Pan-India')">
              <span>📅</span> Book Your 2-Day Free Demo
            </button>
            <button type="button" class="loc-btn loc-btn-secondary" onclick="window.openConsultationModal ? window.openConsultationModal() : window.openLocationConsultation('general', 'Pan-India')">
              <span>💬</span> Free Consultation
            </button>
            <a href="/courses.html" class="loc-btn loc-btn-secondary">
              <span>📚</span> Explore All Courses
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         SECTION 11: FAQ / AEO / VOICE SEARCH SECTION
         ============================================================ -->
    <section class="loc-faq-section" id="faqs" aria-labelledby="faq-heading">
      <div class="loc-container">
        
        <header class="loc-section-header">
          <span class="loc-section-tag">Help &amp; Clarity</span>
          <h2 class="loc-section-title" id="faq-heading">Frequently Asked Questions</h2>
          <p class="loc-section-subtitle">
            Direct, factual answers regarding our learning locations, course delivery, and admissions.
          </p>
        </header>

        <div class="loc-faq-wrap">
          
          <details class="loc-faq-item">
            <summary class="loc-faq-question">
              <span>Can I join Nova Skills courses online from my city?</span>
              <svg class="loc-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="loc-faq-answer">
              <p>Yes. Students from all 36 listed cities can enroll in live interactive online batches. All sessions include live two-way mentor interactions, hands-on project reviews, recorded lecture archives, and weekend doubt-clearing sessions.</p>
            </div>
          </details>

          <details class="loc-faq-item">
            <summary class="loc-faq-question">
              <span>Does Nova Skills have physical campuses in all 36 listed cities?</span>
              <svg class="loc-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="loc-faq-answer">
              <p>No. Nova Skills' physical classroom campus is located in Siddharth Nagar, Uttar Pradesh. The 36 cities listed in this directory represent our live online learning service areas, where students participate through high-definition live interactive virtual classrooms.</p>
            </div>
          </details>

          <details class="loc-faq-item">
            <summary class="loc-faq-question">
              <span>Which professional courses can I explore?</span>
              <svg class="loc-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="loc-faq-answer">
              <p>You can explore 109+ practical courses across our 12 specialized Academies, including AI Digital Marketing, Graphic Design, Professional Video Editing, AI for Business, Full Stack Web Development, Python, and UI/UX Design.</p>
            </div>
          </details>

          <details class="loc-faq-item">
            <summary class="loc-faq-question">
              <span>How do the live interactive online classes work?</span>
              <svg class="loc-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="loc-faq-answer">
              <p>Classes are conducted live by experienced industry practitioners. Learners build real-world client portfolios, submit regular code or design assignments for personalized 1-on-1 feedback, and interact with peers through our dedicated learning community.</p>
            </div>
          </details>

          <details class="loc-faq-item">
            <summary class="loc-faq-question">
              <span>Can beginners join these programs?</span>
              <svg class="loc-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="loc-faq-answer">
              <p>Yes. Our foundation and professional programs are designed with a zero-to-advanced learning curve. Foundational modules build fundamental concepts before advancing to real-world capstone projects.</p>
            </div>
          </details>

          <details class="loc-faq-item">
            <summary class="loc-faq-question">
              <span>How do I book the 2-Day Free Demo?</span>
              <svg class="loc-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="loc-faq-answer">
              <p>You can click any 'Book Free Demo' button on this page to select your preferred career track and reserve your seat in an upcoming live demonstration batch with zero upfront commitment.</p>
            </div>
          </details>

          <details class="loc-faq-item">
            <summary class="loc-faq-question">
              <span>Are all courses available in live online mode?</span>
              <svg class="loc-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="loc-faq-answer">
              <p>Yes, our flagship professional programs and master diplomas are fully optimized for live interactive online delivery, featuring screen sharing, cloud lab access, and digital portfolio reviews.</p>
            </div>
          </details>

          <details class="loc-faq-item">
            <summary class="loc-faq-question">
              <span>Where can I check course fees and duration?</span>
              <svg class="loc-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="loc-faq-answer">
              <p>Transparent fees and durations are published on our individual course detail pages and Academy catalogues. Professional programs range from 3 to 6 months with verified launch fees starting from ₹19,900. You can visit our <a href="/courses.html">All Courses catalogue</a> for a full breakdown.</p>
            </div>
          </details>

          <details class="loc-faq-item">
            <summary class="loc-faq-question">
              <span>Can I contact an admissions counsellor before enrolling?</span>
              <svg class="loc-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="loc-faq-answer">
              <p>Absolutely. You can schedule a Free Consultation with an academic advisor who will review your career goals, evaluate suitable learning paths, and explain batch schedules.</p>
            </div>
          </details>

          <details class="loc-faq-item">
            <summary class="loc-faq-question">
              <span>Where is the actual Nova Skills classroom campus?</span>
              <svg class="loc-faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="loc-faq-answer">
              <p>Our physical classroom campus and administrative headquarters are located in Siddharth Nagar, Uttar Pradesh. Detailed campus directions and contact info are available on our official <a href="/contact.html">Contact page</a>.</p>
            </div>
          </details>

        </div>
      </div>
    </section>

  </main>

  <!-- Injected Footer Shell -->
  <div id="ns-footer"></div>

  <!-- Scripts -->
  <script src="/js/data.min.js?v=2.7.4" defer></script>
  <script src="/js/components.min.js?v=2.7.4" defer></script>
  <script src="/js/icon-system.js" defer></script>
  <script src="/js/locations-directory.js" defer></script>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_PATH, fullHtml, 'utf8');
  console.log('Successfully generated:', OUTPUT_PATH);
  console.log('File size:', (fullHtml.length / 1024).toFixed(2), 'KB');
}

buildDirectoryHtml();
