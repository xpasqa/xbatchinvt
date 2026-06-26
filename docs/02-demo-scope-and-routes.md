# Ball Fashion Inventory Demo
## 02 — Demo Scope, Routes, Screens, and Acceptance Criteria

> **Purpose:** This document defines exactly what Codex must build for the demo UI and application routes.
>
> Read together with:
>
> - `docs/00-project-context.md`
> - `docs/01-business-rules.md`
>
> This document focuses on pages, navigation, forms, interactions, visible UI requirements, and acceptance criteria.
>
> Build only the screens and flows described here.

---

## 1. Demo Scope Summary

The demo must support one complete end-to-end inventory workflow:

```text
Login
→ Dashboard
→ Create Ball / Batch
→ Sortir 0
→ Sortir 1 or Accessories Classification
→ Stocklist
→ Stock Detail / Traceability
→ Warehouse Transfer
→ Stock Out
→ Movement Log
```

The demo is intended for a live client presentation. It must feel coherent and operational from the first screen.

The demo must not look like an unfinished admin panel with empty data.

Use seeded Neon PostgreSQL data so that dashboard, lists, tables, and movement history are present immediately after first deployment.

---

## 2. Main Application Navigation

Use a desktop-first sidebar layout built with shadcn/ui components and Lucide React icons.

Sidebar navigation items:

```text
Dashboard
Ball / Batch
Stocklist
Transfer Gudang
Barang Keluar
Riwayat Pergerakan
Master Data
```

Optional sidebar footer:

```text
Current User
Role Badge
Logout
```

### 2.1 Navigation Visibility by Role

| Menu | Owner | Admin Inventory | Admin Gudang |
|---|---:|---:|---:|
| Dashboard | Yes | Yes | Yes |
| Ball / Batch | Yes | Yes | View only |
| Stocklist | Yes | Yes | Yes |
| Transfer Gudang | Yes | Yes | Yes |
| Barang Keluar | Yes | Yes | Yes |
| Riwayat Pergerakan | Yes | Yes | Yes |
| Master Data | Yes | Yes | No |

If a user does not have permission, hide the menu item and also protect the route server-side.

---

## 3. Global UI Rules

### 3.1 Visual Style

The UI should be:

```text
Clean
Operational
Modern
Desktop-first
Simple
Data-focused
Easy to demo
```

Avoid:

```text
Overly decorative charts
Too many gradients
Marketing landing-page style inside dashboard
Excessive animation
Dense unreadable tables
Dark complex control panels
```

### 3.2 Required Layout Elements

Every authenticated page should have:

```text
Sidebar
Top bar
Breadcrumbs
Page title
Short page description when useful
Primary action button when relevant
Main content area
```

Examples:

```text
Title: Ball / Batch
Description: Kelola barang masuk sebelum proses sortir.
Primary Action: + Tambah Ball
```

### 3.3 Common Components

Use shadcn/ui primitives where applicable.

Create reusable components for:

```text
AppSidebar
AppHeader
PageHeader
RoleBadge
StatusBadge
DataTable
DataTableToolbar
EmptyState
LoadingState
ConfirmActionDialog
MovementTimeline
MoneyDisplay
QuantityDisplay
WarehouseBadge
```

Do not build one-off visual variants unnecessarily.

### 3.4 Language

All visible text must be Indonesian.

Examples:

```text
Tambah Ball
Simpan
Batal
Lihat Detail
Pindahkan Stok
Barang Keluar
Stok Tersedia
Riwayat Pergerakan
Tidak ada data
Data berhasil disimpan
```

---

## 4. Public Route

## 4.1 Login

Route:

```text
/login
```

### Purpose

Allow seeded demo users to enter the application.

### UI Requirements

Use a centered Card layout with:

```text
Product name
Short description
Email input
Password input
Login button
Demo account helper section
```

Suggested visible content:

```text
Ball Fashion Inventory
Sistem operasional untuk Ball, Sortir, Gudang, dan Stocklist.

Akun Demo:
Owner
owner@ballfashion.demo

Admin Inventory
admin@ballfashion.demo

Admin Gudang
warehouse@ballfashion.demo
```

For demo convenience, it is acceptable to show all demo account emails and the shared demo password.

### Validation

```text
Email is required
Password is required
Invalid credentials show a clear Indonesian error
```

### Acceptance Criteria

```text
A seeded user can log in successfully.
Invalid credentials are rejected.
Authenticated user is redirected to /dashboard.
Authenticated user visiting /login is redirected to /dashboard.
```

---

## 5. Dashboard

Route:

```text
/dashboard
```

### Purpose

Give immediate operational visibility after login.

### Required Summary Cards

```text
Total Stok Aktif
Stok Gudang Sortir
Stok Gudang Retail
Stok Gudang Grosir
Total Stoklot
Total Accessories
```

Each card should include:

```text
Title
Primary quantity
Unit helper text or stock item count
Relevant Lucide icon
```

Do not overuse chart widgets.

### Required Sections

#### A. Ball / Batch Terbaru

Show a compact table or card list with:

```text
Ball Code
Supplier / Source
Tanggal Masuk
Division / Status
Action: Lihat Detail
```

#### B. Pergerakan Stok Terbaru

Show latest movements:

```text
Date / Time
Movement Type
SKU / Product Name
Quantity
Warehouse / Direction
Actor
```

#### C. Stok Rendah atau Habis

Show Stock Lots with:

```text
SKU
Product Name
Warehouse
Available Quantity
Status
```

For demo simplicity:

```text
Quantity = 0 → Stok Habis
Quantity between 1 and 3 → Stok Rendah
```

This threshold may be hardcoded for demo only.

### Dashboard Actions

Provide quick actions:

```text
+ Tambah Ball
Lihat Stocklist
Transfer Stok
Barang Keluar
```

### Acceptance Criteria

```text
Dashboard loads data from database.
Summary values are not hardcoded.
Recent Ball, movements, and stock alerts are visible with seed data.
Action buttons route to correct pages.
```

---

## 6. Ball / Batch Module

## 6.1 Ball List

Route:

```text
/balls
```

### Purpose

List all incoming Ball / Batch records and their processing status.

### Required Columns

```text
Ball Code
Tanggal Masuk
Supplier / Source
Divisi
Gudang Awal
Estimasi Quantity
Satuan
Status
Last Updated
Action
```

### Required Filters

```text
Search by Ball Code or Supplier
Status
Division
Date range or received date
```

### Required Actions

```text
Tambah Ball
Lihat Detail
Lanjutkan Sortir 0
Lanjutkan Sortir 1
Klasifikasi Accessories
```

The available action depends on Ball state.

Action rules:

```text
WAITING_SORTIR_0
→ Show: Sortir 0

READY_FOR_SORTIR_1
→ Show: Sortir 1

READY_FOR_ACCESSORIES_CLASSIFICATION
→ Show: Klasifikasi Accessories

PARTIALLY_CLASSIFIED
→ Show: Lihat Detail, optional lanjutkan proses
```

### Empty State

Use an EmptyState component:

```text
Belum ada Ball atau Batch
Mulai tambahkan barang masuk untuk diproses ke sortir.
```

### Acceptance Criteria

```text
List data comes from database.
Filters work.
Role restrictions work.
Action buttons reflect correct Ball status.
```

---

## 6.2 Add Ball

Route:

```text
/balls/new
```

### Purpose

Create an incoming Ball / Batch record.

### Form Layout

Use a full-page form, not a dialog.

Use one main Card with grouped fields.

#### Section: Informasi Ball / Batch

```text
Ball Code
Tanggal Masuk
Supplier / Asal Barang
Gudang Awal
Harga Modal
Estimasi Quantity
Satuan
Catatan
Gambar Demo (optional static image selector)
```

### Field Requirements

| Field | UI Component | Required |
|---|---|---:|
| Ball Code | Input | Yes |
| Tanggal Masuk | Calendar + Popover | Yes |
| Supplier / Asal Barang | Input | Yes |
| Gudang Awal | Select | Yes |
| Harga Modal | Input type number | Yes |
| Estimasi Quantity | Input type number | No |
| Satuan | Select | Yes |
| Catatan | Textarea | No |
| Gambar Demo | Select | No |

Default warehouse:

```text
Gudang Sortir
```

Default status after save:

```text
WAITING_SORTIR_0
```

### Actions

```text
Batal
Simpan Ball
```

After save:

```text
Show success toast.
Redirect to /balls/[ballId].
```

### Acceptance Criteria

```text
Valid Ball is persisted to database.
Invalid form shows Indonesian validation errors.
Ball Code duplicate is rejected.
New Ball detail shows status WAITING_SORTIR_0.
```

---

## 6.3 Ball Detail

Route:

```text
/balls/[ballId]
```

### Purpose

Show complete information and workflow state for a Ball / Batch.

### Required Sections

#### A. Header

```text
Ball Code
Status Badge
Division Badge when selected
Actions based on current status
```

#### B. Ball Information Card

```text
Tanggal Masuk
Supplier / Source
Gudang Awal
Harga Modal
Estimasi Quantity
Satuan
Catatan
Created By
```

#### C. Workflow Progress Card

Show the current operational status.

Example:

```text
1. Ball Masuk — Selesai
2. Sortir 0 — Menunggu / Selesai
3. Sortir 1 / Klasifikasi — Menunggu / Selesai
4. Stocklist — Aktif jika output exists
```

Do not show Sortir 2–5 as implemented actions. They can appear as disabled “Fase Lanjutan” labels only if needed.

#### D. Output Stock Section

If output stock exists, show table:

```text
SKU
Product Name
Warehouse
Quantity
Unit
HPP
Selling Price
Action: Lihat Stock Detail
```

#### E. Activity History

Show timeline:

```text
Ball dibuat
Sortir 0 dipilih
Sortir 1 dibuat
Accessories diklasifikasikan
```

### Contextual Primary Actions

```text
WAITING_SORTIR_0
→ Mulai Sortir 0

READY_FOR_SORTIR_1
→ Mulai Sortir 1

READY_FOR_ACCESSORIES_CLASSIFICATION
→ Klasifikasi Accessories
```

### Acceptance Criteria

```text
Ball details load from database.
Relevant workflow action appears based on status.
Output stocks link to Stock Detail.
Activity history is chronological.
```

---

## 7. Sortir 0 Screen

Route:

```text
/balls/[ballId]/sortir-0
```

### Purpose

Choose the Ball division.

### UI Requirements

Use a full-page Card layout.

Show Ball summary at top:

```text
Ball Code
Supplier
Tanggal Masuk
Gudang Awal
Estimated Quantity
Unit
```

Show two large selectable cards:

```text
Stoklot
Fashion sisa pabrik yang dapat melalui proses sortir bertahap.

Accessories
Benang, zipper, karet, dan barang pendukung lain.
```

Use Card, Button, and Alert Dialog confirmation.

### Action Flow

```text
Choose division
→ Show confirmation dialog
→ Confirm
→ Submit server action
→ Toast success
→ Redirect to Ball Detail
```

### Acceptance Criteria

```text
Only authorized roles can access.
Only Ball with WAITING_SORTIR_0 can be processed.
Selecting STOKLOT updates status to READY_FOR_SORTIR_1.
Selecting ACCESSORIES updates status to READY_FOR_ACCESSORIES_CLASSIFICATION.
An activity record is created.
```

---

## 8. Sortir 1 Screen

Route:

```text
/balls/[ballId]/sortir-1
```

### Purpose

Create active Stoklot stock from one Ball.

### Screen Structure

Use a full-page operational form.

#### A. Ball Summary Card

Show:

```text
Ball Code
Supplier
Gudang Awal
Estimated Quantity
Unit
Status
```

#### B. Instruction Notice

Show concise note:

```text
Sortir 1 adalah tahap minimum agar stok dapat masuk Stocklist dan dijual.
Satu Ball dapat menghasilkan beberapa kategori dan jenis produk.
```

Use Alert or Card.

#### C. Result Rows Table

This is the core interaction.

Each row must contain:

```text
Category
Product Type
Quantity
Unit
HPP per Unit
Harga Jual per Unit
Gudang Tujuan
Catatan
Remove Row action
```

The user must be able to:

```text
+ Tambah Baris Hasil
Hapus Baris
```

Initial form contains one empty result row.

Use shadcn/ui:

```text
Table
Select
Input
Button
Form
Card
Alert
```

### Seed Options

Category:

```text
Dewasa
Anak
```

Product Type:

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

Warehouse:

```text
Gudang Sortir
Gudang Retail
Gudang Grosir
```

Unit:

```text
PCS
```

For Stoklot demo, default to PCS and allow only PCS unless the data model requires otherwise.

### Summary Area

At bottom or side card show:

```text
Jumlah Baris Hasil
Total Quantity Hasil
Estimated Quantity Ball
Warning if total output is above estimated quantity
```

Important:

If Ball Estimated Quantity is missing or not reliable, show no blocking validation based on it.

### Actions

```text
Batal
Simpan Hasil Sortir 1
```

### Submit Behavior

On success:

```text
Create product variants if needed.
Create stock lots.
Create inventory movements.
Update Ball to PARTIALLY_CLASSIFIED.
Show success toast.
Redirect to Ball Detail or Stocklist.
```

### Acceptance Criteria

```text
User can add multiple output rows.
Each row validates required fields.
Invalid quantity cannot be submitted.
One submission creates all rows atomically.
Created rows appear in Stocklist.
Generated SKU is visible after save.
```

---

## 9. Accessories Classification Screen

Route:

```text
/balls/[ballId]/accessories-classification
```

### Purpose

Classify an Accessories Ball into active Stocklist items.

### Screen Structure

Similar to Sortir 1 but with fields:

```text
Accessory Category
Accessory Type / Specification
Color / Variant
Quantity
Unit
HPP per Unit
Harga Jual per Unit
Gudang Tujuan
Catatan
```

The user can add multiple result rows.

Seed initial example options:

```text
Accessory Category:
Benang Jahit
Zipper
Karet
Label
Lainnya

Unit:
PCS
KG
ROLL
PACK
```

### Acceptance Criteria

```text
Only ACCESSORIES Ball can access the page.
Multiple classification rows can be created.
Stock appears in Stocklist after save.
Generated Accessories SKU appears.
```

---

## 10. Stocklist

Route:

```text
/stocklist
```

### Purpose

Show all current active stock by warehouse.

### Required Columns

```text
SKU
Nama Produk
Divisi
Tahap Sortir
Gudang
Stok Tersedia
Satuan
HPP
Harga Jual
Ball Asal
Terakhir Diperbarui
Aksi
```

### Required Filters

Use a reusable DataTable toolbar.

```text
Cari SKU / Nama Produk
Gudang
Divisi
Tahap Sortir
Kategori
Tanggal Pembaruan
```

### Required Row Actions

```text
Lihat Detail
Transfer Stok
Barang Keluar
```

Actions may navigate to page routes or open dialogs.

For demo simplicity:

```text
Transfer Stok → /transfers/new?stockLotId=...
Barang Keluar → /stock-out/new?stockLotId=...
```

### Empty State

```text
Stocklist masih kosong
Lakukan Sortir 1 atau klasifikasi Accessories untuk membuat stok aktif.
```

### Acceptance Criteria

```text
Only Stock Lots with current available quantity >= 0 are displayed.
Zero stock can remain visible with status Stok Habis.
Filters and search work against database data.
Quantity cannot be edited from this page.
Actions pass selected stock information correctly.
```

---

## 11. Stock Detail

Route:

```text
/stocklist/[stockLotId]
```

### Purpose

Show stock balance, traceability, and full movement history.

### Header

```text
SKU
Product Name
Status Badge
Warehouse Badge
Available Quantity
```

### Required Tabs

Use shadcn/ui Tabs.

```text
Ringkasan
Riwayat Pergerakan
Ball Asal
```

#### A. Ringkasan Tab

Show:

```text
Division
Sorting Stage
Warehouse
Available Quantity
Unit
HPP per Unit
Selling Price per Unit
Last Updated
```

Show quick actions when quantity is above zero:

```text
Transfer Stok
Barang Keluar
```

#### B. Riwayat Pergerakan Tab

Use custom `MovementTimeline` built with Card, Badge, Separator, and icons.

Each item:

```text
Movement type
Date / time
Quantity
Source / destination warehouse if applicable
Actor
Reference
Note
```

#### C. Ball Asal Tab

Show Ball summary:

```text
Ball Code
Supplier
Received Date
Purchase Cost
Initial Warehouse
Ball Status
Link to Ball Detail
```

### Acceptance Criteria

```text
Stock detail clearly displays source Ball.
History is chronological.
Transfer and stock out are reflected.
Action buttons honor role permissions.
```

---

## 12. Warehouse Transfer

## 12.1 Transfer List

Route:

```text
/transfers
```

### Required Columns

```text
Transfer Reference
Tanggal
SKU / Product
Quantity
Gudang Asal
Gudang Tujuan
Dibuat Oleh
Catatan
```

### Actions

```text
+ Transfer Stok
Lihat Detail optional
```

### Acceptance Criteria

```text
Transfer data is database-backed.
List is sorted newest first.
```

---

## 12.2 New Transfer

Route:

```text
/transfers/new
```

### Purpose

Move stock between warehouses.

### Form Fields

```text
Tanggal Transfer
Gudang Asal
Stock Lot / SKU
Stok Tersedia (read-only)
Quantity
Gudang Tujuan
Catatan
```

When route receives `stockLotId` in query string:

```text
Preselect stock lot.
Preselect source warehouse.
Show current quantity.
```

### Form Behavior

```text
Select source warehouse
→ only show Stock Lots available in source warehouse

Select Stock Lot
→ show SKU, product, available quantity, unit

Select destination warehouse
→ must differ from source warehouse
```

### Actions

```text
Batal
Simpan Transfer
```

### Submit Behavior

On success:

```text
Stock source decreases.
Destination stock increases.
Two movement entries are created.
Transfer reference is created.
Show toast.
Redirect to /transfers or selected Stock Detail.
```

### Acceptance Criteria

```text
Cannot transfer quantity above available stock.
Cannot transfer to same warehouse.
Database updates happen atomically.
Stocklist reflects both source and destination changes.
```

---

## 13. Stock Out

## 13.1 Stock Out List

Route:

```text
/stock-out
```

### Required Columns

```text
Tanggal
Reference / Invoice
SKU / Product
Quantity
Gudang Sumber
Tipe Penjualan
Channel
Dibuat Oleh
```

### Actions

```text
+ Barang Keluar
```

### Acceptance Criteria

```text
List loads from database.
Newest transaction appears first.
```

---

## 13.2 New Stock Out

Route:

```text
/stock-out/new
```

### Purpose

Record goods physically leaving a selected warehouse.

### Form Fields

```text
Tanggal Barang Keluar
Gudang Sumber
Stock Lot / SKU
Stok Tersedia (read-only)
Quantity
Packing Request Reference
Tipe Penjualan
Channel / Platform
Nomor Invoice / SPK
Catatan
```

When route receives `stockLotId`:

```text
Preselect stock lot.
Preselect source warehouse.
Show available quantity.
```

### Dynamic Option Rules

```text
If Sales Type = ONLINE
→ Suggested channels: Shopee, TikTok

If Sales Type = OFFLINE
→ Suggested channels: Retail, RUD, Oajet Nux, Paket Pilih
```

For demo, do not block a channel mismatch if master data is configured differently. Prefer clear select groups.

### Actions

```text
Batal
Simpan Barang Keluar
```

### Submit Behavior

On success:

```text
Create Stock Out transaction.
Reduce source stock quantity.
Create STOCK_OUT movement.
Show toast.
Redirect to /stock-out or selected Stock Detail.
```

### Acceptance Criteria

```text
Cannot submit quantity above available stock.
Cannot submit without Sales Type and Channel.
Stocklist quantity updates after save.
Movement timeline updates after save.
```

---

## 14. Movement Log

Route:

```text
/movements
```

### Purpose

Provide a central audit-friendly list of inventory movements.

### Required Columns

```text
Tanggal / Waktu
Jenis Pergerakan
SKU / Produk
Quantity
Satuan
Gudang Asal
Gudang Tujuan
Ball Asal
Referensi
Dibuat Oleh
```

### Required Filters

```text
Movement Type
Warehouse
SKU / Product
Ball Code
Date range
Actor
```

### Display Rules

Use human-friendly labels:

```text
SORTIR_0 → Sortir 0
SORTIR_1_IN → Hasil Sortir 1
ACCESSORIES_CLASSIFICATION_IN → Klasifikasi Accessories
TRANSFER_OUT → Transfer Keluar
TRANSFER_IN → Transfer Masuk
STOCK_OUT → Barang Keluar
```

### Acceptance Criteria

```text
Movement log is database-backed.
Movement records cannot be edited from the UI.
List supports filters.
New Sortir 1, transfer, and stock-out events appear immediately.
```

---

## 15. Master Data

Master data should be functional but intentionally simple.

## 15.1 Master Data Landing

Route:

```text
/master-data
```

Show cards linking to:

```text
Gudang
Kategori
Jenis Produk
Satuan
Channel Penjualan
```

## 15.2 Warehouses

Route:

```text
/master-data/warehouses
```

Fields:

```text
Nama Gudang
Kode Gudang
Status Aktif
```

Seed:

```text
Gudang Sortir
Gudang Retail
Gudang Grosir
```

Do not allow deletion if warehouse is used by inventory records.

## 15.3 Categories

Route:

```text
/master-data/categories
```

Seed:

```text
Dewasa
Anak
```

Fields:

```text
Nama Kategori
Kode
Status Aktif
```

## 15.4 Product Types

Route:

```text
/master-data/product-types
```

Fields:

```text
Nama Jenis
Kode
Status Aktif
```

Seed all Stage 1 Stoklot product types.

## 15.5 Units

Route:

```text
/master-data/units
```

Seed:

```text
PCS
KG
ROLL
PACK
```

Fields:

```text
Nama Satuan
Kode
Status Aktif
```

## 15.6 Sales Channels

Route:

```text
/master-data/sales-channels
```

Fields:

```text
Nama Channel
Tipe Penjualan
Status Aktif
```

Seed:

```text
Shopee — ONLINE
TikTok — ONLINE
Retail — OFFLINE
RUD — OFFLINE
Oajet Nux — OFFLINE
Paket Pilih — OFFLINE
```

### Master Data Acceptance Criteria

```text
Only Owner and Admin Inventory can access.
Seed data appears after initial setup.
Create and edit works for basic records.
Avoid complex deletion workflows in demo.
```

---

## 16. Required Demo User Journeys

Codex must verify these journeys manually.

### Journey A — Stoklot End-to-End

```text
1. Login as Admin Inventory.
2. Open Ball / Batch.
3. Create Ball BL-2026-0099.
4. Open Ball Detail.
5. Run Sortir 0 and choose Stoklot.
6. Run Sortir 1.
7. Create two results:
   - Dewasa / Hoodie / 10 PCS / Gudang Sortir
   - Anak / T-Shirt Man / 8 PCS / Gudang Retail
8. Open Stocklist.
9. Confirm both stock records appear.
10. Open Hoodie Stock Detail.
11. Transfer 3 PCS from Gudang Sortir to Gudang Retail.
12. Open Stock Out.
13. Record 2 PCS Hoodie keluar from Gudang Retail.
14. Return to Stock Detail.
15. Confirm Ball source and movement timeline are correct.
```

### Journey B — Accessories End-to-End

```text
1. Login as Admin Inventory.
2. Create an Accessories Batch.
3. Run Sortir 0 and choose Accessories.
4. Open Accessories Classification.
5. Create:
   - Benang Jahit / Teratai / Abu Muda / 10 KG / Gudang Grosir
6. Open Stocklist.
7. Confirm Accessories stock appears.
8. Transfer 2 KG to Gudang Retail.
9. Create Stock Out 1 KG from Gudang Retail.
10. Confirm movement history is correct.
```

### Journey C — Role Restriction

```text
1. Login as Admin Gudang.
2. Confirm Master Data menu is hidden.
3. Open /master-data directly.
4. Confirm access is denied or redirected.
5. Confirm Transfer and Barang Keluar are allowed.
6. Confirm Add Ball action is not available.
```

---

## 17. Demo Completion Checklist

Before presenting to the client, ensure:

```text
[ ] Login works for all three demo users
[ ] Dashboard has realistic seed data
[ ] Ball List is not empty
[ ] Add Ball works
[ ] Sortir 0 works
[ ] Sortir 1 creates multiple outputs
[ ] Accessories classification works
[ ] Stocklist shows correct available stock
[ ] Stock Detail shows Ball source
[ ] Transfer updates source and destination quantities
[ ] Stock Out decreases stock
[ ] Movement Log shows all major events
[ ] Role permissions work
[ ] Mobile/tablet layout does not break
[ ] No lorem ipsum remains
[ ] No fake hardcoded dashboard totals remain
[ ] Vercel environment variables are configured
[ ] Production build succeeds
```

---

## 18. Non-Goals for UI

Do not create pages or UI flows for:

```text
Sortir 2 to Sortir 5
Return
Stock adjustment
Stock opname
Accounting
KPI
Marketplace integration
Barcode printing
File upload
Advanced report builder
System settings
Notifications center
Multi-company switching
```

Do not add fake placeholders for these features unless a clearly labeled “Fase Lanjutan” note is useful for presentation.

---

## 19. Implementation Priority

Build in vertical slices.

```text
Slice 1
Login + protected app shell + dashboard with seed data

Slice 2
Ball list + add Ball + Ball detail

Slice 3
Sortir 0 + Sortir 1 + output stock creation

Slice 4
Stocklist + Stock Detail + movement timeline

Slice 5
Warehouse transfer

Slice 6
Stock out

Slice 7
Master data basics + final polish + Vercel readiness
```

Do not start the next slice before the previous slice works end-to-end.
