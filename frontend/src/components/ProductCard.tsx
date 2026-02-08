'use client';
import { useState, useEffect } from 'react';

interface Product {
  name: string;
  bengaliName?: string;
  price: number;
  image: string;
  category?: string;
}

export default function ProductCard({ name, bengaliName, price, image, category }: Product) {
  const [language, setLanguage] = useState('en');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    
    const handleLanguageChange = () => {
      const savedLang = localStorage.getItem('language') || 'en';
      setLanguage(savedLang);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.name === name);
    
    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
      cart.push({ name, bengaliName, price, image, category, qty: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'currency',
      currency: 'BDT'
    }).format(price);
  };

  return (
    <div className="product-card fade-in-up">
      <div style={{ overflow: 'hidden', borderRadius: 'var(--border-radius) var(--border-radius) 0 0' }}>
        <img 
          src={image} 
          alt={language === 'bn' && bengaliName ? bengaliName : name}
          className="product-image"
        />
      </div>
      <div className="product-info">
        {category && (
          <div className="product-category">{category}</div>
        )}
        <h3 className="product-name">{language === 'bn' && bengaliName ? bengaliName : name}</h3>
        {language === 'bn' && bengaliName && (
          <p className="product-name-bengali">{name}</p>
        )}
        <div className="product-price bdt-price">{formatPrice(price)}</div>
        <button 
          onClick={addToCart}
          className={`add-to-cart ${isAdded ? 'added' : ''}`}
          disabled={isAdded}
        >
          {isAdded ? (language === 'bn' ? 'যোগ করা হয়েছে!' : 'Added!') : (language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart')}
        </button>
      </div>
    </div>
  );
}