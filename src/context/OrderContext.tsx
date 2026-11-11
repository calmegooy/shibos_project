import React, { createContext, useContext, useState, useMemo } from 'react';
import { MenuItem, CartItem, ItemModifier, ActiveOrder } from '../types';
import { INITIAL_CART_ITEMS } from '../data/menuData';

export type ViewType = 'beranda' | 'menu' | 'keranjang' | 'checkout' | 'pembayaran' | 'pesanan';

interface OrderContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  tableNumber: string;
  setTableNumber: (num: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  kitchenNotes: string;
  setKitchenNotes: (notes: string) => void;
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, modifier?: ItemModifier, notes?: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  taxAmount: number;
  voucherCode: string;
  voucherDiscount: number;
  finalTotal: number;
  paymentMethod: 'qris' | 'cash';
  setPaymentMethod: (method: 'qris' | 'cash') => void;
  activeOrder: ActiveOrder | null;
  placeOrder: (method: 'qris' | 'cash') => void;
  confirmPayment: () => void;
  uploadTransferProof: (proofUrl: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isTableModalOpen: boolean;
  setIsTableModalOpen: (open: boolean) => void;
  isWaiterModalOpen: boolean;
  setIsWaiterModalOpen: (open: boolean) => void;
  customizeModalItem: MenuItem | null;
  setCustomizeModalItem: (item: MenuItem | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('beranda');
  const [tableNumber, setTableNumber] = useState('08');
  const [customerName, setCustomerName] = useState('');
  const [kitchenNotes, setKitchenNotes] = useState('Es sedang, gula normal untuk seluruh gelas susu.');
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'cash'>('qris');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [customizeModalItem, setCustomizeModalItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Active placed order
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>({
    orderId: '#SB-2025-0891',
    tableNumber: '08',
    customerName: '',
    items: INITIAL_CART_ITEMS,
    subtotal: 34000,
    tax: 0,
    discount: 0,
    total: 34000,
    paymentMethod: 'qris',
    isPaid: true,
    status: 'diracik',
    createdAt: 'Hari Ini, 14:15 WIB',
    kitchenNotes: 'Es sedang, gula normal untuk seluruh gelas susu.',
  });

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  const taxAmount = 0;
  const voucherCode = '';
  const voucherDiscount = 0;
  const finalTotal = cartTotal;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const addToCart = (item: MenuItem, quantity = 1, modifier?: ItemModifier, customNotes?: string) => {
    setCartItems((prev) => {
      const modifierKey = modifier ? `${modifier.temperature}-${modifier.sugar}-${modifier.ice}-${modifier.toppings.join(',')}` : 'default';
      const existingIndex = prev.findIndex(
        (ci) => ci.item.id === item.id && (ci.modifier ? `${ci.modifier.temperature}-${ci.modifier.sugar}-${ci.modifier.ice}-${ci.modifier.toppings.join(',')}` : 'default') === modifierKey
      );

      let unitPrice = item.price;
      if (modifier?.toppings) {
        unitPrice += modifier.toppings.length * 3000;
      }

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      let generatedNotes = customNotes;
      if (!generatedNotes && modifier) {
        const parts: string[] = [];
        parts.push(modifier.temperature);
        if (modifier.ice) parts.push(modifier.ice);
        parts.push(modifier.sugar);
        if (modifier.toppings.length > 0) {
          parts.push(`Top: ${modifier.toppings.join(', ')}`);
        }
        generatedNotes = parts.join(', ');
      }

      const newCartItem: CartItem = {
        cartItemId: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        item,
        quantity,
        modifier,
        notes: generatedNotes || (item.category === 'minuman' ? 'Es sedang, Gula normal' : undefined),
        unitPrice,
      };

      return [...prev, newCartItem];
    });

    showToast(`${item.name} ditambahkan ke pesanan!`);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.cartItemId === cartItemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null);
    });
    showToast('Jumlah pesanan diperbarui');
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
    showToast('Menu dihapus dari keranjang');
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('Keranjang meja telah dikosongkan');
  };

  const placeOrder = (method: 'qris' | 'cash') => {
    const orderNum = `#SB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: ActiveOrder = {
      orderId: orderNum,
      tableNumber,
      customerName,
      items: [...cartItems],
      subtotal: cartTotal,
      tax: taxAmount,
      discount: voucherDiscount,
      total: finalTotal,
      paymentMethod: method,
      isPaid: false,
      status: 'diterima',
      createdAt: `Hari Ini, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      kitchenNotes,
    };
    setActiveOrder(newOrder);
    setCurrentView('pembayaran');
  };

  const confirmPayment = () => {
    if (activeOrder) {
      setActiveOrder({
        ...activeOrder,
        isPaid: true,
        status: 'diracik',
      });
    }
    showToast('Pembayaran berhasil! Barista sedang meracik pesanan Anda.');
    setCurrentView('pesanan');
  };

  const uploadTransferProof = (proofUrl: string) => {
    if (activeOrder) {
      setActiveOrder({
        ...activeOrder,
        transferProofImage: proofUrl,
      });
    }
    showToast('Bukti transfer berhasil diunggah! Kasir Shiboss sedang memverifikasi.');
  };

  return (
    <OrderContext.Provider
      value={{
        currentView,
        setCurrentView,
        tableNumber,
        setTableNumber,
        customerName,
        setCustomerName,
        kitchenNotes,
        setKitchenNotes,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        taxAmount,
        voucherCode,
        voucherDiscount,
        finalTotal,
        paymentMethod,
        setPaymentMethod,
        activeOrder,
        placeOrder,
        confirmPayment,
        uploadTransferProof,
        toastMessage,
        showToast,
        isTableModalOpen,
        setIsTableModalOpen,
        isWaiterModalOpen,
        setIsWaiterModalOpen,
        customizeModalItem,
        setCustomizeModalItem,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
