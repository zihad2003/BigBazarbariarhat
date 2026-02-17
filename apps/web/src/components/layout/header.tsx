'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, User, Search, Heart, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@bigbazar/shared';
import { MobileMenu } from './mobile-menu';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { MegaMenu } from './mega-menu';
import { SearchOverlay } from './search-overlay';

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
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const { user } = useUser();

    const cartItemCount = useCartStore((state) => state.getItemCount());
    const wishlistCount = useWishlistStore((state) => state.getItemCount());
    const { openSearch, openCart } = useUIStore();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Announcement Bar */}
            <div className="bg-luxury-red text-white text-center py-2.5 text-xs font-bold tracking-[0.2em] uppercase">
                <span className="text-luxury-gold">✦</span> Exclusive Collection: Up to 50% Off <span className="text-luxury-gold">✦</span>
            </div>

            {/* Header */}
            <header
                className={`sticky top-0 z-40 transition-all duration-300 border-b border-luxury-black-lighter ${isScrolled
                    ? 'bg-luxury-black/90 backdrop-blur-md shadow-2xl'
                    : 'bg-luxury-black'
                    }`}
            >
                <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <span className="text-2xl font-black uppercase tracking-[0.15em] text-white group-hover:text-luxury-gold transition-colors duration-300 font-playfair">
                                Big Bazar
                            </span>
                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-luxury-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Mega Menu Trigger */}
                    <div className="hidden lg:flex lg:gap-x-8">
                        {navigation.map((item) => (
                            <div
                                key={item.name}
                                className="group" // Removed 'relative' to allow mega menu to span full width
                                onMouseEnter={() => setActiveSubmenu(item.name)}
                                onMouseLeave={() => setActiveSubmenu(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-1 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${item.highlight
                                        ? 'text-luxury-red-bright hover:text-white'
                                        : 'text-gray-300 hover:text-luxury-gold'
                                        }`}
                                >
                                    {item.name}
                                    {item.submenu && <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />}
                                </Link>

                                {/* Mega Menu */}
                                {item.submenu && (
                                    <div className="absolute left-0 right-0 top-full pt-2 pointer-events-none group-hover:pointer-events-auto">
                                        {/* Wrapper to handle hover gap */}
                                        <MegaMenu
                                            isOpen={activeSubmenu === item.name}
                                            items={item.submenu}
                                            categoryName={item.name}
                                        // You can add logic here to pass specific images for categories
                                        // featuredImage="/images/men-fashion.jpg" 
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:text-luxury-gold hover:bg-transparent transition-colors"
                            onClick={() => openSearch()}
                            aria-label="Search"
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Wishlist */}
                        <Link href="/wishlist" className="relative hidden sm:block" aria-label="View Wishlist">
                            <Button variant="ghost" size="icon" className="text-white hover:text-luxury-gold hover:bg-transparent transition-colors">
                                <Heart className="h-5 w-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-luxury-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
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
                                        avatarBox: 'w-8 h-8 ring-2 ring-luxury-gold/50',
                                    },
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <Link href="/sign-in" aria-label="Sign In">
                                <Button variant="ghost" size="icon" className="text-white hover:text-luxury-gold hover:bg-transparent transition-colors">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                        </SignedOut>

                        {/* Cart */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-white hover:text-luxury-gold hover:bg-transparent transition-colors group"
                            onClick={() => openCart()}
                            aria-label="Open Cart"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {mounted && cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {cartItemCount}
                                </span>
                            )}
                        </Button>

                        <MobileMenu />
                    </div>
                </nav>
            </header>

            {/* Search Overlay */}
            <SearchOverlay />
        </>
    );
}
