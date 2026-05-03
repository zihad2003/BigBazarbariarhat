/**
 * Mock database adapter — uses in-memory fixture data.
 * Replace this file (or swap the export in src/lib/db/index.ts)
 * with a real adapter (Prisma, Drizzle, Supabase, etc.) when ready.
 */

import { MOCK_PRODUCTS } from '@/lib/mock-data/products';
import { MOCK_ORDERS } from '@/lib/mock-data/orders';
import type {
  IDatabaseAdapter,
  IProductRepository,
  IOrderRepository,
  ICategoryRepository,
  ICouponRepository,
  IReviewRepository,
  ProductFilters,
  ProductCreateInput,
  ProductRecord,
  OrderCreateInput,
  OrderRecord,
  OrderFilters,
  CategoryRecord,
  CouponRecord,
  ReviewRecord,
  PaginatedResult,
} from '../types';

// ── Helpers ─────────────────────────────────────────────────────────────────

function paginate<T>(items: T[], page = 1, limit = 12): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const data = items.slice((page - 1) * limit, page * limit);
  return { data, total, page, totalPages };
}

function toProductRecord(p: (typeof MOCK_PRODUCTS)[0]): ProductRecord {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    shortDescription: (p as any).shortDescription,
    basePrice: p.basePrice,
    salePrice: p.salePrice,
    category: (p as any).category?.name ?? (p as any).category ?? '',
    categoryId: (p as any).categoryId,
    brand: p.brand ? { name: typeof p.brand === 'string' ? p.brand : (p.brand as any).name } : undefined,
    stock: (p as any).stock ?? (p as any).stockQuantity ?? 0,
    stockQuantity: (p as any).stockQuantity ?? (p as any).stock ?? 0,
    status: p.status,
    images: (p.images ?? []).map((img: any) => ({ url: img.url, alt: img.alt })),
    variants: (p as any).variants ?? [],
    attributes: (p as any).attributes ?? [],
    averageRating: (p as any).averageRating ?? (p as any).rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    rating: (p as any).rating ?? 0,
    isFeatured: p.isFeatured ?? false,
    isNew: p.isNew ?? false,
    sku: p.sku,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// ── Product repository ───────────────────────────────────────────────────────

const productRepo: IProductRepository = {
  async findMany(filters: ProductFilters) {
    const { category, minPrice = 0, maxPrice = Infinity, search, sort = 'newest', page = 1, limit = 12 } = filters;
    let results = MOCK_PRODUCTS.map(toProductRecord);

    if (category && category !== 'all') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    results = results.filter(p => {
      const price = p.salePrice ?? p.basePrice;
      return price >= minPrice && price <= maxPrice;
    });
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    switch (sort) {
      case 'price-low': results.sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice)); break;
      case 'price-high': results.sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice)); break;
      case 'rating': results.sort((a, b) => b.averageRating - a.averageRating); break;
      default: results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return paginate(results, page, limit);
  },

  async findById(id) {
    const p = MOCK_PRODUCTS.find(p => p.id === id);
    return p ? toProductRecord(p) : null;
  },

  async findBySlug(slug) {
    const p = MOCK_PRODUCTS.find(p => p.slug === slug);
    return p ? toProductRecord(p) : null;
  },

  async findFeatured(limit = 8) {
    return MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, limit).map(toProductRecord);
  },

  async search(query, limit = 5) {
    const q = query.toLowerCase();
    return MOCK_PRODUCTS
      .filter(p => p.name.toLowerCase().includes(q) || (p as any).category?.toLowerCase?.().includes(q))
      .slice(0, limit)
      .map(toProductRecord);
  },

  async create(input: ProductCreateInput) {
    const id = `p${MOCK_PRODUCTS.length + 1}`;
    const record: ProductRecord = {
      id,
      slug: input.name.toLowerCase().replace(/\s+/g, '-'),
      name: input.name,
      description: input.description,
      basePrice: input.basePrice,
      salePrice: input.salePrice,
      category: input.category,
      stock: input.stock,
      stockQuantity: input.stock,
      status: input.status,
      images: (input.images ?? []).map(url => ({ url })),
      variants: [],
      attributes: [],
      averageRating: 0,
      reviewCount: 0,
      rating: 0,
      isFeatured: false,
      isNew: true,
      sku: input.sku ?? `SKU-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // TODO: persist to DB
    return record;
  },

  async update(id, input) {
    const existing = await productRepo.findById(id);
    if (!existing) return null;
    const images = input.images
      ? input.images.map((url: string) => ({ url }))
      : existing.images;
    // TODO: persist update to DB
    return { ...existing, ...input, images, updatedAt: new Date().toISOString() };
  },

  async delete(_id) {
    // TODO: delete from DB
    return true;
  },
};

// ── Order repository ─────────────────────────────────────────────────────────

const orderRepo: IOrderRepository = {
  async findById(id) {
    return (MOCK_ORDERS as unknown as OrderRecord[]).find(o => o.id === id) ?? null;
  },

  async findByUserId(userId, filters = {}) {
    const { status, page = 1, limit = 10 } = filters;
    let results = (MOCK_ORDERS as unknown as OrderRecord[]).filter(o => o.userId === userId);
    if (status && status !== 'all') results = results.filter(o => o.status === status);
    return paginate(results, page, limit);
  },

  async findAll(filters = {}) {
    const { status, page = 1, limit = 20 } = filters;
    let results = MOCK_ORDERS as unknown as OrderRecord[];
    if (status && status !== 'all') results = results.filter(o => o.status === status);
    return paginate(results, page, limit);
  },

  async create(input, pricing) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    const id = `BBB-${date}-${random}`;
    const order: OrderRecord = {
      id,
      userId: input.userId,
      items: input.items.map(i => ({ productId: i.productId, quantity: i.quantity, price: 0 })),
      subtotal: pricing.subtotal,
      shippingCost: pricing.shippingCost,
      discount: pricing.discount,
      total: pricing.total,
      couponCode: input.couponCode,
      status: 'pending',
      paymentMethod: input.paymentMethod,
      paymentStatus: 'pending',
      deliveryAddress: input.deliveryAddress as Record<string, string>,
      timeline: [{ status: 'pending', date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), completed: true, note: 'Order placed.' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // TODO: persist to DB
    return order;
  },

  async updateStatus(id, status) {
    const order = await orderRepo.findById(id);
    if (!order) return null;
    // TODO: persist to DB
    return { ...order, status, updatedAt: new Date().toISOString() };
  },

  async cancel(id) {
    return orderRepo.updateStatus(id, 'cancelled');
  },
};

// ── Category repository ──────────────────────────────────────────────────────

const MOCK_CATEGORIES: CategoryRecord[] = [
  { id: 'cat-1', name: 'Men', slug: 'men', description: "Men's clothing and accessories" },
  { id: 'cat-2', name: 'Women', slug: 'women', description: "Women's clothing and accessories" },
  { id: 'cat-3', name: 'Kids', slug: 'kids', description: "Children's clothing" },
  { id: 'cat-4', name: 'Accessories', slug: 'accessories', description: 'Bags, belts, jewelry and more' },
  { id: 'cat-5', name: 'Shoes', slug: 'shoes', description: 'Footwear for all' },
];

const categoryRepo: ICategoryRepository = {
  async findAll() { return MOCK_CATEGORIES; },
  async findBySlug(slug) { return MOCK_CATEGORIES.find(c => c.slug === slug) ?? null; },
  async create(input) {
    const record: CategoryRecord = { id: `cat-${Date.now()}`, slug: input.name.toLowerCase().replace(/\s+/g, '-'), ...input };
    // TODO: persist to DB
    return record;
  },
};

// ── Coupon repository ────────────────────────────────────────────────────────

const MOCK_COUPONS: CouponRecord[] = [
  { code: 'BIGBAZAR10', type: 'percent', value: 10, minOrder: 500 },
  { code: 'SAVE50',     type: 'flat',    value: 50, minOrder: 300 },
  { code: 'NEWUSER',    type: 'percent', value: 15, minOrder: 0   },
  { code: 'FREESHIP',   type: 'free_shipping', value: 0, minOrder: 0 },
];

const couponRepo: ICouponRepository = {
  async findByCode(code) {
    return MOCK_COUPONS.find(c => c.code === code.toUpperCase()) ?? null;
  },
  async findAll() { return MOCK_COUPONS; },
  async create(input) {
    // TODO: persist to DB
    return { ...input, usageCount: 0 };
  },
};

// ── Review repository ────────────────────────────────────────────────────────

const MOCK_REVIEWS: ReviewRecord[] = [];

const reviewRepo: IReviewRepository = {
  async findByProductId(productId) {
    return MOCK_REVIEWS.filter(r => r.productId === productId);
  },
  async create(input) {
    const record: ReviewRecord = { id: `rev-${Date.now()}`, ...input, createdAt: new Date().toISOString() };
    // TODO: persist to DB
    return record;
  },
};

// ── Assembled adapter ────────────────────────────────────────────────────────

export const mockAdapter: IDatabaseAdapter = {
  products: productRepo,
  orders: orderRepo,
  categories: categoryRepo,
  coupons: couponRepo,
  reviews: reviewRepo,
};
