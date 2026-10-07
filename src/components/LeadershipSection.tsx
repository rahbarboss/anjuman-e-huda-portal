import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { initialDatabase } from '../defaultData';
import {
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight,
  Archive,
  Award,
  Crown,
  MapPin,
  Sparkles,
  Building2,
  CheckCircle2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  X,
  FileText,
  Image as ImageIcon,
  User,
} from 'lucide-react';
import { CommitteeArchiveModal } from './CommitteeArchiveModal';

export const LeadershipSection: React.FC = () => {
  const { database } = useData();
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [selectedTenure, setSelectedTenure] = useState<string>('2026-27');
  const [posterModalOpen, setPosterModalOpen] = useState(false);
  const [posterZoomLevel, setPosterZoomLevel] = useState<number>(1);

  // Get distinct tenures from leaders, niicsInCharge and coreCommitteePosters
  const allTenures = [
    ...database.leaders.map((l) => l.tenure),
    ...((database.niicsInCharge || []).map((n) => n.tenure)),
    ...((database.coreCommitteePosters || []).map((p) => p.tenure)),
    ...((initialDatabase.coreCommitteePosters || []).map((p) => p.tenure)),
  ].filter(Boolean);

  const tenures = Array.from(new Set(allTenures)).sort().reverse();
  if (!tenures.includes('2026-27')) tenures.unshift('2026-27');

  // Leaders for current selected tenure, strictly sorted by duty / hierarchy order number
  const currentLeaders = [...database.leaders]
    .filter((l) => !l.tenure || l.tenure === selectedTenure || l.tenure.startsWith(selectedTenure.split('-')[0]))
    .sort((a, b) => {
      const orderA = typeof a.order === 'number' && !isNaN(a.order) ? a.order : 999;
      const orderB = typeof b.order === 'number' && !isNaN(b.order) ? b.order : 999;
      if (orderA !== orderB) return orderA - orderB;
      return 0;
    });

  // Core Committee Posters
  const corePosters =
    database.coreCommitteePosters && database.coreCommitteePosters.length > 0
      ? database.coreCommitteePosters
      : initialDatabase.coreCommitteePosters || [];

  const currentPoster =
    corePosters.find((p) => p.tenure === selectedTenure) ||
    corePosters.find((p) => p.tenure.startsWith(selectedTenure.split('-')[0])) ||
    corePosters[0];

  // NIICS In-Charge list
  const niicsList =
    database.niicsInCharge && database.niicsInCharge.length > 0
      ? database.niicsInCharge
      : initialDatabase.niicsInCharge || [];

  // Active or filtered NIICS In-Charge
  const currentNIICS = niicsList.filter(
    (n) => !n.tenure || n.tenure === selectedTenure || niicsList.length === 1
  );

  return (
    <section id="leadership" className="py-16 sm:py-20 text-stone-900 border-b border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* =========================================================================
            SECTION 1: NIICS IN-CHARGE (DISTINCT, DYNAMIC & HIGHLIGHTED)
            ========================================================================= */}
        <div className="relative">
          {/* Section Heading for NIICS In-Charge */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono uppercase font-bold tracking-wider shadow-xs mb-2">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                CENTRAL SUPERVISORY PATRONAGE • OFF-CAMPUS GOVERNANCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-stone-900 flex items-center gap-3">
                <span>NIICS In-Charge</span>
                <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-emerald-800">
                  Directorate
                </span>
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                Designated director and regional supervisor overseeing academic governance, spiritual ethos,
                student welfare, and union initiatives across all recognized NIICS off-campuses.
              </p>
            </div>
          </div>

          {/* Dynamic Highlighted NIICS In-Charge Cards */}
          <div className="space-y-6">
            {currentNIICS.map((inCharge, idx) => {
              const defaultCampuses = [
                'DH NIICS Chemmad',
                'DH NIICS Hangal',
                'DH NIICS Punganur',
                'DH NIICS Maharashtra',
                'DH NIICS Assam',
                'DH NIICS West Bengal',
              ];
              const campuses = inCharge.campuses && inCharge.campuses.length > 0 ? inCharge.campuses : defaultCampuses;

              return (
                <div
                  key={`niics-incharge-card-${inCharge.id}-${idx}`}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50/60 via-white to-emerald-50/40 border-2 border-amber-300 hover:border-amber-400 shadow-md p-6 sm:p-8 transition-all group"
                >
                  {/* Glowing ambient background blur */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

                  <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left: Dynamic Portrait with Luxury Frame */}
                    <div className="lg:col-span-4 flex flex-col items-center">
                      <div className="relative w-full max-w-[280px] lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden ring-4 ring-amber-400/40 group-hover:ring-amber-500/60 shadow-lg transition-all duration-500 bg-stone-100">
                        <img
                          src={inCharge.photo}
                          alt={inCharge.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Shimmer gradient overlay at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-80" />

                        {/* Top Tenure Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-stone-900/80 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            {inCharge.tenure || '2026-27'}
                          </span>
                        </div>

                        {/* Bottom Live Active Indicator */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-semibold shadow">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Active In-Charge • {campuses.length} Campuses
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Dynamic Title, Jurisdiction, Campuses & Quote */}
                    <div className="lg:col-span-8 space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-md bg-amber-100 border border-amber-200 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-amber-600" />
                            {inCharge.designation || 'Central NIICS In-Charge'}
                          </span>
                          <span className="text-xs text-stone-500 font-mono">
                            Tenure: <strong className="text-stone-900">{inCharge.tenure || '2026-27'}</strong>
                          </span>
                        </div>

                        {/* Dynamic Name */}
                        <h3 className="text-2xl sm:text-4xl font-extrabold font-heading text-stone-900 group-hover:text-emerald-800 transition-all tracking-tight">
                          {inCharge.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{inCharge.department}</span>
                        </p>
                      </div>

                      {/* 6 Recognized Off-Campuses Grid / Badges */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                        <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold tracking-wider block">
                          SUPERVISED NIICS OFF-CAMPUSES:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {campuses.map((campus, cIdx) => (
                            <span
                              key={`niics-campus-badge-${cIdx}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-stone-200 text-xs text-stone-700 shadow-2xs hover:border-emerald-500 hover:text-emerald-800 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span>{campus}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Inspiring Vision / Quote */}
                      {inCharge.quote && (
                        <div className="relative p-4 rounded-xl bg-amber-50/70 border-l-4 border-amber-500 text-xs sm:text-sm italic text-stone-700 font-serif leading-relaxed">
                          "{inCharge.quote}"
                        </div>
                      )}

                      {/* Contact & Secretariat Info */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          {inCharge.email && (
                            <a
                              href={`mailto:${inCharge.email}`}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                              title={inCharge.email}
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email In-Charge</span>
                            </a>
                          )}
                          {inCharge.phone && (
                            <a
                              href={`tel:${inCharge.phone}`}
                              className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title={inCharge.phone}
                            >
                              <Phone className="w-3.5 h-3.5 text-amber-600" />
                              <span>{inCharge.phone}</span>
                            </a>
                          )}
                        </div>

                        {inCharge.officeLocation && (
                          <div className="flex items-center gap-1.5 text-stone-500 font-mono text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{inCharge.officeLocation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: CENTRAL LEADERSHIP (EXECUTIVE COUNCIL CABINET)
            ========================================================================= */}
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Executive Council Office-Bearers
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 mt-1">
                Central Leadership
              </h2>
              <p className="text-sm text-stone-600 mt-2 max-w-xl">
                Elected student representatives steering policy, constitutional advocacy, academic freedom, and
                holistic community welfare for ANJUMAN-E-HUDA.
              </p>
            </div>

            {/* Tenure Selection Pills */}
            <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200 self-start md:self-end">
              {tenures.map((tenure, idx) => (
                <button
                  key={`leadership-tenure-${tenure}-${idx}`}
                  onClick={() => setSelectedTenure(tenure)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedTenure === tenure
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {tenure}
                </button>
              ))}
            </div>
          </div>

          {/* Two-Column Showcase:
              Left Column (lg:col-span-5 xl:col-span-4): A4 Size "Core Committee" Poster (Year-wise)
              Right Column (lg:col-span-7 xl:col-span-8): Executive Council Office-Bearers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            {/* COLUMN 1: A4 SIZE "CORE COMMITTEE" POSTER */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  CORE COMMITTEE POSTER
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedTenure} (A4 Full Size)
                </span>
              </div>

              {currentPoster ? (
                <div className="relative group">
                  {/* Authentic A4 Aspect Ratio Frame (1 : 1.414 / standard ISO 216) */}
                  <div
                    onClick={() => {
                      setPosterModalOpen(true);
                      setPosterZoomLevel(1);
                    }}
                    className="relative w-full aspect-[1/1.414] rounded-2xl overflow-hidden bg-stone-100 border-2 border-emerald-600/30 group-hover:border-emerald-500 shadow-md cursor-pointer transition-all duration-300 group-hover:shadow-lg"
                    title="Click to view full A4 Poster in HD Lightbox"
                  >
                    <img
                      src={currentPoster.posterUrl}
                      alt={currentPoster.title || `Core Committee Poster ${selectedTenure}`}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient overlay on hover with clear Inspect hint */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-center">
                      <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs shadow mx-auto mb-2">
                        <Maximize2 className="w-4 h-4" />
                        <span>Click to Inspect Full A4</span>
                      </div>
                      <p className="text-[11px] text-stone-200 line-clamp-2">
                        {currentPoster.title || `Official Core Committee Proclamation (${selectedTenure})`}
                      </p>
                    </div>

                    {/* Top corner A4 badge */}
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md border border-stone-200 text-[10px] font-mono font-bold text-amber-800 shadow-xs">
                        A4 PROCLAMATION
                      </span>
                    </div>
                  </div>

                  {/* Poster details and quick view button */}
                  <div className="mt-3.5 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 leading-snug">
                        {currentPoster.title || `Official Core Committee Poster (${selectedTenure})`}
                      </h4>
                      {currentPoster.description && (
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {currentPoster.description}
                        </p>
                      )}
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        Standard A4 (210×297mm)
                      </span>
                      <button
                        onClick={() => {
                          setPosterModalOpen(true);
                          setPosterZoomLevel(1);
                        }}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Full Size View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Placeholder when no poster is uploaded for this specific year */
                <div className="w-full aspect-[1/1.414] rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center p-6 text-center text-stone-600 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-400">
                    <FileText className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-800">
                      Core Committee Poster ({selectedTenure})
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 max-w-xs">
                      Official A4 Core Committee poster for the {selectedTenure} academic tenure will be published here upon release.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    Archival Record Pending
                  </span>
                </div>
              )}
            </div>

            {/* COLUMN 2: EXECUTIVE COUNCIL OFFICE-BEARERS GRID */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                  ELECTED CABINET MEMBERS ({currentLeaders.length})
                </span>
                <span className="text-xs font-mono text-emerald-700 font-semibold">
                  Tenure: {selectedTenure}
                </span>
              </div>

              {currentLeaders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {currentLeaders.map((leader, idx) => (
                    <div
                      key={`leader-card-${leader.id}-${idx}`}
                      className="bg-white border border-stone-200 hover:border-emerald-500 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col justify-between"
                    >
                      <div>
                        {/* Photo with tenure badge */}
                        <div className="relative mb-4 overflow-hidden rounded-xl bg-stone-100 aspect-[4/3] flex items-center justify-center border border-stone-200">
                          {leader.photo ? (
                            <img
                              src={leader.photo}
                              alt={leader.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                                const parent = (e.currentTarget as HTMLElement).parentElement;
                                if (parent) {
                                  const placeholder = parent.querySelector('.photo-fallback');
                                  if (placeholder) placeholder.classList.remove('hidden');
                                }
                              }}
                            />
                          ) : null}
                          <div className={`photo-fallback flex flex-col items-center justify-center text-stone-400 gap-1.5 w-full h-full ${leader.photo ? 'hidden' : ''}`}>
                            <div className="w-14 h-14 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-emerald-700 font-bold font-mono text-lg shadow-inner">
                              {leader.name ? leader.name.charAt(0).toUpperCase() : <User className="w-6 h-6 text-stone-500" />}
                            </div>
                            <span className="text-[11px] font-mono text-stone-500">{leader.role}</span>
                          </div>
                          <div className="absolute top-2.5 left-2.5">
                            <span className="bg-amber-400 text-stone-950 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded shadow-xs flex items-center gap-1" title={`Hierarchy Position #${leader.order ?? (idx + 1)}`}>
                              <span>#{leader.order ?? (idx + 1)}</span>
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span className="bg-white/90 backdrop-blur-sm text-stone-800 border border-stone-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs">
                              {leader.tenure}
                            </span>
                          </div>
                          <div className="absolute bottom-2.5 left-2.5">
                            <span className="bg-emerald-50/95 backdrop-blur-sm text-emerald-900 border border-emerald-300 text-xs font-mono font-bold px-2.5 py-1 rounded-lg shadow-xs">
                              {leader.role}
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <h3 className="text-base sm:text-lg font-bold font-heading text-stone-900 group-hover:text-emerald-700 transition-colors mb-1 truncate" title={leader.name}>
                          {leader.name}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium mb-2.5 truncate">{leader.department}</p>

                        {leader.quote && (
                          <p className="text-xs italic text-stone-600 font-serif border-l-2 border-amber-500 pl-2.5 py-0.5 mb-3 leading-relaxed line-clamp-2">
                            "{leader.quote}"
                          </p>
                        )}
                      </div>

                      {/* Contact info if available */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span className="text-[11px] font-mono text-emerald-700 font-semibold">Office-Bearer</span>
                        <div className="flex items-center gap-2.5">
                          {leader.email && (
                            <a
                              href={`mailto:${leader.email}`}
                              className="text-stone-500 hover:text-emerald-700 transition-colors p-1"
                              title={leader.email}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {leader.phone && (
                            <a
                              href={`tel:${leader.phone}`}
                              className="text-stone-500 hover:text-emerald-700 transition-colors p-1"
                              title={leader.phone}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 text-center text-stone-600">
                  <p className="text-sm font-semibold">No individual leader profiles registered for {selectedTenure}.</p>
                  <p className="text-xs text-stone-500 mt-1">Please refer to the Core Committee A4 Poster or check previous archives.</p>
                </div>
              )}
            </div>
          </div>

          {/* "Access Full Committee Archive" button at bottom */}
          <div className="text-center pt-4">
            <button
              id="access-committee-archive-btn"
              onClick={() => setArchiveModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer hover:border-emerald-500"
            >
              <Archive className="w-4 h-4 text-amber-600" />
              <span>Access Full Committee Archive</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Archive Modal */}
      <CommitteeArchiveModal
        isOpen={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
      />

      {/* Fullscreen A4 Lightbox Modal */}
      {posterModalOpen && currentPoster && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => {
            setPosterModalOpen(false);
            setPosterZoomLevel(1);
          }}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between gap-4 max-w-5xl mx-auto w-full pb-3 border-b border-stone-800 text-white shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-400 shrink-0">
                A4 POSTER • {currentPoster.tenure}
              </span>
              <h3 className="text-sm sm:text-base font-bold truncate">
                {currentPoster.title || `Official Core Committee (${currentPoster.tenure})`}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Zoom Controls */}
              <button
                onClick={() => setPosterZoomLevel((prev) => Math.max(0.7, prev - 0.2))}
                className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-stone-400 px-1 min-w-[42px] text-center">
                {Math.round(posterZoomLevel * 100)}%
              </span>
              <button
                onClick={() => setPosterZoomLevel((prev) => Math.min(2.5, prev + 0.2))}
                className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPosterZoomLevel((prev) => (prev === 1 ? 1.5 : 1))}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-colors ${
                  posterZoomLevel !== 1
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
                }`}
                title="Toggle Full Size (1:1)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">
                  {posterZoomLevel !== 1 ? 'Fit Screen' : 'Full Size'}
                </span>
              </button>
              <a
                href={currentPoster.posterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white transition-colors"
                title="Open original high-res image"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  setPosterModalOpen(false);
                  setPosterZoomLevel(1);
                }}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white transition-colors ml-1"
                title="Close viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center A4 Image Canvas with Scroll & Zoom */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4 my-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="transition-transform duration-200 ease-out origin-center max-w-full"
              style={{ transform: `scale(${posterZoomLevel})` }}
            >
              <div
                className="relative shadow-2xl shadow-black rounded-xl overflow-hidden bg-stone-950 border border-stone-800 max-h-[85vh] max-w-[95vw] flex items-center justify-center cursor-pointer"
                onDoubleClick={() => setPosterZoomLevel((prev) => (prev === 1 ? 1.5 : 1))}
                title="Double-click to toggle Full Size (1:1)"
              >
                <img
                  src={currentPoster.posterUrl}
                  alt={currentPoster.title || 'Core Committee Poster'}
                  className="w-auto h-auto max-h-[85vh] max-w-[95vw] object-contain"
                />
              </div>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div
            className="text-center text-xs text-stone-400 pt-2 shrink-0 border-t border-stone-800/80 max-w-5xl mx-auto w-full flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-mono text-[11px] text-stone-500">
              Standard A4 Format (210mm × 297mm) • High Definition Inspection
            </span>
            {currentPoster.description && (
              <span className="text-[11px] text-stone-400 truncate max-w-md hidden sm:inline">
                {currentPoster.description}
              </span>
            )}
            <button
              onClick={() => {
                setPosterModalOpen(false);
                setPosterZoomLevel(1);
              }}
              className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg border border-stone-700 text-xs font-semibold"
            >
              Close (Esc)
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
