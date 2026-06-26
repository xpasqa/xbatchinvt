# Ball Fashion Inventory Demo
## 05 — Codex Rules, Clean Code Standard, and Delivery Format

> **Purpose:** This document is the execution contract for Codex.
>
> Codex must follow these rules on every task in this repository.
>
> Read this file together with:
>
> - `docs/00-project-context.md`
> - `docs/01-business-rules.md`
> - `docs/02-demo-scope-and-routes.md`
> - `docs/03-data-model.md`
> - `docs/04-implementation-plan.md`

---

## 1. Core Working Rule

Do not attempt to “improve” the product by adding features not requested.

The project goal is a clean, working, presentation-ready inventory demo.

Priorities, in order:

```text
1. Correct business flow
2. Data integrity
3. Clear UI
4. Simple maintainable code
5. Fast demo readiness
6. Future extensibility only where it costs little
```

Do not prioritize generic architecture, advanced abstractions, or extra features over the required workflow.

---

## 2. Required Reading Before Any Task

Before making changes:

```text
1. Read docs/00-project-context.md
2. Read docs/01-business-rules.md
3. Read the relevant route/screen section in docs/02-demo-scope-and-routes.md
4. Read the relevant data section in docs/03-data-model.md
5. Read the applicable sprint in docs/04-implementation-plan.md
6. Read this file
```

If a task conflicts with the docs:

```text
Business rules take precedence.
Scope boundaries take precedence.
Do not silently invent a new interpretation.
Choose the simplest implementation that preserves the stated business rules.
```

---

## 3. Scope Discipline

Implement only the requested sprint or task.

Do not implement these unless explicitly requested:

```text
Sortir 2 to Sortir 5
Returns
Stock adjustment
Stock opname
Accounting
Kledo integration
Marketplace integration
POS
Barcode scanner
Printer label
KPI
Mobile application
Runtime file upload
Approval workflow
Real-time sync
Complex analytics
```

Do not add placeholder pages for future scope unless a small clearly labeled “Fase Lanjutan” note is specifically requested.

---

## 4. Technology Rules

Use only the project stack:

```text
Next.js App Router
TypeScript
Tailwind CSS
shadcn/ui
Lucide React
Neon PostgreSQL
Prisma ORM
Credential-based authentication
Zod
React Hook Form where needed
Vercel deployment
Static images inside /public/demo
```

Do not add:

```text
Material UI
Ant Design
Chakra UI
Bootstrap
DaisyUI
Firebase
Supabase
MongoDB
SQLite
Express
NestJS
Laravel
GraphQL
Redux
Zustand
React Query
Microservices
Message queues
WebSockets
Event bus
CQRS
Repository pattern without a current need
```

A new package is allowed only if:

```text
1. It solves an immediate required problem.
2. The existing stack cannot solve it cleanly.
3. It does not introduce another architecture layer.
4. It is explained in the implementation summary.
```

---

## 5. UI Rules

### 5.1 shadcn/ui First

Use shadcn/ui for every standard visible UI element.

Preferred components:

```text
Sidebar
Button
Card
Table
Input
Textarea
Select
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
Sonner
Tooltip
Scroll Area
Command
Separator
```

Do not recreate an existing shadcn/ui component manually.

### 5.2 Custom UI Components

Custom components are allowed only for business-specific needs.

Examples:

```text
StockMovementTimeline
SortingResultRow
BallStatusBadge
WarehouseStockCard
InventorySummaryCard
StockTraceabilityTree
```

Custom components must be composed from shadcn/ui primitives when possible.

### 5.3 UI Language

All visible user-facing text must be Indonesian.

This includes:

```text
Navigation labels
Buttons
Form labels
Validation messages
Empty states
Toast notifications
Table headings
Status labels
Dialog text
Error messages
```

Do not expose raw database enum values directly to users.

Example:

```text
WAITING_SORTIR_0 → Menunggu Sortir 0
READY_FOR_SORTIR_1 → Siap Sortir 1
PARTIALLY_CLASSIFIED → Sebagian Diproses
STOCK_OUT → Barang Keluar
```

### 5.4 UX Requirements

Every important page should have:

```text
Page title
Short description when useful
Clear primary action
Loading state
Empty state
Error state
Responsive behavior
```

Every mutation form should have:

```text
Clear required fields
Inline validation
Submit loading state
Success toast
Error toast or inline error
Cancel action
```

Avoid:

```text
Excessive visual effects
Large gradients
Overly rounded novelty cards
Unnecessary charts
Dense uncontrolled forms
Unreadable data tables
```

---

## 6. Code Quality Rules

### 6.1 TypeScript

Use TypeScript strictly.

Do not use:

```text
any
ts-ignore
ts-nocheck
unsafe type assertions without justification
```

Prefer:

```text
explicit domain types
inferred Prisma types where appropriate
Zod-derived input types
small focused interfaces
```

### 6.2 File Size and Responsibility

Keep files focused.

Rules:

```text
Page components should primarily compose UI and load data.
Business rules should not be hidden inside large page components.
Server mutations should be separated into clear server action modules.
Validation schemas should live in lib/validations.
Inventory calculations and transaction logic should live in lib/inventory.
Shared UI should be reusable.
```

If a page component becomes difficult to scan, split it into focused components.

Do not split files mechanically. Split only when it improves readability and responsibility.

### 6.3 Naming

Use clear names.

Good examples:

```text
createBall
performSortirZero
performSortirOne
classifyAccessories
transferStock
createStockOut
getStockLotDetail
buildStoklotStageOneSku
```

Avoid vague names:

```text
handleSubmitData
updateThing
processItem
doAction
commonUtils
helper2
```

### 6.4 Abstraction Rule

Do not create an abstraction until there is a real repeated use case.

Do not create:

```text
Generic CRUD engines
Generic repository layers
Generic service frameworks
Generic dynamic form builders
Generic workflow engines
```

Prefer explicit and readable domain functions.

---

## 7. Database and Prisma Rules

### 7.1 Migrations

Every schema change must use a named Prisma migration.

Use:

```text
prisma migrate dev
prisma generate
prisma db seed
```

Do not rely on `prisma db push` as the normal development workflow.

### 7.2 Prisma Transactions

These actions must use a Prisma transaction:

```text
Sortir 1
Accessories Classification
Warehouse Transfer
Stock Out
```

Do not split related inventory writes into separate non-transactional calls.

### 7.3 Quantity Integrity

Never allow:

```text
Negative available quantity
Transfer above available stock
Stock out above available stock
Sorting output above validated source quantity
Direct stock quantity edit in Stocklist
```

Use server-side validation as the authority.

### 7.4 Money and Quantity

Use Prisma Decimal values for:

```text
Purchase cost
HPP per unit
Selling price per unit
Available quantity
Transfer quantity
Stock out quantity
```

Do not use JavaScript floating-point arithmetic for money logic.

### 7.5 History Integrity

Never hard-delete:

```text
InventoryMovement
WarehouseTransfer
StockOut
SortirSession
SortirResult
Ball with dependent stock history
```

When correction is needed in future, use a compensating transaction instead of editing history.

---

## 8. Server Action and Validation Rules

### 8.1 Form Pattern

Use this pattern for mutations:

```text
shadcn/ui Form
→ React Hook Form where interaction warrants it
→ Zod client validation
→ Server Action
→ Zod server validation
→ authorization check
→ Prisma transaction if inventory mutation
→ revalidatePath
→ Sonner success/error feedback
```

### 8.2 Server Actions

Server Actions must:

```text
Check authenticated user
Check user role
Validate payload
Run business rule validation
Execute database writes
Return clear result
Revalidate affected pages
```

Do not trust client-provided:

```text
Role
Current stock quantity
Warehouse ownership
User ID
Permissions
```

Always read sensitive state from the database in the server action.

### 8.3 Error Messages

Use useful Indonesian errors.

Examples:

```text
"Jumlah harus lebih dari 0."
"Jumlah melebihi stok tersedia."
"Gudang asal dan gudang tujuan tidak boleh sama."
"Ball belum siap untuk Sortir 1."
"Anda tidak memiliki akses untuk melakukan tindakan ini."
"Data tidak ditemukan."
```

Do not expose raw Prisma errors or internal stack traces to end users.

---

## 9. Authentication and Authorization Rules

### 9.1 Route Protection

Authenticated application routes must require a valid session.

Unauthenticated access should redirect to:

```text
/login
```

### 9.2 Role Protection

Role checks must happen server-side, not only in UI.

Required role policy:

```text
OWNER:
- all demo actions

ADMIN_INVENTORY:
- Ball creation
- Sortir 0
- Sortir 1
- Accessories classification
- Master data
- Transfer
- Stock out
- View all records

ADMIN_WAREHOUSE:
- View dashboard
- View Ball records
- View Stocklist
- Transfer stock
- Create Stock Out
- View movements
- No Ball creation
- No sorting
- No master data
```

### 9.3 No Fake Security

Do not implement permissions only by hiding buttons.

If a user opens a restricted route directly, deny access or redirect safely.

---

## 10. Seed Data Rules

The demo must never look empty after seed.

Seed data must support:

```text
Dashboard summary cards
Recent Ball list
Recent movement list
Stocklist across all warehouses
Low stock / zero stock display
One full Stoklot traceability story
One full Accessories traceability story
Transfer examples
Stock out examples
All three demo users
```

Seed data should be realistic and internally consistent.

Do not seed broken data such as:

```text
Negative stock
Missing source Ball
Movement without product context
Transfer without source and destination
Stock Out above quantity
Duplicate unique codes
```

The seed script must be idempotent or have clear reset instructions.

---

## 11. Static Image Rules

Use static demo images only.

Allowed locations:

```text
/public/demo/balls
/public/demo/products
```

Database stores relative public paths such as:

```text
/demo/balls/ball-001.jpg
```

Do not implement:

```text
Runtime uploads
MinIO
Vercel Blob
S3
File write APIs
```

If an image is missing, show a graceful image placeholder.

---

## 12. Testing and Verification Rules

For each implemented task, Codex must perform or document:

```text
Typecheck
Lint
Build when practical
Manual route verification
Role verification when applicable
Mutation verification when applicable
Database verification when applicable
```

For inventory mutations, verify:

```text
Before quantity
Transaction action
After quantity
Movement records
Traceability UI
```

Do not claim a feature works without exercising its intended flow.

---

## 13. Required Response Format After Every Codex Task

After completing a task, provide a concise report with exactly these sections:

```text
## Completed
- What was implemented.

## Files Changed
- List files added or changed.

## Database / Seed Changes
- Prisma schema, migration, seed changes, if any.

## Manual Verification
- Exact steps to test the completed flow.

## Known Limitations
- Anything intentionally not implemented.
```

Do not provide a long generic recap. Be concrete.

---

## 14. Git and Change Safety Rules

Before major work:

```text
Check git status.
Do not overwrite unrelated user changes.
Do not delete files unless necessary.
Do not alter existing environment variables without explanation.
```

After work:

```text
Review changed files.
Run relevant checks.
Keep commits focused by sprint or feature.
```

Suggested commit style:

```text
feat(auth): add credential login and role-aware app shell
feat(balls): add Ball intake workflow
feat(sortir): implement Sortir 0 and Sortir 1
feat(inventory): add Stocklist and movement history
feat(transfer): add warehouse stock transfer
feat(stock-out): add outbound inventory flow
```

---

## 15. Vercel Readiness Rules

The deployed demo must work on Vercel.

Do not:

```text
Write files at runtime
Use SQLite
Depend on a long-running server process
Hardcode localhost URLs
Commit secrets
Expose database credentials in client code
```

Required deployed environment variables:

```text
DATABASE_URL
DIRECT_URL
AUTH_SECRET
AUTH_URL
```

Use `.env.example` with variable names only.

---

## 16. What “Simple and Clean” Means Here

Simple and clean does not mean incomplete.

It means:

```text
One clear source of truth for each data concept.
One straightforward path for each stock mutation.
Few dependencies.
Explicit business functions.
Small understandable files.
No premature framework inside the project.
Database-backed data.
Strong validation at mutation points.
Reusable UI only where reuse is real.
```

For this project, good code should be understandable by reading:

```text
The docs
The Prisma schema
The relevant server action
The relevant form component
The relevant list/detail page
```

A developer should not need to chase a chain of generic abstractions to understand why stock changed.

---

## 17. Final Non-Negotiable Rule

When choosing between:

```text
A clever architecture
vs
A clear working workflow
```

choose:

```text
A clear working workflow.
```

The demo must reliably show:

```text
Ball masuk
→ Sortir 0
→ Sortir 1
→ Stocklist
→ Transfer Gudang
→ Barang Keluar
→ Riwayat yang dapat ditelusuri
```

Everything else is secondary.
