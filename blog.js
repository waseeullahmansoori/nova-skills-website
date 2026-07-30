/* ============================================================
   NOVA SKILLS — Blog Page Logic & Dynamic Pagination
   Handles: Rendering blog posts, pagination (9 per page), featured article,
            category filters, keyword search, tag filters, newsletter form
   ============================================================ */

'use strict';

let currentBlogCategory = 'all';
let currentBlogPage = 1;
const BLOG_POSTS_PER_PAGE = 9;

function getBlogPosts() {
  if (typeof window !== 'undefined' && window.NS_BLOG_POSTS && Array.isArray(window.NS_BLOG_POSTS)) {
    return window.NS_BLOG_POSTS;
  }
  if (typeof NS_BLOG_POSTS !== 'undefined' && Array.isArray(NS_BLOG_POSTS)) {
    return NS_BLOG_POSTS;
  }
  return [];
}

function getPageFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('page'), 10);
    return (p && !isNaN(p) && p > 0) ? p : 1;
  } catch (e) {
    return 1;
  }
}

function initBlog() {
  currentBlogPage = getPageFromUrl();
  const posts = getBlogPosts();
  if (posts.length === 0) {
    setTimeout(initBlog, 100);
    return;
  }
  renderFeaturedPost();
  renderBlogGrid();
  renderBlogCategories();
  renderBlogTags();
  bindBlogEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBlog);
} else {
  initBlog();
}

window.addEventListener('popstate', () => {
  currentBlogPage = getPageFromUrl();
  renderBlogGrid();
});

function renderFeaturedPost() {
  const container = document.getElementById('blog-featured-slot');
  const posts = getBlogPosts();
  if (!container || posts.length === 0) return;

  const featured = posts.find(p => p.featured) || posts[0];

  const featuredUrl = featured.url || `blog-detail.html?id=${featured.slug}`;
  const featuredImg = featured.image 
    ? `<img src="${featured.image}" alt="${featured.title}" style="width:100%; height:100%; object-fit:cover; border-radius:16px;" />` 
    : `<span style="font-size:4rem; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.3));">💡</span>`;

  container.innerHTML = `
    <article class="blog-featured">
      <div class="blog-featured-thumb" style="background:var(--grad-hero); color:white; overflow:hidden;">
        <span class="blog-featured-label">FEATURED ARTICLE</span>
        <div style="text-align:center; padding:10px; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
          ${featuredImg}
        </div>
      </div>
      <div class="blog-featured-body">
        <div class="blog-card-category">${featured.category}</div>
        <h2 class="blog-card-title"><a href="${featuredUrl}">${featured.title}</a></h2>
        <p class="blog-card-excerpt">${featured.excerpt}</p>
        <div class="blog-card-meta">
          <div class="blog-author-avatar">${getInitials(featured.author)}</div>
          <div>
            <div class="blog-author-name">${featured.author}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${featured.authorRole}</div>
          </div>
          <span class="blog-meta-dot">•</span>
          <span class="blog-read-time">⏱️ ${featured.readTime} min read</span>
        </div>
        <div>
          <a href="${featuredUrl}" class="blog-read-more">Read Full Article →</a>
        </div>
      </div>
    </article>
  `;
}

function renderBlogGrid() {
  const container = document.getElementById('blog-cards-grid');
  const posts = getBlogPosts();
  if (!container || posts.length === 0) return;

  const searchVal = document.getElementById('blog-search-input')?.value.toLowerCase().trim() || '';

  // 1. Sort latest published blogs first (Date descending)
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.date || '2026-01-01');
    const dateB = new Date(b.date || '2026-01-01');
    return dateB - dateA;
  });

  // 2. Filter posts
  const filtered = sortedPosts.filter(p => {
    if (p.featured && !searchVal && currentBlogCategory === 'all') return false; // Exclude featured from main grid when showing all
    if (currentBlogCategory !== 'all' && p.category.toLowerCase() !== currentBlogCategory.toLowerCase()) return false;
    if (searchVal) {
      const matchTitle = p.title.toLowerCase().includes(searchVal);
      const matchExcerpt = p.excerpt.toLowerCase().includes(searchVal);
      const matchCategory = p.category.toLowerCase().includes(searchVal);
      const matchTags = p.tags ? p.tags.some(t => t.toLowerCase().includes(searchVal)) : false;
      if (!matchTitle && !matchExcerpt && !matchCategory && !matchTags) return false;
    }
    return true;
  });

  const totalPosts = filtered.length;
  const totalPages = Math.ceil(totalPosts / BLOG_POSTS_PER_PAGE) || 1;

  if (currentBlogPage > totalPages) {
    currentBlogPage = totalPages;
  }

  if (totalPosts === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted);">
        <div style="font-size:3rem; margin-bottom:12px;">📝</div>
        <h3>No Articles Found</h3>
        <p>Try searching for a different keyword or topic.</p>
      </div>
    `;
    renderBlogPagination(0, 0);
    return;
  }

  // 3. Slice 9 posts per page
  const startIndex = (currentBlogPage - 1) * BLOG_POSTS_PER_PAGE;
  const pagePosts = filtered.slice(startIndex, startIndex + BLOG_POSTS_PER_PAGE);

  container.innerHTML = pagePosts.map(p => {
    const postUrl = p.url || `blog-detail.html?id=${p.slug}`;
    const thumbContent = p.image 
      ? `<img src="${p.image}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover;" />` 
      : `<span style="font-size:3rem;">${getCategoryEmoji(p.category)}</span>`;

    return `
      <article class="blog-card">
        <div class="blog-card-thumb" style="background:${getCategoryGradient(p.category)}; color:white; overflow:hidden;">
          ${p.trending ? '<span class="blog-trending-badge">🔥 Trending</span>' : ''}
          ${thumbContent}
        </div>
        <div class="blog-card-body">
          <div class="blog-card-category">${p.category}</div>
          <h3 class="blog-card-title"><a href="${postUrl}">${p.title}</a></h3>
          <p class="blog-card-excerpt">${p.excerpt.substring(0, 110)}...</p>
          <div class="blog-card-meta">
            <div class="blog-author-avatar">${getInitials(p.author)}</div>
            <span class="blog-author-name">${p.author}</span>
            <span class="blog-meta-dot">•</span>
            <span class="blog-read-time">${p.readTime} min</span>
          </div>
          <a href="${postUrl}" class="blog-read-more">Read Article →</a>
        </div>
      </article>
    `;
  }).join('');

  // 4. Render Pagination Controls
  renderBlogPagination(totalPosts, totalPages);
}

function renderBlogPagination(totalPosts, totalPages) {
  const container = document.getElementById('blog-pagination');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  // ← Previous Button
  const isPrevDisabled = currentBlogPage <= 1;
  html += `
    <button type="button" 
            class="pagination-btn ${isPrevDisabled ? 'disabled' : ''}" 
            ${isPrevDisabled ? 'disabled aria-disabled="true"' : `onclick="changeBlogPage(${currentBlogPage - 1})"`}
            aria-label="Previous Page">
      ← Previous
    </button>
  `;

  // Numbered Page Buttons
  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentBlogPage;
    html += `
      <button type="button" 
              class="pagination-btn ${isActive ? 'active' : ''}" 
              onclick="changeBlogPage(${i})" 
              aria-label="Page ${i}"
              ${isActive ? 'aria-current="page"' : ''}>
        ${i}
      </button>
    `;
  }

  // Next → Button
  const isNextDisabled = currentBlogPage >= totalPages;
  html += `
    <button type="button" 
            class="pagination-btn ${isNextDisabled ? 'disabled' : ''}" 
            ${isNextDisabled ? 'disabled aria-disabled="true"' : `onclick="changeBlogPage(${currentBlogPage + 1})"`}
            aria-label="Next Page">
      Next →
    </button>
  `;

  container.innerHTML = html;
}

function changeBlogPage(page) {
  currentBlogPage = page;

  // Update browser URL query parameter without page reload
  try {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
  } catch (e) {}

  renderBlogGrid();

  // Smooth scroll to top of blog section
  const sectionHeader = document.querySelector('.blog-section-header') || document.getElementById('blog-cards-grid');
  if (sectionHeader) {
    sectionHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

window.changeBlogPage = changeBlogPage;

function renderBlogCategories() {
  const container = document.getElementById('blog-categories-list');
  const posts = getBlogPosts();
  if (!container || posts.length === 0) return;

  const categories = ['all', ...new Set(posts.map(p => p.category))];

  container.innerHTML = categories.map(cat => {
    const count = cat === 'all' ? posts.length : posts.filter(p => p.category === cat).length;
    const label = cat === 'all' ? 'All Categories' : cat;
    const isActive = currentBlogCategory === cat ? 'active' : '';
    return `
      <button class="blog-category-link ${isActive}" onclick="filterBlogCategory('${cat}')" type="button">
        <span>${label}</span>
        <span class="cat-count">${count}</span>
      </button>
    `;
  }).join('');
}

function filterBlogCategory(cat) {
  currentBlogCategory = cat;
  currentBlogPage = 1;

  try {
    const url = new URL(window.location);
    url.searchParams.set('page', 1);
    window.history.pushState({}, '', url);
  } catch(e) {}

  const heading = document.getElementById('blog-grid-heading');
  if (heading) heading.textContent = cat === 'all' ? 'Latest Articles' : `${cat} Articles`;

  renderBlogCategories();
  renderBlogGrid();
}

window.filterBlogCategory = filterBlogCategory;

function renderBlogTags() {
  const container = document.getElementById('blog-tags-list');
  const posts = getBlogPosts();
  if (!container || posts.length === 0) return;

  const allTags = [...new Set(posts.flatMap(p => p.tags || []))];

  container.innerHTML = allTags.map(tag => `
    <button class="blog-tag" onclick="searchBlogTag('${tag}')" type="button"># ${tag}</button>
  `).join('');
}

function searchBlogTag(tag) {
  const searchInput = document.getElementById('blog-search-input');
  if (searchInput) {
    searchInput.value = tag;
    currentBlogPage = 1;
    renderBlogGrid();
  }
}

window.searchBlogTag = searchBlogTag;

function bindBlogEvents() {
  document.getElementById('blog-search-input')?.addEventListener('input', () => {
    currentBlogPage = 1;
    renderBlogGrid();
  });

  const sidebarNewsForm = document.getElementById('sidebar-newsletter-form');
  sidebarNewsForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = sidebarNewsForm.querySelector('button');
    const emailEl = sidebarNewsForm.querySelector('input[type="email"]');

    if (window.submitNovaForm) {
      await submitNovaForm({
        form: sidebarNewsForm,
        submitBtn,
        loadingText: 'Subscribed...',
        data: {
          email: emailEl?.value.trim() || '',
          message: 'Blog Sidebar Newsletter Subscription'
        }
      });
    } else {
      alert('Thank you for subscribing to our Career Newsletter!');
    }
  });
}

function getInitials(name) {
  if (!name) return 'NS';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function getCategoryEmoji(cat) {
  const map = {
    'Career Advice': '🎯',
    'Digital Marketing': '📊',
    'Design': '🎨',
    'Freelancing': '💼',
    'AI & Technology': '🤖',
    'Content Creation': '🎥',
    'Kids Education': '👨‍💻',
    'Programming': '💻',
    'Founder Story': '🚀'
  };
  return map[cat] || '💡';
}

function getCategoryGradient(cat) {
  const map = {
    'Career Advice': 'linear-gradient(135deg, #011731, #0599a8)',
    'Digital Marketing': 'linear-gradient(135deg, #FF6B00, #FF9A3C)',
    'Design': 'linear-gradient(135deg, #EC4899, #8B5CF6)',
    'Freelancing': 'linear-gradient(135deg, #0599a8, #75d766)',
    'AI & Technology': 'linear-gradient(135deg, #2563EB, #0599a8)',
    'Content Creation': 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    'Kids Education': 'linear-gradient(135deg, #75d766, #0599a8)',
    'Programming': 'linear-gradient(135deg, #011731, #2563EB)',
    'Founder Story': 'linear-gradient(135deg, #011731, #0599a8)'
  };
  return map[cat] || 'linear-gradient(135deg, #011731, #0599a8)';
}
