import React from 'react';
import { useData } from '../context/DataContext';
import { useNavigation } from '../context/NavigationContext';
import {
  Scale,
  FileText,
  CheckCircle,
  Shield,
  Sparkles,
  ArrowRight,
  Home,
  Users,
  BookOpen,
  Award,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const CAUPage: React.FC = () => {
  const { database } = useData();
  const { cau } = database;
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
            <span className="text-emerald-400 font-semibold">CAU Senate</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold tracking-wider uppercase font-mono shadow-sm mb-2">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                CENTRAL ACADEMIC UNION • PARLIAMENTARY SENATE
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
                Central Academic Union (CAU)
              </h1>
              <p className="text-stone-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                The apex collegiate legislative assembly responsible for constitutional bylaws, student fellowship
                allocations, academic resolutions, and democratic university quorum.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs font-mono text-stone-300">
                Active Session: <strong className="text-emerald-400">{cau.sessionTerm}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Core Constitutional Overview Box */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
            {/* Left Column: CAU Constitutional Charter */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-mono font-bold uppercase">
                  PARLIAMENTARY SOVEREIGNTY
                </span>
                <span className="text-xs text-stone-400 font-mono">• Established by Union Act 1994</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Legislative Mandate & Senate Governance
              </h2>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
                {cau.constitutionSummary}
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <p className="text-3xl font-bold text-white font-heading font-mono">
                    {cau.councilMembersCount}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">Elected Council Senators</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
                  <p className="text-3xl font-bold text-emerald-400 font-heading font-mono">100%</p>
                  <p className="text-xs text-stone-400 mt-1">Democratic Quorum</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 col-span-2 sm:col-span-1">
                  <p className="text-3xl font-bold text-amber-400 font-heading font-mono">
                    {cau.latestResolutions.length}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">Active Resolutions</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-800">
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Equal legislative representation across all collegiate departments.</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Autonomous administration of Student Hardship & Research Fellowships.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Council Resolutions & Gazettes */}
            <div className="lg:col-span-6 bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                    SENATE GAZETTES
                  </span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    Latest Adopted Resolutions & Decrees
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-stone-400 px-2.5 py-1 rounded bg-stone-900 border border-stone-800">
                  OFFICIAL RECORD
                </span>
              </div>

              <div className="space-y-4">
                {cau.latestResolutions.map((res, idx) => (
                  <div
                    key={`cau-res-${res.id}-${idx}`}
                    className="p-4 rounded-xl bg-stone-900 border border-stone-800/90 hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-1.5">
                      <span className="text-emerald-400 font-bold">{res.fileNumber}</span>
                      <span>{res.date}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white leading-snug mb-2">
                      {res.title}
                    </h4>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-950 text-xs">
                      <span className="px-2 py-0.5 rounded bg-stone-950 text-stone-400 text-[10px] font-mono border border-stone-800">
                        Status: <strong className="text-stone-200">{res.status}</strong>
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Certified Decree
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Gateway to Contact */}
        <div className="p-8 rounded-3xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold font-heading text-white mb-1">
              Have a Parliamentary Query or Resolution to Submit?
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Departmental representatives and students can file petitions directly with the CAU Secretariat.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('contact')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
          >
            <span>Submit to Secretariat</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
