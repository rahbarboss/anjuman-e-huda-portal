import React from 'react';
import { useData } from '../context/DataContext';
import { useNavigation } from '../context/NavigationContext';
import {
  Trophy,
  Award,
  Medal,
  Star,
  Users,
  Sparkles,
  ArrowRight,
  Home,
  Crown,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const RankingsPage: React.FC = () => {
  const { database } = useData();
  const { rankings, achievements } = database;
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-stone-900 border-b border-stone-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-stone-400 font-mono mb-3">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">Rankings & Honors</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-xs font-semibold tracking-wider uppercase font-mono shadow-sm mb-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                ANNUAL MERIT & CHAMPIONSHIP TABLE • 2026–27
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
                Union Rankings & Leaderboards
              </h1>
              <p className="text-stone-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Official merit rankings based on inter-departmental competitions, research symposiums, civic outreach,
                and academic convocations across university faculties.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('cau')}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Explore CAU Senate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Championship Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Current Leader</span>
              <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 mt-0.5" title={rankings.topWings[0]?.wingName}>
                {rankings.topWings[0]?.wingName || 'Academic Council'}
              </h4>
              <span className="text-xs text-amber-400 font-semibold font-mono block mt-1">
                {rankings.topWings[0]?.points || 0} pts
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Medal className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Top Laureate</span>
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 mt-0.5">
                {rankings.topParticipants[0]?.name || 'Student Laureate'}
              </h4>
              <span className="text-xs text-emerald-400 font-semibold font-mono block mt-1">
                {rankings.topParticipants[0]?.eventsWon || 0} Victories
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Events Scored</span>
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 mt-0.5">
                {achievements?.eventsOrganized || 48} Colloquiums
              </h4>
              <span className="text-xs text-sky-400 font-semibold font-mono block mt-1">Verified Records</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">Active Cadres</span>
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 mt-0.5">
                {achievements?.activeMembers || 1250}+ Scholars
              </h4>
              <span className="text-xs text-purple-400 font-semibold font-mono block mt-1">Across All Faculties</span>
            </div>
          </div>
        </div>

        {/* Main Leaderboard Grid: Wings Championship (7 Cols) + Scholastic Laureates (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Top Wings Championship Table */}
          <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                  INTER-WING LEAGUE
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center gap-2 mt-0.5">
                  <Award className="w-5 h-5 text-emerald-400" />
                  Inter-Wing Championship Table
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-mono px-3 py-1 rounded-lg bg-stone-950 border border-stone-800">
                Session 2026–27
              </span>
            </div>

            <div className="space-y-3">
              {rankings.topWings.map((wing, idx) => {
                const isFirst = wing.rank === 1;
                const isSecond = wing.rank === 2;
                const isThird = wing.rank === 3;

                return (
                  <div
                    key={`rank-wing-${wing.wingName}-${idx}`}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isFirst
                        ? 'bg-gradient-to-r from-amber-950/40 via-stone-900 to-stone-900 border-amber-500/50 shadow-lg shadow-amber-950/30'
                        : isSecond
                        ? 'bg-stone-900/90 border-stone-700 hover:border-stone-500'
                        : isThird
                        ? 'bg-stone-900/90 border-stone-800 hover:border-amber-700/50'
                        : 'bg-stone-950/80 border-stone-850 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm font-mono shrink-0 shadow ${
                          isFirst
                            ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300/50'
                            : isSecond
                            ? 'bg-stone-300 text-stone-950'
                            : isThird
                            ? 'bg-amber-700 text-white'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {isFirst ? <Crown className="w-4 h-4" /> : wing.rank}
                      </div>

                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                          <span>{wing.wingName}</span>
                          {isFirst && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold">
                              CHAMPION
                            </span>
                          )}
                        </h4>
                        <span className="text-xs text-stone-400 font-mono">{wing.badge}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg sm:text-xl font-bold text-emerald-400 font-heading">
                        {wing.points}
                      </span>
                      <span className="text-[10px] text-stone-500 block font-mono">championship pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scholastic Laureates */}
          <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                  HONOR ROLL
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center gap-2 mt-0.5">
                  <Star className="w-5 h-5 text-amber-400" />
                  Scholastic Laureates
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-mono px-3 py-1 rounded-lg bg-stone-950 border border-stone-800">
                Top Performers
              </span>
            </div>

            <div className="space-y-3">
              {rankings.topParticipants.map((p, idx) => (
                <div
                  key={`rank-laureate-${p.name}-${idx}`}
                  className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/80 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-stone-800 border border-stone-700 overflow-hidden shrink-0 flex items-center justify-center">
                      {p.photo ? (
                        <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 text-stone-400" />
                      )}
                      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[9px] font-bold font-mono flex items-center justify-center">
                        {p.rank}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{p.name}</h4>
                      <p className="text-[10px] text-stone-400 truncate max-w-[150px] sm:max-w-[200px]">
                        {p.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-amber-300 font-mono block">
                      {p.points} pts
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {p.eventsWon} victories
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scoring Methodology Note */}
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Constitutional Scoring Formula</h4>
              <p className="text-xs text-stone-400">
                Merit tallies are audited bi-monthly by the Central Academic Union (CAU) Audit Committee.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('cau')}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
          >
            <span>View CAU Audits</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
