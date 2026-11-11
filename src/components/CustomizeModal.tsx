import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../data/menuData';

export const CustomizeModal: React.FC = () => {
  const { customizeModalItem, setCustomizeModalItem, addToCart } = useOrder();

  const [temperature, setTemperature] = useState<'Dingin' | 'Hangat'>('Dingin');
  const [sugar, setSugar] = useState<'Normal' | 'Kurang Manis' | 'Tanpa Gula'>('Normal');
  const [ice, setIce] = useState<'Es Normal' | 'Sedikit Es' | 'Tanpa Es'>('Es Normal');
  const [toppings, setToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (!customizeModalItem) return null;

  const toggleTopping = (topping: string) => {
    setToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

  const itemUnitPrice = customizeModalItem.price + toppings.length * 3000;
  const totalPrice = itemUnitPrice * quantity;

  const handleConfirm = () => {
    addToCart(
      customizeModalItem,
      quantity,
      {
        temperature,
        sugar,
        ice: temperature === 'Dingin' ? ice : undefined,
        toppings,
      }
    );
    setCustomizeModalItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 md:p-6 shadow-2xl flex flex-col gap-4">
        {/* Header with image */}
        <div className="flex items-start justify-between gap-3 border-b border-[#ebedff] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f3f2ff] shrink-0">
              <img
                src={customizeModalItem.image}
                alt={customizeModalItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#0052cc] font-bold uppercase tracking-wider">
                Kustomisasi Rasa
              </span>
              <h3 className="font-bold text-base md:text-lg text-[#071747]">
                {customizeModalItem.name}
              </h3>
              <span className="text-sm font-extrabold text-[#003d9b]">
                {formatRupiah(customizeModalItem.price)}
              </span>
            </div>
          </div>
          <button
            onClick={() => setCustomizeModalItem(null)}
            className="w-8 h-8 rounded-full bg-[#f3f2ff] flex items-center justify-center text-[#737685] hover:text-[#071747] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Temperature option */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[#071747]">1. Pilihan Suhu:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTemperature('Dingin')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                temperature === 'Dingin'
                  ? 'bg-[#0052cc] border-[#0052cc] text-white shadow-xs'
                  : 'bg-[#faf8ff] border-[#dce1ff] text-[#434654] hover:bg-[#ebedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">ac_unit</span>
              <span>Dingin (Segar Dingin)</span>
            </button>
            <button
              type="button"
              onClick={() => setTemperature('Hangat')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                temperature === 'Hangat'
                  ? 'bg-[#bb0016] border-[#bb0016] text-white shadow-xs'
                  : 'bg-[#faf8ff] border-[#dce1ff] text-[#434654] hover:bg-[#ebedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
              <span>Hangat (Murni Lembut)</span>
            </button>
          </div>
        </div>

        {/* Ice Level (only if cold) */}
        {temperature === 'Dingin' && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#071747]">2. Takaran Es Batu:</span>
            <div className="grid grid-cols-3 gap-2">
              {(['Es Normal', 'Sedikit Es', 'Tanpa Es'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setIce(lvl)}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                    ice === lvl
                      ? 'bg-[#ebedff] border-[#0052cc] text-[#0052cc] font-bold shadow-xs'
                      : 'bg-[#faf8ff] border-[#dce1ff] text-[#434654] hover:bg-[#ebedff]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sugar Level */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[#071747]">3. Tingkat Kemanisan:</span>
          <div className="grid grid-cols-3 gap-2">
            {(['Normal', 'Kurang Manis', 'Tanpa Gula'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSugar(lvl)}
                className={`py-2 px-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                  sugar === lvl
                    ? 'bg-[#ebedff] border-[#0052cc] text-[#0052cc] font-bold shadow-xs'
                    : 'bg-[#faf8ff] border-[#dce1ff] text-[#434654] hover:bg-[#ebedff]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Toppings */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#071747]">4. Tambahan Topping (Opsional):</span>
            <span className="text-[11px] text-[#737685]">+Rp3.000 / topping</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'Cincau', name: 'Cincau Hitam Segar' },
              { id: 'Jelly', name: 'Jelly Mutiara' },
            ].map((top) => {
              const active = toppings.includes(top.name);
              return (
                <button
                  key={top.id}
                  type="button"
                  onClick={() => toggleTopping(top.name)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    active
                      ? 'bg-[#ebedff] border-[#0052cc] text-[#0052cc] font-bold shadow-xs'
                      : 'bg-[#faf8ff] border-[#dce1ff] text-[#434654] hover:bg-[#ebedff]'
                  }`}
                >
                  <span>{top.name}</span>
                  <span className="material-symbols-outlined text-[16px]">
                    {active ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Stepper & Add Button */}
        <div className="flex items-center justify-between pt-4 border-t border-[#ebedff]">
          <div className="flex items-center bg-[#f3f2ff] rounded-full p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full bg-white text-[#003d9b] font-bold flex items-center justify-center hover:bg-[#003d9b] hover:text-white transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-bold text-[#071747]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-full bg-[#003d9b] text-white font-bold flex items-center justify-center hover:bg-[#0052cc] transition-colors"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 bg-[#bb0016] hover:bg-[#e32128] text-white px-5 py-2.5 rounded-full text-xs md:text-sm font-bold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>Tambah</span>
            <span>•</span>
            <span>{formatRupiah(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
