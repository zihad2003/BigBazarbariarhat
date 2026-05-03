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
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn, formatPrice } from '@/lib/utils';
import { AnnouncementBar } from './announcement-bar';
import { MobileBottomNav } from './mobile-bottom-nav';
import { MegaMenu } from './mega-menu';
import { MobileMenu } from './mobile-menu';
import { MOCK_PRODUCTS } from '@/lib/mock-data/products';

const categories = [
    {
        name: 'Men',
        href: '/products?category=Men',
        featured: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'T-Shirts', href: '/products?category=Men&subcategory=T-Shirts' },
            { name: 'Denim', href: '/products?category=Men&subcategory=Denim' },
            { name: 'Knitwear', href: '/products?category=Men&subcategory=Knitwear' },
            { name: 'Outerwear', href: '/products?category=Men&subcategory=Outerwear' },
        ]
    },
    {
        name: 'Women',
        href: '/products?category=Women',
        featured: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'Dresses', href: '/products?category=Women&subcategory=Dresses' },
            { name: 'Blouses', href: '/products?category=Women&subcategory=Blouses' },
            { name: 'Trousers', href: '/products?category=Women&subcategory=Trousers' },
            { name: 'Skirts', href: '/products?category=Women&subcategory=Skirts' },
        ]
    },
    {
        name: 'Kids',
        href: '/products?category=Kids',
        featured: 'https://images.unsplash.com/photo-1514090259024-b0113c242f0e?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'Boys', href: '/products?category=Kids&subcategory=Boys' },
            { name: 'Girls', href: '/products?category=Kids&subcategory=Girls' },
            { name: 'Infants', href: '/products?category=Kids&subcategory=Infants' },
            { name: 'Accessories', href: '/products?category=Kids&subcategory=Accessories' },
        ]
    },
    {
        name: 'Accessories',
        isHidden: true,
        href: '/products?category=Accessories',
        featured: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'Bags', href: '/products?category=Accessories&subcategory=Bags' },
            { name: 'Wallets', href: '/products?category=Accessories&subcategory=Wallets' },
            { name: 'Belts', href: '/products?category=Accessories&subcategory=Belts' },
            { name: 'Jewelry', href: '/products?category=Accessories&subcategory=Jewelry' },
        ]
    },
    {
        name: 'Shoes',
        isHidden: true,
        href: '/products?category=Shoes',
        featured: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
        subcategories: [
            { name: 'Sneakers', href: '/products?category=Shoes&subcategory=Sneakers' },
            { name: 'Boots', href: '/products?category=Shoes&subcategory=Boots' },
            { name: 'Loafers', href: '/products?category=Shoes&subcategory=Loafers' },
            { name: 'Formal', href: '/products?category=Shoes&subcategory=Formal' },
        ]
    }
];

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const cartCount = useCartStore(state => state.getItemCount());
    const wishlistCount = useWishlistStore(state => state.getItemCount());
    const { openCart } = useUIStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        const saved = localStorage.getItem('recent-searches');
        if (saved) setRecentSearches(JSON.parse(saved));
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Debounced Search logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(() => {
            const results = MOCK_PRODUCTS.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.category?.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 5);
            setSearchResults(results);
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
        router.push(`/search?q=${encodeURIComponent(term)}`);
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
                        
                        {/* Left Section: Mobile Menu & Logo */}
                        <div className="flex items-center gap-2 md:gap-4 shrink-0">
                            <MobileMenu />
                            {/* Logo */}
                            <Link href="/" className="group">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold tracking-tighter uppercase hidden sm:block font-playfair">
                                    <span className="text-[#E11D48]">BIG</span> <span className="text-[#0F172A]">BAZAR</span>
                                </h1>
                            </div>
                        </Link>
                        </div>

                        {/* Navigation - Desktop */}
                        <nav className="hidden xl:flex items-center gap-10">
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
                                                            {category.subcategories.map((sub) => (
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

                        {/* Search & Actions */}
                        <div className="flex items-center gap-6 flex-1 justify-end max-w-xl">
                            
                            {/* Search Bar - Desktop */}
                            <div ref={searchRef} className="hidden md:block relative flex-1 max-w-md">
                                <form onSubmit={handleSearch} className="relative group">
                                    <Search className={cn(
                                        "absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                                        isSearchFocused ? "text-primary" : "text-slate-400"
                                    )} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
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
                                                            {searchResults.map((p) => (
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
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsSearchFocused(true)}
                                    className="md:hidden p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all" 
                                    aria-label="Search"
                                >
                                    <Search className="h-5 w-5 text-slate-900" />
                                </button>
                                <Link href="/wishlist" className="hidden sm:block p-3 bg-slate-50 hover:bg-red-50 hover:text-destructive rounded-2xl transition-all relative">
                                    <Heart className="h-5 w-5" />
                                    {mounted && wishlistCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">{wishlistCount}</span>}
                                </Link>
                                <button 
                                    onClick={() => openCart()}
                                    className="p-3 bg-slate-900 text-white hover:bg-indigo-600 rounded-2xl transition-all relative shadow-xl shadow-black/10"
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    {mounted && cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center border-2 border-black">{cartCount}</span>}
                                </button>
                                <Link href="/account/profile" className="hidden sm:block p-1 bg-slate-100 rounded-2xl hover:ring-4 hover:ring-indigo-600/10 transition-all">
                                    <div className="w-10 h-10 bg-white rounded-[0.9rem] flex items-center justify-center text-slate-900 font-black text-xs uppercase tracking-tighter">
                                        {session?.user?.name?.charAt(0) || <User className="h-5 w-5" />}
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Overlay */}
                <AnimatePresence>
                    {isSearchFocused && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden fixed inset-0 z-[100] bg-white p-6"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <form onSubmit={handleSearch} className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none"
                                    />
                                </form>
                                <button onClick={() => setIsSearchFocused(false)} className="p-3 bg-slate-50 rounded-2xl">
                                    <X className="h-5 w-5 text-slate-400" />
                                </button>
                            </div>

                            {/* Mobile Search Content */}
                            <div className="space-y-10">
                                {searchResults.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Suggestions</h3>
                                        <div className="space-y-4">
                                            {searchResults.map((p) => (
                                                <Link 
                                                    key={p.id} 
                                                    href={`/products/${p.slug}`}
                                                    onClick={() => setIsSearchFocused(false)}
                                                    className="flex items-center gap-4"
                                                >
                                                    <div className="w-12 h-16 bg-slate-50 rounded-xl overflow-hidden relative shrink-0">
                                                        <Image src={p.images?.[0]?.url || '/placeholder.jpg'} alt={p.name} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight line-clamp-1">{p.name}</p>
                                                        <p className="text-[10px] font-black text-slate-400 font-mono mt-1">{formatPrice(p.salePrice || p.basePrice)}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Recent</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map(s => (
                                            <button key={s} onClick={() => handleSearch(undefined, s)} className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest">{s}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
