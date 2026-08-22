'use client';

import React, { useState, useEffect } from 'react';
import { PurchaseOrder } from '@/src/types';
import { useInventory } from '@/src/context/InventoryContext';
import { LiveRouteMap } from '@/src/components/tracking/LiveRouteMap';
import { LAXMI_TEXTILES_LOCATION } from '@/src/lib/vendors';
import { formatCurrency, formatDateTime } from '@/src/lib/utils';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Copy,
  ExternalLink,
  PackageCheck,
  Package,
  RotateCcw,
  Sparkles,
  AlertOctagon,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderTrackingViewProps {
  order: PurchaseOrder;
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  order: initialOrder,
  onClose,
  isStandalonePage = false,
}) => {
  const { purchaseOrders, completeStockInFromOrder, requestReturnOrder, confirmReturnLoaded } =
    useInventory();

  // Always use the latest live order from context
  const order =
    purchaseOrders.find((o) => o.id === initialOrder.id || o.trackingHash === initialOrder.id) ||
    initialOrder;

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnQty, setReturnQty] = useState(Math.min(10, order.totalItems));
  const [returnReason, setReturnReason] = useState('Fabric printing defect & border stains');

  // Update timer every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const isOrderStocked = order.status === 'STOCKED';
  const returnReq = order.returnRequest;

  // Inward delivery timeline calculations
  const elapsedInwardSeconds = Math.max(0, (currentTime - order.createdAt) / 1000);

  let inwardProgress = 0;
  let inwardStageText = 'Order Confirmed • Packing at Mill';
  let inwardEta = 60;
  let isInwardArrived = false;

  if (isOrderStocked) {
    inwardProgress = 1.0;
    inwardStageText = 'Delivered & Stocked into Inventory';
    isInwardArrived = true;
    inwardEta = 0;
  } else if (elapsedInwardSeconds < 10) {
    inwardProgress = 0;
    inwardStageText = `Mill Packing in Progress (${Math.ceil(10 - elapsedInwardSeconds)}s to dispatch)`;
    inwardEta = Math.ceil(70 - elapsedInwardSeconds);
  } else if (elapsedInwardSeconds < 70) {
    inwardProgress = (elapsedInwardSeconds - 10) / 60;
    inwardStageText = `Highway Transit • Moving towards Laxmi Textiles`;
    inwardEta = Math.ceil(70 - elapsedInwardSeconds);
  } else {
    inwardProgress = 1.0;
    inwardStageText = 'Vehicle Arrived at Laxmi Textiles Main Store!';
    isInwardArrived = true;
    inwardEta = 0;
  }

  // Reverse Return Timeline Calculations
  const isReturnActive = !!returnReq;
  const elapsedReturnSeconds = returnReq
    ? Math.max(0, (currentTime - returnReq.requestedAt) / 1000)
    : 0;

  let returnProgress = 0;
  let returnStageText = '';
  let isReturnLoaded = false;
  let isReturnCompleted = false;

  if (returnReq) {
    if (elapsedReturnSeconds < 5) {
      returnProgress = 0;
      returnStageText = `Vendor Accepted Return • Pickup Truck Assigning (${Math.ceil(5 - elapsedReturnSeconds)}s)`;
    } else if (elapsedReturnSeconds < 15) {
      returnProgress = 0;
      returnStageText = `Truck Arrived at Laxmi Textiles • Loading Defective Stock`;
      isReturnLoaded = true;
    } else if (elapsedReturnSeconds < 60) {
      returnProgress = (elapsedReturnSeconds - 15) / 45;
      returnStageText = `Reverse Transit • Truck returning to ${order.vendorCity}`;
      isReturnLoaded = true;
    } else {
      returnProgress = 1.0;
      returnStageText = `Defective Stock Reached ${order.vendorName} • Return Complete`;
      isReturnCompleted = true;
    }
  }

  // GPS Coordinates
  const vLat = order.vendorCoordinates.lat;
  const vLng = order.vendorCoordinates.lng;
  const sLat = LAXMI_TEXTILES_LOCATION.lat;
  const sLng = LAXMI_TEXTILES_LOCATION.lng;

  let currentTruckLat: number;
  let currentTruckLng: number;
  let activeMapProgress: number;
  let activeMapStatus: string;
  let isReverseMap: boolean;
  let activeTruckNumber: string;

  if (isReturnActive) {
    isReverseMap = true;
    activeMapProgress = returnProgress;
    activeMapStatus = returnStageText;
    activeTruckNumber = returnReq?.truckNumber || 'TN 28 CZ 1109';
    // Truck moving from Shop -> Vendor
    currentTruckLat = sLat + (vLat - sLat) * returnProgress;
    currentTruckLng = sLng + (vLng - sLng) * returnProgress;
  } else {
    isReverseMap = false;
    activeMapProgress = inwardProgress;
    activeMapStatus = inwardStageText;
    activeTruckNumber = order.truckNumber;
    // Truck moving from Vendor -> Shop
    currentTruckLat = vLat + (sLat - vLat) * inwardProgress;
    currentTruckLng = vLng + (sLng - vLng) * inwardProgress;
  }

  const trackingUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/track/${order.id}`
      : `/track/${order.id}`;

  const copyTrackingLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(trackingUrl);
      toast.success('Live Tracking Link Copied!', {
        description: 'Share with staff or vendor to track live.',
      });
    }
  };

  const handleStockIn = () => {
    completeStockInFromOrder(order.id);
  };

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (returnQty <= 0) return;
    requestReturnOrder(order.id, returnQty, returnReason);
    setShowReturnModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. TOP HEADER & LINK SHARING */}
      <div className="bg-[#f5eee3] p-5 sm:p-6 rounded-3xl border border-[#e4d8c5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#faeedf] text-[#c45418] border border-[#eed6c0] text-xs font-black">
              ORDER #{order.id}
            </span>
            <span className="text-xs text-[#78716c] font-semibold">
              Placed {formatDateTime(new Date(order.createdAt).toISOString())}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#1c1917] mt-1.5 flex flex-wrap items-center gap-2">
            <span>
              {isReturnCompleted
                ? '✅ Defective Return Completed'
                : isReturnActive
                ? '🔄 Defective Return Live Tracking'
                : 'Live Delivery Tracking'}
            </span>
            {isOrderStocked && !isReturnActive && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-xl bg-[#eef5ee] text-[#2d6a3f] border border-[#d2e4d3]">
                ✅ In Stock
              </span>
            )}
            {isReturnActive && isReturnCompleted && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-xl bg-[#eef5ee] text-[#2d6a3f] border border-[#d2e4d3]">
                ✅ Return Settled ({returnReq?.quantity} pcs)
              </span>
            )}
            {isReturnActive && !isReturnCompleted && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-xl bg-[#fdf0ed] text-[#b9381e] border border-[#f8d0c8]">
                🔄 Return in Transit ({returnReq?.quantity} pcs)
              </span>
            )}
          </h2>
          <p className="text-xs text-[#57534e] mt-0.5">
            Vendor: <strong>{order.vendorName}</strong> ({order.vendorCity})
          </p>
        </div>

        {/* Shareable Link Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-nowrap">
          <button
            onClick={copyTrackingLink}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e8dfd1] hover:border-[#d96528] text-xs font-bold text-[#1c1917] flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all whitespace-nowrap shrink-0 select-none"
          >
            <Copy className="w-3.5 h-3.5 text-[#d96528] shrink-0" />
            <span className="whitespace-nowrap">Copy Link</span>
          </button>

          {!isStandalonePage && (
            <a
              href={`/track/${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white border border-[#e8dfd1] hover:text-[#d96528] text-[#57534e] shadow-2xs shrink-0 flex items-center justify-center"
              title="Open full page tracker"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
            </a>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#e8dfd1] hover:bg-[#ded3c3] text-xs font-bold text-[#1c1917] cursor-pointer whitespace-nowrap shrink-0"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* 2. LIVE LEAFLET GPS MAP */}
      <LiveRouteMap
        vendorCoords={order.vendorCoordinates}
        vendorName={order.vendorName}
        vendorCity={order.vendorCity}
        truckCoords={{ lat: currentTruckLat, lng: currentTruckLng }}
        progress={activeMapProgress}
        statusText={activeMapStatus}
        truckNumber={activeTruckNumber}
        isReverse={isReverseMap}
      />

      {/* 3. ACCEPT DELIVERY CALLOUT (Shown ONLY when arrived AND NOT yet stocked) */}
      {!isOrderStocked && isInwardArrived && (
        <div className="bg-[#eef5ee] border-2 border-[#2d6a3f] p-5 sm:p-6 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2d6a3f] text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
              📦
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#2d6a3f]">
                <Sparkles className="w-3.5 h-3.5" /> Vehicle Arrived at Gate
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#1c1917]">
                Ready for Inward Stocking (+{order.totalItems} pieces)
              </h3>
              <p className="text-xs text-[#57534e] mt-0.5">
                Click below to add these items into your shop catalog and update shelf counts!
              </p>
            </div>
          </div>

          <button
            onClick={handleStockIn}
            className="py-3.5 px-6 rounded-2xl bg-[#2d6a3f] hover:bg-[#235331] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <PackageCheck className="w-5 h-5" />
            <span>Accept Delivery & Stock In</span>
          </button>
        </div>
      )}

      {/* 4. POST-DELIVERY ACTIONS: STOCK IN CONFIRMATION & RETURN DEFECTIVE BUTTON */}
      {isOrderStocked && !isReturnActive && (
        <div className="bg-white rounded-3xl border border-[#e8dfd1] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#eef5ee] text-[#2d6a3f] flex items-center justify-center font-bold text-lg shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[#2d6a3f]" />
            </div>
            <div>
              <h4 className="font-black text-base text-[#1c1917]">
                Delivery Accepted & Added to Shop Inventory
              </h4>
              <p className="text-xs text-[#78716c]">
                All {order.totalItems} pieces are now live on shelves.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowReturnModal(true)}
            className="py-2.5 px-4 rounded-xl bg-[#fdf0ed] hover:bg-[#fce5e1] text-[#b9381e] border border-[#f8d0c8] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Report Defective Items & Return</span>
          </button>
        </div>
      )}

      {/* 5. REVERSE RETURN PROGRESS BAR & STATUS */}
      {isReturnActive && (
        <div
          className={`border-2 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 transition-colors ${
            isReturnCompleted ? 'bg-[#eef5ee] border-[#2d6a3f]' : 'bg-[#fdf0ed] border-[#f8d0c8]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl text-white flex items-center justify-center text-lg shrink-0 ${
                  isReturnCompleted ? 'bg-[#2d6a3f]' : 'bg-[#b9381e]'
                }`}
              >
                {isReturnCompleted ? '✅' : '🔄'}
              </div>
              <div>
                <span
                  className={`text-xs font-black uppercase ${
                    isReturnCompleted ? 'text-[#2d6a3f]' : 'text-[#b9381e]'
                  }`}
                >
                  {isReturnCompleted
                    ? 'Defective Return Completed • Settled'
                    : 'Reverse Defective Return in Progress'}
                </span>
                <h4 className="text-base font-black text-[#1c1917]">
                  {isReturnCompleted
                    ? `${returnReq?.quantity} Defective Pieces Received at ${order.vendorName}`
                    : `Returning ${returnReq?.quantity} Defective Pieces to ${order.vendorName}`}
                </h4>
                <p className="text-xs text-[#78716c] mt-0.5">Reason: "{returnReq?.reason}"</p>
              </div>
            </div>

            {elapsedReturnSeconds >= 5 && elapsedReturnSeconds < 15 && !isReturnCompleted && (
              <button
                onClick={() => confirmReturnLoaded(order.id)}
                className="py-2.5 px-4 rounded-xl bg-[#b9381e] hover:bg-[#992d18] text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <PackageCheck className="w-4 h-4" /> Confirm Defective Stock Loaded
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[#f8d0c8] text-xs">
            <div className="p-3 rounded-2xl bg-white border border-[#f8d0c8]">
              <div className="font-extrabold text-[#1c1917]">1. Return Accepted</div>
              <div className="text-[11px] text-[#78716c]">Vendor agreed to return</div>
            </div>
            <div
              className={`p-3 rounded-2xl border ${
                elapsedReturnSeconds >= 5
                  ? 'bg-white border-[#f8d0c8] font-extrabold'
                  : 'bg-white/50 border-dashed border-[#f8d0c8] opacity-60'
              }`}
            >
              <div className="font-extrabold text-[#1c1917]">2. Truck at Shop</div>
              <div className="text-[11px] text-[#78716c]">
                {elapsedReturnSeconds >= 5 ? 'Vehicle at gate' : 'Dispatching (~5s)'}
              </div>
            </div>
            <div
              className={`p-3 rounded-2xl border ${
                elapsedReturnSeconds >= 15
                  ? 'bg-white border-[#f8d0c8] font-extrabold'
                  : 'bg-white/50 border-dashed border-[#f8d0c8] opacity-60'
              }`}
            >
              <div className="font-extrabold text-[#1c1917]">3. Reverse Highway Transit</div>
              <div className="text-[11px] text-[#78716c]">
                {elapsedReturnSeconds >= 15 ? 'Moving to mill' : 'Waiting pickup'}
              </div>
            </div>
            <div
              className={`p-3 rounded-2xl border ${
                isReturnCompleted
                  ? 'bg-[#eef5ee] border-[#d2e4d3] text-[#2d6a3f]'
                  : 'bg-white/50 border-dashed border-[#f8d0c8] opacity-60'
              }`}
            >
              <div className="font-extrabold">4. Reached Mill</div>
              <div className="text-[11px]">
                {isReturnCompleted ? 'Refund / Credit Issued' : 'Pending arrival'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. DRIVER & LOGISTICS DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Driver Card */}
        <div className="bg-white rounded-3xl border border-[#e8dfd1] p-5 shadow-xs space-y-3">
          <span className="text-xs font-black uppercase text-[#8c827a] block">
            {isReturnActive ? 'Return Logistics Vehicle' : 'Inward Logistics Vehicle'}
          </span>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#f5eee3] text-[#d96528] flex items-center justify-center font-bold text-lg shrink-0">
              🚚
            </div>
            <div>
              <div className="font-black text-sm text-[#1c1917]">
                {isReturnActive ? returnReq?.truckNumber : order.truckNumber}
              </div>
              <div className="text-xs text-[#78716c]">
                {isReturnActive ? returnReq?.driverName : order.driverName}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#f0e6d8]">
            <a
              href={`tel:${isReturnActive ? returnReq?.driverPhone : order.driverPhone}`}
              className="w-full py-2 bg-[#f5eee3] hover:bg-[#ede3d3] rounded-xl text-xs font-bold text-[#1c1917] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#2d6a3f]" /> Call Driver
            </a>
          </div>
        </div>

        {/* Destination Card */}
        <div className="bg-white rounded-3xl border border-[#e8dfd1] p-5 shadow-xs space-y-2">
          <span className="text-xs font-black uppercase text-[#8c827a] block">
            {isReturnActive ? 'Return Destination' : 'Store Destination'}
          </span>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#d96528] shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-xs text-[#1c1917]">
                {isReturnActive ? order.vendorName : LAXMI_TEXTILES_LOCATION.name}
              </div>
              <div className="text-[11px] text-[#78716c] mt-0.5">
                {isReturnActive ? order.vendorCity : LAXMI_TEXTILES_LOCATION.address}
              </div>
            </div>
          </div>
        </div>

        {/* Order Valuation Card */}
        <div className="bg-white rounded-3xl border border-[#e8dfd1] p-5 shadow-xs space-y-2">
          <span className="text-xs font-black uppercase text-[#8c827a] block">Purchase Order Summary</span>
          <div className="text-2xl font-black text-[#1c1917]">{formatCurrency(order.totalAmount)}</div>
          <div className="text-xs text-[#78716c]">
            Total: <strong>{order.totalItems} pieces</strong> across {order.items.length} variety lines
          </div>
        </div>
      </div>

      {/* 7. ORDERED ITEMS BREAKDOWN */}
      <div className="bg-white rounded-3xl border border-[#e8dfd1] p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#8c827a]">
          Items in this Delivery
        </h3>
        <div className="divide-y divide-[#f0e6d8]">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs gap-3">
              <div>
                <div className="font-extrabold text-sm text-[#1c1917]">{item.name}</div>
                <div className="text-[11px] text-[#78716c] flex items-center gap-2 mt-0.5">
                  <span>{item.category}</span>
                  <span>• {item.fabric}</span>
                  <span>• Target: <strong>{item.targetRack}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#faeedf] text-[#c45418] border border-[#eed6c0]">
                  +{item.quantity} pieces
                </span>
                <div className="text-[11px] text-[#78716c] mt-1 font-semibold">
                  {formatCurrency(item.unitPrice)}/pc • Total: {formatCurrency(item.total)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. REPORT DEFECTIVE MODAL */}
      <AnimatePresence>
        {showReturnModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#e8dfd1] shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f0e6d8] pb-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-[#b9381e]" />
                  <h3 className="font-black text-base text-[#1c1917]">Return Defective Clothes</h3>
                </div>
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="text-[#8c827a] hover:text-[#1c1917] font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#78716c]">
                Found damaged or defective clothes from <strong>{order.vendorName}</strong>? Place a return request to send them back by truck.
              </p>

              <form onSubmit={handleCreateReturn} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#44403c] uppercase mb-1">
                    How many pieces are defective / damaged?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={order.totalItems}
                    required
                    value={returnQty}
                    onChange={(e) => setReturnQty(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#fbf8f2] border-2 border-[#f8d0c8] rounded-2xl text-xl font-black text-[#b9381e] focus:border-[#b9381e] focus:outline-hidden"
                  />
                  <div className="text-[11px] text-[#78716c] mt-1">
                    Total delivery received: <strong>{order.totalItems} pcs</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#44403c] uppercase mb-1">
                    Defect Reason
                  </label>
                  <input
                    type="text"
                    required
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder="e.g. Torn border, wrong color tone, or dye stains"
                    className="w-full px-3.5 py-2.5 bg-[#fbf8f2] border border-[#e0d3c1] rounded-xl text-xs text-[#1c1917]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#e8dfd1] text-xs font-bold text-[#57534e] cursor-pointer"
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
