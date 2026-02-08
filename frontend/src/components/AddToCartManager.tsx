/* eslint-disable */
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AddToCartManager() {
  const [visible, setVisible] = useState(false);
  const [product, setProduct] = useState<{name: string; price: number; image: string} | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.add-to-cart') as HTMLElement | null;
      if (!btn) return;
      const name = btn.getAttribute('data-name') || '';
      const price = parseInt(btn.getAttribute('data-price') || '0', 10);
      const image = btn.getAttribute('data-image') || '';
      setProduct({ name, price, image });
      setQty(1);
      setVisible(true);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const confirm = () => {
    if (!product) return;
    let cart: any[] = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {}
    const existing = cart.find(item => item.name === product.name && item.image === product.image);
    if (existing) {
      existing.qty = (existing.qty || 1) + qty;
    } else {
      cart.push({ ...product, qty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setVisible(false);
  };

  return visible && product ? (
    <div className="popup-overlay" style={{ display: 'flex' }}>
      <div className="popup-box">
        <Image src={product.image} alt={product.name} width={400} height={200} />
        <h3 id="popup-name">{product.name}</h3>
        <p>৳<span id="popup-price">{product.price}</span></p>
        <input
          id="popup-qty"
          type="number"
          min={1}
          value={qty}
          onChange={e => setQty(parseInt(e.target.value || '1'))}
        />
        <div className="popup-actions">
          <button id="popup-cancel" className="cancel-btn" onClick={() => setVisible(false)}>Cancel</button>
          <button id="popup-confirm" className="confirm-btn" onClick={confirm}>Confirm</button>
        </div>
      </div>
    </div>
  ) : null;
}
