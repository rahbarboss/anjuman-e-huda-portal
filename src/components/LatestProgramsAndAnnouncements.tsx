import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigation } from '../context/NavigationContext';
import { Program, HighlightItem } from '../types';
import { LightboxModal } from './LightboxModal';
import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Maximize2,
  Newspaper,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

interface Props {
  onOpenNotifications?: () => void;
}

export const LatestProgramsAndAnnouncements: React.FC<Props> = () => {
  const { database } = useData();
  const { programs, highlights = [] } = database;
  const { navigateTo } = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeLightboxItem, setActiveLightboxItem] = useState<HighlightItem | null>(null);

  // Dynamic categories including any custom categories added by admin
  const categories = React.useMemo(() => {
    const set = new Set(['Academic', 'Cultural', 'Leadership', 'Outreach', 'Sports']);
    programs.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    highlights.forEach((h) => {
      if (h.category) set.add(h.category);
    });
    return ['All', ...Array.from(set)];
  }, [programs, highlights]);

  // Filter highlights based on selected category and search term
  const filteredHighlights = highlights.filter((h) => {
    const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.description && h.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter programs based on selected category and search term
  const filteredPrograms = programs.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.venue && p.venue.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const scrollToAllPrograms = () => {
    navigateTo('programs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const el = document.querySelector('#programs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Convert program to highlight-compatible structure for the LightboxModal
  const programToHighlightItem = (p: Program): HighlightItem => ({
    id: p.id,
    title: p.title,
    category: (p.category as any) || 'Event',
    imageUrl: p.banner,
    date: `${p.date}${p.time ? ` • ${p.time}` : ''}${p.venue ? ` • ${p.venue}` : ''}`,
    description: p.description,
    tags: p.tags || [p.category || 'Event'],
  });

  return (
    <section id="updates" className="py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-800 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold tracking-wider uppercase font-mono shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                OFFICIAL UNION DISPATCH & ACADEMIC CALENDAR • 2026–27
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
              Visual Highlights & Union Programs
            </h2>
            <p className="text-stone-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Side-by-side photographic activity archives alongside high-profile union colloquiums, inter-collegiate
              galas, and leadership conclaves.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-3 shrink-0 w-full sm:w-auto">
            {/* Dynamic & Highlighted Fikr-o-Khayal Weekly Feature Banner */}
            <a
              href="https://fikr-o-khayalweekly.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group block w-full rounded-2xl p-[2px] bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:via-emerald-400 hover:to-amber-300 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(245,158,11,0.55)] transition-all duration-500 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
              title="Read Fikr-o-Khayal Weekly Official Organ Portal"
            >
              <div className="relative rounded-[14px] bg-stone-950/95 hover:bg-stone-900/90 px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-white transition-colors overflow-hidden">
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out" />
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-950 border border-emerald-400/60 flex items-center justify-center text-amber-300 shadow-md shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Newspaper className="w-5 h-5 text-amber-300" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-stone-900" />
                    </span>
                  </div>

                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="bg-amber-400 text-stone-950 text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                        Official Organ
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Edition
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug group-hover:text-amber-200 transition-colors truncate">
                      Fikr-o-Khayal Weekly – Read Now
                    </h4>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 group-hover:from-amber-400 group-hover:to-amber-500 text-white group-hover:text-stone-950 text-xs font-bold transition-all shadow duration-300">
                  <span className="hidden sm:inline">Visit</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full">
              <button
                id="view-all-programs-btn"
                type="button"
                onClick={scrollToAllPrograms}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <span>Explore Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category & Search Filter Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-stone-900/80 p-2 sm:p-2.5 rounded-2xl border border-stone-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
            <span className="text-xs font-mono font-bold text-stone-400 uppercase ml-2 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              Category:
            </span>
            {categories.map((cat, idx) => (
              <button
                key={`cat-filter-${cat}-${idx}`}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search highlights or programs..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* =========================================================================
            SIDE-BY-SIDE 2 COLUMNS:
            LEFT SIDE: HIGHLIGHT PROGRAMS (Visual Highlights Gallery - All Admin Uploads)
            RIGHT SIDE: PROGRAMS (Union Programs & Colloquiums)
            SECOND IMAGE EXACT STYLE
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ================= COLUMN 1 (LEFT): HIGHLIGHT PROGRAMS ================= */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-white tracking-tight">
                    HIGHLIGHT PROGRAMS
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">
                    Visual Highlights Gallery • Admin Uploads
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-emerald-400 shadow-xs">
                {filteredHighlights.length} Highlights
              </span>
            </div>

            {/* Highlights Cards (Second Image Style) */}
            {filteredHighlights.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredHighlights.map((hl, hlIdx) => (
                  <div
                    key={`front-hl-${hl.id}-${hlIdx}`}
                    onClick={() => setActiveLightboxItem(hl)}
                    className="group bg-stone-900/90 rounded-2xl border border-stone-800/90 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1"
                  >
                    {/* 4:3 Aspect Ratio poster/photo container */}
                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-stone-950">
                      <img
                        src={hl.imageUrl}
                        alt={hl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                        loading="lazy"
                      />
                      {/* Gradient shadow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                      {/* Top-Left Category Badge: font-mono px-2 py-0.5 rounded bg-stone-950/80 text-emerald-400 border border-emerald-500/40 */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-stone-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-xs">
                          {hl.category}
                        </span>
                      </div>

                      {/* Top-Right zoom button */}
                      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="p-1.5 rounded-lg bg-stone-950/80 text-emerald-300 border border-emerald-500/40 flex items-center justify-center backdrop-blur-xs">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Bottom-left Date on image: text-[11px] font-mono text-stone-300 */}
                      <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-1.5 text-[11px] font-mono text-stone-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{hl.date}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      {/* Bold Title: High-contrast readable typography */}
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                          {hl.title}
                        </h4>
                        {hl.description && (
                          <p className="text-xs text-stone-400 line-clamp-2 mt-1.5 leading-relaxed">
                            {hl.description}
                          </p>
                        )}
                      </div>

                      {/* Card Footer: Archive #{id} aur Full Lightbox -> */}
                      <div className="pt-3 mt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                        <span className="font-mono text-[10px] text-stone-500 uppercase">
                          Archive #{hl.id}
                        </span>
                        <span className="font-mono text-[11px] text-emerald-400 group-hover:text-emerald-300 font-semibold flex items-center gap-1">
                          <span>Full Lightbox</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-stone-900/50 rounded-2xl border border-stone-800 text-stone-400 space-y-2">
                <Sparkles className="w-8 h-8 text-stone-600 mx-auto" />
                <p className="text-sm font-semibold text-stone-300">No highlights match the current criteria.</p>
                <p className="text-xs text-stone-500">Highlights uploaded by admin will appear here live.</p>
              </div>
            )}
          </div>

          {/* ================= COLUMN 2 (RIGHT): PROGRAMS ================= */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Calendar className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-white tracking-tight">
                    PROGRAMS
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">
                    Union Programs & Colloquiums
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={scrollToAllPrograms}
                className="text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline cursor-pointer"
              >
                <span>View All Catalog ({programs.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Programs Cards (Second Image Style) */}
            {filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredPrograms.slice(0, 6).map((prog, pIdx) => (
                  <div
                    key={`front-prog-${prog.id}-${pIdx}`}
                    onClick={() => setActiveLightboxItem(programToHighlightItem(prog))}
                    className="group bg-stone-900/90 rounded-2xl border border-stone-800/90 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1"
                  >
                    {/* 4:3 Aspect Ratio poster/photo container */}
                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-stone-950">
                      <img
                        src={prog.banner}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                        loading="lazy"
                      />
                      {/* Gradient shadow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                      {/* Top-Left Category Badge: font-mono px-2 py-0.5 rounded bg-stone-950/80 text-emerald-400 border border-emerald-500/40 */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-stone-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-xs">
                          {prog.category}
                        </span>
                      </div>

                      {/* Top-Right zoom button */}
                      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="p-1.5 rounded-lg bg-stone-950/80 text-amber-300 border border-amber-500/40 flex items-center justify-center backdrop-blur-xs">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Bottom-left Date on image: text-[11px] font-mono text-stone-300 */}
                      <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-1.5 text-[11px] font-mono text-stone-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{prog.date}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      {/* Bold Title: High-contrast readable typography */}
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-2 leading-snug">
                          {prog.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1.5 truncate">
                          <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                          <span className="truncate">{prog.venue}</span>
                        </div>
                      </div>

                      {/* Card Footer: Archive #{id} aur Full Lightbox -> */}
                      <div className="pt-3 mt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                        <span className="font-mono text-[10px] text-stone-500 uppercase">
                          Archive #{prog.id}
                        </span>
                        <span className="font-mono text-[11px] text-amber-400 group-hover:text-amber-300 font-semibold flex items-center gap-1">
                          <span>Full Lightbox</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-stone-900/50 rounded-2xl border border-stone-800 text-stone-400 space-y-2">
                <Calendar className="w-8 h-8 text-stone-600 mx-auto" />
                <p className="text-sm font-semibold text-stone-300">No programs match the current criteria.</p>
                <p className="text-xs text-stone-500">Explore the full catalog or adjust category filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen Lightbox Modal Viewer (Triggered on click of ANY Highlight or Program Card) */}
      <LightboxModal
        isOpen={Boolean(activeLightboxItem)}
        highlight={activeLightboxItem}
        onClose={() => setActiveLightboxItem(null)}
      />
    </section>
  );
};
