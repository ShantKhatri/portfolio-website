import { getBlogPostBySlug } from "@/services/blogService";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }
  
  // Dynamic metadata generation
  export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
  ): Promise<Metadata> {
    // Get blog post data
    const post = await getBlogPostBySlug(params.slug);
    console.log('Parents:', parent);
    // If post not found, return default metadata
    if (!post) {
      return {
        title: 'Post Not Found - Prashant Khatri',
        description: 'The blog post you are looking for could not be found.'
      };
    }
    
    // Generate a description from content if needed
    const description = post.excerpt || post.content.substring(0, 160).replace(/[#*[\]]/g, '');
    
    // Extract keywords from tags and title
    const keywords = [...post.tags, ...post.title.split(' ').filter(word => word.length > 3)];
    
    return {
      title: `${post.title} | Prashant Khatri`,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: 'Prashantkumar Khatri' }],
      openGraph: {
        title: post.title,
        description,
        type: 'article',
        publishedTime: new Date(post.date).toISOString(),
        modifiedTime: post.updatedAt ? post.updatedAt.toDate().toISOString() : undefined,
        authors: ['Prashantkumar Khatri'],
        tags: post.tags,
        images: [
          {
            url: post.coverImage,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: [post.coverImage],
      },
      alternates: {
        canonical: `https://prashantkhatri.com/blog/${post.slug}`,
      }
    };
  }