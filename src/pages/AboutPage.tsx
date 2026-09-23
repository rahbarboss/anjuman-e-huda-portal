import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { useNavigation } from '../context/NavigationContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Calendar,
  Award,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  Home,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  const historicalMilestones = [
    {
      year: '1994',
      title: 'Foundational Charter & Establishment',
      desc: 'Formally chartered by campus luminaries with the primordial objective of unifying student advocacy, academic excellence, and moral stewardship.',
    },
    {
      year: '2004',
      title: 'Establishment of the 9 Specialized Wings',
      desc: 'Constitutional amendment decentralizing campus affairs into specialized councils: Academic, Tarbiyah, Rahma Public Welfare, Media, and Athletics.',
    },
    {
      year: '2015',
      title: 'Inception of the Central Academic Union (CAU)',
      desc: 'Establishment of the parliamentary senate body safeguarding research fellowships, student hardship grants, and democratic representations.',
    },
    {
      year: '2026',
      title: 'Digital Secretariat & Modern Academic Era',
      desc: 'Launching the unified cloud student portal, paperless gazettes, real-time grievance tracking, and state-wide inter-collegiate alliances.',
    },
  ];

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
            <span className="text-emerald-400 font-semibold">About Us</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold tracking-wider uppercase font-mono shadow-sm mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                DEDICATED SECTOR PORTAL • ESTD. 1994
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
                About ANJUMAN-E-HUDA
              </h1>
              <p className="text-stone-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Explore the foundational charter, core vision, mandated mission, and 4 sacred pillars that govern
                our collegiate student union.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('leadership')}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>View Leadership</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main About Component with Vision, Mission, & 4 Pillars */}
      <AboutSection />

      {/* Historical Milestones Chronicle */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
            HERITAGE & LINEAGE
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white mt-1">
            Over Three Decades of Student Progress
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-2">
            Key milestones marking ANJUMAN-E-HUDA's journey as an unwavering champion of student rights and scholastic
            eminence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {historicalMilestones.map((m, idx) => (
            <div
              key={`milestone-${m.year}-${idx}`}
              className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-bold font-heading text-amber-400 mb-2 block font-mono">
                  {m.year}
                </span>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed font-normal">
                  {m.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Constitutional Milestone</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Next Portal Gateway Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-600/40 text-emerald-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Proceed to Executive Leadership</h4>
              <p className="text-xs text-stone-400">
                Discover the office bearers steering the union's mission for Session 2026–27.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('leadership')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>Explore Leadership</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
