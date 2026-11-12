import React, { useEffect } from 'react';
import { AdminProvider, useAdmin } from '../context/AdminContext';
import type { AdminScreen } from '../types/admin';
import { adminPathForScreen } from '../lib/routes';
import { AdminApp } from '../views/admin/AdminApp';

const AdminRouteContent: React.FC<{ initialScreen: AdminScreen }> = ({ initialScreen }) => {
  const { currentScreen, authStatus } = useAdmin();

  useEffect(() => {
    if (authStatus === 'loading') return;
    if (authStatus === 'unauthenticated' && initialScreen !== 'login') {
      window.location.replace(adminPathForScreen('login'));
      return;
    }
    if (authStatus === 'authorized' && initialScreen === 'login') {
      window.location.replace(adminPathForScreen('dashboard'));
      return;
    }
    if (authStatus === 'authorized' && currentScreen !== initialScreen) {
      window.location.assign(adminPathForScreen(currentScreen));
    }
  }, [authStatus, currentScreen, initialScreen]);

  return <AdminApp />;
};

export const AdminRouteIsland: React.FC<{ screen: AdminScreen }> = ({ screen }) => (
  <AdminProvider initialScreen={screen}>
    <AdminRouteContent initialScreen={screen} />
  </AdminProvider>
);
