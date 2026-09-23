import React from 'react';
import { OurWingsSection } from '../components/OurWingsSection';
import { useNavigation } from '../context/NavigationContext';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Users,
  Award,
  ChevronRight,
  Home,
  CheckCircle2,
} from 'lucide-react';

export const ParticipantsPage: React.FC = () => {
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
            <span className="text-emerald-400 font-semibold">Specialized Wings</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold tracking-wider uppercase font-mono shadow-sm mb-2">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                EXECUTIVE STUDENT WINGS & COUNCILS
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
                Our Wings & Portfolios
              </h1>
              <p className="text-stone-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Explore the specialized student wings, council portfolios, designated Chairmen, and Conveners driving campus vibrancy across every discipline.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('rankings')}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>View Wing Rankings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main OurWingsSection with Status Filter, Manager/Convener/Assistant, & History Dropdown */}
      <OurWingsSection />

      {/* Next Gateway to Programs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="p-8 rounded-3xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold font-heading text-white mb-1">
              Interested in Leading a Departmental Guild?
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Student enrollment and wing executive nominations are held bi-annually under the supervision of the
              Central Secretariat.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('contact')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
          >
            <span>Enroll / Reach Secretariat</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
