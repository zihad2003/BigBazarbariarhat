# 🏬 Big Bazar Bariarhat — E-Commerce Platform

> Premium e-commerce platform built with Next.js, Supabase, Clerk, and Stripe.

---

## 🚀 Quick Start

### Prerequisites

| Tool      | Version  | Purpose              |
|-----------|----------|----------------------|
| Node.js   | ≥ 18.x   | Runtime              |
| npm       | ≥ 9.x    | Package manager      |
| Git       | Latest   | Version control      |

### Environment Variables

Create `.env.local` in `apps/web/`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe Payments
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
# Clone the repository
git clone https://github.com/zihad2003/BigBazarbariarhat.git
cd BigBazarbariarhat

# Install dependencies
npm install

# Start the development server
npm run dev:web
```

The app will be running at **http://localhost:3000**.

---

## 📁 Project Structure

```
BigBazarbariarhat/
├── apps/
│   └── web/                    # Next.js 16 web application
│       ├── src/
│       │   ├── app/            # App Router pages & layouts
│       │   │   ├── (shop)/     # Public shop routes
│       │   │   ├── admin/      # Admin dashboard
│       │   │   ├── api/        # API routes
│       │   │   ├── error.tsx   # Global error page
│       │   │   ├── loading.tsx # Global loading state
│       │   │   └── not-found.tsx
│       │   ├── components/     # React components
│       │   │   ├── ui/         # Shadcn/ui primitives
│       │   │   ├── shop/       # Shop components
│       │   │   ├── admin/      # Admin components
│       │   │   ├── error-boundary.tsx
│       │   │   └── toast-container.tsx
│       │   ├── lib/            # Utilities & services
│       │   │   ├── api-client.ts   # API client with retry
│       │   │   ├── logger.ts       # Structured logging
│       │   │   ├── supabase.ts     # Supabase client
│       │   │   ├── stores/         # Zustand state stores
│       │   │   └── utils.ts
│       │   ├── types/          # Local TypeScript types
│       │   └── __tests__/      # Test files
│       ├── vitest.config.ts    # Test configuration
│       ├── next.config.ts      # Next.js configuration
│       └── eslint.config.mjs   # ESLint rules
├── packages/
│   ├── shared/                 # Shared types, services, hooks
│   │   └── src/
│   │       ├── types/          # Canonical type definitions
│   │       ├── api/            # Service classes
│   │       ├── hooks/          # Shared React hooks
│   │       └── store/          # Shared Zustand stores
│   ├── database/               # Database layer (Prisma legacy)
│   └── ui/                     # Shared UI components
├── supabase/                   # Supabase migrations
├── turbo.json                  # Turborepo configuration
├── .prettierrc                 # Code formatting rules
├── .lintstagedrc.json          # Pre-commit lint config
└── .husky/                     # Git hooks
```

---

## 🛠️ Available Scripts

### Root Level (Monorepo)

| Command               | Description                           |
|------------------------|---------------------------------------|
| `npm run dev:web`      | Start web app in development mode     |
| `npm run build:web`    | Build web app for production          |
| `npm run build:all`    | Build all packages with Turborepo     |
| `npm run lint`         | Run ESLint on web app                 |
| `npm run format`       | Format all files with Prettier        |
| `npm run format:check` | Check formatting without changes      |
| `npm run test`         | Run tests                             |
| `npm run test:watch`   | Run tests in watch mode               |
| `npm run test:coverage`| Run tests with coverage report        |
| `npm run type-check`   | TypeScript type checking              |

### Web App (`apps/web`)

| Command              | Description                            |
|----------------------|----------------------------------------|
| `npm run dev`        | Start dev server (port 3000)           |
| `npm run build`      | Production build                       |
| `npm run lint:fix`   | Auto-fix lint errors                   |
| `npm run analyze`    | Build with bundle analyzer             |

---

## 🏗️ Tech Stack

| Layer           | Technology                                      |
|-----------------|--------------------------------------------------|
| **Framework**   | Next.js 16 (App Router)                          |
| **Language**    | TypeScript 5 (strict mode)                       |
| **Styling**     | Tailwind CSS 4 + Shadcn/ui                       |
| **Database**    | Supabase (PostgreSQL)                            |
| **Auth**        | Clerk                                            |
| **Payments**    | Stripe                                           |
| **State**       | Zustand (cart, UI, wishlist)                      |
| **Data Fetch**  | TanStack React Query                             |
| **Animations**  | Framer Motion                                    |
| **Testing**     | Vitest + Testing Library                         |
| **Linting**     | ESLint 9 + Prettier                              |
| **Git Hooks**   | Husky + lint-staged                              |
| **Build**       | Turborepo (monorepo orchestration)               |
| **Icons**       | Lucide React                                     |

---

## 📦 Key Features

### Customer-Facing
- 🛍️ Product catalog with filters, search, and sorting
- 🛒 Shopping cart with persistent state
- ❤️ Wishlist management
- 💳 Checkout with Stripe / SSLCommerz / bKash / Nagad
- 👤 User authentication (Clerk)
- 📱 Fully responsive design

### Admin Dashboard
- 📊 Analytics dashboard with KPIs
- 📦 Product & inventory management
- 🧾 Order management with status tracking
- 👥 Customer management
- 🏷️ Coupon & marketing tools
- 📂 Category & brand management
- 🖼️ Banner management

### Developer Experience
- 🔍 TypeScript strict mode
- 🧪 Vitest test suite with coverage
- 🎨 Prettier auto-formatting
- 🪝 Pre-commit hooks (Husky + lint-staged)
- 📦 Bundle analysis
- 🔒 Security headers
- 📝 Structured logging
- 🔄 API client with retry logic

---

## 📄 License

MIT © Big Bazar Bariarhat