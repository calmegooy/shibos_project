import React from 'react';
import { useOrder } from '../context/OrderContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useOrder();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#071747] text-white px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-xl z-50 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
      <span className="material-symbols-outlined text-[#bb0016] text-[18px]">
        check_circle
      </span>
      <span>{toastMessage}</span>
    </div>
  );
};
