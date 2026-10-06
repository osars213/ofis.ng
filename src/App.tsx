import React, { Suspense } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { OfisNavigationDrawer } from './components/OfisNavigationDrawer';
import { CompareFloatingBar } from './components/compare/CompareFloatingBar';
import { AiFloatingButton } from './components/AiFloatingButton';

// Lazy-load view components so bundle sizes are minimal and load on demand
const SpaceList = React.lazy(() => import('./components/SpaceList').then(m => ({ default: m.SpaceList })));
const ExploreListingView = React.lazy(() => import('./components/explore/ExploreListingView').then(m => ({ default: m.ExploreListingView })));
const SpaceDetails = React.lazy(() => import('./components/SpaceDetails').then(m => ({ default: m.SpaceDetails })));
const ExploreMapView = React.lazy(() => import('./components/ExploreMapView').then(m => ({ default: m.ExploreMapView })));
const UserBookingsView = React.lazy(() => import('./components/UserBookingsView').then(m => ({ default: m.UserBookingsView })));
const HostDashboard = React.lazy(() => import('./components/HostDashboard').then(m => ({ default: m.HostDashboard })));
const UserDashboardView = React.lazy(() => import('./components/user/UserDashboardView').then(m => ({ default: m.UserDashboardView })));
const AboutPage = React.lazy(() => import('./components/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = React.lazy(() => import('./components/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const HelpCenterPage = React.lazy(() => import('./components/pages/HelpCenterPage').then(m => ({ default: m.HelpCenterPage })));
const FaqPage = React.lazy(() => import('./components/pages/FaqPage').then(m => ({ default: m.FaqPage })));
const PrivacyPolicyPage = React.lazy(() => import('./components/pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = React.lazy(() => import('./components/pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const BecomeHostPage = React.lazy(() => import('./components/pages/BecomeHostPage').then(m => ({ default: m.BecomeHostPage })));
const NotFoundPage = React.lazy(() => import('./components/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const PaymentResultView = React.lazy(() => import('./components/PaymentResultView').then(m => ({ default: m.PaymentResultView })));

// Lazy-load modals (they are only needed when triggered)
const CheckoutModal = React.lazy(() => import('./components/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const DigitalPassModal = React.lazy(() => import('./components/DigitalPassModal').then(m => ({ default: m.DigitalPassModal })));
const BookingDetailsModal = React.lazy(() => import('./components/BookingDetailsModal').then(m => ({ default: m.BookingDetailsModal })));
const ListSpaceModal = React.lazy(() => import('./components/ListSpaceModal').then(m => ({ default: m.ListSpaceModal })));
const OfisAuthModal = React.lazy(() => import('./components/OfisAuthModal').then(m => ({ default: m.OfisAuthModal })));
const SettingsModal = React.lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const DirectionsModal = React.lazy(() => import('./components/DirectionsModal').then(m => ({ default: m.DirectionsModal })));
const ContactHostModal = React.lazy(() => import('./components/ContactHostModal').then(m => ({ default: m.ContactHostModal })));
const WriteReviewModal = React.lazy(() => import('./components/WriteReviewModal').then(m => ({ default: m.WriteReviewModal })));
const EditSpaceModal = React.lazy(() => import('./components/EditSpaceModal').then(m => ({ default: m.EditSpaceModal })));
const HostPayoutModal = React.lazy(() => import('./components/HostPayoutModal').then(m => ({ default: m.HostPayoutModal })));
const DiagnosticsModal = React.lazy(() => import('./components/DiagnosticsModal').then(m => ({ default: m.DiagnosticsModal })));
const AdminVerificationModal = React.lazy(() => import('./components/AdminVerificationModal').then(m => ({ default: m.AdminVerificationModal })));
const EmailVerificationModal = React.lazy(() => import('./components/EmailVerificationModal').then(m => ({ default: m.EmailVerificationModal })));
const InfoModal = React.lazy(() => import('./components/InfoModal').then(m => ({ default: m.InfoModal })));
const WorkspaceCompareModal = React.lazy(() => import('./components/compare/WorkspaceCompareModal').then(m => ({ default: m.WorkspaceCompareModal })));
const DownloadAppModal = React.lazy(() => import('./components/DownloadAppModal').then(m => ({ default: m.DownloadAppModal })));
const AiAssistantModal = React.lazy(() => import('./components/AiAssistantModal').then(m => ({ default: m.AiAssistantModal })));

const ViewLoadingFallback = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07383D] text-[#FFFFFF] px-6 select-none overflow-hidden">
    {/* Ambient radial lighting glow */}
    <div className="absolute w-[min(90vw,720px)] h-[min(90vw,720px)] bg-gradient-to-tr from-[#006B70]/35 via-[#14BEB8]/20 to-transparent blur-3xl rounded-full pointer-events-none" />

    {/* Primary Visual Focus: Full OFIS Logo */}
    <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4 text-center">
      <img 
        src="/ofis-logo-dark.svg" 
        alt="OFIS — Nigeria's Physical Space Network" 
        className="w-[min(88vw,760px)] max-h-[42vh] object-contain drop-shadow-[0_0_24px_rgba(20,190,184,0.25)]"
      />

      {/* Subtle, sleek loading indicator without cluttering the screen */}
      <div className="w-8 h-8 border-[2.5px] border-[#14BEB8]/30 border-t-[#14BEB8] rounded-full animate-spin mt-9 shadow-[0_0_12px_rgba(20,190,184,0.3)]" />
    </div>
  </div>
);

export const App: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
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
      case 'payment_result':
        return <PaymentResultView />;
      default:
        return <SpaceList />;
    }
  };

  const showFooter = currentView !== 'map';

  return (
    <div className="min-h-[100dvh] w-full max-w-full overflow-x-clip bg-[#FFF9F4] dark:bg-[#07383D] text-[#12383B] dark:text-[#FFFFFF] antialiased flex flex-col font-sans selection:bg-[#14BEB8] selection:text-white transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router with Suspense */}
      <main className={`flex-1 w-full max-w-full overflow-x-clip ${currentView === 'details' ? 'pb-0' : 'pb-[calc(76px+env(safe-area-inset-bottom,0px))] md:pb-0'}`}>
        <Suspense fallback={<ViewLoadingFallback />}>
          {renderCurrentView()}
        </Suspense>
      </main>

      {/* Global Responsive Footer */}
      {showFooter && <Footer />}

      {/* Comparison Floating Bar */}
      {currentUser.role !== 'host' && <CompareFloatingBar />}

      {/* Floating OFIS Assistant Button */}
      <AiFloatingButton />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Navigation & Global Modals (Lazily loaded to minimize upfront parsing) */}
      <OfisNavigationDrawer />
      <Suspense fallback={null}>
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
        <DownloadAppModal />
        <AiAssistantModal />
      </Suspense>
    </div>
  );
};

export default App;

