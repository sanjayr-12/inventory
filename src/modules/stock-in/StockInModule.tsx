'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { Category, Product } from '@/src/types';
import {
  PackagePlus,
  Truck,
  IndianRupee,
  MapPin,
  Sparkles,
  Layers,
  History,
  CheckCircle,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/src/lib/utils';
import { motion } from 'framer-motion';

const CATEGORIES: Category[] = [
  'Sarees',
  "Men's Wear",
  "Women's Wear",
  'School Uniforms',
  'Kids Wear',
  'Dhotis & Traditional',
  'Fabrics & Materials',
];

const POPULAR_SUPPLIERS = [
  'Coimbatore Cotton Mills',
  'Kanchipuram Master Weavers',
  'Surat Silk Mills',
  'Tirupur Garments Hub',
  'Erode Textile Processors',
  'Salem Handlooms',
  'Madurai Weavers Syndicate',
  'Varanasi Silk Craft',
];

const COMMON_RACK_LOCATIONS = [
  'Rack A-1 (Silk Section)',
  'Rack A-2 (Cotton Sarees)',
  'Rack A-4 (Daily Cotton)',
  'Rack S-1 (Wedding Silk VIP Section)',
  'Rack S-4 (Banarasi & Heavy Silks)',
  'Rack M-1 (Men Ethnic & Kurtas)',
  'Rack M-3 (Men Formal Shirts)',
  'Rack W-1 (Dress Materials & Chudidar)',
  'Rack U-2 (School Uniforms)',
  'Rack D-1 (Dhoti Section)',
  'Rack K-2 (Kids Festival Wear)',
];

export const StockInModule: React.FC = () => {
  const { products, movements, recordStockIn } = useInventory();

  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');

  // New Product fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Sarees');
  const [color, setColor] = useState('');
  const [fabric, setFabric] = useState('');
  const [sizeOrLength, setSizeOrLength] = useState('');

  // Stock In details
  const [quantity, setQuantity] = useState<number>(20);
  const [costPrice, setCostPrice] = useState<number>(450);
  const [sellingPrice, setSellingPrice] = useState<number>(750);
  const [supplier, setSupplier] = useState(POPULAR_SUPPLIERS[0]);
  const [rackLocation, setRackLocation] = useState(COMMON_RACK_LOCATIONS[0]);
  const [notes, setNotes] = useState('');
  const [handledBy, setHandledBy] = useState('Store Staff');

  // Find currently selected product if in existing mode
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setCostPrice(prod.costPrice);
      setSellingPrice(prod.sellingPrice);
      setSupplier(prod.supplier);
      setRackLocation(prod.rackLocation);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity <= 0) {
      alert('Please enter a valid positive quantity.');
      return;
    }

    if (mode === 'new' && !name.trim()) {
      alert('Please enter the product name.');
      return;
    }

    if (mode === 'existing' && selectedProduct) {
      recordStockIn({
        isNewProduct: false,
        productId: selectedProduct.id,
        quantity,
        costPrice,
        sellingPrice,
        supplier,
        rackLocation,
        notes,
        handledBy,
      });
    } else {
      recordStockIn({
        isNewProduct: true,
        name,
        category,
        color,
        fabric,
        sizeOrLength,
        quantity,
        costPrice,
        sellingPrice,
        supplier,
        rackLocation,
        notes,
        handledBy,
      });

      setName('');
      setColor('');
      setFabric('');
      setSizeOrLength('');
    }

    setNotes('');
  };

  const stockInHistory = movements.filter((m) => m.type === 'STOCK_IN').slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f5eee3] p-6 rounded-3xl border border-[#e4d8c5]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c45418] uppercase tracking-wider">
            <PackagePlus className="w-4 h-4 text-[#d96528]" />
            Inward Stock Entry
          </div>
          <h2 className="text-2xl font-black text-[#1c1917]">
            Stock In — Record Incoming Goods
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e]">
            Log deliveries from master weavers or wholesale mills in seconds. Keeps inventory levels accurate in real time.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-white p-1 rounded-2xl border border-[#e8dfd1] shadow-2xs self-start sm:self-center">
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              mode === 'existing'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] hover:text-[#1c1917]'
            }`}
          >
            Restock Existing Item
          </button>
          <button
            type="button"
            onClick={() => setMode('new')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              mode === 'new'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] hover:text-[#1c1917]'
            }`}
          >
            + Add New Product Line
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e8dfd1] p-6 sm:p-7 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'existing' ? (
              <div className="space-y-4">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c]">
                  Select Product to Restock
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleSelectProduct(e.target.value)}
                  className="w-full px-4 py-3 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm font-semibold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — In Stock: {p.currentStock} pcs ({p.rackLocation})
                    </option>
                  ))}
                </select>

                {selectedProduct && (
                  <div className="bg-[#f5eee3] p-4 rounded-2xl border border-[#e4d8c5] text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[#78716c]">Category:</span>{' '}
                      <strong className="text-[#1c1917]">{selectedProduct.category}</strong>
                      <span className="mx-2">•</span>
                      <span className="text-[#78716c]">SKU:</span>{' '}
                      <code className="text-[#d96528] font-mono font-bold">{selectedProduct.sku}</code>
                    </div>
                    <div className="text-right">
                      <span className="text-[#78716c]">Available Now:</span>{' '}
                      <strong className="text-base text-[#1c1917] font-black">
                        {selectedProduct.currentStock} pcs
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c] mb-1.5">
                    Product / Fabric Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sungudi Cotton Saree – Peacock Green"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c] mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full px-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c] mb-1.5">
                      Color / Pattern
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Blue / Gold Border"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c] mb-1.5">
                      Fabric / Material
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pure Mulberry Silk"
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c] mb-1.5">
                      Length / Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6.2 meters / Size 40"
                      value={sizeOrLength}
                      onChange={(e) => setSizeOrLength(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quantity, Cost, Location */}
            <div className="pt-4 border-t border-[#f0e6d8] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#d96528] mb-1.5">
                    Quantity Received *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-[#faeedf] border-2 border-[#eed6c0] rounded-2xl text-[#1c1917] text-lg font-black focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c] mb-1.5">
                    Buying Price (Cost/pc) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#8c827a] text-sm font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      required
                      value={costPrice}
                      onChange={(e) => setCostPrice(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm font-bold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c] mb-1.5">
                    Selling Price (MRP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#8c827a] text-sm font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm font-bold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c] mb-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#8c827a]" />
                    Supplier / Source Weaver *
                  </label>
                  <input
                    type="text"
                    list="suppliers-list-warm"
                    required
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="e.g. Coimbatore Cotton Mills"
                    className="w-full px-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                  />
                  <datalist id="suppliers-list-warm">
                    {POPULAR_SUPPLIERS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8c827a]" />
                    Rack / Shelf Location *
                  </label>
                  <input
                    type="text"
                    list="racks-list-warm"
                    required
                    value={rackLocation}
                    onChange={(e) => setRackLocation(e.target.value)}
                    placeholder="e.g. Rack A-2 (Cotton Sarees)"
                    className="w-full px-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                  />
                  <datalist id="racks-list-warm">
                    {COMMON_RACK_LOCATIONS.map((r) => (
                      <option key={r} value={r} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#44403c] mb-1.5">
                  Batch Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delivery Challan #8843 from Diwali weaver stock"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-xs focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#d96528] hover:bg-[#c45418] text-white font-extrabold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Confirm Stock In (+{quantity} Pieces)</span>
            </button>
          </form>
        </div>

        {/* Right Preview & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Impact Preview */}
          <div className="bg-[#f5eee3] text-[#1c1917] rounded-3xl p-6 border border-[#e4d8c5] shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#d96528] flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Stock Calculation Preview
            </h3>

            {mode === 'existing' && selectedProduct ? (
              <div className="space-y-4">
                <div className="text-sm font-extrabold text-[#1c1917]">{selectedProduct.name}</div>
                <div className="grid grid-cols-3 gap-2 bg-white p-3.5 rounded-2xl border border-[#e8dfd1] text-center shadow-2xs">
                  <div>
                    <span className="text-[10px] text-[#78716c] block font-semibold">Current</span>
                    <span className="text-base font-bold text-[#44403c]">{selectedProduct.currentStock}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#d96528] block font-semibold">+ Inward</span>
                    <span className="text-base font-bold text-[#d96528]">+{quantity || 0}</span>
                  </div>
                  <div className="bg-[#faeedf] rounded-xl p-1">
                    <span className="text-[10px] text-[#c45418] block font-bold">= New Stock</span>
                    <span className="text-base font-black text-[#c45418]">
                      {selectedProduct.currentStock + (Number(quantity) || 0)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#57534e] space-y-1.5 pt-2 border-t border-[#e4d8c5]">
                  <div className="flex justify-between">
                    <span>Total Purchase Value:</span>
                    <strong className="text-[#1c1917] font-bold">
                      {formatCurrency((Number(quantity) || 0) * costPrice)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Storage:</span>
                    <strong className="text-[#d96528] font-bold">{rackLocation}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm font-bold text-[#1c1917]">
                  {name || 'New Textile Item'} <span className="text-xs text-[#78716c]">({category})</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-[#e8dfd1] text-center">
                  <span className="text-xs text-[#d96528] block font-bold">New Catalog Line</span>
                  <span className="text-xl font-black text-[#2d6a3f]">+{quantity || 0} pieces</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Deliveries Log */}
          <div className="bg-white rounded-3xl border border-[#e8dfd1] p-5 shadow-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#44403c] flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-[#78716c]" />
              Recent Deliveries Logged
            </h3>

            <div className="space-y-3">
              {stockInHistory.length === 0 ? (
                <p className="text-xs text-[#78716c] py-4 text-center">No recent stock-in entries.</p>
              ) : (
                stockInHistory.map((mov) => (
                  <div
                    key={mov.id}
                    className="p-3 rounded-2xl bg-[#fbf8f2] border border-[#f0e6d8] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#1c1917]">{mov.productName}</div>
                      <div className="text-[11px] text-[#78716c]">{mov.referenceNotes || 'Direct Supplier Entry'}</div>
                      <div className="text-[10px] text-[#8c827a] mt-0.5">{formatDateTime(mov.date)}</div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#faeedf] text-[#c45418] font-black text-xs border border-[#eed6c0]">
                        +{mov.quantity} pcs
                      </span>
                      <div className="text-[11px] font-bold text-[#57534e] mt-1">
                        {formatCurrency(mov.totalAmount)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
