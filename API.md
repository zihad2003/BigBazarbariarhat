# 📡 API Documentation

> REST API reference for the Big Bazar Bariarhat e-commerce platform.

**Base URL:** `http://localhost:3000/api` (development)

All API routes are Next.js App Router route handlers located in `apps/web/src/app/api/`.

---

## 🔐 Authentication

Authentication is handled by **Clerk**. Protected routes require a valid session via the `Authorization` header (managed automatically by Clerk's middleware).

Public routes (products, search, categories) do not require authentication.

Admin routes require the user to have an admin role.

---

## 📦 Products

### `GET /api/products`
Fetch paginated product listing with optional filters.

**Query Parameters:**

| Parameter   | Type     | Default | Description                          |
|-------------|----------|---------|--------------------------------------|
| `page`      | number   | 1       | Page number                          |
| `limit`     | number   | 12      | Items per page (max 100)             |
| `q`         | string   | —       | Search query (name, description)     |
| `category`  | string   | —       | Filter by category slug              |
| `brand`     | string   | —       | Filter by brand slug                 |
| `minPrice`  | number   | —       | Minimum price filter                 |
| `maxPrice`  | number   | —       | Maximum price filter                 |
| `featured`  | boolean  | —       | Show only featured products          |
| `sort`      | string   | newest  | Sort: `price_asc`, `price_desc`, `newest`, `popular`, `name_asc` |

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "name": "Premium Polo Shirt",
            "slug": "premium-polo-shirt",
            "description": "...",
            "basePrice": 1299,
            "salePrice": 999,
            "stockQuantity": 50,
            "sku": "POL-001",
            "images": [{ "id": "...", "url": "...", "isPrimary": true }],
            "category": { "id": "...", "name": "Men", "slug": "men" },
            "brand": { "id": "...", "name": "Big Bazar Originals" },
            "isActive": true,
            "isFeatured": true,
            "createdAt": "2025-01-01T00:00:00Z",
            "updatedAt": "2025-01-01T00:00:00Z"
        }
    ],
    "count": 100,
    "pagination": {
        "page": 1,
        "totalPages": 9,
        "total": 100
    }
}
```

---

### `GET /api/products/[slug]`
Fetch a single product by its URL slug.

**Response:**
```json
{
    "success": true,
    "data": { /* Full product object with variants */ }
}
```

**Error (404):**
```json
{
    "success": false,
    "error": "Product not found"
}
```

---

## 🔍 Search

### `GET /api/search`
Full-text search across products and categories.

**Query Parameters:**

| Parameter | Type   | Description              |
|-----------|--------|--------------------------|
| `q`       | string | Search query (required)  |

**Response:**
```json
{
    "success": true,
    "products": [
        { "id": "...", "name": "...", "slug": "...", "base_price": 999, "sale_price": null }
    ],
    "categories": [
        { "id": "...", "name": "...", "slug": "..." }
    ]
}
```

---

## 🧾 Orders

### `GET /api/orders/[orderNumber]`
Fetch a specific order by its order number. **Requires authentication.**

**Response:**
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "orderNumber": "ORD-20250201-001",
        "status": "CONFIRMED",
        "paymentStatus": "PAID",
        "paymentMethod": "STRIPE",
        "subtotal": 2998,
        "shippingCost": 100,
        "taxAmount": 150,
        "totalAmount": 3248,
        "items": [
            {
                "id": "...",
                "productId": "...",
                "productName": "Premium Polo",
                "quantity": 2,
                "unitPrice": 1499,
                "totalPrice": 2998
            }
        ],
        "createdAt": "2025-02-01T00:00:00Z"
    }
}
```

---

## 👥 Customers (Admin)

### `GET /api/customers`
Fetch paginated customer listing. **Requires admin authentication.**

**Query Parameters:**

| Parameter | Type   | Default | Description              |
|-----------|--------|---------|--------------------------|
| `page`    | number | 1       | Page number              |
| `limit`   | number | 20      | Items per page           |
| `search`  | string | —       | Search by email or name  |

---

## 💳 Checkout

### `POST /api/checkout`
Create a Stripe checkout session. **Requires authentication.**

**Request Body:**
```json
{
    "items": [
        {
            "productId": "prod-1",
            "name": "Premium Polo",
            "price": 1299,
            "quantity": 2,
            "image": "https://..."
        }
    ]
}
```

**Response:**
```json
{
    "sessionId": "cs_live_...",
    "url": "https://checkout.stripe.com/c/pay/..."
}
```

---

## 🔔 Webhooks

### `POST /api/webhooks/stripe`
Receives Stripe webhook events for payment processing.

**Handled Events:**
- `checkout.session.completed` — Creates order in database.

**Headers Required:**
- `stripe-signature` — Stripe webhook signature for verification.

---

## ❌ Error Responses

All error responses follow this format:

```json
{
    "success": false,
    "error": "Human-readable error message"
}
```

**Common HTTP Status Codes:**

| Status | Meaning                     |
|--------|-----------------------------|
| 200    | Success                     |
| 400    | Bad request / validation    |
| 401    | Unauthorized (not logged in)|
| 403    | Forbidden (no permission)   |
| 404    | Resource not found          |
| 500    | Internal server error       |

---

## 🔄 Rate Limiting

API routes implement caching headers:
- **Products:** `s-maxage=60, stale-while-revalidate=300` (CDN caches for 60s)
- **Search:** `s-maxage=30, stale-while-revalidate=120`
- **Static assets:** `max-age=31536000, immutable`
