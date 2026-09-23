import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { HighlightItem } from '../types';

interface LightboxModalProps {
  isOpen: boolean;
  highlight: HighlightItem | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  highlight,
  onClose,
  onNext,
  onPrev,
}) => {
  // Keyboard navigation hook called unconditionally at top level
  useEffect(() => {
    if (!isOpen || !highlight) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlight, onClose, onNext, onPrev]);

  // Direct image download trigger
  const handleDownloadImage = async () => {
    if (!highlight) return;
    try {
      const response = await fetch(highlight.imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanName = highlight.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
      link.download = `anjuman_huda_${cleanName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = highlight.imageUrl;
      link.target = '_blank';
      link.download = `anjuman_huda_${highlight.id}.jpg`;
      link.click();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && highlight && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          id="lightbox-backdrop"
          className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key={`lightbox-modal-${highlight.id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[95vh] bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl text-stone-100"
          >
            {/* Top action bar */}
            <div className="px-5 py-3.5 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {highlight.category}
                </span>
                <span className="text-xs text-stone-400 font-mono hidden sm:inline-block">
                  {highlight.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Direct "Download Image" button */}
                <button
                  id="lightbox-download-image-btn"
                  type="button"
                  onClick={handleDownloadImage}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-colors cursor-pointer"
                  title="Download this image directly"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </button>

                <button
                  id="close-lightbox-btn"
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Content: Photo viewer with side controls */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] max-h-[60vh] sm:max-h-[68vh] overflow-hidden">
              <img
                src={highlight.imageUrl}
                alt={highlight.title}
                className="max-h-full max-w-full object-contain select-none"
              />

              {/* Prev button */}
              {onPrev && (
                <button
                  type="button"
                  onClick={onPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/80 text-white hover:bg-emerald-600 transition-colors border border-stone-700/80"
                  title="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Next button */}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/80 text-white hover:bg-emerald-600 transition-colors border border-stone-700/80"
                  title="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bottom metadata */}
            <div className="p-5 bg-stone-950 border-t border-stone-800">
              <h3 className="text-lg font-bold text-white mb-1.5">{highlight.title}</h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-3">
                {highlight.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
                <div className="flex flex-wrap items-center gap-1.5">
                  {highlight.tags?.map((tag, idx) => (
                    <span
                      key={`tag-${tag}-${idx}`}
                      className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-[11px] text-stone-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <span className="font-mono text-stone-500 text-[11px]">
                  ANJUMAN-E-HUDA Official Archives
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
