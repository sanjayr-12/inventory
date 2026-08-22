'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import {
  PackagePlus,
  ShoppingCart,
  Boxes,
  AlertTriangle,
  ArrowRight,
  Search,
  CheckCircle2,
  Lock,
  Flame,
  TrendingUp,
  MapPin,
  Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatNumber, getStockStatus } from '@/src/lib/utils';

export const HeroQuickActions: React.FC = () => {
  const {
    setActiveTab,
    stats,
    products,
    outOfStockProducts,
    lowStockProducts,
    slowMovingProducts,
    purchaseOrders,
    setSearchQuery,
    t,
  } = useInventory();

  const [instantSearch, setInstantSearch] = useState('');

  // Instant quick search results on Home
  const searchResults = instantSearch.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(instantSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(instantSearch.toLowerCase()) ||
          p.rackLocation.toLowerCase().includes(instantSearch.toLowerCase()) ||
          (p.color && p.color.toLowerCase().includes(instantSearch.toLowerCase()))
      ).slice(0, 4)
    : [];

  const handleSearchResultClick = (productName: string) => {
    setSearchQuery(productName);
    setActiveTab('inventory');
  };

  const activeInwardOrders = purchaseOrders.filter((o) => o.status !== 'STOCKED');

  const primaryActions = [
    {
      id: 'vendor-orders' as const,
      title: t.orderFromWeaversTitle,
      tagline: t.orderFromWeaversDesc,
      metric: `${stats.activeInwardOrdersCount} Active`,
      metricLabel: stats.activeInwardOrdersCount > 0 ? t.trucksInTransit : '7 Mills available',
      icon: <Truck className="w-7 h-7 text-[#d96528] dark:text-[#ea7637]" />,
      accentBg: 'bg-[#faeedf] dark:bg-[#3d2415]',
      borderColor: 'border-[#e8dfd1] dark:border-[#3d3731] hover:border-[#d96528]',
    },
    {
      id: 'stock-in' as const,
      title: t.addNewStockTitle,
      tagline: t.addNewStockDesc,
      metric: `${formatNumber(stats.totalUnitsInStock)} ${t.pieces}`,
      metricLabel: t.inShopNow,
      icon: <PackagePlus className="w-7 h-7 text-[#b45309] dark:text-[#f59e0b]" />,
      accentBg: 'bg-[#fcf3e6] dark:bg-[#382b18]',
      borderColor: 'border-[#e8dfd1] dark:border-[#3d3731] hover:border-[#b45309]',
    },
    {
      id: 'sales' as const,
      title: t.billCustomerTitle,
      tagline: t.billCustomerDesc,
      metric: `${formatCurrency(stats.todaysRevenue)}`,
      metricLabel: t.todaysSales,
      icon: <ShoppingCart className="w-7 h-7 text-[#2d6a3f] dark:text-[#4ade80]" />,
      accentBg: 'bg-[#eef5ee] dark:bg-[#1c3322]',
      borderColor: 'border-[#e8dfd1] dark:border-[#3d3731] hover:border-[#2d6a3f]',
    },
    {
      id: 'inventory' as const,
      title: t.checkStockTitle,
      tagline: t.checkStockDesc,
      metric: `${stats.totalUniqueProducts} Types`,
      metricLabel: 'Catalog varieties',
      icon: <Boxes className="w-7 h-7 text-[#57534e] dark:text-[#d6cec2]" />,
      accentBg: 'bg-[#f5eee3] dark:bg-[#2b251f]',
      borderColor: 'border-[#e8dfd1] dark:border-[#3d3731] hover:border-[#57534e]',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. TOP QUICK SEARCH BAR (Instant answer for shop staff) */}
      <div className="bg-white dark:bg-[#201c18] rounded-3xl p-4 sm:p-5 border border-[#e8dfd1] dark:border-[#38322b] shadow-xs space-y-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#faeedf] dark:bg-[#3d2415] flex items-center justify-center text-[#d96528] dark:text-[#ea7637] shrink-0 font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-black text-[#1c1917] dark:text-[#f5eee3]">
              {t.storeRegister}
            </h2>
            <p className="text-xs text-[#78716c] dark:text-[#a89f91] truncate">
              {t.searchPlaceholder}
            </p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={instantSearch}
            onChange={(e) => setInstantSearch(e.target.value)}
            className="w-full px-4 py-3.5 pl-11 bg-[#fbf8f2] dark:bg-[#28231e] border border-[#e0d3c1] dark:border-[#3d3731] rounded-2xl text-sm sm:text-base text-[#1c1917] dark:text-[#f5eee3] placeholder-[#8c827a] dark:placeholder-[#6b6257] font-semibold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
          />
          <Search className="w-5 h-5 text-[#8c827a] absolute left-4 top-4" />
        </div>

        {/* Live Instant Search Dropdown on Home */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="pt-2 border-t border-[#f0e6d8] dark:border-[#38322b] space-y-1.5"
            >
              <div className="text-[11px] font-bold text-[#8c827a] uppercase tracking-wider px-1">
                Matching Shelf Items (Click to View)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchResults.map((p) => {
                  const status = getStockStatus(p);
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSearchResultClick(p.name)}
                      className="p-3 bg-[#fbf8f2] dark:bg-[#28231e] hover:bg-[#faeedf] dark:hover:bg-[#3d2415] rounded-2xl border border-[#e8dfd1] dark:border-[#3d3731] cursor-pointer flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-[#1c1917] dark:text-[#f5eee3] truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#d96528]" />
                          <span>{p.rackLocation}</span>
                          <span>• {p.category}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${status.badgeClass}`}>
                          {p.currentStock} {t.pieces}
                        </span>
                        <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] font-semibold mt-0.5">
                          {formatCurrency(p.sellingPrice)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. INCOMING TRUCK BANNER IF ACTIVE DELIVERY EXISTS */}
      {activeInwardOrders.length > 0 && (
        <div
          onClick={() => setActiveTab('vendor-orders')}
          className="bg-gradient-to-r from-[#faeedf] to-[#f5eee3] dark:from-[#382216] dark:to-[#2b2118] border-2 border-[#d96528] rounded-3xl p-5 shadow-xs cursor-pointer hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#d96528] text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
              🚚
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-[#c45418] dark:text-[#ea7637] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#d96528] animate-ping" />
                Live Inward Vehicle Tracker
              </div>
              <h3 className="text-sm sm:text-base font-black text-[#1c1917] dark:text-[#f5eee3]">
                {activeInwardOrders.length} Delivery Truck(s) on Highway to Laxmi Textiles
              </h3>
              <p className="text-xs text-[#57534e] dark:text-[#a89f91]">
                Latest: #{activeInwardOrders[0].id} from {activeInwardOrders[0].vendorName} ({activeInwardOrders[0].totalItems} pcs). Tap to view live GPS map.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-black text-[#d96528] dark:text-[#ea7637] self-end sm:self-center shrink-0">
            <span>View Live Route Map</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* 3. FOUR LARGE TOUCH ACTION CARDS */}
      <div>
        <div className="text-xs font-black uppercase tracking-wider text-[#8c827a] dark:text-[#a89f91] mb-3 px-1">
          {t.whatToDoToday}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {primaryActions.map((action) => (
            <motion.div
              key={action.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(action.id)}
              className={`bg-white dark:bg-[#201c18] rounded-3xl p-5 sm:p-6 border ${action.borderColor} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${action.accentBg} flex items-center justify-center shadow-2xs`}>
                    {action.icon}
                  </div>
                  <span className="text-[11px] font-black text-[#d96528] dark:text-[#ea7637] flex items-center gap-1">
                    {t.openAction} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base sm:text-lg font-black text-[#1c1917] dark:text-[#f5eee3]">
                    {action.title}
                  </h3>
                  <p className="text-xs text-[#78716c] dark:text-[#a89f91] mt-0.5 leading-relaxed">
                    {action.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#f0e6d8] dark:border-[#38322b] flex items-center justify-between text-xs">
                <span className="text-[#78716c] dark:text-[#a89f91] font-medium">{action.metricLabel}</span>
                <span className="font-extrabold text-[#1c1917] dark:text-[#f5eee3] text-sm">{action.metric}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. TODAY'S STORE SNAPSHOT */}
      <div className="bg-[#f5eee3] dark:bg-[#241f1a] rounded-3xl p-5 sm:p-6 border border-[#e4d8c5] dark:border-[#38322b] space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-[#e4d8c5] dark:border-[#38322b] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#d96528] dark:text-[#ea7637]" />
            <h3 className="font-black text-sm sm:text-base text-[#1c1917] dark:text-[#f5eee3]">
              {t.todaysSnapshot}
            </h3>
          </div>
          <span className="text-xs text-[#78716c] dark:text-[#a89f91] font-bold">
            Live Store Status
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            onClick={() => setActiveTab('inventory')}
            className="bg-white dark:bg-[#201c18] p-4 rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] cursor-pointer hover:border-[#d96528] transition-all"
          >
            <span className="text-[10px] font-bold uppercase text-[#8c827a] dark:text-[#a89f91] block">
              {t.totalClothes}
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#1c1917] dark:text-[#f5eee3] mt-1">
              {formatNumber(stats.totalUnitsInStock)} <span className="text-xs font-normal text-[#78716c] dark:text-[#a89f91]">{t.pieces}</span>
            </div>
            <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] mt-0.5">
              {t.acrossVarieties} {stats.totalUniqueProducts} varieties
            </div>
          </div>

          <div
            onClick={() => setActiveTab('sales')}
            className="bg-white dark:bg-[#201c18] p-4 rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] cursor-pointer hover:border-[#2d6a3f] transition-all"
          >
            <span className="text-[10px] font-bold uppercase text-[#8c827a] dark:text-[#a89f91] block">
              {t.todaysSales}
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#2d6a3f] dark:text-[#4ade80] mt-1">
              {formatCurrency(stats.todaysRevenue)}
            </div>
            <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] mt-0.5">
              {stats.todaysSalesCount} {t.piecesSoldToday}
            </div>
          </div>

          <div
            onClick={() => setActiveTab('low-stock')}
            className="bg-white dark:bg-[#201c18] p-4 rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] cursor-pointer hover:border-[#b9381e] transition-all"
          >
            <span className="text-[10px] font-bold uppercase text-[#8c827a] dark:text-[#a89f91] block">
              {t.itemsRunningLow}
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#b9381e] dark:text-[#f87171] mt-1">
              {stats.outOfStockCount + stats.lowStockCount}
            </div>
            <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] mt-0.5">
              {stats.outOfStockCount} {t.completelyEmpty}
            </div>
          </div>

          <div
            onClick={() => setActiveTab('analytics')}
            className="bg-white dark:bg-[#201c18] p-4 rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] cursor-pointer hover:border-[#704282] transition-all"
          >
            <span className="text-[10px] font-bold uppercase text-[#8c827a] dark:text-[#a89f91] block">
              {t.moneyInSlowStock}
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#704282] dark:text-[#c084fc] mt-1">
              {formatCurrency(stats.deadStockCapital)}
            </div>
            <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] mt-0.5">
              {stats.deadStockCount} {t.sittingOnShelves}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
