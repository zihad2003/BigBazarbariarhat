export const translations = {
  common: {
    home: { bn: 'হোম', en: 'Home' },
    shop: { bn: 'বিভাগ', en: 'Shop' },
    cart: { bn: 'কার্ট', en: 'Cart' },
    wishlist: { bn: 'উইশলিস্ট', en: 'Wishlist' },
    account: { bn: 'অ্যাকাউন্ট', en: 'Account' },
    popular: { bn: 'জনপ্রিয়', en: 'Popular' },
    sale: { bn: 'সেল', en: 'Sale' },
    search: { bn: 'অনুসন্ধান', en: 'Search' },
    login: { bn: 'লগইন', en: 'Login' },
    logout: { bn: 'লগআউট', en: 'Logout' },
    signup: { bn: 'সাইনআপ', en: 'Sign Up' },
  },
  categories: {
    men: { bn: 'পুরুষ', en: 'Men' },
    women: { bn: 'মহিলা', en: 'Women' },
    kids: { bn: 'বাচ্চাদের', en: 'Kids' },
  },
  product: {
    addToCart: { bn: 'কার্টে যোগ করুন', en: 'Add to Cart' },
    ordering: { bn: 'অর্ডার হচ্ছে...', en: 'Ordering...' },
    adding: { bn: 'যোগ করা হচ্ছে...', en: 'Adding...' },
    addedToCart: { bn: 'কার্টে যোগ করা হয়েছে', en: 'added to cart' },
    outOfStock: { bn: 'স্টক আউট', en: 'Out of Stock' },
  },
  wishlist: {
    allItemsMoved: { bn: 'সব পণ্য চেকআউটে পাঠানো হয়েছে', en: 'All items moved to checkout' },
  },
  shipping: {
    chittagong: { bn: 'চট্টগ্রাম', en: 'Chittagong' },
    outside: { bn: 'বাইরে', en: 'Outside' },
    chargesApplied: { bn: 'চার্জ চেকআউট স্টেজে প্রয়োগ করা হবে।', en: 'Charges applied at checkout stage.' },
  },
  currency: {
    bdt100: { bn: '৳১০০', en: '৳100' },
    bdt150: { bn: '৳১৫০+', en: '৳150+' },
  },
};

export type TranslationKey = keyof typeof translations;

export function t(key: string, language: 'bn' | 'en' = 'bn'): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return key;
  }
  
  return value?.[language] || value?.en || key;
}
