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
    selectSize: { bn: 'অনুগ্রহ করে একটি সাইজ সিলেক্ট করুন', en: 'Please select a size' },
    selectColor: { bn: 'অনুগ্রহ করে একটি কালার সিলেক্ট করুন', en: 'Please select a color' },
    default: { bn: 'ডিফল্ট', en: 'Default' },
    addedToCartWithVariant: { bn: 'কার্টে যোগ করা হয়েছে।', en: 'added to cart.' },
  },
  wishlist: {
    allItemsMoved: { bn: 'সব পণ্য চেকআউটে পাঠানো হয়েছে', en: 'All items moved to checkout' },
    continueShopping: { bn: 'শপিং চালিয়ে যান', en: 'Continue Shopping' },
    yourWishlist: { bn: 'আপনার উইশলিস্ট', en: 'Your Wishlist' },
    savedItems: { bn: 'সংরক্ষিত পণ্য', en: 'Saved Items' },
    items: { bn: 'টি পণ্য', en: 'Items' },
    orderWholeList: { bn: 'সম্পূর্ণ তালিকাটি অর্ডার করুন', en: 'Order whole list' },
    orderAllNow: { bn: 'সবগুলো অর্ডার করুন', en: 'Order All Now' },
    emptyWishlist: { bn: 'আপনার উইশলিস্ট খালি', en: 'Your Wishlist is Empty' },
    emptyWishlistDesc: { bn: 'আমাদের নতুন কালেকশন দেখুন এবং আপনার পছন্দের পোশাকগুলো এখানে সংরক্ষণ করুন।', en: 'Explore our latest arrivals and save your favorite pieces to compile your dream collection.' },
    moveAllToCheckout: { bn: 'তাত্ক্ষণিকভাবে কেনাকাটা সম্পন্ন করতে আপনার সংরক্ষিত সব পণ্য চেকআউটে স্থানান্তরিত করুন।', en: 'Move all your saved items into checkout for a quick order.' },
    exploreCatalog: { bn: 'ক্যাটালগ দেখুন', en: 'Explore Catalog' },
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
  checkout: {
    sendMoney: { bn: 'টাকা পাঠান এই নাম্বারে', en: 'Send Money to this number' },
    personal: { bn: 'ব্যক্তিগত', en: 'Personal' },
  },
  home: {
    flashSale: { bn: 'ফ্ল্যাশ সেল', en: 'Flash Sale' },
    limitedTimeOffer: { bn: 'সীমিত সময়ের অফার', en: 'Limited time offer' },
    hours: { bn: 'ঘণ্টা', en: 'H' },
    minutes: { bn: 'মিনিট', en: 'M' },
    seconds: { bn: 'সেকেন্ড', en: 'S' },
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
