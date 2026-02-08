'use client';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';

const womenProducts = [
  {
    name: "Jamdani Sharee",
    bengaliName: "জামদানি শাড়ি",
    price: 8500,
    image: "/assets/women_product/jamdani1.jpg",
    category: "Heritage Collection"
  },
  {
    name: "Silk Benarasi",
    bengaliName: "সিল্ক বেনারসি",
    price: 12000,
    image: "/assets/women_product/benarasi1.jpg",
    category: "Wedding Collection"
  },
  {
    name: "Cotton Tangail",
    bengaliName: "তাঁতের টাঙ্গাইল",
    price: 4500,
    image: "/assets/women_product/tangail1.jpg",
    category: "Handloom Collection"
  },
  {
    name: "Katan Silk",
    bengaliName: "কাতান সিল্ক",
    price: 9500,
    image: "/assets/women_product/katan1.jpg",
    category: "Premium Collection"
  },
  {
    name: "Muslin Sharee",
    bengaliName: "মসলিন শাড়ি",
    price: 6500,
    image: "/assets/women_product/muslin1.jpg",
    category: "Heritage Collection"
  },
  {
    name: "Designer Salwar Kameez",
    bengaliName: "ডিজাইনার সালোয়ার কামিজ",
    price: 3800,
    image: "/assets/women_product/salwar1.jpg",
    category: "Modern Collection"
  }
];

export default function WomenPage() {
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
        title: "Women's Collection",
        subtitle: "Elegant traditional wear and modern designs for women",
        heritageCollection: "Heritage Collection",
        weddingCollection: "Wedding Collection",
        handloomCollection: "Handloom Collection",
        premiumCollection: "Premium Collection",
        modernCollection: "Modern Collection"
      },
      bn: {
        title: "নারীদের সংগ্রহ",
        subtitle: "নারীদের জন্য সুরুচিসম্পন্ন ঐতিহ্যবাহী পোশাক এবং আধুনিক ডিজাইন",
        heritageCollection: "ঐতিহ্য সংগ্রহ",
        weddingCollection: "বিয়ের সংগ্রহ",
        handloomCollection: "হাতে তৈরি সংগ্রহ",
        premiumCollection: "প্রিমিয়াম সংগ্রহ",
        modernCollection: "আধুনিক সংগ্রহ"
      }
    };
    setTranslations(trans[lang as keyof typeof trans]);
  };

  return (
    <main style={{ marginTop: '80px' }}>
      <div className="section-header" style={{ paddingTop: '60px' }}>
        <h1 className={`${language === 'bn' ? 'bengali-text' : ''}`}>
          {translations.title || "Women's Collection"}
        </h1>
        <p className={`${language === 'bn' ? 'bengali-text' : ''}`}>
          {translations.subtitle || "Elegant traditional wear and modern designs for women"}
        </p>
      </div>
      
      <section className="products-section" style={{ paddingTop: '40px' }}>
        <div className="product-grid">
          {womenProducts.map((product, index) => (
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