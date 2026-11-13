# Fix Implementation: Zero-CLS Top Announcement Bar & First-Paint Layout Stability

**Project:** Nova Skills (`https://novaskills.in/`)  
**Target Branches:** `development` -> `main`  
**Priority:** P1  
**Date:** November 2026  

---

## 1. Implementation Overview

To permanently eliminate the initial load glitch, multi-row stacking, jumping, and cumulative layout shift of the Top Announcement Bar, changes were implemented across three layers:
1. Stylesheet architecture (`css/main.css`, `css/critical.css`, `css/critical.min.css`, `css/styles.min.css`).
2. HTML documents (Inlined `<style id="critical-css">` in 122 pages, early dismissal head guard in `index.html`).
3. JavaScript components (`components.js`, `js/components.min.js`, SSR header builder).

---

## 2. Code Changes Detailed

### 2.1 CSS Layer (`css/main.css` & `css/critical.css`)
Replaced conflicting and legacy blocks with unified zero-CLS specification:
```css
html.ns-announcement-hidden #announcement-bar {
  display: none !important;
}

.announcement-bar {
  font-family: var(--font-primary, 'Plus Jakarta Sans', sans-serif);
  background: var(--grad-cta, linear-gradient(135deg, #0599a8 0%, #002244 100%));
  color: white;
  padding: 8px 0;
  height: 44px;
  min-height: 44px;
  max-height: 44px;
  box-sizing: border-box;
  position: relative;
  z-index: 100;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(1, 23, 49, 0.25);
  contain: layout size;
}

.announcement-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 28px;
  min-height: 28px;
  gap: 12px;
  width: 100%;
  max-width: var(--container-max, 1280px);
  margin: 0 auto;
  padding: 0 var(--container-pad, 24px);
  box-sizing: border-box;
  min-width: 0;
}

.announcement-stage {
  flex: 1;
  min-width: 0;
  position: relative;
  height: 28px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.announcement-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-width: 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition: opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), visibility 0.4s;
  pointer-events: none;
  box-sizing: border-box;
}

.announcement-slide.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.announcement-slide.slide-out {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-12px);
}

.announcement-text {
  font-size: 0.84375rem;
  line-height: 1.4;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex-shrink: 1;
}

.announcement-text strong {
  color: white;
  font-weight: 700;
}

.announcement-cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 0.78125rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: var(--radius-full, 9999px);
  white-space: nowrap;
  flex-shrink: 0;
  text-decoration: none;
  transition: all var(--transition-fast, 0.2s ease);
}

.announcement-cta:hover {
  background: white;
  color: var(--navy, #011731);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.announcement-nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: background var(--transition-fast, 0.2s ease);
  flex-shrink: 0;
  padding: 0;
  touch-action: manipulation;
}

.announcement-nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.announcement-dots {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 6px;
  flex-shrink: 0;
}

.announcement-dots .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition: all var(--transition-fast, 0.2s ease);
}

.announcement-dots .dot.active {
  background: white;
  width: 14px;
  border-radius: 3px;
}

.announcement-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
  cursor: pointer;
  padding: 6px;
  min-width: 32px;
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: color var(--transition-fast, 0.2s ease);
  flex-shrink: 0;
  touch-action: manipulation;
}

.announcement-close:hover {
  color: white;
}

@media (max-width: 900px) {
  .announcement-dots, .announcement-nav-btn {
    display: none !important;
  }
}

@media (max-width: 640px) {
  .announcement-bar {
    height: 40px;
    min-height: 40px;
    max-height: 40px;
    padding: 4px 0;
  }
  .announcement-container {
    height: 32px;
    min-height: 32px;
    gap: 8px;
    padding: 0 12px;
  }
  .announcement-stage {
    height: 32px;
  }
  .announcement-text {
    font-size: 0.78125rem;
  }
  .announcement-cta {
    font-size: 0.75rem;
    padding: 3px 10px;
  }
  .announcement-close {
    min-width: 28px;
    min-height: 28px;
    padding: 4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .announcement-slide {
    transition: opacity 0.2s ease !important;
    transform: none !important;
  }
}
```

---

### 2.2 Template & Client JS Layer (`components.js`)
1. **Template Generation (`buildAnnouncementBarHTML`):**
   ```html
   <!-- Slide 1 -->
   <div class="announcement-slide active" data-index="0" aria-hidden="false">...</div>
   <!-- Slides 2..6 -->
   <div class="announcement-slide" data-index="1" style="display:none;" aria-hidden="true">...</div>
   ```
2. **Carousel Transitions (`initAnnouncementBar`):**
   ```javascript
   function showSlide(index) {
     if (index === currentIndex && slides[index].classList.contains('active')) return;
     const prevSlideEl = slides[currentIndex];
     currentIndex = (index + totalSlides) % totalSlides;
     sessionStorage.setItem('ns_announcement_index', currentIndex);
     const nextSlideEl = slides[currentIndex];

     nextSlideEl.style.display = 'flex';
     nextSlideEl.setAttribute('aria-hidden', 'false');

     if (prevSlideEl) {
       prevSlideEl.classList.remove('active');
       prevSlideEl.classList.add('slide-out');
       prevSlideEl.setAttribute('aria-hidden', 'true');
       setTimeout(() => {
         if (!prevSlideEl.classList.contains('active')) {
           prevSlideEl.style.display = 'none';
           prevSlideEl.classList.remove('slide-out');
         }
       }, 420);
     }

     setTimeout(() => {
       nextSlideEl.classList.add('active');
     }, prefersReducedMotion ? 0 : 30);
     ...
   }
   ```

---

### 2.3 HTML Inlined CSS Synchronization
Executed `scripts/sync-critical-announcement-css.js` across all 122 public HTML routes, updating `<style id="critical-css">` so that the modern announcement bar rules are immediately available on Frame 0 before any external network request completes.

---

### 2.4 Warm Dismissal Guard
Added synchronously executed script right before `</head>` in `index.html`:
```html
<!-- Top Announcement Bar Instant Dismissal Guard (Zero CLS on warm visits) -->
<script>try{if(localStorage.getItem('ns_announcement_closed')==='true'){document.documentElement.classList.add('ns-announcement-hidden');}}catch(e){}</script>
```
When `ns_announcement_closed` is `'true'`, `document.documentElement` immediately gains `ns-announcement-hidden`, causing the browser to evaluate `html.ns-announcement-hidden #announcement-bar { display: none !important; }` prior to constructing render trees.
