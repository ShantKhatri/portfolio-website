"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import ParticleBackground from '../../../components/ui/ParticleBackground';
import Navbar from '../../../components/Navbar';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/services/blogService';
import type { BlogPost } from '@/types/blog';

const processMarkdown = (content: string) => {
  if (!content) return '';
  
  // Fix common markdown formatting issues
  return content
    // Replace escaped newlines with actual newlines
    .replace(/\\n/g, "\n")
    // Ensure headers have spaces after #
    .replace(/^(#{1,6})([^#\s])/gm, '$1 $2')
    // Ensure proper spacing around lists
    .replace(/^(-|\d+\.)\s*([^\n])/gm, '$1 $2')
    // Fix table formatting if needed
    .replace(/\|(\S)/g, '| $1')
    .replace(/(\S)\|/g, '$1 |');
};

const BlogPostPage: React.FC = () => {
  const pathname = usePathname();
  const slug = pathname.split('/').pop();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
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
        
        {/* Article Content with ReactMarkdown */}
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
                  
                  return isInline ? (
                    <code className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-300" {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className="overflow-hidden rounded-md bg-gray-900 my-6">
                      {language && (
                        <div className="bg-gray-800 px-4 py-1 text-sm text-gray-400 border-b border-gray-700">
                          {language}
                        </div>
                      )}
                      <pre className="overflow-x-auto p-4 text-sm">
                        <code className="language-{language}">{children}</code>
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
        )}

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

export default BlogPostPage;