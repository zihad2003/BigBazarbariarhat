# 🚀 Deployment Guide

> Step-by-step guide to deploy Big Bazar Bariarhat to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] All tests passing (`npm run test`)
- [ ] Code formatted (`npm run format:check`)
- [ ] ESLint clean (`npm run lint`)
- [ ] Environment variables configured
- [ ] Supabase database schema up to date
- [ ] Stripe webhooks configured
- [ ] Clerk application configured

---

## 🌐 Option 1: Vercel (Recommended)

Vercel is the recommended deployment platform for Next.js applications.

### Steps

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `apps/web` directory as the root directory

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Set Environment Variables**
   Add all variables from `.env.local` to the Vercel dashboard:
   
   | Variable | Description |
   |----------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
   | `CLERK_SECRET_KEY` | Clerk secret key |
   | `STRIPE_SECRET_KEY` | Stripe secret key |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
   | `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
   | `NEXT_PUBLIC_APP_URL` | Your production domain |

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

5. **Configure Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

### Post-Deployment

1. **Update Stripe Webhook URL:**
   ```
   https://your-domain.com/api/webhooks/stripe
   ```

2. **Update Clerk Redirect URLs:**
   - Add production domain to Clerk's allowed redirect URLs

3. **Verify Supabase RLS Policies:**
   - Ensure Row Level Security is properly configured

---

## 🐳 Option 2: Docker

### Dockerfile

Create `apps/web/Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/ ./packages/
RUN npm ci --legacy-peer-deps

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:web

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "apps/web/server.js"]
```

### Build & Run

```bash
docker build -t bigbazar-web -f apps/web/Dockerfile .
docker run -p 3000:3000 --env-file apps/web/.env.local bigbazar-web
```

---

## ☁️ Option 3: Self-Hosted (VPS)

### Prerequisites
- Ubuntu 22.04+ or similar
- Node.js 18+
- PM2 process manager
- Nginx reverse proxy

### Steps

1. **Clone and build:**
   ```bash
   git clone https://github.com/zihad2003/BigBazarbariarhat.git
   cd BigBazarbariarhat
   npm install
   npm run build:web
   ```

2. **Start with PM2:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "bigbazar-web" -- run start -w apps/web
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL with Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🛡️ Security Checklist

- [ ] **HTTPS** enabled on all routes
- [ ] **Environment variables** stored securely (never committed to Git)
- [ ] **Supabase RLS** policies configured for all tables
- [ ] **Stripe webhooks** verified with signing secret
- [ ] **CORS** headers configured if needed
- [ ] **Rate limiting** implemented on sensitive endpoints
- [ ] **Content Security Policy** headers set
- [ ] **X-Frame-Options** set to DENY (configured in `next.config.ts`)
- [ ] **X-Content-Type-Options**: nosniff (configured in `next.config.ts`)

---

## 📊 Monitoring

### Recommended Services

| Service    | Purpose             | Free Tier  |
|------------|---------------------|------------|
| Sentry     | Error tracking      | 5K events  |
| Vercel     | Deployment logs     | Built-in   |
| Supabase   | Database monitoring | Built-in   |
| LogRocket  | Session replay      | 1K sessions|

### Setting Up Sentry

1. Install: `npm install @sentry/nextjs`
2. Run setup: `npx @sentry/wizard@latest -i nextjs`
3. Add DSN to environment variables
4. The `logger.ts` service can be extended with a Sentry transport:

```typescript
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/logger';

logger.addTransport((entry) => {
    if (entry.level === 'error' || entry.level === 'fatal') {
        Sentry.captureException(entry.error || new Error(entry.message), {
            extra: entry.context,
        });
    }
});
```

---

## 🔄 CI/CD

### GitHub Actions (Recommended)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci --legacy-peer-deps
      - run: npm run type-check
      - run: npm run lint
      - run: npm run format:check
      - run: npm run test
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails with type errors | Run `npm run type-check` locally and fix errors |
| Images not loading | Verify `images.remotePatterns` in `next.config.ts` |
| Auth not working | Check Clerk environment variables and redirect URLs |
| Payments failing | Verify Stripe keys and webhook secret |
| Database errors | Check Supabase connection and RLS policies |
