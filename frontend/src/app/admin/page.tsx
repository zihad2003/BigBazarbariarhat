/* eslint-disable */
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type Product = {
  category: string;
  name: string;
  price: number;
  discount: number;
  freeShipping: boolean;
  image: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Omit<Product, 'image'> & { file?: File }>({
    category: 'men', name: '', price: 0, discount: 0, freeShipping: false, file: undefined,
  });

  useEffect(() => {
    try {
      setProducts(JSON.parse(localStorage.getItem('products') || '[]'));
    } catch {}
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const product: Product = {
        category: form.category,
        name: form.name,
        price: form.price,
        discount: form.discount,
        freeShipping: form.freeShipping,
        image: reader.result as string,
      };
      const next = [...products, product];
      setProducts(next);
      localStorage.setItem('products', JSON.stringify(next));
      setForm({ category: 'men', name: '', price: 0, discount: 0, freeShipping: false, file: undefined });
    };
    reader.readAsDataURL(form.file);
  };

  return (
    <main>
      <div className="page-header">
        <h2>Admin Panel</h2>
        <p>Add products</p>
      </div>
      <section className="admin-form">
        <form onSubmit={onSubmit}>
          <label>Category</label>
          <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="decor">Home Decor</option>
          </select>
          <label>Name</label>
          <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
          <label>Price</label>
          <input type="number" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: parseFloat(e.target.value || '0') }))} />
          <label>Discount %</label>
          <input type="number" value={form.discount} onChange={e => setForm(prev => ({ ...prev, discount: parseInt(e.target.value || '0') }))} />
          <label><input type="checkbox" checked={form.freeShipping} onChange={e => setForm(prev => ({ ...prev, freeShipping: e.target.checked }))} /> Free Shipping</label>
          <label>Image</label>
          <input type="file" accept="image/*" onChange={e => setForm(prev => ({ ...prev, file: e.target.files?.[0] }))} />
          <button type="submit">Add Product</button>
        </form>
      </section>
      <section className="admin-preview">
        <h3>Preview</h3>
        <div className="grid">
          {products.map((p, i) => (
            <div className="product-card" key={i}>
              {p.image.startsWith('data:') ? (
                 
                <img src={p.image} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              ) : (
                <Image src={p.image} alt={p.name} width={400} height={180} />
              )}
              <h4>{p.name}</h4>
              <p>৳ {p.price}</p>
              {p.discount > 0 && <span className="badge">-{p.discount}%</span>}
              {p.freeShipping && <span className="badge">Free Shipping</span>}
              <p><strong>Category:</strong> {p.category}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
