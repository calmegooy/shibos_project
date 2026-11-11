import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';

export const TableModal: React.FC = () => {
  const { isTableModalOpen, setIsTableModalOpen, tableNumber, setTableNumber, showToast } =
    useOrder();
  const [tempTable, setTempTable] = useState(tableNumber);

  if (!isTableModalOpen) return null;

  const handleSave = () => {
    if (!tempTable.trim()) {
      showToast('Nomor meja tidak boleh kosong');
      return;
    }
    const cleanNum = tempTable.padStart(2, '0');
    setTableNumber(cleanNum);
    setIsTableModalOpen(false);
    showToast(`Nomor meja diatur ke #${cleanNum}`);
  };

  const quickTables = ['01', '04', '08', '12', '15', '20'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#003d9b]">
            <span className="material-symbols-outlined text-[24px]">table_restaurant</span>
            <h3 className="font-bold text-lg text-[#071747]">Pilih Nomor Meja</h3>
          </div>
          <button
            onClick={() => setIsTableModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#f3f2ff] flex items-center justify-center text-[#737685] hover:text-[#071747]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-xs text-[#434654] leading-relaxed">
          Silakan masukkan nomor meja yang tertera pada stiker akrilik atau QR di meja santap Anda.
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#071747]">Nomor Meja Anda:</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[#003d9b] font-bold text-lg">#</span>
            <input
              type="text"
              maxLength={3}
              value={tempTable}
              onChange={(e) => setTempTable(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full pl-8 pr-4 py-2 bg-[#f3f2ff] border border-[#c3c6d6] rounded-xl text-lg font-bold text-[#003d9b] focus:bg-white focus:border-[#003d9b] outline-none"
              placeholder="08"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-[#737685]">Pilihan Cepat Meja:</span>
          <div className="flex flex-wrap gap-2">
            {quickTables.map((t) => (
              <button
                key={t}
                onClick={() => setTempTable(t)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  tempTable === t
                    ? 'bg-[#003d9b] text-white shadow-xs'
                    : 'bg-[#ebedff] text-[#003d9b] hover:bg-[#dce1ff]'
                }`}
              >
                Meja #{t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-[#ebedff]">
          <button
            onClick={() => setIsTableModalOpen(false)}
            className="flex-1 py-2 px-4 rounded-full border border-[#c3c6d6] text-xs font-semibold text-[#434654] hover:bg-[#f3f2ff]"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-4 rounded-full bg-[#0052cc] hover:bg-[#003d9b] text-white text-xs font-bold shadow-sm"
          >
            Simpan Meja
          </button>
        </div>
      </div>
    </div>
  );
};
