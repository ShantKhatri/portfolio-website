"use client"
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, ArrowLeft, ImagePlus, X, Plus, Check } from 'lucide-react';
import { getBlogPostById, updateBlogPost } from '@/services/blogService';
import { uploadBlogImage } from '@/services/storageService';
import AdminHeader from '@/components/admin/AdminHeader';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import type { BlogPost } from '@/types/blog';

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    featured: false,
  });

  // Fetch blog post data
  useEffect(() => {
    async function fetchBlogPost() {
      try {
        const post = await getBlogPostById(id);
        if (post) {
          // Populate form data
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            date: post.date || new Date().toLocaleDateString(),
            readTime: post.readTime || '5 min read',
            featured: post.featured || false,
          });
          
          // Set image preview from existing image
          setImagePreview(post.coverImage);
          setExistingImagePath(post.coverImage);
          
          // Set tags
          if (post.tags && Array.isArray(post.tags)) {
            setTags(post.tags);
          }
        } else {
          setError('Blog post not found');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBlogPost();
  }, [id]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Auto-generate slug when title changes if slug field wasn't manually edited
    if (name === 'title') {
      setFormData({
        ...formData,
        title: value,
        slug: formData.slug === generateSlug(formData.title) ? generateSlug(value) : formData.slug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    
    if (existingImagePath) {
      // If we're removing an existing image, go back to it
      setImagePreview(existingImagePath);
    } else {
      setImagePreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.title || !formData.content) {
        throw new Error('Please fill all required fields');
      }

      let updatedImagePath = existingImagePath;
      
      // Upload new image if selected
      if (imageFile) {
        updatedImagePath = await uploadBlogImage(imageFile);
      }
      
      if (!updatedImagePath) {
        throw new Error('Cover image is required');
      }
      
      // Create blog post data
      const blogData = {
        ...formData,
        coverImage: updatedImagePath,
        tags: tags,
        updatedAt: new Date().toISOString(),
      };
      
      // Update blog post in database
      await updateBlogPost(id, blogData);
      
      setSuccess(true);
      
      // Redirect back to blog list after success
      setTimeout(() => {
        router.push('/admin/blog');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating the blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader />
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => router.push('/admin/blog')}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Blog Admin
          </button>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        </div>
        
        {success ? (
          <div className="bg-green-800/30 border border-green-700 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              <p>Blog post updated successfully!</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-800/30 border border-red-700 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <X className="w-5 h-5 mr-2 text-red-500" />
              <p>{error}</p>
            </div>
          </div>
        ) : null}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Blog Details</h2>
              
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block mb-1 font-medium">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                  required
                />
              </div>
              
              {/* Slug */}
              <div className="mb-4">
                <label htmlFor="slug" className="block mb-1 font-medium">
                  Slug <span className="text-gray-400 text-sm">(URL path)</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                />
              </div>
              
              {/* Excerpt */}
              <div className="mb-4">
                <label htmlFor="excerpt" className="block mb-1 font-medium">
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 h-24"
                  required
                />
              </div>
              
              {/* Cover Image */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">
                  Cover Image <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 flex flex-col items-center">
                  {imagePreview ? (
                    <div className="relative w-full">
                      <Image 
                        src={imagePreview} 
                        alt="Cover preview" 
                        width={400}
                        height={200}
                        className="rounded-md w-full h-40 object-cover"
                      />
                      <button 
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-black/60 p-1 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center p-6 text-gray-400 hover:text-white"
                    >
                      <ImagePlus className="w-10 h-10 mb-2" />
                      <span>Upload cover image</span>
                    </button>
                  )}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                  />
                </div>
                {!imageFile && !existingImagePath && (
                  <p className="text-sm text-gray-400 mt-1">
                    Use the same aspect ratio for all blog images for consistency
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Read Time */}
                <div className="mb-4">
                  <label htmlFor="readTime" className="block mb-1 font-medium">
                    Read Time
                  </label>
                  <select
                    id="readTime"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2"
                  >
                    <option value="3 min read">3 min read</option>
                    <option value="5 min read">5 min read</option>
                    <option value="7 min read">7 min read</option>
                    <option value="10 min read">10 min read</option>
                    <option value="15+ min read">15+ min read</option>
                  </select>
                </div>
                
                {/* Featured */}
                <div className="mb-4 flex items-center">
                  <label htmlFor="featured" className="font-medium mr-2">
                    Featured Post
                  </label>
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="w-6 h-6 bg-gray-800 border-gray-700 rounded"
                  />
                </div>
              </div>
              
              {/* Tags */}
              <div className="mb-6">
                <label className="block mb-1 font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <div key={tag} className="bg-gray-800 px-3 py-1 rounded-full flex items-center">
                      <span className="mr-1">{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-l-md px-4 py-2"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddTag}
                    className="bg-gray-800 border border-l-0 border-gray-700 rounded-r-md px-4"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Content</h2>
                <div className="flex bg-gray-800 rounded-md">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('edit')}
                    className={`px-4 py-1 rounded-md ${previewTab === 'edit' ? 'bg-purple-700' : ''}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('preview')}
                    className={`px-4 py-1 rounded-md ${previewTab === 'preview' ? 'bg-purple-700' : ''}`}
                  >
                    Preview
                  </button>
                </div>
              </div>
              
              {previewTab === 'edit' ? (
                <MarkdownEditor
                  value={formData.content}
                  onChange={(value) => setFormData({...formData, content: value})}
                  placeholder="Write your blog post content in Markdown..."
                />
              ) : (
                <div className="prose prose-invert prose-lg max-w-none bg-gray-800 border border-gray-700 rounded-md px-6 py-4 h-96 overflow-y-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formData.content || '*No content to preview*'}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-md font-medium flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Updating...
                </>
              ) : (
                'Update Blog Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}