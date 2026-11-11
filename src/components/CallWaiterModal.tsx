import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';

export const CallWaiterModal: React.FC = () => {
  const { isWaiterModalOpen, setIsWaiterModalOpen, tableNumber, showToast } = useOrder();
  const [selectedReason, setSelectedReason] = useState('Sedotan & Tisu Ekstra');
  const [notes, setNotes] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  if (!isWaiterModalOpen) return null;

  const reasons = [
    'Sedotan & Tisu Ekstra',
    'Minta Sendok / Garpu',
    'Kendala Pembayaran / Scan QR',
    'Pesan Tambahan di Tempat',
    'Bantuan Pelayan Lainnya',
  ];

  const handleSendCall = () => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      setIsWaiterModalOpen(false);
      showToast(`Panggilan terkirim! Pramusaji sedang menuju Meja #${tableNumber}`);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#bb0016]">
            <span className="material-symbols-outlined text-[24px]">room_service</span>
            <h3 className="font-bold text-lg text-[#071747]">Panggil Pelayan Meja</h3>
          </div>
          <button
            onClick={() => setIsWaiterModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#f3f2ff] flex items-center justify-center text-[#737685] hover:text-[#071747]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-[#f3f2ff] px-3 py-1 rounded-full text-xs font-bold text-[#003d9b] self-start">
          <span className="material-symbols-outlined text-[16px]">pin_drop</span>
          <span>Permintaan untuk Meja #{tableNumber}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[#071747]">Pilih Kebutuhan Anda:</span>
          <div className="flex flex-col gap-1.5">
            {reasons.map((reason) => (
              <label
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs cursor-pointer border transition-all ${
                  selectedReason === reason
                    ? 'bg-[#ebedff] border-[#0052cc] text-[#003d9b] font-bold'
                    : 'bg-[#faf8ff] border-[#dce1ff] text-[#434654] hover:bg-[#f3f2ff]'
                }`}
              >
                <span>{reason}</span>
                {selectedReason === reason && (
                  <span className="material-symbols-outlined text-[16px] text-[#0052cc]">
                    check_circle
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-[#737685]">
            Catatan Tambahan (Opsional):
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="cth: Tolong bawakan sedotan kertas 2 buah"
            className="w-full px-3 py-1.5 bg-[#f3f2ff] border border-[#c3c6d6] rounded-lg text-xs text-[#071747] outline-none focus:bg-white focus:border-[#003d9b]"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-[#ebedff]">
          <button
            onClick={() => setIsWaiterModalOpen(false)}
            className="flex-1 py-2 px-4 rounded-full border border-[#c3c6d6] text-xs font-semibold text-[#434654] hover:bg-[#f3f2ff]"
          >
            Tutup
          </button>
          <button
            onClick={handleSendCall}
            disabled={isCalling}
            className="flex-1 py-2 px-4 rounded-full bg-[#bb0016] hover:bg-[#e32128] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
          >
            {isCalling ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
                <span>Memanggil...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                <span>Panggil Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
