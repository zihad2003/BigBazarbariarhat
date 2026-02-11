// ─── Category ─────────────────────────────────────────────────
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    _count?: {
        products: number;
    };
}

// ─── Product Images ───────────────────────────────────────────
export interface ProductImage {
    id: string;
    url: string;
    altText?: string;
    isPrimary: boolean;
}

// ─── Product Variants ─────────────────────────────────────────
export interface ProductVariant {
    id: string;
    productId: string;
    name: string;
    sku: string;
    priceAdjustment: number;
    inventoryCount: number;
    attributes: Record<string, string>;
}

// ─── Brand ────────────────────────────────────────────────────
export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo?: string;
}

// ─── Product ──────────────────────────────────────────────────
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    basePrice: number;
    salePrice?: number;
    inventoryCount: number;
    stockQuantity: number;
    lowStockThreshold?: number;
    sku: string;
    images: ProductImage[];
    categoryId: string;
    category?: Category;
    brandId?: string;
    brand?: Brand;
    variants?: ProductVariant[];
    attributes?: { key: string; value: string }[];
    isActive: boolean;
    isFeatured: boolean;
    isNewArrival?: boolean;
    averageRating?: number;
    reviewCount?: number;
    viewCount?: number;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

// ─── Product Filter ───────────────────────────────────────────
export interface ProductFilter {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    brandId?: string;
    search?: string;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
    page?: number;
    limit?: number;
}




