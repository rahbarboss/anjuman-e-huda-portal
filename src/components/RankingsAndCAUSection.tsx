import React from 'react';
import { useData } from '../context/DataContext';
import { Trophy, Award, Users, Star } from 'lucide-react';

export const RankingsAndCAUSection: React.FC = () => {
  const { database } = useData();
  const { rankings } = database;

  return (
    <section id="rankings" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* ================= SECTION 1: RANKINGS & LEADERBOARDS ================= */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 font-mono flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Merit Standing 2026-27
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-1">
                Union Rankings & Standings
              </h2>
            </div>
            <p className="text-xs text-stone-400 max-w-md font-mono">
              Points calculated based on inter-collegiate competitions, research outputs, and community outreach.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top Wings Leaderboard (7 Cols) */}
            <div className="lg:col-span-7 bg-stone-950 border border-stone-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Inter-Wing Championship Table
                </h3>
                <span className="text-xs text-stone-400 font-mono">Current Season</span>
              </div>

              <div className="space-y-3">
                {rankings.topWings.map((wing, idx) => (
                  <div
                    key={`top-wing-${wing.wingName}-${wing.rank}-${idx}`}
                    className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3 hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                          wing.rank === 1
                            ? 'bg-amber-400 text-stone-950 shadow-md'
                            : wing.rank === 2
                            ? 'bg-stone-300 text-stone-950'
                            : wing.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {wing.rank}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{wing.wingName}</h4>
                        <span className="text-[10px] text-stone-400 font-mono">{wing.badge}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-emerald-400 font-heading">
                        {wing.points}
                      </span>
                      <span className="text-[10px] text-stone-500 block font-mono">pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Student Participants (5 Cols) */}
            <div id="participants" className="lg:col-span-5 bg-stone-950 border border-stone-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Scholastic Laureates
                </h3>
                <span className="text-xs text-stone-400 font-mono">Top Performers</span>
              </div>

              <div className="space-y-3">
                {rankings.topParticipants.map((p, idx) => (
                  <div
                    key={`top-participant-${p.name}-${p.rank}-${idx}`}
                    className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 overflow-hidden shrink-0 flex items-center justify-center">
                        {p.photo ? (
                          <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-4 h-4 text-stone-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{p.name}</h4>
                        <p className="text-[10px] text-stone-400 truncate max-w-[150px]">{p.department}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-300 font-mono">{p.points} pts</span>
                      <span className="text-[10px] text-stone-500 block">{p.eventsWon} victories</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
