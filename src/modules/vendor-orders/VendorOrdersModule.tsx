'use client';

import React, { useState } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { VENDORS_CATALOG } from '@/src/lib/vendors';
import { Vendor, VendorItem, PurchaseOrder } from '@/src/types';
import { OrderTrackingView } from '@/src/components/tracking/OrderTrackingView';
import { formatCurrency, formatDateTime } from '@/src/lib/utils';
import {
  Truck,
  Building2,
  PackagePlus,
  Plus,
  Minus,
  MapPin,
  Star,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  History,
  Copy,
  Sparkles,
  RotateCcw,
  PackageCheck,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const VendorOrdersModule: React.FC = () => {
  const {
    purchaseOrders,
    createPurchaseOrder,
    completeStockInFromOrder,
    requestReturnOrder,
    confirmReturnLoaded,
    t,
  } = useInventory();

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'history'>('catalog');
  const [selectedVendorId, setSelectedVendorId] = useState<string>(VENDORS_CATALOG[0].id);
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<PurchaseOrder | null>(null);

  // Return defective items state from history
  const [returnOrderTarget, setReturnOrderTarget] = useState<PurchaseOrder | null>(null);
  const [returnDefectiveQty, setReturnDefectiveQty] = useState(10);
  const [returnDefectiveReason, setReturnDefectiveReason] = useState('Fabric printing defect & border stains');

  const [historySearch, setHistorySearch] = useState('');

  const selectedVendor =
    VENDORS_CATALOG.find((v) => v.id === selectedVendorId) || VENDORS_CATALOG[0];

  const handleQtyChange = (itemId: string, delta: number, minQty: number) => {
    setOrderQuantities((prev) => {
      const current = prev[itemId] || 0;
      let next = current + delta;
      if (next < 0) next = 0;
      if (next > 0 && next < minQty && delta > 0) {
        next = minQty;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const selectedItemsList = selectedVendor.catalog
    .filter((item) => (orderQuantities[item.id] || 0) > 0)
    .map((item) => ({
      vendorItem: item,
      quantity: orderQuantities[item.id],
    }));

  const totalPOAmount = selectedItemsList.reduce(
    (sum, { vendorItem, quantity }) => sum + vendorItem.unitPrice * quantity,
    0
  );
  const totalPOPieces = selectedItemsList.reduce((sum, { quantity }) => sum + quantity, 0);

  const handlePlaceOrder = () => {
    if (selectedItemsList.length === 0) {
      toast.error('Please select at least one item and quantity to order.');
      return;
    }

    const order = createPurchaseOrder(selectedVendor, selectedItemsList);
    setOrderQuantities({});
    setActiveTrackingOrder(order);
  };

  const handleCopyLink = (orderId: string) => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/track/${orderId}`
        : `/track/${orderId}`;
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      toast.success(`Tracking Link Copied for Order #${orderId}`, {
        description: 'Open anytime to track moving truck.',
      });
    }
  };

  const handleOpenReturnModal = (order: PurchaseOrder) => {
    setReturnOrderTarget(order);
    setReturnDefectiveQty(Math.min(10, order.totalItems));
    setReturnDefectiveReason('Fabric printing defect & border stains');
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderTarget) return;
    requestReturnOrder(returnOrderTarget.id, returnDefectiveQty, returnDefectiveReason);
    setReturnOrderTarget(null);
  };

  // Filter history
  const filteredOrders = purchaseOrders.filter((o) => {
    const q = historySearch.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.vendorName.toLowerCase().includes(q) ||
      o.vendorCity.toLowerCase().includes(q) ||
      o.truckNumber.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. TOP BANNER */}
      <div className="bg-[#f5eee3] dark:bg-[#241f1a] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] dark:border-[#38322b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917] dark:text-[#f5eee3]">
            {t.vendorOrdersTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#a89f91] mt-0.5">
            {t.vendorOrdersSub}
          </p>
        </div>

        {/* Sub-tab Switcher (Mobile Responsive) */}
        <div className="flex bg-white dark:bg-[#28231e] p-1 rounded-2xl border border-[#e8dfd1] dark:border-[#3d3731] shadow-2xs self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'catalog'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] dark:text-[#a89f91] hover:text-[#1c1917]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.orderFromWeaversTab}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-[#d96528] text-white shadow-xs'
                : 'text-[#57534e] dark:text-[#a89f91] hover:text-[#1c1917]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{t.orderHistoryTab} ({purchaseOrders.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'catalog' ? (
        <div className="space-y-6">
          {/* 2. VENDOR SELECTOR PILLS */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#8c827a] dark:text-[#a89f91] mb-2.5 px-1">
              {t.selectWeaverHub}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {VENDORS_CATALOG.map((vendor) => {
                const isSelected = selectedVendor.id === vendor.id;
                return (
                  <div
                    key={vendor.id}
                    onClick={() => {
                      setSelectedVendorId(vendor.id);
                      setOrderQuantities({});
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white dark:bg-[#28231e] border-2 border-[#d96528] shadow-sm'
                        : 'bg-[#fbf8f2] dark:bg-[#201c18] border-[#e8dfd1] dark:border-[#38322b] hover:border-[#d96528]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-[#8c827a] dark:text-[#a89f91] uppercase flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#d96528]" />
                          {vendor.city}
                        </span>
                        <div className="flex items-center gap-0.5 text-[10px] font-black text-[#b45309] dark:text-[#f59e0b]">
                          <Star className="w-3 h-3 fill-[#b45309] dark:fill-[#f59e0b] text-[#b45309] dark:text-[#f59e0b]" />
                          <span>{vendor.rating}</span>
                        </div>
                      </div>

                      <h4 className="font-extrabold text-xs sm:text-sm text-[#1c1917] dark:text-[#f5eee3] mt-1.5 leading-snug">
                        {vendor.name}
                      </h4>
                      <p className="text-[11px] text-[#78716c] dark:text-[#a89f91] mt-0.5 line-clamp-1">{vendor.specialty}</p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#f0e6d8] dark:border-[#38322b] flex items-center justify-between text-[11px]">
                      <span className="text-[#8c827a] dark:text-[#a89f91]">{vendor.catalog.length} Materials</span>
                      <span
                        className={`font-bold ${
                          isSelected ? 'text-[#d96528] dark:text-[#ea7637]' : 'text-[#78716c] dark:text-[#a89f91]'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'View Catalog →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. VENDOR CATALOG & PURCHASE ORDER DRAWER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Columns: Materials Catalog */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-[#201c18] p-4 sm:p-5 rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] shadow-xs flex items-center justify-between transition-colors">
                <div>
                  <span className="text-[10px] font-bold text-[#8c827a] dark:text-[#a89f91] uppercase">{t.availableMillCatalog}</span>
                  <h3 className="text-base sm:text-lg font-black text-[#1c1917] dark:text-[#f5eee3]">
                    {selectedVendor.name} ({selectedVendor.city})
                  </h3>
                </div>
                <div className="text-xs text-[#57534e] dark:text-[#a89f91] font-semibold hidden sm:flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#2d6a3f] dark:text-[#4ade80]" />
                  <span>{selectedVendor.phone}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {selectedVendor.catalog.map((item) => {
                  const qty = orderQuantities[item.id] || 0;
                  const isAdded = qty > 0;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                        isAdded
                          ? 'bg-white dark:bg-[#28231e] border-2 border-[#d96528] shadow-xs'
                          : 'bg-white dark:bg-[#201c18] border-[#e8dfd1] dark:border-[#38322b] hover:border-[#d96528]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f5eee3] dark:bg-[#28231e] text-[#57534e] dark:text-[#d6cec2] border border-[#e4d8c5] dark:border-[#38322b]">
                              {item.category}
                            </span>
                            <span className="text-[11px] text-[#78716c] dark:text-[#a89f91] font-medium">
                              Mill Stock: <strong>{item.inStockAtMill} {t.pieces}</strong>
                            </span>
                            <span className="text-[11px] text-[#b45309] dark:text-[#f59e0b] font-bold">
                              • Min: {item.minimumOrderQty} {t.pieces}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-black text-[#1c1917] dark:text-[#f5eee3]">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#78716c] dark:text-[#a89f91]">{item.description}</p>

                          <div className="text-xs text-[#57534e] dark:text-[#a89f91] flex flex-wrap items-center gap-3 pt-1">
                            <span>Fabric: <strong>{item.fabric}</strong></span>
                            <span>• Color: <strong>{item.color}</strong></span>
                            <span>• Target: <strong>{item.defaultRack}</strong></span>
                          </div>
                        </div>

                        {/* Price & Quantity Stepper */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#f0e6d8] dark:border-[#38322b] shrink-0">
                          <div className="text-left sm:text-right">
                            <div className="text-base sm:text-lg font-black text-[#1c1917] dark:text-[#f5eee3]">
                              {formatCurrency(item.unitPrice)}
                              <span className="text-xs font-normal text-[#78716c] dark:text-[#a89f91]"> /piece</span>
                            </div>
                            <div className="text-[10px] text-[#2d6a3f] dark:text-[#4ade80] font-bold">
                              Est. Retail: {formatCurrency(item.retailEstimate)}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 bg-[#fbf8f2] dark:bg-[#28231e] p-1 rounded-2xl border border-[#e0d3c1] dark:border-[#3d3731]">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.id, -5, item.minimumOrderQty)}
                              disabled={qty <= 0}
                              className="w-8 h-8 rounded-xl bg-white dark:bg-[#201c18] border border-[#e8dfd1] dark:border-[#38322b] flex items-center justify-center font-bold text-xs hover:bg-[#f5eee3] disabled:opacity-30 cursor-pointer shadow-2xs"
                            >
                              -5
                            </button>
                            <span className="w-10 text-center font-black text-sm text-[#1c1917] dark:text-[#f5eee3]">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.id, 5, item.minimumOrderQty)}
                              className="w-8 h-8 rounded-xl bg-[#d96528] text-white flex items-center justify-center font-bold text-xs hover:bg-[#c45418] cursor-pointer shadow-2xs"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 4 Columns: Purchase Order Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#f5eee3] dark:bg-[#241f1a] rounded-3xl border border-[#e4d8c5] dark:border-[#38322b] p-5 sm:p-6 shadow-xs space-y-4 sticky top-20 transition-colors">
                <div className="flex items-center justify-between border-b border-[#e4d8c5] dark:border-[#38322b] pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#d96528] dark:text-[#ea7637]" />
                    <h3 className="font-black text-base text-[#1c1917] dark:text-[#f5eee3]">{t.purchaseOrderPO}</h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#faeedf] dark:bg-[#3d2415] text-[#c45418] dark:text-[#ea7637] border border-[#eed6c0] dark:border-[#52301c]">
                    {totalPOPieces} {t.pieces}
                  </span>
                </div>

                {selectedItemsList.length === 0 ? (
                  <div className="py-8 text-center text-[#78716c] dark:text-[#a89f91] space-y-2 bg-white dark:bg-[#201c18] rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] p-4">
                    <Building2 className="w-8 h-8 mx-auto text-[#8c827a]" />
                    <p className="text-xs font-bold text-[#44403c] dark:text-[#d6cec2]">No materials selected</p>
                    <p className="text-[11px] text-[#78716c] dark:text-[#a89f91]">
                      Use the `+5` buttons on the left to add items from {selectedVendor.name}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {selectedItemsList.map(({ vendorItem, quantity }) => (
                      <div
                        key={vendorItem.id}
                        className="p-3 bg-white dark:bg-[#201c18] rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex justify-between font-bold text-[#1c1917] dark:text-[#f5eee3]">
                          <span className="truncate pr-2">{vendorItem.name}</span>
                          <span className="text-[#d96528] dark:text-[#ea7637] shrink-0">+{quantity} {t.pieces}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-[#78716c] dark:text-[#a89f91]">
                          <span>{formatCurrency(vendorItem.unitPrice)} × {quantity}</span>
                          <strong className="text-[#1c1917] dark:text-[#f5eee3]">{formatCurrency(vendorItem.unitPrice * quantity)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedItemsList.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-[#e4d8c5] dark:border-[#38322b]">
                    <div className="bg-white dark:bg-[#201c18] p-4 rounded-2xl border border-[#e8dfd1] dark:border-[#38322b] space-y-2">
                      <div className="flex justify-between text-xs text-[#78716c] dark:text-[#a89f91]">
                        <span>Vendor:</span>
                        <strong className="text-[#1c1917] dark:text-[#f5eee3]">{selectedVendor.name}</strong>
                      </div>
                      <div className="flex justify-between text-xs text-[#78716c] dark:text-[#a89f91]">
                        <span>Total Quantity:</span>
                        <strong className="text-[#1c1917] dark:text-[#f5eee3]">{totalPOPieces} {t.pieces}</strong>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-[#f0e6d8] dark:border-[#38322b]">
                        <span className="text-[#78716c] dark:text-[#a89f91] font-bold">Total Cost:</span>
                        <span className="text-xl font-black text-[#1c1917] dark:text-[#f5eee3]">
                          {formatCurrency(totalPOAmount)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      className="w-full py-4 px-4 rounded-2xl bg-[#d96528] hover:bg-[#c45418] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Truck className="w-5 h-5" />
                      <span>{t.placeOrderAndTrack}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 4. ORDERS & RETURN HISTORY */
        <div className="space-y-6">
          {/* Search in History */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8c827a] dark:text-[#a89f91] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search history by Order #, Weaver Name, Truck #, or Saree Name..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#201c18] border border-[#e0d3c1] dark:border-[#38322b] rounded-2xl text-xs sm:text-sm text-[#1c1917] dark:text-[#f5eee3] focus:outline-hidden focus:ring-2 focus:ring-[#d96528] shadow-xs"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-10 text-center text-[#78716c] dark:text-[#a89f91] text-xs space-y-2">
              <History className="w-10 h-10 mx-auto text-[#8c827a]" />
              <p className="font-bold text-[#44403c] dark:text-[#d6cec2] text-sm">No orders found in history.</p>
              <p>Place an order with a weaver above to start tracking deliveries.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isStocked = order.status === 'STOCKED';
                const hasReturn = !!order.returnRequest;
                const isReturnCompleted = order.returnRequest
                  ? (Date.now() - order.returnRequest.requestedAt) / 1000 >= 60 ||
                    order.returnRequest.status === 'RETURN_COMPLETED'
                  : false;
                const elapsedInward = (Date.now() - order.createdAt) / 1000;
                const isArrived = isStocked || elapsedInward >= 70;

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-5 sm:p-6 shadow-xs hover:border-[#d96528] transition-all space-y-4"
                  >
                    {/* Top Row: Order Header & Status Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0e6d8] dark:border-[#38322b] pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-[#faeedf] dark:bg-[#3d2415] text-[#c45418] dark:text-[#ea7637] border border-[#eed6c0] dark:border-[#52301c]">
                          ORDER #{order.id}
                        </span>
                        <span className="text-xs text-[#78716c] dark:text-[#a89f91] font-medium">
                          Placed {formatDateTime(new Date(order.createdAt).toISOString())}
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {isReturnCompleted ? (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#eef5ee] dark:bg-[#1a2e1f] text-[#2d6a3f] dark:text-[#86efac] border border-[#d2e4d3] dark:border-[#2d5937] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a3f] dark:text-[#86efac]" />
                            <span>{t.returnCompleted} ({order.returnRequest?.quantity} {t.pieces})</span>
                          </span>
                        ) : hasReturn ? (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#fdf0ed] dark:bg-[#3d1a15] text-[#b9381e] dark:text-[#f87171] border border-[#f8d0c8] dark:border-[#52221b] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#b9381e] dark:bg-[#f87171] animate-ping" />
                            <span>{t.returnInTransit} ({order.returnRequest?.quantity} {t.pieces})</span>
                          </span>
                        ) : isStocked ? (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#eef5ee] dark:bg-[#1a2e1f] text-[#2d6a3f] dark:text-[#86efac] border border-[#d2e4d3] dark:border-[#2d5937] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a3f] dark:text-[#86efac]" />
                            <span>{t.stockedInShop}</span>
                          </span>
                        ) : isArrived ? (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#fcf3e6] dark:bg-[#382b18] text-[#b45309] dark:text-[#f59e0b] border border-[#fae2c0] dark:border-[#52301c] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#b45309] dark:bg-[#f59e0b] animate-bounce" />
                            <span>{t.vehicleAtGate}</span>
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#faeedf] dark:bg-[#3d2415] text-[#c45418] dark:text-[#ea7637] border border-[#eed6c0] dark:border-[#52301c] flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-[#d96528] dark:text-[#ea7637] animate-bounce" />
                            <span>{t.enRouteHighway}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#8c827a] dark:text-[#a89f91] block">
                          Weaver Mill & Location
                        </span>
                        <div className="font-extrabold text-sm text-[#1c1917] dark:text-[#f5eee3] mt-0.5">
                          {order.vendorName}
                        </div>
                        <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#d96528]" />
                          <span>{order.vendorCity}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#8c827a] dark:text-[#a89f91] block">
                          Items & Quantity
                        </span>
                        <div className="font-extrabold text-sm text-[#1c1917] dark:text-[#f5eee3] mt-0.5">
                          {order.totalItems} {t.pieces}
                        </div>
                        <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] mt-0.5 truncate">
                          {order.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#8c827a] dark:text-[#a89f91] block">
                          Vehicle & Valuation
                        </span>
                        <div className="font-extrabold text-sm text-[#2d6a3f] dark:text-[#4ade80] mt-0.5">
                          {formatCurrency(order.totalAmount)}
                        </div>
                        <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] font-mono mt-0.5">
                          Truck: {order.truckNumber}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: 1-Tap Actions (Track, Copy Link, Accept Delivery, Return Defective) */}
                    <div className="pt-3 border-t border-[#f0e6d8] dark:border-[#38322b] flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Live Track Map Modal */}
                        <button
                          onClick={() => setActiveTrackingOrder(order)}
                          className="py-2 px-3.5 rounded-xl bg-[#d96528] hover:bg-[#c45418] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Truck className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap">{t.liveTrackGPSMap}</span>
                        </button>

                        {/* Copy Direct Link */}
                        <button
                          onClick={() => handleCopyLink(order.id)}
                          className="py-2 px-3 rounded-xl bg-[#f5eee3] dark:bg-[#28231e] hover:bg-[#ede3d3] dark:hover:bg-[#332c25] text-[#1c1917] dark:text-[#f5eee3] font-bold text-xs flex items-center gap-1.5 border border-[#e4d8c5] dark:border-[#38322b] cursor-pointer whitespace-nowrap shrink-0"
                          title="Copy tracking URL"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#d96528] shrink-0" />
                          <span className="whitespace-nowrap">{t.copyTrackingLink}</span>
                        </button>

                        {/* Standalone Route Link */}
                        <a
                          href={`/track/${order.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-[#f5eee3] dark:bg-[#28231e] hover:bg-[#ede3d3] text-[#57534e] hover:text-[#1c1917] dark:text-[#a89f91] dark:hover:text-[#f5eee3] text-xs shrink-0 flex items-center justify-center border border-[#e4d8c5] dark:border-[#38322b]"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4 shrink-0" />
                        </a>
                      </div>

                      {/* Inward Accept or Defective Return */}
                      <div className="flex items-center gap-2">
                        {!isStocked && isArrived && (
                          <button
                            onClick={() => completeStockInFromOrder(order.id)}
                            className="py-2 px-4 rounded-xl bg-[#2d6a3f] hover:bg-[#235331] text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>{t.acceptDeliveryAndStockIn}</span>
                          </button>
                        )}

                        {isStocked && !hasReturn && (
                          <button
                            onClick={() => handleOpenReturnModal(order)}
                            className="py-2 px-3.5 rounded-xl bg-[#fdf0ed] dark:bg-[#3d1a15] hover:bg-[#fce5e1] text-[#b9381e] dark:text-[#f87171] font-bold text-xs border border-[#f8d0c8] dark:border-[#52221b] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{t.reportDefectiveItems}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. MODAL LIVE GPS TRACKING DRAWER */}
      <AnimatePresence>
        {activeTrackingOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#201c18] rounded-3xl max-w-4xl w-full p-4 sm:p-6 border border-[#e8dfd1] dark:border-[#38322b] shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto"
            >
              <OrderTrackingView
                order={activeTrackingOrder}
                onClose={() => setActiveTrackingOrder(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. RETURN DEFECTIVE MODAL FROM HISTORY */}
      <AnimatePresence>
        {returnOrderTarget && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#201c18] rounded-3xl max-w-md w-full p-6 border border-[#e8dfd1] dark:border-[#38322b] shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f0e6d8] dark:border-[#38322b] pb-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-[#b9381e] dark:text-[#f87171]" />
                  <h3 className="font-black text-base text-[#1c1917] dark:text-[#f5eee3]">Return Defective Clothes</h3>
                </div>
                <button
                  onClick={() => setReturnOrderTarget(null)}
                  className="text-[#8c827a] hover:text-[#1c1917] dark:text-[#a89f91] dark:hover:text-[#f5eee3] font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#78716c] dark:text-[#a89f91]">
                Found damaged or defective clothes from <strong>{returnOrderTarget.vendorName}</strong> for Order #{returnOrderTarget.id}? Place a return request to send them back by truck.
              </p>

              <form onSubmit={handleConfirmReturn} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#44403c] dark:text-[#d6cec2] uppercase mb-1">
                    How many pieces are defective / damaged?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={returnOrderTarget.totalItems}
                    required
                    value={returnDefectiveQty}
                    onChange={(e) => setReturnDefectiveQty(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#fbf8f2] dark:bg-[#28231e] border-2 border-[#f8d0c8] dark:border-[#52221b] rounded-2xl text-xl font-black text-[#b9381e] dark:text-[#f87171] focus:border-[#b9381e] focus:outline-hidden"
                  />
                  <div className="text-[11px] text-[#78716c] dark:text-[#a89f91] mt-1">
                    Total delivery received: <strong>{returnOrderTarget.totalItems} {t.pieces}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#44403c] dark:text-[#d6cec2] uppercase mb-1">
                    Defect Reason
                  </label>
                  <input
                    type="text"
                    required
                    value={returnDefectiveReason}
                    onChange={(e) => setReturnDefectiveReason(e.target.value)}
                    placeholder="e.g. Torn border, wrong color tone, or dye stains"
                    className="w-full px-3.5 py-2.5 bg-[#fbf8f2] dark:bg-[#28231e] border border-[#e0d3c1] dark:border-[#38322b] rounded-xl text-xs text-[#1c1917] dark:text-[#f5eee3]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReturnOrderTarget(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#e8dfd1] dark:border-[#38322b] text-xs font-bold text-[#57534e] dark:text-[#a89f91] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#b9381e] hover:bg-[#992d18] text-white text-xs font-black shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-4 h-4" /> Start Return & Pickup
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
