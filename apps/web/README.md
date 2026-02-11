# Big Bazar - Premium E-commerce Platform

A modern e-commerce platform built with Next.js, Supabase, Clerk, and Stripe.

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **3rd Party Integrations**: Composio
- **Mobile App**: Expo (React Native)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Clerk account
- Stripe account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd web
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Auth pages (sign-in, sign-up)
│   │   ├── (shop)/          # Shop pages
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API routes
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   └── shop/            # Shop-specific components
│   ├── lib/                 # Utility functions
│   │   ├── supabase.ts      # Supabase client
│   │   ├── stripe.ts        # Stripe utilities
│   │   └── utils.ts         # General utilities
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript types
│   └── styles/              # Global styles
├── public/                  # Static assets
└── package.json
```

## Features

- 🛒 Full e-commerce functionality
- 🔐 Secure authentication with Clerk
- 💳 Stripe payment integration
- 📊 Admin dashboard
- 📱 Mobile-responsive design
- 🎨 Premium minimalist UI

## License

MIT
