# Cloudflare Pages Deployment & Configuration Guide

This repository contains two Next.js applications deployed as Cloudflare Pages projects:
1. **Storefront (`apps/web`)** -> Deployed to project `bigbazarbariarhat`
2. **Admin Dashboard (`apps/admin`)** -> Deployed to project `bigbazar-admin`

Both apps are compiled for and run strictly on the **Cloudflare Pages Edge Runtime** via the `@cloudflare/next-on-pages` adapter.

---

## ⚠️ Important Production Requirements

### 1. Database Connection (Prisma Accelerate)
Because Cloudflare Pages Edge runtime does not support raw direct TCP connections (e.g. `mysql://` or `postgresql://`), you **must** use a connection pooling/caching proxy.
* In production, the `DATABASE_URL` environment variable **must** start with `prisma://` (Prisma Accelerate URL).
* Setting a raw MySQL string will cause all runtime database operations to fail.

### 2. Encryption for Secrets
Make sure to encrypt sensitive credentials (like `DATABASE_URL`, api secrets, and auth secrets) in the Cloudflare Dashboard rather than adding them as plaintext variables.

---

## Environment Variables Configuration

Configure the following variables in the Cloudflare Pages settings page under **Settings → Environment variables** for the **Production** environment of both apps.

### 🔐 Sensitive Variables (Configure as Encrypted)

| Name | Type | Description | Required in App |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Secret | Prisma Accelerate URL (`prisma://accelerate.prisma-data.net/...`) | Web & Admin |
| `NEXTAUTH_SECRET` | Secret | Random 32-character string used to sign NextAuth tokens | Web & Admin |
| `GOOGLE_CLIENT_ID` | Secret | Google OAuth client ID | Web |
| `GOOGLE_CLIENT_SECRET` | Secret | Google OAuth client secret | Web |
| `CLOUDINARY_API_KEY` | Secret | Cloudinary API Key for uploads | Admin |
| `CLOUDINARY_API_SECRET` | Secret | Cloudinary API Secret for signature generation | Admin |
| `RESEND_API_KEY` | Secret | Resend transactional email API Key | Web & Admin |

### 🌐 Public Variables (Configure as Plaintext)

| Name | Type | Description | Required in App |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Variable | Public URL of the app (e.g. `https://bigbazarbariarhat.pages.dev` or `https://bigbazar-admin.pages.dev`) | Web & Admin |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Variable | Cloudinary Cloud Name | Admin |
| `NEXT_PUBLIC_BKASH_NUMBER` | Variable | Bkash agent/personal number for checkout payments | Web |
| `NEXT_PUBLIC_NAGAD_NUMBER` | Variable | Nagad agent/personal number for checkout payments | Web |
| `NEXT_PUBLIC_COD_ENABLED` | Variable | Set to `true` or `false` to toggle Cash on Delivery | Web |

---

## Deployment Steps

To manually deploy from your local environment:

```bash
# 1. Install dependencies
npm install

# 2. Deploy Storefront (Web)
cd apps/web
npm run deploy

# 3. Deploy Admin Dashboard (Admin)
cd apps/admin
npm run deploy
```
