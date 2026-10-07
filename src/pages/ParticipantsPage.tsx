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
            <span className="text-emerald-700 font-semibold">Specialized Wings</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase font-mono shadow-xs mb-2">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                EXECUTIVE STUDENT WINGS & COUNCILS
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-stone-900 tracking-tight">
                Our Wings & Core Committee Programs
              </h1>
              <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Explore the specialized student wings, council portfolios, designated Chairmen, and Conveners driving campus vibrancy across every discipline.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('rankings')}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
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
        <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="text-lg font-bold font-heading text-stone-900 mb-1">
              Interested in Leading a Departmental Guild?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Student enrollment and wing executive nominations are held bi-annually under the supervision of the
              Central Secretariat.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('contact')}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shrink-0 transition-colors shadow-xs"
          >
            <span>Enroll / Reach Secretariat</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
