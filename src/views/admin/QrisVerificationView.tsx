import React, { useState, useMemo } from 'react';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
  Info,
  Calendar,
  Check,
  Search,
  Image as ImageIcon,
  ZoomIn,
  Maximize2,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { QrisTransaction } from '../../types/admin';
import { REJECTION_REASONS } from '../../data/mockAdminData';
import { StatusBadge } from '../../components/admin/Badge';
import { formatRupiah } from '../../data/menuData';
import { AdminModal } from '../../components/admin/AdminModal';

export const QrisVerificationView: React.FC = () => {
  const {
    qrisTransactions,
    verifyQrisPayment,
    rejectQrisPayment,
    currentUser,
    simulateEmptyQris,
    setSimulateEmptyQris,
  } = useAdmin();

  // Active Tab: Pending vs History
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  // Reject Dialog State
  const [transactionToReject, setTransactionToReject] = useState<QrisTransaction | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>(REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');

  // Transfer Proof Modal Zoom State
  const [previewProofModal, setPreviewProofModal] = useState<string | null>(null);

  // Pending vs Verified
  const pendingTransactions = useMemo(() => {
    if (simulateEmptyQris) return [];
    return qrisTransactions.filter((t) => t.status === 'menunggu_verifikasi');
  }, [qrisTransactions, simulateEmptyQris]);

  const historyTransactions = useMemo(() => {
    return qrisTransactions.filter((t) => t.status !== 'menunggu_verifikasi');
  }, [qrisTransactions]);

  const activeList = activeTab === 'pending' ? pendingTransactions : historyTransactions;

  // Selected Transaction for right panel
  const activeTransaction = useMemo(() => {
    if (selectedTransactionId) {
      return qrisTransactions.find((t) => t.id === selectedTransactionId);
    }
    return activeList[0] || null;
  }, [selectedTransactionId, qrisTransactions, activeList]);

  const handleConfirmReject = () => {
    if (!transactionToReject) return;
    const finalReason = selectedReason === 'Lainnya' ? customReason.trim() : selectedReason;
    if (!finalReason) return;

    rejectQrisPayment(transactionToReject.id, finalReason);
    setTransactionToReject(null);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#071747] tracking-tight">
              Pembayaran QRIS
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-bold">
              {pendingTransactions.length} Menunggu Verifikasi
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Alur verifikasi manual QRIS kasir Shiboss. Sesuaikan nominal pembayaran dengan notifikasi mutasi rekening EDC atau mobile banking Shiboss.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* State simulation button */}
          <button
            onClick={() => setSimulateEmptyQris(!simulateEmptyQris)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              simulateEmptyQris
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Uji tampilan ketika semua pembayaran sudah diverifikasi"
          >
            {simulateEmptyQris ? 'Empty State Aktif' : 'Simulasi QRIS Kosong'}
          </button>
        </div>
      </div>

      {/* Manual Workflow Notice (Mandatory Requirement: No invented receipts!) */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#0052cc] shrink-0 mt-0.5" />
        <div>
          <strong>Standar Operasional Prosedur (SOP) Shiboss:</strong> Pelanggan dine-in tidak perlu mengunggah foto struk bukti bayar. Kasir memvalidasi langsung kesesuaian nominal dan nomor transaksi RRN pada mutasi rekening bank / aplikasi QRIS Merchant Shiboss.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => {
            setActiveTab('pending');
            setSelectedTransactionId(null);
          }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-[#0052cc] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Perlu Verifikasi ({pendingTransactions.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('history');
            setSelectedTransactionId(null);
          }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#0052cc] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Riwayat Verifikasi Hari Ini ({historyTransactions.length})</span>
        </button>
      </div>

      {/* Main Split Layout: Transaction List & Focused Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (5 Cols on LG): List of Transactions */}
        <div className="lg:col-span-5 space-y-3">
          {activeList.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#071747]">
                {activeTab === 'pending'
                  ? 'Semua Pembayaran QRIS Telah Diverifikasi'
                  : 'Belum Ada Riwayat Transaksi'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {activeTab === 'pending'
                  ? 'Tidak ada transaksi QRIS pending yang menunggu verifikasi saat ini. Dapur siap meracik pesanan.'
                  : 'Riwayat verifikasi kasir hari ini akan muncul di sini.'}
              </p>
              {simulateEmptyQris && (
                <button
                  onClick={() => setSimulateEmptyQris(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-[#0052cc] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Kembalikan Data Pending
                </button>
              )}
            </div>
          ) : (
            activeList.map((trx) => {
              const isSelected = activeTransaction?.id === trx.id;

              return (
                <div
                  key={trx.id}
                  onClick={() => setSelectedTransactionId(trx.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white shadow-2xs ${
                    isSelected
                      ? 'border-[#0052cc] ring-2 ring-[#0052cc]/10 bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#071747] text-xs">
                          {trx.orderId}
                        </span>
                        <span className="font-bold text-[#0052cc] bg-blue-50 px-1.5 py-0.2 rounded text-[11px] border border-blue-100">
                          {trx.tableNumber}
                        </span>
                        {trx.transferProofImage && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded-full">
                            <ImageIcon className="w-2.5 h-2.5" />
                            <span>Ada Bukti TF</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-600 font-medium mt-0.5 block">
                        {trx.customerName}
                      </span>
                    </div>

                    <StatusBadge status={trx.status} size="sm" />
                  </div>

                  <div className="flex items-baseline justify-between mt-3 pt-2.5 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{trx.createdAt}</span>
                    </span>
                    <span className="text-sm font-extrabold text-[#071747] font-mono tabular-nums">
                      {formatRupiah(trx.amount)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column (7 Cols on LG): Focused Detail & Verification Panel */}
        <div className="lg:col-span-7">
          {activeTransaction ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              {/* Panel Header */}
              <div className="p-5 border-b border-slate-100 bg-[#faf8ff] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Detail Transaksi QRIS
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h3 className="text-base font-extrabold text-[#071747]">
                      {activeTransaction.orderId}
                    </h3>
                    <span className="text-xs font-bold text-[#0052cc]">
                      ({activeTransaction.tableNumber})
                    </span>
                  </div>
                </div>

                <StatusBadge status={activeTransaction.status} size="md" />
              </div>

              {/* Panel Content */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* Nominal Display Card */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                  <span className="text-xs text-slate-500 font-medium block mb-1">
                    Nominal Tagihan yang Harus Diterima:
                  </span>
                  <span className="text-3xl font-extrabold text-[#0052cc] font-mono tabular-nums">
                    {formatRupiah(activeTransaction.amount)}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Terminal ID: <span className="font-mono">{activeTransaction.terminalId}</span>
                  </span>
                </div>

                {/* Bukti Transfer Upload Card */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#071747] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#0052cc]" />
                      <span>Foto Bukti Transfer Pelanggan</span>
                    </span>
                    {activeTransaction.transferProofImage ? (
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">
                        Foto Terlampir
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                        Belum Diunggah
                      </span>
                    )}
                  </div>

                  <div className="p-3.5">
                    {activeTransaction.transferProofImage ? (
                      <div className="flex flex-col sm:flex-row items-center gap-3.5">
                        <div
                          onClick={() => setPreviewProofModal(activeTransaction.transferProofImage!)}
                          className="w-28 h-36 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group relative shrink-0 shadow-2xs flex items-center justify-center"
                        >
                          <img
                            src={activeTransaction.transferProofImage}
                            alt="Bukti Transfer Pelanggan"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1">
                            <ZoomIn className="w-5 h-5" />
                            <span>Perbesar</span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between h-full py-0.5 text-xs text-slate-600 gap-2 flex-1">
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              Struk / Screenshot Transfer QRIS
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Diunggah oleh {activeTransaction.customerName} ({activeTransaction.tableNumber})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Pastikan jam transfer, nominal <strong>{formatRupiah(activeTransaction.amount)}</strong>, dan nama merchant <strong>KEDAI SUSU SEGAR SHIBOSS</strong> sesuai dengan mutasi EDC/m-banking.
                          </p>
                          <button
                            type="button"
                            onClick={() => setPreviewProofModal(activeTransaction.transferProofImage!)}
                            className="self-start text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Buka Foto Ukuran Penuh</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-slate-400 text-xs flex flex-col items-center gap-1.5">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-600">Pelanggan belum mengunggah foto bukti transfer.</span>
                        <span className="text-[11px] text-slate-400">
                          Pelanggan dapat mengunggah bukti pembayaran melalui halaman pembayaran di mejanya.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit & Transaction Parameters */}
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="p-3 flex justify-between">
                    <span className="text-slate-500">Nomor Referensi (RRN)</span>
                    <span className="font-mono font-bold text-slate-800">
                      {activeTransaction.rrn}
                    </span>
                  </div>

                  <div className="p-3 flex justify-between">
                    <span className="text-slate-500">Penyedia / Sumber QRIS</span>
                    <span className="font-semibold text-slate-800">
                      {activeTransaction.issuer}
                    </span>
                  </div>

                  <div className="p-3 flex justify-between">
                    <span className="text-slate-500">Nama Pelanggan</span>
                    <span className="font-semibold text-slate-800">
                      {activeTransaction.customerName}
                    </span>
                  </div>

                  <div className="p-3 flex justify-between">
                    <span className="text-slate-500">Waktu Transaksi Masuk</span>
                    <span className="font-mono text-slate-800">
                      {activeTransaction.createdAt}
                    </span>
                  </div>

                  {activeTransaction.verifiedBy && (
                    <div className="p-3 flex justify-between bg-emerald-50/50">
                      <span className="text-emerald-800 font-medium">Diverifikasi Oleh</span>
                      <span className="font-bold text-emerald-900">
                        {activeTransaction.verifiedBy} ({activeTransaction.verifiedAt})
                      </span>
                    </div>
                  )}

                  {activeTransaction.rejectionReason && (
                    <div className="p-3 bg-rose-50 text-rose-900">
                      <span className="font-bold block mb-0.5">Alasan Penolakan:</span>
                      <p>{activeTransaction.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons for Pending Status */}
                {activeTransaction.status === 'menunggu_verifikasi' ? (
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => verifyQrisPayment(activeTransaction.id)}
                      className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verifikasi Pembayaran Cocok</span>
                    </button>

                    <button
                      onClick={() => setTransactionToReject(activeTransaction)}
                      className="w-full sm:w-auto py-2.5 px-4 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tolak Pembayaran</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-50 text-slate-500 text-xs text-center border border-slate-200">
                    Transaksi ini telah diproses dan statusnya terkunci untuk menjaga integritas pembukuan kasir.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Pilih salah satu transaksi di sebelah kiri untuk melihat rincian pembayaran.
            </div>
          )}
        </div>
      </div>

      {/* Reject Payment Dialog with Required Reason Field */}
      <AdminModal
        isOpen={!!transactionToReject}
        onClose={() => setTransactionToReject(null)}
        title="Tolak Pembayaran QRIS"
        description={`Pesanan ${transactionToReject?.orderId} (${transactionToReject?.tableNumber})`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 leading-relaxed">
            Pembayaran akan ditandai <strong>Ditolak</strong> dan pesanan pelanggan di meja akan otomatis dibatalkan.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Alasan Penolakan <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2">
              {REJECTION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    selectedReason === reason
                      ? 'border-[#0052cc] bg-blue-50/50 text-[#071747] font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejection-reason"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="mt-0.5 text-[#0052cc]"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              <label
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  selectedReason === 'Lainnya'
                    ? 'border-[#0052cc] bg-blue-50/50 text-[#071747] font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="rejection-reason"
                  checked={selectedReason === 'Lainnya'}
                  onChange={() => setSelectedReason('Lainnya')}
                  className="mt-0.5 text-[#0052cc]"
                />
                <span>Alasan Lainnya (Ketik sendiri)</span>
              </label>
            </div>
          </div>

          {selectedReason === 'Lainnya' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="custom-reason">
                Keterangan Alasan
              </label>
              <textarea
                id="custom-reason"
                rows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Tuliskan alasan penolakan secara spesifik..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => setTransactionToReject(null)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-2xs"
            >
              Konfirmasi Tolak Pembayaran
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Fullscreen Photo Zoom Modal */}
      {previewProofModal && (
        <AdminModal
          isOpen={!!previewProofModal}
          onClose={() => setPreviewProofModal(null)}
          title="Pratinjau Foto Bukti Transfer"
          description="Pastikan nominal, jam, dan nama merchant sesuai dengan riwayat mutasi rekening."
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="w-full max-h-[65vh] overflow-auto flex items-center justify-center bg-slate-100 rounded-xl p-3 border border-slate-200">
              <img
                src={previewProofModal}
                alt="Bukti Transfer Penuh"
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewProofModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};
