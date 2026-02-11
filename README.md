# Big Bazar - Premium E-commerce Platform

A modern, full-stack e-commerce platform for a multi-brand clothing retail shop built with Next.js 14+, TypeScript, and a modular Bento architecture.

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend (Web)** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **State Management** | Zustand, TanStack Query |
| **Form Validation** | React Hook Form, Zod |
| **Animation** | Framer Motion |
| **Authentication** | Clerk |
| **Database** | PostgreSQL (Prisma ORM) |
| **Payments** | Stripe, bKash, Nagad |
| **Mobile** | Expo (React Native) |

## 📁 Project Structure

```
BigBazarbariarhat/
├── apps/
│   ├── web/                    # Customer-facing Next.js app
│   │   ├── src/
│   │   │   ├── app/            # App Router pages
│   │   │   │   ├── (auth)/     # Auth pages (sign-in, sign-up)
│   │   │   │   ├── (shop)/     # Shop pages (home, products, cart)
│   │   │   │   ├── admin/      # Admin dashboard
│   │   │   │   └── api/        # API routes
│   │   │   ├── components/
│   │   │   │   ├── ui/         # shadcn/ui components
│   │   │   │   ├── layout/     # Header, Footer, etc.
│   │   │   │   ├── shop/       # Product cards, cart, etc.
│   │   │   │   └── features/   # Feature-specific components
│   │   │   ├── lib/
│   │   │   │   ├── stores/     # Zustand stores
│   │   │   │   ├── hooks/      # Custom hooks
│   │   │   │   └── utils/      # Utility functions
│   │   │   └── types/          # TypeScript types
│   │   └── supabase/           # Database schema
│   │
│   ├── admin/                  # Admin dashboard (separate app)
│   │
│   └── mobile/                 # Expo React Native app
│       ├── app/                # Expo Router
│       └── components/
│
├── packages/
│   ├── database/               # Prisma schema & client
│   │   └── prisma/
│   ├── types/                  # Shared TypeScript types
│   ├── validation/             # Zod schemas
│   └── config/                 # Shared configurations
│
├── services/
│   └── api/                    # Backend API services
│
└── infrastructure/
    └── docker/                 # Docker configurations
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Accounts: Supabase, Clerk, Stripe

### Installation

```bash
# Clone the repository
git clone https://github.com/zihad2003/BigBazarbariarhat.git
cd BigBazarbariarhat

# Install dependencies for the entire project
npm install

# Run the web application
npm run dev:web

# Run the admin dashboard
npm run dev:admin

# Run the mobile application
npm run dev:mobile

# Create environment files in respective app directories
# Edit .env.local with your API keys in apps/web and apps/admin
```

### Environment Variables

Create `.env.local` in `apps/web/`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

### Running the App

```bash
# Development (Web)
cd apps/web
npm run dev -- -p 3004

# Build for production
npm run build
npm start
```

Access the app at [http://localhost:3004](http://localhost:3004)

## 🎨 Features

### Customer Features
- ✅ Hero banner carousel with auto-rotation
- ✅ Featured categories with hover effects
- ✅ New arrivals & bestsellers sections
- ✅ Product cards with quick actions
- ✅ Mega menu navigation
- ✅ Search with suggestions
- ✅ Shopping cart drawer
- ✅ Wishlist functionality
- ✅ User authentication (Clerk)
- ✅ Responsive design

### Admin Features (In Progress)
- 📋 Dashboard with analytics
- 📋 Product management (CRUD)
- 📋 Order management
- 📋 Customer management
- 📋 Coupon & promotions
- 📋 Banner management
- 📋 Reports & analytics

### Payment Methods
- 💳 Credit/Debit Cards (Stripe)
- 📱 bKash
- 📱 Nagad
- 📱 Rocket
- 💵 Cash on Delivery

## 🗄️ Database Schema

The database uses Prisma ORM with PostgreSQL. Key models include:

- **User** - Customer accounts and profiles
- **Product** - Products with variants, images, attributes
- **Category** - Hierarchical product categories
- **Brand** - Product brands
- **Order** - Order management with items
- **Cart** - Shopping cart (user & guest)
- **Review** - Product reviews and ratings
- **Coupon** - Discount codes
- **Banner** - Promotional banners

Run database migrations:
```bash
cd packages/database
npx prisma generate
npx prisma db push
```

## 📱 Mobile App

The mobile app uses Expo with React Native:

```bash
cd apps/mobile
npm install
npx expo start
```

## 🔧 State Management

Using Zustand for lightweight, performant state:

- **Cart Store** - Cart items, add/remove/update
- **Wishlist Store** - Saved products
- **UI Store** - Modals, filters, view settings

## 🚀 Deployment

### Web (Vercel)
```bash
cd apps/web
vercel
```

### Database (Supabase)
- Create a Supabase project
- Run the Prisma migrations
- Update environment variables

## 📝 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List products with filters |
| `/api/products/[id]` | GET | Get product details |
| `/api/cart` | GET/POST | Cart operations |
| `/api/checkout` | POST | Create checkout session |
| `/api/orders` | GET/POST | Order management |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

Made with ❤️ for Big Bazar, Bariarhat