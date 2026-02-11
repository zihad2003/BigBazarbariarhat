import { z } from 'zod';

export const productFilterSchema = z.object({
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'popular', 'rating']).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
});

export const createProductSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    categoryId: z.string().min(1, 'Category is required'),
    brandId: z.string().optional(),
    sku: z.string().min(1, 'SKU is required'),
    barcode: z.string().optional(),
    basePrice: z.number().min(0, 'Price must be positive'),
    salePrice: z.number().min(0).optional(),
    costPrice: z.number().min(0).optional(),
    stockQuantity: z.number().min(0).default(0),
    lowStockThreshold: z.number().min(0).default(10),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
});

export const productVariantSchema = z.object({
    name: z.string().min(1, 'Variant name is required'),
    sku: z.string().min(1, 'SKU is required'),
    size: z.string().optional(),
    color: z.string().optional(),
    colorHex: z.string().optional(),
    material: z.string().optional(),
    priceAdjustment: z.number().optional(),
    stockQuantity: z.number().min(0).default(0),
    images: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
});

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    image: z.string().url().optional(),
    icon: z.string().optional(),
    parentId: z.string().optional(),
    displayOrder: z.number().default(0),
    isActive: z.boolean().default(true),
});

export const createBrandSchema = z.object({
    name: z.string().min(1, 'Brand name is required'),
    slug: z.string().min(1, 'Slug is required'),
    logo: z.string().url().optional(),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
});
