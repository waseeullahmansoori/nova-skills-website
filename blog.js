/* ============================================================
   NOVA SKILLS — Blog Page Functional Engine
   Handles: 9 posts per page, category filter, tag filter,
   search filter, multi-filter combination, pagination, URL state sync,
   browser history popstate, clear filters, and dynamic rendering.
   ============================================================ */

'use strict';

let currentBlogCategory = 'all';
let currentBlogTag = '';
let currentBlogSearch = '';
let currentBlogPage = 1;
const BLOG_POSTS_PER_PAGE = 9;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getBlogPosts() {
  if (typeof window !== 'undefined' && window.NS_BLOG_POSTS && Array.isArray(window.NS_BLOG_POSTS)) {
    return window.NS_BLOG_POSTS;
  }
  if (typeof NS_BLOG_POSTS !== 'undefined' && Array.isArray(NS_BLOG_POSTS)) {
    return NS_BLOG_POSTS;
  }
  return [];
}

function readUrlParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get('page'), 10);
    currentBlogPage = (pageParam && !isNaN(pageParam) && pageParam > 0) ? pageParam : 1;
    currentBlogCategory = params.get('category') || 'all';
    currentBlogTag = params.get('tag') || '';
    currentBlogSearch = params.get('search') || '';

    const searchInput = document.getElementById('blog-search-input');
    if (searchInput) {
      searchInput.value = currentBlogSearch;
    }
  } catch (e) {
    currentBlogPage = 1;
    currentBlogCategory = 'all';
    currentBlogTag = '';
    currentBlogSearch = '';
  }
}

function updateUrlParams() {
  try {
    const url = new URL(window.location);
    if (currentBlogPage > 1) {
      url.searchParams.set('page', currentBlogPage);
    } else {
      url.searchParams.delete('page');
    }

    if (currentBlogCategory && currentBlogCategory.toLowerCase() !== 'all') {
      url.searchParams.set('category', currentBlogCategory);
    } else {
      url.searchParams.delete('category');
    }

    if (currentBlogTag) {
      url.searchParams.set('tag', currentBlogTag);
    } else {
      url.searchParams.delete('tag');
    }

    const searchInput = document.getElementById('blog-search-input');
    const searchVal = searchInput ? searchInput.value.trim() : currentBlogSearch;
    if (searchVal) {
      url.searchParams.set('search', searchVal);
    } else {
      url.searchParams.delete('search');
    }

    window.history.pushState({}, '', url);
  } catch (e) {}
}

function filterBlogCategory(cat) {
  if (!cat || cat.toLowerCase() === 'all') {
    currentBlogCategory = 'all';
  } else {
    currentBlogCategory = cat;
  }
  currentBlogPage = 1;
  updateUrlParams();

  renderBlogCategories();
  renderBlogGrid();
}
window.filterBlogCategory = filterBlogCategory;

function searchBlogTag(tag) {
  if (!tag) {
    currentBlogTag = '';
  } else if (currentBlogTag.toLowerCase().trim() === tag.toLowerCase().trim()) {
    currentBlogTag = '';
  } else {
    currentBlogTag = tag;
  }
  currentBlogPage = 1;
  updateUrlParams();

  renderBlogTags();
  renderBlogGrid();
}
window.searchBlogTag = searchBlogTag;

function changeBlogPage(page) {
  const pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum < 1) return;
  currentBlogPage = pageNum;
  updateUrlParams();
  renderBlogGrid();

  const sectionHeader = document.querySelector('.blog-section-header') || document.getElementById('blog-cards-grid');
  if (sectionHeader) {
    sectionHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
window.changeBlogPage = changeBlogPage;

function clearAllBlogFilters() {
  currentBlogCategory = 'all';
  currentBlogTag = '';
  currentBlogSearch = '';
  currentBlogPage = 1;

  const searchInput = document.getElementById('blog-search-input');
  if (searchInput) searchInput.value = '';

  updateUrlParams();
  renderBlogCategories();
  renderBlogTags();
  renderBlogGrid();
}
window.clearAllBlogFilters = clearAllBlogFilters;

function renderFeaturedPost() {
  const container = document.getElementById('blog-featured-slot');
  const posts = getBlogPosts();
  if (!container || posts.length === 0) return;

  const featured = posts.find(p => p.featured) || posts[0];
  const featuredUrl = featured.url || `blog-detail.html?id=${featured.slug}`;
  const featuredImgPath = featured.featuredImage || featured.image || '/images/seo/waseeullah-mansoori.png';
  const featuredAlt = featured.slug === 'waseeullah-mansoori' 
    ? 'Waseeullah Mansoori - Founder of Nova Skills' 
    : (featured.title || 'Featured Article');

  const featuredImg = featuredImgPath 
    ? `<img src="${featuredImgPath}" alt="${featuredAlt}" style="width:100%; height:100%; object-fit:cover; border-radius:16px;" loading="eager" />` 
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
        <div class="blog-card-category">${escapeHtml(featured.category || 'Featured')}</div>
        <h2 class="blog-card-title"><a href="${featuredUrl}">${escapeHtml(featured.title || '')}</a></h2>
        <p class="blog-card-excerpt">${escapeHtml(featured.excerpt || '')}</p>
        <div class="blog-card-meta">
          <div class="blog-author-avatar">${getInitials(featured.author)}</div>
          <div>
            <div class="blog-author-name">${escapeHtml(featured.author || 'Nova Skills')}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(featured.authorRole || 'Author')}</div>
          </div>
          <span class="blog-meta-dot">•</span>
          <span class="blog-read-time">⏱️ ${featured.readingTime || featured.readTime || 8} min read</span>
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

  const searchInput = document.getElementById('blog-search-input');
  const searchVal = (searchInput ? searchInput.value : currentBlogSearch).toLowerCase().trim();

  // 1. Sort latest published blogs first (Date descending)
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.publishDate || a.date || '2026-01-01');
    const dateB = new Date(b.publishDate || b.date || '2026-01-01');
    return dateB - dateA;
  });

  // 2. Filter posts across Category, Tag, and Search
  const filtered = sortedPosts.filter(p => {
    // Exclude featured article from main grid ONLY when showing all categories, page 1, no tag, no search query
    if (p.featured && currentBlogCategory === 'all' && !currentBlogTag && !searchVal && currentBlogPage === 1) {
      return false;
    }

    // Category Filter
    if (currentBlogCategory && currentBlogCategory.toLowerCase() !== 'all') {
      const pCat = (p.category || '').toLowerCase().trim();
      const targetCat = currentBlogCategory.toLowerCase().trim();
      if (pCat !== targetCat) {
        return false;
      }
    }

    // Tag Filter
    if (currentBlogTag) {
      const targetTag = currentBlogTag.toLowerCase().trim().replace(/^#/, '');
      const hasTag = p.tags && Array.isArray(p.tags) && p.tags.some(t => {
        const cleanT = t.toLowerCase().trim().replace(/^#/, '');
        return cleanT === targetTag;
      });
      if (!hasTag) {
        return false;
      }
    }

    // Search Query
    if (searchVal) {
      const matchTitle = p.title ? p.title.toLowerCase().includes(searchVal) : false;
      const matchExcerpt = p.excerpt ? p.excerpt.toLowerCase().includes(searchVal) : false;
      const matchContent = p.content ? p.content.toLowerCase().includes(searchVal) : false;
      const matchCategory = p.category ? p.category.toLowerCase().includes(searchVal) : false;
      const matchAuthor = p.author ? p.author.toLowerCase().includes(searchVal) : false;
      const matchTags = p.tags ? p.tags.some(t => t.toLowerCase().includes(searchVal)) : false;

      if (!matchTitle && !matchExcerpt && !matchContent && !matchCategory && !matchAuthor && !matchTags) {
        return false;
      }
    }

    return true;
  });

  const totalPosts = filtered.length;
  const totalPages = Math.ceil(totalPosts / BLOG_POSTS_PER_PAGE) || 1;

  if (currentBlogPage > totalPages) {
    currentBlogPage = totalPages;
  }
  if (currentBlogPage < 1) {
    currentBlogPage = 1;
  }

  // Update Section Heading
  const heading = document.getElementById('blog-grid-heading');
  if (heading) {
    const filtersLabel = [];
    if (currentBlogCategory && currentBlogCategory !== 'all') {
      filtersLabel.push(`Category: ${currentBlogCategory}`);
    }
    if (currentBlogTag) {
      filtersLabel.push(`Tag: #${currentBlogTag}`);
    }
    if (searchVal) {
      filtersLabel.push(`Search: "${searchVal}"`);
    }

    if (filtersLabel.length > 0) {
      heading.textContent = `${filtersLabel.join(' • ')} (${totalPosts})`;
    } else {
      heading.textContent = 'Latest Articles';
    }
  }

  // No Results View
  if (totalPosts === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted);">
        <div style="font-size:3.5rem; margin-bottom:12px;">📝</div>
        <h3 style="font-size:1.5rem; font-weight:800; color:var(--navy); margin-bottom:8px;">No articles found.</h3>
        <p style="font-size:0.95rem; color:#64748b; margin-bottom:24px;">No articles match your active search term or filter criteria.</p>
        <button type="button" class="btn btn-primary" onclick="clearAllBlogFilters()" style="background:#0599a8; color:white; font-weight:700;">Clear Filters ✕</button>
      </div>
    `;
    renderBlogPagination(0, 0);
    return;
  }

  // Slice posts for current page (9 per page)
  const startIndex = (currentBlogPage - 1) * BLOG_POSTS_PER_PAGE;
  const endIndex = startIndex + BLOG_POSTS_PER_PAGE;
  const pagePosts = filtered.slice(startIndex, endIndex);

  container.innerHTML = pagePosts.map(p => {
    const postUrl = p.url || `blog-detail.html?id=${p.slug}`;
    const imgPath = p.featuredImage || p.image;
    const imageAlt = p.slug === 'waseeullah-mansoori' 
      ? 'Waseeullah Mansoori - Founder of Nova Skills' 
      : (p.title || 'Article');

    const excerptText = p.excerpt ? (p.excerpt.length > 110 ? p.excerpt.substring(0, 110) + '...' : p.excerpt) : '';

    const thumbContent = imgPath 
      ? `<img src="${imgPath}" alt="${escapeHtml(imageAlt)}" style="width:100%; height:100%; object-fit:cover;" loading="lazy" />` 
      : `<span style="font-size:3rem;">${getCategoryEmoji(p.category)}</span>`;

    return `
      <article class="blog-card">
        <div class="blog-card-thumb" style="background:${getCategoryGradient(p.category)}; color:white; overflow:hidden;">
          ${p.trending ? '<span class="blog-trending-badge">🔥 Trending</span>' : ''}
          ${thumbContent}
        </div>
        <div class="blog-card-body">
          <div class="blog-card-category">${escapeHtml(p.category || 'General')}</div>
          <h3 class="blog-card-title"><a href="${postUrl}">${escapeHtml(p.title || '')}</a></h3>
          <p class="blog-card-excerpt">${escapeHtml(excerptText)}</p>
          <div class="blog-card-meta">
            <div class="blog-author-avatar">${getInitials(p.author)}</div>
            <span class="blog-author-name">${escapeHtml(p.author || 'Nova Skills')}</span>
            <span class="blog-meta-dot">•</span>
            <span class="blog-read-time">${p.readingTime || p.readTime || 8} min</span>
          </div>
          <a href="${postUrl}" class="blog-read-more">Read Article →</a>
        </div>
      </article>
    `;
  }).join('');

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

  // Previous Button
  const isPrevDisabled = currentBlogPage <= 1;
  html += `
    <button type="button" 
            class="pagination-btn ${isPrevDisabled ? 'disabled' : ''}" 
            data-page="${currentBlogPage - 1}"
            ${isPrevDisabled ? 'disabled aria-disabled="true"' : `onclick="changeBlogPage(${currentBlogPage - 1}); return false;"`}
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
              data-page="${i}"
              onclick="changeBlogPage(${i}); return false;" 
              aria-label="Page ${i}"
              ${isActive ? 'aria-current="page"' : ''}>
        ${i}
      </button>
    `;
  }

  // Next Button
  const isNextDisabled = currentBlogPage >= totalPages;
  html += `
    <button type="button" 
            class="pagination-btn ${isNextDisabled ? 'disabled' : ''}" 
            data-page="${currentBlogPage + 1}"
            ${isNextDisabled ? 'disabled aria-disabled="true"' : `onclick="changeBlogPage(${currentBlogPage + 1}); return false;"`}
            aria-label="Next Page">
      Next →
    </button>
  `;

  container.innerHTML = html;
}

function renderBlogCategories() {
  const container = document.getElementById('blog-categories-list');
  const posts = getBlogPosts();
  if (!container || posts.length === 0) return;

  const counts = {};
  posts.forEach(p => {
    const cat = p.category || 'General';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const categories = ['all', ...Object.keys(counts).sort()];

  let html = categories.map(cat => {
    const count = cat === 'all' ? posts.length : counts[cat];
    const label = cat === 'all' ? 'All Categories' : cat;
    const isActive = (currentBlogCategory.toLowerCase().trim() === cat.toLowerCase().trim()) ? 'active' : '';
    return `
      <button class="blog-category-link ${isActive}" data-category="${escapeHtml(cat)}" onclick="filterBlogCategory('${escapeHtml(cat)}'); return false;" type="button">
        <span>${escapeHtml(label)}</span>
        <span class="cat-count">(${count})</span>
      </button>
    `;
  }).join('');

  if (currentBlogCategory !== 'all' || currentBlogTag || (document.getElementById('blog-search-input')?.value.trim())) {
    html += `
      <button type="button" class="btn btn-sm btn-outline" style="width:100%; margin-top:12px; font-size:0.8rem;" onclick="clearAllBlogFilters(); return false;">
        Clear All Filters ✕
      </button>
    `;
  }

  container.innerHTML = html;
}

function renderBlogTags() {
  const container = document.getElementById('blog-tags-list');
  const posts = getBlogPosts();
  if (!container || posts.length === 0) return;

  const tagCounts = {};
  posts.forEach(p => {
    if (p.tags && Array.isArray(p.tags)) {
      p.tags.forEach(t => {
        const cleanTag = t.trim();
        tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
      });
    }
  });

  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

  container.innerHTML = sortedTags.map(tag => {
    const isActive = currentBlogTag.toLowerCase().trim() === tag.toLowerCase().trim() ? 'active' : '';
    return `
      <button class="blog-tag ${isActive}" data-tag="${escapeHtml(tag)}" onclick="searchBlogTag('${escapeHtml(tag)}'); return false;" type="button">#${escapeHtml(tag)}</button>
    `;
  }).join('');
}

function renderLatestPosts() {
  const container = document.getElementById('blog-latest-posts-list');
  const posts = getBlogPosts();
  if (!container || posts.length === 0) return;

  const latest5 = [...posts].sort((a, b) => {
    const dateA = new Date(a.publishDate || a.date || '2026-01-01');
    const dateB = new Date(b.publishDate || b.date || '2026-01-01');
    return dateB - dateA;
  }).slice(0, 5);

  container.innerHTML = latest5.map(p => {
    const postUrl = p.url || `blog-detail.html?id=${p.slug}`;
    const imgPath = p.featuredImage || p.image;
    const formattedDate = formatDate(p.publishDate || p.date);
    const thumbHtml = imgPath 
      ? `<img src="${imgPath}" alt="${escapeHtml(p.title || '')}" style="width:48px; height:48px; object-fit:cover; border-radius:8px; flex-shrink:0;" loading="lazy" />` 
      : `<div style="width:48px; height:48px; border-radius:8px; background:var(--grad-navy-teal); color:white; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">${getCategoryEmoji(p.category)}</div>`;

    return `
      <div class="latest-post-item" style="display:flex; gap:12px; align-items:center; margin-bottom:14px;">
        ${thumbHtml}
        <div style="flex:1; min-width:0;">
          <a href="${postUrl}" style="font-size:0.85rem; font-weight:700; color:var(--navy); line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
            ${escapeHtml(p.title || '')}
          </a>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px;">
            <span>📅 ${formattedDate}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function formatDate(dateStr) {
  if (!dateStr) return 'July 2026';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function bindBlogEvents() {
  const searchInput = document.getElementById('blog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentBlogSearch = searchInput.value.trim();
      currentBlogPage = 1;
      updateUrlParams();
      renderBlogGrid();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        currentBlogSearch = searchInput.value.trim();
        currentBlogPage = 1;
        updateUrlParams();
        renderBlogGrid();
      }
    });
  }

  // Category click handler delegation
  const categoriesContainer = document.getElementById('blog-categories-list');
  if (categoriesContainer) {
    categoriesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.blog-category-link');
      if (btn) {
        e.preventDefault();
        const cat = btn.getAttribute('data-category') || btn.querySelector('span')?.textContent.trim() || 'all';
        filterBlogCategory(cat);
      }
    });
  }

  // Tag click handler delegation
  const tagsContainer = document.getElementById('blog-tags-list');
  if (tagsContainer) {
    tagsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.blog-tag');
      if (btn) {
        e.preventDefault();
        const tag = btn.getAttribute('data-tag') || btn.textContent.replace(/^#/, '').trim();
        searchBlogTag(tag);
      }
    });
  }

  // Pagination click handler delegation
  const paginationContainer = document.getElementById('blog-pagination');
  if (paginationContainer) {
    paginationContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.pagination-btn');
      if (btn && !btn.classList.contains('disabled')) {
        e.preventDefault();
        const pageAttr = btn.getAttribute('data-page');
        if (pageAttr) {
          changeBlogPage(parseInt(pageAttr, 10));
        }
      }
    });
  }

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

function initBlog() {
  readUrlParams();
  const posts = getBlogPosts();
  if (posts.length === 0) {
    setTimeout(initBlog, 100);
    return;
  }
  renderFeaturedPost();
  renderBlogGrid();
  renderBlogCategories();
  renderBlogTags();
  renderLatestPosts();
  bindBlogEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBlog);
} else {
  initBlog();
}

window.addEventListener('popstate', () => {
  readUrlParams();
  renderBlogGrid();
  renderBlogCategories();
  renderBlogTags();
  renderLatestPosts();
});

function getInitials(name) {
  if (!name) return 'NS';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function getCategoryEmoji(cat) {
  const map = {
    'Career Advice': '🎯',
    'Career Guidance': '🎯',
    'Digital Marketing': '📊',
    'Design': '🎨',
    'Graphic Design': '🎨',
    'Freelancing': '💼',
    'AI & Technology': '🤖',
    'AI & Automation': '🤖',
    'Content Creation': '🎥',
    'Motion Graphics': '🎥',
    'Video Editing': '🎬',
    'Kids Education': '👨‍💻',
    'Student Success': '🎓',
    'Programming': '💻',
    'Web Development': '💻',
    'Founder Story': '🚀'
  };
  return map[cat] || '💡';
}

function getCategoryGradient(cat) {
  const map = {
    'Career Advice': 'linear-gradient(135deg, #011731, #0599a8)',
    'Career Guidance': 'linear-gradient(135deg, #011731, #0599a8)',
    'Digital Marketing': 'linear-gradient(135deg, #FF6B00, #FF9A3C)',
    'Design': 'linear-gradient(135deg, #EC4899, #8B5CF6)',
    'Graphic Design': 'linear-gradient(135deg, #EC4899, #8B5CF6)',
    'Freelancing': 'linear-gradient(135deg, #0599a8, #75d766)',
    'AI & Technology': 'linear-gradient(135deg, #2563EB, #0599a8)',
    'AI & Automation': 'linear-gradient(135deg, #2563EB, #0599a8)',
    'Content Creation': 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    'Motion Graphics': 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    'Kids Education': 'linear-gradient(135deg, #75d766, #0599a8)',
    'Programming': 'linear-gradient(135deg, #011731, #2563EB)',
    'Web Development': 'linear-gradient(135deg, #011731, #2563EB)',
    'Founder Story': 'linear-gradient(135deg, #011731, #0599a8)'
  };
  return map[cat] || 'linear-gradient(135deg, #011731, #0599a8)';
}
