'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { Category, Product } from '@/src/types';
import {
  Boxes,
  Search,
  Filter,
  MapPin,
  Sparkles,
  Edit3,
  TrendingUp,
  Tag,
  Check,
  AlertTriangle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { formatCurrency, formatNumber, getStockStatus } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const InventoryViewModule: React.FC = () => {
  const { products, quickAdjustStock, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } =
    useInventory();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [auditQty, setAuditQty] = useState<number>(0);
  const [auditReason, setAuditReason] = useState('Physical count verification');

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
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rackLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.color && p.color.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.supplier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAuditModal = (p: Product) => {
    setEditingProduct(p);
    setAuditQty(p.currentStock);
    setAuditReason('Routine shelf physical audit');
  };

  const handleSaveAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    quickAdjustStock(editingProduct.id, auditQty, auditReason);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f5eee3] p-6 rounded-3xl border border-[#e4d8c5]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-wider">
            <Boxes className="w-4 h-4 text-[#b45309]" />
            Stock Directory & Audit
          </div>
          <h2 className="text-2xl font-black text-[#1c1917]">
            "What's In My Shop?" — Live Stock Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e]">
            Live inventory counts by category, shelf and rack locations, and inline physical audit adjustments.
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
            title="Table View"
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
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.entries(categorySummary).map(([cat, count]) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(isSelected ? 'All' : (cat as Category))}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#d96528] text-white border-[#d96528] shadow-sm'
                  : 'bg-white border-[#e8dfd1] hover:border-[#d96528]'
              }`}
            >
              <div
                className={`text-[10px] font-extrabold uppercase tracking-wider truncate ${
                  isSelected ? 'text-white/80' : 'text-[#8c827a]'
                }`}
              >
                {cat}
              </div>
              <div
                className={`text-2xl font-black mt-1 ${
                  isSelected ? 'text-white' : 'text-[#1c1917]'
                }`}
              >
                {count}{' '}
                <span className={`text-xs font-normal ${isSelected ? 'text-white/70' : 'text-[#78716c]'}`}>pcs</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e8dfd1] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#8c827a] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by product, color, rack location or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-sm text-[#1c1917] focus:outline-hidden focus:ring-2 focus:ring-[#d96528]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto scrollbar-none">
          <Filter className="w-4 h-4 text-[#8c827a] shrink-0" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'bg-[#f5eee3] text-[#57534e] hover:bg-[#ede3d3]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-[#e8dfd1] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f5eee3] border-b border-[#e8dfd1] text-[#78716c] text-[10px] font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Product & Fabric</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Shelf / Location</th>
                  <th className="px-5 py-4 text-center">Available Stock</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Selling Price</th>
                  <th className="px-5 py-4 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e6d8]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-[#8c827a] text-sm font-medium">
                      No matching products found in catalog.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const statusInfo = getStockStatus(product);

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-[#fbf8f2] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="font-extrabold text-[#1c1917]">{product.name}</div>
                          <div className="text-[11px] text-[#78716c] mt-0.5 flex items-center gap-2">
                            <span>SKU: {product.sku}</span>
                            {product.color && <span>• {product.color}</span>}
                            {product.fabric && <span>• {product.fabric}</span>}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-xl bg-[#f5eee3] font-bold text-xs text-[#57534e] border border-[#e4d8c5]">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-[#1c1917] font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-[#d96528] shrink-0" />
                            <span className="truncate max-w-[200px]">{product.rackLocation}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center gap-1 font-black text-base text-[#1c1917]">
                            {product.currentStock}{' '}
                            <span className="text-xs font-normal text-[#78716c]">pcs</span>
                          </div>
                          <div className="text-[10px] text-[#8c827a]">
                            Sold: {product.totalUnitsSold} / In: {product.totalUnitsReceived}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                            {statusInfo.label}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right font-black text-[#1c1917]">
                          {formatCurrency(product.sellingPrice)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => openAuditModal(product)}
                            className="p-2 hover:bg-[#f5eee3] rounded-xl text-[#78716c] hover:text-[#1c1917] transition-colors cursor-pointer"
                            title="Audit / Adjust Count"
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
                    <div className="flex items-center gap-1.5 text-[#1c1917] font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#d96528]" />
                      <span>{product.rackLocation}</span>
                    </div>
                    {product.fabric && <div>Material: {product.fabric}</div>}
                    <div>Supplier: {product.supplier}</div>
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
                      Adjust Count
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Audit Modal */}
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
                <h3 className="font-black text-base text-[#1c1917]">Audit Physical Stock Count</h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-[#8c827a] hover:text-[#1c1917] font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div>
                <span className="text-xs text-[#78716c]">Product:</span>
                <h4 className="text-sm font-extrabold text-[#1c1917]">{editingProduct.name}</h4>
                <p className="text-xs text-[#78716c] mt-0.5">Location: {editingProduct.rackLocation}</p>
              </div>

              <form onSubmit={handleSaveAudit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#44403c] uppercase mb-1">
                    Verified Physical Pieces Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={auditQty}
                    onChange={(e) => setAuditQty(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#fbf8f2] border-2 border-[#eed6c0] rounded-2xl text-lg font-black text-[#1c1917] focus:border-[#d96528] focus:outline-hidden"
                  />
                  <div className="text-[11px] text-[#78716c] mt-1">
                    System previous count: <strong>{editingProduct.currentStock} pcs</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#44403c] uppercase mb-1">
                    Audit Note
                  </label>
                  <input
                    type="text"
                    required
                    value={auditReason}
                    onChange={(e) => setAuditReason(e.target.value)}
                    placeholder="e.g. Verified count during morning shelf inspection"
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
