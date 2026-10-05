import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Link,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StorageBucket } from '../../services/supabaseService';
import { optimizeImageBeforeUpload, OptimizationStats } from '../../utils/imageOptimizer';

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
  bucket = 'members',
}) => {
  const { uploadMedia } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [compressionStats, setCompressionStats] = useState<OptimizationStats | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with currentUrl whenever the prop changes (e.g., when opening modal for another wing or after saving)
  useEffect(() => {
    setPreviewUrl(currentUrl || null);
    if (currentUrl) setManualUrl(currentUrl);
  }, [currentUrl]);

  const processUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Only image files (JPEG, PNG, WEBP, SVG) are permitted.');
      return;
    }

    setErrorMsg(null);
    setUploading(true);

    try {
      // Adaptively optimize image before upload (max-w 1200px, 80-100 KB target, 0.82->0.55 quality, WebP conversion)
      const { file: optimizedFile, stats } = await optimizeImageBeforeUpload(file);
      setCompressionStats(stats);

      const res = await uploadMedia(optimizedFile, bucket);

      if (res.success && res.url) {
        setPreviewUrl(res.url);
        setManualUrl(res.url);
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

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setManualUrl('');
    setCompressionStats(null);
    onUploadSuccess('');
  };

  const handleApplyManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    setPreviewUrl(manualUrl.trim());
    onUploadSuccess(manualUrl.trim());
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="block text-xs font-semibold text-stone-300">{label}</span>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
        >
          <Link className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL Input' : 'Paste Direct URL'}</span>
        </button>
      </div>

      {/* Optional Direct URL Input */}
      {showUrlInput && (
        <form onSubmit={handleApplyManualUrl} className="flex items-center gap-2 mb-2 animate-in fade-in duration-150">
          <input
            type="url"
            placeholder="Paste public image URL (Supabase, Unsplash, etc.)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0"
          >
            Apply
          </button>
        </form>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
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
          <div className="py-6 flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-medium text-emerald-300 font-mono">
              Optimizing & Uploading to Supabase...
            </span>
          </div>
        ) : previewUrl ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="relative w-full max-h-48 rounded-xl overflow-hidden border border-stone-700 bg-stone-950 flex items-center justify-center shadow-inner group/prev">
              <img
                src={previewUrl}
                alt="Passport preview"
                className="max-h-48 w-auto object-contain object-top select-none"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/prev:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace Photo</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Image uploaded & optimized</span>
            </div>

            {compressionStats && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-900 border border-stone-700 text-xs font-mono text-stone-200 shadow-inner">
                <span className="text-stone-400">{compressionStats.formattedOriginal}</span>
                <span className="text-emerald-400 font-bold">→</span>
                <span className="text-emerald-300 font-semibold">{compressionStats.formattedOptimized}</span>
                {compressionStats.savedPercent > 0 && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    -{compressionStats.savedPercent}%
                  </span>
                )}
              </div>
            )}

            {/* Direct Change & Remove Buttons */}
            <div className="flex items-center gap-2 pt-1 w-full justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border border-stone-700"
              >
                <RefreshCw className="w-3 h-3 text-emerald-400" />
                <span>Replace / Change Photo</span>
              </button>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border border-red-800/60"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
            <p className="text-[10px] text-stone-400">Click or drag a new image file to replace this photo</p>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-emerald-400 shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-200">
                Drag and drop image here, or <span className="text-emerald-400 underline">browse</span>
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5 font-mono">
                PNG, JPG, WEBP, or SVG • Uploads to Supabase storage
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
