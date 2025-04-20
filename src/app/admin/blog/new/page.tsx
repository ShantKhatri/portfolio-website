"use client"
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, ArrowLeft, ImagePlus, X, Plus, Check } from 'lucide-react';
import { addBlogPost } from '@/services/blogService';
import { uploadBlogImage } from '@/services/storageService';
import AdminHeader from '@/components/admin/AdminHeader';

const BlogUploadForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    
    // Auto-generate slug when title changes
    if (name === 'title') {
      setFormData({
        ...formData,
        title: value,
        slug: generateSlug(value),
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
    setImagePreview(null);
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
      if (!formData.title || !formData.content || !imageFile) {
        throw new Error('Please fill all required fields and upload a cover image.');
      }

      // Upload image to Firebase Storage
      const imagePath = await uploadBlogImage(imageFile);
      
      // Create blog post in Firestore
      const blogData = {
        ...formData,
        coverImage: imagePath,
        tags: tags,
        date: new Date().toLocaleString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }),
      };
      
      await addBlogPost(blogData);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        router.push('/admin/blog');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'An error occurred while uploading the blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        </div>
        
        {success ? (
          <div className="bg-green-800/30 border border-green-700 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              <p>Blog post published successfully!</p>
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
                  Slug <span className="text-gray-400 text-sm">(auto-generated)</span>
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
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 h-96 font-mono"
                  placeholder="Write your blog post content in Markdown..."
                  required
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
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publishing...
                </>
              ) : (
                'Publish Blog Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogUploadForm;