'use client';

import React from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Lock,
  DollarSign,
  Zap,
  Flame,
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
    <div className="space-y-8">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f5eee3] p-6 rounded-3xl border border-[#e4d8c5]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#704282] uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-[#704282]" />
            Turnover & Capital Analytics
          </div>
          <h2 className="text-2xl font-black text-[#1c1917]">
            Fast vs. Slow-Moving Stock & Capital Insights
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e]">
            Identify which textiles generate daily cash flow vs which ones trap your working capital on upper shelves.
          </p>
        </div>

        <div className="bg-[#f5eef9] text-[#704282] border border-[#e7daf0] px-4 py-2 rounded-2xl text-xs font-bold self-start sm:self-center shadow-2xs">
          Working Capital Analysis
        </div>
      </div>

      {/* Hero Financial Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trapped Capital */}
        <div className="bg-[#f5eef9] p-6 rounded-3xl border border-[#e7daf0] shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#704282] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#704282]" />
                Capital Trapped in Dead Stock
              </span>
              <span className="text-[10px] bg-white text-[#704282] font-bold px-2 py-0.5 rounded-full border border-[#e7daf0]">
                Needs Action
              </span>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-black text-[#704282]">{formatCurrency(stats.deadStockCapital)}</div>
              <p className="text-xs text-[#57534e] mt-1 leading-snug">
                Locked in <strong>{slowMovingProducts.length} product lines</strong> sitting on shelves with low or zero
                recent sales.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#e7daf0] flex items-center justify-between text-xs">
            <span className="text-[#78716c]">Recommendation:</span>
            <span className="font-extrabold text-[#704282]">Clearance Discount / 15% Off</span>
          </div>
        </div>

        {/* Total Stock Valuation */}
        <div className="bg-white p-6 rounded-3xl border border-[#e8dfd1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#8c827a] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#2d6a3f]" />
                Total Stock Valuation
              </span>
              <span className="text-[10px] bg-[#eef5ee] text-[#2d6a3f] px-2 py-0.5 rounded-full font-bold">
                Cost Basis
              </span>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-black text-[#1c1917]">
                {formatCurrency(stats.totalInventoryValuation)}
              </div>
              <p className="text-xs text-[#78716c] mt-1">
                Estimated Retail Value: <strong>{formatCurrency(stats.totalRetailValuation)}</strong>
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0e6d8] flex items-center justify-between text-xs">
            <span className="text-[#78716c]">Gross Margin Potential:</span>
            <span className="font-extrabold text-[#2d6a3f]">
              +{formatCurrency(stats.potentialProfit)} (
              {Math.round((stats.potentialProfit / stats.totalInventoryValuation) * 100)}%)
            </span>
          </div>
        </div>

        {/* Sell-Through Efficiency */}
        <div className="bg-white p-6 rounded-3xl border border-[#e8dfd1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#8c827a] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#d96528]" />
                Sell-Through Velocity
              </span>
              <span className="text-[10px] bg-[#faeedf] text-[#c45418] px-2 py-0.5 rounded-full font-bold">
                Store Pulse
              </span>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-black text-[#1c1917]">
                {Math.round(
                  (products.reduce((s, p) => s + p.totalUnitsSold, 0) /
                    Math.max(1, products.reduce((s, p) => s + p.totalUnitsReceived, 0))) *
                    100
                )}
                %
              </div>
              <p className="text-xs text-[#78716c] mt-1">
                Overall turnover rate across {stats.totalUniqueProducts} active textile lines.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0e6d8] flex items-center justify-between text-xs">
            <span className="text-[#78716c]">Hero Sellers:</span>
            <span className="font-extrabold text-[#d96528]">{fastMovingProducts.length} Items</span>
          </div>
        </div>
      </div>

      {/* Comparison: Fast Moving vs Slow Moving */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAST-MOVING */}
        <div className="bg-white rounded-3xl border border-[#e8dfd1] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#eef5ee] text-[#2d6a3f]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#1c1917]">Fast-Moving Champions</h3>
                <p className="text-xs text-[#78716c]">High velocity • Keep steady restock pipeline</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#2d6a3f] bg-[#eef5ee] px-2.5 py-1 rounded-full border border-[#d2e4d3]">
              Cash Drivers
            </span>
          </div>

          <div className="space-y-3">
            {fastMovingProducts.map((p, idx) => {
              const sellThrough = Math.round((p.totalUnitsSold / Math.max(1, p.totalUnitsReceived)) * 100);

              return (
                <div
                  key={p.id}
                  className="p-3.5 bg-[#fbf8f2] rounded-2xl border border-[#f0e6d8] flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#8c827a]">#{idx + 1}</span>
                      <h4 className="font-extrabold text-[#1c1917]">{p.name}</h4>
                    </div>
                    <div className="text-[11px] text-[#78716c]">
                      Supplier: <strong>{p.supplier}</strong> • {p.category}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="inline-flex items-center gap-1 text-[#2d6a3f] font-bold text-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {p.totalUnitsSold} Sold ({sellThrough}%)
                    </div>
                    <div className="text-[11px] text-[#57534e]">
                      Available: <strong className={p.currentStock <= 5 ? 'text-[#b9381e]' : 'text-[#1c1917]'}>{p.currentStock} pcs</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SLOW-MOVING */}
        <div className="bg-white rounded-3xl border border-[#e8dfd1] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#f5eef9] text-[#704282]">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#1c1917]">Slow-Moving & Dead Stock</h3>
                <p className="text-xs text-[#78716c]">Money trapped on shelves • Stop repeat purchasing</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#704282] bg-[#f5eef9] px-2.5 py-1 rounded-full border border-[#e7daf0]">
              {formatCurrency(stats.deadStockCapital)} Stuck
            </span>
          </div>

          <div className="space-y-3">
            {slowMovingProducts.length === 0 ? (
              <p className="text-xs text-[#78716c] py-8 text-center">No dead stock detected!</p>
            ) : (
              slowMovingProducts.map((p) => {
                const trappedMoney = p.currentStock * p.costPrice;

                return (
                  <div
                    key={p.id}
                    className="p-3.5 bg-[#f5eef9]/40 rounded-2xl border border-[#e7daf0] flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[#1c1917]">{p.name}</h4>
                      <div className="text-[11px] text-[#78716c]">
                        {p.currentStock} unsold pieces • {p.rackLocation}
                      </div>
                      <div className="text-[10px] text-[#704282] font-bold">
                        💡 Suggestion: 15% clearance discount to unlock {formatCurrency(trappedMoney)}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#704282] block">
                        {formatCurrency(trappedMoney)}
                      </span>
                      <span className="text-[10px] text-[#8c827a]">locked</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Category Capital Distribution */}
      <div className="bg-white rounded-3xl border border-[#e8dfd1] p-6 shadow-xs space-y-4">
        <h3 className="font-black text-base text-[#1c1917]">
          Category Working Capital Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(categoryCapital).map(([category, amount]) => {
            const percentage = Math.round((amount / Math.max(1, stats.totalInventoryValuation)) * 100);
            return (
              <div
                key={category}
                className="p-3.5 bg-[#fbf8f2] rounded-2xl border border-[#f0e6d8]"
              >
                <div className="text-[11px] font-bold text-[#78716c] truncate">{category}</div>
                <div className="text-sm font-black text-[#1c1917] mt-1">
                  {formatCurrency(amount)}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="w-full bg-[#ebdccb] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#d96528] h-full rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-[10px] text-[#78716c] font-bold">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
