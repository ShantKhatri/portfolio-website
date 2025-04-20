import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function submitContactForm(formData: ContactFormData): Promise<string> {
  try {
    const contactsCollection = collection(db, 'contact-messages');
    
    const docRef = await addDoc(contactsCollection, {
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