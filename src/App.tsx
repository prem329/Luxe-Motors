/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Inventory } from './pages/Inventory';
import { CarDetails } from './pages/CarDetails';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminBroadcast } from './pages/admin/AdminBroadcast';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminRoute } from './components/AdminRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/inventory" element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Inventory />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/cars/:slug" element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <CarDetails />
                </main>
                <Footer />
              </div>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="broadcast" element={<AdminBroadcast />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}
