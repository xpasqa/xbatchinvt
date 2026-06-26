# Ball Fashion Inventory Demo
## 06 — Seed Data, Demo Scenario, and Presentation Guide

> **Purpose:** This document defines the seed data, demo accounts, demo stories, presentation flow, and reset expectations for the sales demo.
>
> The demo must never feel empty.
>
> Read together with:
>
> - `docs/00-project-context.md`
> - `docs/01-business-rules.md`
> - `docs/02-demo-scope-and-routes.md`
> - `docs/03-data-model.md`
> - `docs/04-implementation-plan.md`
> - `docs/05-codex-rules.md`

---

## 1. Demo Presentation Goal

The purpose of the demo is not to show every possible feature.

The purpose is to make the client immediately understand:

```text
Barang masuk sebagai Ball / Batch
→ dipisahkan ke Stoklot atau Accessories
→ disortir menjadi stok aktif
→ masuk Stocklist
→ dipindahkan antar gudang
→ dikeluarkan untuk penjualan
→ seluruh perjalanan stok dapat ditelusuri
```

The demo should feel like a real operational system that the business can use, not a generic admin dashboard.

---

## 2. Demo Account Seed Data

Create these accounts in the seed script.

| Role | Name | Email | Password |
|---|---|---|---|
| Owner | Owner Demo | owner@ballfashion.demo | Demo12345! |
| Admin Inventory | Admin Inventory Demo | admin@ballfashion.demo | Demo12345! |
| Admin Gudang | Admin Gudang Demo | warehouse@ballfashion.demo | Demo12345! |

Use the same password for ease of presentation.

For demo only, show helper credentials on the login page.

---

## 3. Master Data Seed

## 3.1 Warehouses

| Code | Name | Active |
|---|---|---:|
| GUD-SORTIR | Gudang Sortir | Yes |
| GUD-RETAIL | Gudang Retail | Yes |
| GUD-GROSIR | Gudang Grosir | Yes |

## 3.2 Stoklot Categories

| Code | Name | Active |
|---|---|---:|
| DWS | Dewasa | Yes |
| ANK | Anak | Yes |

## 3.3 Stoklot Product Types

| Code | Name |
|---|---|
| LEGGING-PANJANG | Legging Panjang |
| LEGGING-PENDEK | Legging Pendek |
| HOODIE | Hoodie |
| CREWNECK | Crewneck |
| FULL-ZIPPER | Full Zipper |
| HALF-ZIPPER | Half Zipper |
| TSHIRT-MAN | T-Shirt Man |
| TSHIRT-WOMEN | T-Shirt Women |
| TANK-TOP | Tank Top |
| DRESS | Dress |
| JOGGER | Jogger |
| SHORT-JOGGER | Short Jogger |
| SHORT-PANTS | Short Pants |

## 3.4 Units

| Code | Name |
|---|---|
| PCS | PCS |
| KG | KG |
| ROLL | ROLL |
| PACK | PACK |

## 3.5 Sales Channels

| Code | Name | Sales Type |
|---|---|---|
| SHOPEE | Shopee | ONLINE |
| TIKTOK | TikTok | ONLINE |
| RETAIL | Retail | OFFLINE |
| RUD | RUD | OFFLINE |
| OAJET_NUX | Oajet Nux | OFFLINE |
| PAKET_PILIH | Paket Pilih | OFFLINE |

---

## 4. Static Demo Images

Use static images only.

Expected location:

```text
/public/demo/balls/
/public/demo/products/
```

Suggested image files:

```text
/public/demo/balls/ball-001.jpg
/public/demo/balls/ball-002.jpg
/public/demo/balls/ball-003.jpg
/public/demo/balls/ball-004.jpg

/public/demo/products/hoodie.jpg
/public/demo/products/crewneck.jpg
/public/demo/products/tshirt.jpg
/public/demo/products/thread.jpg
/public/demo/products/zipper.jpg
```

The seed database should store only relative paths:

```text
/demo/balls/ball-001.jpg
/demo/products/hoodie.jpg
```

If an image file is not available, show a graceful placeholder. Do not block the demo.

---

## 5. Required Seed Story A — Stoklot Main Story

This is the primary demo story and must be fully traceable.

### 5.1 Ball Record

```text
Ball Code: BL-2026-0001
Received Date: 20 June 2026
Supplier: Supplier Bandung A
Initial Warehouse: Gudang Sortir
Purchase Cost: Rp5.000.000
Estimated Quantity: 50 PCS
Unit: PCS
Image Path: /demo/balls/ball-001.jpg
Division: STOKLOT
Status: PARTIALLY_CLASSIFIED
```

### 5.2 Required Ball Activity History

```text
20 Jun 2026 09:00
Ball dibuat oleh Admin Inventory Demo

20 Jun 2026 09:10
Sortir 0 dipilih: Stoklot

20 Jun 2026 10:00
Sortir 1 selesai dengan beberapa hasil stok aktif
```

### 5.3 Sortir 1 Outputs

Create the following Stock Lots.

| SKU | Product | Warehouse | Quantity | Unit | HPP / Unit | Selling Price / Unit |
|---|---|---|---:|---|---:|---:|
| STL-DWS-HOODIE | Hoodie Dewasa | Gudang Sortir | 9 | PCS | Rp30.000 | Rp75.000 |
| STL-DWS-HOODIE | Hoodie Dewasa | Gudang Retail | 3 | PCS | Rp30.000 | Rp75.000 |
| STL-DWS-CREWNECK | Crewneck Dewasa | Gudang Grosir | 15 | PCS | Rp28.000 | Rp65.000 |
| STL-ANK-TSHIRT-MAN | T-Shirt Man Anak | Gudang Retail | 12 | PCS | Rp15.000 | Rp35.000 |

The original Sortir 1 output should indicate that Hoodie Dewasa was initially created in Gudang Sortir before transfer and stock out activities happened.

### 5.4 Required Transfer Seed

```text
Reference: TRF-2026-0001
Date: 21 June 2026 09:00
SKU: STL-DWS-HOODIE
Quantity: 5 PCS
Source Warehouse: Gudang Sortir
Destination Warehouse: Gudang Retail
Created By: Admin Gudang Demo
Note: Alokasi stok untuk kebutuhan retail
```

Expected result after transfer:

```text
Gudang Sortir Hoodie Dewasa:
14 PCS initial result
- 5 PCS transfer
= 9 PCS available

Gudang Retail Hoodie Dewasa:
5 PCS transferred
```

### 5.5 Required Stock Out Seed

```text
Reference: OUT-2026-0001
Date: 22 June 2026 14:00
SKU: STL-DWS-HOODIE
Quantity: 2 PCS
Source Warehouse: Gudang Retail
Sales Type: OFFLINE
Sales Channel: Retail
Packing Reference: PR-DEMO-001
Invoice Reference: INV-DEMO-001
Created By: Admin Gudang Demo
Note: Penjualan retail demo
```

Expected result after Stock Out:

```text
Gudang Retail Hoodie Dewasa:
5 PCS received by transfer
- 2 PCS stock out
= 3 PCS available
```

### 5.6 Required Movement Timeline

The Hoodie Dewasa Stock Detail must show this story in chronological order:

```text
20 Jun 2026 10:00
Hasil Sortir 1
14 PCS masuk ke Gudang Sortir

21 Jun 2026 09:00
Transfer Keluar
5 PCS keluar dari Gudang Sortir ke Gudang Retail

21 Jun 2026 09:00
Transfer Masuk
5 PCS masuk ke Gudang Retail dari Gudang Sortir

22 Jun 2026 14:00
Barang Keluar
2 PCS keluar dari Gudang Retail
Referensi: INV-DEMO-001
```

---

## 6. Required Seed Story B — Accessories Main Story

This story proves that Accessories has a simpler but still traceable workflow.

### 6.1 Accessories Ball Record

```text
Ball Code: ACC-2026-0001
Received Date: 21 June 2026
Supplier: Supplier Aksesoris C
Initial Warehouse: Gudang Sortir
Purchase Cost: Rp900.000
Estimated Quantity: 25 KG
Unit: KG
Image Path: /demo/balls/ball-002.jpg
Division: ACCESSORIES
Status: PARTIALLY_CLASSIFIED
```

### 6.2 Classification Output

| SKU | Product | Warehouse | Quantity | Unit | HPP / Unit | Selling Price / Unit |
|---|---|---|---:|---|---:|---:|
| ACC-BENANG-TERATAI-ABU-MUDA | Benang Jahit Teratai Abu Muda | Gudang Grosir | 18 | KG | Rp18.000 | Rp30.000 |
| ACC-BENANG-TERATAI-ABU-MUDA | Benang Jahit Teratai Abu Muda | Gudang Retail | 4 | KG | Rp18.000 | Rp30.000 |

### 6.3 Required Transfer Seed

```text
Reference: TRF-2026-0002
Date: 22 June 2026 10:00
SKU: ACC-BENANG-TERATAI-ABU-MUDA
Quantity: 5 KG
Source Warehouse: Gudang Grosir
Destination Warehouse: Gudang Retail
Created By: Admin Gudang Demo
Note: Stok untuk kebutuhan retail
```

Expected quantity after transfer:

```text
Gudang Grosir:
23 KG initial
- 5 KG transfer
= 18 KG available

Gudang Retail:
5 KG received
```

### 6.4 Required Stock Out Seed

```text
Reference: OUT-2026-0002
Date: 23 June 2026 11:00
SKU: ACC-BENANG-TERATAI-ABU-MUDA
Quantity: 1 KG
Source Warehouse: Gudang Retail
Sales Type: OFFLINE
Sales Channel: Retail
Invoice Reference: INV-DEMO-002
Created By: Admin Gudang Demo
Note: Penjualan accessories demo
```

Expected retail quantity after Stock Out:

```text
Gudang Retail:
5 KG received
- 1 KG stock out
= 4 KG available
```

---

## 7. Additional Seed Data for Dashboard Quality

Create enough additional valid data so the system does not look empty.

Suggested additional Balls:

| Ball Code | Division | Supplier | Status | Image |
|---|---|---|---|---|
| BL-2026-0002 | STOKLOT | Supplier Garut B | READY_FOR_SORTIR_1 | /demo/balls/ball-003.jpg |
| BL-2026-0003 | STOKLOT | Supplier Jakarta C | WAITING_SORTIR_0 | /demo/balls/ball-004.jpg |
| ACC-2026-0002 | ACCESSORIES | Supplier Aksesoris D | READY_FOR_ACCESSORIES_CLASSIFICATION | /demo/balls/ball-002.jpg |

Suggested extra active stock:

| SKU | Product | Warehouse | Quantity | Unit | Status Intent |
|---|---|---|---:|---|---|
| STL-DWS-CREWNECK | Crewneck Dewasa | Gudang Grosir | 15 | PCS | Active |
| STL-ANK-TSHIRT-MAN | T-Shirt Man Anak | Gudang Retail | 12 | PCS | Active |
| STL-DWS-HOODIE | Hoodie Dewasa | Gudang Sortir | 2 | PCS | Low Stock |
| ACC-ZIPPER-20CM-HITAM | Zipper 20 CM Hitam | Gudang Retail | 0 | PCS | Stock Habis |
| ACC-KARET-ELASTIS-PUTIH | Karet Elastis Putih | Gudang Grosir | 8 | ROLL | Active |

Use valid source Ball and movement history for all seeded Stock Lots.

Do not create orphan Stock Lots.

---

## 8. Dashboard Expected Appearance

After seed, dashboard should visibly show:

```text
Total Stok Aktif: more than 40 units / quantities across all stock
Stok Gudang Sortir: non-zero
Stok Gudang Retail: non-zero
Stok Gudang Grosir: non-zero
Total Stoklot: non-zero
Total Accessories: non-zero
Recent movements: at least 6 entries
Recent Balls: at least 4 entries
Low stock: at least 1 item
Stock out: at least 2 recent transactions
```

The exact total is less important than internal consistency.

---

## 9. Primary Live Demo Scenario

Use this scenario when presenting to a client.

### Step 1 — Login

Log in as:

```text
Email: admin@ballfashion.demo
Password: Demo12345!
```

Narration:

```text
“Setiap admin masuk ke sistem sesuai perannya. Dari dashboard, kita bisa langsung melihat kondisi stok di tiga gudang, aktivitas terbaru, dan stok yang perlu diperhatikan.”
```

### Step 2 — Dashboard

Show:

```text
Stok Gudang Sortir
Stok Gudang Retail
Stok Gudang Grosir
Ball terbaru
Pergerakan stok terbaru
Stok rendah / habis
```

Narration:

```text
“Dashboard ini bukan hanya laporan, tetapi pintu masuk untuk melihat kondisi operasional harian secara cepat.”
```

### Step 3 — Open Ball / Batch

Open:

```text
BL-2026-0003
```

It should be in:

```text
WAITING_SORTIR_0
```

Narration:

```text
“Barang pertama kali masuk dicatat sebagai Ball atau Batch. Pada tahap ini barang belum dianggap sebagai stok jual karena isi Ball belum diklasifikasikan.”
```

### Step 4 — Live Sortir 0

Perform:

```text
Sortir 0
→ pilih Stoklot
```

Narration:

```text
“Sortir 0 memisahkan jalur proses. Jika barang adalah fashion stoklot, ia masuk ke alur sortir bertahap. Jika accessories, ia masuk ke klasifikasi accessories yang lebih sederhana.”
```

### Step 5 — Live Sortir 1

Create at least two rows:

```text
Dewasa / Hoodie
Quantity: 10 PCS
HPP: Rp30.000
Harga Jual: Rp75.000
Gudang: Gudang Sortir

Anak / T-Shirt Man
Quantity: 8 PCS
HPP: Rp15.000
Harga Jual: Rp35.000
Gudang: Gudang Retail
```

Narration:

```text
“Setelah Sortir 1, barang langsung menjadi stok aktif. Sistem membuat SKU otomatis, mencatat HPP dan harga jual, serta langsung menempatkan hasilnya ke gudang yang dipilih.”
```

### Step 6 — Open Stocklist

Filter by Ball or generated SKU.

Narration:

```text
“Di Stocklist, admin dapat melihat stok aktif dari seluruh tahap yang sudah dapat dijual. Stok bisa berasal dari Gudang Sortir, Retail, atau Grosir.”
```

### Step 7 — Transfer Stock

Select Hoodie from Gudang Sortir.

Create:

```text
Transfer 3 PCS
Gudang Sortir
→ Gudang Retail
```

Narration:

```text
“Perpindahan antar gudang tidak dilakukan dengan edit angka manual. Sistem membuat transaksi transfer, mengurangi stok di gudang asal, dan menambah stok di gudang tujuan secara otomatis.”
```

### Step 8 — Stock Out

Select Hoodie in Gudang Retail.

Create:

```text
Quantity: 2 PCS
Sales Type: OFFLINE
Channel: Retail
Invoice: INV-LIVE-DEMO-001
```

Narration:

```text
“Ketika barang benar-benar keluar untuk penjualan, admin memilih gudang dan SKU yang tepat. Sistem tidak akan mengizinkan barang keluar melebihi stok yang tersedia.”
```

### Step 9 — Traceability

Open the Stock Detail for Hoodie.

Show:

```text
Source Ball
Sortir 1 event
Transfer event
Stock Out event
Current available quantity
```

Narration:

```text
“Ini inti sistemnya: dari SKU yang sudah dijual, owner tetap bisa melihat barang ini asalnya dari Ball mana, diproses kapan, berpindah ke gudang mana, dan keluar melalui transaksi apa.”
```

---

## 10. Secondary Accessories Demo Scenario

Use only if the client asks about accessories.

### Flow

```text
Open ACC-2026-0002
→ Sortir 0 pilih Accessories
→ Klasifikasi Accessories
→ Benang / Zipper / Karet
→ pilih unit KG / PCS / ROLL
→ masuk Stocklist
→ transfer
→ stock out
```

Narration:

```text
“Accessories tetap dicatat dari Batch asalnya, tetapi tidak dipaksa mengikuti tahapan sortir fashion. Sistem tetap menyimpan satuan yang berbeda seperti KG, Roll, Pack, atau PCS.”
```

---

## 11. Demo Presentation Order

Use this sequence. Do not jump randomly between pages.

```text
1. Login
2. Dashboard
3. Ball / Batch List
4. Ball Detail
5. Sortir 0
6. Sortir 1
7. Stocklist
8. Warehouse Transfer
9. Stock Out
10. Stock Detail / History
11. Accessories path only if needed
12. Closing: future development roadmap
```

Ideal presentation focus:

```text
Ball Masuk
→ Sortir
→ Stocklist
→ Gudang
→ Barang Keluar
→ Traceability
```

---

## 12. Suggested Closing Message for Client Demo

Use this as the closing concept:

```text
“Sistem ini dibangun sebagai fondasi operasional inventory. Tahap awal memastikan Ball masuk, sortir awal, stok gudang, perpindahan barang, dan barang keluar sudah tercatat dalam satu data yang sama. Setelah alur ini tervalidasi di operasional, sistem dapat dikembangkan bertahap ke Sortir 2 sampai Sortir 5, stock opname, laporan lebih detail, KPI divisi, integrasi penjualan, sampai integrasi keuangan.”
```

---

## 13. Pre-Demo Checklist

Before any client presentation:

```text
[ ] Vercel deployment opens successfully
[ ] Neon production database is connected
[ ] Demo user accounts can log in
[ ] Dashboard has seed data
[ ] Ball List has multiple records
[ ] At least one Ball is WAITING_SORTIR_0
[ ] At least one Stoklot Ball is PARTIALLY_CLASSIFIED
[ ] At least one Accessories Ball is PARTIALLY_CLASSIFIED
[ ] Stocklist has stock in all three warehouses
[ ] Low stock and zero stock are visible
[ ] Recent transfer is visible
[ ] Recent stock out is visible
[ ] Stock Detail shows traceability timeline
[ ] Static images load correctly
[ ] No broken routes exist
[ ] No lorem ipsum exists
[ ] No console error appears
[ ] Mobile/tablet layout is acceptable
```

---

## 14. Reset and Seed Instructions

The exact script names depend on package setup, but the project must provide a reproducible reset flow.

Recommended package scripts:

```json
{
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:seed": "prisma db seed",
  "db:reset": "prisma migrate reset --force"
}
```

Recommended reset flow for local development:

```bash
pnpm db:reset
pnpm db:seed
```

For deployed demo environments:

```text
Do not casually reset the Vercel / Neon production demo database before a presentation.

If reset is necessary:
1. Confirm database target.
2. Run migration safely.
3. Run seed script.
4. Test all demo accounts.
5. Test full primary demo flow.
```

The seed process must not create inconsistent duplicate records.

Preferred seed behavior:

```text
Clear known demo records in dependency-safe order
→ insert master data
→ insert users
→ insert Balls
→ insert Product Variants
→ insert Stock Lots
→ insert Sortir sessions/results
→ insert Transfers
→ insert Stock Out
→ insert Inventory Movements
```

---

## 15. Required Seed Integrity Checks

After `db:seed`, verify:

```text
[ ] Every Stock Lot has source Ball
[ ] Every Stock Lot has warehouse
[ ] Every Stock Lot has Product Variant
[ ] Every Product Variant has valid SKU
[ ] Every transfer has source and destination warehouse
[ ] Every transfer has TRANSFER_OUT and TRANSFER_IN movements
[ ] Every Stock Out has STOCK_OUT movement
[ ] No Stock Lot has negative quantity
[ ] All movement timestamps are chronological enough for presentation
[ ] Dashboard totals match available Stock Lots
[ ] All seed users can authenticate
```

---

## 16. Do Not Seed

Do not seed the following invalid demo behavior:

```text
Negative stock
Orphan stock
Duplicate Ball Codes
Duplicate SKU codes
Missing warehouse on Stock Lot
Transfer to same warehouse
Stock Out above available quantity
Movement without actor
Ball without createdBy user
Raw placeholder lorem ipsum
Broken image paths
```

---

## 17. Final Demo Principle

A strong demo is not about showing a lot of pages.

A strong demo makes one operational journey obvious:

```text
Barang datang
→ diproses
→ menjadi stok
→ berpindah gudang
→ keluar untuk penjualan
→ seluruh riwayatnya tetap ada
```

If this flow is clear and works smoothly, the client will understand the value of the system.
