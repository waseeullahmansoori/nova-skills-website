# P1-6 Course Cost Disclosure & Financing Schema Specification

**Project:** Nova Skills  
**Task ID:** P1-6  
**Date:** November 13, 2026  
**Status:** Approved Specification  
**Scope:** Repository-wide architecture for commercial transparency, course pricing disclosures, four-pillar cost breakdowns, and financing rules.

---

## 1. Objectives & Guiding Principles

Prospective students evaluating Nova Skills courses require complete, unambiguous financial transparency before enrolling. To prevent deceptive marketing, hidden fees, and post-enrollment financial friction, Nova Skills establishes the following non-negotiable principles:

1. **Approved Tuition Fee Truth:** Tuition fees, regular reference prices, and launch discounts are governed strictly by the P0-5 verified pricing registry (`data.js` / `NS_COURSES`). No script or component may calculate, display, or invent unverified fees.
2. **Statutory Tax Transparency:** Goods and Services Tax (GST) is always disclosed at the statutory 18% rate with exact rupee calculations: `Total Payable = Base Fee + (Base Fee * 18%)`. Tax invoices with Input Tax Credit (ITC) eligibility must be clearly offered for corporate or business enrollments.
3. **Four-Pillar Cost Model:** Every course detail page must clearly articulate the 4 distinct financial pillars:
   - **Pillar 1 — Included in Tuition:** What the student's tuition fee covers (instruction, lab access, project grading, certificates, community, LMS, career support).
   - **Pillar 2 — Free Tools & Student Accounts (₹0 Additional Cost):** The verified free tiers, student accounts, and open-source tools that guarantee 100% of assignments and portfolio pieces can be completed with zero mandatory external expenses.
   - **Pillar 3 — Optional Premium Services:** Advanced productivity tools (e.g., Cursor Pro, ChatGPT Plus, Midjourney) that students may optionally choose, accompanied by explicit notes that zero-cost alternatives are taught in class.
   - **Pillar 4 — Usage-Based & External Expenses:** Discretionary costs (such as custom domains or commercial API volume) that arise only if students choose to deploy live external customer-facing services.
4. **Duration-Tiered Financing Transparency:**
   - **Tier 1 (≤ 6 weeks):** Paid as a single enrollment fee. No unverified "monthly EMI" figures (such as ₹4,719/mo for a 4-week course) may be advertised. Card installment options through payment gateways are clearly marked as subject to issuing bank approval.
   - **Tier 2 (2–4 months):** Eligible for 2-stage milestone plans or standard bank credit card EMI subject to cardholder limits.
   - **Tier 3 (≥ 5 months):** Comprehensive flagship programs eligible for structured 3-stage milestone plans and partner payment gateway EMI options (3, 6, 9 months).
5. **No Deceptive 0% Claims:** Blanket claims of "0% EMI across all courses" are eliminated. All financing copy specifies participating partner banks, minimum transaction values, tenure availability, and non-refundable processing fees where applicable.

---

## 2. Four-Pillar Cost Disclosure Schema

Each course detail page incorporates a structured `#cost-transparency-section` positioned immediately following the curriculum/projects sections and preceding the course FAQ.

### 2.1 JSON Schema Representation

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "CourseCostTransparency",
  "type": "object",
  "required": [
    "courseId",
    "tuition",
    "pillar1_includedInTuition",
    "pillar2_freeTools",
    "pillar3_optionalPremium",
    "pillar4_usageBasedExpenses",
    "financingTier"
  ],
  "properties": {
    "courseId": { "type": "string" },
    "tuition": {
      "type": "object",
      "required": ["regularFee", "launchFee", "gstPercentage", "gstAmount", "totalPayable"],
      "properties": {
        "regularFee": { "type": "integer" },
        "launchFee": { "type": "integer" },
        "gstPercentage": { "type": "number", "const": 18 },
        "gstAmount": { "type": "integer" },
        "totalPayable": { "type": "integer" }
      }
    },
    "pillar1_includedInTuition": {
      "type": "array",
      "items": { "type": "string" }
    },
    "pillar2_freeTools": {
      "type": "object",
      "required": ["tools", "guarantee"],
      "properties": {
        "tools": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "accessModel", "details", "studentCost"],
            "properties": {
              "name": { "type": "string" },
              "accessModel": { "type": "string" },
              "details": { "type": "string" },
              "studentCost": { "type": "string", "const": "₹0" }
            }
          }
        },
        "guarantee": { "type": "string" }
      }
    },
    "pillar3_optionalPremium": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "cost", "zeroCostAlternative"],
        "properties": {
          "name": { "type": "string" },
          "cost": { "type": "string" },
          "zeroCostAlternative": { "type": "string" }
        }
      }
    },
    "pillar4_usageBasedExpenses": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["category", "estimatedCost", "freeTierFallback"],
        "properties": {
          "category": { "type": "string" },
          "estimatedCost": { "type": "string" },
          "freeTierFallback": { "type": "string" }
        }
      }
    },
    "financingTier": {
      "type": "string",
      "enum": ["tier1ShortCourses", "tier2MediumPrograms", "tier3MasteryPrograms"]
    }
  }
}
```

---

## 3. UI Component Architecture

### 3.1 Course Detail Section (`#cost-transparency-section`)

The cost transparency component renders as an accessible, high-contrast, multi-card container designed with responsive grid layout:

```html
<section id="cost-transparency-section" class="cost-transparency-section py-16 bg-slate-900 border-t border-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="cost-transparency-header text-center mb-12">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Transparent Commercial Policy
      </span>
      <h2 class="text-3xl font-bold text-white tracking-tight sm:text-4xl">Complete Financial & Tool-Cost Transparency</h2>
      <p class="mt-3 text-lg text-slate-400 max-w-3xl mx-auto">
        Know exactly what your tuition covers before enrolling. Nova Skills guarantees zero hidden fees, zero mandatory software purchases, and transparent financing terms.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Pillar 1: Included in Tuition -->
      <div class="cost-card bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-600 transition-all">
        <div>
          <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg mb-4 border border-blue-500/20">1</div>
          <h3 class="text-xl font-bold text-white mb-2">Included in Tuition</h3>
          <p class="text-xs text-slate-400 mb-4">100% covered by your course enrollment fee.</p>
          <ul class="space-y-2.5 text-sm text-slate-300">
            <!-- Dynamic tuition items -->
          </ul>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-700/60 text-xs text-emerald-400 flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          No hidden coaching or exam charges
        </div>
      </div>

      <!-- Pillar 2: Free Tools & Accounts -->
      <div class="cost-card bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all relative overflow-hidden">
        <div class="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-lg">₹0 Mandatory Spend</div>
        <div>
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4 border border-emerald-500/20">2</div>
          <h3 class="text-xl font-bold text-white mb-2">Free Tools & Accounts</h3>
          <p class="text-xs text-slate-400 mb-4">Every assignment is completable with ₹0 software cost.</p>
          <ul class="space-y-2.5 text-sm text-slate-300">
            <!-- Dynamic tools list with Free Tier badges -->
          </ul>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-700/60 text-xs text-emerald-400 font-medium">
          Zero software purchase required to graduate
        </div>
      </div>

      <!-- Pillar 3: Optional Premium -->
      <div class="cost-card bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-600 transition-all">
        <div>
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg mb-4 border border-purple-500/20">3</div>
          <h3 class="text-xl font-bold text-white mb-2">Optional Premium</h3>
          <p class="text-xs text-slate-400 mb-4">Paid upgrades explored in class. Never required.</p>
          <ul class="space-y-2.5 text-sm text-slate-300">
            <!-- Optional tools with zero-cost alternatives -->
          </ul>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-700/60 text-xs text-purple-300">
          Free classroom equivalents demonstrated
        </div>
      </div>

      <!-- Pillar 4: Usage-Based & External -->
      <div class="cost-card bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-600 transition-all">
        <div>
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg mb-4 border border-amber-500/20">4</div>
          <h3 class="text-xl font-bold text-white mb-2">External / API Costs</h3>
          <p class="text-xs text-slate-400 mb-4">Applicable only if student opts for commercial live scale.</p>
          <ul class="space-y-2.5 text-sm text-slate-300">
            <!-- Dynamic external expenses breakdown -->
          </ul>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-700/60 text-xs text-amber-300">
          Free development tiers cover 100% of labs
        </div>
      </div>
    </div>

    <!-- Financing & Payment Notice Banner -->
    <div class="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
        </div>
        <div>
          <h4 class="text-sm font-semibold text-white" id="financing-tier-title">Transparent Financing & Payment Options</h4>
          <p class="text-xs text-slate-400 mt-0.5" id="financing-tier-desc">Course duration determines available financing options.</p>
        </div>
      </div>
      <a href="/contact/" class="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors shrink-0">
        Speak with Admissions
      </a>
    </div>
  </div>
</section>
```

### 3.2 Sticky Enroll Card (#detail-emi) Update

The sticky enrollment card (`#detail-emi`) previously displayed an unverified "EMI from ₹X/month" calculation for every course, even 4-week short courses. Under P1-6, this field is strictly updated according to course duration:

- **Tier 1 (≤ 6 Weeks):**
  - Text: `💳 One-time course enrollment fee · 18% GST extra at checkout`
  - Explanatory tooltip/note: `Card installment options available via payment gateway at checkout.`
- **Tier 2 (2 to 4 Months):**
  - Text: `💳 Flexible 2-part milestone & card EMI options available · 18% GST extra`
  - Explanatory note: `Milestone plans subject to admissions approval; card EMI subject to bank credit limits.`
- **Tier 3 (≥ 5 Months):**
  - Text: `💳 3-stage milestone & partner bank EMI options available · 18% GST extra`
  - Explanatory note: `Flexible financing plans available for long-format career mastery programs upon approval.`

---

## 4. Verification & Validation Rules

Automated verification is enforced via `scripts/validate-course-cost-disclosures.js` and npm script `npm run validate:costs`:

1. **Tuition Consistency:** Every course page's rendered fee, tax breakdown, and total must strictly match `data.js` and `data/courses/*.json`.
2. **GST Standard:** 18% GST calculation must be mathematically accurate: `gst = Math.round(launchFee * 0.18)` and `total = launchFee + gst`.
3. **No Short-Course Monthly EMI:** No course with duration ≤ 6 weeks may publish an unqualified "₹X/mo EMI" claim.
4. **Zero-Cost Tool Fallback:** Every software tool classified as `Trial Access`, `Optional Premium`, or `Usage-Based API` must have an associated zero-cost alternative specified.
5. **No Blanket 0% Claims:** No sitewide blanket claims promising unconditional 0% EMI across all courses without specifying eligibility or lender approval.
