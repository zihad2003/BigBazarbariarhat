'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, User, Menu, X, Search, Heart, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/stores/cart-store';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';

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
        href: '/accessories',
        submenu: [
            { name: 'Bags', href: '/accessories/bags' },
            { name: 'Watches', href: '/accessories/watches' },
            { name: 'Jewelry', href: '/accessories/jewelry' },
            { name: 'Sunglasses', href: '/accessories/sunglasses' },
        ]
    },
    { name: 'Sale', href: '/sale', highlight: true },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const { user } = useUser();

    const cartItemCount = useCartStore((state) => state.getItemCount());
    const wishlistCount = useWishlistStore((state) => state.getItemCount());
    const { openSearch, openCart } = useUIStore();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Announcement Bar */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2.5 text-xs font-semibold tracking-wider uppercase">
                <span className="animate-pulse">🔥</span> Flash Sale: Up to 50% Off - Limited Time Only! <span className="animate-pulse">🔥</span>
            </div>

            {/* Header */}
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-md'
                        : 'bg-white border-b border-gray-100'
                    }`}
            >
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative">
                            <span className="text-2xl font-black uppercase tracking-tighter bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Big Bazar
                            </span>
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:gap-x-1">
                        {navigation.map((item) => (
                            <div
                                key={item.name}
                                className="relative"
                                onMouseEnter={() => setActiveSubmenu(item.name)}
                                onMouseLeave={() => setActiveSubmenu(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors rounded-lg ${item.highlight
                                            ? 'text-red-600 hover:bg-red-50'
                                            : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                        }`}
                                >
                                    {item.name}
                                    {item.submenu && <ChevronDown className="h-3 w-3" />}
                                </Link>

                                {/* Submenu */}
                                <AnimatePresence>
                                    {item.submenu && activeSubmenu === item.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 min-w-[200px] bg-white rounded-xl shadow-xl border border-gray-100 py-2 mt-1"
                                        >
                                            {item.submenu.map((subitem) => (
                                                <Link
                                                    key={subitem.name}
                                                    href={subitem.href}
                                                    className="block px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                                                >
                                                    {subitem.name}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full"
                            onClick={() => openSearch()}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Wishlist */}
                        <Link href="/wishlist" className="relative hidden sm:block">
                            <Button variant="ghost" size="sm" className="rounded-full">
                                <Heart className="h-5 w-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {/* User */}
                        <SignedIn>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: 'w-8 h-8',
                                    },
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <Link href="/sign-in">
                                <Button variant="ghost" size="sm" className="rounded-full">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                        </SignedOut>

                        {/* Cart */}
                        <Button
                            variant="default"
                            size="sm"
                            className="relative flex items-center gap-2 rounded-full bg-black text-white hover:bg-gray-800"
                            onClick={() => openCart()}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            <span className="hidden sm:inline text-sm font-semibold">Cart</span>
                            {cartItemCount > 0 && (
                                <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {cartItemCount}
                                </span>
                            )}
                        </Button>

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden rounded-full"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </nav>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden border-t border-gray-100 bg-white"
                        >
                            <div className="space-y-1 px-6 pb-4 pt-2">
                                {navigation.map((item) => (
                                    <div key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`block py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${item.highlight ? 'text-red-600' : 'text-gray-600 hover:text-black'
                                                }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                        {item.submenu && (
                                            <div className="pl-4 space-y-1">
                                                {item.submenu.map((subitem) => (
                                                    <Link
                                                        key={subitem.name}
                                                        href={subitem.href}
                                                        className="block py-2 text-sm text-gray-500 hover:text-black"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {subitem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
}
