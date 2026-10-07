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
      title: 'Inception of the Student Advisory Assembly',
      desc: 'Establishment of the representative council safeguarding research fellowships, student hardship grants, and democratic representations.',
    },
    {
      year: '2026',
      title: 'Digital Secretariat & Modern Academic Era',
      desc: 'Launching the unified cloud student portal, paperless gazettes, real-time grievance tracking, and state-wide inter-collegiate alliances.',
    },
  ];

  return (
    <div className="min-h-screen bg-dot-pattern text-stone-900 pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white/70 backdrop-blur-md border-b border-stone-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono mb-3">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-emerald-700 font-semibold">About Us</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase font-mono shadow-xs mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                DEDICATED SECTOR PORTAL • ESTD. 1994
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-stone-900 tracking-tight">
                About ANJUMAN-E-HUDA
              </h1>
              <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Explore the foundational charter, core vision, mandated mission, and 4 sacred pillars that govern
                our collegiate student union.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('leadership')}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow flex items-center gap-2 cursor-pointer transition-colors"
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
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-700">
            HERITAGE & LINEAGE
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-stone-900 mt-1">
            Over Three Decades of Student Progress
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-2">
            Key milestones marking ANJUMAN-E-HUDA's journey as an unwavering champion of student rights and scholastic
            eminence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {historicalMilestones.map((m, idx) => (
            <div
              key={`milestone-${m.year}-${idx}`}
              className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-bold font-heading text-amber-600 mb-2 block font-mono">
                  {m.year}
                </span>
                <h3 className="text-base font-bold text-stone-900 mb-2 group-hover:text-amber-800 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-normal">
                  {m.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Constitutional Milestone</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Next Portal Gateway Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
              <Compass className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Proceed to Executive Leadership</h4>
              <p className="text-xs text-stone-600">
                Discover the office bearers steering the union's mission for Session 2026–27.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('leadership')}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <span>Explore Leadership</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
