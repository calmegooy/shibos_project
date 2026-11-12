import React, { lazy, Suspense } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { LoginView } from './LoginView';
import { AddEditMenuModal } from './AddEditMenuModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const DashboardView = lazy(() => import('./DashboardView').then((module) => ({ default: module.DashboardView })));
const MenuManagementView = lazy(() => import('./MenuManagementView').then((module) => ({ default: module.MenuManagementView })));
const OrderManagementView = lazy(() => import('./OrderManagementView').then((module) => ({ default: module.OrderManagementView })));
const QrisVerificationView = lazy(() => import('./QrisVerificationView').then((module) => ({ default: module.QrisVerificationView })));

export const AdminApp: React.FC = () => {
  const { currentScreen, isAuthenticated, authStatus, adminToast, hideToast } = useAdmin();
  const activeScreen = currentScreen === 'dashboard' ? <DashboardView />
    : currentScreen === 'menu' ? <MenuManagementView />
    : currentScreen === 'orders' ? <OrderManagementView />
    : currentScreen === 'qris' ? <QrisVerificationView />
    : null;

  if (currentScreen !== 'login' && authStatus === 'loading') {
    return <div className="min-h-screen grid place-items-center text-sm text-slate-500">Memeriksa sesi admin...</div>;
  }
  if (currentScreen !== 'login' && authStatus === 'unauthenticated') return null;

  if (authStatus === 'denied' && currentScreen !== 'login') {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-6 text-center">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Akses admin ditolak</h1>
          <p className="mt-2 text-sm text-slate-600">Akun ini tidak terdaftar sebagai admin Shiboss.</p>
          <a className="mt-5 inline-flex rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white" href="/admin/login">Kembali ke login</a>
        </div>
      </main>
    );
  }

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
      {/* Main content and interactive account controls; Astro owns admin navigation. */}
      <div className="flex min-h-screen flex-1 flex-col min-w-0">
        {/* Header Bar */}
        <AdminHeader />

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <Suspense fallback={<div className="py-12 text-sm text-slate-500">Memuat dashboard...</div>}>
            {activeScreen}
          </Suspense>
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
