'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
    LayoutDashboard, 
    Package, 
    ShoppingBag, 
    Users, 
    Tags, 
    Ticket, 
    Megaphone, 
    BarChart3, 
    Settings, 
    Search, 
    Bell, 
    ChevronLeft, 
    Menu,
    LogOut,
    ExternalLink,
    ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Products', icon: Package, href: '/admin/products' },
    { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { label: 'Customers', icon: Users, href: '/admin/customers' },
    { label: 'Categories', icon: Tags, href: '/admin/categories' },
    { label: 'Banners', icon: ImageIcon, href: '/admin/banners' },
    { label: 'Coupons', icon: Ticket, href: '/admin/coupons' },
    { label: 'Promotions', icon: Megaphone, href: '/admin/promotions' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

import { Image as ImageIcon } from 'lucide-react';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=' + pathname);
        } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
            router.push('/');
        }
    }, [status, session, pathname, router]);

    if (status === 'loading') return <div className="h-screen bg-gray-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (!session || (session?.user as any)?.role !== 'ADMIN') return null;

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex font-sans antialiased text-slate-900">
            
            {/* Sidebar - Desktop */}
            <aside 
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-[#111827] text-slate-300 transition-all duration-300 ease-in-out hidden lg:flex flex-col",
                    isSidebarOpen ? "w-72" : "w-20"
                )}
            >
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/20">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        {isSidebarOpen && (
                            <span className="text-xl font-black text-white tracking-tight">ADMIN<span className="text-indigo-500">.</span></span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1 custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                    isActive 
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                                        : "hover:bg-slate-800/50 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                                {isSidebarOpen && <span className="font-bold text-sm tracking-wide">{item.label}</span>}
                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[60]">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center justify-center h-12 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                    >
                        {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                    <Link 
                        href="/" 
                        className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-white transition-colors mt-4",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <ExternalLink className="h-5 w-5 shrink-0" />
                        {isSidebarOpen && <span className="text-sm font-bold">Storefront</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div 
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300",
                    isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
                )}
            >
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                            {navItems.find(i => i.href === pathname)?.label || 'Administration'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 group focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Global Search..." 
                                className="bg-transparent border-none text-xs font-bold focus:outline-none w-48 text-slate-900" 
                            />
                        </div>
                        <button className="relative p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="h-8 w-px bg-slate-200" />
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-slate-900 leading-none">Admin Curator</p>
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Super User</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg">
                                AD
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 lg:p-12">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-[#111827] z-[70] lg:hidden flex flex-col"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black text-white tracking-tight hover:opacity-85 transition-opacity">
                                    ADMIN<span className="text-indigo-500">.</span>
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                            </div>
                            <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-4 px-4 py-4 rounded-xl transition-all",
                                                isActive ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span className="font-bold text-sm uppercase tracking-wide">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="p-4 border-t border-slate-800">
                                <button 
                                    onClick={() => signOut()}
                                    className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all font-black text-xs uppercase tracking-widest"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Disconnect
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
