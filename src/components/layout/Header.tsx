'use client';

import React from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { ActiveTab } from '@/src/types';
import {
  PackagePlus,
  ShoppingCart,
  Boxes,
  AlertTriangle,
  BarChart3,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Logo } from '@/src/components/ui/Logo';
import { formatCurrency, formatNumber } from '@/src/lib/utils';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, stats, resetToSampleData } = useInventory();

  const navItems: { id: ActiveTab; label: string; shortLabel: string; icon: React.ReactNode; badge?: number; isAlert?: boolean }[] = [
    {
      id: 'overview',
      label: 'Home & Actions',
      shortLabel: 'Home',
      icon: <Logo size={16} className="shrink-0" />,
    },
    {
      id: 'stock-in',
      label: 'Stock In',
      shortLabel: 'Stock In',
      icon: <PackagePlus className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'sales',
      label: 'Quick Sale (POS)',
      shortLabel: 'Sale (POS)',
      icon: <ShoppingCart className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'inventory',
      label: "What's In Shop?",
      shortLabel: 'In Shop',
      icon: <Boxes className="w-4 h-4 shrink-0" />,
      badge: stats.totalUniqueProducts,
    },
    {
      id: 'low-stock',
      label: 'Low Stock Alerts',
      shortLabel: 'Alerts',
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
      badge: stats.outOfStockCount + stats.lowStockCount,
      isAlert: stats.outOfStockCount + stats.lowStockCount > 0,
    },
    {
      id: 'analytics',
      label: 'Dead Stock & Insights',
      shortLabel: 'Insights',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fbf8f2]/95 backdrop-blur-md border-b border-[#e8dfd1] shadow-2xs">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 sm:h-18 py-2 gap-2">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none min-w-0"
            onClick={() => setActiveTab('overview')}
          >
            <Logo size={40} className="shrink-0 shadow-2xs rounded-xl" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-[#1c1917] truncate">
                  LAXMI <span className="text-[#d96528]">TEXTILES</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#faeedf] text-[#c45418] border border-[#eed6c0] shrink-0">
                  <Sparkles className="w-2.5 h-2.5" /> Live Stock
                </span>
              </div>
              <p className="text-[11px] text-[#78716c] truncate hidden sm:block">
                Simple, Real-Time Inventory & Counter Sales
              </p>
            </div>
          </div>

          {/* Right Action / Mobile Reset */}
          <div className="flex items-center gap-2">
            {/* Desktop Metrics Ticker */}
            <div className="hidden lg:flex items-center gap-3 bg-[#f5eee3] border border-[#e4d8c5] rounded-xl px-3 py-1.5 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8c827a] block">In Shop</span>
                <span className="font-bold text-[#1c1917]">
                  {formatNumber(stats.totalUnitsInStock)} pcs
                </span>
              </div>
              <div className="h-5 w-px bg-[#e4d8c5]" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#2d6a3f] flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5" /> Today's Sales
                </span>
                <span className="font-bold text-[#2d6a3f]">
                  {formatCurrency(stats.todaysRevenue)}
                </span>
              </div>
              <div className="h-5 w-px bg-[#e4d8c5]" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#b45309] block">Reorders</span>
                <span className="font-bold text-[#b45309]">
                  {stats.outOfStockCount + stats.lowStockCount} items
                </span>
              </div>
            </div>

            {/* Reset Data Button */}
            <button
              onClick={resetToSampleData}
              title="Reset to initial demo data"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#57534e] hover:text-[#1c1917] bg-[#f5eee3] hover:bg-[#ede3d3] px-2.5 sm:px-3.5 py-2 rounded-xl border border-[#e4d8c5] transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Data</span>
            </button>
          </div>
        </div>

        {/* Mobile Quick Stats strip */}
        <div className="flex lg:hidden items-center justify-between gap-2 py-1.5 px-3 bg-[#f5eee3]/80 rounded-xl border border-[#e4d8c5] text-[11px] mb-2 font-semibold">
          <span className="text-[#44403c]">
            Stock: <strong className="text-[#1c1917]">{formatNumber(stats.totalUnitsInStock)} pcs</strong>
          </span>
          <span className="text-[#2d6a3f]">
            Sales: <strong className="font-bold">{formatCurrency(stats.todaysRevenue)}</strong>
          </span>
          <span className="text-[#b45309]">
            Alerts: <strong className="font-bold">{stats.outOfStockCount + stats.lowStockCount}</strong>
          </span>
        </div>

        {/* Navigation Tabs Bar (Horizontally scrollable with smooth touch) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-2 border-t border-[#f0e6d8] -mx-3 px-3 sm:mx-0 sm:px-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#d96528] text-white shadow-xs'
                    : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#f3eadf]'
                }`}
              >
                {item.icon}
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : item.isAlert
                        ? 'bg-[#faeedf] text-[#c45418] border border-[#eed6c0]'
                        : 'bg-[#ebdccb] text-[#57534e]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeHeaderPill"
                    className="absolute inset-0 rounded-xl -z-10 bg-[#d96528]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
