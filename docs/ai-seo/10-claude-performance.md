# Nova Skills — Claude Web Search & Retrieval Monitoring

**Document ID:** AI-SEO-PHASE-10-CLAUDE  
**Platform:** Anthropic Claude (Claude Web Search & Chat Retrieval)  
**Primary Crawlers:** `Claude-SearchBot` (Search Discovery), `Claude-User` (Direct User Fetch)  
**Training Token:** `ClaudeBot` (Preserved existing state)  
**Branch:** development  

---

## 1. Anthropic Policy Separation & Search Ingestion
- **Crawler Permissibility:** `Claude-SearchBot` permitted for web search discovery.
- **Training Separation:** `ClaudeBot` pre-training crawler separated from search operations, honoring owner preferences.
- **Retrieval Quality:** High factual accuracy on curriculum, tools, and instructor credentials.
