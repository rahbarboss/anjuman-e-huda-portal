import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigation } from '../context/NavigationContext';
import { Announcement } from '../types';
import {
  Bell,
  Search,
  Filter,
  Pin,
  Calendar,
  AlertTriangle,
  FileText,
  Sparkles,
  ExternalLink,
  Download,
  X,
  ChevronRight,
  Home,
  CheckCircle2,
  Eye,
  Maximize2,
  ZoomIn,
} from 'lucide-react';

export const UpdatesPage: React.FC = () => {
  const { database } = useData();
  const { announcements } = database;
  const { navigateTo } = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalNotice, setActiveModalNotice] = useState<Announcement | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const isImage = (url?: string) => {
    if (!url) return false;
    const clean = url.split('?')[0].toLowerCase();
    return (
      clean.endsWith('.jpg') ||
      clean.endsWith('.jpeg') ||
      clean.endsWith('.png') ||
      clean.endsWith('.webp') ||
      clean.endsWith('.gif') ||
      clean.endsWith('.svg') ||
      url.startsWith('data:image/') ||
      url.startsWith('blob:') ||
      (!clean.endsWith('.pdf') && !clean.endsWith('.doc') && !clean.endsWith('.docx'))
    );
  };

  const categories = ['All', 'Circular', 'Event Alert', 'Notice', 'Result'];

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ann.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Circular':
        return 'bg-sky-950 text-sky-300 border-sky-800';
      case 'Event Alert':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'Notice':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Result':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div className="min-h-screen bg-dot-pattern text-stone-900 pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white/70 backdrop-blur-md border-b border-stone-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono mb-3">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-emerald-700 font-semibold">Updates & Gazettes</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase font-mono shadow-xs mb-2">
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                CENTRAL DISPATCH & OFFICIAL GAZETTE
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-stone-900 tracking-tight">
                Union Updates & Notices
              </h1>
              <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Official notifications, administrative circulars, gazetted resolutions, and live election dispatches
                authorized by ANJUMAN-E-HUDA Executive Secretariat.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono text-stone-700 shadow-xs">
                Total Published: <strong className="text-emerald-700">{announcements.length}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Controls: Search & Category Chips */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-8">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars, gazettes, notices..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 shadow-xs transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin">
            <span className="text-xs font-mono text-stone-500 flex items-center gap-1 shrink-0 mr-1 font-semibold">
              <Filter className="w-3 h-3 text-emerald-700" /> Filter:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={`cat-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
                    active
                      ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                      : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200 shadow-xs'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Announcements List Grid */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200">
            <FileText className="w-12 h-12 mx-auto text-stone-400 mb-3" />
            <h3 className="text-lg font-bold text-stone-900">No Dispatches Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              No circular matches your current query or category filter. Try clearing your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAnnouncements.map((ann, idx) => {
              const isUrgent = ann.urgency === 'urgent';
              const isHigh = ann.urgency === 'high';
              const itemImg = ann.imageUrl || ann.fileUrl;
              const hasImg = itemImg && isImage(itemImg);

              return (
                <div
                  key={`ann-${ann.id}-${idx}`}
                  onClick={() => setActiveModalNotice(ann)}
                  className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
                >
                  <div>
                    {/* Flyer / Poster Preview Image if available */}
                    {hasImg && (
                      <div className="relative h-52 sm:h-60 w-full overflow-hidden rounded-xl mb-4 bg-stone-100 border border-stone-200 group-hover:border-emerald-400 transition-colors">
                        <img
                          src={itemImg}
                          alt={ann.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[10px] font-mono text-emerald-800 border border-stone-200 font-bold shadow-xs">
                            <Eye className="w-3 h-3 text-emerald-700" /> Official Circular Poster
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-white">
                            <Maximize2 className="w-2.5 h-2.5" /> Enlarge
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Attached Document file indicator if not an image */}
                    {!hasImg && itemImg && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 mb-4 text-xs text-sky-800 font-mono">
                        <FileText className="w-4 h-4 shrink-0 text-sky-700" />
                        <span className="truncate">Attached Official PDF / Document</span>
                      </div>
                    )}

                    {/* Header Row: Category Badge, Urgency, Pinned */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md border ${getCategoryBadgeColor(
                            ann.category
                          )}`}
                        >
                          {ann.category}
                        </span>

                        {isUrgent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 uppercase tracking-wider animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            Urgent Notice
                          </span>
                        )}

                        {isHigh && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                            High Priority
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-stone-500 text-xs font-mono">
                        {ann.isPinned && (
                          <span className="inline-flex items-center gap-1 text-amber-800 font-semibold text-[11px]">
                            <Pin className="w-3.5 h-3.5 text-amber-600" /> Pinned
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          {ann.date}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold font-heading text-stone-900 group-hover:text-emerald-700 transition-colors mb-2 leading-snug">
                      {ann.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal mb-4">
                      {ann.summary}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-emerald-800 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Click to Read Complete Gazette
                    </span>
                    <button
                      type="button"
                      className="text-stone-600 group-hover:text-emerald-800 flex items-center gap-1 text-xs font-medium transition-colors"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notice Detail Popup Modal */}
      {activeModalNotice && (() => {
        const modalImg = activeModalNotice.imageUrl || activeModalNotice.fileUrl;
        const hasModalImg = modalImg && isImage(modalImg);

        return (
          <div
            id="notice-detail-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveModalNotice(null)}
          >
            <div
              className="relative w-full max-w-3xl max-h-[92vh] bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-stone-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between gap-3 bg-stone-50">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-md border ${getCategoryBadgeColor(
                      activeModalNotice.category
                    )}`}
                  >
                    {activeModalNotice.category}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">Date of Issue: {activeModalNotice.date}</span>
                  {activeModalNotice.isPinned && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      PINNED
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalNotice(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
                {/* Full Uncropped Flyer / Poster / Image if available */}
                {hasModalImg && (
                  <div className="w-full bg-stone-50 rounded-xl p-3 sm:p-4 border border-stone-200 flex flex-col items-center justify-center relative group">
                    <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-stone-200 text-[11px] font-mono text-stone-500">
                      <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Official Circular & Gazette Poster (Full View)
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setLightboxImage(modalImg)}
                          className="text-stone-600 hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Enlarge</span>
                        </button>
                        <a
                          href={modalImg}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stone-600 hover:text-emerald-700 transition-colors flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open Tab</span>
                        </a>
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-center overflow-hidden">
                      <img
                        src={modalImg}
                        alt={activeModalNotice.title}
                        className="w-auto max-w-full max-h-[60vh] object-contain rounded-lg shadow-md cursor-zoom-in hover:brightness-105 transition-all"
                        onClick={() => setLightboxImage(modalImg)}
                        title="Click to view full image in high resolution"
                      />
                    </div>

                    <p className="mt-2 text-[10px] text-stone-500 font-mono text-center">
                      Full dimensions preserved • Click image to zoom or view fullscreen
                    </p>
                  </div>
                )}

                {/* If PDF attached */}
                {!hasModalImg && modalImg && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-stone-900">Attached Official Document</h4>
                        <p className="text-[10px] text-stone-500 font-mono">PDF Circular / Official Dispatch</p>
                      </div>
                    </div>
                    <a
                      href={modalImg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                )}

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 leading-snug mb-3">
                    {activeModalNotice.title}
                  </h3>

                  <div className="p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {activeModalNotice.summary}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span>Issuing Authority:</span>
                    <strong className="text-stone-900">ANJUMAN-E-HUDA Executive Secretariat</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span>Authenticity Verification:</span>
                    <span className="text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Official Gazette Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-stone-200 flex items-center justify-between gap-3 bg-stone-50">
                {hasModalImg ? (
                  <button
                    type="button"
                    onClick={() => setLightboxImage(modalImg)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>View Poster Fullscreen</span>
                  </button>
                ) : <span />}

                <button
                  type="button"
                  onClick={() => setActiveModalNotice(null)}
                  className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  Close Dispatch
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Fullscreen Lightbox for Notices */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-[96vw] max-h-[95vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-lg text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Notice Flyer Poster Fullscreen"
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-3 flex items-center gap-3">
              <a
                href={lightboxImage}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Open Image</span>
              </a>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Close Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
