import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { LoginView } from './LoginView';
import { DashboardView } from './DashboardView';
import { MenuManagementView } from './MenuManagementView';
import { AddEditMenuModal } from './AddEditMenuModal';
import { OrderManagementView } from './OrderManagementView';
import { QrisVerificationView } from './QrisVerificationView';
import { StateShowcaseView } from './StateShowcaseView';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const AdminApp: React.FC = () => {
  const { currentScreen, isAuthenticated, adminToast, hideToast } = useAdmin();

  // If on login screen or not authenticated, render LoginView
  if (currentScreen === 'login' || !isAuthenticated) {
    return (
      <div className="font-sans antialiased text-[#071747]">
        <LoginView />
        {adminToast && (
          <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5">
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
                adminToast.type === 'error'
                  ? 'bg-rose-50 text-rose-900 border-rose-200'
                  : adminToast.type === 'info'
                  ? 'bg-blue-50 text-blue-900 border-blue-200'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              {adminToast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : adminToast.type === 'info' ? (
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{adminToast.message}</span>
              <button
                onClick={hideToast}
                className="ml-2 text-slate-400 hover:text-slate-600"
                aria-label="Tutup notifikasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-canvas text-heading-charcoal flex font-sans selection:bg-[#dae2ff] selection:text-[#001848]">
      {/* Desktop Persistent Sidebar / Mobile Drawer */}
      <AdminSidebar />

      {/* Main Content Area (offset by 256px on lg screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header Bar */}
        <AdminHeader />

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {currentScreen === 'dashboard' && <DashboardView />}
          {currentScreen === 'menu' && <MenuManagementView />}
          {currentScreen === 'orders' && <OrderManagementView />}
          {currentScreen === 'qris' && <QrisVerificationView />}
          {currentScreen === 'states' && <StateShowcaseView />}
        </main>
      </div>

      {/* Global Add/Edit Menu Modal */}
      <AddEditMenuModal />

      {/* Global Admin Toast Notifications */}
      {adminToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
              adminToast.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-rose-200'
                : adminToast.type === 'info'
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}
          >
            {adminToast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : adminToast.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{adminToast.message}</span>
            <button
              onClick={hideToast}
              className="ml-2 text-slate-400 hover:text-slate-600"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
