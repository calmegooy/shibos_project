import React from 'react';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../data/menuData';

export const HomeView: React.FC = () => {
  const { setCurrentView, tableNumber, addToCart, setCustomizeModalItem, menuItems, menuLoadStatus } = useOrder();

  const popularItems = menuItems.filter((item) => item.isPopular);
  const featuredItems = ['susu-cokelat', 'susu-original', 'susu-strawberry']
    .map((id) => menuItems.find((item) => item.id === id))
    .filter((item) => item !== undefined);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-cream-canvas px-4 md:px-6 py-8 lg:py-20">
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Column: Copy & Badges */}
          <div className="flex-1 flex flex-col items-start gap-4">
            {/* Live Dine-in Table Notice */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-xs text-[#003d9b] text-xs md:text-sm font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bb0016]"></span>
              <span className="font-bold">Meja #{tableNumber}</span>
              <span className="text-[#c3c6d6]">•</span>
              <span className="text-[#434654] font-medium">
                Pesan di meja, pesanan diantar pramusaji
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] md:text-xs text-[#bb0016] uppercase tracking-widest font-extrabold bg-[#ffdad6]/60 px-3 py-1 rounded-full self-start">
                Susu Segar, Rasa Juara!
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#003d9b] leading-tight tracking-tight">
                Rasa Segar,
                <br />
                Setiap Hari!
              </h1>
            </div>

            <p className="text-sm md:text-base text-[#434654] max-w-xl leading-relaxed">
              Nikmati kemurnian 100% susu sapi segar pilihan, racikan rasa istimewa, camilan renyah, dan makanan hangat langsung di meja santapmu.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentView('menu')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#003d9b] hover:bg-[#0052cc] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Lihat Menu Lengkap</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>

            {/* Dine-in Quick Facilities */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-3 text-[#434654] text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#003d9b] text-[18px]">wifi</span>
                <span>Wi-Fi Kencang</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#003d9b] text-[18px]">power</span>
                <span>Stopkontak Meja</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#bb0016] text-[18px]">verified</span>
                <span>100% Higienis</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Trio */}
          <div className="flex-1 w-full relative">
            <div className="relative bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row gap-4 items-center justify-center border border-[#dce1ff]">
              {featuredItems.map((item) => (
                <button key={item.id} type="button" onClick={() => setCustomizeModalItem(item)} className="group relative flex-1 flex flex-col items-center bg-[#f3f2ff] p-3 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg w-full cursor-pointer">
                  <div className="relative w-28 h-36 mb-2 overflow-hidden rounded-xl bg-slate-100">
                    <img className="h-full w-full object-cover group-hover:scale-105 transition-transform" alt={item.name} src={item.image} />
                  </div>
                  <span className="font-bold text-sm text-[#071747] text-center line-clamp-1">{item.name}</span>
                  <span className="text-xs font-bold text-[#003d9b] mt-0.5">{formatRupiah(item.price)}</span>
                </button>
              ))}
              {menuLoadStatus === 'loading' && <p role="status" className="text-sm text-slate-500">Memuat menu...</p>}
              {(menuLoadStatus === 'error' || menuLoadStatus === 'unavailable') && <p role="alert" className="text-sm text-slate-600">Menu belum tersedia. Silakan coba lagi nanti.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Shortcuts */}
      <section className="w-full px-4 md:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-[#071747]">Kategori Menu</h2>
          </div>
          <button
            onClick={() => setCurrentView('menu')}
            className="inline-flex items-center gap-1 text-[#003d9b] text-sm font-bold hover:underline cursor-pointer"
          >
            <span>Semua Kategori</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cat 1: Susu Segar */}
          <div
            onClick={() => setCurrentView('menu')}
            className="group relative flex flex-col justify-between p-5 bg-white rounded-2xl shadow-xs hover:shadow-md border border-[#D0E2FF] transition-all duration-200 overflow-hidden cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-[#dae2ff] flex items-center justify-center text-[#003d9b] mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">local_cafe</span>
                </div>
                <span className="text-base font-bold text-[#071747] group-hover:text-[#003d9b] transition-colors">
                  Minuman Susu Segar
                </span>
                <p className="text-xs text-[#434654] mt-1 leading-relaxed">
                  Susu murni aneka rasa lezat, es cokelat pekat, &amp; es teh wangi.
                </p>
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-inner">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  alt="Minuman Susu Segar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCnt2zXAdSjUsp_ZRacQIpj1wr3lZGBcA4tek2cV844gCV-Q5vjsHjOriaisYuiRD1jHNrxRGz85MPMdrHSoxzp4uGkrbF3hmyHUOGGx2f21RewSlvFGjo1Ct4h9gFM6JRyoutIXXierZUIC6t3yeTF7GclqM7dEhHWB9EWJoiKv5eIS4XPjSbfcX6fN8-ZA5wVHJeGairjm5oSGfZFSDI2eN-cRKbmjR1Dedrj0urd8_97jzJIX2rQw"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-4 bg-[#f3f2ff]/60 -mx-5 -mb-5 px-5 py-2.5">
              <span className="text-xs text-[#003d9b] font-bold">10+ Varian Rasa Segar</span>
              <span className="material-symbols-outlined text-[#003d9b] text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Cat 2: Snack & Camilan */}
          <div
            onClick={() => setCurrentView('menu')}
            className="group relative flex flex-col justify-between p-5 bg-white rounded-2xl shadow-xs hover:shadow-md border border-[#D0E2FF] transition-all duration-200 overflow-hidden cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-[#ffdad6] flex items-center justify-center text-[#bb0016] mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">bakery_dining</span>
                </div>
                <span className="text-base font-bold text-[#071747] group-hover:text-[#bb0016] transition-colors">
                  Snack &amp; Camilan
                </span>
                <p className="text-xs text-[#434654] mt-1 leading-relaxed">
                  Kentang goreng renyah, roti bakar lumer gurih, sosis, &amp; cireng salju.
                </p>
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-inner">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  alt="Snack Camilan"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQNLxoxw8QD1En1DW4b9V6JA6MLRijT9QcVB6Zen-IV0S7jT6Z3tvIkKXazaMAIlQ_V5fZY2tEUHDb4PhhpQBaLmgY1ypAa8aAmsyYdtVpk7pZOMBj9CDLuKOzrJXAZIWkP4keJSiFitrhqEeDHuK2jGsyOKu2eOdZEV-sySNp3R5Pt-QyV9czyZ9JGToqGx-sWHZ3VQ4pD0T2-JXaZ9BbOt9D1bWvmtAK3gWWBLDDP_6tztl63Hnskg"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-4 bg-[#f3f2ff]/60 -mx-5 -mb-5 px-5 py-2.5">
              <span className="text-xs text-[#bb0016] font-bold">9+ Pilihan Kudapan</span>
              <span className="material-symbols-outlined text-[#bb0016] text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          {/* Cat 3: Makanan Berat */}
          <div
            onClick={() => setCurrentView('menu')}
            className="group relative flex flex-col justify-between p-5 bg-white rounded-2xl shadow-xs hover:shadow-md border border-[#D0E2FF] transition-all duration-200 overflow-hidden cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-[#dce1ff] flex items-center justify-center text-[#003d9b] mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">dinner_dining</span>
                </div>
                <span className="text-base font-bold text-[#071747] group-hover:text-[#003d9b] transition-colors">
                  Makanan Berat
                </span>
                <p className="text-xs text-[#434654] mt-1 leading-relaxed">
                  Nasi ayam crispy pedas gurih, chicken katsu, &amp; rice bowl mantap.
                </p>
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-inner">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  alt="Makanan Berat"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbwwH6Zgq1ByfRRw1G_VSuaWGe9VFk2PtRJoaxgTB3GTHa0yf-I5il5KCIJRLoE_Z-081BGSDBLRS6JfLBzv7J3gVO3Osi582oPJmUWvfKRv4jw0BtzZCswpQaYOucZ1j38nYKQfzv02JKbrOj6o_X_3JAE3fPk0xoNfVfK_ehXmmchXp9TRNzSc_AuCUlFXUMJdU0mMPtXUyaVQAG3LF4Zb3BsOE63XvyrXdaUh2krsC_8tKSfMvxMQ"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-4 bg-[#f3f2ff]/60 -mx-5 -mb-5 px-5 py-2.5">
              <span className="text-xs text-[#003d9b] font-bold">6+ Menu Kenyang Mantap</span>
              <span className="material-symbols-outlined text-[#003d9b] text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Menu Grid (Menu Favorit) */}
      <section className="w-full px-4 md:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[#bb0016] text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">thumb_up</span>
              <span>Paling Sering Dipesan</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#071747]">Menu Favorit Shi Boss</h2>
          </div>
          <p className="text-xs text-[#434654] max-w-xs sm:text-right">
            Racikan murni dan olahan lezat terfavorit oleh tamu kedai.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-xs hover:shadow-md border border-[#D0E2FF] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3 bg-[#f3f2ff]">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={item.name}
                    src={item.image}
                  />
                  {item.badge && (
                    <span className="absolute top-2 left-2 bg-[#003d9b] text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-sm md:text-base text-[#071747]">{item.name}</span>
                  <span className="text-xs text-[#434654] line-clamp-1">{item.description}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#ebedff]">
                <span className="text-base font-extrabold text-[#003d9b]">
                  {formatRupiah(item.price)}
                </span>
                <div className="flex items-center gap-2">
                  {item.category === 'minuman' ? (
                    <button
                      onClick={() => setCustomizeModalItem(item)}
                      aria-label={`Tambah ${item.name}`}
                      className="inline-flex items-center gap-1 bg-[#bb0016] hover:bg-[#e32128] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs transition-transform active:scale-90 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Tambah</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(item, 1)}
                      aria-label={`Tambah ${item.name}`}
                      className="inline-flex items-center gap-1 bg-[#bb0016] hover:bg-[#e32128] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs transition-transform active:scale-90 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Tambah</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Browse Full Menu Trigger */}
        <div className="w-full flex justify-center mt-8">
          <button
            onClick={() => setCurrentView('menu')}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#f3f2ff] text-[#003d9b] px-6 py-3 rounded-full text-sm font-bold shadow-xs border border-[#D0E2FF] transition-all hover:shadow-md cursor-pointer"
          >
            <span>Lihat Semua Menu (20+ Varian)</span>
            <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
          </button>
        </div>
      </section>

      {/* How Dine-In Ordering Works at Table */}
      <section className="w-full px-4 md:px-6 py-8 max-w-7xl mx-auto">
        <div className="bg-[#f3f2ff] rounded-3xl p-6 md:p-8 border border-[#dce1ff]">
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="text-xs text-[#bb0016] font-bold uppercase tracking-wider">
              Langkah Mudah
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-[#071747] mt-1">
              Santai di Meja #{tableNumber}
            </h3>
            <p className="text-xs text-[#434654] mt-1">
              Tak perlu antre di kasir. Nikmati layanan cepat langsung ke bangkumu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-xs border border-[#D0E2FF]">
              <div className="w-10 h-10 rounded-full bg-[#003d9b] text-white text-base font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#071747]">Pilih Menu Favorit</span>
                <p className="text-xs text-[#434654] mt-1">
                  Eksplorasi susu segar murni, cemilan hangat, atau paket hemat.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-xs border border-[#D0E2FF]">
              <div className="w-10 h-10 rounded-full bg-[#003d9b] text-white text-base font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#071747]">Kirim Pesanan Meja</span>
                <p className="text-xs text-[#434654] mt-1">
                  Konfirmasi pesanan tanpa ribet mengetik ulang alamat pengantaran.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-xs border border-[#D0E2FF]">
              <div className="w-10 h-10 rounded-full bg-[#bb0016] text-white text-base font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#071747]">Pesanan Diantar</span>
                <p className="text-xs text-[#434654] mt-1">
                  Pramusaji mengantarkan hidangan segar langsung ke meja #{tableNumber}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
