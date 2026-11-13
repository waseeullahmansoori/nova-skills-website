# Nova Skills — AI Search Referral & Conversion Tracking Architecture (Phase 11)

**Document ID:** AI-SEO-PHASE-11-ANALYTICS  
**Analytics Platform:** Google Analytics 4 (GA4: `G-P8M47W4TJW`)  
**Integration Status:** Non-PII Compliant & Active  
**Branch:** development  

---

## 1. AI Referral Identification in GA4

Traffic originating from AI search engines arrives with identifiable document referrers:
- **ChatGPT:** `chatgpt.com`, `android-app://com.openai.chatgpt`.
- **Perplexity:** `perplexity.ai`.
- **Microsoft Copilot:** `bing.com`, `copilot.microsoft.com`.
- **Gemini / Google AI:** `google.com` (Organic Search with AI Overviews attribution in GSC).
- **Claude:** `claude.ai`.

---

## 2. Conversion Event Taxonomy

Nova Skills tracks user actions through distinct, non-inflated GA4 events:
- `page_view`: Standard route navigation.
- `click_demo_button`: Interaction with "Book Free 2-Day Demo" CTA.
- `click_whatsapp`: Admissions inquiry via WhatsApp (records `contact_type: "whatsapp"`).
- `click_phone`: Admissions phone call trigger (records `contact_type: "phone"`).
- `generate_lead`: Completed form submission with valid non-PII transaction ID.
  *(Note: Button clicks and form starts are never classified as leads; only verified successful submissions fire `generate_lead`.)*
