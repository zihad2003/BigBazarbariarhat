import { prisma } from '../client';
import { Prisma } from '@prisma/client';

export const ProductService = {
    async list(filters: any) {
        const {
            q,
            category,
            brand,
            minPrice,
            maxPrice,
            sizes,
            colors,
            status,
            isFeatured,
            isSpecial,
            sortBy,
            page = 1,
            limit = 12
        } = filters;

        const skip = (page - 1) * limit;
        const where: any = { AND: [] };

        if (q) {
            where.AND.push({
                OR: [
                    { name: { contains: q } },
                    { nameEn: { contains: q } },
                    { slug: { contains: q } },
                ]
            });
        }

        if (category) {
            where.category = { slug: category };
        }

        if (brand) {
            where.brand = { slug: brand };
        }

        if (status) {
            where.status = status;
        } else {
            where.status = 'ACTIVE';
        }

        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }

        if (isSpecial !== undefined) {
            where.isSpecial = isSpecial;
        }

        // Price filtering
        if (minPrice !== undefined || maxPrice !== undefined) {
            const priceFilter: any = {};
            if (minPrice !== undefined) priceFilter.gte = new Prisma.Decimal(minPrice);
            if (maxPrice !== undefined) priceFilter.lte = new Prisma.Decimal(maxPrice);

            where.AND.push({
                OR: [
                    { salePrice: priceFilter },
                    { AND: [{ salePrice: null }, { price: priceFilter }] }
                ]
            });
        }

        // Variant filters (Size/Color)
        if ((sizes && sizes.length > 0) || (colors && colors.length > 0)) {
            const variantWhere: any = {};
            if (sizes && sizes.length > 0) variantWhere.size = { in: sizes };
            if (colors && colors.length > 0) variantWhere.color = { in: colors };
            
            where.variants = {
                some: variantWhere
            };
        }

        // Clean up empty AND array
        if (where.AND && where.AND.length === 0) delete where.AND;

        let orderBy: any = { createdAt: 'desc' };
        if (sortBy === 'price_asc') orderBy = { price: 'asc' };
        if (sortBy === 'price_desc') orderBy = { price: 'desc' };
        if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    brand: true,
                    images: { orderBy: { order: 'asc' } },
                    variants: true,
                },
                orderBy,
                skip,
                take: limit,
            } as any),
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

    async getBySlug(slug: string) {
        return prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                brand: true,
                images: { orderBy: { order: 'asc' } },
                variants: true,
            }
        } as any);
    },

    async create(data: any) {
        const { images, variants, ...rest } = data;
        return prisma.product.create({
            data: {
                ...rest,
                slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                images: {
                    create: images?.map((img: any, index: number) => ({
                        url: img.url,
                        isPrimary: img.isPrimary || index === 0,
                        order: img.order || index
                    }))
                },
                variants: {
                    create: variants?.map((v: any) => ({
                        size: v.size,
                        color: v.color,
                        stock: v.stock || 0,
                        sku: v.sku || `${rest.sku}-${v.size}-${v.color}`
                    }))
                }
            } as any,
            include: {
                category: true,
                brand: true,
                images: true,
                variants: true
            }
        } as any);
    }
};
