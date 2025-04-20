import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  DocumentData,
  serverTimestamp,
  Query
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Types
export interface FirestoreData {
  [key: string]: any;
}

// Wrapped Firestore functions that include authentication token
export async function getDocumentsWithAuth<T = DocumentData>(collectionPath: string, queryFn?: (q: Query) => Query): Promise<T[]> {
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('firebaseToken') : null;
    console.log(`Getting documents from ${collectionPath}. Token exists: ${!!token}`);

    if (!token && auth.currentUser) {
      try {
        const freshToken = await auth.currentUser.getIdToken(true);
        sessionStorage.setItem('firebaseToken', freshToken);
        console.log("Fresh token generated during document fetch");
      } catch (tokenError) {
        console.error("Failed to get fresh token:", tokenError);
      }
    }
    
    let q = collection(db, collectionPath);
    if (queryFn) {
      q = queryFn(q as any) as any;
    }
    
    const querySnapshot = await getDocs(q);
    const documents: T[] = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      } as unknown as T);
    });
    
    return documents;
  } catch (error) {
    console.error(`Error fetching documents from ${collectionPath}:`, error);
    throw error;
  }
}

export async function getDocumentWithAuth<T = DocumentData>(collectionPath: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as unknown as T;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching document ${docId} from ${collectionPath}:`, error);
    throw error;
  }
}

export async function updateDocumentWithAuth(collectionPath: string, docId: string, data: FirestoreData): Promise<void> {
  try {
    const docRef = doc(db, collectionPath, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionPath}:`, error);
    throw error;
  }
}

export async function addDocumentWithAuth(collectionPath: string, data: FirestoreData): Promise<string> {
  try {
    const collectionRef = collection(db, collectionPath);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionPath}:`, error);
    throw error;
  }
}

export async function deleteDocumentWithAuth(collectionPath: string, docId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionPath, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionPath}:`, error);
    throw error;
  }
}