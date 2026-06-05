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
        featured: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop',
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
        featured: 'https://images.unsplash.com/photo-1519234129322-2636a0d0d885?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'T-Shirts', href: '/products?category=kids-boys&subcategory=kids-boys-t-shirts' },
            { name: 'Pants', href: '/products?category=kids-boys&subcategory=kids-boys-pants' },
            { name: 'Outerwear', href: '/products?category=kids-boys&subcategory=kids-boys-outerwear' },
        ]
    },
    {
        name: t?.categories?.kidsGirls || 'Kids(Girls)',
        href: '/products?category=kids-girls',
        featured: 'https://images.unsplash.com/photo-1514316454349-f50db90e2270?q=80&w=800&auto=format&fit=crop',
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
    const t = useTranslation();
    const [categories, setCategories] = useState<any[]>([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    
    const pathname = usePathname();
    const router = useRouter();
    const cartCount = useCartStore(state => state.getItemCount());
    const wishlistCount = useWishlistStore(state => state.getItemCount());
    const { openCart, openSearch } = useUIStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        const saved = localStorage.getItem('recent-searches');
        if (saved) setRecentSearches(JSON.parse(saved));
        
        // Initialize with translated static categories so it displays immediately
        setCategories(getNavCategories(t));

        // Fetch live DB categories to populate the dropdown menu dynamically!
        const defaultImages: Record<string, string> = {
            'Men': 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop',
            'Women': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
            'Kids(Boys)': 'https://images.unsplash.com/photo-1519234129322-2636a0d0d885?q=80&w=800&auto=format&fit=crop',
            'Kids(Girls)': 'https://images.unsplash.com/photo-1514316454349-f50db90e2270?q=80&w=800&auto=format&fit=crop',
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

        return () => window.removeEventListener('scroll', handleScroll);
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
                "sticky top-0 z-50 transition-all duration-500",
                isScrolled ? "bg-white/80 backdrop-blur-xl shadow-xl shadow-black/5" : "bg-white"
            )}>
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-24 lg:h-28">
                        
                        {/* Left & Center: Logo + Navigation */}
                        <div className="flex items-center gap-8 2xl:gap-12">
                            {/* Logo */}
                            <Link href="/" className="group shrink-0">
                                <div className="flex items-center">
                                    <h1 className="text-lg sm:text-2xl font-bold tracking-tighter uppercase block font-playfair">
                                        <span className="text-[#E11D48]">BIG</span> <span className="text-[#0F172A]">BAZAR</span>
                                    </h1>
                                </div>
                            </Link>

                            {/* Navigation - Desktop */}
                            <nav className="hidden xl:flex items-center gap-6 2xl:gap-10">
                                {categories.filter(c => !c.isHidden).map((category) => (
                                    <div 
                                        key={category.name}
                                        className="relative group/mega"
                                        onMouseEnter={() => setActiveMegaMenu(category.name)}
                                        onMouseLeave={() => setActiveMegaMenu(null)}
                                    >
                                        <Link href={category.href} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors py-10">
                                            {category.name} <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", activeMegaMenu === category.name && "rotate-180")} />
                                        </Link>

                                        <AnimatePresence>
                                            {activeMegaMenu === category.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full left-1/2 -translate-x-1/2 w-[400px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 overflow-hidden z-50"
                                                >
                                                    <div className="grid grid-cols-2 gap-6">
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
                                ))}
                            </nav>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex items-center gap-6 flex-1 justify-end max-w-2xl">
                            
                            {/* Search Bar - Desktop */}
                            <div ref={searchRef} className="hidden lg:block relative flex-1 max-w-lg">
                                <form onSubmit={handleSearch} className="relative group">
                                    <Search className={cn(
                                        "absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                                        isSearchFocused ? "text-primary" : "text-slate-400"
                                    )} />
                                    <input
                                        type="text"
                                        placeholder={t.common.search}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        className={cn(
                                            "w-full pl-12 pr-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border",
                                            isSearchFocused
                                                ? "bg-white border-primary ring-4 ring-primary/5 shadow-2xl"
                                                : "bg-slate-50 border-transparent hover:bg-slate-100"
                                        )}
                                    />
                                    {searchQuery && (
                                        <button 
                                            type="button" 
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                                        >
                                            <X className="h-3 w-3 text-slate-400" />
                                        </button>
                                    )}
                                </form>

                                {/* Search Dropdown */}
                                <AnimatePresence>
                                    {isSearchFocused && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 z-50 overflow-hidden"
                                        >
                                            <div className="space-y-10">
                                                {/* Suggestions */}
                                                {searchResults.length > 0 && (
                                                    <div className="space-y-4">
                                                        <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Suggestions</h3>
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
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate group-hover:text-primary transition-colors">{p.name}</p>
                                                                        <p className="text-[10px] font-black text-slate-400 font-mono mt-1">{formatPrice(p.salePrice || p.basePrice)}</p>
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
                                                <div className="grid grid-cols-2 gap-8">
                                                    <div>
                                                        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Clock className="h-3 w-3" /> Recent</h3>
                                                        <div className="flex flex-col gap-2">
                                                            {recentSearches.length > 0 ? recentSearches.map(s => (
                                                                <button key={s} onClick={() => handleSearch(undefined, s)} className="text-[10px] font-black text-slate-600 hover:text-primary transition-all uppercase tracking-widest text-left">{s}</button>
                                                            )) : <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">No recent searches</p>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><TrendingUp className="h-3 w-3" /> Popular</h3>
                                                        <div className="flex flex-col gap-2">
                                                            {['Men', 'Women', 'Kids', 'Sale'].map(s => (
                                                                <button key={s} onClick={() => handleSearch(undefined, s)} className="text-[10px] font-black text-slate-600 hover:text-primary transition-all uppercase tracking-widest text-left">{s}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => openSearch()}
                                    className="lg:hidden p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all" 
                                    aria-label="Search"
                                >
                                    <Search className="h-5 w-5 text-slate-900" />
                                </button>
                                <Link href="/wishlist" className="hidden sm:block p-3 bg-slate-50 hover:bg-red-50 hover:text-destructive rounded-2xl transition-all relative">
                                    <Heart className="h-5 w-5" />
                                    {mounted && wishlistCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">{wishlistCount}</span>}
                                </Link>
                                <Link 
                                    href="/cart"
                                    className="p-3 bg-slate-50 text-slate-900 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all relative duration-300"
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    {mounted && cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">{cartCount}</span>}
                                </Link>
                                <Link href="/account/profile" className="hidden sm:block p-1 bg-slate-100 rounded-2xl hover:ring-4 hover:ring-primary/10 transition-all duration-300">
                                    <div className="w-10 h-10 bg-white rounded-[0.9rem] flex items-center justify-center text-slate-900 font-black text-xs uppercase tracking-tighter">
                                        <User className="h-5 w-5" />
                                    </div>
                                </Link>
                                <MobileMenu />
                            </div>
                        </div>
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
