import React, { createContext, useContext, useState, useMemo } from 'react';
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
import { SHIBOSS_91_MENU } from '../data/shiboss91Menu';
import {
  CURRENT_ADMIN_USER,
  INITIAL_ORDERS,
  INITIAL_QRIS_TRANSACTIONS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/mockAdminData';

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
  currentUser: AdminUser;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoginLoading: boolean;
  loginError: string | null;

  // Menu Management
  menuItems: AdminMenuItem[];
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
  selectedOrder: AdminOrder | null;
  setSelectedOrder: (order: AdminOrder | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
  pendingOrdersCount: number;

  // QRIS Transactions
  qrisTransactions: QrisTransaction[];
  selectedQris: QrisTransaction | null;
  setSelectedQris: (qris: QrisTransaction | null) => void;
  verifyQrisPayment: (transactionId: string) => void;
  rejectQrisPayment: (transactionId: string, reason: string) => void;
  recordCustomerTransferProof: (
    orderId: string,
    tableNumber: string,
    amount: number,
    customerName: string,
    proofImageUrl: string
  ) => void;
  pendingQrisCount: number;

  // Activity Logs & Notifications
  activityLogs: ActivityLog[];
  notifications: Array<{ id: string; title: string; time: string; read: boolean }>;
  markNotificationsAsRead: () => void;

  // Simulated Demo States
  simulateLoading: boolean;
  setSimulateLoading: (v: boolean) => void;
  simulateError: boolean;
  setSimulateError: (v: boolean) => void;
  simulateEmptyOrders: boolean;
  setSimulateEmptyOrders: (v: boolean) => void;
  simulateEmptyQris: boolean;
  setSimulateEmptyQris: (v: boolean) => void;
  resetAllDemoStates: () => void;

  // Toast
  adminToast: AdminToast | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>('dashboard');
  const [viewMode, setViewMode] = useState<'admin' | 'customer'>('admin');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AdminUser>(CURRENT_ADMIN_USER);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Menu State
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>(SHIBOSS_91_MENU);
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // QRIS State
  const [qrisTransactions, setQrisTransactions] = useState<QrisTransaction[]>(
    INITIAL_QRIS_TRANSACTIONS
  );
  const [selectedQris, setSelectedQris] = useState<QrisTransaction | null>(null);

  // Activity & Notifications
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: '2 Pembayaran QRIS menunggu verifikasi kasir',
      time: '15:23 WIB',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Pesanan baru #SHB-1094 di Meja 04',
      time: '15:22 WIB',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Pesanan #SHB-1091 telah mulai diracik',
      time: '14:58 WIB',
      read: true,
    },
  ]);

  // Simulated testing states
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [simulateEmptyOrders, setSimulateEmptyOrders] = useState(false);
  const [simulateEmptyQris, setSimulateEmptyQris] = useState(false);

  // Toast
  const [adminToast, setAdminToast] = useState<AdminToast | null>(null);

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

    // Simulate backend verification
    await new Promise((r) => setTimeout(r, 900));

    if (!email || !pass) {
      setIsLoginLoading(false);
      setLoginError('Silakan masukkan email dan kata sandi admin.');
      return false;
    }

    if (pass.length < 4) {
      setIsLoginLoading(false);
      setLoginError('Kata sandi salah atau tidak terdaftar.');
      return false;
    }

    setIsLoginLoading(false);
    setIsAuthenticated(true);
    setCurrentUser({
      ...CURRENT_ADMIN_USER,
      email: email,
    });
    setCurrentScreen('dashboard');
    showToast('Berhasil masuk ke Dashboard Shiboss', 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
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
    await new Promise((r) => setTimeout(r, 600));

    if (editingItem) {
      // Edit
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? ({
                ...item,
                ...itemData,
                updatedAt: new Date().toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              } as AdminMenuItem)
            : item
        )
      );
      showToast(`Menu "${itemData.name || editingItem.name}" berhasil diperbarui.`);
    } else {
      // Create new
      const nextNum = menuItems.length + 1;
      const newItem: AdminMenuItem = {
        id: `custom-item-${Date.now()}`,
        code: `SHB-NEW${nextNum}`,
        name: itemData.name || 'Menu Baru',
        category: itemData.category || 'Special Susu',
        price: itemData.price || 12000,
        description: itemData.description || 'Deskripsi menu lezat khas Shiboss.',
        image: itemData.image || '',
        isAvailable: itemData.isAvailable ?? true,
        updatedAt: 'Baru saja',
      };
      setMenuItems((prev) => [newItem, ...prev]);
      showToast(`Menu baru "${newItem.name}" berhasil ditambahkan.`);
    }

    closeAddEditModal();
    return true;
  };

  const deleteMenuItem = (id: string) => {
    const item = menuItems.find((i) => i.id === id);
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
    showToast(`Menu "${item?.name || 'terpilih'}" telah dihapus dari daftar.`, 'info');
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isAvailable;
          showToast(
            `Status "${item.name}" diubah menjadi: ${nextState ? 'Tersedia' : 'Stok Habis'}`,
            nextState ? 'success' : 'info'
          );
          return {
            ...item,
            isAvailable: nextState,
            updatedAt: 'Baru saja',
          };
        }
        return item;
      })
    );
  };

  // Orders Handlers
  const updateOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            orderStatus: status,
            cancellationReason: reason || order.cancellationReason,
          };
        }
        return order;
      })
    );

    // Also update selectedOrder if open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: status,
              cancellationReason: reason || prev.cancellationReason,
            }
          : null
      );
    }

    const statusLabels: Record<OrderStatus, string> = {
      menunggu: 'Menunggu',
      dikonfirmasi: 'Dikonfirmasi',
      diracik: 'Sedang Diracik di Dapur',
      selesai: 'Selesai & Diantar',
      dibatalkan: 'Dibatalkan',
    };

    showToast(`Status pesanan ${orderId} diubah menjadi: ${statusLabels[status]}`);

    // Append to activity log
    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        type: 'order',
        title: `Pesanan ${orderId} ${statusLabels[status]}`,
        description: reason ? `Alasan: ${reason}` : `Diproses oleh ${currentUser.name}`,
        actor: currentUser.name,
      },
      ...prev,
    ]);
  };

  // QRIS Handlers
  const verifyQrisPayment = (transactionId: string) => {
    const trx = qrisTransactions.find((q) => q.id === transactionId);
    if (!trx) return;

    const timeString =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    // Update QRIS transaction
    setQrisTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: 'terverifikasi',
              verifiedBy: currentUser.name,
              verifiedAt: timeString,
            }
          : t
      )
    );

    // Update corresponding order
    setOrders((prev) =>
      prev.map((o) =>
        o.id === trx.orderId
          ? {
              ...o,
              paymentStatus: 'terverifikasi',
              orderStatus: o.orderStatus === 'menunggu' ? 'dikonfirmasi' : o.orderStatus,
              verifiedBy: currentUser.name,
              verifiedAt: timeString,
            }
          : o
      )
    );

    showToast(
      `Pembayaran QRIS ${trx.orderId} senilai Rp${trx.amount.toLocaleString('id-ID')} Berhasil Diverifikasi!`,
      'success'
    );

    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: timeString,
        type: 'payment',
        title: `QRIS ${trx.orderId} Terverifikasi`,
        description: `Nominal Rp${trx.amount.toLocaleString('id-ID')} diverifikasi oleh ${currentUser.name}`,
        actor: currentUser.name,
      },
      ...prev,
    ]);
  };

  const rejectQrisPayment = (transactionId: string, reason: string) => {
    const trx = qrisTransactions.find((q) => q.id === transactionId);
    if (!trx) return;

    const timeString =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    // Update QRIS transaction
    setQrisTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: 'ditolak',
              rejectionReason: reason,
              verifiedBy: currentUser.name,
              verifiedAt: timeString,
            }
          : t
      )
    );

    // Update corresponding order
    setOrders((prev) =>
      prev.map((o) =>
        o.id === trx.orderId
          ? {
              ...o,
              paymentStatus: 'ditolak',
              orderStatus: 'dibatalkan',
              cancellationReason: `QRIS Ditolak: ${reason}`,
              verifiedBy: currentUser.name,
              verifiedAt: timeString,
            }
          : o
      )
    );

    showToast(`Pembayaran QRIS ${trx.orderId} ditolak. Alasan: ${reason}`, 'error');

    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: timeString,
        type: 'payment',
        title: `QRIS ${trx.orderId} Ditolak`,
        description: `Alasan: ${reason} (Ditolak oleh ${currentUser.name})`,
        actor: currentUser.name,
      },
      ...prev,
    ]);
  };

  const recordCustomerTransferProof = (
    orderId: string,
    tableNumber: string,
    amount: number,
    customerName: string,
    proofImageUrl: string
  ) => {
    const timeString =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    // 1. Update or prepend QRIS transaction
    setQrisTransactions((prev) => {
      const existingIdx = prev.findIndex((q) => q.orderId === orderId);
      if (existingIdx !== -1) {
        return prev.map((q, idx) =>
          idx === existingIdx
            ? {
                ...q,
                transferProofImage: proofImageUrl,
                status: 'menunggu_verifikasi',
                createdAt: timeString,
              }
            : q
        );
      }
      const newTrx: QrisTransaction = {
        id: `QRIS-${Date.now().toString().slice(-8)}`,
        orderId,
        customerName: customerName || `Pelanggan Meja ${tableNumber}`,
        tableNumber: `Meja ${tableNumber}`,
        amount,
        createdAt: timeString,
        status: 'menunggu_verifikasi',
        rrn: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
        issuer: 'QRIS Dinamis Pelanggan',
        terminalId: 'SHIBOSS-ID01',
        transferProofImage: proofImageUrl,
      };
      return [newTrx, ...prev];
    });

    // 2. Update orders list
    setOrders((prev) => {
      const existingIdx = prev.findIndex((o) => o.id === orderId);
      if (existingIdx !== -1) {
        return prev.map((o, idx) =>
          idx === existingIdx
            ? {
                ...o,
                transferProofImage: proofImageUrl,
                paymentStatus: 'menunggu_verifikasi',
              }
            : o
        );
      }
      const newOrder: AdminOrder = {
        id: orderId,
        tableNumber: `Meja ${tableNumber}`,
        customerName: customerName || `Pelanggan Meja ${tableNumber}`,
        createdAt: timeString,
        paymentMethod: 'qris',
        paymentStatus: 'menunggu_verifikasi',
        orderStatus: 'menunggu',
        subtotal: amount,
        tax: 0,
        total: amount,
        transferProofImage: proofImageUrl,
        items: [],
      };
      return [newOrder, ...prev];
    });

    // 3. Add Activity Log
    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: timeString,
        type: 'payment',
        title: `Bukti Transfer Baru Masuk`,
        description: `Pelanggan Meja #${tableNumber} (${orderId}) telah mengunggah bukti pembayaran QRIS sebesar Rp${amount.toLocaleString('id-ID')}.`,
        actor: 'Pelanggan (Self-Service)',
      },
      ...prev,
    ]);

    // 4. Add Notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Bukti TF Meja #${tableNumber} menunggu verifikasi`,
        time: 'Baru saja',
        read: false,
      },
      ...prev,
    ]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetAllDemoStates = () => {
    setSimulateLoading(false);
    setSimulateError(false);
    setSimulateEmptyOrders(false);
    setSimulateEmptyQris(false);
    showToast('Status simulasi telah di-reset ke kondisi normal.', 'info');
  };

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
        isAuthenticated,
        currentUser,
        login,
        logout,
        isLoginLoading,
        loginError,
        menuItems,
        editingItem,
        isAddEditModalOpen,
        openAddModal,
        openEditModal,
        closeAddEditModal,
        saveMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        orders,
        selectedOrder,
        setSelectedOrder,
        updateOrderStatus,
        pendingOrdersCount,
        qrisTransactions,
        selectedQris,
        setSelectedQris,
        verifyQrisPayment,
        rejectQrisPayment,
        recordCustomerTransferProof,
        pendingQrisCount,
        activityLogs,
        notifications,
        markNotificationsAsRead,
        simulateLoading,
        setSimulateLoading,
        simulateError,
        setSimulateError,
        simulateEmptyOrders,
        setSimulateEmptyOrders,
        simulateEmptyQris,
        setSimulateEmptyQris,
        resetAllDemoStates,
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
