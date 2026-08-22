'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { Category, Product } from '@/src/types';
import { CustomSelect, SelectOption } from '@/src/components/ui/CustomSelect';
import {
  PackagePlus,
  Truck,
  MapPin,
  Sparkles,
  History,
  CheckCircle,
  Plus,
  Minus,
  Layers,
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
  { name: 'Coimbatore Cotton Mills', city: 'Coimbatore', specialty: '100% Combed Cotton' },
  { name: 'Kanchipuram Master Weavers', city: 'Kanchipuram', specialty: 'Pure Silk & Zari' },
  { name: 'Salem Handlooms Syndicate', city: 'Salem', specialty: 'Gold Zari Pattu Dhotis' },
  { name: 'Tirupur Garments Hub', city: 'Tirupur', specialty: "Men's Formal Shirts & Linen" },
  { name: 'Erode Textile Processors', city: 'Erode', specialty: 'School Uniform Poly-Cotton' },
  { name: 'Surat Silk Mills', city: 'Surat', specialty: "Women's Chudidar & Suits" },
  { name: 'Madurai Weavers Syndicate', city: 'Madurai', specialty: 'Sungudi Cotton Sarees' },
  { name: 'Varanasi Silk Craft', city: 'Varanasi', specialty: 'Jacquard Art Silk' },
];

const COMMON_RACK_LOCATIONS = [
  { rack: 'Rack A-2 (Cotton Sarees)', section: 'Main Ground Floor' },
  { rack: 'Rack A-4 (Daily Cotton)', section: 'Left Saree Counter' },
  { rack: 'Rack S-1 (Wedding Silk VIP Section)', section: 'First Floor AC Lounge' },
  { rack: 'Rack S-2 (Soft Silks)', section: 'First Floor Section B' },
  { rack: 'Rack S-4 (Banarasi & Heavy Silks)', section: 'First Floor Display' },
  { rack: 'Rack M-3 (Men Formal Shirts)', section: 'Right Men Section' },
  { rack: 'Rack M-1 (Men Ethnic & Kurtas)', section: 'Men Traditional Counter' },
  { rack: 'Rack D-1 (Dhoti Section)', section: 'Front Entrance Display' },
  { rack: 'Rack W-1 (Dress Materials & Chudidar)', section: 'Women Casual Section' },
  { rack: 'Rack U-2 (School Uniforms)', section: 'Back School Corner' },
  { rack: 'Rack K-2 (Kids Festival Wear)', section: 'Kids Wear Section' },
];

export const StockInModule: React.FC = () => {
  const { products, movements, recordStockIn, t } = useInventory();

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
  const [supplier, setSupplier] = useState(POPULAR_SUPPLIERS[0].name);
  const [rackLocation, setRackLocation] = useState(COMMON_RACK_LOCATIONS[0].rack);
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

  // Convert products to CustomSelect options (10+ items)
  const productOptions: SelectOption[] = products.map((p) => ({
    value: p.id,
    label: p.name,
    sublabel: `${p.rackLocation} • Weaver: ${p.supplier}`,
    badge: `${p.currentStock} in shop`,
  }));

  // Supplier Options for CustomSelect
  const supplierOptions: SelectOption[] = POPULAR_SUPPLIERS.map((s) => ({
    value: s.name,
    label: s.name,
    sublabel: `${s.city} • ${s.specialty}`,
  }));

  // Rack Options for CustomSelect
  const rackOptions: SelectOption[] = COMMON_RACK_LOCATIONS.map((r) => ({
    value: r.rack,
    label: r.rack,
    sublabel: r.section,
  }));

  // Category Options for CustomSelect
  const categoryOptions: SelectOption[] = CATEGORIES.map((c) => ({
    value: c,
    label: c,
  }));

  const stockInHistory = movements.filter((m) => m.type === 'STOCK_IN').slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* 1. CLEAN HEADER */}
      <div className="bg-[#f5eee3] dark:bg-[#241f1a] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] dark:border-[#38322b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917] dark:text-[#f5eee3]">
            {t.inwardStockEntry}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#a89f91] mt-0.5">
            {t.inwardStockSub}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-white dark:bg-[#28231e] p-1 rounded-2xl border border-[#e8dfd1] dark:border-[#3d3731] shadow-2xs self-start sm:self-center">
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              mode === 'existing'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] dark:text-[#a89f91] hover:text-[#1c1917] dark:hover:text-[#f5eee3]'
            }`}
          >
            {t.restockExisting}
          </button>
          <button
            type="button"
            onClick={() => setMode('new')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              mode === 'new'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] dark:text-[#a89f91] hover:text-[#1c1917] dark:hover:text-[#f5eee3]'
            }`}
          >
            {t.addNewVariety}
          </button>
        </div>
      </div>

      {/* 2. SIMPLE FORM CARD */}
      <div className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-6 sm:p-8 shadow-xs transition-colors">
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'existing' ? (
            /* Custom Theme Dropdown for existing items */
            <div>
              <CustomSelect
                label={t.whichItemArrived}
                options={productOptions}
                value={selectedProductId}
                onChange={handleSelectProduct}
                placeholder="Choose saree, shirt, or cloth..."
              />
            </div>
          ) : (
            /* Add brand new item */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#44403c] dark:text-[#d6cec2] mb-1.5">
                  1. Product / Saree Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madurai Sungudi Cotton Saree (Mustard)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#fbf8f2] dark:bg-[#28231e] border border-[#e0d3c1] dark:border-[#3d3731] rounded-2xl text-sm sm:text-base text-[#1c1917] dark:text-[#f5eee3] font-semibold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <CustomSelect
                  label="Category *"
                  options={categoryOptions}
                  value={category}
                  onChange={(v) => setCategory(v as Category)}
                />

                <div>
                  <label className="block text-xs font-black uppercase text-[#44403c] dark:text-[#d6cec2] mb-1.5">
                    Color / Border
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Blue"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3.5 py-3 bg-[#fbf8f2] dark:bg-[#28231e] border border-[#e0d3c1] dark:border-[#3d3731] rounded-2xl text-xs sm:text-sm text-[#1c1917] dark:text-[#f5eee3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-[#44403c] dark:text-[#d6cec2] mb-1.5">
                    Material / Length
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Cotton (6.2m)"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full px-3.5 py-3 bg-[#fbf8f2] dark:bg-[#28231e] border border-[#e0d3c1] dark:border-[#3d3731] rounded-2xl text-xs sm:text-sm text-[#1c1917] dark:text-[#f5eee3]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. QUANTITY STEPPER */}
          <div className="bg-[#f5eee3] dark:bg-[#28231e] p-5 rounded-2xl border border-[#e4d8c5] dark:border-[#3d3731] space-y-2">
            <label className="block text-xs font-black uppercase text-[#d96528] dark:text-[#ea7637]">
              {t.howManyReceived}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 5))}
                className="w-12 h-12 rounded-xl bg-white dark:bg-[#201c18] border border-[#e8dfd1] dark:border-[#38322b] text-lg font-black text-[#1c1917] dark:text-[#f5eee3] hover:bg-[#ede3d3] dark:hover:bg-[#2c2620] flex items-center justify-center cursor-pointer shadow-2xs"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-12 h-12 rounded-xl bg-white dark:bg-[#201c18] border border-[#e8dfd1] dark:border-[#38322b] text-lg font-black text-[#1c1917] dark:text-[#f5eee3] hover:bg-[#ede3d3] dark:hover:bg-[#2c2620] flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <Minus className="w-5 h-5" />
              </button>

              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="flex-1 text-center py-3 bg-white dark:bg-[#201c18] border-2 border-[#d96528] rounded-2xl text-2xl font-black text-[#1c1917] dark:text-[#f5eee3] focus:outline-hidden"
              />

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-12 h-12 rounded-xl bg-white dark:bg-[#201c18] border border-[#e8dfd1] dark:border-[#38322b] text-lg font-black text-[#1c1917] dark:text-[#f5eee3] hover:bg-[#ede3d3] dark:hover:bg-[#2c2620] flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 5)}
                className="w-12 h-12 rounded-xl bg-white dark:bg-[#201c18] border border-[#e8dfd1] dark:border-[#38322b] text-lg font-black text-[#1c1917] dark:text-[#f5eee3] hover:bg-[#ede3d3] dark:hover:bg-[#2c2620] flex items-center justify-center cursor-pointer shadow-2xs"
              >
                +5
              </button>
            </div>

            {mode === 'existing' && selectedProduct && (
              <div className="text-xs text-[#57534e] dark:text-[#a89f91] pt-1 text-center font-medium">
                Current in shop: <strong>{selectedProduct.currentStock} {t.pieces}</strong> ➔ After saving:{' '}
                <strong className="text-[#2d6a3f] dark:text-[#4ade80] font-bold">
                  {selectedProduct.currentStock + (Number(quantity) || 0)} {t.pieces}
                </strong>
              </div>
            )}
          </div>

          {/* 3. PRICE DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#44403c] dark:text-[#d6cec2] mb-1.5">
                {t.buyingCost}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[#8c827a] text-sm font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-[#fbf8f2] dark:bg-[#28231e] border border-[#e0d3c1] dark:border-[#3d3731] rounded-2xl text-[#1c1917] dark:text-[#f5eee3] text-base font-bold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#44403c] dark:text-[#d6cec2] mb-1.5">
                {t.sellingMRP}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-[#8c827a] text-sm font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-[#fbf8f2] dark:bg-[#28231e] border border-[#e0d3c1] dark:border-[#3d3731] rounded-2xl text-[#1c1917] dark:text-[#f5eee3] text-base font-bold focus:ring-2 focus:ring-[#d96528] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 4. THEMED CUSTOM DROPDOWNS FOR SUPPLIER & RACK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect
              label={t.whichWeaverSent}
              options={supplierOptions}
              value={supplier}
              onChange={setSupplier}
            />

            <CustomSelect
              label={t.whereToKeep}
              options={rackOptions}
              value={rackLocation}
              onChange={setRackLocation}
            />
          </div>

          {/* Big Confirm Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#d96528] hover:bg-[#c45418] text-white font-black text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PackagePlus className="w-5 h-5" />
            <span>{t.saveToStock}: +{quantity} {t.pieces}</span>
          </button>
        </form>
      </div>

      {/* RECENT ENTRIES LOG */}
      {stockInHistory.length > 0 && (
        <div className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-5 shadow-xs space-y-3 transition-colors">
          <div className="text-xs font-black uppercase tracking-wider text-[#8c827a] dark:text-[#a89f91] flex items-center gap-1.5">
            <History className="w-4 h-4" /> {t.recentDeliveries}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {stockInHistory.map((mov) => (
              <div
                key={mov.id}
                className="p-3.5 bg-[#fbf8f2] dark:bg-[#28231e] rounded-2xl border border-[#f0e6d8] dark:border-[#38322b] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#1c1917] dark:text-[#f5eee3]">{mov.productName}</div>
                  <div className="text-[11px] text-[#78716c] dark:text-[#a89f91]">{formatDateTime(mov.date)}</div>
                </div>
                <div className="text-right">
                  <span className="font-black text-xs px-2.5 py-0.5 rounded-full bg-[#faeedf] dark:bg-[#3d2415] text-[#c45418] dark:text-[#ea7637] border border-[#eed6c0] dark:border-[#52301c]">
                    +{mov.quantity} {t.pieces}
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
