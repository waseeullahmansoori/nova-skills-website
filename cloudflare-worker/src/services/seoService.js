/**
 * SEO Helper & Metadata Enrichment Service
 */

export function generateSlug(title) {
  if (!title) return 'nova-skills-article';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatSEOMetadata(title, content, focusKeyword = '') {
  const cleanTitle = (title || 'Nova Skills Course & Career Guide').slice(0, 60);
  const slug = generateSlug(cleanTitle);

  const cleanDesc = content 
    ? content.replace(/[\r\n]+/g, ' ').slice(0, 155) + '...'
    : 'Discover Nova Skills practical training courses with 100% placement & internship assistance.';

  const keywords = focusKeyword 
    ? [focusKeyword, 'nova skills', 'practical training', 'career courses']
    : ['digital marketing course', 'graphic design', 'web development', 'nova skills'];

  return {
    metaTitle: cleanTitle,
    metaDescription: cleanDesc,
    slug: slug,
    focusKeywords: keywords,
    schemaType: "Course",
    imageAltText: `${cleanTitle} - Nova Skills`
  };
}
