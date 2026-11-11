import React, { useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Lock,
  Search,
  RotateCcw,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const StateShowcaseView: React.FC = () => {
  const { setCurrentScreen, showToast } = useAdmin();

  const [activeStateTab, setActiveStateTab] = useState<string>('empty_orders');

  const states = [
    { id: 'empty_orders', label: '1. Pesanan Kosong' },
    { id: 'empty_qris', label: '2. QRIS Selesai' },
    { id: 'search_empty', label: '3. Menu Tidak Ditemukan' },
    { id: 'server_error', label: '4. Gagal Muat Server' },
    { id: 'upload_error', label: '5. Gagal Upload Gambar' },
    { id: 'unauthorized', label: '6. Sesi Kadaluwarsa' },
    { id: 'success_action', label: '7. Konfirmasi Sukses' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-[#0052cc]" />
          <h2 className="text-xl font-extrabold text-[#071747] tracking-tight">
            Galeri Status Sistem & UI (Screen 7)
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          Kompilasi status khusus untuk memastikan konsistensi pengalaman pengguna saat menghadapi kondisi data kosong (empty states), kegagalan jaringan (error states), validasi berkas, dan sesi keamanan.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {states.map((st) => (
          <button
            key={st.id}
            onClick={() => setActiveStateTab(st.id)}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg border whitespace-nowrap transition-colors ${
              activeStateTab === st.id
                ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* State Viewport Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-8 sm:p-12 min-h-[380px] flex items-center justify-center">
        {/* State 1: Empty Orders */}
        {activeStateTab === 'empty_orders' && (
          <div className="text-center max-w-md space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0052cc] border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#071747]">Belum Ada Pesanan Masuk</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Daftar pesanan meja santap saat ini kosong. Saat pelanggan memindai kode QR di meja santap mereka, pesanan baru akan langsung muncul di layar ini secara otomatis.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentScreen('orders')}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0040a2] rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>Periksa Halaman Pesanan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* State 2: Empty QRIS Pending */}
        {activeStateTab === 'empty_qris' && (
          <div className="text-center max-w-md space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#071747]">Semua Pembayaran Telah Terverifikasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tidak ada antrean pembayaran QRIS yang memerlukan tindakan kasir saat ini. Seluruh tagihan pesanan telah cocok dengan mutasi perbankan.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentScreen('qris')}
                className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <span>Lihat Riwayat Transaksi Hari Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* State 3: Search Empty */}
        {activeStateTab === 'search_empty' && (
          <div className="text-center max-w-md space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto shadow-2xs">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#071747]">Menu Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tidak ada produk yang cocok dengan kata pencarian Anda. Periksa ejaan nama menu atau hapus filter kategori aktif.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentScreen('menu')}
                className="px-4 py-2 text-xs font-bold text-[#0052cc] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Pencarian Katalog</span>
              </button>
            </div>
          </div>
        )}

        {/* State 4: Server Error */}
        {activeStateTab === 'server_error' && (
          <div className="text-center max-w-md space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-2xs">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#071747]">Gagal Menghubungkan ke Server</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Terjadi kesalahan saat memuat data dari database Supabase Shiboss. Server mungkin sedang dalam sinkronisasi atau koneksi internet lokal terputus.
            </p>
            <div className="pt-2">
              <button
                onClick={() => showToast('Memuat ulang data dari server...', 'info')}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0040a2] rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Muat Ulang Sekarang</span>
              </button>
            </div>
          </div>
        )}

        {/* State 5: Image Upload Error */}
        {activeStateTab === 'upload_error' && (
          <div className="text-center max-w-md space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-2xs">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#071747]">Berkas Foto Gagal Diunggah</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ukuran gambar melebihi batas 2MB atau format tidak didukung. Mohon gunakan berkas berekstensi .PNG, .JPG, atau .WebP dengan dimensi proporsional.
            </p>
            <div className="pt-2">
              <button
                onClick={() => showToast('Silakan pilih berkas foto di bawah 2MB.', 'error')}
                className="px-4 py-2 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pilih Berkas Lain</span>
              </button>
            </div>
          </div>
        )}

        {/* State 6: Unauthorized / Expired Session */}
        {activeStateTab === 'unauthorized' && (
          <div className="text-center max-w-md space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#071747]">Sesi Admin Telah Berakhir</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Untuk keamanan operasional kasir Shiboss, sesi Anda secara otomatis dikunci setelah tidak aktif. Silakan masuk kembali dengan email dan kata sandi Anda.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentScreen('login')}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0040a2] rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Masuk Kembali ke Akun</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* State 7: Success Action */}
        {activeStateTab === 'success_action' && (
          <div className="text-center max-w-md space-y-3 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#071747]">Perubahan Berhasil Disimpan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Data katalog menu telah diperbarui secara instan ke server Supabase dan langsung berlaku untuk pemesanan meja pelanggan.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  showToast('Notifikasi konfirmasi aksi telah dikirim.', 'success');
                  setCurrentScreen('dashboard');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Kembali ke Dashboard Utama</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
