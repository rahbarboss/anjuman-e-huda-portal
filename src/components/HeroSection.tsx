import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Layers,
  PlusCircle,
} from 'lucide-react';
import { DynamicHeroStats } from './DynamicHeroStats';
import { Banner } from '../types';
import { defaultBanners } from '../defaultData';

export const HeroSection: React.FC = () => {
  const { database } = useData();
  const { navigateTo } = useNavigation();
  const { isAdminLoggedIn, setActiveView, setIsLoginModalOpen } = useAuth();
  const banners = database.banners && database.banners.length > 0 ? database.banners : defaultBanners;

  // Sort: First ALL LANDSCAPE banners, then ALL PORTRAIT banners
  const sortedBanners: Banner[] = useMemo(() => {
    const list = banners.length > 0 ? banners : defaultBanners;
    const activeList = list.filter((b) => b.isActive !== false);
    const effectiveList = activeList.length > 0 ? activeList : defaultBanners;
    const landscapeList = effectiveList
      .filter((b) => b.orientation === 'landscape')
      .sort((a, b) => (a.displayOrder ?? 1) - (b.displayOrder ?? 1));
    const portraitList = effectiveList
      .filter((b) => b.orientation === 'portrait')
      .sort((a, b) => (a.displayOrder ?? 1) - (b.displayOrder ?? 1));

    const combined = [...landscapeList, ...portraitList];
    return combined.length > 0 ? combined : defaultBanners;
  }, [banners]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep currentIndex valid when list changes
  useEffect(() => {
    if (currentIndex >= sortedBanners.length) {
      setCurrentIndex(0);
    }
  }, [sortedBanners.length, currentIndex]);

  // Strictly 3-Second Automatic Rotation (3000 ms) with infinite loop - NEVER PAUSES
  useEffect(() => {
    if (sortedBanners.length <= 1) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const stepTime = 50; // update progress every 50ms
    const totalTime = 3000; // Strictly 3 seconds as requested
    const increment = (stepTime / totalTime) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + increment;
      });
    }, stepTime);

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedBanners.length);
      setProgress(0);
    }, totalTime);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, sortedBanners.length]);

  const goToPrevious = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev === 0 ? sortedBanners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % sortedBanners.length);
  };

  const currentBanner = sortedBanners[currentIndex] || sortedBanners[0] || defaultBanners[0];

  const handleNavigate = (pageOrSelector: string) => {
    const clean = pageOrSelector.replace('#', '') as any;
    navigateTo(clean);
  };

  return (
    <section id="home" className="relative flex flex-col justify-between overflow-hidden bg-dot-pattern text-stone-900 border-b border-stone-200">
      {/* Decorative ambient subtle soft background glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Banner Zone - Direct Real Rotating Banners Always Active */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-10 w-full">
        {/* Live 3-Second Rotating Banner Showcase - Continuous non-stopping motion */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-stone-200/90 bg-stone-950 select-none transition-all">
          {/* Banner Media Frame */}
          <div className="relative w-full min-h-[340px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[580px] max-h-[640px] flex items-center justify-center overflow-hidden bg-stone-950">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentBanner.id}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.015 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
              >
                  {/* Portrait Banners: 2 Images displayed together side-by-side to fill entire space without side gaps */}
                  {currentBanner.orientation === 'portrait' ? (
                    <div className="relative w-full h-full grid grid-cols-2 overflow-hidden bg-stone-950">
                      {/* Left Portrait Image */}
                      <div className="relative w-full h-full overflow-hidden flex items-center justify-center border-r border-stone-900">
                        <img
                          src={currentBanner.imageUrl}
                          alt={currentBanner.title || 'Portrait Banner Left'}
                          className="w-full h-full object-cover object-center"
                        />
                        {currentBanner.linkUrl && (
                          <a
                            href={currentBanner.linkUrl}
                            target={currentBanner.linkUrl.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="absolute inset-0 z-20 cursor-pointer"
                            title={currentBanner.title || 'Open Left Banner Link'}
                          />
                        )}
                        {currentBanner.title && (
                          <div className="absolute bottom-6 left-4 z-20 hidden sm:block px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold max-w-[85%] truncate border border-white/10 shadow-lg">
                            {currentBanner.title}
                          </div>
                        )}
                      </div>

                      {/* Right Portrait Image */}
                      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                        <img
                          src={currentBanner.imageUrl2 || currentBanner.imageUrl}
                          alt={currentBanner.title2 || currentBanner.title || 'Portrait Banner Right'}
                          className="w-full h-full object-cover object-center"
                        />
                        {(currentBanner.linkUrl2 || currentBanner.linkUrl) && (
                          <a
                            href={currentBanner.linkUrl2 || currentBanner.linkUrl}
                            target={(currentBanner.linkUrl2 || currentBanner.linkUrl)?.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="absolute inset-0 z-20 cursor-pointer"
                            title={currentBanner.title2 || currentBanner.title || 'Open Right Banner Link'}
                          />
                        )}
                        {(currentBanner.title2 || currentBanner.title) && (
                          <div className="absolute bottom-6 left-4 z-20 hidden sm:block px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold max-w-[85%] truncate border border-white/10 shadow-lg">
                            {currentBanner.title2 || currentBanner.title}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Landscape Banner: Full widescreen crisp presentation completely filling width */
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-stone-950">
                      <img
                        src={currentBanner.imageUrl}
                        alt={currentBanner.title || 'Landscape Banner'}
                        className="w-full h-full object-cover object-center bg-stone-950"
                      />
                      {currentBanner.linkUrl && (
                        <a
                          href={currentBanner.linkUrl}
                          target={currentBanner.linkUrl.startsWith('http') ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="absolute inset-0 z-20 cursor-pointer"
                          title={currentBanner.title || 'Open Banner Link'}
                        />
                      )}
                      {currentBanner.title && (
                        <div className="absolute bottom-6 left-6 z-20 hidden sm:block px-3.5 py-2 rounded-xl bg-black/70 backdrop-blur-md text-white text-sm font-semibold max-w-md truncate border border-white/15 shadow-xl">
                          {currentBanner.title}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Top Banner Badges (Orientation) */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-30 flex items-center gap-2 pointer-events-none">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono shadow-md backdrop-blur-md border ${
                    currentBanner.orientation === 'landscape'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                      : 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                  }`}
                >
                  {currentBanner.orientation === 'landscape' ? 'LANDSCAPE' : 'PORTRAIT PAIR (2 IMAGES)'}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-stone-900/80 text-emerald-300 border border-emerald-700/50 shadow-md backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  3s Auto-Rotate
                </span>
              </div>

              {/* Top Right Counter & Link */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-30 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-stone-900/80 text-stone-200 border border-stone-700/80 shadow-md backdrop-blur-md">
                  {currentIndex + 1} / {sortedBanners.length}
                </span>

                {(currentBanner.linkUrl || currentBanner.linkUrl2) && (
                  <a
                    href={currentBanner.linkUrl || currentBanner.linkUrl2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 shadow-md backdrop-blur-md transition-colors"
                    title="Open Banner Details"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Navigation Left Button (< Arrow) */}
              {sortedBanners.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/55 hover:bg-black/85 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Previous Banner"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Navigation Right Button (> Arrow) */}
              {sortedBanners.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/55 hover:bg-black/85 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Next Banner"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Bottom Carousel Navigation Indicators */}
              {sortedBanners.length > 1 && (
                <div className="absolute bottom-4 inset-x-0 z-30 flex items-center justify-center gap-1.5 px-4 pointer-events-auto">
                  {sortedBanners.map((banner, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={`banner-dot-${banner.id}-${idx}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProgress(0);
                          setCurrentIndex(idx);
                        }}
                        className={`h-2 transition-all rounded-full cursor-pointer ${
                          isActive
                            ? 'w-7 sm:w-8 bg-emerald-400 shadow-md shadow-emerald-500/50'
                            : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to banner slide ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3-Second Auto Progress Bar */}
            {sortedBanners.length > 1 && (
              <div className="w-full h-1 bg-stone-900 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

      {/* Dynamic Executive Telemetry & Stats Cards */}
      <DynamicHeroStats onNavigate={handleNavigate} />
    </section>
  );
};
