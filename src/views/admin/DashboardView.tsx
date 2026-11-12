import React from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  QrCode,
  ArrowRight,
  Plus,
  UtensilsCrossed,
  Receipt,
  Activity,
  Eye,
  Calendar,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { StatusBadge } from '../../components/admin/Badge';
import { formatRupiah } from '../../data/menuData';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    orders,
    qrisTransactions,
    activityLogs,
    setCurrentScreen,
    setSelectedOrder,
    openAddModal,
    ordersLoadStatus,
  } = useAdmin();

  // Metrics calculated from state
  const awaitingConfirmationCount = orders.filter((o) => o.orderStatus === 'menunggu').length;
  const confirmedCount = orders.filter(
    (o) => o.orderStatus === 'dikonfirmasi' || o.orderStatus === 'diracik'
  ).length;
  const cancelledCount = orders.filter((o) => o.orderStatus === 'dibatalkan').length;
  const pendingQrisCount = qrisTransactions.filter(
    (q) => q.status === 'menunggu_verifikasi'
  ).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0052cc] mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Operasional</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">{currentUser.outlet}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#071747] tracking-tight">
            Selamat Datang, {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Pantau arus pesanan meja santap, verifikasi transaksi QRIS masuk, dan kelola ketersediaan menu kedai susu hari ini.
          </p>
        </div>

        {/* Quick Operational Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={openAddModal}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0040a2] rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Menu</span>
          </button>
          <button
            onClick={() => setCurrentScreen('qris')}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-700" />
            <span>Verifikasi QRIS ({pendingQrisCount})</span>
          </button>
        </div>
      </div>

      {ordersLoadStatus === 'loading' && <p role="status" className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">Memuat pesanan dan pembayaran dari Supabase...</p>}
      {ordersLoadStatus === 'error' && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">Data operasional gagal dimuat. Angka tidak ditampilkan sebagai data live.</p>}

      {/* Summary KPI Cards Grid (The 4 requested status categories) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Menunggu Konfirmasi */}
        <div
          onClick={() => setCurrentScreen('orders')}
          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Menunggu Konfirmasi
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#071747] font-mono tabular-nums">
              {awaitingConfirmationCount}
            </span>
            <span className="text-xs font-medium text-slate-500">pesanan</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-2 flex items-center gap-1">
            <span>Perlu respon cepat kasir</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* 2. Dikonfirmasi & Diproses */}
        <div
          onClick={() => setCurrentScreen('orders')}
          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dikonfirmasi / Diracik
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052cc] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#071747] font-mono tabular-nums">
              {confirmedCount}
            </span>
            <span className="text-xs font-medium text-slate-500">pesanan aktif</span>
          </div>
          <p className="text-[11px] text-blue-700 font-medium mt-2 flex items-center gap-1">
            <span>Dalam antrean barista & dapur</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* 3. Menunggu Verifikasi QRIS */}
        <div
          onClick={() => setCurrentScreen('qris')}
          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-red-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Menunggu Verifikasi QRIS
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#071747] font-mono tabular-nums">
              {pendingQrisCount}
            </span>
            <span className="text-xs font-medium text-slate-500">transaksi</span>
          </div>
          <p className="text-[11px] text-red-600 font-semibold mt-2 flex items-center gap-1">
            <span>Cek mutasi perbankan</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* 4. Dibatalkan Hari Ini */}
        <div
          onClick={() => setCurrentScreen('orders')}
          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pesanan Dibatalkan
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-700 font-mono tabular-nums">
              {cancelledCount}
            </span>
            <span className="text-xs font-medium text-slate-500">pesanan</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2 flex items-center gap-1">
            <span>Riwayat pembatalan meja</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* Main Row: Recent Orders Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-[#071747] text-base tracking-tight">
                Pesanan Terbaru
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                5 transaksi terakhir yang masuk dari meja santap
              </p>
            </div>
            <button
              onClick={() => setCurrentScreen('orders')}
              className="text-xs font-bold text-[#0052cc] hover:text-[#0040a2] flex items-center gap-1"
            >
              <span>Lihat Semua Pesanan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8ff] text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">No. Pesanan</th>
                  <th className="py-3 px-4">Meja & Pelanggan</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4">Pembayaran</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setCurrentScreen('orders');
                    }}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#071747]">
                      {order.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{order.tableNumber}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                        {order.customerName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{order.createdAt}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#071747] tabular-nums">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.paymentStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.orderStatus} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                          setCurrentScreen('orders');
                        }}
                        className="p-1.5 text-slate-500 hover:text-[#0052cc] hover:bg-slate-100 rounded-lg transition-colors"
                        title="Buka rincian pesanan"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Timeline & Shortcuts */}
        <div className="space-y-6">
          {/* Quick Management Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <h3 className="font-extrabold text-[#071747] text-base tracking-tight mb-3">
              Pintasan Operasional
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setCurrentScreen('menu')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-[#faf8ff] hover:bg-blue-50/70 hover:border-blue-200 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0052cc] flex items-center justify-center shrink-0">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#071747]">Katalog Menu</div>
                    <div className="text-[11px] text-slate-500">Kelola 91 produk cafe</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setCurrentScreen('qris')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-[#faf8ff] hover:bg-amber-50/70 hover:border-amber-200 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#071747]">Verifikasi QRIS</div>
                    <div className="text-[11px] text-slate-500">{pendingQrisCount} transaksi pending</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setCurrentScreen('orders')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-[#faf8ff] hover:bg-emerald-50/70 hover:border-emerald-200 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#071747]">Antrean Pesanan Meja</div>
                    <div className="text-[11px] text-slate-500">{awaitingConfirmationCount} butuh respon</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-[#071747] text-base tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0052cc]" />
                <span>Aktivitas Staf & Dapur</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Live</span>
            </div>

            <div className="space-y-3.5 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="relative flex items-start gap-3 pl-1">
                  <div className="w-5 h-5 rounded-full bg-blue-50 border-2 border-white text-[#0052cc] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0052cc]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[11px] gap-2">
                      <span className="font-bold text-slate-800 truncate">{log.title}</span>
                      <span className="text-slate-400 font-mono shrink-0">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">{log.description}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{log.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
