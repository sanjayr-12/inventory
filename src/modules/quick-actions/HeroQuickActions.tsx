'use client';

import React from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import {
  PackagePlus,
  ShoppingCart,
  Boxes,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Flame,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatNumber } from '@/src/lib/utils';

export const HeroQuickActions: React.FC = () => {
  const { setActiveTab, stats, outOfStockProducts, lowStockProducts, slowMovingProducts } = useInventory();

  const primaryActions = [
    {
      id: 'stock-in' as const,
      title: 'STOCK IN',
      subtitle: 'Record inward deliveries from weavers & mills',
      metric: `${formatNumber(stats.totalUnitsInStock)} pcs`,
      metricLabel: 'Total in-shop stock',
      icon: <PackagePlus className="w-5 h-5 sm:w-6 sm:h-6 text-[#d96528]" />,
      badge: 'Inward Goods',
      badgeClass: 'bg-[#faeedf] text-[#c45418] border-[#eed6c0]',
    },
    {
      id: 'sales' as const,
      title: 'SALE / POS',
      subtitle: 'Counter billing with auto stock reduction',
      metric: `${formatCurrency(stats.todaysRevenue)}`,
      metricLabel: "Today's counter revenue",
      icon: <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#2d6a3f]" />,
      badge: 'Fast Checkout',
      badgeClass: 'bg-[#eef5ee] text-[#2d6a3f] border-[#d2e4d3]',
    },
    {
      id: 'inventory' as const,
      title: "WHAT'S IN SHOP?",
      subtitle: 'Live shelf counts & instant product lookups',
      metric: `${stats.totalUniqueProducts} Products`,
      metricLabel: 'Active catalog lines',
      icon: <Boxes className="w-5 h-5 sm:w-6 sm:h-6 text-[#b45309]" />,
      badge: 'Shelf Visibility',
      badgeClass: 'bg-[#fcf3e6] text-[#b45309] border-[#fae2c0]',
    },
    {
      id: 'low-stock' as const,
      title: 'LOW STOCK ALERTS',
      subtitle: 'Restock triggers & WhatsApp supplier orders',
      metric: `${outOfStockProducts.length + lowStockProducts.length} Items`,
      metricLabel: outOfStockProducts.length > 0 ? `${outOfStockProducts.length} Out of Stock!` : 'Restock alerts',
      icon: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-[#b9381e]" />,
      badge: 'Stock Health',
      badgeClass: 'bg-[#fdf0ed] text-[#b9381e] border-[#f8d0c8]',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Headline & Action Buttons */}
        <div className="lg:col-span-7 flex flex-col justify-between py-1 sm:py-2 space-y-5 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#faeedf] border border-[#eed6c0] text-[#c45418] text-[11px] sm:text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-[#d96528] shrink-0" />
              <span>Real-Time Inventory & POS for Laxmi Textiles</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1c1917] tracking-tight leading-tight sm:leading-[1.15]">
              Real-time <span className="text-[#d96528]">stock tracking</span> & counter point of sale.
            </h1>

            <p className="text-xs sm:text-base text-[#57534e] leading-relaxed">
              Track incoming goods from weavers, conduct rapid counter billing with automatic stock reduction,
              and maintain full visibility over store inventory and reorder alerts.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
            <button
              onClick={() => setActiveTab('sales')}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-[#d96528] hover:bg-[#c45418] text-white font-extrabold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" /> Start Counter Sale <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-[#f5eee3] hover:bg-[#ede3d3] text-[#1c1917] font-bold text-xs sm:text-sm border border-[#e4d8c5] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Boxes className="w-4 h-4 text-[#78716c]" /> View All Stock ({formatNumber(stats.totalUnitsInStock)} pcs)
            </button>
          </div>
        </div>

        {/* Right Column: Live Store Activity Widget (Clean product UI widget) */}
        <div className="lg:col-span-5 bg-[#f5eee3] rounded-3xl p-5 sm:p-7 border border-[#e4d8c5] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#e4d8c5] pb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1c1917]">
              <Activity className="w-4 h-4 text-[#d96528]" />
              Store Live Overview
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#eef5ee] text-[#2d6a3f] border border-[#d2e4d3] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a3f]" /> Active
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-2xl border border-[#e8dfd1] shadow-2xs">
              <span className="font-semibold text-[#44403c]">Total Available Stock</span>
              <span className="font-black text-[#1c1917] bg-[#f5eee3] px-2 py-0.5 rounded-md">
                {formatNumber(stats.totalUnitsInStock)} pcs
              </span>
            </div>

            <div className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-2xl border border-[#e8dfd1] shadow-2xs">
              <span className="font-semibold text-[#44403c]">Today's Counter Revenue</span>
              <span className="font-black text-[#2d6a3f] bg-[#eef5ee] px-2 py-0.5 rounded-md">
                {formatCurrency(stats.todaysRevenue)}
              </span>
            </div>

            <div className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-2xl border border-[#e8dfd1] shadow-2xs">
              <span className="font-semibold text-[#44403c]">Active Product Lines</span>
              <span className="font-black text-[#1c1917] bg-[#f5eee3] px-2 py-0.5 rounded-md">
                {stats.totalUniqueProducts} lines
              </span>
            </div>

            <div className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-2xl border border-[#e8dfd1] shadow-2xs">
              <span className="font-semibold text-[#44403c]">Items Requiring Reorder</span>
              <span className="font-black text-[#b45309] bg-[#fcf3e6] px-2 py-0.5 rounded-md">
                {stats.outOfStockCount + stats.lowStockCount} items
              </span>
            </div>
          </div>

          <div className="pt-2 text-[10px] sm:text-[11px] text-[#78716c] flex items-center justify-between">
            <span>Inventory Valuation (Cost Basis)</span>
            <span className="font-black text-[#1c1917]">{formatCurrency(stats.totalInventoryValuation)}</span>
          </div>
        </div>
      </div>

      {/* 4 PRIMARY TOUCH ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {primaryActions.map((action, idx) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(action.id)}
            className="group cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#e8dfd1] hover:border-[#d96528] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[170px] sm:min-h-[190px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#f5eee3] flex items-center justify-center border border-[#e4d8c5]">
                  {action.icon}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${action.badgeClass}`}>
                  {action.badge}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-[#1c1917] mt-3 group-hover:text-[#d96528] transition-colors">
                {action.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#78716c] mt-0.5 leading-snug">{action.subtitle}</p>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 border-t border-[#f0e6d8] flex items-end justify-between">
              <div>
                <div className="text-lg sm:text-xl font-black text-[#1c1917]">{action.metric}</div>
                <div className="text-[10px] font-bold text-[#8c827a]">{action.metricLabel}</div>
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-[#f5eee3] group-hover:bg-[#d96528] group-hover:text-white text-[#57534e] flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3 Store Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        <div
          onClick={() => setActiveTab('analytics')}
          className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-[#e8dfd1] hover:border-[#704282] shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#704282] bg-[#f5eef9] px-2.5 py-1 rounded-full border border-[#e7daf0] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Capital Trapped
            </span>
            <ArrowRight className="w-4 h-4 text-[#8c827a] group-hover:text-[#704282] transition-colors" />
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-xl sm:text-2xl font-black text-[#1c1917]">
              {formatCurrency(stats.deadStockCapital)}
            </div>
            <p className="text-xs text-[#78716c] mt-0.5">
              {slowMovingProducts.length} slow-moving textile lines sitting on upper shelves.
            </p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('inventory')}
          className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-[#e8dfd1] hover:border-[#d96528] shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#c45418] bg-[#faeedf] px-2.5 py-1 rounded-full border border-[#eed6c0] flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5" /> Total Stock Valuation
            </span>
            <ArrowRight className="w-4 h-4 text-[#8c827a] group-hover:text-[#d96528] transition-colors" />
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-xl sm:text-2xl font-black text-[#1c1917]">
              {formatCurrency(stats.totalInventoryValuation)}
            </div>
            <p className="text-xs text-[#78716c] mt-0.5">
              Retail value: <strong>{formatCurrency(stats.totalRetailValuation)}</strong>
            </p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('low-stock')}
          className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-[#e8dfd1] hover:border-[#2d6a3f] shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2d6a3f] bg-[#eef5ee] px-2.5 py-1 rounded-full border border-[#d2e4d3] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> In-Stock Health
            </span>
            <ArrowRight className="w-4 h-4 text-[#8c827a] group-hover:text-[#2d6a3f] transition-colors" />
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-xl sm:text-2xl font-black text-[#1c1917]">
              {stats.healthyStockCount} of {stats.totalUniqueProducts} Healthy
            </div>
            <p className="text-xs text-[#78716c] mt-0.5">
              {stats.outOfStockCount > 0 ? `⚠️ ${stats.outOfStockCount} items sold out!` : 'Zero stockout emergencies.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
