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
} from 'lucide-react';
import { CommitteeArchiveModal } from './CommitteeArchiveModal';

export const LeadershipSection: React.FC = () => {
  const { database } = useData();
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [selectedTenure, setSelectedTenure] = useState<string>('2026-27');

  // Get distinct tenures from leaders and niicsInCharge
  const allTenures = [
    ...database.leaders.map((l) => l.tenure),
    ...((database.niicsInCharge || []).map((n) => n.tenure)),
  ].filter(Boolean);

  const tenures = Array.from(new Set(allTenures)).sort().reverse();
  if (!tenures.includes('2026-27')) tenures.unshift('2026-27');

  // Leaders for current selected tenure
  const currentLeaders = database.leaders.filter((l) => l.tenure === selectedTenure);

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
    <section id="leadership" className="py-16 sm:py-20 bg-stone-950 text-stone-100 border-b border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* =========================================================================
            SECTION 1: NIICS IN-CHARGE (DISTINCT, DYNAMIC & HIGHLIGHTED)
            ========================================================================= */}
        <div className="relative">
          {/* Section Heading for NIICS In-Charge */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono uppercase font-bold tracking-wider shadow-sm mb-2">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                CENTRAL SUPERVISORY PATRONAGE • OFF-CAMPUS GOVERNANCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white flex items-center gap-3">
                <span>NIICS In-Charge</span>
                <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-md bg-stone-900 border border-stone-700 text-emerald-400">
                  Directorate
                </span>
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
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
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900/90 to-emerald-950/40 border-2 border-amber-500/50 hover:border-amber-400 shadow-2xl shadow-emerald-950/40 p-6 sm:p-8 transition-all group"
                >
                  {/* Glowing ambient background blur */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

                  <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left: Dynamic Portrait with Luxury Frame */}
                    <div className="lg:col-span-4 flex flex-col items-center">
                      <div className="relative w-full max-w-[280px] lg:max-w-none aspect-[4/5] rounded-2xl overflow-hidden ring-4 ring-amber-500/30 group-hover:ring-amber-400/60 shadow-2xl transition-all duration-500">
                        <img
                          src={inCharge.photo}
                          alt={inCharge.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Shimmer gradient overlay at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

                        {/* Top Tenure Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-stone-950/90 backdrop-blur-md text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
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
                          <span className="px-3 py-1 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            {inCharge.designation || 'Central NIICS In-Charge'}
                          </span>
                          <span className="text-xs text-stone-400 font-mono">
                            Tenure: <strong className="text-white">{inCharge.tenure || '2026-27'}</strong>
                          </span>
                        </div>

                        {/* Dynamic Gradient Name */}
                        <h3 className="text-2xl sm:text-4xl font-extrabold font-heading bg-gradient-to-r from-white via-amber-100 to-emerald-300 bg-clip-text text-transparent group-hover:from-amber-200 group-hover:to-emerald-400 transition-all tracking-tight">
                          {inCharge.name}
                        </h3>

                        <p className="text-xs sm:text-sm text-stone-300 mt-1 font-medium flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{inCharge.department}</span>
                        </p>
                      </div>

                      {/* 6 Recognized Off-Campuses Grid / Badges */}
                      <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider block">
                          SUPERVISED NIICS OFF-CAMPUSES:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {campuses.map((campus, cIdx) => (
                            <span
                              key={`niics-campus-badge-${cIdx}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 border border-stone-700/80 text-xs text-stone-200 hover:border-emerald-500/60 hover:text-emerald-300 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span>{campus}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Inspiring Vision / Quote */}
                      {inCharge.quote && (
                        <div className="relative p-4 rounded-xl bg-gradient-to-r from-amber-950/20 via-stone-900/40 to-stone-900 border-l-4 border-amber-400 text-xs sm:text-sm italic text-stone-200 font-serif leading-relaxed">
                          "{inCharge.quote}"
                        </div>
                      )}

                      {/* Contact & Secretariat Info */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          {inCharge.email && (
                            <a
                              href={`mailto:${inCharge.email}`}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title={inCharge.email}
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email In-Charge</span>
                            </a>
                          )}
                          {inCharge.phone && (
                            <a
                              href={`tel:${inCharge.phone}`}
                              className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title={inCharge.phone}
                            >
                              <Phone className="w-3.5 h-3.5 text-amber-400" />
                              <span>{inCharge.phone}</span>
                            </a>
                          )}
                        </div>

                        {inCharge.officeLocation && (
                          <div className="flex items-center gap-1.5 text-stone-400 font-mono text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
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
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Executive Council Office-Bearers
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-1">
                Central Leadership
              </h2>
              <p className="text-sm text-stone-400 mt-2 max-w-xl">
                Elected student representatives steering policy, constitutional advocacy, academic freedom, and
                holistic community welfare for ANJUMAN-E-HUDA.
              </p>
            </div>

            {/* Tenure Selection Pills */}
            <div className="flex items-center gap-2 bg-stone-900/90 p-1.5 rounded-xl border border-stone-800 self-start md:self-end">
              {tenures.map((tenure, idx) => (
                <button
                  key={`leadership-tenure-${tenure}-${idx}`}
                  onClick={() => setSelectedTenure(tenure)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedTenure === tenure
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  {tenure}
                </button>
              ))}
            </div>
          </div>

          {/* Year-wise Leaders Grid (President, General Secretary, Treasurer, etc.) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {currentLeaders.map((leader, idx) => (
              <div
                key={`leader-card-${leader.id}-${idx}`}
                className="bg-stone-900 border border-stone-800 hover:border-emerald-500/50 rounded-2xl p-6 shadow-xl transition-all hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  {/* Photo with tenure badge */}
                  <div className="relative mb-5 overflow-hidden rounded-xl bg-stone-950 aspect-[4/3]">
                    <img
                      src={leader.photo}
                      alt={leader.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-stone-950/85 backdrop-blur-sm text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow">
                        {leader.tenure}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-emerald-950/90 backdrop-blur-sm text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold px-3 py-1 rounded-lg shadow">
                        {leader.role}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <h3 className="text-xl font-bold font-heading text-white group-hover:text-emerald-300 transition-colors mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-stone-400 font-medium mb-3">{leader.department}</p>

                  {leader.quote && (
                    <p className="text-xs italic text-stone-300 font-serif border-l-2 border-amber-500/60 pl-3 py-1 mb-4 leading-relaxed">
                      "{leader.quote}"
                    </p>
                  )}
                </div>

                {/* Contact info if available */}
                <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                  <span className="text-[11px] font-mono text-emerald-400">Office-Bearer</span>
                  <div className="flex items-center gap-3">
                    {leader.email && (
                      <a
                        href={`mailto:${leader.email}`}
                        className="text-stone-400 hover:text-emerald-400 transition-colors p-1"
                        title={leader.email}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                    {leader.phone && (
                      <a
                        href={`tel:${leader.phone}`}
                        className="text-stone-400 hover:text-emerald-400 transition-colors p-1"
                        title={leader.phone}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* "Access Full Committee Archive" button at bottom */}
          <div className="text-center pt-4">
            <button
              id="access-committee-archive-btn"
              onClick={() => setArchiveModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer hover:border-emerald-500/50"
            >
              <Archive className="w-4 h-4 text-amber-400" />
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
    </section>
  );
};
