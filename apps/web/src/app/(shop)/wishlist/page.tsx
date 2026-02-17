'use client';

import {
    Heart,
    Trash2,
    ArrowLeft,
    ShoppingBag,
    ArrowRight,
    Sparkles,
    Info,
    LayoutGrid
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@bigbazar/shared';
import { useUIStore } from '@/lib/stores/ui-store';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice, cn } from '@/lib/utils';

export default function WishlistPage() {
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const { addItem } = useCartStore();
    const { addNotification, openCart } = useUIStore();

    const handleAddToCart = (product: any) => {
        addItem(product, 1);
        addNotification({
            type: 'success',
            message: `${product.name} appended to curation`
        });
        openCart();
    };

    const handleRemove = (productId: string, name: string) => {
        removeItem(productId);
        addNotification({
            type: 'info',
            message: `${name} removed from collection`
        });
    };

    const handleMoveAllToCart = () => {
        items.forEach(item => {
            if (item.product) {
                addItem(item.product as any, 1);
            }
        });
        clearWishlist();
        addNotification({
            type: 'success',
            message: 'Entire collection moved to curation'
        });
        openCart();
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">

                {/* Visual Navigation Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <Link href="/account" className="group flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                <ArrowLeft className="h-5 w-5" />
                            </div>
                            Return to Portfolio
                        </Link>
                        <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Saved <br /> Collections.
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-8"
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Current Artifacts</span>
                            <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-[1.5rem] border border-gray-50">
                                <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">{items.length} Artifact{items.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <AnimatePresence mode="popLayout">
                    {items.length > 0 ? (
                        <div className="space-y-12">
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16"
                            >
                                {items.map((item, index) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group"
                                    >
                                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-8 border border-gray-100 bg-gray-50 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:border-transparent">
                                            <Link href={`/products/${item.product?.slug || item.productId}`}>
                                                <Image
                                                    src={item.product?.images?.[0]?.url || '/placeholder.png'}
                                                    alt={item.product?.name || 'Product'}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                            </Link>

                                            {/* Discard Control */}
                                            <button
                                                onClick={() => handleRemove(item.productId, item.product?.name || 'Product')}
                                                className="absolute top-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-[1.2rem] flex items-center justify-center text-gray-300 hover:text-rose-500 transition-all shadow-xl z-20 opacity-0 lg:group-hover:opacity-100 lg:translate-x-4 lg:group-hover:translate-x-0"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>

                                            {/* Mobile Discard Control */}
                                            <button
                                                onClick={() => handleRemove(item.productId, item.product?.name || 'Product')}
                                                className="lg:hidden absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-rose-500 shadow-xl z-20"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>

                                            {/* Top Left Badge */}
                                            <div className="absolute top-8 left-8">
                                                <span className="bg-indigo-600 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl shadow-indigo-500/20">
                                                    Saved Entry
                                                </span>
                                            </div>
                                        </div>

                                        <div className="px-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{item.product?.category?.name || 'Big Bazar Artifact'}</span>
                                                <div className="h-px w-8 bg-gray-100" />
                                            </div>

                                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-[1.1] tracking-tight uppercase">
                                                <Link href={`/products/${item.product?.slug || item.productId}`}>
                                                    {item.product?.name}
                                                </Link>
                                            </h3>

                                            <div className="flex items-center justify-between pt-4">
                                                <span className="text-3xl font-black text-gray-900 font-mono tracking-tighter">
                                                    {formatPrice(item.product?.salePrice || item.product?.basePrice || 0)}
                                                </span>
                                                <Button
                                                    onClick={() => handleAddToCart(item.product)}
                                                    className="bg-black text-white hover:bg-gray-800 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] gap-3 shadow-2xl shadow-black/10 transition-all hover:scale-105 active:scale-95"
                                                >
                                                    <ShoppingBag className="h-4 w-4" />
                                                    Reinstate
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Batch Operation Module */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mt-32 p-16 bg-gray-900 rounded-[4rem] text-white relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -mr-40 -mt-20 group-hover:bg-indigo-600/10 transition-colors duration-1000" />
                                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-indigo-400 mb-4">
                                            <Sparkles className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">Acquisition <br /> Protocols.</h3>
                                        <p className="text-gray-400 font-medium text-lg max-w-sm">Synchronize your entire saved collection with your active curation matrix in one command.</p>
                                    </div>
                                    <Button
                                        onClick={handleMoveAllToCart}
                                        className="bg-white text-gray-900 hover:bg-indigo-600 hover:text-white rounded-[2.5rem] h-24 px-16 text-xs font-black uppercase tracking-[0.3em] shadow-2xl group transition-all duration-500 hover:scale-105 active:scale-95 border-none"
                                    >
                                        <ShoppingBag className="h-6 w-6 mr-4 group-hover:rotate-12 transition-transform" />
                                        Execute Batch Move
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-40 bg-gray-50 rounded-[5rem] border border-gray-100"
                        >
                            <div className="w-40 h-40 bg-white rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-100 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-indigo-600 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full opacity-5" />
                                <Heart className="h-16 w-16 text-gray-200 group-hover:text-rose-400 group-hover:scale-110 transition-all duration-500" />
                            </div>
                            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase">Collection Vacant.</h2>
                            <p className="text-gray-500 mb-12 max-w-lg mx-auto text-xl font-medium font-serif italic">
                                Your curated archive awaits its first artifacts. Explore our latest masterworks and begin your curation protocol.
                            </p>
                            <Link href="/shop">
                                <Button className="bg-black text-white hover:bg-gray-800 rounded-[2.5rem] px-16 h-20 text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/20 hover:scale-105 transition-all">
                                    Launch Gallery <ArrowRight className="h-5 w-5 ml-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Logistics Info Module */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { icon: Info, label: 'Curator Support', desc: 'Direct access to archive specialists' },
                        { icon: LayoutGrid, label: 'Custom Curation', desc: 'Artifact grouping & organization' },
                        { icon: Sparkles, label: 'Priority Access', desc: 'Notifications on archive updates' }
                    ].map((feature, i) => (
                        <div key={i} className="flex flex-col gap-6 p-10 bg-white rounded-[3rem] border border-gray-50 hover:border-gray-100 transition-all hover:bg-gray-50/30">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                <feature.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 mb-2">{feature.label}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-relaxed opacity-60">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
