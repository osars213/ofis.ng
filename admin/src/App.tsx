import React, { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminTab } from './types';
import { AdminLayout } from './components/AdminLayout';
import { SignInView } from './components/SignInView';
import { MfaChallengeModal } from './components/MfaChallengeModal';
import { OverviewView } from './components/OverviewView';
import { SpacesManagementView } from './components/SpacesManagementView';
import { BookingsManagementView } from './components/BookingsManagementView';
import { PaymentsManagementView } from './components/PaymentsManagementView';
import { UsersManagementView } from './components/UsersManagementView';
import { AuditLogView } from './components/AuditLogView';
import { Loader2 } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#052427] flex items-center justify-center text-[#14BEB8]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <SignInView />
        <MfaChallengeModal />
      </>
    );
  }

  return (
    <AdminLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === 'overview' && <OverviewView onNavigate={setCurrentTab} />}
      {currentTab === 'spaces' && <SpacesManagementView />}
      {currentTab === 'bookings' && <BookingsManagementView />}
      {currentTab === 'payments' && <PaymentsManagementView />}
      {currentTab === 'users' && <UsersManagementView />}
      {currentTab === 'audit_log' && <AuditLogView />}
    </AdminLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AdminAuthProvider>
      <DashboardContent />
    </AdminAuthProvider>
  );
};

export default App;
