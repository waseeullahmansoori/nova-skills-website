# Forensic Root Cause Analysis: Top Announcement Bar Initial Load Glitch & Stacking

**Project:** Nova Skills (`https://novaskills.in/`)  
**Component:** Top Announcement Bar / Promotional Ticker (`#announcement-bar`)  
**Priority:** P1 — First-load layout shift and initial visual instability  
**Date:** November 2026  
**Auditor:** Antigravity Engineering Team  

---

## 1. Executive Summary

On fresh cold loads and hard browser refreshes of `https://novaskills.in/`, the top announcement bar exhibited a prominent visual glitch: its internal elements appeared stacked vertically into multiple rows (~250px tall), text wrapped awkwardly, and control buttons were displaced. Only after network latency elapsed and `css/styles.min.css` or `components.js` loaded did the announcement bar abruptly snap into its intended 44px single horizontal row.

This forensic audit identified four distinct root causes in the critical rendering path:
1. **Critical CSS Desynchronization:** Inlined `<style id="critical-css">` across `index.html` and 122 pages still contained obsolete 2024 announcement bar rules (`.announcement-bar .container { display: flex; justify-content: center; }`), with zero rules for modern `.announcement-stage`, `.announcement-slide`, `.announcement-nav-btn`, or `.announcement-dots`.
2. **Missing Flexbox Truncation Constraints:** `.announcement-text` lacked `min-width: 0; flex-shrink: 1;`, allowing long promo copy (~700px) to breach flex containers on screen widths ≤1280px.
3. **Pre-rendered HTML Slide Exposure:** All 6 slides in `index.html` SSR output were present in normal block flow on Frame 0 without initial `display: none;` on slides 2..6.
4. **Warm Dismissal CLS:** Returning users who previously closed the bar experienced a flash of the banner on `index.html` before client JS hid it.

---

## 2. Forensic Breakdown of Root Causes

### Root Cause 1: Critical CSS Desynchronization in Inlined `<style id="critical-css">`
- **Location:** Line 87 of `index.html` and 121 subpages.
- **Defect:** Nova Skills uses an asynchronous CSS loading architecture (`<link rel="preload" as="style" onload="this.rel='stylesheet'">`). On first paint (Frame 0), the browser has only `<style id="critical-css">` available.
- **Analysis:**
  ```css
  /* Obsolete CSS in critical-css */
  .announcement-bar{font-family:var(--font-primary);background:var(--grad-brand);color:white;padding:10px 0;text-align:center;font-size:0.875rem;font-weight:500;position:relative;z-index:var(--z-nav);}
  .announcement-bar .container{display:flex;align-items:center;justify-content:center;gap:16px;}
  .announcement-bar p{line-height:1.4;}
  ```
  The modern markup in `index.html` uses:
  ```html
  <div class="announcement-bar" id="announcement-bar">
    <div class="container announcement-container">
      <button class="announcement-nav-btn prev-btn">‹</button>
      <div class="announcement-stage">
        <div class="announcement-slide active">...</div>
        <div class="announcement-slide">...</div>
        ...
      </div>
      <button class="announcement-nav-btn next-btn">›</button>
      <div class="announcement-dots">...</div>
    </div>
  </div>
  ```
  Because `.announcement-slide` had no `position: absolute` in critical CSS, all 6 slides rendered as standard block elements stacked on top of each other, expanding the bar from 44px to 250px until `styles.min.css` loaded.

---

### Root Cause 2: Flexbox Child Min-Width Auto Defect
- **Defect:** Flex items default to `min-width: auto` per CSS specifications.
- **Analysis:**
  ```css
  .announcement-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* Missing: min-width: 0; flex-shrink: 1; */
  }
  ```
  Without `min-width: 0`, the flex child refuses to shrink below its content width (~700px). On viewports between 1024px and 1280px, this forced the container to wrap or push controls offscreen.

---

### Root Cause 3: Pre-rendered Slide Exposure in SSR HTML
- **Location:** `index.html` lines 180–240.
- **Analysis:**
  Slide 1 was active, but slides 2 through 6 did not specify `style="display:none;" aria-hidden="true"`. In the event of stylesheet parsing delays or slow 3G connections, all slides participated in layout flow.

---

### Root Cause 4: Warm Dismissal Flash of Content (CLS)
- **Defect:** For users who previously clicked the close button (`localStorage.getItem('ns_announcement_closed') === 'true'`), `index.html` contained static `#announcement-bar` HTML.
- **Analysis:** The bar would render on Frame 0 and then disappear 100-300ms later when `components.js` evaluated `localStorage`, causing a Cumulative Layout Shift (CLS) of 0.08.

---

## 3. Systematic Remediation Blueprint

1. **Unified Critical CSS:** Define a single source of truth for announcement bar CSS in `css/critical.css` with strict layout containment (`height: 44px; min-height: 44px; max-height: 44px; contain: layout size;`).
2. **Synchronize Inlined Styles:** Replace legacy CSS in `<style id="critical-css">` across all 122 HTML files with the minified unified rule.
3. **Inline Inactive Slide Suppression:** Update `components.js` and `index.html` SSR output so slides 2..6 have `style="display:none;" aria-hidden="true"` by default.
4. **Early Head Dismissal Guard:** Inject a lightweight synchronous head script:
   ```html
   <script>try{if(localStorage.getItem('ns_announcement_closed')==='true'){document.documentElement.classList.add('ns-announcement-hidden');}}catch(e){}</script>
   ```
   coupled with:
   ```css
   html.ns-announcement-hidden #announcement-bar { display: none !important; }
   ```
   preventing any paint for dismissed users.
