# Nova Skills — Layer 60: International & Regional Technical SEO Audit

**Document ID:** TECH-LAYER-60  
**Focus:** Language Tagging (`en-IN`), Hreflang Policy Enforcement, Regional Geographic Signals & Domestic Market Focus  
**Status:** Approved & Verified  
**Branch:** development  

---

## 1. Target Geographic Entity & Language Baseline

Nova Skills is an Indian educational institution primarily serving students, fresh graduates, and working professionals across India and the Indian diaspora:
- **Primary Market:** India (`country: IN`, `region: Asia/Kolkata`).
- **Primary Language of Instruction:** English (`lang="en-IN"` / `lang="en"`), with bilingual instruction support (English + Hindi explanations) during live sessions.
- **Document Language Declaration:** Every canonical HTML document declares `<html lang="en-IN">` (or `<html lang="en">` with localized schema entities) to indicate English language tailored to the Indian educational context.

---

## 2. Strict Hreflang Policy: Prohibition on Regional Landing Pages

### *CRITICAL TECHNICAL SEO GOVERNANCE RULE:*
**Do NOT implement hreflang tags across city service hubs (`/branches/<slug>/`).**

### Why Hreflang across City Pages is Strictly Prohibited:
1. **Misapplication of RFC 5646:** Hreflang annotations (`hreflang="en-US"`, `hreflang="en-GB"`) are exclusively intended for cross-national or multilingual versions of equivalent content.
2. **Domestic City Hubs are NOT Language Variants:** `/branches/indore/` and `/branches/mumbai/` are regional service area landing pages within the same country (India) in the same language (English). They are not country or language alternatives of each other.
3. **Prevention of GSC Return Tag Errors:** Annotating city pages with fake regional hreflang tags (e.g., `hreflang="en-IN-Indore"`) causes immediate Google Search Console errors, flags irregular code structures, and leads to algorithmic penalties for manipulative markup.

### Permitted Hreflang Scope:
Should Nova Skills deploy dedicated localized subdomains in the future (e.g., `hi.novaskills.in` for pure Hindi curriculum or `uae.novaskills.in` for Gulf NRI admissions), bi-directional hreflang tags with `x-default` will be deployed. Currently, the site operates on a single canonical English-India domain.

---

## 3. Geographic & Regional Localization Signals

Nova Skills communicates clear geographical signals through unambiguous semantic markup and structured content:
1. **Physical Campus Entity:**
   - `PostalAddress`: Near Block Office, Siddharth Nagar, Uttar Pradesh 272153, India.
   - Coordinates: Latitude 27.2713° N, Longitude 83.0722° E.
2. **Economic & Currency Signals:**
   - Tuition fees are strictly quoted in Indian Rupees (`INR`, `₹`).
   - Official starting price: ₹2,900 (+ 18% GST).
3. **Telecommunication Signals:**
   - Telephone and WhatsApp admissions helplines use India's country calling code (`+91 99180 06633`).
4. **Service Area Matrix:**
   - `areaServed`: 36 Indian cities explicitly mapped in the central `EducationalOrganization` schema graph.
