# P0-5 PRICING & GST MIGRATION REPORT
## Comprehensive Commercial Data Reconciliation & Tax Disclosure Report

**Project:** Nova Skills  
**Task ID:** P0-5  
**Priority:** P0 — Critical  
**Category:** Commercial Data / Pricing / GST / Conversion Transparency  
**Git Target Branch:** `development` (Strictly NO production deployment)  
**Execution Date:** November 13, 2026  
**Implementation Engineer:** Antigravity Engineering (Senior Frontend Developer, UI/UX Engineer & Data Architect)  

---

## 1. Complete List of Audited Pages & Components

Every surface representing course fees, discounts, and tax disclosures across the Nova Skills platform was audited:

1. **Global Course Detail Pages & Templates:**
   - Dynamic client-side application: `course-detail.html` and `course-detail.js`.
   - Pre-rendered static pages: All 109 static course pages in `_rendered_courses/*.html`.
   - Serverless SSR/Edge Handler: `functions/_rendered_courses.js`.
   - Page generator: `scripts/build-course-pages.js`.
2. **Global Course Catalog & Home Surfaces:**
   - Catalog index: `courses.html` and `courses.js`.
   - Homepage featured course components: `index.html` and `app.js`.
3. **Academy Course Listing Surfaces (12 Academies):**
   - AI & Machine Learning Academy: `academies/ai-machine-learning/index.html`
   - Programming & Development Academy: `academies/programming-development/index.html`
   - Digital Marketing Academy: `academies/digital-marketing/index.html`
   - Design & Creative Arts Academy: `academies/design-creative-arts/index.html`
   - 3D Architecture & Animation Academy: `academies/3d-architecture-animation/index.html`
   - Video Editing & Production Academy: `academies/video-editing-production/index.html`
   - Content & Social Media Academy: `academies/content-social-media/index.html`
   - Kids Coding & STEM Academy: `academies/kids-coding-stem/index.html`
   - Business & Productivity Academy: `academies/business-productivity/index.html`
   - No-Code & Automation Academy: `academies/no-code-automation/index.html`
   - Spoken English & Communication Academy: `academies/spoken-english-communication/index.html`
   - Career Development Academy: `academies/career-development/index.html`
4. **Location & Branch Pages:**
   - All 13 physical & online branch pages (`branches/*/index.html` including `branches/indore/index.html`).
5. **Canonical Data Stores:**
   - `data/courses.json` (canonical source of truth for all 109 courses).
   - `data/courses/*.json` (109 individual course definitions).
   - `data/curricula/*.json` (109 curriculum and FAQ source files).
   - `data.js` and `js/data.min.js` (bundled runtime catalogs).
   - `js/course-data.js` and `js/course-data.min.js` (runtime course utility API).

---

## 2. Contradictions Identified

### 2.1 The Global Marketing vs Academic Curriculum Conflict
Prior to P0-5 implementation, an uncoordinated marketing push hardcoded the badge:
```text
💳 Flexible monthly installment options available · 18% GST included
```
into the hero sidebar of every course detail page (`course-detail.html:136`, `course-detail.js:375`, and `scripts/build-course-pages.js:378`).

Concurrently, curriculum authors had generated FAQ sections across 69 course definition files stating:
```text
...Tuition for this program is ₹XX,XXX (statutory 18% GST extra). Total payable tuition including GST is ₹YY,YYY.
```

### 2.2 Concrete Contradiction Examples
- **`ai-mastery`:** Hero promised "18% GST included" on launch fee ₹64,900. FAQ computed: "Regular ₹89,900 | Launch ₹64,900 | 18% GST ₹11,682 | Total Payable ₹76,582".
- **`ai-assisted-full-stack-web-development`:** Hero promised "18% GST included" on launch fee ₹44,900. FAQ computed: "Regular ₹64,900 | Launch ₹44,900 | 18% GST ₹8,082 | Total Payable ₹52,982".
- **`ecommerce-growth-marketing-specialist`:** Hero promised "18% GST included" on launch fee ₹27,900. FAQ computed: "Regular ₹34,900 | Launch ₹27,900 | 18% GST ₹5,022 | Total Payable ₹32,922".
- **`career-launch-placement-readiness-professional`:** Hero promised "18% GST included" on launch fee ₹14,900. FAQ stated GST extra and calculated ₹17,582 total payable.

### 2.3 Legal & Commercial Risk
Displaying conflicting total payable figures on the same page creates confusion, erodes trust during admissions counselling, and violates commercial disclosure standards.

---

## 3. Authority Applied

### 3.1 Forensic Finding on Payment Gateway & Finance Records
An exhaustive repository audit established:
- Nova Skills currently operates a **counsellor-facilitated admissions model** (lead generation via WhatsApp, forms, and phone consultation).
- There are **no active checkout payment gateways** (no Razorpay, Stripe, Cashfree, or PayU integrations with live merchant tax configurations).
- There is **no signed finance fee charter** or statutory tax declaration document in the repository defining whether listed fees are B2C tax-inclusive or tax-exclusive.

### 3.2 Authoritative Instruction
Under Section 4 of the P0-5 specification:
> *"If canonical tax treatment is not documented with executive or finance sign-off: DO NOT invent a GST policy. DO NOT display unsupported total payable amounts. Preserve base and launch pricing. Replace contradictory claims with a neutral interim disclosure: 'The final payable amount, including any applicable taxes, will be clearly displayed before payment.' Flag the item for administrative and finance review in docs/p0-5-gst-policy-approval-required.md."*

---

## 4. Data Schema Changes

To centralize commercial pricing and prevent conflicting ad-hoc disclosures, `data/courses.json` and all individual course files were updated with a normalized, validated pricing schema:

```json
{
  "pricing": {
    "currency": "INR",
    "courseFee": 89900,
    "launchFee": 64900,
    "display": "₹64,900",
    "regularDisplay": "₹89,900",
    "discount": {
      "percentage": 28,
      "label": "28% OFF"
    },
    "tax": {
      "treatment": "pending-approval",
      "rate": 18,
      "label": "GST",
      "amount": null
    },
    "payable": {
      "courseFeeTotal": null,
      "launchFeeTotal": null
    },
    "gst": {
      "rate": 18,
      "treatment": "pending-approval",
      "uiDisplayLabel": "The final payable amount, including any applicable taxes, will be clearly displayed before payment."
    }
  }
}
```

### Key Schema Enhancements:
1. `pricing.tax.treatment` & `pricing.gst.treatment`: Set to `"pending-approval"` across all 109 courses.
2. `pricing.tax.amount` & `pricing.payable.*`: Explicitly set to `null` to avoid publishing unapproved mathematical totals.
3. `pricing.gst.uiDisplayLabel`: Standardized to the approved neutral interim disclosure.
4. `pricing.discount`: Programmatically calculated using round percentages (`Math.round((regular - launch) / regular * 100)`).

---

## 5. All Course Pricing Changes

- **Base Course Fees Preserved:** 100% of canonical base regular fees (e.g., ₹89,900 for AI Mastery, ₹64,900 for Full Stack) and launch fees (e.g., ₹64,900, ₹44,900) were strictly preserved. Zero unauthorized fee changes occurred.
- **Starting Price Preserved:** The platform-wide starting price of **₹2,900** across catalog filters, metadata, and homepage badges was verified and maintained.
- **Unsupported Payable Amounts Removed:** All speculative tax additions (such as ₹76,582, ₹52,982, ₹32,922, ₹17,582) were eliminated from all FAQs and data structures.

---

## 6. Treatment of the Four Mandatory Regression Cases

| Metric | `ai-mastery` | `ai-assisted-full-stack-web-development` | `ecommerce-growth-marketing-specialist` | `career-launch-placement-readiness-professional` |
|---|---|---|---|---|
| **Academy** | AI & Machine Learning | Programming & Development | Digital Marketing | Career Development |
| **Regular Fee** | ₹89,900 | ₹64,900 | ₹34,900 | ₹19,900 |
| **Launch Fee** | ₹64,900 | ₹44,900 | ₹27,900 | ₹14,900 |
| **Discount** | 28% OFF | 31% OFF | 20% OFF | 25% OFF |
| **Pre-Audit Hero** | 18% GST included | 18% GST included | 18% GST included | 18% GST included |
| **Post-Audit Hero** | Neutral Disclosure | Neutral Disclosure | Neutral Disclosure | Neutral Disclosure |
| **Pre-Audit FAQ** | ₹76,582 (₹11,682 GST extra) | ₹52,982 (₹8,082 GST extra) | ₹32,922 (₹5,022 GST extra) | ₹17,582 (₹2,682 GST extra) |
| **Post-Audit FAQ** | Neutral Disclosure | Neutral Disclosure | Neutral Disclosure | Neutral Disclosure |
| **Payable Amount** | Pending Finance Approval | Pending Finance Approval | Pending Finance Approval | Pending Finance Approval |

---

## 7. Disclosures Updated

### 7.1 Single Unified Neutral Disclosure
The authoritative string:
> *"The final payable amount, including any applicable taxes, will be clearly displayed before payment."*

is now rendered consistently in:
1. Dynamic course detail hero sidebar (`#detail-emi`).
2. Pre-rendered course detail hero sidebar (`_rendered_courses/*.html`).
3. Edge/SSR bundle (`functions/_rendered_courses.js`).
4. All course FAQ tuition answers across all 109 courses (`data/courses/*.json` and `data/curricula/*.json`).

### 7.2 Currency and Number Formatting
Standard Indian Rupee formatting (`Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })`) is uniformly applied via `NovaCourseData.formatCoursePrice()`.

---

## 8. Validation Results

A rigorous automated test script was created: `scripts/validate-course-pricing.js` and registered as `npm run validate:pricing`.

### 8.1 Pricing Validator Execution
```text
> novaskills-website@1.0.0 validate:pricing
> node scripts/validate-course-pricing.js

Running comprehensive P0-5 Course Pricing & Tax Disclosure Validation...
[PASS] course-data.js exported pricing methods verified.
[PASS] Canonical courses.json (109 courses) pricing schema verified.
[PASS] All 109 individual course files validated.
[PASS] All 109 curriculum FAQ files validated for tax disclosure consistency.
[PASS] Four mandatory regression cases validated against canonical pricing rules.
[PASS] Pre-rendered course pages (109 files) validated for consistent hero tax disclosure.
[PASS] No conflicting 'GST extra' or 'GST included' remains on active course pages.

============================================================
P0-5 Pricing Validation Summary:
Total Checks Executed : 16,494
Checks Passed         : 16,494
Checks Failed         : 0
============================================================
```

### 8.2 Canonical Schema & Integrity Validator Execution
```text
> novaskills-website@1.0.0 validate:courses
> node scripts/validate-course-data.js

============================================================
Validation Summary:
Files Checked : 221
Total Checks  : 6,344
Passed        : 6,344
Failed        : 0
============================================================
```

### 8.3 Sitewide Regression Suite Execution
```text
> node scripts/test-sitewide-109-pricing-audit.js
Total Courses Audited: 109
All regression and consistency assertions passed: 29 / 29 checks passed.
```

---

## 9. Pre-rendered and Dynamic Template Changes

1. **`js/course-data.js`:**
   - Implemented `NEUTRAL_TAX_DISCLOSURE`.
   - Implemented `getCoursePricing(course)`.
   - Implemented `calculateCourseTax(course)`.
   - Implemented `getCourseTotalPayable(course)`.
   - Implemented `formatCoursePrice(amount)`.
   - Implemented `getGstDisclosure(course)`.
   - Implemented `getDiscountPercentage(course)`.
   - Updated `toRuntimeCourse()` to normalize `tax`, `gst`, `payable`, and `discount`.
2. **`course-detail.html`:**
   - Updated static placeholder in `#detail-emi` to display the neutral disclosure.
3. **`course-detail.js`:**
   - Refactored `renderDetail(course)` to call `NovaCourseData.getGstDisclosure(course)`.
4. **`scripts/build-course-pages.js`:**
   - Updated static HTML pre-renderer to call `NovaCourseData.getGstDisclosure(baseCourse)`.
5. **Rebuilt 109 Static Pages:**
   - Executed `node scripts/build-course-pages.js` regenerating all static pages in `_rendered_courses/*.html`.

---

## 10. Edge Function / SSR Alignment

- Rebuilt `functions/_rendered_courses.js` (20.26 MB) from the unified `build-course-pages.js` generator.
- Verified that serverless Cloudflare Pages function serves identical pre-rendered hero pricing and neutral disclosures as the client-side JavaScript engine.

---

## 11. Build Verification

- Rebuilt canonical runtime data: `node scripts/build-canonical-data.js` -> `data.js` (109 courses, 12 academies).
- Minified core runtime scripts: `node scripts/build_min_js.js` -> `js/data.min.js`, `js/course-data.min.js`, `js/course-detail.min.js`.
- Verified clean compilation with zero syntax or runtime errors.

---

## 12. Outstanding Policy Signoffs Required

As documented in `docs/p0-5-gst-policy-approval-required.md`:
1. **Executive & Finance Decision:** Formal sign-off on Option A (GST Inclusive) vs. Option B (GST Exclusive) vs. Option C (Hybrid B2C Inclusive / B2B Exclusive).
2. **Post-Approval Action:** Once written approval is received:
   - Change `treatment` from `"pending-approval"` to `"included"` or `"extra"` in canonical data.
   - Run the automated recalculation pipeline to populate `pricing.tax.amount` and `pricing.payable.*`.
   - Rebuild pre-rendered pages and edge functions.
