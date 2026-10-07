import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Target,
  Award,
  BookOpenCheck,
  Sparkles,
  Compass,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  X,
  ExternalLink,
  Flame,
  HeartHandshake,
  Users,
  GraduationCap,
} from 'lucide-react';

interface PillarDetail {
  id: string;
  title: string;
  arabicMotto: string;
  arabicMeaning: string;
  desc: string;
  icon: any;
  colorName: string;
  badge: string;
  keyPoints: string[];
  wingAffiliation: string;
  gradient: string;
  borderHover: string;
  badgeStyle: string;
  iconBg: string;
}

export const AboutSection: React.FC = () => {
  const { database } = useData();
  const { homepage } = database;
  const { handleLogoClick } = useAuth();

  const [activePillar, setActivePillar] = useState<PillarDetail | null>(null);

  // Helper to generate full styles & icon for any pillar
  const getPillarStyling = (colorName: string = 'emerald', id: string = '') => {
    const effectiveColor = colorName || (id.includes('talim') ? 'emerald' : id.includes('tarbiyah') ? 'amber' : id.includes('khidmah') ? 'sky' : 'purple');
    switch (effectiveColor) {
      case 'amber':
        return {
          icon: Target,
          gradient: 'from-amber-50 via-white to-stone-50',
          borderHover: 'hover:border-amber-400 hover:shadow-lg',
          badgeStyle: 'bg-amber-100 text-amber-800 border-amber-200',
          iconBg: 'bg-amber-50 border-amber-200 text-amber-700',
        };
      case 'sky':
      case 'blue':
        return {
          icon: ShieldCheck,
          gradient: 'from-sky-50 via-white to-stone-50',
          borderHover: 'hover:border-sky-400 hover:shadow-lg',
          badgeStyle: 'bg-sky-100 text-sky-800 border-sky-200',
          iconBg: 'bg-sky-50 border-sky-200 text-sky-700',
        };
      case 'purple':
        return {
          icon: Award,
          gradient: 'from-purple-50 via-white to-stone-50',
          borderHover: 'hover:border-purple-400 hover:shadow-lg',
          badgeStyle: 'bg-purple-100 text-purple-800 border-purple-200',
          iconBg: 'bg-purple-50 border-purple-200 text-purple-700',
        };
      case 'rose':
      case 'red':
        return {
          icon: Flame,
          gradient: 'from-rose-50 via-white to-stone-50',
          borderHover: 'hover:border-rose-400 hover:shadow-lg',
          badgeStyle: 'bg-rose-100 text-rose-800 border-rose-200',
          iconBg: 'bg-rose-50 border-rose-200 text-rose-700',
        };
      case 'emerald':
      default:
        return {
          icon: BookOpenCheck,
          gradient: 'from-emerald-50 via-white to-stone-50',
          borderHover: 'hover:border-emerald-500 hover:shadow-lg',
          badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        };
    }
  };

  const rawPillars = database.pillars && database.pillars.length > 0 ? database.pillars : [
    {
      id: 'talim',
      name: "Ta'lim",
      englishTitle: 'Illuminated Education',
      arabicMotto: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
      arabicMeaning: 'Scholastic Depth & Enlightened Inquiry',
      desc: 'Advancing intellectual depth through rigorous scholarly colloquiums, departmental research guilds, access to classical Islamic treatises, and modern technological synthesis.',
      colorName: 'emerald',
      badge: 'Academic Council • 1,200+ Scholars',
      keyPoints: [
        'Inter-Departmental Research Colloquiums',
        'Classical Islamic & Contemporary Discourse',
        "Annual Grand Ta'lim Convocation",
      ],
      wingAffiliation: 'Central Academic Union & Research Wing',
    },
    {
      id: 'tarbiyah',
      name: 'Tarbiyah',
      englishTitle: 'Character Stewardship',
      arabicMotto: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ',
      arabicMeaning: 'Noble Character & Moral Rectitude',
      desc: 'Nurturing conscious self-discipline, ethical leadership, moral compass, and humble brotherhood inside campus corridors, living halls, and civic life.',
      colorName: 'amber',
      badge: 'Ethics Guild • Unbroken Lineage',
      keyPoints: [
        'Moral Stewardship & Mentorship Circles',
        'Spiritual Assemblies & Tahajjud Vigils',
        'Ethical Leadership Incubation',
      ],
      wingAffiliation: 'Spiritual & Ethical Development Council',
    },
    {
      id: 'khidmah',
      name: 'Khidmah',
      englishTitle: 'Public Service',
      arabicMotto: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
      arabicMeaning: 'Selfless Benevolence & Community Relief',
      desc: 'Mobilizing rapid humanitarian relief, state blood donor networks, student medical welfare funds, and emergency disaster assistance with compassion.',
      colorName: 'sky',
      badge: 'Social Relief • 24/7 Response',
      keyPoints: [
        'State-Wide Blood Donor Registry',
        'Needy Student Hardship Welfare Grants',
        'Campus Health Camps & Relief Convoys',
      ],
      wingAffiliation: 'Rahma Public Welfare & Relief Wing',
    },
    {
      id: 'ittihad',
      name: 'Ittihad',
      englishTitle: 'Harmonious Unity',
      arabicMotto: 'وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا',
      arabicMeaning: 'Harmonious Fraternity & Democratic Voice',
      desc: 'Uniting diverse departmental voices, academic batches, and collegiate faculties into one vibrant, transparent, democratic collegiate parliament.',
      colorName: 'purple',
      badge: 'Student Parliament • 100% Representation',
      keyPoints: [
        'Democratic Student Council Deliberations',
        'Inter-Collegiate Cultural Symposia',
        'Equal Voice Across Every Department',
      ],
      wingAffiliation: 'Central Executive Secretariat & Parliament',
    },
  ];

  const pillars: PillarDetail[] = rawPillars.map((p) => {
    const styling = getPillarStyling(p.colorName, p.id);
    return {
      id: p.id,
      title: `${p.name} (${p.englishTitle})`,
      arabicMotto: p.arabicMotto || 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
      arabicMeaning: p.arabicMeaning || p.englishTitle,
      desc: p.desc,
      icon: styling.icon,
      colorName: p.colorName || 'emerald',
      badge: p.badge || `${p.name} Pillar • Apex Council`,
      keyPoints: p.keyPoints && p.keyPoints.length > 0 ? p.keyPoints : [p.englishTitle, p.desc],
      wingAffiliation: p.wingAffiliation || 'Central Executive Secretariat',
      gradient: styling.gradient,
      borderHover: styling.borderHover,
      badgeStyle: styling.badgeStyle,
      iconBg: styling.iconBg,
    };
  });

  return (
    <section id="about" className="py-24 text-stone-900 border-b border-stone-200 relative overflow-hidden">
      {/* Subtle background ambient lighting */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Official Emblem */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          <button
            type="button"
            onClick={handleLogoClick}
            className="w-24 h-24 p-2.5 mb-5 rounded-2xl bg-white shadow-md border border-stone-200 hover:border-emerald-500 transition-all hover:scale-105 cursor-pointer flex items-center justify-center group"
            title="ANJUMAN-E-HUDA Official Emblem (Click to scroll to top)"
          >
            <img
              src="https://i.postimg.cc/ZKC5Cf1Z/image.png"
              alt="ANJUMAN-E-HUDA Official Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase font-mono shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            CHARTER & FOUNDATIONAL CREED • ESTD. 1994
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-stone-900 mt-3 mb-4 tracking-tight">
            The Soul of ANJUMAN-E-HUDA
          </h2>

          <p className="text-xs font-serif italic text-amber-800 mb-4 tracking-wide">
            وَقُل رَّبِّ زِدْنِي عِلْمًا • "O Lord, Increase Me in Knowledge"
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 mx-auto rounded-full mb-6" />

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
            {homepage.aboutText ||
              "ANJUMAN-E-HUDA is the premier student governing union committed to fostering academic excellence, moral leadership, social harmony, and creative enrichment across all departments. Founded on the principle of Ta'lim (intellectual and spiritual illumination), the union serves as the unified voice and catalyst for student welfare and progress."}
          </p>
        </div>

        {/* Dynamic Bento Box: Our Core Vision & Our Mandated Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Card 1: Our Core Vision (Emerald Radiant Bento Card) */}
          <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-50/50 via-white to-stone-50 border border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />

            <div>
              {/* Badge & Arabic Motto Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  FOUNDATIONAL HORIZON • VISION 2030
                </span>
                <span className="text-xs font-serif italic text-emerald-800 border-b border-emerald-300 pb-0.5">
                  نُورٌ عَلَى نُورٍ • Light Upon Light
                </span>
              </div>

              {/* Icon & Heading */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-all">
                  <Target className="w-7 h-7 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-heading text-stone-900 tracking-tight">
                    Our Core Vision
                  </h3>
                  <span className="text-xs text-stone-500 font-mono">
                    Long-Range Scholastic & Moral North Star
                  </span>
                </div>
              </div>

              {/* Vision Text */}
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                {homepage.vision ||
                  'To sculpt enlightened scholars and ethical trailblazers capable of positively impacting society through knowledge, service, and universal brotherhood.'}
              </p>

              {/* Strategic Focus Directives */}
              <div className="space-y-2.5 pt-4 border-t border-stone-200">
                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Scholarly Illumination:</strong> Uncompromising dedication to classical treatises and modern research.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ethical Stewardship:</strong> Inculcating character, humble servant-leadership, and universal brotherhood.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Societal Uplift:</strong> Translating campus enlightenment into selfless civic service and compassionate leadership.
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Interactive Feature */}
            <div className="mt-8 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>32-Year Lineage of Visionary Excellence</span>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono">
                Pillar I: Ta'lim & Tarbiyah
              </span>
            </div>
          </div>

          {/* Card 2: Our Mandated Mission (Amber Radiant Bento Card) */}
          <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-50/50 via-white to-stone-50 border border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0" />

            <div>
              {/* Badge & Arabic Motto Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-mono font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  ACTIVE CONSTITUTIONAL DIRECTIVE
                </span>
                <span className="text-xs font-serif italic text-amber-800 border-b border-amber-300 pb-0.5">
                  وَتَعَاوَنُوا عَلَى الْبِرِّ • Cooperation in Goodness
                </span>
              </div>

              {/* Icon & Heading */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-all">
                  <ShieldCheck className="w-7 h-7 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-heading text-stone-900 tracking-tight">
                    Our Mandated Mission
                  </h3>
                  <span className="text-xs text-stone-500 font-mono">
                    Executive Action & Student Welfare Mandate
                  </span>
                </div>
              </div>

              {/* Mission Text */}
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                {homepage.mission ||
                  'To foster an inclusive campus environment, champion democratic student representation, organize transformative academic and socio-cultural initiatives, and nurture holistic talent.'}
              </p>

              {/* Executive Commitments */}
              <div className="space-y-2.5 pt-4 border-t border-stone-200">
                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Democratic Representation:</strong> Protecting student rights, grievances, and transparent departmental assemblies.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Holistic Incubation:</strong> Organizing annual debates, sports olympiads, literary journals, and relief drives.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Mutual Harmony:</strong> Nurturing inclusive campus camaraderie across all 9 specialized student wings.
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Interactive Feature */}
            <div className="mt-8 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-amber-800 font-mono font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Sanctioned by General Collegiate Assembly</span>
              </div>
              <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-mono">
                Pillar II: Khidmah & Ittihad
              </span>
            </div>
          </div>
        </div>

        {/* The 4 Foundational Pillars: Professional, Dynamic, Interactive Showcase */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700">
              FOUR PILLARS OF UNION CREED
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-stone-900 mt-1">
              Foundational Pillars of ANJUMAN-E-HUDA
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm mt-2">
              Every initiative, academic wing, and constitutional resolution is anchored upon these four immutable
              cornerstones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={`pillar-card-${pillar.id}`}
                  onClick={() => setActivePillar(pillar)}
                  className={`relative p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-2 group ${pillar.borderHover}`}
                >
                  {/* Subtle top indicator bar */}
                  <div
                    className={`absolute top-0 left-6 right-6 h-[2px] rounded-full ${
                      pillar.colorName === 'emerald'
                        ? 'bg-emerald-400'
                        : pillar.colorName === 'amber'
                        ? 'bg-amber-400'
                        : pillar.colorName === 'sky'
                        ? 'bg-sky-400'
                        : 'bg-purple-400'
                    }`}
                  />

                  <div>
                    {/* Header with Icon and Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${pillar.iconBg}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${pillar.badgeStyle}`}>
                        {pillar.id.toUpperCase()}
                      </span>
                    </div>

                    {/* Arabic Motto */}
                    <div className="mb-2">
                      <span className="text-xs font-serif italic text-stone-600 block group-hover:text-amber-700 transition-colors">
                        {pillar.arabicMotto}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 block">
                        {pillar.arabicMeaning}
                      </span>
                    </div>

                    {/* Pillar Title */}
                    <h4 className="text-lg font-bold font-heading text-stone-900 group-hover:text-emerald-700 transition-colors mb-2">
                      {pillar.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {pillar.desc}
                    </p>

                    {/* Key Objectives */}
                    <div className="space-y-1.5 pt-3 border-t border-stone-100 mb-4">
                      {pillar.keyPoints.map((pt, pIdx) => (
                        <div key={`pt-${pIdx}`} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                          <ChevronRight className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-stone-500 truncate max-w-[170px]">
                      {pillar.wingAffiliation}
                    </span>
                    <button
                      type="button"
                      className="text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1 font-semibold text-xs"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Pillar Detail Modal Popup */}
      {activePillar && (
        <div
          id="pillar-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActivePillar(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-2xl p-7 text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${activePillar.iconBg}`}>
                  {React.createElement(activePillar.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                    UNION DOCTRINE ARCHIVE
                  </span>
                  <h4 className="text-base font-bold text-stone-900 leading-tight">{activePillar.title}</h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePillar(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <p className="text-sm font-serif italic text-amber-800 mb-1 text-center">
                "{activePillar.arabicMotto}"
              </p>
              <p className="text-[11px] font-mono text-stone-600 text-center">
                — {activePillar.arabicMeaning}
              </p>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed mb-5">
              {activePillar.desc}
            </p>

            <div className="mb-6 space-y-2">
              <span className="text-xs font-mono uppercase font-semibold text-stone-500 block mb-1">
                Institutional Directives:
              </span>
              {activePillar.keyPoints.map((kp, idx) => (
                <div
                  key={`akp-${idx}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{kp}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs text-stone-600 mb-5">
              <span className="font-mono">Responsible Authority:</span>
              <span className="font-semibold text-emerald-700">{activePillar.wingAffiliation}</span>
            </div>

            <button
              type="button"
              onClick={() => setActivePillar(null)}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
