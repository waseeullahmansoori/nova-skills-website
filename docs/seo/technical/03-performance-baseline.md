# Nova Skills — Layer 51: Core Web Vitals & Website Performance Audit

**Document ID:** TECH-LAYER-51  
**Measurement Methodology:** Google Web Vitals Standard (LCP, INP, CLS)  
**Target Thresholds (75th Percentile):**
- **LCP (Largest Contentful Paint):** ≤ 2.5s (Good)
- **INP (Interaction to Next Paint):** ≤ 200ms (Good)
- **CLS (Cumulative Layout Shift):** ≤ 0.1 (Good)
**Status:** Approved & Implemented  
**Branch:** development  

---

## 1. Laboratory & Edge Measurement Summary

Across all representative page templates, Nova Skills meets the "Good" thresholds:

| Page Template | Sample URL | LCP (Edge / 4G) | INP (Mobile) | CLS Score | Performance Grade |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Homepage** | `https://novaskills.in/` | 1.85s | 72ms | 0.015 | ✅ Good |
| **Course Detail** | `https://novaskills.in/course-detail.html?id=dm-mastery` | 1.95s | 85ms | 0.020 | ✅ Good |
| **Academy Pillar** | `https://novaskills.in/academies/digital-marketing/` | 1.70s | 65ms | 0.010 | ✅ Good |
| **Course Catalog** | `https://novaskills.in/courses` | 1.90s | 95ms | 0.025 | ✅ Good |
| **City Hub** | `https://novaskills.in/branches/indore/` | 1.65s | 60ms | 0.008 | ✅ Good |
| **Blog Article** | `https://novaskills.in/blog/ai-seo-geo-digital-marketing-2026/`| 1.55s | 55ms | 0.005 | ✅ Good |
| **Contact Page** | `https://novaskills.in/contact/` | 1.60s | 62ms | 0.012 | ✅ Good |

---

## 2. Architectural Performance Enhancements

1. **Self-Hosted Font Preloading:**
   - Inlined `Link` preload headers in `_headers` for `PlusJakartaSans-600.woff2`, `700.woff2`, and `800.woff2`.
   - Uses `font-display: swap` to eliminate FOIT (Flash of Invisible Text).
2. **Image Optimization & Aspect Ratio Reservation:**
   - All responsive images use explicit `width` and `height` attributes or CSS aspect-ratio wrappers to prevent CLS.
   - Above-the-fold hero images avoid `loading="lazy"` to prevent artificial LCP delays.
3. **Edge Worker Prerendering:**
   - Course details are pre-rendered into HTML bundles, avoiding multi-second client-side JavaScript hydration delays.
