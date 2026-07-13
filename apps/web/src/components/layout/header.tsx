'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    ShoppingBag,
    User,
    Search,
    Heart,
    ChevronDown,
    Menu,
    X,
    LayoutGrid,
    Clock,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn, formatPrice } from '@/lib/utils';
import { AnnouncementBar } from './announcement-bar';
import { MobileBottomNav } from './mobile-bottom-nav';
import { MegaMenu } from './mega-menu';
import { MobileMenu } from './mobile-menu';


const getNavCategories = (t: any): any[] => [
    {
        name: t?.categories?.men || 'Men',
        href: '/products?category=men',
        featured: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'T-Shirts', href: '/products?category=men&subcategory=men-t-shirts' },
            { name: 'Denim', href: '/products?category=men&subcategory=men-denim' },
            { name: 'Knitwear', href: '/products?category=men&subcategory=men-knitwear' },
            { name: 'Outerwear', href: '/products?category=men&subcategory=men-outerwear' },
        ]
    },
    {
        name: t?.categories?.women || 'Women',
        href: '/products?category=women',
        featured: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'Dresses', href: '/products?category=women&subcategory=women-dresses' },
            { name: 'Blouses', href: '/products?category=women&subcategory=women-blouses' },
            { name: 'Trousers', href: '/products?category=women&subcategory=women-trousers' },
            { name: 'Skirts', href: '/products?category=women&subcategory=women-skirts' },
        ]
    },
    {
        name: t?.categories?.kidsBoys || 'Kids(Boys)',
        href: '/products?category=kids-boys',
        featured: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'T-Shirts', href: '/products?category=kids-boys&subcategory=kids-boys-t-shirts' },
            { name: 'Pants', href: '/products?category=kids-boys&subcategory=kids-boys-pants' },
            { name: 'Outerwear', href: '/products?category=kids-boys&subcategory=kids-boys-outerwear' },
        ]
    },
    {
        name: t?.categories?.kidsGirls || 'Kids(Girls)',
        href: '/products?category=kids-girls',
        featured: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'Dresses', href: '/products?category=kids-girls&subcategory=kids-girls-dresses' },
            { name: 'Tops', href: '/products?category=kids-girls&subcategory=kids-girls-tops' },
            { name: 'Skirts', href: '/products?category=kids-girls&subcategory=kids-girls-skirts' },
        ]
    },
    {
        name: t?.categories?.weddingTouch || 'Wedding Touch',
        href: '/products?category=wedding-touch',
        featured: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'Panjabi', href: '/products?category=wedding-touch&subcategory=wedding-touch-panjabi' },
            { name: 'Sherwani', href: '/products?category=wedding-touch&subcategory=wedding-touch-sherwani' },
            { name: 'Saree', href: '/products?category=wedding-touch&subcategory=wedding-touch-saree' },
        ]
    }
];

export function Header() {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const [categories, setCategories] = useState<any[]>([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const [isDesktop, setIsDesktop] = useState(false);

    const pathname = usePathname();
    const isHome = pathname === '/';
    const router = useRouter();
    const cartCount = useCartStore(state => state.getItemCount());
    const wishlistCount = useWishlistStore(state => state.getItemCount());
    const { openCart, openSearch } = useUIStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkWidth = () => setIsDesktop(window.innerWidth >= 1024);
        checkWidth();
        window.addEventListener('resize', checkWidth);

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 30);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        const saved = localStorage.getItem('recent-searches');
        if (saved) setRecentSearches(JSON.parse(saved));

        // Initialize with translated static categories so it displays immediately
        setCategories(getNavCategories(t));

        // Fetch live DB categories to populate the dropdown menu dynamically!
        const defaultImages: Record<string, string> = {
            'Men': 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
            'Women': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
            'Kids(Boys)': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop',
            'Kids(Girls)': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=800&auto=format&fit=crop',
            'Wedding Touch': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
        };
        const fetchNav = async () => {
            try {
                const res = await fetch('/api/categories');
                const result = await res.json();
                if (result.success && result.data && result.data.length > 0) {
                    const mapped = result.data.map((cat: any) => ({
                        name: cat.name,
                        href: `/products?category=${encodeURIComponent(cat.slug)}`,
                        isHidden: cat.isHidden || false,
                        featured: cat.image || defaultImages[cat.name] || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
                        subcategories: (cat.children || []).filter((sub: any) => !sub.isHidden).map((sub: any) => ({
                            name: sub.name,
                            href: `/products?category=${encodeURIComponent(cat.slug)}&subcategory=${encodeURIComponent(sub.slug)}`
                        }))
                    }));
                    setCategories(mapped);
                }
            } catch (error) {
                console.error('Failed to load dynamic navigation categories:', error);
            }
        };
        fetchNav();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkWidth);
        };
    }, [t]);

    // Debounced Search logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(() => {
            fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        setSearchResults(data.data);
                    }
                })
                .catch(err => {
                    console.error('Header search error:', err);
                });
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle Search Submit
    const handleSearch = (e?: React.FormEvent, q?: string) => {
        e?.preventDefault();
        const term = q || searchQuery;
        if (!term.trim()) return;

        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recent-searches', JSON.stringify(updated));

        setIsSearchFocused(false);
        router.push(`/products?search=${encodeURIComponent(term)}`);
    };

    return (
        <>
            <AnnouncementBar />

            <header className={cn(
                "z-50 transition-all duration-300 ease-in-out w-full h-14 lg:h-16 xl:h-[114px]",
                isHome
                    ? (isScrolled
                        ? "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl shadow-black/5 text-slate-900 border-b border-slate-100"
                        : "absolute left-0 right-0 bg-transparent text-white border-b border-white/10")
                    : "sticky top-0 bg-white/95 backdrop-blur-md shadow-xl shadow-black/5 text-slate-900 border-b border-slate-100"
            )}>
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                    {/* Row 1: Logo, Centered Search, Action Icons */}
                    <div className="flex items-center justify-between h-14 lg:h-16">
                        {/* Logo */}
                        <Link href="/" className="group shrink-0">
                            <div className="flex items-center">
                                <h1 className="text-2xl sm:text-3xl font-black uppercase block font-playfair-sc transition-all duration-300 ease-in-out">
                                    <span className="text-[#FF0000] transition-all duration-300 ease-in-out">BIG</span>{" "}
                                    <span className="text-black transition-all duration-300 ease-in-out">BAZAR</span>
                                </h1>
                            </div>
                        </Link>

                        {/* Search Bar - Center */}
                        <div ref={searchRef} className="hidden lg:block relative flex-1 max-w-md mx-auto">
                            <form onSubmit={handleSearch} className="relative group">
                                <Search className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-300 ease-in-out",
                                    isHome && !isScrolled ? "text-white/70" : "text-slate-400"
                                )} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    className={cn(
                                        "w-full pl-11 pr-10 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2",
                                        isHome && !isScrolled
                                            ? "bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:ring-white/20 focus:border-white/30"
                                            : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-primary/20 focus:border-primary/30"
                                    )}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-50/10 rounded-full"
                                    >
                                        <X className={cn("h-3.5 w-3.5 transition-all duration-300 ease-in-out", isHome && !isScrolled ? "text-white/50" : "text-slate-400")} />
                                    </button>
                                )}
                            </form>

                            {/* Search Dropdown */}
                            <AnimatePresence>
                                {isSearchFocused && isDesktop && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-50 overflow-hidden text-slate-900"
                                    >
                                        <div className="space-y-10">
                                            {/* Suggestions */}
                                            {searchResults.length > 0 && (
                                                <div className="space-y-4">
                                                    <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] text-left">Suggestions</h3>
                                                    <div className="space-y-3">
                                                        {searchResults.map((p: any) => (
                                                            <Link
                                                                key={p.id}
                                                                href={`/products/${p.slug}`}
                                                                onClick={() => setIsSearchFocused(false)}
                                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
                                                            >
                                                                <div className="w-12 h-16 bg-slate-50 rounded-xl overflow-hidden relative shrink-0 border border-slate-100">
                                                                    <Image src={p.images?.[0]?.url || '/placeholder.jpg'} alt={p.name} fill className="object-cover" />
                                                                </div>
                                                                <div className="flex-1 min-w-0 text-left">
                                                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate group-hover:text-primary transition-colors">{p.name}</p>
                                                                    <p className="text-[10px] font-black text-slate-400 font-mono mt-1">{formatPrice(p.salePrice ?? p.basePrice ?? p.price ?? 0, language)}</p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                    <Button
                                                        onClick={() => handleSearch()}
                                                        className="w-full mt-4 bg-foreground text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all"
                                                    >
                                                        View All Results <ArrowRight className="h-3 w-3 ml-2" />
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Recent & Popular */}
                                            <div className="grid grid-cols-2 gap-8 text-left">
                                                <div>
                                                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Clock className="h-3 w-3" /> Recent</h3>
                                                    <div className="flex flex-col gap-2">
                                                        {recentSearches.length > 0 ? recentSearches.map(s => (
                                                            <button key={s} onClick={() => handleSearch(undefined, s)} className="text-[10px] font-black text-slate-600 hover:text-primary transition-all uppercase tracking-widest text-left">{s}</button>
                                                        )) : <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">No recent searches</p>}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><TrendingUp className="h-3 w-3" /> {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</h3>
                                                    <div className="flex flex-col gap-2">
                                                        {[
                                                            { name: t?.categories?.men || 'Men', query: 'Men' },
                                                            { name: t?.categories?.women || 'Women', query: 'Women' },
                                                            { name: language === 'bn' ? 'বাচ্চাদের' : 'Kids', query: 'Kids' },
                                                            { name: t?.common?.sale || 'Sale', query: 'Sale' }
                                                        ].map(item => (
                                                            <button key={item.query} onClick={() => handleSearch(undefined, item.query)} className="text-[10px] font-black text-slate-600 hover:text-primary transition-all uppercase tracking-widest text-left">{item.name}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                            {/* Search trigger for mobile */}
                            <button
                                onClick={() => openSearch()}
                                className="lg:hidden p-2.5 rounded-full transition-all duration-300 ease-in-out bg-transparent hover:bg-white/10"
                                aria-label="Search"
                            >
                                <Search className={cn("h-5 w-5 transition-all duration-300 ease-in-out", isHome && !isScrolled ? "text-white" : "text-slate-900")} />
                            </button>

                            {/* Wishlist */}
                            <Link
                                href="/wishlist"
                                className="hidden sm:block p-2.5 rounded-full transition-all duration-300 ease-in-out relative hover:bg-white/10"
                            >
                                <Heart className={cn("h-5 w-5 transition-all duration-300 ease-in-out", isHome && !isScrolled ? "text-white" : "text-slate-900")} />
                                {mounted && wishlistCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow-sm">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="p-2.5 rounded-full transition-all relative duration-300 ease-in-out hover:bg-white/10"
                            >
                                <ShoppingBag className={cn("h-5 w-5 transition-all duration-300 ease-in-out", isHome && !isScrolled ? "text-white" : "text-slate-900")} />
                                {mounted && cartCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Profile */}
                            <Link href="/account/profile" className={cn(
                                "hidden sm:block p-0.5 rounded-full transition-all duration-300 ease-in-out",
                                isHome && !isScrolled ? "hover:ring-4 hover:ring-white/15" : "hover:ring-4 hover:ring-primary/10"
                            )}>
                                <div className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ease-in-out",
                                    isHome && !isScrolled ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900"
                                )}>
                                    <User className="h-4 w-4" />
                                </div>
                            </Link>
                            <MobileMenu />
                        </div>
                    </div>

                    {/* Row 2: Centered Category Navigation Links (Desktop) */}
                    <div className={cn(
                        "hidden xl:flex items-center justify-center border-t py-1.5 mt-0 transition-all duration-300 ease-in-out",
                        isHome && !isScrolled ? "border-white/10" : "border-slate-100"
                    )}>
                        <nav className="flex items-center gap-8 2xl:gap-12 transition-all duration-300 ease-in-out">
                            {categories.filter(c => !c.isHidden).map((category) => {
                                const isSale = category.name.toLowerCase().includes('sale') || category.name.toLowerCase().includes('discount') || category.name.toLowerCase().includes('exclusive');
                                return (
                                    <div
                                        key={category.name}
                                        className="relative group/mega"
                                        onMouseEnter={() => setActiveMegaMenu(category.name)}
                                        onMouseLeave={() => setActiveMegaMenu(null)}
                                    >
                                        <Link
                                            href={category.href}
                                            className={cn(
                                                "flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ease-in-out py-1 relative block",
                                                isSale
                                                    ? (isHome && !isScrolled ? "text-[#16A34A] hover:text-[#16A34A]/80 font-black" : "text-primary hover:text-primary/80 font-black")
                                                    : (isHome && !isScrolled ? "text-white/90 hover:text-white" : "text-slate-800 hover:text-primary")
                                            )}
                                        >
                                            {category.name} <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", activeMegaMenu === category.name && "rotate-180")} />
                                        </Link>

                                        <AnimatePresence>
                                            {activeMegaMenu === category.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 w-[400px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 overflow-hidden z-50 text-slate-900"
                                                >
                                                    <div className="grid grid-cols-2 gap-6 text-left">
                                                        <div className="space-y-4">
                                                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{category.name} Collection</h3>
                                                            <ul className="space-y-3">
                                                                {category.subcategories.map((sub: any) => (
                                                                    <li key={sub.name}>
                                                                        <Link href={sub.href} className="text-sm font-black text-slate-900 hover:text-primary transition-colors uppercase tracking-tight block">
                                                                            {sub.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="aspect-[4/5] relative rounded-xl overflow-hidden group/img">
                                                            <div className="absolute inset-0 bg-slate-900/10 group-hover/img:bg-slate-900/0 transition-colors z-10" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                                            <Image src={category.featured} alt={category.name} fill className="object-cover group-hover/img:scale-110 transition-transform duration-700" />
                                                            <span className="absolute bottom-3 left-4 text-[8px] font-black text-white uppercase tracking-widest z-20">Explore</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </header>

            <MobileBottomNav />

            {/* Click outside search closer */}
            {isSearchFocused && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[45]"
                    onClick={() => setIsSearchFocused(false)}
                />
            )}
        </>
    );
}
