'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { Product } from '@/src/types';
import {
  AlertTriangle,
  PackagePlus,
  Truck,
  MapPin,
  CheckCircle2,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';

export const LowStockModule: React.FC = () => {
  const { outOfStockProducts, lowStockProducts, recordStockIn, setActiveTab, t } = useInventory();
  const [selectedProductForReorder, setSelectedProductForReorder] = useState<Product | null>(null);
  const [reorderQty, setReorderQty] = useState(25);

  const totalAlerts = outOfStockProducts.length + lowStockProducts.length;

  const handleQuickRestock = (product: Product) => {
    recordStockIn({
      productId: product.id,
      isNewProduct: false,
      quantity: reorderQty,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      supplier: product.supplier,
      rackLocation: product.rackLocation,
      notes: 'Quick Inward Restock from Alert Center',
    });
    setSelectedProductForReorder(null);
  };

  const handleGoToVendorOrders = () => {
    setActiveTab('vendor-orders');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-[#f5eee3] dark:bg-[#241f1a] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] dark:border-[#38322b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917] dark:text-[#f5eee3]">
            {t.reorderAlertsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#a89f91] mt-0.5">
            {t.reorderAlertsSub}
          </p>
        </div>

        <button
          onClick={handleGoToVendorOrders}
          className="bg-[#d96528] hover:bg-[#c45418] text-white px-4 py-2.5 rounded-2xl text-xs font-black self-start sm:self-center flex items-center gap-2 shadow-xs cursor-pointer transition-all"
        >
          <Truck className="w-4 h-4" />
          <span>{t.vendorOrders} ({totalAlerts})</span>
        </button>
      </div>

      {/* 1. OUT OF STOCK ITEMS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#b9381e] dark:text-[#f87171] font-black text-sm px-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#b9381e] dark:bg-[#f87171] animate-ping" />
          <span>{t.completelySoldOut}</span>
        </div>

        {outOfStockProducts.length === 0 ? (
          <div className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-6 text-center text-xs text-[#78716c] dark:text-[#a89f91] flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2d6a3f] dark:text-[#4ade80]" />
            <span>Awesome! No items are completely sold out right now.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {outOfStockProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-[#201c18] rounded-3xl border-2 border-[#f8d0c8] dark:border-[#52221b] p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fdf0ed] dark:bg-[#3d1a15] text-[#b9381e] dark:text-[#f87171] border border-[#f8d0c8] dark:border-[#52221b]">
                      🔴 0 {t.pieces} Left
                    </span>
                    <span className="text-[11px] text-[#78716c] dark:text-[#a89f91] font-semibold">{p.category}</span>
                  </div>

                  <h4 className="font-black text-sm sm:text-base text-[#1c1917] dark:text-[#f5eee3] mt-2">
                    {p.name}
                  </h4>

                  <div className="text-xs text-[#78716c] dark:text-[#a89f91] space-y-0.5 mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#d96528]" />
                      <span>Shelf: {p.rackLocation}</span>
                    </div>
                    <div>Weaver: <strong>{p.supplier}</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f0e6d8] dark:border-[#38322b] flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-[#1c1917] dark:text-[#f5eee3]">
                    MRP: {formatCurrency(p.sellingPrice)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGoToVendorOrders}
                      className="py-1.5 px-3 rounded-xl bg-[#d96528] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{t.orderFromWeaverLiveTrack}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. RUNNING LOW ITEMS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#b45309] dark:text-[#f59e0b] font-black text-sm px-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#b45309] dark:bg-[#f59e0b]" />
          <span>{t.runningLow}</span>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-6 text-center text-xs text-[#78716c] dark:text-[#a89f91] flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2d6a3f] dark:text-[#4ade80]" />
            <span>All stock levels are healthy!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#fae2c0] dark:border-[#52301c] p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fcf3e6] dark:bg-[#382b18] text-[#b45309] dark:text-[#f59e0b] border border-[#fae2c0] dark:border-[#52301c]">
                      🟠 Only {p.currentStock} {t.pieces} Left
                    </span>
                    <span className="text-[11px] text-[#78716c] dark:text-[#a89f91] font-semibold">{p.category}</span>
                  </div>

                  <h4 className="font-black text-sm sm:text-base text-[#1c1917] dark:text-[#f5eee3] mt-2">
                    {p.name}
                  </h4>

                  <div className="text-xs text-[#78716c] dark:text-[#a89f91] space-y-0.5 mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#d96528]" />
                      <span>Shelf: {p.rackLocation}</span>
                    </div>
                    <div>Weaver: <strong>{p.supplier}</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f0e6d8] dark:border-[#38322b] flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-[#1c1917] dark:text-[#f5eee3]">
                    MRP: {formatCurrency(p.sellingPrice)}
                  </div>

                  <button
                    onClick={handleGoToVendorOrders}
                    className="py-1.5 px-3 rounded-xl bg-[#faeedf] dark:bg-[#3d2415] hover:bg-[#f6dfc7] text-[#c45418] dark:text-[#ea7637] font-bold text-xs flex items-center gap-1 cursor-pointer border border-[#eed6c0] dark:border-[#52301c]"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>{t.orderFromWeaversTab}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
