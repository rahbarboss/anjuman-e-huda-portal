import React from 'react';
import { LeadershipSection } from '../components/LeadershipSection';
import { useNavigation } from '../context/NavigationContext';
import {
  Users,
  Sparkles,
  ArrowRight,
  Shield,
  Award,
  BookOpen,
  Mail,
  Home,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const LeadershipPage: React.FC = () => {
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
            <span className="text-emerald-400 font-semibold">Leadership Council</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold tracking-wider uppercase font-mono shadow-sm mb-2">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                EXECUTIVE CABINET & OFFICE BEARERS
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
                Union Leadership Council
              </h1>
              <p className="text-stone-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Meet the visionary student leaders and committee executives entrusted with safeguarding student welfare,
                academic progress, and ethical stewardship.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('wings')}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>View Student Wings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Leadership Section with Tenures, Leaders Grid, & Archive Modal */}
      <LeadershipSection />

      {/* Leadership Code of Conduct & Next Gateway */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="p-8 rounded-3xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl font-bold font-heading text-white">Leadership Code of Conduct & Trust</h3>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Every office bearer of ANJUMAN-E-HUDA pledges to maintain strict impartiality, transparent financial
              integrity, humble servant leadership, and 100% student accountability throughout their active tenure.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('contact')}
            className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
          >
            <span>Contact Secretariat</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
