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
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const sidebarItems = [
    { label: 'Profile', icon: User, href: '/account/profile' },
    { label: 'My Orders', icon: Package, href: '/account/orders' },
    { label: 'Wishlist', icon: Heart, href: '/account/wishlist' },
    { label: 'Addresses', icon: MapPin, href: '/account/addresses' },
    { label: 'Notifications', icon: Bell, href: '/account/notifications' },
    { label: 'Settings', icon: Settings, href: '/account/settings' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=' + pathname);
        }
    }, [status, pathname, router]);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" /></div>;
    }

    if (!session) return null;

    const user = session.user;

    return (
        <div className="bg-[#fafafa] min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-80 shrink-0">
                        <div className="bg-white rounded-[3rem] border border-gray-100 p-8 sticky top-32 shadow-sm">
                            <div className="flex items-center gap-5 mb-10 pb-10 border-b border-gray-50">
                                <div className="relative w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-black/10 overflow-hidden">
                                    {user?.image ? (
                                        <Image src={user.image} alt={user.name || ''} fill className="object-cover" />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="font-black text-gray-900 text-lg truncate uppercase tracking-tight">{user?.name || 'Curator'}</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{user?.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <Link
                                    href="/account"
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl transition-all group",
                                        pathname === '/account' ? "bg-black text-white shadow-xl shadow-black/10" : "text-gray-400 hover:bg-gray-50 hover:text-black"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <LayoutDashboard className="h-5 w-5" />
                                        <span className="text-[11px] font-black uppercase tracking-widest">Dashboard</span>
                                    </div>
                                    <ChevronRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-1", pathname === '/account' ? "text-white" : "text-gray-200")} />
                                </Link>

                                {sidebarItems.map((item) => {
                                    const isActive = pathname.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl transition-all group",
                                                isActive ? "bg-black text-white shadow-xl shadow-black/10" : "text-gray-400 hover:bg-gray-50 hover:text-black"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <item.icon className="h-5 w-5" />
                                                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <ChevronRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-1", isActive ? "text-white" : "text-gray-200")} />
                                        </Link>
                                    );
                                })}

                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-black text-[11px] uppercase tracking-widest mt-10"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Sign Out Protocol
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
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                {sidebarItems.slice(0, 4).map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-all",
                                isActive ? "text-black" : "text-gray-300"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[8px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
                            {isActive && <motion.div layoutId="mobileNav" className="absolute -bottom-1 w-1 h-1 bg-black rounded-full" />}
                        </Link>
                    );
                })}
                <Link
                    href="/account"
                    className={cn(
                        "flex flex-col items-center gap-1.5 px-3 py-1 rounded-xl transition-all",
                        pathname === '/account' ? "text-black" : "text-gray-300"
                    )}
                >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
                </Link>
            </div>
        </div>
    );
}
