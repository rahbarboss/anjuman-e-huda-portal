import React, { createContext, useContext, useState, useEffect } from 'react';

export type NavPage =
  | 'home'
  | 'about'
  | 'updates'
  | 'leadership'
  | 'wings'
  | 'participants'
  | 'programs'
  | 'rankings'
  | 'cau'
  | 'contact';

interface NavigationContextType {
  currentPage: NavPage;
  navigateTo: (page: NavPage) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavPage>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'participants') return 'wings';
      const validPages: NavPage[] = [
        'home',
        'about',
        'updates',
        'leadership',
        'wings',
        'participants',
        'programs',
        'rankings',
        'cau',
        'contact',
      ];
      if (validPages.includes(hash as NavPage)) {
        return hash as NavPage;
      }
    }
    return 'home';
  });

  const navigateTo = (page: NavPage) => {
    const targetPage = page === 'participants' ? 'wings' : page;
    setCurrentPage(targetPage);
    if (typeof window !== 'undefined') {
      window.location.hash = targetPage;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'participants') {
        setCurrentPage('wings');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const validPages: NavPage[] = [
        'home',
        'about',
        'updates',
        'leadership',
        'wings',
        'participants',
        'programs',
        'rankings',
        'cau',
        'contact',
      ];
      if (validPages.includes(hash as NavPage)) {
        setCurrentPage(hash as NavPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
