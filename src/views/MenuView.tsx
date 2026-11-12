import React, { useState, useMemo } from 'react';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../data/menuData';
import { MenuCategory, MenuItem } from '../types';

export const MenuView: React.FC = () => {
  const {
    tableNumber,
    cartItems,
    addToCart,
    updateCartQuantity,
    setCustomizeModalItem,
    searchQuery,
    setSearchQuery,
    menuItems,
    menuLoadStatus,
  } = useOrder();

  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [sortBy, setSortBy] = useState<'populer' | 'termurah' | 'termahal'>('populer');

  // Filter & sort
  const filteredItems = useMemo(() => {
    let result = [...menuItems];

    // Search query filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Sort
    if (sortBy === 'termurah') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'termahal') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Populer
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return result;
  }, [menuItems, searchQuery, activeCategory, sortBy]);

  // Group items by category if 'all' is active
  const minumanItems = useMemo(() => filteredItems.filter((i) => i.category === 'minuman'), [filteredItems]);
  const snackItems = useMemo(() => filteredItems.filter((i) => i.category === 'snack'), [filteredItems]);
  const makananItems = useMemo(() => filteredItems.filter((i) => i.category === 'makanan'), [filteredItems]);

  // Helper to find total count of a menu item in cart
  const getItemCartQuantity = (itemId: string) => {
    return cartItems
      .filter((ci) => ci.item.id === itemId)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const getFirstCartItemId = (itemId: string) => {
    return cartItems.find((ci) => ci.item.id === itemId)?.cartItemId;
  };

  const renderCard = (item: MenuItem) => {
    const qtyInCart = getItemCartQuantity(item.id);
    const cartItemId = getFirstCartItemId(item.id);

    return (
      <article
        key={item.id}
        className="menu-card bg-white rounded-xl p-3.5 shadow-xs hover:shadow-md border border-[#D0E2FF] transition-all flex flex-col justify-between group"
      >
        <div className="flex flex-col gap-2">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#f3f2ff]">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              alt={item.name}
              src={item.image}
            />
            {item.badge && (
              <div className="absolute top-2 left-2 bg-[#bb0016] text-white px-2 py-0.5 rounded-full text-[10px] tracking-wide font-bold shadow-xs">
                {item.badge}
              </div>
            )}
            {item.category === 'minuman' && (
              <button
                onClick={() => setCustomizeModalItem(item)}
                className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-[#003d9b] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs hover:bg-[#003d9b] hover:text-white transition-colors"
                title="Kustomisasi Rasa"
              >
                Opsi Rasa
              </button>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm text-[#071747] line-clamp-1">{item.name}</h3>
            <p className="text-xs text-[#434654] line-clamp-2 mt-0.5">{item.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#ebedff]">
          <span className="text-base font-extrabold text-[#003d9b]">
            {formatRupiah(item.price)}
          </span>

          {qtyInCart > 0 && cartItemId ? (
            <div className="flex items-center bg-[#e4e7ff] rounded-full px-1 py-0.5">
              <button
                onClick={() => updateCartQuantity(cartItemId, -1)}
                className="w-6 h-6 rounded-full bg-white text-[#003d9b] flex items-center justify-center font-bold text-sm shadow-xs hover:bg-[#003d9b] hover:text-white transition-colors cursor-pointer"
                type="button"
              >
                -
              </button>
              <span className="text-xs font-bold text-[#071747] w-6 text-center">
                {qtyInCart}
              </span>
              <button
                onClick={() => updateCartQuantity(cartItemId, 1)}
                className="w-6 h-6 rounded-full bg-[#003d9b] text-white flex items-center justify-center font-bold text-sm shadow-xs hover:bg-[#0052cc] transition-colors cursor-pointer"
                type="button"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (item.category === 'minuman') {
                  setCustomizeModalItem(item);
                } else {
                  addToCart(item, 1);
                }
              }}
              className="inline-flex items-center gap-1 bg-[#bb0016] hover:bg-[#e32128] transition-colors text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs active:scale-90 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Tambah</span>
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Interactive Dine-In Filter Bar & Header */}
      <section className="w-full bg-[#f3f2ff] px-4 md:px-6 py-8 border-b border-[#D0E2FF]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Context & Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-1.5 text-[#003d9b] text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
                <span>Katalog Resmi Meja #{tableNumber}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-[#071747] tracking-tight">
                Menu Shi Boss
              </h1>
              <p className="text-xs md:text-sm text-[#434654] max-w-xl">
                Pilih favoritmu dan nikmati kesegarannya langsung di Meja #{tableNumber}! Pesanan langsung terkirim ke dapur.
              </p>
            </div>
          </div>

          {/* Search & Sorting Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
            <div className="md:col-span-8 flex items-center bg-white rounded-xl px-4 py-2.5 shadow-xs border border-[#c3c6d6] focus-within:border-[#003d9b] focus-within:shadow-sm transition-shadow">
              <span className="material-symbols-outlined text-[#737685] text-[22px] mr-2">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu favoritmu (susu, cokelat, roti, ayam, nasi)..."
                className="w-full bg-transparent border-none outline-none text-xs md:text-sm text-[#071747] placeholder:text-[#737685]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#737685] hover:text-[#071747] text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <div className="md:col-span-4 flex items-center bg-white rounded-xl px-4 py-2.5 shadow-xs border border-[#c3c6d6] relative">
              <span className="material-symbols-outlined text-[#737685] text-[20px] mr-2">
                sort
              </span>
              <label className="sr-only" htmlFor="sortDropdown">
                Urutkan Menu
              </label>
              <select
                id="sortDropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-transparent text-xs md:text-sm font-semibold text-[#071747] outline-none cursor-pointer pr-6 appearance-none"
              >
                <option value="populer">Terpopuler</option>
                <option value="termurah">Harga Terendah</option>
                <option value="termahal">Harga Tertinggi</option>
              </select>
              <span className="material-symbols-outlined text-[#737685] pointer-events-none absolute right-4 text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#003d9b] text-white shadow-sm'
                  : 'bg-white text-[#071747] hover:bg-[#e4e7ff] border border-[#D0E2FF]'
              }`}
            >
              <span>Semua</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-[#ebedff] text-[#003d9b]'
                }`}
              >
                {menuItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('minuman')}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === 'minuman'
                  ? 'bg-[#003d9b] text-white shadow-sm'
                  : 'bg-white text-[#071747] hover:bg-[#e4e7ff] border border-[#D0E2FF]'
              }`}
            >
              <span>Minuman Susu</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeCategory === 'minuman'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#ebedff] text-[#003d9b]'
                }`}
              >
                {menuItems.filter((i) => i.category === 'minuman').length}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('snack')}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === 'snack'
                  ? 'bg-[#003d9b] text-white shadow-sm'
                  : 'bg-white text-[#071747] hover:bg-[#e4e7ff] border border-[#D0E2FF]'
              }`}
            >
              <span>Snack &amp; Camilan</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeCategory === 'snack'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#ebedff] text-[#003d9b]'
                }`}
              >
                {menuItems.filter((i) => i.category === 'snack').length}
              </span>
            </button>

            <button
              onClick={() => setActiveCategory('makanan')}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === 'makanan'
                  ? 'bg-[#003d9b] text-white shadow-sm'
                  : 'bg-white text-[#071747] hover:bg-[#e4e7ff] border border-[#D0E2FF]'
              }`}
            >
              <span>Makanan Berat</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeCategory === 'makanan'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#ebedff] text-[#003d9b]'
                }`}
              >
                {menuItems.filter((i) => i.category === 'makanan').length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {menuLoadStatus !== 'ready' && (
        <div role={menuLoadStatus === 'loading' ? 'status' : 'alert'} className="mx-auto mt-6 max-w-7xl rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
          {menuLoadStatus === 'loading' && 'Memuat menu terbaru...'}
          {menuLoadStatus === 'unavailable' && 'Katalog belum tersedia: koneksi Supabase belum dikonfigurasi.'}
          {menuLoadStatus === 'error' && 'Menu gagal dimuat dari Supabase. Coba muat ulang halaman.'}
        </div>
      )}

      {/* Main Catalog Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-10 w-full mb-28">
        {/* If searching or category is active, display filtered or sectioned view */}
        {menuLoadStatus === 'ready' && activeCategory === 'all' && !searchQuery ? (
          <>
            {/* Section 1: MINUMAN SUSU SEGAR */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#ebedff]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#dae2ff] flex items-center justify-center text-[#003d9b]">
                    <span className="material-symbols-outlined text-[18px]">local_cafe</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg md:text-xl text-[#071747]">
                      Minuman Susu Segar
                    </h2>
                    <p className="text-xs text-[#434654]">
                      Susu sapi murni dingin atau hangat langsung dari peternakan lokal
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#003d9b] font-bold hidden sm:inline-block">
                  {minumanItems.length} Varian Pilihan
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {minumanItems.map(renderCard)}
              </div>
            </section>

            {/* Section 2: SNACK & CAMILAN */}
            <section className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#ebedff]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#bb0016]">
                    <span className="material-symbols-outlined text-[18px]">bakery_dining</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg md:text-xl text-[#071747]">
                      Snack &amp; Camilan
                    </h2>
                    <p className="text-xs text-[#434654]">
                      Kudapan hangat renyah dan roti bakar lezat pendamping susu
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#bb0016] font-bold hidden sm:inline-block">
                  {snackItems.length} Menu Gurih &amp; Manis
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {snackItems.map(renderCard)}
              </div>
            </section>

            {/* Section 3: MAKANAN BERAT */}
            <section className="flex flex-col gap-4 pt-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#ebedff]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#dce1ff] flex items-center justify-center text-[#003d9b]">
                    <span className="material-symbols-outlined text-[18px]">dinner_dining</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg md:text-xl text-[#071747]">Makanan Berat</h2>
                    <p className="text-xs text-[#434654]">
                      Menu santap kenyang nasi dan mie dengan racikan khas Shi Boss
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#003d9b] font-bold hidden sm:inline-block">
                  {makananItems.length} Menu Utama
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {makananItems.map(renderCard)}
              </div>
            </section>
          </>
        ) : menuLoadStatus === 'ready' ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#ebedff]">
              <span className="text-sm font-bold text-[#071747]">
                Menampilkan {filteredItems.length} menu{' '}
                {searchQuery ? `untuk "${searchQuery}"` : ''}
              </span>
            </div>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredItems.map(renderCard)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-[#D0E2FF] p-6">
                <span className="material-symbols-outlined text-[#c3c6d6] text-[48px] mb-2">
                  search_off
                </span>
                <h3 className="font-bold text-base text-[#071747]">Menu Tidak Ditemukan</h3>
                <p className="text-xs text-[#434654] mt-1 max-w-sm">
                  Coba kata kunci lain atau pilih kategori Semua untuk melihat pilihan menu lengkap Shi Boss.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-full bg-[#003d9b] text-white text-xs font-bold"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
