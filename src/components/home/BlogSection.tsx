import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

// Create some sample blog posts if you don't have a data file

const blogPosts = [
  {
    id: '1',
    title: 'Understanding React Hooks',
    slug: 'understanding-react-hooks',
    excerpt: 'A deep dive into the world of React Hooks and how to use them effectively.',
    date: '2023-10-01',
    readTime: '5 min read',
    tags: ['React', 'JavaScript'],
    coverImage: '/images/blog/react-hooks.jpg'
  },
  {
    id: '2',
    title: 'CSS Grid vs Flexbox',
    slug: 'css-grid-vs-flexbox',
    excerpt: 'Comparing CSS Grid and Flexbox for layout design in web development.',
    date: '2023-09-15',
    readTime: '4 min read',
    tags: ['CSS', 'Web Design'],
    coverImage: '/images/blog/css-grid-vs-flexbox.jpg'
  },
  // Add more posts as needed
];

const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Latest Articles" 
          subtitle="Thoughts, tutorials and insights on web development"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden h-full hover:bg-gray-800/60 transform hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48">
                  <Image 
                    src={post.coverImage} 
                    alt={post.title}
                    fill
                    sizes="100%"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full flex items-center"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-full transition-all duration-300"
          >
            View all articles
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;