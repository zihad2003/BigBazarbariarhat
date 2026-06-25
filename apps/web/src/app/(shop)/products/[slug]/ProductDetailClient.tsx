'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Star,
    ShoppingBag,
    Heart,
    Truck,
    Plus,
    Minus,
    ArrowRight,
    ShieldCheck,
    Check,
    Info,
    PlayCircle,
    ClipboardList,
    MessageSquare,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductGallery } from '@/components/shop/product-gallery';
import { Breadcrumbs } from '@/components/shop/breadcrumbs';
import { SocialShare } from '@/components/shop/social-share';
import { ProductReviews } from '@/components/shop/product-reviews';
import { RelatedProducts } from '@/components/shop/related-products';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { formatPrice, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { productVariantsJsonSchema } from '@bigbazar/validation';

interface ProductDetailClientProps {
    product: any;
    relatedProducts: any[];
}

function ProductDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <Skeleton className="aspect-[4/5] w-full bg-gray-50 rounded-[3rem]" />
                <div className="space-y-10 py-10">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32 bg-gray-100 rounded-full" />
                        <Skeleton className="h-16 w-full bg-gray-100 rounded-[1.5rem]" />
                        <Skeleton className="h-10 w-1/3 bg-gray-100 rounded-xl" />
                    </div>
                    <Skeleton className="h-40 w-full bg-gray-50 rounded-[2rem]" />
                </div>
            </div>
        </div>
    );
}

export default function ProductDetailClient({
    product,
    relatedProducts
}: ProductDetailClientProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { language } = useLanguageStore();
    const t = useTranslation();
    const router = useRouter();

    // UI State
    const [activeTab, setActiveTab] = useState('description');
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
    const [selectedSize, setSelectedSize] = useState<any | null>(null);
    const [selectedColor, setSelectedColor] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Stores
    const addItem = useCartStore((state) => state.addItem);
    const toggleWishlist = useWishlistStore((state) => state.toggleItem);
    const isInWishlist = useWishlistStore((state) => state.isInWishlist);
    const { openCart, addNotification } = useUIStore();

    const validatedVariants = useMemo(() => {
        if (!product?.variants) return null;
        const result = productVariantsJsonSchema.safeParse(product.variants);
        if (!result.success) {
            console.error('Invalid product variants format:', result.error);
            return null;
        }
        return product.variants;
    }, [product]);

    const sizes = useMemo(() => {
        if (!validatedVariants) return [];
        // Check if new structured variants object
        if (typeof validatedVariants === 'object' && !Array.isArray(validatedVariants)) {
            if (Array.isArray((validatedVariants as any).sizes)) {
                return (validatedVariants as any).sizes.map((s: string) => ({ name: s }));
            }
            return [];
        }
        // Legacy flat array
        if (Array.isArray(validatedVariants)) {
            return validatedVariants.filter((v: any) => !v.hex) || [];
        }
        return [];
    }, [validatedVariants]);

    const colors = useMemo(() => {
        if (!validatedVariants) return [];
        // Check if new structured variants object
        if (typeof validatedVariants === 'object' && !Array.isArray(validatedVariants)) {
            if (Array.isArray((validatedVariants as any).colors)) {
                return (validatedVariants as any).colors.map((c: any) => ({ name: c.name, hex: c.hex }));
            }
            return [];
        }
        // Legacy flat array
        if (Array.isArray(validatedVariants)) {
            return validatedVariants.filter((v: any) => v.hex) || [];
        }
        return [];
    }, [validatedVariants]);

    useEffect(() => {
        if (product) {
            setSelectedSize(null);
            setSelectedColor(null);
            setError(null);
        }
    }, [product]);

    const handleAddToCart = async (directCheckout = false) => {
        if (!product) return;

        if (sizes.length > 0 && !selectedSize) {
            setError(language === 'bn' ? 'অনুগ্রহ করে একটি সাইজ সিলেক্ট করুন' : 'Please select a size');
            addNotification({
                type: 'error',
                message: language === 'bn' ? 'অনুগ্রহ করে একটি সাইজ সিলেক্ট করুন' : 'Please select a size'
            });
            return;
        }
        if (colors.length > 0 && !selectedColor) {
            setError(language === 'bn' ? 'অনুগ্রহ করে একটি কালার সিলেক্ট করুন' : 'Please select a color');
            addNotification({
                type: 'error',
                message: language === 'bn' ? 'অনুগ্রহ করে একটি কালার সিলেক্ট করুন' : 'Please select a color'
            });
            return;
        }

        setError(null);
        setIsAdding(true);

        const variantLabel = [selectedColor?.name, selectedSize?.name].filter(Boolean).join(' / ');

        addItem({
            productId: product.id,
            name: product.name,
            price: product.salePrice ?? product.price,
            image: product.images?.[0] ?? '',
            quantity,
            variant: variantLabel || undefined,
            stock: product.stock,
        });
        setIsAdding(false);

        if (directCheckout) {
            router.push('/checkout');
        } else {
            addNotification({
                type: 'success',
                message: language === 'bn'
                    ? `${product.name} (${variantLabel || 'ডিফল্ট'}) কার্টে যোগ করা হয়েছে।`
                    : `${product.name} (${variantLabel || 'Default'}) added to cart.`
            });
            openCart();
        }
    };

    const currentPrice = selectedVariant?.priceAdjustment
        ? (product.salePrice || product.price) + selectedVariant.priceAdjustment
        : (product.salePrice || product.price);

    const discountPercentage = product.salePrice
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    const isOutOfStock = product.stock <= 0;

    const tabs = [
        { id: 'description', label: 'Description', icon: Info },
        ...(product.instagramReelUrl ? [{ id: 'video', label: 'Product Video', icon: PlayCircle }] : []),
        { id: 'specifications', label: 'Specifications', icon: ClipboardList },
        { id: 'reviews', label: `Reviews (${product.reviewCount || 0})`, icon: MessageSquare },
    ];

    if (!mounted) {
        return <ProductDetailSkeleton />;
    }

    return (
        <div className="bg-white min-h-screen overflow-x-hidden w-full relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12 w-full relative overflow-x-hidden">

                <Breadcrumbs
                    items={[
                        { label: t?.common?.products || 'Products', href: '/products' },
                        { label: product.category?.name || 'Category', href: `/products?category=${product.category?.slug}` },
                        { label: product.name, active: true }
                    ]}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 w-full overflow-x-hidden">

                    <div className="lg:col-span-6">
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

                    <div className="lg:col-span-6 flex flex-col w-full max-w-full overflow-x-hidden">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6 w-full"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                                            {product.category?.name || 'Product'}
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

                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-snug font-playfair">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-4 mb-4">
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
                                            {product.reviewCount || 0} Reviews
                                        </span>
                                    </button>
                                    <div className="h-4 w-px bg-gray-200" />
                                    <span className="text-xs text-gray-400">SKU: {product.sku}</span>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-3xl font-bold text-gray-900 tracking-tight">
                                        {formatPrice(currentPrice, language)}
                                    </span>
                                    {product.salePrice && (
                                        <div className="flex flex-col">
                                            <span className="text-base text-gray-300 line-through font-bold font-mono">
                                                {formatPrice(product.price, language)}
                                            </span>
                                            <Badge variant="destructive" className="bg-rose-500 text-white text-[9px] font-black rounded-lg px-2 py-0.5 w-fit">
                                                -{discountPercentage}%
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-500 leading-relaxed text-sm font-medium font-serif italic max-w-md">
                                    "{product.shortDescription || product.description?.slice(0, 150)}..."
                                </p>
                            </div>

                            <div className="space-y-6 pt-5 border-t border-gray-100">
                                {sizes.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Select Size</h3>
                                            {selectedSize && (
                                                <span className="text-xs text-primary font-bold">Selected: {selectedSize.name}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {sizes.map((size: any) => (
                                                <button
                                                    key={size.name}
                                                    type="button"
                                                    onClick={() => { setSelectedSize(size); setError(null); }}
                                                    className={cn(
                                                        "h-12 min-w-12 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-center cursor-pointer",
                                                        selectedSize?.name === size.name
                                                            ? "bg-black text-white border-black shadow-md scale-105"
                                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                                    )}
                                                >
                                                    {size.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {colors.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Select Color</h3>
                                            {selectedColor && (
                                                <span className="text-xs text-primary font-bold">Selected: {selectedColor.name}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {colors.map((color: any) => (
                                                <button
                                                    key={color.name}
                                                    type="button"
                                                    onClick={() => { setSelectedColor(color); setError(null); }}
                                                    className={cn(
                                                        "group relative h-11 px-4 rounded-full text-xs font-bold transition-all border flex items-center gap-2.5 cursor-pointer",
                                                        selectedColor?.name === color.name
                                                            ? "border-black bg-gray-50 shadow-sm scale-105 text-black"
                                                            : "border-gray-200 bg-white hover:border-gray-400 text-gray-600"
                                                    )}
                                                >
                                                    {color.hex && (
                                                        <span
                                                            className="w-5 h-5 rounded-full border border-black/10 shrink-0 block shadow-inner"
                                                            style={{ backgroundColor: color.hex }}
                                                        />
                                                    )}
                                                    <span>{color.name}</span>
                                                    {selectedColor?.name === color.name && (
                                                        <Check className="h-4 w-4 text-black shrink-0" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold animate-pulse">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</h3>
                                        <span className="text-xs text-gray-400">Max: 10</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1.5 border border-gray-100 self-start sm:self-auto">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-400 hover:text-black transition-all border border-gray-100 cursor-pointer"
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <span className="w-8 text-center font-black text-lg text-gray-900 font-mono">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-400 hover:text-black transition-all border border-gray-100 cursor-pointer"
                                                disabled={quantity >= 10}
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        <div className="flex-1 flex gap-2">
                                            <Button
                                                onClick={() => handleAddToCart(false)}
                                                disabled={isOutOfStock || isAdding}
                                                className="flex-1 h-12 bg-luxury-gold text-luxury-black hover:bg-white hover:text-luxury-black rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 transition-all shadow-lg shadow-luxury-gold/10 cursor-pointer"
                                            >
                                                {isAdding ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <ShoppingBag className="h-4 w-4" />
                                                )}
                                                {t?.common?.addToCart || 'Add to Cart'}
                                            </Button>

                                            <Button
                                                onClick={() => handleAddToCart(true)}
                                                disabled={isOutOfStock || isAdding}
                                                className="flex-1 h-12 bg-black text-white hover:bg-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-black/10 cursor-pointer"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                                {t?.common?.orderNow || 'Order Now'}
                                            </Button>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => toggleWishlist(product as any)}
                                                className={cn(
                                                    "h-12 w-12 p-0 rounded-xl border-gray-100 transition-all cursor-pointer",
                                                    isInWishlist(product.id)
                                                        ? "bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-500/20"
                                                        : "hover:border-black hover:text-black"
                                                )}
                                            >
                                                <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-current")} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 mt-4">
                                    <SocialShare
                                        url={typeof window !== 'undefined' ? window.location.href : ''}
                                        title={product.name}
                                        className="mt-0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all duration-300">
                                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                                        <Truck className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">Fast Delivery</h4>
                                        <p className="text-[10px] text-gray-400">Same Day Dispatch</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all duration-300">
                                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">Secure Payment</h4>
                                        <p className="text-[10px] text-gray-400">100% Verified</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

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
                                        {/* Render attributes if they exist */}
                                        {product.attributes?.map((attr: any) => (
                                            <div key={attr.key} className="flex flex-col gap-1.5 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{attr.key}</span>
                                                <span className="text-sm font-bold text-gray-900">{attr.value}</span>
                                            </div>
                                        ))}

                                        {/* Render structured clothing variants info (Fabric & Care) */}
                                        {product.variants && typeof product.variants === 'object' && !Array.isArray(product.variants) && (
                                            <>
                                                {product.variants.fabric && (
                                                    <div className="flex flex-col gap-1.5 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fabric / উপাদান</span>
                                                        <span className="text-sm font-bold text-gray-900">{product.variants.fabric}</span>
                                                    </div>
                                                )}
                                                {product.variants.care && (
                                                    <div className="flex flex-col gap-1.5 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Care Instructions / যত্ন নির্দেশাবলী</span>
                                                        <span className="text-sm font-bold text-gray-900">{product.variants.care}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* Default empty state */}
                                        {(!product.attributes || product.attributes.length === 0) && (!product.variants || Array.isArray(product.variants) || (!product.variants.fabric && !product.variants.care)) && (
                                            <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                <ClipboardList className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                                                <p className="text-[13px] text-gray-400">No specifications listed for this product.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="bg-white rounded-3xl">
                                        <ProductReviews averageRating={product.rating} reviewCount={product.reviewCount} />
                                    </div>
                                )}

                                {activeTab === 'video' && product.instagramReelUrl && (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <div className="w-full max-w-sm overflow-hidden rounded-[2rem] shadow-2xl border border-gray-100 bg-gray-50 aspect-[9/16] relative">
                                            <iframe
                                                src={(() => {
                                                    const baseUrl = product.instagramReelUrl.split('?')[0];
                                                    return baseUrl.endsWith('/') ? `${baseUrl}embed/` : `${baseUrl}/embed/`;
                                                })()}
                                                className="absolute inset-0 w-full h-full"
                                                frameBorder="0"
                                                scrolling="no"
                                                allowTransparency={true}
                                                allow="encrypted-media"
                                                title="Instagram Reel"
                                            />
                                        </div>
                                        <p className="mt-6 text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <PlayCircle className="w-4 h-4" /> Watch the product in action
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

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
