'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { Product } from '@/src/types';
import {
  AlertTriangle,
  PackagePlus,
  MessageCircle,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';
import { toast } from 'sonner';

export const LowStockModule: React.FC = () => {
  const { outOfStockProducts, lowStockProducts, recordStockIn } = useInventory();
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
      notes: 'Quick Reorder from Alert Center',
    });
    setSelectedProductForReorder(null);
  };

  const generateWhatsAppMessage = (product: Product, qty: number) => {
    const text = encodeURIComponent(
      `Hello ${product.supplier},\n\nLaxmi Textiles urgent purchase order:\n• Product: ${product.name}\n• Quantity: ${qty} pieces\n• Destination: Laxmi Textiles Store\n\nPlease confirm dispatch date and billing details. Thank you!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    toast.success(`Generated purchase draft for ${product.supplier}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-[#f5eee3] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917]">
            ⚠️ Items to Reorder & Alerts
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] mt-0.5">
            Spot clothes that are running out and send WhatsApp orders to weavers in 1 tap.
          </p>
        </div>

        <div className="bg-white px-3.5 py-2 rounded-2xl border border-[#e8dfd1] text-xs font-bold self-start sm:self-center flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#b9381e] animate-pulse" />
          <span className="text-[#1c1917]">{totalAlerts} Items Need Restocking</span>
        </div>
      </div>

      {/* 1. OUT OF STOCK (URGENT) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#fdf0ed] text-[#b9381e] flex items-center justify-center font-bold text-xs border border-[#f8d0c8]">
            🔴
          </span>
          <h3 className="text-base sm:text-lg font-black text-[#1c1917]">
            Completely Sold Out (0 pieces left)
          </h3>
          <span className="text-xs bg-[#fdf0ed] text-[#b9381e] font-bold px-2 py-0.5 rounded-full border border-[#f8d0c8]">
            {outOfStockProducts.length}
          </span>
        </div>

        {outOfStockProducts.length === 0 ? (
          <div className="p-6 bg-white rounded-3xl border border-[#e8dfd1] text-center text-xs text-[#78716c] flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2d6a3f]" />
            No clothes are completely empty right now. Good stock availability!
          </div>
        ) : (
          <div className="space-y-3">
            {outOfStockProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border-2 border-[#f8d0c8] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#b9381e] text-white">
                      0 PIECES (EMPTY)
                    </span>
                    <span className="text-xs font-bold text-[#8c827a] uppercase">{product.category}</span>
                  </div>

                  <h4 className="text-base font-black text-[#1c1917] mt-1">{product.name}</h4>

                  <div className="text-xs text-[#78716c] mt-1 flex flex-wrap items-center gap-2 sm:gap-4">
                    <span>Weaver: <strong>{product.supplier}</strong></span>
                    <span>• Shelf: <strong>{product.rackLocation}</strong></span>
                    <span>• Buying Cost: <strong>{formatCurrency(product.costPrice)}/pc</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => generateWhatsAppMessage(product, 30)}
                    className="py-2.5 px-4 rounded-xl bg-[#2d6a3f] hover:bg-[#235331] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Order
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProductForReorder(product);
                      setReorderQty(30);
                    }}
                    className="py-2.5 px-3.5 rounded-xl bg-[#1c1917] hover:bg-[#292524] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <PackagePlus className="w-4 h-4" /> Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. RUNNING LOW */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#fcf3e6] text-[#b45309] flex items-center justify-center font-bold text-xs border border-[#fae2c0]">
            🟠
          </span>
          <h3 className="text-base sm:text-lg font-black text-[#1c1917]">
            Running Low (≤ 5 pieces left)
          </h3>
          <span className="text-xs bg-[#fcf3e6] text-[#b45309] font-bold px-2 py-0.5 rounded-full border border-[#fae2c0]">
            {lowStockProducts.length}
          </span>
        </div>

        <div className="space-y-3">
          {lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-[#fae2c0] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#fcf3e6] text-[#b45309] border border-[#fae2c0]">
                    Only {product.currentStock} left!
                  </span>
                  <span className="text-xs font-bold text-[#8c827a] uppercase">{product.category}</span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-[#1c1917] mt-1">{product.name}</h4>

                <div className="text-xs text-[#78716c] mt-1 flex flex-wrap items-center gap-2 sm:gap-4">
                  <span>Weaver: <strong>{product.supplier}</strong></span>
                  <span>• Shelf: <strong>{product.rackLocation}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => generateWhatsAppMessage(product, 25)}
                  className="py-2 px-3.5 rounded-xl bg-[#f5eee3] hover:bg-[#ede3d3] text-[#1c1917] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#2d6a3f]" /> WhatsApp
                </button>
                <button
                  onClick={() => {
                    setSelectedProductForReorder(product);
                    setReorderQty(20);
                  }}
                  className="py-2 px-3.5 rounded-xl bg-[#d96528] hover:bg-[#c45418] text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  + Restock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restock Modal */}
      {selectedProductForReorder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#e8dfd1] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-3">
              <h3 className="font-black text-base text-[#1c1917]">Quick Restock</h3>
              <button
                onClick={() => setSelectedProductForReorder(null)}
                className="text-[#8c827a] hover:text-[#1c1917] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <span className="text-xs text-[#78716c]">Item:</span>
              <h4 className="text-base font-extrabold text-[#1c1917]">
                {selectedProductForReorder.name}
              </h4>
              <p className="text-xs text-[#78716c] mt-0.5">
                Current: <strong>{selectedProductForReorder.currentStock} pcs</strong> • Supplier:{' '}
                <strong>{selectedProductForReorder.supplier}</strong>
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-[#44403c] uppercase mb-1">
                  How many pieces received?
                </label>
                <input
                  type="number"
                  min="1"
                  value={reorderQty}
                  onChange={(e) => setReorderQty(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#fbf8f2] border-2 border-[#eed6c0] rounded-2xl text-xl font-black text-[#1c1917] focus:border-[#d96528] focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-[#f5eee3] rounded-2xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#78716c]">Cost per piece:</span>
                  <strong className="text-[#1c1917]">{formatCurrency(selectedProductForReorder.costPrice)}</strong>
                </div>
                <div className="flex justify-between font-bold text-[#1c1917]">
                  <span>Total Cost:</span>
                  <span className="text-[#2d6a3f]">
                    {formatCurrency(reorderQty * selectedProductForReorder.costPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProductForReorder(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#e8dfd1] text-xs font-bold text-[#57534e] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleQuickRestock(selectedProductForReorder)}
                className="flex-1 py-2.5 rounded-xl bg-[#d96528] hover:bg-[#c45418] text-white text-xs font-black shadow-xs cursor-pointer"
              >
                Save (+{reorderQty} pcs)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
