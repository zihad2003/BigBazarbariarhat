'use client';

import {
    Heart,
    ShoppingCart,
    Trash2,
    ArrowLeft,
    ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/stores/cart-store';
import { useUIStore } from '@/lib/stores/ui-store';

export default function WishlistPage() {
    // This would typically come from a wishlist store or API
    // Mocking for now as the user asked for actual database interaction later
    const wishlistItems = [
        {
            id: '1',
            name: 'Premium Silk Panjabi',
            price: 4500,
            image: 'https://images.unsplash.com/photo-1598378294821-43f984447c49?q=80&w=800',
            category: 'Ethnic Wear',
            brand: 'Big Bazar Originals'
        },
        {
            id: '2',
            name: 'Fine Cotton Saree',
            price: 3200,
            image: 'https://images.unsplash.com/photo-1610030469668-93510cb67c82?q=80&w=800',
            category: 'Traditional',
            brand: 'Big Bazar Originals'
        },
    ];

    const { addItem } = useCartStore();
    const { addNotification } = useUIStore();

    const handleAddToCart = (product: any) => {
        addItem({
            id: product.id,
            name: product.name,
            basePrice: product.price,
            images: [{ url: product.image }],
        } as any, 1);
        addNotification({ type: 'success', message: 'Added to your curation' });
    };

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-4 uppercase tracking-widest">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Saved Collection</h1>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                    <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                    <span className="text-sm font-black uppercase tracking-widest">{wishlistItems.length} Selection{wishlistItems.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[8rem] opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-8 border border-gray-50">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <button className="absolute top-4 right-4 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.category}</p>
                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{item.brand}</p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <span className="text-3xl font-black text-black">৳{item.price.toLocaleString()}</span>
                                    <Button
                                        onClick={() => handleAddToCart(item)}
                                        className="bg-black text-white hover:bg-gray-800 rounded-2xl h-14 px-6 font-bold gap-3 shadow-xl shadow-black/10"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        Acquire
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-40 bg-gray-50 rounded-[4rem]">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Heart className="h-10 w-10 text-gray-200" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">Your collection is empty</h2>
                    <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg font-medium">
                        Start saving your favorite masterpieces to track them and move them to curation.
                    </p>
                    <Link href="/shop">
                        <Button className="bg-black text-white hover:bg-gray-800 rounded-2xl px-12 h-16 text-lg font-bold shadow-xl shadow-black/10">
                            Explore Catalog
                        </Button>
                    </Link>
                </div>
            )}

            {wishlistItems.length > 0 && (
                <div className="mt-20 p-12 bg-indigo-600 rounded-[4rem] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
                        <div>
                            <h3 className="text-4xl font-black mb-4">Acquire Everything?</h3>
                            <p className="text-indigo-100 font-medium text-lg max-w-md">Move your entire collection to your curation and secure your style in one go.</p>
                        </div>
                        <Button className="bg-white text-indigo-600 hover:bg-gray-100 rounded-3xl h-20 px-12 text-xl font-black shadow-2xl group transition-transform hover:scale-105 active:scale-95">
                            <ShoppingBag className="h-7 w-7 mr-4" />
                            Move All to Cart
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
