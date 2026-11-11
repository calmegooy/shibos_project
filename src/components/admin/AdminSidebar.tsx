import React, { useState } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Receipt,
  QrCode,
  LogOut,
  X,
  Layers,
  Sparkles,
  Store,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { MASCOT_LOGO_URL } from '../../data/menuData';
import { AdminModal } from './AdminModal';

export const AdminSidebar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    isSidebarOpenMobile,
    setIsSidebarOpenMobile,
    currentUser,
    logout,
    pendingOrdersCount,
    pendingQrisCount,
    menuItems,
    setViewMode,
  } = useAdmin();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'menu',
      label: 'Manajemen Menu',
      icon: UtensilsCrossed,
      badge: menuItems.length.toString(),
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'orders',
      label: 'Pesanan',
      icon: Receipt,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} Baru` : null,
      badgeColor: 'bg-amber-100 text-amber-900 font-semibold',
    },
    {
      id: 'qris',
      label: 'Pembayaran QRIS',
      icon: QrCode,
      badge: pendingQrisCount > 0 ? `${pendingQrisCount}` : null,
      badgeColor: 'bg-red-100 text-red-700 font-bold',
    },
    {
      id: 'states',
      label: 'Status Sistem & UI',
      icon: Layers,
      badge: 'Screen 7',
      badgeColor: 'bg-blue-100 text-[#0052cc]',
    },
  ];

  const handleNavClick = (screenId: any) => {
    setCurrentScreen(screenId);
    setIsSidebarOpenMobile(false);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-[#071747]/50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header & Shift Badge */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center p-1 overflow-hidden shrink-0">
                <img
                  src={MASCOT_LOGO_URL}
                  alt="Logo Shiboss"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to milk glass icon
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#071747] tracking-tight text-base">
                    SHIBOSS
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-[#0052cc]">
                    Admin
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Kedai Susu Segar</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpenMobile(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Tutup navigasi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Shift / Branch Info */}
          <div className="px-4 py-2.5 mx-3 mt-3 rounded-lg bg-[#faf8ff] border border-blue-100/70">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-0.5">
              <span className="font-semibold text-[#071747] truncate">{currentUser.outlet}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">{currentUser.shift}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Menu Utama
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0052cc] text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-[#071747]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Customer Dine-in Mode Shortcut */}
          <div className="px-3 mt-2">
            <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Tautan Eksternal
            </div>
            <button
              onClick={() => {
                setViewMode('customer');
                setIsSidebarOpenMobile(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-[#0052cc] transition-colors border border-transparent hover:border-blue-200"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-[#0052cc]" />
                <span>Web Pesanan Pelanggan</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Bottom: Profile & Logout */}
        <div className="p-3 border-t border-slate-100 bg-[#faf8ff]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-full bg-blue-100 text-[#0052cc] font-bold text-xs flex items-center justify-center shrink-0">
                RP
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-bold text-[#071747] truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.role}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <AdminModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Keluar Sesi"
        description="Pastikan semua verifikasi pembayaran QRIS dan pesanan kasir telah selesai."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Anda sedang aktif pada <strong>{currentUser.shift}</strong>. Jika keluar, Anda harus memasukkan kredensial admin kembali.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmLogout}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      </AdminModal>
    </>
  );
};
