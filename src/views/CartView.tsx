import React from 'react';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../data/menuData';

export const CartView: React.FC = () => {
  const {
    setCurrentView,
    tableNumber,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    kitchenNotes,
    setKitchenNotes,
    showToast,
  } = useOrder();

  const handleAppendNote = (snippet: string) => {
    if (kitchenNotes.trim().length > 0) {
      if (!kitchenNotes.includes(snippet)) {
        setKitchenNotes(`${kitchenNotes}, ${snippet}`);
        showToast(`Catatan ditambahkan: ${snippet}`);
      }
    } else {
      setKitchenNotes(snippet);
      showToast(`Catatan ditambahkan: ${snippet}`);
    }
  };

  const handleClearCartConfirm = () => {
    if (window.confirm('Yakin ingin mengosongkan seluruh isi keranjang meja ini?')) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-[#e4e7ff] flex items-center justify-center text-[#003d9b] mb-4">
          <span className="material-symbols-outlined text-[48px]">shopping_cart_off</span>
        </div>
        <h2 className="text-2xl font-bold text-[#071747]">Keranjangmu Masih Kosong</h2>
        <p className="text-sm text-[#434654] max-w-md mt-1 mb-6">
          Belum ada susu segar atau camilan gurih yang kamu pilih untuk Meja #{tableNumber}. Yuk, intip menu racikan juara kami!
        </p>
        <button
          onClick={() => setCurrentView('menu')}
          className="inline-flex items-center gap-2 bg-[#bb0016] hover:bg-[#e32128] text-white px-6 py-3 rounded-full text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">local_cafe</span>
          <span>Lihat Menu Shi Boss Sekarang</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Top Meta */}
      <div className="flex items-center justify-end mb-6">
        <div className="inline-flex items-center gap-1.5 bg-[#e4e7ff] px-3 py-1 rounded-full text-[#003d9b] text-xs uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-[#bb0016]"></span>
          Sesi Meja Aktif #{tableNumber}
        </div>
      </div>

      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#dae2ff] text-[#001848] px-3 py-1 rounded-full text-xs font-bold shadow-xs">
            <span className="material-symbols-outlined text-[16px]">table_restaurant</span>
            <span>Pemesanan untuk Meja #{tableNumber} (Santap di Kedai)</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#071747] tracking-tight">
            Keranjang Pesanan
          </h1>
          <p className="text-xs md:text-sm text-[#434654] max-w-2xl">
            Periksa kembali pesanan susu dan camilan favoritmu sebelum lanjut ke kasir. Pesanan akan langsung diracik dan diantar ke mejamu.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Cart Items & Custom Note (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Cart Items Container */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#071747]">Daftar Menu Santap</span>
                <span className="bg-[#dce1ff] text-[#003d9b] text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartCount} Menu
                </span>
              </div>
              <button
                onClick={handleClearCartConfirm}
                className="text-[#bb0016] hover:text-[#e32128] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                Kosongkan Keranjang
              </button>
            </div>

            {/* List of Cart Items */}
            {cartItems.map((ci) => (
              <div
                key={ci.cartItemId}
                className="group relative bg-white rounded-xl p-4 shadow-xs hover:shadow-md border border-[#D0E2FF] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-[#f3f2ff]">
                    <img
                      className="w-full h-full object-cover"
                      alt={ci.item.name}
                      src={ci.item.image}
                    />
                    <span className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-xs text-[#003d9b] text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      {ci.modifier?.temperature || 'Segar'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    {ci.item.badge && (
                      <span className="bg-[#ebedff] text-[#003d9b] text-[10px] px-2 py-0.5 rounded font-semibold w-max">
                        {ci.item.badge}
                      </span>
                    )}
                    <h3 className="font-bold text-sm md:text-base text-[#071747] truncate">
                      {ci.item.name} {ci.modifier ? `(${ci.modifier.temperature})` : ''}
                    </h3>
                    {ci.notes && (
                      <p className="text-xs text-[#434654] flex items-center gap-1 line-clamp-1">
                        <span className="material-symbols-outlined text-[14px] text-[#003d9b]">
                          tune
                        </span>
                        {ci.notes}
                      </p>
                    )}
                    <span className="text-xs font-bold text-[#003d9b] mt-1">
                      {formatRupiah(ci.unitPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#ebedff]">
                  {/* Stepper */}
                  <div className="flex items-center bg-[#f3f2ff] rounded-full px-2 py-1 shadow-xs">
                    <button
                      onClick={() => updateCartQuantity(ci.cartItemId, -1)}
                      className="w-7 h-7 rounded-full bg-white text-[#003d9b] hover:bg-[#003d9b] hover:text-white flex items-center justify-center transition-colors shadow-xs active:scale-95 cursor-pointer font-bold"
                      aria-label="Kurangi jumlah"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="text-sm font-bold text-[#071747] px-3">{ci.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(ci.cartItemId, 1)}
                      className="w-7 h-7 rounded-full bg-white text-[#003d9b] hover:bg-[#003d9b] hover:text-white flex items-center justify-center transition-colors shadow-xs active:scale-95 cursor-pointer font-bold"
                      aria-label="Tambah jumlah"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>

                  {/* Subtotal & Trash */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-[#071747] w-20 text-right">
                      {formatRupiah(ci.unitPrice * ci.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(ci.cartItemId)}
                      className="w-8 h-8 rounded-full bg-[#ffdad6]/60 text-[#bb0016] hover:bg-[#bb0016] hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      title="Hapus menu"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Items CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-xs border border-[#D0E2FF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e4e7ff] flex items-center justify-center text-[#003d9b] shrink-0">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#071747]">
                  Masih mau camilan gurih atau roti bakar?
                </span>
                <span className="text-xs text-[#434654]">
                  Tambahkan menu lain sebelum menyelesaikan pesanan.
                </span>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('menu')}
              className="inline-flex items-center gap-1.5 text-[#003d9b] bg-[#f3f2ff] hover:bg-[#e4e7ff] px-4 py-2 rounded-full text-xs font-bold transition-colors shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Tambah Menu Lainnya</span>
            </button>
          </div>

          {/* Order Notes Card */}
          <div className="bg-white rounded-xl p-5 shadow-xs border border-[#D0E2FF] flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[#071747]">
              <span className="material-symbols-outlined text-[#003d9b] text-[20px]">
                edit_note
              </span>
              <label htmlFor="order-notes" className="text-sm font-bold">
                Catatan Pesanan Khusus (Opsional)
              </label>
            </div>
            <p className="text-xs text-[#434654]">
              Instruksi khusus kepada barista atau kru dapur untuk santap di meja #{tableNumber}.
            </p>
            <div className="relative">
              <textarea
                id="order-notes"
                value={kitchenNotes}
                onChange={(e) => setKitchenNotes(e.target.value)}
                maxLength={150}
                rows={3}
                placeholder="Contoh: Susu cokelat jangan terlalu manis, sajikan roti bakar bersamaan dengan susu."
                className="w-full bg-[#f3f2ff] border border-[#c3c6d6] rounded-xl p-3 text-xs md:text-sm text-[#071747] placeholder:text-[#737685] focus:outline-none focus:bg-white focus:border-[#003d9b] transition-all resize-none"
              ></textarea>
              <span className="absolute bottom-2.5 right-3 text-[10px] text-[#737685]">
                {kitchenNotes.length}/150 karakter
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-[#737685]">Saran cepat:</span>
              <button
                type="button"
                onClick={() => handleAppendNote('Es batu dipisah')}
                className="text-[#003d9b] bg-[#ebedff] px-2.5 py-1 rounded-full text-[11px] font-semibold hover:bg-[#dce1ff] transition-colors cursor-pointer"
              >
                + Es batu dipisah
              </button>
              <button
                type="button"
                onClick={() => handleAppendNote('Sajikan bersamaan')}
                className="text-[#003d9b] bg-[#ebedff] px-2.5 py-1 rounded-full text-[11px] font-semibold hover:bg-[#dce1ff] transition-colors cursor-pointer"
              >
                + Sajikan bersamaan
              </button>
              <button
                type="button"
                onClick={() => handleAppendNote('Tanpa sedotan plastik')}
                className="text-[#003d9b] bg-[#ebedff] px-2.5 py-1 rounded-full text-[11px] font-semibold hover:bg-[#dce1ff] transition-colors cursor-pointer"
              >
                + Tanpa sedotan
              </button>
            </div>
          </div>


        </div>

        {/* RIGHT COLUMN: Sticky Order Summary Card (5 cols on lg) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#D0E2FF] relative overflow-hidden">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ebedff]">
              <div className="flex flex-col">
                <span className="text-base font-bold text-[#071747]">Ringkasan Pesanan</span>
                <div className="flex items-center gap-1 text-xs text-[#003d9b] font-semibold">
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                  <span>Outlet Utama - Meja #{tableNumber}</span>
                </div>
              </div>
              <span className="bg-[#003d9b] text-white text-[10px] uppercase px-2.5 py-1 rounded-full font-bold shadow-xs">
                Santap di Tempat
              </span>
            </div>



            {/* Calculation Rows */}
            <div className="space-y-2 pt-3 text-xs md:text-sm">
              <div className="flex justify-between items-center text-[#434654]">
                <span>Total Menu ({cartCount} item)</span>
                <span className="text-[#071747] font-bold">{formatRupiah(cartTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[#434654]">
                <span>Biaya Pelayanan Meja</span>
                <span className="text-[#003d9b] font-bold text-xs uppercase">
                  Gratis (Dine-in)
                </span>
              </div>
            </div>

            {/* Separator Bar */}
            <div className="w-full h-px bg-[#ebedff] my-3"></div>

            {/* Grand Total Row */}
            <div className="flex items-baseline justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-[#071747]">Total Pembayaran</span>
                <span className="text-[11px] text-[#434654]">Sesuai harga menu asli</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-extrabold text-[#003d9b] tracking-tight">
                  {formatRupiah(cartTotal)}
                </span>
                <span className="text-[10px] text-[#737685]">Bayar via QRIS / Kasir Meja</span>
              </div>
            </div>

            {/* Primary CTA Button */}
            <button
              onClick={() => setCurrentView('checkout')}
              className="w-full py-3.5 px-6 bg-[#0052cc] hover:bg-[#003d9b] transition-all rounded-full flex items-center justify-center gap-2 text-white font-bold text-sm md:text-base shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
            >
              <span>Lanjut ke Checkout</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            {/* Payment Reassurance Badges */}
            <div className="mt-3 pt-2 flex flex-col items-center gap-1 text-center">
              <div className="flex items-center justify-center gap-2 text-[#737685]">
                <span className="text-[10px] uppercase tracking-wider font-semibold">
                  Metode Pembayaran Tersedia:
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#434654] text-xs">
                <span className="bg-[#ebedff] px-2 py-0.5 rounded font-bold text-[#003d9b]">
                  QRIS
                </span>
                <span>•</span>
                <span className="bg-[#ebedff] px-2 py-0.5 rounded font-bold text-[#071747]">
                  GoPay / OVO
                </span>
                <span>•</span>
                <span className="bg-[#ebedff] px-2 py-0.5 rounded font-bold text-[#071747]">
                  Tunai di Kasir
                </span>
              </div>
              <p className="text-[11px] text-[#737685] mt-1">
                Kamu bisa membayar langsung lewat ponsel atau bayar tunai saat pesanan diantar.
              </p>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
