# 🛍️ Lakshmi Textiles — Real-Time Inventory & POS System

A fast, responsive, and easy-to-use textile inventory management and counter billing application tailored for **Lakshmi Textiles**.

Built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS v4**, **Framer Motion**, and **Lucide Icons**.

---

## 🌟 Key Features

1. **➕ Stock In Entry** (`src/modules/stock-in/`):
   - Record new inward deliveries from master weavers and textile mills.
   - Capture quantity, buying cost, selling MRP, supplier, and exact rack/shelf location.
2. **🛒 Counter Sale & POS Billing** (`src/modules/sales/`):
   - Quick search by SKU, fabric, color, or shelf.
   - Immediate automatic stock deduction upon sale with digital invoice & celebration animations.
3. **📦 "What's In My Shop?" Live Inventory** (`src/modules/inventory-view/`):
   - Instant answer to *"How many blue cotton sarees do I have right now?"*
   - Filter by categories (Cotton Sarees, Silk Sarees, Men's Wear, School Uniforms, Dhotis, etc.).
   - Visual stock health indicators (`🔴 Out of Stock`, `🟠 Running Low`, `🟢 In Stock`, `🟣 Excess / Slow`).
4. **⚠️ Low Stock & WhatsApp Reorder Center** (`src/modules/low-stock/`):
   - Real-time stockout emergency alerts to prevent turning away long-distance customers.
   - 1-Click WhatsApp Purchase Order generator for suppliers and weavers.
5. **📊 Fast vs. Slow-Moving Insights & Dead Stock** (`src/modules/analytics/`):
   - Calculates working capital trapped in unsold items (`₹` amount).
   - Identifies high-velocity cash drivers vs dead stock needing clearance.
6. **🔄 Presentation Demo Dataset**:
   - Pre-loaded with realistic regional textile inventory data.
   - 1-Click "Reset Demo Data" button in header for clean presentation rehearsals.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18+ or Bun 1.0+

### 1. Install Dependencies

Using **Bun** (fastest):
```bash
bun install
```

Or using **npm**:
```bash
npm install
```

---

### 2. Run the Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

### 3. Build for Production

```bash
bun run build
bun start
# or
npm run build
npm start
```

---

## 👥 Multi-Contributor & AI Agent Guide

The project is structured with strict **modular isolation** to prevent git merge conflicts between contributors:

- **Contributor 1**: Works in `src/modules/stock-in/`, `src/modules/sales/`, and `src/modules/quick-actions/`.
- **Contributor 2**: Works in `src/modules/inventory-view/`, `src/modules/low-stock/`, and `src/modules/analytics/`.

Refer to:
- 📖 [docs.md](file:///mnt/sda3/Test-Stuff/hcl/inventory/docs.md) for the complete presentation narrative and feature specifications.
- 🤖 [AGENTS.md](file:///mnt/sda3/Test-Stuff/hcl/inventory/AGENTS.md) for code conventions and folder boundaries.
