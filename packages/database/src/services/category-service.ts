import { prisma } from '../client';
import { Category } from '@bigbazar/shared';

export const CategoryService = {
    async list() {
        return prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { displayOrder: 'asc' }
        });
    },

    async getById(id: string) {
        return prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
    },

    async create(data: any) {
        return prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                image: data.image,
                icon: data.icon,
                displayOrder: parseInt(data.displayOrder || '0'),
                isActive: data.isActive ?? true,
                parentId: data.parentId
            }
        });
    },

    async update(id: string, data: any) {
        return prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                image: data.image,
                icon: data.icon,
                displayOrder: parseInt(data.displayOrder || '0'),
                isActive: data.isActive,
                parentId: data.parentId
            }
        });
    },

    async delete(id: string) {
        return prisma.category.delete({
            where: { id }
        });
    }
};
