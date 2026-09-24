import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useNavigation } from '../context/NavigationContext';
import { ArrowRight, Compass, Calendar, Sparkles } from 'lucide-react';
import { DynamicHeroStats } from './DynamicHeroStats';

export const HeroSection: React.FC = () => {
  const { database } = useData();
  const { homepage } = database;
  const { navigateTo } = useNavigation();

  const handleNavigate = (pageOrSelector: string) => {
    const clean = pageOrSelector.replace('#', '') as any;
    navigateTo(clean);
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden bg-stone-950 text-white">
      {/* High-quality dark background image with deep gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={homepage.heroBgUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80'}
          alt="ANJUMAN-E-HUDA Campus Banner"
          className="w-full h-full object-cover object-center filter brightness-[0.22] contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-transparent to-stone-950/90" />
      </div>

      {/* Decorative ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl space-y-6">
          {/* Top Badge & Arabic Motto */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold tracking-wider uppercase font-mono shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {homepage.heroBadge || "NIICS STUDENTS' UNION"}
            </span>

            <span className="text-stone-400 text-xs font-serif italic border-l border-stone-800 pl-3 hidden sm:inline-block">
              وَقُل رَّبِّ زِدْنِي عِلْمًا • "O Lord, Increase Me in Knowledge"
            </span>
          </motion.div>

          {/* Bold Title: "ANJUMAN-E-HUDA" */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-heading leading-tight"
          >
            ANJUMAN-E-HUDA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-stone-300 font-normal leading-relaxed max-w-2xl"
          >
            {homepage.heroSubtitle ||
              "Dedicated to intellectual rigor, moral stewardship, student empowerment, and visionary community leadership at the heart of our campus."}
          </motion.p>

          {/* Two CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2 flex flex-wrap items-center gap-4"
          >
            {/* CTA 1: Discover Mission */}
            <button
              id="hero-cta-mission"
              type="button"
              onClick={() => navigateTo('about')}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center gap-2 cursor-pointer hover:shadow-emerald-600/30"
            >
              <Compass className="w-4 h-4" />
              <span>{homepage.ctaMissionLabel || "Discover Mission"}</span>
            </button>

            {/* CTA 2: Recent Programs */}
            <button
              id="hero-cta-programs"
              type="button"
              onClick={() => navigateTo('programs')}
              className="px-6 py-3.5 bg-stone-900/90 hover:bg-stone-800 text-stone-100 hover:text-white font-semibold text-sm rounded-xl border border-stone-700/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{homepage.ctaProgramsLabel || "Recent Programs"}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Executive Telemetry & Stats Cards */}
      <DynamicHeroStats onNavigate={handleNavigate} />
    </section>
  );
};
