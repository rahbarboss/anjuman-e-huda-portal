import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { defaultTelemetrySettings } from '../defaultData';
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
  const telemetry = database.telemetry || defaultTelemetrySettings;
  const cards = telemetry.cards && telemetry.cards.length > 0 ? telemetry.cards : defaultTelemetrySettings.cards;

  const cardConfigMap: Record<string, {
    icon: React.ComponentType<{ className?: string }>;
    trendIcon: React.ComponentType<{ className?: string }>;
    color: string;
    accentGlow: string;
    badgeBg: string;
    iconBox: string;
    borderHover: string;
    defaultTarget: string;
  }> = {
    'stat-scholars': {
      icon: Users,
      trendIcon: TrendingUp,
      color: 'emerald',
      accentGlow: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      iconBox: 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs',
      borderHover: 'hover:border-emerald-400',
      defaultTarget: '#leadership',
    },
    'stat-achievements': {
      icon: Trophy,
      trendIcon: Award,
      color: 'amber',
      accentGlow: 'from-amber-500/10 via-amber-500/5 to-transparent',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
      iconBox: 'bg-amber-50 border-amber-200 text-amber-800 shadow-xs',
      borderHover: 'hover:border-amber-400',
      defaultTarget: '#rankings',
    },
    'stat-programs': {
      icon: Calendar,
      trendIcon: Sparkles,
      color: 'cyan',
      accentGlow: 'from-sky-500/10 via-sky-500/5 to-transparent',
      badgeBg: 'bg-sky-50 border-sky-200 text-sky-800',
      iconBox: 'bg-sky-50 border-sky-200 text-sky-800 shadow-xs',
      borderHover: 'hover:border-sky-400',
      defaultTarget: '#programs',
    },
    'stat-legacy': {
      icon: BookOpen,
      trendIcon: GraduationCap,
      color: 'purple',
      accentGlow: 'from-purple-500/10 via-purple-500/5 to-transparent',
      badgeBg: 'bg-purple-50 border-purple-200 text-purple-800',
      iconBox: 'bg-purple-50 border-purple-200 text-purple-800 shadow-xs',
      borderHover: 'hover:border-purple-400',
      defaultTarget: '#about',
    },
  };

  const handleCardClick = (selector: string) => {
    if (onNavigate) {
      onNavigate(selector);
    } else {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const statItems = cards.map((c, idx) => {
    const config = cardConfigMap[c.id] || Object.values(cardConfigMap)[idx % 4];
    return {
      id: c.id,
      number: c.value,
      suffix: c.suffix || '',
      label: c.label,
      badge: c.badge,
      trend: c.trend,
      trendIcon: config.trendIcon,
      icon: config.icon,
      color: c.color || config.color,
      targetSection: c.targetSection || config.defaultTarget,
      accentGlow: config.accentGlow,
      badgeBg: config.badgeBg,
      iconBox: config.iconBox,
      borderHover: config.borderHover,
    };
  });

  return (
    <div className="relative z-10 w-full border-t border-stone-200/90 bg-white/70 backdrop-blur-md py-6 sm:py-7">
      {/* Top telemetry status bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-700">
            {telemetry.title || 'Real-Time Union Telemetry'}
          </span>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <span className="text-[11px] font-mono text-emerald-800 font-semibold hidden sm:inline">
            {telemetry.academicSession || 'Academic Session 2026–27'}
          </span>
        </div>

        <div className="text-[11px] font-mono text-stone-500 hidden md:flex items-center gap-1.5">
          <span>{telemetry.hintText || 'Click any card to explore section'}</span>
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
                className={`group relative text-left p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 ${item.borderHover} shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between`}
              >
                {/* Background ambient radial glow */}
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${item.accentGlow} blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Card Top Row: Icon + Badge */}
                <div className="flex items-center justify-between mb-3 w-full">
                  <div
                    className={`w-12 h-12 rounded-xl border p-2.5 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${item.iconBox}`}
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
                    <p className="text-3xl sm:text-4xl font-extrabold font-heading text-stone-900 tracking-tight leading-none group-hover:text-emerald-800 transition-colors">
                      <AnimatedCounter target={item.number} suffix={item.suffix} />
                    </p>
                    <ArrowUpRight className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 group-hover:text-emerald-600 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0" />
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 font-medium tracking-normal leading-snug">
                    {item.label}
                  </p>
                </div>

                {/* Bottom subtle progress / indicator micro-strip */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span className="text-stone-500 group-hover:text-stone-700 transition-colors">
                    {item.trend}
                  </span>
                  <span className="text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform text-[10px]">
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
