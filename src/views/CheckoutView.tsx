import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../data/menuData';

export const CheckoutView: React.FC = () => {
  const {
    setCurrentView,
    tableNumber,
    setTableNumber,
    customerName,
    setCustomerName,
    kitchenNotes,
    setKitchenNotes,
    cartItems,
    cartCount,
    cartTotal,
    paymentMethod,
    setPaymentMethod,
    placeOrder,
    showToast,
  } = useOrder();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmOrder = async () => {
    if (!tableNumber.trim()) {
      showToast('Mohon masukkan nomor meja yang valid sesuai stiker meja Anda.');
      return;
    }

    setIsSubmitting(true);
    await placeOrder(paymentMethod);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumb & Header Flow */}
      <div className="flex flex-col gap-1 mb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#434654] text-xs font-semibold">
          <button
            onClick={() => setCurrentView('menu')}
            className="hover:text-[#003d9b] transition-colors cursor-pointer"
          >
            Menu
          </button>
          <span className="material-symbols-outlined text-[#737685] text-[14px]">chevron_right</span>
          <button
            onClick={() => setCurrentView('keranjang')}
            className="hover:text-[#003d9b] transition-colors cursor-pointer"
          >
            Keranjang
          </button>
          <span className="material-symbols-outlined text-[#737685] text-[14px]">chevron_right</span>
          <span className="text-[#003d9b] font-bold">Checkout</span>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
          <div>
            <span className="text-[10px] md:text-xs text-[#bb0016] tracking-widest uppercase font-extrabold">
              Finalisasi Santap Di Tempat
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#071747] tracking-tight">
              Checkout Pesanan
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[#e4e7ff] px-3.5 py-1.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-[#071747] font-semibold">Terminal Dine-In Aktif</span>
          </div>
        </div>
      </div>

      {/* Prominent Dine-in Context Banner */}
          <div className="mb-8 bg-stone-surface rounded-2xl p-4 md:p-5 border border-[#e5d5c3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#003d9b] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">table_restaurant</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#bb0016] text-[18px]">location_on</span>
              <span className="text-base md:text-lg font-bold text-[#071747]">
                Santap di Kedai Shi Boss • Meja #{tableNumber}
              </span>
            </div>
            <p className="text-xs text-[#434654]">
              Pesanan disiapkan segar &amp; diantar langsung oleh kru ke meja Anda tanpa antre kasir.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 self-start sm:self-center bg-white px-3.5 py-1.5 rounded-full shadow-xs text-[#071747] text-xs font-bold border border-[#dce1ff]">
          <span className="material-symbols-outlined text-[#003d9b] text-[18px]">bolt</span>
          <span>
            Estimasi Antar: <strong>6-10 Menit</strong>
          </span>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Forms & Interactive Payment Selection (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* SECTION A: Table & Customer Identity */}
          <section className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-[#D0E2FF] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#ebedff] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003d9b] text-[22px]">badge</span>
                <h2 className="text-base md:text-lg font-bold text-[#071747]">
                  Informasi Pemesan &amp; Meja
                </h2>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-[#dae2ff] text-[#001848] uppercase font-bold">
                Wajib
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Table Number Input with Verified Indicator */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="table-input"
                  className="text-xs text-[#071747] font-semibold flex items-center justify-between"
                >
                  <span>Nomor Meja</span>
                  <span className="text-emerald-700 text-[11px] flex items-center gap-0.5 font-bold">
                    <span className="material-symbols-outlined text-[14px]">verified</span> Terverifikasi QR
                  </span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#003d9b] font-bold text-base">#</span>
                  <input
                    id="table-input"
                    type="text"
                    maxLength={3}
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-8 pr-10 py-2 bg-[#f3f2ff] text-[#003d9b] font-bold text-base rounded-xl border border-[#c3c6d6] focus:outline-none focus:bg-white focus:border-[#003d9b] transition-colors"
                  />
                  <span className="absolute right-3 material-symbols-outlined text-emerald-600 text-[20px]">
                    check_circle
                  </span>
                </div>
                <p className="text-[10px] text-[#737685]">
                  Pastikan nomor meja sesuai stiker di meja Anda saat ini.
                </p>
              </div>

              {/* Customer Nickname Input */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name-input"
                  className="text-xs text-[#071747] font-semibold flex items-center justify-between"
                >
                  <span>Nama Pemesan</span>
                  <span className="text-[10px] text-[#737685]">Opsional</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 material-symbols-outlined text-[#737685] text-[18px]">
                    person_outline
                  </span>
                  <input
                    id="name-input"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="cth: Dimas / Kak Tari"
                    className="w-full pl-9 pr-3 py-2 bg-[#f3f2ff] text-[#071747] text-xs md:text-sm rounded-xl border border-[#c3c6d6] focus:outline-none focus:bg-white focus:border-[#003d9b] transition-colors placeholder:text-[#737685]"
                  />
                </div>
                <p className="text-[10px] text-[#737685]">
                  Memudahkan barista menyapa saat hidangan tiba.
                </p>
              </div>
            </div>

            {/* Kitchen & Serving Note */}
            <div className="flex flex-col gap-1 pt-1">
              <label
                htmlFor="kitchen-notes"
                className="text-xs text-[#071747] font-semibold flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#3b4450]">edit_note</span>
                  <span>Catatan Khusus Meja / Dapur</span>
                </span>
                <span className="text-[10px] text-[#737685]">Opsional</span>
              </label>
              <textarea
                id="kitchen-notes"
                rows={2}
                value={kitchenNotes}
                onChange={(e) => setKitchenNotes(e.target.value)}
                placeholder="cth: Susu dingin disajikan dahulu ya Mas, es batu dipisah."
                className="w-full p-3 bg-[#f3f2ff] text-[#071747] text-xs md:text-sm rounded-xl border border-[#c3c6d6] focus:outline-none focus:bg-white focus:border-[#003d9b] transition-colors resize-none placeholder:text-[#737685]"
              ></textarea>
            </div>
          </section>

          {/* SECTION B: In-Store Payment Methods */}
          <section className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-[#D0E2FF] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#ebedff] pb-3">
              <h2 className="text-base md:text-lg font-bold text-[#071747] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003d9b] text-[22px]">payments</span>
                <span>Pilih Metode Pembayaran di Kedai</span>
              </h2>
              <span className="text-xs text-[#003d9b] font-bold">100% AMAN</span>
            </div>
            <p className="text-xs text-[#434654] -mt-2">
              Pilih cara pembayaran yang paling nyaman untuk Anda saat ini:
            </p>

            <div className="flex flex-col gap-3">
              {/* Option 1: QRIS Instant Pay */}
              <label
                onClick={() => setPaymentMethod('qris')}
                className={`cursor-pointer relative block rounded-2xl p-4 transition-all duration-200 border ${
                  paymentMethod === 'qris'
                    ? 'bg-[#ebedff] border-[#0052cc] shadow-sm'
                    : 'bg-[#faf8ff] border-[#dce1ff] hover:bg-[#f3f2ff]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0052cc] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      QRIS
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#071747]">
                          QRIS Instant (Semua Bank &amp; E-Wallet)
                        </span>
                        <span className="bg-[#ffdad6] text-[#bb0016] text-[10px] px-1.5 py-0.5 rounded font-bold">
                          TERCEPAT
                        </span>
                      </div>
                      <p className="text-xs text-[#434654] mt-0.5">
                        BCA, GoPay, OVO, Dana, ShopeePay, LinkAja, Livin', BRImo
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      paymentMethod === 'qris'
                        ? 'bg-[#003d9b] text-white'
                        : 'border border-[#c3c6d6] text-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                </div>

                <p className="text-xs text-[#434654] mt-2 bg-white/80 p-2.5 rounded-lg border border-[#dce1ff]">
                  Bayar instan via scan kode QR dinamis langsung dari ponsel Anda di meja. Cepat, tervalidasi otomatis, dan tanpa perlu beranjak.
                </p>

                {/* Mini Brand Badges */}
                <div className="flex items-center gap-2 mt-3 flex-wrap text-[#737685] text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-white font-mono font-bold text-[#071747] border border-[#dce1ff]">
                    QRIS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white font-bold text-[#00A03C] border border-[#dce1ff]">
                    GOPAY
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white font-bold text-[#4D2877] border border-[#dce1ff]">
                    OVO
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white font-bold text-[#118EEA] border border-[#dce1ff]">
                    DANA
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white font-bold text-[#EE4D2D] border border-[#dce1ff]">
                    SHOPEEPAY
                  </span>
                </div>
              </label>
            </div>
          </section>

          {/* Navigation & Action Triggers */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setCurrentView('keranjang')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-white text-[#003d9b] hover:bg-[#f3f2ff] transition-colors text-xs md:text-sm font-bold shadow-xs border border-[#D0E2FF] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Kembali ke Keranjang</span>
            </button>

            <button
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#bb0016] hover:bg-[#e32128] text-white transition-all transform active:scale-95 text-xs md:text-sm font-bold shadow-md cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Menyiapkan Meja #{tableNumber}...</span>
                </>
              ) : (
                <>
                  <span>Lanjut Bayar via QRIS</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {formatRupiah(cartTotal)}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Dine-In Order Summary (5 cols on lg) */}
        <div className="lg:col-span-5 sticky top-24 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-md border border-[#D0E2FF] p-5 md:p-6 flex flex-col gap-4 relative overflow-hidden">
            {/* Header & Dine-In Badge */}
            <div className="flex items-start justify-between border-b pb-3 border-[#ebedff]">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#003d9b] text-[20px]">
                    receipt_long
                  </span>
                  <h3 className="font-bold text-base text-[#071747]">Ringkasan Pesanan</h3>
                </div>
                <span className="text-[11px] text-[#737685]">{cartCount} Menu Minuman &amp; Makanan Dipilih</span>
              </div>
              <div className="bg-[#e4e7ff] px-3 py-1 rounded-full text-right">
                <span className="text-xs text-[#003d9b] font-bold block">Meja #{tableNumber}</span>
                <span className="text-[10px] text-[#434654] font-medium">Santap Langsung</span>
              </div>
            </div>

            {/* Items Review List */}
            <div className="flex flex-col gap-3 divide-y divide-[#ebedff] max-h-60 overflow-y-auto pr-1">
              {cartItems.map((ci) => (
                <div key={ci.cartItemId} className="flex items-center justify-between pt-2 first:pt-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#f3f2ff]">
                      <img
                        src={ci.item.image}
                        alt={ci.item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#071747]">{ci.item.name}</span>
                      <span className="text-[11px] text-[#434654]">
                        {ci.modifier ? `${ci.modifier.temperature} • ` : ''}
                        {ci.quantity}x
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#003d9b]">
                      {formatRupiah(ci.unitPrice * ci.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="flex flex-col gap-1.5 pt-1 text-xs">
              <div className="flex justify-between text-[#434654]">
                <span>Total Menu ({cartCount} item)</span>
                <span className="font-semibold text-[#071747]">{formatRupiah(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-[#434654]">
                <span>Biaya Layanan Meja</span>
                <span className="font-bold text-[#003d9b]">GRATIS (Dine-in)</span>
              </div>

              {/* Final Total */}
              <div className="pt-2 mt-2 bg-[#f3f2ff] -mx-5 md:-mx-6 px-5 md:px-6 py-3 flex items-baseline justify-between border-t border-[#ebedff]">
                <div>
                  <span className="text-[10px] text-[#737685] uppercase tracking-wider block font-bold">
                    Total Pembayaran
                  </span>
                  <span className="text-[11px] text-[#434654]">Sesuai harga menu asli</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-[#003d9b] leading-none">
                    {formatRupiah(cartTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Reassurance Banner */}
            <div className="flex items-start gap-2 text-[#434654] text-xs pt-1">
              <span className="material-symbols-outlined text-[#003d9b] text-[18px] shrink-0 mt-0.5">
                verified_user
              </span>
              <span>
                Pesanan Anda langsung diteruskan otomatis ke Barista &amp; Dapur Shi Boss setelah pembayaran.
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
