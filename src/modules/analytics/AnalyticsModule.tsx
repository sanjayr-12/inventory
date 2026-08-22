'use client';

import React from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Lock,
  DollarSign,
  Flame,
  Tag,
} from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';

export const AnalyticsModule: React.FC = () => {
  const { products, stats, slowMovingProducts, t } = useInventory();

  const fastMovingProducts = [...products]
    .sort((a, b) => b.totalUnitsSold - a.totalUnitsSold)
    .slice(0, 5);

  const categoryCapital = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.currentStock * p.costPrice;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-[#f5eee3] dark:bg-[#241f1a] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] dark:border-[#38322b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917] dark:text-[#f5eee3]">
            {t.stockInsightsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#a89f91] mt-0.5">
            {t.stockInsightsSub}
          </p>
        </div>
      </div>

      {/* 1. THREE KEY FINANCIAL NUMBERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Money in Slow Clothes */}
        <div className="bg-[#f5eef9] dark:bg-[#2e1d38] p-5 sm:p-6 rounded-3xl border border-[#e7daf0] dark:border-[#4d2861] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#704282] dark:text-[#d8b4fe] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#704282] dark:text-[#d8b4fe]" />
                {t.moneyStuckSlowStock}
              </span>
            </div>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[#704282] dark:text-[#d8b4fe]">
                {formatCurrency(stats.deadStockCapital)}
              </div>
              <p className="text-xs text-[#57534e] dark:text-[#e9d5ff] mt-1 leading-snug">
                Tied up in <strong>{slowMovingProducts.length} items</strong> with low sales recently.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Total Inventory Valuation */}
        <div className="bg-[#fbf8f2] dark:bg-[#28231e] p-5 sm:p-6 rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#8c827a] dark:text-[#a89f91] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#d96528]" />
                {t.totalInventoryValuation}
              </span>
            </div>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[#1c1917] dark:text-[#f5eee3]">
                {formatCurrency(stats.totalInventoryValuation)}
              </div>
              <p className="text-xs text-[#78716c] dark:text-[#a89f91] mt-1 leading-snug">
                Total buying cost of all {stats.totalUnitsInStock} pieces in shop.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Potential Profit */}
        <div className="bg-[#eef5ee] dark:bg-[#1a2e1f] p-5 sm:p-6 rounded-3xl border border-[#d2e4d3] dark:border-[#2d5937] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#2d6a3f] dark:text-[#86efac] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#2d6a3f] dark:text-[#86efac]" />
                Expected Retail Profit
              </span>
            </div>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[#2d6a3f] dark:text-[#86efac]">
                {formatCurrency(stats.potentialProfit)}
              </div>
              <p className="text-xs text-[#57534e] dark:text-[#bbf7d0] mt-1 leading-snug">
                When current inventory is fully sold at marked MRP.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FAST MOVING VS SLOW MOVING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast Selling */}
        <div className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center gap-2 border-b border-[#f0e6d8] dark:border-[#38322b] pb-3">
            <Flame className="w-5 h-5 text-[#d96528] dark:text-[#ea7637]" />
            <h3 className="font-black text-base text-[#1c1917] dark:text-[#f5eee3]">
              {t.topFastMoving}
            </h3>
          </div>

          <div className="space-y-3">
            {fastMovingProducts.map((p) => (
              <div
                key={p.id}
                className="p-3.5 bg-[#fbf8f2] dark:bg-[#28231e] rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] flex items-center justify-between text-xs gap-3"
              >
                <div>
                  <h4 className="font-extrabold text-[#1c1917] dark:text-[#f5eee3] text-sm truncate">{p.name}</h4>
                  <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] mt-0.5">
                    {p.rackLocation} • {p.supplier}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-xs px-2.5 py-0.5 rounded-full bg-[#eef5ee] dark:bg-[#1a2e1f] text-[#2d6a3f] dark:text-[#86efac] border border-[#d2e4d3] dark:border-[#2d5937]">
                    {p.totalUnitsSold} {t.pieces} Sold
                  </span>
                  <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] mt-0.5">
                    {p.currentStock} {t.pieces} left
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slow Moving */}
        <div className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center gap-2 border-b border-[#f0e6d8] dark:border-[#38322b] pb-3">
            <TrendingDown className="w-5 h-5 text-[#704282] dark:text-[#d8b4fe]" />
            <h3 className="font-black text-base text-[#1c1917] dark:text-[#f5eee3]">
              {t.slowMovingStock}
            </h3>
          </div>

          <div className="space-y-3">
            {slowMovingProducts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#78716c] dark:text-[#a89f91]">
                No dead stock! All catalog items have regular sales velocity.
              </div>
            ) : (
              slowMovingProducts.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 bg-[#fbf8f2] dark:bg-[#28231e] rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] flex items-center justify-between text-xs gap-3"
                >
                  <div>
                    <h4 className="font-extrabold text-[#1c1917] dark:text-[#f5eee3] text-sm truncate">{p.name}</h4>
                    <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] mt-0.5">
                      {p.rackLocation} • Cost: {formatCurrency(p.costPrice)}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-xs px-2.5 py-0.5 rounded-full bg-[#f5eef9] dark:bg-[#2e1d38] text-[#704282] dark:text-[#d8b4fe] border border-[#e7daf0] dark:border-[#4d2861]">
                      {p.currentStock} {t.pieces} stuck
                    </span>
                    <div className="text-[11px] text-[#704282] dark:text-[#d8b4fe] font-bold mt-0.5">
                      {formatCurrency(p.currentStock * p.costPrice)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. MONEY TIED BY CATEGORY */}
      <div className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2 border-b border-[#f0e6d8] dark:border-[#38322b] pb-3">
          <Tag className="w-5 h-5 text-[#d96528]" />
          <h3 className="font-black text-base text-[#1c1917] dark:text-[#f5eee3]">
            {t.moneyInvestedCategory}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(categoryCapital).map(([category, capital]) => (
            <div
              key={category}
              className="p-3.5 bg-[#fbf8f2] dark:bg-[#28231e] rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] space-y-1"
            >
              <span className="text-[10px] font-bold text-[#8c827a] dark:text-[#a89f91] uppercase block truncate">
                {category}
              </span>
              <div className="text-lg font-black text-[#1c1917] dark:text-[#f5eee3]">
                {formatCurrency(capital)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
