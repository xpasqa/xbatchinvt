# Ball Fashion Inventory Demo
## 04 — Implementation Plan, Sprint Order, and Codex Task Rules

> **Purpose:** This document defines how the demo must be built step by step.
>
> Codex must not attempt to build the full system in one pass.
>
> Build vertical slices. Each slice must work end-to-end before moving to the next slice.
>
> Read together with:
>
> - `docs/00-project-context.md`
> - `docs/01-business-rules.md`
> - `docs/02-demo-scope-and-routes.md`
> - `docs/03-data-model.md`

---

## 1. Implementation Strategy

Use a vertical-slice approach.

Do not build all database models first, then all UI, then all logic.

Instead, complete one usable workflow at a time:

```text
Authentication
→ App shell
→ Ball / Batch
→ Sortir 0
→ Sortir 1
→ Stocklist
→ Transfer
→ Stock Out
→ Dashboard
→ Final QA
```

Each completed slice must include:

```text
Database data
Server-side validation
Server action or route handler
Functional UI
Role check
Success and error feedback
Manual verification steps
```

Do not move to a later slice if the earlier slice is broken.

---

## 2. Definition of Done

A task is done only if all applicable items are complete:

```text
[ ] Code follows the docs and scope boundaries
[ ] Database changes use Prisma migration
[ ] Seed data is updated if needed
[ ] UI uses shadcn/ui
[ ] Visible UI text is Indonesian
[ ] Form is validated with Zod
[ ] Server-side authorization exists
[ ] Inventory mutation uses Prisma transaction where required
[ ] Success and error states are visible
[ ] Empty state and loading state are handled
[ ] Manual flow has been tested
[ ] Lint and typecheck pass
[ ] Changed files are summarized
```

Do not call a task done because the page renders.

A task is done when the intended business flow works from user action to persisted data to visible result.

---

## 3. Project Setup Task

### Goal

Create a clean Next.js project foundation that is compatible with Vercel, Neon, Prisma, credential login, Tailwind, and shadcn/ui.

### Required Work

```text
Create Next.js App Router project with TypeScript
Configure Tailwind CSS
Initialize shadcn/ui
Install Lucide React
Install Prisma and configure Neon PostgreSQL connection
Create initial Prisma schema
Configure credential-based authentication
Create app layout and route groups
Configure environment variable example file
Create seed script foundation
```

### Required Packages

Use only what is needed.

Expected package categories:

```text
next
react
typescript
tailwindcss
prisma
@prisma/client
zod
react-hook-form
@hookform/resolvers
bcryptjs or equivalent secure password hashing package
next-auth or compatible credential authentication package
lucide-react
shadcn/ui dependencies
sonner
```

Do not install extra state management, charting, or UI frameworks unless a clear current requirement exists.

### Required Scripts

Recommended scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint or eslint",
  "typecheck": "tsc --noEmit",
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:seed": "prisma db seed"
}
```

Exact script syntax may vary with the project setup, but database setup must be reproducible.

### Acceptance Criteria

```text
[ ] App starts locally
[ ] Prisma connects to Neon
[ ] Prisma schema validates
[ ] A migration can run
[ ] Seed script can run
[ ] shadcn/ui components are available
[ ] Build succeeds
[ ] No secrets are committed
```

---

## 4. Sprint 1 — Authentication and App Shell

### Goal

Create secure login, protected routes, role-aware navigation, and an initial dashboard shell.

### Scope

```text
Credential login
Seed three users
Session handling
Protected dashboard routes
Role-aware sidebar
Top header
Logout
Basic dashboard shell
```

### Required Pages

```text
/login
/dashboard
```

### Required Components

```text
AppSidebar
AppHeader
PageHeader
RoleBadge
LoadingState
EmptyState
```

### Required Seed Users

```text
Owner
owner@ballfashion.demo
Demo12345!

Admin Inventory
admin@ballfashion.demo
Demo12345!

Admin Gudang
warehouse@ballfashion.demo
Demo12345!
```

### Required Behavior

```text
Unauthenticated user opening /dashboard is redirected to /login.
Authenticated user opening /login is redirected to /dashboard.
Role-restricted navigation is hidden.
Role restrictions are also enforced server-side.
Logout ends the session.
```

### Dashboard at This Sprint

Dashboard can use database-backed placeholder counts or zero counts until inventory data exists.

Do not use hardcoded fake totals in final implementation.

### Manual Verification

```text
1. Log in as Owner.
2. Confirm all navigation items appear.
3. Log out.
4. Log in as Admin Gudang.
5. Confirm Master Data and Ball creation navigation are hidden.
6. Attempt direct route access to Master Data.
7. Confirm access is denied or redirected.
```

### Sprint 1 Done When

```text
[ ] Login works
[ ] Logout works
[ ] Protected routes work
[ ] Role navigation works
[ ] App shell uses shadcn/ui
[ ] Dashboard route renders
[ ] Typecheck and build pass
```

---

## 5. Sprint 2 — Master Data and Seed Foundation

### Goal

Create the minimum master data required for Ball input, Sortir 1, transfer, and stock out.

### Scope

```text
Warehouses
Categories
Product Types
Units
Sales Channels
Simple master data pages
Seed all operational defaults
```

### Required Routes

```text
/master-data
/master-data/warehouses
/master-data/categories
/master-data/product-types
/master-data/units
/master-data/sales-channels
```

### Required Seed Data

Warehouses:

```text
Gudang Sortir
Gudang Retail
Gudang Grosir
```

Categories:

```text
Dewasa
Anak
```

Units:

```text
PCS
KG
ROLL
PACK
```

Sales Channels:

```text
Shopee
TikTok
Retail
RUD
Oajet Nux
Paket Pilih
```

Product Types:

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

### UI Requirements

```text
Use shadcn/ui Table
Use searchable list where useful
Use Dialog or Sheet for small create/edit forms
Use Alert Dialog for destructive action confirmation if delete exists
Use Badge for active/inactive status
```

### Simplification Rule

Do not build advanced master data management.

For demo, basic create and edit is enough.

Avoid delete workflows unless required. Prefer active/inactive status.

### Manual Verification

```text
1. Login as Owner.
2. Open each Master Data page.
3. Confirm seed data exists.
4. Create one test category or unit.
5. Edit it.
6. Confirm Admin Gudang cannot access these pages.
```

### Sprint 2 Done When

```text
[ ] All seed master data exists
[ ] Owner and Admin Inventory can manage master data
[ ] Admin Gudang cannot manage master data
[ ] Forms validate correctly
[ ] Data is persisted in Neon
```

---

## 6. Sprint 3 — Ball / Batch Management

### Goal

Enable Inventory Admin to record incoming Ball or Batch records before any stock is active.

### Scope

```text
Ball list
Add Ball form
Ball detail
Ball status
Ball activity history
Static image path selector
```

### Required Routes

```text
/balls
/balls/new
/balls/[ballId]
```

### Required Fields

```text
Ball Code
Received Date
Supplier / Source
Initial Warehouse
Purchase Cost
Estimated Quantity
Unit
Notes
Optional Static Demo Image Path
```

### Rules

```text
Initial status is WAITING_SORTIR_0.
Division is null before Sortir 0.
Ball does not appear in Stocklist yet.
Ball Code must be unique.
Ball must not be hard-deleted after workflow activity exists.
```

### UI Requirements

```text
Full-page Add Ball form
Ball List data table
Ball Detail information card
Workflow progress card
Activity timeline
Status badge
Contextual action button
```

### Manual Verification

```text
1. Create a new Ball.
2. Confirm it appears in Ball List.
3. Open its detail page.
4. Confirm status is WAITING_SORTIR_0.
5. Confirm it does not appear in Stocklist.
6. Confirm Ball Created activity is visible.
```

### Sprint 3 Done When

```text
[ ] Ball CRUD required for demo works
[ ] Ball detail works
[ ] Ball list filters work
[ ] Ball data persists
[ ] Role restrictions work
```

---

## 7. Sprint 4 — Sortir 0

### Goal

Enable division selection for an incoming Ball.

### Scope

```text
Sortir 0 page
Division selection
Ball status update
Ball activity history update
Role checks
```

### Required Route

```text
/balls/[ballId]/sortir-0
```

### Required Behavior

```text
WAITING_SORTIR_0 Ball
→ select STOKLOT
→ READY_FOR_SORTIR_1

WAITING_SORTIR_0 Ball
→ select ACCESSORIES
→ READY_FOR_ACCESSORIES_CLASSIFICATION
```

### UI Requirements

```text
Ball summary card
Two large division cards
Confirmation dialog
Success toast
Redirect back to Ball Detail
```

### Manual Verification

```text
1. Create a new Ball.
2. Run Sortir 0 as Admin Inventory.
3. Choose STOKLOT.
4. Confirm Ball status changes.
5. Confirm Ball Detail shows Sortir 1 action.
6. Create another Ball.
7. Choose ACCESSORIES.
8. Confirm Ball Detail shows Accessories Classification action.
```

### Sprint 4 Done When

```text
[ ] Sortir 0 changes division correctly
[ ] Status transitions follow business rules
[ ] Activity history is created
[ ] Unauthorized user cannot process Sortir 0
```

---

## 8. Sprint 5 — Sortir 1 and Accessories Classification

### Goal

Create active sellable stock from a Ball.

This is the most important sprint in the demo.

### Scope

```text
Sortir 1 full-page form
Multiple output rows
Generated SKU
Product Variant creation or reuse
Stock Lot creation
Sortir Session and Result records
Inventory movements
Accessories Classification form
Transactional database writes
```

### Required Routes

```text
/balls/[ballId]/sortir-1
/balls/[ballId]/accessories-classification
```

### Sortir 1 Required Behavior

```text
One Stoklot Ball can create multiple output rows.
Each result row creates active sellable stock.
Each created Stock Lot is linked to source Ball.
Each output creates SORTIR_1_IN movement.
Ball status becomes PARTIALLY_CLASSIFIED.
```

### Accessories Required Behavior

```text
One Accessories Ball can create multiple classification rows.
Each row creates active Accessories stock.
Each created Stock Lot is linked to source Ball.
Each output creates ACCESSORIES_CLASSIFICATION_IN movement.
Ball status becomes PARTIALLY_CLASSIFIED.
```

### Technical Requirement

All writes for one submit must use a single Prisma transaction.

If any output row is invalid:

```text
Do not save any row.
Show clear error.
```

### Required UI

```text
Ball summary
Instruction notice
Dynamic result row table
Add row action
Remove row action
Quantity summary
Estimated quantity warning
Save button
Form validation feedback
```

### Manual Verification

```text
1. Open a Stoklot Ball ready for Sortir 1.
2. Add three result rows.
3. Save.
4. Confirm three Stock Lots exist.
5. Confirm generated SKUs are correct.
6. Confirm all Stock Lots link to the source Ball.
7. Confirm Ball status is PARTIALLY_CLASSIFIED.
8. Open an Accessories Ball.
9. Add two Accessories classifications.
10. Confirm Stock Lots and movements exist.
11. Submit invalid data and confirm no partial records are created.
```

### Sprint 5 Done When

```text
[ ] Multiple result rows work
[ ] Database writes are atomic
[ ] Generated SKU is deterministic
[ ] Active stock is created
[ ] Ball traceability exists
[ ] Both Stoklot and Accessories paths work
```

---

## 9. Sprint 6 — Stocklist and Stock Detail

### Goal

Show active stock, current quantity, source Ball, and movement history.

### Scope

```text
Stocklist
Filters and search
Stock Detail
Movement timeline
Source Ball view
Quick action links
```

### Required Routes

```text
/stocklist
/stocklist/[stockLotId]
```

### Required Stocklist Features

```text
Database-backed table
Warehouse filter
Division filter
SKU / product search
Sorting stage filter
Category filter
Last updated filter
Zero stock display
Row actions
```

### Required Stock Detail Features

```text
Overview tab
Movement timeline tab
Source Ball tab
Transfer and Stock Out actions when stock is available
```

### Simplification Rule

Do not implement inline stock edits.

Do not build complicated server-side table abstraction until needed. A simple server query plus URL search params is acceptable.

### Manual Verification

```text
1. Complete Sortir 1.
2. Open Stocklist.
3. Search by generated SKU.
4. Filter by warehouse.
5. Open Stock Detail.
6. Confirm source Ball appears.
7. Confirm Sortir 1 movement appears in timeline.
```

### Sprint 6 Done When

```text
[ ] Stocklist reflects database balances
[ ] Filters work
[ ] Stock detail traceability works
[ ] Movement timeline is chronological
[ ] No direct quantity edit exists
```

---

## 10. Sprint 7 — Warehouse Transfer

### Goal

Move stock safely between Gudang Sortir, Gudang Retail, and Gudang Grosir.

### Scope

```text
Transfer list
New transfer form
Source quantity validation
Destination Stock Lot creation or update
Paired inventory movements
Transfer reference
```

### Required Routes

```text
/transfers
/transfers/new
```

### Required Business Behavior

```text
Source and destination warehouse cannot be same.
Transfer quantity must be greater than zero.
Transfer quantity cannot exceed available stock.
Source balance decreases.
Destination balance increases.
TRANSFER_OUT and TRANSFER_IN movements are created.
Both movements share transfer reference.
```

### Technical Requirement

Use one Prisma transaction.

### Manual Verification

```text
1. Select stock in Gudang Sortir.
2. Transfer part of quantity to Gudang Retail.
3. Confirm source quantity decreases.
4. Confirm destination stock appears or increases.
5. Confirm transfer list has a reference.
6. Confirm source and destination stock history show correct movement.
7. Attempt over-transfer and confirm it fails.
```

### Sprint 7 Done When

```text
[ ] Transfer is atomic
[ ] Quantity validation works
[ ] Source and destination are updated correctly
[ ] Movement history is correct
```

---

## 11. Sprint 8 — Stock Out

### Goal

Record stock leaving the warehouse for sales or fulfillment.

### Scope

```text
Stock Out list
New Stock Out form
Source quantity validation
Sales type and channel
Invoice / SPK reference
STOCK_OUT movement
```

### Required Routes

```text
/stock-out
/stock-out/new
```

### Required Business Behavior

```text
Selected stock must belong to selected warehouse.
Quantity cannot exceed available stock.
Sales Type and Sales Channel are required.
Valid submission reduces available quantity.
STOCK_OUT movement is created.
```

### Technical Requirement

Use one Prisma transaction.

### Manual Verification

```text
1. Select a Stock Lot in Gudang Retail.
2. Create Stock Out.
3. Use Offline → Retail.
4. Confirm stock decreases.
5. Confirm Stock Out list shows transaction.
6. Confirm Stock Detail timeline updates.
7. Attempt Stock Out above available quantity and confirm it fails.
```

### Sprint 8 Done When

```text
[ ] Stock Out persists correctly
[ ] Quantity updates correctly
[ ] Movement record exists
[ ] Dashboard can later consume data
```

---

## 12. Sprint 9 — Dashboard Wiring and Demo Polish

### Goal

Make the demo presentation-ready.

### Scope

```text
Real dashboard totals
Recent Ball table
Recent movement table
Low / zero stock section
Quick actions
Empty states
Loading states
Error handling polish
Responsive review
Seed scenario review
```

### Dashboard Data Requirements

Use real database queries for:

```text
Total active stock
Stock by warehouse
Stock by division
Recent Ball
Recent movements
Low / zero stock
```

Do not use static numbers.

### UI Polish Requirements

```text
No lorem ipsum
No unfinished buttons
No broken links
No English visible UI unless intentional product names
No raw enum labels in visible UI
No ugly JSON debug output
No console errors
```

### Manual Verification

```text
1. Run full seeded demo story.
2. Confirm dashboard numbers change after transfer and stock out.
3. Test each role.
4. Check desktop layout.
5. Check tablet and mobile browser layout.
6. Check empty states by using filters that return no data.
7. Check loading and error behavior.
```

### Sprint 9 Done When

```text
[ ] Dashboard is database-backed
[ ] All major routes are polished
[ ] Demo feels coherent
[ ] Client can follow flow without developer explanation
```

---

## 13. Sprint 10 — Vercel Readiness and Final QA

### Goal

Ensure the project is deployable and reliable for live demo.

### Scope

```text
Environment variable review
Production build
Neon production database verification
Prisma migration verification
Seed strategy verification
Vercel deployment configuration
Final role test
Final end-to-end demo test
```

### Required Environment Variables

```text
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
AUTH_URL=
```

### Deployment Rules

```text
Do not rely on local filesystem writes.
Do not use SQLite.
Do not include secrets in source control.
Do not leave localhost URLs hardcoded.
Do not rely on local seed data that cannot be reproduced.
```

### Final Demo Test Script

```text
1. Open deployed Vercel URL.
2. Login as Admin Inventory.
3. Create Ball.
4. Complete Sortir 0.
5. Complete Sortir 1 with multiple rows.
6. Open Stocklist.
7. Transfer stock.
8. Create Stock Out.
9. Open Stock Detail and confirm history.
10. Login as Admin Gudang.
11. Confirm role restriction.
12. Login as Owner.
13. Confirm dashboard visibility.
```

### Sprint 10 Done When

```text
[ ] Production build passes
[ ] Vercel deploy passes
[ ] Neon database persists data
[ ] All demo accounts work
[ ] Full end-to-end scenario works in deployment
[ ] No critical error remains
```

---

## 14. Codex Prompt Pattern

Use small, bounded prompts.

### Good Prompt Template

```text
Read these files first:
- docs/00-project-context.md
- docs/01-business-rules.md
- docs/02-demo-scope-and-routes.md
- docs/03-data-model.md
- docs/04-implementation-plan.md

Implement only [SPRINT NAME / TASK NAME].

Requirements:
- Follow business rules exactly.
- Use shadcn/ui for all visible UI.
- Use Indonesian visible text.
- Use Zod validation.
- Enforce role checks server-side.
- Use Prisma transaction for inventory mutations.
- Do not implement features outside this task.
- Run typecheck and lint if available.

When finished, return:
1. What was implemented.
2. Files changed.
3. Migration and seed changes.
4. Manual verification steps.
5. Known limitations.
```

### Example Prompt — Sprint 3

```text
Read docs/00-project-context.md through docs/04-implementation-plan.md.

Implement Sprint 3 only: Ball / Batch Management.

Build:
- /balls
- /balls/new
- /balls/[ballId]

Include:
- database-backed Ball list
- Add Ball form with Zod validation
- Ball detail page
- Ball activity record when created
- role checks
- shadcn/ui UI
- Indonesian labels

Do not implement Sortir 0 or Sortir 1 yet.
Do not add future features.
Use Prisma migration if schema changes are needed.

Return concise summary, changed files, migration/seed changes, and manual testing steps.
```

---

## 15. Required Review Behavior

After every sprint, inspect the implementation against the docs.

Use this review checklist:

```text
Does it follow the defined scope?
Does it obey business rules?
Does it use database data instead of fake arrays?
Does it use shadcn/ui?
Is visible UI Indonesian?
Are permissions enforced server-side?
Are error messages useful?
Can an end user complete the flow?
Was unnecessary architecture added?
Is the code understandable without reading a giant abstraction?
```

If the answer is no, fix before continuing.

---

## 16. Anti-Overengineering Rules

Do not add these unless explicitly requested later:

```text
Redux
Zustand
React Query
GraphQL
Microservices
Message queues
Event bus
Generic repository layer
CQRS
Domain-driven design framework
Complex dependency injection
Real-time websocket sync
Feature flag platform
Generic workflow builder
Generic form builder
Generic permission engine
```

For this demo, simple Next.js server actions, Prisma, Zod, and focused components are enough.

---

## 17. Final Principle

The goal is not to show the most features.

The goal is to demonstrate one inventory workflow that is:

```text
Clear
Accurate
Traceable
Fast to understand
Easy to operate
Safe enough for real validation
Ready to extend after client approval
```
