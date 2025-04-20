import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deleteImage } from './storageService';
import type { BlogPost } from '@/types/blog';

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

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const docRef = doc(db, 'blog-posts', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as BlogPost;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }
}

// Update an existing blog post
export async function updateBlogPost(id: string, postData: any): Promise<void> {
  try {
    const docRef = doc(db, 'blog-posts', id);
    
    const updatedData = {
      ...postData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: string, coverImagePath?: string): Promise<void> {
  try {
    // First, delete the document from Firestore
    const docRef = doc(db, 'blog-posts', id);
    await deleteDoc(docRef);
    
    // If a cover image path is provided, delete the image too
    if (coverImagePath) {
      const imagePath = coverImagePath.includes('firebasestorage') 
        ? coverImagePath.split('/o/')[1].split('?')[0].replace(/%2F/g, '/') 
        : coverImagePath;
        
      await deleteImage(imagePath);
    }
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
}