'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    loadTranslations(savedLang);
    
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total: number, item: any) => total + (item.qty || 1), 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const loadTranslations = (lang: string) => {
    const trans = {
      en: {
        home: 'Home',
        men: 'Men',
        women: 'Women',
        kids: 'Kids',
        homeDecor: 'Home Decor',
        cart: 'Cart'
      },
      bn: {
        home: 'হোম',
        men: 'পুরুষ',
        women: 'নারী',
        kids: 'শিশু',
        homeDecor: 'হোম ডেকোর',
        cart: 'কার্ট'
      }
    };
    setTranslations(trans[lang as keyof typeof trans]);
  };

  const switchLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    loadTranslations(lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new Event('languageChanged'));
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo">
          BIG BAZAR
        </Link>
        
        <nav className="nav-menu">
          <Link href="/">{translations.home || 'Home'}</Link>
          <Link href="/men">{translations.men || 'Men'}</Link>
          <Link href="/women">{translations.women || 'Women'}</Link>
          <Link href="/kids">{translations.kids || 'Kids'}</Link>
          <Link href="/home-decor">{translations.homeDecor || 'Home Decor'}</Link>
        </nav>
        
        <div className="header-actions">
          <div className="language-switcher">
            <button 
              className={language === 'en' ? 'active' : ''}
              onClick={() => switchLanguage('en')}
            >
              EN
            </button>
            <button 
              className={language === 'bn' ? 'active' : ''}
              onClick={() => switchLanguage('bn')}
            >
              BN
            </button>
          </div>
          
          <Link href="/cart" className="cart-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 2L6 6H3L5 20H19L21 6H18L15 2H9Z"/>
              <path d="M9 6V2H15V6"/>
            </svg>
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}