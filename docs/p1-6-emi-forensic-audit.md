# P1-6 Forensic Audit: Course EMI, Financing Claims & Monthly Installments

**Project:** Nova Skills  
**Task ID:** P1-6  
**Date:** November 13, 2026  
**Auditor:** Antigravity Engineering & Compliance Audit  
**Scope:** Repository-wide audit of all 109 published courses across 12 academies, homepage, catalog, academy landing pages, contact pages, and cloud worker datasets.

---

## 1. Executive Summary & Audit Context

Prospective students evaluating vocational and technology education must understand three distinct commercial realities before committing:
1. **Tuition Fee Inclusions:** Exactly what educational services, mentoring, assessments, and materials the tuition fee covers.
2. **Financing & Payment Plans:** The genuine financing or installment arrangements available, along with applicable tenures, down payments, interest/subvention terms, and lender eligibility.
3. **Third-Party Tool & Usage Costs:** Any additional expenses for third-party software licenses, cloud infrastructure, AI model API credits, domain registrations, or commercial advertising spend.

Prior to P1-6, the Nova Skills codebase contained a legacy pattern of client-side algorithmic calculations that manufactured misleading monthly installment numbers, coupled with unqualified "0% EMI" claims. While P0-5 successfully harmonized the course tuition base and standardized statutory GST disclosures, the underlying financing mechanics and tool-cost policies required rigorous verification.

---

## 2. Inventory of Existing EMI Claims & Findings

### 2.1 The Algorithmic Division Bug (Origin of Conflicting Figures)
A forensic review of the git commit history (`0faef6d`, `d9f2c38`, `bb4a7e5`) revealed that early course detail templates derived monthly installments via an unverified client-side formula:
$$\text{Displayed Monthly EMI} = \left\lceil \frac{\text{Course Launch Fee} \times 1.18}{\text{Course Duration in Months}} \right\rceil$$

This formula created severe consumer-facing contradictions:
- **Priority Case A (AI Mastery — `ai-mastery`):**
  - In earlier iterations with a ₹39,999 listed price:
    - Hero displayed: `₹7,866/month` derived from $\lceil (39,999 \times 1.18) / 6 \text{ months} \rceil = 7,866.47$.
    - FAQ displayed: `₹3,999/month` derived from handcrafted editorial division $39,999 / 10 \text{ months} = 3,999.90$.
    - Neither figure corresponded to an executed lender agreement, subvention schedule, or approved banking contract.
  - In subsequent canonical pricing updates (Launch Fee: ₹64,900, Statutory 18% GST extra; Total: ₹76,582):
    - Some curriculum JSONs had `₹11,787/month for 9 months` calculated on regular price ₹89,900 ($\lceil 106,082 / 9 \rceil = 11,787$).
- **Priority Case C (Short Courses — Duration $\le 6$ Weeks):**
  - Short 1-month and 6-week courses (e.g., `html-css`, `git-github`, `canva-pro`, `chatgpt-mastery`, `email-marketing`, `scratch-programming`):
    - Course fee ₹4,999 was rendered with `₹5,899/month EMI` ($\lceil 4,999 \times 1.18 \rceil = 5,899$).
    - Course fee ₹3,999 was rendered with `₹4,719/month EMI` ($\lceil 3,999 \times 1.18 \rceil = 4,719$).
    - **Finding:** The full one-time course fee (with GST) was presented as a "monthly installment"! For a 1-month course, a single lump-sum enrollment payment was mislabeled as a recurring monthly EMI.

### 2.2 Priority Case B: Homepage 0% EMI Claim
In `index.html` (lines 1870–1874):
> *"What is the fee structure and are EMI options available? Course fees range from ₹2,900 for individual short courses up to ₹64,900 for comprehensive mastery programmes. Yes, we offer 0% EMI options through our banking partners."*

**Forensic Deficiencies:**
1. **Unqualified Scope:** Implies that all 109 courses qualify for 0% EMI, including ₹2,900 single-module micro-credentials. In banking reality, consumer financing partners typically enforce a minimum transaction threshold (e.g., ₹10,000 to ₹15,000).
2. **Missing Partner Disclosures:** Mentions "our banking partners" without identifying approved payment aggregators (e.g., Razorpay / Cashfree) or lending partners.
3. **Undisclosed Processing Fees & Terms:** Does not clarify whether card-based subvention (No-Cost EMI) requires customer-borne processing fees, specific bank credit/debit cards, or lender credit approval.
4. **Failure to Distinguish Financing Types:** Fails to distinguish between:
   - **Bank No-Cost EMI:** Third-party loan where Nova Skills absorbs the interest via merchant subvention.
   - **Low-Cost Standard EMI:** Standard credit card installment where the customer pays prevailing bank interest (13%–16% p.a.).
   - **Institute Payment Plan:** Internal milestone-based installment schedule offered directly by Nova Skills without a third-party loan.

---

## 3. Comprehensive Course Duration & Financing Eligibility Audit

An audit of all 109 published courses establishes three commercial duration categories:

| Duration Tier | Course Count | Example Courses | Fee Range (Launch) | Financing Eligibility Policy |
|---|---|---|---|---|
| **Tier 1: Short Courses** ($\le 6$ weeks) | 56 Courses | `chatgpt-mastery`, `canva-pro`, `html-css`, `git-github`, `sql-basics`, `reels-editing` | ₹2,900 – ₹10,900 | **Single Payment Only.** Mislabeled monthly EMI removed. Not eligible for multi-month bank financing due to minimum lender thresholds. |
| **Tier 2: Medium Programs** (2 to 4 months) | 38 Courses | `dm-professional`, `ai-productivity`, `graphic-design-pro`, `biz-productivity` | ₹12,900 – ₹29,900 | **Eligible for 2–3 Stage Payment Plans or Bank EMI** subject to payment aggregator gateway approval. |
| **Tier 3: Flagship Mastery Programs** ($\ge 5$ months) | 15 Courses | `ai-mastery`, `fullstack-foundation`, `ai-assisted-full-stack-web-development`, `dm-mastery`, `creative-design`, `ecommerce-mastery` | ₹39,900 – ₹64,900 | **Eligible for Multi-Month Milestone Plans & Bank EMI** (3, 6, 9, or 12 months) subject to lender credit verification. |

---

## 4. Audit of FAQ Overwrites (P0-5 Legacy Side-Effect)

During previous automated pricing synchronization, an overly broad regular expression (`/fee|cost|emi/i`) inadvertently matched non-fee questions across 94 curriculum files in `data/curricula/*.json`:
- `Are there high cloud infrastructure or GPU hosting costs during the program?` (`ai-mastery.json`)
- `Is the Adobe subscription included in the fee?` (`adobe-premiere-pro.json`)
- `Will I learn accessible slide design?` (`microsoft-powerpoint.json`)
- `What about OpenAI and Anthropic API token costs during labs?` (`ai-for-business-pro.json`)
- `Are all AI tools and premium licenses included?` (`business-english.json`)

These questions had their informative technical and software answers overwritten with the generic tuition paragraph:
`"The approved regular tuition fee for [Course] is ₹XX,XXX. Under our current introductory launch offer..."`

**Resolution Required:** Restore original domain-specific answers from `nova-skills-109-course-content.json` while maintaining strictly compliant P0-5 pricing figures on genuine fee questions.

---

## 5. Required Repository Remediations

1. **Centralize Financing Registry (`data/financing-options.json`):**
   - Formalize the 3 financing models: Bank No-Cost EMI (eligible courses $\ge$ ₹15,000), Standard Low-Cost Bank EMI, and Institute Milestone Installment Plans.
   - Establish explicit eligibility criteria, minimum transaction thresholds, and clear disclaimers that final approvals rest with the financing provider.
2. **Homepage & Contact FAQ Updates:**
   - Update `index.html` (lines 1870–1874) and `contact/index.html` (lines 944–950) with transparent, approved wording that avoids blanket "0% EMI" promises.
3. **Course Detail Sticky Card (`course-detail.js` & `scripts/build-course-pages.js`):**
   - For Short Courses ($\le 6$ weeks): Display `💳 One-time course enrollment fee · [GST Disclosure]`.
   - For Multi-Month Programs ($\ge 2$ months): Display `💳 Flexible installment & payment options available · [GST Disclosure]`.
4. **Restore Technical FAQ Answers:**
   - Programmatically revert the 94 overwritten non-fee FAQs across `data/curricula/*.json` and `data/courses/*.json` using `nova-skills-109-course-content.json`.
5. **AI Career Advisor Governance (`worker/src/data/faq.json`, `worker/src/services/prompt.js`, `nova-ai-widget.js`):**
   - Neutralize unverified promises of "guaranteed 0% interest for all students" to reflect actual lender eligibility conditions.
