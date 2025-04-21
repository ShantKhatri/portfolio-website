"use client"
import React, { useEffect, useState} from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Clock, Calendar, Tag, 
  // Share2,
  Bookmark, 
  ThumbsUp, MessageSquare, Copy, 
  // ChevronUp,
   Facebook, Twitter, Linkedin, 
  //  CheckCheck
} from 'lucide-react';
import { format } from 'date-fns';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import rehypeSanitize from 'rehype-sanitize';
// import rehypeSlug from 'rehype-slug';
// import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import ParticleBackground from '../../../components/ui/ParticleBackground';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/services/blogService';
import type { BlogPost } from '@/types/blog';
import { addComment, getCommentsForPost, CommentData } from '@/services/commentService';

// Add type definitions for comments
interface Comment {
  id: string;
  name: string;
  email: string;
  text: string;
  createdAt: Date | { toDate(): Date } | string | number;
  replies?: Reply[];
}

interface Reply {
  id: string;
  name: string;
  text: string;
  createdAt: Date | { toDate(): Date } | string | number;
}

// const processMarkdown = (content: string) => {
//   if (!content) return '';
  
//   // Fix common markdown formatting issues
//   return content
//     // Replace escaped newlines with actual newlines
//     .replace(/\\n/g, "\n")
//     // Ensure headers have spaces after #
//     .replace(/^(#{1,6})([^#\s])/gm, '$1 $2')
//     // Ensure proper spacing around lists
//     .replace(/^(-|\d+\.)\s*([^\n])/gm, '$1 $2')
//     // Fix table formatting if needed
//     .replace(/\|(\S)/g, '| $1')
//     .replace(/(\S)\|/g, '$1 |');
// };

const BlogPostPage: React.FC = () => {
  const pathname = usePathname();
  const slug = pathname.split('/').pop();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      
      try {
        if (!slug) return;
        
        const postData = await getBlogPostBySlug(slug);
        
        if (postData) {
          setPost(postData);
          
          // Get related posts based on tags
          const related = await getRelatedBlogPosts(postData.id, postData.tags, 2);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Add these functions to your component

  // Format dates for comments
  const formatDate = (timestamp: Date | { toDate(): Date } | string | number | null) => {
    if (!timestamp) return '';
    
    // Handle Firebase timestamp
    const date = timestamp && typeof timestamp === 'object' && 'toDate' in timestamp
      ? timestamp.toDate()
      : new Date(timestamp);
    
    return format(date, 'MMM d, yyyy • h:mm a');
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !commentName.trim() || !commentEmail.trim()) return;
    
    setIsSubmittingComment(true);
    
    try {
      const newComment: CommentData = {
        postId: post?.id || '',
        slug: post?.slug || '',
        name: commentName,
        email: commentEmail,
        text: commentText,
        createdAt: new Date(),
        isApproved: true, // Set to false if you want to moderate comments before they appear
      };
      
      const commentId = await addComment(newComment);
      
      // Add to local state so user sees their comment immediately
      const commentWithId = {
        ...newComment,
        id: commentId,
      };
      
      setComments(prev => [commentWithId as Comment, ...prev]);
      
      // Clear form
      setCommentText('');
      
      // Store name and email in localStorage for convenience
      localStorage.setItem('commentName', commentName);
      localStorage.setItem('commentEmail', commentEmail);
      
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle reply to comment
  const handleReplyClick = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText('');
  };

  // Handle reply submission
  const handleReplySubmit = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    
    if (!replyText.trim() || !commentName) return;
    
    const newReply = {
      id: `reply-${Date.now()}`,
      name: commentName || 'Anonymous',
      text: replyText,
      createdAt: new Date()
    };
    
    // Update comments state with the new reply
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId
          ? { 
              ...comment, 
              replies: [...(comment.replies || []), newReply]
            }
          : comment
      )
    );
    
    // Reset form
    setReplyText('');
    setReplyingTo(null);
  };

  // Load saved name and email from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('commentName');
    const savedEmail = localStorage.getItem('commentEmail');
    
    if (savedName) setCommentName(savedName);
    if (savedEmail) setCommentEmail(savedEmail);
  }, []);

  // Fetch comments for this post
  useEffect(() => {
    if (!post?.slug) return;
    
    const fetchComments = async () => {
      try {
        const fetchedComments = await getCommentsForPost(post.slug);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    
    fetchComments();
  }, [post?.slug]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to share the article
  const handleShare = async (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post?.title || 'Check out this article';
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        const snackbar = document.createElement('div');
        snackbar.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        snackbar.textContent = 'Link copied to clipboard!';
        document.body.appendChild(snackbar);
        setTimeout(() => {
          document.body.removeChild(snackbar);
        }, 3000);
      } catch {
        alert('Failed to copy link. Please try again.');
      }
    }
  };

  // Handle liking the post
  const handleLikePost = () => {
    if (!liked) {
      setLikeCount(prev => prev + 1);
    } else {
      setLikeCount(prev => Math.max(0, prev - 1));
    }
    setLiked(!liked);
    
    // TODO: Store in database if needed
    localStorage.setItem(`liked_${post?.slug}`, (!liked).toString());
  };

  // Check if user previously liked this post
  useEffect(() => {
    if (!post?.slug) return;
    
    const hasLiked = localStorage.getItem(`liked_${post.slug}`) === 'true';
    setLiked(hasLiked);
    
    // TODO: Fetch actual like count from database
    setLikeCount(Math.floor(Math.random() * 20) + 5); // Dummy data
  }, [post?.slug]);

  // Extract headings for Table of Contents
  useEffect(() => {
    if (!post?.content) return;
    
    // Logic to extract headings would go here
    // For now, we'll just use dummy data
  }, [post?.content]);

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
      {/* Add Particle Background */}
      <ParticleBackground />
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

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
        {/* Floating Button Group */}
        <div className="fixed left-4 md:left-8 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col gap-3 z-40 bg-gray-900/60 backdrop-blur-sm p-2 rounded-lg shadow-lg floating-buttons">
          {/* Like Button with Tooltip */}
          <div className="relative group">
            <button 
              onClick={handleLikePost}
              className={`p-3 rounded-full transition-colors ${liked 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            >
              <ThumbsUp className="w-5 h-5" />
              {likeCount > 0 && <span className="block text-xs mt-1">{likeCount}</span>}
            </button>
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {liked ? 'Unlike' : 'Like'} this post
            </div>
          </div>
          
          {/* Comments Button */}
          <button
            onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="View comments"
          >
            <MessageSquare className="w-5 h-5" />
            {comments.length > 0 && <span className="block text-xs mt-1">{comments.length}</span>}
          </button>
          
          {/* Bookmark Button */}
          <button 
            onClick={() => {
              // Add bookmark functionality
              alert('Bookmark feature coming soon!')
            }}
            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Bookmark post"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          
          {/* Share Button */}
          <button 
            onClick={() => handleShare('copy')}
            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Copy link"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        {/* Social Share Buttons (Mobile) - Remove mt-2 from each button */}
        <div className="flex items-center justify-center gap-4 py-6 lg:hidden">
          <button 
            onClick={() => handleShare('facebook')} 
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
            aria-label="Share on Facebook"
          >
            <Facebook className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleShare('twitter')} 
            className="p-3 rounded-full bg-sky-500 hover:bg-sky-600 transition-colors"
            aria-label="Share on Twitter"
          >
            <Twitter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleShare('linkedin')} 
            className="p-3 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleShare('copy')} 
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors"
            aria-label="Copy link"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
        
        {/*// Article Content with ReactMarkdown
        {post && (
          <article className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeRaw,
                rehypeSanitize,
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }]
              ]}
              components={{
                h1: ({...props}) => <h1 className="text-3xl font-bold mt-8 mb-4 text-white" {...props} />,
                h2: ({...props}) => <h2 className="text-2xl font-bold mt-8 mb-3 text-white" {...props} />,
                h3: ({...props}) => <h3 className="text-xl font-bold mt-6 mb-3 text-white" {...props} />,
                p: ({...props}) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
                ul: ({...props}) => <ul className="mb-4 ml-4 list-disc space-y-2 text-gray-300" {...props} />,
                ol: ({...props}) => <ol className="mb-4 ml-4 list-decimal space-y-2 text-gray-300" {...props} />,
                li: ({...props}) => <li className="pl-1 leading-relaxed" {...props} />,
                blockquote: ({...props}) => (
                  <blockquote className="pl-4 border-l-4 border-purple-500 italic my-6 text-gray-400" {...props} />
                ),
                img: ({src, alt}) => (
                  <div className="my-8">
                    <Image 
                      src={src || ''} 
                      alt={alt || 'Blog image'} 
                      width={800} 
                      height={400} 
                      className="rounded-lg mx-auto"
                    />
                  </div>
                ),
                a: (props) => (
                  <a {...props} className="text-purple-400 hover:text-purple-300 transition-colors" />
                ),
                code: ({className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const isInline = !match;
                  const codeRef = useRef<HTMLPreElement>(null);
                  const [isCopied, setIsCopied] = useState(false);
                  
                  const handleCopyCode = () => {
                    if (codeRef.current) {
                      navigator.clipboard.writeText(codeRef.current.textContent || '');
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }
                  };
                  
                  return isInline ? (
                    <code className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-300" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="overflow-hidden rounded-md bg-gray-900 my-6 relative group">
                      <div className="flex justify-between items-center bg-gray-800 px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                        <span>{language}</span>
                        <button 
                          onClick={handleCopyCode}
                          className="text-gray-400 hover:text-white transition-colors focus:outline-none"
                          aria-label="Copy code"
                        >
                          {isCopied ? (
                            <CheckCheck className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <pre className="overflow-x-auto p-4 text-sm">
                        <code ref={codeRef} className={`language-${language}`}>{children}</code>
                      </pre>
                    </div>
                  );
                },
                pre: ({...props}) => <pre className="bg-transparent p-0" {...props} />,
                table: (props) => (
                  <div className="overflow-x-auto my-8">
                    <table className="min-w-full border-collapse border border-gray-800" {...props} />
                  </div>
                ),
                th: ({...props}) => (
                  <th className="px-4 py-2 bg-gray-800 border border-gray-700 text-left" {...props} />
                ),
                td: ({...props}) => (
                  <td className="px-4 py-2 border border-gray-800" {...props} />
                ),
                hr: ({...props}) => <hr className="my-8 border-gray-800" {...props} />,
                strong: ({...props}) => <strong className="font-bold text-white" {...props} />,
                em: ({...props}) => <em className="italic" {...props} />,
              }}
            >
              {processMarkdown(post.content)}
            </ReactMarkdown>
          </article>
        )} */}

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
              src="https://gjvntlanwutavbwg.public.blob.vercel-storage.com/profile-photo.jpg-jTPTZwUgndS6kHzvRr5yfTye1NMaWh.png" 
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

        {/* Comment Section */}
        <section className="mt-16 pt-8 border-t border-gray-800" id="comments-section">
          <h2 className="text-2xl font-bold mb-6">Discussion</h2>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-10">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-2">
                Share your thoughts
              </label>
              <textarea
                id="comment"
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Write your comment here..."
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your.email@example.com (not displayed publicly)"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmittingComment}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              {isSubmittingComment ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Submitting...
                </>
              ) : 'Post Comment'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center py-8 text-gray-400">Be the first to comment on this post!</p>
            ) : (
              <>
                <h3 className="font-medium text-gray-300">{comments.length} Comment{comments.length !== 1 && 's'}</h3>
                {comments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="flex items-center mb-2">
                      <div className="bg-purple-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-medium">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-white">{comment.name}</h4>
                        <p className="text-sm text-gray-400">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                    
                    {/* Reply button */}
                    <button 
                      onClick={() => handleReplyClick(comment.id)}
                      className="text-sm text-purple-400 hover:text-purple-300 mt-2 flex items-center"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" /> Reply
                    </button>
                    
                    {/* Nested replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="border-l-2 border-gray-700 pl-4 py-1">
                            <div className="flex items-center mb-1">
                              <div className="bg-gray-700 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
                                {reply.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-2">
                                <h5 className="font-medium text-white text-sm">{reply.name}</h5>
                                <p className="text-xs text-gray-400">{formatDate(reply.createdAt)}</p>
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply form (conditionally rendered) */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 ml-6">
                        <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-white text-sm mb-2"
                            placeholder="Write your reply..."
                            required
                          />
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors"
                            >
                              Post Reply
                            </button>
                            <button
                              type="button"
                              onClick={() => setReplyingTo(null)}
                              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

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

export default BlogPostPage;