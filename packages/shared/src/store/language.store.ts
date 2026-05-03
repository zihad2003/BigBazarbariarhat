import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'bn';

export const translations = {
    en: {
        common: {
            shopNow: 'Shop Now',
            explore: 'Explore',
            viewAll: 'View All',
            search: 'Search products...',
            loading: 'Loading...',
            addToCart: 'Add to Cart',
            added: 'Added',
            cart: 'Cart',
            wishlist: 'Wishlist',
            account: 'Account',
            checkout: 'Checkout',
            total: 'Total',
            subtotal: 'Subtotal',
            shipping: 'Shipping',
            free: 'Free',
            back: 'Back',
            next: 'Next',
            previous: 'Previous'
        },
        hero: {
            title: 'Refined Elegance',
            subtitle: 'Discover our curated collection of premium fashion items, designed for modern elegance and unparalleled comfort.',
            cta: 'Shop Collection',
            featured: 'Featured Masterpiece',
            premiumCollection: 'Premium Collection',
            slide1Title: 'New Season Collection',
            slide1Subtitle: "Women's Fashion 2026",
            slide2Title: 'Premium Menswear',
            slide2Subtitle: 'Crafted for the Modern Man',
            slide3Title: 'Flash Sale',
            slide3Subtitle: 'Up to 50% Off — Limited Time',
        },
        features: {
            freeShipping: 'Free Shipping',
            freeShippingDesc: 'On orders over ৳2000',
            easyReturns: 'Easy Returns',
            easyReturnsDesc: '30-day return policy',
            securePayment: 'Secure Payment',
            securePaymentDesc: '100% secure checkout',
            support: '24/7 Support',
            supportDesc: 'Always here to help',
        },
        categories: {
            title: 'Shop By Category',
            men: 'Men',
            menDesc: 'Sophisticated Style',
            women: 'Women',
            womenDesc: 'Timeless Beauty',
            kidsBoys: 'Kids(Boys)',
            kidsGirls: 'Kids(Girls)',
            kidsDesc: 'Playful Luxury',
            weddingTouch: 'Wedding Touch',
            weddingDesc: 'Traditional Elegance',
            accessories: 'Accessories',
            accessoriesDesc: 'Perfect Accents',
        },
        trending: {
            title: 'Trending Now',
            viewAll: 'View All',
        },
        newArrivals: {
            title: 'New Arrivals',
            subtitle: 'This Week\'s Selection',
            viewAll: 'View All Collections',
        }
    },
    bn: {
        common: {
            shopNow: 'এখনই কিনুন',
            explore: 'অন্বেষণ করুন',
            viewAll: 'সবগুলো দেখুন',
            search: 'পণ্য খুঁজুন...',
            loading: 'অপেক্ষা করুন...',
            addToCart: 'কার্টে যোগ করুন',
            added: 'যোগ করা হয়েছে',
            cart: 'কার্ট',
            wishlist: 'উইশলিস্ট',
            account: 'অ্যাকাউন্ট',
            checkout: 'চেকআউট',
            total: 'মোট',
            subtotal: 'সাবটোটাল',
            shipping: 'শিপিং',
            free: 'ফ্রি',
            back: 'পিছনে',
            next: 'পরবর্তী',
            previous: 'পূর্ববর্তী'
        },
        hero: {
            title: 'মার্জিত শৈলী',
            subtitle: 'আধুনিক কমনীয়তা এবং অতুলনীয় আরামের জন্য ডিজাইন করা আমাদের প্রিমিয়াম ফ্যাশন আইটেমগুলির সংগ্রহ আবিষ্কার করুন।',
            cta: 'কালেকশন দেখুন',
            featured: 'সেরা পণ্য',
            premiumCollection: 'প্রিমিয়াম কালেকশন',
            slide1Title: 'নতুন সিজন কালেকশন',
            slide1Subtitle: "মহিলাদের ফ্যাশন ২০২৬",
            slide2Title: 'প্রিমিয়াম মেন্সওয়্যার',
            slide2Subtitle: 'আধুনিক পুরুষের জন্য তৈরি',
            slide3Title: 'ফ্ল্যাশ সেল',
            slide3Subtitle: '৫০% পর্যন্ত ছাড় — সীমিত সময়ের জন্য',
        },
        features: {
            freeShipping: 'ফ্রি শিপing',
            freeShippingDesc: '৳২০০০ এর উপরে অর্ডারে',
            easyReturns: 'সহজ রিটার্ন',
            easyReturnsDesc: '৩০ দিনের রিটার্ন পলিসি',
            securePayment: 'নিরাপদ পেমেন্ট',
            securePaymentDesc: '১০০% নিরাপদ চেকআউট',
            support: '২৪/৭ সাপোর্ট',
            supportDesc: 'সবসময় আপনার পাশে',
        },
        categories: {
            title: 'বিভাগ অনুযায়ী কেনাকাটা করুন',
            men: 'পুরুষ',
            menDesc: 'অভিজাত শৈলী',
            women: 'মহিলা',
            womenDesc: 'চিরন্তন সৌন্দর্য',
            kidsBoys: 'শিশু (ছেলে)',
            kidsGirls: 'শিশু (মেয়ে)',
            kidsDesc: 'চমকপ্রদ বিলাসিতা',
            weddingTouch: 'ওয়েডিং টাচ',
            weddingDesc: 'ঐতিহ্যবাহী কমনীয়তা',
            accessories: 'আনুষঙ্গিক',
            accessoriesDesc: 'নিখুঁত ছোঁয়া',
        },
        trending: {
            title: 'ট্রেন্ডিং এখন',
            viewAll: 'সবগুলো দেখুন',
        },
        newArrivals: {
            title: 'নতুন কালেকশন',
            subtitle: 'এই সপ্তাহের সেরা পছন্দ',
            viewAll: 'সব কালেকশন দেখুন',
        }
    }
};

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'en',
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'language-storage',
        }
    )
);

export const useTranslation = () => {
    const { language } = useLanguageStore();
    return translations[language];
};
