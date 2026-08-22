'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  StockMovement,
  SaleTransaction,
  SaleItem,
  InventoryStats,
  ActiveTab,
  Category,
  PurchaseOrder,
  PurchaseOrderItem,
  Vendor,
  VendorItem,
  ReturnRequest,
  Language,
  ThemeMode,
} from '@/src/types';
import { StorageService } from '@/src/lib/storage';
import { TRANSLATIONS, Translations } from '@/src/lib/translations';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface StockInPayload {
  productId?: string;
  isNewProduct?: boolean;
  name?: string;
  category?: Category;
  sku?: string;
  color?: string;
  fabric?: string;
  sizeOrLength?: string;
  quantity: number;
  costPrice: number;
  sellingPrice?: number;
  supplier: string;
  rackLocation: string;
  notes?: string;
  handledBy?: string;
}

interface InventoryContextType {
  products: Product[];
  movements: StockMovement[];
  transactions: SaleTransaction[];
  purchaseOrders: PurchaseOrder[];
  stats: InventoryStats;
  isLoading: boolean;
  
  // Navigation state (Persisted across reloads)
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // i18n Language Support (Persisted across reloads)
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  
  // Dark/Light Theme Mode (Persisted across reloads)
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  
  // Active Tracking Order ID for Modal or view
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  
  // Filters & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  
  // Core Actions
  recordStockIn: (payload: StockInPayload) => { success: boolean; message: string };
  recordSale: (
    items: { productId: string; quantity: number }[],
    paymentMethod: 'CASH' | 'UPI' | 'CARD',
    customerName?: string,
    customerPhone?: string
  ) => { success: boolean; transaction?: SaleTransaction; error?: string };
  quickAdjustStock: (productId: string, newQuantity: number, reason: string) => void;
  updateProduct: (updated: Product) => void;
  deleteProduct: (productId: string) => void;
  resetToSampleData: () => void;
  
  // B2B Vendor Procurement & Tracking
  createPurchaseOrder: (
    vendor: Vendor,
    selectedItems: { vendorItem: VendorItem; quantity: number }[]
  ) => PurchaseOrder;
  completeStockInFromOrder: (orderId: string) => { success: boolean; message: string };
  requestReturnOrder: (orderId: string, defectiveQty: number, reason: string) => { success: boolean; message: string };
  confirmReturnLoaded: (orderId: string) => void;
  getPurchaseOrderById: (orderIdOrHash: string) => PurchaseOrder | undefined;
  
  // Low stock / Reorder helpers
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  slowMovingProducts: Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const TRUCK_NUMBERS = ['TN 21 AX 8842', 'TN 33 AB 4920', 'TN 28 CZ 1109', 'TN 38 BK 9044', 'TN 59 DF 3281'];
const DRIVER_NAMES = ['Ramu Express Logistics', 'Murugan Fast Cargo', 'Selvam Highway Transport', 'Kannan Weaves Carrier'];
const DRIVER_PHONES = ['+91 98421 99310', '+91 94432 55190', '+91 98433 12480', '+91 99420 88319'];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTabState] = useState<ActiveTab>('overview');
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<ThemeMode>('light');

  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Load from local storage on mount (Persisted state restoration)
  useEffect(() => {
    try {
      const p = StorageService.getProducts();
      const m = StorageService.getMovements();
      const t = StorageService.getTransactions();
      const o = StorageService.getPurchaseOrders();
      setProducts(p);
      setMovements(m);
      setTransactions(t);
      setPurchaseOrders(o);

      // Restore active tab
      const savedTab = localStorage.getItem('laxmi_active_tab') as ActiveTab;
      if (
        savedTab &&
        ['overview', 'stock-in', 'vendor-orders', 'sales', 'inventory', 'low-stock', 'analytics'].includes(
          savedTab
        )
      ) {
        setActiveTabState(savedTab);
      }

      // Restore language
      const savedLang = localStorage.getItem('laxmi_language') as Language;
      if (savedLang && ['en', 'ta', 'hi'].includes(savedLang)) {
        setLanguageState(savedLang);
      }

      // Restore theme
      const savedTheme = localStorage.getItem('laxmi_theme') as ThemeMode;
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        setThemeState(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (e) {
      console.error('Failed loading storage data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('laxmi_active_tab', tab);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('laxmi_language', lang);
    }
    const names = { en: 'English', ta: 'தமிழ் (Tamil)', hi: 'हिन्दी (Hindi)' };
    toast.success(`Language set to ${names[lang]}`);
  }, []);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem('laxmi_theme', t);
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  }, [theme, setTheme]);

  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS.en, [language]);

  const updateProductsState = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    StorageService.saveProducts(newProducts);
  }, []);

  const updateMovementsState = useCallback((newMovements: StockMovement[]) => {
    setMovements(newMovements);
    StorageService.saveMovements(newMovements);
  }, []);

  const updateTransactionsState = useCallback((newTransactions: SaleTransaction[]) => {
    setTransactions(newTransactions);
    StorageService.saveTransactions(newTransactions);
  }, []);

  const updatePurchaseOrdersState = useCallback((newOrders: PurchaseOrder[]) => {
    setPurchaseOrders(newOrders);
    StorageService.savePurchaseOrders(newOrders);
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    return StorageService.calculateStats(products, transactions, purchaseOrders);
  }, [products, transactions, purchaseOrders]);

  // Filtered product lists
  const outOfStockProducts = useMemo(() => {
    return products.filter((p) => p.currentStock <= 0);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.currentStock > 0 && p.currentStock <= p.lowStockThreshold);
  }, [products]);

  const slowMovingProducts = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return products.filter((p) => {
      if (p.currentStock <= 5) return false;
      const isLowSales = p.totalUnitsSold <= 5;
      const isOldSale = p.lastSoldDate ? new Date(p.lastSoldDate).getTime() < thirtyDaysAgo : true;
      return isLowSales || isOldSale;
    });
  }, [products]);

  // ACTION: Record Stock In
  const recordStockIn = useCallback(
    (payload: StockInPayload) => {
      const now = new Date().toISOString();
      let targetProduct: Product | undefined;
      let updatedProducts = [...products];

      if (payload.isNewProduct || !payload.productId) {
        const newSku =
          payload.sku ||
          `${payload.category?.substring(0, 3).toUpperCase() || 'ITM'}-${Date.now().toString().slice(-4)}`;
        
        const newProduct: Product = {
          id: `prod-${Date.now()}`,
          sku: newSku,
          name: payload.name || 'Untitled Textile Item',
          category: payload.category || 'Sarees',
          color: payload.color || 'Standard',
          sizeOrLength: payload.sizeOrLength || 'Free Size',
          fabric: payload.fabric || 'Cotton / Silk Blend',
          currentStock: payload.quantity,
          lowStockThreshold: 10,
          costPrice: payload.costPrice,
          sellingPrice: payload.sellingPrice || Math.round(payload.costPrice * 1.5),
          supplier: payload.supplier,
          rackLocation: payload.rackLocation || 'Front Showcase',
          totalUnitsReceived: payload.quantity,
          totalUnitsSold: 0,
          lastRestockedDate: now,
          createdAt: now,
        };

        updatedProducts = [newProduct, ...updatedProducts];
        targetProduct = newProduct;
      } else {
        const idx = updatedProducts.findIndex((p) => p.id === payload.productId);
        if (idx === -1) {
          return { success: false, message: 'Product not found' };
        }

        const existing = updatedProducts[idx];
        const newStock = existing.currentStock + payload.quantity;
        const updated: Product = {
          ...existing,
          currentStock: newStock,
          totalUnitsReceived: existing.totalUnitsReceived + payload.quantity,
          costPrice: payload.costPrice || existing.costPrice,
          sellingPrice: payload.sellingPrice || existing.sellingPrice,
          supplier: payload.supplier || existing.supplier,
          rackLocation: payload.rackLocation || existing.rackLocation,
          lastRestockedDate: now,
        };

        updatedProducts[idx] = updated;
        targetProduct = updated;
      }

      const newMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        productId: targetProduct.id,
        productName: targetProduct.name,
        type: 'STOCK_IN',
        quantity: payload.quantity,
        previousStock: targetProduct.currentStock - payload.quantity,
        newStock: targetProduct.currentStock,
        unitPrice: payload.costPrice,
        totalAmount: payload.quantity * payload.costPrice,
        date: now,
        referenceNotes: payload.notes || `Received from ${payload.supplier}`,
        handledBy: payload.handledBy || 'Laxmi Store Staff',
      };

      updateProductsState(updatedProducts);
      updateMovementsState([newMovement, ...movements]);

      toast.success(`➕ Stock In: +${payload.quantity} ${targetProduct.name}`, {
        description: `Available: ${targetProduct.currentStock} pieces at ${targetProduct.rackLocation}`,
      });

      return { success: true, message: 'Stock received successfully' };
    },
    [products, movements, updateProductsState, updateMovementsState]
  );

  // ACTION: Record Sale
  const recordSale = useCallback(
    (
      items: { productId: string; quantity: number }[],
      paymentMethod: 'CASH' | 'UPI' | 'CARD',
      customerName?: string,
      customerPhone?: string
    ) => {
      if (items.length === 0) {
        return { success: false, error: 'No items in cart' };
      }

      for (const item of items) {
        const prod = products.find((p) => p.id === item.productId);
        if (!prod) {
          return { success: false, error: `Product not found: ${item.productId}` };
        }
        if (prod.currentStock < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for "${prod.name}". Available: ${prod.currentStock}, Requested: ${item.quantity}`,
          };
        }
      }

      const now = new Date().toISOString();
      const updatedProducts = [...products];
      const newMovements: StockMovement[] = [];
      const saleItems: SaleItem[] = [];
      let totalAmount = 0;
      let totalCount = 0;

      for (const item of items) {
        const idx = updatedProducts.findIndex((p) => p.id === item.productId);
        const prod = updatedProducts[idx];

        const prevStock = prod.currentStock;
        const newStock = prevStock - item.quantity;

        const updated: Product = {
          ...prod,
          currentStock: newStock,
          totalUnitsSold: prod.totalUnitsSold + item.quantity,
          lastSoldDate: now,
        };

        updatedProducts[idx] = updated;

        const itemTotal = prod.sellingPrice * item.quantity;
        totalAmount += itemTotal;
        totalCount += item.quantity;

        saleItems.push({
          product: updated,
          quantity: item.quantity,
          unitPrice: prod.sellingPrice,
          total: itemTotal,
        });

        newMovements.push({
          id: `mov-${Date.now()}-${item.productId}`,
          productId: prod.id,
          productName: prod.name,
          type: 'SALE',
          quantity: item.quantity,
          previousStock: prevStock,
          newStock: newStock,
          unitPrice: prod.sellingPrice,
          totalAmount: itemTotal,
          date: now,
          referenceNotes: `Counter Sale (${paymentMethod})`,
          handledBy: 'Laxmi Billing Counter',
        });
      }

      const invoiceNum = `LT-${1050 + transactions.length}`;
      const newTransaction: SaleTransaction = {
        id: `txn-${Date.now()}`,
        invoiceNumber: invoiceNum,
        items: saleItems,
        totalAmount,
        totalItemsCount: totalCount,
        paymentMethod,
        customerName: customerName || 'Walk-in Customer',
        customerPhone,
        date: now,
      };

      updateProductsState(updatedProducts);
      updateMovementsState([...newMovements, ...movements]);
      updateTransactionsState([newTransaction, ...transactions]);

      try {
        confetti({
          particleCount: 75,
          spread: 55,
          origin: { y: 0.7 },
        });
      } catch {}

      toast.success(`🛒 Sale Recorded! Bill #${invoiceNum}`, {
        description: `${totalCount} piece(s) sold for ₹${totalAmount.toLocaleString('en-IN')}. Stock updated automatically!`,
      });

      return { success: true, transaction: newTransaction };
    },
    [products, movements, transactions, updateProductsState, updateMovementsState, updateTransactionsState]
  );

  // ACTION: Create Purchase Order (B2B Vendor Order)
  const createPurchaseOrder = useCallback(
    (vendor: Vendor, selectedItems: { vendorItem: VendorItem; quantity: number }[]) => {
      const orderNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = `ORD-${orderNum}`;
      const randomIdx = Math.floor(Math.random() * TRUCK_NUMBERS.length);

      const items: PurchaseOrderItem[] = selectedItems.map(({ vendorItem, quantity }) => ({
        vendorItemId: vendorItem.id,
        name: vendorItem.name,
        category: vendorItem.category,
        fabric: vendorItem.fabric,
        color: vendorItem.color,
        quantity,
        unitPrice: vendorItem.unitPrice,
        retailEstimate: vendorItem.retailEstimate,
        total: vendorItem.unitPrice * quantity,
        targetRack: vendorItem.defaultRack,
      }));

      const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

      const newOrder: PurchaseOrder = {
        id: orderId,
        trackingHash: orderId,
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorCity: `${vendor.city}, ${vendor.state}`,
        vendorCoordinates: vendor.coordinates,
        items,
        totalAmount,
        totalItems,
        createdAt: Date.now(),
        status: 'ORDER_PLACED',
        truckNumber: TRUCK_NUMBERS[randomIdx],
        driverName: DRIVER_NAMES[randomIdx],
        driverPhone: DRIVER_PHONES[randomIdx],
      };

      const updatedOrders = [newOrder, ...purchaseOrders];
      updatePurchaseOrdersState(updatedOrders);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}

      toast.success(`🚚 Order #${orderId} Placed with ${vendor.name}!`, {
        description: `Tracking link generated for ${totalItems} pieces. Vehicle assigned.`,
      });

      return newOrder;
    },
    [purchaseOrders, updatePurchaseOrdersState]
  );

  // ACTION: Complete Stock In from Delivered Purchase Order
  const completeStockInFromOrder = useCallback(
    (orderId: string) => {
      const orderIdx = purchaseOrders.findIndex((o) => o.id === orderId || o.trackingHash === orderId);
      if (orderIdx === -1) {
        return { success: false, message: 'Order not found' };
      }

      const order = purchaseOrders[orderIdx];
      if (order.status === 'STOCKED') {
        return { success: false, message: 'Order has already been stocked into inventory' };
      }

      const now = new Date().toISOString();
      let updatedProducts = [...products];
      const newMovements: StockMovement[] = [];

      for (const item of order.items) {
        const existingIdx = updatedProducts.findIndex(
          (p) => p.name.toLowerCase() === item.name.toLowerCase() || p.supplier === order.vendorName
        );

        if (existingIdx !== -1) {
          const existing = updatedProducts[existingIdx];
          const newStock = existing.currentStock + item.quantity;
          const updated: Product = {
            ...existing,
            currentStock: newStock,
            totalUnitsReceived: existing.totalUnitsReceived + item.quantity,
            costPrice: item.unitPrice,
            sellingPrice: item.retailEstimate || existing.sellingPrice,
            lastRestockedDate: now,
          };
          updatedProducts[existingIdx] = updated;

          newMovements.push({
            id: `mov-${Date.now()}-${item.vendorItemId}`,
            productId: existing.id,
            productName: existing.name,
            type: 'STOCK_IN',
            quantity: item.quantity,
            previousStock: existing.currentStock,
            newStock: newStock,
            unitPrice: item.unitPrice,
            totalAmount: item.total,
            date: now,
            referenceNotes: `Delivery Received from ${order.vendorName} (Order #${order.id})`,
            handledBy: 'Laxmi Inward Desk',
          });
        } else {
          const newSku = `${item.category.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
          const newProduct: Product = {
            id: `prod-${Date.now()}-${item.vendorItemId}`,
            sku: newSku,
            name: item.name,
            category: item.category,
            color: item.color,
            fabric: item.fabric,
            sizeOrLength: 'Standard',
            currentStock: item.quantity,
            lowStockThreshold: 10,
            costPrice: item.unitPrice,
            sellingPrice: item.retailEstimate,
            supplier: order.vendorName,
            rackLocation: item.targetRack,
            totalUnitsReceived: item.quantity,
            totalUnitsSold: 0,
            lastRestockedDate: now,
            createdAt: now,
          };

          updatedProducts = [newProduct, ...updatedProducts];

          newMovements.push({
            id: `mov-${Date.now()}-${item.vendorItemId}`,
            productId: newProduct.id,
            productName: newProduct.name,
            type: 'STOCK_IN',
            quantity: item.quantity,
            previousStock: 0,
            newStock: item.quantity,
            unitPrice: item.unitPrice,
            totalAmount: item.total,
            date: now,
            referenceNotes: `First Batch Delivery from ${order.vendorName} (Order #${order.id})`,
            handledBy: 'Laxmi Inward Desk',
          });
        }
      }

      const updatedOrder: PurchaseOrder = {
        ...order,
        status: 'STOCKED',
        stockInCompletedAt: now,
      };

      const updatedOrders = [...purchaseOrders];
      updatedOrders[orderIdx] = updatedOrder;

      updateProductsState(updatedProducts);
      updateMovementsState([...newMovements, ...movements]);
      updatePurchaseOrdersState(updatedOrders);

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      toast.success(`📦 Stock In Completed for Order #${order.id}!`, {
        description: `Added +${order.totalItems} pieces directly to your shop shelves.`,
      });

      return { success: true, message: 'Stock added successfully' };
    },
    [purchaseOrders, products, movements, updateProductsState, updateMovementsState, updatePurchaseOrdersState]
  );

  // ACTION: Request Return of Defective Stock to Vendor
  const requestReturnOrder = useCallback(
    (orderId: string, defectiveQty: number, reason: string) => {
      const orderIdx = purchaseOrders.findIndex((o) => o.id === orderId || o.trackingHash === orderId);
      if (orderIdx === -1) {
        return { success: false, message: 'Order not found' };
      }

      const order = purchaseOrders[orderIdx];
      const now = new Date().toISOString();
      const primaryItem = order.items[0];

      // Update shop product stock (deduct defective pieces)
      let updatedProducts = [...products];
      if (primaryItem) {
        const prodIdx = updatedProducts.findIndex(
          (p) => p.name.toLowerCase() === primaryItem.name.toLowerCase() || p.supplier === order.vendorName
        );
        if (prodIdx !== -1) {
          const prod = updatedProducts[prodIdx];
          const newStock = Math.max(0, prod.currentStock - defectiveQty);
          updatedProducts[prodIdx] = {
            ...prod,
            currentStock: newStock,
          };

          const movement: StockMovement = {
            id: `mov-${Date.now()}-ret`,
            productId: prod.id,
            productName: prod.name,
            type: 'RETURN',
            quantity: defectiveQty,
            previousStock: prod.currentStock,
            newStock: newStock,
            unitPrice: primaryItem.unitPrice,
            totalAmount: defectiveQty * primaryItem.unitPrice,
            date: now,
            referenceNotes: `Defective Return to ${order.vendorName}: ${reason}`,
            handledBy: 'Laxmi Quality Audit',
          };
          updateMovementsState([movement, ...movements]);
        }
      }

      const returnRequest: ReturnRequest = {
        quantity: defectiveQty,
        reason,
        requestedAt: Date.now(),
        status: 'REQUESTED',
        truckNumber: 'TN 28 CZ 1109 (Return Vehicle)',
        driverName: 'Murugan Reverse Logistics',
        driverPhone: '+91 94432 55190',
      };

      const updatedOrder: PurchaseOrder = {
        ...order,
        returnRequest,
      };

      const updatedOrders = [...purchaseOrders];
      updatedOrders[orderIdx] = updatedOrder;

      updateProductsState(updatedProducts);
      updatePurchaseOrdersState(updatedOrders);

      toast.info(`🔄 Defective Return Initiated (${defectiveQty} pcs)`, {
        description: `Vendor accepted return request. Return pickup vehicle assigned.`,
      });

      return { success: true, message: 'Return request placed' };
    },
    [purchaseOrders, products, movements, updateProductsState, updateMovementsState, updatePurchaseOrdersState]
  );

  const confirmReturnLoaded = useCallback(
    (orderId: string) => {
      const orderIdx = purchaseOrders.findIndex((o) => o.id === orderId || o.trackingHash === orderId);
      if (orderIdx === -1) return;

      const order = purchaseOrders[orderIdx];
      if (!order.returnRequest) return;

      const updatedOrder: PurchaseOrder = {
        ...order,
        returnRequest: {
          ...order.returnRequest,
          status: 'RETURN_IN_TRANSIT',
        },
      };

      const updatedOrders = [...purchaseOrders];
      updatedOrders[orderIdx] = updatedOrder;
      updatePurchaseOrdersState(updatedOrders);

      toast.success('🚚 Defective Items Loaded onto Truck!', {
        description: 'Reverse transit to vendor mill started.',
      });
    },
    [purchaseOrders, updatePurchaseOrdersState]
  );

  const getPurchaseOrderById = useCallback(
    (orderIdOrHash: string) => {
      return purchaseOrders.find(
        (o) => o.id.toLowerCase() === orderIdOrHash.toLowerCase() || o.trackingHash.toLowerCase() === orderIdOrHash.toLowerCase()
      );
    },
    [purchaseOrders]
  );

  // ACTION: Quick Adjust
  const quickAdjustStock = useCallback(
    (productId: string, newQuantity: number, reason: string) => {
      const idx = products.findIndex((p) => p.id === productId);
      if (idx === -1) return;

      const prod = products[idx];
      const prevStock = prod.currentStock;
      const diff = newQuantity - prevStock;
      const now = new Date().toISOString();

      const updated: Product = {
        ...prod,
        currentStock: newQuantity,
      };

      const updatedProducts = [...products];
      updatedProducts[idx] = updated;

      const movement: StockMovement = {
        id: `mov-${Date.now()}`,
        productId: prod.id,
        productName: prod.name,
        type: 'ADJUSTMENT',
        quantity: Math.abs(diff),
        previousStock: prevStock,
        newStock: newQuantity,
        unitPrice: prod.costPrice,
        totalAmount: Math.abs(diff) * prod.costPrice,
        date: now,
        referenceNotes: `Manual Physical Count: ${reason}`,
        handledBy: 'Laxmi Store Count',
      };

      updateProductsState(updatedProducts);
      updateMovementsState([movement, ...movements]);

      toast.info(`Stock adjusted for ${prod.name}: ${prevStock} → ${newQuantity}`, {
        description: `Reason: ${reason}`,
      });
    },
    [products, movements, updateProductsState, updateMovementsState]
  );

  // ACTION: Update Product
  const updateProduct = useCallback(
    (updated: Product) => {
      const updatedProducts = products.map((p) => (p.id === updated.id ? updated : p));
      updateProductsState(updatedProducts);
      toast.success(`Updated details for ${updated.name}`);
    },
    [products, updateProductsState]
  );

  // ACTION: Delete Product
  const deleteProduct = useCallback(
    (productId: string) => {
      const updatedProducts = products.filter((p) => p.id !== productId);
      updateProductsState(updatedProducts);
      toast.error('Product removed from catalog');
    },
    [products, updateProductsState]
  );

  // ACTION: Reset to Sample Data
  const resetToSampleData = useCallback(() => {
    const { products: p, movements: m, transactions: t, purchaseOrders: o } = StorageService.resetToSampleData();
    setProducts(p);
    setMovements(m);
    setTransactions(t);
    setPurchaseOrders(o);
    toast.success('Sample Inventory Data Restored', {
      description: 'Loaded default catalog with Sarees, Shirts, Dhotis, Uniforms & analytics data.',
    });
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        products,
        movements,
        transactions,
        purchaseOrders,
        stats,
        isLoading,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        toggleTheme,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        recordStockIn,
        recordSale,
        quickAdjustStock,
        updateProduct,
        deleteProduct,
        resetToSampleData,
        createPurchaseOrder,
        completeStockInFromOrder,
        requestReturnOrder,
        confirmReturnLoaded,
        getPurchaseOrderById,
        lowStockProducts,
        outOfStockProducts,
        slowMovingProducts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
