import React from 'react';
import { useOrder } from '../context/OrderContext';
import { MASCOT_LOGO_URL, formatRupiah } from '../data/menuData';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    tableNumber,
    setIsTableModalOpen,
    cartCount,
    cartTotal,
    searchQuery,
    setSearchQuery,
  } = useOrder();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (currentView !== 'menu' && e.target.value.trim().length > 0) {
      setCurrentView('menu');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ffffff] border-b border-[#D0E2FF] shadow-[0_4px_16px_rgba(0,82,204,0.06)]">
      <div className="h-20 w-full px-4 md:px-6 max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Lockup */}
        <button
          onClick={() => setCurrentView('beranda')}
          className="flex items-center gap-3 shrink-0 text-left cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            alt="Shi Boss Mascot Logo"
            className="h-8 md:h-9 w-auto object-contain"
            src={MASCOT_LOGO_URL}
          />
          <div className="flex flex-col">
            <span className="font-bold text-[#003d9b] text-base md:text-lg leading-tight tracking-tight">
              Kedai Susu Segar Shi Boss
            </span>
            <span className="text-[10px] md:text-xs text-[#bb0016] tracking-wide uppercase font-bold">
              Susu Segar, Rasa Juara!
            </span>
          </div>
        </button>

        {/* Center Nav & Table Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          <nav className="flex items-center bg-[#f3f2ff] p-1 rounded-full border border-[#dce1ff]">
            <button
              onClick={() => setCurrentView('beranda')}
              className={`px-4 py-1.5 rounded-full transition-colors font-semibold text-sm ${
                currentView === 'beranda'
                  ? 'bg-[#003d9b] text-white shadow-sm'
                  : 'text-[#434654] hover:bg-[#ebedff] hover:text-[#071747]'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => setCurrentView('menu')}
              className={`px-4 py-1.5 rounded-full transition-colors font-semibold text-sm ${
                currentView === 'menu'
                  ? 'bg-[#003d9b] text-white shadow-sm'
                  : 'text-[#434654] hover:bg-[#ebedff] hover:text-[#071747]'
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setCurrentView('keranjang')}
              className={`px-4 py-1.5 rounded-full transition-colors font-semibold text-sm ${
                currentView === 'keranjang'
                  ? 'bg-[#003d9b] text-white shadow-sm'
                  : 'text-[#434654] hover:bg-[#ebedff] hover:text-[#071747]'
              }`}
            >
              Keranjang
            </button>
            <button
              onClick={() => setCurrentView('pesanan')}
              className={`px-4 py-1.5 rounded-full transition-colors font-semibold text-sm ${
                currentView === 'pesanan'
                  ? 'bg-[#003d9b] text-white shadow-sm'
                  : 'text-[#434654] hover:bg-[#ebedff] hover:text-[#071747]'
              }`}
            >
              Pesanan
            </button>
          </nav>

        </div>

        {/* Right Actions: Search, Cart, Avatar */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Quick Search */}
          <div className="hidden sm:flex items-center bg-[#f3f2ff] border border-[#c3c6d6] rounded-full px-3 py-1.5 w-40 xl:w-60 focus-within:border-[#003d9b] focus-within:bg-white transition-all">
            <span className="material-symbols-outlined text-[#737685] text-[18px] mr-1.5">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari menu favoritmu..."
              className="bg-transparent border-none outline-none text-xs text-[#071747] placeholder:text-[#737685] w-full"
            />
          </div>

          {/* Cart Pill */}
          <button
            onClick={() => setCurrentView('keranjang')}
            className="flex items-center gap-1.5 bg-[#bb0016] hover:bg-[#e32128] transition-colors text-white px-3 md:px-4 py-1.5 rounded-full shadow-sm shrink-0 cursor-pointer active:scale-95"
            aria-label="Buka Keranjang"
          >
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#bb0016] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs md:text-sm font-bold hidden sm:inline ml-1">
              {formatRupiah(cartTotal)}
            </span>
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => setIsTableModalOpen(true)}
            className="w-8 h-8 rounded-full bg-[#f3f2ff] text-[#003d9b] border border-[#dce1ff] flex items-center justify-center shrink-0 shadow-xs cursor-pointer hover:bg-[#e4e7ff] transition-colors"
            title={`Pelanggan Meja #${tableNumber}`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-between border-t border-[#ebedff] px-3 py-1.5 bg-[#f3f2ff]/80 backdrop-blur">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCurrentView('beranda')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              currentView === 'beranda'
                ? 'bg-[#003d9b] text-white'
                : 'text-[#434654] hover:bg-[#ebedff]'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setCurrentView('menu')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              currentView === 'menu'
                ? 'bg-[#003d9b] text-white'
                : 'text-[#434654] hover:bg-[#ebedff]'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setCurrentView('keranjang')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              currentView === 'keranjang'
                ? 'bg-[#003d9b] text-white'
                : 'text-[#434654] hover:bg-[#ebedff]'
            }`}
          >
            Keranjang ({cartCount})
          </button>
          <button
            onClick={() => setCurrentView('pesanan')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              currentView === 'pesanan'
                ? 'bg-[#003d9b] text-white'
                : 'text-[#434654] hover:bg-[#ebedff]'
            }`}
          >
            Pesanan
          </button>
        </div>

        <button
          onClick={() => setIsTableModalOpen(true)}
          className="inline-flex items-center gap-1 bg-white border border-[#0052cc] px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#003d9b] shrink-0"
        >
          <span className="material-symbols-outlined text-[14px]">table_restaurant</span>
          <span>#{tableNumber}</span>
        </button>
      </div>
    </header>
  );
};
