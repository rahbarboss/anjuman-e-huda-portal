import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import {
  Users,
  Trophy,
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  ArrowUpRight,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';

interface DynamicHeroStatsProps {
  onNavigate?: (selector: string) => void;
}

// Smooth requestAnimationFrame Counter Hook
const AnimatedCounter: React.FC<{ target: number; duration?: number; suffix?: string }> = ({
  target,
  duration = 1600,
  suffix = '',
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Premium easeOutQuart easing
      const ease = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(ease * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return (
    <span>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
};

export const DynamicHeroStats: React.FC<DynamicHeroStatsProps> = ({ onNavigate }) => {
  const { database } = useData();
  const { achievements, programs, wings, leaders } = database;

  // Real-time calculated values with fallbacks to achievements
  const totalScholars = achievements?.activeMembers || 4250;
  const totalAchievements = achievements?.totalAchievements || 142;
  const totalPrograms = programs?.length ? Math.max(programs.length * 15, achievements?.eventsOrganized || 310) : (achievements?.eventsOrganized || 310);
  const establishedYear = 1994;
  const yearsLegacy = new Date().getFullYear() - establishedYear;

  const handleCardClick = (selector: string) => {
    if (onNavigate) {
      onNavigate(selector);
    } else {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const statItems = [
    {
      id: 'stat-scholars',
      number: totalScholars,
      suffix: '+',
      label: 'Active Scholars & Members',
      badge: 'Campus Wide',
      trend: '+14% Growth',
      trendIcon: TrendingUp,
      icon: Users,
      color: 'emerald',
      targetSection: '#leadership',
      accentGlow: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      badgeBg: 'bg-emerald-950/70 border-emerald-500/30 text-emerald-400',
      iconBox: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 shadow-emerald-950/80',
      borderHover: 'hover:border-emerald-500/50',
    },
    {
      id: 'stat-achievements',
      number: totalAchievements,
      suffix: '+',
      label: 'Recognized Achievements',
      badge: 'State & National',
      trend: '38 Laurels 2026',
      trendIcon: Award,
      icon: Trophy,
      color: 'amber',
      targetSection: '#rankings',
      accentGlow: 'from-amber-500/20 via-amber-500/5 to-transparent',
      badgeBg: 'bg-amber-950/70 border-amber-500/30 text-amber-400',
      iconBox: 'bg-amber-950/60 border-amber-500/40 text-amber-400 shadow-amber-950/80',
      borderHover: 'hover:border-amber-500/50',
    },
    {
      id: 'stat-programs',
      number: totalPrograms,
      suffix: '+',
      label: 'Programs Conducted',
      badge: `${wings.length || 14} Dynamic Wings`,
      trend: 'Live Calendars',
      trendIcon: Sparkles,
      icon: Calendar,
      color: 'cyan',
      targetSection: '#programs',
      accentGlow: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
      badgeBg: 'bg-cyan-950/70 border-cyan-500/30 text-cyan-400',
      iconBox: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400 shadow-cyan-950/80',
      borderHover: 'hover:border-cyan-500/50',
    },
    {
      id: 'stat-legacy',
      number: yearsLegacy,
      suffix: ' Years',
      label: 'Unbroken Student Legacy',
      badge: 'Estd. 1994',
      trend: '32nd Cabinet',
      trendIcon: GraduationCap,
      icon: BookOpen,
      color: 'purple',
      targetSection: '#about',
      accentGlow: 'from-purple-500/20 via-purple-500/5 to-transparent',
      badgeBg: 'bg-purple-950/70 border-purple-500/30 text-purple-300',
      iconBox: 'bg-purple-950/60 border-purple-500/40 text-purple-300 shadow-purple-950/80',
      borderHover: 'hover:border-purple-500/50',
    },
  ];

  return (
    <div className="relative z-10 w-full border-t border-stone-800/90 bg-stone-950/90 backdrop-blur-xl py-6 sm:py-7">
      {/* Top telemetry status bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-400">
            Real-Time Union Telemetry
          </span>
          <span className="text-stone-600 hidden sm:inline">•</span>
          <span className="text-[11px] font-mono text-emerald-400/90 hidden sm:inline">
            Academic Session 2026–27
          </span>
        </div>

        <div className="text-[11px] font-mono text-stone-500 hidden md:flex items-center gap-1.5">
          <span>Click any card to explore section</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
        </div>
      </div>

      {/* Bento Grid Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            const TrendIcon = item.trendIcon;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleCardClick(item.targetSection)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className={`group relative text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-stone-900/90 to-stone-950/90 border border-stone-800/80 ${item.borderHover} shadow-lg shadow-black/40 hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between`}
              >
                {/* Background ambient radial glow */}
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${item.accentGlow} blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Card Top Row: Icon + Badge */}
                <div className="flex items-center justify-between mb-3 w-full">
                  <div
                    className={`w-12 h-12 rounded-xl border p-2.5 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-md ${item.iconBox}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border tracking-wide uppercase ${item.badgeBg}`}
                  >
                    <TrendIcon className="w-3 h-3" />
                    {item.badge}
                  </span>
                </div>

                {/* Metric Value with Animated Counter */}
                <div className="space-y-1 mt-1">
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-none group-hover:text-stone-100">
                      <AnimatedCounter target={item.number} suffix={item.suffix} />
                    </p>
                    <ArrowUpRight className="w-4 h-4 text-stone-500 opacity-0 group-hover:opacity-100 group-hover:text-emerald-400 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0" />
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300 font-medium tracking-normal leading-snug">
                    {item.label}
                  </p>
                </div>

                {/* Bottom subtle progress / indicator micro-strip */}
                <div className="mt-3 pt-2.5 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                  <span className="text-stone-400 group-hover:text-stone-200 transition-colors">
                    {item.trend}
                  </span>
                  <span className="text-emerald-400/80 group-hover:translate-x-0.5 transition-transform text-[10px]">
                    Explore →
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
