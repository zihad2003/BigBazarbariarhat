'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    User, 
    Package, 
    MapPin, 
    Heart, 
    Bell, 
    Settings, 
    LogOut, 
    ChevronRight,
    LayoutDashboard
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const sidebarItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/account' },
    { label: 'Profile', icon: User, href: '/account/profile' },
    { label: 'My Orders', icon: Package, href: '/account/orders' },
    { label: 'Wishlist', icon: Heart, href: '/account/wishlist' },
    { label: 'Addresses', icon: MapPin, href: '/account/addresses' },
    { label: 'Notifications', icon: Bell, href: '/account/notifications' },
    { label: 'Settings', icon: Settings, href: '/account/settings' },
];

export default function AccountLayoutClient({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=' + pathname);
        }
    }, [status, pathname, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) return null;

    const user = session.user;

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-6 sticky top-28">
                            {/* User Profile Badge */}
                            <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-neutral-100">
                                <div className="relative w-16 h-16 rounded-xl bg-neutral-900 flex items-center justify-center text-white text-xl font-black overflow-hidden mb-3">
                                    {user?.image ? (
                                        <Image src={user.image} alt={user.name || ''} fill className="object-cover" />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                </div>
                                <h2 className="font-black text-neutral-900 text-sm uppercase tracking-tight">{user?.name || 'Customer'}</h2>
                                <p className="text-[11px] text-neutral-400 break-all font-medium mt-1 leading-relaxed px-2">{user?.email}</p>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-1">
                                {sidebarItems.map((item) => {
                                    const isActive = item.href === '/account' 
                                        ? pathname === '/account' 
                                        : pathname.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-[11px] font-bold uppercase tracking-widest",
                                                isActive 
                                                    ? "bg-neutral-900 text-white" 
                                                    : "text-neutral-400 hover:bg-white hover:text-neutral-900"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}

                                {/* Sign Out */}
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-[11px] uppercase tracking-widest mt-6"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {children}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation - Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-100 px-4 py-3 z-50">
                <div className="flex items-center justify-between">
                    {sidebarItems.slice(0, 5).map((item) => {
                        const isActive = item.href === '/account' 
                            ? pathname === '/account' 
                            : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
                                    isActive ? "text-neutral-900" : "text-neutral-300"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                                <span className="text-[8px] font-black uppercase tracking-widest">
                                    {item.label === 'Dashboard' ? 'Home' : item.label.split(' ')[0]}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
