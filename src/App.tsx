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
import { ArrowRight, Shield, Store } from 'lucide-react';

const CustomerContent: React.FC = () => {
  const { currentView } = useOrder();
  const { setViewMode } = useAdmin();

  // Scroll to top upon view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen bg-cream-canvas text-heading-charcoal flex flex-col font-sans selection:bg-[#dae2ff] selection:text-[#001848]">
      {/* Top Banner allowing immediate switch back to Admin Dashboard */}
      <div className="bg-[#003d9b] text-white px-4 py-2 text-xs flex items-center justify-between z-60 relative shadow-sm">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-blue-200" />
          <span className="font-semibold">
            Mode Pratinjau: Web Pemesanan Pelanggan (Meja Dine-in)
          </span>
        </div>
        <button
          onClick={() => setViewMode('admin')}
          className="flex items-center gap-1.5 px-3 py-1 bg-white text-[#003d9b] hover:bg-blue-50 rounded-full font-bold text-xs transition-colors shadow-2xs"
        >
          <Shield className="w-3.5 h-3.5 text-[#003d9b]" />
          <span>Buka Dashboard Admin Shiboss</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

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
