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
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { useWishlistStore } from '@/store/wishlistStore';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice, cn } from '@/lib/utils';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { Breadcrumbs } from '@/components/shop/breadcrumbs';

export default function WishlistPage() {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const { addItem } = useCartStore();
    const { addNotification } = useUIStore();
    const router = useRouter();

    const handleOrderNow = (product: any) => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image || '/placeholder.png',
            quantity: 1,
            stock: 100,
        });
        router.push('/checkout');
    };

    const handleRemove = (productId: string, name: string) => {
        removeItem(productId);
        addNotification({
            type: 'info',
            message: `${name} removed from wishlist`
        });
    };

    const handleMoveAllToCheckout = () => {
        items.forEach(item => {
            if (item) {
                addItem({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image || '/placeholder.png',
                    quantity: 1,
                    stock: 100,
                });
            }
        });
        clearWishlist();
        addNotification({
            type: 'success',
            message: language === 'bn' ? 'সব পণ্য চেকআউটে পাঠানো হয়েছে' : 'All items moved to checkout'
        });
        router.push('/checkout');
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Top delicate accent border */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent w-full" />
            
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                <div className="mb-6">
                    <Breadcrumbs 
                        items={[
                            { label: language === 'bn' ? 'উইশলিস্ট' : 'Wishlist', active: true }
                        ]} 
                    />
                </div>

                {/* Luxury Visual Navigation Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-gray-100 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <Link href="/products" className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all">
                            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all duration-300">
                                <ArrowLeft className="h-3.5 w-3.5" />
                            </div>
                            {language === 'bn' ? 'শপিং চালিয়ে যান' : 'Continue Shopping'}
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-playfair font-black text-gray-900 tracking-tight leading-none uppercase">
                            {language === 'bn' ? 'আপনার উইশলিস্ট' : 'Your Wishlist'}
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-end w-full md:w-auto self-stretch md:self-auto"
                    >
                        <div className="flex flex-col items-start md:items-end">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                {language === 'bn' ? 'সংরক্ষিত পণ্য' : 'Saved Items'}
                            </span>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-5 py-3 rounded-xl shadow-sm">
                                <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 font-mono">
                                    {items.length} {language === 'bn' ? 'টি পণ্য' : `Item${items.length !== 1 ? 's' : ''}`}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <AnimatePresence mode="popLayout">
                    {items.length > 0 ? (
                        <div className="space-y-16 animate-in fade-in duration-500">
                            {/* Product List Grid */}
                            <motion.div
                                layout
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
                            >
                                {items.map((item, index) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.04 }}
                                        className="group relative flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Luxury Aspect Box */}
                                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 border border-gray-100 bg-gray-50 transition-all duration-700 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] hover:border-transparent">
                                                <Link href={`/products/${item.slug || item.productId}`}>
                                                    <Image
                                                        src={item.image || '/placeholder.png'}
                                                        alt={item.name || 'Product'}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                                    />
                                                </Link>
     
                                                 {/* Discard Control Overlay */}
                                                 <button
                                                     onClick={() => handleRemove(item.productId, item.name || 'Product')}
                                                     className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-white transition-all shadow-md z-20"
                                                     aria-label="Remove item"
                                                 >
                                                     <Trash2 className="h-4 w-4" />
                                                 </button>
     
                                                 {/* Top Left Status Badge */}
                                                 <div className="absolute top-3 left-3 pointer-events-none">
                                                     <span className="bg-black/80 backdrop-blur-sm text-white text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-md">
                                                         Saved
                                                     </span>
                                                 </div>
                                            </div>
     
                                            {/* Details Block */}
                                            <div className="px-1 space-y-1">
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block">
                                                    {item.category || 'Collection'}
                                                </span>
                                                <h3 className="text-xs md:text-sm font-black text-gray-900 group-hover:text-luxury-gold transition-colors leading-tight tracking-tight min-h-[2rem] line-clamp-2">
                                                    <Link href={`/products/${item.slug || item.productId}`}>
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="px-1 pt-3 border-t border-gray-50 mt-3 flex flex-col gap-2">
                                            <span className="text-xs md:text-lg font-black text-gray-900 font-mono tracking-tighter">
                                                {formatPrice(item.price || 0, language)}
                                            </span>
                                            
                                            <Button
                                                onClick={() => handleOrderNow({
                                                    id: item.productId,
                                                    name: item.name,
                                                    price: item.price,
                                                    image: item.image,
                                                    slug: item.slug
                                                })}
                                                className="w-full bg-black text-white hover:bg-gray-800 rounded-lg h-9 text-[9px] font-bold uppercase tracking-widest gap-2 shadow-sm transition-all duration-300"
                                            >
                                                <ArrowRight className="h-3 w-3" />
                                                {t?.common?.orderNow || 'Order Now'}
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Batch Operation Banner */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mt-20 p-8 md:p-12 bg-gray-950 rounded-2xl text-white relative overflow-hidden group shadow-xl border border-white/5"
                            >
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-luxury-gold/5 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-luxury-gold/15 transition-all duration-1000" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                                    <div className="space-y-2">
                                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-luxury-gold mb-2">
                                            <Sparkles className="h-5 w-5 animate-spin-slow" />
                                        </div>
                                        <h3 className="text-3xl font-playfair font-black tracking-tight leading-none uppercase">
                                            {language === 'bn' ? 'সম্পূর্ণ তালিকাটি অর্ডার করুন' : 'Order whole list'}
                                        </h3>
                                        <p className="text-gray-400 font-medium text-sm max-w-sm">
                                            {language === 'bn' 
                                                ? 'তাত্ক্ষণিকভাবে কেনাকাটা সম্পন্ন করতে আপনার সংরক্ষিত সব পণ্য চেকআউটে স্থানান্তরিত করুন।' 
                                                : 'Move all your saved items into checkout for a quick order.'}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleMoveAllToCheckout}
                                        className="bg-white text-gray-950 hover:bg-luxury-gold hover:text-luxury-black rounded-lg h-14 px-10 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all duration-500 hover:scale-[1.02]"
                                    >
                                        <ArrowRight className="h-4 w-4 mr-2" />
                                        {language === 'bn' ? 'সবগুলো অর্ডার করুন' : 'Order All Now'}
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Premium Empty State */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-28 bg-gray-50 rounded-2xl border border-gray-100"
                        >
                            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md relative group overflow-hidden border border-gray-100">
                                <Heart className="h-10 w-10 text-gray-200 group-hover:text-rose-400 group-hover:scale-110 transition-all duration-500" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-playfair font-black text-gray-900 mb-3 tracking-tight uppercase">
                                {language === 'bn' ? 'আপনার উইশলিস্ট খালি' : 'Your Wishlist is Empty'}
                            </h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm md:text-base font-serif italic">
                                {language === 'bn' 
                                    ? 'আমাদের নতুন কালেকশন দেখুন এবং আপনার পছন্দের পোশাকগুলো এখানে সংরক্ষণ করুন।' 
                                    : 'Explore our latest arrivals and save your favorite pieces to compile your dream collection.'}
                            </p>
                            <Link href="/products">
                                <Button className="bg-black text-white hover:bg-gray-800 rounded-lg px-8 h-12 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-all">
                                    {language === 'bn' ? 'ক্যাটালগ দেখুন' : 'Explore Catalog'} <ArrowRight className="h-4 w-4 ml-2 inline" />
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
