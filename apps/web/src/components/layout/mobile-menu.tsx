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
import { useSession, signOut } from 'next-auth/react';

const navigation = [
    {
        name: 'Men',
        href: '/men',
        submenu: [
            { name: 'Shirts', href: '/men/shirts' },
            { name: 'T-Shirts', href: '/men/t-shirts' },
            { name: 'Pants', href: '/men/pants' },
            { name: 'Jeans', href: '/men/jeans' },
            { name: 'Jackets', href: '/men/jackets' },
            { name: 'Accessories', href: '/men/accessories' },
        ]
    },
    {
        name: 'Women',
        href: '/women',
        submenu: [
            { name: 'Dresses', href: '/women/dresses' },
            { name: 'Tops', href: '/women/tops' },
            { name: 'Pants', href: '/women/pants' },
            { name: 'Skirts', href: '/women/skirts' },
            { name: 'Sarees', href: '/women/sarees' },
            { name: 'Accessories', href: '/women/accessories' },
        ]
    },
    {
        name: 'Kids',
        href: '/kids',
        submenu: [
            { name: 'Boys', href: '/kids/boys' },
            { name: 'Girls', href: '/kids/girls' },
            { name: 'Infants', href: '/kids/infants' },
        ]
    },
    {
        name: 'Accessories',
        href: '#',
        comingSoon: true,
    },
    { name: 'Sale', href: '/sale', highlight: true },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const { openSearch, openCart } = useUIStore();
    const { data: session, status } = useSession();

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
                        <span className="uppercase tracking-widest text-xs font-bold">Search</span>
                    </Button>

                    <nav className="space-y-1">
                        {navigation.map((item) => (
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
                    {status === 'authenticated' ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-2">
                                <Link href="/account" onClick={handleLinkClick} className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 rounded-full ring-2 ring-destructive/50 flex items-center justify-center overflow-hidden">
                                        <User className="h-4 w-4 text-foreground" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-foreground group-hover:text-destructive transition-colors">My Account</span>
                                        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{session.user?.email}</span>
                                    </div>
                                </Link>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" onClick={handleLinkClick}>
                            <Button variant="outline" className="w-full border-foreground text-foreground hover:bg-destructive hover:border-destructive hover:text-white uppercase tracking-widest text-xs font-bold transition-all">
                                Sign In / Register
                            </Button>
                        </Link>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <Link href="/wishlist" onClick={handleLinkClick}>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted gap-2 px-2">
                                <Heart className="h-4 w-4" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">Wishlist</span>
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted gap-2 px-2"
                            onClick={() => {
                                handleLinkClick();
                                openCart();
                            }}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Cart</span>
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
