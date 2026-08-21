'use client';

import React from 'react';
import { InventoryProvider, useInventory } from '@/src/context/InventoryContext';
import { Header } from '@/src/components/layout/Header';
import { HeroQuickActions } from '@/src/modules/quick-actions/HeroQuickActions';
import { StockInModule } from '@/src/modules/stock-in/StockInModule';
import { SalesModule } from '@/src/modules/sales/SalesModule';
import { InventoryViewModule } from '@/src/modules/inventory-view/InventoryViewModule';
import { LowStockModule } from '@/src/modules/low-stock/LowStockModule';
import { AnalyticsModule } from '@/src/modules/analytics/AnalyticsModule';
import { Logo } from '@/src/components/ui/Logo';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

function DashboardContent() {
  const { activeTab } = useInventory();

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#1c1917] flex flex-col font-sans selection:bg-[#faeedf] selection:text-[#c45418]">
      <Header />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HeroQuickActions />
            </motion.div>
          )}

          {activeTab === 'stock-in' && (
            <motion.div
              key="stock-in"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <StockInModule />
            </motion.div>
          )}

          {activeTab === 'sales' && (
            <motion.div
              key="sales"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SalesModule />
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <InventoryViewModule />
            </motion.div>
          )}

          {activeTab === 'low-stock' && (
            <motion.div
              key="low-stock"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <LowStockModule />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AnalyticsModule />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Product Footer */}
      <footer className="bg-[#f5eee3] border-t border-[#e4d8c5] py-5 text-xs text-[#78716c]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Logo size={22} className="shrink-0 rounded-md" />
            <span className="font-bold text-[#1c1917]">Lakshmi Textiles</span>
            <span className="text-[#8c827a] hidden sm:inline">• Inventory & POS System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#8c827a]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a3f]" /> Real-Time Sync Active
            </span>
          </div>
        </div>
      </footer>

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default function Home() {
  return (
    <InventoryProvider>
      <DashboardContent />
    </InventoryProvider>
  );
}
