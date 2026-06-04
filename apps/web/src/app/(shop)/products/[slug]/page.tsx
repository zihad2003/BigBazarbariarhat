import { prisma } from '@bigbazar/db';
import ProductDetailClient from './ProductDetailClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

export const revalidate = 60; // Revalidate dynamic product detail pages every 60 seconds

// Serialize Decimal and Date Prisma database fields to JSON-compatible data types
function serializeProduct(p: any) {
    if (!p) return null;
    let productImages: any[] = [];
    try {
        productImages = typeof p.images === 'string'
            ? JSON.parse(p.images)
            : (Array.isArray(p.images) ? p.images : []);
    } catch (e) {
        productImages = [];
    }
    
    return {
        ...p,
        price: Number(p.price),
        basePrice: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        images: productImages,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category ? {
            ...p.category,
            createdAt: p.category.createdAt.toISOString(),
            updatedAt: p.category.updatedAt.toISOString(),
        } : null,
        reviews: p.reviews ? p.reviews.map((r: any) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
            user: r.user ? {
                id: r.user.id,
                name: r.user.name,
                image: r.user.image,
            } : null
        })) : []
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // Fetch product details by ID or Slug directly from the database
    let product = await prisma.product.findUnique({
        where: { id: slug },
        include: { category: true, reviews: { include: { user: true } } }
    });

    if (!product) {
        product = await prisma.product.findUnique({
            where: { slug },
            include: { category: true, reviews: { include: { user: true } } }
        });
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-40 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    <Info className="h-10 w-10 text-gray-200" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">Product Not Found</h1>
                <p className="text-gray-400 mb-10 max-w-lg mx-auto font-medium">This product is currently unavailable or may have been removed.</p>
                <Link href="/products">
                    <Button className="rounded-xl px-10 h-14 bg-foreground text-white hover:bg-primary font-bold uppercase tracking-wider text-sm">
                        Back to Products
                    </Button>
                </Link>
            </div>
        );
    }

    // Query related products from the same category
    const related = await prisma.product.findMany({
        where: {
            categoryId: product.categoryId,
            NOT: { id: product.id },
            isActive: true
        },
        take: 4,
        include: { category: true }
    });

    const serializedProduct = serializeProduct(product);
    const serializedRelated = related.map(serializeProduct);

    if (serializedProduct) {
        const reviews = serializedProduct.reviews || [];
        serializedProduct.reviewCount = reviews.length;
        serializedProduct.rating = reviews.length > 0 
            ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length 
            : 0;
    }

    return (
        <ProductDetailClient
            product={serializedProduct}
            relatedProducts={serializedRelated}
        />
    );
}
