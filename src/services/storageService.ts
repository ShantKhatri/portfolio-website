import { v4 as uuidv4 } from 'uuid';
import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

// API route for uploading files
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });
    
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// API route for deleting files
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  
  try {
    await del(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

// Client-side function to upload blog images
export async function uploadBlogImage(file: File): Promise<string> {
  if (!file) {
    throw new Error("No file provided for upload");
  }
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Generate a unique filename
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
    const filename = `blog-images/${timestamp}-${uuidv4().slice(0, 8)}-${cleanName}`;
    
    const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }
    
    const blob = await response.json();
    return blob.url;
  } catch (error) {
    console.error("Error uploading blog image:", error);
    throw error;
  }
}

// Convert Data URL to File and upload to Vercel Blob
export async function uploadImageFromDataUrl(dataUrl: string): Promise<string> {
  try {
    // Extract file type and data from dataUrl
    const [meta, data] = dataUrl.split(',');
    const mime = meta.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const extension = mime.split('/')[1];
    
    // Convert base64 to Blob
    const byteString = atob(data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mime });
    
    // Create a File from the Blob
    const fileName = `${uuidv4()}.${extension}`;
    const file = new File([blob], fileName, { type: mime });
    
    // Use uploadBlogImage to handle the upload to Vercel Blob
    return await uploadBlogImage(file);
  } catch (error) {
    console.error("Error uploading image from data URL:", error);
    throw error;
  }
}

// Delete image from Vercel Blob
export async function deleteImage(url: string): Promise<void> {
  if (!url) return;
  
  try {
    // Call DELETE API route
    const response = await fetch(`/api/delete?url=${encodeURIComponent(url)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Delete failed');
    }
    
    console.log("Image deleted successfully:", url);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}