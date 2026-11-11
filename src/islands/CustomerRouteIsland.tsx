import React, { Suspense, lazy, useEffect } from 'react';
import { AdminProvider } from '../context/AdminContext';
import { OrderProvider, useOrder, type ViewType } from '../context/OrderContext';
import { Footer } from '../components/Footer';
import { FloatingCartBar } from '../components/FloatingCartBar';
import { Toast } from '../components/Toast';
import { TableModal } from '../components/TableModal';
import { CallWaiterModal } from '../components/CallWaiterModal';
import { CustomizeModal } from '../components/CustomizeModal';
import { customerPathForView } from '../lib/routes';
import { routeFromPath } from '../lib/routes';

const views = {
  beranda: lazy(() => import('../views/HomeView').then((module) => ({ default: module.HomeView }))),
  menu: lazy(() => import('../views/MenuView').then((module) => ({ default: module.MenuView }))),
  keranjang: lazy(() => import('../views/CartView').then((module) => ({ default: module.CartView }))),
  checkout: lazy(() => import('../views/CheckoutView').then((module) => ({ default: module.CheckoutView }))),
  pembayaran: lazy(() => import('../views/PaymentView').then((module) => ({ default: module.PaymentView }))),
  pesanan: lazy(() => import('../views/OrderStatusView').then((module) => ({ default: module.OrderStatusView }))),
} satisfies Record<ViewType, React.LazyExoticComponent<React.ComponentType>>;

const CustomerRouteContent: React.FC<{ initialView: ViewType }> = ({ initialView }) => {
  const { currentView, setCurrentView, setIsTableModalOpen } = useOrder();
  const Screen = views[currentView];

  useEffect(() => {
    if (currentView !== initialView) window.location.assign(customerPathForView(currentView));
  }, [currentView, initialView]);

  useEffect(() => {
    const syncViewFromUrl = () => {
      const route = routeFromPath(window.location.pathname);
      if (route?.area === 'customer') setCurrentView(route.view);
    };
    window.addEventListener('pageshow', syncViewFromUrl);
    window.addEventListener('popstate', syncViewFromUrl);
    return () => {
      window.removeEventListener('pageshow', syncViewFromUrl);
      window.removeEventListener('popstate', syncViewFromUrl);
    };
  }, [setCurrentView]);

  useEffect(() => {
    const openTableModal = () => setIsTableModalOpen(true);
    window.addEventListener('shiboss:open-table-modal', openTableModal);
    return () => window.removeEventListener('shiboss:open-table-modal', openTableModal);
  }, [setIsTableModalOpen]);

  return (
    <>
      <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-12 text-sm text-slate-500">Memuat halaman...</div>}>
        <Screen />
      </Suspense>
      <FloatingCartBar />
      <Footer />
      <CustomizeModal />
      <TableModal />
      <CallWaiterModal />
      <Toast />
    </>
  );
};

export const CustomerRouteIsland: React.FC<{ view: ViewType; searchQuery?: string }> = ({ view, searchQuery = '' }) => (
  <AdminProvider>
    <OrderProvider initialView={view} initialSearchQuery={searchQuery}>
      <CustomerRouteContent initialView={view} />
    </OrderProvider>
  </AdminProvider>
);
