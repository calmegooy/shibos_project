import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { MenuItem, CartItem, ItemModifier, ActiveOrder } from '../types';
import { readSessionState, writeSessionState } from '../lib/sessionState';
import { loadCustomerMenu } from '../lib/menuRepository';
import { supabase } from '../lib/supabase';
import { getStaticCustomerMenu } from '../lib/staticMenu';
import { createDineInOrder, fetchCustomerOrder, uploadCustomerProof } from '../lib/orderRepository';

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
  placeOrder: (method: 'qris' | 'cash') => Promise<boolean>;
  refreshActiveOrder: () => Promise<ActiveOrder | null>;
  uploadTransferProof: (file: File) => Promise<boolean>;
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
  menuItems: MenuItem[];
  menuLoadStatus: 'loading' | 'ready' | 'error' | 'unavailable';
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: React.ReactNode;
  initialView?: ViewType;
  initialSearchQuery?: string;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({
  children,
  initialView = 'beranda',
  initialSearchQuery = '',
}) => {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [tableNumber, setTableNumber] = useState('08');
  const [customerName, setCustomerName] = useState('');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'cash'>('qris');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [customizeModalItem, setCustomizeModalItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoadStatus, setMenuLoadStatus] = useState<'loading' | 'ready' | 'error' | 'unavailable'>('loading');
  const [sessionRestored, setSessionRestored] = useState(false);
  const orderRequestRef = useRef<{ requestId: string; accessToken: string } | null>(null);

  useEffect(() => {
    let active = true;
    if (!supabase) {
      setMenuItems(getStaticCustomerMenu());
      setMenuLoadStatus('ready');
      return () => { active = false; };
    }
    void loadCustomerMenu(supabase).then((items) => {
      if (!active) return;
      setMenuItems(items);
      setMenuLoadStatus('ready');
    }).catch(() => {
      if (!active) return;
      setMenuItems([]);
      setMenuLoadStatus('error');
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const snapshot = typeof window === 'undefined' ? null : readSessionState(window.sessionStorage)?.customer;
    if (snapshot) {
      if (typeof snapshot.tableNumber === 'string') setTableNumber(snapshot.tableNumber);
      if (typeof snapshot.customerName === 'string') setCustomerName(snapshot.customerName);
      if (typeof snapshot.kitchenNotes === 'string') setKitchenNotes(snapshot.kitchenNotes);
      if (Array.isArray(snapshot.cartItems)) setCartItems(snapshot.cartItems as CartItem[]);
      if (snapshot.paymentMethod === 'qris' || snapshot.paymentMethod === 'cash') {
        setPaymentMethod(snapshot.paymentMethod);
      }
      const restoredOrder = snapshot.activeOrder as Record<string, unknown> | null;
      setActiveOrder(
        typeof restoredOrder === 'object' && restoredOrder !== null &&
          typeof restoredOrder.databaseId === 'string' && typeof restoredOrder.accessToken === 'string'
          ? restoredOrder as unknown as ActiveOrder
          : null
      );
    }
    setSessionRestored(true);
  }, []);

  // Active placed order
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);

  useEffect(() => {
    if (!sessionRestored || typeof window === 'undefined') return;
    writeSessionState(window.sessionStorage, {
      customer: { tableNumber, customerName, kitchenNotes, cartItems, paymentMethod, activeOrder, searchQuery },
    });
  }, [sessionRestored, tableNumber, customerName, kitchenNotes, cartItems, paymentMethod, activeOrder, searchQuery]);

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

  const makeSecret = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join('');

  const placeOrder = async (method: 'qris' | 'cash'): Promise<boolean> => {
    if (!supabase) {
      showToast('Pemesanan belum tersedia karena Supabase belum dikonfigurasi.');
      return false;
    }
    if (!cartItems.length) {
      showToast('Keranjang masih kosong.');
      return false;
    }
    if (!orderRequestRef.current) {
      orderRequestRef.current = { requestId: crypto.randomUUID(), accessToken: makeSecret() };
    }
    const credentials = orderRequestRef.current;
    try {
      const order = await createDineInOrder(supabase, {
        tableNumber, customerName, kitchenNotes, paymentMethod: method, cartItems,
        requestId: credentials.requestId, accessToken: credentials.accessToken,
      });
      orderRequestRef.current = null;
      setActiveOrder(order);
      setCartItems([]);
      setCurrentView('pembayaran');
      showToast(`Pesanan ${order.orderId} berhasil disimpan.`);
      return true;
    } catch {
      showToast('Pesanan belum tersimpan. Keranjang tetap aman; silakan coba lagi.');
      return false;
    }
  };

  const refreshActiveOrder = async (): Promise<ActiveOrder | null> => {
    if (!supabase || !activeOrder) return null;
    try {
      const refreshed = await fetchCustomerOrder(supabase, activeOrder);
      setActiveOrder(refreshed);
      return refreshed;
    } catch {
      showToast('Status pesanan belum dapat diperbarui. Coba lagi sebentar.');
      return null;
    }
  };

  const uploadTransferProof = async (file: File): Promise<boolean> => {
    if (!supabase || !activeOrder) return false;
    try {
      const path = await uploadCustomerProof(supabase, activeOrder, file);
      setActiveOrder((current) => current ? { ...current, transferProofPath: path, paymentStatus: 'menunggu_verifikasi' } : current);
      showToast('Bukti pembayaran tersimpan dan menunggu verifikasi kasir.');
      await refreshActiveOrder();
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Bukti pembayaran gagal dikirim.');
      return false;
    }
  };

  useEffect(() => {
    if (!activeOrder || !['pembayaran', 'pesanan'].includes(currentView) || !supabase) return;
    const client = supabase;
    let active = true;
    const refresh = () => {
      void fetchCustomerOrder(client, activeOrder).then((order) => {
        if (active) setActiveOrder(order);
      }).catch(() => undefined);
    };
    refresh();
    const timer = window.setInterval(refresh, 10000);
    return () => { active = false; window.clearInterval(timer); };
  }, [activeOrder?.databaseId, currentView]);

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
        refreshActiveOrder,
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
        menuItems,
        menuLoadStatus,
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
