import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigation } from '../context/NavigationContext';
import { LightboxModal } from '../components/LightboxModal';
import {
  Sparkles,
  Home,
  Search,
  Download,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Calendar,
  Layers,
  Camera,
} from 'lucide-react';

export const HighlightsPage: React.FC = () => {
  const { database } = useData();
  const { highlights } = database;
  const { navigateTo } = useNavigation();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Event' | 'Announcement'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHighlightIndex, setSelectedHighlightIndex] = useState<number | null>(null);

  // Filter highlights based on category and search query
  const filteredHighlights = highlights.filter((hl) => {
    const matchesCategory = activeFilter === 'All' || hl.category === activeFilter;
    const matchesSearch =
      !searchTerm ||
      hl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hl.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hl.tags && hl.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

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
            <span className="text-emerald-700 font-semibold">Highlights & Gallery</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase font-mono shadow-xs mb-2">
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                CENTRAL UNION VISUAL ARCHIVES & HIGHLIGHTS
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-stone-900 tracking-tight">
                Visual Highlights Gallery
              </h1>
              <p className="text-stone-600 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
                Explore milestone ceremonies, convocations, intellectual declamations, and humanitarian initiatives uploaded directly by the ANJUMAN-E-HUDA Executive Secretariat.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-stone-200 text-xs font-mono text-emerald-800 shadow-xs shrink-0 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{highlights.length} Official Highlights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Toolbar: Category Filter Pills + Live Search */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
          {/* Left: Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <span className="text-xs font-mono font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5 mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-emerald-700" /> Filter:
            </span>
            {(['All', 'Event', 'Announcement'] as const).map((filter) => {
              const count = filter === 'All' ? highlights.length : highlights.filter((h) => h.category === filter).length;
              return (
                <button
                  key={`hl-page-filter-${filter}`}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeFilter === filter
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 shadow-xs'
                  }`}
                >
                  <span>{filter === 'All' ? 'All Highlights' : filter}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    activeFilter === filter ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Live Search Input */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search highlights, topics..."
              className="w-full bg-white border border-stone-300 rounded-xl pl-10 pr-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 font-mono shadow-xs"
            />
          </div>
        </div>

        {/* Highlights Cards Grid */}
        {filteredHighlights.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredHighlights.map((hl, index) => (
              <div
                key={`hl-grid-card-${hl.id}-${index}`}
                onClick={() => setSelectedHighlightIndex(index)}
                className="bg-white border border-stone-200 hover:border-emerald-500 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg cursor-pointer group transition-all hover:-translate-y-1.5 flex flex-col justify-between"
                title="Click to open full-screen Lightbox & Download"
              >
                {/* 4:3 Aspect Ratio Image with Category Badge & Hover Download */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={hl.imageUrl}
                    alt={hl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent opacity-80" />

                  {/* Top-Left Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs text-emerald-800 border border-stone-200 shadow-xs">
                      {hl.category}
                    </span>
                  </div>

                  {/* Hover Download Pill on Bottom Right */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-1.5 px-3 rounded-lg bg-emerald-700 text-white shadow-md flex items-center gap-1.5 text-[11px] font-bold">
                      <Download className="w-3.5 h-3.5" />
                      View & Download
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Date in Mono Font */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500 mb-1.5">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <span>{hl.date}</span>
                    </div>

                    {/* Bold Title */}
                    <h3 className="text-base font-bold font-heading text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                      {hl.title}
                    </h3>

                    {/* Description Excerpt */}
                    {hl.description && (
                      <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                        {hl.description}
                      </p>
                    )}

                    {/* Tags */}
                    {hl.tags && hl.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        {hl.tags.slice(0, 3).map((t, tIdx) => (
                          <span
                            key={`hltag-${hl.id}-${t}-${tIdx}`}
                            className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[10px] font-mono text-stone-600 font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Card Footer */}
                  <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-mono text-[11px]">Archive #{hl.id}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Full Lightbox <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-stone-50 rounded-3xl border border-stone-200 text-stone-600 space-y-3">
            <Layers className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">No Highlights Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No photo highlights matched the filter "{activeFilter}" or search term "{searchTerm}".
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('All');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Full-screen Lightbox Modal with Zoom, Download & Navigation */}
      <LightboxModal
        isOpen={selectedHighlightIndex !== null}
        highlight={selectedHighlightIndex !== null ? filteredHighlights[selectedHighlightIndex] : null}
        onClose={() => setSelectedHighlightIndex(null)}
        onNext={
          selectedHighlightIndex !== null && selectedHighlightIndex < filteredHighlights.length - 1
            ? () => setSelectedHighlightIndex(selectedHighlightIndex + 1)
            : undefined
        }
        onPrev={
          selectedHighlightIndex !== null && selectedHighlightIndex > 0
            ? () => setSelectedHighlightIndex(selectedHighlightIndex - 1)
            : undefined
        }
      />
    </div>
  );
};
