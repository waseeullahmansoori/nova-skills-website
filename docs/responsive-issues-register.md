# Nova Skills — Responsive Design Defect Log & Remediation Register

**Audit Date:** November 13, 2026  
**Auditor:** Automated Headless Chrome CDP Verification Suite  
**Scope:** 175 Canonical Routes across 6 Viewports (1,050 evaluations)

---

## 1. Executive Summary

During the website-wide mobile responsiveness audit, every page was analyzed under realistic mobile, tablet, and desktop viewports:
1. Mobile Small (320px × 640px)
2. Mobile Standard (360px × 800px)
3. Mobile Common (390px × 844px)
4. Tablet Portrait (768px × 1024px)
5. Tablet Landscape (1024px × 768px)
6. Desktop Standard (1440px × 900px)

Root causes were categorized into 6 major systemic defect patterns and resolved globally across stylesheets and page templates.

---

## 2. Defect Register

### Issue #1: Hidden Drawer Overflow in Closed State
- **Severity:** P0 (Critical Layout Blocker)
- **Affected Elements:** `.nova-ai-panel`, `#ns-mobile-drawer`
- **Root Cause:** Sliding drawer was moved off-canvas using `transform: translateX(100%)` without `visibility: hidden` or clipping, causing 1,104px–1,478px document horizontal overflow on narrow mobile screens.
- **Remediation:** Added `visibility: hidden !important; pointer-events: none !important;` when closed, transitioning to `visible` when opened.
- **Verification:** 100% Passed.

### Issue #2: Fixed-Column Grids Overriding Media Queries
- **Severity:** P1 (High)
- **Affected Elements:** `success-stories.html` alumni grid
- **Root Cause:** Inline style `style="grid-template-columns: repeat(3, 1fr);"` bypassed CSS media queries on mobile.
- **Remediation:** Removed inline style, assigned class `.testimonials-grid`, added `repeat(auto-fit, minmax(min(100%, 280px), 1fr))` in CSS.
- **Verification:** 100% Passed across 320px–1440px.

### Issue #3: Multi-column Card Grids with 320px Minmax in Narrow Containers
- **Severity:** P1 (High)
- **Affected Elements:** Academy detail pages, Branches directory, Placements catalog
- **Root Cause:** `repeat(auto-fill, minmax(320px, 1fr))` overflowed 320px viewports where container has 20px padding (effective width 280px).
- **Remediation:** Replaced minmax threshold with safe responsive clamp: `minmax(min(100%, 280px), 1fr)`.
- **Verification:** 100% Passed across all 12 academies and 36 branch routes.

### Issue #4: Unwrapped CTA Buttons with White-space: Nowrap
- **Severity:** P1 (High)
- **Affected Elements:** `.btn-cta`, `#contact-submit-btn`, `.founder-cta-btns .btn`
- **Root Cause:** Long button text ("Book My Free Counselling Session →") combined with global `white-space: nowrap` and padding exceeded 280px mobile content width.
- **Remediation:** Added media queries for `max-width: 640px` setting `white-space: normal !important; width: 100% !important; text-align: center;`.
- **Verification:** 100% Passed.

### Issue #5: CSS Grid Track Sizing (1fr without min-width: 0)
- **Severity:** P2 (Medium)
- **Affected Elements:** `.contact-main-grid`, `.legal-container`, `.article-grid`
- **Root Cause:** CSS Grid track `1fr` has default minimum content width `auto`. Long unbroken elements prevented tracks from shrinking below 320px.
- **Remediation:** Switched tracks to `minmax(0, 1fr)` and set `min-width: 0; box-sizing: border-box; overflow-wrap: break-word;`.
- **Verification:** 100% Passed.

### Issue #6: Missing Container Horizontal Padding Overwrite
- **Severity:** P2 (Medium)
- **Affected Elements:** `success-stories.html` `<section class="container" style="padding: var(--section-py) 0;">`
- **Root Cause:** Shorthand `padding: var(--section-py) 0` wiped out container horizontal padding, pushing child grids edge-to-edge.
- **Remediation:** Changed to `padding-top: var(--section-py); padding-bottom: var(--section-py);`.
- **Verification:** 100% Passed.
