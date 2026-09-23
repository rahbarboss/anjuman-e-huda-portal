import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Program } from '../types';
import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Clock,
  Tag,
  Filter,
  CheckCircle2,
  Share2,
  ExternalLink,
  X,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface Props {
  onOpenNotifications?: () => void;
}

export const LatestProgramsAndAnnouncements: React.FC<Props> = ({ onOpenNotifications }) => {
  const { database } = useData();
  const { programs } = database;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProgram, setActiveModalProgram] = useState<Program | null>(null);

  const categories = ['All', 'Academic', 'Cultural', 'Outreach', 'Sports', 'Leadership'];

  // Filter programs based on selected category
  const filteredPrograms = programs.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  // Display top programs (up to 6)
  const displayedPrograms = filteredPrograms.slice(0, 6);

  const scrollToAllPrograms = () => {
    const el = document.querySelector('#programs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Academic':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cultural':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Outreach':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Sports':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Leadership':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <section id="updates" className="py-20 bg-stone-100 text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-300/80 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/10 border border-emerald-600/30 text-emerald-800 text-xs font-semibold tracking-wider uppercase font-mono shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                OFFICIAL UNION CALENDAR • ACADEMIC SESSION 2026–27
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 tracking-tight">
              Latest Programs & Colloquiums
            </h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
              Curated intellectual colloquiums, inter-collegiate declamation galas, humanitarian relief camps, and
              transformative spiritual assemblies spearheaded by ANJUMAN-E-HUDA's specialized councils.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="view-all-programs-btn"
              type="button"
              onClick={scrollToAllPrograms}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Gazettes & Notices</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          <span className="text-xs font-mono font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filter:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={`prog-cat-${cat}`}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/20'
                    : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-300/80 hover:border-emerald-400'
                }`}
              >
                {cat === 'All' ? 'All Active Programs' : cat}
              </button>
            );
          })}
        </div>

        {/* Programs Grid - Full Width Beautiful Cards */}
        {displayedPrograms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <Layers className="w-12 h-12 mx-auto text-stone-400 mb-3" />
            <h3 className="text-lg font-bold text-stone-800 mb-1">No Programs in this Category</h3>
            <p className="text-sm text-stone-500 mb-4">
              There are currently no featured programs listed under "{selectedCategory}".
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-medium"
            >
              Reset Category Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayedPrograms.map((prog, idx) => {
              const isLive = prog.status === 'Live';
              const isUpcoming = prog.status === 'Upcoming';

              return (
                <div
                  key={`latest-prog-card-${prog.id}-${idx}`}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5"
                >
                  <div>
                    {/* Banner Image with status & category badge */}
                    <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                      <img
                        src={prog.banner}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      {/* Top Left Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${
                            isLive
                              ? 'bg-red-600 text-white ring-2 ring-red-400/50 animate-pulse'
                              : isUpcoming
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-800 text-stone-200'
                          }`}
                        >
                          {isLive && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                          {prog.status}
                        </span>
                      </div>

                      {/* Top Right Category Pill */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-sm ${getCategoryColor(
                            prog.category
                          )}`}
                        >
                          {prog.category}
                        </span>
                      </div>

                      {/* Date capsule overlay at bottom of banner */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          {prog.date}
                        </span>
                        <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 font-mono">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          {prog.time}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold font-heading text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug mb-2.5">
                        {prog.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
                        {prog.description}
                      </p>

                      {/* Venue location pill */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-700 text-xs mb-3.5">
                        <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="font-medium truncate">{prog.venue}</span>
                      </div>

                      {/* Tags */}
                      {prog.tags && prog.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {prog.tags.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={`ptag-${tag}-${tIdx}`}
                              className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200"
                            >
                              <Tag className="w-2.5 h-2.5 text-stone-400" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-5 py-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveModalProgram(prog)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View Full Agenda</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {prog.registrationLink ? (
                      <a
                        href={prog.registrationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                      >
                        <span>Register</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={scrollToAllPrograms}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner with Quick Navigation */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border border-stone-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Looking for the Complete Collegiate Calendar?</h4>
              <p className="text-xs text-stone-300">
                Browse all previous symposiums, annual de-facto convenings, and upcoming student body elections.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToAllPrograms}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Explore All {programs.length} Programs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Program Details Modal Popup */}
      {activeModalProgram && (
        <div
          id="program-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setActiveModalProgram(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-300 flex flex-col text-stone-900 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-56 w-full bg-stone-900 overflow-hidden">
              <img
                src={activeModalProgram.banner}
                alt={activeModalProgram.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button
                type="button"
                onClick={() => setActiveModalProgram(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider bg-emerald-600 text-white mb-2">
                  {activeModalProgram.category} • {activeModalProgram.status}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white leading-tight">
                  {activeModalProgram.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Event Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-stone-400 font-mono uppercase">Event Date</span>
                    <strong className="font-semibold text-stone-900">{activeModalProgram.date}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-stone-700">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-stone-400 font-mono uppercase">Time Schedule</span>
                    <strong className="font-semibold text-stone-900">{activeModalProgram.time}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-stone-700">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-stone-400 font-mono uppercase">Assembly Venue</span>
                    <strong className="font-semibold text-stone-900 truncate block max-w-[140px]">
                      {activeModalProgram.venue}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Comprehensive Description */}
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-2">About this Program</h4>
                <p className="text-sm text-stone-700 leading-relaxed font-normal">
                  {activeModalProgram.description}
                </p>
              </div>

              {/* Tags */}
              {activeModalProgram.tags && activeModalProgram.tags.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Topic Keywords
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalProgram.tags.map((t, i) => (
                      <span
                        key={`modal-tag-${t}-${i}`}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-700 font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModalProgram(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl"
              >
                Close Window
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveModalProgram(null);
                  scrollToAllPrograms();
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow"
              >
                <span>View in Union Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
