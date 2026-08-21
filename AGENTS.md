<!-- BEGIN:nextjs-agent-rules -->
# Laxmi Textiles Inventory & POS System — Architecture & Agent Guidelines

## 1. Project Overview & Mission
This application is a simple, visual, real-time inventory management and counter sales (POS) system built for **Laxmi Textiles**. The objective is to give the store owner 100% visibility over what came in, what was sold, what is left on shelves, and what needs to be reordered without manual calculations or notebooks.

---

## 2. Directory & Folder Structure

```
/
├── app/
│   ├── globals.css                # Global Tailwind CSS v4 styling
│   ├── layout.tsx                 # Root HTML shell & fonts
│   └── page.tsx                   # Main Dashboard container & tab coordinator
│
├── src/
│   ├── types/
│   │   └── index.ts               # Core domain types (Product, Category, StockMovement, etc.)
│   │
│   ├── lib/
│   │   ├── utils.ts               # Formatting helpers (₹ INR, date, stock status badge rules)
│   │   └── storage.ts             # LocalStorage engine, initial seeded data & stats calculators
│   │
│   ├── context/
│   │   └── InventoryContext.tsx   # Reactive state provider, actions (recordStockIn, recordSale, etc.)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx         # Brand banner, live counters, tab navigation & demo reset
│   │   └── ui/                    # Shared reusable primitives (badges, modals, etc.)
│   │
│   └── modules/                   # FEATURE MODULES (Strictly Isolated Boundaries)
│       │
│       ├── [CONTRIBUTOR 1 SCOPE]
│       ├── quick-actions/
│       │   └── HeroQuickActions.tsx   # 4 Large touch buttons (Stock In, Sale, Stock, Low Stock)
│       ├── stock-in/
│       │   └── StockInModule.tsx      # Inward goods entry, supplier logging, rack assignment
│       ├── sales/
│       │   └── SalesModule.tsx        # Fast POS billing, auto-reduction & digital receipt
│       │
│       └── [CONTRIBUTOR 2 SCOPE]
│       ├── inventory-view/
│       │   └── InventoryViewModule.tsx # "What's In My Shop?" live grid, search & audit
│       ├── low-stock/
│       │   └── LowStockModule.tsx     # 🔴 Out of Stock / 🟠 Low Stock & WhatsApp PO generator
│       └── analytics/
│           └── AnalyticsModule.tsx    # Fast vs Slow moving stock & trapped capital analysis
│
├── docs.md                        # Presentation script & module specification
├── AGENTS.md                      # Agent rules & conflict prevention guidelines
└── README.md                      # Setup & running instructions
```

---

## 3. Strict Conflict Prevention Rules for Multi-Contributor / Multi-Agent Development

To prevent file merge conflicts and overlapping logic between developers/agents:

1. **Strict Module Isolation**:
   - Every feature MUST reside within its designated folder in `src/modules/<module-name>/`.
   - Contributor 1 works ONLY in `quick-actions/`, `stock-in/`, and `sales/`.
   - Contributor 2 works ONLY in `inventory-view/`, `low-stock/`, and `analytics/`.
   - NEVER create cross-imports between sibling feature modules (e.g. `sales/` must NOT import from `stock-in/`).

2. **Shared Core Integrity (`src/types/`, `src/lib/`, `src/context/`)**:
   - The shared core contracts in `src/types/index.ts`, `src/lib/storage.ts`, and `src/context/InventoryContext.tsx` are foundational.
   - If a new property or action is required, propose/add it in `src/types/index.ts` first without breaking existing interfaces.

3. **No Direct LocalStorage Access in Modules**:
   - Feature components must ONLY consume data and trigger mutations via `useInventory()` from `src/context/InventoryContext.tsx`.
   - Do not call `localStorage.setItem` or `localStorage.getItem` directly inside UI components.

4. **UI & Styling Consistency**:
   - Always use Tailwind CSS utilities with semantic colors (e.g., Emerald for sales/success, Rose/Red for stockouts, Amber for low stock/alerts, Purple for dead stock/insights).
   - Use `formatCurrency()` from `@/src/lib/utils` for all Indian Rupee amounts (`₹`).
   - Use `getStockStatus()` from `@/src/lib/utils` for standardized status badge formatting (`🔴 Out of Stock`, `🟠 Running Low`, `🟢 In Stock`, `🟣 Excess / Slow`).

5. **Animation Standards**:
   - Use `framer-motion` for smooth layout transitions, tab switching, and modal entrances. Keep animations subtle (200-300ms duration).

<!-- END:nextjs-agent-rules -->
