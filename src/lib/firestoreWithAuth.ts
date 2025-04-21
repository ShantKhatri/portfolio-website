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
  Query,
  CollectionReference
} from 'firebase/firestore';
import { auth, db } from './firebase';

export interface FirestoreData {
  [key: string]: string | number | boolean | null | Date | FirestoreData[] | { [key: string]: unknown };
}

// Define generic helper type for document with ID
export type WithId<T> = T & { id: string };

// Wrapped Firestore functions that include authentication token
export async function getDocumentsWithAuth<T = DocumentData>(
  collectionPath: string, 
  queryFn?: (q: CollectionReference<DocumentData>) => Query<DocumentData>
): Promise<WithId<T>[]> {
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
    
    // Properly typed collection reference
    const collectionRef = collection(db, collectionPath);
    
    // Apply query function if provided
    const query = queryFn ? queryFn(collectionRef) : collectionRef;
    
    const querySnapshot = await getDocs(query);
    const documents: WithId<T>[] = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      } as WithId<T>);
    });
    
    return documents;
  } catch (error) {
    console.error(`Error fetching documents from ${collectionPath}:`, error);
    throw error;
  }
}

export async function getDocumentWithAuth<T = DocumentData>(
  collectionPath: string, 
  docId: string
): Promise<WithId<T> | null> {
  try {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as WithId<T>;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching document ${docId} from ${collectionPath}:`, error);
    throw error;
  }
}

export async function updateDocumentWithAuth(
  collectionPath: string, 
  docId: string, 
  data: Partial<FirestoreData>
): Promise<void> {
  try {
    const docRef = doc(db, collectionPath, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionPath}:`, error);
    throw error;
  }
}

export async function addDocumentWithAuth<T extends FirestoreData = FirestoreData>(
  collectionPath: string, 
  data: T
): Promise<string> {
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

export async function deleteDocumentWithAuth(
  collectionPath: string, 
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionPath, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionPath}:`, error);
    throw error;
  }
}