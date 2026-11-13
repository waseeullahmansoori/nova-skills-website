# Nova Skills — Layer 49 / Phase 2: AI Crawler Access & Infrastructure Audit

**Document ID:** AI-SEO-PHASE-2-CRAWLER-AUDIT  
**Focus:** Search Bot Permissibility, Separation of Search vs Training, Cloudflare WAF & Edge Telemetry  
**Branch:** development  
**Status:** Approved & Verified  

---

## 1. Executive Summary & Verification of Current Robots.txt

The current `robots.txt` file at `https://novaskills.in/robots.txt` enforces a global wildcard rule:
```txt
User-agent: *
Allow: /
```
While this technically permits all well-behaved web crawlers, AI search indexers—specifically **OAI-SearchBot** (ChatGPT Search), **PerplexityBot** (Perplexity Search), and **Claude-SearchBot** (Claude Web Search)—operate with higher crawl fidelity and faster indexing velocity when their specific User-Agents are explicitly declared and confirmed.

### Strict Governance Invariant:
**Search Discovery Crawlers MUST be separated from Training Crawlers:**
- **Search Discovery Crawlers:** `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`, `Bingbot`, `Googlebot`. These are explicitly allowed access to all public course, academy, city, and blog pages.
- **Model Training Crawlers & Tokens:** `GPTBot`, `ClaudeBot`, `Google-Extended`. Existing owner preferences are strictly preserved; no training authorization is silently altered.

---

## 2. Proposed Robots.txt Configuration

The proposed configuration adds explicit blocks for AI search crawlers without touching training preferences or disrupting standard search engines:

```txt
# ============================================================
# Nova Skills Official Robots Exclusion Protocol File
# Website: https://novaskills.in
# Compliant with Googlebot, Bingbot, ChatGPT, Perplexity & Claude
# ============================================================

# 1. Global Crawler Directives
User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /admin-activity.html
Disallow: /admin-settings.html
Disallow: /admin/
Disallow: /login.html
Disallow: /student.html
Disallow: /portal.html
Disallow: /register.html
Disallow: /ai-chat.html
Disallow: /thank-you/
Disallow: /lead-success/
Disallow: /scripts/
Disallow: /cloudflare-worker/
Disallow: /database/
Disallow: /google-apps-script/
Disallow: /.git/
Disallow: /node_modules/

# 2. ChatGPT Search Discovery (OpenAI Search)
User-agent: OAI-SearchBot
Allow: /

# 3. ChatGPT User Retrieval
User-agent: ChatGPT-User
Allow: /

# 4. Perplexity Search Discovery
User-agent: PerplexityBot
Allow: /

# 5. Perplexity User Retrieval
User-agent: Perplexity-User
Allow: /

# 6. Claude Search Discovery (Anthropic Search)
User-agent: Claude-SearchBot
Allow: /

# 7. Claude User Retrieval
User-agent: Claude-User
Allow: /

# 8. Google Ecosystem (Search, AI Overviews & AI Mode)
User-agent: Googlebot
Allow: /

# 9. Microsoft Ecosystem (Bing & Copilot)
User-agent: Bingbot
Allow: /

# Official Sitemap Location
Sitemap: https://novaskills.in/sitemap.xml
```

---

## 3. Cloudflare Pages & WAF Compatibility

- **Managed Bot Defense:** Verified that Cloudflare Bot Management does not challenge verified AI search bots.
- **Reverse DNS & IP Verification:** Cloudflare automatically recognizes legitimate Googlebot, Bingbot, OpenAI, Perplexity, and Anthropic IP ranges via ASN matching.
- **Zero JS Challenge on Edge SSR:** Pre-rendered course detail pages served by Cloudflare Edge Workers (`functions/_middleware.js`) return status 200 with raw HTML before client-side JS evaluation.
