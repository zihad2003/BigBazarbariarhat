'use client';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';

const kidsProducts = [
  {
    name: "Traditional Panjabi for Boys",
    bengaliName: "ছেলেদের ঐতিহ্যবাহী পাঞ্জাবি",
    price: 1200,
    image: "/assets/kids_product/boy_panjabi1.jpg",
    category: "Traditional Wear"
  },
  {
    name: "Cotton Frock for Girls",
    bengaliName: "মেয়েদের তাঁতের ফ্রক",
    price: 800,
    image: "/assets/kids_product/girl_frock1.jpg",
    category: "Traditional Wear"
  },
  {
    name: "Kids Kurta Set",
    bengaliName: "শিশুদের কুর্তা সেট",
    price: 950,
    image: "/assets/kids_product/kids_kurta1.jpg",
    category: "Traditional Wear"
  },
  {
    name: "Embroidered Dress for Girls",
    bengaliName: "মেয়েদের সুতার কাজের পোশাক",
    price: 1100,
    image: "/assets/kids_product/girl_dress1.jpg",
    category: "Festival Wear"
  },
  {
    name: "Boys Festive Wear",
    bengaliName: "ছেলেদের উৎসবের পোশাক",
    price: 1350,
    image: "/assets/kids_product/boy_festive1.jpg",
    category: "Festival Wear"
  },
  {
    name: "Traditional Sharee for Girls",
    bengaliName: "মেয়েদের ঐতিহ্যবাহী শাড়ি",
    price: 1500,
    image: "/assets/kids_product/girl_sharee1.jpg",
    category: "Traditional Wear"
  }
];

export default function KidsPage() {
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
        title: "Kids Collection",
        subtitle: "Authentic Bangladeshi Traditional Wear for Children",
        traditionalWear: "Traditional Wear",
        festivalWear: "Festival Wear"
      },
      bn: {
        title: "শিশুদের সংগ্রহ",
        subtitle: "আসল বাংলাদেশি ঐতিহ্যবাহী পোশাক শিশুদের জন্য",
        traditionalWear: "ঐতিহ্যবাহী পোশাক",
        festivalWear: "উৎসবের পোশাক"
      }
    };
    setTranslations(trans[lang as keyof typeof trans]);
  };

  return (
    <main style={{ marginTop: '80px' }}>
      <div className="section-header" style={{ paddingTop: '60px' }}>
        <h1 className={`${language === 'bn' ? 'bengali-text' : ''}`}>
          {translations.title || "Kids Collection"}
        </h1>
        <p className={`${language === 'bn' ? 'bengali-text' : ''}`}>
          {translations.subtitle || "Authentic Bangladeshi Traditional Wear for Children"}
        </p>
      </div>
      
      <section className="products-section" style={{ paddingTop: '40px' }}>
        <div className="product-grid">
          {kidsProducts.map((product, index) => (
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