"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Bookmark } from 'lucide-react';
import ParticleBackground from '../../../components/ui/ParticleBackground';
import Navbar from '../../../components/Navbar';

// Import blog post type from your types file or define it here
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readTime: string;
  tags: string[];
}

// Sample blog posts data (in real app, you'd fetch this)
const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'modern-react-best-practices',
    title: 'Modern React Best Practices for 2025',
    excerpt: 'Discover the latest patterns and practices for building efficient React applications.',
    content: `
# Modern React Best Practices for 2025

React has evolved substantially since its inception, and as we move forward into 2025, several best practices have emerged that can significantly improve your development experience and application performance.

## 1. Use Functional Components with Hooks

Functional components with hooks have become the standard way of writing React components. They're more concise, easier to test, and generally lead to more readable code.

\`\`\`jsx
// Good practice
function UserProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div>
      <h2>{user.name}</h2>
      {isEditing ? (
        <EditForm user={user} />
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      )}
    </div>
  );
}
\`\`\`

## 2. Implement Code Splitting

As your application grows, bundle size becomes a concern. React.lazy and Suspense allow you to split your code into smaller chunks and load components only when needed.

\`\`\`jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <React.Suspense fallback={<Loading />}>
      <LazyComponent />
    </React.Suspense>
  );
}
\`\`\`

## 3. Use React Server Components

React Server Components are a game-changer for performance. They allow parts of your UI to be rendered on the server, reducing the bundle size and improving initial load performance.

## 4. State Management Considerations

While global state management libraries like Redux are still popular, consider if you really need them. React's Context API, combined with useReducer, can handle many use cases without additional dependencies.

## 5. Optimize Renders with Memo and Callbacks

Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders, especially in component trees with frequent updates.

\`\`\`jsx
const MemoizedComponent = React.memo(function MyComponent(props) {
  // Your component logic
});

function ParentComponent() {
  const handleClick = useCallback(() => {
    // Handle click logic
  }, []);
  
  const computedValue = useMemo(() => {
    return expensiveComputation(dep1, dep2);
  }, [dep1, dep2]);
  
  return <MemoizedComponent onClick={handleClick} value={computedValue} />;
}
\`\`\`

## 6. Type Everything with TypeScript

TypeScript has become essential for large React applications. It catches errors at compile time and improves code maintainability.

## 7. Adopt Modern Testing Practices

Use React Testing Library for component testing, focusing on testing behavior rather than implementation details.

## Conclusion

By following these practices, you'll build more maintainable, performant React applications that are prepared for the future of web development.
`,
    coverImage: '/images/blog/react-best-practices.jpg',
    date: 'April 10, 2025',
    readTime: '6 min read',
    tags: ['React', 'Frontend', 'Best Practices']
  },
  // Add other blog posts...
];

const BlogPostPage: React.FC = () => {
  const pathname = usePathname();
  const slug = pathname.split('/').pop();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    // Simulate data fetching
    setIsLoading(true);
    
    // Find the current post by slug
    const currentPost = blogPosts.find(p => p.slug === slug);
    
    if (currentPost) {
      setPost(currentPost);
      
      // Get related posts based on tags
      const related = blogPosts
        .filter(p => p.id !== currentPost.id && p.tags.some(tag => currentPost.tags.includes(tag)))
        .slice(0, 2);
      
      setRelatedPosts(related);
    }
    
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-400 mb-6">The post you`&apos;re looking for doesn`&apos;t exist or has been moved.</p>
          <Link href="/blog" className="px-6 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Add Navbar */}
      <Navbar />
      
      {/* Add Particle Background */}
      <ParticleBackground />
      
      {/* Hero with proper z-index */}
      <div className="relative h-[50vh] overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        <Image 
          src={post.coverImage} 
          alt={post.title} 
          fill
          style={{ objectFit: 'cover' }}
          className="z-0"
        />
        <div className="absolute inset-x-0 bottom-0 p-8 z-20 max-w-4xl mx-auto">
          <Link href="/blog" className="flex items-center text-gray-300 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center text-gray-300 gap-4">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> {post.date}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" /> {post.readTime}
            </span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link 
                  key={tag} 
                  href={`/blog?tag=${tag}`} 
                  className="flex items-center text-sm px-3 py-1 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1" /> {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your blog post page content with z-index */}
      <div className="max-w-4xl mx-auto px-8 py-12 relative z-10">
        {/* Floating Share Buttons */}
        <div className="fixed left-8 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col gap-4">
          <button className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
        
        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
        </article>

        {/* Tags - Mobile View */}
        <div className="mt-12 flex flex-wrap gap-2 lg:hidden">
          {post.tags.map(tag => (
            <Link 
              key={tag} 
              href={`/blog?tag=${tag}`} 
              className="flex items-center text-sm px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Tag className="w-3 h-3 mr-1" /> {tag}
            </Link>
          ))}
        </div>

        {/* Author Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex items-center">
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image 
                src="/images/author.jpg" 
                alt="Author" 
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Prashantkumar Khatri</h3>
              <p className="text-gray-400">Full Stack Developer & Automation Expert</p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map(relatedPost => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <div className="bg-gray-900/50 rounded-xl overflow-hidden group hover:bg-gray-800/70 transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-40 w-full">
                      <Image 
                        src={relatedPost.coverImage} 
                        alt={relatedPost.title} 
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <span>{relatedPost.date}</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {relatedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple markdown to HTML converter (In a real app, use a proper markdown library)
function markdownToHtml(markdown: string): string {
  // This is extremely simplified - use a proper markdown library in production
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // Convert paragraphs
  html = html.replace(/^(?!<h|```)(.*$)/gm, '<p>$1</p>');
  
  // Convert code blocks
  html = html.replace(/```(.*?)```/g, '<pre><code>$1</code></pre>');
  
  return html;
}

export default BlogPostPage;