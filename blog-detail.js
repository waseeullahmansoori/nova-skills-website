/* ============================================================
   NOVA SKILLS — Blog Detail Page Logic
   Renders article details, builds TOC dynamically, social sharing
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const post = getTargetPost();
  if (post) {
    populateArticle(post);
    buildTableOfContents();
    renderRelatedArticles(post);
    bindCommentForm();
  }
});

function getTargetPost() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'ai-jobs-india-2026';
  return NS_BLOG_POSTS.find(p => p.slug === id || p.id === parseInt(id,10)) || NS_BLOG_POSTS[0];
}

function populateArticle(post) {
  // Title & Head
  document.title = `${post.title} — Nova Skills Blog`;
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = `${post.title} — Nova Skills Blog`;

  const metaDesc = document.getElementById('meta-desc');
  if (metaDesc) metaDesc.content = post.excerpt;
  const ogTitle = document.getElementById('og-title');
  if (ogTitle) ogTitle.content = post.title;
  const ogDesc = document.getElementById('og-desc');
  if (ogDesc) ogDesc.content = post.excerpt;

  // Breadcrumb & Header
  const bcTitle = document.getElementById('breadcrumb-article-title');
  if (bcTitle) bcTitle.textContent = post.title.substring(0, 30) + '...';

  const category = document.getElementById('article-category');
  if (category) category.textContent = post.category;

  const title = document.getElementById('article-title');
  if (title) title.textContent = post.title;

  const avatar = document.getElementById('article-author-avatar');
  if (avatar) avatar.textContent = getInitials(post.author);

  const authorName = document.getElementById('article-author-name');
  if (authorName) authorName.textContent = post.author;

  const authorRole = document.getElementById('article-author-role');
  if (authorRole) authorRole.textContent = post.authorRole;

  const date = document.getElementById('article-date');
  if (date) date.textContent = formatDate(post.date);

  const readTime = document.getElementById('article-read-time');
  if (readTime) readTime.textContent = `${post.readTime} min read`;

  // Hero graphic
  const heroGraphic = document.getElementById('article-hero-graphic');
  if (heroGraphic) {
    heroGraphic.style.background = getCategoryGradient(post.category);
    heroGraphic.innerHTML = `<span style="font-size:5rem; filter:drop-shadow(0 12px 24px rgba(0,0,0,0.3));">${getCategoryEmoji(post.category)}</span>`;
  }

  // Article Body Prose
  const body = document.getElementById('article-body');
  if (body) {
    body.innerHTML = `
      <p class="article-excerpt"><strong>Summary:</strong> ${post.excerpt}</p>

      <h2 id="section-1">1. Executive Overview & Industry Trends</h2>
      <p>
        The Indian job market is undergoing a massive transformation. As companies rapidly adopt AI, automation, and data-driven marketing, traditional skillsets are giving way to practical, tech-enabled competencies.
      </p>
      <p>
        According to recent industry reports, over 70% of companies in India are actively hiring professionals with practical experience in AI tools, digital strategy, full-stack programming, and creative design.
      </p>

      <div class="callout">
        <strong>💡 Key Insight:</strong> Employers no longer look at paper degrees. What matters is your portfolio of real projects, hands-on tool mastery, and proven ability to deliver results from day one.
      </div>

      <h2 id="section-2">2. Core Skills Demanded by Top Employers</h2>
      <p>Here are the non-negotiable skills driving hiring decisions across India's top tech hubs (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune):</p>
      <ul>
        <li><strong>AI Tools & Prompt Engineering:</strong> ChatGPT, Claude, Midjourney, n8n workflow automation.</li>
        <li><strong>Performance Marketing:</strong> Meta Ads Manager, Google Ads Performance Max, GA4 Analytics.</li>
        <li><strong>Full-Stack & No-Code Development:</strong> WordPress, Webflow, Python, JavaScript, REST APIs.</li>
        <li><strong>Creative & Visual Media:</strong> Figma, Photoshop, Premiere Pro, DaVinci Resolve color grading.</li>
      </ul>

      <blockquote id="section-3">
        "The fastest way to double your salary potential in 2026 is to combine domain expertise with AI automation. Professionals who master AI tools complete 5 days of work in 1 day."
      </blockquote>

      <h2 id="section-4">4. Step-by-Step Action Plan to Get Hired</h2>
      <ol>
        <li><strong>Identify Your Niche:</strong> Choose 1 of Nova Skills' 12 specialized Academies based on your natural strengths.</li>
        <li><strong>Build Live Projects:</strong> Complete at least 4 capstone projects to demonstrate real-world competence.</li>
        <li><strong>Optimise Your Online Presence:</strong> Craft an ATS-friendly resume and a compelling LinkedIn profile.</li>
        <li><strong>Leverage Placement Support:</strong> Connect directly with Nova Skills' network of 250+ hiring partners.</li>
      </ol>

      <h2 id="section-5">5. Conclusion & Next Steps</h2>
      <p>
        The future belongs to proactive learners. Whether you want to land a full-time corporate role, switch careers, or build a 6-figure freelance business from home, practical skills are your ultimate currency.
      </p>
    `;
  }

  // Author Box
  const authorAvatarLg = document.getElementById('author-avatar-lg');
  if (authorAvatarLg) authorAvatarLg.textContent = getInitials(post.author);

  const authorNameFull = document.getElementById('author-name-full');
  if (authorNameFull) authorNameFull.textContent = post.author;

  const authorRoleFull = document.getElementById('author-role-full');
  if (authorRoleFull) authorRoleFull.textContent = `${post.authorRole} at Nova Skills`;
}

function buildTableOfContents() {
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;

  const headings = document.querySelectorAll('#article-body h2');
  if (headings.length === 0) return;

  tocList.innerHTML = Array.from(headings).map((h, i) => `
    <div class="toc-item">
      <a href="#${h.id}">
        <span class="toc-num">${i + 1}</span>
        <span>${h.textContent.replace(/^\d+\.\s*/, '')}</span>
      </a>
    </div>
  `).join('');
}

function renderRelatedArticles(currentPost) {
  const container = document.getElementById('related-articles-grid');
  if (!container) return;

  const related = NS_BLOG_POSTS
    .filter(p => p.id !== currentPost.id)
    .slice(0, 3);

  container.innerHTML = related.map(p => `
    <article class="blog-card">
      <div class="blog-card-thumb" style="background:${getCategoryGradient(p.category)}; color:white; height:150px;">
        <span style="font-size:2.5rem;">${getCategoryEmoji(p.category)}</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-category">${p.category}</div>
        <h3 class="blog-card-title" style="font-size:1rem;"><a href="blog-detail.html?id=${p.slug}">${p.title}</a></h3>
        <a href="blog-detail.html?id=${p.slug}" class="blog-read-more">Read Article →</a>
      </div>
    </article>
  `).join('');
}

function bindCommentForm() {
  const form = document.getElementById('comment-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    if (btn) {
      btn.textContent = 'Comment Submitted for Review! ✅';
      btn.style.background = 'var(--green)';
      btn.disabled = true;
    }
  });

  document.getElementById('article-newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    if (btn) {
      btn.textContent = 'Subscribed! 🎉';
      btn.disabled = true;
    }
  });
}

// Social Share Handlers
window.shareTwitter = (e) => {
  e.preventDefault();
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(document.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
};

window.shareLinkedIn = (e) => {
  e.preventDefault();
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
};

window.shareWhatsApp = (e) => {
  e.preventDefault();
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(document.title + ' ' + window.location.href)}`, '_blank');
};

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getCategoryEmoji(cat) {
  const map = {
    'Career Advice': '🎯', 'Digital Marketing': '📊', 'Design': '🎨',
    'Freelancing': '💼', 'AI & Technology': '🤖', 'Content Creation': '🎥',
    'Kids Education': '👨‍💻', 'Programming': '💻',
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
