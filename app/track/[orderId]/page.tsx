'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InventoryProvider, useInventory } from '@/src/context/InventoryContext';
import { OrderTrackingView } from '@/src/components/tracking/OrderTrackingView';
import { Logo } from '@/src/components/ui/Logo';
import { ArrowLeft, Store, PackageX } from 'lucide-react';
import Link from 'next/link';

function TrackingPageContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.orderId as string) || '';

  const { getPurchaseOrderById, purchaseOrders, isLoading, t } = useInventory();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbf8f2] dark:bg-[#181512] flex items-center justify-center p-6 transition-colors">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#d96528] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#78716c] dark:text-[#a89f91]">Loading live delivery route...</p>
        </div>
      </div>
    );
  }

  const order = getPurchaseOrderById(orderId);

  return (
    <div className="min-h-screen bg-[#fbf8f2] dark:bg-[#181512] text-[#1c1917] dark:text-[#fbf8f2] flex flex-col font-sans selection:bg-[#faeedf] selection:text-[#c45418] transition-colors">
      {/* Top Navbar */}
      <header className="bg-white dark:bg-[#201c18] border-b border-[#e8dfd1] dark:border-[#38322b] sticky top-0 z-30 shadow-2xs transition-colors">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[#f5eee3] dark:bg-[#28231e] hover:bg-[#ede3d3] text-[#57534e] hover:text-[#1c1917] dark:text-[#a89f91] dark:hover:text-[#f5eee3] transition-colors flex items-center gap-1.5 text-xs font-bold border border-[#e4d8c5] dark:border-[#38322b]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store Register</span>
            </Link>

            <div className="h-5 w-px bg-[#e8dfd1] dark:bg-[#38322b] hidden sm:block" />

            <div className="flex items-center gap-2">
              <Logo size={28} className="shrink-0 rounded-lg" />
              <span className="text-sm font-black tracking-tight text-[#1c1917] dark:text-[#f5eee3]">
                LAXMI <span className="text-[#d96528]">LOGISTICS</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#2d6a3f] dark:text-[#86efac] bg-[#eef5ee] dark:bg-[#1a2e1f] px-3 py-1.5 rounded-full border border-[#d2e4d3] dark:border-[#2d5937]">
            <span className="w-2 h-2 rounded-full bg-[#2d6a3f] dark:bg-[#86efac] animate-ping" />
            <span>Live GPS Active</span>
          </div>
        </div>
      </header>

      {/* Main Tracking Card Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!order ? (
          <div className="max-w-md mx-auto bg-white dark:bg-[#201c18] rounded-3xl border border-[#e8dfd1] dark:border-[#38322b] p-8 text-center space-y-4 shadow-sm my-12">
            <div className="w-14 h-14 rounded-2xl bg-[#fdf0ed] dark:bg-[#3d1a15] text-[#b9381e] dark:text-[#f87171] flex items-center justify-center mx-auto text-2xl">
              <PackageX className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-lg text-[#1c1917] dark:text-[#f5eee3]">Order Not Found</h3>
              <p className="text-xs text-[#78716c] dark:text-[#a89f91] mt-1">
                We could not find active delivery for order ID <strong>#{orderId}</strong>.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#d96528] text-white rounded-2xl font-black text-xs shadow-xs"
            >
              <Store className="w-4 h-4" />
              <span>Go to Laxmi Textiles Register</span>
            </Link>
          </div>
        ) : (
          <OrderTrackingView order={order} isStandalonePage={true} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#f5eee3] dark:bg-[#1f1b17] border-t border-[#e4d8c5] dark:border-[#38322b] py-4 text-xs text-[#78716c] dark:text-[#a89f91] text-center transition-colors">
        <p>Laxmi Textiles GPS Fleet Tracking • Powered by Leaflet & OpenStreetMap</p>
      </footer>
    </div>
  );
}

export default function StandaloneTrackingPage() {
  return (
    <InventoryProvider>
      <TrackingPageContent />
    </InventoryProvider>
  );
}
