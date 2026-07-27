/* ============================================================
   NOVA SKILLS — Blog Page Logic
   Handles: Rendering blog posts, featured article, category filters,
            keyword search, tag filters, newsletter form
   ============================================================ */

'use strict';

let currentBlogCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedPost();
  renderBlogGrid();
  renderBlogCategories();
  renderBlogTags();
  bindBlogEvents();
});

function renderFeaturedPost() {
  const container = document.getElementById('blog-featured-slot');
  if (!container) return;

  const featured = NS_BLOG_POSTS.find(p => p.featured) || NS_BLOG_POSTS[0];

  container.innerHTML = `
    <article class="blog-featured">
      <div class="blog-featured-thumb" style="background:var(--grad-hero); color:white;">
        <span class="blog-featured-label">FEATURED ARTICLE</span>
        <div style="text-align:center; padding:20px;">
          <span style="font-size:4rem; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.3));">💡</span>
        </div>
      </div>
      <div class="blog-featured-body">
        <div class="blog-card-category">${featured.category}</div>
        <h2 class="blog-card-title"><a href="blog-detail.html?id=${featured.slug}">${featured.title}</a></h2>
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
          <a href="blog-detail.html?id=${featured.slug}" class="blog-read-more">Read Full Article →</a>
        </div>
      </div>
    </article>
  `;
}

function renderBlogGrid() {
  const container = document.getElementById('blog-cards-grid');
  if (!container) return;

  const searchVal = document.getElementById('blog-search-input')?.value.toLowerCase().trim() || '';

  const filtered = NS_BLOG_POSTS.filter(p => {
    if (p.featured && !searchVal && currentBlogCategory === 'all') return false; // Exclude featured from main grid when showing all
    if (currentBlogCategory !== 'all' && p.category.toLowerCase() !== currentBlogCategory.toLowerCase()) return false;
    if (searchVal) {
      const matchTitle = p.title.toLowerCase().includes(searchVal);
      const matchExcerpt = p.excerpt.toLowerCase().includes(searchVal);
      const matchCategory = p.category.toLowerCase().includes(searchVal);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(searchVal));
      if (!matchTitle && !matchExcerpt && !matchCategory && !matchTags) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted);">
        <div style="font-size:3rem; margin-bottom:12px;">📝</div>
        <h3>No Articles Found</h3>
        <p>Try searching for a different keyword or topic.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <article class="blog-card">
      <div class="blog-card-thumb" style="background:${getCategoryGradient(p.category)}; color:white;">
        ${p.trending ? '<span class="blog-trending-badge">🔥 Trending</span>' : ''}
        <span style="font-size:3rem;">${getCategoryEmoji(p.category)}</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-category">${p.category}</div>
        <h3 class="blog-card-title"><a href="blog-detail.html?id=${p.slug}">${p.title}</a></h3>
        <p class="blog-card-excerpt">${p.excerpt.substring(0, 110)}...</p>
        <div class="blog-card-meta">
          <div class="blog-author-avatar">${getInitials(p.author)}</div>
          <span class="blog-author-name">${p.author}</span>
          <span class="blog-meta-dot">•</span>
          <span class="blog-read-time">${p.readTime} min</span>
        </div>
        <a href="blog-detail.html?id=${p.slug}" class="blog-read-more">Read Article →</a>
      </div>
    </article>
  `).join('');
}

function renderBlogCategories() {
  const container = document.getElementById('blog-categories-list');
  if (!container) return;

  const categories = ['all', ...new Set(NS_BLOG_POSTS.map(p => p.category))];

  container.innerHTML = categories.map(cat => {
    const count = cat === 'all' ? NS_BLOG_POSTS.length : NS_BLOG_POSTS.filter(p => p.category === cat).length;
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

  const heading = document.getElementById('blog-grid-heading');
  if (heading) heading.textContent = cat === 'all' ? 'Latest Articles' : `${cat} Articles`;

  renderBlogCategories();
  renderBlogGrid();
}

window.filterBlogCategory = filterBlogCategory;

function renderBlogTags() {
  const container = document.getElementById('blog-tags-list');
  if (!container) return;

  const allTags = [...new Set(NS_BLOG_POSTS.flatMap(p => p.tags))];

  container.innerHTML = allTags.map(tag => `
    <button class="blog-tag" onclick="searchBlogTag('${tag}')" type="button"># ${tag}</button>
  `).join('');
}

function searchBlogTag(tag) {
  const searchInput = document.getElementById('blog-search-input');
  if (searchInput) {
    searchInput.value = tag;
    renderBlogGrid();
  }
}

window.searchBlogTag = searchBlogTag;

function bindBlogEvents() {
  document.getElementById('blog-search-input')?.addEventListener('input', renderBlogGrid);

  document.getElementById('sidebar-newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    if (btn) {
      btn.textContent = 'Subscribed! 🎉';
      btn.style.background = 'var(--green)';
      btn.disabled = true;
    }
  });
}

function getInitials(name) {
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
  };
  return map[cat] || '💡';
}

function getCategoryGradient(cat) {
  const map = {
    'Career Advice': 'linear-gradient(135deg, #011731, #0599a8)',
    'Digital Marketing': 'linear-gradient(135deg, #FF6B00, #FF9A3C)',
    'Design': 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    'Freelancing': 'linear-gradient(135deg, #0599a8, #75d766)',
    'AI & Technology': 'linear-gradient(135deg, #0599a8, #2563EB)',
    'Content Creation': 'linear-gradient(135deg, #FF6B00, #EC4899)',
    'Kids Education': 'linear-gradient(135deg, #EC4899, #8B5CF6)',
    'Programming': 'linear-gradient(135deg, #2563EB, #0599a8)',
  };
  return map[cat] || 'var(--grad-hero)';
}
