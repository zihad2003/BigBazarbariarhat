'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Star,
    ShoppingBag,
    Heart,
    Share2,
    ShieldCheck,
    Truck,
    RotateCcw,
    Plus,
    Minus,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, ProductsService } from '@bigbazar/shared';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';
import type { Product, ProductVariant } from '@bigbazar/shared';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const addItem = useCartStore((state) => state.addItem);
    const toggleWishlist = useWishlistStore((state) => state.toggleItem);
    const isInWishlist = useWishlistStore((state) => state.isInWishlist);
    const { openCart, addNotification } = useUIStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await ProductsService.getProduct(params.slug);
                if (result.success && result.data) {
                    setProduct(result.data);
                    if (result.data.variants && result.data.variants.length > 0) {
                        setSelectedVariant(result.data.variants[0]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-200 rounded-2xl" />
                    <div className="space-y-6">
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                        <div className="h-10 w-3/4 bg-gray-200 rounded" />
                        <div className="h-6 w-1/4 bg-gray-200 rounded" />
                        <div className="h-24 w-full bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
            </div>
        );
    }

    const handleAddToCart = () => {
        addItem(product, quantity, selectedVariant || undefined);
        addNotification({
            type: 'success',
            message: `${product.name} added to cart`,
        });
        openCart();
    };

    const currentPrice = selectedVariant?.priceAdjustment
        ? (product.salePrice || product.basePrice) + selectedVariant.priceAdjustment
        : (product.salePrice || product.basePrice);

    const discount = product.salePrice
        ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group shadow-lg ring-1 ring-gray-200">
                        {product.images?.[activeImage] ? (
                            <Image
                                src={product.images[activeImage].url}
                                alt={product.images[activeImage].altText || product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image Available
                            </div>
                        )}
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                                -{discount}%
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                        {product.images?.map((image, index) => (
                            <button
                                key={image.id}
                                onClick={() => setActiveImage(index)}
                                className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 ring-2 transition-all ${activeImage === index ? 'ring-black scale-95' : 'ring-transparent hover:ring-gray-300'
                                    }`}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.altText || product.name}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                            <span>{product.category?.name}</span>
                            <span>•</span>
                            <span>{product.brand?.name}</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 fill-current ${i < Math.floor(product.averageRating || 0) ? 'text-amber-400' : 'text-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500 font-medium">({product.reviewCount} Reviews)</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-green-600 font-semibold">{product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl font-bold text-black font-serif">৳{currentPrice.toLocaleString()}</span>
                            {product.salePrice && (
                                <span className="text-xl text-gray-400 line-through">৳{product.basePrice.toLocaleString()}</span>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed text-lg mb-8 whitespace-pre-line">
                            {product.description || product.shortDescription}
                        </p>
                    </div>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Select Option</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${selectedVariant?.id === variant.id
                                            ? 'bg-black text-white shadow-lg scale-105'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        {variant.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Actions */}
                    <div className="flex flex-col gap-4 mt-auto">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                                <div className="w-16 text-center font-bold text-lg select-none">
                                    {quantity}
                                </div>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 h-16 bg-black text-white hover:bg-gray-800 rounded-xl text-lg font-bold gap-3 shadow-xl transition-all active:scale-95"
                            >
                                <ShoppingBag className="h-6 w-6" />
                                Add to Cart
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => toggleWishlist(product as any)}
                                className={`h-16 w-16 p-0 rounded-xl border-2 transition-all active:scale-90 ${isInWishlist(product.id)
                                    ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600'
                                    : 'border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-black'
                                    }`}
                            >
                                <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <Truck className="h-6 w-6 text-gray-400" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Fast Delivery</h4>
                                    <p className="text-xs text-gray-500">2-3 days nationwide</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <RotateCcw className="h-6 w-6 text-gray-400" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Free Returns</h4>
                                    <p className="text-xs text-gray-500">Within 7 days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-20">
                <div className="border-b border-gray-200 mb-12 flex items-center justify-center gap-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <button className="pb-4 text-lg font-bold border-b-2 border-black">Description</button>
                    <button className="pb-4 text-lg font-bold border-b-2 border-transparent text-gray-400 hover:text-black">Specifications</button>
                    <button className="pb-4 text-lg font-bold border-b-2 border-transparent text-gray-400 hover:text-black">Shipping & Returns</button>
                    <button className="pb-4 text-lg font-bold border-b-2 border-transparent text-gray-400 hover:text-black">Reviews ({product.reviewCount})</button>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Information</h3>
                        <p className="mb-8">
                            Step into style with our {product.name}. Designed for the modern trendsetter, this piece combines
                            comfort with a sleek aesthetic. Whether you're dressing up for a special occasion or keeping it
                            casual for the weekend, this product is the perfect addition to your wardrobe.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm ring-1 ring-gray-100">
                                <h4 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Key Features</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-indigo-500 rounded-full" />
                                        <span>Premium quality materials for durability</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-indigo-500 rounded-full" />
                                        <span>Ergonomic design for maximum comfort</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-indigo-500 rounded-full" />
                                        <span>Available in multiple colors and sizes</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-indigo-500 rounded-full" />
                                        <span>Perfect for any occasion</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm ring-1 ring-gray-100">
                                <h4 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Technical Details</h4>
                                <div className="space-y-4">
                                    {product.attributes?.map((attr: any) => (
                                        <div key={attr.key} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                            <span className="font-semibold text-gray-500">{attr.key}</span>
                                            <span className="text-gray-900 font-medium">{attr.value}</span>
                                        </div>
                                    ))}
                                    {!product.attributes && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                <span className="font-semibold text-gray-500">Material</span>
                                                <span className="text-gray-900 font-medium">100% Cotton</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                <span className="font-semibold text-gray-500">Fit</span>
                                                <span className="text-gray-900 font-medium">Regular Fit</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                                <span className="font-semibold text-gray-500">Made In</span>
                                                <span className="text-gray-900 font-medium">Bangladesh</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
