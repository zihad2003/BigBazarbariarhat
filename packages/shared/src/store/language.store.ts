import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'bn';

export const translations = {
    en: {
        hero: {
            title: 'Refined Elegance',
            subtitle: 'Discover our curated collection of premium fashion items, designed for modern elegance and unparalleled comfort.',
            cta: 'Shop Collection',
            featured: 'Featured Masterpiece',
            premiumCollection: 'Premium Collection',
        },
        features: {
            premiumQuality: 'Premium Quality',
            premiumQualityDesc: 'Crafted with finest materials',
            exclusiveDesigns: 'Exclusive Designs',
            exclusiveDesignsDesc: 'Limited edition collections',
            luxuryExperience: 'Luxury Experience',
            luxuryExperienceDesc: 'White-glove service',
            authenticGuarantee: 'Authentic Guarantee',
            authenticGuaranteeDesc: '100% genuine products',
        },
        categories: {
            men: 'Men',
            menDesc: 'Sophisticated Style',
            women: 'Women',
            womenDesc: 'Timeless Beauty',
            kids: 'Kids',
            kidsDesc: 'Playful Luxury',
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
        },
        footer: {
            freeShipping: 'Free Shipping',
            freeShippingDesc: 'On orders over ৳2000',
            support: '24/7 Support',
            supportDesc: 'Dedicated assistance',
            returns: '30 Days Returns',
            returnsDesc: 'Easy return policy',
            secure: 'Secure Payment',
            secureDesc: '100% safe checkout',
        }
    },
    bn: {
        hero: {
            title: 'মার্জিত শৈলী',
            subtitle: 'আধুনিক কমনীয়তা এবং অতুলনীয় আরামের জন্য ডিজাইন করা আমাদের প্রিমিয়াম ফ্যাশন আইটেমগুলির সংগ্রহ আবিষ্কার করুন।',
            cta: 'কেনাকাটা করুন',
            featured: 'সেরা পণ্য',
            premiumCollection: 'প্রিমিয়াম কালেকশন',
        },
        features: {
            premiumQuality: 'প্রিমিয়াম কোয়ালিটি',
            premiumQualityDesc: 'সেরা উপকরণ দিয়ে তৈরি',
            exclusiveDesigns: 'এক্সক্লুসিভ ডিজাইন',
            exclusiveDesignsDesc: 'লিমিটেড এডিশন কালেকশন',
            luxuryExperience: 'বিলাসিতা অভিজ্ঞতা',
            luxuryExperienceDesc: 'সেরা পরিষেবা',
            authenticGuarantee: 'আসল গ্যারান্টি',
            authenticGuaranteeDesc: '১০০% খাঁটি পণ্য',
        },
        categories: {
            men: 'পুরুষ',
            menDesc: 'অভিজাত শৈলী',
            women: 'মহিলা',
            womenDesc: 'চিরন্তন সৌন্দর্য',
            kids: 'শিশু',
            kidsDesc: 'চমকপ্রদ বিলাসিতা',
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
        },
        footer: {
            freeShipping: 'ফ্রি শিপিং',
            freeShippingDesc: '৳২০০০ এর উপরে অর্ডারে',
            support: '২৪/৭ সাপোর্ট',
            supportDesc: 'সার্বক্ষণিক সহায়তা',
            returns: '৩০ দিন রিটার্ন',
            returnsDesc: 'সহজ রিটার্ন পলিসি',
            secure: 'নিরাপদ পেমেন্ট',
            secureDesc: '১০০% নিরাপদ চেকআউট',
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
