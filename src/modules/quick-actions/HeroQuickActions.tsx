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
    setSearchQuery,
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

  const primaryActions = [
    {
      id: 'stock-in' as const,
      title: 'Add New Stock',
      tagline: 'When fresh goods arrive from weavers',
      metric: `${formatNumber(stats.totalUnitsInStock)} pcs`,
      metricLabel: 'In shop now',
      icon: <PackagePlus className="w-7 h-7 text-[#d96528]" />,
      accentBg: 'bg-[#faeedf]',
      borderColor: 'border-[#e8dfd1] hover:border-[#d96528]',
    },
    {
      id: 'sales' as const,
      title: 'Bill a Customer',
      tagline: 'Fast sale & automatic stock deduction',
      metric: `${formatCurrency(stats.todaysRevenue)}`,
      metricLabel: "Today's sales",
      icon: <ShoppingCart className="w-7 h-7 text-[#2d6a3f]" />,
      accentBg: 'bg-[#eef5ee]',
      borderColor: 'border-[#e8dfd1] hover:border-[#2d6a3f]',
    },
    {
      id: 'inventory' as const,
      title: 'Check Shop Stock',
      tagline: 'See what is on shelves right now',
      metric: `${stats.totalUniqueProducts} Types`,
      metricLabel: 'Catalog items',
      icon: <Boxes className="w-7 h-7 text-[#b45309]" />,
      accentBg: 'bg-[#fcf3e6]',
      borderColor: 'border-[#e8dfd1] hover:border-[#b45309]',
    },
    {
      id: 'low-stock' as const,
      title: 'Items to Reorder',
      tagline: 'What is low or completely sold out',
      metric: `${outOfStockProducts.length + lowStockProducts.length} Items`,
      metricLabel: outOfStockProducts.length > 0 ? `${outOfStockProducts.length} Sold Out!` : 'Need restock',
      icon: <AlertTriangle className="w-7 h-7 text-[#b9381e]" />,
      accentBg: 'bg-[#fdf0ed]',
      borderColor: 'border-[#e8dfd1] hover:border-[#b9381e]',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. TOP QUICK SEARCH BAR (Instant answer for shop staff) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e8dfd1] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#1c1917]">
              Laxmi Textiles Store Register
            </h2>
            <p className="text-xs text-[#78716c]">
              What would you like to check or do today?
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 text-[#8c827a] absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Type any saree, shirt, dhoti, color, or rack name to find stock immediately..."
            value={instantSearch}
            onChange={(e) => setInstantSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-sm sm:text-base text-[#1c1917] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#d96528]"
          />
        </div>

        {/* Instant Search Results Dropdown */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="bg-[#fbf8f2] rounded-2xl p-3 border border-[#e8dfd1] space-y-2"
            >
              <div className="text-[11px] font-bold text-[#8c827a] uppercase px-1">
                Instant Stock Lookup Results:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchResults.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSearchResultClick(item.name)}
                      className="p-3 bg-white rounded-xl border border-[#e8dfd1] hover:border-[#d96528] cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#1c1917]">{item.name}</div>
                        <div className="text-[11px] text-[#78716c] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#d96528]" />
                          <span>{item.rackLocation}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${status.badgeClass}`}>
                          {item.currentStock} pcs
                        </span>
                        <div className="text-[10px] text-[#8c827a] font-semibold mt-0.5">
                          {formatCurrency(item.sellingPrice)}
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

      {/* 2. THE 4 BIG PRIMARY ACTION CARDS */}
      <div>
        <div className="text-xs font-black uppercase tracking-wider text-[#8c827a] mb-3 px-1">
          Quick Actions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {primaryActions.map((action, idx) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(action.id)}
              className={`group cursor-pointer bg-white rounded-3xl p-5 border-2 ${action.borderColor} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[170px]`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${action.accentBg} flex items-center justify-center`}>
                    {action.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-black text-[#1c1917]">{action.metric}</div>
                    <div className="text-[10px] font-bold text-[#8c827a]">{action.metricLabel}</div>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-black text-[#1c1917] mt-4 group-hover:text-[#d96528] transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-[#78716c] mt-0.5">{action.tagline}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f0e6d8] flex items-center justify-between text-xs font-bold text-[#57534e] group-hover:text-[#d96528]">
                <span>Open {action.title}</span>
                <div className="w-6 h-6 rounded-lg bg-[#f5eee3] group-hover:bg-[#d96528] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. SIMPLE STORE NUMBERS AT A GLANCE */}
      <div>
        <div className="text-xs font-black uppercase tracking-wider text-[#8c827a] mb-3 px-1">
          Today's Store Snapshot
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Total Stock */}
          <div
            onClick={() => setActiveTab('inventory')}
            className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-[#e8dfd1] hover:border-[#d96528] shadow-xs transition-all"
          >
            <span className="text-[11px] font-bold text-[#8c827a] uppercase block">Total Available Clothes</span>
            <div className="text-xl sm:text-2xl font-black text-[#1c1917] mt-1">
              {formatNumber(stats.totalUnitsInStock)}{' '}
              <span className="text-xs font-normal text-[#78716c]">pieces</span>
            </div>
            <span className="text-[11px] text-[#2d6a3f] font-bold mt-1 block">
              Across {stats.totalUniqueProducts} varieties
            </span>
          </div>

          {/* Card 2: Today's Revenue */}
          <div
            onClick={() => setActiveTab('sales')}
            className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-[#e8dfd1] hover:border-[#2d6a3f] shadow-xs transition-all"
          >
            <span className="text-[11px] font-bold text-[#8c827a] uppercase block">Today's Total Sales</span>
            <div className="text-xl sm:text-2xl font-black text-[#2d6a3f] mt-1">
              {formatCurrency(stats.todaysRevenue)}
            </div>
            <span className="text-[11px] text-[#78716c] font-semibold mt-1 block">
              {stats.todaysSalesCount} pieces sold today
            </span>
          </div>

          {/* Card 3: Items to Reorder */}
          <div
            onClick={() => setActiveTab('low-stock')}
            className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-[#e8dfd1] hover:border-[#b9381e] shadow-xs transition-all"
          >
            <span className="text-[11px] font-bold text-[#8c827a] uppercase block">Items Running Low</span>
            <div className="text-xl sm:text-2xl font-black text-[#b9381e] mt-1">
              {stats.outOfStockCount + stats.lowStockCount}{' '}
              <span className="text-xs font-normal text-[#78716c]">items</span>
            </div>
            <span className="text-[11px] text-[#b9381e] font-bold mt-1 block">
              {stats.outOfStockCount > 0 ? `⚠️ ${stats.outOfStockCount} completely empty` : 'Need restock'}
            </span>
          </div>

          {/* Card 4: Money in Slow Stock */}
          <div
            onClick={() => setActiveTab('analytics')}
            className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-[#e8dfd1] hover:border-[#704282] shadow-xs transition-all"
          >
            <span className="text-[11px] font-bold text-[#8c827a] uppercase block">Money in Slow Items</span>
            <div className="text-xl sm:text-2xl font-black text-[#704282] mt-1">
              {formatCurrency(stats.deadStockCapital)}
            </div>
            <span className="text-[11px] text-[#704282] font-bold mt-1 block">
              {slowMovingProducts.length} items sitting on shelves
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
