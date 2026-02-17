'use client';

import { useState, useEffect, use } from 'react';
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
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, ProductsService } from '@bigbazar/shared';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';
import type { Product, ProductVariant } from '@bigbazar/shared';
import { ProductGallery } from '@/components/shop/product-gallery';
import { SocialShare } from '@/components/shop/social-share';
import { ProductReviews } from '@/components/shop/product-reviews';
import { RelatedProducts } from '@/components/shop/related-products';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { formatPrice, cn } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    const addItem = useCartStore((state) => state.addItem);
    const toggleWishlist = useWishlistStore((state) => state.toggleItem);
    const isInWishlist = useWishlistStore((state) => state.isInWishlist);
    const { openCart, addNotification } = useUIStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await ProductsService.getProduct(slug);
                if (result.success && result.data) {
                    setProduct(result.data);
                    if (result.data.variants && result.data.variants.length > 0) {
                        setSelectedVariant(result.data.variants[0]);
                    }

                    if (result.data.categoryId) {
                        const related = await ProductsService.getProducts({
                            categoryId: result.data.categoryId,
                            limit: 4
                        });
                        if (related.success && related.data) {
                            setRelatedProducts(related.data.filter(p => p.id !== result.data!.id));
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
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
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Artifact Displaced</h1>
                <p className="text-gray-400 mb-10 max-w-lg mx-auto font-medium">This curator's selection is currently unavailable or has been relocated within our archive.</p>
                <Link href="/shop">
                    <Button className="rounded-2xl px-10 h-16 bg-black text-white hover:bg-gray-800 font-black uppercase tracking-widest text-xs shadow-2xl shadow-black/20">
                        Back to Collection
                    </Button>
                </Link>
            </div>
        );
    }

    const handleAddToCart = async () => {
        setIsAdding(true);
        await new Promise(resolve => setTimeout(resolve, 600));

        addItem(product, quantity, selectedVariant || undefined);
        addNotification({
            type: 'success',
            message: `${product.name} appended to curation`,
        });
        setIsAdding(false);
        openCart();
    };

    const currentPrice = selectedVariant?.priceAdjustment
        ? (product.salePrice || product.basePrice) + selectedVariant.priceAdjustment
        : (product.salePrice || product.basePrice);

    const discount = product.salePrice
        ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
        : 0;

    const isOutOfStock = product.stockQuantity <= 0;

    const tabs = [
        { id: 'description', label: 'Archetype' },
        { id: 'specifications', label: 'Coordinates' },
        { id: 'shipping', label: 'Logistics' },
        { id: 'reviews', label: `Reviews (${product.reviewCount})` },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">

                {/* Visual Navigation Header */}
                <div className="flex items-center justify-between mb-16">
                    <Link href="/shop" className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </div>
                        Return to Gallery
                    </Link>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest hidden sm:block">Artifact Ref: BB-{product.id.slice(-6).toUpperCase()}</span>
                        <div className="h-px w-12 bg-gray-100 hidden sm:block" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">
                    {/* Visual Exposition Module */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <ProductGallery
                                images={product.images}
                                productName={product.name}
                                discount={discount}
                            />
                        </motion.div>
                    </div>

                    {/* Information Hierarchy Module */}
                    <div className="lg:col-span-5 flex flex-col pt-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-10"
                        >
                            {/* Entity Branding */}
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                                        {product.category?.name}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                        Ref / {product.brand?.name || 'Big Bazar'}
                                    </span>
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-[0.9] tracking-tighter uppercase">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-8 mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.averageRating || 0) ? 'fill-current' : 'text-gray-100'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.reviewCount} Reports</span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-100" />
                                    <div className="flex items-center gap-2">
                                        <Check className={cn("h-4 w-4", isOutOfStock ? 'text-gray-300' : 'text-emerald-500')} />
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest", isOutOfStock ? 'text-gray-300' : 'text-emerald-500')}>
                                            {isOutOfStock ? 'Archived' : 'Available'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mb-12">
                                    <span className="text-5xl font-black text-gray-900 tracking-tighter font-mono">
                                        {formatPrice(currentPrice)}
                                    </span>
                                    {product.salePrice && (
                                        <div className="flex flex-col">
                                            <span className="text-lg text-gray-300 line-through font-bold font-mono">
                                                {formatPrice(product.basePrice)}
                                            </span>
                                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                                Saving {formatPrice(product.basePrice - product.salePrice)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-500 leading-relaxed text-xl font-medium font-serif italic max-w-md">
                                    "{product.shortDescription || product.description?.slice(0, 150)}"
                                </p>
                            </div>

                            {/* Acquisition Customization */}
                            <div className="space-y-10 pt-10 border-t border-gray-100">
                                {/* Variants Protocol */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="space-y-6">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Protocol / Identification</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {product.variants.map((variant) => (
                                                <button
                                                    key={variant.id}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    className={cn(
                                                        "px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border shrink-0",
                                                        selectedVariant?.id === variant.id
                                                            ? "bg-black text-white border-black shadow-2xl shadow-black/20 scale-105"
                                                            : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
                                                    )}
                                                >
                                                    {variant.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Acquisition Controls */}
                                <div className="space-y-8">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Execution Controls</h3>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                                        <div className="flex items-center gap-8 bg-gray-50 rounded-[1.5rem] p-2 border border-gray-50 shrink-0">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-black transition-all disabled:opacity-30 border border-gray-100"
                                                disabled={isOutOfStock}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center font-black text-xl text-gray-900 font-mono">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-black transition-all border border-gray-100"
                                                disabled={isOutOfStock}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <Button
                                            onClick={handleAddToCart}
                                            disabled={isOutOfStock || isAdding}
                                            className="flex-1 h-20 bg-black text-white hover:bg-gray-800 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] gap-4 shadow-2xl shadow-black/20 relative overflow-hidden group"
                                        >
                                            <AnimatePresence mode="wait">
                                                {isAdding ? (
                                                    <motion.div key="adding" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-3">
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        Synchronizing...
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="idle" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-3">
                                                        <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                        {isOutOfStock ? 'Sold Out / Notify' : 'Append to Curation'}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => toggleWishlist(product as any)}
                                            className={cn(
                                                "h-20 w-20 p-0 rounded-[2rem] border-2 transition-all",
                                                isInWishlist(product.id)
                                                    ? "bg-rose-500 border-rose-500 text-white shadow-xl shadow-rose-500/20"
                                                    : "border-gray-100 text-gray-300 hover:border-black hover:text-black"
                                            )}
                                        >
                                            <Heart className={cn("h-6 w-6", isInWishlist(product.id) && "fill-current")} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pb-10">
                                    <div className="flex items-center gap-4 p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 group hover:bg-emerald-50 transition-colors">
                                        <Truck className="h-6 w-6 text-emerald-500" />
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Rapid Logistics</h4>
                                            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest opacity-60">24-48h Dispatch</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 group hover:bg-indigo-50 transition-colors">
                                        <RotateCcw className="h-6 w-6 text-indigo-500" />
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Authorization Guarantee</h4>
                                            <p className="text-[9px] text-indigo-600 font-black uppercase tracking-widest opacity-60">Secure Retraction</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authenticated Curator Selection</span>
                                    </div>
                                    <SocialShare url={typeof window !== 'undefined' ? window.location.href : ''} title={product.name} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Substantive Analysis Module */}
                <div className="mb-40">
                    <div className="flex items-center gap-12 border-b border-gray-100 mb-20 overflow-x-auto scrollbar-hide py-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "pb-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative",
                                    activeTab === tab.id ? "text-black" : "text-gray-300 hover:text-gray-500"
                                )}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="min-h-[400px]"
                            >
                                {activeTab === 'description' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                                        <div className="space-y-8">
                                            <h4 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">The Story Behind <br /> The Artifact.</h4>
                                            <p className="text-gray-500 text-xl font-serif italic leading-relaxed">
                                                {product.description || "Every piece in our collection is curated with a focus on exceptional craftsmanship and enduring style. This selection represents the intersection of tradition and modern innovation."}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-[5rem] group-hover:scale-110 transition-transform" />
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Architectural Highlights</h5>
                                            <ul className="space-y-6">
                                                {[
                                                    "Premium Grade Material Synthesis",
                                                    "Precision Engineered Ergonomics",
                                                    "Limited Edition Curator Batch",
                                                    "Integrated Longevity Protection"
                                                ].map((feat, i) => (
                                                    <li key={i} className="flex items-center gap-5">
                                                        <div className="h-2 w-2 rounded-full bg-black shadow-xl" />
                                                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">{feat}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'specifications' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {product.attributes?.map((attr: any) => (
                                            <div key={attr.key} className="flex flex-col gap-2 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{attr.key}</span>
                                                <span className="text-xl font-black text-gray-900 tracking-tight uppercase">{attr.value}</span>
                                            </div>
                                        ))}
                                        {(!product.attributes || product.attributes.length === 0) && (
                                            <>
                                                {[
                                                    { k: 'Material Composition', v: 'Grade A Synthesis' },
                                                    { k: 'Manufacturing Hub', v: 'Regional Central' },
                                                    { k: 'Standard Fitment', v: 'Classic Silhouette' },
                                                    { k: 'Release Batch', v: 'Curator Select v1.2' }
                                                ].map((spec, i) => (
                                                    <div key={i} className="flex flex-col gap-2 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{spec.k}</span>
                                                        <span className="text-xl font-black text-gray-900 tracking-tight uppercase">{spec.v}</span>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'shipping' && (
                                    <div className="bg-gray-900 rounded-[4rem] p-16 text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                                            <div className="space-y-8">
                                                <div className="w-16 h-16 bg-white/10 rounded-[2rem] flex items-center justify-center text-indigo-400">
                                                    <Truck className="h-8 w-8" />
                                                </div>
                                                <h4 className="text-4xl font-black uppercase tracking-tighter leading-none">Logistics <br /> Protocol.</h4>
                                                <p className="text-gray-400 text-lg">We orchestrate a secure and expedited delivery matrix to ensure your artifact arrives in pristine condition.</p>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                                                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Domestic Transit</h5>
                                                    <p className="font-bold text-lg">24-48 Hours Hub-to-Hub</p>
                                                </div>
                                                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                                                    <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Retraction Policy</h5>
                                                    <p className="font-bold text-lg">7-Day Authorization Window</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <ProductReviews averageRating={product.averageRating} reviewCount={product.reviewCount} />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Lateral Artifacts Module */}
                <div className="pt-20 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Lateral Curations</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 leading-none">Similar Artifacts from the Archive</p>
                        </div>
                        <Link href="/shop" className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-black transition-all flex items-center gap-3">
                            Full Gallery <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <RelatedProducts products={relatedProducts} />
                </div>
            </div>
        </div>
    );
}
