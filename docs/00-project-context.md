# Ball Fashion Inventory Demo
## 00 — Project Context and Engineering Rules

> **Read this document before writing any code.**
>
> This repository is a functional sales demo for a Ball Fashion & Accessories inventory system.
> Build only the defined demo scope. Prefer simple, clean, maintainable code over feature quantity.

---

## 1. Project Identity

**Project Name:** Ball Fashion Inventory Demo  
**Product Type:** Web-based inventory operations system  
**Main Goal:** Demonstrate and validate the real inventory workflow before full production development  
**Primary Users:** Owner, Admin Inventory, Admin Gudang  
**Deployment Target:** Vercel  
**Database:** Neon PostgreSQL  
**Language:** Indonesian for all visible UI text  

This system is for a business that sells:

1. **Stoklot**  
   Factory leftover fashion goods that arrive in Ball or Batch form and are classified through sorting stages.

2. **Accessories**  
   Supporting goods such as thread, zipper, elastic, and related materials. Accessories can also arrive in Ball or Batch form.

---

## 2. Demo Goal

The demo must prove one complete operational flow:

```text
Login
→ Add Ball / Batch
→ Sortir 0: Choose Division
→ Sortir 1: Category + Product Type
→ Stocklist
→ Warehouse Transfer
→ Stock Out
→ Stock History
```

The demo is successful when a prospective client can understand:

- how incoming Ball inventory is recorded;
- how a Ball becomes sellable stock;
- where stock is currently stored;
- how stock moves between warehouses;
- how stock decreases when goods leave for sales;
- how a stock item can be traced back to its original Ball.

This is a real working demo with persistent Neon PostgreSQL data, not a static mockup.

---

## 3. Final Technology Stack

Use only the following stack:

```text
Next.js App Router
TypeScript
Tailwind CSS
shadcn/ui
Lucide React
PostgreSQL hosted on Neon
Prisma ORM
Credential-based login compatible with Next.js
Static demo images inside /public/demo
Vercel deployment
```

### 3.1 UI Requirement

Use **shadcn/ui as the default UI system for all visible interfaces**.

Use shadcn/ui wherever applicable:

```text
Sidebar
Button
Card
Table
Input
Textarea
Select
Combobox
Form
Dialog
Sheet
Badge
Tabs
Dropdown Menu
Popover
Calendar
Alert Dialog
Skeleton
Sonner / Toast
Tooltip
Scroll Area
Pagination
Command
Separator
```

Use Lucide React for icons.

Do not use:

```text
Material UI
Ant Design
Chakra UI
Bootstrap
DaisyUI
Emoji as UI icons
Another UI framework
```

Custom components are allowed only for inventory-specific behavior that shadcn/ui does not provide. Custom components must be composed from shadcn/ui primitives.

Examples of allowed custom components:

```text
StockMovementTimeline
BallStatusBadge
WarehouseStockCard
SortingResultRow
StockTraceabilityTree
InventorySummaryCard
```

### 3.2 Data and Deployment Requirement

Use Neon PostgreSQL through Prisma.

The app must deploy to Vercel without architectural changes.

Do not use:

```text
Separate Express backend
NestJS
Laravel
Firebase
Supabase
MongoDB
SQLite
MinIO for this demo
S3 for this demo
Runtime uploads
Persistent local filesystem writes
```

Static demo images must be bundled in:

```text
/public/demo/balls
/public/demo/products
```

Store image paths in the database as relative public paths, for example:

```text
/demo/balls/ball-001.jpg
```

---

## 4. Scope Boundary

This is a focused demo, not a full ERP.

### In Scope

```text
Credential login
Basic role access
Dashboard
Ball / Batch creation
Sortir 0
Sortir 1
Basic Accessories classification
Stocklist
Stock detail and movement history
Warehouse transfer
Stock out
Master data basics
Seeded demo data
Vercel-ready deployment
```

### Explicitly Out of Scope

Do not implement these features in the demo:

```text
Sortir 2 workflow
Sortir 3 workflow
Sortir 4 workflow
Sortir 5 workflow
Return workflow
Stock adjustment
Stock opname
Accounting
Cash flow
Profit and loss
Kledo integration
Marketplace API integration
POS
Barcode scanner integration
Printer label integration
KPI dashboard
Multi-level approval
Multi-company support
Native mobile application
Runtime file uploads
Complex charts
```

The database should remain extendable for future development, but do not build future features now.

---

## 5. Business Context

### 5.1 Warehouses

Seed these three warehouses:

```text
Gudang Sortir
Gudang Retail
Gudang Grosir
```

Warehouse records must be stored in the database so new warehouses can be added later.

### 5.2 Stoklot Sorting Concept

Full future Stoklot workflow:

```text
Sortir 0 → Division
Sortir 1 → Category + Product Type
Sortir 2 → Model / Sub Item
Sortir 3 → Size
Sortir 4 → Grade
Sortir 5 → Color
```

For this demo:

```text
Implement Sortir 0 and Sortir 1 fully.
Do not implement Sortir 2 to Sortir 5 UI.
Keep sorting stage fields future-ready.
```

### 5.3 Minimum Sellable Stock

Stoklot becomes sellable after **Sortir 1**.

Example:

```text
Ball BL-2026-0001
→ Dewasa / Hoodie
→ SKU STL-DWS-HOODIE
→ 20 PCS
→ Stored in a selected warehouse
→ Sellable immediately
```

Do not require a product to complete Sortir 2 through Sortir 5 before it can be sold.

---

## 6. Core Business Rules

These rules are mandatory.

1. Every Ball, stock record, movement, transfer, and stock-out transaction must be stored in the database.

2. Every Stoklot stock record must be traceable back to its original Ball or Batch.

3. Never allow direct editing of stock quantity from Stocklist.

4. Stock quantity changes only through inventory movements:
   - incoming classification;
   - warehouse transfer;
   - stock out;
   - future sorting;
   - future return;
   - future adjustment.

5. Never delete inventory history when stock is moved or processed.

6. Sortir 1 creates active sellable stock.

7. Every inventory mutation must be performed server-side.

8. Every inventory mutation must use a Prisma transaction.

9. A sorting result quantity must never exceed the quantity available from its source.

10. A transfer or stock-out quantity must never exceed the available quantity in the selected source warehouse.

11. Every inventory movement must record:
   - date and time;
   - movement type;
   - quantity;
   - source warehouse when applicable;
   - destination warehouse when applicable;
   - source Ball or source stock when applicable;
   - actor user;
   - reference or note when applicable.

12. Use database-backed data. Do not leave core functional pages dependent on hardcoded mock arrays.

---

## 7. Required Users and Access

Seed these demo accounts:

| Role | Email | Password |
|---|---|---|
| Owner | owner@ballfashion.demo | Demo12345! |
| Admin Inventory | admin@ballfashion.demo | Demo12345! |
| Admin Gudang | warehouse@ballfashion.demo | Demo12345! |

Required permissions:

| Action | Owner | Admin Inventory | Admin Gudang |
|---|---:|---:|---:|
| View dashboard | Yes | Yes | Yes |
| View Ball records | Yes | Yes | Yes |
| Create Ball / Batch | Yes | Yes | No |
| Perform Sortir 0 | Yes | Yes | No |
| Perform Sortir 1 | Yes | Yes | No |
| View Stocklist | Yes | Yes | Yes |
| Transfer stock | Yes | Yes | Yes |
| Create stock out | Yes | Yes | Yes |
| Manage master data | Yes | Yes | No |
| View movement history | Yes | Yes | Yes |

Role checks must be enforced on the server. Hidden buttons alone are not authorization.

---

## 8. Required Demo Workflow

### 8.1 Login

All application pages require authentication.

Public route:

```text
/login
```

After successful login, redirect to:

```text
/dashboard
```

### 8.2 Add Ball / Batch

Owner or Admin Inventory can create a Ball or Batch.

Required fields:

```text
Ball Code
Received Date
Supplier / Source
Initial Warehouse
Purchase Cost
Estimated Quantity
Unit
Notes
Optional Static Image Path
```

Initial warehouse should default to `Gudang Sortir`.

Initial status:

```text
WAITING_SORTIR_0
```

A Ball is not active sellable stock until it is classified.

### 8.3 Sortir 0 — Division

Sortir 0 chooses one division:

```text
STOKLOT
ACCESSORIES
```

Expected state updates:

```text
STOKLOT
→ status: READY_FOR_SORTIR_1

ACCESSORIES
→ status: READY_FOR_ACCESSORIES_CLASSIFICATION
```

Sortir 0 must create a permanent history event.

### 8.4 Sortir 1 — Category + Product Type

Sortir 1 is the first sellable Stoklot stage.

The user selects one Stoklot Ball and creates one or more result rows.

Each result row requires:

```text
Category
Product Type
Quantity
Unit
HPP per Unit
Selling Price per Unit
Destination Warehouse
Optional Note
```

Seed category options:

```text
Dewasa
Anak
```

Seed product type options:

```text
Legging Panjang
Legging Pendek
Hoodie
Crewneck
Full Zipper
Half Zipper
T-Shirt Man
T-Shirt Women
Tank Top
Dress
Jogger
Short Jogger
Short Pants
```

One Ball must support multiple outputs in a single Sortir 1 submission.

Example:

```text
Ball BL-2026-0001
├─ Dewasa / Hoodie: 20 PCS
├─ Dewasa / Crewneck: 15 PCS
└─ Anak / T-Shirt Man: 12 PCS
```

Each valid result row must:

1. Create or reuse a Product Variant / SKU.
2. Create a Stock Lot linked to the source Ball.
3. Create an inventory movement record.
4. Create available stock in the selected destination warehouse.
5. Become visible in Stocklist immediately.

Suggested generated SKU examples:

```text
STL-DWS-HOODIE
STL-DWS-CREWNECK
STL-ANK-TSHIRT-MAN
```

SKU must be generated from structured stored attributes. It must not depend on manually typed free-text SKU input.

### 8.5 Accessories Classification

Accessories use a simple classification workflow for the demo.

Required fields:

```text
Accessory Category
Accessory Type / Specification
Color or Variant
Quantity
Unit
HPP per Unit
Selling Price per Unit
Destination Warehouse
```

Example:

```text
Benang Jahit / Teratai / Abu Muda
25 KG
```

After classification, the output becomes active stock in Stocklist.

### 8.6 Stocklist

Stocklist is the operational list of active stock by warehouse.

Required columns:

```text
SKU
Product Name
Division
Sorting Stage
Warehouse
Available Quantity
Unit
HPP per Unit
Selling Price per Unit
Source Ball Code
Last Updated
```

Required filters:

```text
Warehouse
Division
SKU / Product Name search
Sorting Stage
Category
Date / Last Updated
```

Required row actions:

```text
View Stock Detail
Transfer Stock
Create Stock Out
```

### 8.7 Warehouse Transfer

A transfer moves active stock from one warehouse to another.

Required fields:

```text
Transfer Date
Source Warehouse
Destination Warehouse
Stock Lot / SKU
Quantity
Note
```

Rules:

```text
Source and destination warehouse must differ.
Quantity must be greater than zero.
Quantity cannot exceed available stock.
Source balance decreases.
Destination balance increases.
Both changes must be saved atomically.
Movement history must preserve one transfer reference.
```

### 8.8 Stock Out

Stock Out represents goods physically leaving a warehouse.

Required fields:

```text
Stock Out Date
Source Warehouse
Stock Lot / SKU
Quantity
Packing Request Reference
Sales Type
Sales Channel / Platform
Invoice or SPK Reference
Note
```

Seed Sales Type options:

```text
ONLINE
OFFLINE
```

Seed sales channels:

```text
Shopee
TikTok
Retail
RUD
Oajet Nux
Paket Pilih
```

Rules:

```text
Quantity must be greater than zero.
Quantity cannot exceed available stock.
Stock decreases only after valid submission.
A stock-out movement must be created.
Stock Detail must display the event in history.
```

### 8.9 Traceability

Stock Detail must show a chronological movement timeline.

Example:

```text
Ball BL-2026-0001 created
→ Sortir 0 selected STOKLOT
→ Sortir 1 created STL-DWS-HOODIE, 20 PCS
→ Transfer 8 PCS from Gudang Sortir to Gudang Retail
→ Stock Out 3 PCS from Gudang Retail
```

The Stock Detail page must clearly display its original Ball Code.

---

## 9. Required Application Routes

Use Next.js App Router.

Public route:

```text
/login
```

Authenticated routes:

```text
/dashboard

/balls
/balls/new
/balls/[ballId]
/balls/[ballId]/sortir-0
/balls/[ballId]/sortir-1
/balls/[ballId]/accessories-classification

/stocklist
/stocklist/[stockLotId]

/transfers
/transfers/new

/stock-out
/stock-out/new

/movements

/master-data
/master-data/warehouses
/master-data/categories
/master-data/product-types
/master-data/units
/master-data/sales-channels
```

Master data screens can be simple tables and create/edit forms. Do not overbuild advanced management UI.

---

## 10. Dashboard Requirements

The dashboard is operational, not decorative.

Required summary cards:

```text
Total Stok Aktif
Stok Gudang Sortir
Stok Gudang Retail
Stok Gudang Grosir
Total Stoklot
Total Accessories
Barang Keluar Terbaru
```

Required dashboard sections:

```text
Ball / Batch Terbaru
Pergerakan Stok Terbaru
Stok Rendah atau Stok Habis (basic)
```

Charts are optional. Tables and actionable information are more important.

---

## 11. UX and Code Quality Rules

### 11.1 UX Rules

1. Use Indonesian for all visible labels, status text, validation errors, empty states, and notifications.

2. Build desktop-first because the main users are warehouse and admin staff.

3. Keep the app responsive for tablet and mobile browser.

4. Prioritize fast data entry, readable tables, clear quantity visibility, and movement history.

5. Use full-page forms for Add Ball and Sortir 1.

6. Use Dialog or Sheet for quick actions such as transfer and stock out where it improves speed.

7. Use clear badges for statuses.

8. Avoid generic SaaS dashboard styling, excessive gradients, excessive charts, and decorative clutter.

### 11.2 Code Quality Rules

1. Use TypeScript strictly.

2. Use Zod validation for all form mutations.

3. Use server-side validation for all business rules.

4. Use Prisma transactions for:
   - Sortir 1;
   - Accessories classification;
   - warehouse transfer;
   - stock out.

5. Keep business logic outside page components whenever possible.

6. Use reusable components for:
   - app sidebar;
   - page header;
   - data table;
   - filter bar;
   - status badge;
   - form field wrapper;
   - empty state;
   - loading skeleton;
   - inventory movement timeline.

7. Avoid large page files. Extract domain-specific UI and server actions into organized modules.

8. Do not create abstractions without a current use case.

9. Do not create generic repositories, factories, event buses, CQRS layers, or microservices for this demo.

10. Prefer simple domain functions with explicit names.

---

## 12. Recommended Project Structure

Use a clear and small structure.

```text
app/
  (auth)/
    login/
  (dashboard)/
    dashboard/
    balls/
    stocklist/
    transfers/
    stock-out/
    movements/
    master-data/

components/
  ui/                  # shadcn/ui generated components
  layout/              # sidebar, header, navigation
  inventory/           # stock cards, movement timeline, stock forms
  balls/               # Ball forms, Ball status, Sortir forms
  shared/              # data table, page header, empty state

lib/
  auth/
  db/
  inventory/
  validations/
  utils/

prisma/
  schema.prisma
  seed.ts

public/
  demo/
    balls/
    products/

docs/
  00-project-context.md
```

Do not force this exact structure if a small improvement is clearly needed, but keep the project simple and discoverable.

---

## 13. Environment Variables

Use environment variables for all secrets.

Required local and Vercel variables:

```text
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
AUTH_URL=
```

Rules:

```text
Never commit real secrets.
Use .env.local for local work.
Use Vercel Environment Variables for deployed demo.
Never expose database credentials to client-side code.
Do not hardcode environment-specific URLs.
```

---

## 14. Demo Acceptance Criteria

The demo is complete only when these scenarios work end-to-end:

1. User logs in with a seeded account.
2. Inventory Admin creates a Ball record.
3. Inventory Admin runs Sortir 0 and selects STOKLOT.
4. Inventory Admin runs Sortir 1 with multiple output rows.
5. Each Sortir 1 result appears in Stocklist with generated SKU.
6. User transfers stock between warehouses.
7. User creates Stock Out from a selected warehouse.
8. Quantity updates correctly after transfer and Stock Out.
9. Stock Detail shows Ball source and chronological movement history.
10. Application deploys to Vercel and persists data in Neon PostgreSQL.
11. The UI is presentation-ready for a client demo.

---

## 15. Implementation Order

Implement in this order:

```text
1. Project setup, Tailwind, shadcn/ui, Prisma, Neon connection
2. Credential authentication and seeded users
3. App shell, sidebar, navigation, protected routes
4. Master data seed and basic management pages
5. Ball / Batch CRUD
6. Sortir 0
7. Sortir 1 with multiple output rows and Prisma transaction
8. Stocklist and Stock Detail history
9. Warehouse transfer
10. Stock Out
11. Dashboard data wiring
12. Seeded end-to-end demo scenario
13. Vercel deployment readiness and final QA
```

Do not begin Sortir 2 through Sortir 5 until this demo is approved.

---

## 16. Required Working Style for Codex

Before implementing a task:

1. Read this document.
2. Read the relevant future documents in `/docs`.
3. Implement only the requested task or sprint.
4. Do not add excluded features.
5. Keep code simple and production-minded.
6. Run validation, linting, and relevant tests where available.
7. Return a concise summary containing:
   - completed work;
   - files changed;
   - migrations or seed changes;
   - manual verification steps;
   - known limitations.

If a requirement is unclear, choose the simplest interpretation that preserves the business rules and does not expand scope.
