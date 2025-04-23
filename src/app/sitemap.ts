import { getAllBlogPosts } from '@/services/blogService';

export default async function sitemap() {
  // Get all blog posts
  const posts = await getAllBlogPosts();
  
  // Generate blog post URLs
  const blogUrls = posts.map((post) => ({
    url: `https://prashantkhatri.com/blog/${post.slug}`,
    lastModified: post.updatedAt || post.date,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Static URLs
  const routes = [
    '',
    '/blog',
    '/about',
    '/contact',
    '/projects',
  ].map((route) => ({
    url: `https://prashantkhatri.com${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.9,
  }));

  return [...routes, ...blogUrls];
};