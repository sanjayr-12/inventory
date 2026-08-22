'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInventory } from '@/src/context/InventoryContext';
import { ActiveTab, Language } from '@/src/types';
import {
  PackagePlus,
  ShoppingCart,
  Boxes,
  AlertTriangle,
  BarChart3,
  RotateCcw,
  Sparkles,
  Truck,
  Sun,
  Moon,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Logo } from '@/src/components/ui/Logo';
import { formatCurrency, formatNumber } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES: { code: Language; label: string; name: string; flag: string }[] = [
  { code: 'en', label: 'English', name: 'English', flag: '🇬🇧' },
  { code: 'ta', label: 'தமிழ் (Tamil)', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', label: 'हिन्दी (Hindi)', name: 'हिन्दी', flag: '🇮🇳' },
];

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    stats,
    resetToSampleData,
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
  } = useInventory();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const navItems: {
    id: ActiveTab;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    badge?: number;
    isAlert?: boolean;
  }[] = [
    {
      id: 'overview',
      label: t.home,
      shortLabel: t.home.split(' ')[0],
      icon: <Logo size={16} className="shrink-0" />,
    },
    {
      id: 'stock-in',
      label: t.stockIn,
      shortLabel: t.stockIn.split(' ')[0],
      icon: <PackagePlus className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'vendor-orders',
      label: t.vendorOrders,
      shortLabel: 'Track 🚚',
      icon: <Truck className="w-4 h-4 shrink-0" />,
      badge: stats.activeInwardOrdersCount > 0 ? stats.activeInwardOrdersCount : undefined,
    },
    {
      id: 'sales',
      label: t.salesPOS,
      shortLabel: 'POS',
      icon: <ShoppingCart className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'inventory',
      label: t.whatsInShop,
      shortLabel: t.whatsInShop.split(' ')[0],
      icon: <Boxes className="w-4 h-4 shrink-0" />,
      badge: stats.totalUniqueProducts,
    },
    {
      id: 'low-stock',
      label: t.lowStockAlerts,
      shortLabel: 'Alerts',
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
      badge: stats.outOfStockCount + stats.lowStockCount,
      isAlert: stats.outOfStockCount + stats.lowStockCount > 0,
    },
    {
      id: 'analytics',
      label: t.insights,
      shortLabel: 'Insights',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <header className="bg-white dark:bg-[#201c18] border-b border-[#e8dfd1] dark:border-[#38322b] sticky top-0 z-40 shadow-2xs transition-colors">
      {/* Top Banner / Store Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none min-w-0"
            onClick={() => setActiveTab('overview')}
          >
            <Logo size={38} className="shrink-0 shadow-2xs rounded-xl" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-[#1c1917] dark:text-[#f5eee3] truncate">
                  LAXMI <span className="text-[#d96528]">TEXTILES</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#faeedf] dark:bg-[#3d2415] text-[#c45418] dark:text-[#ea7637] border border-[#eed6c0] dark:border-[#52301c] shrink-0">
                  <Sparkles className="w-2.5 h-2.5" /> {t.liveStock}
                </span>
              </div>
              <p className="text-[11px] text-[#78716c] dark:text-[#a89f91] font-medium hidden sm:block truncate">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <div className="bg-[#fbf8f2] dark:bg-[#28231e] px-3 py-1.5 rounded-xl border border-[#e8dfd1] dark:border-[#3d3731] flex items-center gap-2">
              <span className="text-[#78716c] dark:text-[#a89f91]">{t.inShopNow}</span>
              <span className="font-extrabold text-[#1c1917] dark:text-[#f5eee3]">
                {formatNumber(stats.totalUnitsInStock)} {t.pieces}
              </span>
            </div>

            <div className="bg-[#fbf8f2] dark:bg-[#28231e] px-3 py-1.5 rounded-xl border border-[#e8dfd1] dark:border-[#3d3731] flex items-center gap-2">
              <span className="text-[#78716c] dark:text-[#a89f91]">{t.todaysSales}</span>
              <span className="font-extrabold text-[#2d6a3f] dark:text-[#4ade80]">
                {formatCurrency(stats.todaysRevenue)}
              </span>
            </div>

            {stats.activeInwardOrdersCount > 0 && (
              <div
                onClick={() => setActiveTab('vendor-orders')}
                className="bg-[#faeedf] dark:bg-[#3d2415] px-3 py-1.5 rounded-xl border border-[#eed6c0] dark:border-[#52301c] flex items-center gap-1.5 cursor-pointer hover:bg-[#f6dfc7] transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-[#d96528] animate-bounce" />
                <span className="font-bold text-[#c45418] dark:text-[#ea7637]">
                  {stats.activeInwardOrdersCount} {t.trucksInTransit}
                </span>
              </div>
            )}
          </div>

          {/* Right Action Tools: Language Selector, Dark Mode Toggle & Reset Demo */}
          <div className="flex items-center gap-2">
            {/* Sleek Custom Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="h-10 px-3 py-2 rounded-xl bg-[#f5eee3] dark:bg-[#2c2620] hover:bg-[#ede3d3] dark:hover:bg-[#383129] border border-[#e4d8c5] dark:border-[#3d3731] flex items-center gap-1.5 text-xs font-bold text-[#1c1917] dark:text-[#f5eee3] cursor-pointer shadow-2xs transition-all select-none whitespace-nowrap"
                title="Change Language / மொழி மாற்றவும்"
              >
                <span className="text-sm leading-none">{currentLang.flag}</span>
                <span className="font-extrabold">{currentLang.name}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#8c827a] dark:text-[#a89f91] transition-transform duration-200 ${
                    isLangOpen ? 'rotate-180 text-[#d96528]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#241f1a] border border-[#e8dfd1] dark:border-[#38322b] rounded-2xl shadow-xl z-50 p-1.5 space-y-1"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-black uppercase text-[#8c827a] dark:text-[#a89f91] tracking-wider">
                      Select Language
                    </div>
                    {LANGUAGES.map((l) => {
                      const isSel = l.code === language;
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            setLanguage(l.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                            isSel
                              ? 'bg-[#faeedf] dark:bg-[#3d2415] text-[#c45418] dark:text-[#ea7637]'
                              : 'hover:bg-[#fbf8f2] dark:hover:bg-[#2e2721] text-[#1c1917] dark:text-[#f5eee3]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{l.flag}</span>
                            <span>{l.label}</span>
                          </div>
                          {isSel && <Check className="w-3.5 h-3.5 text-[#d96528]" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#f5eee3] dark:bg-[#2c2620] hover:bg-[#ede3d3] dark:hover:bg-[#383129] text-[#1c1917] dark:text-[#f5eee3] border border-[#e4d8c5] dark:border-[#3d3731] transition-all cursor-pointer shadow-2xs shrink-0"
              title={theme === 'dark' ? t.lightMode : t.darkMode}
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#ea7637]" />
              ) : (
                <Moon className="w-4 h-4 text-[#57534e]" />
              )}
            </button>

            {/* Reset Data */}
            <button
              onClick={resetToSampleData}
              className="h-10 px-2.5 py-2 text-xs font-semibold rounded-xl bg-[#f5eee3] dark:bg-[#2c2620] hover:bg-[#ede3d3] dark:hover:bg-[#383129] text-[#57534e] dark:text-[#a89f91] hover:text-[#1c1917] dark:hover:text-[#f5eee3] border border-[#e4d8c5] dark:border-[#3d3731] transition-all cursor-pointer shadow-2xs shrink-0 inline-flex items-center gap-1.5"
              title="Reload sample store catalog"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t.resetData}</span>
            </button>
          </div>
        </div>

        {/* Mobile Quick Stats Strip */}
        <div className="flex lg:hidden items-center justify-between mt-2 pt-2 border-t border-[#f0e6d8] dark:border-[#38322b] text-[11px] text-[#57534e] dark:text-[#a89f91]">
          <div>
            Stock: <strong className="text-[#1c1917] dark:text-[#f5eee3]">{stats.totalUnitsInStock} pcs</strong>
          </div>
          <div>
            Today: <strong className="text-[#2d6a3f] dark:text-[#4ade80]">{formatCurrency(stats.todaysRevenue)}</strong>
          </div>
          {stats.activeInwardOrdersCount > 0 ? (
            <div
              onClick={() => setActiveTab('vendor-orders')}
              className="text-[#c45418] dark:text-[#ea7637] font-bold cursor-pointer flex items-center gap-1"
            >
              <Truck className="w-3 h-3 text-[#d96528]" />
              <span>{stats.activeInwardOrdersCount} Delivery</span>
            </div>
          ) : (
            <div>
              Reorder: <strong className="text-[#b9381e]">{stats.outOfStockCount} {t.emptyItems}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Touch-Friendly Horizontal Navigation Bar */}
      <div className="border-t border-[#e8dfd1] dark:border-[#38322b] bg-[#fbf8f2]/90 dark:bg-[#1f1b17]/90 backdrop-blur-xs">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer select-none shrink-0 ${
                    isActive
                      ? 'bg-[#d96528] text-white shadow-xs'
                      : 'text-[#57534e] dark:text-[#a89f91] hover:text-[#1c1917] dark:hover:text-[#f5eee3] hover:bg-[#f5eee3] dark:hover:bg-[#2b251f]'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.shortLabel}</span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-0.5 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border leading-tight ${
                        isActive
                          ? 'bg-white text-[#d96528] border-white/40'
                          : item.isAlert
                          ? 'bg-[#fdf0ed] dark:bg-[#3d1a15] text-[#b9381e] dark:text-[#f87171] border-[#f8d0c8] dark:border-[#52221b]'
                          : 'bg-[#f5eee3] dark:bg-[#2b251f] text-[#57534e] dark:text-[#d6cec2] border-[#e4d8c5] dark:border-[#3d3731]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
