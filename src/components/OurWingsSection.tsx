import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Wing } from '../types';
import {
  Search,
  Filter,
  Users,
  ChevronDown,
  History,
  Mail,
  Crown,
  Award,
  UserCheck,
  Sparkles,
  BookOpen,
  HeartHandshake,
  Laptop,
  Trophy,
  GraduationCap,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  BookOpen,
  HeartHandshake,
  Laptop,
  Trophy,
  GraduationCap,
};

export const OurWingsSection: React.FC = () => {
  const { database } = useData();
  const { wings } = database;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  // Store selected historical year for each wing: record<wingId, yearString>
  const [selectedYears, setSelectedYears] = useState<Record<string, string>>({});

  const filteredWings = wings.filter((wing) => {
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
              Specialized Operational Wings
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-1">
              Our Wings & Portfolios
            </h2>
            <p className="text-sm text-stone-400 mt-2 max-w-xl">
              ANJUMAN-E-HUDA operates through six specialized student-run wings driving academic
              excellence, literary publications, humanitarian disaster relief, sports, and media.
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

                  <p className="text-xs text-stone-300 leading-relaxed mb-6">{wing.description}</p>

                  {/* Historical Banner if past year selected */}
                  {isHistorical && historicalEntry?.keyMilestone && (
                    <div className="mb-5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                      <History className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Milestone ({currentYear}):</strong> {historicalEntry.keyMilestone}
                      </span>
                    </div>
                  )}

                  {/* Wing Leadership: Chairman and Convener only */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1. Chairman */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/90 border border-stone-800/90 hover:border-emerald-500/40 flex flex-col justify-between transition-all group shadow-sm">
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/30 flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-emerald-400" />
                            CHAIRMAN
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-emerald-200 transition-colors">
                          {isHistorical && historicalEntry
                            ? (historicalEntry.chairman || historicalEntry.manager)
                            : (wing.chairman?.name || wing.manager?.name)}
                        </h4>
                      </div>
                      <div className="pt-3 mt-3 border-t border-stone-800/80 text-xs text-stone-400 flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-emerald-500/70 shrink-0" />
                        <span className="truncate">
                          {wing.chairman?.contact || wing.manager?.contact || 'chairman@anjuman.edu'}
                        </span>
                      </div>
                    </div>

                    {/* 2. Convener */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/90 border border-stone-800/90 hover:border-amber-500/40 flex flex-col justify-between transition-all group shadow-sm">
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-950/90 border border-amber-500/30 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                            CONVENER
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
                          {isHistorical && historicalEntry ? historicalEntry.convener : wing.convener.name}
                        </h4>
                      </div>
                      <div className="pt-3 mt-3 border-t border-stone-800/80 text-xs text-stone-400 flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
                        <span className="truncate">
                          {wing.convener.contact || 'convener@anjuman.edu'}
                        </span>
                      </div>
                    </div>
                  </div>
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
    </section>
  );
};
