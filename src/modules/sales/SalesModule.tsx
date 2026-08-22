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
  const { products, recordSale, t } = useInventory();

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
          alert(`Cannot add more than ${product.currentStock} pieces in stock.`);
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
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.currentStock) {
              alert(`Only ${item.product.currentStock} pieces available in stock.`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  const totalPieces = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const payload = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const result = recordSale(payload, paymentMethod, customerName.trim() || undefined);

    if (result.success && result.transaction) {
      setCompletedTxn(result.transaction);
      setCart([]);
      setCustomerName('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP BANNER */}
      <div className="bg-[#f5eee3] dark:bg-[#241f1a] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] dark:border-[#38322b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917] dark:text-[#f5eee3]">
            {t.counterSaleTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#a89f91] mt-0.5">
            {t.counterSaleSub}
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="px-3.5 py-2 text-xs font-bold text-[#b9381e] hover:bg-[#fdf0ed] dark:hover:bg-[#3d1a15] rounded-xl border border-[#f8d0c8] dark:border-[#52221b] transition-colors cursor-pointer self-start sm:self-center"
          >
            {t.clearCart}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Selection Grid */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Search & Category Pills */}
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
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCat === cat
                      ? 'bg-[#d96528] text-white shadow-xs'
                      : 'bg-white dark:bg-[#201c18] border border-[#e8dfd1] dark:border-[#38322b] text-[#57534e] dark:text-[#a89f91] hover:bg-[#f5eee3] dark:hover:bg-[#2c2620]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredProducts.map((p) => {
              const status = getStockStatus(p);
              const isOutOfStock = p.currentStock <= 0;
              const inCartItem = cart.find((item) => item.product.id === p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => !isOutOfStock && addToCart(p)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isOutOfStock
                      ? 'bg-[#faf8f5] dark:bg-[#1a1714] border-[#ebdcd0] dark:border-[#2f2923] opacity-60 cursor-not-allowed'
                      : inCartItem
                      ? 'bg-white dark:bg-[#201c18] border-2 border-[#2d6a3f] shadow-xs'
                      : 'bg-white dark:bg-[#201c18] border-[#e8dfd1] dark:border-[#38322b] hover:border-[#d96528] shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f5eee3] dark:bg-[#28231e] text-[#57534e] dark:text-[#d6cec2] truncate">
                        {p.category}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${status.badgeClass}`}>
                        {status.label}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-[#1c1917] dark:text-[#f5eee3] mt-2 line-clamp-2 leading-snug">
                      {p.name}
                    </h4>

                    <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#d96528]" />
                      <span>{p.rackLocation}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f0e6d8] dark:border-[#38322b] flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-[#1c1917] dark:text-[#f5eee3]">
                        {formatCurrency(p.sellingPrice)}
                      </div>
                      <div className="text-[10px] text-[#78716c] dark:text-[#a89f91]">
                        {p.currentStock} {t.pieces} in shop
                      </div>
                    </div>

                    {isOutOfStock ? (
                      <span className="text-xs font-bold text-[#b9381e]">{t.soldOut}</span>
                    ) : inCartItem ? (
                      <span className="text-xs font-black px-2.5 py-1 bg-[#2d6a3f] text-white rounded-xl shadow-xs">
                        +{inCartItem.quantity}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#d96528] dark:text-[#ea7637] flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> {t.addToBill}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer Bill Drawer */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
          <div className="bg-[#f5eee3] dark:bg-[#241f1a] rounded-3xl border border-[#e4d8c5] dark:border-[#38322b] p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-[#e4d8c5] dark:border-[#38322b] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#d96528] dark:text-[#ea7637]" />
                <h3 className="font-black text-base text-[#1c1917] dark:text-[#f5eee3]">{t.currentBill}</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#faeedf] dark:bg-[#3d2415] text-[#c45418] dark:text-[#ea7637] border border-[#eed6c0] dark:border-[#52301c]">
                {totalPieces} {t.pieces}
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-[#78716c] dark:text-[#a89f91] space-y-2 bg-white dark:bg-[#201c18] rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] p-4">
                <ShoppingCart className="w-8 h-8 mx-auto text-[#8c827a]" />
                <p className="text-xs font-bold text-[#44403c] dark:text-[#d6cec2]">{t.noItemsInBill}</p>
                <p className="text-[11px]">{t.tapItemsLeft}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 bg-white dark:bg-[#201c18] rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] text-xs space-y-2 shadow-2xs"
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1 pr-2">
                        <h5 className="font-bold text-[#1c1917] dark:text-[#f5eee3] truncate">{product.name}</h5>
                        <div className="text-[11px] text-[#78716c] dark:text-[#a89f91]">
                          {formatCurrency(product.sellingPrice)} × {quantity}
                        </div>
                      </div>
                      <span className="font-black text-sm text-[#1c1917] dark:text-[#f5eee3]">
                        {formatCurrency(product.sellingPrice * quantity)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#f0e6d8] dark:border-[#38322b]">
                      <div className="flex items-center gap-1.5 bg-[#fbf8f2] dark:bg-[#28231e] p-1 rounded-xl border border-[#e0d3c1] dark:border-[#3d3731]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white dark:bg-[#201c18] border border-[#e8dfd1] dark:border-[#38322b] flex items-center justify-center font-bold text-xs hover:bg-[#f5eee3] cursor-pointer"
                        >
                          <Minus className="w-3 h-3 text-[#1c1917] dark:text-[#f5eee3]" />
                        </button>
                        <span className="w-6 text-center font-black text-xs text-[#1c1917] dark:text-[#f5eee3]">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-6 h-6 rounded-lg bg-[#d96528] text-white flex items-center justify-center font-bold text-xs hover:bg-[#c45418] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-[#b9381e] hover:text-[#992d18] text-[11px] font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-[#e4d8c5] dark:border-[#38322b]">
                <div>
                  <label className="block text-[11px] font-black uppercase text-[#44403c] dark:text-[#d6cec2] mb-1">
                    Customer Name / Phone (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Walk-in"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#201c18] border border-[#e0d3c1] dark:border-[#38322b] rounded-xl text-xs text-[#1c1917] dark:text-[#f5eee3]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-[#44403c] dark:text-[#d6cec2] mb-1.5">
                    {t.paymentMethod}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'UPI', label: 'UPI / QR', icon: <QrCode className="w-3.5 h-3.5" /> },
                      { id: 'CASH', label: 'Cash', icon: <Banknote className="w-3.5 h-3.5" /> },
                      { id: 'CARD', label: 'Card', icon: <CreditCard className="w-3.5 h-3.5" /> },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                          paymentMethod === pm.id
                            ? 'bg-[#2d6a3f] text-white border-[#2d6a3f] shadow-xs'
                            : 'bg-white dark:bg-[#201c18] border-[#e8dfd1] dark:border-[#38322b] text-[#57534e] dark:text-[#a89f91]'
                        }`}
                      >
                        {pm.icon}
                        <span>{pm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#201c18] p-4 rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#78716c] dark:text-[#a89f91]">{t.totalBill}</span>
                  <span className="text-2xl font-black text-[#2d6a3f] dark:text-[#4ade80]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 px-4 rounded-2xl bg-[#2d6a3f] hover:bg-[#235331] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t.completeSale} ({formatCurrency(totalAmount)})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bill Receipt Modal */}
      <AnimatePresence>
        {completedTxn && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#201c18] rounded-3xl max-w-sm w-full p-6 border border-[#e8dfd1] dark:border-[#38322b] shadow-2xl space-y-4"
            >
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#eef5ee] dark:bg-[#1c3322] text-[#2d6a3f] dark:text-[#4ade80] flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-black text-lg text-[#1c1917] dark:text-[#f5eee3]">Sale Completed!</h3>
                <p className="text-xs text-[#78716c] dark:text-[#a89f91]">Bill #{completedTxn.invoiceNumber}</p>
              </div>

              <div className="bg-[#fbf8f2] dark:bg-[#28231e] p-4 rounded-2xl border border-[#e8dfd1] dark:border-[#3d3731] space-y-2 text-xs">
                {completedTxn.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate pr-2 text-[#1c1917] dark:text-[#f5eee3]">{it.product.name} × {it.quantity}</span>
                    <strong className="text-[#1c1917] dark:text-[#f5eee3]">{formatCurrency(it.total)}</strong>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#e0d3c1] dark:border-[#3d3731] flex justify-between font-black text-sm text-[#1c1917] dark:text-[#f5eee3]">
                  <span>Total Paid ({completedTxn.paymentMethod})</span>
                  <span className="text-[#2d6a3f] dark:text-[#4ade80]">{formatCurrency(completedTxn.totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => setCompletedTxn(null)}
                className="w-full py-3 bg-[#d96528] text-white rounded-2xl font-black text-xs cursor-pointer shadow-xs"
              >
                Close & Next Customer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
