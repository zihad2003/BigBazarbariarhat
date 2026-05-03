'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, Heart, User } from 'lucide-react';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
    const t = useTranslation();
    const pathname = usePathname();
    const cartCount = useCartStore(state => state.getItemCount());
    const wishlistCount = useWishlistStore(state => state.getItemCount());

    const navItems = [
        { label: t?.common?.back || 'Home', icon: Home, href: '/' },
        { label: t?.categories?.title || 'Sectors', icon: LayoutGrid, href: '/products' },
        { label: t?.common?.cart || 'Cart', icon: ShoppingBag, href: '/cart', badge: cartCount },
        { label: t?.common?.wishlist || 'Wishlist', icon: Heart, href: '/wishlist', badge: wishlistCount },
        { label: t?.common?.account || 'Account', icon: User, href: '/account' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 pb-6 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
            <div className="flex items-center justify-between gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link 
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-300 relative",
                                isActive ? "bg-black text-white scale-110 shadow-lg shadow-black/20" : "text-slate-400 hover:text-black"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "stroke-[2]")} />
                            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                            
                            {(item.badge ?? 0) > 0 && !isActive && (
                                <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
