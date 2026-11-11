import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
  RotateCw,
  Trash2,
} from 'lucide-react';
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
  const [imageUrl, setImageUrl] = useState<string>('');

  // Upload simulation & validation
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{ name?: string; price?: string }>({});

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setPrice(editingItem.price);
      setDescription(editingItem.description);
      setIsAvailable(editingItem.isAvailable);
      setImageUrl(editingItem.image || '');
    } else {
      setName('');
      setCategory('Special Susu');
      setPrice(12000);
      setDescription('');
      setIsAvailable(true);
      setImageUrl('');
    }
    setValidationErrors({});
    setUploadError(null);
    setUploadProgress(0);
  }, [editingItem, isAddEditModalOpen]);

  // Simulate file drag/selection
  const handleSimulateUpload = (shouldFail: boolean = false) => {
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setIsUploading(false);
          if (shouldFail) {
            setUploadError('Ukuran file melebihi batas 2MB atau format tidak valid (.tiff).');
            return 0;
          } else {
            // Success simulated image
            setImageUrl(
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDBgq-5HBNrgLoWQLg4duGUA4HefRaNRColEZFPNQaeyA3_iAMF_2P_XWkr7Qa1DvEX9WxAuxuegES2xzBZLwu6PCjpcFs0I0jEBNg6X1s5ArlgJn7zOAP5jvav3B3fYr4WvNB2DyzBGd9IAQuvmv7ZVOX3PvNs53JBMOtltnJDU3rqxL9dMje2PnQUGzKytr5dxcg3CsQu7qnhIgXLja0O-FLAx_cu4ytyDZk2Yt_RYYEwgVyTTINnZw'
            );
            return 100;
          }
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setUploadProgress(0);
    setUploadError(null);
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

        {/* Image Upload Zone (Requirement 6) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Foto Produk</label>

          {imageUrl ? (
            /* Uploaded Preview State */
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Foto Produk Aktif
                  </span>
                  <span className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Gambar siap disimpan</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateUpload(false)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Ganti</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty / Upload Drop Zone */
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-5 text-center bg-[#faf8ff] transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0052cc] flex items-center justify-center mx-auto mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                Tarik & letakkan foto menu di sini, atau pilih berkas
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mendukung PNG, JPG, atau WebP hingga batas 2MB. Jika kosong, sistem menggunakan ikon placeholder netral.
              </p>

              {/* Progress bar if simulating upload */}
              {isUploading && (
                <div className="mt-3 max-w-xs mx-auto">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Mengunggah berkas...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0052cc] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons to test upload success / failure */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateUpload(false)}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-[#0052cc] hover:bg-[#0040a2] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Pilih File Foto
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateUpload(true)}
                  disabled={isUploading}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium rounded-lg transition-colors"
                  title="Simulasi skenario berkas ditolak / format gagal"
                >
                  Uji Gagal Upload
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
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
            disabled={isSaving || isUploading}
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
