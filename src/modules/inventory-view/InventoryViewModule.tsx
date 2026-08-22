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
  const {
    products,
    quickAdjustStock,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    t,
  } = useInventory();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [auditQty, setAuditQty] = useState<number>(0);
  const [auditReason, setAuditReason] = useState('Morning shelf count');

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
    <div className="space-y-6">
      {/* 1. TOP BANNER */}
      <div className="bg-[#f5eee3] dark:bg-[#241f1a] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] dark:border-[#38322b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917] dark:text-[#f5eee3]">
            {t.liveStockTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#a89f91] mt-0.5">
            {t.liveStockSub}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white dark:bg-[#28231e] p-1 rounded-2xl border border-[#e8dfd1] dark:border-[#3d3731] shadow-2xs self-start sm:self-center">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] dark:text-[#a89f91] hover:text-[#1c1917]'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] dark:text-[#a89f91] hover:text-[#1c1917]'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY FILTER */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder={t.searchInventory}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 bg-white dark:bg-[#201c18] border border-[#e0d3c1] dark:border-[#38322b] rounded-2xl text-xs sm:text-sm text-[#1c1917] dark:text-[#f5eee3] focus:ring-2 focus:ring-[#d96528] focus:outline-hidden shadow-xs"
          />
          <Search className="w-4 h-4 text-[#8c827a] dark:text-[#a89f91] absolute left-4 top-3.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#d96528] text-white shadow-xs'
                  : 'bg-white dark:bg-[#201c18] border border-[#e8dfd1] dark:border-[#38322b] text-[#57534e] dark:text-[#a89f91] hover:bg-[#f5eee3] dark:hover:bg-[#2c2620]'
              }`}
            >
              {cat === 'All' ? 'All Items' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. INVENTORY CONTENT */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#fbf8f2] dark:bg-[#28231e] border-b border-[#e8dfd1] dark:border-[#38322b] text-[#8c827a] dark:text-[#a89f91] font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">{t.itemName}</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">{t.category}</th>
                  <th className="py-3.5 px-4">{t.whereKept}</th>
                  <th className="py-3.5 px-4 text-right">{t.availableStock}</th>
                  <th className="py-3.5 px-4 text-right hidden sm:table-cell">{t.price}</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e6d8] dark:divide-[#38322b]">
                {filteredProducts.map((p) => {
                  const status = getStockStatus(p);
                  return (
                    <tr key={p.id} className="hover:bg-[#fbf8f2] dark:hover:bg-[#28231e] transition-colors">
                      <td className="py-3 px-4 sm:px-6">
                        <div className="font-extrabold text-[#1c1917] dark:text-[#f5eee3]">{p.name}</div>
                        <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] flex items-center gap-1.5 mt-0.5">
                          <span>Weaver: {p.supplier}</span>
                          {p.color && <span>• {p.color}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f5eee3] dark:bg-[#28231e] text-[#57534e] dark:text-[#d6cec2]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-[#1c1917] dark:text-[#f5eee3] font-semibold text-xs">
                          <MapPin className="w-3 h-3 text-[#d96528]" />
                          <span>{p.rackLocation}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${status.badgeClass}`}>
                            {p.currentStock} {t.pieces}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right hidden sm:table-cell">
                        <div className="font-black text-[#1c1917] dark:text-[#f5eee3]">{formatCurrency(p.sellingPrice)}</div>
                        <div className="text-[10px] text-[#78716c] dark:text-[#a89f91]">Cost: {formatCurrency(p.costPrice)}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => openAuditModal(p)}
                          className="py-1.5 px-3 rounded-xl bg-[#f5eee3] dark:bg-[#28231e] hover:bg-[#ede3d3] dark:hover:bg-[#332c25] text-xs font-bold text-[#1c1917] dark:text-[#f5eee3] border border-[#e4d8c5] dark:border-[#38322b] cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3 text-[#d96528]" />
                          <span>{t.correctCount}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            const status = getStockStatus(p);
            return (
              <div
                key={p.id}
                className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#d96528] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f5eee3] dark:bg-[#28231e] text-[#57534e] dark:text-[#d6cec2]">
                      {p.category}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${status.badgeClass}`}>
                      {status.label}
                    </span>
                  </div>

                  <h4 className="font-black text-sm sm:text-base text-[#1c1917] dark:text-[#f5eee3] mt-2 line-clamp-2">
                    {p.name}
                  </h4>

                  <div className="text-xs text-[#78716c] dark:text-[#a89f91] flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d96528]" />
                    <span>{p.rackLocation}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f0e6d8] dark:border-[#38322b] flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black text-[#1c1917] dark:text-[#f5eee3]">
                      {p.currentStock} <span className="text-xs font-normal text-[#78716c] dark:text-[#a89f91]">{t.pieces}</span>
                    </div>
                    <div className="text-[11px] text-[#2d6a3f] dark:text-[#4ade80] font-bold">
                      {formatCurrency(p.sellingPrice)}
                    </div>
                  </div>

                  <button
                    onClick={() => openAuditModal(p)}
                    className="py-1.5 px-3 rounded-xl bg-[#f5eee3] dark:bg-[#28231e] hover:bg-[#ede3d3] text-xs font-bold text-[#1c1917] dark:text-[#f5eee3] border border-[#e4d8c5] dark:border-[#38322b] cursor-pointer inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3 text-[#d96528]" />
                    <span>{t.correctCount}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Adjust Count Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#201c18] rounded-3xl max-w-sm w-full p-6 border border-[#e8dfd1] dark:border-[#38322b] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f0e6d8] dark:border-[#38322b] pb-3">
                <h3 className="font-black text-base text-[#1c1917] dark:text-[#f5eee3]">{t.correctCount}</h3>
                <button onClick={() => setEditingProduct(null)} className="text-[#8c827a] font-bold cursor-pointer">
                  ✕
                </button>
              </div>

              <div className="text-xs text-[#78716c] dark:text-[#a89f91]">
                Correcting physical count for <strong>{editingProduct.name}</strong> on {editingProduct.rackLocation}.
              </div>

              <form onSubmit={handleSaveAudit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#44403c] dark:text-[#d6cec2] mb-1">
                    Actual Pieces on Shelf
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={auditQty}
                    onChange={(e) => setAuditQty(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#fbf8f2] dark:bg-[#28231e] border-2 border-[#d96528] rounded-2xl text-2xl font-black text-[#1c1917] dark:text-[#f5eee3] text-center focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#44403c] dark:text-[#d6cec2] mb-1">
                    Reason
                  </label>
                  <input
                    type="text"
                    required
                    value={auditReason}
                    onChange={(e) => setAuditReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fbf8f2] dark:bg-[#28231e] border border-[#e0d3c1] dark:border-[#38322b] rounded-xl text-xs text-[#1c1917] dark:text-[#f5eee3]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#e8dfd1] dark:border-[#38322b] text-xs font-bold text-[#57534e] dark:text-[#a89f91]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#d96528] hover:bg-[#c45418] text-white font-black text-xs shadow-xs"
                  >
                    Save New Count
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
