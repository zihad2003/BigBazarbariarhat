'use client';

import { useState, useEffect, useMemo, use } from 'react';
import {
    Star,
    ShoppingBag,
    Heart,
    Truck,
    RotateCcw,
    Plus,
    Minus,
    ArrowLeft,
    ArrowRight,
    Share2,
    ShieldCheck,
    Check,
    Info,
    Loader2,
    ChevronRight,
    MessageSquare,
    ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_PRODUCTS } from '@/lib/mock-data/products';
import { ProductGallery } from '@/components/shop/product-gallery';
import { SocialShare } from '@/components/shop/social-share';
import { ProductReviews } from '@/components/shop/product-reviews';
import { RelatedProducts } from '@/components/shop/related-products';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { formatPrice, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { DeliveryInfoModal } from '@/components/shop/delivery-info-modal';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import type { Product, ProductVariant } from '@/types/product';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const resolvedParams = use(params);
    const { slug } = resolvedParams;
    const router = useRouter();

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

    // Stores
    const addItem = useCartStore((state) => state.addItem);
    const toggleWishlist = useWishlistStore((state) => state.toggleItem);
    const isInWishlist = useWishlistStore((state) => state.isInWishlist);
    const { openCart, addNotification } = useUIStore();

    // Data Fetching Simulation
    const product = useMemo(() => {
        return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
    }, [slug]);

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return MOCK_PRODUCTS
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
    }, [product]);

    useEffect(() => {
        if (product) {
            if (product.variants && product.variants.length > 0) {
                setSelectedVariant(product.variants[0]);
            }
            const timer = setTimeout(() => setIsLoading(false), 600);
            return () => clearTimeout(timer);
        } else {
            setIsLoading(false);
        }
    }, [product]);

    // Handlers
    const handleAddToCart = async () => {
        if (!product) return;
        setIsAdding(true);
        // Premium artificial delay
        await new Promise(resolve => setTimeout(resolve, 600));

        addItem({
            productId: product.id,
            name: product.name,
            price: product.salePrice ?? product.basePrice,
            image: product.images?.[0]?.url ?? '',
            quantity,
            variant: selectedVariant?.name,
            stock: product.stock,
        });
        addNotification({
            type: 'success',
            message: `${product.name} added to cart`,
        });
        setIsAdding(false);
        router.push('/cart');
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="aspect-[4/5] bg-gray-50 rounded-[3rem] animate-pulse" />
                    <div className="space-y-10 py-10">
                        <div className="space-y-4">
                            <div className="h-4 w-32 bg-gray-100 rounded-full animate-pulse" />
                            <div className="h-16 w-full bg-gray-100 rounded-[1.5rem] animate-pulse" />
                            <div className="h-10 w-1/3 bg-gray-100 rounded-xl animate-pulse" />
                        </div>
                        <div className="h-40 w-full bg-gray-50 rounded-[2rem] animate-pulse" />
                    </div>
                </div>
            </div>
        );
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

    const currentPrice = selectedVariant?.priceAdjustment
        ? (product.salePrice || product.basePrice) + selectedVariant.priceAdjustment
        : (product.salePrice || product.basePrice);

    const discountPercentage = product.salePrice
        ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
        : 0;

    const isOutOfStock = product.stock <= 0;

    const tabs = [
        { id: 'description', label: 'Description', icon: Info },
        { id: 'specifications', label: 'Specifications', icon: ClipboardList },
        { id: 'reviews', label: `Reviews (${product.reviewCount})`, icon: MessageSquare },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
                
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-3 mb-10 overflow-x-auto no-scrollbar">
                    <Link href="/" className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">Home</Link>
                    <ChevronRight className="h-3 w-3 text-gray-300" />
                    <Link href="/products" className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">Products</Link>
                    <ChevronRight className="h-3 w-3 text-gray-300" />
                    <Link href={`/products?category=${product.category}`} className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">{product.category}</Link>
                    <ChevronRight className="h-3 w-3 text-gray-300" />
                    <span className="text-xs font-semibold text-primary truncate">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
                    
                    {/* Left: Image Gallery Module */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <ProductGallery
                                images={product.images}
                                productName={product.name}
                                discount={discountPercentage}
                            />
                        </motion.div>
                    </div>

                    {/* Right: Product Information Module */}
                    <div className="lg:col-span-5 flex flex-col pt-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-10"
                        >
                            {/* Product Header */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                                            {product.category}
                                        </span>
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            {product.brand || 'Big Bazar'}
                                        </span>
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-full border",
                                        isOutOfStock ? 'bg-gray-50 border-gray-100 text-gray-300' : 'bg-emerald-50 border-emerald-100 text-emerald-500'
                                    )}>
                                        <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isOutOfStock ? 'bg-gray-300' : 'bg-emerald-500')} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">
                                            {isOutOfStock ? 'Archived' : 'In Stock'}
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-snug font-playfair">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-6 mb-8">
                                    <button
                                        onClick={() => { setActiveTab('reviews'); document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' }); }}
                                        className="flex items-center gap-2 group transition-all"
                                    >
                                        <div className="flex items-center text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">
                                            {product.reviewCount} Reviews
                                        </span>
                                    </button>
                                    <div className="h-4 w-px bg-gray-200" />
                                    <span className="text-xs text-gray-400">SKU: {product.sku}</span>
                                </div>

                                <div className="flex items-center gap-6 mb-10">
                                    <span className="text-4xl font-bold text-gray-900 tracking-tight">
                                        {formatPrice(currentPrice, language)}
                                    </span>
                                    {product.salePrice && (
                                        <div className="flex flex-col">
                                            <span className="text-lg text-gray-300 line-through font-bold font-mono">
                                                {formatPrice(product.basePrice, language)}
                                            </span>
                                            <Badge variant="destructive" className="bg-rose-500 text-white text-[9px] font-black rounded-lg px-2 py-0.5 w-fit">
                                                -{discountPercentage}%
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-500 leading-relaxed text-lg font-medium font-serif italic max-w-md">
                                    "{product.shortDescription || product.description?.slice(0, 150)}..."
                                </p>
                            </div>

                            {/* Product Options */}
                            <div className="space-y-8 pt-8 border-t border-gray-100">

                                {/* Variant Selection */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Variant</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.variants.map((variant) => (
                                                <button
                                                    key={variant.id}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    className={cn(
                                                        "px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border",
                                                        selectedVariant?.id === variant.id
                                                            ? "bg-foreground text-white border-foreground shadow-md"
                                                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                                                    )}
                                                >
                                                    {variant.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity & Actions */}
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</h3>
                                        <span className="text-xs text-gray-400">Max: 10</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch gap-6">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-2 border border-gray-100">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-black transition-all border border-gray-100"
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center font-black text-xl text-gray-900 font-mono">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-black transition-all border border-gray-100"
                                                disabled={quantity >= 10}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Primary Actions */}
                                        <div className="flex-1 flex gap-3">
                                            <Button
                                                onClick={handleAddToCart}
                                                disabled={isOutOfStock || isAdding}
                                                className="flex-1 h-14 bg-luxury-gold text-luxury-black hover:bg-white rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 transition-all shadow-lg shadow-luxury-gold/10"
                                            >
                                                {isAdding ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <ShoppingBag className="h-4 w-4" />
                                                )}
                                                {t?.common?.addToCart || 'Add to Cart'}
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    handleAddToCart();
                                                    router.push('/checkout');
                                                }}
                                                disabled={isOutOfStock}
                                                className="flex-1 h-14 bg-black text-white hover:bg-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-black/10"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                                {t?.common?.orderNow || 'Order Now'}
                                            </Button>
                                        </div>

                                        {/* Secondary Actions */}
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => toggleWishlist(product as any)}
                                                className={cn(
                                                    "h-16 w-16 p-0 rounded-2xl border-gray-100 transition-all",
                                                    isInWishlist(product.id)
                                                        ? "bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-500/20"
                                                        : "hover:border-black hover:text-black"
                                                )}
                                            >
                                                <Heart className={cn("h-5 w-5", isInWishlist(product.id) && "fill-current")} />
                                            </Button>
                                            <SocialShare 
                                                url={typeof window !== 'undefined' ? window.location.href : ''} 
                                                title={product.name} 
                                                className="h-16 w-16 p-0 rounded-2xl border-gray-100 transition-all hover:border-black hover:text-black flex items-center justify-center border"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Feature Badges */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all duration-300">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-900">Fast Delivery</h4>
                                            <p className="text-[10px] text-gray-400">Same Day Dispatch</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all duration-300">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-900">Secure Payment</h4>
                                            <p className="text-[10px] text-gray-400">100% Verified</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div id="product-tabs" className="mb-24 pt-12 border-t border-gray-100">
                    <div className="flex items-center gap-8 border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "pb-5 text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap",
                                    activeTab === tab.id ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-5xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="min-h-[400px]"
                            >
                                {activeTab === 'description' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <h4 className="text-2xl font-bold text-gray-900 font-playfair">About This Product</h4>
                                            <div className="prose prose-sm text-gray-500 font-medium leading-relaxed max-w-none">
                                                <p className="text-base leading-relaxed mb-4">
                                                    {product.description}
                                                </p>
                                                <p className="text-gray-400">
                                                    Crafted with care and designed for everyday wear. Quality you can feel, comfort you can trust.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">Key Features</h5>
                                            <ul className="space-y-4">
                                                {[
                                                    "Premium Quality Material",
                                                    "Comfortable Fit",
                                                    "Durable Construction",
                                                    "Easy Care Instructions"
                                                ].map((feat, i) => (
                                                    <li key={i} className="flex items-center gap-3">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                        <span className="text-sm font-medium text-gray-700">{feat}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'specifications' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {(product as any).attributes?.map((attr: any) => (
                                            <div key={attr.key} className="flex flex-col gap-1.5 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{attr.key}</span>
                                                <span className="text-sm font-bold text-gray-900">{attr.value}</span>
                                            </div>
                                        ))}
                                        {(!(product as any).attributes || (product as any).attributes.length === 0) && (
                                            <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                <ClipboardList className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                                                <p className="text-gray-400 font-medium text-sm">No specifications available</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="bg-white rounded-3xl">
                                        <ProductReviews averageRating={product.rating} reviewCount={product.reviewCount} />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Related Products */}
                <div className="pt-12 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 font-playfair">You May Also Like</h3>
                            <p className="text-sm text-gray-400 mt-1">More from this category</p>
                        </div>
                        <Link href="/products" className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-foreground transition-all">
                            View All Products
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <RelatedProducts products={relatedProducts} />
                </div>
            </div>
            
        </div>
    );
}
