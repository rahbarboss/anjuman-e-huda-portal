import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigation, NavPage } from '../context/NavigationContext';
import { Bell, Menu, X, ShieldCheck, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const { logoClickCount, handleLogoClick, isAdminLoggedIn, activeView, setActiveView } = useAuth();
  const { database } = useData();
  const { currentPage, navigateTo } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: Array<{ label: string; page: NavPage }> = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Updates', page: 'updates' },
    { label: 'Leadership', page: 'leadership' },
    { label: 'Wings', page: 'wings' },
    { label: 'Programs', page: 'programs' },
    { label: 'Rankings', page: 'rankings' },
    { label: 'CAU', page: 'cau' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: NavPage) => {
    setMobileMenuOpen(false);
    if (activeView === 'admin') {
      setActiveView('site');
    }
    navigateTo(page);
  };

  return (
    <header
      id="main-navbar-header"
      className="sticky top-0 z-40 w-full bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 transition-all shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo on the Left - Secret 5 Clicks Admin Access & Home navigation */}
          <div className="flex items-center gap-3">
            <button
              id="anjuman-logo-button"
              type="button"
              onClick={handleLogoClick}
              className="group relative flex items-center gap-3 text-left focus:outline-none transition-transform active:scale-95 select-none cursor-pointer"
              title="ANJUMAN-E-HUDA (Click once to go Home, Click 5x for Central Admin)"
            >
              <div className="relative w-12 h-12 rounded-xl bg-white border border-stone-200/50 p-1 shadow-md shadow-emerald-950/30 flex items-center justify-center overflow-hidden">
                <img
                  src="https://i.postimg.cc/ZKC5Cf1Z/image.png"
                  alt="ANJUMAN-E-HUDA Official Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                {/* Stealth click pulse ring */}
                {logoClickCount > 0 && (
                  <span className="absolute inset-0 rounded-xl border-2 border-emerald-400 animate-ping opacity-60 pointer-events-none" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    ANJUMAN-E-HUDA
                  </span>
                  {/* Subtle click indicator dots */}
                  {logoClickCount > 0 && logoClickCount < 5 && (
                    <div className="flex items-center gap-0.5 ml-1">
                      {Array.from({ length: logoClickCount }).map((_, i) => (
                        <span key={`logo-click-dot-${i}`} className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-widest font-semibold uppercase text-stone-400 font-mono">
                    NIICS STUDENTS' UNION
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center Navigation Menus - Dedicated Page Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page && activeView === 'site';
              return (
                <button
                  key={`desktop-nav-${link.label}`}
                  onClick={() => handleNavClick(link.page)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900/90'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Admin Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <button
              id="notification-bell-btn"
              onClick={onOpenNotifications}
              className="relative p-2 text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl transition-all cursor-pointer"
              title="Union Notification Center"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {database.announcements.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-stone-950 font-bold text-[9px] rounded-full flex items-center justify-center shadow">
                  {database.announcements.length}
                </span>
              )}
            </button>

            {/* Admin Switcher if already logged in */}
            {isAdminLoggedIn && (
              <button
                id="admin-dashboard-toggle-btn"
                onClick={() => setActiveView(activeView === 'admin' ? 'site' : 'admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {activeView === 'admin' ? 'Live Site' : 'Admin Panel'}
                </span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white bg-stone-900 border border-stone-800 rounded-xl cursor-pointer"
              title="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn"
        >
          <div className="grid grid-cols-2 gap-1.5 pb-3 mb-3 border-b border-stone-800/80">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page && activeView === 'site';
              return (
                <button
                  key={`mobile-nav-${link.label}`}
                  onClick={() => handleNavClick(link.page)}
                  className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-300 hover:text-emerald-400 hover:bg-stone-900'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-stone-400 px-2">
            <span>Click logo 5x to trigger Admin Login</span>
            <button
              onClick={onOpenNotifications}
              className="text-amber-400 font-medium hover:underline flex items-center gap-1"
            >
              <Bell className="w-3.5 h-3.5" />
              Notifications ({database.announcements.length})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
