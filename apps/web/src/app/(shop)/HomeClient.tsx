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
    Clock,
    Sparkles,
    Gift,
    Crown,
    ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { t as getTranslation } from '@/lib/i18n/translations';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn, formatPrice } from '@/lib/utils';

// --- DATA HELPERS ---
const fallbackCategoryImages: Record<string, string> = {
    'Women': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop',
    'Men': 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=500&auto=format&fit=crop',
    'Kids(Boys)': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=500&auto=format&fit=crop',
    'Kids(Girls)': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=500&auto=format&fit=crop',
    'Wedding Touch': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=500&auto=format&fit=crop',
};

// --- HERO SLIDER ---
function HeroSlider({ dbBanners }: { dbBanners?: any[] }) {
    const t = useTranslation();
    const slides = dbBanners && dbBanners.length > 0
        ? dbBanners.map((b) => ({
            id: b.id,
            image: b.imageDesktop,
            videoUrl: b.videoUrl || null,
            title: b.title,
            subtitle: b.subtitle || '',
            cta: b.linkText || t?.common?.shopNow || 'Shop Now',
            href: b.linkUrl || '/products',
            badge: undefined,
        }))
        : [
            {
                id: 1,
                image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=1800&auto=format&fit=crop',
                title: t?.hero?.slide1Title || 'Elegance Redefined',
                subtitle: t?.hero?.slide1Subtitle || 'Discover a curated collection of artisanal sarees and designer lehengas, where heritage craftsmanship meets modern silhouettes.',
                cta: t?.common?.shopNow || 'Shop Collection',
                href: '/products?category=wedding-touch',
                badge: 'The New Heritage',
                videoUrl: null,
            },
            {
                id: 2,
                image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop',
                title: t?.hero?.slide2Title || 'Premium Menswear',
                subtitle: t?.hero?.slide2Subtitle || 'Crafted for the Modern Man',
                cta: t?.common?.explore || 'Explore Collection',
                href: '/products?category=men',
                badge: 'Premium Menswear',
                videoUrl: null,
            },
            {
                id: 3,
                image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
                title: t?.hero?.slide3Title || 'Flash Sale',
                subtitle: t?.hero?.slide3Subtitle || 'Up to 50% Off — Limited Time Only',
                cta: t?.common?.shopNow || 'Shop Sale',
                href: '/sale',
                badge: 'Flash Sale — 50% Off',
                videoUrl: null,
            },
        ];

    const [current, setCurrent] = useState(0);
    const total = slides.length;
    const videoRef = useRef<HTMLVideoElement>(null);
    const isVideo = !!slides[current]?.videoUrl;

    useEffect(() => {
        if (isVideo) return;
        const timer = setInterval(() => setCurrent(c => (c + 1) % total), 6000);
        return () => clearInterval(timer);
    }, [total, current, isVideo]);

    useEffect(() => {
        if (isVideo && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => { });
        }
    }, [current, isVideo]);

    const goNext = () => setCurrent(c => (c + 1) % total);
    const goPrev = () => setCurrent(c => (c - 1 + total) % total);

    return (
        <div className="relative w-full h-[65vh] md:h-[88vh] overflow-hidden bg-neutral-900">
            <AnimatePresence mode="wait">
                {slides.map((slide, i) =>
                    i === current ? (
                        <motion.div
                            key={slide.id}
                            className="absolute inset-0"
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.9 }}
                        >
                            {slide.videoUrl ? (
                                <video
                                    ref={videoRef}
                                    src={slide.videoUrl}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    autoPlay muted playsInline onEnded={goNext}
                                />
                            ) : (
                                <Image
                                    src={slide.image || '/placeholder.png'}
                                    alt={slide.title}
                                    fill className="object-cover object-center"
                                    quality={95} priority
                                />
                            )}
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-20 max-w-3xl z-10">
                                {slide.badge && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-block mb-5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 rounded-lg w-fit"
                                    >
                                        {slide.badge}
                                    </motion.span>
                                )}
                                <motion.h1
                                    initial={{ opacity: 0, y: 22 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-playfair font-normal text-white leading-[1.08] mb-5 tracking-tight"
                                >
                                    {slide.title.includes(' ') ? (
                                        <>
                                            {slide.title.substring(0, slide.title.lastIndexOf(' '))} <br />
                                            <span className="text-emerald-400 font-bold italic">
                                                {slide.title.substring(slide.title.lastIndexOf(' ') + 1)}
                                            </span>
                                        </>
                                    ) : (
                                        slide.title
                                    )}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 22 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-white/70 text-sm md:text-base mb-8 leading-relaxed max-w-md font-light"
                                >
                                    {slide.subtitle}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 22 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link href={slide.href}>
                                        <button className="group inline-flex items-center gap-3 px-8 py-3.5 bg-white text-neutral-900 hover:bg-emerald-400 hover:text-white font-black uppercase tracking-widest text-[11px] rounded-xl transition-all duration-300 shadow-xl shadow-black/20">
                                            {slide.cta}
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : null
                )}
            </AnimatePresence>

            {/* Nav arrows */}
            <button onClick={goPrev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-neutral-900 backdrop-blur-sm flex items-center justify-center rounded-xl transition-all z-20 border border-white/20">
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={goNext} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-neutral-900 backdrop-blur-sm flex items-center justify-center rounded-xl transition-all z-20 border border-white/20">
                <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>

        </div>
    );
}



// --- SECTION HEADER ---
function SectionHeader({ label, title, viewAllHref }: { label?: string; title: string; viewAllHref?: string }) {
    return (
        <div className="flex items-end justify-between mb-10">
            <div>
                {label && (
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 block mb-2">{label}</span>
                )}
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-neutral-900 tracking-tight">{title}</h2>
            </div>
            {viewAllHref && (
                <Link href={viewAllHref} className="group inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors border-b border-neutral-200 hover:border-neutral-900 pb-0.5">
                    View All <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            )}
        </div>
    );
}

// --- PRODUCT CARD ---
function ProductCard({ product, index }: { product: any; index: number }) {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const toggleWishlist = useWishlistStore((state) => state.toggleItem);
    const inWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
    const addItem = useCartStore((state) => state.addItem);
    const { addNotification } = useUIStore();
    const router = useRouter();

    const firstImage = product.images?.[0];
    let resolvedImage = typeof firstImage === 'string'
        ? firstImage
        : (firstImage && typeof firstImage === 'object' && 'url' in firstImage
            ? (firstImage as any).url
            : (product.image || ''));


    const hasImage = !!resolvedImage;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.slug || product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100 mb-3 border border-neutral-100">
                    {hasImage ? (
                        <Image
                            src={resolvedImage}
                            alt={product.name}
                            fill
                            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-108' : 'scale-100'}`}
                            quality={80}
                            style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                            <div className="w-16 h-16 rounded-2xl bg-neutral-300/50 flex items-center justify-center mb-3">
                                <ShoppingBag className="h-7 w-7 text-neutral-400" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">No Image</span>
                        </div>
                    )}
                    {/* Sale badge */}
                    {(product.salePrice || product.isFlashSale) && (
                        <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg z-10">
                            {product.isFlashSale ? 'Flash Sale' : 'Sale'}
                        </span>
                    )}
                    {/* Wishlist */}
                    <button
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-neutral-100 transition-all duration-200 opacity-100 scale-100 sm:opacity-0 sm:scale-90 sm:group-hover:opacity-100 sm:group-hover:scale-100 z-15"
                        aria-label="Add to wishlist"
                    >
                        <Heart className={`h-3.5 w-3.5 transition-colors ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`} />
                    </button>
                    {/* Order now slide-up */}
                    <div className="absolute bottom-0 left-0 right-0 transition-all duration-300 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0">
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
                                router.push('/checkout');
                            }}
                            className="w-full bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-bold py-3 flex items-center justify-center gap-2 hover:bg-neutral-700 transition-colors"
                        >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {t?.common?.orderNow || 'Order Now'}
                        </button>
                    </div>
                </div>
            </Link>

            <div className="space-y-1.5">
                <Link href={`/products/${product.slug || product.id}`}>
                    <h3 className="text-sm font-semibold text-neutral-800 leading-snug group-hover:text-neutral-500 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
                    ))}
                    <span className="text-[10px] text-neutral-400 ml-1">({product.rating || 0})</span>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                    {product.salePrice ? (
                        <>
                            <span className="font-black text-rose-600 text-sm">{formatPrice(product.salePrice, language)}</span>
                            <span className="text-xs text-neutral-400 line-through">{formatPrice(product.price, language)}</span>
                        </>
                    ) : (
                        <span className="font-black text-neutral-900 text-sm">{formatPrice(product.price, language)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// --- FLASH SALE SECTION ---
function FlashSaleSection({ products }: { products: any[] }) {
    const { language } = useLanguageStore();
    const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const saleDurationMs = (12 * 60 * 60 + 45 * 60) * 1000;
        let endTimestampStr = localStorage.getItem('flash_sale_end');
        let endTimestamp = endTimestampStr ? parseInt(endTimestampStr, 10) : 0;
        const now = Date.now();

        if (!endTimestamp || endTimestamp <= now) {
            endTimestamp = now + saleDurationMs;
            localStorage.setItem('flash_sale_end', endTimestamp.toString());
        }

        const updateTimer = () => {
            const currentNow = Date.now();
            const diff = endTimestamp - currentNow;
            if (diff <= 0) {
                setTimeLeft({ h: 0, m: 0, s: 0 });
                return false;
            }
            const totalSeconds = Math.floor(diff / 1000);
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            setTimeLeft({ h, m, s });
            return true;
        };

        updateTimer();
        const timer = setInterval(() => {
            const active = updateTimer();
            if (!active) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!products.length) return;
        let animId: number;
        const animate = () => {
            if (scrollContainerRef.current && !isPaused) {
                const c = scrollContainerRef.current;
                c.scrollLeft += 0.75;
                if (c.scrollLeft + c.clientWidth >= c.scrollWidth - 10) c.scrollLeft = 0;
            }
            animId = requestAnimationFrame(animate);
        };
        animId = requestAnimationFrame(animate);
        return () => { cancelAnimationFrame(animId); if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current); };
    }, [products, isPaused]);

    if (!products.length) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 md:my-20">
            <div
                className="bg-neutral-900 py-10 px-6 md:py-14 md:px-10 rounded-xl overflow-hidden relative border border-neutral-800"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center shrink-0">
                            <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                                {getTranslation('home.flashSale', language)}
                            </h2>
                            <p className="text-rose-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                                {getTranslation('home.limitedTimeOffer', language)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {[
                            { val: timeLeft.h, label: getTranslation('home.hours', language) },
                            { val: timeLeft.m, label: getTranslation('home.minutes', language) },
                            { val: timeLeft.s, label: getTranslation('home.seconds', language) }
                        ].map((t, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-2xl font-black text-white tabular-nums">
                                    {t.val.toString().padStart(2, '0')}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest mt-1.5 text-white/40">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Products */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none' }}
                    onTouchStart={() => { setIsPaused(true); if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current); }}
                    onTouchEnd={() => { touchTimeoutRef.current = setTimeout(() => setIsPaused(false), 3000); }}
                >
                    {products.map((p, i) => {
                        const stockLeft = p.stock > 0 ? p.stock : (5 + (p.id.charCodeAt(p.id.length - 1) % 15));
                        const reservedPct = 50 + (p.id.charCodeAt(0) % 35);
                        return (
                            <div key={p.id} className="min-w-[65%] sm:min-w-[45%] md:min-w-[22%] snap-start flex-shrink-0">
                                {/* White card wrapper for dark bg contrast */}
                                <div className="bg-white rounded-xl p-3 border border-neutral-100">
                                    <ProductCard product={p} index={i} />
                                </div>
                                <div className="mt-3 bg-white/10 h-1 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${reservedPct}%` }}
                                        className="bg-rose-500 h-full"
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    />
                                </div>
                                <p className="text-[9px] font-bold uppercase tracking-widest mt-1.5 text-white/50 flex justify-between">
                                    <span>{reservedPct}% Reserved</span>
                                    <span>{stockLeft} Left</span>
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// --- CATEGORY CARD ---
function CategoryCard({ cat, index, language }: { cat: any; index: number; language: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={cat.href} className="group block relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100 border border-neutral-100 hover:border-neutral-300 transition-all duration-500">
                <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <span className="text-base md:text-lg font-black text-white uppercase tracking-tight block group-hover:text-emerald-400 transition-colors duration-300">
                        {language === 'bn' ? (
                            cat.key === 'men' ? 'পুরুষদের' :
                                cat.key === 'women' ? 'মহিলাদের' :
                                    cat.key.includes('kids') ? 'বাচ্চাদের' :
                                        cat.key.includes('wedding') ? 'বিয়ের' : cat.name
                        ) : cat.name}
                    </span>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-white/60 font-bold uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
                        <span>Shop</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>

                {cat.comingSoon && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
                        <span className="bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg">
                            {language === 'bn' ? 'শীঘ্রই আসছে' : 'Coming Soon'}
                        </span>
                    </div>
                )}
            </Link>
        </motion.div>
    );
}

// --- HOME SKELETON ---
function HomeSkeleton() {
    return (
        <div className="bg-white min-h-screen">
            <div className="relative w-full h-[60vh] md:h-[88vh] bg-neutral-100 animate-pulse" />
            <div className="border-y border-neutral-100 h-16" />
            <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
                <div className="flex items-end justify-between mb-10">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-24 bg-neutral-100 rounded" />
                        <Skeleton className="h-8 w-52 bg-neutral-100 rounded-lg" />
                    </div>
                    <Skeleton className="h-4 w-16 bg-neutral-100 rounded" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-[3/4] w-full bg-neutral-100 rounded-xl" />
                            <Skeleton className="h-4 w-2/3 bg-neutral-100 rounded" />
                            <Skeleton className="h-4 w-1/3 bg-neutral-100 rounded" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// --- SCROLL TO TOP ---
function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const handler = () => setVisible(window.scrollY > 600);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);
    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-24 md:bottom-8 right-4 md:right-6 w-11 h-11 bg-neutral-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-neutral-700 transition-all z-50 border border-neutral-800"
                    aria-label="Scroll to top"
                >
                    <ChevronUp className="h-5 w-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

// --- MAIN CLIENT PAGE ---
export default function HomeClient({
    newArrivals,
    flashProducts,
    categories,
    heroBanners,
    promoBanners,
}: {
    newArrivals: any[];
    flashProducts: any[];
    categories: any[];
    heroBanners: any[];
    promoBanners: any[];
}) {
    const { language } = useLanguageStore();
    const t = useTranslation();

    return (
        <main className="min-h-screen bg-white text-foreground">
            <ScrollToTop />

            {/* 1. HERO SLIDER */}
            <HeroSlider dbBanners={heroBanners} />

            {/* 2. SHOP BY CATEGORY */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <SectionHeader
                    label="Big Bazar Bariarhat"
                    title={t?.categories?.title || 'Shop By Category'}
                    viewAllHref="/products"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                    {categories.map((cat, i) => (
                        <CategoryCard key={cat.key} cat={cat} index={i} language={language} />
                    ))}
                </div>
            </section>

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-t border-neutral-100" />
            </div>

            {/* 3. NEW ARRIVALS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <SectionHeader
                    label="Just Landed"
                    title={t?.newArrivals?.title || 'New Arrivals'}
                    viewAllHref="/new-arrivals"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
                    {newArrivals.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </section>

            {/* 4. FLASH SALE */}
            <FlashSaleSection products={flashProducts} />

            {/* 5. WEDDING COLLECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
                <SectionHeader
                    label="Special Occasions"
                    title={language === 'bn' ? 'বিয়ের স্পেশাল কালেকশন' : 'Wedding Collection'}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        {
                            href: '/products?category=wedding-touch',
                            image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
                            label: language === 'bn' ? 'বিয়েল ছোঁয়া' : 'Wedding Touch',
                            sub: language === 'bn' ? 'মূল বিয়ের পোশাক' : 'Bridal & Groom Wear',
                        },
                        {
                            href: '/products?category=holud-mehedi',
                            image: 'https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?q=80&w=800&auto=format&fit=crop',
                            label: language === 'bn' ? 'গায়ে হলুদ ও মেহেদি' : 'Holud & Mehedi',
                            sub: language === 'bn' ? 'গায়ে হলুদ ও মেহেদি কালেকশন' : 'Haldi & Mehendi Celebration',
                        },
                        {
                            href: '/products?category=wedding-guest',
                            image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
                            label: language === 'bn' ? 'বিয়েবাড়ির অতিথি' : 'Wedding Guest',
                            sub: language === 'bn' ? 'বিয়েবাড়ির অতিথি কালেকশন' : 'Wedding Guest Wear',
                        },
                    ].map(({ href, image, label, sub }, i) => (
                        <motion.div
                            key={href}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href={href} className="group block relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100 border border-neutral-100 hover:border-neutral-300 transition-all duration-500">
                                <Image src={image} alt={label} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" quality={90} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                                    <span className="text-base md:text-lg font-black text-white uppercase tracking-tight block group-hover:text-emerald-400 transition-colors duration-300">
                                        {label}
                                    </span>
                                    <span className="text-[11px] text-white/60 block mt-1">{sub}</span>
                                    <div className="flex items-center gap-1 mt-2.5 text-[10px] text-white/50 font-bold uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
                                        <span>Explore</span>
                                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 6. PROMO BANNERS */}
            {promoBanners.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {promoBanners.map((banner, i) => (
                            <Link
                                key={banner.id || i}
                                href={banner.linkUrl || '/products'}
                                className="group block relative h-[220px] md:h-[300px] overflow-hidden rounded-xl border border-neutral-100"
                            >
                                <Image
                                    src={banner.imageDesktop || '/placeholder.png'}
                                    alt={banner.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    quality={90}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                                <div className="absolute bottom-5 left-6 text-white">
                                    {banner.subtitle && (
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-white/60 block mb-1">{banner.subtitle}</span>
                                    )}
                                    <h3 className="text-xl md:text-2xl font-playfair font-black">{banner.title}</h3>
                                    <div className="flex items-center gap-2 mt-2 text-[10px] uppercase tracking-widest text-white/70 group-hover:text-white transition-colors font-bold">
                                        <span>{banner.linkText || t?.common?.shopNow || 'Shop Now'}</span>
                                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
