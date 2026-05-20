# Big Bazar Bariarhat

Full-stack e-commerce platform for a Bangladeshi retail store. Built as a Turborepo monorepo with a Next.js storefront, a standalone admin dashboard, and a React Native mobile app.

---

## Apps & Packages

```
BigBazarbariarhat/
├── apps/
│   ├── web/          # Customer storefront + REST API  (Next.js 16, port 3000)
│   ├── admin/        # Admin dashboard                 (Next.js 15, port 3005)
│   └── mobile/       # Mobile app                     (Expo / React Native)
├── packages/
│   ├── database/     # Prisma schema & client
│   ├── shared/       # Shared stores, hooks, constants
│   ├── types/        # Shared TypeScript types
│   ├── ui/           # Shared UI component library
│   ├── validation/   # Shared Zod schemas
│   └── config/       # Shared ESLint & TypeScript configs
├── .env.example      # Root environment variable template
├── turbo.json        # Turborepo pipeline config
└── package.json      # Workspace root
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Storefront | Next.js 16 (App Router, Turbopack) |
| Admin | Next.js 15 (App Router, Turbopack) |
| Mobile | Expo 51 / React Native 0.74 |
| Styling | Tailwind CSS v4 (web), Tailwind CSS v3 (admin) |
| Auth | NextAuth.js v5 (beta) |
| Database | MySQL via Prisma ORM |
| State | Zustand v5 (cart, wishlist, UI) |
| Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Images | Cloudinary / next-cloudinary |
| Email | Resend |
| Animations | Framer Motion |
| Charts | Recharts |
| Monorepo | Turborepo |
| Testing | Vitest + Testing Library |

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

Fill in the required values — at minimum:

```env
NEXTAUTH_SECRET=        # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=           # your cloud MySQL connection string
```

### 3. Generate the Prisma client

```bash
npx prisma generate --schema=packages/database/prisma/schema.prisma
```

### 4. Run the dev servers

```bash
# Storefront (http://localhost:3000)
npm run dev:web

# Admin dashboard (http://localhost:3005)
npm run dev:admin

# Mobile app
npm run dev:mobile
```

---

## Database

The project uses **MySQL** via Prisma. Point `DATABASE_URL` at any cloud MySQL provider (Aiven, PlanetScale, Railway, etc.).

```bash
# Push schema changes to the database
npx prisma db push --schema=packages/database/prisma/schema.prisma

# Open Prisma Studio
npx prisma studio --schema=packages/database/prisma/schema.prisma
```

---

## API Routes

All API routes live under `apps/web/src/app/api/`:

| Route | Methods | Auth |
|---|---|---|
| `/api/products` | GET, POST | POST: admin |
| `/api/products/[id]` | GET, PUT, DELETE | PUT/DELETE: admin |
| `/api/products/featured` | GET | public |
| `/api/products/search` | GET | public |
| `/api/products/[id]/reviews` | GET, POST | POST: logged in |
| `/api/categories` | GET, POST | POST: admin |
| `/api/categories/[slug]` | GET | public |
| `/api/orders` | GET, POST | logged in |
| `/api/orders/[orderId]` | GET, PUT | owner / admin |
| `/api/orders/[orderId]/cancel` | POST | owner |
| `/api/orders/[orderId]/status` | PUT | admin |
| `/api/coupons/validate` | POST | public |
| `/api/banners` | GET, POST | POST: admin |
| `/api/settings` | GET, PUT | admin |
| `/api/admin/orders` | GET | admin |
| `/api/admin/coupons` | GET, POST | admin |

---

## Available Scripts

Run from the monorepo root:

| Command | Description |
|---|---|
| `npm run dev:web` | Start storefront dev server |
| `npm run dev:admin` | Start admin dev server |
| `npm run dev:mobile` | Start Expo mobile dev server |
| `npm run build:web` | Build storefront |
| `npm run build:all` | Build all apps via Turborepo |
| `npm run lint` | Lint storefront |
| `npm run lint:fix` | Lint + auto-fix storefront |
| `npm run format` | Format all files with Prettier |
| `npm run test` | Run storefront tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run type-check` | TypeScript type check (storefront) |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_SECRET` | ✅ | Random secret for NextAuth session encryption |
| `NEXTAUTH_URL` | ✅ | Base URL of the app |
| `DATABASE_URL` | ✅ | MySQL connection string |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name for image uploads |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `RESEND_API_KEY` | ✅ | Resend API key for transactional email |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public base URL |
| `BKASH_USERNAME` | optional | bKash merchant credentials |
| `BKASH_PASSWORD` | optional | bKash merchant credentials |
| `BKASH_API_KEY` | optional | bKash app key |
| `BKASH_SECRET_KEY` | optional | bKash app secret |
| `NAGAD_MERCHANT_NUMBER` | optional | Nagad merchant number |

See `.env.example` and `apps/web/.env.example` for the full list.
