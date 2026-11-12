import React from 'react';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../data/menuData';

export const OrderStatusView: React.FC = () => {
  const { setCurrentView, tableNumber, activeOrder } = useOrder();

  if (!activeOrder) {
    return <section className="mx-auto my-12 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center"><h1 className="text-xl font-bold text-slate-900">Pesanan tidak ditemukan</h1><p className="mt-2 text-sm text-slate-600">Buat pesanan terlebih dahulu untuk melihat statusnya.</p><a href="/menu" className="mt-5 inline-flex rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Lihat menu</a></section>;
  }

  const order = activeOrder;

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden pb-12">
        <div className="w-full max-w-3xl mx-auto px-4 md:px-6 pt-4 sm:pt-6 flex flex-col items-center">
          {/* Breadcrumb / Table Indicator Banner */}
          <div className="inline-flex items-center gap-2 bg-[#f3f2ff] px-4 py-1.5 rounded-full shadow-xs mb-4 border border-[#dce1ff]">
              <span className={`w-2.5 h-2.5 rounded-full ${order.status === 'selesai' ? 'bg-emerald-500' : order.status === 'dibatalkan' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
            <span className="text-xs text-[#003d9b] font-bold uppercase tracking-wider">
              Pesanan {order.status} • Meja #{tableNumber}
            </span>
          </div>

          {/* Main Celebration & Success Card */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-[#D0E2FF] p-5 sm:p-8 relative overflow-hidden flex flex-col items-center text-center">

            {/* Success Celebration Icon Badge with Milk Splash Graphic */}
            <div className="relative mt-2 mb-4 flex items-center justify-center">
              <svg
                className="w-28 h-28 sm:w-36 sm:h-36 text-[#e4e7ff]"
                fill="currentColor"
                viewBox="0 0 200 200"
              >
                <path
                  d="M42.7,-62.9C54.9,-54.6,64.1,-42.7,69.5,-29.4C74.9,-16.1,76.5,-1.3,73.4,12.7C70.3,26.7,62.5,39.9,51.8,49.8C41.1,59.8,27.5,66.5,12.9,69.7C-1.8,72.9,-17.5,72.7,-31.6,66.8C-45.7,60.9,-58.2,49.3,-66.1,35.3C-74,21.3,-77.3,4.9,-74.6,-10.5C-71.9,-25.9,-63.2,-40.3,-51.2,-48.8C-39.2,-57.3,-23.9,-59.9,-9,-57.7C5.9,-55.6,30.5,-71.2,42.7,-62.9Z"
                  transform="translate(100 100)"
                ></path>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#003d9b] flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[26px] sm:text-[32px] font-bold">
                        check_circle
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Headlines */}
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#bb0016] font-extrabold mb-1">
              {order.status === 'dibatalkan' ? 'Pesanan Dibatalkan' : order.paymentStatus === 'terverifikasi' || order.paymentStatus === 'tunai_lunas' ? 'Pembayaran Terkonfirmasi' : 'Pesanan Tersimpan'}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#071747] text-center max-w-lg mb-2 tracking-tight">
              {order.status === 'dibatalkan' ? 'Pesanan Dibatalkan' : 'Pesanan Anda'}
            </h1>
            <p className="text-xs md:text-sm text-[#434654] max-w-lg mx-auto mb-6 leading-relaxed">
              Terima kasih telah memesan di{' '}
              <span className="font-bold text-[#003d9b]">Kedai Susu Segar Shi Boss</span>. Minuman
              {order.status === 'dibatalkan' ? `Alasan: ${order.cancellationReason ?? 'Hubungi kasir untuk informasi lebih lanjut.'}` : order.paymentStatus === 'menunggu_verifikasi' ? 'Pesanan tersimpan. Pembayaran QRIS akan diproses setelah diverifikasi manual oleh kasir.' : 'Status pesanan diperbarui langsung oleh tim kedai.'}
            </p>

            {/* Estimated Serving Time Pill Card */}
            <div className="w-full bg-[#f3f2ff] rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#dce1ff]">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-[#dae2ff] flex items-center justify-center text-[#003d9b] shrink-0">
                  <span className="material-symbols-outlined text-[24px]">timer</span>
                </div>
                <div>
                  <p className="text-[10px] text-[#434654] uppercase tracking-wider font-bold">
                    Waktu Tunggu Santap
                  </p>
                  <p className="text-sm md:text-base text-[#003d9b] font-bold">
                    Estimasi Saji: 8 - 12 Menit
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full shadow-xs text-[#071747] border border-[#dce1ff]">
                <span className="material-symbols-outlined text-[#bb0016] text-[18px]">
                  restaurant
                </span>
                <span className="text-xs font-bold">Dine-in Santai di Meja #{tableNumber}</span>
              </div>
            </div>

            {/* In-Store Live Dine-In Status Tracker (3 Steps) */}
            <div className="w-full bg-[#faf8ff] rounded-2xl p-4 sm:p-5 mb-6 text-left border border-[#D0E2FF]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[#071747]">Status Pesanan Langsung</span>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  Real-time Tracker
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
                {/* Step 1: Pesanan Diterima */}
                <div className="flex sm:flex-col items-center sm:text-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
                    <span className="material-symbols-outlined text-[20px]">done</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#071747]">Diterima &amp; Terbayar</p>
                    <p className="text-[11px] text-[#434654]">
                    {order.paymentStatus === 'terverifikasi' || order.paymentStatus === 'tunai_lunas' ? 'Pembayaran terkonfirmasi' : order.paymentStatus === 'menunggu_tunai' ? 'Tunai belum dibayar' : 'Menunggu verifikasi pembayaran'}
                    </p>
                  </div>
                </div>

                {/* Step 2: Sedang Diracik */}
                <div className="flex sm:flex-col items-center sm:text-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#0052cc] text-white flex items-center justify-center ring-4 ring-[#dae2ff] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">blender</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0052cc]">Sedang Diracik di Bar</p>
                    <p className="text-[11px] text-[#003d9b] font-semibold">Proses pembuatan susu</p>
                  </div>
                </div>

                {/* Step 3: Diantar ke Meja */}
                <div className="flex sm:flex-col items-center sm:text-center gap-3 relative z-10 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-[#e4e7ff] text-[#434654] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">table_restaurant</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#071747]">Diantar ke Mejamu</p>
                    <p className="text-[11px] text-[#434654]">
                      Pramusaji menuju Meja #{tableNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar Representation */}
              <div className="hidden sm:block w-full bg-[#e4e7ff] h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-[#0052cc] h-full rounded-full w-2/3 transition-all duration-700"></div>
              </div>
            </div>

            {/* Order Detail Box */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-5 text-left shadow-xs border border-[#D0E2FF] mb-6">
              <div className="flex items-center justify-between pb-2 mb-3 bg-[#f3f2ff] p-3 rounded-xl border border-[#dce1ff]">
                <div>
                  <span className="text-[10px] text-[#434654] block uppercase font-bold">
                    Kode Transaksi Dine-in
                  </span>
                  <span className="text-base font-extrabold text-[#003d9b] tracking-tight font-mono">
                    {order.orderId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#434654] block uppercase font-bold">
                    Waktu Pesan
                  </span>
                  <span className="text-xs text-[#071747] font-semibold">{order.createdAt}</span>
                </div>
              </div>

              {/* Metadata 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#f3f2ff]/60 p-2.5 rounded-xl border border-[#ebedff]">
                  <span className="text-[10px] text-[#737685] block">Lokasi Meja</span>
                  <span className="text-xs text-[#071747] font-bold flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[#003d9b] text-[16px]">
                      pin_drop
                    </span>
                    Outlet Utama • Meja #{tableNumber}
                  </span>
                </div>
                <div className="bg-[#f3f2ff]/60 p-2.5 rounded-xl border border-[#ebedff]">
                  <span className="text-[10px] text-[#737685] block">Metode Pembayaran</span>
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                    {order.paymentMethod === 'cash' ? 'Tunai di kasir' : 'QRIS (verifikasi manual)'}
                  </span>
                </div>
              </div>

              {/* Order Summary Items */}
              <div className="space-y-2 mb-3">
                <span className="text-[10px] uppercase tracking-wider text-[#737685] font-bold block">
                  Rincian Menu Dipesan
                </span>

                {(order.items.length > 0 ? order.items : []).map((ci) => (
                  <div
                    key={ci.cartItemId}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#faf8ff] hover:bg-[#f3f2ff] transition-colors border border-[#ebedff]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#f3f2ff]">
                        <img
                          src={ci.item.image}
                          alt={ci.item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#071747]">{ci.item.name}</h4>
                        <p className="text-[10px] text-[#434654]">
                          {ci.quantity} porsi • {ci.modifier?.temperature || 'Segar'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#003d9b] font-bold">
                      {formatRupiah(ci.unitPrice * ci.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Kitchen Note Box */}
              {order.kitchenNotes && (
                <div className="bg-[#ebedff] rounded-xl p-3 flex items-start gap-2 text-[#071747] mb-3 border border-[#dce1ff]">
                  <span className="material-symbols-outlined text-[#bb0016] text-[18px] shrink-0 mt-0.5">
                    edit_note
                  </span>
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-[#bb0016] block">
                      Catatan Khusus Racikan:
                    </span>
                    <p className="text-xs text-[#434654] font-medium">{order.kitchenNotes}</p>
                  </div>
                </div>
              )}

              {/* Total Calculation Row */}
              <div className="pt-2 flex items-center justify-between border-t border-[#ebedff]">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#737685] uppercase font-bold">
                    Total Pembayaran
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {order.isPaid ? 'Pembayaran terverifikasi' : 'Menunggu pembayaran/verifikasi'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#0052cc]">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Friendly Upsell & Dine-in Prompt */}
            <div className="w-full bg-[#ffdad6]/40 border border-[#ffb4ac] rounded-2xl p-4 mb-6 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#bb0016] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">cookie</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#410003]">
                  Ingin pesan camilan renyah tambahan?
                </p>
                <p className="text-[11px] text-[#93000f] mt-0.5">
                  Anda dapat langsung memesan kembali dari nomor meja yang sama (#{tableNumber}) tanpa perlu checkout ulang.
                </p>
              </div>
            </div>

            {/* Action Call-to-Actions (CTAs) */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('beranda')}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-1.5 bg-[#0052cc] hover:bg-[#003d9b] transition-all duration-200 text-white py-2.5 px-6 rounded-full shadow-sm text-xs md:text-sm font-bold active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">home</span>
                <span>Kembali ke Beranda</span>
              </button>
              <button
                onClick={() => setCurrentView('menu')}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#f3f2ff] text-[#0052cc] py-2.5 px-6 rounded-full shadow-xs text-xs md:text-sm font-bold transition-all duration-200 active:scale-95 border-2 border-[#0052cc] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                <span>Lihat Katalog Menu Lagi</span>
              </button>
            </div>
          </div>

          {/* Quick FAQs / In-store Tips Card */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#D0E2FF] flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#e4e7ff] flex items-center justify-center text-[#003d9b] shrink-0">
                <span className="material-symbols-outlined text-[18px]">wifi</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#071747]">WiFi Gratis Dine-In</h5>
                <p className="text-[11px] text-[#434654] mt-0.5">
                  SSID: <strong>ShiBoss_Guest</strong> • Sandi: <strong>sususegarjuara</strong>
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#D0E2FF] flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#bb0016] shrink-0">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#071747]">Struk Digital Tersimpan</h5>
                <p className="text-[11px] text-[#434654] mt-0.5">
                  Bukti bayar dapat dilihat kapan saja di menu Pesanan Saya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
