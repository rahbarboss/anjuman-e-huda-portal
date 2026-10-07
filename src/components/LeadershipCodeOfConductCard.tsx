import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const LeadershipCodeOfConductCard: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-white to-stone-50 border border-emerald-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-900 hover:border-emerald-400 transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-base font-bold text-stone-900">Leadership Code of Conduct & Trust</h4>
            <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
              Every office bearer of ANJUMAN-E-HUDA pledges to maintain strict impartiality, transparent financial
              integrity, humble servant leadership, and 100% student accountability throughout their active tenure.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('contact')}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Contact Secretariat</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
