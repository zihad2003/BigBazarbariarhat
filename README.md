# Big Bazar Bariarhat — E-Commerce Platform

Full-stack e-commerce platform built with Next.js 14 App Router (Turborepo monorepo).

---

## Project Structure

```
BigBazarbariarhat/
├── apps/
│   ├── web/                  # Frontend + API (Next.js 14)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (shop)/   # Customer-facing pages
│   │   │   │   ├── admin/    # Admin dashboard pages
│   │   │   │   └── api/      # REST API routes (backend)
│   │   │   ├── components/   # UI components
│   │   │   ├── lib/
│   │   │   │   └── db/       # Database adapter layer
│   │   │   │       ├── index.ts          # Swap adapter here
│   │   │   │       ├── types.ts          # Repository interfaces
│   │   │   │       └── adapters/
│   │   │   │           └── mock.ts       # In-memory adapter (default)
│   │   │   ├── stores/       # Zustand client state (cart, wishlist)
│   │   │   └── auth.ts       # NextAuth.js config
│   │   └── .env.example
│   ├── admin/                # Standalone admin app (optional)
│   └── mobile/               # Mobile app (optional)
├── packages/
│   └── shared/               # Shared types and hooks
├── docker-compose.yml        # MySQL dev database
├── .env.example              # Root env template
└── package.json              # Turborepo workspace root
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
```

Edit `.env` and `apps/web/.env.local` and fill in your values. At minimum you need:

```env
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

### 3. Start the dev server

```bash
npm run dev --filter=web
# or from the web app directory:
cd apps/web && npm run dev
```

Visit `http://localhost:3000`.

---

## Database

The app ships with an **in-memory mock adapter** so it runs out of the box with no database required.

To connect a real database:

1. Write (or install) an adapter that implements `IDatabaseAdapter` from `apps/web/src/lib/db/types.ts`.
2. Open `apps/web/src/lib/db/index.ts` and swap the import:

```ts
// MySQL / Prisma example
import { prismaAdapter } from './adapters/prisma';
export const db: IDatabaseAdapter = prismaAdapter;
```

3. Set `DATABASE_URL` in your `.env`.

A MySQL container for local development is included:

```bash
docker compose up -d
```

---

## API Routes

All routes live under `apps/web/src/app/api/`:

| Route | Methods | Auth |
|---|---|---|
| `/api/products` | GET, POST | POST: admin |
| `/api/products/[id]` | GET, PUT, DELETE | PUT/DELETE: admin |
| `/api/products/featured` | GET | public |
| `/api/products/search` | GET | public |
| `/api/products/[id]/reviews` | GET, POST | POST: logged in |
| `/api/orders` | GET, POST | logged in |
| `/api/orders/[orderId]` | GET, PUT | GET: owner/admin |
| `/api/orders/[orderId]/cancel` | POST | owner |
| `/api/orders/[orderId]/status` | PUT | admin |
| `/api/categories` | GET, POST | POST: admin |
| `/api/categories/[slug]` | GET | public |
| `/api/coupons/validate` | POST | public |
| `/api/admin/orders` | GET | admin |
| `/api/admin/coupons` | GET, POST | admin |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth.js v5 |
| State | Zustand (cart, wishlist) |
| Validation | Zod |
| Monorepo | Turborepo |
| Database | Adapter pattern (mock by default) |
