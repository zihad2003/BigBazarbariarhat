'use client';
import { useState, useEffect } from 'react';

interface CartItem {
  name: string;
  bengaliName?: string;
  price: number;
  image: string;
  qty: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<any>({});
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket'>('cod');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    loadTranslations(savedLang);
    loadCart();
    
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
        title: 'Shopping Cart',
        emptyCart: 'Your cart is empty',
        continueShopping: 'Continue Shopping',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        total: 'Total',
        checkout: 'Checkout',
        paymentMethod: 'Payment Method',
        cod: 'Cash on Delivery',
        bkash: 'bKash',
        nagad: 'Nagad',
        rocket: 'Rocket',
        quantity: 'Qty',
        remove: 'Remove'
      },
      bn: {
        title: 'শপিং কার্ট',
        emptyCart: 'আপনার কার্ট খালি',
        continueShopping: 'কেনাকাটা চালিয়ে যান',
        subtotal: 'সাবটোটাল',
        shipping: 'শিপিং',
        total: 'মোট',
        checkout: 'চেকআউট',
        paymentMethod: 'পেমেন্ট পদ্ধতি',
        cod: 'ক্যাশ অন ডেলিভারি',
        bkash: 'বিকাশ',
        nagad: 'নগদ',
        rocket: 'রকেট',
        quantity: 'পরিমাণ',
        remove: 'অপসারণ'
      }
    };
    setTranslations(trans[lang as keyof typeof trans]);
  };

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  const updateQuantity = (name: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(name);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.name === name ? { ...item, qty: newQty } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (name: string) => {
    const updatedCart = cart.filter(item => item.name !== name);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
      style: 'currency',
      currency: 'BDT'
    }).format(price);
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <main style={{ marginTop: '80px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <h1 className={`${language === 'bn' ? 'bengali-text' : ''}`}>
            {translations.title || 'Shopping Cart'}
          </h1>
          <p className={`${language === 'bn' ? 'bengali-text' : ''}`} style={{ margin: '20px 0' }}>
            {translations.emptyCart || 'Your cart is empty'}
          </p>
          <a href="/" className="cta-button">
            {translations.continueShopping || 'Continue Shopping'}
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ marginTop: '80px', minHeight: '80vh' }}>
      <div className="section-header" style={{ paddingTop: '60px' }}>
        <h1 className={`${language === 'bn' ? 'bengali-text' : ''}`}>
          {translations.title || 'Shopping Cart'}
        </h1>
      </div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
          {/* Cart Items */}
          <div>
            {cart.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '20px', 
                border: '1px solid var(--border-light)', 
                borderRadius: 'var(--border-radius)', 
                marginBottom: '20px' 
              }}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '20px' }}
                />
                <div style={{ flex: 1 }}>
                  <h3>{language === 'bn' && item.bengaliName ? item.bengaliName : item.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: '5px 0' }}>
                    {formatPrice(item.price)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <button 
                      onClick={() => updateQuantity(item.name, item.qty - 1)}
                      style={{ padding: '5px 10px', border: '1px solid var(--border-light)', background: 'white', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button 
                      onClick={() => updateQuantity(item.name, item.qty + 1)}
                      style={{ padding: '5px 10px', border: '1px solid var(--border-light)', background: 'white', cursor: 'pointer' }}
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeItem(item.name)}
                      style={{ marginLeft: '20px', background: 'var(--accent-red)', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      {translations.remove || 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div style={{ 
            background: 'var(--light-gray)', 
            padding: '30px', 
            borderRadius: 'var(--border-radius)', 
            height: 'fit-content' 
          }}>
            <h2 className={`${language === 'bn' ? 'bengali-text' : ''}`}>
              {translations.paymentMethod || 'Payment Method'}
            </h2>
            <div style={{ margin: '20px 0' }}>
              {[
                { id: 'cod', label: translations.cod || 'Cash on Delivery' },
                { id: 'bkash', label: translations.bkash || 'bKash' },
                { id: 'nagad', label: translations.nagad || 'Nagad' },
                { id: 'rocket', label: translations.rocket || 'Rocket' }
              ].map(method => (
                <label key={method.id} style={{ display: 'block', marginBottom: '10px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    style={{ marginRight: '10px' }}
                  />
                  {method.label}
                </label>
              ))}
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{translations.subtotal || 'Subtotal'}:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{translations.shipping || 'Shipping'}:</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '1.2rem', 
                fontWeight: 'bold',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '10px',
                marginTop: '10px'
              }}>
                <span>{translations.total || 'Total'}:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            
            <button className="cta-button" style={{ width: '100%', marginTop: '20px' }}>
              {translations.checkout || 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}