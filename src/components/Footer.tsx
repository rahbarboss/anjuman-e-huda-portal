import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation, NavPage } from '../context/NavigationContext';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  Shield,
  ArrowUp,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { handleLogoClick, isAdminLoggedIn, setActiveView } = useAuth();
  const { navigateTo } = useNavigation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800/80 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1 & 2: Union Logo & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 text-left focus:outline-none group select-none cursor-pointer"
              title="ANJUMAN-E-HUDA (Click to go Home, Click 5x for Admin)"
            >
              <div className="w-13 h-13 rounded-xl bg-white border border-stone-200/50 p-1 shadow-md flex items-center justify-center">
                <img
                  src="https://i.postimg.cc/ZKC5Cf1Z/image.png"
                  alt="ANJUMAN-E-HUDA Official Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="font-heading font-bold text-xl text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  ANJUMAN-E-HUDA
                </span>
                <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                  STUDENTS' UNION • ESTD. 1994
                </p>
              </div>
            </button>

            {/* Arabic Motto */}
            <p className="text-amber-400/90 text-sm font-serif italic pt-1">
              "وَقُل رَّبِّ زِدْنِي عِلْمًا" • And say: My Lord, increase me in knowledge.
            </p>

            {/* Bio */}
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              The supreme collegiate union embodying student representation, moral integrity, academic
              enlightenment (Ta'lim), and transformative public welfare across university faculties.
            </p>

            {/* Social media icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                title="YouTube Official"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-700 transition-colors"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Home Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  About Union & 4 Pillars
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('updates')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Live Updates & Gazettes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('leadership')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Executive Leadership
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('programs')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  All Programs & Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Our Off-Campuses (Matching Image 4) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              OUR OFF-CAMPUSES
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              {[
                'DH NIICS Chemmad',
                'DH NIICS Hangal',
                'DH NIICS Punganur',
                'DH NIICS Maharashtra',
                'DH NIICS Assam',
                'DH NIICS West Bengal',
              ].map((campus, idx) => (
                <li key={`off-campus-${idx}`} className="flex items-center gap-2.5 group">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/60 ring-2 ring-emerald-500/20 group-hover:scale-125 transition-transform" />
                  <span className="text-stone-300 group-hover:text-emerald-300 transition-colors font-medium">
                    {campus}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
              Secretariat Info
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Student Activity Quadrangle, Main Campus, Gate 4</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>secretariat@anjumanehuda.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright text & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {currentYear} ANJUMAN-E-HUDA Students' Union. All rights reserved. Ratified under University
            Constitution.
          </p>

          <div className="flex items-center gap-4">
            {isAdminLoggedIn && (
              <button
                onClick={() => setActiveView('admin')}
                className="text-emerald-400 hover:underline font-mono cursor-pointer"
              >
                Open Admin Dashboard
              </button>
            )}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
