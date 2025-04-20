"use client"
import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogContentProps {
  content: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  return (
    <div className="blog-content prose prose-invert lg:prose-xl max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Override img to use Next.js Image
          img: ({ ...props }) => {
            const { src, alt } = props;
            return (
              <div className="my-8 relative">
                <Image
                  src={src || ''}
                  alt={alt || 'Blog image'}
                  width={800}
                  height={450}
                  className="rounded-lg mx-auto"
                />
              </div>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default BlogContent;