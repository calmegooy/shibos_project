/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { OrderProvider, useOrder } from './context/OrderContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingCartBar } from './components/FloatingCartBar';
import { Toast } from './components/Toast';
import { TableModal } from './components/TableModal';
import { CallWaiterModal } from './components/CallWaiterModal';
import { CustomizeModal } from './components/CustomizeModal';
import { HomeView } from './views/HomeView';
import { MenuView } from './views/MenuView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { PaymentView } from './views/PaymentView';
import { OrderStatusView } from './views/OrderStatusView';
import { AdminApp } from './views/admin/AdminApp';

const CustomerContent: React.FC = () => {
  const { currentView } = useOrder();

  // Scroll to top upon view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen bg-cream-canvas text-heading-charcoal flex flex-col font-sans selection:bg-[#dae2ff] selection:text-[#001848]">
      <Navbar />

      <main className="w-full pt-20 flex-1 min-h-[calc(100vh-80px)]">
        {currentView === 'beranda' && <HomeView />}
        {currentView === 'menu' && <MenuView />}
        {currentView === 'keranjang' && <CartView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'pembayaran' && <PaymentView />}
        {currentView === 'pesanan' && <OrderStatusView />}
      </main>

      <FloatingCartBar />
      <Footer />

      {/* Global Modals & Overlays */}
      <CustomizeModal />
      <TableModal />
      <CallWaiterModal />
      <Toast />
    </div>
  );
};

const RootApp: React.FC = () => {
  const { viewMode, setViewMode } = useAdmin();

  useEffect(() => {
    const handleSwitchToAdmin = () => setViewMode('admin');
    window.addEventListener('switch-to-admin', handleSwitchToAdmin);
    return () => window.removeEventListener('switch-to-admin', handleSwitchToAdmin);
  }, [setViewMode]);

  if (viewMode === 'admin') {
    return <AdminApp />;
  }

  return (
    <OrderProvider>
      <CustomerContent />
    </OrderProvider>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <RootApp />
    </AdminProvider>
  );
}
