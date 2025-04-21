import { collection, query, where, orderBy, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CommentData {
  postId: string;
  slug: string;
  name: string;
  email: string;
  text: string;
  createdAt: Date | { toDate(): Date } | string | number;
  isApproved: boolean;
  parentId?: string;
}

export interface Comment extends CommentData {
  id: string;
  replies?: Comment[];
}

// Add new comment
export async function addComment(commentData: CommentData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'comments'), commentData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

// Get all comments for a post
export async function getCommentsForPost(slug: string): Promise<Comment[]> {
  try {
    // First get parent comments
    const parentCommentsQuery = query(
      collection(db, 'comments'),
      where('slug', '==', slug),
      where('isApproved', '==', true),
      where('parentId', '==', undefined),
      orderBy('createdAt', 'desc')
    );
    
    const parentSnapshot = await getDocs(parentCommentsQuery);
    const parentComments = parentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
    
    // Get all replies
    const repliesQuery = query(
      collection(db, 'comments'),
      where('slug', '==', slug),
      where('parentId', '!=', undefined),
      where('isApproved', '==', true),
      orderBy('parentId'),
      orderBy('createdAt')
    );
    
    const repliesSnapshot = await getDocs(repliesQuery);
    const replies = repliesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Comment[];
    
    // Organize replies under their parent comments
    const commentsWithReplies = parentComments.map(comment => {
      const commentReplies = replies.filter(reply => reply.parentId === comment.id);
      return {
        ...comment,
        replies: commentReplies.length > 0 ? commentReplies : undefined
      };
    });
    
    return commentsWithReplies;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
}

// Delete a comment
export async function deleteComment(commentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}