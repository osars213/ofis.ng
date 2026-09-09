import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { SpaceList } from './components/SpaceList';
import { LandingPage } from './components/landing/LandingPage';
import { ExploreListingView } from './components/explore/ExploreListingView';
import { SpaceDetails } from './components/SpaceDetails';
import { ExploreMapView } from './components/ExploreMapView';
import { UserBookingsView } from './components/UserBookingsView';
import { HostDashboard } from './components/HostDashboard';
import { UserDashboardView } from './components/user/UserDashboardView';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { HelpCenterPage } from './components/pages/HelpCenterPage';
import { FaqPage } from './components/pages/FaqPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/pages/TermsOfServicePage';
import { BecomeHostPage } from './components/pages/BecomeHostPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { OfisNavigationDrawer } from './components/OfisNavigationDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DigitalPassModal } from './components/DigitalPassModal';
import { BookingDetailsModal } from './components/BookingDetailsModal';
import { ListSpaceModal } from './components/ListSpaceModal';
import { OfisAuthModal } from './components/OfisAuthModal';
import { SettingsModal } from './components/SettingsModal';
import { DirectionsModal } from './components/DirectionsModal';
import { ContactHostModal } from './components/ContactHostModal';
import { WriteReviewModal } from './components/WriteReviewModal';
import { EditSpaceModal } from './components/EditSpaceModal';
import { HostPayoutModal } from './components/HostPayoutModal';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { AdminVerificationModal } from './components/AdminVerificationModal';
import { EmailVerificationModal } from './components/EmailVerificationModal';
import { InfoModal } from './components/InfoModal';
import { CompareFloatingBar } from './components/compare/CompareFloatingBar';
import { WorkspaceCompareModal } from './components/compare/WorkspaceCompareModal';
import { DownloadAppModal } from './components/DownloadAppModal';

export const App: React.FC = () => {
  const { 
    currentView, 
    currentUser, 
    isInfoModalOpen, 
    setIsInfoModalOpen, 
    infoModalTab, 
    setIsListSpaceModalOpen
  } = useApp();

  const renderCurrentView = () => {
    if (currentUser.role === 'host' && currentView === 'host_dashboard') {
      return <HostDashboard />;
    }

    switch (currentView) {
      case 'home':
        return <SpaceList />;
      case 'explore':
      case 'saved':
        return <ExploreListingView />;
      case 'details':
        return <SpaceDetails />;
      case 'map':
        return <ExploreMapView />;
      case 'bookings':
        return <UserBookingsView />;
      case 'user_dashboard':
        return <UserDashboardView />;
      case 'host_dashboard':
        return <HostDashboard />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'help':
        return <HelpCenterPage />;
      case 'faq':
        return <FaqPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsOfServicePage />;
      case 'become_host':
        return <BecomeHostPage />;
      case 'not_found':
        return <NotFoundPage />;
      default:
        return <LandingPage />;
    }
  };

  const showFooter = currentView !== 'map';

  return (
    <div className="min-h-screen bg-[#F5F7F7] dark:bg-[#071521] text-[#172B3A] dark:text-[#F8FAFC] flex flex-col font-sans selection:bg-[#0F766E] selection:text-white transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1 pb-16 md:pb-0">
        {renderCurrentView()}
      </main>

      {/* Global Responsive Footer */}
      {showFooter && <Footer />}

      {/* Comparison Floating Bar */}
      {currentUser.role !== 'host' && <CompareFloatingBar />}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Navigation & Global Modals */}
      <OfisNavigationDrawer />
      <InfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
        initialTab={infoModalTab}
        onBecomeHost={() => setIsListSpaceModalOpen(true)}
      />
      <WorkspaceCompareModal />
      <CheckoutModal />
      <DigitalPassModal />
      <BookingDetailsModal />
      <ListSpaceModal />
      <EditSpaceModal />
      <HostPayoutModal />
      <DiagnosticsModal />
      <AdminVerificationModal />
      <EmailVerificationModal />
      <OfisAuthModal />
      <SettingsModal />
      <DirectionsModal />
      <ContactHostModal />
      <WriteReviewModal />
      {/* Global Download Mobile App Modal */}
      <DownloadAppModal />
    </div>
  );
};

export default App;

