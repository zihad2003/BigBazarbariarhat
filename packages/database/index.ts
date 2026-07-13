import { connect } from '@tidbcloud/serverless';

// ── Mock Decimal Class (Prisma Compatible) ───────────────────────────
export class Decimal {
  private value: number;
  constructor(val: any) {
    this.value = Number(val);
  }
  toNumber() {
    return this.value;
  }
  toString() {
    return String(this.value);
  }
  toJSON() {
    return this.value;
  }
  valueOf() {
    return this.value;
  }
}

// Helper to generate custom cuid values for IDs
function cuid(): string {
  return 'c' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

// ── Model Interfaces ─────────────────────────────────────────────────
export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';

export interface User {
  id: string;
  name: string | null;
  email: string;
  password?: string | null;
  role: Role;
  phone: string | null;
  image: string | null;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  orders: Order[];
  reviews: Review[];
  _count?: { orders?: number; reviews?: number };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  displayOrder: number;
  isHidden: boolean;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  parent: Category | null;
  children: Category[];
  products: Product[];
  _count?: { products?: number; children?: number };
}

export interface Product {
  id: string;
  originalId: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: Decimal;
  salePrice: Decimal | null;
  sku: string;
  stock: number;
  images: any; // JSON
  instagramReelUrl: string | null;
  categoryId: string;
  isActive: boolean;
  featured: boolean;
  isSale: boolean;
  isHot: boolean;
  isNew: boolean;
  variants: any; // JSON
  createdAt: Date;
  updatedAt: Date;
  category: Category | null;
  reviews: Review[];
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: OrderStatus;
  totalAmount: Decimal;
  shippingAddress: any; // JSON
  customerPhone: string;
  adminNote: string | null;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  paymentTransactionId: string | null;
  paymentScreenshot: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  user: User | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: Decimal;
  order: Order;
  product: Product;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  user: any; // User or subset select
  product: Product;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: Decimal;
  minOrderAmount: Decimal;
  usageLimit: number | null;
  currentUsage: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageDesktop: string;
  imageMobile: string | null;
  videoUrl: string | null;
  linkUrl: string | null;
  linkText: string | null;
  position: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreSetting {
  id: string;
  storeName: string;
  storeDescription: string | null;
  supportEmail: string;
  currency: string;
  defaultLanguage: string;
  announcementText: string | null;
  showAnnouncement: boolean;
  enableSteadfastCheck: boolean;
  steadfastApiKey: string | null;
  steadfastSecretKey: string | null;
  updatedAt: Date;
}

export interface ShippingZone {
  id: string;
  name: string;
  cities: any; // JSON Array of strings
  rates: any; // JSON Array of rate objects
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  url: string;
  isFeatured?: boolean;
  displayOrder?: number;
}

export function parseProductImages(imagesJson: any): ProductImage[] {
  if (!imagesJson) return [];
  try {
    const parsed = typeof imagesJson === 'string' ? JSON.parse(imagesJson) : imagesJson;
    if (Array.isArray(parsed)) {
      const result: ProductImage[] = [];
      for (const img of parsed) {
        if (typeof img === 'string') {
          result.push({ url: img, isFeatured: false, displayOrder: 0 });
        } else if (img && typeof img === 'object' && typeof img.url === 'string') {
          result.push({
            url: img.url,
            isFeatured: !!img.isFeatured,
            displayOrder: typeof img.displayOrder === 'number' ? img.displayOrder : 0,
          });
        }
      }
      return result;
    }
  } catch (error) {
    console.error('Error parsing product images JSON:', error);
  }
  return [];
}

// ── Mock Prisma Namespace for compilation support ────────────────────
export namespace Prisma {
  export type ProductWhereInput = any;
  export type ProductOrderByWithRelationInput = any;
}

// ── Internal Helper: Clean Database Records ──────────────────────────
function cleanRecord(row: any, modelName: string): any {
  if (!row) return row;
  const cleaned = { ...row };

  const jsonFields: Record<string, string[]> = {
    Product: ['images', 'variants'],
    Order: ['shippingAddress'],
    ShippingZone: ['cities', 'rates']
  };
  const currentJsonFields = jsonFields[modelName] || [];
  for (const field of currentJsonFields) {
    if (cleaned[field] !== undefined && cleaned[field] !== null) {
      if (typeof cleaned[field] === 'string') {
        try {
          cleaned[field] = JSON.parse(cleaned[field]);
        } catch {
          cleaned[field] = null;
        }
      }
    }
  }

  const booleanFields: Record<string, string[]> = {
    Category: ['isHidden'],
    Product: ['isActive', 'featured', 'isSale', 'isHot', 'isNew'],
    Coupon: ['isActive'],
    Banner: ['isActive'],
    StoreSetting: ['showAnnouncement', 'enableSteadfastCheck'],
    ShippingZone: ['isActive']
  };
  const currentBoolFields = booleanFields[modelName] || [];
  for (const field of currentBoolFields) {
    if (cleaned[field] !== undefined && cleaned[field] !== null) {
      cleaned[field] = !!cleaned[field];
    }
  }

  const decimalFields: Record<string, string[]> = {
    Product: ['price', 'salePrice'],
    Order: ['totalAmount'],
    OrderItem: ['price'],
    Coupon: ['discountValue', 'minOrderAmount']
  };
  const currentDecimalFields = decimalFields[modelName] || [];
  for (const field of currentDecimalFields) {
    if (cleaned[field] !== undefined && cleaned[field] !== null) {
      cleaned[field] = new Decimal(cleaned[field]);
    }
  }

  const dateFields: Record<string, string[]> = {
    User: ['createdAt', 'updatedAt'],
    Category: ['createdAt', 'updatedAt'],
    Product: ['createdAt', 'updatedAt'],
    Order: ['createdAt', 'updatedAt'],
    Review: ['createdAt', 'updatedAt'],
    Coupon: ['startDate', 'endDate', 'createdAt', 'updatedAt'],
    Banner: ['createdAt', 'updatedAt'],
    StoreSetting: ['updatedAt'],
    ShippingZone: ['createdAt', 'updatedAt']
  };
  const currentDateFields = dateFields[modelName] || [];
  for (const field of currentDateFields) {
    if (cleaned[field] !== undefined && cleaned[field] !== null) {
      cleaned[field] = new Date(cleaned[field]);
    }
  }

  // Schema-aware fallback defaults to gracefully handle missing/mismatched database fields
  const defaultFieldsKey: Record<string, Record<string, any>> = {
    User: { id: '', name: null, email: '', password: null, role: 'USER', phone: null, image: null, provider: 'credentials', createdAt: new Date(), updatedAt: new Date(), orders: [], reviews: [] },
    Category: { id: '', name: '', slug: '', description: null, image: null, displayOrder: 0, isHidden: false, parentId: null, createdAt: new Date(), updatedAt: new Date(), parent: null, children: [], products: [] },
    Product: { id: '', originalId: null, name: '', slug: '', description: null, price: new Decimal(0), salePrice: null, sku: '', stock: 0, images: [], instagramReelUrl: null, categoryId: '', isActive: true, featured: false, isSale: false, isHot: false, isNew: false, variants: [], createdAt: new Date(), updatedAt: new Date(), category: null, reviews: [] },
    Order: { id: '', orderNumber: '', userId: null, status: 'PENDING', totalAmount: new Decimal(0), shippingAddress: {}, customerPhone: '', adminNote: null, paymentStatus: 'PENDING', paymentMethod: null, paymentTransactionId: null, paymentScreenshot: null, createdAt: new Date(), updatedAt: new Date(), items: [], user: null },
    OrderItem: { id: '', orderId: '', productId: '', quantity: 1, price: new Decimal(0) },
    Review: { id: '', rating: 5, comment: null, userId: '', productId: '', createdAt: new Date(), updatedAt: new Date() },
    Coupon: { id: '', code: '', description: null, discountType: 'PERCENTAGE', discountValue: new Decimal(0), minOrderAmount: new Decimal(0), usageLimit: null, currentUsage: 0, startDate: new Date(), endDate: new Date(), isActive: true, createdAt: new Date(), updatedAt: new Date() },
    Banner: { id: '', title: '', subtitle: null, imageDesktop: '', imageMobile: null, videoUrl: null, linkUrl: null, linkText: null, position: 'hero', displayOrder: 0, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    StoreSetting: { id: '1', storeName: 'BigBazar', storeDescription: null, supportEmail: '', currency: 'BDT', defaultLanguage: 'bn', announcementText: null, showAnnouncement: false, enableSteadfastCheck: false, steadfastApiKey: null, steadfastSecretKey: null, updatedAt: new Date() },
    ShippingZone: { id: '', name: '', cities: [], rates: [], isActive: true, createdAt: new Date(), updatedAt: new Date() }
  };

  const defaults = defaultFieldsKey[modelName];
  if (defaults) {
    for (const [dfKey, dfVal] of Object.entries(defaults)) {
      if (cleaned[dfKey] === undefined || cleaned[dfKey] === null) {
        cleaned[dfKey] = (dfVal instanceof Decimal)
          ? new Decimal(dfVal.toNumber())
          : (dfVal instanceof Date)
          ? new Date(dfVal.getTime())
          : Array.isArray(dfVal)
          ? [...dfVal]
          : (typeof dfVal === 'object' && dfVal !== null)
          ? { ...dfVal }
          : dfVal;
      }
    }
  }

  return cleaned;
}

// ── Internal Helper: SQL Condition Builders ──────────────────────────
function buildWhere(where: any): { sql: string; params: any[] } {
  if (!where || typeof where !== 'object' || Object.keys(where).length === 0) {
    return { sql: '', params: [] };
  }

  const clauses: string[] = [];
  const params: any[] = [];

  for (const [key, value] of Object.entries(where)) {
    if (!/^[a-zA-Z0-9_]+$/.test(key) && key !== 'AND' && key !== 'OR' && key !== 'NOT') {
      continue;
    }
    if (key === 'AND') {
      if (Array.isArray(value)) {
        const subSqls: string[] = [];
        for (const sub of value) {
          const res = buildWhere(sub);
          if (res.sql) {
            subSqls.push(`(${res.sql})`);
            params.push(...res.params);
          }
        }
        if (subSqls.length > 0) {
          clauses.push(subSqls.join(' AND '));
        }
      }
    } else if (key === 'OR') {
      if (Array.isArray(value)) {
        const subSqls: string[] = [];
        for (const sub of value) {
          const res = buildWhere(sub);
          if (res.sql) {
            subSqls.push(`(${res.sql})`);
            params.push(...res.params);
          }
        }
        if (subSqls.length > 0) {
          clauses.push(subSqls.join(' OR '));
        }
      }
    } else if (key === 'NOT') {
      const res = buildWhere(value);
      if (res.sql) {
        clauses.push(`NOT (${res.sql})`);
        params.push(...res.params);
      }
    } else {
      if (value === null) {
        clauses.push(`\`${key}\` IS NULL`);
      } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        for (const [op, opVal] of Object.entries(value)) {
          if (op === 'equals') {
            if (opVal === null) {
              clauses.push(`\`${key}\` IS NULL`);
            } else {
              clauses.push(`\`${key}\` = ?`);
              params.push(opVal);
            }
          } else if (op === 'not') {
            if (opVal === null) {
              clauses.push(`\`${key}\` IS NOT NULL`);
            } else {
              clauses.push(`\`${key}\` != ?`);
              params.push(opVal);
            }
          } else if (op === 'in') {
            if (Array.isArray(opVal)) {
              if (opVal.length === 0) {
                clauses.push('1 = 0');
              } else {
                const placeholders = opVal.map(() => '?').join(', ');
                clauses.push(`\`${key}\` IN (${placeholders})`);
                params.push(...opVal);
              }
            }
          } else if (op === 'notIn') {
            if (Array.isArray(opVal)) {
              if (opVal.length === 0) {
                // Always true
              } else {
                const placeholders = opVal.map(() => '?').join(', ');
                clauses.push(`\`${key}\` NOT IN (${placeholders})`);
                params.push(...opVal);
              }
            }
          } else if (op === 'gte') {
            clauses.push(`\`${key}\` >= ?`);
            params.push(opVal);
          } else if (op === 'gt') {
            clauses.push(`\`${key}\` > ?`);
            params.push(opVal);
          } else if (op === 'lte') {
            clauses.push(`\`${key}\` <= ?`);
            params.push(opVal);
          } else if (op === 'lt') {
            clauses.push(`\`${key}\` < ?`);
            params.push(opVal);
          } else if (op === 'contains') {
            clauses.push(`\`${key}\` LIKE ?`);
            params.push(`%${opVal}%`);
          } else if (op === 'startsWith') {
            clauses.push(`\`${key}\` LIKE ?`);
            params.push(`${opVal}%`);
          } else if (op === 'endsWith') {
            clauses.push(`\`${key}\` LIKE ?`);
            params.push(`%${opVal}`);
          }
        }
      } else {
        clauses.push(`\`${key}\` = ?`);
        params.push(value);
      }
    }
  }

  return {
    sql: clauses.join(' AND '),
    params
  };
}

function buildOrderBy(orderBy: any, tableName: string): string {
  if (!orderBy) return '';
  const parts: string[] = [];
  const list = Array.isArray(orderBy) ? orderBy : [orderBy];

  for (const item of list) {
    if (typeof item === 'object') {
      for (const [col, dir] of Object.entries(item)) {
        if (!/^[a-zA-Z0-9_]+$/.test(col)) continue;
        if (typeof dir === 'string') {
          const upperDir = dir.toUpperCase();
          if (upperDir === 'ASC' || upperDir === 'DESC') {
            parts.push(`\`${col}\` ${upperDir}`);
          }
        } else if (typeof dir === 'object' && dir && '_count' in dir) {
          if (col === 'orderItems' && tableName === 'Product') {
            parts.push(`(SELECT COUNT(*) FROM OrderItem WHERE OrderItem.productId = Product.id) DESC`);
          }
        }
      }
    }
  }

  return parts.length > 0 ? ` ORDER BY ${parts.join(', ')}` : '';
}

// ── Model Table Mappings ─────────────────────────────────────────────
const tableMap: Record<string, string> = {
  user: 'User',
  category: 'Category',
  product: 'Product',
  order: 'Order',
  orderItem: 'OrderItem',
  review: 'Review',
  coupon: 'Coupon',
  banner: 'Banner',
  storeSetting: 'StoreSetting',
  shippingZone: 'ShippingZone'
};

// Lazy Database Connection Pool (initialized on request time)
let _client: any = null;
function getClient() {
  if (_client) return _client;
  const url = process.env.DATABASE_URL;
  if (!url) {
    // If DATABASE_URL is not set (e.g. build time), return a mock client
    console.warn("DATABASE_URL is not set — using dummy client during static build phase.");
    return {
      execute: async () => []
    };
  }
  _client = connect({ url });
  return _client;
}

export interface PrismaClientMock {
  user: {
    findMany(args?: any): Promise<User[]>;
    findUnique(args: any): Promise<User | null>;
    findFirst(args?: any): Promise<User | null>;
    create(args: any): Promise<User>;
    update(args: any): Promise<User>;
    delete(args: any): Promise<User>;
    deleteMany(args?: any): Promise<{ count: number }>;
    upsert(args: any): Promise<User>;
    count(args?: any): Promise<number>;
    [key: string]: any;
  };
  category: {
    findMany(args?: any): Promise<Category[]>;
    findUnique(args: any): Promise<Category | null>;
    findFirst(args?: any): Promise<Category | null>;
    create(args: any): Promise<Category>;
    update(args: any): Promise<Category>;
    delete(args: any): Promise<Category>;
    deleteMany(args?: any): Promise<{ count: number }>;
    upsert(args: any): Promise<Category>;
    count(args?: any): Promise<number>;
    [key: string]: any;
  };
  product: {
    findMany(args?: any): Promise<Product[]>;
    findUnique(args: any): Promise<Product | null>;
    findFirst(args?: any): Promise<Product | null>;
    create(args: any): Promise<Product>;
    update(args: any): Promise<Product>;
    delete(args: any): Promise<Product>;
    deleteMany(args?: any): Promise<{ count: number }>;
    upsert(args: any): Promise<Product>;
    count(args?: any): Promise<number>;
    [key: string]: any;
  };
  order: {
    findMany(args?: any): Promise<Order[]>;
    findUnique(args: any): Promise<Order | null>;
    findFirst(args?: any): Promise<Order | null>;
    create(args: any): Promise<Order>;
    update(args: any): Promise<Order>;
    delete(args: any): Promise<Order>;
    deleteMany(args?: any): Promise<{ count: number }>;
    upsert(args: any): Promise<Order>;
    count(args?: any): Promise<number>;
    [key: string]: any;
  };
  orderItem: {
    findMany(args?: any): Promise<OrderItem[]>;
    findUnique(args: any): Promise<OrderItem | null>;
    findFirst(args?: any): Promise<OrderItem | null>;
    create(args: any): Promise<OrderItem>;
    update(args: any): Promise<OrderItem>;
    delete(args: any): Promise<OrderItem>;
    deleteMany(args?: any): Promise<{ count: number }>;
    upsert(args: any): Promise<OrderItem>;
    count(args?: any): Promise<number>;
    [key: string]: any;
  };
  review: {
    findMany(args?: any): Promise<Review[]>;
    findUnique(args: any): Promise<Review | null>;
    findFirst(args?: any): Promise<Review | null>;
    create(args: any): Promise<Review>;
    update(args: any): Promise<Review>;
    delete(args: any): Promise<Review>;
    deleteMany(args?: any): Promise<{ count: number }>;
    upsert(args: any): Promise<Review>;
    count(args?: any): Promise<number>;
    [key: string]: any;
  };
  coupon: {
    findMany(args?: any): Promise<Coupon[]>;
    findUnique(args: any): Promise<Coupon | null>;
    findFirst(args?: any): Promise<Coupon | null>;
    create(args: any): Promise<Coupon>;
    update(args: any): Promise<Coupon>;
    delete(args: any): Promise<Coupon>;
    deleteMany(args?: any): Promise<{ count: number }>;
    upsert(args: any): Promise<Coupon>;
    count(args?: any): Promise<number>;
    [key: string]: any;
  };
  banner: {
    findMany(args?: any): Promise<Banner[]>;
    findUnique(args: any): Promise<Banner | null>;
    findFirst(args?: any): Promise<Banner | null>;
    create(args: any): Promise<Banner>;
    update(args: any): Promise<Banner>;
    delete(args: any): Promise<Banner>;
    deleteMany(args?: any): Promise<{ count: number }>;
    upsert(args: any): Promise<Banner>;
    count(args?: any): Promise<number>;
    [key: string]: any;
  };
  storeSetting: {
    findMany(args?: any): Promise<StoreSetting[]>;
    findUnique(args: any): Promise<StoreSetting | null>;
    findFirst(args?: any): Promise<StoreSetting | null>;
    create(args: any): Promise<StoreSetting>;
    update(args: any): Promise<StoreSetting>;
    delete(args: any): Promise<StoreSetting>;
    deleteMany(args?: any): Promise<{ count: number }>;
    upsert(args: any): Promise<StoreSetting>;
    count(args?: any): Promise<number>;
    [key: string]: any;
  };
  shippingZone: {
    findMany(args?: any): Promise<ShippingZone[]>;
    findUnique(args: any): Promise<ShippingZone | null>;
    findFirst(args?: any): Promise<ShippingZone | null>;
    create(args: any): Promise<ShippingZone>;
    update(args: any): Promise<ShippingZone>;
    delete(args: any): Promise<ShippingZone>;
    deleteMany(args?: any): Promise<{ count: number }>;
    upsert(args: any): Promise<ShippingZone>;
    count(args?: any): Promise<number>;
    [key: string]: any;
  };
  $transaction<T>(callback: (tx: PrismaClientMock) => Promise<T>): Promise<T>;
  $disconnect(): Promise<void>;
  [key: string]: any;
}

// ── Core Mock Prisma Client Proxies ──────────────────────────────────
export const prisma = new Proxy({} as any, {
  get(_target, prop) {
    const key = String(prop);

    if (key === '$transaction') {
      return async (callback: (tx: any) => Promise<any>) => {
        const client = getClient();
        await client.execute('BEGIN');
        try {
          const result = await callback(prisma);
          await client.execute('COMMIT');
          return result;
        } catch (error) {
          await client.execute('ROLLBACK');
          throw error;
        }
      };
    }

    if (key === '$disconnect') {
      return async () => {};
    }

    const tableName = tableMap[key];
    if (!tableName) return undefined;

    return new Proxy({} as any, {
      get(_subTarget, method) {
        const methodName = String(method);

        return async (args: any = {}) => {
          const client = getClient();

          // ── findMany ─────────────────────────────────────────────────
          if (methodName === 'findMany') {
            const whereRes = buildWhere(args.where);
            const whereSql = whereRes.sql ? ` WHERE ${whereRes.sql}` : '';
            const orderSql = buildOrderBy(args.orderBy, tableName);
            
            let limitSql = '';
            if (args.take !== undefined) {
              limitSql = ` LIMIT ${args.take}`;
              if (args.skip !== undefined) {
                limitSql += ` OFFSET ${args.skip}`;
              }
            }

            const sql = `SELECT * FROM \`${tableName}\`${whereSql}${orderSql}${limitSql}`;
            const rows = await client.execute(sql, whereRes.params);

            let records = rows.map((r: any) => cleanRecord(r, tableName));

            if (args.include) {
              records = await resolveRelations(records, tableName, args.include);
            }

            return records;
          }

          // ── findFirst / findUnique ───────────────────────────────────
          if (methodName === 'findFirst' || methodName === 'findUnique') {
            // Check for special compound unique keys like userId_productId
            let finalWhere = args.where;
            if (args.where && tableName === 'Review' && args.where.userId_productId) {
              finalWhere = {
                userId: args.where.userId_productId.userId,
                productId: args.where.userId_productId.productId
              };
            }

            const whereRes = buildWhere(finalWhere);
            const whereSql = whereRes.sql ? ` WHERE ${whereRes.sql}` : '';
            const orderSql = buildOrderBy(args.orderBy, tableName);
            const sql = `SELECT * FROM \`${tableName}\`${whereSql}${orderSql} LIMIT 1`;
            const rows = await client.execute(sql, whereRes.params);

            if (rows.length === 0) return null;
            let record = cleanRecord(rows[0], tableName);

            if (args.include) {
              const res = await resolveRelations([record], tableName, args.include);
              record = res[0];
            }

            return record;
          }

          // ── count ────────────────────────────────────────────────────
          if (methodName === 'count') {
            const whereRes = buildWhere(args.where);
            const whereSql = whereRes.sql ? ` WHERE ${whereRes.sql}` : '';
            const sql = `SELECT COUNT(*) as cnt FROM \`${tableName}\`${whereSql}`;
            const rows = await client.execute(sql, whereRes.params);
            return rows.length > 0 ? Number(rows[0].cnt || rows[0].count || 0) : 0;
          }

          // ── aggregate ────────────────────────────────────────────────
          if (methodName === 'aggregate') {
            const whereRes = buildWhere(args.where);
            const whereSql = whereRes.sql ? ` WHERE ${whereRes.sql}` : '';
            const fields: string[] = [];

            if (args._sum) {
              for (const field of Object.keys(args._sum)) {
                fields.push(`SUM(\`${field}\`) as \`sum_${field}\``);
              }
            }
            if (args._avg) {
              for (const field of Object.keys(args._avg)) {
                fields.push(`AVG(\`${field}\`) as \`avg_${field}\``);
              }
            }
            if (args._min) {
              for (const field of Object.keys(args._min)) {
                fields.push(`MIN(\`${field}\`) as \`min_${field}\``);
              }
            }
            if (args._max) {
              for (const field of Object.keys(args._max)) {
                fields.push(`MAX(\`${field}\`) as \`max_${field}\``);
              }
            }
            if (args._count) {
              fields.push("COUNT(*) as `cnt`");
            }

            if (fields.length === 0) {
              fields.push("COUNT(*) as `cnt`");
            }

            const sql = `SELECT ${fields.join(', ')} FROM \`${tableName}\`${whereSql}`;
            const rows = await client.execute(sql, whereRes.params);
            const row = rows[0] || {};

            const result: any = {};
            if (args._sum) {
              result._sum = {};
              for (const field of Object.keys(args._sum)) {
                result._sum[field] = row[`sum_${field}`] !== null ? new Decimal(row[`sum_${field}`]) : null;
              }
            }
            if (args._avg) {
              result._avg = {};
              for (const field of Object.keys(args._avg)) {
                result._avg[field] = row[`avg_${field}`] !== null ? Number(row[`avg_${field}`]) : null;
              }
            }
            if (args._min) {
              result._min = {};
              for (const field of Object.keys(args._min)) {
                result._min[field] = row[`min_${field}`] !== null ? new Decimal(row[`min_${field}`]) : null;
              }
            }
            if (args._max) {
              result._max = {};
              for (const field of Object.keys(args._max)) {
                result._max[field] = row[`max_${field}`] !== null ? new Decimal(row[`max_${field}`]) : null;
              }
            }
            if (args._count) {
              if (typeof args._count === 'object') {
                result._count = {};
                for (const field of Object.keys(args._count)) {
                  result._count[field] = Number(row.cnt || 0);
                }
              } else {
                result._count = Number(row.cnt || 0);
              }
            }

            return result;
          }

          // ── create ───────────────────────────────────────────────────
          if (methodName === 'create') {
            const data = { ...args.data };
            if (!data.id) {
              // Assign cuid ID for tables that don't have id="1"
              if (tableName !== 'StoreSetting') {
                data.id = cuid();
              } else {
                data.id = '1';
              }
            }

            const now = new Date();
            const tablesWithCreatedAt = ['User', 'Category', 'Product', 'Order', 'Review', 'Coupon', 'Banner', 'ShippingZone'];
            const tablesWithUpdatedAt = ['User', 'Category', 'Product', 'Order', 'Review', 'Coupon', 'Banner', 'StoreSetting', 'ShippingZone'];

            if (tablesWithCreatedAt.includes(tableName) && data.createdAt === undefined) {
              data.createdAt = now;
            }
            if (tablesWithUpdatedAt.includes(tableName) && data.updatedAt === undefined) {
              data.updatedAt = now;
            }

            // Extract any nested creations/connections
            const nestedOps: Record<string, any> = {};
            for (const [col, val] of Object.entries(data)) {
              if (val && typeof val === 'object' && ('create' in val || 'connect' in val)) {
                nestedOps[col] = val;
                delete data[col];
              }
            }

            // Stringify JSON fields & serialize Dates
            for (const [col, val] of Object.entries(data)) {
              if (val && typeof val === 'object' && !(val instanceof Date)) {
                data[col] = JSON.stringify(val);
              } else if (val instanceof Date) {
                data[col] = val.toISOString().slice(0, 19).replace('T', ' ');
              } else if (typeof val === 'boolean') {
                data[col] = val ? 1 : 0;
              }
            }

            const safeKeys = Object.keys(data).filter(c => /^[a-zA-Z0-9_]+$/.test(c));
            const columns = safeKeys.map(c => `\`${c}\``).join(', ');
            const placeholders = safeKeys.map(() => '?').join(', ');
            const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
            const values = safeKeys.map(k => data[k]);
            await client.execute(sql, values);

            // Execute nested operations
            for (const [col, op] of Object.entries(nestedOps)) {
              if (op.create) {
                const subItems = Array.isArray(op.create) ? op.create : [op.create];
                for (const item of subItems) {
                  // Set foreign key relation back to parent id
                  if (tableName === 'Order' && col === 'items') {
                    item.orderId = data.id;
                    await prisma.orderItem.create({ data: item });
                  }
                }
              } else if (op.connect) {
                if (tableName === 'Category' && col === 'parent') {
                  const parentId = op.connect.id;
                  await client.execute(`UPDATE \`Category\` SET \`parentId\` = ? WHERE \`id\` = ?`, [parentId, data.id]);
                }
              }
            }

            // Return full record
            let created = await prisma[key].findUnique({ where: { id: data.id }, include: args.include });
            return created;
          }

          // ── update ───────────────────────────────────────────────────
          if (methodName === 'update') {
            const data = { ...args.data };

            const now = new Date();
            const tablesWithUpdatedAt = ['User', 'Category', 'Product', 'Order', 'Review', 'Coupon', 'Banner', 'StoreSetting', 'ShippingZone'];
            if (tablesWithUpdatedAt.includes(tableName) && data.updatedAt === undefined) {
              data.updatedAt = now;
            }

            const whereRes = buildWhere(args.where);
            const whereSql = whereRes.sql ? ` WHERE ${whereRes.sql}` : '';

            // Handle increment/decrement objects
            const arithmeticUpdates: Record<string, string> = {};
            for (const [col, val] of Object.entries(data)) {
              if (val && typeof val === 'object' && ('increment' in val || 'decrement' in val)) {
                if ('increment' in val) {
                  arithmeticUpdates[col] = `\`${col}\` + ?`;
                  data[col] = (val as any).increment;
                } else if ('decrement' in val) {
                  arithmeticUpdates[col] = `\`${col}\` - ?`;
                  data[col] = (val as any).decrement;
                }
              }
            }

            // Stringify JSON fields & serialize Dates
            for (const [col, val] of Object.entries(data)) {
              if (val && typeof val === 'object' && !(val instanceof Date)) {
                data[col] = JSON.stringify(val);
              } else if (val instanceof Date) {
                data[col] = val.toISOString().slice(0, 19).replace('T', ' ');
              } else if (typeof val === 'boolean') {
                data[col] = val ? 1 : 0;
              }
            }

            const safeKeys = Object.keys(data).filter(c => /^[a-zA-Z0-9_]+$/.test(c));
            const sets = safeKeys.map(c => {
              if (arithmeticUpdates[c]) {
                return `\`${c}\` = ${arithmeticUpdates[c]}`;
              }
              return `\`${c}\` = ?`;
            }).join(', ');

            const sql = `UPDATE \`${tableName}\` SET ${sets}${whereSql}`;
            const values = safeKeys.map(k => data[k]);
            await client.execute(sql, [...values, ...whereRes.params]);

            // Return full updated record
            let updated = await prisma[key].findFirst({ where: args.where, include: args.include });
            return updated;
          }

          // ── delete ───────────────────────────────────────────────────
          if (methodName === 'delete') {
            const record = await prisma[key].findFirst({ where: args.where });
            const whereRes = buildWhere(args.where);
            const whereSql = whereRes.sql ? ` WHERE ${whereRes.sql}` : '';
            const sql = `DELETE FROM \`${tableName}\`${whereSql}`;
            await client.execute(sql, whereRes.params);
            return record;
          }

          // ── deleteMany ───────────────────────────────────────────────
          if (methodName === 'deleteMany') {
            const whereRes = buildWhere(args.where);
            const whereSql = whereRes.sql ? ` WHERE ${whereRes.sql}` : '';
            const sql = `DELETE FROM \`${tableName}\`${whereSql}`;
            const res = await client.execute(sql, whereRes.params);
            return { count: res.affectedRows || 0 };
          }

          // ── updateMany ───────────────────────────────────────────────
          if (methodName === 'updateMany') {
            const data = { ...args.data };

            const now = new Date();
            const tablesWithUpdatedAt = ['User', 'Category', 'Product', 'Order', 'Review', 'Coupon', 'Banner', 'StoreSetting', 'ShippingZone'];
            if (tablesWithUpdatedAt.includes(tableName) && data.updatedAt === undefined) {
              data.updatedAt = now;
            }

            const whereRes = buildWhere(args.where);
            const whereSql = whereRes.sql ? ` WHERE ${whereRes.sql}` : '';

            // Handle increment/decrement objects
            const arithmeticUpdates: Record<string, string> = {};
            for (const [col, val] of Object.entries(data)) {
              if (val && typeof val === 'object' && ('increment' in val || 'decrement' in val)) {
                if ('increment' in val) {
                  arithmeticUpdates[col] = `\`${col}\` + ?`;
                  data[col] = (val as any).increment;
                } else if ('decrement' in val) {
                  arithmeticUpdates[col] = `\`${col}\` - ?`;
                  data[col] = (val as any).decrement;
                }
              }
            }

            // Stringify JSON fields & serialize Dates
            for (const [col, val] of Object.entries(data)) {
              if (val && typeof val === 'object' && !(val instanceof Date)) {
                data[col] = JSON.stringify(val);
              } else if (val instanceof Date) {
                data[col] = val.toISOString().slice(0, 19).replace('T', ' ');
              } else if (typeof val === 'boolean') {
                data[col] = val ? 1 : 0;
              }
            }

            const safeKeys = Object.keys(data).filter(c => /^[a-zA-Z0-9_]+$/.test(c));
            const sets = safeKeys.map(c => {
              if (arithmeticUpdates[c]) {
                return `\`${c}\` = ${arithmeticUpdates[c]}`;
              }
              return `\`${c}\` = ?`;
            }).join(', ');

            const sql = `UPDATE \`${tableName}\` SET ${sets}${whereSql}`;
            const values = safeKeys.map(k => data[k]);
            const res = await client.execute(sql, [...values, ...whereRes.params]);
            return { count: res.affectedRows || 0 };
          }

          // ── upsert ───────────────────────────────────────────────────
          if (methodName === 'upsert') {
            const existing = await prisma[key].findUnique({ where: args.where });
            if (existing) {
              return await prisma[key].update({ where: args.where, data: args.update, include: args.include });
            } else {
              return await prisma[key].create({ data: args.create, include: args.include });
            }
          }

          throw new Error(`Unsupported model method: ${methodName}`);
        };
      }
    });
  }
}) as unknown as PrismaClientMock;

export const db = prisma;

// ── Relationship Resolver (SECONDARY QUERY JOINS) ────────────────────
async function resolveRelations(records: any[], tableName: string, include: any): Promise<any[]> {
  if (records.length === 0) return records;

  const client = getClient();

  for (const [relationName, value] of Object.entries(include)) {
    if (!value) continue;

    // ── Product Relations ──
    if (tableName === 'Product') {
      if (relationName === 'category') {
        const catIds = Array.from(new Set(records.map(r => r.categoryId).filter(Boolean)));
        if (catIds.length > 0) {
          const placeholders = catIds.map(() => '?').join(', ');
          const cats = await client.execute(`SELECT * FROM \`Category\` WHERE \`id\` IN (${placeholders})`, catIds);
          const catMap = new Map(cats.map((c: any) => [c.id, cleanRecord(c, 'Category')]));
          for (const rec of records) {
            rec.category = catMap.get(rec.categoryId) || null;
          }
        } else {
          for (const rec of records) rec.category = null;
        }
      } else if (relationName === 'reviews') {
        const prodIds = records.map(r => r.id);
        const placeholders = prodIds.map(() => '?').join(', ');
        const reviews = await prisma.review.findMany({
          where: { productId: { in: prodIds } },
          include: typeof value === 'object' && (value as any).include ? (value as any).include : undefined
        });
        const reviewMap = new Map<string, any[]>();
        for (const rev of reviews) {
          if (!reviewMap.has(rev.productId)) reviewMap.set(rev.productId, []);
          reviewMap.get(rev.productId)!.push(rev);
        }
        for (const rec of records) {
          rec.reviews = reviewMap.get(rec.id) || [];
        }
      }
    }

    // ── Category Relations ──
    else if (tableName === 'Category') {
      if (relationName === 'parent') {
        const parentIds = Array.from(new Set(records.map(r => r.parentId).filter(Boolean)));
        if (parentIds.length > 0) {
          const placeholders = parentIds.map(() => '?').join(', ');
          const parents = await client.execute(`SELECT * FROM \`Category\` WHERE \`id\` IN (${placeholders})`, parentIds);
          const parentMap = new Map(parents.map((p: any) => [p.id, cleanRecord(p, 'Category')]));
          for (const rec of records) {
            rec.parent = parentMap.get(rec.parentId) || null;
          }
        } else {
          for (const rec of records) rec.parent = null;
        }
      } else if (relationName === 'children') {
        const catIds = records.map(r => r.id);
        const placeholders = catIds.map(() => '?').join(', ');
        const children = await client.execute(`SELECT * FROM \`Category\` WHERE \`parentId\` IN (${placeholders})`, catIds);
        const cleanChildren = children.map((c: any) => cleanRecord(c, 'Category'));
        const childMap = new Map<string, any[]>();
        for (const child of cleanChildren) {
          if (!childMap.has(child.parentId)) childMap.set(child.parentId, []);
          childMap.get(child.parentId)!.push(child);
        }
        for (const rec of records) {
          rec.children = childMap.get(rec.id) || [];
        }
      } else if (relationName === '_count') {
        // Handle _count: { select: { products: true, children: true } }
        for (const rec of recsToLoop(records)) {
          rec._count = rec._count || {};
          if ((value as any).select?.products) {
            const countRows = await client.execute(`SELECT COUNT(*) as count FROM \`Product\` WHERE \`categoryId\` = ?`, [rec.id]);
            rec._count.products = countRows.length > 0 ? Number(countRows[0].count || countRows[0].cnt || 0) : 0;
          }
          if ((value as any).select?.children) {
            const countRows = await client.execute(`SELECT COUNT(*) as count FROM \`Category\` WHERE \`parentId\` = ?`, [rec.id]);
            rec._count.children = countRows.length > 0 ? Number(countRows[0].count || countRows[0].cnt || 0) : 0;
          }
        }
      }
    }

    // ── Order Relations ──
    else if (tableName === 'Order') {
      if (relationName === 'items') {
        const orderIds = records.map(r => r.id);
        const placeholders = orderIds.map(() => '?').join(', ');
        const subInclude = typeof value === 'object' && (value as any).include ? (value as any).include : undefined;
        const items = await prisma.orderItem.findMany({
          where: { orderId: { in: orderIds } },
          include: subInclude
        });
        const itemsMap = new Map<string, any[]>();
        for (const item of items) {
          if (!itemsMap.has(item.orderId)) itemsMap.set(item.orderId, []);
          itemsMap.get(item.orderId)!.push(item);
        }
        for (const rec of records) {
          rec.items = itemsMap.get(rec.id) || [];
        }
      } else if (relationName === 'user') {
        const userIds = Array.from(new Set(records.map(r => r.userId).filter(Boolean)));
        if (userIds.length > 0) {
          const placeholders = userIds.map(() => '?').join(', ');
          const users = await client.execute(`SELECT * FROM \`User\` WHERE \`id\` IN (${placeholders})`, userIds);
          const userMap = new Map(users.map((u: any) => [u.id, cleanRecord(u, 'User')]));
          for (const rec of records) {
            rec.user = userMap.get(rec.userId) || null;
          }
        } else {
          for (const rec of records) rec.user = null;
        }
      }
    }

    // ── OrderItem Relations ──
    else if (tableName === 'OrderItem') {
      if (relationName === 'product') {
        const prodIds = Array.from(new Set(records.map(r => r.productId).filter(Boolean)));
        if (prodIds.length > 0) {
          const placeholders = prodIds.map(() => '?').join(', ');
          const prods = await client.execute(`SELECT * FROM \`Product\` WHERE \`id\` IN (${placeholders})`, prodIds);
          const prodMap = new Map(prods.map((p: any) => [p.id, cleanRecord(p, 'Product')]));
          for (const rec of records) {
            rec.product = prodMap.get(rec.productId) || null;
          }
        } else {
          for (const rec of records) rec.product = null;
        }
      }
    }

    // ── Review Relations ──
    else if (tableName === 'Review') {
      if (relationName === 'user') {
        const userIds = Array.from(new Set(records.map(r => r.userId).filter(Boolean)));
        if (userIds.length > 0) {
          const placeholders = userIds.map(() => '?').join(', ');
          const users = await client.execute(`SELECT * FROM \`User\` WHERE \`id\` IN (${placeholders})`, userIds);
          const userMap = new Map(users.map((u: any) => [u.id, cleanRecord(u, 'User')]));
          for (const rec of records) {
            // Support sub-select like user: { select: { name: true } }
            const fullUser = userMap.get(rec.userId) || null;
            if (fullUser && typeof value === 'object' && (value as any).select) {
              const selected: Record<string, any> = {};
              for (const selectCol of Object.keys((value as any).select)) {
                selected[selectCol] = (fullUser as any)[selectCol];
              }
              rec.user = selected;
            } else {
              rec.user = fullUser;
            }
          }
        } else {
          for (const rec of records) rec.user = null;
        }
      }
    }

    // ── User Relations ──
    else if (tableName === 'User') {
      if (relationName === 'orders') {
        const userIds = records.map(r => r.id);
        const orders = await prisma.order.findMany({
          where: { userId: { in: userIds } },
          include: typeof value === 'object' && (value as any).include ? (value as any).include : undefined
        });
        const orderMap = new Map<string, any[]>();
        for (const order of orders) {
          if (order.userId) {
            if (!orderMap.has(order.userId)) orderMap.set(order.userId, []);
            orderMap.get(order.userId)!.push(order);
          }
        }
        for (const rec of records) {
          rec.orders = orderMap.get(rec.id) || [];
        }
      }
    }
  }

  return records;
}

// Helper to make category loops safe and fast
function recsToLoop(records: any[]): any[] {
  return records;
}
