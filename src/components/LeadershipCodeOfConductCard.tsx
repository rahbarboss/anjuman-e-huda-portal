import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const LeadershipCodeOfConductCard: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border border-stone-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-100 hover:border-emerald-500/40 transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Leadership Code of Conduct & Trust</h4>
            <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
              Every office bearer of ANJUMAN-E-HUDA pledges to maintain strict impartiality, transparent financial
              integrity, humble servant leadership, and 100% student accountability throughout their active tenure.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('contact')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Contact Secretariat</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
