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
} from '@/src/types';
import { StorageService } from '@/src/lib/storage';
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
  stats: InventoryStats;
  isLoading: boolean;
  
  // Navigation state
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
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
  
  // Low stock / Reorder helpers
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  slowMovingProducts: Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  // Load from local storage on mount
  useEffect(() => {
    try {
      const p = StorageService.getProducts();
      const m = StorageService.getMovements();
      const t = StorageService.getTransactions();
      setProducts(p);
      setMovements(m);
      setTransactions(t);
    } catch (e) {
      console.error('Failed loading storage data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to storage on update
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

  // Stats calculation
  const stats = useMemo(() => {
    return StorageService.calculateStats(products, transactions);
  }, [products, transactions]);

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
        // Create new product
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
        // Restock existing product
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

      // Create Movement record
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
        handledBy: payload.handledBy || 'Lakshmi Store Staff',
      };

      updateProductsState(updatedProducts);
      updateMovementsState([newMovement, ...movements]);

      toast.success(`➕ Stock In Recorded: +${payload.quantity} units of ${targetProduct.name}`, {
        description: `New Available Stock: ${targetProduct.currentStock} pieces at ${targetProduct.rackLocation}`,
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

      // Validate stock availability
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
          handledBy: 'Lakshmi Billing Counter',
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

      // Fire confetti celebration on successful sale!
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}

      toast.success(`🛒 Sale Completed! Bill #${invoiceNum}`, {
        description: `${totalCount} item(s) sold for ₹${totalAmount.toLocaleString('en-IN')}. Stock updated automatically!`,
      });

      return { success: true, transaction: newTransaction };
    },
    [products, movements, transactions, updateProductsState, updateMovementsState, updateTransactionsState]
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
        referenceNotes: `Manual Audit Adjustment: ${reason}`,
        handledBy: 'Owner Physical Audit',
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
    const { products: p, movements: m, transactions: t } = StorageService.resetToSampleData();
    setProducts(p);
    setMovements(m);
    setTransactions(t);
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
        stats,
        isLoading,
        activeTab,
        setActiveTab,
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
