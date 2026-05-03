/**
 * Database repository interfaces.
 * Implement these interfaces in any adapter (MySQL, PostgreSQL, Supabase, etc.)
 * and swap the adapter in src/lib/db/index.ts — no route files need to change.
 */

// ── Shared primitives ───────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ── Product ─────────────────────────────────────────────────────────────────

export interface ProductFilters extends PaginationParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'newest' | 'price-low' | 'price-high' | 'rating';
}

export interface ProductCreateInput {
  name: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  images?: string[];
  sku?: string;
}

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  basePrice: number;
  salePrice?: number;
  category: string;
  categoryId?: string;
  brand?: { name: string };
  stock: number;
  stockQuantity: number;
  status: string;
  images: { url: string; alt?: string }[];
  variants?: { id: string; name: string; priceAdjustment: number }[];
  attributes?: { key: string; value: string }[];
  averageRating: number;
  reviewCount: number;
  rating: number;
  isFeatured: boolean;
  isNew: boolean;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProductRepository {
  findMany(filters: ProductFilters): Promise<PaginatedResult<ProductRecord>>;
  findById(id: string): Promise<ProductRecord | null>;
  findBySlug(slug: string): Promise<ProductRecord | null>;
  findFeatured(limit?: number): Promise<ProductRecord[]>;
  search(query: string, limit?: number): Promise<ProductRecord[]>;
  create(input: ProductCreateInput): Promise<ProductRecord>;
  update(id: string, input: Partial<ProductCreateInput>): Promise<ProductRecord | null>;
  delete(id: string): Promise<boolean>;
}

// ── Order ───────────────────────────────────────────────────────────────────

export interface OrderCreateInput {
  userId: string;
  items: { productId: string; quantity: number; variantId?: string }[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    division: string;
    district: string;
    upazila: string;
    address: string;
  };
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  couponCode?: string;
}

export interface OrderRecord {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryAddress: Record<string, string>;
  timeline: { status: string; date: string; time: string; completed: boolean; note?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters extends PaginationParams {
  status?: string;
  userId?: string;
}

export interface IOrderRepository {
  findById(id: string): Promise<OrderRecord | null>;
  findByUserId(userId: string, filters?: OrderFilters): Promise<PaginatedResult<OrderRecord>>;
  findAll(filters?: OrderFilters): Promise<PaginatedResult<OrderRecord>>;
  create(input: OrderCreateInput, pricing: { subtotal: number; shippingCost: number; discount: number; total: number }): Promise<OrderRecord>;
  updateStatus(id: string, status: OrderRecord['status']): Promise<OrderRecord | null>;
  cancel(id: string): Promise<OrderRecord | null>;
}

// ── Category ────────────────────────────────────────────────────────────────

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  productCount?: number;
}

export interface ICategoryRepository {
  findAll(): Promise<CategoryRecord[]>;
  findBySlug(slug: string): Promise<CategoryRecord | null>;
  create(input: { name: string; description?: string; image?: string }): Promise<CategoryRecord>;
}

// ── Coupon ──────────────────────────────────────────────────────────────────

export interface CouponRecord {
  code: string;
  type: 'percent' | 'flat' | 'free_shipping';
  value: number;
  minOrder: number;
  expiresAt?: string;
  usageLimit?: number;
  usageCount?: number;
}

export interface ICouponRepository {
  findByCode(code: string): Promise<CouponRecord | null>;
  findAll(): Promise<CouponRecord[]>;
  create(input: Omit<CouponRecord, 'usageCount'>): Promise<CouponRecord>;
}

// ── Review ──────────────────────────────────────────────────────────────────

export interface ReviewRecord {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IReviewRepository {
  findByProductId(productId: string): Promise<ReviewRecord[]>;
  create(input: Omit<ReviewRecord, 'id' | 'createdAt'>): Promise<ReviewRecord>;
}

// ── Root adapter interface ───────────────────────────────────────────────────

export interface IDatabaseAdapter {
  products: IProductRepository;
  orders: IOrderRepository;
  categories: ICategoryRepository;
  coupons: ICouponRepository;
  reviews: IReviewRepository;
}
