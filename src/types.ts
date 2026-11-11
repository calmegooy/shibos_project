export type MenuCategory = 'all' | 'minuman' | 'snack' | 'makanan';

export interface MenuItem {
  id: string;
  name: string;
  category: 'minuman' | 'snack' | 'makanan';
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  badge?: string;
  isPopular?: boolean;
  isBestseller?: boolean;
}

export interface ItemModifier {
  temperature: 'Dingin' | 'Hangat';
  sugar: 'Normal' | 'Kurang Manis' | 'Tanpa Gula';
  ice?: 'Es Normal' | 'Sedikit Es' | 'Tanpa Es';
  toppings: string[];
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  modifier?: ItemModifier;
  notes?: string;
  unitPrice: number;
}

export interface ActiveOrder {
  orderId: string;
  tableNumber: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'qris' | 'cash';
  isPaid: boolean;
  status: 'diterima' | 'diracik' | 'diantar' | 'selesai';
  createdAt: string;
  kitchenNotes?: string;
  transferProofImage?: string;
}
