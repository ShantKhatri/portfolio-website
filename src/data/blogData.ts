export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'modern-react-best-practices',
    title: 'Modern React Best Practices for 2025',
    excerpt: 'Discover the latest patterns and practices for building efficient React applications.',
    content: '...',
    coverImage: '/images/blog/react-best-practices.jpg',
    date: 'April 10, 2025',
    readTime: '6 min read',
    tags: ['React', 'Frontend', 'Best Practices'],
    featured: true
  },
  {
    id: '2',
    slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns You Should Know',
    excerpt: 'Take your TypeScript skills to the next level with these advanced patterns.',
    content: '...',
    coverImage: '/images/blog/typescript.jpg',
    date: 'March 25, 2025',
    readTime: '8 min read',
    tags: ['TypeScript', 'Programming', 'Advanced']
  },
  {
    id: '3',
    slug: 'nextjs-vs-remix',
    title: 'Next.js vs Remix: Choosing the Right Framework',
    excerpt: 'A detailed comparison to help you choose between Next.js and Remix.',
    content: '...',
    coverImage: '/images/blog/nextjs-remix.jpg',
    date: 'March 15, 2025',
    readTime: '5 min read',
    tags: ['Next.js', 'Remix', 'Web Development']
  },
  {
    id: '4',
    slug: 'future-of-web-development',
    title: 'The Future of Web Development: Trends to Watch',
    excerpt: 'Exploring upcoming technologies that will shape the future of web development.',
    content: '...',
    coverImage: '/images/blog/future-web.jpg',
    date: 'March 5, 2025',
    readTime: '7 min read',
    tags: ['Web Development', 'Trends', 'Future Tech']
  }
];