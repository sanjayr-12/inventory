# Lakshmi Textiles — Smart Inventory & POS System
## Presentation Documentation & 2-Contributor Modular Architecture Plan

---

### 1. Executive Summary & Problem Context

**Lakshmi Textiles** has expanded from a local textile shop into a bustling regional destination with customers traveling 30–40 km from neighboring villages. However, inventory tracking remained manual (notebooks, memory, physical shelf hunting), causing four critical business problems:
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
| **Hero Quick Actions** (`src/modules/quick-actions/`) | • Large touch-first 4 action cards (`➕ STOCK IN`, `🛒 SALE`, `📦 STOCK`, `⚠️ LOW STOCK`)<br>• Executive 4-questions snapshot<br>• Smooth hover & micro-interaction animations | `HeroQuickActions.tsx` |
| **Stock In Entry** (`src/modules/stock-in/`) | • Restock existing catalog item OR register new textile line<br>• Input pieces received, buying cost, selling MRP, supplier, shelf/rack<br>• Real-time before/after stock impact preview<br>• Recent delivery challan history | `StockInModule.tsx` |
| **Sales & POS Billing** (`src/modules/sales/`) | • Fast catalog search (SKU, color, fabric, rack location)<br>• 1-tap "Add to Bill" with stock ceiling guard (prevents negative stock)<br>• Multiple payment methods (`UPI`, `CASH`, `CARD`)<br>• Instant automatic stock deduction<br>• Animated receipt card + confetti celebration | `SalesModule.tsx` |

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
- **Storage Layer**: Managed by `StorageService` in `src/lib/storage.ts` using browser `localStorage` (`lakshmi_inventory_*`).
- **Initial Demo Seed**: Includes realistic items (Royal Blue Cotton Saree, Kanchipuram Crimson Gold Silk, Tirupur Shirts, Madurai Sungudi, Double Dhoti, Erode Uniforms).
- **Reset Trigger**: "Reset Demo Data" button reloads standard presentation dataset at any time.

---

### 5. Step-by-Step Presentation Script for Demo Day

Follow this 3-minute presentation walkthrough when pitching the software:

1. **The Problem (Hook)**:
   - *"A customer travels 35km from a village to Lakshmi Textiles for a specific blue cotton saree. The owner thinks they have it, but after 15 minutes of searching shelves, they realize it was sold yesterday. The customer leaves empty-handed."*
2. **Step 1 — Stock In (`➕ STOCK IN`)**:
   - Show receiving 50 pieces of Cotton Saree from Coimbatore Cotton Mills at Rack A-2.
   - Show how the system immediately logs cost, supplier, and exact shelf location.
3. **Step 2 — Counter Sale (`🛒 SALE`)**:
   - Add 2 Blue Cotton Sarees to the POS bill.
   - Click "Complete Sale".
   - Highlight: *"Before sale: 15 pieces → After sale: 13 pieces. Zero manual calculation needed."*
4. **Step 3 — Instant Look-up (`📦 WHAT'S IN SHOP?`)**:
   - Open inventory view and search "blue cotton".
   - Instantly show: 13 pieces available at **Rack A-2**.
5. **Step 4 — Low Stock & WhatsApp Reorder (`⚠️ LOW STOCK`)**:
   - Show Kanchipuram Silk Sarees running low (3 pcs left) and Dhoti out of stock (0 pcs).
   - Click "WhatsApp Order" to show the pre-drafted supplier purchase order ready to send.
6. **Step 5 — Capital Optimization (`📊 DEAD STOCK`)**:
   - Show ₹72,450 trapped in slow-moving Banarasi sarees and kurtas, showing the owner exactly how to free up cash.
