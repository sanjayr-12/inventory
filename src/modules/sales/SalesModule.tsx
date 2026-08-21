'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { Category, Product, SaleTransaction } from '@/src/types';
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
  ArrowRight,
} from 'lucide-react';
import { formatCurrency, formatNumber, getStockStatus } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  product: Product;
  quantity: number;
}

export const SalesModule: React.FC = () => {
  const { products, recordSale, transactions } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH' | 'CARD'>('UPI');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [completedTxn, setCompletedTxn] = useState<SaleTransaction | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

    const result = recordSale(payload, paymentMethod, customerName, customerPhone);

    if (result.success && result.transaction) {
      setCompletedTxn(result.transaction);
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f5eee3] p-6 rounded-3xl border border-[#e4d8c5]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2d6a3f] uppercase tracking-wider">
            <ShoppingCart className="w-4 h-4 text-[#2d6a3f]" />
            Counter POS Billing
          </div>
          <h2 className="text-2xl font-black text-[#1c1917]">
            Quick Counter Sale & Billing Terminal
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e]">
            Select items sold at the counter. The system instantly reduces stock and eliminates manual end-of-day math.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Product Selection */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Pills */}
          <div className="space-y-3 bg-white p-4 sm:p-5 rounded-3xl border border-[#e8dfd1] shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8c827a] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name, color, rack location or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-2xl text-sm text-[#1c1917] focus:outline-hidden focus:ring-2 focus:ring-[#d96528]"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredProducts.map((product) => {
              const statusInfo = getStockStatus(product);
              const inCart = cart.find((i) => i.product.id === product.id);
              const isOutOfStock = product.currentStock <= 0;

              return (
                <div
                  key={product.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isOutOfStock
                      ? 'bg-[#fbf8f2] border-[#e8dfd1] opacity-60'
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
                        {statusInfo.label} ({product.currentStock})
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-[#1c1917] mt-1.5 leading-snug">
                      {product.name}
                    </h4>

                    <div className="text-xs text-[#78716c] mt-1 flex items-center gap-2">
                      <span>📍 {product.rackLocation}</span>
                      {product.color && <span>• {product.color}</span>}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f0e6d8] flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-[#1c1917]">
                        {formatCurrency(product.sellingPrice)}
                      </div>
                      <div className="text-[10px] text-[#8c827a]">Cost: {formatCurrency(product.costPrice)}</div>
                    </div>

                    {isOutOfStock ? (
                      <span className="text-xs font-bold text-[#b9381e] px-2.5 py-1 bg-[#fdf0ed] rounded-xl border border-[#f8d0c8]">
                        Sold Out
                      </span>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          inCart
                            ? 'bg-[#d96528] text-white shadow-xs'
                            : 'bg-[#faeedf] text-[#c45418] hover:bg-[#d96528] hover:text-white border border-[#eed6c0]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {inCart ? `Added (${inCart.quantity})` : 'Add to Bill'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Counter Bill Drawer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#f5eee3] rounded-3xl border border-[#e4d8c5] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#e4d8c5] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#d96528]" />
                <h3 className="font-black text-base text-[#1c1917]">Current Counter Bill</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-[#faeedf] text-[#c45418] border border-[#eed6c0] rounded-full">
                {totalItemsCount} Piece(s)
              </span>
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="py-10 text-center text-[#78716c] space-y-2 bg-white rounded-2xl border border-[#e8dfd1] p-4">
                <ShoppingCart className="w-8 h-8 mx-auto text-[#8c827a]" />
                <p className="text-xs font-bold text-[#44403c]">Cart is empty</p>
                <p className="text-[11px] text-[#78716c]">Tap "Add to Bill" on any textile item to start</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 bg-white rounded-2xl border border-[#e8dfd1] flex items-center justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="flex-1 min-w-0">
                      <h5 className="font-extrabold text-[#1c1917] truncate">{product.name}</h5>
                      <div className="text-[11px] text-[#78716c] mt-0.5">
                        {formatCurrency(product.sellingPrice)} × {quantity}
                      </div>
                      <div className="text-[10px] text-[#2d6a3f] font-semibold">
                        After sale: {product.currentStock - quantity} pcs left
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-7 h-7 rounded-lg bg-[#f5eee3] border border-[#e4d8c5] flex items-center justify-center font-bold text-[#1c1917] hover:bg-[#ede3d3]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-[#1c1917]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        disabled={quantity >= product.currentStock}
                        className="w-7 h-7 rounded-lg bg-[#f5eee3] border border-[#e4d8c5] flex items-center justify-center font-bold text-[#1c1917] hover:bg-[#ede3d3] disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
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

            {/* Customer & Payment */}
            {cart.length > 0 && (
              <div className="space-y-4 pt-3 border-t border-[#e4d8c5]">
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#e8dfd1] rounded-xl text-xs text-[#1c1917] focus:outline-hidden focus:ring-2 focus:ring-[#d96528]"
                  />
                  <input
                    type="text"
                    placeholder="Phone (Optional)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#e8dfd1] rounded-xl text-xs text-[#1c1917] focus:outline-hidden focus:ring-2 focus:ring-[#d96528]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#78716c] mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI', 'CASH', 'CARD'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          paymentMethod === method
                            ? 'bg-[#d96528] text-white border-[#d96528] shadow-xs'
                            : 'bg-white border-[#e8dfd1] text-[#57534e]'
                        }`}
                      >
                        {method === 'UPI' && <QrCode className="w-3.5 h-3.5" />}
                        {method === 'CASH' && <Banknote className="w-3.5 h-3.5" />}
                        {method === 'CARD' && <CreditCard className="w-3.5 h-3.5" />}
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total & Checkout */}
                <div className="bg-white p-4 rounded-2xl border border-[#e8dfd1] space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#78716c] font-semibold">Total Amount:</span>
                    <span className="text-2xl font-black text-[#1c1917]">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#d96528] hover:bg-[#c45418] text-white font-extrabold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Sale & Deduct Stock ({totalItemsCount} pcs)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Receipt Modal Card */}
          <AnimatePresence>
            {completedTxn && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-5 rounded-3xl border-2 border-[#eed6c0] shadow-md space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-2">
                  <div className="flex items-center gap-2 text-[#c45418] text-xs font-black uppercase">
                    <Sparkles className="w-4 h-4 text-[#d96528]" /> Bill Completed
                  </div>
                  <span className="text-xs font-mono bg-[#faeedf] px-2 py-0.5 rounded-md text-[#c45418] font-bold border border-[#eed6c0]">
                    #{completedTxn.invoiceNumber}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-[#78716c]">
                    Customer: <strong className="text-[#1c1917]">{completedTxn.customerName}</strong>
                  </p>
                  <p className="text-[#78716c]">
                    Payment: <strong className="text-[#2d6a3f]">{completedTxn.paymentMethod}</strong> • Total:{' '}
                    <strong className="text-[#1c1917]">{formatCurrency(completedTxn.totalAmount)}</strong>
                  </p>
                </div>

                <div className="bg-[#f5eee3] p-3 rounded-xl text-xs space-y-1.5 border border-[#e4d8c5]">
                  <div className="font-bold text-[#1c1917]">Stock Reduced Automatically:</div>
                  {completedTxn.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-[#57534e]">
                      <span>{item.product.name} (Qty: {item.quantity})</span>
                      <span className="text-[#2d6a3f] font-bold">{item.product.currentStock} left</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCompletedTxn(null)}
                  className="w-full py-2 bg-[#f5eee3] hover:bg-[#ede3d3] rounded-xl text-xs font-bold text-[#57534e] cursor-pointer"
                >
                  Dismiss Receipt
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
