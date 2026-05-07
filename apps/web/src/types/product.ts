export interface ProductImage {
    id: string;
    url: string;
    alt?: string;
    isMain: boolean;
}

export interface ProductVariant {
    id: string;
    name: string; // e.g., "Color", "Size"
    value: string; // e.g., "Red", "Large"
    priceAdjustment: number;
    stock: number;
    sku?: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    basePrice: number;
    salePrice?: number;
    costPrice?: number; // For admin profit tracking
    category: string;
    brand?: string;
    sku: string;
    stock: number;
    images: ProductImage[];
    variants?: ProductVariant[];
    instagramReelUrl?: string;
    rating: number;
    reviewCount: number;
    isFeatured: boolean;
    isNew: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'inactive' | 'draft';
}

export interface ProductResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}
