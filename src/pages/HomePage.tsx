import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { LatestProgramsAndAnnouncements } from '../components/LatestProgramsAndAnnouncements';
import { LeadershipSection } from '../components/LeadershipSection';
import { LeadershipCodeOfConductCard } from '../components/LeadershipCodeOfConductCard';
import { AboutSection } from '../components/AboutSection';
import { useNavigation } from '../context/NavigationContext';
import { Users, ArrowRight } from 'lucide-react';

interface Props {
  onOpenNotifications: () => void;
}

export const HomePage: React.FC<Props> = ({ onOpenNotifications }) => {
  const { navigateTo } = useNavigation();

  return (
    <div className="space-y-0">
      {/* 1. Hero Landing Section */}
      <HeroSection />

      {/* 2. Latest Programs & Active Colloquiums Highlight */}
      <LatestProgramsAndAnnouncements onOpenNotifications={onOpenNotifications} />

      {/* 3. Leadership Council Section - Identical to LEADERSHIPS Page */}
      <div className="text-stone-900 pb-20 border-b border-stone-200">
        {/* Leadership Header Banner */}
        <div className="bg-white/70 backdrop-blur-md border-b border-stone-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase font-mono shadow-xs mb-2">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  EXECUTIVE CABINET & OFFICE BEARERS
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold font-heading text-stone-900 tracking-tight">
                  Union Leadership Council
                </h2>
                <p className="text-stone-600 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                  Meet the visionary student leaders and committee executives entrusted with safeguarding student welfare,
                  academic progress, and ethical stewardship.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo('wings')}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow flex items-center gap-2 cursor-pointer transition-colors"
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

        {/* Dynamic & Professional Leadership Code of Conduct & Trust */}
        <LeadershipCodeOfConductCard />
      </div>

      {/* 4. The Soul of ANJUMAN-E-HUDA, Vision & 4 Pillars */}
      <AboutSection />
    </div>
  );
};
