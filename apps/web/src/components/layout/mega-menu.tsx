'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface SubMenuItem {
    name: string;
    href: string;
}

interface MegaMenuProps {
    isOpen: boolean;
    items: SubMenuItem[];
    categoryName: string;
    featuredImage?: string; // URL for the featured image
}

export function MegaMenu({ isOpen, items, categoryName, featuredImage }: MegaMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="w-full bg-white border border-gray-200 shadow-2xl z-50 px-8 py-8 rounded-b-sm"
                >
                    <div className="grid grid-cols-12 gap-8">
                        {/* Links Column - Spans 8 columns */}
                        <div className="col-span-8 grid grid-cols-4 gap-y-6 gap-x-8">
                            {/* Assuming items are flattened, we can group them or just list them. 
                                Ideally, we'd have sub-categories. For now, we'll list them with a 'Shop All' feel. */}

                            <div className="col-span-4 mb-4 pb-2 border-b border-gray-200">
                                <h3 className="font-playfair text-xl font-bold text-black">
                                    Shop {categoryName}
                                </h3>
                            </div>

                            {items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group flex flex-col gap-1"
                                >
                                    <span className="font-bold text-sm text-black group-hover:text-red-700 transition-colors uppercase tracking-wide">
                                        {item.name}
                                    </span>
                                    <span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors">
                                        View Collection
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Featured Image Column - Spans 4 columns */}
                        <div className="col-span-4 bg-muted rounded-sm overflow-hidden relative min-h-[250px] group">
                            {featuredImage ? (
                                <Image
                                    src={featuredImage}
                                    alt={`Featured ${categoryName}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 flex items-center justify-center">
                                    <span className="font-playfair font-bold text-2xl text-gray-500 group-hover:text-destructive transition-colors">
                                        {categoryName} Collection
                                    </span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <button className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 w-fit">
                                    Explore New Arrivals <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
