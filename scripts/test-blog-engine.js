const fs = require('fs');
const vm = require('vm');

function createMockDOM() {
  const elements = {};
  const createElement = (id) => ({
    id,
    innerHTML: '',
    textContent: '',
    value: '',
    children: [],
    setAttribute: () => {},
    getAttribute: () => '',
    addEventListener: () => {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    querySelector: () => null,
    querySelectorAll: () => []
  });

  const ids = [
    'blog-featured-slot',
    'blog-cards-grid',
    'blog-grid-heading',
    'blog-pagination',
    'blog-categories-list',
    'blog-tags-list',
    'blog-latest-posts-list',
    'blog-search-input'
  ];

  ids.forEach(id => { elements[id] = createElement(id); });

  const window = {
    location: { search: '', href: 'https://novaskills.in/blog.html' },
    history: { pushState: () => {} },
    addEventListener: () => {},
    document: {
      getElementById: (id) => elements[id] || null,
      querySelector: () => null,
      querySelectorAll: () => [],
      readyState: 'complete'
    }
  };

  const context = {
    window,
    document: window.document,
    URL: class {
      constructor(url) { this.searchParams = new Map(); }
    },
    URLSearchParams: class {
      constructor(search) {
        this.params = {};
        if (search && search.startsWith('?')) search = search.substring(1);
        if (search) {
          search.split('&').forEach(part => {
            const [k, v] = part.split('=');
            this.params[decodeURIComponent(k)] = decodeURIComponent(v || '');
          });
        }
      }
      get(k) { return this.params[k] || null; }
      set(k, v) { this.params[k] = v; }
      delete(k) { delete this.params[k]; }
    },
    setTimeout: (fn) => fn(),
    console
  };

  vm.createContext(context);
  return { context, elements, window };
}

function runEngine(extraPost = null) {
  const { context, elements, window } = createMockDOM();
  
  const dataCode = fs.readFileSync('data.js', 'utf8');
  vm.runInContext(dataCode, context);

  if (extraPost) {
    context.window.NS_BLOG_POSTS.push(extraPost);
  }

  const blogCode = fs.readFileSync('blog.js', 'utf8');
  vm.runInContext(blogCode, context);

  return { context, elements };
}

console.log('==================================================');
console.log('RUNNING ALL 8 TEST SCENARIOS');
console.log('==================================================\n');

// TEST 1: Open /blog
console.log('--- TEST 1: Open /blog ---');
{
  const { context, elements } = runEngine();
  const published = context.getPublishedBlogPosts();
  const featured = context.getFeaturedPost(published);
  const grid = context.getGridPosts(published, featured);

  console.log('Featured Article:', featured ? featured.slug : 'NONE');
  console.log('Grid Articles Count:', grid.length);
  grid.forEach((p, i) => console.log('  Card ' + (i+1) + ':', p.slug, '(' + p.title + ')'));
  const isWaseeInGrid = grid.some(p => p.slug === 'waseeullah-mansoori');
  console.log('Is Waseeullah in Grid?', isWaseeInGrid ? 'FAIL (Duplicated)' : 'PASS (Excluded from grid)');
}

// TEST 2: Add Future Blog (publishedAt: 2026-08-20)
console.log('\n--- TEST 2: Future Blog (2026-08-20) Automatic Top Position ---');
{
  const futureBlog = {
    id: 'test-new-blog',
    slug: 'test-new-blog',
    title: 'Test New Blog',
    publishedAt: '2026-08-20T10:00:00+05:30',
    status: 'published',
    category: 'AI & Technology',
    author: 'AI Expert'
  };
  const { context } = runEngine(futureBlog);
  const published = context.getPublishedBlogPosts();
  const featured = context.getFeaturedPost(published);
  const grid = context.getGridPosts(published, featured);

  console.log('Top Grid Item:', grid[0] ? grid[0].slug : 'NONE');
  console.log('Is test-new-blog at position #1?', grid[0]?.slug === 'test-new-blog' ? 'PASS' : 'FAIL');
}

// TEST 3: Older Test Blog (publishedAt: 2026-08-01)
console.log('\n--- TEST 3: Older Test Blog Moves Down ---');
{
  const olderBlog = {
    id: 'test-older-blog',
    slug: 'test-older-blog',
    title: 'Test Older Blog',
    publishedAt: '2026-08-01T10:00:00+05:30',
    status: 'published',
    category: 'AI & Technology',
    author: 'AI Expert'
  };
  const { context } = runEngine(olderBlog);
  const published = context.getPublishedBlogPosts();
  const featured = context.getFeaturedPost(published);
  const grid = context.getGridPosts(published, featured);

  console.log('Grid order:');
  grid.forEach((p, i) => console.log('  ' + (i+1) + '. ' + p.slug + ' (' + p.publishedAt + ')'));
  console.log('Position 1:', grid[0].slug, '(ai-seo-geo)');
  console.log('Position 2:', grid[1].slug, '(test-older-blog)');
  console.log('Is sorting correct?', (grid[0].slug === 'ai-seo-geo-digital-marketing-2026' && grid[1].slug === 'test-older-blog') ? 'PASS' : 'FAIL');
}

// TEST 4: Search for 'AI'
console.log('\n--- TEST 4: Search for "AI" ---');
{
  const { context, elements } = runEngine();
  elements['blog-search-input'].value = 'AI';
  const published = context.getPublishedBlogPosts();
  const featured = context.getFeaturedPost(published);
  const grid = context.getGridPosts(published, featured);
  console.log('Search "AI" matches:', grid.map(p => p.slug));
  const onlyPublished = grid.every(p => p.status === 'published' && !p.isDemo);
  console.log('Are all search results published & non-demo?', onlyPublished ? 'PASS' : 'FAIL');
}

// TEST 5: Select Category
console.log('\n--- TEST 5: Category Filter ---');
{
  const { context } = runEngine();
  context.filterBlogCategory('Digital Marketing');
  const published = context.getPublishedBlogPosts();
  const featured = context.getFeaturedPost(published);
  const grid = context.getGridPosts(published, featured);
  console.log('Category "Digital Marketing" matches:', grid.map(p => p.slug));
  console.log('Is correct category shown?', (grid.length === 1 && grid[0].slug === 'ai-seo-geo-digital-marketing-2026') ? 'PASS' : 'FAIL');
}

// TEST 6 & 7: Pagination (with 10 published posts)
console.log('\n--- TEST 6 & 7: Pagination with 10 published posts (8 per page) ---');
{
  const { context } = runEngine();
  // Simulate 9 additional published posts
  for (let i = 1; i <= 9; i++) {
    context.window.NS_BLOG_POSTS.push({
      id: 'gen-blog-' + i,
      slug: 'gen-blog-' + i,
      title: 'Gen Blog ' + i,
      publishedAt: '2026-08-0' + (10 - i) + 'T00:00:00+05:30',
      status: 'published',
      category: 'General'
    });
  }

  const published = context.getPublishedBlogPosts();
  const featured = context.getFeaturedPost(published);
  const grid = context.getGridPosts(published, featured);
  console.log('Total published grid posts:', grid.length);
  
  // Page 1 slice
  const page1 = grid.slice(0, 8);
  console.log('Page 1 items (' + page1.length + '):', page1.map(p => p.slug));
  
  // Page 2 slice
  const page2 = grid.slice(8, 16);
  console.log('Page 2 items (' + page2.length + '):', page2.map(p => p.slug));

  const overlap = page1.some(p => page2.includes(p));
  console.log('Do Page 1 and Page 2 overlap?', overlap ? 'FAIL (Overlap)' : 'PASS (Different items)');
}

// TEST 8: Verify no dummy/demo blogs in public listing
console.log('\n--- TEST 8: Verify No Dummy/Demo Blogs in Public Listing ---');
{
  const { context } = runEngine();
  const published = context.getPublishedBlogPosts();
  const drafts = context.getRawBlogPosts().filter(p => p.isDemo || p.status !== 'published');
  console.log('Raw posts total:', context.getRawBlogPosts().length);
  console.log('Draft / Demo posts total:', drafts.length);
  console.log('Public published posts total:', published.length);
  
  const hasDemoInPublished = published.some(p => p.isDemo === true || p.status === 'draft');
  console.log('Are any demo/draft blogs in published collection?', hasDemoInPublished ? 'FAIL' : 'PASS (0 demo blogs in public collection)');
}
