import { doc, getDoc, setDoc, increment, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const getUserId = (): string => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = `user_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('user_id', userId);
  }
  return userId;
};

export async function likePost(postId: string, postSlug: string): Promise<number> {
  try {
    const userId = getUserId();
    
    const userLikeRef = doc(db, 'likes', `${userId}_${postId}`);
    
    const postLikeCounterRef = doc(db, 'likeCounts', postId);
    
    const userLikeDoc = await getDoc(userLikeRef);
    
    if (!userLikeDoc.exists()) {
      await setDoc(userLikeRef, {
        userId,
        postId,
        postSlug,
        createdAt: new Date()
      });
      
      await setDoc(postLikeCounterRef, {
        count: increment(1),
        postId,
        postSlug
      }, { merge: true });
      
      const updatedCountDoc = await getDoc(postLikeCounterRef);
      return updatedCountDoc.exists() ? updatedCountDoc.data().count : 1;
    }
    
    const currentCountDoc = await getDoc(postLikeCounterRef);
    return currentCountDoc.exists() ? currentCountDoc.data().count : 0;
  } catch (error) {
    console.error("Error liking post:", error);
    if (error instanceof Error) {
      console.log(`Firebase error details: ${error.message}`);
    }
    return getPostLikeCount(postId);
  }
}

export async function unlikePost(postId: string): Promise<number> {
  try {
    const userId = getUserId();
    
    const userLikeRef = doc(db, 'likes', `${userId}_${postId}`);
    
    const postLikeCounterRef = doc(db, 'likeCounts', postId);
    
    const userLikeDoc = await getDoc(userLikeRef);
    
    if (userLikeDoc.exists()) {
      await deleteDoc(userLikeRef);
      
      await setDoc(postLikeCounterRef, {
        count: increment(-1)
      }, { merge: true });
      
      const updatedCountDoc = await getDoc(postLikeCounterRef);
      return updatedCountDoc.exists() ? updatedCountDoc.data().count : 0;
    }
    
    const currentCountDoc = await getDoc(postLikeCounterRef);
    return currentCountDoc.exists() ? currentCountDoc.data().count : 0;
  } catch (error) {
    console.error("Error unliking post:", error);
    if (error instanceof Error) {
      console.log(`Firebase error details: ${error.message}`);
    }
    return getPostLikeCount(postId);
  }
}

export async function hasUserLikedPost(postId: string): Promise<boolean> {
  try {
    const userId = getUserId();
    const userLikeRef = doc(db, 'likes', `${userId}_${postId}`);
    const userLikeDoc = await getDoc(userLikeRef);
    return userLikeDoc.exists();
  } catch (error) {
    console.error("Error checking if user liked post:", error);
    if (error instanceof Error) {
      console.log(`Firebase error details: ${error.message}`);
    }
    return false;
  }
}

export async function getPostLikeCount(postId: string): Promise<number> {
  try {
    const postLikeCounterRef = doc(db, 'likeCounts', postId);
    const postLikeCounterDoc = await getDoc(postLikeCounterRef);
    
    return postLikeCounterDoc.exists() ? postLikeCounterDoc.data().count : 0;
  } catch (error) {
    console.error("Error getting post like count:", error);
    if (error instanceof Error) {
      console.log(`Firebase error details: ${error.message}`);
    }
    return 0;
  }
}

export async function ensureLikeCounterExists(postId: string, postSlug: string): Promise<void> {
  const postLikeCounterRef = doc(db, 'likeCounts', postId);
  const postLikeCounterDoc = await getDoc(postLikeCounterRef);
  
  if (!postLikeCounterDoc.exists()) {
    await setDoc(postLikeCounterRef, {
      count: 0,
      postId,
      postSlug,
      updatedAt: new Date()
    });
  }
}

export function subscribeToLikeCount(
  postId: string, 
  onUpdate: (count: number) => void,
  onError: (error: Error) => void
): () => void {
  const postLikeCounterRef = doc(db, 'likeCounts', postId);
  
  // Create the unsubscribe function
  const unsubscribe = onSnapshot(
    postLikeCounterRef,
    (doc) => {
      const count = doc.exists() ? doc.data().count : 0;
      onUpdate(count);
    },
    (error) => {
      console.error("Error in like count subscription:", error);
      onError(error);
    }
  );
  
  return unsubscribe;
}