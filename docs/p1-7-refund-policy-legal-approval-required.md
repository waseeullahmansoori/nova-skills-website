# P1-7 Refund Policy Legal Approval & Governance Register

**Project:** Nova Skills  
**Task ID:** P1-7  
**Date:** November 13, 2026  
**Status:** Pending Formal Legal & Management Determination  
**Scope:** Register of legal ambiguities, conflicting policy clauses, and operational questions identified during the P1-7 audit that require qualified legal counsel and executive management sign-off before altering published policy terms.

---

## 1. Governance Principles

In accordance with consumer protection mandates (Consumer Protection Act 2019, Consumer Protection E-Commerce Rules 2020), digital educational institutions must ensure that contractual terms are fair, unambiguous, and prominently disclosed.

Development teams are strictly prohibited from rewriting, reinterpreting, or modifying legal terms through frontend code changes. All items listed below are formally recorded for executive review. Until approved amendments are executed, the website maintains strict fidelity to the published text of Version 1.0 (July 29, 2026).

---

## 2. Issues Requiring Formal Legal & Management Approval

### Item 1: Interaction Between Promotional Pricing and General Refund Rights
- **Relevant Clauses:** Section 3A/3B (Eligible refunds 100% or 90%) versus Section 4 (Discounted, promotional and scholarship enrolments are strictly non-refundable).
- **Ambiguity:** Virtually all Nova Skills courses currently publish an introductory "Launch Price" (e.g., ₹64,900 launch fee vs ₹89,900 regular fee on `ai-mastery`).
- **Question for Counsel:** Does enrolling at an approved launch fee classify a student as a "discounted or promotional enrolment" under Section 4, thereby waiving all cooling-off rights under Section 3B? Or does Section 4 apply solely to special ad-hoc marketing promo codes, flash sales, and institutional fee waivers?
- **Current Development Stance:** Neutral disclosure linking to the published policy; no blanket claim that launch-priced courses are eligible or ineligible.

### Item 2: Scholarship Enrolment Non-Refundable Scope
- **Relevant Clauses:** Section 4 lists "Scholarship Enrollments" as non-refundable.
- **Question for Counsel:** Does this restriction apply only to partial scholarship recipients who paid a subsidized balance, or also to corporate-sponsored students? If a scholarship student withdraws before batch start, is any portion of paid fees refundable?
- **Current Development Stance:** Maintained strictly as non-refundable as stated in published Section 4.

### Item 3: Exact Calculation of Initial Registration Fee
- **Relevant Clauses:** Section 2 defines the registration deposit as *"typically 10% to 15% of the total course fee or up to ₹1,000"*.
- **Question for Counsel:** Does "or up to ₹1,000" represent a maximum cap on the deposit across all courses (including high-value programs like ₹64,900), or does it apply only to short courses?
- **Current Development Stance:** No automatic calculator is deployed; disclosures refer to "administrative registration deductions as specified in the official policy".

### Item 4: Administrative Fee Cap Under Section 3A
- **Relevant Clauses:** Section 3A specifies deduction is *"capped at ₹1,000 or 10% of total fee, whichever is lower"*.
- **Question for Counsel:** For a course of ₹34,900, 10% is ₹3,490, which means "whichever is lower" will always default to ₹1,000. Is the intended deduction a flat ₹1,000 administrative fee for all cancellations submitted $\ge 7$ days prior?
- **Current Development Stance:** Disclosed verbatim from Section 3A without mathematical extrapolation.

### Item 5: Scope of 48-Hour Cooling-Off Window (Section 3B)
- **Relevant Clauses:** Section 3B grants a 48-hour cooling-off window if registration occurs within 7 days of batch start.
- **Question for Counsel:** If a student registers 30 days before batch start, do they also receive a 48-hour cooling-off window, or are they governed exclusively by Section 3A (100% tuition refund minus admin fee)?
- **Current Development Stance:** Verbatim disclosure of the 48-hour window for enrollments within 7 days of launch.

### Item 6: Treatment of Registration Deposit vs Remaining Tuition
- **Relevant Clauses:** Section 2 and Section 3A distinguish the non-refundable registration deposit from refundable tuition.
- **Question for Counsel:** If a student has only paid a seat reservation deposit (e.g. ₹1,000 or 10%) and requests cancellation $\ge 7$ days before batch launch, is any portion refunded, or is the deposit 100% forfeited?
- **Current Development Stance:** The seat-booking deposit is identified as non-refundable in pre-enrolment notices.

### Item 7: Refund Rules for Installment and EMI Payments
- **Relevant Clauses:** Section 2 mentions integrated payment gateways and installment plans.
- **Question for Counsel:** If a student enrolled via bank credit card EMI or a 2-part milestone plan requests a refund under Section 3A or 3B, how are bank interest subventions and processing fees handled?
- **Current Development Stance:** Policy states refunds are credited to the original source account; bank processing times and non-refundable bank processing fees are noted.

### Item 8: Institute Cancellation vs Promotional Enrolments
- **Relevant Clauses:** Section 5 (100% full refund if Nova Skills cancels or delays batch by > 14 days) versus Section 4 (promotional enrolments are non-refundable).
- **Question for Counsel:** In the event of an institute-initiated cancellation or 14-day delay, does Section 5 override Section 4 for promotional/discounted enrolments? (Statutory consumer law requires full refunds when the vendor fails to perform).
- **Current Development Stance:** Institute cancellation under Section 5 is presented as a universal guarantee (100% refund without deduction).

### Item 9: Pre-Batch LMS Access Activation
- **Relevant Clauses:** Section 4 states fees are non-refundable once LMS access has been activated or accessed.
- **Question for Counsel:** If student credentials and preparatory onboarding materials are auto-emailed upon enrolment 10 days before batch launch, does student login immediately extinguish refund eligibility under Section 3A?
- **Current Development Stance:** Explicitly advised to prospective students that LMS activation triggers non-refundable status.

### Item 10: Exceptions and Batch-Transfer Operational Guidelines
- **Relevant Clauses:** Section 3C permits a free one-time batch transfer within 6 months for personal emergencies.
- **Question for Counsel:** What documentation is required to verify a "medical or personal emergency"? Can an emergency batch transfer request be made after batch launch?
- **Current Development Stance:** Disclosed as available prior to batch launch upon written application to admissions.

---

## 3. Formal Sign-Off Workflow

Prior to publishing any revision to `refund-policy/index.html` (Version 2.0):
1. **Legal Counsel Review:** Qualified Indian legal counsel must review the proposed amendments against Consumer Protection (E-Commerce) Rules 2020.
2. **Admissions & Finance Director Approval:** Written confirmation of the mathematical fee deductions and gateway disbursement procedures.
3. **Version Increment:** Publish with new version number (e.g. Version 1.1 or 2.0) and revised Effective Date.
4. **CRM & Audit Trail Update:** Ensure all newly captured enrolment acknowledgements reference the revised version identifier.
