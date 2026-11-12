import type { ViewType } from '../context/OrderContext';
import type { AdminScreen } from '../types/admin';

export type ResolvedRoute =
  | { area: 'customer'; view: ViewType }
  | { area: 'admin'; screen: AdminScreen };

const customerPaths: Record<ViewType, string> = {
  beranda: '/',
  menu: '/menu',
  keranjang: '/cart',
  checkout: '/checkout',
  pembayaran: '/payment',
  pesanan: '/order',
};

const adminPaths: Record<AdminScreen, string> = {
  login: '/admin/login',
  dashboard: '/admin',
  menu: '/admin/menu',
  add_menu: '/admin/menu',
  orders: '/admin/orders',
  qris: '/admin/qris',
};

const routesByPath = new Map<string, ResolvedRoute>([
  ...Object.entries(customerPaths).map(([view, path]) => [path, { area: 'customer', view } as ResolvedRoute] as [string, ResolvedRoute]),
  ...Object.entries(adminPaths)
    .filter(([screen]) => screen !== 'add_menu')
    .map(([screen, path]) => [path, { area: 'admin', screen } as ResolvedRoute] as [string, ResolvedRoute]),
]);

export function customerPathForView(view: ViewType): string {
  return customerPaths[view];
}

export function adminPathForScreen(screen: AdminScreen): string {
  return adminPaths[screen];
}

export function routeFromPath(pathname: string): ResolvedRoute | null {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return routesByPath.get(normalizedPath) ?? null;
}
