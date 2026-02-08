'use client';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';

const menProducts = [
  {
    name: "Premium Panjabi",
    bengaliName: "প্রিমিয়াম পাঞ্জাবি",
    price: 2800,
    image: "/assets/men_product/panjabi1.jpg",
    category: "Traditional Wear"
  },
  {
    name: "Designer Kurta",
    bengaliName: "ডিজাইনার কুর্তা",
    price: 2200,
    image: "/assets/men_product/kurta1.jpg",
    category: "Casual Wear"
  },
  {
    name: "Lungi Set",
    bengaliName: "লুঙ্গি সেট",
    price: 1200,
    image: "/assets/men_product/lungi1.jpg",
    category: "Traditional Wear"
  },
  {
    name: "Formal Shirt",
    bengaliName: "ফরমাল শার্ট",
    price: 1800,
    image: "/assets/men_product/formal1.jpg",
    category: "Formal Wear"
  },
  {
    name: "Cotton Panjabi",
    bengaliName: "তাঁতের পাঞ্জাবি",
    price: 1600,
    image: "/assets/men_product/cotton_panjabi1.jpg",
    category: "Handloom"
  },
  {
    name: "Eid Special Outfit",
    bengaliName: "ঈদের বিশেষ পোশাক",
    price: 3500,
    image: "/assets/men_product/eid_outfit1.jpg",
    category: "Festival Wear"
  }
];

export default function MenPage() {
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
        title: "Men's Collection",
        subtitle: "Premium traditional and modern wear for men",
        traditionalWear: "Traditional Wear",
        casualWear: "Casual Wear",
        formalWear: "Formal Wear",
        handloom: "Handloom",
        festivalWear: "Festival Wear"
      },
      bn: {
        title: "পুরুষদের সংগ্রহ",
        subtitle: "পুরুষদের জন্য প্রিমিয়াম ঐতিহ্যবাহী এবং আধুনিক পোশাক",
        traditionalWear: "ঐতিহ্যবাহী পোশাক",
        casualWear: "ক্যাজুয়াল পোশাক",
        formalWear: "ফরমাল পোশাক",
        handloom: "হাতে তৈরি",
        festivalWear: "উৎসবের পোশাক"
      }
    };
    setTranslations(trans[lang as keyof typeof trans]);
  };

  return (
    <main style={{ marginTop: '80px' }}>
      <div className="section-header" style={{ paddingTop: '60px' }}>
        <h1 className={`${language === 'bn' ? 'bengali-text' : ''}`}>
          {translations.title || "Men's Collection"}
        </h1>
        <p className={`${language === 'bn' ? 'bengali-text' : ''}`}>
          {translations.subtitle || "Premium traditional and modern wear for men"}
        </p>
      </div>
      
      <section className="products-section" style={{ paddingTop: '40px' }}>
        <div className="product-grid">
          {menProducts.map((product, index) => (
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