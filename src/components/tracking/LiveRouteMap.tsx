'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { LAXMI_TEXTILES_LOCATION } from '@/src/lib/vendors';

interface LiveRouteMapProps {
  vendorCoords: { lat: number; lng: number };
  vendorName: string;
  vendorCity: string;
  truckCoords: { lat: number; lng: number };
  progress: number; // 0 to 1
  statusText: string;
  truckNumber: string;
  isReverse?: boolean;
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({
  vendorCoords,
  vendorName,
  vendorCity,
  truckCoords,
  progress,
  statusText,
  truckNumber,
  isReverse = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const truckMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const activePolylineRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map centered between vendor and shop
      const centerLat = (vendorCoords.lat + LAXMI_TEXTILES_LOCATION.lat) / 2;
      const centerLng = (vendorCoords.lng + LAXMI_TEXTILES_LOCATION.lng) / 2;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([centerLat, centerLng], 8);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom Vendor Pin Icon
      const vendorIcon = L.divIcon({
        className: 'custom-vendor-pin',
        html: `
          <div style="background-color: #704282; color: white; padding: 6px 10px; border-radius: 12px; font-weight: 800; font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 2px solid white; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
            <span>🏭</span> <span>${vendorCity}</span>
          </div>
        `,
        iconSize: [120, 36],
        iconAnchor: [60, 18],
      });

      // Custom Shop Pin Icon
      const shopIcon = L.divIcon({
        className: 'custom-shop-pin',
        html: `
          <div style="background-color: #d96528; color: white; padding: 6px 10px; border-radius: 12px; font-weight: 800; font-size: 11px; box-shadow: 0 4px 12px rgba(217,101,40,0.4); border: 2px solid white; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
            <span>🏪</span> <span>Laxmi Textiles</span>
          </div>
        `,
        iconSize: [130, 36],
        iconAnchor: [65, 18],
      });

      // Custom Truck Marker
      const truckBadgeColor = isReverse ? '#b9381e' : '#1c1917';
      const truckBorderColor = isReverse ? '#b9381e' : '#d96528';

      const truckIcon = L.divIcon({
        className: 'custom-truck-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="background-color: ${truckBadgeColor}; color: white; padding: 4px 8px; border-radius: 8px; font-weight: 900; font-size: 10px; border: 1.5px solid ${truckBorderColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 4px; white-space: nowrap; margin-bottom: 2px;">
              <span>${isReverse ? '🔄 🚚' : '🚚'}</span> <span>${truckNumber}</span>
            </div>
            <div style="width: 14px; height: 14px; background: ${truckBorderColor}; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 0 4px rgba(217,101,40,0.35); animation: pulse 1.5s infinite;"></div>
          </div>
        `,
        iconSize: [120, 50],
        iconAnchor: [60, 45],
      });

      // Add Markers
      L.marker([vendorCoords.lat, vendorCoords.lng], { icon: vendorIcon }).addTo(map);
      L.marker([LAXMI_TEXTILES_LOCATION.lat, LAXMI_TEXTILES_LOCATION.lng], { icon: shopIcon }).addTo(map);

      // Route Polyline
      const fullRoute: [number, number][] = [
        [vendorCoords.lat, vendorCoords.lng],
        [LAXMI_TEXTILES_LOCATION.lat, LAXMI_TEXTILES_LOCATION.lng],
      ];

      const polyline = L.polyline(fullRoute, {
        color: '#d96528',
        weight: 4,
        opacity: 0.4,
        dashArray: '6, 8',
      }).addTo(map);

      const startOrigin: [number, number] = isReverse
        ? [LAXMI_TEXTILES_LOCATION.lat, LAXMI_TEXTILES_LOCATION.lng]
        : [vendorCoords.lat, vendorCoords.lng];

      const activeRoute: [number, number][] = [startOrigin, [truckCoords.lat, truckCoords.lng]];

      const activePolyline = L.polyline(activeRoute, {
        color: isReverse ? '#b9381e' : '#2d6a3f',
        weight: 5,
        opacity: 0.9,
      }).addTo(map);

      const truckMarker = L.marker([truckCoords.lat, truckCoords.lng], { icon: truckIcon }).addTo(map);

      // Fit map bounds with padding
      const bounds = L.latLngBounds([
        [vendorCoords.lat, vendorCoords.lng],
        [LAXMI_TEXTILES_LOCATION.lat, LAXMI_TEXTILES_LOCATION.lng],
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });

      mapInstanceRef.current = map;
      truckMarkerRef.current = truckMarker;
      polylineRef.current = polyline;
      activePolylineRef.current = activePolyline;
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [vendorCoords.lat, vendorCoords.lng, isReverse]);

  // Update truck position reactively
  useEffect(() => {
    if (truckMarkerRef.current) {
      truckMarkerRef.current.setLatLng([truckCoords.lat, truckCoords.lng]);
    }
    if (activePolylineRef.current) {
      const startOrigin: [number, number] = isReverse
        ? [LAXMI_TEXTILES_LOCATION.lat, LAXMI_TEXTILES_LOCATION.lng]
        : [vendorCoords.lat, vendorCoords.lng];

      activePolylineRef.current.setLatLngs([startOrigin, [truckCoords.lat, truckCoords.lng]]);
    }
  }, [truckCoords.lat, truckCoords.lng, vendorCoords.lat, vendorCoords.lng, isReverse]);

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden border-2 border-[#e8dfd1] shadow-inner bg-[#f5eee3]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Status Card Overlay */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto z-10 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#e8dfd1] shadow-lg flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
            isReverse ? 'bg-[#fdf0ed] text-[#b9381e]' : 'bg-[#faeedf] text-[#d96528]'
          }`}
        >
          {isReverse ? '🔄' : '🚚'}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                isReverse ? 'bg-[#b9381e]' : 'bg-[#2d6a3f]'
              }`}
            />
            <div className="text-xs font-black text-[#1c1917] truncate">{statusText}</div>
          </div>
          <div className="text-[11px] text-[#78716c] truncate">
            {isReverse ? (
              <span>
                Return: <strong>Laxmi Textiles</strong> ➔ <strong>{vendorName}</strong>
              </span>
            ) : (
              <span>
                Delivery: <strong>{vendorName}</strong> ➔ <strong>Laxmi Textiles</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#e8dfd1] shadow-lg space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-[#78716c]">{isReverse ? 'Return Progress:' : 'Transit Progress:'}</span>
          <span className={`${isReverse ? 'text-[#b9381e]' : 'text-[#d96528]'} font-black`}>
            {Math.round(progress * 100)}% {isReverse ? 'Reverse Trip Completed' : 'Journey Completed'}
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#f5eee3] rounded-full overflow-hidden border border-[#e8dfd1]">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isReverse
                ? 'bg-gradient-to-r from-[#d96528] to-[#b9381e]'
                : 'bg-gradient-to-r from-[#d96528] to-[#2d6a3f]'
            }`}
            style={{ width: `${Math.max(4, Math.round(progress * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
