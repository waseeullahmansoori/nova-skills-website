# NOVA SKILLS — SEARCH CRAWLER, ROBOTS & AI DISCOVERY AUDIT
**Task ID:** Phase 4 — Crawler Access & Bot Management  

---

## 1. SEARCH CRAWLER COMPLIANCE MATRIX
| Crawler User-Agent | Organization | Purpose | Robots.txt Status | Cloudflare WAF Status | Verification Method |
|---|---|---|---|---|---|
| **Googlebot** | Google | Web Indexing & AI Overviews | ALLOWED | ALLOWED | Verified live 200 OK |
| **Bingbot** | Microsoft | Bing & Copilot Search | ALLOWED | ALLOWED | Verified live 200 OK |
| **OAI-SearchBot** | OpenAI | ChatGPT Search Live Retrieval | ALLOWED | ALLOWED | Verified non-blocked |
| **PerplexityBot** | Perplexity AI | Perplexity Answer Engine | ALLOWED | ALLOWED | Verified non-blocked |
| **GPTBot** | OpenAI | Model Training Crawl | Governed by Owner Policy | Managed | Preserves owner policy |

## 2. ROBOTS.TXT DIRECTIVES INTEGRITY
- **Path:** `https://novaskills.in/robots.txt`
- **Disallowed Paths:**
  - `/admin/`
  - `/admin.html`
  - `/portal.html`
  - `/student.html`
  - `/login.html`
  - `/register.html`
- **Sitemap Directive:** `Sitemap: https://novaskills.in/sitemap.xml`
- **Asset Access:** CSS, JS, fonts, and images are 100% crawlable without blocking directives.
