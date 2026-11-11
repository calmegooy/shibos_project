import React from 'react';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../data/menuData';

export const FloatingCartBar: React.FC = () => {
  const { currentView, setCurrentView, tableNumber, cartCount, cartTotal } = useOrder();

  // Show floating bar only on beranda and menu, and only when there are items in the cart
  if (cartCount === 0 || (currentView !== 'beranda' && currentView !== 'menu')) {
    return null;
  }

  return (
    <aside
      aria-label="Ringkasan Pesanan Meja"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-40 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="bg-[#202d5d] text-[#eff0ff] rounded-full p-2 px-4 shadow-2xl flex items-center justify-between gap-3 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-full bg-[#bb0016] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span className="absolute -top-1 -right-1 bg-white text-[#bb0016] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
              {cartCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#dce1ff] font-medium">
              Meja #{tableNumber} • {cartCount} Menu
            </span>
            <span className="text-sm font-extrabold text-white">
              {formatRupiah(cartTotal)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('keranjang')}
          className="inline-flex items-center gap-1.5 bg-[#bb0016] hover:bg-[#e32128] text-white px-4 py-2 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-sm cursor-pointer"
        >
          <span>Lihat Pesanan</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </aside>
  );
};
