"use client"
import Layout from '../../components/layout/Layout';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Tag } from 'lucide-react';
import { blogPosts } from '@/data/blogData';

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags from blog posts
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));
  
  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => post.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-80 pt-20 mb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('/images/blog-bg.jpg')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-3xl px-6">
            <h1 className="text-5xl font-bold mb-4">The Blog</h1>
            <p className="text-xl text-gray-200">
              Insights, tutorials, and thoughts on web development, automation, and technology
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Search & Filters */}
        <div className="mb-12">
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          </div>

          <div>
            <h2 className="text-lg font-medium mb-3">Filter by Topic:</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag: any) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } transition-colors`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="bg-gray-900/50 rounded-xl overflow-hidden group hover:bg-gray-800/70 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <Image 
                      src={post.coverImage} 
                      alt={post.title} 
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Post content... */}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-20">
              <p className="text-2xl text-gray-400 mb-4">No posts found</p>
              <p className="text-gray-500">Try changing your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;