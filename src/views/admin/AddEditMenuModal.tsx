import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { SHIBOSS_CATEGORIES } from '../../data/shiboss91Menu';
import { ShibossCategory, AdminMenuItem } from '../../types/admin';
import { AdminModal } from '../../components/admin/AdminModal';

export const AddEditMenuModal: React.FC = () => {
  const { isAddEditModalOpen, closeAddEditModal, editingItem, saveMenuItem } = useAdmin();

  const isEdit = !!editingItem;

  // Form States
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ShibossCategory>('Special Susu');
  const [price, setPrice] = useState<number>(12000);
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isCustomerVisible, setIsCustomerVisible] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{ name?: string; price?: string }>({});

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setPrice(editingItem.price);
      setDescription(editingItem.description);
      setIsAvailable(editingItem.isAvailable);
      setIsCustomerVisible(editingItem.isCustomerVisible ?? false);
      setImageUrl(editingItem.image || '');
    } else {
      setName('');
      setCategory('Special Susu');
      setPrice(12000);
      setDescription('');
      setIsAvailable(true);
      setIsCustomerVisible(false);
      setImageUrl('');
    }
    setValidationErrors({});
  }, [editingItem, isAddEditModalOpen]);

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; price?: string } = {};

    if (!name.trim()) {
      errors.name = 'Nama menu wajib diisi.';
    }
    if (!price || price < 1000) {
      errors.price = 'Harga menu minimal Rp1.000.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      await saveMenuItem({
        name: name.trim(),
        category,
        price,
        description: description.trim(),
        isAvailable,
        isCustomerVisible,
        image: imageUrl,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const availableCategories = SHIBOSS_CATEGORIES.filter((c) => c !== 'Semua') as ShibossCategory[];

  return (
    <AdminModal
      isOpen={isAddEditModalOpen}
      onClose={closeAddEditModal}
      title={isEdit ? `Edit Menu: ${editingItem?.name}` : 'Tambah Menu Baru'}
      description="Lengkapi informasi hidangan cafe untuk ditampilkan di sistem kasir dan meja pemesanan."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="menu-name">
              Nama Menu <span className="text-rose-500">*</span>
            </label>
            <input
              id="menu-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationErrors.name) setValidationErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder="Contoh: Susu Caramel Macchiato"
              className={`w-full px-3.5 py-2 text-xs rounded-lg border transition-colors focus:outline-none ${
                validationErrors.name
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]'
              }`}
            />
            {validationErrors.name && (
              <p className="text-[11px] text-rose-600 mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="menu-category">
              Kategori Produk <span className="text-rose-500">*</span>
            </label>
            <select
              id="menu-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ShibossCategory)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
            >
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Availability Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="menu-price">
              Harga Resmi (Rp) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Rp
              </span>
              <input
                id="menu-price"
                type="number"
                step="500"
                value={price}
                onChange={(e) => {
                  setPrice(Number(e.target.value));
                  if (validationErrors.price)
                    setValidationErrors((p) => ({ ...p, price: undefined }));
                }}
                className={`w-full pl-9 pr-3.5 py-2 text-xs font-mono font-bold rounded-lg border transition-colors focus:outline-none ${
                  validationErrors.price
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-slate-300 focus:border-[#0052cc]'
                }`}
              />
            </div>
            {validationErrors.price && (
              <p className="text-[11px] text-rose-600 mt-1">{validationErrors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Status Ketersediaan Awal
            </label>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isAvailable ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isAvailable ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs font-semibold text-slate-800">
                {isAvailable ? 'Tersedia untuk Dipesan' : 'Stok Habis / Nonaktif'}
              </span>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <input type="checkbox" checked={isCustomerVisible} onChange={(event) => setIsCustomerVisible(event.target.checked)} className="mt-0.5 accent-[#0052cc]" />
          <span><strong>Tampilkan di katalog pelanggan</strong><br />Jika tidak dicentang, menu hanya terlihat di panel admin.</span>
        </label>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="menu-description">
            Deskripsi Rasa & Komposisi
          </label>
          <textarea
            id="menu-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan karakteristik rasa, susu segar, tingkat kemanisan, atau porsi..."
            className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
          />
        </div>

      {/* Product image URL and real preview */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="menu-image-url">URL Foto Produk</label>
        <input id="menu-image-url" type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://..." className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-[#0052cc] focus:outline-none" />
        <p className="mt-1 text-[11px] text-slate-500">Masukkan URL gambar publik. Pratinjau ditampilkan sebelum disimpan.</p>
        {imageUrl && <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><img src={imageUrl} alt={`Pratinjau ${name || 'foto menu'}`} className="h-14 w-14 rounded-lg border border-slate-200 object-cover" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} /><button type="button" onClick={handleRemoveImage} className="text-xs font-semibold text-rose-700">Hapus foto</button></div>}
      </div>

        {/* Save & Cancel Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={closeAddEditModal}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0040a2] active:bg-[#003380] rounded-lg transition-all shadow-2xs flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                <span>Menyimpan ke Server...</span>
              </>
            ) : (
              <span>{isEdit ? 'Simpan Perubahan' : 'Tambah ke Katalog'}</span>
            )}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};
