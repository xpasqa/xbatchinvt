# Ball Fashion Inventory Demo
## 01 — Business Rules and Inventory Logic

> **Purpose:** This document defines the operational rules for Ball, sorting, stock, warehouse movement, and stock out.
>
> Codex must follow these rules when designing database logic, server actions, validations, and UI behavior.
>
> If this document conflicts with UI convenience, this document wins.

---

## 1. Core Inventory Model

The system manages inventory through **traceable stock movements**.

The system must not treat stock as a manually editable number.

Every available stock quantity must come from a recorded inventory event:

```text
Ball / Batch classification
Warehouse transfer in
Warehouse transfer out
Stock out
Future return
Future adjustment
Future sorting
```

The Stocklist page is only a view of current available stock. It is not a place to directly type a new quantity.

---

## 2. Definitions

### 2.1 Ball / Batch

A Ball or Batch is the original incoming unit of goods from a supplier or source.

A Ball can contain mixed goods and does not need to have a final product identity when first recorded.

Examples:

```text
BL-2026-0001
ACC-2026-0001
```

A Ball or Batch may later produce multiple active stock records.

### 2.2 Division

The system has two divisions:

```text
STOKLOT
ACCESSORIES
```

Division is selected through Sortir 0.

### 2.3 Product Variant

A Product Variant is the reusable definition of a product identity and generated SKU.

For Stoklot Stage 1, the identity is based on:

```text
Division
Category
Product Type
```

Example:

```text
STOKLOT
Dewasa
Hoodie
SKU: STL-DWS-HOODIE
```

For Accessories, the identity is based on:

```text
Division
Accessory Category
Accessory Type / Specification
Color / Variant
Unit
```

Example:

```text
ACCESSORIES
Benang Jahit
Teratai
Abu Muda
KG
SKU: ACC-BENANG-TERATAI-ABU-MUDA
```

### 2.4 Stock Lot

A Stock Lot represents a concrete quantity of a Product Variant that came from a particular Ball/Batch and is currently stored in one warehouse.

A Stock Lot must always retain a link to its source Ball/Batch.

A Product Variant may have many Stock Lots.

Example:

```text
Product Variant: STL-DWS-HOODIE
Source Ball: BL-2026-0001
Warehouse: Gudang Retail
Available Quantity: 8 PCS
```

Do not merge Stock Lots from different source Balls, even if their SKU is identical.

This keeps traceability and HPP information accurate.

### 2.5 Inventory Movement

An Inventory Movement is the permanent audit record of a stock quantity change.

Every mutation must create at least one movement record.

### 2.6 Stocklist

Stocklist is a filtered operational list of active Stock Lots and their current available quantity.

It is not a master product list and not a manual stock editor.

### 2.7 Sellable Stock

Stoklot is sellable immediately after Sortir 1.

Accessories are sellable after Accessories Classification.

---

## 3. Ball / Batch Rules

### 3.1 Ball Creation

A Ball/Batch may be created only by:

```text
Owner
Admin Inventory
```

A Ball must have:

```text
Ball Code
Received Date
Supplier / Source
Initial Warehouse
Purchase Cost
Estimated Quantity
Unit
Status
Created By
```

Optional fields:

```text
Notes
Static Demo Image Path
```

Default values:

```text
Initial Warehouse: Gudang Sortir
Status: WAITING_SORTIR_0
```

### 3.2 Ball Code Rules

Ball Code should be unique.

Recommended formats:

```text
BL-YYYY-0001
ACC-YYYY-0001
```

The system may generate a default code, but the user may edit it before saving.

Validation:

```text
Ball Code cannot be empty.
Ball Code must be unique.
Received Date cannot be in the future.
Purchase Cost cannot be negative.
Estimated Quantity must be greater than zero when provided.
```

### 3.3 Ball Status Rules

Allowed Ball statuses for the demo:

```text
WAITING_SORTIR_0
READY_FOR_SORTIR_1
READY_FOR_ACCESSORIES_CLASSIFICATION
PARTIALLY_CLASSIFIED
COMPLETED
```

Meaning:

| Status | Meaning |
|---|---|
| WAITING_SORTIR_0 | Ball is recorded but division has not been selected |
| READY_FOR_SORTIR_1 | Division is STOKLOT and Ball is ready for Sortir 1 |
| READY_FOR_ACCESSORIES_CLASSIFICATION | Division is ACCESSORIES and ready for classification |
| PARTIALLY_CLASSIFIED | Some output stock has been created from the Ball |
| COMPLETED | The Ball has no remaining processable quantity in the demo context |

For demo simplicity, `COMPLETED` can be set manually only when the user confirms the Ball has been fully processed. Do not force automatic completion logic if estimated quantity is unreliable.

### 3.4 Ball Deletion Rules

Do not allow hard deletion of a Ball if it already has:

```text
Sortir 0 history
Sortir 1 outputs
Accessories classification outputs
Inventory movements
```

For the demo, prefer no delete action after creation. If a delete action is added, allow it only when the Ball has no dependent records.

---

## 4. Sortir 0 Rules

### 4.1 Purpose

Sortir 0 chooses the division for a Ball/Batch.

Options:

```text
STOKLOT
ACCESSORIES
```

### 4.2 Authorization

Only Owner and Admin Inventory may perform Sortir 0.

### 4.3 Valid State

Sortir 0 can only be performed when Ball status is:

```text
WAITING_SORTIR_0
```

### 4.4 State Changes

If selected division is `STOKLOT`:

```text
Ball Division: STOKLOT
Ball Status: READY_FOR_SORTIR_1
```

If selected division is `ACCESSORIES`:

```text
Ball Division: ACCESSORIES
Ball Status: READY_FOR_ACCESSORIES_CLASSIFICATION
```

### 4.5 History Requirement

Sortir 0 must create a history event or inventory-related audit event containing:

```text
Event Type: SORTIR_0
Ball ID
Selected Division
Actor User ID
Timestamp
Optional Note
```

### 4.6 Reversal

For the demo, Sortir 0 must not be editable after Sortir 1 or Accessories Classification has created stock outputs.

Before stock outputs exist, Owner may be allowed to correct division selection if needed.

---

## 5. Sortir 1 Rules — Stoklot

### 5.1 Purpose

Sortir 1 transforms a Stoklot Ball into active, sellable inventory.

Sortir 1 classifies goods by:

```text
Category
Product Type
```

A Ball may produce one or many Sortir 1 output rows.

### 5.2 Valid State

Sortir 1 can only be performed when:

```text
Ball Division = STOKLOT
Ball Status = READY_FOR_SORTIR_1 or PARTIALLY_CLASSIFIED
```

### 5.3 Authorization

Only Owner and Admin Inventory may perform Sortir 1.

### 5.4 Required Input Per Output Row

Every Sortir 1 output row must include:

```text
Category
Product Type
Quantity
Unit
HPP per Unit
Selling Price per Unit
Destination Warehouse
```

Optional:

```text
Note
```

### 5.5 Valid Categories

Seeded categories:

```text
Dewasa
Anak
```

The database should allow future category management.

### 5.6 Valid Product Types

Seeded types:

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

The database should allow future product type management.

### 5.7 Quantity Rules

For every output row:

```text
Quantity must be greater than zero.
Quantity must use the selected unit.
Quantity must not be negative.
```

For the demo, Sortir 1 is sourced from the Ball itself.

If `Estimated Quantity` is known and trusted, the total output quantity from all Sortir 1 submissions must not exceed it.

If Estimated Quantity is missing or intentionally unreliable, show a warning but do not block the operation.

Important: Never invent source quantity constraints that the user cannot validate in real life.

### 5.8 Price Rules

```text
HPP per Unit cannot be negative.
Selling Price per Unit cannot be negative.
```

Selling Price may be lower than HPP because the business may intentionally liquidate goods. Do not enforce a selling price above HPP.

### 5.9 Warehouse Rules

Destination Warehouse is mandatory.

The allowed initial warehouses are:

```text
Gudang Sortir
Gudang Retail
Gudang Grosir
```

### 5.10 SKU Rule

Sortir 1 must create or reuse a Product Variant using:

```text
Division = STOKLOT
Category
Product Type
Sorting Stage = 1
```

Suggested generated SKU format:

```text
STL-{CATEGORY_CODE}-{TYPE_CODE}
```

Examples:

```text
STL-DWS-HOODIE
STL-DWS-CREWNECK
STL-ANK-TSHIRT-MAN
```

SKU generation rules:

1. Generated SKU must be deterministic.
2. SKU cannot be manually edited in the Sortir 1 form.
3. If identical structured attributes already exist, reuse the existing Product Variant.
4. The Stock Lot must still be new if it comes from another Ball or is stored in another warehouse.
5. SKU must remain stable even if a human-readable name later changes.

### 5.11 Sortir 1 Transaction Rule

A complete Sortir 1 submission must be handled in one Prisma transaction.

For each output row, the transaction must:

```text
1. Find or create Product Variant
2. Create Stock Lot linked to Ball and Warehouse
3. Set available quantity
4. Set HPP per unit and selling price per unit
5. Create Inventory Movement with type SORTIR_1_IN
6. Create Sortir Session / Sortir Result records if those models are used
```

After a successful submission:

```text
Ball Status becomes PARTIALLY_CLASSIFIED
```

Do not create partial results if any submitted output row is invalid.

### 5.12 Sortir 1 Output Behavior

After successful Sortir 1:

```text
The new Stock Lot appears in Stocklist.
The stock is sellable immediately.
The stock can be transferred.
The stock can be used for Stock Out.
The stock keeps a traceability link to the original Ball.
```

---

## 6. Accessories Classification Rules

### 6.1 Purpose

Accessories Classification transforms an Accessories Ball/Batch into active sellable stock.

### 6.2 Valid State

Accessories Classification can only be performed when:

```text
Ball Division = ACCESSORIES
Ball Status = READY_FOR_ACCESSORIES_CLASSIFICATION or PARTIALLY_CLASSIFIED
```

### 6.3 Authorization

Only Owner and Admin Inventory may classify Accessories.

### 6.4 Required Input

Each Accessories output row requires:

```text
Accessory Category
Accessory Type / Specification
Color / Variant
Quantity
Unit
HPP per Unit
Selling Price per Unit
Destination Warehouse
```

Optional:

```text
Note
```

### 6.5 Unit Rules

Accessories must support configurable units.

Seed units:

```text
PCS
KG
ROLL
PACK
```

Do not assume every item uses PCS.

### 6.6 SKU Rule

Suggested format:

```text
ACC-{CATEGORY_CODE}-{TYPE_CODE}-{VARIANT_CODE}
```

Example:

```text
ACC-BENANG-TERATAI-ABU-MUDA
```

The exact code design may be simplified for demo readability, but it must be deterministic and based on stored attributes.

### 6.7 Transaction Rule

Accessories Classification must use one Prisma transaction.

For each result row:

```text
Find or create Product Variant
Create Stock Lot
Create Inventory Movement with type ACCESSORIES_CLASSIFICATION_IN
Update Ball status to PARTIALLY_CLASSIFIED
```

---

## 7. Product Variant Rules

### 7.1 General Rule

Product Variant is reusable master product identity.

Stock Lot is the actual physical/business stock from a specific source Ball and warehouse.

Never confuse these two models.

### 7.2 Stoklot Product Variant Stage 1 Fields

For the demo, Stoklot Product Variant should include or derive:

```text
Division
Sorting Stage = 1
Category
Product Type
Generated SKU
Display Name
Active Flag
```

Example display name:

```text
Hoodie Dewasa
```

### 7.3 Accessories Product Variant Fields

For the demo, Accessories Product Variant should include or derive:

```text
Division
Sorting Stage = 1 or ACCESSORIES_BASE
Accessory Category
Accessory Type / Specification
Color / Variant
Unit
Generated SKU
Display Name
Active Flag
```

### 7.4 Future Readiness

Do not build Sortir 2 to Sortir 5 UI now.

However, preserve these optional future attributes in a reasonable way:

```text
Model / Sub Item
Size
Grade
Color
```

Do not over-engineer the data model. Simple nullable fields or related master data are acceptable.

---

## 8. Stock Lot Rules

### 8.1 Purpose

A Stock Lot represents stock that is:

```text
From one source Ball
For one Product Variant
In one Warehouse
With one HPP per Unit
With one Selling Price per Unit
With one available quantity
```

### 8.2 Stock Lot Creation

A Stock Lot is created by:

```text
Sortir 1
Accessories Classification
Future transfers, depending on chosen architecture
Future returns
Future adjustments
```

### 8.3 Stock Lot Quantity

Available quantity must always be non-negative.

```text
availableQuantity >= 0
```

A zero quantity Stock Lot must remain in history.

It may be displayed with a `SOLD_OUT` or `ZERO_STOCK` status, but it must not be deleted automatically.

### 8.4 Stock Lot Status

Suggested derived or stored statuses:

```text
ACTIVE
LOW_STOCK
SOLD_OUT
```

For demo simplicity, status may be derived from quantity:

```text
availableQuantity > 0 → ACTIVE
availableQuantity = 0 → SOLD_OUT
```

Low-stock thresholds are optional and may be basic.

### 8.5 Stock Lot Price Rule

Do not automatically merge stock lots with different HPP values.

Even if SKU is the same, source Ball or HPP can differ.

---

## 9. Inventory Movement Rules

### 9.1 Purpose

Inventory Movement is the audit source for quantity changes.

### 9.2 Required Movement Types

Use clear enum names. At minimum:

```text
SORTIR_0
SORTIR_1_IN
ACCESSORIES_CLASSIFICATION_IN
TRANSFER_OUT
TRANSFER_IN
STOCK_OUT
```

Future movement types can be planned but not implemented:

```text
SORTIR_OUT
SORTIR_2_IN
SORTIR_3_IN
SORTIR_4_IN
SORTIR_5_IN
RETURN_IN
ADJUSTMENT_IN
ADJUSTMENT_OUT
```

### 9.3 Required Movement Data

Each movement should capture:

```text
Movement Type
Occurred At
Quantity
Unit
Stock Lot ID when applicable
Product Variant ID when applicable
Ball ID when applicable
Source Warehouse ID when applicable
Destination Warehouse ID when applicable
Actor User ID
Reference Type
Reference ID
Note
```

### 9.4 Movement Integrity

Never modify or delete a movement after creation in the demo.

If a real correction is needed later, the correct pattern is a compensating movement, not editing history.

For the demo, no movement reversal UI is required.

---

## 10. Warehouse Transfer Rules

### 10.1 Authorization

Warehouse transfer may be created by:

```text
Owner
Admin Inventory
Admin Gudang
```

### 10.2 Required Input

```text
Transfer Date
Source Warehouse
Destination Warehouse
Source Stock Lot
Quantity
Optional Note
```

### 10.3 Validation Rules

```text
Source Warehouse is required.
Destination Warehouse is required.
Source and destination must be different.
Source Stock Lot must exist.
Selected Stock Lot must belong to Source Warehouse.
Quantity must be greater than zero.
Quantity cannot exceed source available quantity.
```

### 10.4 Transfer Transaction Rule

Transfer must run as one Prisma transaction.

The transaction must:

```text
1. Lock or safely validate source available quantity
2. Reduce source Stock Lot available quantity
3. Create or create-like destination Stock Lot
4. Increase destination available quantity
5. Create TRANSFER_OUT movement
6. Create TRANSFER_IN movement
7. Store one transfer reference connecting both movements
```

### 10.5 Destination Stock Lot Rule

For demo simplicity, a transfer may create a destination Stock Lot that carries the same:

```text
Product Variant
Source Ball
HPP per Unit
Selling Price per Unit
Unit
```

The only changed attribute is warehouse and available quantity.

Do not merge destination stock with unrelated source Balls.

### 10.6 Transfer History Requirement

Stock Detail must show:

```text
Transferred from Gudang Sortir to Gudang Retail
Quantity: 8 PCS
Date
Actor
Transfer reference
```

---

## 11. Stock Out Rules

### 11.1 Purpose

Stock Out records goods physically leaving a warehouse for sales or fulfillment.

### 11.2 Authorization

Stock Out may be created by:

```text
Owner
Admin Inventory
Admin Gudang
```

### 11.3 Required Input

```text
Stock Out Date
Source Warehouse
Source Stock Lot
Quantity
Sales Type
Sales Channel / Platform
```

Optional but recommended:

```text
Packing Request Reference
Invoice / SPK Reference
Note
```

### 11.4 Sales Types

```text
ONLINE
OFFLINE
```

### 11.5 Seed Sales Channels

```text
Shopee
TikTok
Retail
RUD
Oajet Nux
Paket Pilih
```

The database should allow future channel management.

### 11.6 Validation Rules

```text
Selected Stock Lot must belong to Source Warehouse.
Quantity must be greater than zero.
Quantity cannot exceed source available quantity.
Sales Type is required.
Sales Channel is required.
```

### 11.7 Stock Out Transaction Rule

Stock Out must run as one Prisma transaction.

The transaction must:

```text
1. Validate source stock quantity
2. Reduce source Stock Lot available quantity
3. Create Stock Out transaction record
4. Create STOCK_OUT movement
5. Preserve invoice / SPK / packing reference if provided
```

### 11.8 Stock Out Effect

After valid Stock Out:

```text
Available stock decreases.
Stock Detail history updates.
Dashboard summary updates.
No physical stock is created elsewhere.
```

---

## 12. Stocklist Rules

### 12.1 Purpose

Stocklist displays current active stock by Stock Lot and warehouse.

### 12.2 Required Fields

Each row should show:

```text
SKU
Display Name
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

### 12.3 Required Filters

```text
Warehouse
Division
SKU or Product Name search
Sorting Stage
Category
Last Updated date
```

### 12.4 Direct Edit Prohibition

Do not allow:

```text
Inline quantity editing
Manual stock quantity override
Direct warehouse reassignment
Direct source Ball reassignment
```

All changes must use a flow such as Transfer, Stock Out, or future Adjustment.

---

## 13. Traceability Rules

Every active stock record must allow a user to understand:

```text
Which Ball did it originate from?
Which Product Variant does it represent?
Which warehouse is it currently in?
How much quantity is available?
Which movements created or changed it?
Who performed each movement?
When did each movement happen?
```

Minimum traceability route:

```text
Stock Detail
→ Source Ball
→ Sortir / Classification Event
→ Transfers
→ Stock Out Events
```

Example timeline:

```text
20 Jun 2026, 09:00 — Ball BL-2026-0001 created
20 Jun 2026, 10:00 — Sortir 0 selected STOKLOT
20 Jun 2026, 11:00 — Sortir 1 created STL-DWS-HOODIE, 20 PCS
21 Jun 2026, 09:00 — Transfer 8 PCS to Gudang Retail
22 Jun 2026, 14:00 — Stock Out 3 PCS from Gudang Retail
```

---

## 14. Validation and Error Handling Rules

All mutation forms must validate input on both:

```text
Client side for user feedback
Server side for security and data integrity
```

Use Zod for request/form validation.

Use clear Indonesian error messages.

Examples:

```text
"Jumlah harus lebih dari 0."
"Jumlah melebihi stok tersedia."
"Gudang asal dan gudang tujuan tidak boleh sama."
"SKU atau stok tidak ditemukan."
"Anda tidak memiliki akses untuk melakukan tindakan ini."
"Ball ini belum siap untuk Sortir 1."
```

Do not silently clamp quantities or auto-correct invalid values.

---

## 15. Transaction and Concurrency Rules

This is a demo, but all inventory mutations must still be safe.

Use Prisma transactions for:

```text
Sortir 1
Accessories Classification
Warehouse Transfer
Stock Out
```

Within each transaction:

```text
Read current available quantity
Validate the requested quantity
Apply all related writes
Fail all writes if any business rule fails
```

Do not use separate non-transactional writes for inventory mutation workflows.

---

## 16. Seed Demo Scenario

Seed data must support a complete live demo.

Recommended initial scenario:

```text
Ball: BL-2026-0001
Supplier: Supplier A
Initial Warehouse: Gudang Sortir
Purchase Cost: Rp5.000.000
Estimated Quantity: 50 PCS
Division: STOKLOT
Status: PARTIALLY_CLASSIFIED
```

Seed Sortir 1 outputs:

```text
STL-DWS-HOODIE
Source Ball: BL-2026-0001
Warehouse: Gudang Sortir
Quantity: 12 PCS
HPP: Rp30.000
Selling Price: Rp75.000

STL-DWS-HOODIE
Source Ball: BL-2026-0001
Warehouse: Gudang Retail
Quantity: 5 PCS
HPP: Rp30.000
Selling Price: Rp75.000

STL-DWS-CREWNECK
Source Ball: BL-2026-0001
Warehouse: Gudang Grosir
Quantity: 15 PCS
HPP: Rp28.000
Selling Price: Rp65.000
```

Seed an example transfer and stock-out:

```text
Transfer:
3 PCS STL-DWS-HOODIE
Gudang Sortir → Gudang Retail

Stock Out:
2 PCS STL-DWS-HOODIE
Gudang Retail
Sales Type: OFFLINE
Channel: Retail
Invoice: INV-DEMO-001
```

The dashboard should show realistic totals and recent activities immediately after seeding.

---

## 17. Future Rules Not Implemented Yet

Do not implement now, but retain awareness for later phases.

```text
Sortir 2: Model / Sub Item
Sortir 3: Size
Sortir 4: Grade
Sortir 5: Color
Partial sorting from active stock
Return workflow
Stock adjustment
Stock opname
HPP allocation from full Ball cost
Price by sales channel
Approval flows
Accounting integration
KPI reporting
```

When implementing future sorting, the basic rule will remain:

```text
Source stock quantity decreases
→ one or more child stock lots are created
→ every child remains traceable to original Ball and source stock
→ source history remains preserved
```

---

## 18. Non-Negotiable Simplicity Rules

Do not over-engineer this demo.

Do not add:

```text
Event bus
Microservices
Repository pattern without a real need
CQRS
Domain event framework
Generic workflow engine
Complex permission matrix
Custom state machine library
Overly abstract generic inventory engine
```

Use explicit server actions, small domain functions, Prisma transactions, and clear database relationships.

The correct goal is:

```text
Simple enough to understand
Strict enough to protect inventory data
Clean enough to extend later
```
