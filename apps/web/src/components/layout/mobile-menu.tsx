'use client';

import Link from 'next/link';
import { useState } from 'react';
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

const getMobileNavigation = (t: any) => [
    {
        name: t?.categories?.men || 'Men',
        href: '/products?category=Men',
        submenu: [
            { name: 'T-Shirts', href: '/products?category=Men&subcategory=T-Shirts' },
            { name: 'Denim', href: '/products?category=Men&subcategory=Denim' },
            { name: 'Knitwear', href: '/products?category=Men&subcategory=Knitwear' },
            { name: 'Outerwear', href: '/products?category=Men&subcategory=Outerwear' },
        ]
    },
    {
        name: t?.categories?.women || 'Women',
        href: '/products?category=Women',
        submenu: [
            { name: 'Dresses', href: '/products?category=Women&subcategory=Dresses' },
            { name: 'Blouses', href: '/products?category=Women&subcategory=Blouses' },
            { name: 'Trousers', href: '/products?category=Women&subcategory=Trousers' },
            { name: 'Skirts', href: '/products?category=Women&subcategory=Skirts' },
        ]
    },
    {
        name: t?.categories?.kidsBoys || 'Kids(Boys)',
        href: '/products?category=Kids(Boys)',
        submenu: [
            { name: 'T-Shirts', href: '/products?category=Kids(Boys)&subcategory=T-Shirts' },
            { name: 'Pants', href: '/products?category=Kids(Boys)&subcategory=Pants' },
            { name: 'Outerwear', href: '/products?category=Kids(Boys)&subcategory=Outerwear' },
        ]
    },
    {
        name: t?.categories?.kidsGirls || 'Kids(Girls)',
        href: '/products?category=Kids(Girls)',
        submenu: [
            { name: 'Dresses', href: '/products?category=Kids(Girls)&subcategory=Dresses' },
            { name: 'Tops', href: '/products?category=Kids(Girls)&subcategory=Tops' },
            { name: 'Skirts', href: '/products?category=Kids(Girls)&subcategory=Skirts' },
        ]
    },
    {
        name: t?.categories?.weddingTouch || 'Wedding Touch',
        href: '/products?category=Wedding-Touch',
        submenu: [
            { name: 'Panjabi', href: '/products?category=Wedding-Touch&subcategory=Panjabi' },
            { name: 'Sherwani', href: '/products?category=Wedding-Touch&subcategory=Sherwani' },
            { name: 'Saree', href: '/products?category=Wedding-Touch&subcategory=Saree' },
        ]
    },
    { name: 'Sale', href: '/sale', highlight: true, submenu: undefined, comingSoon: false },
];

export function MobileMenu() {
    const t = useTranslation();
    const navigation = getMobileNavigation(t);
    const [open, setOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const { openSearch, openCart } = useUIStore();

    const handleLinkClick = () => {
        setOpen(false);
    };

    const handleSearchClick = () => {
        setOpen(false);
        openSearch();
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-foreground hover:text-destructive hover:bg-transparent">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-background border-r border-border p-0 flex flex-col z-[60]">
                <SheetHeader className="p-6 border-b border-border">
                    <SheetTitle className="text-left">
                        <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                            <span className="text-xl font-black uppercase tracking-[0.15em] transition-colors duration-300 font-playfair">
                                <span className="text-destructive">BIG</span> <span className="text-foreground">BAZAR</span>
                            </span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
                    {/* Search */}
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted mb-6 gap-3"
                        onClick={handleSearchClick}
                    >
                        <Search className="h-5 w-5" />
                        <span className="uppercase tracking-widest text-xs font-bold">{t.common.search}</span>
                    </Button>

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
                                                {item.submenu.map((subitem) => (
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
