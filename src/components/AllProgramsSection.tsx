import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Program, HighlightItem } from '../types';
import {
  Calendar as CalendarIcon,
  Layers,
  Sparkles,
  Trophy,
  Search,
  MapPin,
  Clock,
  Tag,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Users,
  HeartHandshake,
  CheckCircle,
  ExternalLink,
  Menu,
} from 'lucide-react';
import { LightboxModal } from './LightboxModal';

type ProgramSidebarTab = 'all-programs' | 'calendar' | 'highlights' | 'achievements';

export const AllProgramsSection: React.FC = () => {
  const { database } = useData();
  const { programs, highlights, achievements } = database;

  const [activeTab, setActiveTab] = useState<ProgramSidebarTab>('all-programs');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search & Category for All Programs
  const [programSearch, setProgramSearch] = useState('');
  const [programCategory, setProgramCategory] = useState<string>('All');

  // Highlights state
  const [highlightFilter, setHighlightFilter] = useState<'All' | 'Event' | 'Announcement'>('All');
  const [selectedHighlightIndex, setSelectedHighlightIndex] = useState<number | null>(null);

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(2026, 8, 1)); // September 2026
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(null);

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((prog) => {
      const matchesCat = programCategory === 'All' || prog.category === programCategory;
      const matchesSearch =
        prog.title.toLowerCase().includes(programSearch.toLowerCase()) ||
        prog.venue.toLowerCase().includes(programSearch.toLowerCase()) ||
        prog.description.toLowerCase().includes(programSearch.toLowerCase()) ||
        prog.tags.some((t) => t.toLowerCase().includes(programSearch.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [programs, programCategory, programSearch]);

  // Filtered Highlights
  const filteredHighlights = useMemo(() => {
    if (highlightFilter === 'All') return highlights;
    return highlights.filter((h) => h.category === highlightFilter);
  }, [highlights, highlightFilter]);

  // Calendar Helpers
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Program dates map for calendar highlighting
  const eventsByDate = useMemo(() => {
    const map: Record<string, Program[]> = {};
    programs.forEach((p) => {
      if (!map[p.date]) map[p.date] = [];
      map[p.date].push(p);
    });
    return map;
  }, [programs]);

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const currentHighlightItem =
    selectedHighlightIndex !== null ? filteredHighlights[selectedHighlightIndex] : null;

  const handleNextHighlight = () => {
    if (selectedHighlightIndex === null) return;
    setSelectedHighlightIndex((selectedHighlightIndex + 1) % filteredHighlights.length);
  };
  const handlePrevHighlight = () => {
    if (selectedHighlightIndex === null) return;
    setSelectedHighlightIndex(
      (selectedHighlightIndex - 1 + filteredHighlights.length) % filteredHighlights.length,
    );
  };

  const programCategories = [
    'All',
    'Academic',
    'Cultural',
    'Leadership',
    'Outreach',
    'Sports',
    "Religious & Ta'lim",
  ];

  const sidebarMenus = [
    { id: 'all-programs' as ProgramSidebarTab, label: 'All Program', icon: Layers },
    { id: 'calendar' as ProgramSidebarTab, label: 'Program Calender', icon: CalendarIcon },
    { id: 'highlights' as ProgramSidebarTab, label: 'Highlights', icon: Sparkles },
    { id: 'achievements' as ProgramSidebarTab, label: 'Our Achievements', icon: Trophy },
  ];

  return (
    <section id="programs" className="py-16 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono">
            Executive Programs & Galleries
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-1">
            Program Portfolios & Archives
          </h2>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl">
            Explore union conferences, our live interactive calendar, campus visual highlights, and
            institutional milestones.
          </p>
        </div>

        {/* Mobile Navigation Pills for Sidebar */}
        <div className="lg:hidden mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {sidebarMenus.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={`mobile-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Layout: Sticky Left Sidebar + Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DARK STICKY LEFT SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-4">
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 shadow-xl">
              <div className="px-3 py-2 border-b border-stone-800/80 mb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 font-bold">
                  PROGRAM NAVIGATION
                </span>
              </div>

              <div className="space-y-1">
                {sidebarMenus.map((menu) => {
                  const Icon = menu.icon;
                  const isActive = activeTab === menu.id;
                  return (
                    <button
                      key={`sidebar-tab-${menu.id}`}
                      id={`sidebar-menu-${menu.id}`}
                      onClick={() => setActiveTab(menu.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/80 font-bold'
                          : 'text-stone-300 hover:bg-stone-900 hover:text-emerald-400'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                      <span>{menu.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Info Box in Sidebar */}
              <div className="mt-6 pt-4 border-t border-stone-800/80 px-2 text-[11px] text-stone-400">
                <p className="font-mono text-emerald-400 mb-1">CENTRAL SCHEDULE</p>
                <p className="leading-relaxed">
                  All programs are verified under CAU Ordinance 1994. Timely registrations are mandatory.
                </p>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9 space-y-6">
            {/* Notice Modal/Banner if user clicked registration */}
            {registrationNotice && (
              <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-between gap-4 text-emerald-200 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{registrationNotice}</span>
                </div>
                <button
                  onClick={() => setRegistrationNotice(null)}
                  className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold cursor-pointer shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* TAB 1: ALL PROGRAM */}
            {activeTab === 'all-programs' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Search & Category Filter Toolbar */}
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={programSearch}
                      onChange={(e) => setProgramSearch(e.target.value)}
                      placeholder="Search events, venues, topics..."
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {programCategories.map((cat) => (
                      <button
                        key={`prog-cat-${cat}`}
                        onClick={() => setProgramCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                          programCategory === cat
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Cards Showing category badges, banners, event names, tags, date, and venue */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPrograms.map((prog, pIdx) => (
                    <div
                      key={`prog-item-${prog.id || pIdx}`}
                      className="bg-stone-950 border border-stone-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Banner & Badges */}
                        <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                          <img
                            src={prog.banner}
                            alt={prog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-stone-950/85 backdrop-blur-sm text-emerald-400 border border-emerald-500/40 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg shadow">
                              {prog.category}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                prog.status === 'Live'
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : prog.status === 'Upcoming'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-800 text-stone-300'
                              }`}
                            >
                              {prog.status}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5">
                          <div className="flex items-center gap-3 text-xs text-stone-400 mb-2 font-mono">
                            <span className="flex items-center gap-1 text-amber-400">
                              <CalendarIcon className="w-3.5 h-3.5" />
                              {prog.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-stone-500" />
                              {prog.time}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 leading-snug">
                            {prog.title}
                          </h3>

                          <p className="text-xs text-stone-300 leading-relaxed line-clamp-3 mb-4">
                            {prog.description}
                          </p>

                          {/* Venue info */}
                          <div className="flex items-center gap-1.5 text-xs text-stone-400 font-medium mb-4">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{prog.venue}</span>
                          </div>

                          {/* Tags list */}
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            {prog.tags.map((t, tIdx) => (
                              <span
                                key={`prog-${prog.id}-tag-${t}-${tIdx}`}
                                className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] text-stone-400 font-mono"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-5 pt-0">
                        <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                          <span className="text-xs text-stone-500">ANJUMAN-E-HUDA Official</span>
                          <button
                            onClick={() => {
                              setRegistrationNotice(`Registration & Inquiry open for: "${prog.title}". Please visit the Central Secretariat Desk or contact the respective Wing Manager.`);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Details & Registration
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPrograms.length === 0 && (
                  <div className="text-center py-16 bg-stone-950 rounded-2xl border border-stone-800 text-stone-400">
                    No programs found matching the selected category or search filter.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROGRAM CALENDER */}
            {activeTab === 'calendar' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 shadow-xl">
                  {/* Calendar Navigation Bar */}
                  <div className="flex items-center justify-between pb-6 border-b border-stone-800 mb-6">
                    <div>
                      <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                        INTERACTIVE CALENDAR
                      </span>
                      <h3 className="text-xl font-bold font-heading text-white">{monthName}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevMonth}
                        className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
                        title="Previous month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition-colors"
                        title="Next month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Day Labels */}
                  <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-mono text-stone-500 font-bold">
                    <span>SUN</span>
                    <span>MON</span>
                    <span>TUE</span>
                    <span>WED</span>
                    <span>THU</span>
                    <span>FRI</span>
                    <span>SAT</span>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells before month begins */}
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`cal-empty-${i}`} className="h-20 bg-stone-900/30 rounded-xl border border-transparent" />
                    ))}

                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNumber = i + 1;
                      const dayStr = String(dayNumber).padStart(2, '0');
                      const monthStr = String(month + 1).padStart(2, '0');
                      const fullDate = `${year}-${monthStr}-${dayStr}`;
                      const eventsOnDay = eventsByDate[fullDate] || [];
                      const isSelected = selectedCalendarDate === fullDate;

                      return (
                        <div
                          key={`cal-day-cell-${year}-${monthStr}-${dayStr}`}
                          onClick={() => setSelectedCalendarDate(fullDate)}
                          className={`h-20 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40'
                              : eventsOnDay.length > 0
                              ? 'bg-stone-900/90 border-amber-500/40 hover:border-amber-400'
                              : 'bg-stone-900/40 border-stone-800/80 hover:bg-stone-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-mono font-bold ${eventsOnDay.length > 0 ? 'text-amber-400' : 'text-stone-300'}`}>
                              {dayNumber}
                            </span>
                            {eventsOnDay.length > 0 && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                          </div>

                          {eventsOnDay.length > 0 ? (
                            <div className="space-y-0.5">
                              {eventsOnDay.slice(0, 1).map((ev, evIdx) => (
                                <p key={`cal-ev-${dayNumber}-${ev.id || evIdx}`} className="text-[10px] text-emerald-300 font-semibold truncate leading-tight">
                                  {ev.title}
                                </p>
                              ))}
                              {eventsOnDay.length > 1 && (
                                <span className="text-[9px] text-stone-400 font-mono">
                                  +{eventsOnDay.length - 1} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <div />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scheduled Events on Selected Day or Upcoming List */}
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-emerald-400" />
                      {selectedCalendarDate ? `Programs for ${selectedCalendarDate}` : 'Upcoming Scheduled Dates'}
                    </h4>
                    {selectedCalendarDate && (
                      <button
                        onClick={() => setSelectedCalendarDate(null)}
                        className="text-xs text-stone-400 hover:text-emerald-400 underline"
                      >
                        Show All Dates
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {programs
                      .filter((p) => (selectedCalendarDate ? p.date === selectedCalendarDate : true))
                      .slice(0, 4)
                      .map((p, pIdx) => (
                        <div
                          key={`cal-detail-event-${p.id || pIdx}`}
                          className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div>
                            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                              {p.date} • {p.time}
                            </span>
                            <h5 className="text-sm font-bold text-white mt-0.5">{p.title}</h5>
                            <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              {p.venue}
                            </p>
                          </div>

                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {p.category}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HIGHLIGHTS SECTION */}
            {activeTab === 'highlights' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Header & Tab Filters: (All, Event, Announcement) */}
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-white">Visual Highlights Gallery</h3>
                    <p className="text-xs text-stone-400">
                      Click any photo to open full-screen Lightbox image viewer with direct Download
                    </p>
                  </div>

                  {/* Tab Filters: All, Event, Announcement */}
                  <div className="flex items-center gap-2 bg-stone-900 p-1.5 rounded-xl border border-stone-800">
                    {(['All', 'Event', 'Announcement'] as const).map((filter) => (
                      <button
                        key={`hl-filter-${filter}`}
                        onClick={() => setHighlightFilter(filter)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          highlightFilter === filter
                            ? 'bg-emerald-600 text-white shadow'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Highlight Image Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHighlights.map((hl, index) => (
                    <div
                      key={`hl-card-${hl.id}-${index}`}
                      onClick={() => setSelectedHighlightIndex(index)}
                      className="bg-stone-950 border border-stone-800 hover:border-emerald-500/60 rounded-2xl overflow-hidden shadow-xl cursor-pointer group transition-all hover:-translate-y-1 flex flex-col"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                        <img
                          src={hl.imageUrl}
                          alt={hl.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur-sm text-emerald-400 border border-emerald-500/40">
                            {hl.category}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="p-2 rounded-lg bg-emerald-600 text-white shadow-lg flex items-center gap-1 text-[10px] font-bold">
                            <Download className="w-3.5 h-3.5" />
                            View & Download
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-mono text-stone-400 block mb-1">
                            {hl.date}
                          </span>
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                            {hl.title}
                          </h4>
                        </div>

                        <div className="pt-3 border-t border-stone-900 mt-3 flex items-center justify-between text-[11px] text-stone-500">
                          <span>Archive #{hl.id}</span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            Full Lightbox <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: OUR ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Dashboard-style Stat Section */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold font-heading text-white">{achievements.totalAchievements}</p>
                    <p className="text-xs text-stone-400 font-medium mt-1">Total Achievements</p>
                  </div>

                  <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-3">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold font-heading text-white">
                      {achievements.totalOutreachInitiatives}
                    </p>
                    <p className="text-xs text-stone-400 font-medium mt-1">Total Outreach Initiatives</p>
                  </div>

                  <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold font-heading text-white">{achievements.eventsOrganized}</p>
                    <p className="text-xs text-stone-400 font-medium mt-1">Events Organized</p>
                  </div>

                  <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold font-heading text-white">
                      {achievements.activeMembers.toLocaleString()}
                    </p>
                    <p className="text-xs text-stone-400 font-medium mt-1">Active Union Members</p>
                  </div>
                </div>

                {/* Notable Achievements Detailed Cards */}
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold font-heading text-white mb-4">
                    Hall of Accolades & Trophies
                  </h3>

                  <div className="space-y-4">
                    {achievements.items.map((ach, achIdx) => (
                      <div
                        key={`ach-item-${ach.id || achIdx}`}
                        className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-950 text-stone-400 border border-stone-800">
                                {ach.year}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                {ach.category}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-white">{ach.title}</h4>
                            <p className="text-xs text-stone-300 mt-1 leading-relaxed">{ach.description}</p>
                          </div>
                        </div>

                        {ach.badge && (
                          <span className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-500/30">
                            {ach.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Lightbox Modal for Highlights */}
      <LightboxModal
        isOpen={selectedHighlightIndex !== null}
        highlight={currentHighlightItem}
        onClose={() => setSelectedHighlightIndex(null)}
        onNext={handleNextHighlight}
        onPrev={handlePrevHighlight}
      />
    </section>
  );
};
