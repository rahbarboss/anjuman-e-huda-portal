import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SecretAdminLoginModal } from './components/SecretAdminLoginModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { WhatsAppFloatingWidget } from './components/WhatsAppFloatingWidget';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Page Components
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { UpdatesPage } from './pages/UpdatesPage';
import { LeadershipPage } from './pages/LeadershipPage';
import { ParticipantsPage } from './pages/ParticipantsPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { RankingsPage } from './pages/RankingsPage';
import { CAUPage } from './pages/CAUPage';
import { ContactPage } from './pages/ContactPage';

const PageRenderer: React.FC<{ onOpenNotifications: () => void }> = ({ onOpenNotifications }) => {
  const { currentPage } = useNavigation();

  switch (currentPage) {
    case 'home':
      return <HomePage onOpenNotifications={onOpenNotifications} />;
    case 'about':
      return <AboutPage />;
    case 'updates':
      return <UpdatesPage />;
    case 'leadership':
      return <LeadershipPage />;
    case 'wings':
    case 'participants':
      return <ParticipantsPage />;
    case 'programs':
      return <ProgramsPage />;
    case 'rankings':
      return <RankingsPage />;
    case 'cau':
      return <CAUPage />;
    case 'contact':
      return <ContactPage />;
    default:
      return <HomePage onOpenNotifications={onOpenNotifications} />;
  }
};

const MainPortalContent: React.FC = () => {
  const { activeView, isAdminLoggedIn } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // If admin mode is active and authenticated, show the complete Admin Dashboard
  if (activeView === 'admin' && isAdminLoggedIn) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-emerald-500 selection:text-stone-950 flex flex-col font-sans">
      {/* Top Navigation Bar with Page Switching and Logo trigger */}
      <Navbar onOpenNotifications={() => setIsNotificationOpen(true)} />

      {/* Main Routed Page View */}
      <main className="flex-1">
        <PageRenderer onOpenNotifications={() => setIsNotificationOpen(true)} />
      </main>

      {/* Comprehensive Footer */}
      <Footer />

      {/* Secret 5-Click Admin Login Modal */}
      <SecretAdminLoginModal />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Floating WhatsApp Chat Widget */}
      <WhatsAppFloatingWidget />
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <NavigationProvider>
        <AuthProvider>
          <MainPortalContent />
        </AuthProvider>
      </NavigationProvider>
    </DataProvider>
  );
}
