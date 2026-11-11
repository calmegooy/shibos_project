import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Coffee,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { SHIBOSS_CATEGORIES } from '../../data/shiboss91Menu';
import { AdminMenuItem, ShibossCategory } from '../../types/admin';
import { StatusBadge } from '../../components/admin/Badge';
import { formatRupiah } from '../../data/menuData';
import { AdminModal } from '../../components/admin/AdminModal';

export const MenuManagementView: React.FC = () => {
  const {
    menuItems,
    openAddModal,
    openEditModal,
    deleteMenuItem,
    toggleItemAvailability,
    simulateLoading,
    setSimulateLoading,
    simulateError,
    setSimulateError,
  } = useAdmin();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Delete Confirmation state
  const [itemToDelete, setItemToDelete] = useState<AdminMenuItem | null>(null);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;

      const matchAvailability =
        availabilityFilter === 'all'
          ? true
          : availabilityFilter === 'available'
          ? item.isAvailable
          : !item.isAvailable;

      return matchSearch && matchCategory && matchAvailability;
    });
  }, [menuItems, searchQuery, selectedCategory, availabilityFilter]);

  // Pagination Math
  const totalItems = filteredItems.length;
  const totalPages = itemsPerPage === 0 ? 1 : Math.ceil(totalItems / itemsPerPage);

  const paginatedItems = useMemo(() => {
    if (itemsPerPage === 0) return filteredItems;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setAvailabilityFilter('all');
    setCurrentPage(1);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMenuItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#071747] tracking-tight">
              Manajemen Menu
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052cc] border border-blue-200 font-bold">
              {menuItems.length} Menu Terdaftar
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Kelola seluruh katalog hidangan cafe, harga resmi Rupiah, deskripsi rasa, dan ketersediaan stok dapur.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* State Simulation Toggle (Screen 7 requirements) */}
          <button
            onClick={() => setSimulateLoading(!simulateLoading)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              simulateLoading
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Uji tampilan loading skeleton"
          >
            {simulateLoading ? 'Skeleton Aktif' : 'Simulasi Loading'}
          </button>

          <button
            onClick={() => setSimulateError(!simulateError)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              simulateError
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Uji tampilan gagal koneksi server"
          >
            {simulateError ? 'Error Aktif' : 'Simulasi Error'}
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0040a2] rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Menu</span>
          </button>
        </div>
      </div>

      {/* Error State Banner if simulateError is active */}
      {simulateError ? (
        <div className="p-8 bg-white rounded-xl border border-rose-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#071747]">Gagal Memuat Data Katalog Menu</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Terjadi kendala saat menyinkronkan data dengan database Supabase Shiboss. Periksa koneksi internet atau muat ulang.
          </p>
          <button
            onClick={() => setSimulateError(false)}
            className="px-4 py-2 bg-[#0052cc] text-white text-xs font-bold rounded-lg hover:bg-[#0040a2] transition-colors"
          >
            Coba Muat Ulang Data
          </button>
        </div>
      ) : (
        <>
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari berdasarkan nama menu, kode, atau bahan..."
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

              {/* Availability Filter */}
              <div className="flex items-center gap-1.5 shrink-0">
                <label className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
                  Status:
                </label>
                <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    onClick={() => {
                      setAvailabilityFilter('all');
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      availabilityFilter === 'all'
                        ? 'bg-white text-[#071747] shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => {
                      setAvailabilityFilter('available');
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      availabilityFilter === 'available'
                        ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tersedia
                  </button>
                  <button
                    onClick={() => {
                      setAvailabilityFilter('unavailable');
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      availabilityFilter === 'unavailable'
                        ? 'bg-white text-rose-800 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Habis
                  </button>
                </div>
              </div>
            </div>

            {/* Category Segmented Scroll Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {SHIBOSS_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const count =
                  cat === 'Semua'
                    ? menuItems.length
                    : menuItems.filter((i) => i.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                      isActive
                        ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-2xs font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat}</span>
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

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {simulateLoading ? (
              // Loading Skeleton State
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Memuat data katalog menu...</span>
                </div>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                    <div className="w-20 h-4 bg-slate-200 rounded" />
                    <div className="w-20 h-6 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : paginatedItems.length === 0 ? (
              // Empty State (Search / Filter)
              <div className="py-14 px-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#071747]">Tidak Menemukan Menu</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Tidak ada menu yang sesuai dengan kata kunci &quot;{searchQuery}&quot; atau filter kategori terpilih.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-bold text-[#0052cc] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Semua Filter</span>
                </button>
              </div>
            ) : (
              // Populated Table
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf8ff] text-slate-600 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4 w-14 text-center">No.</th>
                      <th className="py-3.5 px-4 min-w-[280px]">Produk & Keterangan</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4 text-right">Harga Resmi</th>
                      <th className="py-3.5 px-4 text-center">Ketersediaan</th>
                      <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedItems.map((item, index) => {
                      const itemNumber =
                        itemsPerPage === 0 ? index + 1 : (currentPage - 1) * itemsPerPage + index + 1;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-blue-50/25 transition-colors group"
                        >
                          {/* Row Number */}
                          <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                            {itemNumber}
                          </td>

                          {/* Product Image & Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {/* Thumbnail with neutral fallback placeholder */}
                              <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      // Neutral fallback placeholder
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  // Clean neutral placeholder with domain milk icon
                                  <div className="w-full h-full bg-[#f4f8ff] flex flex-col items-center justify-center text-slate-400 p-1 text-center">
                                    <Coffee className="w-4 h-4 text-[#0052cc]/60" />
                                    <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                                      Foto
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#071747] text-xs sm:text-sm">
                                    {item.name}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                                    {item.code}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="text-slate-700 font-medium">{item.category}</span>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[#071747] text-sm tabular-nums whitespace-nowrap">
                            {formatRupiah(item.price)}
                          </td>

                          {/* Availability Toggle Switch */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => toggleItemAvailability(item.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                item.isAvailable
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                              }`}
                              title="Klik untuk ubah ketersediaan di kasir & meja pelanggan"
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  item.isAvailable ? 'bg-emerald-600' : 'bg-rose-600'
                                }`}
                              />
                              <span>{item.isAvailable ? 'Tersedia' : 'Stok Habis'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1.5 text-slate-600 hover:text-[#0052cc] hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit data menu"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setItemToDelete(item)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Hapus menu dari katalog"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!simulateLoading && paginatedItems.length > 0 && (
              <div className="p-4 bg-[#faf8ff] border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span>
                    Menampilkan <strong>{itemsPerPage === 0 ? 1 : (currentPage - 1) * itemsPerPage + 1}</strong> -{' '}
                    <strong>
                      {itemsPerPage === 0
                        ? totalItems
                        : Math.min(currentPage * itemsPerPage, totalItems)}
                    </strong>{' '}
                    dari <strong>{totalItems}</strong> menu
                  </span>

                  <span className="text-slate-300">|</span>

                  <label className="flex items-center gap-1.5 text-slate-500">
                    <span>Per halaman:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700 font-medium focus:outline-none"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={0}>Semua (91)</option>
                    </select>
                  </label>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                      aria-label="Halaman sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="px-3 py-1 font-mono font-medium">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                      aria-label="Halaman selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Hapus Menu dari Katalog"
        description="Tindakan ini akan menghapus produk dari daftar meja kasir dan web pemesanan pelanggan."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900">
            Apakah Anda yakin ingin menghapus <strong>&quot;{itemToDelete?.name}&quot;</strong> ({itemToDelete?.code})?
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={() => setItemToDelete(null)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-2xs"
            >
              Ya, Hapus Menu
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};
