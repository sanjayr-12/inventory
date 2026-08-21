export type Category =
  | 'Sarees'
  | "Men's Wear"
  | "Women's Wear"
  | 'School Uniforms'
  | 'Kids Wear'
  | 'Dhotis & Traditional'
  | 'Fabrics & Materials';

export type StockStatus = 'out_of_stock' | 'low_stock' | 'healthy_stock' | 'overstocked';

export type MovementType = 'STOCK_IN' | 'SALE' | 'ADJUSTMENT' | 'RETURN';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Category;
  color?: string;
  sizeOrLength?: string; // e.g. "6.2m", "L", "38", "Free Size"
  fabric?: string; // e.g. "Pure Silk", "Pure Cotton", "Linen", "Chiffon"
  
  currentStock: number;
  lowStockThreshold: number; // usually 5-10 for sarees, 15 for uniforms
  
  costPrice: number; // Buying price in INR (₹)
  sellingPrice: number; // Retail selling price in INR (₹)
  
  supplier: string; // e.g. "Kanchipuram Master Weavers", "Surat Silk Mills", "Coimbatore Cotton Mills"
  rackLocation: string; // e.g. "Rack A-1 (Silk Section)", "Rack C-3 (Uniforms)", "Shelf B2"
  
  totalUnitsReceived: number;
  totalUnitsSold: number;
  
  lastRestockedDate: string; // ISO date string
  lastSoldDate?: string;
  createdAt: string;
  
  imageUrl?: string;
  description?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number; // positive number
  previousStock: number;
  newStock: number;
  unitPrice: number; // Cost price for STOCK_IN, Selling price for SALE
  totalAmount: number;
  date: string; // ISO date string
  referenceNotes?: string; // Supplier name, customer token, invoice number, or reason
  handledBy?: string; // Staff member name
}

export interface SaleItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SaleTransaction {
  id: string;
  invoiceNumber: string;
  items: SaleItem[];
  totalAmount: number;
  totalItemsCount: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD';
  customerName?: string;
  customerPhone?: string;
  date: string;
}

export interface InventoryStats {
  totalUniqueProducts: number;
  totalUnitsInStock: number;
  totalInventoryValuation: number; // at cost price
  totalRetailValuation: number; // at selling price
  potentialProfit: number;
  
  outOfStockCount: number;
  lowStockCount: number;
  healthyStockCount: number;
  
  todaysSalesCount: number;
  todaysRevenue: number;
  
  deadStockCount: number; // items with stock > 0 but slow moving
  deadStockCapital: number; // money locked in slow/dead items
}

export type ActiveTab = 'overview' | 'stock-in' | 'sales' | 'inventory' | 'low-stock' | 'analytics';
