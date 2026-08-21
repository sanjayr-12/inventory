import { Product, StockMovement, SaleTransaction, InventoryStats } from '@/src/types';

const PRODUCTS_KEY = 'laxmi_inventory_products_v1';
const MOVEMENTS_KEY = 'laxmi_inventory_movements_v1';
const TRANSACTIONS_KEY = 'laxmi_inventory_transactions_v1';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'SAR-COT-BLU-01',
    name: 'Cotton Saree – Royal Blue',
    category: 'Sarees',
    color: 'Royal Blue',
    sizeOrLength: '6.2 meters (with blouse)',
    fabric: '100% Combed Pure Cotton',
    currentStock: 15,
    lowStockThreshold: 10,
    costPrice: 450,
    sellingPrice: 799,
    supplier: 'Coimbatore Cotton Mills',
    rackLocation: 'Rack A-2 (Cotton Sarees)',
    totalUnitsReceived: 50,
    totalUnitsSold: 35,
    lastRestockedDate: '2026-08-01T10:30:00.000Z',
    lastSoldDate: '2026-08-21T14:20:00.000Z',
    createdAt: '2026-07-15T09:00:00.000Z',
    description: 'High-demand breathable handloom cotton saree with temple border.',
  },
  {
    id: 'prod-2',
    sku: 'SAR-SILK-RED-02',
    name: 'Kanchipuram Silk Saree – Crimson Gold',
    category: 'Sarees',
    color: 'Crimson Red with Gold Zari',
    sizeOrLength: '6.3 meters',
    fabric: 'Pure Mulberry Silk',
    currentStock: 3,
    lowStockThreshold: 5,
    costPrice: 4200,
    sellingPrice: 7999,
    supplier: 'Kanchipuram Master Weavers',
    rackLocation: 'Rack S-1 (Wedding Silk VIP Section)',
    totalUnitsReceived: 15,
    totalUnitsSold: 12,
    lastRestockedDate: '2026-07-20T11:00:00.000Z',
    lastSoldDate: '2026-08-21T11:45:00.000Z',
    createdAt: '2026-07-01T08:00:00.000Z',
    description: 'Bridal favorite pure silk saree with heavy pallu. Village customers travel far for this.',
  },
  {
    id: 'prod-3',
    sku: 'MEN-SHT-SKY-03',
    name: "Men's Cotton Formal Shirt – Sky Blue",
    category: "Men's Wear",
    color: 'Sky Blue',
    sizeOrLength: 'Size 40 (L)',
    fabric: 'Cotton Twill',
    currentStock: 24,
    lowStockThreshold: 10,
    costPrice: 350,
    sellingPrice: 699,
    supplier: 'Tirupur Garments Hub',
    rackLocation: 'Rack M-3 (Men Formals)',
    totalUnitsReceived: 60,
    totalUnitsSold: 36,
    lastRestockedDate: '2026-08-10T12:00:00.000Z',
    lastSoldDate: '2026-08-20T17:10:00.000Z',
    createdAt: '2026-07-10T10:00:00.000Z',
    description: 'Wrinkle-resistant everyday formal shirt.',
  },
  {
    id: 'prod-4',
    sku: 'WOM-CHU-MAR-04',
    name: "Women's Chudidar Material – Maroon",
    category: "Women's Wear",
    color: 'Deep Maroon',
    sizeOrLength: 'Unstitched 3-Piece (Top, Bottom, Dupatta)',
    fabric: 'Chanderi Silk Cotton',
    currentStock: 6,
    lowStockThreshold: 8,
    costPrice: 600,
    sellingPrice: 1199,
    supplier: 'Surat Silk Mills',
    rackLocation: 'Rack W-1 (Dress Materials)',
    totalUnitsReceived: 20,
    totalUnitsSold: 14,
    lastRestockedDate: '2026-08-05T14:30:00.000Z',
    lastSoldDate: '2026-08-21T09:15:00.000Z',
    createdAt: '2026-07-18T11:00:00.000Z',
    description: 'Embroidered neckline suit material, very popular for gifting.',
  },
  {
    id: 'prod-5',
    sku: 'SCH-UNI-NVW-05',
    name: 'School Uniform Set – Navy & White',
    category: 'School Uniforms',
    color: 'Navy Blue / White',
    sizeOrLength: 'Size 32 (Age 10-12)',
    fabric: 'Durable Poly-Cotton',
    currentStock: 42,
    lowStockThreshold: 15,
    costPrice: 280,
    sellingPrice: 550,
    supplier: 'Erode Textile Processors',
    rackLocation: 'Rack U-2 (School Uniforms)',
    totalUnitsReceived: 100,
    totalUnitsSold: 58,
    lastRestockedDate: '2026-08-02T16:00:00.000Z',
    lastSoldDate: '2026-08-21T13:00:00.000Z',
    createdAt: '2026-06-25T10:00:00.000Z',
    description: 'Standard district school uniform cloth with reinforced stitching.',
  },
  {
    id: 'prod-6',
    sku: 'DHO-PAT-GLD-06',
    name: 'Traditional Gold Zari Pattu Dhoti (Double)',
    category: 'Dhotis & Traditional',
    color: 'Cream with Gold Kasavu Border',
    sizeOrLength: '8 Muzham (3.65m)',
    fabric: 'Pure Cotton Silk Blend',
    currentStock: 0, // OUT OF STOCK
    lowStockThreshold: 6,
    costPrice: 550,
    sellingPrice: 1100,
    supplier: 'Salem Handlooms',
    rackLocation: 'Rack D-1 (Dhoti Section)',
    totalUnitsReceived: 30,
    totalUnitsSold: 30,
    lastRestockedDate: '2026-07-10T10:00:00.000Z',
    lastSoldDate: '2026-08-19T18:00:00.000Z',
    createdAt: '2026-06-20T09:00:00.000Z',
    description: 'Essential festival and wedding dhoti. Currently SOLD OUT! Needs urgent restock.',
  },
  {
    id: 'prod-7',
    sku: 'SAR-BAN-EMR-07',
    name: 'Banarasi Heavy Jacquard Saree – Emerald',
    category: 'Sarees',
    color: 'Emerald Green with Silver Weave',
    sizeOrLength: '6.2 meters',
    fabric: 'Jacquard Art Silk',
    currentStock: 22, // SLOW MOVING - Dead Stock example
    lowStockThreshold: 4,
    costPrice: 2100,
    sellingPrice: 3899,
    supplier: 'Varanasi Silk Craft',
    rackLocation: 'Rack S-4 (Upper Shelf - Banarasi)',
    totalUnitsReceived: 25,
    totalUnitsSold: 3,
    lastRestockedDate: '2026-05-15T11:00:00.000Z',
    lastSoldDate: '2026-06-10T15:00:00.000Z',
    createdAt: '2026-05-10T10:00:00.000Z',
    description: 'Slow-moving high-ticket item. ₹46,200 tied up in stock without recent sales.',
  },
  {
    id: 'prod-8',
    sku: 'MEN-KUR-CRM-08',
    name: "Men's Pure Linen Kurta – Cream",
    category: "Men's Wear",
    color: 'Natural Cream',
    sizeOrLength: 'Size 42 (XL)',
    fabric: '100% Organic Linen',
    currentStock: 35, // SLOW MOVING
    lowStockThreshold: 5,
    costPrice: 750,
    sellingPrice: 1499,
    supplier: 'Tirupur Garments Hub',
    rackLocation: 'Rack M-1 (Ethnic Wear)',
    totalUnitsReceived: 40,
    totalUnitsSold: 5,
    lastRestockedDate: '2026-06-01T10:00:00.000Z',
    lastSoldDate: '2026-06-25T16:30:00.000Z',
    createdAt: '2026-05-28T14:00:00.000Z',
    description: 'Overstocked linen kurtas. Money locked: ₹26,250.',
  },
  {
    id: 'prod-9',
    sku: 'KID-PAT-PEA-09',
    name: 'Kids Pattu Pavadai – Peacock Blue & Pink',
    category: 'Kids Wear',
    color: 'Peacock Blue & Magenta',
    sizeOrLength: 'Size 26 (Age 5-7)',
    fabric: 'Art Silk with Zari',
    currentStock: 4, // LOW STOCK
    lowStockThreshold: 8,
    costPrice: 650,
    sellingPrice: 1250,
    supplier: 'Madurai Weavers Syndicate',
    rackLocation: 'Rack K-2 (Kids Festival)',
    totalUnitsReceived: 25,
    totalUnitsSold: 21,
    lastRestockedDate: '2026-08-08T10:00:00.000Z',
    lastSoldDate: '2026-08-21T12:30:00.000Z',
    createdAt: '2026-07-22T09:30:00.000Z',
    description: 'High-velocity festival item for young girls. Selling fast.',
  },
  {
    id: 'prod-10',
    sku: 'SAR-COT-PRN-10',
    name: 'Daily Wear Sungudi Cotton Saree – Mustard',
    category: 'Sarees',
    color: 'Mustard Yellow with Dot Prints',
    sizeOrLength: '5.5 meters',
    fabric: 'Madurai Sungudi Cotton',
    currentStock: 12,
    lowStockThreshold: 10,
    costPrice: 220,
    sellingPrice: 450,
    supplier: 'Madurai Weavers Syndicate',
    rackLocation: 'Rack A-4 (Daily Cotton)',
    totalUnitsReceived: 80,
    totalUnitsSold: 68,
    lastRestockedDate: '2026-08-12T11:00:00.000Z',
    lastSoldDate: '2026-08-21T15:10:00.000Z',
    createdAt: '2026-07-12T10:00:00.000Z',
    description: 'Traditional tie-and-dye sungudi saree, consistent fast mover.',
  },
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    productId: 'prod-1',
    productName: 'Cotton Saree – Royal Blue',
    type: 'STOCK_IN',
    quantity: 50,
    previousStock: 0,
    newStock: 50,
    unitPrice: 450,
    totalAmount: 22500,
    date: '2026-08-01T10:30:00.000Z',
    referenceNotes: 'Batch #C-801 from Coimbatore Mills',
    handledBy: 'Murugan (Store Staff)',
  },
  {
    id: 'mov-2',
    productId: 'prod-1',
    productName: 'Cotton Saree – Royal Blue',
    type: 'SALE',
    quantity: 2,
    previousStock: 17,
    newStock: 15,
    unitPrice: 799,
    totalAmount: 1598,
    date: '2026-08-21T14:20:00.000Z',
    referenceNotes: 'Counter Bill #LT-1049',
    handledBy: 'Laxmi Owner',
  },
  {
    id: 'mov-3',
    productId: 'prod-2',
    productName: 'Kanchipuram Silk Saree – Crimson Gold',
    type: 'SALE',
    quantity: 1,
    previousStock: 4,
    newStock: 3,
    unitPrice: 7999,
    totalAmount: 7999,
    date: '2026-08-21T11:45:00.000Z',
    referenceNotes: 'Customer from Tiruchengode (Wedding Purchase)',
    handledBy: 'Laxmi Owner',
  },
  {
    id: 'mov-4',
    productId: 'prod-6',
    productName: 'Traditional Gold Zari Pattu Dhoti',
    type: 'SALE',
    quantity: 3,
    previousStock: 3,
    newStock: 0,
    unitPrice: 1100,
    totalAmount: 3300,
    date: '2026-08-19T18:00:00.000Z',
    referenceNotes: 'Stock completely exhausted',
    handledBy: 'Murugan (Store Staff)',
  },
];

export const INITIAL_TRANSACTIONS: SaleTransaction[] = [
  {
    id: 'txn-1',
    invoiceNumber: 'LT-1049',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2,
        unitPrice: 799,
        total: 1598,
      },
    ],
    totalAmount: 1598,
    totalItemsCount: 2,
    paymentMethod: 'UPI',
    customerName: 'Senthil Kumar (Village customer)',
    date: '2026-08-21T14:20:00.000Z',
  },
  {
    id: 'txn-2',
    invoiceNumber: 'LT-1048',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        unitPrice: 7999,
        total: 7999,
      },
    ],
    totalAmount: 7999,
    totalItemsCount: 1,
    paymentMethod: 'CARD',
    customerName: 'Meenakshi Ammal',
    date: '2026-08-21T11:45:00.000Z',
  },
  {
    id: 'txn-3',
    invoiceNumber: 'LT-1047',
    items: [
      {
        product: INITIAL_PRODUCTS[9],
        quantity: 3,
        unitPrice: 450,
        total: 1350,
      },
      {
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        unitPrice: 1199,
        total: 1199,
      },
    ],
    totalAmount: 2549,
    totalItemsCount: 4,
    paymentMethod: 'CASH',
    customerName: 'Radha',
    date: '2026-08-21T09:15:00.000Z',
  },
];

export class StorageService {
  static getProducts(): Product[] {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (!stored) {
        this.saveProducts(INITIAL_PRODUCTS);
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  static saveProducts(products: Product[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }

  static getMovements(): StockMovement[] {
    if (typeof window === 'undefined') return INITIAL_MOVEMENTS;
    try {
      const stored = localStorage.getItem(MOVEMENTS_KEY);
      if (!stored) {
        this.saveMovements(INITIAL_MOVEMENTS);
        return INITIAL_MOVEMENTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_MOVEMENTS;
    }
  }

  static saveMovements(movements: StockMovement[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
    } catch (e) {
      console.error('Failed to save movements to localStorage', e);
    }
  }

  static getTransactions(): SaleTransaction[] {
    if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
    try {
      const stored = localStorage.getItem(TRANSACTIONS_KEY);
      if (!stored) {
        this.saveTransactions(INITIAL_TRANSACTIONS);
        return INITIAL_TRANSACTIONS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  }

  static saveTransactions(transactions: SaleTransaction[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }

  static resetToSampleData(): {
    products: Product[];
    movements: StockMovement[];
    transactions: SaleTransaction[];
  } {
    this.saveProducts(INITIAL_PRODUCTS);
    this.saveMovements(INITIAL_MOVEMENTS);
    this.saveTransactions(INITIAL_TRANSACTIONS);
    return {
      products: INITIAL_PRODUCTS,
      movements: INITIAL_MOVEMENTS,
      transactions: INITIAL_TRANSACTIONS,
    };
  }

  static calculateStats(products: Product[], transactions: SaleTransaction[]): InventoryStats {
    let totalUnitsInStock = 0;
    let totalInventoryValuation = 0;
    let totalRetailValuation = 0;
    let outOfStockCount = 0;
    let lowStockCount = 0;
    let healthyStockCount = 0;
    let deadStockCount = 0;
    let deadStockCapital = 0;

    const now = new Date().getTime();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    for (const p of products) {
      totalUnitsInStock += p.currentStock;
      totalInventoryValuation += p.currentStock * p.costPrice;
      totalRetailValuation += p.currentStock * p.sellingPrice;

      if (p.currentStock <= 0) {
        outOfStockCount++;
      } else if (p.currentStock <= p.lowStockThreshold) {
        lowStockCount++;
      } else {
        healthyStockCount++;
      }

      // Check for slow / dead stock (stock > 0 and (no sales or very low sales ratio))
      const isSlowMoving =
        p.currentStock > 10 &&
        (p.totalUnitsSold <= 5 || (p.lastSoldDate && new Date(p.lastSoldDate).getTime() < thirtyDaysAgo));
      
      if (isSlowMoving) {
        deadStockCount++;
        deadStockCapital += p.currentStock * p.costPrice;
      }
    }

    // Calculate today's sales
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    let todaysSalesCount = 0;
    let todaysRevenue = 0;

    for (const t of transactions) {
      const txDate = new Date(t.date);
      if (txDate >= todayStart) {
        todaysSalesCount += t.totalItemsCount;
        todaysRevenue += t.totalAmount;
      }
    }

    return {
      totalUniqueProducts: products.length,
      totalUnitsInStock,
      totalInventoryValuation,
      totalRetailValuation,
      potentialProfit: totalRetailValuation - totalInventoryValuation,
      outOfStockCount,
      lowStockCount,
      healthyStockCount,
      todaysSalesCount,
      todaysRevenue,
      deadStockCount,
      deadStockCapital,
    };
  }
}
