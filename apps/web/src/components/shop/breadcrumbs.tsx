'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from '@bigbazar/shared';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    const t = useTranslation();

    return (
        <nav 
            className={cn("flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar py-2", className)}
            aria-label="Breadcrumb"
        >
            <Link 
                href="/" 
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-black transition-all uppercase tracking-widest"
            >
                <Home className="h-3 w-3" />
                {t?.common?.home || 'Home'}
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-gray-300 flex-shrink-0" />
                    {item.href && !item.active ? (
                        <Link 
                            href={item.href}
                            className="text-[10px] font-bold text-gray-400 hover:text-black transition-all uppercase tracking-widest whitespace-nowrap"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <motion.span 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-black text-primary uppercase tracking-widest whitespace-nowrap"
                        >
                            {item.label}
                        </motion.span>
                    )}
                </div>
            ))}
        </nav>
    );
}
