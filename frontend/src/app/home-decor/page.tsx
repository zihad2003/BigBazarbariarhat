'use client';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';

const homeDecorProducts = [
  {
    name: "Traditional Nakshi Kantha",
    bengaliName: "ঐতিহ্যবাহী নকশি কাঁথা",
    price: 3500,
    image: "/assets/home_decor_product/nakshi_kantha1.jpg",
    category: "Heritage Crafts"
  },
  {
    name: "Handwoven Jamdani Table Runner",
    bengaliName: "হাতে বোনা জামদানি টেবিল রানার",
    price: 1800,
    image: "/assets/home_decor_product/jamdani_runner1.jpg",
    category: "Handloom"
  },
  {
    name: "Clay Pottery Set",
    bengaliName: "মাটির পাত্র সেট",
    price: 1200,
    image: "/assets/home_decor_product/clay_pottery1.jpg",
    category: "Traditional Crafts"
  },
  {
    name: "Bamboo Craft Basket",
    bengaliName: "বাঁশের কাজের ঝুড়ি",
    price: 800,
    image: "/assets/home_decor_product/bamboo_basket1.jpg",
    category: "Eco Crafts"
  },
  {
    name: "Traditional Wall Hanging",
    bengaliName: "ঐতিহ্যবাহী দেয়াল ঝুলন্ত",
    price: 2200,
    image: "/assets/home_decor_product/wall_hanging1.jpg",
    category: "Heritage Crafts"
  },
  {
    name: "Hand-painted Terracotta",
    bengaliName: "হাতে আঁকা টেরাকোটা",
    price: 1500,
    image: "/assets/home_decor_product/terracotta1.jpg",
    category: "Traditional Crafts"
  }
];

export default function HomeDecorPage() {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    loadTranslations(savedLang);
    
    const handleLanguageChange = () => {
      const savedLang = localStorage.getItem('language') || 'en';
      setLanguage(savedLang);
      loadTranslations(savedLang);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const loadTranslations = (lang: string) => {
    const trans = {
      en: {
        title: "Traditional Bangladeshi Home Decor",
        subtitle: "Authentic Handicrafts, Heritage Items & Eco-Friendly Crafts",
        heritageCrafts: "Heritage Crafts",
        handloom: "Handloom",
        traditionalCrafts: "Traditional Crafts",
        ecoCrafts: "Eco Crafts"
      },
      bn: {
        title: "ঐতিহ্যবাহী বাংলাদেশি হোম ডেকোর",
        subtitle: "আসল হস্তশিল্প, ঐতিহ্যবাহী সামগ্রী ও পরিবেশবান্ধব কারুকাজ",
        heritageCrafts: "ঐতিহ্য কারুকাজ",
        handloom: "হাতে তৈরি",
        traditionalCrafts: "ঐতিহ্যবাহী কারুকাজ",
        ecoCrafts: "পরিবেশবান্ধব কারুকাজ"
      }
    };
    setTranslations(trans[lang as keyof typeof trans]);
  };

  return (
    <main style={{ marginTop: '80px' }}>
      <div className="section-header" style={{ paddingTop: '60px' }}>
        <h1 className={`${language === 'bn' ? 'bengali-text' : ''}`}>
          {translations.title || "Traditional Bangladeshi Home Decor"}
        </h1>
        <p className={`${language === 'bn' ? 'bengali-text' : ''}`}>
          {translations.subtitle || "Authentic Handicrafts, Heritage Items & Eco-Friendly Crafts"}
        </p>
      </div>
      
      <section className="products-section" style={{ paddingTop: '40px' }}>
        <div className="product-grid">
          {homeDecorProducts.map((product, index) => (
            <ProductCard 
              key={index} 
              {...product} 
              category={translations[product.category.toLowerCase().replace(' ', '') as keyof typeof translations] || product.category}
            />
          ))}
        </div>
      </section>
    </main>
  );
}