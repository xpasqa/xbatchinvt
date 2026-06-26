# Ball Fashion Inventory Demo
## 07 — Sprint Plan and Delivery Milestones

> **Purpose:** This document converts the product scope into six focused implementation sprints.
>
> Each sprint must end with a working, reviewable result.
>
> Do not start a later sprint before the prior sprint is stable enough to demo.

---

## 1. Sprint Plan Overview

| Sprint | Name | Main Outcome | Demo Checkpoint |
|---|---|---|---|
| Sprint 1 | Foundation & Login | User can log in and access the role-aware application shell | Login and protected dashboard work |
| Sprint 2 | Ball / Batch Intake | User can record incoming Ball and choose Stoklot or Accessories | Ball lifecycle begins correctly |
| Sprint 3 | Sortir 1 & Classification | Ball becomes active sellable stock in Stocklist | Ball → stock workflow works |
| Sprint 4 | Stocklist & Traceability | User can inspect current stock and origin history | SKU can be traced to source Ball |
| Sprint 5 | Warehouse Transfer | User can move stock between warehouses safely | Stock moves correctly across warehouses |
| Sprint 6 | Stock Out, QA & Demo Polish | User can release stock and demo full workflow | End-to-end client demo is ready |

---

## 2. Sprint Operating Rules

Every sprint must follow these rules:

```text
Build only the scope defined for the sprint.
Use shadcn/ui for all standard visible UI.
Use Indonesian for all visible UI text.
Use Zod validation for all mutation forms.
Enforce role permissions server-side.
Use Prisma transactions for inventory mutations.
Use seeded data where needed.
Run typecheck and lint before declaring sprint complete.
Do not begin excluded future features.
```

At the end of each sprint, Codex must report:

```text
Completed work
Files changed
Migration / seed changes
Manual verification steps
Known limitations
```

---

# Sprint 1 — Foundation & Login

## 1. Goal

Create a stable project foundation with authentication, app navigation, role awareness, database connection, and a minimal database-backed dashboard shell.

The result must make the application feel like a real system from the first login.

---

## 2. Scope

Sprint 1 includes:

```text
Next.js App Router project setup
TypeScript
Tailwind CSS
shadcn/ui setup
Lucide React
Neon PostgreSQL connection
Prisma ORM setup
Initial Prisma migration
Credential-based login
Password hashing
Seed demo users
Protected routes
Role-aware sidebar navigation
Dashboard shell
Basic database-backed dashboard cards
Environment variable example
```

Sprint 1 does not include:

```text
Ball / Batch
Sortir
Stocklist
Transfer
Stock Out
Master Data UI
Inventory mutation
```

---

## 3. Required Routes

```text
/login
/dashboard
```

---

## 4. Required Seed Data

Create only the minimum foundation data:

```text
Users:
- Owner Demo
- Admin Inventory Demo
- Admin Gudang Demo

Warehouses:
- Gudang Sortir
- Gudang Retail
- Gudang Grosir
```

The dashboard may show zero stock values until later sprints, but values must come from database queries rather than hardcoded arrays.

---

## 5. Required UI

### Login Page

Use shadcn/ui Card, Input, Button, Form, and Sonner.

Include:

```text
Product name
Short description
Email field
Password field
Login button
Demo account helper
```

### Authenticated App Shell

Include:

```text
Sidebar
Top header
User menu
Role badge
Logout action
Breadcrumb or page context
```

### Dashboard Shell

Show:

```text
Total Stok Aktif
Stok Gudang Sortir
Stok Gudang Retail
Stok Gudang Grosir
Total Stoklot
Total Accessories
```

It is acceptable for all values to be zero during Sprint 1, but data must be queried from database.

---

## 6. Acceptance Criteria

```text
[ ] Project runs locally.
[ ] Prisma connects to Neon PostgreSQL.
[ ] Initial migration succeeds.
[ ] Seed users can be created.
[ ] Seed users can log in.
[ ] Password is hashed, never stored in plaintext.
[ ] Unauthenticated user is redirected to /login.
[ ] Authenticated user is redirected away from /login.
[ ] Owner sees all navigation.
[ ] Admin Gudang does not see restricted navigation.
[ ] Direct access to restricted pages is blocked server-side.
[ ] Dashboard uses database-backed queries.
[ ] Typecheck and lint pass.
```

---

## 7. Demo Checkpoint

Demonstrate:

```text
Login as Owner
→ view dashboard
→ open navigation
→ logout
→ login as Admin Gudang
→ confirm restricted navigation is hidden
```

---

# Sprint 2 — Ball / Batch Intake and Sortir 0

## 1. Goal

Allow Owner and Admin Inventory to record incoming Ball / Batch data, inspect Ball details, and determine whether a Ball follows the Stoklot or Accessories workflow.

The result must establish the beginning of traceability.

---

## 2. Scope

Sprint 2 includes:

```text
Master data seed completion
Ball list
Add Ball form
Ball detail
Ball status badge
Ball activity history
Ball static image path support
Sortir 0 division selection
Role restrictions
```

Sprint 2 does not include:

```text
Sortir 1
Accessories classification output
Stocklist
Transfer
Stock Out
```

---

## 3. Required Routes

```text
/balls
/balls/new
/balls/[ballId]
/balls/[ballId]/sortir-0
```

---

## 4. Required Master Data

Seed and make queryable:

```text
Warehouses
Categories
Product Types
Units
Sales Channels
```

Master Data management UI may be postponed until Sprint 6 if needed, but seed values must exist in database now.

---

## 5. Required Ball Fields

```text
Ball Code
Received Date
Supplier / Source
Initial Warehouse
Purchase Cost
Estimated Quantity
Unit
Notes
Optional static image path
```

Default status:

```text
WAITING_SORTIR_0
```

---

## 6. Sortir 0 Rules

```text
WAITING_SORTIR_0
→ STOKLOT
→ READY_FOR_SORTIR_1

WAITING_SORTIR_0
→ ACCESSORIES
→ READY_FOR_ACCESSORIES_CLASSIFICATION
```

Sortir 0 must create a Ball Activity record.

---

## 7. Acceptance Criteria

```text
[ ] Owner and Admin Inventory can create Ball.
[ ] Admin Gudang cannot create Ball.
[ ] Ball Code uniqueness is enforced.
[ ] Ball List uses database data.
[ ] Ball Detail displays full Ball information.
[ ] Ball Detail shows current status.
[ ] Sortir 0 only works for WAITING_SORTIR_0 Ball.
[ ] Choosing STOKLOT changes status correctly.
[ ] Choosing ACCESSORIES changes status correctly.
[ ] Ball activity history records Ball creation and Sortir 0.
[ ] Unauthorized direct route access is blocked.
[ ] No Ball appears in Stocklist yet.
```

---

## 8. Demo Checkpoint

Demonstrate:

```text
Create Ball BL-2026-0099
→ open Ball Detail
→ show status Menunggu Sortir 0
→ run Sortir 0
→ choose Stoklot
→ show status Siap Sortir 1
```

---

# Sprint 3 — Sortir 1 and Accessories Classification

## 1. Goal

Transform Ball / Batch records into active sellable stock.

This is the core business sprint.

---

## 2. Scope

Sprint 3 includes:

```text
Sortir 1 form
Multiple output rows
Product Variant creation or reuse
Generated SKU
Stock Lot creation
Sortir Session
Sortir Result
Inventory Movement creation
Accessories Classification form
Transactional mutation logic
Ball status update
Ball activity update
```

Sprint 3 does not include:

```text
Advanced Stocklist filters
Warehouse transfer
Stock Out
Sortir 2 to Sortir 5
```

---

## 3. Required Routes

```text
/balls/[ballId]/sortir-1
/balls/[ballId]/accessories-classification
```

---

## 4. Sortir 1 Required Inputs

Per result row:

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

The form must allow:

```text
Add Result Row
Remove Result Row
Submit All Results
```

---

## 5. Accessories Classification Inputs

Per result row:

```text
Accessory Category
Accessory Type / Specification
Color / Variant
Quantity
Unit
HPP per Unit
Selling Price per Unit
Destination Warehouse
Optional Note
```

---

## 6. Technical Requirement

All writes for one Sortir 1 submission must happen in one Prisma transaction.

All writes for one Accessories Classification submission must happen in one Prisma transaction.

If one result row is invalid:

```text
Save nothing.
Show clear Indonesian validation errors.
```

---

## 7. Acceptance Criteria

```text
[ ] Stoklot Ball can run Sortir 1 only when READY_FOR_SORTIR_1 or PARTIALLY_CLASSIFIED.
[ ] Accessories Ball can run classification only when READY_FOR_ACCESSORIES_CLASSIFICATION or PARTIALLY_CLASSIFIED.
[ ] User can add multiple output rows.
[ ] Product Variant is created or reused deterministically.
[ ] SKU is generated automatically.
[ ] Each output creates a Stock Lot linked to source Ball.
[ ] Each output creates an inventory movement.
[ ] Ball becomes PARTIALLY_CLASSIFIED.
[ ] Ball activity is updated.
[ ] Result stock is sellable.
[ ] Invalid rows create no partial data.
[ ] Admin Gudang cannot perform classification.
```

---

## 8. Demo Checkpoint

Demonstrate:

```text
Open Ball BL-2026-0099
→ run Sortir 1
→ create:
   Dewasa / Hoodie / 10 PCS / Gudang Sortir
   Anak / T-Shirt Man / 8 PCS / Gudang Retail
→ save
→ show generated SKU and active stock output
```

---

# Sprint 4 — Stocklist and Traceability

## 1. Goal

Allow users to see current active stock, search and filter it, open stock details, and trace stock to the original Ball.

---

## 2. Scope

Sprint 4 includes:

```text
Stocklist page
Database-backed stock table
Stock filters
Stock detail page
Overview tab
Movement timeline
Source Ball tab
Low / zero stock status
Dashboard real inventory totals
Recent Ball and movement sections
```

Sprint 4 does not include:

```text
Warehouse transfer
Stock Out
Return
Adjustment
Stock opname
```

---

## 3. Required Routes

```text
/stocklist
/stocklist/[stockLotId]
/dashboard
/movements
```

---

## 4. Required Stocklist Columns

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
Actions
```

---

## 5. Required Filters

```text
Warehouse
Division
SKU / Product Name
Sorting Stage
Category
Last Updated
```

---

## 6. Required Stock Detail Sections

```text
Overview
Movement History
Source Ball
```

The Stock Detail page must show:

```text
Current quantity
Warehouse
Source Ball
HPP
Selling price
All related movements
```

---

## 7. Acceptance Criteria

```text
[ ] Stocklist is fully database-backed.
[ ] Stocklist shows Stoklot and Accessories data.
[ ] Search and filters work.
[ ] Zero-stock records remain traceable.
[ ] Stock Detail links to original Ball.
[ ] Movement timeline is chronological.
[ ] Sortir 1 and Accessories movements are visible.
[ ] Dashboard totals come from real stock data.
[ ] Dashboard recent lists use real database records.
[ ] No direct quantity editing exists.
```

---

## 8. Demo Checkpoint

Demonstrate:

```text
Open Stocklist
→ filter Gudang Retail
→ search generated Hoodie SKU
→ open Stock Detail
→ show source Ball
→ show Sortir 1 movement history
```

---

# Sprint 5 — Warehouse Transfer

## 1. Goal

Allow authorized users to transfer active stock between Gudang Sortir, Gudang Retail, and Gudang Grosir safely and transparently.

---

## 2. Scope

Sprint 5 includes:

```text
Transfer List
New Transfer form
Preselected Stock Lot support
Source balance validation
Destination Stock Lot creation or update
Warehouse Transfer reference
TRANSFER_OUT movement
TRANSFER_IN movement
Stock detail transfer history
```

Sprint 5 does not include:

```text
Transfer approval
Multi-step shipment workflow
Receiving confirmation
Return transfer
Barcode scanning
```

---

## 3. Required Routes

```text
/transfers
/transfers/new
```

---

## 4. Required Inputs

```text
Transfer Date
Source Warehouse
Stock Lot / SKU
Read-only available quantity
Quantity
Destination Warehouse
Optional Note
```

---

## 5. Business Rules

```text
Source and destination warehouses cannot be the same.
Quantity must be greater than zero.
Quantity cannot exceed source available quantity.
Source stock must belong to selected source warehouse.
Transfer must use one Prisma transaction.
Source balance decreases.
Destination balance increases.
Two movements are created.
Movements share a transfer reference.
```

---

## 6. Acceptance Criteria

```text
[ ] Owner, Admin Inventory, and Admin Gudang can create transfer.
[ ] Source quantity validation works.
[ ] Same-warehouse transfer is rejected.
[ ] Source balance decreases correctly.
[ ] Destination balance increases correctly.
[ ] Transfer list shows completed transfer.
[ ] Stock Detail timeline displays transfer history.
[ ] Over-transfer is blocked.
[ ] Database writes are atomic.
```

---

## 7. Demo Checkpoint

Demonstrate:

```text
Open Hoodie stock in Gudang Sortir
→ Transfer 3 PCS to Gudang Retail
→ return to Stocklist
→ confirm Gudang Sortir decreases
→ confirm Gudang Retail increases
→ open history and show paired transfer movements
```

---

# Sprint 6 — Stock Out, QA, and Demo Polish

## 1. Goal

Complete the core workflow by recording goods leaving a warehouse, then prepare the system for live client presentation and Vercel deployment.

---

## 2. Scope

Sprint 6 includes:

```text
Stock Out List
New Stock Out form
Sales Type
Sales Channel
Packing Request Reference
Invoice / SPK Reference
Stock quantity reduction
STOCK_OUT movement
Dashboard update
Master Data UI basics if not completed
Seed data completion
Role QA
Responsive QA
Vercel readiness
```

Sprint 6 does not include:

```text
Return
Accounting
KPI
Marketplace integration
Sortir 2 to Sortir 5
```

---

## 3. Required Routes

```text
/stock-out
/stock-out/new
/master-data
/master-data/warehouses
/master-data/categories
/master-data/product-types
/master-data/units
/master-data/sales-channels
```

Master Data pages should be completed only at the level needed to support demo credibility. Do not overbuild admin configuration.

---

## 4. Required Stock Out Inputs

```text
Stock Out Date
Source Warehouse
Stock Lot / SKU
Read-only available quantity
Quantity
Packing Request Reference
Sales Type
Sales Channel
Invoice / SPK Reference
Optional Note
```

---

## 5. Business Rules

```text
Selected Stock Lot must belong to source warehouse.
Quantity must be greater than zero.
Quantity cannot exceed available stock.
Sales Type is required.
Sales Channel is required.
Stock Out must use one Prisma transaction.
Available quantity decreases.
STOCK_OUT movement is created.
Dashboard and Stocklist update after success.
```

---

## 6. Final QA Scope

Complete these before marking Sprint 6 done:

```text
Role permissions
Form validation
Empty states
Loading states
Error states
Mobile / tablet layout review
Seed data quality
No broken routes
No unfinished UI
No hardcoded dashboard totals
No console errors
Production build
Vercel deployment configuration
```

---

## 7. Acceptance Criteria

```text
[ ] Stock Out can be created from valid stock.
[ ] Over-stock-out is rejected.
[ ] Stock quantity updates correctly.
[ ] Stock Out appears in list.
[ ] Stock Detail history updates.
[ ] Dashboard values update from database.
[ ] All three demo roles work as expected.
[ ] Seed data supports a full sales demo.
[ ] App builds successfully.
[ ] App is Vercel-ready.
```

---

## 8. Demo Checkpoint

Demonstrate the full end-to-end flow:

```text
Login
→ Add Ball
→ Sortir 0
→ Sortir 1
→ Stocklist
→ Transfer Gudang
→ Stock Out
→ Stock Detail Traceability
```

Then show the future direction:

```text
Sortir 2 to Sortir 5
Stock Opname
Laporan
KPI
Integrasi Keuangan
```

These future features must be discussed only as roadmap items, not shown as completed features.

---

## 3. Final Sprint Deliverables

At the completion of all six sprints, the demo must include:

```text
Working Vercel-compatible Next.js web application
Neon PostgreSQL database
Credential login with 3 roles
Dashboard
Ball / Batch module
Sortir 0
Sortir 1
Accessories classification
Stocklist
Stock detail and traceability
Warehouse transfer
Stock out
Movement log
Basic master data
Seeded presentation-ready data
Static demo images
Documentation in /docs
```

---

## 4. Final Acceptance Test

Run this final test in the deployed environment:

```text
1. Login as Admin Inventory.
2. Create Ball BL-2026-LIVE-001.
3. Complete Sortir 0 as Stoklot.
4. Complete Sortir 1 with two outputs.
5. Verify Stocklist.
6. Transfer one output from Gudang Sortir to Gudang Retail.
7. Create Stock Out from Gudang Retail.
8. Open Stock Detail.
9. Verify source Ball, Sortir, Transfer, and Stock Out timeline.
10. Log in as Admin Gudang.
11. Verify that Ball creation and Master Data are blocked.
12. Log in as Owner.
13. Verify dashboard and all records are visible.
```

The project is demo-ready only after this test succeeds without manual database correction.
