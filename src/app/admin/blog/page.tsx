"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Edit, Plus, Loader2, Search } from 'lucide-react';
import { getAllBlogPosts } from '@/services/blogService';
import type { BlogPost } from '@/types/blog';

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const blogData = await getAllBlogPosts();
        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBlogs();
  }, []);
  
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
          <Link 
            href="/admin/blog/new"
            className="flex items-center bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
          >
            <Plus className="w-5 h-5 mr-2" /> New Blog Post
          </Link>
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md"
            />
          </div>
        </div>
        
        {/* Blog List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No blog posts found</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left">Image</th>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Tags</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredBlogs.map(blog => (
                  <tr key={blog.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{blog.title}</p>
                      <p className="text-sm text-gray-400 truncate max-w-xs">{blog.excerpt}</p>
                    </td>
                    <td className="px-6 py-4">{blog.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                            +{blog.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/admin/blog/edit/${blog.id}`}
                          className="p-2 bg-blue-900/30 hover:bg-blue-900/50 rounded-md"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          className="p-2 bg-red-900/30 hover:bg-red-900/50 rounded-md"
                          onClick={() => {/* Add delete logic here */}}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogList;