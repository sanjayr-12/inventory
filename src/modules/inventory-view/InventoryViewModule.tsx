'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { Category, Product } from '@/src/types';
import {
  Boxes,
  Search,
  MapPin,
  Edit3,
  LayoutGrid,
  List,
} from 'lucide-react';
import { formatCurrency, getStockStatus } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const InventoryViewModule: React.FC = () => {
  const { products, quickAdjustStock, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } =
    useInventory();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [auditQty, setAuditQty] = useState<number>(0);
  const [auditReason, setAuditReason] = useState('Morning shelf count');

  const categorySummary = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.currentStock;
    return acc;
  }, {} as Record<string, number>);

  const categories: (Category | 'All')[] = [
    'All',
    'Sarees',
    "Men's Wear",
    "Women's Wear",
    'School Uniforms',
    'Kids Wear',
    'Dhotis & Traditional',
    'Fabrics & Materials',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rackLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.color && p.color.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAuditModal = (p: Product) => {
    setEditingProduct(p);
    setAuditQty(p.currentStock);
    setAuditReason('Routine shelf physical count');
  };

  const handleSaveAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    quickAdjustStock(editingProduct.id, auditQty, auditReason);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. TOP BANNER */}
      <div className="bg-[#f5eee3] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917]">
            📦 What's In My Shop? (Live Stock)
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] mt-0.5">
            Instantly see how many pieces of each saree or shirt are left and where they are kept.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#e8dfd1] self-start sm:self-center shadow-2xs">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] hover:text-[#1c1917]'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] hover:text-[#1c1917]'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CATEGORY PILLS (Big & Clickable) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {categories.map((c) => {
          const isSelected = selectedCategory === c;
          const count = c === 'All' ? products.reduce((s, p) => s + p.currentStock, 0) : categorySummary[c] || 0;

          return (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#d96528] text-white shadow-sm'
                  : 'bg-white text-[#44403c] border border-[#e8dfd1] hover:border-[#d96528]'
              }`}
            >
              <span>{c}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-[#f5eee3] text-[#78716c]'
                }`}
              >
                {count} pcs
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH BAR */}
      <div className="relative">
        <Search className="w-5 h-5 text-[#8c827a] absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search by saree name, color, shelf location (e.g. Rack A-2)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-[#e0d3c1] rounded-2xl text-sm sm:text-base text-[#1c1917] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#d96528] shadow-xs"
        />
      </div>

      {/* 4. LIST / TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-[#e8dfd1] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f5eee3] border-b border-[#e8dfd1] text-[#78716c] text-[10px] font-black uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Item Name</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Where Kept (Shelf)</th>
                  <th className="px-5 py-4 text-center">Available Stock</th>
                  <th className="px-5 py-4 text-right">Price</th>
                  <th className="px-5 py-4 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e6d8]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[#8c827a] text-sm font-medium">
                      No matching items found in shop catalog.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const statusInfo = getStockStatus(product);

                    return (
                      <tr key={product.id} className="hover:bg-[#fbf8f2] transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-extrabold text-[#1c1917] text-sm sm:text-base">{product.name}</div>
                          <div className="text-xs text-[#78716c] mt-0.5">
                            {product.color && <span>{product.color}</span>}
                            {product.fabric && <span> • {product.fabric}</span>}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-xl bg-[#f5eee3] font-bold text-xs text-[#57534e] border border-[#e4d8c5]">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-[#1c1917] font-bold">
                            <MapPin className="w-4 h-4 text-[#d96528] shrink-0" />
                            <span>{product.rackLocation}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-black border ${statusInfo.badgeClass}`}
                          >
                            {product.currentStock} pieces
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right font-black text-sm sm:text-base text-[#1c1917]">
                          {formatCurrency(product.sellingPrice)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => openAuditModal(product)}
                            className="p-2 hover:bg-[#f5eee3] rounded-xl text-[#78716c] hover:text-[#d96528] transition-colors cursor-pointer"
                            title="Correct stock count"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const statusInfo = getStockStatus(product);

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#e8dfd1] p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-xl bg-[#f5eee3] text-[#57534e]">
                      {product.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.badgeClass}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-[#1c1917] mt-2">{product.name}</h3>

                  <div className="text-xs text-[#78716c] space-y-1 mt-2">
                    <div className="flex items-center gap-1.5 text-[#1c1917] font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#d96528]" />
                      <span>{product.rackLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f0e6d8] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8c827a] block">In Shop</span>
                    <span className="text-xl font-black text-[#1c1917]">
                      {product.currentStock} <span className="text-xs font-normal text-[#78716c]">pcs</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-[#1c1917]">
                      {formatCurrency(product.sellingPrice)}
                    </div>
                    <button
                      onClick={() => openAuditModal(product)}
                      className="text-xs text-[#d96528] hover:underline font-bold mt-0.5 inline-block cursor-pointer"
                    >
                      Correct Count
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Correction Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#e8dfd1] shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-3">
                <h3 className="font-black text-base text-[#1c1917]">Physical Shelf Count Check</h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-[#8c827a] hover:text-[#1c1917] font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div>
                <span className="text-xs text-[#78716c]">Item:</span>
                <h4 className="text-sm font-extrabold text-[#1c1917]">{editingProduct.name}</h4>
                <p className="text-xs text-[#78716c] mt-0.5">Location: {editingProduct.rackLocation}</p>
              </div>

              <form onSubmit={handleSaveAudit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#44403c] uppercase mb-1">
                    How many pieces did you physically count on the shelf?
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={auditQty}
                    onChange={(e) => setAuditQty(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#fbf8f2] border-2 border-[#eed6c0] rounded-2xl text-xl font-black text-[#1c1917] focus:border-[#d96528] focus:outline-hidden"
                  />
                  <div className="text-[11px] text-[#78716c] mt-1">
                    Previous count in system: <strong>{editingProduct.currentStock} pcs</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#44403c] uppercase mb-1">
                    Reason / Note
                  </label>
                  <input
                    type="text"
                    required
                    value={auditReason}
                    onChange={(e) => setAuditReason(e.target.value)}
                    placeholder="e.g. Verified count during morning inspection"
                    className="w-full px-3 py-2 bg-[#fbf8f2] border border-[#e0d3c1] rounded-xl text-xs text-[#1c1917]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#e8dfd1] text-xs font-bold text-[#57534e] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#d96528] hover:bg-[#c45418] text-white text-xs font-black shadow-xs cursor-pointer"
                  >
                    Save Verified Count
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
