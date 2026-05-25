'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    Heart, 
    ShoppingBag, 
    ArrowRight, 
    ChevronLeft, 
    ChevronRight, 
    Truck, 
    RefreshCcw, 
    ShieldCheck, 
    Headphones, 
    Plus,
    Clock,
    Shirt,
    Sparkles,
    Trophy,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { DeliveryInfoModal } from '@/components/shop/delivery-info-modal';
import { cn, formatPrice } from '@/lib/utils';

// --- DATA HELPERS ---
const getHeroSlides = (t: any) => [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1800&auto=format&fit=crop',
        title: t?.hero?.slide1Title || 'New Season Collection',
        subtitle: t?.hero?.slide1Subtitle || "Women's Fashion 2026",
        cta: t?.common?.shopNow || 'Shop Now',
        href: '/women',
        videoUrl: null,
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1800&auto=format&fit=crop',
        title: t?.hero?.slide2Title || 'Premium Menswear',
        subtitle: t?.hero?.slide2Subtitle || 'Crafted for the Modern Man',
        cta: t?.common?.explore || 'Explore',
        href: '/men',
        videoUrl: null,
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1800&auto=format&fit=crop',
        title: t?.hero?.slide3Title || 'Flash Sale',
        subtitle: t?.hero?.slide3Subtitle || 'Up to 50% Off — Limited Time',
        cta: t?.common?.shopNow || 'Shop Now',
        href: '/sale',
        badge: '50% OFF',
        videoUrl: null,
    },
];

// Fallback category images — overridden by DB values
const fallbackCategoryImages: Record<string, string> = {
    'Women': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop',
    'Men': 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=500&auto=format&fit=crop',
    'Kids(Boys)': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=500&auto=format&fit=crop',
    'Kids(Girls)': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=500&auto=format&fit=crop',
    'Wedding Touch': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=500&auto=format&fit=crop',
};

const getTrustFeatures = (t: any) => [
    { icon: Truck, title: t?.features?.freeShipping || 'Free Shipping', desc: t?.features?.freeShippingDesc || 'For Mirsharai' },
    { icon: ShieldCheck, title: t?.features?.securePayment || 'Secure Payment', desc: t?.features?.securePaymentDesc || '100% secure checkout' },
    { icon: Headphones, title: t?.features?.support || '24/7 Support', desc: t?.features?.supportDesc || 'Always here to help' },
];

// Promo banners are now fetched from /api/banners (position=promo)
const defaultPromoBanners = [
    { id: '1', title: 'Summer Edit', subtitle: 'New Arrival', imageDesktop: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=800&auto=format&fit=crop', linkUrl: '/collections/summer', linkText: 'Shop Now' },
    { id: '2', title: 'Flash Sale', subtitle: '50% Off', imageDesktop: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=800&auto=format&fit=crop', linkUrl: '/sale', linkText: 'Shop Now' },
];

// --- HERO SLIDER ---
function HeroSlider({ dbBanners }: { dbBanners?: any[] }) {
    const t = useTranslation();
    const slides = dbBanners && dbBanners.length > 0
        ? dbBanners.map((b) => ({
            id: b.id,
            image: b.imageDesktop,
            videoUrl: b.videoUrl || null,
            title: b.title,
            subtitle: b.subtitle || "",
            cta: b.linkText || t?.common?.shopNow || 'Shop Now',
            href: b.linkUrl || '/products',
            badge: undefined,
        }))
        : getHeroSlides(t);
    const [current, setCurrent] = useState(0);
    const total = slides.length;
    const videoRef = useRef<HTMLVideoElement>(null);
    const isVideo = !!slides[current]?.videoUrl;

    // Auto-advance only for photo slides
    useEffect(() => {
        if (isVideo) return; // video slides advance via onEnded
        const timer = setInterval(() => setCurrent(c => (c + 1) % total), 5000);
        return () => clearInterval(timer);
    }, [total, current, isVideo]);

    // Play video from start whenever we land on a video slide
    useEffect(() => {
        if (isVideo && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
        }
    }, [current, isVideo]);

    const goNext = () => setCurrent(c => (c + 1) % total);
    const goPrev = () => setCurrent(c => (c - 1 + total) % total);

    return (
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-gray-100">
            <AnimatePresence mode="wait">
                {slides.map((slide, i) =>
                    i === current ? (
                        <motion.div
                            key={slide.id}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {slide.videoUrl ? (
                                /* --- VIDEO SLIDE --- */
                                <>
                                    <video
                                        ref={videoRef}
                                        src={slide.videoUrl}
                                        className="absolute inset-0 w-full h-full object-cover object-center"
                                        autoPlay
                                        muted
                                        playsInline
                                        onEnded={goNext}
                                    />
                                    {/* Video indicator badge */}
                                    <div className="absolute top-4 right-16 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        Video
                                    </div>
                                </>
                            ) : (
                                /* --- IMAGE SLIDE --- */
                                <Image
                                    src={slide.image || '/placeholder.png'}
                                    alt={slide.title}
                                    fill
                                    className="object-cover object-top"
                                    quality={95}
                                    priority
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
                                {slide.badge && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-block mb-4 text-xs font-black uppercase tracking-[0.3em] bg-destructive text-white px-4 py-1.5 w-fit"
                                    >
                                        {slide.badge}
                                    </motion.span>
                                )}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl md:text-6xl lg:text-7xl font-playfair font-black text-white leading-tight mb-3"
                                >
                                    {slide.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-white/80 text-sm md:text-lg uppercase tracking-widest mb-8"
                                >
                                    {slide.subtitle}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link href={slide.href}>
                                        <Button
                                            className="bg-white text-foreground hover:bg-destructive hover:text-white uppercase tracking-widest font-bold px-8 py-3 rounded-none text-sm transition-all duration-300"
                                        >
                                            {slide.cta}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : null
                )}
            </AnimatePresence>

            {/* Arrow Buttons */}
            <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white text-white hover:text-foreground backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                aria-label="Previous"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white text-white hover:text-foreground backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                aria-label="Next"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((slide, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

// --- PRODUCT CARD (Minimal, Aarong-style) ---
function ProductCard({ product, index }: { product: any; index: number }) {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const { addNotification } = useUIStore();
    const router = useRouter();

    const firstImage = product.images?.[0];
    const resolvedImage = typeof firstImage === 'string' 
        ? firstImage 
        : (firstImage && typeof firstImage === 'object' && 'url' in firstImage 
            ? (firstImage as any).url 
            : (product.image || '/placeholder.png'));

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.slug || product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-gray-100 mb-3 border border-gray-100/50">
                    <Image
                        src={resolvedImage}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        quality={90}
                    />
                    {(product.salePrice || product.isFlashSale) && (
                        <span className="absolute top-2 left-2 bg-destructive text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 z-10 shadow-lg">
                            {product.isFlashSale ? 'Flash Sale' : 'Sale'}
                        </span>
                    )}
                    {/* Wishlist */}
                    <button
                        className={`absolute top-2 right-2 w-8 h-8 bg-white flex items-center justify-center transition-all duration-200 shadow-sm ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        aria-label="Add to wishlist"
                    >
                        <Heart className="h-4 w-4 text-foreground hover:text-destructive transition-colors" />
                    </button>

                    {/* Quick Add */}
                    <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                        <button
                            onClick={(e) => { 
                                e.preventDefault(); 
                                addItem({
                                    productId: product.id,
                                    name: product.name,
                                    price: product.salePrice ?? product.price,
                                    image: resolvedImage,
                                    quantity: 1,
                                    stock: 100,
                                });
                                addNotification({ type: 'success', message: `${product.name} added to cart` });
                                router.push('/cart');
                            }}
                            className="w-full bg-foreground text-white text-[10px] uppercase tracking-widest font-bold py-3 flex items-center justify-center gap-2 hover:bg-destructive transition-colors"
                        >
                            <ShoppingBag className="h-3 w-3" />
                            {t.common.addToCart}
                        </button>
                    </div>
                </div>
            </Link>

            <div className="space-y-3">
                <Link href={`/products/${product.slug || product.id}`}>
                    <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-destructive transition-colors min-h-[2.5rem] line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">({product.rating || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                    {product.salePrice ? (
                        <>
                            <span className="font-bold text-destructive text-sm">{formatPrice(product.salePrice, language)}</span>
                            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price, language)}</span>
                        </>
                    ) : (
                        <span className="font-bold text-foreground text-sm">{formatPrice(product.price, language)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// --- FLASH SALE COMPONENT ---
function FlashSaleSection({ products }: { products: any[] }) {
    const t = useTranslation();
    const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.s > 0) return { ...prev, s: prev.s - 1 };
                if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
                if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Smooth continuous auto-scrolling marquee logic
    useEffect(() => {
        if (!products.length) return;

        let animationFrameId: number;

        const animate = () => {
            if (scrollContainerRef.current && !isPaused) {
                const container = scrollContainerRef.current;
                
                // Increment scroll position smoothly (0.75px per frame at 60Hz)
                container.scrollLeft += 0.75;

                // Loop back when reaching the end
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                    container.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
        };
    }, [products, isPaused]);

    const handleTouchStart = () => {
        setIsPaused(true);
        if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };

    const handleTouchEnd = () => {
        if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
        }, 3000); // Resume auto-scrolling after 3 seconds of inactivity
    };



    if (!products.length) return null;

    return (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-8 md:my-16">
            <div 
                className="bg-destructive/5 py-12 px-4 md:py-16 md:px-12 rounded-[2.5rem] overflow-hidden relative border border-destructive/10"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                    <div className="flex items-center gap-6">
                        <div className="bg-destructive text-white p-4 rounded-3xl shadow-xl shadow-destructive/20 animate-pulse">
                            <Clock className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter leading-none mb-2">Flash Sale</h2>
                            <p className="text-destructive font-black text-xs uppercase tracking-[0.3em]">Limited Time Offer</p>
                        </div>
                    </div>
                    
                    {/* Timer and Controls */}
                    <div className="flex items-center gap-8">
                        <div className="flex gap-4">
                            {[
                                { val: timeLeft.h, label: 'Hours' },
                                { val: timeLeft.m, label: 'Min' },
                                { val: timeLeft.s, label: 'Sec' }
                            ].map((t, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white border-2 border-destructive/20 rounded-2xl flex items-center justify-center text-2xl font-black text-destructive shadow-sm">
                                        {t.val.toString().padStart(2, '0')}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest mt-2 text-destructive/60">{t.label}</span>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>

                {/* Horizontal Sliding Container with smooth native swiping */}
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 md:gap-8 pb-12 px-2 snap-x snap-mandatory scrollbar-none scroll-smooth [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {products.map((p, i) => (
                        <div 
                            key={p.id} 
                            className="min-w-[75%] sm:min-w-[45%] md:min-w-[22%] snap-start flex-shrink-0"
                        >
                            <ProductCard product={p} index={i} />
                            <div className="mt-4 bg-gray-100 h-1 md:h-1.5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '65%' }}
                                    className="bg-destructive h-full"
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                            </div>
                            <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest mt-1.5 text-muted-foreground flex justify-between">
                                <span>65% Reserved</span>
                                <span>12 Left</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* Mobile Drag/Swipe Indicator */}
                <div className="flex md:hidden justify-center items-center gap-1.5 mt-2">
                    <span className="text-[9px] font-black text-destructive/40 uppercase tracking-widest animate-pulse">Swipe Left/Right to explore</span>
                </div>
            </div>
        </section>
    );
}

// --- MAIN PAGE ---
export default function HomePage() {
    const t = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [heroBanners, setHeroBanners] = useState<any[]>([]);
    const [promoBanners, setPromoBanners] = useState<any[]>(defaultPromoBanners);
    const [newArrivals, setNewArrivals] = useState<any[]>([]);
    const [flashProducts, setFlashProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        const fetchData = async () => {
            try {
                const [newRes, flashRes, catRes, heroRes, secondaryRes] = await Promise.all([
                    fetch('/api/products?limit=8&sort=newest').then(res => res.json()),
                    fetch('/api/products/featured?limit=5').then(res => res.json()),
                    fetch('/api/categories').then(res => res.json()),
                    fetch('/api/banners?position=HOME_HERO').then(res => res.json()).catch(() => ({ success: false })),
                    fetch('/api/banners?position=HOME_SECONDARY').then(res => res.json()).catch(() => ({ success: false })),
                ]);
                if (newRes.success) setNewArrivals(newRes.data);
                if (flashRes.success) setFlashProducts(flashRes.data);
                
                // Map DB categories to homepage category tiles
                if (catRes.success && catRes.data && catRes.data.length > 0) {
                    const mapped = catRes.data.map((cat: any) => ({
                        key: cat.slug,
                        name: cat.name,
                        href: `/products?category=${encodeURIComponent(cat.name)}`,
                        image: cat.image || fallbackCategoryImages[cat.name] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop',
                        comingSoon: false,
                        count: cat._count?.products || 0,
                    }));
                    setCategories(mapped);
                }

                // Map DB Hero banners
                if (heroRes.success && heroRes.data && heroRes.data.length > 0) {
                    setHeroBanners(heroRes.data);
                }

                // Map DB banners for promo section
                if (secondaryRes.success && secondaryRes.data && secondaryRes.data.length > 0) {
                    setPromoBanners(secondaryRes.data);
                }
            } catch (error) {
                console.error('Failed to fetch homepage data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-white text-foreground">

            {/* 1. HERO BANNER SLIDER */}
            <HeroSlider dbBanners={heroBanners} />

            {/* 2. CATEGORY STRIP — Cynx-inspired Premium Rounded Cards with Overlay & Hover Animation */}
            <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-5xl font-playfair font-black text-foreground uppercase tracking-tight mb-3">
                        {t.categories.title}
                    </h2>
                    <div className="w-16 h-1 bg-destructive mx-auto mb-4" />
                    <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-[0.2em]">
                        Explore our curated collections crafted with excellence
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.key}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href={cat.href} className="group block relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gray-100 border border-gray-100/50 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                                    quality={85}
                                />
                                {/* Elegant gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Hover interactive ring/border */}
                                <div className="absolute inset-4 rounded-[1.5rem] border border-white/0 group-hover:border-white/20 transition-all duration-500 scale-95 group-hover:scale-100" />

                                {/* Category Information */}
                                <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col z-10">
                                    <span className="text-lg md:text-xl font-bold font-playfair uppercase tracking-wide group-hover:text-yellow-400 transition-colors duration-300">
                                        {cat.name}
                                    </span>
                                    <div className="h-0 group-hover:h-5 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100 mt-1 flex items-center justify-between">
                                        <span className="text-[10px] text-white/70 font-black uppercase tracking-widest">
                                            {cat.count === 1 ? '1 Item' : `${cat.count || 0} Items`}
                                        </span>
                                        <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                            Explore
                                            <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-white/50 font-medium uppercase tracking-widest mt-1.5 group-hover:opacity-0 transition-opacity duration-300">
                                        {cat.count === 1 ? '1 Item' : `${cat.count || 0} Items`}
                                    </span>
                                </div>

                                {cat.comingSoon && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                                        <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-none shadow-lg">
                                            Coming Soon
                                        </span>
                                    </div>
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* DIVIDER */}
            <div className="max-w-7xl mx-auto px-4"><div className="border-t border-gray-100" /></div>

            {/* 3. NEW ARRIVALS GRID */}
            <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground uppercase tracking-wider">
                            {t.newArrivals.title}
                        </h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                            {t.newArrivals.subtitle}
                        </p>
                    </div>
                    <Link href="/new-arrivals" className="text-xs font-bold uppercase tracking-widest text-foreground border-b border-foreground hover:text-destructive hover:border-destructive transition-colors pb-0.5 flex items-center gap-1">
                        {t.common.viewAll}
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                    {newArrivals.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </section>

            {/* 4. PROMO BANNERS (2-column) */}
            <section className="max-w-7xl mx-auto px-4 pb-10 md:pb-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {promoBanners.map((banner, i) => (
                        <Link key={banner.id || i} href={banner.linkUrl || '/shop'} className="group block relative h-[250px] md:h-[320px] overflow-hidden">
                            <Image
                                src={banner.imageDesktop || '/placeholder.png'}
                                alt={banner.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                quality={90}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-white/70 block mb-1">{banner.subtitle}</span>
                                <h3 className="text-2xl md:text-3xl font-playfair font-black">{banner.title}</h3>
                                <div className="flex items-center gap-2 mt-2 text-xs uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                                    <span>{banner.linkText || t.common.shopNow}</span>
                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>



            {/* 6. FLASH SALE SECTION */}
            <FlashSaleSection products={flashProducts} />




        </main>
    );
}
