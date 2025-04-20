import { 
  collection, 
  getDocs, 
  query, 
  where,
  addDoc,
  orderBy, 
  limit 
} from 'firebase/firestore';
import type { BlogPost } from '../types/blog';
import { db } from '@/lib/firebase';

// Collection reference
const blogCollection = collection(db, 'blog-posts');

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const q = query(blogCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      } as BlogPost);
    });
    
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const q = query(blogCollection, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

// Get featured blog posts
export async function getFeaturedBlogPosts(count: number = 3): Promise<BlogPost[]> {
  try {
    const q = query(
      blogCollection, 
      where('featured', '==', true), 
      orderBy('date', 'desc'), 
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    
    const posts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      } as BlogPost);
    });
    
    return posts;
  } catch (error) {
    console.error("Error fetching featured blog posts:", error);
    return [];
  }
}

// Get related blog posts
export async function getRelatedBlogPosts(
  currentPostId: string, 
  tags: string[], 
  count: number = 2
): Promise<BlogPost[]> {
  try {
    // This is a bit tricky in Firestore, as we can't do complex array operations
    // So we'll get more posts and filter client-side
    const q = query(blogCollection, orderBy('date', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    
    const posts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      if (doc.id !== currentPostId) {
        const post = doc.data() as BlogPost;
        // Check if any tags match
        if (post.tags.some(tag => tags.includes(tag))) {
          posts.push({
            ...post,
            id: doc.id
          } as BlogPost);
        }
      }
    });
    
    return posts.slice(0, count);
  } catch (error) {
    console.error("Error fetching related blog posts:", error);
    return [];
  }
}


export async function addBlogPost(blogData: Omit<BlogPost, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(blogCollection, {
      ...blogData,
      createdAt: new Date(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding blog post:", error);
    throw error;
  }
}