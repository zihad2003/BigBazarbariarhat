import { prisma } from '../client';
import { CreateProductInput, ProductFilterInput } from '@bigbazar/validation';

export const ProductService = {
    async list(filters: ProductFilterInput) {
        const {
            q,
            category,
            brand,
            minPrice,
            maxPrice,
            sizes,
            colors,
            rating,
            inStock,
            sortBy,
            page = 1,
            limit = 12
        } = filters;

        const skip = (page - 1) * limit;
        const where: any = { isActive: true, AND: [] };

        if (q) {
            where.AND.push({
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                    { sku: { contains: q, mode: 'insensitive' } },
                ]
            });
        }

        if (category) {
            where.category = { slug: category };
        }

        if (brand) {
            where.brand = { slug: brand };
        }

        // Price filtering
        if (minPrice !== undefined || maxPrice !== undefined) {
            const priceFilter: any = {};
            if (minPrice !== undefined) priceFilter.gte = minPrice;
            if (maxPrice !== undefined) priceFilter.lte = maxPrice;

            where.AND.push({
                OR: [
                    { salePrice: priceFilter },
                    { AND: [{ salePrice: null }, { basePrice: priceFilter }] }
                ]
            });
        }

        // Variant filters (Size/Color)
        if ((sizes && sizes.length > 0) || (colors && colors.length > 0)) {
            where.variants = {
                some: {
                    isActive: true,
                }
            };
            if (sizes && sizes.length > 0) {
                where.variants.some.size = { in: sizes };
            }
            if (colors && colors.length > 0) {
                where.variants.some.color = { in: colors };
            }
        }

        if (rating !== undefined) {
            where.averageRating = { gte: rating };
        }

        if (inStock === true) {
            where.stockQuantity = { gt: 0 };
        } else if (inStock === false) {
            where.stockQuantity = { lte: 0 };
        }

        // Clean up empty AND array
        if (where.AND && where.AND.length === 0) delete where.AND;

        let orderBy: any = { createdAt: 'desc' };
        if (sortBy === 'price_asc') orderBy = { basePrice: 'asc' };
        if (sortBy === 'price_desc') orderBy = { basePrice: 'desc' };
        if (sortBy === 'popular') orderBy = { viewCount: 'desc' };
        if (sortBy === 'rating') orderBy = { averageRating: 'desc' };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    brand: true,
                    images: { orderBy: { displayOrder: 'asc' } },
                    variants: { where: { isActive: true } },
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return {
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    },

    async create(data: CreateProductInput) {
        return prisma.product.create({
            data: {
                ...data,
                slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            },
            include: {
                category: true,
                brand: true,
                images: true,
            }
        });
    },

    async getFiltersMetadata() {
        const [categories, brands, variants] = await Promise.all([
            prisma.category.findMany({
                where: { isActive: true },
                select: { id: true, name: true, slug: true }
            }),
            prisma.brand.findMany({
                where: { isActive: true },
                select: { id: true, name: true, slug: true }
            }),
            prisma.productVariant.findMany({
                where: { isActive: true },
                select: { size: true, color: true, colorHex: true }
            })
        ]);

        const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean))) as string[];

        // Unique colors by name
        const colorsMap = new Map<string, string | null>();
        variants.forEach(v => {
            if (v.color && !colorsMap.has(v.color)) {
                colorsMap.set(v.color, v.colorHex || null);
            }
        });

        const colors = Array.from(colorsMap.entries()).map(([name, hex]) => ({ name, hex }));

        return {
            categories,
            brands,
            sizes,
            colors
        };
    }
};
