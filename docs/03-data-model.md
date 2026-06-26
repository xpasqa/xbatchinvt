# Ball Fashion Inventory Demo
## 03 — Data Model and Prisma Blueprint

> **Purpose:** This document defines the recommended data model for the demo.
>
> Codex must use this as the source of truth when creating `prisma/schema.prisma`, migrations, seed data, query helpers, and inventory transaction logic.
>
> Read together with:
>
> - `docs/00-project-context.md`
> - `docs/01-business-rules.md`
> - `docs/02-demo-scope-and-routes.md`
>
> This is a practical demo schema. Keep it clean and relational. Do not over-engineer.

---

## 1. Data Model Principles

1. PostgreSQL in Neon is the only persistent application database.
2. Prisma is the only ORM.
3. Inventory quantity changes must be represented by business transactions and inventory movements.
4. Product identity and physical stock identity are different:
   - `ProductVariant` defines what the product is.
   - `StockLot` defines stock from a specific source Ball in a specific warehouse.
5. Do not merge Stock Lots from different Balls.
6. Do not delete historical movements.
7. Use UUID or CUID primary keys consistently.
8. Use `Decimal` for money and quantities where needed.
9. Prefer nullable future-facing fields over premature complex models.
10. All timestamps should use UTC and be displayed in Indonesian local format in UI.

---

## 2. Required Enums

Use enums close to the following names. Small naming improvements are allowed if the meaning remains clear.

```prisma
enum UserRole {
  OWNER
  ADMIN_INVENTORY
  ADMIN_WAREHOUSE
}

enum BallStatus {
  WAITING_SORTIR_0
  READY_FOR_SORTIR_1
  READY_FOR_ACCESSORIES_CLASSIFICATION
  PARTIALLY_CLASSIFIED
  COMPLETED
}

enum InventoryDivision {
  STOKLOT
  ACCESSORIES
}

enum MovementType {
  SORTIR_0
  SORTIR_1_IN
  ACCESSORIES_CLASSIFICATION_IN
  TRANSFER_OUT
  TRANSFER_IN
  STOCK_OUT
}

enum SalesType {
  ONLINE
  OFFLINE
}

enum ReferenceType {
  BALL
  SORTIR_0
  SORTIR_1
  ACCESSORIES_CLASSIFICATION
  TRANSFER
  STOCK_OUT
}
```

Future enums may be added later for return, adjustment, stock opname, and Sortir 2–5. Do not add those workflows now.

---

## 3. Core Entity Overview

```text
User
├─ creates Ball
├─ performs Sortir 0
├─ creates Sortir 1 session / results
├─ creates transfers
├─ creates stock out
└─ creates inventory movements

Warehouse
├─ receives Stock Lots
├─ sends Stock Lots
└─ is shown in Stocklist

Ball
├─ has one division after Sortir 0
├─ produces many Stock Lots
├─ has activity history
└─ is source of traceability

ProductVariant
├─ reusable SKU identity
└─ can have many Stock Lots

StockLot
├─ belongs to one Product Variant
├─ belongs to one source Ball
├─ belongs to one Warehouse
├─ has available quantity
└─ has many Inventory Movements

InventoryMovement
├─ points to Stock Lot
├─ may point to Ball
├─ may point to warehouses
└─ records immutable audit history

WarehouseTransfer
├─ stores one transfer reference
├─ has source and destination warehouses
└─ creates TRANSFER_OUT and TRANSFER_IN movements

StockOut
├─ records outbound goods
└─ creates STOCK_OUT movement

Master Data
├─ Category
├─ ProductType
├─ Unit
└─ SalesChannel
```

---

## 4. User Model

Use a simple credential-based user model.

Recommended fields:

```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         UserRole
  isActive     Boolean  @default(true)

  createdBalls          Ball[]              @relation("BallCreatedBy")
  sortirZeroEvents      BallActivity[]      @relation("BallActivityActor")
  createdSortirSessions SortirSession[]     @relation("SortirSessionCreatedBy")
  createdTransfers      WarehouseTransfer[] @relation("TransferCreatedBy")
  createdStockOuts      StockOut[]          @relation("StockOutCreatedBy")
  inventoryMovements    InventoryMovement[] @relation("MovementCreatedBy")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Rules:

```text
Email must be unique.
Never store plaintext password.
Use a secure password hash.
Inactive users cannot log in.
```

Seed users are defined in `00-project-context.md`.

---

## 5. Warehouse Model

```prisma
model Warehouse {
  id        String   @id @default(cuid())
  code      String   @unique
  name      String
  isActive  Boolean  @default(true)

  stockLots StockLot[]

  sourceTransfers      WarehouseTransfer[] @relation("TransferSourceWarehouse")
  destinationTransfers WarehouseTransfer[] @relation("TransferDestinationWarehouse")

  sourceMovements      InventoryMovement[] @relation("MovementSourceWarehouse")
  destinationMovements InventoryMovement[] @relation("MovementDestinationWarehouse")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Seed values:

```text
GUD-SORTIR  → Gudang Sortir
GUD-RETAIL  → Gudang Retail
GUD-GROSIR  → Gudang Grosir
```

Rules:

```text
Warehouse code must be unique.
Do not hard-delete warehouses used by stock data.
Use isActive to deactivate a warehouse later.
```

---

## 6. Master Data Models

Keep master data simple and reusable.

### 6.1 Category

```prisma
model Category {
  id        String   @id @default(cuid())
  code      String   @unique
  name      String
  isActive  Boolean  @default(true)

  productVariants ProductVariant[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Seed values:

```text
DWS → Dewasa
ANK → Anak
```

### 6.2 Product Type

```prisma
model ProductType {
  id        String   @id @default(cuid())
  code      String   @unique
  name      String
  isActive  Boolean  @default(true)

  productVariants ProductVariant[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Seed values:

```text
LEGGING-PANJANG
LEGGING-PENDEK
HOODIE
CREWNECK
FULL-ZIPPER
HALF-ZIPPER
TSHIRT-MAN
TSHIRT-WOMEN
TANK-TOP
DRESS
JOGGER
SHORT-JOGGER
SHORT-PANTS
```

### 6.3 Unit

```prisma
model Unit {
  id        String   @id @default(cuid())
  code      String   @unique
  name      String
  isActive  Boolean  @default(true)

  stockLots       StockLot[]
  balls           Ball[]
  productVariants ProductVariant[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Seed values:

```text
PCS
KG
ROLL
PACK
```

### 6.4 Sales Channel

```prisma
model SalesChannel {
  id        String    @id @default(cuid())
  code      String    @unique
  name      String
  salesType SalesType
  isActive  Boolean   @default(true)

  stockOuts StockOut[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Seed values:

```text
SHOPEE       ONLINE
TIKTOK       ONLINE
RETAIL       OFFLINE
RUD          OFFLINE
OAJET_NUX    OFFLINE
PAKET_PILIH  OFFLINE
```

---

## 7. Ball Model

A Ball is the original incoming source record.

```prisma
model Ball {
  id                String             @id @default(cuid())
  code              String             @unique
  receivedAt        DateTime
  supplierName      String
  initialWarehouseId String
  initialWarehouse  Warehouse          @relation(fields: [initialWarehouseId], references: [id])

  division          InventoryDivision?
  status            BallStatus         @default(WAITING_SORTIR_0)

  purchaseCost      Decimal            @db.Decimal(14, 2)
  estimatedQuantity Decimal?
  unitId            String
  unit              Unit               @relation(fields: [unitId], references: [id])

  notes             String?
  imagePath         String?

  createdById       String
  createdBy         User               @relation("BallCreatedBy", fields: [createdById], references: [id])

  stockLots         StockLot[]
  activities        BallActivity[]
  sortirSessions    SortirSession[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([status])
  @@index([division])
  @@index([receivedAt])
}
```

Important notes:

```text
A Ball does not become Stocklist stock by itself.
A Ball is only a source record.
division is null before Sortir 0.
estimatedQuantity may be null.
imagePath is only a static /public demo path.
```

### 7.1 Ball Activity

Ball Activity is a simple audit/history table for Ball lifecycle events.

```prisma
model BallActivity {
  id          String   @id @default(cuid())
  ballId      String
  ball        Ball     @relation(fields: [ballId], references: [id], onDelete: Cascade)

  eventType   String
  description String
  metadata    Json?

  actorId     String
  actor       User     @relation("BallActivityActor", fields: [actorId], references: [id])

  createdAt   DateTime @default(now())

  @@index([ballId, createdAt])
}
```

Seed / allowed demo event types may include:

```text
BALL_CREATED
SORTIR_0_SELECTED
SORTIR_1_COMPLETED
ACCESSORIES_CLASSIFICATION_COMPLETED
```

Use a String rather than enum here for small flexibility. Do not use this table as a replacement for InventoryMovement.

---

## 8. Product Variant Model

ProductVariant is a reusable SKU identity.

A ProductVariant does not represent quantity or warehouse.

```prisma
model ProductVariant {
  id                 String            @id @default(cuid())
  sku                String            @unique
  displayName        String
  division           InventoryDivision
  sortingStage       Int               @default(1)

  categoryId         String?
  category           Category?         @relation(fields: [categoryId], references: [id])

  productTypeId      String?
  productType        ProductType?      @relation(fields: [productTypeId], references: [id])

  // Accessories fields
  accessoryCategory  String?
  accessoryType      String?
  accessoryVariant   String?

  // Future-ready Stoklot fields; no UI for these in demo.
  model              String?
  size               String?
  grade              String?
  color              String?

  defaultUnitId      String?
  defaultUnit        Unit?             @relation(fields: [defaultUnitId], references: [id])

  isActive           Boolean           @default(true)

  stockLots          StockLot[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([division])
  @@index([sortingStage])
  @@index([categoryId])
  @@index([productTypeId])
}
```

### 8.1 SKU Construction

SKU should be generated in a domain helper, not manually in page components.

Suggested helper:

```text
buildStoklotStageOneSku(categoryCode, productTypeCode)
buildAccessoriesSku(category, type, variant)
```

Expected examples:

```text
STL-DWS-HOODIE
STL-DWS-CREWNECK
STL-ANK-TSHIRT-MAN
ACC-BENANG-TERATAI-ABU-MUDA
```

Rules:

```text
SKU is unique.
SKU is deterministic.
SKU is generated from stored master-data codes.
SKU is not editable during Sortir 1.
```

### 8.2 Product Variant Identity Rule

For demo simplicity, use this approach:

```text
Stoklot Stage 1 ProductVariant uniqueness:
division + sortingStage + category + productType

Accessories ProductVariant uniqueness:
division + accessoryCategory + accessoryType + accessoryVariant + defaultUnit
```

Prisma unique constraints involving optional relation IDs can be awkward. It is acceptable to enforce some identity checks in server-side domain functions, as long as SKU remains unique at database level.

---

## 9. Stock Lot Model

StockLot represents concrete stock from a specific Ball in a specific warehouse.

```prisma
model StockLot {
  id                 String   @id @default(cuid())

  productVariantId   String
  productVariant     ProductVariant @relation(fields: [productVariantId], references: [id])

  sourceBallId       String
  sourceBall         Ball     @relation(fields: [sourceBallId], references: [id])

  warehouseId        String
  warehouse          Warehouse @relation(fields: [warehouseId], references: [id])

  unitId             String
  unit               Unit     @relation(fields: [unitId], references: [id])

  availableQuantity  Decimal  @db.Decimal(14, 3)
  hppPerUnit         Decimal  @db.Decimal(14, 2)
  sellingPricePerUnit Decimal @db.Decimal(14, 2)

  receivedFromStage  Int      @default(1)
  note               String?

  movements          InventoryMovement[]
  stockOuts          StockOut[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([productVariantId])
  @@index([sourceBallId])
  @@index([warehouseId])
  @@index([availableQuantity])
}
```

Rules:

```text
availableQuantity must never be negative.
A zero-balance StockLot remains in database.
Do not merge a StockLot with a different source Ball.
Do not merge a StockLot with a different HPP.
Do not allow direct quantity editing from UI.
```

### 9.1 Transfer Behavior

For transfer, the recommended demo design is:

```text
Reduce availableQuantity on source StockLot.
Create a destination StockLot with same:
- productVariant
- sourceBall
- unit
- hppPerUnit
- sellingPricePerUnit
- receivedFromStage

Destination StockLot differs by:
- warehouse
- availableQuantity
```

This is simple, traceable, and works well for demo.

When a future transfer arrives at a warehouse that already contains a matching StockLot with the exact same source Ball, product variant, unit, HPP, and selling price, the implementation may either:

```text
Option A: increase matching destination StockLot
Option B: create a new destination StockLot
```

For simplicity, prefer Option A with a clear matching query. If in doubt, create a new lot rather than merge unrelated data.

---

## 10. Sortir Session and Sortir Result Models

Use explicit session and result models so Sortir 1 can create multiple outputs in one operation and remain auditable.

```prisma
model SortirSession {
  id          String   @id @default(cuid())
  ballId      String
  ball        Ball     @relation(fields: [ballId], references: [id])

  stage       Int
  note        String?

  createdById String
  createdBy   User     @relation("SortirSessionCreatedBy", fields: [createdById], references: [id])

  results     SortirResult[]

  createdAt   DateTime @default(now())

  @@index([ballId, stage])
}
```

```prisma
model SortirResult {
  id             String   @id @default(cuid())
  sessionId      String
  session        SortirSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  stockLotId     String
  stockLot       StockLot @relation(fields: [stockLotId], references: [id])

  quantity       Decimal  @db.Decimal(14, 3)
  note           String?

  createdAt      DateTime @default(now())

  @@index([sessionId])
  @@index([stockLotId])
}
```

For the demo:

```text
SortirSession.stage = 1 only.
SortirResult links every generated stock lot to the same Sortir Session.
```

Do not create a generic workflow engine.

---

## 11. Warehouse Transfer Model

WarehouseTransfer is a business transaction record that connects paired movement rows.

```prisma
model WarehouseTransfer {
  id                     String    @id @default(cuid())
  referenceCode          String    @unique
  transferredAt          DateTime

  sourceWarehouseId      String
  sourceWarehouse        Warehouse @relation("TransferSourceWarehouse", fields: [sourceWarehouseId], references: [id])

  destinationWarehouseId String
  destinationWarehouse   Warehouse @relation("TransferDestinationWarehouse", fields: [destinationWarehouseId], references: [id])

  sourceStockLotId       String
  sourceStockLot         StockLot  @relation("TransferSourceStockLot", fields: [sourceStockLotId], references: [id])

  destinationStockLotId  String?
  destinationStockLot    StockLot? @relation("TransferDestinationStockLot", fields: [destinationStockLotId], references: [id])

  quantity               Decimal   @db.Decimal(14, 3)
  unitId                 String
  unit                   Unit      @relation(fields: [unitId], references: [id])

  note                   String?

  createdById            String
  createdBy              User      @relation("TransferCreatedBy", fields: [createdById], references: [id])

  movements              InventoryMovement[]

  createdAt              DateTime @default(now())

  @@index([transferredAt])
  @@index([sourceWarehouseId])
  @@index([destinationWarehouseId])
}
```

Note: Prisma relation naming must be explicit because `StockLot` is referenced twice.

Add corresponding relation arrays to StockLot if needed:

```prisma
outgoingTransfers WarehouseTransfer[] @relation("TransferSourceStockLot")
incomingTransfers WarehouseTransfer[] @relation("TransferDestinationStockLot")
```

Reference code suggestion:

```text
TRF-YYYY-0001
```

---

## 12. Stock Out Model

```prisma
model StockOut {
  id                 String       @id @default(cuid())
  referenceCode      String       @unique
  occurredAt         DateTime

  stockLotId         String
  stockLot           StockLot     @relation(fields: [stockLotId], references: [id])

  warehouseId        String
  warehouse          Warehouse    @relation(fields: [warehouseId], references: [id])

  quantity           Decimal      @db.Decimal(14, 3)
  unitId             String
  unit               Unit         @relation(fields: [unitId], references: [id])

  salesType          SalesType
  salesChannelId     String
  salesChannel       SalesChannel @relation(fields: [salesChannelId], references: [id])

  packingReference   String?
  invoiceReference   String?
  note               String?

  createdById        String
  createdBy          User         @relation("StockOutCreatedBy", fields: [createdById], references: [id])

  movements          InventoryMovement[]

  createdAt          DateTime @default(now())

  @@index([occurredAt])
  @@index([warehouseId])
  @@index([stockLotId])
  @@index([salesType])
}
```

Reference code suggestion:

```text
OUT-YYYY-0001
```

---

## 13. Inventory Movement Model

InventoryMovement is the immutable audit record.

```prisma
model InventoryMovement {
  id                     String        @id @default(cuid())
  type                   MovementType
  occurredAt             DateTime      @default(now())

  quantity               Decimal       @db.Decimal(14, 3)
  unitId                 String
  unit                   Unit          @relation(fields: [unitId], references: [id])

  stockLotId             String?
  stockLot               StockLot?     @relation(fields: [stockLotId], references: [id])

  productVariantId       String?
  productVariant         ProductVariant? @relation(fields: [productVariantId], references: [id])

  ballId                 String?
  ball                   Ball?         @relation(fields: [ballId], references: [id])

  sourceWarehouseId      String?
  sourceWarehouse        Warehouse?    @relation("MovementSourceWarehouse", fields: [sourceWarehouseId], references: [id])

  destinationWarehouseId String?
  destinationWarehouse   Warehouse?    @relation("MovementDestinationWarehouse", fields: [destinationWarehouseId], references: [id])

  transferId             String?
  transfer               WarehouseTransfer? @relation(fields: [transferId], references: [id])

  stockOutId             String?
  stockOut               StockOut?     @relation(fields: [stockOutId], references: [id])

  referenceType          ReferenceType?
  referenceCode          String?
  note                   String?

  createdById            String
  createdBy              User          @relation("MovementCreatedBy", fields: [createdById], references: [id])

  createdAt              DateTime      @default(now())

  @@index([occurredAt])
  @@index([type])
  @@index([stockLotId])
  @@index([ballId])
  @@index([sourceWarehouseId])
  @@index([destinationWarehouseId])
}
```

### 13.1 Movement Examples

#### Sortir 0

```text
type: SORTIR_0
ballId: BL-2026-0001
quantity: 0
referenceType: SORTIR_0
note: "Divisi dipilih: STOKLOT"
```

It is acceptable for Sortir 0 to use a zero quantity movement, or to use BallActivity only. For consistency of audit views, use both BallActivity and InventoryMovement only if it does not create confusing duplicate UI. Prefer BallActivity for Sortir 0 in the first demo, and reserve InventoryMovement for real stock quantity events.

#### Sortir 1

```text
type: SORTIR_1_IN
stockLotId: generated stock lot
productVariantId: SKU variant
ballId: source Ball
destinationWarehouseId: selected warehouse
quantity: output quantity
referenceType: SORTIR_1
referenceCode: Sortir Session ID or visible reference
```

#### Transfer

```text
TRANSFER_OUT
sourceWarehouseId: Gudang Sortir
destinationWarehouseId: Gudang Retail
quantity: 8
transferId: transfer reference

TRANSFER_IN
sourceWarehouseId: Gudang Sortir
destinationWarehouseId: Gudang Retail
quantity: 8
transferId: same transfer reference
```

#### Stock Out

```text
type: STOCK_OUT
stockLotId: source stock lot
sourceWarehouseId: selected warehouse
quantity: 3
stockOutId: stock out reference
referenceType: STOCK_OUT
referenceCode: OUT-2026-0001
```

---

## 14. Required Prisma Relations Checklist

Before writing schema, ensure these concepts are connected:

```text
User → Ball (created by)
User → BallActivity
User → SortirSession
User → WarehouseTransfer
User → StockOut
User → InventoryMovement

Warehouse → StockLot
Warehouse → source transfers
Warehouse → destination transfers
Warehouse → source movements
Warehouse → destination movements

Ball → StockLot
Ball → BallActivity
Ball → SortirSession
Ball → InventoryMovement

ProductVariant → StockLot
ProductVariant → InventoryMovement

StockLot → InventoryMovement
StockLot → StockOut
StockLot → outgoing transfers
StockLot → incoming transfers

SortirSession → SortirResult
SortirResult → StockLot

WarehouseTransfer → InventoryMovement
StockOut → InventoryMovement
```

Be careful with ambiguous relations in Prisma. Name relations explicitly where the same model is referenced more than once.

---

## 15. Critical Transaction Pseudocode

### 15.1 Sortir 1

```text
transaction:
  validate Ball exists
  validate Ball division is STOKLOT
  validate Ball status allows Sortir 1
  validate all result rows

  create SortirSession(stage 1)

  for each result row:
    find or create ProductVariant
    create StockLot linked to:
      - Ball
      - ProductVariant
      - Destination Warehouse
      - Unit
      - HPP
      - Selling Price
      - Quantity
    create SortirResult
    create InventoryMovement SORTIR_1_IN

  update Ball status to PARTIALLY_CLASSIFIED
  create BallActivity SORTIR_1_COMPLETED
```

### 15.2 Accessories Classification

```text
transaction:
  validate Ball is ACCESSORIES
  validate Ball status allows classification
  validate all result rows

  for each result row:
    find or create Accessories ProductVariant
    create StockLot
    create InventoryMovement ACCESSORIES_CLASSIFICATION_IN

  update Ball status to PARTIALLY_CLASSIFIED
  create BallActivity ACCESSORIES_CLASSIFICATION_COMPLETED
```

### 15.3 Warehouse Transfer

```text
transaction:
  validate source StockLot exists
  validate source stock lot warehouse matches source warehouse
  validate source quantity is sufficient
  validate source and destination warehouse differ

  decrement source StockLot available quantity
  find or create matching destination StockLot
  increment destination StockLot available quantity

  create WarehouseTransfer
  create InventoryMovement TRANSFER_OUT
  create InventoryMovement TRANSFER_IN
```

### 15.4 Stock Out

```text
transaction:
  validate source StockLot exists
  validate stock lot warehouse matches selected warehouse
  validate available quantity is sufficient
  validate sales channel and sales type

  decrement source StockLot available quantity
  create StockOut
  create InventoryMovement STOCK_OUT
```

---

## 16. Decimal and Money Rules

Use Prisma Decimal fields for:

```text
purchaseCost
estimatedQuantity
availableQuantity
hppPerUnit
sellingPricePerUnit
transfer quantity
stock out quantity
movement quantity
```

Rules:

```text
Money values use Decimal(14, 2).
Quantity values use Decimal(14, 3).
Do not use JavaScript float arithmetic for money.
Convert Decimal safely for UI presentation.
```

For demo, Stoklot commonly uses whole PCS values. Accessories may use fractional KG values.

---

## 17. Seed Requirements

The seed script must create enough data for a presentation-ready demo.

### 17.1 Required Seed Data

```text
3 users
3 warehouses
2 categories
13 Stoklot product types
4 units
6 sales channels
At least 4 Ball / Batch records
At least 8 Product Variants
At least 10 Stock Lots across 3 warehouses
At least 20 Inventory Movements
At least 2 Transfers
At least 2 Stock Out transactions
```

### 17.2 Required Seed Story

At minimum seed one complete traceable scenario:

```text
Ball BL-2026-0001
→ Sortir 0 selected STOKLOT
→ Sortir 1 generated Hoodie Dewasa
→ stock split across Gudang Sortir and Gudang Retail
→ transfer from Gudang Sortir to Gudang Retail
→ stock out from Gudang Retail
```

Also seed one Accessories scenario:

```text
Accessories Ball ACC-2026-0001
→ Sortir 0 selected ACCESSORIES
→ Benang Jahit / Teratai / Abu Muda
→ stock in Gudang Grosir
→ transfer to Gudang Retail
→ stock out
```

---

## 18. Migration Requirements

Use Prisma migrations.

Rules:

```text
Every schema change must use a named migration.
Do not rely on prisma db push for the main demo workflow.
Keep schema readable.
Run prisma generate after schema changes.
Maintain a valid seed script.
```

Suggested command flow:

```bash
pnpm prisma migrate dev --name init_inventory_demo
pnpm prisma generate
pnpm prisma db seed
```

Exact package scripts can vary, but database setup must be reproducible.

---

## 19. Data Model Non-Goals

Do not create models for:

```text
Accounting journal
Invoices with accounting lifecycle
Customers
Suppliers as separate master table
Purchase orders
Marketplace orders
Returns
Adjustments
Stock opname
KPI
Notifications
File uploads
Multi-company tenancy
Advanced permissions
```

Supplier is a simple `supplierName` text field on Ball for this demo.

Keep it simple.

---

## 20. Schema Review Checklist

Before implementation is considered done, verify:

```text
[ ] Every stock lot links to a source Ball
[ ] Every stock lot links to one warehouse
[ ] ProductVariant is separate from StockLot
[ ] StockLot quantity cannot become negative through server actions
[ ] Sortir 1 supports multiple outputs from one Ball
[ ] Transfer creates paired movement records
[ ] Stock Out creates movement record
[ ] Ball and stock traceability can be queried efficiently
[ ] Common list pages have indexes for time, status, warehouse, stock lot, and Ball
[ ] Seed data creates a coherent demo story
[ ] No schema model exists only for imagined future features
```
