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
  const { products, stats, slowMovingProducts } = useInventory();

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
      <div className="bg-[#f5eee3] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917]">
            📊 Stock Insights & Money Tied in Clothes
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] mt-0.5">
            See which clothes sell fast vs which ones are trapping your money on upper shelves.
          </p>
        </div>
      </div>

      {/* 1. THREE KEY FINANCIAL NUMBERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Money in Slow Clothes */}
        <div className="bg-[#f5eef9] p-5 sm:p-6 rounded-3xl border border-[#e7daf0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#704282] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#704282]" />
                Money Stuck in Slow Stock
              </span>
            </div>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[#704282]">
                {formatCurrency(stats.deadStockCapital)}
              </div>
              <p className="text-xs text-[#57534e] mt-1 leading-snug">
                Tied up in <strong>{slowMovingProducts.length} items</strong> with low or zero sales recently.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#e7daf0] text-xs text-[#704282] font-bold">
            💡 Recommendation: Run a 15% discount sale to free up cash
          </div>
        </div>

        {/* Card 2: Total Store Stock Value */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e8dfd1] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase text-[#8c827a] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#2d6a3f]" />
              Total Shop Inventory Value
            </span>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[#1c1917]">
                {formatCurrency(stats.totalInventoryValuation)}
              </div>
              <p className="text-xs text-[#78716c] mt-1">
                Selling MRP Value: <strong>{formatCurrency(stats.totalRetailValuation)}</strong>
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0e6d8] text-xs text-[#2d6a3f] font-bold">
            Potential Profit: +{formatCurrency(stats.potentialProfit)}
          </div>
        </div>

        {/* Card 3: Fast-Selling Items */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#e8dfd1] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase text-[#8c827a] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#d96528]" />
              Fast-Selling Champions
            </span>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[#1c1917]">
                {fastMovingProducts.length} Hot Items
              </div>
              <p className="text-xs text-[#78716c] mt-1">
                Clothes with regular customer demand. Keep restocking these.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0e6d8] text-xs text-[#d96528] font-bold">
            Top Cash Drivers for Store
          </div>
        </div>
      </div>

      {/* 2. FAST SELLERS VS SLOW SELLERS LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast-Moving */}
        <div className="bg-white rounded-3xl border border-[#e8dfd1] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#eef5ee] text-[#2d6a3f]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#1c1917]">Top Fast-Moving Clothes</h3>
                <p className="text-xs text-[#78716c]">Highest sales volume</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#2d6a3f] bg-[#eef5ee] px-2.5 py-1 rounded-full border border-[#d2e4d3]">
              Selling Fast
            </span>
          </div>

          <div className="space-y-2.5">
            {fastMovingProducts.map((p, idx) => (
              <div
                key={p.id}
                className="p-3 bg-[#fbf8f2] rounded-2xl border border-[#f0e6d8] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#1c1917]">{p.name}</div>
                  <div className="text-[11px] text-[#78716c]">
                    Weaver: <strong>{p.supplier}</strong>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-[#2d6a3f] font-black text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {p.totalUnitsSold} pieces sold
                  </div>
                  <div className="text-[11px] text-[#57534e]">
                    In Stock: <strong>{p.currentStock} pcs</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slow-Moving / Dead Stock */}
        <div className="bg-white rounded-3xl border border-[#e8dfd1] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#f5eef9] text-[#704282]">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#1c1917]">Slow-Moving Stock</h3>
                <p className="text-xs text-[#78716c]">Sitting on shelves for a long time</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#704282] bg-[#f5eef9] px-2.5 py-1 rounded-full border border-[#e7daf0]">
              {formatCurrency(stats.deadStockCapital)} Stuck
            </span>
          </div>

          <div className="space-y-2.5">
            {slowMovingProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-[#f5eef9]/40 rounded-2xl border border-[#e7daf0] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#1c1917]">{p.name}</div>
                  <div className="text-[11px] text-[#78716c]">
                    {p.currentStock} unsold pieces • {p.rackLocation}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#704282] block">
                    {formatCurrency(p.currentStock * p.costPrice)}
                  </span>
                  <span className="text-[10px] text-[#8c827a]">capital locked</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MONEY INVESTED PER CATEGORY */}
      <div className="bg-white rounded-3xl border border-[#e8dfd1] p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="font-black text-base text-[#1c1917]">
          Money Invested in Each Category
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {Object.entries(categoryCapital).map(([category, amount]) => (
            <div
              key={category}
              className="p-3 bg-[#fbf8f2] rounded-2xl border border-[#f0e6d8]"
            >
              <div className="text-[11px] font-bold text-[#78716c] truncate">{category}</div>
              <div className="text-sm font-black text-[#1c1917] mt-1">
                {formatCurrency(amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
