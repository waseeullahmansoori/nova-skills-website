# P1-6 Financing Approval & External Partner Agreement Register

**Project:** Nova Skills  
**Task ID:** P1-6  
**Date:** November 13, 2026  
**Status:** Audit & Compliance Register  
**Scope:** Repository-wide audit of all external financing representations, bank partner references, No-Cost EMI claims, and installment plans across Nova Skills marketing channels.

---

## 1. Regulatory & Compliance Context

Under Indian consumer protection guidelines (Consumer Protection Act 2019 and Reserve Bank of India Fair Lending Practices), educational institutes and digital training providers may not advertise financing offers, zero-percent interest schemes, or bank partnerships unless backed by verified, legally binding agreements.

Specifically:
1. **"No-Cost EMI" Schemes:** The Reserve Bank of India (RBI Circular DBOD.Dir.BC.No.38/13.03.00/2013-14) stipulates that zero-percent loans where interest is merely disguised or shifted into processing fees or vendor subvention must be fully disclosed. If an educational subvention agreement does not exist with the lender, an institute cannot claim "0% EMI".
2. **Bank Partner Endorsements:** Advertising names of specific schedule commercial banks (e.g., HDFC, ICICI, Axis, SBI) or non-banking financial companies (NBFCs like LiquiLoans, Propelld, Eduvanz) requires active merchant onboarding and written approval.
3. **Tenure and Minimum Values:** Payment aggregators (Razorpay, Cashfree, PayU) enforce minimum transaction thresholds (typically ₹3,000 to ₹5,000 for credit card EMI, and ₹10,000 to ₹15,000 for cardless/NBFC education loans). Short courses cannot be advertised as eligible for long-tenure financing.

---

## 2. Register of Financing Claims & Approval Status

The following matrix documents every financing model and copy representation previously identified across the Nova Skills website, their risk level, required approvals, and corrective actions implemented under P1-6.

| Claim / Model | Previous Location(s) | Pre-Audit Text | Risk Level | Required External Approvals | P1-6 Corrective Action |
|---|---|---|---|---|---|
| **Sitewide 0% EMI Claim** | `index.html` (FAQ), `contact/index.html` | *"Yes, we offer 0% EMI options through our banking partners."* | **HIGH** | Written subvention agreements with specific commercial banks or merchant aggregator (Razorpay/PayU). | **Neutralized:** Replaced with compliant qualification: *"Flexible installment and card EMI options are available through participating banking partners at payment checkout, subject to credit eligibility and bank processing terms."* |
| **Short-Course "Monthly EMI"** | `course-detail.js` (Dynamic client calculation on all 56 short courses) | e.g. *"EMI from ₹4,719/mo"* or *"EMI from ₹5,899/mo"* | **HIGH** | None exists. Gateway transaction minimums and short duration make multi-month consumer financing inapplicable for 4-to-6 week courses. | **Eliminated:** Sticky card updated to *"One-time course enrollment fee · 18% GST extra at checkout"* for all 56 Tier 1 courses. |
| **AI Mastery 10-Month / ₹3,999 Claim** | `ai-mastery` FAQ #20 (historical text) | *"EMI options starting at ₹3,999/month for 10 months."* | **CRITICAL** | Subvention agreement for ₹39,999 or ₹64,900 over 10 months. | **Eliminated:** Derived from unverified historical math ($39,999 / 10$). Replaced with structured 3-stage milestone plan and partner gateway card EMI options. |
| **AI Productivity 9-Month ₹2,609 Claim** | `ai-productivity` FAQ #1 | *"No-Cost EMI options starting at INR 2,609/month for 9 months"* | **HIGH** | Active merchant subvention agreement for 9-month tenure on ₹19,900 fee. | **Corrected:** Neutralized to standard gateway financing availability disclosure. |
| **Bank Name Mentions** | Chatbot prompt (`worker/src/services/prompt.js`), FAQ copy | *"HDFC, ICICI, Axis Bank No-Cost EMI"* | **MEDIUM** | Commercial partner agreements with named banking entities. | **Replaced:** Generalized to *"participating credit and debit card issuing banks supported via payment gateway checkout"*. |
| **Institutional Milestone Plans** | Course FAQs (Tier 2 and Tier 3) | *"Modular stage-based installment payment options are available upon institutional approval."* | **LOW** | Internal Nova Skills management policy and admissions verification guidelines. | **Standardized:** Formally documented in `data/financing-options.json` as a 2-part milestone (Tier 2) or 3-part milestone (Tier 3), subject to admissions approval. |

---

## 3. Approved Financing Tiers & Eligibility Framework

Under P1-6, all courses are strictly assigned to one of three financing tiers based on program duration and tuition scale:

### Tier 1: Short Certifications (≤ 6 Weeks)
- **Course Count:** 56 courses.
- **Tuition Range:** ₹2,900 to ₹10,900.
- **Financing Model:** Single-payment enrollment.
- **Permitted Marketing Copy:**
  - *"Tuition for this intensive short certification is payable as a one-time enrollment fee."*
  - *"Standard credit card and debit card installment options are supported at checkout via payment gateway partners, subject to cardholder credit limits and issuing bank terms."*
- **Prohibited Marketing Copy:**
  - No "₹X/month EMI" labels.
  - No "No-Cost EMI" badges.
  - No claims of institutional financing.

### Tier 2: Mid-Length Professional Programs (2 to 4 Months)
- **Course Count:** 38 courses.
- **Tuition Range:** ₹9,900 to ₹39,900.
- **Financing Model:** 2-part milestone plan or payment gateway card EMI (3 or 6 months).
- **Permitted Marketing Copy:**
  - *"Flexible payment options are available, including a 2-part milestone plan upon admissions approval, as well as 3 to 6-month card EMI options through participating banks at payment checkout."*
- **Prohibited Marketing Copy:**
  - No unverified subvention claims or 0% interest without bank approval disclosure.

### Tier 3: Comprehensive Mastery Programs (≥ 5 Months)
- **Course Count:** 15 courses.
- **Tuition Range:** ₹29,900 to ₹64,900.
- **Financing Model:** Structured 3-stage milestone plan or 6 to 9-month partner EMI.
- **Permitted Marketing Copy:**
  - *"Flexible financing options are available for comprehensive programs, including structured 3-stage milestone payment schedules upon admissions approval, and institutional 6 to 9-month EMI plans through partner payment gateways. All financing terms are subject to standard verification and lender approval."*

---

## 4. Verification Checklists for Future Partner Onboarding

Before any specific banking partner, NBFC, or "No-Cost EMI" brand may be published on the Nova Skills website in the future, the following documentation must be signed and on file:

1. **Merchant Subvention Agreement:** Executed contract detailing the exact interest discount percentage borne by Nova Skills versus the student.
2. **Processing Fee Disclosure:** Clear schedule of any one-time processing charges (e.g., ₹199 + GST) levied by the lender.
3. **Credit Verification Terms:** Explicit disclosure of minimum CIBIL/credit score, documentation requirements (Aadhaar, PAN, bank statements), and rejection policies.
4. **Cancellation and Refund Terms:** Alignment between Nova Skills refund policies and loan cancellation windows with the financing partner.
