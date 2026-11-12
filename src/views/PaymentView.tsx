import React, { useState, useEffect, useRef } from 'react';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../data/menuData';

export const PaymentView: React.FC = () => {
  const {
    tableNumber,
    activeOrder,
    refreshActiveOrder,
    uploadTransferProof,
    showToast,
  } = useOrder();

  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const proofFileRef = useRef<File | null>(null);

  // Transfer Proof Upload States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(
    activeOrder?.transferProofImage || null
  );
  const [proofFileName, setProofFileName] = useState<string>('');
  const [proofFileSize, setProofFileSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(Boolean(activeOrder?.transferProofPath || activeOrder?.transferProofImage));
  const [fullscreenPreview, setFullscreenPreview] = useState<string | null>(null);

  useEffect(() => {
    setIsUploaded(Boolean(activeOrder?.transferProofPath || activeOrder?.transferProofImage));
  }, [activeOrder?.transferProofPath, activeOrder?.transferProofImage]);

  const orderId = activeOrder?.orderId;
  const totalAmount = activeOrder?.total ?? 0;

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(totalAmount.toString());
    setCopied(true);
    showToast(`Nominal ${totalAmount} berhasil disalin!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckStatus = async () => {
    setIsChecking(true);
    const refreshed = await refreshActiveOrder();
    setIsChecking(false);
    if (refreshed?.paymentStatus === 'terverifikasi' || refreshed?.paymentStatus === 'tunai_lunas') {
      window.location.assign('/order');
    }
  };

  // Handle image file selection
  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Mohon pilih file gambar (JPG, PNG, atau WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProofPreview(result);
      setProofFileName(file.name);
      setProofFileSize(`${(file.size / 1024).toFixed(0)} KB`);
      setIsUploaded(false);
      proofFileRef.current = file;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemoveProof = () => {
    setProofPreview(null);
    setProofFileName('');
    setProofFileSize('');
    setIsUploaded(false);
    proofFileRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitProof = async () => {
    if (!proofFileRef.current) {
      showToast('Silakan pilih foto bukti transfer terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    const uploaded = await uploadTransferProof(proofFileRef.current);
    setIsUploading(false);
    if (uploaded) setIsUploaded(true);
  };

  if (!activeOrder || !orderId) {
    return <section className="mx-auto my-12 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center"><h1 className="text-xl font-bold text-slate-900">Tidak ada pesanan untuk dibayar</h1><p className="mt-2 text-sm text-slate-600">Silakan buat pesanan terlebih dahulu.</p><a href="/menu" className="mt-5 inline-flex rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white">Lihat menu</a></section>;
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-16">
      {/* Top Banner Alert Bar */}
      <section className="w-full bg-[#f3f2ff] border-b border-[#D0E2FF] py-3.5 px-4 md:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0052cc] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#071747]">
                Pembayaran Meja #{tableNumber} • ID Pesanan {orderId}
              </span>
              <span className="text-[11px] text-[#434654]">
                {activeOrder.paymentMethod === 'qris' ? 'Gunakan QRIS resmi kedai yang diberikan kasir, lalu kirim bukti pembayaran untuk verifikasi manual.' : 'Pembayaran tunai diselesaikan langsung kepada kasir.'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Viewport */}
      <section className="w-full px-4 md:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Order payment and proof card */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-md border border-[#D0E2FF] p-5 md:p-8 flex flex-col gap-6 relative overflow-hidden">
            {/* Header Total Payment Amount */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f3f2ff] p-4 md:p-5 rounded-2xl border border-[#dce1ff]">
              <div className="flex flex-col">
                <span className="text-xs text-[#434654] font-medium">Total Tagihan Meja #{tableNumber}</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl md:text-3xl font-extrabold text-[#0052cc] tracking-tight">
                    {formatRupiah(totalAmount)}
                  </span>
                  <span className="text-xs text-[#737685]">(Sesuai harga menu asli)</span>
                </div>
              </div>

              <button
                onClick={handleCopyAmount}
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#ebedff] text-[#003d9b] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 self-start sm:self-center border border-[#dce1ff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                <span>{copied ? 'Tersalin!' : 'Salin Nominal'}</span>
              </button>
            </div>

            {/* Payment method */}
            <div className="flex items-center justify-between bg-[#ebedff] px-4 py-2.5 rounded-xl border border-[#dce1ff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0052cc] text-[20px]">qr_code_scanner</span>
                <span className="text-xs md:text-sm font-bold text-[#071747]">
                  Metode Pembayaran: {activeOrder.paymentMethod === 'qris' ? 'QRIS (verifikasi manual)' : 'Tunai di kasir'}
                </span>
              </div>
              <span className="bg-[#0052cc] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                Manual
              </span>
            </div>

            {activeOrder.paymentMethod === 'qris' && <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
              QRIS merchant belum dikonfigurasi. Jangan melakukan transfer ke QR contoh. Silakan minta QRIS resmi kedai kepada kasir; verifikasi pembayaran tetap dilakukan manual.
            </div>}

              {/* Payment status */}
              <div className="w-full flex items-center justify-center gap-2 bg-[#f3f2ff] px-4 py-2.5 rounded-full border border-[#dce1ff]">
                <span className={`inline-flex h-3 w-3 rounded-full ${activeOrder.paymentStatus === 'terverifikasi' || activeOrder.paymentStatus === 'tunai_lunas' ? 'bg-emerald-500' : activeOrder.paymentStatus === 'ditolak' ? 'bg-rose-500' : 'bg-[#bb0016]'}`}></span>
                <span className="text-xs font-semibold text-[#071747]">
                  {activeOrder.paymentStatus === 'terverifikasi' || activeOrder.paymentStatus === 'tunai_lunas' ? 'Pembayaran telah dikonfirmasi kasir.' : activeOrder.paymentStatus === 'menunggu_tunai' ? 'Belum dibayar. Serahkan uang tunai kepada kasir.' : activeOrder.paymentStatus === 'ditolak' ? 'Bukti sebelumnya ditolak. Silakan unggah bukti yang benar.' : activeOrder.transferProofPath ? 'Bukti diterima; menunggu verifikasi manual kasir.' : 'Menunggu pembayaran dan verifikasi manual kasir.'}
                </span>
              </div>

              {/* Manual status refresh; payment is never auto-confirmed */}
              <div className="w-full pt-1">
                <button
                  onClick={handleCheckStatus}
                  disabled={isChecking}
                  className="w-full py-3 px-6 bg-[#0052cc] hover:bg-[#003d9b] text-white rounded-full text-xs md:text-sm font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isChecking ? 'animate-spin' : ''
                    }`}
                  >
                    sync
                  </span>
                  <span>{isChecking ? 'Memuat status pesanan...' : 'Perbarui Status Verifikasi'}</span>
                </button>
              </div>
            {/* SEKSI BARU: UPLOAD BUKTI TRANSFER UNTUK DASHBOARD ADMIN */}
            {activeOrder.paymentMethod === 'qris' && <div className="w-full bg-[#faf8ff] rounded-2xl p-5 border-2 border-dashed border-[#D0E2FF] flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0052cc] text-[22px]">
                      receipt_long
                    </span>
                    <h3 className="text-sm md:text-base font-extrabold text-[#071747]">
                      Unggah Bukti Transfer QRIS / M-Banking
                    </h3>
                  </div>
                  <p className="text-xs text-[#434654] mt-1">
                    Kirim foto/screenshot bukti transaksi berhasil agar kasir Shiboss langsung memverifikasi pesanan Anda di Dashboard Admin.
                  </p>
                </div>

                {isUploaded && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 border border-emerald-300">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Terkirim ke Admin
                  </span>
                )}
              </div>

              {/* Hidden Native File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Dropzone / Upload State */}
              {!proofPreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-7 px-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                    isDragging
                      ? 'border-[#0052cc] bg-[#ebedff]'
                      : 'border-[#c3c6d6] hover:border-[#0052cc] bg-white hover:bg-[#f3f2ff]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#ebedff] text-[#0052cc] flex items-center justify-center mb-2 shadow-2xs">
                    <span className="material-symbols-outlined text-[26px]">add_photo_alternate</span>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-[#071747]">
                    Klik atau Seret Foto Bukti Transfer ke Sini
                  </span>
                  <span className="text-[11px] text-[#737685] mt-1">
                    Mendukung JPG, PNG, atau screenshot e-wallet (Maks. 5 MB)
                  </span>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-4 border border-[#D0E2FF] flex flex-col sm:flex-row items-center gap-4 shadow-xs">
                  {/* Image Thumbnail with zoom trigger */}
                  <div
                    onClick={() => setFullscreenPreview(proofPreview)}
                    className="relative w-24 h-28 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 cursor-pointer group shadow-2xs"
                  >
                    <img
                      src={proofPreview}
                      alt="Pratinjau Bukti Transfer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                      <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                      <span>Perbesar</span>
                    </div>
                  </div>

                  {/* Metadata and Controls */}
                  <div className="flex-1 flex flex-col justify-between w-full text-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#071747] truncate max-w-[200px]">
                          {proofFileName || 'Bukti_Transfer_QRIS.jpg'}
                        </span>
                        {proofFileSize && (
                          <span className="text-[10px] text-[#737685] font-mono">{proofFileSize}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#434654] mt-1">
                        {isUploaded
                          ? 'Foto telah terhubung ke data transaksi QRIS di dashboard kasir Shiboss.'
                          : 'Pastikan nama penerima "Kedai Susu Segar Shiboss" dan nominal transfer sesuai.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-[#ebedff]">
                      {!isUploaded ? (
                        <button
                          onClick={handleSubmitProof}
                          disabled={isUploading}
                          className="py-2 px-4 bg-[#0052cc] hover:bg-[#003d9b] text-white rounded-full font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isUploading ? 'sync' : 'cloud_upload'}
                          </span>
                          <span>
                            {isUploading ? 'Mengirim ke Kasir...' : 'Kirim Bukti ke Dashboard Admin'}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => { window.location.assign('/order'); }}
                          className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Lanjut ke Status Pesanan Meja</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-2 px-3 text-[#003d9b] bg-[#ebedff] hover:bg-[#dce1ff] rounded-full font-bold text-xs transition-colors cursor-pointer"
                      >
                        Ganti Foto
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveProof}
                        className="py-2 px-2.5 text-rose-600 hover:bg-rose-50 rounded-full font-bold text-xs transition-colors cursor-pointer ml-auto"
                        title="Hapus foto ini"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>}

            {/* Manual payment instructions */}
            {activeOrder.paymentMethod === 'qris' && <div className="bg-[#f3f2ff] p-4 rounded-xl flex flex-col gap-2 border border-[#dce1ff]">
              <div className="flex items-center gap-1.5 font-bold text-xs md:text-sm text-[#071747]">
                <span className="material-symbols-outlined text-[#003d9b] text-[18px]">help</span>
                <span>Panduan Bayar Menggunakan QRIS</span>
              </div>
              <ol className="flex flex-col gap-1 list-decimal list-inside text-xs text-[#434654] leading-relaxed">
                <li>Buka aplikasi e-wallet atau mobile banking Anda (BCA, GoPay, OVO, ShopeePay, DANA, Livin', BRImo).</li>
                <li>Pilih fitur <strong>"Scan QR"</strong> atau <strong>"Bayar"</strong> di aplikasi Anda.</li>
                <li>Minta kode QRIS resmi dari kasir, lalu pindai kode tersebut.</li>
                <li>Pastikan nama merchant sesuai dengan informasi resmi yang diberikan kasir.</li>
                <li>Konfirmasi total tagihan tepat <strong>{formatRupiah(totalAmount)}</strong> dan masukkan PIN Anda.</li>
                <li>Setelah berhasil, ambil tangkapan layar (screenshot) dan <strong>unggah pada kolom bukti transfer di atas</strong>.</li>
              </ol>
            </div>}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Order Detail Summary Card */}
            <div className="bg-white rounded-2xl shadow-md border border-[#D0E2FF] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#ebedff]">
                <span className="font-bold text-sm text-[#071747]">Rincian Meja #{tableNumber}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f3f2ff] text-[#003d9b] text-[11px] font-bold">
                  {activeOrder.items.length} Menu
                </span>
              </div>

              {/* Product Item Micro-list */}
              <div className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1">
                {activeOrder.items.map((ci) => (
                  <div key={ci.cartItemId} className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-lg bg-[#f3f2ff] shrink-0 overflow-hidden">
                      <img
                        src={ci.item.image}
                        alt={ci.item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#071747] truncate">
                        {ci.item.name}
                      </span>
                      <span className="text-[10px] text-[#737685] truncate">
                        {ci.quantity}x • {ci.modifier?.temperature || 'Segar'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#071747] shrink-0">
                      {formatRupiah(ci.unitPrice * ci.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full bg-[#ebedff] h-px"></div>

              {/* Subtotal Breakdown Calculation */}
              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between text-[#434654]">
                  <span>Subtotal Item</span>
                  <span>{formatRupiah(activeOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#434654]">
                  <span>Biaya Layanan Meja</span>
                  <span className="text-[#003d9b] font-bold">GRATIS</span>
                </div>
                <div className="flex justify-between text-[#071747] font-bold text-sm pt-2 border-t border-[#ebedff]">
                  <span>Total Tagihan</span>
                  <span className="text-[#003d9b]">{formatRupiah(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Safe Transaction Security Trust Mark */}
            <div className="flex items-center gap-2 px-1 text-[#737685]">
              <span className="material-symbols-outlined text-[18px]">encrypted</span>
              <span className="text-[10px]">
                Transaksi terlindungi enkripsi QRIS Bank Indonesia &amp; ASPI.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Photo Viewer Modal */}
      {fullscreenPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setFullscreenPreview(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-lg w-full p-4 flex flex-col gap-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-sm text-[#071747]">
                Pratinjau Bukti Transfer
              </span>
              <button
                type="button"
                onClick={() => setFullscreenPreview(null)}
                className="text-slate-500 hover:text-slate-900 p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="w-full max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-100 rounded-xl p-2">
              <img
                src={fullscreenPreview}
                alt="Bukti Transfer Penuh"
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
