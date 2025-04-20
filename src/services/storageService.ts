import { ref, uploadBytes, getDownloadURL, deleteObject, uploadString } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

// Upload blog cover image
export async function uploadBlogImage(file: File): Promise<string> {
  try {
    // Generate a unique filename to avoid collisions
    const fileName = `blog-images/${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
    const storageRef = ref(storage, fileName);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get and return the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading blog image:", error);
    throw error;
  }
}

export async function uploadImageFromDataUrl(dataUrl: string): Promise<string> {
  try {
    const fileType = dataUrl.split(';')[0].split('/')[1];
    
    const fileName = `blog-images/${uuidv4()}.${fileType}`;
    const storageRef = ref(storage, fileName);
    
    await uploadString(storageRef, dataUrl, 'data_url');

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image from data URL:", error);
    throw error;
  }
}

export async function deleteImage(path: string): Promise<void> {
  try {
    const fullPath = extractStoragePath(path);
    if (!fullPath) {
      console.error("Could not extract valid storage path:", path);
      return;
    }
    
    const storageRef = ref(storage, fullPath);
    await deleteObject(storageRef);
    console.log("Image deleted successfully:", fullPath);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

export function extractStoragePath(url: string): string | null {
  try {
    if (url.includes('firebasestorage.googleapis.com')) {
      const encodedPath = url.split('/o/')[1].split('?')[0];
      return decodeURIComponent(encodedPath);
    } else if (url.startsWith('gs://')) {
      const parts = url.split('gs://')[1].split('/');
      return parts.slice(1).join('/'); // Remove the bucket name
    } else {
      return url;
    }
  } catch (error) {
    console.error("Error extracting storage path:", error);
    return null;
  }
}