import React from 'react';
import { useOrder } from '../context/OrderContext';
import { MASCOT_LOGO_URL } from '../data/menuData';

export const Footer: React.FC = () => {
  const { tableNumber, setIsWaiterModalOpen } = useOrder();

  return (
    <footer className="w-full bg-[#ffffff] border-t border-[#D0E2FF] mt-10">
      <div className="w-full px-4 md:px-6 py-10 max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Brand Overview */}
        <div className="flex flex-col gap-2 max-w-sm">
          <div className="flex items-center gap-2">
            <img
              alt="Shi Boss Mascot Logo"
              className="h-8 w-auto object-contain"
              src={MASCOT_LOGO_URL}
            />
            <span className="font-bold text-base md:text-lg text-[#003d9b]">
              Kedai Susu Segar Shi Boss
            </span>
          </div>
          <p className="text-xs text-[#434654] leading-relaxed">
            Susu sapi segar murni berpadu dengan aneka racikan rasa legendaris dan camilan hangat renyah khas Nusantara untuk menemani santap santai di tempat.
          </p>
          <span className="text-xs text-[#bb0016] font-bold tracking-wide mt-1">
            Rasa Segar, Setiap Hari!
          </span>
        </div>

        {/* Location & Opening Hours */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-sm text-[#071747]">Lokasi Outlet Dine-In</span>
          <div className="flex items-start gap-1.5 text-[#434654] text-xs">
            <span className="material-symbols-outlined text-[#003d9b] text-[18px] mt-0.5">
              location_on
            </span>
            <span>
              Jl. Kaliurang KM 5.5, Sleman, Yogyakarta
              <br />
              <span className="text-[#737685] text-[10px]">(Outlet Utama Shi Boss)</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#434654] text-xs mt-1">
            <span className="material-symbols-outlined text-[#003d9b] text-[18px]">
              schedule
            </span>
            <span>Buka Setiap Hari: 10:00 - 22:00 WIB</span>
          </div>
        </div>

        {/* Dine-in Help & Socials */}
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-sm text-[#071747]">Bantuan Pelayan Meja</span>
          <div className="flex items-center gap-1.5 text-xs text-[#434654]">
            <span className="material-symbols-outlined text-[#bb0016] text-[18px]">
              support_agent
            </span>
            <span>Butuh bantuan di meja? Hubungi kasir/crew:</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 bg-[#ebedff] px-3 py-1.5 rounded-lg text-[#003d9b] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp: 0812-3456-7890</span>
            </div>
            <button
              onClick={() => setIsWaiterModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#faf8ff] border border-[#ffdad6] text-[#bb0016] text-xs font-bold hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
            >
              Panggil Crew
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              aria-label="Instagram"
              onClick={() => window.open('https://instagram.com', '_blank')}
              className="w-8 h-8 rounded-full bg-[#e4e7ff] flex items-center justify-center text-[#003d9b] hover:bg-[#003d9b] hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
            <button
              aria-label="Bagikan"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Kedai Susu Segar Shi Boss', url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Tautan kedai disalin ke clipboard!');
                }
              }}
              className="w-8 h-8 rounded-full bg-[#e4e7ff] flex items-center justify-center text-[#003d9b] hover:bg-[#003d9b] hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
            <button
              aria-label="Telepon"
              onClick={() => setIsWaiterModalOpen(true)}
              className="w-8 h-8 rounded-full bg-[#e4e7ff] flex items-center justify-center text-[#003d9b] hover:bg-[#003d9b] hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-[#e4e7ff] py-3 text-center text-xs text-[#737685]">
        © 2025 Kedai Susu Segar Shi Boss. Pesanan Dine-in Meja #{tableNumber}. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
};
