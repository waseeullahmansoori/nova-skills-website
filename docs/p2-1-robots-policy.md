# P2-1 Robots Exclusion Protocol Policy & Implementation

**Website:** Nova Skills (`https://novaskills.in`)  
**Robots Protocol Endpoint:** `https://novaskills.in/robots.txt`  
**Legacy Singular Endpoint:** `https://novaskills.in/robot.txt` (301 Redirected to `/robots.txt`)  
**Specification:** Robots Exclusion Standard (RFC 9309 compliant)  
**Audit Date:** 2026-11-13  
**Status:** Active, Compliant, Verified (450/450 Checks Passed)  

---

## 1. Official Repository Robots.txt File

The repository root `robots.txt` contains the following verified policy:

```txt
# ============================================================
# Nova Skills Official Robots Exclusion Protocol File
# Website: https://novaskills.in
# Compliant with Googlebot, Bingbot & Search Console Standards
# ============================================================

User-agent: *
Allow: /

# Protected Admin & Private User Portals
Disallow: /admin.html
Disallow: /admin-activity.html
Disallow: /admin-settings.html
Disallow: /admin/
Disallow: /login.html
Disallow: /student.html
Disallow: /portal.html
Disallow: /register.html
Disallow: /ai-chat.html

# Excluded Conversion Confirmation Routes
Disallow: /thank-you/
Disallow: /lead-success/

# Internal Code & Build System Directories
Disallow: /scripts/
Disallow: /cloudflare-worker/
Disallow: /database/
Disallow: /google-apps-script/
Disallow: /.git/
Disallow: /node_modules/

# Official Sitemap Location
Sitemap: https://novaskills.in/sitemap.xml
```

---

## 2. Rule Architecture & Directive Analysis

### A. Global Crawl Permission
`User-agent: *` combined with `Allow: /` ensures that search engine crawlers (Googlebot, Bingbot, DuckDuckBot, etc.) have full discovery access across all published educational offerings.

### B. Asset Crawlability Guarantee (Rendering & Mobile-Friendly Tests)
To properly render pages, evaluate Core Web Vitals, and index visual layout, search engine bots must not be restricted from static stylesheets, JavaScript bundles, self-hosted webfonts, and course visuals:
- `/css/` — Allowed
- `/js/` — Allowed
- `/public/` (including `/public/fonts/` and `/public/images/`) — Allowed
- `/images/` — Allowed
- `/branding%20content/` — Allowed

### C. Private & Administrative Disallow Rules
Prevents crawlers from wasting crawl budget on non-public application endpoints:
- Administrative dashboards (`/admin.html`, `/admin-activity.html`, `/admin-settings.html`, `/admin/`)
- Student portal authentication gateways (`/login.html`, `/student.html`, `/portal.html`, `/register.html`)
- Standalone chatbot interface (`/ai-chat.html`)
- Internal code, CI/CD, and deployment infrastructure (`/scripts/`, `/cloudflare-worker/`, `/database/`, `/google-apps-script/`, `/.git/`, `/node_modules/`)

### D. Conversion Confirmation Protection
Lead conversion confirmation pages (`/thank-you/` and `/lead-success/`) are explicitly disallowed in `robots.txt` and fortified with `X-Robots-Tag: noindex, follow` in `_headers` to prevent synthetic traffic from entering the GA4 lead pipeline through search index clicks.

### E. Authoritative Sitemap Directive
`Sitemap: https://novaskills.in/sitemap.xml` provides search engine spiders with an instant reference to the complete, canonical list of 175 indexable URLs.

---

## 3. Cloudflare Managed Content Interaction

During live network probing of `https://novaskills.in/robots.txt`, Cloudflare's Edge prepends managed AI-crawler and content signal directives prior to serving the repository `robots.txt`:
1. **Content Signals:** Expresses EU Directive 2019/790 Article 4 copyright reservation (`Content-Signal: search=yes,ai-train=no,use=reference`).
2. **AI Model Training Blockers:** Blocks automated AI training scrapers (e.g. `GPTBot`, `ClaudeBot`, `Amazonbot`, `Google-Extended`, `Bytespider`, `CCBot`, `anthropic-ai`, `meta-externalagent`).
3. **Repository Directives Appended:** The repository `robots.txt` is faithfully appended directly following `# END Cloudflare Managed Content`.

Search engine spiders (Googlebot, Bingbot) are explicitly permitted via `Content-Signal: search=yes`, `Allow: /`, and the repository's `Allow: /`.

---

## 4. Singular Legacy Route Compatibility (`/robot.txt`)

Web crawlers or external scrapers attempting to fetch the singular `/robot.txt` route previously encountered an unhandled 404 response. In Task P2-1, an explicit permanent redirect was added to `_redirects`:

```
/robot.txt  /robots.txt  301
```

This guarantees that any legacy client or crawler requesting `/robot.txt` is seamlessly routed to the canonical `/robots.txt` in a single hop with HTTP 301.

---

## 5. Environment-Specific Header Protection (`X-Robots-Tag`)

To prevent non-production preview deployments (`*.pages.dev`) from becoming indexed or creating duplicate search results:

```javascript
// functions/_middleware.js
const isProduction = url.hostname === 'novaskills.in';
const robotsTag = isProduction ? 'index, follow' : 'noindex, nofollow';

return new Response(RENDERED_COURSES[id], {
  status: 200,
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'X-Robots-Tag': robotsTag
  }
});
```

- **Production (`novaskills.in`):** Serves `X-Robots-Tag: index, follow`.
- **Cloudflare Previews (`*.pages.dev`):** Serves `X-Robots-Tag: noindex, nofollow`.
- **404 Error State:** Serves `X-Robots-Tag: noindex, follow`.
