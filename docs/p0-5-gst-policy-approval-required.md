# NOVA SKILLS — GST POLICY APPROVAL REQUIRED
## Formal Institutional Review & Finance Sign-Off Request

**Project:** Nova Skills  
**Task ID:** P0-5  
**Priority:** P0 — Critical  
**Target Branch:** `development`  
**Date:** November 13, 2026  
**Status:** Action Required by Executive & Finance Leadership  

---

## 1. Executive Summary

During the P0-5 Commercial Data & Pricing Consistency audit across all 109 published Nova Skills courses, a sitewide contradiction was identified between marketing hero components (which advertised "18% GST included") and curriculum FAQ components (which stated "statutory 18% GST extra" and calculated additional tax on top of advertised fees).

In strict adherence to P0-5 implementation governance:
1. **No tax policy was invented.** Because no official finance fee master, signed billing charter, or payment gateway tax rules exist in the repository, the engineering team has not made an unauthorized assumption regarding whether Nova Skills fees are tax-inclusive or tax-exclusive.
2. **Neutral Interim Disclosure Implemented:** All 109 courses now present the approved neutral interim disclosure across all hero cards, curriculum FAQs, and pre-rendered templates:
   > *"The final payable amount, including any applicable taxes, will be clearly displayed before payment."*
3. **Data Schema State:** All 109 course records in `data/courses.json` and individual course definitions have their `pricing.tax.treatment` set to `"pending-approval"`, with numerical tax and total payable values set to `null` to avoid publishing unapproved figures.

This document formally requests executive and finance leadership to review the options below and provide an authoritative decision.

---

## 2. Statutory & Commercial Context

### 2.1 Indian GST Framework (SAC 9992 — Education & Training Services)
- Commercial vocational training and non-formal skill-enhancement courses in India generally attract Goods and Services Tax (GST) at the standard rate of **18%** (9% CGST + 9% SGST for intra-state, or 18% IGST for inter-state transactions).
- Certain government-funded skilling initiatives or approved vocational councils receive exemptions under notification no. 12/2017-Central Tax (Rate); however, private vocational and ed-tech bootcamps are taxable unless specific exemption criteria are formally met.

### 2.2 Consumer Protection & Price Transparency
- The Consumer Protection (E-Commerce) Rules and ASCI guidelines mandate that consumers should not encounter unexpected mandatory fees at checkout.
- Clear upfront disclosure of whether displayed prices include or exclude statutory taxes is essential to maintain high trust and avoid legal exposure.

---

## 3. Commercial Policy Options for Consideration

Executive leadership and the Finance Directorate must select one of the following pricing models:

### Option A: GST Inclusive Pricing (Recommended for B2C Conversion)
* **Model:** The advertised Launch Fee is the total payable amount paid by the student. The 18% GST is treated as embedded within the fee.
* **Mathematical Calculation:**
  $$\text{Base Taxable Fee} = \frac{\text{Advertised Launch Fee}}{1.18}$$
  $$\text{GST (18%)} = \text{Advertised Launch Fee} - \text{Base Taxable Fee}$$
* **Example (`ai-mastery`):**
  - Advertised Launch Fee: ₹64,900
  - Base Taxable Amount: ₹55,000
  - 18% GST (CGST+SGST): ₹9,900
  - Total Payable by Candidate: **₹64,900**
* **Advantages:**
  - Zero "sticker shock" during counsellor calls or checkout.
  - Maximizes conversion rate and aligns with standard retail ed-tech expectations.
  - Matches the original hero card marketing positioning ("18% GST included").
* **Financial Impact:**
  - Net revenue per student is ~15.25% lower than the face launch fee.

---

### Option B: GST Exclusive Pricing (Higher Net Realization)
* **Model:** The advertised Launch Fee represents the base tuition fee only. 18% GST is added on top during billing.
* **Mathematical Calculation:**
  $$\text{Total Payable} = \text{Advertised Launch Fee} \times 1.18$$
* **Example (`ai-mastery`):**
  - Advertised Launch Fee: ₹64,900
  - 18% GST: ₹11,682
  - Total Payable by Candidate: **₹76,582**
* **Advantages:**
  - Preserves 100% of the face launch fee as net operating revenue.
  - Matches the fee calculation format previously written into several curriculum FAQs.
* **Financial Impact:**
  - Candidates face an 18% price increase upon receiving the proforma invoice or admission link.
  - Requires clear UI badges such as `+ 18% GST applicable at billing`.

---

### Option C: Segmented / Dual Model
* **Model:** Individual B2C students receive GST-inclusive pricing, while B2B corporate sponsorships or employer-reimbursed candidates receive GST-exclusive invoicing allowing input tax credit (ITC) claims.

---

## 4. Policy Impact Comparison on Four Mandatory Regression Courses

| Course ID | Course Title | Launch Fee | Option A: Inclusive (Total Payable) | Option B: Exclusive (Total Payable) | Delta per Enrolment |
|---|---|---:|---:|---:|---:|
| `ai-mastery` | AI Solutions Engineering & Agentic AI Mastery | ₹64,900 | **₹64,900** (GST ₹9,900 incl.) | **₹76,582** (+ ₹11,682 GST) | +₹11,682 |
| `ai-assisted-full-stack-web-development` | AI-Assisted Full Stack Web Development | ₹44,900 | **₹44,900** (GST ₹6,849 incl.) | **₹52,982** (+ ₹8,082 GST) | +₹8,082 |
| `ecommerce-growth-marketing-specialist` | E-Commerce & Growth Marketing Specialist | ₹27,900 | **₹27,900** (GST ₹4,256 incl.) | **₹32,922** (+ ₹5,022 GST) | +₹5,022 |
| `career-launch-placement-readiness-professional` | Career Launch & Placement Readiness Professional | ₹14,900 | **₹14,900** (GST ₹2,273 incl.) | **₹17,582** (+ ₹2,682 GST) | +₹2,682 |

---

## 5. Technical Implementation Readiness

The codebase has been refactored under P0-5 to make post-approval migration immediate and fully automated:
1. **Central Engine (`js/course-data.js`):** The shared pricing utility functions (`calculateCourseTax`, `getCourseTotalPayable`, `getGstDisclosure`) support `'included'`, `'extra'`, and `'pending-approval'` seamlessly.
2. **Canonical Data (`data/courses.json`):** Updating the schema simply requires changing `treatment` to `'included'` or `'extra'` and regenerating via `node scripts/build-canonical-data.js`.
3. **Automated Validation (`npm run validate:pricing`):** The validator verifies tax math, disclosure matching, and payable calculations across all 109 courses in under 2 seconds.

---

## 6. Required Leadership Actions & Sign-Off

To finalize the commercial policy:

1. **Finance Directorate Sign-Off:**
   - [ ] Approved Policy: **Option A (Inclusive)** / **Option B (Exclusive)** / **Option C (Segmented)**
   - GSTIN to be printed on receipts: `_________________________`
   - Signed by Chief Financial Officer / Head of Finance: `_________________________` Date: `__________`

2. **Executive Director Sign-Off:**
   - Approved for website-wide implementation.
   - Signed by Managing Director / Chief Executive: `_________________________` Date: `__________`

*Upon receiving formal written sign-off, the engineering team will execute the automated migration script and update `pricing.tax.treatment` across the canonical catalog.*
