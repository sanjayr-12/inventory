'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { Category, Product } from '@/src/types';
import {
  PackagePlus,
  Truck,
  MapPin,
  Sparkles,
  History,
  CheckCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/src/lib/utils';

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
      });

      setName('');
      setColor('');
      setFabric('');
      setSizeOrLength('');
    }

    setNotes('');
  };

  const stockInHistory = movements.filter((m) => m.type === 'STOCK_IN').slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* 1. CLEAN HEADER */}
      <div className="bg-[#f5eee3] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917]">
            ➕ Add New Stock (Inward Entry)
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] mt-0.5">
            Log clothes arriving from weavers so your counts are 100% up to date.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-white p-1 rounded-2xl border border-[#e8dfd1] shadow-2xs self-start sm:self-center">
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
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
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              mode === 'new'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] hover:text-[#1c1917]'
            }`}
          >
            + Add New Variety
          </button>
        </div>
      </div>

      {/* 2. SIMPLE FORM CARD */}
      <div className="bg-white rounded-3xl border border-[#e8dfd1] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'existing' ? (
            /* Choose existing item */
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-[#44403c]">
                1. Which item arrived from weaver?
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleSelectProduct(e.target.value)}
                className="w-full px-4 py-3 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-[#1c1917] text-sm sm:text-base font-bold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Currently has {p.currentStock} pcs ({p.rackLocation})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            /* Add brand new item */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#44403c] mb-1">
                  1. Product / Saree Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madurai Sungudi Cotton Saree (Mustard)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-sm sm:text-base text-[#1c1917] font-semibold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#44403c] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-xl text-sm font-semibold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-[#44403c] mb-1">
                    Color / Border
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Blue"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-[#44403c] mb-1">
                    Material / Length
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Cotton (6.2m)"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. QUANTITY STEPPER (Super easy to tap) */}
          <div className="bg-[#f5eee3] p-5 rounded-2xl border border-[#e4d8c5] space-y-2">
            <label className="block text-xs font-black uppercase text-[#d96528]">
              2. How many pieces received?
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 5))}
                className="w-12 h-12 rounded-xl bg-white border border-[#e8dfd1] text-lg font-black text-[#1c1917] hover:bg-[#ede3d3] flex items-center justify-center cursor-pointer shadow-2xs"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-12 h-12 rounded-xl bg-white border border-[#e8dfd1] text-lg font-black text-[#1c1917] hover:bg-[#ede3d3] flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <Minus className="w-5 h-5" />
              </button>

              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="flex-1 text-center py-3 bg-white border-2 border-[#d96528] rounded-2xl text-2xl font-black text-[#1c1917] focus:outline-hidden"
              />

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-12 h-12 rounded-xl bg-white border border-[#e8dfd1] text-lg font-black text-[#1c1917] hover:bg-[#ede3d3] flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 5)}
                className="w-12 h-12 rounded-xl bg-white border border-[#e8dfd1] text-lg font-black text-[#1c1917] hover:bg-[#ede3d3] flex items-center justify-center cursor-pointer shadow-2xs"
              >
                +5
              </button>
            </div>

            {mode === 'existing' && selectedProduct && (
              <div className="text-xs text-[#57534e] pt-1 text-center font-medium">
                Current stock: <strong>{selectedProduct.currentStock} pcs</strong> ➔ After saving:{' '}
                <strong className="text-[#2d6a3f] font-bold">
                  {selectedProduct.currentStock + (Number(quantity) || 0)} pieces
                </strong>
              </div>
            )}
          </div>

          {/* 3. PRICE DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#44403c] mb-1">
                3. Buying Price per piece (Cost) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-[#8c827a] text-sm font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-xl text-[#1c1917] text-base font-bold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#44403c] mb-1">
                Selling Price (Retail MRP)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-[#8c827a] text-sm font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-xl text-[#1c1917] text-base font-bold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 4. SUPPLIER & RACK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#44403c] mb-1 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#8c827a]" />
                4. Which Weaver / Mill sent this? *
              </label>
              <input
                type="text"
                list="suppliers-list-simple"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. Coimbatore Cotton Mills"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-xl text-[#1c1917] text-sm font-semibold"
              />
              <datalist id="suppliers-list-simple">
                {POPULAR_SUPPLIERS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#44403c] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8c827a]" />
                Where will you keep it? (Rack/Shelf) *
              </label>
              <input
                type="text"
                list="racks-list-simple"
                required
                value={rackLocation}
                onChange={(e) => setRackLocation(e.target.value)}
                placeholder="e.g. Rack A-2 (Cotton Sarees)"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-xl text-[#1c1917] text-sm font-semibold"
              />
              <datalist id="racks-list-simple">
                {COMMON_RACK_LOCATIONS.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Big Confirm Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#d96528] hover:bg-[#c45418] text-white font-black text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PackagePlus className="w-5 h-5" />
            <span>Save +{quantity} Pieces to Shop Stock</span>
          </button>
        </form>
      </div>

      {/* RECENT ENTRIES LOG (Clean summary) */}
      {stockInHistory.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#e8dfd1] p-5 shadow-xs space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-[#8c827a] flex items-center gap-1.5">
            <History className="w-4 h-4" /> Recent Deliveries Received
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {stockInHistory.map((mov) => (
              <div
                key={mov.id}
                className="p-3 bg-[#fbf8f2] rounded-2xl border border-[#f0e6d8] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#1c1917]">{mov.productName}</div>
                  <div className="text-[11px] text-[#78716c]">{formatDateTime(mov.date)}</div>
                </div>
                <div className="text-right">
                  <span className="font-black text-xs px-2 py-0.5 rounded-full bg-[#faeedf] text-[#c45418] border border-[#eed6c0]">
                    +{mov.quantity} pcs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
