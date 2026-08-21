# Laxmi Textiles — Smart Inventory & POS System
## Architecture & 2-Contributor Modular Plan

---

### 1. Executive Summary & Problem Context

**Laxmi Textiles** has expanded from a local textile shop into a bustling regional destination with customers traveling 30–40 km from neighboring villages. However, inventory tracking remained manual (notebooks, memory, physical shelf hunting), causing four critical business problems:
1. **Unreliable Stock Counts**: Staff cannot immediately confirm if a particular blue cotton saree or silk dhoti is in stock.
2. **Lost Sales & Damaged Goodwill**: Customers traveling long distances are turned away because items thought to be available were already sold.
3. **Trapped Working Capital in Dead Stock**: Money gets locked in slow-moving or overstocked items sitting on high shelves for months.
4. **Stockout Emergencies**: High-demand fast sellers run out without timely reorders.

#### The Core Solution:
A simple, visual, real-time inventory and counter billing system with 4 large primary touch actions:
$$\text{Stock Comes In} \longrightarrow \text{Record Entry} \longrightarrow \text{Customer Buys} \longrightarrow \text{Auto-Deduct} \longrightarrow \text{Owner Knows Real-Time Stock \& What to Reorder}$$

---

### 2. Conflict-Free Two-Contributor Work Allocation

To ensure two developers (or two autonomous AI agents) can build, extend, and maintain this codebase **concurrently without merge conflicts**, the system is partitioned into isolated feature modules.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SHARED CORE CONTRACTS                           │
│        src/types/index.ts  •  src/lib/storage.ts  •  src/context/      │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
        ┌───────────▼───────────┐        ┌───────────▼───────────┐
        │     CONTRIBUTOR 1     │        │     CONTRIBUTOR 2     │
        │ Inward Flow & Billing │        │ Visibility & Insights │
        ├───────────────────────┤        ├───────────────────────┤
        │ • Stock-In Module     │        │ • Live Shop Overview  │
        │ • Quick Sales / POS   │        │ • Low Stock Alerts    │
        │ • Quick Action Hero   │        │ • Dead Stock Analytics│
        └───────────────────────┘        └───────────────────────┘
```

---

### 3. Contributor Breakdown & Feature Assignments

#### 👤 Contributor 1: Core Operations & Transaction Engine
**Folder Scope**: `src/modules/stock-in/`, `src/modules/sales/`, `src/modules/quick-actions/`

| Module | Features & Responsibilities | Deliverables |
| :--- | :--- | :--- |
| **Hero Quick Actions** (`src/modules/quick-actions/`) | • Large touch-first 4 action cards (`STOCK IN`, `SALE / POS`, `WHAT'S IN SHOP?`, `LOW STOCK ALERTS`)<br>• Live Store Overview snapshot widget<br>• Smooth hover & micro-interaction animations | `HeroQuickActions.tsx` |
| **Stock In Entry** (`src/modules/stock-in/`) | • Restock existing catalog item OR register new textile line<br>• Input pieces received, buying cost, selling MRP, supplier, shelf/rack<br>• Real-time before/after stock impact preview<br>• Recent delivery challan history | `StockInModule.tsx` |
| **Sales & POS Billing** (`src/modules/sales/`) | • Fast catalog search (SKU, color, fabric, rack location)<br>• 1-tap "Add to Bill" with stock ceiling guard (prevents negative stock)<br>• Multiple payment methods (`UPI`, `CASH`, `CARD`)<br>• Instant automatic stock reduction<br>• Animated receipt card + confetti celebration | `SalesModule.tsx` |

---

#### 👤 Contributor 2: Inventory Visibility, Reordering & Intelligence
**Folder Scope**: `src/modules/inventory-view/`, `src/modules/low-stock/`, `src/modules/analytics/`

| Module | Features & Responsibilities | Deliverables |
| :--- | :--- | :--- |
| **"What's In My Shop?"** (`src/modules/inventory-view/`) | • Instant answer to "How many blue cotton sarees do I have right now?"<br>• Category pill counters (Cotton Sarees, Silk Sarees, Shirts, Chudidars, Uniforms, Dhotis)<br>• Table & Grid view toggle<br>• Color-coded badges (🔴 Out of stock, 🟠 Low stock, 🟢 In stock, 🟣 Slow)<br>• Shelf physical audit & adjustment modal | `InventoryViewModule.tsx` |
| **Low Stock Alerts** (`src/modules/low-stock/`) | • High-urgency Out of Stock list (lost sales warning)<br>• Running low threshold alerts<br>• 1-Click WhatsApp Purchase Order text generator for weavers/suppliers<br>• 1-Click quick restock modal | `LowStockModule.tsx` |
| **Dead Stock & Analytics** (`src/modules/analytics/`) | • Working capital locked in dead stock calculator (₹ amount)<br>• Fast-moving champions vs slow-moving inventory<br>• Gross profit margin & sell-through velocity<br>• Category capital allocation breakdown | `AnalyticsModule.tsx` |

---

### 4. Shared Core Contracts & State Schema

Both contributors interact through `src/context/InventoryContext.tsx` without modifying internal storage directly.

#### Product Schema (`src/types/index.ts`)
```typescript
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
  costPrice: number;       // Buying price (₹)
  sellingPrice: number;    // Retail price (₹)
  supplier: string;        // Weaver / Mill
  rackLocation: string;    // e.g. Rack A-2
  totalUnitsReceived: number;
  totalUnitsSold: number;
  lastRestockedDate: string;
  lastSoldDate?: string;
}
```

#### Storage & Persistence
- **Storage Layer**: Managed by `StorageService` in `src/lib/storage.ts` using browser `localStorage` (`laxmi_inventory_*`).
- **Initial Demo Seed**: Includes realistic items (Royal Blue Cotton Saree, Kanchipuram Crimson Gold Silk, Tirupur Shirts, Madurai Sungudi, Double Dhoti, Erode Uniforms).
- **Reset Trigger**: "Reset Data" button reloads standard dataset at any time.

---

### 5. Step-by-Step Walkthrough Guide

1. **The Core Objective**:
   - Give Laxmi Textiles store staff and owner 100% visibility over current stock and counter sales without paper notebooks.
2. **Inward Stock Entry (`STOCK IN`)**:
   - Receive incoming shipments from weavers (e.g. Coimbatore Mills, Kanchipuram Master Weavers) with cost price and shelf location.
3. **Counter Sale (`SALE / POS`)**:
   - Bill customer purchases with instant stock deduction.
4. **Live Stock Lookup (`WHAT'S IN SHOP?`)**:
   - Search by SKU, fabric, or rack to find item counts immediately.
5. **Low Stock Alerts (`LOW STOCK ALERTS`)**:
   - Restock fast-selling items or send WhatsApp orders directly to suppliers.
6. **Capital Optimization (`DEAD STOCK & INSIGHTS`)**:
   - Monitor working capital locked in slow-moving inventory.
