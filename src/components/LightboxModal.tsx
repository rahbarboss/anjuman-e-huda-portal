import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  ExternalLink,
  Info,
  Sparkles,
} from 'lucide-react';
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
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isActualSize, setIsActualSize] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Reset zoom whenever a new highlight is opened
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
      setIsActualSize(false);
      setShowDetails(false);
    }
  }, [isOpen, highlight?.id]);

  // Keyboard navigation hook called unconditionally at top level
  useEffect(() => {
    if (!isOpen || !highlight) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === '+' || e.key === '=') {
        setZoomLevel((prev) => Math.min(3.5, Number((prev + 0.25).toFixed(2))));
        setIsActualSize(false);
      }
      if (e.key === '-' || e.key === '_') {
        setZoomLevel((prev) => Math.max(0.5, Number((prev - 0.25).toFixed(2))));
        setIsActualSize(false);
      }
      if (e.key === '0') {
        setZoomLevel(1);
        setIsActualSize(false);
      }
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
      link.download = `anjuman_huda_poster_${cleanName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = highlight.imageUrl;
      link.target = '_blank';
      link.download = `anjuman_huda_poster_${highlight.id}.jpg`;
      link.click();
    }
  };

  const handleToggleActualSize = () => {
    if (isActualSize) {
      setIsActualSize(false);
      setZoomLevel(1);
    } else {
      setIsActualSize(true);
      setZoomLevel(1);
    }
  };

  const handleZoomIn = () => {
    setIsActualSize(false);
    setZoomLevel((prev) => Math.min(3.5, Number((prev + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setIsActualSize(false);
    setZoomLevel((prev) => Math.max(0.5, Number((prev - 0.25).toFixed(2))));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setIsActualSize(false);
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
          className="fixed inset-0 z-60 flex flex-col bg-black/95 backdrop-blur-md text-stone-100 select-none"
          onClick={onClose}
        >
          {/* Top floating control bar */}
          <div
            className="w-full px-3 sm:px-6 py-2.5 bg-stone-950/90 border-b border-stone-800 flex items-center justify-between gap-2 shrink-0 z-20 shadow-lg backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Category, Title & Badges */}
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                {highlight.category}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md lg:max-w-xl">
                {highlight.title}
              </h3>
              {highlight.date && (
                <span className="text-[11px] text-stone-400 font-mono hidden md:inline-block shrink-0">
                  • {highlight.date}
                </span>
              )}
            </div>

            {/* Right: Zoom controls, Full Size, Raw link, Download, Close */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Zoom Out */}
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5 && !isActualSize}
                className="p-1.5 sm:p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Zoom % / Status Display */}
              <button
                type="button"
                onClick={handleResetZoom}
                className="text-xs font-mono text-stone-300 hover:text-emerald-400 px-1.5 sm:px-2 py-1 rounded bg-stone-900 border border-stone-800 transition-colors min-w-[50px] text-center cursor-pointer"
                title="Click to reset (Fit Screen)"
              >
                {isActualSize ? '100% 1:1' : `${Math.round(zoomLevel * 100)}%`}
              </button>

              {/* Zoom In */}
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3.5}
                className="p-1.5 sm:p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Full Size / 100% Native Resolution button ("Jitna bada poster hai utna bada hi dikhna hai") */}
              <button
                type="button"
                onClick={handleToggleActualSize}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-colors cursor-pointer ${
                  isActualSize
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                    : 'bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white'
                }`}
                title="View Full Resolution (1:1 Natural Poster Size)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">
                  {isActualSize ? 'Fit Screen' : 'Full Size (1:1)'}
                </span>
              </button>

              {/* Toggle Info / Description */}
              {(highlight.description || (highlight.tags && highlight.tags.length > 0)) && (
                <button
                  type="button"
                  onClick={() => setShowDetails((prev) => !prev)}
                  className={`p-1.5 sm:p-2 rounded-lg border transition-colors cursor-pointer ${
                    showDetails
                      ? 'bg-emerald-950 border-emerald-600/60 text-emerald-300'
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
                  }`}
                  title="Toggle Program Details"
                >
                  <Info className="w-4 h-4" />
                </button>
              )}

              {/* Raw / New Tab View */}
              <a
                href={highlight.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-colors hidden sm:flex items-center justify-center cursor-pointer"
                title="Open original high-res poster in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Download Poster */}
              <button
                id="lightbox-download-image-btn"
                type="button"
                onClick={handleDownloadImage}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-colors cursor-pointer"
                title="Download this high-resolution poster"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Download</span>
              </button>

              {/* Close Button */}
              <button
                id="close-lightbox-btn"
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors ml-1 cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Full-Size Poster Canvas Area */}
          <div
            className="relative flex-1 w-full h-full overflow-auto flex items-center justify-center p-2 sm:p-6 cursor-grab active:cursor-grabbing"
            onClick={(e) => {
              // Click background to close
              if (e.target === e.currentTarget) {
                onClose();
              }
            }}
          >
            {/* Poster container with dynamic zoom / full natural resolution */}
            <div
              className={`relative flex items-center justify-center transition-transform duration-200 ease-out origin-center ${
                isActualSize ? 'max-w-none max-h-none' : 'max-w-full max-h-full'
              }`}
              style={!isActualSize ? { transform: `scale(${zoomLevel})` } : undefined}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={handleToggleActualSize}
              title="Double-click to toggle Full Resolution (1:1)"
            >
              <img
                src={highlight.imageUrl}
                alt={highlight.title}
                className={`rounded-lg shadow-2xl shadow-black select-none border border-stone-800/80 transition-all ${
                  isActualSize
                    ? 'w-auto h-auto max-w-none max-h-none'
                    : 'w-auto h-auto max-w-[94vw] max-h-[86vh] object-contain'
                }`}
                style={{ imageRendering: 'auto' }}
              />

              {/* Previous Photo Button */}
              {onPrev && (
                <button
                  type="button"
                  onClick={onPrev}
                  className="fixed left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 text-white hover:bg-emerald-600 transition-colors border border-stone-700/80 shadow-2xl z-20 cursor-pointer backdrop-blur-sm"
                  title="Previous program poster"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Photo Button */}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="fixed right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 text-white hover:bg-emerald-600 transition-colors border border-stone-700/80 shadow-2xl z-20 cursor-pointer backdrop-blur-sm"
                  title="Next program poster"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Streamlined Bar: Double-click hint + Expandable Details */}
          <div
            className="w-full px-4 py-2 bg-stone-950/90 border-t border-stone-800/80 flex flex-col gap-2 shrink-0 z-20 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-stone-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Double-click poster or use zoom to view Full Resolution (1:1)</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                {highlight.description && (
                  <button
                    type="button"
                    onClick={() => setShowDetails((prev) => !prev)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-mono underline cursor-pointer"
                  >
                    {showDetails ? 'Hide Program Details' : 'Show Program Details'}
                  </button>
                )}
                <span className="font-mono text-stone-500 text-[10px] hidden sm:inline">
                  ANJUMAN-E-HUDA Official Archives
                </span>
              </div>
            </div>

            {/* Expandable Details Drawer */}
            {showDetails && highlight.description && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-2 pb-1 border-t border-stone-800/60 max-w-4xl"
              >
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-h-32 overflow-y-auto">
                  {highlight.description}
                </p>
                {highlight.tags && highlight.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {highlight.tags.map((tag, idx) => (
                      <span
                        key={`tag-${tag}-${idx}`}
                        className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

