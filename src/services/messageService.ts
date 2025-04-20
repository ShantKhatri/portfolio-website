import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  addDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define interface for contact messages
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
  read: boolean;
}

// Collection reference
const messagesCollection = collection(db, 'contact-messages');

// Get all contact messages
export async function getAllContactMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(messagesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const messages: ContactMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as ContactMessage);
    });
    
    return messages;
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }
}

// Get unread contact messages
export async function getUnreadContactMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(
      messagesCollection, 
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const messages: ContactMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as ContactMessage);
    });
    
    return messages;
  } catch (error) {
    console.error("Error fetching unread contact messages:", error);
    return [];
  }
}

// Get a single contact message
export async function getContactMessage(id: string): Promise<ContactMessage | null> {
  try {
    const docRef = doc(messagesCollection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ContactMessage;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching contact message ${id}:`, error);
    return null;
  }
}

// Mark a message as read or unread
export async function toggleMessageReadStatus(id: string, read: boolean): Promise<void> {
  try {
    const docRef = doc(messagesCollection, id);
    await updateDoc(docRef, { read });
  } catch (error) {
    console.error(`Error updating message ${id}:`, error);
    throw error;
  }
}

// Delete a message
export async function deleteContactMessage(id: string): Promise<void> {
  try {
    const docRef = doc(messagesCollection, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting message ${id}:`, error);
    throw error;
  }
}

// Submit a new contact message
export async function submitContactForm(formData: { name: string; email: string; message: string }): Promise<string> {
  try {
    const docRef = await addDoc(messagesCollection, {
      ...formData,
      createdAt: serverTimestamp(),
      read: false
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
}