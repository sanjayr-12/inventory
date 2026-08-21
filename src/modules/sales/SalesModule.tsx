'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { Product, SaleTransaction } from '@/src/types';
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  CreditCard,
  Banknote,
  QrCode,
  Receipt,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { formatCurrency, getStockStatus } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  product: Product;
  quantity: number;
}

export const SalesModule: React.FC = () => {
  const { products, recordSale } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH' | 'CARD'>('UPI');
  const [customerName, setCustomerName] = useState('');
  const [completedTxn, setCompletedTxn] = useState<SaleTransaction | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rackLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.color && p.color.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const addToCart = (product: Product) => {
    if (product.currentStock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.currentStock) {
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            if (nextQty > item.product.currentStock) return item;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const payload = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const result = recordSale(payload, paymentMethod, customerName);

    if (result.success && result.transaction) {
      setCompletedTxn(result.transaction);
      setCart([]);
      setCustomerName('');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. TOP HEADER */}
      <div className="bg-[#f5eee3] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917]">
            🛒 Counter Sale & Billing
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] mt-0.5">
            Tap items to add to bill. Stock automatically reduces immediately upon sale.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-[#b9381e] hover:underline font-bold flex items-center gap-1 self-start sm:self-center cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart ({totalItemsCount} pcs)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left 7 Columns: Product Selection */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Pills */}
          <div className="space-y-3 bg-white p-4 sm:p-5 rounded-3xl border border-[#e8dfd1] shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8c827a] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search saree, shirt, color, or rack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-sm sm:text-base text-[#1c1917] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#d96528]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCat === cat
                      ? 'bg-[#d96528] text-white shadow-xs'
                      : 'bg-[#f5eee3] text-[#57534e] hover:bg-[#ede3d3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredProducts.map((product) => {
              const statusInfo = getStockStatus(product);
              const inCart = cart.find((i) => i.product.id === product.id);
              const isOutOfStock = product.currentStock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && addToCart(product)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                    isOutOfStock
                      ? 'bg-[#fbf8f2] border-[#e8dfd1] opacity-60 cursor-not-allowed'
                      : inCart
                      ? 'bg-[#faeedf]/40 border-2 border-[#d96528] shadow-xs'
                      : 'bg-white border-[#e8dfd1] hover:border-[#d96528] shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#8c827a] uppercase tracking-wider">
                        {product.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label} ({product.currentStock} in shop)
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-[#1c1917] mt-1.5 leading-snug">
                      {product.name}
                    </h4>

                    <div className="text-xs text-[#78716c] mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#d96528]" />
                      <span>{product.rackLocation}</span>
                      {product.color && <span>• {product.color}</span>}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#f0e6d8] flex items-center justify-between">
                    <div className="text-base font-black text-[#1c1917]">
                      {formatCurrency(product.sellingPrice)}
                    </div>

                    {isOutOfStock ? (
                      <span className="text-xs font-bold text-[#b9381e] px-2.5 py-1 bg-[#fdf0ed] rounded-xl border border-[#f8d0c8]">
                        Sold Out
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                          inCart
                            ? 'bg-[#d96528] text-white shadow-xs'
                            : 'bg-[#faeedf] text-[#c45418] border border-[#eed6c0]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {inCart ? `In Bill (${inCart.quantity})` : 'Add to Bill'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Counter Bill Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#f5eee3] rounded-3xl border border-[#e4d8c5] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e4d8c5] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#d96528]" />
                <h3 className="font-black text-base text-[#1c1917]">Current Customer Bill</h3>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-[#faeedf] text-[#c45418] border border-[#eed6c0] rounded-full">
                {totalItemsCount} Piece(s)
              </span>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-8 text-center text-[#78716c] space-y-1.5 bg-white rounded-2xl border border-[#e8dfd1] p-4">
                <ShoppingCart className="w-7 h-7 mx-auto text-[#8c827a]" />
                <p className="text-xs font-bold text-[#44403c]">No items in current bill</p>
                <p className="text-[11px] text-[#78716c]">Tap any item on the left to add to bill</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 bg-white rounded-2xl border border-[#e8dfd1] flex items-center justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="flex-1 min-w-0">
                      <h5 className="font-extrabold text-[#1c1917] truncate">{product.name}</h5>
                      <div className="text-[11px] text-[#78716c]">
                        {formatCurrency(product.sellingPrice)} × {quantity}
                      </div>
                      <div className="text-[10px] text-[#2d6a3f] font-bold">
                        Stock left: {product.currentStock - quantity} pcs
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-7 h-7 rounded-lg bg-[#f5eee3] border border-[#e4d8c5] flex items-center justify-center font-bold text-[#1c1917] hover:bg-[#ede3d3]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-black text-sm text-[#1c1917]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        disabled={quantity >= product.currentStock}
                        className="w-7 h-7 rounded-lg bg-[#f5eee3] border border-[#e4d8c5] flex items-center justify-center font-bold text-[#1c1917] hover:bg-[#ede3d3] disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="w-7 h-7 rounded-lg text-[#b9381e] hover:bg-[#fdf0ed] flex items-center justify-center ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment & Checkout Section */}
            {cart.length > 0 && (
              <div className="space-y-3.5 pt-3 border-t border-[#e4d8c5]">
                <input
                  type="text"
                  placeholder="Customer Name (Optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#e8dfd1] rounded-xl text-xs sm:text-sm text-[#1c1917] focus:outline-hidden focus:ring-2 focus:ring-[#d96528]"
                />

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#78716c] mb-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI', 'CASH', 'CARD'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          paymentMethod === method
                            ? 'bg-[#d96528] text-white border-[#d96528] shadow-xs'
                            : 'bg-white border-[#e8dfd1] text-[#57534e]'
                        }`}
                      >
                        {method === 'UPI' && <QrCode className="w-3.5 h-3.5" />}
                        {method === 'CASH' && <Banknote className="w-3.5 h-3.5" />}
                        {method === 'CARD' && <CreditCard className="w-3.5 h-3.5" />}
                        {method === 'UPI' ? 'UPI / GPay' : method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#e8dfd1] space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#78716c] font-bold">Total Bill:</span>
                    <span className="text-2xl font-black text-[#1c1917]">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#2d6a3f] hover:bg-[#235331] text-white font-black text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Sale ({totalItemsCount} pcs)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Receipt Confirmation Drawer */}
          <AnimatePresence>
            {completedTxn && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-5 rounded-3xl border-2 border-[#eed6c0] shadow-md space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-2">
                  <div className="flex items-center gap-1.5 text-[#2d6a3f] text-xs font-black uppercase">
                    <CheckCircle2 className="w-4 h-4 text-[#2d6a3f]" /> Sale Recorded Successfully
                  </div>
                  <span className="text-xs font-mono bg-[#faeedf] px-2 py-0.5 rounded-md text-[#c45418] font-bold border border-[#eed6c0]">
                    #{completedTxn.invoiceNumber}
                  </span>
                </div>

                <div className="bg-[#f5eee3] p-3 rounded-xl text-xs space-y-1 border border-[#e4d8c5]">
                  <div className="font-bold text-[#1c1917]">Updated Stock Remaining:</div>
                  {completedTxn.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-[#57534e]">
                      <span>{item.product.name} (Sold: {item.quantity})</span>
                      <strong className="text-[#2d6a3f]">{item.product.currentStock} left on shelf</strong>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCompletedTxn(null)}
                  className="w-full py-2 bg-[#f5eee3] hover:bg-[#ede3d3] rounded-xl text-xs font-bold text-[#57534e] cursor-pointer"
                >
                  Close Receipt
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
