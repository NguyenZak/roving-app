"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';

interface UnifiedImageUploadProps {
  // Single image mode
  value?: string;
  onChange?: (url: string) => void;
  
  // Multiple images mode
  images?: string[];
  onImagesChange?: (urls: string[]) => void;
  
  // Legacy form mode
  targetInputName?: string;
  onImageUploaded?: (imageUrl: string) => void;
  
  // Common props
  label?: string;
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
  required?: boolean;
  placeholder?: string;
}

interface UploadedFile {
  originalName: string;
  filename: string;
  url: string;
  size: number;
  originalSize?: number;
  compressedSize?: number;
  type: string;
  cloudinaryId?: string;
  wasCompressed?: boolean;
}

export default function UnifiedImageUpload({ 
  // Single image mode
  value,
  onChange,
  
  // Multiple images mode
  images = [],
  onImagesChange,
  
  // Legacy form mode
  targetInputName,
  onImageUploaded,
  
  // Common props
  label = "Upload Images",
  className = '',
  multiple = false,
  maxFiles = 100,
  required = false,
  placeholder = "https://example.com/image.jpg"
}: UnifiedImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine which mode to use
  const isMultipleMode = multiple || images.length > 0 || !!onImagesChange;
  const isLegacyMode = !!targetInputName;
  const isSingleMode = !isMultipleMode && !isLegacyMode;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check max files limit
    const currentCount = isMultipleMode ? images.length : (value ? 1 : 0);
    if (currentCount + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          let errorMessage = 'Upload failed';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            errorMessage = response.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        let data;
        try {
          data = await response.json();
        } catch (e) {
          throw new Error('Invalid response from server');
        }
        return {
          originalName: file.name,
          filename: file.name,
          url: data.location,
          size: file.size,
          type: file.type,
          cloudinaryId: data.public_id,
          wasCompressed: false
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      
      if (isMultipleMode) {
        setUploadedFiles(prev => [...prev, ...uploadedFiles]);
        const urls = uploadedFiles.map(file => file.url);
        const newImages = [...images, ...urls];
        onImagesChange?.(newImages);
      } else {
        setUploadedFiles(uploadedFiles);
        const url = uploadedFiles[0].url;
        onChange?.(url);
        onImageUploaded?.(url);
      }

    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Upload failed';
      
      if (error instanceof Error) {
        if (error.message.includes('ERR_INTERNET_DISCONNECTED') || 
            error.message.includes('Failed to fetch') ||
            error.message.includes('NetworkError')) {
          errorMessage = 'Network connection error. Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-[#d11e0f]', 'bg-red-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#d11e0f]', 'bg-red-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#d11e0f]', 'bg-red-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Check max files limit
      const currentCount = isMultipleMode ? images.length : (value ? 1 : 0);
      if (currentCount + files.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      
      const input = fileInputRef.current;
      if (input) {
        input.files = files;
        handleFileSelect({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const removeFile = async (index: number) => {
    const fileToRemove = uploadedFiles[index];
    
    // If the file has a Cloudinary ID, delete it from Cloudinary
    if (fileToRemove.cloudinaryId) {
      try {
        const response = await fetch(`/api/admin/upload/delete?publicId=${fileToRemove.cloudinaryId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          console.error('Failed to delete from Cloudinary');
        }
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }
    }

    // Remove from local state
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Update parent state
    if (isMultipleMode) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange?.(newImages);
    } else {
      onChange?.('');
      onImageUploaded?.('');
    }
  };

  const removeImage = (index: number) => {
    if (isMultipleMode) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange?.(newImages);
    } else {
      onChange?.('');
      onImageUploaded?.('');
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (isMultipleMode) {
      const newImages = [...images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      onImagesChange?.(newImages);
    }
  };

  const formatFileSize = (bytes: number, decimalPoint = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimalPoint < 0 ? 0 : decimalPoint;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const currentImages = isMultipleMode ? images : (value ? [value] : []);
  const showUploadedFiles = uploadedFiles.length > 0;
  const showExistingImages = currentImages.length > 0 && !showUploadedFiles;

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#d11e0f] transition-colors duration-200 ${
          uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={isMultipleMode}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium text-[#d11e0f]">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 15MB per file
            {isMultipleMode && ` • Max ${maxFiles} files`}
          </p>
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#d11e0f] mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Uploading to Cloudinary...</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            {error.includes('Network connection error') && (
              <button
                onClick={() => {
                  setError('');
                  fileInputRef.current?.click();
                }}
                className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Uploaded Files Preview (New uploads) */}
      {showUploadedFiles && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Uploaded Images ({uploadedFiles.length}):
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={`upload-image-${index}`} className="relative group">
                <Image
                  src={file.url}
                  alt={file.originalName}
                  width={400}
                  height={96}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Remove image"
                >
                  ×
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {file.originalName}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✓ Cloudinary
                </p>
                {file.wasCompressed && (
                  <p className="text-xs text-orange-600 mt-1">
                    🔄 Tự động nén
                  </p>
                )}
                {file.originalSize && file.compressedSize && (
                  <p className="text-xs text-blue-600 mt-1">
                    {formatFileSize(file.originalSize)} → {formatFileSize(file.compressedSize)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Images Preview (Legacy images with controls) */}
      {showExistingImages && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Current Images ({currentImages.length}):
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentImages.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  width={400}
                  height={96}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Remove image"
                >
                  ×
                </button>
                
                {/* Move buttons for multiple images */}
                {isMultipleMode && currentImages.length > 1 && (
                  <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    {index > 0 && (
                      <button
                        onClick={() => moveImage(index, index - 1)}
                        className="flex-1 bg-white/80 text-gray-700 text-xs py-1 rounded hover:bg-white"
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {index < currentImages.length - 1 && (
                      <button
                        onClick={() => moveImage(index, index + 1)}
                        className="flex-1 bg-white/80 text-gray-700 text-xs py-1 rounded hover:bg-white"
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                )}
                
                {/* Image number badge */}
                {isMultipleMode && (
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden input for legacy form compatibility */}
      {isLegacyMode && targetInputName && (
        <input
          type="hidden"
          name={targetInputName}
          value={isMultipleMode ? images.join(',') : (value || '')}
        />
      )}
    </div>
  );
}
