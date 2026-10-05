import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Wing, WingProgram } from '../types';
import { initialDatabase, defaultCoreCommitteeWing } from '../defaultData';
import {
  Search,
  Filter,
  Users,
  ChevronDown,
  ChevronRight,
  History,
  Mail,
  Crown,
  Award,
  UserCheck,
  User,
  Sparkles,
  BookOpen,
  HeartHandshake,
  Laptop,
  Trophy,
  GraduationCap,
  CheckCircle2,
  Calendar,
  X,
  MapPin,
  Clock,
  Layers,
  Tag,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  BookOpen,
  HeartHandshake,
  Laptop,
  Trophy,
  GraduationCap,
  Crown,
  Award,
};

export const OurWingsSection: React.FC = () => {
  const { database } = useData();
  const { wings } = database;

  const coreCommitteeWing =
    wings.find((w) => w.id === 'core-committee') || defaultCoreCommitteeWing;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  // Store selected historical year for each wing: record<wingId, yearString>
  const [selectedYears, setSelectedYears] = useState<Record<string, string>>({});
  // Lightbox preview for full-resolution photo inspection
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  // Wing conducted programs archives & modal
  const allWingPrograms: WingProgram[] =
    database.wingPrograms && database.wingPrograms.length > 0
      ? database.wingPrograms
      : initialDatabase.wingPrograms || [];

  const [activeWingModal, setActiveWingModal] = useState<Wing | null>(null);
  const [modalYearFilter, setModalYearFilter] = useState<string>('All');
  const [modalSearchTerm, setModalSearchTerm] = useState<string>('');

  const filteredWings = wings.filter((wing) => {
    if (wing.id === 'core-committee') return false;
    const matchesStatus = statusFilter === 'All' || wing.status === statusFilter;
    const chairmanName = wing.chairman?.name || wing.manager?.name || '';
    const convenerName = wing.convener?.name || '';
    const matchesSearch =
      wing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wing.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chairmanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convenerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleYearChange = (wingId: string, year: string) => {
    setSelectedYears((prev) => ({ ...prev, [wingId]: year }));
  };

  return (
    <section id="wings" className="py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              Specialized Operational Wings & Apex Executive
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-1">
              Our Wings & Core Committee Programs
            </h2>
            <p className="text-sm text-stone-400 mt-2 max-w-xl">
              ANJUMAN-E-HUDA operates through its Apex Core Committee and specialized student-run wings
              driving academic excellence, oratory clubs, humanitarian disaster relief, sports, and media.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search wings or leaders..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800">
              {['All', 'Active', 'Project Phase'].map((status, sIdx) => (
                <button
                  key={`wing-status-filter-${status}-${sIdx}`}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ================= CORE COMMITTEE COLUMN (Apex Executive - Highlighted & Left of Arabic Club) ================= */}
          {(() => {
            const matchesStatus = statusFilter === 'All' || statusFilter === 'Active';
            const matchesSearch =
              !searchTerm ||
              'core committee'.includes(searchTerm.toLowerCase()) ||
              'apex'.includes(searchTerm.toLowerCase()) ||
              (coreCommitteeWing.chairman?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesStatus || !matchesSearch) return null;

            const currentYear = selectedYears['core-committee'] || coreCommitteeWing.currentTenure || '2026-27';
            const historicalEntry = coreCommitteeWing.history?.find((h) => h.tenure === currentYear);
            const isHistorical = currentYear !== coreCommitteeWing.currentTenure;
            const availableYears = ['2026-27', '2025-26', '2024-25'];

            const corePrograms = allWingPrograms.filter(
              (wp) =>
                wp.wingId === 'core-committee' ||
                wp.wingName?.toLowerCase().includes('core')
            );
            const displayedCorePrograms =
              corePrograms.filter((wp) => wp.academicYear === currentYear).length > 0
                ? corePrograms.filter((wp) => wp.academicYear === currentYear)
                : corePrograms;

            return (
              <div
                key="wing-entry-core-committee"
                className="relative bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-2 border-amber-500/60 hover:border-amber-400 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-950/40 flex flex-col justify-between transition-all ring-1 ring-amber-500/25 group/core"
              >
                {/* Visual Golden Subtle Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-13 h-13 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover/core:scale-105 transition-transform">
                        <Crown className="w-7 h-7 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-md bg-amber-400 text-stone-950 uppercase tracking-wider shadow-sm">
                            APEX EXECUTIVE
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                            Central Secretariat
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1 group-hover/core:text-amber-200 transition-colors">
                          Core Committee
                        </h3>
                      </div>
                    </div>

                    {/* Tenure Archive */}
                    <div className="relative shrink-0">
                      <label className="block text-[9px] font-mono uppercase text-amber-400/90 font-bold mb-1">
                        Executive Tenure
                      </label>
                      <select
                        value={currentYear}
                        onChange={(e) => handleYearChange('core-committee', e.target.value)}
                        className="bg-stone-950 border border-amber-500/40 text-amber-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer font-mono font-bold"
                      >
                        {availableYears.map((yr) => (
                          <option key={`core-yr-${yr}`} value={yr}>
                            {yr === '2026-27' ? `${yr} (Active)` : yr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed mb-4">
                    Supreme governing council of ANJUMAN-E-HUDA steering union constitutional affairs,
                    general body convocations, and campus-wide policy directives.
                  </p>

                  {/* Prominent Button to open Core Committee Ledger */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWingModal(coreCommitteeWing);
                      setModalYearFilter('All');
                      setModalSearchTerm('');
                    }}
                    className="w-full mb-5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-stone-900 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 text-amber-200 border border-amber-500/50 text-xs font-bold flex items-center justify-between cursor-pointer shadow-lg transition-all group"
                  >
                    <span className="flex items-center gap-2 text-amber-300 font-mono">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span>Click to Open Core Committee Full Ledger & Programs</span>
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1 font-bold">
                      <span>View Ledger</span>
                      <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>

                  {/* Leadership snippet with Portraits */}
                  {(() => {
                    const presidentName = isHistorical && historicalEntry
                      ? (historicalEntry.chairman || 'Sayyid Muhammad Hashir')
                      : (coreCommitteeWing.chairman?.name || coreCommitteeWing.manager?.name || 'Sayyid Muhammad Hashir');
                    const presidentPhoto = isHistorical && historicalEntry?.chairmanPhoto
                      ? historicalEntry.chairmanPhoto
                      : (coreCommitteeWing.chairman?.photo || coreCommitteeWing.chairmanPhoto || coreCommitteeWing.manager?.photo || '');

                    const genSecName = isHistorical && historicalEntry
                      ? (historicalEntry.convener || 'Ahmad Abdullah Misbahi')
                      : (coreCommitteeWing.convener?.name || 'Ahmad Abdullah Misbahi');
                    const genSecPhoto = isHistorical && historicalEntry?.convenerPhoto
                      ? historicalEntry.convenerPhoto
                      : (coreCommitteeWing.convener?.photo || coreCommitteeWing.convenerPhoto || '');

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        {/* 1. Central President */}
                        <div className="p-3 rounded-2xl bg-stone-950/90 border border-amber-500/40 flex items-center gap-3 shadow-md">
                          <div
                            onClick={() => presidentPhoto && setPreviewImage({ url: presidentPhoto, title: presidentName, subtitle: 'Core Committee • Central President' })}
                            className={`relative w-16 h-20 sm:w-18 sm:h-24 rounded-xl overflow-hidden bg-stone-900 border-2 border-amber-500/60 shadow-md shrink-0 ${presidentPhoto ? 'cursor-pointer hover:ring-2 hover:ring-amber-400' : ''}`}
                            title={presidentPhoto ? 'Click to view full photo' : undefined}
                          >
                            {presidentPhoto ? (
                              <img
                                src={presidentPhoto}
                                alt={presidentName}
                                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-500">
                                <Crown className="w-5 h-5 text-amber-400/60 mb-0.5" />
                                <span className="text-[8px] font-mono uppercase text-amber-400">No Photo</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 inline-flex items-center gap-1 mb-1">
                              <Crown className="w-3 h-3 text-amber-400" />
                              President
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-tight truncate" title={presidentName}>
                              {presidentName}
                            </h4>
                            <p className="text-[10px] text-stone-400 font-mono mt-0.5 truncate">
                              {coreCommitteeWing.chairman?.contact || 'president@anjuman.edu'}
                            </p>
                          </div>
                        </div>

                        {/* 2. General Secretary */}
                        <div className="p-3 rounded-2xl bg-stone-950/90 border border-amber-500/40 flex items-center gap-3 shadow-md">
                          <div
                            onClick={() => genSecPhoto && setPreviewImage({ url: genSecPhoto, title: genSecName, subtitle: 'Core Committee • General Secretary' })}
                            className={`relative w-16 h-20 sm:w-18 sm:h-24 rounded-xl overflow-hidden bg-stone-900 border-2 border-amber-500/40 shadow-md shrink-0 ${genSecPhoto ? 'cursor-pointer hover:ring-2 hover:ring-amber-400' : ''}`}
                            title={genSecPhoto ? 'Click to view full photo' : undefined}
                          >
                            {genSecPhoto ? (
                              <img
                                src={genSecPhoto}
                                alt={genSecName}
                                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-500">
                                <User className="w-5 h-5 text-stone-400 mb-0.5" />
                                <span className="text-[8px] font-mono uppercase text-stone-400">No Photo</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-mono text-stone-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-900 border border-stone-800 inline-flex items-center gap-1 mb-1">
                              <UserCheck className="w-3 h-3 text-stone-400" />
                              Gen Secretary
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-tight truncate" title={genSecName}>
                              {genSecName}
                            </h4>
                            <p className="text-[10px] text-stone-400 font-mono mt-0.5 truncate">
                              {coreCommitteeWing.convener?.contact || 'gensec@anjuman.edu'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Conducted Programs Column (ONLY Program Name, Date, Category) */}
                  <div className="p-4 rounded-2xl bg-stone-950/90 border border-amber-500/40 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold font-mono uppercase text-amber-200 tracking-wider">
                          Conducted Programs ({corePrograms.length})
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveWingModal(coreCommitteeWing);
                          setModalYearFilter('All');
                          setModalSearchTerm('');
                        }}
                        className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 underline cursor-pointer"
                      >
                        <span>Open Full Ledger</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {displayedCorePrograms.length > 0 ? (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                        {displayedCorePrograms.map((prog, pIdx) => (
                          <div
                            key={`core-prog-${prog.id}-${pIdx}`}
                            className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <h5 className="text-xs sm:text-sm font-bold text-white leading-snug truncate" title={prog.title}>
                                {prog.title}
                              </h5>
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 text-[10px] font-mono font-bold shadow-xs">
                                  Category: {prog.targetClass}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center">
                              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                                Date: {prog.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-stone-900/40 border border-stone-800/50 text-center text-xs text-stone-400">
                        No recorded programs for Core Committee ({currentYear}).
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer status */}
                <div className="pt-4 mt-6 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400/90 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    Viewing Committee: {currentYear}
                  </span>
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 font-mono">
                    <Crown className="w-3.5 h-3.5" />
                    Supreme Jurisdiction
                  </span>
                </div>
              </div>
            );
          })()}
          {filteredWings.map((wing, wingIdx) => {
            const Icon = iconMap[wing.iconName] || Users;
            const currentYear = selectedYears[wing.id] || wing.currentTenure || '2026-27';

            // Find historical entry if a past year is chosen
            const historicalEntry = wing.history?.find((h) => h.tenure === currentYear);
            const isHistorical = currentYear !== wing.currentTenure;

            // Available distinct years for dropdown
            const availableYears = Array.from(
              new Set([
                wing.currentTenure,
                ...(wing.history?.map((h) => h.tenure) || []),
              ].filter(Boolean))
            );

            return (
              <div
                key={`wing-entry-${wing.id}-${wingIdx}`}
                className="bg-stone-900 border border-stone-800 hover:border-emerald-500/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Top Wing Identity & Dropdown feature to select previous years */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-950 text-amber-400 border border-stone-800">
                            {wing.shortName}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              wing.status === 'Active'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-stone-800 text-stone-300'
                            }`}
                          >
                            {wing.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold font-heading text-white mt-1">{wing.name}</h3>
                      </div>
                    </div>

                    {/* Dropdown feature to select previous years to view past wing leaders and dates */}
                    <div className="relative shrink-0">
                      <label className="block text-[9px] font-mono uppercase text-stone-400 mb-1">
                        Tenure Archive
                      </label>
                      <select
                        value={currentYear}
                        onChange={(e) => handleYearChange(wing.id, e.target.value)}
                        className="bg-stone-950 border border-stone-700 text-stone-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {availableYears.map((yr, yrIdx) => (
                          <option key={`wing-${wing.id}-yr-${yr}-${yrIdx}`} value={yr}>
                            {yr === wing.currentTenure ? `${yr} (Current)` : yr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed mb-3">{wing.description}</p>

                  {/* Prominent Button to open Wing & Programs Ledger */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveWingModal(wing);
                      setModalYearFilter('All');
                      setModalSearchTerm('');
                    }}
                    className="w-full mb-5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-950/90 via-stone-900 to-amber-950/90 hover:from-emerald-900 hover:to-amber-900 text-stone-200 border border-emerald-500/40 text-xs font-semibold flex items-center justify-between cursor-pointer shadow-md transition-all group"
                  >
                    <span className="flex items-center gap-2 text-emerald-300">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Click to Open Wing, Leaders & Conducted Programs</span>
                    </span>
                    <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                      <span>View Ledger</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>

                  {/* Historical Banner if past year selected */}
                  {isHistorical && historicalEntry?.keyMilestone && (
                    <div className="mb-5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                      <History className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Milestone ({currentYear}):</strong> {historicalEntry.keyMilestone}
                      </span>
                    </div>
                  )}

                  {/* Wing Leadership: Chairman and Convener with Significantly Enlarged Portrait Photos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1. Chairman */}
                    {(() => {
                      const chairmanName = isHistorical && historicalEntry
                        ? (historicalEntry.chairman || historicalEntry.manager || 'Not Assigned')
                        : (wing.chairman?.name || wing.manager?.name || 'Not Assigned');
                      const chairmanContact = wing.chairman?.contact || wing.manager?.contact || 'chairman@anjuman.edu';
                      const chairmanPhoto = isHistorical && historicalEntry?.chairmanPhoto
                        ? historicalEntry.chairmanPhoto
                        : (wing.chairman?.photo || wing.chairmanPhoto || wing.manager?.photo || '');

                      return (
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-950/95 border border-stone-800/90 hover:border-emerald-500/50 flex items-center gap-3.5 sm:gap-4 transition-all duration-300 group shadow-md hover:shadow-emerald-950/20">
                          {/* Large Portrait Photo Frame - Face clearly visible */}
                          <div
                            onClick={() => chairmanPhoto && setPreviewImage({ url: chairmanPhoto, title: chairmanName, subtitle: `${wing.name} • Chairman` })}
                            className={`relative w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden bg-stone-900 border-2 border-emerald-500/50 group-hover:border-emerald-400 shadow-xl shadow-black/80 shrink-0 ${chairmanPhoto ? 'cursor-pointer hover:ring-2 hover:ring-emerald-400/50' : ''}`}
                            title={chairmanPhoto ? "Click to view full photo" : undefined}
                          >
                            {chairmanPhoto ? (
                              <>
                                <img
                                  src={chairmanPhoto}
                                  alt={chairmanName}
                                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1.5 pointer-events-none">
                                  <span className="text-[9px] font-mono text-emerald-300 font-bold bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-xs">
                                    Enlarge
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-stone-900 to-emerald-950/50 text-stone-500 p-2 text-center">
                                <User className="w-8 h-8 text-emerald-400/60 mb-1" />
                                <span className="text-[9px] font-mono uppercase text-emerald-500/80 font-bold">No Photo</span>
                              </div>
                            )}
                          </div>

                          {/* Info Column */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/30 inline-flex items-center gap-1 shadow-sm">
                                <Crown className="w-3.5 h-3.5 text-emerald-400" />
                                CHAIRMAN
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-emerald-200 transition-colors truncate" title={chairmanName}>
                              {chairmanName}
                            </h4>
                            <p className="text-[11px] text-stone-400 mt-0.5 truncate font-medium">
                              Portfolio Leader
                            </p>
                            <div className="mt-2 text-xs text-stone-400 flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-emerald-500/70 shrink-0" />
                              <span className="truncate text-[11px] sm:text-xs">{chairmanContact}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 2. Convener */}
                    {(() => {
                      const convenerName = isHistorical && historicalEntry
                        ? (historicalEntry.convener || 'Not Assigned')
                        : (wing.convener?.name || 'Not Assigned');
                      const convenerContact = wing.convener?.contact || 'convener@anjuman.edu';
                      const convenerPhoto = isHistorical && historicalEntry?.convenerPhoto
                        ? historicalEntry.convenerPhoto
                        : (wing.convener?.photo || wing.convenerPhoto || '');

                      return (
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-950/95 border border-stone-800/90 hover:border-amber-500/50 flex items-center gap-3.5 sm:gap-4 transition-all duration-300 group shadow-md hover:shadow-amber-950/20">
                          {/* Large Portrait Photo Frame - Face clearly visible */}
                          <div
                            onClick={() => convenerPhoto && setPreviewImage({ url: convenerPhoto, title: convenerName, subtitle: `${wing.name} • Convener` })}
                            className={`relative w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden bg-stone-900 border-2 border-amber-500/50 group-hover:border-amber-400 shadow-xl shadow-black/80 shrink-0 ${convenerPhoto ? 'cursor-pointer hover:ring-2 hover:ring-amber-400/50' : ''}`}
                            title={convenerPhoto ? "Click to view full photo" : undefined}
                          >
                            {convenerPhoto ? (
                              <>
                                <img
                                  src={convenerPhoto}
                                  alt={convenerName}
                                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1.5 pointer-events-none">
                                  <span className="text-[9px] font-mono text-amber-300 font-bold bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-xs">
                                    Enlarge
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-stone-900 to-amber-950/50 text-stone-500 p-2 text-center">
                                <UserCheck className="w-8 h-8 text-amber-400/60 mb-1" />
                                <span className="text-[9px] font-mono uppercase text-amber-500/80 font-bold">No Photo</span>
                              </div>
                            )}
                          </div>

                          {/* Info Column */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-950/90 border border-amber-500/30 inline-flex items-center gap-1 shadow-sm">
                                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                                CONVENER
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-amber-200 transition-colors truncate" title={convenerName}>
                              {convenerName}
                            </h4>
                            <p className="text-[11px] text-stone-400 mt-0.5 truncate font-medium">
                              Operational Head
                            </p>
                            <div className="mt-2 text-xs text-stone-400 flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
                              <span className="truncate text-[11px] sm:text-xs">{convenerContact}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Wing Conducted Programs Column */}
                  {(() => {
                    const programsForWing = allWingPrograms.filter(
                      (wp) =>
                        wp.wingId === wing.id ||
                        wp.wingName?.toLowerCase() === wing.name.toLowerCase() ||
                        (wing.shortName && wp.wingName?.toLowerCase().includes(wing.shortName.toLowerCase())) ||
                        wing.name.toLowerCase().includes(wp.wingName?.toLowerCase() || '____')
                    );
                    const programsForTenure = programsForWing.filter(
                      (wp) => wp.academicYear === currentYear
                    );
                    const displayedPrograms = programsForTenure.length > 0 ? programsForTenure : programsForWing;

                    return (
                      <div className="mt-5 p-4 rounded-2xl bg-stone-950/80 border border-stone-800/90 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-xs font-bold font-mono uppercase text-stone-200 tracking-wider">
                              Conducted Programs ({programsForWing.length})
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveWingModal(wing);
                              setModalYearFilter('All');
                              setModalSearchTerm('');
                            }}
                            className="text-[11px] font-mono font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline cursor-pointer"
                          >
                            <span>Open Full Ledger</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Programs list: Only Program Name, Date, Category */}
                        {displayedPrograms.length > 0 ? (
                          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                            {displayedPrograms.map((prog, pIdx) => (
                              <div
                                key={`wing-prog-${prog.id}-${pIdx}`}
                                className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div className="min-w-0 flex-1 space-y-1">
                                  <h5 className="text-xs sm:text-sm font-bold text-white leading-snug truncate" title={prog.title}>
                                    {prog.title}
                                  </h5>
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 text-[10px] font-mono font-bold shadow-xs">
                                      Category: {prog.targetClass}
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center">
                                  <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                                    Date: {prog.date}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-stone-900/40 border border-stone-800/50 text-center text-xs text-stone-400">
                            No recorded programs for this wing ({currentYear}).
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Footer status */}
                <div className="pt-4 mt-6 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-stone-500">
                    <Calendar className="w-3.5 h-3.5" />
                    Viewing Committee: {currentYear}
                  </span>
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Council Ratified
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredWings.length === 0 && (
          <div className="text-center py-16 bg-stone-900 rounded-2xl border border-stone-800 text-stone-400">
            No wings found matching your search term.
          </div>
        )}
      </div>

      {/* Photo Enlarge Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 max-w-sm sm:max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 mb-4 max-h-[60vh] flex items-center justify-center shadow-inner">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="w-full h-auto max-h-[58vh] object-contain"
              />
            </div>
            <div className="text-center">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                {previewImage.subtitle}
              </span>
              <h3 className="text-xl font-bold text-white font-heading">
                {previewImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Full Wing Conducted Programs & Class History Modal */}
      {activeWingModal && (() => {
        // Robust matching for any wing ID or wing name (including IIC WING)
        const matchedPrograms = allWingPrograms.filter((wp) => {
          if (!wp) return false;
          if (wp.wingId && wp.wingId === activeWingModal.id) return true;
          const wName = (wp.wingName || '').toLowerCase().trim();
          const modalName = (activeWingModal.name || '').toLowerCase().trim();
          const modalShort = (activeWingModal.shortName || '').toLowerCase().trim();
          if (wName && (wName === modalName || modalName.includes(wName) || wName.includes(modalName))) return true;
          if (modalShort && (wName.includes(modalShort) || modalShort.includes(wName))) return true;
          if ((modalShort.includes('iic') || modalName.includes('iic')) && (wName.includes('iic') || wp.wingId?.includes('iic'))) return true;
          if ((activeWingModal.id === 'core-committee' || modalName.includes('core')) && (wp.wingId === 'core-committee' || wName.includes('core'))) return true;
          return false;
        });

        // Only actual recorded programs in database! Absolutely no fake sample programs!
        const wingPrograms = matchedPrograms;

        // Unique academic years available
        const distinctYears = Array.from(
          new Set(wingPrograms.map((wp) => wp.academicYear).filter(Boolean))
        ).sort().reverse();
        if (distinctYears.length === 0) distinctYears.push('2026-27', '2025-26', '2024-25');

        // Filtered programs: by Year (if selected) and optional search term
        // Default modalYearFilter is 'All' so all programs show up immediately!
        const filteredModalPrograms = wingPrograms.filter((wp) => {
          const matchesYear = modalYearFilter === 'All' || wp.academicYear === modalYearFilter;
          const matchesSearch =
            !modalSearchTerm ||
            wp.title.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
            wp.targetClass.toLowerCase().includes(modalSearchTerm.toLowerCase());

          return matchesYear && matchesSearch;
        });

        const WingIcon = iconMap[activeWingModal.iconName] || Users;

        return (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
            onClick={() => setActiveWingModal(null)}
          >
            <div
              className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-7 max-w-5xl w-full shadow-2xl relative max-h-[92vh] flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-800 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
                    <WingIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-950 text-amber-400 border border-stone-800">
                        {activeWingModal.shortName}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                        {activeWingModal.status}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold font-heading text-white truncate mt-1">
                      {activeWingModal.name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveWingModal(null)}
                  className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Year Filter Bar & Search */}
              <div className="py-4 border-b border-stone-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                {/* Year Selection Tabs - All Years is default and shows all programs! */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
                  <span className="text-xs font-mono text-stone-400 uppercase font-bold mr-1 shrink-0 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Year:
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalYearFilter('All')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                      modalYearFilter === 'All'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                        : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    All Years ({wingPrograms.length})
                  </button>
                  {distinctYears.map((yr) => {
                    const countForYear = wingPrograms.filter((wp) => wp.academicYear === yr).length;
                    return (
                      <button
                        key={`modal-yr-${yr}`}
                        type="button"
                        onClick={() => setModalYearFilter(yr)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                          modalYearFilter === yr
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                            : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                        }`}
                      >
                        {yr} {countForYear > 0 ? `(${countForYear})` : ''}
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    placeholder="Search program or category..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Scrollable Programs Columns Grid */}
              {/* Every program has its own column with ONLY: Program Name, Date, Category */}
              <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin py-4">
                {filteredModalPrograms.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredModalPrograms.map((prog, pIdx) => (
                      <div
                        key={`ledger-prog-col-${prog.id}-${pIdx}`}
                        className="p-5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-500/60 shadow-lg hover:shadow-emerald-950/30 transition-all flex flex-col justify-between group hover:-translate-y-1 min-h-[170px]"
                      >
                        {/* 1. Program Name */}
                        <div>
                          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-1">
                            Program #{pIdx + 1}
                          </span>
                          <h4 className="text-base font-bold font-heading text-white group-hover:text-emerald-300 transition-colors leading-snug">
                            {prog.title}
                          </h4>
                        </div>

                        {/* 2. Category & 3. Date */}
                        <div className="space-y-2 pt-4 border-t border-stone-800/80 mt-4">
                          {/* Category (Class) */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-stone-400 font-semibold uppercase">Category:</span>
                            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-800/50 truncate">
                              {prog.targetClass}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-stone-400 font-semibold uppercase">Date:</span>
                            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/50">
                              {prog.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-stone-950/50 rounded-2xl border border-stone-800 text-stone-400 space-y-3">
                    <Calendar className="w-10 h-10 text-stone-600 mx-auto" />
                    <p className="text-base font-semibold text-stone-200">
                      No programs found for {activeWingModal.name}
                      {modalYearFilter !== 'All' ? ` in ${modalYearFilter}` : ''}.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setModalYearFilter('All');
                        setModalSearchTerm('');
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow transition-colors"
                    >
                      Show All Programs
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
                <span className="font-mono text-[11px] text-stone-400">
                  Showing <strong>{filteredModalPrograms.length}</strong> of <strong>{wingPrograms.length}</strong> programs
                  {modalYearFilter !== 'All' ? ` (${modalYearFilter})` : ' (All Years)'}
                </span>
                <span className="text-emerald-400 text-xs font-medium flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Preserved for Succession
                </span>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};
