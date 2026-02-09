# Big Bazar - Premium E-commerce Platform

A modern, full-stack e-commerce platform with web and mobile applications.

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend (Web)** | Next.js 14, React, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Authentication** | Clerk |
| **Database** | Supabase (PostgreSQL) |
| **Payments** | Stripe |
| **3rd Party** | Composio |
| **Mobile** | Expo (React Native) |

## 📁 Project Structure

```
BigBazarbariarhat/
├── web/                    # Next.js Web Application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   │   ├── (auth)/     # Authentication pages
│   │   │   ├── (shop)/     # Shop pages
│   │   │   ├── admin/      # Admin dashboard
│   │   │   └── api/        # API routes
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── layout/     # Layout components
│   │   │   └── shop/       # Shop components
│   │   ├── lib/            # Utilities
│   │   ├── hooks/          # Custom hooks
│   │   └── types/          # TypeScript types
│   └── supabase/           # Database schema
│
├── mobile/                 # Expo Mobile App
│   ├── app/                # Expo Router pages
│   │   ├── (tabs)/         # Tab navigation
│   │   └── (auth)/         # Auth screens
│   └── components/         # Mobile components
│
└── assets/                 # Shared assets (images)
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Accounts: Supabase, Clerk, Stripe

### 1. Clone & Install

```bash
# Install web dependencies
cd web
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

### 2. Environment Variables

Create `.env.local` in the `web` directory:

```env
# Clerk
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
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

1. Go to your Supabase dashboard
2. Open the SQL Editor
3. Run the schema from `web/supabase/schema.sql`

### 4. Run the Applications

```bash
# Web (Next.js)
cd web
npm run dev

# Mobile (Expo)
cd mobile
npx expo start
```

## 🔐 Authentication (Clerk)

- Sign up at [clerk.com](https://clerk.com)
- Create a new application
- Copy your API keys to `.env.local`
- Configure OAuth providers (Google, Facebook, etc.)

## 💳 Payments (Stripe)

- Sign up at [stripe.com](https://stripe.com)
- Get your API keys from the Dashboard
- Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Listen for events: `checkout.session.completed`, `payment_intent.succeeded`

## 📱 Mobile App (Expo)

The mobile app uses Expo Router for navigation and shares:
- Authentication (Clerk)
- Database (Supabase)
- Payments (Stripe React Native)

To build for production:
```bash
npx eas build --platform all
```

## 🎨 UI Components (shadcn/ui)

Add more components:
```bash
npx shadcn@latest add button card input dialog sheet table
```

## 📊 Admin Dashboard

Access at `/admin`:
- Dashboard overview
- Products management
- Orders management
- Customers list
- Analytics
- Settings

## 🚀 Deployment

### Web (Vercel)
```bash
cd web
vercel
```

### Mobile (EAS)
```bash
cd mobile
npx eas build --platform all
npx eas submit
```

## 📝 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List products |
| `/api/products` | POST | Create product |
| `/api/checkout` | POST | Create checkout session |
| `/api/webhooks/stripe` | POST | Stripe webhook |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for personal or commercial projects.