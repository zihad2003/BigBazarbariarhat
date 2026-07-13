'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, ShoppingBag, User, Heart, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useUIStore } from '@/lib/stores/ui-store';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';

const getMobileNavigation = (t: any): any[] => [
    {
        name: t?.categories?.men || 'Men',
        href: '/products?category=men',
        submenu: [
            { name: 'T-Shirts', href: '/products?category=men&subcategory=men-t-shirts' },
            { name: 'Denim', href: '/products?category=men&subcategory=men-denim' },
            { name: 'Knitwear', href: '/products?category=men&subcategory=men-knitwear' },
            { name: 'Outerwear', href: '/products?category=men&subcategory=men-outerwear' },
        ]
    },
    {
        name: t?.categories?.women || 'Women',
        href: '/products?category=women',
        submenu: [
            { name: 'Dresses', href: '/products?category=women&subcategory=women-dresses' },
            { name: 'Blouses', href: '/products?category=women&subcategory=women-blouses' },
            { name: 'Trousers', href: '/products?category=women&subcategory=women-trousers' },
            { name: 'Skirts', href: '/products?category=women&subcategory=women-skirts' },
        ]
    },
    {
        name: t?.categories?.kidsBoys || 'Kids(Boys)',
        href: '/products?category=kids-boys',
        submenu: [
            { name: 'T-Shirts', href: '/products?category=kids-boys&subcategory=kids-boys-t-shirts' },
            { name: 'Pants', href: '/products?category=kids-boys&subcategory=kids-boys-pants' },
            { name: 'Outerwear', href: '/products?category=kids-boys&subcategory=kids-boys-outerwear' },
        ]
    },
    {
        name: t?.categories?.kidsGirls || 'Kids(Girls)',
        href: '/products?category=kids-girls',
        submenu: [
            { name: 'Dresses', href: '/products?category=kids-girls&subcategory=kids-girls-dresses' },
            { name: 'Tops', href: '/products?category=kids-girls&subcategory=kids-girls-tops' },
            { name: 'Skirts', href: '/products?category=kids-girls&subcategory=kids-girls-skirts' },
        ]
    },
    {
        name: t?.categories?.weddingTouch || 'Wedding Touch',
        href: '/products?category=wedding-touch',
        submenu: [
            { name: 'Panjabi', href: '/products?category=wedding-touch&subcategory=wedding-touch-panjabi' },
            { name: 'Sherwani', href: '/products?category=wedding-touch&subcategory=wedding-touch-sherwani' },
            { name: 'Saree', href: '/products?category=wedding-touch&subcategory=wedding-touch-saree' },
        ]
    },
    { name: 'Sale', href: '/sale', highlight: true, submenu: undefined, comingSoon: false },
];

export function MobileMenu() {
    const t = useTranslation();
    const [navigation, setNavigation] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const { openSearch, openCart } = useUIStore();

    const handleLinkClick = () => {
        setOpen(false);
    };



    useEffect(() => {
        // Initialize with default translated menu lists
        setNavigation(getMobileNavigation(t));

        // Fetch live database categories
        const fetchNav = async () => {
            try {
                const res = await fetch('/api/categories');
                const result = await res.json();
                if (result.success && result.data && result.data.length > 0) {
                    const mapped = result.data.map((cat: any) => ({
                        name: cat.name,
                        href: `/products?category=${encodeURIComponent(cat.slug)}`,
                        isHidden: cat.isHidden || false,
                        submenu: (cat.children || []).filter((sub: any) => !sub.isHidden).map((sub: any) => ({
                            name: sub.name,
                            href: `/products?category=${encodeURIComponent(cat.slug)}&subcategory=${encodeURIComponent(sub.slug)}`
                        }))
                    }));
                    // Append Sale highlight menu link to navigation
                    mapped.push({ name: 'Sale', href: '/sale', highlight: true, submenu: undefined, comingSoon: false, isHidden: false });
                    setNavigation(mapped);
                }
            } catch (error) {
                console.error('Failed to load mobile dynamic navigation:', error);
            }
        };
        fetchNav();
    }, [t]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-foreground hover:text-destructive hover:bg-transparent">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background border-l border-border p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-border">
                    <SheetTitle className="text-left">
                        <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                            <span className="text-xl font-black uppercase tracking-[0.15em] transition-colors duration-300 font-playfair">
                                <span className="text-destructive">BIG</span> <span className="text-black">BAZAR</span>
                            </span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">


                    <nav className="space-y-1">
                        {navigation.filter(item => !item.isHidden).map((item) => (
                            <div key={item.name} className="overflow-hidden">
                                <button
                                    onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                                    className={`w-full flex items-center justify-between py-3 px-2 text-sm font-bold uppercase tracking-[0.15em] transition-colors ${item.highlight ? 'text-destructive' : 'text-foreground hover:text-destructive'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {item.name}
                                        {item.comingSoon && (
                                            <span className="text-[9px] bg-yellow-400 text-yellow-900 px-1 py-0.5 font-bold uppercase tracking-widest leading-none">
                                                Soon
                                            </span>
                                        )}
                                    </div>
                                    {item.submenu && (
                                        <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${activeSubmenu === item.name ? 'rotate-90' : ''}`} />
                                    )}
                                </button>

                                <AnimatePresence initial={false}>
                                    {item.submenu && activeSubmenu === item.name && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-4 pb-2 space-y-1 border-l border-border ml-2 my-2">
                                                {item.submenu.map((subitem: any) => (
                                                    <Link
                                                        key={subitem.name}
                                                        href={subitem.href}
                                                        onClick={handleLinkClick}
                                                        className="block py-2 px-2 text-xs text-muted-foreground hover:text-destructive uppercase tracking-wider relative group"
                                                    >
                                                        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 inline-block">
                                                            {subitem.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="p-6 border-t border-border space-y-4 bg-background">
                    <Link href="/account" onClick={handleLinkClick} className="flex items-center gap-3 px-2 py-3 bg-muted/50 rounded-2xl group">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <User className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground group-hover:text-destructive transition-colors">{t.common.account}</span>
                            <span className="text-[10px] text-muted-foreground">Manage your orders</span>
                        </div>
                    </Link>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <Link href="/wishlist" onClick={handleLinkClick}>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted gap-2 px-2">
                                <Heart className="h-4 w-4" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">{t.common.wishlist}</span>
                            </Button>
                        </Link>
                        <Link href="/cart" onClick={handleLinkClick} className="flex-1">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted gap-2 px-2"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">{t.common.cart}</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
