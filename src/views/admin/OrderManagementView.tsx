import React, { useState, useMemo } from 'react';
import {
  Search,
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Filter,
  Eye,
  AlertCircle,
  X,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminOrder, OrderStatus } from '../../types/admin';
import { StatusBadge } from '../../components/admin/Badge';
import { formatRupiah } from '../../data/menuData';
import { AdminModal } from '../../components/admin/AdminModal';

export const OrderManagementView: React.FC = () => {
  const {
    orders,
    selectedOrder,
    setSelectedOrder,
    updateOrderStatus,
    simulateEmptyOrders,
    setSimulateEmptyOrders,
  } = useAdmin();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'all'>('today');

  // Status Change Confirmation Modal
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    targetStatus: OrderStatus;
    reasonRequired?: boolean;
  } | null>(null);
  const [cancellationReasonInput, setCancellationReasonInput] = useState('');
  const [reasonError, setReasonError] = useState('');

  // Filtering
  const filteredOrders = useMemo(() => {
    if (simulateEmptyOrders) return [];

    return orders.filter((order) => {
      const matchSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || order.orderStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter, simulateEmptyOrders]);

  const handleOpenStatusConfirm = (orderId: string, targetStatus: OrderStatus) => {
    setPendingStatusChange({
      orderId,
      targetStatus,
      reasonRequired: targetStatus === 'dibatalkan',
    });
    setCancellationReasonInput('');
    setReasonError('');
  };

  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange) return;

    if (pendingStatusChange.targetStatus === 'dibatalkan' && !cancellationReasonInput.trim()) {
      setReasonError('Mohon berikan alasan pembatalan pesanan untuk arsip kasir.');
      return;
    }

    updateOrderStatus(
      pendingStatusChange.orderId,
      pendingStatusChange.targetStatus,
      cancellationReasonInput.trim()
    );
    setPendingStatusChange(null);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#071747] tracking-tight">
              Manajemen Pesanan
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052cc] border border-blue-200 font-bold">
              {filteredOrders.length} Pesanan
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Daftar antrean santap di tempat (dine-in), status pemrosesan barista & dapur, dan instruksi khusus pelanggan.
          </p>
        </div>

        {/* State Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulateEmptyOrders(!simulateEmptyOrders)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              simulateEmptyOrders
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Uji tampilan ketika belum ada pesanan sama sekali"
          >
            {simulateEmptyOrders ? 'Empty State Aktif' : 'Simulasi Pesanan Kosong'}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID (#SHB-1094), nomor meja, atau nama pemesan..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Range Tabs */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 shrink-0">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                dateFilter === 'today'
                  ? 'bg-white text-[#071747] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                dateFilter === 'week'
                  ? 'bg-white text-[#071747] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                dateFilter === 'all'
                  ? 'bg-white text-[#071747] font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
          </div>
        </div>

        {/* Status Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'menunggu', label: 'Menunggu' },
            { id: 'dikonfirmasi', label: 'Dikonfirmasi' },
            { id: 'diracik', label: 'Sedang Diracik' },
            { id: 'selesai', label: 'Selesai' },
            { id: 'dibatalkan', label: 'Dibatalkan' },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            const count =
              tab.id === 'all'
                ? orders.length
                : orders.filter((o) => o.orderStatus === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-2xs font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#071747]">Belum Ada Pesanan Masuk</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {simulateEmptyOrders
                ? 'Mode simulasi pesanan kosong sedang aktif.'
                : 'Tidak ada data pesanan yang sesuai dengan filter atau kata kunci pencarian.'}
            </p>
            {simulateEmptyOrders && (
              <button
                onClick={() => setSimulateEmptyOrders(false)}
                className="px-4 py-2 text-xs font-bold text-[#0052cc] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                Kembalikan Daftar Pesanan Aktif
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8ff] text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">No. Pesanan</th>
                  <th className="py-3.5 px-4">Tanggal & Jam</th>
                  <th className="py-3.5 px-4">Nama Pelanggan</th>
                  <th className="py-3.5 px-4">Meja Santap</th>
                  <th className="py-3.5 px-4">Ringkasan Item</th>
                  <th className="py-3.5 px-4 text-right">Total Tagihan</th>
                  <th className="py-3.5 px-4">Status Pembayaran</th>
                  <th className="py-3.5 px-4">Status Pesanan</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-blue-50/25 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#071747]">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {order.createdAt}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {order.customerName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#0052cc] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                        {order.tableNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="line-clamp-1 max-w-[200px]">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#071747] text-sm tabular-nums">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.paymentStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.orderStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-[#0052cc] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                      >
                        Rincian
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-out Order Detail Drawer (Modal) */}
      {selectedOrder && (
        <AdminModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Detail Pesanan: ${selectedOrder.id}`}
          description={`Santap di Tempat · ${selectedOrder.tableNumber} · Dipesan pada ${selectedOrder.createdAt}`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            {/* Customer & Status Header Summary */}
            <div className="p-4 bg-[#faf8ff] rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 block">Pemesan Meja:</span>
                <span className="text-sm font-extrabold text-[#071747]">
                  {selectedOrder.customerName}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-[#0052cc]">{selectedOrder.tableNumber}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">
                    Metode: {selectedOrder.paymentMethod.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Pembayaran:</span>
                  <StatusBadge status={selectedOrder.paymentStatus} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status Pesanan:</span>
                  <StatusBadge status={selectedOrder.orderStatus} size="sm" />
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {selectedOrder.customerNotes && (
              <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-lg text-xs">
                <span className="font-bold text-amber-900 block mb-0.5">Catatan Khusus Pelanggan:</span>
                <p className="text-amber-800 italic">&ldquo;{selectedOrder.customerNotes}&rdquo;</p>
              </div>
            )}

            {/* Cancellation Reason if cancelled */}
            {selectedOrder.orderStatus === 'dibatalkan' && selectedOrder.cancellationReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs">
                <span className="font-bold text-rose-900 block mb-0.5">Alasan Pembatalan:</span>
                <p className="text-rose-800">{selectedOrder.cancellationReason}</p>
              </div>
            )}

            {/* Itemized Breakdown Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Rincian Menu ({selectedOrder.items.length} Macam)
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-start justify-between gap-3 text-xs bg-white">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-[#071747] text-sm">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          (@ {formatRupiah(item.unitPrice)})
                        </span>
                      </div>

                      {/* Modifiers (Temperature, Sugar, Ice, Toppings) */}
                      {item.modifier && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                          {item.modifier.temperature && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {item.modifier.temperature}
                            </span>
                          )}
                          {item.modifier.sugar && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              Gula: {item.modifier.sugar}
                            </span>
                          )}
                          {item.modifier.ice && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {item.modifier.ice}
                            </span>
                          )}
                        </div>
                      )}

                      {item.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">
                          Ket: {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right font-mono font-bold text-[#071747] text-sm tabular-nums shrink-0">
                      {formatRupiah(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Pesanan</span>
                <span className="font-mono tabular-nums">{formatRupiah(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Pajak Resto (10%)</span>
                <span className="font-mono tabular-nums">{formatRupiah(selectedOrder.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#071747] pt-2 border-t border-slate-200">
                <span>Total Pembayaran</span>
                <span className="font-mono text-base text-[#0052cc] tabular-nums">
                  {formatRupiah(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Foto Bukti Transfer jika ada */}
            {selectedOrder.transferProofImage && (
              <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-white border border-blue-200 shrink-0 shadow-2xs">
                    <img
                      src={selectedOrder.transferProofImage}
                      alt="Bukti Transfer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#071747] flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-[#0052cc]" />
                      <span>Bukti Transfer QRIS Terlampir</span>
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Diunggah langsung oleh pelanggan {selectedOrder.tableNumber}
                    </span>
                  </div>
                </div>
                <a
                  href={selectedOrder.transferProofImage}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white text-[#0052cc] border border-blue-200 hover:bg-blue-50 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                >
                  Lihat Foto
                </a>
              </div>
            )}

            {/* Status Transition Action Controls */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Kontrol Alur Status Pesanan:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {selectedOrder.orderStatus === 'menunggu' && (
                  <button
                    onClick={() => handleOpenStatusConfirm(selectedOrder.id, 'dikonfirmasi')}
                    className="px-4 py-2 bg-[#0052cc] hover:bg-[#0040a2] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Pesanan</span>
                  </button>
                )}

                {(selectedOrder.orderStatus === 'menunggu' ||
                  selectedOrder.orderStatus === 'dikonfirmasi') && (
                  <button
                    onClick={() => handleOpenStatusConfirm(selectedOrder.id, 'diracik')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <ChefHat className="w-4 h-4" />
                    <span>Mulai Diracik di Dapur / Barista</span>
                  </button>
                )}

                {selectedOrder.orderStatus === 'diracik' && (
                  <button
                    onClick={() => handleOpenStatusConfirm(selectedOrder.id, 'selesai')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tandai Selesai & Diantar</span>
                  </button>
                )}

                {selectedOrder.orderStatus !== 'selesai' &&
                  selectedOrder.orderStatus !== 'dibatalkan' && (
                    <button
                      onClick={() => handleOpenStatusConfirm(selectedOrder.id, 'dibatalkan')}
                      className="px-3.5 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-lg transition-colors ml-auto"
                    >
                      Batalkan Pesanan
                    </button>
                  )}
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Confirmation Dialog before critical status change */}
      <AdminModal
        isOpen={!!pendingStatusChange}
        onClose={() => setPendingStatusChange(null)}
        title={
          pendingStatusChange?.targetStatus === 'dibatalkan'
            ? 'Konfirmasi Pembatalan Pesanan'
            : 'Perbarui Status Pesanan'
        }
        description="Perubahan ini akan langsung diperbarui ke layar dapur dan notifikasi pelanggan."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
            Anda akan mengubah status pesanan <strong>{pendingStatusChange?.orderId}</strong> menjadi:{' '}
            <strong className="uppercase">{pendingStatusChange?.targetStatus}</strong>.
          </div>

          {pendingStatusChange?.reasonRequired && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="cancel-reason">
                Alasan Pembatalan <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="cancel-reason"
                rows={2}
                value={cancellationReasonInput}
                onChange={(e) => {
                  setCancellationReasonInput(e.target.value);
                  if (reasonError) setReasonError('');
                }}
                placeholder="Contoh: Pelanggan membatalkan pesanan di meja..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500"
              />
              {reasonError && (
                <p className="text-[11px] text-rose-600 mt-1">{reasonError}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={() => setPendingStatusChange(null)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={handleConfirmStatusChange}
              className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors shadow-2xs ${
                pendingStatusChange?.targetStatus === 'dibatalkan'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-[#0052cc] hover:bg-[#0040a2]'
              }`}
            >
              Ya, Perbarui Status
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};
