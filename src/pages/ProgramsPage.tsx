import React from 'react';
import { AllProgramsSection } from '../components/AllProgramsSection';
import { useNavigation } from '../context/NavigationContext';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Home,
  Layers,
  Award,
  ChevronRight,
} from 'lucide-react';

export const ProgramsPage: React.FC = () => {
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
            <span className="text-emerald-700 font-semibold">Programs & Events</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase font-mono shadow-xs mb-2">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                OFFICIAL UNION CALENDAR & PHOTO ARCHIVES
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-stone-900 tracking-tight">
                Programs & Portfolios
              </h1>
              <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Explore the complete catalog of symposiums, literary conventions, declamation contests, and
                student initiatives spearheaded across our campus.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('rankings')}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>View Rankings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main AllProgramsSection with Sticky Sidebar, Calendar, Highlights Lightbox, & Achievements */}
      <AllProgramsSection />
    </div>
  );
};
