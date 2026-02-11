import { prisma } from '../client';
import { CreateProductInput, ProductFilterInput } from '@bigbazar/validation';

export const ProductService = {
    async list(filters: ProductFilterInput) {
        const {
            category,
            brand,
            minPrice,
            maxPrice,
            sortBy,
            page = 1,
            limit = 12
        } = filters;

        const skip = (page - 1) * limit;
        const where: any = { isActive: true };

        if (category) where.category = { slug: category };
        if (brand) where.brand = { slug: brand };

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.salePrice = {};
            if (minPrice !== undefined) where.salePrice.gte = minPrice;
            if (maxPrice !== undefined) where.salePrice.lte = maxPrice;
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sortBy === 'price_asc') orderBy = { salePrice: 'asc' };
        if (sortBy === 'price_desc') orderBy = { salePrice: 'desc' };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    brand: true,
                    images: { take: 1, orderBy: { displayOrder: 'asc' } },
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
            }
        });
    }
};
