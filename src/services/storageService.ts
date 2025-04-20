import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase Storage
const storage = getStorage();

// Upload blog image to Firebase Storage
export async function uploadBlogImage(file: File): Promise<string> {
  try {
    // Create a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `blog-images/${fileName}`;
    
    // Create reference to storage location
    const storageRef = ref(storage, filePath);
    
    // Upload file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadUrl = await getDownloadURL(storageRef);
    
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error('Failed to upload image');
  }
}