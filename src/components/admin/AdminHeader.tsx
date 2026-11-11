import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  CheckCircle2,
  ChevronDown,
  User,
  ShieldCheck,
  Lock,
  ExternalLink,
  Plus,
  QrCode,
  Layers,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminScreen } from '../../types/admin';

export const AdminHeader: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    setIsSidebarOpenMobile,
    currentUser,
    notifications,
    markNotificationsAsRead,
    openAddModal,
    logout,
  } = useAdmin();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumbs = () => {
    switch (currentScreen) {
      case 'dashboard':
        return { page: 'Dashboard', sub: 'Ringkasan operasional dan antrean hari ini' };
      case 'menu':
        return { page: 'Manajemen Menu', sub: 'Katalog 91 menu aktif, harga, dan ketersediaan stok' };
      case 'orders':
        return { page: 'Pesanan Dine-In', sub: 'Daftar transaksi meja aktif dan alur dapur' };
      case 'qris':
        return { page: 'Pembayaran QRIS', sub: 'Verifikasi manual mutasi perbankan non-tunai' };
      case 'states':
        return { page: 'Status Sistem & UI', sub: 'Inspeksi tampilan error, loading, dan data kosong' };
      default:
        return { page: 'Dashboard', sub: '' };
    }
  };

  const { page, sub } = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Screen Selector for fast testing */}
      <div className="bg-[#faf8ff] border-b border-blue-100/60 px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-[#0052cc] uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
            Navigasi Cepat Prototipe
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setCurrentScreen('login')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              currentScreen === 'login'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            1. Login
          </button>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              currentScreen === 'dashboard'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            2. Dashboard
          </button>
          <button
            onClick={() => setCurrentScreen('menu')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              currentScreen === 'menu'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            3. Menu (91)
          </button>
          <button
            onClick={() => openAddModal()}
            className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3 text-[#0052cc]" />
            <span>4. Tambah Menu</span>
          </button>
          <button
            onClick={() => setCurrentScreen('orders')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              currentScreen === 'orders'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            5. Pesanan
          </button>
          <button
            onClick={() => setCurrentScreen('qris')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              currentScreen === 'qris'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            6. QRIS
          </button>
          <button
            onClick={() => setCurrentScreen('states')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              currentScreen === 'states'
                ? 'bg-[#0052cc] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            7. UI States
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Hamburger & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsSidebarOpenMobile(true)}
            className="lg:hidden p-2 text-slate-600 hover:text-[#071747] hover:bg-slate-100 rounded-lg shrink-0"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Shiboss Admin</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#0052cc] font-semibold">{page}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#071747] tracking-tight truncate">
              {page}
            </h1>
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Contextual Quick Action */}
          {currentScreen === 'menu' && (
            <button
              onClick={openAddModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0040a2] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Menu</span>
            </button>
          )}

          {currentScreen === 'dashboard' && (
            <button
              onClick={() => setCurrentScreen('qris')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-amber-50 border border-amber-300 hover:bg-amber-100 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-700" />
              <span>Verifikasi QRIS</span>
            </button>
          )}

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen && unreadCount > 0) {
                  markNotificationsAsRead();
                }
              }}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Pemberitahuan operasional"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-600 rounded-full border-2 border-white" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-[#071747]">Pemberitahuan Sistem</span>
                  <span className="text-[11px] text-slate-500">{notifications.length} Terkini</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setIsNotifOpen(false);
                        if (notif.title.includes('QRIS')) setCurrentScreen('qris');
                        else setCurrentScreen('orders');
                      }}
                      className="p-3 hover:bg-[#faf8ff] cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-slate-800 leading-snug">
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0052cc] text-xs font-bold flex items-center justify-center shrink-0">
                RP
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-[#071747] leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">Kasir Siang</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="font-bold text-[#071747]">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                    Shift Aktif: 15:00 - 22:00
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setCurrentScreen('dashboard');
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Hak Akses: {currentUser.role}</span>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-700 font-medium flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-rose-500" />
                  <span>Kunci & Keluar Sesi</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
