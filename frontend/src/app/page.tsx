'use client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

const featuredProducts = [
  {
    name: "Premium Panjabi Collection",
    bengaliName: "প্রিমিয়াম পাঞ্জাবি সংগ্রহ",
    price: 2800,
    image: "/assets/men_product/panjabi1.jpg",
    category: "Men's Wear"
  },
  {
    name: "Traditional Jamdani Sharee",
    bengaliName: "ঐতিহ্যবাহী জামদানি শাড়ি",
    price: 8500,
    image: "/assets/women_product/jamdani1.jpg",
    category: "Women's Wear"
  },
  {
    name: "Kids Festive Wear",
    bengaliName: "শিশুদের উৎসবের পোশাক",
    price: 1200,
    image: "/assets/kids_product/festive1.jpg",
    category: "Kids Wear"
  },
  {
    name: "Handwoven Nakshi Kantha",
    bengaliName: "হাতে বোনা নকশি কাঁথা",
    price: 3500,
    image: "/assets/home_decor_product/nakshi_kantha1.jpg",
    category: "Home Decor"
  }
];

export default function HomePage() {
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
        heroTitle: "Authentic Bangladeshi Craftsmanship",
        heroSubtitle: "Premium traditional wear and handcrafted items, made with love and heritage",
        ctaButton: "Shop Now",
        featuredTitle: "Featured Collection",
        featuredSubtitle: "Handpicked items that represent the best of Bangladeshi culture and craftsmanship"
      },
      bn: {
        heroTitle: "আসল বাংলাদেশি কারুকাজ",
        heroSubtitle: "প্রিমিয়াম ঐতিহ্যবাহী পোশাক ও হস্তনির্মিত সামগ্রী, ভালোবাসা ও ঐতিহ্য দিয়ে তৈরি",
        ctaButton: "এখনই কিনুন",
        featuredTitle: "বৈশিষ্ট্যযুক্ত সংগ্রহ",
        featuredSubtitle: "বাংলাদেশি সংস্কৃতি ও কারুকাজের সেরা প্রতিনিধিত্বকারী হাতে বাছাই করা আইটেম"
      }
    };
    setTranslations(trans[lang as keyof typeof trans]);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className={`${language === 'bn' ? 'bengali-text' : ''}`}>
            {translations.heroTitle || "Authentic Bangladeshi Craftsmanship"}
          </h1>
          <p className={`${language === 'bn' ? 'bengali-text' : ''}`}>
            {translations.heroSubtitle || "Premium traditional wear and handcrafted items, made with love and heritage"}
          </p>
          <a href="#products" className="cta-button">
            {translations.ctaButton || "Shop Now"}
          </a>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="products-section">
        <div className="section-header">
          <h2 className={`${language === 'bn' ? 'bengali-text' : ''}`}>
            {translations.featuredTitle || "Featured Collection"}
          </h2>
          <p className={`${language === 'bn' ? 'bengali-text' : ''}`}>
            {translations.featuredSubtitle || "Handpicked items that represent the best of Bangladeshi culture and craftsmanship"}
          </p>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h3 className={`${language === 'bn' ? 'bengali-text' : ''}`}>
            {language === 'bn' ? 'বিগ বাজার বাংলাদেশ' : 'Big Bazar Bangladesh'}
          </h3>
          <p className={`${language === 'bn' ? 'bengali-text' : ''}`}>
            {language === 'bn' 
              ? 'আসল বাংলাদেশি পণ্য এবং ঐতিহ্যবাহী কারুকাজ' 
              : 'Authentic Bangladeshi products and traditional craftsmanship'
            }
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Twitter">🐦</a>
          </div>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            © 2024 Big Bazar Bangladesh. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}