import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StorageBucket } from '../../services/supabaseService';

interface MediaUploadZoneProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  currentUrl?: string;
  bucket?: StorageBucket;
}

export const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({
  onUploadSuccess,
  label = 'Upload Media Asset',
  currentUrl,
  bucket = 'gallery',
}) => {
  const { uploadMedia } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side image optimization prior to upload
  const optimizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      // If svg or gif or small, keep as-is
      if (file.type === 'image/svg+xml' || file.type === 'image/gif' || file.size < 400 * 1024) {
        return resolve(file);
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(optimizedFile);
                } else {
                  resolve(file);
                }
              },
              'image/jpeg',
              0.88
            );
          } else {
            resolve(file);
          }
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const processUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Only image files (JPEG, PNG, WEBP, SVG) are permitted.');
      return;
    }

    setErrorMsg(null);
    setUploading(true);

    try {
      // Dynamically optimize image
      const optimized = await optimizeImage(file);
      const res = await uploadMedia(optimized, bucket);

      if (res.success && res.url) {
        setPreviewUrl(res.url);
        onUploadSuccess(res.url);
      } else {
        setErrorMsg(res.message || 'Upload failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold text-stone-300">{label}</span>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-500/20'
            : 'border-stone-700 bg-stone-950/60 hover:border-emerald-500/50 hover:bg-stone-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {uploading ? (
          <div className="py-4 flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-medium text-emerald-300">
              Optimizing & Uploading to Database...
            </span>
          </div>
        ) : previewUrl ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="relative w-full max-h-40 rounded-lg overflow-hidden border border-stone-700 bg-stone-950 flex items-center justify-center">
              <img src={previewUrl} alt="Uploaded preview" className="max-h-40 object-contain" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Image uploaded & optimized</span>
            </div>
            <p className="text-[11px] text-stone-400">Click or drag a new file to replace</p>
          </div>
        ) : (
          <div className="py-3 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-200">
                Drag and drop image here, or <span className="text-emerald-400 underline">browse</span>
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">
                PNG, JPG, WEBP, or SVG • Auto-optimized before storage
              </p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
