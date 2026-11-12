import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  AdminScreen,
  AdminUser,
  AdminMenuItem,
  AdminOrder,
  QrisTransaction,
  ActivityLog,
  OrderStatus,
  PaymentStatus,
} from '../types/admin';
import { hasAdminAuthorization, resolveAdminAccess } from '../lib/adminAccess';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { loadAdminMenu, removeMenuItem, setMenuAvailability, upsertMenuItem } from '../lib/menuRepository';
import { loadAdminOrders, loadQrisTransactions, markCashPaymentPaid, updateOrderStatus as persistOrderStatus, updateQrisStatus } from '../lib/orderRepository';

export interface AdminToast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AdminContextType {
  // Navigation & Shell
  currentScreen: AdminScreen;
  setCurrentScreen: (screen: AdminScreen) => void;
  viewMode: 'admin' | 'customer';
  setViewMode: (mode: 'admin' | 'customer') => void;
  isSidebarOpenMobile: boolean;
  setIsSidebarOpenMobile: (open: boolean) => void;

  // Auth
  isAuthenticated: boolean;
  authStatus: 'loading' | 'unauthenticated' | 'denied' | 'authorized';
  currentUser: AdminUser;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoginLoading: boolean;
  loginError: string | null;

  // Menu Management
  menuItems: AdminMenuItem[];
  menuLoadStatus: 'loading' | 'ready' | 'error' | 'unavailable';
  editingItem: AdminMenuItem | null;
  isAddEditModalOpen: boolean;
  openAddModal: () => void;
  openEditModal: (item: AdminMenuItem) => void;
  closeAddEditModal: () => void;
  saveMenuItem: (item: Partial<AdminMenuItem>) => Promise<boolean>;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  // Orders Management
  orders: AdminOrder[];
  ordersLoadStatus: 'loading' | 'ready' | 'error';
  selectedOrder: AdminOrder | null;
  setSelectedOrder: (order: AdminOrder | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
  markCashPaymentPaid: (orderId: string) => void;
  pendingOrdersCount: number;

  // QRIS Transactions
  qrisTransactions: QrisTransaction[];
  selectedQris: QrisTransaction | null;
  setSelectedQris: (qris: QrisTransaction | null) => void;
  verifyQrisPayment: (transactionId: string) => void;
  rejectQrisPayment: (transactionId: string, reason: string) => void;
  pendingQrisCount: number;

  // Activity Logs & Notifications
  activityLogs: ActivityLog[];
  notifications: Array<{ id: string; title: string; time: string; read: boolean }>;
  markNotificationsAsRead: () => void;

  // Toast
  adminToast: AdminToast | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: React.ReactNode;
  initialScreen?: AdminScreen;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children, initialScreen = 'dashboard' }) => {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>(initialScreen);
  const [viewMode, setViewMode] = useState<'admin' | 'customer'>('admin');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Auth State
  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'denied' | 'authorized'>('loading');
  const [currentUser, setCurrentUser] = useState<AdminUser>({
    id: '', name: 'Admin', email: '', role: 'Kasir Utama', shift: 'Shift Pagi (08:00 - 15:00)',
    outlet: 'Kedai Shiboss', isOnline: true,
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Menu State
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [menuLoadStatus, setMenuLoadStatus] = useState<'loading' | 'ready' | 'error' | 'unavailable'>('loading');
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoadStatus, setOrdersLoadStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // QRIS State
  const [qrisTransactions, setQrisTransactions] = useState<QrisTransaction[]>([]);
  const [selectedQris, setSelectedQris] = useState<QrisTransaction | null>(null);

  // Activity & Notifications
  const [activityLogs] = useState<ActivityLog[]>([]);
  const [notifications] = useState<Array<{ id: string; title: string; time: string; read: boolean }>>([]);

  // Toast
  const [adminToast, setAdminToast] = useState<AdminToast | null>(null);
  useEffect(() => {
    let active = true;
    const applySession = async (session: Session | null) => {
      if (!active) return;
      if (!session?.user) {
        setAuthStatus('unauthenticated');
        return;
      }

      setAuthStatus('loading');
      const isAdmin = Boolean(supabase && await hasAdminAuthorization(supabase, session.user.id));
      if (!active) return;
      const decision = resolveAdminAccess(false, session.user.id, isAdmin);
      setAuthStatus(decision.status);

      if (decision.status === 'authorized') {
        setCurrentUser({
          ...currentUser,
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'Admin',
        });
      }
    };

    if (!supabase) {
      setAuthStatus('unauthenticated');
      setLoginError('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.');
      return () => { active = false; };
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => { void applySession(session); });
    });
    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setAuthStatus('unauthenticated');
        setLoginError('Tidak dapat memulihkan sesi admin. Silakan masuk kembali.');
        return;
      }
      void applySession(data.session);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const refreshOperationalData = async () => {
    if (!supabase || authStatus !== 'authorized') return;
    try {
      const [nextOrders, nextQris] = await Promise.all([
        loadAdminOrders(supabase),
        loadQrisTransactions(supabase),
      ]);
      setOrders(nextOrders);
      setQrisTransactions(nextQris);
      setSelectedOrder((selected) => selected ? nextOrders.find((order) => order.databaseId === selected.databaseId) ?? null : null);
      setOrdersLoadStatus('ready');
    } catch {
      setOrdersLoadStatus('error');
    }
  };

  useEffect(() => {
    if (authStatus !== 'authorized') return;
    setOrdersLoadStatus('loading');
    void refreshOperationalData();
    const timer = window.setInterval(() => { void refreshOperationalData(); }, 15000);
    return () => window.clearInterval(timer);
  }, [authStatus]);

  useEffect(() => {
    let active = true;
    if (authStatus !== 'authorized') return () => { active = false; };
    if (!supabase) {
      setMenuLoadStatus('unavailable');
      return () => { active = false; };
    }
    setMenuLoadStatus('loading');
    void loadAdminMenu(supabase).then((items) => {
      if (!active) return;
      setMenuItems(items);
      setMenuLoadStatus('ready');
    }).catch(() => {
      if (!active) return;
      setMenuItems([]);
      setMenuLoadStatus('error');
    });
    return () => { active = false; };
  }, [authStatus]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setAdminToast({ id: Date.now().toString(), message, type });
    setTimeout(() => {
      setAdminToast(null);
    }, 3800);
  };

  const hideToast = () => setAdminToast(null);

  // Auth functions
  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoginLoading(true);
    setLoginError(null);

    if (!email || !pass) {
      setIsLoginLoading(false);
      setLoginError('Silakan masukkan email dan kata sandi admin.');
      return false;
    }

    if (!supabase || !isSupabaseConfigured) {
      setIsLoginLoading(false);
      setLoginError('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.');
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
    if (error || !data.user) {
      setIsLoginLoading(false);
      setLoginError(error?.message ?? 'Email atau kata sandi tidak valid.');
      return false;
    }

    const isAdmin = await hasAdminAuthorization(supabase, data.user.id);
    if (!isAdmin) {
      await supabase.auth.signOut();
      setAuthStatus('denied');
      setIsLoginLoading(false);
      setLoginError('Akun ini belum diberi akses admin Shiboss.');
      return false;
    }

    setCurrentUser({
        ...currentUser,
      id: data.user.id,
      email: data.user.email ?? email,
      name: data.user.user_metadata?.full_name ?? data.user.email?.split('@')[0] ?? 'Admin',
    });
    setAuthStatus('authorized');
    setIsLoginLoading(false);
    setCurrentScreen('dashboard');
    showToast('Berhasil masuk ke Dashboard Shiboss', 'success');
    return true;
  };

  const logout = () => {
    void supabase?.auth.signOut();
    setAuthStatus('unauthenticated');
    setCurrentScreen('login');
    showToast('Sesi admin telah ditutup.', 'info');
  };

  // Menu Handlers
  const openAddModal = () => {
    setEditingItem(null);
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (item: AdminMenuItem) => {
    setEditingItem(item);
    setIsAddEditModalOpen(true);
  };

  const closeAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setEditingItem(null);
  };

  const saveMenuItem = async (itemData: Partial<AdminMenuItem>): Promise<boolean> => {
    if (!supabase) {
      showToast('Supabase belum dikonfigurasi.', 'error');
      return false;
    }
    const generatedId = crypto.randomUUID();
    const item: AdminMenuItem = {
      id: editingItem?.id ?? `custom-${generatedId}`,
      code: editingItem?.code ?? `SHB-${generatedId.slice(0, 8).toUpperCase()}`,
      name: itemData.name?.trim() ?? editingItem?.name ?? '',
      category: itemData.category ?? editingItem?.category ?? 'Special Susu',
      price: itemData.price ?? editingItem?.price ?? 0,
      description: itemData.description ?? editingItem?.description ?? '',
      image: itemData.image ?? editingItem?.image ?? '',
      isAvailable: itemData.isAvailable ?? editingItem?.isAvailable ?? true,
      isCustomerVisible: itemData.isCustomerVisible ?? editingItem?.isCustomerVisible ?? false,
      isPopular: editingItem?.isPopular,
      isBestseller: editingItem?.isBestseller,
      badge: editingItem?.badge,
      updatedAt: new Date().toISOString(),
    };
    try {
      await upsertMenuItem(supabase, item);
      setMenuItems(await loadAdminMenu(supabase));
      closeAddEditModal();
      showToast(`Menu "${item.name}" berhasil disimpan.`);
      return true;
    } catch {
      showToast('Menu gagal disimpan. Periksa koneksi dan akses admin, lalu coba lagi.', 'error');
      return false;
    }
  };

  const deleteMenuItem = (id: string) => {
    const item = menuItems.find((i) => i.id === id);
    if (!supabase) return showToast('Supabase belum dikonfigurasi.', 'error');
    const client = supabase;
    void removeMenuItem(client, id).then(async () => {
      setMenuItems(await loadAdminMenu(client));
      showToast(`Menu "${item?.name || 'terpilih'}" telah dihapus dari daftar.`, 'info');
    }).catch(() => showToast('Menu gagal dihapus. Coba lagi.', 'error'));
  };

  const toggleItemAvailability = (id: string) => {
    const item = menuItems.find((candidate) => candidate.id === id);
    if (!supabase || !item) return;
    const client = supabase;
    const nextState = !item.isAvailable;
    void setMenuAvailability(client, id, nextState).then(async () => {
      setMenuItems(await loadAdminMenu(client));
      showToast(`Status "${item.name}" diubah menjadi: ${nextState ? 'Tersedia' : 'Stok Habis'}`, nextState ? 'success' : 'info');
    }).catch(() => showToast('Status ketersediaan gagal diperbarui.', 'error'));
  };

  // Orders Handlers
  const updateOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
    const order = orders.find((candidate) => candidate.id === orderId);
    if (!supabase || !order?.databaseId) return showToast('Data pesanan tidak tersedia.', 'error');
    void persistOrderStatus(supabase, order.databaseId, status, reason).then(async () => {
      await refreshOperationalData();
      showToast(`Status pesanan ${orderId} berhasil diperbarui.`);
    }).catch(() => showToast('Status pesanan gagal diperbarui.', 'error'));
  };

  // QRIS Handlers
  const verifyQrisPayment = (transactionId: string) => {
    const trx = qrisTransactions.find((q) => q.id === transactionId);
    if (!supabase || !trx) return;
    void updateQrisStatus(supabase, trx, 'terverifikasi').then(async () => {
      await refreshOperationalData();
      showToast(`Pembayaran QRIS ${trx.orderId} berhasil diverifikasi.`);
    }).catch(() => showToast('Verifikasi QRIS gagal. Muat ulang data dan coba lagi.', 'error'));
  };

  const rejectQrisPayment = (transactionId: string, reason: string) => {
    const trx = qrisTransactions.find((q) => q.id === transactionId);
    if (!supabase || !trx) return;
    void updateQrisStatus(supabase, trx, 'ditolak', reason).then(async () => {
      await refreshOperationalData();
      showToast(`Pembayaran QRIS ${trx.orderId} ditolak.`, 'error');
    }).catch(() => showToast('Penolakan QRIS gagal. Muat ulang data dan coba lagi.', 'error'));
  };

  const confirmCashPayment = (orderId: string) => {
    const order = orders.find((candidate) => candidate.databaseId === orderId);
    if (!supabase || !order || order.paymentMethod !== 'cash') return;
    void markCashPaymentPaid(supabase, orderId).then(async () => {
      await refreshOperationalData();
      showToast(`Pembayaran tunai pesanan ${order.id} dikonfirmasi.`);
    }).catch(() => showToast('Pembayaran tunai gagal dikonfirmasi.', 'error'));
  };

  const markNotificationsAsRead = () => undefined;

  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.orderStatus === 'menunggu').length,
    [orders]
  );

  const pendingQrisCount = useMemo(
    () => qrisTransactions.filter((q) => q.status === 'menunggu_verifikasi').length,
    [qrisTransactions]
  );

  return (
    <AdminContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        viewMode,
        setViewMode,
        isSidebarOpenMobile,
        setIsSidebarOpenMobile,
        isAuthenticated: authStatus === 'authorized',
        authStatus,
        currentUser,
        login,
        logout,
        isLoginLoading,
        loginError,
        menuItems,
        menuLoadStatus,
        editingItem,
        isAddEditModalOpen,
        openAddModal,
        openEditModal,
        closeAddEditModal,
        saveMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        orders,
        ordersLoadStatus,
        selectedOrder,
        setSelectedOrder,
        updateOrderStatus,
        markCashPaymentPaid: confirmCashPayment,
        pendingOrdersCount,
        qrisTransactions,
        selectedQris,
        setSelectedQris,
        verifyQrisPayment,
        rejectQrisPayment,
        pendingQrisCount,
        activityLogs,
        notifications,
        markNotificationsAsRead,
        adminToast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
