"use client"
import { useState, useRef } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { uploadImageFromDataUrl } from '@/services/storageService';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  onCancel: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded, onCancel }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError("Only JPEG, PNG, GIF and WEBP files are supported");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setPreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = async () => {
    if (!preview) return;
    
    try {
      setIsUploading(true);
      setError(null);
      
      // Upload image to Firebase Storage
      const imageUrl = await uploadImageFromDataUrl(preview);
      
      // Pass the image URL to parent component
      onImageUploaded(imageUrl);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="bg-gray-800 border border-gray-700 p-4 rounded-md">
      <h3 className="text-lg font-medium mb-3">Upload Image</h3>
      
      {error && (
        <div className="bg-red-900/30 text-red-300 p-2 rounded-md mb-3">
          {error}
        </div>
      )}
      
      {!preview ? (
        <div 
          className="border-2 border-dashed border-gray-700 rounded-md p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-400">Click to select an image</p>
          <p className="text-sm text-gray-500 mt-1">JPEG, PNG, GIF or WEBP (max 5MB)</p>
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div>
          <div className="relative max-h-64 overflow-hidden rounded-md mb-3">
            <Image
              src={preview} 
              alt="Preview" 
              className="max-w-full h-auto"
            />
            <button 
              className="absolute top-2 right-2 bg-black/60 p-1 rounded-full"
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex-1"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex-1 flex items-center justify-center disabled:opacity-50"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload & Insert'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;