"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Edit, Plus, Loader2, Search } from 'lucide-react';
import { getAllBlogPosts, deleteBlogPost } from '@/services/blogService';
import type { BlogPost } from '@/types/blog';
import AdminHeader from '@/components/admin/AdminHeader';

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setIsLoading(true);
    try {
      const blogData = await getAllBlogPosts();
      setBlogs(blogData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blog posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  
  const openDeleteConfirmation = (id: string) => {
    setDeleteConfirmation(id);
  };
  
  const handleDelete = async (id: string, coverImage?: string) => {
    setIsDeleting(true);
    try {
      const blogToDelete = blogs.find(blog => blog.id === id);
      const blogTitle = blogToDelete?.title || 'Blog post';
      
      await deleteBlogPost(id, coverImage);
      
      setBlogs(blogs.filter(blog => blog.id !== id));
      setSuccess(`"${blogTitle}" has been deleted successfully.`);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error deleting blog post:", error);
      setError("Failed to delete blog post. Please try again.");
      
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation(null);
    }
  };
  
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader />
      <div className="p-8">
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
          
          {/* Status Messages */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-md mb-4">
              {success}
            </div>
          )}
          
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
                            onClick={() => openDeleteConfirmation(blog.id)}
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
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 max-w-md w-full p-6 rounded-lg shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this blog post? 
              This action cannot be undone and all associated data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={() => {
                  const blogToDelete = blogs.find(b => b.id === deleteConfirmation);
                  if (blogToDelete) {
                    handleDelete(deleteConfirmation, blogToDelete.coverImage);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogList;