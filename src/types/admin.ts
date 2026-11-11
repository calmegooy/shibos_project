export type ShibossCategory =
  | 'Special Susu'
  | 'Milkshake'
  | 'Minuman Lainnya'
  | 'Food'
  | 'Snack'
  | 'Tambahan'
  | 'Varian Telur';

export type OrderStatus =
  | 'menunggu'
  | 'dikonfirmasi'
  | 'diracik'
  | 'selesai'
  | 'dibatalkan';

export type PaymentStatus =
  | 'menunggu_verifikasi'
  | 'terverifikasi'
  | 'ditolak'
  | 'tunai_lunas';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Kasir Utama' | 'Manajer Outlet' | 'Barista / Dapur';
  shift: 'Shift Pagi (08:00 - 15:00)' | 'Shift Siang (15:00 - 22:00)' | 'Shift Malam';
  outlet: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export interface AdminMenuItem {
  id: string;
  code: string;
  name: string;
  category: ShibossCategory;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isPopular?: boolean;
  isBestseller?: boolean;
  badge?: string;
  updatedAt: string;
}

export interface OrderItemModifier {
  temperature?: 'Dingin' | 'Hangat';
  sugar?: 'Normal' | 'Kurang Manis' | 'Tanpa Gula';
  ice?: 'Es Normal' | 'Sedikit Es' | 'Tanpa Es';
  toppings?: string[];
}

export interface AdminOrderItem {
  itemId: string;
  name: string;
  category: ShibossCategory;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  modifier?: OrderItemModifier;
  notes?: string;
}

export interface AdminOrder {
  id: string; // e.g. #SHB-1094
  tableNumber: string; // e.g. Meja 04
  customerName: string;
  items: AdminOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'qris' | 'cash';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  customerNotes?: string;
  cancellationReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  transferProofImage?: string;
}

export interface QrisTransaction {
  id: string; // e.g. QRIS-20261025-081
  orderId: string; // e.g. #SHB-1094
  customerName: string;
  tableNumber: string;
  amount: number;
  createdAt: string;
  status: 'menunggu_verifikasi' | 'terverifikasi' | 'ditolak';
  rrn: string; // Retrieval Reference Number
  issuer: string; // e.g. BCA QRIS / GoPay / Mandiri Livin
  terminalId: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  transferProofImage?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'order' | 'payment' | 'menu' | 'system';
  title: string;
  description: string;
  actor: string;
}

export type AdminScreen =
  | 'login'
  | 'dashboard'
  | 'menu'
  | 'add_menu'
  | 'orders'
  | 'qris'
  | 'states';
