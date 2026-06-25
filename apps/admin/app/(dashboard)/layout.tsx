'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Package, ShoppingCart, Users, Settings,
    Menu, X, ChevronDown, TrendingUp, Percent, Bell, Search, User, LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ThemeSwitcher } from '@/components/theme-switcher';

/* ──────────────────── Navigation config ──────────────────── */

type NavItem = {
    label: string;
    href?: string;
    icon: any;
    children?: { label: string; href: string }[];
};

const nav: NavItem[] = [
    { label: 'Home', href: '/', icon: LayoutDashboard },
    {
        label: 'Products', icon: Package, children: [
            { label: 'All Products', href: '/products' },
            { label: 'Categories', href: '/categories' },
            { label: 'Inventory', href: '/inventory' },
        ],
    },
    { label: 'Orders', href: '/orders', icon: ShoppingCart },
    { label: 'Customers', href: '/customers', icon: Users },
    {
        label: 'Marketing', icon: Percent, children: [
            { label: 'Coupons', href: '/marketing/coupons' },
            { label: 'Banners', href: '/marketing/banners' },
        ],
    },
    { label: 'Reports', href: '/analytics', icon: TrendingUp },
    { label: 'Settings', href: '/settings', icon: Settings },
];

/* ──────────────────── Layout ──────────────────── */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState<string[]>(['Products']);
    const path = usePathname();

    const toggle = (label: string) =>
        setExpanded(p => (p.includes(label) ? p.filter(i => i !== label) : [...p, label]));
    const active = (href: string) => path === href || path.startsWith(href + '/');

    // Close mobile sidebar on route change
    useEffect(() => {
        setOpen(false);
    }, [path]);
    
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    return (
        <div className="flex min-h-screen bg-background">

            {/* ── Backdrop (mobile) ── */}
            {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col
                bg-card border-r border-border
                transition-transform duration-200 ease-out
                lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between h-14 px-5 border-b border-border shrink-0">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-[11px] font-bold text-primary-foreground">BB</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">Big Bazar</span>
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Admin</span>
                    </Link>
                    <button className="lg:hidden p-1 rounded hover:bg-muted" onClick={() => setOpen(false)}>
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
                    {nav.map(item => (
                        <div key={item.label}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => toggle(item.label)}
                                        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                    >
                                        <span className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded.includes(item.label) ? 'rotate-180' : ''}`} />
                                    </button>
                                    {expanded.includes(item.label) && (
                                        <div className="ml-[26px] mt-0.5 space-y-0.5 border-l border-border pl-3">
                                            {item.children.map(child => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={`block px-3 py-1.5 rounded-md text-[13px] transition-colors ${path === child.href
                                                        ? 'text-primary font-semibold bg-primary/5'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                                        }`}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href!}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${active(item.href!)
                                        ? 'text-primary bg-primary/5 font-semibold'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User (bottom) */}
                <div className="border-t border-border p-3 shrink-0">
                    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-medium text-foreground truncate">Admin</p>
                                <p className="text-[11px] text-muted-foreground truncate">admin@bigbazar.com</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 lg:pl-[260px] flex flex-col min-h-screen min-w-0 overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-md border-b border-border shrink-0">
                    <div className="flex items-center justify-between h-full px-4 lg:px-6">
                        <div className="flex items-center gap-3">
                            <button className="lg:hidden p-1.5 rounded-lg hover:bg-muted" onClick={() => setOpen(true)}>
                                <Menu className="w-5 h-5" />
                            </button>

                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeSwitcher />
                            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                                <Bell className="w-4 h-4 text-muted-foreground" />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 lg:p-6 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
