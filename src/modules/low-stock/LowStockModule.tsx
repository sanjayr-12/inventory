'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { Product } from '@/src/types';
import {
  AlertTriangle,
  PackagePlus,
  MessageCircle,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, getStockStatus } from '@/src/lib/utils';
import { toast } from 'sonner';

export const LowStockModule: React.FC = () => {
  const { outOfStockProducts, lowStockProducts, setActiveTab, recordStockIn } = useInventory();
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
      notes: 'Quick 1-Click Reorder from Alert Center',
    });
    setSelectedProductForReorder(null);
  };

  const generateWhatsAppMessage = (product: Product, qty: number) => {
    const text = encodeURIComponent(
      `Hello ${product.supplier},\n\nLaxmi Textiles urgent purchase order:\n• Product: ${product.name} (${product.sku})\n• Quantity: ${qty} pieces\n• Destination: Laxmi Textiles Store\n\nPlease confirm dispatch date and billing details. Thank you!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    toast.success(`Generated purchase draft for ${product.supplier}`);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f5eee3] p-6 rounded-3xl border border-[#e4d8c5]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#b9381e] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#b9381e]" />
            Supplier Reorder Alerts
          </div>
          <h2 className="text-2xl font-black text-[#1c1917]">
            Low Stock & Reorder Alert Center
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e]">
            Spot fast-selling sarees and apparel before they run dry. Restock in 1 click or dispatch WhatsApp POs to weavers.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-2xl border border-[#e8dfd1] text-xs font-bold self-start sm:self-center flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#b9381e] animate-pulse" />
          <span className="text-[#1c1917]">{totalAlerts} Items Need Supplier Orders</span>
        </div>
      </div>

      {/* SECTION 1: CRITICAL OUT OF STOCK */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#fdf0ed] text-[#b9381e] flex items-center justify-center font-bold text-xs border border-[#f8d0c8]">
            🔴
          </span>
          <h3 className="text-lg font-black text-[#1c1917]">
            Critical: Out of Stock (Lost Sale Risk!)
          </h3>
          <span className="text-xs bg-[#fdf0ed] text-[#b9381e] font-bold px-2 py-0.5 rounded-full border border-[#f8d0c8]">
            {outOfStockProducts.length} items
          </span>
        </div>

        {outOfStockProducts.length === 0 ? (
          <div className="p-6 bg-white rounded-3xl border border-[#e8dfd1] text-center text-xs text-[#78716c] flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2d6a3f]" />
            No products are completely out of stock right now. Excellent inventory availability!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outOfStockProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border-2 border-[#f8d0c8] p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#8c827a] uppercase">{product.category}</span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#b9381e] text-white">
                      0 PIECES (SOLD OUT)
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-[#1c1917] mt-1">{product.name}</h4>

                  <p className="text-xs text-[#78716c] mt-1">{product.description}</p>

                  <div className="mt-3 p-3 bg-[#fdf0ed] rounded-2xl text-xs space-y-1 text-[#44403c] border border-[#f8d0c8]">
                    <div className="flex justify-between">
                      <span className="text-[#78716c]">Primary Supplier:</span>
                      <strong className="text-[#1c1917]">{product.supplier}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78716c]">Shelf Location:</span>
                      <strong className="text-[#d96528]">{product.rackLocation}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78716c]">Total Units Sold:</span>
                      <strong className="text-[#1c1917]">{product.totalUnitsSold} pieces</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#f0e6d8]">
                  <button
                    onClick={() => generateWhatsAppMessage(product, 30)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#2d6a3f] hover:bg-[#235331] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Order (30 pcs)
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProductForReorder(product);
                      setReorderQty(30);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-[#1c1917] hover:bg-[#292524] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <PackagePlus className="w-4 h-4" /> Quick Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: RUNNING LOW */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#fcf3e6] text-[#b45309] flex items-center justify-center font-bold text-xs border border-[#fae2c0]">
            🟠
          </span>
          <h3 className="text-lg font-black text-[#1c1917]">
            Running Low: Reorder Recommended
          </h3>
          <span className="text-xs bg-[#fcf3e6] text-[#b45309] font-bold px-2 py-0.5 rounded-full border border-[#fae2c0]">
            {lowStockProducts.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-[#fae2c0] p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-[#8c827a] uppercase">{product.category}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fcf3e6] text-[#b45309] border border-[#fae2c0]">
                    Only {product.currentStock} left!
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-[#1c1917] mt-1">{product.name}</h4>

                <div className="mt-2 text-xs text-[#78716c] space-y-1">
                  <div>📍 {product.rackLocation}</div>
                  <div>Supplier: {product.supplier}</div>
                  <div>Threshold trigger: ≤ {product.lowStockThreshold} pcs</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#f0e6d8] flex items-center gap-2">
                <button
                  onClick={() => generateWhatsAppMessage(product, 25)}
                  className="flex-1 py-2 rounded-xl bg-[#f5eee3] hover:bg-[#ede3d3] text-[#1c1917] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#2d6a3f]" /> WhatsApp
                </button>
                <button
                  onClick={() => {
                    setSelectedProductForReorder(product);
                    setReorderQty(20);
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#d96528] hover:bg-[#c45418] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  + Restock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reorder Modal */}
      {selectedProductForReorder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#e8dfd1] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-3">
              <h3 className="font-black text-base text-[#1c1917]">1-Click Quick Restock</h3>
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
                Current Stock: <strong>{selectedProductForReorder.currentStock} pcs</strong> • Supplier:{' '}
                <strong>{selectedProductForReorder.supplier}</strong>
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-[#44403c] uppercase mb-1">
                  Quantity Received (Pieces)
                </label>
                <input
                  type="number"
                  min="1"
                  value={reorderQty}
                  onChange={(e) => setReorderQty(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#fbf8f2] border-2 border-[#eed6c0] rounded-2xl text-lg font-black text-[#1c1917] focus:border-[#d96528] focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-[#f5eee3] rounded-2xl text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#78716c]">Buying Cost/pc:</span>
                  <strong className="text-[#1c1917]">{formatCurrency(selectedProductForReorder.costPrice)}</strong>
                </div>
                <div className="flex justify-between font-bold text-[#1c1917]">
                  <span>Total Purchase Cost:</span>
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
                Confirm (+{reorderQty} pcs)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
