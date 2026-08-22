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
  sizeOrLength?: string;
  fabric?: string;
  
  currentStock: number;
  lowStockThreshold: number;
  
  costPrice: number; // Buying price in INR (₹)
  sellingPrice: number; // Retail selling price in INR (₹)
  
  supplier: string;
  rackLocation: string;
  
  totalUnitsReceived: number;
  totalUnitsSold: number;
  
  lastRestockedDate: string;
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
  quantity: number;
  previousStock: number;
  newStock: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
  referenceNotes?: string;
  handledBy?: string;
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

export interface GeoLocation {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export interface VendorItem {
  id: string;
  name: string;
  category: Category;
  fabric: string;
  color: string;
  unitPrice: number;
  retailEstimate: number;
  minimumOrderQty: number;
  inStockAtMill: number;
  description: string;
  defaultRack: string;
}

export interface Vendor {
  id: string;
  name: string;
  city: string;
  state: string;
  specialty: string;
  rating: number;
  phone: string;
  coordinates: { lat: number; lng: number };
  catalog: VendorItem[];
}

export interface PurchaseOrderItem {
  vendorItemId: string;
  name: string;
  category: Category;
  fabric: string;
  color: string;
  quantity: number;
  unitPrice: number;
  retailEstimate: number;
  total: number;
  targetRack: string;
}

export type DeliveryStatus = 'ORDER_PLACED' | 'IN_TRANSIT' | 'DELIVERED' | 'STOCKED';

export interface ReturnRequest {
  quantity: number;
  reason: string;
  requestedAt: number; // timestamp in ms
  status: 'REQUESTED' | 'PICKUP_DISPATCHED' | 'RETURN_IN_TRANSIT' | 'RETURN_COMPLETED';
  truckNumber: string;
  driverName: string;
  driverPhone: string;
  completedAt?: string;
}

export interface PurchaseOrder {
  id: string;
  trackingHash: string;
  vendorId: string;
  vendorName: string;
  vendorCity: string;
  vendorCoordinates: { lat: number; lng: number };
  items: PurchaseOrderItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: number; // timestamp in milliseconds
  status: DeliveryStatus;
  truckNumber: string;
  driverName: string;
  driverPhone: string;
  stockInCompletedAt?: string;
  returnRequest?: ReturnRequest;
}

export interface InventoryStats {
  totalUniqueProducts: number;
  totalUnitsInStock: number;
  totalInventoryValuation: number;
  totalRetailValuation: number;
  potentialProfit: number;
  
  outOfStockCount: number;
  lowStockCount: number;
  healthyStockCount: number;
  
  todaysSalesCount: number;
  todaysRevenue: number;
  
  deadStockCount: number;
  deadStockCapital: number;
  activeInwardOrdersCount: number;
}

export type ActiveTab = 'overview' | 'stock-in' | 'vendor-orders' | 'sales' | 'inventory' | 'low-stock' | 'analytics';

export type Language = 'en' | 'ta' | 'hi';
export type ThemeMode = 'light' | 'dark';
